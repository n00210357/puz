//connects to needed modules
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

//connects to needed models
const mineral_mine = require('../models/mineral_mine.model');
const Mineral = require('../models/mineral.model');
const Mine = require('../models/mine.model');

//reads mineral_mine data
const readData = (req, res) => 
{
    mineral_mine.find()
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

//gets all mineral_mines in the database
const readAll = (req, res) =>
{
    mineral_mine.find().then(data =>
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

//gets one mineral_mine in the database
const readOne = (req, res) => 
{
    let id = req.params.id;

    mineral_mine.findById(id)
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
                "message": `mineral_mine with id: ${id} not found`
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

//creates a mineral_mine
const createData = (req, res) =>
{
    let body = req.body;

    Mineral.findOne({_id: req.body.mineral_id})
    .then(mineral => 
    {
        if (!mineral)
        {
            return res.status(422).json(
            {
                message: "Not a workers email",
            });
        }
    })
    Mine.findOne({_id: req.body.mine_id})
    .then(mine => 
    {
        if (!mine)
        {
            return res.status(422).json(
            {
                message: "Not a mine",
            });
        }
    })
    .then(mineral_mine.create(body).then(data =>
    {    
        return res.status(201).json
        ({
            message: "mineral_mine created",
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

//updates a mineral_mine
const updateData = (req, res) => 
{
    let id = req.params.id;
    let body = req.body;

    Mineral.findOne({_id: req.body.mineral_id})
    .then(mineral => 
    {
        if (!mineral)
        {
            return res.status(422).json(
            {
                message: "Not a workers email",
            });
        }
    })
    Mine.findOne({_id: req.body.mine_id})
    .then(mine => 
    {
        if (!mine)
        {
            return res.status(422).json(
            {
                message: "Not a mine",
            });
        }
    })
    .then(mineral_mine.findByIdAndUpdate(id, body, 
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
                "message": `mineral_mine with id: ${id} not found`
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

//delete a mineral_mine
const deleteData = (req, res) => 
{
    let id = req.params.id;

    mineral_mine.findById(id)
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
                "message": `mineral_mine with id: ${id} not found`
            });
        }
    })
    .then(() =>
    {
        res.status(200).json(
        {
            "message": `mineral_mine with id: ${id} deleted successfully`
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