const express = require("express");
const router = express.Router();
const multer = require('multer')
const uploadToCloud = require("../../middlewares/admin/uploadCloud.middleware");
const upload = multer();
const validate = require("../../validates/admin/product.validate");



const controller = require("../../controllers/admin/product-category.controller");
router.get("/",controller.index);
router.get("/create",controller.create);
router.post("/create",
  upload.single('thumbnail'),
  uploadToCloud.uploadSingle,
  validate.createPost,
  controller.createPost
);
router.get("/edit/:id",controller.edit);
router.patch("/edit/:id",
  upload.single('thumbnail'),
  uploadToCloud.uploadSingle,
  validate.createPost,
  controller.editPatch
);

module.exports = router;
