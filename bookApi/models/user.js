const {Schema,model} = require('mongoose');

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
    default: ""
  },
  emails: {
    type:String,
    default: ""
  },
});

module.exports = model('User', bookSchema);

