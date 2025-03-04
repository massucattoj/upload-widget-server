import { uploadImage } from '@/app/functions/upload-image'
import { isRight, unwrapEither } from '@/shared/either'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const uploadImageRoute: FastifyPluginAsyncZod = async server => {
  server.post(
    '/uploads',
    {
      schema: {
        summary: 'Upload an image',
        tags: ['uploads'],
        consumes: ['multipart/form-data'],
        response: {
          201: z
            .object({ url: z.string() })
            .describe('Image uploaded successfully'),
          400: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const uploadedFile = await request.file({
        limits: {
          fileSize: 1024 * 1024 * 2, // 2mb
        },
      })

      if (!uploadedFile) {
        return reply.status(400).send({ message: 'File is required' })
      }

      /**
       * Dont use .toBuffer() -> use streams instead +++ performance
       */

      const result = await uploadImage({
        fileName: uploadedFile.filename,
        contentType: uploadedFile.mimetype,
        contentStream: uploadedFile.file,
      })

      /**
       * Handle error if the image is bigger than the limit size
       * Need to be after the function that consumes the streaming
       */
      if (uploadedFile.file.truncated) {
        return reply.status(400).send({ message: 'File is too large.' })
      }

      if (isRight(result)) {
        console.log(unwrapEither(result))
        const { url } = unwrapEither(result)

        return reply.status(201).send({ url })
      }

      // if error
      const error = unwrapEither(result)
      switch (error.constructor.name) {
        case 'InvalidFileFormat':
          return reply.status(400).send({ message: error.message })
        default:
          return reply.status(500).send({ message: 'Internal Server Error' })
      }
    }
  )
}
