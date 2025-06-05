export const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    
    // Mongoose validation error
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({ message: 'Validation Error', errors });
    }
    
    // Mongoose duplicate key error
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Duplicate key error', field: err.keyValue });
    }
    
    // JWT error
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    // JWT expired error
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    
    // Default to 500 server error
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Server Error';
    
    res.status(statusCode).json({ message });
  };