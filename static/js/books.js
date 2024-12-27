const token = localStorage.getItem("token");
if (!token) window.location.href = "index.html";

const apiBaseURL = "http://127.0.0.1:5000";

async function fetchBooks(page = 1, query = "") {
  try {
    const response = await fetch(`${apiBaseURL}/books?page=${page}&q=${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      const data = await response.json();
      renderBooks(data.books);
      renderPagination(data.page, data.total_pages);
    } else {
      alert("Failed to fetch books.");
    }
  } catch (error) {
    console.error("Error fetching books:", error);
  }
}

function renderBooks(books) {
  const booksList = document.getElementById("books-list");
  booksList.innerHTML = books
    .map(
      (book) => `
    <tr>
      <td>${book.id}</td>
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>
        <button class="btn btn-sm btn-warning" onclick="editBook(${book.id}, '${book.title}', '${book.author}')">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteBook(${book.id})">Delete</button>
      </td>
    </tr>`
    )
    .join("");
}

function renderPagination(current, total) {
  const pagination = document.getElementById("books-pagination");
  pagination.innerHTML = "";
  for (let i = 1; i <= total; i++) {
    pagination.innerHTML += `
      <li class="page-item ${i === current ? "active" : ""}">
        <a class="page-link" href="#" onclick="fetchBooks(${i})">${i}</a>
      </li>`;
  }
}

document.getElementById("search-books").addEventListener("input", (e) => {
  fetchBooks(1, e.target.value);
});

document.getElementById("book-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.getElementById("book-id").value;
  const title = document.getElementById("book-title").value;
  const author = document.getElementById("book-author").value;

  try {
    const method = id ? "PUT" : "POST";
    const url = id ? `${apiBaseURL}/books/${id}` : `${apiBaseURL}/books`;
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, author }),
    });

    if (response.ok) {
      alert("Book saved successfully!");
      fetchBooks();
      document.getElementById("book-form").reset();
      document.querySelector("#addBookModal .btn-close").click();
    } else {
      alert("Failed to save book.");
    }
  } catch (error) {
    console.error("Error saving book:", error);
  }
});

async function deleteBook(id) {
  try {
    const response = await fetch(`${apiBaseURL}/books/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      alert("Book deleted successfully!");
      fetchBooks();
    } else {
      alert("Failed to delete book.");
    }
  } catch (error) {
    console.error("Error deleting book:", error);
  }
}

function editBook(id, title, author) {
  document.getElementById("book-id").value = id;
  document.getElementById("book-title").value = title;
  document.getElementById("book-author").value = author;
  new bootstrap.Modal(document.getElementById("addBookModal")).show();
}

fetchBooks();
