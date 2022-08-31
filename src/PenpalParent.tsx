import React, { createRef, useEffect } from 'react';
import { connectToChild } from 'penpal';
import { AsyncMethodReturns, Methods, PenpalError } from 'penpal';

interface PenpalParentProps {
  /**
   * Function created by useState hook, i.e.
   * `const [child, setChild] = React.useState()`
   * This callback is used to allow returning the child asynchronously when a
   * connection is created, and destroying when the connection is broken
   */
  setChild: React.Dispatch<React.SetStateAction<AsyncMethodReturns<any>>>;
  /**
   * Callback handler for when penpal throw errors
   */
  onError?: (error: PenpalError) => void;
  /**
   * A mapping of your method names to their respective handler functions
   */
  methods?: Methods;
  /**
   * The child origin to use to secure communication. If
   * not provided, the child origin will be derived from the
   * iframe's src or srcdoc value.
   */
  childOrigin?: string;
  /**
   * The amount of time, in milliseconds, Penpal should wait
   * for the iframe to respond before rejecting the connection promise.
   */
  timeout?: number;
  /**
   * Whether log messages should be emitted to the console.
   */
  debug?: boolean;
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
  childOrigin,
  timeout,
  debug,
  ...iframeProps
}) => {
  const ref = createRef<HTMLIFrameElement>();

  useEffect(() => {
    const connection = connectToChild({
      iframe: ref.current,
      methods,
      childOrigin,
      timeout,
      debug,
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
