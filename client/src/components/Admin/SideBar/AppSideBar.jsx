"use client"

import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import TeamSwitcher from "./TeamSwicher"
import NavMain from "./NavMain"
import NavProjects from "./NavProjects"
import NavUser from "./NavUser"
import { faBoxesPacking, faClock, faGlasses, faHatCowboy, faJoint, faPalette, faQuestion, faShirt, faShoePrints, faSprayCanSparkles, faTruckFast, faUsers, faVenusMars } from "@fortawesome/free-solid-svg-icons"
import { getInitialLetter } from "@/utils/formatText"


export default function AppSidebar({ user, active, subActive = false, ...props }) {

  const isActive = (section) => active === section;
  const isSubActive = (section) => subActive === section;

  const data = {
    user: {
      name: `${user.Nombre} ${user.Apellido}`,
      email: user.Correo,
      initialLetters: `${getInitialLetter(user.Nombre || "")}${getInitialLetter(user.Apellido || "")}`,
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: "Productos",
        url: "#",
        icon: faBoxesPacking,
        isActive: isActive("Products"),
        items: [
          {
            title: "Calzado",
            url: "/admin/calzado",
            icon: faShoePrints,
            isActive: isSubActive("calzado")
          },
          {
            title: "Camisas",
            url: "/admin/camisas",
            icon: faShirt,
            isActive: isSubActive("camisas")
          },
          {
            title: "Pantalones",
            url: "/admin/pantalones",
            icon: faShirt,
            isActive: isSubActive("pantalones")
          },
          {
            title: "Gorras",
            url: "/admin/gorras",
            icon: faHatCowboy,
            isActive: isSubActive("gorras")
          },
          {
            title: "Gafas",
            url: "/admin/gafas",
            icon: faGlasses,
            isActive: isSubActive("gafas")
          },
          {
            title: "Relojes",
            url: "/admin/relojes",
            icon: faClock,
            isActive: isSubActive("relojes")
          },
          {
            title: "Perfumes",
            url: "/admin/perfumes",
            icon: faSprayCanSparkles,
            isActive: isSubActive("perfumes")
          },
          {
            title: "Vapers",
            url: "/admin/vapeadores",
            icon: faJoint,
            isActive: isSubActive("vapeadores")
          },
        ],
      },
    ],
    projects: [
      {
        name: "Tallas",
        url: "/admin/sizes",
        icon: faShoePrints,
        isActive: isActive("Sizes"),
      },
      {
        name: "Tipos",
        url: "/admin/types",
        icon: faQuestion,
        isActive: isActive("Types"),
      },
      {
        name: "Géneros",
        url: "/admin/genders",
        icon: faVenusMars,
        isActive: isActive("Genders"),
      },
      {
        name: "Colores",
        url: "/admin/colors",
        icon: faPalette,
        isActive: isActive("Colors"),
      },
      {
        name: "Clientes",
        url: "/admin/clients",
        icon: faUsers,
        isActive: isActive("Clients"),
      },
      {
        name: "Pedidos",
        url: "/admin/orders",
        icon: faTruckFast,
        isActive: isActive("Orders"),
      }
    ],
  }

  return (
    <Sidebar collapsible="icon" className="!bg-black"  {...props}>
      {/* <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader> */}
      <SidebarContent className="bg-[#181818] text-white">
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter className={`bg-[#181818] text-white`}>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
