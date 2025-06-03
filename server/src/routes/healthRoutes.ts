import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { createSuccessResponse } from '../utils/response'

// 헬스 체크 핸들러
async function healthCheck(_request: FastifyRequest, reply: FastifyReply) {
  return reply.code(200).send(createSuccessResponse({ status: 'ok' }))
}

// 헬스 체크 라우트 등록
export default async function healthRoutes(fastify: FastifyInstance) {
  fastify.get('/', healthCheck)
}
