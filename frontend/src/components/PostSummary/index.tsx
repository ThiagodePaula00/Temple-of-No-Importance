import { PostDate } from "@/components/PostDate";
import { PostHeading } from "../PostHeading";

type PostSummaryProps = {
    postHeading: 'h1' | 'h2';
    postLink: string;
    createdAt: string;
    title: string;
    excerpt: string;
};

export function PostSummary({postHeading, postLink, createdAt, title, excerpt}: PostSummaryProps) {
    return (
                <div className="flex flex-col gap-2 sm:justify-center">
                    <PostDate dateTime={createdAt}/>

                    <PostHeading as={postHeading} url={postLink}>
                        {title}
                    </PostHeading>

                    <p>
                        {excerpt}
                    </p>
                </div>
    )
}