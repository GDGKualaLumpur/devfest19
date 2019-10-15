import { firebase } from "@firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/database";

const config = {
  
};
firebase.initializeApp(config);
if (typeof window !== "undefined") {
  import("firebase/performance").then(() => firebase.performance());
}
export default firebase;
