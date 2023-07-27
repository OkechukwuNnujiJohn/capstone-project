import "./Main.css";
import React from 'react'
import { useState, useEffect, useContext, createContext } from "react";
import { UserContext, RecommendedContext, ItemsContext } from "../../../UserContext.js";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Subbar from "../Subbar/Subbar";
import RecommendationPage from "../RecommendationPage/RecommendationPage";

export const RefreshContext = createContext();

function Main() {
  const { user, updateUser } = useContext(UserContext);
  const { recommendedcontext, setRecommendedContext } = useContext(RecommendedContext);
  const { itemscontext, setItemsContext } = useContext(ItemsContext);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedGender, setSelectedGender] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showRecommended, setShowRecommended] = useState(false);
  const [showPlanPage, setShowPlanPage] = useState(false);
  const [recommendedChanged, setRecommendedChanged] = useState(false); // New state variable
  const navigate = useNavigate();
  const [refreshData, setRefreshData] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [recommended, setRecommended] = useState(() => {
    const a = {
      color: {},
      brand: {}
    }
    return a;
  })

  // Step 1: Initialize the color and brand trend score objects
  const [colorTrendScores, setColorTrendScores] = useState({});
  const [brandTrendScores, setBrandTrendScores] = useState({});
  console.log("user", user)

  useEffect(() => {
    const fetchItems = async () => {
      const response = await fetch("http://localhost:3000/items");
      const data = await response.json();
      setItems(data);
      setItemsContext(data)
      localStorage.setItem("items", JSON.stringify(data));
      setFilteredItems(data);
    };
    fetchItems();
  }, [refreshData]);

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
      const fetchRecommendations = async () => {
        const response = await fetch("http://localhost:3000/recommendations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
          credentials: 'include'
        });
        const data = await response.json();
        setRecommendations(data);
        console.log("Recommendations:", data);
      };

      fetchRecommendations();
    } else {
      setRecommendations([]);
    }
  }, [showRecommended, user]);

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
      setShowRecommended(!showRecommended);
      navigate("/recommendations"); // Navigate to the recommendations page
    } else {
      navigate("/login"); // Navigate to the login page if the user is not logged in
    }
  };

  const handlePlanClick = () => {
    if (user) {
      setShowPlanPage(!showPlanPage);
      navigate("/plananoutift"); 
    } else {
      navigate("/login");
    }
  };

  const handleProductClick = (product) => {
    // Access the product data such as color and brand here
    const colors = recommended.color;
    const brands = recommended.brand;
    const keyExistsColor = product.color in colors;
    const temporaryRecommended = { ...recommended };
    console.log("tempRecom:", temporaryRecommended);


    if (keyExistsColor === true) {
      const temp = { ...colors };
      temp[product.color] += 1;
      temporaryRecommended.color = temp;
    } else {
      const temporary = { ...colors, [product.color]: 1 };
      temporaryRecommended.color = temporary;

    }

    const keyExistsBrand = product.brand in brands;
    if (keyExistsBrand === true) {
      const temp2 = { ...brands };
      temp2[product.brand] += 1;
      temporaryRecommended.brand = temp2;
    } else {
      const temporary2 = { ...brands, [product.brand]: 1 };
      temporaryRecommended.brand = temporary2;

    }
    setRecommended(temporaryRecommended);
    setRecommendedContext(temporaryRecommended);
    localStorage.setItem("Recommended", JSON.stringify(temporaryRecommended));
    console.log('Clicked product:', product);
  };

  console.log('recommendedContext', recommendedcontext);

  return (
    <RefreshContext.Provider value={setRefreshData}>
      <div className="main">
        <header className="header">
          <Navbar handleBrandSelection={handleBrandSelection} />
          <Subbar handleGenderSelection={handleGenderSelection} handleCategorySelection={handleCategorySelection} showRecommended={showRecommended} showPlanPage={showPlanPage} setShowRecommended={handleRecommendedClick} setShowPlanPage={handlePlanClick} user={user} navigate={navigate} />
          {showRecommended ? (
            <RecommendationPage recommended={recommended} item={items} />
          ) : (
            <>
            </>
          )}
          {showPlanPage ?(
            <PlanOutfit />
          ):(
            <></>
          )}
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

            <div className="item" key={item.id} onClick={() => handleProductClick(item)} style={{ cursor: "pointer" }}>
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
          {/* 
        </>
  )} */}
        </div>
      </div>
    </RefreshContext.Provider>
  );
}

export default Main;
