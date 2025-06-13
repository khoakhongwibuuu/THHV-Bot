class ticketInstance {
    constructor(ownerId, channelId) {
        this.owner = ownerId; // Identify tickets
        this.staffs = [];
        this.guests = [];
        this.channel = channelId;
        this._isDestroyed = false;
    }
    claim(userId) {
        if (this._isDestroyed) return 0;
        this.staffs.push(userId);
        return 1;
    }
    addGuest(userId) {
        if (this._isDestroyed) return 0;
        this.guests.push(userId);
        return 1;
    }
    terminate() {
        for (let key in this)
            if (this.hasOwnProperty(key))
                this[key] = null;
        this._isDestroyed = true;
    }
}

module.exports = ticketInstance;