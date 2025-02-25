//enables mongoose modules
const { Schema, model } = require('mongoose');

const ReplySchema = new Schema(
{
    //links to the worker that is working these hours
    user_id:
    {
        type:String,
        required: [true, 'User id is required']
    },
    //links to the worker that is working these hours
    comment_id:
    {
        type:String,
        required: [true, 'Comment id is required']
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
module.exports = model('Reply', ReplySchema);