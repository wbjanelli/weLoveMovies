const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//For a given movieId, returns the list of reviews for that movieId.
async function readByMovieId(req, res, next) {
  const movieId = req.params.movieId;
  const data = await service.readByMovieId(movieId);
  res.json({ data: data });
}

//Checks if a review with a given reviewId exists. If it does exist, save the review to res.locals.review. Else, send a 404 error.
async function reviewExists(req, res, next) {
  const reviewId = req.params.reviewId;
  const foundReview = await service.read(reviewId);
  if (foundReview) {
    res.locals.review = foundReview;
    next();
  } else {
    next({ status: 404, message: `Review ${reviewId} cannot be found` });
  }
}

//Deletes a review for a given reviewId.
async function destroy(req, res, next) {
  const reviewId = res.locals.review.review_id;
  await service.delete(reviewId);
  res.sendStatus(204);
}

//Updates a review for a given review id with the content submitted.
async function update(req, res, next) {
  const updatedReview = {
    ...res.locals.review,
    ...req.body.data,
    review_id: res.locals.review.review_id,
  };
  await service.update(updatedReview);
  const formattedData = await service.readAndFormat(
    res.locals.review.review_id
  );
  res.json({ data: formattedData });
}

module.exports = {
  readByMovieId: [asyncErrorBoundary(readByMovieId)],
  delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
  update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)],
};