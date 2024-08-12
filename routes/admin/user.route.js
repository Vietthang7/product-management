const express = require("express");
const router = express.Router();
const multer = require('multer');
const validate = require("../../validates/client/user.validate");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");
const upload = multer();
const controller = require("../../controllers/admin/user.controller");
router.get("/", controller.index);
router.get("/create", controller.create);
router.post(
  "/create",
  upload.single('avatar'),
  uploadCloud.uploadSingle,
  validate.Register,
  controller.createPost
);
router.get("/edit/:id",controller.edit);
router.patch("/delete/:id", controller.deleteItem);
router.patch("/change-status/:statusChange/:id", controller.changeStatus);
router.patch(
  "/edit/:id",
  upload.single('avatar'),
  uploadCloud.uploadSingle,
  validate.editPatch,
  controller.editPatch
);
router.get("/detail/:id",controller.detail);
router.get("/trash",controller.trash);
router.patch("/change-multi", controller.changeMulti);
router.patch("/trash/restore/:id", controller.restore);
router.patch("/trash/change-multi", controller.changeMultiRestore);
router.get("/trash/detail/:id", controller.detailTrash);
router.delete("/trash/deletePermanently/:id",controller.deletePermanently);
module.exports = router;