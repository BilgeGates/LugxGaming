const navMenu = document.querySelector(".nav__menu");
const navMenuOpen = document.querySelector(".nav__menu-open");
const navMenuClose = document.querySelector(".nav__menu-close");
const loadGamesBtn = document.getElementById("loadGamesBtn");
const shopBtn = document.getElementById("shopBtn");
const trendingItems = document.getElementById("trendingItems");

// Toggle mobile navigation menu open/close state
navMenuOpen.addEventListener("click", () => {
  navMenu.style.display = "flex";
  navMenuOpen.style.display = "none";
  navMenuClose.style.display = "inline-block";
});

navMenuClose.addEventListener("click", () => {
  navMenu.style.display = "none";
  navMenuOpen.style.display = "inline-block";
  navMenuClose.style.display = "none";
});

let games = [];
let isExpanded = false;

const createStars = (rating) => {
  const starCount = 5;
  const starSize = 24;
  const starSpacing = 4;

  const totalWidth = starCount * starSize + (starCount - 1) * starSpacing;

  const fullStars = Math.floor(rating);
  const partialStar = rating - fullStars;

  const starPath =
    "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z";

  const uniqueId = `clip-${Math.random().toString(36).substr(2, 9)}`;

  let starsHTML = "";

  for (let i = 0; i < starCount; i++) {
    const xPosition = i * (starSize + starSpacing);

    if (i < fullStars) {
      starsHTML += `
        <g transform="translate(${xPosition}, 0)">
          <path d="${starPath}" fill="#ffd700" transform="scale(1)" />
        </g>
      `;
    } else if (i === fullStars && partialStar > 0) {
      const partialWidth = partialStar * starSize;
      const partialClipId = `${uniqueId}-partial-${i}`;

      starsHTML += `
        <defs>
          <clipPath id="${partialClipId}">
            <rect width="${partialWidth}" height="${starSize}" />
          </clipPath>
        </defs>
        <g transform="translate(${xPosition}, 0)">
          <path d="${starPath}" fill="#e0e0e0" transform="scale(1)" />
          <path d="${starPath}" fill="#ffd700" transform="scale(1)" clip-path="url(#${partialClipId})" />
        </g>
      `;
    } else {
      starsHTML += `
        <g transform="translate(${xPosition}, 0)">
          <path d="${starPath}" fill="#e0e0e0" transform="scale(1)" />
        </g>
      `;
    }
  }

  return `
    <svg width="${totalWidth}" height="${starSize}" viewBox="0 0 ${totalWidth} ${starSize}" xmlns="http://www.w3.org/2000/svg" aria-label="Rating: ${rating} out of 5 stars" role="img">
      ${starsHTML}
    </svg>
  `;
};

const createGame = (game) => {
  const article = document.createElement("article");
  article.classList.add("trending__item");

  let oldPrice = "";
  if (game.oldPrice) {
    oldPrice = `<div class="old__price">${game.oldPrice}</div>`;
  }

  article.innerHTML = `
    <div class="trending__item-image">
      <a href="./products/products.html?id=${game.id}">
        <img src="${game.image}" alt="${game.title}" />
      </a>
    </div>
    <div class="trending__item-content">
      <div class="item__text">
        <p><span class="game-category">Category:</span> ${game.genre}</p>
        <h4><span class="game-title">Game Name:</span> ${game.title}</h4>
        <div class="rating"><span class="game-rating">Rating:</span> ${createStars(
          game.rating
        )}</div>
        <div class="release-date"><span class="game-date">Release Date:</span> ${
          game.releaseDate
        }</div>
      </div>
      <button class="btn" id="shopBtn" onclick="addToCart(${
        game.id
      })"><i class="uil uil-shopping-bag"></i></button>
      <span class="game__price">${oldPrice}${game.price}</span>
    </div>
  `;

  return article;
};

const showGames = (count) => {
  trendingItems.innerHTML = "";
  const toShow = games.slice(0, count);
  toShow.forEach((game) => {
    trendingItems.appendChild(createGame(game));
  });
};

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("./data.json");
    games = await res.json();

    const screenWidth = window.innerWidth;

    if (screenWidth <= 1274) {
      showGames(3);
    } else {
      showGames(4);
    }

    if (games.length <= 4) {
      loadGamesBtn.style.display = "none";
    }
  } catch (error) {
    console.error("Error loading games:", error);
  }
});

loadGamesBtn.addEventListener("click", () => {
  if (!isExpanded) {
    showGames(games.length);
    loadGamesBtn.textContent = "View Less";
    isExpanded = true;
  } else {
    showGames(4);
    loadGamesBtn.textContent = "View All";
    isExpanded = false;
  }
});

window.addEventListener("scroll", () => {
  const nav = document.querySelector(".navbar");
  if (window.scrollY > 100) {
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }
});
