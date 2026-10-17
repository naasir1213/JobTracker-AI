import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { getColumn } from '../constants'
import { formatDays, formatDate, normalizeUrl } from '../helpers'
import { CalendarIcon, LinkedInIcon, PencilIcon, TrashIcon } from './Icons'

function ResumeTag({ resume }) {
  if (!resume) return null
  return (
    <span className="inline-flex max-w-full items-center gap-1 truncate rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
      <span className="text-slate-400 dark:text-slate-500">CV</span>
      <span className="truncate">{resume}</span>
    </span>
  )
}

export function JobCardBody({ job, dragging = false }) {
  const column = getColumn(job.status)
  const url = normalizeUrl(job.linkedinUrl)

  return (
    <div
      className={`rounded-lg border border-slate-200 bg-white p-3 text-left shadow-sm transition ${
        dragging ? 'shadow-xl ring-2 ring-indigo-400' : 'hover:border-slate-300 hover:shadow'
      } dark:border-slate-800 dark:bg-slate-900`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
            {job.company}
          </h3>
          <p className="truncate text-xs text-slate-500 dark:text-slate-400">{job.role}</p>
        </div>
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            title="Open LinkedIn posting"
            onPointerDown={(e) => e.stopPropagation()}
            className="shrink-0 rounded-md p-1.5 text-[#0A66C2] transition hover:bg-[#0A66C2]/10 dark:text-sky-400"
          >
            <LinkedInIcon className="h-4 w-4" />
          </a>
        )}
      </div>

      <div className="mt-2.5 flex flex-wrap items-center gap-2">
        <ResumeTag resume={job.resume} />
        {job.salary && (
          <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
            {job.salary}
          </span>
        )}
      </div>

      {job.notes && (
        <p className="mt-2 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">{job.notes}</p>
      )}

      <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
        <CalendarIcon className="h-3.5 w-3.5" />
        <span>{formatDays(job.dateApplied)}</span>
        <span className="text-slate-300 dark:text-slate-600">•</span>
        <span>{formatDate(job.dateApplied)}</span>
      </div>
    </div>
  )
}

export default function JobCard({ job, onEdit, onDelete }) {
  const column = getColumn(job.status)
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: job.id,
    data: { job },
  })

  const style = transform ? { transform: CSS.Translate.toString(transform) } : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`group relative cursor-grab touch-none border-l-4 pl-0 active:cursor-grabbing ${column.accent} ${
        isDragging ? 'opacity-40' : ''
      }`}
    >
      <JobCardBody job={job} />

      <div className="absolute right-2 top-9 flex gap-1 opacity-0 transition group-hover:opacity-100 focus-within:opacity-100">
        <button
          type="button"
          title="Edit"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => onEdit(job)}
          className="rounded-md border border-slate-200 bg-white p-1.5 text-slate-500 shadow-sm transition hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-indigo-400"
        >
          <PencilIcon className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          title="Delete"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => onDelete(job)}
          className="rounded-md border border-slate-200 bg-white p-1.5 text-slate-500 shadow-sm transition hover:text-rose-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-rose-400"
        >
          <TrashIcon className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
