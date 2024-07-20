const express = require("express");
const router = express.Router();
const multer = require('multer')
const validate = require("../../validates/admin/product.validate");
const uploadToCloud = require("../../middlewares/admin/uploadCloud.middleware");



const controller = require("../../controllers/admin/product.controller");

const upload = multer();
router.get("/", controller.index);
router.patch("/change-status/:statusChange/:id", controller.changeStatus);
router.patch("/change-multi", controller.changeMulti);

router.patch("/delete/:id", controller.deleteItem);
router.patch("/change-position/:id", controller.changePosition);
router.get("/create", controller.create);
router.post("/create",
    upload.single('thumbnail'),
    uploadToCloud.uploadSingle,
    validate.createPost,
    controller.createPost
);
router.get("/edit/:id", controller.edit);

router.patch(
    "/edit/:id",
    upload.single('thumbnail'),
    uploadToCloud.uploadSingle,
    validate.createPost,
    controller.editPatch
);
router.get("/detail/:id", controller.detail);
router.get("/trash",controller.trash);
router.patch("/restore/:id", controller.restore);
module.exports = router;