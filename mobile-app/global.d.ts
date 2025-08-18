/// <reference types="nativewind/types" />`

import { RootStackParamList } from "./src/models";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
