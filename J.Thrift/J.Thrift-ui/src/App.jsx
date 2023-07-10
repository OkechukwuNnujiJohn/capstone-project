import { useState, useEffect } from 'react';
import './App.css';
import { UserContext } from './UserContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './components/Main/Main'
import LoginForm from './components/LoginForm/LoginForm';
import SignupForm from './components/SignupForm/SignupForm';

function App() {

  const [user, setUser] = useState(() => {
    // Retrieve the user data from storage or set it to null if not found
    const storedUser = localStorage.getItem('User');
    // console.log("user",user);
    // console.log("stored user",storedUser);
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const updateUser = (newUser) => {
    setUser(newUser);
  };

  useEffect(() => {
    // Save the user data to storage whenever the user state changes
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  return (
    <div className="app">
      <UserContext.Provider value={{ user, updateUser }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={ <Main /> } />
            {/* <Route path="/" element={user ? <Main /> : <LoginForm />} /> */}
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
    </div>
  );

  // const [items, setItems] = useState([]);
  // const [form, setForm] = useState({
  //   title: '',
  //   content: '',
  //   userId: '',
  // });

  // useEffect(() => {
  //   const fetchItems = async () => {
  //     const response = await fetch('http://localhost:3000/items');
  //     const data = await response.json();
  //     setItems(data);
  //   };
  //   fetchItems();
  // }, []);

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
  //   });
  //   const newItems = await response.json();
  //   setItems([newItems, ...items]);
  // };

  // return (
  //   <div className="app">
  //     <form className="new-post-form" onSubmit={handleSubmit}>
  //       <input
  //         type="text"
  //         name="title"
  //         placeholder="Title"
  //         value={form.title}
  //         onChange={handleChange}
  //       />
  //       <textarea
  //         name="content"
  //         placeholder="Content"
  //         value={form.content}
  //         onChange={handleChange}
  //       />
  //       <input
  //         type="text"
  //         name="userId"
  //         placeholder="User Id"
  //         value={form.userId}
  //         onChange={handleChange}
  //       />
  //       <button type="submit">Submit</button>
  //     </form>
      {/* <div className="posts-container">
        {items.map((item) => (
          <div className="post" key={item.id}>
            <h2>{item.title}</h2>
            <h4>By {post.user.username} at {new Date(post.createdAt).toLocaleString()}</h4>
            <p>{post.content}</p>
          </div>
        ))}
      </div> */}
  //   </div>
  // );
}

export default App;