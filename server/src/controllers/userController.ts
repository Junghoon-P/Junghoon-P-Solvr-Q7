import { FastifyRequest, FastifyReply } from 'fastify'
import { createSuccessResponse, createErrorResponse } from '../utils/response'
import { CreateUserDto, UpdateUserDto } from '../types'
import { UserService } from '../services/userService'

type UserControllerDeps = {
  userService: UserService
}

export const createUserController = ({ userService }: UserControllerDeps) => {
  const getAllUsers = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const users = await userService.getAllUsers()
      return reply.code(200).send(createSuccessResponse(users))
    } catch (error) {
      request.log.error(error)
      return reply.code(500).send(createErrorResponse('사용자 목록을 불러오는데 실패했습니다.'))
    }
  }

  const getUserById = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const id = parseInt(request.params.id, 10)

      if (isNaN(id)) {
        return reply.code(400).send(createErrorResponse('유효하지 않은 사용자 ID입니다.'))
      }

      const user = await userService.getUserById(id)

      if (!user) {
        return reply.code(404).send(createErrorResponse('사용자를 찾을 수 없습니다.'))
      }

      return reply.code(200).send(createSuccessResponse(user))
    } catch (error) {
      request.log.error(error)
      return reply.code(500).send(createErrorResponse('사용자 정보를 불러오는데 실패했습니다.'))
    }
  }

  const createUser = async (
    request: FastifyRequest<{ Body: CreateUserDto }>,
    reply: FastifyReply
  ) => {
    try {
      const userData = request.body

      const existingUser = await userService.getUserByEmail(userData.email)
      if (existingUser) {
        return reply.code(409).send(createErrorResponse('이미 사용 중인 이메일입니다.'))
      }

      const newUser = await userService.createUser(userData)
      return reply
        .code(201)
        .send(createSuccessResponse(newUser, '사용자가 성공적으로 생성되었습니다.'))
    } catch (error) {
      request.log.error(error)
      return reply.code(500).send(createErrorResponse('사용자 생성에 실패했습니다.'))
    }
  }

  const updateUser = async (
    request: FastifyRequest<{ Params: { id: string }; Body: UpdateUserDto }>,
    reply: FastifyReply
  ) => {
    try {
      const id = parseInt(request.params.id, 10)
      const userData = request.body

      if (isNaN(id)) {
        return reply.code(400).send(createErrorResponse('유효하지 않은 사용자 ID입니다.'))
      }

      const existingUser = await userService.getUserById(id)
      if (!existingUser) {
        return reply.code(404).send(createErrorResponse('사용자를 찾을 수 없습니다.'))
      }

      if (userData.email && userData.email !== existingUser.email) {
        const emailExists = await userService.getUserByEmail(userData.email)
        if (emailExists) {
          return reply.code(409).send(createErrorResponse('이미 사용 중인 이메일입니다.'))
        }
      }

      const updatedUser = await userService.updateUser(id, userData)
      return reply
        .code(200)
        .send(createSuccessResponse(updatedUser, '사용자 정보가 성공적으로 수정되었습니다.'))
    } catch (error) {
      request.log.error(error)
      return reply.code(500).send(createErrorResponse('사용자 정보 수정에 실패했습니다.'))
    }
  }

  const deleteUser = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const id = parseInt(request.params.id, 10)

      if (isNaN(id)) {
        return reply.code(400).send(createErrorResponse('유효하지 않은 사용자 ID입니다.'))
      }

      const existingUser = await userService.getUserById(id)
      if (!existingUser) {
        return reply.code(404).send(createErrorResponse('사용자를 찾을 수 없습니다.'))
      }

      const deleted = await userService.deleteUser(id)

      if (!deleted) {
        return reply.code(500).send(createErrorResponse('사용자 삭제에 실패했습니다.'))
      }

      return reply
        .code(200)
        .send(createSuccessResponse(null, '사용자가 성공적으로 삭제되었습니다.'))
    } catch (error) {
      request.log.error(error)
      return reply.code(500).send(createErrorResponse('사용자 삭제에 실패했습니다.'))
    }
  }

  return {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
  }
}

export type UserController = ReturnType<typeof createUserController>
