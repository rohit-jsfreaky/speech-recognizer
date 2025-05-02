import { createContext, useState, useContext, ReactNode } from 'react';

interface ErrorContextType {
  error: Error | null;
  setError: (error: Error | null) => void;
  clearError: () => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export function ErrorProvider({ children }: { children: ReactNode }) {
  const [error, setErrorState] = useState<Error | null>(null);
  
  const setError = (error: Error | null) => {
    setErrorState(error);
    
 
    if (error) {
      console.error('Application error:', error);
    }
  };
  
  const clearError = () => {
    setErrorState(null);
  };
  
  return (
    <ErrorContext.Provider value={{ error, setError, clearError }}>
      {children}
    </ErrorContext.Provider>
  );
}

export function useError() {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
}