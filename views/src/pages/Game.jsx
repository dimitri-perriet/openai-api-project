import React, {useEffect} from "react";
import Header from "../components/Header";
import {decodeToken} from "react-jwt";


function Game() {
    const token = JSON.parse(sessionStorage.getItem("token"));
    const user = decodeToken(token)
    let [games, setGames] = React.useState([]);
    const [search, setSearch] = React.useState("");

    useEffect(() => {

        var myHeaders = new Headers();
        myHeaders.append("Bearer", token);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        const data = setTimeout(() => {
            fetch("api/games/search/" + search, requestOptions)
                .then(response => response.json())
                .then(data => {setGames(data)})
                .catch(error => console.log('error', error));
        }, 500);

        return () => clearTimeout(data);

    }, [search]);

    return (
        <div>
            <Header title={"Super ! Ajoutons un jeu, " + user.firstname }/>
            <input className={"flex mx-auto"} type="text" placeholder="Nom du jeu" onChange={e => setSearch(e.target.value)}/>
            <div className="grid grid-cols-2 auto-cols-max justify-items-center mt-24">
                {games.cover ? (<img src={games.cover} alt={search}/>) : (<p>Aucun jeu trouvé</p>)}
                <p>Ok2</p>
            </div>
        </div>
    )
}

export default Game;