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
          document.querySelector(".gallery").innerHTML += createFigure(work.imageUrl, work.title);
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
            document.querySelector(".gallery").innerHTML += createFigure(work.imageUrl, work.title);
          }
        });
      });
    }
  });

  // Récupérer le token depuis le localStorage :
const token = localStorage.getItem("token");
console.log(token);

if (token !== null) {
  // Appliquer les styles si l'utilisateur est connecté.
  let editMode = document.querySelector(".edit-mode");
  editMode.style.display = "block";
  let logoutLink = document.getElementById("logout-link");
    logoutLink.style.display = "block";
  let loginLink = document.getElementById("login-link");
    loginLink.style.display = "none";
  let introLogo = document.querySelector(".intro-logo");
    introLogo.style.display = "block";
  let portfolioLogo = document.querySelector(".portfolio-logo");
    portfolioLogo.style.display = "block";
    portfolioLogo.style.marginBottom = "90px";
  let hideCategories = document.querySelector(".categories");
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

// Comment faire des requêtes en utilisant le token ?

async function deleteWork(id) {
  await fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
    }
  })
}