// src/screens/DetailScreen.jsx
import { Tag } from '../components/Tag'
import styles from './DetailScreen.module.css'

const BackIcon = () => (
  <svg width="8" height="13" viewBox="0 0 8 14" fill="none">
    <path d="M7 13L1 7l6-6" stroke="#0D9E82" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export function DetailScreen({ meal, di, si, onBack, onRemove }) {
  if (!meal) return null

  const canRemove = di !== null && si !== null

  return (
    <div className={styles.screen}>
      {/* Back bar */}
      <div className={styles.backBar}>
        <button className={styles.backBtn} onClick={onBack}>
          <BackIcon />
          Retour
        </button>
        <div className={styles.barCenter}>
          <div className={styles.barTitle}>{meal.name}</div>
          {canRemove && (
            <div className={styles.barSub}>
              {di !== null ? ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'][di] : ''} · {si === 0 ? 'Midi' : 'Soir'}
            </div>
          )}
        </div>
        <div style={{ width: 60 }} />
      </div>

      {/* Content */}
      <div className={styles.scroll}>
        <div className={styles.name}>{meal.name}</div>

        {/* Tags */}
        {(meal.tags || []).length > 0 && (
          <div className={styles.tags}>
            {meal.tags.map(t => <Tag key={t} tag={t} size="lg" />)}
          </div>
        )}

        {/* Ingrédients */}
        <div className={styles.sectionTitle}>Ingrédients</div>
        <div className={styles.ingList}>
          {(meal.ings || ['—']).map((ing, i) => (
            <div key={i} className={styles.ingItem}>
              <span className={styles.ingDot}>•</span>
              {ing}
            </div>
          ))}
        </div>

        {/* Préparation */}
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

      {/* Footer */}
      {canRemove && (
        <div className={styles.footer}>
          <button className={styles.btnRemove} onClick={onRemove}>
            Retirer ce repas
          </button>
        </div>
      )}
    </div>
  )
}
