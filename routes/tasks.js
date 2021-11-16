const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/authMiddle');
const { check } = require('express-validator');


// /api/tasks
router.post('/',
    auth,
    [
        check('name', 'name is required').not().isEmpty(),
        check('project', 'project is required').not().isEmpty(),
    ],
    taskController.createTask


);

// get tasks
router.get('/',
    auth,
    taskController.getTasks
)


//update tasks
router.put('/:id',
    auth,
    taskController.updateTask
)

//delete task
router.delete('/:id',
    auth,
    taskController.deleteTask
)

module.exports = router;