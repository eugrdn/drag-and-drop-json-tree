var express = require('express');
var router = express.Router();
var handler = require('../handlers/fileProcesser');


/* GET users listing. */
router.route('/')
  .get(handler.readFile)
  .post(handler.saveFile);

module.exports = router;
