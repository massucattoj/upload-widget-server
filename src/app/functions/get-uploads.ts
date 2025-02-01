import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeRight } from '@/shared/either'
import { asc, count, desc, ilike } from 'drizzle-orm'
import { z } from 'zod'

const getUploadsInput = z.object({
  searchQuery: z.string().optional(),
  sortBy: z.enum(['createdAt']).optional(),
  sortDirection: z.enum(['asc', 'desc']).optional(),
  page: z.number().optional().default(1),
  pageSize: z.number().optional().default(20),
})

type GetUploadsInput = z.input<typeof getUploadsInput>

type GetUploadsOutput = {
  uploads: {
    id: string
    name: string
    remoteKey: string
    remoteUrl: string
    createdAt: Date
  }[]
  total: number
}

export async function getUploads(
  input: GetUploadsInput
): Promise<Either<never, GetUploadsOutput>> {
  const { searchQuery, sortBy, sortDirection, page, pageSize } =
    getUploadsInput.parse(input)

  const [uploads, [{ total }]] = await Promise.all([
    db
      .select({
        id: schema.uploads.id,
        name: schema.uploads.name,
        remoteKey: schema.uploads.remoteKey,
        remoteUrl: schema.uploads.remoteUrl,
        createdAt: schema.uploads.createdAt,
      })
      .from(schema.uploads)
      .where(
        searchQuery ? ilike(schema.uploads.name, `%${searchQuery}%`) : undefined // usage of % start and end to indicate that the searchQuery can be anywhere in the name
      )
      .orderBy(fields => {
        if (sortBy && sortDirection === 'asc') {
          return asc(fields[sortBy])
        }

        if (sortBy && sortDirection === 'desc') {
          return desc(fields[sortBy])
        }

        return desc(fields.id) //  we can use id since we'r using uuidv7. uuidv7 is a time-based UUID -> sortable
      })
      .offset((page - 1) * pageSize)
      .limit(pageSize),

    /**
     * Use same query without order by or pagination to get the total count
     */
    db
      .select({ total: count(schema.uploads.id) })
      .from(schema.uploads)
      .where(
        searchQuery ? ilike(schema.uploads.name, `%${searchQuery}%`) : undefined // usage of % start and end to indicate that the searchQuery can be anywhere in the name
      ),
  ])

  return makeRight({ uploads, total })
}
