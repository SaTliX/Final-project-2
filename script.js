// Importation des modules nécessaires pour interagir avec Firestore
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js'
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  query,
  orderBy,
  serverTimestamp,
  where,
} from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js'
import {
  onAuthStateChanged,
  getAuth,
} from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js'


// Configuration de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA_qA0iDFdCacTV_q3IsyGe5sq5pRFBbv4",
  authDomain: "last-38a9d.firebaseapp.com",
  projectId: "last-38a9d",
  storageBucket: "last-38a9d.appspot.com",
  messagingSenderId: "399234333329",
  appId: "1:399234333329:web:76e08bfdad16a8b1a8dd30"
};

// Initialisation de Firebase
initializeApp(firebaseConfig)

// Initialisation des services
const db = getFirestore()

// Référence à la collection "citations"
const colRef = collection(db, 'citations')

// Définition de la requête pour trier les citations par date de création
const q = query(colRef, orderBy('createdAt'))

// Récupération des données de la collection en temps réel
onSnapshot(q, (snapshot) => {
  let citations = []
  snapshot.docs.forEach(doc => {
    citations.push({ ...doc.data(), id: doc.id })
  })
  console.log(citations)
})

const auth = getAuth(); // Initialisation de l'objet auth

// Récupération des données de la collection en temps réel pour l'utilisateur connecté
onAuthStateChanged(auth, (user) => {
  if (user) {
    const userColRef = collection(db, 'citations');
    const userQuery = query(userColRef, where('userId', '==', user.uid), orderBy('createdAt'));

    onSnapshot(userQuery, (snapshot) => {
      let citations = [];
      snapshot.docs.forEach((doc) => {
        citations.push({ ...doc.data(), id: doc.id });
      });
      displayCitations(citations);
    });
  } else {
    displayCitations([]);
  }
});

// Ajout d'une citation dans la collection pour l'utilisateur connecté
const addCitationForm = document.querySelector('#add');
addCitationForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const areaValue = addCitationForm.area.value;
  const authorValue = addCitationForm.author.value;

  if(!auth.currentUser) {
    alert('You must be logged in to add a quote');
    return;
  }

  if (areaValue.split(' ').length < 2) {
    alert('The text of the quote must contain at least 2 words');
    return;
  }

  if (authorValue.length < 3) {
    alert('The author\'s name must contain at least 3 characters');
    return;
  }

  // Ajout de la citation avec l'ID de l'utilisateur actuel
  addDoc(collection(db, 'citations'), {
    title: areaValue,
    author: authorValue,
    createdAt: serverTimestamp(),
    userId: auth.currentUser.uid, // Associer la citation à l'utilisateur actuel
  })
    .then(() => {
      addCitationForm.reset();
      const addingCitationMessage = 'Thanks, the quote was successfully added!';
      alert(addingCitationMessage);
    })
    .catch((err) => {
      console.log(err.message);
    });
});


// Fonction pour afficher les citations dans la page
function displayCitations(citations) {
  const quotesContainer = document.getElementById('user-quotes-container');
  if (quotesContainer) {
    if (citations.length === 0) {
      quotesContainer.style.display = 'none'; // Masquer la section si l'utilisateur n'a pas de citations
      return;
    }

    quotesContainer.innerHTML = '';

    citations.forEach(citation => {
      const quoteContainer = document.createElement('div');
      quoteContainer.id = citation.id;
      quoteContainer.className = 'bg-gray-400 rounded-lg mt-4 shadow-md p-4';

      const quoteTitle = document.createElement('h2');
      quoteTitle.textContent = 'Your quote'; // Titre ajouté

      const quoteText = document.createElement('p');
      quoteText.id = 'quote';
      quoteText.className = 'text-lg mb-2';
      const formattedQuote = "'" + citation.title + "'";
      quoteText.textContent = formattedQuote;

      const quoteAuthor = document.createElement('p');
      quoteAuthor.id = 'author';
      quoteAuthor.className = 'text-md font-bold';
      quoteAuthor.textContent = citation.author;

      quoteContainer.appendChild(quoteTitle);
      quoteContainer.appendChild(quoteText);
      quoteContainer.appendChild(quoteAuthor);

      quotesContainer.appendChild(quoteContainer);
    });

    quotesContainer.style.display = 'block'; // Afficher la section s'il y a des citations
  }
}
