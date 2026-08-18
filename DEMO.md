Frontend demo instructions

This frontend has a standalone demo mode that does not require the backend.

Seeded test users (use email or username to login):

- username: admin, email: admin@example.com, password: 12345 (role: ADMIN)
- username: adamu, email: adamu@example.com, password: 12345 (role: CLIENT)

Seeded properties: 4 example properties are included for browsing and demoing UI.

How it works:

- Mock data is stored in `src/mock/data.js` and persisted to `localStorage` under demo keys.
- The mock API is implemented at `src/services/api.js` and mimics the same `get`/`post` shape used by the app.

To reset demo data in the browser, clear site `localStorage` for this app (Developer Tools → Application → Clear Storage).
