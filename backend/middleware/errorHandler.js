function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

// Express 5 forwards rejected promises from async route handlers here automatically,
// so controllers don't need a try/catch around every DB call.
function errorHandler(err, req, res, next) {
  console.error(err.stack || err);

  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ message: 'A record with this value already exists' });
  }
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({ message: 'Referenced department or designation does not exist' });
  }

  const status = err.statusCode || 500;
  res.status(status).json({ message: err.message || 'Something went wrong on the server' });
}

module.exports = { notFound, errorHandler };