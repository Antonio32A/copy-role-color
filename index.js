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
            const hex = role.color.toString(16).padStart(6, "0");
            const rgb = toRGB(hex);

            res.props.children = [
                res.props.children,
                React.createElement(Menu.MenuGroup, null, React.createElement(Menu.MenuItem, {
                    id: shorthand + "-hex",
                    label: "Copy Color (HEX)",
                    action: () => clipboard.writeText("#" + hex)
                })),
                React.createElement(Menu.MenuGroup, null, React.createElement(Menu.MenuItem, {
                    id: shorthand + "-rgb",
                    label: "Copy Color (RGB)",
                    action: () => clipboard.writeText(rgb)
                }))
            ];
            return res;
        });
        DeveloperContextMenu.default.displayName = "DeveloperContextMenu";
    }

    pluginWillUnload() {
        uninject(`${shorthand}-DeveloperContextMenu-default`);
    }
}

const toRGB = hex => {
    const rgb = hex.match(/.{1,2}/g);
    return `rgb(${parseInt(rgb[0], 16)}, ${parseInt(rgb[1], 16)}, ${parseInt(rgb[2], 16)})`;
};