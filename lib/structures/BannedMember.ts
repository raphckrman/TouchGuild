/** @module BannedMember */

//
// Created by Wade (@pakkographic)
// Copyright (c) 2024 DinographicPixels. All rights reserved.
//

import type { Client } from "./Client";
import { User } from "./User";
import type { Guild } from "./Guild";
import { Base } from "./Base";
import type { Member } from "./Member";
import type { JSONBannedMember, RawMemberBan, RawUser } from "../types";

/** BannedMember represents a banned guild member. */
export class BannedMember extends Base<string> {
    /** Information about the banned member (object) */
    ban: {
        /** ID of the member who banned this member. */
        bannedBy: string;
        /** When the member has been banned. */
        createdAt: Date | null;
        /** Reason of the ban */
        reason?: string;
    };
    /** Server ID. */
    guildID: string;
    /** Banned member, if cached. */
    member: Member | null;
    /** Banned user. */
    user: User;
    /**
     * @param guildID ID of the guild.
     * @param data raw data.
     * @param client client.
     */
    constructor(guildID: string, data: RawMemberBan, client: Client){
        super(data.user.id, client);
        this.guildID = guildID;
        this.ban = {
            reason:    data.reason,
            createdAt: data.createdAt ? new Date(data.createdAt) : null,
            bannedBy:  data.createdBy
        };
        this.user = client.users.update(data.user as Partial<RawUser>) ?? new User(data.user as RawUser, client);
        this.member = client.getGuild(guildID)?.members.get(data.user.id) ?? null;
        this.update(data);
    }

    protected override update(data: RawMemberBan): void {
        if (data.createdAt !== undefined) {
            this.ban.createdAt = new Date(data.createdAt);
        }
        if (data.createdBy !== undefined) {
            this.ban.bannedBy = data.createdBy;
        }
        if (data.reason !== undefined) {
            this.ban.reason = data.reason;
        }
        if (data.user !== undefined && this.client.users.update(data.user as Partial<RawUser>)) {
            this.user = this.client.users.update(data.user as Partial<RawUser>);
        }
    }

    /** Getter used to get the message's guild
     *
     * Note: this can return a promise, make sure to await it before.
     */
    get guild(): Guild | Promise<Guild> {
        return this.client.guilds.get(this.guildID) ?? this.client.rest.guilds.get(this.guildID);
    }

    override toJSON(): JSONBannedMember {
        return {
            ...super.toJSON(),
            guildID: this.guildID,
            ban:     this.ban
        };
    }
}
