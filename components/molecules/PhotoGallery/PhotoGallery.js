'use client';

import Image from 'next/image';
import { useState } from 'react';
import PhotoPlaceholder from '@/components/atoms/PhotoPlaceholder/PhotoPlaceholder';
import { inventory as copy } from '@/content/copy';
import styles from './PhotoGallery.module.css';

export default function PhotoGallery({ front, back, alt }) {
  const photos = [front && { src: front, label: copy.detail.front }, back && { src: back, label: copy.detail.back }].filter(Boolean);
  const [index, setIndex] = useState(0);
  const current = photos[index];

  return (
    <div className={styles.gallery}>
      <div className={styles.main}>
        {current ? (
          <Image src={current.src} alt={`${alt}, ${current.label.toLowerCase()}`} fill priority sizes="(min-width: 64rem) 560px, 100vw" className={styles.img} />
        ) : (
          <PhotoPlaceholder />
        )}
      </div>
      {photos.length > 1 && (
        <div className={styles.thumbs}>
          {photos.map((p, i) => (
            <button
              key={p.label}
              type="button"
              className={`${styles.thumb} ${i === index ? styles.on : ''}`}
              aria-pressed={i === index}
              aria-label={p.label}
              onClick={() => setIndex(i)}
            >
              <Image src={p.src} alt="" fill sizes="80px" className={styles.img} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
