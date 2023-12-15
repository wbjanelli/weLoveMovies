// Import required modules
const knex = require("../db/connection");
const reduceProperties = require("../utils/reduce-properties");

// Function to retrieve the list of theaters where a specific movie is showing based on its id
function readByMovieId(movieId) {
  // Query the database to get theaters showing the specified movie
  return knex("theaters as t")
    .join("movies_theaters as mt", "t.theater_id", "mt.theater_id")
    .select(
      "t.theater_id",
      "t.name",
      "t.address_line_1",
      "t.address_line_2",
      "t.city",
      "t.state",
      "t.zip",
      "t.created_at",
      "t.updated_at",
      "mt.is_showing",
      "mt.movie_id"
    )
    .where("mt.movie_id", movieId);
}

// Define a reduced properties function used to create a nested movies object inside the theaters object
const reducedMovies = reduceProperties("theater_id", {
  movie_id: ["movies", null, "movie_id"],
  title: ["movies", null, "title"],
  runtime_in_minutes: ["movies", null, "runtime_in_minutes"],
  rating: ["movies", null, "rating"],
  description: ["movies", null, "description"],
  image_url: ["movies", null, "image_url"],
  movie_created_at: ["movies", null, "created_at"],
  movie_updated_at: ["movies", null, "updated_at"],
  is_showing: ["movies", null, "is_showing"],
  movie_theater_id: ["movies", null, "theater_id"],
});

// Function to retrieve a list of all theaters with an array of movies showing in each theater
function list() {
  // Query the database to get all theaters with movies and apply the reducedMovies function
  return knex("theaters as t")
    .join("movies_theaters as mt", "t.theater_id", "mt.theater_id")
    .join("movies as m", "m.movie_id", "mt.movie_id")
    .select(
      "*",
      "m.created_at as movie_created_at",
      "m.updated_at as movie_updated_at",
      "t.theater_id as movie_theater_id"
    )
    .then(reducedMovies);
}

// Export the functions for external use
module.exports = {
  readByMovieId,
  list,
};
