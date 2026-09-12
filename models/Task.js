const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [ true, 'Title is required' ],
        trim: true
    },
    description: {
        type: String, 
        trim: true,
        default: ''
    },
    status:{
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending'
    },
    dueData: {
        type: Date,
        required: [true, 'Due date is required']
    },
},
    {
        timestamps: true
    }
);

module.exports('Task', taskSchema);