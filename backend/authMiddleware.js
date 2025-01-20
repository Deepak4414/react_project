// // authMiddleware.js
// const jwt = require("jsonwebtoken"); // Example: JWT authentication

// const authenticateUser = (req, res, next) => {
//   const token = req.cookies?.authToken; // Assuming token is stored in cookies

//   if (!token) {
//     return res.status(401).json({ message: "Unauthorized: Please log in." });
//   }

//   try {
//     // Verify the token (replace "SECRET_KEY" with your JWT secret)
//     const decoded = jwt.verify(token, "SECRET_KEY");
//     req.user = decoded; // Attach user information to the request object
//     next(); // Proceed to the next middleware/route
//   } catch (error) {
//     console.error("Authentication error:", error);
//     return res.status(401).json({ message: "Unauthorized: Invalid token." });
//   }
// };

// module.exports = authenticateUser;
