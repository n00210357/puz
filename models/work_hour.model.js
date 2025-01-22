//enables mongoose modules
const { Schema, model } = require('mongoose');

const Work_hourSchema = new Schema(
{
    //the starting time
    start: 
    {
        type:String,
        required: true
    },
    //the ending time
    end: 
    {
        type:String,
        required: true
    },
    //the mine this worker will be doing these hours at
    mine_id: 
    {
        type:String,
        required: true
    },
    //links to the worker that is working these hours
    worker_email:
    {
        type:String,
        required: [true, 'Description is required']
    },
},

{
    timestamps: true
});

//exports the model
module.exports = model('Work_hour', Work_hourSchema);