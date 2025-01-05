import { AppStoreState } from "../store";

export const selectCounterValue = (state: AppStoreState) => state.counter.value;
