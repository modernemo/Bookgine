let books = []; // Хранение книг
let selectedBookIndex = null; // Индекс выбранной книги

// Отображение списка книг
function displayBooks() {
    const bookList = document.getElementById("bookList");
    bookList.innerHTML = "";
    books.forEach((book, index) => {
        const li = document.createElement("li");
        li.textContent = book.title;
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        li.onclick = () => selectBook(index);
        bookList.appendChild(li);
    });
}

// Выбор книги
function selectBook(index) {
    selectedBookIndex = index;
    document.getElementById("editBookBtn").disabled = false;
    document.getElementById("deleteBookBtn").disabled = false;
}

// Добавление книги
document.getElementById("addBookBtn").addEventListener("click", () => {
    const bookTitle = prompt("Введите название книги:");
    if (bookTitle) {
        books.push({ title: bookTitle });
        displayBooks();
    }
});

// Редактирование книги
document.getElementById("editBookBtn").addEventListener("click", () => {
    if (selectedBookIndex !== null) {
        const newTitle = prompt("Введите новое название книги:", books[selectedBookIndex].title);
        if (newTitle) {
            books[selectedBookIndex].title = newTitle;
            displayBooks();
        }
    }
});

// Удаление книги
document.getElementById("deleteBookBtn").addEventListener("click", () => {
    if (selectedBookIndex !== null) {
        books.splice(selectedBookIndex, 1);
        selectedBookIndex = null;
        displayBooks();
        document.getElementById("editBookBtn").disabled = true;
        document.getElementById("deleteBookBtn").disabled = true;
    }
});

// Сохранение изменений (можно дополнить для работы с сервером)
document.getElementById("saveBookBtn").addEventListener("click", () => {
    alert("Изменения сохранены!"); // Замени это на отправку на сервер
});