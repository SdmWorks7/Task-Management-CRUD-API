const express = require('express');
const router = express.Router();
const {
  createTask, getTasks, getTaskById, getTaskByTitle, updateTask, deleteTask,
} = require('../controllers/taskController');

router.post('/', createTask);
router.get('/', getTasks);
router.get('/title/:title', getTaskByTitle); // must be ABOVE /:id
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;