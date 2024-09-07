const express = require("express");
const router = express.Router();
const validate = require("../../validates/client/order.validate.js");

const controller = require("../../controllers/client/checkout.controller.js");
router.get("/", controller.index);
router.get("/payment", controller.payMent);
router.post("/order",
  validate.inFoUserOrder,
  controller.orderPost
);
router.get("/success/:orderId", controller.success);
module.exports = router;
