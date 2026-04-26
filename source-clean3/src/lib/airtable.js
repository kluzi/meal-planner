// src/lib/airtable.js
// Couche d'accès Airtable — toutes les opérations CRUD passent ici

const TOKEN = import.meta.env.VITE_AIRTABLE_TOKEN
const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID
const API_URL = `https://api.airtable.com/v0/${BASE_ID}`

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  'Content-Type': 'application/json',
}

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, { headers, ...options })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || `Airtable error ${res.status}`)
  }
  return res.json()
}

// ─── REPAS (bibliothèque) ───────────────────────────────────────────────────

export async function fetchMeals() {
  const records = []
  let offset = null
  do {
    const params = new URLSearchParams({ pageSize: '100' })
    if (offset) params.set('offset', offset)
    const data = await request(`/Repas?${params}`)
    records.push(...data.records)
    offset = data.offset || null
  } while (offset)

  return records.map(r => ({
    id: r.id,
    name: r.fields.Nom || '',
    tags: r.fields.Tags ? r.fields.Tags.split(',').map(t => t.trim()) : [],
    ings: r.fields.Ingrédients ? r.fields.Ingrédients.split('\n').filter(Boolean) : [],
    steps: r.fields.Étapes ? r.fields.Étapes.split('\n').filter(Boolean) : [],
  }))
}

export async function createMeal(meal) {
  const data = await request('/Repas', {
    method: 'POST',
    body: JSON.stringify({
      fields: {
        Nom: meal.name,
        Tags: meal.tags.join(', '),
        Ingrédients: meal.ings.join('\n'),
        Étapes: meal.steps.join('\n'),
      },
    }),
  })
  return { id: data.id, ...meal }
}

export async function updateMeal(id, meal) {
  await request(`/Repas/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({
      fields: {
        Nom: meal.name,
        Tags: meal.tags.join(', '),
        Ingrédients: meal.ings.join('\n'),
        Étapes: meal.steps.join('\n'),
      },
    }),
  })
}

export async function deleteMeal(id) {
  await request(`/Repas/${id}`, { method: 'DELETE' })
}

// ─── PLANNING (semaines) ────────────────────────────────────────────────────
// Chaque record = 1 semaine, identifiée par la date du lundi (ISO string)
// Les 14 slots sont stockés en JSON dans un champ "Slots"

export async function fetchPlanning(mondayISO) {
  const formula = encodeURIComponent(`{Semaine} = '${mondayISO}'`)
  const data = await request(`/Planning?filterByFormula=${formula}`)
  if (!data.records.length) return null
  const r = data.records[0]
  return {
    id: r.id,
    monday: mondayISO,
    // slots: tableau 7×2 sérialisé en JSON
    slots: r.fields.Slots ? JSON.parse(r.fields.Slots) : null,
  }
}

export async function savePlanning(mondayISO, slots, existingId = null) {
  const fields = {
    Semaine: mondayISO,
    Slots: JSON.stringify(slots),
  }
  if (existingId) {
    await request(`/Planning/${existingId}`, {
      method: 'PATCH',
      body: JSON.stringify({ fields }),
    })
    return existingId
  } else {
    const data = await request('/Planning', {
      method: 'POST',
      body: JSON.stringify({ fields }),
    })
    return data.id
  }
}
