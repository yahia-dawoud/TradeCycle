// Password visibility toggle for login form
document.addEventListener('DOMContentLoaded', function() {
    const eyeIcon = document.getElementById('eye');
    const passwordInput = document.getElementById('myPass');
    
    if (eyeIcon && passwordInput) {
        eyeIcon.addEventListener('click', function() {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                eyeIcon.classList.remove('fa-eye-slash');
                eyeIcon.classList.add('fa-eye');
            } else {
                passwordInput.type = 'password';
                eyeIcon.classList.remove('fa-eye');
                eyeIcon.classList.add('fa-eye-slash');
            }
        });
    }
});
