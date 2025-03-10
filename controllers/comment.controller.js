//connects to needed modules
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

//connects to needed models
const Comment = require('../models/comment.model');
const Puzzle = require('../models/puzzle.model');
const User = require('../models/user.model');

//deletes a saved image
const deleteImage = async (filename) =>
{
    //checks if env links to S3
    if (process.env.STORAGE_ENGINE === 'S3')
    {
        const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');
  
        //checks aws credentials
        const s3 = new S3Client(
        {
            region: process.env.MY_AWS_REGION,
            credentials:
            {
                accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY
            }
        });
        //deletes the image from aws
        try
        {
            const data = await s3.send(new DeleteObjectCommand(
            {
                Bucket: process.env.MY_AWS_BUCKET,
                Key: filename
            }));
   
            console.log("Object deleted ", data);
        }
        catch(err)
        {
            console.error(err);
        }
    }
    else
    {
        //deletes image from uploads folder
        let path = `public/uploads/${filename}`;
        fs.access(path, fs.constants.F_OK, (err) =>
        {
            if (err)
            {
                console.error(err);
                return;
            }
    
            fs.unlink(path, err =>
            {
                if (err)
                {
                    console.error(err);
                    return;
                }
  
                console.log(`${filename} was deleted`);
            })
        })
    }
 }

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

    //user info
    if(req.file)
    {
        body.image_path = process.env.STORAGE_ENGINE === 'S3' ? req.file.key : req.file.filename;
    }

    Puzzle.findOne({_id: req.body.puzzle_id})
    .then(puzzle => 
    {
        if (!puzzle)
        {
            Comment.findOne({_id: req.body.puzzle_id})
            .then(comment => 
            {
                if (!comment)
                {
                    User.findOne({_id: req.body.puzzle_id})
                    .then(user => 
                    {
                        if (!user)
                        {
                            return res.status(422).json(
                            {
                                message: "Not a comment, user or puzzle",
                            });
                        }
                    })
                }
            })
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

    //comment info
    if(req.file)
    {
        body.image_path = null
        body.image_path = process.env.STORAGE_ENGINE === 'S3' ? req.file.key : req.file.filename;
    }

    Puzzle.findOne({_id: req.body.puzzle_id})
    .then(puzzle => 
    {
        if (!puzzle)
        {
            Comment.findOne({_id: req.body.puzzle_id})
            .then(comment => 
            {
                if (!comment)
                {
                    User.findOne({_id: req.body.puzzle_id})
                    .then(user => 
                    {
                        if (!user)
                        {
                            return res.status(422).json(
                            {
                                message: "Not a user, user or puzzle",
                            });
                        }
                    })
                }
            })
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