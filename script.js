const moviesContainer = document.getElementById("movies-container");
const categoriesContainer = document.getElementById("categories-container");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");

// Function to fetch movie data from OMDb API
async function fetchMovieData(title) {
  const url = `https://www.omdbapi.com/?t=${encodeURIComponent(
    title
  )}&apikey=${apiKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.Response === "True") {
      return data;
    } else {
      console.warn(`Movie not found: ${title}`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching movie data for ${title}:`, error);
    return null;
  }
}

// Function to display movie data in the grid
async function displayMovie(movieData) {
  if (!movieData) return; // Don't display if data is null

  const movieCard = document.createElement("div");
  movieCard.classList.add("movie-card");

  const img = document.createElement("img");
  img.src = movieData.Poster !== "N/A" ? movieData.Poster : "placeholder.png"; // Use placeholder if no poster
  img.alt = movieData.Title;

  const title = document.createElement("h3");
  const titleLink = document.createElement("a");
  titleLink.href = `https://www.google.com/search?q=${encodeURIComponent(
    movieData.Title + " movie"
  )}`; // Create the title with a Google search link
  titleLink.textContent = movieData.Title;
  title.appendChild(titleLink);

  const year = document.createElement("p");
  year.textContent = movieData.Year;

  movieCard.appendChild(img);
  movieCard.appendChild(title);
  movieCard.appendChild(year);

  moviesContainer.appendChild(movieCard);
}

// Function to display movies by generation
async function displayMoviesByGeneration(generation) {
  moviesContainer.innerHTML = ""; // Clear existing movies

  const movieTitles = aiMoviesByGeneration[generation];

  if (movieTitles) {
    for (const title of movieTitles) {
      const movieData = await fetchMovieData(title);
      await displayMovie(movieData);
    }
  } else {
    console.warn(`Generation not found: ${generation}`);
    moviesContainer.textContent = "No movies found for this generation.";
  }
}

// Function to create category buttons
function createCategoryButtons() {
  for (const generation in aiMoviesByGeneration) {
    const button = document.createElement("button");
    button.classList.add("category-button");
    button.textContent = generation;
    button.addEventListener("click", () =>
      displayMoviesByGeneration(generation)
    );
    categoriesContainer.appendChild(button);
  }
}

async function searchMovies(searchTerm) {
  moviesContainer.innerHTML = ""; // Clear existing movies
  const movieData = await fetchMovieData(searchTerm);
  await displayMovie(movieData);
}

// Initialize the app
function init() {
  createCategoryButtons();
  // Optionally, display movies from the first generation by default:
  const firstGeneration = Object.keys(aiMoviesByGeneration)[0];
  displayMoviesByGeneration(firstGeneration);

  searchButton.addEventListener("click", () => {
    const searchTerm = searchInput.value;
    searchMovies(searchTerm);
  });

  searchInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission
      const searchTerm = searchInput.value;
      searchMovies(searchTerm);
    }
  });
}

// Call init when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", init);
