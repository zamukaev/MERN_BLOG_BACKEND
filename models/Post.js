import mongoose from "mongoose";
const PostSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	text: {
		type: String,
		required: true,
	},
	viewsCount: {
		type: Number,
		default: 0,
	},
	tags: {
		type: Array,
		default: []
	},
	comment: Array,
	default: [],
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	imageUrl: String,
}, {
	timestamps: true
}
)

export default mongoose.model('Post', PostSchema)