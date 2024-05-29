/**
 * Initializer file for meal.html page
 * requires : either the id of the meal 
 * or the search parameter else the page will not load 
 * displaying a recurrent error. 
 */

import * as commons from "../common/js/common.js"; 
import modalLoader from "../common/js/modal-loader.js";

const MEAL_ID_SEARCH_URL = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=`; 
const MEAL_NAME_SEARCH_URL = `https://www.themealdb.com/api/json/v1/1/search.php?s=`; 

//Initializing auto-suggestion module and invoking the function to 
//load the data used by the auto-suggestion module
let fetchAutoSugestInput = commons.defaultAutoSuggestionMLoader('./meal.html');
fetchAutoSugestInput();  

//modal element loader from the common js files
modalLoader("input-bar-holder", commons.handlerForClosingModal); 

//function to initialize the meal.html page 
//will search for the query parameters and then 
//will make an external api call whose response is processed 
//further to display the data in their relevant formats. 
(function () {
    let queryString = window.location.search; 
    const urlParams = new URLSearchParams(queryString); 
    document.getElementById("fav-meals").addEventListener("click", () => { 
        window.location.href = `../favmeals/fav-meal.html`; 
    }); 
    document.getElementById("app-icon-container").addEventListener("click", () => { 
      window.location.href = `../index.html`;   
    }); 
    let id = urlParams.get("id"); 
    if(id){
        commons.awaitLoading(fetchMealById, id); 
    } else { 
        let name = urlParams.get("name");
        if(!name)
            throw new Error("Query Parameters not found"); 
        commons.awaitLoading(fetchMealByName, name);  
    }
    async function fetchMealById(id){ 
        let mealDetail = await commons.fetchURL(MEAL_ID_SEARCH_URL + `${id}`);
        populateMealDetails(mealDetail); 
    }

    async function fetchMealByName(name){ 
        let mealDetail = await commons.fetchURL(MEAL_NAME_SEARCH_URL + `${name}`); 
        populateMealDetails(mealDetail); 
    }

    function populateMealDetails(mealDetail){ 
        if(!mealDetail)
            throw new Error("Meal not found"); 
        let {idMeal : id, strMeal : name, strMealThumb : thumbNail, ...mealExtrDtl} = mealDetail.meals[0]; 
        const INGREDIENT = 'Ingredient'; 
        const MEASURE = 'Measure'; 
        //as given in api
        //for a ingredient at index i, its measure value will also be at same index
        let ingredients = []; 
        let measures = []; 
        //since mealExtrDtl contains all these information
        //extracting only the ingredients and measures from it 

        Object.keys(mealExtrDtl).forEach(key => { 
            let itemToSearch; 
            let arr; 
            if(key.includes(INGREDIENT)){ 
                itemToSearch = INGREDIENT;
                arr = ingredients;                  
            } else if(key.includes(MEASURE)){
                itemToSearch = MEASURE;
                arr = measures;  
            }
            if(itemToSearch){ 
                // let index = key.substring(key.indexOf(itemToSearch) + itemToSearch.length);
                let afterPrefix = "str"+itemToSearch; 
                let index = key.substring(afterPrefix.length); 
                if(parseInt(index) == Number.NaN)
                    throw new Error("Unable to find index"); 
                if(mealExtrDtl[key] && mealExtrDtl[key].trim())
                    arr[parseInt(index) - 1] = mealExtrDtl[key]; 
            }
        });         
        populateInstructions(mealExtrDtl.strInstructions); 
        // console.log(getSteps(mealExtrDtl.strInstructions)); 

        let mealName = document.querySelector(".meal-name"); 
        let mealImg = document.querySelector(".meal-img"); 
        let ingredientsElm = document.getElementById("ingredients"); 
        let iconElement = document.createElement("span"); 
        iconElement.classList.add("icon"); 

        mealName.textContent = name; 
        mealImg.style.backgroundImage = `url(${thumbNail})`;
        commons.addFavIconToElement(iconElement, id, name); 
        mealImg.append(iconElement); 

        mealImg.addEventListener("mouseover", () => {
            iconElement.classList.remove("invisible");
        });
        mealImg.addEventListener("mouseleave", () => {
            iconElement.classList.add("invisible");
        });

        for(let i = 0; i < ingredients.length ; i++){ 
            let rowElm = document.createElement("div"); 
            rowElm.classList.add("row"); 
            let ingElm = document.createElement("span"); 
            ingElm.classList.add("c1"); 
            let msrElm = document.createElement("span"); 
            msrElm.classList.add("c2"); 

            ingElm.textContent = ingredients[i]; 
            msrElm.textContent = measures[i]; 

            rowElm.append(ingElm, msrElm); 
            ingredientsElm.appendChild(rowElm); 
        }
    }

    /**
     * an async function to display instruction in the page  
     * if the input instructions that is strSteps is of the 
     * form : STEP {NUMBER} {newLines} [Step Description] {newLines} STEP
     * then a tabular format of the steps is displayed 
     * otherwise it is displayed in normal paragraph format. 
     */
    
    
    async function populateInstructions(strSteps){ 
        let steps = getSteps(strSteps); 
        let insturctionElm = document.getElementById("instructions"); 
        if(!steps || steps.length == 0){ 
            let cnt = document.createElement("span");
            cnt.classList.add("step-cnt"); 
            cnt.textContent = strSteps; 
            insturctionElm.append(cnt); 
            return;  
        }
        steps.forEach((step, index) => { 
            let stepDiv = document.createElement("div"); 
            let stepHead = document.createElement("p"); 
            let stepCnt = document.createElement("p"); 
            stepHead.classList.add("step-head"); 
            stepCnt.classList.add("step-cnt"); 
            stepHead.textContent = `STEP ${index + 1} : `; 
            
            stepCnt.textContent = step; 

            if(index == 0)
                stepDiv.classList.add("border-top"); 
            stepDiv.append(stepHead, stepCnt); 
            insturctionElm.append(stepDiv); 
        }); 
    }

    //uses regex to retrieve the steps inside the instruction if matches the 
    //form
    function getSteps(recipe) {   
        let str = `${recipe.trim()}`; 
        let steps = []; 
        const regex = /STEP \d+\r?\n\r?\n([\s\S]*?)(?=STEP \d+|\n*$)/gm;
        let m; 
        while ((m = regex.exec(str)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            // The result can be accessed through the `m`-variable.
            m.forEach((match, groupIndex) => {
                if(groupIndex == 1)
                    steps.push(match); 
            });
        }
        return steps;
    }
})(); 

