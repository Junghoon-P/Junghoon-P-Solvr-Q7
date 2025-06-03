import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { createSuccessResponse, createErrorResponse } from '../utils/response'
import * as fs from 'fs'
import * as path from 'path'
import Papa from 'papaparse'

interface ReleaseData {
  repository: string
  tag_name: string
  release_name: string
  published_at: string
  published_date: string
  published_time: string
  author: string
  is_prerelease: boolean
  year: number
  month: number
  quarter: number
  month_name: string
  week_number: number
  day_of_week: number
  day_name: string
  hour: number
  time_slot: string
  is_weekend: boolean
  season_quarter: string
  version_type: string
  release_type: string
  is_major_version: boolean
  is_patch_version: boolean
  is_hotfix: boolean
  days_since_epoch: number
}

// 릴리즈 데이터 조회 핸들러
async function getReleaseData(_request: FastifyRequest, reply: FastifyReply) {
  try {
    // enhanced_release_details.csv 파일 경로
    const csvPath = path.join(process.cwd(), 'output', 'enhanced_release_details.csv')

    // 파일 존재 확인
    if (!fs.existsSync(csvPath)) {
      return reply.code(404).send(createErrorResponse('릴리즈 데이터 파일을 찾을 수 없습니다.'))
    }

    // CSV 파일 읽기
    const csvContent = fs.readFileSync(csvPath, 'utf-8')

    // CSV 파싱
    const parseResult = Papa.parse<ReleaseData>(csvContent, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      transform: (value, field) => {
        // Boolean 필드 변환
        if (
          [
            'is_prerelease',
            'is_weekend',
            'is_major_version',
            'is_patch_version',
            'is_hotfix'
          ].includes(field as string)
        ) {
          if (typeof value === 'string') {
            return value === 'true'
          }
          return Boolean(value)
        }
        return value
      }
    })

    if (parseResult.errors.length > 0) {
      console.warn('CSV parsing warnings:', parseResult.errors)
    }

    return reply.code(200).send(createSuccessResponse(parseResult.data))
  } catch (error) {
    console.error('Error loading release data:', error)
    return reply.code(500).send(createErrorResponse('릴리즈 데이터를 불러오는데 실패했습니다.'))
  }
}

// 릴리즈 통계 조회 핸들러
async function getReleaseStats(_request: FastifyRequest, reply: FastifyReply) {
  try {
    const csvPath = path.join(process.cwd(), 'output', 'release_statistics.csv')

    if (!fs.existsSync(csvPath)) {
      return reply.code(404).send(createErrorResponse('릴리즈 통계 파일을 찾을 수 없습니다.'))
    }

    const csvContent = fs.readFileSync(csvPath, 'utf-8')
    const parseResult = Papa.parse(csvContent, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true
    })

    return reply.code(200).send(createSuccessResponse(parseResult.data))
  } catch (error) {
    console.error('Error loading release stats:', error)
    return reply.code(500).send(createErrorResponse('릴리즈 통계를 불러오는데 실패했습니다.'))
  }
}

// 릴리즈 라우트 등록
export default async function releaseRoutes(fastify: FastifyInstance) {
  // 릴리즈 데이터 조회
  fastify.get('/data', getReleaseData)

  // 릴리즈 통계 조회
  fastify.get('/stats', getReleaseStats)
}
