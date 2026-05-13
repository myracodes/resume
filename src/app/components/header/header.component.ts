import { Component, Inject, LOCALE_ID } from "@angular/core";

const DEV_PORTS: Record<string, number> = { fr: 4200, en: 4201 };

@Component({
    selector: "app-header",
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.scss"],
    standalone: false,
})
export class HeaderComponent {
    constructor(@Inject(LOCALE_ID) public locale: string) {}

    switchLocale(target: string) {
        if (target === this.locale) return;
        const url = new URL(window.location.href);
        if (url.hostname === "localhost") {
            url.port = String(DEV_PORTS[target] ?? 4200);
            url.pathname = "/";
        } else {
            url.pathname = url.pathname.replace(
                new RegExp(`/${this.locale}(/|$)`),
                `/${target}/`
            );
        }
        window.location.href = url.toString();
    }
}
