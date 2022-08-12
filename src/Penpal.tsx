
import React, { createRef, HTMLAttributeReferrerPolicy, IframeHTMLAttributes, useEffect, useState } from "react";
import { connectToChild } from "penpal";
import { AsyncMethodReturns, Methods, PenpalError } from "penpal";

type Options = {
    /**
     * Function created by useState() to set state.
     */
    setChild : React.Dispatch<React.SetStateAction<AsyncMethodReturns<any>>>,
    /**
     * Callback will be called when penpal throw errors
     */
    onError? : (error : PenpalError) => void,
    /**
     * Methods that may be called by the iframe.
     */
    methods? : Methods,
    /**
     * The child origin to use to secure communication. If
     * not provided, the child origin will be derived from the
     * iframe's src or srcdoc value.
     */
    childOrigin? : string,
    /**
     * The amount of time, in milliseconds, Penpal should wait
     * for the iframe to respond before rejecting the connection promise.
     */
    timeout? : number,
    /**
     * Whether log messages should be emitted to the console.
     */
    debug? : boolean
};

type Subtract<A, B> = A extends B ? never : A;
type DeleteProp<O, RK> = {[K in (Subtract<keyof O, RK>)]: O[K]};
type OptionallyProps<O> = {[K in keyof O]?: O[K]};

type HTMLIframeProps = React.DetailedHTMLProps<React.IframeHTMLAttributes<HTMLIFrameElement>, HTMLIFrameElement>;
type EditedHTMLIframeProps = OptionallyProps<DeleteProp<HTMLIframeProps, "onError">>;

/**
 * Penpal Component
 */
function Penpal(
    {
        setChild,
        onError,
        methods = {},
        childOrigin,
        timeout,
        debug,
        ...iframeOptions
    }
:
    (Options & EditedHTMLIframeProps)
) {
    const ref = createRef<HTMLIFrameElement>();
    
    useEffect(() => {
        const connection = connectToChild({
            iframe: ref.current,
            methods,
            childOrigin,
            timeout,
            debug
        });

        connection.promise
        .then(child => {
            setChild(child);
        });

        connection.promise
        .catch(error => {
            if(onError)
                onError(error);
            else
                throw error;
        });

        return () => {
            connection.destroy();
            setChild(undefined);
        };
    }, []);

    return (
        <iframe
            ref={ref}
            {...iframeOptions}
        />
    );
};

export default Penpal;