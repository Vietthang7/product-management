const express = require("express");

require('dotenv').config()
const bodyParser = require('body-parser');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const methodOverride = require('method-override');

const database = require("./config/database");
database.connect();

const routeAdmin = require("./routes/admin/index.route");

const routeClient = require("./routes/client/index.route");
const systemConfig = require("./config/system");
const app = express();
const port = process.env.PORT;

//Flash
// app.use(cookieParser('HHKALKS'));
// app.use(session({cookie:{maxAge:60000}}));
// app.use(flash());
app.use(cookieParser('HHKALKS'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
app.use(methodOverride('_method'));
//End Flash
app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.static('public'));
// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));


app.locals.prefixAdmin = systemConfig.prefixAdmin;// chỉ dùng trong các file pug
routeClient.index(app);


routeAdmin.index(app);


app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});