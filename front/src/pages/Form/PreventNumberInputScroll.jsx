import { useEffect } from 'react';

const PreventNumberInputScroll = () => {
  useEffect(() => {
    const handleWheel = (event) => {
      if (document.activeElement?.type === 'number') {
        document.activeElement.blur();
      }
    };

    document.addEventListener('wheel', handleWheel, { passive: true });

    return () => {
      document.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return null;
};

export default PreventNumberInputScroll;
