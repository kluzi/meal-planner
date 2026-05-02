// src/hooks/usePlanning.js
import { useState, useEffect, useCallback, useRef } from 'react'
import { fetchPlanning, savePlanning } from '../lib/airtable'
import { getMondayOf, addDays, toISODate, emptyWeekSlots } from '../lib/dates'

const HAS_AIRTABLE =
  import.meta.env.VITE_AIRTABLE_TOKEN &&
  import.meta.env.VITE_AIRTABLE_TOKEN !== 'your_personal_access_token_here' &&
  import.meta.env.VITE_AIRTABLE_BASE_ID &&
  import.meta.env.VITE_AIRTABLE_BASE_ID !== 'your_base_id_here'

const cache = {}

export function emptySlot() { return { adult: null, kid: null } }
export function emptyWeekSlotsV2() {
  return Array.from({ length: 7 }, () => [emptySlot(), emptySlot()])
}

function migrateSlots(slots) {
  if (!slots) return emptyWeekSlotsV2()
  return slots.map(daySlots =>
    (daySlots || []).map(slot => {
      if (!slot) return emptySlot()
      if (slot.adult !== undefined || slot.kid !== undefined) return slot
      return { adult: slot, kid: null }
    })
  )
}

export function usePlanning() {
  const [monday, setMonday] = useState(() => getMondayOf(new Date()))
  const [slots, setSlots] = useState(emptyWeekSlotsV2)
  const [planningId, setPlanningId] = useState(null)
  const [loadingWeek, setLoadingWeek] = useState(false)
  const saveTimer = useRef(null)

  useEffect(() => {
    const key = toISODate(monday)
    if (cache[key]) {
      setSlots(cache[key].slots)
      setPlanningId(cache[key].id)
      return
    }
    if (!HAS_AIRTABLE) {
      const empty = emptyWeekSlotsV2()
      cache[key] = { id: null, slots: empty }
      setSlots(empty)
      setPlanningId(null)
      return
    }
    setLoadingWeek(true)
    fetchPlanning(key)
      .then(data => {
        const raw = data?.slots || null
        const s = migrateSlots(raw)
        const id = data?.id || null
        cache[key] = { id, slots: s }
        setSlots(s)
        setPlanningId(id)
      })
      .catch(console.error)
      .finally(() => setLoadingWeek(false))
  }, [monday])

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

  const setMeal = useCallback((di, si, meal, role = 'adult') => {
    setSlots(prev => {
      const next = prev.map(row => row.map(slot => ({ ...slot })))
      const slot = next[di][si]
      if (role === 'kid') {
        next[di][si] = { ...slot, kid: meal }
      } else {
        next[di][si] = { ...slot, adult: meal }
      }
      const key = toISODate(monday)
      cache[key] = { ...cache[key], slots: next }
      persist(next, planningId)
      return next
    })
  }, [monday, planningId, persist])

  const removeMeal = useCallback((di, si, role = 'adult') => {
    setMeal(di, si, null, role)
  }, [setMeal])

  const swapMeals = useCallback((di1, si1, di2, si2) => {
    setSlots(prev => {
      const next = prev.map(row => row.map(slot => ({ ...slot })))
      ;[next[di1][si1], next[di2][si2]] = [next[di2][si2], next[di1][si1]]
      const key = toISODate(monday)
      cache[key] = { ...cache[key], slots: next }
      persist(next, planningId)
      return next
    })
  }, [monday, planningId, persist])

  const prevWeek = useCallback(() => setMonday(m => addDays(m, -7)), [])
  const nextWeek = useCallback(() => setMonday(m => addDays(m, 7)), [])

  const getPrevWeekMeals = useCallback(() => {
    const prevKey = toISODate(addDays(monday, -7))
    return cache[prevKey]?.slots || emptyWeekSlotsV2()
  }, [monday])

  return {
    monday, slots, loadingWeek,
    setMeal, removeMeal, swapMeals, updateSlots,
    prevWeek, nextWeek, getPrevWeekMeals,
  }
}
