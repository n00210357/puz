//enables mongoose modules
const { Schema, model } = require('mongoose');

const CommentSchema = new Schema(
{
    //links to the puzzle is being post on
    puzzle_id: 
    {
        type:String,
        required: true
    },
    //links to the user that is commenting
    user_id:
    {
        type:String,
        required: [true, 'Description is required']
    },
    //the text of the message
    text:
    {
        type:String,
        required: [true, 'Description is required']
    },
},

{
    timestamps: true
});

//exports the model
module.exports = model('Comment', CommentSchema);