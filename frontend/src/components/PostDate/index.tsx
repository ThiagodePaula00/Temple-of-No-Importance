"use client";

import { useSyncExternalStore } from "react";
import {
    formatDatetime,
    formatDatetimeUtc,
    formatDistanceToNow,
} from "@/utils/format-datetime";

type PostDateProps = {
    dateTime: string
}

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function PostDate({dateTime}: PostDateProps) {
    const hasMounted = useSyncExternalStore(
        subscribe,
        getClientSnapshot,
        getServerSnapshot,
    );

    const formattedDate = hasMounted
        ? formatDatetime(dateTime)
        : formatDatetimeUtc(dateTime);
    const relativeDate = hasMounted ? formatDistanceToNow(dateTime) : undefined;

    return (
        <time
            className="text-sm/tight text-(--muted-text-color)"
            dateTime={dateTime}
            title={relativeDate}
        >
            {" "}
            {formattedDate}
        </time>
    );
}