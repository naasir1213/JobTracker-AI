import { useRef } from 'react'
import { SORT_OPTIONS } from '../constants'
import {
  DownloadIcon,
  MoonIcon,
  PlusIcon,
  SearchIcon,
  SunIcon,
  UploadIcon,
} from './Icons'

export default function Header({
  search,
  onSearch,
  sort,
  onSortChange,
  theme,
  onToggleTheme,
  onExport,
  onImport,
  onAdd,
}) {
  const fileInputRef = useRef(null)

  function handleFileChange(event) {
    const file = event.target.files?.[0]
    if (file) onImport(file)
    event.target.value = ''
  }

  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
      <div className="flex flex-wrap items-center gap-3 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
            JT
          </div>
          <div className="leading-tight">
            <h1 className="text-base font-semibold text-slate-900 dark:text-slate-100">Job Tracker</h1>
            <p className="text-xs text-slate-400 dark:text-slate-500">Local-first · saved in your browser</p>
          </div>
        </div>

        <div className="relative order-last w-full sm:order-none sm:ml-4 sm:w-auto sm:flex-1 sm:max-w-md">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search by company or role…"
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:ring-indigo-900/40"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            title="Sort cards"
            className="hidden rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm text-slate-600 outline-none focus:border-indigo-500 md:block dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={onToggleTheme}
            title="Toggle light / dark mode"
            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-slate-100"
          >
            {theme === 'dark' ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
          </button>

          <button
            type="button"
            onClick={onExport}
            title="Export data as JSON"
            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-slate-100"
          >
            <DownloadIcon className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Import data from JSON"
            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-slate-100"
          >
            <UploadIcon className="h-4 w-4" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => onAdd()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
          >
            <PlusIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Add job</span>
          </button>
        </div>
      </div>
    </header>
  )
}
