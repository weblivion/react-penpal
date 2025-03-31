import React, { useEffect, useState } from 'react';
import reactDOM from 'react-dom';

import { PenpalParent } from '../../dist/index.js';
import type { RemoteProxy, Reply } from 'penpal';

type ChildMethods = {
  hi(msg: string): Reply<string>;
};

function App() {
  const [child, setChild] = useState<RemoteProxy<ChildMethods>>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (child) {
      child.hi('Hi from PenpalParent');
    }
  }, [child]);

  return (
    <div>
      <h1>child.hello(): {message}</h1>
      <PenpalParent
        src='./child.html'
        width={'100%'}
        height={200}
        setChild={setChild}
        methods={{
          hello(message: string) {
            setMessage(message);
          },
        }}
        style={{
          border: '0',
          display: 'block',
        }}
      />
    </div>
  );
}

const main = document.getElementById('main');
reactDOM.render(<App />, main);
