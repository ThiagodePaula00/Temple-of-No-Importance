import { BugIcon, CameraIcon, CirclePlayIcon } from "lucide-react";
import Link from "next/link";
import "./footer.css";

const currentYear = new Date().getFullYear();

export function Footer() {
    return (
        <footer className="flex flex-col justify-center text-center pb-6">
            <p className="flex flex-row justify-center gap-4">

                <Link
                  className="social-item social-item--github flex pb-2 cursor-pointer flex-col items-center border-0 bg-transparent p-0 text-xs font-normal text-inherit transition-colors hover:text-black"
                  href="https://github.com/ThiagodePaula00"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Github"
                >
                  <span className="social-tooltip">Github</span>
                  <BugIcon aria-hidden="true" />
                </Link>

                <Link
                  className="social-item social-item--instagram flex pb-2 cursor-pointer flex-col items-center border-0 bg-transparent p-0 text-xs font-normal text-inherit transition-colors hover:bg-linear-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] hover:bg-clip-text hover:text-transparent"
                  href="/"
                  title="Instagram"
                >
                  <span className="social-tooltip">Instagram</span>
                  <CameraIcon aria-hidden="true" className="hover:text-[#ee2a7b]" />
                </Link>

                <Link
                  className="social-item social-item--youtube flex pb-2 cursor-pointer flex-col items-center border-0 bg-transparent p-0 text-xs font-normal text-inherit transition-colors hover:text-red-600"
                  href="/"
                  title="Youtube"
                >
                  <span className="social-tooltip">Youtube</span>
                  <CirclePlayIcon aria-hidden="true" />
                </Link>
            </p>

            <span className="hover:text-(--muted-text-color)">
                    Copyright © {currentYear}{" "}
                <Link href="/">Temple of No Importance</Link>
            </span>
        </footer>
    );
}
