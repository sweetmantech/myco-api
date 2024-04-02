import getFeed from '@/lib/neynar/getFeed';
import { useEffect, useState } from 'react';

const useFeed = () => {
  const [feed, setFeed] = useState<any[]>([]);

  useEffect(() => {
    const init = async () => {
      const response = await getFeed();
      console.log('SWEETRS response', response);
      setFeed(response);
    };
    init();
  }, []);

  return { feed };
};

export default useFeed;
