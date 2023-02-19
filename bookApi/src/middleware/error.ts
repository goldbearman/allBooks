import {Request, Response} from 'express'

export const errorMiddleware = ((req:Request, res:Response) => {
  res.render('errors/404', {
    title: '404'
  })
});