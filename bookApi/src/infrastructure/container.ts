import 'reflect-metadata'
import { Container } from "inversify";
import { BooksRepository } from "../book/bookAbstract";

const invContainer = new Container();
invContainer.bind(BooksRepository).toSelf().inSingletonScope();

export { invContainer };