const themesData = require("../../data/themesData")


let exportedModules = {
    async scheduledMessage(client) {
        // const channel = await Client.channels.cache.get("759030440475754497"); //main channel
        const channel = await client.channels.cache.get("759027798542385164"); //for testing
        const scheduledMessage = await themesData.scheduledMessage(channel);
    },
}

module.exports = exportedModules;