import React, { useEffect, useState } from "react";
import axios from 'axios';
import './PlanOutfit.css';

function PlanOutfit() {
    const [garments, setGarments] = useState([]);
    const [specificGarment, setSpecificGarment] = useState(null);
    const [models, setModels] = useState([])
    const [modelFiles, setModelFiles] = useState([]);
    const [shoePaths, setShoePaths] = useState({});
    const [facePaths, setFacePaths] = useState([]);
    const [selectedGender, setSelectedGender] = useState("male");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [scrollPosition, setScrollPosition] = useState(0);
    const [selectedModel, setSelectedModel] = useState(null);
    const [selectedTop, setSelectedTop] = useState('498434c2db635071ca71487eef08a26e_tmn6BpX1bhF9');
    const [selectedBottom, setSelectedBottom] = useState('498434c2db635071ca71487eef08a26e_HK7q2BMxKTHA');
    const [selectedOuterwear, setSelectedOuterwear] = useState('498434c2db635071ca71487eef08a26e_ORCbQYT1t5aL');
    const [selectedModelImage, setSelectedModelImage] = useState("1697455153");

    useEffect(() => {
        fetchGarments(selectedGender, selectedCategory);
        fetchModels(selectedGender);
        fetchSelectedShoes(selectedGender);
        fetchSelectedFaces(selectedGender);
    }, [selectedGender, selectedCategory]);

    const fetchGarments = (gender, category) => {
        setSelectedCategory(category);

        let uniqueUrl = `http://localhost:3000/fetchProcessedGarments?gender=${gender}&category=${selectedCategory}&timestamp=${Date.now()}`;
        axios.get(uniqueUrl)
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
    };

    const fetchModels = (gender) => {
        const uniqueUrl = `http://localhost:3000/getModels?gender=${gender}&timestamp=${Date.now()}`;
        axios.get(uniqueUrl)
            .then((response) => {
                if (response.data && response.data.success) {
                    setModels(response.data.models);
                    setModelFiles(response.data.model_files);
                } else {
                    console.error("Error fetching models.");
                }
            })
            .catch((error) => {
                console.error("Error fetching models:", error);
            });
    }

    const fetchSelectedShoes = (gender) => {
        const uniqueUrl = `http://localhost:3000/getSelectedShoes?gender=${gender}&timestamp=${Date.now()}`;
        axios.get(uniqueUrl)
            .then((response) => {
                if (response.data && response.data.success) {
                    setShoePaths(response.data.shoe_paths_dict);
                } else {
                    console.error("Error fetching selected shoes.");
                }
            })
            .catch((error) => {
                console.error("Error fetching selected shoes:", error);
            });
    }

    const fetchSelectedFaces = (gender) => {
        const uniqueUrl = `http://localhost:3000/getSelectedFaces?gender=${gender}&timestamp=${Date.now()}`;
        axios.get(uniqueUrl)
            .then((response) => {
                if (response.data && response.data.success) {
                    setFacePaths(response.data.face_ids);
                } else {
                    console.error("Error fetching selected faces.");
                }
            })
            .catch((error) => {
                console.error("Error fetching selected faces:", error);
            });

    }

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

    const handleSelectGarment = (garment) => {
        if (garment.tryon && garment.tryon.category === "tops") {
            console.log();
            setSelectedTop(garment.id);
            handleRequestTryOn();
        } else if (garment.tryon && garment.tryon.category === "bottoms") {
            setSelectedBottom(garment.id);
            handleRequestTryOn();
        }
        else if (garment.tryon && garment.tryon.category === "outerwear") {
            setSelectedOuterwear(garment.id);
            handleRequestTryOn();
        }
    };

    const handleRequestTryOn = () => {
        if (!selectedModel) {
            console.error("Please Select a model")
            return;
        }
        const requestData = {
            garments: {
                tops: selectedTop,
                bottoms: selectedBottom,
                outerwear: selectedOuterwear,
            },
            model_id: selectedModel,
            background: "studio",
        };

        axios.post("http://localhost:3000/requestTryOn", requestData)
            .then((response) => {
                if (response.data) {
                    const modelFile = response.data.model_metadata.model_file;
                    console.log("Model File:", modelFile);
                    setSelectedModelImage(`https://media.revery.ai/generated_model_image/${modelFile}.png`);
                } else {
                    console.error("Error requesting try-on.");
                }
            })
            .catch((error) => {
                console.error("Error requesting try-on:", error);
            });
    };

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

    const handleGenderChange = (gender) => {
        setSelectedGender(gender);
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    const handleSelectModel = (modelId, modelImage) => {
        setSelectedModel(modelId);
        setSelectedModelImage(modelImage);
        handleRequestTryOn();
    };

    return (
        <div className="plan-outfit-container">
            <div className="left-div">
                <h2>Plan Your Outfit</h2>
                {selectedModel && (
                    <div className="selected-model">
                        <img src={selectedModelImage} alt={`Model ${selectedModel}`} />
                    </div>
                )}
                <div className="models-container">
                    <div className="models-wrapper" style={{ transform: `translateX(-${scrollPosition}px)` }}>

                        {models.map((modelId, index) => (
                            <div key={modelId} className={`model-card ${selectedModel === modelId ? 'selected' : ''}`} onClick={() => handleSelectModel(modelId, `https://media.revery.ai/generated_model_image/${modelFiles[index]}.png`)}>
                                <img
                                    src={`https://media.revery.ai/generated_model_image/${modelFiles[index]}.png`}
                                    alt={`Model ${modelId}`}
                                />
                                {selectedModel === modelId && <div className="selected-overlay"></div>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="garments-container">
                <div className="buttons-container">
                    <div>
                        <button
                            onClick={() => handleGenderChange("male")}
                            style={{ fontWeight: selectedGender === "male" ? "bold" : "normal" }}
                        >
                            Male
                        </button>
                        <button
                            onClick={() => handleGenderChange("female")}
                            style={{ fontWeight: selectedGender === "female" ? "bold" : "normal" }}
                        >
                            Female
                        </button>
                    </div>

                    <div>
                        <button
                            onClick={() => handleCategoryChange("all")}
                            style={{ fontWeight: selectedCategory === "all" ? "bold" : "normal" }}
                        >
                            All
                        </button>
                        <button
                            onClick={() => handleCategoryChange("tops")}
                            style={{ fontWeight: selectedCategory === "tops" ? "bold" : "normal" }}
                        >
                            Tops
                        </button>
                        <button
                            onClick={() => handleCategoryChange("bottoms")}
                            style={{ fontWeight: selectedCategory === "bottoms" ? "bold" : "normal" }}
                        >
                            Bottoms
                        </button>
                        <button
                            onClick={() => handleCategoryChange("outerwear")}
                            style={{ fontWeight: selectedCategory === "outerwear" ? "bold" : "normal" }}
                        >
                            Outerwear
                        </button>
                        <button
                            onClick={() => handleCategoryChange("shoes")}
                            style={{ fontWeight: selectedCategory === "shoes" ? "bold" : "normal" }}
                        >
                            Shoes
                        </button>
                    </div>

                    <div className="selected-garments">
                        {selectedTop && typeof selectedTop === 'object' && selectedTop.image_urls && selectedTop.image_urls.product_image}
                        {selectedBottom && typeof selectedBottom === 'object' && selectedBottom.image_urls && selectedBottom.image_urls.product_image}
                    </div>
                </div>

                {garments.map((garment) => (
                    <div key={garment.id} className="garment-card" onClick={() => handleSelectGarment(garment)}>
                        <div>Gender: {garment.gender}</div>
                        {garment.tryon && <div>Category: {garment.tryon.category}</div>}
                        {garment.image_urls && garment.image_urls.product_image && (
                            <img src={garment.image_urls.product_image} alt={`Garment ${garment.id}`} />
                        )}
                        <button onClick={() => handleFetchSpecificGarment(garment)}>View Details</button>
                    </div>
                ))}
            </div>

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
