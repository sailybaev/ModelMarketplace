const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const modelsRoutes = require("./routes/models");

const app = express();
app.use(bodyParser.json());

app.use("/models", modelsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
