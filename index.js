// express server
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
const { summarizer } = require("./src/routes/routes");
const routes = require("./src/routes/routes");

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/summarizer", routes);

app.get("/health", (req, res) => {
    res.send().json({ status: "ok" });
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})