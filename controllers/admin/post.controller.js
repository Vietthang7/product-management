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
