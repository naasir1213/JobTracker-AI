import { useEffect, useState } from 'react'
import { COLUMNS } from '../constants'
import { todayISO } from '../helpers'
import { CloseIcon } from './Icons'

const inputClass =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:ring-indigo-900/40'

function emptyJob(status = 'wishlist') {
  return {
    company: '',
    role: '',
    linkedinUrl: '',
    resume: '',
    dateApplied: todayISO(),
    salary: '',
    notes: '',
    status,
  }
}

function Field({ label, required, error, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">
        {label} {required && <span className="text-rose-500">*</span>}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-rose-500">{error}</span>}
    </label>
  )
}

export default function JobFormModal({ open, job, statusPreset, resumeOptions, onClose, onSave }) {
  const [form, setForm] = useState(emptyJob())
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!open) return
    setForm(job ? { ...emptyJob(), ...job } : emptyJob(statusPreset))
    setErrors({})
  }, [open, job, statusPreset])

  useEffect(() => {
    if (!open) return
    function onKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = {}
    if (!form.company.trim()) nextErrors.company = 'Company name is required'
    if (!form.role.trim()) nextErrors.role = 'Job title is required'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    onSave({
      ...form,
      company: form.company.trim(),
      role: form.role.trim(),
      linkedinUrl: form.linkedinUrl.trim(),
      resume: form.resume.trim(),
      salary: form.salary.trim(),
      notes: form.notes.trim(),
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="scrollbar-thin max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:max-w-lg sm:rounded-2xl dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            {job ? 'Edit job' : 'Add new job'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Company name" required error={errors.company}>
              <input
                autoFocus
                value={form.company}
                onChange={(e) => update('company', e.target.value)}
                placeholder="e.g. Stripe"
                className={inputClass}
              />
            </Field>

            <Field label="Job title / role" required error={errors.role}>
              <input
                value={form.role}
                onChange={(e) => update('role', e.target.value)}
                placeholder="e.g. Senior SDE"
                className={inputClass}
              />
            </Field>
          </div>

          <Field label="LinkedIn job URL">
            <input
              type="url"
              value={form.linkedinUrl}
              onChange={(e) => update('linkedinUrl', e.target.value)}
              placeholder="https://www.linkedin.com/jobs/view/…"
              className={inputClass}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Resume used">
              <input
                list="resume-options"
                value={form.resume}
                onChange={(e) => update('resume', e.target.value)}
                placeholder="SDE_Resume_v3"
                className={inputClass}
              />
              <datalist id="resume-options">
                {resumeOptions.map((name) => (
                  <option key={name} value={name} />
                ))}
              </datalist>
            </Field>

            <Field label="Date applied">
              <input
                type="date"
                value={form.dateApplied}
                onChange={(e) => update('dateApplied', e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Salary range">
              <input
                value={form.salary}
                onChange={(e) => update('salary', e.target.value)}
                placeholder="₹25-30 LPA or $150-180K"
                className={inputClass}
              />
            </Field>

            <Field label="Status">
              <select
                value={form.status}
                onChange={(e) => update('status', e.target.value)}
                className={inputClass}
              >
                {COLUMNS.map((column) => (
                  <option key={column.id} value={column.id}>
                    {column.title}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Notes">
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => update('notes', e.target.value)}
              placeholder="Recruiter name, referral, next steps…"
              className={`${inputClass} resize-none`}
            />
          </Field>

          <div className="flex justify-end gap-2 border-t border-slate-200 pt-4 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
            >
              {job ? 'Save changes' : 'Add job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
