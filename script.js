const search = document.querySelector('.search');
const cards = document.querySelector('.cards');
const message = document.querySelector('.message');
const next = document.querySelector('#next');
const prev = document.querySelector('#prev');
const pageInfo = document.querySelector('#page-info');
const loader = document.querySelector('.loader');
const output = document.querySelector('#output');

function main() {
    let currentPage = 1;
    let totalPages = 1;
    let query = '';

    async function getData(name, page = 1) {
        const response = await fetch(
            `https://rickandmortyapi.com/api/character/?page=${page}&name=${name}`
        );
        if (response.status === 404) {
            return null;
        }
        if (!response.ok) {
            throw new Error(`Ошибка ${response.status}`);
        }
        return response.json();
    }

    function renderCards(json) {
        cards.innerHTML = json.map(el => `  
            <article class="card" data-id="${el.id}">
            <img src="${el.image}" alt="${el.name}">
            <h3>${el.name}</h3>
            <p>${el.status} — ${el.species}</p>
            </article>`).join('');
    }

    function loadPage() {
        getData(query, currentPage)
            .then(json => {
                if (json === null) {
                    cards.innerHTML = '';
                    message.textContent = 'Нет результатов';
                    message.classList.remove('hidden');
                    return;
                }

                totalPages = json.info.pages

                pageInfo.textContent = `Страница ${currentPage} из ${totalPages}`
                message.classList.add('hidden');
                renderCards(json.results, currentPage);
            })
            .catch(err => {
                message.textContent = err.message;
                message.classList.remove('hidden');
            });
    }


    next.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            loadPage();
        }
    });

    prev.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            loadPage();
        }
    });


    let timerId;
    search.addEventListener('input', () => {
        query = search.value;
        loader.classList.remove('hidden');

        clearTimeout(timerId);
        currentPage = 1;

        timerId = setTimeout(() => {
            loadPage();
            loader.classList.add('hidden')
        }, 500);

    });

    cards.addEventListener('click', event => {
        if (event.target.closest('.card')) {
            const characterID = event.target.closest('.card').dataset.id;
            fetch(`https://rickandmortyapi.com/api/character/${characterID}`)
                .then(response => response.json())
                .then(json => output.textContent = JSON.stringify(json, null, 2))
        }
    })

}


main()