// src/components/GroceryList.jsx
import { useState, useEffect, useRef, useMemo } from 'react'
import { GROCERY_CATS, ING_CAT } from '../lib/constants'
import styles from './GroceryList.module.css'

const CAT_PRICE = [2.5, 5.0, 1.8, 2.0, 2.5, 0.8]

export function GroceryList({ slots }) {
  const [checked, setChecked] = useState({})
  const [newIngs, setNewIngs] = useState(new Set())
  const prevIngsRef = useRef(new Set())

  const { cats, totalCount, priceMin, priceMax } = useMemo(() => {
    const cats = GROCERY_CATS.map(() => [])
    const seen = new Set()
    slots.flat().flatMap(s => [s?.adult, s?.kid]).filter(Boolean).forEach(meal => {
      (meal.ings || []).forEach(ing => {
        if (!ing || seen.has(ing)) return
        seen.add(ing)
        const catId = ING_CAT[ing] ?? 3
        cats[catId].push(ing)
      })
    })
    cats.forEach(c => c.sort((a, b) => a.localeCompare(b, 'fr')))

    let min = 0, max = 0
    cats.forEach((items, ci) => {
      const n = items.length
      min += n * CAT_PRICE[ci] * 0.9
      max += n * CAT_PRICE[ci] * 1.1
    })

    return {
      cats,
      totalCount: seen.size,
      priceMin: Math.round(min / 5) * 5 || 5,
      priceMax: Math.round(max / 5) * 5 || 10,
    }
  }, [slots])

  useEffect(() => {
    const current = new Set(
      slots.flat().flatMap(s => [s?.adult, s?.kid]).filter(Boolean).flatMap(m => m.ings || [])
    )
    const prev = prevIngsRef.current
    const added = new Set([...current].filter(i => !prev.has(i)))
    setNewIngs(added)
    prevIngsRef.current = current
    if (added.size > 0) {
      const t = setTimeout(() => setNewIngs(new Set()), 2000)
      return () => clearTimeout(t)
    }
  }, [slots])

  const toggle = (ing) => setChecked(prev => ({ ...prev, [ing]: !prev[ing] }))

  return (
    <div>
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

      {priceMax > 0 && (
        <div className={styles.priceRow}>
          <div className={styles.priceCard}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="#0D9E82" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 6h18M16 10a4 4 0 01-8 0" stroke="#0D9E82" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className={styles.priceLabel}>Estimation courses</span>
            <span className={styles.priceValue}>{priceMin}–{priceMax} €</span>
          </div>
        </div>
      )}
    </div>
  )
}

export function useGroceryCount(slots) {
  return useMemo(() => {
    const seen = new Set()
    slots.flat().flatMap(s => [s?.adult, s?.kid]).filter(Boolean).forEach(meal => {
      (meal.ings || []).forEach(ing => { if (ing) seen.add(ing) })
    })
    return seen.size
  }, [slots])
}
