const express = require("express");
const fs = require("fs");
const port = process.env.PORT || 3000;

const app = express();

app.use(express.static("static"));
app.use(express.urlencoded());

const suggestions = [];

app.get("/", (_, res) => {
    let htmldoc = fs.readFileSync("./templates/index.html", "utf8");
    htmldoc = htmldoc.replace("%%%SUGGESTIONS%%%", suggestions.map(s => `<li>${s}</li>`).join(""));
    res.send(htmldoc);
});

app.post("/add-suggestion", (req, res) => {
    const suggestion = req.body.suggestion;
    suggestions.push(suggestion);
    let htmldoc = fs.readFileSync("./templates/index.html", "utf8");
    htmldoc = htmldoc.replace("%%%SUGGESTIONS%%%", suggestions.map(s => `<li>${s}</li>`).join(""));
    res.send(htmldoc);
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
