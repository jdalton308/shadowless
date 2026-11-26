import PageIntro from '@/components/molecules/PageIntro/PageIntro';
import ShowCalendar from '@/components/organisms/ShowCalendar/ShowCalendar';
import { meta, shows as copy } from '@/content/copy';
import { getShows } from '@/lib/data';

export const metadata = { title: meta.showsTitle, description: copy.body };

export default async function ShowsPage() {
  const { shows, today } = await getShows();
  return (
    <div className="container">
      <PageIntro eyebrow={copy.eyebrow} title={copy.title} body={copy.body} />
      <ShowCalendar shows={shows} today={today} />
    </div>
  );
}
