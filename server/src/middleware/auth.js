const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    console.log('Auth middleware - Request URL:', req.url);
    console.log('Auth middleware - Request method:', req.method);
    console.log('Auth middleware - Headers:', req.headers);
    
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    console.log('Auth middleware - Token received:', token ? 'present' : 'missing');
    
    if (!token) {
      console.log('Auth middleware - No token provided');
      return res.status(401).json({ 
        success: false,
        error: 'No token, authorization denied' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Auth middleware - Token decoded successfully:', { userId: decoded.userId || decoded.id });
    
    // Add user to request
    req.user = {
      id: decoded.userId || decoded.id // Handle both token formats
    };
    
    console.log('Auth middleware - User added to request:', req.user);
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(401).json({ 
      success: false,
      error: 'Token is not valid' 
    });
  }
};

module.exports = auth; 