export const DB_NAME = 'thu-chi-doanh-nghiep'
export const DB_VERSION = 4

export const stores = {
  users: { keyPath: 'username', indexes: [['role', 'role']] },
  sessions: { keyPath: 'id', indexes: [['user', 'user']] },
  'app-data': { keyPath: 'key', indexes: [['updatedAt', 'updatedAt']] },
  transactions: {
    keyPath: 'id',
    indexes: [['date', 'date'], ['type', 'type'], ['accountId', 'accountId'], ['projectId', 'projectId'], ['categoryId', 'categoryId']],
  },
  accounts: { keyPath: 'id', indexes: [['name', 'name'], ['type', 'type']] },
  'account-transactions': {
    keyPath: 'id',
    indexes: [['accountId', 'accountId'], ['date', 'date']],
  },
  projects: { keyPath: 'id', indexes: [['status', 'status'], ['customerId', 'customerId']] },
  contracts: { keyPath: 'id', indexes: [['projectId', 'projectId'], ['supplierId', 'supplierId']] },
  categories: { keyPath: 'id', indexes: [['group', 'group'], ['active', 'active']] },
  customers: { keyPath: 'id', indexes: [['name', 'name'], ['taxCode', 'taxCode']] },
  suppliers: { keyPath: 'id', indexes: [['name', 'name'], ['taxCode', 'taxCode']] },
  'supplier-debts': {
    keyPath: 'id',
    indexes: [['supplierId', 'supplierId'], ['status', 'status'], ['dueDate', 'dueDate']],
  },
  employees: { keyPath: 'id', indexes: [['username', 'username'], ['role', 'role'], ['active', 'active']] },
  attachments: { keyPath: 'id', indexes: [['transactionId', 'transactionId'], ['projectId', 'projectId']] },
  invoices: {
    keyPath: 'id',
    indexes: [['transactionId', 'transactionId'], ['supplierId', 'supplierId'], ['customerId', 'customerId'], ['status', 'status']],
  },
  payments: {
    keyPath: 'id',
    indexes: [['accountId', 'accountId'], ['supplierId', 'supplierId'], ['customerId', 'customerId'], ['date', 'date']],
  },
  disbursements: {
    keyPath: 'id',
    indexes: [['accountId', 'accountId'], ['projectId', 'projectId'], ['status', 'status']],
  },
  notifications: {
    keyPath: 'id',
    indexes: [['userId', 'userId'], ['read', 'read'], ['createdAt', 'createdAt']],
  },
  'saved-filters': { keyPath: 'id', indexes: [['userId', 'userId'], ['module', 'module']] },
  'number-sequences': { keyPath: 'key' },
  settings: { keyPath: 'key' },
  'audit-logs': { keyPath: 'id', indexes: [['userId', 'userId'], ['createdAt', 'createdAt'], ['entity', 'entity']] },
}

export function ensureDatabaseStores(database) {
  Object.entries(stores).forEach(([name, definition]) => {
    const objectStore = database.objectStoreNames.contains(name)
      ? null
      : database.createObjectStore(name, { keyPath: definition.keyPath })

    if (!objectStore) return
    definition.indexes?.forEach(([indexName, field]) => {
      objectStore.createIndex(indexName, field, { unique: false })
    })
  })
}
