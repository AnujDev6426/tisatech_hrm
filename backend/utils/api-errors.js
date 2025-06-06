// eslint-disable-next-line max-classes-per-file
class APIError {
  constructor(status, code, message) {
    this.status = status;
    this.code = code;
    this.message = message;
  }
}

const apiErrors = Object.entries({
  BadRequest: {
    statusCode: 400,
    message: 'Bad Request',
  },
  Unauthorized: {
    statusCode: 401,
    message: 'Unauthorized',
  },
  Forbidden: {
    statusCode: 403,
    message: 'Forbidden',
  },
  NotFound: {
    statusCode: 404,
    message: 'Not found',
  },
  Conflict: {
    statusCode: 409,
    message: 'Conflict',
  },
  UnsupportedMediaType: {
    statusCode: 415,
    message: 'Unsupported Media Type',
  },
  UnprocessableEntity: {
    statusCode: 422,
    message: 'Unprocessable Entity',
  },
  InternalServerError: {
    statusCode: 500,
    message: 'Internal Server Error',
  },
  MethodNotAllowed: {
    statusCode: 405,
    message: 'Method Not Allowed',
  },
}).reduce((map, [name, data]) => {
  map[`${name}Error`] = map[name] = class extends APIError {
    constructor(message = data.message) {
      super(data.statusCode, name, message);
    }
  };
  return map;
}, {});

module.exports = {
  ...apiErrors,
  APIError,
};
