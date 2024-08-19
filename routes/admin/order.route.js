const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/order.controller");
router.get("/", controller.index);
router.patch("/change-status/:statusChange/:id", controller.changeStatus);
router.patch("/change-multi", controller.changeMulti);
router.get("/edit/:id", controller.edit);
router.patch("/edit/:id/:productId/:quantity",controller.update);
module.exports = router;