function base_uri(){
    return "http://localhost:3000"
}

// FONCTION --> Permet de convertir les prix de l'API en EURO
function priceInEuro(price){
    
    // On prend le prix, on le divise par 1000, on garde 2 chiffre après la virgule, on ajoute le signe € et on retourne le résultat
    return ((parseInt(price))/1000).toFixed(2) + "€"
}

// FONCTION --> Permet d'afficher, au-dessus de l'icone panier, le nombre totale de produit qui ont été ajouté
function displayNumberAbovePanier(){
    
    // Si il y a au moins 1 objet dans le Session Storage ...
    if(sessionStorage.length >= 1 && sessionStorage.getItem('TotalArticleAdd') !== null){ 

        // On récupère la liste de produit du Session Storage
        let sessionStorageList = JSON.parse(sessionStorage.getItem('TotalArticleAdd'))
        
        // On créer une variable qui va accueillir la quantité totale de tout les produits de la commande
        let totalQuantity = 0
        
        // BOUCLE --> Celle-ci va nous servir à parcourir la liste de produit
        for (let i = 0; i < sessionStorageList.length; i++) {

            // Pour chaque produit, on récupère la quantité en remplissant la variable qui accueil la quantité totale
            totalQuantity = totalQuantity + parseInt(sessionStorageList[i].productQuantity)
        }

        // On affiche le quantité totale de la commande dans son emplacement (au dessus de l'icone panier)
        document.getElementById("number-in-panier").textContent = totalQuantity
    }
}

// FONCTION --> Permet de bloquer l'accès au panier quand celui-ci est vide
function stopAccessPanierEmpty(){

    // Ici, on attrape la balise <a> qui entoure l'icone panier
    let panierDirection = document.getElementById('panier-direction')

    // EVENEMENT --> Ecoute le clic sur l'icone panier
    panierDirection.addEventListener("click", function(event){

        // Si le SESSION STORAGE est vide ...
        if(sessionStorage.length == 0){
            
            // On bloque l'éxécution du "href" de la balise <a> qui entoure l'icone panier
            event.preventDefault()
        }
    })
}
