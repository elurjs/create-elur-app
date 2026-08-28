declare module "*.css";
declare module "@ionic/core/css/*";
declare module "*?raw" {
    const content: string;
    export default content;
}

declare module "*.svg" {
    const src: string;
    export default src;
}