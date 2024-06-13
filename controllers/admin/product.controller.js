const Product = require("../../models/product.model");
const paginationHelper = require("../../helpers/pagination.helper");

module.exports.index = async (req, res) => {
    const find = {
        deleted : false
    }
    const filterStatus = [
        {
            label : "Tất cả",
            value : ""
        },
        {
            label : "Đang hoạt động",
            value : "active"
        },
        {
            label : "Dừng hoạt động",
            value : "inactive"
        },
    ];
    if(req.query.status){
        find.status = req.query.status;
    }
    // Tìm kiếm 
    let keyword = "";
    if(req.query.keyword){
        const regex = new RegExp(req.query.keyword,"i");
        find.title =  regex;
        keyword = req.query.keyword;
    }
    // Hết tìm kiếm

    // Phân trang
    const pagination =  await paginationHelper(req,find);

    // Hết phân trang

    const products = await Product
        .find(find)
        .limit(pagination.limitItems)
        .skip(pagination.skip);


    
    // console.log(products);
    res.render("admin/pages/products/index",{
        pageTitle : "Trang danh sách sản phẩm ",
        products : products,
        keyword : keyword,
        filterStatus : filterStatus,
        pagination:pagination
    }
    );
}