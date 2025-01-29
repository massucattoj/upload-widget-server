import { env } from '@/env'
import { fastifyCors } from '@fastify/cors'
import { fastify } from 'fastify'

import {
  hasZodFastifySchemaValidationErrors,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { uploadImageRoute } from './routes/upload-image'

const server = fastify()

server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

// Error handling global for the application - All errors that are not handled by the route itself (validation included)
server.setErrorHandler((error, request, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({
      message: 'Validation Error',
      issues: error.validation,
    })
  }

  // Send the error for a observability tool (Sentry/Datadog/Grafana/...)
  console.error(error)

  return reply.status(500).send({ message: 'Internal Server Error' })
})

// CORS Configuration
server.register(fastifyCors, { origin: '*' })

// Routes Configuration
server.register(uploadImageRoute)

server.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
  console.log('🚀 HTTP Server is running')
})
