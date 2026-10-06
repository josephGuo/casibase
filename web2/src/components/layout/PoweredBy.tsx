import {CustomHtml} from "@/components/common/CustomHtml";
import * as Conf from "@/Conf";
import {useIsDark} from "@/hooks/use-theme";
import {useSite} from "@/hooks/use-site";
import * as Setting from "@/lib/setting";

/**
 * The default footer: "Powered by" followed by the OpenAgent wordmark. The built-in
 * site or the instance config can replace the whole line with its own footer HTML.
 */
export function PoweredBy() {
  const isDark = useIsDark();
  const {site} = useSite();

  const footerHtml = site?.footerHtml || Conf.FooterHtml;
  if (footerHtml && !footerHtml.includes("/img/openagent-logo_1900x450.png")) {
    return <CustomHtml html={footerHtml} />;
  }

  return (
    <span className="inline-flex items-center gap-1">
      Powered by
      <a href="https://openagentai.org" target="_blank" rel="noreferrer">
        <img
          src={Setting.getLogo([isDark ? "dark" : "light"])}
          alt="OpenAgent"
          height={20}
          className="h-5 w-auto pb-[3px]"
        />
      </a>
    </span>
  );
}
