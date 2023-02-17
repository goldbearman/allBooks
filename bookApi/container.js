import {Container} from "inversify";
import { BooksRepository } from "./classes/bookAbstract";


const invContainer = new Container();
invContainer.bind(BooksRepository).toSelf();

export { invContainer };