import app from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/database';

var config = {
    apiKey: "AIzaSyDNSoBkMIi0PYybOjEvOamyWNtgrVP82rU",
    authDomain: "mingle-e76b5.firebaseapp.com",
    databaseURL: "https://mingle-e76b5.firebaseio.com",
    projectId: "mingle-e76b5",
    storageBucket: "mingle-e76b5.appspot.com",
    messagingSenderId: "162788477817",
    appId: "1:162788477817:web:374bd5a0d275c6f2bd7da8",
    measurementId: "G-VTQXVWMMH1"
  };

class Firebase {
    constructor() {
      const firebaseApp = app.initializeApp(config);
      this.auth = app.auth();
      this.database = app.database();
      this.db = firebaseApp.firestore();
    }
    // *** Auth API ***
    doCreateUserWithEmailAndPassword = (email, password) => this.auth.createUserWithEmailAndPassword(email, password);
    
    doSignInWithEmailAndPassword = (email, password) => this.auth.signInWithEmailAndPassword(email, password);
    
    doSignOut = () => this.auth.signOut();
    
    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);
    
    doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);
}
  
  export default Firebase;