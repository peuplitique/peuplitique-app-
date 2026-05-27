function envoyerVote() {
    const choix = document.getElementById("vote").value;

    if (!choix) {
        document.getElementById("resultat").innerHTML = "Veuillez choisir une option.";
        return;
    }

    document.getElementById("resultat").innerHTML =
        "Votre vote a été enregistré : <strong>" + choix + "</strong>";
}
