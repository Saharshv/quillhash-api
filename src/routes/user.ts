import { Router, response } from 'express';
import 'dotenv/config';
const jwt = require('jsonwebtoken');
import { createUser, loginUser, likeUser, blockUser, addImage, usersToShow } from '../controllers/user';
import { auth } from '../middleware/verify'; 
import { EventEmitter } from 'events';
const socket = require('../app').io;
import { emitter } from '../app';

const router = Router();

// SIGNUP POST ROUTE
router.post("/signup", async (req, res) => {
    if(req.body === undefined)
    {
        return res.status(400).send("Name, email, or password is missing.");
    }
    if(!req.body.name || !req.body.email || !req.body.password)
    {
        return res.status(400).send("Name, email, or password is missing.");
    }
    const signup = await createUser(req, res);
    res.status(200).send("User created.")
})

// LOGIN POST ROUTE
router.post("/login", async (req, res) => {
    if(req.body === undefined)
    {
        return res.status(400).send("email, or password is missing.");
    }
    if(!req.body.email || !req.body.password)
    {
        return res.status(400).send("email, or password is missing.");
    }
    const user = await loginUser(req, res);
    // Create and assign a token
    const token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);   

    res.status(200).send("Logged in.");
})

// LIKE USER POST ROUTE
router.post("/:userId/like", auth, async (req, res) => {
    const task = await likeUser(req, res);
    if(task !== null) {
        emitter.emit('like', {
            "message": "Image Liked",
            "toId": req.params.userId
        })
        res.status(200).send('User Image Liked.');
    }
        else
        res.status(400).send('Cannot like image.')
})

// BLOCK USER POST ROUTE
router.post('/:userId/block', auth, async (req, res) => {
    const task = await blockUser(req, res);
    if(task !== null)
        res.status(200).send('User Blocked.');
    else
        res.status(400).send('Cannot Block.')
})

// ADD IMAGE POST ROUTE
router.post('/addImage', auth, async (req, res) => {
    const task = await addImage(req, res);
    if(task !== null)
        res.status(200).send('Image Added.');
    else
        res.status(400).send('Cannot add image.')
})

// SHOW USERS TO THE USER GET ROUTE
router.get('/showUsers', auth, async (req, res) => {
    const task = await usersToShow(req, res);
    if(task !== null)
        res.status(200).send(task);
    else
        res.status(400).send('Something went wrong.')
})

module.exports = router;
