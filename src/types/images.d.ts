declare module "*.svg" {
  import { FunctionalComponent, JSX } from "preact";

  const ReactComponent: FunctionalComponent<JSX.SVGAttributes<SVGSVGElement> & { title?: string }>;

  export default ReactComponent;
}

declare module "*.jpg";
declare module "*.png";
