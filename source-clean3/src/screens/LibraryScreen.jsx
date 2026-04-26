// src/screens/LibraryScreen.jsx
import { useState, useMemo } from 'react'
import { Tag } from '../components/Tag'
import styles from './LibraryScreen.module.css'

const BackIcon = () => (
  <svg width="8" height="13" viewBox="0 0 8 14" fill="none">
    <path d="M7 13L1 7l6-6" stroke="#0D9E82" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export function LibraryScreen({ meals, onBack, onOpenDetail, onAdd }) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    return [...meals]
      .filter(m => !query || m.name.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name, 'fr'))
  }, [meals, query])

  return (
    <div className={styles.screen}>
      {/* Back bar */}
      <div className={styles.backBar}>
        <button className={styles.backBtn} onClick={onBack}>
          <BackIcon />
          Retour
        </button>
        <div className={styles.barCenter}>
          <div className={styles.barTitle}>Mes repas</div>
          <div className={styles.barSub}>{filtered.length} repas</div>
        </div>
        <div style={{ width: 60 }} />
      </div>

      {/* Search */}
      <div className={styles.searchWrap}>
        <input
          className={styles.search}
          type="text"
          placeholder="Rechercher un repas..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      {/* Grid */}
      <div className={styles.scroll}>
        <div className={styles.grid}>
          {filtered.map(m => (
            <div
              key={m.id}
              className={styles.card}
              onClick={() => onOpenDetail(m, null, null)}
            >
              <div className={styles.cardName}>{m.name}</div>
              <div className={styles.cardTags}>
                {(m.tags || []).map(t => <Tag key={t} tag={t} size="sm" />)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAB */}
      <div className={styles.footer}>
        <button className={styles.fab} onClick={onAdd} title="Ajouter un repas">
          +
        </button>
      </div>
    </div>
  )
}
