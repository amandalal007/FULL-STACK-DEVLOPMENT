// Form validation and handling
document.getElementById('registration-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Clear previous error messages
    clearErrors();

    // Get form values
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();
    const dob = document.getElementById('dob').value.trim();

    let isValid = true;

    // Validate username
    if (username === "") {
        showError('username', "Username is required.");
        isValid = false;
    }

    // Validate email
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(email)) {
        showError('email', "Please enter a valid email address.");
        isValid = false;
    }

    // Validate password
    if (password.length < 6) {
        showError('password', "Password must be at least 6 characters.");
        isValid = false;
    }

    // Confirm password
    if (password !== confirmPassword) {
        showError('confirm-password', "Passwords do not match.");
        isValid = false;
    }

    // Validate date of birth
    const today = new Date();
    const birthDate = new Date(dob);
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age < 18) {
        showError('dob', "You must be at least 18 years old.");
        isValid = false;
    }

    // If valid, show success message
    if (isValid) {
        document.getElementById('success-message').innerText = "Registration Successful!";
    }
});

// Clear error messages
function clearErrors() {
    document.querySelectorAll('.error').forEach(function(error) {
        error.style.display = 'none';
    });
    document.getElementById('success-message').innerText = "";
}

// Show error message
function showError(field, message) {
    const errorElement = document.getElementById(`${field}-error`);
    errorElement.innerText = message;
    errorElement.style.display = 'block';
}
