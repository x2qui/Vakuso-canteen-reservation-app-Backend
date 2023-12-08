const router = require('express').Router();
const Studentuser = require ('../models/Studentuser');
bodyParser = require('body-parser')
//sign up

router.post('/signup', async(req, res) =>{
    const {name, email, password} = req.body;
    try{
        const user = await Studentuser.create({name, email, password});
        res.json(user);
    } catch(e){
        if(e.code === 11000) return res.status(400).send('Email already exists');
        res.status(400).send(e.message)
    }
})

//login 

router.post('/login', async(req, res)=>{
    const {email, password} = req.body;
    try{
        const user = await Studentuser.findByCredentials(email, password);
        res.json(user)
    }catch(e){ 
        res.status(400).send(e.message)
    }
})

//get user

router.get('/', async(req, res) =>{
    try{
        const users = await Studentuser.find({ isAdmin: false}).populate('orders');
        res.json(users);
    }
    catch(e){ 
        res.status(400).send(e.message);
    }
})
 

module.exports = router;