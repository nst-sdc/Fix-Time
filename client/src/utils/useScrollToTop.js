import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Custom hook to scroll to top on route changes
export const useScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
};

// Function to scroll to top immediately
export const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Function to navigate and scroll to top
export const navigateToTop = (navigate, path) => {
  navigate(path);
  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 100);
}; 