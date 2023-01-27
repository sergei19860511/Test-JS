
const apiToken = '2bd064a6-633a-4872-862a-10f146cee060';

const url = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/';
const options = {
    method: 'GET',
    headers: {
        'X-API-KEY': apiToken,
        'Content-Type': 'application/json',
    },
}

/////////////////////////////////// DOM элементы ////////////////////
const divFilms = document.querySelector('.films');
const loader = document.querySelector('.loader-wrapper');
const btnMoreFilms = document.querySelector('.show-more');

let page = 1;

btnMoreFilms.onclick = fetchAndRenderFilms;

////////////////////////////////// Помощники ////////////////////////
//Получить все фильмы
async function fetchData(url, options) {
    const response = await fetch(url, options);
    return await response.json();
}

// рендерим все фильмы
function renderFilms (films) {
    for (film of films) {

        const divCardHtml = document.createElement('div');
        divCardHtml.classList.add('card');
        divCardHtml.id = film.filmId;
        divCardHtml.onclick = openFilmDeteil;


        const html = `
            <img src=${film.posterUrlPreview} alt="Cover" class="card__img">
            <h3 class="card__title">${film.nameRu}</h3>
            <p class="card__year">${film.year}</p>
            <p class="card__rate">Рейтинг: ${film.rating}</p>
        `;
        divCardHtml.insertAdjacentHTML('beforeend', html);
        divFilms.insertAdjacentElement('beforeend', divCardHtml);
    }
}

//Рендерим детали фильма
function renderFilmDetail (film) {
    if (document.querySelector('.container-right')) {
        document.querySelector('.container-right').remove();
    }

    const containerRight = document.createElement('div');
    containerRight.classList.add('container-right');

    const btnClose = document.createElement('button');
    btnClose.classList.add('btn-close');
    btnClose.innerHTML = '<img src="./img/cross.svg" alt="Close" width="24">';
    containerRight.insertAdjacentElement('afterbegin', btnClose);
    btnClose.onclick = () => containerRight.remove();

    const htmlDetail = `<div class="film">

        <div class="film__title">${film.nameRu}</div>

        <div class="film__img">
            <img src=${film.posterUrl} alt="${film.nameRu}">
        </div>

        <div class="film__desc">
            <p class="film__details">Год: ${film.year}</p>
            <p class="film__details">Рейтинг: ${film.ratingKinopoisk}</p>
            <p class="film__details">Продолжительность: ${convertToHoursAndMinutes(film.filmLength)}</p>
            <p class="film__details">Страна: ${film.nameRu}</p>
            <p class="film_text">${film.shortDescription}</p>
        </div>

    </div>`;

    containerRight.insertAdjacentHTML('beforeend', htmlDetail);


    document.body.insertAdjacentElement('beforeend', containerRight);
}

//Конвектировать продолжительность фильма
function convertToHoursAndMinutes (value) {
    let lenght = '';
    const hours = Math.floor(value / 60);
    const minutes = value % 60;

    if (hours > 0) {
        lenght += hours + ' ч. ';
    }
    if (minutes > 0) {
        lenght += minutes + ' мин.';
    }
    return lenght;
}

//Получить детали фильма
async function openFilmDeteil(event) {
    const idFilm = event.currentTarget.id;

    const data = await fetchData(url + idFilm, options);

    renderFilmDetail(data);
}

///////////////////////////////// Вывод ТОП фильмов ////////////////////
async function fetchAndRenderFilms () {
    try {
        loader.classList.remove('none');//показать прелоадер
        const data = await fetchData(url + `top?page=${page}`, options);

        if (data.pagesCount > 1) {
            page++;
            btnMoreFilms.classList.remove('none');
        }
        loader.classList.add('none');// скрыть прелоадер
        renderFilms(data.films);

        if (page > data.pagesCount) {
            btnMoreFilms.classList.add('none');
            console.log(page);
        }
    } catch (error) {
        console.log(error)
    }

}


fetchAndRenderFilms();