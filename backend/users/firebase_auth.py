import firebase_admin
from firebase_admin import auth as firebase_auth, credentials
from rest_framework import authentication, exceptions
from django.conf import settings
from users.models import User, UserProfile

# Initialize Firebase Admin SDK (uses default credentials or service account)
if not firebase_admin._apps:
    # In production, use a service account JSON file:
    # cred = credentials.Certificate('path/to/serviceAccountKey.json')
    # firebase_admin.initialize_app(cred)
    #
    # For dev, use Application Default Credentials or just project ID:
    firebase_admin.initialize_app(options={
        'projectId': 'hive-ecee0',
    })


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
            decoded = firebase_auth.verify_id_token(token)
        except firebase_auth.InvalidIdTokenError:
            raise exceptions.AuthenticationFailed('Invalid Firebase ID token.')
        except firebase_auth.ExpiredIdTokenError:
            raise exceptions.AuthenticationFailed('Firebase ID token has expired.')
        except Exception as e:
            raise exceptions.AuthenticationFailed(f'Firebase auth error: {str(e)}')

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
