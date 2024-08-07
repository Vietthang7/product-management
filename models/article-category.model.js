const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const ArticleCategoryShema = new mongoose.Schema({
    title: String,
    parent_id:{
      type:String,
      default:""
    },
    description: String,
    thumbnail: String,
    status: String,
    position: Number,
    createdBy:String,
    updatedBy:String,
    deletedBy:String,
    deleted: {
        type: Boolean,
        default: false
    },
    slug :{
        type:String,
        slug:"title",
        unique:true
    }
},{
    timestamps: true // Tự động thêm trường createdAt và updatedAt (https://mongoosejs.com/docs/timestamps.html)
});
const ArticleCategory = mongoose.model('ArticleCategory', ArticleCategoryShema, "article-category");

module.exports = ArticleCategory;