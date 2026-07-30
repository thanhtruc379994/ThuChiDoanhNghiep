import { DB_NAME, DB_VERSION, ensureDatabaseStores } from './databaseSchema'
const DATA_STORE = 'app-data'

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = () => {
      const database = request.result
      ensureDatabaseStores(database)
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

function requestToPromise(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function readAppData(key) {
  const database = await openDatabase()
  try {
    const transaction = database.transaction(DATA_STORE, 'readonly')
    const record = await requestToPromise(transaction.objectStore(DATA_STORE).get(key))
    return record?.value
  } finally {
    database.close()
  }
}

export async function writeAppData(key, value) {
  const database = await openDatabase()
  try {
    const transaction = database.transaction(DATA_STORE, 'readwrite')
    await requestToPromise(transaction.objectStore(DATA_STORE).put({
      key,
      value,
      updatedAt: new Date().toISOString(),
    }))
  } finally {
    database.close()
  }
}
