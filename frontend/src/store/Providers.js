'use client';

import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { hydrateAuth, setUser } from '../features/auth/authSlice';
import { API_URL } from '../lib/config';
import { store } from './store';

export default function Providers({ children }) {
  useEffect(() => {
    // This runs only in the browser because localStorage is not available on the server.
    // I use it to keep the user logged in after page refresh.
    const user = localStorage.getItem('user');
    const accessToken = localStorage.getItem('accessToken');

    // Put saved auth data back into Redux state.
    store.dispatch(hydrateAuth({
      user: user ? JSON.parse(user) : null,
      accessToken,
      refreshToken: localStorage.getItem('refreshToken')
    }));

    if (accessToken) {
      // Check with backend if the saved token is still valid.
      // If token is valid, backend returns the latest user data.
      fetch(`${API_URL}/api/auth/me`, {
        headers: { authorization: `Bearer ${accessToken}` }
      })
        .then((response) => (response.ok ? response.json() : null))
        .then((data) => {
          // Update Redux with fresh user data from backend.
          if (data?.data?.user) store.dispatch(setUser({ user: data.data.user }));
        })
        .catch(() => {});
    }
  }, []);

  // This makes Redux store available in the full frontend app.
  return <Provider store={store}>{children}</Provider>;
}
