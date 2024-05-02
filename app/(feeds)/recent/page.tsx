'use client';

import Feed from '@/components/Feed';
import { useFeedProvider } from '@/providers/FeedProvider';
import { useEffect } from 'react';

const Recent = () => {
  const { feed, sortRecent } = useFeedProvider();

  useEffect(() => {
    if (feed.length) {
      sortRecent(feed);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feed]);

  return <Feed />;
};

export default Recent;
