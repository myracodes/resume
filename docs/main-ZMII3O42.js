var RC = Object.defineProperty,
    kC = Object.defineProperties;
var LC = Object.getOwnPropertyDescriptors;
var Vs = Object.getOwnPropertySymbols;
var Sh = Object.prototype.hasOwnProperty,
    wh = Object.prototype.propertyIsEnumerable;
var Eh = (e, n, t) =>
        n in e
            ? RC(e, n, {
                  enumerable: !0,
                  configurable: !0,
                  writable: !0,
                  value: t,
              })
            : (e[n] = t),
    E = (e, n) => {
        for (var t in (n ||= {})) Sh.call(n, t) && Eh(e, t, n[t]);
        if (Vs) for (var t of Vs(n)) wh.call(n, t) && Eh(e, t, n[t]);
        return e;
    },
    oe = (e, n) => kC(e, LC(n));
var Dh = (e, n) => {
    var t = {};
    for (var r in e) Sh.call(e, r) && n.indexOf(r) < 0 && (t[r] = e[r]);
    if (e != null && Vs)
        for (var r of Vs(e)) n.indexOf(r) < 0 && wh.call(e, r) && (t[r] = e[r]);
    return t;
};
function xc(e, n) {
    return Object.is(e, n);
}
var Oe = null,
    js = !1,
    Oc = 1,
    Tt = Symbol("SIGNAL");
function Y(e) {
    let n = Oe;
    return ((Oe = e), n);
}
function Pc() {
    return Oe;
}
var Xr = {
    version: 0,
    lastCleanEpoch: 0,
    dirty: !1,
    producerNode: void 0,
    producerLastReadVersion: void 0,
    producerIndexOfThis: void 0,
    nextProducerIndex: 0,
    liveConsumerNode: void 0,
    liveConsumerIndexOfThis: void 0,
    consumerAllowSignalWrites: !1,
    consumerIsAlwaysLive: !1,
    kind: "unknown",
    producerMustRecompute: () => !1,
    producerRecomputeValue: () => {},
    consumerMarkedDirty: () => {},
    consumerOnSignalRead: () => {},
};
function ho(e) {
    if (js) throw new Error("");
    if (Oe === null) return;
    Oe.consumerOnSignalRead(e);
    let n = Oe.nextProducerIndex++;
    if (
        (Ws(Oe),
        n < Oe.producerNode.length && Oe.producerNode[n] !== e && po(Oe))
    ) {
        let t = Oe.producerNode[n];
        zs(t, Oe.producerIndexOfThis[n]);
    }
    (Oe.producerNode[n] !== e &&
        ((Oe.producerNode[n] = e),
        (Oe.producerIndexOfThis[n] = po(Oe) ? Ih(e, Oe, n) : 0)),
        (Oe.producerLastReadVersion[n] = e.version));
}
function Mh() {
    Oc++;
}
function Nc(e) {
    if (!(po(e) && !e.dirty) && !(!e.dirty && e.lastCleanEpoch === Oc)) {
        if (!e.producerMustRecompute(e) && !Hs(e)) {
            Tc(e);
            return;
        }
        (e.producerRecomputeValue(e), Tc(e));
    }
}
function Ac(e) {
    if (e.liveConsumerNode === void 0) return;
    let n = js;
    js = !0;
    try {
        for (let t of e.liveConsumerNode) t.dirty || FC(t);
    } finally {
        js = n;
    }
}
function Rc() {
    return Oe?.consumerAllowSignalWrites !== !1;
}
function FC(e) {
    ((e.dirty = !0), Ac(e), e.consumerMarkedDirty?.(e));
}
function Tc(e) {
    ((e.dirty = !1), (e.lastCleanEpoch = Oc));
}
function go(e) {
    return (e && (e.nextProducerIndex = 0), Y(e));
}
function Us(e, n) {
    if (
        (Y(n),
        !(
            !e ||
            e.producerNode === void 0 ||
            e.producerIndexOfThis === void 0 ||
            e.producerLastReadVersion === void 0
        ))
    ) {
        if (po(e))
            for (let t = e.nextProducerIndex; t < e.producerNode.length; t++)
                zs(e.producerNode[t], e.producerIndexOfThis[t]);
        for (; e.producerNode.length > e.nextProducerIndex; )
            (e.producerNode.pop(),
                e.producerLastReadVersion.pop(),
                e.producerIndexOfThis.pop());
    }
}
function Hs(e) {
    Ws(e);
    for (let n = 0; n < e.producerNode.length; n++) {
        let t = e.producerNode[n],
            r = e.producerLastReadVersion[n];
        if (r !== t.version || (Nc(t), r !== t.version)) return !0;
    }
    return !1;
}
function mo(e) {
    if ((Ws(e), po(e)))
        for (let n = 0; n < e.producerNode.length; n++)
            zs(e.producerNode[n], e.producerIndexOfThis[n]);
    ((e.producerNode.length =
        e.producerLastReadVersion.length =
        e.producerIndexOfThis.length =
            0),
        e.liveConsumerNode &&
            (e.liveConsumerNode.length = e.liveConsumerIndexOfThis.length = 0));
}
function Ih(e, n, t) {
    if ((Th(e), e.liveConsumerNode.length === 0 && xh(e)))
        for (let r = 0; r < e.producerNode.length; r++)
            e.producerIndexOfThis[r] = Ih(e.producerNode[r], e, r);
    return (e.liveConsumerIndexOfThis.push(t), e.liveConsumerNode.push(n) - 1);
}
function zs(e, n) {
    if ((Th(e), e.liveConsumerNode.length === 1 && xh(e)))
        for (let r = 0; r < e.producerNode.length; r++)
            zs(e.producerNode[r], e.producerIndexOfThis[r]);
    let t = e.liveConsumerNode.length - 1;
    if (
        ((e.liveConsumerNode[n] = e.liveConsumerNode[t]),
        (e.liveConsumerIndexOfThis[n] = e.liveConsumerIndexOfThis[t]),
        e.liveConsumerNode.length--,
        e.liveConsumerIndexOfThis.length--,
        n < e.liveConsumerNode.length)
    ) {
        let r = e.liveConsumerIndexOfThis[n],
            i = e.liveConsumerNode[n];
        (Ws(i), (i.producerIndexOfThis[r] = n));
    }
}
function po(e) {
    return e.consumerIsAlwaysLive || (e?.liveConsumerNode?.length ?? 0) > 0;
}
function Ws(e) {
    ((e.producerNode ??= []),
        (e.producerIndexOfThis ??= []),
        (e.producerLastReadVersion ??= []));
}
function Th(e) {
    ((e.liveConsumerNode ??= []), (e.liveConsumerIndexOfThis ??= []));
}
function xh(e) {
    return e.producerNode !== void 0;
}
function kc(e, n) {
    let t = Object.create($C);
    ((t.computation = e), n !== void 0 && (t.equal = n));
    let r = () => {
        if ((Nc(t), ho(t), t.value === Bs)) throw t.error;
        return t.value;
    };
    return ((r[Tt] = t), r);
}
var Mc = Symbol("UNSET"),
    Ic = Symbol("COMPUTING"),
    Bs = Symbol("ERRORED"),
    $C = oe(E({}, Xr), {
        value: Mc,
        dirty: !0,
        error: null,
        equal: xc,
        kind: "computed",
        producerMustRecompute(e) {
            return e.value === Mc || e.value === Ic;
        },
        producerRecomputeValue(e) {
            if (e.value === Ic)
                throw new Error("Detected cycle in computations.");
            let n = e.value;
            e.value = Ic;
            let t = go(e),
                r,
                i = !1;
            try {
                ((r = e.computation()),
                    Y(null),
                    (i = n !== Mc && n !== Bs && r !== Bs && e.equal(n, r)));
            } catch (o) {
                ((r = Bs), (e.error = o));
            } finally {
                Us(e, t);
            }
            if (i) {
                e.value = n;
                return;
            }
            ((e.value = r), e.version++);
        },
    });
function VC() {
    throw new Error();
}
var Oh = VC;
function Ph(e) {
    Oh(e);
}
function Lc(e) {
    Oh = e;
}
var jC = null;
function Fc(e, n) {
    let t = Object.create(qs);
    ((t.value = e), n !== void 0 && (t.equal = n));
    let r = () => (ho(t), t.value);
    return ((r[Tt] = t), r);
}
function _o(e, n) {
    (Rc() || Ph(e), e.equal(e.value, n) || ((e.value = n), BC(e)));
}
function $c(e, n) {
    (Rc() || Ph(e), _o(e, n(e.value)));
}
var qs = oe(E({}, Xr), { equal: xc, value: void 0, kind: "signal" });
function BC(e) {
    (e.version++, Mh(), Ac(e), jC?.());
}
function Vc(e) {
    let n = Y(null);
    try {
        return e();
    } finally {
        Y(n);
    }
}
var jc;
function yo() {
    return jc;
}
function Mn(e) {
    let n = jc;
    return ((jc = e), n);
}
var Gs = Symbol("NotFound");
function $(e) {
    return typeof e == "function";
}
function Jr(e) {
    let t = e((r) => {
        (Error.call(r), (r.stack = new Error().stack));
    });
    return (
        (t.prototype = Object.create(Error.prototype)),
        (t.prototype.constructor = t),
        t
    );
}
var Ys = Jr(
    (e) =>
        function (t) {
            (e(this),
                (this.message = t
                    ? `${t.length} errors occurred during unsubscription:
${t.map((r, i) => `${i + 1}) ${r.toString()}`).join(`
  `)}`
                    : ""),
                (this.name = "UnsubscriptionError"),
                (this.errors = t));
        }
);
function vo(e, n) {
    if (e) {
        let t = e.indexOf(n);
        0 <= t && e.splice(t, 1);
    }
}
var Ie = class e {
    constructor(n) {
        ((this.initialTeardown = n),
            (this.closed = !1),
            (this._parentage = null),
            (this._finalizers = null));
    }
    unsubscribe() {
        let n;
        if (!this.closed) {
            this.closed = !0;
            let { _parentage: t } = this;
            if (t)
                if (((this._parentage = null), Array.isArray(t)))
                    for (let o of t) o.remove(this);
                else t.remove(this);
            let { initialTeardown: r } = this;
            if ($(r))
                try {
                    r();
                } catch (o) {
                    n = o instanceof Ys ? o.errors : [o];
                }
            let { _finalizers: i } = this;
            if (i) {
                this._finalizers = null;
                for (let o of i)
                    try {
                        Nh(o);
                    } catch (s) {
                        ((n = n ?? []),
                            s instanceof Ys
                                ? (n = [...n, ...s.errors])
                                : n.push(s));
                    }
            }
            if (n) throw new Ys(n);
        }
    }
    add(n) {
        var t;
        if (n && n !== this)
            if (this.closed) Nh(n);
            else {
                if (n instanceof e) {
                    if (n.closed || n._hasParent(this)) return;
                    n._addParent(this);
                }
                (this._finalizers =
                    (t = this._finalizers) !== null && t !== void 0
                        ? t
                        : []).push(n);
            }
    }
    _hasParent(n) {
        let { _parentage: t } = this;
        return t === n || (Array.isArray(t) && t.includes(n));
    }
    _addParent(n) {
        let { _parentage: t } = this;
        this._parentage = Array.isArray(t) ? (t.push(n), t) : t ? [t, n] : n;
    }
    _removeParent(n) {
        let { _parentage: t } = this;
        t === n ? (this._parentage = null) : Array.isArray(t) && vo(t, n);
    }
    remove(n) {
        let { _finalizers: t } = this;
        (t && vo(t, n), n instanceof e && n._removeParent(this));
    }
};
Ie.EMPTY = (() => {
    let e = new Ie();
    return ((e.closed = !0), e);
})();
var Bc = Ie.EMPTY;
function Ks(e) {
    return (
        e instanceof Ie ||
        (e && "closed" in e && $(e.remove) && $(e.add) && $(e.unsubscribe))
    );
}
function Nh(e) {
    $(e) ? e() : e.unsubscribe();
}
var zt = {
    onUnhandledError: null,
    onStoppedNotification: null,
    Promise: void 0,
    useDeprecatedSynchronousErrorHandling: !1,
    useDeprecatedNextContext: !1,
};
var ei = {
    setTimeout(e, n, ...t) {
        let { delegate: r } = ei;
        return r?.setTimeout
            ? r.setTimeout(e, n, ...t)
            : setTimeout(e, n, ...t);
    },
    clearTimeout(e) {
        let { delegate: n } = ei;
        return (n?.clearTimeout || clearTimeout)(e);
    },
    delegate: void 0,
};
function Qs(e) {
    ei.setTimeout(() => {
        let { onUnhandledError: n } = zt;
        if (n) n(e);
        else throw e;
    });
}
function bo() {}
var Ah = Uc("C", void 0, void 0);
function Rh(e) {
    return Uc("E", void 0, e);
}
function kh(e) {
    return Uc("N", e, void 0);
}
function Uc(e, n, t) {
    return { kind: e, value: n, error: t };
}
var hr = null;
function ti(e) {
    if (zt.useDeprecatedSynchronousErrorHandling) {
        let n = !hr;
        if ((n && (hr = { errorThrown: !1, error: null }), e(), n)) {
            let { errorThrown: t, error: r } = hr;
            if (((hr = null), t)) throw r;
        }
    } else e();
}
function Lh(e) {
    zt.useDeprecatedSynchronousErrorHandling &&
        hr &&
        ((hr.errorThrown = !0), (hr.error = e));
}
var gr = class extends Ie {
        constructor(n) {
            (super(),
                (this.isStopped = !1),
                n
                    ? ((this.destination = n), Ks(n) && n.add(this))
                    : (this.destination = GC));
        }
        static create(n, t, r) {
            return new ni(n, t, r);
        }
        next(n) {
            this.isStopped ? zc(kh(n), this) : this._next(n);
        }
        error(n) {
            this.isStopped
                ? zc(Rh(n), this)
                : ((this.isStopped = !0), this._error(n));
        }
        complete() {
            this.isStopped
                ? zc(Ah, this)
                : ((this.isStopped = !0), this._complete());
        }
        unsubscribe() {
            this.closed ||
                ((this.isStopped = !0),
                super.unsubscribe(),
                (this.destination = null));
        }
        _next(n) {
            this.destination.next(n);
        }
        _error(n) {
            try {
                this.destination.error(n);
            } finally {
                this.unsubscribe();
            }
        }
        _complete() {
            try {
                this.destination.complete();
            } finally {
                this.unsubscribe();
            }
        }
    },
    WC = Function.prototype.bind;
function Hc(e, n) {
    return WC.call(e, n);
}
var Wc = class {
        constructor(n) {
            this.partialObserver = n;
        }
        next(n) {
            let { partialObserver: t } = this;
            if (t.next)
                try {
                    t.next(n);
                } catch (r) {
                    Zs(r);
                }
        }
        error(n) {
            let { partialObserver: t } = this;
            if (t.error)
                try {
                    t.error(n);
                } catch (r) {
                    Zs(r);
                }
            else Zs(n);
        }
        complete() {
            let { partialObserver: n } = this;
            if (n.complete)
                try {
                    n.complete();
                } catch (t) {
                    Zs(t);
                }
        }
    },
    ni = class extends gr {
        constructor(n, t, r) {
            super();
            let i;
            if ($(n) || !n)
                i = {
                    next: n ?? void 0,
                    error: t ?? void 0,
                    complete: r ?? void 0,
                };
            else {
                let o;
                this && zt.useDeprecatedNextContext
                    ? ((o = Object.create(n)),
                      (o.unsubscribe = () => this.unsubscribe()),
                      (i = {
                          next: n.next && Hc(n.next, o),
                          error: n.error && Hc(n.error, o),
                          complete: n.complete && Hc(n.complete, o),
                      }))
                    : (i = n);
            }
            this.destination = new Wc(i);
        }
    };
function Zs(e) {
    zt.useDeprecatedSynchronousErrorHandling ? Lh(e) : Qs(e);
}
function qC(e) {
    throw e;
}
function zc(e, n) {
    let { onStoppedNotification: t } = zt;
    t && ei.setTimeout(() => t(e, n));
}
var GC = { closed: !0, next: bo, error: qC, complete: bo };
var ri = (typeof Symbol == "function" && Symbol.observable) || "@@observable";
function _t(e) {
    return e;
}
function qc(...e) {
    return Gc(e);
}
function Gc(e) {
    return e.length === 0
        ? _t
        : e.length === 1
          ? e[0]
          : function (t) {
                return e.reduce((r, i) => i(r), t);
            };
}
var le = (() => {
    class e {
        constructor(t) {
            t && (this._subscribe = t);
        }
        lift(t) {
            let r = new e();
            return ((r.source = this), (r.operator = t), r);
        }
        subscribe(t, r, i) {
            let o = KC(t) ? t : new ni(t, r, i);
            return (
                ti(() => {
                    let { operator: s, source: a } = this;
                    o.add(
                        s
                            ? s.call(o, a)
                            : a
                              ? this._subscribe(o)
                              : this._trySubscribe(o)
                    );
                }),
                o
            );
        }
        _trySubscribe(t) {
            try {
                return this._subscribe(t);
            } catch (r) {
                t.error(r);
            }
        }
        forEach(t, r) {
            return (
                (r = Fh(r)),
                new r((i, o) => {
                    let s = new ni({
                        next: (a) => {
                            try {
                                t(a);
                            } catch (l) {
                                (o(l), s.unsubscribe());
                            }
                        },
                        error: o,
                        complete: i,
                    });
                    this.subscribe(s);
                })
            );
        }
        _subscribe(t) {
            var r;
            return (r = this.source) === null || r === void 0
                ? void 0
                : r.subscribe(t);
        }
        [ri]() {
            return this;
        }
        pipe(...t) {
            return Gc(t)(this);
        }
        toPromise(t) {
            return (
                (t = Fh(t)),
                new t((r, i) => {
                    let o;
                    this.subscribe(
                        (s) => (o = s),
                        (s) => i(s),
                        () => r(o)
                    );
                })
            );
        }
    }
    return ((e.create = (n) => new e(n)), e);
})();
function Fh(e) {
    var n;
    return (n = e ?? zt.Promise) !== null && n !== void 0 ? n : Promise;
}
function YC(e) {
    return e && $(e.next) && $(e.error) && $(e.complete);
}
function KC(e) {
    return (e && e instanceof gr) || (YC(e) && Ks(e));
}
function Yc(e) {
    return $(e?.lift);
}
function Z(e) {
    return (n) => {
        if (Yc(n))
            return n.lift(function (t) {
                try {
                    return e(t, this);
                } catch (r) {
                    this.error(r);
                }
            });
        throw new TypeError("Unable to lift unknown Observable type");
    };
}
function X(e, n, t, r, i) {
    return new Kc(e, n, t, r, i);
}
var Kc = class extends gr {
    constructor(n, t, r, i, o, s) {
        (super(n),
            (this.onFinalize = o),
            (this.shouldUnsubscribe = s),
            (this._next = t
                ? function (a) {
                      try {
                          t(a);
                      } catch (l) {
                          n.error(l);
                      }
                  }
                : super._next),
            (this._error = i
                ? function (a) {
                      try {
                          i(a);
                      } catch (l) {
                          n.error(l);
                      } finally {
                          this.unsubscribe();
                      }
                  }
                : super._error),
            (this._complete = r
                ? function () {
                      try {
                          r();
                      } catch (a) {
                          n.error(a);
                      } finally {
                          this.unsubscribe();
                      }
                  }
                : super._complete));
    }
    unsubscribe() {
        var n;
        if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
            let { closed: t } = this;
            (super.unsubscribe(),
                !t &&
                    ((n = this.onFinalize) === null ||
                        n === void 0 ||
                        n.call(this)));
        }
    }
};
function ii() {
    return Z((e, n) => {
        let t = null;
        e._refCount++;
        let r = X(n, void 0, void 0, void 0, () => {
            if (!e || e._refCount <= 0 || 0 < --e._refCount) {
                t = null;
                return;
            }
            let i = e._connection,
                o = t;
            ((t = null),
                i && (!o || i === o) && i.unsubscribe(),
                n.unsubscribe());
        });
        (e.subscribe(r), r.closed || (t = e.connect()));
    });
}
var oi = class extends le {
    constructor(n, t) {
        (super(),
            (this.source = n),
            (this.subjectFactory = t),
            (this._subject = null),
            (this._refCount = 0),
            (this._connection = null),
            Yc(n) && (this.lift = n.lift));
    }
    _subscribe(n) {
        return this.getSubject().subscribe(n);
    }
    getSubject() {
        let n = this._subject;
        return (
            (!n || n.isStopped) && (this._subject = this.subjectFactory()),
            this._subject
        );
    }
    _teardown() {
        this._refCount = 0;
        let { _connection: n } = this;
        ((this._subject = this._connection = null), n?.unsubscribe());
    }
    connect() {
        let n = this._connection;
        if (!n) {
            n = this._connection = new Ie();
            let t = this.getSubject();
            (n.add(
                this.source.subscribe(
                    X(
                        t,
                        void 0,
                        () => {
                            (this._teardown(), t.complete());
                        },
                        (r) => {
                            (this._teardown(), t.error(r));
                        },
                        () => this._teardown()
                    )
                )
            ),
                n.closed && ((this._connection = null), (n = Ie.EMPTY)));
        }
        return n;
    }
    refCount() {
        return ii()(this);
    }
};
var $h = Jr(
    (e) =>
        function () {
            (e(this),
                (this.name = "ObjectUnsubscribedError"),
                (this.message = "object unsubscribed"));
        }
);
var Te = (() => {
        class e extends le {
            constructor() {
                (super(),
                    (this.closed = !1),
                    (this.currentObservers = null),
                    (this.observers = []),
                    (this.isStopped = !1),
                    (this.hasError = !1),
                    (this.thrownError = null));
            }
            lift(t) {
                let r = new Xs(this, this);
                return ((r.operator = t), r);
            }
            _throwIfClosed() {
                if (this.closed) throw new $h();
            }
            next(t) {
                ti(() => {
                    if ((this._throwIfClosed(), !this.isStopped)) {
                        this.currentObservers ||
                            (this.currentObservers = Array.from(
                                this.observers
                            ));
                        for (let r of this.currentObservers) r.next(t);
                    }
                });
            }
            error(t) {
                ti(() => {
                    if ((this._throwIfClosed(), !this.isStopped)) {
                        ((this.hasError = this.isStopped = !0),
                            (this.thrownError = t));
                        let { observers: r } = this;
                        for (; r.length; ) r.shift().error(t);
                    }
                });
            }
            complete() {
                ti(() => {
                    if ((this._throwIfClosed(), !this.isStopped)) {
                        this.isStopped = !0;
                        let { observers: t } = this;
                        for (; t.length; ) t.shift().complete();
                    }
                });
            }
            unsubscribe() {
                ((this.isStopped = this.closed = !0),
                    (this.observers = this.currentObservers = null));
            }
            get observed() {
                var t;
                return (
                    ((t = this.observers) === null || t === void 0
                        ? void 0
                        : t.length) > 0
                );
            }
            _trySubscribe(t) {
                return (this._throwIfClosed(), super._trySubscribe(t));
            }
            _subscribe(t) {
                return (
                    this._throwIfClosed(),
                    this._checkFinalizedStatuses(t),
                    this._innerSubscribe(t)
                );
            }
            _innerSubscribe(t) {
                let { hasError: r, isStopped: i, observers: o } = this;
                return r || i
                    ? Bc
                    : ((this.currentObservers = null),
                      o.push(t),
                      new Ie(() => {
                          ((this.currentObservers = null), vo(o, t));
                      }));
            }
            _checkFinalizedStatuses(t) {
                let { hasError: r, thrownError: i, isStopped: o } = this;
                r ? t.error(i) : o && t.complete();
            }
            asObservable() {
                let t = new le();
                return ((t.source = this), t);
            }
        }
        return ((e.create = (n, t) => new Xs(n, t)), e);
    })(),
    Xs = class extends Te {
        constructor(n, t) {
            (super(), (this.destination = n), (this.source = t));
        }
        next(n) {
            var t, r;
            (r =
                (t = this.destination) === null || t === void 0
                    ? void 0
                    : t.next) === null ||
                r === void 0 ||
                r.call(t, n);
        }
        error(n) {
            var t, r;
            (r =
                (t = this.destination) === null || t === void 0
                    ? void 0
                    : t.error) === null ||
                r === void 0 ||
                r.call(t, n);
        }
        complete() {
            var n, t;
            (t =
                (n = this.destination) === null || n === void 0
                    ? void 0
                    : n.complete) === null ||
                t === void 0 ||
                t.call(n);
        }
        _subscribe(n) {
            var t, r;
            return (r =
                (t = this.source) === null || t === void 0
                    ? void 0
                    : t.subscribe(n)) !== null && r !== void 0
                ? r
                : Bc;
        }
    };
var je = class extends Te {
    constructor(n) {
        (super(), (this._value = n));
    }
    get value() {
        return this.getValue();
    }
    _subscribe(n) {
        let t = super._subscribe(n);
        return (!t.closed && n.next(this._value), t);
    }
    getValue() {
        let { hasError: n, thrownError: t, _value: r } = this;
        if (n) throw t;
        return (this._throwIfClosed(), r);
    }
    next(n) {
        super.next((this._value = n));
    }
};
var it = new le((e) => e.complete());
function Vh(e) {
    return e && $(e.schedule);
}
function jh(e) {
    return e[e.length - 1];
}
function Bh(e) {
    return $(jh(e)) ? e.pop() : void 0;
}
function Qn(e) {
    return Vh(jh(e)) ? e.pop() : void 0;
}
function Hh(e, n, t, r) {
    function i(o) {
        return o instanceof t
            ? o
            : new t(function (s) {
                  s(o);
              });
    }
    return new (t || (t = Promise))(function (o, s) {
        function a(u) {
            try {
                c(r.next(u));
            } catch (d) {
                s(d);
            }
        }
        function l(u) {
            try {
                c(r.throw(u));
            } catch (d) {
                s(d);
            }
        }
        function c(u) {
            u.done ? o(u.value) : i(u.value).then(a, l);
        }
        c((r = r.apply(e, n || [])).next());
    });
}
function Uh(e) {
    var n = typeof Symbol == "function" && Symbol.iterator,
        t = n && e[n],
        r = 0;
    if (t) return t.call(e);
    if (e && typeof e.length == "number")
        return {
            next: function () {
                return (
                    e && r >= e.length && (e = void 0),
                    { value: e && e[r++], done: !e }
                );
            },
        };
    throw new TypeError(
        n ? "Object is not iterable." : "Symbol.iterator is not defined."
    );
}
function mr(e) {
    return this instanceof mr ? ((this.v = e), this) : new mr(e);
}
function zh(e, n, t) {
    if (!Symbol.asyncIterator)
        throw new TypeError("Symbol.asyncIterator is not defined.");
    var r = t.apply(e, n || []),
        i,
        o = [];
    return (
        (i = Object.create(
            (typeof AsyncIterator == "function" ? AsyncIterator : Object)
                .prototype
        )),
        a("next"),
        a("throw"),
        a("return", s),
        (i[Symbol.asyncIterator] = function () {
            return this;
        }),
        i
    );
    function s(f) {
        return function (h) {
            return Promise.resolve(h).then(f, d);
        };
    }
    function a(f, h) {
        r[f] &&
            ((i[f] = function (_) {
                return new Promise(function (M, I) {
                    o.push([f, _, M, I]) > 1 || l(f, _);
                });
            }),
            h && (i[f] = h(i[f])));
    }
    function l(f, h) {
        try {
            c(r[f](h));
        } catch (_) {
            p(o[0][3], _);
        }
    }
    function c(f) {
        f.value instanceof mr
            ? Promise.resolve(f.value.v).then(u, d)
            : p(o[0][2], f);
    }
    function u(f) {
        l("next", f);
    }
    function d(f) {
        l("throw", f);
    }
    function p(f, h) {
        (f(h), o.shift(), o.length && l(o[0][0], o[0][1]));
    }
}
function Wh(e) {
    if (!Symbol.asyncIterator)
        throw new TypeError("Symbol.asyncIterator is not defined.");
    var n = e[Symbol.asyncIterator],
        t;
    return n
        ? n.call(e)
        : ((e = typeof Uh == "function" ? Uh(e) : e[Symbol.iterator]()),
          (t = {}),
          r("next"),
          r("throw"),
          r("return"),
          (t[Symbol.asyncIterator] = function () {
              return this;
          }),
          t);
    function r(o) {
        t[o] =
            e[o] &&
            function (s) {
                return new Promise(function (a, l) {
                    ((s = e[o](s)), i(a, l, s.done, s.value));
                });
            };
    }
    function i(o, s, a, l) {
        Promise.resolve(l).then(function (c) {
            o({ value: c, done: a });
        }, s);
    }
}
var Js = (e) => e && typeof e.length == "number" && typeof e != "function";
function ea(e) {
    return $(e?.then);
}
function ta(e) {
    return $(e[ri]);
}
function na(e) {
    return Symbol.asyncIterator && $(e?.[Symbol.asyncIterator]);
}
function ra(e) {
    return new TypeError(
        `You provided ${e !== null && typeof e == "object" ? "an invalid object" : `'${e}'`} where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`
    );
}
function QC() {
    return typeof Symbol != "function" || !Symbol.iterator
        ? "@@iterator"
        : Symbol.iterator;
}
var ia = QC();
function oa(e) {
    return $(e?.[ia]);
}
function sa(e) {
    return zh(this, arguments, function* () {
        let t = e.getReader();
        try {
            for (;;) {
                let { value: r, done: i } = yield mr(t.read());
                if (i) return yield mr(void 0);
                yield yield mr(r);
            }
        } finally {
            t.releaseLock();
        }
    });
}
function aa(e) {
    return $(e?.getReader);
}
function Re(e) {
    if (e instanceof le) return e;
    if (e != null) {
        if (ta(e)) return ZC(e);
        if (Js(e)) return XC(e);
        if (ea(e)) return JC(e);
        if (na(e)) return qh(e);
        if (oa(e)) return eE(e);
        if (aa(e)) return tE(e);
    }
    throw ra(e);
}
function ZC(e) {
    return new le((n) => {
        let t = e[ri]();
        if ($(t.subscribe)) return t.subscribe(n);
        throw new TypeError(
            "Provided object does not correctly implement Symbol.observable"
        );
    });
}
function XC(e) {
    return new le((n) => {
        for (let t = 0; t < e.length && !n.closed; t++) n.next(e[t]);
        n.complete();
    });
}
function JC(e) {
    return new le((n) => {
        e.then(
            (t) => {
                n.closed || (n.next(t), n.complete());
            },
            (t) => n.error(t)
        ).then(null, Qs);
    });
}
function eE(e) {
    return new le((n) => {
        for (let t of e) if ((n.next(t), n.closed)) return;
        n.complete();
    });
}
function qh(e) {
    return new le((n) => {
        nE(e, n).catch((t) => n.error(t));
    });
}
function tE(e) {
    return qh(sa(e));
}
function nE(e, n) {
    var t, r, i, o;
    return Hh(this, void 0, void 0, function* () {
        try {
            for (t = Wh(e); (r = yield t.next()), !r.done; ) {
                let s = r.value;
                if ((n.next(s), n.closed)) return;
            }
        } catch (s) {
            i = { error: s };
        } finally {
            try {
                r && !r.done && (o = t.return) && (yield o.call(t));
            } finally {
                if (i) throw i.error;
            }
        }
        n.complete();
    });
}
function ot(e, n, t, r = 0, i = !1) {
    let o = n.schedule(function () {
        (t(), i ? e.add(this.schedule(null, r)) : this.unsubscribe());
    }, r);
    if ((e.add(o), !i)) return o;
}
function la(e, n = 0) {
    return Z((t, r) => {
        t.subscribe(
            X(
                r,
                (i) => ot(r, e, () => r.next(i), n),
                () => ot(r, e, () => r.complete(), n),
                (i) => ot(r, e, () => r.error(i), n)
            )
        );
    });
}
function ca(e, n = 0) {
    return Z((t, r) => {
        r.add(e.schedule(() => t.subscribe(r), n));
    });
}
function Gh(e, n) {
    return Re(e).pipe(ca(n), la(n));
}
function Yh(e, n) {
    return Re(e).pipe(ca(n), la(n));
}
function Kh(e, n) {
    return new le((t) => {
        let r = 0;
        return n.schedule(function () {
            r === e.length
                ? t.complete()
                : (t.next(e[r++]), t.closed || this.schedule());
        });
    });
}
function Qh(e, n) {
    return new le((t) => {
        let r;
        return (
            ot(t, n, () => {
                ((r = e[ia]()),
                    ot(
                        t,
                        n,
                        () => {
                            let i, o;
                            try {
                                ({ value: i, done: o } = r.next());
                            } catch (s) {
                                t.error(s);
                                return;
                            }
                            o ? t.complete() : t.next(i);
                        },
                        0,
                        !0
                    ));
            }),
            () => $(r?.return) && r.return()
        );
    });
}
function ua(e, n) {
    if (!e) throw new Error("Iterable cannot be null");
    return new le((t) => {
        ot(t, n, () => {
            let r = e[Symbol.asyncIterator]();
            ot(
                t,
                n,
                () => {
                    r.next().then((i) => {
                        i.done ? t.complete() : t.next(i.value);
                    });
                },
                0,
                !0
            );
        });
    });
}
function Zh(e, n) {
    return ua(sa(e), n);
}
function Xh(e, n) {
    if (e != null) {
        if (ta(e)) return Gh(e, n);
        if (Js(e)) return Kh(e, n);
        if (ea(e)) return Yh(e, n);
        if (na(e)) return ua(e, n);
        if (oa(e)) return Qh(e, n);
        if (aa(e)) return Zh(e, n);
    }
    throw ra(e);
}
function Ee(e, n) {
    return n ? Xh(e, n) : Re(e);
}
function k(...e) {
    let n = Qn(e);
    return Ee(e, n);
}
function si(e, n) {
    let t = $(e) ? e : () => e,
        r = (i) => i.error(t());
    return new le(n ? (i) => n.schedule(r, 0, i) : r);
}
function Qc(e) {
    return !!e && (e instanceof le || ($(e.lift) && $(e.subscribe)));
}
var In = Jr(
    (e) =>
        function () {
            (e(this),
                (this.name = "EmptyError"),
                (this.message = "no elements in sequence"));
        }
);
function ee(e, n) {
    return Z((t, r) => {
        let i = 0;
        t.subscribe(
            X(r, (o) => {
                r.next(e.call(n, o, i++));
            })
        );
    });
}
var { isArray: rE } = Array;
function iE(e, n) {
    return rE(n) ? e(...n) : e(n);
}
function Jh(e) {
    return ee((n) => iE(e, n));
}
var { isArray: oE } = Array,
    { getPrototypeOf: sE, prototype: aE, keys: lE } = Object;
function eg(e) {
    if (e.length === 1) {
        let n = e[0];
        if (oE(n)) return { args: n, keys: null };
        if (cE(n)) {
            let t = lE(n);
            return { args: t.map((r) => n[r]), keys: t };
        }
    }
    return { args: e, keys: null };
}
function cE(e) {
    return e && typeof e == "object" && sE(e) === aE;
}
function tg(e, n) {
    return e.reduce((t, r, i) => ((t[r] = n[i]), t), {});
}
function Co(...e) {
    let n = Qn(e),
        t = Bh(e),
        { args: r, keys: i } = eg(e);
    if (r.length === 0) return Ee([], n);
    let o = new le(uE(r, n, i ? (s) => tg(i, s) : _t));
    return t ? o.pipe(Jh(t)) : o;
}
function uE(e, n, t = _t) {
    return (r) => {
        ng(
            n,
            () => {
                let { length: i } = e,
                    o = new Array(i),
                    s = i,
                    a = i;
                for (let l = 0; l < i; l++)
                    ng(
                        n,
                        () => {
                            let c = Ee(e[l], n),
                                u = !1;
                            c.subscribe(
                                X(
                                    r,
                                    (d) => {
                                        ((o[l] = d),
                                            u || ((u = !0), a--),
                                            a || r.next(t(o.slice())));
                                    },
                                    () => {
                                        --s || r.complete();
                                    }
                                )
                            );
                        },
                        r
                    );
            },
            r
        );
    };
}
function ng(e, n, t) {
    e ? ot(t, e, n) : n();
}
function rg(e, n, t, r, i, o, s, a) {
    let l = [],
        c = 0,
        u = 0,
        d = !1,
        p = () => {
            d && !l.length && !c && n.complete();
        },
        f = (_) => (c < r ? h(_) : l.push(_)),
        h = (_) => {
            (o && n.next(_), c++);
            let M = !1;
            Re(t(_, u++)).subscribe(
                X(
                    n,
                    (I) => {
                        (i?.(I), o ? f(I) : n.next(I));
                    },
                    () => {
                        M = !0;
                    },
                    void 0,
                    () => {
                        if (M)
                            try {
                                for (c--; l.length && c < r; ) {
                                    let I = l.shift();
                                    s ? ot(n, s, () => h(I)) : h(I);
                                }
                                p();
                            } catch (I) {
                                n.error(I);
                            }
                    }
                )
            );
        };
    return (
        e.subscribe(
            X(n, f, () => {
                ((d = !0), p());
            })
        ),
        () => {
            a?.();
        }
    );
}
function we(e, n, t = 1 / 0) {
    return $(n)
        ? we((r, i) => ee((o, s) => n(r, o, i, s))(Re(e(r, i))), t)
        : (typeof n == "number" && (t = n), Z((r, i) => rg(r, i, e, t)));
}
function ai(e = 1 / 0) {
    return we(_t, e);
}
function ig() {
    return ai(1);
}
function li(...e) {
    return ig()(Ee(e, Qn(e)));
}
function da(e) {
    return new le((n) => {
        Re(e()).subscribe(n);
    });
}
function yt(e, n) {
    return Z((t, r) => {
        let i = 0;
        t.subscribe(X(r, (o) => e.call(n, o, i++) && r.next(o)));
    });
}
function Tn(e) {
    return Z((n, t) => {
        let r = null,
            i = !1,
            o;
        ((r = n.subscribe(
            X(t, void 0, void 0, (s) => {
                ((o = Re(e(s, Tn(e)(n)))),
                    r
                        ? (r.unsubscribe(), (r = null), o.subscribe(t))
                        : (i = !0));
            })
        )),
            i && (r.unsubscribe(), (r = null), o.subscribe(t)));
    });
}
function og(e, n, t, r, i) {
    return (o, s) => {
        let a = t,
            l = n,
            c = 0;
        o.subscribe(
            X(
                s,
                (u) => {
                    let d = c++;
                    ((l = a ? e(l, u, d) : ((a = !0), u)), r && s.next(l));
                },
                i &&
                    (() => {
                        (a && s.next(l), s.complete());
                    })
            )
        );
    };
}
function Zn(e, n) {
    return $(n) ? we(e, n, 1) : we(e, 1);
}
function Xn(e) {
    return Z((n, t) => {
        let r = !1;
        n.subscribe(
            X(
                t,
                (i) => {
                    ((r = !0), t.next(i));
                },
                () => {
                    (r || t.next(e), t.complete());
                }
            )
        );
    });
}
function xn(e) {
    return e <= 0
        ? () => it
        : Z((n, t) => {
              let r = 0;
              n.subscribe(
                  X(t, (i) => {
                      ++r <= e && (t.next(i), e <= r && t.complete());
                  })
              );
          });
}
function fa(e = dE) {
    return Z((n, t) => {
        let r = !1;
        n.subscribe(
            X(
                t,
                (i) => {
                    ((r = !0), t.next(i));
                },
                () => (r ? t.complete() : t.error(e()))
            )
        );
    });
}
function dE() {
    return new In();
}
function Eo(e) {
    return Z((n, t) => {
        try {
            n.subscribe(t);
        } finally {
            t.add(e);
        }
    });
}
function On(e, n) {
    let t = arguments.length >= 2;
    return (r) =>
        r.pipe(
            e ? yt((i, o) => e(i, o, r)) : _t,
            xn(1),
            t ? Xn(n) : fa(() => new In())
        );
}
function ci(e) {
    return e <= 0
        ? () => it
        : Z((n, t) => {
              let r = [];
              n.subscribe(
                  X(
                      t,
                      (i) => {
                          (r.push(i), e < r.length && r.shift());
                      },
                      () => {
                          for (let i of r) t.next(i);
                          t.complete();
                      },
                      void 0,
                      () => {
                          r = null;
                      }
                  )
              );
          });
}
function Zc(e, n) {
    let t = arguments.length >= 2;
    return (r) =>
        r.pipe(
            e ? yt((i, o) => e(i, o, r)) : _t,
            ci(1),
            t ? Xn(n) : fa(() => new In())
        );
}
function Xc(e, n) {
    return Z(og(e, n, arguments.length >= 2, !0));
}
function Jc(...e) {
    let n = Qn(e);
    return Z((t, r) => {
        (n ? li(e, t, n) : li(e, t)).subscribe(r);
    });
}
function xt(e, n) {
    return Z((t, r) => {
        let i = null,
            o = 0,
            s = !1,
            a = () => s && !i && r.complete();
        t.subscribe(
            X(
                r,
                (l) => {
                    i?.unsubscribe();
                    let c = 0,
                        u = o++;
                    Re(e(l, u)).subscribe(
                        (i = X(
                            r,
                            (d) => r.next(n ? n(l, d, u, c++) : d),
                            () => {
                                ((i = null), a());
                            }
                        ))
                    );
                },
                () => {
                    ((s = !0), a());
                }
            )
        );
    });
}
function eu(e) {
    return Z((n, t) => {
        (Re(e).subscribe(X(t, () => t.complete(), bo)),
            !t.closed && n.subscribe(t));
    });
}
function Be(e, n, t) {
    let r = $(e) || n || t ? { next: e, error: n, complete: t } : e;
    return r
        ? Z((i, o) => {
              var s;
              (s = r.subscribe) === null || s === void 0 || s.call(r);
              let a = !0;
              i.subscribe(
                  X(
                      o,
                      (l) => {
                          var c;
                          ((c = r.next) === null ||
                              c === void 0 ||
                              c.call(r, l),
                              o.next(l));
                      },
                      () => {
                          var l;
                          ((a = !1),
                              (l = r.complete) === null ||
                                  l === void 0 ||
                                  l.call(r),
                              o.complete());
                      },
                      (l) => {
                          var c;
                          ((a = !1),
                              (c = r.error) === null ||
                                  c === void 0 ||
                                  c.call(r, l),
                              o.error(l));
                      },
                      () => {
                          var l, c;
                          (a &&
                              ((l = r.unsubscribe) === null ||
                                  l === void 0 ||
                                  l.call(r)),
                              (c = r.finalize) === null ||
                                  c === void 0 ||
                                  c.call(r));
                      }
                  )
              );
          })
        : _t;
}
var Kg =
        "https://angular.dev/best-practices/security#preventing-cross-site-scripting-xss",
    S = class extends Error {
        code;
        constructor(n, t) {
            (super(Qg(n, t)), (this.code = n));
        }
    };
function pE(e) {
    return `NG0${Math.abs(e)}`;
}
function Qg(e, n) {
    return `${pE(e)}${n ? ": " + n : ""}`;
}
var Zg = Symbol("InputSignalNode#UNSET"),
    hE = oe(E({}, qs), {
        transformFn: void 0,
        applyValueToInputSignal(e, n) {
            _o(e, n);
        },
    });
function Xg(e, n) {
    let t = Object.create(hE);
    ((t.value = e), (t.transformFn = n?.transform));
    function r() {
        if ((ho(t), t.value === Zg)) {
            let i = null;
            throw new S(-950, i);
        }
        return t.value;
    }
    return ((r[Tt] = t), r);
}
function Fo(e) {
    return { toString: e }.toString();
}
var pa = "__parameters__";
function gE(e) {
    return function (...t) {
        if (e) {
            let r = e(...t);
            for (let i in r) this[i] = r[i];
        }
    };
}
function Jg(e, n, t) {
    return Fo(() => {
        let r = gE(n);
        function i(...o) {
            if (this instanceof i) return (r.apply(this, o), this);
            let s = new i(...o);
            return ((a.annotation = s), a);
            function a(l, c, u) {
                let d = l.hasOwnProperty(pa)
                    ? l[pa]
                    : Object.defineProperty(l, pa, { value: [] })[pa];
                for (; d.length <= u; ) d.push(null);
                return ((d[u] = d[u] || []).push(s), l);
            }
        }
        return ((i.prototype.ngMetadataName = e), (i.annotationCls = i), i);
    });
}
var Gt = globalThis;
function ce(e) {
    for (let n in e) if (e[n] === ce) return n;
    throw Error("Could not find renamed property on target object.");
}
function mE(e, n) {
    for (let t in n)
        n.hasOwnProperty(t) && !e.hasOwnProperty(t) && (e[t] = n[t]);
}
function st(e) {
    if (typeof e == "string") return e;
    if (Array.isArray(e)) return `[${e.map(st).join(", ")}]`;
    if (e == null) return "" + e;
    let n = e.overriddenName || e.name;
    if (n) return `${n}`;
    let t = e.toString();
    if (t == null) return "" + t;
    let r = t.indexOf(`
`);
    return r >= 0 ? t.slice(0, r) : t;
}
function gu(e, n) {
    return e ? (n ? `${e} ${n}` : e) : n || "";
}
var _E = ce({ __forward_ref__: ce });
function em(e) {
    return (
        (e.__forward_ref__ = em),
        (e.toString = function () {
            return st(this());
        }),
        e
    );
}
function Qe(e) {
    return tm(e) ? e() : e;
}
function tm(e) {
    return (
        typeof e == "function" &&
        e.hasOwnProperty(_E) &&
        e.__forward_ref__ === em
    );
}
function yE(e, n, t) {
    e != n && vE(t, e, n, "==");
}
function vE(e, n, t, r) {
    throw new Error(
        `ASSERTION ERROR: ${e}` +
            (r == null ? "" : ` [Expected=> ${t} ${r} ${n} <=Actual]`)
    );
}
function w(e) {
    return {
        token: e.token,
        providedIn: e.providedIn || null,
        factory: e.factory,
        value: void 0,
    };
}
function he(e) {
    return { providers: e.providers || [], imports: e.imports || [] };
}
function Ka(e) {
    return sg(e, rm) || sg(e, im);
}
function nm(e) {
    return Ka(e) !== null;
}
function sg(e, n) {
    return e.hasOwnProperty(n) ? e[n] : null;
}
function bE(e) {
    let n = e && (e[rm] || e[im]);
    return n || null;
}
function ag(e) {
    return e && (e.hasOwnProperty(lg) || e.hasOwnProperty(CE)) ? e[lg] : null;
}
var rm = ce({ ɵprov: ce }),
    lg = ce({ ɵinj: ce }),
    im = ce({ ngInjectableDef: ce }),
    CE = ce({ ngInjectorDef: ce }),
    O = class {
        _desc;
        ngMetadataName = "InjectionToken";
        ɵprov;
        constructor(n, t) {
            ((this._desc = n),
                (this.ɵprov = void 0),
                typeof t == "number"
                    ? (this.__NG_ELEMENT_ID__ = t)
                    : t !== void 0 &&
                      (this.ɵprov = w({
                          token: this,
                          providedIn: t.providedIn || "root",
                          factory: t.factory,
                      })));
        }
        get multi() {
            return this;
        }
        toString() {
            return `InjectionToken ${this._desc}`;
        }
    };
function om(e) {
    return e && !!e.ɵproviders;
}
var EE = ce({ ɵcmp: ce }),
    SE = ce({ ɵdir: ce }),
    wE = ce({ ɵpipe: ce }),
    DE = ce({ ɵmod: ce }),
    Ea = ce({ ɵfac: ce }),
    Mo = ce({ __NG_ELEMENT_ID__: ce }),
    cg = ce({ __NG_ENV_ID__: ce });
function Qa(e) {
    return typeof e == "string" ? e : e == null ? "" : String(e);
}
function ME(e) {
    return typeof e == "function"
        ? e.name || e.toString()
        : typeof e == "object" && e != null && typeof e.type == "function"
          ? e.type.name || e.type.toString()
          : Qa(e);
}
function sm(e, n) {
    throw new S(-200, e);
}
function bd(e, n) {
    throw new S(-201, !1);
}
var B = (function (e) {
        return (
            (e[(e.Default = 0)] = "Default"),
            (e[(e.Host = 1)] = "Host"),
            (e[(e.Self = 2)] = "Self"),
            (e[(e.SkipSelf = 4)] = "SkipSelf"),
            (e[(e.Optional = 8)] = "Optional"),
            e
        );
    })(B || {}),
    mu;
function am() {
    return mu;
}
function Ot(e) {
    let n = mu;
    return ((mu = e), n);
}
function lm(e, n, t) {
    let r = Ka(e);
    if (r && r.providedIn == "root")
        return r.value === void 0 ? (r.value = r.factory()) : r.value;
    if (t & B.Optional) return null;
    if (n !== void 0) return n;
    bd(e, "Injector");
}
var IE = {},
    _r = IE,
    _u = "__NG_DI_FLAG__",
    Sa = class {
        injector;
        constructor(n) {
            this.injector = n;
        }
        retrieve(n, t) {
            let r = t;
            return this.injector.get(n, r.optional ? Gs : _r, r);
        }
    },
    wa = "ngTempTokenPath",
    TE = "ngTokenPath",
    xE = /\n/gm,
    OE = "\u0275",
    ug = "__source";
function PE(e, n = B.Default) {
    if (yo() === void 0) throw new S(-203, !1);
    if (yo() === null) return lm(e, void 0, n);
    {
        let t = yo(),
            r;
        return (
            t instanceof Sa ? (r = t.injector) : (r = t),
            r.get(e, n & B.Optional ? null : void 0, n)
        );
    }
}
function N(e, n = B.Default) {
    return (am() || PE)(Qe(e), n);
}
function y(e, n = B.Default) {
    return N(e, Za(n));
}
function Za(e) {
    return typeof e > "u" || typeof e == "number"
        ? e
        : 0 |
              (e.optional && 8) |
              (e.host && 1) |
              (e.self && 2) |
              (e.skipSelf && 4);
}
function yu(e) {
    let n = [];
    for (let t = 0; t < e.length; t++) {
        let r = Qe(e[t]);
        if (Array.isArray(r)) {
            if (r.length === 0) throw new S(900, !1);
            let i,
                o = B.Default;
            for (let s = 0; s < r.length; s++) {
                let a = r[s],
                    l = NE(a);
                typeof l == "number"
                    ? l === -1
                        ? (i = a.token)
                        : (o |= l)
                    : (i = a);
            }
            n.push(N(i, o));
        } else n.push(N(r));
    }
    return n;
}
function cm(e, n) {
    return ((e[_u] = n), (e.prototype[_u] = n), e);
}
function NE(e) {
    return e[_u];
}
function AE(e, n, t, r) {
    let i = e[wa];
    throw (
        n[ug] && i.unshift(n[ug]),
        (e.message = RE(
            `
` + e.message,
            i,
            t,
            r
        )),
        (e[TE] = i),
        (e[wa] = null),
        e
    );
}
function RE(e, n, t, r = null) {
    e =
        e &&
        e.charAt(0) ===
            `
` &&
        e.charAt(1) == OE
            ? e.slice(2)
            : e;
    let i = st(n);
    if (Array.isArray(n)) i = n.map(st).join(" -> ");
    else if (typeof n == "object") {
        let o = [];
        for (let s in n)
            if (n.hasOwnProperty(s)) {
                let a = n[s];
                o.push(
                    s + ":" + (typeof a == "string" ? JSON.stringify(a) : st(a))
                );
            }
        i = `{${o.join(", ")}}`;
    }
    return `${t}${r ? "(" + r + ")" : ""}[${i}]: ${e.replace(
        xE,
        `
  `
    )}`;
}
var um = cm(Jg("Optional"), 8);
var dm = cm(Jg("SkipSelf"), 4);
function mi(e, n) {
    let t = e.hasOwnProperty(Ea);
    return t ? e[Ea] : null;
}
function kE(e, n, t) {
    if (e.length !== n.length) return !1;
    for (let r = 0; r < e.length; r++) {
        let i = e[r],
            o = n[r];
        if ((t && ((i = t(i)), (o = t(o))), o !== i)) return !1;
    }
    return !0;
}
function LE(e) {
    return e.flat(Number.POSITIVE_INFINITY);
}
function Cd(e, n) {
    e.forEach((t) => (Array.isArray(t) ? Cd(t, n) : n(t)));
}
function fm(e, n, t) {
    n >= e.length ? e.push(t) : e.splice(n, 0, t);
}
function Da(e, n) {
    return n >= e.length - 1 ? e.pop() : e.splice(n, 1)[0];
}
function FE(e, n) {
    let t = [];
    for (let r = 0; r < e; r++) t.push(n);
    return t;
}
function $E(e, n, t, r) {
    let i = e.length;
    if (i == n) e.push(t, r);
    else if (i === 1) (e.push(r, e[0]), (e[0] = t));
    else {
        for (i--, e.push(e[i - 1], e[i]); i > n; ) {
            let o = i - 2;
            ((e[i] = e[o]), i--);
        }
        ((e[n] = t), (e[n + 1] = r));
    }
}
function Xa(e, n, t) {
    let r = $o(e, n);
    return (r >= 0 ? (e[r | 1] = t) : ((r = ~r), $E(e, r, n, t)), r);
}
function tu(e, n) {
    let t = $o(e, n);
    if (t >= 0) return e[t | 1];
}
function $o(e, n) {
    return VE(e, n, 1);
}
function VE(e, n, t) {
    let r = 0,
        i = e.length >> t;
    for (; i !== r; ) {
        let o = r + ((i - r) >> 1),
            s = e[o << t];
        if (n === s) return o << t;
        s > n ? (i = o) : (r = o + 1);
    }
    return ~(i << t);
}
var vr = {},
    Ze = [],
    To = new O(""),
    pm = new O("", -1),
    hm = new O(""),
    Ma = class {
        get(n, t = _r) {
            if (t === _r) {
                let r = new Error(
                    `NullInjectorError: No provider for ${st(n)}!`
                );
                throw ((r.name = "NullInjectorError"), r);
            }
            return t;
        }
    };
function gm(e, n) {
    let t = e[DE] || null;
    if (!t && n === !0)
        throw new Error(`Type ${st(e)} does not have '\u0275mod' property.`);
    return t;
}
function br(e) {
    return e[EE] || null;
}
function jE(e) {
    return e[SE] || null;
}
function BE(e) {
    return e[wE] || null;
}
function Ja(e) {
    return { ɵproviders: e };
}
function UE(...e) {
    return { ɵproviders: mm(!0, e), ɵfromNgModule: !0 };
}
function mm(e, ...n) {
    let t = [],
        r = new Set(),
        i,
        o = (s) => {
            t.push(s);
        };
    return (
        Cd(n, (s) => {
            let a = s;
            vu(a, o, [], r) && ((i ||= []), i.push(a));
        }),
        i !== void 0 && _m(i, o),
        t
    );
}
function _m(e, n) {
    for (let t = 0; t < e.length; t++) {
        let { ngModule: r, providers: i } = e[t];
        Ed(i, (o) => {
            n(o, r);
        });
    }
}
function vu(e, n, t, r) {
    if (((e = Qe(e)), !e)) return !1;
    let i = null,
        o = ag(e),
        s = !o && br(e);
    if (!o && !s) {
        let l = e.ngModule;
        if (((o = ag(l)), o)) i = l;
        else return !1;
    } else {
        if (s && !s.standalone) return !1;
        i = e;
    }
    let a = r.has(i);
    if (s) {
        if (a) return !1;
        if ((r.add(i), s.dependencies)) {
            let l =
                typeof s.dependencies == "function"
                    ? s.dependencies()
                    : s.dependencies;
            for (let c of l) vu(c, n, t, r);
        }
    } else if (o) {
        if (o.imports != null && !a) {
            r.add(i);
            let c;
            try {
                Cd(o.imports, (u) => {
                    vu(u, n, t, r) && ((c ||= []), c.push(u));
                });
            } finally {
            }
            c !== void 0 && _m(c, n);
        }
        if (!a) {
            let c = mi(i) || (() => new i());
            (n({ provide: i, useFactory: c, deps: Ze }, i),
                n({ provide: hm, useValue: i, multi: !0 }, i),
                n({ provide: To, useValue: () => N(i), multi: !0 }, i));
        }
        let l = o.providers;
        if (l != null && !a) {
            let c = e;
            Ed(l, (u) => {
                n(u, c);
            });
        }
    } else return !1;
    return i !== e && e.providers !== void 0;
}
function Ed(e, n) {
    for (let t of e)
        (om(t) && (t = t.ɵproviders), Array.isArray(t) ? Ed(t, n) : n(t));
}
var HE = ce({ provide: String, useValue: ce });
function ym(e) {
    return e !== null && typeof e == "object" && HE in e;
}
function zE(e) {
    return !!(e && e.useExisting);
}
function WE(e) {
    return !!(e && e.useFactory);
}
function _i(e) {
    return typeof e == "function";
}
function qE(e) {
    return !!e.useClass;
}
var el = new O(""),
    _a = {},
    dg = {},
    nu;
function Sd() {
    return (nu === void 0 && (nu = new Ma()), nu);
}
var at = class {},
    xo = class extends at {
        parent;
        source;
        scopes;
        records = new Map();
        _ngOnDestroyHooks = new Set();
        _onDestroyHooks = [];
        get destroyed() {
            return this._destroyed;
        }
        _destroyed = !1;
        injectorDefTypes;
        constructor(n, t, r, i) {
            (super(),
                (this.parent = t),
                (this.source = r),
                (this.scopes = i),
                Cu(n, (s) => this.processProvider(s)),
                this.records.set(pm, ui(void 0, this)),
                i.has("environment") && this.records.set(at, ui(void 0, this)));
            let o = this.records.get(el);
            (o != null &&
                typeof o.value == "string" &&
                this.scopes.add(o.value),
                (this.injectorDefTypes = new Set(this.get(hm, Ze, B.Self))));
        }
        retrieve(n, t) {
            let r = t;
            return this.get(n, r.optional ? Gs : _r, r);
        }
        destroy() {
            (wo(this), (this._destroyed = !0));
            let n = Y(null);
            try {
                for (let r of this._ngOnDestroyHooks) r.ngOnDestroy();
                let t = this._onDestroyHooks;
                this._onDestroyHooks = [];
                for (let r of t) r();
            } finally {
                (this.records.clear(),
                    this._ngOnDestroyHooks.clear(),
                    this.injectorDefTypes.clear(),
                    Y(n));
            }
        }
        onDestroy(n) {
            return (
                wo(this),
                this._onDestroyHooks.push(n),
                () => this.removeOnDestroy(n)
            );
        }
        runInContext(n) {
            wo(this);
            let t = Mn(this),
                r = Ot(void 0),
                i;
            try {
                return n();
            } finally {
                (Mn(t), Ot(r));
            }
        }
        get(n, t = _r, r = B.Default) {
            if ((wo(this), n.hasOwnProperty(cg))) return n[cg](this);
            r = Za(r);
            let i,
                o = Mn(this),
                s = Ot(void 0);
            try {
                if (!(r & B.SkipSelf)) {
                    let l = this.records.get(n);
                    if (l === void 0) {
                        let c = ZE(n) && Ka(n);
                        (c && this.injectableDefInScope(c)
                            ? (l = ui(bu(n), _a))
                            : (l = null),
                            this.records.set(n, l));
                    }
                    if (l != null) return this.hydrate(n, l, r);
                }
                let a = r & B.Self ? Sd() : this.parent;
                return (
                    (t = r & B.Optional && t === _r ? null : t),
                    a.get(n, t)
                );
            } catch (a) {
                if (a.name === "NullInjectorError") {
                    if (((a[wa] = a[wa] || []).unshift(st(n)), o)) throw a;
                    return AE(a, n, "R3InjectorError", this.source);
                } else throw a;
            } finally {
                (Ot(s), Mn(o));
            }
        }
        resolveInjectorInitializers() {
            let n = Y(null),
                t = Mn(this),
                r = Ot(void 0),
                i;
            try {
                let o = this.get(To, Ze, B.Self);
                for (let s of o) s();
            } finally {
                (Mn(t), Ot(r), Y(n));
            }
        }
        toString() {
            let n = [],
                t = this.records;
            for (let r of t.keys()) n.push(st(r));
            return `R3Injector[${n.join(", ")}]`;
        }
        processProvider(n) {
            n = Qe(n);
            let t = _i(n) ? n : Qe(n && n.provide),
                r = YE(n);
            if (!_i(n) && n.multi === !0) {
                let i = this.records.get(t);
                (i ||
                    ((i = ui(void 0, _a, !0)),
                    (i.factory = () => yu(i.multi)),
                    this.records.set(t, i)),
                    (t = n),
                    i.multi.push(n));
            }
            this.records.set(t, r);
        }
        hydrate(n, t, r) {
            let i = Y(null);
            try {
                return (
                    t.value === dg
                        ? sm(st(n))
                        : t.value === _a &&
                          ((t.value = dg), (t.value = t.factory(void 0, r))),
                    typeof t.value == "object" &&
                        t.value &&
                        QE(t.value) &&
                        this._ngOnDestroyHooks.add(t.value),
                    t.value
                );
            } finally {
                Y(i);
            }
        }
        injectableDefInScope(n) {
            if (!n.providedIn) return !1;
            let t = Qe(n.providedIn);
            return typeof t == "string"
                ? t === "any" || this.scopes.has(t)
                : this.injectorDefTypes.has(t);
        }
        removeOnDestroy(n) {
            let t = this._onDestroyHooks.indexOf(n);
            t !== -1 && this._onDestroyHooks.splice(t, 1);
        }
    };
function bu(e) {
    let n = Ka(e),
        t = n !== null ? n.factory : mi(e);
    if (t !== null) return t;
    if (e instanceof O) throw new S(204, !1);
    if (e instanceof Function) return GE(e);
    throw new S(204, !1);
}
function GE(e) {
    if (e.length > 0) throw new S(204, !1);
    let t = bE(e);
    return t !== null ? () => t.factory(e) : () => new e();
}
function YE(e) {
    if (ym(e)) return ui(void 0, e.useValue);
    {
        let n = vm(e);
        return ui(n, _a);
    }
}
function vm(e, n, t) {
    let r;
    if (_i(e)) {
        let i = Qe(e);
        return mi(i) || bu(i);
    } else if (ym(e)) r = () => Qe(e.useValue);
    else if (WE(e)) r = () => e.useFactory(...yu(e.deps || []));
    else if (zE(e))
        r = (i, o) =>
            N(
                Qe(e.useExisting),
                o !== void 0 && o & B.Optional ? B.Optional : void 0
            );
    else {
        let i = Qe(e && (e.useClass || e.provide));
        if (KE(e)) r = () => new i(...yu(e.deps));
        else return mi(i) || bu(i);
    }
    return r;
}
function wo(e) {
    if (e.destroyed) throw new S(205, !1);
}
function ui(e, n, t = !1) {
    return { factory: e, value: n, multi: t ? [] : void 0 };
}
function KE(e) {
    return !!e.deps;
}
function QE(e) {
    return (
        e !== null && typeof e == "object" && typeof e.ngOnDestroy == "function"
    );
}
function ZE(e) {
    return typeof e == "function" || (typeof e == "object" && e instanceof O);
}
function Cu(e, n) {
    for (let t of e)
        Array.isArray(t) ? Cu(t, n) : t && om(t) ? Cu(t.ɵproviders, n) : n(t);
}
function Nt(e, n) {
    let t;
    e instanceof xo ? (wo(e), (t = e)) : (t = new Sa(e));
    let r,
        i = Mn(t),
        o = Ot(void 0);
    try {
        return n();
    } finally {
        (Mn(i), Ot(o));
    }
}
function wd() {
    return am() !== void 0 || yo() != null;
}
function bm(e) {
    if (!wd()) throw new S(-203, !1);
}
function XE(e) {
    let n = Gt.ng;
    if (n && n.ɵcompilerFacade) return n.ɵcompilerFacade;
    throw new Error("JIT compiler unavailable");
}
function JE(e) {
    return typeof e == "function";
}
var kn = 0,
    z = 1,
    L = 2,
    ze = 3,
    qt = 4,
    Je = 5,
    Oo = 6,
    Ia = 7,
    lt = 8,
    yi = 9,
    Nn = 10,
    _e = 11,
    Po = 12,
    fg = 13,
    Mi = 14,
    bt = 15,
    Cr = 16,
    di = 17,
    An = 18,
    tl = 19,
    Cm = 20,
    Jn = 21,
    ru = 22,
    Er = 23,
    Pt = 24,
    hi = 25,
    Xe = 26,
    Em = 1;
var Sr = 7,
    Ta = 8,
    vi = 9,
    vt = 10;
function er(e) {
    return Array.isArray(e) && typeof e[Em] == "object";
}
function Ln(e) {
    return Array.isArray(e) && e[Em] === !0;
}
function Dd(e) {
    return (e.flags & 4) !== 0;
}
function Ii(e) {
    return e.componentOffset > -1;
}
function nl(e) {
    return (e.flags & 1) === 1;
}
function on(e) {
    return !!e.template;
}
function xa(e) {
    return (e[L] & 512) !== 0;
}
function Ti(e) {
    return (e[L] & 256) === 256;
}
var Eu = class {
    previousValue;
    currentValue;
    firstChange;
    constructor(n, t, r) {
        ((this.previousValue = n),
            (this.currentValue = t),
            (this.firstChange = r));
    }
    isFirstChange() {
        return this.firstChange;
    }
};
function Sm(e, n, t, r) {
    n !== null ? n.applyValueToInputSignal(n, r) : (e[t] = r);
}
var At = (() => {
    let e = () => wm;
    return ((e.ngInherit = !0), e);
})();
function wm(e) {
    return (e.type.prototype.ngOnChanges && (e.setInput = tS), eS);
}
function eS() {
    let e = Mm(this),
        n = e?.current;
    if (n) {
        let t = e.previous;
        if (t === vr) e.previous = n;
        else for (let r in n) t[r] = n[r];
        ((e.current = null), this.ngOnChanges(n));
    }
}
function tS(e, n, t, r, i) {
    let o = this.declaredInputs[r],
        s = Mm(e) || nS(e, { previous: vr, current: null }),
        a = s.current || (s.current = {}),
        l = s.previous,
        c = l[o];
    ((a[o] = new Eu(c && c.currentValue, t, l === vr)), Sm(e, n, i, t));
}
var Dm = "__ngSimpleChanges__";
function Mm(e) {
    return e[Dm] || null;
}
function nS(e, n) {
    return (e[Dm] = n);
}
var pg = null;
var fe = function (e, n = null, t) {
        pg?.(e, n, t);
    },
    Im = "svg",
    rS = "math";
function Yt(e) {
    for (; Array.isArray(e); ) e = e[kn];
    return e;
}
function Tm(e, n) {
    return Yt(n[e]);
}
function fn(e, n) {
    return Yt(n[e.index]);
}
function xm(e, n) {
    return e.data[n];
}
function iS(e, n) {
    return e[n];
}
function sn(e, n) {
    let t = n[e];
    return er(t) ? t : t[kn];
}
function oS(e) {
    return (e[L] & 4) === 4;
}
function Md(e) {
    return (e[L] & 128) === 128;
}
function sS(e) {
    return Ln(e[ze]);
}
function wr(e, n) {
    return n == null ? null : e[n];
}
function Om(e) {
    e[di] = 0;
}
function Pm(e) {
    e[L] & 1024 || ((e[L] |= 1024), Md(e) && xi(e));
}
function aS(e, n) {
    for (; e > 0; ) ((n = n[Mi]), e--);
    return n;
}
function rl(e) {
    return !!(e[L] & 9216 || e[Pt]?.dirty);
}
function Su(e) {
    (e[Nn].changeDetectionScheduler?.notify(8),
        e[L] & 64 && (e[L] |= 1024),
        rl(e) && xi(e));
}
function xi(e) {
    e[Nn].changeDetectionScheduler?.notify(0);
    let n = Dr(e);
    for (; n !== null && !(n[L] & 8192 || ((n[L] |= 8192), !Md(n))); )
        n = Dr(n);
}
function Nm(e, n) {
    if (Ti(e)) throw new S(911, !1);
    (e[Jn] === null && (e[Jn] = []), e[Jn].push(n));
}
function lS(e, n) {
    if (e[Jn] === null) return;
    let t = e[Jn].indexOf(n);
    t !== -1 && e[Jn].splice(t, 1);
}
function Dr(e) {
    let n = e[ze];
    return Ln(n) ? n[ze] : n;
}
function Id(e) {
    return (e[Ia] ??= []);
}
function Td(e) {
    return (e.cleanup ??= []);
}
function cS(e, n, t, r) {
    let i = Id(n);
    (i.push(t), e.firstCreatePass && Td(e).push(r, i.length - 1));
}
var U = { lFrame: Bm(null), bindingsEnabled: !0, skipHydrationRootTNode: null };
var wu = !1;
function uS() {
    return U.lFrame.elementDepthCount;
}
function dS() {
    U.lFrame.elementDepthCount++;
}
function fS() {
    U.lFrame.elementDepthCount--;
}
function xd() {
    return U.bindingsEnabled;
}
function Am() {
    return U.skipHydrationRootTNode !== null;
}
function pS(e) {
    return U.skipHydrationRootTNode === e;
}
function hS() {
    U.skipHydrationRootTNode = null;
}
function q() {
    return U.lFrame.lView;
}
function De() {
    return U.lFrame.tView;
}
function Fn(e) {
    return ((U.lFrame.contextLView = e), e[lt]);
}
function $n(e) {
    return ((U.lFrame.contextLView = null), e);
}
function et() {
    let e = Rm();
    for (; e !== null && e.type === 64; ) e = e.parent;
    return e;
}
function Rm() {
    return U.lFrame.currentTNode;
}
function No() {
    let e = U.lFrame,
        n = e.currentTNode;
    return e.isParent ? n : n.parent;
}
function an(e, n) {
    let t = U.lFrame;
    ((t.currentTNode = e), (t.isParent = n));
}
function Od() {
    return U.lFrame.isParent;
}
function Pd() {
    U.lFrame.isParent = !1;
}
function gS() {
    return U.lFrame.contextLView;
}
function km() {
    return wu;
}
function Oa(e) {
    let n = wu;
    return ((wu = e), n);
}
function il() {
    let e = U.lFrame,
        n = e.bindingRootIndex;
    return (
        n === -1 && (n = e.bindingRootIndex = e.tView.bindingStartIndex),
        n
    );
}
function mS(e) {
    return (U.lFrame.bindingIndex = e);
}
function ol() {
    return U.lFrame.bindingIndex++;
}
function Lm(e) {
    let n = U.lFrame,
        t = n.bindingIndex;
    return ((n.bindingIndex = n.bindingIndex + e), t);
}
function _S() {
    return U.lFrame.inI18n;
}
function Fm(e) {
    U.lFrame.inI18n = e;
}
function yS(e, n) {
    let t = U.lFrame;
    ((t.bindingIndex = t.bindingRootIndex = e), Du(n));
}
function vS() {
    return U.lFrame.currentDirectiveIndex;
}
function Du(e) {
    U.lFrame.currentDirectiveIndex = e;
}
function bS(e) {
    let n = U.lFrame.currentDirectiveIndex;
    return n === -1 ? null : e[n];
}
function $m() {
    return U.lFrame.currentQueryIndex;
}
function Nd(e) {
    U.lFrame.currentQueryIndex = e;
}
function CS(e) {
    let n = e[z];
    return n.type === 2 ? n.declTNode : n.type === 1 ? e[Je] : null;
}
function Vm(e, n, t) {
    if (t & B.SkipSelf) {
        let i = n,
            o = e;
        for (; (i = i.parent), i === null && !(t & B.Host); )
            if (((i = CS(o)), i === null || ((o = o[Mi]), i.type & 10))) break;
        if (i === null) return !1;
        ((n = i), (e = o));
    }
    let r = (U.lFrame = jm());
    return ((r.currentTNode = n), (r.lView = e), !0);
}
function Ad(e) {
    let n = jm(),
        t = e[z];
    ((U.lFrame = n),
        (n.currentTNode = t.firstChild),
        (n.lView = e),
        (n.tView = t),
        (n.contextLView = e),
        (n.bindingIndex = t.bindingStartIndex),
        (n.inI18n = !1));
}
function jm() {
    let e = U.lFrame,
        n = e === null ? null : e.child;
    return n === null ? Bm(e) : n;
}
function Bm(e) {
    let n = {
        currentTNode: null,
        isParent: !0,
        lView: null,
        tView: null,
        selectedIndex: -1,
        contextLView: null,
        elementDepthCount: 0,
        currentNamespace: null,
        currentDirectiveIndex: -1,
        bindingRootIndex: -1,
        bindingIndex: -1,
        currentQueryIndex: 0,
        parent: e,
        child: null,
        inI18n: !1,
    };
    return (e !== null && (e.child = n), n);
}
function Um() {
    let e = U.lFrame;
    return (
        (U.lFrame = e.parent),
        (e.currentTNode = null),
        (e.lView = null),
        e
    );
}
var Hm = Um;
function Rd() {
    let e = Um();
    ((e.isParent = !0),
        (e.tView = null),
        (e.selectedIndex = -1),
        (e.contextLView = null),
        (e.elementDepthCount = 0),
        (e.currentDirectiveIndex = -1),
        (e.currentNamespace = null),
        (e.bindingRootIndex = -1),
        (e.bindingIndex = -1),
        (e.currentQueryIndex = 0));
}
function ES(e) {
    return (U.lFrame.contextLView = aS(e, U.lFrame.contextLView))[lt];
}
function Or() {
    return U.lFrame.selectedIndex;
}
function Mr(e) {
    U.lFrame.selectedIndex = e;
}
function kd() {
    let e = U.lFrame;
    return xm(e.tView, e.selectedIndex);
}
function pn() {
    U.lFrame.currentNamespace = Im;
}
function SS() {
    return U.lFrame.currentNamespace;
}
var zm = !0;
function Vo() {
    return zm;
}
function jo(e) {
    zm = e;
}
function wS(e, n, t) {
    let { ngOnChanges: r, ngOnInit: i, ngDoCheck: o } = n.type.prototype;
    if (r) {
        let s = wm(n);
        ((t.preOrderHooks ??= []).push(e, s),
            (t.preOrderCheckHooks ??= []).push(e, s));
    }
    (i && (t.preOrderHooks ??= []).push(0 - e, i),
        o &&
            ((t.preOrderHooks ??= []).push(e, o),
            (t.preOrderCheckHooks ??= []).push(e, o)));
}
function Ld(e, n) {
    for (let t = n.directiveStart, r = n.directiveEnd; t < r; t++) {
        let o = e.data[t].type.prototype,
            {
                ngAfterContentInit: s,
                ngAfterContentChecked: a,
                ngAfterViewInit: l,
                ngAfterViewChecked: c,
                ngOnDestroy: u,
            } = o;
        (s && (e.contentHooks ??= []).push(-t, s),
            a &&
                ((e.contentHooks ??= []).push(t, a),
                (e.contentCheckHooks ??= []).push(t, a)),
            l && (e.viewHooks ??= []).push(-t, l),
            c &&
                ((e.viewHooks ??= []).push(t, c),
                (e.viewCheckHooks ??= []).push(t, c)),
            u != null && (e.destroyHooks ??= []).push(t, u));
    }
}
function ya(e, n, t) {
    Wm(e, n, 3, t);
}
function va(e, n, t, r) {
    (e[L] & 3) === t && Wm(e, n, t, r);
}
function iu(e, n) {
    let t = e[L];
    (t & 3) === n && ((t &= 16383), (t += 1), (e[L] = t));
}
function Wm(e, n, t, r) {
    let i = r !== void 0 ? e[di] & 65535 : 0,
        o = r ?? -1,
        s = n.length - 1,
        a = 0;
    for (let l = i; l < s; l++)
        if (typeof n[l + 1] == "number") {
            if (((a = n[l]), r != null && a >= r)) break;
        } else
            (n[l] < 0 && (e[di] += 65536),
                (a < o || o == -1) &&
                    (DS(e, t, n, l), (e[di] = (e[di] & 4294901760) + l + 2)),
                l++);
}
function hg(e, n) {
    fe(4, e, n);
    let t = Y(null);
    try {
        n.call(e);
    } finally {
        (Y(t), fe(5, e, n));
    }
}
function DS(e, n, t, r) {
    let i = t[r] < 0,
        o = t[r + 1],
        s = i ? -t[r] : t[r],
        a = e[s];
    i
        ? e[L] >> 14 < e[di] >> 16 &&
          (e[L] & 3) === n &&
          ((e[L] += 16384), hg(a, o))
        : hg(a, o);
}
var gi = -1,
    Ir = class {
        factory;
        injectImpl;
        resolving = !1;
        canSeeViewProviders;
        multi;
        componentProviders;
        index;
        providerFactory;
        constructor(n, t, r) {
            ((this.factory = n),
                (this.canSeeViewProviders = t),
                (this.injectImpl = r));
        }
    };
function MS(e) {
    return (e.flags & 8) !== 0;
}
function IS(e) {
    return (e.flags & 16) !== 0;
}
function TS(e, n, t) {
    let r = 0;
    for (; r < t.length; ) {
        let i = t[r];
        if (typeof i == "number") {
            if (i !== 0) break;
            r++;
            let o = t[r++],
                s = t[r++],
                a = t[r++];
            e.setAttribute(n, s, a, o);
        } else {
            let o = i,
                s = t[++r];
            (OS(o) ? e.setProperty(n, o, s) : e.setAttribute(n, o, s), r++);
        }
    }
    return r;
}
function xS(e) {
    return e === 3 || e === 4 || e === 6;
}
function OS(e) {
    return e.charCodeAt(0) === 64;
}
function bi(e, n) {
    if (!(n === null || n.length === 0))
        if (e === null || e.length === 0) e = n.slice();
        else {
            let t = -1;
            for (let r = 0; r < n.length; r++) {
                let i = n[r];
                typeof i == "number"
                    ? (t = i)
                    : t === 0 ||
                      (t === -1 || t === 2
                          ? gg(e, t, i, null, n[++r])
                          : gg(e, t, i, null, null));
            }
        }
    return e;
}
function gg(e, n, t, r, i) {
    let o = 0,
        s = e.length;
    if (n === -1) s = -1;
    else
        for (; o < e.length; ) {
            let a = e[o++];
            if (typeof a == "number") {
                if (a === n) {
                    s = -1;
                    break;
                } else if (a > n) {
                    s = o - 1;
                    break;
                }
            }
        }
    for (; o < e.length; ) {
        let a = e[o];
        if (typeof a == "number") break;
        if (a === t) {
            i !== null && (e[o + 1] = i);
            return;
        }
        (o++, i !== null && o++);
    }
    (s !== -1 && (e.splice(s, 0, n), (o = s + 1)),
        e.splice(o++, 0, t),
        i !== null && e.splice(o++, 0, i));
}
function qm(e) {
    return e !== gi;
}
function Pa(e) {
    return e & 32767;
}
function PS(e) {
    return e >> 16;
}
function Na(e, n) {
    let t = PS(e),
        r = n;
    for (; t > 0; ) ((r = r[Mi]), t--);
    return r;
}
var Mu = !0;
function mg(e) {
    let n = Mu;
    return ((Mu = e), n);
}
var NS = 256,
    Gm = NS - 1,
    Ym = 5,
    AS = 0,
    rn = {};
function RS(e, n, t) {
    let r;
    (typeof t == "string"
        ? (r = t.charCodeAt(0) || 0)
        : t.hasOwnProperty(Mo) && (r = t[Mo]),
        r == null && (r = t[Mo] = AS++));
    let i = r & Gm,
        o = 1 << i;
    n.data[e + (i >> Ym)] |= o;
}
function Aa(e, n) {
    let t = Km(e, n);
    if (t !== -1) return t;
    let r = n[z];
    r.firstCreatePass &&
        ((e.injectorIndex = n.length),
        ou(r.data, e),
        ou(n, null),
        ou(r.blueprint, null));
    let i = Fd(e, n),
        o = e.injectorIndex;
    if (qm(i)) {
        let s = Pa(i),
            a = Na(i, n),
            l = a[z].data;
        for (let c = 0; c < 8; c++) n[o + c] = a[s + c] | l[s + c];
    }
    return ((n[o + 8] = i), o);
}
function ou(e, n) {
    e.push(0, 0, 0, 0, 0, 0, 0, 0, n);
}
function Km(e, n) {
    return e.injectorIndex === -1 ||
        (e.parent && e.parent.injectorIndex === e.injectorIndex) ||
        n[e.injectorIndex + 8] === null
        ? -1
        : e.injectorIndex;
}
function Fd(e, n) {
    if (e.parent && e.parent.injectorIndex !== -1)
        return e.parent.injectorIndex;
    let t = 0,
        r = null,
        i = n;
    for (; i !== null; ) {
        if (((r = e_(i)), r === null)) return gi;
        if ((t++, (i = i[Mi]), r.injectorIndex !== -1))
            return r.injectorIndex | (t << 16);
    }
    return gi;
}
function Iu(e, n, t) {
    RS(e, n, t);
}
function Qm(e, n, t) {
    if (t & B.Optional || e !== void 0) return e;
    bd(n, "NodeInjector");
}
function Zm(e, n, t, r) {
    if (
        (t & B.Optional && r === void 0 && (r = null),
        (t & (B.Self | B.Host)) === 0)
    ) {
        let i = e[yi],
            o = Ot(void 0);
        try {
            return i ? i.get(n, r, t & B.Optional) : lm(n, r, t & B.Optional);
        } finally {
            Ot(o);
        }
    }
    return Qm(r, n, t);
}
function Xm(e, n, t, r = B.Default, i) {
    if (e !== null) {
        if (n[L] & 2048 && !(r & B.Self)) {
            let s = $S(e, n, t, r, rn);
            if (s !== rn) return s;
        }
        let o = Jm(e, n, t, r, rn);
        if (o !== rn) return o;
    }
    return Zm(n, t, r, i);
}
function Jm(e, n, t, r, i) {
    let o = LS(t);
    if (typeof o == "function") {
        if (!Vm(n, e, r)) return r & B.Host ? Qm(i, t, r) : Zm(n, t, r, i);
        try {
            let s;
            if (((s = o(r)), s == null && !(r & B.Optional))) bd(t);
            else return s;
        } finally {
            Hm();
        }
    } else if (typeof o == "number") {
        let s = null,
            a = Km(e, n),
            l = gi,
            c = r & B.Host ? n[bt][Je] : null;
        for (
            (a === -1 || r & B.SkipSelf) &&
            ((l = a === -1 ? Fd(e, n) : n[a + 8]),
            l === gi || !yg(r, !1)
                ? (a = -1)
                : ((s = n[z]), (a = Pa(l)), (n = Na(l, n))));
            a !== -1;
        ) {
            let u = n[z];
            if (_g(o, a, u.data)) {
                let d = kS(a, n, t, s, r, c);
                if (d !== rn) return d;
            }
            ((l = n[a + 8]),
                l !== gi && yg(r, n[z].data[a + 8] === c) && _g(o, a, n)
                    ? ((s = u), (a = Pa(l)), (n = Na(l, n)))
                    : (a = -1));
        }
    }
    return i;
}
function kS(e, n, t, r, i, o) {
    let s = n[z],
        a = s.data[e + 8],
        l = r == null ? Ii(a) && Mu : r != s && (a.type & 3) !== 0,
        c = i & B.Host && o === a,
        u = ba(a, s, t, l, c);
    return u !== null ? Ao(n, s, u, a, i) : rn;
}
function ba(e, n, t, r, i) {
    let o = e.providerIndexes,
        s = n.data,
        a = o & 1048575,
        l = e.directiveStart,
        c = e.directiveEnd,
        u = o >> 20,
        d = r ? a : a + u,
        p = i ? a + u : c;
    for (let f = d; f < p; f++) {
        let h = s[f];
        if ((f < l && t === h) || (f >= l && h.type === t)) return f;
    }
    if (i) {
        let f = s[l];
        if (f && on(f) && f.type === t) return l;
    }
    return null;
}
function Ao(e, n, t, r, i) {
    let o = e[t],
        s = n.data;
    if (o instanceof Ir) {
        let a = o;
        a.resolving && sm(ME(s[t]));
        let l = mg(a.canSeeViewProviders);
        a.resolving = !0;
        let c,
            u = a.injectImpl ? Ot(a.injectImpl) : null,
            d = Vm(e, r, B.Default);
        try {
            ((o = e[t] = a.factory(void 0, i, s, e, r)),
                n.firstCreatePass && t >= r.directiveStart && wS(t, s[t], n));
        } finally {
            (u !== null && Ot(u), mg(l), (a.resolving = !1), Hm());
        }
    }
    return o;
}
function LS(e) {
    if (typeof e == "string") return e.charCodeAt(0) || 0;
    let n = e.hasOwnProperty(Mo) ? e[Mo] : void 0;
    return typeof n == "number" ? (n >= 0 ? n & Gm : FS) : n;
}
function _g(e, n, t) {
    let r = 1 << e;
    return !!(t[n + (e >> Ym)] & r);
}
function yg(e, n) {
    return !(e & B.Self) && !(e & B.Host && n);
}
var yr = class {
    _tNode;
    _lView;
    constructor(n, t) {
        ((this._tNode = n), (this._lView = t));
    }
    get(n, t, r) {
        return Xm(this._tNode, this._lView, n, Za(r), t);
    }
};
function FS() {
    return new yr(et(), q());
}
function te(e) {
    return Fo(() => {
        let n = e.prototype.constructor,
            t = n[Ea] || Tu(n),
            r = Object.prototype,
            i = Object.getPrototypeOf(e.prototype).constructor;
        for (; i && i !== r; ) {
            let o = i[Ea] || Tu(i);
            if (o && o !== t) return o;
            i = Object.getPrototypeOf(i);
        }
        return (o) => new o();
    });
}
function Tu(e) {
    return tm(e)
        ? () => {
              let n = Tu(Qe(e));
              return n && n();
          }
        : mi(e);
}
function $S(e, n, t, r, i) {
    let o = e,
        s = n;
    for (; o !== null && s !== null && s[L] & 2048 && !xa(s); ) {
        let a = Jm(o, s, t, r | B.Self, rn);
        if (a !== rn) return a;
        let l = o.parent;
        if (!l) {
            let c = s[Cm];
            if (c) {
                let u = c.get(t, rn, r);
                if (u !== rn) return u;
            }
            ((l = e_(s)), (s = s[Mi]));
        }
        o = l;
    }
    return i;
}
function e_(e) {
    let n = e[z],
        t = n.type;
    return t === 2 ? n.declTNode : t === 1 ? e[Je] : null;
}
function vg(e, n = null, t = null, r) {
    let i = t_(e, n, t, r);
    return (i.resolveInjectorInitializers(), i);
}
function t_(e, n = null, t = null, r, i = new Set()) {
    let o = [t || Ze, UE(e)];
    return (
        (r = r || (typeof e == "object" ? void 0 : st(e))),
        new xo(o, n || Sd(), r || null, i)
    );
}
var We = class e {
    static THROW_IF_NOT_FOUND = _r;
    static NULL = new Ma();
    static create(n, t) {
        if (Array.isArray(n)) return vg({ name: "" }, t, n, "");
        {
            let r = n.name ?? "";
            return vg({ name: r }, n.parent, n.providers, r);
        }
    }
    static ɵprov = w({ token: e, providedIn: "any", factory: () => N(pm) });
    static __NG_ELEMENT_ID__ = -1;
};
var VS = new O("");
VS.__NG_ELEMENT_ID__ = (e) => {
    let n = et();
    if (n === null) throw new S(204, !1);
    if (n.type & 2) return n.value;
    if (e & B.Optional) return null;
    throw new S(204, !1);
};
var n_ = !1,
    Pr = (() => {
        class e {
            static __NG_ELEMENT_ID__ = jS;
            static __NG_ENV_ID__ = (t) => t;
        }
        return e;
    })(),
    Ra = class extends Pr {
        _lView;
        constructor(n) {
            (super(), (this._lView = n));
        }
        onDestroy(n) {
            let t = this._lView;
            return Ti(t) ? (n(), () => {}) : (Nm(t, n), () => lS(t, n));
        }
    };
function jS() {
    return new Ra(q());
}
var Tr = class {},
    r_ = new O("", { providedIn: "root", factory: () => !1 });
var i_ = new O(""),
    o_ = new O(""),
    Oi = (() => {
        class e {
            taskId = 0;
            pendingTasks = new Set();
            get _hasPendingTasks() {
                return this.hasPendingTasks.value;
            }
            hasPendingTasks = new je(!1);
            add() {
                this._hasPendingTasks || this.hasPendingTasks.next(!0);
                let t = this.taskId++;
                return (this.pendingTasks.add(t), t);
            }
            has(t) {
                return this.pendingTasks.has(t);
            }
            remove(t) {
                (this.pendingTasks.delete(t),
                    this.pendingTasks.size === 0 &&
                        this._hasPendingTasks &&
                        this.hasPendingTasks.next(!1));
            }
            ngOnDestroy() {
                (this.pendingTasks.clear(),
                    this._hasPendingTasks && this.hasPendingTasks.next(!1));
            }
            static ɵprov = w({
                token: e,
                providedIn: "root",
                factory: () => new e(),
            });
        }
        return e;
    })();
var xu = class extends Te {
        __isAsync;
        destroyRef = void 0;
        pendingTasks = void 0;
        constructor(n = !1) {
            (super(),
                (this.__isAsync = n),
                wd() &&
                    ((this.destroyRef = y(Pr, { optional: !0 }) ?? void 0),
                    (this.pendingTasks = y(Oi, { optional: !0 }) ?? void 0)));
        }
        emit(n) {
            let t = Y(null);
            try {
                super.next(n);
            } finally {
                Y(t);
            }
        }
        subscribe(n, t, r) {
            let i = n,
                o = t || (() => null),
                s = r;
            if (n && typeof n == "object") {
                let l = n;
                ((i = l.next?.bind(l)),
                    (o = l.error?.bind(l)),
                    (s = l.complete?.bind(l)));
            }
            this.__isAsync &&
                ((o = this.wrapInTimeout(o)),
                i && (i = this.wrapInTimeout(i)),
                s && (s = this.wrapInTimeout(s)));
            let a = super.subscribe({ next: i, error: o, complete: s });
            return (n instanceof Ie && n.add(a), a);
        }
        wrapInTimeout(n) {
            return (t) => {
                let r = this.pendingTasks?.add();
                setTimeout(() => {
                    try {
                        n(t);
                    } finally {
                        r !== void 0 && this.pendingTasks?.remove(r);
                    }
                });
            };
        }
    },
    pe = xu;
function Ro(...e) {}
function s_(e) {
    let n, t;
    function r() {
        e = Ro;
        try {
            (t !== void 0 &&
                typeof cancelAnimationFrame == "function" &&
                cancelAnimationFrame(t),
                n !== void 0 && clearTimeout(n));
        } catch {}
    }
    return (
        (n = setTimeout(() => {
            (e(), r());
        })),
        typeof requestAnimationFrame == "function" &&
            (t = requestAnimationFrame(() => {
                (e(), r());
            })),
        () => r()
    );
}
function bg(e) {
    return (
        queueMicrotask(() => e()),
        () => {
            e = Ro;
        }
    );
}
var $d = "isAngularZone",
    ka = $d + "_ID",
    BS = 0,
    ne = class e {
        hasPendingMacrotasks = !1;
        hasPendingMicrotasks = !1;
        isStable = !0;
        onUnstable = new pe(!1);
        onMicrotaskEmpty = new pe(!1);
        onStable = new pe(!1);
        onError = new pe(!1);
        constructor(n) {
            let {
                enableLongStackTrace: t = !1,
                shouldCoalesceEventChangeDetection: r = !1,
                shouldCoalesceRunChangeDetection: i = !1,
                scheduleInRootZone: o = n_,
            } = n;
            if (typeof Zone > "u") throw new S(908, !1);
            Zone.assertZonePatched();
            let s = this;
            ((s._nesting = 0),
                (s._outer = s._inner = Zone.current),
                Zone.TaskTrackingZoneSpec &&
                    (s._inner = s._inner.fork(new Zone.TaskTrackingZoneSpec())),
                t &&
                    Zone.longStackTraceZoneSpec &&
                    (s._inner = s._inner.fork(Zone.longStackTraceZoneSpec)),
                (s.shouldCoalesceEventChangeDetection = !i && r),
                (s.shouldCoalesceRunChangeDetection = i),
                (s.callbackScheduled = !1),
                (s.scheduleInRootZone = o),
                zS(s));
        }
        static isInAngularZone() {
            return typeof Zone < "u" && Zone.current.get($d) === !0;
        }
        static assertInAngularZone() {
            if (!e.isInAngularZone()) throw new S(909, !1);
        }
        static assertNotInAngularZone() {
            if (e.isInAngularZone()) throw new S(909, !1);
        }
        run(n, t, r) {
            return this._inner.run(n, t, r);
        }
        runTask(n, t, r, i) {
            let o = this._inner,
                s = o.scheduleEventTask("NgZoneEvent: " + i, n, US, Ro, Ro);
            try {
                return o.runTask(s, t, r);
            } finally {
                o.cancelTask(s);
            }
        }
        runGuarded(n, t, r) {
            return this._inner.runGuarded(n, t, r);
        }
        runOutsideAngular(n) {
            return this._outer.run(n);
        }
    },
    US = {};
function Vd(e) {
    if (e._nesting == 0 && !e.hasPendingMicrotasks && !e.isStable)
        try {
            (e._nesting++, e.onMicrotaskEmpty.emit(null));
        } finally {
            if ((e._nesting--, !e.hasPendingMicrotasks))
                try {
                    e.runOutsideAngular(() => e.onStable.emit(null));
                } finally {
                    e.isStable = !0;
                }
        }
}
function HS(e) {
    if (e.isCheckStableRunning || e.callbackScheduled) return;
    e.callbackScheduled = !0;
    function n() {
        s_(() => {
            ((e.callbackScheduled = !1),
                Ou(e),
                (e.isCheckStableRunning = !0),
                Vd(e),
                (e.isCheckStableRunning = !1));
        });
    }
    (e.scheduleInRootZone
        ? Zone.root.run(() => {
              n();
          })
        : e._outer.run(() => {
              n();
          }),
        Ou(e));
}
function zS(e) {
    let n = () => {
            HS(e);
        },
        t = BS++;
    e._inner = e._inner.fork({
        name: "angular",
        properties: { [$d]: !0, [ka]: t, [ka + t]: !0 },
        onInvokeTask: (r, i, o, s, a, l) => {
            if (WS(l)) return r.invokeTask(o, s, a, l);
            try {
                return (Cg(e), r.invokeTask(o, s, a, l));
            } finally {
                (((e.shouldCoalesceEventChangeDetection &&
                    s.type === "eventTask") ||
                    e.shouldCoalesceRunChangeDetection) &&
                    n(),
                    Eg(e));
            }
        },
        onInvoke: (r, i, o, s, a, l, c) => {
            try {
                return (Cg(e), r.invoke(o, s, a, l, c));
            } finally {
                (e.shouldCoalesceRunChangeDetection &&
                    !e.callbackScheduled &&
                    !qS(l) &&
                    n(),
                    Eg(e));
            }
        },
        onHasTask: (r, i, o, s) => {
            (r.hasTask(o, s),
                i === o &&
                    (s.change == "microTask"
                        ? ((e._hasPendingMicrotasks = s.microTask),
                          Ou(e),
                          Vd(e))
                        : s.change == "macroTask" &&
                          (e.hasPendingMacrotasks = s.macroTask)));
        },
        onHandleError: (r, i, o, s) => (
            r.handleError(o, s),
            e.runOutsideAngular(() => e.onError.emit(s)),
            !1
        ),
    });
}
function Ou(e) {
    e._hasPendingMicrotasks ||
    ((e.shouldCoalesceEventChangeDetection ||
        e.shouldCoalesceRunChangeDetection) &&
        e.callbackScheduled === !0)
        ? (e.hasPendingMicrotasks = !0)
        : (e.hasPendingMicrotasks = !1);
}
function Cg(e) {
    (e._nesting++, e.isStable && ((e.isStable = !1), e.onUnstable.emit(null)));
}
function Eg(e) {
    (e._nesting--, Vd(e));
}
var La = class {
    hasPendingMicrotasks = !1;
    hasPendingMacrotasks = !1;
    isStable = !0;
    onUnstable = new pe();
    onMicrotaskEmpty = new pe();
    onStable = new pe();
    onError = new pe();
    run(n, t, r) {
        return n.apply(t, r);
    }
    runGuarded(n, t, r) {
        return n.apply(t, r);
    }
    runOutsideAngular(n) {
        return n();
    }
    runTask(n, t, r, i) {
        return n.apply(t, r);
    }
};
function WS(e) {
    return a_(e, "__ignore_ng_zone__");
}
function qS(e) {
    return a_(e, "__scheduler_tick__");
}
function a_(e, n) {
    return !Array.isArray(e) || e.length !== 1 ? !1 : e[0]?.data?.[n] === !0;
}
function GS(e = "zone.js", n) {
    return e === "noop" ? new La() : e === "zone.js" ? new ne(n) : e;
}
var ln = class {
        _console = console;
        handleError(n) {
            this._console.error("ERROR", n);
        }
    },
    YS = new O("", {
        providedIn: "root",
        factory: () => {
            let e = y(ne),
                n = y(ln);
            return (t) => e.runOutsideAngular(() => n.handleError(t));
        },
    });
function Sg(e, n) {
    return Xg(e, n);
}
function KS(e) {
    return Xg(Zg, e);
}
var hn = ((Sg.required = KS), Sg);
function QS() {
    return Pi(et(), q());
}
function Pi(e, n) {
    return new tt(fn(e, n));
}
var tt = (() => {
    class e {
        nativeElement;
        constructor(t) {
            this.nativeElement = t;
        }
        static __NG_ELEMENT_ID__ = QS;
    }
    return e;
})();
function ZS(e) {
    return e instanceof tt ? e.nativeElement : e;
}
function XS(e) {
    return typeof e == "function" && e[Tt] !== void 0;
}
function Nr(e, n) {
    let t = Fc(e, n?.equal),
        r = t[Tt];
    return (
        (t.set = (i) => _o(r, i)),
        (t.update = (i) => $c(r, i)),
        (t.asReadonly = JS.bind(t)),
        t
    );
}
function JS() {
    let e = this[Tt];
    if (e.readonlyFn === void 0) {
        let n = () => this();
        ((n[Tt] = e), (e.readonlyFn = n));
    }
    return e.readonlyFn;
}
function l_(e) {
    return XS(e) && typeof e.set == "function";
}
function ew() {
    return this._results[Symbol.iterator]();
}
var Pu = class {
    _emitDistinctChangesOnly;
    dirty = !0;
    _onDirty = void 0;
    _results = [];
    _changesDetected = !1;
    _changes = void 0;
    length = 0;
    first = void 0;
    last = void 0;
    get changes() {
        return (this._changes ??= new Te());
    }
    constructor(n = !1) {
        this._emitDistinctChangesOnly = n;
    }
    get(n) {
        return this._results[n];
    }
    map(n) {
        return this._results.map(n);
    }
    filter(n) {
        return this._results.filter(n);
    }
    find(n) {
        return this._results.find(n);
    }
    reduce(n, t) {
        return this._results.reduce(n, t);
    }
    forEach(n) {
        this._results.forEach(n);
    }
    some(n) {
        return this._results.some(n);
    }
    toArray() {
        return this._results.slice();
    }
    toString() {
        return this._results.toString();
    }
    reset(n, t) {
        this.dirty = !1;
        let r = LE(n);
        (this._changesDetected = !kE(this._results, r, t)) &&
            ((this._results = r),
            (this.length = r.length),
            (this.last = r[this.length - 1]),
            (this.first = r[0]));
    }
    notifyOnChanges() {
        this._changes !== void 0 &&
            (this._changesDetected || !this._emitDistinctChangesOnly) &&
            this._changes.next(this);
    }
    onDirty(n) {
        this._onDirty = n;
    }
    setDirty() {
        ((this.dirty = !0), this._onDirty?.());
    }
    destroy() {
        this._changes !== void 0 &&
            (this._changes.complete(), this._changes.unsubscribe());
    }
    [Symbol.iterator] = ew;
};
function c_(e) {
    return (e.flags & 128) === 128;
}
var u_ = (function (e) {
        return (
            (e[(e.OnPush = 0)] = "OnPush"),
            (e[(e.Default = 1)] = "Default"),
            e
        );
    })(u_ || {}),
    d_ = new Map(),
    tw = 0;
function nw() {
    return tw++;
}
function rw(e) {
    d_.set(e[tl], e);
}
function Nu(e) {
    d_.delete(e[tl]);
}
var wg = "__ngContext__";
function Ni(e, n) {
    er(n) ? ((e[wg] = n[tl]), rw(n)) : (e[wg] = n);
}
function f_(e) {
    return h_(e[Po]);
}
function p_(e) {
    return h_(e[qt]);
}
function h_(e) {
    for (; e !== null && !Ln(e); ) e = e[qt];
    return e;
}
var Au;
function g_(e) {
    Au = e;
}
function m_() {
    if (Au !== void 0) return Au;
    if (typeof document < "u") return document;
    throw new S(210, !1);
}
var jd = new O("", { providedIn: "root", factory: () => iw }),
    iw = "ng",
    Bd = new O(""),
    ct = new O("", { providedIn: "platform", factory: () => "unknown" });
var Ud = new O(""),
    Hd = new O("", {
        providedIn: "root",
        factory: () =>
            m_()
                .body?.querySelector("[ngCspNonce]")
                ?.getAttribute("ngCspNonce") || null,
    });
var ow = "h",
    sw = "b";
var __ = !1,
    aw = new O("", { providedIn: "root", factory: () => __ });
var zd = (function (e) {
        return (
            (e[(e.CHANGE_DETECTION = 0)] = "CHANGE_DETECTION"),
            (e[(e.AFTER_NEXT_RENDER = 1)] = "AFTER_NEXT_RENDER"),
            e
        );
    })(zd || {}),
    Ai = new O(""),
    Dg = new Set();
function Ri(e) {
    Dg.has(e) ||
        (Dg.add(e),
        performance?.mark?.("mark_feature_usage", { detail: { feature: e } }));
}
var Wd = (() => {
    class e {
        view;
        node;
        constructor(t, r) {
            ((this.view = t), (this.node = r));
        }
        static __NG_ELEMENT_ID__ = lw;
    }
    return e;
})();
function lw() {
    return new Wd(q(), et());
}
var fi = (function (e) {
        return (
            (e[(e.EarlyRead = 0)] = "EarlyRead"),
            (e[(e.Write = 1)] = "Write"),
            (e[(e.MixedReadWrite = 2)] = "MixedReadWrite"),
            (e[(e.Read = 3)] = "Read"),
            e
        );
    })(fi || {}),
    y_ = (() => {
        class e {
            impl = null;
            execute() {
                this.impl?.execute();
            }
            static ɵprov = w({
                token: e,
                providedIn: "root",
                factory: () => new e(),
            });
        }
        return e;
    })(),
    cw = [fi.EarlyRead, fi.Write, fi.MixedReadWrite, fi.Read],
    uw = (() => {
        class e {
            ngZone = y(ne);
            scheduler = y(Tr);
            errorHandler = y(ln, { optional: !0 });
            sequences = new Set();
            deferredRegistrations = new Set();
            executing = !1;
            constructor() {
                y(Ai, { optional: !0 });
            }
            execute() {
                let t = this.sequences.size > 0;
                (t && fe(16), (this.executing = !0));
                for (let r of cw)
                    for (let i of this.sequences)
                        if (!(i.erroredOrDestroyed || !i.hooks[r]))
                            try {
                                i.pipelinedValue =
                                    this.ngZone.runOutsideAngular(() =>
                                        this.maybeTrace(() => {
                                            let o = i.hooks[r];
                                            return o(i.pipelinedValue);
                                        }, i.snapshot)
                                    );
                            } catch (o) {
                                ((i.erroredOrDestroyed = !0),
                                    this.errorHandler?.handleError(o));
                            }
                this.executing = !1;
                for (let r of this.sequences)
                    (r.afterRun(),
                        r.once && (this.sequences.delete(r), r.destroy()));
                for (let r of this.deferredRegistrations) this.sequences.add(r);
                (this.deferredRegistrations.size > 0 &&
                    this.scheduler.notify(7),
                    this.deferredRegistrations.clear(),
                    t && fe(17));
            }
            register(t) {
                let { view: r } = t;
                r !== void 0
                    ? ((r[hi] ??= []).push(t), xi(r), (r[L] |= 8192))
                    : this.executing
                      ? this.deferredRegistrations.add(t)
                      : this.addSequence(t);
            }
            addSequence(t) {
                (this.sequences.add(t), this.scheduler.notify(7));
            }
            unregister(t) {
                this.executing && this.sequences.has(t)
                    ? ((t.erroredOrDestroyed = !0),
                      (t.pipelinedValue = void 0),
                      (t.once = !0))
                    : (this.sequences.delete(t),
                      this.deferredRegistrations.delete(t));
            }
            maybeTrace(t, r) {
                return r ? r.run(zd.AFTER_NEXT_RENDER, t) : t();
            }
            static ɵprov = w({
                token: e,
                providedIn: "root",
                factory: () => new e(),
            });
        }
        return e;
    })(),
    Ru = class {
        impl;
        hooks;
        view;
        once;
        snapshot;
        erroredOrDestroyed = !1;
        pipelinedValue = void 0;
        unregisterOnDestroy;
        constructor(n, t, r, i, o, s = null) {
            ((this.impl = n),
                (this.hooks = t),
                (this.view = r),
                (this.once = i),
                (this.snapshot = s),
                (this.unregisterOnDestroy = o?.onDestroy(() =>
                    this.destroy()
                )));
        }
        afterRun() {
            ((this.erroredOrDestroyed = !1),
                (this.pipelinedValue = void 0),
                this.snapshot?.dispose(),
                (this.snapshot = null));
        }
        destroy() {
            (this.impl.unregister(this), this.unregisterOnDestroy?.());
            let n = this.view?.[hi];
            n && (this.view[hi] = n.filter((t) => t !== this));
        }
    };
function qd(e, n) {
    !n?.injector && bm(qd);
    let t = n?.injector ?? y(We);
    return (Ri("NgAfterNextRender"), fw(e, t, n, !0));
}
function dw(e, n) {
    if (e instanceof Function) {
        let t = [void 0, void 0, void 0, void 0];
        return ((t[n] = e), t);
    } else return [e.earlyRead, e.write, e.mixedReadWrite, e.read];
}
function fw(e, n, t, r) {
    let i = n.get(y_);
    i.impl ??= n.get(uw);
    let o = n.get(Ai, null, { optional: !0 }),
        s = t?.phase ?? fi.MixedReadWrite,
        a = t?.manualCleanup !== !0 ? n.get(Pr) : null,
        l = n.get(Wd, null, { optional: !0 }),
        c = new Ru(i.impl, dw(e, s), l?.view, r, a, o?.snapshot(null));
    return (i.impl.register(c), c);
}
var pw = (e, n, t, r) => {};
function hw(e, n, t, r) {
    pw(e, n, t, r);
}
var gw = () => null;
function v_(e, n, t = !1) {
    return gw(e, n, t);
}
function b_(e, n) {
    let t = e.contentQueries;
    if (t !== null) {
        let r = Y(null);
        try {
            for (let i = 0; i < t.length; i += 2) {
                let o = t[i],
                    s = t[i + 1];
                if (s !== -1) {
                    let a = e.data[s];
                    (Nd(o), a.contentQueries(2, n[s], s));
                }
            }
        } finally {
            Y(r);
        }
    }
}
function ku(e, n, t) {
    Nd(0);
    let r = Y(null);
    try {
        n(e, t);
    } finally {
        Y(r);
    }
}
function Gd(e, n, t) {
    if (Dd(n)) {
        let r = Y(null);
        try {
            let i = n.directiveStart,
                o = n.directiveEnd;
            for (let s = i; s < o; s++) {
                let a = e.data[s];
                if (a.contentQueries) {
                    let l = t[s];
                    a.contentQueries(1, l, s);
                }
            }
        } finally {
            Y(r);
        }
    }
}
var cn = (function (e) {
    return (
        (e[(e.Emulated = 0)] = "Emulated"),
        (e[(e.None = 2)] = "None"),
        (e[(e.ShadowDom = 3)] = "ShadowDom"),
        e
    );
})(cn || {});
var ha;
function mw() {
    if (ha === void 0 && ((ha = null), Gt.trustedTypes))
        try {
            ha = Gt.trustedTypes.createPolicy("angular", {
                createHTML: (e) => e,
                createScript: (e) => e,
                createScriptURL: (e) => e,
            });
        } catch {}
    return ha;
}
function Yd(e) {
    return mw()?.createHTML(e) || e;
}
var Fa = class {
    changingThisBreaksApplicationSecurity;
    constructor(n) {
        this.changingThisBreaksApplicationSecurity = n;
    }
    toString() {
        return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${Kg})`;
    }
};
function Bo(e) {
    return e instanceof Fa ? e.changingThisBreaksApplicationSecurity : e;
}
function _w(e, n) {
    let t = yw(e);
    if (t != null && t !== n) {
        if (t === "ResourceURL" && n === "URL") return !0;
        throw new Error(`Required a safe ${n}, got a ${t} (see ${Kg})`);
    }
    return t === n;
}
function yw(e) {
    return (e instanceof Fa && e.getTypeName()) || null;
}
function vw(e) {
    let n = new Fu(e);
    return bw() ? new Lu(n) : n;
}
var Lu = class {
        inertDocumentHelper;
        constructor(n) {
            this.inertDocumentHelper = n;
        }
        getInertBodyElement(n) {
            n = "<body><remove></remove>" + n;
            try {
                let t = new window.DOMParser().parseFromString(
                    Yd(n),
                    "text/html"
                ).body;
                return t === null
                    ? this.inertDocumentHelper.getInertBodyElement(n)
                    : (t.firstChild?.remove(), t);
            } catch {
                return null;
            }
        }
    },
    Fu = class {
        defaultDoc;
        inertDocument;
        constructor(n) {
            ((this.defaultDoc = n),
                (this.inertDocument =
                    this.defaultDoc.implementation.createHTMLDocument(
                        "sanitization-inert"
                    )));
        }
        getInertBodyElement(n) {
            let t = this.inertDocument.createElement("template");
            return ((t.innerHTML = Yd(n)), t);
        }
    };
function bw() {
    try {
        return !!new window.DOMParser().parseFromString(Yd(""), "text/html");
    } catch {
        return !1;
    }
}
var Cw = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i;
function C_(e) {
    return ((e = String(e)), e.match(Cw) ? e : "unsafe:" + e);
}
function Vn(e) {
    let n = {};
    for (let t of e.split(",")) n[t] = !0;
    return n;
}
function ki(...e) {
    let n = {};
    for (let t of e) for (let r in t) t.hasOwnProperty(r) && (n[r] = !0);
    return n;
}
var Ew = Vn("area,br,col,hr,img,wbr"),
    E_ = Vn("colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr"),
    S_ = Vn("rp,rt"),
    Sw = ki(S_, E_),
    ww = ki(
        E_,
        Vn(
            "address,article,aside,blockquote,caption,center,del,details,dialog,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5,h6,header,hgroup,hr,ins,main,map,menu,nav,ol,pre,section,summary,table,ul"
        )
    ),
    Dw = ki(
        S_,
        Vn(
            "a,abbr,acronym,audio,b,bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,picture,q,ruby,rp,rt,s,samp,small,source,span,strike,strong,sub,sup,time,track,tt,u,var,video"
        )
    ),
    Mw = ki(Ew, ww, Dw, Sw),
    w_ = Vn("background,cite,href,itemtype,longdesc,poster,src,xlink:href"),
    Iw = Vn(
        "abbr,accesskey,align,alt,autoplay,axis,bgcolor,border,cellpadding,cellspacing,class,clear,color,cols,colspan,compact,controls,coords,datetime,default,dir,download,face,headers,height,hidden,hreflang,hspace,ismap,itemscope,itemprop,kind,label,lang,language,loop,media,muted,nohref,nowrap,open,preload,rel,rev,role,rows,rowspan,rules,scope,scrolling,shape,size,sizes,span,srclang,srcset,start,summary,tabindex,target,title,translate,type,usemap,valign,value,vspace,width"
    ),
    Tw = Vn(
        "aria-activedescendant,aria-atomic,aria-autocomplete,aria-busy,aria-checked,aria-colcount,aria-colindex,aria-colspan,aria-controls,aria-current,aria-describedby,aria-details,aria-disabled,aria-dropeffect,aria-errormessage,aria-expanded,aria-flowto,aria-grabbed,aria-haspopup,aria-hidden,aria-invalid,aria-keyshortcuts,aria-label,aria-labelledby,aria-level,aria-live,aria-modal,aria-multiline,aria-multiselectable,aria-orientation,aria-owns,aria-placeholder,aria-posinset,aria-pressed,aria-readonly,aria-relevant,aria-required,aria-roledescription,aria-rowcount,aria-rowindex,aria-rowspan,aria-selected,aria-setsize,aria-sort,aria-valuemax,aria-valuemin,aria-valuenow,aria-valuetext"
    ),
    Mg = ki(w_, Iw, Tw);
var Ig = ki(w_, Vn("action,formaction,data,codebase"));
function xw(e) {
    return "content" in e && Ow(e) ? e.content : null;
}
function Ow(e) {
    return e.nodeType === Node.ELEMENT_NODE && e.nodeName === "TEMPLATE";
}
var Pw = /^>|^->|<!--|-->|--!>|<!-$/g,
    Nw = /(<|>)/g,
    Aw = "\u200B$1\u200B";
function Rw(e) {
    return e.replace(Pw, (n) => n.replace(Nw, Aw));
}
function D_(e, n) {
    return e.createText(n);
}
function kw(e, n, t) {
    e.setValue(n, t);
}
function M_(e, n) {
    return e.createComment(Rw(n));
}
function Kd(e, n, t) {
    return e.createElement(n, t);
}
function Ci(e, n, t, r, i) {
    e.insertBefore(n, t, r, i);
}
function I_(e, n, t) {
    e.appendChild(n, t);
}
function Tg(e, n, t, r, i) {
    r !== null ? Ci(e, n, t, r, i) : I_(e, n, t);
}
function Lw(e, n, t) {
    e.removeChild(null, n, t);
}
function Fw(e, n, t) {
    e.setAttribute(n, "style", t);
}
function $w(e, n, t) {
    t === "" ? e.removeAttribute(n, "class") : e.setAttribute(n, "class", t);
}
function T_(e, n, t) {
    let { mergedAttrs: r, classes: i, styles: o } = t;
    (r !== null && TS(e, n, r),
        i !== null && $w(e, n, i),
        o !== null && Fw(e, n, o));
}
var x_ = (function (e) {
    return (
        (e[(e.NONE = 0)] = "NONE"),
        (e[(e.HTML = 1)] = "HTML"),
        (e[(e.STYLE = 2)] = "STYLE"),
        (e[(e.SCRIPT = 3)] = "SCRIPT"),
        (e[(e.URL = 4)] = "URL"),
        (e[(e.RESOURCE_URL = 5)] = "RESOURCE_URL"),
        e
    );
})(x_ || {});
function O_(e) {
    let n = Vw();
    return n ? n.sanitize(x_.URL, e) || "" : _w(e, "URL") ? Bo(e) : C_(Qa(e));
}
function Vw() {
    let e = q();
    return e && e[Nn].sanitizer;
}
function P_(e) {
    return e.ownerDocument;
}
function N_(e) {
    return e instanceof Function ? e() : e;
}
function jw(e, n, t) {
    let r = e.length;
    for (;;) {
        let i = e.indexOf(n, t);
        if (i === -1) return i;
        if (i === 0 || e.charCodeAt(i - 1) <= 32) {
            let o = n.length;
            if (i + o === r || e.charCodeAt(i + o) <= 32) return i;
        }
        t = i + 1;
    }
}
var A_ = "ng-template";
function Bw(e, n, t, r) {
    let i = 0;
    if (r) {
        for (; i < n.length && typeof n[i] == "string"; i += 2)
            if (n[i] === "class" && jw(n[i + 1].toLowerCase(), t, 0) !== -1)
                return !0;
    } else if (Qd(e)) return !1;
    if (((i = n.indexOf(1, i)), i > -1)) {
        let o;
        for (; ++i < n.length && typeof (o = n[i]) == "string"; )
            if (o.toLowerCase() === t) return !0;
    }
    return !1;
}
function Qd(e) {
    return e.type === 4 && e.value !== A_;
}
function Uw(e, n, t) {
    let r = e.type === 4 && !t ? A_ : e.value;
    return n === r;
}
function Hw(e, n, t) {
    let r = 4,
        i = e.attrs,
        o = i !== null ? qw(i) : 0,
        s = !1;
    for (let a = 0; a < n.length; a++) {
        let l = n[a];
        if (typeof l == "number") {
            if (!s && !Wt(r) && !Wt(l)) return !1;
            if (s && Wt(l)) continue;
            ((s = !1), (r = l | (r & 1)));
            continue;
        }
        if (!s)
            if (r & 4) {
                if (
                    ((r = 2 | (r & 1)),
                    (l !== "" && !Uw(e, l, t)) || (l === "" && n.length === 1))
                ) {
                    if (Wt(r)) return !1;
                    s = !0;
                }
            } else if (r & 8) {
                if (i === null || !Bw(e, i, l, t)) {
                    if (Wt(r)) return !1;
                    s = !0;
                }
            } else {
                let c = n[++a],
                    u = zw(l, i, Qd(e), t);
                if (u === -1) {
                    if (Wt(r)) return !1;
                    s = !0;
                    continue;
                }
                if (c !== "") {
                    let d;
                    if (
                        (u > o ? (d = "") : (d = i[u + 1].toLowerCase()),
                        r & 2 && c !== d)
                    ) {
                        if (Wt(r)) return !1;
                        s = !0;
                    }
                }
            }
    }
    return Wt(r) || s;
}
function Wt(e) {
    return (e & 1) === 0;
}
function zw(e, n, t, r) {
    if (n === null) return -1;
    let i = 0;
    if (r || !t) {
        let o = !1;
        for (; i < n.length; ) {
            let s = n[i];
            if (s === e) return i;
            if (s === 3 || s === 6) o = !0;
            else if (s === 1 || s === 2) {
                let a = n[++i];
                for (; typeof a == "string"; ) a = n[++i];
                continue;
            } else {
                if (s === 4) break;
                if (s === 0) {
                    i += 4;
                    continue;
                }
            }
            i += o ? 1 : 2;
        }
        return -1;
    } else return Gw(n, e);
}
function R_(e, n, t = !1) {
    for (let r = 0; r < n.length; r++) if (Hw(e, n[r], t)) return !0;
    return !1;
}
function Ww(e) {
    let n = e.attrs;
    if (n != null) {
        let t = n.indexOf(5);
        if ((t & 1) === 0) return n[t + 1];
    }
    return null;
}
function qw(e) {
    for (let n = 0; n < e.length; n++) {
        let t = e[n];
        if (xS(t)) return n;
    }
    return e.length;
}
function Gw(e, n) {
    let t = e.indexOf(4);
    if (t > -1)
        for (t++; t < e.length; ) {
            let r = e[t];
            if (typeof r == "number") return -1;
            if (r === n) return t;
            t++;
        }
    return -1;
}
function Yw(e, n) {
    e: for (let t = 0; t < n.length; t++) {
        let r = n[t];
        if (e.length === r.length) {
            for (let i = 0; i < e.length; i++) if (e[i] !== r[i]) continue e;
            return !0;
        }
    }
    return !1;
}
function xg(e, n) {
    return e ? ":not(" + n.trim() + ")" : n;
}
function Kw(e) {
    let n = e[0],
        t = 1,
        r = 2,
        i = "",
        o = !1;
    for (; t < e.length; ) {
        let s = e[t];
        if (typeof s == "string")
            if (r & 2) {
                let a = e[++t];
                i += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]";
            } else r & 8 ? (i += "." + s) : r & 4 && (i += " " + s);
        else
            (i !== "" && !Wt(s) && ((n += xg(o, i)), (i = "")),
                (r = s),
                (o = o || !Wt(r)));
        t++;
    }
    return (i !== "" && (n += xg(o, i)), n);
}
function Qw(e) {
    return e.map(Kw).join(",");
}
function Zw(e) {
    let n = [],
        t = [],
        r = 1,
        i = 2;
    for (; r < e.length; ) {
        let o = e[r];
        if (typeof o == "string")
            i === 2 ? o !== "" && n.push(o, e[++r]) : i === 8 && t.push(o);
        else {
            if (!Wt(i)) break;
            i = o;
        }
        r++;
    }
    return (t.length && n.push(1, ...t), n);
}
var gn = {};
function Zd(e, n, t, r, i, o, s, a, l, c, u) {
    let d = Xe + r,
        p = d + i,
        f = Xw(d, p),
        h = typeof c == "function" ? c() : c;
    return (f[z] = {
        type: e,
        blueprint: f,
        template: t,
        queries: null,
        viewQuery: a,
        declTNode: n,
        data: f.slice().fill(null, d),
        bindingStartIndex: d,
        expandoStartIndex: p,
        hostBindingOpCodes: null,
        firstCreatePass: !0,
        firstUpdatePass: !0,
        staticViewQueries: !1,
        staticContentQueries: !1,
        preOrderHooks: null,
        preOrderCheckHooks: null,
        contentHooks: null,
        contentCheckHooks: null,
        viewHooks: null,
        viewCheckHooks: null,
        destroyHooks: null,
        cleanup: null,
        contentQueries: null,
        components: null,
        directiveRegistry: typeof o == "function" ? o() : o,
        pipeRegistry: typeof s == "function" ? s() : s,
        firstChild: null,
        schemas: l,
        consts: h,
        incompleteFirstPass: !1,
        ssrId: u,
    });
}
function Xw(e, n) {
    let t = [];
    for (let r = 0; r < n; r++) t.push(r < e ? null : gn);
    return t;
}
function Jw(e) {
    let n = e.tView;
    return n === null || n.incompleteFirstPass
        ? (e.tView = Zd(
              1,
              null,
              e.template,
              e.decls,
              e.vars,
              e.directiveDefs,
              e.pipeDefs,
              e.viewQuery,
              e.schemas,
              e.consts,
              e.id
          ))
        : n;
}
function Xd(e, n, t, r, i, o, s, a, l, c, u) {
    let d = n.blueprint.slice();
    return (
        (d[kn] = i),
        (d[L] = r | 4 | 128 | 8 | 64 | 1024),
        (c !== null || (e && e[L] & 2048)) && (d[L] |= 2048),
        Om(d),
        (d[ze] = d[Mi] = e),
        (d[lt] = t),
        (d[Nn] = s || (e && e[Nn])),
        (d[_e] = a || (e && e[_e])),
        (d[yi] = l || (e && e[yi]) || null),
        (d[Je] = o),
        (d[tl] = nw()),
        (d[Oo] = u),
        (d[Cm] = c),
        (d[bt] = n.type == 2 ? e[bt] : d),
        d
    );
}
function eD(e, n, t) {
    let r = fn(n, e),
        i = Jw(t),
        o = e[Nn].rendererFactory,
        s = Jd(
            e,
            Xd(
                e,
                i,
                null,
                k_(t),
                r,
                n,
                null,
                o.createRenderer(r, t),
                null,
                null,
                null
            )
        );
    return (e[n.index] = s);
}
function k_(e) {
    let n = 16;
    return (e.signals ? (n = 4096) : e.onPush && (n = 64), n);
}
function Uo(e, n, t, r) {
    if (t === 0) return -1;
    let i = n.length;
    for (let o = 0; o < t; o++)
        (n.push(r), e.blueprint.push(r), e.data.push(null));
    return i;
}
function Jd(e, n) {
    return (e[Po] ? (e[fg][qt] = n) : (e[Po] = n), (e[fg] = n), n);
}
function v(e = 1) {
    L_(De(), q(), Or() + e, !1);
}
function L_(e, n, t, r) {
    if (!r)
        if ((n[L] & 3) === 3) {
            let o = e.preOrderCheckHooks;
            o !== null && ya(n, o, t);
        } else {
            let o = e.preOrderHooks;
            o !== null && va(n, o, 0, t);
        }
    Mr(t);
}
var sl = (function (e) {
    return (
        (e[(e.None = 0)] = "None"),
        (e[(e.SignalBased = 1)] = "SignalBased"),
        (e[(e.HasDecoratorInputTransform = 2)] = "HasDecoratorInputTransform"),
        e
    );
})(sl || {});
function $u(e, n, t, r) {
    let i = Y(null);
    try {
        let [o, s, a] = e.inputs[t],
            l = null;
        ((s & sl.SignalBased) !== 0 && (l = n[o][Tt]),
            l !== null && l.transformFn !== void 0
                ? (r = l.transformFn(r))
                : a !== null && (r = a.call(n, r)),
            e.setInput !== null ? e.setInput(n, l, r, t, o) : Sm(n, l, o, r));
    } finally {
        Y(i);
    }
}
function F_(e, n, t, r, i) {
    let o = Or(),
        s = r & 2;
    try {
        (Mr(-1),
            s && n.length > Xe && L_(e, n, Xe, !1),
            fe(s ? 2 : 0, i),
            t(r, i));
    } finally {
        (Mr(o), fe(s ? 3 : 1, i));
    }
}
function al(e, n, t) {
    (sD(e, n, t), (t.flags & 64) === 64 && aD(e, n, t));
}
function ef(e, n, t = fn) {
    let r = n.localNames;
    if (r !== null) {
        let i = n.index + 1;
        for (let o = 0; o < r.length; o += 2) {
            let s = r[o + 1],
                a = s === -1 ? t(n, e) : e[s];
            e[i++] = a;
        }
    }
}
function tD(e, n, t, r) {
    let o = r.get(aw, __) || t === cn.ShadowDom,
        s = e.selectRootElement(n, o);
    return (nD(s), s);
}
function nD(e) {
    rD(e);
}
var rD = () => null;
function iD(e) {
    return e === "class"
        ? "className"
        : e === "for"
          ? "htmlFor"
          : e === "formaction"
            ? "formAction"
            : e === "innerHtml"
              ? "innerHTML"
              : e === "readonly"
                ? "readOnly"
                : e === "tabindex"
                  ? "tabIndex"
                  : e;
}
function $_(e, n, t, r, i, o, s, a) {
    if (!a && nf(n, e, t, r, i)) {
        Ii(n) && oD(t, n.index);
        return;
    }
    if (n.type & 3) {
        let l = fn(n, t);
        ((r = iD(r)),
            (i = s != null ? s(i, n.value || "", r) : i),
            o.setProperty(l, r, i));
    } else n.type & 12;
}
function oD(e, n) {
    let t = sn(n, e);
    t[L] & 16 || (t[L] |= 64);
}
function sD(e, n, t) {
    let r = t.directiveStart,
        i = t.directiveEnd;
    (Ii(t) && eD(n, t, e.data[r + t.componentOffset]),
        e.firstCreatePass || Aa(t, n));
    let o = t.initialInputs;
    for (let s = r; s < i; s++) {
        let a = e.data[s],
            l = Ao(n, e, s, t);
        if ((Ni(l, n), o !== null && dD(n, s - r, l, a, t, o), on(a))) {
            let c = sn(t.index, n);
            c[lt] = Ao(n, e, s, t);
        }
    }
}
function aD(e, n, t) {
    let r = t.directiveStart,
        i = t.directiveEnd,
        o = t.index,
        s = vS();
    try {
        Mr(o);
        for (let a = r; a < i; a++) {
            let l = e.data[a],
                c = n[a];
            (Du(a),
                (l.hostBindings !== null ||
                    l.hostVars !== 0 ||
                    l.hostAttrs !== null) &&
                    lD(l, c));
        }
    } finally {
        (Mr(-1), Du(s));
    }
}
function lD(e, n) {
    e.hostBindings !== null && e.hostBindings(1, n);
}
function tf(e, n) {
    let t = e.directiveRegistry,
        r = null;
    if (t)
        for (let i = 0; i < t.length; i++) {
            let o = t[i];
            R_(n, o.selectors, !1) &&
                ((r ??= []), on(o) ? r.unshift(o) : r.push(o));
        }
    return r;
}
function cD(e, n, t, r, i, o) {
    let s = fn(e, n);
    uD(n[_e], s, o, e.value, t, r, i);
}
function uD(e, n, t, r, i, o, s) {
    if (o == null) e.removeAttribute(n, i, t);
    else {
        let a = s == null ? Qa(o) : s(o, r || "", i);
        e.setAttribute(n, i, a, t);
    }
}
function dD(e, n, t, r, i, o) {
    let s = o[n];
    if (s !== null)
        for (let a = 0; a < s.length; a += 2) {
            let l = s[a],
                c = s[a + 1];
            $u(r, t, l, c);
        }
}
function fD(e, n) {
    let t = e[yi],
        r = t ? t.get(ln, null) : null;
    r && r.handleError(n);
}
function nf(e, n, t, r, i) {
    let o = e.inputs?.[r],
        s = e.hostDirectiveInputs?.[r],
        a = !1;
    if (s)
        for (let l = 0; l < s.length; l += 2) {
            let c = s[l],
                u = s[l + 1],
                d = n.data[c];
            ($u(d, t[c], u, i), (a = !0));
        }
    if (o)
        for (let l of o) {
            let c = t[l],
                u = n.data[l];
            ($u(u, c, r, i), (a = !0));
        }
    return a;
}
function pD(e, n) {
    let t = sn(n, e),
        r = t[z];
    hD(r, t);
    let i = t[kn];
    (i !== null && t[Oo] === null && (t[Oo] = v_(i, t[yi])),
        fe(18),
        rf(r, t, t[lt]),
        fe(19, t[lt]));
}
function hD(e, n) {
    for (let t = n.length; t < e.blueprint.length; t++) n.push(e.blueprint[t]);
}
function rf(e, n, t) {
    Ad(n);
    try {
        let r = e.viewQuery;
        r !== null && ku(1, r, t);
        let i = e.template;
        (i !== null && F_(e, n, i, 1, t),
            e.firstCreatePass && (e.firstCreatePass = !1),
            n[An]?.finishViewCreation(e),
            e.staticContentQueries && b_(e, n),
            e.staticViewQueries && ku(2, e.viewQuery, t));
        let o = e.components;
        o !== null && gD(n, o);
    } catch (r) {
        throw (
            e.firstCreatePass &&
                ((e.incompleteFirstPass = !0), (e.firstCreatePass = !1)),
            r
        );
    } finally {
        ((n[L] &= -5), Rd());
    }
}
function gD(e, n) {
    for (let t = 0; t < n.length; t++) pD(e, n[t]);
}
function V_(e, n, t, r) {
    let i = Y(null);
    try {
        let o = n.tView,
            a = e[L] & 4096 ? 4096 : 16,
            l = Xd(
                e,
                o,
                t,
                a,
                null,
                n,
                null,
                null,
                r?.injector ?? null,
                r?.embeddedViewInjector ?? null,
                r?.dehydratedView ?? null
            ),
            c = e[n.index];
        l[Cr] = c;
        let u = e[An];
        return (
            u !== null && (l[An] = u.createEmbeddedView(o)),
            rf(o, l, t),
            l
        );
    } finally {
        Y(i);
    }
}
function Vu(e, n) {
    return !n || n.firstChild === null || c_(e);
}
var ju;
function of(e, n) {
    return ju(e, n);
}
function mD(e) {
    ju === void 0 && (ju = e());
}
var un = (function (e) {
    return (
        (e[(e.Important = 1)] = "Important"),
        (e[(e.DashCase = 2)] = "DashCase"),
        e
    );
})(un || {});
function sf(e) {
    return (e.flags & 32) === 32;
}
function pi(e, n, t, r, i) {
    if (r != null) {
        let o,
            s = !1;
        Ln(r) ? (o = r) : er(r) && ((s = !0), (r = r[kn]));
        let a = Yt(r);
        (e === 0 && t !== null
            ? i == null
                ? I_(n, t, a)
                : Ci(n, t, a, i || null, !0)
            : e === 1 && t !== null
              ? Ci(n, t, a, i || null, !0)
              : e === 2
                ? Lw(n, a, s)
                : e === 3 && n.destroyNode(a),
            o != null && SD(n, e, o, t, i));
    }
}
function _D(e, n) {
    (j_(e, n), (n[kn] = null), (n[Je] = null));
}
function yD(e, n, t, r, i, o) {
    ((r[kn] = i), (r[Je] = n), cl(e, r, t, 1, i, o));
}
function j_(e, n) {
    (n[Nn].changeDetectionScheduler?.notify(9), cl(e, n, n[_e], 2, null, null));
}
function vD(e) {
    let n = e[Po];
    if (!n) return su(e[z], e);
    for (; n; ) {
        let t = null;
        if (er(n)) t = n[Po];
        else {
            let r = n[vt];
            r && (t = r);
        }
        if (!t) {
            for (; n && !n[qt] && n !== e; )
                (er(n) && su(n[z], n), (n = n[ze]));
            (n === null && (n = e), er(n) && su(n[z], n), (t = n && n[qt]));
        }
        n = t;
    }
}
function af(e, n) {
    let t = e[vi],
        r = t.indexOf(n);
    t.splice(r, 1);
}
function B_(e, n) {
    if (Ti(n)) return;
    let t = n[_e];
    (t.destroyNode && cl(e, n, t, 3, null, null), vD(n));
}
function su(e, n) {
    if (Ti(n)) return;
    let t = Y(null);
    try {
        ((n[L] &= -129),
            (n[L] |= 256),
            n[Pt] && mo(n[Pt]),
            CD(e, n),
            bD(e, n),
            n[z].type === 1 && n[_e].destroy());
        let r = n[Cr];
        if (r !== null && Ln(n[ze])) {
            r !== n[ze] && af(r, n);
            let i = n[An];
            i !== null && i.detachView(e);
        }
        Nu(n);
    } finally {
        Y(t);
    }
}
function bD(e, n) {
    let t = e.cleanup,
        r = n[Ia];
    if (t !== null)
        for (let s = 0; s < t.length - 1; s += 2)
            if (typeof t[s] == "string") {
                let a = t[s + 3];
                (a >= 0 ? r[a]() : r[-a].unsubscribe(), (s += 2));
            } else {
                let a = r[t[s + 1]];
                t[s].call(a);
            }
    r !== null && (n[Ia] = null);
    let i = n[Jn];
    if (i !== null) {
        n[Jn] = null;
        for (let s = 0; s < i.length; s++) {
            let a = i[s];
            a();
        }
    }
    let o = n[Er];
    if (o !== null) {
        n[Er] = null;
        for (let s of o) s.destroy();
    }
}
function CD(e, n) {
    let t;
    if (e != null && (t = e.destroyHooks) != null)
        for (let r = 0; r < t.length; r += 2) {
            let i = n[t[r]];
            if (!(i instanceof Ir)) {
                let o = t[r + 1];
                if (Array.isArray(o))
                    for (let s = 0; s < o.length; s += 2) {
                        let a = i[o[s]],
                            l = o[s + 1];
                        fe(4, a, l);
                        try {
                            l.call(a);
                        } finally {
                            fe(5, a, l);
                        }
                    }
                else {
                    fe(4, i, o);
                    try {
                        o.call(i);
                    } finally {
                        fe(5, i, o);
                    }
                }
            }
        }
}
function U_(e, n, t) {
    return H_(e, n.parent, t);
}
function H_(e, n, t) {
    let r = n;
    for (; r !== null && r.type & 168; ) ((n = r), (r = n.parent));
    if (r === null) return t[kn];
    if (Ii(r)) {
        let { encapsulation: i } = e.data[r.directiveStart + r.componentOffset];
        if (i === cn.None || i === cn.Emulated) return null;
    }
    return fn(r, t);
}
function z_(e, n, t) {
    return q_(e, n, t);
}
function W_(e, n, t) {
    return e.type & 40 ? fn(e, t) : null;
}
var q_ = W_,
    Bu;
function G_(e, n) {
    ((q_ = e), (Bu = n));
}
function ll(e, n, t, r) {
    let i = U_(e, r, n),
        o = n[_e],
        s = r.parent || n[Je],
        a = z_(s, r, n);
    if (i != null)
        if (Array.isArray(t))
            for (let l = 0; l < t.length; l++) Tg(o, i, t[l], a, !1);
        else Tg(o, i, t, a, !1);
    Bu !== void 0 && Bu(o, r, n, t, i);
}
function Do(e, n) {
    if (n !== null) {
        let t = n.type;
        if (t & 3) return fn(n, e);
        if (t & 4) return Uu(-1, e[n.index]);
        if (t & 8) {
            let r = n.child;
            if (r !== null) return Do(e, r);
            {
                let i = e[n.index];
                return Ln(i) ? Uu(-1, i) : Yt(i);
            }
        } else {
            if (t & 128) return Do(e, n.next);
            if (t & 32) return of(n, e)() || Yt(e[n.index]);
            {
                let r = Y_(e, n);
                if (r !== null) {
                    if (Array.isArray(r)) return r[0];
                    let i = Dr(e[bt]);
                    return Do(i, r);
                } else return Do(e, n.next);
            }
        }
    }
    return null;
}
function Y_(e, n) {
    if (n !== null) {
        let r = e[bt][Je],
            i = n.projection;
        return r.projection[i];
    }
    return null;
}
function Uu(e, n) {
    let t = vt + e + 1;
    if (t < n.length) {
        let r = n[t],
            i = r[z].firstChild;
        if (i !== null) return Do(r, i);
    }
    return n[Sr];
}
function lf(e, n, t, r, i, o, s) {
    for (; t != null; ) {
        if (t.type === 128) {
            t = t.next;
            continue;
        }
        let a = r[t.index],
            l = t.type;
        if ((s && n === 0 && (a && Ni(Yt(a), r), (t.flags |= 2)), !sf(t)))
            if (l & 8) (lf(e, n, t.child, r, i, o, !1), pi(n, e, i, a, o));
            else if (l & 32) {
                let c = of(t, r),
                    u;
                for (; (u = c()); ) pi(n, e, i, u, o);
                pi(n, e, i, a, o);
            } else l & 16 ? K_(e, n, r, t, i, o) : pi(n, e, i, a, o);
        t = s ? t.projectionNext : t.next;
    }
}
function cl(e, n, t, r, i, o) {
    lf(t, r, e.firstChild, n, i, o, !1);
}
function ED(e, n, t) {
    let r = n[_e],
        i = U_(e, t, n),
        o = t.parent || n[Je],
        s = z_(o, t, n);
    K_(r, 0, n, t, i, s);
}
function K_(e, n, t, r, i, o) {
    let s = t[bt],
        l = s[Je].projection[r.projection];
    if (Array.isArray(l))
        for (let c = 0; c < l.length; c++) {
            let u = l[c];
            pi(n, e, i, u, o);
        }
    else {
        let c = l,
            u = s[ze];
        (c_(r) && (c.flags |= 128), lf(e, n, c, u, i, o, !0));
    }
}
function SD(e, n, t, r, i) {
    let o = t[Sr],
        s = Yt(t);
    o !== s && pi(n, e, r, o, i);
    for (let a = vt; a < t.length; a++) {
        let l = t[a];
        cl(l[z], l, e, n, r, o);
    }
}
function wD(e, n, t, r, i) {
    if (n) i ? e.addClass(t, r) : e.removeClass(t, r);
    else {
        let o = r.indexOf("-") === -1 ? void 0 : un.DashCase;
        i == null
            ? e.removeStyle(t, r, o)
            : (typeof i == "string" &&
                  i.endsWith("!important") &&
                  ((i = i.slice(0, -10)), (o |= un.Important)),
              e.setStyle(t, r, i, o));
    }
}
function $a(e, n, t, r, i = !1) {
    for (; t !== null; ) {
        if (t.type === 128) {
            t = i ? t.projectionNext : t.next;
            continue;
        }
        let o = n[t.index];
        (o !== null && r.push(Yt(o)), Ln(o) && DD(o, r));
        let s = t.type;
        if (s & 8) $a(e, n, t.child, r);
        else if (s & 32) {
            let a = of(t, n),
                l;
            for (; (l = a()); ) r.push(l);
        } else if (s & 16) {
            let a = Y_(n, t);
            if (Array.isArray(a)) r.push(...a);
            else {
                let l = Dr(n[bt]);
                $a(l[z], l, a, r, !0);
            }
        }
        t = i ? t.projectionNext : t.next;
    }
    return r;
}
function DD(e, n) {
    for (let t = vt; t < e.length; t++) {
        let r = e[t],
            i = r[z].firstChild;
        i !== null && $a(r[z], r, i, n);
    }
    e[Sr] !== e[kn] && n.push(e[Sr]);
}
function Q_(e) {
    if (e[hi] !== null) {
        for (let n of e[hi]) n.impl.addSequence(n);
        e[hi].length = 0;
    }
}
var Z_ = [];
function MD(e) {
    return e[Pt] ?? ID(e);
}
function ID(e) {
    let n = Z_.pop() ?? Object.create(xD);
    return ((n.lView = e), n);
}
function TD(e) {
    e.lView[Pt] !== e && ((e.lView = null), Z_.push(e));
}
var xD = oe(E({}, Xr), {
    consumerIsAlwaysLive: !0,
    kind: "template",
    consumerMarkedDirty: (e) => {
        xi(e.lView);
    },
    consumerOnSignalRead() {
        this.lView[Pt] = this;
    },
});
function OD(e) {
    let n = e[Pt] ?? Object.create(PD);
    return ((n.lView = e), n);
}
var PD = oe(E({}, Xr), {
    consumerIsAlwaysLive: !0,
    kind: "template",
    consumerMarkedDirty: (e) => {
        let n = Dr(e.lView);
        for (; n && !X_(n[z]); ) n = Dr(n);
        n && Pm(n);
    },
    consumerOnSignalRead() {
        this.lView[Pt] = this;
    },
});
function X_(e) {
    return e.type !== 2;
}
function J_(e) {
    if (e[Er] === null) return;
    let n = !0;
    for (; n; ) {
        let t = !1;
        for (let r of e[Er])
            r.dirty &&
                ((t = !0),
                r.zone === null || Zone.current === r.zone
                    ? r.run()
                    : r.zone.run(() => r.run()));
        n = t && !!(e[L] & 8192);
    }
}
var ND = 100;
function ey(e, n = !0, t = 0) {
    let i = e[Nn].rendererFactory,
        o = !1;
    o || i.begin?.();
    try {
        AD(e, t);
    } catch (s) {
        throw (n && fD(e, s), s);
    } finally {
        o || i.end?.();
    }
}
function AD(e, n) {
    let t = km();
    try {
        (Oa(!0), Hu(e, n));
        let r = 0;
        for (; rl(e); ) {
            if (r === ND) throw new S(103, !1);
            (r++, Hu(e, 1));
        }
    } finally {
        Oa(t);
    }
}
function RD(e, n, t, r) {
    if (Ti(n)) return;
    let i = n[L],
        o = !1,
        s = !1;
    Ad(n);
    let a = !0,
        l = null,
        c = null;
    o ||
        (X_(e)
            ? ((c = MD(n)), (l = go(c)))
            : Pc() === null
              ? ((a = !1), (c = OD(n)), (l = go(c)))
              : n[Pt] && (mo(n[Pt]), (n[Pt] = null)));
    try {
        (Om(n), mS(e.bindingStartIndex), t !== null && F_(e, n, t, 2, r));
        let u = (i & 3) === 3;
        if (!o)
            if (u) {
                let f = e.preOrderCheckHooks;
                f !== null && ya(n, f, null);
            } else {
                let f = e.preOrderHooks;
                (f !== null && va(n, f, 0, null), iu(n, 0));
            }
        if (
            (s || kD(n),
            J_(n),
            ty(n, 0),
            e.contentQueries !== null && b_(e, n),
            !o)
        )
            if (u) {
                let f = e.contentCheckHooks;
                f !== null && ya(n, f);
            } else {
                let f = e.contentHooks;
                (f !== null && va(n, f, 1), iu(n, 1));
            }
        FD(e, n);
        let d = e.components;
        d !== null && ry(n, d, 0);
        let p = e.viewQuery;
        if ((p !== null && ku(2, p, r), !o))
            if (u) {
                let f = e.viewCheckHooks;
                f !== null && ya(n, f);
            } else {
                let f = e.viewHooks;
                (f !== null && va(n, f, 2), iu(n, 2));
            }
        if ((e.firstUpdatePass === !0 && (e.firstUpdatePass = !1), n[ru])) {
            for (let f of n[ru]) f();
            n[ru] = null;
        }
        o || (Q_(n), (n[L] &= -73));
    } catch (u) {
        throw (o || xi(n), u);
    } finally {
        (c !== null && (Us(c, l), a && TD(c)), Rd());
    }
}
function ty(e, n) {
    for (let t = f_(e); t !== null; t = p_(t))
        for (let r = vt; r < t.length; r++) {
            let i = t[r];
            ny(i, n);
        }
}
function kD(e) {
    for (let n = f_(e); n !== null; n = p_(n)) {
        if (!(n[L] & 2)) continue;
        let t = n[vi];
        for (let r = 0; r < t.length; r++) {
            let i = t[r];
            Pm(i);
        }
    }
}
function LD(e, n, t) {
    fe(18);
    let r = sn(n, e);
    (ny(r, t), fe(19, r[lt]));
}
function ny(e, n) {
    Md(e) && Hu(e, n);
}
function Hu(e, n) {
    let r = e[z],
        i = e[L],
        o = e[Pt],
        s = !!(n === 0 && i & 16);
    if (
        ((s ||= !!(i & 64 && n === 0)),
        (s ||= !!(i & 1024)),
        (s ||= !!(o?.dirty && Hs(o))),
        (s ||= !1),
        o && (o.dirty = !1),
        (e[L] &= -9217),
        s)
    )
        RD(r, e, r.template, e[lt]);
    else if (i & 8192) {
        (J_(e), ty(e, 1));
        let a = r.components;
        (a !== null && ry(e, a, 1), Q_(e));
    }
}
function ry(e, n, t) {
    for (let r = 0; r < n.length; r++) LD(e, n[r], t);
}
function FD(e, n) {
    let t = e.hostBindingOpCodes;
    if (t !== null)
        try {
            for (let r = 0; r < t.length; r++) {
                let i = t[r];
                if (i < 0) Mr(~i);
                else {
                    let o = i,
                        s = t[++r],
                        a = t[++r];
                    yS(s, o);
                    let l = n[o];
                    (fe(24, l), a(2, l), fe(25, l));
                }
            }
        } finally {
            Mr(-1);
        }
}
function cf(e, n) {
    let t = km() ? 64 : 1088;
    for (e[Nn].changeDetectionScheduler?.notify(n); e; ) {
        e[L] |= t;
        let r = Dr(e);
        if (xa(e) && !r) return e;
        e = r;
    }
    return null;
}
function iy(e, n, t, r) {
    return [e, !0, 0, n, null, r, null, t, null, null];
}
function oy(e, n, t, r = !0) {
    let i = n[z];
    if (($D(i, n, e, t), r)) {
        let s = Uu(t, e),
            a = n[_e],
            l = a.parentNode(e[Sr]);
        l !== null && yD(i, e[Je], a, n, l, s);
    }
    let o = n[Oo];
    o !== null && o.firstChild !== null && (o.firstChild = null);
}
function zu(e, n) {
    if (e.length <= vt) return;
    let t = vt + n,
        r = e[t];
    if (r) {
        let i = r[Cr];
        (i !== null && i !== e && af(i, r), n > 0 && (e[t - 1][qt] = r[qt]));
        let o = Da(e, vt + n);
        _D(r[z], r);
        let s = o[An];
        (s !== null && s.detachView(o[z]),
            (r[ze] = null),
            (r[qt] = null),
            (r[L] &= -129));
    }
    return r;
}
function $D(e, n, t, r) {
    let i = vt + r,
        o = t.length;
    (r > 0 && (t[i - 1][qt] = n),
        r < o - vt
            ? ((n[qt] = t[i]), fm(t, vt + r, n))
            : (t.push(n), (n[qt] = null)),
        (n[ze] = t));
    let s = n[Cr];
    s !== null && t !== s && sy(s, n);
    let a = n[An];
    (a !== null && a.insertView(e), Su(n), (n[L] |= 128));
}
function sy(e, n) {
    let t = e[vi],
        r = n[ze];
    if (er(r)) e[L] |= 2;
    else {
        let i = r[ze][bt];
        n[bt] !== i && (e[L] |= 2);
    }
    t === null ? (e[vi] = [n]) : t.push(n);
}
var ko = class {
    _lView;
    _cdRefInjectingView;
    notifyErrorHandler;
    _appRef = null;
    _attachedToViewContainer = !1;
    get rootNodes() {
        let n = this._lView,
            t = n[z];
        return $a(t, n, t.firstChild, []);
    }
    constructor(n, t, r = !0) {
        ((this._lView = n),
            (this._cdRefInjectingView = t),
            (this.notifyErrorHandler = r));
    }
    get context() {
        return this._lView[lt];
    }
    set context(n) {
        this._lView[lt] = n;
    }
    get destroyed() {
        return Ti(this._lView);
    }
    destroy() {
        if (this._appRef) this._appRef.detachView(this);
        else if (this._attachedToViewContainer) {
            let n = this._lView[ze];
            if (Ln(n)) {
                let t = n[Ta],
                    r = t ? t.indexOf(this) : -1;
                r > -1 && (zu(n, r), Da(t, r));
            }
            this._attachedToViewContainer = !1;
        }
        B_(this._lView[z], this._lView);
    }
    onDestroy(n) {
        Nm(this._lView, n);
    }
    markForCheck() {
        cf(this._cdRefInjectingView || this._lView, 4);
    }
    detach() {
        this._lView[L] &= -129;
    }
    reattach() {
        (Su(this._lView), (this._lView[L] |= 128));
    }
    detectChanges() {
        ((this._lView[L] |= 1024), ey(this._lView, this.notifyErrorHandler));
    }
    checkNoChanges() {}
    attachToViewContainerRef() {
        if (this._appRef) throw new S(902, !1);
        this._attachedToViewContainer = !0;
    }
    detachFromAppRef() {
        this._appRef = null;
        let n = xa(this._lView),
            t = this._lView[Cr];
        (t !== null && !n && af(t, this._lView),
            j_(this._lView[z], this._lView));
    }
    attachToAppRef(n) {
        if (this._attachedToViewContainer) throw new S(902, !1);
        this._appRef = n;
        let t = xa(this._lView),
            r = this._lView[Cr];
        (r !== null && !t && sy(r, this._lView), Su(this._lView));
    }
};
var Rn = (() => {
        class e {
            static __NG_ELEMENT_ID__ = BD;
        }
        return e;
    })(),
    VD = Rn,
    jD = class extends VD {
        _declarationLView;
        _declarationTContainer;
        elementRef;
        constructor(n, t, r) {
            (super(),
                (this._declarationLView = n),
                (this._declarationTContainer = t),
                (this.elementRef = r));
        }
        get ssrId() {
            return this._declarationTContainer.tView?.ssrId || null;
        }
        createEmbeddedView(n, t) {
            return this.createEmbeddedViewImpl(n, t);
        }
        createEmbeddedViewImpl(n, t, r) {
            let i = V_(this._declarationLView, this._declarationTContainer, n, {
                embeddedViewInjector: t,
                dehydratedView: r,
            });
            return new ko(i);
        }
    };
function BD() {
    return ul(et(), q());
}
function ul(e, n) {
    return e.type & 4 ? new jD(n, e, Pi(e, n)) : null;
}
function ay(e, n, t) {
    let r = n.insertBeforeIndex,
        i = Array.isArray(r) ? r[0] : r;
    return i === null ? W_(e, n, t) : Yt(t[i]);
}
function ly(e, n, t, r, i) {
    let o = n.insertBeforeIndex;
    if (Array.isArray(o)) {
        let s = r,
            a = null;
        if (
            (n.type & 3 || ((a = s), (s = i)),
            s !== null && n.componentOffset === -1)
        )
            for (let l = 1; l < o.length; l++) {
                let c = t[o[l]];
                Ci(e, s, c, a, !1);
            }
    }
}
function Ho(e, n, t, r, i) {
    let o = e.data[n];
    if (o === null) ((o = uf(e, n, t, r, i)), _S() && (o.flags |= 32));
    else if (o.type & 64) {
        ((o.type = t), (o.value = r), (o.attrs = i));
        let s = No();
        o.injectorIndex = s === null ? -1 : s.injectorIndex;
    }
    return (an(o, !0), o);
}
function uf(e, n, t, r, i) {
    let o = Rm(),
        s = Od(),
        a = s ? o : o && o.parent,
        l = (e.data[n] = HD(e, a, t, n, r, i));
    return (UD(e, l, o, s), l);
}
function UD(e, n, t, r) {
    (e.firstChild === null && (e.firstChild = n),
        t !== null &&
            (r
                ? t.child == null && n.parent !== null && (t.child = n)
                : t.next === null && ((t.next = n), (n.prev = t))));
}
function HD(e, n, t, r, i, o) {
    let s = n ? n.injectorIndex : -1,
        a = 0;
    return (
        Am() && (a |= 128),
        {
            type: t,
            index: r,
            insertBeforeIndex: null,
            injectorIndex: s,
            directiveStart: -1,
            directiveEnd: -1,
            directiveStylingLast: -1,
            componentOffset: -1,
            propertyBindings: null,
            flags: a,
            providerIndexes: 0,
            value: i,
            attrs: o,
            mergedAttrs: null,
            localNames: null,
            initialInputs: null,
            inputs: null,
            hostDirectiveInputs: null,
            outputs: null,
            hostDirectiveOutputs: null,
            directiveToIndex: null,
            tView: null,
            next: null,
            prev: null,
            projectionNext: null,
            child: null,
            parent: n,
            projection: null,
            styles: null,
            stylesWithoutHost: null,
            residualStyles: void 0,
            classes: null,
            classesWithoutHost: null,
            residualClasses: void 0,
            classBindings: 0,
            styleBindings: 0,
        }
    );
}
function cy(e, n) {
    if ((e.push(n), e.length > 1))
        for (let t = e.length - 2; t >= 0; t--) {
            let r = e[t];
            uy(r) || (zD(r, n) && WD(r) === null && qD(r, n.index));
        }
}
function uy(e) {
    return !(e.type & 64);
}
function zD(e, n) {
    return uy(n) || e.index > n.index;
}
function WD(e) {
    let n = e.insertBeforeIndex;
    return Array.isArray(n) ? n[0] : n;
}
function qD(e, n) {
    let t = e.insertBeforeIndex;
    Array.isArray(t) ? (t[0] = n) : (G_(ay, ly), (e.insertBeforeIndex = n));
}
function GD(e, n, t) {
    let r = e.data[n];
    r === null ? (e.data[n] = t) : (r.value = t);
}
function YD(e, n) {
    let t = e.insertBeforeIndex;
    t === null
        ? (G_(ay, ly), (t = e.insertBeforeIndex = [null, n]))
        : (yE(Array.isArray(t), !0, "Expecting array here"), t.push(n));
}
function KD(e, n, t) {
    let r = uf(e, t, 64, null, null);
    return (cy(n, r), r);
}
function QD(e, n) {
    let t = n[e.currentCaseLViewIndex];
    return t === null ? t : t < 0 ? ~t : t;
}
function ZD(e, n, t) {
    return e | (n << 17) | (t << 1);
}
function XD(e) {
    return e === -1;
}
function dy(e, n, t) {
    e.index = 0;
    let r = QD(n, t);
    r !== null ? (e.removes = n.remove[r]) : (e.removes = Ze);
}
function Wu(e) {
    if (e.index < e.removes.length) {
        let n = e.removes[e.index++];
        if (n > 0) return e.lView[n];
        {
            e.stack.push(e.index, e.removes);
            let t = ~n,
                r = e.lView[z].data[t];
            return (dy(e, r, e.lView), Wu(e));
        }
    } else
        return e.stack.length === 0
            ? null
            : ((e.removes = e.stack.pop()), (e.index = e.stack.pop()), Wu(e));
}
function JD() {
    let e = { stack: [], index: -1 };
    function n(t, r) {
        for (e.lView = r; e.stack.length; ) e.stack.pop();
        return (dy(e, t.value, r), Wu.bind(null, e));
    }
    return n;
}
var b3 = new RegExp(`^(\\d+)*(${sw}|${ow})*(.*)`);
var eM = () => {};
function tM(e, n, t, r) {
    eM(e, n, t, r);
}
var nM = () => null;
function qu(e, n) {
    return nM(e, n);
}
var rM = class {},
    fy = class {},
    Gu = class {
        resolveComponentFactory(n) {
            throw Error(`No component factory found for ${st(n)}.`);
        }
    },
    dl = class {
        static NULL = new Gu();
    },
    tr = class {},
    Ar = (() => {
        class e {
            destroyNode = null;
            static __NG_ELEMENT_ID__ = () => iM();
        }
        return e;
    })();
function iM() {
    let e = q(),
        n = et(),
        t = sn(n.index, e);
    return (er(t) ? t : e)[_e];
}
var oM = (() => {
    class e {
        static ɵprov = w({ token: e, providedIn: "root", factory: () => null });
    }
    return e;
})();
var au = {},
    Yu = class {
        injector;
        parentInjector;
        constructor(n, t) {
            ((this.injector = n), (this.parentInjector = t));
        }
        get(n, t, r) {
            r = Za(r);
            let i = this.injector.get(n, au, r);
            return i !== au || t === au ? i : this.parentInjector.get(n, t, r);
        }
    };
function Ku(e, n, t) {
    let r = t ? e.styles : null,
        i = t ? e.classes : null,
        o = 0;
    if (n !== null)
        for (let s = 0; s < n.length; s++) {
            let a = n[s];
            if (typeof a == "number") o = a;
            else if (o == 1) i = gu(i, a);
            else if (o == 2) {
                let l = a,
                    c = n[++s];
                r = gu(r, l + ": " + c + ";");
            }
        }
    (t ? (e.styles = r) : (e.stylesWithoutHost = r),
        t ? (e.classes = i) : (e.classesWithoutHost = i));
}
function Se(e, n = B.Default) {
    let t = q();
    if (t === null) return N(e, n);
    let r = et();
    return Xm(r, t, Qe(e), n);
}
function py() {
    let e = "invalid";
    throw new Error(e);
}
function df(e, n, t, r, i) {
    let o = r === null ? null : { "": -1 },
        s = i(e, t);
    if (s !== null) {
        let a,
            l = null,
            c = null,
            u = aM(s);
        (u === null ? (a = s) : ([a, l, c] = u), uM(e, n, t, a, o, l, c));
    }
    o !== null && r !== null && sM(t, r, o);
}
function sM(e, n, t) {
    let r = (e.localNames = []);
    for (let i = 0; i < n.length; i += 2) {
        let o = t[n[i + 1]];
        if (o == null) throw new S(-301, !1);
        r.push(n[i], o);
    }
}
function aM(e) {
    let n = null,
        t = !1;
    for (let s = 0; s < e.length; s++) {
        let a = e[s];
        if ((s === 0 && on(a) && (n = a), a.findHostDirectiveDefs !== null)) {
            t = !0;
            break;
        }
    }
    if (!t) return null;
    let r = null,
        i = null,
        o = null;
    for (let s of e)
        (s.findHostDirectiveDefs !== null &&
            ((r ??= []), (i ??= new Map()), (o ??= new Map()), lM(s, r, o, i)),
            s === n && ((r ??= []), r.push(s)));
    return r !== null
        ? (r.push(...(n === null ? e : e.slice(1))), [r, i, o])
        : null;
}
function lM(e, n, t, r) {
    let i = n.length;
    (e.findHostDirectiveDefs(e, n, r), t.set(e, [i, n.length - 1]));
}
function cM(e, n, t) {
    ((n.componentOffset = t), (e.components ??= []).push(n.index));
}
function uM(e, n, t, r, i, o, s) {
    let a = r.length,
        l = !1;
    for (let p = 0; p < a; p++) {
        let f = r[p];
        (!l && on(f) && ((l = !0), cM(e, t, p)), Iu(Aa(t, n), e, f.type));
    }
    mM(t, e.data.length, a);
    for (let p = 0; p < a; p++) {
        let f = r[p];
        f.providersResolver && f.providersResolver(f);
    }
    let c = !1,
        u = !1,
        d = Uo(e, n, a, null);
    a > 0 && (t.directiveToIndex = new Map());
    for (let p = 0; p < a; p++) {
        let f = r[p];
        if (
            ((t.mergedAttrs = bi(t.mergedAttrs, f.hostAttrs)),
            fM(e, t, n, d, f),
            gM(d, f, i),
            s !== null && s.has(f))
        ) {
            let [_, M] = s.get(f);
            t.directiveToIndex.set(f.type, [
                d,
                _ + t.directiveStart,
                M + t.directiveStart,
            ]);
        } else (o === null || !o.has(f)) && t.directiveToIndex.set(f.type, d);
        (f.contentQueries !== null && (t.flags |= 4),
            (f.hostBindings !== null ||
                f.hostAttrs !== null ||
                f.hostVars !== 0) &&
                (t.flags |= 64));
        let h = f.type.prototype;
        (!c &&
            (h.ngOnChanges || h.ngOnInit || h.ngDoCheck) &&
            ((e.preOrderHooks ??= []).push(t.index), (c = !0)),
            !u &&
                (h.ngOnChanges || h.ngDoCheck) &&
                ((e.preOrderCheckHooks ??= []).push(t.index), (u = !0)),
            d++);
    }
    dM(e, t, o);
}
function dM(e, n, t) {
    for (let r = n.directiveStart; r < n.directiveEnd; r++) {
        let i = e.data[r];
        if (t === null || !t.has(i))
            (Og(0, n, i, r), Og(1, n, i, r), Ng(n, r, !1));
        else {
            let o = t.get(i);
            (Pg(0, n, o, r), Pg(1, n, o, r), Ng(n, r, !0));
        }
    }
}
function Og(e, n, t, r) {
    let i = e === 0 ? t.inputs : t.outputs;
    for (let o in i)
        if (i.hasOwnProperty(o)) {
            let s;
            (e === 0 ? (s = n.inputs ??= {}) : (s = n.outputs ??= {}),
                (s[o] ??= []),
                s[o].push(r),
                hy(n, o));
        }
}
function Pg(e, n, t, r) {
    let i = e === 0 ? t.inputs : t.outputs;
    for (let o in i)
        if (i.hasOwnProperty(o)) {
            let s = i[o],
                a;
            (e === 0
                ? (a = n.hostDirectiveInputs ??= {})
                : (a = n.hostDirectiveOutputs ??= {}),
                (a[s] ??= []),
                a[s].push(r, o),
                hy(n, s));
        }
}
function hy(e, n) {
    n === "class" ? (e.flags |= 8) : n === "style" && (e.flags |= 16);
}
function Ng(e, n, t) {
    let { attrs: r, inputs: i, hostDirectiveInputs: o } = e;
    if (r === null || (!t && i === null) || (t && o === null) || Qd(e)) {
        ((e.initialInputs ??= []), e.initialInputs.push(null));
        return;
    }
    let s = null,
        a = 0;
    for (; a < r.length; ) {
        let l = r[a];
        if (l === 0) {
            a += 4;
            continue;
        } else if (l === 5) {
            a += 2;
            continue;
        } else if (typeof l == "number") break;
        if (!t && i.hasOwnProperty(l)) {
            let c = i[l];
            for (let u of c)
                if (u === n) {
                    ((s ??= []), s.push(l, r[a + 1]));
                    break;
                }
        } else if (t && o.hasOwnProperty(l)) {
            let c = o[l];
            for (let u = 0; u < c.length; u += 2)
                if (c[u] === n) {
                    ((s ??= []), s.push(c[u + 1], r[a + 1]));
                    break;
                }
        }
        a += 2;
    }
    ((e.initialInputs ??= []), e.initialInputs.push(s));
}
function fM(e, n, t, r, i) {
    e.data[r] = i;
    let o = i.factory || (i.factory = mi(i.type, !0)),
        s = new Ir(o, on(i), Se);
    ((e.blueprint[r] = s),
        (t[r] = s),
        pM(e, n, r, Uo(e, t, i.hostVars, gn), i));
}
function pM(e, n, t, r, i) {
    let o = i.hostBindings;
    if (o) {
        let s = e.hostBindingOpCodes;
        s === null && (s = e.hostBindingOpCodes = []);
        let a = ~n.index;
        (hM(s) != a && s.push(a), s.push(t, r, o));
    }
}
function hM(e) {
    let n = e.length;
    for (; n > 0; ) {
        let t = e[--n];
        if (typeof t == "number" && t < 0) return t;
    }
    return 0;
}
function gM(e, n, t) {
    if (t) {
        if (n.exportAs)
            for (let r = 0; r < n.exportAs.length; r++) t[n.exportAs[r]] = e;
        on(n) && (t[""] = e);
    }
}
function mM(e, n, t) {
    ((e.flags |= 1),
        (e.directiveStart = n),
        (e.directiveEnd = n + t),
        (e.providerIndexes = n));
}
function gy(e, n, t, r, i, o, s, a) {
    let l = n.consts,
        c = wr(l, s),
        u = Ho(n, e, 2, r, c);
    return (
        o && df(n, t, u, wr(l, a), i),
        (u.mergedAttrs = bi(u.mergedAttrs, u.attrs)),
        u.attrs !== null && Ku(u, u.attrs, !1),
        u.mergedAttrs !== null && Ku(u, u.mergedAttrs, !0),
        n.queries !== null && n.queries.elementStart(n, u),
        u
    );
}
function my(e, n) {
    (Ld(e, n), Dd(n) && e.queries.elementEnd(n));
}
var Va = class extends dl {
    ngModule;
    constructor(n) {
        (super(), (this.ngModule = n));
    }
    resolveComponentFactory(n) {
        let t = br(n);
        return new Ei(t, this.ngModule);
    }
};
function _M(e) {
    return Object.keys(e).map((n) => {
        let [t, r, i] = e[n],
            o = {
                propName: t,
                templateName: n,
                isSignal: (r & sl.SignalBased) !== 0,
            };
        return (i && (o.transform = i), o);
    });
}
function yM(e) {
    return Object.keys(e).map((n) => ({ propName: e[n], templateName: n }));
}
function vM(e, n, t) {
    let r = n instanceof at ? n : n?.injector;
    return (
        r &&
            e.getStandaloneInjector !== null &&
            (r = e.getStandaloneInjector(r) || r),
        r ? new Yu(t, r) : t
    );
}
function bM(e) {
    let n = e.get(tr, null);
    if (n === null) throw new S(407, !1);
    let t = e.get(oM, null),
        r = e.get(Tr, null);
    return { rendererFactory: n, sanitizer: t, changeDetectionScheduler: r };
}
function CM(e, n) {
    let t = (e.selectors[0][0] || "div").toLowerCase();
    return Kd(n, t, t === "svg" ? Im : t === "math" ? rS : null);
}
var Ei = class extends fy {
        componentDef;
        ngModule;
        selector;
        componentType;
        ngContentSelectors;
        isBoundToModule;
        cachedInputs = null;
        cachedOutputs = null;
        get inputs() {
            return (
                (this.cachedInputs ??= _M(this.componentDef.inputs)),
                this.cachedInputs
            );
        }
        get outputs() {
            return (
                (this.cachedOutputs ??= yM(this.componentDef.outputs)),
                this.cachedOutputs
            );
        }
        constructor(n, t) {
            (super(),
                (this.componentDef = n),
                (this.ngModule = t),
                (this.componentType = n.type),
                (this.selector = Qw(n.selectors)),
                (this.ngContentSelectors = n.ngContentSelectors ?? []),
                (this.isBoundToModule = !!t));
        }
        create(n, t, r, i) {
            fe(22);
            let o = Y(null);
            try {
                let s = this.componentDef,
                    a = r
                        ? ["ng-version", "19.2.20"]
                        : Zw(this.componentDef.selectors[0]),
                    l = Zd(
                        0,
                        null,
                        null,
                        1,
                        0,
                        null,
                        null,
                        null,
                        null,
                        [a],
                        null
                    ),
                    c = vM(s, i || this.ngModule, n),
                    u = bM(c),
                    d = u.rendererFactory.createRenderer(null, s),
                    p = r ? tD(d, r, s.encapsulation, c) : CM(s, d),
                    f = Xd(
                        null,
                        l,
                        null,
                        512 | k_(s),
                        null,
                        null,
                        u,
                        d,
                        c,
                        null,
                        v_(p, c, !0)
                    );
                ((f[Xe] = p), Ad(f));
                let h = null;
                try {
                    let _ = gy(
                        Xe,
                        l,
                        f,
                        "#host",
                        () => [this.componentDef],
                        !0,
                        0
                    );
                    (p && (T_(d, p, _), Ni(p, f)),
                        al(l, f, _),
                        Gd(l, _, f),
                        my(l, _),
                        t !== void 0 && EM(_, this.ngContentSelectors, t),
                        (h = sn(_.index, f)),
                        (f[lt] = h[lt]),
                        rf(l, f, null));
                } catch (_) {
                    throw (h !== null && Nu(h), Nu(f), _);
                } finally {
                    (fe(23), Rd());
                }
                return new Qu(this.componentType, f);
            } finally {
                Y(o);
            }
        }
    },
    Qu = class extends rM {
        _rootLView;
        instance;
        hostView;
        changeDetectorRef;
        componentType;
        location;
        previousInputValues = null;
        _tNode;
        constructor(n, t) {
            (super(),
                (this._rootLView = t),
                (this._tNode = xm(t[z], Xe)),
                (this.location = Pi(this._tNode, t)),
                (this.instance = sn(this._tNode.index, t)[lt]),
                (this.hostView = this.changeDetectorRef =
                    new ko(t, void 0, !1)),
                (this.componentType = n));
        }
        setInput(n, t) {
            let r = this._tNode;
            if (
                ((this.previousInputValues ??= new Map()),
                this.previousInputValues.has(n) &&
                    Object.is(this.previousInputValues.get(n), t))
            )
                return;
            let i = this._rootLView,
                o = nf(r, i[z], i, n, t);
            this.previousInputValues.set(n, t);
            let s = sn(r.index, i);
            cf(s, 1);
        }
        get injector() {
            return new yr(this._tNode, this._rootLView);
        }
        destroy() {
            this.hostView.destroy();
        }
        onDestroy(n) {
            this.hostView.onDestroy(n);
        }
    };
function EM(e, n, t) {
    let r = (e.projection = []);
    for (let i = 0; i < n.length; i++) {
        let o = t[i];
        r.push(o != null && o.length ? Array.from(o) : null);
    }
}
var jn = (() => {
    class e {
        static __NG_ELEMENT_ID__ = SM;
    }
    return e;
})();
function SM() {
    let e = et();
    return yy(e, q());
}
var wM = jn,
    _y = class extends wM {
        _lContainer;
        _hostTNode;
        _hostLView;
        constructor(n, t, r) {
            (super(),
                (this._lContainer = n),
                (this._hostTNode = t),
                (this._hostLView = r));
        }
        get element() {
            return Pi(this._hostTNode, this._hostLView);
        }
        get injector() {
            return new yr(this._hostTNode, this._hostLView);
        }
        get parentInjector() {
            let n = Fd(this._hostTNode, this._hostLView);
            if (qm(n)) {
                let t = Na(n, this._hostLView),
                    r = Pa(n),
                    i = t[z].data[r + 8];
                return new yr(i, t);
            } else return new yr(null, this._hostLView);
        }
        clear() {
            for (; this.length > 0; ) this.remove(this.length - 1);
        }
        get(n) {
            let t = Ag(this._lContainer);
            return (t !== null && t[n]) || null;
        }
        get length() {
            return this._lContainer.length - vt;
        }
        createEmbeddedView(n, t, r) {
            let i, o;
            typeof r == "number"
                ? (i = r)
                : r != null && ((i = r.index), (o = r.injector));
            let s = qu(this._lContainer, n.ssrId),
                a = n.createEmbeddedViewImpl(t || {}, o, s);
            return (this.insertImpl(a, i, Vu(this._hostTNode, s)), a);
        }
        createComponent(n, t, r, i, o) {
            let s = n && !JE(n),
                a;
            if (s) a = t;
            else {
                let h = t || {};
                ((a = h.index),
                    (r = h.injector),
                    (i = h.projectableNodes),
                    (o = h.environmentInjector || h.ngModuleRef));
            }
            let l = s ? n : new Ei(br(n)),
                c = r || this.parentInjector;
            if (!o && l.ngModule == null) {
                let _ = (s ? c : this.parentInjector).get(at, null);
                _ && (o = _);
            }
            let u = br(l.componentType ?? {}),
                d = qu(this._lContainer, u?.id ?? null),
                p = d?.firstChild ?? null,
                f = l.create(c, i, p, o);
            return (this.insertImpl(f.hostView, a, Vu(this._hostTNode, d)), f);
        }
        insert(n, t) {
            return this.insertImpl(n, t, !0);
        }
        insertImpl(n, t, r) {
            let i = n._lView;
            if (sS(i)) {
                let a = this.indexOf(n);
                if (a !== -1) this.detach(a);
                else {
                    let l = i[ze],
                        c = new _y(l, l[Je], l[ze]);
                    c.detach(c.indexOf(n));
                }
            }
            let o = this._adjustIndex(t),
                s = this._lContainer;
            return (
                oy(s, i, o, r),
                n.attachToViewContainerRef(),
                fm(lu(s), o, n),
                n
            );
        }
        move(n, t) {
            return this.insert(n, t);
        }
        indexOf(n) {
            let t = Ag(this._lContainer);
            return t !== null ? t.indexOf(n) : -1;
        }
        remove(n) {
            let t = this._adjustIndex(n, -1),
                r = zu(this._lContainer, t);
            r && (Da(lu(this._lContainer), t), B_(r[z], r));
        }
        detach(n) {
            let t = this._adjustIndex(n, -1),
                r = zu(this._lContainer, t);
            return r && Da(lu(this._lContainer), t) != null ? new ko(r) : null;
        }
        _adjustIndex(n, t = 0) {
            return n ?? this.length + t;
        }
    };
function Ag(e) {
    return e[Ta];
}
function lu(e) {
    return e[Ta] || (e[Ta] = []);
}
function yy(e, n) {
    let t,
        r = n[e.index];
    return (
        Ln(r) ? (t = r) : ((t = iy(r, n, null, e)), (n[e.index] = t), Jd(n, t)),
        MM(t, n, e, r),
        new _y(t, e, n)
    );
}
function DM(e, n) {
    let t = e[_e],
        r = t.createComment(""),
        i = fn(n, e),
        o = t.parentNode(i);
    return (Ci(t, o, r, t.nextSibling(i), !1), r);
}
var MM = xM,
    IM = () => !1;
function TM(e, n, t) {
    return IM(e, n, t);
}
function xM(e, n, t, r) {
    if (e[Sr]) return;
    let i;
    (t.type & 8 ? (i = Yt(r)) : (i = DM(n, t)), (e[Sr] = i));
}
var Zu = class e {
        queryList;
        matches = null;
        constructor(n) {
            this.queryList = n;
        }
        clone() {
            return new e(this.queryList);
        }
        setDirty() {
            this.queryList.setDirty();
        }
    },
    Xu = class e {
        queries;
        constructor(n = []) {
            this.queries = n;
        }
        createEmbeddedView(n) {
            let t = n.queries;
            if (t !== null) {
                let r =
                        n.contentQueries !== null
                            ? n.contentQueries[0]
                            : t.length,
                    i = [];
                for (let o = 0; o < r; o++) {
                    let s = t.getByIndex(o),
                        a = this.queries[s.indexInDeclarationView];
                    i.push(a.clone());
                }
                return new e(i);
            }
            return null;
        }
        insertView(n) {
            this.dirtyQueriesWithMatches(n);
        }
        detachView(n) {
            this.dirtyQueriesWithMatches(n);
        }
        finishViewCreation(n) {
            this.dirtyQueriesWithMatches(n);
        }
        dirtyQueriesWithMatches(n) {
            for (let t = 0; t < this.queries.length; t++)
                ff(n, t).matches !== null && this.queries[t].setDirty();
        }
    },
    ja = class {
        flags;
        read;
        predicate;
        constructor(n, t, r = null) {
            ((this.flags = t),
                (this.read = r),
                typeof n == "string"
                    ? (this.predicate = FM(n))
                    : (this.predicate = n));
        }
    },
    Ju = class e {
        queries;
        constructor(n = []) {
            this.queries = n;
        }
        elementStart(n, t) {
            for (let r = 0; r < this.queries.length; r++)
                this.queries[r].elementStart(n, t);
        }
        elementEnd(n) {
            for (let t = 0; t < this.queries.length; t++)
                this.queries[t].elementEnd(n);
        }
        embeddedTView(n) {
            let t = null;
            for (let r = 0; r < this.length; r++) {
                let i = t !== null ? t.length : 0,
                    o = this.getByIndex(r).embeddedTView(n, i);
                o &&
                    ((o.indexInDeclarationView = r),
                    t !== null ? t.push(o) : (t = [o]));
            }
            return t !== null ? new e(t) : null;
        }
        template(n, t) {
            for (let r = 0; r < this.queries.length; r++)
                this.queries[r].template(n, t);
        }
        getByIndex(n) {
            return this.queries[n];
        }
        get length() {
            return this.queries.length;
        }
        track(n) {
            this.queries.push(n);
        }
    },
    ed = class e {
        metadata;
        matches = null;
        indexInDeclarationView = -1;
        crossesNgTemplate = !1;
        _declarationNodeIndex;
        _appliesToNextNode = !0;
        constructor(n, t = -1) {
            ((this.metadata = n), (this._declarationNodeIndex = t));
        }
        elementStart(n, t) {
            this.isApplyingToNode(t) && this.matchTNode(n, t);
        }
        elementEnd(n) {
            this._declarationNodeIndex === n.index &&
                (this._appliesToNextNode = !1);
        }
        template(n, t) {
            this.elementStart(n, t);
        }
        embeddedTView(n, t) {
            return this.isApplyingToNode(n)
                ? ((this.crossesNgTemplate = !0),
                  this.addMatch(-n.index, t),
                  new e(this.metadata))
                : null;
        }
        isApplyingToNode(n) {
            if (this._appliesToNextNode && (this.metadata.flags & 1) !== 1) {
                let t = this._declarationNodeIndex,
                    r = n.parent;
                for (; r !== null && r.type & 8 && r.index !== t; )
                    r = r.parent;
                return t === (r !== null ? r.index : -1);
            }
            return this._appliesToNextNode;
        }
        matchTNode(n, t) {
            let r = this.metadata.predicate;
            if (Array.isArray(r))
                for (let i = 0; i < r.length; i++) {
                    let o = r[i];
                    (this.matchTNodeWithReadOption(n, t, OM(t, o)),
                        this.matchTNodeWithReadOption(
                            n,
                            t,
                            ba(t, n, o, !1, !1)
                        ));
                }
            else
                r === Rn
                    ? t.type & 4 && this.matchTNodeWithReadOption(n, t, -1)
                    : this.matchTNodeWithReadOption(n, t, ba(t, n, r, !1, !1));
        }
        matchTNodeWithReadOption(n, t, r) {
            if (r !== null) {
                let i = this.metadata.read;
                if (i !== null)
                    if (i === tt || i === jn || (i === Rn && t.type & 4))
                        this.addMatch(t.index, -2);
                    else {
                        let o = ba(t, n, i, !1, !1);
                        o !== null && this.addMatch(t.index, o);
                    }
                else this.addMatch(t.index, r);
            }
        }
        addMatch(n, t) {
            this.matches === null
                ? (this.matches = [n, t])
                : this.matches.push(n, t);
        }
    };
function OM(e, n) {
    let t = e.localNames;
    if (t !== null) {
        for (let r = 0; r < t.length; r += 2) if (t[r] === n) return t[r + 1];
    }
    return null;
}
function PM(e, n) {
    return e.type & 11 ? Pi(e, n) : e.type & 4 ? ul(e, n) : null;
}
function NM(e, n, t, r) {
    return t === -1 ? PM(n, e) : t === -2 ? AM(e, n, r) : Ao(e, e[z], t, n);
}
function AM(e, n, t) {
    if (t === tt) return Pi(n, e);
    if (t === Rn) return ul(n, e);
    if (t === jn) return yy(n, e);
}
function vy(e, n, t, r) {
    let i = n[An].queries[r];
    if (i.matches === null) {
        let o = e.data,
            s = t.matches,
            a = [];
        for (let l = 0; s !== null && l < s.length; l += 2) {
            let c = s[l];
            if (c < 0) a.push(null);
            else {
                let u = o[c];
                a.push(NM(n, u, s[l + 1], t.metadata.read));
            }
        }
        i.matches = a;
    }
    return i.matches;
}
function td(e, n, t, r) {
    let i = e.queries.getByIndex(t),
        o = i.matches;
    if (o !== null) {
        let s = vy(e, n, i, t);
        for (let a = 0; a < o.length; a += 2) {
            let l = o[a];
            if (l > 0) r.push(s[a / 2]);
            else {
                let c = o[a + 1],
                    u = n[-l];
                for (let d = vt; d < u.length; d++) {
                    let p = u[d];
                    p[Cr] === p[ze] && td(p[z], p, c, r);
                }
                if (u[vi] !== null) {
                    let d = u[vi];
                    for (let p = 0; p < d.length; p++) {
                        let f = d[p];
                        td(f[z], f, c, r);
                    }
                }
            }
        }
    }
    return r;
}
function RM(e, n) {
    return e[An].queries[n].queryList;
}
function by(e, n, t) {
    let r = new Pu((t & 4) === 4);
    return (
        cS(e, n, r, r.destroy),
        (n[An] ??= new Xu()).queries.push(new Zu(r)) - 1
    );
}
function kM(e, n, t) {
    let r = De();
    return (
        r.firstCreatePass &&
            (Cy(r, new ja(e, n, t), -1),
            (n & 2) === 2 && (r.staticViewQueries = !0)),
        by(r, q(), n)
    );
}
function LM(e, n, t, r) {
    let i = De();
    if (i.firstCreatePass) {
        let o = et();
        (Cy(i, new ja(n, t, r), o.index),
            $M(i, e),
            (t & 2) === 2 && (i.staticContentQueries = !0));
    }
    return by(i, q(), t);
}
function FM(e) {
    return e.split(",").map((n) => n.trim());
}
function Cy(e, n, t) {
    (e.queries === null && (e.queries = new Ju()),
        e.queries.track(new ed(n, t)));
}
function $M(e, n) {
    let t = e.contentQueries || (e.contentQueries = []),
        r = t.length ? t[t.length - 1] : -1;
    n !== r && t.push(e.queries.length - 1, n);
}
function ff(e, n) {
    return e.queries.getByIndex(n);
}
function VM(e, n) {
    let t = e[z],
        r = ff(t, n);
    return r.crossesNgTemplate ? td(t, e, n, []) : vy(t, e, r, n);
}
function jM(e) {
    let n = [],
        t = new Map();
    function r(i) {
        let o = t.get(i);
        if (!o) {
            let s = e(i);
            t.set(i, (o = s.then(zM)));
        }
        return o;
    }
    return (
        Ba.forEach((i, o) => {
            let s = [];
            i.templateUrl &&
                s.push(
                    r(i.templateUrl).then((c) => {
                        i.template = c;
                    })
                );
            let a = typeof i.styles == "string" ? [i.styles] : i.styles || [];
            if (((i.styles = a), i.styleUrl && i.styleUrls?.length))
                throw new Error(
                    "@Component cannot define both `styleUrl` and `styleUrls`. Use `styleUrl` if the component has one stylesheet, or `styleUrls` if it has multiple"
                );
            if (i.styleUrls?.length) {
                let c = i.styles.length,
                    u = i.styleUrls;
                i.styleUrls.forEach((d, p) => {
                    (a.push(""),
                        s.push(
                            r(d).then((f) => {
                                ((a[c + p] = f),
                                    u.splice(u.indexOf(d), 1),
                                    u.length == 0 && (i.styleUrls = void 0));
                            })
                        ));
                });
            } else
                i.styleUrl &&
                    s.push(
                        r(i.styleUrl).then((c) => {
                            (a.push(c), (i.styleUrl = void 0));
                        })
                    );
            let l = Promise.all(s).then(() => WM(o));
            n.push(l);
        }),
        UM(),
        Promise.all(n).then(() => {})
    );
}
var Ba = new Map(),
    BM = new Set();
function UM() {
    let e = Ba;
    return ((Ba = new Map()), e);
}
function HM() {
    return Ba.size === 0;
}
function zM(e) {
    return typeof e == "string" ? e : e.text();
}
function WM(e) {
    BM.delete(e);
}
var Si = class {},
    pf = class {};
var Ua = class extends Si {
        ngModuleType;
        _parent;
        _bootstrapComponents = [];
        _r3Injector;
        instance;
        destroyCbs = [];
        componentFactoryResolver = new Va(this);
        constructor(n, t, r, i = !0) {
            (super(), (this.ngModuleType = n), (this._parent = t));
            let o = gm(n);
            ((this._bootstrapComponents = N_(o.bootstrap)),
                (this._r3Injector = t_(
                    n,
                    t,
                    [
                        { provide: Si, useValue: this },
                        {
                            provide: dl,
                            useValue: this.componentFactoryResolver,
                        },
                        ...r,
                    ],
                    st(n),
                    new Set(["environment"])
                )),
                i && this.resolveInjectorInitializers());
        }
        resolveInjectorInitializers() {
            (this._r3Injector.resolveInjectorInitializers(),
                (this.instance = this._r3Injector.get(this.ngModuleType)));
        }
        get injector() {
            return this._r3Injector;
        }
        destroy() {
            let n = this._r3Injector;
            (!n.destroyed && n.destroy(),
                this.destroyCbs.forEach((t) => t()),
                (this.destroyCbs = null));
        }
        onDestroy(n) {
            this.destroyCbs.push(n);
        }
    },
    Ha = class extends pf {
        moduleType;
        constructor(n) {
            (super(), (this.moduleType = n));
        }
        create(n) {
            return new Ua(this.moduleType, n, []);
        }
    };
function qM(e, n, t) {
    return new Ua(e, n, t, !1);
}
var nd = class extends Si {
    injector;
    componentFactoryResolver = new Va(this);
    instance = null;
    constructor(n) {
        super();
        let t = new xo(
            [
                ...n.providers,
                { provide: Si, useValue: this },
                { provide: dl, useValue: this.componentFactoryResolver },
            ],
            n.parent || Sd(),
            n.debugName,
            new Set(["environment"])
        );
        ((this.injector = t),
            n.runEnvironmentInitializers && t.resolveInjectorInitializers());
    }
    destroy() {
        this.injector.destroy();
    }
    onDestroy(n) {
        this.injector.onDestroy(n);
    }
};
function zo(e, n, t = null) {
    return new nd({
        providers: e,
        parent: n,
        debugName: t,
        runEnvironmentInitializers: !0,
    }).injector;
}
var GM = (() => {
    class e {
        _injector;
        cachedInjectors = new Map();
        constructor(t) {
            this._injector = t;
        }
        getOrCreateStandaloneInjector(t) {
            if (!t.standalone) return null;
            if (!this.cachedInjectors.has(t)) {
                let r = mm(!1, t.type),
                    i =
                        r.length > 0
                            ? zo(
                                  [r],
                                  this._injector,
                                  `Standalone[${t.type.name}]`
                              )
                            : null;
                this.cachedInjectors.set(t, i);
            }
            return this.cachedInjectors.get(t);
        }
        ngOnDestroy() {
            try {
                for (let t of this.cachedInjectors.values())
                    t !== null && t.destroy();
            } finally {
                this.cachedInjectors.clear();
            }
        }
        static ɵprov = w({
            token: e,
            providedIn: "environment",
            factory: () => new e(N(at)),
        });
    }
    return e;
})();
function R(e) {
    return Fo(() => {
        let n = Ey(e),
            t = oe(E({}, n), {
                decls: e.decls,
                vars: e.vars,
                template: e.template,
                consts: e.consts || null,
                ngContentSelectors: e.ngContentSelectors,
                onPush: e.changeDetection === u_.OnPush,
                directiveDefs: null,
                pipeDefs: null,
                dependencies: (n.standalone && e.dependencies) || null,
                getStandaloneInjector: n.standalone
                    ? (i) => i.get(GM).getOrCreateStandaloneInjector(t)
                    : null,
                getExternalStyles: null,
                signals: e.signals ?? !1,
                data: e.data || {},
                encapsulation: e.encapsulation || cn.Emulated,
                styles: e.styles || Ze,
                _: null,
                schemas: e.schemas || null,
                tView: null,
                id: "",
            });
        (n.standalone && Ri("NgStandalone"), Sy(t));
        let r = e.dependencies;
        return (
            (t.directiveDefs = Rg(r, !1)),
            (t.pipeDefs = Rg(r, !0)),
            (t.id = XM(t)),
            t
        );
    });
}
function YM(e) {
    return br(e) || jE(e);
}
function KM(e) {
    return e !== null;
}
function ge(e) {
    return Fo(() => ({
        type: e.type,
        bootstrap: e.bootstrap || Ze,
        declarations: e.declarations || Ze,
        imports: e.imports || Ze,
        exports: e.exports || Ze,
        transitiveCompileScopes: null,
        schemas: e.schemas || null,
        id: e.id || null,
    }));
}
function QM(e, n) {
    if (e == null) return vr;
    let t = {};
    for (let r in e)
        if (e.hasOwnProperty(r)) {
            let i = e[r],
                o,
                s,
                a,
                l;
            (Array.isArray(i)
                ? ((a = i[0]), (o = i[1]), (s = i[2] ?? o), (l = i[3] || null))
                : ((o = i), (s = i), (a = sl.None), (l = null)),
                (t[o] = [r, a, l]),
                (n[o] = s));
        }
    return t;
}
function ZM(e) {
    if (e == null) return vr;
    let n = {};
    for (let t in e) e.hasOwnProperty(t) && (n[e[t]] = t);
    return n;
}
function Me(e) {
    return Fo(() => {
        let n = Ey(e);
        return (Sy(n), n);
    });
}
function Ey(e) {
    let n = {};
    return {
        type: e.type,
        providersResolver: null,
        factory: null,
        hostBindings: e.hostBindings || null,
        hostVars: e.hostVars || 0,
        hostAttrs: e.hostAttrs || null,
        contentQueries: e.contentQueries || null,
        declaredInputs: n,
        inputConfig: e.inputs || vr,
        exportAs: e.exportAs || null,
        standalone: e.standalone ?? !0,
        signals: e.signals === !0,
        selectors: e.selectors || Ze,
        viewQuery: e.viewQuery || null,
        features: e.features || null,
        setInput: null,
        findHostDirectiveDefs: null,
        hostDirectives: null,
        inputs: QM(e.inputs, n),
        outputs: ZM(e.outputs),
        debugInfo: null,
    };
}
function Sy(e) {
    e.features?.forEach((n) => n(e));
}
function Rg(e, n) {
    if (!e) return null;
    let t = n ? BE : YM;
    return () => (typeof e == "function" ? e() : e).map((r) => t(r)).filter(KM);
}
function XM(e) {
    let n = 0,
        t = typeof e.consts == "function" ? "" : e.consts,
        r = [
            e.selectors,
            e.ngContentSelectors,
            e.hostVars,
            e.hostAttrs,
            t,
            e.vars,
            e.decls,
            e.encapsulation,
            e.standalone,
            e.signals,
            e.exportAs,
            JSON.stringify(e.inputs),
            JSON.stringify(e.outputs),
            Object.getOwnPropertyNames(e.type.prototype),
            !!e.contentQueries,
            !!e.viewQuery,
        ];
    for (let o of r.join("|")) n = (Math.imul(31, n) + o.charCodeAt(0)) << 0;
    return ((n += 2147483648), "c" + n);
}
function JM(e) {
    return Object.getPrototypeOf(e.prototype).constructor;
}
function be(e) {
    let n = JM(e.type),
        t = !0,
        r = [e];
    for (; n; ) {
        let i;
        if (on(e)) i = n.ɵcmp || n.ɵdir;
        else {
            if (n.ɵcmp) throw new S(903, !1);
            i = n.ɵdir;
        }
        if (i) {
            if (t) {
                r.push(i);
                let s = e;
                ((s.inputs = cu(e.inputs)),
                    (s.declaredInputs = cu(e.declaredInputs)),
                    (s.outputs = cu(e.outputs)));
                let a = i.hostBindings;
                a && iI(e, a);
                let l = i.viewQuery,
                    c = i.contentQueries;
                if (
                    (l && nI(e, l),
                    c && rI(e, c),
                    eI(e, i),
                    mE(e.outputs, i.outputs),
                    on(i) && i.data.animation)
                ) {
                    let u = e.data;
                    u.animation = (u.animation || []).concat(i.data.animation);
                }
            }
            let o = i.features;
            if (o)
                for (let s = 0; s < o.length; s++) {
                    let a = o[s];
                    (a && a.ngInherit && a(e), a === be && (t = !1));
                }
        }
        n = Object.getPrototypeOf(n);
    }
    tI(r);
}
function eI(e, n) {
    for (let t in n.inputs) {
        if (!n.inputs.hasOwnProperty(t) || e.inputs.hasOwnProperty(t)) continue;
        let r = n.inputs[t];
        r !== void 0 &&
            ((e.inputs[t] = r), (e.declaredInputs[t] = n.declaredInputs[t]));
    }
}
function tI(e) {
    let n = 0,
        t = null;
    for (let r = e.length - 1; r >= 0; r--) {
        let i = e[r];
        ((i.hostVars = n += i.hostVars),
            (i.hostAttrs = bi(i.hostAttrs, (t = bi(t, i.hostAttrs)))));
    }
}
function cu(e) {
    return e === vr ? {} : e === Ze ? [] : e;
}
function nI(e, n) {
    let t = e.viewQuery;
    t
        ? (e.viewQuery = (r, i) => {
              (n(r, i), t(r, i));
          })
        : (e.viewQuery = n);
}
function rI(e, n) {
    let t = e.contentQueries;
    t
        ? (e.contentQueries = (r, i, o) => {
              (n(r, i, o), t(r, i, o));
          })
        : (e.contentQueries = n);
}
function iI(e, n) {
    let t = e.hostBindings;
    t
        ? (e.hostBindings = (r, i) => {
              (n(r, i), t(r, i));
          })
        : (e.hostBindings = n);
}
function wy(e) {
    return hf(e)
        ? Array.isArray(e) || (!(e instanceof Map) && Symbol.iterator in e)
        : !1;
}
function oI(e, n) {
    if (Array.isArray(e)) for (let t = 0; t < e.length; t++) n(e[t]);
    else {
        let t = e[Symbol.iterator](),
            r;
        for (; !(r = t.next()).done; ) n(r.value);
    }
}
function hf(e) {
    return e !== null && (typeof e == "function" || typeof e == "object");
}
function fl(e, n, t) {
    return (e[n] = t);
}
function sI(e, n) {
    return e[n];
}
function dn(e, n, t) {
    let r = e[n];
    return Object.is(r, t) ? !1 : ((e[n] = t), !0);
}
function Dy(e, n, t, r) {
    let i = dn(e, n, t);
    return dn(e, n + 1, r) || i;
}
function aI(e, n, t, r, i) {
    let o = Dy(e, n, t, r);
    return dn(e, n + 2, i) || o;
}
function lI(e, n, t, r, i, o, s, a, l) {
    let c = n.consts,
        u = Ho(n, e, 4, s || null, a || null);
    (xd() && df(n, t, u, wr(c, l), tf),
        (u.mergedAttrs = bi(u.mergedAttrs, u.attrs)),
        Ld(n, u));
    let d = (u.tView = Zd(
        2,
        u,
        r,
        i,
        o,
        n.directiveRegistry,
        n.pipeRegistry,
        null,
        n.schemas,
        c,
        null
    ));
    return (
        n.queries !== null &&
            (n.queries.template(n, u),
            (d.queries = n.queries.embeddedTView(u))),
        u
    );
}
function My(e, n, t, r, i, o, s, a, l, c) {
    let u = t + Xe,
        d = n.firstCreatePass ? lI(u, n, e, r, i, o, s, a, l) : n.data[u];
    an(d, !1);
    let p = cI(n, e, d, t);
    (Vo() && ll(n, e, p, d), Ni(p, e));
    let f = iy(p, e, p, d);
    return (
        (e[u] = f),
        Jd(e, f),
        TM(f, d, e),
        nl(d) && al(n, e, d),
        l != null && ef(e, d, c),
        d
    );
}
function P(e, n, t, r, i, o, s, a) {
    let l = q(),
        c = De(),
        u = wr(c.consts, o);
    return (My(l, c, e, n, t, r, i, u, s, a), P);
}
var cI = uI;
function uI(e, n, t, r) {
    return (jo(!0), n[_e].createComment(""));
}
var Iy = (() => {
    class e {
        log(t) {
            console.log(t);
        }
        warn(t) {
            console.warn(t);
        }
        static ɵfac = function (r) {
            return new (r || e)();
        };
        static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "platform" });
    }
    return e;
})();
var gf = new O(""),
    Wo = new O(""),
    pl = (() => {
        class e {
            _ngZone;
            registry;
            _isZoneStable = !0;
            _callbacks = [];
            _taskTrackingZone = null;
            _destroyRef;
            constructor(t, r, i) {
                ((this._ngZone = t),
                    (this.registry = r),
                    wd() &&
                        (this._destroyRef = y(Pr, { optional: !0 }) ?? void 0),
                    mf || (dI(i), i.addToWindow(r)),
                    this._watchAngularEvents(),
                    t.run(() => {
                        this._taskTrackingZone =
                            typeof Zone > "u"
                                ? null
                                : Zone.current.get("TaskTrackingZone");
                    }));
            }
            _watchAngularEvents() {
                let t = this._ngZone.onUnstable.subscribe({
                        next: () => {
                            this._isZoneStable = !1;
                        },
                    }),
                    r = this._ngZone.runOutsideAngular(() =>
                        this._ngZone.onStable.subscribe({
                            next: () => {
                                (ne.assertNotInAngularZone(),
                                    queueMicrotask(() => {
                                        ((this._isZoneStable = !0),
                                            this._runCallbacksIfReady());
                                    }));
                            },
                        })
                    );
                this._destroyRef?.onDestroy(() => {
                    (t.unsubscribe(), r.unsubscribe());
                });
            }
            isStable() {
                return this._isZoneStable && !this._ngZone.hasPendingMacrotasks;
            }
            _runCallbacksIfReady() {
                if (this.isStable())
                    queueMicrotask(() => {
                        for (; this._callbacks.length !== 0; ) {
                            let t = this._callbacks.pop();
                            (clearTimeout(t.timeoutId), t.doneCb());
                        }
                    });
                else {
                    let t = this.getPendingTasks();
                    this._callbacks = this._callbacks.filter((r) =>
                        r.updateCb && r.updateCb(t)
                            ? (clearTimeout(r.timeoutId), !1)
                            : !0
                    );
                }
            }
            getPendingTasks() {
                return this._taskTrackingZone
                    ? this._taskTrackingZone.macroTasks.map((t) => ({
                          source: t.source,
                          creationLocation: t.creationLocation,
                          data: t.data,
                      }))
                    : [];
            }
            addCallback(t, r, i) {
                let o = -1;
                (r &&
                    r > 0 &&
                    (o = setTimeout(() => {
                        ((this._callbacks = this._callbacks.filter(
                            (s) => s.timeoutId !== o
                        )),
                            t());
                    }, r)),
                    this._callbacks.push({
                        doneCb: t,
                        timeoutId: o,
                        updateCb: i,
                    }));
            }
            whenStable(t, r, i) {
                if (i && !this._taskTrackingZone)
                    throw new Error(
                        'Task tracking zone is required when passing an update callback to whenStable(). Is "zone.js/plugins/task-tracking" loaded?'
                    );
                (this.addCallback(t, r, i), this._runCallbacksIfReady());
            }
            registerApplication(t) {
                this.registry.registerApplication(t, this);
            }
            unregisterApplication(t) {
                this.registry.unregisterApplication(t);
            }
            findProviders(t, r, i) {
                return [];
            }
            static ɵfac = function (r) {
                return new (r || e)(N(ne), N(hl), N(Wo));
            };
            static ɵprov = w({ token: e, factory: e.ɵfac });
        }
        return e;
    })(),
    hl = (() => {
        class e {
            _applications = new Map();
            registerApplication(t, r) {
                this._applications.set(t, r);
            }
            unregisterApplication(t) {
                this._applications.delete(t);
            }
            unregisterAllApplications() {
                this._applications.clear();
            }
            getTestability(t) {
                return this._applications.get(t) || null;
            }
            getAllTestabilities() {
                return Array.from(this._applications.values());
            }
            getAllRootElements() {
                return Array.from(this._applications.keys());
            }
            findTestabilityInTree(t, r = !0) {
                return mf?.findTestabilityInTree(this, t, r) ?? null;
            }
            static ɵfac = function (r) {
                return new (r || e)();
            };
            static ɵprov = w({
                token: e,
                factory: e.ɵfac,
                providedIn: "platform",
            });
        }
        return e;
    })();
function dI(e) {
    mf = e;
}
var mf,
    Ty = (() => {
        class e {
            static ɵprov = w({
                token: e,
                providedIn: "root",
                factory: () => new rd(),
            });
        }
        return e;
    })(),
    rd = class {
        queuedEffectCount = 0;
        queues = new Map();
        schedule(n) {
            this.enqueue(n);
        }
        remove(n) {
            let t = n.zone,
                r = this.queues.get(t);
            r.has(n) && (r.delete(n), this.queuedEffectCount--);
        }
        enqueue(n) {
            let t = n.zone;
            this.queues.has(t) || this.queues.set(t, new Set());
            let r = this.queues.get(t);
            r.has(n) || (this.queuedEffectCount++, r.add(n));
        }
        flush() {
            for (; this.queuedEffectCount > 0; )
                for (let [n, t] of this.queues)
                    n === null
                        ? this.flushQueue(t)
                        : n.run(() => this.flushQueue(t));
        }
        flushQueue(n) {
            for (let t of n) (n.delete(t), this.queuedEffectCount--, t.run());
        }
    };
function qo(e) {
    return !!e && typeof e.then == "function";
}
function xy(e) {
    return !!e && typeof e.subscribe == "function";
}
var Oy = new O("");
function Go(e) {
    return Ja([{ provide: Oy, multi: !0, useValue: e }]);
}
var Py = (() => {
        class e {
            resolve;
            reject;
            initialized = !1;
            done = !1;
            donePromise = new Promise((t, r) => {
                ((this.resolve = t), (this.reject = r));
            });
            appInits = y(Oy, { optional: !0 }) ?? [];
            injector = y(We);
            constructor() {}
            runInitializers() {
                if (this.initialized) return;
                let t = [];
                for (let i of this.appInits) {
                    let o = Nt(this.injector, i);
                    if (qo(o)) t.push(o);
                    else if (xy(o)) {
                        let s = new Promise((a, l) => {
                            o.subscribe({ complete: a, error: l });
                        });
                        t.push(s);
                    }
                }
                let r = () => {
                    ((this.done = !0), this.resolve());
                };
                (Promise.all(t)
                    .then(() => {
                        r();
                    })
                    .catch((i) => {
                        this.reject(i);
                    }),
                    t.length === 0 && r(),
                    (this.initialized = !0));
            }
            static ɵfac = function (r) {
                return new (r || e)();
            };
            static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" });
        }
        return e;
    })(),
    _f = new O("");
function fI() {
    Lc(() => {
        throw new S(600, !1);
    });
}
function pI(e) {
    return e.isBoundToModule;
}
var hI = 10;
function Ny(e, n) {
    return Array.isArray(n) ? n.reduce(Ny, e) : E(E({}, e), n);
}
var nr = (() => {
    class e {
        _runningTick = !1;
        _destroyed = !1;
        _destroyListeners = [];
        _views = [];
        internalErrorHandler = y(YS);
        afterRenderManager = y(y_);
        zonelessEnabled = y(r_);
        rootEffectScheduler = y(Ty);
        dirtyFlags = 0;
        tracingSnapshot = null;
        externalTestViews = new Set();
        afterTick = new Te();
        get allViews() {
            return [...this.externalTestViews.keys(), ...this._views];
        }
        get destroyed() {
            return this._destroyed;
        }
        componentTypes = [];
        components = [];
        isStable = y(Oi).hasPendingTasks.pipe(ee((t) => !t));
        constructor() {
            y(Ai, { optional: !0 });
        }
        whenStable() {
            let t;
            return new Promise((r) => {
                t = this.isStable.subscribe({
                    next: (i) => {
                        i && r();
                    },
                });
            }).finally(() => {
                t.unsubscribe();
            });
        }
        _injector = y(at);
        _rendererFactory = null;
        get injector() {
            return this._injector;
        }
        bootstrap(t, r) {
            return this.bootstrapImpl(t, r);
        }
        bootstrapImpl(t, r, i = We.NULL) {
            fe(10);
            let o = t instanceof fy;
            if (!this._injector.get(Py).done) {
                let f = "";
                throw new S(405, f);
            }
            let a;
            (o
                ? (a = t)
                : (a = this._injector.get(dl).resolveComponentFactory(t)),
                this.componentTypes.push(a.componentType));
            let l = pI(a) ? void 0 : this._injector.get(Si),
                c = r || a.selector,
                u = a.create(i, [], c, l),
                d = u.location.nativeElement,
                p = u.injector.get(gf, null);
            return (
                p?.registerApplication(d),
                u.onDestroy(() => {
                    (this.detachView(u.hostView),
                        Ca(this.components, u),
                        p?.unregisterApplication(d));
                }),
                this._loadComponent(u),
                fe(11, u),
                u
            );
        }
        tick() {
            (this.zonelessEnabled || (this.dirtyFlags |= 1), this._tick());
        }
        _tick() {
            (fe(12),
                this.tracingSnapshot !== null
                    ? this.tracingSnapshot.run(
                          zd.CHANGE_DETECTION,
                          this.tickImpl
                      )
                    : this.tickImpl());
        }
        tickImpl = () => {
            if (this._runningTick) throw new S(101, !1);
            let t = Y(null);
            try {
                ((this._runningTick = !0), this.synchronize());
            } catch (r) {
                this.internalErrorHandler(r);
            } finally {
                ((this._runningTick = !1),
                    this.tracingSnapshot?.dispose(),
                    (this.tracingSnapshot = null),
                    Y(t),
                    this.afterTick.next(),
                    fe(13));
            }
        };
        synchronize() {
            this._rendererFactory === null &&
                !this._injector.destroyed &&
                (this._rendererFactory = this._injector.get(tr, null, {
                    optional: !0,
                }));
            let t = 0;
            for (; this.dirtyFlags !== 0 && t++ < hI; )
                (fe(14), this.synchronizeOnce(), fe(15));
        }
        synchronizeOnce() {
            if (
                (this.dirtyFlags & 16 &&
                    ((this.dirtyFlags &= -17),
                    this.rootEffectScheduler.flush()),
                this.dirtyFlags & 7)
            ) {
                let t = !!(this.dirtyFlags & 1);
                ((this.dirtyFlags &= -8), (this.dirtyFlags |= 8));
                for (let { _lView: r, notifyErrorHandler: i } of this.allViews)
                    gI(r, i, t, this.zonelessEnabled);
                if (
                    ((this.dirtyFlags &= -5),
                    this.syncDirtyFlagsWithViews(),
                    this.dirtyFlags & 23)
                )
                    return;
            } else
                (this._rendererFactory?.begin?.(),
                    this._rendererFactory?.end?.());
            (this.dirtyFlags & 8 &&
                ((this.dirtyFlags &= -9), this.afterRenderManager.execute()),
                this.syncDirtyFlagsWithViews());
        }
        syncDirtyFlagsWithViews() {
            if (this.allViews.some(({ _lView: t }) => rl(t))) {
                this.dirtyFlags |= 2;
                return;
            } else this.dirtyFlags &= -8;
        }
        attachView(t) {
            let r = t;
            (this._views.push(r), r.attachToAppRef(this));
        }
        detachView(t) {
            let r = t;
            (Ca(this._views, r), r.detachFromAppRef());
        }
        _loadComponent(t) {
            (this.attachView(t.hostView),
                this.tick(),
                this.components.push(t),
                this._injector.get(_f, []).forEach((i) => i(t)));
        }
        ngOnDestroy() {
            if (!this._destroyed)
                try {
                    (this._destroyListeners.forEach((t) => t()),
                        this._views.slice().forEach((t) => t.destroy()));
                } finally {
                    ((this._destroyed = !0),
                        (this._views = []),
                        (this._destroyListeners = []));
                }
        }
        onDestroy(t) {
            return (
                this._destroyListeners.push(t),
                () => Ca(this._destroyListeners, t)
            );
        }
        destroy() {
            if (this._destroyed) throw new S(406, !1);
            let t = this._injector;
            t.destroy && !t.destroyed && t.destroy();
        }
        get viewCount() {
            return this._views.length;
        }
        static ɵfac = function (r) {
            return new (r || e)();
        };
        static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
    return e;
})();
function Ca(e, n) {
    let t = e.indexOf(n);
    t > -1 && e.splice(t, 1);
}
function gI(e, n, t, r) {
    if (!t && !rl(e)) return;
    ey(e, n, t && !r ? 0 : 1);
}
function se(e, n, t, r) {
    let i = q(),
        o = ol();
    if (dn(i, o, n)) {
        let s = De(),
            a = kd();
        cD(a, i, e, n, t, r);
    }
    return se;
}
function mI(e, n, t, r) {
    return dn(e, ol(), t) ? n + Qa(t) + r : gn;
}
function ga(e, n) {
    return (e << 17) | (n << 2);
}
function xr(e) {
    return (e >> 17) & 32767;
}
function _I(e) {
    return (e & 2) == 2;
}
function yI(e, n) {
    return (e & 131071) | (n << 17);
}
function id(e) {
    return e | 2;
}
function wi(e) {
    return (e & 131068) >> 2;
}
function uu(e, n) {
    return (e & -131069) | (n << 2);
}
function vI(e) {
    return (e & 1) === 1;
}
function od(e) {
    return e | 1;
}
function bI(e, n, t, r, i, o) {
    let s = o ? n.classBindings : n.styleBindings,
        a = xr(s),
        l = wi(s);
    e[r] = t;
    let c = !1,
        u;
    if (Array.isArray(t)) {
        let d = t;
        ((u = d[1]), (u === null || $o(d, u) > 0) && (c = !0));
    } else u = t;
    if (i)
        if (l !== 0) {
            let p = xr(e[a + 1]);
            ((e[r + 1] = ga(p, a)),
                p !== 0 && (e[p + 1] = uu(e[p + 1], r)),
                (e[a + 1] = yI(e[a + 1], r)));
        } else
            ((e[r + 1] = ga(a, 0)),
                a !== 0 && (e[a + 1] = uu(e[a + 1], r)),
                (a = r));
    else
        ((e[r + 1] = ga(l, 0)),
            a === 0 ? (a = r) : (e[l + 1] = uu(e[l + 1], r)),
            (l = r));
    (c && (e[r + 1] = id(e[r + 1])),
        kg(e, u, r, !0),
        kg(e, u, r, !1),
        CI(n, u, e, r, o),
        (s = ga(a, l)),
        o ? (n.classBindings = s) : (n.styleBindings = s));
}
function CI(e, n, t, r, i) {
    let o = i ? e.residualClasses : e.residualStyles;
    o != null &&
        typeof n == "string" &&
        $o(o, n) >= 0 &&
        (t[r + 1] = od(t[r + 1]));
}
function kg(e, n, t, r) {
    let i = e[t + 1],
        o = n === null,
        s = r ? xr(i) : wi(i),
        a = !1;
    for (; s !== 0 && (a === !1 || o); ) {
        let l = e[s],
            c = e[s + 1];
        (EI(l, n) && ((a = !0), (e[s + 1] = r ? od(c) : id(c))),
            (s = r ? xr(c) : wi(c)));
    }
    a && (e[t + 1] = r ? id(i) : od(i));
}
function EI(e, n) {
    return e === null || n == null || (Array.isArray(e) ? e[1] : e) === n
        ? !0
        : Array.isArray(e) && typeof n == "string"
          ? $o(e, n) >= 0
          : !1;
}
var Pe = { textEnd: 0, key: 0, keyEnd: 0, value: 0, valueEnd: 0 };
function Ay(e) {
    return e.substring(Pe.key, Pe.keyEnd);
}
function SI(e) {
    return e.substring(Pe.value, Pe.valueEnd);
}
function wI(e) {
    return (Ly(e), Ry(e, Di(e, 0, Pe.textEnd)));
}
function Ry(e, n) {
    let t = Pe.textEnd;
    return t === n
        ? -1
        : ((n = Pe.keyEnd = MI(e, (Pe.key = n), t)), Di(e, n, t));
}
function DI(e) {
    return (Ly(e), ky(e, Di(e, 0, Pe.textEnd)));
}
function ky(e, n) {
    let t = Pe.textEnd,
        r = (Pe.key = Di(e, n, t));
    return t === r
        ? -1
        : ((r = Pe.keyEnd = II(e, r, t)),
          (r = Lg(e, r, t, 58)),
          (r = Pe.value = Di(e, r, t)),
          (r = Pe.valueEnd = TI(e, r, t)),
          Lg(e, r, t, 59));
}
function Ly(e) {
    ((Pe.key = 0),
        (Pe.keyEnd = 0),
        (Pe.value = 0),
        (Pe.valueEnd = 0),
        (Pe.textEnd = e.length));
}
function Di(e, n, t) {
    for (; n < t && e.charCodeAt(n) <= 32; ) n++;
    return n;
}
function MI(e, n, t) {
    for (; n < t && e.charCodeAt(n) > 32; ) n++;
    return n;
}
function II(e, n, t) {
    let r;
    for (
        ;
        n < t &&
        ((r = e.charCodeAt(n)) === 45 ||
            r === 95 ||
            ((r & -33) >= 65 && (r & -33) <= 90) ||
            (r >= 48 && r <= 57));
    )
        n++;
    return n;
}
function Lg(e, n, t, r) {
    return ((n = Di(e, n, t)), n < t && n++, n);
}
function TI(e, n, t) {
    let r = -1,
        i = -1,
        o = -1,
        s = n,
        a = s;
    for (; s < t; ) {
        let l = e.charCodeAt(s++);
        if (l === 59) return a;
        (l === 34 || l === 39
            ? (a = s = Fg(e, l, s, t))
            : n === s - 4 && o === 85 && i === 82 && r === 76 && l === 40
              ? (a = s = Fg(e, 41, s, t))
              : l > 32 && (a = s),
            (o = i),
            (i = r),
            (r = l & -33));
    }
    return a;
}
function Fg(e, n, t, r) {
    let i = -1,
        o = t;
    for (; o < r; ) {
        let s = e.charCodeAt(o++);
        if (s == n && i !== 92) return o;
        s == 92 && i === 92 ? (i = 0) : (i = s);
    }
    throw new Error();
}
function b(e, n, t) {
    let r = q(),
        i = ol();
    if (dn(r, i, n)) {
        let o = De(),
            s = kd();
        $_(o, s, r, e, n, r[_e], t, !1);
    }
    return b;
}
function sd(e, n, t, r, i) {
    nf(n, e, t, i ? "class" : "style", r);
}
function yf(e, n, t) {
    return (Fy(e, n, t, !1), yf);
}
function Yo(e, n) {
    return (Fy(e, n, null, !0), Yo);
}
function Ko(e) {
    $y(By, xI, e, !1);
}
function xI(e, n) {
    for (let t = DI(n); t >= 0; t = ky(n, t)) By(e, Ay(n), SI(n));
}
function ke(e) {
    $y(LI, OI, e, !0);
}
function OI(e, n) {
    for (let t = wI(n); t >= 0; t = Ry(n, t)) Xa(e, Ay(n), !0);
}
function Fy(e, n, t, r) {
    let i = q(),
        o = De(),
        s = Lm(2);
    if ((o.firstUpdatePass && jy(o, e, s, r), n !== gn && dn(i, s, n))) {
        let a = o.data[Or()];
        Uy(o, a, i, i[_e], e, (i[s + 1] = $I(n, t)), r, s);
    }
}
function $y(e, n, t, r) {
    let i = De(),
        o = Lm(2);
    i.firstUpdatePass && jy(i, null, o, r);
    let s = q();
    if (t !== gn && dn(s, o, t)) {
        let a = i.data[Or()];
        if (Hy(a, r) && !Vy(i, o)) {
            let l = r ? a.classesWithoutHost : a.stylesWithoutHost;
            (l !== null && (t = gu(l, t || "")), sd(i, a, s, t, r));
        } else FI(i, a, s, s[_e], s[o + 1], (s[o + 1] = kI(e, n, t)), r, o);
    }
}
function Vy(e, n) {
    return n >= e.expandoStartIndex;
}
function jy(e, n, t, r) {
    let i = e.data;
    if (i[t + 1] === null) {
        let o = i[Or()],
            s = Vy(e, t);
        (Hy(o, r) && n === null && !s && (n = !1),
            (n = PI(i, o, n, r)),
            bI(i, o, n, t, s, r));
    }
}
function PI(e, n, t, r) {
    let i = bS(e),
        o = r ? n.residualClasses : n.residualStyles;
    if (i === null)
        (r ? n.classBindings : n.styleBindings) === 0 &&
            ((t = du(null, e, n, t, r)), (t = Lo(t, n.attrs, r)), (o = null));
    else {
        let s = n.directiveStylingLast;
        if (s === -1 || e[s] !== i)
            if (((t = du(i, e, n, t, r)), o === null)) {
                let l = NI(e, n, r);
                l !== void 0 &&
                    Array.isArray(l) &&
                    ((l = du(null, e, n, l[1], r)),
                    (l = Lo(l, n.attrs, r)),
                    AI(e, n, r, l));
            } else o = RI(e, n, r);
    }
    return (
        o !== void 0 && (r ? (n.residualClasses = o) : (n.residualStyles = o)),
        t
    );
}
function NI(e, n, t) {
    let r = t ? n.classBindings : n.styleBindings;
    if (wi(r) !== 0) return e[xr(r)];
}
function AI(e, n, t, r) {
    let i = t ? n.classBindings : n.styleBindings;
    e[xr(i)] = r;
}
function RI(e, n, t) {
    let r,
        i = n.directiveEnd;
    for (let o = 1 + n.directiveStylingLast; o < i; o++) {
        let s = e[o].hostAttrs;
        r = Lo(r, s, t);
    }
    return Lo(r, n.attrs, t);
}
function du(e, n, t, r, i) {
    let o = null,
        s = t.directiveEnd,
        a = t.directiveStylingLast;
    for (
        a === -1 ? (a = t.directiveStart) : a++;
        a < s && ((o = n[a]), (r = Lo(r, o.hostAttrs, i)), o !== e);
    )
        a++;
    return (e !== null && (t.directiveStylingLast = a), r);
}
function Lo(e, n, t) {
    let r = t ? 1 : 2,
        i = -1;
    if (n !== null)
        for (let o = 0; o < n.length; o++) {
            let s = n[o];
            typeof s == "number"
                ? (i = s)
                : i === r &&
                  (Array.isArray(e) || (e = e === void 0 ? [] : ["", e]),
                  Xa(e, s, t ? !0 : n[++o]));
        }
    return e === void 0 ? null : e;
}
function kI(e, n, t) {
    if (t == null || t === "") return Ze;
    let r = [],
        i = Bo(t);
    if (Array.isArray(i)) for (let o = 0; o < i.length; o++) e(r, i[o], !0);
    else if (typeof i == "object")
        for (let o in i) i.hasOwnProperty(o) && e(r, o, i[o]);
    else typeof i == "string" && n(r, i);
    return r;
}
function By(e, n, t) {
    Xa(e, n, Bo(t));
}
function LI(e, n, t) {
    let r = String(n);
    r !== "" && !r.includes(" ") && Xa(e, r, t);
}
function FI(e, n, t, r, i, o, s, a) {
    i === gn && (i = Ze);
    let l = 0,
        c = 0,
        u = 0 < i.length ? i[0] : null,
        d = 0 < o.length ? o[0] : null;
    for (; u !== null || d !== null; ) {
        let p = l < i.length ? i[l + 1] : void 0,
            f = c < o.length ? o[c + 1] : void 0,
            h = null,
            _;
        (u === d
            ? ((l += 2), (c += 2), p !== f && ((h = d), (_ = f)))
            : d === null || (u !== null && u < d)
              ? ((l += 2), (h = u))
              : ((c += 2), (h = d), (_ = f)),
            h !== null && Uy(e, n, t, r, h, _, s, a),
            (u = l < i.length ? i[l] : null),
            (d = c < o.length ? o[c] : null));
    }
}
function Uy(e, n, t, r, i, o, s, a) {
    if (!(n.type & 3)) return;
    let l = e.data,
        c = l[a + 1],
        u = vI(c) ? $g(l, n, t, i, wi(c), s) : void 0;
    if (!za(u)) {
        za(o) || (_I(c) && (o = $g(l, null, t, i, a, s)));
        let d = Tm(Or(), t);
        wD(r, s, d, i, o);
    }
}
function $g(e, n, t, r, i, o) {
    let s = n === null,
        a;
    for (; i > 0; ) {
        let l = e[i],
            c = Array.isArray(l),
            u = c ? l[1] : l,
            d = u === null,
            p = t[i + 1];
        p === gn && (p = d ? Ze : void 0);
        let f = d ? tu(p, r) : u === r ? p : void 0;
        if ((c && !za(f) && (f = tu(l, r)), za(f) && ((a = f), s))) return a;
        let h = e[i + 1];
        i = s ? xr(h) : wi(h);
    }
    if (n !== null) {
        let l = o ? n.residualClasses : n.residualStyles;
        l != null && (a = tu(l, r));
    }
    return a;
}
function za(e) {
    return e !== void 0;
}
function $I(e, n) {
    return (
        e == null ||
            e === "" ||
            (typeof n == "string"
                ? (e = e + n)
                : typeof e == "object" && (e = st(Bo(e)))),
        e
    );
}
function Hy(e, n) {
    return (e.flags & (n ? 8 : 16)) !== 0;
}
function m(e, n, t, r) {
    let i = q(),
        o = De(),
        s = Xe + e,
        a = i[_e],
        l = o.firstCreatePass ? gy(s, o, i, n, tf, xd(), t, r) : o.data[s],
        c = VI(o, i, l, a, n, e);
    i[s] = c;
    let u = nl(l);
    return (
        an(l, !0),
        T_(a, c, l),
        !sf(l) && Vo() && ll(o, i, c, l),
        (uS() === 0 || u) && Ni(c, i),
        dS(),
        u && (al(o, i, l), Gd(o, l, i)),
        r !== null && ef(i, l),
        m
    );
}
function g() {
    let e = et();
    Od() ? Pd() : ((e = e.parent), an(e, !1));
    let n = e;
    (pS(n) && hS(), fS());
    let t = De();
    return (
        t.firstCreatePass && my(t, n),
        n.classesWithoutHost != null &&
            MS(n) &&
            sd(t, n, q(), n.classesWithoutHost, !0),
        n.stylesWithoutHost != null &&
            IS(n) &&
            sd(t, n, q(), n.stylesWithoutHost, !1),
        g
    );
}
function D(e, n, t, r) {
    return (m(e, n, t, r), g(), D);
}
var VI = (e, n, t, r, i, o) => (jo(!0), Kd(r, i, SS()));
function jI(e, n, t, r, i) {
    let o = n.consts,
        s = wr(o, r),
        a = Ho(n, e, 8, "ng-container", s);
    s !== null && Ku(a, s, !0);
    let l = wr(o, i);
    return (
        xd() && df(n, t, a, l, tf),
        (a.mergedAttrs = bi(a.mergedAttrs, a.attrs)),
        n.queries !== null && n.queries.elementStart(n, a),
        a
    );
}
function ut(e, n, t) {
    let r = q(),
        i = De(),
        o = e + Xe,
        s = i.firstCreatePass ? jI(o, i, r, n, t) : i.data[o];
    an(s, !0);
    let a = BI(i, r, s, e);
    return (
        (r[o] = a),
        Vo() && ll(i, r, a, s),
        Ni(a, r),
        nl(s) && (al(i, r, s), Gd(i, s, r)),
        t != null && ef(r, s),
        ut
    );
}
function dt() {
    let e = et(),
        n = De();
    return (
        Od() ? Pd() : ((e = e.parent), an(e, !1)),
        n.firstCreatePass && (Ld(n, e), Dd(e) && n.queries.elementEnd(e)),
        dt
    );
}
function rr(e, n, t) {
    return (ut(e, n, t), dt(), rr);
}
var BI = (e, n, t, r) => (jo(!0), M_(n[_e], ""));
function Li() {
    return q();
}
var Wa = "en-US";
var UI = { marker: "element" },
    HI = { marker: "ICU" },
    Pn = (function (e) {
        return (
            (e[(e.SHIFT = 2)] = "SHIFT"),
            (e[(e.APPEND_EAGERLY = 1)] = "APPEND_EAGERLY"),
            (e[(e.COMMENT = 2)] = "COMMENT"),
            e
        );
    })(Pn || {}),
    zI = Wa;
function WI(e) {
    typeof e == "string" && (zI = e.toLowerCase().replace(/_/g, "-"));
}
function qI(e, n, t) {
    let r = e[_e];
    switch (t) {
        case Node.COMMENT_NODE:
            return M_(r, n);
        case Node.TEXT_NODE:
            return D_(r, n);
        case Node.ELEMENT_NODE:
            return Kd(r, n, null);
    }
}
var GI = (e, n, t, r) => (jo(!0), qI(e, t, r));
function YI(e, n, t, r) {
    let i = e[_e];
    for (let o = 0; o < n.length; o++) {
        let s = n[o++],
            a = n[o],
            l = (s & Pn.COMMENT) === Pn.COMMENT,
            c = (s & Pn.APPEND_EAGERLY) === Pn.APPEND_EAGERLY,
            u = s >>> Pn.SHIFT,
            d = e[u],
            p = !1;
        (d === null &&
            ((d = e[u] = GI(e, u, a, l ? Node.COMMENT_NODE : Node.TEXT_NODE)),
            (p = Vo())),
            c && t !== null && p && Ci(i, t, d, r, !1));
    }
}
var qa = /�(\d+):?\d*�/gi;
var KI = /�(\d+)�/,
    zy = /^\s*(�\d+:?\d*�)\s*,\s*(select|plural)\s*,/,
    Io = "\uFFFD",
    QI = /�\/?\*(\d+:\d+)�/gi,
    ZI = /�(\/?[#*]\d+):?\d*�/gi,
    XI = /\uE500/g;
function JI(e) {
    return e.replace(XI, " ");
}
function e1(e, n, t, r, i, o) {
    let s = No(),
        a = [],
        l = [],
        c = [[]],
        u = [[]];
    i = n1(i, o);
    let d = JI(i).split(ZI);
    for (let p = 0; p < d.length; p++) {
        let f = d[p];
        if ((p & 1) === 0) {
            let h = ld(f);
            for (let _ = 0; _ < h.length; _++) {
                let M = h[_];
                if ((_ & 1) === 0) {
                    let I = M;
                    I !== "" && t1(u[0], e, s, c[0], a, l, t, I);
                } else {
                    let I = M;
                    if (typeof I != "object")
                        throw new Error(
                            `Unable to parse ICU expression in "${i}" message.`
                        );
                    let J = Wy(e, s, c[0], t, a, "", !0).index;
                    Gy(u[0], e, t, l, n, I, J);
                }
            }
        } else {
            let h = f.charCodeAt(0) === 47,
                _ = f.charCodeAt(h ? 1 : 0),
                M = Xe + Number.parseInt(f.substring(h ? 2 : 1));
            if (h) (c.shift(), u.shift(), an(No(), !1));
            else {
                let I = KD(e, c[0], M);
                (c.unshift([]), an(I, !0));
                let j = {
                    kind: 2,
                    index: M,
                    children: [],
                    type: _ === 35 ? 0 : 1,
                };
                (u[0].push(j), u.unshift(j.children));
            }
        }
    }
    e.data[r] = { create: a, update: l, ast: u[0], parentTNodeIndex: n };
}
function Wy(e, n, t, r, i, o, s) {
    let a = Uo(e, r, 1, null),
        l = a << Pn.SHIFT,
        c = No();
    (n === c && (c = null),
        c === null && (l |= Pn.APPEND_EAGERLY),
        s && ((l |= Pn.COMMENT), mD(JD)),
        i.push(l, o === null ? "" : o));
    let u = uf(e, a, s ? 32 : 1, o === null ? "" : o, null);
    cy(t, u);
    let d = u.index;
    return (an(u, !1), c !== null && n !== c && YD(c, d), u);
}
function t1(e, n, t, r, i, o, s, a) {
    let l = a.match(qa),
        u = Wy(n, t, r, s, i, l ? null : a, !1).index;
    (l && ad(o, a, u, null, 0, null), e.push({ kind: 0, index: u }));
}
function ad(e, n, t, r, i, o) {
    let s = e.length,
        a = s + 1;
    e.push(null, null);
    let l = s + 2,
        c = n.split(qa),
        u = 0;
    for (let d = 0; d < c.length; d++) {
        let p = c[d];
        if (d & 1) {
            let f = i + parseInt(p, 10);
            (e.push(-1 - f), (u = u | qy(f)));
        } else p !== "" && e.push(p);
    }
    return (
        e.push((t << 2) | (r ? 1 : 0)),
        r && e.push(r, o),
        (e[s] = u),
        (e[a] = e.length - l),
        u
    );
}
function qy(e) {
    return 1 << Math.min(e, 31);
}
function Vg(e) {
    let n,
        t = "",
        r = 0,
        i = !1,
        o;
    for (; (n = QI.exec(e)) !== null; )
        i
            ? n[0] === `${Io}/*${o}${Io}` && ((r = n.index), (i = !1))
            : ((t += e.substring(r, n.index + n[0].length)),
              (o = n[1]),
              (i = !0));
    return ((t += e.slice(r)), t);
}
function n1(e, n) {
    if (XD(n)) return Vg(e);
    {
        let t = e.indexOf(`:${n}${Io}`) + 2 + n.toString().length,
            r = e.search(new RegExp(`${Io}\\/\\*\\d+:${n}${Io}`));
        return Vg(e.substring(t, r));
    }
}
function Gy(e, n, t, r, i, o, s) {
    let a = 0,
        l = {
            type: o.type,
            currentCaseLViewIndex: Uo(n, t, 1, null),
            anchorIdx: s,
            cases: [],
            create: [],
            remove: [],
            update: [],
        };
    (s1(r, o, s), GD(n, s, l));
    let c = o.values,
        u = [];
    for (let d = 0; d < c.length; d++) {
        let p = c[d],
            f = [];
        for (let _ = 0; _ < p.length; _++) {
            let M = p[_];
            if (typeof M != "string") {
                let I = f.push(M) - 1;
                p[_] = `<!--\uFFFD${I}\uFFFD-->`;
            }
        }
        let h = [];
        (u.push(h), (a = i1(h, n, l, t, r, i, o.cases[d], p.join(""), f) | a));
    }
    (a && a1(r, a, s),
        e.push({
            kind: 3,
            index: s,
            cases: u,
            currentCaseLViewIndex: l.currentCaseLViewIndex,
        }));
}
function r1(e) {
    let n = [],
        t = [],
        r = 1,
        i = 0;
    e = e.replace(zy, function (s, a, l) {
        return (
            l === "select" ? (r = 0) : (r = 1),
            (i = parseInt(a.slice(1), 10)),
            ""
        );
    });
    let o = ld(e);
    for (let s = 0; s < o.length; ) {
        let a = o[s++].trim();
        (r === 1 && (a = a.replace(/\s*(?:=)?(\w+)\s*/, "$1")),
            a.length && n.push(a));
        let l = ld(o[s++]);
        n.length > t.length && t.push(l);
    }
    return { type: r, mainBinding: i, cases: n, values: t };
}
function ld(e) {
    if (!e) return [];
    let n = 0,
        t = [],
        r = [],
        i = /[{}]/g;
    i.lastIndex = 0;
    let o;
    for (; (o = i.exec(e)); ) {
        let a = o.index;
        if (o[0] == "}") {
            if ((t.pop(), t.length == 0)) {
                let l = e.substring(n, a);
                (zy.test(l) ? r.push(r1(l)) : r.push(l), (n = a + 1));
            }
        } else {
            if (t.length == 0) {
                let l = e.substring(n, a);
                (r.push(l), (n = a + 1));
            }
            t.push("{");
        }
    }
    let s = e.substring(n);
    return (r.push(s), r);
}
function i1(e, n, t, r, i, o, s, a, l) {
    let c = [],
        u = [],
        d = [];
    (t.cases.push(s), t.create.push(c), t.remove.push(u), t.update.push(d));
    let f = vw(m_()).getInertBodyElement(a),
        h = xw(f) || f;
    return h ? Yy(e, n, t, r, i, c, u, d, h, o, l, 0) : 0;
}
function Yy(e, n, t, r, i, o, s, a, l, c, u, d) {
    let p = 0,
        f = l.firstChild;
    for (; f; ) {
        let h = Uo(n, r, 1, null);
        switch (f.nodeType) {
            case Node.ELEMENT_NODE:
                let _ = f,
                    M = _.tagName.toLowerCase();
                if (Mw.hasOwnProperty(M)) {
                    (fu(o, UI, M, c, h), (n.data[h] = M));
                    let Q = _.attributes;
                    for (let xe = 0; xe < Q.length; xe++) {
                        let ae = Q.item(xe),
                            me = ae.name.toLowerCase();
                        !!ae.value.match(qa)
                            ? Mg.hasOwnProperty(me) &&
                              ad(a, ae.value, h, ae.name, 0, Ig[me] ? C_ : null)
                            : Mg[me] &&
                              (Ig[me]
                                  ? Bg(o, h, ae.name, "unsafe:blocked")
                                  : Bg(o, h, ae.name, ae.value));
                    }
                    let He = { kind: 1, index: h, children: [] };
                    (e.push(He),
                        (p =
                            Yy(
                                He.children,
                                n,
                                t,
                                r,
                                i,
                                o,
                                s,
                                a,
                                f,
                                h,
                                u,
                                d + 1
                            ) | p),
                        jg(s, h, d));
                }
                break;
            case Node.TEXT_NODE:
                let I = f.textContent || "",
                    j = I.match(qa);
                (fu(o, null, j ? "" : I, c, h),
                    jg(s, h, d),
                    j && (p = ad(a, I, h, null, 0, null) | p),
                    e.push({ kind: 0, index: h }));
                break;
            case Node.COMMENT_NODE:
                let J = KI.exec(f.textContent || "");
                if (J) {
                    let Q = parseInt(J[1], 10),
                        He = u[Q];
                    (fu(o, HI, "", c, h),
                        Gy(e, n, r, i, c, He, h),
                        o1(s, h, d));
                }
                break;
        }
        f = f.nextSibling;
    }
    return p;
}
function jg(e, n, t) {
    t === 0 && e.push(n);
}
function o1(e, n, t) {
    t === 0 && (e.push(~n), e.push(n));
}
function s1(e, n, t) {
    e.push(qy(n.mainBinding), 2, -1 - n.mainBinding, (t << 2) | 2);
}
function a1(e, n, t) {
    e.push(n, 1, (t << 2) | 3);
}
function fu(e, n, t, r, i) {
    (n !== null && e.push(n), e.push(t, i, ZD(0, r, i)));
}
function Bg(e, n, t, r) {
    e.push((n << 1) | 1, t, r);
}
function ir(e, n, t = -1) {
    let r = De(),
        i = q(),
        o = Xe + e,
        s = wr(r.consts, n),
        a = No();
    if (
        (r.firstCreatePass && e1(r, a === null ? 0 : a.index, i, o, s, t),
        r.type === 2)
    ) {
        let p = i[bt];
        p[L] |= 32;
    } else i[L] |= 32;
    let l = r.data[o],
        c = a === i[Je] ? null : a,
        u = H_(r, c, i),
        d = a && a.type & 8 ? i[a.index] : null;
    (tM(i, o, a, t), YI(i, l.create, u, d), Fm(!0));
}
function or() {
    Fm(!1);
}
function Le(e, n, t) {
    (ir(e, n, t), or());
}
function Ug(e, n, t) {
    return function r(i) {
        if (i === Function) return t;
        let o = Ii(e) ? sn(e.index, n) : n;
        cf(o, 5);
        let s = n[lt],
            a = Hg(n, s, t, i),
            l = r.__ngNextListenerFn__;
        for (; l; ) ((a = Hg(n, s, l, i) && a), (l = l.__ngNextListenerFn__));
        return a;
    };
}
function Hg(e, n, t, r) {
    let i = Y(null);
    try {
        return (fe(6, n, t), t(r) !== !1);
    } catch (o) {
        return (l1(e, o), !1);
    } finally {
        (fe(7, n, t), Y(i));
    }
}
function l1(e, n) {
    let t = e[yi],
        r = t ? t.get(ln, null) : null;
    r && r.handleError(n);
}
function zg(e, n, t, r, i, o) {
    let s = n[t],
        a = n[z],
        c = a.data[t].outputs[r],
        u = s[c],
        d = a.firstCreatePass ? Td(a) : null,
        p = Id(n),
        f = u.subscribe(o),
        h = p.length;
    (p.push(o, f), d && d.push(i, e.index, h, -(h + 1)));
}
function qe(e, n, t, r) {
    let i = q(),
        o = De(),
        s = et();
    return (Ky(o, i, i[_e], s, e, n, r), qe);
}
function c1(e, n, t, r) {
    let i = e.cleanup;
    if (i != null)
        for (let o = 0; o < i.length - 1; o += 2) {
            let s = i[o];
            if (s === t && i[o + 1] === r) {
                let a = n[Ia],
                    l = i[o + 2];
                return a.length > l ? a[l] : null;
            }
            typeof s == "string" && (o += 2);
        }
    return null;
}
function Ky(e, n, t, r, i, o, s) {
    let a = nl(r),
        c = e.firstCreatePass ? Td(e) : null,
        u = Id(n),
        d = !0;
    if (r.type & 3 || s) {
        let p = fn(r, n),
            f = s ? s(p) : p,
            h = u.length,
            _ = s ? (I) => s(Yt(I[r.index])) : r.index,
            M = null;
        if ((!s && a && (M = c1(e, n, i, r.index)), M !== null)) {
            let I = M.__ngLastListenerFn__ || M;
            ((I.__ngNextListenerFn__ = o),
                (M.__ngLastListenerFn__ = o),
                (d = !1));
        } else {
            ((o = Ug(r, n, o)), hw(n, f, i, o));
            let I = t.listen(f, i, o);
            (u.push(o, I), c && c.push(i, _, h, h + 1));
        }
    } else o = Ug(r, n, o);
    if (d) {
        let p = r.outputs?.[i],
            f = r.hostDirectiveOutputs?.[i];
        if (f && f.length)
            for (let h = 0; h < f.length; h += 2) {
                let _ = f[h],
                    M = f[h + 1];
                zg(r, n, _, M, i, o);
            }
        if (p && p.length) for (let h of p) zg(r, n, h, i, i, o);
    }
}
function G(e = 1) {
    return ES(e);
}
function u1(e, n) {
    let t = null,
        r = Ww(e);
    for (let i = 0; i < n.length; i++) {
        let o = n[i];
        if (o === "*") {
            t = i;
            continue;
        }
        if (r === null ? R_(e, o, !0) : Yw(r, o)) return i;
    }
    return t;
}
function Ct(e) {
    let n = q()[bt][Je];
    if (!n.projection) {
        let t = e ? e.length : 1,
            r = (n.projection = FE(t, null)),
            i = r.slice(),
            o = n.child;
        for (; o !== null; ) {
            if (o.type !== 128) {
                let s = e ? u1(o, e) : 0;
                s !== null &&
                    (i[s] ? (i[s].projectionNext = o) : (r[s] = o), (i[s] = o));
            }
            o = o.next;
        }
    }
}
function Ge(e, n = 0, t, r, i, o) {
    let s = q(),
        a = De(),
        l = r ? e + 1 : null;
    l !== null && My(s, a, l, r, i, o, null, t);
    let c = Ho(a, Xe + e, 16, null, t || null);
    (c.projection === null && (c.projection = n), Pd());
    let d = !s[Oo] || Am();
    s[bt][Je].projection[c.projection] === null && l !== null
        ? d1(s, a, l)
        : d && !sf(c) && ED(a, s, c);
}
function d1(e, n, t) {
    let r = Xe + t,
        i = n.data[r],
        o = e[r],
        s = qu(o, i.tView.ssrId),
        a = V_(e, i, void 0, { dehydratedView: s });
    oy(o, a, 0, Vu(i, s));
}
function nt(e, n, t, r) {
    LM(e, n, t, r);
}
function gl(e, n, t) {
    kM(e, n, t);
}
function Fe(e) {
    let n = q(),
        t = De(),
        r = $m();
    Nd(r + 1);
    let i = ff(t, r);
    if (e.dirty && oS(n) === ((i.metadata.flags & 2) === 2)) {
        if (i.matches === null) e.reset([]);
        else {
            let o = VM(n, r);
            (e.reset(o, ZS), e.notifyOnChanges());
        }
        return !0;
    }
    return !1;
}
function $e() {
    return RM(q(), $m());
}
function Qy(e) {
    let n = gS();
    return iS(n, Xe + e);
}
function C(e, n = "") {
    let t = q(),
        r = De(),
        i = e + Xe,
        o = r.firstCreatePass ? Ho(r, i, 1, n, null) : r.data[i],
        s = f1(r, t, o, n, e);
    ((t[i] = s), Vo() && ll(r, t, s, o), an(o, !1));
}
var f1 = (e, n, t, r, i) => (jo(!0), D_(n[_e], r));
function Ce(e) {
    return (ft("", e, ""), Ce);
}
function ft(e, n, t) {
    let r = q(),
        i = mI(r, e, n, t);
    return (i !== gn && p1(r, Or(), i), ft);
}
function p1(e, n, t) {
    let r = Tm(n, e);
    kw(e[_e], r, t);
}
function vf(e, n, t) {
    l_(n) && (n = n());
    let r = q(),
        i = ol();
    if (dn(r, i, n)) {
        let o = De(),
            s = kd();
        $_(o, s, r, e, n, r[_e], t, !1);
    }
    return vf;
}
function Zy(e, n) {
    let t = l_(e);
    return (t && e.set(n), t);
}
function bf(e, n) {
    let t = q(),
        r = De(),
        i = et();
    return (Ky(r, t, t[_e], i, e, n), bf);
}
function h1(e, n, t) {
    let r = De();
    if (r.firstCreatePass) {
        let i = on(e);
        (cd(t, r.data, r.blueprint, i, !0), cd(n, r.data, r.blueprint, i, !1));
    }
}
function cd(e, n, t, r, i) {
    if (((e = Qe(e)), Array.isArray(e)))
        for (let o = 0; o < e.length; o++) cd(e[o], n, t, r, i);
    else {
        let o = De(),
            s = q(),
            a = et(),
            l = _i(e) ? e : Qe(e.provide),
            c = vm(e),
            u = a.providerIndexes & 1048575,
            d = a.directiveStart,
            p = a.providerIndexes >> 20;
        if (_i(e) || !e.multi) {
            let f = new Ir(c, i, Se),
                h = hu(l, n, i ? u : u + p, d);
            h === -1
                ? (Iu(Aa(a, s), o, l),
                  pu(o, e, n.length),
                  n.push(l),
                  a.directiveStart++,
                  a.directiveEnd++,
                  i && (a.providerIndexes += 1048576),
                  t.push(f),
                  s.push(f))
                : ((t[h] = f), (s[h] = f));
        } else {
            let f = hu(l, n, u + p, d),
                h = hu(l, n, u, u + p),
                _ = f >= 0 && t[f],
                M = h >= 0 && t[h];
            if ((i && !M) || (!i && !_)) {
                Iu(Aa(a, s), o, l);
                let I = _1(i ? m1 : g1, t.length, i, r, c);
                (!i && M && (t[h].providerFactory = I),
                    pu(o, e, n.length, 0),
                    n.push(l),
                    a.directiveStart++,
                    a.directiveEnd++,
                    i && (a.providerIndexes += 1048576),
                    t.push(I),
                    s.push(I));
            } else {
                let I = Xy(t[i ? h : f], c, !i && r);
                pu(o, e, f > -1 ? f : h, I);
            }
            !i && r && M && t[h].componentProviders++;
        }
    }
}
function pu(e, n, t, r) {
    let i = _i(n),
        o = qE(n);
    if (i || o) {
        let l = (o ? Qe(n.useClass) : n).prototype.ngOnDestroy;
        if (l) {
            let c = e.destroyHooks || (e.destroyHooks = []);
            if (!i && n.multi) {
                let u = c.indexOf(t);
                u === -1 ? c.push(t, [r, l]) : c[u + 1].push(r, l);
            } else c.push(t, l);
        }
    }
}
function Xy(e, n, t) {
    return (t && e.componentProviders++, e.multi.push(n) - 1);
}
function hu(e, n, t, r) {
    for (let i = t; i < r; i++) if (n[i] === e) return i;
    return -1;
}
function g1(e, n, t, r, i) {
    return ud(this.multi, []);
}
function m1(e, n, t, r, i) {
    let o = this.multi,
        s;
    if (this.providerFactory) {
        let a = this.providerFactory.componentProviders,
            l = Ao(r, r[z], this.providerFactory.index, i);
        ((s = l.slice(0, a)), ud(o, s));
        for (let c = a; c < l.length; c++) s.push(l[c]);
    } else ((s = []), ud(o, s));
    return s;
}
function ud(e, n) {
    for (let t = 0; t < e.length; t++) {
        let r = e[t];
        n.push(r());
    }
    return n;
}
function _1(e, n, t, r, i) {
    let o = new Ir(e, t, Se);
    return (
        (o.multi = []),
        (o.index = n),
        (o.componentProviders = 0),
        Xy(o, i, r && !t),
        o
    );
}
function Rt(e, n = []) {
    return (t) => {
        t.providersResolver = (r, i) => h1(r, i ? i(e) : e, n);
    };
}
function Jy(e, n, t) {
    let r = il() + e,
        i = q();
    return i[r] === gn ? fl(i, r, t ? n.call(t) : n()) : sI(i, r);
}
function Fi(e, n, t, r) {
    return y1(q(), il(), e, n, t, r);
}
function ev(e, n, t, r, i) {
    return v1(q(), il(), e, n, t, r, i);
}
function tv(e, n, t, r, i, o) {
    return b1(q(), il(), e, n, t, r, i, o);
}
function Cf(e, n) {
    let t = e[n];
    return t === gn ? void 0 : t;
}
function y1(e, n, t, r, i, o) {
    let s = n + t;
    return dn(e, s, i) ? fl(e, s + 1, o ? r.call(o, i) : r(i)) : Cf(e, s + 1);
}
function v1(e, n, t, r, i, o, s) {
    let a = n + t;
    return Dy(e, a, i, o)
        ? fl(e, a + 2, s ? r.call(s, i, o) : r(i, o))
        : Cf(e, a + 2);
}
function b1(e, n, t, r, i, o, s, a) {
    let l = n + t;
    return aI(e, l, i, o, s)
        ? fl(e, l + 3, a ? r.call(a, i, o, s) : r(i, o, s))
        : Cf(e, l + 3);
}
function Ef(e, n) {
    return ul(e, n);
}
var ma = null;
function C1(e) {
    (ma !== null &&
        (e.defaultEncapsulation !== ma.defaultEncapsulation ||
            e.preserveWhitespaces !== ma.preserveWhitespaces)) ||
        (ma = e);
}
var dd = class {
        ngModuleFactory;
        componentFactories;
        constructor(n, t) {
            ((this.ngModuleFactory = n), (this.componentFactories = t));
        }
    },
    nv = (() => {
        class e {
            compileModuleSync(t) {
                return new Ha(t);
            }
            compileModuleAsync(t) {
                return Promise.resolve(this.compileModuleSync(t));
            }
            compileModuleAndAllComponentsSync(t) {
                let r = this.compileModuleSync(t),
                    i = gm(t),
                    o = N_(i.declarations).reduce((s, a) => {
                        let l = br(a);
                        return (l && s.push(new Ei(l)), s);
                    }, []);
                return new dd(r, o);
            }
            compileModuleAndAllComponentsAsync(t) {
                return Promise.resolve(
                    this.compileModuleAndAllComponentsSync(t)
                );
            }
            clearCache() {}
            clearCacheFor(t) {}
            getModuleId(t) {}
            static ɵfac = function (r) {
                return new (r || e)();
            };
            static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" });
        }
        return e;
    })(),
    E1 = new O("");
function S1(e, n, t) {
    let r = new Ha(t);
    return Promise.resolve(r);
}
function Wg(e) {
    for (let n = e.length - 1; n >= 0; n--) if (e[n] !== void 0) return e[n];
}
var w1 = (() => {
    class e {
        zone = y(ne);
        changeDetectionScheduler = y(Tr);
        applicationRef = y(nr);
        _onMicrotaskEmptySubscription;
        initialize() {
            this._onMicrotaskEmptySubscription ||
                (this._onMicrotaskEmptySubscription =
                    this.zone.onMicrotaskEmpty.subscribe({
                        next: () => {
                            this.changeDetectionScheduler.runningTick ||
                                this.zone.run(() => {
                                    this.applicationRef.tick();
                                });
                        },
                    }));
        }
        ngOnDestroy() {
            this._onMicrotaskEmptySubscription?.unsubscribe();
        }
        static ɵfac = function (r) {
            return new (r || e)();
        };
        static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
    return e;
})();
function D1({
    ngZoneFactory: e,
    ignoreChangesOutsideZone: n,
    scheduleInRootZone: t,
}) {
    return (
        (e ??= () => new ne(oe(E({}, rv()), { scheduleInRootZone: t }))),
        [
            { provide: ne, useFactory: e },
            {
                provide: To,
                multi: !0,
                useFactory: () => {
                    let r = y(w1, { optional: !0 });
                    return () => r.initialize();
                },
            },
            {
                provide: To,
                multi: !0,
                useFactory: () => {
                    let r = y(M1);
                    return () => {
                        r.initialize();
                    };
                },
            },
            n === !0 ? { provide: i_, useValue: !0 } : [],
            { provide: o_, useValue: t ?? n_ },
        ]
    );
}
function rv(e) {
    return {
        enableLongStackTrace: !1,
        shouldCoalesceEventChangeDetection: e?.eventCoalescing ?? !1,
        shouldCoalesceRunChangeDetection: e?.runCoalescing ?? !1,
    };
}
var M1 = (() => {
    class e {
        subscription = new Ie();
        initialized = !1;
        zone = y(ne);
        pendingTasks = y(Oi);
        initialize() {
            if (this.initialized) return;
            this.initialized = !0;
            let t = null;
            (!this.zone.isStable &&
                !this.zone.hasPendingMacrotasks &&
                !this.zone.hasPendingMicrotasks &&
                (t = this.pendingTasks.add()),
                this.zone.runOutsideAngular(() => {
                    this.subscription.add(
                        this.zone.onStable.subscribe(() => {
                            (ne.assertNotInAngularZone(),
                                queueMicrotask(() => {
                                    t !== null &&
                                        !this.zone.hasPendingMacrotasks &&
                                        !this.zone.hasPendingMicrotasks &&
                                        (this.pendingTasks.remove(t),
                                        (t = null));
                                }));
                        })
                    );
                }),
                this.subscription.add(
                    this.zone.onUnstable.subscribe(() => {
                        (ne.assertInAngularZone(),
                            (t ??= this.pendingTasks.add()));
                    })
                ));
        }
        ngOnDestroy() {
            this.subscription.unsubscribe();
        }
        static ɵfac = function (r) {
            return new (r || e)();
        };
        static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
    return e;
})();
var I1 = (() => {
    class e {
        appRef = y(nr);
        taskService = y(Oi);
        ngZone = y(ne);
        zonelessEnabled = y(r_);
        tracing = y(Ai, { optional: !0 });
        disableScheduling = y(i_, { optional: !0 }) ?? !1;
        zoneIsDefined = typeof Zone < "u" && !!Zone.root.run;
        schedulerTickApplyArgs = [{ data: { __scheduler_tick__: !0 } }];
        subscriptions = new Ie();
        angularZoneId = this.zoneIsDefined ? this.ngZone._inner?.get(ka) : null;
        scheduleInRootZone =
            !this.zonelessEnabled &&
            this.zoneIsDefined &&
            (y(o_, { optional: !0 }) ?? !1);
        cancelScheduledCallback = null;
        useMicrotaskScheduler = !1;
        runningTick = !1;
        pendingRenderTaskId = null;
        constructor() {
            (this.subscriptions.add(
                this.appRef.afterTick.subscribe(() => {
                    this.runningTick || this.cleanup();
                })
            ),
                this.subscriptions.add(
                    this.ngZone.onUnstable.subscribe(() => {
                        this.runningTick || this.cleanup();
                    })
                ),
                (this.disableScheduling ||=
                    !this.zonelessEnabled &&
                    (this.ngZone instanceof La || !this.zoneIsDefined)));
        }
        notify(t) {
            if (!this.zonelessEnabled && t === 5) return;
            let r = !1;
            switch (t) {
                case 0: {
                    this.appRef.dirtyFlags |= 2;
                    break;
                }
                case 3:
                case 2:
                case 4:
                case 5:
                case 1: {
                    this.appRef.dirtyFlags |= 4;
                    break;
                }
                case 6: {
                    ((this.appRef.dirtyFlags |= 2), (r = !0));
                    break;
                }
                case 12: {
                    ((this.appRef.dirtyFlags |= 16), (r = !0));
                    break;
                }
                case 13: {
                    ((this.appRef.dirtyFlags |= 2), (r = !0));
                    break;
                }
                case 11: {
                    r = !0;
                    break;
                }
                case 9:
                case 8:
                case 7:
                case 10:
                default:
                    this.appRef.dirtyFlags |= 8;
            }
            if (
                ((this.appRef.tracingSnapshot =
                    this.tracing?.snapshot(this.appRef.tracingSnapshot) ??
                    null),
                !this.shouldScheduleTick(r))
            )
                return;
            let i = this.useMicrotaskScheduler ? bg : s_;
            ((this.pendingRenderTaskId = this.taskService.add()),
                this.scheduleInRootZone
                    ? (this.cancelScheduledCallback = Zone.root.run(() =>
                          i(() => this.tick())
                      ))
                    : (this.cancelScheduledCallback =
                          this.ngZone.runOutsideAngular(() =>
                              i(() => this.tick())
                          )));
        }
        shouldScheduleTick(t) {
            return !(
                (this.disableScheduling && !t) ||
                this.appRef.destroyed ||
                this.pendingRenderTaskId !== null ||
                this.runningTick ||
                this.appRef._runningTick ||
                (!this.zonelessEnabled &&
                    this.zoneIsDefined &&
                    Zone.current.get(ka + this.angularZoneId))
            );
        }
        tick() {
            if (this.runningTick || this.appRef.destroyed) return;
            if (this.appRef.dirtyFlags === 0) {
                this.cleanup();
                return;
            }
            !this.zonelessEnabled &&
                this.appRef.dirtyFlags & 7 &&
                (this.appRef.dirtyFlags |= 1);
            let t = this.taskService.add();
            try {
                this.ngZone.run(
                    () => {
                        ((this.runningTick = !0), this.appRef._tick());
                    },
                    void 0,
                    this.schedulerTickApplyArgs
                );
            } catch (r) {
                throw (this.taskService.remove(t), r);
            } finally {
                this.cleanup();
            }
            ((this.useMicrotaskScheduler = !0),
                bg(() => {
                    ((this.useMicrotaskScheduler = !1),
                        this.taskService.remove(t));
                }));
        }
        ngOnDestroy() {
            (this.subscriptions.unsubscribe(), this.cleanup());
        }
        cleanup() {
            if (
                ((this.runningTick = !1),
                this.cancelScheduledCallback?.(),
                (this.cancelScheduledCallback = null),
                this.pendingRenderTaskId !== null)
            ) {
                let t = this.pendingRenderTaskId;
                ((this.pendingRenderTaskId = null), this.taskService.remove(t));
            }
        }
        static ɵfac = function (r) {
            return new (r || e)();
        };
        static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
    return e;
})();
function T1() {
    return (typeof $localize < "u" && $localize.locale) || Wa;
}
var Qo = new O("", {
    providedIn: "root",
    factory: () => y(Qo, B.Optional | B.SkipSelf) || T1(),
});
var Ga = new O(""),
    x1 = new O("");
function So(e) {
    return !e.moduleRef;
}
function O1(e) {
    let n = So(e) ? e.r3Injector : e.moduleRef.injector,
        t = n.get(ne);
    return t.run(() => {
        So(e)
            ? e.r3Injector.resolveInjectorInitializers()
            : e.moduleRef.resolveInjectorInitializers();
        let r = n.get(ln, null),
            i;
        if (
            (t.runOutsideAngular(() => {
                i = t.onError.subscribe({
                    next: (o) => {
                        r.handleError(o);
                    },
                });
            }),
            So(e))
        ) {
            let o = () => n.destroy(),
                s = e.platformInjector.get(Ga);
            (s.add(o),
                n.onDestroy(() => {
                    (i.unsubscribe(), s.delete(o));
                }));
        } else {
            let o = () => e.moduleRef.destroy(),
                s = e.platformInjector.get(Ga);
            (s.add(o),
                e.moduleRef.onDestroy(() => {
                    (Ca(e.allPlatformModules, e.moduleRef),
                        i.unsubscribe(),
                        s.delete(o));
                }));
        }
        return N1(r, t, () => {
            let o = n.get(Py);
            return (
                o.runInitializers(),
                o.donePromise.then(() => {
                    let s = n.get(Qo, Wa);
                    if ((WI(s || Wa), !n.get(x1, !0)))
                        return So(e)
                            ? n.get(nr)
                            : (e.allPlatformModules.push(e.moduleRef),
                              e.moduleRef);
                    if (So(e)) {
                        let l = n.get(nr);
                        return (
                            e.rootComponent !== void 0 &&
                                l.bootstrap(e.rootComponent),
                            l
                        );
                    } else
                        return (
                            P1(e.moduleRef, e.allPlatformModules),
                            e.moduleRef
                        );
                })
            );
        });
    });
}
function P1(e, n) {
    let t = e.injector.get(nr);
    if (e._bootstrapComponents.length > 0)
        e._bootstrapComponents.forEach((r) => t.bootstrap(r));
    else if (e.instance.ngDoBootstrap) e.instance.ngDoBootstrap(t);
    else throw new S(-403, !1);
    n.push(e);
}
function N1(e, n, t) {
    try {
        let r = t();
        return qo(r)
            ? r.catch((i) => {
                  throw (n.runOutsideAngular(() => e.handleError(i)), i);
              })
            : r;
    } catch (r) {
        throw (n.runOutsideAngular(() => e.handleError(r)), r);
    }
}
var iv = (() => {
        class e {
            _injector;
            _modules = [];
            _destroyListeners = [];
            _destroyed = !1;
            constructor(t) {
                this._injector = t;
            }
            bootstrapModuleFactory(t, r) {
                let i = r?.scheduleInRootZone,
                    o = () =>
                        GS(
                            r?.ngZone,
                            oe(
                                E(
                                    {},
                                    rv({
                                        eventCoalescing:
                                            r?.ngZoneEventCoalescing,
                                        runCoalescing: r?.ngZoneRunCoalescing,
                                    })
                                ),
                                { scheduleInRootZone: i }
                            )
                        ),
                    s = r?.ignoreChangesOutsideZone,
                    a = [
                        D1({ ngZoneFactory: o, ignoreChangesOutsideZone: s }),
                        { provide: Tr, useExisting: I1 },
                    ],
                    l = qM(t.moduleType, this.injector, a);
                return O1({
                    moduleRef: l,
                    allPlatformModules: this._modules,
                    platformInjector: this.injector,
                });
            }
            bootstrapModule(t, r = []) {
                let i = Ny({}, r);
                return S1(this.injector, i, t).then((o) =>
                    this.bootstrapModuleFactory(o, i)
                );
            }
            onDestroy(t) {
                this._destroyListeners.push(t);
            }
            get injector() {
                return this._injector;
            }
            destroy() {
                if (this._destroyed) throw new S(404, !1);
                (this._modules.slice().forEach((r) => r.destroy()),
                    this._destroyListeners.forEach((r) => r()));
                let t = this._injector.get(Ga, null);
                (t && (t.forEach((r) => r()), t.clear()),
                    (this._destroyed = !0));
            }
            get destroyed() {
                return this._destroyed;
            }
            static ɵfac = function (r) {
                return new (r || e)(N(We));
            };
            static ɵprov = w({
                token: e,
                factory: e.ɵfac,
                providedIn: "platform",
            });
        }
        return e;
    })(),
    Sf = null;
function A1(e) {
    if (Df()) throw new S(400, !1);
    (fI(), (Sf = e));
    let n = e.get(iv);
    return (L1(e), n);
}
function wf(e, n, t = []) {
    let r = `Platform: ${n}`,
        i = new O(r);
    return (o = []) => {
        let s = Df();
        if (!s) {
            let a = [...t, ...o, { provide: i, useValue: !0 }];
            s = e?.(a) ?? A1(R1(a, r));
        }
        return k1(i);
    };
}
function R1(e = [], n) {
    return We.create({
        name: n,
        providers: [
            { provide: el, useValue: "platform" },
            { provide: Ga, useValue: new Set([() => (Sf = null)]) },
            ...e,
        ],
    });
}
function k1(e) {
    let n = Df();
    if (!n) throw new S(401, !1);
    return n;
}
function Df() {
    return Sf?.get(iv) ?? null;
}
function L1(e) {
    let n = e.get(Bd, null);
    Nt(e, () => {
        n?.forEach((t) => t());
    });
}
var Rr = (() => {
    class e {
        static __NG_ELEMENT_ID__ = F1;
    }
    return e;
})();
function F1(e) {
    return $1(et(), q(), (e & 16) === 16);
}
function $1(e, n, t) {
    if (Ii(e) && !t) {
        let r = sn(e.index, n);
        return new ko(r, r);
    } else if (e.type & 175) {
        let r = n[bt];
        return new ko(r, n);
    }
    return null;
}
var fd = class {
        constructor() {}
        supports(n) {
            return wy(n);
        }
        create(n) {
            return new pd(n);
        }
    },
    V1 = (e, n) => n,
    pd = class {
        length = 0;
        collection;
        _linkedRecords = null;
        _unlinkedRecords = null;
        _previousItHead = null;
        _itHead = null;
        _itTail = null;
        _additionsHead = null;
        _additionsTail = null;
        _movesHead = null;
        _movesTail = null;
        _removalsHead = null;
        _removalsTail = null;
        _identityChangesHead = null;
        _identityChangesTail = null;
        _trackByFn;
        constructor(n) {
            this._trackByFn = n || V1;
        }
        forEachItem(n) {
            let t;
            for (t = this._itHead; t !== null; t = t._next) n(t);
        }
        forEachOperation(n) {
            let t = this._itHead,
                r = this._removalsHead,
                i = 0,
                o = null;
            for (; t || r; ) {
                let s = !r || (t && t.currentIndex < qg(r, i, o)) ? t : r,
                    a = qg(s, i, o),
                    l = s.currentIndex;
                if (s === r) (i--, (r = r._nextRemoved));
                else if (((t = t._next), s.previousIndex == null)) i++;
                else {
                    o || (o = []);
                    let c = a - i,
                        u = l - i;
                    if (c != u) {
                        for (let p = 0; p < c; p++) {
                            let f = p < o.length ? o[p] : (o[p] = 0),
                                h = f + p;
                            u <= h && h < c && (o[p] = f + 1);
                        }
                        let d = s.previousIndex;
                        o[d] = u - c;
                    }
                }
                a !== l && n(s, a, l);
            }
        }
        forEachPreviousItem(n) {
            let t;
            for (t = this._previousItHead; t !== null; t = t._nextPrevious)
                n(t);
        }
        forEachAddedItem(n) {
            let t;
            for (t = this._additionsHead; t !== null; t = t._nextAdded) n(t);
        }
        forEachMovedItem(n) {
            let t;
            for (t = this._movesHead; t !== null; t = t._nextMoved) n(t);
        }
        forEachRemovedItem(n) {
            let t;
            for (t = this._removalsHead; t !== null; t = t._nextRemoved) n(t);
        }
        forEachIdentityChange(n) {
            let t;
            for (
                t = this._identityChangesHead;
                t !== null;
                t = t._nextIdentityChange
            )
                n(t);
        }
        diff(n) {
            if ((n == null && (n = []), !wy(n))) throw new S(900, !1);
            return this.check(n) ? this : null;
        }
        onDestroy() {}
        check(n) {
            this._reset();
            let t = this._itHead,
                r = !1,
                i,
                o,
                s;
            if (Array.isArray(n)) {
                this.length = n.length;
                for (let a = 0; a < this.length; a++)
                    ((o = n[a]),
                        (s = this._trackByFn(a, o)),
                        t === null || !Object.is(t.trackById, s)
                            ? ((t = this._mismatch(t, o, s, a)), (r = !0))
                            : (r && (t = this._verifyReinsertion(t, o, s, a)),
                              Object.is(t.item, o) ||
                                  this._addIdentityChange(t, o)),
                        (t = t._next));
            } else
                ((i = 0),
                    oI(n, (a) => {
                        ((s = this._trackByFn(i, a)),
                            t === null || !Object.is(t.trackById, s)
                                ? ((t = this._mismatch(t, a, s, i)), (r = !0))
                                : (r &&
                                      (t = this._verifyReinsertion(t, a, s, i)),
                                  Object.is(t.item, a) ||
                                      this._addIdentityChange(t, a)),
                            (t = t._next),
                            i++);
                    }),
                    (this.length = i));
            return (this._truncate(t), (this.collection = n), this.isDirty);
        }
        get isDirty() {
            return (
                this._additionsHead !== null ||
                this._movesHead !== null ||
                this._removalsHead !== null ||
                this._identityChangesHead !== null
            );
        }
        _reset() {
            if (this.isDirty) {
                let n;
                for (
                    n = this._previousItHead = this._itHead;
                    n !== null;
                    n = n._next
                )
                    n._nextPrevious = n._next;
                for (n = this._additionsHead; n !== null; n = n._nextAdded)
                    n.previousIndex = n.currentIndex;
                for (
                    this._additionsHead = this._additionsTail = null,
                        n = this._movesHead;
                    n !== null;
                    n = n._nextMoved
                )
                    n.previousIndex = n.currentIndex;
                ((this._movesHead = this._movesTail = null),
                    (this._removalsHead = this._removalsTail = null),
                    (this._identityChangesHead = this._identityChangesTail =
                        null));
            }
        }
        _mismatch(n, t, r, i) {
            let o;
            return (
                n === null
                    ? (o = this._itTail)
                    : ((o = n._prev), this._remove(n)),
                (n =
                    this._unlinkedRecords === null
                        ? null
                        : this._unlinkedRecords.get(r, null)),
                n !== null
                    ? (Object.is(n.item, t) || this._addIdentityChange(n, t),
                      this._reinsertAfter(n, o, i))
                    : ((n =
                          this._linkedRecords === null
                              ? null
                              : this._linkedRecords.get(r, i)),
                      n !== null
                          ? (Object.is(n.item, t) ||
                                this._addIdentityChange(n, t),
                            this._moveAfter(n, o, i))
                          : (n = this._addAfter(new hd(t, r), o, i))),
                n
            );
        }
        _verifyReinsertion(n, t, r, i) {
            let o =
                this._unlinkedRecords === null
                    ? null
                    : this._unlinkedRecords.get(r, null);
            return (
                o !== null
                    ? (n = this._reinsertAfter(o, n._prev, i))
                    : n.currentIndex != i &&
                      ((n.currentIndex = i), this._addToMoves(n, i)),
                n
            );
        }
        _truncate(n) {
            for (; n !== null; ) {
                let t = n._next;
                (this._addToRemovals(this._unlink(n)), (n = t));
            }
            (this._unlinkedRecords !== null && this._unlinkedRecords.clear(),
                this._additionsTail !== null &&
                    (this._additionsTail._nextAdded = null),
                this._movesTail !== null && (this._movesTail._nextMoved = null),
                this._itTail !== null && (this._itTail._next = null),
                this._removalsTail !== null &&
                    (this._removalsTail._nextRemoved = null),
                this._identityChangesTail !== null &&
                    (this._identityChangesTail._nextIdentityChange = null));
        }
        _reinsertAfter(n, t, r) {
            this._unlinkedRecords !== null && this._unlinkedRecords.remove(n);
            let i = n._prevRemoved,
                o = n._nextRemoved;
            return (
                i === null ? (this._removalsHead = o) : (i._nextRemoved = o),
                o === null ? (this._removalsTail = i) : (o._prevRemoved = i),
                this._insertAfter(n, t, r),
                this._addToMoves(n, r),
                n
            );
        }
        _moveAfter(n, t, r) {
            return (
                this._unlink(n),
                this._insertAfter(n, t, r),
                this._addToMoves(n, r),
                n
            );
        }
        _addAfter(n, t, r) {
            return (
                this._insertAfter(n, t, r),
                this._additionsTail === null
                    ? (this._additionsTail = this._additionsHead = n)
                    : (this._additionsTail = this._additionsTail._nextAdded =
                          n),
                n
            );
        }
        _insertAfter(n, t, r) {
            let i = t === null ? this._itHead : t._next;
            return (
                (n._next = i),
                (n._prev = t),
                i === null ? (this._itTail = n) : (i._prev = n),
                t === null ? (this._itHead = n) : (t._next = n),
                this._linkedRecords === null &&
                    (this._linkedRecords = new Ya()),
                this._linkedRecords.put(n),
                (n.currentIndex = r),
                n
            );
        }
        _remove(n) {
            return this._addToRemovals(this._unlink(n));
        }
        _unlink(n) {
            this._linkedRecords !== null && this._linkedRecords.remove(n);
            let t = n._prev,
                r = n._next;
            return (
                t === null ? (this._itHead = r) : (t._next = r),
                r === null ? (this._itTail = t) : (r._prev = t),
                n
            );
        }
        _addToMoves(n, t) {
            return (
                n.previousIndex === t ||
                    (this._movesTail === null
                        ? (this._movesTail = this._movesHead = n)
                        : (this._movesTail = this._movesTail._nextMoved = n)),
                n
            );
        }
        _addToRemovals(n) {
            return (
                this._unlinkedRecords === null &&
                    (this._unlinkedRecords = new Ya()),
                this._unlinkedRecords.put(n),
                (n.currentIndex = null),
                (n._nextRemoved = null),
                this._removalsTail === null
                    ? ((this._removalsTail = this._removalsHead = n),
                      (n._prevRemoved = null))
                    : ((n._prevRemoved = this._removalsTail),
                      (this._removalsTail = this._removalsTail._nextRemoved =
                          n)),
                n
            );
        }
        _addIdentityChange(n, t) {
            return (
                (n.item = t),
                this._identityChangesTail === null
                    ? (this._identityChangesTail = this._identityChangesHead =
                          n)
                    : (this._identityChangesTail =
                          this._identityChangesTail._nextIdentityChange =
                              n),
                n
            );
        }
    },
    hd = class {
        item;
        trackById;
        currentIndex = null;
        previousIndex = null;
        _nextPrevious = null;
        _prev = null;
        _next = null;
        _prevDup = null;
        _nextDup = null;
        _prevRemoved = null;
        _nextRemoved = null;
        _nextAdded = null;
        _nextMoved = null;
        _nextIdentityChange = null;
        constructor(n, t) {
            ((this.item = n), (this.trackById = t));
        }
    },
    gd = class {
        _head = null;
        _tail = null;
        add(n) {
            this._head === null
                ? ((this._head = this._tail = n),
                  (n._nextDup = null),
                  (n._prevDup = null))
                : ((this._tail._nextDup = n),
                  (n._prevDup = this._tail),
                  (n._nextDup = null),
                  (this._tail = n));
        }
        get(n, t) {
            let r;
            for (r = this._head; r !== null; r = r._nextDup)
                if (
                    (t === null || t <= r.currentIndex) &&
                    Object.is(r.trackById, n)
                )
                    return r;
            return null;
        }
        remove(n) {
            let t = n._prevDup,
                r = n._nextDup;
            return (
                t === null ? (this._head = r) : (t._nextDup = r),
                r === null ? (this._tail = t) : (r._prevDup = t),
                this._head === null
            );
        }
    },
    Ya = class {
        map = new Map();
        put(n) {
            let t = n.trackById,
                r = this.map.get(t);
            (r || ((r = new gd()), this.map.set(t, r)), r.add(n));
        }
        get(n, t) {
            let r = n,
                i = this.map.get(r);
            return i ? i.get(n, t) : null;
        }
        remove(n) {
            let t = n.trackById;
            return (this.map.get(t).remove(n) && this.map.delete(t), n);
        }
        get isEmpty() {
            return this.map.size === 0;
        }
        clear() {
            this.map.clear();
        }
    };
function qg(e, n, t) {
    let r = e.previousIndex;
    if (r === null) return r;
    let i = 0;
    return (t && r < t.length && (i = t[r]), r + n + i);
}
var md = class {
        constructor() {}
        supports(n) {
            return n instanceof Map || hf(n);
        }
        create() {
            return new _d();
        }
    },
    _d = class {
        _records = new Map();
        _mapHead = null;
        _appendAfter = null;
        _previousMapHead = null;
        _changesHead = null;
        _changesTail = null;
        _additionsHead = null;
        _additionsTail = null;
        _removalsHead = null;
        _removalsTail = null;
        get isDirty() {
            return (
                this._additionsHead !== null ||
                this._changesHead !== null ||
                this._removalsHead !== null
            );
        }
        forEachItem(n) {
            let t;
            for (t = this._mapHead; t !== null; t = t._next) n(t);
        }
        forEachPreviousItem(n) {
            let t;
            for (t = this._previousMapHead; t !== null; t = t._nextPrevious)
                n(t);
        }
        forEachChangedItem(n) {
            let t;
            for (t = this._changesHead; t !== null; t = t._nextChanged) n(t);
        }
        forEachAddedItem(n) {
            let t;
            for (t = this._additionsHead; t !== null; t = t._nextAdded) n(t);
        }
        forEachRemovedItem(n) {
            let t;
            for (t = this._removalsHead; t !== null; t = t._nextRemoved) n(t);
        }
        diff(n) {
            if (!n) n = new Map();
            else if (!(n instanceof Map || hf(n))) throw new S(900, !1);
            return this.check(n) ? this : null;
        }
        onDestroy() {}
        check(n) {
            this._reset();
            let t = this._mapHead;
            if (
                ((this._appendAfter = null),
                this._forEach(n, (r, i) => {
                    if (t && t.key === i)
                        (this._maybeAddToChanges(t, r),
                            (this._appendAfter = t),
                            (t = t._next));
                    else {
                        let o = this._getOrCreateRecordForKey(i, r);
                        t = this._insertBeforeOrAppend(t, o);
                    }
                }),
                t)
            ) {
                (t._prev && (t._prev._next = null), (this._removalsHead = t));
                for (let r = t; r !== null; r = r._nextRemoved)
                    (r === this._mapHead && (this._mapHead = null),
                        this._records.delete(r.key),
                        (r._nextRemoved = r._next),
                        (r.previousValue = r.currentValue),
                        (r.currentValue = null),
                        (r._prev = null),
                        (r._next = null));
            }
            return (
                this._changesTail && (this._changesTail._nextChanged = null),
                this._additionsTail && (this._additionsTail._nextAdded = null),
                this.isDirty
            );
        }
        _insertBeforeOrAppend(n, t) {
            if (n) {
                let r = n._prev;
                return (
                    (t._next = n),
                    (t._prev = r),
                    (n._prev = t),
                    r && (r._next = t),
                    n === this._mapHead && (this._mapHead = t),
                    (this._appendAfter = n),
                    n
                );
            }
            return (
                this._appendAfter
                    ? ((this._appendAfter._next = t),
                      (t._prev = this._appendAfter))
                    : (this._mapHead = t),
                (this._appendAfter = t),
                null
            );
        }
        _getOrCreateRecordForKey(n, t) {
            if (this._records.has(n)) {
                let i = this._records.get(n);
                this._maybeAddToChanges(i, t);
                let o = i._prev,
                    s = i._next;
                return (
                    o && (o._next = s),
                    s && (s._prev = o),
                    (i._next = null),
                    (i._prev = null),
                    i
                );
            }
            let r = new yd(n);
            return (
                this._records.set(n, r),
                (r.currentValue = t),
                this._addToAdditions(r),
                r
            );
        }
        _reset() {
            if (this.isDirty) {
                let n;
                for (
                    this._previousMapHead = this._mapHead,
                        n = this._previousMapHead;
                    n !== null;
                    n = n._next
                )
                    n._nextPrevious = n._next;
                for (n = this._changesHead; n !== null; n = n._nextChanged)
                    n.previousValue = n.currentValue;
                for (n = this._additionsHead; n != null; n = n._nextAdded)
                    n.previousValue = n.currentValue;
                ((this._changesHead = this._changesTail = null),
                    (this._additionsHead = this._additionsTail = null),
                    (this._removalsHead = null));
            }
        }
        _maybeAddToChanges(n, t) {
            Object.is(t, n.currentValue) ||
                ((n.previousValue = n.currentValue),
                (n.currentValue = t),
                this._addToChanges(n));
        }
        _addToAdditions(n) {
            this._additionsHead === null
                ? (this._additionsHead = this._additionsTail = n)
                : ((this._additionsTail._nextAdded = n),
                  (this._additionsTail = n));
        }
        _addToChanges(n) {
            this._changesHead === null
                ? (this._changesHead = this._changesTail = n)
                : ((this._changesTail._nextChanged = n),
                  (this._changesTail = n));
        }
        _forEach(n, t) {
            n instanceof Map
                ? n.forEach(t)
                : Object.keys(n).forEach((r) => t(n[r], r));
        }
    },
    yd = class {
        key;
        previousValue = null;
        currentValue = null;
        _nextPrevious = null;
        _next = null;
        _prev = null;
        _nextAdded = null;
        _nextRemoved = null;
        _nextChanged = null;
        constructor(n) {
            this.key = n;
        }
    };
function Gg() {
    return new Mf([new fd()]);
}
var Mf = (() => {
    class e {
        factories;
        static ɵprov = w({ token: e, providedIn: "root", factory: Gg });
        constructor(t) {
            this.factories = t;
        }
        static create(t, r) {
            if (r != null) {
                let i = r.factories.slice();
                t = t.concat(i);
            }
            return new e(t);
        }
        static extend(t) {
            return {
                provide: e,
                useFactory: (r) => e.create(t, r || Gg()),
                deps: [[e, new dm(), new um()]],
            };
        }
        find(t) {
            let r = this.factories.find((i) => i.supports(t));
            if (r != null) return r;
            throw new S(901, !1);
        }
    }
    return e;
})();
function Yg() {
    return new If([new md()]);
}
var If = (() => {
    class e {
        static ɵprov = w({ token: e, providedIn: "root", factory: Yg });
        factories;
        constructor(t) {
            this.factories = t;
        }
        static create(t, r) {
            if (r) {
                let i = r.factories.slice();
                t = t.concat(i);
            }
            return new e(t);
        }
        static extend(t) {
            return {
                provide: e,
                useFactory: (r) => e.create(t, r || Yg()),
                deps: [[e, new dm(), new um()]],
            };
        }
        find(t) {
            let r = this.factories.find((i) => i.supports(t));
            if (r) return r;
            throw new S(901, !1);
        }
    }
    return e;
})();
var ov = wf(null, "core", []),
    sv = (() => {
        class e {
            constructor(t) {}
            static ɵfac = function (r) {
                return new (r || e)(N(nr));
            };
            static ɵmod = ge({ type: e });
            static ɵinj = he({});
        }
        return e;
    })();
function K(e) {
    return typeof e == "boolean" ? e : e != null && e !== "false";
}
function kr(e, n = NaN) {
    return !isNaN(parseFloat(e)) && !isNaN(Number(e)) ? Number(e) : n;
}
function Tf(e) {
    return Vc(e);
}
function xf(e, n) {
    return kc(e, n?.equal);
}
var vd = class {
    [Tt];
    constructor(n) {
        this[Tt] = n;
    }
    destroy() {
        this[Tt].destroy();
    }
};
function $i(e, n) {
    !n?.injector && bm($i);
    let t = n?.injector ?? y(We),
        r = n?.manualCleanup !== !0 ? t.get(Pr) : null,
        i,
        o = t.get(Wd, null, { optional: !0 }),
        s = t.get(Tr);
    return (
        o !== null && !n?.forceRoot
            ? ((i = U1(o.view, s, e)),
              r instanceof Ra && r._lView === o.view && (r = null))
            : (i = H1(e, t.get(Ty), s)),
        (i.injector = t),
        r !== null && (i.onDestroyFn = r.onDestroy(() => i.destroy())),
        new vd(i)
    );
}
var av = oe(E({}, Xr), {
        consumerIsAlwaysLive: !0,
        consumerAllowSignalWrites: !0,
        dirty: !0,
        hasRun: !1,
        cleanupFns: void 0,
        zone: null,
        kind: "effect",
        onDestroyFn: Ro,
        run() {
            if (((this.dirty = !1), this.hasRun && !Hs(this))) return;
            this.hasRun = !0;
            let e = (r) => (this.cleanupFns ??= []).push(r),
                n = go(this),
                t = Oa(!1);
            try {
                (this.maybeCleanup(), this.fn(e));
            } finally {
                (Oa(t), Us(this, n));
            }
        },
        maybeCleanup() {
            if (this.cleanupFns?.length)
                try {
                    for (; this.cleanupFns.length; ) this.cleanupFns.pop()();
                } finally {
                    this.cleanupFns = [];
                }
        },
    }),
    j1 = oe(E({}, av), {
        consumerMarkedDirty() {
            (this.scheduler.schedule(this), this.notifier.notify(12));
        },
        destroy() {
            (mo(this),
                this.onDestroyFn(),
                this.maybeCleanup(),
                this.scheduler.remove(this));
        },
    }),
    B1 = oe(E({}, av), {
        consumerMarkedDirty() {
            ((this.view[L] |= 8192), xi(this.view), this.notifier.notify(13));
        },
        destroy() {
            (mo(this),
                this.onDestroyFn(),
                this.maybeCleanup(),
                this.view[Er]?.delete(this));
        },
    });
function U1(e, n, t) {
    let r = Object.create(B1);
    return (
        (r.view = e),
        (r.zone = typeof Zone < "u" ? Zone.current : null),
        (r.notifier = n),
        (r.fn = t),
        (e[Er] ??= new Set()),
        e[Er].add(r),
        r.consumerMarkedDirty(r),
        r
    );
}
function H1(e, n, t) {
    let r = Object.create(j1);
    return (
        (r.fn = e),
        (r.scheduler = n),
        (r.notifier = t),
        (r.zone = typeof Zone < "u" ? Zone.current : null),
        r.scheduler.schedule(r),
        r.notifier.notify(12),
        r
    );
}
function lv(e) {
    let n = br(e);
    if (!n) return null;
    let t = new Ei(n);
    return {
        get selector() {
            return t.selector;
        },
        get type() {
            return t.componentType;
        },
        get inputs() {
            return t.inputs;
        },
        get outputs() {
            return t.outputs;
        },
        get ngContentSelectors() {
            return t.ngContentSelectors;
        },
        get isStandalone() {
            return n.standalone;
        },
        get isSignal() {
            return n.signals;
        },
    };
}
var re = new O("");
var dv = null;
function mn() {
    return dv;
}
function Of(e) {
    dv ??= e;
}
var Zo = class {},
    Xo = (() => {
        class e {
            historyGo(t) {
                throw new Error("");
            }
            static ɵfac = function (r) {
                return new (r || e)();
            };
            static ɵprov = w({
                token: e,
                factory: () => y(fv),
                providedIn: "platform",
            });
        }
        return e;
    })(),
    Pf = new O(""),
    fv = (() => {
        class e extends Xo {
            _location;
            _history;
            _doc = y(re);
            constructor() {
                (super(),
                    (this._location = window.location),
                    (this._history = window.history));
            }
            getBaseHrefFromDOM() {
                return mn().getBaseHref(this._doc);
            }
            onPopState(t) {
                let r = mn().getGlobalEventTarget(this._doc, "window");
                return (
                    r.addEventListener("popstate", t, !1),
                    () => r.removeEventListener("popstate", t)
                );
            }
            onHashChange(t) {
                let r = mn().getGlobalEventTarget(this._doc, "window");
                return (
                    r.addEventListener("hashchange", t, !1),
                    () => r.removeEventListener("hashchange", t)
                );
            }
            get href() {
                return this._location.href;
            }
            get protocol() {
                return this._location.protocol;
            }
            get hostname() {
                return this._location.hostname;
            }
            get port() {
                return this._location.port;
            }
            get pathname() {
                return this._location.pathname;
            }
            get search() {
                return this._location.search;
            }
            get hash() {
                return this._location.hash;
            }
            set pathname(t) {
                this._location.pathname = t;
            }
            pushState(t, r, i) {
                this._history.pushState(t, r, i);
            }
            replaceState(t, r, i) {
                this._history.replaceState(t, r, i);
            }
            forward() {
                this._history.forward();
            }
            back() {
                this._history.back();
            }
            historyGo(t = 0) {
                this._history.go(t);
            }
            getState() {
                return this._history.state;
            }
            static ɵfac = function (r) {
                return new (r || e)();
            };
            static ɵprov = w({
                token: e,
                factory: () => new e(),
                providedIn: "platform",
            });
        }
        return e;
    })();
function ml(e, n) {
    return e
        ? n
            ? e.endsWith("/")
                ? n.startsWith("/")
                    ? e + n.slice(1)
                    : e + n
                : n.startsWith("/")
                  ? e + n
                  : `${e}/${n}`
            : e
        : n;
}
function cv(e) {
    let n = e.search(/#|\?|$/);
    return e[n - 1] === "/" ? e.slice(0, n - 1) + e.slice(n) : e;
}
function Kt(e) {
    return e && e[0] !== "?" ? `?${e}` : e;
}
var Bn = (() => {
        class e {
            historyGo(t) {
                throw new Error("");
            }
            static ɵfac = function (r) {
                return new (r || e)();
            };
            static ɵprov = w({
                token: e,
                factory: () => y(yl),
                providedIn: "root",
            });
        }
        return e;
    })(),
    _l = new O(""),
    yl = (() => {
        class e extends Bn {
            _platformLocation;
            _baseHref;
            _removeListenerFns = [];
            constructor(t, r) {
                (super(),
                    (this._platformLocation = t),
                    (this._baseHref =
                        r ??
                        this._platformLocation.getBaseHrefFromDOM() ??
                        y(re).location?.origin ??
                        ""));
            }
            ngOnDestroy() {
                for (; this._removeListenerFns.length; )
                    this._removeListenerFns.pop()();
            }
            onPopState(t) {
                this._removeListenerFns.push(
                    this._platformLocation.onPopState(t),
                    this._platformLocation.onHashChange(t)
                );
            }
            getBaseHref() {
                return this._baseHref;
            }
            prepareExternalUrl(t) {
                return ml(this._baseHref, t);
            }
            path(t = !1) {
                let r =
                        this._platformLocation.pathname +
                        Kt(this._platformLocation.search),
                    i = this._platformLocation.hash;
                return i && t ? `${r}${i}` : r;
            }
            pushState(t, r, i, o) {
                let s = this.prepareExternalUrl(i + Kt(o));
                this._platformLocation.pushState(t, r, s);
            }
            replaceState(t, r, i, o) {
                let s = this.prepareExternalUrl(i + Kt(o));
                this._platformLocation.replaceState(t, r, s);
            }
            forward() {
                this._platformLocation.forward();
            }
            back() {
                this._platformLocation.back();
            }
            getState() {
                return this._platformLocation.getState();
            }
            historyGo(t = 0) {
                this._platformLocation.historyGo?.(t);
            }
            static ɵfac = function (r) {
                return new (r || e)(N(Xo), N(_l, 8));
            };
            static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" });
        }
        return e;
    })(),
    sr = (() => {
        class e {
            _subject = new Te();
            _basePath;
            _locationStrategy;
            _urlChangeListeners = [];
            _urlChangeSubscription = null;
            constructor(t) {
                this._locationStrategy = t;
                let r = this._locationStrategy.getBaseHref();
                ((this._basePath = q1(cv(uv(r)))),
                    this._locationStrategy.onPopState((i) => {
                        this._subject.next({
                            url: this.path(!0),
                            pop: !0,
                            state: i.state,
                            type: i.type,
                        });
                    }));
            }
            ngOnDestroy() {
                (this._urlChangeSubscription?.unsubscribe(),
                    (this._urlChangeListeners = []));
            }
            path(t = !1) {
                return this.normalize(this._locationStrategy.path(t));
            }
            getState() {
                return this._locationStrategy.getState();
            }
            isCurrentPathEqualTo(t, r = "") {
                return this.path() == this.normalize(t + Kt(r));
            }
            normalize(t) {
                return e.stripTrailingSlash(W1(this._basePath, uv(t)));
            }
            prepareExternalUrl(t) {
                return (
                    t && t[0] !== "/" && (t = "/" + t),
                    this._locationStrategy.prepareExternalUrl(t)
                );
            }
            go(t, r = "", i = null) {
                (this._locationStrategy.pushState(i, "", t, r),
                    this._notifyUrlChangeListeners(
                        this.prepareExternalUrl(t + Kt(r)),
                        i
                    ));
            }
            replaceState(t, r = "", i = null) {
                (this._locationStrategy.replaceState(i, "", t, r),
                    this._notifyUrlChangeListeners(
                        this.prepareExternalUrl(t + Kt(r)),
                        i
                    ));
            }
            forward() {
                this._locationStrategy.forward();
            }
            back() {
                this._locationStrategy.back();
            }
            historyGo(t = 0) {
                this._locationStrategy.historyGo?.(t);
            }
            onUrlChange(t) {
                return (
                    this._urlChangeListeners.push(t),
                    (this._urlChangeSubscription ??= this.subscribe((r) => {
                        this._notifyUrlChangeListeners(r.url, r.state);
                    })),
                    () => {
                        let r = this._urlChangeListeners.indexOf(t);
                        (this._urlChangeListeners.splice(r, 1),
                            this._urlChangeListeners.length === 0 &&
                                (this._urlChangeSubscription?.unsubscribe(),
                                (this._urlChangeSubscription = null)));
                    }
                );
            }
            _notifyUrlChangeListeners(t = "", r) {
                this._urlChangeListeners.forEach((i) => i(t, r));
            }
            subscribe(t, r, i) {
                return this._subject.subscribe({
                    next: t,
                    error: r ?? void 0,
                    complete: i ?? void 0,
                });
            }
            static normalizeQueryParams = Kt;
            static joinWithSlash = ml;
            static stripTrailingSlash = cv;
            static ɵfac = function (r) {
                return new (r || e)(N(Bn));
            };
            static ɵprov = w({
                token: e,
                factory: () => z1(),
                providedIn: "root",
            });
        }
        return e;
    })();
function z1() {
    return new sr(N(Bn));
}
function W1(e, n) {
    if (!e || !n.startsWith(e)) return n;
    let t = n.substring(e.length);
    return t === "" || ["/", ";", "?", "#"].includes(t[0]) ? t : n;
}
function uv(e) {
    return e.replace(/\/index.html$/, "");
}
function q1(e) {
    if (new RegExp("^(https?:)?//").test(e)) {
        let [, t] = e.split(/\/\/[^\/]+/);
        return t;
    }
    return e;
}
var Af = (() => {
    class e extends Bn {
        _platformLocation;
        _baseHref = "";
        _removeListenerFns = [];
        constructor(t, r) {
            (super(),
                (this._platformLocation = t),
                r != null && (this._baseHref = r));
        }
        ngOnDestroy() {
            for (; this._removeListenerFns.length; )
                this._removeListenerFns.pop()();
        }
        onPopState(t) {
            this._removeListenerFns.push(
                this._platformLocation.onPopState(t),
                this._platformLocation.onHashChange(t)
            );
        }
        getBaseHref() {
            return this._baseHref;
        }
        path(t = !1) {
            let r = this._platformLocation.hash ?? "#";
            return r.length > 0 ? r.substring(1) : r;
        }
        prepareExternalUrl(t) {
            let r = ml(this._baseHref, t);
            return r.length > 0 ? "#" + r : r;
        }
        pushState(t, r, i, o) {
            let s =
                this.prepareExternalUrl(i + Kt(o)) ||
                this._platformLocation.pathname;
            this._platformLocation.pushState(t, r, s);
        }
        replaceState(t, r, i, o) {
            let s =
                this.prepareExternalUrl(i + Kt(o)) ||
                this._platformLocation.pathname;
            this._platformLocation.replaceState(t, r, s);
        }
        forward() {
            this._platformLocation.forward();
        }
        back() {
            this._platformLocation.back();
        }
        getState() {
            return this._platformLocation.getState();
        }
        historyGo(t = 0) {
            this._platformLocation.historyGo?.(t);
        }
        static ɵfac = function (r) {
            return new (r || e)(N(Xo), N(_l, 8));
        };
        static ɵprov = w({ token: e, factory: e.ɵfac });
    }
    return e;
})();
var Nf = /\s+/,
    pv = [],
    Jo = (() => {
        class e {
            _ngEl;
            _renderer;
            initialClasses = pv;
            rawClass;
            stateMap = new Map();
            constructor(t, r) {
                ((this._ngEl = t), (this._renderer = r));
            }
            set klass(t) {
                this.initialClasses = t != null ? t.trim().split(Nf) : pv;
            }
            set ngClass(t) {
                this.rawClass = typeof t == "string" ? t.trim().split(Nf) : t;
            }
            ngDoCheck() {
                for (let r of this.initialClasses) this._updateState(r, !0);
                let t = this.rawClass;
                if (Array.isArray(t) || t instanceof Set)
                    for (let r of t) this._updateState(r, !0);
                else if (t != null)
                    for (let r of Object.keys(t)) this._updateState(r, !!t[r]);
                this._applyStateDiff();
            }
            _updateState(t, r) {
                let i = this.stateMap.get(t);
                i !== void 0
                    ? (i.enabled !== r && ((i.changed = !0), (i.enabled = r)),
                      (i.touched = !0))
                    : this.stateMap.set(t, {
                          enabled: r,
                          changed: !0,
                          touched: !0,
                      });
            }
            _applyStateDiff() {
                for (let t of this.stateMap) {
                    let r = t[0],
                        i = t[1];
                    (i.changed
                        ? (this._toggleClass(r, i.enabled), (i.changed = !1))
                        : i.touched ||
                          (i.enabled && this._toggleClass(r, !1),
                          this.stateMap.delete(r)),
                        (i.touched = !1));
                }
            }
            _toggleClass(t, r) {
                ((t = t.trim()),
                    t.length > 0 &&
                        t.split(Nf).forEach((i) => {
                            r
                                ? this._renderer.addClass(
                                      this._ngEl.nativeElement,
                                      i
                                  )
                                : this._renderer.removeClass(
                                      this._ngEl.nativeElement,
                                      i
                                  );
                        }));
            }
            static ɵfac = function (r) {
                return new (r || e)(Se(tt), Se(Ar));
            };
            static ɵdir = Me({
                type: e,
                selectors: [["", "ngClass", ""]],
                inputs: { klass: [0, "class", "klass"], ngClass: "ngClass" },
            });
        }
        return e;
    })();
var vl = class {
        $implicit;
        ngForOf;
        index;
        count;
        constructor(n, t, r, i) {
            ((this.$implicit = n),
                (this.ngForOf = t),
                (this.index = r),
                (this.count = i));
        }
        get first() {
            return this.index === 0;
        }
        get last() {
            return this.index === this.count - 1;
        }
        get even() {
            return this.index % 2 === 0;
        }
        get odd() {
            return !this.even;
        }
    },
    kt = (() => {
        class e {
            _viewContainer;
            _template;
            _differs;
            set ngForOf(t) {
                ((this._ngForOf = t), (this._ngForOfDirty = !0));
            }
            set ngForTrackBy(t) {
                this._trackByFn = t;
            }
            get ngForTrackBy() {
                return this._trackByFn;
            }
            _ngForOf = null;
            _ngForOfDirty = !0;
            _differ = null;
            _trackByFn;
            constructor(t, r, i) {
                ((this._viewContainer = t),
                    (this._template = r),
                    (this._differs = i));
            }
            set ngForTemplate(t) {
                t && (this._template = t);
            }
            ngDoCheck() {
                if (this._ngForOfDirty) {
                    this._ngForOfDirty = !1;
                    let t = this._ngForOf;
                    !this._differ &&
                        t &&
                        (this._differ = this._differs
                            .find(t)
                            .create(this.ngForTrackBy));
                }
                if (this._differ) {
                    let t = this._differ.diff(this._ngForOf);
                    t && this._applyChanges(t);
                }
            }
            _applyChanges(t) {
                let r = this._viewContainer;
                t.forEachOperation((i, o, s) => {
                    if (i.previousIndex == null)
                        r.createEmbeddedView(
                            this._template,
                            new vl(i.item, this._ngForOf, -1, -1),
                            s === null ? void 0 : s
                        );
                    else if (s == null) r.remove(o === null ? void 0 : o);
                    else if (o !== null) {
                        let a = r.get(o);
                        (r.move(a, s), hv(a, i));
                    }
                });
                for (let i = 0, o = r.length; i < o; i++) {
                    let a = r.get(i).context;
                    ((a.index = i), (a.count = o), (a.ngForOf = this._ngForOf));
                }
                t.forEachIdentityChange((i) => {
                    let o = r.get(i.currentIndex);
                    hv(o, i);
                });
            }
            static ngTemplateContextGuard(t, r) {
                return !0;
            }
            static ɵfac = function (r) {
                return new (r || e)(Se(jn), Se(Rn), Se(Mf));
            };
            static ɵdir = Me({
                type: e,
                selectors: [["", "ngFor", "", "ngForOf", ""]],
                inputs: {
                    ngForOf: "ngForOf",
                    ngForTrackBy: "ngForTrackBy",
                    ngForTemplate: "ngForTemplate",
                },
            });
        }
        return e;
    })();
function hv(e, n) {
    e.context.$implicit = n.item;
}
var Et = (() => {
        class e {
            _viewContainer;
            _context = new bl();
            _thenTemplateRef = null;
            _elseTemplateRef = null;
            _thenViewRef = null;
            _elseViewRef = null;
            constructor(t, r) {
                ((this._viewContainer = t), (this._thenTemplateRef = r));
            }
            set ngIf(t) {
                ((this._context.$implicit = this._context.ngIf = t),
                    this._updateView());
            }
            set ngIfThen(t) {
                (gv(t, !1),
                    (this._thenTemplateRef = t),
                    (this._thenViewRef = null),
                    this._updateView());
            }
            set ngIfElse(t) {
                (gv(t, !1),
                    (this._elseTemplateRef = t),
                    (this._elseViewRef = null),
                    this._updateView());
            }
            _updateView() {
                this._context.$implicit
                    ? this._thenViewRef ||
                      (this._viewContainer.clear(),
                      (this._elseViewRef = null),
                      this._thenTemplateRef &&
                          (this._thenViewRef =
                              this._viewContainer.createEmbeddedView(
                                  this._thenTemplateRef,
                                  this._context
                              )))
                    : this._elseViewRef ||
                      (this._viewContainer.clear(),
                      (this._thenViewRef = null),
                      this._elseTemplateRef &&
                          (this._elseViewRef =
                              this._viewContainer.createEmbeddedView(
                                  this._elseTemplateRef,
                                  this._context
                              )));
            }
            static ngIfUseIfTypeGuard;
            static ngTemplateGuard_ngIf;
            static ngTemplateContextGuard(t, r) {
                return !0;
            }
            static ɵfac = function (r) {
                return new (r || e)(Se(jn), Se(Rn));
            };
            static ɵdir = Me({
                type: e,
                selectors: [["", "ngIf", ""]],
                inputs: {
                    ngIf: "ngIf",
                    ngIfThen: "ngIfThen",
                    ngIfElse: "ngIfElse",
                },
            });
        }
        return e;
    })(),
    bl = class {
        $implicit = null;
        ngIf = null;
    };
function gv(e, n) {
    if (e && !e.createEmbeddedView) throw new S(2020, !1);
}
var es = (() => {
        class e {
            _ngEl;
            _differs;
            _renderer;
            _ngStyle = null;
            _differ = null;
            constructor(t, r, i) {
                ((this._ngEl = t), (this._differs = r), (this._renderer = i));
            }
            set ngStyle(t) {
                ((this._ngStyle = t),
                    !this._differ &&
                        t &&
                        (this._differ = this._differs.find(t).create()));
            }
            ngDoCheck() {
                if (this._differ) {
                    let t = this._differ.diff(this._ngStyle);
                    t && this._applyChanges(t);
                }
            }
            _setStyle(t, r) {
                let [i, o] = t.split("."),
                    s = i.indexOf("-") === -1 ? void 0 : un.DashCase;
                r != null
                    ? this._renderer.setStyle(
                          this._ngEl.nativeElement,
                          i,
                          o ? `${r}${o}` : r,
                          s
                      )
                    : this._renderer.removeStyle(
                          this._ngEl.nativeElement,
                          i,
                          s
                      );
            }
            _applyChanges(t) {
                (t.forEachRemovedItem((r) => this._setStyle(r.key, null)),
                    t.forEachAddedItem((r) =>
                        this._setStyle(r.key, r.currentValue)
                    ),
                    t.forEachChangedItem((r) =>
                        this._setStyle(r.key, r.currentValue)
                    ));
            }
            static ɵfac = function (r) {
                return new (r || e)(Se(tt), Se(If), Se(Ar));
            };
            static ɵdir = Me({
                type: e,
                selectors: [["", "ngStyle", ""]],
                inputs: { ngStyle: "ngStyle" },
            });
        }
        return e;
    })(),
    ts = (() => {
        class e {
            _viewContainerRef;
            _viewRef = null;
            ngTemplateOutletContext = null;
            ngTemplateOutlet = null;
            ngTemplateOutletInjector = null;
            constructor(t) {
                this._viewContainerRef = t;
            }
            ngOnChanges(t) {
                if (this._shouldRecreateView(t)) {
                    let r = this._viewContainerRef;
                    if (
                        (this._viewRef && r.remove(r.indexOf(this._viewRef)),
                        !this.ngTemplateOutlet)
                    ) {
                        this._viewRef = null;
                        return;
                    }
                    let i = this._createContextForwardProxy();
                    this._viewRef = r.createEmbeddedView(
                        this.ngTemplateOutlet,
                        i,
                        { injector: this.ngTemplateOutletInjector ?? void 0 }
                    );
                }
            }
            _shouldRecreateView(t) {
                return !!t.ngTemplateOutlet || !!t.ngTemplateOutletInjector;
            }
            _createContextForwardProxy() {
                return new Proxy(
                    {},
                    {
                        set: (t, r, i) =>
                            this.ngTemplateOutletContext
                                ? Reflect.set(
                                      this.ngTemplateOutletContext,
                                      r,
                                      i
                                  )
                                : !1,
                        get: (t, r, i) => {
                            if (this.ngTemplateOutletContext)
                                return Reflect.get(
                                    this.ngTemplateOutletContext,
                                    r,
                                    i
                                );
                        },
                    }
                );
            }
            static ɵfac = function (r) {
                return new (r || e)(Se(jn));
            };
            static ɵdir = Me({
                type: e,
                selectors: [["", "ngTemplateOutlet", ""]],
                inputs: {
                    ngTemplateOutletContext: "ngTemplateOutletContext",
                    ngTemplateOutlet: "ngTemplateOutlet",
                    ngTemplateOutletInjector: "ngTemplateOutletInjector",
                },
                features: [At],
            });
        }
        return e;
    })();
var Qt = (() => {
    class e {
        static ɵfac = function (r) {
            return new (r || e)();
        };
        static ɵmod = ge({ type: e });
        static ɵinj = he({});
    }
    return e;
})();
function Rf(e, n) {
    n = encodeURIComponent(n);
    for (let t of e.split(";")) {
        let r = t.indexOf("="),
            [i, o] = r == -1 ? [t, ""] : [t.slice(0, r), t.slice(r + 1)];
        if (i.trim() === n) return decodeURIComponent(o);
    }
    return null;
}
var Cl = "browser",
    mv = "server";
function _n(e) {
    return e === Cl;
}
function Vi(e) {
    return e === mv;
}
var ns = class {};
var _v = (() => {
        class e {
            static ɵprov = w({
                token: e,
                providedIn: "root",
                factory: () => new kf(y(re), window),
            });
        }
        return e;
    })(),
    kf = class {
        document;
        window;
        offset = () => [0, 0];
        constructor(n, t) {
            ((this.document = n), (this.window = t));
        }
        setOffset(n) {
            Array.isArray(n) ? (this.offset = () => n) : (this.offset = n);
        }
        getScrollPosition() {
            return [this.window.scrollX, this.window.scrollY];
        }
        scrollToPosition(n) {
            this.window.scrollTo(n[0], n[1]);
        }
        scrollToAnchor(n) {
            let t = Y1(this.document, n);
            t && (this.scrollToElement(t), t.focus());
        }
        setHistoryScrollRestoration(n) {
            this.window.history.scrollRestoration = n;
        }
        scrollToElement(n) {
            let t = n.getBoundingClientRect(),
                r = t.left + this.window.pageXOffset,
                i = t.top + this.window.pageYOffset,
                o = this.offset();
            this.window.scrollTo(r - o[0], i - o[1]);
        }
    };
function Y1(e, n) {
    let t = e.getElementById(n) || e.getElementsByName(n)[0];
    if (t) return t;
    if (
        typeof e.createTreeWalker == "function" &&
        e.body &&
        typeof e.body.attachShadow == "function"
    ) {
        let r = e.createTreeWalker(e.body, NodeFilter.SHOW_ELEMENT),
            i = r.currentNode;
        for (; i; ) {
            let o = i.shadowRoot;
            if (o) {
                let s = o.getElementById(n) || o.querySelector(`[name="${n}"]`);
                if (s) return s;
            }
            i = r.nextNode();
        }
    }
    return null;
}
var wl = new O(""),
    Vf = (() => {
        class e {
            _zone;
            _plugins;
            _eventNameToPlugin = new Map();
            constructor(t, r) {
                ((this._zone = r),
                    t.forEach((i) => {
                        i.manager = this;
                    }),
                    (this._plugins = t.slice().reverse()));
            }
            addEventListener(t, r, i, o) {
                return this._findPluginFor(r).addEventListener(t, r, i, o);
            }
            getZone() {
                return this._zone;
            }
            _findPluginFor(t) {
                let r = this._eventNameToPlugin.get(t);
                if (r) return r;
                if (((r = this._plugins.find((o) => o.supports(t))), !r))
                    throw new S(5101, !1);
                return (this._eventNameToPlugin.set(t, r), r);
            }
            static ɵfac = function (r) {
                return new (r || e)(N(wl), N(ne));
            };
            static ɵprov = w({ token: e, factory: e.ɵfac });
        }
        return e;
    })(),
    rs = class {
        _doc;
        constructor(n) {
            this._doc = n;
        }
        manager;
    },
    El = "ng-app-id";
function yv(e) {
    for (let n of e) n.remove();
}
function vv(e, n) {
    let t = n.createElement("style");
    return ((t.textContent = e), t);
}
function K1(e, n, t, r) {
    let i = e.head?.querySelectorAll(`style[${El}="${n}"],link[${El}="${n}"]`);
    if (i)
        for (let o of i)
            (o.removeAttribute(El),
                o instanceof HTMLLinkElement
                    ? r.set(o.href.slice(o.href.lastIndexOf("/") + 1), {
                          usage: 0,
                          elements: [o],
                      })
                    : o.textContent &&
                      t.set(o.textContent, { usage: 0, elements: [o] }));
}
function Ff(e, n) {
    let t = n.createElement("link");
    return (t.setAttribute("rel", "stylesheet"), t.setAttribute("href", e), t);
}
var jf = (() => {
        class e {
            doc;
            appId;
            nonce;
            inline = new Map();
            external = new Map();
            hosts = new Set();
            isServer;
            constructor(t, r, i, o = {}) {
                ((this.doc = t),
                    (this.appId = r),
                    (this.nonce = i),
                    (this.isServer = Vi(o)),
                    K1(t, r, this.inline, this.external),
                    this.hosts.add(t.head));
            }
            addStyles(t, r) {
                for (let i of t) this.addUsage(i, this.inline, vv);
                r?.forEach((i) => this.addUsage(i, this.external, Ff));
            }
            removeStyles(t, r) {
                for (let i of t) this.removeUsage(i, this.inline);
                r?.forEach((i) => this.removeUsage(i, this.external));
            }
            addUsage(t, r, i) {
                let o = r.get(t);
                o
                    ? o.usage++
                    : r.set(t, {
                          usage: 1,
                          elements: [...this.hosts].map((s) =>
                              this.addElement(s, i(t, this.doc))
                          ),
                      });
            }
            removeUsage(t, r) {
                let i = r.get(t);
                i && (i.usage--, i.usage <= 0 && (yv(i.elements), r.delete(t)));
            }
            ngOnDestroy() {
                for (let [, { elements: t }] of [
                    ...this.inline,
                    ...this.external,
                ])
                    yv(t);
                this.hosts.clear();
            }
            addHost(t) {
                this.hosts.add(t);
                for (let [r, { elements: i }] of this.inline)
                    i.push(this.addElement(t, vv(r, this.doc)));
                for (let [r, { elements: i }] of this.external)
                    i.push(this.addElement(t, Ff(r, this.doc)));
            }
            removeHost(t) {
                this.hosts.delete(t);
            }
            addElement(t, r) {
                return (
                    this.nonce && r.setAttribute("nonce", this.nonce),
                    this.isServer && r.setAttribute(El, this.appId),
                    t.appendChild(r)
                );
            }
            static ɵfac = function (r) {
                return new (r || e)(N(re), N(jd), N(Hd, 8), N(ct));
            };
            static ɵprov = w({ token: e, factory: e.ɵfac });
        }
        return e;
    })(),
    Lf = {
        svg: "http://www.w3.org/2000/svg",
        xhtml: "http://www.w3.org/1999/xhtml",
        xlink: "http://www.w3.org/1999/xlink",
        xml: "http://www.w3.org/XML/1998/namespace",
        xmlns: "http://www.w3.org/2000/xmlns/",
        math: "http://www.w3.org/1998/Math/MathML",
    },
    Bf = /%COMP%/g;
var Cv = "%COMP%",
    Q1 = `_nghost-${Cv}`,
    Z1 = `_ngcontent-${Cv}`,
    X1 = !0,
    J1 = new O("", { providedIn: "root", factory: () => X1 });
function eT(e) {
    return Z1.replace(Bf, e);
}
function tT(e) {
    return Q1.replace(Bf, e);
}
function Ev(e, n) {
    return n.map((t) => t.replace(Bf, e));
}
var ss = (() => {
        class e {
            eventManager;
            sharedStylesHost;
            appId;
            removeStylesOnCompDestroy;
            doc;
            platformId;
            ngZone;
            nonce;
            tracingService;
            rendererByCompId = new Map();
            defaultRenderer;
            platformIsServer;
            constructor(t, r, i, o, s, a, l, c = null, u = null) {
                ((this.eventManager = t),
                    (this.sharedStylesHost = r),
                    (this.appId = i),
                    (this.removeStylesOnCompDestroy = o),
                    (this.doc = s),
                    (this.platformId = a),
                    (this.ngZone = l),
                    (this.nonce = c),
                    (this.tracingService = u),
                    (this.platformIsServer = Vi(a)),
                    (this.defaultRenderer = new is(
                        t,
                        s,
                        l,
                        this.platformIsServer,
                        this.tracingService
                    )));
            }
            createRenderer(t, r) {
                if (!t || !r) return this.defaultRenderer;
                this.platformIsServer &&
                    r.encapsulation === cn.ShadowDom &&
                    (r = oe(E({}, r), { encapsulation: cn.Emulated }));
                let i = this.getOrCreateRenderer(t, r);
                return (
                    i instanceof Sl
                        ? i.applyToHost(t)
                        : i instanceof os && i.applyStyles(),
                    i
                );
            }
            getOrCreateRenderer(t, r) {
                let i = this.rendererByCompId,
                    o = i.get(r.id);
                if (!o) {
                    let s = this.doc,
                        a = this.ngZone,
                        l = this.eventManager,
                        c = this.sharedStylesHost,
                        u = this.removeStylesOnCompDestroy,
                        d = this.platformIsServer,
                        p = this.tracingService;
                    switch (r.encapsulation) {
                        case cn.Emulated:
                            o = new Sl(l, c, r, this.appId, u, s, a, d, p);
                            break;
                        case cn.ShadowDom:
                            return new $f(l, c, t, r, s, a, this.nonce, d, p);
                        default:
                            o = new os(l, c, r, u, s, a, d, p);
                            break;
                    }
                    i.set(r.id, o);
                }
                return o;
            }
            ngOnDestroy() {
                this.rendererByCompId.clear();
            }
            componentReplaced(t) {
                this.rendererByCompId.delete(t);
            }
            static ɵfac = function (r) {
                return new (r || e)(
                    N(Vf),
                    N(jf),
                    N(jd),
                    N(J1),
                    N(re),
                    N(ct),
                    N(ne),
                    N(Hd),
                    N(Ai, 8)
                );
            };
            static ɵprov = w({ token: e, factory: e.ɵfac });
        }
        return e;
    })(),
    is = class {
        eventManager;
        doc;
        ngZone;
        platformIsServer;
        tracingService;
        data = Object.create(null);
        throwOnSyntheticProps = !0;
        constructor(n, t, r, i, o) {
            ((this.eventManager = n),
                (this.doc = t),
                (this.ngZone = r),
                (this.platformIsServer = i),
                (this.tracingService = o));
        }
        destroy() {}
        destroyNode = null;
        createElement(n, t) {
            return t
                ? this.doc.createElementNS(Lf[t] || t, n)
                : this.doc.createElement(n);
        }
        createComment(n) {
            return this.doc.createComment(n);
        }
        createText(n) {
            return this.doc.createTextNode(n);
        }
        appendChild(n, t) {
            (bv(n) ? n.content : n).appendChild(t);
        }
        insertBefore(n, t, r) {
            n && (bv(n) ? n.content : n).insertBefore(t, r);
        }
        removeChild(n, t) {
            t.remove();
        }
        selectRootElement(n, t) {
            let r = typeof n == "string" ? this.doc.querySelector(n) : n;
            if (!r) throw new S(-5104, !1);
            return (t || (r.textContent = ""), r);
        }
        parentNode(n) {
            return n.parentNode;
        }
        nextSibling(n) {
            return n.nextSibling;
        }
        setAttribute(n, t, r, i) {
            if (i) {
                t = i + ":" + t;
                let o = Lf[i];
                o ? n.setAttributeNS(o, t, r) : n.setAttribute(t, r);
            } else n.setAttribute(t, r);
        }
        removeAttribute(n, t, r) {
            if (r) {
                let i = Lf[r];
                i ? n.removeAttributeNS(i, t) : n.removeAttribute(`${r}:${t}`);
            } else n.removeAttribute(t);
        }
        addClass(n, t) {
            n.classList.add(t);
        }
        removeClass(n, t) {
            n.classList.remove(t);
        }
        setStyle(n, t, r, i) {
            i & (un.DashCase | un.Important)
                ? n.style.setProperty(t, r, i & un.Important ? "important" : "")
                : (n.style[t] = r);
        }
        removeStyle(n, t, r) {
            r & un.DashCase ? n.style.removeProperty(t) : (n.style[t] = "");
        }
        setProperty(n, t, r) {
            n != null && (n[t] = r);
        }
        setValue(n, t) {
            n.nodeValue = t;
        }
        listen(n, t, r, i) {
            if (
                typeof n == "string" &&
                ((n = mn().getGlobalEventTarget(this.doc, n)), !n)
            )
                throw new S(5102, !1);
            let o = this.decoratePreventDefault(r);
            return (
                this.tracingService?.wrapEventListener &&
                    (o = this.tracingService.wrapEventListener(n, t, o)),
                this.eventManager.addEventListener(n, t, o, i)
            );
        }
        decoratePreventDefault(n) {
            return (t) => {
                if (t === "__ngUnwrap__") return n;
                (this.platformIsServer
                    ? this.ngZone.runGuarded(() => n(t))
                    : n(t)) === !1 && t.preventDefault();
            };
        }
    };
function bv(e) {
    return e.tagName === "TEMPLATE" && e.content !== void 0;
}
var $f = class extends is {
        sharedStylesHost;
        hostEl;
        shadowRoot;
        constructor(n, t, r, i, o, s, a, l, c) {
            (super(n, o, s, l, c),
                (this.sharedStylesHost = t),
                (this.hostEl = r),
                (this.shadowRoot = r.attachShadow({ mode: "open" })),
                this.sharedStylesHost.addHost(this.shadowRoot));
            let u = i.styles;
            u = Ev(i.id, u);
            for (let p of u) {
                let f = document.createElement("style");
                (a && f.setAttribute("nonce", a),
                    (f.textContent = p),
                    this.shadowRoot.appendChild(f));
            }
            let d = i.getExternalStyles?.();
            if (d)
                for (let p of d) {
                    let f = Ff(p, o);
                    (a && f.setAttribute("nonce", a),
                        this.shadowRoot.appendChild(f));
                }
        }
        nodeOrShadowRoot(n) {
            return n === this.hostEl ? this.shadowRoot : n;
        }
        appendChild(n, t) {
            return super.appendChild(this.nodeOrShadowRoot(n), t);
        }
        insertBefore(n, t, r) {
            return super.insertBefore(this.nodeOrShadowRoot(n), t, r);
        }
        removeChild(n, t) {
            return super.removeChild(null, t);
        }
        parentNode(n) {
            return this.nodeOrShadowRoot(
                super.parentNode(this.nodeOrShadowRoot(n))
            );
        }
        destroy() {
            this.sharedStylesHost.removeHost(this.shadowRoot);
        }
    },
    os = class extends is {
        sharedStylesHost;
        removeStylesOnCompDestroy;
        styles;
        styleUrls;
        constructor(n, t, r, i, o, s, a, l, c) {
            (super(n, o, s, a, l),
                (this.sharedStylesHost = t),
                (this.removeStylesOnCompDestroy = i));
            let u = r.styles;
            ((this.styles = c ? Ev(c, u) : u),
                (this.styleUrls = r.getExternalStyles?.(c)));
        }
        applyStyles() {
            this.sharedStylesHost.addStyles(this.styles, this.styleUrls);
        }
        destroy() {
            this.removeStylesOnCompDestroy &&
                this.sharedStylesHost.removeStyles(this.styles, this.styleUrls);
        }
    },
    Sl = class extends os {
        contentAttr;
        hostAttr;
        constructor(n, t, r, i, o, s, a, l, c) {
            let u = i + "-" + r.id;
            (super(n, t, r, o, s, a, l, c, u),
                (this.contentAttr = eT(u)),
                (this.hostAttr = tT(u)));
        }
        applyToHost(n) {
            (this.applyStyles(), this.setAttribute(n, this.hostAttr, ""));
        }
        createElement(n, t) {
            let r = super.createElement(n, t);
            return (super.setAttribute(r, this.contentAttr, ""), r);
        }
    };
var Dl = class e extends Zo {
        supportsDOMEvents = !0;
        static makeCurrent() {
            Of(new e());
        }
        onAndCancel(n, t, r, i) {
            return (
                n.addEventListener(t, r, i),
                () => {
                    n.removeEventListener(t, r, i);
                }
            );
        }
        dispatchEvent(n, t) {
            n.dispatchEvent(t);
        }
        remove(n) {
            n.remove();
        }
        createElement(n, t) {
            return ((t = t || this.getDefaultDocument()), t.createElement(n));
        }
        createHtmlDocument() {
            return document.implementation.createHTMLDocument("fakeTitle");
        }
        getDefaultDocument() {
            return document;
        }
        isElementNode(n) {
            return n.nodeType === Node.ELEMENT_NODE;
        }
        isShadowRoot(n) {
            return n instanceof DocumentFragment;
        }
        getGlobalEventTarget(n, t) {
            return t === "window"
                ? window
                : t === "document"
                  ? n
                  : t === "body"
                    ? n.body
                    : null;
        }
        getBaseHref(n) {
            let t = nT();
            return t == null ? null : rT(t);
        }
        resetBaseElement() {
            as = null;
        }
        getUserAgent() {
            return window.navigator.userAgent;
        }
        getCookie(n) {
            return Rf(document.cookie, n);
        }
    },
    as = null;
function nT() {
    return (
        (as = as || document.head.querySelector("base")),
        as ? as.getAttribute("href") : null
    );
}
function rT(e) {
    return new URL(e, document.baseURI).pathname;
}
var Ml = class {
        addToWindow(n) {
            ((Gt.getAngularTestability = (r, i = !0) => {
                let o = n.findTestabilityInTree(r, i);
                if (o == null) throw new S(5103, !1);
                return o;
            }),
                (Gt.getAllAngularTestabilities = () => n.getAllTestabilities()),
                (Gt.getAllAngularRootElements = () => n.getAllRootElements()));
            let t = (r) => {
                let i = Gt.getAllAngularTestabilities(),
                    o = i.length,
                    s = function () {
                        (o--, o == 0 && r());
                    };
                i.forEach((a) => {
                    a.whenStable(s);
                });
            };
            (Gt.frameworkStabilizers || (Gt.frameworkStabilizers = []),
                Gt.frameworkStabilizers.push(t));
        }
        findTestabilityInTree(n, t, r) {
            if (t == null) return null;
            let i = n.getTestability(t);
            return (
                i ??
                (r
                    ? mn().isShadowRoot(t)
                        ? this.findTestabilityInTree(n, t.host, !0)
                        : this.findTestabilityInTree(n, t.parentElement, !0)
                    : null)
            );
        }
    },
    iT = (() => {
        class e {
            build() {
                return new XMLHttpRequest();
            }
            static ɵfac = function (r) {
                return new (r || e)();
            };
            static ɵprov = w({ token: e, factory: e.ɵfac });
        }
        return e;
    })(),
    wv = (() => {
        class e extends rs {
            constructor(t) {
                super(t);
            }
            supports(t) {
                return !0;
            }
            addEventListener(t, r, i, o) {
                return (
                    t.addEventListener(r, i, o),
                    () => this.removeEventListener(t, r, i, o)
                );
            }
            removeEventListener(t, r, i, o) {
                return t.removeEventListener(r, i, o);
            }
            static ɵfac = function (r) {
                return new (r || e)(N(re));
            };
            static ɵprov = w({ token: e, factory: e.ɵfac });
        }
        return e;
    })(),
    Sv = ["alt", "control", "meta", "shift"],
    oT = {
        "\b": "Backspace",
        "	": "Tab",
        "\x7F": "Delete",
        "\x1B": "Escape",
        Del: "Delete",
        Esc: "Escape",
        Left: "ArrowLeft",
        Right: "ArrowRight",
        Up: "ArrowUp",
        Down: "ArrowDown",
        Menu: "ContextMenu",
        Scroll: "ScrollLock",
        Win: "OS",
    },
    sT = {
        alt: (e) => e.altKey,
        control: (e) => e.ctrlKey,
        meta: (e) => e.metaKey,
        shift: (e) => e.shiftKey,
    },
    Dv = (() => {
        class e extends rs {
            constructor(t) {
                super(t);
            }
            supports(t) {
                return e.parseEventName(t) != null;
            }
            addEventListener(t, r, i, o) {
                let s = e.parseEventName(r),
                    a = e.eventCallback(s.fullKey, i, this.manager.getZone());
                return this.manager
                    .getZone()
                    .runOutsideAngular(() =>
                        mn().onAndCancel(t, s.domEventName, a, o)
                    );
            }
            static parseEventName(t) {
                let r = t.toLowerCase().split("."),
                    i = r.shift();
                if (r.length === 0 || !(i === "keydown" || i === "keyup"))
                    return null;
                let o = e._normalizeKey(r.pop()),
                    s = "",
                    a = r.indexOf("code");
                if (
                    (a > -1 && (r.splice(a, 1), (s = "code.")),
                    Sv.forEach((c) => {
                        let u = r.indexOf(c);
                        u > -1 && (r.splice(u, 1), (s += c + "."));
                    }),
                    (s += o),
                    r.length != 0 || o.length === 0)
                )
                    return null;
                let l = {};
                return ((l.domEventName = i), (l.fullKey = s), l);
            }
            static matchEventFullKeyCode(t, r) {
                let i = oT[t.key] || t.key,
                    o = "";
                return (
                    r.indexOf("code.") > -1 && ((i = t.code), (o = "code.")),
                    i == null || !i
                        ? !1
                        : ((i = i.toLowerCase()),
                          i === " " ? (i = "space") : i === "." && (i = "dot"),
                          Sv.forEach((s) => {
                              if (s !== i) {
                                  let a = sT[s];
                                  a(t) && (o += s + ".");
                              }
                          }),
                          (o += i),
                          o === r)
                );
            }
            static eventCallback(t, r, i) {
                return (o) => {
                    e.matchEventFullKeyCode(o, t) && i.runGuarded(() => r(o));
                };
            }
            static _normalizeKey(t) {
                return t === "esc" ? "escape" : t;
            }
            static ɵfac = function (r) {
                return new (r || e)(N(re));
            };
            static ɵprov = w({ token: e, factory: e.ɵfac });
        }
        return e;
    })();
function aT() {
    Dl.makeCurrent();
}
function lT() {
    return new ln();
}
function cT() {
    return (g_(document), document);
}
var uT = [
        { provide: ct, useValue: Cl },
        { provide: Bd, useValue: aT, multi: !0 },
        { provide: re, useFactory: cT },
    ],
    Uf = wf(ov, "browser", uT);
var dT = [
        { provide: Wo, useClass: Ml },
        { provide: gf, useClass: pl, deps: [ne, hl, Wo] },
        { provide: pl, useClass: pl, deps: [ne, hl, Wo] },
    ],
    fT = [
        { provide: el, useValue: "root" },
        { provide: ln, useFactory: lT },
        { provide: wl, useClass: wv, multi: !0, deps: [re] },
        { provide: wl, useClass: Dv, multi: !0, deps: [re] },
        ss,
        jf,
        Vf,
        { provide: tr, useExisting: ss },
        { provide: ns, useClass: iT },
        [],
    ],
    ls = (() => {
        class e {
            constructor() {}
            static ɵfac = function (r) {
                return new (r || e)();
            };
            static ɵmod = ge({ type: e });
            static ɵinj = he({ providers: [...fT, ...dT], imports: [Qt, sv] });
        }
        return e;
    })();
var Mv = (() => {
    class e {
        _doc;
        constructor(t) {
            this._doc = t;
        }
        getTitle() {
            return this._doc.title;
        }
        setTitle(t) {
            this._doc.title = t || "";
        }
        static ɵfac = function (r) {
            return new (r || e)(N(re));
        };
        static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
    return e;
})();
function Fr(e, n) {
    return e
        ? e.classList
            ? e.classList.contains(n)
            : new RegExp("(^| )" + n + "( |$)", "gi").test(e.className)
        : !1;
}
function Un(e, n) {
    if (e && n) {
        let t = (r) => {
            Fr(e, r) ||
                (e.classList ? e.classList.add(r) : (e.className += " " + r));
        };
        [n]
            .flat()
            .filter(Boolean)
            .forEach((r) => r.split(" ").forEach(t));
    }
}
function pT() {
    return window.innerWidth - document.documentElement.offsetWidth;
}
function Tv(e) {
    for (let n of document?.styleSheets)
        try {
            for (let t of n?.cssRules)
                for (let r of t?.style)
                    if (e.test(r))
                        return {
                            name: r,
                            value: t.style.getPropertyValue(r).trim(),
                        };
        } catch {}
    return null;
}
function Hf(e = "p-overflow-hidden") {
    let n = Tv(/-scrollbar-width$/);
    (n?.name && document.body.style.setProperty(n.name, pT() + "px"),
        Un(document.body, e));
}
function Zt(e, n) {
    if (e && n) {
        let t = (r) => {
            e.classList
                ? e.classList.remove(r)
                : (e.className = e.className.replace(
                      new RegExp(
                          "(^|\\b)" + r.split(" ").join("|") + "(\\b|$)",
                          "gi"
                      ),
                      " "
                  ));
        };
        [n]
            .flat()
            .filter(Boolean)
            .forEach((r) => r.split(" ").forEach(t));
    }
}
function zf(e = "p-overflow-hidden") {
    let n = Tv(/-scrollbar-width$/);
    (n?.name && document.body.style.removeProperty(n.name),
        Zt(document.body, e));
}
function Wf() {
    let e = window,
        n = document,
        t = n.documentElement,
        r = n.getElementsByTagName("body")[0],
        i = e.innerWidth || t.clientWidth || r.clientWidth,
        o = e.innerHeight || t.clientHeight || r.clientHeight;
    return { width: i, height: o };
}
function cs(e, n) {
    if (e instanceof HTMLElement) {
        let t = e.offsetWidth;
        if (n) {
            let r = getComputedStyle(e);
            t += parseFloat(r.marginLeft) + parseFloat(r.marginRight);
        }
        return t;
    }
    return 0;
}
function Il(e) {
    return typeof HTMLElement == "object"
        ? e instanceof HTMLElement
        : e &&
              typeof e == "object" &&
              e !== null &&
              e.nodeType === 1 &&
              typeof e.nodeName == "string";
}
function hT(e) {
    let n = e;
    return (
        e &&
            typeof e == "object" &&
            (e.hasOwnProperty("current")
                ? (n = e.current)
                : e.hasOwnProperty("el") &&
                  (e.el.hasOwnProperty("nativeElement")
                      ? (n = e.el.nativeElement)
                      : (n = e.el))),
        Il(n) ? n : void 0
    );
}
function xv(e, n) {
    let t = hT(e);
    if (t) t.appendChild(n);
    else throw new Error("Cannot append " + n + " to " + e);
}
function Tl(e, n = {}) {
    if (Il(e)) {
        let t = (r, i) => {
            var o, s;
            let a =
                (o = e?.$attrs) != null && o[r]
                    ? [(s = e?.$attrs) == null ? void 0 : s[r]]
                    : [];
            return [i].flat().reduce((l, c) => {
                if (c != null) {
                    let u = typeof c;
                    if (u === "string" || u === "number") l.push(c);
                    else if (u === "object") {
                        let d = Array.isArray(c)
                            ? t(r, c)
                            : Object.entries(c).map(([p, f]) =>
                                  r === "style" && (f || f === 0)
                                      ? `${p.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}:${f}`
                                      : f
                                        ? p
                                        : void 0
                              );
                        l = d.length ? l.concat(d.filter((p) => !!p)) : l;
                    }
                }
                return l;
            }, a);
        };
        Object.entries(n).forEach(([r, i]) => {
            if (i != null) {
                let o = r.match(/^on(.+)/);
                o
                    ? e.addEventListener(o[1].toLowerCase(), i)
                    : r === "p-bind" || r === "pBind"
                      ? Tl(e, i)
                      : ((i =
                            r === "class"
                                ? [...new Set(t("class", i))].join(" ").trim()
                                : r === "style"
                                  ? t("style", i).join(";").trim()
                                  : i),
                        (e.$attrs = e.$attrs || {}) && (e.$attrs[r] = i),
                        e.setAttribute(r, i));
            }
        });
    }
}
function Ov(e, n = {}, ...t) {
    if (e) {
        let r = document.createElement(e);
        return (Tl(r, n), r.append(...t), r);
    }
}
function gT(e, n) {
    return Il(e) ? Array.from(e.querySelectorAll(n)) : [];
}
function qf(e, n) {
    e && document.activeElement !== e && e.focus(n);
}
function Pv(e, n = "") {
    let t = gT(
            e,
            `button:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${n},
            [href][clientHeight][clientWidth]:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${n},
            input:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${n},
            select:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${n},
            textarea:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${n},
            [tabIndex]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${n},
            [contenteditable]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${n}`
        ),
        r = [];
    for (let i of t)
        getComputedStyle(i).display != "none" &&
            getComputedStyle(i).visibility != "hidden" &&
            r.push(i);
    return r;
}
function Nv(e, n) {
    let t = Pv(e, n);
    return t.length > 0 ? t[0] : null;
}
function Gf(e) {
    if (e) {
        let n = e.offsetHeight,
            t = getComputedStyle(e);
        return (
            (n -=
                parseFloat(t.paddingTop) +
                parseFloat(t.paddingBottom) +
                parseFloat(t.borderTopWidth) +
                parseFloat(t.borderBottomWidth)),
            n
        );
    }
    return 0;
}
function Av(e, n) {
    let t = Pv(e, n);
    return t.length > 0 ? t[t.length - 1] : null;
}
function Rv(e) {
    if (e) {
        let n = e.getBoundingClientRect();
        return {
            top:
                n.top +
                (window.pageYOffset ||
                    document.documentElement.scrollTop ||
                    document.body.scrollTop ||
                    0),
            left:
                n.left +
                (window.pageXOffset ||
                    document.documentElement.scrollLeft ||
                    document.body.scrollLeft ||
                    0),
        };
    }
    return { top: "auto", left: "auto" };
}
function ji(e, n) {
    if (e) {
        let t = e.offsetHeight;
        if (n) {
            let r = getComputedStyle(e);
            t += parseFloat(r.marginTop) + parseFloat(r.marginBottom);
        }
        return t;
    }
    return 0;
}
function Yf(e) {
    if (e) {
        let n = e.offsetWidth,
            t = getComputedStyle(e);
        return (
            (n -=
                parseFloat(t.paddingLeft) +
                parseFloat(t.paddingRight) +
                parseFloat(t.borderLeftWidth) +
                parseFloat(t.borderRightWidth)),
            n
        );
    }
    return 0;
}
function kv(e) {
    var n;
    e &&
        ("remove" in Element.prototype
            ? e.remove()
            : (n = e.parentNode) == null || n.removeChild(e));
}
function Lv(e, n = "", t) {
    Il(e) && t !== null && t !== void 0 && e.setAttribute(n, t);
}
function Fv() {
    let e = new Map();
    return {
        on(n, t) {
            let r = e.get(n);
            return (r ? r.push(t) : (r = [t]), e.set(n, r), this);
        },
        off(n, t) {
            let r = e.get(n);
            return (r && r.splice(r.indexOf(t) >>> 0, 1), this);
        },
        emit(n, t) {
            let r = e.get(n);
            r &&
                r.slice().map((i) => {
                    i(t);
                });
        },
        clear() {
            e.clear();
        },
    };
}
function Ft(e) {
    return (
        e == null ||
        e === "" ||
        (Array.isArray(e) && e.length === 0) ||
        (!(e instanceof Date) &&
            typeof e == "object" &&
            Object.keys(e).length === 0)
    );
}
function mT(e) {
    return !!(e && e.constructor && e.call && e.apply);
}
function ye(e) {
    return !Ft(e);
}
function Hn(e, n = !0) {
    return (
        e instanceof Object &&
        e.constructor === Object &&
        (n || Object.keys(e).length !== 0)
    );
}
function Lt(e, ...n) {
    return mT(e) ? e(...n) : e;
}
function ar(e, n = !0) {
    return typeof e == "string" && (n || e !== "");
}
function $v(e) {
    return ar(e) ? e.replace(/(-|_)/g, "").toLowerCase() : e;
}
function xl(e, n = "", t = {}) {
    let r = $v(n).split("."),
        i = r.shift();
    return i
        ? Hn(e)
            ? xl(
                  Lt(e[Object.keys(e).find((o) => $v(o) === i) || ""], t),
                  r.join("."),
                  t
              )
            : void 0
        : Lt(e, t);
}
function Ol(e, n = !0) {
    return Array.isArray(e) && (n || e.length !== 0);
}
function Vv(e) {
    return ye(e) && !isNaN(e);
}
function St(e, n) {
    if (n) {
        let t = n.test(e);
        return ((n.lastIndex = 0), t);
    }
    return !1;
}
function $r(e) {
    return (
        e &&
        e
            .replace(/\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g, "")
            .replace(/ {2,}/g, " ")
            .replace(/ ([{:}]) /g, "$1")
            .replace(/([;,]) /g, "$1")
            .replace(/ !/g, "!")
            .replace(/: /g, ":")
    );
}
function Pl(e) {
    return ar(e)
        ? e
              .replace(/(_)/g, "-")
              .replace(/[A-Z]/g, (n, t) =>
                  t === 0 ? n : "-" + n.toLowerCase()
              )
              .toLowerCase()
        : e;
}
function Kf(e) {
    return ar(e)
        ? e
              .replace(/[A-Z]/g, (n, t) =>
                  t === 0 ? n : "." + n.toLowerCase()
              )
              .toLowerCase()
        : e;
}
var Nl = {};
function $t(e = "pui_id_") {
    return (Nl.hasOwnProperty(e) || (Nl[e] = 0), Nl[e]++, `${e}${Nl[e]}`);
}
function _T() {
    let e = [],
        n = (s, a, l = 999) => {
            let c = i(s, a, l),
                u = c.value + (c.key === s ? 0 : l) + 1;
            return (e.push({ key: s, value: u }), u);
        },
        t = (s) => {
            e = e.filter((a) => a.value !== s);
        },
        r = (s, a) => i(s, a).value,
        i = (s, a, l = 0) =>
            [...e].reverse().find((c) => (a ? !0 : c.key === s)) || {
                key: s,
                value: l,
            },
        o = (s) => (s && parseInt(s.style.zIndex, 10)) || 0;
    return {
        get: o,
        set: (s, a, l) => {
            a && (a.style.zIndex = String(n(s, !0, l)));
        },
        clear: (s) => {
            s && (t(o(s)), (s.style.zIndex = ""));
        },
        getCurrent: (s) => r(s, !0),
    };
}
var QV = _T();
var Ue = (() => {
    class e {
        static STARTS_WITH = "startsWith";
        static CONTAINS = "contains";
        static NOT_CONTAINS = "notContains";
        static ENDS_WITH = "endsWith";
        static EQUALS = "equals";
        static NOT_EQUALS = "notEquals";
        static IN = "in";
        static LESS_THAN = "lt";
        static LESS_THAN_OR_EQUAL_TO = "lte";
        static GREATER_THAN = "gt";
        static GREATER_THAN_OR_EQUAL_TO = "gte";
        static BETWEEN = "between";
        static IS = "is";
        static IS_NOT = "isNot";
        static BEFORE = "before";
        static AFTER = "after";
        static DATE_IS = "dateIs";
        static DATE_IS_NOT = "dateIsNot";
        static DATE_BEFORE = "dateBefore";
        static DATE_AFTER = "dateAfter";
    }
    return e;
})();
var Bi = (() => {
        class e {
            template;
            type;
            name;
            constructor(t) {
                this.template = t;
            }
            getType() {
                return this.name;
            }
            static ɵfac = function (r) {
                return new (r || e)(Se(Rn));
            };
            static ɵdir = Me({
                type: e,
                selectors: [["", "pTemplate", ""]],
                inputs: { type: "type", name: [0, "pTemplate", "name"] },
            });
        }
        return e;
    })(),
    yn = (() => {
        class e {
            static ɵfac = function (r) {
                return new (r || e)();
            };
            static ɵmod = ge({ type: e });
            static ɵinj = he({ imports: [Qt] });
        }
        return e;
    })(),
    jv = (() => {
        class e {
            static STARTS_WITH = "startsWith";
            static CONTAINS = "contains";
            static NOT_CONTAINS = "notContains";
            static ENDS_WITH = "endsWith";
            static EQUALS = "equals";
            static NOT_EQUALS = "notEquals";
            static NO_FILTER = "noFilter";
            static LT = "lt";
            static LTE = "lte";
            static GT = "gt";
            static GTE = "gte";
            static IS = "is";
            static IS_NOT = "isNot";
            static BEFORE = "before";
            static AFTER = "after";
            static CLEAR = "clear";
            static APPLY = "apply";
            static MATCH_ALL = "matchAll";
            static MATCH_ANY = "matchAny";
            static ADD_RULE = "addRule";
            static REMOVE_RULE = "removeRule";
            static ACCEPT = "accept";
            static REJECT = "reject";
            static CHOOSE = "choose";
            static UPLOAD = "upload";
            static CANCEL = "cancel";
            static PENDING = "pending";
            static FILE_SIZE_TYPES = "fileSizeTypes";
            static DAY_NAMES = "dayNames";
            static DAY_NAMES_SHORT = "dayNamesShort";
            static DAY_NAMES_MIN = "dayNamesMin";
            static MONTH_NAMES = "monthNames";
            static MONTH_NAMES_SHORT = "monthNamesShort";
            static FIRST_DAY_OF_WEEK = "firstDayOfWeek";
            static TODAY = "today";
            static WEEK_HEADER = "weekHeader";
            static WEAK = "weak";
            static MEDIUM = "medium";
            static STRONG = "strong";
            static PASSWORD_PROMPT = "passwordPrompt";
            static EMPTY_MESSAGE = "emptyMessage";
            static EMPTY_FILTER_MESSAGE = "emptyFilterMessage";
            static SHOW_FILTER_MENU = "showFilterMenu";
            static HIDE_FILTER_MENU = "hideFilterMenu";
            static SELECTION_MESSAGE = "selectionMessage";
            static ARIA = "aria";
            static SELECT_COLOR = "selectColor";
            static BROWSE_FILES = "browseFiles";
        }
        return e;
    })();
var vT = Object.defineProperty,
    bT = Object.defineProperties,
    CT = Object.getOwnPropertyDescriptors,
    Al = Object.getOwnPropertySymbols,
    Hv = Object.prototype.hasOwnProperty,
    zv = Object.prototype.propertyIsEnumerable,
    Bv = (e, n, t) =>
        n in e
            ? vT(e, n, {
                  enumerable: !0,
                  configurable: !0,
                  writable: !0,
                  value: t,
              })
            : (e[n] = t),
    Jt = (e, n) => {
        for (var t in n || (n = {})) Hv.call(n, t) && Bv(e, t, n[t]);
        if (Al) for (var t of Al(n)) zv.call(n, t) && Bv(e, t, n[t]);
        return e;
    },
    Qf = (e, n) => bT(e, CT(n)),
    zn = (e, n) => {
        var t = {};
        for (var r in e) Hv.call(e, r) && n.indexOf(r) < 0 && (t[r] = e[r]);
        if (e != null && Al)
            for (var r of Al(e))
                n.indexOf(r) < 0 && zv.call(e, r) && (t[r] = e[r]);
        return t;
    };
var ET = Fv(),
    wt = ET;
function Uv(e, n) {
    Ol(e) ? e.push(...(n || [])) : Hn(e) && Object.assign(e, n);
}
function ST(e) {
    return Hn(e) && e.hasOwnProperty("value") && e.hasOwnProperty("type")
        ? e.value
        : e;
}
function wT(e) {
    return e.replaceAll(/ /g, "").replace(/[^\w]/g, "-");
}
function Zf(e = "", n = "") {
    return wT(`${ar(e, !1) && ar(n, !1) ? `${e}-` : e}${n}`);
}
function Wv(e = "", n = "") {
    return `--${Zf(e, n)}`;
}
function DT(e = "") {
    let n = (e.match(/{/g) || []).length,
        t = (e.match(/}/g) || []).length;
    return (n + t) % 2 !== 0;
}
function qv(e, n = "", t = "", r = [], i) {
    if (ar(e)) {
        let o = /{([^}]*)}/g,
            s = e.trim();
        if (DT(s)) return;
        if (St(s, o)) {
            let a = s.replaceAll(o, (u) => {
                    let p = u
                        .replace(/{|}/g, "")
                        .split(".")
                        .filter((f) => !r.some((h) => St(f, h)));
                    return `var(${Wv(t, Pl(p.join("-")))}${ye(i) ? `, ${i}` : ""})`;
                }),
                l = /(\d+\s+[\+\-\*\/]\s+\d+)/g,
                c = /var\([^)]+\)/g;
            return St(a.replace(c, "0"), l) ? `calc(${a})` : a;
        }
        return s;
    } else if (Vv(e)) return e;
}
function MT(e, n, t) {
    ar(n, !1) && e.push(`${n}:${t};`);
}
function Ui(e, n) {
    return e ? `${e}{${n}}` : "";
}
var Hi = (...e) => IT(ue.getTheme(), ...e),
    IT = (e = {}, n, t, r) => {
        if (n) {
            let { variable: i, options: o } = ue.defaults || {},
                { prefix: s, transform: a } = e?.options || o || {},
                c = St(n, /{([^}]*)}/g) ? n : `{${n}}`;
            return r === "value" || (Ft(r) && a === "strict")
                ? ue.getTokenValue(n)
                : qv(c, void 0, s, [i.excludedKeyRegex], t);
        }
        return "";
    };
function TT(e, n = {}) {
    let t = ue.defaults.variable,
        {
            prefix: r = t.prefix,
            selector: i = t.selector,
            excludedKeyRegex: o = t.excludedKeyRegex,
        } = n,
        s = (c, u = "") =>
            Object.entries(c).reduce(
                (d, [p, f]) => {
                    let h = St(p, o) ? Zf(u) : Zf(u, Pl(p)),
                        _ = ST(f);
                    if (Hn(_)) {
                        let { variables: M, tokens: I } = s(_, h);
                        (Uv(d.tokens, I), Uv(d.variables, M));
                    } else
                        (d.tokens.push(
                            (r ? h.replace(`${r}-`, "") : h).replaceAll(
                                "-",
                                "."
                            )
                        ),
                            MT(d.variables, Wv(h), qv(_, h, r, [o])));
                    return d;
                },
                { variables: [], tokens: [] }
            ),
        { variables: a, tokens: l } = s(e, r);
    return {
        value: a,
        tokens: l,
        declarations: a.join(""),
        css: Ui(i, a.join("")),
    };
}
var Xt = {
        regex: {
            rules: {
                class: {
                    pattern: /^\.([a-zA-Z][\w-]*)$/,
                    resolve(e) {
                        return {
                            type: "class",
                            selector: e,
                            matched: this.pattern.test(e.trim()),
                        };
                    },
                },
                attr: {
                    pattern: /^\[(.*)\]$/,
                    resolve(e) {
                        return {
                            type: "attr",
                            selector: `:root${e}`,
                            matched: this.pattern.test(e.trim()),
                        };
                    },
                },
                media: {
                    pattern: /^@media (.*)$/,
                    resolve(e) {
                        return {
                            type: "media",
                            selector: `${e}{:root{[CSS]}}`,
                            matched: this.pattern.test(e.trim()),
                        };
                    },
                },
                system: {
                    pattern: /^system$/,
                    resolve(e) {
                        return {
                            type: "system",
                            selector:
                                "@media (prefers-color-scheme: dark){:root{[CSS]}}",
                            matched: this.pattern.test(e.trim()),
                        };
                    },
                },
                custom: {
                    resolve(e) {
                        return { type: "custom", selector: e, matched: !0 };
                    },
                },
            },
            resolve(e) {
                let n = Object.keys(this.rules)
                    .filter((t) => t !== "custom")
                    .map((t) => this.rules[t]);
                return [e].flat().map((t) => {
                    var r;
                    return (r = n
                        .map((i) => i.resolve(t))
                        .find((i) => i.matched)) != null
                        ? r
                        : this.rules.custom.resolve(t);
                });
            },
        },
        _toVariables(e, n) {
            return TT(e, { prefix: n?.prefix });
        },
        getCommon({
            name: e = "",
            theme: n = {},
            params: t,
            set: r,
            defaults: i,
        }) {
            var o, s, a, l, c, u, d;
            let { preset: p, options: f } = n,
                h,
                _,
                M,
                I,
                j,
                J,
                Q;
            if (ye(p) && f.transform !== "strict") {
                let { primitive: He, semantic: xe, extend: ae } = p,
                    me = xe || {},
                    { colorScheme: mt } = me,
                    Ut = zn(me, ["colorScheme"]),
                    fr = ae || {},
                    { colorScheme: It } = fr,
                    wn = zn(fr, ["colorScheme"]),
                    Kn = mt || {},
                    { dark: pr } = Kn,
                    T = zn(Kn, ["dark"]),
                    x = It || {},
                    { dark: A } = x,
                    W = zn(x, ["dark"]),
                    ve = ye(He) ? this._toVariables({ primitive: He }, f) : {},
                    Ke = ye(Ut) ? this._toVariables({ semantic: Ut }, f) : {},
                    Ne = ye(T) ? this._toVariables({ light: T }, f) : {},
                    Ht = ye(pr) ? this._toVariables({ dark: pr }, f) : {},
                    de = ye(wn) ? this._toVariables({ semantic: wn }, f) : {},
                    uo = ye(W) ? this._toVariables({ light: W }, f) : {},
                    $s = ye(A) ? this._toVariables({ dark: A }, f) : {},
                    [Ae, Dn] = [
                        (o = ve.declarations) != null ? o : "",
                        ve.tokens,
                    ],
                    [rt, Zr] = [
                        (s = Ke.declarations) != null ? s : "",
                        Ke.tokens || [],
                    ],
                    [fo, CC] = [
                        (a = Ne.declarations) != null ? a : "",
                        Ne.tokens || [],
                    ],
                    [EC, SC] = [
                        (l = Ht.declarations) != null ? l : "",
                        Ht.tokens || [],
                    ],
                    [wC, DC] = [
                        (c = de.declarations) != null ? c : "",
                        de.tokens || [],
                    ],
                    [MC, IC] = [
                        (u = uo.declarations) != null ? u : "",
                        uo.tokens || [],
                    ],
                    [TC, xC] = [
                        (d = $s.declarations) != null ? d : "",
                        $s.tokens || [],
                    ];
                ((h = this.transformCSS(e, Ae, "light", "variable", f, r, i)),
                    (_ = Dn));
                let OC = this.transformCSS(
                        e,
                        `${rt}${fo}`,
                        "light",
                        "variable",
                        f,
                        r,
                        i
                    ),
                    PC = this.transformCSS(
                        e,
                        `${EC}`,
                        "dark",
                        "variable",
                        f,
                        r,
                        i
                    );
                ((M = `${OC}${PC}`), (I = [...new Set([...Zr, ...CC, ...SC])]));
                let NC = this.transformCSS(
                        e,
                        `${wC}${MC}color-scheme:light`,
                        "light",
                        "variable",
                        f,
                        r,
                        i
                    ),
                    AC = this.transformCSS(
                        e,
                        `${TC}color-scheme:dark`,
                        "dark",
                        "variable",
                        f,
                        r,
                        i
                    );
                ((j = `${NC}${AC}`),
                    (J = [...new Set([...DC, ...IC, ...xC])]),
                    (Q = Lt(p.css, { dt: Hi })));
            }
            return {
                primitive: { css: h, tokens: _ },
                semantic: { css: M, tokens: I },
                global: { css: j, tokens: J },
                style: Q,
            };
        },
        getPreset({
            name: e = "",
            preset: n = {},
            options: t,
            params: r,
            set: i,
            defaults: o,
            selector: s,
        }) {
            var a, l, c;
            let u, d, p;
            if (ye(n) && t.transform !== "strict") {
                let f = e.replace("-directive", ""),
                    h = n,
                    { colorScheme: _, extend: M, css: I } = h,
                    j = zn(h, ["colorScheme", "extend", "css"]),
                    J = M || {},
                    { colorScheme: Q } = J,
                    He = zn(J, ["colorScheme"]),
                    xe = _ || {},
                    { dark: ae } = xe,
                    me = zn(xe, ["dark"]),
                    mt = Q || {},
                    { dark: Ut } = mt,
                    fr = zn(mt, ["dark"]),
                    It = ye(j)
                        ? this._toVariables({ [f]: Jt(Jt({}, j), He) }, t)
                        : {},
                    wn = ye(me)
                        ? this._toVariables({ [f]: Jt(Jt({}, me), fr) }, t)
                        : {},
                    Kn = ye(ae)
                        ? this._toVariables({ [f]: Jt(Jt({}, ae), Ut) }, t)
                        : {},
                    [pr, T] = [
                        (a = It.declarations) != null ? a : "",
                        It.tokens || [],
                    ],
                    [x, A] = [
                        (l = wn.declarations) != null ? l : "",
                        wn.tokens || [],
                    ],
                    [W, ve] = [
                        (c = Kn.declarations) != null ? c : "",
                        Kn.tokens || [],
                    ],
                    Ke = this.transformCSS(
                        f,
                        `${pr}${x}`,
                        "light",
                        "variable",
                        t,
                        i,
                        o,
                        s
                    ),
                    Ne = this.transformCSS(
                        f,
                        W,
                        "dark",
                        "variable",
                        t,
                        i,
                        o,
                        s
                    );
                ((u = `${Ke}${Ne}`),
                    (d = [...new Set([...T, ...A, ...ve])]),
                    (p = Lt(I, { dt: Hi })));
            }
            return { css: u, tokens: d, style: p };
        },
        getPresetC({
            name: e = "",
            theme: n = {},
            params: t,
            set: r,
            defaults: i,
        }) {
            var o;
            let { preset: s, options: a } = n,
                l = (o = s?.components) == null ? void 0 : o[e];
            return this.getPreset({
                name: e,
                preset: l,
                options: a,
                params: t,
                set: r,
                defaults: i,
            });
        },
        getPresetD({
            name: e = "",
            theme: n = {},
            params: t,
            set: r,
            defaults: i,
        }) {
            var o;
            let s = e.replace("-directive", ""),
                { preset: a, options: l } = n,
                c = (o = a?.directives) == null ? void 0 : o[s];
            return this.getPreset({
                name: s,
                preset: c,
                options: l,
                params: t,
                set: r,
                defaults: i,
            });
        },
        applyDarkColorScheme(e) {
            return !(
                e.darkModeSelector === "none" || e.darkModeSelector === !1
            );
        },
        getColorSchemeOption(e, n) {
            var t;
            return this.applyDarkColorScheme(e)
                ? this.regex.resolve(
                      e.darkModeSelector === !0
                          ? n.options.darkModeSelector
                          : (t = e.darkModeSelector) != null
                            ? t
                            : n.options.darkModeSelector
                  )
                : [];
        },
        getLayerOrder(e, n = {}, t, r) {
            let { cssLayer: i } = n;
            return i ? `@layer ${Lt(i.order || "primeui", t)}` : "";
        },
        getCommonStyleSheet({
            name: e = "",
            theme: n = {},
            params: t,
            props: r = {},
            set: i,
            defaults: o,
        }) {
            let s = this.getCommon({
                    name: e,
                    theme: n,
                    params: t,
                    set: i,
                    defaults: o,
                }),
                a = Object.entries(r)
                    .reduce((l, [c, u]) => l.push(`${c}="${u}"`) && l, [])
                    .join(" ");
            return Object.entries(s || {})
                .reduce((l, [c, u]) => {
                    if (u?.css) {
                        let d = $r(u?.css),
                            p = `${c}-variables`;
                        l.push(
                            `<style type="text/css" data-primevue-style-id="${p}" ${a}>${d}</style>`
                        );
                    }
                    return l;
                }, [])
                .join("");
        },
        getStyleSheet({
            name: e = "",
            theme: n = {},
            params: t,
            props: r = {},
            set: i,
            defaults: o,
        }) {
            var s;
            let a = { name: e, theme: n, params: t, set: i, defaults: o },
                l =
                    (s = e.includes("-directive")
                        ? this.getPresetD(a)
                        : this.getPresetC(a)) == null
                        ? void 0
                        : s.css,
                c = Object.entries(r)
                    .reduce((u, [d, p]) => u.push(`${d}="${p}"`) && u, [])
                    .join(" ");
            return l
                ? `<style type="text/css" data-primevue-style-id="${e}-variables" ${c}>${$r(l)}</style>`
                : "";
        },
        createTokens(e = {}, n, t = "", r = "", i = {}) {
            return (
                Object.entries(e).forEach(([o, s]) => {
                    let a = St(o, n.variable.excludedKeyRegex)
                            ? t
                            : t
                              ? `${t}.${Kf(o)}`
                              : Kf(o),
                        l = r ? `${r}.${o}` : o;
                    Hn(s)
                        ? this.createTokens(s, n, a, l, i)
                        : (i[a] ||
                              (i[a] = {
                                  paths: [],
                                  computed(c, u = {}) {
                                      var d, p;
                                      return this.paths.length === 1
                                          ? (d = this.paths[0]) == null
                                              ? void 0
                                              : d.computed(
                                                    this.paths[0].scheme,
                                                    u.binding
                                                )
                                          : c && c !== "none"
                                            ? (p = this.paths.find(
                                                  (f) => f.scheme === c
                                              )) == null
                                                ? void 0
                                                : p.computed(c, u.binding)
                                            : this.paths.map((f) =>
                                                  f.computed(
                                                      f.scheme,
                                                      u[f.scheme]
                                                  )
                                              );
                                  },
                              }),
                          i[a].paths.push({
                              path: l,
                              value: s,
                              scheme: l.includes("colorScheme.light")
                                  ? "light"
                                  : l.includes("colorScheme.dark")
                                    ? "dark"
                                    : "none",
                              computed(c, u = {}) {
                                  let d = /{([^}]*)}/g,
                                      p = s;
                                  if (
                                      ((u.name = this.path),
                                      u.binding || (u.binding = {}),
                                      St(s, d))
                                  ) {
                                      let h = s.trim().replaceAll(d, (I) => {
                                              var j;
                                              let J = I.replace(/{|}/g, ""),
                                                  Q =
                                                      (j = i[J]) == null
                                                          ? void 0
                                                          : j.computed(c, u);
                                              return Ol(Q) && Q.length === 2
                                                  ? `light-dark(${Q[0].value},${Q[1].value})`
                                                  : Q?.value;
                                          }),
                                          _ = /(\d+\w*\s+[\+\-\*\/]\s+\d+\w*)/g,
                                          M = /var\([^)]+\)/g;
                                      p = St(h.replace(M, "0"), _)
                                          ? `calc(${h})`
                                          : h;
                                  }
                                  return (
                                      Ft(u.binding) && delete u.binding,
                                      {
                                          colorScheme: c,
                                          path: this.path,
                                          paths: u,
                                          value: p.includes("undefined")
                                              ? void 0
                                              : p,
                                      }
                                  );
                              },
                          }));
                }),
                i
            );
        },
        getTokenValue(e, n, t) {
            var r;
            let o = ((l) =>
                    l
                        .split(".")
                        .filter(
                            (u) =>
                                !St(
                                    u.toLowerCase(),
                                    t.variable.excludedKeyRegex
                                )
                        )
                        .join("."))(n),
                s = n.includes("colorScheme.light")
                    ? "light"
                    : n.includes("colorScheme.dark")
                      ? "dark"
                      : void 0,
                a = [(r = e[o]) == null ? void 0 : r.computed(s)]
                    .flat()
                    .filter((l) => l);
            return a.length === 1
                ? a[0].value
                : a.reduce(
                      (l = {}, c) => {
                          let u = c,
                              { colorScheme: d } = u,
                              p = zn(u, ["colorScheme"]);
                          return ((l[d] = p), l);
                      },
                      void 0
                  );
        },
        getSelectorRule(e, n, t, r) {
            return t === "class" || t === "attr"
                ? Ui(ye(n) ? `${e}${n},${e} ${n}` : e, r)
                : Ui(e, ye(n) ? Ui(n, r) : r);
        },
        transformCSS(e, n, t, r, i = {}, o, s, a) {
            if (ye(n)) {
                let { cssLayer: l } = i;
                if (r !== "style") {
                    let c = this.getColorSchemeOption(i, s);
                    n =
                        t === "dark"
                            ? c.reduce(
                                  (u, { type: d, selector: p }) => (
                                      ye(p) &&
                                          (u += p.includes("[CSS]")
                                              ? p.replace("[CSS]", n)
                                              : this.getSelectorRule(
                                                    p,
                                                    a,
                                                    d,
                                                    n
                                                )),
                                      u
                                  ),
                                  ""
                              )
                            : Ui(a ?? ":root", n);
                }
                if (l) {
                    let c = { name: "primeui", order: "primeui" };
                    (Hn(l) && (c.name = Lt(l.name, { name: e, type: r })),
                        ye(c.name) &&
                            ((n = Ui(`@layer ${c.name}`, n)),
                            o?.layerNames(c.name)));
                }
                return n;
            }
            return "";
        },
    },
    ue = {
        defaults: {
            variable: {
                prefix: "p",
                selector: ":root",
                excludedKeyRegex:
                    /^(primitive|semantic|components|directives|variables|colorscheme|light|dark|common|root|states|extend|css)$/gi,
            },
            options: { prefix: "p", darkModeSelector: "system", cssLayer: !1 },
        },
        _theme: void 0,
        _layerNames: new Set(),
        _loadedStyleNames: new Set(),
        _loadingStyles: new Set(),
        _tokens: {},
        update(e = {}) {
            let { theme: n } = e;
            n &&
                ((this._theme = Qf(Jt({}, n), {
                    options: Jt(Jt({}, this.defaults.options), n.options),
                })),
                (this._tokens = Xt.createTokens(this.preset, this.defaults)),
                this.clearLoadedStyleNames());
        },
        get theme() {
            return this._theme;
        },
        get preset() {
            var e;
            return ((e = this.theme) == null ? void 0 : e.preset) || {};
        },
        get options() {
            var e;
            return ((e = this.theme) == null ? void 0 : e.options) || {};
        },
        get tokens() {
            return this._tokens;
        },
        getTheme() {
            return this.theme;
        },
        setTheme(e) {
            (this.update({ theme: e }), wt.emit("theme:change", e));
        },
        getPreset() {
            return this.preset;
        },
        setPreset(e) {
            ((this._theme = Qf(Jt({}, this.theme), { preset: e })),
                (this._tokens = Xt.createTokens(e, this.defaults)),
                this.clearLoadedStyleNames(),
                wt.emit("preset:change", e),
                wt.emit("theme:change", this.theme));
        },
        getOptions() {
            return this.options;
        },
        setOptions(e) {
            ((this._theme = Qf(Jt({}, this.theme), { options: e })),
                this.clearLoadedStyleNames(),
                wt.emit("options:change", e),
                wt.emit("theme:change", this.theme));
        },
        getLayerNames() {
            return [...this._layerNames];
        },
        setLayerNames(e) {
            this._layerNames.add(e);
        },
        getLoadedStyleNames() {
            return this._loadedStyleNames;
        },
        isStyleNameLoaded(e) {
            return this._loadedStyleNames.has(e);
        },
        setLoadedStyleName(e) {
            this._loadedStyleNames.add(e);
        },
        deleteLoadedStyleName(e) {
            this._loadedStyleNames.delete(e);
        },
        clearLoadedStyleNames() {
            this._loadedStyleNames.clear();
        },
        getTokenValue(e) {
            return Xt.getTokenValue(this.tokens, e, this.defaults);
        },
        getCommon(e = "", n) {
            return Xt.getCommon({
                name: e,
                theme: this.theme,
                params: n,
                defaults: this.defaults,
                set: { layerNames: this.setLayerNames.bind(this) },
            });
        },
        getComponent(e = "", n) {
            let t = {
                name: e,
                theme: this.theme,
                params: n,
                defaults: this.defaults,
                set: { layerNames: this.setLayerNames.bind(this) },
            };
            return Xt.getPresetC(t);
        },
        getDirective(e = "", n) {
            let t = {
                name: e,
                theme: this.theme,
                params: n,
                defaults: this.defaults,
                set: { layerNames: this.setLayerNames.bind(this) },
            };
            return Xt.getPresetD(t);
        },
        getCustomPreset(e = "", n, t, r) {
            let i = {
                name: e,
                preset: n,
                options: this.options,
                selector: t,
                params: r,
                defaults: this.defaults,
                set: { layerNames: this.setLayerNames.bind(this) },
            };
            return Xt.getPreset(i);
        },
        getLayerOrderCSS(e = "") {
            return Xt.getLayerOrder(
                e,
                this.options,
                { names: this.getLayerNames() },
                this.defaults
            );
        },
        transformCSS(e = "", n, t = "style", r) {
            return Xt.transformCSS(
                e,
                n,
                r,
                t,
                this.options,
                { layerNames: this.setLayerNames.bind(this) },
                this.defaults
            );
        },
        getCommonStyleSheet(e = "", n, t = {}) {
            return Xt.getCommonStyleSheet({
                name: e,
                theme: this.theme,
                params: n,
                props: t,
                defaults: this.defaults,
                set: { layerNames: this.setLayerNames.bind(this) },
            });
        },
        getStyleSheet(e, n, t = {}) {
            return Xt.getStyleSheet({
                name: e,
                theme: this.theme,
                params: n,
                props: t,
                defaults: this.defaults,
                set: { layerNames: this.setLayerNames.bind(this) },
            });
        },
        onStyleMounted(e) {
            this._loadingStyles.add(e);
        },
        onStyleUpdated(e) {
            this._loadingStyles.add(e);
        },
        onStyleLoaded(e, { name: n }) {
            this._loadingStyles.size &&
                (this._loadingStyles.delete(n),
                wt.emit(`theme:${n}:load`, e),
                !this._loadingStyles.size && wt.emit("theme:load"));
        },
    };
var xT = 0,
    Gv = (() => {
        class e {
            document = y(re);
            use(t, r = {}) {
                let i = !1,
                    o = t,
                    s = null,
                    {
                        immediate: a = !0,
                        manual: l = !1,
                        name: c = `style_${++xT}`,
                        id: u = void 0,
                        media: d = void 0,
                        nonce: p = void 0,
                        first: f = !1,
                        props: h = {},
                    } = r;
                if (this.document) {
                    if (
                        ((s =
                            this.document.querySelector(
                                `style[data-primeng-style-id="${c}"]`
                            ) ||
                            (u && this.document.getElementById(u)) ||
                            this.document.createElement("style")),
                        !s.isConnected)
                    ) {
                        o = t;
                        let _ = this.document.head;
                        (f && _.firstChild
                            ? _.insertBefore(s, _.firstChild)
                            : _.appendChild(s),
                            Tl(s, {
                                type: "text/css",
                                media: d,
                                nonce: p,
                                "data-primeng-style-id": c,
                            }));
                    }
                    return (
                        s.textContent !== o && (s.textContent = o),
                        { id: u, name: c, el: s, css: o }
                    );
                }
            }
            static ɵfac = function (r) {
                return new (r || e)();
            };
            static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" });
        }
        return e;
    })();
var zi = {
        _loadedStyleNames: new Set(),
        getLoadedStyleNames() {
            return this._loadedStyleNames;
        },
        isStyleNameLoaded(e) {
            return this._loadedStyleNames.has(e);
        },
        setLoadedStyleName(e) {
            this._loadedStyleNames.add(e);
        },
        deleteLoadedStyleName(e) {
            this._loadedStyleNames.delete(e);
        },
        clearLoadedStyleNames() {
            this._loadedStyleNames.clear();
        },
    },
    OT = ({ dt: e }) => `
*,
::before,
::after {
    box-sizing: border-box;
}

/* Non ng overlay animations */
.p-connected-overlay {
    opacity: 0;
    transform: scaleY(0.8);
    transition: transform 0.12s cubic-bezier(0, 0, 0.2, 1),
        opacity 0.12s cubic-bezier(0, 0, 0.2, 1);
}

.p-connected-overlay-visible {
    opacity: 1;
    transform: scaleY(1);
}

.p-connected-overlay-hidden {
    opacity: 0;
    transform: scaleY(1);
    transition: opacity 0.1s linear;
}

/* NG based overlay animations */
.p-connected-overlay-enter-from {
    opacity: 0;
    transform: scaleY(0.8);
}

.p-connected-overlay-leave-to {
    opacity: 0;
}

.p-connected-overlay-enter-active {
    transition: transform 0.12s cubic-bezier(0, 0, 0.2, 1),
        opacity 0.12s cubic-bezier(0, 0, 0.2, 1);
}

.p-connected-overlay-leave-active {
    transition: opacity 0.1s linear;
}

/* Toggleable Content */
.p-toggleable-content-enter-from,
.p-toggleable-content-leave-to {
    max-height: 0;
}

.p-toggleable-content-enter-to,
.p-toggleable-content-leave-from {
    max-height: 1000px;
}

.p-toggleable-content-leave-active {
    overflow: hidden;
    transition: max-height 0.45s cubic-bezier(0, 1, 0, 1);
}

.p-toggleable-content-enter-active {
    overflow: hidden;
    transition: max-height 1s ease-in-out;
}

.p-disabled,
.p-disabled * {
    cursor: default;
    pointer-events: none;
    user-select: none;
}

.p-disabled,
.p-component:disabled {
    opacity: ${e("disabled.opacity")};
}

.pi {
    font-size: ${e("icon.size")};
}

.p-icon {
    width: ${e("icon.size")};
    height: ${e("icon.size")};
}

.p-unselectable-text {
    user-select: none;
}

.p-overlay-mask {
    background: ${e("mask.background")};
    color: ${e("mask.color")};
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.p-overlay-mask-enter {
    animation: p-overlay-mask-enter-animation ${e("mask.transition.duration")} forwards;
}

.p-overlay-mask-leave {
    animation: p-overlay-mask-leave-animation ${e("mask.transition.duration")} forwards;
}
/* Temporarily disabled, distrupts PrimeNG overlay animations */
/* @keyframes p-overlay-mask-enter-animation {
    from {
        background: transparent;
    }
    to {
        background: ${e("mask.background")};
    }
}
@keyframes p-overlay-mask-leave-animation {
    from {
        background: ${e("mask.background")};
    }
    to {
        background: transparent;
    }
}*/

.p-iconwrapper {
    display: inline-flex;
    justify-content: center;
    align-items: center;
}
`,
    PT = ({ dt: e }) => `
.p-hidden-accessible {
    border: 0;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
}

.p-hidden-accessible input,
.p-hidden-accessible select {
    transform: scale(0);
}

.p-overflow-hidden {
    overflow: hidden;
    padding-right: ${e("scrollbar.width")};
}

/* @todo move to baseiconstyle.ts */

.p-icon {
    display: inline-block;
    vertical-align: baseline;
}

.p-icon-spin {
    -webkit-animation: p-icon-spin 2s infinite linear;
    animation: p-icon-spin 2s infinite linear;
}

@-webkit-keyframes p-icon-spin {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(359deg);
        transform: rotate(359deg);
    }
}

@keyframes p-icon-spin {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(359deg);
        transform: rotate(359deg);
    }
}
`,
    Ye = (() => {
        class e {
            name = "base";
            useStyle = y(Gv);
            theme = void 0;
            css = void 0;
            classes = {};
            inlineStyles = {};
            load = (t, r = {}, i = (o) => o) => {
                let o = i(Lt(t, { dt: Hi }));
                return o
                    ? this.useStyle.use($r(o), E({ name: this.name }, r))
                    : {};
            };
            loadCSS = (t = {}) => this.load(this.css, t);
            loadTheme = (t = {}, r = "") =>
                this.load(this.theme, t, (i = "") =>
                    ue.transformCSS(t.name || this.name, `${i}${r}`)
                );
            loadGlobalCSS = (t = {}) => this.load(PT, t);
            loadGlobalTheme = (t = {}, r = "") =>
                this.load(OT, t, (i = "") =>
                    ue.transformCSS(t.name || this.name, `${i}${r}`)
                );
            getCommonTheme = (t) => ue.getCommon(this.name, t);
            getComponentTheme = (t) => ue.getComponent(this.name, t);
            getDirectiveTheme = (t) => ue.getDirective(this.name, t);
            getPresetTheme = (t, r, i) =>
                ue.getCustomPreset(this.name, t, r, i);
            getLayerOrderThemeCSS = () => ue.getLayerOrderCSS(this.name);
            getStyleSheet = (t = "", r = {}) => {
                if (this.css) {
                    let i = Lt(this.css, { dt: Hi }),
                        o = $r(`${i}${t}`),
                        s = Object.entries(r)
                            .reduce(
                                (a, [l, c]) => a.push(`${l}="${c}"`) && a,
                                []
                            )
                            .join(" ");
                    return `<style type="text/css" data-primeng-style-id="${this.name}" ${s}>${o}</style>`;
                }
                return "";
            };
            getCommonThemeStyleSheet = (t, r = {}) =>
                ue.getCommonStyleSheet(this.name, t, r);
            getThemeStyleSheet = (t, r = {}) => {
                let i = [ue.getStyleSheet(this.name, t, r)];
                if (this.theme) {
                    let o =
                            this.name === "base"
                                ? "global-style"
                                : `${this.name}-style`,
                        s = Lt(this.theme, { dt: Hi }),
                        a = $r(ue.transformCSS(o, s)),
                        l = Object.entries(r)
                            .reduce(
                                (c, [u, d]) => c.push(`${u}="${d}"`) && c,
                                []
                            )
                            .join(" ");
                    i.push(
                        `<style type="text/css" data-primeng-style-id="${o}" ${l}>${a}</style>`
                    );
                }
                return i.join("");
            };
            static ɵfac = function (r) {
                return new (r || e)();
            };
            static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" });
        }
        return e;
    })();
var NT = (() => {
        class e {
            theme = Nr(void 0);
            csp = Nr({ nonce: void 0 });
            isThemeChanged = !1;
            document = y(re);
            baseStyle = y(Ye);
            constructor() {
                ($i(() => {
                    wt.on("theme:change", (t) => {
                        Tf(() => {
                            ((this.isThemeChanged = !0), this.theme.set(t));
                        });
                    });
                }),
                    $i(() => {
                        let t = this.theme();
                        this.document &&
                            t &&
                            (this.isThemeChanged || this.onThemeChange(t),
                            (this.isThemeChanged = !1));
                    }));
            }
            ngOnDestroy() {
                (ue.clearLoadedStyleNames(), wt.clear());
            }
            onThemeChange(t) {
                (ue.setTheme(t), this.document && this.loadCommonTheme());
            }
            loadCommonTheme() {
                if (
                    this.theme() !== "none" &&
                    !ue.isStyleNameLoaded("common")
                ) {
                    let {
                            primitive: t,
                            semantic: r,
                            global: i,
                            style: o,
                        } = this.baseStyle.getCommonTheme?.() || {},
                        s = { nonce: this.csp?.()?.nonce };
                    (this.baseStyle.load(
                        t?.css,
                        E({ name: "primitive-variables" }, s)
                    ),
                        this.baseStyle.load(
                            r?.css,
                            E({ name: "semantic-variables" }, s)
                        ),
                        this.baseStyle.load(
                            i?.css,
                            E({ name: "global-variables" }, s)
                        ),
                        this.baseStyle.loadGlobalTheme(
                            E({ name: "global-style" }, s),
                            o
                        ),
                        ue.setLoadedStyleName("common"));
                }
            }
            setThemeConfig(t) {
                let { theme: r, csp: i } = t || {};
                (r && this.theme.set(r), i && this.csp.set(i));
            }
            static ɵfac = function (r) {
                return new (r || e)();
            };
            static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" });
        }
        return e;
    })(),
    Jf = (() => {
        class e extends NT {
            ripple = Nr(!1);
            platformId = y(ct);
            inputStyle = Nr(null);
            inputVariant = Nr(null);
            overlayOptions = {};
            csp = Nr({ nonce: void 0 });
            filterMatchModeOptions = {
                text: [
                    Ue.STARTS_WITH,
                    Ue.CONTAINS,
                    Ue.NOT_CONTAINS,
                    Ue.ENDS_WITH,
                    Ue.EQUALS,
                    Ue.NOT_EQUALS,
                ],
                numeric: [
                    Ue.EQUALS,
                    Ue.NOT_EQUALS,
                    Ue.LESS_THAN,
                    Ue.LESS_THAN_OR_EQUAL_TO,
                    Ue.GREATER_THAN,
                    Ue.GREATER_THAN_OR_EQUAL_TO,
                ],
                date: [
                    Ue.DATE_IS,
                    Ue.DATE_IS_NOT,
                    Ue.DATE_BEFORE,
                    Ue.DATE_AFTER,
                ],
            };
            translation = {
                startsWith: "Starts with",
                contains: "Contains",
                notContains: "Not contains",
                endsWith: "Ends with",
                equals: "Equals",
                notEquals: "Not equals",
                noFilter: "No Filter",
                lt: "Less than",
                lte: "Less than or equal to",
                gt: "Greater than",
                gte: "Greater than or equal to",
                is: "Is",
                isNot: "Is not",
                before: "Before",
                after: "After",
                dateIs: "Date is",
                dateIsNot: "Date is not",
                dateBefore: "Date is before",
                dateAfter: "Date is after",
                clear: "Clear",
                apply: "Apply",
                matchAll: "Match All",
                matchAny: "Match Any",
                addRule: "Add Rule",
                removeRule: "Remove Rule",
                accept: "Yes",
                reject: "No",
                choose: "Choose",
                upload: "Upload",
                cancel: "Cancel",
                pending: "Pending",
                fileSizeTypes: [
                    "B",
                    "KB",
                    "MB",
                    "GB",
                    "TB",
                    "PB",
                    "EB",
                    "ZB",
                    "YB",
                ],
                dayNames: [
                    "Sunday",
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                ],
                dayNamesShort: [
                    "Sun",
                    "Mon",
                    "Tue",
                    "Wed",
                    "Thu",
                    "Fri",
                    "Sat",
                ],
                dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
                monthNames: [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                ],
                monthNamesShort: [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                ],
                chooseYear: "Choose Year",
                chooseMonth: "Choose Month",
                chooseDate: "Choose Date",
                prevDecade: "Previous Decade",
                nextDecade: "Next Decade",
                prevYear: "Previous Year",
                nextYear: "Next Year",
                prevMonth: "Previous Month",
                nextMonth: "Next Month",
                prevHour: "Previous Hour",
                nextHour: "Next Hour",
                prevMinute: "Previous Minute",
                nextMinute: "Next Minute",
                prevSecond: "Previous Second",
                nextSecond: "Next Second",
                am: "am",
                pm: "pm",
                dateFormat: "mm/dd/yy",
                firstDayOfWeek: 0,
                today: "Today",
                weekHeader: "Wk",
                weak: "Weak",
                medium: "Medium",
                strong: "Strong",
                passwordPrompt: "Enter a password",
                emptyMessage: "No results found",
                searchMessage: "Search results are available",
                selectionMessage: "{0} items selected",
                emptySelectionMessage: "No selected item",
                emptySearchMessage: "No results found",
                emptyFilterMessage: "No results found",
                fileChosenMessage: "Files",
                noFileChosenMessage: "No file chosen",
                aria: {
                    trueLabel: "True",
                    falseLabel: "False",
                    nullLabel: "Not Selected",
                    star: "1 star",
                    stars: "{star} stars",
                    selectAll: "All items selected",
                    unselectAll: "All items unselected",
                    close: "Close",
                    previous: "Previous",
                    next: "Next",
                    navigation: "Navigation",
                    scrollTop: "Scroll Top",
                    moveTop: "Move Top",
                    moveUp: "Move Up",
                    moveDown: "Move Down",
                    moveBottom: "Move Bottom",
                    moveToTarget: "Move to Target",
                    moveToSource: "Move to Source",
                    moveAllToTarget: "Move All to Target",
                    moveAllToSource: "Move All to Source",
                    pageLabel: "{page}",
                    firstPageLabel: "First Page",
                    lastPageLabel: "Last Page",
                    nextPageLabel: "Next Page",
                    prevPageLabel: "Previous Page",
                    rowsPerPageLabel: "Rows per page",
                    previousPageLabel: "Previous Page",
                    jumpToPageDropdownLabel: "Jump to Page Dropdown",
                    jumpToPageInputLabel: "Jump to Page Input",
                    selectRow: "Row Selected",
                    unselectRow: "Row Unselected",
                    expandRow: "Row Expanded",
                    collapseRow: "Row Collapsed",
                    showFilterMenu: "Show Filter Menu",
                    hideFilterMenu: "Hide Filter Menu",
                    filterOperator: "Filter Operator",
                    filterConstraint: "Filter Constraint",
                    editRow: "Row Edit",
                    saveEdit: "Save Edit",
                    cancelEdit: "Cancel Edit",
                    listView: "List View",
                    gridView: "Grid View",
                    slide: "Slide",
                    slideNumber: "{slideNumber}",
                    zoomImage: "Zoom Image",
                    zoomIn: "Zoom In",
                    zoomOut: "Zoom Out",
                    rotateRight: "Rotate Right",
                    rotateLeft: "Rotate Left",
                    listLabel: "Option List",
                    selectColor: "Select a color",
                    removeLabel: "Remove",
                    browseFiles: "Browse Files",
                    maximizeLabel: "Maximize",
                },
            };
            zIndex = { modal: 1100, overlay: 1e3, menu: 1e3, tooltip: 1100 };
            translationSource = new Te();
            translationObserver = this.translationSource.asObservable();
            getTranslation(t) {
                return this.translation[t];
            }
            setTranslation(t) {
                ((this.translation = E(E({}, this.translation), t)),
                    this.translationSource.next(this.translation));
            }
            setConfig(t) {
                let {
                    csp: r,
                    ripple: i,
                    inputStyle: o,
                    inputVariant: s,
                    theme: a,
                    overlayOptions: l,
                    translation: c,
                    filterMatchModeOptions: u,
                } = t || {};
                (r && this.csp.set(r),
                    i && this.ripple.set(i),
                    o && this.inputStyle.set(o),
                    s && this.inputVariant.set(s),
                    l && (this.overlayOptions = l),
                    c && this.setTranslation(c),
                    u && (this.filterMatchModeOptions = u),
                    a && this.setThemeConfig({ theme: a, csp: r }));
            }
            static ɵfac = (() => {
                let t;
                return function (i) {
                    return (t || (t = te(e)))(i || e);
                };
            })();
            static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" });
        }
        return e;
    })(),
    AT = new O("PRIME_NG_CONFIG");
function Yv(...e) {
    let n = e?.map((r) => ({ provide: AT, useValue: r, multi: !1 })),
        t = Go(() => {
            let r = y(Jf);
            e?.forEach((i) => r.setConfig(i));
        });
    return Ja([...n, t]);
}
var H = "primary",
    Ss = Symbol("RouteTitle"),
    ip = class {
        params;
        constructor(n) {
            this.params = n || {};
        }
        has(n) {
            return Object.prototype.hasOwnProperty.call(this.params, n);
        }
        get(n) {
            if (this.has(n)) {
                let t = this.params[n];
                return Array.isArray(t) ? t[0] : t;
            }
            return null;
        }
        getAll(n) {
            if (this.has(n)) {
                let t = this.params[n];
                return Array.isArray(t) ? t : [t];
            }
            return [];
        }
        get keys() {
            return Object.keys(this.params);
        }
    };
function Qi(e) {
    return new ip(e);
}
function RT(e, n, t) {
    let r = t.path.split("/");
    if (
        r.length > e.length ||
        (t.pathMatch === "full" && (n.hasChildren() || r.length < e.length))
    )
        return null;
    let i = {};
    for (let o = 0; o < r.length; o++) {
        let s = r[o],
            a = e[o];
        if (s[0] === ":") i[s.substring(1)] = a;
        else if (s !== a.path) return null;
    }
    return { consumed: e.slice(0, r.length), posParams: i };
}
function kT(e, n) {
    if (e.length !== n.length) return !1;
    for (let t = 0; t < e.length; ++t) if (!vn(e[t], n[t])) return !1;
    return !0;
}
function vn(e, n) {
    let t = e ? op(e) : void 0,
        r = n ? op(n) : void 0;
    if (!t || !r || t.length != r.length) return !1;
    let i;
    for (let o = 0; o < t.length; o++)
        if (((i = t[o]), !n0(e[i], n[i]))) return !1;
    return !0;
}
function op(e) {
    return [...Object.keys(e), ...Object.getOwnPropertySymbols(e)];
}
function n0(e, n) {
    if (Array.isArray(e) && Array.isArray(n)) {
        if (e.length !== n.length) return !1;
        let t = [...e].sort(),
            r = [...n].sort();
        return t.every((i, o) => r[o] === i);
    } else return e === n;
}
function r0(e) {
    return e.length > 0 ? e[e.length - 1] : null;
}
function lr(e) {
    return Qc(e) ? e : qo(e) ? Ee(Promise.resolve(e)) : k(e);
}
var LT = { exact: o0, subset: s0 },
    i0 = { exact: FT, subset: $T, ignored: () => !0 };
function Kv(e, n, t) {
    return (
        LT[t.paths](e.root, n.root, t.matrixParams) &&
        i0[t.queryParams](e.queryParams, n.queryParams) &&
        !(t.fragment === "exact" && e.fragment !== n.fragment)
    );
}
function FT(e, n) {
    return vn(e, n);
}
function o0(e, n, t) {
    if (
        !jr(e.segments, n.segments) ||
        !Ll(e.segments, n.segments, t) ||
        e.numberOfChildren !== n.numberOfChildren
    )
        return !1;
    for (let r in n.children)
        if (!e.children[r] || !o0(e.children[r], n.children[r], t)) return !1;
    return !0;
}
function $T(e, n) {
    return (
        Object.keys(n).length <= Object.keys(e).length &&
        Object.keys(n).every((t) => n0(e[t], n[t]))
    );
}
function s0(e, n, t) {
    return a0(e, n, n.segments, t);
}
function a0(e, n, t, r) {
    if (e.segments.length > t.length) {
        let i = e.segments.slice(0, t.length);
        return !(!jr(i, t) || n.hasChildren() || !Ll(i, t, r));
    } else if (e.segments.length === t.length) {
        if (!jr(e.segments, t) || !Ll(e.segments, t, r)) return !1;
        for (let i in n.children)
            if (!e.children[i] || !s0(e.children[i], n.children[i], r))
                return !1;
        return !0;
    } else {
        let i = t.slice(0, e.segments.length),
            o = t.slice(e.segments.length);
        return !jr(e.segments, i) || !Ll(e.segments, i, r) || !e.children[H]
            ? !1
            : a0(e.children[H], n, o, r);
    }
}
function Ll(e, n, t) {
    return n.every((r, i) => i0[t](e[i].parameters, r.parameters));
}
var qn = class {
        root;
        queryParams;
        fragment;
        _queryParamMap;
        constructor(n = new ie([], {}), t = {}, r = null) {
            ((this.root = n), (this.queryParams = t), (this.fragment = r));
        }
        get queryParamMap() {
            return (
                (this._queryParamMap ??= Qi(this.queryParams)),
                this._queryParamMap
            );
        }
        toString() {
            return BT.serialize(this);
        }
    },
    ie = class {
        segments;
        children;
        parent = null;
        constructor(n, t) {
            ((this.segments = n),
                (this.children = t),
                Object.values(t).forEach((r) => (r.parent = this)));
        }
        hasChildren() {
            return this.numberOfChildren > 0;
        }
        get numberOfChildren() {
            return Object.keys(this.children).length;
        }
        toString() {
            return Fl(this);
        }
    },
    Vr = class {
        path;
        parameters;
        _parameterMap;
        constructor(n, t) {
            ((this.path = n), (this.parameters = t));
        }
        get parameterMap() {
            return (
                (this._parameterMap ??= Qi(this.parameters)),
                this._parameterMap
            );
        }
        toString() {
            return c0(this);
        }
    };
function VT(e, n) {
    return jr(e, n) && e.every((t, r) => vn(t.parameters, n[r].parameters));
}
function jr(e, n) {
    return e.length !== n.length ? !1 : e.every((t, r) => t.path === n[r].path);
}
function jT(e, n) {
    let t = [];
    return (
        Object.entries(e.children).forEach(([r, i]) => {
            r === H && (t = t.concat(n(i, r)));
        }),
        Object.entries(e.children).forEach(([r, i]) => {
            r !== H && (t = t.concat(n(i, r)));
        }),
        t
    );
}
var eo = (() => {
        class e {
            static ɵfac = function (r) {
                return new (r || e)();
            };
            static ɵprov = w({
                token: e,
                factory: () => new Br(),
                providedIn: "root",
            });
        }
        return e;
    })(),
    Br = class {
        parse(n) {
            let t = new ap(n);
            return new qn(
                t.parseRootSegment(),
                t.parseQueryParams(),
                t.parseFragment()
            );
        }
        serialize(n) {
            let t = `/${us(n.root, !0)}`,
                r = zT(n.queryParams),
                i = typeof n.fragment == "string" ? `#${UT(n.fragment)}` : "";
            return `${t}${r}${i}`;
        }
    },
    BT = new Br();
function Fl(e) {
    return e.segments.map((n) => c0(n)).join("/");
}
function us(e, n) {
    if (!e.hasChildren()) return Fl(e);
    if (n) {
        let t = e.children[H] ? us(e.children[H], !1) : "",
            r = [];
        return (
            Object.entries(e.children).forEach(([i, o]) => {
                i !== H && r.push(`${i}:${us(o, !1)}`);
            }),
            r.length > 0 ? `${t}(${r.join("//")})` : t
        );
    } else {
        let t = jT(e, (r, i) =>
            i === H ? [us(e.children[H], !1)] : [`${i}:${us(r, !1)}`]
        );
        return Object.keys(e.children).length === 1 && e.children[H] != null
            ? `${Fl(e)}/${t[0]}`
            : `${Fl(e)}/(${t.join("//")})`;
    }
}
function l0(e) {
    return encodeURIComponent(e)
        .replace(/%40/g, "@")
        .replace(/%3A/gi, ":")
        .replace(/%24/g, "$")
        .replace(/%2C/gi, ",");
}
function Rl(e) {
    return l0(e).replace(/%3B/gi, ";");
}
function UT(e) {
    return encodeURI(e);
}
function sp(e) {
    return l0(e)
        .replace(/\(/g, "%28")
        .replace(/\)/g, "%29")
        .replace(/%26/gi, "&");
}
function $l(e) {
    return decodeURIComponent(e);
}
function Qv(e) {
    return $l(e.replace(/\+/g, "%20"));
}
function c0(e) {
    return `${sp(e.path)}${HT(e.parameters)}`;
}
function HT(e) {
    return Object.entries(e)
        .map(([n, t]) => `;${sp(n)}=${sp(t)}`)
        .join("");
}
function zT(e) {
    let n = Object.entries(e)
        .map(([t, r]) =>
            Array.isArray(r)
                ? r.map((i) => `${Rl(t)}=${Rl(i)}`).join("&")
                : `${Rl(t)}=${Rl(r)}`
        )
        .filter((t) => t);
    return n.length ? `?${n.join("&")}` : "";
}
var WT = /^[^\/()?;#]+/;
function ep(e) {
    let n = e.match(WT);
    return n ? n[0] : "";
}
var qT = /^[^\/()?;=#]+/;
function GT(e) {
    let n = e.match(qT);
    return n ? n[0] : "";
}
var YT = /^[^=?&#]+/;
function KT(e) {
    let n = e.match(YT);
    return n ? n[0] : "";
}
var QT = /^[^&#]+/;
function ZT(e) {
    let n = e.match(QT);
    return n ? n[0] : "";
}
var ap = class {
    url;
    remaining;
    constructor(n) {
        ((this.url = n), (this.remaining = n));
    }
    parseRootSegment() {
        return (
            this.consumeOptional("/"),
            this.remaining === "" ||
            this.peekStartsWith("?") ||
            this.peekStartsWith("#")
                ? new ie([], {})
                : new ie([], this.parseChildren())
        );
    }
    parseQueryParams() {
        let n = {};
        if (this.consumeOptional("?"))
            do this.parseQueryParam(n);
            while (this.consumeOptional("&"));
        return n;
    }
    parseFragment() {
        return this.consumeOptional("#")
            ? decodeURIComponent(this.remaining)
            : null;
    }
    parseChildren() {
        if (this.remaining === "") return {};
        this.consumeOptional("/");
        let n = [];
        for (
            this.peekStartsWith("(") || n.push(this.parseSegment());
            this.peekStartsWith("/") &&
            !this.peekStartsWith("//") &&
            !this.peekStartsWith("/(");
        )
            (this.capture("/"), n.push(this.parseSegment()));
        let t = {};
        this.peekStartsWith("/(") &&
            (this.capture("/"), (t = this.parseParens(!0)));
        let r = {};
        return (
            this.peekStartsWith("(") && (r = this.parseParens(!1)),
            (n.length > 0 || Object.keys(t).length > 0) &&
                (r[H] = new ie(n, t)),
            r
        );
    }
    parseSegment() {
        let n = ep(this.remaining);
        if (n === "" && this.peekStartsWith(";")) throw new S(4009, !1);
        return (this.capture(n), new Vr($l(n), this.parseMatrixParams()));
    }
    parseMatrixParams() {
        let n = {};
        for (; this.consumeOptional(";"); ) this.parseParam(n);
        return n;
    }
    parseParam(n) {
        let t = GT(this.remaining);
        if (!t) return;
        this.capture(t);
        let r = "";
        if (this.consumeOptional("=")) {
            let i = ep(this.remaining);
            i && ((r = i), this.capture(r));
        }
        n[$l(t)] = $l(r);
    }
    parseQueryParam(n) {
        let t = KT(this.remaining);
        if (!t) return;
        this.capture(t);
        let r = "";
        if (this.consumeOptional("=")) {
            let s = ZT(this.remaining);
            s && ((r = s), this.capture(r));
        }
        let i = Qv(t),
            o = Qv(r);
        if (n.hasOwnProperty(i)) {
            let s = n[i];
            (Array.isArray(s) || ((s = [s]), (n[i] = s)), s.push(o));
        } else n[i] = o;
    }
    parseParens(n) {
        let t = {};
        for (
            this.capture("(");
            !this.consumeOptional(")") && this.remaining.length > 0;
        ) {
            let r = ep(this.remaining),
                i = this.remaining[r.length];
            if (i !== "/" && i !== ")" && i !== ";") throw new S(4010, !1);
            let o;
            r.indexOf(":") > -1
                ? ((o = r.slice(0, r.indexOf(":"))),
                  this.capture(o),
                  this.capture(":"))
                : n && (o = H);
            let s = this.parseChildren();
            ((t[o] = Object.keys(s).length === 1 ? s[H] : new ie([], s)),
                this.consumeOptional("//"));
        }
        return t;
    }
    peekStartsWith(n) {
        return this.remaining.startsWith(n);
    }
    consumeOptional(n) {
        return this.peekStartsWith(n)
            ? ((this.remaining = this.remaining.substring(n.length)), !0)
            : !1;
    }
    capture(n) {
        if (!this.consumeOptional(n)) throw new S(4011, !1);
    }
};
function u0(e) {
    return e.segments.length > 0 ? new ie([], { [H]: e }) : e;
}
function d0(e) {
    let n = {};
    for (let [r, i] of Object.entries(e.children)) {
        let o = d0(i);
        if (r === H && o.segments.length === 0 && o.hasChildren())
            for (let [s, a] of Object.entries(o.children)) n[s] = a;
        else (o.segments.length > 0 || o.hasChildren()) && (n[r] = o);
    }
    let t = new ie(e.segments, n);
    return XT(t);
}
function XT(e) {
    if (e.numberOfChildren === 1 && e.children[H]) {
        let n = e.children[H];
        return new ie(e.segments.concat(n.segments), n.children);
    }
    return e;
}
function Zi(e) {
    return e instanceof qn;
}
function JT(e, n, t = null, r = null) {
    let i = f0(e);
    return p0(i, n, t, r);
}
function f0(e) {
    let n;
    function t(o) {
        let s = {};
        for (let l of o.children) {
            let c = t(l);
            s[l.outlet] = c;
        }
        let a = new ie(o.url, s);
        return (o === e && (n = a), a);
    }
    let r = t(e.root),
        i = u0(r);
    return n ?? i;
}
function p0(e, n, t, r) {
    let i = e;
    for (; i.parent; ) i = i.parent;
    if (n.length === 0) return tp(i, i, i, t, r);
    let o = ex(n);
    if (o.toRoot()) return tp(i, i, new ie([], {}), t, r);
    let s = tx(o, i, e),
        a = s.processChildren
            ? fs(s.segmentGroup, s.index, o.commands)
            : g0(s.segmentGroup, s.index, o.commands);
    return tp(i, s.segmentGroup, a, t, r);
}
function jl(e) {
    return typeof e == "object" && e != null && !e.outlets && !e.segmentPath;
}
function hs(e) {
    return typeof e == "object" && e != null && e.outlets;
}
function tp(e, n, t, r, i) {
    let o = {};
    r &&
        Object.entries(r).forEach(([l, c]) => {
            o[l] = Array.isArray(c) ? c.map((u) => `${u}`) : `${c}`;
        });
    let s;
    e === n ? (s = t) : (s = h0(e, n, t));
    let a = u0(d0(s));
    return new qn(a, o, i);
}
function h0(e, n, t) {
    let r = {};
    return (
        Object.entries(e.children).forEach(([i, o]) => {
            o === n ? (r[i] = t) : (r[i] = h0(o, n, t));
        }),
        new ie(e.segments, r)
    );
}
var Bl = class {
    isAbsolute;
    numberOfDoubleDots;
    commands;
    constructor(n, t, r) {
        if (
            ((this.isAbsolute = n),
            (this.numberOfDoubleDots = t),
            (this.commands = r),
            n && r.length > 0 && jl(r[0]))
        )
            throw new S(4003, !1);
        let i = r.find(hs);
        if (i && i !== r0(r)) throw new S(4004, !1);
    }
    toRoot() {
        return (
            this.isAbsolute &&
            this.commands.length === 1 &&
            this.commands[0] == "/"
        );
    }
};
function ex(e) {
    if (typeof e[0] == "string" && e.length === 1 && e[0] === "/")
        return new Bl(!0, 0, e);
    let n = 0,
        t = !1,
        r = e.reduce((i, o, s) => {
            if (typeof o == "object" && o != null) {
                if (o.outlets) {
                    let a = {};
                    return (
                        Object.entries(o.outlets).forEach(([l, c]) => {
                            a[l] = typeof c == "string" ? c.split("/") : c;
                        }),
                        [...i, { outlets: a }]
                    );
                }
                if (o.segmentPath) return [...i, o.segmentPath];
            }
            return typeof o != "string"
                ? [...i, o]
                : s === 0
                  ? (o.split("/").forEach((a, l) => {
                        (l == 0 && a === ".") ||
                            (l == 0 && a === ""
                                ? (t = !0)
                                : a === ".."
                                  ? n++
                                  : a != "" && i.push(a));
                    }),
                    i)
                  : [...i, o];
        }, []);
    return new Bl(t, n, r);
}
var Gi = class {
    segmentGroup;
    processChildren;
    index;
    constructor(n, t, r) {
        ((this.segmentGroup = n), (this.processChildren = t), (this.index = r));
    }
};
function tx(e, n, t) {
    if (e.isAbsolute) return new Gi(n, !0, 0);
    if (!t) return new Gi(n, !1, NaN);
    if (t.parent === null) return new Gi(t, !0, 0);
    let r = jl(e.commands[0]) ? 0 : 1,
        i = t.segments.length - 1 + r;
    return nx(t, i, e.numberOfDoubleDots);
}
function nx(e, n, t) {
    let r = e,
        i = n,
        o = t;
    for (; o > i; ) {
        if (((o -= i), (r = r.parent), !r)) throw new S(4005, !1);
        i = r.segments.length;
    }
    return new Gi(r, !1, i - o);
}
function rx(e) {
    return hs(e[0]) ? e[0].outlets : { [H]: e };
}
function g0(e, n, t) {
    if (((e ??= new ie([], {})), e.segments.length === 0 && e.hasChildren()))
        return fs(e, n, t);
    let r = ix(e, n, t),
        i = t.slice(r.commandIndex);
    if (r.match && r.pathIndex < e.segments.length) {
        let o = new ie(e.segments.slice(0, r.pathIndex), {});
        return (
            (o.children[H] = new ie(e.segments.slice(r.pathIndex), e.children)),
            fs(o, 0, i)
        );
    } else
        return r.match && i.length === 0
            ? new ie(e.segments, {})
            : r.match && !e.hasChildren()
              ? lp(e, n, t)
              : r.match
                ? fs(e, 0, i)
                : lp(e, n, t);
}
function fs(e, n, t) {
    if (t.length === 0) return new ie(e.segments, {});
    {
        let r = rx(t),
            i = {};
        if (
            Object.keys(r).some((o) => o !== H) &&
            e.children[H] &&
            e.numberOfChildren === 1 &&
            e.children[H].segments.length === 0
        ) {
            let o = fs(e.children[H], n, t);
            return new ie(e.segments, o.children);
        }
        return (
            Object.entries(r).forEach(([o, s]) => {
                (typeof s == "string" && (s = [s]),
                    s !== null && (i[o] = g0(e.children[o], n, s)));
            }),
            Object.entries(e.children).forEach(([o, s]) => {
                r[o] === void 0 && (i[o] = s);
            }),
            new ie(e.segments, i)
        );
    }
}
function ix(e, n, t) {
    let r = 0,
        i = n,
        o = { match: !1, pathIndex: 0, commandIndex: 0 };
    for (; i < e.segments.length; ) {
        if (r >= t.length) return o;
        let s = e.segments[i],
            a = t[r];
        if (hs(a)) break;
        let l = `${a}`,
            c = r < t.length - 1 ? t[r + 1] : null;
        if (i > 0 && l === void 0) break;
        if (l && c && typeof c == "object" && c.outlets === void 0) {
            if (!Xv(l, c, s)) return o;
            r += 2;
        } else {
            if (!Xv(l, {}, s)) return o;
            r++;
        }
        i++;
    }
    return { match: !0, pathIndex: i, commandIndex: r };
}
function lp(e, n, t) {
    let r = e.segments.slice(0, n),
        i = 0;
    for (; i < t.length; ) {
        let o = t[i];
        if (hs(o)) {
            let l = ox(o.outlets);
            return new ie(r, l);
        }
        if (i === 0 && jl(t[0])) {
            let l = e.segments[n];
            (r.push(new Vr(l.path, Zv(t[0]))), i++);
            continue;
        }
        let s = hs(o) ? o.outlets[H] : `${o}`,
            a = i < t.length - 1 ? t[i + 1] : null;
        s && a && jl(a)
            ? (r.push(new Vr(s, Zv(a))), (i += 2))
            : (r.push(new Vr(s, {})), i++);
    }
    return new ie(r, {});
}
function ox(e) {
    let n = {};
    return (
        Object.entries(e).forEach(([t, r]) => {
            (typeof r == "string" && (r = [r]),
                r !== null && (n[t] = lp(new ie([], {}), 0, r)));
        }),
        n
    );
}
function Zv(e) {
    let n = {};
    return (Object.entries(e).forEach(([t, r]) => (n[t] = `${r}`)), n);
}
function Xv(e, n, t) {
    return e == t.path && vn(n, t.parameters);
}
var Vl = "imperative",
    Ve = (function (e) {
        return (
            (e[(e.NavigationStart = 0)] = "NavigationStart"),
            (e[(e.NavigationEnd = 1)] = "NavigationEnd"),
            (e[(e.NavigationCancel = 2)] = "NavigationCancel"),
            (e[(e.NavigationError = 3)] = "NavigationError"),
            (e[(e.RoutesRecognized = 4)] = "RoutesRecognized"),
            (e[(e.ResolveStart = 5)] = "ResolveStart"),
            (e[(e.ResolveEnd = 6)] = "ResolveEnd"),
            (e[(e.GuardsCheckStart = 7)] = "GuardsCheckStart"),
            (e[(e.GuardsCheckEnd = 8)] = "GuardsCheckEnd"),
            (e[(e.RouteConfigLoadStart = 9)] = "RouteConfigLoadStart"),
            (e[(e.RouteConfigLoadEnd = 10)] = "RouteConfigLoadEnd"),
            (e[(e.ChildActivationStart = 11)] = "ChildActivationStart"),
            (e[(e.ChildActivationEnd = 12)] = "ChildActivationEnd"),
            (e[(e.ActivationStart = 13)] = "ActivationStart"),
            (e[(e.ActivationEnd = 14)] = "ActivationEnd"),
            (e[(e.Scroll = 15)] = "Scroll"),
            (e[(e.NavigationSkipped = 16)] = "NavigationSkipped"),
            e
        );
    })(Ve || {}),
    Vt = class {
        id;
        url;
        constructor(n, t) {
            ((this.id = n), (this.url = t));
        }
    },
    Ur = class extends Vt {
        type = Ve.NavigationStart;
        navigationTrigger;
        restoredState;
        constructor(n, t, r = "imperative", i = null) {
            (super(n, t),
                (this.navigationTrigger = r),
                (this.restoredState = i));
        }
        toString() {
            return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
        }
    },
    bn = class extends Vt {
        urlAfterRedirects;
        type = Ve.NavigationEnd;
        constructor(n, t, r) {
            (super(n, t), (this.urlAfterRedirects = r));
        }
        toString() {
            return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
        }
    },
    Mt = (function (e) {
        return (
            (e[(e.Redirect = 0)] = "Redirect"),
            (e[(e.SupersededByNewNavigation = 1)] =
                "SupersededByNewNavigation"),
            (e[(e.NoDataFromResolver = 2)] = "NoDataFromResolver"),
            (e[(e.GuardRejected = 3)] = "GuardRejected"),
            e
        );
    })(Mt || {}),
    gs = (function (e) {
        return (
            (e[(e.IgnoredSameUrlNavigation = 0)] = "IgnoredSameUrlNavigation"),
            (e[(e.IgnoredByUrlHandlingStrategy = 1)] =
                "IgnoredByUrlHandlingStrategy"),
            e
        );
    })(gs || {}),
    Wn = class extends Vt {
        reason;
        code;
        type = Ve.NavigationCancel;
        constructor(n, t, r, i) {
            (super(n, t), (this.reason = r), (this.code = i));
        }
        toString() {
            return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
        }
    },
    Gn = class extends Vt {
        reason;
        code;
        type = Ve.NavigationSkipped;
        constructor(n, t, r, i) {
            (super(n, t), (this.reason = r), (this.code = i));
        }
    },
    ms = class extends Vt {
        error;
        target;
        type = Ve.NavigationError;
        constructor(n, t, r, i) {
            (super(n, t), (this.error = r), (this.target = i));
        }
        toString() {
            return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
        }
    },
    Ul = class extends Vt {
        urlAfterRedirects;
        state;
        type = Ve.RoutesRecognized;
        constructor(n, t, r, i) {
            (super(n, t), (this.urlAfterRedirects = r), (this.state = i));
        }
        toString() {
            return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
    },
    cp = class extends Vt {
        urlAfterRedirects;
        state;
        type = Ve.GuardsCheckStart;
        constructor(n, t, r, i) {
            (super(n, t), (this.urlAfterRedirects = r), (this.state = i));
        }
        toString() {
            return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
    },
    up = class extends Vt {
        urlAfterRedirects;
        state;
        shouldActivate;
        type = Ve.GuardsCheckEnd;
        constructor(n, t, r, i, o) {
            (super(n, t),
                (this.urlAfterRedirects = r),
                (this.state = i),
                (this.shouldActivate = o));
        }
        toString() {
            return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
        }
    },
    dp = class extends Vt {
        urlAfterRedirects;
        state;
        type = Ve.ResolveStart;
        constructor(n, t, r, i) {
            (super(n, t), (this.urlAfterRedirects = r), (this.state = i));
        }
        toString() {
            return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
    },
    fp = class extends Vt {
        urlAfterRedirects;
        state;
        type = Ve.ResolveEnd;
        constructor(n, t, r, i) {
            (super(n, t), (this.urlAfterRedirects = r), (this.state = i));
        }
        toString() {
            return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
    },
    pp = class {
        route;
        type = Ve.RouteConfigLoadStart;
        constructor(n) {
            this.route = n;
        }
        toString() {
            return `RouteConfigLoadStart(path: ${this.route.path})`;
        }
    },
    hp = class {
        route;
        type = Ve.RouteConfigLoadEnd;
        constructor(n) {
            this.route = n;
        }
        toString() {
            return `RouteConfigLoadEnd(path: ${this.route.path})`;
        }
    },
    gp = class {
        snapshot;
        type = Ve.ChildActivationStart;
        constructor(n) {
            this.snapshot = n;
        }
        toString() {
            return `ChildActivationStart(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""}')`;
        }
    },
    mp = class {
        snapshot;
        type = Ve.ChildActivationEnd;
        constructor(n) {
            this.snapshot = n;
        }
        toString() {
            return `ChildActivationEnd(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""}')`;
        }
    },
    _p = class {
        snapshot;
        type = Ve.ActivationStart;
        constructor(n) {
            this.snapshot = n;
        }
        toString() {
            return `ActivationStart(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""}')`;
        }
    },
    yp = class {
        snapshot;
        type = Ve.ActivationEnd;
        constructor(n) {
            this.snapshot = n;
        }
        toString() {
            return `ActivationEnd(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""}')`;
        }
    },
    _s = class {
        routerEvent;
        position;
        anchor;
        type = Ve.Scroll;
        constructor(n, t, r) {
            ((this.routerEvent = n), (this.position = t), (this.anchor = r));
        }
        toString() {
            let n = this.position
                ? `${this.position[0]}, ${this.position[1]}`
                : null;
            return `Scroll(anchor: '${this.anchor}', position: '${n}')`;
        }
    },
    ys = class {},
    Xi = class {
        url;
        navigationBehaviorOptions;
        constructor(n, t) {
            ((this.url = n), (this.navigationBehaviorOptions = t));
        }
    };
function sx(e, n) {
    return (
        e.providers &&
            !e._injector &&
            (e._injector = zo(e.providers, n, `Route: ${e.path}`)),
        e._injector ?? n
    );
}
function en(e) {
    return e.outlet || H;
}
function ax(e, n) {
    let t = e.filter((r) => en(r) === n);
    return (t.push(...e.filter((r) => en(r) !== n)), t);
}
function ws(e) {
    if (!e) return null;
    if (e.routeConfig?._injector) return e.routeConfig._injector;
    for (let n = e.parent; n; n = n.parent) {
        let t = n.routeConfig;
        if (t?._loadedInjector) return t._loadedInjector;
        if (t?._injector) return t._injector;
    }
    return null;
}
var vp = class {
        rootInjector;
        outlet = null;
        route = null;
        children;
        attachRef = null;
        get injector() {
            return ws(this.route?.snapshot) ?? this.rootInjector;
        }
        constructor(n) {
            ((this.rootInjector = n),
                (this.children = new to(this.rootInjector)));
        }
    },
    to = (() => {
        class e {
            rootInjector;
            contexts = new Map();
            constructor(t) {
                this.rootInjector = t;
            }
            onChildOutletCreated(t, r) {
                let i = this.getOrCreateContext(t);
                ((i.outlet = r), this.contexts.set(t, i));
            }
            onChildOutletDestroyed(t) {
                let r = this.getContext(t);
                r && ((r.outlet = null), (r.attachRef = null));
            }
            onOutletDeactivated() {
                let t = this.contexts;
                return ((this.contexts = new Map()), t);
            }
            onOutletReAttached(t) {
                this.contexts = t;
            }
            getOrCreateContext(t) {
                let r = this.getContext(t);
                return (
                    r ||
                        ((r = new vp(this.rootInjector)),
                        this.contexts.set(t, r)),
                    r
                );
            }
            getContext(t) {
                return this.contexts.get(t) || null;
            }
            static ɵfac = function (r) {
                return new (r || e)(N(at));
            };
            static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" });
        }
        return e;
    })(),
    Hl = class {
        _root;
        constructor(n) {
            this._root = n;
        }
        get root() {
            return this._root.value;
        }
        parent(n) {
            let t = this.pathFromRoot(n);
            return t.length > 1 ? t[t.length - 2] : null;
        }
        children(n) {
            let t = bp(n, this._root);
            return t ? t.children.map((r) => r.value) : [];
        }
        firstChild(n) {
            let t = bp(n, this._root);
            return t && t.children.length > 0 ? t.children[0].value : null;
        }
        siblings(n) {
            let t = Cp(n, this._root);
            return t.length < 2
                ? []
                : t[t.length - 2].children
                      .map((i) => i.value)
                      .filter((i) => i !== n);
        }
        pathFromRoot(n) {
            return Cp(n, this._root).map((t) => t.value);
        }
    };
function bp(e, n) {
    if (e === n.value) return n;
    for (let t of n.children) {
        let r = bp(e, t);
        if (r) return r;
    }
    return null;
}
function Cp(e, n) {
    if (e === n.value) return [n];
    for (let t of n.children) {
        let r = Cp(e, t);
        if (r.length) return (r.unshift(n), r);
    }
    return [];
}
var Dt = class {
    value;
    children;
    constructor(n, t) {
        ((this.value = n), (this.children = t));
    }
    toString() {
        return `TreeNode(${this.value})`;
    }
};
function qi(e) {
    let n = {};
    return (e && e.children.forEach((t) => (n[t.value.outlet] = t)), n);
}
var zl = class extends Hl {
    snapshot;
    constructor(n, t) {
        (super(n), (this.snapshot = t), Op(this, n));
    }
    toString() {
        return this.snapshot.toString();
    }
};
function m0(e) {
    let n = lx(e),
        t = new je([new Vr("", {})]),
        r = new je({}),
        i = new je({}),
        o = new je({}),
        s = new je(""),
        a = new Hr(t, r, o, s, i, H, e, n.root);
    return ((a.snapshot = n.root), new zl(new Dt(a, []), n));
}
function lx(e) {
    let n = {},
        t = {},
        r = {},
        i = "",
        o = new Yi([], n, r, i, t, H, e, null, {});
    return new ql("", new Dt(o, []));
}
var Hr = class {
    urlSubject;
    paramsSubject;
    queryParamsSubject;
    fragmentSubject;
    dataSubject;
    outlet;
    component;
    snapshot;
    _futureSnapshot;
    _routerState;
    _paramMap;
    _queryParamMap;
    title;
    url;
    params;
    queryParams;
    fragment;
    data;
    constructor(n, t, r, i, o, s, a, l) {
        ((this.urlSubject = n),
            (this.paramsSubject = t),
            (this.queryParamsSubject = r),
            (this.fragmentSubject = i),
            (this.dataSubject = o),
            (this.outlet = s),
            (this.component = a),
            (this._futureSnapshot = l),
            (this.title =
                this.dataSubject?.pipe(ee((c) => c[Ss])) ?? k(void 0)),
            (this.url = n),
            (this.params = t),
            (this.queryParams = r),
            (this.fragment = i),
            (this.data = o));
    }
    get routeConfig() {
        return this._futureSnapshot.routeConfig;
    }
    get root() {
        return this._routerState.root;
    }
    get parent() {
        return this._routerState.parent(this);
    }
    get firstChild() {
        return this._routerState.firstChild(this);
    }
    get children() {
        return this._routerState.children(this);
    }
    get pathFromRoot() {
        return this._routerState.pathFromRoot(this);
    }
    get paramMap() {
        return (
            (this._paramMap ??= this.params.pipe(ee((n) => Qi(n)))),
            this._paramMap
        );
    }
    get queryParamMap() {
        return (
            (this._queryParamMap ??= this.queryParams.pipe(ee((n) => Qi(n)))),
            this._queryParamMap
        );
    }
    toString() {
        return this.snapshot
            ? this.snapshot.toString()
            : `Future(${this._futureSnapshot})`;
    }
};
function Wl(e, n, t = "emptyOnly") {
    let r,
        { routeConfig: i } = e;
    return (
        n !== null &&
        (t === "always" ||
            i?.path === "" ||
            (!n.component && !n.routeConfig?.loadComponent))
            ? (r = {
                  params: E(E({}, n.params), e.params),
                  data: E(E({}, n.data), e.data),
                  resolve: E(
                      E(E(E({}, e.data), n.data), i?.data),
                      e._resolvedData
                  ),
              })
            : (r = {
                  params: E({}, e.params),
                  data: E({}, e.data),
                  resolve: E(E({}, e.data), e._resolvedData ?? {}),
              }),
        i && y0(i) && (r.resolve[Ss] = i.title),
        r
    );
}
var Yi = class {
        url;
        params;
        queryParams;
        fragment;
        data;
        outlet;
        component;
        routeConfig;
        _resolve;
        _resolvedData;
        _routerState;
        _paramMap;
        _queryParamMap;
        get title() {
            return this.data?.[Ss];
        }
        constructor(n, t, r, i, o, s, a, l, c) {
            ((this.url = n),
                (this.params = t),
                (this.queryParams = r),
                (this.fragment = i),
                (this.data = o),
                (this.outlet = s),
                (this.component = a),
                (this.routeConfig = l),
                (this._resolve = c));
        }
        get root() {
            return this._routerState.root;
        }
        get parent() {
            return this._routerState.parent(this);
        }
        get firstChild() {
            return this._routerState.firstChild(this);
        }
        get children() {
            return this._routerState.children(this);
        }
        get pathFromRoot() {
            return this._routerState.pathFromRoot(this);
        }
        get paramMap() {
            return ((this._paramMap ??= Qi(this.params)), this._paramMap);
        }
        get queryParamMap() {
            return (
                (this._queryParamMap ??= Qi(this.queryParams)),
                this._queryParamMap
            );
        }
        toString() {
            let n = this.url.map((r) => r.toString()).join("/"),
                t = this.routeConfig ? this.routeConfig.path : "";
            return `Route(url:'${n}', path:'${t}')`;
        }
    },
    ql = class extends Hl {
        url;
        constructor(n, t) {
            (super(t), (this.url = n), Op(this, t));
        }
        toString() {
            return _0(this._root);
        }
    };
function Op(e, n) {
    ((n.value._routerState = e), n.children.forEach((t) => Op(e, t)));
}
function _0(e) {
    let n =
        e.children.length > 0 ? ` { ${e.children.map(_0).join(", ")} } ` : "";
    return `${e.value}${n}`;
}
function np(e) {
    if (e.snapshot) {
        let n = e.snapshot,
            t = e._futureSnapshot;
        ((e.snapshot = t),
            vn(n.queryParams, t.queryParams) ||
                e.queryParamsSubject.next(t.queryParams),
            n.fragment !== t.fragment && e.fragmentSubject.next(t.fragment),
            vn(n.params, t.params) || e.paramsSubject.next(t.params),
            kT(n.url, t.url) || e.urlSubject.next(t.url),
            vn(n.data, t.data) || e.dataSubject.next(t.data));
    } else
        ((e.snapshot = e._futureSnapshot),
            e.dataSubject.next(e._futureSnapshot.data));
}
function Ep(e, n) {
    let t = vn(e.params, n.params) && VT(e.url, n.url),
        r = !e.parent != !n.parent;
    return t && !r && (!e.parent || Ep(e.parent, n.parent));
}
function y0(e) {
    return typeof e.title == "string" || e.title === null;
}
var cx = new O(""),
    v0 = (() => {
        class e {
            activated = null;
            get activatedComponentRef() {
                return this.activated;
            }
            _activatedRoute = null;
            name = H;
            activateEvents = new pe();
            deactivateEvents = new pe();
            attachEvents = new pe();
            detachEvents = new pe();
            routerOutletData = hn(void 0);
            parentContexts = y(to);
            location = y(jn);
            changeDetector = y(Rr);
            inputBinder = y(Ds, { optional: !0 });
            supportsBindingToComponentInputs = !0;
            ngOnChanges(t) {
                if (t.name) {
                    let { firstChange: r, previousValue: i } = t.name;
                    if (r) return;
                    (this.isTrackedInParentContexts(i) &&
                        (this.deactivate(),
                        this.parentContexts.onChildOutletDestroyed(i)),
                        this.initializeOutletWithName());
                }
            }
            ngOnDestroy() {
                (this.isTrackedInParentContexts(this.name) &&
                    this.parentContexts.onChildOutletDestroyed(this.name),
                    this.inputBinder?.unsubscribeFromRouteData(this));
            }
            isTrackedInParentContexts(t) {
                return this.parentContexts.getContext(t)?.outlet === this;
            }
            ngOnInit() {
                this.initializeOutletWithName();
            }
            initializeOutletWithName() {
                if (
                    (this.parentContexts.onChildOutletCreated(this.name, this),
                    this.activated)
                )
                    return;
                let t = this.parentContexts.getContext(this.name);
                t?.route &&
                    (t.attachRef
                        ? this.attach(t.attachRef, t.route)
                        : this.activateWith(t.route, t.injector));
            }
            get isActivated() {
                return !!this.activated;
            }
            get component() {
                if (!this.activated) throw new S(4012, !1);
                return this.activated.instance;
            }
            get activatedRoute() {
                if (!this.activated) throw new S(4012, !1);
                return this._activatedRoute;
            }
            get activatedRouteData() {
                return this._activatedRoute
                    ? this._activatedRoute.snapshot.data
                    : {};
            }
            detach() {
                if (!this.activated) throw new S(4012, !1);
                this.location.detach();
                let t = this.activated;
                return (
                    (this.activated = null),
                    (this._activatedRoute = null),
                    this.detachEvents.emit(t.instance),
                    t
                );
            }
            attach(t, r) {
                ((this.activated = t),
                    (this._activatedRoute = r),
                    this.location.insert(t.hostView),
                    this.inputBinder?.bindActivatedRouteToOutletComponent(this),
                    this.attachEvents.emit(t.instance));
            }
            deactivate() {
                if (this.activated) {
                    let t = this.component;
                    (this.activated.destroy(),
                        (this.activated = null),
                        (this._activatedRoute = null),
                        this.deactivateEvents.emit(t));
                }
            }
            activateWith(t, r) {
                if (this.isActivated) throw new S(4013, !1);
                this._activatedRoute = t;
                let i = this.location,
                    s = t.snapshot.component,
                    a = this.parentContexts.getOrCreateContext(
                        this.name
                    ).children,
                    l = new Sp(t, a, i.injector, this.routerOutletData);
                ((this.activated = i.createComponent(s, {
                    index: i.length,
                    injector: l,
                    environmentInjector: r,
                })),
                    this.changeDetector.markForCheck(),
                    this.inputBinder?.bindActivatedRouteToOutletComponent(this),
                    this.activateEvents.emit(this.activated.instance));
            }
            static ɵfac = function (r) {
                return new (r || e)();
            };
            static ɵdir = Me({
                type: e,
                selectors: [["router-outlet"]],
                inputs: {
                    name: "name",
                    routerOutletData: [1, "routerOutletData"],
                },
                outputs: {
                    activateEvents: "activate",
                    deactivateEvents: "deactivate",
                    attachEvents: "attach",
                    detachEvents: "detach",
                },
                exportAs: ["outlet"],
                features: [At],
            });
        }
        return e;
    })(),
    Sp = class {
        route;
        childContexts;
        parent;
        outletData;
        constructor(n, t, r, i) {
            ((this.route = n),
                (this.childContexts = t),
                (this.parent = r),
                (this.outletData = i));
        }
        get(n, t) {
            return n === Hr
                ? this.route
                : n === to
                  ? this.childContexts
                  : n === cx
                    ? this.outletData
                    : this.parent.get(n, t);
        }
    },
    Ds = new O(""),
    Pp = (() => {
        class e {
            outletDataSubscriptions = new Map();
            bindActivatedRouteToOutletComponent(t) {
                (this.unsubscribeFromRouteData(t),
                    this.subscribeToRouteData(t));
            }
            unsubscribeFromRouteData(t) {
                (this.outletDataSubscriptions.get(t)?.unsubscribe(),
                    this.outletDataSubscriptions.delete(t));
            }
            subscribeToRouteData(t) {
                let { activatedRoute: r } = t,
                    i = Co([r.queryParams, r.params, r.data])
                        .pipe(
                            xt(
                                ([o, s, a], l) => (
                                    (a = E(E(E({}, o), s), a)),
                                    l === 0 ? k(a) : Promise.resolve(a)
                                )
                            )
                        )
                        .subscribe((o) => {
                            if (
                                !t.isActivated ||
                                !t.activatedComponentRef ||
                                t.activatedRoute !== r ||
                                r.component === null
                            ) {
                                this.unsubscribeFromRouteData(t);
                                return;
                            }
                            let s = lv(r.component);
                            if (!s) {
                                this.unsubscribeFromRouteData(t);
                                return;
                            }
                            for (let { templateName: a } of s.inputs)
                                t.activatedComponentRef.setInput(a, o[a]);
                        });
                this.outletDataSubscriptions.set(t, i);
            }
            static ɵfac = function (r) {
                return new (r || e)();
            };
            static ɵprov = w({ token: e, factory: e.ɵfac });
        }
        return e;
    })(),
    b0 = (() => {
        class e {
            static ɵfac = function (r) {
                return new (r || e)();
            };
            static ɵcmp = R({
                type: e,
                selectors: [["ng-component"]],
                exportAs: ["emptyRouterOutlet"],
                decls: 1,
                vars: 0,
                template: function (r, i) {
                    r & 1 && D(0, "router-outlet");
                },
                dependencies: [v0],
                encapsulation: 2,
            });
        }
        return e;
    })();
function Np(e) {
    let n = e.children && e.children.map(Np),
        t = n ? oe(E({}, e), { children: n }) : E({}, e);
    return (
        !t.component &&
            !t.loadComponent &&
            (n || t.loadChildren) &&
            t.outlet &&
            t.outlet !== H &&
            (t.component = b0),
        t
    );
}
function ux(e, n, t) {
    let r = vs(e, n._root, t ? t._root : void 0);
    return new zl(r, n);
}
function vs(e, n, t) {
    if (t && e.shouldReuseRoute(n.value, t.value.snapshot)) {
        let r = t.value;
        r._futureSnapshot = n.value;
        let i = dx(e, n, t);
        return new Dt(r, i);
    } else {
        if (e.shouldAttach(n.value)) {
            let o = e.retrieve(n.value);
            if (o !== null) {
                let s = o.route;
                return (
                    (s.value._futureSnapshot = n.value),
                    (s.children = n.children.map((a) => vs(e, a))),
                    s
                );
            }
        }
        let r = fx(n.value),
            i = n.children.map((o) => vs(e, o));
        return new Dt(r, i);
    }
}
function dx(e, n, t) {
    return n.children.map((r) => {
        for (let i of t.children)
            if (e.shouldReuseRoute(r.value, i.value.snapshot))
                return vs(e, r, i);
        return vs(e, r);
    });
}
function fx(e) {
    return new Hr(
        new je(e.url),
        new je(e.params),
        new je(e.queryParams),
        new je(e.fragment),
        new je(e.data),
        e.outlet,
        e.component,
        e
    );
}
var bs = class {
        redirectTo;
        navigationBehaviorOptions;
        constructor(n, t) {
            ((this.redirectTo = n), (this.navigationBehaviorOptions = t));
        }
    },
    C0 = "ngNavigationCancelingError";
function Gl(e, n) {
    let { redirectTo: t, navigationBehaviorOptions: r } = Zi(n)
            ? { redirectTo: n, navigationBehaviorOptions: void 0 }
            : n,
        i = E0(!1, Mt.Redirect);
    return ((i.url = t), (i.navigationBehaviorOptions = r), i);
}
function E0(e, n) {
    let t = new Error(`NavigationCancelingError: ${e || ""}`);
    return ((t[C0] = !0), (t.cancellationCode = n), t);
}
function px(e) {
    return S0(e) && Zi(e.url);
}
function S0(e) {
    return !!e && e[C0];
}
var hx = (e, n, t, r) =>
        ee(
            (i) => (
                new wp(
                    n,
                    i.targetRouterState,
                    i.currentRouterState,
                    t,
                    r
                ).activate(e),
                i
            )
        ),
    wp = class {
        routeReuseStrategy;
        futureState;
        currState;
        forwardEvent;
        inputBindingEnabled;
        constructor(n, t, r, i, o) {
            ((this.routeReuseStrategy = n),
                (this.futureState = t),
                (this.currState = r),
                (this.forwardEvent = i),
                (this.inputBindingEnabled = o));
        }
        activate(n) {
            let t = this.futureState._root,
                r = this.currState ? this.currState._root : null;
            (this.deactivateChildRoutes(t, r, n),
                np(this.futureState.root),
                this.activateChildRoutes(t, r, n));
        }
        deactivateChildRoutes(n, t, r) {
            let i = qi(t);
            (n.children.forEach((o) => {
                let s = o.value.outlet;
                (this.deactivateRoutes(o, i[s], r), delete i[s]);
            }),
                Object.values(i).forEach((o) => {
                    this.deactivateRouteAndItsChildren(o, r);
                }));
        }
        deactivateRoutes(n, t, r) {
            let i = n.value,
                o = t ? t.value : null;
            if (i === o)
                if (i.component) {
                    let s = r.getContext(i.outlet);
                    s && this.deactivateChildRoutes(n, t, s.children);
                } else this.deactivateChildRoutes(n, t, r);
            else o && this.deactivateRouteAndItsChildren(t, r);
        }
        deactivateRouteAndItsChildren(n, t) {
            n.value.component &&
            this.routeReuseStrategy.shouldDetach(n.value.snapshot)
                ? this.detachAndStoreRouteSubtree(n, t)
                : this.deactivateRouteAndOutlet(n, t);
        }
        detachAndStoreRouteSubtree(n, t) {
            let r = t.getContext(n.value.outlet),
                i = r && n.value.component ? r.children : t,
                o = qi(n);
            for (let s of Object.values(o))
                this.deactivateRouteAndItsChildren(s, i);
            if (r && r.outlet) {
                let s = r.outlet.detach(),
                    a = r.children.onOutletDeactivated();
                this.routeReuseStrategy.store(n.value.snapshot, {
                    componentRef: s,
                    route: n,
                    contexts: a,
                });
            }
        }
        deactivateRouteAndOutlet(n, t) {
            let r = t.getContext(n.value.outlet),
                i = r && n.value.component ? r.children : t,
                o = qi(n);
            for (let s of Object.values(o))
                this.deactivateRouteAndItsChildren(s, i);
            r &&
                (r.outlet &&
                    (r.outlet.deactivate(), r.children.onOutletDeactivated()),
                (r.attachRef = null),
                (r.route = null));
        }
        activateChildRoutes(n, t, r) {
            let i = qi(t);
            (n.children.forEach((o) => {
                (this.activateRoutes(o, i[o.value.outlet], r),
                    this.forwardEvent(new yp(o.value.snapshot)));
            }),
                n.children.length &&
                    this.forwardEvent(new mp(n.value.snapshot)));
        }
        activateRoutes(n, t, r) {
            let i = n.value,
                o = t ? t.value : null;
            if ((np(i), i === o))
                if (i.component) {
                    let s = r.getOrCreateContext(i.outlet);
                    this.activateChildRoutes(n, t, s.children);
                } else this.activateChildRoutes(n, t, r);
            else if (i.component) {
                let s = r.getOrCreateContext(i.outlet);
                if (this.routeReuseStrategy.shouldAttach(i.snapshot)) {
                    let a = this.routeReuseStrategy.retrieve(i.snapshot);
                    (this.routeReuseStrategy.store(i.snapshot, null),
                        s.children.onOutletReAttached(a.contexts),
                        (s.attachRef = a.componentRef),
                        (s.route = a.route.value),
                        s.outlet &&
                            s.outlet.attach(a.componentRef, a.route.value),
                        np(a.route.value),
                        this.activateChildRoutes(n, null, s.children));
                } else
                    ((s.attachRef = null),
                        (s.route = i),
                        s.outlet && s.outlet.activateWith(i, s.injector),
                        this.activateChildRoutes(n, null, s.children));
            } else this.activateChildRoutes(n, null, r);
        }
    },
    Yl = class {
        path;
        route;
        constructor(n) {
            ((this.path = n), (this.route = this.path[this.path.length - 1]));
        }
    },
    Ki = class {
        component;
        route;
        constructor(n, t) {
            ((this.component = n), (this.route = t));
        }
    };
function gx(e, n, t) {
    let r = e._root,
        i = n ? n._root : null;
    return ds(r, i, t, [r.value]);
}
function mx(e) {
    let n = e.routeConfig ? e.routeConfig.canActivateChild : null;
    return !n || n.length === 0 ? null : { node: e, guards: n };
}
function no(e, n) {
    let t = Symbol(),
        r = n.get(e, t);
    return r === t ? (typeof e == "function" && !nm(e) ? e : n.get(e)) : r;
}
function ds(
    e,
    n,
    t,
    r,
    i = { canDeactivateChecks: [], canActivateChecks: [] }
) {
    let o = qi(n);
    return (
        e.children.forEach((s) => {
            (_x(s, o[s.value.outlet], t, r.concat([s.value]), i),
                delete o[s.value.outlet]);
        }),
        Object.entries(o).forEach(([s, a]) => ps(a, t.getContext(s), i)),
        i
    );
}
function _x(
    e,
    n,
    t,
    r,
    i = { canDeactivateChecks: [], canActivateChecks: [] }
) {
    let o = e.value,
        s = n ? n.value : null,
        a = t ? t.getContext(e.value.outlet) : null;
    if (s && o.routeConfig === s.routeConfig) {
        let l = yx(s, o, o.routeConfig.runGuardsAndResolvers);
        (l
            ? i.canActivateChecks.push(new Yl(r))
            : ((o.data = s.data), (o._resolvedData = s._resolvedData)),
            o.component
                ? ds(e, n, a ? a.children : null, r, i)
                : ds(e, n, t, r, i),
            l &&
                a &&
                a.outlet &&
                a.outlet.isActivated &&
                i.canDeactivateChecks.push(new Ki(a.outlet.component, s)));
    } else
        (s && ps(n, a, i),
            i.canActivateChecks.push(new Yl(r)),
            o.component
                ? ds(e, null, a ? a.children : null, r, i)
                : ds(e, null, t, r, i));
    return i;
}
function yx(e, n, t) {
    if (typeof t == "function") return t(e, n);
    switch (t) {
        case "pathParamsChange":
            return !jr(e.url, n.url);
        case "pathParamsOrQueryParamsChange":
            return !jr(e.url, n.url) || !vn(e.queryParams, n.queryParams);
        case "always":
            return !0;
        case "paramsOrQueryParamsChange":
            return !Ep(e, n) || !vn(e.queryParams, n.queryParams);
        case "paramsChange":
        default:
            return !Ep(e, n);
    }
}
function ps(e, n, t) {
    let r = qi(e),
        i = e.value;
    (Object.entries(r).forEach(([o, s]) => {
        i.component
            ? n
                ? ps(s, n.children.getContext(o), t)
                : ps(s, null, t)
            : ps(s, n, t);
    }),
        i.component
            ? n && n.outlet && n.outlet.isActivated
                ? t.canDeactivateChecks.push(new Ki(n.outlet.component, i))
                : t.canDeactivateChecks.push(new Ki(null, i))
            : t.canDeactivateChecks.push(new Ki(null, i)));
}
function Ms(e) {
    return typeof e == "function";
}
function vx(e) {
    return typeof e == "boolean";
}
function bx(e) {
    return e && Ms(e.canLoad);
}
function Cx(e) {
    return e && Ms(e.canActivate);
}
function Ex(e) {
    return e && Ms(e.canActivateChild);
}
function Sx(e) {
    return e && Ms(e.canDeactivate);
}
function wx(e) {
    return e && Ms(e.canMatch);
}
function w0(e) {
    return e instanceof In || e?.name === "EmptyError";
}
var kl = Symbol("INITIAL_VALUE");
function Ji() {
    return xt((e) =>
        Co(e.map((n) => n.pipe(xn(1), Jc(kl)))).pipe(
            ee((n) => {
                for (let t of n)
                    if (t !== !0) {
                        if (t === kl) return kl;
                        if (t === !1 || Dx(t)) return t;
                    }
                return !0;
            }),
            yt((n) => n !== kl),
            xn(1)
        )
    );
}
function Dx(e) {
    return Zi(e) || e instanceof bs;
}
function Mx(e, n) {
    return we((t) => {
        let {
            targetSnapshot: r,
            currentSnapshot: i,
            guards: { canActivateChecks: o, canDeactivateChecks: s },
        } = t;
        return s.length === 0 && o.length === 0
            ? k(oe(E({}, t), { guardsResult: !0 }))
            : Ix(s, r, i, e).pipe(
                  we((a) => (a && vx(a) ? Tx(r, o, e, n) : k(a))),
                  ee((a) => oe(E({}, t), { guardsResult: a }))
              );
    });
}
function Ix(e, n, t, r) {
    return Ee(e).pipe(
        we((i) => Ax(i.component, i.route, t, n, r)),
        On((i) => i !== !0, !0)
    );
}
function Tx(e, n, t, r) {
    return Ee(n).pipe(
        Zn((i) =>
            li(
                Ox(i.route.parent, r),
                xx(i.route, r),
                Nx(e, i.path, t),
                Px(e, i.route, t)
            )
        ),
        On((i) => i !== !0, !0)
    );
}
function xx(e, n) {
    return (e !== null && n && n(new _p(e)), k(!0));
}
function Ox(e, n) {
    return (e !== null && n && n(new gp(e)), k(!0));
}
function Px(e, n, t) {
    let r = n.routeConfig ? n.routeConfig.canActivate : null;
    if (!r || r.length === 0) return k(!0);
    let i = r.map((o) =>
        da(() => {
            let s = ws(n) ?? t,
                a = no(o, s),
                l = Cx(a) ? a.canActivate(n, e) : Nt(s, () => a(n, e));
            return lr(l).pipe(On());
        })
    );
    return k(i).pipe(Ji());
}
function Nx(e, n, t) {
    let r = n[n.length - 1],
        o = n
            .slice(0, n.length - 1)
            .reverse()
            .map((s) => mx(s))
            .filter((s) => s !== null)
            .map((s) =>
                da(() => {
                    let a = s.guards.map((l) => {
                        let c = ws(s.node) ?? t,
                            u = no(l, c),
                            d = Ex(u)
                                ? u.canActivateChild(r, e)
                                : Nt(c, () => u(r, e));
                        return lr(d).pipe(On());
                    });
                    return k(a).pipe(Ji());
                })
            );
    return k(o).pipe(Ji());
}
function Ax(e, n, t, r, i) {
    let o = n && n.routeConfig ? n.routeConfig.canDeactivate : null;
    if (!o || o.length === 0) return k(!0);
    let s = o.map((a) => {
        let l = ws(n) ?? i,
            c = no(a, l),
            u = Sx(c)
                ? c.canDeactivate(e, n, t, r)
                : Nt(l, () => c(e, n, t, r));
        return lr(u).pipe(On());
    });
    return k(s).pipe(Ji());
}
function Rx(e, n, t, r) {
    let i = n.canLoad;
    if (i === void 0 || i.length === 0) return k(!0);
    let o = i.map((s) => {
        let a = no(s, e),
            l = bx(a) ? a.canLoad(n, t) : Nt(e, () => a(n, t));
        return lr(l);
    });
    return k(o).pipe(Ji(), D0(r));
}
function D0(e) {
    return qc(
        Be((n) => {
            if (typeof n != "boolean") throw Gl(e, n);
        }),
        ee((n) => n === !0)
    );
}
function kx(e, n, t, r) {
    let i = n.canMatch;
    if (!i || i.length === 0) return k(!0);
    let o = i.map((s) => {
        let a = no(s, e),
            l = wx(a) ? a.canMatch(n, t) : Nt(e, () => a(n, t));
        return lr(l);
    });
    return k(o).pipe(Ji(), D0(r));
}
var Cs = class {
        segmentGroup;
        constructor(n) {
            this.segmentGroup = n || null;
        }
    },
    Es = class extends Error {
        urlTree;
        constructor(n) {
            (super(), (this.urlTree = n));
        }
    };
function Wi(e) {
    return si(new Cs(e));
}
function Lx(e) {
    return si(new S(4e3, !1));
}
function Fx(e) {
    return si(E0(!1, Mt.GuardRejected));
}
var Dp = class {
        urlSerializer;
        urlTree;
        constructor(n, t) {
            ((this.urlSerializer = n), (this.urlTree = t));
        }
        lineralizeSegments(n, t) {
            let r = [],
                i = t.root;
            for (;;) {
                if (((r = r.concat(i.segments)), i.numberOfChildren === 0))
                    return k(r);
                if (i.numberOfChildren > 1 || !i.children[H])
                    return Lx(`${n.redirectTo}`);
                i = i.children[H];
            }
        }
        applyRedirectCommands(n, t, r, i, o) {
            if (typeof t != "string") {
                let a = t,
                    {
                        queryParams: l,
                        fragment: c,
                        routeConfig: u,
                        url: d,
                        outlet: p,
                        params: f,
                        data: h,
                        title: _,
                    } = i,
                    M = Nt(o, () =>
                        a({
                            params: f,
                            data: h,
                            queryParams: l,
                            fragment: c,
                            routeConfig: u,
                            url: d,
                            outlet: p,
                            title: _,
                        })
                    );
                if (M instanceof qn) throw new Es(M);
                t = M;
            }
            let s = this.applyRedirectCreateUrlTree(
                t,
                this.urlSerializer.parse(t),
                n,
                r
            );
            if (t[0] === "/") throw new Es(s);
            return s;
        }
        applyRedirectCreateUrlTree(n, t, r, i) {
            let o = this.createSegmentGroup(n, t.root, r, i);
            return new qn(
                o,
                this.createQueryParams(t.queryParams, this.urlTree.queryParams),
                t.fragment
            );
        }
        createQueryParams(n, t) {
            let r = {};
            return (
                Object.entries(n).forEach(([i, o]) => {
                    if (typeof o == "string" && o[0] === ":") {
                        let a = o.substring(1);
                        r[i] = t[a];
                    } else r[i] = o;
                }),
                r
            );
        }
        createSegmentGroup(n, t, r, i) {
            let o = this.createSegments(n, t.segments, r, i),
                s = {};
            return (
                Object.entries(t.children).forEach(([a, l]) => {
                    s[a] = this.createSegmentGroup(n, l, r, i);
                }),
                new ie(o, s)
            );
        }
        createSegments(n, t, r, i) {
            return t.map((o) =>
                o.path[0] === ":"
                    ? this.findPosParam(n, o, i)
                    : this.findOrReturn(o, r)
            );
        }
        findPosParam(n, t, r) {
            let i = r[t.path.substring(1)];
            if (!i) throw new S(4001, !1);
            return i;
        }
        findOrReturn(n, t) {
            let r = 0;
            for (let i of t) {
                if (i.path === n.path) return (t.splice(r), i);
                r++;
            }
            return n;
        }
    },
    Mp = {
        matched: !1,
        consumedSegments: [],
        remainingSegments: [],
        parameters: {},
        positionalParamSegments: {},
    };
function $x(e, n, t, r, i) {
    let o = M0(e, n, t);
    return o.matched
        ? ((r = sx(n, r)),
          kx(r, n, t, i).pipe(ee((s) => (s === !0 ? o : E({}, Mp)))))
        : k(o);
}
function M0(e, n, t) {
    if (n.path === "**") return Vx(t);
    if (n.path === "")
        return n.pathMatch === "full" && (e.hasChildren() || t.length > 0)
            ? E({}, Mp)
            : {
                  matched: !0,
                  consumedSegments: [],
                  remainingSegments: t,
                  parameters: {},
                  positionalParamSegments: {},
              };
    let i = (n.matcher || RT)(t, e, n);
    if (!i) return E({}, Mp);
    let o = {};
    Object.entries(i.posParams ?? {}).forEach(([a, l]) => {
        o[a] = l.path;
    });
    let s =
        i.consumed.length > 0
            ? E(E({}, o), i.consumed[i.consumed.length - 1].parameters)
            : o;
    return {
        matched: !0,
        consumedSegments: i.consumed,
        remainingSegments: t.slice(i.consumed.length),
        parameters: s,
        positionalParamSegments: i.posParams ?? {},
    };
}
function Vx(e) {
    return {
        matched: !0,
        parameters: e.length > 0 ? r0(e).parameters : {},
        consumedSegments: e,
        remainingSegments: [],
        positionalParamSegments: {},
    };
}
function Jv(e, n, t, r) {
    return t.length > 0 && Ux(e, t, r)
        ? {
              segmentGroup: new ie(n, Bx(r, new ie(t, e.children))),
              slicedSegments: [],
          }
        : t.length === 0 && Hx(e, t, r)
          ? {
                segmentGroup: new ie(e.segments, jx(e, t, r, e.children)),
                slicedSegments: t,
            }
          : { segmentGroup: new ie(e.segments, e.children), slicedSegments: t };
}
function jx(e, n, t, r) {
    let i = {};
    for (let o of t)
        if (Kl(e, n, o) && !r[en(o)]) {
            let s = new ie([], {});
            i[en(o)] = s;
        }
    return E(E({}, r), i);
}
function Bx(e, n) {
    let t = {};
    t[H] = n;
    for (let r of e)
        if (r.path === "" && en(r) !== H) {
            let i = new ie([], {});
            t[en(r)] = i;
        }
    return t;
}
function Ux(e, n, t) {
    return t.some((r) => Kl(e, n, r) && en(r) !== H);
}
function Hx(e, n, t) {
    return t.some((r) => Kl(e, n, r));
}
function Kl(e, n, t) {
    return (e.hasChildren() || n.length > 0) && t.pathMatch === "full"
        ? !1
        : t.path === "";
}
function zx(e, n, t) {
    return n.length === 0 && !e.children[t];
}
var Ip = class {};
function Wx(e, n, t, r, i, o, s = "emptyOnly") {
    return new Tp(e, n, t, r, i, s, o).recognize();
}
var qx = 31,
    Tp = class {
        injector;
        configLoader;
        rootComponentType;
        config;
        urlTree;
        paramsInheritanceStrategy;
        urlSerializer;
        applyRedirects;
        absoluteRedirectCount = 0;
        allowRedirects = !0;
        constructor(n, t, r, i, o, s, a) {
            ((this.injector = n),
                (this.configLoader = t),
                (this.rootComponentType = r),
                (this.config = i),
                (this.urlTree = o),
                (this.paramsInheritanceStrategy = s),
                (this.urlSerializer = a),
                (this.applyRedirects = new Dp(
                    this.urlSerializer,
                    this.urlTree
                )));
        }
        noMatchError(n) {
            return new S(4002, `'${n.segmentGroup}'`);
        }
        recognize() {
            let n = Jv(this.urlTree.root, [], [], this.config).segmentGroup;
            return this.match(n).pipe(
                ee(({ children: t, rootSnapshot: r }) => {
                    let i = new Dt(r, t),
                        o = new ql("", i),
                        s = JT(
                            r,
                            [],
                            this.urlTree.queryParams,
                            this.urlTree.fragment
                        );
                    return (
                        (s.queryParams = this.urlTree.queryParams),
                        (o.url = this.urlSerializer.serialize(s)),
                        { state: o, tree: s }
                    );
                })
            );
        }
        match(n) {
            let t = new Yi(
                [],
                Object.freeze({}),
                Object.freeze(E({}, this.urlTree.queryParams)),
                this.urlTree.fragment,
                Object.freeze({}),
                H,
                this.rootComponentType,
                null,
                {}
            );
            return this.processSegmentGroup(
                this.injector,
                this.config,
                n,
                H,
                t
            ).pipe(
                ee((r) => ({ children: r, rootSnapshot: t })),
                Tn((r) => {
                    if (r instanceof Es)
                        return (
                            (this.urlTree = r.urlTree),
                            this.match(r.urlTree.root)
                        );
                    throw r instanceof Cs ? this.noMatchError(r) : r;
                })
            );
        }
        processSegmentGroup(n, t, r, i, o) {
            return r.segments.length === 0 && r.hasChildren()
                ? this.processChildren(n, t, r, o)
                : this.processSegment(n, t, r, r.segments, i, !0, o).pipe(
                      ee((s) => (s instanceof Dt ? [s] : []))
                  );
        }
        processChildren(n, t, r, i) {
            let o = [];
            for (let s of Object.keys(r.children))
                s === "primary" ? o.unshift(s) : o.push(s);
            return Ee(o).pipe(
                Zn((s) => {
                    let a = r.children[s],
                        l = ax(t, s);
                    return this.processSegmentGroup(n, l, a, s, i);
                }),
                Xc((s, a) => (s.push(...a), s)),
                Xn(null),
                Zc(),
                we((s) => {
                    if (s === null) return Wi(r);
                    let a = I0(s);
                    return (Gx(a), k(a));
                })
            );
        }
        processSegment(n, t, r, i, o, s, a) {
            return Ee(t).pipe(
                Zn((l) =>
                    this.processSegmentAgainstRoute(
                        l._injector ?? n,
                        t,
                        l,
                        r,
                        i,
                        o,
                        s,
                        a
                    ).pipe(
                        Tn((c) => {
                            if (c instanceof Cs) return k(null);
                            throw c;
                        })
                    )
                ),
                On((l) => !!l),
                Tn((l) => {
                    if (w0(l)) return zx(r, i, o) ? k(new Ip()) : Wi(r);
                    throw l;
                })
            );
        }
        processSegmentAgainstRoute(n, t, r, i, o, s, a, l) {
            return en(r) !== s && (s === H || !Kl(i, o, r))
                ? Wi(i)
                : r.redirectTo === void 0
                  ? this.matchSegmentAgainstRoute(n, i, r, o, s, l)
                  : this.allowRedirects && a
                    ? this.expandSegmentAgainstRouteUsingRedirect(
                          n,
                          i,
                          t,
                          r,
                          o,
                          s,
                          l
                      )
                    : Wi(i);
        }
        expandSegmentAgainstRouteUsingRedirect(n, t, r, i, o, s, a) {
            let {
                matched: l,
                parameters: c,
                consumedSegments: u,
                positionalParamSegments: d,
                remainingSegments: p,
            } = M0(t, i, o);
            if (!l) return Wi(t);
            typeof i.redirectTo == "string" &&
                i.redirectTo[0] === "/" &&
                (this.absoluteRedirectCount++,
                this.absoluteRedirectCount > qx && (this.allowRedirects = !1));
            let f = new Yi(
                    o,
                    c,
                    Object.freeze(E({}, this.urlTree.queryParams)),
                    this.urlTree.fragment,
                    e0(i),
                    en(i),
                    i.component ?? i._loadedComponent ?? null,
                    i,
                    t0(i)
                ),
                h = Wl(f, a, this.paramsInheritanceStrategy);
            ((f.params = Object.freeze(h.params)),
                (f.data = Object.freeze(h.data)));
            let _ = this.applyRedirects.applyRedirectCommands(
                u,
                i.redirectTo,
                d,
                f,
                n
            );
            return this.applyRedirects
                .lineralizeSegments(i, _)
                .pipe(
                    we((M) =>
                        this.processSegment(n, r, t, M.concat(p), s, !1, a)
                    )
                );
        }
        matchSegmentAgainstRoute(n, t, r, i, o, s) {
            let a = $x(t, r, i, n, this.urlSerializer);
            return (
                r.path === "**" && (t.children = {}),
                a.pipe(
                    xt((l) =>
                        l.matched
                            ? ((n = r._injector ?? n),
                              this.getChildConfig(n, r, i).pipe(
                                  xt(({ routes: c }) => {
                                      let u = r._loadedInjector ?? n,
                                          {
                                              parameters: d,
                                              consumedSegments: p,
                                              remainingSegments: f,
                                          } = l,
                                          h = new Yi(
                                              p,
                                              d,
                                              Object.freeze(
                                                  E(
                                                      {},
                                                      this.urlTree.queryParams
                                                  )
                                              ),
                                              this.urlTree.fragment,
                                              e0(r),
                                              en(r),
                                              r.component ??
                                                  r._loadedComponent ??
                                                  null,
                                              r,
                                              t0(r)
                                          ),
                                          _ = Wl(
                                              h,
                                              s,
                                              this.paramsInheritanceStrategy
                                          );
                                      ((h.params = Object.freeze(_.params)),
                                          (h.data = Object.freeze(_.data)));
                                      let {
                                          segmentGroup: M,
                                          slicedSegments: I,
                                      } = Jv(t, p, f, c);
                                      if (I.length === 0 && M.hasChildren())
                                          return this.processChildren(
                                              u,
                                              c,
                                              M,
                                              h
                                          ).pipe(ee((J) => new Dt(h, J)));
                                      if (c.length === 0 && I.length === 0)
                                          return k(new Dt(h, []));
                                      let j = en(r) === o;
                                      return this.processSegment(
                                          u,
                                          c,
                                          M,
                                          I,
                                          j ? H : o,
                                          !0,
                                          h
                                      ).pipe(
                                          ee(
                                              (J) =>
                                                  new Dt(
                                                      h,
                                                      J instanceof Dt ? [J] : []
                                                  )
                                          )
                                      );
                                  })
                              ))
                            : Wi(t)
                    )
                )
            );
        }
        getChildConfig(n, t, r) {
            return t.children
                ? k({ routes: t.children, injector: n })
                : t.loadChildren
                  ? t._loadedRoutes !== void 0
                      ? k({
                            routes: t._loadedRoutes,
                            injector: t._loadedInjector,
                        })
                      : Rx(n, t, r, this.urlSerializer).pipe(
                            we((i) =>
                                i
                                    ? this.configLoader.loadChildren(n, t).pipe(
                                          Be((o) => {
                                              ((t._loadedRoutes = o.routes),
                                                  (t._loadedInjector =
                                                      o.injector));
                                          })
                                      )
                                    : Fx(t)
                            )
                        )
                  : k({ routes: [], injector: n });
        }
    };
function Gx(e) {
    e.sort((n, t) =>
        n.value.outlet === H
            ? -1
            : t.value.outlet === H
              ? 1
              : n.value.outlet.localeCompare(t.value.outlet)
    );
}
function Yx(e) {
    let n = e.value.routeConfig;
    return n && n.path === "";
}
function I0(e) {
    let n = [],
        t = new Set();
    for (let r of e) {
        if (!Yx(r)) {
            n.push(r);
            continue;
        }
        let i = n.find((o) => r.value.routeConfig === o.value.routeConfig);
        i !== void 0 ? (i.children.push(...r.children), t.add(i)) : n.push(r);
    }
    for (let r of t) {
        let i = I0(r.children);
        n.push(new Dt(r.value, i));
    }
    return n.filter((r) => !t.has(r));
}
function e0(e) {
    return e.data || {};
}
function t0(e) {
    return e.resolve || {};
}
function Kx(e, n, t, r, i, o) {
    return we((s) =>
        Wx(e, n, t, r, s.extractedUrl, i, o).pipe(
            ee(({ state: a, tree: l }) =>
                oe(E({}, s), { targetSnapshot: a, urlAfterRedirects: l })
            )
        )
    );
}
function Qx(e, n) {
    return we((t) => {
        let {
            targetSnapshot: r,
            guards: { canActivateChecks: i },
        } = t;
        if (!i.length) return k(t);
        let o = new Set(i.map((l) => l.route)),
            s = new Set();
        for (let l of o) if (!s.has(l)) for (let c of T0(l)) s.add(c);
        let a = 0;
        return Ee(s).pipe(
            Zn((l) =>
                o.has(l)
                    ? Zx(l, r, e, n)
                    : ((l.data = Wl(l, l.parent, e).resolve), k(void 0))
            ),
            Be(() => a++),
            ci(1),
            we((l) => (a === s.size ? k(t) : it))
        );
    });
}
function T0(e) {
    let n = e.children.map((t) => T0(t)).flat();
    return [e, ...n];
}
function Zx(e, n, t, r) {
    let i = e.routeConfig,
        o = e._resolve;
    return (
        i?.title !== void 0 && !y0(i) && (o[Ss] = i.title),
        Xx(o, e, n, r).pipe(
            ee(
                (s) => (
                    (e._resolvedData = s),
                    (e.data = Wl(e, e.parent, t).resolve),
                    null
                )
            )
        )
    );
}
function Xx(e, n, t, r) {
    let i = op(e);
    if (i.length === 0) return k({});
    let o = {};
    return Ee(i).pipe(
        we((s) =>
            Jx(e[s], n, t, r).pipe(
                On(),
                Be((a) => {
                    if (a instanceof bs) throw Gl(new Br(), a);
                    o[s] = a;
                })
            )
        ),
        ci(1),
        ee(() => o),
        Tn((s) => (w0(s) ? it : si(s)))
    );
}
function Jx(e, n, t, r) {
    let i = ws(n) ?? r,
        o = no(e, i),
        s = o.resolve ? o.resolve(n, t) : Nt(i, () => o(n, t));
    return lr(s);
}
function rp(e) {
    return xt((n) => {
        let t = e(n);
        return t ? Ee(t).pipe(ee(() => n)) : k(n);
    });
}
var x0 = (() => {
        class e {
            buildTitle(t) {
                let r,
                    i = t.root;
                for (; i !== void 0; )
                    ((r = this.getResolvedTitleForRoute(i) ?? r),
                        (i = i.children.find((o) => o.outlet === H)));
                return r;
            }
            getResolvedTitleForRoute(t) {
                return t.data[Ss];
            }
            static ɵfac = function (r) {
                return new (r || e)();
            };
            static ɵprov = w({
                token: e,
                factory: () => y(eO),
                providedIn: "root",
            });
        }
        return e;
    })(),
    eO = (() => {
        class e extends x0 {
            title;
            constructor(t) {
                (super(), (this.title = t));
            }
            updateTitle(t) {
                let r = this.buildTitle(t);
                r !== void 0 && this.title.setTitle(r);
            }
            static ɵfac = function (r) {
                return new (r || e)(N(Mv));
            };
            static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" });
        }
        return e;
    })(),
    ro = new O("", { providedIn: "root", factory: () => ({}) }),
    Is = new O(""),
    Ql = (() => {
        class e {
            componentLoaders = new WeakMap();
            childrenLoaders = new WeakMap();
            onLoadStartListener;
            onLoadEndListener;
            compiler = y(nv);
            loadComponent(t) {
                if (this.componentLoaders.get(t))
                    return this.componentLoaders.get(t);
                if (t._loadedComponent) return k(t._loadedComponent);
                this.onLoadStartListener && this.onLoadStartListener(t);
                let r = lr(t.loadComponent()).pipe(
                        ee(O0),
                        Be((o) => {
                            (this.onLoadEndListener &&
                                this.onLoadEndListener(t),
                                (t._loadedComponent = o));
                        }),
                        Eo(() => {
                            this.componentLoaders.delete(t);
                        })
                    ),
                    i = new oi(r, () => new Te()).pipe(ii());
                return (this.componentLoaders.set(t, i), i);
            }
            loadChildren(t, r) {
                if (this.childrenLoaders.get(r))
                    return this.childrenLoaders.get(r);
                if (r._loadedRoutes)
                    return k({
                        routes: r._loadedRoutes,
                        injector: r._loadedInjector,
                    });
                this.onLoadStartListener && this.onLoadStartListener(r);
                let o = tO(r, this.compiler, t, this.onLoadEndListener).pipe(
                        Eo(() => {
                            this.childrenLoaders.delete(r);
                        })
                    ),
                    s = new oi(o, () => new Te()).pipe(ii());
                return (this.childrenLoaders.set(r, s), s);
            }
            static ɵfac = function (r) {
                return new (r || e)();
            };
            static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" });
        }
        return e;
    })();
function tO(e, n, t, r) {
    return lr(e.loadChildren()).pipe(
        ee(O0),
        we((i) =>
            i instanceof pf || Array.isArray(i)
                ? k(i)
                : Ee(n.compileModuleAsync(i))
        ),
        ee((i) => {
            r && r(e);
            let o,
                s,
                a = !1;
            return (
                Array.isArray(i)
                    ? ((s = i), (a = !0))
                    : ((o = i.create(t).injector),
                      (s = o.get(Is, [], { optional: !0, self: !0 }).flat())),
                { routes: s.map(Np), injector: o }
            );
        })
    );
}
function nO(e) {
    return e && typeof e == "object" && "default" in e;
}
function O0(e) {
    return nO(e) ? e.default : e;
}
var Ap = (() => {
        class e {
            static ɵfac = function (r) {
                return new (r || e)();
            };
            static ɵprov = w({
                token: e,
                factory: () => y(rO),
                providedIn: "root",
            });
        }
        return e;
    })(),
    rO = (() => {
        class e {
            shouldProcessUrl(t) {
                return !0;
            }
            extract(t) {
                return t;
            }
            merge(t, r) {
                return t;
            }
            static ɵfac = function (r) {
                return new (r || e)();
            };
            static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" });
        }
        return e;
    })(),
    Rp = new O(""),
    kp = new O("");
function P0(e, n, t) {
    let r = e.get(kp),
        i = e.get(re);
    return e.get(ne).runOutsideAngular(() => {
        if (!i.startViewTransition || r.skipNextTransition)
            return (
                (r.skipNextTransition = !1),
                new Promise((c) => setTimeout(c))
            );
        let o,
            s = new Promise((c) => {
                o = c;
            }),
            a = i.startViewTransition(() => (o(), iO(e))),
            { onViewTransitionCreated: l } = r;
        return (l && Nt(e, () => l({ transition: a, from: n, to: t })), s);
    });
}
function iO(e) {
    return new Promise((n) => {
        qd({ read: () => setTimeout(n) }, { injector: e });
    });
}
var Lp = new O(""),
    Zl = (() => {
        class e {
            currentNavigation = null;
            currentTransition = null;
            lastSuccessfulNavigation = null;
            events = new Te();
            transitionAbortSubject = new Te();
            configLoader = y(Ql);
            environmentInjector = y(at);
            destroyRef = y(Pr);
            urlSerializer = y(eo);
            rootContexts = y(to);
            location = y(sr);
            inputBindingEnabled = y(Ds, { optional: !0 }) !== null;
            titleStrategy = y(x0);
            options = y(ro, { optional: !0 }) || {};
            paramsInheritanceStrategy =
                this.options.paramsInheritanceStrategy || "emptyOnly";
            urlHandlingStrategy = y(Ap);
            createViewTransition = y(Rp, { optional: !0 });
            navigationErrorHandler = y(Lp, { optional: !0 });
            navigationId = 0;
            get hasRequestedNavigation() {
                return this.navigationId !== 0;
            }
            transitions;
            afterPreactivation = () => k(void 0);
            rootComponentType = null;
            destroyed = !1;
            constructor() {
                let t = (i) => this.events.next(new pp(i)),
                    r = (i) => this.events.next(new hp(i));
                ((this.configLoader.onLoadEndListener = r),
                    (this.configLoader.onLoadStartListener = t),
                    this.destroyRef.onDestroy(() => {
                        this.destroyed = !0;
                    }));
            }
            complete() {
                this.transitions?.complete();
            }
            handleNavigationRequest(t) {
                let r = ++this.navigationId;
                this.transitions?.next(
                    oe(E({}, t), {
                        extractedUrl: this.urlHandlingStrategy.extract(
                            t.rawUrl
                        ),
                        targetSnapshot: null,
                        targetRouterState: null,
                        guards: {
                            canActivateChecks: [],
                            canDeactivateChecks: [],
                        },
                        guardsResult: null,
                        id: r,
                    })
                );
            }
            setupNavigations(t) {
                return (
                    (this.transitions = new je(null)),
                    this.transitions.pipe(
                        yt((r) => r !== null),
                        xt((r) => {
                            let i = !1,
                                o = !1;
                            return k(r).pipe(
                                xt((s) => {
                                    if (this.navigationId > r.id)
                                        return (
                                            this.cancelNavigationTransition(
                                                r,
                                                "",
                                                Mt.SupersededByNewNavigation
                                            ),
                                            it
                                        );
                                    ((this.currentTransition = r),
                                        (this.currentNavigation = {
                                            id: s.id,
                                            initialUrl: s.rawUrl,
                                            extractedUrl: s.extractedUrl,
                                            targetBrowserUrl:
                                                typeof s.extras.browserUrl ==
                                                "string"
                                                    ? this.urlSerializer.parse(
                                                          s.extras.browserUrl
                                                      )
                                                    : s.extras.browserUrl,
                                            trigger: s.source,
                                            extras: s.extras,
                                            previousNavigation: this
                                                .lastSuccessfulNavigation
                                                ? oe(
                                                      E(
                                                          {},
                                                          this
                                                              .lastSuccessfulNavigation
                                                      ),
                                                      {
                                                          previousNavigation:
                                                              null,
                                                      }
                                                  )
                                                : null,
                                        }));
                                    let a =
                                            !t.navigated ||
                                            this.isUpdatingInternalState() ||
                                            this.isUpdatedBrowserUrl(),
                                        l =
                                            s.extras.onSameUrlNavigation ??
                                            t.onSameUrlNavigation;
                                    if (!a && l !== "reload") {
                                        let c = "";
                                        return (
                                            this.events.next(
                                                new Gn(
                                                    s.id,
                                                    this.urlSerializer.serialize(
                                                        s.rawUrl
                                                    ),
                                                    c,
                                                    gs.IgnoredSameUrlNavigation
                                                )
                                            ),
                                            s.resolve(!1),
                                            it
                                        );
                                    }
                                    if (
                                        this.urlHandlingStrategy.shouldProcessUrl(
                                            s.rawUrl
                                        )
                                    )
                                        return k(s).pipe(
                                            xt(
                                                (c) => (
                                                    this.events.next(
                                                        new Ur(
                                                            c.id,
                                                            this.urlSerializer.serialize(
                                                                c.extractedUrl
                                                            ),
                                                            c.source,
                                                            c.restoredState
                                                        )
                                                    ),
                                                    c.id !== this.navigationId
                                                        ? it
                                                        : Promise.resolve(c)
                                                )
                                            ),
                                            Kx(
                                                this.environmentInjector,
                                                this.configLoader,
                                                this.rootComponentType,
                                                t.config,
                                                this.urlSerializer,
                                                this.paramsInheritanceStrategy
                                            ),
                                            Be((c) => {
                                                ((r.targetSnapshot =
                                                    c.targetSnapshot),
                                                    (r.urlAfterRedirects =
                                                        c.urlAfterRedirects),
                                                    (this.currentNavigation =
                                                        oe(
                                                            E(
                                                                {},
                                                                this
                                                                    .currentNavigation
                                                            ),
                                                            {
                                                                finalUrl:
                                                                    c.urlAfterRedirects,
                                                            }
                                                        )));
                                                let u = new Ul(
                                                    c.id,
                                                    this.urlSerializer.serialize(
                                                        c.extractedUrl
                                                    ),
                                                    this.urlSerializer.serialize(
                                                        c.urlAfterRedirects
                                                    ),
                                                    c.targetSnapshot
                                                );
                                                this.events.next(u);
                                            })
                                        );
                                    if (
                                        a &&
                                        this.urlHandlingStrategy.shouldProcessUrl(
                                            s.currentRawUrl
                                        )
                                    ) {
                                        let {
                                                id: c,
                                                extractedUrl: u,
                                                source: d,
                                                restoredState: p,
                                                extras: f,
                                            } = s,
                                            h = new Ur(
                                                c,
                                                this.urlSerializer.serialize(u),
                                                d,
                                                p
                                            );
                                        this.events.next(h);
                                        let _ = m0(
                                            this.rootComponentType
                                        ).snapshot;
                                        return (
                                            (this.currentTransition = r =
                                                oe(E({}, s), {
                                                    targetSnapshot: _,
                                                    urlAfterRedirects: u,
                                                    extras: oe(E({}, f), {
                                                        skipLocationChange: !1,
                                                        replaceUrl: !1,
                                                    }),
                                                })),
                                            (this.currentNavigation.finalUrl =
                                                u),
                                            k(r)
                                        );
                                    } else {
                                        let c = "";
                                        return (
                                            this.events.next(
                                                new Gn(
                                                    s.id,
                                                    this.urlSerializer.serialize(
                                                        s.extractedUrl
                                                    ),
                                                    c,
                                                    gs.IgnoredByUrlHandlingStrategy
                                                )
                                            ),
                                            s.resolve(!1),
                                            it
                                        );
                                    }
                                }),
                                Be((s) => {
                                    let a = new cp(
                                        s.id,
                                        this.urlSerializer.serialize(
                                            s.extractedUrl
                                        ),
                                        this.urlSerializer.serialize(
                                            s.urlAfterRedirects
                                        ),
                                        s.targetSnapshot
                                    );
                                    this.events.next(a);
                                }),
                                ee(
                                    (s) => (
                                        (this.currentTransition = r =
                                            oe(E({}, s), {
                                                guards: gx(
                                                    s.targetSnapshot,
                                                    s.currentSnapshot,
                                                    this.rootContexts
                                                ),
                                            })),
                                        r
                                    )
                                ),
                                Mx(this.environmentInjector, (s) =>
                                    this.events.next(s)
                                ),
                                Be((s) => {
                                    if (
                                        ((r.guardsResult = s.guardsResult),
                                        s.guardsResult &&
                                            typeof s.guardsResult != "boolean")
                                    )
                                        throw Gl(
                                            this.urlSerializer,
                                            s.guardsResult
                                        );
                                    let a = new up(
                                        s.id,
                                        this.urlSerializer.serialize(
                                            s.extractedUrl
                                        ),
                                        this.urlSerializer.serialize(
                                            s.urlAfterRedirects
                                        ),
                                        s.targetSnapshot,
                                        !!s.guardsResult
                                    );
                                    this.events.next(a);
                                }),
                                yt((s) =>
                                    s.guardsResult
                                        ? !0
                                        : (this.cancelNavigationTransition(
                                              s,
                                              "",
                                              Mt.GuardRejected
                                          ),
                                          !1)
                                ),
                                rp((s) => {
                                    if (s.guards.canActivateChecks.length !== 0)
                                        return k(s).pipe(
                                            Be((a) => {
                                                let l = new dp(
                                                    a.id,
                                                    this.urlSerializer.serialize(
                                                        a.extractedUrl
                                                    ),
                                                    this.urlSerializer.serialize(
                                                        a.urlAfterRedirects
                                                    ),
                                                    a.targetSnapshot
                                                );
                                                this.events.next(l);
                                            }),
                                            xt((a) => {
                                                let l = !1;
                                                return k(a).pipe(
                                                    Qx(
                                                        this
                                                            .paramsInheritanceStrategy,
                                                        this.environmentInjector
                                                    ),
                                                    Be({
                                                        next: () => (l = !0),
                                                        complete: () => {
                                                            l ||
                                                                this.cancelNavigationTransition(
                                                                    a,
                                                                    "",
                                                                    Mt.NoDataFromResolver
                                                                );
                                                        },
                                                    })
                                                );
                                            }),
                                            Be((a) => {
                                                let l = new fp(
                                                    a.id,
                                                    this.urlSerializer.serialize(
                                                        a.extractedUrl
                                                    ),
                                                    this.urlSerializer.serialize(
                                                        a.urlAfterRedirects
                                                    ),
                                                    a.targetSnapshot
                                                );
                                                this.events.next(l);
                                            })
                                        );
                                }),
                                rp((s) => {
                                    let a = (l) => {
                                        let c = [];
                                        l.routeConfig?.loadComponent &&
                                            !l.routeConfig._loadedComponent &&
                                            c.push(
                                                this.configLoader
                                                    .loadComponent(
                                                        l.routeConfig
                                                    )
                                                    .pipe(
                                                        Be((u) => {
                                                            l.component = u;
                                                        }),
                                                        ee(() => {})
                                                    )
                                            );
                                        for (let u of l.children)
                                            c.push(...a(u));
                                        return c;
                                    };
                                    return Co(a(s.targetSnapshot.root)).pipe(
                                        Xn(null),
                                        xn(1)
                                    );
                                }),
                                rp(() => this.afterPreactivation()),
                                xt(() => {
                                    let {
                                            currentSnapshot: s,
                                            targetSnapshot: a,
                                        } = r,
                                        l = this.createViewTransition?.(
                                            this.environmentInjector,
                                            s.root,
                                            a.root
                                        );
                                    return l ? Ee(l).pipe(ee(() => r)) : k(r);
                                }),
                                ee((s) => {
                                    let a = ux(
                                        t.routeReuseStrategy,
                                        s.targetSnapshot,
                                        s.currentRouterState
                                    );
                                    return (
                                        (this.currentTransition = r =
                                            oe(E({}, s), {
                                                targetRouterState: a,
                                            })),
                                        (this.currentNavigation.targetRouterState =
                                            a),
                                        r
                                    );
                                }),
                                Be(() => {
                                    this.events.next(new ys());
                                }),
                                hx(
                                    this.rootContexts,
                                    t.routeReuseStrategy,
                                    (s) => this.events.next(s),
                                    this.inputBindingEnabled
                                ),
                                xn(1),
                                Be({
                                    next: (s) => {
                                        ((i = !0),
                                            (this.lastSuccessfulNavigation =
                                                this.currentNavigation),
                                            this.events.next(
                                                new bn(
                                                    s.id,
                                                    this.urlSerializer.serialize(
                                                        s.extractedUrl
                                                    ),
                                                    this.urlSerializer.serialize(
                                                        s.urlAfterRedirects
                                                    )
                                                )
                                            ),
                                            this.titleStrategy?.updateTitle(
                                                s.targetRouterState.snapshot
                                            ),
                                            s.resolve(!0));
                                    },
                                    complete: () => {
                                        i = !0;
                                    },
                                }),
                                eu(
                                    this.transitionAbortSubject.pipe(
                                        Be((s) => {
                                            throw s;
                                        })
                                    )
                                ),
                                Eo(() => {
                                    (!i &&
                                        !o &&
                                        this.cancelNavigationTransition(
                                            r,
                                            "",
                                            Mt.SupersededByNewNavigation
                                        ),
                                        this.currentTransition?.id === r.id &&
                                            ((this.currentNavigation = null),
                                            (this.currentTransition = null)));
                                }),
                                Tn((s) => {
                                    if (this.destroyed)
                                        return (r.resolve(!1), it);
                                    if (((o = !0), S0(s)))
                                        (this.events.next(
                                            new Wn(
                                                r.id,
                                                this.urlSerializer.serialize(
                                                    r.extractedUrl
                                                ),
                                                s.message,
                                                s.cancellationCode
                                            )
                                        ),
                                            px(s)
                                                ? this.events.next(
                                                      new Xi(
                                                          s.url,
                                                          s.navigationBehaviorOptions
                                                      )
                                                  )
                                                : r.resolve(!1));
                                    else {
                                        let a = new ms(
                                            r.id,
                                            this.urlSerializer.serialize(
                                                r.extractedUrl
                                            ),
                                            s,
                                            r.targetSnapshot ?? void 0
                                        );
                                        try {
                                            let l = Nt(
                                                this.environmentInjector,
                                                () =>
                                                    this.navigationErrorHandler?.(
                                                        a
                                                    )
                                            );
                                            if (l instanceof bs) {
                                                let {
                                                    message: c,
                                                    cancellationCode: u,
                                                } = Gl(this.urlSerializer, l);
                                                (this.events.next(
                                                    new Wn(
                                                        r.id,
                                                        this.urlSerializer.serialize(
                                                            r.extractedUrl
                                                        ),
                                                        c,
                                                        u
                                                    )
                                                ),
                                                    this.events.next(
                                                        new Xi(
                                                            l.redirectTo,
                                                            l.navigationBehaviorOptions
                                                        )
                                                    ));
                                            } else
                                                throw (this.events.next(a), s);
                                        } catch (l) {
                                            this.options
                                                .resolveNavigationPromiseOnError
                                                ? r.resolve(!1)
                                                : r.reject(l);
                                        }
                                    }
                                    return it;
                                })
                            );
                        })
                    )
                );
            }
            cancelNavigationTransition(t, r, i) {
                let o = new Wn(
                    t.id,
                    this.urlSerializer.serialize(t.extractedUrl),
                    r,
                    i
                );
                (this.events.next(o), t.resolve(!1));
            }
            isUpdatingInternalState() {
                return (
                    this.currentTransition?.extractedUrl.toString() !==
                    this.currentTransition?.currentUrlTree.toString()
                );
            }
            isUpdatedBrowserUrl() {
                let t = this.urlHandlingStrategy.extract(
                        this.urlSerializer.parse(this.location.path(!0))
                    ),
                    r =
                        this.currentNavigation?.targetBrowserUrl ??
                        this.currentNavigation?.extractedUrl;
                return (
                    t.toString() !== r?.toString() &&
                    !this.currentNavigation?.extras.skipLocationChange
                );
            }
            static ɵfac = function (r) {
                return new (r || e)();
            };
            static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" });
        }
        return e;
    })();
function oO(e) {
    return e !== Vl;
}
var sO = (() => {
        class e {
            static ɵfac = function (r) {
                return new (r || e)();
            };
            static ɵprov = w({
                token: e,
                factory: () => y(aO),
                providedIn: "root",
            });
        }
        return e;
    })(),
    xp = class {
        shouldDetach(n) {
            return !1;
        }
        store(n, t) {}
        shouldAttach(n) {
            return !1;
        }
        retrieve(n) {
            return null;
        }
        shouldReuseRoute(n, t) {
            return n.routeConfig === t.routeConfig;
        }
    },
    aO = (() => {
        class e extends xp {
            static ɵfac = (() => {
                let t;
                return function (i) {
                    return (t || (t = te(e)))(i || e);
                };
            })();
            static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" });
        }
        return e;
    })(),
    N0 = (() => {
        class e {
            urlSerializer = y(eo);
            options = y(ro, { optional: !0 }) || {};
            canceledNavigationResolution =
                this.options.canceledNavigationResolution || "replace";
            location = y(sr);
            urlHandlingStrategy = y(Ap);
            urlUpdateStrategy = this.options.urlUpdateStrategy || "deferred";
            currentUrlTree = new qn();
            getCurrentUrlTree() {
                return this.currentUrlTree;
            }
            rawUrlTree = this.currentUrlTree;
            getRawUrlTree() {
                return this.rawUrlTree;
            }
            createBrowserPath({
                finalUrl: t,
                initialUrl: r,
                targetBrowserUrl: i,
            }) {
                let o = t !== void 0 ? this.urlHandlingStrategy.merge(t, r) : r,
                    s = i ?? o;
                return s instanceof qn ? this.urlSerializer.serialize(s) : s;
            }
            commitTransition({
                targetRouterState: t,
                finalUrl: r,
                initialUrl: i,
            }) {
                r && t
                    ? ((this.currentUrlTree = r),
                      (this.rawUrlTree = this.urlHandlingStrategy.merge(r, i)),
                      (this.routerState = t))
                    : (this.rawUrlTree = i);
            }
            routerState = m0(null);
            getRouterState() {
                return this.routerState;
            }
            stateMemento = this.createStateMemento();
            updateStateMemento() {
                this.stateMemento = this.createStateMemento();
            }
            createStateMemento() {
                return {
                    rawUrlTree: this.rawUrlTree,
                    currentUrlTree: this.currentUrlTree,
                    routerState: this.routerState,
                };
            }
            resetInternalState({ finalUrl: t }) {
                ((this.routerState = this.stateMemento.routerState),
                    (this.currentUrlTree = this.stateMemento.currentUrlTree),
                    (this.rawUrlTree = this.urlHandlingStrategy.merge(
                        this.currentUrlTree,
                        t ?? this.rawUrlTree
                    )));
            }
            static ɵfac = function (r) {
                return new (r || e)();
            };
            static ɵprov = w({
                token: e,
                factory: () => y(lO),
                providedIn: "root",
            });
        }
        return e;
    })(),
    lO = (() => {
        class e extends N0 {
            currentPageId = 0;
            lastSuccessfulId = -1;
            restoredState() {
                return this.location.getState();
            }
            get browserPageId() {
                return this.canceledNavigationResolution !== "computed"
                    ? this.currentPageId
                    : (this.restoredState()?.ɵrouterPageId ??
                          this.currentPageId);
            }
            registerNonRouterCurrentEntryChangeListener(t) {
                return this.location.subscribe((r) => {
                    r.type === "popstate" &&
                        setTimeout(() => {
                            t(r.url, r.state, "popstate");
                        });
                });
            }
            handleRouterEvent(t, r) {
                t instanceof Ur
                    ? this.updateStateMemento()
                    : t instanceof Gn
                      ? this.commitTransition(r)
                      : t instanceof Ul
                        ? this.urlUpdateStrategy === "eager" &&
                          (r.extras.skipLocationChange ||
                              this.setBrowserUrl(this.createBrowserPath(r), r))
                        : t instanceof ys
                          ? (this.commitTransition(r),
                            this.urlUpdateStrategy === "deferred" &&
                                !r.extras.skipLocationChange &&
                                this.setBrowserUrl(
                                    this.createBrowserPath(r),
                                    r
                                ))
                          : t instanceof Wn &&
                              (t.code === Mt.GuardRejected ||
                                  t.code === Mt.NoDataFromResolver)
                            ? this.restoreHistory(r)
                            : t instanceof ms
                              ? this.restoreHistory(r, !0)
                              : t instanceof bn &&
                                ((this.lastSuccessfulId = t.id),
                                (this.currentPageId = this.browserPageId));
            }
            setBrowserUrl(t, { extras: r, id: i }) {
                let { replaceUrl: o, state: s } = r;
                if (this.location.isCurrentPathEqualTo(t) || o) {
                    let a = this.browserPageId,
                        l = E(E({}, s), this.generateNgRouterState(i, a));
                    this.location.replaceState(t, "", l);
                } else {
                    let a = E(
                        E({}, s),
                        this.generateNgRouterState(i, this.browserPageId + 1)
                    );
                    this.location.go(t, "", a);
                }
            }
            restoreHistory(t, r = !1) {
                if (this.canceledNavigationResolution === "computed") {
                    let i = this.browserPageId,
                        o = this.currentPageId - i;
                    o !== 0
                        ? this.location.historyGo(o)
                        : this.getCurrentUrlTree() === t.finalUrl &&
                          o === 0 &&
                          (this.resetInternalState(t),
                          this.resetUrlToCurrentUrlTree());
                } else
                    this.canceledNavigationResolution === "replace" &&
                        (r && this.resetInternalState(t),
                        this.resetUrlToCurrentUrlTree());
            }
            resetUrlToCurrentUrlTree() {
                this.location.replaceState(
                    this.urlSerializer.serialize(this.getRawUrlTree()),
                    "",
                    this.generateNgRouterState(
                        this.lastSuccessfulId,
                        this.currentPageId
                    )
                );
            }
            generateNgRouterState(t, r) {
                return this.canceledNavigationResolution === "computed"
                    ? { navigationId: t, ɵrouterPageId: r }
                    : { navigationId: t };
            }
            static ɵfac = (() => {
                let t;
                return function (i) {
                    return (t || (t = te(e)))(i || e);
                };
            })();
            static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" });
        }
        return e;
    })();
function Fp(e, n) {
    e.events
        .pipe(
            yt(
                (t) =>
                    t instanceof bn ||
                    t instanceof Wn ||
                    t instanceof ms ||
                    t instanceof Gn
            ),
            ee((t) =>
                t instanceof bn || t instanceof Gn
                    ? 0
                    : (
                            t instanceof Wn
                                ? t.code === Mt.Redirect ||
                                  t.code === Mt.SupersededByNewNavigation
                                : !1
                        )
                      ? 2
                      : 1
            ),
            yt((t) => t !== 2),
            xn(1)
        )
        .subscribe(() => {
            n();
        });
}
var cO = {
        paths: "exact",
        fragment: "ignored",
        matrixParams: "ignored",
        queryParams: "exact",
    },
    uO = {
        paths: "subset",
        fragment: "ignored",
        matrixParams: "ignored",
        queryParams: "subset",
    },
    zr = (() => {
        class e {
            get currentUrlTree() {
                return this.stateManager.getCurrentUrlTree();
            }
            get rawUrlTree() {
                return this.stateManager.getRawUrlTree();
            }
            disposed = !1;
            nonRouterCurrentEntryChangeSubscription;
            console = y(Iy);
            stateManager = y(N0);
            options = y(ro, { optional: !0 }) || {};
            pendingTasks = y(Oi);
            urlUpdateStrategy = this.options.urlUpdateStrategy || "deferred";
            navigationTransitions = y(Zl);
            urlSerializer = y(eo);
            location = y(sr);
            urlHandlingStrategy = y(Ap);
            _events = new Te();
            get events() {
                return this._events;
            }
            get routerState() {
                return this.stateManager.getRouterState();
            }
            navigated = !1;
            routeReuseStrategy = y(sO);
            onSameUrlNavigation = this.options.onSameUrlNavigation || "ignore";
            config = y(Is, { optional: !0 })?.flat() ?? [];
            componentInputBindingEnabled = !!y(Ds, { optional: !0 });
            constructor() {
                (this.resetConfig(this.config),
                    this.navigationTransitions
                        .setupNavigations(this)
                        .subscribe({
                            error: (t) => {
                                this.console.warn(t);
                            },
                        }),
                    this.subscribeToNavigationEvents());
            }
            eventsSubscription = new Ie();
            subscribeToNavigationEvents() {
                let t = this.navigationTransitions.events.subscribe((r) => {
                    try {
                        let i = this.navigationTransitions.currentTransition,
                            o = this.navigationTransitions.currentNavigation;
                        if (i !== null && o !== null) {
                            if (
                                (this.stateManager.handleRouterEvent(r, o),
                                r instanceof Wn &&
                                    r.code !== Mt.Redirect &&
                                    r.code !== Mt.SupersededByNewNavigation)
                            )
                                this.navigated = !0;
                            else if (r instanceof bn) this.navigated = !0;
                            else if (r instanceof Xi) {
                                let s = r.navigationBehaviorOptions,
                                    a = this.urlHandlingStrategy.merge(
                                        r.url,
                                        i.currentRawUrl
                                    ),
                                    l = E(
                                        {
                                            browserUrl: i.extras.browserUrl,
                                            info: i.extras.info,
                                            skipLocationChange:
                                                i.extras.skipLocationChange,
                                            replaceUrl:
                                                i.extras.replaceUrl ||
                                                this.urlUpdateStrategy ===
                                                    "eager" ||
                                                oO(i.source),
                                        },
                                        s
                                    );
                                this.scheduleNavigation(a, Vl, null, l, {
                                    resolve: i.resolve,
                                    reject: i.reject,
                                    promise: i.promise,
                                });
                            }
                        }
                        fO(r) && this._events.next(r);
                    } catch (i) {
                        this.navigationTransitions.transitionAbortSubject.next(
                            i
                        );
                    }
                });
                this.eventsSubscription.add(t);
            }
            resetRootComponentType(t) {
                ((this.routerState.root.component = t),
                    (this.navigationTransitions.rootComponentType = t));
            }
            initialNavigation() {
                (this.setUpLocationChangeListener(),
                    this.navigationTransitions.hasRequestedNavigation ||
                        this.navigateToSyncWithBrowser(
                            this.location.path(!0),
                            Vl,
                            this.stateManager.restoredState()
                        ));
            }
            setUpLocationChangeListener() {
                this.nonRouterCurrentEntryChangeSubscription ??=
                    this.stateManager.registerNonRouterCurrentEntryChangeListener(
                        (t, r, i) => {
                            this.navigateToSyncWithBrowser(t, i, r);
                        }
                    );
            }
            navigateToSyncWithBrowser(t, r, i) {
                let o = { replaceUrl: !0 },
                    s = i?.navigationId ? i : null;
                if (i) {
                    let l = E({}, i);
                    (delete l.navigationId,
                        delete l.ɵrouterPageId,
                        Object.keys(l).length !== 0 && (o.state = l));
                }
                let a = this.parseUrl(t);
                this.scheduleNavigation(a, r, s, o);
            }
            get url() {
                return this.serializeUrl(this.currentUrlTree);
            }
            getCurrentNavigation() {
                return this.navigationTransitions.currentNavigation;
            }
            get lastSuccessfulNavigation() {
                return this.navigationTransitions.lastSuccessfulNavigation;
            }
            resetConfig(t) {
                ((this.config = t.map(Np)), (this.navigated = !1));
            }
            ngOnDestroy() {
                this.dispose();
            }
            dispose() {
                (this._events.unsubscribe(),
                    this.navigationTransitions.complete(),
                    this.nonRouterCurrentEntryChangeSubscription &&
                        (this.nonRouterCurrentEntryChangeSubscription.unsubscribe(),
                        (this.nonRouterCurrentEntryChangeSubscription =
                            void 0)),
                    (this.disposed = !0),
                    this.eventsSubscription.unsubscribe());
            }
            createUrlTree(t, r = {}) {
                let {
                        relativeTo: i,
                        queryParams: o,
                        fragment: s,
                        queryParamsHandling: a,
                        preserveFragment: l,
                    } = r,
                    c = l ? this.currentUrlTree.fragment : s,
                    u = null;
                switch (a ?? this.options.defaultQueryParamsHandling) {
                    case "merge":
                        u = E(E({}, this.currentUrlTree.queryParams), o);
                        break;
                    case "preserve":
                        u = this.currentUrlTree.queryParams;
                        break;
                    default:
                        u = o || null;
                }
                u !== null && (u = this.removeEmptyProps(u));
                let d;
                try {
                    let p = i ? i.snapshot : this.routerState.snapshot.root;
                    d = f0(p);
                } catch {
                    ((typeof t[0] != "string" || t[0][0] !== "/") && (t = []),
                        (d = this.currentUrlTree.root));
                }
                return p0(d, t, u, c ?? null);
            }
            navigateByUrl(t, r = { skipLocationChange: !1 }) {
                let i = Zi(t) ? t : this.parseUrl(t),
                    o = this.urlHandlingStrategy.merge(i, this.rawUrlTree);
                return this.scheduleNavigation(o, Vl, null, r);
            }
            navigate(t, r = { skipLocationChange: !1 }) {
                return (dO(t), this.navigateByUrl(this.createUrlTree(t, r), r));
            }
            serializeUrl(t) {
                return this.urlSerializer.serialize(t);
            }
            parseUrl(t) {
                try {
                    return this.urlSerializer.parse(t);
                } catch {
                    return this.urlSerializer.parse("/");
                }
            }
            isActive(t, r) {
                let i;
                if (
                    (r === !0
                        ? (i = E({}, cO))
                        : r === !1
                          ? (i = E({}, uO))
                          : (i = r),
                    Zi(t))
                )
                    return Kv(this.currentUrlTree, t, i);
                let o = this.parseUrl(t);
                return Kv(this.currentUrlTree, o, i);
            }
            removeEmptyProps(t) {
                return Object.entries(t).reduce(
                    (r, [i, o]) => (o != null && (r[i] = o), r),
                    {}
                );
            }
            scheduleNavigation(t, r, i, o, s) {
                if (this.disposed) return Promise.resolve(!1);
                let a, l, c;
                s
                    ? ((a = s.resolve), (l = s.reject), (c = s.promise))
                    : (c = new Promise((d, p) => {
                          ((a = d), (l = p));
                      }));
                let u = this.pendingTasks.add();
                return (
                    Fp(this, () => {
                        queueMicrotask(() => this.pendingTasks.remove(u));
                    }),
                    this.navigationTransitions.handleNavigationRequest({
                        source: r,
                        restoredState: i,
                        currentUrlTree: this.currentUrlTree,
                        currentRawUrl: this.currentUrlTree,
                        rawUrl: t,
                        extras: o,
                        resolve: a,
                        reject: l,
                        promise: c,
                        currentSnapshot: this.routerState.snapshot,
                        currentRouterState: this.routerState,
                    }),
                    c.catch((d) => Promise.reject(d))
                );
            }
            static ɵfac = function (r) {
                return new (r || e)();
            };
            static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" });
        }
        return e;
    })();
function dO(e) {
    for (let n = 0; n < e.length; n++) if (e[n] == null) throw new S(4008, !1);
}
function fO(e) {
    return !(e instanceof ys) && !(e instanceof Xi);
}
var Ts = class {};
var A0 = (() => {
        class e {
            router;
            injector;
            preloadingStrategy;
            loader;
            subscription;
            constructor(t, r, i, o) {
                ((this.router = t),
                    (this.injector = r),
                    (this.preloadingStrategy = i),
                    (this.loader = o));
            }
            setUpPreloading() {
                this.subscription = this.router.events
                    .pipe(
                        yt((t) => t instanceof bn),
                        Zn(() => this.preload())
                    )
                    .subscribe(() => {});
            }
            preload() {
                return this.processRoutes(this.injector, this.router.config);
            }
            ngOnDestroy() {
                this.subscription && this.subscription.unsubscribe();
            }
            processRoutes(t, r) {
                let i = [];
                for (let o of r) {
                    o.providers &&
                        !o._injector &&
                        (o._injector = zo(o.providers, t, `Route: ${o.path}`));
                    let s = o._injector ?? t,
                        a = o._loadedInjector ?? s;
                    (((o.loadChildren &&
                        !o._loadedRoutes &&
                        o.canLoad === void 0) ||
                        (o.loadComponent && !o._loadedComponent)) &&
                        i.push(this.preloadConfig(s, o)),
                        (o.children || o._loadedRoutes) &&
                            i.push(
                                this.processRoutes(
                                    a,
                                    o.children ?? o._loadedRoutes
                                )
                            ));
                }
                return Ee(i).pipe(ai());
            }
            preloadConfig(t, r) {
                return this.preloadingStrategy.preload(r, () => {
                    let i;
                    r.loadChildren && r.canLoad === void 0
                        ? (i = this.loader.loadChildren(t, r))
                        : (i = k(null));
                    let o = i.pipe(
                        we((s) =>
                            s === null
                                ? k(void 0)
                                : ((r._loadedRoutes = s.routes),
                                  (r._loadedInjector = s.injector),
                                  this.processRoutes(s.injector ?? t, s.routes))
                        )
                    );
                    if (r.loadComponent && !r._loadedComponent) {
                        let s = this.loader.loadComponent(r);
                        return Ee([o, s]).pipe(ai());
                    } else return o;
                });
            }
            static ɵfac = function (r) {
                return new (r || e)(N(zr), N(at), N(Ts), N(Ql));
            };
            static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" });
        }
        return e;
    })(),
    R0 = new O(""),
    pO = (() => {
        class e {
            urlSerializer;
            transitions;
            viewportScroller;
            zone;
            options;
            routerEventsSubscription;
            scrollEventsSubscription;
            lastId = 0;
            lastSource = "imperative";
            restoredId = 0;
            store = {};
            constructor(t, r, i, o, s = {}) {
                ((this.urlSerializer = t),
                    (this.transitions = r),
                    (this.viewportScroller = i),
                    (this.zone = o),
                    (this.options = s),
                    (s.scrollPositionRestoration ||= "disabled"),
                    (s.anchorScrolling ||= "disabled"));
            }
            init() {
                (this.options.scrollPositionRestoration !== "disabled" &&
                    this.viewportScroller.setHistoryScrollRestoration("manual"),
                    (this.routerEventsSubscription = this.createScrollEvents()),
                    (this.scrollEventsSubscription =
                        this.consumeScrollEvents()));
            }
            createScrollEvents() {
                return this.transitions.events.subscribe((t) => {
                    t instanceof Ur
                        ? ((this.store[this.lastId] =
                              this.viewportScroller.getScrollPosition()),
                          (this.lastSource = t.navigationTrigger),
                          (this.restoredId = t.restoredState
                              ? t.restoredState.navigationId
                              : 0))
                        : t instanceof bn
                          ? ((this.lastId = t.id),
                            this.scheduleScrollEvent(
                                t,
                                this.urlSerializer.parse(t.urlAfterRedirects)
                                    .fragment
                            ))
                          : t instanceof Gn &&
                            t.code === gs.IgnoredSameUrlNavigation &&
                            ((this.lastSource = void 0),
                            (this.restoredId = 0),
                            this.scheduleScrollEvent(
                                t,
                                this.urlSerializer.parse(t.url).fragment
                            ));
                });
            }
            consumeScrollEvents() {
                return this.transitions.events.subscribe((t) => {
                    t instanceof _s &&
                        (t.position
                            ? this.options.scrollPositionRestoration === "top"
                                ? this.viewportScroller.scrollToPosition([0, 0])
                                : this.options.scrollPositionRestoration ===
                                      "enabled" &&
                                  this.viewportScroller.scrollToPosition(
                                      t.position
                                  )
                            : t.anchor &&
                                this.options.anchorScrolling === "enabled"
                              ? this.viewportScroller.scrollToAnchor(t.anchor)
                              : this.options.scrollPositionRestoration !==
                                    "disabled" &&
                                this.viewportScroller.scrollToPosition([0, 0]));
                });
            }
            scheduleScrollEvent(t, r) {
                this.zone.runOutsideAngular(() => {
                    setTimeout(() => {
                        this.zone.run(() => {
                            this.transitions.events.next(
                                new _s(
                                    t,
                                    this.lastSource === "popstate"
                                        ? this.store[this.restoredId]
                                        : null,
                                    r
                                )
                            );
                        });
                    }, 0);
                });
            }
            ngOnDestroy() {
                (this.routerEventsSubscription?.unsubscribe(),
                    this.scrollEventsSubscription?.unsubscribe());
            }
            static ɵfac = function (r) {
                py();
            };
            static ɵprov = w({ token: e, factory: e.ɵfac });
        }
        return e;
    })();
function hO(e) {
    return e.routerState.root;
}
function xs(e, n) {
    return { ɵkind: e, ɵproviders: n };
}
function gO() {
    let e = y(We);
    return (n) => {
        let t = e.get(nr);
        if (n !== t.components[0]) return;
        let r = e.get(zr),
            i = e.get(k0);
        (e.get(Vp) === 1 && r.initialNavigation(),
            e.get($0, null, B.Optional)?.setUpPreloading(),
            e.get(R0, null, B.Optional)?.init(),
            r.resetRootComponentType(t.componentTypes[0]),
            i.closed || (i.next(), i.complete(), i.unsubscribe()));
    };
}
var k0 = new O("", { factory: () => new Te() }),
    Vp = new O("", { providedIn: "root", factory: () => 1 });
function L0() {
    let e = [
        { provide: Vp, useValue: 0 },
        Go(() => {
            let n = y(We);
            return n.get(Pf, Promise.resolve()).then(
                () =>
                    new Promise((r) => {
                        let i = n.get(zr),
                            o = n.get(k0);
                        (Fp(i, () => {
                            r(!0);
                        }),
                            (n.get(Zl).afterPreactivation = () => (
                                r(!0),
                                o.closed ? k(void 0) : o
                            )),
                            i.initialNavigation());
                    })
            );
        }),
    ];
    return xs(2, e);
}
function F0() {
    let e = [
        Go(() => {
            y(zr).setUpLocationChangeListener();
        }),
        { provide: Vp, useValue: 2 },
    ];
    return xs(3, e);
}
var $0 = new O("");
function V0(e) {
    return xs(0, [
        { provide: $0, useExisting: A0 },
        { provide: Ts, useExisting: e },
    ]);
}
function j0() {
    return xs(8, [Pp, { provide: Ds, useExisting: Pp }]);
}
function B0(e) {
    Ri("NgRouterViewTransitions");
    let n = [
        { provide: Rp, useValue: P0 },
        {
            provide: kp,
            useValue: E({ skipNextTransition: !!e?.skipInitialTransition }, e),
        },
    ];
    return xs(9, n);
}
var U0 = [
        sr,
        { provide: eo, useClass: Br },
        zr,
        to,
        { provide: Hr, useFactory: hO, deps: [zr] },
        Ql,
        [],
    ],
    Xl = (() => {
        class e {
            constructor() {}
            static forRoot(t, r) {
                return {
                    ngModule: e,
                    providers: [
                        U0,
                        [],
                        { provide: Is, multi: !0, useValue: t },
                        [],
                        r?.errorHandler
                            ? { provide: Lp, useValue: r.errorHandler }
                            : [],
                        { provide: ro, useValue: r || {} },
                        r?.useHash ? _O() : yO(),
                        mO(),
                        r?.preloadingStrategy
                            ? V0(r.preloadingStrategy).ɵproviders
                            : [],
                        r?.initialNavigation ? vO(r) : [],
                        r?.bindToComponentInputs ? j0().ɵproviders : [],
                        r?.enableViewTransitions ? B0().ɵproviders : [],
                        bO(),
                    ],
                };
            }
            static forChild(t) {
                return {
                    ngModule: e,
                    providers: [{ provide: Is, multi: !0, useValue: t }],
                };
            }
            static ɵfac = function (r) {
                return new (r || e)();
            };
            static ɵmod = ge({ type: e });
            static ɵinj = he({});
        }
        return e;
    })();
function mO() {
    return {
        provide: R0,
        useFactory: () => {
            let e = y(_v),
                n = y(ne),
                t = y(ro),
                r = y(Zl),
                i = y(eo);
            return (
                t.scrollOffset && e.setOffset(t.scrollOffset),
                new pO(i, r, e, n, t)
            );
        },
    };
}
function _O() {
    return { provide: Bn, useClass: Af };
}
function yO() {
    return { provide: Bn, useClass: yl };
}
function vO(e) {
    return [
        e.initialNavigation === "disabled" ? F0().ɵproviders : [],
        e.initialNavigation === "enabledBlocking" ? L0().ɵproviders : [],
    ];
}
var $p = new O("");
function bO() {
    return [
        { provide: $p, useFactory: gO },
        { provide: _f, multi: !0, useExisting: $p },
    ];
}
var EO = [],
    H0 = (() => {
        class e {
            static {
                this.ɵfac = function (r) {
                    return new (r || e)();
                };
            }
            static {
                this.ɵmod = ge({ type: e });
            }
            static {
                this.ɵinj = he({ imports: [Xl.forRoot(EO), Xl] });
            }
        }
        return e;
    })();
var z0 = "769f737";
var SO = ["*"],
    io = (() => {
        class e {
            constructor() {
                ((this.target = "_blank"), (this.rel = "noopener noreferrer"));
            }
            static {
                this.ɵfac = function (r) {
                    return new (r || e)();
                };
            }
            static {
                this.ɵcmp = R({
                    type: e,
                    selectors: [["app-external-link"]],
                    inputs: {
                        href: "href",
                        target: "target",
                        rel: "rel",
                        ariaLabel: "ariaLabel",
                    },
                    standalone: !1,
                    ngContentSelectors: SO,
                    decls: 5,
                    vars: 4,
                    consts: [
                        [3, "href", "target", "rel"],
                        [
                            "xmlns",
                            "http://www.w3.org/2000/svg",
                            "viewBox",
                            "0 0 640 640",
                            "fill",
                            "currentColor",
                            "aria-hidden",
                            "true",
                            1,
                            "icon",
                        ],
                        [
                            "d",
                            "M384 64C366.3 64 352 78.3 352 96C352 113.7 366.3 128 384 128L466.7 128L265.3 329.4C252.8 341.9 252.8 362.2 265.3 374.7C277.8 387.2 298.1 387.2 310.6 374.7L512 173.3L512 256C512 273.7 526.3 288 544 288C561.7 288 576 273.7 576 256L576 96C576 78.3 561.7 64 544 64L384 64zM144 160C99.8 160 64 195.8 64 240L64 496C64 540.2 99.8 576 144 576L400 576C444.2 576 480 540.2 480 496L480 416C480 398.3 465.7 384 448 384C430.3 384 416 398.3 416 416L416 496C416 504.8 408.8 512 400 512L144 512C135.2 512 128 504.8 128 496L128 240C128 231.2 135.2 224 144 224L224 224C241.7 224 256 209.7 256 192C256 174.3 241.7 160 224 160L144 160z",
                        ],
                    ],
                    template: function (r, i) {
                        (r & 1 &&
                            (Ct(),
                            m(0, "a", 0)(1, "span"),
                            Ge(2),
                            g(),
                            pn(),
                            m(3, "svg", 1),
                            D(4, "path", 2),
                            g()()),
                            r & 2 &&
                                (b("href", i.href, O_)("target", i.target)(
                                    "rel",
                                    i.rel
                                ),
                                se(
                                    "aria-label",
                                    i.ariaLabel
                                        ? i.ariaLabel + " - lien externe"
                                        : "Lien externe"
                                )));
                    },
                    styles: [
                        "a[_ngcontent-%COMP%]{display:inline;text-decoration:none;color:inherit}a[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{text-decoration:none}a[_ngcontent-%COMP%]   svg.icon[_ngcontent-%COMP%]{width:.875em;height:.875em;margin-left:.3em;display:inline-block;vertical-align:middle}a[_ngcontent-%COMP%]:hover   span[_ngcontent-%COMP%]{text-decoration:underline}",
                    ],
                });
            }
        }
        return e;
    })();
var Jl = (() => {
    class e {
        static {
            this.ɵfac = function (r) {
                return new (r || e)();
            };
        }
        static {
            this.ɵcmp = R({
                type: e,
                selectors: [["app-rainbow-line"]],
                standalone: !1,
                decls: 1,
                vars: 0,
                consts: [
                    [
                        "role",
                        "presentation",
                        "aria-hidden",
                        "true",
                        1,
                        "rainbow-line",
                    ],
                ],
                template: function (r, i) {
                    r & 1 && D(0, "div", 0);
                },
                styles: [
                    "app-dialog[_ngcontent-%COMP%]{display:flex;flex-direction:row;flex-wrap:wrap;min-width:fit-content;align-items:flex-start;align-content:flex-start;margin-top:.2rem}app-dialog[_ngcontent-%COMP%]   app-button[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{display:flex;flex-direction:row;flex-wrap:nowrap;width:fit-content;min-height:1rem;height:fit-content;font-weight:700;font-size:.6rem;margin-left:.5rem;margin-right:.5rem;margin-top:auto;margin-bottom:auto;padding:.15rem .55rem}.p-dialog.p-component[_ngcontent-%COMP%]{background-color:#fff;position:absolute;border:.5rem solid;border-radius:0;border-color:#ff9671 #ff6f91 #ff6f91 #ff9671;width:min(95vw,600px);background:#fffc;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);padding:1rem;--p-button-text-secondary-color: #5e3f9e}.p-dialog[_ngcontent-%COMP%]   .p-dialog-header[_ngcontent-%COMP%]{display:flex;flex-direction:row;flex-wrap:wrap;align-content:flex-start;align-items:flex-start!important;text-transform:uppercase;padding:2rem}.p-dialog[_ngcontent-%COMP%]   .p-dialog-close-button[_ngcontent-%COMP%]{background-color:transparent;color:#5e3f9e;font-weight:800;border:none;width:1rem;height:1rem;cursor:pointer;transform-origin:center center}.p-dialog[_ngcontent-%COMP%]   .p-dialog-close-button[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%]{display:block;transform-origin:center center}.p-dialog[_ngcontent-%COMP%]   .p-dialog-close-button[_ngcontent-%COMP%]:hover{animation:_ngcontent-%COMP%_spin-rainbow .4s ease-in-out,_ngcontent-%COMP%_rainbow-icon .4s linear normal}.p-dialog[_ngcontent-%COMP%]   .p-dialog-maximize-button[_ngcontent-%COMP%]:hover{animation:_ngcontent-%COMP%_rainbow-icon .4s linear normal,_ngcontent-%COMP%_grow-icon .4s ease-in-out}.p-dialog[_ngcontent-%COMP%]   .p-dialog-header-actions[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.5rem}@keyframes _ngcontent-%COMP%_spin-rainbow{0%{transform:rotate(0)}to{transform:rotate(360deg)}}@keyframes _ngcontent-%COMP%_grow-icon{0%{transform:scale(1)}50%{transform:scale(1.2)}to{transform:scale(1)}}@keyframes _ngcontent-%COMP%_rainbow-icon{0%{filter:hue-rotate(0deg) saturate(3)}to{filter:hue-rotate(360deg) saturate(3)}}.p-dialog[_ngcontent-%COMP%]   .p-dialog-content[_ngcontent-%COMP%]{padding:1rem 2rem}.p-dialog[_ngcontent-%COMP%]   .p-dialog-footer[_ngcontent-%COMP%]{padding:2rem;display:flex;flex-direction:row;flex-wrap:wrap;justify-content:flex-end}*[_ngcontent-%COMP%]{margin:0;padding:0;box-sizing:border-box}html[_ngcontent-%COMP%]{font-family:Lexend,sans-serif;font-weight:300;font-size:16px;margin:unset;padding:unset;box-sizing:border-box;color:#070f13}html[_ngcontent-%COMP%]   section[_ngcontent-%COMP%]{margin-bottom:2rem!important}html[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{color:unset;text-decoration:underline;text-underline-offset:.2rem;text-decoration-thickness:.05rem}html[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover{text-decoration-thickness:.1rem}html[_ngcontent-%COMP%]   em[_ngcontent-%COMP%]{color:#5e3f9e;font-style:normal}html[_ngcontent-%COMP%]   em[_ngcontent-%COMP%]:hover{color:#4a3080}html[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{font-weight:600;color:#5e3f9e}html[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]{font-size:.8rem;font-weight:600;color:#5e3f9e}html[_ngcontent-%COMP%]   .colored[_ngcontent-%COMP%]{color:#5e3f9e}html[_ngcontent-%COMP%]   .secondary[_ngcontent-%COMP%]{color:#d65db1}html[_ngcontent-%COMP%]   .secondary-decorative[_ngcontent-%COMP%]{color:#ff9671}html[_ngcontent-%COMP%]   .italic[_ngcontent-%COMP%]{font-style:italic}html[_ngcontent-%COMP%]   .small[_ngcontent-%COMP%]{font-size:.8rem}@media screen and (min-width: 1600px){html[_ngcontent-%COMP%]{font-size:1.2rem}}@media screen and (max-width: 1200px){html[_ngcontent-%COMP%]{font-size:1rem}}@media screen and (max-width: 1000px){html[_ngcontent-%COMP%]{font-size:.9rem}}@media screen and (max-width: 700px){html[_ngcontent-%COMP%]{font-size:.8rem}}@media screen and (max-width: 400px){html[_ngcontent-%COMP%]{font-size:.7rem}}.rainbow-line[_ngcontent-%COMP%]{height:4px;background:linear-gradient(to right,#845ec2,#d65db1,#ff6f91,#ff9671,#ffc75f,#f9f871)}",
                ],
            });
        }
    }
    return e;
})();
var wO = { fr: 4200, en: 4201 },
    q0 = (() => {
        class e {
            constructor(t) {
                this.locale = t;
            }
            switchLocale(t) {
                if (t === this.locale) return;
                let r = new URL(window.location.href);
                (r.hostname === "localhost"
                    ? ((r.port = String(wO[t] ?? 4200)), (r.pathname = "/"))
                    : (r.pathname = r.pathname.replace(
                          new RegExp(`/${this.locale}(/|$)`),
                          `/${t}/`
                      )),
                    (window.location.href = r.toString()));
            }
            static {
                this.ɵfac = function (r) {
                    return new (r || e)(Se(Qo));
                };
            }
            static {
                this.ɵcmp = R({
                    type: e,
                    selectors: [["app-header"]],
                    standalone: !1,
                    decls: 40,
                    vars: 8,
                    consts: [
                        [1, "bg-container"],
                        [
                            "role",
                            "group",
                            "aria-label",
                            "Language switcher",
                            1,
                            "lang-switcher",
                        ],
                        [1, "lang-btn", 3, "click"],
                        [1, "btn-label"],
                        [1, "parent"],
                        [1, "picture-container"],
                        [
                            "src",
                            "assets/images/photo.webp",
                            "alt",
                            "portrait",
                            1,
                            "picture",
                        ],
                        [1, "content"],
                        [1, "title"],
                        [1, "items"],
                        [1, "item"],
                        [
                            "src",
                            "assets/icons/map-pin.svg",
                            "alt",
                            "",
                            "aria-hidden",
                            "true",
                            1,
                            "icon",
                        ],
                        [
                            "src",
                            "assets/icons/bus.svg",
                            "alt",
                            "",
                            "aria-hidden",
                            "true",
                            1,
                            "icon",
                        ],
                        [
                            "src",
                            "assets/icons/linkedin.svg",
                            "alt",
                            "",
                            "aria-hidden",
                            "true",
                            1,
                            "icon",
                        ],
                        [3, "href"],
                        [
                            "src",
                            "assets/icons/github.svg",
                            "alt",
                            "",
                            "aria-hidden",
                            "true",
                            1,
                            "icon",
                        ],
                        [
                            "src",
                            "assets/icons/comments.svg",
                            "alt",
                            "",
                            "aria-hidden",
                            "true",
                            1,
                            "icon",
                        ],
                        [
                            "src",
                            "assets/icons/code.svg",
                            "alt",
                            "",
                            "aria-hidden",
                            "true",
                            1,
                            "icon",
                        ],
                    ],
                    template: function (r, i) {
                        (r & 1 &&
                            (m(0, "div", 0)(1, "div", 1)(2, "button", 2),
                            qe("click", function () {
                                return i.switchLocale("fr");
                            }),
                            m(3, "span", 3),
                            C(4, "FR"),
                            g()(),
                            m(5, "button", 2),
                            qe("click", function () {
                                return i.switchLocale("en");
                            }),
                            m(6, "span", 3),
                            C(7, "EN"),
                            g()()(),
                            m(8, "div", 4)(9, "div", 5),
                            D(10, "img", 6),
                            g(),
                            m(11, "div", 7)(12, "h1", 8),
                            C(13, "Myriam Mira"),
                            g(),
                            m(14, "div", 9)(15, "span", 10),
                            D(16, "img", 11),
                            m(17, "span"),
                            C(18, "Bas\xE9e en \xCEle-de-France"),
                            g()(),
                            m(19, "span", 10),
                            D(20, "img", 12),
                            m(21, "span"),
                            C(22, "Permis B | v\xE9lo"),
                            g()(),
                            m(23, "span", 10),
                            D(24, "img", 13),
                            m(25, "app-external-link", 14),
                            C(26, "LinkedIn"),
                            g()(),
                            m(27, "span", 10),
                            D(28, "img", 15),
                            m(29, "app-external-link", 14),
                            C(30, "GitHub"),
                            g()(),
                            m(31, "span", 10),
                            D(32, "img", 16),
                            m(33, "span"),
                            C(34, "Bilingue anglais / fran\xE7ais"),
                            g()(),
                            m(35, "span", 10),
                            D(36, "img", 17),
                            m(37, "span"),
                            C(38, "Sp\xE9cialit\xE9 front-end"),
                            g()()()()(),
                            D(39, "app-rainbow-line"),
                            g()),
                            r & 2 &&
                                (v(2),
                                Yo("active", i.locale === "fr"),
                                se(
                                    "aria-current",
                                    i.locale === "fr" ? "true" : null
                                ),
                                v(3),
                                Yo("active", i.locale === "en"),
                                se(
                                    "aria-current",
                                    i.locale === "en" ? "true" : null
                                ),
                                v(20),
                                b(
                                    "href",
                                    "https://www.linkedin.com/in/myriam-mira/"
                                ),
                                v(4),
                                b("href", "https://github.com/myracodes")));
                    },
                    dependencies: [io, Jl],
                    styles: [
                        'app-dialog[_ngcontent-%COMP%]{display:flex;flex-direction:row;flex-wrap:wrap;min-width:fit-content;align-items:flex-start;align-content:flex-start;margin-top:.2rem}app-dialog[_ngcontent-%COMP%]   app-button[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{display:flex;flex-direction:row;flex-wrap:nowrap;width:fit-content;min-height:1rem;height:fit-content;font-weight:700;font-size:.6rem;margin-left:.5rem;margin-right:.5rem;margin-top:auto;margin-bottom:auto;padding:.15rem .55rem}.p-dialog.p-component[_ngcontent-%COMP%]{background-color:#fff;position:absolute;border:.5rem solid;border-radius:0;border-color:#ff9671 #ff6f91 #ff6f91 #ff9671;width:min(95vw,600px);background:#fffc;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);padding:1rem;--p-button-text-secondary-color: #5e3f9e}.p-dialog[_ngcontent-%COMP%]   .p-dialog-header[_ngcontent-%COMP%]{display:flex;flex-direction:row;flex-wrap:wrap;align-content:flex-start;align-items:flex-start!important;text-transform:uppercase;padding:2rem}.p-dialog[_ngcontent-%COMP%]   .p-dialog-close-button[_ngcontent-%COMP%]{background-color:transparent;color:#5e3f9e;font-weight:800;border:none;width:1rem;height:1rem;cursor:pointer;transform-origin:center center}.p-dialog[_ngcontent-%COMP%]   .p-dialog-close-button[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%]{display:block;transform-origin:center center}.p-dialog[_ngcontent-%COMP%]   .p-dialog-close-button[_ngcontent-%COMP%]:hover{animation:_ngcontent-%COMP%_spin-rainbow .4s ease-in-out,_ngcontent-%COMP%_rainbow-icon .4s linear normal}.p-dialog[_ngcontent-%COMP%]   .p-dialog-maximize-button[_ngcontent-%COMP%]:hover{animation:_ngcontent-%COMP%_rainbow-icon .4s linear normal,_ngcontent-%COMP%_grow-icon .4s ease-in-out}.p-dialog[_ngcontent-%COMP%]   .p-dialog-header-actions[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.5rem}@keyframes _ngcontent-%COMP%_spin-rainbow{0%{transform:rotate(0)}to{transform:rotate(360deg)}}@keyframes _ngcontent-%COMP%_grow-icon{0%{transform:scale(1)}50%{transform:scale(1.2)}to{transform:scale(1)}}@keyframes _ngcontent-%COMP%_rainbow-icon{0%{filter:hue-rotate(0deg) saturate(3)}to{filter:hue-rotate(360deg) saturate(3)}}.p-dialog[_ngcontent-%COMP%]   .p-dialog-content[_ngcontent-%COMP%]{padding:1rem 2rem}.p-dialog[_ngcontent-%COMP%]   .p-dialog-footer[_ngcontent-%COMP%]{padding:2rem;display:flex;flex-direction:row;flex-wrap:wrap;justify-content:flex-end}*[_ngcontent-%COMP%]{margin:0;padding:0;box-sizing:border-box}html[_ngcontent-%COMP%]{font-family:Lexend,sans-serif;font-weight:300;font-size:16px;margin:unset;padding:unset;box-sizing:border-box;color:#070f13}html[_ngcontent-%COMP%]   section[_ngcontent-%COMP%]{margin-bottom:2rem!important}html[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{color:unset;text-decoration:underline;text-underline-offset:.2rem;text-decoration-thickness:.05rem}html[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover{text-decoration-thickness:.1rem}html[_ngcontent-%COMP%]   em[_ngcontent-%COMP%]{color:#5e3f9e;font-style:normal}html[_ngcontent-%COMP%]   em[_ngcontent-%COMP%]:hover{color:#4a3080}html[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{font-weight:600;color:#5e3f9e}html[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]{font-size:.8rem;font-weight:600;color:#5e3f9e}html[_ngcontent-%COMP%]   .colored[_ngcontent-%COMP%]{color:#5e3f9e}html[_ngcontent-%COMP%]   .secondary[_ngcontent-%COMP%]{color:#d65db1}html[_ngcontent-%COMP%]   .secondary-decorative[_ngcontent-%COMP%]{color:#ff9671}html[_ngcontent-%COMP%]   .italic[_ngcontent-%COMP%]{font-style:italic}html[_ngcontent-%COMP%]   .small[_ngcontent-%COMP%]{font-size:.8rem}@media screen and (min-width: 1600px){html[_ngcontent-%COMP%]{font-size:1.2rem}}@media screen and (max-width: 1200px){html[_ngcontent-%COMP%]{font-size:1rem}}@media screen and (max-width: 1000px){html[_ngcontent-%COMP%]{font-size:.9rem}}@media screen and (max-width: 700px){html[_ngcontent-%COMP%]{font-size:.8rem}}@media screen and (max-width: 400px){html[_ngcontent-%COMP%]{font-size:.7rem}}.bg-container[_ngcontent-%COMP%]{background-color:#5e3f9e;margin-bottom:40px;position:relative}.lang-switcher[_ngcontent-%COMP%]{position:absolute;top:12px;right:16px;display:flex;gap:6px}.lang-btn[_ngcontent-%COMP%]{position:relative;overflow:hidden;background-color:transparent;color:#fafafa;border-bottom:2px solid #fafafa;border-right:2px solid #fafafa;border-top:2px solid #ffc75f;border-left:2px solid #ffc75f;border-radius:0;font-size:.65rem;font-weight:600;font-family:inherit;letter-spacing:.05em;padding:.25rem .9rem;cursor:pointer;transition:color .2s ease,border-top-color .5s ease,border-left-color .5s ease .1s}.lang-btn[_ngcontent-%COMP%]   .btn-label[_ngcontent-%COMP%]{position:relative;z-index:1}.lang-btn[_ngcontent-%COMP%]:before{content:"";position:absolute;top:0;left:0;bottom:0;width:200%;z-index:0;background:linear-gradient(to right,#f9f871,#ffc75f,#ff9671,#ff6f91,#d65db1 40%,#5e3f9e 50% 100%);transform:translate(100%);transition:transform .6s ease}.lang-btn.active[_ngcontent-%COMP%]{background-color:#fafafa;color:#5e3f9e;border-color:#fafafa;font-weight:700;cursor:default}.lang-btn[_ngcontent-%COMP%]:not(.active):hover{color:#fafafa;border-color:#fafafa;transition:color .3s ease .3s,border-top-color .5s ease,border-left-color .5s ease .1s}.lang-btn[_ngcontent-%COMP%]:not(.active):hover:before{transform:translate(calc(-50% + 1px))}.parent[_ngcontent-%COMP%]{color:#fafafa;display:flex;flex-direction:row;align-items:center;justify-content:center;padding:30px 50px;max-width:1000px;min-height:fit-content;margin:auto}.parent[_ngcontent-%COMP%]   .picture-container[_ngcontent-%COMP%]{order:1;border:3px solid #fafafa;overflow:hidden;border-radius:9999px;margin-left:auto;margin-right:auto;width:8.5rem;height:8.5rem;transition:all .3s ease-in;display:flex;flex-direction:row;align-items:center;justify-content:center}.parent[_ngcontent-%COMP%]   .picture[_ngcontent-%COMP%]{width:9rem;height:9rem;border-radius:9999px;margin:25px;transition:all .3s ease-in;display:flex;flex-direction:row;align-items:center;justify-content:center}.parent[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{font-size:2rem;font-weight:700;margin:0 auto 2rem}.parent[_ngcontent-%COMP%]   .content[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:center;justify-content:center;width:70%;order:2}.parent[_ngcontent-%COMP%]   .content[_ngcontent-%COMP%]   .items[_ngcontent-%COMP%]{display:grid;column-gap:40px;max-width:600px;margin-left:auto;margin-right:auto;grid-template-columns:repeat(2,1fr);grid-template-rows:repeat(3,1fr)}.parent[_ngcontent-%COMP%]   .content[_ngcontent-%COMP%]   .items[_ngcontent-%COMP%]   .item[_ngcontent-%COMP%]{display:flex;flex-direction:row;align-items:center;margin-top:5px;margin-bottom:5px;text-decoration-color:#fafafa}.parent[_ngcontent-%COMP%]   .content[_ngcontent-%COMP%]   .items[_ngcontent-%COMP%]   img.icon[_ngcontent-%COMP%]{width:20px;margin-right:15px}@media screen and (max-width: 1000px){.parent[_ngcontent-%COMP%]   .content[_ngcontent-%COMP%]{width:210px;margin-left:auto;margin-right:auto;order:1}.parent[_ngcontent-%COMP%]   .content[_ngcontent-%COMP%]   .items[_ngcontent-%COMP%]{margin-left:unset;grid-template-columns:repeat(1,1fr);grid-template-rows:repeat(5,1fr)}.parent[_ngcontent-%COMP%]   .picture-container[_ngcontent-%COMP%]{order:2}}@media screen and (max-width: 400px){.parent[_ngcontent-%COMP%]   .picture-container[_ngcontent-%COMP%]{display:none}}',
                    ],
                });
            }
        }
        return e;
    })();
var Cn = (() => {
    class e {
        static {
            this.ɵfac = function (r) {
                return new (r || e)();
            };
        }
        static {
            this.ɵcmp = R({
                type: e,
                selectors: [["app-title"]],
                inputs: { title: "title" },
                standalone: !1,
                decls: 2,
                vars: 1,
                template: function (r, i) {
                    (r & 1 && (m(0, "h2"), C(1), g()),
                        r & 2 && (v(), Ce(i.title)));
                },
                styles: [
                    "app-dialog[_ngcontent-%COMP%]{display:flex;flex-direction:row;flex-wrap:wrap;min-width:fit-content;align-items:flex-start;align-content:flex-start;margin-top:.2rem}app-dialog[_ngcontent-%COMP%]   app-button[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{display:flex;flex-direction:row;flex-wrap:nowrap;width:fit-content;min-height:1rem;height:fit-content;font-weight:700;font-size:.6rem;margin-left:.5rem;margin-right:.5rem;margin-top:auto;margin-bottom:auto;padding:.15rem .55rem}.p-dialog.p-component[_ngcontent-%COMP%]{background-color:#fff;position:absolute;border:.5rem solid;border-radius:0;border-color:#ff9671 #ff6f91 #ff6f91 #ff9671;width:min(95vw,600px);background:#fffc;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);padding:1rem;--p-button-text-secondary-color: #5e3f9e}.p-dialog[_ngcontent-%COMP%]   .p-dialog-header[_ngcontent-%COMP%]{display:flex;flex-direction:row;flex-wrap:wrap;align-content:flex-start;align-items:flex-start!important;text-transform:uppercase;padding:2rem}.p-dialog[_ngcontent-%COMP%]   .p-dialog-close-button[_ngcontent-%COMP%]{background-color:transparent;color:#5e3f9e;font-weight:800;border:none;width:1rem;height:1rem;cursor:pointer;transform-origin:center center}.p-dialog[_ngcontent-%COMP%]   .p-dialog-close-button[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%]{display:block;transform-origin:center center}.p-dialog[_ngcontent-%COMP%]   .p-dialog-close-button[_ngcontent-%COMP%]:hover{animation:_ngcontent-%COMP%_spin-rainbow .4s ease-in-out,_ngcontent-%COMP%_rainbow-icon .4s linear normal}.p-dialog[_ngcontent-%COMP%]   .p-dialog-maximize-button[_ngcontent-%COMP%]:hover{animation:_ngcontent-%COMP%_rainbow-icon .4s linear normal,_ngcontent-%COMP%_grow-icon .4s ease-in-out}.p-dialog[_ngcontent-%COMP%]   .p-dialog-header-actions[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.5rem}@keyframes _ngcontent-%COMP%_spin-rainbow{0%{transform:rotate(0)}to{transform:rotate(360deg)}}@keyframes _ngcontent-%COMP%_grow-icon{0%{transform:scale(1)}50%{transform:scale(1.2)}to{transform:scale(1)}}@keyframes _ngcontent-%COMP%_rainbow-icon{0%{filter:hue-rotate(0deg) saturate(3)}to{filter:hue-rotate(360deg) saturate(3)}}.p-dialog[_ngcontent-%COMP%]   .p-dialog-content[_ngcontent-%COMP%]{padding:1rem 2rem}.p-dialog[_ngcontent-%COMP%]   .p-dialog-footer[_ngcontent-%COMP%]{padding:2rem;display:flex;flex-direction:row;flex-wrap:wrap;justify-content:flex-end}*[_ngcontent-%COMP%]{margin:0;padding:0;box-sizing:border-box}html[_ngcontent-%COMP%]{font-family:Lexend,sans-serif;font-weight:300;font-size:16px;margin:unset;padding:unset;box-sizing:border-box;color:#070f13}html[_ngcontent-%COMP%]   section[_ngcontent-%COMP%]{margin-bottom:2rem!important}html[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{color:unset;text-decoration:underline;text-underline-offset:.2rem;text-decoration-thickness:.05rem}html[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover{text-decoration-thickness:.1rem}html[_ngcontent-%COMP%]   em[_ngcontent-%COMP%]{color:#5e3f9e;font-style:normal}html[_ngcontent-%COMP%]   em[_ngcontent-%COMP%]:hover{color:#4a3080}html[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{font-weight:600;color:#5e3f9e}html[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]{font-size:.8rem;font-weight:600;color:#5e3f9e}html[_ngcontent-%COMP%]   .colored[_ngcontent-%COMP%]{color:#5e3f9e}html[_ngcontent-%COMP%]   .secondary[_ngcontent-%COMP%]{color:#d65db1}html[_ngcontent-%COMP%]   .secondary-decorative[_ngcontent-%COMP%]{color:#ff9671}html[_ngcontent-%COMP%]   .italic[_ngcontent-%COMP%]{font-style:italic}html[_ngcontent-%COMP%]   .small[_ngcontent-%COMP%]{font-size:.8rem}@media screen and (min-width: 1600px){html[_ngcontent-%COMP%]{font-size:1.2rem}}@media screen and (max-width: 1200px){html[_ngcontent-%COMP%]{font-size:1rem}}@media screen and (max-width: 1000px){html[_ngcontent-%COMP%]{font-size:.9rem}}@media screen and (max-width: 700px){html[_ngcontent-%COMP%]{font-size:.8rem}}@media screen and (max-width: 400px){html[_ngcontent-%COMP%]{font-size:.7rem}}h2[_ngcontent-%COMP%]{color:#5e3f9e;max-width:100%;width:max-content;padding-bottom:10px;padding-left:.75rem;border-left:3px solid #ff9671;border-bottom:2px solid #ffc75f;margin-bottom:20px;margin-left:1.5rem}",
                ],
            });
        }
    }
    return e;
})();
function G0(e, n) {
    let t = e.target,
        r = !1;
    do (t === n && (r = !0), (t = t.parentNode));
    while (t);
    return !r;
}
var F = (function (e) {
        return (
            (e[(e.State = 0)] = "State"),
            (e[(e.Transition = 1)] = "Transition"),
            (e[(e.Sequence = 2)] = "Sequence"),
            (e[(e.Group = 3)] = "Group"),
            (e[(e.Animate = 4)] = "Animate"),
            (e[(e.Keyframes = 5)] = "Keyframes"),
            (e[(e.Style = 6)] = "Style"),
            (e[(e.Trigger = 7)] = "Trigger"),
            (e[(e.Reference = 8)] = "Reference"),
            (e[(e.AnimateChild = 9)] = "AnimateChild"),
            (e[(e.AnimateRef = 10)] = "AnimateRef"),
            (e[(e.Query = 11)] = "Query"),
            (e[(e.Stagger = 12)] = "Stagger"),
            e
        );
    })(F || {}),
    jt = "*";
function Bp(e, n) {
    return { type: F.Trigger, name: e, definitions: n, options: {} };
}
function ec(e, n = null) {
    return { type: F.Animate, styles: n, timings: e };
}
function Y0(e, n = null) {
    return { type: F.Sequence, steps: e, options: n };
}
function qr(e) {
    return { type: F.Style, styles: e, offset: null };
}
function tc(e, n, t = null) {
    return { type: F.Transition, expr: e, animation: n, options: t };
}
function nc(e, n = null) {
    return { type: F.Reference, animation: e, options: n };
}
function rc(e, n = null) {
    return { type: F.AnimateRef, animation: e, options: n };
}
var En = class {
        _onDoneFns = [];
        _onStartFns = [];
        _onDestroyFns = [];
        _originalOnDoneFns = [];
        _originalOnStartFns = [];
        _started = !1;
        _destroyed = !1;
        _finished = !1;
        _position = 0;
        parentPlayer = null;
        totalTime;
        constructor(n = 0, t = 0) {
            this.totalTime = n + t;
        }
        _onFinish() {
            this._finished ||
                ((this._finished = !0),
                this._onDoneFns.forEach((n) => n()),
                (this._onDoneFns = []));
        }
        onStart(n) {
            (this._originalOnStartFns.push(n), this._onStartFns.push(n));
        }
        onDone(n) {
            (this._originalOnDoneFns.push(n), this._onDoneFns.push(n));
        }
        onDestroy(n) {
            this._onDestroyFns.push(n);
        }
        hasStarted() {
            return this._started;
        }
        init() {}
        play() {
            (this.hasStarted() || (this._onStart(), this.triggerMicrotask()),
                (this._started = !0));
        }
        triggerMicrotask() {
            queueMicrotask(() => this._onFinish());
        }
        _onStart() {
            (this._onStartFns.forEach((n) => n()), (this._onStartFns = []));
        }
        pause() {}
        restart() {}
        finish() {
            this._onFinish();
        }
        destroy() {
            this._destroyed ||
                ((this._destroyed = !0),
                this.hasStarted() || this._onStart(),
                this.finish(),
                this._onDestroyFns.forEach((n) => n()),
                (this._onDestroyFns = []));
        }
        reset() {
            ((this._started = !1),
                (this._finished = !1),
                (this._onStartFns = this._originalOnStartFns),
                (this._onDoneFns = this._originalOnDoneFns));
        }
        setPosition(n) {
            this._position = this.totalTime ? n * this.totalTime : 1;
        }
        getPosition() {
            return this.totalTime ? this._position / this.totalTime : 1;
        }
        triggerCallback(n) {
            let t = n == "start" ? this._onStartFns : this._onDoneFns;
            (t.forEach((r) => r()), (t.length = 0));
        }
    },
    Wr = class {
        _onDoneFns = [];
        _onStartFns = [];
        _finished = !1;
        _started = !1;
        _destroyed = !1;
        _onDestroyFns = [];
        parentPlayer = null;
        totalTime = 0;
        players;
        constructor(n) {
            this.players = n;
            let t = 0,
                r = 0,
                i = 0,
                o = this.players.length;
            (o == 0
                ? queueMicrotask(() => this._onFinish())
                : this.players.forEach((s) => {
                      (s.onDone(() => {
                          ++t == o && this._onFinish();
                      }),
                          s.onDestroy(() => {
                              ++r == o && this._onDestroy();
                          }),
                          s.onStart(() => {
                              ++i == o && this._onStart();
                          }));
                  }),
                (this.totalTime = this.players.reduce(
                    (s, a) => Math.max(s, a.totalTime),
                    0
                )));
        }
        _onFinish() {
            this._finished ||
                ((this._finished = !0),
                this._onDoneFns.forEach((n) => n()),
                (this._onDoneFns = []));
        }
        init() {
            this.players.forEach((n) => n.init());
        }
        onStart(n) {
            this._onStartFns.push(n);
        }
        _onStart() {
            this.hasStarted() ||
                ((this._started = !0),
                this._onStartFns.forEach((n) => n()),
                (this._onStartFns = []));
        }
        onDone(n) {
            this._onDoneFns.push(n);
        }
        onDestroy(n) {
            this._onDestroyFns.push(n);
        }
        hasStarted() {
            return this._started;
        }
        play() {
            (this.parentPlayer || this.init(),
                this._onStart(),
                this.players.forEach((n) => n.play()));
        }
        pause() {
            this.players.forEach((n) => n.pause());
        }
        restart() {
            this.players.forEach((n) => n.restart());
        }
        finish() {
            (this._onFinish(), this.players.forEach((n) => n.finish()));
        }
        destroy() {
            this._onDestroy();
        }
        _onDestroy() {
            this._destroyed ||
                ((this._destroyed = !0),
                this._onFinish(),
                this.players.forEach((n) => n.destroy()),
                this._onDestroyFns.forEach((n) => n()),
                (this._onDestroyFns = []));
        }
        reset() {
            (this.players.forEach((n) => n.reset()),
                (this._destroyed = !1),
                (this._finished = !1),
                (this._started = !1));
        }
        setPosition(n) {
            let t = n * this.totalTime;
            this.players.forEach((r) => {
                let i = r.totalTime ? Math.min(1, t / r.totalTime) : 1;
                r.setPosition(i);
            });
        }
        getPosition() {
            let n = this.players.reduce(
                (t, r) => (t === null || r.totalTime > t.totalTime ? r : t),
                null
            );
            return n != null ? n.getPosition() : 0;
        }
        beforeDestroy() {
            this.players.forEach((n) => {
                n.beforeDestroy && n.beforeDestroy();
            });
        }
        triggerCallback(n) {
            let t = n == "start" ? this._onStartFns : this._onDoneFns;
            (t.forEach((r) => r()), (t.length = 0));
        }
    },
    oo = "!";
var K0 = (() => {
        class e extends Ye {
            name = "common";
            static ɵfac = (() => {
                let t;
                return function (i) {
                    return (t || (t = te(e)))(i || e);
                };
            })();
            static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" });
        }
        return e;
    })(),
    pt = (() => {
        class e {
            document = y(re);
            platformId = y(ct);
            el = y(tt);
            injector = y(We);
            cd = y(Rr);
            renderer = y(Ar);
            config = y(Jf);
            baseComponentStyle = y(K0);
            baseStyle = y(Ye);
            scopedStyleEl;
            rootEl;
            dt;
            get styleOptions() {
                return { nonce: this.config?.csp().nonce };
            }
            get _name() {
                return this.constructor.name.replace(/^_/, "").toLowerCase();
            }
            get componentStyle() {
                return this._componentStyle;
            }
            attrSelector = $t("pc");
            themeChangeListeners = [];
            _getHostInstance(t) {
                if (t)
                    return t
                        ? this.hostName
                            ? t.name === this.hostName
                                ? t
                                : this._getHostInstance(t.parentInstance)
                            : t.parentInstance
                        : void 0;
            }
            _getOptionValue(t, r = "", i = {}) {
                return xl(t, r, i);
            }
            ngOnInit() {
                this.document && this._loadStyles();
            }
            ngAfterViewInit() {
                ((this.rootEl = this.el?.nativeElement),
                    this.rootEl &&
                        this.rootEl?.setAttribute(this.attrSelector, ""));
            }
            ngOnChanges(t) {
                if (this.document && !Vi(this.platformId)) {
                    let { dt: r } = t;
                    r &&
                        r.currentValue &&
                        (this._loadScopedThemeStyles(r.currentValue),
                        this._themeChangeListener(() =>
                            this._loadScopedThemeStyles(r.currentValue)
                        ));
                }
            }
            ngOnDestroy() {
                (this._unloadScopedThemeStyles(),
                    this.themeChangeListeners.forEach((t) =>
                        wt.off("theme:change", t)
                    ));
            }
            _loadStyles() {
                let t = () => {
                    (zi.isStyleNameLoaded("base") ||
                        (this.baseStyle.loadGlobalCSS(this.styleOptions),
                        zi.setLoadedStyleName("base")),
                        this._loadThemeStyles());
                };
                (t(), this._themeChangeListener(() => t()));
            }
            _loadCoreStyles() {
                !zi.isStyleNameLoaded("base") &&
                    this._name &&
                    (this.baseComponentStyle.loadCSS(this.styleOptions),
                    this.componentStyle &&
                        this.componentStyle?.loadCSS(this.styleOptions),
                    zi.setLoadedStyleName(this.componentStyle?.name));
            }
            _loadThemeStyles() {
                if (!ue.isStyleNameLoaded("common")) {
                    let {
                        primitive: t,
                        semantic: r,
                        global: i,
                        style: o,
                    } = this.componentStyle?.getCommonTheme?.() || {};
                    (this.baseStyle.load(
                        t?.css,
                        E({ name: "primitive-variables" }, this.styleOptions)
                    ),
                        this.baseStyle.load(
                            r?.css,
                            E({ name: "semantic-variables" }, this.styleOptions)
                        ),
                        this.baseStyle.load(
                            i?.css,
                            E({ name: "global-variables" }, this.styleOptions)
                        ),
                        this.baseStyle.loadGlobalTheme(
                            E({ name: "global-style" }, this.styleOptions),
                            o
                        ),
                        ue.setLoadedStyleName("common"));
                }
                if (
                    !ue.isStyleNameLoaded(this.componentStyle?.name) &&
                    this.componentStyle?.name
                ) {
                    let { css: t, style: r } =
                        this.componentStyle?.getComponentTheme?.() || {};
                    (this.componentStyle?.load(
                        t,
                        E(
                            { name: `${this.componentStyle?.name}-variables` },
                            this.styleOptions
                        )
                    ),
                        this.componentStyle?.loadTheme(
                            E(
                                { name: `${this.componentStyle?.name}-style` },
                                this.styleOptions
                            ),
                            r
                        ),
                        ue.setLoadedStyleName(this.componentStyle?.name));
                }
                if (!ue.isStyleNameLoaded("layer-order")) {
                    let t = this.componentStyle?.getLayerOrderThemeCSS?.();
                    (this.baseStyle.load(
                        t,
                        E({ name: "layer-order", first: !0 }, this.styleOptions)
                    ),
                        ue.setLoadedStyleName("layer-order"));
                }
                this.dt &&
                    (this._loadScopedThemeStyles(this.dt),
                    this._themeChangeListener(() =>
                        this._loadScopedThemeStyles(this.dt)
                    ));
            }
            _loadScopedThemeStyles(t) {
                let { css: r } =
                        this.componentStyle?.getPresetTheme?.(
                            t,
                            `[${this.attrSelector}]`
                        ) || {},
                    i = this.componentStyle?.load(
                        r,
                        E(
                            {
                                name: `${this.attrSelector}-${this.componentStyle?.name}`,
                            },
                            this.styleOptions
                        )
                    );
                this.scopedStyleEl = i?.el;
            }
            _unloadScopedThemeStyles() {
                this.scopedStyleEl?.remove();
            }
            _themeChangeListener(t = () => {}) {
                (zi.clearLoadedStyleNames(),
                    wt.on("theme:change", t),
                    this.themeChangeListeners.push(t));
            }
            cx(t, r) {
                let i = this.parent
                    ? this.parent.componentStyle?.classes?.[t]
                    : this.componentStyle?.classes?.[t];
                return typeof i == "function"
                    ? i({ instance: this })
                    : typeof i == "string"
                      ? i
                      : t;
            }
            sx(t) {
                let r = this.componentStyle?.inlineStyles?.[t];
                return typeof r == "function"
                    ? r({ instance: this })
                    : typeof r == "string"
                      ? r
                      : E({}, r);
            }
            get parent() {
                return this.parentInstance;
            }
            static ɵfac = function (r) {
                return new (r || e)();
            };
            static ɵdir = Me({
                type: e,
                inputs: { dt: "dt" },
                features: [Rt([K0, Ye]), At],
            });
        }
        return e;
    })();
var ic = (() => {
    class e {
        static zindex = 1e3;
        static calculatedScrollbarWidth = null;
        static calculatedScrollbarHeight = null;
        static browser;
        static addClass(t, r) {
            t &&
                r &&
                (t.classList ? t.classList.add(r) : (t.className += " " + r));
        }
        static addMultipleClasses(t, r) {
            if (t && r)
                if (t.classList) {
                    let i = r.trim().split(" ");
                    for (let o = 0; o < i.length; o++) t.classList.add(i[o]);
                } else {
                    let i = r.split(" ");
                    for (let o = 0; o < i.length; o++)
                        t.className += " " + i[o];
                }
        }
        static removeClass(t, r) {
            t &&
                r &&
                (t.classList
                    ? t.classList.remove(r)
                    : (t.className = t.className.replace(
                          new RegExp(
                              "(^|\\b)" + r.split(" ").join("|") + "(\\b|$)",
                              "gi"
                          ),
                          " "
                      )));
        }
        static removeMultipleClasses(t, r) {
            t &&
                r &&
                [r]
                    .flat()
                    .filter(Boolean)
                    .forEach((i) =>
                        i.split(" ").forEach((o) => this.removeClass(t, o))
                    );
        }
        static hasClass(t, r) {
            return t && r
                ? t.classList
                    ? t.classList.contains(r)
                    : new RegExp("(^| )" + r + "( |$)", "gi").test(t.className)
                : !1;
        }
        static siblings(t) {
            return Array.prototype.filter.call(
                t.parentNode.children,
                function (r) {
                    return r !== t;
                }
            );
        }
        static find(t, r) {
            return Array.from(t.querySelectorAll(r));
        }
        static findSingle(t, r) {
            return this.isElement(t) ? t.querySelector(r) : null;
        }
        static index(t) {
            let r = t.parentNode.childNodes,
                i = 0;
            for (var o = 0; o < r.length; o++) {
                if (r[o] == t) return i;
                r[o].nodeType == 1 && i++;
            }
            return -1;
        }
        static indexWithinGroup(t, r) {
            let i = t.parentNode ? t.parentNode.childNodes : [],
                o = 0;
            for (var s = 0; s < i.length; s++) {
                if (i[s] == t) return o;
                i[s].attributes &&
                    i[s].attributes[r] &&
                    i[s].nodeType == 1 &&
                    o++;
            }
            return -1;
        }
        static appendOverlay(t, r, i = "self") {
            i !== "self" && t && r && this.appendChild(t, r);
        }
        static alignOverlay(t, r, i = "self", o = !0) {
            t &&
                r &&
                (o && (t.style.minWidth = `${e.getOuterWidth(r)}px`),
                i === "self"
                    ? this.relativePosition(t, r)
                    : this.absolutePosition(t, r));
        }
        static relativePosition(t, r, i = !0) {
            let o = (j) => {
                    if (j)
                        return getComputedStyle(j).getPropertyValue(
                            "position"
                        ) === "relative"
                            ? j
                            : o(j.parentElement);
                },
                s = t.offsetParent
                    ? { width: t.offsetWidth, height: t.offsetHeight }
                    : this.getHiddenElementDimensions(t),
                a = r.offsetHeight,
                l = r.getBoundingClientRect(),
                c = this.getWindowScrollTop(),
                u = this.getWindowScrollLeft(),
                d = this.getViewport(),
                f = o(t)?.getBoundingClientRect() || {
                    top: -1 * c,
                    left: -1 * u,
                },
                h,
                _;
            l.top + a + s.height > d.height
                ? ((h = l.top - f.top - s.height),
                  (t.style.transformOrigin = "bottom"),
                  l.top + h < 0 && (h = -1 * l.top))
                : ((h = a + l.top - f.top), (t.style.transformOrigin = "top"));
            let M = l.left + s.width - d.width,
                I = l.left - f.left;
            (s.width > d.width
                ? (_ = (l.left - f.left) * -1)
                : M > 0
                  ? (_ = I - M)
                  : (_ = l.left - f.left),
                (t.style.top = h + "px"),
                (t.style.left = _ + "px"),
                i &&
                    (t.style.marginTop =
                        origin === "bottom"
                            ? "calc(var(--p-anchor-gutter) * -1)"
                            : "calc(var(--p-anchor-gutter))"));
        }
        static absolutePosition(t, r, i = !0) {
            let o = t.offsetParent
                    ? { width: t.offsetWidth, height: t.offsetHeight }
                    : this.getHiddenElementDimensions(t),
                s = o.height,
                a = o.width,
                l = r.offsetHeight,
                c = r.offsetWidth,
                u = r.getBoundingClientRect(),
                d = this.getWindowScrollTop(),
                p = this.getWindowScrollLeft(),
                f = this.getViewport(),
                h,
                _;
            (u.top + l + s > f.height
                ? ((h = u.top + d - s),
                  (t.style.transformOrigin = "bottom"),
                  h < 0 && (h = d))
                : ((h = l + u.top + d), (t.style.transformOrigin = "top")),
                u.left + a > f.width
                    ? (_ = Math.max(0, u.left + p + c - a))
                    : (_ = u.left + p),
                (t.style.top = h + "px"),
                (t.style.left = _ + "px"),
                i &&
                    (t.style.marginTop =
                        origin === "bottom"
                            ? "calc(var(--p-anchor-gutter) * -1)"
                            : "calc(var(--p-anchor-gutter))"));
        }
        static getParents(t, r = []) {
            return t.parentNode === null
                ? r
                : this.getParents(t.parentNode, r.concat([t.parentNode]));
        }
        static getScrollableParents(t) {
            let r = [];
            if (t) {
                let i = this.getParents(t),
                    o = /(auto|scroll)/,
                    s = (a) => {
                        let l = window.getComputedStyle(a, null);
                        return (
                            o.test(l.getPropertyValue("overflow")) ||
                            o.test(l.getPropertyValue("overflowX")) ||
                            o.test(l.getPropertyValue("overflowY"))
                        );
                    };
                for (let a of i) {
                    let l = a.nodeType === 1 && a.dataset.scrollselectors;
                    if (l) {
                        let c = l.split(",");
                        for (let u of c) {
                            let d = this.findSingle(a, u);
                            d && s(d) && r.push(d);
                        }
                    }
                    a.nodeType !== 9 && s(a) && r.push(a);
                }
            }
            return r;
        }
        static getHiddenElementOuterHeight(t) {
            ((t.style.visibility = "hidden"), (t.style.display = "block"));
            let r = t.offsetHeight;
            return (
                (t.style.display = "none"),
                (t.style.visibility = "visible"),
                r
            );
        }
        static getHiddenElementOuterWidth(t) {
            ((t.style.visibility = "hidden"), (t.style.display = "block"));
            let r = t.offsetWidth;
            return (
                (t.style.display = "none"),
                (t.style.visibility = "visible"),
                r
            );
        }
        static getHiddenElementDimensions(t) {
            let r = {};
            return (
                (t.style.visibility = "hidden"),
                (t.style.display = "block"),
                (r.width = t.offsetWidth),
                (r.height = t.offsetHeight),
                (t.style.display = "none"),
                (t.style.visibility = "visible"),
                r
            );
        }
        static scrollInView(t, r) {
            let i = getComputedStyle(t).getPropertyValue("borderTopWidth"),
                o = i ? parseFloat(i) : 0,
                s = getComputedStyle(t).getPropertyValue("paddingTop"),
                a = s ? parseFloat(s) : 0,
                l = t.getBoundingClientRect(),
                u =
                    r.getBoundingClientRect().top +
                    document.body.scrollTop -
                    (l.top + document.body.scrollTop) -
                    o -
                    a,
                d = t.scrollTop,
                p = t.clientHeight,
                f = this.getOuterHeight(r);
            u < 0
                ? (t.scrollTop = d + u)
                : u + f > p && (t.scrollTop = d + u - p + f);
        }
        static fadeIn(t, r) {
            t.style.opacity = 0;
            let i = +new Date(),
                o = 0,
                s = function () {
                    ((o =
                        +t.style.opacity.replace(",", ".") +
                        (new Date().getTime() - i) / r),
                        (t.style.opacity = o),
                        (i = +new Date()),
                        +o < 1 &&
                            ((window.requestAnimationFrame &&
                                requestAnimationFrame(s)) ||
                                setTimeout(s, 16)));
                };
            s();
        }
        static fadeOut(t, r) {
            var i = 1,
                o = 50,
                s = r,
                a = o / s;
            let l = setInterval(() => {
                ((i = i - a),
                    i <= 0 && ((i = 0), clearInterval(l)),
                    (t.style.opacity = i));
            }, o);
        }
        static getWindowScrollTop() {
            let t = document.documentElement;
            return (window.pageYOffset || t.scrollTop) - (t.clientTop || 0);
        }
        static getWindowScrollLeft() {
            let t = document.documentElement;
            return (window.pageXOffset || t.scrollLeft) - (t.clientLeft || 0);
        }
        static matches(t, r) {
            var i = Element.prototype,
                o =
                    i.matches ||
                    i.webkitMatchesSelector ||
                    i.mozMatchesSelector ||
                    i.msMatchesSelector ||
                    function (s) {
                        return (
                            [].indexOf.call(
                                document.querySelectorAll(s),
                                this
                            ) !== -1
                        );
                    };
            return o.call(t, r);
        }
        static getOuterWidth(t, r) {
            let i = t.offsetWidth;
            if (r) {
                let o = getComputedStyle(t);
                i += parseFloat(o.marginLeft) + parseFloat(o.marginRight);
            }
            return i;
        }
        static getHorizontalPadding(t) {
            let r = getComputedStyle(t);
            return parseFloat(r.paddingLeft) + parseFloat(r.paddingRight);
        }
        static getHorizontalMargin(t) {
            let r = getComputedStyle(t);
            return parseFloat(r.marginLeft) + parseFloat(r.marginRight);
        }
        static innerWidth(t) {
            let r = t.offsetWidth,
                i = getComputedStyle(t);
            return (
                (r += parseFloat(i.paddingLeft) + parseFloat(i.paddingRight)),
                r
            );
        }
        static width(t) {
            let r = t.offsetWidth,
                i = getComputedStyle(t);
            return (
                (r -= parseFloat(i.paddingLeft) + parseFloat(i.paddingRight)),
                r
            );
        }
        static getInnerHeight(t) {
            let r = t.offsetHeight,
                i = getComputedStyle(t);
            return (
                (r += parseFloat(i.paddingTop) + parseFloat(i.paddingBottom)),
                r
            );
        }
        static getOuterHeight(t, r) {
            let i = t.offsetHeight;
            if (r) {
                let o = getComputedStyle(t);
                i += parseFloat(o.marginTop) + parseFloat(o.marginBottom);
            }
            return i;
        }
        static getHeight(t) {
            let r = t.offsetHeight,
                i = getComputedStyle(t);
            return (
                (r -=
                    parseFloat(i.paddingTop) +
                    parseFloat(i.paddingBottom) +
                    parseFloat(i.borderTopWidth) +
                    parseFloat(i.borderBottomWidth)),
                r
            );
        }
        static getWidth(t) {
            let r = t.offsetWidth,
                i = getComputedStyle(t);
            return (
                (r -=
                    parseFloat(i.paddingLeft) +
                    parseFloat(i.paddingRight) +
                    parseFloat(i.borderLeftWidth) +
                    parseFloat(i.borderRightWidth)),
                r
            );
        }
        static getViewport() {
            let t = window,
                r = document,
                i = r.documentElement,
                o = r.getElementsByTagName("body")[0],
                s = t.innerWidth || i.clientWidth || o.clientWidth,
                a = t.innerHeight || i.clientHeight || o.clientHeight;
            return { width: s, height: a };
        }
        static getOffset(t) {
            var r = t.getBoundingClientRect();
            return {
                top:
                    r.top +
                    (window.pageYOffset ||
                        document.documentElement.scrollTop ||
                        document.body.scrollTop ||
                        0),
                left:
                    r.left +
                    (window.pageXOffset ||
                        document.documentElement.scrollLeft ||
                        document.body.scrollLeft ||
                        0),
            };
        }
        static replaceElementWith(t, r) {
            let i = t.parentNode;
            if (!i) throw "Can't replace element";
            return i.replaceChild(r, t);
        }
        static getUserAgent() {
            if (navigator && this.isClient()) return navigator.userAgent;
        }
        static isIE() {
            var t = window.navigator.userAgent,
                r = t.indexOf("MSIE ");
            if (r > 0) return !0;
            var i = t.indexOf("Trident/");
            if (i > 0) {
                var o = t.indexOf("rv:");
                return !0;
            }
            var s = t.indexOf("Edge/");
            return s > 0;
        }
        static isIOS() {
            return (
                /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
            );
        }
        static isAndroid() {
            return /(android)/i.test(navigator.userAgent);
        }
        static isTouchDevice() {
            return "ontouchstart" in window || navigator.maxTouchPoints > 0;
        }
        static appendChild(t, r) {
            if (this.isElement(r)) r.appendChild(t);
            else if (r && r.el && r.el.nativeElement)
                r.el.nativeElement.appendChild(t);
            else throw "Cannot append " + r + " to " + t;
        }
        static removeChild(t, r) {
            if (this.isElement(r)) r.removeChild(t);
            else if (r.el && r.el.nativeElement)
                r.el.nativeElement.removeChild(t);
            else throw "Cannot remove " + t + " from " + r;
        }
        static removeElement(t) {
            "remove" in Element.prototype
                ? t.remove()
                : t.parentNode.removeChild(t);
        }
        static isElement(t) {
            return typeof HTMLElement == "object"
                ? t instanceof HTMLElement
                : t &&
                      typeof t == "object" &&
                      t !== null &&
                      t.nodeType === 1 &&
                      typeof t.nodeName == "string";
        }
        static calculateScrollbarWidth(t) {
            if (t) {
                let r = getComputedStyle(t);
                return (
                    t.offsetWidth -
                    t.clientWidth -
                    parseFloat(r.borderLeftWidth) -
                    parseFloat(r.borderRightWidth)
                );
            } else {
                if (this.calculatedScrollbarWidth !== null)
                    return this.calculatedScrollbarWidth;
                let r = document.createElement("div");
                ((r.className = "p-scrollbar-measure"),
                    document.body.appendChild(r));
                let i = r.offsetWidth - r.clientWidth;
                return (
                    document.body.removeChild(r),
                    (this.calculatedScrollbarWidth = i),
                    i
                );
            }
        }
        static calculateScrollbarHeight() {
            if (this.calculatedScrollbarHeight !== null)
                return this.calculatedScrollbarHeight;
            let t = document.createElement("div");
            ((t.className = "p-scrollbar-measure"),
                document.body.appendChild(t));
            let r = t.offsetHeight - t.clientHeight;
            return (
                document.body.removeChild(t),
                (this.calculatedScrollbarWidth = r),
                r
            );
        }
        static invokeElementMethod(t, r, i) {
            t[r].apply(t, i);
        }
        static clearSelection() {
            if (window.getSelection)
                window.getSelection().empty
                    ? window.getSelection().empty()
                    : window.getSelection().removeAllRanges &&
                      window.getSelection().rangeCount > 0 &&
                      window.getSelection().getRangeAt(0).getClientRects()
                          .length > 0 &&
                      window.getSelection().removeAllRanges();
            else if (document.selection && document.selection.empty)
                try {
                    document.selection.empty();
                } catch {}
        }
        static getBrowser() {
            if (!this.browser) {
                let t = this.resolveUserAgent();
                ((this.browser = {}),
                    t.browser &&
                        ((this.browser[t.browser] = !0),
                        (this.browser.version = t.version)),
                    this.browser.chrome
                        ? (this.browser.webkit = !0)
                        : this.browser.webkit && (this.browser.safari = !0));
            }
            return this.browser;
        }
        static resolveUserAgent() {
            let t = navigator.userAgent.toLowerCase(),
                r =
                    /(chrome)[ \/]([\w.]+)/.exec(t) ||
                    /(webkit)[ \/]([\w.]+)/.exec(t) ||
                    /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(t) ||
                    /(msie) ([\w.]+)/.exec(t) ||
                    (t.indexOf("compatible") < 0 &&
                        /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(t)) ||
                    [];
            return { browser: r[1] || "", version: r[2] || "0" };
        }
        static isInteger(t) {
            return Number.isInteger
                ? Number.isInteger(t)
                : typeof t == "number" && isFinite(t) && Math.floor(t) === t;
        }
        static isHidden(t) {
            return !t || t.offsetParent === null;
        }
        static isVisible(t) {
            return t && t.offsetParent != null;
        }
        static isExist(t) {
            return t !== null && typeof t < "u" && t.nodeName && t.parentNode;
        }
        static focus(t, r) {
            t && document.activeElement !== t && t.focus(r);
        }
        static getFocusableSelectorString(t = "") {
            return `button:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
        [href][clientHeight][clientWidth]:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
        input:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
        select:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
        textarea:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
        [tabIndex]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
        [contenteditable]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
        .p-inputtext:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t},
        .p-button:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${t}`;
        }
        static getFocusableElements(t, r = "") {
            let i = this.find(t, this.getFocusableSelectorString(r)),
                o = [];
            for (let s of i) {
                let a = getComputedStyle(s);
                this.isVisible(s) &&
                    a.display != "none" &&
                    a.visibility != "hidden" &&
                    o.push(s);
            }
            return o;
        }
        static getFocusableElement(t, r = "") {
            let i = this.findSingle(t, this.getFocusableSelectorString(r));
            if (i) {
                let o = getComputedStyle(i);
                if (
                    this.isVisible(i) &&
                    o.display != "none" &&
                    o.visibility != "hidden"
                )
                    return i;
            }
            return null;
        }
        static getFirstFocusableElement(t, r = "") {
            let i = this.getFocusableElements(t, r);
            return i.length > 0 ? i[0] : null;
        }
        static getLastFocusableElement(t, r) {
            let i = this.getFocusableElements(t, r);
            return i.length > 0 ? i[i.length - 1] : null;
        }
        static getNextFocusableElement(t, r = !1) {
            let i = e.getFocusableElements(t),
                o = 0;
            if (i && i.length > 0) {
                let s = i.indexOf(i[0].ownerDocument.activeElement);
                r
                    ? s == -1 || s === 0
                        ? (o = i.length - 1)
                        : (o = s - 1)
                    : s != -1 && s !== i.length - 1 && (o = s + 1);
            }
            return i[o];
        }
        static generateZIndex() {
            return ((this.zindex = this.zindex || 999), ++this.zindex);
        }
        static getSelection() {
            return window.getSelection
                ? window.getSelection().toString()
                : document.getSelection
                  ? document.getSelection().toString()
                  : document.selection
                    ? document.selection.createRange().text
                    : null;
        }
        static getTargetElement(t, r) {
            if (!t) return null;
            switch (t) {
                case "document":
                    return document;
                case "window":
                    return window;
                case "@next":
                    return r?.nextElementSibling;
                case "@prev":
                    return r?.previousElementSibling;
                case "@parent":
                    return r?.parentElement;
                case "@grandparent":
                    return r?.parentElement.parentElement;
                default:
                    let i = typeof t;
                    if (i === "string") return document.querySelector(t);
                    if (i === "object" && t.hasOwnProperty("nativeElement"))
                        return this.isExist(t.nativeElement)
                            ? t.nativeElement
                            : void 0;
                    let s = ((a) =>
                        !!(a && a.constructor && a.call && a.apply))(t)
                        ? t()
                        : t;
                    return (s && s.nodeType === 9) || this.isExist(s)
                        ? s
                        : null;
            }
        }
        static isClient() {
            return !!(
                typeof window < "u" &&
                window.document &&
                window.document.createElement
            );
        }
        static getAttribute(t, r) {
            if (t) {
                let i = t.getAttribute(r);
                return isNaN(i)
                    ? i === "true" || i === "false"
                        ? i === "true"
                        : i
                    : +i;
            }
        }
        static calculateBodyScrollbarWidth() {
            return window.innerWidth - document.documentElement.offsetWidth;
        }
        static blockBodyScroll(t = "p-overflow-hidden") {
            (document.body.style.setProperty(
                "--scrollbar-width",
                this.calculateBodyScrollbarWidth() + "px"
            ),
                this.addClass(document.body, t));
        }
        static unblockBodyScroll(t = "p-overflow-hidden") {
            (document.body.style.removeProperty("--scrollbar-width"),
                this.removeClass(document.body, t));
        }
        static createElement(t, r = {}, ...i) {
            if (t) {
                let o = document.createElement(t);
                return (this.setAttributes(o, r), o.append(...i), o);
            }
        }
        static setAttribute(t, r = "", i) {
            this.isElement(t) &&
                i !== null &&
                i !== void 0 &&
                t.setAttribute(r, i);
        }
        static setAttributes(t, r = {}) {
            if (this.isElement(t)) {
                let i = (o, s) => {
                    let a = t?.$attrs?.[o] ? [t?.$attrs?.[o]] : [];
                    return [s].flat().reduce((l, c) => {
                        if (c != null) {
                            let u = typeof c;
                            if (u === "string" || u === "number") l.push(c);
                            else if (u === "object") {
                                let d = Array.isArray(c)
                                    ? i(o, c)
                                    : Object.entries(c).map(([p, f]) =>
                                          o === "style" && (f || f === 0)
                                              ? `${p.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}:${f}`
                                              : f
                                                ? p
                                                : void 0
                                      );
                                l = d.length
                                    ? l.concat(d.filter((p) => !!p))
                                    : l;
                            }
                        }
                        return l;
                    }, a);
                };
                Object.entries(r).forEach(([o, s]) => {
                    if (s != null) {
                        let a = o.match(/^on(.+)/);
                        a
                            ? t.addEventListener(a[1].toLowerCase(), s)
                            : o === "pBind"
                              ? this.setAttributes(t, s)
                              : ((s =
                                    o === "class"
                                        ? [...new Set(i("class", s))]
                                              .join(" ")
                                              .trim()
                                        : o === "style"
                                          ? i("style", s).join(";").trim()
                                          : s),
                                (t.$attrs = t.$attrs || {}) &&
                                    (t.$attrs[o] = s),
                                t.setAttribute(o, s));
                    }
                });
            }
        }
        static isFocusableElement(t, r = "") {
            return this.isElement(t)
                ? t.matches(`button:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${r},
                [href][clientHeight][clientWidth]:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${r},
                input:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${r},
                select:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${r},
                textarea:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${r},
                [tabIndex]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${r},
                [contenteditable]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${r}`)
                : !1;
        }
    }
    return e;
})();
var Q0 = (() => {
    class e extends pt {
        autofocus = !1;
        _autofocus = !1;
        focused = !1;
        platformId = y(ct);
        document = y(re);
        host = y(tt);
        ngAfterContentChecked() {
            (this.autofocus === !1
                ? this.host.nativeElement.removeAttribute("autofocus")
                : this.host.nativeElement.setAttribute("autofocus", !0),
                this.focused || this.autoFocus());
        }
        ngAfterViewChecked() {
            this.focused || this.autoFocus();
        }
        autoFocus() {
            _n(this.platformId) &&
                this._autofocus &&
                setTimeout(() => {
                    let t = ic.getFocusableElements(this.host?.nativeElement);
                    (t.length === 0 && this.host.nativeElement.focus(),
                        t.length > 0 && t[0].focus(),
                        (this.focused = !0));
                });
        }
        static ɵfac = (() => {
            let t;
            return function (i) {
                return (t || (t = te(e)))(i || e);
            };
        })();
        static ɵdir = Me({
            type: e,
            selectors: [["", "pAutoFocus", ""]],
            inputs: {
                autofocus: [2, "autofocus", "autofocus", K],
                _autofocus: [0, "pAutoFocus", "_autofocus"],
            },
            features: [be],
        });
    }
    return e;
})();
var MO = ({ dt: e }) => `
.p-badge {
    display: inline-flex;
    border-radius: ${e("badge.border.radius")};
    justify-content: center;
    padding: ${e("badge.padding")};
    background: ${e("badge.primary.background")};
    color: ${e("badge.primary.color")};
    font-size: ${e("badge.font.size")};
    font-weight: ${e("badge.font.weight")};
    min-width: ${e("badge.min.width")};
    height: ${e("badge.height")};
    line-height: ${e("badge.height")};
}

.p-badge-dot {
    width: ${e("badge.dot.size")};
    min-width: ${e("badge.dot.size")};
    height: ${e("badge.dot.size")};
    border-radius: 50%;
    padding: 0;
}

.p-badge-circle {
    padding: 0;
    border-radius: 50%;
}

.p-badge-secondary {
    background: ${e("badge.secondary.background")};
    color: ${e("badge.secondary.color")};
}

.p-badge-success {
    background: ${e("badge.success.background")};
    color: ${e("badge.success.color")};
}

.p-badge-info {
    background: ${e("badge.info.background")};
    color: ${e("badge.info.color")};
}

.p-badge-warn {
    background: ${e("badge.warn.background")};
    color: ${e("badge.warn.color")};
}

.p-badge-danger {
    background: ${e("badge.danger.background")};
    color: ${e("badge.danger.color")};
}

.p-badge-contrast {
    background: ${e("badge.contrast.background")};
    color: ${e("badge.contrast.color")};
}

.p-badge-sm {
    font-size: ${e("badge.sm.font.size")};
    min-width: ${e("badge.sm.min.width")};
    height: ${e("badge.sm.height")};
    line-height: ${e("badge.sm.height")};
}

.p-badge-lg {
    font-size: ${e("badge.lg.font.size")};
    min-width: ${e("badge.lg.min.width")};
    height: ${e("badge.lg.height")};
    line-height: ${e("badge.lg.height")};
}

.p-badge-xl {
    font-size: ${e("badge.xl.font.size")};
    min-width: ${e("badge.xl.min.width")};
    height: ${e("badge.xl.height")};
    line-height: ${e("badge.xl.height")};
}

/* For PrimeNG (directive)*/

.p-overlay-badge {
    position: relative;
}

.p-overlay-badge > .p-badge {
    position: absolute;
    top: 0;
    inset-inline-end: 0;
    transform: translate(50%, -50%);
    transform-origin: 100% 0;
    margin: 0;
}
`,
    IO = {
        root: ({ props: e, instance: n }) => [
            "p-badge p-component",
            {
                "p-badge-circle": ye(e.value) && String(e.value).length === 1,
                "p-badge-dot": Ft(e.value) && !n.$slots.default,
                "p-badge-sm": e.size === "small",
                "p-badge-lg": e.size === "large",
                "p-badge-xl": e.size === "xlarge",
                "p-badge-info": e.severity === "info",
                "p-badge-success": e.severity === "success",
                "p-badge-warn": e.severity === "warn",
                "p-badge-danger": e.severity === "danger",
                "p-badge-secondary": e.severity === "secondary",
                "p-badge-contrast": e.severity === "contrast",
            },
        ],
    },
    Z0 = (() => {
        class e extends Ye {
            name = "badge";
            theme = MO;
            classes = IO;
            static ɵfac = (() => {
                let t;
                return function (i) {
                    return (t || (t = te(e)))(i || e);
                };
            })();
            static ɵprov = w({ token: e, factory: e.ɵfac });
        }
        return e;
    })();
var Up = (() => {
        class e extends pt {
            styleClass = hn();
            style = hn();
            badgeSize = hn();
            size = hn();
            severity = hn();
            value = hn();
            badgeDisabled = hn(!1, { transform: K });
            _componentStyle = y(Z0);
            containerClass = xf(() => {
                let t = "p-badge p-component";
                return (
                    ye(this.value()) &&
                        String(this.value()).length === 1 &&
                        (t += " p-badge-circle"),
                    this.badgeSize() === "large"
                        ? (t += " p-badge-lg")
                        : this.badgeSize() === "xlarge"
                          ? (t += " p-badge-xl")
                          : this.badgeSize() === "small" &&
                            (t += " p-badge-sm"),
                    Ft(this.value()) && (t += " p-badge-dot"),
                    this.styleClass() && (t += ` ${this.styleClass()}`),
                    this.severity() && (t += ` p-badge-${this.severity()}`),
                    t
                );
            });
            static ɵfac = (() => {
                let t;
                return function (i) {
                    return (t || (t = te(e)))(i || e);
                };
            })();
            static ɵcmp = R({
                type: e,
                selectors: [["p-badge"]],
                hostVars: 6,
                hostBindings: function (r, i) {
                    r & 2 &&
                        (Ko(i.style()),
                        ke(i.containerClass()),
                        yf("display", i.badgeDisabled() ? "none" : null));
                },
                inputs: {
                    styleClass: [1, "styleClass"],
                    style: [1, "style"],
                    badgeSize: [1, "badgeSize"],
                    size: [1, "size"],
                    severity: [1, "severity"],
                    value: [1, "value"],
                    badgeDisabled: [1, "badgeDisabled"],
                },
                features: [Rt([Z0]), be],
                decls: 1,
                vars: 1,
                template: function (r, i) {
                    (r & 1 && C(0), r & 2 && Ce(i.value()));
                },
                dependencies: [Qt, yn],
                encapsulation: 2,
                changeDetection: 0,
            });
        }
        return e;
    })(),
    X0 = (() => {
        class e {
            static ɵfac = function (r) {
                return new (r || e)();
            };
            static ɵmod = ge({ type: e });
            static ɵinj = he({ imports: [Up, yn, yn] });
        }
        return e;
    })();
var xO = ["*"],
    OO = `
.p-icon {
    display: inline-block;
    vertical-align: baseline;
}

.p-icon-spin {
    -webkit-animation: p-icon-spin 2s infinite linear;
    animation: p-icon-spin 2s infinite linear;
}

@-webkit-keyframes p-icon-spin {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(359deg);
        transform: rotate(359deg);
    }
}

@keyframes p-icon-spin {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(359deg);
        transform: rotate(359deg);
    }
}
`,
    PO = (() => {
        class e extends Ye {
            name = "baseicon";
            inlineStyles = OO;
            static ɵfac = (() => {
                let t;
                return function (i) {
                    return (t || (t = te(e)))(i || e);
                };
            })();
            static ɵprov = w({ token: e, factory: e.ɵfac });
        }
        return e;
    })();
var cr = (() => {
    class e extends pt {
        label;
        spin = !1;
        styleClass;
        role;
        ariaLabel;
        ariaHidden;
        ngOnInit() {
            (super.ngOnInit(), this.getAttributes());
        }
        getAttributes() {
            let t = Ft(this.label);
            ((this.role = t ? void 0 : "img"),
                (this.ariaLabel = t ? void 0 : this.label),
                (this.ariaHidden = t));
        }
        getClassNames() {
            return `p-icon ${this.styleClass ? this.styleClass + " " : ""}${this.spin ? "p-icon-spin" : ""}`;
        }
        static ɵfac = (() => {
            let t;
            return function (i) {
                return (t || (t = te(e)))(i || e);
            };
        })();
        static ɵcmp = R({
            type: e,
            selectors: [["ng-component"]],
            hostAttrs: [1, "p-component", "p-iconwrapper"],
            inputs: {
                label: "label",
                spin: [2, "spin", "spin", K],
                styleClass: "styleClass",
            },
            features: [Rt([PO]), be],
            ngContentSelectors: xO,
            decls: 1,
            vars: 0,
            template: function (r, i) {
                r & 1 && (Ct(), Ge(0));
            },
            encapsulation: 2,
            changeDetection: 0,
        });
    }
    return e;
})();
var J0 = (() => {
    class e extends cr {
        pathId;
        ngOnInit() {
            this.pathId = "url(#" + $t() + ")";
        }
        static ɵfac = (() => {
            let t;
            return function (i) {
                return (t || (t = te(e)))(i || e);
            };
        })();
        static ɵcmp = R({
            type: e,
            selectors: [["SpinnerIcon"]],
            features: [be],
            decls: 6,
            vars: 7,
            consts: [
                [
                    "width",
                    "14",
                    "height",
                    "14",
                    "viewBox",
                    "0 0 14 14",
                    "fill",
                    "none",
                    "xmlns",
                    "http://www.w3.org/2000/svg",
                ],
                [
                    "d",
                    "M6.99701 14C5.85441 13.999 4.72939 13.7186 3.72012 13.1832C2.71084 12.6478 1.84795 11.8737 1.20673 10.9284C0.565504 9.98305 0.165424 8.89526 0.041387 7.75989C-0.0826496 6.62453 0.073125 5.47607 0.495122 4.4147C0.917119 3.35333 1.59252 2.4113 2.46241 1.67077C3.33229 0.930247 4.37024 0.413729 5.4857 0.166275C6.60117 -0.0811796 7.76026 -0.0520535 8.86188 0.251112C9.9635 0.554278 10.9742 1.12227 11.8057 1.90555C11.915 2.01493 11.9764 2.16319 11.9764 2.31778C11.9764 2.47236 11.915 2.62062 11.8057 2.73C11.7521 2.78503 11.688 2.82877 11.6171 2.85864C11.5463 2.8885 11.4702 2.90389 11.3933 2.90389C11.3165 2.90389 11.2404 2.8885 11.1695 2.85864C11.0987 2.82877 11.0346 2.78503 10.9809 2.73C9.9998 1.81273 8.73246 1.26138 7.39226 1.16876C6.05206 1.07615 4.72086 1.44794 3.62279 2.22152C2.52471 2.99511 1.72683 4.12325 1.36345 5.41602C1.00008 6.70879 1.09342 8.08723 1.62775 9.31926C2.16209 10.5513 3.10478 11.5617 4.29713 12.1803C5.48947 12.7989 6.85865 12.988 8.17414 12.7157C9.48963 12.4435 10.6711 11.7264 11.5196 10.6854C12.3681 9.64432 12.8319 8.34282 12.8328 7C12.8328 6.84529 12.8943 6.69692 13.0038 6.58752C13.1132 6.47812 13.2616 6.41667 13.4164 6.41667C13.5712 6.41667 13.7196 6.47812 13.8291 6.58752C13.9385 6.69692 14 6.84529 14 7C14 8.85651 13.2622 10.637 11.9489 11.9497C10.6356 13.2625 8.85432 14 6.99701 14Z",
                    "fill",
                    "currentColor",
                ],
                [3, "id"],
                ["width", "14", "height", "14", "fill", "white"],
            ],
            template: function (r, i) {
                (r & 1 &&
                    (pn(),
                    m(0, "svg", 0)(1, "g"),
                    D(2, "path", 1),
                    g(),
                    m(3, "defs")(4, "clipPath", 2),
                    D(5, "rect", 3),
                    g()()()),
                    r & 2 &&
                        (ke(i.getClassNames()),
                        se("aria-label", i.ariaLabel)(
                            "aria-hidden",
                            i.ariaHidden
                        )("role", i.role),
                        v(),
                        se("clip-path", i.pathId),
                        v(3),
                        b("id", i.pathId)));
            },
            encapsulation: 2,
        });
    }
    return e;
})();
var eb = (() => {
    class e extends cr {
        static ɵfac = (() => {
            let t;
            return function (i) {
                return (t || (t = te(e)))(i || e);
            };
        })();
        static ɵcmp = R({
            type: e,
            selectors: [["TimesIcon"]],
            features: [be],
            decls: 2,
            vars: 5,
            consts: [
                [
                    "width",
                    "14",
                    "height",
                    "14",
                    "viewBox",
                    "0 0 14 14",
                    "fill",
                    "none",
                    "xmlns",
                    "http://www.w3.org/2000/svg",
                ],
                [
                    "d",
                    "M8.01186 7.00933L12.27 2.75116C12.341 2.68501 12.398 2.60524 12.4375 2.51661C12.4769 2.42798 12.4982 2.3323 12.4999 2.23529C12.5016 2.13827 12.4838 2.0419 12.4474 1.95194C12.4111 1.86197 12.357 1.78024 12.2884 1.71163C12.2198 1.64302 12.138 1.58893 12.0481 1.55259C11.9581 1.51625 11.8617 1.4984 11.7647 1.50011C11.6677 1.50182 11.572 1.52306 11.4834 1.56255C11.3948 1.60204 11.315 1.65898 11.2488 1.72997L6.99067 5.98814L2.7325 1.72997C2.59553 1.60234 2.41437 1.53286 2.22718 1.53616C2.03999 1.53946 1.8614 1.61529 1.72901 1.74767C1.59663 1.88006 1.5208 2.05865 1.5175 2.24584C1.5142 2.43303 1.58368 2.61419 1.71131 2.75116L5.96948 7.00933L1.71131 11.2675C1.576 11.403 1.5 11.5866 1.5 11.7781C1.5 11.9696 1.576 12.1532 1.71131 12.2887C1.84679 12.424 2.03043 12.5 2.2219 12.5C2.41338 12.5 2.59702 12.424 2.7325 12.2887L6.99067 8.03052L11.2488 12.2887C11.3843 12.424 11.568 12.5 11.7594 12.5C11.9509 12.5 12.1346 12.424 12.27 12.2887C12.4053 12.1532 12.4813 11.9696 12.4813 11.7781C12.4813 11.5866 12.4053 11.403 12.27 11.2675L8.01186 7.00933Z",
                    "fill",
                    "currentColor",
                ],
            ],
            template: function (r, i) {
                (r & 1 && (pn(), m(0, "svg", 0), D(1, "path", 1), g()),
                    r & 2 &&
                        (ke(i.getClassNames()),
                        se("aria-label", i.ariaLabel)(
                            "aria-hidden",
                            i.ariaHidden
                        )("role", i.role)));
            },
            encapsulation: 2,
        });
    }
    return e;
})();
var tb = (() => {
    class e extends cr {
        pathId;
        ngOnInit() {
            this.pathId = "url(#" + $t() + ")";
        }
        static ɵfac = (() => {
            let t;
            return function (i) {
                return (t || (t = te(e)))(i || e);
            };
        })();
        static ɵcmp = R({
            type: e,
            selectors: [["WindowMaximizeIcon"]],
            features: [be],
            decls: 6,
            vars: 7,
            consts: [
                [
                    "width",
                    "14",
                    "height",
                    "14",
                    "viewBox",
                    "0 0 14 14",
                    "fill",
                    "none",
                    "xmlns",
                    "http://www.w3.org/2000/svg",
                ],
                [
                    "fill-rule",
                    "evenodd",
                    "clip-rule",
                    "evenodd",
                    "d",
                    "M7 14H11.8C12.3835 14 12.9431 13.7682 13.3556 13.3556C13.7682 12.9431 14 12.3835 14 11.8V2.2C14 1.61652 13.7682 1.05694 13.3556 0.644365C12.9431 0.231785 12.3835 0 11.8 0H2.2C1.61652 0 1.05694 0.231785 0.644365 0.644365C0.231785 1.05694 0 1.61652 0 2.2V7C0 7.15913 0.063214 7.31174 0.175736 7.42426C0.288258 7.53679 0.44087 7.6 0.6 7.6C0.75913 7.6 0.911742 7.53679 1.02426 7.42426C1.13679 7.31174 1.2 7.15913 1.2 7V2.2C1.2 1.93478 1.30536 1.68043 1.49289 1.49289C1.68043 1.30536 1.93478 1.2 2.2 1.2H11.8C12.0652 1.2 12.3196 1.30536 12.5071 1.49289C12.6946 1.68043 12.8 1.93478 12.8 2.2V11.8C12.8 12.0652 12.6946 12.3196 12.5071 12.5071C12.3196 12.6946 12.0652 12.8 11.8 12.8H7C6.84087 12.8 6.68826 12.8632 6.57574 12.9757C6.46321 13.0883 6.4 13.2409 6.4 13.4C6.4 13.5591 6.46321 13.7117 6.57574 13.8243C6.68826 13.9368 6.84087 14 7 14ZM9.77805 7.42192C9.89013 7.534 10.0415 7.59788 10.2 7.59995C10.3585 7.59788 10.5099 7.534 10.622 7.42192C10.7341 7.30985 10.798 7.15844 10.8 6.99995V3.94242C10.8066 3.90505 10.8096 3.86689 10.8089 3.82843C10.8079 3.77159 10.7988 3.7157 10.7824 3.6623C10.756 3.55552 10.701 3.45698 10.622 3.37798C10.5099 3.2659 10.3585 3.20202 10.2 3.19995H7.00002C6.84089 3.19995 6.68828 3.26317 6.57576 3.37569C6.46324 3.48821 6.40002 3.64082 6.40002 3.79995C6.40002 3.95908 6.46324 4.11169 6.57576 4.22422C6.68828 4.33674 6.84089 4.39995 7.00002 4.39995H8.80006L6.19997 7.00005C6.10158 7.11005 6.04718 7.25246 6.04718 7.40005C6.04718 7.54763 6.10158 7.69004 6.19997 7.80005C6.30202 7.91645 6.44561 7.98824 6.59997 8.00005C6.75432 7.98824 6.89791 7.91645 6.99997 7.80005L9.60002 5.26841V6.99995C9.6021 7.15844 9.66598 7.30985 9.77805 7.42192ZM1.4 14H3.8C4.17066 13.9979 4.52553 13.8498 4.78763 13.5877C5.04973 13.3256 5.1979 12.9707 5.2 12.6V10.2C5.1979 9.82939 5.04973 9.47452 4.78763 9.21242C4.52553 8.95032 4.17066 8.80215 3.8 8.80005H1.4C1.02934 8.80215 0.674468 8.95032 0.412371 9.21242C0.150274 9.47452 0.00210008 9.82939 0 10.2V12.6C0.00210008 12.9707 0.150274 13.3256 0.412371 13.5877C0.674468 13.8498 1.02934 13.9979 1.4 14ZM1.25858 10.0586C1.29609 10.0211 1.34696 10 1.4 10H3.8C3.85304 10 3.90391 10.0211 3.94142 10.0586C3.97893 10.0961 4 10.147 4 10.2V12.6C4 12.6531 3.97893 12.704 3.94142 12.7415C3.90391 12.779 3.85304 12.8 3.8 12.8H1.4C1.34696 12.8 1.29609 12.779 1.25858 12.7415C1.22107 12.704 1.2 12.6531 1.2 12.6V10.2C1.2 10.147 1.22107 10.0961 1.25858 10.0586Z",
                    "fill",
                    "currentColor",
                ],
                [3, "id"],
                ["width", "14", "height", "14", "fill", "white"],
            ],
            template: function (r, i) {
                (r & 1 &&
                    (pn(),
                    m(0, "svg", 0)(1, "g"),
                    D(2, "path", 1),
                    g(),
                    m(3, "defs")(4, "clipPath", 2),
                    D(5, "rect", 3),
                    g()()()),
                    r & 2 &&
                        (ke(i.getClassNames()),
                        se("aria-label", i.ariaLabel)(
                            "aria-hidden",
                            i.ariaHidden
                        )("role", i.role),
                        v(),
                        se("clip-path", i.pathId),
                        v(3),
                        b("id", i.pathId)));
            },
            encapsulation: 2,
        });
    }
    return e;
})();
var nb = (() => {
    class e extends cr {
        pathId;
        ngOnInit() {
            this.pathId = "url(#" + $t() + ")";
        }
        static ɵfac = (() => {
            let t;
            return function (i) {
                return (t || (t = te(e)))(i || e);
            };
        })();
        static ɵcmp = R({
            type: e,
            selectors: [["WindowMinimizeIcon"]],
            features: [be],
            decls: 6,
            vars: 7,
            consts: [
                [
                    "width",
                    "14",
                    "height",
                    "14",
                    "viewBox",
                    "0 0 14 14",
                    "fill",
                    "none",
                    "xmlns",
                    "http://www.w3.org/2000/svg",
                ],
                [
                    "fill-rule",
                    "evenodd",
                    "clip-rule",
                    "evenodd",
                    "d",
                    "M11.8 0H2.2C1.61652 0 1.05694 0.231785 0.644365 0.644365C0.231785 1.05694 0 1.61652 0 2.2V7C0 7.15913 0.063214 7.31174 0.175736 7.42426C0.288258 7.53679 0.44087 7.6 0.6 7.6C0.75913 7.6 0.911742 7.53679 1.02426 7.42426C1.13679 7.31174 1.2 7.15913 1.2 7V2.2C1.2 1.93478 1.30536 1.68043 1.49289 1.49289C1.68043 1.30536 1.93478 1.2 2.2 1.2H11.8C12.0652 1.2 12.3196 1.30536 12.5071 1.49289C12.6946 1.68043 12.8 1.93478 12.8 2.2V11.8C12.8 12.0652 12.6946 12.3196 12.5071 12.5071C12.3196 12.6946 12.0652 12.8 11.8 12.8H7C6.84087 12.8 6.68826 12.8632 6.57574 12.9757C6.46321 13.0883 6.4 13.2409 6.4 13.4C6.4 13.5591 6.46321 13.7117 6.57574 13.8243C6.68826 13.9368 6.84087 14 7 14H11.8C12.3835 14 12.9431 13.7682 13.3556 13.3556C13.7682 12.9431 14 12.3835 14 11.8V2.2C14 1.61652 13.7682 1.05694 13.3556 0.644365C12.9431 0.231785 12.3835 0 11.8 0ZM6.368 7.952C6.44137 7.98326 6.52025 7.99958 6.6 8H9.8C9.95913 8 10.1117 7.93678 10.2243 7.82426C10.3368 7.71174 10.4 7.55913 10.4 7.4C10.4 7.24087 10.3368 7.08826 10.2243 6.97574C10.1117 6.86321 9.95913 6.8 9.8 6.8H8.048L10.624 4.224C10.73 4.11026 10.7877 3.95982 10.7849 3.80438C10.7822 3.64894 10.7192 3.50063 10.6093 3.3907C10.4994 3.28077 10.3511 3.2178 10.1956 3.21506C10.0402 3.21232 9.88974 3.27002 9.776 3.376L7.2 5.952V4.2C7.2 4.04087 7.13679 3.88826 7.02426 3.77574C6.91174 3.66321 6.75913 3.6 6.6 3.6C6.44087 3.6 6.28826 3.66321 6.17574 3.77574C6.06321 3.88826 6 4.04087 6 4.2V7.4C6.00042 7.47975 6.01674 7.55862 6.048 7.632C6.07656 7.70442 6.11971 7.7702 6.17475 7.82524C6.2298 7.88029 6.29558 7.92344 6.368 7.952ZM1.4 8.80005H3.8C4.17066 8.80215 4.52553 8.95032 4.78763 9.21242C5.04973 9.47452 5.1979 9.82939 5.2 10.2V12.6C5.1979 12.9707 5.04973 13.3256 4.78763 13.5877C4.52553 13.8498 4.17066 13.9979 3.8 14H1.4C1.02934 13.9979 0.674468 13.8498 0.412371 13.5877C0.150274 13.3256 0.00210008 12.9707 0 12.6V10.2C0.00210008 9.82939 0.150274 9.47452 0.412371 9.21242C0.674468 8.95032 1.02934 8.80215 1.4 8.80005ZM3.94142 12.7415C3.97893 12.704 4 12.6531 4 12.6V10.2C4 10.147 3.97893 10.0961 3.94142 10.0586C3.90391 10.0211 3.85304 10 3.8 10H1.4C1.34696 10 1.29609 10.0211 1.25858 10.0586C1.22107 10.0961 1.2 10.147 1.2 10.2V12.6C1.2 12.6531 1.22107 12.704 1.25858 12.7415C1.29609 12.779 1.34696 12.8 1.4 12.8H3.8C3.85304 12.8 3.90391 12.779 3.94142 12.7415Z",
                    "fill",
                    "currentColor",
                ],
                [3, "id"],
                ["width", "14", "height", "14", "fill", "white"],
            ],
            template: function (r, i) {
                (r & 1 &&
                    (pn(),
                    m(0, "svg", 0)(1, "g"),
                    D(2, "path", 1),
                    g(),
                    m(3, "defs")(4, "clipPath", 2),
                    D(5, "rect", 3),
                    g()()()),
                    r & 2 &&
                        (ke(i.getClassNames()),
                        se("aria-label", i.ariaLabel)(
                            "aria-hidden",
                            i.ariaHidden
                        )("role", i.role),
                        v(),
                        se("clip-path", i.pathId),
                        v(3),
                        b("id", i.pathId)));
            },
            encapsulation: 2,
        });
    }
    return e;
})();
var NO = ({ dt: e }) => `
/* For PrimeNG */
.p-ripple {
    overflow: hidden;
    position: relative;
}

.p-ink {
    display: block;
    position: absolute;
    background: ${e("ripple.background")};
    border-radius: 100%;
    transform: scale(0);
}

.p-ink-active {
    animation: ripple 0.4s linear;
}

.p-ripple-disabled .p-ink {
    display: none !important;
}

@keyframes ripple {
    100% {
        opacity: 0;
        transform: scale(2.5);
    }
}
`,
    AO = { root: "p-ink" },
    rb = (() => {
        class e extends Ye {
            name = "ripple";
            theme = NO;
            classes = AO;
            static ɵfac = (() => {
                let t;
                return function (i) {
                    return (t || (t = te(e)))(i || e);
                };
            })();
            static ɵprov = w({ token: e, factory: e.ɵfac });
        }
        return e;
    })();
var ib = (() => {
    class e extends pt {
        zone = y(ne);
        _componentStyle = y(rb);
        animationListener;
        mouseDownListener;
        timeout;
        constructor() {
            (super(),
                $i(() => {
                    _n(this.platformId) &&
                        (this.config.ripple()
                            ? this.zone.runOutsideAngular(() => {
                                  (this.create(),
                                      (this.mouseDownListener =
                                          this.renderer.listen(
                                              this.el.nativeElement,
                                              "mousedown",
                                              this.onMouseDown.bind(this)
                                          )));
                              })
                            : this.remove());
                }));
        }
        ngAfterViewInit() {
            super.ngAfterViewInit();
        }
        onMouseDown(t) {
            let r = this.getInk();
            if (
                !r ||
                this.document.defaultView?.getComputedStyle(r, null).display ===
                    "none"
            )
                return;
            if ((Zt(r, "p-ink-active"), !Gf(r) && !Yf(r))) {
                let a = Math.max(
                    cs(this.el.nativeElement),
                    ji(this.el.nativeElement)
                );
                ((r.style.height = a + "px"), (r.style.width = a + "px"));
            }
            let i = Rv(this.el.nativeElement),
                o = t.pageX - i.left + this.document.body.scrollTop - Yf(r) / 2,
                s = t.pageY - i.top + this.document.body.scrollLeft - Gf(r) / 2;
            (this.renderer.setStyle(r, "top", s + "px"),
                this.renderer.setStyle(r, "left", o + "px"),
                Un(r, "p-ink-active"),
                (this.timeout = setTimeout(() => {
                    let a = this.getInk();
                    a && Zt(a, "p-ink-active");
                }, 401)));
        }
        getInk() {
            let t = this.el.nativeElement.children;
            for (let r = 0; r < t.length; r++)
                if (
                    typeof t[r].className == "string" &&
                    t[r].className.indexOf("p-ink") !== -1
                )
                    return t[r];
            return null;
        }
        resetInk() {
            let t = this.getInk();
            t && Zt(t, "p-ink-active");
        }
        onAnimationEnd(t) {
            (this.timeout && clearTimeout(this.timeout),
                Zt(t.currentTarget, "p-ink-active"));
        }
        create() {
            let t = this.renderer.createElement("span");
            (this.renderer.addClass(t, "p-ink"),
                this.renderer.appendChild(this.el.nativeElement, t),
                this.renderer.setAttribute(t, "aria-hidden", "true"),
                this.renderer.setAttribute(t, "role", "presentation"),
                this.animationListener ||
                    (this.animationListener = this.renderer.listen(
                        t,
                        "animationend",
                        this.onAnimationEnd.bind(this)
                    )));
        }
        remove() {
            let t = this.getInk();
            t &&
                (this.mouseDownListener && this.mouseDownListener(),
                this.animationListener && this.animationListener(),
                (this.mouseDownListener = null),
                (this.animationListener = null),
                kv(t));
        }
        ngOnDestroy() {
            (this.config && this.config.ripple() && this.remove(),
                super.ngOnDestroy());
        }
        static ɵfac = function (r) {
            return new (r || e)();
        };
        static ɵdir = Me({
            type: e,
            selectors: [["", "pRipple", ""]],
            hostAttrs: [1, "p-ripple"],
            features: [Rt([rb]), be],
        });
    }
    return e;
})();
var RO = ["content"],
    kO = ["loadingicon"],
    LO = ["icon"],
    FO = ["*"],
    sb = (e) => ({ class: e });
function $O(e, n) {
    e & 1 && rr(0);
}
function VO(e, n) {
    if ((e & 1 && D(0, "span", 8), e & 2)) {
        let t = G(3);
        (b("ngClass", t.iconClass()),
            se("aria-hidden", !0)("data-pc-section", "loadingicon"));
    }
}
function jO(e, n) {
    if ((e & 1 && D(0, "SpinnerIcon", 9), e & 2)) {
        let t = G(3);
        (b("styleClass", t.spinnerIconClass())("spin", !0),
            se("aria-hidden", !0)("data-pc-section", "loadingicon"));
    }
}
function BO(e, n) {
    if (
        (e & 1 &&
            (ut(0),
            P(1, VO, 1, 3, "span", 6)(2, jO, 1, 4, "SpinnerIcon", 7),
            dt()),
        e & 2)
    ) {
        let t = G(2);
        (v(), b("ngIf", t.loadingIcon), v(), b("ngIf", !t.loadingIcon));
    }
}
function UO(e, n) {}
function HO(e, n) {
    if ((e & 1 && P(0, UO, 0, 0, "ng-template", 10), e & 2)) {
        let t = G(2);
        b("ngIf", t.loadingIconTemplate || t._loadingIconTemplate);
    }
}
function zO(e, n) {
    if (
        (e & 1 &&
            (ut(0),
            P(1, BO, 3, 2, "ng-container", 2)(2, HO, 1, 1, null, 5),
            dt()),
        e & 2)
    ) {
        let t = G();
        (v(),
            b("ngIf", !t.loadingIconTemplate && !t._loadingIconTemplate),
            v(),
            b(
                "ngTemplateOutlet",
                t.loadingIconTemplate || t._loadingIconTemplate
            )("ngTemplateOutletContext", Fi(3, sb, t.iconClass())));
    }
}
function WO(e, n) {
    if ((e & 1 && D(0, "span", 8), e & 2)) {
        let t = G(2);
        (ke(t.icon),
            b("ngClass", t.iconClass()),
            se("data-pc-section", "icon"));
    }
}
function qO(e, n) {}
function GO(e, n) {
    if ((e & 1 && P(0, qO, 0, 0, "ng-template", 10), e & 2)) {
        let t = G(2);
        b("ngIf", !t.icon && (t.iconTemplate || t._iconTemplate));
    }
}
function YO(e, n) {
    if (
        (e & 1 &&
            (ut(0), P(1, WO, 1, 4, "span", 11)(2, GO, 1, 1, null, 5), dt()),
        e & 2)
    ) {
        let t = G();
        (v(),
            b("ngIf", t.icon && !t.iconTemplate && !t._iconTemplate),
            v(),
            b("ngTemplateOutlet", t.iconTemplate || t._iconTemplate)(
                "ngTemplateOutletContext",
                Fi(3, sb, t.iconClass())
            ));
    }
}
function KO(e, n) {
    if ((e & 1 && (m(0, "span", 12), C(1), g()), e & 2)) {
        let t = G();
        (se("aria-hidden", t.icon && !t.label)("data-pc-section", "label"),
            v(),
            Ce(t.label));
    }
}
function QO(e, n) {
    if ((e & 1 && D(0, "p-badge", 13), e & 2)) {
        let t = G();
        b("value", t.badge)("severity", t.badgeSeverity);
    }
}
var ZO = ({ dt: e }) => `
.p-button {
    display: inline-flex;
    cursor: pointer;
    user-select: none;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
    color: ${e("button.primary.color")};
    background: ${e("button.primary.background")};
    border: 1px solid ${e("button.primary.border.color")};
    padding-block: ${e("button.padding.y")};
    padding-inline: ${e("button.padding.x")};
    font-size: 1rem;
    font-family: inherit;
    font-feature-settings: inherit;
    transition: background ${e("button.transition.duration")}, color ${e("button.transition.duration")}, border-color ${e("button.transition.duration")},
            outline-color ${e("button.transition.duration")}, box-shadow ${e("button.transition.duration")};
    border-radius: ${e("button.border.radius")};
    outline-color: transparent;
    gap: ${e("button.gap")};
}

.p-button-icon,
.p-button-icon:before,
.p-button-icon:after {
    line-height: inherit;
}

.p-button:disabled {
    cursor: default;
}

.p-button-icon-right {
    order: 1;
}

.p-button-icon-right:dir(rtl) {
    order: -1;
}

.p-button:not(.p-button-vertical) .p-button-icon:not(.p-button-icon-right):dir(rtl) {
    order: 1;
}

.p-button-icon-bottom {
    order: 2;
}

.p-button-icon-only {
    width: ${e("button.icon.only.width")};
    padding-inline-start: 0;
    padding-inline-end: 0;
    gap: 0;
}

.p-button-icon-only.p-button-rounded {
    border-radius: 50%;
    height: ${e("button.icon.only.width")};
}

.p-button-icon-only .p-button-label {
    visibility: hidden;
    width: 0;
}

.p-button-sm {
    font-size: ${e("button.sm.font.size")};
    padding-block: ${e("button.sm.padding.y")};
    padding-inline: ${e("button.sm.padding.x")};
}

.p-button-sm .p-button-icon {
    font-size: ${e("button.sm.font.size")};
}

.p-button-sm.p-button-icon-only {
    width: ${e("button.sm.icon.only.width")};
}

.p-button-sm.p-button-icon-only.p-button-rounded {
    height: ${e("button.sm.icon.only.width")};
}

.p-button-lg {
    font-size: ${e("button.lg.font.size")};
    padding-block: ${e("button.lg.padding.y")};
    padding-inline: ${e("button.lg.padding.x")};
}

.p-button-lg .p-button-icon {
    font-size: ${e("button.lg.font.size")};
}

.p-button-lg.p-button-icon-only {
    width: ${e("button.lg.icon.only.width")};
}

.p-button-lg.p-button-icon-only.p-button-rounded {
    height: ${e("button.lg.icon.only.width")};
}

.p-button-vertical {
    flex-direction: column;
}

.p-button-label {
    font-weight: ${e("button.label.font.weight")};
}

.p-button-fluid {
    width: 100%;
}

.p-button-fluid.p-button-icon-only {
    width: ${e("button.icon.only.width")};
}

.p-button:not(:disabled):hover {
    background: ${e("button.primary.hover.background")};
    border: 1px solid ${e("button.primary.hover.border.color")};
    color: ${e("button.primary.hover.color")};
}

.p-button:not(:disabled):active {
    background: ${e("button.primary.active.background")};
    border: 1px solid ${e("button.primary.active.border.color")};
    color: ${e("button.primary.active.color")};
}

.p-button:focus-visible {
    box-shadow: ${e("button.primary.focus.ring.shadow")};
    outline: ${e("button.focus.ring.width")} ${e("button.focus.ring.style")} ${e("button.primary.focus.ring.color")};
    outline-offset: ${e("button.focus.ring.offset")};
}

.p-button .p-badge {
    min-width: ${e("button.badge.size")};
    height: ${e("button.badge.size")};
    line-height: ${e("button.badge.size")};
}

.p-button-raised {
    box-shadow: ${e("button.raised.shadow")};
}

.p-button-rounded {
    border-radius: ${e("button.rounded.border.radius")};
}

.p-button-secondary {
    background: ${e("button.secondary.background")};
    border: 1px solid ${e("button.secondary.border.color")};
    color: ${e("button.secondary.color")};
}

.p-button-secondary:not(:disabled):hover {
    background: ${e("button.secondary.hover.background")};
    border: 1px solid ${e("button.secondary.hover.border.color")};
    color: ${e("button.secondary.hover.color")};
}

.p-button-secondary:not(:disabled):active {
    background: ${e("button.secondary.active.background")};
    border: 1px solid ${e("button.secondary.active.border.color")};
    color: ${e("button.secondary.active.color")};
}

.p-button-secondary:focus-visible {
    outline-color: ${e("button.secondary.focus.ring.color")};
    box-shadow: ${e("button.secondary.focus.ring.shadow")};
}

.p-button-success {
    background: ${e("button.success.background")};
    border: 1px solid ${e("button.success.border.color")};
    color: ${e("button.success.color")};
}

.p-button-success:not(:disabled):hover {
    background: ${e("button.success.hover.background")};
    border: 1px solid ${e("button.success.hover.border.color")};
    color: ${e("button.success.hover.color")};
}

.p-button-success:not(:disabled):active {
    background: ${e("button.success.active.background")};
    border: 1px solid ${e("button.success.active.border.color")};
    color: ${e("button.success.active.color")};
}

.p-button-success:focus-visible {
    outline-color: ${e("button.success.focus.ring.color")};
    box-shadow: ${e("button.success.focus.ring.shadow")};
}

.p-button-info {
    background: ${e("button.info.background")};
    border: 1px solid ${e("button.info.border.color")};
    color: ${e("button.info.color")};
}

.p-button-info:not(:disabled):hover {
    background: ${e("button.info.hover.background")};
    border: 1px solid ${e("button.info.hover.border.color")};
    color: ${e("button.info.hover.color")};
}

.p-button-info:not(:disabled):active {
    background: ${e("button.info.active.background")};
    border: 1px solid ${e("button.info.active.border.color")};
    color: ${e("button.info.active.color")};
}

.p-button-info:focus-visible {
    outline-color: ${e("button.info.focus.ring.color")};
    box-shadow: ${e("button.info.focus.ring.shadow")};
}

.p-button-warn {
    background: ${e("button.warn.background")};
    border: 1px solid ${e("button.warn.border.color")};
    color: ${e("button.warn.color")};
}

.p-button-warn:not(:disabled):hover {
    background: ${e("button.warn.hover.background")};
    border: 1px solid ${e("button.warn.hover.border.color")};
    color: ${e("button.warn.hover.color")};
}

.p-button-warn:not(:disabled):active {
    background: ${e("button.warn.active.background")};
    border: 1px solid ${e("button.warn.active.border.color")};
    color: ${e("button.warn.active.color")};
}

.p-button-warn:focus-visible {
    outline-color: ${e("button.warn.focus.ring.color")};
    box-shadow: ${e("button.warn.focus.ring.shadow")};
}

.p-button-help {
    background: ${e("button.help.background")};
    border: 1px solid ${e("button.help.border.color")};
    color: ${e("button.help.color")};
}

.p-button-help:not(:disabled):hover {
    background: ${e("button.help.hover.background")};
    border: 1px solid ${e("button.help.hover.border.color")};
    color: ${e("button.help.hover.color")};
}

.p-button-help:not(:disabled):active {
    background: ${e("button.help.active.background")};
    border: 1px solid ${e("button.help.active.border.color")};
    color: ${e("button.help.active.color")};
}

.p-button-help:focus-visible {
    outline-color: ${e("button.help.focus.ring.color")};
    box-shadow: ${e("button.help.focus.ring.shadow")};
}

.p-button-danger {
    background: ${e("button.danger.background")};
    border: 1px solid ${e("button.danger.border.color")};
    color: ${e("button.danger.color")};
}

.p-button-danger:not(:disabled):hover {
    background: ${e("button.danger.hover.background")};
    border: 1px solid ${e("button.danger.hover.border.color")};
    color: ${e("button.danger.hover.color")};
}

.p-button-danger:not(:disabled):active {
    background: ${e("button.danger.active.background")};
    border: 1px solid ${e("button.danger.active.border.color")};
    color: ${e("button.danger.active.color")};
}

.p-button-danger:focus-visible {
    outline-color: ${e("button.danger.focus.ring.color")};
    box-shadow: ${e("button.danger.focus.ring.shadow")};
}

.p-button-contrast {
    background: ${e("button.contrast.background")};
    border: 1px solid ${e("button.contrast.border.color")};
    color: ${e("button.contrast.color")};
}

.p-button-contrast:not(:disabled):hover {
    background: ${e("button.contrast.hover.background")};
    border: 1px solid ${e("button.contrast.hover.border.color")};
    color: ${e("button.contrast.hover.color")};
}

.p-button-contrast:not(:disabled):active {
    background: ${e("button.contrast.active.background")};
    border: 1px solid ${e("button.contrast.active.border.color")};
    color: ${e("button.contrast.active.color")};
}

.p-button-contrast:focus-visible {
    outline-color: ${e("button.contrast.focus.ring.color")};
    box-shadow: ${e("button.contrast.focus.ring.shadow")};
}

.p-button-outlined {
    background: transparent;
    border-color: ${e("button.outlined.primary.border.color")};
    color: ${e("button.outlined.primary.color")};
}

.p-button-outlined:not(:disabled):hover {
    background: ${e("button.outlined.primary.hover.background")};
    border-color: ${e("button.outlined.primary.border.color")};
    color: ${e("button.outlined.primary.color")};
}

.p-button-outlined:not(:disabled):active {
    background: ${e("button.outlined.primary.active.background")};
    border-color: ${e("button.outlined.primary.border.color")};
    color: ${e("button.outlined.primary.color")};
}

.p-button-outlined.p-button-secondary {
    border-color: ${e("button.outlined.secondary.border.color")};
    color: ${e("button.outlined.secondary.color")};
}

.p-button-outlined.p-button-secondary:not(:disabled):hover {
    background: ${e("button.outlined.secondary.hover.background")};
    border-color: ${e("button.outlined.secondary.border.color")};
    color: ${e("button.outlined.secondary.color")};
}

.p-button-outlined.p-button-secondary:not(:disabled):active {
    background: ${e("button.outlined.secondary.active.background")};
    border-color: ${e("button.outlined.secondary.border.color")};
    color: ${e("button.outlined.secondary.color")};
}

.p-button-outlined.p-button-success {
    border-color: ${e("button.outlined.success.border.color")};
    color: ${e("button.outlined.success.color")};
}

.p-button-outlined.p-button-success:not(:disabled):hover {
    background: ${e("button.outlined.success.hover.background")};
    border-color: ${e("button.outlined.success.border.color")};
    color: ${e("button.outlined.success.color")};
}

.p-button-outlined.p-button-success:not(:disabled):active {
    background: ${e("button.outlined.success.active.background")};
    border-color: ${e("button.outlined.success.border.color")};
    color: ${e("button.outlined.success.color")};
}

.p-button-outlined.p-button-info {
    border-color: ${e("button.outlined.info.border.color")};
    color: ${e("button.outlined.info.color")};
}

.p-button-outlined.p-button-info:not(:disabled):hover {
    background: ${e("button.outlined.info.hover.background")};
    border-color: ${e("button.outlined.info.border.color")};
    color: ${e("button.outlined.info.color")};
}

.p-button-outlined.p-button-info:not(:disabled):active {
    background: ${e("button.outlined.info.active.background")};
    border-color: ${e("button.outlined.info.border.color")};
    color: ${e("button.outlined.info.color")};
}

.p-button-outlined.p-button-warn {
    border-color: ${e("button.outlined.warn.border.color")};
    color: ${e("button.outlined.warn.color")};
}

.p-button-outlined.p-button-warn:not(:disabled):hover {
    background: ${e("button.outlined.warn.hover.background")};
    border-color: ${e("button.outlined.warn.border.color")};
    color: ${e("button.outlined.warn.color")};
}

.p-button-outlined.p-button-warn:not(:disabled):active {
    background: ${e("button.outlined.warn.active.background")};
    border-color: ${e("button.outlined.warn.border.color")};
    color: ${e("button.outlined.warn.color")};
}

.p-button-outlined.p-button-help {
    border-color: ${e("button.outlined.help.border.color")};
    color: ${e("button.outlined.help.color")};
}

.p-button-outlined.p-button-help:not(:disabled):hover {
    background: ${e("button.outlined.help.hover.background")};
    border-color: ${e("button.outlined.help.border.color")};
    color: ${e("button.outlined.help.color")};
}

.p-button-outlined.p-button-help:not(:disabled):active {
    background: ${e("button.outlined.help.active.background")};
    border-color: ${e("button.outlined.help.border.color")};
    color: ${e("button.outlined.help.color")};
}

.p-button-outlined.p-button-danger {
    border-color: ${e("button.outlined.danger.border.color")};
    color: ${e("button.outlined.danger.color")};
}

.p-button-outlined.p-button-danger:not(:disabled):hover {
    background: ${e("button.outlined.danger.hover.background")};
    border-color: ${e("button.outlined.danger.border.color")};
    color: ${e("button.outlined.danger.color")};
}

.p-button-outlined.p-button-danger:not(:disabled):active {
    background: ${e("button.outlined.danger.active.background")};
    border-color: ${e("button.outlined.danger.border.color")};
    color: ${e("button.outlined.danger.color")};
}

.p-button-outlined.p-button-contrast {
    border-color: ${e("button.outlined.contrast.border.color")};
    color: ${e("button.outlined.contrast.color")};
}

.p-button-outlined.p-button-contrast:not(:disabled):hover {
    background: ${e("button.outlined.contrast.hover.background")};
    border-color: ${e("button.outlined.contrast.border.color")};
    color: ${e("button.outlined.contrast.color")};
}

.p-button-outlined.p-button-contrast:not(:disabled):active {
    background: ${e("button.outlined.contrast.active.background")};
    border-color: ${e("button.outlined.contrast.border.color")};
    color: ${e("button.outlined.contrast.color")};
}

.p-button-outlined.p-button-plain {
    border-color: ${e("button.outlined.plain.border.color")};
    color: ${e("button.outlined.plain.color")};
}

.p-button-outlined.p-button-plain:not(:disabled):hover {
    background: ${e("button.outlined.plain.hover.background")};
    border-color: ${e("button.outlined.plain.border.color")};
    color: ${e("button.outlined.plain.color")};
}

.p-button-outlined.p-button-plain:not(:disabled):active {
    background: ${e("button.outlined.plain.active.background")};
    border-color: ${e("button.outlined.plain.border.color")};
    color: ${e("button.outlined.plain.color")};
}

.p-button-text {
    background: transparent;
    border-color: transparent;
    color: ${e("button.text.primary.color")};
}

.p-button-text:not(:disabled):hover {
    background: ${e("button.text.primary.hover.background")};
    border-color: transparent;
    color: ${e("button.text.primary.color")};
}

.p-button-text:not(:disabled):active {
    background: ${e("button.text.primary.active.background")};
    border-color: transparent;
    color: ${e("button.text.primary.color")};
}

.p-button-text.p-button-secondary {
    background: transparent;
    border-color: transparent;
    color: ${e("button.text.secondary.color")};
}

.p-button-text.p-button-secondary:not(:disabled):hover {
    background: ${e("button.text.secondary.hover.background")};
    border-color: transparent;
    color: ${e("button.text.secondary.color")};
}

.p-button-text.p-button-secondary:not(:disabled):active {
    background: ${e("button.text.secondary.active.background")};
    border-color: transparent;
    color: ${e("button.text.secondary.color")};
}

.p-button-text.p-button-success {
    background: transparent;
    border-color: transparent;
    color: ${e("button.text.success.color")};
}

.p-button-text.p-button-success:not(:disabled):hover {
    background: ${e("button.text.success.hover.background")};
    border-color: transparent;
    color: ${e("button.text.success.color")};
}

.p-button-text.p-button-success:not(:disabled):active {
    background: ${e("button.text.success.active.background")};
    border-color: transparent;
    color: ${e("button.text.success.color")};
}

.p-button-text.p-button-info {
    background: transparent;
    border-color: transparent;
    color: ${e("button.text.info.color")};
}

.p-button-text.p-button-info:not(:disabled):hover {
    background: ${e("button.text.info.hover.background")};
    border-color: transparent;
    color: ${e("button.text.info.color")};
}

.p-button-text.p-button-info:not(:disabled):active {
    background: ${e("button.text.info.active.background")};
    border-color: transparent;
    color: ${e("button.text.info.color")};
}

.p-button-text.p-button-warn {
    background: transparent;
    border-color: transparent;
    color: ${e("button.text.warn.color")};
}

.p-button-text.p-button-warn:not(:disabled):hover {
    background: ${e("button.text.warn.hover.background")};
    border-color: transparent;
    color: ${e("button.text.warn.color")};
}

.p-button-text.p-button-warn:not(:disabled):active {
    background: ${e("button.text.warn.active.background")};
    border-color: transparent;
    color: ${e("button.text.warn.color")};
}

.p-button-text.p-button-help {
    background: transparent;
    border-color: transparent;
    color: ${e("button.text.help.color")};
}

.p-button-text.p-button-help:not(:disabled):hover {
    background: ${e("button.text.help.hover.background")};
    border-color: transparent;
    color: ${e("button.text.help.color")};
}

.p-button-text.p-button-help:not(:disabled):active {
    background: ${e("button.text.help.active.background")};
    border-color: transparent;
    color: ${e("button.text.help.color")};
}

.p-button-text.p-button-danger {
    background: transparent;
    border-color: transparent;
    color: ${e("button.text.danger.color")};
}

.p-button-text.p-button-danger:not(:disabled):hover {
    background: ${e("button.text.danger.hover.background")};
    border-color: transparent;
    color: ${e("button.text.danger.color")};
}

.p-button-text.p-button-danger:not(:disabled):active {
    background: ${e("button.text.danger.active.background")};
    border-color: transparent;
    color: ${e("button.text.danger.color")};
}

.p-button-text.p-button-plain {
    background: transparent;
    border-color: transparent;
    color: ${e("button.text.plain.color")};
}

.p-button-text.p-button-plain:not(:disabled):hover {
    background: ${e("button.text.plain.hover.background")};
    border-color: transparent;
    color: ${e("button.text.plain.color")};
}

.p-button-text.p-button-plain:not(:disabled):active {
    background: ${e("button.text.plain.active.background")};
    border-color: transparent;
    color: ${e("button.text.plain.color")};
}

.p-button-text.p-button-contrast {
    background: transparent;
    border-color: transparent;
    color: ${e("button.text.contrast.color")};
}

.p-button-text.p-button-contrast:not(:disabled):hover {
    background: ${e("button.text.contrast.hover.background")};
    border-color: transparent;
    color: ${e("button.text.contrast.color")};
}

.p-button-text.p-button-contrast:not(:disabled):active {
    background: ${e("button.text.contrast.active.background")};
    border-color: transparent;
    color: ${e("button.text.contrast.color")};
}

.p-button-link {
    background: transparent;
    border-color: transparent;
    color: ${e("button.link.color")};
}

.p-button-link:not(:disabled):hover {
    background: transparent;
    border-color: transparent;
    color: ${e("button.link.hover.color")};
}

.p-button-link:not(:disabled):hover .p-button-label {
    text-decoration: underline;
}

.p-button-link:not(:disabled):active {
    background: transparent;
    border-color: transparent;
    color: ${e("button.link.active.color")};
}

/* For PrimeNG */
.p-button-icon-right {
    order: 1;
}

p-button[iconpos='right'] spinnericon {
    order: 1;
}
`,
    XO = {
        root: ({ instance: e, props: n }) => [
            "p-button p-component",
            {
                "p-button-icon-only": e.hasIcon && !n.label && !n.badge,
                "p-button-vertical":
                    (n.iconPos === "top" || n.iconPos === "bottom") && n.label,
                "p-button-loading": n.loading,
                "p-button-link": n.link,
                [`p-button-${n.severity}`]: n.severity,
                "p-button-raised": n.raised,
                "p-button-rounded": n.rounded,
                "p-button-text": n.text,
                "p-button-outlined": n.outlined,
                "p-button-sm": n.size === "small",
                "p-button-lg": n.size === "large",
                "p-button-plain": n.plain,
                "p-button-fluid": n.fluid,
            },
        ],
        loadingIcon: "p-button-loading-icon",
        icon: ({ props: e }) => [
            "p-button-icon",
            { [`p-button-icon-${e.iconPos}`]: e.label },
        ],
        label: "p-button-label",
    },
    ob = (() => {
        class e extends Ye {
            name = "button";
            theme = ZO;
            classes = XO;
            static ɵfac = (() => {
                let t;
                return function (i) {
                    return (t || (t = te(e)))(i || e);
                };
            })();
            static ɵprov = w({ token: e, factory: e.ɵfac });
        }
        return e;
    })();
var ab = (() => {
    class e extends pt {
        type = "button";
        iconPos = "left";
        icon;
        badge;
        label;
        disabled;
        loading = !1;
        loadingIcon;
        raised = !1;
        rounded = !1;
        text = !1;
        plain = !1;
        severity;
        outlined = !1;
        link = !1;
        tabindex;
        size;
        variant;
        style;
        styleClass;
        badgeClass;
        badgeSeverity = "secondary";
        ariaLabel;
        autofocus;
        fluid;
        onClick = new pe();
        onFocus = new pe();
        onBlur = new pe();
        contentTemplate;
        loadingIconTemplate;
        iconTemplate;
        _buttonProps;
        get buttonProps() {
            return this._buttonProps;
        }
        set buttonProps(t) {
            ((this._buttonProps = t),
                t &&
                    typeof t == "object" &&
                    Object.entries(t).forEach(
                        ([r, i]) => this[`_${r}`] !== i && (this[`_${r}`] = i)
                    ));
        }
        get hasFluid() {
            let r = this.el.nativeElement.closest("p-fluid");
            return Ft(this.fluid) ? !!r : this.fluid;
        }
        _componentStyle = y(ob);
        templates;
        _contentTemplate;
        _iconTemplate;
        _loadingIconTemplate;
        ngAfterContentInit() {
            this.templates?.forEach((t) => {
                switch (t.getType()) {
                    case "content":
                        this._contentTemplate = t.template;
                        break;
                    case "icon":
                        this._iconTemplate = t.template;
                        break;
                    case "loadingicon":
                        this._loadingIconTemplate = t.template;
                        break;
                    default:
                        this._contentTemplate = t.template;
                        break;
                }
            });
        }
        ngOnChanges(t) {
            super.ngOnChanges(t);
            let { buttonProps: r } = t;
            if (r) {
                let i = r.currentValue;
                for (let o in i) this[o] = i[o];
            }
        }
        spinnerIconClass() {
            return Object.entries(this.iconClass())
                .filter(([, t]) => !!t)
                .reduce((t, [r]) => t + ` ${r}`, "p-button-loading-icon");
        }
        iconClass() {
            return {
                [`p-button-loading-icon pi-spin ${this.loadingIcon ?? ""}`]:
                    this.loading,
                "p-button-icon": !0,
                "p-button-icon-left": this.iconPos === "left" && this.label,
                "p-button-icon-right": this.iconPos === "right" && this.label,
                "p-button-icon-top": this.iconPos === "top" && this.label,
                "p-button-icon-bottom": this.iconPos === "bottom" && this.label,
            };
        }
        get buttonClass() {
            return {
                "p-button p-component": !0,
                "p-button-icon-only":
                    (this.icon ||
                        this.iconTemplate ||
                        this._iconTemplate ||
                        this.loadingIcon ||
                        this.loadingIconTemplate ||
                        this._loadingIconTemplate) &&
                    !this.label,
                "p-button-vertical":
                    (this.iconPos === "top" || this.iconPos === "bottom") &&
                    this.label,
                "p-button-loading": this.loading,
                "p-button-loading-label-only":
                    this.loading &&
                    !this.icon &&
                    this.label &&
                    !this.loadingIcon &&
                    this.iconPos === "left",
                "p-button-link": this.link,
                [`p-button-${this.severity}`]: this.severity,
                "p-button-raised": this.raised,
                "p-button-rounded": this.rounded,
                "p-button-text": this.text || this.variant == "text",
                "p-button-outlined":
                    this.outlined || this.variant == "outlined",
                "p-button-sm": this.size === "small",
                "p-button-lg": this.size === "large",
                "p-button-plain": this.plain,
                "p-button-fluid": this.hasFluid,
                [`${this.styleClass}`]: this.styleClass,
            };
        }
        static ɵfac = (() => {
            let t;
            return function (i) {
                return (t || (t = te(e)))(i || e);
            };
        })();
        static ɵcmp = R({
            type: e,
            selectors: [["p-button"]],
            contentQueries: function (r, i, o) {
                if (
                    (r & 1 &&
                        (nt(o, RO, 5),
                        nt(o, kO, 5),
                        nt(o, LO, 5),
                        nt(o, Bi, 4)),
                    r & 2)
                ) {
                    let s;
                    (Fe((s = $e())) && (i.contentTemplate = s.first),
                        Fe((s = $e())) && (i.loadingIconTemplate = s.first),
                        Fe((s = $e())) && (i.iconTemplate = s.first),
                        Fe((s = $e())) && (i.templates = s));
                }
            },
            inputs: {
                type: "type",
                iconPos: "iconPos",
                icon: "icon",
                badge: "badge",
                label: "label",
                disabled: [2, "disabled", "disabled", K],
                loading: [2, "loading", "loading", K],
                loadingIcon: "loadingIcon",
                raised: [2, "raised", "raised", K],
                rounded: [2, "rounded", "rounded", K],
                text: [2, "text", "text", K],
                plain: [2, "plain", "plain", K],
                severity: "severity",
                outlined: [2, "outlined", "outlined", K],
                link: [2, "link", "link", K],
                tabindex: [2, "tabindex", "tabindex", kr],
                size: "size",
                variant: "variant",
                style: "style",
                styleClass: "styleClass",
                badgeClass: "badgeClass",
                badgeSeverity: "badgeSeverity",
                ariaLabel: "ariaLabel",
                autofocus: [2, "autofocus", "autofocus", K],
                fluid: [2, "fluid", "fluid", K],
                buttonProps: "buttonProps",
            },
            outputs: {
                onClick: "onClick",
                onFocus: "onFocus",
                onBlur: "onBlur",
            },
            features: [Rt([ob]), be, At],
            ngContentSelectors: FO,
            decls: 7,
            vars: 14,
            consts: [
                [
                    "pRipple",
                    "",
                    3,
                    "click",
                    "focus",
                    "blur",
                    "ngStyle",
                    "disabled",
                    "ngClass",
                    "pAutoFocus",
                ],
                [4, "ngTemplateOutlet"],
                [4, "ngIf"],
                ["class", "p-button-label", 4, "ngIf"],
                [3, "value", "severity", 4, "ngIf"],
                [4, "ngTemplateOutlet", "ngTemplateOutletContext"],
                [3, "ngClass", 4, "ngIf"],
                [3, "styleClass", "spin", 4, "ngIf"],
                [3, "ngClass"],
                [3, "styleClass", "spin"],
                [3, "ngIf"],
                [3, "class", "ngClass", 4, "ngIf"],
                [1, "p-button-label"],
                [3, "value", "severity"],
            ],
            template: function (r, i) {
                (r & 1 &&
                    (Ct(),
                    m(0, "button", 0),
                    qe("click", function (s) {
                        return i.onClick.emit(s);
                    })("focus", function (s) {
                        return i.onFocus.emit(s);
                    })("blur", function (s) {
                        return i.onBlur.emit(s);
                    }),
                    Ge(1),
                    P(2, $O, 1, 0, "ng-container", 1)(
                        3,
                        zO,
                        3,
                        5,
                        "ng-container",
                        2
                    )(4, YO, 3, 5, "ng-container", 2)(5, KO, 2, 3, "span", 3)(
                        6,
                        QO,
                        1,
                        2,
                        "p-badge",
                        4
                    ),
                    g()),
                    r & 2 &&
                        (b("ngStyle", i.style)(
                            "disabled",
                            i.disabled || i.loading
                        )("ngClass", i.buttonClass)("pAutoFocus", i.autofocus),
                        se("type", i.type)("aria-label", i.ariaLabel)(
                            "data-pc-name",
                            "button"
                        )("data-pc-section", "root")("tabindex", i.tabindex),
                        v(2),
                        b(
                            "ngTemplateOutlet",
                            i.contentTemplate || i._contentTemplate
                        ),
                        v(),
                        b("ngIf", i.loading),
                        v(),
                        b("ngIf", !i.loading),
                        v(),
                        b(
                            "ngIf",
                            !i.contentTemplate && !i._contentTemplate && i.label
                        ),
                        v(),
                        b(
                            "ngIf",
                            !i.contentTemplate && !i._contentTemplate && i.badge
                        )));
            },
            dependencies: [Qt, Jo, Et, ts, es, ib, Q0, J0, X0, Up, yn],
            encapsulation: 2,
            changeDetection: 0,
        });
    }
    return e;
})();
var lb = (() => {
    class e extends pt {
        pFocusTrapDisabled = !1;
        platformId = y(ct);
        document = y(re);
        firstHiddenFocusableElement;
        lastHiddenFocusableElement;
        ngOnInit() {
            (super.ngOnInit(),
                _n(this.platformId) &&
                    !this.pFocusTrapDisabled &&
                    !this.firstHiddenFocusableElement &&
                    !this.lastHiddenFocusableElement &&
                    this.createHiddenFocusableElements());
        }
        ngOnChanges(t) {
            (super.ngOnChanges(t),
                t.pFocusTrapDisabled &&
                    _n(this.platformId) &&
                    (t.pFocusTrapDisabled.currentValue
                        ? this.removeHiddenFocusableElements()
                        : this.createHiddenFocusableElements()));
        }
        removeHiddenFocusableElements() {
            (this.firstHiddenFocusableElement &&
                this.firstHiddenFocusableElement.parentNode &&
                this.firstHiddenFocusableElement.parentNode.removeChild(
                    this.firstHiddenFocusableElement
                ),
                this.lastHiddenFocusableElement &&
                    this.lastHiddenFocusableElement.parentNode &&
                    this.lastHiddenFocusableElement.parentNode.removeChild(
                        this.lastHiddenFocusableElement
                    ));
        }
        getComputedSelector(t) {
            return `:not(.p-hidden-focusable):not([data-p-hidden-focusable="true"])${t ?? ""}`;
        }
        createHiddenFocusableElements() {
            let t = "0",
                r = (i) =>
                    Ov("span", {
                        class: "p-hidden-accessible p-hidden-focusable",
                        tabindex: t,
                        role: "presentation",
                        "aria-hidden": !0,
                        "data-p-hidden-accessible": !0,
                        "data-p-hidden-focusable": !0,
                        onFocus: i?.bind(this),
                    });
            ((this.firstHiddenFocusableElement = r(
                this.onFirstHiddenElementFocus
            )),
                (this.lastHiddenFocusableElement = r(
                    this.onLastHiddenElementFocus
                )),
                this.firstHiddenFocusableElement.setAttribute(
                    "data-pc-section",
                    "firstfocusableelement"
                ),
                this.lastHiddenFocusableElement.setAttribute(
                    "data-pc-section",
                    "lastfocusableelement"
                ),
                this.el.nativeElement.prepend(this.firstHiddenFocusableElement),
                this.el.nativeElement.append(this.lastHiddenFocusableElement));
        }
        onFirstHiddenElementFocus(t) {
            let { currentTarget: r, relatedTarget: i } = t,
                o =
                    i === this.lastHiddenFocusableElement ||
                    !this.el.nativeElement?.contains(i)
                        ? Nv(r.parentElement, ":not(.p-hidden-focusable)")
                        : this.lastHiddenFocusableElement;
            qf(o);
        }
        onLastHiddenElementFocus(t) {
            let { currentTarget: r, relatedTarget: i } = t,
                o =
                    i === this.firstHiddenFocusableElement ||
                    !this.el.nativeElement?.contains(i)
                        ? Av(r.parentElement, ":not(.p-hidden-focusable)")
                        : this.firstHiddenFocusableElement;
            qf(o);
        }
        static ɵfac = (() => {
            let t;
            return function (i) {
                return (t || (t = te(e)))(i || e);
            };
        })();
        static ɵdir = Me({
            type: e,
            selectors: [["", "pFocusTrap", ""]],
            inputs: {
                pFocusTrapDisabled: [
                    2,
                    "pFocusTrapDisabled",
                    "pFocusTrapDisabled",
                    K,
                ],
            },
            features: [be, At],
        });
    }
    return e;
})();
function JO() {
    let e = [],
        n = (o, s) => {
            let a = e.length > 0 ? e[e.length - 1] : { key: o, value: s },
                l = a.value + (a.key === o ? 0 : s) + 2;
            return (e.push({ key: o, value: l }), l);
        },
        t = (o) => {
            e = e.filter((s) => s.value !== o);
        },
        r = () => (e.length > 0 ? e[e.length - 1].value : 0),
        i = (o) => (o && parseInt(o.style.zIndex, 10)) || 0;
    return {
        get: i,
        set: (o, s, a) => {
            s && (s.style.zIndex = String(n(o, a)));
        },
        clear: (o) => {
            o && (t(i(o)), (o.style.zIndex = ""));
        },
        getCurrent: () => r(),
        generateZIndex: n,
        revertZIndex: t,
    };
}
var Hp = JO();
var eP = ["header"],
    cb = ["content"],
    ub = ["footer"],
    tP = ["closeicon"],
    nP = ["maximizeicon"],
    rP = ["minimizeicon"],
    iP = ["headless"],
    oP = ["titlebar"],
    sP = ["*", [["p-footer"]]],
    aP = ["*", "p-footer"],
    lP = (e, n, t) => ({
        position: "fixed",
        height: "100%",
        width: "100%",
        left: 0,
        top: 0,
        display: "flex",
        "justify-content": e,
        "align-items": n,
        "pointer-events": t,
    }),
    cP = (e) => ({ "p-dialog p-component": !0, "p-dialog-maximized": e }),
    uP = () => ({
        display: "flex",
        "flex-direction": "column",
        "pointer-events": "auto",
    }),
    dP = (e, n) => ({ transform: e, transition: n }),
    fP = (e) => ({ value: "visible", params: e });
function pP(e, n) {
    e & 1 && rr(0);
}
function hP(e, n) {
    if ((e & 1 && (ut(0), P(1, pP, 1, 0, "ng-container", 11), dt()), e & 2)) {
        let t = G(3);
        (v(),
            b(
                "ngTemplateOutlet",
                t._headlessTemplate || t.headlessTemplate || t.headlessT
            ));
    }
}
function gP(e, n) {
    if (e & 1) {
        let t = Li();
        (m(0, "div", 15),
            qe("mousedown", function (i) {
                Fn(t);
                let o = G(4);
                return $n(o.initResize(i));
            }),
            g());
    }
    if (e & 2) {
        let t = G(4);
        b("ngClass", t.cx("resizeHandle"));
    }
}
function mP(e, n) {
    if ((e & 1 && (m(0, "span", 21), C(1), g()), e & 2)) {
        let t = G(5);
        (b("id", t.ariaLabelledBy)("ngClass", t.cx("title")),
            v(),
            Ce(t.header));
    }
}
function _P(e, n) {
    e & 1 && rr(0);
}
function yP(e, n) {
    if ((e & 1 && D(0, "span", 18), e & 2)) {
        let t = G(6);
        b("ngClass", t.maximized ? t.minimizeIcon : t.maximizeIcon);
    }
}
function vP(e, n) {
    e & 1 && D(0, "WindowMaximizeIcon");
}
function bP(e, n) {
    e & 1 && D(0, "WindowMinimizeIcon");
}
function CP(e, n) {
    if (
        (e & 1 &&
            (ut(0),
            P(1, vP, 1, 0, "WindowMaximizeIcon", 23)(
                2,
                bP,
                1,
                0,
                "WindowMinimizeIcon",
                23
            ),
            dt()),
        e & 2)
    ) {
        let t = G(6);
        (v(),
            b(
                "ngIf",
                !t.maximized &&
                    !t._maximizeiconTemplate &&
                    !t.maximizeIconTemplate &&
                    !t.maximizeIconT
            ),
            v(),
            b(
                "ngIf",
                t.maximized &&
                    !t._minimizeiconTemplate &&
                    !t.minimizeIconTemplate &&
                    !t.minimizeIconT
            ));
    }
}
function EP(e, n) {}
function SP(e, n) {
    e & 1 && P(0, EP, 0, 0, "ng-template");
}
function wP(e, n) {
    if ((e & 1 && (ut(0), P(1, SP, 1, 0, null, 11), dt()), e & 2)) {
        let t = G(6);
        (v(),
            b(
                "ngTemplateOutlet",
                t._maximizeiconTemplate ||
                    t.maximizeIconTemplate ||
                    t.maximizeIconT
            ));
    }
}
function DP(e, n) {}
function MP(e, n) {
    e & 1 && P(0, DP, 0, 0, "ng-template");
}
function IP(e, n) {
    if ((e & 1 && (ut(0), P(1, MP, 1, 0, null, 11), dt()), e & 2)) {
        let t = G(6);
        (v(),
            b(
                "ngTemplateOutlet",
                t._minimizeiconTemplate ||
                    t.minimizeIconTemplate ||
                    t.minimizeIconT
            ));
    }
}
function TP(e, n) {
    if (e & 1) {
        let t = Li();
        (m(0, "p-button", 22),
            qe("onClick", function () {
                Fn(t);
                let i = G(5);
                return $n(i.maximize());
            })("keydown.enter", function () {
                Fn(t);
                let i = G(5);
                return $n(i.maximize());
            }),
            P(1, yP, 1, 1, "span", 14)(2, CP, 3, 2, "ng-container", 23)(
                3,
                wP,
                2,
                1,
                "ng-container",
                23
            )(4, IP, 2, 1, "ng-container", 23),
            g());
    }
    if (e & 2) {
        let t = G(5);
        (b("styleClass", t.cx("pcMaximizeButton"))(
            "tabindex",
            t.maximizable ? "0" : "-1"
        )("ariaLabel", t.maximizeLabel)("buttonProps", t.maximizeButtonProps),
            v(),
            b(
                "ngIf",
                t.maximizeIcon &&
                    !t._maximizeiconTemplate &&
                    !t._minimizeiconTemplate
            ),
            v(),
            b(
                "ngIf",
                !t.maximizeIcon &&
                    !(
                        t.maximizeButtonProps != null &&
                        t.maximizeButtonProps.icon
                    )
            ),
            v(),
            b("ngIf", !t.maximized),
            v(),
            b("ngIf", t.maximized));
    }
}
function xP(e, n) {
    if ((e & 1 && D(0, "span", 18), e & 2)) {
        let t = G(8);
        b("ngClass", t.closeIcon);
    }
}
function OP(e, n) {
    e & 1 && D(0, "TimesIcon");
}
function PP(e, n) {
    if (
        (e & 1 &&
            (ut(0),
            P(1, xP, 1, 1, "span", 14)(2, OP, 1, 0, "TimesIcon", 23),
            dt()),
        e & 2)
    ) {
        let t = G(7);
        (v(), b("ngIf", t.closeIcon), v(), b("ngIf", !t.closeIcon));
    }
}
function NP(e, n) {}
function AP(e, n) {
    e & 1 && P(0, NP, 0, 0, "ng-template");
}
function RP(e, n) {
    if ((e & 1 && (m(0, "span"), P(1, AP, 1, 0, null, 11), g()), e & 2)) {
        let t = G(7);
        (v(),
            b(
                "ngTemplateOutlet",
                t._closeiconTemplate || t.closeIconTemplate || t.closeIconT
            ));
    }
}
function kP(e, n) {
    if (
        (e & 1 && P(0, PP, 3, 2, "ng-container", 23)(1, RP, 2, 1, "span", 23),
        e & 2)
    ) {
        let t = G(6);
        (b(
            "ngIf",
            !t._closeiconTemplate &&
                !t.closeIconTemplate &&
                !t.closeIconT &&
                !(t.closeButtonProps != null && t.closeButtonProps.icon)
        ),
            v(),
            b(
                "ngIf",
                t._closeiconTemplate || t.closeIconTemplate || t.closeIconT
            ));
    }
}
function LP(e, n) {
    if (e & 1) {
        let t = Li();
        (m(0, "p-button", 24),
            qe("onClick", function (i) {
                Fn(t);
                let o = G(5);
                return $n(o.close(i));
            })("keydown.enter", function (i) {
                Fn(t);
                let o = G(5);
                return $n(o.close(i));
            }),
            P(1, kP, 2, 2, "ng-template", null, 4, Ef),
            g());
    }
    if (e & 2) {
        let t = G(5);
        b("styleClass", t.cx("pcCloseButton"))("ariaLabel", t.closeAriaLabel)(
            "tabindex",
            t.closeTabindex
        )("buttonProps", t.closeButtonProps);
    }
}
function FP(e, n) {
    if (e & 1) {
        let t = Li();
        (m(0, "div", 16, 3),
            qe("mousedown", function (i) {
                Fn(t);
                let o = G(4);
                return $n(o.initDrag(i));
            }),
            P(2, mP, 2, 3, "span", 17)(3, _P, 1, 0, "ng-container", 11),
            m(4, "div", 18),
            P(5, TP, 5, 8, "p-button", 19)(6, LP, 3, 4, "p-button", 20),
            g()());
    }
    if (e & 2) {
        let t = G(4);
        (b("ngClass", t.cx("header")),
            v(2),
            b("ngIf", !t._headerTemplate && !t.headerTemplate && !t.headerT),
            v(),
            b(
                "ngTemplateOutlet",
                t._headerTemplate || t.headerTemplate || t.headerT
            ),
            v(),
            b("ngClass", t.cx("headerActions")),
            v(),
            b("ngIf", t.maximizable),
            v(),
            b("ngIf", t.closable));
    }
}
function $P(e, n) {
    e & 1 && rr(0);
}
function VP(e, n) {
    e & 1 && rr(0);
}
function jP(e, n) {
    if (
        (e & 1 &&
            (m(0, "div", 18, 5),
            Ge(2, 1),
            P(3, VP, 1, 0, "ng-container", 11),
            g()),
        e & 2)
    ) {
        let t = G(4);
        (b("ngClass", t.cx("footer")),
            v(3),
            b(
                "ngTemplateOutlet",
                t._footerTemplate || t.footerTemplate || t.footerT
            ));
    }
}
function BP(e, n) {
    if (
        (e & 1 &&
            (P(0, gP, 1, 1, "div", 12)(1, FP, 7, 6, "div", 13),
            m(2, "div", 7, 2),
            Ge(4),
            P(5, $P, 1, 0, "ng-container", 11),
            g(),
            P(6, jP, 4, 2, "div", 14)),
        e & 2)
    ) {
        let t = G(3);
        (b("ngIf", t.resizable),
            v(),
            b("ngIf", t.showHeader),
            v(),
            ke(t.contentStyleClass),
            b("ngClass", t.cx("content"))("ngStyle", t.contentStyle),
            se("data-pc-section", "content"),
            v(3),
            b(
                "ngTemplateOutlet",
                t._contentTemplate || t.contentTemplate || t.contentT
            ),
            v(),
            b("ngIf", t._footerTemplate || t.footerTemplate || t.footerT));
    }
}
function UP(e, n) {
    if (e & 1) {
        let t = Li();
        (m(0, "div", 9, 0),
            qe("@animation.start", function (i) {
                Fn(t);
                let o = G(2);
                return $n(o.onAnimationStart(i));
            })("@animation.done", function (i) {
                Fn(t);
                let o = G(2);
                return $n(o.onAnimationEnd(i));
            }),
            P(2, hP, 2, 1, "ng-container", 10)(
                3,
                BP,
                7,
                9,
                "ng-template",
                null,
                1,
                Ef
            ),
            g());
    }
    if (e & 2) {
        let t = Qy(4),
            r = G(2);
        (Ko(r.style),
            ke(r.styleClass),
            b("ngClass", Fi(13, cP, r.maximizable && r.maximized))(
                "ngStyle",
                Jy(15, uP)
            )("pFocusTrapDisabled", r.focusTrap === !1)(
                "@animation",
                Fi(19, fP, ev(16, dP, r.transformOptions, r.transitionOptions))
            ),
            se("role", r.role)("aria-labelledby", r.ariaLabelledBy)(
                "aria-modal",
                !0
            ),
            v(2),
            b("ngIf", r._headlessTemplate || r.headlessTemplate || r.headlessT)(
                "ngIfElse",
                t
            ));
    }
}
function HP(e, n) {
    if ((e & 1 && (m(0, "div", 7), P(1, UP, 5, 21, "div", 8), g()), e & 2)) {
        let t = G();
        (Ko(t.maskStyle),
            ke(t.maskStyleClass),
            b("ngClass", t.maskClass)(
                "ngStyle",
                tv(
                    7,
                    lP,
                    t.position === "left" ||
                        t.position === "topleft" ||
                        t.position === "bottomleft"
                        ? "flex-start"
                        : t.position === "right" ||
                            t.position === "topright" ||
                            t.position === "bottomright"
                          ? "flex-end"
                          : "center",
                    t.position === "top" ||
                        t.position === "topleft" ||
                        t.position === "topright"
                        ? "flex-start"
                        : t.position === "bottom" ||
                            t.position === "bottomleft" ||
                            t.position === "bottomright"
                          ? "flex-end"
                          : "center",
                    t.modal ? "auto" : "none"
                )
            ),
            v(),
            b("ngIf", t.visible));
    }
}
var zP = ({ dt: e }) => `
.p-dialog {
    max-height: 90%;
    transform: scale(1);
    border-radius: ${e("dialog.border.radius")};
    box-shadow: ${e("dialog.shadow")};
    background: ${e("dialog.background")};
    border: 1px solid ${e("dialog.border.color")};
    color: ${e("dialog.color")};
    display: flex;
    flex-direction: column;
    pointer-events: auto
}

.p-dialog-content {
    overflow-y: auto;
    padding: ${e("dialog.content.padding")};
    flex-grow: 1;
}

.p-dialog-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
    padding: ${e("dialog.header.padding")};
}

.p-dialog-title {
    font-weight: ${e("dialog.title.font.weight")};
    font-size: ${e("dialog.title.font.size")};
}

.p-dialog-footer {
    flex-shrink: 0;
    padding: ${e("dialog.footer.padding")};
    display: flex;
    justify-content: flex-end;
    gap: ${e("dialog.footer.gap")};
}

.p-dialog-header-actions {
    display: flex;
    align-items: center;
    gap: ${e("dialog.header.gap")};
}

.p-dialog-enter-active {
    transition: all 150ms cubic-bezier(0, 0, 0.2, 1);
}

.p-dialog-leave-active {
    transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
}

.p-dialog-enter-from,
.p-dialog-leave-to {
    opacity: 0;
    transform: scale(0.7);
}

.p-dialog-top .p-dialog,
.p-dialog-bottom .p-dialog,
.p-dialog-left .p-dialog,
.p-dialog-right .p-dialog,
.p-dialog-topleft .p-dialog,
.p-dialog-topright .p-dialog,
.p-dialog-bottomleft .p-dialog,
.p-dialog-bottomright .p-dialog {
    margin: 0.75rem;
    transform: translate3d(0px, 0px, 0px);
}

.p-dialog-top .p-dialog-enter-active,
.p-dialog-top .p-dialog-leave-active,
.p-dialog-bottom .p-dialog-enter-active,
.p-dialog-bottom .p-dialog-leave-active,
.p-dialog-left .p-dialog-enter-active,
.p-dialog-left .p-dialog-leave-active,
.p-dialog-right .p-dialog-enter-active,
.p-dialog-right .p-dialog-leave-active,
.p-dialog-topleft .p-dialog-enter-active,
.p-dialog-topleft .p-dialog-leave-active,
.p-dialog-topright .p-dialog-enter-active,
.p-dialog-topright .p-dialog-leave-active,
.p-dialog-bottomleft .p-dialog-enter-active,
.p-dialog-bottomleft .p-dialog-leave-active,
.p-dialog-bottomright .p-dialog-enter-active,
.p-dialog-bottomright .p-dialog-leave-active {
    transition: all 0.3s ease-out;
}

.p-dialog-top .p-dialog-enter-from,
.p-dialog-top .p-dialog-leave-to {
    transform: translate3d(0px, -100%, 0px);
}

.p-dialog-bottom .p-dialog-enter-from,
.p-dialog-bottom .p-dialog-leave-to {
    transform: translate3d(0px, 100%, 0px);
}

.p-dialog-left .p-dialog-enter-from,
.p-dialog-left .p-dialog-leave-to,
.p-dialog-topleft .p-dialog-enter-from,
.p-dialog-topleft .p-dialog-leave-to,
.p-dialog-bottomleft .p-dialog-enter-from,
.p-dialog-bottomleft .p-dialog-leave-to {
    transform: translate3d(-100%, 0px, 0px);
}

.p-dialog-right .p-dialog-enter-from,
.p-dialog-right .p-dialog-leave-to,
.p-dialog-topright .p-dialog-enter-from,
.p-dialog-topright .p-dialog-leave-to,
.p-dialog-bottomright .p-dialog-enter-from,
.p-dialog-bottomright .p-dialog-leave-to {
    transform: translate3d(100%, 0px, 0px);
}

.p-dialog-left:dir(rtl) .p-dialog-enter-from,
.p-dialog-left:dir(rtl) .p-dialog-leave-to,
.p-dialog-topleft:dir(rtl) .p-dialog-enter-from,
.p-dialog-topleft:dir(rtl) .p-dialog-leave-to,
.p-dialog-bottomleft:dir(rtl) .p-dialog-enter-from,
.p-dialog-bottomleft:dir(rtl) .p-dialog-leave-to {
    transform: translate3d(100%, 0px, 0px);
}

.p-dialog-right:dir(rtl) .p-dialog-enter-from,
.p-dialog-right:dir(rtl) .p-dialog-leave-to,
.p-dialog-topright:dir(rtl) .p-dialog-enter-from,
.p-dialog-topright:dir(rtl) .p-dialog-leave-to,
.p-dialog-bottomright:dir(rtl) .p-dialog-enter-from,
.p-dialog-bottomright:dir(rtl) .p-dialog-leave-to {
    transform: translate3d(-100%, 0px, 0px);
}

.p-dialog-maximized {
    width: 100vw !important;
    height: 100vh !important;
    top: 0px !important;
    left: 0px !important;
    max-height: 100%;
    height: 100%;
    border-radius: 0;
}

.p-dialog-maximized .p-dialog-content {
    flex-grow: 1;
}

.p-overlay-mask:dir(rtl) {
    flex-direction: row-reverse;
}

/* For PrimeNG */

.p-dialog .p-resizable-handle {
    position: absolute;
    font-size: 0.1px;
    display: block;
    cursor: se-resize;
    width: 12px;
    height: 12px;
    right: 1px;
    bottom: 1px;
}

.p-confirm-dialog .p-dialog-content {
    display: flex;
    align-items: center;
}
`,
    WP = {
        mask: ({ instance: e }) => ({
            position: "fixed",
            height: "100%",
            width: "100%",
            left: 0,
            top: 0,
            display: "flex",
            justifyContent:
                e.position === "left" ||
                e.position === "topleft" ||
                e.position === "bottomleft"
                    ? "flex-start"
                    : e.position === "right" ||
                        e.position === "topright" ||
                        e.position === "bottomright"
                      ? "flex-end"
                      : "center",
            alignItems:
                e.position === "top" ||
                e.position === "topleft" ||
                e.position === "topright"
                    ? "flex-start"
                    : e.position === "bottom" ||
                        e.position === "bottomleft" ||
                        e.position === "bottomright"
                      ? "flex-end"
                      : "center",
            pointerEvents: e.modal ? "auto" : "none",
        }),
        root: {
            display: "flex",
            flexDirection: "column",
            pointerEvents: "auto",
        },
    },
    qP = {
        mask: ({ instance: e }) => {
            let t = [
                "left",
                "right",
                "top",
                "topleft",
                "topright",
                "bottom",
                "bottomleft",
                "bottomright",
            ].find((r) => r === e.position);
            return {
                "p-dialog-mask": !0,
                "p-overlay-mask p-overlay-mask-enter": e.modal,
                [`p-dialog-${t}`]: t,
            };
        },
        root: ({ instance: e }) => ({
            "p-dialog p-component": !0,
            "p-dialog-maximized": e.maximizable && e.maximized,
        }),
        header: "p-dialog-header",
        title: "p-dialog-title",
        resizeHandle: "p-resizable-handle",
        headerActions: "p-dialog-header-actions",
        pcMaximizeButton: "p-dialog-maximize-button",
        pcCloseButton: "p-dialog-close-button",
        content: "p-dialog-content",
        footer: "p-dialog-footer",
    },
    db = (() => {
        class e extends Ye {
            name = "dialog";
            theme = zP;
            classes = qP;
            inlineStyles = WP;
            static ɵfac = (() => {
                let t;
                return function (i) {
                    return (t || (t = te(e)))(i || e);
                };
            })();
            static ɵprov = w({ token: e, factory: e.ɵfac });
        }
        return e;
    })();
var GP = nc([
        qr({ transform: "{{transform}}", opacity: 0 }),
        ec("{{transition}}"),
    ]),
    YP = nc([
        ec("{{transition}}", qr({ transform: "{{transform}}", opacity: 0 })),
    ]),
    zp = (() => {
        class e extends pt {
            header;
            draggable = !0;
            resizable = !0;
            get positionLeft() {
                return 0;
            }
            set positionLeft(t) {
                console.log("positionLeft property is deprecated.");
            }
            get positionTop() {
                return 0;
            }
            set positionTop(t) {
                console.log("positionTop property is deprecated.");
            }
            contentStyle;
            contentStyleClass;
            modal = !1;
            closeOnEscape = !0;
            dismissableMask = !1;
            rtl = !1;
            closable = !0;
            get responsive() {
                return !1;
            }
            set responsive(t) {
                console.log("Responsive property is deprecated.");
            }
            appendTo;
            breakpoints;
            styleClass;
            maskStyleClass;
            maskStyle;
            showHeader = !0;
            get breakpoint() {
                return 649;
            }
            set breakpoint(t) {
                console.log(
                    "Breakpoint property is not utilized and deprecated, use breakpoints or CSS media queries instead."
                );
            }
            blockScroll = !1;
            autoZIndex = !0;
            baseZIndex = 0;
            minX = 0;
            minY = 0;
            focusOnShow = !0;
            maximizable = !1;
            keepInViewport = !0;
            focusTrap = !0;
            transitionOptions = "150ms cubic-bezier(0, 0, 0.2, 1)";
            closeIcon;
            closeAriaLabel;
            closeTabindex = "0";
            minimizeIcon;
            maximizeIcon;
            closeButtonProps = { severity: "secondary", text: !0, rounded: !0 };
            maximizeButtonProps = {
                severity: "secondary",
                text: !0,
                rounded: !0,
            };
            get visible() {
                return this._visible;
            }
            set visible(t) {
                ((this._visible = t),
                    this._visible &&
                        !this.maskVisible &&
                        (this.maskVisible = !0));
            }
            get style() {
                return this._style;
            }
            set style(t) {
                t && ((this._style = E({}, t)), (this.originalStyle = t));
            }
            get position() {
                return this._position;
            }
            set position(t) {
                switch (((this._position = t), t)) {
                    case "topleft":
                    case "bottomleft":
                    case "left":
                        this.transformOptions = "translate3d(-100%, 0px, 0px)";
                        break;
                    case "topright":
                    case "bottomright":
                    case "right":
                        this.transformOptions = "translate3d(100%, 0px, 0px)";
                        break;
                    case "bottom":
                        this.transformOptions = "translate3d(0px, 100%, 0px)";
                        break;
                    case "top":
                        this.transformOptions = "translate3d(0px, -100%, 0px)";
                        break;
                    default:
                        this.transformOptions = "scale(0.7)";
                        break;
                }
            }
            role = "dialog";
            onShow = new pe();
            onHide = new pe();
            visibleChange = new pe();
            onResizeInit = new pe();
            onResizeEnd = new pe();
            onDragEnd = new pe();
            onMaximize = new pe();
            headerViewChild;
            contentViewChild;
            footerViewChild;
            headerTemplate;
            contentTemplate;
            footerTemplate;
            closeIconTemplate;
            maximizeIconTemplate;
            minimizeIconTemplate;
            headlessTemplate;
            _headerTemplate;
            _contentTemplate;
            _footerTemplate;
            _closeiconTemplate;
            _maximizeiconTemplate;
            _minimizeiconTemplate;
            _headlessTemplate;
            _visible = !1;
            maskVisible;
            container;
            wrapper;
            dragging;
            ariaLabelledBy = this.getAriaLabelledBy();
            documentDragListener;
            documentDragEndListener;
            resizing;
            documentResizeListener;
            documentResizeEndListener;
            documentEscapeListener;
            maskClickListener;
            lastPageX;
            lastPageY;
            preventVisibleChangePropagation;
            maximized;
            preMaximizeContentHeight;
            preMaximizeContainerWidth;
            preMaximizeContainerHeight;
            preMaximizePageX;
            preMaximizePageY;
            id = $t("pn_id_");
            _style = {};
            _position = "center";
            originalStyle;
            transformOptions = "scale(0.7)";
            styleElement;
            window;
            _componentStyle = y(db);
            headerT;
            contentT;
            footerT;
            closeIconT;
            maximizeIconT;
            minimizeIconT;
            headlessT;
            get maximizeLabel() {
                return this.config.getTranslation(jv.ARIA).maximizeLabel;
            }
            zone = y(ne);
            get maskClass() {
                let r = [
                    "left",
                    "right",
                    "top",
                    "topleft",
                    "topright",
                    "bottom",
                    "bottomleft",
                    "bottomright",
                ].find((i) => i === this.position);
                return {
                    "p-dialog-mask": !0,
                    "p-overlay-mask p-overlay-mask-enter":
                        this.modal || this.dismissableMask,
                    [`p-dialog-${r}`]: r,
                };
            }
            ngOnInit() {
                (super.ngOnInit(), this.breakpoints && this.createStyle());
            }
            templates;
            ngAfterContentInit() {
                this.templates?.forEach((t) => {
                    switch (t.getType()) {
                        case "header":
                            this.headerT = t.template;
                            break;
                        case "content":
                            this.contentT = t.template;
                            break;
                        case "footer":
                            this.footerT = t.template;
                            break;
                        case "closeicon":
                            this.closeIconT = t.template;
                            break;
                        case "maximizeicon":
                            this.maximizeIconT = t.template;
                            break;
                        case "minimizeicon":
                            this.minimizeIconT = t.template;
                            break;
                        case "headless":
                            this.headlessT = t.template;
                            break;
                        default:
                            this.contentT = t.template;
                            break;
                    }
                });
            }
            getAriaLabelledBy() {
                return this.header !== null ? $t("pn_id_") + "_header" : null;
            }
            parseDurationToMilliseconds(t) {
                let r = /([\d\.]+)(ms|s)\b/g,
                    i = 0,
                    o;
                for (; (o = r.exec(t)) !== null; ) {
                    let s = parseFloat(o[1]),
                        a = o[2];
                    a === "ms" ? (i += s) : a === "s" && (i += s * 1e3);
                }
                if (i !== 0) return i;
            }
            _focus(t) {
                if (t) {
                    let r = this.parseDurationToMilliseconds(
                            this.transitionOptions
                        ),
                        i = ic.getFocusableElements(t);
                    if (i && i.length > 0)
                        return (
                            this.zone.runOutsideAngular(() => {
                                setTimeout(() => i[0].focus(), r || 5);
                            }),
                            !0
                        );
                }
                return !1;
            }
            focus(t) {
                let r = this._focus(t);
                r ||
                    ((r = this._focus(this.footerViewChild?.nativeElement)),
                    r ||
                        ((r = this._focus(this.headerViewChild?.nativeElement)),
                        r ||
                            this._focus(this.contentViewChild?.nativeElement)));
            }
            close(t) {
                (this.visibleChange.emit(!1), t.preventDefault());
            }
            enableModality() {
                (this.closable &&
                    this.dismissableMask &&
                    (this.maskClickListener = this.renderer.listen(
                        this.wrapper,
                        "mousedown",
                        (t) => {
                            this.wrapper &&
                                this.wrapper.isSameNode(t.target) &&
                                this.close(t);
                        }
                    )),
                    this.modal && Hf());
            }
            disableModality() {
                if (this.wrapper) {
                    this.dismissableMask && this.unbindMaskClickListener();
                    let t = document.querySelectorAll(
                        ".p-dialog-mask-scrollblocker"
                    );
                    (this.modal && t && t.length == 1 && zf(),
                        this.cd.destroyed || this.cd.detectChanges());
                }
            }
            maximize() {
                ((this.maximized = !this.maximized),
                    !this.modal &&
                        !this.blockScroll &&
                        (this.maximized ? Hf() : zf()),
                    this.onMaximize.emit({ maximized: this.maximized }));
            }
            unbindMaskClickListener() {
                this.maskClickListener &&
                    (this.maskClickListener(), (this.maskClickListener = null));
            }
            moveOnTop() {
                this.autoZIndex &&
                    (Hp.set(
                        "modal",
                        this.container,
                        this.baseZIndex + this.config.zIndex.modal
                    ),
                    (this.wrapper.style.zIndex = String(
                        parseInt(this.container.style.zIndex, 10) - 1
                    )));
            }
            createStyle() {
                if (_n(this.platformId) && !this.styleElement) {
                    ((this.styleElement = this.renderer.createElement("style")),
                        (this.styleElement.type = "text/css"),
                        this.renderer.appendChild(
                            this.document.head,
                            this.styleElement
                        ));
                    let t = "";
                    for (let r in this.breakpoints)
                        t += `
                        @media screen and (max-width: ${r}) {
                            .p-dialog[${this.id}]:not(.p-dialog-maximized) {
                                width: ${this.breakpoints[r]} !important;
                            }
                        }
                    `;
                    (this.renderer.setProperty(
                        this.styleElement,
                        "innerHTML",
                        t
                    ),
                        Lv(
                            this.styleElement,
                            "nonce",
                            this.config?.csp()?.nonce
                        ));
                }
            }
            initDrag(t) {
                Fr(t.target, "p-dialog-maximize-icon") ||
                    Fr(t.target, "p-dialog-header-close-icon") ||
                    Fr(t.target.parentElement, "p-dialog-header-icon") ||
                    (this.draggable &&
                        ((this.dragging = !0),
                        (this.lastPageX = t.pageX),
                        (this.lastPageY = t.pageY),
                        (this.container.style.margin = "0"),
                        Un(this.document.body, "p-unselectable-text")));
            }
            onDrag(t) {
                if (this.dragging) {
                    let r = cs(this.container),
                        i = ji(this.container),
                        o = t.pageX - this.lastPageX,
                        s = t.pageY - this.lastPageY,
                        a = this.container.getBoundingClientRect(),
                        l = getComputedStyle(this.container),
                        c = parseFloat(l.marginLeft),
                        u = parseFloat(l.marginTop),
                        d = a.left + o - c,
                        p = a.top + s - u,
                        f = Wf();
                    ((this.container.style.position = "fixed"),
                        this.keepInViewport
                            ? (d >= this.minX &&
                                  d + r < f.width &&
                                  ((this._style.left = `${d}px`),
                                  (this.lastPageX = t.pageX),
                                  (this.container.style.left = `${d}px`)),
                              p >= this.minY &&
                                  p + i < f.height &&
                                  ((this._style.top = `${p}px`),
                                  (this.lastPageY = t.pageY),
                                  (this.container.style.top = `${p}px`)))
                            : ((this.lastPageX = t.pageX),
                              (this.container.style.left = `${d}px`),
                              (this.lastPageY = t.pageY),
                              (this.container.style.top = `${p}px`)));
                }
            }
            endDrag(t) {
                this.dragging &&
                    ((this.dragging = !1),
                    Zt(this.document.body, "p-unselectable-text"),
                    this.cd.detectChanges(),
                    this.onDragEnd.emit(t));
            }
            resetPosition() {
                ((this.container.style.position = ""),
                    (this.container.style.left = ""),
                    (this.container.style.top = ""),
                    (this.container.style.margin = ""));
            }
            center() {
                this.resetPosition();
            }
            initResize(t) {
                this.resizable &&
                    ((this.resizing = !0),
                    (this.lastPageX = t.pageX),
                    (this.lastPageY = t.pageY),
                    Un(this.document.body, "p-unselectable-text"),
                    this.onResizeInit.emit(t));
            }
            onResize(t) {
                if (this.resizing) {
                    let r = t.pageX - this.lastPageX,
                        i = t.pageY - this.lastPageY,
                        o = cs(this.container),
                        s = ji(this.container),
                        a = ji(this.contentViewChild?.nativeElement),
                        l = o + r,
                        c = s + i,
                        u = this.container.style.minWidth,
                        d = this.container.style.minHeight,
                        p = this.container.getBoundingClientRect(),
                        f = Wf();
                    ((!parseInt(this.container.style.top) ||
                        !parseInt(this.container.style.left)) &&
                        ((l += r), (c += i)),
                        (!u || l > parseInt(u)) &&
                            p.left + l < f.width &&
                            ((this._style.width = l + "px"),
                            (this.container.style.width = this._style.width)),
                        (!d || c > parseInt(d)) &&
                            p.top + c < f.height &&
                            ((this.contentViewChild.nativeElement.style.height =
                                a + c - s + "px"),
                            this._style.height &&
                                ((this._style.height = c + "px"),
                                (this.container.style.height =
                                    this._style.height))),
                        (this.lastPageX = t.pageX),
                        (this.lastPageY = t.pageY));
                }
            }
            resizeEnd(t) {
                this.resizing &&
                    ((this.resizing = !1),
                    Zt(this.document.body, "p-unselectable-text"),
                    this.onResizeEnd.emit(t));
            }
            bindGlobalListeners() {
                (this.draggable &&
                    (this.bindDocumentDragListener(),
                    this.bindDocumentDragEndListener()),
                    this.resizable && this.bindDocumentResizeListeners(),
                    this.closeOnEscape &&
                        this.closable &&
                        this.bindDocumentEscapeListener());
            }
            unbindGlobalListeners() {
                (this.unbindDocumentDragListener(),
                    this.unbindDocumentDragEndListener(),
                    this.unbindDocumentResizeListeners(),
                    this.unbindDocumentEscapeListener());
            }
            bindDocumentDragListener() {
                this.documentDragListener ||
                    this.zone.runOutsideAngular(() => {
                        this.documentDragListener = this.renderer.listen(
                            this.document.defaultView,
                            "mousemove",
                            this.onDrag.bind(this)
                        );
                    });
            }
            unbindDocumentDragListener() {
                this.documentDragListener &&
                    (this.documentDragListener(),
                    (this.documentDragListener = null));
            }
            bindDocumentDragEndListener() {
                this.documentDragEndListener ||
                    this.zone.runOutsideAngular(() => {
                        this.documentDragEndListener = this.renderer.listen(
                            this.document.defaultView,
                            "mouseup",
                            this.endDrag.bind(this)
                        );
                    });
            }
            unbindDocumentDragEndListener() {
                this.documentDragEndListener &&
                    (this.documentDragEndListener(),
                    (this.documentDragEndListener = null));
            }
            bindDocumentResizeListeners() {
                !this.documentResizeListener &&
                    !this.documentResizeEndListener &&
                    this.zone.runOutsideAngular(() => {
                        ((this.documentResizeListener = this.renderer.listen(
                            this.document.defaultView,
                            "mousemove",
                            this.onResize.bind(this)
                        )),
                            (this.documentResizeEndListener =
                                this.renderer.listen(
                                    this.document.defaultView,
                                    "mouseup",
                                    this.resizeEnd.bind(this)
                                )));
                    });
            }
            unbindDocumentResizeListeners() {
                this.documentResizeListener &&
                    this.documentResizeEndListener &&
                    (this.documentResizeListener(),
                    this.documentResizeEndListener(),
                    (this.documentResizeListener = null),
                    (this.documentResizeEndListener = null));
            }
            bindDocumentEscapeListener() {
                let t = this.el
                    ? this.el.nativeElement.ownerDocument
                    : "document";
                this.documentEscapeListener = this.renderer.listen(
                    t,
                    "keydown",
                    (r) => {
                        r.key == "Escape" && this.close(r);
                    }
                );
            }
            unbindDocumentEscapeListener() {
                this.documentEscapeListener &&
                    (this.documentEscapeListener(),
                    (this.documentEscapeListener = null));
            }
            appendContainer() {
                this.appendTo &&
                    (this.appendTo === "body"
                        ? this.renderer.appendChild(
                              this.document.body,
                              this.wrapper
                          )
                        : xv(this.appendTo, this.wrapper));
            }
            restoreAppend() {
                this.container &&
                    this.appendTo &&
                    this.renderer.appendChild(
                        this.el.nativeElement,
                        this.wrapper
                    );
            }
            onAnimationStart(t) {
                switch (t.toState) {
                    case "visible":
                        ((this.container = t.element),
                            (this.wrapper = this.container?.parentElement),
                            this.appendContainer(),
                            this.moveOnTop(),
                            this.bindGlobalListeners(),
                            this.container?.setAttribute(this.id, ""),
                            this.modal && this.enableModality(),
                            this.focusOnShow && this.focus());
                        break;
                    case "void":
                        this.wrapper &&
                            this.modal &&
                            Un(this.wrapper, "p-overlay-mask-leave");
                        break;
                }
            }
            onAnimationEnd(t) {
                switch (t.toState) {
                    case "void":
                        (this.onContainerDestroy(),
                            this.onHide.emit({}),
                            this.cd.markForCheck(),
                            this.maskVisible !== this.visible &&
                                (this.maskVisible = this.visible));
                        break;
                    case "visible":
                        this.onShow.emit({});
                        break;
                }
            }
            onContainerDestroy() {
                (this.unbindGlobalListeners(),
                    (this.dragging = !1),
                    (this.maskVisible = !1),
                    this.maximized &&
                        (this.document.body.style.removeProperty(
                            "--scrollbar;-width"
                        ),
                        (this.maximized = !1)),
                    this.modal && this.disableModality(),
                    Fr(this.document.body, "p-overflow-hidden") &&
                        Zt(this.document.body, "p-overflow-hidden"),
                    this.container &&
                        this.autoZIndex &&
                        Hp.clear(this.container),
                    (this.container = null),
                    (this.wrapper = null),
                    (this._style = this.originalStyle
                        ? E({}, this.originalStyle)
                        : {}));
            }
            destroyStyle() {
                this.styleElement &&
                    (this.renderer.removeChild(
                        this.document.head,
                        this.styleElement
                    ),
                    (this.styleElement = null));
            }
            ngOnDestroy() {
                (this.container &&
                    (this.restoreAppend(), this.onContainerDestroy()),
                    this.destroyStyle(),
                    super.ngOnDestroy());
            }
            static ɵfac = (() => {
                let t;
                return function (i) {
                    return (t || (t = te(e)))(i || e);
                };
            })();
            static ɵcmp = R({
                type: e,
                selectors: [["p-dialog"]],
                contentQueries: function (r, i, o) {
                    if (
                        (r & 1 &&
                            (nt(o, eP, 4),
                            nt(o, cb, 4),
                            nt(o, ub, 4),
                            nt(o, tP, 4),
                            nt(o, nP, 4),
                            nt(o, rP, 4),
                            nt(o, iP, 4),
                            nt(o, Bi, 4)),
                        r & 2)
                    ) {
                        let s;
                        (Fe((s = $e())) && (i._headerTemplate = s.first),
                            Fe((s = $e())) && (i._contentTemplate = s.first),
                            Fe((s = $e())) && (i._footerTemplate = s.first),
                            Fe((s = $e())) && (i._closeiconTemplate = s.first),
                            Fe((s = $e())) &&
                                (i._maximizeiconTemplate = s.first),
                            Fe((s = $e())) &&
                                (i._minimizeiconTemplate = s.first),
                            Fe((s = $e())) && (i._headlessTemplate = s.first),
                            Fe((s = $e())) && (i.templates = s));
                    }
                },
                viewQuery: function (r, i) {
                    if ((r & 1 && (gl(oP, 5), gl(cb, 5), gl(ub, 5)), r & 2)) {
                        let o;
                        (Fe((o = $e())) && (i.headerViewChild = o.first),
                            Fe((o = $e())) && (i.contentViewChild = o.first),
                            Fe((o = $e())) && (i.footerViewChild = o.first));
                    }
                },
                inputs: {
                    header: "header",
                    draggable: [2, "draggable", "draggable", K],
                    resizable: [2, "resizable", "resizable", K],
                    positionLeft: "positionLeft",
                    positionTop: "positionTop",
                    contentStyle: "contentStyle",
                    contentStyleClass: "contentStyleClass",
                    modal: [2, "modal", "modal", K],
                    closeOnEscape: [2, "closeOnEscape", "closeOnEscape", K],
                    dismissableMask: [
                        2,
                        "dismissableMask",
                        "dismissableMask",
                        K,
                    ],
                    rtl: [2, "rtl", "rtl", K],
                    closable: [2, "closable", "closable", K],
                    responsive: "responsive",
                    appendTo: "appendTo",
                    breakpoints: "breakpoints",
                    styleClass: "styleClass",
                    maskStyleClass: "maskStyleClass",
                    maskStyle: "maskStyle",
                    showHeader: [2, "showHeader", "showHeader", K],
                    breakpoint: "breakpoint",
                    blockScroll: [2, "blockScroll", "blockScroll", K],
                    autoZIndex: [2, "autoZIndex", "autoZIndex", K],
                    baseZIndex: [2, "baseZIndex", "baseZIndex", kr],
                    minX: [2, "minX", "minX", kr],
                    minY: [2, "minY", "minY", kr],
                    focusOnShow: [2, "focusOnShow", "focusOnShow", K],
                    maximizable: [2, "maximizable", "maximizable", K],
                    keepInViewport: [2, "keepInViewport", "keepInViewport", K],
                    focusTrap: [2, "focusTrap", "focusTrap", K],
                    transitionOptions: "transitionOptions",
                    closeIcon: "closeIcon",
                    closeAriaLabel: "closeAriaLabel",
                    closeTabindex: "closeTabindex",
                    minimizeIcon: "minimizeIcon",
                    maximizeIcon: "maximizeIcon",
                    closeButtonProps: "closeButtonProps",
                    maximizeButtonProps: "maximizeButtonProps",
                    visible: "visible",
                    style: "style",
                    position: "position",
                    role: "role",
                    headerTemplate: [0, "content", "headerTemplate"],
                    contentTemplate: "contentTemplate",
                    footerTemplate: "footerTemplate",
                    closeIconTemplate: "closeIconTemplate",
                    maximizeIconTemplate: "maximizeIconTemplate",
                    minimizeIconTemplate: "minimizeIconTemplate",
                    headlessTemplate: "headlessTemplate",
                },
                outputs: {
                    onShow: "onShow",
                    onHide: "onHide",
                    visibleChange: "visibleChange",
                    onResizeInit: "onResizeInit",
                    onResizeEnd: "onResizeEnd",
                    onDragEnd: "onDragEnd",
                    onMaximize: "onMaximize",
                },
                features: [Rt([db]), be],
                ngContentSelectors: aP,
                decls: 1,
                vars: 1,
                consts: [
                    ["container", ""],
                    ["notHeadless", ""],
                    ["content", ""],
                    ["titlebar", ""],
                    ["icon", ""],
                    ["footer", ""],
                    [3, "ngClass", "class", "ngStyle", "style", 4, "ngIf"],
                    [3, "ngClass", "ngStyle"],
                    [
                        "pFocusTrap",
                        "",
                        3,
                        "class",
                        "ngClass",
                        "ngStyle",
                        "style",
                        "pFocusTrapDisabled",
                        4,
                        "ngIf",
                    ],
                    [
                        "pFocusTrap",
                        "",
                        3,
                        "ngClass",
                        "ngStyle",
                        "pFocusTrapDisabled",
                    ],
                    [4, "ngIf", "ngIfElse"],
                    [4, "ngTemplateOutlet"],
                    [
                        "style",
                        "z-index: 90;",
                        3,
                        "ngClass",
                        "mousedown",
                        4,
                        "ngIf",
                    ],
                    [3, "ngClass", "mousedown", 4, "ngIf"],
                    [3, "ngClass", 4, "ngIf"],
                    [2, "z-index", "90", 3, "mousedown", "ngClass"],
                    [3, "mousedown", "ngClass"],
                    [3, "id", "ngClass", 4, "ngIf"],
                    [3, "ngClass"],
                    [
                        3,
                        "styleClass",
                        "tabindex",
                        "ariaLabel",
                        "buttonProps",
                        "onClick",
                        "keydown.enter",
                        4,
                        "ngIf",
                    ],
                    [
                        3,
                        "styleClass",
                        "ariaLabel",
                        "tabindex",
                        "buttonProps",
                        "onClick",
                        "keydown.enter",
                        4,
                        "ngIf",
                    ],
                    [3, "id", "ngClass"],
                    [
                        3,
                        "onClick",
                        "keydown.enter",
                        "styleClass",
                        "tabindex",
                        "ariaLabel",
                        "buttonProps",
                    ],
                    [4, "ngIf"],
                    [
                        3,
                        "onClick",
                        "keydown.enter",
                        "styleClass",
                        "ariaLabel",
                        "tabindex",
                        "buttonProps",
                    ],
                ],
                template: function (r, i) {
                    (r & 1 && (Ct(sP), P(0, HP, 2, 11, "div", 6)),
                        r & 2 && b("ngIf", i.maskVisible));
                },
                dependencies: [Qt, Jo, Et, ts, es, ab, lb, eb, tb, nb, yn],
                encapsulation: 2,
                data: {
                    animation: [
                        Bp("animation", [
                            tc("void => visible", [rc(GP)]),
                            tc("visible => void", [rc(YP)]),
                        ]),
                    ],
                },
                changeDetection: 0,
            });
        }
        return e;
    })(),
    Wp = (() => {
        class e {
            static ɵfac = function (r) {
                return new (r || e)();
            };
            static ɵmod = ge({ type: e });
            static ɵinj = he({ imports: [zp, yn, yn] });
        }
        return e;
    })();
var QP = ["*"],
    fb = (() => {
        class e {
            constructor() {
                ((this.type = "button"),
                    (this.disabled = !1),
                    (this.variant = "primary"),
                    (this.ariaLabel = ""),
                    (this.buttonId = ""));
            }
            static {
                this.ɵfac = function (r) {
                    return new (r || e)();
                };
            }
            static {
                this.ɵcmp = R({
                    type: e,
                    selectors: [["app-button"]],
                    inputs: {
                        type: "type",
                        disabled: "disabled",
                        variant: "variant",
                        ariaLabel: "ariaLabel",
                        buttonId: "buttonId",
                    },
                    standalone: !1,
                    ngContentSelectors: QP,
                    decls: 3,
                    vars: 6,
                    consts: [
                        [3, "type", "disabled"],
                        [1, "btn-label"],
                    ],
                    template: function (r, i) {
                        (r & 1 &&
                            (Ct(),
                            m(0, "button", 0)(1, "span", 1),
                            Ge(2),
                            g()()),
                            r & 2 &&
                                (ke(i.variant),
                                b("type", i.type)("disabled", i.disabled),
                                se("aria-label", i.ariaLabel || null)(
                                    "id",
                                    i.buttonId || null
                                )));
                    },
                    styles: [
                        'app-dialog[_ngcontent-%COMP%]{display:flex;flex-direction:row;flex-wrap:wrap;min-width:fit-content;align-items:flex-start;align-content:flex-start;margin-top:.2rem}app-dialog[_ngcontent-%COMP%]   app-button[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{display:flex;flex-direction:row;flex-wrap:nowrap;width:fit-content;min-height:1rem;height:fit-content;font-weight:700;font-size:.6rem;margin-left:.5rem;margin-right:.5rem;margin-top:auto;margin-bottom:auto;padding:.15rem .55rem}.p-dialog.p-component[_ngcontent-%COMP%]{background-color:#fff;position:absolute;border:.5rem solid;border-radius:0;border-color:#ff9671 #ff6f91 #ff6f91 #ff9671;width:min(95vw,600px);background:#fffc;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);padding:1rem;--p-button-text-secondary-color: #5e3f9e}.p-dialog[_ngcontent-%COMP%]   .p-dialog-header[_ngcontent-%COMP%]{display:flex;flex-direction:row;flex-wrap:wrap;align-content:flex-start;align-items:flex-start!important;text-transform:uppercase;padding:2rem}.p-dialog[_ngcontent-%COMP%]   .p-dialog-close-button[_ngcontent-%COMP%]{background-color:transparent;color:#5e3f9e;font-weight:800;border:none;width:1rem;height:1rem;cursor:pointer;transform-origin:center center}.p-dialog[_ngcontent-%COMP%]   .p-dialog-close-button[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%]{display:block;transform-origin:center center}.p-dialog[_ngcontent-%COMP%]   .p-dialog-close-button[_ngcontent-%COMP%]:hover{animation:_ngcontent-%COMP%_spin-rainbow .4s ease-in-out,_ngcontent-%COMP%_rainbow-icon .4s linear normal}.p-dialog[_ngcontent-%COMP%]   .p-dialog-maximize-button[_ngcontent-%COMP%]:hover{animation:_ngcontent-%COMP%_rainbow-icon .4s linear normal,_ngcontent-%COMP%_grow-icon .4s ease-in-out}.p-dialog[_ngcontent-%COMP%]   .p-dialog-header-actions[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.5rem}@keyframes _ngcontent-%COMP%_spin-rainbow{0%{transform:rotate(0)}to{transform:rotate(360deg)}}@keyframes _ngcontent-%COMP%_grow-icon{0%{transform:scale(1)}50%{transform:scale(1.2)}to{transform:scale(1)}}@keyframes _ngcontent-%COMP%_rainbow-icon{0%{filter:hue-rotate(0deg) saturate(3)}to{filter:hue-rotate(360deg) saturate(3)}}.p-dialog[_ngcontent-%COMP%]   .p-dialog-content[_ngcontent-%COMP%]{padding:1rem 2rem}.p-dialog[_ngcontent-%COMP%]   .p-dialog-footer[_ngcontent-%COMP%]{padding:2rem;display:flex;flex-direction:row;flex-wrap:wrap;justify-content:flex-end}*[_ngcontent-%COMP%]{margin:0;padding:0;box-sizing:border-box}html[_ngcontent-%COMP%]{font-family:Lexend,sans-serif;font-weight:300;font-size:16px;margin:unset;padding:unset;box-sizing:border-box;color:#070f13}html[_ngcontent-%COMP%]   section[_ngcontent-%COMP%]{margin-bottom:2rem!important}html[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{color:unset;text-decoration:underline;text-underline-offset:.2rem;text-decoration-thickness:.05rem}html[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover{text-decoration-thickness:.1rem}html[_ngcontent-%COMP%]   em[_ngcontent-%COMP%]{color:#5e3f9e;font-style:normal}html[_ngcontent-%COMP%]   em[_ngcontent-%COMP%]:hover{color:#4a3080}html[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{font-weight:600;color:#5e3f9e}html[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]{font-size:.8rem;font-weight:600;color:#5e3f9e}html[_ngcontent-%COMP%]   .colored[_ngcontent-%COMP%]{color:#5e3f9e}html[_ngcontent-%COMP%]   .secondary[_ngcontent-%COMP%]{color:#d65db1}html[_ngcontent-%COMP%]   .secondary-decorative[_ngcontent-%COMP%]{color:#ff9671}html[_ngcontent-%COMP%]   .italic[_ngcontent-%COMP%]{font-style:italic}html[_ngcontent-%COMP%]   .small[_ngcontent-%COMP%]{font-size:.8rem}@media screen and (min-width: 1600px){html[_ngcontent-%COMP%]{font-size:1.2rem}}@media screen and (max-width: 1200px){html[_ngcontent-%COMP%]{font-size:1rem}}@media screen and (max-width: 1000px){html[_ngcontent-%COMP%]{font-size:.9rem}}@media screen and (max-width: 700px){html[_ngcontent-%COMP%]{font-size:.8rem}}@media screen and (max-width: 400px){html[_ngcontent-%COMP%]{font-size:.7rem}}button[_ngcontent-%COMP%]{padding:.25rem .9rem;border:none;border-radius:4px;cursor:pointer;font-size:.65rem;transition:background-color .3s ease}button.primary[_ngcontent-%COMP%]{background-color:#007bff;color:#fff}button.primary[_ngcontent-%COMP%]:hover:not(:disabled){background-color:#0056b3}button.secondary[_ngcontent-%COMP%]{background-color:#6c757d;color:#fff}button.secondary[_ngcontent-%COMP%]:hover:not(:disabled){background-color:#545b62}button.ghost[_ngcontent-%COMP%]{position:relative;overflow:hidden;background-color:transparent;color:#5e3f9e;border-bottom:2px solid #5e3f9e;border-right:2px solid #5e3f9e;border-top:2px solid #d65db1;border-left:2px solid #d65db1;border-radius:0;transition:color .2s ease,border-top-color .5s ease,border-left-color .5s ease .1s}button.ghost[_ngcontent-%COMP%]   .btn-label[_ngcontent-%COMP%]{position:relative;z-index:1}button.ghost[_ngcontent-%COMP%]:before{content:"";position:absolute;top:0;left:0;bottom:0;width:200%;z-index:0;background:linear-gradient(to right,#f9f871,#ffc75f,#ff9671,#ff6f91,#d65db1 40%,#5e3f9e 50% 100%);transform:translate(100%);transition:transform .6s ease}button.ghost[_ngcontent-%COMP%]:hover:not(:disabled){color:#fafafa;transition:color .3s ease .3s,border-top-color .5s ease,border-left-color .5s ease .1s;border-color:#5e3f9e}button.ghost[_ngcontent-%COMP%]:hover:not(:disabled):before{transform:translate(calc(-50% + 1px))}button[_ngcontent-%COMP%]:disabled{opacity:.6;cursor:not-allowed}',
                    ],
                });
            }
        }
        return e;
    })();
var XP = ["*", [["", "dialog-header", ""]], [["", "dialog-footer", ""]]],
    JP = ["*", "[dialog-header]", "[dialog-footer]"];
function eN(e, n) {
    e & 1 && Ge(0, 1);
}
function tN(e, n) {
    e & 1 && Ge(0, 2);
}
var pb = (() => {
    class e {
        constructor(t) {
            ((this.isVisible = !1),
                (this.buttonLabel = "En savoir plus +"),
                (this.elementRef = t));
        }
        showDialog() {
            this.isVisible = !0;
        }
        clickFct(t) {
            G0(t, this.elementRef.nativeElement) && (this.isVisible = !1);
        }
        static {
            this.ɵfac = function (r) {
                return new (r || e)(Se(tt));
            };
        }
        static {
            this.ɵcmp = R({
                type: e,
                selectors: [["app-dialog"]],
                hostBindings: function (r, i) {
                    r & 1 &&
                        qe(
                            "mousedown",
                            function (s) {
                                return i.clickFct(s);
                            },
                            !1,
                            P_
                        );
                },
                inputs: { buttonLabel: "buttonLabel" },
                standalone: !1,
                ngContentSelectors: JP,
                decls: 6,
                vars: 2,
                consts: [
                    [
                        "variant",
                        "ghost",
                        "type",
                        "button",
                        "ariaLabel",
                        "Ouvrir la modale de d\xE9tails",
                        "buttonId",
                        "open-modal-button",
                        3,
                        "click",
                    ],
                    ["maximizable", "true", 3, "visibleChange", "visible"],
                    ["pTemplate", "header"],
                    ["pTemplate", "footer"],
                ],
                template: function (r, i) {
                    (r & 1 &&
                        (Ct(XP),
                        m(0, "app-button", 0),
                        qe("click", function () {
                            return i.showDialog();
                        }),
                        C(1),
                        g(),
                        m(2, "p-dialog", 1),
                        bf("visibleChange", function (s) {
                            return (Zy(i.isVisible, s) || (i.isVisible = s), s);
                        }),
                        P(3, eN, 1, 0, "ng-template", 2),
                        Ge(4),
                        P(5, tN, 1, 0, "ng-template", 3),
                        g()),
                        r & 2 &&
                            (v(),
                            Ce(i.buttonLabel),
                            v(),
                            vf("visible", i.isVisible)));
                },
                dependencies: [zp, Bi, fb],
                styles: [
                    "app-dialog[_ngcontent-%COMP%]{display:flex;flex-direction:row;flex-wrap:wrap;min-width:fit-content;align-items:flex-start;align-content:flex-start;margin-top:.2rem}app-dialog[_ngcontent-%COMP%]   app-button[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{display:flex;flex-direction:row;flex-wrap:nowrap;width:fit-content;min-height:1rem;height:fit-content;font-weight:700;font-size:.6rem;margin-left:.5rem;margin-right:.5rem;margin-top:auto;margin-bottom:auto;padding:.15rem .55rem}.p-dialog.p-component[_ngcontent-%COMP%]{background-color:#fff;position:absolute;border:.5rem solid;border-radius:0;border-color:#ff9671 #ff6f91 #ff6f91 #ff9671;width:min(95vw,600px);background:#fffc;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);padding:1rem;--p-button-text-secondary-color: #5e3f9e}.p-dialog[_ngcontent-%COMP%]   .p-dialog-header[_ngcontent-%COMP%]{display:flex;flex-direction:row;flex-wrap:wrap;align-content:flex-start;align-items:flex-start!important;text-transform:uppercase;padding:2rem}.p-dialog[_ngcontent-%COMP%]   .p-dialog-close-button[_ngcontent-%COMP%]{background-color:transparent;color:#5e3f9e;font-weight:800;border:none;width:1rem;height:1rem;cursor:pointer;transform-origin:center center}.p-dialog[_ngcontent-%COMP%]   .p-dialog-close-button[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%]{display:block;transform-origin:center center}.p-dialog[_ngcontent-%COMP%]   .p-dialog-close-button[_ngcontent-%COMP%]:hover{animation:_ngcontent-%COMP%_spin-rainbow .4s ease-in-out,_ngcontent-%COMP%_rainbow-icon .4s linear normal}.p-dialog[_ngcontent-%COMP%]   .p-dialog-maximize-button[_ngcontent-%COMP%]:hover{animation:_ngcontent-%COMP%_rainbow-icon .4s linear normal,_ngcontent-%COMP%_grow-icon .4s ease-in-out}.p-dialog[_ngcontent-%COMP%]   .p-dialog-header-actions[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.5rem}@keyframes _ngcontent-%COMP%_spin-rainbow{0%{transform:rotate(0)}to{transform:rotate(360deg)}}@keyframes _ngcontent-%COMP%_grow-icon{0%{transform:scale(1)}50%{transform:scale(1.2)}to{transform:scale(1)}}@keyframes _ngcontent-%COMP%_rainbow-icon{0%{filter:hue-rotate(0deg) saturate(3)}to{filter:hue-rotate(360deg) saturate(3)}}.p-dialog[_ngcontent-%COMP%]   .p-dialog-content[_ngcontent-%COMP%]{padding:1rem 2rem}.p-dialog[_ngcontent-%COMP%]   .p-dialog-footer[_ngcontent-%COMP%]{padding:2rem;display:flex;flex-direction:row;flex-wrap:wrap;justify-content:flex-end}",
                ],
            });
        }
    }
    return e;
})();
var ur = (() => {
    class e {
        static {
            this.ɵfac = function (r) {
                return new (r || e)();
            };
        }
        static {
            this.ɵcmp = R({
                type: e,
                selectors: [["app-separator"]],
                standalone: !1,
                decls: 2,
                vars: 0,
                consts: [["aria-hidden", "true", 1, "separator"]],
                template: function (r, i) {
                    r & 1 && (m(0, "span", 0), C(1, "\xA0/\xA0"), g());
                },
                styles: [
                    "app-dialog[_ngcontent-%COMP%]{display:flex;flex-direction:row;flex-wrap:wrap;min-width:fit-content;align-items:flex-start;align-content:flex-start;margin-top:.2rem}app-dialog[_ngcontent-%COMP%]   app-button[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{display:flex;flex-direction:row;flex-wrap:nowrap;width:fit-content;min-height:1rem;height:fit-content;font-weight:700;font-size:.6rem;margin-left:.5rem;margin-right:.5rem;margin-top:auto;margin-bottom:auto;padding:.15rem .55rem}.p-dialog.p-component[_ngcontent-%COMP%]{background-color:#fff;position:absolute;border:.5rem solid;border-radius:0;border-color:#ff9671 #ff6f91 #ff6f91 #ff9671;width:min(95vw,600px);background:#fffc;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);padding:1rem;--p-button-text-secondary-color: #5e3f9e}.p-dialog[_ngcontent-%COMP%]   .p-dialog-header[_ngcontent-%COMP%]{display:flex;flex-direction:row;flex-wrap:wrap;align-content:flex-start;align-items:flex-start!important;text-transform:uppercase;padding:2rem}.p-dialog[_ngcontent-%COMP%]   .p-dialog-close-button[_ngcontent-%COMP%]{background-color:transparent;color:#5e3f9e;font-weight:800;border:none;width:1rem;height:1rem;cursor:pointer;transform-origin:center center}.p-dialog[_ngcontent-%COMP%]   .p-dialog-close-button[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%]{display:block;transform-origin:center center}.p-dialog[_ngcontent-%COMP%]   .p-dialog-close-button[_ngcontent-%COMP%]:hover{animation:_ngcontent-%COMP%_spin-rainbow .4s ease-in-out,_ngcontent-%COMP%_rainbow-icon .4s linear normal}.p-dialog[_ngcontent-%COMP%]   .p-dialog-maximize-button[_ngcontent-%COMP%]:hover{animation:_ngcontent-%COMP%_rainbow-icon .4s linear normal,_ngcontent-%COMP%_grow-icon .4s ease-in-out}.p-dialog[_ngcontent-%COMP%]   .p-dialog-header-actions[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.5rem}@keyframes _ngcontent-%COMP%_spin-rainbow{0%{transform:rotate(0)}to{transform:rotate(360deg)}}@keyframes _ngcontent-%COMP%_grow-icon{0%{transform:scale(1)}50%{transform:scale(1.2)}to{transform:scale(1)}}@keyframes _ngcontent-%COMP%_rainbow-icon{0%{filter:hue-rotate(0deg) saturate(3)}to{filter:hue-rotate(360deg) saturate(3)}}.p-dialog[_ngcontent-%COMP%]   .p-dialog-content[_ngcontent-%COMP%]{padding:1rem 2rem}.p-dialog[_ngcontent-%COMP%]   .p-dialog-footer[_ngcontent-%COMP%]{padding:2rem;display:flex;flex-direction:row;flex-wrap:wrap;justify-content:flex-end}*[_ngcontent-%COMP%]{margin:0;padding:0;box-sizing:border-box}html[_ngcontent-%COMP%]{font-family:Lexend,sans-serif;font-weight:300;font-size:16px;margin:unset;padding:unset;box-sizing:border-box;color:#070f13}html[_ngcontent-%COMP%]   section[_ngcontent-%COMP%]{margin-bottom:2rem!important}html[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{color:unset;text-decoration:underline;text-underline-offset:.2rem;text-decoration-thickness:.05rem}html[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover{text-decoration-thickness:.1rem}html[_ngcontent-%COMP%]   em[_ngcontent-%COMP%]{color:#5e3f9e;font-style:normal}html[_ngcontent-%COMP%]   em[_ngcontent-%COMP%]:hover{color:#4a3080}html[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{font-weight:600;color:#5e3f9e}html[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]{font-size:.8rem;font-weight:600;color:#5e3f9e}html[_ngcontent-%COMP%]   .colored[_ngcontent-%COMP%]{color:#5e3f9e}html[_ngcontent-%COMP%]   .secondary[_ngcontent-%COMP%]{color:#d65db1}html[_ngcontent-%COMP%]   .secondary-decorative[_ngcontent-%COMP%]{color:#ff9671}html[_ngcontent-%COMP%]   .italic[_ngcontent-%COMP%]{font-style:italic}html[_ngcontent-%COMP%]   .small[_ngcontent-%COMP%]{font-size:.8rem}@media screen and (min-width: 1600px){html[_ngcontent-%COMP%]{font-size:1.2rem}}@media screen and (max-width: 1200px){html[_ngcontent-%COMP%]{font-size:1rem}}@media screen and (max-width: 1000px){html[_ngcontent-%COMP%]{font-size:.9rem}}@media screen and (max-width: 700px){html[_ngcontent-%COMP%]{font-size:.8rem}}@media screen and (max-width: 400px){html[_ngcontent-%COMP%]{font-size:.7rem}}.separator[_ngcontent-%COMP%]{color:#ff9671}",
                ],
            });
        }
    }
    return e;
})();
function rN(e, n) {
    if ((e & 1 && (m(0, "p", 8), C(1), g()), e & 2)) {
        let t = n.$implicit;
        (v(), ft(" ", t, " "));
    }
}
function iN(e, n) {
    e & 1 && D(0, "app-separator");
}
function oN(e, n) {
    if (
        (e & 1 &&
            (m(0, "span", 9)(1, "span", 10),
            C(2),
            g(),
            P(3, iN, 1, 0, "app-separator", 11),
            g()),
        e & 2)
    ) {
        let t = n.$implicit,
            r = n.last;
        (v(2), Ce(t), v(), b("ngIf", !r));
    }
}
var hb = (() => {
    class e {
        constructor() {
            this.buttonLabel = "En savoir plus +";
        }
        static {
            this.ɵfac = function (r) {
                return new (r || e)();
            };
        }
        static {
            this.ɵcmp = R({
                type: e,
                selectors: [["app-see-more-dialog"]],
                inputs: { content: "content", buttonLabel: "buttonLabel" },
                standalone: !1,
                decls: 11,
                vars: 6,
                consts: [
                    [3, "buttonLabel"],
                    ["dialog-header", "", 1, "title-container"],
                    [1, "header-title"],
                    [1, "header-subtitle"],
                    [1, "header-additional-info"],
                    ["class", "dialog-content", 4, "ngFor", "ngForOf"],
                    [
                        "ngProjectAs",
                        "[dialog-footer]",
                        5,
                        ["", "dialog-footer", ""],
                    ],
                    ["class", "footer-item", 4, "ngFor", "ngForOf"],
                    [1, "dialog-content"],
                    [1, "footer-item"],
                    [1, "colored"],
                    [4, "ngIf"],
                ],
                template: function (r, i) {
                    (r & 1 &&
                        (m(0, "app-dialog", 0)(1, "span", 1)(2, "span", 2),
                        C(3),
                        g(),
                        m(4, "span", 3),
                        C(5),
                        g(),
                        m(6, "span", 4),
                        C(7),
                        g()(),
                        P(8, rN, 2, 1, "p", 5),
                        ut(9, 6),
                        P(10, oN, 4, 2, "span", 7),
                        dt(),
                        g()),
                        r & 2 &&
                            (b("buttonLabel", i.buttonLabel),
                            v(3),
                            Ce(i.content.header[0]),
                            v(2),
                            Ce(i.content.header[1]),
                            v(2),
                            Ce(i.content.header[2]),
                            v(),
                            b("ngForOf", i.content.paragraphs),
                            v(2),
                            b("ngForOf", i.content.stack)));
                },
                dependencies: [kt, Et, pb, ur],
                styles: [
                    "app-dialog[_ngcontent-%COMP%]{display:flex;flex-direction:row;flex-wrap:wrap;min-width:fit-content;align-items:flex-start;align-content:flex-start;margin-top:.2rem}app-dialog[_ngcontent-%COMP%]   app-button[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{display:flex;flex-direction:row;flex-wrap:nowrap;width:fit-content;min-height:1rem;height:fit-content;font-weight:700;font-size:.6rem;margin-left:.5rem;margin-right:.5rem;margin-top:auto;margin-bottom:auto;padding:.15rem .55rem}.p-dialog.p-component[_ngcontent-%COMP%]{background-color:#fff;position:absolute;border:.5rem solid;border-radius:0;border-color:#ff9671 #ff6f91 #ff6f91 #ff9671;width:min(95vw,600px);background:#fffc;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);padding:1rem;--p-button-text-secondary-color: #5e3f9e}.p-dialog[_ngcontent-%COMP%]   .p-dialog-header[_ngcontent-%COMP%]{display:flex;flex-direction:row;flex-wrap:wrap;align-content:flex-start;align-items:flex-start!important;text-transform:uppercase;padding:2rem}.p-dialog[_ngcontent-%COMP%]   .p-dialog-close-button[_ngcontent-%COMP%]{background-color:transparent;color:#5e3f9e;font-weight:800;border:none;width:1rem;height:1rem;cursor:pointer;transform-origin:center center}.p-dialog[_ngcontent-%COMP%]   .p-dialog-close-button[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%]{display:block;transform-origin:center center}.p-dialog[_ngcontent-%COMP%]   .p-dialog-close-button[_ngcontent-%COMP%]:hover{animation:_ngcontent-%COMP%_spin-rainbow .4s ease-in-out,_ngcontent-%COMP%_rainbow-icon .4s linear normal}.p-dialog[_ngcontent-%COMP%]   .p-dialog-maximize-button[_ngcontent-%COMP%]:hover{animation:_ngcontent-%COMP%_rainbow-icon .4s linear normal,_ngcontent-%COMP%_grow-icon .4s ease-in-out}.p-dialog[_ngcontent-%COMP%]   .p-dialog-header-actions[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.5rem}@keyframes _ngcontent-%COMP%_spin-rainbow{0%{transform:rotate(0)}to{transform:rotate(360deg)}}@keyframes _ngcontent-%COMP%_grow-icon{0%{transform:scale(1)}50%{transform:scale(1.2)}to{transform:scale(1)}}@keyframes _ngcontent-%COMP%_rainbow-icon{0%{filter:hue-rotate(0deg) saturate(3)}to{filter:hue-rotate(360deg) saturate(3)}}.p-dialog[_ngcontent-%COMP%]   .p-dialog-content[_ngcontent-%COMP%]{padding:1rem 2rem}.p-dialog[_ngcontent-%COMP%]   .p-dialog-footer[_ngcontent-%COMP%]{padding:2rem;display:flex;flex-direction:row;flex-wrap:wrap;justify-content:flex-end}*[_ngcontent-%COMP%]{margin:0;padding:0;box-sizing:border-box}html[_ngcontent-%COMP%]{font-family:Lexend,sans-serif;font-weight:300;font-size:16px;margin:unset;padding:unset;box-sizing:border-box;color:#070f13}html[_ngcontent-%COMP%]   section[_ngcontent-%COMP%]{margin-bottom:2rem!important}html[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{color:unset;text-decoration:underline;text-underline-offset:.2rem;text-decoration-thickness:.05rem}html[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover{text-decoration-thickness:.1rem}html[_ngcontent-%COMP%]   em[_ngcontent-%COMP%]{color:#5e3f9e;font-style:normal}html[_ngcontent-%COMP%]   em[_ngcontent-%COMP%]:hover{color:#4a3080}html[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{font-weight:600;color:#5e3f9e}html[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]{font-size:.8rem;font-weight:600;color:#5e3f9e}html[_ngcontent-%COMP%]   .colored[_ngcontent-%COMP%]{color:#5e3f9e}html[_ngcontent-%COMP%]   .secondary[_ngcontent-%COMP%]{color:#d65db1}html[_ngcontent-%COMP%]   .secondary-decorative[_ngcontent-%COMP%]{color:#ff9671}html[_ngcontent-%COMP%]   .italic[_ngcontent-%COMP%]{font-style:italic}html[_ngcontent-%COMP%]   .small[_ngcontent-%COMP%]{font-size:.8rem}@media screen and (min-width: 1600px){html[_ngcontent-%COMP%]{font-size:1.2rem}}@media screen and (max-width: 1200px){html[_ngcontent-%COMP%]{font-size:1rem}}@media screen and (max-width: 1000px){html[_ngcontent-%COMP%]{font-size:.9rem}}@media screen and (max-width: 700px){html[_ngcontent-%COMP%]{font-size:.8rem}}@media screen and (max-width: 400px){html[_ngcontent-%COMP%]{font-size:.7rem}}.title-container[_ngcontent-%COMP%]{display:flex;flex-direction:column;width:90%}.title-container[_ngcontent-%COMP%]   .header-title[_ngcontent-%COMP%]{font-weight:700;color:#5e3f9e;width:90%}.title-container[_ngcontent-%COMP%]   .header-additional-info[_ngcontent-%COMP%]{font-style:italic;font-size:.8rem}.dialog-content[_ngcontent-%COMP%]{display:flex;flex-direction:column;line-height:1.5rem;margin-bottom:.7rem}.footer-item[_ngcontent-%COMP%]{display:flex;flex-direction:row;flex-wrap:nowrap}",
                ],
            });
        }
    }
    return e;
})();
function aN(e, n) {
    e & 1 && D(0, "app-separator");
}
function lN(e, n) {
    if (
        (e & 1 &&
            (m(0, "span", 3)(1, "span", 4),
            C(2),
            g(),
            P(3, aN, 1, 0, "app-separator", 5),
            g()),
        e & 2)
    ) {
        let t = n.$implicit,
            r = n.last;
        (v(2), Ce(t), v(), b("ngIf", !r));
    }
}
var gb = (() => {
    class e {
        static {
            this.ɵfac = function (r) {
                return new (r || e)();
            };
        }
        static {
            this.ɵcmp = R({
                type: e,
                selectors: [["app-stack"]],
                inputs: { stack: "stack" },
                standalone: !1,
                decls: 4,
                vars: 1,
                consts: [
                    [1, "stack-container"],
                    [1, "stack-title"],
                    ["class", "stack-item", 4, "ngFor", "ngForOf"],
                    [1, "stack-item"],
                    [1, "item-text"],
                    [4, "ngIf"],
                ],
                template: function (r, i) {
                    (r & 1 &&
                        (m(0, "div", 0)(1, "span", 1),
                        C(2, "Stack >"),
                        g(),
                        P(3, lN, 4, 2, "span", 2),
                        g()),
                        r & 2 && (v(3), b("ngForOf", i.stack)));
                },
                dependencies: [kt, Et, ur],
                styles: [
                    "app-dialog[_ngcontent-%COMP%]{display:flex;flex-direction:row;flex-wrap:wrap;min-width:fit-content;align-items:flex-start;align-content:flex-start;margin-top:.2rem}app-dialog[_ngcontent-%COMP%]   app-button[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{display:flex;flex-direction:row;flex-wrap:nowrap;width:fit-content;min-height:1rem;height:fit-content;font-weight:700;font-size:.6rem;margin-left:.5rem;margin-right:.5rem;margin-top:auto;margin-bottom:auto;padding:.15rem .55rem}.p-dialog.p-component[_ngcontent-%COMP%]{background-color:#fff;position:absolute;border:.5rem solid;border-radius:0;border-color:#ff9671 #ff6f91 #ff6f91 #ff9671;width:min(95vw,600px);background:#fffc;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);padding:1rem;--p-button-text-secondary-color: #5e3f9e}.p-dialog[_ngcontent-%COMP%]   .p-dialog-header[_ngcontent-%COMP%]{display:flex;flex-direction:row;flex-wrap:wrap;align-content:flex-start;align-items:flex-start!important;text-transform:uppercase;padding:2rem}.p-dialog[_ngcontent-%COMP%]   .p-dialog-close-button[_ngcontent-%COMP%]{background-color:transparent;color:#5e3f9e;font-weight:800;border:none;width:1rem;height:1rem;cursor:pointer;transform-origin:center center}.p-dialog[_ngcontent-%COMP%]   .p-dialog-close-button[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%]{display:block;transform-origin:center center}.p-dialog[_ngcontent-%COMP%]   .p-dialog-close-button[_ngcontent-%COMP%]:hover{animation:_ngcontent-%COMP%_spin-rainbow .4s ease-in-out,_ngcontent-%COMP%_rainbow-icon .4s linear normal}.p-dialog[_ngcontent-%COMP%]   .p-dialog-maximize-button[_ngcontent-%COMP%]:hover{animation:_ngcontent-%COMP%_rainbow-icon .4s linear normal,_ngcontent-%COMP%_grow-icon .4s ease-in-out}.p-dialog[_ngcontent-%COMP%]   .p-dialog-header-actions[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.5rem}@keyframes _ngcontent-%COMP%_spin-rainbow{0%{transform:rotate(0)}to{transform:rotate(360deg)}}@keyframes _ngcontent-%COMP%_grow-icon{0%{transform:scale(1)}50%{transform:scale(1.2)}to{transform:scale(1)}}@keyframes _ngcontent-%COMP%_rainbow-icon{0%{filter:hue-rotate(0deg) saturate(3)}to{filter:hue-rotate(360deg) saturate(3)}}.p-dialog[_ngcontent-%COMP%]   .p-dialog-content[_ngcontent-%COMP%]{padding:1rem 2rem}.p-dialog[_ngcontent-%COMP%]   .p-dialog-footer[_ngcontent-%COMP%]{padding:2rem;display:flex;flex-direction:row;flex-wrap:wrap;justify-content:flex-end}*[_ngcontent-%COMP%]{margin:0;padding:0;box-sizing:border-box}html[_ngcontent-%COMP%]{font-family:Lexend,sans-serif;font-weight:300;font-size:16px;margin:unset;padding:unset;box-sizing:border-box;color:#070f13}html[_ngcontent-%COMP%]   section[_ngcontent-%COMP%]{margin-bottom:2rem!important}html[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{color:unset;text-decoration:underline;text-underline-offset:.2rem;text-decoration-thickness:.05rem}html[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover{text-decoration-thickness:.1rem}html[_ngcontent-%COMP%]   em[_ngcontent-%COMP%]{color:#5e3f9e;font-style:normal}html[_ngcontent-%COMP%]   em[_ngcontent-%COMP%]:hover{color:#4a3080}html[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{font-weight:600;color:#5e3f9e}html[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]{font-size:.8rem;font-weight:600;color:#5e3f9e}html[_ngcontent-%COMP%]   .colored[_ngcontent-%COMP%]{color:#5e3f9e}html[_ngcontent-%COMP%]   .secondary[_ngcontent-%COMP%]{color:#d65db1}html[_ngcontent-%COMP%]   .secondary-decorative[_ngcontent-%COMP%]{color:#ff9671}html[_ngcontent-%COMP%]   .italic[_ngcontent-%COMP%]{font-style:italic}html[_ngcontent-%COMP%]   .small[_ngcontent-%COMP%]{font-size:.8rem}@media screen and (min-width: 1600px){html[_ngcontent-%COMP%]{font-size:1.2rem}}@media screen and (max-width: 1200px){html[_ngcontent-%COMP%]{font-size:1rem}}@media screen and (max-width: 1000px){html[_ngcontent-%COMP%]{font-size:.9rem}}@media screen and (max-width: 700px){html[_ngcontent-%COMP%]{font-size:.8rem}}@media screen and (max-width: 400px){html[_ngcontent-%COMP%]{font-size:.7rem}}.stack-container[_ngcontent-%COMP%]{display:flex;flex-direction:row;flex-wrap:wrap;gap:4px}.stack-title[_ngcontent-%COMP%]{background-color:#ff9671;color:#070f13;padding:0 8px}.stack-item[_ngcontent-%COMP%] > .item-text[_ngcontent-%COMP%]{color:#5e3f9e}",
                ],
            });
        }
    }
    return e;
})();
var mb = (() => {
    class e {
        constructor() {
            ((this.detailsCapco = {
                header: [
                    "D\xE9veloppeuse web front-end",
                    "Cap Collectif",
                    "avril 2024 - aujourd'hui",
                ],
                paragraphs: [
                    "Cap Collectif d\xE9veloppe des outils open source d'intelligence collective, sous la forme d'un SaaS.",
                    "Les diff\xE9rentes applications du produit : budget participatif, questionnaire, d\xE9bat, bo\xEEte \xE0 id\xE9es, consultation, etc.",
                    "\u2B50\uFE0F Ma valeur ajout\xE9e : la proactivit\xE9 dans la r\xE9duction de la dette technique, la r\xE9duction des co\xFBts, et l'am\xE9lioration de l'exp\xE9rience D\xE9veloppeuse.",
                    "\u{1F4CC} Une initiative : j'ai sugg\xE9r\xE9 et pris en charge la correction r\xE9guli\xE8re des failles de s\xE9curit\xE9.",
                    `\u{1F4CC} Une optimisation cl\xE9 : j'ai r\xE9organis\xE9 les tests et corrig\xE9 "flaky" en priorisant ceux qui \xE9chouaient le plus fr\xE9quemment, ce qui a permis d'\xE9conomiser des cr\xE9dits CI, et de faire gagner du temps \xE0 l'\xE9quipe tech au quotidien (diminution de 33% de la dur\xE9e moyenne d'une CI).`,
                    "\u{1F4CC} Une am\xE9lioration invisible mais impactante : en supprimant les sources de variabilit\xE9 comme les images al\xE9atoires et les dates dynamiques dans Storybook, j\u2019ai r\xE9duit les faux positifs dans les tests visuels. Cela a permis de diminuer le besoin de validations manuelles.",
                    "\u{1F4CC} Une t\xE2che challengeante : le remplacement de l'outil de bundle du Design System, non-maintenu (TSDX) par Rollup.",
                    "Recrut\xE9e au poste de d\xE9veloppeuse front-end, je n'ai pas h\xE9sit\xE9 \xE0 me porter volontaire pour des t\xE2ches back-end, avec l'assistance de l'IA, afin de r\xE9duire la charge de travail de l'\xE9quipe.",
                ],
                stack: [
                    "ReactJS",
                    "TypeScript",
                    "GraphQL",
                    "Next.js",
                    "Relay",
                    "react-hook-form",
                    "Storybook",
                    "Chromatic",
                    "Figma",
                    "Cypress",
                    "CircleCI",
                    "GitHub",
                    "OrbStack",
                    "NPM",
                    "Rituels agiles",
                    "Claude Code",
                ],
            }),
                (this.detailsAvanade = {
                    header: [
                        "D\xE9veloppeuse web front-end",
                        "Avanade (ESN)",
                        "septembre 2022 - d\xE9cembre 2023",
                    ],
                    paragraphs: [
                        "Avanade est une ESN, joint-venture entre Microsoft et Accenture",
                        "\u{1F4CC} De d\xE9cembre 2022 \xE0 d\xE9cembre 2023 (pour VEOLIA et la Soci\xE9t\xE9 des Eaux de Marseille) : portage en Angular d'une application web existante permettant de g\xE9rer les abonnements en eau sur toute la France.",
                        "L'application permet la gestion des donn\xE9es relatives aux clientes et clients, aux interventions, aux contrats, etc.",
                        "\u2B50\uFE0F Ma valeur ajout\xE9e : proposer l'adoption de normes (git flow, conventional commits, approche design system, conventions de nommage, etc.) et l'uniformisation du code, n\xE9cessaires sur un projet d'une telle ampleur.",
                        "\u{1F4CC} Avant d\xE9cembre 2022 (en interne) : j'ai particip\xE9 au d\xE9veloppement de divers outils et applications.",
                    ],
                    stack: [
                        "Angular",
                        "TypeScript",
                        "REST",
                        "Tailwind CSS",
                        "SCSS",
                        "NgRx",
                        "SCRUM",
                        "Azure DevOps",
                        "Rituels agiles",
                        "SQL",
                        "Figma",
                        "Adobe XD",
                    ],
                }),
                (this.detailsGoodVibes = {
                    header: [
                        "D\xE9veloppeuse web fullstack",
                        "GOOD Vibes",
                        "Juillet 2021 - juillet 2022",
                    ],
                    paragraphs: [
                        "GOOD Vibes est un syst\xE8me d'envoi de vid\xE9os personnalis\xE9es pour les entreprises, par e-mail et sms.",
                        "Le produit comporte une plate-forme admin, qui permet de cr\xE9er une playlist et de g\xE9rer les envois, ainsi qu'un player vid\xE9o interactif.",
                        `J'ai travaill\xE9 sur 3 projets : la refonte du site vitrine, l'am\xE9lioration de la plate-forme, et l'am\xE9lioration du "player" (le lecteur vid\xE9o et son \xE9cosyst\xE8me).`,
                        "\u{1F4CC} Le site vitrine a \xE9t\xE9 r\xE9alis\xE9 en ReactJS.",
                        "\u{1F4CC} Les am\xE9liorations front-end ont consist\xE9 en la proposition de nouvelles maquettes (r\xE9alis\xE9es sur Figma), ensuite d\xE9velopp\xE9es en ReactJS et SCSS avec Storybook, ainsi que le d\xE9veloppement d'une galerie de composants r\xE9utilisables. Pour \xE9viter toute r\xE9gression visuelle, une validation des \xE9crans sur Chromatic \xE9tait obligatoire.",
                        "\u{1F4CC} C\xF4t\xE9 back-end, il s'agissait de correction de bugs.",
                        "Chaque fonctionnalit\xE9 \xE9tait test\xE9e (Cypress & Jest) au moment du d\xE9veloppement, et les erreurs monitor\xE9es sur Sentry.",
                        "\u{1F4CC} J'ai mis \xE0 profit mes comp\xE9tences en gestion de projet pour am\xE9liorer les processus internes et la documentation du code.",
                    ],
                    stack: [
                        "ReactJS",
                        "TypeScript",
                        "Storybook",
                        "Chromatic",
                        "Node.js",
                        "Netlify",
                        "Cypress",
                        "Jest",
                        "GitHub",
                        "Figma",
                        "Sentry",
                        "AppDrag",
                        "SQL",
                        "Travail asynchrone France - USA",
                    ],
                }),
                (this.detailsVisigo = {
                    header: [
                        "Charg\xE9e de projets web",
                        "Visigo",
                        "Juillet 2021 - juillet 2022",
                    ],
                    paragraphs: [
                        "\u{1F4CC} J'ai \u0153uvr\xE9 \xE0 la mise \xE0 jour et l'optimisation du site internet.",
                        "Avec l'aide d'un consultant sp\xE9cialis\xE9, j'ai effectu\xE9 un diagnostic de l'existant et cherch\xE9 les am\xE9liorations possibles pour le r\xE9f\xE9rencement, notamment avec les outils de la suite Google (Lighthouse, Search Console, Analytics).",
                        "J'ai travaill\xE9 avec une graphiste \xE0 la refonte de certaines pages, que j'ai mises \xE0 jour en impl\xE9mentant les nouveaux designs et en am\xE9liorant le responsive design.",
                        "J'ai \xE9galement corrig\xE9 et am\xE9lior\xE9 le contenu \xE9ditorial (notamment la syntaxe et l'orthographe).",
                        "\u{1F4CC} Afin d'am\xE9liorer la fluidit\xE9 des processus internes, j'ai mis en place de nouveaux outils, et form\xE9 l'\xE9quipe \xE0 leur utilisation.",
                    ],
                    stack: [
                        "Google Analytics",
                        "Google Lighthouse",
                        "Google Search Console",
                        "R\xE9f\xE9rencement",
                        "SEO",
                        "HTML",
                        "CSS",
                        "AppDrag",
                    ],
                }),
                (this.detailsGapYear = {
                    header: [
                        "D\xE9veloppement personnel",
                        "",
                        "Novembre 2018 - juillet 2021",
                    ],
                    paragraphs: [
                        "\u{1F4CC} Apr\xE8s l'obtention de mon Master, j'ai souhait\xE9 faire une ann\xE9e de c\xE9sure afin de voyager et de d\xE9velopper mes projets personnels.",
                        "Mon visa Vacances-Travail en poche, je me suis rendue au Canada pour 2 ans (dur\xE9e raccourcie en raison de la pand\xE9mie \u{1F637}). Sur place, j'ai voyag\xE9 et occup\xE9 divers postes : commise en boulangerie, professoresse de fran\xE7ais (pour anglophones), et nanny dans une famille Canadienne.",
                        "J'ai \xE9t\xE9 guitariste dans un groupe de rock 60's \xE0 Montr\xE9al, et chanteuse-guitariste dans un duo de bluegrass (musique traditionnelle am\xE9ricaine).",
                        "Durant ces deux ann\xE9es, j'ai voyag\xE9 seule au Canada, aux Etats-Unis, en Europe, et en France.",
                        "\u{1F4CC} De retour du Canada, j'ai co-fond\xE9 l'association Pourvoir F\xE9ministe, laboratoire d'id\xE9es et d'actions, en lien avec des chercheuses et sp\xE9cialistes des questions politiques et f\xE9ministes.",
                        "\u{1F4CC} J'ai \xE9galement particip\xE9 \xE0 l'organisation et la coordination d'\xE9v\xE9nements f\xE9ministes.",
                        "\u{1F4CC} C'est durant cette p\xE9riode que j'ai commenc\xE9 \xE0 m'autoformer afin de lancer ma reconversion professionnelle et de devenir d\xE9veloppeuse web.",
                    ],
                    stack: [
                        "B\xE9n\xE9volat",
                        "Voyages",
                        "D\xE9veloppement de projets",
                        "Organisation d'\xE9v\xE9nements",
                        "R\xE9daction de documents",
                        "Cours de fran\xE7ais",
                        "Guitare & chant",
                    ],
                }),
                (this.detailsBnpParibas = {
                    header: [
                        "Charg\xE9e de projets, communication, et \xE9v\xE9nements",
                        "BNP Paribas",
                        "Septembre 2015 - octobre 2018",
                    ],
                    paragraphs: [
                        "Poste occup\xE9 dans 3 entit\xE9s diff\xE9rentes du Groupe. A chaque fois, en charge de l'organisation de nombreux \xE9v\xE9nements ainsi que de la communication digitale.",
                        "\u{1F4CC} A la Fondation (m\xE9c\xE9nat d'entreprise) - de 2017 \xE0 2018",
                        "J'ai organis\xE9 plus de 130 soir\xE9es de relations publiques partout en France (et quelques \xE9v\xE9nements \xE0 l'\xE9tranger) : concerts et festivals musicaux, avant-premi\xE8res \xE0 l'Op\xE9ra national de Paris, spectacles de cirque nouveau, magie nouvelle, danse contemporaine.",
                        "J'ai \xE9galement particip\xE9 \xE0 la cr\xE9ation du Dansathon, premier hackathon m\xEAlant danse et technologie, durant 3 jours, \xE0 Lyon (France), Li\xE8ge (Belgique) et Londres (Royaume-Uni).",
                        "En plus de ces missions, j'ai particip\xE9 au suivi du lien avec les artistes soutenu\xB7es par la Fondation ainsi qu'\xE0 la communication digitale autour de leurs actualit\xE9s.",
                        "\u{1F4CC} Chez LEGAL (fonction Juridique) - de 2016 \xE0 2017",
                        "En charge de la production et publication quotidienne du contenu \xE9ditorial : entretiens, portraits, nouveaut\xE9s et actualit\xE9s juridiques, images d'illustration, etc.",
                        "Je prenais \xE9galement en charge l'organisation des \xE9v\xE9nements : s\xE9minaires, collectes caritatives, team buildings, journ\xE9es d'accueil, salons de recrutement, etc.",
                        "Afin d'am\xE9liorer la fluidit\xE9 du travail et la performance des \xE9quipes, j'ai pu d\xE9velopper de nouveaux outils (tels que le r\xE9seau social interne) et former les \xE9quipes \xE0 son utilisation.",
                        "\u{1F4CC} Au sein de Group Procurement (fonction Achats) - de 2015 \xE0 2016",
                        "En bin\xF4me avec ma responsable, j'ai organis\xE9 tous les \xE9v\xE9nements de la fili\xE8re Achats en France et \xE0 l'\xE9tranger pour le Groupe. Des \xE9v\xE9nements caritatifs (collectes de dons et de fonds pour des associations nationales) aux s\xE9minaires avec les responsables Achats \xE0 l'\xE9tranger, en passant par les journ\xE9es d'accueil des nouveaux et nouvelles arrivantes et les teams buildings des diff\xE9rentes \xE9quipes.",
                        "J'ai \xE9galement d\xE9velopp\xE9 (architecture et design) le r\xE9seau social interne, promu son utilisation et form\xE9 les \xE9quipes.",
                    ],
                    stack: [
                        "Organisation d'\xE9v\xE9nements",
                        "Communication interne & externe",
                        "Acculturation digitale",
                    ],
                }),
                (this.detailsOtherExperiences = {
                    header: [
                        "B\xE9n\xE9volat et jobs \xE9tudiants",
                        "",
                        "Depuis 2010",
                    ],
                    paragraphs: [
                        "\u{1F4CC} Vendeuse et auxiliaire d'accueil (les week-ends et vacances scolaires) pendant mes \xE9tudes",
                        "\u{1F4CC} Baby-sitter (10 ans d'exp\xE9rience)",
                        "\u{1F4CC} Photographe \xE9ditrice b\xE9n\xE9vole au sein d'associations (concerts et \xE9v\xE9nements)",
                        "\u{1F4CC} Correctrice-relectrice b\xE9n\xE9vole pour divers m\xE9dias",
                        "\u{1F4CC} R\xE9gie plateau b\xE9n\xE9vole d'une compagnie de th\xE9\xE2tre",
                        "\u{1F4CC} Organisation de collectes (Restos du Coeur et T\xE9l\xE9thon)",
                    ],
                    stack: [
                        "Sens des responsabilit\xE9s",
                        "Sens du partage",
                        "Solidarit\xE9",
                        "Production & \xE9dition d'images",
                        "Relation client",
                        "Autonomie",
                        "Gestion financi\xE8re",
                    ],
                }));
        }
        static {
            this.ɵfac = function (r) {
                return new (r || e)();
            };
        }
        static {
            this.ɵcmp = R({
                type: e,
                selectors: [["app-professional-xp"]],
                standalone: !1,
                decls: 161,
                vars: 15,
                consts: [
                    [3, "title"],
                    [1, "experience-header"],
                    [3, "content"],
                    [1, "colored"],
                    [3, "stack"],
                    [3, "href", "ariaLabel"],
                    [1, "italic"],
                    [3, "content", "buttonLabel"],
                ],
                template: function (r, i) {
                    (r & 1 &&
                        (m(0, "div"),
                        D(1, "app-title", 0),
                        m(2, "section")(3, "span", 1)(4, "h3"),
                        C(5, "D\xE9veloppeuse web front-end"),
                        g(),
                        D(6, "app-see-more-dialog", 2),
                        g(),
                        m(7, "legend", 3),
                        C(8, "Cap Collectif (2024 \u2013 aujourd'hui)"),
                        g(),
                        m(9, "h4"),
                        C(
                            10,
                            "\xC9quipe de 9 personnes - \xE9quipe tech de 6 personnes"
                        ),
                        g(),
                        m(11, "ul")(12, "li"),
                        C(
                            13,
                            " D\xE9veloppement de fonctionnalit\xE9s, refontes techniques et visuelles "
                        ),
                        g(),
                        m(14, "li"),
                        C(
                            15,
                            " Maintenance de la librairie de composants (Design System) sur NPM "
                        ),
                        g(),
                        m(16, "li"),
                        C(
                            17,
                            " Am\xE9lioration de l\u2019accessibilit\xE9 : impl\xE9mentation de nouveaux patterns et nouvelles balises HTML, application des bonnes pratiques, mise en oeuvre des retours d'audits, etc. "
                        ),
                        g(),
                        m(18, "li"),
                        C(
                            19,
                            " R\xE9duction proactive de la dette technique : d\xE9tection et correction de bugs, refactorisations, mises \xE0 jour de s\xE9curit\xE9, mont\xE9es de versions, am\xE9lioration de tests "
                        ),
                        g(),
                        m(20, "li"),
                        C(
                            21,
                            " Am\xE9lioration de l\u2019exp\xE9rience d\xE9veloppeuse : modification des configurations et des scripts, correction des tests \u201Cflaky\u201D dans la CI, correction de \u201Cfaux diffs\u201D dans les outils d\u2019int\xE9gration continue comme Chromatic pour r\xE9duire les validations manuelles, etc. "
                        ),
                        g(),
                        m(22, "li"),
                        C(
                            23,
                            " Diminution des co\xFBts variables : optimisation de la CI et r\xE9\xE9valuation de la valeur ajout\xE9e des outils payants "
                        ),
                        g(),
                        m(24, "li"),
                        C(
                            25,
                            "Mise en place des ADR (Architecture Decision Records)"
                        ),
                        g(),
                        m(26, "li"),
                        C(
                            27,
                            ' Utilisation quotidienne de l\u2019IA (Claude Code / Copilot / Mistral) pour acc\xE9l\xE9rer le d\xE9veloppement, pour l\u2019aide au d\xE9bug, pour refactoriser, pour travailler sur du back-end, ou en mode "teacher" pour approfondir un sujet technique '
                        ),
                        g()(),
                        D(28, "app-stack", 4),
                        g(),
                        m(29, "section")(30, "span", 1)(31, "h3"),
                        C(32, "D\xE9veloppeuse web front-end"),
                        g(),
                        D(33, "app-see-more-dialog", 2),
                        g(),
                        m(34, "legend", 3),
                        C(35, "Avanade (ESN) (2022 \u2013 2023)"),
                        g(),
                        m(36, "h4"),
                        C(
                            37,
                            " Somei / VEOLIA - \xE9quipe de 20 personnes - \xE9quipe tech de 15 personnes "
                        ),
                        g(),
                        m(38, "ul")(39, "li"),
                        C(
                            40,
                            "Portage du front-end d\u2019une application ASP.NET vers Angular"
                        ),
                        g(),
                        m(41, "li"),
                        C(42, "Cr\xE9ation de composants r\xE9utilisables"),
                        g(),
                        m(43, "li"),
                        C(44, " R\xE9alisation "),
                        m(45, "i"),
                        C(46, "pixel perfect"),
                        g(),
                        C(
                            47,
                            " des \xE9crans et d\xE9veloppement des fonctionnalit\xE9s "
                        ),
                        g(),
                        m(48, "li"),
                        C(49, "Correction des bugs"),
                        g(),
                        m(50, "li"),
                        C(51, "Proposition et mise en place de normes"),
                        g()(),
                        D(52, "br"),
                        m(53, "h4"),
                        C(
                            54,
                            "Projets internes Avanade - \xE9quipe front-end : 10 personnes"
                        ),
                        g(),
                        m(55, "ul")(56, "li"),
                        C(57, "Cr\xE9ation d'outils internes"),
                        g(),
                        m(58, "li"),
                        C(59, "R\xE9alisation "),
                        m(60, "i"),
                        C(61, "pixel perfect"),
                        g(),
                        C(62, " de maquettes Adobe XD"),
                        g(),
                        m(63, "li"),
                        C(
                            64,
                            " Travail sur le Design System interne (conception, d\xE9veloppement et mise \xE0 jour des composants) "
                        ),
                        g()(),
                        D(65, "app-stack", 4),
                        g(),
                        m(66, "section")(67, "span", 1)(68, "h3"),
                        C(69, "D\xE9veloppeuse fullstack"),
                        g(),
                        D(70, "app-see-more-dialog", 2),
                        g(),
                        m(71, "legend", 3),
                        C(72, "GOOD Vibes (2021 \u2013 2022)"),
                        g(),
                        m(73, "h4"),
                        C(74, "\xC9quipe de 2 personnes"),
                        g(),
                        m(75, "ul")(76, "li"),
                        C(77, " Refonte du "),
                        m(78, "app-external-link", 5),
                        C(79, " site vitrine "),
                        g()(),
                        m(80, "li"),
                        C(
                            81,
                            " D\xE9veloppement des am\xE9liorations et \xE9volutions front-end de l'application "
                        ),
                        g(),
                        m(82, "li"),
                        C(
                            83,
                            "Am\xE9liorations back-end de la plateforme produit"
                        ),
                        g(),
                        m(84, "li"),
                        C(85, "CI/CD, d\xE9ploiement"),
                        g(),
                        m(86, "li"),
                        C(87, "Impl\xE9mentation de tests"),
                        g(),
                        m(88, "li"),
                        C(89, "Suivi des erreurs"),
                        g(),
                        m(90, "li"),
                        C(91, "Maquettage / design"),
                        g(),
                        m(92, "li"),
                        C(
                            93,
                            " Am\xE9lioration continue : gestion de projets, documentation du code, am\xE9lioration des processus internes "
                        ),
                        g(),
                        m(94, "li"),
                        C(
                            95,
                            " Correction du contenu \xE9ditorial : orthographe et v\xE9rification des traductions FR\xA0\u21D4\xA0EN "
                        ),
                        g()(),
                        D(96, "app-stack", 4),
                        g(),
                        m(97, "section")(98, "span", 1)(99, "h3"),
                        C(100, "Charg\xE9e de projets web"),
                        g(),
                        D(101, "app-see-more-dialog", 2),
                        g(),
                        m(102, "legend", 3),
                        C(103, "Visigo (2021 \u2013 2022)"),
                        g(),
                        m(104, "h4"),
                        C(105, "\xC9quipe de 2 personnes"),
                        g(),
                        m(106, "ul")(107, "li"),
                        C(
                            108,
                            "D\xE9finition et application de la strat\xE9gie SEO"
                        ),
                        g(),
                        m(109, "li"),
                        C(
                            110,
                            " Maintenance du site internet : refonte de pages, corrections (responsive, orthographe, syntaxe, etc.) "
                        ),
                        g(),
                        m(111, "li"),
                        C(112, "Gestion des projets web de l'agence"),
                        g(),
                        m(113, "li"),
                        C(
                            114,
                            " Impl\xE9mentation de nouveaux outils, formation et acculturation digitale de l'\xE9quipe "
                        ),
                        g()(),
                        D(115, "app-stack", 4),
                        g(),
                        m(116, "section")(117, "span", 1)(118, "h3"),
                        C(119, "D\xE9veloppement personnel"),
                        g(),
                        D(120, "app-see-more-dialog", 2),
                        g(),
                        m(121, "legend", 3),
                        C(122, "(2018 \u2013 2021)"),
                        g(),
                        m(123, "ul")(124, "li"),
                        C(
                            125,
                            "Voyages et Permis Vacances-Travail (Europe, USA, Canada)"
                        ),
                        g(),
                        m(126, "li"),
                        C(
                            127,
                            " Co-fondation et d\xE9veloppement de Pourvoir F\xE9ministe, think tank politique "
                        ),
                        g(),
                        m(128, "li"),
                        C(
                            129,
                            "B\xE9n\xE9volat au sein de diverses associations et collectifs"
                        ),
                        g(),
                        m(130, "li"),
                        C(131, "Projets musicaux et projets personnels"),
                        g(),
                        m(132, "li"),
                        C(133, " Reconversion professionnelle dans le "),
                        m(134, "em"),
                        C(135, "d\xE9veloppement web"),
                        g(),
                        C(
                            136,
                            ". Autoformation (freecodecamp, CodeCademy), obtention de certifications (HTML, CSS), bootcamp D\xE9veloppement web fullstack : HTML, CSS, JavaScript, React, Node.js, MongoDB, ExpressJS "
                        ),
                        m(137, "span", 6),
                        C(138, '("MERN stack")'),
                        g(),
                        C(139, ". "),
                        g()()(),
                        m(140, "section")(141, "span", 1)(142, "h3"),
                        C(
                            143,
                            "Charg\xE9e de projets, communication, et \xE9v\xE9nements"
                        ),
                        g(),
                        D(144, "app-see-more-dialog", 2),
                        g(),
                        m(145, "legend", 3),
                        C(146, "BNP Paribas (2015 \u2013 2018)"),
                        g(),
                        m(147, "ul")(148, "li"),
                        C(
                            149,
                            " D\xE9veloppement des outils num\xE9riques internes (ex : architecture, design, et mise en place du r\xE9seau social interne) et formation des collaborateur\xB7ices "
                        ),
                        g(),
                        m(150, "li"),
                        C(
                            151,
                            " Organisation d\u2019\xE9v\xE9nements : jusqu\u2019\xE0 130 par an, de 10 \xE0 150 participant\xB7es (logistique, communication, gestion "
                        ),
                        m(152, "span", 6),
                        C(153, "in situ"),
                        g(),
                        C(154, ") "),
                        g(),
                        m(155, "li"),
                        C(
                            156,
                            " Cr\xE9ation d'outils r\xE9utilisables, d\xE9veloppement des processus et am\xE9lioration continue "
                        ),
                        g(),
                        m(157, "li"),
                        C(
                            158,
                            " Webmastering du site intranet et mise \xE0 jour du site internet : r\xE9daction, correction, traduction FR\xA0\u21D4\xA0EN, illustration, et mise en ligne du contenu "
                        ),
                        g()()(),
                        m(159, "section"),
                        D(160, "app-see-more-dialog", 7),
                        g()()),
                        r & 2 &&
                            (v(),
                            b("title", "Exp\xE9rience professionnelle"),
                            v(5),
                            b("content", i.detailsCapco),
                            v(22),
                            b("stack", i.detailsCapco.stack),
                            v(5),
                            b("content", i.detailsAvanade),
                            v(32),
                            b("stack", i.detailsAvanade.stack),
                            v(5),
                            b("content", i.detailsGoodVibes),
                            v(8),
                            b("href", "https://goodvibes.news/")(
                                "ariaLabel",
                                "GOOD Vibes"
                            ),
                            v(18),
                            b("stack", i.detailsGoodVibes.stack),
                            v(5),
                            b("content", i.detailsVisigo),
                            v(14),
                            b("stack", i.detailsVisigo.stack),
                            v(5),
                            b("content", i.detailsGapYear),
                            v(24),
                            b("content", i.detailsBnpParibas),
                            v(16),
                            b("content", i.detailsOtherExperiences)(
                                "buttonLabel",
                                "Voir plus d'exp\xE9riences"
                            )));
                },
                dependencies: [Cn, hb, io, gb],
                styles: [
                    '@charset "UTF-8";app-dialog[_ngcontent-%COMP%]{display:flex;flex-direction:row;flex-wrap:wrap;min-width:fit-content;align-items:flex-start;align-content:flex-start;margin-top:.2rem}app-dialog[_ngcontent-%COMP%]   app-button[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{display:flex;flex-direction:row;flex-wrap:nowrap;width:fit-content;min-height:1rem;height:fit-content;font-weight:700;font-size:.6rem;margin-left:.5rem;margin-right:.5rem;margin-top:auto;margin-bottom:auto;padding:.15rem .55rem}.p-dialog.p-component[_ngcontent-%COMP%]{background-color:#fff;position:absolute;border:.5rem solid;border-radius:0;border-color:#ff9671 #ff6f91 #ff6f91 #ff9671;width:min(95vw,600px);background:#fffc;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);padding:1rem;--p-button-text-secondary-color: #5e3f9e}.p-dialog[_ngcontent-%COMP%]   .p-dialog-header[_ngcontent-%COMP%]{display:flex;flex-direction:row;flex-wrap:wrap;align-content:flex-start;align-items:flex-start!important;text-transform:uppercase;padding:2rem}.p-dialog[_ngcontent-%COMP%]   .p-dialog-close-button[_ngcontent-%COMP%]{background-color:transparent;color:#5e3f9e;font-weight:800;border:none;width:1rem;height:1rem;cursor:pointer;transform-origin:center center}.p-dialog[_ngcontent-%COMP%]   .p-dialog-close-button[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%]{display:block;transform-origin:center center}.p-dialog[_ngcontent-%COMP%]   .p-dialog-close-button[_ngcontent-%COMP%]:hover{animation:_ngcontent-%COMP%_spin-rainbow .4s ease-in-out,_ngcontent-%COMP%_rainbow-icon .4s linear normal}.p-dialog[_ngcontent-%COMP%]   .p-dialog-maximize-button[_ngcontent-%COMP%]:hover{animation:_ngcontent-%COMP%_rainbow-icon .4s linear normal,_ngcontent-%COMP%_grow-icon .4s ease-in-out}.p-dialog[_ngcontent-%COMP%]   .p-dialog-header-actions[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.5rem}@keyframes _ngcontent-%COMP%_spin-rainbow{0%{transform:rotate(0)}to{transform:rotate(360deg)}}@keyframes _ngcontent-%COMP%_grow-icon{0%{transform:scale(1)}50%{transform:scale(1.2)}to{transform:scale(1)}}@keyframes _ngcontent-%COMP%_rainbow-icon{0%{filter:hue-rotate(0deg) saturate(3)}to{filter:hue-rotate(360deg) saturate(3)}}.p-dialog[_ngcontent-%COMP%]   .p-dialog-content[_ngcontent-%COMP%]{padding:1rem 2rem}.p-dialog[_ngcontent-%COMP%]   .p-dialog-footer[_ngcontent-%COMP%]{padding:2rem;display:flex;flex-direction:row;flex-wrap:wrap;justify-content:flex-end}*[_ngcontent-%COMP%]{margin:0;padding:0;box-sizing:border-box}html[_ngcontent-%COMP%]{font-family:Lexend,sans-serif;font-weight:300;font-size:16px;margin:unset;padding:unset;box-sizing:border-box;color:#070f13}html[_ngcontent-%COMP%]   section[_ngcontent-%COMP%]{margin-bottom:2rem!important}html[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{color:unset;text-decoration:underline;text-underline-offset:.2rem;text-decoration-thickness:.05rem}html[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover{text-decoration-thickness:.1rem}html[_ngcontent-%COMP%]   em[_ngcontent-%COMP%]{color:#5e3f9e;font-style:normal}html[_ngcontent-%COMP%]   em[_ngcontent-%COMP%]:hover{color:#4a3080}html[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{font-weight:600;color:#5e3f9e}html[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]{font-size:.8rem;font-weight:600;color:#5e3f9e}html[_ngcontent-%COMP%]   .colored[_ngcontent-%COMP%]{color:#5e3f9e}html[_ngcontent-%COMP%]   .secondary[_ngcontent-%COMP%]{color:#d65db1}html[_ngcontent-%COMP%]   .secondary-decorative[_ngcontent-%COMP%]{color:#ff9671}html[_ngcontent-%COMP%]   .italic[_ngcontent-%COMP%]{font-style:italic}html[_ngcontent-%COMP%]   .small[_ngcontent-%COMP%]{font-size:.8rem}@media screen and (min-width: 1600px){html[_ngcontent-%COMP%]{font-size:1.2rem}}@media screen and (max-width: 1200px){html[_ngcontent-%COMP%]{font-size:1rem}}@media screen and (max-width: 1000px){html[_ngcontent-%COMP%]{font-size:.9rem}}@media screen and (max-width: 700px){html[_ngcontent-%COMP%]{font-size:.8rem}}@media screen and (max-width: 400px){html[_ngcontent-%COMP%]{font-size:.7rem}}[_nghost-%COMP%]{max-width:min(1200px,95vw)}legend[_ngcontent-%COMP%]{font-size:.8rem;margin-bottom:.5rem}ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{margin-left:1.5rem;line-height:1.8rem}ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]::marker{content:"\\2192  "}.experience-header[_ngcontent-%COMP%]{display:flex;flex-direction:row;flex-wrap:nowrap;gap:20px}',
                ],
            });
        }
    }
    return e;
})();
function dN(e, n) {
    e & 1 && D(0, "app-separator");
}
function fN(e, n) {
    if (
        (e & 1 && (m(0, "em"), C(1), P(2, dN, 1, 0, "app-separator", 14), g()),
        e & 2)
    ) {
        let t = n.$implicit,
            r = n.last;
        (v(), ft("", t, " "), v(), b("ngIf", !r));
    }
}
function pN(e, n) {
    e & 1 && D(0, "app-separator");
}
function hN(e, n) {
    if (
        (e & 1 && (m(0, "em"), C(1), P(2, pN, 1, 0, "app-separator", 14), g()),
        e & 2)
    ) {
        let t = n.$implicit,
            r = n.last;
        (v(), ft("", t, " "), v(), b("ngIf", !r));
    }
}
var _b = (() => {
    class e {
        constructor() {
            ((this.sectionTitle = $localize`:@@education.sectionTitle:Formation`),
                (this.wildCodeSchoolSkills = [
                    "Microservices",
                    $localize`:@@education.authentication:authentification`,
                    $localize`:@@education.deployment:déploiement`,
                    $localize`:@@education.security:sécurité`,
                    "SCRUM",
                    "DevOps",
                    $localize`:@@education.continuousIntegration:intégration continue`,
                    $localize`:@@education.mobileDevelopment:développement mobile`,
                ]),
                (this.ironhackSkills = [
                    "HTML",
                    "CSS",
                    "Javascript",
                    "Node.js",
                    "Express",
                    "MongoDB",
                    "ReactJS",
                ]));
        }
        static {
            this.ɵfac = function (r) {
                return new (r || e)();
            };
        }
        static {
            this.ɵcmp = R({
                type: e,
                selectors: [["app-education"]],
                standalone: !1,
                decls: 33,
                vars: 7,
                consts: () => {
                    let t;
                    t = $localize`:@@education.wcsTitle:Développement web et mobile avancé`;
                    let r;
                    r = $localize`:@@education.wcsDetails:Wild Code School (2021 - 2022) – 100% remote`;
                    let i;
                    i = $localize`:@@education.ironhackTitle:Développement web fullstack`;
                    let o;
                    o = $localize`:@@education.ironhackDetails:Ironhack (2021) – Cursus anglophone – 100 % remote`;
                    let s;
                    s = $localize`:@@education.ironhackDegree:Titre RNCP niveau 6 / Bac+3/4`;
                    let a;
                    a = $localize`:@@education.commTitle:Communication & Marketing (5 ans)`;
                    let l;
                    l = $localize`:@@education.commSpeciality:Spécialité digital / culture / multimédias`;
                    let c;
                    c = $localize`:@@education.masterLabel: Master : `;
                    let u;
                    return (
                        (u = $localize`:@@education.licenceLabel: Licence Pro : `),
                        [
                            t,
                            r,
                            i,
                            o,
                            s,
                            a,
                            l,
                            c,
                            u,
                            [3, "title"],
                            [1, "colored"],
                            [3, "href", "ariaLabel"],
                            [1, "small"],
                            [4, "ngFor", "ngForOf"],
                            [4, "ngIf"],
                        ]
                    );
                },
                template: function (r, i) {
                    (r & 1 &&
                        (m(0, "div"),
                        D(1, "app-title", 9),
                        m(2, "section")(3, "h3", 10)(
                            4,
                            "app-external-link",
                            11
                        ),
                        Le(5, 0),
                        g()(),
                        m(6, "p", 12),
                        Le(7, 1),
                        g(),
                        m(8, "p"),
                        P(9, fN, 3, 2, "em", 13),
                        g()(),
                        m(10, "section")(11, "h3", 10)(
                            12,
                            "app-external-link",
                            11
                        ),
                        Le(13, 2),
                        g()(),
                        m(14, "p", 12),
                        Le(15, 3),
                        g(),
                        m(16, "p"),
                        Le(17, 4),
                        g(),
                        m(18, "p"),
                        P(19, hN, 3, 2, "em", 13),
                        g()(),
                        m(20, "section")(21, "h3", 10),
                        Le(22, 5),
                        g(),
                        m(23, "p"),
                        Le(24, 6),
                        g(),
                        m(25, "p")(26, "strong"),
                        Le(27, 7),
                        g(),
                        C(28, " Sup de Pub \u2013 INSEEC (2018) "),
                        g(),
                        m(29, "p")(30, "strong"),
                        Le(31, 8),
                        g(),
                        C(32, " Universit\xE9 de Cergy-Pontoise (2016) "),
                        g()()()),
                        r & 2 &&
                            (v(),
                            b("title", i.sectionTitle),
                            v(3),
                            b(
                                "href",
                                "https://www.wildcodeschool.com/fr-FR/formations/formation-developpeur-web-alternance"
                            )("ariaLabel", "Wild Code School"),
                            v(5),
                            b("ngForOf", i.wildCodeSchoolSkills),
                            v(3),
                            b(
                                "href",
                                "https://www.ironhack.com/en/web-development/paris"
                            )("ariaLabel", "Ironhack"),
                            v(7),
                            b("ngForOf", i.ironhackSkills)));
                },
                dependencies: [kt, Et, Cn, io, ur],
                styles: ["section[_ngcontent-%COMP%]{line-height:1.5rem}"],
            });
        }
    }
    return e;
})();
function mN(e, n) {
    e & 1 && (m(0, "span"), Le(1, 3), g());
}
function _N(e, n) {
    e & 1 && D(0, "app-separator");
}
function yN(e, n) {
    if (
        (e & 1 &&
            (m(0, "p", 11), C(1), P(2, _N, 1, 0, "app-separator", 9), g()),
        e & 2)
    ) {
        let t = n.$implicit,
            r = n.last;
        (v(), ft(" ", t, " "), v(), b("ngIf", !r));
    }
}
function vN(e, n) {
    if (
        (e & 1 &&
            (m(0, "span")(1, "span", 8)(2, "h4")(3, "em"),
            C(4),
            P(5, mN, 2, 0, "span", 9),
            g()(),
            P(6, yN, 3, 2, "p", 10),
            g()()),
        e & 2)
    ) {
        let t = n.$implicit;
        (v(4),
            Ce(t.sectionTitle),
            v(),
            b("ngIf", t.skills && t.skills.length > 0),
            v(),
            b("ngForOf", t.skills));
    }
}
function bN(e, n) {
    e & 1 && (m(0, "span"), Le(1, 4), g());
}
function CN(e, n) {
    e & 1 && D(0, "app-separator");
}
function EN(e, n) {
    if (
        (e & 1 &&
            (m(0, "p", 14), C(1), P(2, CN, 1, 0, "app-separator", 9), g()),
        e & 2)
    ) {
        let t = n.$implicit,
            r = n.last;
        (v(), ft(" ", t, " "), v(), b("ngIf", !r));
    }
}
function SN(e, n) {
    if (
        (e & 1 &&
            (m(0, "span")(1, "span", 12)(2, "h4")(3, "em"),
            C(4),
            P(5, bN, 2, 0, "span", 9),
            g()(),
            P(6, EN, 3, 2, "p", 13),
            g()()),
        e & 2)
    ) {
        let t = n.$implicit;
        (v(4),
            Ce(t.sectionTitle),
            v(),
            b("ngIf", t.skills && t.skills.length > 0),
            v(),
            b("ngForOf", t.skills));
    }
}
var yb = (() => {
    class e {
        constructor() {
            ((this.sectionTitle = $localize`:@@skills.sectionTitle:Compétences`),
                (this.professionalSkills = [
                    {
                        sectionTitle: "Front-end",
                        skills: [
                            "ReactJS",
                            "Angular",
                            "Next.js",
                            "JavaScript",
                            "TypeScript",
                            "Storybook",
                            "Chromatic",
                        ],
                    },
                    {
                        sectionTitle: $localize`:@@skills.designAndCss:Design et CSS`,
                        skills: [
                            "Tailwind",
                            "SCSS",
                            $localize`:@@skills.libraries:librairies (PrimeNG, Mantine, etc.)`,
                            "Custom Design System",
                            $localize`:@@skills.uxUiPerfectionism:perfectionnisme UX/UI`,
                            $localize`:@@skills.accessibility:accessibilité (WCAG, ARIA)`,
                        ],
                    },
                    { sectionTitle: "Back-end", skills: ["Node.js", "PHP"] },
                    {
                        sectionTitle: $localize`:@@skills.prototyping:Maquettage`,
                        skills: ["Figma", "Photoshop"],
                    },
                    {
                        sectionTitle: $localize`:@@skills.testing:Tests`,
                        skills: ["Cypress", "Jest", "Jasmine"],
                    },
                    {
                        sectionTitle: $localize`:@@skills.methodology:Méthodologie`,
                        skills: [
                            "SCRUM",
                            "agile",
                            "pair programming",
                            "code reviews",
                        ],
                    },
                    {
                        sectionTitle: $localize`:@@skills.techWatch:Veille`,
                        skills: [
                            "meetups",
                            $localize`:@@skills.conferences:conférences`,
                        ],
                    },
                    {
                        sectionTitle: "Certifications",
                        skills: ["Microsoft AZ-900", "Microsoft PL-900"],
                    },
                    {
                        sectionTitle: $localize`:@@skills.communitySharing:Partage`,
                        skills: [
                            $localize`:@@skills.ladiesOfCode:oratrice Ladies of Code Paris`,
                        ],
                    },
                ]),
                (this.personalSkills = [
                    {
                        sectionTitle: $localize`:@@skills.continuousImprovement:Amélioration continue`,
                        skills: [
                            $localize`:@@skills.continuousImprovementDesc:identification et mise en œuvre d’améliorations dans les processus et le code.`,
                        ],
                    },
                    {
                        sectionTitle: $localize`:@@skills.attentionToDetail:Sens du détail`,
                        skills: [
                            $localize`:@@skills.attentionToDetailDesc:attention élevée à la qualité, à la précision, et aux bonnes pratiques.`,
                        ],
                    },
                    {
                        sectionTitle: $localize`:@@skills.curiosity:Curiosité`,
                        skills: [
                            $localize`:@@skills.curiosityDesc:goût pour l’expérimentation, y compris sur des sujets inconnus.`,
                        ],
                    },
                    {
                        sectionTitle: $localize`:@@skills.longTermVision:Vision long terme`,
                        skills: [
                            $localize`:@@skills.longTermVisionDesc:documentation, maintenabilité des solutions, et prévention de la dette technique.`,
                        ],
                    },
                    {
                        sectionTitle: $localize`:@@skills.systemsThinking:Pensée systémique`,
                        skills: [
                            $localize`:@@skills.systemsThinkingDesc:approche globale pour anticiper les impacts et les dépendances.`,
                        ],
                    },
                    {
                        sectionTitle: $localize`:@@skills.communication:Communication`,
                        skills: [
                            $localize`:@@skills.communicationDesc:excellente maîtrise de l’expression écrite (FR/EN) ; communication claire et structurée avec toutes les équipes.`,
                        ],
                    },
                ]));
        }
        static {
            this.ɵfac = function (r) {
                return new (r || e)();
            };
        }
        static {
            this.ɵcmp = R({
                type: e,
                selectors: [["app-skills"]],
                standalone: !1,
                decls: 10,
                vars: 3,
                consts: () => {
                    let t;
                    t = $localize`:@@skills.hardSkillsHeading:Savoir-faire`;
                    let r;
                    r = $localize`:@@skills.moreToLearnNote:Toujours enthousiaste à l'idée d'allonger cette liste !`;
                    let i;
                    i = $localize`:@@skills.softSkillsHeading:Savoir-être`;
                    let o;
                    o = $localize`:@@common.colon: : `;
                    let s;
                    return (
                        (s = $localize`:@@common.colon: : `),
                        [
                            t,
                            r,
                            i,
                            o,
                            s,
                            [3, "title"],
                            [4, "ngFor", "ngForOf"],
                            [1, "info"],
                            [1, "professional-skills-section"],
                            [4, "ngIf"],
                            [
                                "class",
                                "professional-skill skill-item",
                                4,
                                "ngFor",
                                "ngForOf",
                            ],
                            [1, "professional-skill", "skill-item"],
                            [1, "personal-skills-section"],
                            [
                                "class",
                                "personal-skill skill-item",
                                4,
                                "ngFor",
                                "ngForOf",
                            ],
                            [1, "personal-skill", "skill-item"],
                        ]
                    );
                },
                template: function (r, i) {
                    (r & 1 &&
                        (m(0, "section"),
                        D(1, "app-title", 5),
                        m(2, "h3"),
                        Le(3, 0),
                        g(),
                        P(4, vN, 7, 3, "span", 6),
                        m(5, "span", 7),
                        Le(6, 1),
                        g(),
                        m(7, "h3"),
                        Le(8, 2),
                        g(),
                        P(9, SN, 7, 3, "span", 6),
                        g()),
                        r & 2 &&
                            (v(),
                            b("title", i.sectionTitle),
                            v(3),
                            b("ngForOf", i.professionalSkills),
                            v(5),
                            b("ngForOf", i.personalSkills)));
                },
                dependencies: [kt, Et, Cn, ur],
                styles: [
                    "app-dialog[_ngcontent-%COMP%]{display:flex;flex-direction:row;flex-wrap:wrap;min-width:fit-content;align-items:flex-start;align-content:flex-start;margin-top:.2rem}app-dialog[_ngcontent-%COMP%]   app-button[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{display:flex;flex-direction:row;flex-wrap:nowrap;width:fit-content;min-height:1rem;height:fit-content;font-weight:700;font-size:.6rem;margin-left:.5rem;margin-right:.5rem;margin-top:auto;margin-bottom:auto;padding:.15rem .55rem}.p-dialog.p-component[_ngcontent-%COMP%]{background-color:#fff;position:absolute;border:.5rem solid;border-radius:0;border-color:#ff9671 #ff6f91 #ff6f91 #ff9671;width:min(95vw,600px);background:#fffc;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);padding:1rem;--p-button-text-secondary-color: #5e3f9e}.p-dialog[_ngcontent-%COMP%]   .p-dialog-header[_ngcontent-%COMP%]{display:flex;flex-direction:row;flex-wrap:wrap;align-content:flex-start;align-items:flex-start!important;text-transform:uppercase;padding:2rem}.p-dialog[_ngcontent-%COMP%]   .p-dialog-close-button[_ngcontent-%COMP%]{background-color:transparent;color:#5e3f9e;font-weight:800;border:none;width:1rem;height:1rem;cursor:pointer;transform-origin:center center}.p-dialog[_ngcontent-%COMP%]   .p-dialog-close-button[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%]{display:block;transform-origin:center center}.p-dialog[_ngcontent-%COMP%]   .p-dialog-close-button[_ngcontent-%COMP%]:hover{animation:_ngcontent-%COMP%_spin-rainbow .4s ease-in-out,_ngcontent-%COMP%_rainbow-icon .4s linear normal}.p-dialog[_ngcontent-%COMP%]   .p-dialog-maximize-button[_ngcontent-%COMP%]:hover{animation:_ngcontent-%COMP%_rainbow-icon .4s linear normal,_ngcontent-%COMP%_grow-icon .4s ease-in-out}.p-dialog[_ngcontent-%COMP%]   .p-dialog-header-actions[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.5rem}@keyframes _ngcontent-%COMP%_spin-rainbow{0%{transform:rotate(0)}to{transform:rotate(360deg)}}@keyframes _ngcontent-%COMP%_grow-icon{0%{transform:scale(1)}50%{transform:scale(1.2)}to{transform:scale(1)}}@keyframes _ngcontent-%COMP%_rainbow-icon{0%{filter:hue-rotate(0deg) saturate(3)}to{filter:hue-rotate(360deg) saturate(3)}}.p-dialog[_ngcontent-%COMP%]   .p-dialog-content[_ngcontent-%COMP%]{padding:1rem 2rem}.p-dialog[_ngcontent-%COMP%]   .p-dialog-footer[_ngcontent-%COMP%]{padding:2rem;display:flex;flex-direction:row;flex-wrap:wrap;justify-content:flex-end}*[_ngcontent-%COMP%]{margin:0;padding:0;box-sizing:border-box}html[_ngcontent-%COMP%]{font-family:Lexend,sans-serif;font-weight:300;font-size:16px;margin:unset;padding:unset;box-sizing:border-box;color:#070f13}html[_ngcontent-%COMP%]   section[_ngcontent-%COMP%]{margin-bottom:2rem!important}html[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{color:unset;text-decoration:underline;text-underline-offset:.2rem;text-decoration-thickness:.05rem}html[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover{text-decoration-thickness:.1rem}html[_ngcontent-%COMP%]   em[_ngcontent-%COMP%]{color:#5e3f9e;font-style:normal}html[_ngcontent-%COMP%]   em[_ngcontent-%COMP%]:hover{color:#4a3080}html[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{font-weight:600;color:#5e3f9e}html[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]{font-size:.8rem;font-weight:600;color:#5e3f9e}html[_ngcontent-%COMP%]   .colored[_ngcontent-%COMP%]{color:#5e3f9e}html[_ngcontent-%COMP%]   .secondary[_ngcontent-%COMP%]{color:#d65db1}html[_ngcontent-%COMP%]   .secondary-decorative[_ngcontent-%COMP%]{color:#ff9671}html[_ngcontent-%COMP%]   .italic[_ngcontent-%COMP%]{font-style:italic}html[_ngcontent-%COMP%]   .small[_ngcontent-%COMP%]{font-size:.8rem}@media screen and (min-width: 1600px){html[_ngcontent-%COMP%]{font-size:1.2rem}}@media screen and (max-width: 1200px){html[_ngcontent-%COMP%]{font-size:1rem}}@media screen and (max-width: 1000px){html[_ngcontent-%COMP%]{font-size:.9rem}}@media screen and (max-width: 700px){html[_ngcontent-%COMP%]{font-size:.8rem}}@media screen and (max-width: 400px){html[_ngcontent-%COMP%]{font-size:.7rem}}section[_ngcontent-%COMP%]{display:flex;flex-direction:column;line-height:1.9rem}.personal-skills[_ngcontent-%COMP%]{display:flex;flex-direction:row;display:inline-flex;flex-wrap:wrap}.professional-skills-section[_ngcontent-%COMP%], .personal-skills-section[_ngcontent-%COMP%]{display:inline}.personal-skills-section[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%], .professional-skills-section[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]{font-size:1rem;font-weight:400}.personal-skills-section[_ngcontent-%COMP%]   .personal-skill[_ngcontent-%COMP%], .personal-skills-section[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%], .professional-skills-section[_ngcontent-%COMP%]   .professional-skill[_ngcontent-%COMP%], .professional-skills-section[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]{line-height:normal;display:inline}.skill-item[_ngcontent-%COMP%]{width:fit-content}.info[_ngcontent-%COMP%]{padding-top:4px;padding-bottom:16px;font-size:.9rem}",
                ],
            });
        }
    }
    return e;
})();
var vb = (() => {
    class e {
        constructor() {
            this.sectionTitle = $localize`:@@activities.sectionTitle:Activités`;
        }
        static {
            this.ɵfac = function (r) {
                return new (r || e)();
            };
        }
        static {
            this.ɵcmp = R({
                type: e,
                selectors: [["app-activities"]],
                standalone: !1,
                decls: 20,
                vars: 1,
                consts: () => {
                    let t;
                    t = $localize`:@@activities.sport:${"\uFFFD#4\uFFFD"}:START_EMPHASISED_TEXT:Sport :${"\uFFFD/#4\uFFFD"}:CLOSE_EMPHASISED_TEXT: le midi, je nage ou je cours`;
                    let r;
                    r = $localize`:@@activities.music:${"\uFFFD#7\uFFFD"}:START_EMPHASISED_TEXT:Musique :${"\uFFFD/#7\uFFFD"}:CLOSE_EMPHASISED_TEXT: chant, guitare, piano, banjolele 🪕`;
                    let i;
                    i = $localize`:@@activities.volunteering:${"\uFFFD#10\uFFFD"}:START_EMPHASISED_TEXT:Bénévolat${"\uFFFD/#10\uFFFD"}:CLOSE_EMPHASISED_TEXT: et engagement : droits des Femmes, droits des animaux, solidarité, écologie & environnement`;
                    let o;
                    o = $localize`:@@activities.reading:${"\uFFFD#13\uFFFD"}:START_EMPHASISED_TEXT:Lecture :${"\uFFFD/#13\uFFFD"}:CLOSE_EMPHASISED_TEXT: tout ce qui me passe sous la main`;
                    let s;
                    s = $localize`:@@activities.travel:${"\uFFFD#16\uFFFD"}:START_EMPHASISED_TEXT:Voyages :${"\uFFFD/#16\uFFFD"}:CLOSE_EMPHASISED_TEXT: idéalement en train !`;
                    let a;
                    return (
                        (a = $localize`:@@activities.theatre:${"\uFFFD#19\uFFFD"}:START_EMPHASISED_TEXT:Théâtre :${"\uFFFD/#19\uFFFD"}:CLOSE_EMPHASISED_TEXT: vaudeville, classique, opéra, stand-up, comédie musicale...`),
                        [t, r, i, o, s, a, [3, "title"]]
                    );
                },
                template: function (r, i) {
                    (r & 1 &&
                        (m(0, "section"),
                        D(1, "app-title", 6),
                        m(2, "span"),
                        ir(3, 0),
                        D(4, "em"),
                        or(),
                        g(),
                        m(5, "span"),
                        ir(6, 1),
                        D(7, "em"),
                        or(),
                        g(),
                        m(8, "span"),
                        ir(9, 2),
                        D(10, "em"),
                        or(),
                        g(),
                        m(11, "span"),
                        ir(12, 3),
                        D(13, "em"),
                        or(),
                        g(),
                        m(14, "span"),
                        ir(15, 4),
                        D(16, "em"),
                        or(),
                        g(),
                        m(17, "span"),
                        ir(18, 5),
                        D(19, "em"),
                        or(),
                        g()()),
                        r & 2 && (v(), b("title", i.sectionTitle)));
                },
                dependencies: [Cn],
                styles: [
                    "app-dialog[_ngcontent-%COMP%]{display:flex;flex-direction:row;flex-wrap:wrap;min-width:fit-content;align-items:flex-start;align-content:flex-start;margin-top:.2rem}app-dialog[_ngcontent-%COMP%]   app-button[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{display:flex;flex-direction:row;flex-wrap:nowrap;width:fit-content;min-height:1rem;height:fit-content;font-weight:700;font-size:.6rem;margin-left:.5rem;margin-right:.5rem;margin-top:auto;margin-bottom:auto;padding:.15rem .55rem}.p-dialog.p-component[_ngcontent-%COMP%]{background-color:#fff;position:absolute;border:.5rem solid;border-radius:0;border-color:#ff9671 #ff6f91 #ff6f91 #ff9671;width:min(95vw,600px);background:#fffc;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);padding:1rem;--p-button-text-secondary-color: #5e3f9e}.p-dialog[_ngcontent-%COMP%]   .p-dialog-header[_ngcontent-%COMP%]{display:flex;flex-direction:row;flex-wrap:wrap;align-content:flex-start;align-items:flex-start!important;text-transform:uppercase;padding:2rem}.p-dialog[_ngcontent-%COMP%]   .p-dialog-close-button[_ngcontent-%COMP%]{background-color:transparent;color:#5e3f9e;font-weight:800;border:none;width:1rem;height:1rem;cursor:pointer;transform-origin:center center}.p-dialog[_ngcontent-%COMP%]   .p-dialog-close-button[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%]{display:block;transform-origin:center center}.p-dialog[_ngcontent-%COMP%]   .p-dialog-close-button[_ngcontent-%COMP%]:hover{animation:_ngcontent-%COMP%_spin-rainbow .4s ease-in-out,_ngcontent-%COMP%_rainbow-icon .4s linear normal}.p-dialog[_ngcontent-%COMP%]   .p-dialog-maximize-button[_ngcontent-%COMP%]:hover{animation:_ngcontent-%COMP%_rainbow-icon .4s linear normal,_ngcontent-%COMP%_grow-icon .4s ease-in-out}.p-dialog[_ngcontent-%COMP%]   .p-dialog-header-actions[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.5rem}@keyframes _ngcontent-%COMP%_spin-rainbow{0%{transform:rotate(0)}to{transform:rotate(360deg)}}@keyframes _ngcontent-%COMP%_grow-icon{0%{transform:scale(1)}50%{transform:scale(1.2)}to{transform:scale(1)}}@keyframes _ngcontent-%COMP%_rainbow-icon{0%{filter:hue-rotate(0deg) saturate(3)}to{filter:hue-rotate(360deg) saturate(3)}}.p-dialog[_ngcontent-%COMP%]   .p-dialog-content[_ngcontent-%COMP%]{padding:1rem 2rem}.p-dialog[_ngcontent-%COMP%]   .p-dialog-footer[_ngcontent-%COMP%]{padding:2rem;display:flex;flex-direction:row;flex-wrap:wrap;justify-content:flex-end}*[_ngcontent-%COMP%]{margin:0;padding:0;box-sizing:border-box}html[_ngcontent-%COMP%]{font-family:Lexend,sans-serif;font-weight:300;font-size:16px;margin:unset;padding:unset;box-sizing:border-box;color:#070f13}html[_ngcontent-%COMP%]   section[_ngcontent-%COMP%]{margin-bottom:2rem!important}html[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{color:unset;text-decoration:underline;text-underline-offset:.2rem;text-decoration-thickness:.05rem}html[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover{text-decoration-thickness:.1rem}html[_ngcontent-%COMP%]   em[_ngcontent-%COMP%]{color:#5e3f9e;font-style:normal}html[_ngcontent-%COMP%]   em[_ngcontent-%COMP%]:hover{color:#4a3080}html[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{font-weight:600;color:#5e3f9e}html[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]{font-size:.8rem;font-weight:600;color:#5e3f9e}html[_ngcontent-%COMP%]   .colored[_ngcontent-%COMP%]{color:#5e3f9e}html[_ngcontent-%COMP%]   .secondary[_ngcontent-%COMP%]{color:#d65db1}html[_ngcontent-%COMP%]   .secondary-decorative[_ngcontent-%COMP%]{color:#ff9671}html[_ngcontent-%COMP%]   .italic[_ngcontent-%COMP%]{font-style:italic}html[_ngcontent-%COMP%]   .small[_ngcontent-%COMP%]{font-size:.8rem}@media screen and (min-width: 1600px){html[_ngcontent-%COMP%]{font-size:1.2rem}}@media screen and (max-width: 1200px){html[_ngcontent-%COMP%]{font-size:1rem}}@media screen and (max-width: 1000px){html[_ngcontent-%COMP%]{font-size:.9rem}}@media screen and (max-width: 700px){html[_ngcontent-%COMP%]{font-size:.8rem}}@media screen and (max-width: 400px){html[_ngcontent-%COMP%]{font-size:.7rem}}section[_ngcontent-%COMP%]{display:flex;flex-direction:column;line-height:1.9rem}",
                ],
            });
        }
    }
    return e;
})();
function MN(e, n) {
    if (
        (e & 1 &&
            (m(0, "span")(1, "em"),
            C(2),
            g(),
            m(3, "span"),
            Le(4, 0),
            g(),
            C(5),
            g()),
        e & 2)
    ) {
        let t = n.$implicit;
        (v(2), Ce(t.lang), v(3), ft("", t.level, " "));
    }
}
var bb = (() => {
    class e {
        constructor() {
            ((this.sectionTitle = $localize`:@@languages.sectionTitle:Langues`),
                (this.languages = [
                    {
                        lang: $localize`:@@languages.french:Français`,
                        level: $localize`:@@languages.frenchLevel:Langue maternelle`,
                    },
                    {
                        lang: $localize`:@@languages.english:Anglais`,
                        level: $localize`:@@languages.englishLevel:Maîtrise professionnelle (C1)`,
                    },
                    {
                        lang: $localize`:@@languages.spanish:Espagnol`,
                        level: $localize`:@@languages.spanishLevel:Compétence professionnelle limitée (B1/B2)`,
                    },
                    {
                        lang: $localize`:@@languages.japanese:Japonais`,
                        level: $localize`:@@languages.japaneseLevel:Notions (A1/A2)`,
                    },
                    {
                        lang: $localize`:@@languages.chinese:Chinois`,
                        level: $localize`:@@languages.chineseLevel:Niveau élémentaire (A2), bases académiques (INALCO)`,
                    },
                ]));
        }
        static {
            this.ɵfac = function (r) {
                return new (r || e)();
            };
        }
        static {
            this.ɵcmp = R({
                type: e,
                selectors: [["app-languages"]],
                standalone: !1,
                decls: 3,
                vars: 2,
                consts: () => {
                    let t;
                    return (
                        (t = $localize`:@@common.colon: : `),
                        [t, [3, "title"], [4, "ngFor", "ngForOf"]]
                    );
                },
                template: function (r, i) {
                    (r & 1 &&
                        (m(0, "section"),
                        D(1, "app-title", 1),
                        P(2, MN, 6, 2, "span", 2),
                        g()),
                        r & 2 &&
                            (v(),
                            b("title", i.sectionTitle),
                            v(),
                            b("ngForOf", i.languages)));
                },
                dependencies: [kt, Cn],
                styles: [
                    "app-dialog[_ngcontent-%COMP%]{display:flex;flex-direction:row;flex-wrap:wrap;min-width:fit-content;align-items:flex-start;align-content:flex-start;margin-top:.2rem}app-dialog[_ngcontent-%COMP%]   app-button[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{display:flex;flex-direction:row;flex-wrap:nowrap;width:fit-content;min-height:1rem;height:fit-content;font-weight:700;font-size:.6rem;margin-left:.5rem;margin-right:.5rem;margin-top:auto;margin-bottom:auto;padding:.15rem .55rem}.p-dialog.p-component[_ngcontent-%COMP%]{background-color:#fff;position:absolute;border:.5rem solid;border-radius:0;border-color:#ff9671 #ff6f91 #ff6f91 #ff9671;width:min(95vw,600px);background:#fffc;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);padding:1rem;--p-button-text-secondary-color: #5e3f9e}.p-dialog[_ngcontent-%COMP%]   .p-dialog-header[_ngcontent-%COMP%]{display:flex;flex-direction:row;flex-wrap:wrap;align-content:flex-start;align-items:flex-start!important;text-transform:uppercase;padding:2rem}.p-dialog[_ngcontent-%COMP%]   .p-dialog-close-button[_ngcontent-%COMP%]{background-color:transparent;color:#5e3f9e;font-weight:800;border:none;width:1rem;height:1rem;cursor:pointer;transform-origin:center center}.p-dialog[_ngcontent-%COMP%]   .p-dialog-close-button[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%]{display:block;transform-origin:center center}.p-dialog[_ngcontent-%COMP%]   .p-dialog-close-button[_ngcontent-%COMP%]:hover{animation:_ngcontent-%COMP%_spin-rainbow .4s ease-in-out,_ngcontent-%COMP%_rainbow-icon .4s linear normal}.p-dialog[_ngcontent-%COMP%]   .p-dialog-maximize-button[_ngcontent-%COMP%]:hover{animation:_ngcontent-%COMP%_rainbow-icon .4s linear normal,_ngcontent-%COMP%_grow-icon .4s ease-in-out}.p-dialog[_ngcontent-%COMP%]   .p-dialog-header-actions[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.5rem}@keyframes _ngcontent-%COMP%_spin-rainbow{0%{transform:rotate(0)}to{transform:rotate(360deg)}}@keyframes _ngcontent-%COMP%_grow-icon{0%{transform:scale(1)}50%{transform:scale(1.2)}to{transform:scale(1)}}@keyframes _ngcontent-%COMP%_rainbow-icon{0%{filter:hue-rotate(0deg) saturate(3)}to{filter:hue-rotate(360deg) saturate(3)}}.p-dialog[_ngcontent-%COMP%]   .p-dialog-content[_ngcontent-%COMP%]{padding:1rem 2rem}.p-dialog[_ngcontent-%COMP%]   .p-dialog-footer[_ngcontent-%COMP%]{padding:2rem;display:flex;flex-direction:row;flex-wrap:wrap;justify-content:flex-end}*[_ngcontent-%COMP%]{margin:0;padding:0;box-sizing:border-box}html[_ngcontent-%COMP%]{font-family:Lexend,sans-serif;font-weight:300;font-size:16px;margin:unset;padding:unset;box-sizing:border-box;color:#070f13}html[_ngcontent-%COMP%]   section[_ngcontent-%COMP%]{margin-bottom:2rem!important}html[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{color:unset;text-decoration:underline;text-underline-offset:.2rem;text-decoration-thickness:.05rem}html[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover{text-decoration-thickness:.1rem}html[_ngcontent-%COMP%]   em[_ngcontent-%COMP%]{color:#5e3f9e;font-style:normal}html[_ngcontent-%COMP%]   em[_ngcontent-%COMP%]:hover{color:#4a3080}html[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{font-weight:600;color:#5e3f9e}html[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]{font-size:.8rem;font-weight:600;color:#5e3f9e}html[_ngcontent-%COMP%]   .colored[_ngcontent-%COMP%]{color:#5e3f9e}html[_ngcontent-%COMP%]   .secondary[_ngcontent-%COMP%]{color:#d65db1}html[_ngcontent-%COMP%]   .secondary-decorative[_ngcontent-%COMP%]{color:#ff9671}html[_ngcontent-%COMP%]   .italic[_ngcontent-%COMP%]{font-style:italic}html[_ngcontent-%COMP%]   .small[_ngcontent-%COMP%]{font-size:.8rem}@media screen and (min-width: 1600px){html[_ngcontent-%COMP%]{font-size:1.2rem}}@media screen and (max-width: 1200px){html[_ngcontent-%COMP%]{font-size:1rem}}@media screen and (max-width: 1000px){html[_ngcontent-%COMP%]{font-size:.9rem}}@media screen and (max-width: 700px){html[_ngcontent-%COMP%]{font-size:.8rem}}@media screen and (max-width: 400px){html[_ngcontent-%COMP%]{font-size:.7rem}}section[_ngcontent-%COMP%]{display:flex;flex-direction:column;line-height:1.9rem}",
                ],
            });
        }
    }
    return e;
})();
var Cb = (() => {
    class e {
        constructor() {
            ((this.title = "myracodes-resume"), (this.version = z0));
        }
        static {
            this.ɵfac = function (r) {
                return new (r || e)();
            };
        }
        static {
            this.ɵcmp = R({
                type: e,
                selectors: [["app-root"]],
                standalone: !1,
                decls: 21,
                vars: 1,
                consts: [
                    ["role", "main"],
                    [1, "title"],
                    [1, "app-content"],
                    [1, "col", "col-1"],
                    [1, "col", "col-2"],
                    [1, "app-version"],
                    [1, "footer-content"],
                ],
                template: function (r, i) {
                    (r & 1 &&
                        (D(0, "app-header"),
                        m(1, "main", 0)(2, "span", 1)(3, "h1"),
                        C(4, "D\xE9veloppeuse web front-end"),
                        g(),
                        m(5, "h2"),
                        C(
                            6,
                            "Bonus gestion de projets & p\xE2tisserie v\xE9g\xE9tale"
                        ),
                        g()(),
                        m(7, "div", 2)(8, "span", 3),
                        D(9, "app-professional-xp"),
                        g(),
                        m(10, "span", 4),
                        D(11, "app-education")(12, "app-skills")(
                            13,
                            "app-languages"
                        )(14, "app-activities"),
                        g()()(),
                        D(15, "app-rainbow-line"),
                        m(16, "footer")(17, "span", 5),
                        C(18),
                        g(),
                        m(19, "span", 6),
                        C(
                            20,
                            " Made with love, tea, Angular, and a podcast in the background. "
                        ),
                        g()()),
                        r & 2 && (v(18), ft(" version ", i.version, " ")));
                },
                dependencies: [q0, mb, _b, yb, vb, bb, Jl],
                styles: [
                    "app-dialog[_ngcontent-%COMP%]{display:flex;flex-direction:row;flex-wrap:wrap;min-width:fit-content;align-items:flex-start;align-content:flex-start;margin-top:.2rem}app-dialog[_ngcontent-%COMP%]   app-button[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{display:flex;flex-direction:row;flex-wrap:nowrap;width:fit-content;min-height:1rem;height:fit-content;font-weight:700;font-size:.6rem;margin-left:.5rem;margin-right:.5rem;margin-top:auto;margin-bottom:auto;padding:.15rem .55rem}.p-dialog.p-component[_ngcontent-%COMP%]{background-color:#fff;position:absolute;border:.5rem solid;border-radius:0;border-color:#ff9671 #ff6f91 #ff6f91 #ff9671;width:min(95vw,600px);background:#fffc;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);padding:1rem;--p-button-text-secondary-color: #5e3f9e}.p-dialog[_ngcontent-%COMP%]   .p-dialog-header[_ngcontent-%COMP%]{display:flex;flex-direction:row;flex-wrap:wrap;align-content:flex-start;align-items:flex-start!important;text-transform:uppercase;padding:2rem}.p-dialog[_ngcontent-%COMP%]   .p-dialog-close-button[_ngcontent-%COMP%]{background-color:transparent;color:#5e3f9e;font-weight:800;border:none;width:1rem;height:1rem;cursor:pointer;transform-origin:center center}.p-dialog[_ngcontent-%COMP%]   .p-dialog-close-button[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%]{display:block;transform-origin:center center}.p-dialog[_ngcontent-%COMP%]   .p-dialog-close-button[_ngcontent-%COMP%]:hover{animation:_ngcontent-%COMP%_spin-rainbow .4s ease-in-out,_ngcontent-%COMP%_rainbow-icon .4s linear normal}.p-dialog[_ngcontent-%COMP%]   .p-dialog-maximize-button[_ngcontent-%COMP%]:hover{animation:_ngcontent-%COMP%_rainbow-icon .4s linear normal,_ngcontent-%COMP%_grow-icon .4s ease-in-out}.p-dialog[_ngcontent-%COMP%]   .p-dialog-header-actions[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.5rem}@keyframes _ngcontent-%COMP%_spin-rainbow{0%{transform:rotate(0)}to{transform:rotate(360deg)}}@keyframes _ngcontent-%COMP%_grow-icon{0%{transform:scale(1)}50%{transform:scale(1.2)}to{transform:scale(1)}}@keyframes _ngcontent-%COMP%_rainbow-icon{0%{filter:hue-rotate(0deg) saturate(3)}to{filter:hue-rotate(360deg) saturate(3)}}.p-dialog[_ngcontent-%COMP%]   .p-dialog-content[_ngcontent-%COMP%]{padding:1rem 2rem}.p-dialog[_ngcontent-%COMP%]   .p-dialog-footer[_ngcontent-%COMP%]{padding:2rem;display:flex;flex-direction:row;flex-wrap:wrap;justify-content:flex-end}*[_ngcontent-%COMP%]{margin:0;padding:0;box-sizing:border-box}html[_ngcontent-%COMP%]{font-family:Lexend,sans-serif;font-weight:300;font-size:16px;margin:unset;padding:unset;box-sizing:border-box;color:#070f13}html[_ngcontent-%COMP%]   section[_ngcontent-%COMP%]{margin-bottom:2rem!important}html[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{color:unset;text-decoration:underline;text-underline-offset:.2rem;text-decoration-thickness:.05rem}html[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover{text-decoration-thickness:.1rem}html[_ngcontent-%COMP%]   em[_ngcontent-%COMP%]{color:#5e3f9e;font-style:normal}html[_ngcontent-%COMP%]   em[_ngcontent-%COMP%]:hover{color:#4a3080}html[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{font-weight:600;color:#5e3f9e}html[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]{font-size:.8rem;font-weight:600;color:#5e3f9e}html[_ngcontent-%COMP%]   .colored[_ngcontent-%COMP%]{color:#5e3f9e}html[_ngcontent-%COMP%]   .secondary[_ngcontent-%COMP%]{color:#d65db1}html[_ngcontent-%COMP%]   .secondary-decorative[_ngcontent-%COMP%]{color:#ff9671}html[_ngcontent-%COMP%]   .italic[_ngcontent-%COMP%]{font-style:italic}html[_ngcontent-%COMP%]   .small[_ngcontent-%COMP%]{font-size:.8rem}@media screen and (min-width: 1600px){html[_ngcontent-%COMP%]{font-size:1.2rem}}@media screen and (max-width: 1200px){html[_ngcontent-%COMP%]{font-size:1rem}}@media screen and (max-width: 1000px){html[_ngcontent-%COMP%]{font-size:.9rem}}@media screen and (max-width: 700px){html[_ngcontent-%COMP%]{font-size:.8rem}}@media screen and (max-width: 400px){html[_ngcontent-%COMP%]{font-size:.7rem}}[_nghost-%COMP%]{max-width:1200px}.title[_ngcontent-%COMP%]{width:100%;color:#5e3f9e;margin:auto}.title[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%], .title[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{max-width:600px;margin-left:auto;margin-right:auto;text-align:center}.title[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{margin-bottom:15px}.title[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{margin-bottom:50px;font-size:.8rem}.app-content[_ngcontent-%COMP%]{max-width:min(1800px,90vw);margin-left:auto;margin-right:auto;display:flex;flex-direction:row;flex-wrap:nowrap;gap:20px}.app-content[_ngcontent-%COMP%]   .col[_ngcontent-%COMP%]{display:flex;flex-direction:column;margin-left:auto;margin-right:auto}.app-content[_ngcontent-%COMP%]   .col-1[_ngcontent-%COMP%]{width:60%}.app-content[_ngcontent-%COMP%]   .col-2[_ngcontent-%COMP%]{width:30%}@media screen and (max-width: 700px){.app-content[_ngcontent-%COMP%]{display:flex;flex-direction:column}.app-content[_ngcontent-%COMP%]   .col-1[_ngcontent-%COMP%], .app-content[_ngcontent-%COMP%]   .col-2[_ngcontent-%COMP%]{width:95%;max-width:unset}}footer[_ngcontent-%COMP%]{width:100%;display:flex;flex-direction:row;justify-content:center;text-align:center;padding:1rem;font-size:.8rem}footer[_ngcontent-%COMP%]   .footer-content[_ngcontent-%COMP%]{flex-grow:1;margin:auto}footer[_ngcontent-%COMP%]   .app-version[_ngcontent-%COMP%]{font-size:.6rem;align-self:flex-start;margin:auto}@media screen and (max-width: 700px){footer[_ngcontent-%COMP%]{flex-direction:column-reverse;gap:1rem}}",
                ],
            });
        }
    }
    return e;
})();
function Eb(e) {
    return new S(3e3, !1);
}
function TN() {
    return new S(3100, !1);
}
function xN() {
    return new S(3101, !1);
}
function ON(e) {
    return new S(3001, !1);
}
function PN(e) {
    return new S(3003, !1);
}
function NN(e) {
    return new S(3004, !1);
}
function wb(e, n) {
    return new S(3005, !1);
}
function Db() {
    return new S(3006, !1);
}
function Mb() {
    return new S(3007, !1);
}
function Ib(e, n) {
    return new S(3008, !1);
}
function Tb(e) {
    return new S(3002, !1);
}
function xb(e, n, t, r, i) {
    return new S(3010, !1);
}
function Ob() {
    return new S(3011, !1);
}
function Pb() {
    return new S(3012, !1);
}
function Nb() {
    return new S(3200, !1);
}
function Ab() {
    return new S(3202, !1);
}
function Rb() {
    return new S(3013, !1);
}
function kb(e) {
    return new S(3014, !1);
}
function Lb(e) {
    return new S(3015, !1);
}
function Fb(e) {
    return new S(3016, !1);
}
function $b(e, n) {
    return new S(3404, !1);
}
function AN(e) {
    return new S(3502, !1);
}
function Vb(e) {
    return new S(3503, !1);
}
function jb() {
    return new S(3300, !1);
}
function Bb(e) {
    return new S(3504, !1);
}
function Ub(e) {
    return new S(3301, !1);
}
function Hb(e, n) {
    return new S(3302, !1);
}
function zb(e) {
    return new S(3303, !1);
}
function Wb(e, n) {
    return new S(3400, !1);
}
function qb(e) {
    return new S(3401, !1);
}
function Gb(e) {
    return new S(3402, !1);
}
function Yb(e, n) {
    return new S(3505, !1);
}
function Yn(e) {
    switch (e.length) {
        case 0:
            return new En();
        case 1:
            return e[0];
        default:
            return new Wr(e);
    }
}
function Kp(e, n, t = new Map(), r = new Map()) {
    let i = [],
        o = [],
        s = -1,
        a = null;
    if (
        (n.forEach((l) => {
            let c = l.get("offset"),
                u = c == s,
                d = (u && a) || new Map();
            (l.forEach((p, f) => {
                let h = f,
                    _ = p;
                if (f !== "offset")
                    switch (((h = e.normalizePropertyName(h, i)), _)) {
                        case oo:
                            _ = t.get(f);
                            break;
                        case jt:
                            _ = r.get(f);
                            break;
                        default:
                            _ = e.normalizeStyleValue(f, h, _, i);
                            break;
                    }
                d.set(h, _);
            }),
                u || o.push(d),
                (a = d),
                (s = c));
        }),
        i.length)
    )
        throw AN(i);
    return o;
}
function sc(e, n, t, r) {
    switch (n) {
        case "start":
            e.onStart(() => r(t && qp(t, "start", e)));
            break;
        case "done":
            e.onDone(() => r(t && qp(t, "done", e)));
            break;
        case "destroy":
            e.onDestroy(() => r(t && qp(t, "destroy", e)));
            break;
    }
}
function qp(e, n, t) {
    let r = t.totalTime,
        i = !!t.disabled,
        o = ac(
            e.element,
            e.triggerName,
            e.fromState,
            e.toState,
            n || e.phaseName,
            r ?? e.totalTime,
            i
        ),
        s = e._data;
    return (s != null && (o._data = s), o);
}
function ac(e, n, t, r, i = "", o = 0, s) {
    return {
        element: e,
        triggerName: n,
        fromState: t,
        toState: r,
        phaseName: i,
        totalTime: o,
        disabled: !!s,
    };
}
function ht(e, n, t) {
    let r = e.get(n);
    return (r || e.set(n, (r = t)), r);
}
function Qp(e) {
    let n = e.indexOf(":"),
        t = e.substring(1, n),
        r = e.slice(n + 1);
    return [t, r];
}
var RN = typeof document > "u" ? null : document.documentElement;
function lc(e) {
    let n = e.parentNode || e.host || null;
    return n === RN ? null : n;
}
function kN(e) {
    return e.substring(1, 6) == "ebkit";
}
var Gr = null,
    Sb = !1;
function Kb(e) {
    Gr ||
        ((Gr = LN() || {}),
        (Sb = Gr.style ? "WebkitAppearance" in Gr.style : !1));
    let n = !0;
    return (
        Gr.style &&
            !kN(e) &&
            ((n = e in Gr.style),
            !n &&
                Sb &&
                (n =
                    "Webkit" + e.charAt(0).toUpperCase() + e.slice(1) in
                    Gr.style)),
        n
    );
}
function LN() {
    return typeof document < "u" ? document.body : null;
}
function Zp(e, n) {
    for (; n; ) {
        if (n === e) return !0;
        n = lc(n);
    }
    return !1;
}
function Xp(e, n, t) {
    if (t) return Array.from(e.querySelectorAll(n));
    let r = e.querySelector(n);
    return r ? [r] : [];
}
var FN = 1e3,
    Jp = "{{",
    $N = "}}",
    eh = "ng-enter",
    cc = "ng-leave",
    Ps = "ng-trigger",
    Ns = ".ng-trigger",
    th = "ng-animating",
    uc = ".ng-animating";
function Sn(e) {
    if (typeof e == "number") return e;
    let n = e.match(/^(-?[\.\d]+)(m?s)/);
    return !n || n.length < 2 ? 0 : Gp(parseFloat(n[1]), n[2]);
}
function Gp(e, n) {
    switch (n) {
        case "s":
            return e * FN;
        default:
            return e;
    }
}
function As(e, n, t) {
    return e.hasOwnProperty("duration") ? e : VN(e, n, t);
}
function VN(e, n, t) {
    let r =
            /^(-?[\.\d]+)(m?s)(?:\s+(-?[\.\d]+)(m?s))?(?:\s+([-a-z]+(?:\(.+?\))?))?$/i,
        i,
        o = 0,
        s = "";
    if (typeof e == "string") {
        let a = e.match(r);
        if (a === null)
            return (n.push(Eb(e)), { duration: 0, delay: 0, easing: "" });
        i = Gp(parseFloat(a[1]), a[2]);
        let l = a[3];
        l != null && (o = Gp(parseFloat(l), a[4]));
        let c = a[5];
        c && (s = c);
    } else i = e;
    if (!t) {
        let a = !1,
            l = n.length;
        (i < 0 && (n.push(TN()), (a = !0)),
            o < 0 && (n.push(xN()), (a = !0)),
            a && n.splice(l, 0, Eb(e)));
    }
    return { duration: i, delay: o, easing: s };
}
function Qb(e) {
    return e.length
        ? e[0] instanceof Map
            ? e
            : e.map((n) => new Map(Object.entries(n)))
        : [];
}
function tn(e, n, t) {
    n.forEach((r, i) => {
        let o = dc(i);
        (t && !t.has(i) && t.set(i, e.style[o]), (e.style[o] = r));
    });
}
function dr(e, n) {
    n.forEach((t, r) => {
        let i = dc(r);
        e.style[i] = "";
    });
}
function so(e) {
    return Array.isArray(e) ? (e.length == 1 ? e[0] : Y0(e)) : e;
}
function Zb(e, n, t) {
    let r = n.params || {},
        i = nh(e);
    i.length &&
        i.forEach((o) => {
            r.hasOwnProperty(o) || t.push(ON(o));
        });
}
var Yp = new RegExp(`${Jp}\\s*(.+?)\\s*${$N}`, "g");
function nh(e) {
    let n = [];
    if (typeof e == "string") {
        let t;
        for (; (t = Yp.exec(e)); ) n.push(t[1]);
        Yp.lastIndex = 0;
    }
    return n;
}
function ao(e, n, t) {
    let r = `${e}`,
        i = r.replace(Yp, (o, s) => {
            let a = n[s];
            return (a == null && (t.push(PN(s)), (a = "")), a.toString());
        });
    return i == r ? e : i;
}
var jN = /-+([a-z0-9])/g;
function dc(e) {
    return e.replace(jN, (...n) => n[1].toUpperCase());
}
function Xb(e, n) {
    return e === 0 || n === 0;
}
function Jb(e, n, t) {
    if (t.size && n.length) {
        let r = n[0],
            i = [];
        if (
            (t.forEach((o, s) => {
                (r.has(s) || i.push(s), r.set(s, o));
            }),
            i.length)
        )
            for (let o = 1; o < n.length; o++) {
                let s = n[o];
                i.forEach((a) => s.set(a, fc(e, a)));
            }
    }
    return n;
}
function gt(e, n, t) {
    switch (n.type) {
        case F.Trigger:
            return e.visitTrigger(n, t);
        case F.State:
            return e.visitState(n, t);
        case F.Transition:
            return e.visitTransition(n, t);
        case F.Sequence:
            return e.visitSequence(n, t);
        case F.Group:
            return e.visitGroup(n, t);
        case F.Animate:
            return e.visitAnimate(n, t);
        case F.Keyframes:
            return e.visitKeyframes(n, t);
        case F.Style:
            return e.visitStyle(n, t);
        case F.Reference:
            return e.visitReference(n, t);
        case F.AnimateChild:
            return e.visitAnimateChild(n, t);
        case F.AnimateRef:
            return e.visitAnimateRef(n, t);
        case F.Query:
            return e.visitQuery(n, t);
        case F.Stagger:
            return e.visitStagger(n, t);
        default:
            throw NN(n.type);
    }
}
function fc(e, n) {
    return window.getComputedStyle(e)[n];
}
var vh = (() => {
        class e {
            validateStyleProperty(t) {
                return Kb(t);
            }
            containsElement(t, r) {
                return Zp(t, r);
            }
            getParentElement(t) {
                return lc(t);
            }
            query(t, r, i) {
                return Xp(t, r, i);
            }
            computeStyle(t, r, i) {
                return i || "";
            }
            animate(t, r, i, o, s, a = [], l) {
                return new En(i, o);
            }
            static ɵfac = function (r) {
                return new (r || e)();
            };
            static ɵprov = w({ token: e, factory: e.ɵfac });
        }
        return e;
    })(),
    Kr = class {
        static NOOP = new vh();
    },
    Qr = class {};
var BN = new Set([
        "width",
        "height",
        "minWidth",
        "minHeight",
        "maxWidth",
        "maxHeight",
        "left",
        "top",
        "bottom",
        "right",
        "fontSize",
        "outlineWidth",
        "outlineOffset",
        "paddingTop",
        "paddingLeft",
        "paddingBottom",
        "paddingRight",
        "marginTop",
        "marginLeft",
        "marginBottom",
        "marginRight",
        "borderRadius",
        "borderWidth",
        "borderTopWidth",
        "borderLeftWidth",
        "borderRightWidth",
        "borderBottomWidth",
        "textIndent",
        "perspective",
    ]),
    _c = class extends Qr {
        normalizePropertyName(n, t) {
            return dc(n);
        }
        normalizeStyleValue(n, t, r, i) {
            let o = "",
                s = r.toString().trim();
            if (BN.has(t) && r !== 0 && r !== "0")
                if (typeof r == "number") o = "px";
                else {
                    let a = r.match(/^[+-]?[\d\.]+([a-z]*)$/);
                    a && a[1].length == 0 && i.push(wb(n, r));
                }
            return s + o;
        }
    };
var yc = "*";
function UN(e, n) {
    let t = [];
    return (
        typeof e == "string"
            ? e.split(/\s*,\s*/).forEach((r) => HN(r, t, n))
            : t.push(e),
        t
    );
}
function HN(e, n, t) {
    if (e[0] == ":") {
        let l = zN(e, t);
        if (typeof l == "function") {
            n.push(l);
            return;
        }
        e = l;
    }
    let r = e.match(/^(\*|[-\w]+)\s*(<?[=-]>)\s*(\*|[-\w]+)$/);
    if (r == null || r.length < 4) return (t.push(Lb(e)), n);
    let i = r[1],
        o = r[2],
        s = r[3];
    n.push(eC(i, s));
    let a = i == yc && s == yc;
    o[0] == "<" && !a && n.push(eC(s, i));
}
function zN(e, n) {
    switch (e) {
        case ":enter":
            return "void => *";
        case ":leave":
            return "* => void";
        case ":increment":
            return (t, r) => parseFloat(r) > parseFloat(t);
        case ":decrement":
            return (t, r) => parseFloat(r) < parseFloat(t);
        default:
            return (n.push(Fb(e)), "* => *");
    }
}
var pc = new Set(["true", "1"]),
    hc = new Set(["false", "0"]);
function eC(e, n) {
    let t = pc.has(e) || hc.has(e),
        r = pc.has(n) || hc.has(n);
    return (i, o) => {
        let s = e == yc || e == i,
            a = n == yc || n == o;
        return (
            !s && t && typeof i == "boolean" && (s = i ? pc.has(e) : hc.has(e)),
            !a && r && typeof o == "boolean" && (a = o ? pc.has(n) : hc.has(n)),
            s && a
        );
    };
}
var uC = ":self",
    WN = new RegExp(`s*${uC}s*,?`, "g");
function dC(e, n, t, r) {
    return new lh(e).build(n, t, r);
}
var tC = "",
    lh = class {
        _driver;
        constructor(n) {
            this._driver = n;
        }
        build(n, t, r) {
            let i = new ch(t);
            return (this._resetContextStyleTimingState(i), gt(this, so(n), i));
        }
        _resetContextStyleTimingState(n) {
            ((n.currentQuerySelector = tC),
                (n.collectedStyles = new Map()),
                n.collectedStyles.set(tC, new Map()),
                (n.currentTime = 0));
        }
        visitTrigger(n, t) {
            let r = (t.queryCount = 0),
                i = (t.depCount = 0),
                o = [],
                s = [];
            return (
                n.name.charAt(0) == "@" && t.errors.push(Db()),
                n.definitions.forEach((a) => {
                    if (
                        (this._resetContextStyleTimingState(t),
                        a.type == F.State)
                    ) {
                        let l = a,
                            c = l.name;
                        (c
                            .toString()
                            .split(/\s*,\s*/)
                            .forEach((u) => {
                                ((l.name = u), o.push(this.visitState(l, t)));
                            }),
                            (l.name = c));
                    } else if (a.type == F.Transition) {
                        let l = this.visitTransition(a, t);
                        ((r += l.queryCount), (i += l.depCount), s.push(l));
                    } else t.errors.push(Mb());
                }),
                {
                    type: F.Trigger,
                    name: n.name,
                    states: o,
                    transitions: s,
                    queryCount: r,
                    depCount: i,
                    options: null,
                }
            );
        }
        visitState(n, t) {
            let r = this.visitStyle(n.styles, t),
                i = (n.options && n.options.params) || null;
            if (r.containsDynamicStyles) {
                let o = new Set(),
                    s = i || {};
                (r.styles.forEach((a) => {
                    a instanceof Map &&
                        a.forEach((l) => {
                            nh(l).forEach((c) => {
                                s.hasOwnProperty(c) || o.add(c);
                            });
                        });
                }),
                    o.size && t.errors.push(Ib(n.name, [...o.values()])));
            }
            return {
                type: F.State,
                name: n.name,
                style: r,
                options: i ? { params: i } : null,
            };
        }
        visitTransition(n, t) {
            ((t.queryCount = 0), (t.depCount = 0));
            let r = gt(this, so(n.animation), t),
                i = UN(n.expr, t.errors);
            return {
                type: F.Transition,
                matchers: i,
                animation: r,
                queryCount: t.queryCount,
                depCount: t.depCount,
                options: Yr(n.options),
            };
        }
        visitSequence(n, t) {
            return {
                type: F.Sequence,
                steps: n.steps.map((r) => gt(this, r, t)),
                options: Yr(n.options),
            };
        }
        visitGroup(n, t) {
            let r = t.currentTime,
                i = 0,
                o = n.steps.map((s) => {
                    t.currentTime = r;
                    let a = gt(this, s, t);
                    return ((i = Math.max(i, t.currentTime)), a);
                });
            return (
                (t.currentTime = i),
                { type: F.Group, steps: o, options: Yr(n.options) }
            );
        }
        visitAnimate(n, t) {
            let r = KN(n.timings, t.errors);
            t.currentAnimateTimings = r;
            let i,
                o = n.styles ? n.styles : qr({});
            if (o.type == F.Keyframes) i = this.visitKeyframes(o, t);
            else {
                let s = n.styles,
                    a = !1;
                if (!s) {
                    a = !0;
                    let c = {};
                    (r.easing && (c.easing = r.easing), (s = qr(c)));
                }
                t.currentTime += r.duration + r.delay;
                let l = this.visitStyle(s, t);
                ((l.isEmptyStep = a), (i = l));
            }
            return (
                (t.currentAnimateTimings = null),
                { type: F.Animate, timings: r, style: i, options: null }
            );
        }
        visitStyle(n, t) {
            let r = this._makeStyleAst(n, t);
            return (this._validateStyleAst(r, t), r);
        }
        _makeStyleAst(n, t) {
            let r = [],
                i = Array.isArray(n.styles) ? n.styles : [n.styles];
            for (let a of i)
                typeof a == "string"
                    ? a === jt
                        ? r.push(a)
                        : t.errors.push(Tb(a))
                    : r.push(new Map(Object.entries(a)));
            let o = !1,
                s = null;
            return (
                r.forEach((a) => {
                    if (
                        a instanceof Map &&
                        (a.has("easing") &&
                            ((s = a.get("easing")), a.delete("easing")),
                        !o)
                    ) {
                        for (let l of a.values())
                            if (l.toString().indexOf(Jp) >= 0) {
                                o = !0;
                                break;
                            }
                    }
                }),
                {
                    type: F.Style,
                    styles: r,
                    easing: s,
                    offset: n.offset,
                    containsDynamicStyles: o,
                    options: null,
                }
            );
        }
        _validateStyleAst(n, t) {
            let r = t.currentAnimateTimings,
                i = t.currentTime,
                o = t.currentTime;
            (r && o > 0 && (o -= r.duration + r.delay),
                n.styles.forEach((s) => {
                    typeof s != "string" &&
                        s.forEach((a, l) => {
                            let c = t.collectedStyles.get(
                                    t.currentQuerySelector
                                ),
                                u = c.get(l),
                                d = !0;
                            (u &&
                                (o != i &&
                                    o >= u.startTime &&
                                    i <= u.endTime &&
                                    (t.errors.push(
                                        xb(l, u.startTime, u.endTime, o, i)
                                    ),
                                    (d = !1)),
                                (o = u.startTime)),
                                d && c.set(l, { startTime: o, endTime: i }),
                                t.options && Zb(a, t.options, t.errors));
                        });
                }));
        }
        visitKeyframes(n, t) {
            let r = { type: F.Keyframes, styles: [], options: null };
            if (!t.currentAnimateTimings) return (t.errors.push(Ob()), r);
            let i = 1,
                o = 0,
                s = [],
                a = !1,
                l = !1,
                c = 0,
                u = n.steps.map((I) => {
                    let j = this._makeStyleAst(I, t),
                        J = j.offset != null ? j.offset : YN(j.styles),
                        Q = 0;
                    return (
                        J != null && (o++, (Q = j.offset = J)),
                        (l = l || Q < 0 || Q > 1),
                        (a = a || Q < c),
                        (c = Q),
                        s.push(Q),
                        j
                    );
                });
            (l && t.errors.push(Pb()), a && t.errors.push(Nb()));
            let d = n.steps.length,
                p = 0;
            o > 0 && o < d ? t.errors.push(Ab()) : o == 0 && (p = i / (d - 1));
            let f = d - 1,
                h = t.currentTime,
                _ = t.currentAnimateTimings,
                M = _.duration;
            return (
                u.forEach((I, j) => {
                    let J = p > 0 ? (j == f ? 1 : p * j) : s[j],
                        Q = J * M;
                    ((t.currentTime = h + _.delay + Q),
                        (_.duration = Q),
                        this._validateStyleAst(I, t),
                        (I.offset = J),
                        r.styles.push(I));
                }),
                r
            );
        }
        visitReference(n, t) {
            return {
                type: F.Reference,
                animation: gt(this, so(n.animation), t),
                options: Yr(n.options),
            };
        }
        visitAnimateChild(n, t) {
            return (
                t.depCount++,
                { type: F.AnimateChild, options: Yr(n.options) }
            );
        }
        visitAnimateRef(n, t) {
            return {
                type: F.AnimateRef,
                animation: this.visitReference(n.animation, t),
                options: Yr(n.options),
            };
        }
        visitQuery(n, t) {
            let r = t.currentQuerySelector,
                i = n.options || {};
            (t.queryCount++, (t.currentQuery = n));
            let [o, s] = qN(n.selector);
            ((t.currentQuerySelector = r.length ? r + " " + o : o),
                ht(t.collectedStyles, t.currentQuerySelector, new Map()));
            let a = gt(this, so(n.animation), t);
            return (
                (t.currentQuery = null),
                (t.currentQuerySelector = r),
                {
                    type: F.Query,
                    selector: o,
                    limit: i.limit || 0,
                    optional: !!i.optional,
                    includeSelf: s,
                    animation: a,
                    originalSelector: n.selector,
                    options: Yr(n.options),
                }
            );
        }
        visitStagger(n, t) {
            t.currentQuery || t.errors.push(Rb());
            let r =
                n.timings === "full"
                    ? { duration: 0, delay: 0, easing: "full" }
                    : As(n.timings, t.errors, !0);
            return {
                type: F.Stagger,
                animation: gt(this, so(n.animation), t),
                timings: r,
                options: null,
            };
        }
    };
function qN(e) {
    let n = !!e.split(/\s*,\s*/).find((t) => t == uC);
    return (
        n && (e = e.replace(WN, "")),
        (e = e
            .replace(/@\*/g, Ns)
            .replace(/@\w+/g, (t) => Ns + "-" + t.slice(1))
            .replace(/:animating/g, uc)),
        [e, n]
    );
}
function GN(e) {
    return e ? E({}, e) : null;
}
var ch = class {
    errors;
    queryCount = 0;
    depCount = 0;
    currentTransition = null;
    currentQuery = null;
    currentQuerySelector = null;
    currentAnimateTimings = null;
    currentTime = 0;
    collectedStyles = new Map();
    options = null;
    unsupportedCSSPropertiesFound = new Set();
    constructor(n) {
        this.errors = n;
    }
};
function YN(e) {
    if (typeof e == "string") return null;
    let n = null;
    if (Array.isArray(e))
        e.forEach((t) => {
            if (t instanceof Map && t.has("offset")) {
                let r = t;
                ((n = parseFloat(r.get("offset"))), r.delete("offset"));
            }
        });
    else if (e instanceof Map && e.has("offset")) {
        let t = e;
        ((n = parseFloat(t.get("offset"))), t.delete("offset"));
    }
    return n;
}
function KN(e, n) {
    if (e.hasOwnProperty("duration")) return e;
    if (typeof e == "number") {
        let o = As(e, n).duration;
        return rh(o, 0, "");
    }
    let t = e;
    if (t.split(/\s+/).some((o) => o.charAt(0) == "{" && o.charAt(1) == "{")) {
        let o = rh(0, 0, "");
        return ((o.dynamic = !0), (o.strValue = t), o);
    }
    let i = As(t, n);
    return rh(i.duration, i.delay, i.easing);
}
function Yr(e) {
    return (
        e ? ((e = E({}, e)), e.params && (e.params = GN(e.params))) : (e = {}),
        e
    );
}
function rh(e, n, t) {
    return { duration: e, delay: n, easing: t };
}
function bh(e, n, t, r, i, o, s = null, a = !1) {
    return {
        type: 1,
        element: e,
        keyframes: n,
        preStyleProps: t,
        postStyleProps: r,
        duration: i,
        delay: o,
        totalTime: i + o,
        easing: s,
        subTimeline: a,
    };
}
var ks = class {
        _map = new Map();
        get(n) {
            return this._map.get(n) || [];
        }
        append(n, t) {
            let r = this._map.get(n);
            (r || this._map.set(n, (r = [])), r.push(...t));
        }
        has(n) {
            return this._map.has(n);
        }
        clear() {
            this._map.clear();
        }
    },
    QN = 1,
    ZN = ":enter",
    XN = new RegExp(ZN, "g"),
    JN = ":leave",
    eA = new RegExp(JN, "g");
function fC(e, n, t, r, i, o = new Map(), s = new Map(), a, l, c = []) {
    return new uh().buildKeyframes(e, n, t, r, i, o, s, a, l, c);
}
var uh = class {
        buildKeyframes(n, t, r, i, o, s, a, l, c, u = []) {
            c = c || new ks();
            let d = new dh(n, t, c, i, o, u, []);
            d.options = l;
            let p = l.delay ? Sn(l.delay) : 0;
            (d.currentTimeline.delayNextStep(p),
                d.currentTimeline.setStyles([s], null, d.errors, l),
                gt(this, r, d));
            let f = d.timelines.filter((h) => h.containsAnimation());
            if (f.length && a.size) {
                let h;
                for (let _ = f.length - 1; _ >= 0; _--) {
                    let M = f[_];
                    if (M.element === t) {
                        h = M;
                        break;
                    }
                }
                h &&
                    !h.allowOnlyTimelineStyles() &&
                    h.setStyles([a], null, d.errors, l);
            }
            return f.length
                ? f.map((h) => h.buildKeyframes())
                : [bh(t, [], [], [], 0, p, "", !1)];
        }
        visitTrigger(n, t) {}
        visitState(n, t) {}
        visitTransition(n, t) {}
        visitAnimateChild(n, t) {
            let r = t.subInstructions.get(t.element);
            if (r) {
                let i = t.createSubContext(n.options),
                    o = t.currentTimeline.currentTime,
                    s = this._visitSubInstructions(r, i, i.options);
                o != s && t.transformIntoNewTimeline(s);
            }
            t.previousNode = n;
        }
        visitAnimateRef(n, t) {
            let r = t.createSubContext(n.options);
            (r.transformIntoNewTimeline(),
                this._applyAnimationRefDelays(
                    [n.options, n.animation.options],
                    t,
                    r
                ),
                this.visitReference(n.animation, r),
                t.transformIntoNewTimeline(r.currentTimeline.currentTime),
                (t.previousNode = n));
        }
        _applyAnimationRefDelays(n, t, r) {
            for (let i of n) {
                let o = i?.delay;
                if (o) {
                    let s =
                        typeof o == "number"
                            ? o
                            : Sn(ao(o, i?.params ?? {}, t.errors));
                    r.delayNextStep(s);
                }
            }
        }
        _visitSubInstructions(n, t, r) {
            let o = t.currentTimeline.currentTime,
                s = r.duration != null ? Sn(r.duration) : null,
                a = r.delay != null ? Sn(r.delay) : null;
            return (
                s !== 0 &&
                    n.forEach((l) => {
                        let c = t.appendInstructionToTimeline(l, s, a);
                        o = Math.max(o, c.duration + c.delay);
                    }),
                o
            );
        }
        visitReference(n, t) {
            (t.updateOptions(n.options, !0),
                gt(this, n.animation, t),
                (t.previousNode = n));
        }
        visitSequence(n, t) {
            let r = t.subContextCount,
                i = t,
                o = n.options;
            if (
                o &&
                (o.params || o.delay) &&
                ((i = t.createSubContext(o)),
                i.transformIntoNewTimeline(),
                o.delay != null)
            ) {
                i.previousNode.type == F.Style &&
                    (i.currentTimeline.snapshotCurrentStyles(),
                    (i.previousNode = vc));
                let s = Sn(o.delay);
                i.delayNextStep(s);
            }
            (n.steps.length &&
                (n.steps.forEach((s) => gt(this, s, i)),
                i.currentTimeline.applyStylesToKeyframe(),
                i.subContextCount > r && i.transformIntoNewTimeline()),
                (t.previousNode = n));
        }
        visitGroup(n, t) {
            let r = [],
                i = t.currentTimeline.currentTime,
                o = n.options && n.options.delay ? Sn(n.options.delay) : 0;
            (n.steps.forEach((s) => {
                let a = t.createSubContext(n.options);
                (o && a.delayNextStep(o),
                    gt(this, s, a),
                    (i = Math.max(i, a.currentTimeline.currentTime)),
                    r.push(a.currentTimeline));
            }),
                r.forEach((s) =>
                    t.currentTimeline.mergeTimelineCollectedStyles(s)
                ),
                t.transformIntoNewTimeline(i),
                (t.previousNode = n));
        }
        _visitTiming(n, t) {
            if (n.dynamic) {
                let r = n.strValue,
                    i = t.params ? ao(r, t.params, t.errors) : r;
                return As(i, t.errors);
            } else
                return {
                    duration: n.duration,
                    delay: n.delay,
                    easing: n.easing,
                };
        }
        visitAnimate(n, t) {
            let r = (t.currentAnimateTimings = this._visitTiming(n.timings, t)),
                i = t.currentTimeline;
            r.delay && (t.incrementTime(r.delay), i.snapshotCurrentStyles());
            let o = n.style;
            (o.type == F.Keyframes
                ? this.visitKeyframes(o, t)
                : (t.incrementTime(r.duration),
                  this.visitStyle(o, t),
                  i.applyStylesToKeyframe()),
                (t.currentAnimateTimings = null),
                (t.previousNode = n));
        }
        visitStyle(n, t) {
            let r = t.currentTimeline,
                i = t.currentAnimateTimings;
            !i && r.hasCurrentStyleProperties() && r.forwardFrame();
            let o = (i && i.easing) || n.easing;
            (n.isEmptyStep
                ? r.applyEmptyStep(o)
                : r.setStyles(n.styles, o, t.errors, t.options),
                (t.previousNode = n));
        }
        visitKeyframes(n, t) {
            let r = t.currentAnimateTimings,
                i = t.currentTimeline.duration,
                o = r.duration,
                a = t.createSubContext().currentTimeline;
            ((a.easing = r.easing),
                n.styles.forEach((l) => {
                    let c = l.offset || 0;
                    (a.forwardTime(c * o),
                        a.setStyles(l.styles, l.easing, t.errors, t.options),
                        a.applyStylesToKeyframe());
                }),
                t.currentTimeline.mergeTimelineCollectedStyles(a),
                t.transformIntoNewTimeline(i + o),
                (t.previousNode = n));
        }
        visitQuery(n, t) {
            let r = t.currentTimeline.currentTime,
                i = n.options || {},
                o = i.delay ? Sn(i.delay) : 0;
            o &&
                (t.previousNode.type === F.Style ||
                    (r == 0 &&
                        t.currentTimeline.hasCurrentStyleProperties())) &&
                (t.currentTimeline.snapshotCurrentStyles(),
                (t.previousNode = vc));
            let s = r,
                a = t.invokeQuery(
                    n.selector,
                    n.originalSelector,
                    n.limit,
                    n.includeSelf,
                    !!i.optional,
                    t.errors
                );
            t.currentQueryTotal = a.length;
            let l = null;
            (a.forEach((c, u) => {
                t.currentQueryIndex = u;
                let d = t.createSubContext(n.options, c);
                (o && d.delayNextStep(o),
                    c === t.element && (l = d.currentTimeline),
                    gt(this, n.animation, d),
                    d.currentTimeline.applyStylesToKeyframe());
                let p = d.currentTimeline.currentTime;
                s = Math.max(s, p);
            }),
                (t.currentQueryIndex = 0),
                (t.currentQueryTotal = 0),
                t.transformIntoNewTimeline(s),
                l &&
                    (t.currentTimeline.mergeTimelineCollectedStyles(l),
                    t.currentTimeline.snapshotCurrentStyles()),
                (t.previousNode = n));
        }
        visitStagger(n, t) {
            let r = t.parentContext,
                i = t.currentTimeline,
                o = n.timings,
                s = Math.abs(o.duration),
                a = s * (t.currentQueryTotal - 1),
                l = s * t.currentQueryIndex;
            switch (o.duration < 0 ? "reverse" : o.easing) {
                case "reverse":
                    l = a - l;
                    break;
                case "full":
                    l = r.currentStaggerTime;
                    break;
            }
            let u = t.currentTimeline;
            l && u.delayNextStep(l);
            let d = u.currentTime;
            (gt(this, n.animation, t),
                (t.previousNode = n),
                (r.currentStaggerTime =
                    i.currentTime -
                    d +
                    (i.startTime - r.currentTimeline.startTime)));
        }
    },
    vc = {},
    dh = class e {
        _driver;
        element;
        subInstructions;
        _enterClassName;
        _leaveClassName;
        errors;
        timelines;
        parentContext = null;
        currentTimeline;
        currentAnimateTimings = null;
        previousNode = vc;
        subContextCount = 0;
        options = {};
        currentQueryIndex = 0;
        currentQueryTotal = 0;
        currentStaggerTime = 0;
        constructor(n, t, r, i, o, s, a, l) {
            ((this._driver = n),
                (this.element = t),
                (this.subInstructions = r),
                (this._enterClassName = i),
                (this._leaveClassName = o),
                (this.errors = s),
                (this.timelines = a),
                (this.currentTimeline = l || new bc(this._driver, t, 0)),
                a.push(this.currentTimeline));
        }
        get params() {
            return this.options.params;
        }
        updateOptions(n, t) {
            if (!n) return;
            let r = n,
                i = this.options;
            (r.duration != null && (i.duration = Sn(r.duration)),
                r.delay != null && (i.delay = Sn(r.delay)));
            let o = r.params;
            if (o) {
                let s = i.params;
                (s || (s = this.options.params = {}),
                    Object.keys(o).forEach((a) => {
                        (!t || !s.hasOwnProperty(a)) &&
                            (s[a] = ao(o[a], s, this.errors));
                    }));
            }
        }
        _copyOptions() {
            let n = {};
            if (this.options) {
                let t = this.options.params;
                if (t) {
                    let r = (n.params = {});
                    Object.keys(t).forEach((i) => {
                        r[i] = t[i];
                    });
                }
            }
            return n;
        }
        createSubContext(n = null, t, r) {
            let i = t || this.element,
                o = new e(
                    this._driver,
                    i,
                    this.subInstructions,
                    this._enterClassName,
                    this._leaveClassName,
                    this.errors,
                    this.timelines,
                    this.currentTimeline.fork(i, r || 0)
                );
            return (
                (o.previousNode = this.previousNode),
                (o.currentAnimateTimings = this.currentAnimateTimings),
                (o.options = this._copyOptions()),
                o.updateOptions(n),
                (o.currentQueryIndex = this.currentQueryIndex),
                (o.currentQueryTotal = this.currentQueryTotal),
                (o.parentContext = this),
                this.subContextCount++,
                o
            );
        }
        transformIntoNewTimeline(n) {
            return (
                (this.previousNode = vc),
                (this.currentTimeline = this.currentTimeline.fork(
                    this.element,
                    n
                )),
                this.timelines.push(this.currentTimeline),
                this.currentTimeline
            );
        }
        appendInstructionToTimeline(n, t, r) {
            let i = {
                    duration: t ?? n.duration,
                    delay:
                        this.currentTimeline.currentTime + (r ?? 0) + n.delay,
                    easing: "",
                },
                o = new fh(
                    this._driver,
                    n.element,
                    n.keyframes,
                    n.preStyleProps,
                    n.postStyleProps,
                    i,
                    n.stretchStartingKeyframe
                );
            return (this.timelines.push(o), i);
        }
        incrementTime(n) {
            this.currentTimeline.forwardTime(this.currentTimeline.duration + n);
        }
        delayNextStep(n) {
            n > 0 && this.currentTimeline.delayNextStep(n);
        }
        invokeQuery(n, t, r, i, o, s) {
            let a = [];
            if ((i && a.push(this.element), n.length > 0)) {
                ((n = n.replace(XN, "." + this._enterClassName)),
                    (n = n.replace(eA, "." + this._leaveClassName)));
                let l = r != 1,
                    c = this._driver.query(this.element, n, l);
                (r !== 0 &&
                    (c =
                        r < 0
                            ? c.slice(c.length + r, c.length)
                            : c.slice(0, r)),
                    a.push(...c));
            }
            return (!o && a.length == 0 && s.push(kb(t)), a);
        }
    },
    bc = class e {
        _driver;
        element;
        startTime;
        _elementTimelineStylesLookup;
        duration = 0;
        easing = null;
        _previousKeyframe = new Map();
        _currentKeyframe = new Map();
        _keyframes = new Map();
        _styleSummary = new Map();
        _localTimelineStyles = new Map();
        _globalTimelineStyles;
        _pendingStyles = new Map();
        _backFill = new Map();
        _currentEmptyStepKeyframe = null;
        constructor(n, t, r, i) {
            ((this._driver = n),
                (this.element = t),
                (this.startTime = r),
                (this._elementTimelineStylesLookup = i),
                this._elementTimelineStylesLookup ||
                    (this._elementTimelineStylesLookup = new Map()),
                (this._globalTimelineStyles =
                    this._elementTimelineStylesLookup.get(t)),
                this._globalTimelineStyles ||
                    ((this._globalTimelineStyles = this._localTimelineStyles),
                    this._elementTimelineStylesLookup.set(
                        t,
                        this._localTimelineStyles
                    )),
                this._loadKeyframe());
        }
        containsAnimation() {
            switch (this._keyframes.size) {
                case 0:
                    return !1;
                case 1:
                    return this.hasCurrentStyleProperties();
                default:
                    return !0;
            }
        }
        hasCurrentStyleProperties() {
            return this._currentKeyframe.size > 0;
        }
        get currentTime() {
            return this.startTime + this.duration;
        }
        delayNextStep(n) {
            let t = this._keyframes.size === 1 && this._pendingStyles.size;
            this.duration || t
                ? (this.forwardTime(this.currentTime + n),
                  t && this.snapshotCurrentStyles())
                : (this.startTime += n);
        }
        fork(n, t) {
            return (
                this.applyStylesToKeyframe(),
                new e(
                    this._driver,
                    n,
                    t || this.currentTime,
                    this._elementTimelineStylesLookup
                )
            );
        }
        _loadKeyframe() {
            (this._currentKeyframe &&
                (this._previousKeyframe = this._currentKeyframe),
                (this._currentKeyframe = this._keyframes.get(this.duration)),
                this._currentKeyframe ||
                    ((this._currentKeyframe = new Map()),
                    this._keyframes.set(this.duration, this._currentKeyframe)));
        }
        forwardFrame() {
            ((this.duration += QN), this._loadKeyframe());
        }
        forwardTime(n) {
            (this.applyStylesToKeyframe(),
                (this.duration = n),
                this._loadKeyframe());
        }
        _updateStyle(n, t) {
            (this._localTimelineStyles.set(n, t),
                this._globalTimelineStyles.set(n, t),
                this._styleSummary.set(n, {
                    time: this.currentTime,
                    value: t,
                }));
        }
        allowOnlyTimelineStyles() {
            return this._currentEmptyStepKeyframe !== this._currentKeyframe;
        }
        applyEmptyStep(n) {
            n && this._previousKeyframe.set("easing", n);
            for (let [t, r] of this._globalTimelineStyles)
                (this._backFill.set(t, r || jt),
                    this._currentKeyframe.set(t, jt));
            this._currentEmptyStepKeyframe = this._currentKeyframe;
        }
        setStyles(n, t, r, i) {
            t && this._previousKeyframe.set("easing", t);
            let o = (i && i.params) || {},
                s = tA(n, this._globalTimelineStyles);
            for (let [a, l] of s) {
                let c = ao(l, o, r);
                (this._pendingStyles.set(a, c),
                    this._localTimelineStyles.has(a) ||
                        this._backFill.set(
                            a,
                            this._globalTimelineStyles.get(a) ?? jt
                        ),
                    this._updateStyle(a, c));
            }
        }
        applyStylesToKeyframe() {
            this._pendingStyles.size != 0 &&
                (this._pendingStyles.forEach((n, t) => {
                    this._currentKeyframe.set(t, n);
                }),
                this._pendingStyles.clear(),
                this._localTimelineStyles.forEach((n, t) => {
                    this._currentKeyframe.has(t) ||
                        this._currentKeyframe.set(t, n);
                }));
        }
        snapshotCurrentStyles() {
            for (let [n, t] of this._localTimelineStyles)
                (this._pendingStyles.set(n, t), this._updateStyle(n, t));
        }
        getFinalKeyframe() {
            return this._keyframes.get(this.duration);
        }
        get properties() {
            let n = [];
            for (let t in this._currentKeyframe) n.push(t);
            return n;
        }
        mergeTimelineCollectedStyles(n) {
            n._styleSummary.forEach((t, r) => {
                let i = this._styleSummary.get(r);
                (!i || t.time > i.time) && this._updateStyle(r, t.value);
            });
        }
        buildKeyframes() {
            this.applyStylesToKeyframe();
            let n = new Set(),
                t = new Set(),
                r = this._keyframes.size === 1 && this.duration === 0,
                i = [];
            this._keyframes.forEach((a, l) => {
                let c = new Map([...this._backFill, ...a]);
                (c.forEach((u, d) => {
                    u === oo ? n.add(d) : u === jt && t.add(d);
                }),
                    r || c.set("offset", l / this.duration),
                    i.push(c));
            });
            let o = [...n.values()],
                s = [...t.values()];
            if (r) {
                let a = i[0],
                    l = new Map(a);
                (a.set("offset", 0), l.set("offset", 1), (i = [a, l]));
            }
            return bh(
                this.element,
                i,
                o,
                s,
                this.duration,
                this.startTime,
                this.easing,
                !1
            );
        }
    },
    fh = class extends bc {
        keyframes;
        preStyleProps;
        postStyleProps;
        _stretchStartingKeyframe;
        timings;
        constructor(n, t, r, i, o, s, a = !1) {
            (super(n, t, s.delay),
                (this.keyframes = r),
                (this.preStyleProps = i),
                (this.postStyleProps = o),
                (this._stretchStartingKeyframe = a),
                (this.timings = {
                    duration: s.duration,
                    delay: s.delay,
                    easing: s.easing,
                }));
        }
        containsAnimation() {
            return this.keyframes.length > 1;
        }
        buildKeyframes() {
            let n = this.keyframes,
                { delay: t, duration: r, easing: i } = this.timings;
            if (this._stretchStartingKeyframe && t) {
                let o = [],
                    s = r + t,
                    a = t / s,
                    l = new Map(n[0]);
                (l.set("offset", 0), o.push(l));
                let c = new Map(n[0]);
                (c.set("offset", nC(a)), o.push(c));
                let u = n.length - 1;
                for (let d = 1; d <= u; d++) {
                    let p = new Map(n[d]),
                        f = p.get("offset"),
                        h = t + f * r;
                    (p.set("offset", nC(h / s)), o.push(p));
                }
                ((r = s), (t = 0), (i = ""), (n = o));
            }
            return bh(
                this.element,
                n,
                this.preStyleProps,
                this.postStyleProps,
                r,
                t,
                i,
                !0
            );
        }
    };
function nC(e, n = 3) {
    let t = Math.pow(10, n - 1);
    return Math.round(e * t) / t;
}
function tA(e, n) {
    let t = new Map(),
        r;
    return (
        e.forEach((i) => {
            if (i === "*") {
                r ??= n.keys();
                for (let o of r) t.set(o, jt);
            } else for (let [o, s] of i) t.set(o, s);
        }),
        t
    );
}
function rC(e, n, t, r, i, o, s, a, l, c, u, d, p) {
    return {
        type: 0,
        element: e,
        triggerName: n,
        isRemovalTransition: i,
        fromState: t,
        fromStyles: o,
        toState: r,
        toStyles: s,
        timelines: a,
        queriedElements: l,
        preStyleProps: c,
        postStyleProps: u,
        totalTime: d,
        errors: p,
    };
}
var ih = {},
    Cc = class {
        _triggerName;
        ast;
        _stateStyles;
        constructor(n, t, r) {
            ((this._triggerName = n), (this.ast = t), (this._stateStyles = r));
        }
        match(n, t, r, i) {
            return nA(this.ast.matchers, n, t, r, i);
        }
        buildStyles(n, t, r) {
            let i = this._stateStyles.get("*");
            return (
                n !== void 0 && (i = this._stateStyles.get(n?.toString()) || i),
                i ? i.buildStyles(t, r) : new Map()
            );
        }
        build(n, t, r, i, o, s, a, l, c, u) {
            let d = [],
                p = (this.ast.options && this.ast.options.params) || ih,
                f = (a && a.params) || ih,
                h = this.buildStyles(r, f, d),
                _ = (l && l.params) || ih,
                M = this.buildStyles(i, _, d),
                I = new Set(),
                j = new Map(),
                J = new Map(),
                Q = i === "void",
                He = { params: pC(_, p), delay: this.ast.options?.delay },
                xe = u
                    ? []
                    : fC(n, t, this.ast.animation, o, s, h, M, He, c, d),
                ae = 0;
            return (
                xe.forEach((me) => {
                    ae = Math.max(me.duration + me.delay, ae);
                }),
                d.length
                    ? rC(
                          t,
                          this._triggerName,
                          r,
                          i,
                          Q,
                          h,
                          M,
                          [],
                          [],
                          j,
                          J,
                          ae,
                          d
                      )
                    : (xe.forEach((me) => {
                          let mt = me.element,
                              Ut = ht(j, mt, new Set());
                          me.preStyleProps.forEach((It) => Ut.add(It));
                          let fr = ht(J, mt, new Set());
                          (me.postStyleProps.forEach((It) => fr.add(It)),
                              mt !== t && I.add(mt));
                      }),
                      rC(
                          t,
                          this._triggerName,
                          r,
                          i,
                          Q,
                          h,
                          M,
                          xe,
                          [...I.values()],
                          j,
                          J,
                          ae
                      ))
            );
        }
    };
function nA(e, n, t, r, i) {
    return e.some((o) => o(n, t, r, i));
}
function pC(e, n) {
    let t = E({}, n);
    return (
        Object.entries(e).forEach(([r, i]) => {
            i != null && (t[r] = i);
        }),
        t
    );
}
var ph = class {
    styles;
    defaultParams;
    normalizer;
    constructor(n, t, r) {
        ((this.styles = n), (this.defaultParams = t), (this.normalizer = r));
    }
    buildStyles(n, t) {
        let r = new Map(),
            i = pC(n, this.defaultParams);
        return (
            this.styles.styles.forEach((o) => {
                typeof o != "string" &&
                    o.forEach((s, a) => {
                        s && (s = ao(s, i, t));
                        let l = this.normalizer.normalizePropertyName(a, t);
                        ((s = this.normalizer.normalizeStyleValue(a, l, s, t)),
                            r.set(a, s));
                    });
            }),
            r
        );
    }
};
function rA(e, n, t) {
    return new hh(e, n, t);
}
var hh = class {
    name;
    ast;
    _normalizer;
    transitionFactories = [];
    fallbackTransition;
    states = new Map();
    constructor(n, t, r) {
        ((this.name = n),
            (this.ast = t),
            (this._normalizer = r),
            t.states.forEach((i) => {
                let o = (i.options && i.options.params) || {};
                this.states.set(i.name, new ph(i.style, o, r));
            }),
            iC(this.states, "true", "1"),
            iC(this.states, "false", "0"),
            t.transitions.forEach((i) => {
                this.transitionFactories.push(new Cc(n, i, this.states));
            }),
            (this.fallbackTransition = iA(n, this.states)));
    }
    get containsQueries() {
        return this.ast.queryCount > 0;
    }
    matchTransition(n, t, r, i) {
        return (
            this.transitionFactories.find((s) => s.match(n, t, r, i)) || null
        );
    }
    matchStyles(n, t, r) {
        return this.fallbackTransition.buildStyles(n, t, r);
    }
};
function iA(e, n, t) {
    let r = [(s, a) => !0],
        i = { type: F.Sequence, steps: [], options: null },
        o = {
            type: F.Transition,
            animation: i,
            matchers: r,
            options: null,
            queryCount: 0,
            depCount: 0,
        };
    return new Cc(e, o, n);
}
function iC(e, n, t) {
    e.has(n) ? e.has(t) || e.set(t, e.get(n)) : e.has(t) && e.set(n, e.get(t));
}
var oA = new ks(),
    gh = class {
        bodyNode;
        _driver;
        _normalizer;
        _animations = new Map();
        _playersById = new Map();
        players = [];
        constructor(n, t, r) {
            ((this.bodyNode = n), (this._driver = t), (this._normalizer = r));
        }
        register(n, t) {
            let r = [],
                i = [],
                o = dC(this._driver, t, r, i);
            if (r.length) throw Vb(r);
            this._animations.set(n, o);
        }
        _buildPlayer(n, t, r) {
            let i = n.element,
                o = Kp(this._normalizer, n.keyframes, t, r);
            return this._driver.animate(
                i,
                o,
                n.duration,
                n.delay,
                n.easing,
                [],
                !0
            );
        }
        create(n, t, r = {}) {
            let i = [],
                o = this._animations.get(n),
                s,
                a = new Map();
            if (
                (o
                    ? ((s = fC(
                          this._driver,
                          t,
                          o,
                          eh,
                          cc,
                          new Map(),
                          new Map(),
                          r,
                          oA,
                          i
                      )),
                      s.forEach((u) => {
                          let d = ht(a, u.element, new Map());
                          u.postStyleProps.forEach((p) => d.set(p, null));
                      }))
                    : (i.push(jb()), (s = [])),
                i.length)
            )
                throw Bb(i);
            a.forEach((u, d) => {
                u.forEach((p, f) => {
                    u.set(f, this._driver.computeStyle(d, f, jt));
                });
            });
            let l = s.map((u) => {
                    let d = a.get(u.element);
                    return this._buildPlayer(u, new Map(), d);
                }),
                c = Yn(l);
            return (
                this._playersById.set(n, c),
                c.onDestroy(() => this.destroy(n)),
                this.players.push(c),
                c
            );
        }
        destroy(n) {
            let t = this._getPlayer(n);
            (t.destroy(), this._playersById.delete(n));
            let r = this.players.indexOf(t);
            r >= 0 && this.players.splice(r, 1);
        }
        _getPlayer(n) {
            let t = this._playersById.get(n);
            if (!t) throw Ub(n);
            return t;
        }
        listen(n, t, r, i) {
            let o = ac(t, "", "", "");
            return (sc(this._getPlayer(n), r, o, i), () => {});
        }
        command(n, t, r, i) {
            if (r == "register") {
                this.register(n, i[0]);
                return;
            }
            if (r == "create") {
                let s = i[0] || {};
                this.create(n, t, s);
                return;
            }
            let o = this._getPlayer(n);
            switch (r) {
                case "play":
                    o.play();
                    break;
                case "pause":
                    o.pause();
                    break;
                case "reset":
                    o.reset();
                    break;
                case "restart":
                    o.restart();
                    break;
                case "finish":
                    o.finish();
                    break;
                case "init":
                    o.init();
                    break;
                case "setPosition":
                    o.setPosition(parseFloat(i[0]));
                    break;
                case "destroy":
                    this.destroy(n);
                    break;
            }
        }
    },
    oC = "ng-animate-queued",
    sA = ".ng-animate-queued",
    oh = "ng-animate-disabled",
    aA = ".ng-animate-disabled",
    lA = "ng-star-inserted",
    cA = ".ng-star-inserted",
    uA = [],
    hC = {
        namespaceId: "",
        setForRemoval: !1,
        setForMove: !1,
        hasAnimation: !1,
        removedBeforeQueried: !1,
    },
    dA = {
        namespaceId: "",
        setForMove: !1,
        setForRemoval: !1,
        hasAnimation: !1,
        removedBeforeQueried: !0,
    },
    nn = "__ng_removed",
    Ls = class {
        namespaceId;
        value;
        options;
        get params() {
            return this.options.params;
        }
        constructor(n, t = "") {
            this.namespaceId = t;
            let r = n && n.hasOwnProperty("value"),
                i = r ? n.value : n;
            if (((this.value = pA(i)), r)) {
                let o = n,
                    { value: s } = o,
                    a = Dh(o, ["value"]);
                this.options = a;
            } else this.options = {};
            this.options.params || (this.options.params = {});
        }
        absorbOptions(n) {
            let t = n.params;
            if (t) {
                let r = this.options.params;
                Object.keys(t).forEach((i) => {
                    r[i] == null && (r[i] = t[i]);
                });
            }
        }
    },
    Rs = "void",
    sh = new Ls(Rs),
    mh = class {
        id;
        hostElement;
        _engine;
        players = [];
        _triggers = new Map();
        _queue = [];
        _elementListeners = new Map();
        _hostClassName;
        constructor(n, t, r) {
            ((this.id = n),
                (this.hostElement = t),
                (this._engine = r),
                (this._hostClassName = "ng-tns-" + n),
                Bt(t, this._hostClassName));
        }
        listen(n, t, r, i) {
            if (!this._triggers.has(t)) throw Hb(r, t);
            if (r == null || r.length == 0) throw zb(t);
            if (!hA(r)) throw Wb(r, t);
            let o = ht(this._elementListeners, n, []),
                s = { name: t, phase: r, callback: i };
            o.push(s);
            let a = ht(this._engine.statesByElement, n, new Map());
            return (
                a.has(t) || (Bt(n, Ps), Bt(n, Ps + "-" + t), a.set(t, sh)),
                () => {
                    this._engine.afterFlush(() => {
                        let l = o.indexOf(s);
                        (l >= 0 && o.splice(l, 1),
                            this._triggers.has(t) || a.delete(t));
                    });
                }
            );
        }
        register(n, t) {
            return this._triggers.has(n) ? !1 : (this._triggers.set(n, t), !0);
        }
        _getTrigger(n) {
            let t = this._triggers.get(n);
            if (!t) throw qb(n);
            return t;
        }
        trigger(n, t, r, i = !0) {
            let o = this._getTrigger(t),
                s = new Fs(this.id, t, n),
                a = this._engine.statesByElement.get(n);
            a ||
                (Bt(n, Ps),
                Bt(n, Ps + "-" + t),
                this._engine.statesByElement.set(n, (a = new Map())));
            let l = a.get(t),
                c = new Ls(r, this.id);
            if (
                (!(r && r.hasOwnProperty("value")) &&
                    l &&
                    c.absorbOptions(l.options),
                a.set(t, c),
                l || (l = sh),
                !(c.value === Rs) && l.value === c.value)
            ) {
                if (!_A(l.params, c.params)) {
                    let _ = [],
                        M = o.matchStyles(l.value, l.params, _),
                        I = o.matchStyles(c.value, c.params, _);
                    _.length
                        ? this._engine.reportError(_)
                        : this._engine.afterFlush(() => {
                              (dr(n, M), tn(n, I));
                          });
                }
                return;
            }
            let p = ht(this._engine.playersByElement, n, []);
            p.forEach((_) => {
                _.namespaceId == this.id &&
                    _.triggerName == t &&
                    _.queued &&
                    _.destroy();
            });
            let f = o.matchTransition(l.value, c.value, n, c.params),
                h = !1;
            if (!f) {
                if (!i) return;
                ((f = o.fallbackTransition), (h = !0));
            }
            return (
                this._engine.totalQueuedPlayers++,
                this._queue.push({
                    element: n,
                    triggerName: t,
                    transition: f,
                    fromState: l,
                    toState: c,
                    player: s,
                    isFallbackTransition: h,
                }),
                h ||
                    (Bt(n, oC),
                    s.onStart(() => {
                        lo(n, oC);
                    })),
                s.onDone(() => {
                    let _ = this.players.indexOf(s);
                    _ >= 0 && this.players.splice(_, 1);
                    let M = this._engine.playersByElement.get(n);
                    if (M) {
                        let I = M.indexOf(s);
                        I >= 0 && M.splice(I, 1);
                    }
                }),
                this.players.push(s),
                p.push(s),
                s
            );
        }
        deregister(n) {
            (this._triggers.delete(n),
                this._engine.statesByElement.forEach((t) => t.delete(n)),
                this._elementListeners.forEach((t, r) => {
                    this._elementListeners.set(
                        r,
                        t.filter((i) => i.name != n)
                    );
                }));
        }
        clearElementCache(n) {
            (this._engine.statesByElement.delete(n),
                this._elementListeners.delete(n));
            let t = this._engine.playersByElement.get(n);
            t &&
                (t.forEach((r) => r.destroy()),
                this._engine.playersByElement.delete(n));
        }
        _signalRemovalForInnerTriggers(n, t) {
            let r = this._engine.driver.query(n, Ns, !0);
            (r.forEach((i) => {
                if (i[nn]) return;
                let o = this._engine.fetchNamespacesByElement(i);
                o.size
                    ? o.forEach((s) => s.triggerLeaveAnimation(i, t, !1, !0))
                    : this.clearElementCache(i);
            }),
                this._engine.afterFlushAnimationsDone(() =>
                    r.forEach((i) => this.clearElementCache(i))
                ));
        }
        triggerLeaveAnimation(n, t, r, i) {
            let o = this._engine.statesByElement.get(n),
                s = new Map();
            if (o) {
                let a = [];
                if (
                    (o.forEach((l, c) => {
                        if ((s.set(c, l.value), this._triggers.has(c))) {
                            let u = this.trigger(n, c, Rs, i);
                            u && a.push(u);
                        }
                    }),
                    a.length)
                )
                    return (
                        this._engine.markElementAsRemoved(this.id, n, !0, t, s),
                        r &&
                            Yn(a).onDone(() =>
                                this._engine.processLeaveNode(n)
                            ),
                        !0
                    );
            }
            return !1;
        }
        prepareLeaveAnimationListeners(n) {
            let t = this._elementListeners.get(n),
                r = this._engine.statesByElement.get(n);
            if (t && r) {
                let i = new Set();
                t.forEach((o) => {
                    let s = o.name;
                    if (i.has(s)) return;
                    i.add(s);
                    let l = this._triggers.get(s).fallbackTransition,
                        c = r.get(s) || sh,
                        u = new Ls(Rs),
                        d = new Fs(this.id, s, n);
                    (this._engine.totalQueuedPlayers++,
                        this._queue.push({
                            element: n,
                            triggerName: s,
                            transition: l,
                            fromState: c,
                            toState: u,
                            player: d,
                            isFallbackTransition: !0,
                        }));
                });
            }
        }
        removeNode(n, t) {
            let r = this._engine;
            if (
                (n.childElementCount &&
                    this._signalRemovalForInnerTriggers(n, t),
                this.triggerLeaveAnimation(n, t, !0))
            )
                return;
            let i = !1;
            if (r.totalAnimations) {
                let o = r.players.length
                    ? r.playersByQueriedElement.get(n)
                    : [];
                if (o && o.length) i = !0;
                else {
                    let s = n;
                    for (; (s = s.parentNode); )
                        if (r.statesByElement.get(s)) {
                            i = !0;
                            break;
                        }
                }
            }
            if ((this.prepareLeaveAnimationListeners(n), i))
                r.markElementAsRemoved(this.id, n, !1, t);
            else {
                let o = n[nn];
                (!o || o === hC) &&
                    (r.afterFlush(() => this.clearElementCache(n)),
                    r.destroyInnerAnimations(n),
                    r._onRemovalComplete(n, t));
            }
        }
        insertNode(n, t) {
            Bt(n, this._hostClassName);
        }
        drainQueuedTransitions(n) {
            let t = [];
            return (
                this._queue.forEach((r) => {
                    let i = r.player;
                    if (i.destroyed) return;
                    let o = r.element,
                        s = this._elementListeners.get(o);
                    (s &&
                        s.forEach((a) => {
                            if (a.name == r.triggerName) {
                                let l = ac(
                                    o,
                                    r.triggerName,
                                    r.fromState.value,
                                    r.toState.value
                                );
                                ((l._data = n),
                                    sc(r.player, a.phase, l, a.callback));
                            }
                        }),
                        i.markedForDestroy
                            ? this._engine.afterFlush(() => {
                                  i.destroy();
                              })
                            : t.push(r));
                }),
                (this._queue = []),
                t.sort((r, i) => {
                    let o = r.transition.ast.depCount,
                        s = i.transition.ast.depCount;
                    return o == 0 || s == 0
                        ? o - s
                        : this._engine.driver.containsElement(
                                r.element,
                                i.element
                            )
                          ? 1
                          : -1;
                })
            );
        }
        destroy(n) {
            (this.players.forEach((t) => t.destroy()),
                this._signalRemovalForInnerTriggers(this.hostElement, n));
        }
    },
    _h = class {
        bodyNode;
        driver;
        _normalizer;
        players = [];
        newHostElements = new Map();
        playersByElement = new Map();
        playersByQueriedElement = new Map();
        statesByElement = new Map();
        disabledNodes = new Set();
        totalAnimations = 0;
        totalQueuedPlayers = 0;
        _namespaceLookup = {};
        _namespaceList = [];
        _flushFns = [];
        _whenQuietFns = [];
        namespacesByHostElement = new Map();
        collectedEnterElements = [];
        collectedLeaveElements = [];
        onRemovalComplete = (n, t) => {};
        _onRemovalComplete(n, t) {
            this.onRemovalComplete(n, t);
        }
        constructor(n, t, r) {
            ((this.bodyNode = n), (this.driver = t), (this._normalizer = r));
        }
        get queuedPlayers() {
            let n = [];
            return (
                this._namespaceList.forEach((t) => {
                    t.players.forEach((r) => {
                        r.queued && n.push(r);
                    });
                }),
                n
            );
        }
        createNamespace(n, t) {
            let r = new mh(n, t, this);
            return (
                this.bodyNode && this.driver.containsElement(this.bodyNode, t)
                    ? this._balanceNamespaceList(r, t)
                    : (this.newHostElements.set(t, r),
                      this.collectEnterElement(t)),
                (this._namespaceLookup[n] = r)
            );
        }
        _balanceNamespaceList(n, t) {
            let r = this._namespaceList,
                i = this.namespacesByHostElement;
            if (r.length - 1 >= 0) {
                let s = !1,
                    a = this.driver.getParentElement(t);
                for (; a; ) {
                    let l = i.get(a);
                    if (l) {
                        let c = r.indexOf(l);
                        (r.splice(c + 1, 0, n), (s = !0));
                        break;
                    }
                    a = this.driver.getParentElement(a);
                }
                s || r.unshift(n);
            } else r.push(n);
            return (i.set(t, n), n);
        }
        register(n, t) {
            let r = this._namespaceLookup[n];
            return (r || (r = this.createNamespace(n, t)), r);
        }
        registerTrigger(n, t, r) {
            let i = this._namespaceLookup[n];
            i && i.register(t, r) && this.totalAnimations++;
        }
        destroy(n, t) {
            n &&
                (this.afterFlush(() => {}),
                this.afterFlushAnimationsDone(() => {
                    let r = this._fetchNamespace(n);
                    this.namespacesByHostElement.delete(r.hostElement);
                    let i = this._namespaceList.indexOf(r);
                    (i >= 0 && this._namespaceList.splice(i, 1),
                        r.destroy(t),
                        delete this._namespaceLookup[n]);
                }));
        }
        _fetchNamespace(n) {
            return this._namespaceLookup[n];
        }
        fetchNamespacesByElement(n) {
            let t = new Set(),
                r = this.statesByElement.get(n);
            if (r) {
                for (let i of r.values())
                    if (i.namespaceId) {
                        let o = this._fetchNamespace(i.namespaceId);
                        o && t.add(o);
                    }
            }
            return t;
        }
        trigger(n, t, r, i) {
            if (gc(t)) {
                let o = this._fetchNamespace(n);
                if (o) return (o.trigger(t, r, i), !0);
            }
            return !1;
        }
        insertNode(n, t, r, i) {
            if (!gc(t)) return;
            let o = t[nn];
            if (o && o.setForRemoval) {
                ((o.setForRemoval = !1), (o.setForMove = !0));
                let s = this.collectedLeaveElements.indexOf(t);
                s >= 0 && this.collectedLeaveElements.splice(s, 1);
            }
            if (n) {
                let s = this._fetchNamespace(n);
                s && s.insertNode(t, r);
            }
            i && this.collectEnterElement(t);
        }
        collectEnterElement(n) {
            this.collectedEnterElements.push(n);
        }
        markElementAsDisabled(n, t) {
            t
                ? this.disabledNodes.has(n) ||
                  (this.disabledNodes.add(n), Bt(n, oh))
                : this.disabledNodes.has(n) &&
                  (this.disabledNodes.delete(n), lo(n, oh));
        }
        removeNode(n, t, r) {
            if (gc(t)) {
                let i = n ? this._fetchNamespace(n) : null;
                i ? i.removeNode(t, r) : this.markElementAsRemoved(n, t, !1, r);
                let o = this.namespacesByHostElement.get(t);
                o && o.id !== n && o.removeNode(t, r);
            } else this._onRemovalComplete(t, r);
        }
        markElementAsRemoved(n, t, r, i, o) {
            (this.collectedLeaveElements.push(t),
                (t[nn] = {
                    namespaceId: n,
                    setForRemoval: i,
                    hasAnimation: r,
                    removedBeforeQueried: !1,
                    previousTriggersValues: o,
                }));
        }
        listen(n, t, r, i, o) {
            return gc(t)
                ? this._fetchNamespace(n).listen(t, r, i, o)
                : () => {};
        }
        _buildInstruction(n, t, r, i, o) {
            return n.transition.build(
                this.driver,
                n.element,
                n.fromState.value,
                n.toState.value,
                r,
                i,
                n.fromState.options,
                n.toState.options,
                t,
                o
            );
        }
        destroyInnerAnimations(n) {
            let t = this.driver.query(n, Ns, !0);
            (t.forEach((r) => this.destroyActiveAnimationsForElement(r)),
                this.playersByQueriedElement.size != 0 &&
                    ((t = this.driver.query(n, uc, !0)),
                    t.forEach((r) =>
                        this.finishActiveQueriedAnimationOnElement(r)
                    )));
        }
        destroyActiveAnimationsForElement(n) {
            let t = this.playersByElement.get(n);
            t &&
                t.forEach((r) => {
                    r.queued ? (r.markedForDestroy = !0) : r.destroy();
                });
        }
        finishActiveQueriedAnimationOnElement(n) {
            let t = this.playersByQueriedElement.get(n);
            t && t.forEach((r) => r.finish());
        }
        whenRenderingDone() {
            return new Promise((n) => {
                if (this.players.length)
                    return Yn(this.players).onDone(() => n());
                n();
            });
        }
        processLeaveNode(n) {
            let t = n[nn];
            if (t && t.setForRemoval) {
                if (((n[nn] = hC), t.namespaceId)) {
                    this.destroyInnerAnimations(n);
                    let r = this._fetchNamespace(t.namespaceId);
                    r && r.clearElementCache(n);
                }
                this._onRemovalComplete(n, t.setForRemoval);
            }
            (n.classList?.contains(oh) && this.markElementAsDisabled(n, !1),
                this.driver.query(n, aA, !0).forEach((r) => {
                    this.markElementAsDisabled(r, !1);
                }));
        }
        flush(n = -1) {
            let t = [];
            if (
                (this.newHostElements.size &&
                    (this.newHostElements.forEach((r, i) =>
                        this._balanceNamespaceList(r, i)
                    ),
                    this.newHostElements.clear()),
                this.totalAnimations && this.collectedEnterElements.length)
            )
                for (let r = 0; r < this.collectedEnterElements.length; r++) {
                    let i = this.collectedEnterElements[r];
                    Bt(i, lA);
                }
            if (
                this._namespaceList.length &&
                (this.totalQueuedPlayers || this.collectedLeaveElements.length)
            ) {
                let r = [];
                try {
                    t = this._flushAnimations(r, n);
                } finally {
                    for (let i = 0; i < r.length; i++) r[i]();
                }
            } else
                for (let r = 0; r < this.collectedLeaveElements.length; r++) {
                    let i = this.collectedLeaveElements[r];
                    this.processLeaveNode(i);
                }
            if (
                ((this.totalQueuedPlayers = 0),
                (this.collectedEnterElements.length = 0),
                (this.collectedLeaveElements.length = 0),
                this._flushFns.forEach((r) => r()),
                (this._flushFns = []),
                this._whenQuietFns.length)
            ) {
                let r = this._whenQuietFns;
                ((this._whenQuietFns = []),
                    t.length
                        ? Yn(t).onDone(() => {
                              r.forEach((i) => i());
                          })
                        : r.forEach((i) => i()));
            }
        }
        reportError(n) {
            throw Gb(n);
        }
        _flushAnimations(n, t) {
            let r = new ks(),
                i = [],
                o = new Map(),
                s = [],
                a = new Map(),
                l = new Map(),
                c = new Map(),
                u = new Set();
            this.disabledNodes.forEach((T) => {
                u.add(T);
                let x = this.driver.query(T, sA, !0);
                for (let A = 0; A < x.length; A++) u.add(x[A]);
            });
            let d = this.bodyNode,
                p = Array.from(this.statesByElement.keys()),
                f = lC(p, this.collectedEnterElements),
                h = new Map(),
                _ = 0;
            f.forEach((T, x) => {
                let A = eh + _++;
                (h.set(x, A), T.forEach((W) => Bt(W, A)));
            });
            let M = [],
                I = new Set(),
                j = new Set();
            for (let T = 0; T < this.collectedLeaveElements.length; T++) {
                let x = this.collectedLeaveElements[T],
                    A = x[nn];
                A &&
                    A.setForRemoval &&
                    (M.push(x),
                    I.add(x),
                    A.hasAnimation
                        ? this.driver.query(x, cA, !0).forEach((W) => I.add(W))
                        : j.add(x));
            }
            let J = new Map(),
                Q = lC(p, Array.from(I));
            (Q.forEach((T, x) => {
                let A = cc + _++;
                (J.set(x, A), T.forEach((W) => Bt(W, A)));
            }),
                n.push(() => {
                    (f.forEach((T, x) => {
                        let A = h.get(x);
                        T.forEach((W) => lo(W, A));
                    }),
                        Q.forEach((T, x) => {
                            let A = J.get(x);
                            T.forEach((W) => lo(W, A));
                        }),
                        M.forEach((T) => {
                            this.processLeaveNode(T);
                        }));
                }));
            let He = [],
                xe = [];
            for (let T = this._namespaceList.length - 1; T >= 0; T--)
                this._namespaceList[T].drainQueuedTransitions(t).forEach(
                    (A) => {
                        let W = A.player,
                            ve = A.element;
                        if ((He.push(W), this.collectedEnterElements.length)) {
                            let Ae = ve[nn];
                            if (Ae && Ae.setForMove) {
                                if (
                                    Ae.previousTriggersValues &&
                                    Ae.previousTriggersValues.has(A.triggerName)
                                ) {
                                    let Dn = Ae.previousTriggersValues.get(
                                            A.triggerName
                                        ),
                                        rt = this.statesByElement.get(
                                            A.element
                                        );
                                    if (rt && rt.has(A.triggerName)) {
                                        let Zr = rt.get(A.triggerName);
                                        ((Zr.value = Dn),
                                            rt.set(A.triggerName, Zr));
                                    }
                                }
                                W.destroy();
                                return;
                            }
                        }
                        let Ke = !d || !this.driver.containsElement(d, ve),
                            Ne = J.get(ve),
                            Ht = h.get(ve),
                            de = this._buildInstruction(A, r, Ht, Ne, Ke);
                        if (de.errors && de.errors.length) {
                            xe.push(de);
                            return;
                        }
                        if (Ke) {
                            (W.onStart(() => dr(ve, de.fromStyles)),
                                W.onDestroy(() => tn(ve, de.toStyles)),
                                i.push(W));
                            return;
                        }
                        if (A.isFallbackTransition) {
                            (W.onStart(() => dr(ve, de.fromStyles)),
                                W.onDestroy(() => tn(ve, de.toStyles)),
                                i.push(W));
                            return;
                        }
                        let uo = [];
                        (de.timelines.forEach((Ae) => {
                            ((Ae.stretchStartingKeyframe = !0),
                                this.disabledNodes.has(Ae.element) ||
                                    uo.push(Ae));
                        }),
                            (de.timelines = uo),
                            r.append(ve, de.timelines));
                        let $s = { instruction: de, player: W, element: ve };
                        (s.push($s),
                            de.queriedElements.forEach((Ae) =>
                                ht(a, Ae, []).push(W)
                            ),
                            de.preStyleProps.forEach((Ae, Dn) => {
                                if (Ae.size) {
                                    let rt = l.get(Dn);
                                    (rt || l.set(Dn, (rt = new Set())),
                                        Ae.forEach((Zr, fo) => rt.add(fo)));
                                }
                            }),
                            de.postStyleProps.forEach((Ae, Dn) => {
                                let rt = c.get(Dn);
                                (rt || c.set(Dn, (rt = new Set())),
                                    Ae.forEach((Zr, fo) => rt.add(fo)));
                            }));
                    }
                );
            if (xe.length) {
                let T = [];
                (xe.forEach((x) => {
                    T.push(Yb(x.triggerName, x.errors));
                }),
                    He.forEach((x) => x.destroy()),
                    this.reportError(T));
            }
            let ae = new Map(),
                me = new Map();
            (s.forEach((T) => {
                let x = T.element;
                r.has(x) &&
                    (me.set(x, x),
                    this._beforeAnimationBuild(
                        T.player.namespaceId,
                        T.instruction,
                        ae
                    ));
            }),
                i.forEach((T) => {
                    let x = T.element;
                    this._getPreviousPlayers(
                        x,
                        !1,
                        T.namespaceId,
                        T.triggerName,
                        null
                    ).forEach((W) => {
                        (ht(ae, x, []).push(W), W.destroy());
                    });
                }));
            let mt = M.filter((T) => cC(T, l, c)),
                Ut = new Map();
            aC(Ut, this.driver, j, c, jt).forEach((T) => {
                cC(T, l, c) && mt.push(T);
            });
            let It = new Map();
            (f.forEach((T, x) => {
                aC(It, this.driver, new Set(T), l, oo);
            }),
                mt.forEach((T) => {
                    let x = Ut.get(T),
                        A = It.get(T);
                    Ut.set(
                        T,
                        new Map([
                            ...(x?.entries() ?? []),
                            ...(A?.entries() ?? []),
                        ])
                    );
                }));
            let wn = [],
                Kn = [],
                pr = {};
            (s.forEach((T) => {
                let { element: x, player: A, instruction: W } = T;
                if (r.has(x)) {
                    if (u.has(x)) {
                        (A.onDestroy(() => tn(x, W.toStyles)),
                            (A.disabled = !0),
                            A.overrideTotalTime(W.totalTime),
                            i.push(A));
                        return;
                    }
                    let ve = pr;
                    if (me.size > 1) {
                        let Ne = x,
                            Ht = [];
                        for (; (Ne = Ne.parentNode); ) {
                            let de = me.get(Ne);
                            if (de) {
                                ve = de;
                                break;
                            }
                            Ht.push(Ne);
                        }
                        Ht.forEach((de) => me.set(de, ve));
                    }
                    let Ke = this._buildAnimation(
                        A.namespaceId,
                        W,
                        ae,
                        o,
                        It,
                        Ut
                    );
                    if ((A.setRealPlayer(Ke), ve === pr)) wn.push(A);
                    else {
                        let Ne = this.playersByElement.get(ve);
                        (Ne && Ne.length && (A.parentPlayer = Yn(Ne)),
                            i.push(A));
                    }
                } else
                    (dr(x, W.fromStyles),
                        A.onDestroy(() => tn(x, W.toStyles)),
                        Kn.push(A),
                        u.has(x) && i.push(A));
            }),
                Kn.forEach((T) => {
                    let x = o.get(T.element);
                    if (x && x.length) {
                        let A = Yn(x);
                        T.setRealPlayer(A);
                    }
                }),
                i.forEach((T) => {
                    T.parentPlayer
                        ? T.syncPlayerEvents(T.parentPlayer)
                        : T.destroy();
                }));
            for (let T = 0; T < M.length; T++) {
                let x = M[T],
                    A = x[nn];
                if ((lo(x, cc), A && A.hasAnimation)) continue;
                let W = [];
                if (a.size) {
                    let Ke = a.get(x);
                    Ke && Ke.length && W.push(...Ke);
                    let Ne = this.driver.query(x, uc, !0);
                    for (let Ht = 0; Ht < Ne.length; Ht++) {
                        let de = a.get(Ne[Ht]);
                        de && de.length && W.push(...de);
                    }
                }
                let ve = W.filter((Ke) => !Ke.destroyed);
                ve.length ? gA(this, x, ve) : this.processLeaveNode(x);
            }
            return (
                (M.length = 0),
                wn.forEach((T) => {
                    (this.players.push(T),
                        T.onDone(() => {
                            T.destroy();
                            let x = this.players.indexOf(T);
                            this.players.splice(x, 1);
                        }),
                        T.play());
                }),
                wn
            );
        }
        afterFlush(n) {
            this._flushFns.push(n);
        }
        afterFlushAnimationsDone(n) {
            this._whenQuietFns.push(n);
        }
        _getPreviousPlayers(n, t, r, i, o) {
            let s = [];
            if (t) {
                let a = this.playersByQueriedElement.get(n);
                a && (s = a);
            } else {
                let a = this.playersByElement.get(n);
                if (a) {
                    let l = !o || o == Rs;
                    a.forEach((c) => {
                        c.queued || (!l && c.triggerName != i) || s.push(c);
                    });
                }
            }
            return (
                (r || i) &&
                    (s = s.filter(
                        (a) =>
                            !(
                                (r && r != a.namespaceId) ||
                                (i && i != a.triggerName)
                            )
                    )),
                s
            );
        }
        _beforeAnimationBuild(n, t, r) {
            let i = t.triggerName,
                o = t.element,
                s = t.isRemovalTransition ? void 0 : n,
                a = t.isRemovalTransition ? void 0 : i;
            for (let l of t.timelines) {
                let c = l.element,
                    u = c !== o,
                    d = ht(r, c, []);
                this._getPreviousPlayers(c, u, s, a, t.toState).forEach((f) => {
                    let h = f.getRealPlayer();
                    (h.beforeDestroy && h.beforeDestroy(),
                        f.destroy(),
                        d.push(f));
                });
            }
            dr(o, t.fromStyles);
        }
        _buildAnimation(n, t, r, i, o, s) {
            let a = t.triggerName,
                l = t.element,
                c = [],
                u = new Set(),
                d = new Set(),
                p = t.timelines.map((h) => {
                    let _ = h.element;
                    u.add(_);
                    let M = _[nn];
                    if (M && M.removedBeforeQueried)
                        return new En(h.duration, h.delay);
                    let I = _ !== l,
                        j = mA(
                            (r.get(_) || uA).map((ae) => ae.getRealPlayer())
                        ).filter((ae) => {
                            let me = ae;
                            return me.element ? me.element === _ : !1;
                        }),
                        J = o.get(_),
                        Q = s.get(_),
                        He = Kp(this._normalizer, h.keyframes, J, Q),
                        xe = this._buildPlayer(h, He, j);
                    if ((h.subTimeline && i && d.add(_), I)) {
                        let ae = new Fs(n, a, _);
                        (ae.setRealPlayer(xe), c.push(ae));
                    }
                    return xe;
                });
            (c.forEach((h) => {
                (ht(this.playersByQueriedElement, h.element, []).push(h),
                    h.onDone(() =>
                        fA(this.playersByQueriedElement, h.element, h)
                    ));
            }),
                u.forEach((h) => Bt(h, th)));
            let f = Yn(p);
            return (
                f.onDestroy(() => {
                    (u.forEach((h) => lo(h, th)), tn(l, t.toStyles));
                }),
                d.forEach((h) => {
                    ht(i, h, []).push(f);
                }),
                f
            );
        }
        _buildPlayer(n, t, r) {
            return t.length > 0
                ? this.driver.animate(
                      n.element,
                      t,
                      n.duration,
                      n.delay,
                      n.easing,
                      r
                  )
                : new En(n.duration, n.delay);
        }
    },
    Fs = class {
        namespaceId;
        triggerName;
        element;
        _player = new En();
        _containsRealPlayer = !1;
        _queuedCallbacks = new Map();
        destroyed = !1;
        parentPlayer = null;
        markedForDestroy = !1;
        disabled = !1;
        queued = !0;
        totalTime = 0;
        constructor(n, t, r) {
            ((this.namespaceId = n),
                (this.triggerName = t),
                (this.element = r));
        }
        setRealPlayer(n) {
            this._containsRealPlayer ||
                ((this._player = n),
                this._queuedCallbacks.forEach((t, r) => {
                    t.forEach((i) => sc(n, r, void 0, i));
                }),
                this._queuedCallbacks.clear(),
                (this._containsRealPlayer = !0),
                this.overrideTotalTime(n.totalTime),
                (this.queued = !1));
        }
        getRealPlayer() {
            return this._player;
        }
        overrideTotalTime(n) {
            this.totalTime = n;
        }
        syncPlayerEvents(n) {
            let t = this._player;
            (t.triggerCallback && n.onStart(() => t.triggerCallback("start")),
                n.onDone(() => this.finish()),
                n.onDestroy(() => this.destroy()));
        }
        _queueEvent(n, t) {
            ht(this._queuedCallbacks, n, []).push(t);
        }
        onDone(n) {
            (this.queued && this._queueEvent("done", n),
                this._player.onDone(n));
        }
        onStart(n) {
            (this.queued && this._queueEvent("start", n),
                this._player.onStart(n));
        }
        onDestroy(n) {
            (this.queued && this._queueEvent("destroy", n),
                this._player.onDestroy(n));
        }
        init() {
            this._player.init();
        }
        hasStarted() {
            return this.queued ? !1 : this._player.hasStarted();
        }
        play() {
            !this.queued && this._player.play();
        }
        pause() {
            !this.queued && this._player.pause();
        }
        restart() {
            !this.queued && this._player.restart();
        }
        finish() {
            this._player.finish();
        }
        destroy() {
            ((this.destroyed = !0), this._player.destroy());
        }
        reset() {
            !this.queued && this._player.reset();
        }
        setPosition(n) {
            this.queued || this._player.setPosition(n);
        }
        getPosition() {
            return this.queued ? 0 : this._player.getPosition();
        }
        triggerCallback(n) {
            let t = this._player;
            t.triggerCallback && t.triggerCallback(n);
        }
    };
function fA(e, n, t) {
    let r = e.get(n);
    if (r) {
        if (r.length) {
            let i = r.indexOf(t);
            r.splice(i, 1);
        }
        r.length == 0 && e.delete(n);
    }
    return r;
}
function pA(e) {
    return e ?? null;
}
function gc(e) {
    return e && e.nodeType === 1;
}
function hA(e) {
    return e == "start" || e == "done";
}
function sC(e, n) {
    let t = e.style.display;
    return ((e.style.display = n ?? "none"), t);
}
function aC(e, n, t, r, i) {
    let o = [];
    t.forEach((l) => o.push(sC(l)));
    let s = [];
    r.forEach((l, c) => {
        let u = new Map();
        (l.forEach((d) => {
            let p = n.computeStyle(c, d, i);
            (u.set(d, p), (!p || p.length == 0) && ((c[nn] = dA), s.push(c)));
        }),
            e.set(c, u));
    });
    let a = 0;
    return (t.forEach((l) => sC(l, o[a++])), s);
}
function lC(e, n) {
    let t = new Map();
    if ((e.forEach((a) => t.set(a, [])), n.length == 0)) return t;
    let r = 1,
        i = new Set(n),
        o = new Map();
    function s(a) {
        if (!a) return r;
        let l = o.get(a);
        if (l) return l;
        let c = a.parentNode;
        return (
            t.has(c) ? (l = c) : i.has(c) ? (l = r) : (l = s(c)),
            o.set(a, l),
            l
        );
    }
    return (
        n.forEach((a) => {
            let l = s(a);
            l !== r && t.get(l).push(a);
        }),
        t
    );
}
function Bt(e, n) {
    e.classList?.add(n);
}
function lo(e, n) {
    e.classList?.remove(n);
}
function gA(e, n, t) {
    Yn(t).onDone(() => e.processLeaveNode(n));
}
function mA(e) {
    let n = [];
    return (gC(e, n), n);
}
function gC(e, n) {
    for (let t = 0; t < e.length; t++) {
        let r = e[t];
        r instanceof Wr ? gC(r.players, n) : n.push(r);
    }
}
function _A(e, n) {
    let t = Object.keys(e),
        r = Object.keys(n);
    if (t.length != r.length) return !1;
    for (let i = 0; i < t.length; i++) {
        let o = t[i];
        if (!n.hasOwnProperty(o) || e[o] !== n[o]) return !1;
    }
    return !0;
}
function cC(e, n, t) {
    let r = t.get(e);
    if (!r) return !1;
    let i = n.get(e);
    return (i ? r.forEach((o) => i.add(o)) : n.set(e, r), t.delete(e), !0);
}
var co = class {
    _driver;
    _normalizer;
    _transitionEngine;
    _timelineEngine;
    _triggerCache = {};
    onRemovalComplete = (n, t) => {};
    constructor(n, t, r) {
        ((this._driver = t),
            (this._normalizer = r),
            (this._transitionEngine = new _h(n.body, t, r)),
            (this._timelineEngine = new gh(n.body, t, r)),
            (this._transitionEngine.onRemovalComplete = (i, o) =>
                this.onRemovalComplete(i, o)));
    }
    registerTrigger(n, t, r, i, o) {
        let s = n + "-" + i,
            a = this._triggerCache[s];
        if (!a) {
            let l = [],
                c = [],
                u = dC(this._driver, o, l, c);
            if (l.length) throw $b(i, l);
            ((a = rA(i, u, this._normalizer)), (this._triggerCache[s] = a));
        }
        this._transitionEngine.registerTrigger(t, i, a);
    }
    register(n, t) {
        this._transitionEngine.register(n, t);
    }
    destroy(n, t) {
        this._transitionEngine.destroy(n, t);
    }
    onInsert(n, t, r, i) {
        this._transitionEngine.insertNode(n, t, r, i);
    }
    onRemove(n, t, r) {
        this._transitionEngine.removeNode(n, t, r);
    }
    disableAnimations(n, t) {
        this._transitionEngine.markElementAsDisabled(n, t);
    }
    process(n, t, r, i) {
        if (r.charAt(0) == "@") {
            let [o, s] = Qp(r),
                a = i;
            this._timelineEngine.command(o, t, s, a);
        } else this._transitionEngine.trigger(n, t, r, i);
    }
    listen(n, t, r, i, o) {
        if (r.charAt(0) == "@") {
            let [s, a] = Qp(r);
            return this._timelineEngine.listen(s, t, a, o);
        }
        return this._transitionEngine.listen(n, t, r, i, o);
    }
    flush(n = -1) {
        this._transitionEngine.flush(n);
    }
    get players() {
        return [
            ...this._transitionEngine.players,
            ...this._timelineEngine.players,
        ];
    }
    whenRenderingDone() {
        return this._transitionEngine.whenRenderingDone();
    }
    afterFlushAnimationsDone(n) {
        this._transitionEngine.afterFlushAnimationsDone(n);
    }
};
function yA(e, n) {
    let t = null,
        r = null;
    return (
        Array.isArray(n) && n.length
            ? ((t = ah(n[0])), n.length > 1 && (r = ah(n[n.length - 1])))
            : n instanceof Map && (t = ah(n)),
        t || r ? new vA(e, t, r) : null
    );
}
var vA = (() => {
    class e {
        _element;
        _startStyles;
        _endStyles;
        static initialStylesByElement = new WeakMap();
        _state = 0;
        _initialStyles;
        constructor(t, r, i) {
            ((this._element = t),
                (this._startStyles = r),
                (this._endStyles = i));
            let o = e.initialStylesByElement.get(t);
            (o || e.initialStylesByElement.set(t, (o = new Map())),
                (this._initialStyles = o));
        }
        start() {
            this._state < 1 &&
                (this._startStyles &&
                    tn(this._element, this._startStyles, this._initialStyles),
                (this._state = 1));
        }
        finish() {
            (this.start(),
                this._state < 2 &&
                    (tn(this._element, this._initialStyles),
                    this._endStyles &&
                        (tn(this._element, this._endStyles),
                        (this._endStyles = null)),
                    (this._state = 1)));
        }
        destroy() {
            (this.finish(),
                this._state < 3 &&
                    (e.initialStylesByElement.delete(this._element),
                    this._startStyles &&
                        (dr(this._element, this._startStyles),
                        (this._endStyles = null)),
                    this._endStyles &&
                        (dr(this._element, this._endStyles),
                        (this._endStyles = null)),
                    tn(this._element, this._initialStyles),
                    (this._state = 3)));
        }
    }
    return e;
})();
function ah(e) {
    let n = null;
    return (
        e.forEach((t, r) => {
            bA(r) && ((n = n || new Map()), n.set(r, t));
        }),
        n
    );
}
function bA(e) {
    return e === "display" || e === "position";
}
var Ec = class {
        element;
        keyframes;
        options;
        _specialStyles;
        _onDoneFns = [];
        _onStartFns = [];
        _onDestroyFns = [];
        _duration;
        _delay;
        _initialized = !1;
        _finished = !1;
        _started = !1;
        _destroyed = !1;
        _finalKeyframe;
        _originalOnDoneFns = [];
        _originalOnStartFns = [];
        domPlayer;
        time = 0;
        parentPlayer = null;
        currentSnapshot = new Map();
        constructor(n, t, r, i) {
            ((this.element = n),
                (this.keyframes = t),
                (this.options = r),
                (this._specialStyles = i),
                (this._duration = r.duration),
                (this._delay = r.delay || 0),
                (this.time = this._duration + this._delay));
        }
        _onFinish() {
            this._finished ||
                ((this._finished = !0),
                this._onDoneFns.forEach((n) => n()),
                (this._onDoneFns = []));
        }
        init() {
            (this._buildPlayer(), this._preparePlayerBeforeStart());
        }
        _buildPlayer() {
            if (this._initialized) return;
            this._initialized = !0;
            let n = this.keyframes;
            ((this.domPlayer = this._triggerWebAnimation(
                this.element,
                n,
                this.options
            )),
                (this._finalKeyframe = n.length ? n[n.length - 1] : new Map()));
            let t = () => this._onFinish();
            (this.domPlayer.addEventListener("finish", t),
                this.onDestroy(() => {
                    this.domPlayer.removeEventListener("finish", t);
                }));
        }
        _preparePlayerBeforeStart() {
            this._delay ? this._resetDomPlayerState() : this.domPlayer.pause();
        }
        _convertKeyframesToObject(n) {
            let t = [];
            return (
                n.forEach((r) => {
                    t.push(Object.fromEntries(r));
                }),
                t
            );
        }
        _triggerWebAnimation(n, t, r) {
            return n.animate(this._convertKeyframesToObject(t), r);
        }
        onStart(n) {
            (this._originalOnStartFns.push(n), this._onStartFns.push(n));
        }
        onDone(n) {
            (this._originalOnDoneFns.push(n), this._onDoneFns.push(n));
        }
        onDestroy(n) {
            this._onDestroyFns.push(n);
        }
        play() {
            (this._buildPlayer(),
                this.hasStarted() ||
                    (this._onStartFns.forEach((n) => n()),
                    (this._onStartFns = []),
                    (this._started = !0),
                    this._specialStyles && this._specialStyles.start()),
                this.domPlayer.play());
        }
        pause() {
            (this.init(), this.domPlayer.pause());
        }
        finish() {
            (this.init(),
                this._specialStyles && this._specialStyles.finish(),
                this._onFinish(),
                this.domPlayer.finish());
        }
        reset() {
            (this._resetDomPlayerState(),
                (this._destroyed = !1),
                (this._finished = !1),
                (this._started = !1),
                (this._onStartFns = this._originalOnStartFns),
                (this._onDoneFns = this._originalOnDoneFns));
        }
        _resetDomPlayerState() {
            this.domPlayer && this.domPlayer.cancel();
        }
        restart() {
            (this.reset(), this.play());
        }
        hasStarted() {
            return this._started;
        }
        destroy() {
            this._destroyed ||
                ((this._destroyed = !0),
                this._resetDomPlayerState(),
                this._onFinish(),
                this._specialStyles && this._specialStyles.destroy(),
                this._onDestroyFns.forEach((n) => n()),
                (this._onDestroyFns = []));
        }
        setPosition(n) {
            (this.domPlayer === void 0 && this.init(),
                (this.domPlayer.currentTime = n * this.time));
        }
        getPosition() {
            return +(this.domPlayer.currentTime ?? 0) / this.time;
        }
        get totalTime() {
            return this._delay + this._duration;
        }
        beforeDestroy() {
            let n = new Map();
            (this.hasStarted() &&
                this._finalKeyframe.forEach((r, i) => {
                    i !== "offset" &&
                        n.set(i, this._finished ? r : fc(this.element, i));
                }),
                (this.currentSnapshot = n));
        }
        triggerCallback(n) {
            let t = n === "start" ? this._onStartFns : this._onDoneFns;
            (t.forEach((r) => r()), (t.length = 0));
        }
    },
    Sc = class {
        validateStyleProperty(n) {
            return !0;
        }
        validateAnimatableStyleProperty(n) {
            return !0;
        }
        containsElement(n, t) {
            return Zp(n, t);
        }
        getParentElement(n) {
            return lc(n);
        }
        query(n, t, r) {
            return Xp(n, t, r);
        }
        computeStyle(n, t, r) {
            return fc(n, t);
        }
        animate(n, t, r, i, o, s = []) {
            let a = i == 0 ? "both" : "forwards",
                l = { duration: r, delay: i, fill: a };
            o && (l.easing = o);
            let c = new Map(),
                u = s.filter((f) => f instanceof Ec);
            Xb(r, i) &&
                u.forEach((f) => {
                    f.currentSnapshot.forEach((h, _) => c.set(_, h));
                });
            let d = Qb(t).map((f) => new Map(f));
            d = Jb(n, d, c);
            let p = yA(n, d);
            return new Ec(n, d, l, p);
        }
    };
var mc = "@",
    mC = "@.disabled",
    wc = class {
        namespaceId;
        delegate;
        engine;
        _onDestroy;
        ɵtype = 0;
        constructor(n, t, r, i) {
            ((this.namespaceId = n),
                (this.delegate = t),
                (this.engine = r),
                (this._onDestroy = i));
        }
        get data() {
            return this.delegate.data;
        }
        destroyNode(n) {
            this.delegate.destroyNode?.(n);
        }
        destroy() {
            (this.engine.destroy(this.namespaceId, this.delegate),
                this.engine.afterFlushAnimationsDone(() => {
                    queueMicrotask(() => {
                        this.delegate.destroy();
                    });
                }),
                this._onDestroy?.());
        }
        createElement(n, t) {
            return this.delegate.createElement(n, t);
        }
        createComment(n) {
            return this.delegate.createComment(n);
        }
        createText(n) {
            return this.delegate.createText(n);
        }
        appendChild(n, t) {
            (this.delegate.appendChild(n, t),
                this.engine.onInsert(this.namespaceId, t, n, !1));
        }
        insertBefore(n, t, r, i = !0) {
            (this.delegate.insertBefore(n, t, r),
                this.engine.onInsert(this.namespaceId, t, n, i));
        }
        removeChild(n, t, r) {
            this.parentNode(t) &&
                this.engine.onRemove(this.namespaceId, t, this.delegate);
        }
        selectRootElement(n, t) {
            return this.delegate.selectRootElement(n, t);
        }
        parentNode(n) {
            return this.delegate.parentNode(n);
        }
        nextSibling(n) {
            return this.delegate.nextSibling(n);
        }
        setAttribute(n, t, r, i) {
            this.delegate.setAttribute(n, t, r, i);
        }
        removeAttribute(n, t, r) {
            this.delegate.removeAttribute(n, t, r);
        }
        addClass(n, t) {
            this.delegate.addClass(n, t);
        }
        removeClass(n, t) {
            this.delegate.removeClass(n, t);
        }
        setStyle(n, t, r, i) {
            this.delegate.setStyle(n, t, r, i);
        }
        removeStyle(n, t, r) {
            this.delegate.removeStyle(n, t, r);
        }
        setProperty(n, t, r) {
            t.charAt(0) == mc && t == mC
                ? this.disableAnimations(n, !!r)
                : this.delegate.setProperty(n, t, r);
        }
        setValue(n, t) {
            this.delegate.setValue(n, t);
        }
        listen(n, t, r, i) {
            return this.delegate.listen(n, t, r, i);
        }
        disableAnimations(n, t) {
            this.engine.disableAnimations(n, t);
        }
    },
    yh = class extends wc {
        factory;
        constructor(n, t, r, i, o) {
            (super(t, r, i, o), (this.factory = n), (this.namespaceId = t));
        }
        setProperty(n, t, r) {
            t.charAt(0) == mc
                ? t.charAt(1) == "." && t == mC
                    ? ((r = r === void 0 ? !0 : !!r),
                      this.disableAnimations(n, r))
                    : this.engine.process(this.namespaceId, n, t.slice(1), r)
                : this.delegate.setProperty(n, t, r);
        }
        listen(n, t, r, i) {
            if (t.charAt(0) == mc) {
                let o = CA(n),
                    s = t.slice(1),
                    a = "";
                return (
                    s.charAt(0) != mc && ([s, a] = EA(s)),
                    this.engine.listen(this.namespaceId, o, s, a, (l) => {
                        let c = l._data || -1;
                        this.factory.scheduleListenerCallback(c, r, l);
                    })
                );
            }
            return this.delegate.listen(n, t, r, i);
        }
    };
function CA(e) {
    switch (e) {
        case "body":
            return document.body;
        case "document":
            return document;
        case "window":
            return window;
        default:
            return e;
    }
}
function EA(e) {
    let n = e.indexOf("."),
        t = e.substring(0, n),
        r = e.slice(n + 1);
    return [t, r];
}
var Dc = class {
    delegate;
    engine;
    _zone;
    _currentId = 0;
    _microtaskId = 1;
    _animationCallbacksBuffer = [];
    _rendererCache = new Map();
    _cdRecurDepth = 0;
    constructor(n, t, r) {
        ((this.delegate = n),
            (this.engine = t),
            (this._zone = r),
            (t.onRemovalComplete = (i, o) => {
                o?.removeChild(null, i);
            }));
    }
    createRenderer(n, t) {
        let r = "",
            i = this.delegate.createRenderer(n, t);
        if (!n || !t?.data?.animation) {
            let c = this._rendererCache,
                u = c.get(i);
            if (!u) {
                let d = () => c.delete(i);
                ((u = new wc(r, i, this.engine, d)), c.set(i, u));
            }
            return u;
        }
        let o = t.id,
            s = t.id + "-" + this._currentId;
        (this._currentId++, this.engine.register(s, n));
        let a = (c) => {
            Array.isArray(c)
                ? c.forEach(a)
                : this.engine.registerTrigger(o, s, n, c.name, c);
        };
        return (t.data.animation.forEach(a), new yh(this, s, i, this.engine));
    }
    begin() {
        (this._cdRecurDepth++, this.delegate.begin && this.delegate.begin());
    }
    _scheduleCountTask() {
        queueMicrotask(() => {
            this._microtaskId++;
        });
    }
    scheduleListenerCallback(n, t, r) {
        if (n >= 0 && n < this._microtaskId) {
            this._zone.run(() => t(r));
            return;
        }
        let i = this._animationCallbacksBuffer;
        (i.length == 0 &&
            queueMicrotask(() => {
                this._zone.run(() => {
                    (i.forEach((o) => {
                        let [s, a] = o;
                        s(a);
                    }),
                        (this._animationCallbacksBuffer = []));
                });
            }),
            i.push([t, r]));
    }
    end() {
        (this._cdRecurDepth--,
            this._cdRecurDepth == 0 &&
                this._zone.runOutsideAngular(() => {
                    (this._scheduleCountTask(),
                        this.engine.flush(this._microtaskId));
                }),
            this.delegate.end && this.delegate.end());
    }
    whenRenderingDone() {
        return this.engine.whenRenderingDone();
    }
    componentReplaced(n) {
        (this.engine.flush(), this.delegate.componentReplaced?.(n));
    }
};
var wA = (() => {
    class e extends co {
        constructor(t, r, i) {
            super(t, r, i);
        }
        ngOnDestroy() {
            this.flush();
        }
        static ɵfac = function (r) {
            return new (r || e)(N(re), N(Kr), N(Qr));
        };
        static ɵprov = w({ token: e, factory: e.ɵfac });
    }
    return e;
})();
function DA() {
    return new _c();
}
function MA(e, n, t) {
    return new Dc(e, n, t);
}
var yC = [
        { provide: Qr, useFactory: DA },
        { provide: co, useClass: wA },
        { provide: tr, useFactory: MA, deps: [ss, co, ne] },
    ],
    IA = [
        { provide: Kr, useClass: vh },
        { provide: Ud, useValue: "NoopAnimations" },
        ...yC,
    ],
    _C = [
        { provide: Kr, useFactory: () => new Sc() },
        { provide: Ud, useFactory: () => "BrowserAnimations" },
        ...yC,
    ],
    Ch = (() => {
        class e {
            static withConfig(t) {
                return {
                    ngModule: e,
                    providers: t.disableAnimations ? IA : _C,
                };
            }
            static ɵfac = function (r) {
                return new (r || e)();
            };
            static ɵmod = ge({ type: e });
            static ɵinj = he({ providers: _C, imports: [ls] });
        }
        return e;
    })();
var TA = [Ch],
    xA = [Wp],
    vC = (() => {
        class e {
            static {
                this.ɵfac = function (r) {
                    return new (r || e)();
                };
            }
            static {
                this.ɵmod = ge({ type: e });
            }
            static {
                this.ɵinj = he({ imports: [TA, xA, Ch, Wp] });
            }
        }
        return e;
    })();
var bC = (() => {
    class e {
        static {
            this.ɵfac = function (r) {
                return new (r || e)();
            };
        }
        static {
            this.ɵmod = ge({ type: e, bootstrap: [Cb] });
        }
        static {
            this.ɵinj = he({
                providers: [Yv({ ripple: !0 })],
                imports: [H0, ls, vC],
            });
        }
    }
    return e;
})();
Uf()
    .bootstrapModule(bC)
    .catch((e) => console.error(e));
