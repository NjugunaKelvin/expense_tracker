document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form')
    

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const authMsg = document.getElementById('auth-msg');


        try{
            const response = await fetch('http://127.0.0.1:5500/HTML/register.html?', {
                method: 'POST',
                headers:  {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, username, password })
            });

            const data = response.data;

            if(!response.ok) {
                authMsg.textContent = "User already exists!"
            } else {
                authMsg.textContent = "User created successfully"
            }

        } catch (err) {
            authMsg.textContent = 'An error occured'
        }
    })

})