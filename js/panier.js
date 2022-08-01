// On récupère la liste de produit du SESSION STORAGE
var sessionStorageList = JSON.parse(sessionStorage.getItem('TotalArticleAdd'))

// Ici, on créer une variable qui va accueillir le prix total de la commande
var totalPrice = 0

// FONCTION --> Permet d'afficher le ou les produits ajoutés dans la page panier
function displayProductInPanierPage(){

    // BOUCLE --> Celle-ci va nous servir à parcourir la liste de produit du SESSION STORAGE
    for (let i = 0; i < sessionStorageList.length; i++) {

        // On attrape le <template> qu'on a créer dans la page "index.html"
        const templateProductList = document.getElementById("template-product-add")
        // On clone ce <template>
        const templateProductListClone = document.importNode(templateProductList.content, true)
        // Dans ce <template> cloné, on distribut aux éléments appropriés, les valeurs du nouvelle objet (image, nom, prix)
        templateProductListClone.getElementById("product-add-image").setAttribute("src", sessionStorageList[i].productImage)
        templateProductListClone.getElementById("product-add-image").setAttribute("alt", "image de la caméra " + sessionStorageList[i].productName)
        templateProductListClone.getElementById("product-add-name").textContent = sessionStorageList[i].productName
        templateProductListClone.getElementById("product-add-lenses").textContent = sessionStorageList[i].productLenses
        templateProductListClone.getElementById("product-quantity").textContent = sessionStorageList[i].productQuantity
        templateProductListClone.getElementById("product-add-total").textContent = priceInEuro(sessionStorageList[i].productPrice * parseInt(sessionStorageList[i].productQuantity))
        // Et on ajoute le <template> personnalisé (nouvelle article) dans la page "index.html"
        document.getElementById("panier-group-article").appendChild(templateProductListClone)
    }
}

// FONCTION --> Permet d'afficher le prix total de la commande dans la page panier
function priceTotalPanier(){

    // BOUCLE --> Celle-ci va nous servir à parcourir la liste de produit du SESSION STORAGE
    for (let i = 0; i < sessionStorageList.length; i++) { 

        // Pour chaque produit, on multiplie son prix par sa quantité en remplissant la variable qui accueil le prix total
        totalPrice = totalPrice + (parseInt(sessionStorageList[i].productPrice) * parseInt(sessionStorageList[i].productQuantity))
    }
    
    // Ici, on affiche le prix total de la commande dans son emplacement
    document.getElementById("panier-total-price").textContent = priceInEuro(totalPrice)
}

// FONCTION --> Permet de modifier les quantités des produits directement dans la page panier
function btnQuantitySpecialPanier(){

    // Ici, on attrape les balises <button> qui se chargent de contrôler la quantité du produit
    let buttonMoins = document.querySelectorAll("#button-add-less")
    let buttonPlus = document.querySelectorAll("#button-add-more")
    // Ici, on attrape la balise <p> qui se charge de stocker et d'afficher la quantité du produit
    let resultQuantity = document.querySelectorAll("#product-quantity")
    // Ici, on attrape la balise <p> qui se charge de stocker et d'afficher la somme de la commande
    let articleTotalPrice = document.querySelectorAll("#product-add-total")

    // BOUCLE --> Celle-ci va nous servir à parcourir la liste de produit du SESSION STORAGE
    for (let i = 0; i < sessionStorageList.length; i++) {

        // EVENEMENT --> Ecoute le clic sur le bouton +
        buttonPlus[i].addEventListener("click", function(){

            // On ajoute 1 à la quantité
            resultQuantity[i].textContent = parseInt(resultQuantity[i].textContent) + 1
            // Dans la liste du SESSION STORAGE, on remplace la quantité du produit ciblé par la nouvelle
            sessionStorageList[i].productQuantity = resultQuantity[i].textContent
            // On met à jour et on réaffiche le prix total du produit ciblé
            articleTotalPrice[i].textContent = priceInEuro(sessionStorageList[i].productPrice * parseInt(sessionStorageList[i].productQuantity))
            // On met à jour le prix total de la commande
            totalPrice = totalPrice + parseInt(sessionStorageList[i].productPrice)
            // On réaffiche le prix total de la commande qui a été mis à jour
            document.getElementById("panier-total-price").textContent = priceInEuro(totalPrice)
            // On remplace la liste du SESSION STORAGE par la liste qu'on a mis à jour
            sessionStorage.setItem("TotalArticleAdd", JSON.stringify(sessionStorageList))
        })

        // EVENEMENT --> Ecoute le clic sur le bouton -
        buttonMoins[i].addEventListener("click", function(){

            // Si la quantité est strictement supérieur à 1 ... (SÉCURITÉ)
            if(parseInt(resultQuantity[i].textContent) > 1){

                // On enlève 1 à la quantité
                resultQuantity[i].textContent = parseInt(resultQuantity[i].textContent) - 1
                // Dans la liste du SESSION STORAGE, on remplace la quantité du produit ciblé par la nouvelle
                sessionStorageList[i].productQuantity = resultQuantity[i].textContent
                // On met à jour et on réaffiche le prix total du produit ciblé
                articleTotalPrice[i].textContent = priceInEuro(sessionStorageList[i].productPrice * parseInt(sessionStorageList[i].productQuantity))
                // On met à jour le prix total de la commande
                totalPrice = totalPrice - parseInt(sessionStorageList[i].productPrice)
                // On réaffiche le prix total de la commande qui a été mis à jour
                document.getElementById("panier-total-price").textContent = priceInEuro(totalPrice)
                // On remplace la liste du SESSION STORAGE par la liste qu'on a mis à jour
                sessionStorage.setItem("TotalArticleAdd", JSON.stringify(sessionStorageList))
            }
        })
    }
}

// FONCTION --> Permet de supprimer un produit entier directement dans la page panier
function deleteWholeProduct(){

    // Ici, on attrape la balise <button> qui se charge de supprimer un article entier
    let deleteWholeArticle = document.querySelectorAll("#bouton-delete-article")
    // Ici, on attrape la balise <div> qui contient le message de "panier vide" (par défaut en display=none)
    var messagePanierVide = document.getElementById("message-panier-vide")

    // BOUCLE --> Celle-ci va nous servir à parcourir la liste de produit du SESSION STORAGE
    for (let i = 0; i < sessionStorageList.length; i++) { 
        
        // EVENEMENT --> Ecoute le clic sur le bouton qui supprime l'article entier
        deleteWholeArticle[i].addEventListener("click", function(){

            // On supprime de la liste, le produit en question
            sessionStorageList.splice(i, 1)
            // On remplace la liste de produit du SESSION STORAGE par la liste qu'on a mis à jour
            sessionStorage.setItem("TotalArticleAdd", JSON.stringify(sessionStorageList))

            // Si la taille de la liste est strictement supérieur à 0 ...
            if(sessionStorageList.length > 0){

                // On réactualise la page
                window.location.reload()
            
            // Sinon, si la taille de la liste est égale à 0 ...
            } else {

                // On nettoie le SESSION STORAGE
                sessionStorage.clear()
                // On affiche le message de "panier vide"
                messagePanierVide.style.display = "flex"
                // Après 3s ...
                setTimeout(function(){
                    
                    // On revient sur la page d'accueil (METHODE POUR SITE NON HÉBERGÉ)
                    window.location.assign(window.location.pathname.replace("pages/panier.html", "index.html"))

                } , 3000)
            }
        })
    }
}

// FONCTION --> Permet de préparer les données relatives à la commande qui vont être envoyer à l'API
function formulaireSubmit(){
    
    // Ici, on attrape la balise <form> du formulaire
    let formulaire = document.getElementById("formulaire-contact")

    // EVENEMENT --> Ecoute la soumission du formulaire
    formulaire.addEventListener("submit" ,function(event){
        
        // On retire le comportement par défaut de la soumission du formulaire
        event.preventDefault()
        
        // On créer un objet qui contient des informations à envoyer au serveur (l'objet contact)
        let contact = {
            firstName: document.getElementById("form-first-name").value,
            lastName: document.getElementById("form-last-name").value,
            address: document.getElementById("form-adresse").value,
            city: document.getElementById("form-city").value,
            email: document.getElementById("form-email").value
        }

        // On créer un tableau vide qui va contenir des informations à envoyer au serveur (tableau de produits)
        let products = []

        // On créer une variable qui va contenir le prix final de la commande
        var finalOrderPrice = 0

        // BOUCLE --> Celle-ci va nous servir à parcourir la liste de produit du SESSION STORAGE
        for (let i = 0; i < sessionStorageList.length; i++) {

            // BOUCLE --> Celle-ci va nous servir à répéter une opération en fonction de la quantité de chaque produit
            for (let y = 0; y < parseInt(sessionStorageList[i].productQuantity); y++) {
                
                // On injecte dans le tableau de produit, l'ID (référence) du produit ciblé
                products.push(sessionStorageList[i].productId)
            }

            // On multiplie le prix du produit par sa quantité en remplissant la variable qui accueil le prix final de la commande
            finalOrderPrice = finalOrderPrice + (parseInt(sessionStorageList[i].productPrice) * parseInt(sessionStorageList[i].productQuantity))
        }

        // On stock et on transforme l'objet à envoyer au serveur en objet JSON
        var order = JSON.stringify({
            contact, products
        })

        // On exécute la fonction qui permet d'envoyer des données à l'API et de récupérer sa réponse
        postOrder(order, finalOrderPrice)
    })
}

// FONCTION --> Permet d'envoyer les données relatives à la commande à l'API et de récupérer sa réponse
function postOrder(tosend, price){

    // Requête HHTP pour envoyer à l'API, les données de la commande (méthode POST)
    fetch("http://localhost:3000/api/cameras/order", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        },
        body: tosend
    })

    // 1ère Promesse --> On capture la réponse de l'API et on la transforment en objet JavaScript
    .then(function(reponse){
        return reponse.json()
    }) 

    // 2ème Promesse --> On capture le nouveau objet contenant les données renvoyé par l'API
    .then(function(reponse){

        // On stock le prix total, l'objet contact et le numéro de commande dans le SESSION STORAGE
        sessionStorage.setItem("PrixTotal", JSON.stringify(price))
        sessionStorage.setItem("Contact", JSON.stringify(reponse.contact))
        sessionStorage.setItem("NumberCommande", JSON.stringify(reponse.orderId))

        // On redirige la page vers la page de confirmation (METHODE POUR SITE NON HÉBERGÉ)
        window.location.assign(window.location.pathname.replace("panier.html", "confirmation.html"))
    })

    // ERROR CATCH --> En cas d'erreur liés aux promesses, on affiche l'erreur dans la console
    .catch(function(error){
        console.log(error);
    })
}

// On éxécute la fonction qui permet d'afficher le ou les produits ajoutés dans la page panier
displayProductInPanierPage()

// On éxécute la fonction qui permet d'afficher le prix total de la commande dans la page panier
priceTotalPanier()

// On éxécute la fonction qui permet de modifier les quantités de produits directement dans la page panier
btnQuantitySpecialPanier()

// On éxécute la fonction qui permet de supprimer un produit entier directement dans la page panier
deleteWholeProduct()

// On éxécute la fonction qui permet de préparer les données à envoyer à l'API (celle-ci éxécutera automatiquement la fonction postOrder())
formulaireSubmit()