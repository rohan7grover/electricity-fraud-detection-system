import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Tier2 = ({ user }) => {
    const [areaData, setAreaData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    

    useEffect(() => {
        const fetchAreaData = async () => {
            try {
                const userToken = localStorage.getItem('access');
                const response = await fetch(`${process.env.REACT_APP_API_URL}/get-details/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `JWT ${userToken}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch area data');
                }

                const data = await response.json();
                setAreaData(data.details);
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAreaData();
    }, []);

    const handleButtonClickDefaulters = () => {
        navigate(`/defaulters/${areaData?.city_code.city_code || ''}/${areaData?.area_code || ''}?area_name=${encodeURIComponent(areaData?.area_name || '')}&user_role=${user.role}`);
    };

    const handleButtonClickConsumers = () => {
        navigate(`/consumers/${areaData?.city_code.city_code || ''}/${areaData?.area_code || ''}?area_name=${encodeURIComponent(areaData?.area_name || '')}&user_role=${user.role}`);
    };

    return (
        <div>
        <div className='mt-4'>
            <h1 style={h1color} className='display-4 text-center'>TIER-2 DASHBOARD</h1>
        </div>
            {error && <p>Error: {error}</p>}
            {isLoading && <p>Loading...</p>}
            {areaData && !isLoading && (
                <div className='mt-3'>
                <div className="d-flex align-items-center justify-content-center">
                <div style={cardStyle} className='card col p-3'>
                <h3 className='display'>Officer Name: {user ? user.name : ''}</h3>
                <h3 className='display'>Area Name: {areaData.area_name} </h3>
                <h3 className='display'>City Name: {areaData.city_code.city_name}</h3>
                <h3 className='display'>Area Code: {areaData.area_code}</h3>
                <h3 className='display'>City Code: {areaData.city_code.city_code}</h3>
                </div>
                </div>
                </div>
            )}
            <div className='container-fluid mt-5'>
            <div className="row justify-content-center">
            <button style={buttonStyle} className="card btn col-4 mx-5 align-items-center" onClick={handleButtonClickDefaulters} disabled={isLoading}>
                Defaulters List
            </button>
            <button style={buttonStyle} className="card btn col-4 mx-5 align-items-center" onClick={handleButtonClickConsumers} disabled={isLoading}>
                Consumers List
            </button>
            </div>    
            </div>
        </div>
    );
};

const cardStyle = {
    backgroundColor: '#96B6C5',
    color: '#eeeeee'
  };

const buttonStyle = {
backgroundColor: '#1D3E53',
color: '#eeeeee',
fontSize: '1.7rem',
borderRadius: '10px'
};  
  
  const h1color = {
    color: '#116A7B'
  };
  
export default Tier2;