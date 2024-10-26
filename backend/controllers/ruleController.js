const Rule = require("../models/Rule");
const Node = require("../models/Node");
const RuleParser = require("../services/ruleParser");
const RuleEvaluator = require("../services/ruleEvaluator");

const ruleController = {
  async createRule(req, res) {
    console.log("Here");
    try {
      const { name, description, ruleString } = req.body;
      // console.log(req.body);
      const parser = new RuleParser();
      const ast = parser.parseRule(ruleString);

      // Create nodes recursively
      const createNode = async (nodeData) => {
        if (!nodeData) return null;

        const node = new Node({
          type: nodeData.type,
          operator: nodeData.operator,
          field: nodeData.field,
          value: nodeData.value,
        });

        await node.save();

        if (nodeData.left) {
          const leftNode = await createNode(nodeData.left);
          node.left = leftNode._id;
        }

        if (nodeData.right) {
          const rightNode = await createNode(nodeData.right);
          node.right = rightNode._id;
        }

        await node.save();
        return node;
      };

      const rootNode = await createNode(ast);

      const rule = new Rule({
        name,
        description,
        rootNode: rootNode._id,
      });

      await rule.save();

      res.status(201).json(rule);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  async getRules(req, res) {
    try {
      const rules = await Rule.find().populate("rootNode");
      res.json(rules);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async evaluateRule(req, res) {
    console.log("evaluate");
    try {
      const { ruleId, data } = req.body;
      const rule = await Rule.findById(ruleId).populate({
        path: "rootNode",
        populate: {
          path: "left right",
          populate: {
            path: "left right",
          },
        },
      });

      if (!rule) {
        return res.status(404).json({ error: "Rule not found" });
      }

      const evaluator = new RuleEvaluator();
      const result = evaluator.evaluate(rule.rootNode, data);

      res.json({ result });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async combineRules(req, res) {
    try {
      const { ruleIds } = req.body;
      const rules = await Rule.find({ _id: { $in: ruleIds } }).populate(
        "rootNode"
      );

      if (rules.length < 2) {
        return res
          .status(400)
          .json({ error: "At least two rules are required for combination" });
      }

      // Combine rules with OR operator
      const combinedAst = {
        type: "operator",
        operator: "OR",
        left: rules[0].rootNode,
        right: rules[1].rootNode,
      };

      // Add additional rules
      for (let i = 2; i < rules.length; i++) {
        combinedAst = {
          type: "operator",
          operator: "OR",
          left: combinedAst,
          right: rules[i].rootNode,
        };
      }

      const rootNode = await createNode(combinedAst);

      const combinedRule = new Rule({
        name: `Combined Rule ${Date.now()}`,
        description: "Automatically combined rule",
        rootNode: rootNode._id,
      });

      await combinedRule.save();

      res.status(201).json(combinedRule);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = ruleController;
