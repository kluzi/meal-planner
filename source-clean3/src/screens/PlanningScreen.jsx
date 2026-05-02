// src/screens/PlanningScreen.jsx
import { useCallback, useRef } from 'react'
import { MealCard } from '../components/MealCard'
import { GroceryList, useGroceryCount } from '../components/GroceryList'
import { DAY_NAMES, addDays, formatWeekLabel, isToday } from '../lib/dates'
import { RECAP_FILTERS } from '../lib/constants'
import styles from './PlanningScreen.module.css'

const GridIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="1" y="1" width="5" height="5" rx="1.5" fill="white" opacity=".9"/>
    <rect x="8" y="1" width="5" height="5" rx="1.5" fill="white" opacity=".9"/>
    <rect x="1" y="8" width="5" height="5" rx="1.5" fill="white" opacity=".9"/>
    <rect x="8" y="8" width="5" height="5" rx="1.5" fill="white" opacity=".9"/>
  </svg>
)

const StarIcon = () => (
  <svg width="17" height="17" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="9" stroke="#0D9E82" strokeWidth="1.3"/>
    <path d="M10 3.5c0 0 .6 2.7 2.2 4.3 1.6 1.6 4.3 2.2 4.3 2.2s-2.7.6-4.3 2.2C10.6 13.8 10 16.5 10 16.5s-.6-2.7-2.2-4.3C6.2 10.6 3.5 10 3.5 10s2.7-.6 4.3-2.2C9.4 6.2 10 3.5 10 3.5z" fill="#0D9E82"/>
    <path d="M5.5 4c0 0 .3 1.1 1 1.8.7.7 1.8 1 1.8 1s-1.1.3-1.8 1C5.8 8.5 5.5 9.5 5.5 9.5s-.3-1-1-1.7C3.8 7.1 2.7 6.8 2.7 6.8s1.1-.3 1.8-1C5.2 5.1 5.5 4 5.5 4z" fill="#5DCAA5"/>
  </svg>
)

const ChevronLeft = () => (
  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
    <path d="M7 9L4 6l3-3" stroke="#6C6C70" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const ChevronRight = () => (
  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
    <path d="M5 3l3 3-3 3" stroke="#6C6C70" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const SunIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" opacity=".45">
    <circle cx="12" cy="12" r="4" stroke="#1C1C1E" strokeWidth="1.8"/>
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="#1C1C1E" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
)

const MoonIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" opacity=".45">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="#1C1C1E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const RepeatIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <path d="M17 1l4 4-4 4" stroke="#0D9E82" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 11V9a4 4 0 014-4h14" stroke="#0D9E82" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 23l-4-4 4-4" stroke="#0D9E82" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 13v2a4 4 0 01-4 4H3" stroke="#0D9E82" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export function PlanningScreen({
  monday, slots, loadingWeek, meals,
  onPrevWeek, onNextWeek,
  onOpenDetail, onOpenSelector,
  onSetMeal, onSwapMeals,
  onRegenSlot, onValidateSlot,
  onOpenLibrary, onTriggerAI, onCopyPrevWeek,
}) {
  const dragSrc = useRef(null)
  const groceryCount = useGroceryCount(slots)

  const handleDragStart = useCallback((di, si) => {
    dragSrc.current = { di, si }
  }, [])

  const handleDrop = useCallback((toDi, toSi) => {
    if (!dragSrc.current) return
    const { di, si } = dragSrc.current
    if (di === toDi && si === toSi) return
    onSwapMeals(di, si, toDi, toSi)
    dragSrc.current = null
  }, [onSwapMeals])

  const flat = slots.flat().flatMap(s => [s?.adult, s?.kid]).filter(Boolean)
  const counts = Object.fromEntries(RECAP_FILTERS.map(r => [r.key, 0]))
  flat.forEach(m => (m.tags || []).forEach(t => { if (counts[t] !== undefined) counts[t]++ }))

  return (
    <div style={{display:'flex', flexDirection:'column', height:'100%', overflowY:'auto'}}>
      <div className={styles.topbar}>
        <div className={styles.pageTitle}>Planning</div>
        <div className={styles.topbarRight}>
          <button className={styles.iconBtn} onClick={onTriggerAI} title="Générer avec l'IA">
            <StarIcon />
          </button>
          <button className={styles.iconBtn} onClick={onCopyPrevWeek} title="Reprendre la semaine dernière">
            <RepeatIcon />
          </button>
          <button className={`${styles.iconBtn} ${styles.iconBtnAccent}`} onClick={onOpenLibrary} title="Mes repas">
            <GridIcon />
          </button>
        </div>
      </div>

      <div className={styles.weekNavRow}>
        <div className={styles.weekNavCard}>
          <button className={styles.navArr} onClick={onPrevWeek}><ChevronLeft /></button>
          <span className={styles.weekLbl}>{formatWeekLabel(monday)}</span>
          <button className={styles.navArr} onClick={onNextWeek}><ChevronRight /></button>
        </div>
        {loadingWeek && <span className={styles.loadingDot} />}
      </div>

      <div style={{padding: '0 18px'}}>
        <div className={styles.gridWrap}>
          <div className={styles.sideCol}>
            <div className={styles.sideSpacer} />
            <div className={styles.sidePill}>
              <SunIcon />
              <span className={styles.sideTxt}>Midi</span>
            </div>
            <div className={styles.sidePill}>
              <MoonIcon />
              <span className={styles.sideTxt}>Soir</span>
            </div>
          </div>

          <div className={styles.gridCols}>
            <div className={styles.dayHeaders}>
              {Array.from({ length: 7 }, (_, di) => {
                const date = addDays(monday, di)
                const today = isToday(date)
                return (
                  <div key={di} className={styles.dh}>
                    <span className={styles.dhName}>{DAY_NAMES[di]}</span>
                    <span className={`${styles.dhNum} ${today ? styles.dhToday : ''}`}>
                      {date.getDate()}
                    </span>
                  </div>
                )
              })}
            </div>

            {[0, 1].map(si => (
              <div key={si} className={styles.mealRow}>
                {Array.from({ length: 7 }, (_, di) => (
                  <MealCard
                    key={di}
                    slot={slots[di]?.[si] ?? null}
                    di={di} si={si}
                    onOpen={onOpenDetail}
                    onSelect={onOpenSelector}
                    onRegen={onRegenSlot}
                    onValidate={onValidateSlot}
                    onDragStart={handleDragStart}
                    onDrop={handleDrop}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.recapRow}>
          <div className={styles.recapBand}>
            {RECAP_FILTERS.map(r => {
              const n = counts[r.key]
              return (
                <div key={r.key} className={`${styles.recapPill} ${n === 0 ? styles.recapZero : ''}`}>
                  <span className={styles.recapDot} style={{ background: r.dot }} />
                  <span className={styles.recapNum} style={{ color: n > 0 ? r.dot : 'var(--text-3)' }}>{n}</span>
                  <span className={styles.recapLbl}> {r.label}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className={styles.sectionHdr}>
          Liste de courses
          {groceryCount > 0 && (
            <span style={{ fontSize:12, fontWeight:400, color:'var(--text-3)', marginLeft:6 }}>
              {groceryCount} articles
            </span>
          )}
        </div>
        <GroceryList slots={slots} />
      </div>
    </div>
  )
}
