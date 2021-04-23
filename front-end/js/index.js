// Requête HHTP pour demander à l'API, la liste d'article (méthode GET)
fetch("http://localhost:3000/api/cameras")

// 1ère Promesse --> On capture la réponse de l'API et on les transforment en objet JavaScript
.then(function(reponse){
    return reponse.json()
})

// 2ème Promesse --> On capture le nouveau objet contenant les données de l'API
.then(function(reponse){

    // BOUCLE --> Celle-ci va nous servir à distribuer les données du nouvelle l'objet
    for (let i = 0; i < reponse.length; i++) {

        // Ici, on attrape le <template> qu'on a créer dans la page "index.html"
        const templateProductList = document.getElementById("template-product-list")
        // Ici, on clone le <template>
        const templateProductListClone = document.importNode(templateProductList.content, true)
        // Ici, dans le <template> cloné, on distribut aux éléments appropriés, les valeurs du nouvelle objet (id, image, nom, prix) 
        templateProductListClone.getElementById("collection-direction").setAttribute("href", "pages/product.html?id=" + reponse[i]._id)
        templateProductListClone.getElementById("image-product").setAttribute("src", reponse[i].imageUrl)
        templateProductListClone.getElementById("image-product").setAttribute("alt", "image de la caméra " + reponse[i].name)
        templateProductListClone.getElementById("name-product").textContent = reponse[i].name
        templateProductListClone.getElementById("price-product").textContent = (reponse[i].price/1000).toFixed(2) + "€"
        // Ici, on ajoute le <template> personnalisé (nouvelle article) dans la page "index.html"
        document.getElementById("collection__group__camera").appendChild(templateProductListClone)
    }
})

// ERROR CATCH --> En cas d'erreur liés aux promesses, on affiche l'erreur dans la console
.catch(function (error){
    console.log(error);
})

// Si il y a au moins 1 objet dans le Session Storage ...
if(sessionStorage.length >= 1 ){
    
    // On exécute la fonction qui affiche le nombre totale d'article qui ont été ajouté (dans l'icone panier)
    displayNumberInPanier()

}
