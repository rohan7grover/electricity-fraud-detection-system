import React from 'react';
import { connect } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import DefaulterCard from './DefaulterCard';

const Defaulters = ({ isAuthenticated }) => {
    const { area_code } = useParams();
    const navigate = useNavigate();
    const defaulterIDS = ['123', '456', '567'];

    if (!isAuthenticated) {
        navigate('/');
    }

    return (
        <div>
            <h1>Defaulters</h1>
            <p>Area Code: {area_code}</p>

            {defaulterIDS.map((uid, index) => (
                <DefaulterCard key={index} uid={uid} />
            ))}
        </div>
    );
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(Defaulters);