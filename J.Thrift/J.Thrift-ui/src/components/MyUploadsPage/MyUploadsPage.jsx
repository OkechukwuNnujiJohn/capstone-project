import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../UserContext";

export default function MyUploadsPage() {
  const { user } = useContext(UserContext);
  const [myUploads, setMyUploads] = useState([]);

  useEffect(() => {
    const fetchMyUploads = async () => {
      try {
        console.log("user: ", user);
        console.log("user.itemsUploaded: ", user?.itemsUploaded);
        const url = "http://localhost:3000/items";
        const response = await fetch(url, {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error('Error fetching my uploads: ' + response.statusText);
        }
        const data = await response.json();
        console.log("data: ", data);

          const filteredData = data.filter((item) =>user?.itemsUploaded?.includes(item.id));
          console.log("filteredData: ", filteredData);
          setMyUploads(filteredData);
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
            {item.image.startsWith('http') ? (
                  <img src={item.image} alt={item.name} />
                ) : (
                  <img src={`http://localhost:3000/images/${item.image}`} alt={item.name} />
                )}
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
