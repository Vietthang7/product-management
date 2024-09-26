const express = require("express");
require('dotenv').config();
const bodyParser = require('body-parser');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const methodOverride = require('method-override');
const path = require('path');
const http = require('http');
const { Server } = require("socket.io");
const database = require("./config/database");
database.connect();

const routeAdmin = require("./routes/admin/index.route");

const routeClient = require("./routes/client/index.route");
const systemConfig = require("./config/system");
const Order = require("./models/order.model");
const app = express();
const port = process.env.PORT;
//SocketIO
const server = http.createServer(app);
const io = new Server(server);
global._io = io;
//Flash
app.use(cookieParser('HHKALKS'));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());
//End Flash
app.use(methodOverride('_method'));

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
app.use(express.static(`${__dirname}/public`));
// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.locals.prefixAdmin = systemConfig.prefixAdmin;// chỉ dùng trong các file pug

app.post('/callback', async (req, res) => {
  const { orderId, resultCode } = req.body;
  if(resultCode == 0){
  await Order.updateOne({
    _id: orderId
  }, {
    payment : "paid"
  })
}
})
routeClient.index(app);


routeAdmin.index(app);

app.get("*", (req, res) => {
  res.render("client/pages/errors/404", {
    pageTitle: "404 Not Found"
  });
});
server.listen(port, () => {
  console.log(`App listening on port ${port}`);
});