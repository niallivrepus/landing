import { SiteLink } from "./SiteLink";

export function StoryRowLink({
  title,
  category,
  href,
}: {
  title: string;
  category: string;
  href: string;
}) {
  const cls =
    "group flex flex-col gap-1 border-b border-light-space/[0.08] py-5 transition-colors hover:border-light-space/20 md:flex-row md:items-baseline md:justify-between md:gap-8";
  const titleCls =
    "font-sans text-[17px] font-medium leading-snug tracking-tight text-light-space group-hover:text-light-space md:max-w-[min(100%,520px)]";
  const metaCls = "shrink-0 font-sans text-[13px] text-light-space/40";

  return (
    <SiteLink href={href} className={cls}>
      <span className={titleCls}>{title}</span>
      <span className={metaCls}>{category}</span>
    </SiteLink>
  );
}
