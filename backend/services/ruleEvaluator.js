class RuleEvaluator {
  evaluate(node, data) {
    if (node.type === "operand") {
      const fieldValue = data[node.field];
      const nodeValue = node.value;

      switch (node.operator) {
        case ">":
          return fieldValue > nodeValue;
        case "<":
          return fieldValue < nodeValue;
        case "=":
          return fieldValue === nodeValue;
        case ">=":
          return fieldValue >= nodeValue;
        case "<=":
          return fieldValue <= nodeValue;
        case "!=":
          return fieldValue !== nodeValue;
        default:
          throw new Error(`Unknown operator: ${node.operator}`);
      }
    }

    if (node.type === "operator") {
      const leftResult = this.evaluate(node.left, data);
      const rightResult = this.evaluate(node.right, data);

      switch (node.operator) {
        case "AND":
          return leftResult && rightResult;
        case "OR":
          return leftResult || rightResult;
        default:
          throw new Error(`Unknown operator: ${node.operator}`);
      }
    }

    throw new Error("Invalid node type");
  }
}
module.exports = RuleEvaluator;