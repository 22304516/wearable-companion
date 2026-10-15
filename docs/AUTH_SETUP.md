# Authentication setup

**Status:** Supabase email/password integration is implemented; no Supabase project is connected in this repository snapshot.

## Configure a development project

1. Create a Supabase project in the account you intend to use.
2. In its dashboard, enable email/password authentication and choose whether new accounts must confirm their email.
3. Copy the project URL and **publishable** API key from the project’s API settings.
4. Copy `.env.example` to `.env` in the repository root and set:

   ```dotenv
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
   ```

5. Restart Expo after editing environment variables. Never put a service-role or secret key in an `EXPO_PUBLIC_` variable or the app bundle.

When both values are present, the app shows registration and sign-in before opening the simulator. Passwords must contain at least eight characters and the email field is checked before a request. If email confirmation is enabled and registration returns no session, the screen tells the user to confirm their address and sign in. Settings shows the signed-in email and provides sign-out. Supabase restores and refreshes the session.

When either value is absent, the app opens in clearly labelled, unauthenticated demo mode. This is only for synthetic samples; it is not a fallback account or authentication bypass for real data.

## Data and security boundary

- The app uses the Supabase **publishable** key. Publishable keys are client-visible; database access must be protected with Row Level Security (RLS) policies. Do not add a service-role/secret key to the app.
- This milestone authenticates accounts only. Reading history and preferences remain local AsyncStorage records, namespaced by the authenticated user ID. Nothing is uploaded to Supabase, and the app does not yet have a cloud database schema or RLS policies.
- Supabase's React Native quickstart uses AsyncStorage for session persistence. AsyncStorage is not encrypted. This is acceptable only for this synthetic-data prototype. Before storing real health or personal data, move sessions to a reviewed secure-storage design and implement/test database RLS, retention, account deletion, and privacy requirements.
- Email confirmation, SMTP delivery, password policy, allowed redirect URLs, and project region are controlled by the external project and have not been configured or verified here.
- Do not enter real health information. The simulator is not medical advice and is not connected to a wearable.

## References

- [Supabase React Native Auth quickstart](https://supabase.com/docs/guides/auth/quickstarts/react-native)
- [Supabase Expo user management guide](https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native)
- [Expo environment variables](https://docs.expo.dev/guides/environment-variables/)
