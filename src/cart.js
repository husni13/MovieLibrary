//element used to display all items inside the cart from the localStorage

const itemsListEl = document.getElementById("items-list");

//retrievig the items from local storage if they've already been stored there, if not cartItems is an empty array

let cartItems = JSON.parse(localStorage.getItem("Items-in-cart")) || [];

// getting the search bar element where the user searches for movies

let searchInputEl = document.getElementById("search-bar");

// getting the element for displaying the results in the form of a list inside the navbar

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
                if(Array.isArray(data) && data.length > 0){

                    searchResultsList.innerHTML = "";

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
                else{
                    console.log("empty array");
                }
            });
        }
        else{
            console.log("nothing");
        }

};

searchInputEl.addEventListener("input", searchAsync);

// method that generates the list of all items from the data located in the local storage
// if there is an empty array the method will generate a msg which is appended to the items list element

let generateItemsList = (itemData) => {

    itemsListEl.innerHTML = "";

    if(Array.isArray(itemData)&& itemData.length !== 0){

        return itemData.map(m => {
    
            itemsListEl.innerHTML += `
            <div class="cart-item" id="cart-item-${m.itemId}">
                <div class="cart-item-image-container">
                    <img src="${m.image}" alt="" class="src">
                </div>
                <div class="cart-item-data">
                    <h2>${m.movieName}</h3>
                    <h3 class="cart-quantity" id="number-items-${m.itemId}">
                    <div class="remove-me">
                        <i class="remove-me bi bi-dash-circle-fill" 
                        onclick="removeInstance(${m.itemId})"></i>
                    </div> 
                    ${m.number}
                    <div class="add-me">
                        <i class="add-me bi bi-plus-circle-fill" 
                        onclick="addInstance(${m.itemId})"></i>
                    </div> 
                    </h3>
                    <h3 id="update-total-${m.itemId}">Total: $${m.totalPrice}</h3>
                    <h4>Price per movie: $${m.price}</h4>
                </div>
                
                <div class="cart-btns">
                    <button class="remove-item-btn" onclick="removeItem(${m.itemId})">
                    <i class="bi bi-x-lg"></i>
                    </button>
                </div>
    
            </div>
            `
        })
    }
    else{

        let clearBtnElIn = document.getElementById("clear-btn");

        let checkoutBtnIn = document.getElementById("check-btn");

        clearBtnElIn.setAttribute('disabled', 'disabled');

        checkoutBtnIn.setAttribute('disabled', 'disabled');

        return itemsListEl.innerHTML = `
            <h2 class="empty-cart-text">The cart is empty</h2>
        `
    }
};

generateItemsList(cartItems);

// getting the logo element from the details.html page to assign an event listener to it that invokes a function which redirects
// the user back to the main page

const logoEl = document.getElementById("logo");

let backToMainPage = () => {
    window.location.href = "index.html";
};

logoEl.addEventListener("click", backToMainPage);

// elements that are used to show the number of items in the cart

let cartIconVal = document.getElementById("cart-amount-nav"); // shows how many movies of one type are in the cart

let cartValue = document.getElementById("cart-value"); //shows how many movies regardless of the type are in the cart


// a method that updates both of the values declared above

let cartUpdate = () => {

    console.log(cartItems.length);

    cartIconVal.innerHTML = cartItems.length;

    cartValue.innerHTML= "Number of items: " + cartItems.map(m=>m.number).reduce((x,y)=>x+y,0);

};

cartUpdate();

// method used to increment the number of one particular movie, it takes the id as an argument
// the id argument is used to find the movie in local storage by its id and update the total price and the quantity of that movie

let addInstance = (id) => {

    search = cartItems.find(x => x.itemId === id);

    if(search !== undefined){
        search.number++;
        search.totalPrice += search.price;

        let numberUpdateEl = document.getElementById("number-items-" + id);

        let updateTotalPriceEl = document.getElementById("update-total-" + id);
        
        numberUpdateEl.innerHTML = `
            <div class="remove-me">
            <i class="add-me bi bi-dash-circle-fill" 
            onclick="removeInstance(${id})"></i>
            </div> 
            ${search.number}
            <div class="add-me">
            <i class="remove-me bi bi-plus-circle-fill" 
            onclick="addInstance(${id})"></i>
            </div> 
        `;

        updateTotalPriceEl.innerHTML = `
            Total: $${search.totalPrice}
        `;

        localStorage.setItem("Items-in-cart", JSON.stringify(cartItems));


    }

    // updating the values displayed on the page when addInstance function is called

    cartUpdate();

};

// a method used to remove an instance of a movie from the local storage
// like the addInstance movie it takes the ID of the movie as an argument and updates the local storage to remove an instance of the movie
// or to remove it completely

let removeInstance = (id) => {

    search = cartItems.find(x => x.itemId === id);

    if(search !== undefined){

        // removing the movie from localStorage completely if there is only 1 instance of it

        if(search.number === 1){

            search.number--;
            cartItems = cartItems.filter(item => item.number !== 0);
            localStorage.setItem("Items-in-cart", JSON.stringify(cartItems));

            cartUpdate();
            localStorage.setItem("Items-in-cart", JSON.stringify(cartItems));
            
            let deletedItem = document.getElementById("cart-item-" + id);

            deletedItem.remove();

            if(Array.isArray(cartItems) && cartItems.length ===0){
                clearCart();
            }

        }
        else{
            search.number--;
            search.totalPrice -= search.price;

            let numberUpdateEl = document.getElementById("number-items-" + id);

            let updateTotalPriceEl = document.getElementById("update-total-" + id);
            
            numberUpdateEl.innerHTML = `
                <div class="remove-me">
                <i class="add-me bi bi-dash-circle-fill" 
                onclick="removeInstance(${id})"></i>
                </div> 
                ${search.number}
                <div class="add-me">
                <i class="remove-me bi bi-plus-circle-fill" 
                onclick="addInstance(${id})"></i>
                </div> 
            `;

            updateTotalPriceEl.innerHTML = `
                Total: $${search.totalPrice}
            `;

            localStorage.setItem("Items-in-cart", JSON.stringify(cartItems));
            }

    }


    cartUpdate();
};

// btn element used to clear out the whole cart page when the click event occurs on it

const clearBtnEl = document.getElementById("clear-btn");

// a method used to clear the whole cart by deleting the cart items from the local storage by making it an empty array

let clearCart = () => {

    cartItems = [];

    localStorage.setItem("Items-in-cart", JSON.stringify(cartItems));

    cartUpdate();

    generateItemsList();

};

clearBtnEl.addEventListener("click", clearCart);

// method called by the X icon inside the generateItems list method used to remove a movie completely from the cart Items array and local storage
// it utilizes the splice method provided by JavaScript and removes the element with the id that is passed to the method as an argument

let removeItem = (id) => {

    searchDel = cartItems.find(x => x.itemId === id);

    const indexEl = cartItems.indexOf(searchDel);

    cartItems.splice(indexEl, 1);

    cartUpdate();

    localStorage.setItem("Items-in-cart", JSON.stringify(cartItems));
    

    generateItemsList(cartItems);
};