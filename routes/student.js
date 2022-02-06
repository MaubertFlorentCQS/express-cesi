
var express = require('express');
var app = express.Router();

const Student = require('../models/student');

app.get('/student/average', async (req, res, next) => {
	let students = await Student.find({});
	const average = students.map((s) => s.age).reduce((a, b) => (a + b)) / students.length;
	res.send(`Old average of classroom : ${average}`)
})

app.get('/student/:id', async (req, res, myLogger) => {
	const id = req.params.id;
	let student = await Student.findOne({_id: ObjectID(id)})
	if(student) { res.send(`Hello ${student.name}`) }
	else { res.send('Student unknown !') }
});

app.post('/student', async (req, res, next) => {
	let studentCreated = await Student.create(req.body)
	res.send(studentCreated)
})

app.delete('/student/:id', async (req, res, next) => {
	let studentDeleted = await Student.deleteOne({_id: ObjectID(req.params.id)})
	res.send(studentDeleted)
})

app.get('/student/', async (req, res, next) => {
	let students = await Student.find({});
	res.json(students);
});



app.put('/student/:id', async (req, res, next) => {
	let studentUpdated = await Student.updateOne({_id: ObjectID(req.params.id)}, {...req.body})
	res.send(studentUpdated)
})



module.exports = app;
