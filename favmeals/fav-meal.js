/**
 * Initializer file to display the favorite meals chosen by the user 
 * The favorite meals are stored in the users cache 
 */

import * as store from "../common/js/store-meal.js";
import * as commons from "../common/js/common.js";
import initAutoComplete from "../common/js/auto-complete-feature.js";
import modalLoader from "../common/js/modal-loader.js";
const REMOVE_ICON = `<i class="fa-solid fa-circle-minus"></i>`;


//auto sugesstion module initializer 
//The suggestions are given only based on the favorite meals 
//added by the user. 
(function () {
    let filterBy = function (enteredVal, meal) {
        return meal.name.toLowerCase().startsWith(enteredVal.toLowerCase());
    }

    function removeFromFavList(divElm, id) {
        divElm.parentElement.remove(divElm);
        store.removeMeal(id);
        displayFavMeals();
    }

    function generateSuggestion(enteredVal, meal) {
        let suggestionDiv = document.createElement("div");
        let nameElement = document.createElement("span");
        nameElement.classList.add("meal-name");
        let likeIcon = document.createElement("span");
        likeIcon.classList.add("like-icon");
        nameElement.innerHTML = `<strong>${meal.name.substring(0, enteredVal.length)}</strong>${meal.name.substring(enteredVal.length)}`;
        nameElement.addEventListener("click", (e) => {
            e.stopPropagation();
            window.location.href = `../meal/meal.html?id=${meal.id}`;
        });
        likeIcon.innerHTML = REMOVE_ICON;
        likeIcon.addEventListener("click", function (e) {
            removeFromFavList(suggestionDiv, meal.id);
        });
        suggestionDiv.append(nameElement, likeIcon);
        //will add event listener later 
        suggestionDiv.id = meal.id;
        return suggestionDiv;
    }

    function fetchSuggestions(enteredVal) {
        // console.log(store.getFavMeals());
        return store.getFavMeals()
                    .filter(meal => meal.name.toLowerCase().startsWith(enteredVal.toLowerCase()))
                    .sort(function (a, b) { return a.name.toLowerCase().localeCompare(b.name.toLowerCase())});
    }

    let autoCompleteInput = {
        searchElement: document.getElementById("inputBarModal"),
        suggestionElement: document.getElementById("meal-suggestions"),
        fetchSuggestions: fetchSuggestions,
        filterBy: filterBy,
        generateSuggestion: generateSuggestion,
        mealPageUrl: '../meal/meal.html'
    };

    initAutoComplete(autoCompleteInput);
})();

//modal loader 
modalLoader("inputBarDiv", commons.handlerForClosingModal);

//function to initialize the page
(function () {
    document.getElementById("app-icon-container").addEventListener("click", () => {
        window.location.href = `../index.html`;
    });
    displayFavMeals();
})();

//displays the favorite meals after reading it from the cache
function displayFavMeals() {
    let favMealsCont = document.querySelector("div.fav-meals-cont");
    let favMeals = store.getFavMeals();
    commons.removeAllChild(favMealsCont);
    if (!favMeals)
        return;
    for (let meal of favMeals) {
        let row = document.createElement("div");
        row.classList.add("row-content");
        let c1 = document.createElement("span");
        let c2 = document.createElement("span");
        c1.classList.add("c1");
        c2.classList.add("c2");
        c1.textContent = meal.name;
        c2.innerHTML = REMOVE_ICON;
        c2.addEventListener("click", () => {
            store.removeMeal(meal.id);
            commons.notify("Removed from fav list");
            displayFavMeals();
        });
        row.append(c1, c2);
        c1.addEventListener("click", () => {
            window.location.href = `../meal/meal.html?id=${meal.id}`;
        });
        favMealsCont.append(row);
    }
}


