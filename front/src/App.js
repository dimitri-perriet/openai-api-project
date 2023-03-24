// client/src/App.js

import React from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [data, setData] = React.useState(null);
  const [requestFailed, setRequestFailed] = React.useState(false);
  const [id, setId] = React.useState('')
    const handleClick = async () => {
        try {
            fetch(`http://localhost:3000/api/message/chat/${id}`)
                .then((res) => {
                    if(!res.ok) {
                        setRequestFailed(true)
                        return res.json();
                    } else {
                        setRequestFailed(false)
                    }
                })
                .then((data) => {
                    setData(data)
                })
        } catch (err) {
            console.log(err.message)

        }
    }

    function checkResponse(data) {
        if (data) {
            console.log(requestFailed)
            if (requestFailed) {
                return <p>Failed!</p>
            } else {
                return <div className='App'>{data.map((item, index) => {
                    return <div key={index}>
                        <p>{item.message}</p>
                    </div>
                })
                }
                </div>;
            }
        } else {
            console.log(data)
            return <p>Loading...</p>;
        }

    }

  return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
            <input className='chat_id' required="required" placeholder='Enter an ID' value={id} onChange={e => setId(e.target.value)} />
            <button type="submit" onClick={handleClick} >Search</button>
            {checkResponse(data)}
        </header>
      </div>
  );
}

export default App;