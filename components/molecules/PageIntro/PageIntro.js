import Eyebrow from '@/components/atoms/Eyebrow/Eyebrow';
import styles from './PageIntro.module.css';

export default function PageIntro({ eyebrow, title, body }) {
  return (
    <div className={styles.intro}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className={styles.title}>{title}</h1>
      {body && <p className={styles.body}>{body}</p>}
    </div>
  );
}
