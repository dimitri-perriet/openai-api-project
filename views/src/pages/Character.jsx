import React from 'react';
import Header from "../components/Header";
import {decodeToken} from "react-jwt";
import { register } from 'swiper/element/bundle';


function Character ()
{
    register();

    const token = JSON.parse(sessionStorage.getItem('token'));
    const user = decodeToken(token);
    let [game, setGame] = React.useState(null);

    function handleEmptyImg()
    {
        const swiperEl = document.querySelector('swiper-container');
            swiperEl.swiper.slideNext();
            console.log(swiperEl.swiper.activeIndexChange)

    }

    return (
        <div>
            <Header title={"Top ! Ajoutons un personnage, " + user.firstname + " !"}/>

            { !game &&
                <div>
                <swiper-container class="mySwiper" effect="cards" grab-cursor="true">
                    <swiper-slide>Slide 1</swiper-slide>
                    <swiper-slide>Slide 2</swiper-slide>
                    <swiper-slide>Slide 3</swiper-slide>
                </swiper-container>

                <button className={"mx-auto"} onClick={handleEmptyImg}>Ok</button>

                    </div>
            }


        </div>
    )
}

export default Character;