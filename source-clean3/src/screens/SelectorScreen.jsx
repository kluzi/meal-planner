// src/screens/SelectorScreen.jsx
import { useState, useMemo } from 'react'
import { Tag } from '../components/Tag'
import { FILTERS } from '../lib/constants'
import styles from './SelectorScreen.module.css'

const BackIcon = () => (
  <svg width="8" height="13" viewBox="0 0 8 14" fill="none">
    <path d="M7 13L1 7l6-6" stroke="#0D9E82" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const DAY_NAMES = ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche']

export function SelectorScreen({ meals, slots, monday, di, si, mode = 'choose', onBack, onConfirm }) {
  const [query, setQuery] = useState('')
  const [activeTags, setActiveTags] = useState(() => mode === 'kid' ? new Set(['kids']) : new Set())
  const [selected, setSelected] = useState(null)

  const filtered = useMemo(() => {
    return meals
      .filter(m => activeTags.size === 0 || [...activeTags].every(t => (m.tags||[]).includes(t)))
      .filter(m => !query || m.name.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name, 'fr'))
  }, [meals, activeTags, query])

  const toggleTag = (key) => {
    setActiveTags(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  const dayLabel = di !== null
    ? `${DAY_NAMES[di]} · ${si === 0 ? 'Midi' : 'Soir'}`
    : ''

  const modeLabel = mode === 'kid' ? ' · Variante enfant' : mode === 'adult' ? ' · Repas principal' : ''

  const handleCardClick = (meal) => {
    if (mode === 'choose') {
      setSelected(prev => prev?.id === meal.id ? null : meal)
    } else {
      onConfirm(meal, mode)
    }
  }

  return (
    <div className={styles.screen}>
      <div className={styles.backBar}>
        <button className={styles.backBtn} onClick={onBack}>
          <BackIcon />
          Retour
        </button>
        <div className={styles.barCenter}>
          <div className={styles.barTitle}>Choisir un repas</div>
          {dayLabel && <div className={styles.barSub}>{dayLabel}{modeLabel}</div>}
        </div>
        <div style={{ width: 60 }} />
      </div>

      <div className={styles.controls}>
        <input
          className={styles.search}
          type="text"
          placeholder={mode === 'kid' ? 'Rechercher une variante enfant...' : 'Rechercher...'}
          value={query}
          onChange={e => setQuery(e.target.value)}
          autoFocus
        />
        <div className={styles.filters}>
          {FILTERS.map(f => (
            <span
              key={f.key}
              className={`${styles.filterTag} ${activeTags.has(f.key) ? styles[`active-${f.key}`] : ''}`}
              onClick={() => toggleTag(f.key)}
            >
              {f.label}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.count}>{filtered.length} repas disponibles</div>

      <div className={styles.scroll}>
        <div className={styles.grid}>
          {filtered.map(m => (
            <div
              key={m.id}
              className={`${styles.card} ${selected?.id === m.id ? styles.selected : ''}`}
              onClick={() => handleCardClick(m)}
            >
              <div className={styles.cardName}>{m.name}</div>
              <div className={styles.cardTags}>
                {(m.tags || []).map(t => <Tag key={t} tag={t} size="sm" />)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {mode === 'choose' && (
        <div className={styles.footer}>
          <button
            className={styles.btnConfirm}
            disabled={!selected}
            onClick={() => selected && onConfirm(selected, 'adult')}
          >
            {selected ? `Repas principal · "${selected.name}"` : 'Choisir Repas principal'}
          </button>
          <button
            className={`${styles.btnConfirm} ${styles.btnKid}`}
            disabled={!selected}
            onClick={() => selected && onConfirm(selected, 'kid')}
          >
            {selected ? `Variante enfant · "${selected.name}"` : 'Choisir Variante enfant'}
          </button>
        </div>
      )}
    </div>
  )
}
