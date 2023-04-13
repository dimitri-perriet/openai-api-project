import React, {useEffect} from "react";
import Header from "../components/Header";
import {decodeToken} from "react-jwt";
import {useNavigate} from "react-router-dom";
import Swal from 'sweetalert2'


function Game() {
    const navigate = useNavigate();
    const token = JSON.parse(sessionStorage.getItem("token"));
    const user = decodeToken(token)
    let [games, setGames] = React.useState([]);
    const [search, setSearch] = React.useState("");

    useEffect(() => {
        const token = JSON.parse(sessionStorage.getItem("token"));


        const data = setTimeout(() => {
            let myHeaders = new Headers();
            myHeaders.append("Bearer", token);

            let requestOptions = {
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

    async function handleAdd() {
        let myHeaders = new Headers();
        myHeaders.append("Bearer", token);
        myHeaders.append("Content-Type", "application/json");

        let raw = JSON.stringify({
            "user_id": user.id,
            "name": games.name,
            "cover": games.cover,
        });

        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
        };

        const addGame = () => {
            return fetch('api/games/create', requestOptions)
                .then(data => data.status)
                .catch()
        }

        const status = await addGame();

        if (status === 201) {
            await Swal.fire({
                title: 'Félicitations, ' + user.firstname +  ' ! ',
                text: "Votre jeu a bien été ajouté.",
                icon: 'success',
                showConfirmButton: false,
                timer: 3000
            })
            return navigate('/dashboard')
        } else if (status === 409) {
            await Swal.fire({
                title: 'Oups !',
                text: "Vous avez déjà ajouté ce jeu.",
                icon: 'error',
                showConfirmButton: false,
                timer: 3000
            })
        } else {
            await Swal.fire({
                title: 'Oups !',
                text: "Une erreur est survenue. Veuillez réessayer ultérieurement.",
                icon: 'error',
                showConfirmButton: false,
                timer: 3000
            })
        }

    }

    return (
        <div>
            <Header title={"Super ! Ajoutons un jeu, " + user.firstname + " !"}/>
            <input className={"flex mx-auto shadow-input rounded-[12px] focus:outline-secondary placeholder:text-[#707070} w-80 h-9 pl-7"} type="text" placeholder="Nom du jeu" onChange={e => setSearch(e.target.value)}/>
            <div className={"grid grid-cols-2 mt-24"}>
                <div className={"justify-self-end mr-60"}>
                    {games.cover ? (<img className={"h-5/6 shadow-input rounded"} src={games.cover} alt={search}/>) : ("")}
                </div>
                <div className={"justify-self-start"}>
                    {games.name ? (<h2 className={"text-secondary text-xl font-cofo justify-self-start"}>{games.name}</h2>) : ("")}
                    {games.first_release_date ? (<p className={"text-normal font-cofo text-base justify-self-start"}>Sortie : {games.first_release_date}</p>) : ("")}
                    {games.name ? (<div className={"flex place-content-center mt-20"}>
                        <svg className={"stroke-black hover:stroke-secondary cursor-pointer"} onClick={handleAdd} width="30" height="30" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 5.25v13.5"></path>
                            <path d="M18.75 12H5.25"></path>
                        </svg>
                    </div>
                        ) : ("")}
                </div>
            </div>
        </div>
    )
}

export default Game;