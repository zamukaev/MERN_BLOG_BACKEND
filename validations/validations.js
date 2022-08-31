import { body } from "express-validator";
export const loginValidation = [
	body('email').isEmail(),
	body('passwordHash').isLength({ min: 5 }),
]

export const registerValidation = [
	body('fullName').isLength({ min: 3 }),
	body('password').isLength({ min: 5 }),
	body('email').isEmail(),
	body('avatar').optional().isURL()
];

export const postCreateValidation = [
	body('title').isLength({ min: 3 }).isString(),
	body('text').isLength({ min: 3 }).isString(),
	body('tags').optional().isString(),
	body('imageUrl').optional().isString(),
]