import * as React from "react";
import i18next from "i18next";
import {ChevronDown, Inbox, LogOut, Settings} from "lucide-react";
import {useNavigate} from "react-router-dom";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {SidebarTrigger} from "@/components/ui/sidebar";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {BreadcrumbBar} from "@/components/layout/BreadcrumbBar";
import {LanguageSelect} from "@/components/common/LanguageSelect";
import {ThemeToggle} from "@/components/common/ThemeToggle";
import {useAccount} from "@/hooks/use-account";
import {useLogout} from "@/hooks/use-logout";
import {useHoverMenu} from "@/hooks/use-hover-menu";
import {useUnreadNotificationCount} from "@/hooks/use-unread-notifications";
import * as Setting from "@/lib/setting";

export function Header() {
  const {account} = useAccount();
  const navigate = useNavigate();
  const logout = useLogout();
  const accountMenu = useHoverMenu();
  const unreadCount = useUnreadNotificationCount(account);

  if (!account) {
    return null;
  }

  const avatarUrl = Setting.getEffectiveAvatarUrl(account);

  // built-in login keeps its profile in OpenAgent; Casdoor users edit theirs in Casdoor
  const openMyAccount = () => {
    if (Setting.isBasicLoginMode(account)) {
      navigate("/account");
      return;
    }
    const url = Setting.getMyProfileUrl(account);
    if (url) {
      Setting.openLink(url);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 px-3 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      {/* toggles the rail on a desktop and opens the sheet on a phone */}
      <SidebarTrigger className="-ml-1" />
      <BreadcrumbBar />

      <div className="ml-auto flex items-center gap-1.5">
        <LanguageSelect />
        <ThemeToggle />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              aria-label={i18next.t("general:Notifications")}
              onClick={() => navigate("/user-notifications")}
            >
              <Inbox />
              {unreadCount > 0 ? (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-medium leading-none text-white">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              ) : null}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{i18next.t("general:Notifications")}</TooltipContent>
        </Tooltip>

        <DropdownMenu {...accountMenu.root}>
          <DropdownMenuTrigger asChild {...accountMenu.trigger}>
            <button type="button" className="ml-1 flex items-center gap-2 rounded-md p-1 hover:bg-accent">
              <Avatar className="h-8 w-8">
                {avatarUrl ? <AvatarImage src={avatarUrl} alt={account.name} /> : null}
                <AvatarFallback style={{backgroundColor: Setting.getAvatarColor(account.name), color: "#fff"}}>
                  {(account.name || "?").charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="hidden max-w-[160px] truncate text-sm md:inline">
                {account.displayName || account.name}
              </span>
              <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56" {...accountMenu.content}>
            <DropdownMenuLabel className="truncate font-normal">
              <div className="text-sm font-medium">{account.displayName || account.name}</div>
              <div className="truncate text-xs text-muted-foreground">
                {account.owner}/{account.name}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={openMyAccount}>
              <Settings />
              {i18next.t("account:My Account")}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={logout}>
              <LogOut />
              {i18next.t("account:Sign Out")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
