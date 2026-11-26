import Image from 'next/image';
import logo from '@/public/brand/logo.png';
import { site } from '@/content/copy';
import styles from './Logo.module.css';

export default function Logo({ size = 'md', priority = false }) {
  return <Image src={logo} alt={site.name} className={`${styles.logo} ${styles[size]}`} priority={priority} sizes="240px" />;
}
