import React from "react";
import { ThemeMeta } from "./types";
import "./panel.css";

const cdnUrl = `https://cdn.jsdelivr.net/gh/`;
const iFrame_Id = "storybook-preview-iframe";
const ERR_CONNECTION_CREDENTIAL =
  "Unable to fetch theme data. Please check repository path and tag version.";
const ERR_REQUIRED_FIELD = "Repository path and Tag version are required!";

type Props = {
  target: string
}

const FTPanel: React.FC<Props> = ({ target }) => {
  const [themeMetaPath, setThemeMetaPath] = React.useState<string | null>(null);
  const [tagVersion, setTagVersion] = React.useState<string | null>(null);
  const [themeMetaData, setThemeMetaData] = React.useState<ThemeMeta[] | null>(null);
  const [activeTheme, setActiveTheme] = React.useState<string | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    let targetEl: HTMLElement, styleLink: HTMLLinkElement;
    const iframe = document.getElementById(iFrame_Id) as HTMLIFrameElement;
    if (!iframe) {
      return null;
    }

    const iframeDocument =
      iframe.contentDocument || iframe.contentWindow.document;

    if (
      iframeDocument &&
      activeTheme &&
      !iframeDocument.getElementById(activeTheme)
    ) {
      styleLink = iframeDocument.createElement("link");
      styleLink.setAttribute("id", activeTheme);
      styleLink.setAttribute("rel", "stylesheet");
      styleLink.setAttribute("type", "text/css");
      styleLink.setAttribute(
        "href",
        `${cdnUrl}${themeMetaPath}@${tagVersion}/dist/css/${activeTheme}.css`
      );
      iframeDocument.getElementsByTagName("head")[0].appendChild(styleLink);
    }

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
            targetEl.classList.remove(theme.class);

            const linkElement = iframeDocument.getElementById(theme.name);
            if (linkElement) {
              linkElement.parentElement.removeChild(linkElement);
            }
          });
      }
    };
  }, [activeTheme, themeMetaData]);

  const onThemeMetaPathInputChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setThemeMetaPath(e.target.value);
  }, []);

  const onTagVersionInputChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTagVersion(e.target.value);
  }, []);

  const onOkButtonClick = React.useCallback(async () => {
    if (
      themeMetaPath &&
      themeMetaPath.length > 0 &&
      tagVersion &&
      tagVersion.length > 0
    ) {
      try {
        const themeMetaDataRaw: ThemeMeta[] = await fetch(
          `https://cdn.jsdelivr.net/gh/${themeMetaPath}@${tagVersion}/dist/themes-storybook.json`
        ).then((res) => res.json());

        setThemeMetaData(themeMetaDataRaw);
        setErrorMessage(null);
      } catch (e) {
        setErrorMessage(ERR_CONNECTION_CREDENTIAL);
      }
    } else {
      setErrorMessage(ERR_REQUIRED_FIELD);
    }
  }, [themeMetaPath, tagVersion]);

  const onThemeSelectionChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setActiveTheme(e.target.value);
  }, []);

  return (
    <div className="ft-container">
      <div className="ft-themeMeta">
        <input
          type="text"
          className="ft-themeMeta-path"
          placeholder="Repository Path (owner/repo)"
          value={themeMetaPath}
          onChange={onThemeMetaPathInputChange}
        />
        <input
          type="text"
          className="ft-themeMeta-tagVersion"
          placeholder="Tag version (v1.0.1)"
          value={tagVersion}
          onChange={onTagVersionInputChange}
        />
        <button onClick={onOkButtonClick}>OK</button>
      </div>
      {errorMessage && <div className="error-connection">{errorMessage}</div>}
      {!errorMessage && themeMetaData && (
        <div className="ft-themeSelector">
          <h5>Available Themes</h5>
          <select onChange={onThemeSelectionChange}>
            <option>{activeTheme ? "Clear the theme" : ""}</option>
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
