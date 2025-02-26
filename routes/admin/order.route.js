const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/order.controller");
const validate = require("../../validates/admin/product.validate");
router.get("/", controller.index);
router.patch("/change-status/:statusChange/:id", controller.changeStatus);
router.patch("/change-multi", controller.changeMulti);
router.get("/edit/:id", controller.edit);
router.patch(
  "/edit/:id",
  validate.inFoClient,
  controller.editPatch
);
router.post("/export-excel",controller.exportExcel);
router.get("/detail/:id", controller.detail);
router.patch("/delete/:id", controller.deleteItem);
module.exports = router;