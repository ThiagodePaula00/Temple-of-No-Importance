import { formatDatetime, formatDistanceToNow } from "@/utils/format-datetime"

type PostDateProps = {
    dateTime: string
}

export function PostDate({dateTime}: PostDateProps) {
    return <time className="text-sm/tight text-(--muted-text-color)" dateTime={dateTime} title={formatDistanceToNow(dateTime)}> {formatDatetime(dateTime)}</time>
}