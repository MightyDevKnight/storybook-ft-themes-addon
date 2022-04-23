// /my-addon/src/register.js

import React from "react";

import { addons, types } from "@storybook/addons";
import { AddonPanel } from "@storybook/components";
import { Icons, IconButton } from "@storybook/components";
import FTPanel from "./FTPanel";

const ADDON_ID = "figmatokentheme";
const PANEL_ID = `${ADDON_ID}/panel`;

// give a unique name for the panel
const MyPanel = () => <div>MyAddon</div>;

addons.register(ADDON_ID, (api) => {
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: "FT theme Addon",
    render: ({ active, key }) => (
      <AddonPanel active={active} key={key}>
        <FTPanel />
      </AddonPanel>
    ),
  });
  addons.register(ADDON_ID, (api) => {
    addons.add(TOOLBAR_ID, {
      type: types.TOOL,
      title: "FT theme Addon",
      match: ({ viewMode }) => !!(viewMode && viewMode.match(/^(story|docs)$/)),
      render: ({ active }) => (
        <IconButton active={active} title="FT theme toolbar">
          <Icons icon="outline" />
        </IconButton>
      ),
    });
  });
});
