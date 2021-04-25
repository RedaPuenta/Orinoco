// Ici, on récupère le prix total, l'objet contact et le numéro de commande du SESSION STORAGE
let contact = JSON.parse(sessionStorage.getItem("Contact"))
let prixTotal = JSON.parse(sessionStorage.getItem("PrixTotal"))
let numberCommande = JSON.parse(sessionStorage.getItem("NumberCommande"))

// Ici, on distribut aux éléments appropriés, les valeurs récupérées dans le SESSION STORAGE
document.getElementById("number-commande").textContent = numberCommande
document.getElementById("first-name-commande").textContent = contact.firstName
document.getElementById("last-name-commande").textContent = contact.lastName
document.getElementById("address-commande").textContent = contact.address
document.getElementById("city-commande").textContent = contact.city
document.getElementById("mail-commande").textContent = contact.email
document.getElementById("prix-total-commande").textContent = (prixTotal/1000).toFixed(2) + " €"

// Enfin, on nettoie le SESSION STORAGE
sessionStorage.clear()