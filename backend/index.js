// index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); 

const app = express();
const port = 3000;

app.use(express.json());

app.use(cors());

const Task = require('./schemas/Task');

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Task Management API' });
});


mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB Atlas');
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch(err => {
        console.error('Could not connect to MongoDB:', err);
    });

app.get('/tasks', async (req, res) => {
    console.log('Fetching tasks...');
    try {
        const tasks = await Task.find().sort({ createdAt: -1 }); // Sort by newest first
        res.json(tasks);
    } catch (err) {
        console.error('Error fetching tasks:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});


// Write an endpoint to create a new task.
app.post('/tasks',async(req,res)=>{
    const data={
        title:req.body.title,
        dueDate:req.body.dueDate,
        priority:req.body.priority,
        status:req.body.status,
    }
    console.log(data)
    const newTask=new Task(data)
    newTask.save()
    .then(()=>{
        res.status(200).json({message:"successfully added"})
    })
    .catch((err)=>{
        console.log(err)
        res.status(500).json({message:"failed",error:err.message})
    })
})