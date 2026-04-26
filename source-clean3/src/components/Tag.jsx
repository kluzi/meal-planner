// src/components/Tag.jsx
import { TAG_META } from '../lib/constants'
import styles from './Tag.module.css'

export function Tag({ tag, size = 'sm' }) {
  const meta = TAG_META[tag]
  if (!meta) return null
  return (
    <span
      className={`${styles.tag} ${styles[meta.tcls]} ${styles[size]}`}
    >
      {meta.label}
    </span>
  )
}
