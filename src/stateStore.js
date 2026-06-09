const fs = require("fs");
const path = require("path");

const statePath = path.join(
    __dirname,
    "..",
    "state",
    "last_positions.json"
);

function loadState() {
    if (!fs.existsSync(statePath)) {
        return {};
    }

    const content = fs.readFileSync(
        statePath,
        "utf8"
    );

    if (!content.trim()) {
        return {};
    }

    return JSON.parse(content);
}

function saveState(state) {
    fs.writeFileSync(
        statePath,
        JSON.stringify(state, null, 4)
    );
}

module.exports = {
    loadState,
    saveState
};
