class WebSocketWrapper {
    _blocked: Boolean = false
    _sockets: Array<WebSocket> = []
    constructor(ref = WebSocket) {
        const _self = this;
        const wrapped = function() {
            if (_self.isBlocked()) {
            } else {
                const sock = new ref(...arguments)
                _self._sockets.push(sock)
                return sock
            }
        }
        wrapped.prototype = ref.prototype
        WebSocket = wrapped
    }
    isBlocked(): Boolean {
        return this._blocked
    }
    closeAll(): void {
       this. _sockets.forEach(s => {
            s.close()
        })
        this._sockets = []
    }
    setBlockMode(block: Boolean): void {
        this._blocked = block
    }
}

window['WebSocketWrapper'] = new WebSocketWrapper(WebSocket)
