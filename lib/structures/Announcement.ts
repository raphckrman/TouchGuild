/** @module Announcement */

//
// Created by Wade (@pakkographic)
// Copyright (c) 2024 DinographicPixels. All rights reserved.
//

import type { Client } from "./Client";
import { Base } from "./Base";
import { AnnouncementComment } from "./AnnouncementComment";
import type { PATCHChannelAnnouncementBody, POSTChannelAnnouncementBody } from "../Constants";
import type { JSONAnnouncement, RawAnnouncement, RawAnnouncementComment, RawMentions } from "../types";
import TypedCollection from "../util/TypedCollection";

/** Represents a channel announcement. */
export class Announcement extends Base<string> {
    /** ID of the channel the announcement is in */
    channelID: string;
    /** Cached announcement's comments */
    comments: TypedCollection<number, RawAnnouncementComment, AnnouncementComment>;
    /** The announcement's content */
    content: string;
    /** The ISO 8601 timestamp that the announcement was created at */
    createdAt: Date;
    /** ID of the guild. */
    guildID: string;
    /** The ID of the member who created this announcement */
    memberID: string;
    /** Mentions. */
    mentions: RawMentions | null;
    /** The announcement's title. */
    title: string;
    /**
     * @param data raw data.
     * @param client client.
     */
    constructor(data: RawAnnouncement, client: Client) {
        super(data.id, client);
        this.guildID = data.serverId;
        this.channelID = data.channelId;
        this.createdAt = new Date(data.createdAt);
        this.memberID = data.createdBy;
        this.content = data.content;
        this.mentions = data.mentions ?? null;
        this.title = data.title;
        this.comments = new TypedCollection(
            AnnouncementComment,
            client,
            client.params.collectionLimits?.announcementComments
        );
        this.update(data);
    }

    protected override update(data: RawAnnouncement): void {
        if (data.channelId !== undefined) {
            this.channelID = data.channelId;
        }
        if (data.content !== undefined) {
            this.content = data.content;
        }
        if (data.createdAt !== undefined) {
            this.createdAt = new Date(data.createdAt);
        }
        if (data.createdBy !== undefined) {
            this.memberID = data.createdBy;
        }
        if (data.id !== undefined) {
            this.id = data.id;
        }
        if (data.mentions !== undefined) {
            this.mentions = data.mentions;
        }
        if (data.serverId !== undefined) {
            this.guildID = data.serverId;
        }
        if (data.title !== undefined) {
            this.title = data.title;
        }
    }

    /**
     * Create an announcement in the same Announcement channel as this one.
     * @param options Create options.
     */
    async createAnnouncement(options: POSTChannelAnnouncementBody): Promise<Announcement> {
        return this.client.rest.channels.createAnnouncement(this.channelID, options);
    }

    /**
     * Add a reaction to this announcement.
     * @param emoteID ID of the emote to add
     */
    async createReaction(emoteID: number): Promise<void> {
        return this.client.rest.channels.createReaction(
            this.channelID,
            "ChannelAnnouncement",
            this.id,
            emoteID
        );
    }

    /**
     * Delete this announcement.
     */
    async delete(): Promise<void> {
        return this.client.rest.channels.deleteAnnouncement(this.channelID, this.id);
    }

    /**
     * Remove a reaction from this announcement.
     * @param emoteID ID of the emote to remove
     */
    async deleteReaction(emoteID: number): Promise<void> {
        return this.client.rest.channels.deleteReaction(
            this.channelID,
            "ChannelAnnouncement",
            this.id,
            emoteID
        );
    }

    /**
     * Edit this announcement.
     * @param options Edit options
     */
    async edit(options: PATCHChannelAnnouncementBody): Promise<Announcement> {
        return this.client.rest.channels.editAnnouncement(
            this.channelID,
            this.id,
            options
        );
    }

    override toJSON(): JSONAnnouncement {
        return {
            ...super.toJSON(),
            guildID:   this.guildID,
            channelID: this.channelID,
            createdAt: this.createdAt,
            memberID:  this.memberID,
            content:   this.content,
            mentions:  this.mentions,
            title:     this.title
        };
    }
}
