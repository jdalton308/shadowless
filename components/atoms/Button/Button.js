import Link from 'next/link';
import styles from './Button.module.css';

/**
 * One button style for links and buttons.
 * variant: 'primary' (magenta, one per view) | 'secondary' (aqua outline) | 'ghost'
 */
export default function Button({ href, variant = 'primary', block = false, size, className = '', children, ...rest }) {
  const cls = [styles.button, styles[variant], block && styles.block, size === 'sm' && styles.sm, className]
    .filter(Boolean)
    .join(' ');

  if (href) {
    const external = /^(https?:|mailto:|tel:)/.test(href) || 'download' in rest;
    if (external) {
      return (
        <a className={cls} href={href} {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest}>
          {children}
        </a>
      );
    }
    return (
      <Link className={cls} href={href} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={cls} {...rest}>
      {children}
    </button>
  );
}
