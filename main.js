const loadGamesBtn = document.getElementById("loadGamesBtn"); // Load button element
const trendingItems = document.getElementById("trendingItems"); // Container for game items

let games = []; // Store all games data
let displayedCount = 0; // Track how many games are currently displayed

// Create a DOM element for a single game
const createGame = (game) => {
  const article = document.createElement("article");
  article.classList.add("trending__item");

  // Prepare old price HTML if exists
  let oldPrice = "";
  if (game.oldPrice) {
    oldPrice = `<div class="old__price">${game.oldPrice}</div>`;
  } else {
    oldPrice = "";
  }

  // Insert game details into the article element
  article.innerHTML = `
    <div class="trending__item-image">
      <a href="./products/products.html">
        <img src="${game.image}" alt="${game.title}" />
      </a>
    </div>
    <div class="trending__item-content">
      <div class="item__text">
        <p>${game.genre}</p>
        <h4>${game.title}</h4>
      </div>
      <button class="btn"><i class="uil uil-shopping-bag"></i></button>
      <span>${oldPrice}${game.price}</span>
    </div>
  `;

  return article;
};

// Display a given number of games starting from the last displayed index
const showGames = (count) => {
  const slice = games.slice(displayedCount, displayedCount + count);
  slice.forEach((game) => {
    trendingItems.appendChild(createGame(game));
  });
  displayedCount += slice.length;
};

// On page load, fetch games and show first 4
window.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("./data.json");
    games = await res.json();

    showGames(4);

    // Hide load button if all games are already displayed
    if (displayedCount >= games.length) {
      loadGamesBtn.style.display = "none";
    }
  } catch (error) {
    console.error("Error loading games:", error);
  }
});

// Load remaining games on button click and disable button afterwards
loadGamesBtn.addEventListener("click", () => {
  showGames(games.length - displayedCount);
  loadGamesBtn.disabled = true;
  loadGamesBtn.textContent = "All Games Loaded";
});

// Navbar scroll effect: add/remove 'scrolled' class based on scroll position
window.addEventListener("scroll", () => {
  const nav = document.querySelector(".navbar");
  if (window.scrollY > 100) {
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }
});
