import "./Main.css";
import React from 'react'
import { useState, useEffect, useContext, createContext} from "react";
import { UserContext } from "../../UserContext.js";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Subbar from "../Subbar/Subbar";
import MyUploadsPage from '../MyUploadsPage/MyUploadsPage';

export const RefreshContext = createContext();

function Main() {
  const { user, updateUser } = useContext(UserContext);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedGender, setSelectedGender] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showRecommended, setShowRecommended] = useState(false);
  const [recommendedChanged, setRecommendedChanged] = useState(false); // New state variable
  const navigate = useNavigate();
  const [refreshData, setRefreshData] = useState(false);


  useEffect(() => {
    const fetchItems = async () => {
      const response = await fetch("http://localhost:3000/items");
      const data = await response.json();
      setItems(data);
      setFilteredItems(data);
    };
    fetchItems();
  }, [],[refreshData]);

  const handleBrandSelection = (brand) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  const handleCategorySelection = (category) => {
    setSelectedCategory(category);
  };

  const handleGenderSelection = (gender) => {
    if (selectedGender.includes(gender)) {
      setSelectedGender(selectedGender.filter((g) => g !== gender));
    } else {
      setSelectedGender([...selectedGender, gender]);
    }
  };

  useEffect(() => {
    const filtered = items.filter((item) => {
      const lowerCaseBrand = item.brand.toLowerCase();
      const lowerCaseCategory = selectedBrands.map((c) => c.toLowerCase());

      const isBrandMatch =
        selectedBrands.length === 0 || lowerCaseCategory.includes(lowerCaseBrand);
      const isGenderMatch =
        selectedGender.length === 0 || selectedGender.includes(item.gender);
      const isCategoryMatch =
        selectedCategory === "" || selectedCategory === item.category.toLowerCase();

      return isBrandMatch && isGenderMatch && isCategoryMatch;
    });

    setFilteredItems(filtered);
  }, [selectedBrands, selectedGender, selectedCategory, items]);

  useEffect(() => {
    if (showRecommended && user) {
      const filtered = items.filter((item) => {
        const lowerCaseColors = user.favoriteColors.map((c) => c.toLowerCase());
        const lowerCaseBrands = user.favoriteBrands.map((b) => b.toLowerCase());
        const lowerCaseUserGender = user.gender.toLowerCase();

        const isColorMatch = lowerCaseColors.includes(item.color.toLowerCase());
        const isBrandMatch = lowerCaseBrands.includes(item.brand.toLowerCase());
        const isGenderMatch = item.gender.toLowerCase() === lowerCaseUserGender;

        return (isColorMatch || isBrandMatch) && isGenderMatch;
      });

      setFilteredItems(filtered);
    } else {
      setFilteredItems(items)
    }
  }, [showRecommended, recommendedChanged, user, items]);

  useEffect(() => {
    if (!showRecommended) {
      setFilteredItems(items);
    }
  }, [showRecommended]);

  const handleLogout = () => {
    updateUser(null);
  };

  const handleRecommendedClick = () => {
    if (user) {

      setShowRecommended(!showRecommended)
    } else {
      navigate("/login");
    }
  };

  return (
    <RefreshContext.Provider value={setRefreshData}>
    <div className="main">
      <header className="header">
        <Navbar handleBrandSelection={handleBrandSelection} />
        <Subbar handleGenderSelection={handleGenderSelection} handleCategorySelection={handleCategorySelection} showRecommended={showRecommended} setShowRecommended={handleRecommendedClick} user={user} navigate={navigate} />
        <div className="user-info">
          {user ? (
            <>
              <span>Hi {user.first_name}! |</span>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </header>
      <div className="items-container">
        {filteredItems.map((item) => (
          <div className="item" key={item.id}>
            <div className="item-details">
              <h2>{item.name}</h2>
              <h4>By {item.brand}</h4>
            </div>
            <div className="item-image">
            {item.image.startsWith('http') ? (
                <img src={item.image} alt={item.name} />
              ) : (
                <img src={`http://localhost:3000/images/${item.image}`} alt={item.name} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
    </RefreshContext.Provider>
  );
}

export default Main;