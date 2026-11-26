import styles from './Eyebrow.module.css';

export default function Eyebrow({ as: Tag = 'p', tone = 'accent', children, className = '' }) {
  return <Tag className={`${styles.eyebrow} ${styles[tone]} ${className}`}>{children}</Tag>;
}
