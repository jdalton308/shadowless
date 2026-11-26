import styles from './FilterGroup.module.css';

export default function FilterGroup({ title, aside, help, children, as: Tag = 'h3' }) {
  return (
    <section className={styles.group}>
      <div className={styles.head}>
        <Tag className={styles.title}>{title}</Tag>
        {aside}
      </div>
      {children}
      {help && <p className={styles.help}>{help}</p>}
    </section>
  );
}
