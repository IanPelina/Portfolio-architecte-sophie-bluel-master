// Récupérer les données des works depuis l'API
fetch("http://localhost:5678/api/works")
  .then(response => response.json())
  .then(data => {
    works = data // Stocker les données des works
    createFigures()
    // Ajouter les écouteurs d'événements aux icônes "trash"
    const trashes = document.querySelectorAll(".trash")
      for (let trash of trashes) {
      trash.addEventListener("click", function (event) {
        const id = event.target.parentElement.dataset.id
        deleteWork(id).then(() => {
          document.querySelector(`.modal-gallery figure[data-id="${id}"]`).remove()
          document.querySelector(`.gallery figure[data-id="${id}"]`).remove()
        })
      })
    }
})

// Récupérer les données des catégories depuis l'API et créer les boutons correspondants
fetch("http://localhost:5678/api/categories")
.then(response => response.json())
.then(categories => {
  // Parcourir les catégories et créer les boutons correspondants
  for (let categorie of categories) {
    const categoriesContainer = document.querySelector(".categories")
    if (categoriesContainer) {
      categoriesContainer.innerHTML += createInput(categorie.name, categorie.id)
    }
    const optionsContainer = document.querySelector("#categorie")
      if (optionsContainer) {
        optionsContainer.innerHTML += createOptions(categorie.name, categorie.id)
    }
  }

  // Sélectionner le bouton "Tous"
  const allButton = document.querySelector(".categories input[value='Tous']")

  // Ajouter un écouteur d'événement au bouton "Tous"
  if (allButton) {
    allButton.addEventListener("click", function () {
      document.querySelector(".gallery").innerHTML = ""
      createFigures(createFigure)
    })
  }
  else {
    console.error("L'élément 'allButton' n'a pas été trouvé.")
  }
  
  // Vérifier si l'élément avec la classe "categories" existe
  const categoriesElement = document.querySelector(".categories")
  if (categoriesElement) {
    // Sélectionner les boutons de catégorie
    const categoryButtons = categoriesElement.querySelectorAll("input[type='button']:not([value='Tous'])")

    // Ajouter un écouteur d'événement à chaque bouton de catégorie
    categoryButtons.forEach(button => {
      button.addEventListener("click", function () {
        const categoryId = parseInt(button.dataset.categoryId) // Récupérer la categoryId du bouton cliqué
        const filteredWorks = works.filter(function (work) {
          return work.categoryId === categoryId
        })
        document.querySelector(".gallery").innerHTML = ""
        //create figures possible?
        for (let work of filteredWorks) {
          document.querySelector(".gallery").innerHTML += createFigure(work.imageUrl, work.title, work.id)
        }
      })
    })
  }
})

// Comment faire des requêtes en utilisant le token ?
async function deleteWork(id) {
    await fetch(`http://localhost:5678/api/works/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
}

//Ajouter des works
async function createWork(formData) {
    const response = await fetch(`http://localhost:5678/api/works`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
      },
      body: formData,
    })
    return await response.json()
}