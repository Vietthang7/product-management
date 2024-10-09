const express = require("express");
const router = express.Router();

const chatMiddleware = require("../../middlewares/client/chat.middleware");
const controller = require("../../controllers/client/chat.controller");
router.get("/:roomChatId/:id",
  chatMiddleware.isAccess,
  controller.index);
router.get("/:roomChatId",
  chatMiddleware.isAccess,
  controller.roomChat);
module.exports = router;
