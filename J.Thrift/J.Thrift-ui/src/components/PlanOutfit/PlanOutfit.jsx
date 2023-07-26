import React, { useEffect, useState } from "react";
import axios from 'axios';


function PlanOutfit() {
    const [garments, setGarments] = useState([]);
    const [specificGarment, setSpecificGarment] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:3000/fetchProcessedGarments")
            .then((response) => {
                if (response.data) {
                    setGarments(response.data);
                } else {
                    console.error("Error fetching processed garments.");
                }
            })
            .catch((error) => {
                console.error("Error fetching processed garments:", error);
            });
    }, []);

    const handleFetchSpecificGarment = (garment_id) => {
        axios.get(`http://localhost:3000/fetchProcessedGarments/${garment_id}`)
            .then((response) => {
                if (response.data) {
                    console.log("Specific garment fetched successfully:", response.data);
                    setSpecificGarment(response.data);
                } else {
                    console.error("Error fetching specific garment.");
                    setSpecificGarment(null);
                }
            })
            .catch((error) => {
                console.error("Error fetching specific garment:", error);
                setSpecificGarment(null);
            });
    };

    // Function to upload a new garment
    const handleUploadGarment = () => {
        axios.post("http://localhost:3000/uploadGarment")
            .then((response) => {
                if (response.data) {
                    console.log("Garment uploaded successfully:", response.data.garment_id);
                } else {
                    console.error("Error uploading garment.");
                }
            })
            .catch((error) => {
                console.error("Error uploading garment:", error);
            });
    };

    return (
        <div>
            {garments.map((garment) => (
                <div key={garment.id}>
                    <div>Gender: {garment.gender}</div>
                    <div>Category: {garment.tryon.category}</div>
                    <button onClick={() => handleFetchSpecificGarment(garment.id)}>View Details</button>
                </div>
            ))}

            <button onClick={handleUploadGarment}>Upload Garment</button>

            {specificGarment && (
                <div>
                    <h2>Specific Garment Details</h2>
                    <div>Garment ID: {specificGarment.id}</div>
                </div>
            )}
        </div>
    );
}

export default PlanOutfit;