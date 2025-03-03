const moviesByGenerationContainer = document.getElementById("movies-by-generation");

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
async function displayMovie(movieData, container) {
  if (!movieData) return; // Don't display if data is null

  const movieCard = document.createElement("div");
  movieCard.classList.add("movie-card");

  const img = document.createElement("img");
  img.src = movieData.Poster !== "N/A" ? movieData.Poster : "placeholder.png"; // Use placeholder if no poster
  img.alt = movieData.Title;

  const title = document.createElement("h3");
  title.textContent = movieData.Title;

  const year = document.createElement("p");
  year.textContent = movieData.Year;

  movieCard.appendChild(img);
  movieCard.appendChild(title);
  movieCard.appendChild(year);

  container.appendChild(movieCard);
}

// Function to display movies by generation
async function displayMoviesByGeneration(generation) {
  const generationSection = document.createElement("section");
  const generationHeading = document.createElement("h2");
  generationHeading.textContent = generation;
  generationSection.appendChild(generationHeading);

  const movieGrid = document.createElement("div");
  movieGrid.classList.add("movie-grid");
  generationSection.appendChild(movieGrid);

  const movieTitles = aiMoviesByGeneration[generation];

  if (movieTitles) {
    for (const title of movieTitles) {
      const movieData = await fetchMovieData(title);
      await displayMovie(movieData, movieGrid);
    }
  } else {
    console.warn(`Generation not found: ${generation}`);
    movieGrid.textContent = "No movies found for this generation.";
  }

  moviesByGenerationContainer.appendChild(generationSection);
}

// Initialize the app
async function init() {
  for (const generation in aiMoviesByGeneration) {
    await displayMoviesByGeneration(generation);
  }
}

// Call init when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", init);
