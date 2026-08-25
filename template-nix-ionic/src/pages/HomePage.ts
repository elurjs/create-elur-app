import { html, nixRouter } from "@deijose/nix-js";
import { IonPage, createToast } from "@deijose/nix-ionic";
import type { PageContext } from "@deijose/nix-ionic";

export class HomePage extends IonPage {
  private toast = createToast();

  constructor(ctx: PageContext) {
    super(ctx.lc);
  }

  override onUnmount() {
    this.toast.dispose();
  }

  override render() {
    const router = nixRouter();

    return html`
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>My Nix-Ionic App</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-content class="ion-padding">
        <ion-card>
          <ion-card-header>
            <ion-card-title>Welcome to Nix-Ionic</ion-card-title>
            <ion-card-subtitle>Powered by Nix.js + Ionic + Capacitor</ion-card-subtitle>
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
              @click=${() => this.toast.present({ message: "Hello from Nix-Ionic!", duration: 2000 })}
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
