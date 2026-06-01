/* ============================
   MULTILINGUE
============================ */

const translations = {
    "en": {
        "title_vote": "Vote – Peuplitique",
        "subtitle_vote": "Citizen platform – Secure voting",

        "menu_home": "Home",
        "menu_governance": "Shared Governance",
        "menu_imbalance": "Structural Imbalances",
        "menu_economy": "Integrated Economy",
        "menu_structure": "Structural Organisation",
        "menu_protocol": "Protocol",
        "menu_glossary": "Glossary",
        "menu_vote": "Vote Token",

        "vote_title": "Citizen Vote",
        "vote_subtitle": "One token. One vote. One verifiable proof.",

        "token_title": "Token generation",
        "btn_generate": "Generate a token",

        "vote_choice_title": "Choose your vote",
        "opt_A": "Option A",
        "opt_B": "Option B",
        "opt_abs": "Abstention",

        "btn_validate": "Validate my vote",

        "footer": "© 2026 Peuplitique – All rights reserved"
    },

    "es": {
        "title_vote": "Voto – Peuplitique",
        "subtitle_vote": "Plataforma ciudadana – Voto seguro",

        "menu_home": "Inicio",
        "menu_governance": "Gobernanza compartida",
        "menu_imbalance": "Desequilibrios estructurales",
        "menu_economy": "Economía integrada",
        "menu_structure": "Organización estructural",
        "menu_protocol": "Protocolo",
        "menu_glossary": "Glosario",
        "menu_vote": "Token de Voto",

        "vote_title": "Voto ciudadano",
        "vote_subtitle": "Un token. Un voto. Una prueba verificable.",

        "token_title": "Generación del token",
        "btn_generate": "Generar un token",

        "vote_choice_title": "Elige tu voto",
        "opt_A": "Opción A",
        "opt_B": "Opción B",
        "opt_abs": "Abstención",

        "btn_validate": "Validar mi voto",

        "footer": "© 2026 Peuplitique – Todos los derechos reservados"
    }
};

function applyTranslation(lang) {
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (translations[lang] && translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });
}

const params = new URLSearchParams(window.location.search);
const lang = params.get("lang");
if (lang) applyTranslation(lang);


/* ============================
   TOKEN + VOTE
============================ */

let token = null;
let actif = false;

// UUID v4
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// SHA-256
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

function generer() {
    token = uuidv4();
    actif = true;
    document.getElementById("t").innerText = "Token : " + token;
    document.getElementById("r").innerText = "";
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("vote-form");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!actif) {
            document.getElementById("r").innerText = "Génère ton token avant de voter.";
            return;
        }

        const choix = new FormData(e.target).get("choix");
        const timestamp = new Date().toISOString();

        const hashToken = await sha256(token);
        const signature = await sha256(token + "|" + choix + "|" + timestamp);

        const vote = { hashToken, signature, choix, timestamp };
        const votes = JSON.parse(localStorage.getItem("votes") || "[]");
        votes.push(vote);
        localStorage.setItem("votes", JSON.stringify(votes));

        actif = false;
        token = null;

        document.getElementById("t").innerText = "";
        document.getElementById("r").innerHTML =
            "<strong>Vote enregistré.</strong><br>" +
            "hashToken : " + hashToken + "<br>" +
            "signature : " + signature + "<br>" +
            "choix : " + choix + "<br>" +
            "timestamp : " + timestamp;
    });
});
