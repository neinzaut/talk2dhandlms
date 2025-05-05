import { useEffect, useState } from 'react';
import { Storage } from '../utils/storage';

export const useStreak = () => {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [lastCompletedDate, setLastCompletedDate] = useState<string | null>(null);

  useEffect(() => {
    const loadStreak = async () => {
      const streak = await Storage.getItem('current-streak');
      const lastDate = await Storage.getItem('last-completed-date');
      
      setCurrentStreak(streak ? parseInt(streak) : 0);
      setLastCompletedDate(lastDate);
    };
    
    loadStreak();
  }, []);

  const incrementStreak = async () => {
    const today = new Date().toISOString().split('T')[0];
    let newStreak = currentStreak;
    
    // Check if user already completed today
    if (lastCompletedDate !== today) {
      // Check if yesterday was completed (for streak continuation)
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      newStreak = lastCompletedDate === yesterdayStr ? currentStreak + 1 : 1;
      
      await Storage.setItem('current-streak', newStreak.toString());
      await Storage.setItem('last-completed-date', today);
      
      setCurrentStreak(newStreak);
      setLastCompletedDate(today);
    }
    
    return newStreak;
  };

  return { currentStreak, incrementStreak };
};