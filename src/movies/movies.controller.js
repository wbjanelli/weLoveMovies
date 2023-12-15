// Import the movies service module and the async error boundary handler
const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// Handler function to retrieve theaters where a specific movie is showing
// Endpoint: GET /movies/:movieId/theaters
async function list(req, res, next) {
  // Check if the query parameter is_showing is present
  const hasQuery = req.query.is_showing;
  let data;

  // Use the appropriate service function based on the presence of the query parameter
  if (hasQuery) {
    data = await service.moviesShowing();
  } else {
    data = await service.list();
  }

  // Respond with the retrieved data in JSON format
  res.json({ data: data });
}

// Middleware function to check if a movie exists. If it exists, save it to res.locals.movie. Otherwise, send a 404 error.
async function movieExists(req, res, next) {
  // Extract the movieId from the request parameters
  const movieId = req.params.movieId;

  // Call the service function to check if the movie exists
  const data = await service.read(movieId);

  // If the movie exists, save it to res.locals.movie and proceed to the next middleware/handler
  if (data) {
    res.locals.movie = data;
    next();
  } else {
    // If the movie does not exist, send a 404 error
    next({ status: 404, message: `Id ${movieId} does not exist` });
  }
}

// Handler function to return the movie object for a given movieId
// Endpoint: GET /movies/:movieId
function read(req, res, next) {
  // Retrieve the movie from res.locals.movie and respond with it in JSON format
  const movie = res.locals.movie;
  res.json({ data: movie });
}

// Export the handler functions/middleware with the async error boundary applied
module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(movieExists), read],
};
