import { html, elurRouter } from "@elurjs/core";
import { IonPage } from "@elurjs/ionic";
import type { PageContext } from "@elurjs/ionic";

const demoRoutes = [
  { id: "101", name: "Mountain Loop" },
  { id: "102", name: "Coastal Ride" },
  { id: "103", name: "City Night Route" },
];

export class MapPage extends IonPage {
  constructor(ctx: PageContext) {
    super(ctx.lc);
  }

  override render() {
    const router = elurRouter();

    return html`
      <ion-header>
        <ion-toolbar>
          <ion-title>Map</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-content class="ion-padding">
        <ion-card>
          <ion-card-header>
            <ion-card-title>Route List</ion-card-title>
            <ion-card-subtitle>Tap a route to open a detail page (tab bar hidden)</ion-card-subtitle>
          </ion-card-header>
          <ion-card-content>
            ${demoRoutes.map(
      (route) => html`
                <ion-button
                  expand="block"
                  fill="outline"
                  @click=${() => router.navigate(`/map/route/${route.id}`)}
                >
                  <ion-icon slot="start" name="navigate-outline"></ion-icon>
                  ${route.name}
                </ion-button>
              `,
    )}
          </ion-card-content>
        </ion-card>
      </ion-content>
    `;
  }
}
