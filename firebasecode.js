// Firebase Configuration (Replace these values with your Firebase project settings)
const firebaseConfig = {
    apiKey: "AIzaSyDHEcml3aP5X8H6iY3qNnjmoIYKE6WZ4Cc",  // API Key for authentication
    authDomain: "profusion-55ee5.firebaseapp.com",  // Firebase Auth domain
    projectId: "profusion-55ee5",  // Firebase Project ID
    storageBucket: "profusion-55ee5.appspot.com",  // Firebase Storage Bucket URL
    messagingSenderId: "705597166854",  // Sender ID for messaging
    appId: "1:705597166854:web:f714caa1b9141a93353a87"  // Firebase App ID for identification
};

// Initialize Firebase using the provided configuration
firebase.initializeApp(firebaseConfig);

// Initialize Firestore database service
const db = firebase.firestore();

// Function to update the user's name dynamically as they type
function updateUserName() {
    // Get the value of the name input field
    const nameInput = document.getElementById('creatorName').value;

    // Get the element where the user's name is displayed
    const userNameDisplay = document.getElementById('userNameDisplay');

    // If the name input is empty, display "User", otherwise display the entered name
    userNameDisplay.textContent = nameInput || "User";
}

// Function to auto-expand the textarea as the user types
function autoExpand(field) {
    // Reset the height of the field to auto adjust for new content
    field.style.height = 'inherit';

    // Get the computed style of the field to calculate its height
    const computed = window.getComputedStyle(field);

    // Calculate the total height of the textarea including padding and borders
    const height =
        parseInt(computed.getPropertyValue('border-top-width'), 10) +
        parseInt(computed.getPropertyValue('padding-top'), 10) +
        field.scrollHeight +
        parseInt(computed.getPropertyValue('padding-bottom'), 10) +
        parseInt(computed.getPropertyValue('border-bottom-width'), 10);

    // Set the calculated height to ensure the field grows with the content
    field.style.height = `${height}px`;
}

// Async function to upload content to Firebase Firestore
async function uploadContent() {
    // Get the input fields for creator's name and thoughts
    const thoughtsInput = document.getElementById('creatorThoughts');
    const creatorNameInput = document.getElementById('creatorName');
    // const fileInput = document.getElementById('contentFile');  // Uncomment to handle file uploads

    // Get the values from the inputs
    const creatorName = creatorNameInput.value.trim();
    const userThoughts = thoughtsInput.value.trim();
    // const file = fileInput.files[0];  // Get the selected file (if any)

    // Check if the creator's name is empty, show an alert and stop the function if true
    if (!creatorName) {
        alert("Please enter your name!");
        return;
    }

    // Check if the user has written thoughts, show an alert if it's empty
    if (!userThoughts) {
        alert("Please write your thoughts or upload a file!");
        return;
    }

    // Initialize default values for file handling (commented out in this case)
    // let fileName = "No file uploaded";
    // let fileURL = null;

    // If a file is uploaded, you can process and store it here (commented out)
    // if (file) {
    //     const reader = new FileReader();
    //     reader.onload = function (event) {
    //         localStorage.setItem("uploadedFile", JSON.stringify({
    //             fileName: file.name,
    //             fileContent: event.target.result
    //         }));
    //     };
    //     reader.readAsDataURL(file); // Reads the file as base64 data for storage
    //     fileName = file.name;  // Set file name to store in Firestore
    //     fileURL = "File stored locally";  // Indicate file is stored locally (or you can store its URL in Firebase)
    // }

    // Prepare the content data object (without file)
    const contentData = {
        creatorName,          // Store the creator's name
        thoughts: userThoughts, // Store the user's thoughts
        // fileName,           // Optional: Save the file name in Firestore (uncomment to use)
        // fileURL,            // Optional: Indicate that the file is stored locally (uncomment to use)
        timestamp: new Date().toISOString(), // Save the timestamp for when the content was uploaded
    };

    try {
        // Upload content data to Firebase Firestore under the "contents" collection
        await db.collection("contents").add(contentData);

        // Reset form inputs after successful upload
        creatorNameInput.value = "";  // Clear the name input
        thoughtsInput.value = "";  // Clear the thoughts textarea
        // fileInput.value = "";  // Clear the file input (uncomment if using file uploads)
        thoughtsInput.style.height = "inherit";  // Reset the textarea height

        // Display a success message to the user
        alert("Content uploaded successfully!");

    } catch (error) {
        // Log and display an error message if the upload fails
        console.error("Error uploading content:", error.message);
        alert("Failed to upload content. Please try again.");
    }
}
