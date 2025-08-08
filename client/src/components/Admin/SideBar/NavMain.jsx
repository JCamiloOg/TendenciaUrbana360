"use client"

import { ChevronRight } from "lucide-react"

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export default function NavMain({ items }) {
    return (
        <SidebarGroup>
            <SidebarGroupLabel className={`text-white`}>Productos</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <Collapsible
                        key={item.title}
                        asChild
                        className="group/collapsible"
                    >
                        <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                                <SidebarMenuButton className={`hover:bg-[#303030] ${item.isActive ? "bg-[#303030]/70" : ""} hover:text-white group-data-[state=open]/collapsible:bg-[#303030] group-data-[state=open]/collapsible:hover cursor-pointer `} tooltip={item.title}>
                                    {item.icon && <FontAwesomeIcon icon={item.icon} />}
                                    <span>{item.title}</span>
                                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <SidebarMenuSub>
                                    {item.items?.map((subItem) => (
                                        <SidebarMenuSubItem key={subItem.title}>
                                            <SidebarMenuSubButton className={`hover:bg-[#303030] ${subItem.isActive ? "bg-[#303030]/70" : ""} hover:text-white text-white`} asChild>
                                                <Link to={subItem.url}>
                                                    {subItem.icon && <FontAwesomeIcon icon={subItem.icon} className="!text-white" />} &nbsp;
                                                    <span>{subItem.title}</span>
                                                </Link>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    ))}
                                </SidebarMenuSub>
                            </CollapsibleContent>
                        </SidebarMenuItem>
                    </Collapsible>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}
