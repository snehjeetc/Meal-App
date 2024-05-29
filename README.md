
# Meal App
App to search and display meals and their recipes, and to manage the favorite meals selected by the user.

# Overview 
Contains three pages : 
### Main Page
Displays categories, meals, and a search function for all meals.
### Description Page
Displays meal name, meal image, recipe, and instructions. 
### Favorite Meals Page
Displays all the meals in the favorite list.   

## Features 
- Auto-suggestion when searching for a meal
- Displays all available categories
- Displays all meals for a given category
- Displays the recipe for a given meal
- Add/remove a meal to/from the favorite list
- Notifies on performing addition and removal of a meal to/from the favorite list
- Displays an error if external API calls fail
- Favorite meal list is persistent on closing the browser (uses cache)

## Meal Page
### Nav Section 
- In the top left corner, contains app name and icon. Clicking this reloads the page.
- The search bar is present in the middle of the section. Clicking this search bar opens a modal element with the search bar displayed there. Entering values in the search bar will give suggestions below the bar. Suitable indicators are provided for all suggested meals, showing whether the meal was already selected by the user in prior sessions or not. Clicking these indicators will either add the meal to the favorite meal section or remove it. Pressing enter redirects the page to the meal description page with the queried field.
- In the top right corner, there is a heart icon and text: "Fav Meals". Clicking this redirects to the favorite list selected by the user.
### Content
- A carousel is displayed on loading the web page, showing all available food categories.
- Clicking any category displays all meals available in that category on the carousel.
- Clicking any meal in the carousel takes the user to the meal description section where the meal recipe and description are shown. 

## Meal Description Page 
- This page also contains a nav section that works as described in the previous page.
- If the meal queried is found, the meal name and image are displayed on the left side (for desktop versions) and below it, the ingredients and their respective measures are shown in tabular format.
- The instructions are displayed on the right side of the page (for desktop versions).
> Note: For smaller screen sizes meal name, meal image and ingredients are shown first followed by the instructions. 
- If the meal displayed is a favorite meal, a relevant indicator (filled heart) is shown; otherwise, an unfilled heart is shown on the image of the meal. Clicking this will either add the meal to the favorite list if it is not a favorite meal or remove it if it is.

## Favorite Meals Page
- At the top, there are only two icons: one is the app name and icon (clicking this redirects to the home page) and the other is the search bar.
- Clicking the search bar opens a pop-up. Based on the entered values, it will suggest all the meals in the favorite list.
- The middle of the page contains the favorite list.
- Each favorite meal shown in the list section or in the suggestions contains an icon that allows the user to remove the meal from the favorite section. 

> Note:  If the external API takes time, a progress bar is displayed. Adding/removing a meal to/from the favorite items will notify the user about the action at the top of the page, which will fade after a second.

## Screenshots
![Main page](https://github.com/snehjeetc/Meal-App/blob/master/screenshots/main-page.png)
![Meal Page](https://github.com/snehjeetc/Meal-App/blob/master/screenshots/meal-details-page.png)
![Fav Meals Page](https://github.com/snehjeetc/Meal-App/blob/master/screenshots/fav-meal-page.png)
![Autosuggestion](https://github.com/snehjeetc/Meal-App/blob/master/screenshots/auto-suggestion.png)

Technology Stack : 
Frontend : HTML, CSS for building the user interface and JS for additional functionality.


External API : 
https://www.themealdb.com/api.php

Icons : 
https://fontawesome.com/icons
 
