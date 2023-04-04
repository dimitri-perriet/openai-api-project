import React, {useEffect} from "react";
import Header from "../components/Header";
import {decodeToken} from "react-jwt";



function Game() {
    const token = JSON.parse(sessionStorage.getItem("token"));
    const user = decodeToken(token)
    let [games, setGames] = React.useState([]);

    function Gamesinfo(gamesinfo) {

        const token = JSON.parse(sessionStorage.getItem("token"));

        var myHeaders = new Headers();
        myHeaders.append("Bearer", token);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        return fetch("api/games/search/" + gamesinfo, requestOptions)
            .then(response => response.json())
            .then(data => {setGames(data)})
            .catch(error => console.log('error', error));
    }

    useEffect(() => {
        console.log(games);
    });

    return (
        <div>
            <Header title={"Super ! Ajoutons un jeu, " + user.firstname }/>
            <input className={"flex mx-auto"} type="text" placeholder="Nom du jeu" onChange={e => Gamesinfo(e.target.value)}/>
            <div className="grid grid-cols-2 auto-cols-max justify-items-center mt-24">
                {games.cover ? (<img src={games.cover} alt="image"/>) : (<p>Aucun jeu trouvé</p>)}
                <p>Ok2</p>
            </div>
        </div>
    )
}

export default Game;