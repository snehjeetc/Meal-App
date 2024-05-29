/**
 * File which contains all the functions to handle addition, 
 * retrieval and removal of favorite meals selected by the user. 
 * Uses local cache by the browser. 
 */

function getFavMeals(){ 
    let strFavMeals = window.localStorage.getItem("favMeals");
    return JSON.parse(strFavMeals); 
}

function addFavMeals(id, name){ 
    let favMeals = getFavMeals(); 
    if(!favMeals)
        favMeals = []; 
    favMeals.push({id : id, name : name}); 
    window.localStorage.setItem("favMeals", JSON.stringify(favMeals)); 
}

function isFavMeal(id){ 
    let favMeals = getFavMeals(); 
    if(!favMeals)
        return false; 
    return favMeals.findIndex(obj => obj.id == id) != -1; 
}

function removeMeal(id){ 
    let favMeals = getFavMeals(); 
    if(!favMeals || !isFavMeal(id))
        return false; 
    favMeals.splice(favMeals.findIndex(obj => obj.id == id), 1); 
    window.localStorage.setItem("favMeals", JSON.stringify(favMeals));
    return true;  
}

export {
    getFavMeals, 
    addFavMeals,
    isFavMeal, 
    removeMeal
} 