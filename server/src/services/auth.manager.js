
const jwt = require('jsonwebtoken');

class AuthManager {
    constructor(secret) {
        this.secret = secret;
    }

    login(user) {
        const payload = {
            userId: user._id,
            username: user.username
        };
        const token = jwt.sign(payload, this.secret, { expiresIn: '1h' });
        return token;
    }

    logout() {
        // For JWT, logout is typically handled on the client-side by deleting the token.
        // This function is a placeholder for any server-side logout logic.
        return true;
    }

    isAuthenticated(req, res, next) {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Authentication failed: No token provided.' });
        }

        try {
            const decodedToken = jwt.verify(token, this.secret);
            req.user = decodedToken;
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Authentication failed: Invalid token.' });
        }
    }
}

module.exports = AuthManager;
