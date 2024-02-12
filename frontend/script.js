const bookList = document.getElementById('bookList');
const returnedBookList = document.getElementById('returnedBooks');
const addBookForm = document.getElementById('addBookForm');

function returnBook(id) {
   fetch('http://localhost:4000/returnbook', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
    }).then(response => {
        if(response.status !== 200) {
            document.getElementById(`payfine-${id}`).style.display = 'block'
            document.getElementById(`bookData-${id}`).style.display = 'none'
            return {}
        }
        return response.json()
    })
    .then(book => {
        document.getElementById(`bookData-${book.id}`).parentElement.remove()
        const bookItem = document.createElement('li');
        bookItem.className='book-item'
        bookItem.innerHTML =
        `
            <h2 class="book-title">Book Name: ${book.title}</h2>
            <p class="book-details">Fine: ${book.fine}</p>
            <p class="book-details">Return Date: ${book.actualReturnDate}</p>
        `;
        returnedBookList.appendChild(bookItem);
    })
}

    // Function to handle form submission
addBookForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const title = event.target.book.value

    if(!title) {
        return
    }

    fetch('http://localhost:4000/rentbook', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to add book');
        }
        return response.json();
    })
    .then(book => {
        // console.log('successfully');
        const bookItem = document.createElement('div');
        bookItem.className='card'
        bookItem.innerHTML = `
        <div class='bookData'>
        <h2>${book.title}</h2>
        <p><strong>Taken Date:</strong> ${book.takenDate}</p>
        <p><strong>Expected Return Date:</strong> ${book.expectedReturnDate}</p>
        <p><strong>Fine:</strong> &#8377; ${book.fine}</p>
        <button class="btn" onclick="returnBook(${book.id})">Return Book</button>
        </div>
        <div class='payfine'>
        <p><strong>Fine:</strong> &#8377; ${book.fine}</p>
        <button class="btn" onclick="payFine(${book.id}, ${book.fine})">Return Book</button>
        </div>`;
    bookList.appendChild(bookItem);
        addBookForm.reset();
    })
    .catch(error => console.error('Error adding book:', error));
});

// Function to fetch and display books
function fetchTakenBooks() {
    fetch('http://localhost:4000/bookstaken')
        .then(response => response.json())
        .then(data => {
            bookList.innerHTML = '';
            data.length > 0 && data.forEach(book => {
                const bookItem = document.createElement('div');
                bookItem.className='card'
                bookItem.innerHTML = `
                <div id='bookData-${book.id}' class='bookData'>
                <h2>${book.title}</h2>
    <p><strong>Taken Date:</strong> ${book.takenDate}</p>
    <p><strong>Expected Return Date:</strong> ${book.expectedReturnDate}</p>
    <p><strong>Fine:</strong> &#8377; ${book.fine}</p>
    <button class="btn" onclick=returnBook(${book.id})>Return Book</button>
    </div>
    <div id='payfine-${book.id}' class='payfine'>
    <p><strong>Fine:</strong> &#8377; ${book.fine}</p>
    <button class="btn" onclick="payFine(${book.id}, ${book.fine})">Return Book</button>
    </div>`;
        bookList.appendChild(bookItem);
    });
        })
        .catch(error => console.error('Error fetching books:', error));
}
// Fetch books when the page loads
fetchTakenBooks();

// Function to fetch and display books
function fetchReturnedBooks() {
    fetch('http://localhost:4000/booksreturned')
        .then(response => response.json())
        .then(data => {
            returnedBookList.innerHTML = '';
            data.length > 0 && data.forEach(book => {
                const bookItem = document.createElement('li');
                bookItem.className='book-item'
                bookItem.innerHTML =
                `
                    <h2 class="book-title">Book Name: ${book.title}</h2>
                    <p class="book-details">Fine: ${book.fine}</p>
                    <p class="book-details">Return Date: ${book.actualReturnDate}</p>
                `;
            returnedBookList.appendChild(bookItem);
    });
        })
        .catch(error => console.error('Error fetching books:', error));
}
// Fetch books when the page loads
fetchReturnedBooks();


async function payFine(id, fine) {
    const response = await fetch('http://localhost:4000/payfine', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, fine })
    })

    if(response.status !== 200) {
        alert('Please pay correct amount')
        return
    }
    
    return returnBook(id)
}
setInterval(fetchTakenBooks, 3600000)


