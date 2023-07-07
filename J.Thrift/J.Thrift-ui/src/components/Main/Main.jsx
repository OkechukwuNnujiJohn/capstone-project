import "./Main.css"
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../UserContext.js";
import { Link } from "react-router-dom";

function Main() {
    const { user, updateUser } = useContext(UserContext);
    const [items, setItems] = useState([]);
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

    const handleLogout = () => {
      // Perform logout logic here
      // Example: Clear user data from localStorage, reset user state, etc.
      updateUser(null);
    };
  
    return (
      <div className="main">
      <header className="header">
        <div className="user-info">
          {user ? (
            <>
              <span>Hi {user.username}! |</span>
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
          {items.map((item) => (
          <div className="post" key={item.id}>
              <h2>{item.name}</h2>
              <h4>By {item.brand} at {new Date(item.createdAt).toLocaleString()}</h4>
              <p>{item.description}</p>
          </div>
          ))}
        </div>
      </div>
    )
}

export default Main;