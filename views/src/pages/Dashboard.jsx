import React from "react";

function Dashboard() {
    let user = JSON.parse(sessionStorage.getItem('user'));

    return (
        <div>
            <div className="flex justify-center">
                <div className="overflow-hidden -mr-8 mt-14 h-44 w-44 rounded-full shadow-base bg-[#ffffff] bg-[url('./assets/monkey.gif')] bg-[length:90%_70%] bg-no-repeat bg-center">
                </div>
                <img src="./images/chat-bubble.svg" alt="chat-bubble"/>
                <h1 className="absolute font-cofo text-xl ml-36 pt-24">Que souhaites-tu faire, {user.firstname} ?</h1>
            </div>
        </div>



    );
}

export default Dashboard;