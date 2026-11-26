import { formatPrice } from '@/lib/format';
import styles from './PriceTag.module.css';

/** variant: 'text' (magenta mono) | 'chip' (magenta fill) | 'large' */
export default function PriceTag({ price, variant = 'text' }) {
  return <span className={`${styles.price} ${styles[variant]}`}>{formatPrice(price)}</span>;
}
