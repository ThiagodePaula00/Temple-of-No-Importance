'use client';


import ErrorMessage from "@/components/ErrorMessage";
import { useEffect } from "react";

type RootErrorPageProps = {
    error: Error,
    reset: () => void
}

export default function RootErrorPage({error}: RootErrorPageProps) {
    useEffect(() => {

    }, [error])
    return (
            <ErrorMessage pageTitle="Internal Server Error" contentTitle="501" content='An error occurred from which our application was unable to recover. Try again later'/>
    );
}