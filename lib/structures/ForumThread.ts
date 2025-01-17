/** @module ForumThread */

//
// Created by Wade (@pakkographic)
// Copyright (c) 2024 DinographicPixels. All rights reserved.
//

import type { Client } from "./Client";
import type { Guild } from "./Guild";
import type { Member } from "./Member";
import { Base } from "./Base";
import type { User } from "./User";
import { ForumThreadComment } from "./ForumThreadComment";
import type { ForumChannel } from "./ForumChannel";
import type {
    EditForumThreadOptions,
    JSONForumThread,
    AnyTextableChannel,
    CreateForumCommentOptions,
    RawMentions,
    RawForumThreadComment,
    RawForumThread
} from "../types";
import TypedCollection from "../util/TypedCollection";


/** Represents a thread/topic coming from a "Forums" channel. */
export class ForumThread<T extends ForumChannel> extends Base<number> {
    private _cachedChannel!: T extends AnyTextableChannel ? T : undefined;
    private _cachedGuild?: T extends Guild ? Guild : Guild | null;
    /** Timestamp (unix epoch time) that the forum thread was bumped at. */
    bumpedAt: Date | null;
    /** Forum channel id */
    channelID: string;
    /** Cached comments. */
    comments: TypedCollection<number, RawForumThreadComment, ForumThreadComment>;
    /** Content of the thread */
    content: string;
    /** When this forum thread was created. */
    createdAt: Date;
    /** Timestamp at which this channel was last edited. */
    editedTimestamp: Date | null;
    /** Guild ID */
    guildID: string;
    /** If true, the thread is locked. */
    isLocked: boolean;
    /** If true, the thread is pinned. */
    isPinned: boolean;
    /** Thread mentions */
    mentions: RawMentions | null;
    /** Name of the thread */
    name: string;
    /** Owner of this thread, if cached. */
    owner: T extends Guild ? Member : Member | User | Promise<Member> | undefined;
    /** The ID of the owner of this thread. */
    ownerID: string;
    /**
     * @param data raw data
     * @param client client
     */
    constructor(data: RawForumThread, client: Client){
        super(data.id, client);
        this.guildID = data.serverId;
        this.channelID = data.channelId;
        this.name = data.title;
        this.createdAt = new Date(data.createdAt);
        this.ownerID = data.createdBy;
        this.owner =  (this.client.getMember(data.serverId, data.createdBy)
          ?? this.client.users.get(data.createdBy)
          ?? this.client.rest.guilds.getMember(
              data.serverId,
              data.createdBy
          )) as T extends Guild ? Member : Member | User | Promise<Member> | undefined;
        this.editedTimestamp = data.updatedAt ? new Date(data.updatedAt) : null;
        this.bumpedAt = data.bumpedAt ? new Date(data.bumpedAt) : null;
        this.content = data.content;
        this.mentions = data.mentions ?? null;
        this.comments = new TypedCollection(
            ForumThreadComment,
            client,
            client.params.collectionLimits?.threadComments
        );
        this.isLocked = data.isLocked ?? false;
        this.isPinned = data.isPinned ?? false;
        this.update(data);
    }

    protected override update(data: RawForumThread): void {
        if (data.bumpedAt !== undefined) {
            this.bumpedAt = new Date(data.bumpedAt);
        }
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
            this.ownerID = data.createdBy;
        }
        if (data.id !== undefined) {
            this.id = data.id;
        }
        if (data.isLocked !== undefined) {
            this.isLocked = data.isLocked;
        }
        if (data.mentions !== undefined) {
            this.mentions = data.mentions ?? null;
        }
        if (data.serverId !== undefined) {
            this.guildID = data.serverId;
        }
        if (data.title !== undefined) {
            this.name = data.title;
        }
        if (data.updatedAt !== undefined) {
            this.editedTimestamp = new Date(data.updatedAt);
        }
    }

    /** The forum channel this thread was created in.  */
    get channel(): T extends AnyTextableChannel ? T : undefined {
        return this._cachedChannel
          ?? (this._cachedChannel = this.client.getChannel(
              this.guildID,
              this.channelID
          ) as T extends AnyTextableChannel ? T : undefined);
    }

    /** The guild the thread is in. This will throw an error if the guild isn't cached.*/
    get guild(): T extends Guild ? Guild : Guild | null {
        if (!this._cachedGuild) {
            this._cachedGuild = this.client.getGuild(this.guildID);
            if (!this._cachedGuild) {
                throw new Error(`${this.constructor.name}#guild: couldn't find the Guild in cache.`);
            }
        }
        return this._cachedGuild as T extends Guild ? Guild : Guild | null;
    }

    /** Add a comment to this forum thread.
     * @param options Options of the comment.
     */
    async createForumComment(options: CreateForumCommentOptions): Promise<ForumThreadComment>{
        return this.client.rest.channels.createForumComment(
            this.channelID,
            this.id as number,
            options
        );
    }

    /** Add a reaction to this forum thread.
     * @param emoteID ID of the emote to be added.
     */
    async createReaction(emoteID: number): Promise<void> {
        return this.client.rest.channels.createReaction(
            this.channelID,
            "ForumThread",
            this.id as number,
            emoteID
        );
    }

    /** Delete this forum thread. */
    async delete(): Promise<void> {
        return this.client.rest.channels.deleteForumThread(
            this.channelID,
            this.id as number
        );
    }

    /** Remove a reaction from this forum thread.
     * @param emoteID ID of the emote to be added.
     */
    async deleteReaction(emoteID: number): Promise<void> {
        return this.client.rest.channels.deleteReaction(
            this.channelID,
            "ForumThread",
            this.id as number,
            emoteID
        );
    }

    /** Edit the forum thread.
     * @param options Edit options.
     */
    async edit(options: EditForumThreadOptions): Promise<ForumThread<T>> {
        return this.client.rest.channels.editForumThread<T>(
            this.channelID,
            this.id as number,
            options
        );
    }

    /** Lock this forum thread. */
    async lock(): Promise<void> {
        return this.client.rest.channels.lockForumThread(this.channelID, this.id as number);
    }

    /** Pin this forum thread. */
    async pin(): Promise<void> {
        return this.client.rest.channels.pinForumThread(this.channelID, this.id as number);
    }

    override toJSON(): JSONForumThread<T> {
        return {
            ...super.toJSON(),
            guildID:         this.guildID,
            channelID:       this.channelID,
            name:            this.name,
            createdAt:       this.createdAt,
            owner:           this.owner,
            ownerID:         this.ownerID,
            editedTimestamp: this.editedTimestamp,
            bumpedAt:        this.bumpedAt,
            content:         this.content,
            mentions:        this.mentions,
            comments:        this.comments.map(comment => comment.toJSON()),
            isLocked:        this.isLocked,
            isPinned:        this.isPinned
        };
    }

    /** Unlock this forum thread. */
    async unlock(): Promise<void> {
        return this.client.rest.channels.unlockForumThread(this.channelID, this.id as number);
    }

    /** Unpin this forum thread. */
    async unpin(): Promise<void> {
        return this.client.rest.channels.unpinForumThread(this.channelID, this.id as number);
    }
}
