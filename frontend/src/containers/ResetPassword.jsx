import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { reset_password } from '../actions/auth';

const ResetPassword = ({ reset_password }) => {
  const [requestSent, setRequestSent] = useState(false);
  const [formData, setFormData] = useState({
    email: ''
  });

  const { email } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();

    reset_password(email);
    setRequestSent(true);
  };

  if (requestSent) {
    return <Navigate to='/' />
  }

  return (
    <div className='container mt-5'>
      <h1 style={h1color} >Request Password Reset:</h1>
      <form onSubmit={e => onSubmit(e)}>
        <div className='form-group'>
          <input
            className='form-control'
            type='email'
            placeholder='Email'
            name='email'
            value={email}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <div className='container-fluid mt-5 mb-4'>
                <div className="d-flex align-items-center justify-content-center">
        <button style={btnStyle} className='btn card' type='submit'>Reset Password</button>
        </div>
        </div>
      </form>
    </div>
  );
};

const btnStyle = {
  backgroundColor: '#1D3E53',
  color: '#eeeeee',
  fontSize: '1.7rem',
  borderRadius: '10px'
  }; 


  const h1color = {
    color: '#116A7B'
  };

export default connect(null, { reset_password })(ResetPassword);