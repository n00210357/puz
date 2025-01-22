//enables mongoose modules
const { Schema, model } = require('mongoose');

const Mineral_mineSchema = new Schema(
{
    //links to the mine this mineral is being mined at
    mine_id: 
    {
        type:String,
        required: true
    },
    //links to the mineral that is mined at the mine
    mineral_id:
    {
        type:String,
        required: [true, 'Description is required']
    },
},

{
    timestamps: true
});

//exports the model
module.exports = model('Mineral_mine', Mineral_mineSchema);