/**
 * movie.js
 * Authors: Ahmad Shalaata (212811244), Basel Hamza (214048019), Narmin Araideh (212845762)
 * Description:
 * This script dynamically loads movie details and reviews from the server
 * using the filmCode provided as a URL parameter, and renders the data into the HTML page.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Extract filmCode from the URL query string
  const params = new URLSearchParams(window.location.search);
  const filmCode = params.get("filmCode");

  if (!filmCode) {
    document.body.innerHTML = "<h1>Missing filmCode parameter</h1>";
    return;
  }

  // Fetch movie data from the server API
  fetch(`/movie?filmCode=${encodeURIComponent(filmCode)}`)
    .then(res => res.json())
    .then(data => {
      const { film, filmDetails, reviews, posterFormat } = data;

      // Set the movie title at the top of the page
      document.getElementById("movieTitle").textContent = `${film.Title} (${film.Year})`;

      // Set the movie poster if available
      const poster = document.getElementById("poster");
      if (posterFormat) {
        poster.src = `/movies/${film.FilmCode}/poster.${posterFormat}`;
        poster.alt = `Poster for ${film.Title}`;
      }

      // Populate movie attributes using <dl><dt><dd> structure
      const detailsList = document.getElementById("filmDetails");
      detailsList.innerHTML = ""; // Clear existing content
      filmDetails.forEach(detail => {
        const dt = document.createElement("dt");
        dt.textContent = detail.Attribute;

        const dd = document.createElement("dd");
        dd.textContent = detail.Value;

        detailsList.appendChild(dt);
        detailsList.appendChild(dd);
      });

      // Display score image based on the numeric score
      const scoreImage = document.getElementById("scoreImage");
      scoreImage.src = film.Score >= 60 ? "/freshbig.png" : "/rottenbig.png";
      scoreImage.alt = film.Score >= 60 ? "Fresh rating" : "Rotten rating";

      // Display the numeric score
      document.getElementById("scorePercent").textContent = `${film.Score}%`;

      // Display all reviews
      const reviewsDiv = document.getElementById("reviews");
      reviewsDiv.innerHTML = ""; // Clear previous reviews

      reviews.forEach(review => {
        const reviewContainer = document.createElement("div");
        reviewContainer.className = "review";

        // Review quote section with fresh/rotten image
        const quote = document.createElement("p");
        quote.className = "quote";

        const ratingImg = document.createElement("img");
        ratingImg.src = review.IsFresh ? "/fresh.gif" : "/rotten.gif";
        ratingImg.alt = review.IsFresh ? "Fresh" : "Rotten";
        quote.appendChild(ratingImg);

        const quoteText = document.createElement("q");
        quoteText.textContent = review.ReviewText;
        quote.appendChild(quoteText);

        reviewContainer.appendChild(quote);

        // Reviewer info
        const author = document.createElement("p");
        author.className = "author";

        const criticImg = document.createElement("img");
        criticImg.src = "/critic.gif";
        criticImg.alt = "Critic";
        author.appendChild(criticImg);

        author.appendChild(document.createElement("br"));
        author.appendChild(document.createTextNode(review.ReviewerName));
        author.appendChild(document.createElement("br"));
        author.appendChild(document.createTextNode(review.Affiliation));

        reviewContainer.appendChild(author);
        reviewsDiv.appendChild(reviewContainer);
      });

      // Display the total number of reviews
      document.getElementById("entriesCount").textContent = `(1-${reviews.length}) of ${reviews.length}`;
    })
    .catch(err => {
      console.error("Error loading movie data:", err);
      document.body.innerHTML = "<h1>Error loading movie data</h1>";
    });
});
