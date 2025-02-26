//enables mongoose modules
const { Schema, model } = require('mongoose');

const PuzzleSchema = new Schema(
{
    //links to the user that is commenting
    user_id:
    {
        type:String,
        required: [true, 'Description is required']
    },
    //the puzzles name
    name: 
    {
        type:String,
        trim: true,
        required: true
    },
    //holds any info about the puzzle not include any were else in the database
    puzzleCode:
    {
        type:String,
        required: [true, 'The puzzle code is required']
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
module.exports = model('Puzzle', PuzzleSchema);