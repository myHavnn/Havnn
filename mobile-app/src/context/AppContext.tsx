// AppContext.tsx
import React, { createContext, ReactNode, useContext, useState } from "react";

interface AppContextType {
  feedSelected: string;
  changeFeedSelected: (selected: string) => void;
}

// Creating the context with a default value
const AppContext = createContext<AppContextType | undefined>(undefined);

// Define the type for the provider props
interface AppProviderProps {
  children: ReactNode;
}

// Create a provider component
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [feedSelected, setFeedSelected] = useState<string>("Most Commented");

  const changeFeedSelected = (selected: string) => {
    setFeedSelected(selected);
  };

  return (
    <AppContext.Provider value={{ feedSelected, changeFeedSelected }}>
      {children}
    </AppContext.Provider>
  );
};

// Hook to use the app context
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within a AppProvider");
  }
  return context;
};
