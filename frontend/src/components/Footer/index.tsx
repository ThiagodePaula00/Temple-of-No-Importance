import Link from "next/link";

const currentYear = new Date().getFullYear();

export function Footer() {
    return (
        <footer className="py-16 text-center">
            <p>
                <span>
                    Copyright &copy; {currentYear} - <Link href='/'>Temple of No Importance</Link>
                </span>
            </p>
        </footer>
    );
}