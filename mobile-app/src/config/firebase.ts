globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;

import "@react-native-firebase/app";
import RNAuth, { getAuth } from "@react-native-firebase/auth";
import RNFirestore, { getFirestore } from "@react-native-firebase/firestore";
import RNFunctions from "@react-native-firebase/functions";
import RNStorage from "@react-native-firebase/storage";
import RNDatabase from "@react-native-firebase/database";

export const auth = RNAuth;
export const firestore = RNFirestore;
export const functions = RNFunctions;
export const storage = RNStorage;
export const database = RNDatabase;

export const newAuth = getAuth();
export const newFirestore = getFirestore();

export const getCurrentUser = () => {
  const user = newAuth.currentUser!;
  return user;
};

export const getDocument = (collection: string, doc: string) =>
  firestore().collection(collection).doc(doc);

export { RNAuth, RNFirestore, RNDatabase, RNFunctions, RNStorage };
