import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../UserContext";

export default function MyUploadsPage() {
  const { user } = useContext(UserContext);
  const [myUploads, setMyUploads] = useState([]);

  useEffect(() => {
    const fetchMyUploads = async () => {
      try {
        const url = user ? "http://localhost:3000/items?userId=${user.id}" : `http://localhost:3000/items`;
        const response = await fetch(url, {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error('Error fetching my uploads: ' + response.statusText);
        }
        const data = await response.json();
        setMyUploads(data);
      } catch (error) {
        console.error('Error fetching my uploads:', error);
      }
    };
    fetchMyUploads();
  }, [user]);

  return (
    <div>
      <h1>My Uploads</h1>
      {myUploads.length > 0 ? (
        myUploads.map((item) => (
          <div key={item.id}>
            <h2>{item.name}</h2>
            <h3>Brand: {item.brand}</h3>
            <img src={item.image} alt={item.name} />
            <p>Price: {item.price}</p>
            <p>Description: {item.description}</p>
          </div>
        ))
      ) : (
        <p>No items uploaded.</p>
      )}
    </div>
  );
}
