import { useEffect } from 'react';

// placeholder to reactify the code
export const FreeDrawingUI = () => {
  useEffect(() => {
    document.getElementById('drawing-line-width').value = '30';
    document.getElementById('drawing-color').value = '#76cef4';
    document.getElementById('drawing-shadow-color').value = '#5a7896';
    document.getElementById('drawing-shadow-width').value = '0';
    document.getElementById('drawing-shadow-offset').value = '0';
  }, []);
  return null;
};
