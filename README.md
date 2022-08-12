# react-penpal
Penpal on React

## Example
parent
```ts
import { AsyncMethodReturns } from "penpal";
import React, { useEffect, useLayoutEffect, useState } from "react";
import reactDOM from "react-dom";
import { Penpal } from "react-penpal";

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
```
child
```ts
import { connectToParent } from "penpal";

(async () => {
    const connection = connectToParent({
        methods: {
            hi(string : string) {
                document.body.appendChild(document.createElement("br"));
                document.body.appendChild(new Text(string));
            }
        }
    });
    const parent = await connection.promise;
    document.body.appendChild(new Text("HELLO WORLD SENDED"));
    parent.hello("HELLO WORLD");
})();
```