const mongoose = require('mongoose');
var datetime = new Date();
const userSchema = new mongoose.Schema({
    firstName: {type:String,required:'Please enter firstname'},
    lastName: {type:String,required:'Please enter lastname'},
    email: {type:String,required:'Please enter email'},
    password: {type:String,required:'Please enter password'},
    created_at:{type:Date,default:datetime},
	updated_at:{type:Date,default:datetime}
});
mongoose.model('user',userSchema);