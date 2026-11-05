
/*
 * IMPORTANTE:
 * Durante o desenvolvimento, o backend é localhost.
 * Para o GitHub Pages, altere BACKEND_URL
 * para o endereço público do seu backend.
 */

const BACKEND_URL = "http://localhost:3000";

const video = document.getElementById("video");
const lista = document.getElementById("lista");
const titulo = document.getElementById("titulo");
const status = document.getElementById("status");
const busca = document.getElementById("busca");

let canais = [];

async function carregarCanais() {

    try {

        status.textContent = "Conectando ao backend...";

        const resposta = await fetch(
            `${BACKEND_URL}/api/canais`
        );

        if (!resposta.ok) {
            throw new Error("Erro HTTP " + resposta.status);
        }

        canais = await resposta.json();

        renderizarCanais(canais);

        status.textContent = "Backend conectado";

    } catch (erro) {

        status.textContent = "Backend offline";

        console.error("Falha ao conectar:", erro);

        lista.innerHTML = `
            <p>
                Não foi possível acessar o backend.
                Verifique se o Node.js está rodando.
            </p>
        `;
    }
}

function renderizarCanais(items) {

    lista.innerHTML = "";

    items.forEach(canal => {

        const elemento = document.createElement("div");

        elemento.className = "canal";

        elemento.textContent = canal.nome;

        elemento.addEventListener("click", () => {
            reproduzir(canal);
        });

        lista.appendChild(elemento);
    });
}

function reproduzir(canal) {

    let url = canal.url;

    // URLs relativas são resolvidas usando o backend.
    if (!/^https?:\/\//i.test(url)) {
        url = `${BACKEND_URL}/${url.replace(/^\/+/, "")}`;
    }

    video.src = url;

    titulo.textContent = canal.nome;

    video.load();

    video.play().catch(erro => {
        console.warn("Reprodução automática bloqueada:", erro);
    });
}

busca.addEventListener("input", () => {

    const termo = busca.value.toLowerCase();

    const filtrados = canais.filter(canal =>
        canal.nome.toLowerCase().includes(termo)
    );

    renderizarCanais(filtrados);
});

carregarCanais();
