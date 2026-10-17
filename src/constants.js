export const COLUMNS = [
  {
    id: 'wishlist',
    title: 'Wishlist',
    hint: 'Saved, not applied yet',
    accent: 'border-slate-400',
    dot: 'bg-slate-400',
    badge: 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
  },
  {
    id: 'applied',
    title: 'Applied',
    hint: 'Application submitted',
    accent: 'border-blue-500',
    dot: 'bg-blue-500',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  },
  {
    id: 'followup',
    title: 'Follow-up',
    hint: 'Reached out to recruiter',
    accent: 'border-amber-500',
    dot: 'bg-amber-500',
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
  },
  {
    id: 'interview',
    title: 'Interview',
    hint: 'In interview rounds',
    accent: 'border-violet-500',
    dot: 'bg-violet-500',
    badge: 'bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300',
  },
  {
    id: 'offer',
    title: 'Offer',
    hint: 'Offer received',
    accent: 'border-emerald-500',
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
  },
  {
    id: 'rejected',
    title: 'Rejected',
    hint: 'Got a rejection',
    accent: 'border-rose-500',
    dot: 'bg-rose-500',
    badge: 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300',
  },
]

export const STATUS_IDS = COLUMNS.map((c) => c.id)

export const SORT_OPTIONS = [
  { id: 'newest', label: 'Date applied: newest' },
  { id: 'oldest', label: 'Date applied: oldest' },
  { id: 'company', label: 'Company: A–Z' },
]

export function getColumn(statusId) {
  return COLUMNS.find((c) => c.id === statusId) || COLUMNS[0]
}
