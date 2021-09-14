/**
 * Select element in HTML
 */
const gallery = document.getElementById('gallery');
const searchContainer = document.querySelector(".search-container");

/**
 * Fetch 12 users information 
 */
fetch('https://randomuser.me/api/?results=12&nat=us')
    .then(res => res.json())
    .catch(error => console.log('Something went wrong', error))
    .then(data => {
        generateUsers(data.results);
        popModal(data.results);
        filter(data.results);
    })
 
/**
 * Insert Form HTML
 */
const form = `
    <form action="#" method="get">
    <input type="search" id="search-input" class="search-input" placeholder="Search...">
    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>
   `
   searchContainer.insertAdjacentHTML('beforeend', form);

/**
 * This function can generate the users html and get added to the page
 */
function generateUsers(data){
    for (let i = 0; i < data.length; i++){
        const html = `
        <div class="card">
            <div class="card-img-container">
                <img class="card-img" src='${data[i].picture.thumbnail}' alt='${data[i].name.first} picture'>
            </div>
            <div class="card-info-container">
                <h3 id="name" class="card-name cap">${data[i].name.first} ${data[i].name.last}</h3>
                <p class="card-text">${data[i].email}</p>
             <p class="card-text cap">${data[i].location.city}, ${data[i].location.state}</p>
            </div>
        </div>
        `;    
        gallery.insertAdjacentHTML('beforeend', html);
    }
}

/**
 * This function will pop the modal when clicking the card
 */

 function popModal(data){
    const card = gallery.querySelectorAll('.card');
    for(let i = 0; i < data.length; i++){
        card[i].addEventListener('click', e => {
            generateModal(data, i)    
        })
    }
}

/**
 * Normalize phone number
 */
function normalize(phone){
    phone = phone.replace(/[^\d]/g, "");
    if(phone.length === 10){
        return phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
    } else {
        return 'No accessible phone number';
    }
}

/**
 * Normalize Birthday
 */
function BDNormalize(birthday){
    dob = birthday.substring(0,10);
    return dob.substring(5,7) + '/' + dob.substring(8,10) + '/' + dob.substring(0,4)
}

/**
 * create modal
 */
function generateModal(data, i){
     const norPhone = normalize(data[i].phone);
     const norBD = BDNormalize(data[i].dob.date);
        const modal = `
        <div class="modal-container">
            <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                <div class="modal-info-container">
                    <img class="modal-img" src='${data[i].picture.large}' alt="profile picture">
                    <h3 id="name" class="modal-name cap">${data[i].name.first} ${data[i].name.last}</h3>
                    <p class="modal-text">${data[i].email}</p>
                    <p class="modal-text cap">${data[i].location.city}</p>
                    <hr>
                    <p class="modal-text">${norPhone}</p>
                    <p class="modal-text">${data[i].location.street.number} ${data[i].location.street.name}, ${data[i].location.city}, ${data[i].location.state}, ${data[i].location.postcode}</p>
                    <p class="modal-text">Birthday: ${norBD}</p>
                </div>
                <div class="modal-btn-container">
                    <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                    <button type="button" id="modal-next" class="modal-next btn">Next</button>
                </div>
            </div>
        </div>
        `
        document.body.insertAdjacentHTML('beforeend', modal);

        //Remove Modal
        const modalCloseBtn = document.getElementById('modal-close-btn');
        const modalCtn = document.querySelector('.modal-container');
        modalCloseBtn.addEventListener('click', e => {
            modalCtn.remove();
        })

        //Previous and Next Modal
        preNextModal(data, i);
    }

/**
 * This function add functionality to the previous and next botton in the modal
 */
function preNextModal(data, i){
    const modalCtn = document.querySelector('.modal-container');
    const prevBtn = document.getElementById('modal-prev');
    const nextBtn = document.getElementById('modal-next');
    if(i === 0){
        prevBtn.style.display = "none";
    } else if (i === data.length - 1){
        nextBtn.style.display = "none"
    } else {
        prevBtn.style.display = "inherit";
        nextBtn.style.display = "inherit";
    }
    prevBtn.addEventListener('click', e => {
        modalCtn.remove();
        generateModal(data, i - 1);
    })
    nextBtn.addEventListener('click', e => {
        modalCtn.remove();
        generateModal(data, i + 1);
    })    
}


/**
 * This will add search for the name of employees that are already on the page
 */
function filter(dataArray){
    const searchInput = document.getElementById('search-input');
    const card = gallery.querySelectorAll('.card');
    const modal = document.querySelectorAll('modal-container');
    searchInput.addEventListener("keyup", e => {
        const searchResult = searchInput.value.toLowerCase();
        // console.log(dataArray);
        // const matchArray = [];
        for(let i = 0; i < dataArray.length; i++){
            const firstName = dataArray[i].name.first.toLowerCase();
            const lastName = dataArray[i].name.last.toLowerCase();
            const fullName = `${firstName} ${lastName}`;
            if (fullName.includes(searchResult)){
                card[i].style.display = "inherit";
                // matchArray.push(dataArray[i]);
            } else {
                card[i].style.display = "none";
            }
        }
        // console.log(matchArray);
    })
}
