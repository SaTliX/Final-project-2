// Importation des modules de Firebase nécessaires
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
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

// Ecouteur d'événements pour l'inscription des utilisateurs
const signupForm = document.querySelector('.signup')
signupForm.addEventListener('submit', (e) => {
  e.preventDefault()

  // Récupération des champs du formulaire
  const email = signupForm.email.value
  const password = signupForm.password.value

  // Vérification de la longueur du mot de passe
  if (password.length < 6) {
    alert("Le mot de passe doit contenir au moins 6 caractères.")
    return
  }

  // Création d'un nouvel utilisateur avec l'adresse email et le mot de passe fournis
  createUserWithEmailAndPassword(auth, email, password)
    .then(cred => {
      console.log('user created:', cred.user)
      signupForm.reset()
      const welcomeMessage = `Welcome, ${cred.user.email}!`
      alert(welcomeMessage)
    })
    .catch(err => {
      console.log(err.message)
    })
})

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


// Ecouteur d'événements pour la connexion des utilisateurs
const loginForm = document.querySelector('.login')
loginForm.addEventListener('submit', (e) => {
  e.preventDefault()

  // Récupération des champs du formulaire
  const email = loginForm.email.value
  const password = loginForm.password.value

// Connexion de l'utilisateur avec l'adresse email et le mot de passe fournis
signInWithEmailAndPassword(auth, email, password)
  .then(e => {
    console.log('user logged in:', e.user)
    loginForm.reset()
    const loginMessage = `Successfully connected!`
    alert(loginMessage)
  })
  .catch(err => {
    console.log(err.message)
    if (err.code === 'auth/wrong-password') {
      const errorMessage = `Incorrect password. Please try again.`
      alert(errorMessage)
    } else {
      const errorMessage = `An error occurred: ${err.message}`
      alert(errorMessage)
    }
  });
})
