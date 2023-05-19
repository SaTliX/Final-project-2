// Importation des modules de Firebase nécessaires
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js'
import {
  getAuth,
  signOut,
} from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js'

// Configuration de Firebase pour l'application
const firebaseConfig = {
  apiKey: "AIzaSyA_qA0iDFdCacTV_q3IsyGe5sq5pRFBbv4",
  authDomain: "last-38a9d.firebaseapp.com",
  projectId: "last-38a9d",
  storageBucket: "last-38a9d.appspot.com",
  messagingSenderId: "399234333329",
  appId: "1:399234333329:web:76e08bfdad16a8b1a8dd30"
};

// Initialisation de Firebase avec la configuration précédemment définie
initializeApp(firebaseConfig)

// Initialisation des services Firebase dont nous avons besoin
const auth = getAuth()

const quoteElement = document.querySelector('#quote');
const authorElement = document.querySelector('#author');

const api = 'https://api.quotable.io/random';

function getQuote() {
  fetch(api)
    .then(response => response.json())
    .then(data => {
      quoteElement.textContent = `"${data.content}"`;
      authorElement.textContent = `- ${data.author}`;
    })
    .catch(error => console.error(error));
}

getQuote();


const buttonElement = document.querySelector('#new-quote-button');

buttonElement.addEventListener('click', () => {
  quoteElement.classList.add('animate-pulse');
  getQuote();
  setTimeout(() => {
    quoteElement.classList.remove('animate-pulse');
  },);
});



const challengeElement = document.querySelector('#activity');
const typeElement = document.querySelector('#type');
const participantsElement = document.querySelector('#participants');
const btn = document.querySelector('#new-challenge-button');
const api2 = 'https://www.boredapi.com/api/activity/';

function getChallenge() {
  fetch(api2)
    .then(response => response.json())
    .then(data => {
      challengeElement.textContent = data.activity;
      typeElement.textContent = `Type: ${data.type}`;
      participantsElement.textContent = `Participants: ${data.participants}`;
    })
    .catch(error => console.error(error));
}

getChallenge();

btn.addEventListener('click', () => {
  challengeElement.classList.add('animate-pulse');
  getChallenge();
  setTimeout(() => {
    challengeElement.classList.remove('animate-pulse');
  },);
});



const logoutButton = document.querySelector('.logout')
logoutButton.addEventListener('click', () => {
  // Vérifier si l'utilisateur est connecté
  if (!auth.currentUser) {
    // Utilisateur non connecté, afficher l'alerte
    const loginMessage = `Please login first!`
    alert(loginMessage)
    return; // Arrêter l'exécution de la fonction
  }

  // Déconnexion de l'utilisateur actuel
  signOut(auth)
    .then(() => {
      console.log('User signed out')
      const logoutMessage = `You have been successfully disconnected!`
      alert(logoutMessage)
    })
    .catch(err => {
      console.log(err.message)
    })
})
