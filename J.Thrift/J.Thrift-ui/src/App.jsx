import { useState, useEffect } from 'react';
import './App.css';
import { UserContext, RecommendedContext, ItemsContext } from '../UserContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './components/Main/Main'
import LoginForm from './components/LoginForm/LoginForm';
import SignupForm from './components/SignupForm/SignupForm';
import Uploadpage from './components/Uploadpage/Uploadpage';
import MyUploadsPage from './components/MyUploadsPage/MyUploadsPage';
import RecommendationPage from './components/RecommendationPage/RecommendationPage';
import PlanOutfit from './components/PlanOutfit/PlanOutfit'



function App() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;

  });

  const [recommendedcontext, setRecommendedContext] = useState(() => {
    try {
      // Retrieve the product data from storage or set it to null if not found
      const storedItem = localStorage.getItem("Recommended");
      return storedItem ? JSON.parse(storedItem) : null;
    } catch (error) {
      console.error("Error parsing stored item:", error);
      return null;
    }
  });

  const [itemscontext, setItemsContext] = useState(() => {
    try {
      // Retrieve the product data from storage or set it to null if not found
      const storedItem = localStorage.getItem("items");
      return storedItem ? JSON.parse(storedItem) : null;
    } catch (error) {
      console.error("Error parsing stored item:", error);
      return null;
    }
  });

  const updateUser = (newUser) => {
    setUser(newUser);
  };

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return (
    <div className="app">
      <UserContext.Provider value={{ user, updateUser }}>
        <RecommendedContext.Provider value={{ recommendedcontext, setRecommendedContext }}>
          <ItemsContext.Provider value={{ itemscontext, setItemsContext }}>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/signup" element={<SignupForm />} />
                <Route path="/uploadpage" element={<Uploadpage />} />
                <Route path="/myuploads" element={<MyUploadsPage />} />
                <Route
                  path="/recommendations"
                  element={<RecommendationPage />}
                />
                <Route
                  path="/plananoutfit"
                  element={<PlanOutfit />}
                />
              </Routes>
            </BrowserRouter>
          </ItemsContext.Provider>
        </RecommendedContext.Provider>
      </UserContext.Provider>
    </div>
  );
}

export default App;