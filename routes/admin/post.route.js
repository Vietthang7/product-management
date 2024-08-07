const express = require("express");
const router = express.Router();
const multer = require('multer')
const validate = require("../../validates/admin/post.validates.js");
const uploadToCloud = require("../../middlewares/admin/uploadCloud.middleware");



const controller = require("../../controllers/admin/post.controller.js");

const upload = multer();
router.get("/", controller.index);
router.get("/create", controller.create);
module.exports = router;