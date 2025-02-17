//enables express to be used
const express = require('express');
const router = express.Router();

//grabs controllers functions
const 
{
    readAll, 
    readOne,
    createData,
    updateData,
    deleteData
} = require('../controllers/comment.controller.js');

//checks if a users is logged in
const { loginRequired } = require('../controllers/user.controller.js');

//the controller functions that do not require the user be logged in
router.get('/', readAll);
router.get('/:id', readOne);

//the controller functions that requires the user be logged in
router.post('/', loginRequired, createData);
router.put('/:id', loginRequired, updateData);
router.delete('/:id', loginRequired, deleteData);

module.exports = router;