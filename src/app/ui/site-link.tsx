
import Link from "next/link";
import * as React from "react";

type SiteLinkProps = Omit<
  React.ComponentProps<typeof Link>,
  "href"
> & {
  href?: string;
};

const SiteLink = React.forwardRef<HTMLAnchorElement, SiteLinkProps>(
  function SiteLink({ href, ...props }, ref) {
    if (!href) {
      return <a ref={ref} {...props} />;
    }

    const isInternal =
      href.startsWith("/") && !href.startsWith("//");

    if (!isInternal) {
      return <a ref={ref} href={href} {...props} />;
    }

    return <Link ref={ref} href={href} {...props} />;
  }
);

SiteLink.displayName = "SiteLink";

export { SiteLink };
export type { SiteLinkProps };
