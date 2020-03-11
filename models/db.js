const mongoose =require('mongoose');

// // mongoose.connect('mongodb://localhost:27017/voxo',{useNewUrlParser:true},(err)=>{
// //     if(!err){}
// //     else{console.log(`Error ${err}`)}
// // });

mongoose.connect('mongodb+srv://user:user@123@cluster0-arw4u.mongodb.net/test?retryWrites=true&w=majority',{useNewUrlParser:true},(err)=>{
    if(!err){}
    else{console.log(`Error ${err}`)}
});


