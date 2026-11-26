import { common } from '@/content/copy';
import styles from './PhotoPlaceholder.module.css';

export default function PhotoPlaceholder({ label = common.photoComing }) {
  return <div className={styles.placeholder}>{label}</div>;
}
