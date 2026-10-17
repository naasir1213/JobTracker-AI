import { useCallback, useEffect, useMemo, useState } from 'react'
import Header from './components/Header'
import Board from './components/Board'
import JobFormModal from './components/JobFormModal'
import ConfirmDialog from './components/ConfirmDialog'
import { STATUS_IDS } from './constants'
import { addJob, deleteJob, getAllJobs, replaceAllJobs, updateJob } from './db'
import { todayISO } from './helpers'

const THEME_KEY = 'jobtracker-theme'

function initialTheme() {
  const stored = localStorage.getItem(THEME_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function sanitizeJob(raw) {
  const status = STATUS_IDS.includes(raw?.status) ? raw.status : 'wishlist'
  return {
    id: typeof raw?.id === 'string' && raw.id ? raw.id : crypto.randomUUID(),
    company: String(raw?.company ?? '').trim(),
    role: String(raw?.role ?? '').trim(),
    linkedinUrl: String(raw?.linkedinUrl ?? '').trim(),
    resume: String(raw?.resume ?? '').trim(),
    dateApplied: String(raw?.dateApplied ?? '').trim(),
    salary: String(raw?.salary ?? '').trim(),
    notes: String(raw?.notes ?? '').trim(),
    status,
    createdAt: raw?.createdAt ?? new Date().toISOString(),
  }
}

export default function App() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')
  const [theme, setTheme] = useState(initialTheme)
  const [modal, setModal] = useState({ open: false, job: null, statusPreset: 'wishlist' })
  const [confirmState, setConfirmState] = useState(null)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  useEffect(() => {
    getAllJobs()
      .then((rows) => setJobs(rows))
      .catch((error) => console.error('Failed to load jobs', error))
      .finally(() => setLoading(false))
  }, [])

  const showToast = useCallback((message) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 3000)
  }, [])

  const resumeOptions = useMemo(() => {
    const names = jobs.map((job) => job.resume).filter(Boolean)
    return [...new Set(names)].sort((a, b) => a.localeCompare(b))
  }, [jobs])

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return jobs
    return jobs.filter(
      (job) =>
        job.company.toLowerCase().includes(query) || job.role.toLowerCase().includes(query),
    )
  }, [jobs, search])

  const jobsByColumn = useMemo(() => {
    const grouped = Object.fromEntries(STATUS_IDS.map((id) => [id, []]))
    for (const job of filteredJobs) {
      if (grouped[job.status]) grouped[job.status].push(job)
    }

    const comparators = {
      newest: (a, b) => (b.dateApplied || '').localeCompare(a.dateApplied || ''),
      oldest: (a, b) => (a.dateApplied || '').localeCompare(b.dateApplied || ''),
      company: (a, b) => a.company.localeCompare(b.company),
    }
    const compare = comparators[sort] ?? comparators.newest
    for (const id of STATUS_IDS) grouped[id].sort(compare)
    return grouped
  }, [filteredJobs, sort])

  const totalCount = Object.values(jobsByColumn).reduce((sum, list) => sum + list.length, 0)

  function openAdd(statusPreset = 'wishlist') {
    setModal({ open: true, job: null, statusPreset })
  }

  function openEdit(job) {
    setModal({ open: true, job, statusPreset: job.status })
  }

  async function handleSave(data) {
    if (modal.job) {
      const updated = { ...modal.job, ...data }
      await updateJob(updated)
      setJobs((prev) => prev.map((job) => (job.id === updated.id ? updated : job)))
      showToast('Job updated')
    } else {
      const created = await addJob(data)
      setJobs((prev) => [created, ...prev])
      showToast('Job added')
    }
    setModal({ open: false, job: null, statusPreset: 'wishlist' })
  }

  function handleDelete(job) {
    setConfirmState({
      title: 'Delete job',
      message: `Remove “${job.company} — ${job.role}” from your tracker? This cannot be undone.`,
      confirmLabel: 'Delete',
      action: async () => {
        await deleteJob(job.id)
        setJobs((prev) => prev.filter((item) => item.id !== job.id))
        setConfirmState(null)
        showToast('Job deleted')
      },
    })
  }

  async function handleMove(job, status) {
    const updated = { ...job, status }
    setJobs((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
    await updateJob(updated)
  }

  function handleExport() {
    const payload = {
      app: 'jobtracker-ai',
      exportedAt: new Date().toISOString(),
      jobs,
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `jobtracker-backup-${todayISO()}.json`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
    showToast(`Exported ${jobs.length} job${jobs.length === 1 ? '' : 's'}`)
  }

  async function handleImport(file) {
    try {
      const text = await file.text()
      const parsed = JSON.parse(text)
      const rawJobs = Array.isArray(parsed) ? parsed : parsed?.jobs
      if (!Array.isArray(rawJobs)) throw new Error('No job list found in file')

      const imported = rawJobs.map(sanitizeJob).filter((job) => job.company || job.role)
      if (imported.length === 0) throw new Error('File contains no valid jobs')

      setConfirmState({
        title: 'Import data',
        message: `Replace all current data with ${imported.length} job${
          imported.length === 1 ? '' : 's'
        } from “${file.name}”?`,
        confirmLabel: 'Import',
        danger: false,
        action: async () => {
          await replaceAllJobs(imported)
          setJobs(imported)
          setConfirmState(null)
          showToast(`Imported ${imported.length} job${imported.length === 1 ? '' : 's'}`)
        },
      })
    } catch (error) {
      showToast(`Import failed: ${error.message}`)
    }
  }

  return (
    <div className="flex h-full flex-col">
      <Header
        search={search}
        onSearch={setSearch}
        sort={sort}
        onSortChange={setSort}
        theme={theme}
        onToggleTheme={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
        onExport={handleExport}
        onImport={handleImport}
        onAdd={openAdd}
      />

      {loading ? (
        <div className="flex flex-1 items-center justify-center text-sm text-slate-400">
          Loading your jobs…
        </div>
      ) : jobs.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
          <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
            No jobs tracked yet
          </h2>
          <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">
            Add your first job to start organising applications across the board. Everything stays
            in your browser.
          </p>
          <button
            type="button"
            onClick={() => openAdd()}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
          >
            Add your first job
          </button>
        </div>
      ) : totalCount === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No jobs match “{search}”.
          </p>
          <button
            type="button"
            onClick={() => setSearch('')}
            className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
          >
            Clear search
          </button>
        </div>
      ) : (
        <Board
          jobsByColumn={jobsByColumn}
          onEdit={openEdit}
          onDelete={handleDelete}
          onAdd={openAdd}
          onMove={handleMove}
        />
      )}

      <JobFormModal
        open={modal.open}
        job={modal.job}
        statusPreset={modal.statusPreset}
        resumeOptions={resumeOptions}
        onClose={() => setModal({ open: false, job: null, statusPreset: 'wishlist' })}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={Boolean(confirmState)}
        title={confirmState?.title}
        message={confirmState?.message}
        confirmLabel={confirmState?.confirmLabel}
        danger={confirmState?.danger}
        onConfirm={() => confirmState?.action()}
        onCancel={() => setConfirmState(null)}
      />

      {toast && (
        <div className="pointer-events-none fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white shadow-lg dark:bg-slate-100 dark:text-slate-900">
          {toast}
        </div>
      )}
    </div>
  )
}
