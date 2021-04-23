// Ici, on préviens JavaScript qu'on va chercher dans l'URL un paramètre
let params = (new URL(document.location)).searchParams

// Ici, on récupère la valeur du paramètre recherché (ID du produit)
let IdSearch = params.get("id")

// Requête HHTP pour demander à l'API, les données de l'article en question (méthode GET)
fetch(`http://localhost:3000/api/cameras/${IdSearch}`)

// 1ère Promesse --> On capture la réponse de l'API et on les transforment en objet JavaScript
.then(function(reponse){
    return reponse.json()
})

// 2ème Promesse --> On capture le nouveau objet contenant les données de l'API
.then(function(reponse){
    console.log(reponse)

    // Ici, dans <article> de la page "product.html", on distribut à ses enfants, les valeurs du nouvelle objet (id, image, nom, prix) 
    document.getElementById("image-product-focus").setAttribute("src", reponse.imageUrl)
    document.getElementById("name-product-focus").innerHTML = reponse.name
    document.getElementById("price-product-focus").innerHTML = (reponse.price/1000).toFixed(2) + " €"
    document.getElementById("description-product-focus").innerHTML = reponse.description

    // BOUCLE --> Celle-ci va nous servir à distribuer les données "lenses" du nouvelle l'objet
    for (let i = 0; i < reponse.lenses.length; i++) {
        
        // Ici, créer un nouveau élément <option>
        let optionNew = document.createElement("option")
        optionNew.setAttribute("value", reponse.lenses[i])
        document.getElementById("product-lenses").appendChild(optionNew)
        // Ici, dans ce nouveau élément <option>, on lui donne une valeur de "lenses"
        optionNew.innerHTML = reponse.lenses[i]
    }

    // On exécute la fonction qui va stocker les ajouts au panier
    saveArticleAdd(reponse)
})

// ERROR CATCH --> En cas d'erreur liés aux promesses, on affiche l'erreur dans la console
.catch(function (error){
    console.log(error);
})

// FONCTION --> Celle-ci va nous servir à stocker les ajouts au panier
function saveArticleAdd(reponse){

    // Ici, on attrape les balises <input> qui se chargent de la personnalisation du produit (lenses, quantité)
    let lensesOptional = document.getElementById("product-lenses")
    let quantity = document.getElementById("product-quantity")
    // Ici, on attrape la balise <button> qui se charge de l'ajout au panier
    let buttonAddPanier = document.getElementById("focus-product-shop")
    // Ici, on créer un tableau vide qui va accueillir les nouveaux articles à ajouter
    let articleAddFinally = []

    // EVENEMENT --> Ecoute le clic sur le bouton "Ajouter au panier"
    buttonAddPanier.addEventListener("click", function(event){
        
        // On retire le comportement par défaut du bouton
        event.preventDefault()
        
        // Ici, on créer un objet qui va contenir les informations sur l'article 
        let addNewArticle = {
            productId: reponse._id,
            productName: reponse.name,
            productImage: reponse.imageUrl,
            productPrice: reponse.price,
            productLenses: lensesOptional.value,
            productQuantity: quantity.textContent
        }

        // Si il n'y a pas de KEY enrengistré dans le SESSION STORAGE ...
        if (sessionStorage.getItem('TotalArticleAdd') === null) {

            // On ajoute le nouveau article dans la liste
            articleAddFinally.push(addNewArticle)
            // On envoie cette liste dans le SESSION STORAGE
            sessionStorage.setItem("TotalArticleAdd", JSON.stringify(articleAddFinally))
        
        
        // Sinon, si il y a une déjà une KEY enrengistré dans le SESSION STORAGE ... 
        } else {

            // On récupère la liste d'article du SESSION STORAGE
            articleAddFinallyRecup = JSON.parse(sessionStorage.getItem('TotalArticleAdd'))

            // BOUCLE --> Celle-ci va nous servir à parcourir la liste qui a été récupéré dans le SESSION STORAGE
            for (let i = 0; i < articleAddFinallyRecup.length; i++) {
                
                // Si dans la liste récupéré, il y a un article qui a le même "Id" et le même "Lenses" que celui qui veut être ajouté ...
                if(articleAddFinallyRecup[i].productId == addNewArticle.productId && articleAddFinallyRecup[i].productLenses == addNewArticle.productLenses ){
                    var find = true
                    var findIndex = i
                    break
                }
            }

            // Si la boucle ci-dessus a trouvé un article similaire à celui l'article qui veut être ajouté ...
            if (find === true) {

                // On rajoute seulement à la quantité de l'article similaire, la quantité de l'article qui veut être ajouté
                articleAddFinallyRecup[findIndex].productQuantity = parseInt(articleAddFinallyRecup[findIndex].productQuantity) + parseInt(addNewArticle.productQuantity)
                // On remplace la liste du SESSION STORAGE par la liste récupéré qu'on a mis à jour
                sessionStorage.setItem("TotalArticleAdd", JSON.stringify(articleAddFinallyRecup))
            
            // Sinon, si la boucle ci-dessus n'a pas trouvé un article similaire à celui qui va être ajouté ...  
            } else {

                // On ajoute le nouveau article dans la liste récupéré
                articleAddFinallyRecup.push(addNewArticle)
                // On remplace la liste du SESSION STORAGE par la liste récupéré qu'on a mis à jour
                sessionStorage.setItem("TotalArticleAdd", JSON.stringify(articleAddFinallyRecup))
            }
        }

        // On exécute la fonction qui affiche le nombre totale d'article qui ont été ajouté (dans l'icone panier)
        displayNumberInPanier()
    })
}

// Si il y a au moins 1 objet dans le Session Storage ...
if(sessionStorage.length >= 1 ){
    
    // On exécute la fonction qui affiche le nombre totale d'article qui ont été ajouté (dans l'icone panier)
    displayNumberInPanier()
}

// Ici, on attrape les balises <button> qui se chargent de contrôler la quantité du produit
let buttonMoins = document.getElementById("button-add-less")
let buttonPlus = document.getElementById("button-add-more")
// Ici, on attrape la balise <p> qui se charge de stocker et d'afficher la quantité du produit
let resultQuantity = document.getElementById("product-quantity")
// Ici, on ajoute dans la balise <p>, la quantité par défaut
resultQuantity.textContent = 1

// EVENEMENT --> Ecoute le clic sur le bouton + du contrôle de quantité
buttonPlus.addEventListener("click", function(){

    // On ajoute 1 à la quantité
    resultQuantity.textContent = parseInt(resultQuantity.textContent) + 1
})

// EVENEMENT --> Ecoute le clic sur le bouton - du contrôle de quantité
buttonMoins.addEventListener("click", function(){

    // Si la quantité est strictement supérieur à 1 ... (SÉCURITÉ)
    if(parseInt(resultQuantity.textContent) > 1){

        // On enlève 1 à la quantité
        resultQuantity.textContent = parseInt(resultQuantity.textContent) - 1
    }
})