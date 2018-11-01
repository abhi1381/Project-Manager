// comments for pages


// comments dialog template

var commentsDialog = `<dialog class = "mdl-dialog bigDialog">
                    <h5 class = "mdl-dialog__title title"></h4>
                    <div class = "mdl-dialog__content">
                    <div class = "name">
                    </div>  
                    <div class = "pic"></div>
                    <div class = "mdl-textfield mdl-js-textfield mdl-textfield--expandable">
                    <label class = "mdl-textfield__label" for = "Textarea1" style = "color: grey; padding-left: 15px;">ADD YOUR COMMENT</label>
                    <textarea class = "mdl-textfield__input"
                    class = "Comarea"
                    rows = "5"
                    required></textarea> 
                    </div>
                    <button type = "button"
                    class = "mdl-button mdl-color--black mdl-color-text--white removeComment">REMOVE</button>
                    <button type = "button" class = "mdl-button mdl-color--white submitComment">SUBMIT</button>
                    </div> 
                    <div class = "mdl-dialog__actions">
                    <button type = "button" class = "mdl-button mdl-color--black mdl-color-text--white closeModal">CLOSE</button>
                    </div> 
                    </dialog>`;

function commentsModal(key, title, name, email) {
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
}


function openComModal(key) {
    "use strict";
    var commentsButton = document.querySelectorAll(".comments");
    var dialogShow = document.querySelector("#cardGrid").querySelectorAll(".comDialog");


    dialogShow.forEach(function (dialog) {
        commentsButton.forEach(function (btn) {
            btn.addEventListener("click", function (e) {
                if (btn.parentNode.parentNode.classList[0] === dialog.classList[0]) {
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