import { randomUUID } from 'node:crypto'
import { basename, extname } from 'node:path'
import { Readable } from 'node:stream'
import { env } from '@/env'
import { Upload } from '@aws-sdk/lib-storage'
import { z } from 'zod'
import { r2 } from './client'

const uploadFileToStorageInput = z.object({
  folder: z.enum(['images', 'downloads']),
  fileName: z.string(),
  contentType: z.string(),
  contentStream: z.instanceof(Readable),
})

type UploadFileToStorageInput = z.input<typeof uploadFileToStorageInput>

export async function uploadFileToStorage(input: UploadFileToStorageInput) {
  const { folder, fileName, contentType, contentStream } =
    uploadFileToStorageInput.parse(input) // .parse() is a runtime validation to see with following the schema defined in uploadFileToStorageInput

  // fileName is the name of the file on the user device
  // need to generate a unique name
  const fileExtension = extname(fileName)
  const fileNameWithoutExtension = basename(fileName)

  // [^a-zA-Z0-9] every character that is not a letter or a number is removed
  const sanitizedFileName = fileNameWithoutExtension.replace(
    /[^a-zA-Z0-9]/g,
    ''
  )

  const sanitizedFileNameWithExtension = sanitizedFileName.concat(fileExtension)
  const uniqueFileName = `${folder}/${randomUUID()}-${sanitizedFileNameWithExtension}`

  // upload the file to storage
  const upload = new Upload({
    client: r2,
    params: {
      Key: uniqueFileName,
      Bucket: env.CLOUDFLARE_BUCKET,
      Body: contentStream,
      ContentType: contentType,
    },
  })

  await upload.done()

  return {
    key: uniqueFileName,
    url: new URL(uniqueFileName, env.CLOUDFLARE_PUBLIC_URL).toString(),
  }
}
