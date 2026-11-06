'use client';

import { Bounce, ToastContainer } from 'react-toastify';
import { useTheme } from '@/components/ToggleTheme';

export function ToastifyContainer() {
  const theme = useTheme();

  return (
    <ToastContainer
      position='top-center'
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={true}
      rtl={false}
      pauseOnFocusLoss
      pauseOnHover
      theme={theme}
      transition={Bounce}
    />
  );
}