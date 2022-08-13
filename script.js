class Book {
  constructor(title, auther, isbn) {
    this.title = title;
    this.auther = auther;
    this.isbn = isbn;
  }
}

class UI {
  static displayBooks() {
    const books = Store.getBooks();

    books.forEach(book => UI.addBookToList(book));
  }

  static addBookToList(book) {
    const list = document.querySelector('#book-list');

    const row = document.createElement('tr');

    row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.auther}</td> 
        <td>${book.isbn}</td> 
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td> 
        `;

    list.appendChild(row);
  }

  static deleteBook(el) {
    if (el.classList.contains('delete')) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');
    container.insertBefore(div, form);

    //Vanish in 1.5 seconds
    setTimeout(() => document.querySelector('.alert').remove(), 1500);
  }

  static clearField() {
    document.querySelector('#title').value = '';
    document.querySelector('#auther').value = '';
    document.querySelector('#isbn').value = '';
  }
}

class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }
    return books;
  }

  static addBooks(book) {
    const books = Store.getBooks();

    books.push(book);

    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();

    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        book.splice(index, 1);
      }
    });

    localStorage.removeItem('books', JSON.stringify(books));
  }
}

document.addEventListener('DOMContentLoaded', UI.displayBooks);

document.querySelector('#book-form').addEventListener('submit', e => {
  e.preventDefault();

  const title = document.querySelector('#title').value;
  const auther = document.querySelector('#auther').value;
  const isbn = document.querySelector('#isbn').value;

  if (title === '' || auther === '' || isbn === '') {
    UI.showAlert('Please Fill In All The Fields', 'danger');
  } else {
    const book = new Book(title, auther, isbn);

    UI.addBookToList(book);

    Store.addBooks(book);

    UI.showAlert('New Book Added', 'success');

    UI.clearField();
  }
});

document.querySelector('#book-list').addEventListener('click', function (e) {
  UI.deleteBook(e.target);

  UI.showAlert('Book Removed!!!', 'success');

  Store.removeBook(isbn);
});
