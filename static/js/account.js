// // Utility function to check if username exists (fetches from backend)

// // Get CSRF token for Django
// function getCookie(name) {
//     let cookieValue = null;
//     if (document.cookie && document.cookie !== '') {
//         const cookies = document.cookie.split(';');
//         for (let i = 0; i < cookies.length; i++) {
//             const cookie = cookies[i].trim();
//             if (cookie.substring(0, name.length + 1) === (name + '=')) {
//                 cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
//                 break;
//             }
//         }
//     }
//     return cookieValue;
// }

// const csrftoken = getCookie('csrftoken');


// // Utility function to check if username exists (fetches from backend)
// async function checkUsernameAvailability(username) {
//     try {
//         const response = await fetch('/api/register', {  // ← This line is the problem
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(accountData)
//         });
        
//         if (!response.ok) {
//             throw new Error('Failed to check username availability');
//         }
        
//         const data = await response.json();
//         return data.available;
        
//     } catch (error) {
//         console.error('Error checking username:', error);
//         return true; // Assume available if check fails
//     }
// }

// // Calculate age from date of birth
// function calculateAge(birthDate) {
//     const today = new Date();
//     const birth = new Date(birthDate);
//     let age = today.getFullYear() - birth.getFullYear();
//     const monthDiff = today.getMonth() - birth.getMonth();
    
//     if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
//         age--;
//     }
    
//     return age;
// }

// // Validate username
// function validateUsername(username) {
//     const errors = [];
    
//     if (!username || username.trim() === '') {
//         errors.push('Username is required');
//     } else {
//         if (username.includes(' ')) {
//             errors.push('Username cannot contain spaces');
//         }
//         if (username.length < 3) {
//             errors.push('Username must be at least 3 characters long');
//         }
//         if (!/^[a-zA-Z0-9_]+$/.test(username)) {
//             errors.push('Username can only contain letters, numbers, and underscores');
//         }
//     }
    
//     return errors;
// }

// // Validate password
// function validatePassword(password) {
//     const errors = [];
    
//     if (!password || password.trim() === '') {
//         errors.push('Password is required');
//     } else {
//         if (password.length < 8) {
//             errors.push('Password must be at least 8 characters long');
//         }
//         if (!/[A-Z]/.test(password)) {
//             errors.push('Password must contain at least one uppercase letter');
//         }
//         if (!/[a-z]/.test(password)) {
//             errors.push('Password must contain at least one lowercase letter');
//         }
//         if (!/[0-9]/.test(password)) {
//             errors.push('Password must contain at least one number');
//         }
//     }
    
//     return errors;
// }

// // Validate email
// function validateEmail(email) {
//     const errors = [];
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
//     if (!email || email.trim() === '') {
//         errors.push('Email is required');
//     } else if (!emailRegex.test(email)) {
//         errors.push('Please enter a valid email address');
//     }
    
//     return errors;
// }

// // Validate age
// function validateAge(birthDate) {
//     const errors = [];
    
//     if (!birthDate) {
//         errors.push('Date of birth is required');
//     } else {
//         const age = calculateAge(birthDate);
//         if (age < 18) {
//             errors.push('You must be at least 18 years old to register');
//         }
//         if (age > 120) {
//             errors.push('Please enter a valid date of birth');
//         }
//     }
    
//     return errors;
// }

// // Display errors
// function displayErrors(fieldId, errors) {
//     const errorElement = document.getElementById(`${fieldId}_errors`);
//     if (errorElement) {
//         if (errors.length > 0) {
//             errorElement.textContent = errors.join('. ');
//             errorElement.style.color = '#e74c3c';
//             errorElement.style.fontSize = '10px';
//             errorElement.style.marginTop = '4px';
//         } else {
//             errorElement.textContent = '';
//         }
//     }
// }

// // Get selected items from checkboxes
// function getSelectedItems() {
//     const checkboxes = document.querySelectorAll('.account_form--checkbox:checked');
//     return Array.from(checkboxes).map(cb => cb.value);
// }

// // Create JSON data for backend
// function createAccountData() {
//     const username = document.getElementById('username').value.trim();
//     const name = document.getElementById('name').value.trim();
//     const password = document.getElementById('password').value;
//     const email = document.getElementById('email').value.trim();
//     const birthDate = document.getElementById('birth').value;
//     const latitude = document.getElementById('latitude').value;
//     const longitude = document.getElementById('longitude').value;
//     const lookingFor = getSelectedItems();
    
//     return {
//         username,
//         name,
//         password,
//         email,
//         dateOfBirth: birthDate,
//         age: calculateAge(birthDate),
//         location: {
//             latitude: parseFloat(latitude),
//             longitude: parseFloat(longitude)
//         },
//         lookingFor,
//         createdAt: new Date().toISOString()
//     };
// }

// // Main validation and submission function
// async function handleSubmit(event) {
//     event.preventDefault();
    
//     // Get form values
//     const username = document.getElementById('username').value.trim();
//     const password = document.getElementById('password').value;
//     const email = document.getElementById('email').value.trim();
//     const birthDate = document.getElementById('birth').value;
//     const name = document.getElementById('name').value.trim();
//     const latitude = document.getElementById('latitude').value;
//     const longitude = document.getElementById('longitude').value;
    
//     // Validate all fields
//     let isValid = true;
    
//     // Validate username
//     const usernameErrors = validateUsername(username);
//     if (usernameErrors.length === 0) {
//         const isAvailable = await checkUsernameAvailability(username);
//         if (!isAvailable) {
//             usernameErrors.push('Username is already taken');
//         }
//     }
//     displayErrors('username', usernameErrors);
//     if (usernameErrors.length > 0) isValid = false;
    
//     // Validate password
//     const passwordErrors = validatePassword(password);
//     displayErrors('password', passwordErrors);
//     if (passwordErrors.length > 0) isValid = false;
    
//     // Validate email (optional, but show errors if provided)
//     if (email) {
//         const emailErrors = validateEmail(email);
//         if (emailErrors.length > 0) isValid = false;
//     }
    
//     // Validate age
//     const ageErrors = validateAge(birthDate);
//     if (ageErrors.length > 0) {
//         alert(ageErrors.join('\n'));
//         isValid = false;
//     }
    
//     // Validate name
//     if (!name) {
//         alert('Name is required');
//         isValid = false;
//     }
    
//     // Validate location
//     if (!latitude || !longitude) {
//         alert('Please select your location on the map');
//         isValid = false;
//     }
    
//     // If all validations pass
//     if (isValid) {
//         const accountData = createAccountData();
        
//         // Log the JSON (for development)
//         console.log('Account Data:', JSON.stringify(accountData, null, 2));
        
//         // Send to backend
//         try {
//             // Replace '/api/register' with your actual backend endpoint
//             const response = await fetch('/api/register', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(accountData)
//             });
            
//             if (response.ok) {
//                 const result = await response.json();
//                 alert('Account created successfully!');
//                 // Redirect to dashboard or login page
//                 window.location.href = '/dashboard'; // Update with your actual route
//             } else {
//                 const error = await response.json();
//                 alert('Error: ' + (error.message || 'Failed to create account'));
//             }
            
//         } catch (error) {
//             console.error('Error submitting form:', error);
//             alert('An error occurred while creating your account. Please try again.');
//         }
//     }
// }

// // Initialize form validation
// document.addEventListener('DOMContentLoaded', function() {
//     const submitButton = document.querySelector('.account_submit');
    
//     if (submitButton) {
//         submitButton.addEventListener('click', handleSubmit);
//     }
    
//     // Real-time validation for username
//     const usernameInput = document.getElementById('username');
//     if (usernameInput) {
//         usernameInput.addEventListener('blur', async function() {
//             const username = this.value.trim();
//             if (username) {
//                 const errors = validateUsername(username);
//                 if (errors.length === 0) {
//                     const isAvailable = await checkUsernameAvailability(username);
//                     if (!isAvailable) {
//                         errors.push('Username is already taken');
//                     }
//                 }
//                 displayErrors('username', errors);
//             }
//         });
//     }
    
//     // Real-time validation for password
//     const passwordInput = document.getElementById('password');
//     if (passwordInput) {
//         passwordInput.addEventListener('blur', function() {
//             const password = this.value;
//             if (password) {
//                 const errors = validatePassword(password);
//                 displayErrors('password', errors);
//             }
//         });
//     }
// });



// generated code

// Get CSRF token for Django
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const csrftoken = getCookie('csrftoken');

// Utility function to check if username exists (fetches from backend)
async function checkUsernameAvailability(username) {
    try {
        const response = await fetch('/users/api/check-username/', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({ username: username })
        });
        
        if (!response.ok) {
            throw new Error('Failed to check username availability');
        }
        
        const data = await response.json();
        return data.available;
        
    } catch (error) {
        console.error('Error checking username:', error);
        return true; // Assume available if check fails
    }
}

// Calculate age from date of birth
function calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    
    return age;
}

// Validate username
function validateUsername(username) {
    const errors = [];
    
    if (!username || username.trim() === '') {
        errors.push('Username is required');
    } else {
        if (username.includes(' ')) {
            errors.push('Username cannot contain spaces');
        }
        if (username.length < 3) {
            errors.push('Username must be at least 3 characters long');
        }
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            errors.push('Username can only contain letters, numbers, and underscores');
        }
    }
    
    return errors;
}

// Validate password
function validatePassword(password) {
    const errors = [];
    
    if (!password || password.trim() === '') {
        errors.push('Password is required');
    } else {
        if (password.length < 8) {
            errors.push('Password must be at least 8 characters long');
        }
        if (!/[A-Z]/.test(password)) {
            errors.push('Password must contain at least one uppercase letter');
        }
        if (!/[a-z]/.test(password)) {
            errors.push('Password must contain at least one lowercase letter');
        }
        if (!/[0-9]/.test(password)) {
            errors.push('Password must contain at least one number');
        }
    }
    
    return errors;
}

// Validate email
function validateEmail(email) {
    const errors = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email || email.trim() === '') {
        errors.push('Email is required');
    } else if (!emailRegex.test(email)) {
        errors.push('Please enter a valid email address');
    }
    
    return errors;
}

// Validate age
function validateAge(birthDate) {
    const errors = [];
    
    if (!birthDate) {
        errors.push('Date of birth is required');
    } else {
        const age = calculateAge(birthDate);
        if (age < 16) {
            errors.push('You must be at least 16 years old to register');
        }
        if (age > 120) {
            errors.push('Please enter a valid date of birth');
        }
    }
    
    return errors;
}

// Display errors
function displayErrors(fieldId, errors) {
    const errorElement = document.getElementById(`${fieldId}_errors`);
    if (errorElement) {
        if (errors.length > 0) {
            errorElement.textContent = errors.join('. ');
            errorElement.style.color = '#e74c3c';
            errorElement.style.fontSize = '10px';
            errorElement.style.marginTop = '4px';
        } else {
            errorElement.textContent = '';
        }
    }
}

// Main validation function
async function handleSubmit(event) {
    // Get form values
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const birthDate = document.getElementById('birth').value;
    const name = document.getElementById('name').value.trim();
    const latitude = document.getElementById('latitude').value;
    const longitude = document.getElementById('longitude').value;
    
    // Validate all fields
    let isValid = true;
    
    // Validate username
    const usernameErrors = validateUsername(username);
    if (usernameErrors.length === 0) {
        const isAvailable = await checkUsernameAvailability(username);
        if (!isAvailable) {
            usernameErrors.push('Username is already taken');
        }
    }
    displayErrors('username', usernameErrors);
    if (usernameErrors.length > 0) {
        event.preventDefault();
        isValid = false;
    }
    
    // Validate password
    const passwordErrors = validatePassword(password);
    displayErrors('password', passwordErrors);
    if (passwordErrors.length > 0) {
        event.preventDefault();
        isValid = false;
    }
    
    // Validate age
    const ageErrors = validateAge(birthDate);
    if (ageErrors.length > 0) {
        event.preventDefault();
        alert(ageErrors.join('\n'));
        isValid = false;
    }
    
    // Validate name
    if (!name) {
        event.preventDefault();
        alert('Name is required');
        isValid = false;
    }
    
    // Validate location
    if (!latitude || !longitude) {
        event.preventDefault();
        alert('Please set your location by clicking on the map or using the "Use My Current Location" button');
        isValid = false;
    }
    
    // Form will submit to Django if valid
}

// Initialize form validation
document.addEventListener('DOMContentLoaded', function() {
    // Password visibility toggle
    const eyeIcon = document.getElementById('eye');
    const passwordField = document.getElementById('password');
    
    if (eyeIcon && passwordField) {
        eyeIcon.addEventListener('click', function() {
            if (passwordField.type === 'password') {
                passwordField.type = 'text';
                eyeIcon.classList.remove('fa-eye-slash');
                eyeIcon.classList.add('fa-eye');
            } else {
                passwordField.type = 'password';
                eyeIcon.classList.remove('fa-eye');
                eyeIcon.classList.add('fa-eye-slash');
            }
        });
    }

    const submitButton = document.querySelector('.account_submit');
    
    if (submitButton) {
        submitButton.addEventListener('click', handleSubmit);
    }
    
    // Real-time validation for username
    const usernameInput = document.getElementById('username');
    if (usernameInput) {
        usernameInput.addEventListener('blur', async function() {
            const username = this.value.trim();
            if (username) {
                const errors = validateUsername(username);
                if (errors.length === 0) {
                    const isAvailable = await checkUsernameAvailability(username);
                    if (!isAvailable) {
                        errors.push('Username is already taken');
                    }
                }
                displayErrors('username', errors);
            }
        });
    }
    
    // Real-time validation for password
    if (passwordField) {
        passwordField.addEventListener('blur', function() {
            const password = this.value;
            if (password) {
                const errors = validatePassword(password);
                displayErrors('password', errors);
            }
        });
    }
});