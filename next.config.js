module.exports = {
    generateEtags: false,
    publicRuntimeConfig: {
        listSyncInterval: parseInt(process.env.LIST_SYNC_INTERVAL, 10),
        statusSyncInterval: parseInt(process.env.STATUS_SYNC_INTERVAL, 10),
    },
};
