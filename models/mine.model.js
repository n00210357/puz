//enables mongoose modules
const { Schema, model } = require('mongoose');

const mineSchema = new Schema(
{
    //the mines name
    name: 
    {
        type:String,
        trim: true,
        required: true
    },
    //the mines latitude
    latitude:
    {
        type:String,
        required: [true, 'Description is required']
    },
    //the mines longitude
    longitude:
    {
        type:String,
        required: [true, 'Description is required']
    },
    //stores the http path to a image file
    image_path:
    {
        type:String
    },
    //links to the worker that runs that runs the mine
    manager_email:
    {
        type:String,
        required: [true, 'ceo_email is required']
    },
    //links to the company that runs owns the mine
    company_name:
    {
        type:String,
        required: [true, 'company name is required']
    },
},

{
    timestamps: true
});

//exports the model
module.exports = model('Mine', mineSchema);