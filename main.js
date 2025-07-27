const loadGamesBtn = document.getElementById("loadGamesBtn");
const trendingItems = document.getElementById("trendingItems");

let games = [];
let isExpanded = false;

const createStars = (rating) => {
  const starCount = 5;
  const starSize = 24;
  const starSpacing = 4;

  const totalWidth = starCount * starSize + (starCount - 1) * starSpacing;

  // Rating-i tam və onluq hissələrə böl
  const fullStars = Math.floor(rating); // Tam ulduzlar (məs: 3.6 üçün 3)
  const partialStar = rating - fullStars; // Qismən ulduz (məs: 3.6 üçün 0.6)

  const starPath =
    "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z";

  // Unique ID yaradırıq hər rating üçün
  const uniqueId = `clip-${Math.random().toString(36).substr(2, 9)}`;

  let starsHTML = "";

  // Hər ulduz üçün ayrı-ayrılıqda yarat
  for (let i = 0; i < starCount; i++) {
    const xPosition = i * (starSize + starSpacing);

    if (i < fullStars) {
      // Tam dolu ulduz
      starsHTML += `
        <g transform="translate(${xPosition}, 0)">
          <path d="${starPath}" fill="#ffd700" transform="scale(1)" />
        </g>
      `;
    } else if (i === fullStars && partialStar > 0) {
      // Qismən dolu ulduz
      const partialWidth = partialStar * starSize; // 0.6 üçün ulduzun 60%-i
      const partialClipId = `${uniqueId}-partial-${i}`;

      starsHTML += `
        <defs>
          <clipPath id="${partialClipId}">
            <rect width="${partialWidth}" height="${starSize}" />
          </clipPath>
        </defs>
        <g transform="translate(${xPosition}, 0)">
          <!-- Boş ulduz -->
          <path d="${starPath}" fill="#e0e0e0" transform="scale(1)" />
          <!-- Qismən dolu hissə -->
          <path d="${starPath}" fill="#ffd700" transform="scale(1)" clip-path="url(#${partialClipId})" />
        </g>
      `;
    } else {
      // Boş ulduz
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
      <button class="btn"><i class="uil uil-shopping-bag"></i></button>
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

    showGames(4);

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
