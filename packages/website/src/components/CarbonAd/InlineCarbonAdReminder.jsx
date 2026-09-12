import { useEffect, useState, useRef, useCallback, Suspense } from 'react'

const CarbonAd = () => {
  const [showReminder, setShowreminder] = useState(false);
  const [expand, setExpand] = useState(false)


  useEffect(() => {
    const verifyIsLoaded = () => {  
      const ads = document.getElementById('carbonads');
      if (!ads || ads.style.display === 'none' || !window._carbonads) {
        setShowreminder(true);
        setTimeout(() => setExpand(true), 16);
      }
    }
    setTimeout(verifyIsLoaded, 3000);
  }, []);

  const classname = expand ? 'reminder show' : 'reminder';

  return (
    <div key="placeholder" id="gentle-reminder" className={classname} style={{ height: expand ? undefined : 0 }}>
      {showReminder && (
        <>
        Do you like fabricJS?
        <br />
        If you want it continue running and you do not mind tech related ads,
        please allow this website in your adblocker.
        <br />
        The ad is actually smaller than this nag screen!
        <br />
        ❤️ Thank You!
      </>)}
    </div>
  );
}

export default CarbonAd
