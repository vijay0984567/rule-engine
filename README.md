# Rule Engine Application

## Objective
The Rule Engine Application is a 3-tier system designed to determine user eligibility based on various attributes like age, department, and income. It uses an Abstract Syntax Tree (AST) to represent conditional rules and supports dynamic rule creation, combination, and modification.

## Features
- **Dynamic Rule Creation**: Input custom rule strings and convert them into ASTs.
- **Rule Evaluation**: Evaluate user eligibility based on provided attributes (e.g., age, department, income).
- **Rule Combination**: Combine multiple rules using logical operators (AND/OR) for complex eligibility conditions.

## Data Structure
The rules are represented as nodes in an AST with the following properties:
- **type**: A string indicating the node type (`operator` for AND/OR, `operand` for conditions).
- **left**: Reference to another node (left child).
- **right**: Reference to another node (right child for operators).
- **value**: Optional value for operand nodes (e.g., numbers for comparisons).

## Database Design
The application stores rules and metadata in a NoSQL database (MongoDB). Each rule is associated with its root AST node, and nodes are stored recursively to facilitate easy modification and combination.

### Sample Schema
- **Node**:
  - `type`: String  
  - `operator`: String (e.g., AND, OR)  
  - `field`: String (attribute name, e.g., age)  
  - `value`: String/Number (e.g., 30 for age)  
  - `left`: Reference to left child node  
  - `right`: Reference to right child node  

- **Rule**:
  - `name`: String  
  - `description`: String  
  - `rootNode`: Reference to root node of the AST  

### Sample Rules
1. `((age > 30 AND department = 'Sales') OR (age < 25 AND department = 'Marketing')) AND (salary > 50000 OR experience > 5)`
2. `((age > 30 AND department = 'Marketing')) AND (salary > 20000 OR experience > 5)`

## API Endpoints
1. **Create Rule**  
   - **Endpoint**: `/api/rules`  
   - **Method**: `POST`  
   - **Description**: Create a new rule by providing a rule string, which is parsed into an AST.  
   - **Request**:
     ```json
     {
       "name": "Rule 1",
       "description": "Sample rule",
       "ruleString": "(age > 30 AND department = 'Sales') OR (salary > 50000)"
     }
     ```

2. **Evaluate Rule**  
   - **Endpoint**: `/api/rules/evaluate`  
   - **Method**: `POST`  
   - **Description**: Evaluate a rule against a user's data.  
   - **Request**:
     ```json
     {
       "ruleId": "123",
       "data": {
         "age": 35,
         "department": "Sales",
         "salary": 60000
       }
     }
     ```
   - **Response**:
     ```json
     {
       "result": true
     }
     ```

3. **Combine Rules**  
   - **Endpoint**: `/api/rules/combine`  
   - **Method**: `POST`  
   - **Description**: Combine multiple rules into a single AST using the OR operator.  
   - **Request**:
     ```json
     {
       "ruleIds": ["123", "456"]
     }
     ```

## Frontend
The frontend provides a user-friendly interface for creating, viewing, and evaluating rules. It communicates with the backend API to manage rule logic.

### Main Components
- **RuleCreation**: Form to input rule strings and submit them to the backend.
- **RuleListing**: Displays all created rules with options to evaluate or combine them.
- **RuleEvaluation**: Interface to input user data and evaluate eligibility against existing rules.

## Technologies Used
- **Frontend**: React  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB  
- **Other Libraries**: Mongoose (for MongoDB modeling), AST parsing libraries  

## Testing
Test the application by creating, combining, and evaluating rules. Handle cases where:
- Rules are invalid or contain missing operators.
- Data does not meet rule criteria.

## Future Extensions
- **User-defined functions**: Extend the rule language to support custom functions for advanced conditions.
- **Advanced error handling**: Implement comprehensive validation for invalid rules and data formats.

## Setup
1. **Clone the repository**:
   ```bash
   git clone https://github.com/vijay098567/rule-engine.git
1. **Install Dependencies**:
   ```bash
   npm install
1. **Run the application**:
   ```bash
   npm start

## Live Site
The application is live at https://eng-rule.netlify.app/
