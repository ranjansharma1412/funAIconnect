import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/theme/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';
import ErrorBoundary from './src/utils/ErrorBoundary';
import ErrorModalProvider from './src/components/organisms/ErrorModalProvider';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { startNetworkMonitoring } from './src/utils/networkUtils';
// Import interceptors to initialize them
import './src/services/apiInterceptors';

const App = () => {
  useEffect(() => {
    const unsubscribe = startNetworkMonitoring();
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <ThemeProvider>
          <Provider store={store}>
            <ErrorModalProvider>
              <AppNavigator />
            </ErrorModalProvider>
          </Provider>
        </ThemeProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
};

export default App;
