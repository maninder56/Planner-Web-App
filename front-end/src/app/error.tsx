'use client';

import { useEffect } from "react";


export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
    useEffect(() => {
        if (error !== undefined) {
            console.log(error); 
        }
    }, [error]); 

    return (
        <div className="errorContainer">
            <header>Something went wrong!</header>
            <button
                onClick={() => unstable_retry()}
                className="button red"
            >Try again</button>
        </div>
    ); 
}