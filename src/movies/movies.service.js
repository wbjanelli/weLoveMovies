const knex = require("../db/connection");

//Returns a list of all movies from the db.
function list() {
  return knex("movies").select(
    "movie_id",
    "title",
    "runtime_in_minutes",
    "rating",
    "description",
    "image_url"
  );
}

//For a given movieId, returns the theaters where that movie is showing from the db.
function moviesShowing() {
  return knex("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .select(
      "m.movie_id",
      "m.title",
      "m.runtime_in_minutes",
      "m.rating",
      "m.description",
      "m.image_url"
    )
    .where("mt.is_showing", true)
    .groupBy("m.movie_id");
}

//Returns the movie object for a given movieId from the db.
function read(movieId) {
  return knex("movies")
    .select(
      "movie_id",
      "title",
      "runtime_in_minutes",
      "rating",
      "description",
      "image_url",
      "created_at",
      "updated_at"
    )
    .where("movie_id", movieId)
    .first();
}

module.exports = {
  list,
  moviesShowing,
  read,
};