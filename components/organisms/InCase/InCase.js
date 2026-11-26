import Button from '@/components/atoms/Button/Button';
import CardTile from '@/components/molecules/CardTile/CardTile';
import SectionHeader from '@/components/molecules/SectionHeader/SectionHeader';
import StatCount from '@/components/molecules/StatCount/StatCount';
import { common, cta, home } from '@/content/copy';
import { formatShort } from '@/lib/dates';
import styles from './InCase.module.css';

export default function InCase({ items, total, updatedAt }) {
  return (
    <section className={styles.section} aria-labelledby="home-case">
      <div className="container">
        <div className={styles.stack}>
          <SectionHeader
            id="home-case"
            eyebrow={home.inCase.eyebrow}
            title={home.inCase.title}
            aside={<StatCount value={total} label={home.inCase.countLabel} sub={common.updated(formatShort(updatedAt))} />}
          />
          <div className={styles.grid}>
            {items.map((item) => (
              <CardTile key={item.id} item={item} sizes="(min-width: 64rem) 240px, 50vw" />
            ))}
          </div>
          <div className={styles.cta}>
            <Button href="/inventory">{cta.browseAll(total)}</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
