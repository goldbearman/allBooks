import { Container, decorate, injectable } from "inversify";
import { BooksRepository } from "./classes/bookAbstract";

decorate(injectable(), BooksRepository);
const invContainer = new Container();
invContainer.bind(BooksRepository).toSelf().inSingletonScope();

export { invContainer };