// getting the element to which the movie details will be appended

let movieDetailsRoot = document.getElementById("movie-details")

// getting the cart value element to display the number of items in the cart

let cartValue = document.getElementById("cart-amount");

// getting the Items in cart data from the local storage

let cartItems = JSON.parse(localStorage.getItem("Items-in-cart")) || [];

// grabbing the search bar element to enable the search functionality

let searchInputEl = document.getElementById("search-bar");

// the element to display the results of the search

let searchResultsList = document.getElementById("search-results-display");

let searchAsync = (event) => {

    if(event.target.value === ""){
        searchResultsList.innerHTML = "";

    }

    const inputValue = event.target.value;

    if(inputValue.length >= 3){
        const searchFetchUrl = 
        "https://localhost:5045/Movies/SearchMovies/" 
        + inputValue;
    
        fetch(searchFetchUrl)
            .then(response => response.json())
            .then(data => {

                searchResultsList.innerHTML = "";

                if(Array.isArray(data) && data.length > 0){
                    data.map(m => {
                        return searchResultsList.innerHTML += `
                            <div class="search-item" onclick="openDetailsTab(${m.id})">
                                <div class="search-item-img">
                                    <img src="${m.imagePath}" alt="">
                                </div>
                                <div class="search-item-data">
                                    <h4>${m.movieName}</h4>
                                    <p>${m.releaseYear}</p>
                                </div>
                            </div>
                        `;
                    })
                }
            });
        }
};

// method that opens the details.html page which contains the id of the movie the user has clicked on
// the id will be retrieved from the url in the details.js file

let openDetailsTab = (id) => {

    const detailsUrl = `details.html?id=${id}`;
    window.open(detailsUrl, "_blank");
};

//method definition for adding an item to the cart when the appropriate button is clicked
//the method first checks whether the item already exists inside the cartItems array
//if yes the method only increments the "number" property and increases the value of the prop totalPrice
//if the search is undefined, in other words if the movie is added for the first time the arguments passed
//to the method are assigned to adequate props and then the whole element is pushed inside the array

let addToCart = (id, movName ,itemPrice,imPath) => {

    console.log(id, movName, itemPrice, imPath);

    let search = cartItems.find((x) => x.itemId === id);

    if(search === undefined){
        cartItems.push({
            itemId: id,
            movieName: movName,
            number:1,
            price: itemPrice,
            totalPrice: itemPrice,
            image: imPath,
        });
    } else{
        search.number++;
        search.totalPrice += search.price;
    }

    localStorage.setItem("Items-in-cart", JSON.stringify(cartItems));   

    cartUpdate();
};

searchInputEl.addEventListener("input", searchAsync);

//method to update the number of items in the cart shown on the website
//the method actually shows how many movies with different IDs are stored in the array
//so if a user adds one movie more than once the value will not have changed

let cartUpdate = () => {
    cartValue.innerHTML = cartItems.map((x)=> x.number).reduce((x,y)=> x+y, 0);
};

//calling the cartUpdate method to update the number of movies when the page loads

cartUpdate();

//getting the id of the movie from the link of the website that has been passed to the page when it was loaded

const queryParams = new URLSearchParams(window.location.search);

const movieId = queryParams.get('id');

//fetching the movie by id, sending GET request to API endpoint and then passing the data retrieved from the API 
//to the generateDetailsPage method

const fetchUrl = "https://localhost:5045/Movies/GetMovieById/" + movieId;

fetch(fetchUrl)
    .then(response => response.json())
    .then(data => generateDetailsPage(data));

//method that generates the whole details page and calls the generateSimilarMovies 
//the generateDetailsPage method is called after the movie has been fetched

let generateDetailsPage = (movieData) => {

    generateSimilarMovies(movieData.genre, movieData.movieName);

    const movieAvailable = movieData.isAvailable ? "The movie is available" : "The movie is unavailable" // formatting the text that will be shown to the user on the details page

    const disableBtn = movieData.isAvailable ? "" : "disabled"; //disabling the button depending on whether the movie is available

    return movieDetailsRoot.innerHTML = `
    <div class="thumbnail-buy-btns">
            <img class="details-thumbnail" src="${movieData.imagePath}" width="200" alt="" class="src">
            <div class="buy-btns">
                <button class="details-cart-btn" onclick="addToCart(${movieData.id}, '${movieData.movieName}' ,${movieData.moviePrice}, '${movieData.imagePath}')" ${disableBtn}>Add To cart <i class="bi bi-plus-circle-fill"></i></button>
                <button class="details-watch-btn">Watch Now</button>
            </div>
            <div class="icons">
                <i class="bi bi-facebook" id="fb-icon"></i>
                <i class="bi bi-instagram" id="insta-icon"></i>
                <i class="bi bi-pinterest" id="pint-icon"></i>
            </div>
        </div>
        <div class="title-info">
            <div class="title">
                <h1>${movieData.movieName}</h1>
            </div>
            <div class="title-year-genre">
                <i class="bi bi-film"></i>
                <div class="year-genre">
                    <h3>${movieData.movieReleaseYear}</h3>
                    <h3>${movieData.genre}</h3>
                    <h3 class="imdb-rating" >IMDb: ${movieData.movieRating}</h3>
                    <h3>Price: $${movieData.moviePrice}</h3>
                </div>
            </div>
            <div class="available">
                <i class="bi bi-bag-heart"></i>
                <div class="available-inside">
                    <h3 id="msg">${movieAvailable}</h3>
                </div>
            </div>

        </div>`
};

// getting the logo element from the details.html page to assign an event listener to it that invokes a function which redirects
// the user back to the main page

const logoEl = document.getElementById("logo");

let backToMainPage = () => {
    window.location.href = "index.html";
};

logoEl.addEventListener("click", backToMainPage);

// this element is used to generate all the movies that are similar to the movie displayed on the page by genre

let similarMovies = document.getElementById("similar")

// the generateSimilarMovies method takes the movie genre and the name of the movie as arguments

let generateSimilarMovies = (movieGenre, mName) => {

    // fetching from an endpoint that returns data depending on the genre of the movie on the details page

    const fetchByGenreUrl = "https://localhost:5045/Movies/GetMoviesByGenre/" + movieGenre;

    fetch(fetchByGenreUrl)
    .then(response => response.json())
    .then(data => data.map(x => {

        // the mName (movie name) argumet is used to check whether the API has returned the movie that is already
        // displayed on the details page

        if(mName !== x.movieName){
            return similarMovies.innerHTML+= `
                <div class="similar-movie" onclick="openDetailsTab(${x.id})">
                    <img src="${x.imagePath}" alt="" class="similar-movie-thumbnail">
                </div>`;
        }
    }));
};

// getting the cart icon to add an event listener that calls a function that opens cart page

let cartIconEl = document.getElementById("cart-icon");

let openCartPage = () => {
    window.location.href = "cart.html";
};

cartIconEl.addEventListener("click", openCartPage);