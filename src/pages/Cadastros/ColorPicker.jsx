import React from "react";
import colorMap from "./colorMap"; // Importe o seu colorMap

const ColorPicker = ({ color }) => {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div
        style={{
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          backgroundColor: colorMap[color],
          marginRight: "10px",
          border: "1px solid #000",
        }}
      ></div>
     
    </div>
  );
};

export default ColorPicker;
