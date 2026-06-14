/* ============================
   MULTILINGUE
============================ */

const translations = { … };

function applyTranslation(lang) { … }

const params = new URLSearchParams(window.location.search);
const lang = params.get("lang");
if (lang) applyTranslation(lang);


/* ============================
   TOKEN + VOTE
============================ */

let token = null;
let actif = false;

function uuidv4() { … }
async function sha256(message) { … }
function generer() { … }

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("vote-form");
    if (!form) return;

    form.addEventListener("submit", async (e) => { … });
});


