import { randomUUID } from 'node:crypto'
import { Readable } from 'node:stream'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { isRight } from '@/shared/either'
import { eq } from 'drizzle-orm'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { uploadImage } from './upload-image'

describe('upload image', () => {
  /**
   * Mock the upload-file-to-storage function (CloudFlare)
   */
  beforeAll(() => {
    vi.mock('@/infra/storage/upload-file-to-storage', () => {
      return {
        uploadFileToStorage: vi.fn().mockImplementation(() => {
          return {
            key: `${randomUUID()}.jpg`,
            url: 'https://storage.com/file.jpg',
          }
        }),
      }
    })
  })

  it('should be able to upload an image', async () => {
    const fileName = `${randomUUID()}.jpg`

    // sut -> System Under Test
    const sut = await uploadImage({
      fileName,
      contentType: 'image/jpg',
      contentStream: Readable.from([]),
    })

    expect(isRight(sut)).toBe(true)

    const result = await db
      .select()
      .from(schema.uploads)
      .where(eq(schema.uploads.name, fileName))

    expect(result).toHaveLength(1)
  })
})
