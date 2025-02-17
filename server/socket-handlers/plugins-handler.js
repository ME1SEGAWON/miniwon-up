const { checkLogin } = require("../util-server");
const { PluginManager } = require("../plugins-manager");

/**
 * Handlers for plugins
 * @param {Socket} socket Socket.io instance
 * @param {UptimeKumaServer} server
 */
module.exports.pluginsHandler = (socket, server) => {

    const pluginManager = server.getPluginManager();

    // Get Plugin List
    socket.on("getPluginList", async (callback) => {
        try {
            checkLogin(socket);

            if (PluginManager.disable) {
                throw new Error("Plugin Disabled: In order to enable plugin feature, you need to use the default data directory: ./data/");
            }

            let pluginList = await pluginManager.fetchPluginList();
            callback({
                ok: true,
                pluginList,
            });
        } catch (error) {
            callback({
                ok: false,
                msg: error.message,
            });
        }
    });

    socket.on("installPlugin", async (repoURL, name, callback) => {
        try {
            checkLogin(socket);
            pluginManager.downloadPlugin(repoURL, name);
            await pluginManager.loadPlugin(name);
            callback({
                ok: true,
            });
        } catch (error) {
            callback({
                ok: false,
                msg: error.message,
            });
        }
    });

    socket.on("uninstallPlugin", async (name, callback) => {
        try {
            checkLogin(socket);
            await pluginManager.removePlugin(name);
            callback({
                ok: true,
            });
        } catch (error) {
            callback({
                ok: false,
                msg: error.message,
            });
        }
    });
};
