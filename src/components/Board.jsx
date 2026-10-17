import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { COLUMNS, STATUS_IDS, getColumn } from '../constants'
import Column from './Column'
import { JobCardBody } from './JobCard'

export default function Board({ jobsByColumn, onEdit, onDelete, onAdd, onMove }) {
  const [activeJob, setActiveJob] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  )

  function handleDragStart(event) {
    setActiveJob(event.active.data.current?.job ?? null)
  }

  function handleDragEnd(event) {
    const { active, over } = event
    setActiveJob(null)
    if (!over) return

    const job = active.data.current?.job
    const targetStatus = over.id
    if (job && STATUS_IDS.includes(targetStatus) && job.status !== targetStatus) {
      onMove(job, targetStatus)
    }
  }

  const activeColumn = activeJob ? getColumn(activeJob.status) : null

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveJob(null)}
    >
      <div className="scrollbar-thin flex flex-1 gap-4 overflow-x-auto p-4">
        {COLUMNS.map((column) => (
          <Column
            key={column.id}
            column={column}
            jobs={jobsByColumn[column.id] ?? []}
            onEdit={onEdit}
            onDelete={onDelete}
            onAdd={onAdd}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={null}>
        {activeJob ? (
          <div className={`w-72 border-l-4 ${activeColumn.accent}`}>
            <JobCardBody job={activeJob} dragging />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
