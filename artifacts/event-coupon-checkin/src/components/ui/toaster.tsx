import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster 
      position="bottom-right" 
      richColors 
      theme="light" 
      toastOptions={{
        className: 'font-sans border-0 shadow-lg',
      }}
    />
  );
}
