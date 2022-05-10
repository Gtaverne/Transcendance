import { useEffect, useState } from 'react';

//We Remove 72 to the height because of the size of the Header bar
function useWindowSize() {
  const [size, setSize] = useState([
    window.innerHeight - 75,
    window.innerWidth,
  ]);
  useEffect(() => {
    const handleResize = () => {
      setSize([window.innerHeight - 75, window.innerWidth]);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return size;
}
export default useWindowSize;
