import React from "react";
import { UserContext, RecommendedContext,ItemsContext} from "../../../UserContext.js";
import { useState, useEffect, useContext, createContext} from "react";
import { object } from "prop-types";
import "./RecommendationPage.css";

function RecommendationPage({ recommended,items}) {
    const { recommendedcontext, setRecommendedContext } = useContext(RecommendedContext);
    const { itemscontext, setItemsContext } = useContext(ItemsContext);
    const {user} = useContext(UserContext);
    const [sortedItems, setSortedItems] = useState({});
    console.log("user:",user);
    console.log("recRec:",recommendedcontext);
    console.log("items:",itemscontext);
    useEffect(() => {
        function createSortedItems(){
        const temporarySortedItems = { ...sortedItems};
        itemscontext.forEach((item)=>{
            const colors= item.color;
            const brands = item.brand;
            const keyExists = colors in recommendedcontext.color;
            console.log(keyExists);
            if (keyExists){
                let score = recommendedcontext.color[colors];
                score*=10;
                console.log(score)
                temporarySortedItems[item.id] = score;
                if(colors in user.favoriteColors){
                    score += 20
                    temporarySortedItems[item.id] = score;
                }
            }else{
                
                if(colors in user.favoriteColors){
                    score = 20
                    temporarySortedItems[item.id]=score;
                }
                else{
                    temporarySortedItems[item.id]=0;
                }
            }

            const keyExistsInBrand = brands in recommendedcontext.brand;
            if(keyExistsInBrand){
                let score = recommendedcontext.brand[brands];
                score*=10;
                 temporarySortedItems[item.id] += score;
            }
            console.log(temporarySortedItems);
            const sorr = Object.entries(temporarySortedItems).sort(([,scoreA], [, scoreB]) => (scoreB-scoreA));
            setSortedItems(sorr);
        });
        }
        createSortedItems();

    }, []);
    
    // console.log(sorr);
    console.log("sortedItems", sortedItems);
    console.log("new iTEMScontext", itemscontext)

  return (
    <div className="recommendedPage">

    <div className="item-grid">
      <h1>Recommended Items</h1>
      {/* <p>{console.log(sortedItems[1][0])}</p> */}
    
        {Object.entries(sortedItems).map(([key, value]) => {
            
                if(key>=1){const product = itemscontext.find((obj) =>{
                    if(obj.id.toString() === value[0]){
                        return obj;
                        
                    }

                });
                console.log(product);
                return(

                    <div key={key} className="item-card">
                        <div className="item-details">
                            <h2>{product.name}</h2>
                            <h4>By {product.brand}</h4>
                        </div>
                        <div className="item-image">
                            {product.image.startsWith('http') ? (
                                <img src={product.image} alt={product.name} />
                            ) : (
                                <img src={`http://localhost:3000/images/${product.image}`} alt={product.name} />
                            )}
                        </div>
                        <div className="item-card-grid">
                {/* Add additional information here */}
              </div>

                    </div>
                    
                    
                );
            }
            
            

        }
          
        )};
      
      
                    </div>
    </div>
  );
}

export default RecommendationPage;
