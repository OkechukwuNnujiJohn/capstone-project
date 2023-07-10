import "./Main.css"
import { useState, useEffect, useContext} from "react";
import { UserContext } from "../../UserContext.js";
import { Link } from "react-router-dom";
import Navbar from "../Navbar/Navbar"

function Main() {
    const { user, updateUser } = useContext(UserContext);
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    // const linkElement = document.createElement("a");
    

    // const navigate = useNavigate();
    // const [form, setForm] = useState({
    //   title: '',
    //   content: '',
    //   credentials: 'include'
    // });
  
    useEffect(() => {
      const fetchItems = async () => {
        const response = await fetch('http://localhost:3000/items');
        const data = await response.json();
        setItems(data);
        setFilteredItems(data);
      };
      fetchItems();
    }, []);
  
    // const handleChange = (event) => {
    //   setForm({
    //     ...form,
    //     [event.target.name]: event.target.value,
    //   });
    // };
  
    // const handleSubmit = async (event) => {
    //   event.preventDefault();
    //   const response = await fetch('http://localhost:3000/items', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(form),
    //     credentials: 'include'
    //   });
    //   const newPost = await response.json();
    //   setPosts([newPost, ...posts]);
    // };

    const handleCategorySelection = (category) => {
        if (selectedCategories.includes(category)) {
          setSelectedCategories(selectedCategories.filter((c) => c !== category));
        } else {
          setSelectedCategories([...selectedCategories, category]);
        }
    
        const filtered = items.filter(
          (item) =>
            selectedCategories.length === 0 || selectedCategories.includes(item.brand)
        );
        setFilteredItems(filtered);
      };

    const handleLogout = () => {
      // Perform logout logic here
      // Example: Clear user data from localStorage, reset user state, etc.
      updateUser(null);
    };
  
    return (
      <div className="main">
      <header className="header">
        <Navbar handleCategorySelection={handleCategorySelection} />
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
        {/* <form className="new-post-form" onSubmit={handleSubmit}>
            <input
                type="text"
                name="title"
                placeholder="Title"
                value={form.title}
                onChange={handleChange}
            />
            <textarea
                name="content"
                placeholder="Content"
                value={form.content}
                onChange={handleChange}
            />
            <button type="submit">Submit</button>
        </form> */}
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