import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from './logo.png';
import { AiOutlineShoppingCart, AiOutlineCheck } from 'react-icons/Ai';
import { MdArrowDropDown } from 'react-icons/Md';
import { UserContext } from "../../../UserContext";

export default function Navbar({ handleBrandSelection }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleBrandClick = (brand) => {
    handleBrandSelection(brand);
    const updatedBrands = isBrandSelected(brand)
      ? selectedBrands.filter((selectedBrand) => selectedBrand != brand)
      : [...selectedBrands, brand];
    setSelectedBrands(updatedBrands);
    console.log("b", brand);
  };

  const isBrandSelected = (brand) => {
    return selectedBrands.includes(brand);
  };

  const handleUploadClick = () => {
    if (user) {
      navigate("/uploadpage");
    } else {
      navigate("/login");
    }
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
            Categories <MdArrowDropDown />
          </div>
          {isDropdownOpen && (
            <div className="navbar-dropdown-menu">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isBrandSelected("Carhartt")}
                  onChange={() => handleBrandClick("Carhartt")}
                />
                <span className="checkbox-custom">{isBrandSelected("Carhartt") && <AiOutlineCheck />}</span>
                Carhartt
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isBrandSelected("Harley Davidson")}
                  onChange={() => handleBrandClick("Harley Davidson")}
                />
                <span className="checkbox-custom">{isBrandSelected("Harley Davidson") && <AiOutlineCheck />}</span>
                Harley Davidson
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isBrandSelected("Stussy")}
                  onChange={() => handleBrandClick("Stussy")}
                />
                <span className="checkbox-custom">{isBrandSelected("Stussy") && <AiOutlineCheck />}</span>
                Stussy
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isBrandSelected("Ralph Lauren")}
                  onChange={() => handleBrandClick("Ralph Lauren")}
                />
                <span className="checkbox-custom">{isBrandSelected("Ralph Lauren") && <AiOutlineCheck />}</span>
                Ralph Lauren
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isBrandSelected("Polo")}
                  onChange={() => handleBrandClick("Polo")}
                />
                <span className="checkbox-custom">{isBrandSelected("Polo") && <AiOutlineCheck />}</span>
                Polo
              </label>
            </div>
          )}
        </div>
        <Link to="/plananoutfit" className="navbar-link">
          Plan An Outfit
        </Link>
        <Link to="/buy" className="navbar-link">
          My cart <AiOutlineShoppingCart />
        </Link>
        <button to="/uploadpage" className="navbar-link" onClick={handleUploadClick}>
          Upload Image
        </button>
      </div>
    </nav>
  );
}
