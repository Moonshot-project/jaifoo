import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";
import Link from "next/link";

export default function Header() {
    return (
        <header className="flex items-center justify-between p-6 max-w-6xl mx-auto relative z-50">
            <Link href="/">
                <h1 className="text-2xl font-bold text-gray-900 cursor-pointer hover:text-gray-700 transition-colors">
                    Jaifoo
                </h1>
            </Link>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        size="icon"
                        className="bg-[#ffc92b] hover:bg-[#ffc92a] text-gray-900 rounded-lg w-10 h-10"
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 z-50">
                    <DropdownMenuItem>
                        <Link href="#" className="w-full">
                            Products
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link href="#contact" className="w-full">
                            Contact us
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link href="#" className="w-full">
                            Report problems
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link href="/signup" className="w-full">
                            Join wait list
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
}
