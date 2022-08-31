import PostModel from '../models/Post.js';

export const getAll = async (req, res) => {
	try {
		const posts = await PostModel.find().sort({ createdAt: -1 }).populate('user').exec();
		res.json(posts)
	} catch (error) {
		res.status(500).json({
			message: error.message
		});
	}
}
export const getOne = async (req, res) => {
	console.log(req.params.id)
	try {
		const postId = req.params.id;
		PostModel.findOneAndUpdate(
			{
				_id: postId
			},
			{
				$inc: { viewsCount: 1 },
			}, {
			returnDocument: 'after',
		},
			(err, doc) => {
				if (err) {
					return res.status(500).json({
						message: 'post konnte nicht zurück gegeben werden!!!'
					});
				}
				if (!doc) {
					return res.status(400).json({
						message: 'post konnte nicht zurück gefunden werden!!!'
					});
				}
				res.json(doc)
			}
		).populate('user')
	} catch (error) {
		res.status(500).json({
			message: error.message
		});
	}
}
export const create = async (req, res) => {
	try {
		const doc = new PostModel({
			title: req.body.title,
			text: req.body.text,
			tags: req.body.tags.split(','),
			imageUrl: req.body.imageUrl,
			user: req.userId
		});

		const post = await doc.save();
		res.json(post);
	} catch (error) {
		res.status(500).json({
			message: error.message
		});
	}
}
export const update = async (req, res) => {
	try {
		const postId = req.params.id;
		await PostModel.updateOne(
			{
				_id: postId
			},
			{
				title: req.body.title,
				text: req.body.text,
				tags: req.body.tags.split(','),
				imageUrl: req.body.imageUrl,
				user: req.userId
			}
		)
		res.json({
			success: true
		});
	} catch (error) {
		res.status(500).res.json({
			message: error.message
		});
	}
}
export const remove = (req, res) => {
	try {
		const userId = req.params.id;
		PostModel.findOneAndDelete(
			{
				_id: userId
			}, (err, doc) => {
				if (err) {
					return res.status(500).json({
						message: 'Post konnte nich gelöscht werden!'
					});
				}
				if (!doc) {
					return res.status(404).json({
						message: 'Post nicht gefunden!!!'
					});
				}
				res.json({
					success: true
				})
			}
		)
	} catch (error) {
		res.status(500).json({
			message: error.message
		});
	}

}
export const getLastTags = async (req, res) => {
	try {
		const posts = await PostModel.find().limit(5).exec();
		const tags = posts.map(obj => obj.tags).flat().slice(0, 5);
		res.json(tags);
	} catch (error) {
		res.status(500).json({
			message: error.message
		});
	}
}
export const upload = async (req, res) => {
	res.json({
		url: `/uploads/${req.file.originalname}`
	})
}
export const popular = async (req, res) => {
	try {
		const posts = await PostModel.find().sort({ viewsCount: -1 }).populate('user').exec();
		res.json(posts)
	} catch (error) {
		res.status(500).json({
			message: error.message
		});
	}
}
export const getPostsWithTag = async (req, res) => {
	try {
		const postTag = req.params.tag;
		const posts = await PostModel.find({ tags: postTag });
		res.json(posts);
	} catch (error) {
		res.status(500).json({
			message: error.message
		});
	}
}