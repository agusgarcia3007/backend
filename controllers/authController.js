const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');


exports.authUser = async (req, res) => {

    const errors = validationResult(req);
    if( !errors.isEmpty() ){
        return res.status(400).json({ errors : errors.array() })
    };

    const { email, password } = req.body;

    try {
        //check if user is registterd
        let user = await  User.findOne({ email });
        if( !user ){
            return res.status(400).json({ msg : 'User does not exist'});
        };

        //check password
        const passwordTrue = await bcryptjs.compare(password, user.password);
        if(!passwordTrue){
            return res.status(400).json({ msg : 'Incorrect password'});
        };

        //if everything is ok. JWT
        const payload = {
            user : {
                id: user.id
            }
        };

        jwt.sign(payload, process.env.SECRET, {
            expiresIn: 3600000
        },(error, token) => {
            if(error) throw error;


            res.json({ token : token });
        }
        );

    } catch (error) {
        console.log(error);
    }
}

exports.authenticatedUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json({user});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'an error occured on "authController.js"'})
    }
}