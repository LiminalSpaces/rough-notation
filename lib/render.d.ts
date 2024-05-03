import { Rect, RoughAnnotationConfig } from "./types";
export declare function renderAnnotation(svg: SVGSVGElement, rect: Rect, config: RoughAnnotationConfig, animationGroupDelay: number, animationDuration: number, seed: number): Promise<void>;
