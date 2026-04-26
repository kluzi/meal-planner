// src/lib/dates.js

export const DAY_NAMES = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

// Retourne le lundi de la semaine contenant `date`
export function getMondayOf(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  const day = d.getDay() // 0=dim, 1=lun...
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  return d
}

// Ajoute `days` jours à une date
export function addDays(date, days) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

// Format ISO d'un lundi pour clé Airtable : "2024-04-22"
export function toISODate(date) {
  return date.toISOString().split('T')[0]
}

// Format label de semaine : "21 – 27 avr. 2025"
export function formatWeekLabel(monday) {
  const sunday = addDays(monday, 6)
  const opts = { day: 'numeric', month: 'short' }
  const optsYear = { day: 'numeric', month: 'short', year: 'numeric' }
  const start = monday.toLocaleDateString('fr-FR', opts)
  const end = sunday.toLocaleDateString('fr-FR', optsYear)
  return `${start} – ${end}`
}

// Format date courte : "Lundi 22 avr."
export function formatDayFull(date) {
  return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'short' })
}

// Est-ce aujourd'hui ?
export function isToday(date) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d.getTime() === today.getTime()
}

// Crée une grille vide 7×2
export function emptyWeekSlots() {
  return Array.from({ length: 7 }, () => [null, null])
}
