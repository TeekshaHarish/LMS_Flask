const apiBaseURL = "http://127.0.0.1:5000";

document.getElementById("login-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch(`${apiBaseURL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", data.token);
      alert("Login successful!");
      window.location.href = "books.html";
    } else {
      alert("Invalid credentials.");
    }
  } catch (error) {
    console.error("Error during login:", error);
  }
});

document.getElementById("register-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch(`${apiBaseURL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      alert("Registration successful!");
      window.location.href = "index.html";
    } else {
      alert("Registration failed.");
    }
  } catch (error) {
    console.error("Error during registration:", error);
  }
});
