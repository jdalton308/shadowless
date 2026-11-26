import Logo from '@/components/atoms/Logo/Logo';
import GradientRule from '@/components/atoms/GradientRule/GradientRule';
import NavLinks from '@/components/molecules/NavLinks/NavLinks';
import { nav, site } from '@/content/copy';
import styles from './SiteFooter.module.css';

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.row}>
          <div className={styles.brand}>
            <Logo />
            <p className={styles.tagline}>{site.tagline}</p>
          </div>
          <NavLinks label={nav.footerLabel} tone="muted" />
        </div>
        <GradientRule />
      </div>
    </footer>
  );
}
