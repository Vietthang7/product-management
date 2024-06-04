const express = require("express");
const app = express();
const post = 3000;

app.get("/", (req, res) => {
    res.send("Trang chủ");
});

app.get("/products", (req, res) => {
    res.send("Trang danh sách sản phẩm");
});

app.listen(post, () => {
    console.log(`App listening on port ${post}`);
});