import {Schema,model} from 'mongoose';

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

const Book = model('Book', bookSchema);
export default Book;

