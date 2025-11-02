/**
 * Get the API base URL dynamically based on the current hostname.
 * This allows the app to work when accessed via localhost or network IP.
 */
export const getApiBaseUrl = () => {
  // If VITE_API_BASE is explicitly set, use it
  if (import.meta.env.VITE_API_BASE) {
    return import.meta.env.VITE_API_BASE;
  }

  // Otherwise, derive from current window location
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  const port = '5000'; // Backend port

  // Log for debugging
  console.log('🌐 API URL Detection:', {
    protocol,
    hostname,
    port,
    fullLocation: window.location.href
  });

  // If accessing via localhost, use localhost:5000
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    const url = `${protocol}//${hostname}:${port}`;
    console.log('📍 Using localhost API URL:', url);
    return url;
  }

  // For network IPs (including mobile), use the same hostname with backend port
  const url = `${protocol}//${hostname}:${port}`;
  console.log('📍 Using network API URL:', url);
  return url;
};

/**
 * Get the Socket.IO server URL (without the namespace path)
 */
export const getSocketUrl = () => {
  return getApiBaseUrl();
};
