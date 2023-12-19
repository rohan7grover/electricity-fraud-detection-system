import React from 'react';
import { useNavigate } from 'react-router-dom';

const ConsumerCard = ({ consumerData, user_role }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/consumer/${consumerData.consumer_number}?user_role=${user_role}`);
    };


    const cardStyle = {
        cursor: 'pointer',
        border: '1px solid #ddd',
        padding: '10px',
        margin: '10px',
        borderRadius: '10px',
        color: '#116A7B'
    };

    return (
        <div style={cardStyle} className='card col-md-3 col-12' onClick={handleClick}>
            <h2 className='text-center'>Consumer ID: {consumerData.consumer_number}</h2>
        </div>
    );
};

export default ConsumerCard;
