import React from 'react';
import { ClerkProvider } from '@clerk/clerk-react';

export const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '';

export const isClerkConfigured = Boolean(
  CLERK_PUBLISHABLE_KEY && CLERK_PUBLISHABLE_KEY.trim().startsWith('pk_')
);

export const ClerkProviderWrapper = ({ children }) => {
  if (!isClerkConfigured) {
    return <>{children}</>;
  }

  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY}
      afterSignOutUrl="/login"
    >
      {children}
    </ClerkProvider>
  );
};

export default ClerkProviderWrapper;
