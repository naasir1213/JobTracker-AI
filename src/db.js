import { openDB } from 'idb'

const DB_NAME = 'jobtracker-ai'
const DB_VERSION = 1
const STORE = 'jobs'

let dbPromise = null

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE)) {
          const store = db.createObjectStore(STORE, { keyPath: 'id' })
          store.createIndex('status', 'status')
        }
      },
    })
  }
  return dbPromise
}

export async function getAllJobs() {
  const db = await getDB()
  return db.getAll(STORE)
}

export async function addJob(job) {
  const db = await getDB()
  const record = {
    ...job,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }
  await db.put(STORE, record)
  return record
}

export async function updateJob(job) {
  const db = await getDB()
  await db.put(STORE, job)
  return job
}

export async function deleteJob(id) {
  const db = await getDB()
  await db.delete(STORE, id)
}

export async function replaceAllJobs(jobs) {
  const db = await getDB()
  const tx = db.transaction(STORE, 'readwrite')
  await tx.store.clear()
  await Promise.all(jobs.map((job) => tx.store.put(job)))
  await tx.done
}
