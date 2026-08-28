import { html, elurRouter } from "@elurjs/core";
import { IonPage, createToast } from "@elurjs/ionic";
import type { PageContext } from "@elurjs/ionic";

export class HomePage extends IonPage {
  private toast = createToast();

  constructor(ctx: PageContext) {
    super(ctx.lc);
  }

  override onUnmount() {
    this.toast.dispose();
  }

  override render() {
    const router = elurRouter();

    return html`
      <ion-header>
        <ion-toolbar>
          <ion-title>Home</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-content class="ion-padding">
        <ion-card>
          <ion-card-header>
            <ion-card-title>Elur-Ionic Tabs</ion-card-title>
            <ion-card-subtitle>IonRouterOutlet + createBottomTabBar + NavigationManager</ion-card-subtitle>
          </ion-card-header>
          <ion-card-content>
            <p>This page is protected by <code>beforeEnter</code> and rendered inside Ionic's router outlet.</p>
            <ion-button expand="block" @click=${() => router.navigate("/map")}>
              Open Map Tab
            </ion-button>
            <ion-button
              expand="block"
              fill="outline"
              @click=${() => this.toast.present({ message: "Welcome!", duration: 1500 })}
            >
              Show Toast
            </ion-button>
          </ion-card-content>
        </ion-card>
      </ion-content>
    `;
  }
}
