import {Schema,model} from 'mongoose';

const bookSchema = new Schema({
  username: {
    type:String,
    required:true
  },
  password:  {
    type:String,
    required:true
  },
  displayName: {
    type:String,
    required:true
  },
  emails: {
    type:String,
    required:true
  },
});

module.exports = model('User', bookSchema);

