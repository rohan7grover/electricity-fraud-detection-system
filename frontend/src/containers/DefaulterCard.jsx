import React from "react";
import { useNavigate } from "react-router-dom";
import '../css/DefaulterCard.css';


const DefaulterCard = ({ uid }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/consumer/${uid}`);
  };

  return (
    <div class="cardStyledefaulter" onClick={handleClick}>
      <h3>Consumer ID: {uid}</h3>
    </div>
  );
};

export default DefaulterCard;
