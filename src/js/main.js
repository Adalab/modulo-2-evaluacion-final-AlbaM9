'use strict';

const seachResultsList = document.querySelector(".searchList")
const FavouritesList = document.querySelector(".favsList")
let searchInput = document.querySelector(".searchInput")
const resetBtn = document.querySelector(".resetBtn")
const searchBtn = document.querySelector(".searchBtn")
const delBtn = document.querySelector(".delButn")

let savedAnimes = JSON.parse(localStorage.getItem("favourites"));


let animesToShow;
let imageCard;
let searchTerm;
let favArray = [];

if (savedAnimes !== null) {

    FavouritesList.classList.remove("hidden"); //cargan al inicio; evitar que se genere un nuevo array al pulsar nuscar por primera vez
    FavouritesList.innerHTML = " ";
    renderCards(savedAnimes, FavouritesList, "Animes Favoritos", "favsItems");
}


function handleFilter(event) {
    event.preventDefault();
    searchTerm = searchInput.value.toLowerCase();
    const SERVER_URL = `https://api.jikan.moe/v4/anime?q=${searchTerm}"`;


    fetch(SERVER_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {

            animesToShow = data.data;
            console.log(animesToShow);
            seachResultsList.innerHTML = "";
            renderCards(animesToShow, seachResultsList, "Resultado de búsqueda", "selected", "hidden");


            if (savedAnimes !== null) {
                favArray = savedAnimes;
                FavouritesList.innerHTML = " ";// reasigno para no perder el valor de array de favoritos guardado tras cada adición
                renderCards(favArray, FavouritesList, "Animes Favoritos", "favsItems");

            } else {
                console.log("no hay favoritos");
                FavouritesList.innerHTML = "";

            }

            favouritesRender();
        })


}
searchBtn.addEventListener("click", handleFilter);

function renderCards(animesData, list, title, styleClass, deBtn) {
    console.log("recarga");
    let content = `<h2>${title}</h2>`;

    animesData.forEach(card => {
        imageCard = card.images.jpg.image_url;

        if (card.myFavourite == true || savedAnimes && savedAnimes.some(savedAnime => savedAnime.mal_id === card.mal_id)) { //mantiene seleecionadas las tarjetas que se encuentran en el favArray

            content += `<div class = "completeAnime ${styleClass}" > `

        } else {
            content += `<div class = "completeAnime" > `
        }

        if (imageCard !== null) {
            content += `
           
            <img src="${imageCard}" alt="${card.title}" id = "${card.mal_id}">
            <h3 id = "${card.mal_id}">${card.title}</h3>
            <button  class = "delButn ${deBtn}" >Borrar</button>`;

        } else {
            content += `
            <h3>${card.title}</h3>
            <img src="https://via.placeholder.com/210x295/ffffff/666666/?text=TV" alt="${card.title}">
            <button class = "delButn hidden" >Delete</button>`;
        }
        content += `</div>`

    });

    list.innerHTML += content;


}

function handleAddFavourites(event) {
    const inputiD = event.target.id;

    console.log(inputiD);
    const animeindex = animesToShow.findIndex((anime) => {

        return anime.mal_id == inputiD;
    })

    // Compruebo si mi array nuevo favArray contiene el elemento clickado
    const isAlreadyFavourite = favArray.some((anime) => {
        return anime.mal_id == inputiD;
    });

    // si no lo contiene lo añado al array favArray
    if (!isAlreadyFavourite) {
        animesToShow[animeindex].myFavourite = true;
        favArray.push(animesToShow[animeindex]);

    } else {
        return
    }
    seachResultsList.innerHTML = " ";
    renderCards(animesToShow, seachResultsList, "Resultado de búsqueda", "selected", "hidden");
    favouritesRender();

}
seachResultsList.addEventListener("click", handleAddFavourites);


function favouritesRender() {

    FavouritesList.classList.remove("hidden");
    FavouritesList.innerHTML = " ";
    renderCards(favArray, FavouritesList, "Animes Favoritos", "favsItems"); // renderiza el nuevo array
    localStorage.setItem("favourites", JSON.stringify(favArray));
}

/*resetBtn.addEventListener("click", (event) => {

    event.preventDefault();

    localStorage.removeItem("favourites");
    FavouritesList.innerHTML = "";
    seachResultsList.innerHTML = "";
    favArray = [];
    searchInput.value = "";
    //renderCards(favArray, FavouritesList, "Animes Favoritos", "favsItems"); // renderiza el nuevo array

})*/

