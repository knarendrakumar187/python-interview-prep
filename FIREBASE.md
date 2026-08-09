# Firebase setup (PyPrep)

1. Create a project at https://console.firebase.google.com
2. Add a **Web** app and copy the config into `.env.local` (see `.env.example`)
3. Enable **Authentication** → Sign-in method:
   - Google
   - Email/Password
4. Create **Firestore Database** (production mode)
5. Paste rules from `firestore.rules` into Firestore → Rules → Publish
6. Under Authentication → Settings → Authorized domains, add your Vercel domain
7. Restart `npm run dev` after saving `.env.local`

Progress is stored at `users/{uid}.progress` (completed questions, Core Subjects, bookmarks, notes).
