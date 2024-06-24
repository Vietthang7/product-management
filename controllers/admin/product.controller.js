const Product = require("../../models/product.model");
const paginationHelper = require("../../helpers/pagination.helper");

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
    const pagination = await paginationHelper(req, find);

    // Hết phân trang

    const products = await Product
        .find(find)
        .limit(pagination.limitItems) // số lượng tối thiểu 
        .skip(pagination.skip) // bỏ qua
        .sort({
            position : "desc"
        });



    // console.log(products);
    res.render("admin/pages/products/index", {
        pageTitle: "Trang danh sách sản phẩm ",
        products: products,
        keyword: keyword,
        filterStatus: filterStatus,
        pagination: pagination
    });
}
// [PATCH] /admin/products/change-status/:statusChange/:id
module.exports.changeStatus = async (req, res) => {
    const {
        id,
        statusChange
    } = req.params;
    await Product.updateOne({
        _id: id

    }, {
        status: statusChange
    });
    req.flash('success', 'Cập nhật trạng thái thành công!');

    res.json({
        code: 200
    });
    // res.json() trả về api
    // res.redirect trả về route
    // res.render trả về file pug
}
// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    const {
        status,
        ids
    } = req.body;
    switch(status){
        case "active" :
        case "inactive":
            await Product.updateMany({
                _id : ids
            },{
                status : status 
            });
            break;
        case "delete" :
            await Product.updateMany({
                _id : ids
            },{
                deleted : true

            });
        default :
            break;

    }
    res.json({
        code: 200
    });
}
//[PATCH]/admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    await Product.updateOne({
        _id: id
    }, {

        deleted: true
    });
    res.json({
        code: 200
    });
}
// [PATCH]/admin/products/change-position/:id
module.exports.changePosition = async(req,res)=>{
    const id = req.params.id;
    const position = req.params.position;
    await Product.updateOne({
        _id:id
    },{
        position:position
    });
    res.json({
        code:200
    });
}