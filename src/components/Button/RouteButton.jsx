import React from "react";
import { useNavigate } from "react-router-dom";

const RouteButton = ({ to, text }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(to);
  };

  return (
    <button
      onClick={handleClick}
      className="px-7 py-1.5 bg-primary text-white rounded-[60px] font-korean border-[3px] border-grayBorder hover:bg-secondary transition"
    >
      {text}
    </button>
  );
};

export default RouteButton;
