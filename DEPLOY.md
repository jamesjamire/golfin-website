# GOLFIN Website — Deployment Guide

## Local Development

```bash
cd golfin-website
cp .env.local.example .env.local   # fill in your Firebase credentials
npm install
npm run dev                         # → http://localhost:3000
```

Admin panel: http://localhost:3000/admin
Default password: `golf2025admin`

---

## Firebase Setup (Database + Storage)

1. Go to https://console.firebase.google.com
2. Create a new project (e.g. `golfin-website`)
3. Enable **Firestore Database** (start in test mode)
4. Enable **Storage** (start in test mode)
5. Go to Project Settings → Your apps → Web app → Add app
6. Copy the config values into `.env.local`

### Firestore Security Rules (paste in Firebase console)
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /content/{document} {
      allow read: if true;
      allow write: if false; // Only server-side writes allowed
    }
  }
}
```

### Storage Rules
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if false; // Only server-side uploads allowed
    }
  }
}
```

---

## Google Cloud Run Deployment

### Prerequisites
1. Install [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)
2. Create a Google Cloud project at https://console.cloud.google.com
3. Enable billing on your project

### Step 1: Authenticate
```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

### Step 2: Enable required APIs
```bash
gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  containerregistry.googleapis.com
```

### Step 3: Manual Deploy (one-time)
```bash
# Build and push the Docker image
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/golfin-website

# Deploy to Cloud Run
gcloud run deploy golfin-website \
  --image gcr.io/YOUR_PROJECT_ID/golfin-website \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --port 3000 \
  --memory 512Mi \
  --set-env-vars "ADMIN_PASSWORD=golf2025admin,NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_KEY,NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_DOMAIN,NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT,NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_BUCKET,NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER,NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID"
```

### Step 4: Automated CI/CD via Cloud Build (optional)
Connect your GitHub repo to Cloud Build for auto-deploy on every push:

1. Go to https://console.cloud.google.com/cloud-build/triggers
2. Click **Connect Repository** → Select GitHub → authorize
3. Select `golfin-website` repo
4. Create a trigger:
   - Event: Push to branch `master`
   - Build configuration: `cloudbuild.yaml`
5. Add substitution variables for all `_FIREBASE_*` values

Your site will auto-deploy on every `git push`. The Cloud Run URL will look like:
`https://golfin-website-XXXXXXXX-uc.a.run.app`

---

## Changing the Admin Password

Set the `ADMIN_PASSWORD` environment variable in Cloud Run:
```bash
gcloud run services update golfin-website \
  --region us-central1 \
  --update-env-vars ADMIN_PASSWORD=your_new_password
```
