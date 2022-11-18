const {Schema,model} = require('mongoose');

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
    required:true
  },
  favorite: {
    type:String,
    default: ""
  },
  fileCover: {
    type:String,
    required:true
  },
  fileName: {
    type:String,
    required:true
  },
})

module.exports = module('Book', bookSchema);

