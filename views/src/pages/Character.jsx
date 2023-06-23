import React, { useEffect, useRef } from 'react';
import Header from "../components/Header";
import { decodeToken } from "react-jwt";
import { register } from 'swiper/element/bundle';
import {useNavigate} from "react-router-dom";
import Swal from "sweetalert2";
import { ReactComponent as Spinner } from "../assets/spinner.svg";

function Character() {
    register();
    const navigate = useNavigate();


    const token = JSON.parse(sessionStorage.getItem('token'));
    const user = decodeToken(token);
    let [game, setGame] = React.useState(null);
    let [currentGame, setCurrentGame] = React.useState(null);
    let [character, setCharacter] = React.useState("");
    let [loading, setLoading] = React.useState(false);

    const swiperRef = useRef(null);

    const characterInputRef = useRef(null);

    function handleEmptyImg() {
        const swiperEl = swiperRef.current.swiper;
        setCurrentGame(game[swiperEl.activeIndex]);
    }

    function handleKeyDown(event) {
        if (event.key === 'Enter') {
            if (loading === false) {
                handleAddCharacter();
            }
        }
    }

    async function handleAddCharacter() {
        const token = JSON.parse(sessionStorage.getItem('token'));

        setLoading(true);

        let myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + token);
        myHeaders.append("Content-Type", "application/json");

        let raw = JSON.stringify({
            "game_id": currentGame.ID,
            "name": character
        });

        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
        };

        const addCharacter = () => {
            return fetch("api/characters/create", requestOptions)
                .then(data => data.status)
                .catch();
        }

        const status = await addCharacter();
        characterInputRef.current.value = '';


        setLoading(false);

        if (status === 201) {
            await Swal.fire({
                title: 'Félicitations, ' + user.firstname +  ' ! ',
                text: character + " a bien été ajouté au jeu " + currentGame.name + "." ,
                icon: 'success',
                showConfirmButton: false,
                timer: 3000
            })
            return navigate('/dashboard')
        } else if (status === 409) {
            await Swal.fire({
                title: 'Oups !',
                text: "Vous avez déjà ajouté ce personnage.",
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

    useEffect(() => {
        const token = JSON.parse(sessionStorage.getItem('token'));
        const user = decodeToken(token);

        let myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + token);

        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };

        fetch("api/games/user/" + user.id, requestOptions)
            .then(response => response.json())
            .then(data => { setGame(data); setCurrentGame(data[0]); })
            .catch(error => console.log('error', error));
    }, []);

    useEffect(() => {
        if (swiperRef.current) {
            const swiperEl = swiperRef.current.swiper;
            swiperEl.on('slideChangeTransitionEnd', handleEmptyImg);

            return () => {
                swiperEl.off('slideChangeTransitionEnd', handleEmptyImg);
            };
        }
    });


    return (
        <div>
            <Header title={"Top ! Ajoutons un personnage, " + user.firstname + " !"} />

            {Array.isArray(game) &&
                <div className={"grid grid-cols-2 auto-cols-max justify-items-center mt-24"}>

                    <div className={"flex flex-row justify-self-end"}>
                        <swiper-container class="mySwiper" effect="cards" grab-cursor="true" ref={swiperRef}>
                            {game.map(singleGame => <swiper-slide key={singleGame.ID}> <img src={singleGame.cover} alt={singleGame.name} /> </swiper-slide>)}
                        </swiper-container>
                        <h2 className={"-ml-10 -rotate-90 h-fit my-auto text-secondary text-xl font-cofo w-52 text-center"}>{currentGame ? currentGame.name : "Test"}</h2>
                    </div>


                    <div className={"flex flex-row items-center justify-self-start"}>

                        <svg xmlns="http://www.w3.org/2000/svg" width="51.646" height="49.003" viewBox="0 0 51.646 49.003">
                            <g id="arrow-back" transform="translate(-3.938 -4.189)">
                                <path id="Tracé_12" data-name="Tracé 12" d="M27.832,52.131,4.688,28.691,27.832,5.25" transform="translate(0 0)" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/>
                                <path id="Tracé_13" data-name="Tracé 13" d="M5.625,12H52.558" transform="translate(2.276 16.691)" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/>
                            </g>
                        </svg>

                        <input ref={characterInputRef} className={"ml-10 flex mx-auto shadow-input rounded-full focus:outline-secondary placeholder:text-[#707070} w-80 h-9 pl-7"} type="text" placeholder="Nom de votre personnage ..." value={character} onChange={(e) => setCharacter(e.target.value)} onKeyDown={handleKeyDown}/>

                        {loading ? (
                            <Spinner className={"ml-3"} />
                            ) : (
                                <svg className={"ml-3 cursor-pointer stroke-black hover:stroke-secondary"} xmlns="http://www.w3.org/2000/svg" width="28.332" height="22.379" viewBox="0 0 28.332 22.379" onClick={handleAddCharacter}>
                                    <g id="checkmark-done" transform="translate(-0.844 -4.607)">
                                        <path id="Tracé_14" data-name="Tracé 14" d="M26.391,6,12.642,25.58,6.75,18.238" transform="translate(1.392)" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                                        <path id="Tracé_15" data-name="Tracé 15" d="M8.142,20.843,2.25,13.5" transform="translate(0 4.738)" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                                        <path id="Tracé_16" data-name="Tracé 16" d="M19.222,6,10.875,17.932" transform="translate(2.669)" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                                    </g>
                                </svg>
                            )
                        }
                    </div>
                </div>
            }

        </div>
    )
}

export default Character;