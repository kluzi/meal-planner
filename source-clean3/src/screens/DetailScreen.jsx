// src/screens/DetailScreen.jsx
import { useState } from 'react'
import { Tag } from '../components/Tag'
import styles from './DetailScreen.module.css'

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

const KidIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <path d="M12 2a5 5 0 100 10A5 5 0 0012 2zM4 20a8 8 0 0116 0" stroke="#3543C4" strokeWidth="2" strokeLinecap="round"/>
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
  width: '100%', padding: '10px 12px', borderRadius: 10,
  border: '1.5px solid #E5E5EA', fontSize: 15, outline: 'none',
  boxSizing: 'border-box', fontFamily: 'inherit',
}
const textareaStyle = { ...inputStyle, resize: 'none', fontSize: 14 }
const labelStyle = { fontSize: 12, fontWeight: 600, color: '#6C6C70', display: 'block', marginBottom: 6 }

function MealDetail({ meal, isKid, onRemove, onAdd, onEdit }) {
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

  const sectionStyle = {
    background: isKid ? '#F5F6FF' : 'var(--card)',
    borderRadius: 12,
    padding: '12px 14px',
    border: isKid ? '1px solid #C5CAF0' : '0.5px solid var(--border)',
    marginBottom: 10,
  }

  if (editing) {
    return (
      <div style={sectionStyle}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
          <div style={{ fontSize:12, fontWeight:700, color: isKid ? '#3543C4' : 'var(--text-1)', display:'flex', alignItems:'center', gap:4 }}>
            {isKid && <KidIcon />}
            {isKid ? 'Variante enfant' : 'Repas principal'}
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={() => setEditing(false)} style={{ fontSize:12, color:'#6C6C70', background:'none', border:'none', cursor:'pointer' }}>
              Annuler
            </button>
            <button onClick={saveEdit} disabled={!name.trim() || saving} style={{ fontSize:12, fontWeight:700, color: name.trim() ? '#0D9E82' : '#AEAEB2', background:'none', border:'none', cursor:'pointer' }}>
              {saving ? '…' : 'Enregistrer'}
            </button>
          </div>
        </div>
        <div style={{ marginBottom:10 }}>
          <label style={labelStyle}>Nom *</label>
          <input value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
        </div>
        <div style={{ marginBottom:10 }}>
          <label style={labelStyle}>Tags</label>
          <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
            {TAG_OPTIONS.map(t => (
              <button key={t.key} onClick={() => toggleTag(t.key)} style={{
                padding:'4px 10px', borderRadius:20, fontSize:11, fontWeight:600,
                cursor:'pointer', border:'1.5px solid',
                background: tags.includes(t.key) ? '#0D9E82' : 'transparent',
                color: tags.includes(t.key) ? 'white' : '#6C6C70',
                borderColor: tags.includes(t.key) ? '#0D9E82' : '#E5E5EA',
              }}>{t.label}</button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom:10 }}>
          <label style={labelStyle}>Ingrédients <span style={{ fontWeight:400 }}>(un par ligne)</span></label>
          <textarea value={ings} onChange={e => setIngs(e.target.value)} rows={4} style={textareaStyle} />
        </div>
        <div>
          <label style={labelStyle}>Préparation <span style={{ fontWeight:400 }}>(une étape par ligne)</span></label>
          <textarea value={steps} onChange={e => setSteps(e.target.value)} rows={4} style={textareaStyle} />
        </div>
      </div>
    )
  }

  return (
    <div style={sectionStyle}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
        <div style={{ fontSize:11, fontWeight:700, color: isKid ? '#3543C4' : 'var(--text-3)', display:'flex', alignItems:'center', gap:4 }}>
          {isKid && <KidIcon />}
          {isKid ? 'Variante enfant' : 'Repas principal'}
        </div>
        {meal && (
          <button onClick={startEdit} style={{ fontSize:11, fontWeight:600, color:'#0D9E82', background:'none', border:'none', cursor:'pointer' }}>
            Modifier
          </button>
        )}
      </div>

      {meal ? (
        <>
          <div style={{ fontSize:15, fontWeight:600, color:'var(--text-1)', marginBottom:6 }}>{meal.name}</div>
          {(meal.tags || []).length > 0 && (
            <div style={{ display:'flex', flexWrap:'wrap', gap:4, marginBottom:8 }}>
              {meal.tags.map(t => <Tag key={t} tag={t} size="sm" />)}
            </div>
          )}
          {(meal.ings || []).length > 0 && (
            <div style={{ marginBottom:8 }}>
              <div style={{ fontSize:10, fontWeight:600, color:'var(--text-3)', marginBottom:4 }}>Ingrédients</div>
              {meal.ings.map((ing, i) => (
                <div key={i} style={{ fontSize:12, color:'var(--text-2)', padding:'2px 0' }}>• {ing}</div>
              ))}
            </div>
          )}
          {(meal.steps || []).length > 0 && (
            <div style={{ marginBottom:10 }}>
              <div style={{ fontSize:10, fontWeight:600, color:'var(--text-3)', marginBottom:4 }}>Préparation</div>
              {meal.steps.map((step, i) => (
                <div key={i} style={{ fontSize:12, color:'var(--text-2)', display:'flex', gap:6, padding:'2px 0' }}>
                  <span style={{ fontWeight:700, color:'var(--accent)', flexShrink:0 }}>{i+1}</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          )}
          <button onClick={onRemove} style={{
            width:'100%', padding:'8px', borderRadius:8, fontSize:12, fontWeight:600,
            color:'#C0244A', background:'rgba(192,36,74,0.07)', border:'none', cursor:'pointer',
          }}>
            Retirer ce repas
          </button>
        </>
      ) : (
        <button onClick={onAdd} style={{
          width:'100%', padding:'10px', borderRadius:8, fontSize:13, fontWeight:600,
          color: isKid ? '#3543C4' : 'var(--accent)',
          background: isKid ? 'rgba(53,67,196,0.07)' : 'rgba(13,158,130,0.07)',
          border: `1px dashed ${isKid ? '#3543C4' : 'var(--accent)'}`,
          cursor:'pointer',
        }}>
          {isKid ? '+ Ajouter une variante enfant' : '+ Ajouter un repas principal'}
        </button>
      )}
    </div>
  )
}

export function DetailScreen({ slot, di, si, onBack, onRemoveAdult, onRemoveKid, onAddAdult, onAddKid, onEdit }) {
  if (!slot) return null

  const adult = slot.adult ?? null
  const kid = slot.kid ?? null
  const isEvening = si === 1

  const DAY_NAMES = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim']
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
        <MealDetail
          meal={adult}
          isKid={false}
          onRemove={onRemoveAdult}
          onAdd={onAddAdult}
          onEdit={onEdit}
        />
        {isEvening && (
          <MealDetail
            meal={kid}
            isKid={true}
            onRemove={onRemoveKid}
            onAdd={onAddKid}
            onEdit={onEdit}
          />
        )}
      </div>
    </div>
  )
}
