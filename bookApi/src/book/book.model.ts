import {Schema,model} from 'mongoose';
import {Ibook} from "./ibook";

const bookSchema = new Schema({
  title: {
    type:String,
    required:true
  },
  description:  {
    type:String,
    required:true
  },
  authors: {
    type:String,
    default: ""
  },
  favorite: {
    type:String,
    default: ""
  },
  fileCover: {
    type:String,
    default: ""
  },
  fileName: {
    type:String,
    default: ""
  },
})

const BookModel = model<Ibook & Document>('BookModel', bookSchema);
export default BookModel;

