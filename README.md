# react-penpal

A React wrapper for the [Penpal](https://github.com/Aaronius/penpal) iframe postMessage communication library.

Version 2.0 releases the missing counterpart of the library from 1.0, which is the child page consumer to the parent: The `usePenpalParent()` hook. The parent tag has therefore been renamed from `<Penpal>` to `<PenpalParent>`. There is no mirror `<PenpalChild>` tag.

## Important: This Project is a Fork

This project is from [Lunuy/react-penpal](https://github.com/Lunuy/react-penpal) to update peer dependencies; in particular to support installing in a React 18 environment.

It is further forked from [zetlen/react-penpal](https://github.com/zetlen/react-penpal) because at the time of writing, their published package is missing the compiled files.

The code, examples and documentation have also been furthered, including the addition of code to complete the child side of the library.

## Code Example

In your parent application:

```ts
import React, { useEffect, useState } from 'react';
import reactDOM from 'react-dom';

import { AsyncMethodReturns } from 'penpal';
import { Penpal } from '@weblivion/react-penpal';

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

```

And in your child application:

```ts
import React, { useEffect, useState } from 'react';
import reactDOM from 'react-dom';

import { usePenpalParent } from '@weblivion/react-penpal';

function App() {
  const [message, setMessage] = useState('');
  const { parentMethods, connection } = usePenpalParent({
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
reactDOM.render(<App />, main);

```

Pull requests and other offers of help welcome.
