import { useEffect } from 'react';

export default function OAuth2CallbackPage() {
  useEffect(() => {
    // Cookie is already set by backend, just redirect
    window.location.href = '/home';
  }, []);

  return null;
}
