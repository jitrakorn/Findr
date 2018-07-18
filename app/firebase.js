import * as firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyDiNN6Yk5irIu4MbjC09ph3j578nQft9e4",
    authDomain: "findr-1526869968216.firebaseapp.com",
    databaseURL: "https://findr-1526869968216.firebaseio.com",
    storageBucket: "findr-1526869968216.appspot.com",
}

export const firebaseApp = firebase.initializeApp(firebaseConfig);