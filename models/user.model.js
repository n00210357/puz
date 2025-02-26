//enables mongoose and bcryptjs modules
const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const validateEmail = (email) =>
{
    let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(email);
}

const userSchema = new Schema(
{
    rank:
    {
        type:String,
        required:true
    },
    //the users username
    username: 
    {
        type:String,
        trim: true,
        required: true
    },
    //the users email
    email:
    {
        type:String,
        unique: true,
        lowercase: true,
        trim: true,
        required: true,
        validate: [validateEmail, 'Please use a valid email'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please use a valid email']
    },
    //holds any nessary info about the users not include any were else in the database
    about:
    {
        type:String,
        required: [true, 'Description is required']
    },
    //the users account password
    password:
    {
        type:String,
        required: true
    },
    //stores the setting
    settings:
    {
        type:String
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

//encodes the password
userSchema.methods.comparePassword = function(password)
{
    console.log(bcrypt.compareSync(password, this.password));
};

//exports the model
module.exports = model('User', userSchema);