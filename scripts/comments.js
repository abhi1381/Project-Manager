// comments for pages
function loadComments(commentsTempArea) {
    var callback = function (snap) {
        var data = snap.val();
        displayComments(
            snap.key,
            data.name,
            data.profilePicUrl,
            data.comArea,
            data.title,
            commentsTempArea
        );
    };

    firebase
        .database()
        .ref("/comments/")
        .on("child_added", callback);
    firebase
        .database()
        .ref("/comments/")
        .on("child_changed", callback);
}

// comments dialog template

var commentsDialog = `<dialog>
                    <h5 class = "mdl-dialog__title title"></h4>
                    <div class = "mdl-dialog__content commentsTempArea">
                    <form class="cForm" action="#">
                    <div class = "mdl-textfield mdl-js-textfield mdl-textfield--expandable">
                    <textarea class = "mdl-textfield__input comArea"
                    rows = "5" placeholder="ADD YOUR COMMENT"
                    required></textarea> 
                    </div>
                    <button type = "submit" class = "mdl-button mdl-color--white submitComment" style="border: 3px dashed black">SUBMIT</button>
                    </form>
                    </div> 
                    <div class = "mdl-dialog__actions">
                    <button type = "button" class = "mdl-button mdl-color--black mdl-color-text--white closeModal">CLOSE</button>
                    </div> 
                    </dialog>`;

var commentsTemp = `<div class="mdl-grid" style="padding-left: 0">
                    <div class = "mdl-cell mdl-cell--2-col" style="padding-top: 20px">   
                    <div class = "pic"></div>
                    </div> 
                    <div class = "mdl-cell mdl-cell--10-col">
                    <div class="mdl-grid">
                    <div class = "mdl-cell mdl-cell--12-col name">
                    </div>
                    <div class="mdl-cell mdl-cell--12-col commentsCard">
                    </div> 
                    </div>
                    <button type = "button"
                    class = "mdl-button mdl-color--black mdl-color-text--white removeComment"
                    style = "width: inherit;
                    background-color: white !important;
                    color: orange !important;
                    border: 2px dashed;">REMOVE</button>
                    </div>
                    </div>`;


function commentsModal(key, title, name, profilePicUrl) {
    var div = document.getElementById(key);
    if (!div) {
        if (title) {
            var container = document.createElement("div");
            container.innerHTML = commentsDialog;
            div = container.firstChild;
            var h5 = div.querySelector("h5");
            h5.textContent = title;
            div.setAttribute(
                "class",
                `${key} mdl-dialog comDialog`
            );

            cardGrid.appendChild(div);
        }
    }
    var commentsTempArea = div.querySelector(".commentsTempArea");
    console.log(commentsTempArea);
    loadComments(commentsTempArea);
    var comArea = div.querySelector(".comArea");
    var cForm = div.querySelector(".cForm");
    // submit comments to db and display
    cForm.addEventListener("submit", function () {
        // console.log(comArea.value,this);
        // Check that the user entered a message and is signed in.
        if (checkSignedInWithMessage()) {
            if (comArea !== "") {
                saveComments({
                    comArea: comArea.value,
                    title: title
                }).then(function () {
                    // Clear message text field and re-enable the SEND button.
                    comArea.value = "";
                });
            }
        }
    });

}

function deleteComments() {

}

function openComModal(key) {
    "use strict";
    var commentsButton = document.querySelectorAll(".comments");
    var dialogShow = document.querySelector("#cardGrid").querySelectorAll(".comDialog");


    dialogShow.forEach(function (dialog) {
        commentsButton.forEach(function (btn) {
            btn.addEventListener("click", function (e) {
                try {
                    if (btn.parentNode.parentNode.classList[0] === dialog.classList[0]) {
                        dialog.showModal();
                    }
                } catch (e) {
                    console.log("error");
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



function displayComments(key, name, profilePicUrl, comArea, title, commentsTempArea) {
    // console.log(commentsTempArea.parentNode.querySelector("h5").textContent);
    var div = document.getElementById(key);
    if (title == commentsTempArea.parentNode.querySelector("h5").textContent) {
        if (!div) {
            var container = document.createElement("div");
            container.innerHTML = commentsTemp;
            div = container.firstChild;
            div.setAttribute("id", key);
            commentsTempArea.appendChild(div);
        }
        if (profilePicUrl) {
            div.querySelector(".pic").style.background =
                "url(" + profilePicUrl + ") 10% 10% / 20px no-repeat";
            div.querySelector(".pic").style.width = "36px";
            div.querySelector(".pic").style.height = "36px";
            div.querySelector(".pic").style.backgroundSize = "36px";
            div.querySelector(".pic").style.borderRadius = "18px";
        }
        div.querySelector(".name").textContent = `${name}`;
        div.querySelector(".name").style.color = "black";
        var commentsCard = div.querySelector(".commentsCard");
        commentsCard.textContent = `${comArea}`;
        commentsCard.style.border = "2px dashed white";
        commentsCard.style.backgroundColor = "black";
        commentsCard.style.color = "white";
        commentsCard.style.boxShadow = `0 30px 60px rgba(0, 0, 0, 0.19),
     0 6 px 6 px rgba(0, 0, 0, 0.23)`;
        commentsCard.style.padding = "5px";
        commentsCard.style.wordBreak = "break-all";
        commentsTempArea.style.maxHeight = "550px";
        commentsTempArea.style.overflow = "auto";


        // delete comments
        if (checkSignedInWithMessage()) {
            div.querySelector(".removeComment").addEventListener("click", function (e) {
                console.log(e);
                var biUrl = window.getComputedStyle(this.parentNode.parentNode.querySelector(".pic"), false).backgroundImage.slice(4, -1).replace(/"/g, "");
                var iD = this.parentNode.parentNode.id;
                if (getProfilePicUrl() === biUrl) {
                    firebase.database().ref(`/comments/${iD}`).remove().then(function () {
                            location.reload();
                            console.log("Remove succeeded.");
                        })
                        .catch(function (error) {
                            console.log("Remove failed: " + error.message);
                        });
                }

            });
        }

    }


}

function saveComments(commentsObject) {
    return firebase.database().ref("/comments/")
        .push({
            name: getUserName(),
            profilePicUrl: getProfilePicUrl(),
            title: commentsObject.title,
            comArea: commentsObject.comArea
        }).catch(function (error) {
            console.error("Error writing new message to Firebase Database", error);
        });
}