import React from "react";
import { API } from "@storybook/api";
import "./panel.css";

const iFrame_Id = "storybook-preview-iframe";

const FTPanel = ({ target }) => {
  const [themeMetaPath, setThemeMetaPath] = React.useState("");
  const [themeMetaData, setThemeMetaData] = React.useState(null);
  const [activeTheme, setActiveTheme] = React.useState(null);

  React.useEffect(() => {
    let targetEl;
    const iframe = document.getElementById(iFrame_Id);
    if (!iframe) {
      return null;
    }

    const iframeDocument =
      iframe.contentDocument || iframe.contentWindow.document;

    switch (target) {
      case "root":
      case "html":
        targetEl = iframeDocument.documentElement;
        break;
      default:
        if (!target || target === "body") {
          targetEl = iframeDocument.body;
        } else {
          targetEl = iframeDocument.documentElement.querySelector(target);
        }
        break;
    }

    if (activeTheme) {
      targetEl.classList.add(activeTheme);
    }

    return () => {
      if (themeMetaData) {
        themeMetaData
          .filter((theme) => theme.class)
          .forEach((theme) => {
            if (typeof theme.class === "string") {
              targetEl.classList.remove(theme.class);
            } else {
              // string[]
              targetEl.classList.remove(...theme.class);
            }
          });
      }
    };
  }, [activeTheme, themeMetaData]);

  const onThemeMetaPathInputChange = React.useCallback((e) => {
    setThemeMetaPath(e.target.value);
  }, []);

  const onOkButtonClick = React.useCallback(async () => {
    const themeMetaDataRaw = await fetch(
      `https://cdn.jsdelivr.net/gh/${themeMetaPath}/dist/themes-storybook.json`
    ).then((res) => res.json());
    const themeVersion = await fetch(
      `https://cdn.jsdelivr.net/gh/${themeMetaPath}/dist/version.json`
    ).then((res) => res.json());
    setThemeMetaData(themeMetaDataRaw);
    // const themeVersion = themeVersionBlob.json();
  }, [themeMetaPath]);

  const onThemeSelectionChange = React.useCallback((e) => {
    setActiveTheme(e.target.value);
  }, []);

  return (
    <div className="ft-container">
      <div className="ft-themeMeta">
        <input
          type="text"
          placeholder="Repository Path (owner/repo)"
          value={themeMetaPath}
          onChange={onThemeMetaPathInputChange}
        />
        <button onClick={onOkButtonClick}>OK</button>
      </div>
      {themeMetaData && (
        <div className="ft-themeSelector">
          <h5>Available Themes</h5>
          <select onChange={onThemeSelectionChange}>
            <option>Clear the theme</option>
            {themeMetaData.map((themeMeta, idx) => {
              return <option key={`idx_${idx}`}>{themeMeta.name}</option>;
            })}
          </select>
        </div>
      )}
    </div>
  );
};
export default FTPanel;
