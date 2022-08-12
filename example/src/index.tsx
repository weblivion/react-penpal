
import { AsyncMethodReturns } from "penpal";
import React, { useEffect, useLayoutEffect, useState } from "react";
import reactDOM from "react-dom";
import { Penpal } from "../../dist/index.js";

function App() {
    const [child, setChild] = useState<AsyncMethodReturns<any>>(null);
    const [string, setString] = useState("");

    useEffect(() => {
        if(child) {
            child.hi("HIHIHIHI");
        }
    }, [child]);

    return (
        <div>
            <Penpal
                src="./child.html"
                width={300}
                height={300}
                setChild={setChild}
                methods={{
                    hello(string : string) {
                        setString(string);
                    }
                }}
                style={{
                    border: "0",
                    display: "block"
                }}
            />
            <h1>{string}</h1>
        </div>
    );
}


const main = document.getElementById("main");
reactDOM.render(<App/>, main);