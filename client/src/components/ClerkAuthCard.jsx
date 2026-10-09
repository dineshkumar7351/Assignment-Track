import React from 'react';
import { SignIn, SignUp } from '@clerk/clerk-react';

export const ClerkSignInCard = ({ fallbackToggle }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <SignIn
        routing="hash"
        appearance={{
          elements: {
            rootBox: 'w-full shadow-none',
            card: 'bg-white dark:bg-slate-900 border-0 shadow-none p-0 w-full',
            headerTitle: 'text-slate-900 dark:text-white font-black text-xl',
            headerSubtitle: 'text-slate-500 dark:text-slate-400 text-xs',
            socialButtonsBlockButton: 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold rounded-2xl py-2.5',
            formButtonPrimary: 'bg-[#104f37] hover:bg-[#0d3f2c] text-white font-bold rounded-full text-sm py-3 shadow-md shadow-emerald-950/20',
            formFieldInput: 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl focus:ring-2 focus:ring-emerald-600',
            footerActionLink: 'text-emerald-700 dark:text-emerald-400 hover:underline font-bold',
            identityPreviewText: 'text-slate-700 dark:text-slate-300 font-medium',
            dividerLine: 'bg-slate-200 dark:bg-slate-700',
            dividerText: 'text-slate-400 text-xs font-semibold',
          },
        }}
      />
      {fallbackToggle && (
        <button
          type="button"
          onClick={fallbackToggle}
          className="mt-4 text-xs text-[#104f37] dark:text-emerald-400 hover:underline font-bold cursor-pointer"
        >
          Or sign in with Institutional Email & Password
        </button>
      )}
    </div>
  );
};

export const ClerkSignUpCard = ({ fallbackToggle }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <SignUp
        routing="hash"
        appearance={{
          elements: {
            rootBox: 'w-full shadow-none',
            card: 'bg-white dark:bg-slate-900 border-0 shadow-none p-0 w-full',
            headerTitle: 'text-slate-900 dark:text-white font-black text-xl',
            headerSubtitle: 'text-slate-500 dark:text-slate-400 text-xs',
            socialButtonsBlockButton: 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold rounded-2xl py-2.5',
            formButtonPrimary: 'bg-[#104f37] hover:bg-[#0d3f2c] text-white font-bold rounded-full text-sm py-3 shadow-md shadow-emerald-950/20',
            formFieldInput: 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl focus:ring-2 focus:ring-emerald-600',
            footerActionLink: 'text-emerald-700 dark:text-emerald-400 hover:underline font-bold',
            identityPreviewText: 'text-slate-700 dark:text-slate-300 font-medium',
            dividerLine: 'bg-slate-200 dark:bg-slate-700',
            dividerText: 'text-slate-400 text-xs font-semibold',
          },
        }}
      />
      {fallbackToggle && (
        <button
          type="button"
          onClick={fallbackToggle}
          className="mt-4 text-xs text-[#104f37] dark:text-emerald-400 hover:underline font-bold cursor-pointer"
        >
          Or register with Institutional Student / Faculty Form
        </button>
      )}
    </div>
  );
};
