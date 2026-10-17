import { useDroppable } from '@dnd-kit/core'
import JobCard from './JobCard'
import { PlusIcon } from './Icons'

export default function Column({ column, jobs, onEdit, onDelete, onAdd }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id })

  return (
    <section className="flex h-full w-72 shrink-0 flex-col rounded-xl border border-slate-200 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/40">
      <header className="flex items-center gap-2 border-b border-slate-200 px-3 py-2.5 dark:border-slate-800">
        <span className={`h-2.5 w-2.5 rounded-full ${column.dot}`} />
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">{column.title}</h2>
        <span className={`ml-auto rounded-full px-2 py-0.5 text-xs font-semibold ${column.badge}`}>
          {jobs.length}
        </span>
        <button
          type="button"
          title={`Add to ${column.title}`}
          onClick={() => onAdd(column.id)}
          className="rounded-md p-1 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        >
          <PlusIcon className="h-4 w-4" />
        </button>
      </header>

      <div
        ref={setNodeRef}
        className={`scrollbar-thin flex-1 space-y-2 overflow-y-auto p-2 transition-colors ${
          isOver ? 'bg-indigo-50/70 dark:bg-indigo-950/30' : ''
        }`}
      >
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} onEdit={onEdit} onDelete={onDelete} />
        ))}

        {jobs.length === 0 && (
          <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-slate-300 text-xs text-slate-400 dark:border-slate-700 dark:text-slate-600">
            {isOver ? 'Drop here' : 'No jobs yet'}
          </div>
        )}
      </div>
    </section>
  )
}
