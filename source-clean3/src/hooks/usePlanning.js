// src/hooks/usePlanning.js
import { useState, useEffect, useCallback, useRef } from 'react'
import { fetchPlanning, savePlanning } from '../lib/airtable'
import { getMondayOf, addDays, toISODate, emptyWeekSlots } from '../lib/dates'

const HAS_AIRTABLE =
  import.meta.env.VITE_AIRTABLE_TOKEN &&
  import.meta.env.VITE_AIRTABLE_TOKEN !== 'your_personal_access_token_here' &&
  import.meta.env.VITE_AIRTABLE_BASE_ID &&
  import.meta.env.VITE_AIRTABLE_BASE_ID !== 'your_base_id_here'

// Cache local en mémoire : { "2024-04-22": { id, slots } }
const cache = {}

export function usePlanning() {
  const [monday, setMonday] = useState(() => getMondayOf(new Date()))
  const [slots, setSlots] = useState(emptyWeekSlots)
  const [planningId, setPlanningId] = useState(null)
  const [loadingWeek, setLoadingWeek] = useState(false)
  const saveTimer = useRef(null)

  // Charge la semaine active
  useEffect(() => {
    const key = toISODate(monday)
    if (cache[key]) {
      setSlots(cache[key].slots)
      setPlanningId(cache[key].id)
      return
    }
    if (!HAS_AIRTABLE) {
      const empty = emptyWeekSlots()
      cache[key] = { id: null, slots: empty }
      setSlots(empty)
      setPlanningId(null)
      return
    }
    setLoadingWeek(true)
    fetchPlanning(key)
      .then(data => {
        const s = data?.slots || emptyWeekSlots()
        const id = data?.id || null
        cache[key] = { id, slots: s }
        setSlots(s)
        setPlanningId(id)
      })
      .catch(console.error)
      .finally(() => setLoadingWeek(false))
  }, [monday])

  // Auto-save avec debounce 1s
  const persist = useCallback((newSlots, id) => {
    if (!HAS_AIRTABLE) return
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      try {
        const key = toISODate(monday)
        const newId = await savePlanning(key, newSlots, id)
        if (!id) {
          setPlanningId(newId)
          cache[key] = { id: newId, slots: newSlots }
        }
      } catch (e) {
        console.error('Save error:', e)
      }
    }, 1000)
  }, [monday])

  const updateSlots = useCallback((newSlots) => {
    const key = toISODate(monday)
    cache[key] = { ...cache[key], slots: newSlots }
    setSlots(newSlots)
    persist(newSlots, planningId)
  }, [monday, planningId, persist])

  const setMeal = useCallback((di, si, meal) => {
    setSlots(prev => {
      const next = prev.map(row => [...row])
      next[di][si] = meal
      const key = toISODate(monday)
      cache[key] = { ...cache[key], slots: next }
      persist(next, planningId)
      return next
    })
  }, [monday, planningId, persist])

  const removeMeal = useCallback((di, si) => {
    setMeal(di, si, null)
  }, [setMeal])

  const swapMeals = useCallback((di1, si1, di2, si2) => {
    setSlots(prev => {
      const next = prev.map(row => [...row])
      ;[next[di1][si1], next[di2][si2]] = [next[di2][si2], next[di1][si1]]
      const key = toISODate(monday)
      cache[key] = { ...cache[key], slots: next }
      persist(next, planningId)
      return next
    })
  }, [monday, planningId, persist])

  const prevWeek = useCallback(() => setMonday(m => addDays(m, -7)), [])
  const nextWeek = useCallback(() => setMonday(m => addDays(m, 7)), [])

  // Données de la semaine précédente (pour anti-répétition IA)
  const getPrevWeekMeals = useCallback(() => {
    const prevKey = toISODate(addDays(monday, -7))
    return cache[prevKey]?.slots || emptyWeekSlots()
  }, [monday])

  return {
    monday,
    slots,
    loadingWeek,
    setMeal,
    removeMeal,
    swapMeals,
    updateSlots,
    prevWeek,
    nextWeek,
    getPrevWeekMeals,
  }
}
