import Buying from '@/components/organisms/Buying/Buying';
import Hero from '@/components/organisms/Hero/Hero';
import InCase from '@/components/organisms/InCase/InCase';
import InstagramFeed from '@/components/organisms/InstagramFeed/InstagramFeed';
import UpcomingShows from '@/components/organisms/UpcomingShows/UpcomingShows';
import { getInventory, getUpcomingShows } from '@/lib/data';
import { sortItems } from '@/lib/inventory-filters';

export default async function HomePage() {
  const [{ items, updatedAt }, shows] = await Promise.all([getInventory(), getUpcomingShows(3)]);
  const preview = sortItems(items, 'new-desc').slice(0, 5);

  return (
    <>
      <Hero />
      <UpcomingShows shows={shows} />
      {items.length > 0 && <InCase items={preview} total={items.length} updatedAt={updatedAt} />}
      <Buying />
      <InstagramFeed posts={[]} />
    </>
  );
}
