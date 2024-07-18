import { createReducer } from "utils/ReducerUtils";
import type { ReduxAction } from "@appsmith/constants/ReduxActionConstants";
import { ReduxActionTypes } from "@appsmith/constants/ReduxActionConstants";

export interface FloatingPaneState {
  selectedWidgetId: string;
}

const initialState: FloatingPaneState = {
  selectedWidgetId: "0",
};

const reducer = createReducer(initialState, {
  [ReduxActionTypes.UPDATE_FLOATING_PANE]: (
    state: FloatingPaneState,
    action: ReduxAction<FloatingPaneState>,
  ) => ({
    ...state,
    ...action.payload,
  }),
});

export default reducer;
