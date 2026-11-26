'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { links, nav } from '@/content/copy';
import styles from './NavLinks.module.css';

const ITEMS = [
  { href: '/inventory', label: nav.inventory },
  { href: '/shows', label: nav.shows },
];

export default function NavLinks({ label = nav.mainLabel, showInstagram = true, tone = 'bright' }) {
  const pathname = usePathname();
  return (
    <nav aria-label={label} className={`${styles.nav} ${styles[tone]}`}>
      {ITEMS.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link key={item.href} href={item.href} className={`${styles.link} ${active ? styles.active : ''}`} aria-current={active ? 'page' : undefined}>
            {item.label}
          </Link>
        );
      })}
      {showInstagram && (
        <a className={`${styles.link} ${styles.instagram}`} href={links.instagram} target="_blank" rel="noopener noreferrer">
          {nav.instagram} →
        </a>
      )}
    </nav>
  );
}
