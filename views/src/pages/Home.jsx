import React,{ useState } from "react";
import Swal from 'sweetalert2'
import { ReactComponent as HomeWave} from '../assets/home-wave.svg';


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
            console.log(response)
            Swal.fire({
                title: 'Vous êtes connecté !',
                text: response.message,
                icon: 'success',
                showConfirmButton: false,
                timer: 2000
            })
        } else {
            Swal.fire({
                title: 'EUhh non pas echec!',
                text: response.message,
                icon: 'error',
                showConfirmButton: false,
                timer: 2000
            })        }
    }

  return (
    <div className="grid lg:grid-cols-2">
        <div>
            <HomeWave class="h-screen"/>
        </div>
        <div className="place-self-center">
            <form onSubmit={handleSubmit}>
                <div id="animoji" className="overflow-hidden h-44 w-44 rounded-full m-5 shadow-base bg-[#ffffff] bg-[url('./assets/monkey.gif')] bg-[length:90%_70%] bg-no-repeat bg-center">
                    <img src="./hands.png" alt="Hands" id="hands" className="mt-28 duration-1000"/>
                </div>
                <div className="mt-10">
                    <input type="text" placeholder="Identifiant" className="shadow-base rounded-md" onClick={openeye} onChange={e => setEmail(e.target.value)}/>
                </div>
                <div className="mt-10">
                    <input type="password" placeholder="Mot de passe"  className="shadow-base" onClick={closeye} onChange={e => setPassword(e.target.value)}/>
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    </div>
  );
}

export default Home;