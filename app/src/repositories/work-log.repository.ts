import { Repository } from 'typeorm'
import { WorkLog } from '../models/entity/WorkLog'

export class WorkLogRepository extends Repository<WorkLog> {}
