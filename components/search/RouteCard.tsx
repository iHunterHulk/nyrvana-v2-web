'use client';

import styles from './RouteCard.module.css';

interface RouteCardProps {
  adapter: string;
  op: string;
}

export function RouteCard({ adapter, op }: RouteCardProps) {
  return (
    <div className={styles.routeCard}>
      <div className={styles.title}>Routed to</div>
      <div className={styles.adapterInfo}>{adapter}.{op}</div>
    </div>
  );
}