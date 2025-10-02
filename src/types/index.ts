// Re-export all types for easy importing
import {MapCenter} from "@/types/map";

export * from './map';
export * from './marker';

// Global types
export interface ApiResponse<T = any> {
    success: boolean;
    data: T;
    message?: string;
}

export interface UIState {
    "mapCenter": MapCenter,
}
