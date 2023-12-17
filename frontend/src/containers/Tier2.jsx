import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/tier2.css';

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
            <div className='head2'>
            <h1 className='center-align2'>Tier2 Dashboard</h1>
            <p className='paragraph2'>ID: {user ? user.id : ''}</p>
            <p className='paragraph2'>Name: {user ? user.name : ''}</p>
            <p className='paragraph2'>Email: {user ? user.email : ''}</p>
            <p className='paragraph2'>Role: {user ? user.role : ''}</p>
            </div>
            <div className='button2'>
            <button onClick={handleButtonClickDefaulters}>Show Defaulters List</button>
            <button onClick={handleButtonClickConsumers}>Show Consumers List</button>
            </div>
        </div>
    );
};

export default Tier2;