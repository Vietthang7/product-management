const express = require("express");
const router = express.Router();
const multer = require('multer')
const uploadToCloud = require("../../middlewares/admin/uploadCloud.middleware");
const upload = multer();
const validate = require("../../validates/admin/product.validate");
const controller = require("../../controllers/admin/article-category.controller");

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
router.get("/detail/:id", controller.detail);
router.patch("/change-status/:statusChange/:id",controller.changeStatus);
router.patch("/delete/:id", controller.deleteItem);
router.patch("/change-position/:id", controller.changePosition);
router.patch("/change-multi", controller.changeMulti);
router.get("/trash",controller.trash);
router.get("/trash/detail/:id", controller.detailTrash);
router.patch("/trash/restore/:id", controller.restore);
router.delete("/trash/deletePermanently/:id",controller.deletePermanently);
router.patch("/trash/change-multi", controller.changeMultiRestore);
module.exports = router;