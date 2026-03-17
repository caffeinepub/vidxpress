import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Video {
    id: string;
    title: string;
    description: string;
    fileId: string;
    timestamp: Time;
    uploader: Principal;
}
export type Time = bigint;
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addVideo(id: string, title: string, description: string, fileId: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteVideo(id: string): Promise<void>;
    getAllVideos(): Promise<Array<Video>>;
    getCallerUserRole(): Promise<UserRole>;
    getVideoById(id: string): Promise<Video | null>;
    isCallerAdmin(): Promise<boolean>;
}
