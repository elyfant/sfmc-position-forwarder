function buildFishingFacilityPayload(position, config) {
    return {
        toolTypeCode: "UNDEFINED",
        geometry: {
            type: "Point",
            coordinates: [
                position.longitude,
                position.latitude
            ]
        },
        setupTime: toIsoUtc(position.gpsDateTime),
        contactEmail: config.contactEmail,
        contactPhone: config.contactPhone,
        toolCount: 1
    };
}

function toIsoUtc(sfmcDateTime) {
    return new Date(
        sfmcDateTime.replace(" ", "T") + "Z"
    ).toISOString();
}

async function sendToBarentsWatch(position, config) {

    const payload =
        buildFishingFacilityPayload(position, config);

    console.log("BARENTSWATCH PAYLOAD:");
    console.log(JSON.stringify(payload, null, 2));

    return {
        success: true,
        dryRun: true
    };
}

module.exports = {
    buildFishingFacilityPayload,
    sendToBarentsWatch
};
