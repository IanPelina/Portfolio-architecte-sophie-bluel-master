// Stock les données des works et des catégories
const data = {
  works: [],
  categories: []
};

// DOMContentLoaded se déclenche lorsque le contenu HTML de la page est chargé 
document.addEventListener("DOMContentLoaded", async function () {
  checkToken();
  await loadWorks();
  await loadCategories();
});

// Charge les works à partir de l'API
async function loadWorks() {
  data.works = await getWorks();
  renderFigures();
  addDeletionEvents();
}

// Génère et affiche les works dans la galerie
function renderFigures(works = data.works) {
  const gallery = document.querySelector(".gallery");
  const modalGallery = document.querySelector(".modal-gallery");
  gallery.innerHTML = String();
  modalGallery.innerHTML = String();
  for (let work of works) {
    createAndRenderFigure(work);
  }
}

// Crée un work et l'ajoute à la galerie de l'accueil et à la galerie de la modale
function createAndRenderFigure(work) {
  document.querySelector(".gallery").innerHTML += createFigure(work);
  document.querySelector(".modal-gallery").innerHTML += createFigure(work, true);
}

// Crée le code HTML pour les works et pour les works de la modale 
function createFigure(work, isModal = false) {
  const icons = isModal ? `
    <i class="trash fa-solid fa-trash-can"></i>
    <i class="move fa-solid fa-arrows-up-down-left-right"></i>
  ` : String();
  return `
    <figure data-id="${work.id}">
      ${icons}
      <img src="${work.imageUrl}" alt="${work.title}">
      <figcaption>${isModal ? "Éditer" : work.title}</figcaption>
    </figure>
  `;
}

// Ajoute des événements de suppression aux icônes de corbeille
function addDeletionEvents() {
  const trashes = document.querySelectorAll(".trash");
  for (let trash of trashes) {
    trash.removeEventListener("click", deleteAndRenderWork);
    trash.addEventListener("click", deleteAndRenderWork);
  }
}

// Supprime un work à la fois dans la galerie et dans la galerie modale
async function deleteAndRenderWork() {
  const { id } = this.parentElement.dataset;
  await deleteWork(id);
  document.querySelector(`.modal-gallery figure[data-id="${id}"]`).remove();
  document.querySelector(`.gallery figure[data-id="${id}"]`).remove();
}

// Charge les catégories à partir de l'API
async function loadCategories() {
  data.categories = await getCategories();
  renderFilters();
  renderSelector();
  addFiltersEvents();
}

// Génère et affiche les filtres de catégorie
function renderFilters(categories = data.categories) {
  const filters = document.querySelector(".categories");
  filters.innerHTML = `<input type="button" value="Tous" data-id="0">`;
  for (let category of categories) {
    filters.innerHTML += createFilter(category);
  }
}

// Crée le code HTML pour un filtre de catégorie en utilisant les données de la catégorie spécifiée
function createFilter(category) {
  return `<input type="button" value="${category.name}" data-id="${category.id}">`;
}

// Génère et affiche le sélecteur de catégorie
function renderSelector(categories = data.categories) {
  const selector = document.querySelector("#category");
  selector.innerHTML = `<option value="0" disabled selected>---</option>`;
  for (let category of categories) {
    selector.innerHTML += createOption(category);
  }
}

// Crée le code HTML pour une option de catégorie dans le sélecteur en utilisant les données de la catégorie spécifiée
function createOption(category) {
  return `<option value="${category.id}">${category.name}</option>`;
}

// Ajoute des événements de filtre aux boutons de catégorie
function addFiltersEvents() {
  const filters = document.querySelectorAll(".categories input[type='button']");
  for (let filter of filters) {
    filter.addEventListener("click", function () {
      const { id } = this.dataset;
      filterWorks(Number(id));
    });
  }
}

// Filtre les works en fonction de l'identifiant de catégorie spécifié
function filterWorks(id) {
  if (!id) {
    renderFigures();
  } else {
    const works = data.works.filter(work => work.categoryId === id);
    renderFigures(works);
  }
}

// Vérifie si un jeton est stocké dans la session
// Si oui, elle active le mode édition
function checkToken() {
  const token = sessionStorage.getItem("token");
  if (token) {
    renderEditionMode();
  }
}

// Active le mode édition en rendant certains éléments visibles
function renderEditionMode() {
  const logoutLink = document.getElementById("logout-link");
  logoutLink.style.display = "block";
  logoutLink.addEventListener("click", logout);

  const logo = document.querySelector(".portfolio-logo");
  logo.style.display = "block";
  logo.style.marginBottom = "90px";

  document.querySelector(".edit-mode").style.display = "block";
  document.getElementById("login-link").style.display = "none";
  document.querySelector(".intro-logo").style.display = "block";
  document.querySelector(".categories").style.display = "none";
}

// Supprime le jeton de la session et redirige l'utilisateur vers la page d'accueil
function logout() {
  sessionStorage.removeItem("token");
  window.location.href = "index.html";
}