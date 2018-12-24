! function(e) {
    var t = {};
    function n(o) {
        if (t[o]) return t[o].exports;
        var r = t[o] = {
            i: o,
            l: !1,
            exports: {}
        };
        return e[o].call(r.exports, r, r.exports, n), r.l = !0, r.exports
    }
    n.m = e, n.c = t, n.d = function(e, t, o) {
        n.o(e, t) || Object.defineProperty(e, t, {
            enumerable: !0,
            get: o
        })
    }, n.r = function(e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(e, "__esModule", {
            value: !0
        })
    }, n.t = function(e, t) {
        if (1 & t && (e = n(e)), 8 & t) return e;
        if (4 & t && "object" == typeof e && e && e.__esModule) return e;
        var o = Object.create(null);
        if (n.r(o), Object.defineProperty(o, "default", {
                enumerable: !0,
                value: e
            }), 2 & t && "string" != typeof e)
            for (var r in e) n.d(o, r, function(t) {
                return e[t]
            }.bind(null, r));
        return o
    }, n.n = function(e) {
        var t = e && e.__esModule ? function() {
            return e.default
        } : function() {
            return e
        };
        return n.d(t, "a", t), t
    }, n.o = function(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }, n.p = "", n(n.s = 34)
}({
    34: function(e, t, n) {
        var o = n(35),
            r = n(36);
        window.localStorage.setting = function() {
            if (window.localStorage.setting) {
                var e = JSON.parse(window.localStorage.setting);
                return !!(e && e.setting && e.setting.hasOwnProperty("ghoulEnabled") && e.setting.hasOwnProperty("vol") && e.setting.hasOwnProperty("blockLiveStream") && e.setting.hasOwnProperty("delayRange") && e.setting.hasOwnProperty("autoClose") && e.setting.hasOwnProperty("autoDrive") && e.setting.hasOwnProperty("minimalism") && e.setting.hasOwnProperty("autoOpenBox") && e.setting.hasOwnProperty("blockEnterEffect")) && window.localStorage.setting
            }
            return !1
        }() || JSON.stringify({
            setting: {
                ghoulEnabled: !0,
                vol: 60,
                blockLiveStream: !1,
                delayRange: [50, 800],
                autoClose: !1,
                autoDrive: !1,
                minimalism: !1,
                autoOpenBox: !0,
                blockEnterEffect: !1
            }
        }), window.localStorage.stat = function() {
            if (window.localStorage.stat) {
                var e = JSON.parse(window.localStorage.stat);
                return !!(e && e.stat && e.stat.hasOwnProperty("box") && e.stat.hasOwnProperty("zan") && e.stat.hasOwnProperty("wen") && e.stat.hasOwnProperty("song") && e.stat.hasOwnProperty("silver") && e.stat.hasOwnProperty("day")) && window.localStorage.stat
            }
            return !1
        }() || JSON.stringify({
            stat: {
                box: 0,
                zan: 0,
                wen: 0,
                song: 0,
                silver: 0,
                day: null
            }
        });
        var a = new o;
        chrome.webRequest.onBeforeRequest.addListener(e => {
            var {
                setting: t
            } = JSON.parse(window.localStorage.setting);
            return {
                cancel: "https://www.douyu.com" === e.initiator && (e.url.endsWith(".m4s") || e.url.endsWith(".wsv?type=3") || -1 !== e.url.indexOf(".flv")) && t.ghoulEnabled && t.blockLiveStream
            }
        }, {
            urls: ["<all_urls>"]
        }, ["blocking"]), chrome.webRequest.onBeforeRequest.addListener(function() {
            return {
                cancel: !0
            }
        }, {
            urls: ["*://pubads.g.doubleclick.net/*", "*://staticlive.douyucdn.cn/common/simplayer/assets/gameAdversion.swf?*", "*://staticlive.douyucdn.cn/common/simplayer/assets/videoAd.swf?*"]
        }, ["blocking"]), chrome.runtime.onConnect.addListener(e => {
            var {
                setting: t
            } = window.localStorage;
            "treasure" === e.name ? (t && e.postMessage({
                type: "setting",
                data: JSON.parse(t).setting
            }), e.onMessage.addListener(t => {
                var {
                    type: n,
                    data: o
                } = t;
                if ("got" === n) {
                    var {
                        setting: a
                    } = JSON.parse(window.localStorage.setting) || {};
                    r.playAudio(chrome.extension.getURL("assets/ding.wav"), a.vol / 100)
                } else if ("got_res" === n) {
                    var {
                        stat: s
                    } = JSON.parse(window.localStorage.stat) || {};
                    ++s.box;
                    var {
                        award_type: i,
                        silver: l,
                        prop_count: u,
                        prop_id: c,
                        prop_name: d
                    } = o;
                    "1" === i ? s.silver += parseInt(l, 10) : "2" === i ? "赞" === d ? s.zan += parseInt(u, 10) : "稳" === d ? s.wen += parseInt(u, 10) : "怂" === d ? s.song += parseInt(u, 10) : console.log("unknown prop_name:", o) : console.log("unknown award_type:", o), window.localStorage.stat = JSON.stringify({
                        stat: s
                    }), e.postMessage({
                        type: "sync"
                    })
                }
            })) : "xiaohulu" === e.name && JSON.parse(t).setting.autoDrive && (e.postMessage({
                type: "enable"
            }), e.onMessage.addListener(e => {
                var {
                    type: t,
                    data: n
                } = e, {
                    setting: o
                } = JSON.parse(window.localStorage.setting) || {};
                "update_rooms" === t && o.autoDrive && a.update(n)
            }))
        })
    },
    35: function(e, t) {
        async function n(e) {
            return new Promise(t => setTimeout(() => t(), e))
        }
        e.exports = class {
            constructor() {
                this.state = "IDLE"
            }
            update(e) {
                var {
                    state: t
                } = this;
                "IDLE" === t && (this.state = "DRIVING", this.drive(e))
            }
            async drive(e) {
                for (var t = new Set, o = new Set; e.length > 0;) {
                    var r = e.shift();
                    if (!t.has(r.url)) {
                        for (console.log(o.size); o.size >= 1;) console.log(">=1"), await n(1e3);
                        o.add(r.url), chrome.tabs.create({
                            url: r.url,
                            selected: !1
                        }), await n(333)
                    }
                }
                this.state = "DRIVING"
            }
        }
    },
    36: function(e, t) {
        e.exports = {
            playAudio: function(e, t) {
                if (t > 0) {
                    var n = new Audio;
                    n.src = e, n.volume = t, n.play()
                }
            }
        }
    }
});