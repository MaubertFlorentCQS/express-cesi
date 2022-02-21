const jwt = require('jsonwebtoken');

var express = require('express');
var app = express.Router();

const User = require('../models/user');
const { isValidObjectId } = require('mongoose');

app.post('/signin', async (req, res, next) => {
	let userCreated = await User.create(req.body)
	res.send(userCreated)
})

module.exports = app;

app.post('/login', async (req, res) => {
	//On récupére le username et password
	const{email, password}=req.body;

	//On cherche l'utilisateur qui correspond
	const user = await User.findOne({email:email, password:password});

	if (user) {
		//On génère le token
		const accessToken=jwt.sign({email:user.email, role:user.role}, process.env.TOKEN_SECRET)

		res.json({
			accessToken
		}); 
	}else{
		res.send('Email or password incorrect')
	}
});

const authenticateJWT=(req,res,next)=>{
	//On récupére le Bearer token
	const authHeader=req.headers.autorization;

	if(authHeader){
		//On ne prends que le token
		const token=authHeader.split(' ')[1];

		//On vérifie si le token a bien été signé avec le secret et qu'il est toujours valide
		jwt.verify(token,process.env.TOKEN_SECRET,(err, user)=>{
			if(err){
				//On retourne une erreur de permission si invalid
				return res.sendStatus(403);
			}
			//On ajoute à la requête
			req.user=user;
			next();
		});
	}else{
		res.sendStatus(401);
	}
};
/*
//route /user/profile
app.get('/profile', authenticateJWT, async (req,res) => {
	const user=await User.findOne({email:res.user.email});
	res.json(user);
});

//route /profile/:id
app.get('/profile/:id', authenticateJWT, async (req,res)=>{
	const{role}=req.user;
	const id=req.params.id;

	if(role!=='admin'){
		return res.sendStatus(403);
	}

	const user=await User.findOne({_id: ObjectID(id)});
	res.json(user);
});
*/
app.get('/profile/:id', authenticateJWT, async (req,res)=>{
	const id=req.params.id;
	const user=await User.findOne({_id: ObjectID(id)});

	res.json(user);
});

app.get('/profile', authenticateJWT, async (req,res)=>{
	const user=await User.findOne({email:res.user.email});
	res.json(user);
});