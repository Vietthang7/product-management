const createTreeHelper = require("../../helpers/createTree.helper");
const moment = require("moment");
const Account = require("../../models/accounts.model");
const paginationHelper = require("../../helpers/pagination.helper");
const systemConfig = require("../../config/system");
const Post = require('../../models/post.model');
const ArticleCategory = require("../../models/article-category.model");
// [GET] /admin/posts
module.exports.index = async (req, res) => {
  const find = {
    deleted: false
  }
  const filterStatus = [{
    label: "Tất cả",
    value: ""
  },
  {
    label: "Đang hoạt động",
    value: "active"
  },
  {
    label: "Dừng hoạt động",
    value: "inactive"
  },
  ];
  if (req.query.status) {
    find.status = req.query.status;
  }
  // Tìm kiếm 
  let keyword = "";
  if (req.query.keyword) {
    const regex = new RegExp(req.query.keyword, "i");
    find.title = regex;
    keyword = req.query.keyword;
  }
  // Hết tìm kiếm

  // Phân trang
  const pagination = await paginationHelper.paginationPost(req, find);

  // Hết phân trang
  //Sắp xếp
  const sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.position = "desc";
  }
  // Hết sắp xếp
  const posts = await Post
    .find(find)
    .limit(pagination.limitItems) // số lượng tối thiểu 
    .skip(pagination.skip) // bỏ qua
    .sort(sort);

  for (const item of posts) {
    if (item.createdBy) {
      const accountCreated = await Account.findOne({
        _id: item.createdBy
      });
      item.createdByFullName = accountCreated.fullName;
    } else {
      item.createdByFullName = "";
    }
    item.createdAtFormat = moment(item.createdAt).format("DD/MM/YY HH:mm:ss");
    // Người cập nhật
    if (item.updatedBy) {
      const accountUpdated = await Account.findOne({
        _id: item.updatedBy
      });
      item.updatedByFullName = accountUpdated.fullName;
    } else {
      item.updatedByFullName = "";
    }

    item.updatedAtFormat = moment(item.updatedAt).format("DD/MM/YY HH:mm:ss");
  }
  res.render("admin/pages/posts/index", {
    pageTitle: "Trang danh sách bài viết",
    posts: posts,
    keyword: keyword,
    filterStatus: filterStatus,
    pagination: pagination
  });
}
// [GET] /admin/posts/create
module.exports.create = async (req, res) => {
  const categories = await ArticleCategory.find({
    deleted: false
  });
  const newCategories = createTreeHelper(categories);
  res.render("admin/pages/posts/create", {
    pageTitle: "Thêm mới bài viết",
    categories: newCategories
  });
}
// [POST] /admin/posts/create
module.exports.createPost = async (req, res) => {
  if (res.locals.role.permissions.includes("posts_create")) {
    if (req.body.position) {
      req.body.position = parseInt(req.body.position);
    } else {
      const countPosts = await Post.countDocuments({});
      req.body.position = countPosts + 1;
    }
    req.body.createdBy = res.locals.account.id;
    const newPost = new Post(req.body);
    await newPost.save();
    res.redirect(`/${systemConfig.prefixAdmin}/posts`);
  } else {
    res.send("403");
  }
}
// [GET] /admin/posts/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Post.findOne({
      _id: id,
      deleted: false
    });
    if (post) {
      res.render("admin/pages/posts/detail", {
        pageTitle: "Chi tiết sản phẩm",
        post: post
      });
    } else {
      res.redirect(`${systemConfig.prefixAdmin}/posts`);
    }
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/posts`);
  }
}
// [GET] /admin/posts/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Post.findOne({
      _id: id,
      deleted: false
    });
    if (post) {
      const categories = await ArticleCategory.find({
        deleted: false
      });
      const newCategories = createTreeHelper(categories);
      res.render("admin/pages/posts/edit", {
        pageTitle: "Chỉnh sửa bài viết",
        post: post,
        categories: newCategories
      });
    } else {
      res.redirect(`/${systemConfig.prefixAdmin}/posts`);
    }
  } catch (error) {
    res.redirect(`/${systemConfig.prefixAdmin}/posts`);
  }
}
// [PATCH] /admin/posts/edit/:id
module.exports.editPatch = async (req, res) => {
  if (res.locals.role.permissions.includes("posts_edit")) {
    try {
      const id = req.params.id;

      req.body.price = parseInt(req.body.price);
      req.body.discountPercentage = parseInt(req.body.discountPercentage);
      req.body.stock = parseInt(req.body.stock);
      if (req.body.position) {
        req.body.position = parseInt(req.body.position);
      } else {
        const countPosts = await Post.countDocuments({});
        req.body.position = countPosts + 1;
      }
      req.body.updatedBy = res.locals.account.id;
      await Post.updateOne({
        _id: id,
        deleted: false
      }, req.body);
      req.flash("success", "Cập nhật bài viết thành công!");

    } catch (error) {
      req.flash("error", "Id bài viết không hợp lệ !");
    }
    res.redirect("back");
  } else {
    res.send(`403`);
  }
}
//[PATCH]/admin/posts/delete/:id
module.exports.deleteItem = async (req, res) => {
  if (res.locals.role.permissions.includes("posts_delete")) {
    try {
      const id = req.params.id;
      await Post.updateOne({
        _id: id
      }, {

        deleted: true,
        deletedBy: res.locals.account.id
      });
      req.flash('success', 'Đã chuyển vào thùng rác!');
      res.json({
        code: 200
      })
    } catch (error) {
      res.redirect(`/${systemConfig.prefixAdmin}/posts`);
    }
  } else {
    res.send(`403`);
  }
}
// [PATCH] /admin/posts/change-status/:statusChange/:id
module.exports.changeStatus = async (req, res) => {
  if (res.locals.role.permissions.includes("posts_edit")) {
    try {
      const {
        id,
        statusChange
      } = req.params;
      await Post.updateOne({
        _id: id

      }, {
        status: statusChange
      });
      req.flash('success', 'Cập nhật trạng thái thành công!');

      res.json({
        code: 200
      });
    } catch (error) {
      res.redirect(`/${systemConfig.prefixAdmin}/posts`);
    }
    // res.json() trả về api
    // res.redirect trả về route
    // res.render trả về file pug
  }
  else {
    res.send(`403`);
  }
}
// [PATCH] /admin/posts/change-multi
module.exports.changeMulti = async (req, res) => {
  if (res.locals.role.permissions.includes("posts_edit")) {
    try {
      const {
        status,
        ids
      } = req.body;
      switch (status) {
        case "active":
        case "inactive":
          await Post.updateMany({
            _id: ids
          }, {
            status: status
          });
          req.flash('success', 'Cập nhật trạng thái thành công!');
          break;
        case "delete":
          await Post.updateMany({
            _id: ids
          }, {
            deleted: true
          });
          req.flash('success', 'Đã chuyển vào thùng rác!');
        default:
          break;
      }
      res.json({
        code: 200
      });
    } catch (error) {
      res.redirect(`/${systemConfig.prefixAdmin}/posts`);
    }
  } else {
    res.send(`403`);
  }
}
// [PATCH]/admin/posts/change-position/:id
module.exports.changePosition = async (req, res) => {
  if (res.locals.role.permissions.includes("posts_edit")) {
    try {
      const id = req.params.id;
      const position = req.body.position;
      await Post.updateOne({
        _id: id
      }, {
        position: position
      });
      res.json({
        code: 200
      });
    } catch (error) {
      res.redirect(`/${systemConfig.prefixAdmin}/posts`);
    }
  } else {
    res.send(`403`);
  }
}
// [GET] /admin/posts/trash
module.exports.trash = async (req, res) => {
  const find = {
    deleted: true
  }
  const filterStatus = [{
    label: "Tất cả",
    value: ""
  }, {
    label: "Đang hoạt động",
    value: "active"
  }, {
    label: "Dừng hoạt động",
    value: "inactive"
  },
  ];
  if (req.query.status) {
    find.status = req.query.status;
  }
  // Tìm kiếm 
  let keyword = "";
  if (req.query.keyword) {
    const regex = new RegExp(req.query.keyword, "i");
    find.title = regex;
    keyword = req.query.keyword;
  }
  // Hết tìm kiếm

  // Phân trang
  const pagination = await paginationHelper.paginationPost(req, find);
  // Hết phân trang
  //Sắp xếp
  const sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.position = "desc";
  }
  // Hết sắp xếp
  const posts = await Post
    .find(find)
    .limit(pagination.limitItems) // số lượng tối thiểu 
    .skip(pagination.skip) // bỏ qua
    .sort(sort);
  for (const item of posts) {
    if (item.createdBy) {
      const accountCreated = await Account.findOne({
        _id: item.createdBy
      });
      item.createdByFullName = accountCreated.fullName;
    } else {
      item.createdByFullName = "";
    }
    item.createdAtFormat = moment(item.createdAt).format("DD/MM/YY HH:mm:ss");
    if (item.updatedBy) {
      const accountUpdated = await Account.findOne({
        _id: item.updatedBy
      });
      item.updatedByFullName = accountUpdated.fullName;
    } else {
      item.updatedByFullName = "";
    }

    item.updatedAtFormat = moment(item.updatedAt).format("DD/MM/YY HH:mm:ss");
    if (item.deletedBy) {
      const accountDeleted = await Account.findOne({
        _id: item.deletedBy
      });
      item.deletedByFullName = accountDeleted.fullName;
    } else {
      item.deletedByFullName = "";
    }

    item.updatedAtFormat = moment(item.updatedAt).format("DD/MM/YY HH:mm:ss");
  }
  res.render("admin/pages/posts/trash", {
    pageTitle: "Trang thùng rác",
    posts: posts,
    keyword: keyword,
    filterStatus: filterStatus,
    pagination: pagination
  });
}
// [PATCH] /admin/posts/trash/restore/:id
module.exports.restore = async (req, res) => {
  if (res.locals.role.permissions.includes("posts_edit")) {
    try {
      const id = req.params.id;
      await Post.updateOne({
        _id: id

      }, {
        deleted: false,
        updatedBy: res.locals.account.id
      });
      req.flash('success', 'Khôi phục thành công!');

      res.json({
        code: 200
      });
    } catch (error) {
      res.redirect(`/${systemConfig.prefixAdmin}/posts/trash`);
    }
  }
  else {
    res.send(`403`);
  }
}
// [PATCH] /admin/posts/trash/change-multi
module.exports.changeMultiRestore = async (req, res) => {
  if (res.locals.role.permissions.includes("posts_edit")) {
    try {
      const {
        acts,
        ids
      } = req.body;
      switch (acts) {
        case "restore":
          await Post.updateMany({
            _id: ids
          }, {
            deleted: false
          });
          req.flash('success', 'Khôi phục thành công!');
          break;
        case "delete-permanently":
          await Post.deleteMany({
            _id: ids
          });
          req.flash('success', 'Đã xóa khỏi thùng rác!');
          break;
        default:
          break;
      }
      res.json({
        code: 200
      });
    } catch (error) {
      res.redirect(`/${systemConfig.prefixAdmin}/posts/trash`);
    }
  } else {
    res.send(`403`);
  }
}
// [GET] /admin/posts/trash/detail/:id
module.exports.detailTrash = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Post.findOne({
      _id: id,
      deleted: true
    });
    if (post) {
      res.render("admin/pages/posts/detail", {
        pageTitle: "Chi tiết sản phẩm",
        post: post
      });
    } else {
      res.redirect(`${systemConfig.prefixAdmin}/posts/trash`);
    }
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/posts/trash`);
  }
}
// [DELETE] /admin/posts/trash/deletePermanently/:id
module.exports.deletePermanently = async (req, res) => {
  if (res.locals.role.permissions.includes("posts_delete")) {
    try {
      const id = req.params.id;
      await Post.deleteOne({
        _id: id

      }, {
        deleted: true
      });
      req.flash('success', 'Đã xóa khỏi thùng rác!');

      res.json({
        code: 200
      });
    } catch (error) {
      res.redirect(`/${systemConfig.prefixAdmin}/posts/trash`);
    }
  }
  else {
    res.send(`403`);
  }
}