/** @module Group */

//
// Created by Wade (@pakkographic)
// Copyright (c) 2024 DinographicPixels. All rights reserved.
//

import type { Client } from "./Client";
import { Base } from "./Base";
import type { JSONGroup, RawGroup } from "../types";

/** Represents a Guild Group. */
export class Group extends Base<string> {
    /** Date of when the group was archived, if archived. */
    archivedAt: Date | null;
    /** The ID of the user who archived this group, if archived. */
    archivedBy: string | null;
    /** The avatar image associated with the group */
    avatarURL: string | null;
    /** The ISO 8601 timestamp that the group was created at */
    createdAt: Date;
    /** The ID of the user who created this group */
    createdBy: string;
    /** The group description. */
    description: string | null;
    /** The date when the group was updated, if edited. */
    editedTimestamp: Date | null;
    /** The emote to associate with the group */
    emoteID: number | null;
    /** ID of the guild */
    guildID: string;
    /** If true, this is the server's home group */
    isHome: boolean;
    /** Is this group open for anyone to join? */
    isPublic: boolean;
    /** The group's name (min length 1; max length 80)  */
    name: string;
    /** The ID of the user who updated this group, if edited. */
    updatedBy: string | null;
    constructor(data: RawGroup, client: Client) {
        super(data.id, client);
        this.guildID = data.serverId;
        this.name = data.name;
        this.description = data.description ?? null;
        this.avatarURL = data.avatar ?? null;
        this.isHome = data.isHome ?? false;
        this.emoteID = data.emoteId ?? null;
        this.isPublic = data.isPublic ?? false;
        this.createdAt = new Date(data.createdAt);
        this.createdBy = data.createdBy;
        this.editedTimestamp = data.updatedAt ? new Date(data.updatedAt) : null;
        this.updatedBy = data.updatedBy ?? null;
        this.archivedAt = data.archivedAt ? new Date(data.archivedAt) : null;
        this.archivedBy = data.archivedBy ?? null;
        this.update(data);
    }

    protected override update(data: RawGroup): void {
        if (data.serverId !== undefined) {
            this.guildID = data.serverId;
        }
        if (data.name !== undefined) {
            this.name = data.name;
        }
        if (data.description !== undefined) {
            this.description = data.description;
        }
        if (data.avatar !== undefined) {
            this.avatarURL = data.avatar;
        }
        if (data.isHome !== undefined) {
            this.isHome = data.isHome;
        }
        if (data.emoteId !== undefined) {
            this.emoteID = data.emoteId;
        }
        if (data.isPublic !== undefined) {
            this.isPublic = data.isPublic;
        }
        if (data.createdAt !== undefined) {
            this.createdAt = new Date(data.createdAt);
        }
        if (data.createdBy !== undefined) {
            this.createdBy = data.createdBy;
        }
        if (data.updatedAt !== undefined) {
            this.editedTimestamp = new Date(data.updatedAt);
        }
        if (data.updatedBy !== undefined) {
            this.updatedBy = data.updatedBy;
        }
        if (data.archivedAt !== undefined) {
            this.archivedAt = new Date(data.archivedAt);
        }
        if (data.archivedBy !== undefined) {
            this.archivedBy = data.archivedBy;
        }
    }

    override toJSON(): JSONGroup {
        return {
            ...super.toJSON(),
            guildID:         this.guildID,
            name:            this.name,
            description:     this.description,
            avatarURL:       this.avatarURL,
            isHome:          this.isHome,
            emoteID:         this.emoteID,
            isPublic:        this.isPublic,
            createdAt:       this.createdAt,
            createdBy:       this.createdBy,
            editedTimestamp: this.editedTimestamp,
            updatedBy:       this.updatedBy,
            archivedAt:      this.archivedAt,
            archivedBy:      this.archivedBy
        };
    }
}
