import Cast from '../Cast';
import { Cast as CastType } from '@/types/Cast';
import Filter from './Filter';
import { useMemo, useState } from 'react';
import findValidEmbed from '@/lib/findValidEmbed';
import { FeedFilter } from '@/types/FeedFilter';

export default function Feed({ feed }: any) {
  const [filter, setFilter] = useState<FeedFilter>({});

  const handleFilterChange = (change: any) => {
    setFilter((prev) => ({ ...prev, ...change }));
  };

  const filteredFeed: any = useMemo(
    () => feed.filter((cast: CastType) => findValidEmbed(cast, { platform: filter.platform })),
    [filter.platform, feed],
  );

  return (
    <div className="w-full max-w-4xl flex items-start gap-10">
      <div className="flex-grow space-y-6">
        {filteredFeed.map((cast: CastType) => (
          <Cast key={cast.hash} cast={cast} />
        ))}
      </div>
      <Filter onChange={handleFilterChange} value={filter} />
    </div>
  );
}
