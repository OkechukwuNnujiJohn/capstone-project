import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SignupForm.css'
import { UserContext } from '../../UserContext.js';

const SignupForm = () => {
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [password, setPassword] = useState('');
  const [favoriteColors, setFavoriteColors] = useState('');
  const [favoriteBrands, setFavoriteBrands] = useState('');


  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:3000/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ first_name, last_name, email, gender, password, favoriteColors: favoriteColors.split(',').map(color => color.trim()), favoriteBrands: favoriteBrands.split(',').map(brand => brand.trim()), }),
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        const loggedInUser = data.user;

        console.log('Signup successful');
        setFirstName('');
        setLastName('');
        setEmail('');
        setGender('');
        setPassword('');
        setFavoriteColors('')
        setFavoriteBrands('')

        updateUser(loggedInUser);
        navigate('/');
      } else {
        alert('Signup failed');
      }
    } catch (error) {
      alert('Signup failed: ' + error);
    }
  };

  return (
    <div className="signup-form-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        <div className="form-group">
          <label htmlFor="first_name">firstName:</label>
          <input
            type="text"
            id="first_name"
            value={first_name}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="last_name">lastName:</label>
          <input
            type="text"
            id="last_name"
            value={last_name}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="gender">gender:</label>
          <input
            type="text"
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
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
        <div className="form-group">
          <label htmlFor="favoriteColors">favoriteColors:</label>
          <input
            type="text"
            id="favoriteColors"
            value={favoriteColors}
            onChange={(e) => setFavoriteColors(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="favoriteBrands">favoriteBrands:</label>
          <input
            type="text"
            id="favoriteBrands"
            value={favoriteBrands}
            onChange={(e) => setFavoriteBrands(e.target.value)}
            required
          />
        </div>
        <button type="submit">Sign Up</button>
        <p>
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </form>
    </div>
  );
};

export default SignupForm;