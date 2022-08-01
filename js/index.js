// Requête HHTP pour demander à l'API, la liste de produit (méthode GET)
fetch(`${base_uri()}/cameras`)

// 1ère Promesse --> On capture la liste de produit en format JSON et on la transforme en objet JavaScript
.then(function(reponse){
    return reponse.json()
})

// 2ème Promesse --> On capture le nouveau objet contenant la liste de produit
.then(function(reponse){

    // On exécute la fonction qui permet d'afficher la liste de produit dans la page d'accueil
    displayProductInHomePage(reponse)

})

// ERROR CATCH --> En cas d'erreur liés aux promesses, on affiche l'erreur dans la console
.catch(function (error){
    console.log(error);
})

// FONCTION --> Permet d'afficher la liste de produit dans la page d'accueil
function displayProductInHomePage(productList) {
    
    // BOUCLE --> Celle-ci va nous servir à parcourir la liste de produit
    for (let i = 0; i < productList.length; i++) {

        // On attrape le <template> qu'on a créer dans la page "index.html"
        const templateProductList = document.getElementById("template-product-list")
        // On clone ce <template>
        const templateProductListClone = document.importNode(templateProductList.content, true)
        // Dans ce <template> cloné, on distribut aux éléments appropriés, les valeurs de la liste de produit (id, image, nom, prix) 
        templateProductListClone.getElementById("collection-direction").setAttribute("href", "pages/product.html?id=" + productList[i]._id)
        templateProductListClone.getElementById("image-product").setAttribute("src", productList[i].imageUrl)
        templateProductListClone.getElementById("image-product").setAttribute("alt", "image de la caméra " + productList[i].name)
        templateProductListClone.getElementById("name-product").textContent = productList[i].name
        templateProductListClone.getElementById("price-product").textContent = priceInEuro(productList[i].price)
        // Et on ajoute le <template> personnalisé (nouveau produit) dans la page "index.html"
        document.getElementById("collection__group__camera").appendChild(templateProductListClone)
    }
}

// On exécute la fonction qui permet d'afficher, au-dessus de l'icone panier, le nombre totale de produit qui ont été ajouté
displayNumberAbovePanier()

// On exécute la fonction qui permet de bloquer l'accès au panier quand celui-ci est vide
stopAccessPanierEmpty()