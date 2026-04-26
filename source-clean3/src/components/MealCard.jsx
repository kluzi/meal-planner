// src/components/MealCard.jsx
import { useState, useRef } from 'react'
import { Tag } from './Tag'
import styles from './MealCard.module.css'

const StarIcon = () => (
  <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
    <path d="M5 1c0 0 .5 1.8 1.6 2.9C7.7 5 9.5 5.5 9.5 5.5S7.7 6 6.6 7.1C5.5 8.2 5 10 5 10S4.5 8.2 3.4 7.1C2.3 6 .5 5.5.5 5.5S2.3 5 3.4 3.9C4.5 2.8 5 1 5 1Z" fill="#0D9E82"/>
  </svg>
)

export function MealCard({ meal, di, si, onOpen, onSelect, onRegen, onValidate, onDrop }) {
  const [dragOver, setDragOver] = useState(false)
  const dragRef = useRef(null)

  // ── Carte vide ──
  if (!meal) {
    return (
      <div
        className={`${styles.card} ${styles.empty} ${dragOver ? styles.dragOver : ''}`}
        onClick={() => onSelect(di, si)}
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); onDrop?.(di, si) }}
      >
        <span className={styles.plus}>+</span>
      </div>
    )
  }

  // ── Suggestion IA en attente ──
  if (meal._ai && meal._aiPending) {
    return (
      <div
        className={`${styles.card} ${styles.aiPending}`}
        onClick={() => onOpen(meal, di, si)}
        draggable
        onDragStart={e => { e.dataTransfer.setData('text/plain', JSON.stringify({ di, si })) }}
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); onDrop?.(di, si) }}
      >
        <div className={styles.aiLabel}>
          <StarIcon /> Suggestion IA
        </div>
        <div className={styles.name}>{meal.name}</div>
        <div className={styles.aiActions}>
          <button
            className={styles.aiRegen}
            onClick={e => { e.stopPropagation(); onRegen(di, si) }}
          >↺ Autre idée</button>
          <button
            className={styles.aiValidate}
            onClick={e => { e.stopPropagation(); onValidate(di, si) }}
          >✓ Valider</button>
        </div>
      </div>
    )
  }

  // ── Carte normale ──
  return (
    <div
      ref={dragRef}
      className={`${styles.card} ${meal._ai ? styles.aiValidated : ''} ${dragOver ? styles.dragOver : ''}`}
      onClick={() => onOpen(meal, di, si)}
      draggable
      onDragStart={e => { e.dataTransfer.setData('text/plain', JSON.stringify({ di, si })) }}
      onDragOver={e => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      onDrop={e => { e.preventDefault(); setDragOver(false); onDrop?.(di, si) }}
    >
      <div className={styles.name}>{meal.name}</div>
      <div className={styles.bottom}>
        <div className={styles.tags}>
          {(meal.tags || []).map(t => <Tag key={t} tag={t} size="sm" />)}
        </div>
      </div>
    </div>
  )
}
