import PageIntro from '@/components/molecules/PageIntro/PageIntro';
import EmptyCase from '@/components/organisms/EmptyCase/EmptyCase';
import InventoryBrowser from '@/components/organisms/InventoryBrowser/InventoryBrowser';
import { common, inventory, meta } from '@/content/copy';
import { getInventory, getUpcomingShows } from '@/lib/data';
import { formatShort } from '@/lib/dates';

export const metadata = { title: meta.inventoryTitle, description: inventory.body };

export default async function InventoryPage() {
  const [{ items, updatedAt }, [nextShow]] = await Promise.all([getInventory(), getUpcomingShows(1)]);

  return (
    <div className="container page-end">
      <PageIntro eyebrow={`${inventory.eyebrow} · ${common.updated(formatShort(updatedAt, { month: 'short', day: 'numeric', year: 'numeric' }))}`} title={inventory.title} body={inventory.body} />
      {items.length ? <InventoryBrowser items={items} /> : <EmptyCase nextShow={nextShow} />}
    </div>
  );
}
