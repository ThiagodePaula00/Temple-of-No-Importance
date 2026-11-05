import { BugIcon, BuildingComplexIcon, CameraIcon, CirclePlayIcon, StarIcon } from "lucide-react";
import Link from "next/link";

const currentYear = new Date().getFullYear();

export function Footer() {
    return (
        <footer className="flex flex-col justify-center text-center pb-6">
            <style dangerouslySetInnerHTML={{ __html: `
                .social-item {
                    position: relative;
                }
                .social-tooltip {
                    position: absolute;
                    bottom: 100%;
                    left: 50%;
                    transform: translateX(-50%) translateY(10px) rotate(15deg);
                    opacity: 0;
                    pointer-events: none;
                    transition: all 0.25s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                    background-color: var(--accent-color, #000);
                    color: #fff;
                    padding: 4px 10px;
                    border-radius: 6px;
                    font-size: 11px;
                    white-space: nowrap;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                    margin-bottom: 8px;
                }
                .social-item:hover .social-tooltip {
                    transform: translateX(-50%) translateY(0px) rotate(0deg);
                    opacity: 1;
                }
            `}} />

            <p className="flex flex-row justify-center gap-4">

                <Link
                  className="social-item flex pb-2 cursor-pointer flex-col items-center border-0 bg-transparent p-0 text-xs font-normal text-inherit transition-colors hover:text-black"
                  style={{ "--accent-color": "#24292e" } as React.CSSProperties}
                  href="https://github.com/ThiagodePaula00"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Github"
                >
                  <span className="social-tooltip">Github</span>
                  <BugIcon aria-hidden="true" />
                </Link>

                <Link
                  className="social-item flex pb-2 cursor-pointer flex-col items-center border-0 bg-transparent p-0 text-xs font-normal text-inherit transition-colors hover:bg-linear-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] hover:bg-clip-text hover:text-transparent"
                  style={{ "--accent-color": "#ee2a7b" } as React.CSSProperties}
                  href="/"
                  title="Instagram"
                >
                  <span className="social-tooltip">Instagram</span>
                  <CameraIcon aria-hidden="true" className="hover:text-[#ee2a7b]" />
                </Link>

                <Link
                  className="social-item flex pb-2 cursor-pointer flex-col items-center border-0 bg-transparent p-0 text-xs font-normal text-inherit transition-colors hover:text-red-600"
                  style={{ "--accent-color": "#ff0000" } as React.CSSProperties}
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