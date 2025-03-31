import { useState, useEffect } from 'react';
import { WindowMessenger, connect } from 'penpal';
import type { RemoteProxy, Connection, Methods } from 'penpal';

type ConnectOptions = typeof connect.prototype.options;
type AllowedOrigins = (string | RegExp)[];

/**
 * A React hook simplifying access to a Penpal parent's methods and connection
 * objects from an iframe child.
 */
export function usePenpalParent<ParentMethods extends Methods>(
  connectOptions: ConnectOptions,
  allowedOrigins?: AllowedOrigins
) {
  const [useOptions] = useState(connectOptions); // prevents render loop
  const [connection, setConnection] = useState<Connection | null>(null);
  const [parentMethods, setParentMethods] =
    useState<RemoteProxy<ParentMethods> | null>(null);

  useEffect(() => {
    const messenger = new WindowMessenger({
      remoteWindow: window.parent,
      allowedOrigins: allowedOrigins,
    });

    const connection = connect<typeof connectOptions['methods']>({
      messenger,
      ...useOptions,
    });

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
