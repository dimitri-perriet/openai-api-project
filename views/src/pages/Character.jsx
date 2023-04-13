import React from 'react';
import Header from "../components/Header";
import {decodeToken} from "react-jwt";

function Character ()
{
    const token = JSON.parse(sessionStorage.getItem('token'));
    const user = decodeToken(token);

    return (
        <div>
            <Header title={"Top ! Ajoutons un personnage, " + user.firstname + " !"}/>
        </div>
    )
}

export default Character;