type ErrorMessageprops = {
    pageTitle?: string;
    contentTitle:string
    content: React.ReactNode;
}

export default function ErrorMessage({pageTitle='', contentTitle, content}: ErrorMessageprops) {
    return (
        <>
            {pageTitle && <title>{pageTitle}</title>}
            <div className='mb-16 flex min-h-80 items-center justify-center rounded-xl border border-(--card-border)] bg-(--card-background) p-8 text-center text-(--text-color)'>
                <div>
                    <h1 className="text-7xl/normal mb-4 font-extrabold">{contentTitle}</h1>
                    <div>
                        {content}
                    </div>
                </div>
            </div>    
        </>
    );
}