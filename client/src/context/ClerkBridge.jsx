import React, { useEffect, useRef } from 'react';
import { useUser, useAuth, useClerk } from '@clerk/clerk-react';
import api from '../services/api';

export const ClerkBridge = ({ onSyncUser, onClerkSignOut, registerClerkSignOut }) => {
  const { user: clerkUser, isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const { signOut } = useClerk();

  const isSigningOutRef = useRef(false);

  useEffect(() => {
    if (registerClerkSignOut) {
      registerClerkSignOut(async () => {
        isSigningOutRef.current = true;
        try {
          await signOut();
        } catch (e) {
          console.warn('Clerk signOut error:', e);
        } finally {
          setTimeout(() => {
            isSigningOutRef.current = false;
          }, 1000);
        }
      });
    }
  }, [registerClerkSignOut, signOut]);

  useEffect(() => {
    if (!isLoaded || isSigningOutRef.current) return;

    if (isSignedIn && clerkUser) {
      let isMounted = true;

      const syncWithBackend = async () => {
        try {
          const token = await getToken();
          if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            localStorage.setItem('token', token);
          }

          const response = await api.post('/auth/clerk-sync', {
            clerkId: clerkUser.id,
            email: clerkUser.primaryEmailAddress?.emailAddress,
            fullName: clerkUser.fullName || `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'Academic Scholar',
            profileImage: clerkUser.imageUrl || '',
          });

          if (isMounted && response.data?.success && response.data.user) {
            const syncedUser = response.data.user;
            localStorage.setItem('user', JSON.stringify(syncedUser));
            if (response.data.token) {
              localStorage.setItem('token', response.data.token);
              api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
            }
            onSyncUser(syncedUser, response.data.token || token);
          }
        } catch (error) {
          console.warn('Clerk backend synchronization notice:', error.message);
        }
      };

      syncWithBackend();

      return () => {
        isMounted = false;
      };
    } else if (isLoaded && !isSignedIn) {
      if (onClerkSignOut) {
        onClerkSignOut();
      }
    }
  }, [isLoaded, isSignedIn, clerkUser, getToken, onSyncUser, onClerkSignOut]);

  return null;
};

export default ClerkBridge;
