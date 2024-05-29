
/**
 * Modal loader initializer, to add behavior to the modal in a given page. 
 */

import { awaitLoading, modalElement } from "./common.js";

export default function (elementToActivateModal ,handlerForClosingModal, initAutoSuggestion) {
    let inputBarNavElement = document.getElementById(elementToActivateModal);
    inputBarNavElement.addEventListener("click", (e) => {
        // modalElement.classList.toggle("hidden");
        e.stopPropagation();
        modalElement.classList.remove("hidden");
        document.querySelector("main").classList.add("blur-bg");
        inputBarDiv.classList.add("hidden");
        modalElement.querySelector("input").focus();
        if(initAutoSuggestion)
            awaitLoading(initAutoSuggestion);  
    });
    document.addEventListener("click",handlerForClosingModal);
};