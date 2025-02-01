import { env } from '@/env'
import { fastifyCors } from '@fastify/cors'
import { fastify } from 'fastify'

import { fastifyMultipart } from '@fastify/multipart'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import {
  hasZodFastifySchemaValidationErrors,
  // jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { getUploadsRoute } from './routes/get-upload'
import { uploadImageRoute } from './routes/upload-image'
import { transformSwaggerSchema } from './transform-swagger-schema'

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

server.register(fastifyMultipart)
server.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Upload Server',
      version: '1.0.0',
    },
  },
  transform: transformSwaggerSchema,
  // transform: jsonSchemaTransform, // Transform the Zod schema to JSON Schema (OpenAPI - Swagger)
})

server.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

// Routes Configuration
server.register(uploadImageRoute)
server.register(getUploadsRoute)

server.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
  console.log('🚀 HTTP Server is running')
})
