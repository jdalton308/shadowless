import Button from '@/components/atoms/Button/Button';
import Eyebrow from '@/components/atoms/Eyebrow/Eyebrow';
import { cta, home, links } from '@/content/copy';
import styles from './Buying.module.css';

export default function Buying() {
  return (
    <section className={styles.section} aria-labelledby="home-buying">
      <div className={`container ${styles.grid}`}>
        <div className={styles.text}>
          <Eyebrow>{home.buying.eyebrow}</Eyebrow>
          <h2 id="home-buying" className={styles.title}>
            {home.buying.title}
          </h2>
          <p className={styles.body}>{home.buying.body}</p>
        </div>
        <ul className={styles.rows}>
          {home.buying.rows.map((row) => (
            <li key={row.label} className={styles.row}>
              <span className={styles.label}>{row.label}</span>
              <span className={styles.detail}>{row.detail}</span>
            </li>
          ))}
        </ul>
        <div className={styles.ctas}>
          <Button href={links.instagramDm}>{cta.dmOnInstagram}</Button>
          <Button href={links.email} variant="secondary">
            {cta.email}
          </Button>
        </div>
      </div>
    </section>
  );
}
