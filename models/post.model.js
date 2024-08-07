const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const postList = new mongoose.Schema({
    title: String,
    post_category_id: String,
    description: String,
    thumbnail: String,
    featured : String,
    status: String,
    position: Number,
    createdBy: String,
    updatedBy: String,
    deleted: {
        type: Boolean,
        default: false
    },
    deletedBy:String,
    slug :{
        type:String,
        slug:"title",
        unique:true
    }
},{
    timestamps: true
});
const Post = mongoose.model('Post', postList, "posts");

module.exports = Post;