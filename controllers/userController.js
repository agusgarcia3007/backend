const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res) => {


    //check if ther is an error
    const errors = validationResult(req);
    if( !errors.isEmpty() ){
        return res.status(400).json({errors: errors.array() });
    }

    //get email and password
    const { email, password } = req.body;



    try {
        let user = await User.findOne({ email });

        if(user){
            return res.status(400).json({ msg : 'user already exists'})
        };
        //create new user
        user = new User(req.body);
        //Hash the password
        const salt = await bcryptjs.genSalt(10);
        user.password = await bcryptjs.hash(password, salt);
        //save the user
        await user.save();

        //create and sign json web token
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
        console.log(error)
        res.status(218).send('fatal error');
    }
}