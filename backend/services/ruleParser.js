class RuleParser {
  constructor() {
    this.tokens = [];
    this.currentToken = 0;
  }

  tokenize(ruleString) {
    const regex = /(\(|\)|AND|OR|[<>=!]+|\w+|'[^']*'|\d+)/g;
    this.tokens = ruleString.match(regex).map((token) => {
      if (token.startsWith("'") && token.endsWith("'")) {
        return token.slice(1, -1);
      }
      return token;
    });
    this.currentToken = 0;
    return this.tokens;
  }

  parseRule(ruleString) {
    this.tokenize(ruleString);
    return this.parseExpression();
  }

  parseExpression() {
    let node = this.parseTerm();

    while (this.currentToken < this.tokens.length) {
      const token = this.tokens[this.currentToken];
      if (token === "AND" || token === "OR") {
        this.currentToken++;
        const rightNode = this.parseTerm();
        node = {
          type: "operator",
          operator: token,
          left: node,
          right: rightNode,
        };
      } else {
        break;
      }
    }

    return node;
  }

  parseTerm() {
    if (this.tokens[this.currentToken] === "(") {
      this.currentToken++;
      const node = this.parseExpression();
      if (this.tokens[this.currentToken] === ")") {
        this.currentToken++;
        return node;
      }
      throw new Error("Missing closing parenthesis");
    }

    return this.parseComparison();
  }

  parseComparison() {
    const field = this.tokens[this.currentToken++];
    const operator = this.tokens[this.currentToken++];
    const value = this.tokens[this.currentToken++];

    return {
      type: "operand",
      field,
      operator,
      value: isNaN(value) ? value : Number(value),
    };
  }
}
module.exports = RuleParser;
