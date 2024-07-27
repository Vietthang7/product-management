const express = require("express");
const router = express.Router();
const validate = require("../../validates/admin/account.validate.js");
const multer  = require('multer');
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

const upload = multer();
const controller = require("../../controllers/admin/account.controller.js");
router.get("/",controller.index);
router.get("/create",controller.create);
router.post(
  "/create",
  upload.single('avatar'),
  uploadCloud.uploadSingle,
  validate.createPostAccount,
  controller.createPost
);
router.get("/edit/:id",controller.edit);
router.patch(
  "/edit/:id",
  upload.single('avatar'),
  uploadCloud.uploadSingle,
  validate.createPostAccount,
  controller.editPatch
);
router.get("/detail/:id",controller.detail);
router.patch("/delete/:id",controller.deleteItem);
router.patch("/change-status/:statusChange/:id", controller.changeStatus);
router.patch("/change-multi", controller.changeMulti);
router.get("/trash",controller.trash);
router.get("/trash/detail/:id",controller.detailTrash);
router.delete("/trash/deletePermanently/:id",controller.deletePermanently);
router.patch("/trash/restore/:id", controller.restore);
router.patch("/trash/change-multi", controller.changeMultiRestore);
module.exports = router;
