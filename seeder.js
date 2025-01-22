//require modules
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
require('dotenv').config();

//models
const User = require('./api/models/user.model');
const Puzzle = require('./api/models/puzzle.model');
//const Company = require('./api/models/company.model');
//const Mine = require('./api/models/mine.model');
//const Work_hour = require('./api/models/work_hour.model');
//const Mineral_mine = require('./api/models/mineral_mine.model');

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
//const company = [];
//const mine = [];
//const work_hour = [];
//const mineral_mine = [];

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

        /*
        name = faker.person.firstName();
        description = faker.lorem.sentences(1);
        var ceo_email = email
            
        company.push(
        {
            name,
            description,
            ceo_email
        });

        var company_name = name
        name = faker.person.firstName(),
        latitude = faker.number.int(),
        longitude = faker.number.int(),
        manager_email = email

        mine.push(
        {
            company_name,
            name,
            latitude,
            longitude,
            manager_email,
        });
        */
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
        //await Mineral_mine.collection.drop()
        //await Work_hour.collection.drop()
        //await Mine.collection.drop()
        //await Company.collection.drop()
        await Puzzle.collection.drop()
        await User.collection.drop()

        await User.insertMany(user)
        await Puzzle.insertMany(puzzle)
        //await Company.insertMany(company)
        //await Mine.insertMany(mine)
    }

    seedDB().then(() => 
    {
        mongoose.connection.close()
        console.log("seed success")
    })
}

seedData();
