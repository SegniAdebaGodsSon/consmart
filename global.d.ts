import React from "react";

declare module "react" {
    // augment CSSProperties here
    interface CSSProperties {
        "--value"?: string | number;
        "--size"?: string | number;
        "--thickness"?: string | number;
    }
}

declare global {
    interface Window {
        my_modal_1: any,
        my_modal_3: any
    }
}