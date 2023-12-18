import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ConsumerCard from './ConsumerCard';

const Consumers = ({ isAuthenticated }) => {
    const { area_code, city_code } = useParams();
    const navigate = useNavigate();
    const [consumers, setConsumers] = useState([]);
    const [error, setError] = useState(null);

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const user_role = searchParams.get('user_role');

    useEffect(() => {
        const fetchConsumerIDs = async () => {
            try {
                const userToken = localStorage.getItem('access');
                const response = await fetch(`${process.env.REACT_APP_API_URL}/get-consumers/${city_code}/${area_code}/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `JWT ${userToken}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch consumer IDs');
                }

                const data = await response.json();
                setConsumers(data.consumers);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchConsumerIDs();
    }, [city_code, area_code]);

    if (!isAuthenticated) {
        navigate('/');
    }

    return (
        <div>
            <h1>Consumers</h1>
            <p>Area Code: {area_code}</p>

            {error && <p>Error: {error}</p>}
            {consumers.map((consumer, index) => (
                <ConsumerCard key={index} consumerData={consumer} user_role={user_role}/>
            ))}
        </div>
    );
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(Consumers);