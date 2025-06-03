import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { createSuccessResponse, createErrorResponse } from '../utils/response'
import { AppContext } from '../types/context'

interface GetReleaseDataQuery {
  repository?: string
  dateFrom?: string
  dateTo?: string
  isPrerelease?: string
  timeSlot?: string
}

// 릴리즈 데이터 조회 핸들러
function createGetReleaseData(context: AppContext) {
  return async (
    request: FastifyRequest<{ Querystring: GetReleaseDataQuery }>,
    reply: FastifyReply
  ) => {
    try {
      const { repository, dateFrom, dateTo, isPrerelease, timeSlot } = request.query

      // 필터 옵션이 있으면 필터링된 데이터, 없으면 전체 데이터
      const data =
        Object.keys(request.query).length > 0
          ? context.dataService.getFilteredReleases({
              repository,
              dateFrom,
              dateTo,
              isPrerelease: isPrerelease ? isPrerelease === 'true' : undefined,
              timeSlot
            })
          : context.dataService.getAllReleases()

      return reply.code(200).send(createSuccessResponse(data))
    } catch (error) {
      console.error('Error loading release data:', error)
      return reply.code(500).send(createErrorResponse('릴리즈 데이터를 불러오는데 실패했습니다.'))
    }
  }
}

// 릴리즈 통계 조회 핸들러
function createGetReleaseStats(context: AppContext) {
  return async (_request: FastifyRequest, reply: FastifyReply) => {
    try {
      const stats = context.dataService.getStats()
      return reply.code(200).send(createSuccessResponse(stats))
    } catch (error) {
      console.error('Error loading release stats:', error)
      return reply.code(500).send(createErrorResponse('릴리즈 통계를 불러오는데 실패했습니다.'))
    }
  }
}

// 데이터 새로고침 핸들러
function createRefreshData(context: AppContext) {
  return async (_request: FastifyRequest, reply: FastifyReply) => {
    try {
      await context.dataService.refresh()
      const stats = context.dataService.getStats()
      return reply.code(200).send(
        createSuccessResponse({
          message: '데이터가 성공적으로 새로고침되었습니다.',
          stats
        })
      )
    } catch (error) {
      console.error('Error refreshing data:', error)
      return reply.code(500).send(createErrorResponse('데이터 새로고침에 실패했습니다.'))
    }
  }
}

// 릴리즈 라우트 등록
export default function createReleaseRoutes(context: AppContext) {
  return async (fastify: FastifyInstance) => {
    // 릴리즈 데이터 조회 (필터링 지원)
    fastify.get('/data', createGetReleaseData(context))

    // 릴리즈 통계 조회 (메모리 기반)
    fastify.get('/stats', createGetReleaseStats(context))

    // 데이터 새로고침
    fastify.post('/refresh', createRefreshData(context))
  }
}
