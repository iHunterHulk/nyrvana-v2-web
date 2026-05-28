'use client';

import styles from './NoRouteCard.module.css';

export function NoRouteCard() {
  return (
    <div className={styles.noRouteCard}>
      <div className={styles.title}>No matching action found.</div>
      <div className={styles.subtitle}>Try a different query.</div>
    </div>
  );
}