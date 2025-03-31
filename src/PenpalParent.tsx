import React, { createRef, useEffect } from 'react';
import { WindowMessenger, connect } from 'penpal';
import type { RemoteProxy, Methods, PenpalError } from 'penpal';

interface PenpalParentProps {
  /**
   * Function created by useState hook, i.e.
   * `const [child, setChild] = React.useState()`
   * This callback is used to allow returning the child asynchronously when a
   * connection is created, and destroying when the connection is broken
   */
  setChild: React.Dispatch<React.SetStateAction<RemoteProxy>>;
  /**
   * Callback handler for when penpal throw errors
   */
  onError?: (error: PenpalError) => void;
  /**
   * A mapping of your method names to their respective handler functions
   */
  methods?: Methods;
  /**
   * The permissible origins to use to secure communication. Defaults to the current
   * origin.
   */
  allowedOrigins?: (string | RegExp)[];
  /**
   * The amount of time, in milliseconds, Penpal should wait
   * for the iframe to respond before rejecting the connection promise.
   */
  timeout?: number;
  /**
   * An optional function to which debug logs are passed; Penpal provides
   * a simple `debug` function that logs messages to the console which can be
   * used if you don't want to write your own.
   */
  log?: () => void;
}

type Subtract<A, B> = A extends B ? never : A;

type DeleteProp<O, RK> = { [K in Subtract<keyof O, RK>]: O[K] };

type OptionallyProps<O> = { [K in keyof O]?: O[K] };

type HTMLIframeProps = React.DetailedHTMLProps<
  React.IframeHTMLAttributes<HTMLIFrameElement>,
  HTMLIFrameElement
>;

type EditedHTMLIframeProps = OptionallyProps<
  DeleteProp<HTMLIframeProps, 'onError'>
>;

/**
 * The PenpalParent component invokes the iframe and defines the parent side
 * methods, as well as any attributes intended for the iframe tag.
 */

const PenpalParent: React.FC<PenpalParentProps & EditedHTMLIframeProps> = ({
  setChild,
  onError,
  methods = {},
  allowedOrigins: allowedOrigins,
  timeout,
  log,
  ...iframeProps
}) => {
  const ref = createRef<HTMLIFrameElement>();

  useEffect(() => {
    const messenger = new WindowMessenger({
      remoteWindow: ref.current.contentWindow,
      allowedOrigins: allowedOrigins || [new URL(ref.current.src).origin],
    });

    const connection = connect({
      // iframe: ref.current,
      messenger,
      methods,
      timeout,
      log,
    });

    connection.promise.then((child) => {
      setChild(child);
    });

    connection.promise.catch((error) => {
      if (onError) onError(error);
      else throw error;
    });

    return () => {
      connection.destroy();
      setChild(undefined);
    };
  }, []);

  return <iframe ref={ref} {...iframeProps} />;
};

export { PenpalParent };
export type { PenpalParentProps };
