import Image from 'next/image';
import Button from '@/components/atoms/Button/Button';
import SectionHeader from '@/components/molecules/SectionHeader/SectionHeader';
import { cta, home, links } from '@/content/copy';
import styles from './InstagramFeed.module.css';

/**
 * posts: [{ href, image, alt }]. Until an Instagram feed source is connected,
 * an empty list shows a follow panel instead of tiles.
 */
export default function InstagramFeed({ posts = [] }) {
  return (
    <section className={styles.section} aria-labelledby="home-instagram">
      <div className="container">
        <div className={styles.stack}>
          <SectionHeader
            id="home-instagram"
            title={home.instagram.title}
            aside={
              <a className={styles.follow} href={links.instagram} target="_blank" rel="noopener noreferrer">
                {cta.follow}
              </a>
            }
          />
          {posts.length ? (
            <div className={styles.grid}>
              {posts.slice(0, 4).map((p) => (
                <a key={p.href} href={p.href} target="_blank" rel="noopener noreferrer" className={styles.tile}>
                  <Image src={p.image} alt={p.alt || home.instagram.postAlt} fill sizes="(min-width: 64rem) 300px, 50vw" className={styles.img} />
                </a>
              ))}
            </div>
          ) : (
            <div className={styles.empty}>
              <p>{home.instagram.empty}</p>
              <Button href={links.instagram} variant="secondary">
                {cta.followOnInstagram}
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
