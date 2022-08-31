import React, { useEffect, useState } from 'react';
import reactDOM from 'react-dom';

import { AsyncMethodReturns } from 'penpal';
import { PenpalParent } from '../../dist/index.js';

function App() {
  const [child, setChild] = useState<AsyncMethodReturns<any>>(null);
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
