/**
 * Requires configuraton for adding auto suggestion to searchElement in the page 
 * The suggestion element is where the suggestions are displayed 
 * The function fetchSuggestions is used to fetch the suggestions based on the 
 * given input by the user 
 * The generateSuggestion is used to generate a dom element which can be added to the 
 * suggestion element for display. 
 * The mealPageUrl is used to locate meal page from its root .html file
 * 
 * The behoviors like on ArrowDown/ArroUp the suggestion element is highlighted and 
 * the suggestion is automaically populated in the searchElement. 
 * Same behavior is kept on hovering over the suggestion element. 
 * 
 * On pressing enter, the value in the searchElement is queried and the page is 
 * redirected to mealPageURL
 * @param {*} config 
 */
let autoCompleteInit = function (config) {
    let {
        searchElement,
        suggestionElement,
        fetchSuggestions,
        filterBy,
        generateSuggestion, 
        mealPageUrl
    } = config;

    let inputVal;
    let cursor;


    searchElement.addEventListener("input", function () {
        removeSuggestions();
        inputVal = this.value;
        showSuggestions(this.value);
    });

    searchElement.addEventListener("click", () => {
        if (cursor)
            deactivateCursor();
    });

    searchElement.addEventListener("keydown", function (e) {
        if (e.key == "ArrowDown")
            moveCursorDown(cursor);
        if (e.key == "ArrowUp")
            moveCursorUp(cursor);
        if (e.key == "Enter") {
            e.preventDefault(); 
            //search here using : the name 
            window.location.href = mealPageUrl + `?name=${searchElement.value}`; 
        }
    });

    
    function moveCursorDown() {
        if (cursor)
            deactivateCursor();
        if (!cursor || !cursor.nextSibling)
            cursor = suggestionElement.firstElementChild;

        else
            cursor = cursor.nextElementSibling;
        cursor.scrollIntoView();
        activatecursor();
    }

    function deactivateCursor() {
        cursor.classList.remove("active");
        searchElement.value = inputVal;
    }

    function activatecursor() {
        cursor.classList.add("active");
        searchElement.value = cursor.querySelector(".meal-name").textContent;
    }

    function moveCursorUp() {
        if (cursor)
            deactivateCursor();
        if (!cursor || !cursor.previousElementSibling) {
            suggestionElement.scrollTop = suggestionElement.scrollHeight;
            cursor = suggestionElement.lastElementChild;
        } else
            cursor = cursor.previousElementSibling;
        cursor.scrollIntoView();
        activatecursor();
    }

    function removeSuggestions() {
        while (suggestionElement.lastElementChild)
            suggestionElement.lastElementChild.remove();
    }

    function showSuggestions(enteredVal) {
        //remove previous suggestions 
        if (enteredVal == undefined || enteredVal.length == 0)
            return;
        let suggestionArr = fetchSuggestions(enteredVal); 
        if (suggestionArr)
            suggestionArr.filter(meal =>filterBy(enteredVal, meal)).forEach(meal => {
            let sgstElm = generateSuggestion(enteredVal, meal); 
            sgstElm.addEventListener("mouseover", function (e) { 
                if(cursor){ 
                    deactivateCursor(); 
                }
                cursor = this; 
                activatecursor(); 
            }); 
            suggestionElement.append(sgstElm); 
        });
    }

}; 

export default autoCompleteInit; 