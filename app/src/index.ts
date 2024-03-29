import express, { Express, Request, Response } from 'express'
import path from 'path'
import { AppDataSource } from './models/data-source'
import { DataSource } from 'typeorm'
import EmployeeRouter from './routers/employee.router'
import workLogRouter from './routers/work-log.router'
import { Scheduler } from './console/scheduler.console'
import HomeRouter from './routers/home.router'
import { seedEmployees } from './models/seeder/fake-emplyee'
import { seedWorkLogs } from './models/seeder/fake-work-log'

const app: Express = express()
const port: number = Number(process.env.port) || 3000

app.use('/static', express.static(path.join(__dirname, 'public')))
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

/**
 * Start Database connection and Express App
 */
AppDataSource.initialize()
  .then(async (dataSource) => {
    console.log('Initialize database connection successfuly')

    // initialize router
    initializeRouter(app, dataSource)

    // start express app
    app.listen(port, () => {
      console.log(`[Server]: Server is running at http://localhost:${port}`)
    })

    // start scheduler
    Scheduler.start()
  })
  .catch((error) => {
    console.error(`Can't initialize database connection: `, error)
  })

/**
 * Initialize Routers
 * @param app Express
 * @param dataSource DataSource
 */
function initializeRouter(app: Express, dataSource: DataSource) {
  app.use('/', HomeRouter)
  app.use('/api/employees', EmployeeRouter(dataSource))
  app.use('/api/worklogs', workLogRouter(dataSource))

  // use for fake data: disable if run in production
  app.post('/fake-employee', async (req: Request, res: Response) => {
    await seedEmployees(15)
    return res.json({ message: 'Done' })
  })
  app.post('/fake-work-logs', async (req: Request, res: Response) => {
    await seedWorkLogs()
    return res.json({ message: 'Done' })
  })
}
