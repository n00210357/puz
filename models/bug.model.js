//enables mongoose modules
const { Schema, model } = require('mongoose');

const BugSchema = new Schema(
{
    //links to the worker that is working these hours
    user_id:
    {
        type:String,
        required: [true, 'User id is required']
    },
    //links to the puzzle if their is one
    puzzle_id:
    {
        type:String,
    },
    //links to the worker that is working these hours
    text:
    {
        type:String,
        required: [true, 'text is required']
    },
    //the details
    fixed:
    {
        type:Boolean,
        required: [true, 'fixed is required']
    },
},

{
    timestamps: true
});

//exports the model
module.exports = model('Bug', BugSchema);