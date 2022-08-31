import Jwt from 'jsonwebtoken';
import UserModel from '../models/User.js'
import bcrypt from 'bcrypt';

export const register = async (req, res) => {
	try {
		const password = req.body.password;
		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(password, salt)
		const doc = new UserModel({
			email: req.body.email,
			fullName: req.body.fullName,
			avatarUrl: req.body.avatarUrl,
			passwordHash: hash,
		});
		const user = await doc.save();
		const token = Jwt.sign(
			{
				_id: user._id,
			},
			'secret123',
			{
				expiresIn: '30d',
			}
		);
		const { passwordHash, ...userData } = user._doc;
		res.json({
			...userData,
			token
		});
	} catch (error) {
		res.status(500).json({
			message: error.message
		});
	}
}
export const login = async (req, res) => {

	try {
		const user = await UserModel.findOne({ email: req.body.email });
		if (!user) {
			return res.status(404).json({
				message: 'Benutzer nicht gefunden',
			});
		}
		const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
		if (!isValidPass) {
			return res.status(404).json({
				message: 'password oder login ist falsch'
			});
		}
		const token = Jwt.sign(
			{
				_id: user._id,
			},
			'secret123',
			{
				expiresIn: '30d',
			}
		);
		const { passwordHash, ...userData } = user._doc;
		res.json({
			...userData,
			token
		});

	} catch (error) {
		res.status(500).json({
			message: message.error,
		})
	}
}
export const authMe = async (req, res) => {
	try {
		const user = await UserModel.findById(req.userId);
		if (!user) {
			res.status(404).json({
				message: 'nicht gefunden'
			})
		}
		const { passwordHash, ...userdata } = user._doc;
		res.json(userdata)
	} catch (error) {
		res.status(500).json({
			message: message.error,
		});
	}
}