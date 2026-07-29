// Thrown by services/controllers when a request is invalid or forbidden;
// errorHandler reads `.status` to pick the HTTP status code (defaults to 400/500 otherwise).
class AppError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

module.exports = AppError;
