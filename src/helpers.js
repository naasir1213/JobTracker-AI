export function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export function daysSince(dateString) {
  if (!dateString) return null
  const then = new Date(dateString)
  if (Number.isNaN(then.getTime())) return null
  const startOfThen = new Date(then.getFullYear(), then.getMonth(), then.getDate())
  const now = new Date()
  const startOfNow = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const diff = Math.floor((startOfNow - startOfThen) / (1000 * 60 * 60 * 24))
  return diff
}

export function formatDays(dateString) {
  const days = daysSince(dateString)
  if (days === null) return 'No date'
  if (days <= 0) return 'Today'
  if (days === 1) return '1 day ago'
  return `${days} days ago`
}

export function formatDate(dateString) {
  if (!dateString) return '—'
  const d = new Date(dateString)
  if (Number.isNaN(d.getTime())) return dateString
  return d.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function normalizeUrl(url) {
  if (!url) return ''
  const trimmed = url.trim()
  if (!trimmed) return ''
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}
