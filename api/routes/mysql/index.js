let express = require('express');
let router = express.Router();

let usersRouter = require('./users');
let lyricsRouter= require('./lyrics');
let initialsRouter= require('./initials');

//------ ROUTINGS
router.use('/users',    usersRouter);
router.use('/lyrics',   lyricsRouter);
router.use('/initials', initialsRouter);

module.exports = router;


//test
//http://127.0.0.1:8080/api/mysql/lyrics/test
