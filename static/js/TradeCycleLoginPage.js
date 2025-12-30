const eye = document.querySelector('#eye');
const myPass = document.querySelector('#myPass');

eye.addEventListener('click', function () {
    const type = myPass.getAttribute('type') === 'password' ? 'text' : 'password';
    myPass.setAttribute('type', type);
    
    this.classList.toggle('fa-eye');
    this.classList.toggle('fa-eye-slash');
});