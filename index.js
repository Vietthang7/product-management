const express = require("express");

const routeClient = require("./routes/client/index.route");


const app = express();
const post = 3000;

app.set("views","./views");
app.set("view engine", "pug");

routeClient.index(app);

app.listen(post, () => {
    console.log(`App listening on port ${post}`);
});

