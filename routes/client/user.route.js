const express = require("express");
const router = express.Router();
const multer = require('multer');
const validatePassword = require("../../validates/client/password.validate");
const validateInfoUser = require("../../validates/client/user.validate");
const controller = require("../../controllers/client/user.controller");
const userMiddleware = require("../../middlewares/client/user.middleware");
const uploadToCloud = require("../../middlewares/admin/uploadCloud.middleware");
const upload = multer();
router.get("/register", controller.register);
router.post("/register", validateInfoUser.Register, controller.registerPost);
router.get("/login", controller.login);
router.post("/login", controller.loginPost);
router.get("/logout", controller.logout);
router.get("/password/forgot", controller.forgotPassword);
router.post("/password/forgot", controller.forgotPasswordPost);
router.get("/password/otp", controller.otpPassword);
router.post("/password/otp", controller.otpPasswordPost);
router.get("/password/reset",userMiddleware.requireAuth,controller.resetPassword);
router.patch("/password/reset", userMiddleware.requireAuth,validatePassword.valiPassword, controller.resetPasswordPatch);
router.get("/profile",userMiddleware.requireAuth,controller.profile);
router.get("/edit",userMiddleware.requireAuth,controller.editProfile);
router.patch(
  "/edit",
  upload.single('avatar'),
  uploadToCloud.uploadSingle,
  validateInfoUser.infoUser,
  controller.editPatch
);
router.get("/password-old",userMiddleware.requireAuth,controller.oldPassword);
router.post("/password-old",userMiddleware.requireAuth,validatePassword.valiPassword,controller.oldPasswordPost);
module.exports = router;
