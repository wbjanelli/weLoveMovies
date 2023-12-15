// Import the theaters service module and the async error boundary handler
const service = require("./theaters.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// Handler function to retrieve the list of theaters where a specific movie is showing based on its id
// Endpoint: `GET /movies/:movieId/theaters`
async function readByMovieId(req, res, next) {
  const movieId = req.params.movieId;
  const data = await service.readByMovieId(movieId);
  res.json({ data: data });
}

// Handler function to retrieve a list of all theaters with an array of movies showing in each theater
async function list(req, res, next) {
const data = await service.list();
res.json({ data: data });
}

// Export the handler functions with the async error boundary applied
module.exports = {
  readByMovieId: asyncErrorBoundary(readByMovieId),
  list: asyncErrorBoundary(list),
};
