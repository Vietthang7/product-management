const Post = require("../../models/post.model");
const ArticleCategory = require("../../models/article-category.model");
// [GET] /posts
module.exports.index = async (req, res) => {
  const posts = await Post
    .find({
      status: "active",
      deleted: false
    })
    .sort({
      position: "desc"
    });
  res.render("client/pages/posts/index", {
    pageTitle: "Danh sách bài viết",
    posts: posts
  });
}
// [GET] /posts/:slungCategory
module.exports.category = async (req, res) => {
  const slugCategory = req.params.slugCategory;
  const category = await ArticleCategory.findOne({
    slug: slugCategory,
    status: "active",
    deleted: false
  });
  const allSubCategory = [];
  const getSubCategory = async (currentId) => {
    const SubCategory = await ArticleCategory.find({
      parent_id: currentId,
      status: "active",
      deleted: false
    });
    for (const sub of SubCategory) {
      allSubCategory.push(sub.id);
      await getSubCategory(sub.id);
    }
  }
  await getSubCategory(category.id);
  const posts = await Post
    .find({
      post_category_id: {
        $in: [
          category.id,
          ...allSubCategory
        ]
      },
      status: "active",
      deleted: false
    })
    .sort({
      position: "desc"
    });
  res.render("client/pages/posts/index", {
    pageTitle: category.title,
    posts: posts
  });
}
// [GET] /posts/detail/slug
module.exports.detail = async (req, res) => {
  const slug = req.params.slug;

  const post = await Post.findOne({
    slug: slug,
    deleted: false,
    status: "active"
  });
  if (post) {
    res.render("client/pages/posts/detail", {
      pageTitle: "Nội dung bài viết",
      post: post
    });
  } else {
    res.redirect("/");
  }
}