// src/components/GroceryList.jsx
import { useState, useEffect, useRef } from 'react'
import { GROCERY_CATS, ING_CAT } from '../lib/constants'
import styles from './GroceryList.module.css'

export function GroceryList({ slots }) {
  const [checked, setChecked] = useState({})
  const [newIngs, setNewIngs] = useState(new Set())
  const prevIngsRef = useRef(new Set())

  // Construit la liste d'ingrédients catégorisés
  const cats = GROCERY_CATS.map(() => [])
  const seen = new Set()
  slots.flat().filter(Boolean).forEach(meal => {
    (meal.ings || []).forEach(ing => {
      if (seen.has(ing)) return
      seen.add(ing)
      const catId = ING_CAT[ing] ?? 3
      cats[catId].push(ing)
    })
  })

  useEffect(() => {
    const current = seen
    const prev = prevIngsRef.current
    const added = new Set([...current].filter(i => !prev.has(i)))
    setNewIngs(added)
    prevIngsRef.current = current
    // Reset highlight après 2s
    if (added.size > 0) {
      const t = setTimeout(() => setNewIngs(new Set()), 2000)
      return () => clearTimeout(t)
    }
  }, [slots])

  const toggle = (ing) => {
    setChecked(prev => ({ ...prev, [ing]: !prev[ing] }))
  }

  return (
    <div className={styles.grid}>
      {GROCERY_CATS.map((cat, ci) => (
        <div key={ci} className={styles.col}>
          <div className={styles.colTitle}>
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </div>
          {cats[ci].length === 0
            ? <div className={styles.empty}>—</div>
            : cats[ci].map(ing => (
              <div
                key={ing}
                className={`${styles.item} ${checked[ing] ? styles.checkedItem : ''} ${newIngs.has(ing) ? styles.newIng : ''}`}
              >
                <div
                  className={`${styles.check} ${checked[ing] ? styles.checkDone : ''}`}
                  onClick={() => toggle(ing)}
                />
                <span className={styles.label}>{ing}</span>
              </div>
            ))
          }
        </div>
      ))}
    </div>
  )
}
