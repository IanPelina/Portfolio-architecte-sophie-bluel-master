// Variable globale pour stocker les works
let works = []

//Mettre createFigure et createModalFigure dans une fonction pour éviter les répetitions
function createFigures() {
  // Parcourir les works et créer une figure pour chaque work
  for (let work of works) {
    // Ajouter la figure à la galerie
    addToGallery(work)   
    //ajout de cette ligne pour la modale
    addToModalGallery(work)  }
}

function addToGallery(work) {
  document.querySelector(".gallery").innerHTML += createFigure(work.imageUrl, work.title, work.id)
}

// Fonction pour créer un élément figure
function createFigure(imageURL, title, id) {
  return `
    <figure data-id="${id}">
      <img src="${imageURL}" alt="${title}">
      <figcaption>${title}</figcaption>
    </figure>
  `
}

function addToModalGallery(work) {
  document.querySelector(".modal-gallery").innerHTML += createModalFigure(work.imageUrl, work.title, work.id)
}

//Fonction pour créer la gallerie Modale
function createModalFigure(imageUrl, title, id) {
  const editTitle = "éditer"
  return `
    <figure data-id="${id}">
      <i class="trash fa-solid fa-trash-can"></i>
      <i class="move fa-solid fa-arrows-up-down-left-right"></i>      
      <img id="modal-image" src="${imageUrl}" alt="${title}">
      <figcaption id="modal-image-title">${editTitle}</figcaption>
    </figure>
  `
}

// Fonction pour créer un bouton de catégorie
function createInput(name, id) {
  return `
    <input type="button" value="${name}" data-category-id="${id}">
  `
} 

//Fonction pour créer les catégories dans la modale pour l'ajout de travaux 
function createOptions(id, name) {
  return `
    <option value="${name}">${id}</option>
  `
}

//Suppresion du token et redirection vers la page d'accueil classique 
function logout() {
  localStorage.removeItem("token")
  window.location.href = "index.html"
}


function userLoged() {
  // Récupérer le token depuis le localStorage :
  const token = localStorage.getItem("token")
  console.log(token)

  // Appliquer les styles si l'utilisateur est connecté.
  if (token !== null) {
    const editMode = document.querySelector(".edit-mode")// faire apparaitre la barre du haut
    editMode.style.display = "block"
    const logoutLink = document.getElementById("logout-link")//faire apparaitre le bouton logout
      logoutLink.style.display = "block"
      logoutLink.addEventListener("click", logout)
    const loginLink = document.getElementById("login-link")//faire disparaitre le bouton login
      loginLink.style.display = "none"
    const introLogo = document.querySelector(".intro-logo")//faire apparaitre le logo section intro
      introLogo.style.display = "block"
    const portfolioLogo = document.querySelector(".portfolio-logo")//faire apparaitre le logo section portfolio
      portfolioLogo.style.display = "block"
      portfolioLogo.style.marginBottom = "90px"
    const hideCategories = document.querySelector(".categories")//faire disparaitre les catégrories 
      hideCategories.style.display = "none"
  }
}

userLoged()

/************************************************************MODALE***********************************************************************/

//Faire apparaitre la modale
let modal = null

const displayModal = function (e) {
  e.preventDefault()
  const targetId = "#" + e.target.getAttribute("href")

  if (targetId) {
    const target = document.querySelector(targetId)

    if (target) {
      target.style.display = null
      target.removeAttribute("aria-hidden")
      target.setAttribute("aria-modal", "true")
      modal = target
      modal.addEventListener("click", closeModal)
      modal.querySelector(".closer").addEventListener("click", closeModal)
      modal.querySelector(".modal-stop").addEventListener("click", stopPropagation)
    }
  }
}

//Faire disparaitre la modale
const closeModal = function (e) {
  if (modal === null) return
  e.preventDefault()
      modal.style.display = "none"
      modal.setAttribute("aria-hidden", "true")
      modal.removeAttribute("aria-modal")
      modal.removeEventListener("click", closeModal)
      modal.querySelector(".closer").removeEventListener("click", closeModal)
      modal.querySelector(".modal-stop").removeEventListener("click", stopPropagation)
      modal = null
}

//Empêcher la fermeture au clique dans la modale
const stopPropagation = function (e) {
  e.stopPropagation()
}

//Ajout de l'eventListenner sur le logo
document.querySelector(".portfolio-logo").addEventListener("click", displayModal)

//Faire apparaitre et disparaitre la deuxieme modale
const addPhotoLink = document.getElementById('add-photo-link')
const secondModal = document.getElementById('modal2')
const firstModal = document.getElementById('modal1')
const returnLink = document.querySelector(".return")
const closeLink = document.querySelector("#modal2 .closer")

//Faire apparaitre la deuxième modale
addPhotoLink.addEventListener('click', function(event) {
  event.preventDefault()
  secondModal.style.display = null 
  firstModal.style.display = 'none'
})

//Retour à la première modale
returnLink.addEventListener("click", function (event) {
  event.preventDefault()
  secondModal.style.display = "none"
  firstModal.style.display = null
})

//Fermeture des 2 modales
closeLink.addEventListener("click", function (e) {
  e.preventDefault()
  secondModal.style.display = "none"
  firstModal.style.display = "none"
})

//Fermer la deuxieme modale au clique en dehors de la modale 
window.onclick = (event) => {
  if (event.target == secondModal) {
    secondModal.style.display = "none"
  }
}

/*******************************************************FIN MODALE**************************************************************************/

//Ajouter des works 
const form = document.querySelector(".modal-2-form")
 form.addEventListener("submit", async function (e) {
  e.preventDefault()
  const formData = new FormData(form)
  const work = await createWork(formData)
  // @TODO: Ajouter le travail dans la liste des travaux
  addToGallery(work)
  addToModalGallery(work)
})

//Faire apparaitre la miniature dans la modale
function previewImage() {
  const workImage = document.getElementById('file')
  const file = workImage.files[0]
  const imagePreviewContainer = document.querySelector('.ajout-photo')
  const workCategory = document.querySelector(".modal-2-form #categorie")
  const workTitle = document.querySelector(".modal-2-form #title")
  const modalSubmit = document.querySelector(".modal-submit")
  
  if(file.type.match('image.*')){
    const reader = new FileReader()
    
    reader.addEventListener('load', function (event) {
      const imageUrl = event.target.result
      const image = new Image()
      
      image.addEventListener('load', function() {
        imagePreviewContainer.innerHTML = '' 
        imagePreviewContainer.appendChild(image)
      })
      
      image.src = imageUrl
      image.style.width = '129px'
      image.style.height = '169px'
    })
    
    reader.readAsDataURL(file)
  }

  // Écouteur d'événement pour le champ image
  workImage.addEventListener('input', function() {
    validateInputs()
  })

  // Écouteur d'événement pour le champ catégorie
  workCategory.addEventListener('input', function() {
    validateInputs()
  })

  // Écouteur d'événement pour le champ titre
  workTitle.addEventListener('input', function() {
    validateInputs()
  })

  function validateInputs() {
    /*// Vérification de chaque champ d'entrée
    if (workImage.files[0]) {
      let showImage = document.querySelector(".ajout-photo")
      showImage.innerHTML = ""
    }*/
    if (workImage.files[0] && workCategory.value && workTitle.value) {
      modalSubmit.style.backgroundColor = "#1D6154"
    }
    else {
      modalSubmit.style.backgroundColor = "#A7A7A7"
    }
  }

}

function validateFileSize(event) {
  const file = event.target.files[0]
  const maxFileSize = 4 * 1024 * 1024 // 4 Mo en octets
  const fileTooBig = document.querySelector(".file-too-big")

  if (file && file.size > maxFileSize) {
    // Afficher un message d'erreur
    fileTooBig.style.display = "block"
    event.target.value = ""
  } else {
    // Appeler la fonction previewImage si la taille est valide
    previewImage() 
  }
}


const deleteAllButton = document.querySelector(".delete-all")
  deleteAllButton.addEventListener("click", deleteAllWorks)
  function deleteAllWorks() {
    for (let work of works) {
      deleteWork(work.id)
    }
    works = [] // Réinitialiser le tableau des travaux après suppression
    document.querySelector(".modal-gallery").innerHTML = "" // Effacer le contenu de la galerie dans la modale
    document.querySelector(".gallery").innerHTML = "" // Effacer le contenu de la galerie dans la page principale
  }


//A faire\\ 
//MODAL1 Rendre fonctionnel 'supprimer la galerie' (for of i--?)
//MODAL1 deletework a besoin de recharger la page pour être fonctionelle
//MOZILLA Token fonctionne pas sur mozilla 

//Détails\\ 
//MODAL2 Background fleche , couleur , (inserer dynamiquement? , voir commentaires,) 
//MODAL2 Trouver meilleur logo image pour modal2?
//MODAL1 Apparence modale 1 voir si mieux => max-height: calc(100vh - 30px); + overflow: auto; pour modal + regler param overflow
//Question à l'utilisateur avant suppression  

//GENERAL\\
//Renommer classe etc , utiliser plus de fonctions , syntaxe cohérente ("", '', ;, etc)