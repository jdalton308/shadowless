import Image from 'next/image';
import Link from 'next/link';
import PriceTag from '@/components/atoms/PriceTag/PriceTag';
import PhotoPlaceholder from '@/components/atoms/PhotoPlaceholder/PhotoPlaceholder';
import { gradeLabel, setLabel } from '@/lib/format';
import styles from './CardTile.module.css';

export default function CardTile({ item, sizes = '(min-width: 64rem) 240px, 50vw', priority = false }) {
  return (
    <Link href={`/inventory/${item.id}`} className={styles.tile}>
      <div className={styles.photo}>
        {item.image ? (
          <Image src={item.image} alt={`${item.name}, ${gradeLabel(item)}`} fill sizes={sizes} className={styles.img} priority={priority} />
        ) : (
          <PhotoPlaceholder />
        )}
      </div>
      <div className={styles.meta}>
        <h3 className={styles.name}>{item.name}</h3>
        <p className={styles.set}>{setLabel(item)}</p>
        <p className={styles.grade}>{gradeLabel(item)}</p>
        <p className={styles.price}>
          <PriceTag price={item.price} />
        </p>
      </div>
    </Link>
  );
}
