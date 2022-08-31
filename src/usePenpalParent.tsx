import { useState, useEffect } from 'react';
import { connectToParent } from 'penpal';
import { AsyncMethodReturns, Connection } from 'penpal/lib/types';

type ConnectToParentOptions = typeof connectToParent.prototype.options;

interface UsePenpalParentOptions extends ConnectToParentOptions {}

/**
 * A React hook simplifying access to a Penpal parent's methods and connection
 * objects from an iframe child.
 *
 * @param options An object of `Penpal.connectToParent()` options:
 *                https://github.com/Aaronius/penpal#connecttoparentoptions-object--object
 */
export function usePenpalParent(options: UsePenpalParentOptions) {
  const [useOptions] = useState(options); // prevents render loop
  const [connection, setConnection] = useState<Connection | null>(null);
  // FIXME: typing pass-through for type
  const [parentMethods, setParentMethods] =
    useState<AsyncMethodReturns<any> | null>(null);

  useEffect(() => {
    const connection = connectToParent<typeof options['methods']>(useOptions);

    connection.promise.then((data) => {
      setParentMethods(data);
      setConnection(connection);
    });

    connection.promise.catch((error) => {
      throw error;
    });

    return () => {
      connection.destroy();
      setParentMethods(null);
    };
  }, [useOptions]);

  return {
    connection,
    parentMethods,
  };
}
