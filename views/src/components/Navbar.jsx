import React from "react";
import {Link} from "react-router-dom";



function Navbar() {
    function signOut() {
        sessionStorage.clear();
        window.location.reload();
    }
    return (
        <nav className="fixed left-0 top-2/4 bg-white h-56 w-10 shadow-input border-t-2 border-r-2 border-b-2 border-primary rounded-tr-xl rounded-br-xl -my-28">
            <ul className="h-full flex flex-col justify-evenly">
                <li>
                    <Link to="/dashboard">
                        <img className="mx-auto" src="./icon/_navhome.svg" alt="Accueil"/>
                    </Link>
                </li>
                <li>
                    <Link to="/game">
                        <img className="mx-auto" src="./icon/_navadd-circle.svg" alt="Ajouter un jeu"/>
                    </Link>
                </li>
                <li>
                    <Link to="/character">
                        <img className="mx-auto" src="./icon/_navperson-add.svg" alt="Ajouter un personnage"/>
                    </Link>
                </li>
                <li>
                    <Link to="/dashboard">
                        <img className="mx-auto" src="./icon/_navgame-controller.svg" alt="Jouer"/>
                    </Link>
                </li>
                <li>
                    <button className="w-full" onClick={signOut}>
                        <img className="mx-auto" src="./icon/_navclose-circle.svg" alt="Se déconnecter"/>
                    </button>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar;