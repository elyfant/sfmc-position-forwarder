const { sendToBarentsWatch } = require("./barentswatchClient");

async function forwardPosition(position, config) {

    console.log(
        `Forwarding position for ${position.gliderName}...`
    );

    const targets = [];

    if (config.barentswatch?.enabled) {

        console.log(
            "BarentsWatch forwarding enabled."
        );

        targets.push(
            sendToBarentsWatch(
                position,
                config.barentswatch
            )
        );

    } else {

        console.log(
            "BarentsWatch forwarding disabled."
        );
    }

    await Promise.all(targets);

    console.log(
        `Finished forwarding position for ${position.gliderName}.`
    );
}

module.exports = {
    forwardPosition
};
