type ErrorMessageProps = {
    pageTitle?: string;
    contentTitle: string;
    content: React.ReactNode;
}

export default function ErrorMessage({ pageTitle = '', contentTitle, content }: ErrorMessageProps) {
    return (
        <>
            {pageTitle && <title>{pageTitle}</title>}
            <div className="flex min-h-[70vh] w-full items-center justify-center px-4">
                <div className='w-full max-w-md rounded-xl border border-(--card-border) bg-(--card-background) p-8 text-center text-(--text-color) shadow-lg'>
                    <h1 className="text-7xl/normal mb-4 font-extrabold">{contentTitle}</h1>
                    <div>
                        {content}
                    </div>
                </div>
            </div>    
        </>
    );
}