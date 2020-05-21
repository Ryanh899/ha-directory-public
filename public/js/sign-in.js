$( document ).ready(function() {



    const formContainer = document.querySelector('div#form-container')
// ec2 api url 
const API_URL = "https://hadirectoryapi.com/api/"; 
const ZOHO_URL = "https://hadirectoryapi.com/zoho/"; 
const AUTH_URL = "https://hadirectoryapi.com/auth/"; 
const ADMIN_URL = "https://hadirectoryapi.com/admin/"; 
    // if (sessionStorage.getItem('justRegistered')) {
    //     $(formContainer).append(`<div id="submit-register" style="position: absolute; right: 6rem; bottom: 2rem" class="ha_button">Submit</div>`)
    // } else {
    //     $(formContainer).append(`<div id="submit-other" class="ha_button">Submit</div>`)
    // }


    $( '#submit-register' ).on('click', function () {
        const userInfo = {
            email: $('#email').val().trim(), 
            password: $('#password').val().trim()
        }
        const registerCheck = sessionStorage.getItem('lastLocation')
        axios.post(`${AUTH_URL}login`, userInfo)
            .then(response => {
                console.log(response)
                sessionStorage.setItem('token', response.data); 
                console.log(window.history)
                sessionStorage.setItem('lastLocation', 'sign-in')

                sessionStorage.removeItem('currentListing')
                sessionStorage.removeItem('customer_id')
                sessionStorage.removeItem('subscription_id')

                if (sessionStorage.getItem('routeToBilling')) {
                    sessionStorage.removeItem('routeToBilling')

                    window.location.assign('billing__new.html')
                } else if (registerCheck !== 'register') {
                    console.log('REGISTER')
                    console.log(sessionStorage.getItem('registered'))
                    sessionStorage.setItem('lastLocation', 'sign-in')

                    window.history.back(); 
                } else {
                    window.location.assign('index.html')
                }
            })
            .catch(err => {
                $('#error-label').css('display', '')
            })
    })

    $('body').on('click', '#no-account', function () {
        sessionStorage.setItem('lastLocation', 'sign-in')

        window.location.assign('register.html')
    })
    
    
    $( '#back' ).on('click', function () {
        window.location.assign('index.html')
    })

});