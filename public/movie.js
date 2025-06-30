document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const title = params.get("title");

    if (!title) {
        document.body.innerHTML = "<h1>Missing title parameter</h1>";
        return;
    }

    fetch(`/movie?title=${encodeURIComponent(title)}`)
        .then(res => res.json())
        .then(data => {
            const { film, filmDetails, reviews, posterFormat } = data;

            document.getElementById("movieTitle").textContent = `${film.Title} (${film.Year})`;

            const poster = document.getElementById("poster");
            if (posterFormat) {
                poster.src = `/movies/${film.FilmCode}/poster.${posterFormat}`;
            }

            const detailsList = document.getElementById("filmDetails");
            filmDetails.forEach(detail => {
                const dt = document.createElement("dt");
                dt.textContent = detail.Attribute;
                const dd = document.createElement("dd");
                dd.textContent = detail.Value;
                detailsList.appendChild(dt);
                detailsList.appendChild(dd);
            });

            const scoreImage = document.getElementById("scoreImage");
            scoreImage.src = film.Score >= 60 ? "/freshbig.png" : "/rottenbig.png";

            document.getElementById("scorePercent").textContent = `${film.Score}%`;

            const reviewsDiv = document.getElementById("reviews");
            reviews.forEach((review) => {
                const reviewContainer = document.createElement("div");
                reviewContainer.className = "review";

                const quote = document.createElement("p");
                quote.className = "quote";
                quote.innerHTML = `<img src="${film.Score >= 60 ? '/fresh.gif' : '/rotten.gif'}" alt="review" />
                                   <q>${review.ReviewText}</q>`;
                reviewContainer.appendChild(quote);

                const author = document.createElement("p");
                author.className = "author";
                author.innerHTML = `<img src="/critic.gif" alt="Critic" /> ${review.ReviewerName}<br>${review.Affiliation}`;
                reviewContainer.appendChild(author);

                reviewsDiv.appendChild(reviewContainer);
            });

            document.getElementById("entriesCount").textContent = `(1-${reviews.length}) of ${reviews.length}`;
        })
        .catch(err => {
            console.error(err);
            document.body.innerHTML = "<h1>Error loading movie data</h1>";
        });
});
