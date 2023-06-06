import React, {useEffect} from 'react';
import Header from "../components/Header";
import {decodeToken} from "react-jwt";
import {register} from 'swiper/element/bundle';


function Character() {
    register();

    const token = JSON.parse(sessionStorage.getItem('token'));
    const user = decodeToken(token);
    let [game, setGame] = React.useState(null);
    let [currentGame, setCurrentGame] = React.useState(null);
    let [gameChosen, setGameChosen] = React.useState(false);


    function handleEmptyImg() {
        const swiperEl = document.querySelector('swiper-container');
        setCurrentGame(game[swiperEl.swiper.activeIndex])
        setGameChosen(true)
        console.log(gameChosen)
    }

    useEffect(() => {
        const token = JSON.parse(sessionStorage.getItem('token'));
        const user = decodeToken(token);

        let myHeaders = new Headers();
        myHeaders.append("Bearer", token);

        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };

        fetch("api/games/user/" + user.id, requestOptions)
            .then(response => response.json())
            .then(data => {setGame(data)})
            .catch(error => console.log('error', error));
    }, []);

    useEffect(() => {
        console.log(currentGame)
    }, [currentGame]);

    return (
        <div>
            <Header title={"Top ! Ajoutons un personnage, " + user.firstname + " !"}/>

            {(Array.isArray(game) && !gameChosen) &&
                <div className={"flex content-center flex-col"}>
                    <swiper-container class="mySwiper" effect="cards" grab-cursor="true">
                        { game.map(singleGame => <swiper-slide key={singleGame.ID}> <img src={singleGame.cover} alt={singleGame.name}/> </swiper-slide>)}
                    </swiper-container>

                    <button className={""} onClick={handleEmptyImg}>Ok</button>

                </div>
            }

        </div>
    )
}

export default Character;