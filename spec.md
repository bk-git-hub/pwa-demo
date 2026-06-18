# PWA Demo Project Spec

## Goal

Build a classroom-friendly Progressive Web App demo named `pwa-demo`.

Students should be able to clone the repo, deploy it to Netlify or Vercel, open it on mobile, install it as a PWA, and test native-like Web APIs such as camera, location, gallery/file picker, notifications, sharing, clipboard, and offline behavior.

The codebase must be clean, professional, modular, and easy for students to copy from. Each feature should be isolated enough that a student can reuse the camera module, location module, notification module, or gallery module in another project.

## Required Stack

- Vite
- React
- TypeScript
- CSS Modules or plain scoped CSS
- No backend required for the core demo
- No heavy UI framework
- Minimal dependencies only when they clearly improve teaching value

## Code Quality Rules

- Keep feature files under 100 lines when practical.
- Files up to 200 lines are allowed only when the feature genuinely needs it.
- Do not create a giant `App.tsx`.
- One Web API feature per folder.
- Separate browser API logic from React UI when it improves clarity.
- Use clear TypeScript types for API results, permission states, and errors.
- Prefer small named functions over clever abstractions.
- Use comments only to explain browser limitations, security requirements, or non-obvious API behavior.
- Every feature must handle unsupported browsers gracefully.
- Every feature must show success, error, loading, and permission states where relevant.
- All camera streams, event listeners, object URLs, and timers must be cleaned up.

## Recommended Folder Structure

```text
pwa-demo/
  public/
    icons/
      icon-192.png
      icon-512.png
      maskable-icon-512.png
    manifest.webmanifest
    sw.js
  src/
    app/
      App.tsx
      App.css
      routes.ts
    features/
      install/
        InstallCard.tsx
        useInstallPrompt.ts
      offline/
        OfflineCard.tsx
        networkStatus.ts
      camera/
        CameraCard.tsx
        camera.ts
      gallery/
        GalleryCard.tsx
        filePicker.ts
      location/
        LocationCard.tsx
        location.ts
      notifications/
        NotificationsCard.tsx
        notifications.ts
      push/
        PushCard.tsx
        push.ts
      clipboard/
        ClipboardCard.tsx
        clipboard.ts
      share/
        ShareCard.tsx
        share.ts
      storage/
        StorageCard.tsx
        storage.ts
      device/
        DeviceCard.tsx
        device.ts
      permissions/
        permissions.ts
    shared/
      components/
        ApiCard.tsx
        StatusPill.tsx
        PrimaryButton.tsx
        ResultBox.tsx
      hooks/
        useAsyncAction.ts
        useFeatureSupport.ts
      types/
        feature.ts
    pwa/
      registerServiceWorker.ts
      serviceWorkerMessages.ts
    main.tsx
    index.css
  README.md
  package.json
  vite.config.ts
```

## App Experience

The first screen should be the actual PWA demo, not a marketing landing page.

Use a simple dashboard layout:

- Header with app name, install status, and online/offline status.
- A short classroom-oriented intro.
- A grid/list of API demo cards.
- Each card includes:
  - API name
  - browser support status
  - permission status if applicable
  - one clear action button
  - result output
  - short limitation note

The UI should feel modern, calm, and practical. Avoid decorative complexity. This project is primarily a teaching artifact.

## Core PWA Features

### 1. Web App Manifest

Implement `public/manifest.webmanifest`.

Include:

- `name`
- `short_name`
- `description`
- `start_url`
- `scope`
- `display`
- `background_color`
- `theme_color`
- `icons`
- `shortcuts`
- `categories`

Students should be able to change app name, theme color, icons, and shortcuts during a 40-50 minute class.

### 2. App Icons

Provide placeholder icons in `public/icons`.

Required sizes:

- `192x192`
- `512x512`
- maskable `512x512`

Document where students can replace icons and which manifest fields reference them.

### 3. Service Worker

Implement a small, readable service worker in `public/sw.js`.

Required behavior:

- cache the app shell
- serve cached app shell while offline
- clean old caches on activation
- support a simple update flow

Keep it readable. Do not hide all service-worker behavior behind a large generated Workbox config unless there is a strong reason.

### 4. Service Worker Registration

Implement `src/pwa/registerServiceWorker.ts`.

Required behavior:

- register only in production or when explicitly enabled for local testing
- expose registration success/failure state
- detect an updated service worker
- allow the UI to show "Update available"

### 5. Install Prompt

Implement `features/install`.

Required behavior:

- detect `beforeinstallprompt` where supported
- provide a custom install button when available
- detect standalone display mode where practical
- explain that iOS install behavior is different and may not expose the same event

## Required Web API Feature Modules

### 1. Camera

Folder: `src/features/camera`

API:

- `navigator.mediaDevices.getUserMedia`

Demo behavior:

- request camera permission
- show live preview
- capture a still image to canvas or image preview
- stop camera stream

Required cleanup:

- stop all `MediaStreamTrack`s when closing camera or unmounting

Teaching notes:

- requires HTTPS except on localhost
- requires user permission
- camera availability differs by device and browser

### 2. Gallery and File Picker

Folder: `src/features/gallery`

APIs:

- `<input type="file" accept="image/*">`
- optional `window.showOpenFilePicker` when supported

Demo behavior:

- pick an image from gallery/files
- preview selected image
- show file name, type, and size
- revoke object URLs after use

Teaching notes:

- regular file input is the most compatible approach
- File System Access API is useful but not universal

### 3. Location / GPS

Folder: `src/features/location`

API:

- `navigator.geolocation.getCurrentPosition`
- optional `navigator.geolocation.watchPosition`

Demo behavior:

- request current location
- show latitude, longitude, accuracy, and timestamp
- optionally start/stop live watch mode

Required cleanup:

- clear active geolocation watch

Teaching notes:

- requires HTTPS except on localhost
- requires user permission
- may be blocked by browser settings or permissions policy

### 4. Notifications

Folder: `src/features/notifications`

APIs:

- `Notification.requestPermission`
- `ServiceWorkerRegistration.showNotification`

Demo behavior:

- request notification permission
- show a local notification through the service worker registration
- show current notification permission state

Teaching notes:

- must be triggered by a user action
- behavior differs across desktop, Android, and iOS
- notification permission should not be requested on page load

### 5. Push Notifications

Folder: `src/features/push`

APIs:

- `PushManager`
- `ServiceWorkerRegistration.pushManager`

Demo behavior:

- show whether Push API is supported
- explain that real push requires a backend and VAPID keys
- optionally include frontend subscription code behind a clearly marked "advanced" button

Important:

- Do not fake real remote push.
- If no backend is implemented, say so clearly in the UI and README.
- This module is an advanced teaching module, not a core working feature.

### 6. Clipboard

Folder: `src/features/clipboard`

API:

- `navigator.clipboard.writeText`
- optional `navigator.clipboard.readText` if appropriate

Demo behavior:

- copy demo text
- show copied result
- handle permission or browser errors

Teaching notes:

- requires HTTPS
- usually requires a user gesture
- read access is more restricted than write access

### 7. Web Share

Folder: `src/features/share`

API:

- `navigator.share`
- optional `navigator.canShare`

Demo behavior:

- share app title/text/url
- optionally share a selected file when supported

Teaching notes:

- strongest support is on mobile
- must be triggered by a user action
- provide clipboard fallback when unsupported

### 8. Permissions

Folder: `src/features/permissions`

API:

- `navigator.permissions.query`

Demo behavior:

- central helper for checking permission states
- support permission names such as `camera`, `geolocation`, `notifications`, and `clipboard-write` where supported
- return `unsupported` when the browser does not support a permission query

Teaching notes:

- Permissions API support is uneven
- some permission names are browser-specific

### 9. Online / Offline Status

Folder: `src/features/offline`

APIs:

- `navigator.onLine`
- `online` event
- `offline` event

Demo behavior:

- show current online/offline status
- update status live
- explain how to test offline behavior in browser devtools

Required cleanup:

- remove event listeners on unmount

### 10. Local Storage / IndexedDB

Folder: `src/features/storage`

APIs:

- `localStorage` for simple settings
- IndexedDB for structured demo records

Demo behavior:

- save a small note or API test history
- load it after refresh
- clear stored demo data

Teaching notes:

- use `localStorage` for tiny simple values
- use IndexedDB for larger structured data and files

## Optional Modern Web API Modules

These should be included only if the core modules remain clean and understandable.

### 1. Background Sync

API:

- `ServiceWorkerRegistration.sync`

Demo behavior:

- queue a fake action while offline
- sync it when online, if supported

Teaching notes:

- browser support is limited
- treat as progressive enhancement

### 2. App Badging

API:

- `navigator.setAppBadge`
- `navigator.clearAppBadge`

Demo behavior:

- set and clear an app icon badge

Teaching notes:

- works only in supported installed-app contexts

### 3. Device Orientation

API:

- `DeviceOrientationEvent`

Demo behavior:

- show basic tilt/orientation values
- include iOS permission request handling if needed

Teaching notes:

- permission behavior differs by browser
- useful for demonstrating sensor access

### 4. Vibration

API:

- `navigator.vibrate`

Demo behavior:

- trigger a short vibration pattern

Teaching notes:

- mostly mobile-oriented
- unsupported in many desktop browsers

### 5. Wake Lock

API:

- `navigator.wakeLock.request`

Demo behavior:

- keep screen awake while demo is active
- release wake lock manually and on visibility change

Teaching notes:

- support varies
- requires HTTPS

## Browser and Security Requirements

The app must clearly explain these rules:

- Most native-like Web APIs require HTTPS.
- `localhost` is usually treated as a secure context for local development.
- Netlify and Vercel provide HTTPS by default after deployment.
- Permissions should be requested only after a clear user action.
- Unsupported APIs should not break the app.
- Some APIs work differently on iOS Safari, Android Chrome, desktop Chrome/Edge, and Firefox.

## Type Patterns

Use shared types for feature states.

Suggested model:

```ts
type FeatureSupport = 'supported' | 'unsupported' | 'unknown';
type PermissionStateLabel = 'granted' | 'denied' | 'prompt' | 'unsupported' | 'unknown';

type FeatureResult<T> = {
  ok: boolean;
  data?: T;
  error?: string;
};
```

Do not over-engineer the type system. It should help students understand the code.

## UI Component Requirements

Create small reusable shared components:

- `ApiCard`
- `PrimaryButton`
- `StatusPill`
- `ResultBox`

These components should be generic and simple. They should not contain feature-specific browser API logic.

## README Requirements

The README must explain:

- what a PWA is
- how to install dependencies
- how to run locally
- how to build
- how to deploy to Netlify
- how to deploy to Vercel
- why HTTPS matters
- how to replace icons
- how to edit `manifest.webmanifest`
- which APIs work best on mobile
- which APIs are optional or browser-dependent
- why real push notifications need a backend

## Suggested Student Exercise Flow

The project should support a 40-50 minute class:

1. Clone the repository.
2. Run the app locally.
3. Deploy to Netlify or Vercel.
4. Open the deployed HTTPS URL on mobile.
5. Install the app.
6. Try camera, gallery, location, notification, share, clipboard, and offline demos.
7. Replace app icons.
8. Change app name, theme color, and shortcuts in the manifest.
9. Rebuild/redeploy and observe changes.

## Acceptance Criteria

The project is complete when:

- It builds successfully with `npm run build`.
- It runs locally with `npm run dev`.
- It deploys as a static app to Netlify and Vercel.
- The manifest is valid and linked from `index.html`.
- The service worker registers in production builds.
- The app works offline after first load.
- Each required Web API module is isolated in its own folder.
- Feature modules are easy to copy into another project.
- Unsupported APIs show a friendly explanation.
- Permission-denied states are handled cleanly.
- The codebase has no giant component files.
- Feature files stay under 100 lines where practical and under 200 lines unless strongly justified.

## Reference Documentation

- MDN Progressive Web Apps: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps
- web.dev Learn PWA: https://web.dev/learn/pwa/
- MDN Service Worker API: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
- MDN Push API: https://developer.mozilla.org/en-US/docs/Web/API/Push_API
- MDN getUserMedia: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
- MDN Geolocation API: https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API
