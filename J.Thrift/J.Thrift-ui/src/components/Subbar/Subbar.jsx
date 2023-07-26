import React, { useState } from "react";
import "./Subbar.css";
import { MdArrowDropDown } from 'react-icons/Md';
import { AiOutlineCheck } from 'react-icons/Ai';
import { Link } from "react-router-dom";


export default function Subbar({ handleGenderSelection, handleCategorySelection, showRecommended,showPlanPage, setShowRecommended,setShowPlanPage, user, navigate}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedGender, setSelectedGender] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  // const [selectedImage, setSelectedImage] = useState(null);


  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleGenderClick = (gender) => {
    handleGenderSelection(gender);
    const updatedSelectedGender = isGenderSelected(gender)
      ? selectedGender.filter((selected) => selected !== gender)
      : [...selectedGender, gender];
    setSelectedGender(updatedSelectedGender);
    console.log("g", gender);
  };

  const handleTopsClick = (category) => {
    if (category === "recommended" && !user) {
      navigate("/login");
    } else {
      handleCategorySelection(category);
    }
  };

  const isGenderSelected = (gender) => {
    return selectedGender.includes(gender);
  };

  const handleRecommendedClick = () => {
    setShowRecommended(!showRecommended);
  };

  // const handlePlanClick = () => {
  //     setShowPlanPage(!showPlanPage);
  // };


  return (
    <div className="subbar">
      <div className="GenderBar" onClick={toggleDropdown}>
        Gender <MdArrowDropDown />
      </div>
      {isDropdownOpen && (
        <div className="GenderBarMenu">
          <label className="gender-options" htmlFor="male-checkbox" >
            <input
              type="checkbox"
              id="male-checkbox"
              checked={isGenderSelected("Male")}
              onChange={() => handleGenderClick("Male")}
            />
            <span className="checkbox-custom">{isGenderSelected("Male") && <AiOutlineCheck />}</span>
            Men
          </label>
          <label className="gender-options" htmlFor="female-checkbox">
            <input
              type="checkbox"
              id="female-checkbox"
              checked={isGenderSelected("Female")}
              onChange={() => handleGenderClick("Female")}
            />
            <span className="checkbox-custom">{isGenderSelected("Female") && <AiOutlineCheck />}</span>
            Women
          </label>
        </div>
      )}
      <div className="left-half-subbar">
        <button className="button" onClick={() => handleTopsClick("tops")}>
          <span className="category-label">Tops</span>
        </button>
        <button className="button" onClick={() => handleTopsClick("bottoms")}>
          <span className="category-label">Bottoms</span>
        </button>
        <button className="button" onClick={() => handleTopsClick("outerwear")}>
          <span className="category-label">Outer Layer</span>
        </button>
        <button className="button" onClick={() => handleTopsClick("shoes")}>
          <span className="category-label">Shoes</span>
        </button>
        {user ? (
          <button className="button" onClick={handleRecommendedClick}>
            <span className="category-label">Recommended</span>
          </button>
        ) : (
          <Link to="/login" className="recommended-button">
            <span className="category-label">Recommended</span>
          </Link>
        )}

        {/* {user ? (
          <button className="button" onClick={handlePlanClick}>
            <span className="category-label">Plan an Outfit</span>
          </button>
        ) : (
          <Link to="/login" className="recommended-button">
            <span className="category-label">Plan An Outfit</span>
          </Link>
        )} */}




        {user && (
          <Link to="/myuploads" className="button">
            <span className="category-label">My Uploads</span>

          </Link>
        )}
      </div>
    </div>
  );
}

