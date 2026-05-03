// src/screens/DetailScreen.jsx
import { useState } from 'react'
import { Tag } from '../components/Tag'
import styles from './DetailScreen.module.css'

const BackIcon = () => (
  <svg width="8" height="13" viewBox="0 0 8 14" fill="none">
    <path d="M7 13L1 7l6-6" stroke="#0D9E82" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const KidIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="#3543C4" strokeWidth="1.8"/>
    <path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="#3543C4" strokeWidth="1.8" strokeLinecap="round"/>
    <circle cx="9" cy="10" r="1" fill="#3543C4"/>
    <circle cx="15" cy="10" r="1" fill="#3543C4"/>
  </svg>
)

const TAG_OPTIONS = [
  { key: 'fave', label: 'Favori' },
  { key: 'fast', label: 'Rapide' },
  { key: 'wknd', label: 'Week-end' },
  { key: 'kids', label: 'Enfants' },
  { key: 'veg',  label: 'Végé' },
]

const inputStyle = {
  width: '100%', padding: '8px 10px', borderRadius: 8,
  border: '1.5px solid #E5E5EA', fontSize: 13, outline: 'none',
  boxSizing: 'border-box', fontFamily: 'inherit',
}
const textareaStyle = { ...inputStyle, resize: 'none', fontSize: 12 }
const labelStyle = { fontSize: 11, fontWeight: 600, color: '#6C6C70', display: 'block', marginBottom: 4 }

function MealZone({ meal, isKid, onRemove, onAdd, onEdit }) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('')
  const [tags, setTags] = useState([])
  const [ings, setIngs] = useState('')
  const [steps, setSteps] = useState('')
  const [saving, setSaving] = useState(false)

  const startEdit = () => {
    setName(meal.name)
    setTags([...(meal.tags || [])])
    setIngs((meal.ings || []).join('\n'))
    setSteps((meal.steps || []).join('\n'))
    setEditing(true)
  }

  const saveEdit = async () => {
    if (!name.trim()) return
    setSaving(true)
    await onEdit?.(meal.id, {
      name: name.trim(), tags,
      ings: ings.split('\n').map(s => s.trim()).filter(Boolean),
      steps: steps.split('\n').map(s => s.trim()).filter(Boolean),
    })
    setSaving(false)
    setEditing(false)
  }

  const toggleTag = (key) => setTags(prev =>
    prev.includes(key) ? prev.filter(t => t !== key) : [...prev, key]
  )

  const zoneStyle = {
    flex: 1,
    borderRadius: 12,
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 200,
    border: meal
      ? `1px solid ${isKid ? '#C5CAF0' : 'var(--border)'}`
      : `1.5px dashed ${isKid ? '#3543C4' : 'var(--accent)'}`,
    background: meal
      ? (isKid ? '#F5F6FF' : 'var(--card)')
      : (isKid ? 'rgba(53,67,196,0.03)' : 'rgba(13,158,130,0.03)'),
  }

  const headerColor = isKid ? '#3543C4' : 'var(--text-3)'

  if (editing && meal) {
    return (
      <div style={zoneStyle}>
        <div style={{ fontSize: 11, fontWeight: 700, color: headerColor, display: 'flex', alignItems: 'center', gap: 4, marginBottom: 10 }}>
          {isKid && <KidIcon />}
          {isKid ? 'Variante enfant' : 'Repas principal'}
        </div>
        <div style={{ marginBottom: 8 }}>
          <label style={labelStyle}>Nom *</label>
          <input value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label style={labelStyle}>Tags</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {TAG_OPTIONS.map(t => (
              <button key={t.key} onClick={() => toggleTag(t.key)} style={{
                padding: '3px 8px', borderRadius: 20, fontSize: 10, fontWeight: 600,
                cursor: 'pointer', border: '1.5px solid',
                background: tags.includes(t.key) ? '#0D9E82' : 'transparent',
                color: tags.includes(t.key) ? 'white' : '#6C6C70',
                borderColor: tags.includes(t.key) ? '#0D9E82' : '#E5E5EA',
              }}>{t.label}</button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 8 }}>
          <label style={labelStyle}>Ingrédients</label>
          <textarea value={ings} onChange={e => setIngs(e.target.value)} rows={3} style={textareaStyle} />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label style={labelStyle}>Préparation</label>
          <textarea value={steps} onChange={e => setSteps(e.target.value)} rows={3} style={textareaStyle} />
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 'auto' }}>
          <button onClick={() => setEditing(false)} style={{ flex: 1, padding: '7px', borderRadius: 8, fontSize: 12, background: '#F2F2F7', border: 'none', cursor: 'pointer', color: '#6C6C70' }}>
            Annuler
          </button>
          <button onClick={saveEdit} disabled={!name.trim() || saving} style={{ flex: 1, padding: '7px', borderRadius: 8, fontSize: 12, fontWeight: 700, background: name.trim() ? '#0D9E82' : '#E5E5EA', color: name.trim() ? 'white' : '#AEAEB2', border: 'none', cursor: 'pointer' }}>
            {saving ? '…' : 'Enregistrer'}
          </button>
        </div>
      </div>
    )
  }

  if (!meal) {
    return (
      <div style={zoneStyle}>
        <div style={{ fontSize: 11, fontWeight: 700, color: headerColor, display: 'flex', alignItems: 'center', gap: 4, marginBottom: 12 }}>
          {isKid && <KidIcon />}
          {isKid ? 'Variante enfant' : 'Repas principal'}
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <button onClick={onAdd} style={{
            padding: '10px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600,
            color: isKid ? '#3543C4' : 'var(--accent)',
            background: 'transparent', border: 'none', cursor: 'pointer',
          }}>
            + Ajouter
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={zoneStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: headerColor, display: 'flex', alignItems: 'center', gap: 4 }}>
          {isKid && <KidIcon />}
          {isKid ? 'Variante enfant' : 'Repas principal'}
        </div>
        <button onClick={startEdit} style={{ fontSize: 11, fontWeight: 600, color: '#0D9E82', background: 'none', border: 'none', cursor: 'pointer' }}>
          Modifier
        </button>
      </div>

      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)', marginBottom: 6 }}>{meal.name}</div>

      {(meal.tags || []).length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginBottom: 8 }}>
          {meal.tags.map(t => <Tag key={t} tag={t} size="sm" />)}
        </div>
      )}

      {(meal.ings || []).length > 0 && (
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-3)', marginBottom: 3 }}>Ingrédients</div>
          {meal.ings.map((ing, i) => (
            <div key={i} style={{ fontSize: 11, color: 'var(--text-2)', padding: '1px 0' }}>• {ing}</div>
          ))}
        </div>
      )}

      {(meal.steps || []).length > 0 && (
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-3)', marginBottom: 3 }}>Préparation</div>
          {meal.steps.map((step, i) => (
            <div key={i} style={{ fontSize: 11, color: 'var(--text-2)', display: 'flex', gap: 5, padding: '1px 0' }}>
              <span style={{ fontWeight: 700, color: 'var(--accent)', flexShrink: 0 }}>{i + 1}</span>
              <span>{step}</span>
            </div>
          ))}
        </div>
      )}

      <button onClick={onRemove} style={{
        width: '100%', padding: '8px', borderRadius: 8, fontSize: 12, fontWeight: 600,
        color: '#C0244A', background: 'rgba(192,36,74,0.07)', border: 'none', cursor: 'pointer',
        marginTop: 'auto',
      }}>
        Retirer
      </button>
    </div>
  )
}

export function DetailScreen({ slot, di, si, onBack, onRemoveAdult, onRemoveKid, onAddAdult, onAddKid, onEdit }) {
  if (!slot) return null

  const adult = slot.adult ?? null
  const kid = slot.kid ?? null

  const DAY_NAMES = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
  const slotLabel = di !== null
    ? `${DAY_NAMES[di]} · ${si === 0 ? 'Midi' : 'Soir'}`
    : (adult?.name || 'Repas')

  return (
    <div className={styles.screen}>
      <div className={styles.backBar}>
        <button className={styles.backBtn} onClick={onBack}>
          <BackIcon />
          Retour
        </button>
        <div className={styles.barCenter}>
          <div className={styles.barTitle}>{slotLabel}</div>
        </div>
        <div style={{ width: 60 }} />
      </div>

      <div className={styles.scroll}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'stretch' }}>
          <MealZone
            meal={adult}
            isKid={false}
            onRemove={onRemoveAdult}
            onAdd={onAddAdult}
            onEdit={onEdit}
          />
          <MealZone
            meal={kid}
            isKid={true}
            onRemove={onRemoveKid}
            onAdd={onAddKid}
            onEdit={onEdit}
          />
        </div>
      </div>
    </div>
  )
}
