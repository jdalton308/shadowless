import Button from '@/components/atoms/Button/Button';
import CostStrip from '@/components/molecules/CostStrip/CostStrip';
import { cta, links } from '@/content/copy';
import styles from './ShowDetails.module.css';

export function showLocation(show) {
  return [show.venue, show.address, show.city].filter(Boolean).join(', ');
}

export function showPlace(show) {
  return [show.venue, [show.address, show.city].filter(Boolean).join(', ')].filter(Boolean).join(' · ');
}

export default function ShowDetails({ show, isPast }) {
  const where = showLocation(show);
  return (
    <div className={styles.details}>
      {where && <p className={styles.where}>{showPlace(show)}</p>}
      <CostStrip hours={show.hours} entry={show.entry} parking={show.parking} />
      {show.note && <p className={styles.note}>{show.note}</p>}
      {show.organizer && (
        <Button href={links.organizerInstagram(show.organizer)} block>
          {cta.organizerInstagram(show.organizer)}
        </Button>
      )}
      <div className={`${styles.secondary} ${isPast ? styles.one : ''}`}>
        {where && (
          <Button href={links.directions(where)} variant="secondary" size="sm">
            {cta.directions}
          </Button>
        )}
        {!isPast && (
          <Button href={`/api/shows/${show.id}/ics`} variant="secondary" size="sm" download>
            {cta.addToCalendar}
          </Button>
        )}
      </div>
    </div>
  );
}
