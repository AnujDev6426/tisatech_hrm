const db = require('sequelize');
const { logger } = require('../utils/logger');
const { APIError } = require('../utils/api-errors');

module.exports = async (err, req, res, next) => {
  // log any kind of error
  if (process.env.NODE_ENV === 'development') {
    logger.log({
      date: new Date().toISOString(),
      level: 'error',
      env: process.env.NODE_ENV,
      client: req.connection.remoteAddress,
      method: req.method,
      api: req.url,
      name: err.name,
      message: err.message,
      stack: err.stack,
    });
  }
  // catch all api errors
  if (err instanceof APIError) {
    return res.status(err.status).send({ status: false, message: err.message });
  }
  // catch all sequelize errors
  if (err instanceof db.ConnectionRefusedError) {
    return res.status(500).send({ status: false, message: 'Could not connect to database!' });
  } if (err instanceof db.ConnectionError) {
    return res.status(408).send({ status: false, message: 'Connection timed out!' });
  } if (err instanceof db.ForeignKeyConstraintError) {
    return res.status(409).send({ status: false, message: 'Failed to insert data!' });
  } if (err instanceof db.UniqueConstraintError) {
    return res.status(409).send({ status: false, message: err.errors[0].message });
  }
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).send({ status: false, message: 'Invalid token' });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).send({ status: false, message: 'Token expired' });
  }
  // connect all errors
  return res.status(500).send({ status: false, message: err.message });
};
