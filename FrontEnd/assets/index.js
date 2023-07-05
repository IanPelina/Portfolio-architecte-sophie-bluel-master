// Variable globale pour stocker les works
let works = [];

// Fonction pour créer un élément figure
function createFigure(imageURL, title, id) {
  return `
    <figure data-id="${id}">
      <img src="${imageURL}" alt="${title}">
      <figcaption>${title}</figcaption>
    </figure>
  `;
}

// Fonction pour créer un bouton de catégorie
function createInput(name, categoryId) {
  return `
    <input type="button" value="${name}" data-category-id="${categoryId}">
  `;
} 

//Fonction pour créer la gallerie Modale
function createModalFigure(imageUrl, title, id) {
  const editTitle = "éditer";

  return `
    <figure data-id="${id}">
      <i class="trash fa-solid fa-trash-can"></i>
      <i class="move fa-solid fa-arrows-up-down-left-right"></i>      
      <img id="modal-image" src="${imageUrl}" alt="${title}">
      <figcaption id="modal-image-title">${editTitle}</figcaption>
    </figure>
  `;
}

// Récupérer les données des works depuis l'API
fetch("http://localhost:5678/api/works")
  .then(response => response.json())
  .then(data => {
    works = data; // Stocker les données des works

    // Parcourir les works et créer une figure pour chaque work
    for (let work of works) {
      // Ajouter la figure à la galerie
      document.querySelector(".gallery").innerHTML += createFigure(work.imageUrl, work.title, work.id);
      //ajout de cette ligne pour la modale
      document.querySelector(".modal-gallery").innerHTML += createModalFigure(work.imageUrl, work.title, work.id); 
    }
    // Ajouter les écouteurs d'événements aux icônes "trash"
    const trashes = document.querySelectorAll(".trash");
      for (let trash of trashes) {
      trash.addEventListener("click", function (event) {
        const id = event.target.parentElement.dataset.id;
        deleteWork(id).then(() => {
          document.querySelector(`.modal-gallery figure[data-id="${id}"]`).remove();
          document.querySelector(`.gallery figure[data-id="${id}"]`).remove();
        })
      });
    }
  });

// Récupérer les données des catégories depuis l'API et créer les boutons correspondants
fetch("http://localhost:5678/api/categories")
  .then(response => response.json())
  .then(categories => {
    // Parcourir les catégories et créer les boutons correspondants
    for (let categorie of categories) {
      const categoriesContainer = document.querySelector(".categories");
      if (categoriesContainer) {
        categoriesContainer.innerHTML += createInput(categorie.name, categorie.categoryId);
      }
    }

    // Sélectionner le bouton "Tous"
    const allButton = document.querySelector(".categories input[value='Tous']");

    // Ajouter un écouteur d'événement au bouton "Tous"
    if (allButton) {
      allButton.addEventListener("click", function () {
        document.querySelector(".gallery").innerHTML = "";
        for (let work of works) {
          document.querySelector(".gallery").innerHTML += createFigure(work.imageUrl, work.title, work.id);
        }
      });
    }
    else {
      console.error("L'élément 'allButton' n'a pas été trouvé.");
    }
    
    // Vérifier si l'élément avec la classe "categories" existe
    const categoriesElement = document.querySelector(".categories");
    if (categoriesElement) {
      // Sélectionner les boutons de catégorie
      const categoryButtons = categoriesElement.querySelectorAll("input[type='button']:not([value='Tous'])");

      // Ajouter les valeurs des attributs data-category-id aux boutons
      const categoryIds = [1, 2, 3]; // Les valeurs des attributs data-category-id correspondant aux boutons "Objets", "Appartements" et "Hotels & Restaurants"

      categoryButtons.forEach((button, index) => {
        button.dataset.categoryId = categoryIds[index];
      });

      // Ajouter un écouteur d'événement à chaque bouton de catégorie
      categoryButtons.forEach(button => {
        button.addEventListener("click", function () {
          const categoryId = parseInt(button.dataset.categoryId); // Récupérer la categoryId du bouton cliqué
          const filteredWorks = works.filter(function (work) {
            return work.categoryId === categoryId;
          });
          document.querySelector(".gallery").innerHTML = "";
          for (let work of filteredWorks) {
            document.querySelector(".gallery").innerHTML += createFigure(work.imageUrl, work.title, work.id);
          }
        });
      });
    }
  });

// Récupérer le token depuis le localStorage :
const token = localStorage.getItem("token");
console.log(token);

// Appliquer les styles si l'utilisateur est connecté.
if (token !== null) {
  let editMode = document.querySelector(".edit-mode"); // faire apparaitre la barre du haut
  editMode.style.display = "block";
  let logoutLink = document.getElementById("logout-link");//faire apparaitre le bouton logout
    logoutLink.style.display = "block";
  let loginLink = document.getElementById("login-link");//faire disparaitre le bouton login
    loginLink.style.display = "none";
  let introLogo = document.querySelector(".intro-logo");//faire apparaitre le logo section intro
    introLogo.style.display = "block";
  let portfolioLogo = document.querySelector(".portfolio-logo");//faire apparaitre le lofo section portfolio
    portfolioLogo.style.display = "block";
    portfolioLogo.style.marginBottom = "90px";
  let hideCategories = document.querySelector(".categories");//faire disparaitre les catégrories 
    hideCategories.style.display = "none";
}

//Ajout de l'event listenner sur le lien logout 
const logoutLink = document.getElementById("logout-link");
logoutLink.addEventListener("click", logout);
//Suppresion du token et redirection vers la page d'accueil classique 
function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}

//Faire apparaitre la modale
let modal = null

const displayModal = function (e) {
  e.preventDefault();
  const targetId = "#" + e.target.getAttribute("href");

  if (targetId) {
    const target = document.querySelector(targetId);

    if (target) {
      target.style.display = null;
      target.removeAttribute("aria-hidden");
      target.setAttribute("aria-modal", "true");
      modal = target
      modal.addEventListener("click", closeModal)
      modal.querySelector(".closer").addEventListener("click", closeModal)
      modal.querySelector(".modal-stop").addEventListener("click", stopPropagation)
    }
  }
};

//Faire disparaitre la modale
const closeModal = function (e) {
  if (modal === null) return
  e.preventDefault()
      modal.style.display = "none";
      modal.setAttribute("aria-hidden", "true");
      modal.removeAttribute("aria-modal");
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
document.querySelector(".portfolio-logo").addEventListener("click", displayModal);
/*
si on veut rendre focntionnels tous les liens 
document.querySelectorAll("attrribuer un nom pour tous les liens").forEach(a => {
  a.addEventListener("click", displayModal);
});*/

// Comment faire des requêtes en utilisant le token ?
async function deleteWork(id) {
  await fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  })
}


//A faire 
//Ajouter un event listenner sur le bouton "ajouter une photo" pour faire apparaitre la seconde modale --OK--//
//Creer la seconde modale --OK--//
//Compléter deleteWork pour la suppression des travaux --OK--//
//Fermer modal2 --OK--//
//Rendre possible l'ajout/suppresion de travaux sans recharger la page  --OK Suppression 1/2--
//Rendre possible l'ajout de travaux 
//Rendre fonctionnel 'supprimer la galerie' (for of i--?)

//Détails 
//Background fleche , couleur , (inserer dynamiquement? , voir commentaires,)
//Apparence modal1 
//Trouver meilleure image pour modal2?

//test3
//Faire apparaitre la deuxieme modale
let addPhotoLink = document.getElementById('add-photo-link')
let secondModal = document.getElementById('modal2')
let firstModal = document.getElementById('modal1')

addPhotoLink.addEventListener('click', function(event) {
  
  event.preventDefault()

  secondModal.style.display = null 

  firstModal.style.display = 'none'
});


//Retour à la première modale
let returnLink = document.querySelector(".return")

returnLink.addEventListener("click", function (event) {

  event.preventDefault()

  secondModal.style.display = "none"

  firstModal.style.display = null

});

//Fermeture des 2 modales
let closeLink = document.querySelector("#modal2 .closer")

closeLink.addEventListener("click", function (e) {

  e.preventDefault()
  
  secondModal.style.display = "none"

  firstModal.style.display = "none"

});

//Fermer la deuxieme modale au clique en dehors de la modale 
window.onclick = function(event) {
  if (event.target == secondModal) {
    secondModal.style.display = "none";
  }
}

//Ajouter des works 
let form = document.querySelector(".modal-2-form")
 form.addEventListener("submit", async function (e) {
  e.preventDefault();
  const formData = new FormData(form);
  const work = await createWork(formData);
  // @TODO: Ajouter le travail dans la liste des travaux.
});

async function createWork(formData) {
  const response = await fetch(`http://localhost:5678/api/works`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: formData,
  })
  return await response.json();
}