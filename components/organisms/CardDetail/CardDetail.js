import Link from 'next/link';
import Button from '@/components/atoms/Button/Button';
import Eyebrow from '@/components/atoms/Eyebrow/Eyebrow';
import PriceTag from '@/components/atoms/PriceTag/PriceTag';
import CardTile from '@/components/molecules/CardTile/CardTile';
import DmButton from '@/components/molecules/DmButton/DmButton';
import PhotoGallery from '@/components/molecules/PhotoGallery/PhotoGallery';
import SectionHeader from '@/components/molecules/SectionHeader/SectionHeader';
import ShowSummary from '@/components/molecules/ShowSummary/ShowSummary';
import { cta, inventory, links } from '@/content/copy';
import { gradeLabel } from '@/lib/format';
import { siteUrl } from '@/lib/site-url';
import styles from './CardDetail.module.css';

export default function CardDetail({ item, related, nextShow }) {
  const d = inventory.detail;
  const url = `${siteUrl()}/inventory/${item.id}`;
  const mailto = `${links.email}?subject=${encodeURIComponent(d.emailSubject(item.id, item.name))}&body=${encodeURIComponent(
    d.emailBody(item.id, item.name, url),
  )}`;
  const rows = [
    [d.set, item.year ? `${item.setName} (${item.year})` : item.setName],
    [d.grade, gradeLabel(item)],
    [d.language, inventory.filters.languages[item.language]],
    item.notes && [d.notes, item.notes],
  ].filter(Boolean);

  return (
    <div className={styles.page}>
      <Link href="/inventory" className={styles.back}>
        {cta.backToInventory}
      </Link>

      <div className={styles.main}>
        <PhotoGallery front={item.image} back={item.imageBack} alt={item.name} />

        <div className={styles.info}>
          <div className={styles.heading}>
            <Eyebrow>{d.item(item.id)}</Eyebrow>
            <h1 className={styles.name}>{item.name}</h1>
            <PriceTag price={item.price} variant="large" />
          </div>

          <dl className={styles.specs}>
            {rows.map(([k, v]) => (
              <div key={k} className={styles.spec}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>

          <div className={styles.ctas}>
            <DmButton id={item.id} name={item.name} />
            <Button href={mailto} variant="secondary" block>
              {cta.emailAboutCard}
            </Button>
          </div>

          {nextShow && (
            <Link href="/shows" className={styles.inPerson}>
              <Eyebrow tone="muted">{d.seeInPerson}</Eyebrow>
              <ShowSummary show={nextShow} />
            </Link>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className={styles.related} aria-labelledby="related-title">
          <SectionHeader id="related-title" title={d.moreFrom(item.setName)} />
          <div className={styles.relatedGrid}>
            {related.map((r) => (
              <CardTile key={r.id} item={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
