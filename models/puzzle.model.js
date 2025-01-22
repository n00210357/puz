//enables mongoose modules
const { Schema, model } = require('mongoose');

const mineralSchema = new Schema(
{
    //the puzzles name
    name: 
    {
        type:String,
        trim: true,
        required: true
    },
    //declares what type of puzzle it is
    puzzleType:
    {
        type:String,
        required: [true, 'The puzzle type is required'],
    },

    //holds any nessary info about the puzzle not include any were else in the database
    puzzleCode:
    {
        type:String,
        required: [true, 'The puzzle code is required']
    }
},

{
    timestamps: true
});

//exports the model
module.exports = model('Mineral', mineralSchema);