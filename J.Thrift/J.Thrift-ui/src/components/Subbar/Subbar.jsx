import React, { useState } from "react";
import "./Subbar.css";
import {MdArrowDropDown} from 'react-icons/Md';


export default function Subbar({ handleGenderSelection, handleCategorySelection}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedGender, setSelectedGender] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

//   const [isSelectedTops, setIsSelectedTops] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleGenderClick = (gender) => {
    handleGenderSelection(gender);
    console.log("g",gender);
  };

  const handleTopsClick = (category) => {
    handleCategorySelection(category);
  };

  const isGenderSelected = (gender) => {
    return selectedGender.includes(gender);
  };

  return (
    <div className="subbar">
        <div className="GenderBar" onClick={toggleDropdown}>
            Gender <MdArrowDropDown/>
          </div>
    {isDropdownOpen && (
      <div className="GenderBarMenu" onClick={toggleDropdown}>
      <div className="genderOptions" onClick={() => handleGenderClick("Male")}>
            <input
            type="checkbox"
            checked={isGenderSelected("Male")}
            onChange={() => handleGenderClick("Male")}
            />
            <span className="checkbox-custom"></span>
            Men
        </div> 
        <div className="gender-options" onClick={() => handleGenderClick("Female")}>
            <input
            type="checkbox"
            checked={isGenderSelected("Female")}
            onChange={() => handleGenderClick("Female")}
            />
            <span className="checkbox-custom"></span>
            Women
        </div> 
      </div>
    )}

    <div className="left-half-subbar">
    <button
  className="tops-button"
  onClick={() => handleTopsClick("tops")}
>
  <label className="category-label">
    <span className="checkbox-custom"></span>
    Tops
  </label>
</button>
<button
  className="bottoms-button"
  onClick={() => handleTopsClick("bottoms")}
>
  <label className="category-label">
    <span className="checkbox-custom"></span>
    Bottoms
  </label>
</button>
<button
  className="outerLayer-button"
  onClick={() => handleTopsClick("outerwear")}
>
  <label className="category-label">
    <span className="checkbox-custom"></span>
    Out Layer
  </label>
</button>
<button
  className="shoes-button"
  onClick={() => handleTopsClick("shoes")}
>
  <label className="category-label">
    <span className="checkbox-custom"></span>
    Shoes
  </label>
</button>
    </div>
    </div>
  )
}