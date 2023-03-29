import React from "react";

function DashboardCard(props) {
    return (
        <button className={props.justifyclass}>
            <div className="w-80 h-80 bg-white shadow-base rounded-lg border-2 border-primary font-cofo text-lg text-normal flex flex-col place-content-center">
                <div className="max-w-[80px} mx-auto">
                    <img src={props.image} alt={props.text}/>
                </div>
                <div>
                    {props.text}
                </div>
            </div>
        </button>
    )
}

export default DashboardCard;