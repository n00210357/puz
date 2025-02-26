//links to the workers need modules
const express = require('express');
const router = express.Router();

//links to the image upload script
const imageUpload = require('../conifg/image_upload.js')

//grabs controllers functions
const 
{
    readAll, 
    registor,
    login,
    loginRequired,
    readOne,
    updateData,
    deleteData
} = require('../controllers/user.controller.js')

//the controller functions that do not require the user be logged in
router.get('/', readAll);
router.post('/register', imageUpload.single('file'), registor);
router.post('/login', login);

//the controller functions that requires the user be logged in
router.get('/:id', loginRequired, readOne);
router.put('/:id', imageUpload.single('file'), loginRequired, updateData);
router.delete('/:id', loginRequired, deleteData);

module.exports = router;