const Task = require('../models/Task');
const Project = require('../models/Project');
const {validationResult} = require('express-validator');


//create a ne task
exports.createTask = async (req, res) => {

    const errors = validationResult(req);
    if( !errors.isEmpty() ){
        return res.status(400).json({errors: errors.array() });
    };

    
    
    try {
        //get project
        const { project } =req.body;

        const projectTrue = await Project.findById(project);
        if(!projectTrue){
            res.status(404).json({msg : 'not found'})
        }

        if(projectTrue.owner.toString() !== req.user.id){
            return res.status(401).json({msg : 'unauthorized'});
        };

        const task = new Task(req.body);
        await task.save();
        res.json(task);
        
    } catch (error) {
        console.log(error);
        res.status(500).send('error');
    }

}

//get tasks
exports.getTasks = async (req, res) => {

    try {
            //get project
        const { project } =req.query;

        const projectTrue = await Project.findById(project);
        if(!projectTrue){
            res.status(404).json({msg : 'not found'})
        }

        if(projectTrue.owner.toString() !== req.user.id){
            return res.status(401).json({msg : 'unauthorized'});
        };

        const tasks = await Task.find({ project });
        res.json(tasks);

    } catch (error) {
        console.log(error);
        res.status(500).send('error');
    }
}

//update tasks
exports.updateTask = async (req, res) => {
    try {
        const { project, name, completed } =req.body;

        let taskTrue = await Task.findById(req.params.id);

        if(!taskTrue){
            return res.status(404).json({msg : 'task not found'});
        }

        const projectTrue = await Project.findById(project);
        if(!projectTrue){
            res.status(404).json({msg : 'not found'})
        }

        if(projectTrue.owner.toString() !== req.user.id){
            return res.status(401).json({msg : 'unauthorized'});
        };



        //obj with new info
        let newTask = {};

        newTask.name = name;
        newTask.completed = completed;
        

        taskTrue = await Task.findOneAndUpdate({_id : req.params.id}, newTask, { new: true});

        res.json({taskTrue})

        
    } catch (error) {
        console.log(error);
        res.status(500).send(error);

    }
}


//delete task
exports.deleteTask = async (req, res) => {
    try {
        const { project } =req.query;

        let taskTrue = await Task.findById(req.params.id);

        if(!taskTrue){
            return res.status(404).json({msg : 'task not found'});
        }

        const projectTrue = await Project.findById(project);
        if(!projectTrue){
            res.status(404).json({msg : 'not found'})
        }

        if(projectTrue.owner.toString() !== req.user.id){
            return res.status(401).json({msg : 'unauthorized'});
        };

        await Task.findByIdAndRemove({ _id : req.params.id});
        res.json({ msg : 'task deleted'});

        
    } catch (error) {
        console.log(error);
        res.status(500).send(error);

    }
}