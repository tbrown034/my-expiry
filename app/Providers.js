'use client';

import { Suspense } from 'react';
import { GroceryProvider, ToastProvider, ModalProvider } from './context';

// ModalProvider uses useSearchParams which requires Suspense boundary
function ModalProviderWithSuspense({ children }) {
  return (
    <Suspense fallback={null}>
      <ModalProvider>{children}</ModalProvider>
    </Suspense>
  );
}

export default function Providers({ children }) {
  return (
    <GroceryProvider>
      <ToastProvider>
        <ModalProviderWithSuspense>
          {children}
        </ModalProviderWithSuspense>
      </ToastProvider>
    </GroceryProvider>
  );
}
