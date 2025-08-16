import { useState, useEffect } from 'react';

const READ_NEWS_KEY = 'readNews';

export const useReadNews = () => {
  const [readNewsIds, setReadNewsIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    // Load read news from localStorage
    const stored = localStorage.getItem(READ_NEWS_KEY);
    if (stored) {
      try {
        const parsedIds = JSON.parse(stored);
        setReadNewsIds(new Set(parsedIds));
      } catch (error) {
        console.warn('Error parsing read news from localStorage:', error);
      }
    }
  }, []);

  const markAsRead = (newsId: number) => {
    setReadNewsIds(prev => {
      const newSet = new Set(prev);
      newSet.add(newsId);
      
      // Save to localStorage
      localStorage.setItem(READ_NEWS_KEY, JSON.stringify(Array.from(newSet)));
      
      return newSet;
    });
  };

  const isRead = (newsId: number) => readNewsIds.has(newsId);

  return {
    markAsRead,
    isRead,
    readNewsIds
  };
};