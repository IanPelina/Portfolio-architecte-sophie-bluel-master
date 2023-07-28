// Variable pour stocker la modale actuellement ouverte
let modal = null;

//Faire apparaitre la modale
const displayModal = function (e) {
  e.preventDefault();
  const targetId = "#" + e.target.getAttribute("href");

  if (targetId) {
    const target = document.querySelector(targetId);

    if (target) {
      target.style.display = null;
      target.removeAttribute("aria-hidden");
      target.setAttribute("aria-modal", "true");
      modal = target;
      modal.addEventListener("click", closeModal);
      modal.querySelector(".closer").addEventListener("click", closeModal);
      modal.querySelector(".modal-stop").addEventListener("click", stopPropagation);
    }
  }
};

//Faire disparaitre la modale
const closeModal = function (e) {
  if (modal === null) {
    return;
  }
  e.preventDefault();
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");
  modal.removeEventListener("click", closeModal);
  modal.querySelector(".closer").removeEventListener("click", closeModal);
  modal.querySelector(".modal-stop").removeEventListener("click", stopPropagation);
  modal = null;
};

//Empêcher la fermeture au clique dans la modale
const stopPropagation = function (e) {
  e.stopPropagation();
};

//Ajout de l'eventListenner sur le logo
document.querySelector(".portfolio-logo").addEventListener("click", displayModal);

//Faire apparaitre et disparaitre la deuxieme modale
const addPhotoLink = document.getElementById("add-photo-link");
const secondModal = document.getElementById("inner-modal");
const firstModal = document.getElementById("main-modal");
const returnLink = document.querySelector(".return");
const closeLink = document.querySelector("#inner-modal .closer");

//Faire apparaitre la deuxième modale
addPhotoLink.addEventListener("click", function (event) {
  event.preventDefault();
  secondModal.style.display = null;
  firstModal.style.display = "none";
});

//Retour à la première modale
returnLink.addEventListener("click", function (event) {
  event.preventDefault();
  secondModal.style.display = "none";
  firstModal.style.display = null;
});

//Fermeture des 2 modales
closeLink.addEventListener("click", function (e) {
  e.preventDefault();
  secondModal.style.display = "none";
  firstModal.style.display = "none";
});

//Fermer la deuxieme modale au clique en dehors de la modale
window.onclick = (event) => {
  if (event.target == secondModal) {
    secondModal.style.display = "none";
  }
};

//Ajouter des works
const form = document.querySelector(".inner-modal-form");
form.addEventListener("submit", async function (e) {
  e.preventDefault();
  const formData = new FormData(form);
  const work = await createWork(formData);
  data.works.push(work);
  createAndRenderFigure(work);
  addDeletionEvents();
});

const workCategory = document.querySelector(".inner-modal-form #category");
const workTitle = document.querySelector(".inner-modal-form #title");
const workImage = document.getElementById("file");
const modalSubmit = document.querySelector(".modal-submit");

const inputs = [workCategory, workTitle, workImage]
  for (let input of inputs) {
    input.addEventListener("input", function () {
      validateInputs();
    });
  }

function validateInputs() {
  // Vérification de chaque champ d'entrée
  if (workImage.files[0] && Number(workCategory.value) && workTitle.value) {
    modalSubmit.style.backgroundColor = "#1D6154";
  } else {
    modalSubmit.style.backgroundColor = "#A7A7A7";
  }
}

//Faire apparaitre la miniature dans la modale
function previewImage() {
  const file = workImage.files[0];
  const imagePreviewContainer = document.querySelector(".ajout-photo");

  if (file.type.match("image.*")) {
    const reader = new FileReader();

    reader.addEventListener("load", function (event) {
      const imageUrl = event.target.result;
      const image = new Image();

      image.addEventListener("load", function () {
        for (let child of imagePreviewContainer.children) {
          child.style.display = "none";
        }
        imagePreviewContainer.appendChild(image);
      });

      image.src = imageUrl;
      image.style.width = "129px";
      image.style.height = "169px";
    });
    reader.readAsDataURL(file);
  }
  validateInputs()
}

//Verifier si la  taille ne dépasse pas les 4 mo
function validateFileSize(event) {
  const file = event.target.files[0];
  const maxFileSize = 4 * 1024 * 1024; // 4 Mo en octets
  const fileTooBig = document.querySelector(".file-too-big");

  if (file && file.size > maxFileSize) {
    // Afficher un message d'erreur
    fileTooBig.style.display = "block";
    event.target.value = "";
  } else {
    // Appeler la fonction previewImage si la taille est valide
    previewImage();
  }
}

//Supprimer toute la galerie
const deleteAllButton = document.querySelector(".delete-all")
deleteAllButton.addEventListener("click", deleteAllWorks);

async function deleteAllWorks() {
  const confirmation = confirm("Etes vous certain de vouloir supprimer tous les éléments de la gallerie ?");
  if (confirmation) {
    for (let work of data.works) {
      await deleteWork(work.id);
    }
    data.works = [];
    renderFigures();
  }
}