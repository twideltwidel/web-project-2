document.addEventListener("DOMContentLoaded", () => {
    const firstScreen = document.getElementById('firstScreen');
    const secondScreen = document.getElementById('secondScreen');
    const thirdScreen = document.getElementById('thirdScreen');
    const SignInButton = document.getElementById('SignInButton');
    const next = document.getElementById('next');
    const email = document.getElementById('email');
    const field = document.getElementById('display');

    firstScreen.style.display = 'flex';
    secondScreen.style.display = 'none';
    thirdScreen.style.display = 'none';

    SignInButton.addEventListener('click', () => {
        firstScreen.style.display = 'none';
        secondScreen.style.display = 'flex';
        document.body.style.backgroundColor = '#1e2a33';
    });

    function isValid(emailText) {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(emailText);
    }

    next.addEventListener('click', () => {
        const mail = email.value.trim();  

        if (!isValid(mail)) {
            email.style.border = 'solid red';
            email.style.outline = 'none';
            return;
        }
        else{
           email.style.border = ''; 
        }

        secondScreen.style.display = 'none';
        thirdScreen.style.display = 'flex';

        field.value = mail;
        field.readOnly = true;
        field.style.color = 'gray';

    });
    document.getElementById("login").onclick = function () {
        location.href = "feed.html";
    };
});