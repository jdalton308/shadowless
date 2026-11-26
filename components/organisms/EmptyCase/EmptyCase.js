import Link from 'next/link';
import Button from '@/components/atoms/Button/Button';
import Eyebrow from '@/components/atoms/Eyebrow/Eyebrow';
import ShowSummary from '@/components/molecules/ShowSummary/ShowSummary';
import { common, cta, inventory, links } from '@/content/copy';
import styles from './EmptyCase.module.css';

/** Inventory page when nothing is listed. */
export default function EmptyCase({ nextShow }) {
  return (
    <div className={styles.empty}>
      <div className={styles.text}>
        <Eyebrow tone="muted">{inventory.empty.count}</Eyebrow>
        <h2 className={styles.title}>
          {inventory.empty.titleLines.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </h2>
        <p className={styles.body}>{inventory.empty.body}</p>
        <div className={styles.ctas}>
          <Button href="/shows">{cta.seeUpcomingShows}</Button>
          <Button href={links.instagram} variant="secondary">
            {cta.followOnInstagram}
          </Button>
        </div>
      </div>
      <div className={styles.panel}>
        {nextShow && (
          <>
            <Eyebrow tone="muted">{inventory.empty.nextShow}</Eyebrow>
            <Link href="/shows" className={styles.show}>
              <ShowSummary show={nextShow} />
            </Link>
          </>
        )}
        <p className={styles.dm}>
          {common.lookingForSomething} <a href={links.instagramDm}>{cta.dmUs}</a> {common.keepAnEyeOut}
        </p>
      </div>
    </div>
  );
}
