import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from './logo.png';
import { AiOutlineShoppingCart, AiOutlineCheck} from 'react-icons/Ai';
import {MdArrowDropDown} from 'react-icons/Md';


export default function Navbar({ handleBrandSelection }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState([]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleBrandClick = (brand) => {
    handleBrandSelection(brand);
    console.log("b",brand);
  };

  const isBrandSelected = (brand) => {
    return selectedBrands.includes(brand);
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
            Categories <MdArrowDropDown/>
          </div>
          {isDropdownOpen && (
            <div className="navbar-dropdown-menu">
                <label className="checkbox-label">
                    <input
                    type="checkbox"
                    checked={isBrandSelected("Carhartt")}
                    onChange={() => handleBrandClick("Carhartt")}
                    />
                    <span className="checkbox-custom"></span>
                    Carhartt
              </label> 

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isBrandSelected("Harley Davidson")}
                  onChange={() => handleBrandClick("Harley Davidson")}
                />
                <span className="checkbox-custom"></span>
                Harley Davidson
              </label> 
               <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isBrandSelected("Stussy")}
                  onChange={() => handleBrandClick("Stussy")}
                />
                <span className="checkbox-custom"></span>
                Stussy
              </label> 
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isBrandSelected("Ralph Lauren")}
                  onChange={() => handleBrandClick("Ralph Lauren")}
                />
                <span className="checkbox-custom"></span>
                Ralph Lauren
              </label> 
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isBrandSelected("Polo")}
                  onChange={() => handleBrandClick("Polo")}
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
