import type { ResolvedOptions } from 'roughjs/bin/core';
export interface Rect {
    x: number;
    y: number;
    w: number;
    h: number;
}
export type RoughAnnotationType = 'underline' | 'box' | 'circle' | 'highlight' | 'strike-through' | 'crossed-off' | 'bracket';
export type FullPadding = [number, number, number, number];
export type RoughPadding = number | [number, number] | FullPadding;
export type BracketType = 'left' | 'right' | 'top' | 'bottom';
export interface RoughAnnotationConfig extends RoughAnnotationConfigBase, Partial<ResolvedOptions> {
    type: RoughAnnotationType;
    multiline?: boolean;
    rtl?: boolean;
}
export interface RoughAnnotationConfigBase {
    animate?: boolean;
    animationDuration?: number;
    color?: string;
    strokeWidth?: number;
    padding?: RoughPadding;
    iterations?: number;
    brackets?: BracketType | BracketType[];
    delay?: number;
    opacity?: number;
    zIndex?: number;
    /**
     * Additional class to add to the root SVG element
     */
    class?: string;
}
export interface RoughAnnotation extends RoughAnnotationConfigBase {
    isShowing(): boolean;
    show(): void;
    hide(): void;
    remove(): void;
    type: RoughAnnotationType;
}
export interface RoughAnnotationGroup {
    show(): void;
    hide(): void;
}
export type AnnotationState = 'unattached' | 'not-showing' | 'showing';
