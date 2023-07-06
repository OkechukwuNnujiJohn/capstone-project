import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    title: '',
    content: '',
    userId: '',
  });

  useEffect(() => {
    const fetchItems = async () => {
      const response = await fetch('http://localhost:3000/items');
      const data = await response.json();
      setItems(data);
    };
    fetchItems();
  }, []);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch('http://localhost:3000/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const newItems = await response.json();
    setItems([newItems, ...items]);
  };

  return (
    <div className="app">
      <form className="new-post-form" onSubmit={handleSubmit}>
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
        <input
          type="text"
          name="userId"
          placeholder="User Id"
          value={form.userId}
          onChange={handleChange}
        />
        <button type="submit">Submit</button>
      </form>
      {/* <div className="posts-container">
        {items.map((item) => (
          <div className="post" key={item.id}>
            <h2>{item.title}</h2>
            <h4>By {post.user.username} at {new Date(post.createdAt).toLocaleString()}</h4>
            <p>{post.content}</p>
          </div>
        ))}
      </div> */}
    </div>
  );
}

export default App;