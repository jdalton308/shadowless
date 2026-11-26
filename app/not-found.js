import Button from '@/components/atoms/Button/Button';
import PageIntro from '@/components/molecules/PageIntro/PageIntro';
import { cta, notFound } from '@/content/copy';

export default function NotFound() {
  return (
    <div className="container page-end">
      <PageIntro eyebrow="404" title={notFound.title} body={notFound.body} />
      <Button href="/inventory">{cta.browseInventory}</Button>
    </div>
  );
}
