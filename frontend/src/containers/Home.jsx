import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { load_user } from '../actions/auth';
import { Link } from 'react-router-dom';
import Tier1 from './Tier1';
import Tier2 from './Tier2';
import Tier3 from './Tier3';
import '../css/Home.css';

//delete this
import { useState } from 'react';
import { mockAuthenticate } from './mockAuth';

const Home = () => {
    const [authData, setAuthData] = useState(mockAuthenticate());
    useEffect(() => {
      setAuthData(mockAuthenticate());
    }, []);
    const { isAuthenticated, user } = authData;
//***********

// uncomment this
// const Home = ({ isAuthenticated, user, load_user }) => {
//   useEffect(() => {
//     load_user();
//   }, [load_user]);
//***********

    return (
      <div>
        {isAuthenticated ? (
          <div>
            {user && user.role === 'tier1' ? (
              <Tier1 user={user} />
            ) : user && user.role === 'tier2' ? (
              <Tier2 user={user} />
            ) : user && user.role === 'tier3' ? (
              <Tier3 user={user} />
            ) : null}
          </div>
        ) : (
          <div className='container'>
            <div class='jumbotron mt-5'>
              <h1 class='display-4'>Welcome to Energy Fraud Detection System</h1>
              <hr class='my-4' />
              <p>Click the Log In button to Continue using our Application</p>
              <Link class='btn btn-primary btn-lg' to='/login' role='button'>Login</Link>
            </div>
          </div>
        )}
      </div>
    );
  };

  const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
  });

  export default connect(mapStateToProps, { load_user })(Home);