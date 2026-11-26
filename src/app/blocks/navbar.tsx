
'use client'

import { Button } from '@/app/ui/button'
import { cn } from '@/app/lib/cn'
import Link from 'next/link'
import { ChevronDown, Menu } from 'lucide-react'
import * as React from 'react'

type NavbarHref = string

type NavbarSubLink = {
  label: string
  href: NavbarHref
  newTab?: boolean
}

type NavbarLink = {
  label: string
  href?: NavbarHref
  newTab?: boolean
  items?: NavbarSubLink[]
}

function NavLink({
  link,
  className,
  onClick,
}: {
  link: NavbarSubLink
  className: string
  onClick?: () => void
}) {
  return (
    <Link
      href={link.href}
      target={link.newTab ? '_blank' : undefined}
      rel={link.newTab ? 'noopener noreferrer' : undefined}
      className={className}
      onClick={onClick}
    >
      {link.label}
    </Link>
  )
}

type DesktopNavProps = {
  links: NavbarLink[]
  className: string
  linkClass: string
}

function StaticNav({ links, className, linkClass }: DesktopNavProps) {
  return (
    <nav
      className={cn('items-center gap-6', className)}
      aria-label="Main"
    >
      {links.map((link) =>
        link.items?.length ? (
          <span
            key={link.label}
            className={cn('inline-flex items-center gap-1', linkClass)}
          >
            {link.label}
            <ChevronDown
              aria-hidden="true"
              className="relative top-px ml-1 size-3"
            />
          </span>
        ) : (
          link.href && (
            <NavLink
              key={link.label}
              link={{
                label: link.label,
                href: link.href,
                newTab: link.newTab,
              }}
              className={linkClass}
            />
          )
        )
      )}
    </nav>
  )
}

const DropdownNav = React.lazy(async () => {
  const {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
  } = await import('@/app/ui/navigation-menu')

  function DropdownNav({
    links,
    className,
    linkClass,
  }: DesktopNavProps) {
    return (
      <NavigationMenu aria-label="Main" className={className}>
        <NavigationMenuList className="gap-6">
          {links.map((link) => (
            <NavigationMenuItem key={link.label}>
              {link.items?.length ? (
                <>
                  <NavigationMenuTrigger
                    className={cn(
                      'h-auto gap-1 rounded-none bg-transparent p-0 hover:bg-transparent focus:bg-transparent data-open:bg-transparent data-open:hover:bg-transparent data-open:focus:bg-transparent data-popup-open:bg-transparent data-popup-open:hover:bg-transparent',
                      linkClass
                    )}
                  >
                    {link.label}
                  </NavigationMenuTrigger>

                  <NavigationMenuContent>
                    <div className="grid w-56 gap-1">
                      {link.items.map((sub) => (
                        <NavigationMenuLink
                          key={sub.label}
                          render={
                            <Link
                              href={sub.href}
                              target={sub.newTab ? '_blank' : undefined}
                              rel={
                                sub.newTab
                                  ? 'noopener noreferrer'
                                  : undefined
                              }
                            />
                          }
                        >
                          {sub.label}
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </>
              ) : (
                link.href && (
                  <NavLink
                    link={{
                      label: link.label,
                      href: link.href,
                      newTab: link.newTab,
                    }}
                    className={linkClass}
                  />
                )
              )}
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    )
  }

  return { default: DropdownNav }
})

type MobileDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  brand: React.ReactNode
  finalFocus: React.RefObject<HTMLButtonElement | null>
  children: React.ReactNode
}

const MobileDrawer = React.lazy(async () => {
  const {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
  } = await import('@/app/ui/sheet')

  function MobileDrawer({
    open,
    onOpenChange,
    brand,
    finalFocus,
    children,
  }: MobileDrawerProps) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" finalFocus={finalFocus}>
          <SheetHeader>
            <SheetTitle onClick={() => onOpenChange(false)}>
              {brand}
            </SheetTitle>
          </SheetHeader>

          {children}
        </SheetContent>
      </Sheet>
    )
  }

  return { default: MobileDrawer }
})

function isNavbarLink(
  cta: React.ReactNode | NavbarSubLink
): cta is NavbarSubLink {
  return (
    typeof cta === 'object' &&
    cta !== null &&
    !React.isValidElement(cta) &&
    'label' in cta &&
    'href' in cta
  )
}

const SOLID_KEYFRAMES =
  '@keyframes navbar-solid{to{color:var(--foreground);background-color:color-mix(in oklab,var(--background) 80%,transparent);border-color:var(--border);backdrop-filter:blur(12px)}}'

type NavbarLayout = 'bar' | 'start' | 'split' | 'panel' | 'masthead'

type NavbarProps = React.ComponentProps<'header'> & {
  brand: React.ReactNode
  links: NavbarLink[]
  cta?: React.ReactNode | NavbarSubLink
  overlay?: boolean
  linksAlign?: 'end' | 'center'
  layout?: NavbarLayout
}

function shownLayout(
  layout: NavbarLayout,
  links: NavbarLink[],
  overlay: boolean
): NavbarLayout {
  const wanted = layout === 'masthead' && overlay ? 'split' : layout

  return wanted === 'split' &&
    (links.length < 2 || links.length > 6)
    ? 'bar'
    : wanted
}

function Navbar({
  brand,
  links,
  cta,
  overlay = false,
  linksAlign = 'end',
  layout = 'bar',
  className,
  ...props
}: NavbarProps) {
  const shown = shownLayout(layout, links, overlay)

  const [open, setOpen] = React.useState(false)
  const [menuButtonShown, setMenuButtonShown] = React.useState(false)

  const menuButtonRef = React.useRef<HTMLButtonElement>(null)
  const barRef = React.useRef<HTMLDivElement>(null)
  const brandRef = React.useRef<HTMLDivElement>(null)
  const ctaRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const query = window.matchMedia('not all and (min-width: 48rem)')

    const update = () => setMenuButtonShown(query.matches)

    update()
    query.addEventListener('change', update)

    return () => query.removeEventListener('change', update)
  }, [])

  const brandIsLink =
    React.isValidElement(brand) && brand.type === Link

  const ctaNode = isNavbarLink(cta) ? (
    <Button
      size="sm"
      nativeButton={false}
      render={
        <Link
          href={cta.href}
          target={cta.newTab ? '_blank' : undefined}
          rel={cta.newTab ? 'noopener noreferrer' : undefined}
        >
          {cta.label}
        </Link>
      }
    />
  ) : (
    cta
  )

  const hasCta = Boolean(ctaNode)

  React.useEffect(() => {
    const bar = barRef.current
    const brandBox = brandRef.current
    const ctaBox = ctaRef.current

    if (!bar || !brandBox || !ctaBox) return

    const fit = () => {
      ctaBox.dataset.fits = ''

      if (
        bar.scrollWidth > bar.clientWidth + 1 ||
        brandBox.scrollWidth > brandBox.clientWidth + 1
      ) {
        delete ctaBox.dataset.fits
      }
    }

    const observer = new ResizeObserver(fit)

    observer.observe(bar)
    document.fonts.ready.then(fit)

    return () => observer.disconnect()
  }, [hasCta])

  const desktopLinkClass =
    'text-sm font-medium text-current/80 transition-colors hover:text-current data-[status=active]:text-current'

  const hasDropdowns = links.some((link) => link.items?.length)

  const navFor = (
    navLinks: NavbarLink[],
    className: string
  ) => {
    const navProps: DesktopNavProps = {
      links: navLinks,
      linkClass: desktopLinkClass,
      className,
    }

    return hasDropdowns ? (
      <React.Suspense fallback={<StaticNav {...navProps} />}>
        <DropdownNav {...navProps} />
      </React.Suspense>
    ) : (
      <StaticNav {...navProps} />
    )
  }

  const centerColumn =
    shown === 'panel' ||
    (shown === 'bar' && linksAlign === 'center')

  const half = Math.ceil(links.length / 2)

  const desktopNav =
    shown === 'split'
      ? navFor(links.slice(half), 'hidden md:flex')
      : navFor(
          links,
          cn(
            'hidden md:flex',
            centerColumn && 'justify-self-center',
            shown === 'start' && 'md:ms-4 md:flex-initial',
            shown === 'panel' &&
              'rounded-lg border border-current/10 bg-current/5 px-6 py-2'
          )
        )

  return (
    <header
      data-slot="navbar"
      data-layout={shown}
      className={cn(
        'top-0 z-40 w-full border-b',
        shown === 'masthead' && 'md:-top-16',
        overlay
          ? 'fixed border-transparent bg-transparent text-on-image [animation:navbar-solid_linear_both] [animation-range:0_8px] [animation-timeline:scroll(root)]'
          : 'sticky border-border bg-background/80 text-foreground backdrop-blur-md',
        className
      )}
      {...props}
    >
      {overlay && <style>{SOLID_KEYFRAMES}</style>}

      <div
        ref={barRef}
        className={cn(
          'mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 md:gap-6',
          (centerColumn ||
            shown === 'split' ||
            shown === 'masthead') &&
            'md:grid md:grid-cols-[1fr_auto_1fr]',
          shown === 'split' && 'md:gap-10'
        )}
      >
        {shown === 'split' &&
          navFor(
            links.slice(0, half),
            'hidden md:flex md:justify-self-end'
          )}

        <div
          ref={brandRef}
          className={cn(
            'min-w-0 truncate',
            shown !== 'start' && 'md:min-w-28',
            (shown === 'split' || shown === 'masthead') &&
              'md:col-start-2 md:justify-self-center md:text-center',
            !brandIsLink && 'text-lg font-semibold tracking-tight',
            !brandIsLink && shown === 'masthead' && 'md:text-2xl'
          )}
        >
          {brandIsLink ? brand : <Link href="/">{brand}</Link>}
        </div>

        {(shown === 'start' || centerColumn) && desktopNav}

        <div
          className={cn(
            'col-start-3 flex flex-auto items-center justify-end justify-self-end gap-2 self-stretch md:gap-6',
            shown === 'split' &&
              'md:justify-self-stretch md:justify-between'
          )}
        >
          {shown === 'split' ||
          (shown === 'bar' && !centerColumn)
            ? desktopNav
            : null}

          {ctaNode && (
            <div ref={ctaRef} className="max-md:not-data-fits:hidden">
              {ctaNode}
            </div>
          )}

          <button
            ref={menuButtonRef}
            type="button"
            aria-label="Open menu"
            aria-haspopup="dialog"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className="flex size-9 items-center justify-center rounded-md outline-none transition-colors hover:bg-current/15 focus-visible:ring-[3px] focus-visible:ring-ring/50 md:hidden"
          >
            <Menu className="size-5" />
          </button>

          {menuButtonShown && (
            <React.Suspense fallback={null}>
              <MobileDrawer
                open={open}
                onOpenChange={setOpen}
                brand={brand}
                finalFocus={menuButtonRef}
              >
                <nav
                  className="flex flex-col gap-1 px-4"
                  aria-label="Main"
                >
                  {links.map((link) =>
                    link.items?.length ? (
                      <div
                        key={link.label}
                        className="flex flex-col gap-1"
                      >
                        <span className="px-2 pt-2 text-sm font-medium text-muted-foreground">
                          {link.label}
                        </span>

                        {link.items.map((sub) => (
                          <NavLink
                            key={sub.label}
                            link={sub}
                            onClick={() => setOpen(false)}
                            className="rounded-md py-2 pr-2 pl-4 text-base font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground data-[status=active]:text-foreground"
                          />
                        ))}
                      </div>
                    ) : (
                      link.href && (
                        <NavLink
                          key={link.label}
                          link={{
                            label: link.label,
                            href: link.href,
                            newTab: link.newTab,
                          }}
                          onClick={() => setOpen(false)}
                          className="rounded-md px-2 py-2 text-base font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground data-[status=active]:text-foreground"
                        />
                      )
                    )
                  )}

                  {ctaNode && (
                    <div
                      className="mt-3"
                      onClick={() => setOpen(false)}
                    >
                      {ctaNode}
                    </div>
                  )}
                </nav>
              </MobileDrawer>
            </React.Suspense>
          )}
        </div>
      </div>

      {shown === 'masthead' && (
        <div className="hidden border-t border-border md:block">
          <div className="mx-auto flex h-12 max-w-6xl items-center justify-center px-4 sm:px-6">
            {desktopNav}
          </div>
        </div>
      )}
    </header>
  )
}

export { Navbar }
export type { NavbarLink, NavbarSubLink }
