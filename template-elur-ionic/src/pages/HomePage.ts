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
        <ion-toolbar color="primary">
          <ion-title>My Elur-Ionic App</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-content class="ion-padding">
        <ion-card>
          <ion-card-header>
            <ion-card-title>Welcome to Elur-Ionic</ion-card-title>
            <ion-card-subtitle>Powered by Elur + Ionic + Capacitor</ion-card-subtitle>
          </ion-card-header>
          <ion-card-content>
            <p>Edit <code>src/pages/HomePage.ts</code> to get started.</p>
            <ion-button
              expand="block"
              @click=${() => router.navigate("/about")}
            >
              <ion-icon slot="start" name="code-slash-outline"></ion-icon>
              Go to About
            </ion-button>
            <ion-button
              expand="block"
              fill="outline"
              @click=${() => this.toast.present({ message: "Hello from Elur-Ionic!", duration: 2000 })}
            >
              <ion-icon slot="start" name="rocket"></ion-icon>
              Show Toast
            </ion-button>
          </ion-card-content>
        </ion-card>
      </ion-content>
    `;
  }
}
