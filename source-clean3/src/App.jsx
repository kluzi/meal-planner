import { useState, useCallback } from 'react'
import { PlanningScreen } from './screens/PlanningScreen'
import { DetailScreen } from './screens/DetailScreen'
import { SelectorScreen } from './screens/SelectorScreen'
import { LibraryScreen } from './screens/LibraryScreen'
import { useMeals } from './hooks/useMeals'
import { usePlanning } from './hooks/usePlanning'

const S = { PLANNING: 0, DETAIL: 1, SELECTOR: 2, LIBRARY: 3 }

const wrap = {
  position: 'fixed',
  inset: 0,
  width: '100vw',
  height: '100dvh',
  overflow: 'hidden',
  background: '#F2F2F7',
}

export default function App() {
  const { meals, addMeal, editMeal, removeMeal: deleteMeal } = useMeals()
  const { monday, slots, loadingWeek, setMeal, removeMeal, swapMeals, prevWeek, nextWeek, getPrevWeekMeals } = usePlanning()

  const [screen, setScreen] = useState(S.PLANNING)
  const [detailMeal, setDetailMeal] = useState(null)
  const [detailDi, setDetailDi] = useState(null)
  const [detailSi, setDetailSi] = useState(null)
  const [selDi, setSelDi] = useState(null)
  const [selSi, setSelSi] = useState(null)

  const goBack = useCallback(() => setScreen(S.PLANNING), [])
  const goBackToLibrary = useCallback(() => setScreen(S.LIBRARY), [])

  const openDetail = useCallback((meal, di, si) => {
    setDetailMeal(meal); setDetailDi(di); setDetailSi(si)
    setScreen(S.DETAIL)
  }, [])

  const handleRemove = useCallback(() => {
    if (detailDi !== null) {
      removeMeal(detailDi, detailSi)
      setSelDi(detailDi); setSelSi(detailSi)
      setScreen(S.SELECTOR)
    }
  }, [detailDi, detailSi, removeMeal])

  const handleDelete = useCallback(() => {
    if (detailMeal) {
      deleteMeal(detailMeal.id)
      setScreen(S.LIBRARY)
    }
  }, [detailMeal, deleteMeal])

  const openSelector = useCallback((di, si) => {
    setSelDi(di); setSelSi(si)
    setScreen(S.SELECTOR)
  }, [])

  const handleConfirm = useCallback((meal) => {
    setMeal(selDi, selSi, { id: meal.id, name: meal.name, tags: [...(meal.tags||[])], ings: meal.ings||[], steps: meal.steps||[] })
    setScreen(S.PLANNING)
  }, [selDi, selSi, setMeal])

  const triggerAI = useCallback(() => {
    const usedNames = new Set(slots.flat().filter(Boolean).map(m => m.name))
    const prevSlots = getPrevWeekMeals()
    const prevNames = new Set(prevSlots.flat().filter(Boolean).map(m => m?.name).filter(Boolean))
    const empty = []
    for (let di = 0; di < 7; di++)
      for (let si = 0; si < 2; si++)
        if (!slots[di]?.[si]) empty.push({ di, si })
    if (!empty.length) return
    const scored = [...meals].map(m => ({ ...m, score: (usedNames.has(m.name)?-20:0)+(prevNames.has(m.name)?-8:0)+Math.random()*3 })).sort((a,b)=>b.score-a.score)
    let i = 0
    const next = () => {
      if (i >= empty.length) return
      const { di, si } = empty[i]
      const pool = scored.length ? scored : [...meals]
      const pick = pool[0]
      setMeal(di, si, { id:pick.id, name:pick.name, tags:[...(pick.tags||[])], ings:pick.ings||[], steps:pick.steps||[], _ai:true, _aiPending:true })
      scored.splice(scored.indexOf(pick),1); i++
      setTimeout(next, 160)
    }
    setTimeout(next, 200)
  }, [slots, meals, getPrevWeekMeals, setMeal])

  const regenSlot = useCallback((di, si) => {
    const usedNames = new Set(slots.flat().filter(Boolean).map(m => m.name))
    usedNames.delete(slots[di]?.[si]?.name)
    const pool = [...meals].filter(m => !usedNames.has(m.name)).sort(()=>Math.random()-0.5)
    if (pool.length) {
      const pick = pool[0]
      setMeal(di, si, { id:pick.id, name:pick.name, tags:[...(pick.tags||[])], ings:pick.ings||[], steps:pick.steps||[], _ai:true, _aiPending:true })
    }
  }, [slots, meals, setMeal])

  const validateSlot = useCallback((di, si) => {
    const meal = slots[di]?.[si]
    if (meal) setMeal(di, si, { ...meal, _ai:true, _aiPending:false })
  }, [slots, setMeal])

  const copyPrevWeek = useCallback(() => {
    const prevSlots = getPrevWeekMeals()
    const hasContent = prevSlots.flat().some(Boolean)
    if (!hasContent) return
    for (let di = 0; di < 7; di++)
      for (let si = 0; si < 2; si++)
        if (prevSlots[di]?.[si]) setMeal(di, si, { ...prevSlots[di][si], _ai: false, _aiPending: false })
  }, [getPrevWeekMeals, setMeal])

  const fromLibrary = detailDi === null && detailSi === null

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
          meal={detailMeal} di={detailDi} si={detailSi}
          onBack={fromLibrary ? goBackToLibrary : goBack}
          onRemove={handleRemove}
          onDelete={fromLibrary ? handleDelete : undefined}
          onEdit={editMeal}
        />
      )}
      {screen === S.SELECTOR && (
        <SelectorScreen meals={meals} slots={slots} monday={monday} di={selDi} si={selSi} onBack={goBack} onConfirm={handleConfirm} />
      )}
      {screen === S.LIBRARY && (
        <LibraryScreen meals={meals} onBack={goBack} onOpenDetail={openDetail} onAdd={addMeal} />
      )}
    </div>
  )
}
