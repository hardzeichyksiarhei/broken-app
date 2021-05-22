class AppError extends Error {
    constructor(message, statusCode, code) {
      super(message);
  
      this.statusCode = statusCode;
      this.status = String(statusCode).startsWith('4') ? 'FAIL' : 'ERROR';
      this.code = code;
      
      this.isOperational = true;
      
      Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;