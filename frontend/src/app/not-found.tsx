import ErrorMessage from "../components/ErrorMessage"

export default function NotFoundPage() {
    return (
            <ErrorMessage pageTitle="Page not found" contentTitle="404" content='Error 404 - This page does not exist'/>
    );
}