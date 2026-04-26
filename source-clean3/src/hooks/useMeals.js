// src/hooks/useMeals.js
import { useState, useEffect, useCallback } from 'react'
import { fetchMeals, createMeal, updateMeal, deleteMeal } from '../lib/airtable'
import { DEMO_MEALS } from '../lib/constants'

function hasAirtable() {
  const token = import.meta.env.VITE_AIRTABLE_TOKEN || ''
  const base = import.meta.env.VITE_AIRTABLE_BASE_ID || ''
  return (
    token.length > 10 &&
    token !== 'your_personal_access_token_here' &&
    base.length > 5 &&
    base !== 'your_base_id_here'
  )
}

export function useMeals() {
  const [meals, setMeals] = useState(DEMO_MEALS) // démo par défaut immédiatement
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    if (!hasAirtable()) {
      // Pas de config Airtable → données démo, pas de loading
      setMeals(DEMO_MEALS)
      return
    }
    try {
      setLoading(true)
      const data = await fetchMeals()
      setMeals(data.length > 0 ? data : DEMO_MEALS)
    } catch (e) {
      console.error('Airtable fetch error:', e)
      setError(e.message)
      setMeals(DEMO_MEALS)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const addMeal = useCallback(async (meal) => {
    if (!hasAirtable()) {
      const newMeal = { ...meal, id: `local-${Date.now()}` }
      setMeals(prev => [...prev, newMeal])
      return newMeal
    }
    const newMeal = await createMeal(meal)
    setMeals(prev => [...prev, newMeal])
    return newMeal
  }, [])

  const editMeal = useCallback(async (id, meal) => {
    if (hasAirtable()) await updateMeal(id, meal)
    setMeals(prev => prev.map(m => m.id === id ? { ...m, ...meal } : m))
  }, [])

  const removeMeal = useCallback(async (id) => {
    if (hasAirtable()) await deleteMeal(id)
    setMeals(prev => prev.filter(m => m.id !== id))
  }, [])

  return { meals, loading, error, addMeal, editMeal, removeMeal, reload: load }
}
