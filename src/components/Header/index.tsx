import Image from "next/image";

export default function Header() {
    return (
        <header className="w-full h-20 bg-[#004477] content-center px-4 shadow-lg">
            <div className="h-10 w-32 relative">
                <Image src="/img/white-logo.png" alt="logo pwr white" fill sizes="100px"/>
            </div>
        </header>
    )
}