"use strict";

// Signs-in
function signIn() {
  // Sign in Firebase using popup auth and Google as the identity provider.
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider);
}

// Signs-out
function signOut() {
  firebase.auth().signOut();
}

// Initiate firebase auth.
function initFirebaseAuth() {
  firebase.auth().onAuthStateChanged(authStateObserver);
}

// Returns the signed-in user's profile Pic URL.
function getProfilePicUrl() {
  return (
    firebase.auth().currentUser.photoURL || "/images/profile_placeholder.png"
  );
}

// Returns the signed-in user's display name.
function getUserName() {
  return firebase.auth().currentUser.displayName;
}

// get email
function getEmail() {
  return firebase.auth().currentUser.email;
}

// Returns true if a user is signed-in.
function isUserSignedIn() {
  return !!firebase.auth().currentUser;
}

// Loads chat messages history and listens for upcoming ones.
function loadProjects() {
  // Loads the last 12 messages and listen for new ones.
  var callback = function (snap) {
    var data = snap.val();
    // console.log(data);
    displayProjects(
      snap.key,
      data.name,
      data.title,
      data.imageUrl,
      data.description,
      data.profilePicUrl,
      data.email,
      data.gitUrl,
      data.docsUrl
    );
    openModal(snap.key);
    openComModal(snap.key);
    // Delete(snap.key);
  };

  firebase
    .database()
    .ref("/projects/")
    .on("child_added", callback);
  firebase
    .database()
    .ref("/projects/")
    .on("child_changed", callback);
}


// Saves a new project on the Firebase DB.
function saveProjects(projectObject) {
  // Add a new message entry to the Firebase Database.
  return firebase
    .database()
    .ref("/projects/")
    .push({
      name: getUserName(),
      email: getEmail(),
      title: projectObject.projectTitle,
      imageUrl: projectObject.imageUrl,
      description: projectObject.Textarea1,
      profilePicUrl: getProfilePicUrl(),
      gitUrl: projectObject.gitUrl,
      docsUrl: projectObject.docsUrl
    })
    .catch(function (error) {
      console.error("Error writing new message to Firebase Database", error);
    });
}

function onProjectFormSubmit(e) {
  e.preventDefault();
  // Check that the user entered a message and is signed in.
  if (checkSignedInWithMessage()) {
    saveProjects({
      projectTitle: projectTitle.value,
      imageUrl: url.value,
      Textarea1: Textarea1.value,
      gitUrl: gitUrl.value,
      docsUrl: docsUrl.value
    }).then(function () {
      // Clear message text field and re-enable the SEND button.
      resetMaterialTextfield({
        projectTitle,
        url,
        Textarea1,
        gitUrl,
        docsUrl
      });
    });
  }
}

// Triggers when the auth state change for instance when the user signs-in or signs-out.
function authStateObserver(user) {
  if (user) {
    // User is signed in!
    // Get the signed-in user's profile pic and name.
    var profilePicUrl = getProfilePicUrl();
    var userName = getUserName();

    // Set the user's profile pic and name.
    userPicElement.style.backgroundImage = "url(" + profilePicUrl + ")";
    userNameElement.textContent = userName;

    // Show user's profile and sign-out button.
    userNameElement.removeAttribute("hidden");
    userPicElement.removeAttribute("hidden");
    signOutButtonElement.removeAttribute("hidden");

    // Hide sign-in button.
    signInButtonElement.setAttribute("hidden", "true");
  } else {
    // User is signed out!
    // Hide user's profile and sign-out button.
    userNameElement.setAttribute("hidden", "true");
    userPicElement.setAttribute("hidden", "true");
    signOutButtonElement.setAttribute("hidden", "true");

    // Show sign-in button.
    signInButtonElement.removeAttribute("hidden");
  }
}

// Returns true if user is signed-in. Otherwise false and displays a message.
function checkSignedInWithMessage() {
  // Return true if the user is signed in Firebase
  if (isUserSignedIn()) {
    return true;
  }

  // Display a message to the user using a Toast.
  var data = {
    message: "You must sign-in first",
    timeout: 2000
  };
  signInSnackbarElement.MaterialSnackbar.showSnackbar(data);
  signInSnackbarElement.style.backgroundColor = "#e65100";
  signInSnackbarElement.style.left = "50%";

  return false;
}

// Resets the given MaterialTextField.
function resetMaterialTextfield(element) {
  element.projectTitle.value = " ";
  element.projectTitle.parentNode.MaterialTextfield.boundUpdateClassesHandler();
  element.url.value = " ";
  element.url.parentNode.MaterialTextfield.boundUpdateClassesHandler();
  element.Textarea1.value = " ";
  element.Textarea1.parentNode.MaterialTextfield.boundUpdateClassesHandler();
  element.comArea.value = " ";
  element.comArea.parentNode.MaterialTextfield.boundUpdateClassesHandler();
  element.gitUrl.value = " ";
  element.gitUrl.parentNode.MaterialTextfield.boundUpdateClassesHandler();
  element.docsUrl.value = " ";
  element.docsUrl.parentNode.MaterialTextfield.boundUpdateClassesHandler();
}

// modals and cards
// A loading image URL.
var LOADING_IMAGE_URL = "https://www.google.com/images/spin-32.gif?a";

// project submit dialog
(function () {
  "use strict";
  var dialogButton = document.querySelector("#show-dialog");
  var dialog = document.querySelector("#dialog");
  if (!dialog.showModal) {
    dialogPolyfill.registerDialog(dialog);
  }

  dialogButton.addEventListener("click", function () {
    if (checkSignedInWithMessage()) {
      dialog.showModal();
    }
  });

  dialog.querySelector("#closeModal").addEventListener("click", function () {
    dialog.close();
  });
})();

// show project dialog
var smallCardTemplate = `<div class="demo-card-image mdl-card mdl-shadow--16dp mdl-cell mdl-cell--6-col">
                        <div class="mdl-card__title mdl-card--expand smallTitle"></div>
                        <div class="mdl-card__actions">
                        <button class="readMore mdl-button mdl-color--white" style="color: black;border: 3px dashed black; border-radius: 10px;">READ MORE...</button>
                        <button class = "comments mdl-button mdl-color--silver"
                        style = "color: white;border: 3px dashed black; border-radius: 10px;">COMMENTS</button>
                        </div>
                        </div>`;

function makeCard(key, title, imageUrl) {
  var div = document.getElementById(key);
  if (!div) {
    if (title && imageUrl) {
      var container = document.createElement("div");
      container.innerHTML = smallCardTemplate;
      div = container.firstChild;
      var smallTitle = div.querySelector(".smallTitle");
      smallTitle.textContent = title;
      smallTitle.style.color = "white";
      smallTitle.style.background = "black";
      smallTitle.style.fontWeight = "600";
      smallTitle.style.width = "fit-content";
      smallTitle.style.maxHeight = "50px";
      smallTitle.style.borderRadius = "10px";
      smallTitle.style.border = "2px solid white";
      smallTitle.style.fontSize = "2em";
      smallTitle.style.textDecoration = "underline";
      // div.style.margin = "5px";
      div.style.minHeight = "300px";
      div.style.background = "url(" + imageUrl + ") center/cover no-repeat";
      div.style.backgroundOrigin = "content-box";
      div.style.backgroundColor = "whitesmoke";
      div.setAttribute(
        "class",
        `${key} demo-card-image mdl-card mdl-shadow--6dp mdl-cell--6-col`
      );
      cardGrid.appendChild(div);
    }
  }
}

function openModal(key) {
  "use strict";
  var readmoreButton = document.querySelectorAll(".readMore");
  var dialogShow = document.querySelectorAll(`dialog[id=${key}]`);

  dialogShow.forEach(function (dialog) {
    readmoreButton.forEach(function (btn) {
      btn.addEventListener("click", function () {
        // console.log(this, btn.parentNode.parentNode.classList[0], dialog.id);
        if (btn.parentNode.parentNode.classList[0] === dialog.id) {
          dialog.showModal();
        }
      });
    });
    if (!dialog.showModal) {
      dialogPolyfill.registerDialog(dialog);
    }
    dialog.querySelector(".closeModal").addEventListener("click", function () {
      dialog.close();
      // location.reload();
    });
  });
}

// Template for readmore dialog
var readMoreDialogTemplate = `<dialog class = "mdl-dialog bigDialog">
                            <h4 class = "mdl-dialog__title title"></h4>
                            <div class="projectImage"></div> 
                            <div class = "mdl-dialog__content">
                            <p class="description"></p>
                            <div class = "mdl-card mdl-shadow--6dp gitLink" >
                            <a href = "#" target = "_blank">CHECK THE COMPLETE SOURCE CODE ON GITHUB</a>
                            <div class="divider"></div>
                            <p>GITHUB<i class = "material-icons">
                            code</i></p >
                            </div>
                            <div class = "mdl-card mdl-shadow--6dp iframeLink">
                            <iframe class="iframeEmbed"
                            style="width: -webkit-fill-available; height:-webkit-fill-available "
                            title="iframe1"
                            frameborder="0"
                            scrolling="yes"
                            marginheight="0"
                            marginwidth="0" 
                            src="">
                            </iframe>
                            </div>
                            </div> 
                            <div class = "mdl-dialog__actions">
                            <div class="name">
                            </div>
                            <div class="email">
                            </div>
                            <div class="pic"></div>
                            <button type = "button" class = "mdl-button closeModal">CLOSE</button> 
                            <button type = "button" class = "mdl-button mdl-color--red remove">DELETE</button>
                            </div> 
                            </dialog>`;



// Displays  in the UI.
function displayProjects(
  key,
  name,
  title,
  imageUrl,
  description,
  profilePicUrl,
  email,
  gitUrl,
  docsUrl
) {


  // if (!firebase.database().ref(`/projects/${key}/comments/`)) {
  //   firebase.database().ref(`/projects/${key}`)
  //     .update({
  //       comments: [{
  //         name: "vfdvbdv"
  //       }]
  //     }).catch(function (error) {
  //       console.error("Error writing new message to Firebase Database", error);
  //     });
  // }

  makeCard(key, title, imageUrl);
  commentsModal(key,title,name,profilePicUrl);

  var div = document.getElementById(key);
  // If an element for that message does not exists yet we create it.
  if (!div) {
    var container = document.createElement("div");
    container.innerHTML = readMoreDialogTemplate;
    div = container.firstChild;
    div.setAttribute("id", key);
    cardGrid.appendChild(div);
  }
  if (profilePicUrl) {
    div.querySelector(".pic").style.background =
      "url(" + profilePicUrl + ") 10% 10% / 20px no-repeat";
    div.querySelector(".pic").style.width = "36px";
    div.querySelector(".pic").style.backgroundSize = "36px";
    div.querySelector(".pic").style.borderRadius = "18px";
  }
  var actions = div.querySelector(".mdl-dialog__actions");
  actions.style.display = "flex";
  actions.style.flexDirection = "column";
  actions.style.textALign = "center";
  div.querySelector(".name").textContent = `Author ::: ${name}`;
  div.querySelector(".email").innerHTML = `${email}`;
  div.style.border = "1.5em double orange";
  div.style.borderRadius = "1.5em";
  div.style.width = "50vw";
  var Title = div.querySelector(".title");
  var Description = div.querySelector(".description");
  var image = document.createElement("img");
  var projectImage = div.querySelector(".projectImage");
  Title.textContent = title;
  Title.style.padding = "24px 24px 10px 10px";
  Description.textContent = description;
  Description.style.font = "italic 400 20px/30px Georgia, serif";
  image.src = imageUrl;
  projectImage.innerHTML = " ";
  image.style.width = "80vw";
  image.style.maxWidth = "1000px";
  image.style.maxWidth = "50vw";
  image.style.margin = "0 5px 10px 0";
  image.classList.add("mdl-card", "mdl-shadow--4dp");
  image.style.padding = "10px";
  projectImage.appendChild(image);
  // links and embeds
  div.querySelector(".gitLink").querySelector("a").href = gitUrl; 
  div.querySelector(".iframeLink").querySelector("iframe").src = docsUrl; 
  // Replace all line breaks by <br>.
  Title.innerHTML = Title.innerHTML.replace(/\n/g, "<br>");
  Description.innerHTML = Description.innerHTML.replace(/\n/g, "<br>");

  // media queries 
  var x = window.matchMedia("(max-width: 400px)");
  mediaQuery(x);
  x.addListener(mediaQuery);

  function mediaQuery(x) {
    if (x.matches) {
      image.style.width = "100%";
      image.style.maxWidth = "1000px";
      image.style.maxWidth = "80vw";
      div.style.width = "80vw";
    } else {
      image.style.width = "80vw";
      image.style.maxWidth = "1000px";
      image.style.maxWidth = "50vw";
      div.style.width = "50vw";
    }
  }

  var removeElement = div.querySelector(".remove");


  // delete a project
  if (checkSignedInWithMessage()) {
    removeElement.addEventListener("click", function (e) {
      if (this.parentNode.querySelector(".email").textContent == getEmail()) {
        var askUser = prompt("Do You Want to Delete this?");
        if (askUser.toLocaleLowerCase() === "yes") {
          var iD = this.parentNode.parentNode.id;
          var refDeb = firebase.database().ref(`/projects/${iD}`);
          refDeb
            .remove()
            .then(function () {
              location.reload();
              console.log("Remove succeeded.");
            })
            .catch(function (error) {
              console.log("Remove failed: " + error.message);
            });
        }
      }
      // console.log(e, this.parentNode.parentNode.id, refDeb);
    });
  }





  url.focus();
  Textarea1.focus();
  projectTitle.focus();
  // commentsArea.focus();
}


// Checks that the Firebase SDK has been correctly setup and configured.
function checkSetup() {
  if (
    !window.firebase ||
    !(firebase.app instanceof Function) ||
    !firebase.app().options
  ) {
    window.alert(
      "You have not configured and imported the Firebase SDK. " +
      "Make sure you go through the codelab setup instructions and make " +
      "sure you are running the codelab using `firebase serve`"
    );
  }
}

// Checks that Firebase has been imported.
checkSetup();

// Shortcuts to DOM Elements.
var userPicElement = document.getElementById("user-pic");
var userNameElement = document.getElementById("user-name");
var signInButtonElement = document.getElementById("sign-in");
var signOutButtonElement = document.getElementById("sign-out");
var signInSnackbarElement = document.getElementById("must-signin-snackbar");
var container = document.querySelector("#container");
var closeModal = document.querySelector("#closeModal");
var cardBack = document.querySelector(".demo-card-image.mdl-card");
var cardGrid = document.querySelector("#cardGrid");
var url = document.getElementById("imageUrl");
var Textarea1 = document.getElementById("Textarea1");
var projectTitle = document.getElementById("projecttitle");
var projectform = document.querySelector("#projectform");
var gitUrl = document.querySelector("#gitUrl");
var docsUrl = document.querySelector("#docsUrl");

// auth
signOutButtonElement.addEventListener("click", signOut);
signInButtonElement.addEventListener("click", signIn);

// listeners
projectform.addEventListener("submit", onProjectFormSubmit);
closeModal.addEventListener("click", makeCard);



// initialize Firebase
initFirebaseAuth();

// We load currently existing projects and listen to new ones.
loadProjects();

// commentsSubmition();