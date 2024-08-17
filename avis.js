/* global Chart */
export function ajoutListenersAvis() {

    const piecesElements = document.querySelectorAll(".fiches article button");
 
    for (let i = 0; i < piecesElements.length; i++) {
 
    piecesElements[i].addEventListener("click", async function (event) {
 
        const id = event.target.dataset.id;
        const reponse = await fetch(`http://localhost:8081/pieces/${id}/avis`);
        const avis = await reponse.json();
        window.localStorage.setItem(`avis-piece-${id}`, JSON.stringify(avis))

        const pieceElement = event.target.parentElement;

        afficherAvis(pieceElement, avis)
        });
    }
}

export function afficherAvis(pieceElement, avis){
    const avisElement = document.createElement("p");
    for (let i = 0; i < avis.length; i++) {
        avisElement.innerHTML += `<b>${avis[i].utilisateur}:</b> ${avis[i].commentaire} ${avis[i].nbEtoiles} <br>`;
    }
    pieceElement.appendChild(avisElement);
}

export function ajoutListenerEnvoyerAvis() {
    const formulaireAvis = document.querySelector(".formulaire-avis");
    formulaireAvis.addEventListener("submit", function (event) {
    event.preventDefault();
    // Création de l’objet du nouvel avis.
    const avis = {
        pieceId: parseInt(event.target.querySelector("[name=piece-id]").value),
        utilisateur: event.target.querySelector("[name=utilisateur").value,
        commentaire: event.target.querySelector("[name=commentaire]").value,
        nbEtoiles: event.target.querySelector("[name=note]").value,
    };
    // Création de la charge utile au format JSON
    const chargeUtile = JSON.stringify(avis);
    // Appel de la fonction fetch avec toutes les informations nécessaires
    fetch("http://localhost:8081/avis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: chargeUtile
    });
    });
    
}

export async function afficherGraphiqueAvis(){
    // Votre code ici
    const labels = ["5", "4", "3", "2", "1"];
    // Données et personnalisation du graphique
    const data = {
        labels: labels,
        datasets: [{
        label: "Étoiles attribuées",
        data: nb_commentaires.reverse(),
        backgroundColor: "rgba(255, 230, 0, 1)", // couleur jaune
        }]
    };
    // Objet de configuration final
    const config = {
        type: "bar",
        data: data,
        options: {
            indexAxis: "y",
        },
    };
    // Rendu du graphique dans l'élément canvas
    new Chart(
    document.querySelector("#graphique-avis"),
    config,
    );
}
// Calcul du nombre total de commentaires par quantité d'étoiles attribuées
    const avis = await fetch("http://localhost:8081/avis").then(avis => avis.json());
    const nb_commentaires = [0, 0, 0, 0, 0];
    for (let commentaire of avis) {
      nb_commentaires[commentaire.nbEtoiles - 1]++;
    }



// Récuperation des pièces depuis le localStorage
const piecesJSON = window.localStorage.getItem("pieces");
const pieces = JSON.parse(piecesJSON);

export async function afficherGraphiqueNbAvis() {
    // Légende qui s'affichera sur la gauche à côté de la barre horizontale
    const labelsDispo = ["disponibles", "Non dispo."];

    // Données et personnalisation du graphique
    const dataDispo = {
        labels: labelsDispo,
        datasets: [{
        label: "Nombre de commentaire",
        data: [nb_commentairesDispo, nb_commentairesNonDispo],
        backgroundColor: "rgba(0, 230, 255, 1)", // couleur turquoise
        }]
    };
    // Objet de configuration final
    const configDispo = {
        type: "bar",
        data: dataDispo,
    };
    // Rendu du graphique dans l'élément canvas
    new Chart(
    document.querySelector("#graphique-Avis-Dispo"),
    configDispo,
    );
}
// Calcul du nombre total de commentaires deposée pour les pièces disponible ou non
    let nb_commentairesDispo = 0;
    let nb_commentairesNonDispo = 0;

    for (let i = 0; i < avis.length; i++) {
        const piece = pieces.find(p => p.id === avis[i].pieceId);

        if (piece) {
            if (piece.disponibilite) {
                nb_commentairesDispo++;
            } else {
                nb_commentairesNonDispo++;
            }
        }
    }

