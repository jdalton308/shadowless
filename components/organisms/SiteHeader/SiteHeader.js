import Link from 'next/link';
import Logo from '@/components/atoms/Logo/Logo';
import NavLinks from '@/components/molecules/NavLinks/NavLinks';
import { nav } from '@/content/copy';
import styles from './SiteHeader.module.css';

export default function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" aria-label={nav.home} className={styles.home}>
          <Logo priority />
        </Link>
        <NavLinks />
      </div>
    </header>
  );
}
