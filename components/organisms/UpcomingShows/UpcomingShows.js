import Button from '@/components/atoms/Button/Button';
import SectionHeader from '@/components/molecules/SectionHeader/SectionHeader';
import ShowSummary from '@/components/molecules/ShowSummary/ShowSummary';
import { cta, home } from '@/content/copy';
import styles from './UpcomingShows.module.css';

export default function UpcomingShows({ shows }) {
  return (
    <section className={styles.section} aria-labelledby="home-shows">
      <div className="container">
        <div className={styles.stack}>
          <SectionHeader id="home-shows" eyebrow={home.shows.eyebrow} title={home.shows.title} aside={<Button href="/shows" variant="secondary" className={styles.wideCta}>{cta.seeFullCalendar}</Button>} />
          {shows.length ? (
            <ul className={styles.list}>
              {shows.map((show) => (
                <li key={show.id} className={styles.item}>
                  <ShowSummary show={show} />
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.empty}>{home.shows.empty}</p>
          )}
          <Button href="/shows" variant="secondary" block className={styles.narrowCta}>
            {cta.seeFullCalendar}
          </Button>
        </div>
      </div>
    </section>
  );
}
