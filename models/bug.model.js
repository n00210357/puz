//enables mongoose modules
const { Schema, model } = require('mongoose');

const BugSchema = new Schema(
{
    //links to user posting the bug
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
    //what the bug is
    text:
    {
        type:String,
        required: [true, 'text is required']
    },
    //declares if the bug has been fixed or not
    fixed:
    {
        type:Boolean,
        required: [true, 'fixed is required']
    },
    //stores the http path to a image file
    image_path:
    {
        type: String
    }
},

{
    timestamps: true
});

//exports the model
module.exports = model('Bug', BugSchema);