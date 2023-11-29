import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { signup } from '../actions/auth';
import '../css/Signup.css';

const Signup = ({ signup, isAuthenticated }) => {
  const [accountCreated, setAccountCreated] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    password: '',
    re_password: ''
  });

  const { name, email, role, password, re_password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();

    if (password === re_password) {
      signup(name, email, role, password, re_password);
      setAccountCreated(true);
    }
  };

  if (isAuthenticated) {
    return <Navigate to='/' />
  }
  if (accountCreated) {
    return <Navigate to='/login' />
  }

  return (
    <div className='container mt-5'>
      <div class='sak'>
      <h1>Sign Up</h1>
      <p>Create your Account</p>
      <form onSubmit={e => onSubmit(e)}>
        <div className='form-group'>
          <input
            className='form-control'
            type='text'
            placeholder='Enter your name'
            name='name'
            value={name}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <div className='form-group'>
          <input
            className='form-control'
            type='email'
            placeholder='Enter your email'
            name='email'
            value={email}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <div className='form-group'>
          <select
            className='form-control'
            name='role'
            value={role}
            onChange={e => onChange(e)}
            required
          >
            <option value='' disabled>Select Role</option>
            <option value='tier1'>Tier 1</option>
            <option value='tier2'>Tier 2</option>
            <option value='tier3'>Tier 3</option>
            <option value='admin'>Admin</option>
          </select>
        </div>
        <div className='form-group'>
          <input
            className='form-control'
            type='password'
            placeholder='Enter your password'
            name='password'
            value={password}
            onChange={e => onChange(e)}
            minLength='6'
            required
          />
        </div>
        <div className='form-group'>
          <input
            className='form-control'
            type='password'
            placeholder='Confirm your password'
            name='re_password'
            value={re_password}
            onChange={e => onChange(e)}
            minLength='6'
            required
          />
        </div>
        <button className='btn btn-primary' type='submit'>Register</button>
      </form>
      <p className='mt-3'>
        Already have an account? <Link class='link-text' to='/login'>Sign In</Link>
      </p>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { signup })(Signup);