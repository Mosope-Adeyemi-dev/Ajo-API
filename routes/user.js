const express = require("express");
const formidable = require("express-formidable-v2");

const router = express.Router();

const {
  userProfile,
  deleteAccount,
  updateAccount,
  changePassword,
  profiles,
  deleteAll,
} = require("../controllers/user.controller");

const { requireSignin } = require("../middlewares/authToken");

router.get("/user/profile/:id", requireSignin, userProfile);
router.delete("/user/delete", requireSignin, deleteAccount);
router.patch("/user/me", requireSignin, formidable(), updateAccount);
router.put("/user/change-password", requireSignin, changePassword);

// development only
router.get("/user/profiles", requireSignin, profiles);
router.post("/user/delete-all", requireSignin, deleteAll);

module.exports = router;
