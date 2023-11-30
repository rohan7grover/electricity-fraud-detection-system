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
        navigate(`/defaulters/${areaData?.city_code || ''}/${areaData?.area_code || ''}?area_name=${encodeURIComponent(areaData?.area_name || '')}`);
    };

    const handleButtonClickConsumers = () => {
        navigate(`/consumers/${areaData?.city_code || ''}/${areaData?.area_code || ''}`);
    };

    return (
        <div>
            <h1>Tier2</h1>

            {error && <p>Error: {error}</p>}
            {isLoading && <p>Loading...</p>}
            {areaData && !isLoading && (
                <div>
                    <p>Name: {user ? user.name : ''}</p>
                    <p>Area Code: {areaData.area_code}</p>
                    <p>Area Name: {areaData.area_name}</p>
                    <p>City Code: {areaData.city_code}</p>
                </div>
            )}

            <button onClick={handleButtonClickDefaulters} disabled={isLoading}>
                Show Defaulters List
            </button>
            <button onClick={handleButtonClickConsumers} disabled={isLoading}>
                Show Consumers List
            </button>
        </div>
    );
};

export default Tier2;