/**
 * Authors: Ahmad Shalaata (212811244), Basel Hamza (214048019), Narmin Araideh (212845762)
 * Date: 2025-06-23
 * Description: Node.js server for the Rancid Tomatoes project.
 *              Serves movie data as JSON from an SQLite database.
 *              Sends movie.html on root access and provides movie info via /movie?filmCode=
 * GitHub: https://github.com/Ahmadsh64/ex2b.git
 */

const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 7876;

// Serve static files from the "public" directory
app.use(express.static("public"));

// Connect to the SQLite database
const db = new sqlite3.Database("rtfilms.db");

// Root route - serve the main HTML page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "movie.html"));
});

// Endpoint to return movie data as JSON based on filmCode
app.get("/movie", (req, res) => {
  const filmCode = req.query.filmCode;

  // Handle missing query parameter
  if (!filmCode) {
    return res.status(400).json({ error: "Missing filmCode parameter" });
  }

  // Query film details from the Films table
  db.get("SELECT * FROM Films WHERE FilmCode = ?", [filmCode], (err, film) => {
    if (err || !film) {
      return res.status(404).json({ error: "Movie not found" });
    }

    // Check if a poster image exists (png or jpg)
    const posterPathPng = path.join(__dirname, "public", "movies", film.FilmCode, "poster.png");
    const posterPathJpg = path.join(__dirname, "public", "movies", film.FilmCode, "poster.jpg");

    let posterFormat = null;
    if (fs.existsSync(posterPathPng)) {
      posterFormat = "png";
    } else if (fs.existsSync(posterPathJpg)) {
      posterFormat = "jpg";
    }

    // Query additional film attributes (FilmDetails)
    db.all(
      "SELECT Attribute, Value FROM FilmDetails WHERE FilmCode = ? ORDER BY Attribute DESC",
      [film.FilmCode],
      (err, filmDetails) => {
        if (err) {
          return res.status(500).json({ error: "Internal Server Error" });
        }

        // Query all reviews for this film
        db.all(
          "SELECT * FROM Reviews WHERE FilmCode = ?",
          [film.FilmCode],
          (err, reviews) => {
            if (err) {
              return res.status(500).json({ error: "Database error" });
            }

            // Send the full movie data as JSON to the client
            res.json({
              film,
              filmDetails,
              reviews,
              posterFormat
            });
          }
        );
      }
    );
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/?filmCode=`);
});
