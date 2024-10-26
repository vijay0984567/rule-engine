const express = require("express");
const router = express.Router();
const ruleController = require("../controllers/ruleController");

router.get("/rules", ruleController.getRules);
router.post("/rules", ruleController.createRule);
router.post("/rules/evaluate", ruleController.evaluateRule);
router.post("/rules/combine", ruleController.combineRules);
module.exports = router;
