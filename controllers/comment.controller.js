//connects to needed modules
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

//connects to needed models
const Comment = require('../models/comment.model');
const Puzzle = require('../models/puzzle.model');
const User = require('../models/user.model');

//reads comment data
const readData = (req, res) => 
{
    Comment.find()
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

//gets all comments in the database
const readAll = (req, res) =>
{
    Comment.find().then(data =>
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

//gets one Comment in the database
const readOne = (req, res) => 
{
    let id = req.params.id;

    Comment.findById(id)
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
                "message": `Comment with id: ${id} not found`
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
                "message": `Bad request, ${id} is not a valid id`
            });
        }
        else 
        {
            res.status(500).json(err)
        }            
    });
};

//creates a Comment
const createData = (req, res) =>
{
    let body = req.body;

    Puzzle.findOne({_id: req.body.puzzle_id})
    .then(puzzle => 
    {
        if (!puzzle)
        {
            return res.status(422).json(
            {
                message: "Not a workers email",
            });
        }
    })
    User.findOne({_id: req.body.user_id})
    .then(user => 
    {
        if (!user)
        {
            return res.status(422).json(
            {
                message: "Not a user",
            });
        }
    })
    .then(Comment.create(body).then(data =>
    {    
        return res.status(201).json
        ({
            message: "Comment created",
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

//updates a Comment
const updateData = (req, res) => 
{
    let id = req.params.id;
    let body = req.body;

    Puzzle.findOne({_id: req.body.puzzle_id})
    .then(puzzle => 
    {
        if (!puzzle)
        {
            return res.status(422).json(
            {
                message: "Not a workers email",
            });
        }
    })
    User.findOne({_id: req.body.user_id})
    .then(user => 
    {
        if (!user)
        {
            return res.status(422).json(
            {
                message: "Not a user",
            });
        }
    })
    .then(Comment.findByIdAndUpdate(id, body, 
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
                "message": `comment with id: ${id} not found`
            });
        }        
    }))
    .catch((err) => 
    {
        if(err.name === 'ValidationError')
        {
            console.error('Validation Error!!', err);
            res.status(422).json(
            {
                "msg": "Validation Error",
                "error" : err.message 
            });
        }
        else if(err.name === 'CastError') 
        {
            res.status(400).json(
            {
                "message": `Bad request, ${id} is not a valid id`
            });
        }
        else 
        {
            console.error(err);
            res.status(500).json(err);
        }
    });
};

//delete a Comment
const deleteData = (req, res) => 
{
    let id = req.params.id;

    Comment.findById(id)
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
                "message": `comment with id: ${id} not found`
            });
        }
    })
    .then(() =>
    {
        res.status(200).json(
        {
            "message": `comment with id: ${id} deleted successfully`
        });
    })
    .catch((err) => 
    {
        console.error(err);
        if(err.name === 'CastError') 
        {
            res.status(400).json(
            {
                "message": `Bad request, ${id} is not a valid id`
            });
        }
        else {
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