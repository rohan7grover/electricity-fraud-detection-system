import React from 'react';
import { useNavigate } from 'react-router-dom';

const Tier2 = ({ user }) => {
    const navigate = useNavigate();

    const areaCode = '123';

    const handleButtonClickDefaulters = () => {
        navigate(`/defaulters/${areaCode}`);
    };
    
    const handleButtonClickConsumers = () => {
        navigate(`/consumers/${areaCode}`);
    };

    return (
        <div>
            <h1>Tier2</h1>
            <p>ID: {user ? user.id : ''}</p>
            <p>Name: {user ? user.name : ''}</p>
            <p>Email: {user ? user.email : ''}</p>
            <p>Role: {user ? user.role : ''}</p>

            <button onClick={handleButtonClickDefaulters}>Show Defaulters List</button>
            <button onClick={handleButtonClickConsumers}>Show Consumers List</button>
        </div>
    );
};

export default Tier2;