import { html, elurRouter, signal } from "@elurjs/core";
import { IonPage, createAlert } from "@elurjs/ionic";
import type { PageContext } from "@elurjs/ionic";
import { authStore } from "../stores/auth";

export class ProfilePage extends IonPage {
  private alert = createAlert();
  private visits = signal(0);

  constructor(ctx: PageContext) {
    super(ctx.lc);
  }

  override ionViewWillEnter() {
    this.visits.value++;
  }

  override onUnmount() {
    this.alert.dispose();
  }

  override render() {
    const router = elurRouter();

    return html`
      <ion-header>
        <ion-toolbar>
          <ion-title>Profile</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-content class="ion-padding">
        <ion-card>
          <ion-card-header>
            <ion-card-title>Profile</ion-card-title>
            <ion-card-subtitle>Visits: ${() => this.visits.value}</ion-card-subtitle>
          </ion-card-header>
          <ion-card-content>
            <p>Signed in as <strong>demo user</strong>.</p>
            <ion-button
              expand="block"
              color="danger"
              @click=${() =>
        this.alert.present({
          header: "Sign out",
          message: "Are you sure you want to sign out?",
          buttons: [
            { text: "Cancel", role: "cancel" },
            {
              text: "Sign out",
              handler: () => {
                authStore.logout();
                router.replace("/login");
              },
            },
          ],
        })}
            >
              <ion-icon slot="start" name="log-out-outline"></ion-icon>
              Sign out
            </ion-button>
          </ion-card-content>
        </ion-card>
      </ion-content>
    `;
  }
}
