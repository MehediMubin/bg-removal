import jwt from 'jsonwebtoken'

// Middleware function to decode jwt token to get clerkId

cont authUser = async (req, res, next) => {
  try {
    const {token} = req.headers;

    if (!token) {
      return res.json({
        success: false, 
        message: 'Not Authorized login again'
      })
    }

    const token_decode = jwt.decode(token);
    req.body.clerkId = token_decode.clerkId;
    next();
  } catch (error) {
    console.error("Authentication error:", error)
    res.json({
      success: false,
      message: error.message
    })
  }

}

export default authUser;