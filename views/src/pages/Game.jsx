import React, {useEffect} from "react";
import Header from "../components/Header";
import {decodeToken} from "react-jwt";


function Game() {
    const token = JSON.parse(sessionStorage.getItem("token"));
    const user = decodeToken(token)
    let [games, setGames] = React.useState([]);
    const [search, setSearch] = React.useState("");

    useEffect(() => {
        const token = JSON.parse(sessionStorage.getItem("token"));


        const data = setTimeout(() => {
            var myHeaders = new Headers();
            myHeaders.append("Bearer", token);

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

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
            <input className={"flex mx-auto shadow-input rounded-[12px] focus:outline-secondary placeholder:text-[#707070} w-80 h-9 pl-7"} type="text" placeholder="Nom du jeu" onChange={e => setSearch(e.target.value)}/>
            <div className="grid grid-cols-2 auto-cols-max justify-items-center mt-24">
                {games.cover ? (<img className={"h-5/6 shadow-input rounded"} src={games.cover} alt={search}/>) : ("")}
                {games.name ? (<h2 className={"text-secondary text-xl justify-self-start"}>{games.name}</h2>) : ("")}
                {games.first_release_date ? (<p className={"text-secondary text-sm justify-self-start"}>{games.first_release_date}</p>) : ("")}
            </div>
        </div>
    )
}

export default Game;