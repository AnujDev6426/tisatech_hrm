// responseUtils.js
const successResponse = (message = null,result = "") => {
    return {
      statusCode: 200,
      body: {
        status: true,
        message,
        result,
      },
    };
  };

  module.exports = {
    successResponse,
  };
  