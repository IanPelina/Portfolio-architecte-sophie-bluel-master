document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Empêcher le formulaire de se soumettre

    // Récupérer les valeurs du formulaire
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    // Vérifier les informations utilisateur/mot de passe
    if (email === "email@example.com" && password === "motdepasse") {
        // Redirection vers la page d'accueil
        window.location.href = "./index.html";
    } else {
        document.getElementById("error-message").textContent = "Erreur dans l’identifiant ou le mot de passe";
    }
});