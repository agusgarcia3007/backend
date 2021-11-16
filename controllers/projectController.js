const Project = require('../models/Project');
const { validationResult } = require('express-validator'); 

exports.createProject = async (req, res) => {

    const errors = validationResult(req);
    if( !errors.isEmpty() ){
        return res.status(400).json({errors: errors.array() });
    }

    try {
        //create new project
    const project = new Project(req.body);

    //include owner with jwt
    project.owner = req.user.id;


    project.save();
    res.json(project); 

    } catch (error) {
        console.log(error);
        res.send(500).send('error');
    }
}

//get owner's projects
exports.getProjects = async ( req, res ) => {
    try {
        const projects = await Project.find({ owner : req.user.id});
        res.json(projects);
    } catch (error) {
        console.log(error);
        res.status(500).send('error');
    }
}

//update a project
exports.updateProject = async ( req, res ) => {

    const errors = validationResult(req);
    if( !errors.isEmpty() ){
        return res.status(400).json({errors: errors.array() });
    }

    //getting projct info
    const { name } = req.body;
    const newProject = {};

    if(name){
        newProject.name = name;
    };

    try {
        //check id
        let project = await Project.findById(req.params.id);

        if(!project){
            return res.status(404).json({ msg : 'project not found :('});
        };

        if(project.owner.toString() !== req.user.id){
            return res.status(401).json({msg : 'unauthorized'});
        };

        project = await Project.findByIdAndUpdate({_id : req.params.id}, {$set : newProject}, {new:true});

        res.json({project});

        
    } catch (error) {
        console.log(error);
        res.status(400).send('error');
    }

}

//delete project by id
exports.deleteProject = async ( req, res ) => {
    try {

        let project = await Project.findById(req.params.id);

        if(!project){
            return res.status(404).json({ msg : 'project not found :('});
        };

        if(project.owner.toString() !== req.user.id){
            return res.status(401).json({msg : 'unauthorized'});
        };

        //delete project
        await Project.findOneAndRemove({_id : req.params.id});
        res.json({msg : 'removed'});

    } catch (error) {
        console.log(error);
        res.status(500).send('server error');
    }
}