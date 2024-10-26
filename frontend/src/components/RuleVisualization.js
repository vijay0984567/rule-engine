import React from "react";

const TreeNode = ({ node }) => {
  if (!node) return null;

  return (
    <div className="relative">
      <div className="flex flex-col items-center">
        <div
          className={`
            p-4 rounded-lg mb-4 min-w-[150px] text-center
            ${
              node.type === "operator"
                ? "bg-blue-100 border-2 border-blue-300"
                : "bg-green-100 border-2 border-green-300"
            }
            shadow-sm
          `}
        >
          {node.type === "operator" ? (
            <span className="font-bold">{node.operator}</span>
          ) : (
            <div className="text-sm">
              <div>{node.field}</div>
              <div>
                {node.operator} {node.value}
              </div>
            </div>
          )}
        </div>

        {(node.left || node.right) && (
          <div className="flex gap-8">
            {node.left && (
              <div className="relative">
                <div className="absolute top-0 left-1/2 w-px h-12 bg-gray-300"></div>
                <TreeNode node={node.left} />
              </div>
            )}
            {node.right && (
              <div className="relative">
                <div className="absolute top-0 left-1/2 w-px h-12 bg-gray-300"></div>
                <TreeNode node={node.right} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const RuleVisualization = ({ rule }) => {
  if (!rule || !rule.rootNode) return null;

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm overflow-x-auto">
      <h3 className="text-lg font-semibold mb-4">Rule Visualization</h3>
      <div className="flex justify-center min-w-[800px]">
        <TreeNode node={rule.rootNode} />
      </div>
    </div>
  );
};

export default RuleVisualization;
