export const authenticate = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ verified: false });
    }
    next();
}