// Effectuer une requête GET à l'API pour récupérer les works
async function getWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  return  await response.json();
}

// Effectuer une requête GET à l'API pour récupérer les catégories
async function getCategories() {
  const response = await fetch("http://localhost:5678/api/categories");
  return await response.json();
}

// Effectuer une requête DELETE à l'API pour supprimer un work par son ID
async function deleteWork(id) {
  const token = sessionStorage.getItem("token");
  if (token) {
    await fetch(`http://localhost:5678/api/works/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
  }
}

// Effectuer une requête POST à l'API pour créer un work
async function createWork(form) {
  const token = sessionStorage.getItem("token");
  if (token) {
    const response = await fetch(`http://localhost:5678/api/works`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
      },
      body: form
    });
    return await response.json();
  }
  return null;
}