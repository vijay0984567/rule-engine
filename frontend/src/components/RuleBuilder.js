import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  Check,
  Loader2,
  X,
  BookOpen,
  Code2,
  TestTube2,
} from "lucide-react";

const Alert = ({ variant = "default", children, onDismiss }) => {
  const styles = {
    default: "bg-blue-50 text-blue-800 border border-blue-200",
    success: "bg-green-50 text-green-800 border border-green-200",
    error: "bg-red-50 text-red-800 border border-red-200",
  };

  return (
    <div
      className={`${styles[variant]} rounded-lg p-4 flex items-start gap-3 relative`}
    >
      {children}
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

const RuleBuilder = () => {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState("create"); // 'create' or 'test'
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    ruleString: "",
  });
  const [testData, setTestData] = useState({
    age: "",
    department: "",
    salary: "",
    experience: "",
  });
  const [ruleEvaluations, setRuleEvaluations] = useState({});

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://eng-backend-bay.vercel.app/api/rules"
      );
      const data = await response.json();
      setRules(data);
    } catch (err) {
      setError("Failed to fetch rules");
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTestDataChange = (e) => {
    setTestData({
      ...testData,
      [e.target.name]: e.target.value,
    });
  };

  const createRule = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(
        "https://eng-backend-bay.vercel.app/api/rules",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create rule");
      }

      setSuccess("Rule created successfully!");
      setFormData({ name: "", description: "", ruleString: "" });
      fetchRules();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const evaluateRule = async (ruleId) => {
    try {
      setRuleEvaluations((prev) => ({
        ...prev,
        [ruleId]: { loading: true },
      }));

      const response = await fetch(
        "https://eng-backend-bay.vercel.app/api/rules/evaluate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ruleId,
            data: {
              age: parseInt(testData.age),
              department: testData.department,
              salary: parseInt(testData.salary),
              experience: parseInt(testData.experience),
            },
          }),
        }
      );

      const data = await response.json();
      setRuleEvaluations((prev) => ({
        ...prev,
        [ruleId]: { loading: false, result: data.result },
      }));
    } catch (err) {
      setRuleEvaluations((prev) => ({
        ...prev,
        [ruleId]: { loading: false, error: "Failed to evaluate rule" },
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Rule Engine</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("create")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                activeTab === "create"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Code2 className="h-4 w-4" />
              Create Rule
            </button>
            <button
              onClick={() => setActiveTab("test")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                activeTab === "test"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              <TestTube2 className="h-4 w-4" />
              Test Rules
            </button>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <Alert
            variant="error"
            className="mb-4"
            onDismiss={() => setError(null)}
          >
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-medium mb-1">Error</h4>
              <p className="text-sm">{error}</p>
            </div>
          </Alert>
        )}

        {success && (
          <Alert
            variant="success"
            className="mb-4"
            onDismiss={() => setSuccess(null)}
          >
            <Check className="h-5 w-5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-medium mb-1">Success</h4>
              <p className="text-sm">{success}</p>
            </div>
          </Alert>
        )}

        <div className="grid grid-cols-1 gap-8">
          {/* Rule Creation Form */}
          {activeTab === "create" && (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <Code2 className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-semibold">Create New Rule</h2>
              </div>
              <form onSubmit={createRule} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rule Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rule String
                  </label>
                  <textarea
                    name="ruleString"
                    value={formData.ruleString}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border rounded-md font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    required
                    placeholder="(age > 30 AND department = 'Sales') AND (salary > 50000)"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Check className="h-5 w-5" />
                      Create Rule
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Test Data Form */}
          {activeTab === "test" && (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <TestTube2 className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-semibold">Test Data</h2>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={testData.age}
                    onChange={handleTestDataChange}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={testData.department}
                    onChange={handleTestDataChange}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salary
                  </label>
                  <input
                    type="number"
                    name="salary"
                    value={testData.salary}
                    onChange={handleTestDataChange}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Experience
                  </label>
                  <input
                    type="number"
                    name="experience"
                    value={testData.experience}
                    onChange={handleTestDataChange}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Rules List */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-semibold">Existing Rules</h2>
            </div>
            {loading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : (
              <div className="space-y-4">
                {rules.map((rule) => (
                  <div
                    key={rule._id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{rule.name}</h3>
                        <p className="text-sm text-gray-600">
                          {rule.description}
                        </p>
                      </div>
                      <button
                        onClick={() => evaluateRule(rule._id)}
                        disabled={
                          !testData.age ||
                          !testData.department ||
                          !testData.salary ||
                          !testData.experience
                        }
                        className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {ruleEvaluations[rule._id]?.loading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Evaluating...
                          </>
                        ) : (
                          <>
                            <TestTube2 className="h-4 w-4" />
                            Evaluate
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="bg-gray-50 p-3 rounded-md text-sm overflow-x-auto border font-mono">
                      {rule.ruleString}
                    </pre>
                    {ruleEvaluations[rule._id]?.result !== undefined && (
                      <div className="mt-3 p-2 rounded-md text-sm bg-gray-50">
                        Result:{" "}
                        <span
                          className={
                            ruleEvaluations[rule._id].result
                              ? "text-green-600 font-semibold"
                              : "text-red-600 font-semibold"
                          }
                        >
                          {ruleEvaluations[rule._id].result
                            ? "Match"
                            : "No Match"}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RuleBuilder;
