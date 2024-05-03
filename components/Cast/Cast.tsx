import { Cast as CastType } from '@/types/Cast';
import AuthorDetails from './AuthorDetails';
import Upvote from './Upvote';
import findValidEmbed from '@/lib/findValidEmbed';
import TipButton from '../Tipping/TipButton';
import { useMemo } from 'react';
import SpotifyEmbed from './SpotifyEmbed';
import SoundCloudEmbed from './SoundCloudEmbed';
import SoundXyzEmbed from './SoundXyzEmbed';
import { useFeedProvider } from '@/providers/FeedProvider';

const Cast = ({ cast = {} as CastType }: { cast: CastType }) => {
  const { filter } = useFeedProvider();
  const embed = findValidEmbed(cast);
  const url = embed?.url;

  const { author } = cast;
  const { verifications } = author;

  const EmbedComponent = useMemo(() => {
    if (!url) return null;
    if (url.includes('spotify')) return SpotifyEmbed;
    if (url.includes('soundcloud')) return SoundCloudEmbed;
    if (url.includes('sound.xyz')) return SoundXyzEmbed;
  }, [url]);

  const shouldBeFiltered = useMemo(() => {
    if (filter.channel) {
      const parentUrl = cast.parent_url;
      if (!(parentUrl && parentUrl.includes(filter.channel))) return false;
    }
    const validEmbed = findValidEmbed(cast, { platform: filter.platform });
    if (!validEmbed) return false;

    return true;
  }, [filter, cast]);

  if (!url) return <></>;

  return (
    <div className="flex items-center gap-5 p-2.5">
      <Upvote cast={cast} />
      <div className="w-full space-y-4">
        <AuthorDetails author={author} />
        <div className={`${shouldBeFiltered ? '' : 'hidden'}`}>
          {EmbedComponent && <EmbedComponent trackUrl={url} />}
        </div>
        <TipButton verifications={verifications} cast={cast} />
      </div>
    </div>
  );
};

export default Cast;
