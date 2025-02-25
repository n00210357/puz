//connects to needed modules
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

//connects to needed models
const Reply = require('../models/reply.model');
const User = require('../models/user.model');
const Comment = require('../models/comment.model');

//reads reply data
const readData = (req, res) => 
{
    Reply.find()
    .then((data) => 
    {
        console.log(data);
        if(data.length > 0)
        {
            res.status(200).json(data);
        }
        else
        {
           res.status(404).json("None found");
        }
    })
    .catch((err) => 
    {
        console.log(err);
        res.status(500).json(err);
    });
};

//gets all messages in the database
const readAll = (req, res) =>
{
    Reply.find().then(data =>
    {
        console.log(data);
    
        if (data.length > 0)
        {
            return res.status(200).json(data);
        }
        else
        {
            return res.status(404).json('None found');
        }
    }
    ).catch(err =>
    {
        return res.status(500).json(err);
    });
};

//gets one reply in the database
const readOne = (req, res) => 
{
    let id = req.params.id;

    Reply.findById(id)
    .then((data) => 
    {
        if(data)
        {
            res.status(200).json(data);
        }
        else 
        {
            res.status(404).json(
            {
                "reply": `Reply with id: ${id} not found`
            });
        }        
    })
    .catch((err) => 
    {
        console.error(err);
        if(err.name === 'CastError') 
        {
            res.status(400).json(
            {
                "reply": `Bad request, ${id} is not a valid id`
            });
        }
        else 
        {
            res.status(500).json(err)
        }            
    });
};

//creates a reply
const createData = (req, res) =>
{
    let body = req.body;

    User.findOne({_id: req.body.user_id})
    .then(user => 
    {
        if (!user)
        {
            return res.status(422).json(
            {
                reply: "Not a users id",
            });
        }
    })
    Comment.findOne({_id: req.body.comment_id})
    .then(user => 
    {
        if (!user)
        {
            return res.status(422).json(
            {
                reply: "Not a users email",
            });
        }
    })
    .then(Reply.create(body).then(data =>
    {    
        return res.status(201).json
        ({
            reply: "Reply created",
            data
        });
    })
    ).catch(err =>
    {   
        if (err.name === 'ValidationError')
        {
            return res.status(422).json(err);
        }
    
        return res.status(500).json(err);
    });
};

//updates a reply
const updateData = (req, res) => 
{
    let id = req.params.id;
    let body = req.body;

    User.findOne({_id: req.body.user_id})
    .then(user => 
    {
        if (!user)
        {
            return res.status(422).json(
            {
                reply: "Not a users id",
            });
        }
    })
    Comment.findOne({_id: req.body.comment_id})
    .then(comment => 
    {
        if (!comment)
        {
            return res.status(422).json(
            {
                reply: "Not a users email",
            });
        }
    })
    .then(Reply.findByIdAndUpdate(id, body, 
    {
        new: true
    })
    .then((data) => 
    {
        if(data)
        {
            if (req.file)
            {
                deleteImage(data.filename)
            }
            
            res.status(201).json(data);
        }
        else 
        {
            res.status(404).json(
            {
                "reply": `Reply with id: ${id} not found`
            });
        }        
    }))
    .catch((err) => 
    {
        if(err.name === 'ValidationError')
        {
            console.error('Validation Error!!', err);
            res.status(422).json({
                "msg": "Validation Error",
                "error" : err.reply 
            });
        }
        else if(err.name === 'CastError') 
        {
            res.status(400).json(
            {
                "reply": `Bad request, ${id} is not a valid id`
            });
        }
        else 
        {
            console.error(err);
            res.status(500).json(err);
        }
    });
};

//delete a reply
const deleteData = (req, res) => 
{
    let id = req.params.id;

    Reply.findById(id)
    .then(data =>
    {
        if (data)
        {
            return data.deleteOne();
        }
        else
        {
            res.status(404).json(
            {
                "reply": `Reply with id: ${id} not found`
            });
        }
    })
    .then(() =>
    {
        res.status(200).json(
        {
            "reply": `Reply with id: ${id} deleted successfully`
        });
    })
    .catch((err) => 
    {
        console.error(err);
        if(err.name === 'CastError') 
        {
            res.status(400).json(
            {
                "reply": `Bad request, ${id} is not a valid id`
            });
        }
        else 
        {
            res.status(500).json(err)
        } 
    }); 
};

//exports functions
module.exports = 
{
    readAll,
    readOne,
    createData,
    updateData,
    deleteData
};