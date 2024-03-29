import React from "react";
import {useNavigate} from "react-router-dom";

function DashboardCard(props) {
    const navigate = useNavigate();
    function handleClick() {
        return navigate(props.link)
    }

    return (
        <button onClick={handleClick} className={"rounded-[40px] shadow-input " + props.justifyclass}>
            <div className="w-72 h-80 bg-white rounded-[40px] border-2 border-primary font-cofo text-lg text-normal flex flex-col place-content-center">
                <div className="max-w-[80px} mx-auto">
                    <img src={props.image} alt={props.text}/>
                </div>
                <div className="mt-5">
                    {props.text}
                </div>
            </div>
        </button>
    )
}

export default DashboardCard;