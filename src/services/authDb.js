import { DB_NAME, DB_VERSION, ensureDatabaseStores } from './databaseSchema'

const USER_STORE = 'users'
const SESSION_STORE = 'sessions'
const CURRENT_SESSION = 'current'

function requestToPromise(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = () => {
      const database = request.result

      if (!database.objectStoreNames.contains(USER_STORE)) {
        const users = database.createObjectStore(USER_STORE, { keyPath: 'username' })
        users.add({
          username: 'admin',
          password: '123456',
          name: 'Quản trị viên',
          initials: 'QT',
          role: 'admin',
        })
      }

      ensureDatabaseStores(database)
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

async function withStore(storeName, mode, callback) {
  const database = await openDatabase()

  try {
    const transaction = database.transaction(storeName, mode)
    const store = transaction.objectStore(storeName)
    return await callback(store)
  } finally {
    database.close()
  }
}

function publicUser(user) {
  if (!user) return null
  return {
    username: user.username,
    name: user.name,
    initials: user.initials,
    role: user.role,
  }
}

export async function authenticate(username, password) {
  const normalizedUsername = username.trim().toLowerCase()
  const user = await withStore(USER_STORE, 'readonly', (store) =>
    requestToPromise(store.get(normalizedUsername)),
  )

  if (!user || user.password !== password) return null

  const account = publicUser(user)
  await withStore(SESSION_STORE, 'readwrite', (store) =>
    requestToPromise(store.put({
      id: CURRENT_SESSION,
      user: account,
      signedInAt: new Date().toISOString(),
    })),
  )
  return account
}

export async function getCurrentUser() {
  const session = await withStore(SESSION_STORE, 'readonly', (store) =>
    requestToPromise(store.get(CURRENT_SESSION)),
  )
  return session?.user || null
}

export async function clearSession() {
  await withStore(SESSION_STORE, 'readwrite', (store) =>
    requestToPromise(store.delete(CURRENT_SESSION)),
  )
}
