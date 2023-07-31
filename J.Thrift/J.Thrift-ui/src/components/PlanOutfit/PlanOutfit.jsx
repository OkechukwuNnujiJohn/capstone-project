import React, { useEffect, useState } from "react";
import axios from 'axios';

function PlanOutfit() {
    const [garments, setGarments] = useState([]);
    const [specificGarment, setSpecificGarment] = useState(null);
    const [models, setModels] = useState([])
    const [shoePaths, setShoePaths] = useState({});
    const [facePaths, setFacePaths] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:3000/fetchProcessedGarments")
            .then((response) => {
                if (response.data && response.data.garments) {
                    setGarments(response.data.garments);
                } else {
                    console.error("Error fetching processed garments.");
                }
            })
            .catch((error) => {
                console.error("Error fetching processed garments:", error);
            });
        // Fetch the list of models when the component mounts
        axios.get("http://localhost:3000/getModels")
            .then((response) => {
                if (response.data && response.data.success) {
                    setModels(response.data.models);
                } else {
                    console.error("Error fetching models.");
                }
            })
            .catch((error) => {
                console.error("Error fetching models:", error);
            });

        // Fetch the selected shoes when the component mounts
        axios.get(`http://localhost:3000/getSelectedShoes`)
            .then((response) => {
                if (response.data && response.data.success) {
                    // Store the shoe image paths in state
                    setShoePaths(response.data.shoe_paths_dict);
                } else {
                    console.error("Error fetching selected shoes.");
                }
            })
            .catch((error) => {
                console.error("Error fetching selected shoes:", error);
            });

        // Fetch the selected faces when the component mounts
        axios.get(`http://localhost:3000/getSelectedFaces`)
            .then((response) => {
                if (response.data && response.data.success) {
                    // Store the face image paths in state
                    setFacePaths(response.data.face_ids);
                } else {
                    console.error("Error fetching selected faces.");
                }
            })
            .catch((error) => {
                console.error("Error fetching selected faces:", error);
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

    // Function to request a new try-on image
    const handleRequestTryOn = () => {
        axios.post("http://localhost:3000/requestTryOn")
            .then((response) => {
                if (response.data) {
                    const modelFile = response.data.model_metadata.model_file;
                    console.log("Model File:", modelFile);
                } else {
                    console.error("Error requesting try-on.");
                }
            })
            .catch((error) => {
                console.error("Error requesting try-on:", error);
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
                    {garment.tryon && (
                        <div>Category: {garment.tryon.category}</div>
                    )}
                    {garment.image_urls && garment.image_urls.product_image && (
                        <img src={garment.image_urls.product_image} alt={`Garment ${garment.id}`} />
                    )}
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
            <button onClick={handleRequestTryOn}>Request Try-on</button>

        </div>
    );
}

export default PlanOutfit;