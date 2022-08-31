import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors'
import { registerValidation, loginValidation, postCreateValidation } from './validations/validations.js';
import { handelValidationErrors, checkAuth } from './utils/index.js';

import { PostController, UserController } from './Cotroller/index.js'
mongoose.connect('mongodb+srv://muslim:pisyuka1@cluster0.6brpj.mongodb.net/blog?retryWrites=true&w=majority')
	.then(() => console.log('DB conected'))
	.catch((err) => console.log('DB not conected', err))

const app = express();

const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		cb(null, 'uploads');
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname);
	}
});

const upload = multer({ storage });
app.use('/uploads', express.static('uploads'));
app.use(cors())
app.use(express.json());

app.post('/auth/register', registerValidation, handelValidationErrors, UserController.register);
app.post('/auth/login', loginValidation, UserController.login);
app.get('/auth/me', checkAuth, UserController.authMe);


app.get('/tags', PostController.getLastTags);
app.get('/posts/tags/:tag', PostController.getPostsWithTag)
app.get('/posts', PostController.getAll);
app.get('/popular', PostController.popular)
app.get('/posts/:id', PostController.getOne);

app.post('/upload', checkAuth, upload.single('image'), PostController.upload);
app.post('/posts', checkAuth, postCreateValidation, handelValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, postCreateValidation, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, handelValidationErrors, PostController.update);

app.listen(4444, (err) => {
	if (err) {
		return console.log(err);
	}
	console.log('Server working');
});