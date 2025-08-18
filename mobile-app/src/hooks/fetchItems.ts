import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

export const itemsFetch = async (
  query: FirebaseFirestoreTypes.Query<FirebaseFirestoreTypes.DocumentData>,
) => {
  const items: FirebaseFirestoreTypes.DocumentData[] = [];
  const qSnapshot = await query.get();
  const lastVisible = qSnapshot.docs[qSnapshot.docs.length - 1];

  qSnapshot.forEach((doc) => {
    const data = doc.data();
    items.push(data);
  });

  const results = {
    items,
    lastVisible,
  };

  return results;
};
