import React from 'react';

import { ApiProvider } from './ApiProvider';
import { ToastProvider } from './ToastProvider';

const AppProvider: React.FC = ({ children }) => (
  <ApiProvider>
    <ToastProvider>{children}</ToastProvider>
  </ApiProvider>
);

export default AppProvider;
