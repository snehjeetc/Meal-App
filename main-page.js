/**
 * Initializer script for index.html or find-page
 */

import * as commons from "./common/js/common.js";
import carouselConfiguration from "./common/js/carousal.js";
import modalLoader from "./common/js/modal-loader.js";


const FETCH_ALL_CATEGORY_URL = `https://www.themealdb.com/api/json/v1/1/categories.php`; 
const FETCH_MEAL_BY_CATEGORY_URL = `https://www.themealdb.com/api/json/v1/1/filter.php?c=`; 

//default auto suggestion configuration, which gives a link to call an external api 
//to fill the backing data structure used by the auto-suggestion module 
let autoInputInitializer = commons.defaultAutoSuggestionMLoader('./meal/meal.html'); 
autoInputInitializer(); 

//modal element loader from the common js files
modalLoader("inputBarDiv", commons.handlerForClosingModal); 

//function to initialize main-page
(function () {
    let contentElement = document.querySelector("div.content");
    let filterBtnDiv = document.getElementById("fltr-btn-div");
    let fltrBtn = document.getElementById("fltr-btn");
    document.getElementById("app-icon-container").addEventListener("click", () => { 
        location.reload(); 
    });
    document.getElementById("fav-meals").addEventListener("click", () => { 
        window.location.href = `./favmeals/fav-meal.html`; 
    }); 
    fltrBtn.addEventListener("click", async () => {
        filterBtnDiv.classList.toggle("hidden");
        commons.removeAllChild(contentElement);
        commons.awaitLoading(populateCategories); 
    }); 

    //carousels are used for displyaing both categories and meals

    // displays all the avialable categories in the meal-app
    async function populateCategories() {
        let fetchResult = await commons.fetchURL(FETCH_ALL_CATEGORY_URL); 
        // await awaitLoading()
        
        function streamGenerator(){ 
            if (!fetchResult || !fetchResult.categories)
                return; 
            return fetchResult.categories; 
        }

        //Element will be of tyep E of generated by streamGenerator of Stream<E> 
        function elementGenerator(fromObj){
            let { strCategory: categoryName, strCategoryThumb: thumbNail } = fromObj;
            let categoryDiv = document.createElement("div");
            let spanElement = document.createElement("span");
            let btnElement = document.createElement("button");
            let imgBody = document.createElement("div"); 
            imgBody.classList.add("img-body"); 
            imgBody.style.backgroundImage = `url(${thumbNail})`;
            spanElement.innerText = categoryName;
            spanElement.classList.add("card-title"); 
            btnElement.textContent = "Peek";
            btnElement.classList.add("action-btn", "invisible");
            categoryDiv.append(spanElement, imgBody, btnElement);
            categoryDiv.classList.add("card-element", "center");
            categoryDiv.addEventListener("mouseover", () => {
                btnElement.classList.remove("invisible");
            });
            categoryDiv.addEventListener("mouseleave", () => {
                btnElement.classList.add("invisible");
            });
            btnElement.addEventListener("click", async function () {
                filterBtnDiv.classList.toggle("hidden");
                commons.awaitLoading(populateMealByCategory, categoryName);
            });
            return categoryDiv;
        }
        let leftButton = document.getElementById("prev-btn");
        let rightButton = document.getElementById("next-btn");
        //carousel configuration object
        let carousalConfigElement =  {
            contentElement : contentElement, 
            leftButton : leftButton, 
            rightButton : rightButton,
            streamGenerator : streamGenerator, 
            elementGenerator : elementGenerator
        }
        let fillCarousel = carouselConfiguration(carousalConfigElement); 
        //will return a Promise<Void> here all the elements in the carousels
        //are filled 
        return fillCarousel(); 
    }

    //Displays all meals after applying the category filter 
    async function populateMealByCategory(category) {
        let resp = await commons.fetchURL(FETCH_MEAL_BY_CATEGORY_URL + `${category}`); 
        if (!resp.meals || resp.meals.length == 0)
            throw new Error("No meals found in this category"); 
        
        function streamGenerator() { 
            return resp.meals; 
        }
        function elementGenerator(fromObj) { 
            let { strMeal: mealName, idMeal: mealId, strMealThumb: thumbnail } = fromObj;
            let mealDiv = document.createElement("div");
            let spanElement = document.createElement("span");
            let btnElement = document.createElement("button");
            let iconElement = document.createElement("span");
            iconElement.classList.add("icon-tag"); 
            let imgBody = document.createElement("div"); 
            imgBody.classList.add("img-body"); 
            imgBody.style.backgroundImage = `url(${thumbnail})`;
            spanElement.classList.add("card-title"); 
            spanElement.innerText = mealName;
            btnElement.classList.add("action-btn"); 
            btnElement.textContent = "Check Recipe";
            btnElement.classList.add("invisible");
            iconElement.classList.add("invisible");
            // iconElement.innerHTML = commons.heartIconUnfilled;
            commons.addFavIconToElement(iconElement, mealId, mealName); 
            imgBody.append(iconElement); 
            mealDiv.append(spanElement, imgBody, btnElement);
            mealDiv.classList.add("card-element", "center");
            mealDiv.id = mealId;
            mealDiv.addEventListener("mouseover", () => {
                btnElement.classList.remove("invisible");
                iconElement.classList.remove("invisible");
            });
            mealDiv.addEventListener("mouseleave", () => {
                btnElement.classList.add("invisible");
                iconElement.classList.add("invisible");
            });
            btnElement.addEventListener("click", function () {
                window.location.href = `./meal/meal.html?id=${this.parentNode.id}`; 
            });
            return mealDiv; 
        }
        let leftButton = document.getElementById("prev-btn");
        let rightButton = document.getElementById("next-btn");
        let carousalConfigElement =  {
            contentElement : contentElement, 
            leftButton : leftButton, 
            rightButton : rightButton,
            streamGenerator : streamGenerator, 
            elementGenerator : elementGenerator
        }
        let fillCarousel = carouselConfiguration(carousalConfigElement); 
        return fillCarousel(); 
    }
    //will wait on loading the page to fetch data from 
    //external api, which is processed and displayed after 
    //adding behaviors to the individual elements. 
    commons.awaitLoading(populateCategories); 
})();
