import { Request } from "express"

export interface Ibook {
    title: String;
    description: String;
    authors: String;
    favorite: String;
    fileCover: String;
    fileName: String;
    [key: string]: any;
}

export interface IGetUserAuthInfoRequest extends Request {
    user: Ibook
}

