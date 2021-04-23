// On récupère la liste d'article du SESSION STORAGE
let sessionStorageList = JSON.parse(sessionStorage.getItem('TotalArticleAdd'))

// BOUCLE --> Celle-ci va nous servir à distribuer les données du nouvelle l'objet
for (let i = 0; i < sessionStorageList.length; i++) {

    // Ici, on attrape le <template> qu'on a créer dans la page "index.html"
    const templateProductList = document.getElementById("template-product-add")
    // Ici, on clone le <template>
    const templateProductListClone = document.importNode(templateProductList.content, true)
    // Ici, dans le <template> cloné, on distribut aux éléments appropriés, les valeurs du nouvelle objet (image, nom, prix)
    templateProductListClone.getElementById("product-add-image").setAttribute("src", sessionStorageList[i].productImage)
    templateProductListClone.getElementById("product-add-image").setAttribute("alt", "image de la caméra " + sessionStorageList[i].productName)
    templateProductListClone.getElementById("product-add-name").textContent = sessionStorageList[i].productName
    templateProductListClone.getElementById("product-add-lenses").textContent = sessionStorageList[i].productLenses
    templateProductListClone.getElementById("product-quantity").textContent = sessionStorageList[i].productQuantity
    templateProductListClone.getElementById("product-add-total").textContent = ((sessionStorageList[i].productPrice * parseInt(sessionStorageList[i].productQuantity))/1000).toFixed(2) + " €"
    // Ici, on ajoute le <template> personnalisé (nouvelle article) dans la page "index.html"
    document.getElementById("panier-group-article").appendChild(templateProductListClone)
}

// Ici, on créer une variable qui va accueillir le prix total de la commande
let totalPrice = 0

// BOUCLE --> Celle-ci va nous servir à controler les ajouts et les suppressions dans le panier
for (let i = 0; i < sessionStorageList.length; i++) {

    // Ici, on attrape les balises <button> qui se chargent de contrôler la quantité du produit
    let buttonMoins = document.querySelectorAll("#button-add-less")
    let buttonPlus = document.querySelectorAll("#button-add-more")
    // Ici, on attrape la balise <p> qui se charge de stocker et d'afficher la quantité du produit
    let resultQuantity = document.querySelectorAll("#product-quantity")
    // Ici, on attrape la balise <p> qui se charge de stocker et d'afficher la somme de la commande
    let articleTotalPrice = document.querySelectorAll("#product-add-total")

    // EVENEMENT --> Ecoute le clic sur le bouton + du contrôle de quantité
    buttonPlus[i].addEventListener("click", function(){

        // On ajoute 1 à la quantité
        resultQuantity[i].textContent = parseInt(resultQuantity[i].textContent) + 1
        // Dans la liste récupéré du SESSION STORAGE, on remplace la quantité de l'article ciblé par la nouvelle
        sessionStorageList[i].productQuantity = resultQuantity[i].textContent
        // On met à jour et on réaffiche le prix total de l'article ciblé
        articleTotalPrice[i].textContent = ((sessionStorageList[i].productPrice * parseInt(sessionStorageList[i].productQuantity))/1000).toFixed(2) + " €"
        // On met à jour le prix total de la commande
        totalPrice = totalPrice + parseInt(sessionStorageList[i].productPrice)
        // On réaffiche le prix total de la commande qui a été mis à jour
        document.getElementById("panier-total-price").textContent = (totalPrice/1000).toFixed(2) + " €"
        // On remplace la liste du SESSION STORAGE par la liste récupéré qu'on a mis à jour
        sessionStorage.setItem("TotalArticleAdd", JSON.stringify(sessionStorageList))
    })

    // EVENEMENT --> Ecoute le clic sur le bouton - du contrôle de quantité
    buttonMoins[i].addEventListener("click", function(){

        // Si la quantité est strictement supérieur à 1 ... (SÉCURITÉ)
        if(parseInt(resultQuantity[i].textContent) > 1){

            // On enlève 1 à la quantité
            resultQuantity[i].textContent = parseInt(resultQuantity[i].textContent) - 1
            // Dans la liste récupéré du SESSION STORAGE, on remplace la quantité de l'article ciblé par la nouvelle
            sessionStorageList[i].productQuantity = resultQuantity[i].textContent
            // On met à jour et on réaffiche le prix total de l'article ciblé
            articleTotalPrice[i].textContent = ((sessionStorageList[i].productPrice * parseInt(sessionStorageList[i].productQuantity))/1000).toFixed(2) + " €"
            // On met à jour le prix total de la commande
            totalPrice = totalPrice - parseInt(sessionStorageList[i].productPrice)
            // On réaffiche le prix total de la commande qui a été mis à jour
            document.getElementById("panier-total-price").textContent = (totalPrice/1000).toFixed(2) + " €"
            // On remplace la liste du SESSION STORAGE par la liste récupéré qu'on a mis à jour
            sessionStorage.setItem("TotalArticleAdd", JSON.stringify(sessionStorageList))
        }
    })

    // Ici, on attrape la balise <div> qui se charge de supprimer un article entier
    let deleteWholeArticle = document.querySelectorAll("#bouton-delete-article")
    // Ici, on attrape la balise <div> qui contient le message de "panier vide" (en display="none" par défaut)
    var messagePanierVide = document.getElementById("message-panier-vide")
    // EVENEMENT --> Ecoute le clic sur le bouton qui supprime l'article entier
    deleteWholeArticle[i].addEventListener("click", function(){

        // On supprime de liste récupéré l'article en question
        sessionStorageList.splice(i, 1)
        // On remplace la liste du SESSION STORAGE par la liste récupéré qu'on a mis à jour
        sessionStorage.setItem("TotalArticleAdd", JSON.stringify(sessionStorageList))

        // Si la taille de la liste récupéré est strictement supérieur à 0 ...
        if(sessionStorageList.length > 0){

            // On réactualise la page
            window.location.reload()
        
        // Sinon, si la taille de la liste récupéré est égale ou inférieur à 0 ...
        } else {

            // On nettoie le SESSION STORAGE
            sessionStorage.clear()
            // On affiche le massage de "panier vide"
            messagePanierVide.style.display = "flex"
            // Après 3s ...
            setTimeout(function(){
                // On revient sur la page d'accueil (METHODE POUR SITE NON HÉBERGÉ)
                window.location.assign(window.location.pathname.replace("pages/panier.html", "index.html"))
            } , 3000)
        }
    })

    // Ici, pour chaque article, on multiplie le prix par la quantité demandé en remplissant la variable qui accueil le prix total
    totalPrice = totalPrice + (parseInt(sessionStorageList[i].productPrice) * parseInt(sessionStorageList[i].productQuantity))
}

// Ici, on affiche le prix total de la commande dans son emplacement
document.getElementById("panier-total-price").textContent = (totalPrice/1000).toFixed(2) + " €"

// Ici, on attrape la balise <form> du formulaire
let formulaire = document.getElementById("formulaire-contact")

// EVENEMENT --> Ecoute la soumission du formulaire
formulaire.addEventListener("submit" ,function(event){
    
    // On retire le comportement par défaut de la soumission du formulaire
    event.preventDefault()
    
    // Ici, on créer un objet qui contient une partie des informations à envoyer au serveur (l'objet contact)
    let contact = {
        firstName: document.getElementById("form-first-name").value,
        lastName: document.getElementById("form-last-name").value,
        address: document.getElementById("form-adresse").value,
        city: document.getElementById("form-city").value,
        email: document.getElementById("form-email").value
    }

    // Ici, on créer un tableau vide qui va contenir une partie des informations à envoyer au serveur (tableau de produits)
    let products = []

    // Ici, on créer une variable qui va contenir le prix final de la commande
    var finalOrderPrice = 0

    // BOUCLE --> Celle-ci va nous servir à parcourir la liste d'article du SESSION STORAGE
    for (let i = 0; i < sessionStorageList.length; i++) {

        // BOUCLE --> Celle-ci va nous servir à répéter une opération en fonction de la quantité de chaque article
        for (let y = 0; y < parseInt(sessionStorageList[i].productQuantity); y++) {
            
            // Ici, on injecte dans le tableau de produit, l'ID (référence) du produit ciblé
            products.push(sessionStorageList[i].productId)
        }

        // Ici, pour chaque article, on multiplie le prix de l'article par sa quantité en remplissant la variable qui accueil le prix final de la commande
        finalOrderPrice = finalOrderPrice + (parseInt(sessionStorageList[i].productPrice) * parseInt(sessionStorageList[i].productQuantity))
    }

    // Ici, on stock et on transforme l'objet à envoyer au serveur au format JSON
    var order = JSON.stringify({
        contact, products
    })

    // On exécute la fonction qui envoie les informations de commande à l'API
    postOrder(order, finalOrderPrice)
})

// FONCTION --> Celle-ci va nous servir à envoyer des données à l'API et récupérer sa réponse
function postOrder(tosend, price){

    // Requête HHTP pour envoyer à l'API, les données de la commande (méthode GET)
    fetch("http://localhost:3000/api/cameras/order", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        },
        body: tosend
    })

    // 1ère Promesse --> On capture la réponse de l'API et on les transforment en objet JavaScript
    .then(function(reponse){
        return reponse.json()
    }) 

    // 2ème Promesse --> On capture le nouveau objet contenant les données renvoyé par l'API
    .then(function(reponse){

        // Ici, on stock le prix total, l'objet contact et le numéro de commande dans le SESSION STORAGE
        sessionStorage.setItem("PrixTotal", JSON.stringify(price))
        sessionStorage.setItem("Contact", JSON.stringify(reponse.contact))
        sessionStorage.setItem("NumberCommande", JSON.stringify(reponse.orderId))
    })

    // ERROR CATCH --> En cas d'erreur liés aux promesses, on affiche l'erreur dans la console
    .catch(function(error){
        console.log(error);
    })
}
