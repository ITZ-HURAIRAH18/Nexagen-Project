# Mobile HTTPS Setup Guide

## Problem
When accessing `https://192.168.10.7:5173` from mobile:
- Browser shows certificate warning (self-signed cert)
- Google OAuth fails (domain not authorized)
- Backend API calls may fail (cert not trusted)

## Solutions

### Option 1: Quick Test (Email/Password Only)
**Time: 2 minutes**

1. On mobile browser, visit: `https://192.168.10.7:5173`
2. Click "Advanced" → "Proceed anyway" 
3. Visit: `https://192.168.10.7:5000`
4. Accept certificate warning again
5. Go back to frontend and login with email/password
6. **Note**: Google login won't work yet

---

### Option 2: Add Network IP to Google OAuth
**Time: 5 minutes**

1. Go to: https://console.cloud.google.com/apis/credentials
2. Select project, find OAuth 2.0 Client ID
3. Under **Authorized JavaScript origins**, add:
   ```
   https://192.168.10.7:5173
   ```
4. Under **Authorized redirect URIs**, add:
   ```
   https://192.168.10.7:5173
   ```
5. Save changes (may take 5-10 minutes to propagate)
6. Accept certificate on mobile as in Option 1

---

### Option 3: Install Trusted Certificates (Recommended)
**Time: 15 minutes**

Uses `mkcert` to create locally-trusted certificates.

#### 3.1 Install mkcert

**Windows:**
```bash
choco install mkcert
# or download from: https://github.com/FiloSottile/mkcert/releases
```

**Mac:**
```bash
brew install mkcert
```

**Linux:**
```bash
sudo apt install mkcert  # Debian/Ubuntu
sudo dnf install mkcert  # Fedora
```

#### 3.2 Install Local CA

```bash
mkcert -install
```

#### 3.3 Generate Certificates for Your Network IP

```bash
cd my-backend
mkcert localhost 127.0.0.1 192.168.10.7 ::1
```

This creates:
- `localhost+3.pem` (certificate)
- `localhost+3-key.pem` (private key)

#### 3.4 Update Backend to Use New Certificates

Edit `my-backend/server.js`:

```javascript
const sslOptions = {
  key: fs.readFileSync(new URL("./localhost+3-key.pem", import.meta.url)),
  cert: fs.readFileSync(new URL("./localhost+3.pem", import.meta.url)),
};
```

#### 3.5 Generate Frontend Certificates

```bash
cd ../frontend
mkcert localhost 127.0.0.1 192.168.10.7 ::1
```

Create `frontend/vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    https: {
      key: fs.readFileSync('./localhost+3-key.pem'),
      cert: fs.readFileSync('./localhost+3.pem'),
    },
  },
  define: {
    global: 'window',
  },
})
```

#### 3.6 Install Root CA on Mobile

**iOS:**
1. Transfer `rootCA.pem` from `$(mkcert -CAROOT)` to iPhone via AirDrop/email
2. Open the file → Install Profile
3. Settings → General → About → Certificate Trust Settings
4. Enable full trust for mkcert root CA

**Android:**
1. Transfer `rootCA.pem` to phone
2. Settings → Security → Encryption & credentials → Install a certificate
3. Select CA certificate
4. Browse and install `rootCA.pem`
5. Set screen lock if prompted

#### 3.7 Restart Servers

```bash
# Backend
cd my-backend
npm start

# Frontend (new terminal)
cd frontend
npm run dev
```

Now `https://192.168.10.7:5173` will show a green padlock on mobile!

---

### Option 4: Use Cloudflare Tunnel (Production-like)
**Time: 10 minutes**

1. Install cloudflared: https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/
2. Run tunnel:
   ```bash
   cloudflared tunnel --url http://localhost:5173
   ```
3. Use the generated `https://xxx.trycloudflare.com` URL on mobile
4. Update Google OAuth origins to include the tunnel URL

---

## Testing Checklist

After setup:
- [ ] Can access frontend on mobile without cert warning
- [ ] Can access backend API without cert warning
- [ ] Email/password login works
- [ ] Google OAuth login works
- [ ] Camera/microphone permissions work in meetings
- [ ] Socket.io connects successfully

---

## Current Setup Detection

Your current setup:
- Frontend: `https://192.168.10.7:5173` (Vite with `@vitejs/plugin-basic-ssl`)
- Backend: `https://192.168.10.7:5000` (Node HTTPS with `localhost.pem`)
- Google Client ID: `77809119535-r5ivv8inbitphbo2rcf5bik2d7grgf5g`

**Next Steps:**
1. Choose Option 1 for immediate testing (skip Google login)
2. Choose Option 3 for permanent dev solution
3. Choose Option 4 for sharing with external testers
