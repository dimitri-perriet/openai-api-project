import React,{ useState } from "react";
import Swal from 'sweetalert2'
import { ReactComponent as HomeWave} from '../assets/home-wave.svg';
import { ReactComponent as SubmitButton} from '../assets/submit.svg';


function closeye()
{
    let x=document.getElementById("animoji");
    let y=document.getElementById("hands");
    x.style.backgroundImage="url('./monkey_pwd.gif')";
    y.style.marginTop="0%";
}

function openeye()
{
    let x=document.getElementById("animoji");
    let y=document.getElementById("hands");
    x.style.backgroundImage="url('./monkey.gif')";
    y.style.marginTop="110%";
}

async function loginUser(credentials) {
    return fetch('api/users/loginapi', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
        .then(data => data.json())
        .catch()
}

async function registerUser(credentials) {
    return fetch('api/users/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
        .then(data => data.ok)
        .catch()
}

async function registerForm() {
    const {value: formValues} = await Swal.fire({
        title: 'Multiple inputs',
        html:
            '<input id="firstname-input" placeholder="Prénom" class="swal2-input">' +
            '<input id="lastname-input" placeholder="Nom" class="swal2-input">' +
            '<input id="mail-input" placeholder="Mail" class="swal2-input">' +
            '<input id="password-input" type="password" placeholder="Mot de passe" class="swal2-input">',
        focusConfirm: false,
        preConfirm: async () => {
            let credidentials = {
                "firstname": document.getElementById('firstname-input').value,
                "lastname": document.getElementById('lastname-input').value,
                "email": document.getElementById('mail-input').value,
                "password": document.getElementById('password-input').value
            }

            const response = await registerUser(credidentials);

            console.log(response)

            if (response === true) {
                console.log("User created")
            } else {
                console.log("User not created")
            }

            return [
                document.getElementById('lastname-input').value,
                document.getElementById('mail-input').value,
                document.getElementById('password-input').value
            ]
        }
    })

    if (formValues) {
        Swal.fire(JSON.stringify(formValues))
    }
}

function Home() {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const handleSubmit = async e => {
        e.preventDefault();
        const response = await loginUser({
            email,
            password
        });
        if ('user' in response) {
            sessionStorage.setItem('user', JSON.stringify(response.user));
            let user = JSON.parse(sessionStorage.getItem('user'));
            // console.log(response)
            Swal.fire({
                title: 'Bonjour, ' + user.firstname + ' !',
                text: "Vous allez être redirigé vers votre espace personnel",
                icon: 'success',
                showConfirmButton: false,
                timer: 3000
            })
        } else {
            Swal.fire({
                title: 'Connexion refusée !',
                text: response.message,
                icon: 'error',
                showConfirmButton: false,
                timer: 3000
            })
        }
    }

  return (
      <div className="grid lg:grid-cols-2">
          <div><HomeWave class="h-screen"/></div>
          <div className="place-self-center w-96">
              <form onSubmit={handleSubmit} className="flex flex-col items-center">
                  <div id="animoji"
                       className="overflow-hidden h-44 w-44 rounded-full m-5 shadow-base bg-[#ffffff] bg-[url('./assets/monkey.gif')] bg-[length:90%_70%] bg-no-repeat bg-center">
                      <img src="./hands.png" alt="Hands" id="hands" className="mt-28 duration-1000"/>
                  </div>
                  <div className="mt-5">
                      <input type="text" placeholder="Identifiant" className="placeholder:text-[#707070} shadow-input rounded-[12px] w-50 h-9 pl-7 focus:outline-secondary" onFocus={openeye} onChange={e => setEmail(e.target.value)}/>
                  </div>
                  <div className="mt-10">
                      <input type="password" placeholder="Mot de passe" className="shadow-input rounded-[12px] w-50 h-9 pl-7 focus:outline-secondary" onFocus={closeye} onBlur={openeye} onChange={e => setPassword(e.target.value)}/>
                  </div>
                  <button className="focus:outline-none" type="submit">
                    <SubmitButton className="mt-5"/>
                  </button>
                  <button className="text-gray-400 mt-5" type="button" onClick={registerForm}>
                      Pas encore inscrit ?
                  </button>
              </form>
          </div>
      </div>
  );
}

export default Home;