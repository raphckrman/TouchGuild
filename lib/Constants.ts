
//
// Created by Wade (@pakkographic)
// Copyright (c) 2024 DinographicPixels. All rights reserved.
//

export const RESTMethods = [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE"
] as const;
export type RESTMethod = typeof RESTMethods[number];

export type RawUserTypes = "bot" | "user";
export type UserTypes = "app" | "user";

export * from "guildedapi-types.ts/v1"; // marks api typings as non-external (for docs).

export type ChannelReactionTypes = "ChannelMessage" | "ForumThread" | "CalendarEvent" | "Doc" | "ChannelAnnouncement";
export type ChannelSubcategoryReactionTypes = "CalendarEventComment" | "ForumThreadComment" | "DocComment" | "AnnouncementComment";

/** Channel reaction types that supports bulk delete.  */
export type ChannelReactionTypeBulkDeleteSupported = "ChannelMessage";

export enum ApplicationCommandOptionType {
    STRING,
    INTEGER,
    FLOAT,
    NUMBER,
    SIGNED_32_INTEGER,
    USER,
    ROLE,
    CHANNEL,
    EMBEDDED_ATTACHMENT
}

export enum ApplicationCommandType {
    CHAT_INPUT = 1
}
