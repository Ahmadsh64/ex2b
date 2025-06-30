/**
 * מגישים: אחמד שלאעטה 212811244, באסל חמזה 214048019  , נרמין עראידה 212845762
 * GitHub: ( https://github.com/Ahmadsh64/ex2b.git )
 */

const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 7876;

app.use(express.static("public"));

const db = new sqlite3.Database("rtfilms.db");

app.get("/movie", (req, res) => {
    const title = req.query.title;

    if (!title) {
        return res.status(400).json({ error: "Missing title parameter" });
    }

    db.get("SELECT * FROM Films WHERE Title = ?", [title], (err, film) => {
        if (err || !film) {
            return res.status(404).json({ error: "Movie not found" });
        }

        const posterPathPng = path.join(
            __dirname,
            "public",
            "movies",
            film.FilmCode,
            "poster.png"
        );
        const posterPathJpg = path.join(
            __dirname,
            "public",
            "movies",
            film.FilmCode,
            "poster.jpg"
        );

        let posterFormat = null;
        if (fs.existsSync(posterPathPng)) {
            posterFormat = "png";
        } else if (fs.existsSync(posterPathJpg)) {
            posterFormat = "jpg";
        }

        db.all(
            "SELECT Attribute, Value FROM FilmDetails WHERE FilmCode = ? ORDER BY Attribute DESC",
            [film.FilmCode],
            (err, filmDetails) => {
                if (err) {
                    return res.status(500).json({ error: "Internal Server Error" });
                }

                db.all(
                    "SELECT * FROM Reviews WHERE FilmCode = ?",
                    [film.FilmCode],
                    (err, reviews) => {
                        if (err) {
                            return res.status(500).json({ error: "Database error" });
                        }

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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/`);
});
