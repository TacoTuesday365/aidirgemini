const timelineContainer = document.getElementById("timeline");
const allMovies = []; // Array to hold all movies

// Function to fetch movie data from OMDb API
async function fetchMovieData(title) {
    const url = `https://www.omdbapi.com/?t=${encodeURIComponent(
      title
    )}&apikey=${apiKey}&plot=short`;
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

// Function to display a single movie on the timeline
async function displayMovie(movieData) {
    if (!movieData) return;

    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");

    const movieLink = document.createElement("a"); // Create an <a> element
    movieLink.href = `https://www.youtube.com/results?search_query=${encodeURIComponent(
        movieData.Title + " movie trailer"
    )}`; // Link to YouTube trailer search
    movieLink.target = "_blank"; // Open in a new tab
    movieLink.rel = "noopener noreferrer"; // Security best practice

    const img = document.createElement("img");
    img.src = movieData.Poster !== "N/A" ? movieData.Poster : "placeholder.png";
    img.alt = movieData.Title;

    const title = document.createElement("h3");
    title.textContent = movieData.Title;

    const year = document.createElement("p");
    year.textContent = movieData.Year;

    const plot = document.createElement("p"); // Add plot element
    plot.textContent = movieData.Plot;

    movieLink.appendChild(img); // Put image inside the link
    movieLink.appendChild(title); // Put title inside the link
    movieLink.appendChild(year); // Put year inside the link
    movieLink.appendChild(plot); // Put plot inside the link

    movieCard.appendChild(movieLink); // Put link and content in card.
    timelineContainer.appendChild(movieCard);
}

// Function to create year indicator
function createYearIndicator(year) {
    const yearIndicator = document.createElement("div");
    yearIndicator.classList.add("year-indicator");
    yearIndicator.textContent = year;
    return yearIndicator;
}

// Function to process all movies from all generations
async function processAllMovies() {
    // Combine all movies into a single array
    for (const generation in aiMoviesByGeneration) {
        const movieTitles = aiMoviesByGeneration[generation];
        for (const title of movieTitles) {
            const movieData = await fetchMovieData(title);
            if (movieData) {
                allMovies.push(movieData);
            }
        }
    }

    // Sort movies by year in descending order
    allMovies.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));

    // Display the movies and year indicators on the timeline
    let lastDisplayedYear = null; // Keep track of the last year displayed
    for (const movie of allMovies) {
        const movieYear = movie.Year;

        // If the year is different from the last displayed year, create and display a new year indicator
        if (movieYear !== lastDisplayedYear) {
            const yearIndicator = createYearIndicator(movieYear);
            timelineContainer.appendChild(yearIndicator);
            lastDisplayedYear = movieYear;
        }

        // Display the movie
        await displayMovie(movie);
    }
}

// Initialize the app
async function init() {
    await processAllMovies();
}

// Call init when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", init);
