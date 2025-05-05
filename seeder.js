//require modules
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
require('dotenv').config();

//models
const User = require('./api/models/user.model');
const Puzzle = require('./api/models/puzzle.model');
const Comment = require('./api/models/comment.model');
const Bug = require('./api/models/bug.model');

const connectDB = async () =>
{
    try
    {
        await mongoose.connect(process.env.DB_ATLAS_URL);
        console.log("connected to DB");
    }
    catch (err)
    {
        console.error(err);
    }
}

connectDB();

var num = 3;

const user = [];
const puzzle = [];

const gernerate = (num) =>
{
    for (let i = 0; i < num; i++)
    {       
        var rank = 0
        var username = faker.person.firstName();
        var email = faker.internet.email();
        var about = faker.lorem.sentences(1);
        var password = "password";

        user.push(
        {
            rank,
            username,
            email,
            about,
            password,
        });

        var name = faker.person.firstName();
        var puzzleType = 0;
        var puzzleCode = 0;

        puzzle.push(
        {
            name,
            puzzleType,
            puzzleCode
        });
    }
    return user, puzzle;
}

async function seedData() 
{
    // Connection URL
    const uri = process.env.DB_ATLAS_URL;
    const seed_count = 5000;

    mongoose.set("strictQuery", false);
    mongoose.connect(uri, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => 
    {
        console.log("Connected to db")
    })
    .catch((err) => 
    {
        console.log("error", err)
    })

    gernerate(num);

    const seedDB = async () => 
    {
        await Bug.collection.drop()
        await Comment.collection.drop()
        await Puzzle.collection.drop()
        await User.collection.drop()

        await User.insertMany(user)
        await Puzzle.insertMany(puzzle)
    }

    seedDB().then(() => 
    {
        mongoose.connection.close()
        console.log("seed success")
    })
}

seedData();
