// src/screens/LibraryScreen.jsx
import { useState, useMemo } from 'react'
import { Tag } from '../components/Tag'
import styles from './LibraryScreen.module.css'

const BackIcon = () => (
  <svg width="8" height="13" viewBox="0 0 8 14" fill="none">
    <path d="M7 13L1 7l6-6" stroke="#0D9E82" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const CloseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M1 1l12 12M13 1L1 13" stroke="#6C6C70" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
)

const TAG_OPTIONS = [
  { key: 'fave', label: 'Favori' },
  { key: 'fast', label: 'Rapide' },
  { key: 'wknd', label: 'Week-end' },
  { key: 'kids', label: 'Enfants' },
  { key: 'veg',  label: 'Végé' },
]

function AddMealModal({ onSave, onClose }) {
  const [name, setName] = useState('')
  const [tags, setTags] = useState([])
  const [ings, setIngs] = useState('')
  const [steps, setSteps] = useState('')

  const toggleTag = (key) => setTags(prev => prev.includes(key) ? prev.filter(t => t !== key) : [...prev, key])

  const handleSave = () => {
    if (!name.trim()) return
    onSave({
      name: name.trim(),
      tags,
      ings: ings.split('\n').map(s => s.trim()).filter(Boolean),
      steps: steps.split('\n').map(s => s.trim()).filter(Boolean),
    })
  }

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', zIndex:100, display:'flex', alignItems:'flex-end' }}>
      <div style={{ background:'white', borderRadius:'20px 20px 0 0', padding:'24px 20px 40px', width:'100%', maxHeight:'85vh', overflowY:'auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
          <div style={{ fontSize:18, fontWeight:700, color:'#1C1C1E' }}>Nouveau repas</div>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', padding:4 }}><CloseIcon /></button>
        </div>

        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:12, fontWeight:600, color:'#6C6C70', display:'block', marginBottom:6 }}>Nom *</label>
          <input
            value={name} onChange={e => setName(e.target.value)}
            placeholder="Ex: Poulet rôti aux herbes"
            style={{ width:'100%', padding:'10px 12px', borderRadius:10, border:'1.5px solid #E5E5EA', fontSize:15, outline:'none', boxSizing:'border-box' }}
          />
        </div>

        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:12, fontWeight:600, color:'#6C6C70', display:'block', marginBottom:8 }}>Tags</label>
          <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
            {TAG_OPTIONS.map(t => (
              <button key={t.key} onClick={() => toggleTag(t.key)} style={{
                padding:'6px 12px', borderRadius:20, fontSize:12, fontWeight:600, cursor:'pointer', border:'1.5px solid',
                background: tags.includes(t.key) ? '#0D9E82' : 'transparent',
                color: tags.includes(t.key) ? 'white' : '#6C6C70',
                borderColor: tags.includes(t.key) ? '#0D9E82' : '#E5E5EA',
              }}>{t.label}</button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:12, fontWeight:600, color:'#6C6C70', display:'block', marginBottom:6 }}>Ingrédients <span style={{ fontWeight:400 }}>(un par ligne)</span></label>
          <textarea
            value={ings} onChange={e => setIngs(e.target.value)}
            placeholder={"Poulet\nHerbes de Provence\nAil"}
            rows={4}
            style={{ width:'100%', padding:'10px 12px', borderRadius:10, border:'1.5px solid #E5E5EA', fontSize:14, outline:'none', resize:'none', fontFamily:'inherit', boxSizing:'border-box' }}
          />
        </div>

        <div style={{ marginBottom:24 }}>
          <label style={{ fontSize:12, fontWeight:600, color:'#6C6C70', display:'block', marginBottom:6 }}>Préparation <span style={{ fontWeight:400 }}>(une étape par ligne)</span></label>
          <textarea
            value={steps} onChange={e => setSteps(e.target.value)}
            placeholder={"Préchauffer le four à 200°C.\nAssaisonner le poulet.\nEnfourner 45 min."}
            rows={4}
            style={{ width:'100%', padding:'10px 12px', borderRadius:10, border:'1.5px solid #E5E5EA', fontSize:14, outline:'none', resize:'none', fontFamily:'inherit', boxSizing:'border-box' }}
          />
        </div>

        <button onClick={handleSave} style={{
          width:'100%', padding:'14px', borderRadius:12,
          background: name.trim() ? '#0D9E82' : '#E5E5EA',
          color: name.trim() ? 'white' : '#AEAEB2',
          border:'none', fontSize:16, fontWeight:700,
          cursor: name.trim() ? 'pointer' : 'default'
        }}>
          Ajouter le repas
        </button>
      </div>
    </div>
  )
}

export function LibraryScreen({ meals, onBack, onOpenDetail, onAdd }) {
  const [query, setQuery] = useState('')
  const [showAdd, setShowAdd] = useState(false)

  const filtered = useMemo(() => {
    return [...meals]
      .filter(m => !query || m.name.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name, 'fr'))
  }, [meals, query])

  const handleSave = (meal) => {
    onAdd(meal)
    setShowAdd(false)
  }

  return (
    <div className={styles.screen}>
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

      <div className={styles.searchWrap}>
        <input
          className={styles.search}
          type="text"
          placeholder="Rechercher un repas..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      <div className={styles.scroll}>
        <div className={styles.grid}>
          {filtered.map(m => (
            <div key={m.id} className={styles.card} onClick={() => onOpenDetail(m, null, null)}>
              <div className={styles.cardName}>{m.name}</div>
              <div className={styles.cardTags}>
                {(m.tags || []).map(t => <Tag key={t} tag={t} size="sm" />)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.footer}>
        <button className={styles.fab} onClick={() => setShowAdd(true)} title="Ajouter un repas">+</button>
      </div>

      {showAdd && <AddMealModal onSave={handleSave} onClose={() => setShowAdd(false)} />}
    </div>
  )
}
