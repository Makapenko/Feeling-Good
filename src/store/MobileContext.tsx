import { createContext, useContext, useState, ReactNode } from 'react';

type MobileTab = 'today' | 'chapters' | 'activities' | 'calendar' | 'about';

interface MobileContextType {
  activeTab: MobileTab;
  setActiveTab: (tab: MobileTab) => void;
}

const MobileContext = createContext<MobileContextType | undefined>(undefined);

export const MobileProvider = ({ children }: { children: ReactNode }) => {
  const [activeTab, setActiveTab] = useState<MobileTab>('today');

  return (
    <MobileContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </MobileContext.Provider>
  );
};

export const useMobile = () => {
  const context = useContext(MobileContext);
  if (context === undefined) {
    throw new Error('useMobile must be used within a MobileProvider');
  }
  return context;
}; 
