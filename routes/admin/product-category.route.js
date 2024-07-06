const express = require("express");
const router = express.Router();
const multer = require('multer')
const uploadToCloud = require("../../middlewares/admin/uploadCloud.middleware");
const upload = multer();
const validate = require("../../validates/admin/product.validate");



const controller = require("../../controllers/admin/product-category.controller");
router.get("/",controller.index);
router.get("/create",controller.index);
router.post("/create",
  upload.single('thumbnail'),
  uploadToCloud.uploadSingle,
  validate.createPost,
  controller.createPost
);

module.exports = router;
