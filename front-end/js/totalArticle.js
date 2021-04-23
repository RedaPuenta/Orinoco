// FONCTION --> Celle-ci va nous servir à afficher le nombre totale d'article qui ont été ajouté (dans l'icone panier)
function displayNumberInPanier(){
    
    // Ici, on récupère la liste des articles ajoutés dans le Session Storage
    let sessionStorageList = JSON.parse(sessionStorage.getItem('TotalArticleAdd'))
    // Ici, on créer une variable qui va accueillir la quantité totale d'article de la commande
    let totalQuantity = 0

    // BOUCLE --> Celle-ci va nous servir à récupérer le quantité totale d'article de la commande
    for (let i = 0; i < sessionStorageList.length; i++) {

        // Ici, pour chaque article, on récupère la quantité en remplissant la variable qui accueil la quantité totale
        totalQuantity = totalQuantity + parseInt(sessionStorageList[i].productQuantity)
    }

    // Ici, on affiche le quantité totale de la commande dans son emplacement (icone panier)
    document.getElementById("number-in-panier").textContent = totalQuantity
}

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
