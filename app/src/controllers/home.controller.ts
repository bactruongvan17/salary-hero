import { Request, Response } from 'express'

/**
 * Controller for Web
 */
export class HomeController {
  public static index(req: Request, res: Response) {
    return res.render('home')
  }

  public static workLogs(req: Request, res: Response) {
    const id = Number(req.params.id)
    if (id <= 0) {
      throw new Error('Employee Invalid')
    }
    return res.render('work-log')
  }
}
