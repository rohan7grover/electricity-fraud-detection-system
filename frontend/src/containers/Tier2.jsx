import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Tier2 = ({ user }) => {
    const [areaData, setAreaData] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAreaData = async () => {
            try {
                const userToken = localStorage.getItem('access');
                const response = await fetch('http://localhost:8000/get-area-code/', {
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
                setAreaData(data.area);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchAreaData();
    }, []);

    const handleButtonClickDefaulters = () => {
        navigate(`/defaulters/${areaData?.area_code || ''}?area_name=${encodeURIComponent(areaData?.area_name || '')}`);
    };

    const handleButtonClickConsumers = () => {
        navigate(`/consumers/${areaData?.city_code || ''}/${areaData?.area_code || ''}`);
    };

    return (
        <div>
            <h1>Tier2</h1>

            {error && <p>Error: {error}</p>}
            {areaData && (
                <div>
                    <p>Area Code: {areaData.area_code}</p>
                    <p>Area Name: {areaData.area_name}</p>
                    <p>City Code: {areaData.city_code}</p>
                </div>
            )}

            <button onClick={handleButtonClickDefaulters}>Show Defaulters List</button>
            <button onClick={handleButtonClickConsumers}>Show Consumers List</button>
        </div>
    );
};

export default Tier2;