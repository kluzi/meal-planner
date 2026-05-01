// src/screens/DetailScreen.jsx
import { useState, useEffect } from 'react'
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

const TAG_OPTIONS = [
  { key: 'fave', label: 'Favori' },
  { key: 'fast', label: 'Rapide' },
  { key: 'wknd', label: 'Week-end' },
  { key: 'kids', label: 'Enfants' },
  { key: 'veg',  label: 'Végé' },
]

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 10,
  border: '1.5px solid #E5E5EA',
  fontSize: 15,
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
}

const textareaStyle = {
  ...inputStyle,
  resize: 'none',
  fontSize: 14,
}

const labelStyle = {
  fontSize: 12,
  fontWeight: 600,
  color: '#6C6C70',
  display: 'block',
  marginBottom: 6,
}

export function DetailScreen({ meal, di, si, onBack, onRemove, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('')
  const [tags, setTags] = useState([])
  const [ings, setIngs] = useState('')
  const [steps, setSteps] = useState('')
  const [saving, setSaving] = useState(false)
  const [photoUrl, setPhotoUrl] = useState(null)

  useEffect(() => {
    if (!meal?.name) return
    setPhotoUrl(null)
    const query = encodeURIComponent(meal.name)
    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${query}`)
      .then(r => r.json())
      .then(data => {
        if (data?.thumbnail?.source) setPhotoUrl(data.thumbnail.source)
      })
      .catch(() => {})
  }, [meal?.name])

  if (!meal) return null

  const canRemove = di !== null && si !== null
  const canDelete = !canRemove && typeof onDelete === 'function'

  const startEdit = () => {
    setName(meal.name)
    setTags([...(meal.tags || [])])
    setIngs((meal.ings || []).join('\n'))
    setSteps((meal.steps || []).join('\n'))
    setEditing(true)
  }

  const cancelEdit = () => setEditing(false)

  const saveEdit = async () => {
    if (!name.trim()) return
    setSaving(true)
    await onEdit?.(meal.id, {
      name: name.trim(),
      tags,
      ings: ings.split('\n').map(s => s.trim()).filter(Boolean),
      steps: steps.split('\n').map(s => s.trim()).filter(Boolean),
    })
    setSaving(false)
    setEditing(false)
  }

  const toggleTag = (key) => setTags(prev => prev.includes(key) ? prev.filter(t => t !== key) : [...prev, key])

  // ── Mode édition ──
  if (editing) {
    return (
      <div className={styles.screen}>
        <div className={styles.backBar}>
          <button className={styles.backBtn} onClick={cancelEdit}>
            <CloseIcon />
            Annuler
          </button>
          <div className={styles.barCenter}>
            <div className={styles.barTitle}>Modifier</div>
          </div>
          <button
            onClick={saveEdit}
            disabled={!name.trim() || saving}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 15, fontWeight: 700,
              color: name.trim() ? '#0D9E82' : '#AEAEB2',
              padding: '0 4px', minWidth: 60,
            }}
          >
            {saving ? '…' : 'Enregistrer'}
          </button>
        </div>

        <div className={styles.scroll}>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Nom *</label>
            <input value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Tags</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {TAG_OPTIONS.map(t => (
                <button key={t.key} onClick={() => toggleTag(t.key)} style={{
                  padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                  cursor: 'pointer', border: '1.5px solid',
                  background: tags.includes(t.key) ? '#0D9E82' : 'transparent',
                  color: tags.includes(t.key) ? 'white' : '#6C6C70',
                  borderColor: tags.includes(t.key) ? '#0D9E82' : '#E5E5EA',
                }}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Ingrédients <span style={{ fontWeight: 400 }}>(un par ligne)</span></label>
            <textarea value={ings} onChange={e => setIngs(e.target.value)} rows={6} style={textareaStyle} />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Préparation <span style={{ fontWeight: 400 }}>(une étape par ligne)</span></label>
            <textarea value={steps} onChange={e => setSteps(e.target.value)} rows={6} style={textareaStyle} />
          </div>
        </div>
      </div>
    )
  }

  // ── Mode lecture ──
  return (
    <div className={styles.screen}>
      <div className={styles.backBar}>
        <button className={styles.backBtn} onClick={onBack}>
          <BackIcon />
          Retour
        </button>
        <div className={styles.barCenter}>
          <div className={styles.barTitle}>{meal.name}</div>
          {canRemove && (
            <div className={styles.barSub}>
              {['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'][di]} · {si === 0 ? 'Midi' : 'Soir'}
            </div>
          )}
        </div>
        <button
          onClick={startEdit}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 14, fontWeight: 600, color: '#0D9E82',
            padding: '0 4px', minWidth: 60,
          }}
        >
          Modifier
        </button>
      </div>

      <div className={styles.scroll}>
        {photoUrl && (
          <div style={{ margin: '0 0 16px', borderRadius: 14, overflow: 'hidden', height: 180 }}>
            <img
              src={photoUrl}
              alt={meal.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={() => setPhotoUrl(null)}
            />
          </div>
        )}

        <div className={styles.name}>{meal.name}</div>

        {(meal.tags || []).length > 0 && (
          <div className={styles.tags}>
            {meal.tags.map(t => <Tag key={t} tag={t} size="lg" />)}
          </div>
        )}

        <div className={styles.sectionTitle}>Ingrédients</div>
        <div className={styles.ingList}>
          {(meal.ings || ['—']).map((ing, i) => (
            <div key={i} className={styles.ingItem}>
              <span className={styles.ingDot}>•</span>
              {ing}
            </div>
          ))}
        </div>

        <div className={styles.sectionTitle}>Préparation</div>
        <div className={styles.stepList}>
          {(meal.steps || ['—']).map((step, i) => (
            <div key={i} className={styles.stepItem}>
              <span className={styles.stepNum}>{i + 1}</span>
              <span>{step}</span>
            </div>
          ))}
        </div>
      </div>

      {(canRemove || canDelete) && (
        <div className={styles.footer}>
          {canRemove && (
            <button className={styles.btnRemove} onClick={onRemove}>
              Retirer ce repas
            </button>
          )}
          {canDelete && (
            <button className={styles.btnRemove} onClick={onDelete}>
              Supprimer ce repas
            </button>
          )}
        </div>
      )}
    </div>
  )
}
