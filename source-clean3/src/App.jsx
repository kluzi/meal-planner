import { useState, useCallback } from 'react'
import { PlanningScreen } from './screens/PlanningScreen'
import { DetailScreen } from './screens/DetailScreen'
import { SelectorScreen } from './screens/SelectorScreen'
import { LibraryScreen } from './screens/LibraryScreen'
import { useMeals } from './hooks/useMeals'
import { usePlanning } from './hooks/usePlanning'

const S = { PLANNING: 0, DETAIL: 1, SELECTOR: 2, LIBRARY: 3, LIB_DETAIL: 4 }

const wrap = {
  position: 'fixed', inset: 0, width: '100vw', height: '100dvh',
  overflow: 'hidden', background: '#F2F2F7',
}

export default function App() {
  const { meals, addMeal, editMeal, removeMeal: deleteMeal } = useMeals()
  const { monday, slots, loadingWeek, setMeal, removeMeal, swapMeals, prevWeek, nextWeek, getPrevWeekMeals } = usePlanning()

  const [screen, setScreen] = useState(S.PLANNING)
  const [detailSlot, setDetailSlot] = useState(null)
  const [detailDi, setDetailDi] = useState(null)
  const [detailSi, setDetailSi] = useState(null)
  const [selDi, setSelDi] = useState(null)
  const [selSi, setSelSi] = useState(null)
  const [selMode, setSelMode] = useState('choose')
  const [libDetailMeal, setLibDetailMeal] = useState(null)

  const goBack = useCallback(() => setScreen(S.PLANNING), [])
  const goBackToDetail = useCallback(() => setScreen(S.DETAIL), [])
  const goBackToLibrary = useCallback(() => setScreen(S.LIBRARY), [])

  const openDetail = useCallback((slot, di, si) => {
    setDetailSlot(slot); setDetailDi(di); setDetailSi(si)
    setScreen(S.DETAIL)
  }, [])

  const openSelector = useCallback((di, si, mode = 'choose') => {
    setSelDi(di); setSelSi(si); setSelMode(mode)
    setScreen(S.SELECTOR)
  }, [])

  const openSelectorFromDetail = useCallback((mode) => {
    setSelDi(detailDi); setSelSi(detailSi); setSelMode(mode)
    setScreen(S.SELECTOR)
  }, [detailDi, detailSi])

  const handleConfirm = useCallback((meal, role) => {
    const mealData = { id: meal.id, name: meal.name, tags: [...(meal.tags||[])], ings: meal.ings||[], steps: meal.steps||[] }
    setMeal(selDi, selSi, mealData, role)
    setDetailSlot(prev => {
      if (!prev) return { adult: role === 'adult' ? mealData : null, kid: role === 'kid' ? mealData : null }
      return { ...prev, [role]: mealData }
    })
    setScreen(S.PLANNING)
  }, [selDi, selSi, setMeal])

  const handleRemoveAdult = useCallback(() => {
    removeMeal(detailDi, detailSi, 'adult')
    const newSlot = { ...detailSlot, adult: null }
    setDetailSlot(newSlot)
    if (!newSlot.adult && !newSlot.kid) setScreen(S.PLANNING)
  }, [detailDi, detailSi, detailSlot, removeMeal])

  const handleRemoveKid = useCallback(() => {
    removeMeal(detailDi, detailSi, 'kid')
    setDetailSlot(prev => ({ ...prev, kid: null }))
  }, [detailDi, detailSi, removeMeal])

  const triggerAI = useCallback(() => {
    const empty = []
    for (let di = 0; di < 7; di++)
      for (let si = 0; si < 2; si++) {
        const slot = slots[di]?.[si]
        if (!slot?.adult) empty.push({ di, si, role: 'adult' })
        if (si === 1 && !slot?.kid) empty.push({ di, si, role: 'kid' })
      }
    if (!empty.length) return

    const usedAdult = new Set(slots.flatMap(d => d.map(s => s?.adult?.name)).filter(Boolean))
    const prevSlots = getPrevWeekMeals()
    const prevNames = new Set(prevSlots.flatMap(d => d.map(s => s?.adult?.name)).filter(Boolean))

    const kidMeals = [...meals].filter(m => (m.tags||[]).includes('kids'))
    const adultMeals = [...meals]

    const scoreAdult = m => (usedAdult.has(m.name)?-20:0) + (prevNames.has(m.name)?-8:0) + Math.random()*3
    const scoredAdult = adultMeals.map(m => ({ ...m, score: scoreAdult(m) })).sort((a,b) => b.score-a.score)
    const scoredKid = [...kidMeals].sort(() => Math.random()-0.5)

    let ai = 0, ki = 0
    const next = (idx) => {
      if (idx >= empty.length) return
      const { di, si, role } = empty[idx]
      let pick
      if (role === 'kid') {
        pick = scoredKid[ki % Math.max(scoredKid.length, 1)]
        ki++
      } else {
        pick = scoredAdult[ai % Math.max(scoredAdult.length, 1)]
        ai++
      }
      if (!pick) { setTimeout(() => next(idx+1), 160); return }
      setMeal(di, si, { id:pick.id, name:pick.name, tags:[...(pick.tags||[])], ings:pick.ings||[], steps:pick.steps||[], _ai:true, _aiPending:true }, role)
      setTimeout(() => next(idx+1), 160)
    }
    setTimeout(() => next(0), 200)
  }, [slots, meals, getPrevWeekMeals, setMeal])

  const regenSlot = useCallback((di, si, role = 'adult') => {
    const pool = [...meals]
      .filter(m => role === 'kid' ? (m.tags||[]).includes('kids') : true)
      .sort(() => Math.random()-0.5)
    if (pool.length) {
      const pick = pool[0]
      setMeal(di, si, { id:pick.id, name:pick.name, tags:[...(pick.tags||[])], ings:pick.ings||[], steps:pick.steps||[], _ai:true, _aiPending:true }, role)
    }
  }, [meals, setMeal])

  const validateSlot = useCallback((di, si, role = 'adult') => {
    const meal = slots[di]?.[si]?.[role]
    if (meal) setMeal(di, si, { ...meal, _ai:true, _aiPending:false }, role)
  }, [slots, setMeal])

  const copyPrevWeek = useCallback(() => {
    const prevSlots = getPrevWeekMeals()
    const hasContent = prevSlots.flat().some(s => s?.adult || s?.kid)
    if (!hasContent) return
    for (let di = 0; di < 7; di++)
      for (let si = 0; si < 2; si++) {
        const s = prevSlots[di]?.[si]
        if (s?.adult) setMeal(di, si, { ...s.adult, _ai:false, _aiPending:false }, 'adult')
        if (s?.kid) setMeal(di, si, { ...s.kid, _ai:false, _aiPending:false }, 'kid')
      }
  }, [getPrevWeekMeals, setMeal])

  return (
    <div style={wrap}>
      {screen === S.PLANNING && (
        <PlanningScreen
          monday={monday} slots={slots} loadingWeek={loadingWeek} meals={meals}
          onPrevWeek={prevWeek} onNextWeek={nextWeek}
          onOpenDetail={openDetail} onOpenSelector={openSelector}
          onSetMeal={setMeal} onSwapMeals={swapMeals}
          onRegenSlot={regenSlot} onValidateSlot={validateSlot}
          onOpenLibrary={() => setScreen(S.LIBRARY)} onTriggerAI={triggerAI}
          onCopyPrevWeek={copyPrevWeek}
        />
      )}
      {screen === S.DETAIL && (
        <DetailScreen
          slot={detailSlot} di={detailDi} si={detailSi}
          onBack={goBack}
          onRemoveAdult={handleRemoveAdult}
          onRemoveKid={handleRemoveKid}
          onAddAdult={() => openSelectorFromDetail('adult')}
          onAddKid={() => openSelectorFromDetail('kid')}
          onEdit={editMeal}
        />
      )}
      {screen === S.SELECTOR && (
        <SelectorScreen
          meals={meals} slots={slots} monday={monday}
          di={selDi} si={selSi} mode={selMode}
          onBack={detailDi !== null ? goBackToDetail : goBack}
          onConfirm={handleConfirm}
        />
      )}
      {screen === S.LIBRARY && (
        <LibraryScreen
          meals={meals} onBack={goBack}
          onOpenDetail={(meal) => { setLibDetailMeal(meal); setScreen(S.LIB_DETAIL) }}
          onAdd={addMeal}
        />
      )}
      {screen === S.LIB_DETAIL && (
        <DetailScreen
          slot={{ adult: libDetailMeal, kid: null }}
          di={null} si={null}
          onBack={goBackToLibrary}
          onRemoveAdult={() => { deleteMeal(libDetailMeal.id); setScreen(S.LIBRARY) }}
          onRemoveKid={null}
          onAddAdult={null}
          onAddKid={null}
          onEdit={editMeal}
        />
      )}
    </div>
  )
}
