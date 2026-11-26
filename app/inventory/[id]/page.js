import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import CardDetail from '@/components/organisms/CardDetail/CardDetail';
import { inventory, site } from '@/content/copy';
import { getInventory, getItem, getUpcomingShows } from '@/lib/data';
import { gradeLabel, formatPrice } from '@/lib/format';

export async function generateStaticParams() {
  const { items } = await getInventory();
  // Cache Components needs at least one param; '0' renders the not-found state.
  return items.length ? items.map((i) => ({ id: i.id })) : [{ id: '0' }];
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const item = await getItem(id);
  if (!item) return { title: inventory.detail.notFound };
  return {
    title: item.name,
    description: `${item.name} · ${gradeLabel(item)} · ${formatPrice(item.price)} · ${site.name}`,
    openGraph: item.image ? { images: [item.image] } : undefined,
  };
}

async function Detail({ params }) {
  const { id } = await params;
  const item = await getItem(id);
  if (!item) notFound();

  const [{ items }, [nextShow]] = await Promise.all([getInventory(), getUpcomingShows(1)]);
  const related = items.filter((i) => i.set === item.set && i.id !== item.id).slice(0, 5);
  return <CardDetail item={item} related={related} nextShow={nextShow} />;
}

export default function CardPage({ params }) {
  return (
    <div className="container">
      <Suspense fallback={<div className="page-placeholder" />}>
        <Detail params={params} />
      </Suspense>
    </div>
  );
}
