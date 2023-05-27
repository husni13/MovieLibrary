// getting elements from the index.html page

let moviesList = document.getElementById("movies");

// getting the search bar element where the user searches for movies

let searchInputEl = document.getElementById("search-bar");

// getting the element for displaying the results in the form of a list inside the navbar

let searchResultsList = document.getElementById("search-results-display");


// definition for the searchAsync method, it takes an event as an argument 
// which is actually passed whenever the input event occurs on the search bar element
// it makes a call to the SearchMovies endpoint which provides all the data depending on the searched movie
// The method is working asynchronously, meaning whenever the input event occurs it runs without
// disturbing the flow of the entire app
// this method works the same in every .js file

let searchAsync = (event) => {

    //checking whether the user has written anything, and if not the list of results should be empty

    if(event.target.value === ""){
        searchResultsList.innerHTML = "";
    }

    //getting the value from the input text field

    const inputValue = event.target.value;

    //to avoid printing too many results and for more precise results the asynchronous search will occur 
    //only if the user has input more than 3 characters

    if(inputValue.length >= 3){

        //passing the appropriate value to the API endpoint using the variable declared below

        const searchFetchUrl = 
        "https://localhost:5045/Movies/SearchMovies/" 
        + inputValue;
    

        //sending a GET request to the API and checking if what the API endpoint has returned
        //if it is not an empty array certain items will be added to the list of search results ("searchResultsList")
        //if the returned data is an empty array nothing will happen

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

//the input event listener on the search bar element from the index.html

searchInputEl.addEventListener("input", searchAsync);


//fetching all the data to display a list of all movies stored in the database to later display it on the website

fetch("https://localhost:5045/Movies/GetAllMovies")
    .then(response => response.json())
    .then(data => data.map(movie => {
    
        //mapping each movie instance received from the API so that each movie is displayed as a seperate entity

        const disabledBtn = movie.isAvailable ? "" : "disabled"; // checking if the movie can be added to cart or not, appended as attribute to btn

        return moviesList.innerHTML += `
        <div class="movie-container" id=${movie.id}>
                <div class="thumbnail-container">
                    <div class="thumbnail">
                        <div class="thumbnail-overlay">
                            <div class="rating">
                                <div class="star">
                                    <i class="bi bi-star-fill"></i>
                                </div>
                                <div class="rating-value">
                                    <h3>${movie.movieRating}</h3>
                                </div>
                                <div class="genre-container">
                                    <h3>${movie.genre}</h3>
                                    <h3>$${movie.moviePrice}</h3>
                                </div>
                                <div class="overlay-btns-container">
                                    <button onclick="openDetailsTab(${movie.id})" id="details-btn" class="action-btn">View Details</button>
                                    <button onclick="addToCart(${movie.id}, '${movie.movieName}' ,${movie.moviePrice}, '${movie.imagePath}')" id="cart-btn" class="action-btn" ${disabledBtn}>Add to Cart</button>
                                </div>
                            </div>
                        </div>
                        <img class="thumbnail-image"src="${movie.imagePath}" alt="">
                    </div>
                </div>
                <div class="title-container">
                    <h3 class="movie-title">${movie.movieName}</h3>
                    <p class="release-year">${movie.releaseYear}</p>
                </div>
            </div>`
    }));

//getting the element to display the number of movies inside the cart

let cartValue = document.getElementById("cart-amount");

//retrievig the items from local storage if they've already been stored there, if not cartItems is an empty array

let cartItems = JSON.parse(localStorage.getItem("Items-in-cart")) || [];


//method to update the number of items in the cart shown on the website
//the method actually shows how many movies with different IDs are stored in the array
//so if a user adds one movie more than once the value will not have changed

let cartUpdate = () => {
    cartValue.innerHTML = cartItems.length;
};


//calling the cartUpdate method in order to update value displayed on the page when the page loads

cartUpdate();


//method definition for adding an item to the cart when the appropriate button is clicked
//the method first checks whether the item already exists inside the cartItems array
//if yes the method only increments the "number" property and increases the value of the prop totalPrice
//if the search is undefined, in other words if the movie is added for the first time the arguments passed
//to the method are assigned to adequate props and then the whole element is pushed inside the array

let addToCart = (id, movName ,itemPrice,imPath) => {

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


    //setting the value of "Items-in-cart" in local storage

    localStorage.setItem("Items-in-cart", JSON.stringify(cartItems));   

    //calling the cartUpdate method in order to increase the number of elements in cart when item is added

    cartUpdate();
};

// method that opens the details.html page which contains the id of the movie the user has clicked on
// the id will be retrieved from the url in the details.js file


let openDetailsTab = (id) => {

    const detailsUrl = `details.html?id=${id}`;
    window.open(detailsUrl, "_blank");
};

// getting the cart icon to add an event listener that calls a function that opens cart page

const cartIconEl = document.getElementById("cart-icon");

let openCartPage = () => {
    window.location.href = "cart.html";
};

cartIconEl.addEventListener("click" , openCartPage);

