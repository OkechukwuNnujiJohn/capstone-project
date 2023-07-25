import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../../UserContext.js';
import './LoginForm.css'

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { updateUser } = useContext(UserContext);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Make the login API request
      console.log("about to fetch");
      const response = await fetch(`http://localhost:3000/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });
      console.log("login response:",response)

      if (response.ok) {
        const data = await response.json();
        const loggedInUser = data.user;


        setEmail('');
        setPassword('');
        
        // Update the user context
        updateUser(loggedInUser);

        // Navigate to the home page after successful login
        navigate('/');
      } else {
        // Handle the login failure case
        alert('Login failed');
      }
    } catch (error) {
      // Handle any network or API request errors
      alert('Login failed: ' + error);
    }
  };

  return (
    <div className='login-form-container'>
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="email">Useremail:</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
        <p>
          New to the app? <Link to="/signup">Sign Up</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;