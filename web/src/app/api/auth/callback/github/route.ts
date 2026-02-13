import { redirect } from 'next/navigation';

export async function GET(request: Request) {
    // GitHub redirects here after installation.
    // The webhook handles the data syncing.
    // We redirect the user back to the feed to start posting!
    return redirect('/feed');
}
