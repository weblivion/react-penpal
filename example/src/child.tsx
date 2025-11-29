import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

import { Reply } from 'penpal';
import { usePenpalParent } from '../../dist/index.js';

type ParentMethods = {
  hello(msg: string): Reply<string>;
};

function App() {
  const [message, setMessage] = useState('');
  const { parentMethods, connection } = usePenpalParent<ParentMethods>({
    methods: {
      hi(message: string) {
        setMessage(message);
      },
    },
  });

  useEffect(() => {
    if (connection) {
      parentMethods.hello('Hello from usePenpalParent');
    }
  }, [connection, parentMethods]);

  return (
    <div>
      <h1>parent.hi(): {message}</h1>
    </div>
  );
}

const main = document.getElementById('main');
const root = createRoot(main);
root.render(<App />);
