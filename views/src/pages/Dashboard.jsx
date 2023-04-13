import React from "react";
import DashboardCard from "../components/DashboardCard";
import Header from "../components/Header";
import {decodeToken} from "react-jwt";

function Dashboard() {
    const token = JSON.parse(sessionStorage.getItem("token"));
    const user = decodeToken(token)

    return (
        <div>
            <Header title={"Que souhaites-tu faire, " + user.firstname +" ?"}/>
            <div className="grid grid-cols-3 auto-cols-max justify-items-center mt-24">
                <DashboardCard justifyclass="justify-self-end" image="./icon/add-circle.svg" text="Ajouter un jeu" link="/game"/>
                <DashboardCard justifyclass="" image="./icon/person-add.svg" text="Créer un personnage" link="/character"/>
                <DashboardCard justifyclass="justify-self-start" image="./icon/game-controller.svg" text="Accède à tes jeux"/>
            </div>
        </div>
    )
}

export default Dashboard;