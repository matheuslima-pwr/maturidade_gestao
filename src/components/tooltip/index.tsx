import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

interface FlexTooltipProps {
    children: React.ReactNode;
    className?: string;
    trigger: React.ReactNode;
}

export default function FlexTooltip({ children, className, trigger }: FlexTooltipProps) {
    return (
        <>
            <div className='hidden lg:block'>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            {trigger}
                        </TooltipTrigger>
                        <TooltipContent align='start' className={cn('p-4', className)}>
                            {children}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <div className='block lg:hidden'>
                <Popover>
                    <PopoverTrigger asChild>
                        {trigger}
                    </PopoverTrigger>
                    <PopoverContent align='start' className={cn('border-none p-4', className)}>
                        {children}
                    </PopoverContent>
                </Popover>
            </div>
        </>
    )
}