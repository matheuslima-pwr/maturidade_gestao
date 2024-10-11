import { cn } from "@/lib/utils"
import Image from "next/image";
import Link from "next/link";
import LogoutButton from "./logout-button";
import { Icon } from "@iconify/react";

export default function AdminSidebarMenu() {


    return (
        <div className="flex h-full w-72 flex-col justify-between bg-gray-900 text-gray-100">
            <div>
                <div className="p-4">
                    <h1 className="text-2xl font-bold">Logo</h1>
                </div>
                <nav className="space-y-2 px-4">
                    <NavItem icon='ph:strategy' label="Posicionamento Estratégico" href='/admin/forms/pe' />
                    <NavItem icon='material-symbols:team-dashboard' label="Maturidade em Gestão" href='/admin/forms/mg' />
                </nav>
            </div>
            <div className="p-4">
                <div className="flex items-center space-x-4">
                    <Image
                        src="/placeholder.svg?height=40&width=40"
                        alt="User avatar"
                        className="h-10 w-10 rounded-full"
                        width={0}
                        height={0}
                        priority
                    />
                    <div>
                        <p className="font-medium">Administrador PWR</p>
                        <p className="text-sm text-gray-400">john@example.com</p>
                    </div>
                </div>
                <LogoutButton/>
            </div>
        </div>
    )
}

interface NavItemProps {
    icon: string;
    label: string;
    isActive?: boolean;
    href?: string;
}

function NavItem({ icon, label, isActive = false, href = '#' }: Readonly<NavItemProps>) {
    return (
        <Link
            href={href}
            className={cn(
                "flex items-center space-x-2 rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-800",
                isActive && "bg-gray-800 text-white"
            )}
        >
            <Icon icon={icon} height={20} width={20}/>
            <span>{label}</span>
        </Link>
    )
}