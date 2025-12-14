// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAr_VLpeKxEjJo67COZbB2wTN7y1QM8gnM",
  authDomain: "henryz-real-estate.firebaseapp.com",
  projectId: "henryz-real-estate",
  storageBucket: "henryz-real-estate.appspot.com",
  messagingSenderId: "77148231690",
  appId: "1:77148231690:web:b1f8ed96ab4c2fe405e7f3",
};

// Initialize Firebase (COMPAT)
firebase.initializeApp(firebaseConfig);

// Services
const db = firebase.firestore();
const storage = firebase.storage();

// ------------------------
// Upload property
// ------------------------
const form = document.getElementById("upload-form");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const location = document.getElementById("location").value;
    const price = document.getElementById("price").value;
    const description = document.getElementById("description").value;
    const image = document.getElementById("image").files[0];

    const storageRef = storage.ref("images/" + image.name);
    await storageRef.put(image);
    const imageUrl = await storageRef.getDownloadURL();

    await db.collection("properties").add({
      title,
      location,
      price,
      description,
      imageUrl,
    });

    document.getElementById("status").innerText = "Property uploaded!";
    form.reset();
  });
}

// ------------------------
// Load properties
// ------------------------
const propertyList = document.getElementById("property-list");

if (propertyList) {
  db.collection("properties").get().then((snapshot) => {
    snapshot.forEach((doc) => {
      const data = doc.data();
      const card = document.createElement("div");
      card.className = "property-card";
      card.innerHTML = `
        <h2>${data.title}</h2>
        <p>${data.location}</p>
        <p>$${data.price}</p>
        <img src="${data.imageUrl}" style="width:100%;border-radius:5px;">
      `;
      propertyList.appendChild(card);
    });
  });
                                          }
