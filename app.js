
// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAr_VLpeKxEjJo67COZbB2wTN7y1QM8gnM",
  authDomain: "henryz-real-estate.firebaseapp.com",
  projectId: "henryz-real-estate",
  storageBucket: "henryz-real-estate.firebasestorage.app",
  messagingSenderId: "77148231690",
  appId: "1:77148231690:web:b1f8ed96ab4c2fe405e7f3",
  measurementId: "G-VLC3NQ1PM0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// ------------------------
// Upload property function
// ------------------------
const form = document.getElementById('upload-form');
if(form){
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const location = document.getElementById('location').value;
    const price = document.getElementById('price').value;
    const description = document.getElementById('description').value;
    const image = document.getElementById('image').files[0];

    // Upload image to Firebase Storage
    const storageRef = ref(storage, 'images/' + image.name);
    await uploadBytes(storageRef, image);
    const imageUrl = await getDownloadURL(storageRef);

    // Save property data to Firestore
    await addDoc(collection(db, 'properties'), {
      title,
      location,
      price,
      description,
      imageUrl
    });

    document.getElementById('status').innerText = "Property uploaded!";
    form.reset();
  });
}

// ------------------------
// Load properties function
// ------------------------
const propertyList = document.getElementById('property-list');
if(propertyList){
  async function loadProperties(){
    const snapshot = await getDocs(collection(db, 'properties'));
    snapshot.forEach(doc => {
      const data = doc.data();
      const card = document.createElement('div');
      card.className = 'property-card';
      card.innerHTML = `
        <h2>${data.title}</h2>
        <p>${data.location}</p>
        <p>$${data.price}</p>
        <img src="${data.imageUrl}" style="width:100%;border-radius:5px;">
      `;
      propertyList.appendChild(card);
    });
  }
  loadProperties();
}
