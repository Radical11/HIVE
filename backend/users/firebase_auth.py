import firebase_admin
from firebase_admin import auth as firebase_auth, credentials
from rest_framework import authentication, exceptions
from django.conf import settings
from users.models import User, UserProfile

# Initialize Firebase Admin SDK (uses default credentials or service account)
import os

# Initialize Firebase Admin SDK (uses default credentials or service account)
if not firebase_admin._apps:
    try:
        # 1. Check for explicit service account in env (production/staging)
        if os.environ.get('GOOGLE_APPLICATION_CREDENTIALS'):
            cred = credentials.ApplicationDefault()
            firebase_admin.initialize_app(cred, {'projectId': 'hive-ecee0'})
        else:
            # 2. Local dev fallback: Use a mock credential to bypass ADC search.
            # This allows the app to initialize so verify_id_token can work (it only needs public keys).
            # We import here to avoid dependency issues if google-auth not installed (though it should be)
            from google.auth import credentials as google_credentials
            
            class MockProjectCredential(google_credentials.Credentials):
                def refresh(self, request):
                    self.token = "mock-token"
                    self.expiry = None
                
                def before_request(self, request, method, url, headers):
                    pass # Do not add auth headers

            cred = MockProjectCredential()
            firebase_admin.initialize_app(cred, {'projectId': 'hive-ecee0'})
            print("Firebase Admin initialized with Mock Credentials (Local Dev Mode)")
            
    except Exception as e:
        # Fallback for any initialization error
        print(f"Firebase Init Warning: {e}")
        try:
            if not firebase_admin._apps:
                firebase_admin.initialize_app(options={'projectId': 'hive-ecee0'})
        except Exception:
            pass


class FirebaseAuthentication(authentication.BaseAuthentication):
    """
    DRF authentication class that verifies Firebase ID tokens.
    Expects the Authorization header: Bearer <firebase_id_token>
    Auto-creates User + UserProfile on first login (JIT provisioning).
    """

    def authenticate(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        if not auth_header:
            return None

        parts = auth_header.split()
        if len(parts) != 2 or parts[0].lower() != 'bearer':
            return None

        token = parts[1]

        try:
            # Try verification with Admin SDK (requires credentials for signature check vs local keys)
            decoded = firebase_auth.verify_id_token(token)
        except (ValueError, Exception) as e:
            # Fallback: Verify via REST API if Admin SDK fails (e.g., missing local credentials)
            # This is slower (network call) but works without setup.
            try:
                import json
                import urllib.request
                from urllib.error import HTTPError
                
                # Check token validity with Google
                # Using tokeninfo endpoint which is public and doesn't need auth
                req = urllib.request.Request(f"https://oauth2.googleapis.com/tokeninfo?id_token={token}")
                try:
                    with urllib.request.urlopen(req) as response:
                        decoded = json.loads(response.read().decode())
                except HTTPError as e:
                    if e.code == 400:
                        raise exceptions.AuthenticationFailed('Invalid Firebase ID token.')
                    raise
                
                # Check audience
                if decoded.get('aud') != 'hive-ecee0':
                     raise exceptions.AuthenticationFailed('Token audience mismatch')
                
                # Map 'sub' to 'uid' to match SDK format
                decoded['uid'] = decoded['sub']
                
            except exceptions.AuthenticationFailed:
                raise
            except Exception as fallback_err:
                 # If both fail, log the original error but maybe return a simple 'Invalid token' to client
                 # unless it's a configuration error.
                print(f"Auth Error: SDK={str(e)}, REST={str(fallback_err)}")
                raise exceptions.AuthenticationFailed('Authentication failed.')

        # JIT user provisioning
        uid = decoded.get('uid')
        email = decoded.get('email', '')
        name = decoded.get('name', '')
        picture = decoded.get('picture', '')

        user, created = User.objects.get_or_create(
            username=uid,
            defaults={
                'email': email,
                'first_name': name.split(' ')[0] if name else '',
                'last_name': ' '.join(name.split(' ')[1:]) if name else '',
            }
        )

        if created:
            UserProfile.objects.create(
                user=user,
                avatar_url=picture,
                headline=f'{name} on Hive' if name else '',
            )
        elif not user.email and email:
            user.email = email
            user.save(update_fields=['email'])

        return (user, decoded)
