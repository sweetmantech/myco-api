'use client';
import { FeedFilter, FeedType } from '@/types/Feed';
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { SupabasePost } from '@/types/SupabasePost';
import findValidEmbed from '@/lib/findValidEmbed';
import fetchPosts from '@/lib/supabase/fetchPosts';
import mergeArraysUniqueByPostHash from '@/lib/mergeArraysUniqueByPostHash';
import { useNeynarProvider } from './NeynarProvider';
import { fetchPostsLimit } from '@/lib/consts';
import { supabaseClient } from '@/lib/supabase/client';
import fetchMetadata from '@/lib/fetchMetadata';
import { usePlayer } from '@/providers/audio/PlayerProvider';

type FeedProviderType = {
  filter: FeedFilter;
  updateFilter: (change: FeedFilter) => void;
  feed: SupabasePost[];
  feedType?: string;
  setFeedType: (feedType: string) => void;
  fetchMore: (start: number) => void;
  hasMore: boolean;
  handleNext: () => void;
  handlePrev: () => void;
};

const FeedContext = createContext<FeedProviderType>({} as any);

const FeedProvider = ({ children }: { children: ReactNode }) => {
  const [filter, setFilter] = useState<FeedFilter>({});
  const [feed, setFeed] = useState<SupabasePost[]>([]);
  const [feedType, setFeedType] = useState<string>();
  const [hasMore, setHasMore] = useState(true);
  const { user, loading: userLoading } = useNeynarProvider();
  const [player, dispatch] = usePlayer();
  const fid = user?.fid;

  useEffect(() => {
    if (userLoading) return;
    if (user) {
      setFeedType(FeedType.Following);
    } else {
      setFeedType(FeedType.Trending);
    }
  }, [userLoading, user]);

  const updateFilter = (change: FeedFilter) => {
    setFilter((prev) => ({ ...prev, ...change }));
  };

  const fetchMore = useCallback(
    async (start: number) => {
      if (!feedType) return;
      setHasMore(true);
      const { posts } = await fetchPosts(supabaseClient, filter, feedType, start, fid);
      if (!(posts && posts.length === fetchPostsLimit)) {
        setHasMore(false);
      }
      setFeed((prev) => {
        const mergedUnique = mergeArraysUniqueByPostHash(prev, posts);
        return mergedUnique;
      });
    },
    [feedType, filter, supabaseClient, fid],
  );

  useEffect(() => {
    const init = async () => {
      setFeed([]);
      await fetchMore(0);
    };
    init();
  }, [fetchMore]);

  const filteredFeed = useMemo(
    () =>
      feed.filter((cast) => {
        const channelId = cast.channelId;

        if (filter.channel) {
          if (!(channelId && channelId.includes(filter.channel))) return false;
        }

        const validEmbed = findValidEmbed(cast, { platform: filter.platform });
        if (!validEmbed) return false;

        return true;
      }),
    [feed, filter],
  );

  const handleNext = async () => {
    const feedIndex = feed.findIndex((feedObj: SupabasePost) => feedObj.id === player.feedId);
    if (feedIndex > -1) {
      if (feedIndex + 1 < feed.length) {
        const embed = findValidEmbed(feed[feedIndex + 1]);
        const feedObj = feed[feedIndex + 1];
        const url = embed?.url;
        if (url) {
          const metadata = await fetchMetadata(url, feedObj);
          if (metadata)
            dispatch({
              type: 'PLAY',
              payload: { metadata, feedId: feedObj.id },
            });
        }
      }
    }
  };

  const handlePrev = async () => {
    const feedIndex = feed.findIndex((feedObj: SupabasePost) => feedObj.id === player.feedId);
    if (feedIndex > -1) {
      if (feedIndex && feedIndex > 0) {
        const embed = findValidEmbed(feed[feedIndex - 1]);
        const feedObj = feed[feedIndex - 1];
        const url = embed?.url;
        if (url) {
          const metadata = await fetchMetadata(url, feedObj);
          dispatch({
            type: 'PLAY',
            payload: { metadata, feedId: feedObj.id },
          });
        }
      }
    }
  };

  const value = {
    filter,
    updateFilter,
    feed: filteredFeed,
    feedType,
    setFeedType,
    fetchMore,
    hasMore,
    handleNext,
    handlePrev,
  };

  return <FeedContext.Provider value={value}>{children}</FeedContext.Provider>;
};

export const useFeedProvider = () => {
  const context = useContext(FeedContext);
  if (!context) {
    throw new Error('useFeedProvider must be used within a FeedProvider');
  }
  return context;
};

export default FeedProvider;
