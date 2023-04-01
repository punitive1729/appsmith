import React, { useEffect } from "react";
import styled from "styled-components";
import { toggleInOnboardingWidgetSelection } from "actions/onboardingActions";
import { forceOpenWidgetPanel } from "actions/widgetSidebarActions";
import { SegmentedControl } from "design-system";
import { Colors } from "constants/Colors";
import { tailwindLayers } from "constants/Layers";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import type { AppState } from "@appsmith/reducers";
import { builderURL } from "RouteBuilder";
import { getCurrentPageId } from "selectors/editorSelectors";
import { getIsFirstTimeUserOnboardingEnabled } from "selectors/onboardingSelectors";
import AnalyticsUtil from "utils/AnalyticsUtil";
import { trimQueryString } from "utils/helpers";
import history from "utils/history";
import WidgetSidebar from "../WidgetSidebar";
import EntityExplorer from "./EntityExplorer";
import { getExplorerSwitchIndex } from "selectors/editorContextSelectors";
import { setExplorerSwitchIndex } from "actions/editorContextActions";

const StyledSegmentedControl = styled(SegmentedControl)`
  > .ads-v2-segmented-control__segments-container {
    flex: 1 1 0%;
  }
`;

const selectForceOpenWidgetPanel = (state: AppState) =>
  state.ui.onBoarding.forceOpenWidgetPanel;

const options = [
  {
    value: "explorer",
    label: "Explorer",
  },
  {
    value: "widgets",
    label: "Widgets",
  },
];

function ExplorerContent() {
  const dispatch = useDispatch();
  const isFirstTimeUserOnboardingEnabled = useSelector(
    getIsFirstTimeUserOnboardingEnabled,
  );
  const pageId = useSelector(getCurrentPageId);
  const location = useLocation();
  const activeSwitchIndex = useSelector(getExplorerSwitchIndex);

  const setActiveSwitchIndex = (index: number) => {
    dispatch(setExplorerSwitchIndex(index));
  };
  const openWidgetPanel = useSelector(selectForceOpenWidgetPanel);

  useEffect(() => {
    const currentIndex = openWidgetPanel ? 1 : 0;
    if (currentIndex !== activeSwitchIndex) {
      setActiveSwitchIndex(currentIndex);
    }
  }, [openWidgetPanel]);

  const onChange = (value: string) => {
    if (value === options[0].value) {
      dispatch(forceOpenWidgetPanel(false));
    } else if (value === options[1].value) {
      if (!(trimQueryString(builderURL({ pageId })) === location.pathname)) {
        history.push(builderURL({ pageId }));
        AnalyticsUtil.logEvent("WIDGET_TAB_CLICK", {
          type: "WIDGET_TAB",
          fromUrl: location.pathname,
          toUrl: builderURL({ pageId }),
        });
      }
      dispatch(forceOpenWidgetPanel(true));
      dispatch(setExplorerSwitchIndex(1));
      if (isFirstTimeUserOnboardingEnabled) {
        dispatch(toggleInOnboardingWidgetSelection(true));
      }
    }
  };

  const { value: activeOption } = options[activeSwitchIndex];

  return (
    <div
      className={`flex-1 flex flex-col overflow-hidden ${tailwindLayers.entityExplorer}`}
    >
      <div
        className={`flex-shrink-0 px-3 mt-1 py-2 border-t border-[${Colors.Gallery}]`}
      >
        <StyledSegmentedControl
          defaultValue={activeOption}
          // @ts-expect-error: SegmentedControl onChange
          onChange={onChange}
          options={options}
        />
      </div>
      <WidgetSidebar isActive={activeOption === "widgets"} />
      <EntityExplorer isActive={activeOption === "explorer"} />
    </div>
  );
}

export default ExplorerContent;
