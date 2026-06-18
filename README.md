# pwa-demo

A classroom-friendly Progressive Web App demo for testing native-like Web APIs in a small React + TypeScript codebase.

Students can clone the repo, deploy it to Netlify or Vercel, open the HTTPS URL on mobile, install it as a PWA, and try camera, gallery, location, notifications, sharing, clipboard, storage, and offline behavior.

## What is a PWA?

A Progressive Web App is a web app that can progressively add app-like behavior: installability, offline support, home screen icons, service workers, and integration with supported browser APIs.

## Stack

- Vite
- React
- TypeScript
- Plain CSS
- No backend for the core demo
- Minimal dependencies

## Run locally

```bash
npm install
npm run dev
```

Open the local URL shown by Vite. `localhost` is treated as a secure context by most browsers, so HTTPS-only APIs such as camera and clipboard can be tested locally.

## Build

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

The service worker registers only in production builds by default. For local service-worker testing during development, open the app with `?sw=1`.

## Deploy to Netlify

1. Push the project to GitHub.
2. Create a new Netlify site from the repository.
3. Use `npm run build` as the build command.
4. Use `dist` as the publish directory.

Netlify serves the deployed site over HTTPS by default.

## Deploy to Vercel

1. Push the project to GitHub.
2. Import the repository in Vercel.
3. Keep the Vite defaults: build command `npm run build`, output directory `dist`.

Vercel serves the deployed site over HTTPS by default.

## Replace icons

Placeholder icons live in `public/icons`:

- `icon-192.png`
- `icon-512.png`
- `maskable-icon-512.png`

The manifest references those files in `public/manifest.webmanifest`. Replace the PNGs with your own artwork using the same filenames, or update the manifest `icons` paths.

## Edit the manifest

Open `public/manifest.webmanifest` to change:

- `name`
- `short_name`
- `description`
- `theme_color`
- `background_color`
- `icons`
- `shortcuts`

After changing the manifest, rebuild and redeploy. Installed apps may need to be reinstalled before icon/name changes appear.

## Why HTTPS matters

Most native-like browser APIs require a secure context:

- Camera
- Location
- Clipboard
- Notifications
- Service workers
- Wake Lock

`localhost` usually counts as secure for development. Netlify and Vercel provide HTTPS automatically after deployment.

## API support notes

Works best on mobile:

- Install prompt and standalone app behavior
- Camera
- Gallery picker
- Location
- Web Share
- Vibration

Browser-dependent or optional:

- Push API
- Notifications on iOS
- File System Access API
- Device Orientation permission flow
- Wake Lock
- App Badging

Real remote push notifications require a backend endpoint, a push subscription database, and VAPID keys. This project shows support detection only and does not fake remote push.

## Suggested class flow

1. Clone the repository.
2. Run the app locally.
3. Deploy to Netlify or Vercel.
4. Open the deployed HTTPS URL on mobile.
5. Install the app.
6. Try camera, gallery, location, notification, share, clipboard, and offline demos.
7. Replace app icons.
8. Change app name, theme color, and shortcuts in the manifest.
9. Rebuild and redeploy.
