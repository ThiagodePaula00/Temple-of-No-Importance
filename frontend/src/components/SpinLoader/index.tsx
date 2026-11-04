type SpinLoaderProps = {
    className?: string;
}

export function SpinLoader({ className = '' }: SpinLoaderProps) {
    const classes = `w-full h-full flex items-center justify-center ${className}`.trim();

    return (
        <div className={classes}>
            <svg 
                className="w-10 h-10 animate-svg-rotate" 
                viewBox="22 22 44 44"
            >
                <circle 
                    className="animate-svg-dash text-(--text-color)" 
                    cx="44" 
                    cy="44" 
                    r="20.2" 
                    fill="none" 
                    strokeWidth="4.5" 
                    strokeDasharray="80, 200" 
                    strokeDashoffset="0" 
                    strokeLinecap="round"
                    stroke="currentColor"
                />
            </svg>
            <style>{`
                @keyframes svgRotate {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes svgDash {
                    0% {
                        stroke-dasharray: 1, 200;
                        stroke-dashoffset: 0;
                    }
                    50% {
                        stroke-dasharray: 89, 200;
                        stroke-dashoffset: -35;
                    }
                    100% {
                        stroke-dasharray: 89, 200;
                        stroke-dashoffset: -124;
                    }
                }
                .animate-svg-rotate {
                    animation: svgRotate 1.4s linear infinite;
                }
                .animate-svg-dash {
                    animation: svgDash 1.4s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}