import Button from '@/components/atoms/Button/Button';
import CornerStripes from '@/components/atoms/CornerStripes/CornerStripes';
import Eyebrow from '@/components/atoms/Eyebrow/Eyebrow';
import { cta, home } from '@/content/copy';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <CornerStripes />
      <div className={`container ${styles.inner}`}>
        <Eyebrow>{home.hero.eyebrow}</Eyebrow>
        <h1 className={styles.title}>
          {home.hero.titleLines.map((line) => (
            <span key={line} className={styles.line}>
              {line}
            </span>
          ))}
        </h1>
        <p className={styles.body}>{home.hero.body}</p>
        <div className={styles.ctas}>
          <Button href="/inventory">{cta.browseInventory}</Button>
          <Button href="/shows" variant="secondary">
            {cta.seeShowDates}
          </Button>
        </div>
      </div>
    </section>
  );
}
