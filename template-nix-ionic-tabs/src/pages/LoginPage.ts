import { html, nixRouter } from "@deijose/nix-js";
import { IonPage } from "@deijose/nix-ionic";
import type { PageContext } from "@deijose/nix-ionic";
import { authStore } from "../stores/auth";

export class LoginPage extends IonPage {
  constructor(ctx: PageContext) {
    super(ctx.lc);
  }

  override render() {
    const router = nixRouter();

    return html`
      <ion-header>
        <ion-toolbar>
          <ion-title>Login</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-content class="ion-padding">
        <ion-card>
          <ion-card-header>
            <ion-card-title>Protected Routes</ion-card-title>
            <ion-card-subtitle>Login to unlock tabs and pages</ion-card-subtitle>
          </ion-card-header>
          <ion-card-content>
            <ion-button
              expand="block"
              @click=${() => {
        authStore.login();
        router.replace("/");
      }}
            >
              <ion-icon slot="start" name="log-in-outline"></ion-icon>
              Sign in
            </ion-button>
          </ion-card-content>
        </ion-card>
      </ion-content>
    `;
  }
}
