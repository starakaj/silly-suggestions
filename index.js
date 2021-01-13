const express = require("express");
const fs = require("fs");
const port = process.env.PORT || 0;

const app = express();

app.use(express.static("static"));
app.use(express.urlencoded({ extended: true }));

const locations = [
    {
        name: "hallway",
        template: "hallway.html"
    }
];

// Game state
let inventory = [];
let lastLocation = undefined;

function makeContent(title, text, options) {
    let htmldoc = fs.readFileSync("./templates/index.html", "utf8");
    htmldoc = htmldoc.replace("%%%TITLE%%%", title);
    htmldoc = htmldoc.replace("%%%TEXT%%%", text);
    htmldoc = htmldoc.replace("%%%OPTIONS%%%", options.map(option => `<li>${option}</li>`).join(""));
    return htmldoc;
}

app.get("/", (_, res) => {
    inventory = [];
    lastLocation = "hallway";
    res.redirect("/hallway");
});

app.get("/hallway", (req, res) => {

    lastLocation = "hallway";
    options = [
        "<a href=/big>Go left to the big room</a>",
        "<a href=/small>Go right to the small room</a>"
    ];
    options.push("<a href=/inventory>Check your inventory</a>");
    res.send(
        makeContent(
            "Hallway",
            "You're standing in the hallway. To your left is a big room. To your right is a small room.",
            options
        )
    );
});

app.get("/big", (_, res) => {
    lastLocation = "big";
    let options = ["<a href=/hallway>Go back to the hallway</a>"];
    options.push("<a href=/unlock>Open the door</a>");
    options.push("<a href=/inventory>Check your inventory</a>");
    res.send(
        makeContent(
            "Big room",
            "You're standing in a big room. It's so big! Echo! There's a heavy looking door in here.",
            options
        )
    );
});

app.get("/small", (_, res) => {
    lastLocation = "small";
    let options = ["<a href=/hallway>Go back to the hallway</a>"];
    let text = "You're standing in a small room. Actually, it's so small you're not standing, you're crouching.";
    if (inventory.length === 0) {
        text += " There's a shiny key on the floor.";
        options.push("<a href=/key>Pick up the key</a>");
    }
    options.push("<a href=/inventory>Check your inventory</a>");
    res.send(
        makeContent(
            "Small room",
            text,
            options
        )
    );
});

app.get("/inventory", (_, res) => {
    let text = "There is nothing in your inventory!";
    if (inventory.length > 0) {
        text = "You have a key in your inventory";
    }
    let returnAddress = "hallway";
    if (!!lastLocation) returnAddress = lastLocation;
    res.send(
        makeContent(
            "Inventory",
            text,
            [
                `<a href=/${returnAddress}>Back whence you came</a>`,
            ]
        )
    )
});

app.get("/key", (_, res) => {
    let text = "You picked up the key!";
    if (inventory.length === 0) {
        inventory.push("key");
    } else {
        text = "You already have the key";
    }
    let returnAddress = "hallway";
    if (!!lastLocation) returnAddress = lastLocation;
    res.send(
        makeContent(
            "Got item",
            text,
            [
                `<a href=/${returnAddress}>Back whence you came</a>`,
            ]
        )
    )
});

app.get("/unlock/", (_, res) => {
    let text;
    let returnAddress = "hallway";
    let options;
    if (!!lastLocation) returnAddress = lastLocation;
    
    // if you have the key
    if (inventory.length > 0) {
        text = "You did it! The heavy door latches open with a loud clunk, and swings open dramatically. You've escaped the labyrinth.";
        options = [`<a href=/>Start over</a>`];
    } else {
        text = "You can't unlock the door without a key";
        options = [`<a href=/${returnAddress}>Back whence you came</a>`];
    }
    res.send(
        makeContent(
            inventory.length > 0 ? "Victory!" : "Nice try",
            text,
            options
        )
    )
});

let server = app.listen(port, () => {
    let boundPort = server.address().port;
    console.log(`Listening on port ${boundPort}, visit http://localhost:${boundPort}`);
});
