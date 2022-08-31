import jwt from "jsonwebtoken"

const checkAuth = (req, res, next) => {
	const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

	if (token) {
		try {
			const decoded = jwt.verify(token, 'secret123');
			req.userId = decoded._id;
			next();
		} catch (error) {
			res.status(403).json({
				message: 'zutritt nicht gestattet!!!'
			});
		}

	} else {
		return res.status(403).json({
			message: 'zutritt nicht gestattet!!!'
		});
	}
}
export default checkAuth
