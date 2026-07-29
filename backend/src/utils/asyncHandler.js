// Wraps an async controller so thrown/rejected errors reach errorHandler
// instead of needing a try/catch block in every controller function.
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
