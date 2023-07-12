import "./Main.css"
import { useState, useEffect, useContext} from "react";
import { UserContext } from "../../UserContext.js";
import { Link } from "react-router-dom";
import Navbar from "../Navbar/Navbar"
import Subbar from "../Subbar/Subbar"

function Main() {
    const { user, updateUser } = useContext(UserContext);
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedGender, setSelectedGender] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    
  
    useEffect(() => {
      const fetchItems = async () => {
        const response = await fetch('http://localhost:3000/items');
        const data = await response.json();
        setItems(data);
        setFilteredItems(data);
      };
      fetchItems();
    }, []);
  

    const handleBrandSelection = (brand) => {
        if (selectedBrands.includes(brand)) {
          setSelectedBrands(selectedBrands.filter((b) => b !== brand));
        } else {
          setSelectedBrands([...selectedBrands, brand]);
        }
        console.log("Sec",selectedBrands);
        console.log("set selected", setSelectedBrands)
    };
    const handleCategorySelection = (category) => {
        if (selectedCategory === category) {
          setSelectedCategory("");
        } else {
          setSelectedCategory(category);
        }
        console.log("Sec",selectedCategory);
        console.log("set selected", setSelectedCategory)
    };
    const handleGenderSelection = (gender) => {
        if (selectedGender.includes(gender)) {
          setSelectedGender(selectedGender.filter((g) => g !== gender));
        } else {
          setSelectedGender([...selectedGender, gender]);
        }
        console.log("Sec",selectedGender);
        console.log("set selected", setSelectedGender)
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
            selectedCategory === "" || selectedCategory === item.category.toLowerCase(); // Added check for selected category
    
      
          return isBrandMatch && isGenderMatch && isCategoryMatch;
        });
      
        setFilteredItems(filtered);
      }, [selectedBrands, selectedGender, selectedCategory, items]);
      
      

    const handleLogout = () => {
      updateUser(null);
    };
  
    return (
      <div className="main">
      <header className="header">
        <Navbar handleBrandSelection={handleBrandSelection} />
        <Subbar handleGenderSelection = {handleGenderSelection} handleCategorySelection={handleCategorySelection} />
        <div className="user-info">
          {user ? (
            <>
              <span>Hi {user.user_name}! |</span>
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
              <img src={item.image} alt={item.name} />
            </div>
          </div>
        ))}
            </div>

      </div>
    )
}

export default Main;
