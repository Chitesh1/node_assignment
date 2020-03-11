let express = require('express');
// let app = express();
const bcrypt = require('bcrypt');
var bodyParser = require('body-parser')
const saltRounds = 10;
let passport = require('passport');
const mongoose = require('mongoose');
//mailer configuration
var app = require('express')(),
    mailer = require('express-mailer');
var jwt = require('jsonwebtoken');
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
mailer.extend(app, {
    from: 'chitesh444@gmail.com',
    host: 'smtp.gmail.com', // hostname
    secureConnection: true, // use SSL
    port: 465, // port for secure SMTP
    transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
    auth: {
        user: 'chitesh444@gmail.com',
        pass: 'hokkgjgsqunnbzwv'
    }
});

//Defining Models
require('./models/db');
require("./models/user");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

let User = mongoose.model('user');
//api 
app.post('/api/user/create', (req, res)=>{ // User Creation api
	let inputs = req.body;
	bcrypt.hash(inputs.password, saltRounds, function(err, hash) {
		User.findOne({'email':inputs.email}).then(function(user){ // email duplicate Check
			if(user){ 
				res.status(200).json({'status':false,'statusCode':200,'message':'Email Already Exists!','result':{}});	
			}else{
				let user = new User();
				user.firstName=inputs.first_name?inputs.first_name:'';
				user.lastName=inputs.last_name?inputs.last_name:'';
				user.email=inputs.email?inputs.email:'';
				user.password=hash?hash:'';
				user.save().then(function(user){
					token = jwt.sign(user.toJSON(), 'GOETIA');
					console.log(token);
					res.status(200).json({'status':true,'statusCode':200,'message':'Record Inserted','result':{}});
				}).catch(function(err){
					console.log(err);
					res.status(500).json({'status':false,'statusCode':500,'message':'Internal Server Error','result':{}});
				});
			}
		}).catch(err=>console.log(err));  
	});

});
 //User View Api
app.post('/api/user/view',passport.authenticate('jwt', {failureRedirect: '/api/failResponse',session:false}),(req,res)=>{
	let inputs = req.body;
	User.findOne({'email':inputs.email},{password:0}).then(function(user){
		if(user){
			res.status(200).json({'status':true,'statusCode':200,'message':'Record Fetched!','result':user});
		}else{
			res.status(200).json({'status':true,'statusCode':200,'message':'Record not Found','result':{}});
		}
	}).catch(err=>console.log(err));
});

//Forgot Password
app.post('/api/forgot/password',(req,res)=>{
	let inputs = req.body;
	let pass=Math.floor(Math.random() * 1000000000);
	User.findOne({'email':inputs.email}).then(function(user){
		if(user){
			console.log(pass);
			app.mailer.send('email', {
				to: inputs.email, // REQUIRED. This can be a comma delimited string just like a normal email to field.
				subject: 'Forgot Password', // REQUIRED.
				password: pass, // All additional properties are also passed to the template as local variables.
			
			}, function (err) {
				if (err) {
					console.log(err);
				}
			});
			bcrypt.hash(pass, saltRounds, function(err, hash) {
				User.findOneAndUpdate({email:inputs.email},{'password':hash}).then(function(user){
					res.status(200).json({'status':true,'statusCode':200,'message':'Record Updated!','result':{}});
				}).catch(err=>console.log(err));
			});
		}else{
			res.status(401).json({'status':false,'statusCode':401,'message':'email do not exists','result':{}});
		}

	}).catch(err=>console.log(err));
});

//login with email and password
app.post('/api/login',(req,res)=>{
	let inputs = req.body;
	User.findOne({'email':inputs.email}).then(function(user){
		if(user){
			bcrypt.compare(inputs.password,user.password,function(err,result){
				console.log(result);
				if(result===false){
					res.status(401).json({'status':false,'statusCode':401,'message':'Password Wrong','result':{}});
				}else{
					let result={};
					token = jwt.sign(user.toJSON(), 'GOETIA');
					result.email=user.email;
					result.token=token;
					result._id=user._id;
					res.status(200).json({'status':true,'statusCode':200,'message':'Record Found!',result:result});
				}
			});
		}else{
			res.status(401).json({'status':false,'statusCode':401,'message':'Record Not Found!','result':{}});
		}
	}).catch(err=>console.log(err));
});


// app.post('/api/home',passport.authenticate('jwt', {failureRedirect: '/api/failResponse',session:false}),(req,res)=>{
// 		res.status(200).json({'status':true,'statusCode':200,'message':'You are in Authenticated Route','result':{}});
// });

app.get('/api/failResponse',(req,res)=>{
	res.status(404).json({'status':false,'statusCode':404,'message':'Unauthorized!'});
});
require('./config/passport')(passport);
app.listen(3000);