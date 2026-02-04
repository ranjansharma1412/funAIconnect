import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/theme/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';
import ErrorBoundary from './src/utils/ErrorBoundary';
import ErrorModalProvider from './src/components/organisms/ErrorModalProvider';
// Import interceptors to initialize them
import './src/services/apiInterceptors';

const App = () => {
  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <ThemeProvider>
          <ErrorModalProvider>
            <AppNavigator />
          </ErrorModalProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
};

export default App;
