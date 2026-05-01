// src/screens/SelectorScreen.jsx
import { useState, useMemo } from 'react'
import { Tag } from '../components/Tag'
import { FILTERS } from '../lib/constants'
import { addDays } from '../lib/dates'
import styles from './SelectorScreen.module.css'

const BackIcon = () => (
  <svg width="8" height="13" viewBox="0 0 8 14" fill="none">
    <path d="M7 13L1 7l6-6" stroke="#0D9E82" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const DAY_NAMES = ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche']

export function SelectorScreen({ meals, slots, monday, di, si, onBack, onConfirm }) {
  const [query, setQuery] = useState('')
  const [activeTags, setActiveTags] = useState(new Set())
  const [selected, setSelected] = useState(null)

  // Masquer les repas déjà planifiés cette semaine
  const usedNames = useMemo(() => {
    const s = new Set()
    slots.flat().filter(Boolean).forEach(m => s.add(m.name))
    return s
  }, [slots])

  const filtered = useMemo(() => {
    return meals
      .filter(m => activeTags.size === 0 || [...activeTags].every(t => m.tags.includes(t)))
      .filter(m => !query || m.name.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name, 'fr'))
  }, [meals, usedNames, activeTags, query])

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

  return (
    <div className={styles.screen}>
      {/* Back bar */}
      <div className={styles.backBar}>
        <button className={styles.backBtn} onClick={onBack}>
          <BackIcon />
          Retour
        </button>
        <div className={styles.barCenter}>
          <div className={styles.barTitle}>Choisir un repas</div>
          {dayLabel && <div className={styles.barSub}>{dayLabel}</div>}
        </div>
        <div style={{ width: 60 }} />
      </div>

      {/* Search + filters */}
      <div className={styles.controls}>
        <input
          className={styles.search}
          type="text"
          placeholder="Rechercher..."
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

      {/* Count */}
      <div className={styles.count}>{filtered.length} repas disponibles</div>

      {/* Grid */}
      <div className={styles.scroll}>
        <div className={styles.grid}>
          {filtered.map(m => (
            <div
              key={m.id}
              className={`${styles.card} ${selected?.id === m.id ? styles.selected : ''}`}
              onClick={() => setSelected(m)}
            >
              <div className={styles.cardName}>{m.name}</div>
              <div className={styles.cardTags}>
                {(m.tags || []).map(t => <Tag key={t} tag={t} size="sm" />)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <button
          className={styles.btnConfirm}
          disabled={!selected}
          onClick={() => selected && onConfirm(selected)}
        >
          Choisir {selected ? `"${selected.name}"` : ''}
        </button>
      </div>
    </div>
  )
}
