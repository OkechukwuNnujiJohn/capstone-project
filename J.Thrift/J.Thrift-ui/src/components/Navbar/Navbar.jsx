import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from './logo.png';
import { AiOutlineShoppingCart } from 'react-icons/Ai';

export default function Navbar({ handleCategorySelection }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleCategoryClick = (category) => {
    handleCategorySelection(category);
  };

  const isCategorySelected = (category) => {
    return selectedCategories.includes(category);
  };

  return (
    <nav className="navbar">
      <div className="NavbarLogo">
        <img src={logo} alt="Logo" className="logo" />
      </div>

      <div className="navbar-links">
        <Link to="/" className="navbar-link">
          Home
        </Link>
        <Link to="/about" className="navbar-link">
          About Us
        </Link>
        <Link to="/contact" className="navbar-link">
          Contact Us
        </Link>
        <div className="navbar-link">
          <div className="dropdown-links" onClick={toggleDropdown}>
            Categories
          </div>
          {isDropdownOpen && (
            <div className="navbar-dropdown-menu">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isCategorySelected("Carhartt")}
                  onChange={() => handleCategoryClick("Carhartt")}
                />
                <span className="checkbox-custom"></span>
                Carhartt
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isCategorySelected("Harley Davidson")}
                  onChange={() => handleCategoryClick("Harley Davidson")}
                />
                <span className="checkbox-custom"></span>
                Harley Davidson
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isCategorySelected("Stussy")}
                  onChange={() => handleCategoryClick("Stussy")}
                />
                <span className="checkbox-custom"></span>
                Stussy
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isCategorySelected("Ralph Lauren")}
                  onChange={() => handleCategoryClick("Ralph Lauren")}
                />
                <span className="checkbox-custom"></span>
                Ralph Lauren
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isCategorySelected("Polo")}
                  onChange={() => handleCategoryClick("Polo")}
                />
                <span className="checkbox-custom"></span>
                Polo
              </label>
              {/* Add more categories here */}
            </div>
          )}
        </div>
        <Link to="/buy" className="navbar-link">
          Plan An Outfit
        </Link>
        <Link to="/buy" className="navbar-link">
          My cart <AiOutlineShoppingCart />
        </Link>
      </div>
    </nav>
  );
}
