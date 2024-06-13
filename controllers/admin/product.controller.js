const Product = require("../../models/product.model");

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
    const pagination = {
        currentPage : 1,
        limitItems : 4
    };
    if(req.query.page){
        pagination.currentPage = parseInt(req.query.page);
    }
    pagination.skip = (pagination.currentPage-1)*pagination.limitItems;
    
    const countProducts = await Product.countDocuments(find);
    const totalPage = Math.ceil(countProducts/pagination.limitItems);
    pagination.totalPage = totalPage;

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