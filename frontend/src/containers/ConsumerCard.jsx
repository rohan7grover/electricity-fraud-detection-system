import React from 'react';
import { useNavigate } from 'react-router-dom';

const ConsumerCard = ({ consumerData }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/consumer/${consumerData.consumer_number}`);
    };

    return (
        <div style={cardStyle} onClick={handleClick}>
            <h3>Consumer ID: {consumerData.consumer_number}</h3>
        </div>
    );
};

const cardStyle = {
    cursor: 'pointer',
    border: '1px solid #ddd',
    padding: '10px',
    margin: '10px',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
};

export default ConsumerCard;