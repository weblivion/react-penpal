import { connectToParent } from "penpal";

(async () => {
    const connection = connectToParent<{ hello(greeting: string): void }>({
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