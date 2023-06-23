import React, {useEffect, useRef} from 'react';
import Header from "../components/Header";
import { decodeToken } from "react-jwt";
import { register } from 'swiper/element/bundle';


function Chat() {
    register();

    const token = JSON.parse(sessionStorage.getItem('token'));
    const user = decodeToken(token);
    let [game, setGame] = React.useState(null);
    let [currentGame, setCurrentGame] = React.useState(null);

    const swiperRef = useRef(null);

    function handleEmptyImg() {
        const swiperEl = swiperRef.current.swiper;
        setCurrentGame(game[swiperEl.activeIndex]);
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
            <Header title={"Avec qui souhaites-tu parler, " + user.firstname + " ?"} />
            {Array.isArray(game) &&
                <div className={"grid grid-cols-2 auto-cols-max justify-items-center mt-24"}>

                    <div className={"flex flex-row justify-self-end"}>
                        <swiper-container class="mySwiper" effect="cards" grab-cursor="true" ref={swiperRef}>
                            {game.map(singleGame => <swiper-slide key={singleGame.ID}> <img src={singleGame.cover} alt={singleGame.name} /> </swiper-slide>)}
                        </swiper-container>
                        <h2 className={"-ml-10 -rotate-90 h-fit my-auto text-secondary text-xl font-cofo w-52 text-center"}>{currentGame ? currentGame.name : "Test"}</h2>
                    </div>


                    <div className={"flex flex-row items-center justify-self-start"}>


                    </div>
                </div>
            }

        </div>
    )
}

export default Chat;