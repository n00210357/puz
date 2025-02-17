//enables mongoose modules
const { Schema, model } = require('mongoose');

const MessageSchema = new Schema(
{
    //links to the worker that is working these hours
    reciever:
    {
        type:String,
        required: [true, 'Description is required']
    },
    //links to the worker that is working these hours
    sender:
    {
        type:String,
        required: [true, 'Description is required']
    },
    //the details
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
module.exports = model('Message', MessageSchema);