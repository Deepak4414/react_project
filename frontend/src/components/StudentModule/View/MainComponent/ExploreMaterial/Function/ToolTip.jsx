import React from "react";
import "./ToolTips.css"; // Include the CSS provided

const ToolTip = ({ text, children }) => {
  return (
    <span className="tool" data-tip={text}>
      {children}
    </span>
  );
};

export default ToolTip;
