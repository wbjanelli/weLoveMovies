const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

//For a given movieId, returns the list of reviews for that movieId from the db.
function readByMovieId(movieId) {
  return knex("reviews as r")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select(
      "*",
      "c.created_at as critic_created_at",
      "c.updated_at as critic_updated_at"
    )
    .where("movie_id", movieId)
    .then((data) =>
      data.map((r) => {
        return {
          review_id: r.review_id,
          content: r.content,
          score: r.score,
          created_at: r.created_at,
          updated_at: r.updated_at,
          critic_id: r.critic_id,
          movie_id: r.movie_id,
          critic: {
            critic_id: r.critic_id,
            preferred_name: r.preferred_name,
            surname: r.surname,
            organization_name: r.organization_name,
            created_at: r.critic_created_at,
            updated_at: r.critic_updated_at,
          },
        };
      })
    );
}

//Deletes a review from the db for a given reviewId.
function destroy(review_id) {
  return knex("reviews").where({ review_id }).del();
}

//If the given review_id exists, return the review object.
function read(review_id) {
  return knex("reviews").select("*").where({ review_id }).first();
}

//After updating a review, this function is used to retrieve the new data and correctly formats the review object.
function readAndFormat(review_id) {
  return knex("reviews as r")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select(
      "*",
      "c.created_at as critic_created_at",
      "c.updated_at as critic_updated_at"
    )
    .where({ review_id })
    .first()
    .then((r) => {
      return {
        review_id: r.review_id,
        content: r.content,
        score: r.score,
        created_at: r.created_at,
        updated_at: r.updated_at,
        critic_id: r.critic_id,
        movie_id: r.movie_id,
        critic: {
          critic_id: r.critic_id,
          preferred_name: r.preferred_name,
          surname: r.surname,
          organization_name: r.organization_name,
          created_at: r.critic_created_at,
          updated_at: r.critic_updated_at,
        },
      };
    });
}

//Updates a review in the db for a given review id with the content submitted.
function update(updatedReview) {
  return knex("reviews")
    .select("*")
    .where({ review_id: updatedReview.review_id })
    .update(updatedReview);
}

module.exports = {
  readByMovieId,
  delete: destroy,
  read,
  readAndFormat,
  update,
};