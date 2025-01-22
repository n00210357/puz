//enables mongoose modules
const { Schema, model } = require('mongoose');

const companySchema = new Schema(
{
    //the companies name
    name: 
    {
        type:String,
        unique: true,
        trim: true,
        required: true
    },
    //holds any nessary info about the company not include any were else in the database
    description:
    {
        type:String,
        required: [true, 'Description is required']
    },

    //stores the http path to a image file
    image_path:
    {
        type:String
    },

    //links to the worker that runs that runs the company
    ceo_email:
    {
        type:String,
        required: [true, 'ceo_email is required']
    },
},

{
    timestamps: true
});

//exports the model
module.exports = model('Company', companySchema);