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
    const area_name = searchParams.get('area_name');
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
        <div className='mt-4'>
        <h1 style={h1color} className='display-4 text-center'>CONSUMERS LIST</h1>
        </div>
        {error && <p>Error: {error}</p>}
          <div className='mt-3 '>
            <div className="d-flex align-items-center justify-content-center">
            <div style={cardStyle} className='card col p-3'>
            <h3 className='display'>Area Code: {area_code}</h3>
            <h3 className='display'>Area Name: {area_name}</h3>
            </div>
            </div>
          </div>
        <div className="container-fluid mt-3">
        <div className="row justify-content-center">
        {consumers.map((defaulter, index) => (
          <ConsumerCard key={index} consumerData={defaulter} user_role={user_role}/>
        ))}
        </div>
        </div>
      </div>
    );
};

const cardStyle = {
    backgroundColor: '#96B6C5',
    color: '#eeeeee'
  };

const h1color = {
    color: '#116A7B',
  };

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(Consumers);