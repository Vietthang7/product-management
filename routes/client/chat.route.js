const express = require("express");
const router = express.Router();

const chatMiddleware = require("../../middlewares/client/chat.middleware");
const controller = require("../../controllers/client/chat.controller");
router.get("/:roomChatId/addMember",
  chatMiddleware.isAccess,
  controller.addMember); // Phải để  /:roomChatId/addMember lên trên /:roomChatId/:id để tránh xung đột do 
// Các route mà bạn đã định nghĩa có thể gây ra xung đột, đặc biệt là giữa route /:roomChatId/:id và route /:roomChatId/addMember. Vì addMember là một chuỗi cụ thể, nó vẫn khớp với route /:roomChatId/:id (trong đó :id có thể là addMember). Điều này có thể làm cho Express không biết nên gọi controller nào cho trường hợp này.
// Để giải quyết tình huống này, bạn có thể điều chỉnh các route của mình để tránh xung đột. Một trong những cách để làm điều này là sắp xếp các route từ những con đường cụ thể đến những con đường tổng quát hơn, hoặc làm cho addMember có một route cụ thể hơn mà không có khả năng bị xung đột với route khác.
router.get("/:roomChatId/:id",
  chatMiddleware.isAccess,
  controller.index);

router.get("/:roomChatId",
  chatMiddleware.isAccess,
  controller.roomChat);
module.exports = router;
