// Ici, on récupère dans l'URL, l'Id du produit ciblé
let params = (new URL(document.location)).searchParams
let IdSearch = params.get("id")

// Requête HHTP pour demander à l'API, les données du produit en question (méthode GET)
fetch(`http://localhost:3000/api/cameras/${IdSearch}`)

// 1ère Promesse --> On capture le produit en format JSON et on le transforme en objet JavaScript
.then(function(reponse){
    return reponse.json()
})

// 2ème Promesse --> On capture le nouveau objet contenant le produit
.then(function(reponse){

    // On exécute la fonction qui permet d'afficher le ou les produits ajoutés dans la page panier
    displayProductInProductPage(reponse)

    // On exécute la fonction qui permet d'ajouter un ou plusieurs dans le SESSION STORAGE (TRIÉ)
    addProductInSessionStorage(reponse)
    
})

// ERROR CATCH --> En cas d'erreur liés aux promesses, on affiche l'erreur dans la console
.catch(function (error){
    console.log(error);
})

// FONCTION --> Permet d'afficher le produit ciblé dans la page produit
function displayProductInProductPage(productCible){

    // Ici, dans la balise <article> de la page "product.html", on distribut à ses enfants, les valeurs du produit (id, image, nom, prix) 
    document.getElementById("image-product-focus").setAttribute("src", productCible.imageUrl)
    document.getElementById("name-product-focus").innerHTML = productCible.name
    document.getElementById("price-product-focus").innerHTML = priceInEuro(productCible.price)
    document.getElementById("description-product-focus").innerHTML = productCible.description

    // BOUCLE --> Celle-ci va nous servir à distribuer les données relatives aux "lentilles" du produit
    for (let i = 0; i < productCible.lenses.length; i++) {
        
        // On créer une nouvelle balise <option>, on lui donne une valeur de "lentille" et on l'insère dans son parent <select>
        let optionNew = document.createElement("option")
        optionNew.setAttribute("value", productCible.lenses[i])
        optionNew.innerHTML = productCible.lenses[i]
        document.getElementById("product-lenses").appendChild(optionNew)
    }
}

// FONCTION --> Permet d'ajouter un ou plusieurs dans le SESSION STORAGE (TRIÉ)
function addProductInSessionStorage(productCible){

    // Ici, on attrape les balises <input> qui se chargent de la personnalisation du produit (lentilles, quantité)
    let lensesOptional = document.getElementById("product-lenses")
    let quantity = document.getElementById("product-quantity")
    // Ici, on attrape la balise <button> qui se charge de l'ajout au panier
    let buttonAddPanier = document.getElementById("focus-product-shop")
    // Ici, on créer un tableau vide qui va accueillir les nouveaux produits à ajouter
    let articleAddFinally = []

    // EVENEMENT --> Ecoute le clic sur le bouton "Ajouter au panier"
    buttonAddPanier.addEventListener("click", function(event){
        
        // On retire le comportement par défaut du bouton
        event.preventDefault()
        
        // On créer un objet qui va contenir les informations sur le produit 
        let addNewArticle = {
            productId: productCible._id,
            productName: productCible.name,
            productImage: productCible.imageUrl,
            productPrice: productCible.price,
            productLenses: lensesOptional.value,
            productQuantity: quantity.textContent
        }

        // Si il n'y a pas de KEY enrengistré dans le SESSION STORAGE ...
        if (sessionStorage.getItem('TotalArticleAdd') === null) {

            // On ajoute le nouveau produit dans la liste
            articleAddFinally.push(addNewArticle)
            // Et on envoie cette liste dans le SESSION STORAGE
            sessionStorage.setItem("TotalArticleAdd", JSON.stringify(articleAddFinally))
        
        // Sinon, si il y a une déjà une KEY enrengistré dans le SESSION STORAGE ... 
        } else {

            // On récupère la liste de produit du SESSION STORAGE
            articleAddFinallyRecup = JSON.parse(sessionStorage.getItem('TotalArticleAdd'))

            // BOUCLE --> Celle-ci va nous servir à parcourir la liste de produit qui a été récupéré dans le SESSION STORAGE
            for (let i = 0; i < articleAddFinallyRecup.length; i++) {
                
                // Si dans la liste récupéré, il y a un produit qui a le même "Id" et le même "Lenses" que celui qui veut être ajouté ...
                if(articleAddFinallyRecup[i].productId == addNewArticle.productId && articleAddFinallyRecup[i].productLenses == addNewArticle.productLenses ){
                    
                    // On indique dans une 1ère variable qu'on a trouvé un produit similaire
                    var find = true
                    // On indique dans une 2ème variable l'index où se produit a été trouvé
                    var findIndex = i
                    // Et sors de la boucle (car ça sert à rien de continuer à chercher comme y aura pas d'autres produit similaire)
                    break
                }
            }

            // Si la boucle ci-dessus a trouvé un produit similaire à celui du produit qui veut être ajouté ...
            if (find === true) {

                // On rajoute seulement à la quantité du produit similaire, la quantité du produit qui veut être ajouté
                articleAddFinallyRecup[findIndex].productQuantity = parseInt(articleAddFinallyRecup[findIndex].productQuantity) + parseInt(addNewArticle.productQuantity)
                // Et on remplace la liste du SESSION STORAGE par la liste récupéré qu'on a mis à jour
                sessionStorage.setItem("TotalArticleAdd", JSON.stringify(articleAddFinallyRecup))
            
            // Sinon, si la boucle ci-dessus n'a pas trouvé un produit similaire à celui qui veut être ajouté ...  
            } else {

                // On ajoute le nouveau produit dans la liste récupéré
                articleAddFinallyRecup.push(addNewArticle)
                // On remplace la liste du SESSION STORAGE par la liste récupéré qu'on a mis à jour
                sessionStorage.setItem("TotalArticleAdd", JSON.stringify(articleAddFinallyRecup))
            }
        }

        // On exécute la fonction qui permet d'afficher, au-dessus de l'icone panier, le nombre totale de produit qui ont été ajouté
        displayNumberAbovePanier()
    })
}

// FONCTION --> Permet de faire fonctionner les bouttons de quantité
function btnQuantityBase(valueDefault){

    let btnQuantityList = document.querySelectorAll(".gen-btn-quantity")
 
     // Ici, on attrape les balises <button> qui se chargent de contrôler la quantité du produit
     let buttonMoins = document.querySelectorAll("#button-add-less")
     let buttonPlus = document.querySelectorAll("#button-add-more")
     
     // Ici, on attrape la balise <p> qui se charge de stocker et d'afficher la quantité du produit
     let resultQuantity = document.querySelectorAll("#product-quantity")
 
     for (let i = 0; i < btnQuantityList.length; i++) {
         
         // Ici, on ajoute dans la balise <p>, la quantité par défaut
         resultQuantity[i].textContent = valueDefault
     }
 
     for (let i = 0; i < btnQuantityList.length; i++) {
         
         // EVENEMENT --> Ecoute le clic sur le bouton + du contrôle de quantité
         buttonPlus[i].addEventListener("click", function(){
 
             // On ajoute 1 à la quantité
             resultQuantity[i].textContent = parseInt(resultQuantity[i].textContent) + 1
         })
 
         // EVENEMENT --> Ecoute le clic sur le bouton - du contrôle de quantité
         buttonMoins[i].addEventListener("click", function(){
 
             // Si la quantité est strictement supérieur à 1 ... (SÉCURITÉ)
             if(parseInt(resultQuantity[i].textContent) > 1){
 
                 // On enlève 1 à la quantité
                 resultQuantity[i].textContent = parseInt(resultQuantity[i].textContent) - 1
             }
         })
     }
 
 
}

// On éxécute la fonction qui permet de faire fonctionner les bouttons de quantité
btnQuantityBase(1)

// On exécute la fonction qui permet d'afficher, au-dessus de l'icone panier, le nombre totale de produit qui ont été ajouté
displayNumberAbovePanier()

// On exécute la fonction qui permet de bloquer l'accès au panier quand celui-ci est vide
stopAccessPanierEmpty()