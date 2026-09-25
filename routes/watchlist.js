import express from "express";
import {
  addMovie,
  deleteMovie,
  getWatchlist,
  updateMovie,
} from "../utils/db.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorizeModification } from "../middleware/authorize.js";

const router = express.Router();

router.use(authenticate);

router.get("/:userId", (req, res) => {
  const userId = Number(req.params.userId);
  const watchlist = getWatchlist(userId);

  if (watchlist === null) {
    return res.status(404).json({ error: "User not found." });
  }

  return res.status(200).json(watchlist);
});

router.post("/:userId/movies", authorizeModification, (req, res) => {
  const userId = Number(req.params.userId);
  const { title, genre } = req.body || {};

  if (!title || !genre) {
    return res.status(400).json({ error: "Title and genre are required." });
  }

  const movie = addMovie(userId, { title, genre });

  if (!movie) {
    return res.status(404).json({ error: "User not found." });
  }

  return res.status(201).json(movie);
});

router.put(
  "/:userId/movies/:movieId",
  authorizeModification,
  (req, res) => {
    const userId = Number(req.params.userId);
    const movieId = Number(req.params.movieId);
    const movie = updateMovie(userId, movieId, req.body || {});

    if (!movie) {
      return res.status(404).json({ error: "Movie not found." });
    }

    return res.status(200).json(movie);
  },
);

router.delete(
  "/:userId/movies/:movieId",
  authorizeModification,
  (req, res) => {
    const userId = Number(req.params.userId);
    const movieId = Number(req.params.movieId);
    const deleted = deleteMovie(userId, movieId);

    if (!deleted) {
      return res.status(404).json({ error: "Movie not found." });
    }

    return res.status(200).json({ success: true });
  },
);

export default router;
