import multer from 'multer';
import {Request,Response} from "express";

const storage = multer.diskStorage({
// @ts-ignore
  destination(req:Request, file:Response, cb:any):void{
    cb(null, 'public/download')  //(ошибка,куда сохранять файл)
  },
  filename(req:Request, file:any, cb:any) {
    cb(null, file.originalname)
  }
})

export default multer({storage})