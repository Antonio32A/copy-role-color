const { Plugin } = require("powercord/entities");
const { React, getModule } = require("powercord/webpack");
const { inject, uninject } = require("powercord/injector");

const { shorthand } = require("./manifest.json");
const { clipboard } = require("electron");


module.exports = class CopyRoleColor extends Plugin {
    async startPlugin() {
        const Menu = await getModule(["MenuItem"]);
        const { getGuildId } = await getModule(["getLastSelectedGuildId"]);
        const { getGuild } = await getModule(["getGuild"]);
        const DeveloperContextMenu = await getModule(m => m.default && m.default.displayName === "DeveloperContextMenu");

        inject(`${shorthand}-DeveloperContextMenu-default`, DeveloperContextMenu, "default", (args, res) => {
            const role = getGuild(getGuildId()).roles[args[0].id];
            const color = `#${role.color.toString(16).padStart(6, "0")}`;

            res.props.children = [res.props.children];
            res.props.children.push(
                React.createElement(Menu.MenuGroup, null, React.createElement(Menu.MenuItem, {
                    id: shorthand,
                    key: shorthand,
                    label: "Copy Color",
                    action: () => clipboard.writeText(color)
                }))
            );
            return res;
        });
        DeveloperContextMenu.default.displayName = "DeveloperContextMenu";
    }

    pluginWillUnload() {
        uninject(`${shorthand}-DeveloperContextMenu-default`);
    }
}
