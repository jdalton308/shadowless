import Link from 'next/link';
import Eyebrow from '@/components/atoms/Eyebrow/Eyebrow';
import styles from './SectionHeader.module.css';

export default function SectionHeader({ eyebrow, title, as: Tag = 'h2', action, actionHref, aside, id }) {
  return (
    <div className={styles.header}>
      <div className={styles.text}>
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <Tag className={styles.title} id={id}>
          {title}
        </Tag>
      </div>
      {aside}
      {action && actionHref && (
        <Link className={styles.action} href={actionHref}>
          {action}
        </Link>
      )}
    </div>
  );
}
