
var express = require('express');
var app = express.Router();

const User = require('../models/user');

app.post('/signin', async (req, res, next) => {
	let userCreated = await User.create(req.body)
	res.send(userCreated)
})

module.exports = app;
