import React from 'react';
import { SignIn, SignUp } from '@clerk/clerk-react';

export const ClerkSignInCard = ({ fallbackToggle }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <SignIn
        routing="hash"
        appearance={{
          elements: {
            rootBox: 'w-full shadow-none',
            card: 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md rounded-2xl p-6 sm:p-8',
            headerTitle: 'text-slate-900 dark:text-white font-bold text-xl',
            headerSubtitle: 'text-slate-500 dark:text-slate-400 text-sm',
            socialButtonsBlockButton: 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium rounded-xl',
            formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm py-2.5',
            formFieldInput: 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500',
            footerActionLink: 'text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 font-semibold',
            identityPreviewText: 'text-slate-700 dark:text-slate-300 font-medium',
          },
        }}
      />
      {fallbackToggle && (
        <button
          type="button"
          onClick={fallbackToggle}
          className="mt-4 text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
        >
          Or sign in with Institutional Demo ID
        </button>
      )}
    </div>
  );
};

export const ClerkSignUpCard = ({ fallbackToggle }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <SignUp
        routing="hash"
        appearance={{
          elements: {
            rootBox: 'w-full shadow-none',
            card: 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md rounded-2xl p-6 sm:p-8',
            headerTitle: 'text-slate-900 dark:text-white font-bold text-xl',
            headerSubtitle: 'text-slate-500 dark:text-slate-400 text-sm',
            socialButtonsBlockButton: 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium rounded-xl',
            formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm py-2.5',
            formFieldInput: 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500',
            footerActionLink: 'text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 font-semibold',
          },
        }}
      />
      {fallbackToggle && (
        <button
          type="button"
          onClick={fallbackToggle}
          className="mt-4 text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
        >
          Or register with institutional form
        </button>
      )}
    </div>
  );
};
