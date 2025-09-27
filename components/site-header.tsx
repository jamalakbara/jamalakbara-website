'use client''use client''use client'import { Separator } from "@/components/ui/separator"



import {

  Breadcrumb,

  BreadcrumbItem,import {import { SidebarTrigger } from "@/components/ui/sidebar"

  BreadcrumbLink,

  BreadcrumbList,  Breadcrumb,

  BreadcrumbPage,

  BreadcrumbSeparator,  BreadcrumbItem,import {

} from '@/components/ui/breadcrumb'

import { Separator } from '@/components/ui/separator'  BreadcrumbLink,

import { SidebarTrigger } from '@/components/ui/sidebar'

  BreadcrumbList,  Breadcrumb,export function SiteHeader() {

export function SiteHeader() {

  return (  BreadcrumbPage,

    <header className="flex h-16 shrink-0 items-center gap-2">

      <div className="flex items-center gap-2 px-4">  BreadcrumbSeparator,  BreadcrumbItem,  return (

        <SidebarTrigger className="-ml-1" />

        <Separator orientation="vertical" className="mr-2 h-4" />} from '@/components/ui/breadcrumb'

        <Breadcrumb>

          <BreadcrumbList>import { Separator } from '@/components/ui/separator'  BreadcrumbLink,    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">

            <BreadcrumbItem className="hidden md:block">

              <BreadcrumbLink href="/">import { SidebarTrigger } from '@/components/ui/sidebar'

                Portfolio

              </BreadcrumbLink>  BreadcrumbList,      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">

            </BreadcrumbItem>

            <BreadcrumbSeparator className="hidden md:block" />export function SiteHeader() {

            <BreadcrumbItem>

              <BreadcrumbPage>Dashboard</BreadcrumbPage>  return (  BreadcrumbPage,        <SidebarTrigger className="-ml-1" />

            </BreadcrumbItem>

          </BreadcrumbList>    <header className="flex h-16 shrink-0 items-center gap-2">

        </Breadcrumb>

      </div>      <div className="flex items-center gap-2 px-4">  BreadcrumbSeparator,        <Separator

    </header>

  )        <SidebarTrigger className="-ml-1" />

}
        <Separator orientation="vertical" className="mr-2 h-4" />} from '@/components/ui/breadcrumb'          orientation="vertical"

        <Breadcrumb>

          <BreadcrumbList>import { Separator } from '@/components/ui/separator'          className="mx-2 data-[orientation=vertical]:h-4"

            <BreadcrumbItem className="hidden md:block">

              <BreadcrumbLink href="/">import { SidebarTrigger } from '@/components/ui/sidebar'        />

                Portfolio

              </BreadcrumbLink>        <h1 className="text-base font-medium">Dashboard</h1>

            </BreadcrumbItem>

            <BreadcrumbSeparator className="hidden md:block" />export function SiteHeader() {      </div>

            <BreadcrumbItem>

              <BreadcrumbPage>Dashboard</BreadcrumbPage>  return (    </header>

            </BreadcrumbItem>

          </BreadcrumbList>    <header className="flex h-16 shrink-0 items-center gap-2">  )

        </Breadcrumb>

      </div>      <div className="flex items-center gap-2 px-4">}

    </header>

  )        <SidebarTrigger className="-ml-1" />

}        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/">
                Portfolio
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  )
}