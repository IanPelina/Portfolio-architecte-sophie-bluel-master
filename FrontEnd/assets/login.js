// Submission du formulaire :
document.getElementById("login-form").addEventListener("submit", async function (event) {
    event.preventDefault(); // Empêcher le formulaire de se soumettre.

    // Récupérer les valeurs du formulaire :
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();

    // Vérifier que les champs ne sont pas vides :
    if (email && password) {
        // Envoyer les données à l'API :
        try {
            await login(email, password);
        // Capturer l'erreur :
        } catch (error) {
            console.error(error.message);
            document.getElementById("error-message").textContent = error.message;
        }

    }
});

async function login(email, password) {
    // Créer les options de la requête :
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "accept": "application/json"
        },
        // Envoyer les données dans le body de la requête :
        body: JSON.stringify({
            email: email,
            password: password
        })
    };

    // Envoyer la requête :
    const response = await fetch("http://localhost:5678/api/users/login", options);
    // Vérifier la réponse :
    if (response.ok) {
        // Extraire les données de la réponse :
        const data = await response.json();
        // Stocker le token dans le localStorage :
        localStorage.setItem("token", data.token);
        // Rediriger l'utilisateur vers la page d'accueil :
        window.location.href = "index.html";
    } else {
        // Lancer une nouvelle erreur :
        throw new Error("Erreur dans l’identifiant ou le mot de passe.");
    }

}

