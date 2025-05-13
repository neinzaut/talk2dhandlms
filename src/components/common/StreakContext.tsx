import React, { createContext, useContext, ReactNode } from 'react';

const StreakContext = createContext({ streakCount: 5, incrementStreak: () => {} });

export const StreakProvider = ({ children }: { children: ReactNode }) => {
  // Placeholder: always return 5 for streakCount
  const streakCount = 7;
  const incrementStreak = () => {};

  return (
    <StreakContext.Provider value={{ streakCount, incrementStreak }}>
      {children}
    </StreakContext.Provider>
  );
};

export const useStreak = () => useContext(StreakContext); 