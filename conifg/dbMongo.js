const mongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const username = encodeURIComponent('n00210357A');
const password = encodeURIComponent('cake');
const host = encodeURIComponent('cluster0.n5qlj.mongodb.net');
const database = encodeURIComponent('articles_db');

const url = `mongodb+srv://${username}:${password}@${host}/${database}?retryWrites=true&w=majority`;

async function connect()
{
    try
    {
        const client = new mongoClient(url)

        await client.connect();
        console.log("connected");

        const db = client.db(database);

        return db;
    }
    catch(error)
    {
        console.log(error);
    }
};

module.exports = connect;