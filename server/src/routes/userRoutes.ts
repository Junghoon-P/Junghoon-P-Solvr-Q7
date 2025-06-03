import { FastifyInstance } from 'fastify'
import { AppContext } from '../types/context'
import { createUserController } from '../controllers/userController'

// 사용자 관련 라우트 등록
export const createUserRoutes = (context: AppContext) => async (fastify: FastifyInstance) => {
  const userController = createUserController({ userService: context.userService })

  // 모든 사용자 조회
  fastify.get('/', userController.getAllUsers)

  // ID로 사용자 조회
  fastify.get('/:id', userController.getUserById)

  // 사용자 생성
  fastify.post('/', userController.createUser)

  // 사용자 수정
  fastify.put('/:id', userController.updateUser)

  // 사용자 삭제
  fastify.delete('/:id', userController.deleteUser)
}
