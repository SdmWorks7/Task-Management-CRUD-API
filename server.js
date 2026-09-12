
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
app.use(express.json());

app.use('/tasks', taskRoutes);

app.get('/', (req, res)=> res.send('Task Management API is running'));

app.use((req, res) => res.status(404).json({success: false, message: 'Route not found'}));

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("Mongo is connected");
        app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`))
    })
    .catch((err)=> console.error('MongoDB connection error', err.message));