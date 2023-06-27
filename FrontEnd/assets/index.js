// Variable globale pour stocker les works
let works = [];

// Fonction pour créer un élément figure
function createFigure(imageURL, title) {
  return `
    <figure>
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

// Récupérer les données des works depuis l'API
fetch("http://localhost:5678/api/works")
  .then(response => response.json())
  .then(data => {
    works = data; // Stocker les données des works

    // Parcourir les works et créer une figure pour chaque work
    for (let work of works) {
      // Ajouter la figure à la galerie
      document.querySelector(".gallery").innerHTML += createFigure(work.imageUrl, work.title);
    }
  });

// Récupérer les données des catégories depuis l'API et créer les boutons correspondants
fetch("http://localhost:5678/api/categories")
  .then(response => response.json())
  .then(categories => {
    // Parcourir les catégories et créer les boutons correspondants
    for (let categorie of categories) {
      document.querySelector(".categories").innerHTML += createInput(categorie.name, categorie.categoryId);
    }

    // Sélectionner le bouton "Tous"
    const allButton = document.querySelector(".categories input[value='Tous']");

    // Ajouter un écouteur d'événement au bouton "Tous"
    allButton.addEventListener("click", function () {
      document.querySelector(".gallery").innerHTML = "";
      for (let work of works) {
        document.querySelector(".gallery").innerHTML += createFigure(work.imageUrl, work.title);
      }
    });

    // Sélectionner les boutons de catégorie
    const categoryButtons = document.querySelectorAll(".categories input[type='button']:not([value='Tous'])");

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
          document.querySelector(".gallery").innerHTML += createFigure(work.imageUrl, work.title);
        }
      });
    });
  });

  // Récupérer le token depuis le localStorage :
const token = localStorage.getItem("token");
console.log(token);

if (token !== null) {
  // Appliquer les styles si l'utilisateur est connecté.
  let editBarr = document.querySelector(".edit-mode").innerHTML += (`<div class="editbarr">
  <div class="edit-logo"><i class="fa-regular fa-pen-to-square"></i>Mode édition</div>
  <div class="edit-btn"><p></p>publier les changements</div>
  </div>`);
  let navLinks = document.querySelector(".header-links").innerHTML = "";
  document.querySelector(".header-links").innerHTML += (`<li>projets</li>
  <li>contact</li><a id="logout-link" class="nav__link" href="index.html"><li>logout</li></a><li><img src="./assets/icons/instagram.png" alt="Instagram"></li>`);
  let introLogo = document.getElementById("image-and-logo").innerHTML = "";
  document.getElementById("image-and-logo").innerHTML += (`
  <img src="./assets/images/sophie-bluel.png" alt="">
  <div class="intro-logo"><i class="fa-regular fa-pen-to-square"></i>modifier</div>`);
  let createLogo = document.querySelector(".portfolio-title-and-logo").innerHTML = "";
  document.querySelector(".portfolio-title-and-logo").innerHTML += (`<div class="portfolio-title"><h2>Mes Projets</h2></div>
  <div class="portfolio-logo"><i class="fa-regular fa-pen-to-square"></i>modifier</div>`);
  let hideCategories = document.getElementById("portfolio").innerHTML = "";
  document.getElementById("portfolio").innerHTML += (`<div class="portfolio-title-and-logo"><div class="portfolio-title"><h2>Mes Projets</h2></div>
  <div class="portfolio-logo"><i class="fa-regular fa-pen-to-square"></i>modifier</div></div><div class="gallery">
  </div>`);
}


//Ajout de l'event listenner sur le lien logout 
const logoutLink = document.getElementById("logout-link");
logoutLink.addEventListener("click", logout);

//Suppresion du token et redirection vers la page d'accueil classique 
function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}

// Comment faire des requêtes en utilisant le token ?

async function deleteWork(id) {
  await fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
    }
  })
}