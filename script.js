// Buttons
const newBtn = document.getElementById('new-form-btn');
const addBtn = document.getElementById('form-add-btn');
const closeBtn = document.getElementById('close-form-btn');

// DialogBox
const dialogBox = document.querySelector('dialog');
const formFields = document.querySelectorAll('.form-field');
const bookTitleInput = document.querySelector('.book-title');
const authorNameInput = document.querySelector('.author-name');
const bookRatingInput = document.querySelector('.ratings');

let library = [];
let bookNumber = 1;
let editingBook = null; // Tracking the book being edited

// Add Event Listeners
newBtn.addEventListener('click', openDialog);
closeBtn.addEventListener('click', closeDialog);
addBtn.addEventListener('click', handleFormSubmit);

// Open dialog
function openDialog() {
    editingBook = null;
    clearForm();
    dialogBox.showModal();
}

// Close dialog and clear form
function closeDialog() {
    dialogBox.close();
    clearForm();
}

// Clear form inputs
function clearForm() {
    formFields.forEach((field) => field.value = "");
}

// Handle form submission (create or update book)
function handleFormSubmit(event) {
    event.preventDefault();

    const title = bookTitleInput.value;
    const author = authorNameInput.value;
    const ratings = parseInt(bookRatingInput.value);

    if(isNaN(ratings) || ratings < 1 || ratings > 5){
        alert("Please enter ratings between 1 and 5.");
        return;
    }

    if (editingBook) {
        updateBook(editingBook, title, author, ratings);
    } else {
        createBook(title, author, ratings);
    }

    closeDialog();
}

// Create new book and render it
function createBook(title, author, ratings) {
    const book = new Book(title, author, ratings);
    library.push(book);
    renderBook(book);
    saveLibrary();
}

// Book constructor
function Book(title, author, ratings) {
    this.id = bookNumber++;
    this.title = title;
    this.author = author;
    this.ratings = "⭐".repeat(ratings);
}

// Render book in the book container
function renderBook(book) {
    const bookElement = document.createElement("div");
    bookElement.className = "book-element";
    bookElement.dataset.id = book.id;
    bookElement.innerHTML = `
        <div class="book-close-btn"><img src="images/close.png" alt="close"></div>
        <h1>${book.title}</h1><br>
        <p>${book.author}</p><br>
        <p>${book.ratings}</p>
        <button class="book-edit-btn"><img src="images/pen.png" alt="Edit"></button>
    `;

    // Append the book element to the book container
    document.getElementById("book-container").appendChild(bookElement);
}


// Update an existing book's information
function updateBook(book, title, author, ratings) {
    // Update the book details
    book.title = title;
    book.author = author;
    book.ratings = "⭐".repeat(ratings);

    // Update the book's DOM element directly
    const bookElement = document.querySelector(`.book-element[data-id="${book.id}"]`);
    bookElement.querySelector('h1').innerHTML = `${book.title}`;
    bookElement.querySelector('p').textContent = book.author;
    bookElement.querySelectorAll('p')[1].textContent = book.ratings;

    saveLibrary();
}

// Edit an existing book
function editBook(book) {
    editingBook = book; // Set the book to be edited
    bookTitleInput.value = book.title;
    authorNameInput.value = book.author;
    bookRatingInput.value = book.ratings.length; // Convert stars to numeric value
    dialogBox.showModal();
}

// Remove an existing book
function removeBook(book){
    library = library.filter(b => b.id !== book.id);
    document.querySelector(`.book-element[data-id="${book.id}"]`)?.remove();
    saveLibrary();
}

// Event delegation for edit buttons
document.getElementById("book-container").addEventListener('click', (event) => {
    const bookElement = event.target.closest('.book-element');
    if (!bookElement) return;

    const bookId = bookElement.dataset.id;
    const book = library.find(b => b.id == bookId);

    if (event.target.closest('.book-edit-btn')) {
        editBook(book);
    }

    if (event.target.closest('.book-close-btn')) {
        removeBook(book);
    }
});

// Saving Progress 
function saveLibrary(){
    localStorage.setItem('library', JSON.stringify(library));
}

// Loading Progress
function loadLibrary(){
    const data = localStorage.getItem('library');

    if(data){
        const parsed = JSON.parse(data);
        console.log(parsed);
        library = parsed.map(b => new Book(b.title, b.author, b.ratings.length));
        console.log(library);

        bookNumber = library.length ? Math.max(...library.map(b => b.id)) + 1 : 1;

        library.forEach(renderBook);
    }
}

loadLibrary();
