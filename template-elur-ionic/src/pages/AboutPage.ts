import { html } from "@elurjs/core";
import { IonPage, IonBackButton } from "@elurjs/ionic";
import type { PageContext } from "@elurjs/ionic";

export class AboutPage extends IonPage {
  constructor(ctx: PageContext) {
    super(ctx.lc);
  }

  override render() {
    return html`
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">${IonBackButton("/")}</ion-buttons>
          <ion-title>About</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-content class="ion-padding">
        <ion-card>
          <ion-card-header>
            <ion-card-title>About this template</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <p>
              This template uses <strong>@elurjs/ionic v2</strong> with:
            </p>
            <ul>
              <li>Vite plugin for auto component/icon registration</li>
              <li>IonRouterOutlet with cache policies</li>
              <li>IonPage lifecycle hooks</li>
              <li>Reactive overlays (createToast, createAlert, ...)</li>
              <li>IonBackButton with router integration</li>
              <li>Optional Capacitor support</li>
            </ul>
          </ion-card-content>
        </ion-card>
      </ion-content>
    `;
  }
}
