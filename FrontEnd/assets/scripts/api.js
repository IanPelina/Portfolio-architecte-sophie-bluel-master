const API_URL = "http://localhost:5678/api";

async function get(endpoint) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`);
    return  await response.json();
  } catch (error) {
    console.error(error);
  }
}

// Effectuer une requête GET à l'API pour récupérer les works
async function getWorks() {
  return await get("/works");
}

// Effectuer une requête GET à l'API pour récupérer les catégories
async function getCategories() {
  return await get("/categories");
}

// Effectuer une requête DELETE à l'API pour supprimer un work par son ID
async function deleteWork(id) {
  const token = sessionStorage.getItem("token");
  if (token) {
    await fetch(`${API_URL}/works/${id}`, {
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
    try {
      const response = await fetch(`${API_URL}/works`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: form
      });
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  }
  return null;
}