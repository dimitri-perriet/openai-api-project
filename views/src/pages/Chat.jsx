import React, {useEffect, useRef, useState} from 'react';
import Header from "../components/Header";
import { decodeToken } from "react-jwt";
import { register } from 'swiper/element/bundle';
import { ReactComponent as Spinner } from "../assets/spinner.svg";

function Chat() {
    register();

    const token = JSON.parse(sessionStorage.getItem('token'));
    const user = decodeToken(token);
    let [game, setGame] = React.useState(null);
    let [currentGame, setCurrentGame] = React.useState(null);
    let [currentsCharacter, setCurrentsCharacter] = React.useState(null);
    let [chosenCharacter, setChosenCharacter] = React.useState(null);
    let [convID, setConvID] = React.useState(null);
    let [chatMessages, setChatMessages] = useState([]);
    let [inputMessage, setInputMessage] = useState("");

    let [loading, setLoading] = React.useState(false);
    let messagesEndRef = useRef(null);



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
            const swiperEl = document.querySelector('swiper-container');
            swiperEl.addEventListener('slidechange', (event) => {
                handleEmptyImg();
            } );
        }
    });

    useEffect(() => {
        if (currentGame) {
            const token = JSON.parse(sessionStorage.getItem('token'));
            let myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + token);

            let requestOptions = {
                method: 'GET',
                headers: myHeaders,
            };

            fetch("/api/characters/game/" + currentGame.ID, requestOptions)
                .then(response => response.json())
                .then(data => {setCurrentsCharacter(data);})
                .catch(error => console.log('error', error));
        }

    }, [currentGame]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages]);

    function handleCharacterSelect(event) {
        const characterId = chosenCharacter;
        const token = JSON.parse(sessionStorage.getItem('token'));
        const user = decodeToken(token);

        let myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + token);
        myHeaders.append("Content-Type", "application/json");

        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify({
                "user_id": user.id,
                "character_id": characterId
            }),
        };

        setLoading(true);

        fetch("/api/chat/create", requestOptions)
            .then(response => response.json())
            .then(data => {
                setConvID(data.id);
                setLoading(false);
                console.log(data.id)
            })
            .catch(error => {
                if (error.status === 409) {
                    setConvID(error.id);
                }
                console.log('error', error);
                setLoading(false);
            });
    }

    function handleKeyDown(event) {
        if (event.key === 'Enter') {
            if (loading === false) {
                handleSendMessage();
            }
        }
    }
    const handleSendMessage = () => {
        if (loading) {
            return;
        }
        inputMessage = inputMessage.trim();
        if (inputMessage === "") {
            return;
        }
        setChatMessages((prevMessages) => [...prevMessages, { user: { role : "user" }, content: inputMessage }]);
        setInputMessage("");
        const token = JSON.parse(sessionStorage.getItem('token'));

        let myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + token);
        myHeaders.append("Content-Type", "application/json");

        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify({
                "chat_id": convID,
                "message": inputMessage,
            }),
        };

        setLoading(true);

        fetch("/api/message/create", requestOptions)
            .then(response => response.json())
            .then(data => {
                setChatMessages((prevMessages) => [...prevMessages, { user: { role : "assistant" }, content: data.chat }]);
                setLoading(false);
                console.log(data.id)
            })
            .catch(error => {
                console.log('error', error);
                setLoading(false);
            });

    }

    const getMessages = () => {
        const token = JSON.parse(sessionStorage.getItem('token'));

        let myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + token);

        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };
        fetch("/api/message/chat/" + convID, requestOptions)
            .then(response => response.json())
            .then(data => {
                    for (let i = 0; i < data.length; i++) {
                        setChatMessages((prevMessages) => [...prevMessages, { user: { role : data[i].type}, content: data[i].message }]);
                    }
                    setLoading(false);
                    console.log(chatMessages)
                }
            )
    }

    useEffect(() => {
        if (convID) {
            getMessages();
        }
    }, [convID]);

    return (
        <div>
            {convID &&
                <div className="flex flex-col h-full justify-center">
                    <div className="overflow-y-auto mb-auto flex flex-col ml-32 mr-52 h-[80vh]">
                          {chatMessages.map((message, index) => (
                                <div
                                    ref={index === chatMessages.length - 1 ? messagesEndRef : null}
                                    key={index}
                                    className={`m-2 p-2 rounded-lg ${message.user.role === "user" ? "bg-tertiary text-white self-end w-1/3" : "bg-gray-300 text-black self-start w-1/3"}`}
                                >
                                    {message.content}
                                </div>
                        ))}
                    </div>
                    <div className="flex items-center fixed bottom-5 left-1/2 -translate-x-1/2 z-10">
                        <input type="text" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} className="flex-grow m-2 p-2 border-2 border-secondary rounded-lg w-80" onKeyDown={handleKeyDown} placeholder="Tapez votre message..."/>
                        {loading ? (
                                <Spinner className={"m-2"} />
                            ) : (
                                <button onClick={handleSendMessage} className="m-2 p-2 bg-secondary text-white rounded-lg">Envoyer</button>
                            )
                        }
                    </div>
                </div>
            }
            {!convID && <Header title={"Avec qui souhaites-tu parler, " + user.firstname + " ?"} /> }
            {!convID && Array.isArray(game) &&
                <div className={"grid grid-cols-2 auto-cols-max justify-items-center mt-24"}>

                    <div className={"flex flex-row justify-self-end"}>
                        <swiper-container class="mySwiper" effect="cards" grab-cursor="true" ref={swiperRef}>
                            {game.map(singleGame => <swiper-slide key={singleGame.ID}> <img src={singleGame.cover} alt={singleGame.name} /> </swiper-slide>)}
                        </swiper-container>
                        <h2 className={"-ml-10 -rotate-90 h-fit my-auto text-secondary text-xl font-cofo w-52 text-center"}>{currentGame ? currentGame.name : "Test"}</h2>
                    </div>


                    <div className={"flex flex-row items-center justify-self-start"}>

                        <svg className={"rotate-180"} xmlns="http://www.w3.org/2000/svg" width="51.646" height="49.003" viewBox="0 0 51.646 49.003">
                            <g id="arrow-back" transform="translate(-3.938 -4.189)">
                                <path id="Tracé_12" data-name="Tracé 12" d="M27.832,52.131,4.688,28.691,27.832,5.25" transform="translate(0 0)" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/>
                                <path id="Tracé_13" data-name="Tracé 13" d="M5.625,12H52.558" transform="translate(2.276 16.691)" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/>
                            </g>
                        </svg>

                        <select  className={"ml-10 flex mx-auto shadow-input rounded-full focus:outline-secondary placeholder:text-[#707070] w-80 h-9 pl-7"} name={"charac"} onChange={(e) => setChosenCharacter(e.target.value)}>
                            <option selected="true" disabled="disabled">Choisis un personnage</option>
                            {Array.isArray(currentsCharacter) && currentsCharacter.map(singleCharacter => <option key={singleCharacter.ID} value={singleCharacter.ID}>{singleCharacter.name}</option>)}

                        </select>

                        {loading ? (
                            <Spinner className={"ml-3"} />
                        ) : (
                            <svg className={"ml-3 cursor-pointer stroke-black hover:stroke-secondary"} width="46" height="46" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" onClick={handleCharacterSelect}>
                                <path d="M12.31 15.75 16.032 12 12.31 8.25"></path>
                                <path d="M15.514 12H7.97"></path>
                                <path d="M12 21c4.969 0 9-4.031 9-9s-4.031-9-9-9-9 4.031-9 9 4.031 9 9 9Z"></path>
                            </svg>
                        )
                        }
                    </div>
                </div>
            }
        </div>
    )
}

export default Chat;
