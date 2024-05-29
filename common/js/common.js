/**
 * Common functionalities which is used to initialize different pages 
 * are added here to minimize cluttering and repetition. 
 */

import * as store from "./store-meal.js";
import initAutoComplete from "./auto-complete-feature.js";

//fav-icons
const heartIconFilled = `<i class="fa-solid fa-heart"></i>`;
const heartIconUnfilled = `<i class="fa-regular fa-heart"></i>`;

const modalElement = document.querySelector("div.modal");
const FILTER_MEALS_FIRST_LETTER_URL = `https://www.themealdb.com/api/json/v1/1/search.php?f=`;
let loadTimer;
const handlerForClosingModal = function (event) {
    if (event.target != modalElement && !modalElement.contains(event.target)) {
        modalElement.classList.add("hidden");
        document.querySelector("main").classList.remove("blur-bg");
        inputBarDiv.classList.remove("hidden");
    }
};

//The loading element/ progress bar with dots are 
//loaded here using loadingStart, loading, loadingEnd 
//this is used in sequence with the help of timer 
//so that the page freezes unless the necessary invocations are successfull. 
let loading = function () {
    let loadingBar = document.getElementById("loading-bar");
    let dotElm = document.createElement("div");
    dotElm.classList.add("dot", "black");
    let allChild = loadingBar.querySelectorAll(".dot");
    if (allChild.length == 3) {
        removeAllChild(loadingBar);
    }
    if (loadingBar.lastElementChild) {
        loadingBar.lastElementChild.classList.remove("black");
        loadingBar.lastElementChild.classList.add("grey");
    }
    loadingBar.append(dotElm);
};

function loadingStart() {
    document.getElementById("loading-bar").classList.remove("hidden");
    document.removeEventListener("click", handlerForClosingModal);
    document.querySelector("main").classList.add("blur-bg");
}

function loadingEnd() {
    document.getElementById("loading-bar").classList.add("hidden");
    document.addEventListener("click", handlerForClosingModal);
    document.querySelector("main").classList.remove("blur-bg");
}

//similar to loading start fetch(url).then(resp => fn(resp)).finally(loading end); 
async function awaitLoadingFromExternalURL(url, fn) {
    try {
        loadingStart();
        loadTimer = setInterval(loading, 100);
        let resp = await fetchURL(url);
        return fn(resp);
    } catch (err) {
        handleException(err);
    } finally {
        if (loadTimer) {
            clearInterval(loadTimer);
            loadTimer = undefined;
        }
        loadingEnd();
    }
}

async function awaitLoading(fn, ...args) {
    let error;
    try {
        loadingStart();
        loadTimer = setInterval(loading, 100);
        if (args.length == 0)
            await fn();
        else
            await fn(...args);
    } catch (err) {
        error = err;
        // handleException(err);
    } finally {
        if (error) {
            handleException(error);
            // loadingEnd();
        }
        if (loadTimer) {
            clearInterval(loadTimer);
            loadTimer = undefined;
            loadingEnd();
        }
    }
}

async function fetchURL(url) {
    let resp = await fetch(url);
    if (!resp.ok)
        throw new Error("Failed to load");
    return await resp.json();
}

//removes all the child element in the given dom element 
function removeAllChild(element) {
    while (element.lastElementChild)
        element.lastElementChild.remove();
}

function handleException(err) {
    let loadingBar = document.getElementById("loading-bar");
    if (loadTimer) {
        clearInterval(loadTimer);
        loadTimer = undefined;
    }
    removeAllChild(loadingBar);
    let errMsgElm = document.createElement("span");
    errMsgElm.textContent = err.message;
    loadingBar.append(errMsgElm);
    setTimeout(() => {
        location.reload();
        loadingEnd();
        loadingBar.remove(errMsgElm);
    }, 1000);
}

//Adds fav icon to the iconElement, the icon will be based 
//on whether the meal is in fav-list or not and based on that 
//it will have its own specific onclick behaviors. 
function addFavIconToElement(iconElement, id, name) {
    let attr = store.isFavMeal(id) ? "filled" : "unfilled";
    iconElement.setAttribute("data-icontype", attr);
    if (attr == "filled")
        iconElement.innerHTML = heartIconFilled;
    else
        iconElement.innerHTML = heartIconUnfilled;
    iconElement.addEventListener("click", function (e) {
        e.stopPropagation();
        let message;
        let iconType = this.getAttribute("data-icontype");
        let iconInnerHtml;
        if (iconType == "filled") {
            if (store.removeMeal(id))
                message = "Removed From Fav list";
            iconInnerHtml = heartIconUnfilled;
            this.setAttribute("data-icontype", "unfilled");
        } else {
            store.addFavMeals(id, name);
            message = "Added to fav list";
            iconInnerHtml = heartIconFilled;
            this.setAttribute("data-icontype", "filled");
        }
        notify(message);
        this.firstElementChild.remove();
        this.innerHTML = iconInnerHtml;
    });
}

//notifies message to the user, and waits for a second 
//before it fades out. 
function notify(message) {
    let notifyDiv = document.getElementById("notify-div-id");
    notifyDiv.textContent = message;
    notifyDiv.classList.toggle("hidden");
    setTimeout(() => {
        notifyDiv.classList.toggle("hidden");
        notifyDiv.textContent = "";
    }, 1000);
}

//a default suggestion loader, in which the suggestions are fetched after 
//invoking a function returned by it, which is used to fetch all the meals 
//returned by the external api
let defaultAutoSuggestionMLoader = function (mealPageUrl) {
    let mealsMap = new Map();
    let isDataFetched = false;
    let filterBy = function (enteredVal, meal) {
        return meal.name.toLowerCase().startsWith(enteredVal.toLowerCase());
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
            window.location.href = mealPageUrl + `?id=${meal.id}`;
        });
        addFavIconToElement(likeIcon, meal.id, meal.name);
        suggestionDiv.append(nameElement, likeIcon);
        //will add event listener later 
        suggestionDiv.id = meal.id;
        return suggestionDiv;
    }

    function fetchSuggestions(enteredVal) {
        if (mealsMap.get(enteredVal.charAt(0).toLowerCase()))
            return mealsMap.get(enteredVal.charAt(0).toLowerCase()).filter(meal => meal.name.toLowerCase().startsWith(enteredVal.toLowerCase()));
        return;
    }

    let autoCompleteInput = {
        searchElement: document.getElementById("inputBarModal"),
        suggestionElement: document.getElementById("meal-suggestions"),
        fetchSuggestions: fetchSuggestions,
        filterBy: filterBy,
        generateSuggestion: generateSuggestion,
        mealPageUrl: mealPageUrl
    };

    initAutoComplete(autoCompleteInput);

    async function fetchMealsByFirstLetter(firstletter) {
        let url = FILTER_MEALS_FIRST_LETTER_URL + `${firstletter}`
        let response = await fetch(url);
        if (!response.ok)
            throw new Error("Failed to fetch meals");
        response = await response.json();
        return response;
    }

    async function populateMealsKey(firstletter) {
        let mealsResp = await fetchMealsByFirstLetter(firstletter);
        if (mealsResp.meals) {
            let meals = mealsResp.meals.map(e => {
                return { name: e.strMeal, id: e.idMeal };
            });
            mealsMap.set(firstletter, meals);
        }
    }

    async function __fetchAllNames() {
        if (isDataFetched)
            return;
        let promises = [];
        for (let i = 97; i <= 122; i++) {
            promises.push(populateMealsKey(String.fromCharCode(i)));
        }
        Promise.all(promises);
        isDataFetched = true;
    }
    return __fetchAllNames;
}

export {
    FILTER_MEALS_FIRST_LETTER_URL,
    heartIconFilled,
    heartIconUnfilled,
    modalElement,
    defaultAutoSuggestionMLoader,
    handlerForClosingModal,
    loading,
    awaitLoadingFromExternalURL,
    awaitLoading,
    fetchURL,
    removeAllChild,
    handleException,
    addFavIconToElement,
    notify
};

