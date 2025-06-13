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

            const half = Math.ceil(reviews.length / 2);
            const leftColumn = document.getElementById("leftColumn");
            const rightColumn = document.getElementById("rightColumn");

            reviews.forEach((review, index) => {
                const column = index < half ? leftColumn : rightColumn;

                const quoteBox = document.createElement("p");
                quoteBox.className = "quoteBox";
                quoteBox.innerHTML = `<img src="${film.Score >= 60 ? '/fresh.gif' : '/rotten.gif'}" alt="review" />
                                       <q>${review.ReviewText}</q>`;
                column.appendChild(quoteBox);

                const authorBox = document.createElement("p");
                authorBox.className = "authorBox";
                authorBox.innerHTML = `<img src="/critic.gif" alt="Critic" />${review.ReviewerName}<br>${review.Affiliation}`;
                column.appendChild(authorBox);
            });

            document.getElementById("entriesCount").textContent = `(1-${reviews.length}) of ${reviews.length}`;
        })
        .catch(err => {
            console.error(err);
            document.body.innerHTML = "<h1>Error loading movie data</h1>";
        });
});
