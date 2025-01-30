import { randomUUID } from 'node:crypto'
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { uuidv7 } from 'uuidv7'

export const uploads = pgTable('uploadas', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  name: text('name').notNull(),
  remoteKey: text('remote_key').notNull().unique(), // This is the key to access the file in the storage
  remoteUrl: text('remote_url').notNull(), // This is the URL to access the file in the storage
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// createdAt: timestamp('created_at', { withTimezone: true })
//     .defaultNow()
//     .notNull(),
// use timezone when you need some kind of comparison between dates
