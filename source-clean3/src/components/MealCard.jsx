// src/components/MealCard.jsx
import { useState } from 'react'
import { Tag } from './Tag'
import styles from './MealCard.module.css'

const StarIcon = () => (
  <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
    <path d="M5 1c0 0 .5 1.8 1.6 2.9C7.7 5 9.5 5.5 9.5 5.5S7.7 6 6.6 7.1C5.5 8.2 5 10 5 10S4.5 8.2 3.4 7.1C2.3 6 .5 5.5.5 5.5S2.3 5 3.4 3.9C4.5 2.8 5 1 5 1Z" fill="#0D9E82"/>
  </svg>
)

const KidIcon = () => (
  <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
    <path d="M12 2a5 5 0 100 10A5 5 0 0012 2zM4 20a8 8 0 0116 0" stroke="#3543C4" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

function MealPart({ meal, isKid, onRegen, onValidate, di, si }) {
  if (!meal) return null
  const isPending = meal._ai && meal._aiPending

  return (
    <div className={`${styles.part} ${isKid ? styles.kidPart : ''} ${isPending ? styles.aiPending : ''}`}>
      {isPending && (
        <div className={styles.aiLabel}>
          <StarIcon /> Suggestion IA
        </div>
      )}
      {isKid && !isPending && (
        <div className={styles.kidLabel}>
          <KidIcon /> Variante enfant
        </div>
      )}
      <div className={styles.name}>{meal.name}</div>
      {!isPending && (
        <div className={styles.tags}>
          {(meal.tags || []).map(t => <Tag key={t} tag={t} size="sm" />)}
        </div>
      )}
      {isPending && (
        <div className={styles.aiActions}>
          <button className={styles.aiRegen} onClick={e => { e.stopPropagation(); onRegen(di, si, isKid ? 'kid' : 'adult') }}>↺</button>
          <button className={styles.aiValidate} onClick={e => { e.stopPropagation(); onValidate(di, si, isKid ? 'kid' : 'adult') }}>✓ OK</button>
        </div>
      )}
    </div>
  )
}

export function MealCard({ slot, di, si, onOpen, onSelect, onRegen, onValidate, onDragStart, onDrop }) {
  const [dragOver, setDragOver] = useState(false)

  const adult = slot?.adult ?? null
  const kid = slot?.kid ?? null
  const isEmpty = !adult && !kid
  const isEveningSlot = si === 1

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ di, si }))
    e.dataTransfer.effectAllowed = 'move'
    onDragStart?.(di, si)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOver(true)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    try {
      const src = JSON.parse(e.dataTransfer.getData('text/plain'))
      if (src.di !== di || src.si !== si) onDrop?.(di, si)
    } catch {}
  }

  if (isEmpty) {
    return (
      <div
        className={`${styles.card} ${styles.empty} ${dragOver ? styles.dragOver : ''}`}
        onClick={() => onSelect(di, si, 'choose')}
        onDragOver={handleDragOver}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <span className={styles.plus}>+</span>
      </div>
    )
  }

  return (
    <div
      className={`${styles.card} ${dragOver ? styles.dragOver : ''}`}
      onClick={() => onOpen(slot, di, si)}
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      <MealPart meal={adult} isKid={false} onRegen={onRegen} onValidate={onValidate} di={di} si={si} />
      {isEveningSlot && kid && (
        <>
          <div className={styles.divider} />
          <MealPart meal={kid} isKid={true} onRegen={onRegen} onValidate={onValidate} di={di} si={si} />
        </>
      )}
    </div>
  )
}
