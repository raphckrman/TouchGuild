/** @module CalendarComment */

//
// Created by Wade (@pakkographic)
// Copyright (c) 2024 DinographicPixels. All rights reserved.
//

import type { Client } from "./Client";
import { Base } from "./Base";

import type { Member } from "./Member";

import type {
    CreateCalendarCommentOptions,
    EditCalendarCommentOptions,
    JSONCalendarComment,
    ConstructorCalendarCommentOptions,
    RawCalendarComment
} from "../types";

/** CalendarEventComment represents an event comment coming from a calendar channel. */
export class CalendarComment extends Base<number> {
    /** The ID of the channel containing this comment. */
    channelID: string;
    /** The content of the comment. */
    content: string;
    /** The ISO 8601 timestamp that this comment was created at. */
    createdAt: Date;
    /** Raw data */
    data: RawCalendarComment;
    /** The ID of the event containing this comment. (parent) */
    eventID: number;
    /** This property isn't always provided by the Guilded API, the value can be null,
     * which disable the ability to get member through this class. */
    guildID: string | null;
    /** The ID of the member who sent this comment. */
    memberID: string;
    /** The ISO 8601 timestamp that this comment was updated at. */
    updatedAt: Date | null;
    /**
     * @param data raw data.
     * @param client client.
     * @param options Additional properties that can be added.
     */
    constructor(
        data: RawCalendarComment,
        client: Client,
        options?: ConstructorCalendarCommentOptions
    ) {
        super(data.id, client);
        this.data = data;
        this.guildID = options?.guildID ?? null;
        this.content = data.content;
        this.createdAt = new Date(data.createdAt);
        this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : null;
        this.eventID = Number(data.calendarEventId);
        this.channelID = data.channelId;
        this.memberID = data.createdBy;
        this.update(data);
    }

    protected override update(data: RawCalendarComment): void {
        if (data.calendarEventId !== undefined) {
            this.eventID = Number(data.calendarEventId);
        }
        if (data.channelId !== undefined) {
            this.channelID = data.channelId;
        }
        if (data.content !== undefined) {
            this.content = data.content;
        }
        if (data.createdAt !== undefined) {
            this.createdAt = new Date(this.createdAt);
        }
        if (data.createdBy !== undefined) {
            this.memberID = data.createdBy;
        }
        if (data.id !== undefined) {
            this.id = data.id;
        }
        if (data.updatedAt !== undefined) {
            this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : null;
        }
    }

    /** Retrieve the member who sent this comment, if cached.
     * If there is no cached member, this will make a rest request which returns a Promise.
     * If the request fails, it'll return undefined or throw an error that you can catch.
     */
    get member(): Member | Promise<Member> | undefined {
        if (this.guildID === null) throw new Error("Couldn't get member, API did not return guildID.");
        return this.client.getGuild(this.guildID as string)?.members.get(this.memberID)
        ?? this.guildID
            ? this.client.rest.guilds.getMember(this.guildID as string, this.memberID) : undefined;
    }

    /** Create a comment in the same event as this one.
     * @param options Create options.
     */
    async createCalendarComment(options: CreateCalendarCommentOptions): Promise<CalendarComment> {
        return this.client.rest.channels.createCalendarComment(
            this.channelID,
            this.eventID,
            options
        );
    }

    /** Add a reaction to this comment.
     * @param reaction ID of the reaction to add.
     */
    async createReaction(reaction: number): Promise<void> {
        return this.client.rest.channels.createReactionToSubcategory(
            this.channelID,
            "CalendarEventComment",
            this.eventID,
            this.id,
            reaction
        );
    }

    /** Delete this comment */
    async delete(): Promise<void>{
        return this.client.rest.channels.deleteCalendarComment(
            this.channelID,
            this.eventID,
            this.id
        );
    }

    /** Remove a reaction from this comment.
     * @param reaction ID of the reaction to remove.
     */
    async deleteReaction(reaction: number): Promise<void> {
        return this.client.rest.channels.deleteReactionFromSubcategory(
            this.channelID,
            "CalendarEventComment",
            this.eventID,
            this.id,
            reaction
        );
    }

    /** Edit this comment */
    async edit(options: EditCalendarCommentOptions): Promise<CalendarComment>{
        return this.client.rest.channels.editCalendarComment(
            this.channelID,
            this.eventID,
            this.id,
            options
        );
    }

    override toJSON(): JSONCalendarComment {
        return {
            ...super.toJSON(),
            data:      this.data,
            content:   this.content,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            eventID:   this.eventID,
            channelID: this.channelID,
            memberID:  this.memberID
        };
    }
}
