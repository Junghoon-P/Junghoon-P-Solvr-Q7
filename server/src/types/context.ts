import { UserService } from '../services/userService'
import { DataService } from '../services/dataService'

export type AppContext = {
  userService: UserService
  dataService: DataService
}
