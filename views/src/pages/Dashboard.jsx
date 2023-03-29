import React from "react";
import DashboardCard from "../components/DashboardCard";

function Dashboard() {
    return (
        <div className="grid grid-cols-3 auto-cols-max justify-items-center mt-24">
            <DashboardCard justifyclass="justify-self-end" image="./icon/add-circle.svg" text="Ajouter un jeu"/>
            <DashboardCard justifyclass="" image="./icon/person-add.svg" text="Créer un personnage"/>
            <DashboardCard justifyclass="justify-self-start"image="./icon/game-controller.svg" text="Accèdes à tes jeux"/>
        </div>
    )
}

export default Dashboard;