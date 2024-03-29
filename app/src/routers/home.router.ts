import express from 'express'
import { HomeController } from '../controllers/home.controller'

const router = express.Router()

router.get('/', HomeController.index)
router.get('/worklogs/:id', HomeController.workLogs)

export default router
