import "./style.css";

// API endpoint
const RECIPIE_API = "https://www.themealdb.com/api/json/v1/1/filter.php";

const mealList = document.getElementById("meal");
const mealDetailsContent = document.querySelector(".meal-details-content");
const recipeCloseBtn = document.getElementById("recipe-close-btn");
const searchInput = document.getElementById("search-input");
const titleElement = document.getElementById("title");

// event listeners
searchInput.addEventListener("change", getMealList);
mealList.addEventListener("click", getMealRecipe);
recipeCloseBtn.addEventListener("click", () => {
  mealDetailsContent.parentElement.classList.remove("showRecipe");
});

//project intiator
window.addEventListener("load", () => {
  getMealList();
});

// get meal list that matches with the ingredients
function getMealList() {
  let url = "";
  let searchInputTxt = document.getElementById("search-input").value.trim();
  if (searchInputTxt === "") {
    titleElement.innerText = "Here is random recipe...";
    url = `${RECIPIE_API}?i=${searchInputTxt}`;
  } else {
    titleElement.innerText = "Your Search Results:";
    url = `${RECIPIE_API}?c=${searchInputTxt}`;
  }
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      let html = "";
      if (data.meals) {
        data.meals.forEach((meal) => {
          html += `
                    <div class = "meal-item" data-id = "${meal.idMeal}">
                        <div class = "meal-img">
                            <img src = "${meal.strMealThumb}" alt = "food">
                        </div>
                        <div class = "meal-name">
                            <h3>${meal.strMeal}</h3>
                            <a href = "#" class = "recipe-btn">Get Recipe</a>
                        </div>
                    </div>
                `;
        });
        mealList.classList.remove("notFound");
      }
      mealList.innerHTML = html;
    })
    .catch((error) => {
      titleElement.innerText = "Please try again 😕";
      console.error("Error message: " + error);
    });
}

// get recipe of the meal
function getMealRecipe(e) {
  e.preventDefault();
  if (e.target.classList.contains("recipe-btn")) {
    let mealItem = e.target.parentElement.parentElement;
    fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`
    )
      .then((response) => response.json())
      .then((data) => mealRecipeModal(data.meals));
  }
}

// create a modal
function mealRecipeModal(meal) {
  meal = meal[0];
  let ingredients = [];
  let ingredientsHTML = "";

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) ingredients.push(meal[`strIngredient${i}`]);
  }

  if (ingredients.length > 0) {
    ingredients.forEach((item) => {
      let ingredient = item.replace(" ", "%20");
      ingredientsHTML += `<div class = "ingrediant-img">
      <img src = "https://www.themealdb.com/images/ingredients/${ingredient}.png" alt = "">
      <p>${item}</p>
       </div>`;
      console.log(
        `https://www.themealdb.com/images/ingredients/${ingredient}.png`
      );
    });
  }

  console.log("ingredients list ", ingredientsHTML);

  let html = `
        <h2 class = "recipe-title">${meal.strMeal}</h2>
        <p class = "recipe-category">${meal.strCategory}</p>
        <h2 class = "Ingrediants-heading"> ingredients </h2>
        <div class ="Ingrediants">${ingredientsHTML} </div>
        <div class = "recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class = "recipe-meal-img">
            <img src = "${meal.strMealThumb}" alt = "">
        </div>
        <div class = "recipe-link">
            <a href = "${meal.strYoutube}" target = "_blank">Watch Video</a>
        </div>
    `;
  mealDetailsContent.innerHTML = html;
  mealDetailsContent.parentElement.classList.add("showRecipe");
}
