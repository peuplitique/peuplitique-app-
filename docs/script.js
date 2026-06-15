/* ============================
   MULTILINGUE
============================ */

const translations = {
    fr: {},
    en: {},
    es: {}
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

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

function generer() {
    token = uuidv4();
    actif = true;

    const t = document.getElementById("token-display");
    if (t) t.innerText = "Token : " + token;

    const r = document.getElementById("vote-result");
    if (r) r.innerText = "";
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("vote-form");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const r = document.getElementById("vote-result");

        if (!actif) {
            if (r) r.innerText = "Génère ton token avant de voter.";
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

        const t = document.getElementById("token-display");
        if (t) t.innerText = "";

        if (r) {
            r.innerHTML =
                "<strong>Vote enregistré.</strong><br>" +
                "hashToken : " + hashToken + "<br>" +
                "signature : " + signature + "<br>" +
                "choix : " + choix + "<br>" +
                "timestamp : " + timestamp;
        }
    });
});
