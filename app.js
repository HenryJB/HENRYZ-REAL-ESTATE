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
    const imageInput = document.getElementById("image");
    const image = imageInput ? imageInput.files[0] : null;

    let imageUrl = null;

    // Upload image ONLY if it exists
    if (image) {
      try {
        const storageRef = storage.ref("images/" + image.name);
        await storageRef.put(image);
        imageUrl = await storageRef.getDownloadURL();
      } catch (err) {
        console.log("Image upload skipped:", err.message);
      }
    }

    // Save property to Firestore (ALWAYS)
    await db.collection("properties").add({
      title,
      location,
      price,
      description,
      imageUrl,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
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
  db.collection("properties")
    .orderBy("createdAt", "desc")
    .get()
    .then((snapshot) => {
      propertyList.innerHTML = "";

      snapshot.forEach((doc) => {
        const data = doc.data();
        const card = document.createElement("div");
        card.className = "property-card";

        card.innerHTML = `
          <h2>${data.title || "No title"}</h2>
          <p>${data.location || "No location"}</p>
          <p>₦${data.price || "0"}</p>
          ${
            data.imageUrl
              ? `<img src="${data.imageUrl}" style="width:100%;border-radius:6px;">`
              : `<div style="color:#888;font-size:14px;">No image yet</div>`
          }
        `;

        propertyList.appendChild(card);
      });
    })
    .catch((err) => {
      console.error("Error loading properties:", err);
    });
          }
                                          }
