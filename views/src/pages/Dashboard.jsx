import React from "react";
import DashboardCard from "../components/DashboardCard";
import Header from "../components/Header";

function Dashboard() {
    let user = JSON.parse(sessionStorage.getItem("user"));
    return (
        <div>
            <Header title={"Que souhaites-tu faire, " + user.firstname +" ?"}/>
            <div className="grid grid-cols-3 auto-cols-max justify-items-center mt-24">
                <DashboardCard justifyclass="justify-self-end" image="./icon/add-circle.svg" text="Ajouter un jeu"/>
                <DashboardCard justifyclass="" image="./icon/person-add.svg" text="Créer un personnage"/>
                <DashboardCard justifyclass="justify-self-start" image="./icon/game-controller.svg" text="Accèdes à tes jeux"/>
            </div>
        </div>
    )
}

export default Dashboard;