const token = localStorage.getItem("token");
if (!token) window.location.href = "index.html";

const apiBaseURL = "http://127.0.0.1:5000";

async function fetchMembers(page = 1, query = "") {
  try {
    const response = await fetch(`${apiBaseURL}/members?page=${page}&q=${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      const data = await response.json();
      renderMembers(data.members);
      renderPagination(data.page, data.total_pages);
    } else {
      alert("Failed to fetch members.");
    }
  } catch (error) {
    console.error("Error fetching members:", error);
  }
}

function renderMembers(members) {
  const membersList = document.getElementById("members-list");
  membersList.innerHTML = members
    .map(
      (member) => `
    <tr>
      <td>${member.id}</td>
      <td>${member.name}</td>
      <td>${member.email}</td>
      <td>
        <button class="btn btn-sm btn-warning" onclick="editMember(${member.id}, '${member.name}', '${member.email}')">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteMember(${member.id})">Delete</button>
      </td>
    </tr>`
    )
    .join("");
}

function renderPagination(current, total) {
  const pagination = document.getElementById("members-pagination");
  pagination.innerHTML = "";
  for (let i = 1; i <= total; i++) {
    pagination.innerHTML += `
      <li class="page-item ${i === current ? "active" : ""}">
        <a class="page-link" href="#" onclick="fetchMembers(${i})">${i}</a>
      </li>`;
  }
}

document.getElementById("search-members").addEventListener("input", (e) => {
  fetchMembers(1, e.target.value);
});

document.getElementById("member-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.getElementById("member-id").value;
  const name = document.getElementById("member-name").value;
  const email = document.getElementById("member-email").value;

  try {
    const method = id ? "PUT" : "POST";
    const url = id ? `${apiBaseURL}/members/${id}` : `${apiBaseURL}/members`;
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, email }),
    });

    if (response.ok) {
      alert("Member saved successfully!");
      fetchMembers();
      document.getElementById("member-form").reset();
      document.querySelector("#addMemberModal .btn-close").click();
    } else {
      alert("Failed to save member.");
    }
  } catch (error) {
    console.error("Error saving member:", error);
  }
});

async function deleteMember(id) {
  try {
    const response = await fetch(`${apiBaseURL}/members/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      alert("Member deleted successfully!");
      fetchMembers();
    } else {
      alert("Failed to delete member.");
    }
  } catch (error) {
    console.error("Error deleting member:", error);
  }
}

function editMember(id, name, email) {
  document.getElementById("member-id").value = id;
  document.getElementById("member-name").value = name;
  document.getElementById("member-email").value = email;
  new bootstrap.Modal(document.getElementById("addMemberModal")).show();
}

fetchMembers();
