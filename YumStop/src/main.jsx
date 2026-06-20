import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { Provider } from 'react-redux';
import store from './redux/store.js';
import { SnackbarProvider } from 'notistack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Provide the Redux store to the application */}
    <Provider store={store}>
      {/* Provide the Snackbar context for notifications */}
      <SnackbarProvider autoHideDuration={3000}>
        {/* Provide the React Query client for data fetching and caching */}
        <QueryClientProvider client={queryClient}>
          {/* Render the main App component */}
          <App />
        </QueryClientProvider>
      </SnackbarProvider>
    </Provider>
  </StrictMode>,
)
