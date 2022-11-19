import { aQ as events, aR as getAugmentedNamespace, aS as require$$1$1, aT as commonjsGlobal, aU as bn, aV as js, aW as tslib_es6, aX as getDefaultExportFromCjs } from "./index.8052dd69.js";
import { _ as __extends, a as Subscriber, b as Subscription, c as SubjectSubscriber, O as Observable, S as Subject, d as ObjectUnsubscribedError, A as AsyncAction, e as AsyncScheduler, i as isScheduler, s as scheduleArray, g as fromArray, h as SubjectSubscription, j as map, k as isArray$5, l as canReportError, n as subscribeTo, o as mergeAll, p as from, q as isObject, r as isFunction, u as identity, v as isNumeric, w as async, x as iterator, y as innerSubscribe, z as SimpleInnerSubscriber, B as SimpleOuterSubscriber, C as observable, D as asyncScheduler, E as Scheduler, F as pipe, U as UnsubscriptionError, f as fromEvent, m as merge$2, t as timer, G as scheduled, H as config, I as mergeMap, J as flatMap } from "./timer.4871a679.js";
import { g as getIntrinsic, c as callBound$1, s as sha_js, u as util$5 } from "./util.2575bfc3.js";
function _mergeNamespaces(n2, m2) {
  m2.forEach(function(e2) {
    e2 && typeof e2 !== "string" && !Array.isArray(e2) && Object.keys(e2).forEach(function(k2) {
      if (k2 !== "default" && !(k2 in n2)) {
        var d2 = Object.getOwnPropertyDescriptor(e2, k2);
        Object.defineProperty(n2, k2, d2.get ? d2 : {
          enumerable: true,
          get: function() {
            return e2[k2];
          }
        });
      }
    });
  });
  return Object.freeze(Object.defineProperty(n2, Symbol.toStringTag, { value: "Module" }));
}
function refCount() {
  return function refCountOperatorFunction(source) {
    return source.lift(new RefCountOperator(source));
  };
}
var RefCountOperator = /* @__PURE__ */ function() {
  function RefCountOperator2(connectable) {
    this.connectable = connectable;
  }
  RefCountOperator2.prototype.call = function(subscriber, source) {
    var connectable = this.connectable;
    connectable._refCount++;
    var refCounter = new RefCountSubscriber(subscriber, connectable);
    var subscription = source.subscribe(refCounter);
    if (!refCounter.closed) {
      refCounter.connection = connectable.connect();
    }
    return subscription;
  };
  return RefCountOperator2;
}();
var RefCountSubscriber = /* @__PURE__ */ function(_super) {
  __extends(RefCountSubscriber2, _super);
  function RefCountSubscriber2(destination, connectable) {
    var _this = _super.call(this, destination) || this;
    _this.connectable = connectable;
    return _this;
  }
  RefCountSubscriber2.prototype._unsubscribe = function() {
    var connectable = this.connectable;
    if (!connectable) {
      this.connection = null;
      return;
    }
    this.connectable = null;
    var refCount2 = connectable._refCount;
    if (refCount2 <= 0) {
      this.connection = null;
      return;
    }
    connectable._refCount = refCount2 - 1;
    if (refCount2 > 1) {
      this.connection = null;
      return;
    }
    var connection = this.connection;
    var sharedConnection = connectable._connection;
    this.connection = null;
    if (sharedConnection && (!connection || sharedConnection === connection)) {
      sharedConnection.unsubscribe();
    }
  };
  return RefCountSubscriber2;
}(Subscriber);
var ConnectableObservable = /* @__PURE__ */ function(_super) {
  __extends(ConnectableObservable2, _super);
  function ConnectableObservable2(source, subjectFactory) {
    var _this = _super.call(this) || this;
    _this.source = source;
    _this.subjectFactory = subjectFactory;
    _this._refCount = 0;
    _this._isComplete = false;
    return _this;
  }
  ConnectableObservable2.prototype._subscribe = function(subscriber) {
    return this.getSubject().subscribe(subscriber);
  };
  ConnectableObservable2.prototype.getSubject = function() {
    var subject = this._subject;
    if (!subject || subject.isStopped) {
      this._subject = this.subjectFactory();
    }
    return this._subject;
  };
  ConnectableObservable2.prototype.connect = function() {
    var connection = this._connection;
    if (!connection) {
      this._isComplete = false;
      connection = this._connection = new Subscription();
      connection.add(this.source.subscribe(new ConnectableSubscriber(this.getSubject(), this)));
      if (connection.closed) {
        this._connection = null;
        connection = Subscription.EMPTY;
      }
    }
    return connection;
  };
  ConnectableObservable2.prototype.refCount = function() {
    return refCount()(this);
  };
  return ConnectableObservable2;
}(Observable);
var connectableObservableDescriptor = /* @__PURE__ */ function() {
  var connectableProto = ConnectableObservable.prototype;
  return {
    operator: { value: null },
    _refCount: { value: 0, writable: true },
    _subject: { value: null, writable: true },
    _connection: { value: null, writable: true },
    _subscribe: { value: connectableProto._subscribe },
    _isComplete: { value: connectableProto._isComplete, writable: true },
    getSubject: { value: connectableProto.getSubject },
    connect: { value: connectableProto.connect },
    refCount: { value: connectableProto.refCount }
  };
}();
var ConnectableSubscriber = /* @__PURE__ */ function(_super) {
  __extends(ConnectableSubscriber2, _super);
  function ConnectableSubscriber2(destination, connectable) {
    var _this = _super.call(this, destination) || this;
    _this.connectable = connectable;
    return _this;
  }
  ConnectableSubscriber2.prototype._error = function(err) {
    this._unsubscribe();
    _super.prototype._error.call(this, err);
  };
  ConnectableSubscriber2.prototype._complete = function() {
    this.connectable._isComplete = true;
    this._unsubscribe();
    _super.prototype._complete.call(this);
  };
  ConnectableSubscriber2.prototype._unsubscribe = function() {
    var connectable = this.connectable;
    if (connectable) {
      this.connectable = null;
      var connection = connectable._connection;
      connectable._refCount = 0;
      connectable._subject = null;
      connectable._connection = null;
      if (connection) {
        connection.unsubscribe();
      }
    }
  };
  return ConnectableSubscriber2;
}(SubjectSubscriber);
function groupBy(keySelector, elementSelector, durationSelector, subjectSelector) {
  return function(source) {
    return source.lift(new GroupByOperator(keySelector, elementSelector, durationSelector, subjectSelector));
  };
}
var GroupByOperator = /* @__PURE__ */ function() {
  function GroupByOperator2(keySelector, elementSelector, durationSelector, subjectSelector) {
    this.keySelector = keySelector;
    this.elementSelector = elementSelector;
    this.durationSelector = durationSelector;
    this.subjectSelector = subjectSelector;
  }
  GroupByOperator2.prototype.call = function(subscriber, source) {
    return source.subscribe(new GroupBySubscriber(subscriber, this.keySelector, this.elementSelector, this.durationSelector, this.subjectSelector));
  };
  return GroupByOperator2;
}();
var GroupBySubscriber = /* @__PURE__ */ function(_super) {
  __extends(GroupBySubscriber2, _super);
  function GroupBySubscriber2(destination, keySelector, elementSelector, durationSelector, subjectSelector) {
    var _this = _super.call(this, destination) || this;
    _this.keySelector = keySelector;
    _this.elementSelector = elementSelector;
    _this.durationSelector = durationSelector;
    _this.subjectSelector = subjectSelector;
    _this.groups = null;
    _this.attemptedToUnsubscribe = false;
    _this.count = 0;
    return _this;
  }
  GroupBySubscriber2.prototype._next = function(value) {
    var key;
    try {
      key = this.keySelector(value);
    } catch (err) {
      this.error(err);
      return;
    }
    this._group(value, key);
  };
  GroupBySubscriber2.prototype._group = function(value, key) {
    var groups = this.groups;
    if (!groups) {
      groups = this.groups = /* @__PURE__ */ new Map();
    }
    var group = groups.get(key);
    var element;
    if (this.elementSelector) {
      try {
        element = this.elementSelector(value);
      } catch (err) {
        this.error(err);
      }
    } else {
      element = value;
    }
    if (!group) {
      group = this.subjectSelector ? this.subjectSelector() : new Subject();
      groups.set(key, group);
      var groupedObservable = new GroupedObservable(key, group, this);
      this.destination.next(groupedObservable);
      if (this.durationSelector) {
        var duration = void 0;
        try {
          duration = this.durationSelector(new GroupedObservable(key, group));
        } catch (err) {
          this.error(err);
          return;
        }
        this.add(duration.subscribe(new GroupDurationSubscriber(key, group, this)));
      }
    }
    if (!group.closed) {
      group.next(element);
    }
  };
  GroupBySubscriber2.prototype._error = function(err) {
    var groups = this.groups;
    if (groups) {
      groups.forEach(function(group, key) {
        group.error(err);
      });
      groups.clear();
    }
    this.destination.error(err);
  };
  GroupBySubscriber2.prototype._complete = function() {
    var groups = this.groups;
    if (groups) {
      groups.forEach(function(group, key) {
        group.complete();
      });
      groups.clear();
    }
    this.destination.complete();
  };
  GroupBySubscriber2.prototype.removeGroup = function(key) {
    this.groups.delete(key);
  };
  GroupBySubscriber2.prototype.unsubscribe = function() {
    if (!this.closed) {
      this.attemptedToUnsubscribe = true;
      if (this.count === 0) {
        _super.prototype.unsubscribe.call(this);
      }
    }
  };
  return GroupBySubscriber2;
}(Subscriber);
var GroupDurationSubscriber = /* @__PURE__ */ function(_super) {
  __extends(GroupDurationSubscriber2, _super);
  function GroupDurationSubscriber2(key, group, parent) {
    var _this = _super.call(this, group) || this;
    _this.key = key;
    _this.group = group;
    _this.parent = parent;
    return _this;
  }
  GroupDurationSubscriber2.prototype._next = function(value) {
    this.complete();
  };
  GroupDurationSubscriber2.prototype._unsubscribe = function() {
    var _a = this, parent = _a.parent, key = _a.key;
    this.key = this.parent = null;
    if (parent) {
      parent.removeGroup(key);
    }
  };
  return GroupDurationSubscriber2;
}(Subscriber);
var GroupedObservable = /* @__PURE__ */ function(_super) {
  __extends(GroupedObservable2, _super);
  function GroupedObservable2(key, groupSubject, refCountSubscription) {
    var _this = _super.call(this) || this;
    _this.key = key;
    _this.groupSubject = groupSubject;
    _this.refCountSubscription = refCountSubscription;
    return _this;
  }
  GroupedObservable2.prototype._subscribe = function(subscriber) {
    var subscription = new Subscription();
    var _a = this, refCountSubscription = _a.refCountSubscription, groupSubject = _a.groupSubject;
    if (refCountSubscription && !refCountSubscription.closed) {
      subscription.add(new InnerRefCountSubscription(refCountSubscription));
    }
    subscription.add(groupSubject.subscribe(subscriber));
    return subscription;
  };
  return GroupedObservable2;
}(Observable);
var InnerRefCountSubscription = /* @__PURE__ */ function(_super) {
  __extends(InnerRefCountSubscription2, _super);
  function InnerRefCountSubscription2(parent) {
    var _this = _super.call(this) || this;
    _this.parent = parent;
    parent.count++;
    return _this;
  }
  InnerRefCountSubscription2.prototype.unsubscribe = function() {
    var parent = this.parent;
    if (!parent.closed && !this.closed) {
      _super.prototype.unsubscribe.call(this);
      parent.count -= 1;
      if (parent.count === 0 && parent.attemptedToUnsubscribe) {
        parent.unsubscribe();
      }
    }
  };
  return InnerRefCountSubscription2;
}(Subscription);
var BehaviorSubject = /* @__PURE__ */ function(_super) {
  __extends(BehaviorSubject2, _super);
  function BehaviorSubject2(_value) {
    var _this = _super.call(this) || this;
    _this._value = _value;
    return _this;
  }
  Object.defineProperty(BehaviorSubject2.prototype, "value", {
    get: function() {
      return this.getValue();
    },
    enumerable: true,
    configurable: true
  });
  BehaviorSubject2.prototype._subscribe = function(subscriber) {
    var subscription = _super.prototype._subscribe.call(this, subscriber);
    if (subscription && !subscription.closed) {
      subscriber.next(this._value);
    }
    return subscription;
  };
  BehaviorSubject2.prototype.getValue = function() {
    if (this.hasError) {
      throw this.thrownError;
    } else if (this.closed) {
      throw new ObjectUnsubscribedError();
    } else {
      return this._value;
    }
  };
  BehaviorSubject2.prototype.next = function(value) {
    _super.prototype.next.call(this, this._value = value);
  };
  return BehaviorSubject2;
}(Subject);
var QueueAction = /* @__PURE__ */ function(_super) {
  __extends(QueueAction2, _super);
  function QueueAction2(scheduler, work) {
    var _this = _super.call(this, scheduler, work) || this;
    _this.scheduler = scheduler;
    _this.work = work;
    return _this;
  }
  QueueAction2.prototype.schedule = function(state, delay2) {
    if (delay2 === void 0) {
      delay2 = 0;
    }
    if (delay2 > 0) {
      return _super.prototype.schedule.call(this, state, delay2);
    }
    this.delay = delay2;
    this.state = state;
    this.scheduler.flush(this);
    return this;
  };
  QueueAction2.prototype.execute = function(state, delay2) {
    return delay2 > 0 || this.closed ? _super.prototype.execute.call(this, state, delay2) : this._execute(state, delay2);
  };
  QueueAction2.prototype.requestAsyncId = function(scheduler, id, delay2) {
    if (delay2 === void 0) {
      delay2 = 0;
    }
    if (delay2 !== null && delay2 > 0 || delay2 === null && this.delay > 0) {
      return _super.prototype.requestAsyncId.call(this, scheduler, id, delay2);
    }
    return scheduler.flush(this);
  };
  return QueueAction2;
}(AsyncAction);
var QueueScheduler = /* @__PURE__ */ function(_super) {
  __extends(QueueScheduler2, _super);
  function QueueScheduler2() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  return QueueScheduler2;
}(AsyncScheduler);
var queueScheduler = /* @__PURE__ */ new QueueScheduler(QueueAction);
var queue = queueScheduler;
var EMPTY = /* @__PURE__ */ new Observable(function(subscriber) {
  return subscriber.complete();
});
function empty(scheduler) {
  return scheduler ? emptyScheduled(scheduler) : EMPTY;
}
function emptyScheduled(scheduler) {
  return new Observable(function(subscriber) {
    return scheduler.schedule(function() {
      return subscriber.complete();
    });
  });
}
function of() {
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
  var scheduler = args[args.length - 1];
  if (isScheduler(scheduler)) {
    args.pop();
    return scheduleArray(args, scheduler);
  } else {
    return fromArray(args);
  }
}
function throwError(error, scheduler) {
  if (!scheduler) {
    return new Observable(function(subscriber) {
      return subscriber.error(error);
    });
  } else {
    return new Observable(function(subscriber) {
      return scheduler.schedule(dispatch$6, 0, { error, subscriber });
    });
  }
}
function dispatch$6(_a) {
  var error = _a.error, subscriber = _a.subscriber;
  subscriber.error(error);
}
var NotificationKind;
/* @__PURE__ */ (function(NotificationKind2) {
  NotificationKind2["NEXT"] = "N";
  NotificationKind2["ERROR"] = "E";
  NotificationKind2["COMPLETE"] = "C";
})(NotificationKind || (NotificationKind = {}));
var Notification = /* @__PURE__ */ function() {
  function Notification2(kind, value, error) {
    this.kind = kind;
    this.value = value;
    this.error = error;
    this.hasValue = kind === "N";
  }
  Notification2.prototype.observe = function(observer) {
    switch (this.kind) {
      case "N":
        return observer.next && observer.next(this.value);
      case "E":
        return observer.error && observer.error(this.error);
      case "C":
        return observer.complete && observer.complete();
    }
  };
  Notification2.prototype.do = function(next, error, complete) {
    var kind = this.kind;
    switch (kind) {
      case "N":
        return next && next(this.value);
      case "E":
        return error && error(this.error);
      case "C":
        return complete && complete();
    }
  };
  Notification2.prototype.accept = function(nextOrObserver, error, complete) {
    if (nextOrObserver && typeof nextOrObserver.next === "function") {
      return this.observe(nextOrObserver);
    } else {
      return this.do(nextOrObserver, error, complete);
    }
  };
  Notification2.prototype.toObservable = function() {
    var kind = this.kind;
    switch (kind) {
      case "N":
        return of(this.value);
      case "E":
        return throwError(this.error);
      case "C":
        return empty();
    }
    throw new Error("unexpected notification kind value");
  };
  Notification2.createNext = function(value) {
    if (typeof value !== "undefined") {
      return new Notification2("N", value);
    }
    return Notification2.undefinedValueNotification;
  };
  Notification2.createError = function(err) {
    return new Notification2("E", void 0, err);
  };
  Notification2.createComplete = function() {
    return Notification2.completeNotification;
  };
  Notification2.completeNotification = new Notification2("C");
  Notification2.undefinedValueNotification = new Notification2("N", void 0);
  return Notification2;
}();
function observeOn(scheduler, delay2) {
  if (delay2 === void 0) {
    delay2 = 0;
  }
  return function observeOnOperatorFunction(source) {
    return source.lift(new ObserveOnOperator(scheduler, delay2));
  };
}
var ObserveOnOperator = /* @__PURE__ */ function() {
  function ObserveOnOperator2(scheduler, delay2) {
    if (delay2 === void 0) {
      delay2 = 0;
    }
    this.scheduler = scheduler;
    this.delay = delay2;
  }
  ObserveOnOperator2.prototype.call = function(subscriber, source) {
    return source.subscribe(new ObserveOnSubscriber(subscriber, this.scheduler, this.delay));
  };
  return ObserveOnOperator2;
}();
var ObserveOnSubscriber = /* @__PURE__ */ function(_super) {
  __extends(ObserveOnSubscriber2, _super);
  function ObserveOnSubscriber2(destination, scheduler, delay2) {
    if (delay2 === void 0) {
      delay2 = 0;
    }
    var _this = _super.call(this, destination) || this;
    _this.scheduler = scheduler;
    _this.delay = delay2;
    return _this;
  }
  ObserveOnSubscriber2.dispatch = function(arg) {
    var notification = arg.notification, destination = arg.destination;
    notification.observe(destination);
    this.unsubscribe();
  };
  ObserveOnSubscriber2.prototype.scheduleMessage = function(notification) {
    var destination = this.destination;
    destination.add(this.scheduler.schedule(ObserveOnSubscriber2.dispatch, this.delay, new ObserveOnMessage(notification, this.destination)));
  };
  ObserveOnSubscriber2.prototype._next = function(value) {
    this.scheduleMessage(Notification.createNext(value));
  };
  ObserveOnSubscriber2.prototype._error = function(err) {
    this.scheduleMessage(Notification.createError(err));
    this.unsubscribe();
  };
  ObserveOnSubscriber2.prototype._complete = function() {
    this.scheduleMessage(Notification.createComplete());
    this.unsubscribe();
  };
  return ObserveOnSubscriber2;
}(Subscriber);
var ObserveOnMessage = /* @__PURE__ */ function() {
  function ObserveOnMessage2(notification, destination) {
    this.notification = notification;
    this.destination = destination;
  }
  return ObserveOnMessage2;
}();
var ReplaySubject = /* @__PURE__ */ function(_super) {
  __extends(ReplaySubject2, _super);
  function ReplaySubject2(bufferSize, windowTime2, scheduler) {
    if (bufferSize === void 0) {
      bufferSize = Number.POSITIVE_INFINITY;
    }
    if (windowTime2 === void 0) {
      windowTime2 = Number.POSITIVE_INFINITY;
    }
    var _this = _super.call(this) || this;
    _this.scheduler = scheduler;
    _this._events = [];
    _this._infiniteTimeWindow = false;
    _this._bufferSize = bufferSize < 1 ? 1 : bufferSize;
    _this._windowTime = windowTime2 < 1 ? 1 : windowTime2;
    if (windowTime2 === Number.POSITIVE_INFINITY) {
      _this._infiniteTimeWindow = true;
      _this.next = _this.nextInfiniteTimeWindow;
    } else {
      _this.next = _this.nextTimeWindow;
    }
    return _this;
  }
  ReplaySubject2.prototype.nextInfiniteTimeWindow = function(value) {
    if (!this.isStopped) {
      var _events = this._events;
      _events.push(value);
      if (_events.length > this._bufferSize) {
        _events.shift();
      }
    }
    _super.prototype.next.call(this, value);
  };
  ReplaySubject2.prototype.nextTimeWindow = function(value) {
    if (!this.isStopped) {
      this._events.push(new ReplayEvent(this._getNow(), value));
      this._trimBufferThenGetEvents();
    }
    _super.prototype.next.call(this, value);
  };
  ReplaySubject2.prototype._subscribe = function(subscriber) {
    var _infiniteTimeWindow = this._infiniteTimeWindow;
    var _events = _infiniteTimeWindow ? this._events : this._trimBufferThenGetEvents();
    var scheduler = this.scheduler;
    var len = _events.length;
    var subscription;
    if (this.closed) {
      throw new ObjectUnsubscribedError();
    } else if (this.isStopped || this.hasError) {
      subscription = Subscription.EMPTY;
    } else {
      this.observers.push(subscriber);
      subscription = new SubjectSubscription(this, subscriber);
    }
    if (scheduler) {
      subscriber.add(subscriber = new ObserveOnSubscriber(subscriber, scheduler));
    }
    if (_infiniteTimeWindow) {
      for (var i = 0; i < len && !subscriber.closed; i++) {
        subscriber.next(_events[i]);
      }
    } else {
      for (var i = 0; i < len && !subscriber.closed; i++) {
        subscriber.next(_events[i].value);
      }
    }
    if (this.hasError) {
      subscriber.error(this.thrownError);
    } else if (this.isStopped) {
      subscriber.complete();
    }
    return subscription;
  };
  ReplaySubject2.prototype._getNow = function() {
    return (this.scheduler || queue).now();
  };
  ReplaySubject2.prototype._trimBufferThenGetEvents = function() {
    var now = this._getNow();
    var _bufferSize = this._bufferSize;
    var _windowTime = this._windowTime;
    var _events = this._events;
    var eventsCount = _events.length;
    var spliceCount = 0;
    while (spliceCount < eventsCount) {
      if (now - _events[spliceCount].time < _windowTime) {
        break;
      }
      spliceCount++;
    }
    if (eventsCount > _bufferSize) {
      spliceCount = Math.max(spliceCount, eventsCount - _bufferSize);
    }
    if (spliceCount > 0) {
      _events.splice(0, spliceCount);
    }
    return _events;
  };
  return ReplaySubject2;
}(Subject);
var ReplayEvent = /* @__PURE__ */ function() {
  function ReplayEvent2(time, value) {
    this.time = time;
    this.value = value;
  }
  return ReplayEvent2;
}();
var AsyncSubject = /* @__PURE__ */ function(_super) {
  __extends(AsyncSubject2, _super);
  function AsyncSubject2() {
    var _this = _super !== null && _super.apply(this, arguments) || this;
    _this.value = null;
    _this.hasNext = false;
    _this.hasCompleted = false;
    return _this;
  }
  AsyncSubject2.prototype._subscribe = function(subscriber) {
    if (this.hasError) {
      subscriber.error(this.thrownError);
      return Subscription.EMPTY;
    } else if (this.hasCompleted && this.hasNext) {
      subscriber.next(this.value);
      subscriber.complete();
      return Subscription.EMPTY;
    }
    return _super.prototype._subscribe.call(this, subscriber);
  };
  AsyncSubject2.prototype.next = function(value) {
    if (!this.hasCompleted) {
      this.value = value;
      this.hasNext = true;
    }
  };
  AsyncSubject2.prototype.error = function(error) {
    if (!this.hasCompleted) {
      _super.prototype.error.call(this, error);
    }
  };
  AsyncSubject2.prototype.complete = function() {
    this.hasCompleted = true;
    if (this.hasNext) {
      _super.prototype.next.call(this, this.value);
    }
    _super.prototype.complete.call(this);
  };
  return AsyncSubject2;
}(Subject);
var nextHandle = 1;
var RESOLVED = /* @__PURE__ */ function() {
  return /* @__PURE__ */ Promise.resolve();
}();
var activeHandles = {};
function findAndClearHandle(handle) {
  if (handle in activeHandles) {
    delete activeHandles[handle];
    return true;
  }
  return false;
}
var Immediate = {
  setImmediate: function(cb) {
    var handle = nextHandle++;
    activeHandles[handle] = true;
    RESOLVED.then(function() {
      return findAndClearHandle(handle) && cb();
    });
    return handle;
  },
  clearImmediate: function(handle) {
    findAndClearHandle(handle);
  }
};
var AsapAction = /* @__PURE__ */ function(_super) {
  __extends(AsapAction2, _super);
  function AsapAction2(scheduler, work) {
    var _this = _super.call(this, scheduler, work) || this;
    _this.scheduler = scheduler;
    _this.work = work;
    return _this;
  }
  AsapAction2.prototype.requestAsyncId = function(scheduler, id, delay2) {
    if (delay2 === void 0) {
      delay2 = 0;
    }
    if (delay2 !== null && delay2 > 0) {
      return _super.prototype.requestAsyncId.call(this, scheduler, id, delay2);
    }
    scheduler.actions.push(this);
    return scheduler.scheduled || (scheduler.scheduled = Immediate.setImmediate(scheduler.flush.bind(scheduler, null)));
  };
  AsapAction2.prototype.recycleAsyncId = function(scheduler, id, delay2) {
    if (delay2 === void 0) {
      delay2 = 0;
    }
    if (delay2 !== null && delay2 > 0 || delay2 === null && this.delay > 0) {
      return _super.prototype.recycleAsyncId.call(this, scheduler, id, delay2);
    }
    if (scheduler.actions.length === 0) {
      Immediate.clearImmediate(id);
      scheduler.scheduled = void 0;
    }
    return void 0;
  };
  return AsapAction2;
}(AsyncAction);
var AsapScheduler = /* @__PURE__ */ function(_super) {
  __extends(AsapScheduler2, _super);
  function AsapScheduler2() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  AsapScheduler2.prototype.flush = function(action) {
    this.active = true;
    this.scheduled = void 0;
    var actions = this.actions;
    var error;
    var index2 = -1;
    var count2 = actions.length;
    action = action || actions.shift();
    do {
      if (error = action.execute(action.state, action.delay)) {
        break;
      }
    } while (++index2 < count2 && (action = actions.shift()));
    this.active = false;
    if (error) {
      while (++index2 < count2 && (action = actions.shift())) {
        action.unsubscribe();
      }
      throw error;
    }
  };
  return AsapScheduler2;
}(AsyncScheduler);
var asapScheduler = /* @__PURE__ */ new AsapScheduler(AsapAction);
var asap = asapScheduler;
var AnimationFrameAction = /* @__PURE__ */ function(_super) {
  __extends(AnimationFrameAction2, _super);
  function AnimationFrameAction2(scheduler, work) {
    var _this = _super.call(this, scheduler, work) || this;
    _this.scheduler = scheduler;
    _this.work = work;
    return _this;
  }
  AnimationFrameAction2.prototype.requestAsyncId = function(scheduler, id, delay2) {
    if (delay2 === void 0) {
      delay2 = 0;
    }
    if (delay2 !== null && delay2 > 0) {
      return _super.prototype.requestAsyncId.call(this, scheduler, id, delay2);
    }
    scheduler.actions.push(this);
    return scheduler.scheduled || (scheduler.scheduled = requestAnimationFrame(function() {
      return scheduler.flush(null);
    }));
  };
  AnimationFrameAction2.prototype.recycleAsyncId = function(scheduler, id, delay2) {
    if (delay2 === void 0) {
      delay2 = 0;
    }
    if (delay2 !== null && delay2 > 0 || delay2 === null && this.delay > 0) {
      return _super.prototype.recycleAsyncId.call(this, scheduler, id, delay2);
    }
    if (scheduler.actions.length === 0) {
      cancelAnimationFrame(id);
      scheduler.scheduled = void 0;
    }
    return void 0;
  };
  return AnimationFrameAction2;
}(AsyncAction);
var AnimationFrameScheduler = /* @__PURE__ */ function(_super) {
  __extends(AnimationFrameScheduler2, _super);
  function AnimationFrameScheduler2() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  AnimationFrameScheduler2.prototype.flush = function(action) {
    this.active = true;
    this.scheduled = void 0;
    var actions = this.actions;
    var error;
    var index2 = -1;
    var count2 = actions.length;
    action = action || actions.shift();
    do {
      if (error = action.execute(action.state, action.delay)) {
        break;
      }
    } while (++index2 < count2 && (action = actions.shift()));
    this.active = false;
    if (error) {
      while (++index2 < count2 && (action = actions.shift())) {
        action.unsubscribe();
      }
      throw error;
    }
  };
  return AnimationFrameScheduler2;
}(AsyncScheduler);
var animationFrameScheduler = /* @__PURE__ */ new AnimationFrameScheduler(AnimationFrameAction);
var animationFrame = animationFrameScheduler;
var VirtualTimeScheduler = /* @__PURE__ */ function(_super) {
  __extends(VirtualTimeScheduler2, _super);
  function VirtualTimeScheduler2(SchedulerAction, maxFrames) {
    if (SchedulerAction === void 0) {
      SchedulerAction = VirtualAction;
    }
    if (maxFrames === void 0) {
      maxFrames = Number.POSITIVE_INFINITY;
    }
    var _this = _super.call(this, SchedulerAction, function() {
      return _this.frame;
    }) || this;
    _this.maxFrames = maxFrames;
    _this.frame = 0;
    _this.index = -1;
    return _this;
  }
  VirtualTimeScheduler2.prototype.flush = function() {
    var _a = this, actions = _a.actions, maxFrames = _a.maxFrames;
    var error, action;
    while ((action = actions[0]) && action.delay <= maxFrames) {
      actions.shift();
      this.frame = action.delay;
      if (error = action.execute(action.state, action.delay)) {
        break;
      }
    }
    if (error) {
      while (action = actions.shift()) {
        action.unsubscribe();
      }
      throw error;
    }
  };
  VirtualTimeScheduler2.frameTimeFactor = 10;
  return VirtualTimeScheduler2;
}(AsyncScheduler);
var VirtualAction = /* @__PURE__ */ function(_super) {
  __extends(VirtualAction2, _super);
  function VirtualAction2(scheduler, work, index2) {
    if (index2 === void 0) {
      index2 = scheduler.index += 1;
    }
    var _this = _super.call(this, scheduler, work) || this;
    _this.scheduler = scheduler;
    _this.work = work;
    _this.index = index2;
    _this.active = true;
    _this.index = scheduler.index = index2;
    return _this;
  }
  VirtualAction2.prototype.schedule = function(state, delay2) {
    if (delay2 === void 0) {
      delay2 = 0;
    }
    if (!this.id) {
      return _super.prototype.schedule.call(this, state, delay2);
    }
    this.active = false;
    var action = new VirtualAction2(this.scheduler, this.work);
    this.add(action);
    return action.schedule(state, delay2);
  };
  VirtualAction2.prototype.requestAsyncId = function(scheduler, id, delay2) {
    if (delay2 === void 0) {
      delay2 = 0;
    }
    this.delay = scheduler.frame + delay2;
    var actions = scheduler.actions;
    actions.push(this);
    actions.sort(VirtualAction2.sortActions);
    return true;
  };
  VirtualAction2.prototype.recycleAsyncId = function(scheduler, id, delay2) {
    return void 0;
  };
  VirtualAction2.prototype._execute = function(state, delay2) {
    if (this.active === true) {
      return _super.prototype._execute.call(this, state, delay2);
    }
  };
  VirtualAction2.sortActions = function(a2, b2) {
    if (a2.delay === b2.delay) {
      if (a2.index === b2.index) {
        return 0;
      } else if (a2.index > b2.index) {
        return 1;
      } else {
        return -1;
      }
    } else if (a2.delay > b2.delay) {
      return 1;
    } else {
      return -1;
    }
  };
  return VirtualAction2;
}(AsyncAction);
function noop$1() {
}
function isObservable(obj) {
  return !!obj && (obj instanceof Observable || typeof obj.lift === "function" && typeof obj.subscribe === "function");
}
var ArgumentOutOfRangeErrorImpl = /* @__PURE__ */ function() {
  function ArgumentOutOfRangeErrorImpl2() {
    Error.call(this);
    this.message = "argument out of range";
    this.name = "ArgumentOutOfRangeError";
    return this;
  }
  ArgumentOutOfRangeErrorImpl2.prototype = /* @__PURE__ */ Object.create(Error.prototype);
  return ArgumentOutOfRangeErrorImpl2;
}();
var ArgumentOutOfRangeError = ArgumentOutOfRangeErrorImpl;
var EmptyErrorImpl = /* @__PURE__ */ function() {
  function EmptyErrorImpl2() {
    Error.call(this);
    this.message = "no elements in sequence";
    this.name = "EmptyError";
    return this;
  }
  EmptyErrorImpl2.prototype = /* @__PURE__ */ Object.create(Error.prototype);
  return EmptyErrorImpl2;
}();
var EmptyError = EmptyErrorImpl;
var TimeoutErrorImpl = /* @__PURE__ */ function() {
  function TimeoutErrorImpl2() {
    Error.call(this);
    this.message = "Timeout has occurred";
    this.name = "TimeoutError";
    return this;
  }
  TimeoutErrorImpl2.prototype = /* @__PURE__ */ Object.create(Error.prototype);
  return TimeoutErrorImpl2;
}();
var TimeoutError = TimeoutErrorImpl;
function bindCallback(callbackFunc, resultSelector, scheduler) {
  if (resultSelector) {
    if (isScheduler(resultSelector)) {
      scheduler = resultSelector;
    } else {
      return function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        return bindCallback(callbackFunc, scheduler).apply(void 0, args).pipe(map(function(args2) {
          return isArray$5(args2) ? resultSelector.apply(void 0, args2) : resultSelector(args2);
        }));
      };
    }
  }
  return function() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    var context = this;
    var subject;
    var params = {
      context,
      subject,
      callbackFunc,
      scheduler
    };
    return new Observable(function(subscriber) {
      if (!scheduler) {
        if (!subject) {
          subject = new AsyncSubject();
          var handler = function() {
            var innerArgs = [];
            for (var _i2 = 0; _i2 < arguments.length; _i2++) {
              innerArgs[_i2] = arguments[_i2];
            }
            subject.next(innerArgs.length <= 1 ? innerArgs[0] : innerArgs);
            subject.complete();
          };
          try {
            callbackFunc.apply(context, args.concat([handler]));
          } catch (err) {
            if (canReportError(subject)) {
              subject.error(err);
            } else {
              console.warn(err);
            }
          }
        }
        return subject.subscribe(subscriber);
      } else {
        var state = {
          args,
          subscriber,
          params
        };
        return scheduler.schedule(dispatch$5, 0, state);
      }
    });
  };
}
function dispatch$5(state) {
  var _this = this;
  var args = state.args, subscriber = state.subscriber, params = state.params;
  var callbackFunc = params.callbackFunc, context = params.context, scheduler = params.scheduler;
  var subject = params.subject;
  if (!subject) {
    subject = params.subject = new AsyncSubject();
    var handler = function() {
      var innerArgs = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        innerArgs[_i] = arguments[_i];
      }
      var value = innerArgs.length <= 1 ? innerArgs[0] : innerArgs;
      _this.add(scheduler.schedule(dispatchNext$3, 0, { value, subject }));
    };
    try {
      callbackFunc.apply(context, args.concat([handler]));
    } catch (err) {
      subject.error(err);
    }
  }
  this.add(subject.subscribe(subscriber));
}
function dispatchNext$3(state) {
  var value = state.value, subject = state.subject;
  subject.next(value);
  subject.complete();
}
function bindNodeCallback(callbackFunc, resultSelector, scheduler) {
  if (resultSelector) {
    if (isScheduler(resultSelector)) {
      scheduler = resultSelector;
    } else {
      return function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        return bindNodeCallback(callbackFunc, scheduler).apply(void 0, args).pipe(map(function(args2) {
          return isArray$5(args2) ? resultSelector.apply(void 0, args2) : resultSelector(args2);
        }));
      };
    }
  }
  return function() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    var params = {
      subject: void 0,
      args,
      callbackFunc,
      scheduler,
      context: this
    };
    return new Observable(function(subscriber) {
      var context = params.context;
      var subject = params.subject;
      if (!scheduler) {
        if (!subject) {
          subject = params.subject = new AsyncSubject();
          var handler = function() {
            var innerArgs = [];
            for (var _i2 = 0; _i2 < arguments.length; _i2++) {
              innerArgs[_i2] = arguments[_i2];
            }
            var err = innerArgs.shift();
            if (err) {
              subject.error(err);
              return;
            }
            subject.next(innerArgs.length <= 1 ? innerArgs[0] : innerArgs);
            subject.complete();
          };
          try {
            callbackFunc.apply(context, args.concat([handler]));
          } catch (err) {
            if (canReportError(subject)) {
              subject.error(err);
            } else {
              console.warn(err);
            }
          }
        }
        return subject.subscribe(subscriber);
      } else {
        return scheduler.schedule(dispatch$4, 0, { params, subscriber, context });
      }
    });
  };
}
function dispatch$4(state) {
  var _this = this;
  var params = state.params, subscriber = state.subscriber, context = state.context;
  var callbackFunc = params.callbackFunc, args = params.args, scheduler = params.scheduler;
  var subject = params.subject;
  if (!subject) {
    subject = params.subject = new AsyncSubject();
    var handler = function() {
      var innerArgs = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        innerArgs[_i] = arguments[_i];
      }
      var err = innerArgs.shift();
      if (err) {
        _this.add(scheduler.schedule(dispatchError, 0, { err, subject }));
      } else {
        var value = innerArgs.length <= 1 ? innerArgs[0] : innerArgs;
        _this.add(scheduler.schedule(dispatchNext$2, 0, { value, subject }));
      }
    };
    try {
      callbackFunc.apply(context, args.concat([handler]));
    } catch (err) {
      this.add(scheduler.schedule(dispatchError, 0, { err, subject }));
    }
  }
  this.add(subject.subscribe(subscriber));
}
function dispatchNext$2(arg) {
  var value = arg.value, subject = arg.subject;
  subject.next(value);
  subject.complete();
}
function dispatchError(arg) {
  var err = arg.err, subject = arg.subject;
  subject.error(err);
}
var OuterSubscriber = /* @__PURE__ */ function(_super) {
  __extends(OuterSubscriber2, _super);
  function OuterSubscriber2() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  OuterSubscriber2.prototype.notifyNext = function(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
    this.destination.next(innerValue);
  };
  OuterSubscriber2.prototype.notifyError = function(error, innerSub) {
    this.destination.error(error);
  };
  OuterSubscriber2.prototype.notifyComplete = function(innerSub) {
    this.destination.complete();
  };
  return OuterSubscriber2;
}(Subscriber);
var InnerSubscriber = /* @__PURE__ */ function(_super) {
  __extends(InnerSubscriber2, _super);
  function InnerSubscriber2(parent, outerValue, outerIndex) {
    var _this = _super.call(this) || this;
    _this.parent = parent;
    _this.outerValue = outerValue;
    _this.outerIndex = outerIndex;
    _this.index = 0;
    return _this;
  }
  InnerSubscriber2.prototype._next = function(value) {
    this.parent.notifyNext(this.outerValue, value, this.outerIndex, this.index++, this);
  };
  InnerSubscriber2.prototype._error = function(error) {
    this.parent.notifyError(error, this);
    this.unsubscribe();
  };
  InnerSubscriber2.prototype._complete = function() {
    this.parent.notifyComplete(this);
    this.unsubscribe();
  };
  return InnerSubscriber2;
}(Subscriber);
function subscribeToResult(outerSubscriber, result, outerValue, outerIndex, innerSubscriber) {
  if (innerSubscriber === void 0) {
    innerSubscriber = new InnerSubscriber(outerSubscriber, outerValue, outerIndex);
  }
  if (innerSubscriber.closed) {
    return void 0;
  }
  if (result instanceof Observable) {
    return result.subscribe(innerSubscriber);
  }
  return subscribeTo(result)(innerSubscriber);
}
var NONE = {};
function combineLatest$1() {
  var observables = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    observables[_i] = arguments[_i];
  }
  var resultSelector = void 0;
  var scheduler = void 0;
  if (isScheduler(observables[observables.length - 1])) {
    scheduler = observables.pop();
  }
  if (typeof observables[observables.length - 1] === "function") {
    resultSelector = observables.pop();
  }
  if (observables.length === 1 && isArray$5(observables[0])) {
    observables = observables[0];
  }
  return fromArray(observables, scheduler).lift(new CombineLatestOperator(resultSelector));
}
var CombineLatestOperator = /* @__PURE__ */ function() {
  function CombineLatestOperator2(resultSelector) {
    this.resultSelector = resultSelector;
  }
  CombineLatestOperator2.prototype.call = function(subscriber, source) {
    return source.subscribe(new CombineLatestSubscriber(subscriber, this.resultSelector));
  };
  return CombineLatestOperator2;
}();
var CombineLatestSubscriber = /* @__PURE__ */ function(_super) {
  __extends(CombineLatestSubscriber2, _super);
  function CombineLatestSubscriber2(destination, resultSelector) {
    var _this = _super.call(this, destination) || this;
    _this.resultSelector = resultSelector;
    _this.active = 0;
    _this.values = [];
    _this.observables = [];
    return _this;
  }
  CombineLatestSubscriber2.prototype._next = function(observable2) {
    this.values.push(NONE);
    this.observables.push(observable2);
  };
  CombineLatestSubscriber2.prototype._complete = function() {
    var observables = this.observables;
    var len = observables.length;
    if (len === 0) {
      this.destination.complete();
    } else {
      this.active = len;
      this.toRespond = len;
      for (var i = 0; i < len; i++) {
        var observable2 = observables[i];
        this.add(subscribeToResult(this, observable2, void 0, i));
      }
    }
  };
  CombineLatestSubscriber2.prototype.notifyComplete = function(unused) {
    if ((this.active -= 1) === 0) {
      this.destination.complete();
    }
  };
  CombineLatestSubscriber2.prototype.notifyNext = function(_outerValue, innerValue, outerIndex) {
    var values = this.values;
    var oldVal = values[outerIndex];
    var toRespond = !this.toRespond ? 0 : oldVal === NONE ? --this.toRespond : this.toRespond;
    values[outerIndex] = innerValue;
    if (toRespond === 0) {
      if (this.resultSelector) {
        this._tryResultSelector(values);
      } else {
        this.destination.next(values.slice());
      }
    }
  };
  CombineLatestSubscriber2.prototype._tryResultSelector = function(values) {
    var result;
    try {
      result = this.resultSelector.apply(this, values);
    } catch (err) {
      this.destination.error(err);
      return;
    }
    this.destination.next(result);
  };
  return CombineLatestSubscriber2;
}(OuterSubscriber);
function concatAll() {
  return mergeAll(1);
}
function concat$1() {
  var observables = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    observables[_i] = arguments[_i];
  }
  return concatAll()(of.apply(void 0, observables));
}
function defer(observableFactory) {
  return new Observable(function(subscriber) {
    var input;
    try {
      input = observableFactory();
    } catch (err) {
      subscriber.error(err);
      return void 0;
    }
    var source = input ? from(input) : empty();
    return source.subscribe(subscriber);
  });
}
function forkJoin() {
  var sources = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    sources[_i] = arguments[_i];
  }
  if (sources.length === 1) {
    var first_1 = sources[0];
    if (isArray$5(first_1)) {
      return forkJoinInternal(first_1, null);
    }
    if (isObject(first_1) && Object.getPrototypeOf(first_1) === Object.prototype) {
      var keys = Object.keys(first_1);
      return forkJoinInternal(keys.map(function(key) {
        return first_1[key];
      }), keys);
    }
  }
  if (typeof sources[sources.length - 1] === "function") {
    var resultSelector_1 = sources.pop();
    sources = sources.length === 1 && isArray$5(sources[0]) ? sources[0] : sources;
    return forkJoinInternal(sources, null).pipe(map(function(args) {
      return resultSelector_1.apply(void 0, args);
    }));
  }
  return forkJoinInternal(sources, null);
}
function forkJoinInternal(sources, keys) {
  return new Observable(function(subscriber) {
    var len = sources.length;
    if (len === 0) {
      subscriber.complete();
      return;
    }
    var values = new Array(len);
    var completed = 0;
    var emitted = 0;
    var _loop_1 = function(i2) {
      var source = from(sources[i2]);
      var hasValue = false;
      subscriber.add(source.subscribe({
        next: function(value) {
          if (!hasValue) {
            hasValue = true;
            emitted++;
          }
          values[i2] = value;
        },
        error: function(err) {
          return subscriber.error(err);
        },
        complete: function() {
          completed++;
          if (completed === len || !hasValue) {
            if (emitted === len) {
              subscriber.next(keys ? keys.reduce(function(result, key, i3) {
                return result[key] = values[i3], result;
              }, {}) : values);
            }
            subscriber.complete();
          }
        }
      }));
    };
    for (var i = 0; i < len; i++) {
      _loop_1(i);
    }
  });
}
function fromEventPattern(addHandler, removeHandler, resultSelector) {
  if (resultSelector) {
    return fromEventPattern(addHandler, removeHandler).pipe(map(function(args) {
      return isArray$5(args) ? resultSelector.apply(void 0, args) : resultSelector(args);
    }));
  }
  return new Observable(function(subscriber) {
    var handler = function() {
      var e2 = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        e2[_i] = arguments[_i];
      }
      return subscriber.next(e2.length === 1 ? e2[0] : e2);
    };
    var retValue;
    try {
      retValue = addHandler(handler);
    } catch (err) {
      subscriber.error(err);
      return void 0;
    }
    if (!isFunction(removeHandler)) {
      return void 0;
    }
    return function() {
      return removeHandler(handler, retValue);
    };
  });
}
function generate(initialStateOrOptions, condition, iterate, resultSelectorOrObservable, scheduler) {
  var resultSelector;
  var initialState;
  if (arguments.length == 1) {
    var options = initialStateOrOptions;
    initialState = options.initialState;
    condition = options.condition;
    iterate = options.iterate;
    resultSelector = options.resultSelector || identity;
    scheduler = options.scheduler;
  } else if (resultSelectorOrObservable === void 0 || isScheduler(resultSelectorOrObservable)) {
    initialState = initialStateOrOptions;
    resultSelector = identity;
    scheduler = resultSelectorOrObservable;
  } else {
    initialState = initialStateOrOptions;
    resultSelector = resultSelectorOrObservable;
  }
  return new Observable(function(subscriber) {
    var state = initialState;
    if (scheduler) {
      return scheduler.schedule(dispatch$3, 0, {
        subscriber,
        iterate,
        condition,
        resultSelector,
        state
      });
    }
    do {
      if (condition) {
        var conditionResult = void 0;
        try {
          conditionResult = condition(state);
        } catch (err) {
          subscriber.error(err);
          return void 0;
        }
        if (!conditionResult) {
          subscriber.complete();
          break;
        }
      }
      var value = void 0;
      try {
        value = resultSelector(state);
      } catch (err) {
        subscriber.error(err);
        return void 0;
      }
      subscriber.next(value);
      if (subscriber.closed) {
        break;
      }
      try {
        state = iterate(state);
      } catch (err) {
        subscriber.error(err);
        return void 0;
      }
    } while (true);
    return void 0;
  });
}
function dispatch$3(state) {
  var subscriber = state.subscriber, condition = state.condition;
  if (subscriber.closed) {
    return void 0;
  }
  if (state.needIterate) {
    try {
      state.state = state.iterate(state.state);
    } catch (err) {
      subscriber.error(err);
      return void 0;
    }
  } else {
    state.needIterate = true;
  }
  if (condition) {
    var conditionResult = void 0;
    try {
      conditionResult = condition(state.state);
    } catch (err) {
      subscriber.error(err);
      return void 0;
    }
    if (!conditionResult) {
      subscriber.complete();
      return void 0;
    }
    if (subscriber.closed) {
      return void 0;
    }
  }
  var value;
  try {
    value = state.resultSelector(state.state);
  } catch (err) {
    subscriber.error(err);
    return void 0;
  }
  if (subscriber.closed) {
    return void 0;
  }
  subscriber.next(value);
  if (subscriber.closed) {
    return void 0;
  }
  return this.schedule(state);
}
function iif(condition, trueResult, falseResult) {
  if (trueResult === void 0) {
    trueResult = EMPTY;
  }
  if (falseResult === void 0) {
    falseResult = EMPTY;
  }
  return defer(function() {
    return condition() ? trueResult : falseResult;
  });
}
function interval(period, scheduler) {
  if (period === void 0) {
    period = 0;
  }
  if (scheduler === void 0) {
    scheduler = async;
  }
  if (!isNumeric(period) || period < 0) {
    period = 0;
  }
  if (!scheduler || typeof scheduler.schedule !== "function") {
    scheduler = async;
  }
  return new Observable(function(subscriber) {
    subscriber.add(scheduler.schedule(dispatch$2, period, { subscriber, counter: 0, period }));
    return subscriber;
  });
}
function dispatch$2(state) {
  var subscriber = state.subscriber, counter = state.counter, period = state.period;
  subscriber.next(counter);
  this.schedule({ subscriber, counter: counter + 1, period }, period);
}
var NEVER = /* @__PURE__ */ new Observable(noop$1);
function never() {
  return NEVER;
}
function onErrorResumeNext$1() {
  var sources = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    sources[_i] = arguments[_i];
  }
  if (sources.length === 0) {
    return EMPTY;
  }
  var first2 = sources[0], remainder = sources.slice(1);
  if (sources.length === 1 && isArray$5(first2)) {
    return onErrorResumeNext$1.apply(void 0, first2);
  }
  return new Observable(function(subscriber) {
    var subNext = function() {
      return subscriber.add(onErrorResumeNext$1.apply(void 0, remainder).subscribe(subscriber));
    };
    return from(first2).subscribe({
      next: function(value) {
        subscriber.next(value);
      },
      error: subNext,
      complete: subNext
    });
  });
}
function pairs(obj, scheduler) {
  if (!scheduler) {
    return new Observable(function(subscriber) {
      var keys = Object.keys(obj);
      for (var i = 0; i < keys.length && !subscriber.closed; i++) {
        var key = keys[i];
        if (obj.hasOwnProperty(key)) {
          subscriber.next([key, obj[key]]);
        }
      }
      subscriber.complete();
    });
  } else {
    return new Observable(function(subscriber) {
      var keys = Object.keys(obj);
      var subscription = new Subscription();
      subscription.add(scheduler.schedule(dispatch$1, 0, { keys, index: 0, subscriber, subscription, obj }));
      return subscription;
    });
  }
}
function dispatch$1(state) {
  var keys = state.keys, index2 = state.index, subscriber = state.subscriber, subscription = state.subscription, obj = state.obj;
  if (!subscriber.closed) {
    if (index2 < keys.length) {
      var key = keys[index2];
      subscriber.next([key, obj[key]]);
      subscription.add(this.schedule({ keys, index: index2 + 1, subscriber, subscription, obj }));
    } else {
      subscriber.complete();
    }
  }
}
function not(pred, thisArg) {
  function notPred() {
    return !notPred.pred.apply(notPred.thisArg, arguments);
  }
  notPred.pred = pred;
  notPred.thisArg = thisArg;
  return notPred;
}
function filter(predicate, thisArg) {
  return function filterOperatorFunction(source) {
    return source.lift(new FilterOperator(predicate, thisArg));
  };
}
var FilterOperator = /* @__PURE__ */ function() {
  function FilterOperator2(predicate, thisArg) {
    this.predicate = predicate;
    this.thisArg = thisArg;
  }
  FilterOperator2.prototype.call = function(subscriber, source) {
    return source.subscribe(new FilterSubscriber(subscriber, this.predicate, this.thisArg));
  };
  return FilterOperator2;
}();
var FilterSubscriber = /* @__PURE__ */ function(_super) {
  __extends(FilterSubscriber2, _super);
  function FilterSubscriber2(destination, predicate, thisArg) {
    var _this = _super.call(this, destination) || this;
    _this.predicate = predicate;
    _this.thisArg = thisArg;
    _this.count = 0;
    return _this;
  }
  FilterSubscriber2.prototype._next = function(value) {
    var result;
    try {
      result = this.predicate.call(this.thisArg, value, this.count++);
    } catch (err) {
      this.destination.error(err);
      return;
    }
    if (result) {
      this.destination.next(value);
    }
  };
  return FilterSubscriber2;
}(Subscriber);
function partition$1(source, predicate, thisArg) {
  return [
    filter(predicate, thisArg)(new Observable(subscribeTo(source))),
    filter(not(predicate, thisArg))(new Observable(subscribeTo(source)))
  ];
}
function race$1() {
  var observables = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    observables[_i] = arguments[_i];
  }
  if (observables.length === 1) {
    if (isArray$5(observables[0])) {
      observables = observables[0];
    } else {
      return observables[0];
    }
  }
  return fromArray(observables, void 0).lift(new RaceOperator());
}
var RaceOperator = /* @__PURE__ */ function() {
  function RaceOperator2() {
  }
  RaceOperator2.prototype.call = function(subscriber, source) {
    return source.subscribe(new RaceSubscriber(subscriber));
  };
  return RaceOperator2;
}();
var RaceSubscriber = /* @__PURE__ */ function(_super) {
  __extends(RaceSubscriber2, _super);
  function RaceSubscriber2(destination) {
    var _this = _super.call(this, destination) || this;
    _this.hasFirst = false;
    _this.observables = [];
    _this.subscriptions = [];
    return _this;
  }
  RaceSubscriber2.prototype._next = function(observable2) {
    this.observables.push(observable2);
  };
  RaceSubscriber2.prototype._complete = function() {
    var observables = this.observables;
    var len = observables.length;
    if (len === 0) {
      this.destination.complete();
    } else {
      for (var i = 0; i < len && !this.hasFirst; i++) {
        var observable2 = observables[i];
        var subscription = subscribeToResult(this, observable2, void 0, i);
        if (this.subscriptions) {
          this.subscriptions.push(subscription);
        }
        this.add(subscription);
      }
      this.observables = null;
    }
  };
  RaceSubscriber2.prototype.notifyNext = function(_outerValue, innerValue, outerIndex) {
    if (!this.hasFirst) {
      this.hasFirst = true;
      for (var i = 0; i < this.subscriptions.length; i++) {
        if (i !== outerIndex) {
          var subscription = this.subscriptions[i];
          subscription.unsubscribe();
          this.remove(subscription);
        }
      }
      this.subscriptions = null;
    }
    this.destination.next(innerValue);
  };
  return RaceSubscriber2;
}(OuterSubscriber);
function range$1(start, count2, scheduler) {
  if (start === void 0) {
    start = 0;
  }
  return new Observable(function(subscriber) {
    if (count2 === void 0) {
      count2 = start;
      start = 0;
    }
    var index2 = 0;
    var current = start;
    if (scheduler) {
      return scheduler.schedule(dispatch, 0, {
        index: index2,
        count: count2,
        start,
        subscriber
      });
    } else {
      do {
        if (index2++ >= count2) {
          subscriber.complete();
          break;
        }
        subscriber.next(current++);
        if (subscriber.closed) {
          break;
        }
      } while (true);
    }
    return void 0;
  });
}
function dispatch(state) {
  var start = state.start, index2 = state.index, count2 = state.count, subscriber = state.subscriber;
  if (index2 >= count2) {
    subscriber.complete();
    return;
  }
  subscriber.next(start);
  if (subscriber.closed) {
    return;
  }
  state.index = index2 + 1;
  state.start = start + 1;
  this.schedule(state);
}
function using(resourceFactory, observableFactory) {
  return new Observable(function(subscriber) {
    var resource;
    try {
      resource = resourceFactory();
    } catch (err) {
      subscriber.error(err);
      return void 0;
    }
    var result;
    try {
      result = observableFactory(resource);
    } catch (err) {
      subscriber.error(err);
      return void 0;
    }
    var source = result ? from(result) : EMPTY;
    var subscription = source.subscribe(subscriber);
    return function() {
      subscription.unsubscribe();
      if (resource) {
        resource.unsubscribe();
      }
    };
  });
}
function zip$1() {
  var observables = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    observables[_i] = arguments[_i];
  }
  var resultSelector = observables[observables.length - 1];
  if (typeof resultSelector === "function") {
    observables.pop();
  }
  return fromArray(observables, void 0).lift(new ZipOperator(resultSelector));
}
var ZipOperator = /* @__PURE__ */ function() {
  function ZipOperator2(resultSelector) {
    this.resultSelector = resultSelector;
  }
  ZipOperator2.prototype.call = function(subscriber, source) {
    return source.subscribe(new ZipSubscriber(subscriber, this.resultSelector));
  };
  return ZipOperator2;
}();
var ZipSubscriber = /* @__PURE__ */ function(_super) {
  __extends(ZipSubscriber2, _super);
  function ZipSubscriber2(destination, resultSelector, values) {
    var _this = _super.call(this, destination) || this;
    _this.resultSelector = resultSelector;
    _this.iterators = [];
    _this.active = 0;
    _this.resultSelector = typeof resultSelector === "function" ? resultSelector : void 0;
    return _this;
  }
  ZipSubscriber2.prototype._next = function(value) {
    var iterators = this.iterators;
    if (isArray$5(value)) {
      iterators.push(new StaticArrayIterator(value));
    } else if (typeof value[iterator] === "function") {
      iterators.push(new StaticIterator(value[iterator]()));
    } else {
      iterators.push(new ZipBufferIterator(this.destination, this, value));
    }
  };
  ZipSubscriber2.prototype._complete = function() {
    var iterators = this.iterators;
    var len = iterators.length;
    this.unsubscribe();
    if (len === 0) {
      this.destination.complete();
      return;
    }
    this.active = len;
    for (var i = 0; i < len; i++) {
      var iterator2 = iterators[i];
      if (iterator2.stillUnsubscribed) {
        var destination = this.destination;
        destination.add(iterator2.subscribe());
      } else {
        this.active--;
      }
    }
  };
  ZipSubscriber2.prototype.notifyInactive = function() {
    this.active--;
    if (this.active === 0) {
      this.destination.complete();
    }
  };
  ZipSubscriber2.prototype.checkIterators = function() {
    var iterators = this.iterators;
    var len = iterators.length;
    var destination = this.destination;
    for (var i = 0; i < len; i++) {
      var iterator2 = iterators[i];
      if (typeof iterator2.hasValue === "function" && !iterator2.hasValue()) {
        return;
      }
    }
    var shouldComplete = false;
    var args = [];
    for (var i = 0; i < len; i++) {
      var iterator2 = iterators[i];
      var result = iterator2.next();
      if (iterator2.hasCompleted()) {
        shouldComplete = true;
      }
      if (result.done) {
        destination.complete();
        return;
      }
      args.push(result.value);
    }
    if (this.resultSelector) {
      this._tryresultSelector(args);
    } else {
      destination.next(args);
    }
    if (shouldComplete) {
      destination.complete();
    }
  };
  ZipSubscriber2.prototype._tryresultSelector = function(args) {
    var result;
    try {
      result = this.resultSelector.apply(this, args);
    } catch (err) {
      this.destination.error(err);
      return;
    }
    this.destination.next(result);
  };
  return ZipSubscriber2;
}(Subscriber);
var StaticIterator = /* @__PURE__ */ function() {
  function StaticIterator2(iterator2) {
    this.iterator = iterator2;
    this.nextResult = iterator2.next();
  }
  StaticIterator2.prototype.hasValue = function() {
    return true;
  };
  StaticIterator2.prototype.next = function() {
    var result = this.nextResult;
    this.nextResult = this.iterator.next();
    return result;
  };
  StaticIterator2.prototype.hasCompleted = function() {
    var nextResult = this.nextResult;
    return Boolean(nextResult && nextResult.done);
  };
  return StaticIterator2;
}();
var StaticArrayIterator = /* @__PURE__ */ function() {
  function StaticArrayIterator2(array) {
    this.array = array;
    this.index = 0;
    this.length = 0;
    this.length = array.length;
  }
  StaticArrayIterator2.prototype[iterator] = function() {
    return this;
  };
  StaticArrayIterator2.prototype.next = function(value) {
    var i = this.index++;
    var array = this.array;
    return i < this.length ? { value: array[i], done: false } : { value: null, done: true };
  };
  StaticArrayIterator2.prototype.hasValue = function() {
    return this.array.length > this.index;
  };
  StaticArrayIterator2.prototype.hasCompleted = function() {
    return this.array.length === this.index;
  };
  return StaticArrayIterator2;
}();
var ZipBufferIterator = /* @__PURE__ */ function(_super) {
  __extends(ZipBufferIterator2, _super);
  function ZipBufferIterator2(destination, parent, observable2) {
    var _this = _super.call(this, destination) || this;
    _this.parent = parent;
    _this.observable = observable2;
    _this.stillUnsubscribed = true;
    _this.buffer = [];
    _this.isComplete = false;
    return _this;
  }
  ZipBufferIterator2.prototype[iterator] = function() {
    return this;
  };
  ZipBufferIterator2.prototype.next = function() {
    var buffer2 = this.buffer;
    if (buffer2.length === 0 && this.isComplete) {
      return { value: null, done: true };
    } else {
      return { value: buffer2.shift(), done: false };
    }
  };
  ZipBufferIterator2.prototype.hasValue = function() {
    return this.buffer.length > 0;
  };
  ZipBufferIterator2.prototype.hasCompleted = function() {
    return this.buffer.length === 0 && this.isComplete;
  };
  ZipBufferIterator2.prototype.notifyComplete = function() {
    if (this.buffer.length > 0) {
      this.isComplete = true;
      this.parent.notifyInactive();
    } else {
      this.destination.complete();
    }
  };
  ZipBufferIterator2.prototype.notifyNext = function(innerValue) {
    this.buffer.push(innerValue);
    this.parent.checkIterators();
  };
  ZipBufferIterator2.prototype.subscribe = function() {
    return innerSubscribe(this.observable, new SimpleInnerSubscriber(this));
  };
  return ZipBufferIterator2;
}(SimpleOuterSubscriber);
var _esm5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Observable,
  ConnectableObservable,
  GroupedObservable,
  observable,
  Subject,
  BehaviorSubject,
  ReplaySubject,
  AsyncSubject,
  asap,
  asapScheduler,
  async,
  asyncScheduler,
  queue,
  queueScheduler,
  animationFrame,
  animationFrameScheduler,
  VirtualTimeScheduler,
  VirtualAction,
  Scheduler,
  Subscription,
  Subscriber,
  Notification,
  get NotificationKind() {
    return NotificationKind;
  },
  pipe,
  noop: noop$1,
  identity,
  isObservable,
  ArgumentOutOfRangeError,
  EmptyError,
  ObjectUnsubscribedError,
  UnsubscriptionError,
  TimeoutError,
  bindCallback,
  bindNodeCallback,
  combineLatest: combineLatest$1,
  concat: concat$1,
  defer,
  empty,
  forkJoin,
  from,
  fromEvent,
  fromEventPattern,
  generate,
  iif,
  interval,
  merge: merge$2,
  never,
  of,
  onErrorResumeNext: onErrorResumeNext$1,
  pairs,
  partition: partition$1,
  race: race$1,
  range: range$1,
  throwError,
  timer,
  using,
  zip: zip$1,
  scheduled,
  EMPTY,
  NEVER,
  config
}, Symbol.toStringTag, { value: "Module" }));
var dist$2 = {};
var CoinbaseWalletSDK$1 = {};
var walletLogo$1 = {};
Object.defineProperty(walletLogo$1, "__esModule", { value: true });
walletLogo$1.walletLogo = void 0;
const walletLogo = (type, width) => {
  let height;
  switch (type) {
    case "standard":
      height = width;
      return `data:image/svg+xml,%3Csvg width='${width}' height='${height}' viewBox='0 0 1024 1024' fill='none' xmlns='http://www.w3.org/2000/svg'%3E %3Crect width='1024' height='1024' fill='%230052FF'/%3E %3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M152 512C152 710.823 313.177 872 512 872C710.823 872 872 710.823 872 512C872 313.177 710.823 152 512 152C313.177 152 152 313.177 152 512ZM420 396C406.745 396 396 406.745 396 420V604C396 617.255 406.745 628 420 628H604C617.255 628 628 617.255 628 604V420C628 406.745 617.255 396 604 396H420Z' fill='white'/%3E %3C/svg%3E `;
    case "circle":
      height = width;
      return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='0 0 999.81 999.81'%3E%3Cdefs%3E%3Cstyle%3E.cls-1%7Bfill:%230052fe;%7D.cls-2%7Bfill:%23fefefe;%7D.cls-3%7Bfill:%230152fe;%7D%3C/style%3E%3C/defs%3E%3Cpath class='cls-1' d='M655-115.9h56c.83,1.59,2.36.88,3.56,1a478,478,0,0,1,75.06,10.42C891.4-81.76,978.33-32.58,1049.19,44q116.7,126,131.94,297.61c.38,4.14-.34,8.53,1.78,12.45v59c-1.58.84-.91,2.35-1,3.56a482.05,482.05,0,0,1-10.38,74.05c-24,106.72-76.64,196.76-158.83,268.93s-178.18,112.82-287.2,122.6c-4.83.43-9.86-.25-14.51,1.77H654c-1-1.68-2.69-.91-4.06-1a496.89,496.89,0,0,1-105.9-18.59c-93.54-27.42-172.78-77.59-236.91-150.94Q199.34,590.1,184.87,426.58c-.47-5.19.25-10.56-1.77-15.59V355c1.68-1,.91-2.7,1-4.06a498.12,498.12,0,0,1,18.58-105.9c26-88.75,72.64-164.9,140.6-227.57q126-116.27,297.21-131.61C645.32-114.57,650.35-113.88,655-115.9Zm377.92,500c0-192.44-156.31-349.49-347.56-350.15-194.13-.68-350.94,155.13-352.29,347.42-1.37,194.55,155.51,352.1,348.56,352.47C876.15,734.23,1032.93,577.84,1032.93,384.11Z' transform='translate(-183.1 115.9)'/%3E%3Cpath class='cls-2' d='M1032.93,384.11c0,193.73-156.78,350.12-351.29,349.74-193-.37-349.93-157.92-348.56-352.47C334.43,189.09,491.24,33.28,685.37,34,876.62,34.62,1032.94,191.67,1032.93,384.11ZM683,496.81q43.74,0,87.48,0c15.55,0,25.32-9.72,25.33-25.21q0-87.48,0-175c0-15.83-9.68-25.46-25.59-25.46H595.77c-15.88,0-25.57,9.64-25.58,25.46q0,87.23,0,174.45c0,16.18,9.59,25.7,25.84,25.71Z' transform='translate(-183.1 115.9)'/%3E%3Cpath class='cls-3' d='M683,496.81H596c-16.25,0-25.84-9.53-25.84-25.71q0-87.23,0-174.45c0-15.82,9.7-25.46,25.58-25.46H770.22c15.91,0,25.59,9.63,25.59,25.46q0,87.47,0,175c0,15.49-9.78,25.2-25.33,25.21Q726.74,496.84,683,496.81Z' transform='translate(-183.1 115.9)'/%3E%3C/svg%3E`;
    case "text":
      height = (0.1 * width).toFixed(2);
      return `data:image/svg+xml,%3Csvg width='${width}' height='${height}' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 528.15 53.64'%3E%3Cdefs%3E%3Cstyle%3E.cls-1%7Bfill:%230052ff;%7D%3C/style%3E%3C/defs%3E%3Ctitle%3ECoinbase_Wordmark_SubBrands_ALL%3C/title%3E%3Cpath class='cls-1' d='M164.45,15a15,15,0,0,0-11.74,5.4V0h-8.64V52.92h8.5V48a15,15,0,0,0,11.88,5.62c10.37,0,18.21-8.21,18.21-19.3S174.67,15,164.45,15Zm-1.3,30.67c-6.19,0-10.73-4.83-10.73-11.31S157,23,163.22,23s10.66,4.82,10.66,11.37S169.34,45.65,163.15,45.65Zm83.31-14.91-6.34-.93c-3-.43-5.18-1.44-5.18-3.82,0-2.59,2.8-3.89,6.62-3.89,4.18,0,6.84,1.8,7.42,4.76h8.35c-.94-7.49-6.7-11.88-15.55-11.88-9.15,0-15.2,4.68-15.2,11.3,0,6.34,4,10,12,11.16l6.33.94c3.1.43,4.83,1.65,4.83,4,0,2.95-3,4.17-7.2,4.17-5.12,0-8-2.09-8.43-5.25h-8.49c.79,7.27,6.48,12.38,16.84,12.38,9.44,0,15.7-4.32,15.7-11.74C258.12,35.28,253.58,31.82,246.46,30.74Zm-27.65-2.3c0-8.06-4.9-13.46-15.27-13.46-9.79,0-15.26,5-16.34,12.6h8.57c.43-3,2.73-5.4,7.63-5.4,4.39,0,6.55,1.94,6.55,4.32,0,3.09-4,3.88-8.85,4.39-6.63.72-14.84,3-14.84,11.66,0,6.7,5,11,12.89,11,6.19,0,10.08-2.59,12-6.7.28,3.67,3,6.05,6.84,6.05h5v-7.7h-4.25Zm-8.5,9.36c0,5-4.32,8.64-9.57,8.64-3.24,0-6-1.37-6-4.25,0-3.67,4.39-4.68,8.42-5.11s6-1.22,7.13-2.88ZM281.09,15c-11.09,0-19.23,8.35-19.23,19.36,0,11.6,8.72,19.3,19.37,19.3,9,0,16.06-5.33,17.86-12.89h-9c-1.3,3.31-4.47,5.19-8.71,5.19-5.55,0-9.72-3.46-10.66-9.51H299.3V33.12C299.3,22.46,291.53,15,281.09,15Zm-9.87,15.26c1.37-5.18,5.26-7.7,9.72-7.7,4.9,0,8.64,2.8,9.51,7.7ZM19.3,23a9.84,9.84,0,0,1,9.5,7h9.14c-1.65-8.93-9-15-18.57-15A19,19,0,0,0,0,34.34c0,11.09,8.28,19.3,19.37,19.3,9.36,0,16.85-6,18.5-15H28.8a9.75,9.75,0,0,1-9.43,7.06c-6.27,0-10.66-4.83-10.66-11.31S13,23,19.3,23Zm41.11-8A19,19,0,0,0,41,34.34c0,11.09,8.28,19.3,19.37,19.3A19,19,0,0,0,79.92,34.27C79.92,23.33,71.64,15,60.41,15Zm.07,30.67c-6.19,0-10.73-4.83-10.73-11.31S54.22,23,60.41,23s10.8,4.89,10.8,11.37S66.67,45.65,60.48,45.65ZM123.41,15c-5.62,0-9.29,2.3-11.45,5.54V15.7h-8.57V52.92H112V32.69C112,27,115.63,23,121,23c5,0,8.06,3.53,8.06,8.64V52.92h8.64V31C137.66,21.6,132.84,15,123.41,15ZM92,.36a5.36,5.36,0,0,0-5.55,5.47,5.55,5.55,0,0,0,11.09,0A5.35,5.35,0,0,0,92,.36Zm-9.72,23h5.4V52.92h8.64V15.7h-14Zm298.17-7.7L366.2,52.92H372L375.29,44H392l3.33,8.88h6L386.87,15.7ZM377,39.23l6.45-17.56h.1l6.56,17.56ZM362.66,15.7l-7.88,29h-.11l-8.14-29H341l-8,28.93h-.1l-8-28.87H319L329.82,53h5.45l8.19-29.24h.11L352,53h5.66L368.1,15.7Zm135.25,0v4.86h12.32V52.92h5.6V20.56h12.32V15.7ZM467.82,52.92h25.54V48.06H473.43v-12h18.35V31.35H473.43V20.56h19.93V15.7H467.82ZM443,15.7h-5.6V52.92h24.32V48.06H443Zm-30.45,0h-5.61V52.92h24.32V48.06H412.52Z'/%3E%3C/svg%3E`;
    case "textWithLogo":
      height = (0.25 * width).toFixed(2);
      return `data:image/svg+xml,%3Csvg width='${width}' height='${height}' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 308.44 77.61'%3E%3Cdefs%3E%3Cstyle%3E.cls-1%7Bfill:%230052ff;%7D%3C/style%3E%3C/defs%3E%3Cpath class='cls-1' d='M142.94,20.2l-7.88,29H135l-8.15-29h-5.55l-8,28.93h-.11l-8-28.87H99.27l10.84,37.27h5.44l8.2-29.24h.1l8.41,29.24h5.66L148.39,20.2Zm17.82,0L146.48,57.42h5.82l3.28-8.88h16.65l3.34,8.88h6L167.16,20.2Zm-3.44,23.52,6.45-17.55h.11l6.56,17.55ZM278.2,20.2v4.86h12.32V57.42h5.6V25.06h12.32V20.2ZM248.11,57.42h25.54V52.55H253.71V40.61h18.35V35.85H253.71V25.06h19.94V20.2H248.11ZM223.26,20.2h-5.61V57.42H242V52.55H223.26Zm-30.46,0h-5.6V57.42h24.32V52.55H192.8Zm-154,38A19.41,19.41,0,1,1,57.92,35.57H77.47a38.81,38.81,0,1,0,0,6.47H57.92A19.39,19.39,0,0,1,38.81,58.21Z'/%3E%3C/svg%3E`;
    case "textLight":
      height = (0.1 * width).toFixed(2);
      return `data:image/svg+xml,%3Csvg width='${width}' height='${height}' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 528.15 53.64'%3E%3Cdefs%3E%3Cstyle%3E.cls-1%7Bfill:%23fefefe;%7D%3C/style%3E%3C/defs%3E%3Ctitle%3ECoinbase_Wordmark_SubBrands_ALL%3C/title%3E%3Cpath class='cls-1' d='M164.45,15a15,15,0,0,0-11.74,5.4V0h-8.64V52.92h8.5V48a15,15,0,0,0,11.88,5.62c10.37,0,18.21-8.21,18.21-19.3S174.67,15,164.45,15Zm-1.3,30.67c-6.19,0-10.73-4.83-10.73-11.31S157,23,163.22,23s10.66,4.82,10.66,11.37S169.34,45.65,163.15,45.65Zm83.31-14.91-6.34-.93c-3-.43-5.18-1.44-5.18-3.82,0-2.59,2.8-3.89,6.62-3.89,4.18,0,6.84,1.8,7.42,4.76h8.35c-.94-7.49-6.7-11.88-15.55-11.88-9.15,0-15.2,4.68-15.2,11.3,0,6.34,4,10,12,11.16l6.33.94c3.1.43,4.83,1.65,4.83,4,0,2.95-3,4.17-7.2,4.17-5.12,0-8-2.09-8.43-5.25h-8.49c.79,7.27,6.48,12.38,16.84,12.38,9.44,0,15.7-4.32,15.7-11.74C258.12,35.28,253.58,31.82,246.46,30.74Zm-27.65-2.3c0-8.06-4.9-13.46-15.27-13.46-9.79,0-15.26,5-16.34,12.6h8.57c.43-3,2.73-5.4,7.63-5.4,4.39,0,6.55,1.94,6.55,4.32,0,3.09-4,3.88-8.85,4.39-6.63.72-14.84,3-14.84,11.66,0,6.7,5,11,12.89,11,6.19,0,10.08-2.59,12-6.7.28,3.67,3,6.05,6.84,6.05h5v-7.7h-4.25Zm-8.5,9.36c0,5-4.32,8.64-9.57,8.64-3.24,0-6-1.37-6-4.25,0-3.67,4.39-4.68,8.42-5.11s6-1.22,7.13-2.88ZM281.09,15c-11.09,0-19.23,8.35-19.23,19.36,0,11.6,8.72,19.3,19.37,19.3,9,0,16.06-5.33,17.86-12.89h-9c-1.3,3.31-4.47,5.19-8.71,5.19-5.55,0-9.72-3.46-10.66-9.51H299.3V33.12C299.3,22.46,291.53,15,281.09,15Zm-9.87,15.26c1.37-5.18,5.26-7.7,9.72-7.7,4.9,0,8.64,2.8,9.51,7.7ZM19.3,23a9.84,9.84,0,0,1,9.5,7h9.14c-1.65-8.93-9-15-18.57-15A19,19,0,0,0,0,34.34c0,11.09,8.28,19.3,19.37,19.3,9.36,0,16.85-6,18.5-15H28.8a9.75,9.75,0,0,1-9.43,7.06c-6.27,0-10.66-4.83-10.66-11.31S13,23,19.3,23Zm41.11-8A19,19,0,0,0,41,34.34c0,11.09,8.28,19.3,19.37,19.3A19,19,0,0,0,79.92,34.27C79.92,23.33,71.64,15,60.41,15Zm.07,30.67c-6.19,0-10.73-4.83-10.73-11.31S54.22,23,60.41,23s10.8,4.89,10.8,11.37S66.67,45.65,60.48,45.65ZM123.41,15c-5.62,0-9.29,2.3-11.45,5.54V15.7h-8.57V52.92H112V32.69C112,27,115.63,23,121,23c5,0,8.06,3.53,8.06,8.64V52.92h8.64V31C137.66,21.6,132.84,15,123.41,15ZM92,.36a5.36,5.36,0,0,0-5.55,5.47,5.55,5.55,0,0,0,11.09,0A5.35,5.35,0,0,0,92,.36Zm-9.72,23h5.4V52.92h8.64V15.7h-14Zm298.17-7.7L366.2,52.92H372L375.29,44H392l3.33,8.88h6L386.87,15.7ZM377,39.23l6.45-17.56h.1l6.56,17.56ZM362.66,15.7l-7.88,29h-.11l-8.14-29H341l-8,28.93h-.1l-8-28.87H319L329.82,53h5.45l8.19-29.24h.11L352,53h5.66L368.1,15.7Zm135.25,0v4.86h12.32V52.92h5.6V20.56h12.32V15.7ZM467.82,52.92h25.54V48.06H473.43v-12h18.35V31.35H473.43V20.56h19.93V15.7H467.82ZM443,15.7h-5.6V52.92h24.32V48.06H443Zm-30.45,0h-5.61V52.92h24.32V48.06H412.52Z'/%3E%3C/svg%3E`;
    case "textWithLogoLight":
      height = (0.25 * width).toFixed(2);
      return `data:image/svg+xml,%3Csvg width='${width}' height='${height}' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 308.44 77.61'%3E%3Cdefs%3E%3Cstyle%3E.cls-1%7Bfill:%23fefefe;%7D%3C/style%3E%3C/defs%3E%3Cpath class='cls-1' d='M142.94,20.2l-7.88,29H135l-8.15-29h-5.55l-8,28.93h-.11l-8-28.87H99.27l10.84,37.27h5.44l8.2-29.24h.1l8.41,29.24h5.66L148.39,20.2Zm17.82,0L146.48,57.42h5.82l3.28-8.88h16.65l3.34,8.88h6L167.16,20.2Zm-3.44,23.52,6.45-17.55h.11l6.56,17.55ZM278.2,20.2v4.86h12.32V57.42h5.6V25.06h12.32V20.2ZM248.11,57.42h25.54V52.55H253.71V40.61h18.35V35.85H253.71V25.06h19.94V20.2H248.11ZM223.26,20.2h-5.61V57.42H242V52.55H223.26Zm-30.46,0h-5.6V57.42h24.32V52.55H192.8Zm-154,38A19.41,19.41,0,1,1,57.92,35.57H77.47a38.81,38.81,0,1,0,0,6.47H57.92A19.39,19.39,0,0,1,38.81,58.21Z'/%3E%3C/svg%3E`;
    default:
      height = width;
      return `data:image/svg+xml,%3Csvg width='${width}' height='${height}' viewBox='0 0 1024 1024' fill='none' xmlns='http://www.w3.org/2000/svg'%3E %3Crect width='1024' height='1024' fill='%230052FF'/%3E %3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M152 512C152 710.823 313.177 872 512 872C710.823 872 872 710.823 872 512C872 313.177 710.823 152 512 152C313.177 152 152 313.177 152 512ZM420 396C406.745 396 396 406.745 396 420V604C396 617.255 406.745 628 420 628H604C617.255 628 628 617.255 628 604V420C628 406.745 617.255 396 604 396H420Z' fill='white'/%3E %3C/svg%3E `;
  }
};
walletLogo$1.walletLogo = walletLogo;
var ScopedLocalStorage$1 = {};
Object.defineProperty(ScopedLocalStorage$1, "__esModule", { value: true });
ScopedLocalStorage$1.ScopedLocalStorage = void 0;
class ScopedLocalStorage {
  constructor(scope) {
    this.scope = scope;
  }
  setItem(key, value) {
    localStorage.setItem(this.scopedKey(key), value);
  }
  getItem(key) {
    return localStorage.getItem(this.scopedKey(key));
  }
  removeItem(key) {
    localStorage.removeItem(this.scopedKey(key));
  }
  clear() {
    const prefix = this.scopedKey("");
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (typeof key === "string" && key.startsWith(prefix)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  }
  scopedKey(key) {
    return `${this.scope}:${key}`;
  }
}
ScopedLocalStorage$1.ScopedLocalStorage = ScopedLocalStorage;
var CoinbaseWalletProvider$1 = {};
var safeEventEmitter$1 = {};
Object.defineProperty(safeEventEmitter$1, "__esModule", { value: true });
const events_1 = events.exports;
function safeApply$1(handler, context, args) {
  try {
    Reflect.apply(handler, context, args);
  } catch (err) {
    setTimeout(() => {
      throw err;
    });
  }
}
function arrayClone$1(arr2) {
  const n2 = arr2.length;
  const copy = new Array(n2);
  for (let i = 0; i < n2; i += 1) {
    copy[i] = arr2[i];
  }
  return copy;
}
class SafeEventEmitter$4 extends events_1.EventEmitter {
  emit(type, ...args) {
    let doError = type === "error";
    const events2 = this._events;
    if (events2 !== void 0) {
      doError = doError && events2.error === void 0;
    } else if (!doError) {
      return false;
    }
    if (doError) {
      let er;
      if (args.length > 0) {
        [er] = args;
      }
      if (er instanceof Error) {
        throw er;
      }
      const err = new Error(`Unhandled error.${er ? ` (${er.message})` : ""}`);
      err.context = er;
      throw err;
    }
    const handler = events2[type];
    if (handler === void 0) {
      return false;
    }
    if (typeof handler === "function") {
      safeApply$1(handler, this, args);
    } else {
      const len = handler.length;
      const listeners = arrayClone$1(handler);
      for (let i = 0; i < len; i += 1) {
        safeApply$1(listeners[i], this, args);
      }
    }
    return true;
  }
}
safeEventEmitter$1.default = SafeEventEmitter$4;
var dist$1 = {};
var classes = {};
var fastSafeStringify = stringify$2;
stringify$2.default = stringify$2;
stringify$2.stable = deterministicStringify;
stringify$2.stableStringify = deterministicStringify;
var LIMIT_REPLACE_NODE = "[...]";
var CIRCULAR_REPLACE_NODE = "[Circular]";
var arr = [];
var replacerStack = [];
function defaultOptions() {
  return {
    depthLimit: Number.MAX_SAFE_INTEGER,
    edgesLimit: Number.MAX_SAFE_INTEGER
  };
}
function stringify$2(obj, replacer, spacer, options) {
  if (typeof options === "undefined") {
    options = defaultOptions();
  }
  decirc(obj, "", 0, [], void 0, 0, options);
  var res;
  try {
    if (replacerStack.length === 0) {
      res = JSON.stringify(obj, replacer, spacer);
    } else {
      res = JSON.stringify(obj, replaceGetterValues(replacer), spacer);
    }
  } catch (_2) {
    return JSON.stringify("[unable to serialize, circular reference is too complex to analyze]");
  } finally {
    while (arr.length !== 0) {
      var part = arr.pop();
      if (part.length === 4) {
        Object.defineProperty(part[0], part[1], part[3]);
      } else {
        part[0][part[1]] = part[2];
      }
    }
  }
  return res;
}
function setReplace(replace2, val, k2, parent) {
  var propertyDescriptor = Object.getOwnPropertyDescriptor(parent, k2);
  if (propertyDescriptor.get !== void 0) {
    if (propertyDescriptor.configurable) {
      Object.defineProperty(parent, k2, { value: replace2 });
      arr.push([parent, k2, val, propertyDescriptor]);
    } else {
      replacerStack.push([val, k2, replace2]);
    }
  } else {
    parent[k2] = replace2;
    arr.push([parent, k2, val]);
  }
}
function decirc(val, k2, edgeIndex, stack, parent, depth, options) {
  depth += 1;
  var i;
  if (typeof val === "object" && val !== null) {
    for (i = 0; i < stack.length; i++) {
      if (stack[i] === val) {
        setReplace(CIRCULAR_REPLACE_NODE, val, k2, parent);
        return;
      }
    }
    if (typeof options.depthLimit !== "undefined" && depth > options.depthLimit) {
      setReplace(LIMIT_REPLACE_NODE, val, k2, parent);
      return;
    }
    if (typeof options.edgesLimit !== "undefined" && edgeIndex + 1 > options.edgesLimit) {
      setReplace(LIMIT_REPLACE_NODE, val, k2, parent);
      return;
    }
    stack.push(val);
    if (Array.isArray(val)) {
      for (i = 0; i < val.length; i++) {
        decirc(val[i], i, i, stack, val, depth, options);
      }
    } else {
      var keys = Object.keys(val);
      for (i = 0; i < keys.length; i++) {
        var key = keys[i];
        decirc(val[key], key, i, stack, val, depth, options);
      }
    }
    stack.pop();
  }
}
function compareFunction(a2, b2) {
  if (a2 < b2) {
    return -1;
  }
  if (a2 > b2) {
    return 1;
  }
  return 0;
}
function deterministicStringify(obj, replacer, spacer, options) {
  if (typeof options === "undefined") {
    options = defaultOptions();
  }
  var tmp = deterministicDecirc(obj, "", 0, [], void 0, 0, options) || obj;
  var res;
  try {
    if (replacerStack.length === 0) {
      res = JSON.stringify(tmp, replacer, spacer);
    } else {
      res = JSON.stringify(tmp, replaceGetterValues(replacer), spacer);
    }
  } catch (_2) {
    return JSON.stringify("[unable to serialize, circular reference is too complex to analyze]");
  } finally {
    while (arr.length !== 0) {
      var part = arr.pop();
      if (part.length === 4) {
        Object.defineProperty(part[0], part[1], part[3]);
      } else {
        part[0][part[1]] = part[2];
      }
    }
  }
  return res;
}
function deterministicDecirc(val, k2, edgeIndex, stack, parent, depth, options) {
  depth += 1;
  var i;
  if (typeof val === "object" && val !== null) {
    for (i = 0; i < stack.length; i++) {
      if (stack[i] === val) {
        setReplace(CIRCULAR_REPLACE_NODE, val, k2, parent);
        return;
      }
    }
    try {
      if (typeof val.toJSON === "function") {
        return;
      }
    } catch (_2) {
      return;
    }
    if (typeof options.depthLimit !== "undefined" && depth > options.depthLimit) {
      setReplace(LIMIT_REPLACE_NODE, val, k2, parent);
      return;
    }
    if (typeof options.edgesLimit !== "undefined" && edgeIndex + 1 > options.edgesLimit) {
      setReplace(LIMIT_REPLACE_NODE, val, k2, parent);
      return;
    }
    stack.push(val);
    if (Array.isArray(val)) {
      for (i = 0; i < val.length; i++) {
        deterministicDecirc(val[i], i, i, stack, val, depth, options);
      }
    } else {
      var tmp = {};
      var keys = Object.keys(val).sort(compareFunction);
      for (i = 0; i < keys.length; i++) {
        var key = keys[i];
        deterministicDecirc(val[key], key, i, stack, val, depth, options);
        tmp[key] = val[key];
      }
      if (typeof parent !== "undefined") {
        arr.push([parent, k2, val]);
        parent[k2] = tmp;
      } else {
        return tmp;
      }
    }
    stack.pop();
  }
}
function replaceGetterValues(replacer) {
  replacer = typeof replacer !== "undefined" ? replacer : function(k2, v2) {
    return v2;
  };
  return function(key, val) {
    if (replacerStack.length > 0) {
      for (var i = 0; i < replacerStack.length; i++) {
        var part = replacerStack[i];
        if (part[1] === key && part[0] === val) {
          val = part[2];
          replacerStack.splice(i, 1);
          break;
        }
      }
    }
    return replacer.call(this, key, val);
  };
}
Object.defineProperty(classes, "__esModule", { value: true });
classes.EthereumProviderError = classes.EthereumRpcError = void 0;
const fast_safe_stringify_1 = fastSafeStringify;
class EthereumRpcError extends Error {
  constructor(code, message, data) {
    if (!Number.isInteger(code)) {
      throw new Error('"code" must be an integer.');
    }
    if (!message || typeof message !== "string") {
      throw new Error('"message" must be a nonempty string.');
    }
    super(message);
    this.code = code;
    if (data !== void 0) {
      this.data = data;
    }
  }
  serialize() {
    const serialized = {
      code: this.code,
      message: this.message
    };
    if (this.data !== void 0) {
      serialized.data = this.data;
    }
    if (this.stack) {
      serialized.stack = this.stack;
    }
    return serialized;
  }
  toString() {
    return fast_safe_stringify_1.default(this.serialize(), stringifyReplacer, 2);
  }
}
classes.EthereumRpcError = EthereumRpcError;
class EthereumProviderError extends EthereumRpcError {
  constructor(code, message, data) {
    if (!isValidEthProviderCode(code)) {
      throw new Error('"code" must be an integer such that: 1000 <= code <= 4999');
    }
    super(code, message, data);
  }
}
classes.EthereumProviderError = EthereumProviderError;
function isValidEthProviderCode(code) {
  return Number.isInteger(code) && code >= 1e3 && code <= 4999;
}
function stringifyReplacer(_2, value) {
  if (value === "[Circular]") {
    return void 0;
  }
  return value;
}
var utils$3 = {};
var errorConstants = {};
Object.defineProperty(errorConstants, "__esModule", { value: true });
errorConstants.errorValues = errorConstants.errorCodes = void 0;
errorConstants.errorCodes = {
  rpc: {
    invalidInput: -32e3,
    resourceNotFound: -32001,
    resourceUnavailable: -32002,
    transactionRejected: -32003,
    methodNotSupported: -32004,
    limitExceeded: -32005,
    parse: -32700,
    invalidRequest: -32600,
    methodNotFound: -32601,
    invalidParams: -32602,
    internal: -32603
  },
  provider: {
    userRejectedRequest: 4001,
    unauthorized: 4100,
    unsupportedMethod: 4200,
    disconnected: 4900,
    chainDisconnected: 4901
  }
};
errorConstants.errorValues = {
  "-32700": {
    standard: "JSON RPC 2.0",
    message: "Invalid JSON was received by the server. An error occurred on the server while parsing the JSON text."
  },
  "-32600": {
    standard: "JSON RPC 2.0",
    message: "The JSON sent is not a valid Request object."
  },
  "-32601": {
    standard: "JSON RPC 2.0",
    message: "The method does not exist / is not available."
  },
  "-32602": {
    standard: "JSON RPC 2.0",
    message: "Invalid method parameter(s)."
  },
  "-32603": {
    standard: "JSON RPC 2.0",
    message: "Internal JSON-RPC error."
  },
  "-32000": {
    standard: "EIP-1474",
    message: "Invalid input."
  },
  "-32001": {
    standard: "EIP-1474",
    message: "Resource not found."
  },
  "-32002": {
    standard: "EIP-1474",
    message: "Resource unavailable."
  },
  "-32003": {
    standard: "EIP-1474",
    message: "Transaction rejected."
  },
  "-32004": {
    standard: "EIP-1474",
    message: "Method not supported."
  },
  "-32005": {
    standard: "EIP-1474",
    message: "Request limit exceeded."
  },
  "4001": {
    standard: "EIP-1193",
    message: "User rejected the request."
  },
  "4100": {
    standard: "EIP-1193",
    message: "The requested account and/or method has not been authorized by the user."
  },
  "4200": {
    standard: "EIP-1193",
    message: "The requested method is not supported by this Ethereum provider."
  },
  "4900": {
    standard: "EIP-1193",
    message: "The provider is disconnected from all chains."
  },
  "4901": {
    standard: "EIP-1193",
    message: "The provider is disconnected from the specified chain."
  }
};
(function(exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.serializeError = exports.isValidCode = exports.getMessageFromCode = exports.JSON_RPC_SERVER_ERROR_MESSAGE = void 0;
  const error_constants_12 = errorConstants;
  const classes_12 = classes;
  const FALLBACK_ERROR_CODE = error_constants_12.errorCodes.rpc.internal;
  const FALLBACK_MESSAGE = "Unspecified error message. This is a bug, please report it.";
  const FALLBACK_ERROR = {
    code: FALLBACK_ERROR_CODE,
    message: getMessageFromCode(FALLBACK_ERROR_CODE)
  };
  exports.JSON_RPC_SERVER_ERROR_MESSAGE = "Unspecified server error.";
  function getMessageFromCode(code, fallbackMessage = FALLBACK_MESSAGE) {
    if (Number.isInteger(code)) {
      const codeString = code.toString();
      if (hasKey(error_constants_12.errorValues, codeString)) {
        return error_constants_12.errorValues[codeString].message;
      }
      if (isJsonRpcServerError(code)) {
        return exports.JSON_RPC_SERVER_ERROR_MESSAGE;
      }
    }
    return fallbackMessage;
  }
  exports.getMessageFromCode = getMessageFromCode;
  function isValidCode(code) {
    if (!Number.isInteger(code)) {
      return false;
    }
    const codeString = code.toString();
    if (error_constants_12.errorValues[codeString]) {
      return true;
    }
    if (isJsonRpcServerError(code)) {
      return true;
    }
    return false;
  }
  exports.isValidCode = isValidCode;
  function serializeError(error, { fallbackError = FALLBACK_ERROR, shouldIncludeStack = false } = {}) {
    var _a, _b;
    if (!fallbackError || !Number.isInteger(fallbackError.code) || typeof fallbackError.message !== "string") {
      throw new Error("Must provide fallback error with integer number code and string message.");
    }
    if (error instanceof classes_12.EthereumRpcError) {
      return error.serialize();
    }
    const serialized = {};
    if (error && typeof error === "object" && !Array.isArray(error) && hasKey(error, "code") && isValidCode(error.code)) {
      const _error = error;
      serialized.code = _error.code;
      if (_error.message && typeof _error.message === "string") {
        serialized.message = _error.message;
        if (hasKey(_error, "data")) {
          serialized.data = _error.data;
        }
      } else {
        serialized.message = getMessageFromCode(serialized.code);
        serialized.data = { originalError: assignOriginalError(error) };
      }
    } else {
      serialized.code = fallbackError.code;
      const message = (_a = error) === null || _a === void 0 ? void 0 : _a.message;
      serialized.message = message && typeof message === "string" ? message : fallbackError.message;
      serialized.data = { originalError: assignOriginalError(error) };
    }
    const stack = (_b = error) === null || _b === void 0 ? void 0 : _b.stack;
    if (shouldIncludeStack && error && stack && typeof stack === "string") {
      serialized.stack = stack;
    }
    return serialized;
  }
  exports.serializeError = serializeError;
  function isJsonRpcServerError(code) {
    return code >= -32099 && code <= -32e3;
  }
  function assignOriginalError(error) {
    if (error && typeof error === "object" && !Array.isArray(error)) {
      return Object.assign({}, error);
    }
    return error;
  }
  function hasKey(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }
})(utils$3);
var errors = {};
Object.defineProperty(errors, "__esModule", { value: true });
errors.ethErrors = void 0;
const classes_1 = classes;
const utils_1 = utils$3;
const error_constants_1 = errorConstants;
errors.ethErrors = {
  rpc: {
    parse: (arg) => getEthJsonRpcError(error_constants_1.errorCodes.rpc.parse, arg),
    invalidRequest: (arg) => getEthJsonRpcError(error_constants_1.errorCodes.rpc.invalidRequest, arg),
    invalidParams: (arg) => getEthJsonRpcError(error_constants_1.errorCodes.rpc.invalidParams, arg),
    methodNotFound: (arg) => getEthJsonRpcError(error_constants_1.errorCodes.rpc.methodNotFound, arg),
    internal: (arg) => getEthJsonRpcError(error_constants_1.errorCodes.rpc.internal, arg),
    server: (opts) => {
      if (!opts || typeof opts !== "object" || Array.isArray(opts)) {
        throw new Error("Ethereum RPC Server errors must provide single object argument.");
      }
      const { code } = opts;
      if (!Number.isInteger(code) || code > -32005 || code < -32099) {
        throw new Error('"code" must be an integer such that: -32099 <= code <= -32005');
      }
      return getEthJsonRpcError(code, opts);
    },
    invalidInput: (arg) => getEthJsonRpcError(error_constants_1.errorCodes.rpc.invalidInput, arg),
    resourceNotFound: (arg) => getEthJsonRpcError(error_constants_1.errorCodes.rpc.resourceNotFound, arg),
    resourceUnavailable: (arg) => getEthJsonRpcError(error_constants_1.errorCodes.rpc.resourceUnavailable, arg),
    transactionRejected: (arg) => getEthJsonRpcError(error_constants_1.errorCodes.rpc.transactionRejected, arg),
    methodNotSupported: (arg) => getEthJsonRpcError(error_constants_1.errorCodes.rpc.methodNotSupported, arg),
    limitExceeded: (arg) => getEthJsonRpcError(error_constants_1.errorCodes.rpc.limitExceeded, arg)
  },
  provider: {
    userRejectedRequest: (arg) => {
      return getEthProviderError(error_constants_1.errorCodes.provider.userRejectedRequest, arg);
    },
    unauthorized: (arg) => {
      return getEthProviderError(error_constants_1.errorCodes.provider.unauthorized, arg);
    },
    unsupportedMethod: (arg) => {
      return getEthProviderError(error_constants_1.errorCodes.provider.unsupportedMethod, arg);
    },
    disconnected: (arg) => {
      return getEthProviderError(error_constants_1.errorCodes.provider.disconnected, arg);
    },
    chainDisconnected: (arg) => {
      return getEthProviderError(error_constants_1.errorCodes.provider.chainDisconnected, arg);
    },
    custom: (opts) => {
      if (!opts || typeof opts !== "object" || Array.isArray(opts)) {
        throw new Error("Ethereum Provider custom errors must provide single object argument.");
      }
      const { code, message, data } = opts;
      if (!message || typeof message !== "string") {
        throw new Error('"message" must be a nonempty string');
      }
      return new classes_1.EthereumProviderError(code, message, data);
    }
  }
};
function getEthJsonRpcError(code, arg) {
  const [message, data] = parseOpts(arg);
  return new classes_1.EthereumRpcError(code, message || utils_1.getMessageFromCode(code), data);
}
function getEthProviderError(code, arg) {
  const [message, data] = parseOpts(arg);
  return new classes_1.EthereumProviderError(code, message || utils_1.getMessageFromCode(code), data);
}
function parseOpts(arg) {
  if (arg) {
    if (typeof arg === "string") {
      return [arg];
    } else if (typeof arg === "object" && !Array.isArray(arg)) {
      const { message, data } = arg;
      if (message && typeof message !== "string") {
        throw new Error("Must specify string message.");
      }
      return [message || void 0, data];
    }
  }
  return [];
}
(function(exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.getMessageFromCode = exports.serializeError = exports.EthereumProviderError = exports.EthereumRpcError = exports.ethErrors = exports.errorCodes = void 0;
  const classes_12 = classes;
  Object.defineProperty(exports, "EthereumRpcError", { enumerable: true, get: function() {
    return classes_12.EthereumRpcError;
  } });
  Object.defineProperty(exports, "EthereumProviderError", { enumerable: true, get: function() {
    return classes_12.EthereumProviderError;
  } });
  const utils_12 = utils$3;
  Object.defineProperty(exports, "serializeError", { enumerable: true, get: function() {
    return utils_12.serializeError;
  } });
  Object.defineProperty(exports, "getMessageFromCode", { enumerable: true, get: function() {
    return utils_12.getMessageFromCode;
  } });
  const errors_1 = errors;
  Object.defineProperty(exports, "ethErrors", { enumerable: true, get: function() {
    return errors_1.ethErrors;
  } });
  const error_constants_12 = errorConstants;
  Object.defineProperty(exports, "errorCodes", { enumerable: true, get: function() {
    return error_constants_12.errorCodes;
  } });
})(dist$1);
var DiagnosticLogger = {};
Object.defineProperty(DiagnosticLogger, "__esModule", { value: true });
DiagnosticLogger.EVENTS = void 0;
DiagnosticLogger.EVENTS = {
  STARTED_CONNECTING: "walletlink_sdk.started.connecting",
  CONNECTED_STATE_CHANGE: "walletlink_sdk.connected",
  DISCONNECTED: "walletlink_sdk.disconnected",
  METADATA_DESTROYED: "walletlink_sdk_metadata_destroyed",
  LINKED: "walletlink_sdk.linked",
  FAILURE: "walletlink_sdk.generic_failure",
  SESSION_CONFIG_RECEIVED: "walletlink_sdk.session_config_event_received",
  ETH_ACCOUNTS_STATE: "walletlink_sdk.eth_accounts_state",
  SESSION_STATE_CHANGE: "walletlink_sdk.session_state_change",
  UNLINKED_ERROR_STATE: "walletlink_sdk.unlinked_error_state",
  SKIPPED_CLEARING_SESSION: "walletlink_sdk.skipped_clearing_session",
  GENERAL_ERROR: "walletlink_sdk.general_error",
  WEB3_REQUEST: "walletlink_sdk.web3.request",
  WEB3_REQUEST_PUBLISHED: "walletlink_sdk.web3.request_published",
  WEB3_RESPONSE: "walletlink_sdk.web3.response",
  UNKNOWN_ADDRESS_ENCOUNTERED: "walletlink_sdk.unknown_address_encountered"
};
var Session$1 = {};
var require$$2$1 = /* @__PURE__ */ getAugmentedNamespace(_esm5);
function audit(durationSelector) {
  return function auditOperatorFunction(source) {
    return source.lift(new AuditOperator(durationSelector));
  };
}
var AuditOperator = /* @__PURE__ */ function() {
  function AuditOperator2(durationSelector) {
    this.durationSelector = durationSelector;
  }
  AuditOperator2.prototype.call = function(subscriber, source) {
    return source.subscribe(new AuditSubscriber(subscriber, this.durationSelector));
  };
  return AuditOperator2;
}();
var AuditSubscriber = /* @__PURE__ */ function(_super) {
  __extends(AuditSubscriber2, _super);
  function AuditSubscriber2(destination, durationSelector) {
    var _this = _super.call(this, destination) || this;
    _this.durationSelector = durationSelector;
    _this.hasValue = false;
    return _this;
  }
  AuditSubscriber2.prototype._next = function(value) {
    this.value = value;
    this.hasValue = true;
    if (!this.throttled) {
      var duration = void 0;
      try {
        var durationSelector = this.durationSelector;
        duration = durationSelector(value);
      } catch (err) {
        return this.destination.error(err);
      }
      var innerSubscription = innerSubscribe(duration, new SimpleInnerSubscriber(this));
      if (!innerSubscription || innerSubscription.closed) {
        this.clearThrottle();
      } else {
        this.add(this.throttled = innerSubscription);
      }
    }
  };
  AuditSubscriber2.prototype.clearThrottle = function() {
    var _a = this, value = _a.value, hasValue = _a.hasValue, throttled = _a.throttled;
    if (throttled) {
      this.remove(throttled);
      this.throttled = void 0;
      throttled.unsubscribe();
    }
    if (hasValue) {
      this.value = void 0;
      this.hasValue = false;
      this.destination.next(value);
    }
  };
  AuditSubscriber2.prototype.notifyNext = function() {
    this.clearThrottle();
  };
  AuditSubscriber2.prototype.notifyComplete = function() {
    this.clearThrottle();
  };
  return AuditSubscriber2;
}(SimpleOuterSubscriber);
function auditTime(duration, scheduler) {
  if (scheduler === void 0) {
    scheduler = async;
  }
  return audit(function() {
    return timer(duration, scheduler);
  });
}
function buffer(closingNotifier) {
  return function bufferOperatorFunction(source) {
    return source.lift(new BufferOperator(closingNotifier));
  };
}
var BufferOperator = /* @__PURE__ */ function() {
  function BufferOperator2(closingNotifier) {
    this.closingNotifier = closingNotifier;
  }
  BufferOperator2.prototype.call = function(subscriber, source) {
    return source.subscribe(new BufferSubscriber(subscriber, this.closingNotifier));
  };
  return BufferOperator2;
}();
var BufferSubscriber = /* @__PURE__ */ function(_super) {
  __extends(BufferSubscriber2, _super);
  function BufferSubscriber2(destination, closingNotifier) {
    var _this = _super.call(this, destination) || this;
    _this.buffer = [];
    _this.add(innerSubscribe(closingNotifier, new SimpleInnerSubscriber(_this)));
    return _this;
  }
  BufferSubscriber2.prototype._next = function(value) {
    this.buffer.push(value);
  };
  BufferSubscriber2.prototype.notifyNext = function() {
    var buffer2 = this.buffer;
    this.buffer = [];
    this.destination.next(buffer2);
  };
  return BufferSubscriber2;
}(SimpleOuterSubscriber);
function bufferCount(bufferSize, startBufferEvery) {
  if (startBufferEvery === void 0) {
    startBufferEvery = null;
  }
  return function bufferCountOperatorFunction(source) {
    return source.lift(new BufferCountOperator(bufferSize, startBufferEvery));
  };
}
var BufferCountOperator = /* @__PURE__ */ function() {
  function BufferCountOperator2(bufferSize, startBufferEvery) {
    this.bufferSize = bufferSize;
    this.startBufferEvery = startBufferEvery;
    if (!startBufferEvery || bufferSize === startBufferEvery) {
      this.subscriberClass = BufferCountSubscriber;
    } else {
      this.subscriberClass = BufferSkipCountSubscriber;
    }
  }
  BufferCountOperator2.prototype.call = function(subscriber, source) {
    return source.subscribe(new this.subscriberClass(subscriber, this.bufferSize, this.startBufferEvery));
  };
  return BufferCountOperator2;
}();
var BufferCountSubscriber = /* @__PURE__ */ function(_super) {
  __extends(BufferCountSubscriber2, _super);
  function BufferCountSubscriber2(destination, bufferSize) {
    var _this = _super.call(this, destination) || this;
    _this.bufferSize = bufferSize;
    _this.buffer = [];
    return _this;
  }
  BufferCountSubscriber2.prototype._next = function(value) {
    var buffer2 = this.buffer;
    buffer2.push(value);
    if (buffer2.length == this.bufferSize) {
      this.destination.next(buffer2);
      this.buffer = [];
    }
  };
  BufferCountSubscriber2.prototype._complete = function() {
    var buffer2 = this.buffer;
    if (buffer2.length > 0) {
      this.destination.next(buffer2);
    }
    _super.prototype._complete.call(this);
  };
  return BufferCountSubscriber2;
}(Subscriber);
var BufferSkipCountSubscriber = /* @__PURE__ */ function(_super) {
  __extends(BufferSkipCountSubscriber2, _super);
  function BufferSkipCountSubscriber2(destination, bufferSize, startBufferEvery) {
    var _this = _super.call(this, destination) || this;
    _this.bufferSize = bufferSize;
    _this.startBufferEvery = startBufferEvery;
    _this.buffers = [];
    _this.count = 0;
    return _this;
  }
  BufferSkipCountSubscriber2.prototype._next = function(value) {
    var _a = this, bufferSize = _a.bufferSize, startBufferEvery = _a.startBufferEvery, buffers = _a.buffers, count2 = _a.count;
    this.count++;
    if (count2 % startBufferEvery === 0) {
      buffers.push([]);
    }
    for (var i = buffers.length; i--; ) {
      var buffer2 = buffers[i];
      buffer2.push(value);
      if (buffer2.length === bufferSize) {
        buffers.splice(i, 1);
        this.destination.next(buffer2);
      }
    }
  };
  BufferSkipCountSubscriber2.prototype._complete = function() {
    var _a = this, buffers = _a.buffers, destination = _a.destination;
    while (buffers.length > 0) {
      var buffer2 = buffers.shift();
      if (buffer2.length > 0) {
        destination.next(buffer2);
      }
    }
    _super.prototype._complete.call(this);
  };
  return BufferSkipCountSubscriber2;
}(Subscriber);
function bufferTime(bufferTimeSpan) {
  var length = arguments.length;
  var scheduler = async;
  if (isScheduler(arguments[arguments.length - 1])) {
    scheduler = arguments[arguments.length - 1];
    length--;
  }
  var bufferCreationInterval = null;
  if (length >= 2) {
    bufferCreationInterval = arguments[1];
  }
  var maxBufferSize = Number.POSITIVE_INFINITY;
  if (length >= 3) {
    maxBufferSize = arguments[2];
  }
  return function bufferTimeOperatorFunction(source) {
    return source.lift(new BufferTimeOperator(bufferTimeSpan, bufferCreationInterval, maxBufferSize, scheduler));
  };
}
var BufferTimeOperator = /* @__PURE__ */ function() {
  function BufferTimeOperator2(bufferTimeSpan, bufferCreationInterval, maxBufferSize, scheduler) {
    this.bufferTimeSpan = bufferTimeSpan;
    this.bufferCreationInterval = bufferCreationInterval;
    this.maxBufferSize = maxBufferSize;
    this.scheduler = scheduler;
  }
  BufferTimeOperator2.prototype.call = function(subscriber, source) {
    return source.subscribe(new BufferTimeSubscriber(subscriber, this.bufferTimeSpan, this.bufferCreationInterval, this.maxBufferSize, this.scheduler));
  };
  return BufferTimeOperator2;
}();
var Context = /* @__PURE__ */ function() {
  function Context2() {
    this.buffer = [];
  }
  return Context2;
}();
var BufferTimeSubscriber = /* @__PURE__ */ function(_super) {
  __extends(BufferTimeSubscriber2, _super);
  function BufferTimeSubscriber2(destination, bufferTimeSpan, bufferCreationInterval, maxBufferSize, scheduler) {
    var _this = _super.call(this, destination) || this;
    _this.bufferTimeSpan = bufferTimeSpan;
    _this.bufferCreationInterval = bufferCreationInterval;
    _this.maxBufferSize = maxBufferSize;
    _this.scheduler = scheduler;
    _this.contexts = [];
    var context = _this.openContext();
    _this.timespanOnly = bufferCreationInterval == null || bufferCreationInterval < 0;
    if (_this.timespanOnly) {
      var timeSpanOnlyState = { subscriber: _this, context, bufferTimeSpan };
      _this.add(context.closeAction = scheduler.schedule(dispatchBufferTimeSpanOnly, bufferTimeSpan, timeSpanOnlyState));
    } else {
      var closeState = { subscriber: _this, context };
      var creationState = { bufferTimeSpan, bufferCreationInterval, subscriber: _this, scheduler };
      _this.add(context.closeAction = scheduler.schedule(dispatchBufferClose, bufferTimeSpan, closeState));
      _this.add(scheduler.schedule(dispatchBufferCreation, bufferCreationInterval, creationState));
    }
    return _this;
  }
  BufferTimeSubscriber2.prototype._next = function(value) {
    var contexts = this.contexts;
    var len = contexts.length;
    var filledBufferContext;
    for (var i = 0; i < len; i++) {
      var context_1 = contexts[i];
      var buffer2 = context_1.buffer;
      buffer2.push(value);
      if (buffer2.length == this.maxBufferSize) {
        filledBufferContext = context_1;
      }
    }
    if (filledBufferContext) {
      this.onBufferFull(filledBufferContext);
    }
  };
  BufferTimeSubscriber2.prototype._error = function(err) {
    this.contexts.length = 0;
    _super.prototype._error.call(this, err);
  };
  BufferTimeSubscriber2.prototype._complete = function() {
    var _a = this, contexts = _a.contexts, destination = _a.destination;
    while (contexts.length > 0) {
      var context_2 = contexts.shift();
      destination.next(context_2.buffer);
    }
    _super.prototype._complete.call(this);
  };
  BufferTimeSubscriber2.prototype._unsubscribe = function() {
    this.contexts = null;
  };
  BufferTimeSubscriber2.prototype.onBufferFull = function(context) {
    this.closeContext(context);
    var closeAction = context.closeAction;
    closeAction.unsubscribe();
    this.remove(closeAction);
    if (!this.closed && this.timespanOnly) {
      context = this.openContext();
      var bufferTimeSpan = this.bufferTimeSpan;
      var timeSpanOnlyState = { subscriber: this, context, bufferTimeSpan };
      this.add(context.closeAction = this.scheduler.schedule(dispatchBufferTimeSpanOnly, bufferTimeSpan, timeSpanOnlyState));
    }
  };
  BufferTimeSubscriber2.prototype.openContext = function() {
    var context = new Context();
    this.contexts.push(context);
    return context;
  };
  BufferTimeSubscriber2.prototype.closeContext = function(context) {
    this.destination.next(context.buffer);
    var contexts = this.contexts;
    var spliceIndex = contexts ? contexts.indexOf(context) : -1;
    if (spliceIndex >= 0) {
      contexts.splice(contexts.indexOf(context), 1);
    }
  };
  return BufferTimeSubscriber2;
}(Subscriber);
function dispatchBufferTimeSpanOnly(state) {
  var subscriber = state.subscriber;
  var prevContext = state.context;
  if (prevContext) {
    subscriber.closeContext(prevContext);
  }
  if (!subscriber.closed) {
    state.context = subscriber.openContext();
    state.context.closeAction = this.schedule(state, state.bufferTimeSpan);
  }
}
function dispatchBufferCreation(state) {
  var bufferCreationInterval = state.bufferCreationInterval, bufferTimeSpan = state.bufferTimeSpan, subscriber = state.subscriber, scheduler = state.scheduler;
  var context = subscriber.openContext();
  var action = this;
  if (!subscriber.closed) {
    subscriber.add(context.closeAction = scheduler.schedule(dispatchBufferClose, bufferTimeSpan, { subscriber, context }));
    action.schedule(state, bufferCreationInterval);
  }
}
function dispatchBufferClose(arg) {
  var subscriber = arg.subscriber, context = arg.context;
  subscriber.closeContext(context);
}
function bufferToggle(openings, closingSelector) {
  return function bufferToggleOperatorFunction(source) {
    return source.lift(new BufferToggleOperator(openings, closingSelector));
  };
}
var BufferToggleOperator = /* @__PURE__ */ function() {
  function BufferToggleOperator2(openings, closingSelector) {
    this.openings = openings;
    this.closingSelector = closingSelector;
  }
  BufferToggleOperator2.prototype.call = function(subscriber, source) {
    return source.subscribe(new BufferToggleSubscriber(subscriber, this.openings, this.closingSelector));
  };
  return BufferToggleOperator2;
}();
var BufferToggleSubscriber = /* @__PURE__ */ function(_super) {
  __extends(BufferToggleSubscriber2, _super);
  function BufferToggleSubscriber2(destination, openings, closingSelector) {
    var _this = _super.call(this, destination) || this;
    _this.closingSelector = closingSelector;
    _this.contexts = [];
    _this.add(subscribeToResult(_this, openings));
    return _this;
  }
  BufferToggleSubscriber2.prototype._next = function(value) {
    var contexts = this.contexts;
    var len = contexts.length;
    for (var i = 0; i < len; i++) {
      contexts[i].buffer.push(value);
    }
  };
  BufferToggleSubscriber2.prototype._error = function(err) {
    var contexts = this.contexts;
    while (contexts.length > 0) {
      var context_1 = contexts.shift();
      context_1.subscription.unsubscribe();
      context_1.buffer = null;
      context_1.subscription = null;
    }
    this.contexts = null;
    _super.prototype._error.call(this, err);
  };
  BufferToggleSubscriber2.prototype._complete = function() {
    var contexts = this.contexts;
    while (contexts.length > 0) {
      var context_2 = contexts.shift();
      this.destination.next(context_2.buffer);
      context_2.subscription.unsubscribe();
      context_2.buffer = null;
      context_2.subscription = null;
    }
    this.contexts = null;
    _super.prototype._complete.call(this);
  };
  BufferToggleSubscriber2.prototype.notifyNext = function(outerValue, innerValue) {
    outerValue ? this.closeBuffer(outerValue) : this.openBuffer(innerValue);
  };
  BufferToggleSubscriber2.prototype.notifyComplete = function(innerSub) {
    this.closeBuffer(innerSub.context);
  };
  BufferToggleSubscriber2.prototype.openBuffer = function(value) {
    try {
      var closingSelector = this.closingSelector;
      var closingNotifier = closingSelector.call(this, value);
      if (closingNotifier) {
        this.trySubscribe(closingNotifier);
      }
    } catch (err) {
      this._error(err);
    }
  };
  BufferToggleSubscriber2.prototype.closeBuffer = function(context) {
    var contexts = this.contexts;
    if (contexts && context) {
      var buffer2 = context.buffer, subscription = context.subscription;
      this.destination.next(buffer2);
      contexts.splice(contexts.indexOf(context), 1);
      this.remove(subscription);
      subscription.unsubscribe();
    }
  };
  BufferToggleSubscriber2.prototype.trySubscribe = function(closingNotifier) {
    var contexts = this.contexts;
    var buffer2 = [];
    var subscription = new Subscription();
    var context = { buffer: buffer2, subscription };
    contexts.push(context);
    var innerSubscription = subscribeToResult(this, closingNotifier, context);
    if (!innerSubscription || innerSubscription.closed) {
      this.closeBuffer(context);
    } else {
      innerSubscription.context = context;
      this.add(innerSubscription);
      subscription.add(innerSubscription);
    }
  };
  return BufferToggleSubscriber2;
}(OuterSubscriber);
function bufferWhen(closingSelector) {
  return function(source) {
    return source.lift(new BufferWhenOperator(closingSelector));
  };
}
var BufferWhenOperator = /* @__PURE__ */ function() {
  function BufferWhenOperator2(closingSelector) {
    this.closingSelector = closingSelector;
  }
  BufferWhenOperator2.prototype.call = function(subscriber, source) {
    return source.subscribe(new BufferWhenSubscriber(subscriber, this.closingSelector));
  };
  return BufferWhenOperator2;
}();
var BufferWhenSubscriber = /* @__PURE__ */ function(_super) {
  __extends(BufferWhenSubscriber2, _super);
  function BufferWhenSubscriber2(destination, closingSelector) {
    var _this = _super.call(this, destination) || this;
    _this.closingSelector = closingSelector;
    _this.subscribing = false;
    _this.openBuffer();
    return _this;
  }
  BufferWhenSubscriber2.prototype._next = function(value) {
    this.buffer.push(value);
  };
  BufferWhenSubscriber2.prototype._complete = function() {
    var buffer2 = this.buffer;
    if (buffer2) {
      this.destination.next(buffer2);
    }
    _super.prototype._complete.call(this);
  };
  BufferWhenSubscriber2.prototype._unsubscribe = function() {
    this.buffer = void 0;
    this.subscribing = false;
  };
  BufferWhenSubscriber2.prototype.notifyNext = function() {
    this.openBuffer();
  };
  BufferWhenSubscriber2.prototype.notifyComplete = function() {
    if (this.subscribing) {
      this.complete();
    } else {
      this.openBuffer();
    }
  };
  BufferWhenSubscriber2.prototype.openBuffer = function() {
    var closingSubscription = this.closingSubscription;
    if (closingSubscription) {
      this.remove(closingSubscription);
      closingSubscription.unsubscribe();
    }
    var buffer2 = this.buffer;
    if (this.buffer) {
      this.destination.next(buffer2);
    }
    this.buffer = [];
    var closingNotifier;
    try {
      var closingSelector = this.closingSelector;
      closingNotifier = closingSelector();
    } catch (err) {
      return this.error(err);
    }
    closingSubscription = new Subscription();
    this.closingSubscription = closingSubscription;
    this.add(closingSubscription);
    this.subscribing = true;
    closingSubscription.add(innerSubscribe(closingNotifier, new SimpleInnerSubscriber(this)));
    this.subscribing = false;
  };
  return BufferWhenSubscriber2;
}(SimpleOuterSubscriber);
function catchError(selector) {
  return function catchErrorOperatorFunction(source) {
    var operator = new CatchOperator(selector);
    var caught = source.lift(operator);
    return operator.caught = caught;
  };
}
var CatchOperator = /* @__PURE__ */ function() {
  function CatchOperator2(selector) {
    this.selector = selector;
  }
  CatchOperator2.prototype.call = function(subscriber, source) {
    return source.subscribe(new CatchSubscriber(subscriber, this.selector, this.caught));
  };
  return CatchOperator2;
}();
var CatchSubscriber = /* @__PURE__ */ function(_super) {
  __extends(CatchSubscriber2, _super);
  function CatchSubscriber2(destination, selector, caught) {
    var _this = _super.call(this, destination) || this;
    _this.selector = selector;
    _this.caught = caught;
    return _this;
  }
  CatchSubscriber2.prototype.error = function(err) {
    if (!this.isStopped) {
      var result = void 0;
      try {
        result = this.selector(err, this.caught);
      } catch (err2) {
        _super.prototype.error.call(this, err2);
        return;
      }
      this._unsubscribeAndRecycle();
      var innerSubscriber = new SimpleInnerSubscriber(this);
      this.add(innerSubscriber);
      var innerSubscription = innerSubscribe(result, innerSubscriber);
      if (innerSubscription !== innerSubscriber) {
        this.add(innerSubscription);
      }
    }
  };
  return CatchSubscriber2;
}(SimpleOuterSubscriber);
function combineAll(project) {
  return function(source) {
    return source.lift(new CombineLatestOperator(project));
  };
}
function combineLatest() {
  var observables = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    observables[_i] = arguments[_i];
  }
  var project = null;
  if (typeof observables[observables.length - 1] === "function") {
    project = observables.pop();
  }
  if (observables.length === 1 && isArray$5(observables[0])) {
    observables = observables[0].slice();
  }
  return function(source) {
    return source.lift.call(from([source].concat(observables)), new CombineLatestOperator(project));
  };
}
function concat() {
  var observables = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    observables[_i] = arguments[_i];
  }
  return function(source) {
    return source.lift.call(concat$1.apply(void 0, [source].concat(observables)));
  };
}
function concatMap(project, resultSelector) {
  return mergeMap(project, resultSelector, 1);
}
function concatMapTo(innerObservable, resultSelector) {
  return concatMap(function() {
    return innerObservable;
  }, resultSelector);
}
function count(predicate) {
  return function(source) {
    return source.lift(new CountOperator(predicate, source));
  };
}
var CountOperator = /* @__PURE__ */ function() {
  function CountOperator2(predicate, source) {
    this.predicate = predicate;
    this.source = source;
  }
  CountOperator2.prototype.call = function(subscriber, source) {
    return source.subscribe(new CountSubscriber(subscriber, this.predicate, this.source));
  };
  return CountOperator2;
}();
var CountSubscriber = /* @__PURE__ */ function(_super) {
  __extends(CountSubscriber2, _super);
  function CountSubscriber2(destination, predicate, source) {
    var _this = _super.call(this, destination) || this;
    _this.predicate = predicate;
    _this.source = source;
    _this.count = 0;
    _this.index = 0;
    return _this;
  }
  CountSubscriber2.prototype._next = function(value) {
    if (this.predicate) {
      this._tryPredicate(value);
    } else {
      this.count++;
    }
  };
  CountSubscriber2.prototype._tryPredicate = function(value) {
    var result;
    try {
      result = this.predicate(value, this.index++, this.source);
    } catch (err) {
      this.destination.error(err);
      return;
    }
    if (result) {
      this.count++;
    }
  };
  CountSubscriber2.prototype._complete = function() {
    this.destination.next(this.count);
    this.destination.complete();
  };
  return CountSubscriber2;
}(Subscriber);
function debounce(durationSelector) {
  return function(source) {
    return source.lift(new DebounceOperator(durationSelector));
  };
}
var DebounceOperator = /* @__PURE__ */ function() {
  function DebounceOperator2(durationSelector) {
    this.durationSelector = durationSelector;
  }
  DebounceOperator2.prototype.call = function(subscriber, source) {
    return source.subscribe(new DebounceSubscriber(subscriber, this.durationSelector));
  };
  return DebounceOperator2;
}();
var DebounceSubscriber = /* @__PURE__ */ function(_super) {
  __extends(DebounceSubscriber2, _super);
  function DebounceSubscriber2(destination, durationSelector) {
    var _this = _super.call(this, destination) || this;
    _this.durationSelector = durationSelector;
    _this.hasValue = false;
    return _this;
  }
  DebounceSubscriber2.prototype._next = function(value) {
    try {
      var result = this.durationSelector.call(this, value);
      if (result) {
        this._tryNext(value, result);
      }
    } catch (err) {
      this.destination.error(err);
    }
  };
  DebounceSubscriber2.prototype._complete = function() {
    this.emitValue();
    this.destination.complete();
  };
  DebounceSubscriber2.prototype._tryNext = function(value, duration) {
    var subscription = this.durationSubscription;
    this.value = value;
    this.hasValue = true;
    if (subscription) {
      subscription.unsubscribe();
      this.remove(subscription);
    }
    subscription = innerSubscribe(duration, new SimpleInnerSubscriber(this));
    if (subscription && !subscription.closed) {
      this.add(this.durationSubscription = subscription);
    }
  };
  DebounceSubscriber2.prototype.notifyNext = function() {
    this.emitValue();
  };
  DebounceSubscriber2.prototype.notifyComplete = function() {
    this.emitValue();
  };
  DebounceSubscriber2.prototype.emitValue = function() {
    if (this.hasValue) {
      var value = this.value;
      var subscription = this.durationSubscription;
      if (subscription) {
        this.durationSubscription = void 0;
        subscription.unsubscribe();
        this.remove(subscription);
      }
      this.value = void 0;
      this.hasValue = false;
      _super.prototype._next.call(this, value);
    }
  };
  return DebounceSubscriber2;
}(SimpleOuterSubscriber);
function debounceTime(dueTime, scheduler) {
  if (scheduler === void 0) {
    scheduler = async;
  }
  return function(source) {
    return source.lift(new DebounceTimeOperator(dueTime, scheduler));
  };
}
var DebounceTimeOperator = /* @__PURE__ */ function() {
  function DebounceTimeOperator2(dueTime, scheduler) {
    this.dueTime = dueTime;
    this.scheduler = scheduler;
  }
  DebounceTimeOperator2.prototype.call = function(subscriber, source) {
    return source.subscribe(new DebounceTimeSubscriber(subscriber, this.dueTime, this.scheduler));
  };
  return DebounceTimeOperator2;
}();
var DebounceTimeSubscriber = /* @__PURE__ */ function(_super) {
  __extends(DebounceTimeSubscriber2, _super);
  function DebounceTimeSubscriber2(destination, dueTime, scheduler) {
    var _this = _super.call(this, destination) || this;
    _this.dueTime = dueTime;
    _this.scheduler = scheduler;
    _this.debouncedSubscription = null;
    _this.lastValue = null;
    _this.hasValue = false;
    return _this;
  }
  DebounceTimeSubscriber2.prototype._next = function(value) {
    this.clearDebounce();
    this.lastValue = value;
    this.hasValue = true;
    this.add(this.debouncedSubscription = this.scheduler.schedule(dispatchNext$1, this.dueTime, this));
  };
  DebounceTimeSubscriber2.prototype._complete = function() {
    this.debouncedNext();
    this.destination.complete();
  };
  DebounceTimeSubscriber2.prototype.debouncedNext = function() {
    this.clearDebounce();
    if (this.hasValue) {
      var lastValue = this.lastValue;
      this.lastValue = null;
      this.hasValue = false;
      this.destination.next(lastValue);
    }
  };
  DebounceTimeSubscriber2.prototype.clearDebounce = function() {
    var debouncedSubscription = this.debouncedSubscription;
    if (debouncedSubscription !== null) {
      this.remove(debouncedSubscription);
      debouncedSubscription.unsubscribe();
      this.debouncedSubscription = null;
    }
  };
  return DebounceTimeSubscriber2;
}(Subscriber);
function dispatchNext$1(subscriber) {
  subscriber.debouncedNext();
}
function defaultIfEmpty(defaultValue) {
  if (defaultValue === void 0) {
    defaultValue = null;
  }
  return function(source) {
    return source.lift(new DefaultIfEmptyOperator(defaultValue));
  };
}
var DefaultIfEmptyOperator = /* @__PURE__ */ function() {
  function DefaultIfEmptyOperator2(defaultValue) {
    this.defaultValue = defaultValue;
  }
  DefaultIfEmptyOperator2.prototype.call = function(subscriber, source) {
    return source.subscribe(new DefaultIfEmptySubscriber(subscriber, this.defaultValue));
  };
  return DefaultIfEmptyOperator2;
}();
var DefaultIfEmptySubscriber = /* @__PURE__ */ function(_super) {
  __extends(DefaultIfEmptySubscriber2, _super);
  function DefaultIfEmptySubscriber2(destination, defaultValue) {
    var _this = _super.call(this, destination) || this;
    _this.defaultValue = defaultValue;
    _this.isEmpty = true;
    return _this;
  }
  DefaultIfEmptySubscriber2.prototype._next = function(value) {
    this.isEmpty = false;
    this.destination.next(value);
  };
  DefaultIfEmptySubscriber2.prototype._complete = function() {
    if (this.isEmpty) {
      this.destination.next(this.defaultValue);
    }
    this.destination.complete();
  };
  return DefaultIfEmptySubscriber2;
}(Subscriber);
function isDate$1(value) {
  return value instanceof Date && !isNaN(+value);
}
function delay(delay2, scheduler) {
  if (scheduler === void 0) {
    scheduler = async;
  }
  var absoluteDelay = isDate$1(delay2);
  var delayFor = absoluteDelay ? +delay2 - scheduler.now() : Math.abs(delay2);
  return function(source) {
    return source.lift(new DelayOperator(delayFor, scheduler));
  };
}
var DelayOperator = /* @__PURE__ */ function() {
  function DelayOperator2(delay2, scheduler) {
    this.delay = delay2;
    this.scheduler = scheduler;
  }
  DelayOperator2.prototype.call = function(subscriber, source) {
    return source.subscribe(new DelaySubscriber(subscriber, this.delay, this.scheduler));
  };
  return DelayOperator2;
}();
var DelaySubscriber = /* @__PURE__ */ function(_super) {
  __extends(DelaySubscriber2, _super);
  function DelaySubscriber2(destination, delay2, scheduler) {
    var _this = _super.call(this, destination) || this;
    _this.delay = delay2;
    _this.scheduler = scheduler;
    _this.queue = [];
    _this.active = false;
    _this.errored = false;
    return _this;
  }
  DelaySubscriber2.dispatch = function(state) {
    var source = state.source;
    var queue2 = source.queue;
    var scheduler = state.scheduler;
    var destination = state.destination;
    while (queue2.length > 0 && queue2[0].time - scheduler.now() <= 0) {
      queue2.shift().notification.observe(destination);
    }
    if (queue2.length > 0) {
      var delay_1 = Math.max(0, queue2[0].time - scheduler.now());
      this.schedule(state, delay_1);
    } else {
      this.unsubscribe();
      source.active = false;
    }
  };
  DelaySubscriber2.prototype._schedule = function(scheduler) {
    this.active = true;
    var destination = this.destination;
    destination.add(scheduler.schedule(DelaySubscriber2.dispatch, this.delay, {
      source: this,
      destination: this.destination,
      scheduler
    }));
  };
  DelaySubscriber2.prototype.scheduleNotification = function(notification) {
    if (this.errored === true) {
      return;
    }
    var scheduler = this.scheduler;
    var message = new DelayMessage(scheduler.now() + this.delay, notification);
    this.queue.push(message);
    if (this.active === false) {
      this._schedule(scheduler);
    }
  };
  DelaySubscriber2.prototype._next = function(value) {
    this.scheduleNotification(Notification.createNext(value));
  };
  DelaySubscriber2.prototype._error = function(err) {
    this.errored = true;
    this.queue = [];
    this.destination.error(err);
    this.unsubscribe();
  };
  DelaySubscriber2.prototype._complete = function() {
    this.scheduleNotification(Notification.createComplete());
    this.unsubscribe();
  };
  return DelaySubscriber2;
}(Subscriber);
var DelayMessage = /* @__PURE__ */ function() {
  function DelayMessage2(time, notification) {
    this.time = time;
    this.notification = notification;
  }
  return DelayMessage2;
}();
function delayWhen(delayDurationSelector, subscriptionDelay) {
  if (subscriptionDelay) {
    return function(source) {
      return new SubscriptionDelayObservable(source, subscriptionDelay).lift(new DelayWhenOperator(delayDurationSelector));
    };
  }
  return function(source) {
    return source.lift(new DelayWhenOperator(delayDurationSelector));
  };
}
var DelayWhenOperator = /* @__PURE__ */ function() {
  function DelayWhenOperator2(delayDurationSelector) {
    this.delayDurationSelector = delayDurationSelector;
  }
  DelayWhenOperator2.prototype.call = function(subscriber, source) {
    return source.subscribe(new DelayWhenSubscriber(subscriber, this.delayDurationSelector));
  };
  return DelayWhenOperator2;
}();
var DelayWhenSubscriber = /* @__PURE__ */ function(_super) {
  __extends(DelayWhenSubscriber2, _super);
  function DelayWhenSubscriber2(destination, delayDurationSelector) {
    var _this = _super.call(this, destination) || this;
    _this.delayDurationSelector = delayDurationSelector;
    _this.completed = false;
    _this.delayNotifierSubscriptions = [];
    _this.index = 0;
    return _this;
  }
  DelayWhenSubscriber2.prototype.notifyNext = function(outerValue, _innerValue, _outerIndex, _innerIndex, innerSub) {
    this.destination.next(outerValue);
    this.removeSubscription(innerSub);
    this.tryComplete();
  };
  DelayWhenSubscriber2.prototype.notifyError = function(error, innerSub) {
    this._error(error);
  };
  DelayWhenSubscriber2.prototype.notifyComplete = function(innerSub) {
    var value = this.removeSubscription(innerSub);
    if (value) {
      this.destination.next(value);
    }
    this.tryComplete();
  };
  DelayWhenSubscriber2.prototype._next = function(value) {
    var index2 = this.index++;
    try {
      var delayNotifier = this.delayDurationSelector(value, index2);
      if (delayNotifier) {
        this.tryDelay(delayNotifier, value);
      }
    } catch (err) {
      this.destination.error(err);
    }
  };
  DelayWhenSubscriber2.prototype._complete = function() {
    this.completed = true;
    this.tryComplete();
    this.unsubscribe();
  };
  DelayWhenSubscriber2.prototype.removeSubscription = function(subscription) {
    subscription.unsubscribe();
    var subscriptionIdx = this.delayNotifierSubscriptions.indexOf(subscription);
    if (subscriptionIdx !== -1) {
      this.delayNotifierSubscriptions.splice(subscriptionIdx, 1);
    }
    return subscription.outerValue;
  };
  DelayWhenSubscriber2.prototype.tryDelay = function(delayNotifier, value) {
    var notifierSubscription = subscribeToResult(this, delayNotifier, value);
    if (notifierSubscription && !notifierSubscription.closed) {
      var destination = this.destination;
      destination.add(notifierSubscription);
      this.delayNotifierSubscriptions.push(notifierSubscription);
    }
  };
  DelayWhenSubscriber2.prototype.tryComplete = function() {
    if (this.completed && this.delayNotifierSubscriptions.length === 0) {
      this.destination.complete();
    }
  };
  return DelayWhenSubscriber2;
}(OuterSubscriber);
var SubscriptionDelayObservable = /* @__PURE__ */ function(_super) {
  __extends(SubscriptionDelayObservable2, _super);
  function SubscriptionDelayObservable2(source, subscriptionDelay) {
    var _this = _super.call(this) || this;
    _this.source = source;
    _this.subscriptionDelay = subscriptionDelay;
    return _this;
  }
  SubscriptionDelayObservable2.prototype._subscribe = function(subscriber) {
    this.subscriptionDelay.subscribe(new SubscriptionDelaySubscriber(subscriber, this.source));
  };
  return SubscriptionDelayObservable2;
}(Observable);
var SubscriptionDelaySubscriber = /* @__PURE__ */ function(_super) {
  __extends(SubscriptionDelaySubscriber2, _super);
  function SubscriptionDelaySubscriber2(parent, source) {
    var _this = _super.call(this) || this;
    _this.parent = parent;
    _this.source = source;
    _this.sourceSubscribed = false;
    return _this;
  }
  SubscriptionDelaySubscriber2.prototype._next = function(unused) {
    this.subscribeToSource();
  };
  SubscriptionDelaySubscriber2.prototype._error = function(err) {
    this.unsubscribe();
    this.parent.error(err);
  };
  SubscriptionDelaySubscriber2.prototype._complete = function() {
    this.unsubscribe();
    this.subscribeToSource();
  };
  SubscriptionDelaySubscriber2.prototype.subscribeToSource = function() {
    if (!this.sourceSubscribed) {
      this.sourceSubscribed = true;
      this.unsubscribe();
      this.source.subscribe(this.parent);
    }
  };
  return SubscriptionDelaySubscriber2;
}(Subscriber);
function dematerialize() {
  return function dematerializeOperatorFunction(source) {
    return source.lift(new DeMaterializeOperator());
  };
}
var DeMaterializeOperator = /* @__PURE__ */ function() {
  function DeMaterializeOperator2() {
  }
  DeMaterializeOperator2.prototype.call = function(subscriber, source) {
    return source.subscribe(new DeMaterializeSubscriber(subscriber));
  };
  return DeMaterializeOperator2;
}();
var DeMaterializeSubscriber = /* @__PURE__ */ function(_super) {
  __extends(DeMaterializeSubscriber2, _super);
  function DeMaterializeSubscriber2(destination) {
    return _super.call(this, destination) || this;
  }
  DeMaterializeSubscriber2.prototype._next = function(value) {
    value.observe(this.destination);
  };
  return DeMaterializeSubscriber2;
}(Subscriber);
function distinct(keySelector, flushes) {
  return function(source) {
    return source.lift(new DistinctOperator(keySelector, flushes));
  };
}
var DistinctOperator = /* @__PURE__ */ function() {
  function DistinctOperator2(keySelector, flushes) {
    this.keySelector = keySelector;
    this.flushes = flushes;
  }
  DistinctOperator2.prototype.call = function(subscriber, source) {
    return source.subscribe(new DistinctSubscriber(subscriber, this.keySelector, this.flushes));
  };
  return DistinctOperator2;
}();
var DistinctSubscriber = /* @__PURE__ */ function(_super) {
  __extends(DistinctSubscriber2, _super);
  function DistinctSubscriber2(destination, keySelector, flushes) {
    var _this = _super.call(this, destination) || this;
    _this.keySelector = keySelector;
    _this.values = /* @__PURE__ */ new Set();
    if (flushes) {
      _this.add(innerSubscribe(flushes, new SimpleInnerSubscriber(_this)));
    }
    return _this;
  }
  DistinctSubscriber2.prototype.notifyNext = function() {
    this.values.clear();
  };
  DistinctSubscriber2.prototype.notifyError = function(error) {
    this._error(error);
  };
  DistinctSubscriber2.prototype._next = function(value) {
    if (this.keySelector) {
      this._useKeySelector(value);
    } else {
      this._finalizeNext(value, value);
    }
  };
  DistinctSubscriber2.prototype._useKeySelector = function(value) {
    var key;
    var destination = this.destination;
    try {
      key = this.keySelector(value);
    } catch (err) {
      destination.error(err);
      return;
    }
    this._finalizeNext(key, value);
  };
  DistinctSubscriber2.prototype._finalizeNext = function(key, value) {
    var values = this.values;
    if (!values.has(key)) {
      values.add(key);
      this.destination.next(value);
    }
  };
  return DistinctSubscriber2;
}(SimpleOuterSubscriber);
function distinctUntilChanged(compare, keySelector) {
  return function(source) {
    return source.lift(new DistinctUntilChangedOperator(compare, keySelector));
  };
}
var DistinctUntilChangedOperator = /* @__PURE__ */ function() {
  function DistinctUntilChangedOperator2(compare, keySelector) {
    this.compare = compare;
    this.keySelector = keySelector;
  }
  DistinctUntilChangedOperator2.prototype.call = function(subscriber, source) {
    return source.subscribe(new DistinctUntilChangedSubscriber(subscriber, this.compare, this.keySelector));
  };
  return DistinctUntilChangedOperator2;
}();
var DistinctUntilChangedSubscriber = /* @__PURE__ */ function(_super) {
  __extends(DistinctUntilChangedSubscriber2, _super);
  function DistinctUntilChangedSubscriber2(destination, compare, keySelector) {
    var _this = _super.call(this, destination) || this;
    _this.keySelector = keySelector;
    _this.hasKey = false;
    if (typeof compare === "function") {
      _this.compare = compare;
    }
    return _this;
  }
  DistinctUntilChangedSubscriber2.prototype.compare = function(x2, y2) {
    return x2 === y2;
  };
  DistinctUntilChangedSubscriber2.prototype._next = function(value) {
    var key;
    try {
      var keySelector = this.keySelector;
      key = keySelector ? keySelector(value) : value;
    } catch (err) {
      return this.destination.error(err);
    }
    var result = false;
    if (this.hasKey) {
      try {
        var compare = this.compare;
        result = compare(this.key, key);
      } catch (err) {
        return this.destination.error(err);
      }
    } else {
      this.hasKey = true;
    }
    if (!result) {
      this.key = key;
      this.destination.next(value);
    }
  };
  return DistinctUntilChangedSubscriber2;
}(Subscriber);
function distinctUntilKeyChanged(key, compare) {
  return distinctUntilChanged(function(x2, y2) {
    return compare ? compare(x2[key], y2[key]) : x2[key] === y2[key];
  });
}
function throwIfEmpty(errorFactory) {
  if (errorFactory === void 0) {
    errorFactory = defaultErrorFactory;
  }
  return function(source) {
    return source.lift(new ThrowIfEmptyOperator(errorFactory));
  };
}
var ThrowIfEmptyOperator = /* @__PURE__ */ function() {
  function ThrowIfEmptyOperator2(errorFactory) {
    this.errorFactory = errorFactory;
  }
  ThrowIfEmptyOperator2.prototype.call = function(subscriber, source) {
    return source.subscribe(new ThrowIfEmptySubscriber(subscriber, this.errorFactory));
  };
  return ThrowIfEmptyOperator2;
}();
var ThrowIfEmptySubscriber = /* @__PURE__ */ function(_super) {
  __extends(ThrowIfEmptySubscriber2, _super);
  function ThrowIfEmptySubscriber2(destination, errorFactory) {
    var _this = _super.call(this, destination) || this;
    _this.errorFactory = errorFactory;
    _this.hasValue = false;
    return _this;
  }
  ThrowIfEmptySubscriber2.prototype._next = function(value) {
    this.hasValue = true;
    this.destination.next(value);
  };
  ThrowIfEmptySubscriber2.prototype._complete = function() {
    if (!this.hasValue) {
      var err = void 0;
      try {
        err = this.errorFactory();
      } catch (e2) {
        err = e2;
      }
      this.destination.error(err);
    } else {
      return this.destination.complete();
    }
  };
  return ThrowIfEmptySubscriber2;
}(Subscriber);
function defaultErrorFactory() {
  return new EmptyError();
}
function take(count2) {
  return function(source) {
    if (count2 === 0) {
      return empty();
    } else {
      return source.lift(new TakeOperator(count2));
    }
  };
}
var TakeOperator = /* @__PURE__ */ function() {
  function TakeOperator2(total) {
    this.total = total;
    if (this.total < 0) {
      throw new ArgumentOutOfRangeError();
    }
  }
  TakeOperator2.prototype.call = function(subscriber, source) {
    return source.subscribe(new TakeSubscriber(subscriber, this.total));
  };
  return TakeOperator2;
}();
var TakeSubscriber = /* @__PURE__ */ function(_super) {
  __extends(TakeSubscriber2, _super);
  function TakeSubscriber2(destination, total) {
    var _this = _super.call(this, destination) || this;
    _this.total = total;
    _this.count = 0;
    return _this;
  }
  TakeSubscriber2.prototype._next = function(value) {
    var total = this.total;
    var count2 = ++this.count;
    if (count2 <= total) {
      this.destination.next(value);
      if (count2 === total) {
        this.destination.complete();
        this.unsubscribe();
      }
    }
  };
  return TakeSubscriber2;
}(Subscriber);
function elementAt(index2, defaultValue) {
  if (index2 < 0) {
    throw new ArgumentOutOfRangeError();
  }
  var hasDefaultValue = arguments.length >= 2;
  return function(source) {
    return source.pipe(filter(function(v2, i) {
      return i === index2;
    }), take(1), hasDefaultValue ? defaultIfEmpty(defaultValue) : throwIfEmpty(function() {
      return new ArgumentOutOfRangeError();
    }));
  };
}
function endWith() {
  var array = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    array[_i] = arguments[_i];
  }
  return function(source) {
    return concat$1(source, of.apply(void 0, array));
  };
}
function every(predicate, thisArg) {
  return function(source) {
    return source.lift(new EveryOperator(predicate, thisArg, source));
  };
}
var EveryOperator = /* @__PURE__ */ function() {
  function EveryOperator2(predicate, thisArg, source) {
    this.predicate = predicate;
    this.thisArg = thisArg;
    this.source = source;
  }
  EveryOperator2.prototype.call = function(observer, source) {
    return source.subscribe(new EverySubscriber(observer, this.predicate, this.thisArg, this.source));
  };
  return EveryOperator2;
}();
var EverySubscriber = /* @__PURE__ */ function(_super) {
  __extends(EverySubscriber2, _super);
  function EverySubscriber2(destination, predicate, thisArg, source) {
    var _this = _super.call(this, destination) || this;
    _this.predicate = predicate;
    _this.thisArg = thisArg;
    _this.source = source;
    _this.index = 0;
    _this.thisArg = thisArg || _this;
    return _this;
  }
  EverySubscriber2.prototype.notifyComplete = function(everyValueMatch) {
    this.destination.next(everyValueMatch);
    this.destination.complete();
  };
  EverySubscriber2.prototype._next = function(value) {
    var result = false;
    try {
      result = this.predicate.call(this.thisArg, value, this.index++, this.source);
    } catch (err) {
      this.destination.error(err);
      return;
    }
    if (!result) {
      this.notifyComplete(false);
    }
  };
  EverySubscriber2.prototype._complete = function() {
    this.notifyComplete(true);
  };
  return EverySubscriber2;
}(Subscriber);
function exhaust() {
  return function(source) {
    return source.lift(new SwitchFirstOperator());
  };
}
var SwitchFirstOperator = /* @__PURE__ */ function() {
  function SwitchFirstOperator2() {
  }
  SwitchFirstOperator2.prototype.call = function(subscriber, source) {
    return source.subscribe(new SwitchFirstSubscriber(subscriber));
  };
  return SwitchFirstOperator2;
}();
var SwitchFirstSubscriber = /* @__PURE__ */ function(_super) {
  __extends(SwitchFirstSubscriber2, _super);
  function SwitchFirstSubscriber2(destination) {
    var _this = _super.call(this, destination) || this;
    _this.hasCompleted = false;
    _this.hasSubscription = false;
    return _this;
  }
  SwitchFirstSubscriber2.prototype._next = function(value) {
    if (!this.hasSubscription) {
      this.hasSubscription = true;
      this.add(innerSubscribe(value, new SimpleInnerSubscriber(this)));
    }
  };
  SwitchFirstSubscriber2.prototype._complete = function() {
    this.hasCompleted = true;
    if (!this.hasSubscription) {
      this.destination.complete();
    }
  };
  SwitchFirstSubscriber2.prototype.notifyComplete = function() {
    this.hasSubscription = false;
    if (this.hasCompleted) {
      this.destination.complete();
    }
  };
  return SwitchFirstSubscriber2;
}(SimpleOuterSubscriber);
function exhaustMap(project, resultSelector) {
  if (resultSelector) {
    return function(source) {
      return source.pipe(exhaustMap(function(a2, i) {
        return from(project(a2, i)).pipe(map(function(b2, ii) {
          return resultSelector(a2, b2, i, ii);
        }));
      }));
    };
  }
  return function(source) {
    return source.lift(new ExhaustMapOperator(project));
  };
}
var ExhaustMapOperator = /* @__PURE__ */ function() {
  function ExhaustMapOperator2(project) {
    this.project = project;
  }
  ExhaustMapOperator2.prototype.call = function(subscriber, source) {
    return source.subscribe(new ExhaustMapSubscriber(subscriber, this.project));
  };
  return ExhaustMapOperator2;
}();
var ExhaustMapSubscriber = /* @__PURE__ */ function(_super) {
  __extends(ExhaustMapSubscriber2, _super);
  function ExhaustMapSubscriber2(destination, project) {
    var _this = _super.call(this, destination) || this;
    _this.project = project;
    _this.hasSubscription = false;
    _this.hasCompleted = false;
    _this.index = 0;
    return _this;
  }
  ExhaustMapSubscriber2.prototype._next = function(value) {
    if (!this.hasSubscription) {
      this.tryNext(value);
    }
  };
  ExhaustMapSubscriber2.prototype.tryNext = function(value) {
    var result;
    var index2 = this.index++;
    try {
      result = this.project(value, index2);
    } catch (err) {
      this.destination.error(err);
      return;
    }
    this.hasSubscription = true;
    this._innerSub(result);
  };
  ExhaustMapSubscriber2.prototype._innerSub = function(result) {
    var innerSubscriber = new SimpleInnerSubscriber(this);
    var destination = this.destination;
    destination.add(innerSubscriber);
    var innerSubscription = innerSubscribe(result, innerSubscriber);
    if (innerSubscription !== innerSubscriber) {
      destination.add(innerSubscription);
    }
  };
  ExhaustMapSubscriber2.prototype._complete = function() {
    this.hasCompleted = true;
    if (!this.hasSubscription) {
      this.destination.complete();
    }
    this.unsubscribe();
  };
  ExhaustMapSubscriber2.prototype.notifyNext = function(innerValue) {
    this.destination.next(innerValue);
  };
  ExhaustMapSubscriber2.prototype.notifyError = function(err) {
    this.destination.error(err);
  };
  ExhaustMapSubscriber2.prototype.notifyComplete = function() {
    this.hasSubscription = false;
    if (this.hasCompleted) {
      this.destination.complete();
    }
  };
  return ExhaustMapSubscriber2;
}(SimpleOuterSubscriber);
function expand(project, concurrent, scheduler) {
  if (concurrent === void 0) {
    concurrent = Number.POSITIVE_INFINITY;
  }
  concurrent = (concurrent || 0) < 1 ? Number.POSITIVE_INFINITY : concurrent;
  return function(source) {
    return source.lift(new ExpandOperator(project, concurrent, scheduler));
  };
}
var ExpandOperator = /* @__PURE__ */ function() {
  function ExpandOperator2(project, concurrent, scheduler) {
    this.project = project;
    this.concurrent = concurrent;
    this.scheduler = scheduler;
  }
  ExpandOperator2.prototype.call = function(subscriber, source) {
    return source.subscribe(new ExpandSubscriber(subscriber, this.project, this.concurrent, this.scheduler));
  };
  return ExpandOperator2;
}();
var ExpandSubscriber = /* @__PURE__ */ function(_super) {
  __extends(ExpandSubscriber2, _super);
  function ExpandSubscriber2(destination, project, concurrent, scheduler) {
    var _this = _super.call(this, destination) || this;
    _this.project = project;
    _this.concurrent = concurrent;
    _this.scheduler = scheduler;
    _this.index = 0;
    _this.active = 0;
    _this.hasCompleted = false;
    if (concurrent < Number.POSITIVE_INFINITY) {
      _this.buffer = [];
    }
    return _this;
  }
  ExpandSubscriber2.dispatch = function(arg) {
    var subscriber = arg.subscriber, result = arg.result, value = arg.value, index2 = arg.index;
    subscriber.subscribeToProjection(result, value, index2);
  };
  ExpandSubscriber2.prototype._next = function(value) {
    var destination = this.destination;
    if (destination.closed) {
      this._complete();
      return;
    }
    var index2 = this.index++;
    if (this.active < this.concurrent) {
      destination.next(value);
      try {
        var project = this.project;
        var result = project(value, index2);
        if (!this.scheduler) {
          this.subscribeToProjection(result, value, index2);
        } else {
          var state = { subscriber: this, result, value, index: index2 };
          var destination_1 = this.destination;
          destination_1.add(this.scheduler.schedule(ExpandSubscriber2.dispatch, 0, state));
        }
      } catch (e2) {
        destination.error(e2);
      }
    } else {
      this.buffer.push(value);
    }
  };
  ExpandSubscriber2.prototype.subscribeToProjection = function(result, value, index2) {
    this.active++;
    var destination = this.destination;
    destination.add(innerSubscribe(result, new SimpleInnerSubscriber(this)));
  };
  ExpandSubscriber2.prototype._complete = function() {
    this.hasCompleted = true;
    if (this.hasCompleted && this.active === 0) {
      this.destination.complete();
    }
    this.unsubscribe();
  };
  ExpandSubscriber2.prototype.notifyNext = function(innerValue) {
    this._next(innerValue);
  };
  ExpandSubscriber2.prototype.notifyComplete = function() {
    var buffer2 = this.buffer;
    this.active--;
    if (buffer2 && buffer2.length > 0) {
      this._next(buffer2.shift());
    }
    if (this.hasCompleted && this.active === 0) {
      this.destination.complete();
    }
  };
  return ExpandSubscriber2;
}(SimpleOuterSubscriber);
function finalize(callback) {
  return function(source) {
    return source.lift(new FinallyOperator(callback));
  };
}
var FinallyOperator = /* @__PURE__ */ function() {
  function FinallyOperator2(callback) {
    this.callback = callback;
  }
  FinallyOperator2.prototype.call = function(subscriber, source) {
    return source.subscribe(new FinallySubscriber(subscriber, this.callback));
  };
  return FinallyOperator2;
}();
var FinallySubscriber = /* @__PURE__ */ function(_super) {
  __extends(FinallySubscriber2, _super);
  function FinallySubscriber2(destination, callback) {
    var _this = _super.call(this, destination) || this;
    _this.add(new Subscription(callback));
    return _this;
  }
  return FinallySubscriber2;
}(Subscriber);
function find(predicate, thisArg) {
  if (typeof predicate !== "function") {
    throw new TypeError("predicate is not a function");
  }
  return function(source) {
    return source.lift(new FindValueOperator(predicate, source, false, thisArg));
  };
}
var FindValueOperator = /* @__PURE__ */ function() {
  function FindValueOperator2(predicate, source, yieldIndex, thisArg) {
    this.predicate = predicate;
    this.source = source;
    this.yieldIndex = yieldIndex;
    this.thisArg = thisArg;
  }
  FindValueOperator2.prototype.call = function(observer, source) {
    return source.subscribe(new FindValueSubscriber(observer, this.predicate, this.source, this.yieldIndex, this.thisArg));
  };
  return FindValueOperator2;
}();
var FindValueSubscriber = /* @__PURE__ */ function(_super) {
  __extends(FindValueSubscriber2, _super);
  function FindValueSubscriber2(destination, predicate, source, yieldIndex, thisArg) {
    var _this = _super.call(this, destination) || this;
    _this.predicate = predicate;
    _this.source = source;
    _this.yieldIndex = yieldIndex;
    _this.thisArg = thisArg;
    _this.index = 0;
    return _this;
  }
  FindValueSubscriber2.prototype.notifyComplete = function(value) {
    var destination = this.destination;
    destination.next(value);
    destination.complete();
    this.unsubscribe();
  };
  FindValueSubscriber2.prototype._next = function(value) {
    var _a = this, predicate = _a.predicate, thisArg = _a.thisArg;
    var index2 = this.index++;
    try {
      var result = predicate.call(thisArg || this, value, index2, this.source);
      if (result) {
        this.notifyComplete(this.yieldIndex ? index2 : value);
      }
    } catch (err) {
      this.destination.error(err);
    }
  };
  FindValueSubscriber2.prototype._complete = function() {
    this.notifyComplete(this.yieldIndex ? -1 : void 0);
  };
  return FindValueSubscriber2;
}(Subscriber);
function findIndex(predicate, thisArg) {
  return function(source) {
    return source.lift(new FindValueOperator(predicate, source, true, thisArg));
  };
}
function first(predicate, defaultValue) {
  var hasDefaultValue = arguments.length >= 2;
  return function(source) {
    return source.pipe(predicate ? filter(function(v2, i) {
      return predicate(v2, i, source);
    }) : identity, take(1), hasDefaultValue ? defaultIfEmpty(defaultValue) : throwIfEmpty(function() {
      return new EmptyError();
    }));
  };
}
function ignoreElements() {
  return function ignoreElementsOperatorFunction(source) {
    return source.lift(new IgnoreElementsOperator());
  };
}
var IgnoreElementsOperator = /* @__PURE__ */ function() {
  function IgnoreElementsOperator2() {
  }
  IgnoreElementsOperator2.prototype.call = function(subscriber, source) {
    return source.subscribe(new IgnoreElementsSubscriber(subscriber));
  };
  return IgnoreElementsOperator2;
}();
var IgnoreElementsSubscriber = /* @__PURE__ */ function(_super) {
  __extends(IgnoreElementsSubscriber2, _super);
  function IgnoreElementsSubscriber2() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  IgnoreElementsSubscriber2.prototype._next = function(unused) {
  };
  return IgnoreElementsSubscriber2;
}(Subscriber);
function isEmpty() {
  return function(source) {
    return source.lift(new IsEmptyOperator());
  };
}
var IsEmptyOperator = /* @__PURE__ */ function() {
  function IsEmptyOperator2() {
  }
  IsEmptyOperator2.prototype.call = function(observer, source) {
    return source.subscribe(new IsEmptySubscriber(observer));
  };
  return IsEmptyOperator2;
}();
var IsEmptySubscriber = /* @__PURE__ */ function(_super) {
  __extends(IsEmptySubscriber2, _super);
  function IsEmptySubscriber2(destination) {
    return _super.call(this, destination) || this;
  }
  IsEmptySubscriber2.prototype.notifyComplete = function(isEmpty2) {
    var destination = this.destination;
    destination.next(isEmpty2);
    destination.complete();
  };
  IsEmptySubscriber2.prototype._next = function(value) {
    this.notifyComplete(false);
  };
  IsEmptySubscriber2.prototype._complete = function() {
    this.notifyComplete(true);
  };
  return IsEmptySubscriber2;
}(Subscriber);
function takeLast(count2) {
  return function takeLastOperatorFunction(source) {
    if (count2 === 0) {
      return empty();
    } else {
      return source.lift(new TakeLastOperator(count2));
    }
  };
}
var TakeLastOperator = /* @__PURE__ */ function() {
  function TakeLastOperator2(total) {
    this.total = total;
    if (this.total < 0) {
      throw new ArgumentOutOfRangeError();
    }
  }
  TakeLastOperator2.prototype.call = function(subscriber, source) {
    return source.subscribe(new TakeLastSubscriber(subscriber, this.total));
  };
  return TakeLastOperator2;
}();
var TakeLastSubscriber = /* @__PURE__ */ function(_super) {
  __extends(TakeLastSubscriber2, _super);
  function TakeLastSubscriber2(destination, total) {
    var _this = _super.call(this, destination) || this;
    _this.total = total;
    _this.ring = new Array();
    _this.count = 0;
    return _this;
  }
  TakeLastSubscriber2.prototype._next = function(value) {
    var ring = this.ring;
    var total = this.total;
    var count2 = this.count++;
    if (ring.length < total) {
      ring.push(value);
    } else {
      var index2 = count2 % total;
      ring[index2] = value;
    }
  };
  TakeLastSubscriber2.prototype._complete = function() {
    var destination = this.destination;
    var count2 = this.count;
    if (count2 > 0) {
      var total = this.count >= this.total ? this.total : this.count;
      var ring = this.ring;
      for (var i = 0; i < total; i++) {
        var idx = count2++ % total;
        destination.next(ring[idx]);
      }
    }
    destination.complete();
  };
  return TakeLastSubscriber2;
}(Subscriber);
function last(predicate, defaultValue) {
  var hasDefaultValue = arguments.length >= 2;
  return function(source) {
    return source.pipe(predicate ? filter(function(v2, i) {
      return predicate(v2, i, source);
    }) : identity, takeLast(1), hasDefaultValue ? defaultIfEmpty(defaultValue) : throwIfEmpty(function() {
      return new EmptyError();
    }));
  };
}
function mapTo(value) {
  return function(source) {
    return source.lift(new MapToOperator(value));
  };
}
var MapToOperator = /* @__PURE__ */ function() {
  function MapToOperator2(value) {
    this.value = value;
  }
  MapToOperator2.prototype.call = function(subscriber, source) {
    return source.subscribe(new MapToSubscriber(subscriber, this.value));
  };
  return MapToOperator2;
}();
var MapToSubscriber = /* @__PURE__ */ function(_super) {
  __extends(MapToSubscriber2, _super);
  function MapToSubscriber2(destination, value) {
    var _this = _super.call(this, destination) || this;
    _this.value = value;
    return _this;
  }
  MapToSubscriber2.prototype._next = function(x2) {
    this.destination.next(this.value);
  };
  return MapToSubscriber2;
}(Subscriber);
function materialize() {
  return function materializeOperatorFunction(source) {
    return source.lift(new MaterializeOperator());
  };
}
var MaterializeOperator = /* @__PURE__ */ function() {
  function MaterializeOperator2() {
  }
  MaterializeOperator2.prototype.call = function(subscriber, source) {
    return source.subscribe(new MaterializeSubscriber(subscriber));
  };
  return MaterializeOperator2;
}();
var MaterializeSubscriber = /* @__PURE__ */ function(_super) {
  __extends(MaterializeSubscriber2, _super);
  function MaterializeSubscriber2(destination) {
    return _super.call(this, destination) || this;
  }
  MaterializeSubscriber2.prototype._next = function(value) {
    this.destination.next(Notification.createNext(value));
  };
  MaterializeSubscriber2.prototype._error = function(err) {
    var destination = this.destination;
    destination.next(Notification.createError(err));
    destination.complete();
  };
  MaterializeSubscriber2.prototype._complete = function() {
    var destination = this.destination;
    destination.next(Notification.createComplete());
    destination.complete();
  };
  return MaterializeSubscriber2;
}(Subscriber);
function scan(accumulator, seed) {
  var hasSeed = false;
  if (arguments.length >= 2) {
    hasSeed = true;
  }
  return function scanOperatorFunction(source) {
    return source.lift(new ScanOperator(accumulator, seed, hasSeed));
  };
}
var ScanOperator = /* @__PURE__ */ function() {
  function ScanOperator2(accumulator, seed, hasSeed) {
    if (hasSeed === void 0) {
      hasSeed = false;
    }
    this.accumulator = accumulator;
    this.seed = seed;
    this.hasSeed = hasSeed;
  }
  ScanOperator2.prototype.call = function(subscriber, source) {
    return source.subscribe(new ScanSubscriber(subscriber, this.accumulator, this.seed, this.hasSeed));
  };
  return ScanOperator2;
}();
var ScanSubscriber = /* @__PURE__ */ function(_super) {
  __extends(ScanSubscriber2, _super);
  function ScanSubscriber2(destination, accumulator, _seed, hasSeed) {
    var _this = _super.call(this, destination) || this;
    _this.accumulator = accumulator;
    _this._seed = _seed;
    _this.hasSeed = hasSeed;
    _this.index = 0;
    return _this;
  }
  Object.defineProperty(ScanSubscriber2.prototype, "seed", {
    get: function() {
      return this._seed;
    },
    set: function(value) {
      this.hasSeed = true;
      this._seed = value;
    },
    enumerable: true,
    configurable: true
  });
  ScanSubscriber2.prototype._next = function(value) {
    if (!this.hasSeed) {
      this.seed = value;
      this.destination.next(value);
    } else {
      return this._tryNext(value);
    }
  };
  ScanSubscriber2.prototype._tryNext = function(value) {
    var index2 = this.index++;
    var result;
    try {
      result = this.accumulator(this.seed, value, index2);
    } catch (err) {
      this.destination.error(err);
    }
    this.seed = result;
    this.destination.next(result);
  };
  return ScanSubscriber2;
}(Subscriber);
function reduce(accumulator, seed) {
  if (arguments.length >= 2) {
    return function reduceOperatorFunctionWithSeed(source) {
      return pipe(scan(accumulator, seed), takeLast(1), defaultIfEmpty(seed))(source);
    };
  }
  return function reduceOperatorFunction(source) {
    return pipe(scan(function(acc, value, index2) {
      return accumulator(acc, value, index2 + 1);
    }), takeLast(1))(source);
  };
}
function max(comparer) {
  var max2 = typeof comparer === "function" ? function(x2, y2) {
    return comparer(x2, y2) > 0 ? x2 : y2;
  } : function(x2, y2) {
    return x2 > y2 ? x2 : y2;
  };
  return reduce(max2);
}
function merge$1() {
  var observables = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    observables[_i] = arguments[_i];
  }
  return function(source) {
    return source.lift.call(merge$2.apply(void 0, [source].concat(observables)));
  };
}
function mergeMapTo(innerObservable, resultSelector, concurrent) {
  if (concurrent === void 0) {
    concurrent = Number.POSITIVE_INFINITY;
  }
  if (typeof resultSelector === "function") {
    return mergeMap(function() {
      return innerObservable;
    }, resultSelector, concurrent);
  }
  if (typeof resultSelector === "number") {
    concurrent = resultSelector;
  }
  return mergeMap(function() {
    return innerObservable;
  }, concurrent);
}
function mergeScan(accumulator, seed, concurrent) {
  if (concurrent === void 0) {
    concurrent = Number.POSITIVE_INFINITY;
  }
  return function(source) {
    return source.lift(new MergeScanOperator(accumulator, seed, concurrent));
  };
}
var MergeScanOperator = /* @__PURE__ */ function() {
  function MergeScanOperator2(accumulator, seed, concurrent) {
    this.accumulator = accumulator;
    this.seed = seed;
    this.concurrent = concurrent;
  }
  MergeScanOperator2.prototype.call = function(subscriber, source) {
    return source.subscribe(new MergeScanSubscriber(subscriber, this.accumulator, this.seed, this.concurrent));
  };
  return MergeScanOperator2;
}();
var MergeScanSubscriber = /* @__PURE__ */ function(_super) {
  __extends(MergeScanSubscriber2, _super);
  function MergeScanSubscriber2(destination, accumulator, acc, concurrent) {
    var _this = _super.call(this, destination) || this;
    _this.accumulator = accumulator;
    _this.acc = acc;
    _this.concurrent = concurrent;
    _this.hasValue = false;
    _this.hasCompleted = false;
    _this.buffer = [];
    _this.active = 0;
    _this.index = 0;
    return _this;
  }
  MergeScanSubscriber2.prototype._next = function(value) {
    if (this.active < this.concurrent) {
      var index2 = this.index++;
      var destination = this.destination;
      var ish = void 0;
      try {
        var accumulator = this.accumulator;
        ish = accumulator(this.acc, value, index2);
      } catch (e2) {
        return destination.error(e2);
      }
      this.active++;
      this._innerSub(ish);
    } else {
      this.buffer.push(value);
    }
  };
  MergeScanSubscriber2.prototype._innerSub = function(ish) {
    var innerSubscriber = new SimpleInnerSubscriber(this);
    var destination = this.destination;
    destination.add(innerSubscriber);
    var innerSubscription = innerSubscribe(ish, innerSubscriber);
    if (innerSubscription !== innerSubscriber) {
      destination.add(innerSubscription);
    }
  };
  MergeScanSubscriber2.prototype._complete = function() {
    this.hasCompleted = true;
    if (this.active === 0 && this.buffer.length === 0) {
      if (this.hasValue === false) {
        this.destination.next(this.acc);
      }
      this.destination.complete();
    }
    this.unsubscribe();
  };
  MergeScanSubscriber2.prototype.notifyNext = function(innerValue) {
    var destination = this.destination;
    this.acc = innerValue;
    this.hasValue = true;
    destination.next(innerValue);
  };
  MergeScanSubscriber2.prototype.notifyComplete = function() {
    var buffer2 = this.buffer;
    this.active--;
    if (buffer2.length > 0) {
      this._next(buffer2.shift());
    } else if (this.active === 0 && this.hasCompleted) {
      if (this.hasValue === false) {
        this.destination.next(this.acc);
      }
      this.destination.complete();
    }
  };
  return MergeScanSubscriber2;
}(SimpleOuterSubscriber);
function min(comparer) {
  var min2 = typeof comparer === "function" ? function(x2, y2) {
    return comparer(x2, y2) < 0 ? x2 : y2;
  } : function(x2, y2) {
    return x2 < y2 ? x2 : y2;
  };
  return reduce(min2);
}
function multicast(subjectOrSubjectFactory, selector) {
  return function multicastOperatorFunction(source) {
    var subjectFactory;
    if (typeof subjectOrSubjectFactory === "function") {
      subjectFactory = subjectOrSubjectFactory;
    } else {
      subjectFactory = function subjectFactory2() {
        return subjectOrSubjectFactory;
      };
    }
    if (typeof selector === "function") {
      return source.lift(new MulticastOperator(subjectFactory, selector));
    }
    var connectable = Object.create(source, connectableObservableDescriptor);
    connectable.source = source;
    connectable.subjectFactory = subjectFactory;
    return connectable;
  };
}
var MulticastOperator = /* @__PURE__ */ function() {
  function MulticastOperator2(subjectFactory, selector) {
    this.subjectFactory = subjectFactory;
    this.selector = selector;
  }
  MulticastOperator2.prototype.call = function(subscriber, source) {
    var selector = this.selector;
    var subject = this.subjectFactory();
    var subscription = selector(subject).subscribe(subscriber);
    subscription.add(source.subscribe(subject));
    return subscription;
  };
  return MulticastOperator2;
}();
function onErrorResumeNext() {
  var nextSources = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    nextSources[_i] = arguments[_i];
  }
  if (nextSources.length === 1 && isArray$5(nextSources[0])) {
    nextSources = nextSources[0];
  }
  return function(source) {
    return source.lift(new OnErrorResumeNextOperator(nextSources));
  };
}
var OnErrorResumeNextOperator = /* @__PURE__ */ function() {
  function OnErrorResumeNextOperator2(nextSources) {
    this.nextSources = nextSources;
  }
  OnErrorResumeNextOperator2.prototype.call = function(subscriber, source) {
    return source.subscribe(new OnErrorResumeNextSubscriber(subscriber, this.nextSources));
  };
  return OnErrorResumeNextOperator2;
}();
var OnErrorResumeNextSubscriber = /* @__PURE__ */ function(_super) {
  __extends(OnErrorResumeNextSubscriber2, _super);
  function OnErrorResumeNextSubscriber2(destination, nextSources) {
    var _this = _super.call(this, destination) || this;
    _this.destination = destination;
    _this.nextSources = nextSources;
    return _this;
  }
  OnErrorResumeNextSubscriber2.prototype.notifyError = function() {
    this.subscribeToNextSource();
  };
  OnErrorResumeNextSubscriber2.prototype.notifyComplete = function() {
    this.subscribeToNextSource();
  };
  OnErrorResumeNextSubscriber2.prototype._error = function(err) {
    this.subscribeToNextSource();
    this.unsubscribe();
  };
  OnErrorResumeNextSubscriber2.prototype._complete = function() {
    this.subscribeToNextSource();
    this.unsubscribe();
  };
  OnErrorResumeNextSubscriber2.prototype.subscribeToNextSource = function() {
    var next = this.nextSources.shift();
    if (!!next) {
      var innerSubscriber = new SimpleInnerSubscriber(this);
      var destination = this.destination;
      destination.add(innerSubscriber);
      var innerSubscription = innerSubscribe(next, innerSubscriber);
      if (innerSubscription !== innerSubscriber) {
        destination.add(innerSubscription);
      }
    } else {
      this.destination.complete();
    }
  };
  return OnErrorResumeNextSubscriber2;
}(SimpleOuterSubscriber);
function pairwise() {
  return function(source) {
    return source.lift(new PairwiseOperator());
  };
}
var PairwiseOperator = /* @__PURE__ */ function() {
  function PairwiseOperator2() {
  }
  PairwiseOperator2.prototype.call = function(subscriber, source) {
    return source.subscribe(new PairwiseSubscriber(subscriber));
  };
  return PairwiseOperator2;
}();
var PairwiseSubscriber = /* @__PURE__ */ function(_super) {
  __extends(PairwiseSubscriber2, _super);
  function PairwiseSubscriber2(destination) {
    var _this = _super.call(this, destination) || this;
    _this.hasPrev = false;
    return _this;
  }
  PairwiseSubscriber2.prototype._next = function(value) {
    var pair;
    if (this.hasPrev) {
      pair = [this.prev, value];
    } else {
      this.hasPrev = true;
    }
    this.prev = value;
    if (pair) {
      this.destination.next(pair);
    }
  };
  return PairwiseSubscriber2;
}(Subscriber);
function partition(predicate, thisArg) {
  return function(source) {
    return [
      filter(predicate, thisArg)(source),
      filter(not(predicate, thisArg))(source)
    ];
  };
}
function pluck() {
  var properties = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    properties[_i] = arguments[_i];
  }
  var length = properties.length;
  if (length === 0) {
    throw new Error("list of properties cannot be empty.");
  }
  return function(source) {
    return map(plucker(properties, length))(source);
  };
}
function plucker(props, length) {
  var mapper = function(x2) {
    var currentProp = x2;
    for (var i = 0; i < length; i++) {
      var p2 = currentProp != null ? currentProp[props[i]] : void 0;
      if (p2 !== void 0) {
        currentProp = p2;
      } else {
        return void 0;
      }
    }
    return currentProp;
  };
  return mapper;
}
function publish(selector) {
  return selector ? multicast(function() {
    return new Subject();
  }, selector) : multicast(new Subject());
}
function publishBehavior(value) {
  return function(source) {
    return multicast(new BehaviorSubject(value))(source);
  };
}
function publishLast() {
  return function(source) {
    return multicast(new AsyncSubject())(source);
  };
}
function publishReplay(bufferSize, windowTime2, selectorOrScheduler, scheduler) {
  if (selectorOrScheduler && typeof selectorOrScheduler !== "function") {
    scheduler = selectorOrScheduler;
  }
  var selector = typeof selectorOrScheduler === "function" ? selectorOrScheduler : void 0;
  var subject = new ReplaySubject(bufferSize, windowTime2, scheduler);
  return function(source) {
    return multicast(function() {
      return subject;
    }, selector)(source);
  };
}
function race() {
  var observables = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    observables[_i] = arguments[_i];
  }
  return function raceOperatorFunction(source) {
    if (observables.length === 1 && isArray$5(observables[0])) {
      observables = observables[0];
    }
    return source.lift.call(race$1.apply(void 0, [source].concat(observables)));
  };
}
function repeat(count2) {
  if (count2 === void 0) {
    count2 = -1;
  }
  return function(source) {
    if (count2 === 0) {
      return empty();
    } else if (count2 < 0) {
      return source.lift(new RepeatOperator(-1, source));
    } else {
      return source.lift(new RepeatOperator(count2 - 1, source));
    }
  };
}
var RepeatOperator = /* @__PURE__ */ function() {
  function RepeatOperator2(count2, source) {
    this.count = count2;
    this.source = source;
  }
  RepeatOperator2.prototype.call = function(subscriber, source) {
    return source.subscribe(new RepeatSubscriber(subscriber, this.count, this.source));
  };
  return RepeatOperator2;
}();
var RepeatSubscriber = /* @__PURE__ */ function(_super) {
  __extends(RepeatSubscriber2, _super);
  function RepeatSubscriber2(destination, count2, source) {
    var _this = _super.call(this, destination) || this;
    _this.count = count2;
    _this.source = source;
    return _this;
  }
  RepeatSubscriber2.prototype.complete = function() {
    if (!this.isStopped) {
      var _a = this, source = _a.source, count2 = _a.count;
      if (count2 === 0) {
        return _super.prototype.complete.call(this);
      } else if (count2 > -1) {
        this.count = count2 - 1;
      }
      source.subscribe(this._unsubscribeAndRecycle());
    }
  };
  return RepeatSubscriber2;
}(Subscriber);
function repeatWhen(notifier) {
  return function(source) {
    return source.lift(new RepeatWhenOperator(notifier));
  };
}
var RepeatWhenOperator = /* @__PURE__ */ function() {
  function RepeatWhenOperator2(notifier) {
    this.notifier = notifier;
  }
  RepeatWhenOperator2.prototype.call = function(subscriber, source) {
    return source.subscribe(new RepeatWhenSubscriber(subscriber, this.notifier, source));
  };
  return RepeatWhenOperator2;
}();
var RepeatWhenSubscriber = /* @__PURE__ */ function(_super) {
  __extends(RepeatWhenSubscriber2, _super);
  function RepeatWhenSubscriber2(destination, notifier, source) {
    var _this = _super.call(this, destination) || this;
    _this.notifier = notifier;
    _this.source = source;
    _this.sourceIsBeingSubscribedTo = true;
    return _this;
  }
  RepeatWhenSubscriber2.prototype.notifyNext = function() {
    this.sourceIsBeingSubscribedTo = true;
    this.source.subscribe(this);
  };
  RepeatWhenSubscriber2.prototype.notifyComplete = function() {
    if (this.sourceIsBeingSubscribedTo === false) {
      return _super.prototype.complete.call(this);
    }
  };
  RepeatWhenSubscriber2.prototype.complete = function() {
    this.sourceIsBeingSubscribedTo = false;
    if (!this.isStopped) {
      if (!this.retries) {
        this.subscribeToRetries();
      }
      if (!this.retriesSubscription || this.retriesSubscription.closed) {
        return _super.prototype.complete.call(this);
      }
      this._unsubscribeAndRecycle();
      this.notifications.next(void 0);
    }
  };
  RepeatWhenSubscriber2.prototype._unsubscribe = function() {
    var _a = this, notifications = _a.notifications, retriesSubscription = _a.retriesSubscription;
    if (notifications) {
      notifications.unsubscribe();
      this.notifications = void 0;
    }
    if (retriesSubscription) {
      retriesSubscription.unsubscribe();
      this.retriesSubscription = void 0;
    }
    this.retries = void 0;
  };
  RepeatWhenSubscriber2.prototype._unsubscribeAndRecycle = function() {
    var _unsubscribe = this._unsubscribe;
    this._unsubscribe = null;
    _super.prototype._unsubscribeAndRecycle.call(this);
    this._unsubscribe = _unsubscribe;
    return this;
  };
  RepeatWhenSubscriber2.prototype.subscribeToRetries = function() {
    this.notifications = new Subject();
    var retries;
    try {
      var notifier = this.notifier;
      retries = notifier(this.notifications);
    } catch (e2) {
      return _super.prototype.complete.call(this);
    }
    this.retries = retries;
    this.retriesSubscription = innerSubscribe(retries, new SimpleInnerSubscriber(this));
  };
  return RepeatWhenSubscriber2;
}(SimpleOuterSubscriber);
function retry(count2) {
  if (count2 === void 0) {
    count2 = -1;
  }
  return function(source) {
    return source.lift(new RetryOperator(count2, source));
  };
}
var RetryOperator = /* @__PURE__ */ function() {
  function RetryOperator2(count2, source) {
    this.count = count2;
    this.source = source;
  }
  RetryOperator2.prototype.call = function(subscriber, source) {
    return source.subscribe(new RetrySubscriber(subscriber, this.count, this.source));
  };
  return RetryOperator2;
}();
var RetrySubscriber = /* @__PURE__ */ function(_super) {
  __extends(RetrySubscriber2, _super);
  function RetrySubscriber2(destination, count2, source) {
    var _this = _super.call(this, destination) || this;
    _this.count = count2;
    _this.source = source;
    return _this;
  }
  RetrySubscriber2.prototype.error = function(err) {
    if (!this.isStopped) {
      var _a = this, source = _a.source, count2 = _a.count;
      if (count2 === 0) {
        return _super.prototype.error.call(this, err);
      } else if (count2 > -1) {
        this.count = count2 - 1;
      }
      source.subscribe(this._unsubscribeAndRecycle());
    }
  };
  return RetrySubscriber2;
}(Subscriber);
function retryWhen(notifier) {
  return function(source) {
    return source.lift(new RetryWhenOperator(notifier, source));
  };
}
var RetryWhenOperator = /* @__PURE__ */ function() {
  function RetryWhenOperator2(notifier, source) {
    this.notifier = notifier;
    this.source = source;
  }
  RetryWhenOperator2.prototype.call = function(subscriber, source) {
    return source.subscribe(new RetryWhenSubscriber(subscriber, this.notifier, this.source));
  };
  return RetryWhenOperator2;
}();
var RetryWhenSubscriber = /* @__PURE__ */ function(_super) {
  __extends(RetryWhenSubscriber2, _super);
  function RetryWhenSubscriber2(destination, notifier, source) {
    var _this = _super.call(this, destination) || this;
    _this.notifier = notifier;
    _this.source = source;
    return _this;
  }
  RetryWhenSubscriber2.prototype.error = function(err) {
    if (!this.isStopped) {
      var errors2 = this.errors;
      var retries = this.retries;
      var retriesSubscription = this.retriesSubscription;
      if (!retries) {
        errors2 = new Subject();
        try {
          var notifier = this.notifier;
          retries = notifier(errors2);
        } catch (e2) {
          return _super.prototype.error.call(this, e2);
        }
        retriesSubscription = innerSubscribe(retries, new SimpleInnerSubscriber(this));
      } else {
        this.errors = void 0;
        this.retriesSubscription = void 0;
      }
      this._unsubscribeAndRecycle();
      this.errors = errors2;
      this.retries = retries;
      this.retriesSubscription = retriesSubscription;
      errors2.next(err);
    }
  };
  RetryWhenSubscriber2.prototype._unsubscribe = function() {
    var _a = this, errors2 = _a.errors, retriesSubscription = _a.retriesSubscription;
    if (errors2) {
      errors2.unsubscribe();
      this.errors = void 0;
    }
    if (retriesSubscription) {
      retriesSubscription.unsubscribe();
      this.retriesSubscription = void 0;
    }
    this.retries = void 0;
  };
  RetryWhenSubscriber2.prototype.notifyNext = function() {
    var _unsubscribe = this._unsubscribe;
    this._unsubscribe = null;
    this._unsubscribeAndRecycle();
    this._unsubscribe = _unsubscribe;
    this.source.subscribe(this);
  };
  return RetryWhenSubscriber2;
}(SimpleOuterSubscriber);
function sample(notifier) {
  return function(source) {
    return source.lift(new SampleOperator(notifier));
  };
}
var SampleOperator = /* @__PURE__ */ function() {
  function SampleOperator2(notifier) {
    this.notifier = notifier;
  }
  SampleOperator2.prototype.call = function(subscriber, source) {
    var sampleSubscriber = new SampleSubscriber(subscriber);
    var subscription = source.subscribe(sampleSubscriber);
    subscription.add(innerSubscribe(this.notifier, new SimpleInnerSubscriber(sampleSubscriber)));
    return subscription;
  };
  return SampleOperator2;
}();
var SampleSubscriber = /* @__PURE__ */ function(_super) {
  __extends(SampleSubscriber2, _super);
  function SampleSubscriber2() {
    var _this = _super !== null && _super.apply(this, arguments) || this;
    _this.hasValue = false;
    return _this;
  }
  SampleSubscriber2.prototype._next = function(value) {
    this.value = value;
    this.hasValue = true;
  };
  SampleSubscriber2.prototype.notifyNext = function() {
    this.emitValue();
  };
  SampleSubscriber2.prototype.notifyComplete = function() {
    this.emitValue();
  };
  SampleSubscriber2.prototype.emitValue = function() {
    if (this.hasValue) {
      this.hasValue = false;
      this.destination.next(this.value);
    }
  };
  return SampleSubscriber2;
}(SimpleOuterSubscriber);
function sampleTime(period, scheduler) {
  if (scheduler === void 0) {
    scheduler = async;
  }
  return function(source) {
    return source.lift(new SampleTimeOperator(period, scheduler));
  };
}
var SampleTimeOperator = /* @__PURE__ */ function() {
  function SampleTimeOperator2(period, scheduler) {
    this.period = period;
    this.scheduler = scheduler;
  }
  SampleTimeOperator2.prototype.call = function(subscriber, source) {
    return source.subscribe(new SampleTimeSubscriber(subscriber, this.period, this.scheduler));
  };
  return SampleTimeOperator2;
}();
var SampleTimeSubscriber = /* @__PURE__ */ function(_super) {
  __extends(SampleTimeSubscriber2, _super);
  function SampleTimeSubscriber2(destination, period, scheduler) {
    var _this = _super.call(this, destination) || this;
    _this.period = period;
    _this.scheduler = scheduler;
    _this.hasValue = false;
    _this.add(scheduler.schedule(dispatchNotification, period, { subscriber: _this, period }));
    return _this;
  }
  SampleTimeSubscriber2.prototype._next = function(value) {
    this.lastValue = value;
    this.hasValue = true;
  };
  SampleTimeSubscriber2.prototype.notifyNext = function() {
    if (this.hasValue) {
      this.hasValue = false;
      this.destination.next(this.lastValue);
    }
  };
  return SampleTimeSubscriber2;
}(Subscriber);
function dispatchNotification(state) {
  var subscriber = state.subscriber, period = state.period;
  subscriber.notifyNext();
  this.schedule(state, period);
}
function sequenceEqual(compareTo, comparator) {
  return function(source) {
    return source.lift(new SequenceEqualOperator(compareTo, comparator));
  };
}
var SequenceEqualOperator = /* @__PURE__ */ function() {
  function SequenceEqualOperator2(compareTo, comparator) {
    this.compareTo = compareTo;
    this.comparator = comparator;
  }
  SequenceEqualOperator2.prototype.call = function(subscriber, source) {
    return source.subscribe(new SequenceEqualSubscriber(subscriber, this.compareTo, this.comparator));
  };
  return SequenceEqualOperator2;
}();
var SequenceEqualSubscriber = /* @__PURE__ */ function(_super) {
  __extends(SequenceEqualSubscriber2, _super);
  function SequenceEqualSubscriber2(destination, compareTo, comparator) {
    var _this = _super.call(this, destination) || this;
    _this.compareTo = compareTo;
    _this.comparator = comparator;
    _this._a = [];
    _this._b = [];
    _this._oneComplete = false;
    _this.destination.add(compareTo.subscribe(new SequenceEqualCompareToSubscriber(destination, _this)));
    return _this;
  }
  SequenceEqualSubscriber2.prototype._next = function(value) {
    if (this._oneComplete && this._b.length === 0) {
      this.emit(false);
    } else {
      this._a.push(value);
      this.checkValues();
    }
  };
  SequenceEqualSubscriber2.prototype._complete = function() {
    if (this._oneComplete) {
      this.emit(this._a.length === 0 && this._b.length === 0);
    } else {
      this._oneComplete = true;
    }
    this.unsubscribe();
  };
  SequenceEqualSubscriber2.prototype.checkValues = function() {
    var _c = this, _a = _c._a, _b = _c._b, comparator = _c.comparator;
    while (_a.length > 0 && _b.length > 0) {
      var a2 = _a.shift();
      var b2 = _b.shift();
      var areEqual = false;
      try {
        areEqual = comparator ? comparator(a2, b2) : a2 === b2;
      } catch (e2) {
        this.destination.error(e2);
      }
      if (!areEqual) {
        this.emit(false);
      }
    }
  };
  SequenceEqualSubscriber2.prototype.emit = function(value) {
    var destination = this.destination;
    destination.next(value);
    destination.complete();
  };
  SequenceEqualSubscriber2.prototype.nextB = function(value) {
    if (this._oneComplete && this._a.length === 0) {
      this.emit(false);
    } else {
      this._b.push(value);
      this.checkValues();
    }
  };
  SequenceEqualSubscriber2.prototype.completeB = function() {
    if (this._oneComplete) {
      this.emit(this._a.length === 0 && this._b.length === 0);
    } else {
      this._oneComplete = true;
    }
  };
  return SequenceEqualSubscriber2;
}(Subscriber);
var SequenceEqualCompareToSubscriber = /* @__PURE__ */ function(_super) {
  __extends(SequenceEqualCompareToSubscriber2, _super);
  function SequenceEqualCompareToSubscriber2(destination, parent) {
    var _this = _super.call(this, destination) || this;
    _this.parent = parent;
    return _this;
  }
  SequenceEqualCompareToSubscriber2.prototype._next = function(value) {
    this.parent.nextB(value);
  };
  SequenceEqualCompareToSubscriber2.prototype._error = function(err) {
    this.parent.error(err);
    this.unsubscribe();
  };
  SequenceEqualCompareToSubscriber2.prototype._complete = function() {
    this.parent.completeB();
    this.unsubscribe();
  };
  return SequenceEqualCompareToSubscriber2;
}(Subscriber);
function shareSubjectFactory() {
  return new Subject();
}
function share() {
  return function(source) {
    return refCount()(multicast(shareSubjectFactory)(source));
  };
}
function shareReplay(configOrBufferSize, windowTime2, scheduler) {
  var config2;
  if (configOrBufferSize && typeof configOrBufferSize === "object") {
    config2 = configOrBufferSize;
  } else {
    config2 = {
      bufferSize: configOrBufferSize,
      windowTime: windowTime2,
      refCount: false,
      scheduler
    };
  }
  return function(source) {
    return source.lift(shareReplayOperator(config2));
  };
}
function shareReplayOperator(_a) {
  var _b = _a.bufferSize, bufferSize = _b === void 0 ? Number.POSITIVE_INFINITY : _b, _c = _a.windowTime, windowTime2 = _c === void 0 ? Number.POSITIVE_INFINITY : _c, useRefCount = _a.refCount, scheduler = _a.scheduler;
  var subject;
  var refCount2 = 0;
  var subscription;
  var hasError = false;
  var isComplete = false;
  return function shareReplayOperation(source) {
    refCount2++;
    var innerSub;
    if (!subject || hasError) {
      hasError = false;
      subject = new ReplaySubject(bufferSize, windowTime2, scheduler);
      innerSub = subject.subscribe(this);
      subscription = source.subscribe({
        next: function(value) {
          subject.next(value);
        },
        error: function(err) {
          hasError = true;
          subject.error(err);
        },
        complete: function() {
          isComplete = true;
          subscription = void 0;
          subject.complete();
        }
      });
      if (isComplete) {
        subscription = void 0;
      }
    } else {
      innerSub = subject.subscribe(this);
    }
    this.add(function() {
      refCount2--;
      innerSub.unsubscribe();
      innerSub = void 0;
      if (subscription && !isComplete && useRefCount && refCount2 === 0) {
        subscription.unsubscribe();
        subscription = void 0;
        subject = void 0;
      }
    });
  };
}
function single(predicate) {
  return function(source) {
    return source.lift(new SingleOperator(predicate, source));
  };
}
var SingleOperator = /* @__PURE__ */ function() {
  function SingleOperator2(predicate, source) {
    this.predicate = predicate;
    this.source = source;
  }
  SingleOperator2.prototype.call = function(subscriber, source) {
    return source.subscribe(new SingleSubscriber(subscriber, this.predicate, this.source));
  };
  return SingleOperator2;
}();
var SingleSubscriber = /* @__PURE__ */ function(_super) {
  __extends(SingleSubscriber2, _super);
  function SingleSubscriber2(destination, predicate, source) {
    var _this = _super.call(this, destination) || this;
    _this.predicate = predicate;
    _this.source = source;
    _this.seenValue = false;
    _this.index = 0;
    return _this;
  }
  SingleSubscriber2.prototype.applySingleValue = function(value) {
    if (this.seenValue) {
      this.destination.error("Sequence contains more than one element");
    } else {
      this.seenValue = true;
      this.singleValue = value;
    }
  };
  SingleSubscriber2.prototype._next = function(value) {
    var index2 = this.index++;
    if (this.predicate) {
      this.tryNext(value, index2);
    } else {
      this.applySingleValue(value);
    }
  };
  SingleSubscriber2.prototype.tryNext = function(value, index2) {
    try {
      if (this.predicate(value, index2, this.source)) {
        this.applySingleValue(value);
      }
    } catch (err) {
      this.destination.error(err);
    }
  };
  SingleSubscriber2.prototype._complete = function() {
    var destination = this.destination;
    if (this.index > 0) {
      destination.next(this.seenValue ? this.singleValue : void 0);
      destination.complete();
    } else {
      destination.error(new EmptyError());
    }
  };
  return SingleSubscriber2;
}(Subscriber);
function skip(count2) {
  return function(source) {
    return source.lift(new SkipOperator(count2));
  };
}
var SkipOperator = /* @__PURE__ */ function() {
  function SkipOperator2(total) {
    this.total = total;
  }
  SkipOperator2.prototype.call = function(subscriber, source) {
    return source.subscribe(new SkipSubscriber(subscriber, this.total));
  };
  return SkipOperator2;
}();
var SkipSubscriber = /* @__PURE__ */ function(_super) {
  __extends(SkipSubscriber2, _super);
  function SkipSubscriber2(destination, total) {
    var _this = _super.call(this, destination) || this;
    _this.total = total;
    _this.count = 0;
    return _this;
  }
  SkipSubscriber2.prototype._next = function(x2) {
    if (++this.count > this.total) {
      this.destination.next(x2);
    }
  };
  return SkipSubscriber2;
}(Subscriber);
function skipLast(count2) {
  return function(source) {
    return source.lift(new SkipLastOperator(count2));
  };
}
var SkipLastOperator = /* @__PURE__ */ function() {
  function SkipLastOperator2(_skipCount) {
    this._skipCount = _skipCount;
    if (this._skipCount < 0) {
      throw new ArgumentOutOfRangeError();
    }
  }
  SkipLastOperator2.prototype.call = function(subscriber, source) {
    if (this._skipCount === 0) {
      return source.subscribe(new Subscriber(subscriber));
    } else {
      return source.subscribe(new SkipLastSubscriber(subscriber, this._skipCount));
    }
  };
  return SkipLastOperator2;
}();
var SkipLastSubscriber = /* @__PURE__ */ function(_super) {
  __extends(SkipLastSubscriber2, _super);
  function SkipLastSubscriber2(destination, _skipCount) {
    var _this = _super.call(this, destination) || this;
    _this._skipCount = _skipCount;
    _this._count = 0;
    _this._ring = new Array(_skipCount);
    return _this;
  }
  SkipLastSubscriber2.prototype._next = function(value) {
    var skipCount = this._skipCount;
    var count2 = this._count++;
    if (count2 < skipCount) {
      this._ring[count2] = value;
    } else {
      var currentIndex = count2 % skipCount;
      var ring = this._ring;
      var oldValue = ring[currentIndex];
      ring[currentIndex] = value;
      this.destination.next(oldValue);
    }
  };
  return SkipLastSubscriber2;
}(Subscriber);
function skipUntil(notifier) {
  return function(source) {
    return source.lift(new SkipUntilOperator(notifier));
  };
}
var SkipUntilOperator = /* @__PURE__ */ function() {
  function SkipUntilOperator2(notifier) {
    this.notifier = notifier;
  }
  SkipUntilOperator2.prototype.call = function(destination, source) {
    return source.subscribe(new SkipUntilSubscriber(destination, this.notifier));
  };
  return SkipUntilOperator2;
}();
var SkipUntilSubscriber = /* @__PURE__ */ function(_super) {
  __extends(SkipUntilSubscriber2, _super);
  function SkipUntilSubscriber2(destination, notifier) {
    var _this = _super.call(this, destination) || this;
    _this.hasValue = false;
    var innerSubscriber = new SimpleInnerSubscriber(_this);
    _this.add(innerSubscriber);
    _this.innerSubscription = innerSubscriber;
    var innerSubscription = innerSubscribe(notifier, innerSubscriber);
    if (innerSubscription !== innerSubscriber) {
      _this.add(innerSubscription);
      _this.innerSubscription = innerSubscription;
    }
    return _this;
  }
  SkipUntilSubscriber2.prototype._next = function(value) {
    if (this.hasValue) {
      _super.prototype._next.call(this, value);
    }
  };
  SkipUntilSubscriber2.prototype.notifyNext = function() {
    this.hasValue = true;
    if (this.innerSubscription) {
      this.innerSubscription.unsubscribe();
    }
  };
  SkipUntilSubscriber2.prototype.notifyComplete = function() {
  };
  return SkipUntilSubscriber2;
}(SimpleOuterSubscriber);
function skipWhile(predicate) {
  return function(source) {
    return source.lift(new SkipWhileOperator(predicate));
  };
}
var SkipWhileOperator = /* @__PURE__ */ function() {
  function SkipWhileOperator2(predicate) {
    this.predicate = predicate;
  }
  SkipWhileOperator2.prototype.call = function(subscriber, source) {
    return source.subscribe(new SkipWhileSubscriber(subscriber, this.predicate));
  };
  return SkipWhileOperator2;
}();
var SkipWhileSubscriber = /* @__PURE__ */ function(_super) {
  __extends(SkipWhileSubscriber2, _super);
  function SkipWhileSubscriber2(destination, predicate) {
    var _this = _super.call(this, destination) || this;
    _this.predicate = predicate;
    _this.skipping = true;
    _this.index = 0;
    return _this;
  }
  SkipWhileSubscriber2.prototype._next = function(value) {
    var destination = this.destination;
    if (this.skipping) {
      this.tryCallPredicate(value);
    }
    if (!this.skipping) {
      destination.next(value);
    }
  };
  SkipWhileSubscriber2.prototype.tryCallPredicate = function(value) {
    try {
      var result = this.predicate(value, this.index++);
      this.skipping = Boolean(result);
    } catch (err) {
      this.destination.error(err);
    }
  };
  return SkipWhileSubscriber2;
}(Subscriber);
function startWith() {
  var array = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    array[_i] = arguments[_i];
  }
  var scheduler = array[array.length - 1];
  if (isScheduler(scheduler)) {
    array.pop();
    return function(source) {
      return concat$1(array, source, scheduler);
    };
  } else {
    return function(source) {
      return concat$1(array, source);
    };
  }
}
var SubscribeOnObservable = /* @__PURE__ */ function(_super) {
  __extends(SubscribeOnObservable2, _super);
  function SubscribeOnObservable2(source, delayTime, scheduler) {
    if (delayTime === void 0) {
      delayTime = 0;
    }
    if (scheduler === void 0) {
      scheduler = asap;
    }
    var _this = _super.call(this) || this;
    _this.source = source;
    _this.delayTime = delayTime;
    _this.scheduler = scheduler;
    if (!isNumeric(delayTime) || delayTime < 0) {
      _this.delayTime = 0;
    }
    if (!scheduler || typeof scheduler.schedule !== "function") {
      _this.scheduler = asap;
    }
    return _this;
  }
  SubscribeOnObservable2.create = function(source, delay2, scheduler) {
    if (delay2 === void 0) {
      delay2 = 0;
    }
    if (scheduler === void 0) {
      scheduler = asap;
    }
    return new SubscribeOnObservable2(source, delay2, scheduler);
  };
  SubscribeOnObservable2.dispatch = function(arg) {
    var source = arg.source, subscriber = arg.subscriber;
    return this.add(source.subscribe(subscriber));
  };
  SubscribeOnObservable2.prototype._subscribe = function(subscriber) {
    var delay2 = this.delayTime;
    var source = this.source;
    var scheduler = this.scheduler;
    return scheduler.schedule(SubscribeOnObservable2.dispatch, delay2, {
      source,
      subscriber
    });
  };
  return SubscribeOnObservable2;
}(Observable);
function subscribeOn(scheduler, delay2) {
  if (delay2 === void 0) {
    delay2 = 0;
  }
  return function subscribeOnOperatorFunction(source) {
    return source.lift(new SubscribeOnOperator(scheduler, delay2));
  };
}
var SubscribeOnOperator = /* @__PURE__ */ function() {
  function SubscribeOnOperator2(scheduler, delay2) {
    this.scheduler = scheduler;
    this.delay = delay2;
  }
  SubscribeOnOperator2.prototype.call = function(subscriber, source) {
    return new SubscribeOnObservable(source, this.delay, this.scheduler).subscribe(subscriber);
  };
  return SubscribeOnOperator2;
}();
function switchMap(project, resultSelector) {
  if (typeof resultSelector === "function") {
    return function(source) {
      return source.pipe(switchMap(function(a2, i) {
        return from(project(a2, i)).pipe(map(function(b2, ii) {
          return resultSelector(a2, b2, i, ii);
        }));
      }));
    };
  }
  return function(source) {
    return source.lift(new SwitchMapOperator(project));
  };
}
var SwitchMapOperator = /* @__PURE__ */ function() {
  function SwitchMapOperator2(project) {
    this.project = project;
  }
  SwitchMapOperator2.prototype.call = function(subscriber, source) {
    return source.subscribe(new SwitchMapSubscriber(subscriber, this.project));
  };
  return SwitchMapOperator2;
}();
var SwitchMapSubscriber = /* @__PURE__ */ function(_super) {
  __extends(SwitchMapSubscriber2, _super);
  function SwitchMapSubscriber2(destination, project) {
    var _this = _super.call(this, destination) || this;
    _this.project = project;
    _this.index = 0;
    return _this;
  }
  SwitchMapSubscriber2.prototype._next = function(value) {
    var result;
    var index2 = this.index++;
    try {
      result = this.project(value, index2);
    } catch (error) {
      this.destination.error(error);
      return;
    }
    this._innerSub(result);
  };
  SwitchMapSubscriber2.prototype._innerSub = function(result) {
    var innerSubscription = this.innerSubscription;
    if (innerSubscription) {
      innerSubscription.unsubscribe();
    }
    var innerSubscriber = new SimpleInnerSubscriber(this);
    var destination = this.destination;
    destination.add(innerSubscriber);
    this.innerSubscription = innerSubscribe(result, innerSubscriber);
    if (this.innerSubscription !== innerSubscriber) {
      destination.add(this.innerSubscription);
    }
  };
  SwitchMapSubscriber2.prototype._complete = function() {
    var innerSubscription = this.innerSubscription;
    if (!innerSubscription || innerSubscription.closed) {
      _super.prototype._complete.call(this);
    }
    this.unsubscribe();
  };
  SwitchMapSubscriber2.prototype._unsubscribe = function() {
    this.innerSubscription = void 0;
  };
  SwitchMapSubscriber2.prototype.notifyComplete = function() {
    this.innerSubscription = void 0;
    if (this.isStopped) {
      _super.prototype._complete.call(this);
    }
  };
  SwitchMapSubscriber2.prototype.notifyNext = function(innerValue) {
    this.destination.next(innerValue);
  };
  return SwitchMapSubscriber2;
}(SimpleOuterSubscriber);
function switchAll() {
  return switchMap(identity);
}
function switchMapTo(innerObservable, resultSelector) {
  return resultSelector ? switchMap(function() {
    return innerObservable;
  }, resultSelector) : switchMap(function() {
    return innerObservable;
  });
}
function takeUntil(notifier) {
  return function(source) {
    return source.lift(new TakeUntilOperator(notifier));
  };
}
var TakeUntilOperator = /* @__PURE__ */ function() {
  function TakeUntilOperator2(notifier) {
    this.notifier = notifier;
  }
  TakeUntilOperator2.prototype.call = function(subscriber, source) {
    var takeUntilSubscriber = new TakeUntilSubscriber(subscriber);
    var notifierSubscription = innerSubscribe(this.notifier, new SimpleInnerSubscriber(takeUntilSubscriber));
    if (notifierSubscription && !takeUntilSubscriber.seenValue) {
      takeUntilSubscriber.add(notifierSubscription);
      return source.subscribe(takeUntilSubscriber);
    }
    return takeUntilSubscriber;
  };
  return TakeUntilOperator2;
}();
var TakeUntilSubscriber = /* @__PURE__ */ function(_super) {
  __extends(TakeUntilSubscriber2, _super);
  function TakeUntilSubscriber2(destination) {
    var _this = _super.call(this, destination) || this;
    _this.seenValue = false;
    return _this;
  }
  TakeUntilSubscriber2.prototype.notifyNext = function() {
    this.seenValue = true;
    this.complete();
  };
  TakeUntilSubscriber2.prototype.notifyComplete = function() {
  };
  return TakeUntilSubscriber2;
}(SimpleOuterSubscriber);
function takeWhile(predicate, inclusive) {
  if (inclusive === void 0) {
    inclusive = false;
  }
  return function(source) {
    return source.lift(new TakeWhileOperator(predicate, inclusive));
  };
}
var TakeWhileOperator = /* @__PURE__ */ function() {
  function TakeWhileOperator2(predicate, inclusive) {
    this.predicate = predicate;
    this.inclusive = inclusive;
  }
  TakeWhileOperator2.prototype.call = function(subscriber, source) {
    return source.subscribe(new TakeWhileSubscriber(subscriber, this.predicate, this.inclusive));
  };
  return TakeWhileOperator2;
}();
var TakeWhileSubscriber = /* @__PURE__ */ function(_super) {
  __extends(TakeWhileSubscriber2, _super);
  function TakeWhileSubscriber2(destination, predicate, inclusive) {
    var _this = _super.call(this, destination) || this;
    _this.predicate = predicate;
    _this.inclusive = inclusive;
    _this.index = 0;
    return _this;
  }
  TakeWhileSubscriber2.prototype._next = function(value) {
    var destination = this.destination;
    var result;
    try {
      result = this.predicate(value, this.index++);
    } catch (err) {
      destination.error(err);
      return;
    }
    this.nextOrComplete(value, result);
  };
  TakeWhileSubscriber2.prototype.nextOrComplete = function(value, predicateResult) {
    var destination = this.destination;
    if (Boolean(predicateResult)) {
      destination.next(value);
    } else {
      if (this.inclusive) {
        destination.next(value);
      }
      destination.complete();
    }
  };
  return TakeWhileSubscriber2;
}(Subscriber);
function tap(nextOrObserver, error, complete) {
  return function tapOperatorFunction(source) {
    return source.lift(new DoOperator(nextOrObserver, error, complete));
  };
}
var DoOperator = /* @__PURE__ */ function() {
  function DoOperator2(nextOrObserver, error, complete) {
    this.nextOrObserver = nextOrObserver;
    this.error = error;
    this.complete = complete;
  }
  DoOperator2.prototype.call = function(subscriber, source) {
    return source.subscribe(new TapSubscriber(subscriber, this.nextOrObserver, this.error, this.complete));
  };
  return DoOperator2;
}();
var TapSubscriber = /* @__PURE__ */ function(_super) {
  __extends(TapSubscriber2, _super);
  function TapSubscriber2(destination, observerOrNext, error, complete) {
    var _this = _super.call(this, destination) || this;
    _this._tapNext = noop$1;
    _this._tapError = noop$1;
    _this._tapComplete = noop$1;
    _this._tapError = error || noop$1;
    _this._tapComplete = complete || noop$1;
    if (isFunction(observerOrNext)) {
      _this._context = _this;
      _this._tapNext = observerOrNext;
    } else if (observerOrNext) {
      _this._context = observerOrNext;
      _this._tapNext = observerOrNext.next || noop$1;
      _this._tapError = observerOrNext.error || noop$1;
      _this._tapComplete = observerOrNext.complete || noop$1;
    }
    return _this;
  }
  TapSubscriber2.prototype._next = function(value) {
    try {
      this._tapNext.call(this._context, value);
    } catch (err) {
      this.destination.error(err);
      return;
    }
    this.destination.next(value);
  };
  TapSubscriber2.prototype._error = function(err) {
    try {
      this._tapError.call(this._context, err);
    } catch (err2) {
      this.destination.error(err2);
      return;
    }
    this.destination.error(err);
  };
  TapSubscriber2.prototype._complete = function() {
    try {
      this._tapComplete.call(this._context);
    } catch (err) {
      this.destination.error(err);
      return;
    }
    return this.destination.complete();
  };
  return TapSubscriber2;
}(Subscriber);
var defaultThrottleConfig = {
  leading: true,
  trailing: false
};
function throttle(durationSelector, config2) {
  if (config2 === void 0) {
    config2 = defaultThrottleConfig;
  }
  return function(source) {
    return source.lift(new ThrottleOperator(durationSelector, !!config2.leading, !!config2.trailing));
  };
}
var ThrottleOperator = /* @__PURE__ */ function() {
  function ThrottleOperator2(durationSelector, leading, trailing) {
    this.durationSelector = durationSelector;
    this.leading = leading;
    this.trailing = trailing;
  }
  ThrottleOperator2.prototype.call = function(subscriber, source) {
    return source.subscribe(new ThrottleSubscriber(subscriber, this.durationSelector, this.leading, this.trailing));
  };
  return ThrottleOperator2;
}();
var ThrottleSubscriber = /* @__PURE__ */ function(_super) {
  __extends(ThrottleSubscriber2, _super);
  function ThrottleSubscriber2(destination, durationSelector, _leading, _trailing) {
    var _this = _super.call(this, destination) || this;
    _this.destination = destination;
    _this.durationSelector = durationSelector;
    _this._leading = _leading;
    _this._trailing = _trailing;
    _this._hasValue = false;
    return _this;
  }
  ThrottleSubscriber2.prototype._next = function(value) {
    this._hasValue = true;
    this._sendValue = value;
    if (!this._throttled) {
      if (this._leading) {
        this.send();
      } else {
        this.throttle(value);
      }
    }
  };
  ThrottleSubscriber2.prototype.send = function() {
    var _a = this, _hasValue = _a._hasValue, _sendValue = _a._sendValue;
    if (_hasValue) {
      this.destination.next(_sendValue);
      this.throttle(_sendValue);
    }
    this._hasValue = false;
    this._sendValue = void 0;
  };
  ThrottleSubscriber2.prototype.throttle = function(value) {
    var duration = this.tryDurationSelector(value);
    if (!!duration) {
      this.add(this._throttled = innerSubscribe(duration, new SimpleInnerSubscriber(this)));
    }
  };
  ThrottleSubscriber2.prototype.tryDurationSelector = function(value) {
    try {
      return this.durationSelector(value);
    } catch (err) {
      this.destination.error(err);
      return null;
    }
  };
  ThrottleSubscriber2.prototype.throttlingDone = function() {
    var _a = this, _throttled = _a._throttled, _trailing = _a._trailing;
    if (_throttled) {
      _throttled.unsubscribe();
    }
    this._throttled = void 0;
    if (_trailing) {
      this.send();
    }
  };
  ThrottleSubscriber2.prototype.notifyNext = function() {
    this.throttlingDone();
  };
  ThrottleSubscriber2.prototype.notifyComplete = function() {
    this.throttlingDone();
  };
  return ThrottleSubscriber2;
}(SimpleOuterSubscriber);
function throttleTime(duration, scheduler, config2) {
  if (scheduler === void 0) {
    scheduler = async;
  }
  if (config2 === void 0) {
    config2 = defaultThrottleConfig;
  }
  return function(source) {
    return source.lift(new ThrottleTimeOperator(duration, scheduler, config2.leading, config2.trailing));
  };
}
var ThrottleTimeOperator = /* @__PURE__ */ function() {
  function ThrottleTimeOperator2(duration, scheduler, leading, trailing) {
    this.duration = duration;
    this.scheduler = scheduler;
    this.leading = leading;
    this.trailing = trailing;
  }
  ThrottleTimeOperator2.prototype.call = function(subscriber, source) {
    return source.subscribe(new ThrottleTimeSubscriber(subscriber, this.duration, this.scheduler, this.leading, this.trailing));
  };
  return ThrottleTimeOperator2;
}();
var ThrottleTimeSubscriber = /* @__PURE__ */ function(_super) {
  __extends(ThrottleTimeSubscriber2, _super);
  function ThrottleTimeSubscriber2(destination, duration, scheduler, leading, trailing) {
    var _this = _super.call(this, destination) || this;
    _this.duration = duration;
    _this.scheduler = scheduler;
    _this.leading = leading;
    _this.trailing = trailing;
    _this._hasTrailingValue = false;
    _this._trailingValue = null;
    return _this;
  }
  ThrottleTimeSubscriber2.prototype._next = function(value) {
    if (this.throttled) {
      if (this.trailing) {
        this._trailingValue = value;
        this._hasTrailingValue = true;
      }
    } else {
      this.add(this.throttled = this.scheduler.schedule(dispatchNext, this.duration, { subscriber: this }));
      if (this.leading) {
        this.destination.next(value);
      } else if (this.trailing) {
        this._trailingValue = value;
        this._hasTrailingValue = true;
      }
    }
  };
  ThrottleTimeSubscriber2.prototype._complete = function() {
    if (this._hasTrailingValue) {
      this.destination.next(this._trailingValue);
      this.destination.complete();
    } else {
      this.destination.complete();
    }
  };
  ThrottleTimeSubscriber2.prototype.clearThrottle = function() {
    var throttled = this.throttled;
    if (throttled) {
      if (this.trailing && this._hasTrailingValue) {
        this.destination.next(this._trailingValue);
        this._trailingValue = null;
        this._hasTrailingValue = false;
      }
      throttled.unsubscribe();
      this.remove(throttled);
      this.throttled = null;
    }
  };
  return ThrottleTimeSubscriber2;
}(Subscriber);
function dispatchNext(arg) {
  var subscriber = arg.subscriber;
  subscriber.clearThrottle();
}
function timeInterval(scheduler) {
  if (scheduler === void 0) {
    scheduler = async;
  }
  return function(source) {
    return defer(function() {
      return source.pipe(scan(function(_a, value) {
        var current = _a.current;
        return { value, current: scheduler.now(), last: current };
      }, { current: scheduler.now(), value: void 0, last: void 0 }), map(function(_a) {
        var current = _a.current, last2 = _a.last, value = _a.value;
        return new TimeInterval(value, current - last2);
      }));
    });
  };
}
var TimeInterval = /* @__PURE__ */ function() {
  function TimeInterval2(value, interval2) {
    this.value = value;
    this.interval = interval2;
  }
  return TimeInterval2;
}();
function timeoutWith(due, withObservable, scheduler) {
  if (scheduler === void 0) {
    scheduler = async;
  }
  return function(source) {
    var absoluteTimeout = isDate$1(due);
    var waitFor = absoluteTimeout ? +due - scheduler.now() : Math.abs(due);
    return source.lift(new TimeoutWithOperator(waitFor, absoluteTimeout, withObservable, scheduler));
  };
}
var TimeoutWithOperator = /* @__PURE__ */ function() {
  function TimeoutWithOperator2(waitFor, absoluteTimeout, withObservable, scheduler) {
    this.waitFor = waitFor;
    this.absoluteTimeout = absoluteTimeout;
    this.withObservable = withObservable;
    this.scheduler = scheduler;
  }
  TimeoutWithOperator2.prototype.call = function(subscriber, source) {
    return source.subscribe(new TimeoutWithSubscriber(subscriber, this.absoluteTimeout, this.waitFor, this.withObservable, this.scheduler));
  };
  return TimeoutWithOperator2;
}();
var TimeoutWithSubscriber = /* @__PURE__ */ function(_super) {
  __extends(TimeoutWithSubscriber2, _super);
  function TimeoutWithSubscriber2(destination, absoluteTimeout, waitFor, withObservable, scheduler) {
    var _this = _super.call(this, destination) || this;
    _this.absoluteTimeout = absoluteTimeout;
    _this.waitFor = waitFor;
    _this.withObservable = withObservable;
    _this.scheduler = scheduler;
    _this.scheduleTimeout();
    return _this;
  }
  TimeoutWithSubscriber2.dispatchTimeout = function(subscriber) {
    var withObservable = subscriber.withObservable;
    subscriber._unsubscribeAndRecycle();
    subscriber.add(innerSubscribe(withObservable, new SimpleInnerSubscriber(subscriber)));
  };
  TimeoutWithSubscriber2.prototype.scheduleTimeout = function() {
    var action = this.action;
    if (action) {
      this.action = action.schedule(this, this.waitFor);
    } else {
      this.add(this.action = this.scheduler.schedule(TimeoutWithSubscriber2.dispatchTimeout, this.waitFor, this));
    }
  };
  TimeoutWithSubscriber2.prototype._next = function(value) {
    if (!this.absoluteTimeout) {
      this.scheduleTimeout();
    }
    _super.prototype._next.call(this, value);
  };
  TimeoutWithSubscriber2.prototype._unsubscribe = function() {
    this.action = void 0;
    this.scheduler = null;
    this.withObservable = null;
  };
  return TimeoutWithSubscriber2;
}(SimpleOuterSubscriber);
function timeout$1(due, scheduler) {
  if (scheduler === void 0) {
    scheduler = async;
  }
  return timeoutWith(due, throwError(new TimeoutError()), scheduler);
}
function timestamp(scheduler) {
  if (scheduler === void 0) {
    scheduler = async;
  }
  return map(function(value) {
    return new Timestamp(value, scheduler.now());
  });
}
var Timestamp = /* @__PURE__ */ function() {
  function Timestamp2(value, timestamp2) {
    this.value = value;
    this.timestamp = timestamp2;
  }
  return Timestamp2;
}();
function toArrayReducer(arr2, item, index2) {
  if (index2 === 0) {
    return [item];
  }
  arr2.push(item);
  return arr2;
}
function toArray() {
  return reduce(toArrayReducer, []);
}
function window$1(windowBoundaries) {
  return function windowOperatorFunction(source) {
    return source.lift(new WindowOperator$1(windowBoundaries));
  };
}
var WindowOperator$1 = /* @__PURE__ */ function() {
  function WindowOperator2(windowBoundaries) {
    this.windowBoundaries = windowBoundaries;
  }
  WindowOperator2.prototype.call = function(subscriber, source) {
    var windowSubscriber = new WindowSubscriber$1(subscriber);
    var sourceSubscription = source.subscribe(windowSubscriber);
    if (!sourceSubscription.closed) {
      windowSubscriber.add(innerSubscribe(this.windowBoundaries, new SimpleInnerSubscriber(windowSubscriber)));
    }
    return sourceSubscription;
  };
  return WindowOperator2;
}();
var WindowSubscriber$1 = /* @__PURE__ */ function(_super) {
  __extends(WindowSubscriber2, _super);
  function WindowSubscriber2(destination) {
    var _this = _super.call(this, destination) || this;
    _this.window = new Subject();
    destination.next(_this.window);
    return _this;
  }
  WindowSubscriber2.prototype.notifyNext = function() {
    this.openWindow();
  };
  WindowSubscriber2.prototype.notifyError = function(error) {
    this._error(error);
  };
  WindowSubscriber2.prototype.notifyComplete = function() {
    this._complete();
  };
  WindowSubscriber2.prototype._next = function(value) {
    this.window.next(value);
  };
  WindowSubscriber2.prototype._error = function(err) {
    this.window.error(err);
    this.destination.error(err);
  };
  WindowSubscriber2.prototype._complete = function() {
    this.window.complete();
    this.destination.complete();
  };
  WindowSubscriber2.prototype._unsubscribe = function() {
    this.window = null;
  };
  WindowSubscriber2.prototype.openWindow = function() {
    var prevWindow = this.window;
    if (prevWindow) {
      prevWindow.complete();
    }
    var destination = this.destination;
    var newWindow = this.window = new Subject();
    destination.next(newWindow);
  };
  return WindowSubscriber2;
}(SimpleOuterSubscriber);
function windowCount(windowSize, startWindowEvery) {
  if (startWindowEvery === void 0) {
    startWindowEvery = 0;
  }
  return function windowCountOperatorFunction(source) {
    return source.lift(new WindowCountOperator(windowSize, startWindowEvery));
  };
}
var WindowCountOperator = /* @__PURE__ */ function() {
  function WindowCountOperator2(windowSize, startWindowEvery) {
    this.windowSize = windowSize;
    this.startWindowEvery = startWindowEvery;
  }
  WindowCountOperator2.prototype.call = function(subscriber, source) {
    return source.subscribe(new WindowCountSubscriber(subscriber, this.windowSize, this.startWindowEvery));
  };
  return WindowCountOperator2;
}();
var WindowCountSubscriber = /* @__PURE__ */ function(_super) {
  __extends(WindowCountSubscriber2, _super);
  function WindowCountSubscriber2(destination, windowSize, startWindowEvery) {
    var _this = _super.call(this, destination) || this;
    _this.destination = destination;
    _this.windowSize = windowSize;
    _this.startWindowEvery = startWindowEvery;
    _this.windows = [new Subject()];
    _this.count = 0;
    destination.next(_this.windows[0]);
    return _this;
  }
  WindowCountSubscriber2.prototype._next = function(value) {
    var startWindowEvery = this.startWindowEvery > 0 ? this.startWindowEvery : this.windowSize;
    var destination = this.destination;
    var windowSize = this.windowSize;
    var windows = this.windows;
    var len = windows.length;
    for (var i = 0; i < len && !this.closed; i++) {
      windows[i].next(value);
    }
    var c2 = this.count - windowSize + 1;
    if (c2 >= 0 && c2 % startWindowEvery === 0 && !this.closed) {
      windows.shift().complete();
    }
    if (++this.count % startWindowEvery === 0 && !this.closed) {
      var window_1 = new Subject();
      windows.push(window_1);
      destination.next(window_1);
    }
  };
  WindowCountSubscriber2.prototype._error = function(err) {
    var windows = this.windows;
    if (windows) {
      while (windows.length > 0 && !this.closed) {
        windows.shift().error(err);
      }
    }
    this.destination.error(err);
  };
  WindowCountSubscriber2.prototype._complete = function() {
    var windows = this.windows;
    if (windows) {
      while (windows.length > 0 && !this.closed) {
        windows.shift().complete();
      }
    }
    this.destination.complete();
  };
  WindowCountSubscriber2.prototype._unsubscribe = function() {
    this.count = 0;
    this.windows = null;
  };
  return WindowCountSubscriber2;
}(Subscriber);
function windowTime(windowTimeSpan) {
  var scheduler = async;
  var windowCreationInterval = null;
  var maxWindowSize = Number.POSITIVE_INFINITY;
  if (isScheduler(arguments[3])) {
    scheduler = arguments[3];
  }
  if (isScheduler(arguments[2])) {
    scheduler = arguments[2];
  } else if (isNumeric(arguments[2])) {
    maxWindowSize = Number(arguments[2]);
  }
  if (isScheduler(arguments[1])) {
    scheduler = arguments[1];
  } else if (isNumeric(arguments[1])) {
    windowCreationInterval = Number(arguments[1]);
  }
  return function windowTimeOperatorFunction(source) {
    return source.lift(new WindowTimeOperator(windowTimeSpan, windowCreationInterval, maxWindowSize, scheduler));
  };
}
var WindowTimeOperator = /* @__PURE__ */ function() {
  function WindowTimeOperator2(windowTimeSpan, windowCreationInterval, maxWindowSize, scheduler) {
    this.windowTimeSpan = windowTimeSpan;
    this.windowCreationInterval = windowCreationInterval;
    this.maxWindowSize = maxWindowSize;
    this.scheduler = scheduler;
  }
  WindowTimeOperator2.prototype.call = function(subscriber, source) {
    return source.subscribe(new WindowTimeSubscriber(subscriber, this.windowTimeSpan, this.windowCreationInterval, this.maxWindowSize, this.scheduler));
  };
  return WindowTimeOperator2;
}();
var CountedSubject = /* @__PURE__ */ function(_super) {
  __extends(CountedSubject2, _super);
  function CountedSubject2() {
    var _this = _super !== null && _super.apply(this, arguments) || this;
    _this._numberOfNextedValues = 0;
    return _this;
  }
  CountedSubject2.prototype.next = function(value) {
    this._numberOfNextedValues++;
    _super.prototype.next.call(this, value);
  };
  Object.defineProperty(CountedSubject2.prototype, "numberOfNextedValues", {
    get: function() {
      return this._numberOfNextedValues;
    },
    enumerable: true,
    configurable: true
  });
  return CountedSubject2;
}(Subject);
var WindowTimeSubscriber = /* @__PURE__ */ function(_super) {
  __extends(WindowTimeSubscriber2, _super);
  function WindowTimeSubscriber2(destination, windowTimeSpan, windowCreationInterval, maxWindowSize, scheduler) {
    var _this = _super.call(this, destination) || this;
    _this.destination = destination;
    _this.windowTimeSpan = windowTimeSpan;
    _this.windowCreationInterval = windowCreationInterval;
    _this.maxWindowSize = maxWindowSize;
    _this.scheduler = scheduler;
    _this.windows = [];
    var window2 = _this.openWindow();
    if (windowCreationInterval !== null && windowCreationInterval >= 0) {
      var closeState = { subscriber: _this, window: window2, context: null };
      var creationState = { windowTimeSpan, windowCreationInterval, subscriber: _this, scheduler };
      _this.add(scheduler.schedule(dispatchWindowClose, windowTimeSpan, closeState));
      _this.add(scheduler.schedule(dispatchWindowCreation, windowCreationInterval, creationState));
    } else {
      var timeSpanOnlyState = { subscriber: _this, window: window2, windowTimeSpan };
      _this.add(scheduler.schedule(dispatchWindowTimeSpanOnly, windowTimeSpan, timeSpanOnlyState));
    }
    return _this;
  }
  WindowTimeSubscriber2.prototype._next = function(value) {
    var windows = this.windows;
    var len = windows.length;
    for (var i = 0; i < len; i++) {
      var window_1 = windows[i];
      if (!window_1.closed) {
        window_1.next(value);
        if (window_1.numberOfNextedValues >= this.maxWindowSize) {
          this.closeWindow(window_1);
        }
      }
    }
  };
  WindowTimeSubscriber2.prototype._error = function(err) {
    var windows = this.windows;
    while (windows.length > 0) {
      windows.shift().error(err);
    }
    this.destination.error(err);
  };
  WindowTimeSubscriber2.prototype._complete = function() {
    var windows = this.windows;
    while (windows.length > 0) {
      var window_2 = windows.shift();
      if (!window_2.closed) {
        window_2.complete();
      }
    }
    this.destination.complete();
  };
  WindowTimeSubscriber2.prototype.openWindow = function() {
    var window2 = new CountedSubject();
    this.windows.push(window2);
    var destination = this.destination;
    destination.next(window2);
    return window2;
  };
  WindowTimeSubscriber2.prototype.closeWindow = function(window2) {
    window2.complete();
    var windows = this.windows;
    windows.splice(windows.indexOf(window2), 1);
  };
  return WindowTimeSubscriber2;
}(Subscriber);
function dispatchWindowTimeSpanOnly(state) {
  var subscriber = state.subscriber, windowTimeSpan = state.windowTimeSpan, window2 = state.window;
  if (window2) {
    subscriber.closeWindow(window2);
  }
  state.window = subscriber.openWindow();
  this.schedule(state, windowTimeSpan);
}
function dispatchWindowCreation(state) {
  var windowTimeSpan = state.windowTimeSpan, subscriber = state.subscriber, scheduler = state.scheduler, windowCreationInterval = state.windowCreationInterval;
  var window2 = subscriber.openWindow();
  var action = this;
  var context = { action, subscription: null };
  var timeSpanState = { subscriber, window: window2, context };
  context.subscription = scheduler.schedule(dispatchWindowClose, windowTimeSpan, timeSpanState);
  action.add(context.subscription);
  action.schedule(state, windowCreationInterval);
}
function dispatchWindowClose(state) {
  var subscriber = state.subscriber, window2 = state.window, context = state.context;
  if (context && context.action && context.subscription) {
    context.action.remove(context.subscription);
  }
  subscriber.closeWindow(window2);
}
function windowToggle(openings, closingSelector) {
  return function(source) {
    return source.lift(new WindowToggleOperator(openings, closingSelector));
  };
}
var WindowToggleOperator = /* @__PURE__ */ function() {
  function WindowToggleOperator2(openings, closingSelector) {
    this.openings = openings;
    this.closingSelector = closingSelector;
  }
  WindowToggleOperator2.prototype.call = function(subscriber, source) {
    return source.subscribe(new WindowToggleSubscriber(subscriber, this.openings, this.closingSelector));
  };
  return WindowToggleOperator2;
}();
var WindowToggleSubscriber = /* @__PURE__ */ function(_super) {
  __extends(WindowToggleSubscriber2, _super);
  function WindowToggleSubscriber2(destination, openings, closingSelector) {
    var _this = _super.call(this, destination) || this;
    _this.openings = openings;
    _this.closingSelector = closingSelector;
    _this.contexts = [];
    _this.add(_this.openSubscription = subscribeToResult(_this, openings, openings));
    return _this;
  }
  WindowToggleSubscriber2.prototype._next = function(value) {
    var contexts = this.contexts;
    if (contexts) {
      var len = contexts.length;
      for (var i = 0; i < len; i++) {
        contexts[i].window.next(value);
      }
    }
  };
  WindowToggleSubscriber2.prototype._error = function(err) {
    var contexts = this.contexts;
    this.contexts = null;
    if (contexts) {
      var len = contexts.length;
      var index2 = -1;
      while (++index2 < len) {
        var context_1 = contexts[index2];
        context_1.window.error(err);
        context_1.subscription.unsubscribe();
      }
    }
    _super.prototype._error.call(this, err);
  };
  WindowToggleSubscriber2.prototype._complete = function() {
    var contexts = this.contexts;
    this.contexts = null;
    if (contexts) {
      var len = contexts.length;
      var index2 = -1;
      while (++index2 < len) {
        var context_2 = contexts[index2];
        context_2.window.complete();
        context_2.subscription.unsubscribe();
      }
    }
    _super.prototype._complete.call(this);
  };
  WindowToggleSubscriber2.prototype._unsubscribe = function() {
    var contexts = this.contexts;
    this.contexts = null;
    if (contexts) {
      var len = contexts.length;
      var index2 = -1;
      while (++index2 < len) {
        var context_3 = contexts[index2];
        context_3.window.unsubscribe();
        context_3.subscription.unsubscribe();
      }
    }
  };
  WindowToggleSubscriber2.prototype.notifyNext = function(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
    if (outerValue === this.openings) {
      var closingNotifier = void 0;
      try {
        var closingSelector = this.closingSelector;
        closingNotifier = closingSelector(innerValue);
      } catch (e2) {
        return this.error(e2);
      }
      var window_1 = new Subject();
      var subscription = new Subscription();
      var context_4 = { window: window_1, subscription };
      this.contexts.push(context_4);
      var innerSubscription = subscribeToResult(this, closingNotifier, context_4);
      if (innerSubscription.closed) {
        this.closeWindow(this.contexts.length - 1);
      } else {
        innerSubscription.context = context_4;
        subscription.add(innerSubscription);
      }
      this.destination.next(window_1);
    } else {
      this.closeWindow(this.contexts.indexOf(outerValue));
    }
  };
  WindowToggleSubscriber2.prototype.notifyError = function(err) {
    this.error(err);
  };
  WindowToggleSubscriber2.prototype.notifyComplete = function(inner) {
    if (inner !== this.openSubscription) {
      this.closeWindow(this.contexts.indexOf(inner.context));
    }
  };
  WindowToggleSubscriber2.prototype.closeWindow = function(index2) {
    if (index2 === -1) {
      return;
    }
    var contexts = this.contexts;
    var context = contexts[index2];
    var window2 = context.window, subscription = context.subscription;
    contexts.splice(index2, 1);
    window2.complete();
    subscription.unsubscribe();
  };
  return WindowToggleSubscriber2;
}(OuterSubscriber);
function windowWhen(closingSelector) {
  return function windowWhenOperatorFunction(source) {
    return source.lift(new WindowOperator(closingSelector));
  };
}
var WindowOperator = /* @__PURE__ */ function() {
  function WindowOperator2(closingSelector) {
    this.closingSelector = closingSelector;
  }
  WindowOperator2.prototype.call = function(subscriber, source) {
    return source.subscribe(new WindowSubscriber(subscriber, this.closingSelector));
  };
  return WindowOperator2;
}();
var WindowSubscriber = /* @__PURE__ */ function(_super) {
  __extends(WindowSubscriber2, _super);
  function WindowSubscriber2(destination, closingSelector) {
    var _this = _super.call(this, destination) || this;
    _this.destination = destination;
    _this.closingSelector = closingSelector;
    _this.openWindow();
    return _this;
  }
  WindowSubscriber2.prototype.notifyNext = function(_outerValue, _innerValue, _outerIndex, _innerIndex, innerSub) {
    this.openWindow(innerSub);
  };
  WindowSubscriber2.prototype.notifyError = function(error) {
    this._error(error);
  };
  WindowSubscriber2.prototype.notifyComplete = function(innerSub) {
    this.openWindow(innerSub);
  };
  WindowSubscriber2.prototype._next = function(value) {
    this.window.next(value);
  };
  WindowSubscriber2.prototype._error = function(err) {
    this.window.error(err);
    this.destination.error(err);
    this.unsubscribeClosingNotification();
  };
  WindowSubscriber2.prototype._complete = function() {
    this.window.complete();
    this.destination.complete();
    this.unsubscribeClosingNotification();
  };
  WindowSubscriber2.prototype.unsubscribeClosingNotification = function() {
    if (this.closingNotification) {
      this.closingNotification.unsubscribe();
    }
  };
  WindowSubscriber2.prototype.openWindow = function(innerSub) {
    if (innerSub === void 0) {
      innerSub = null;
    }
    if (innerSub) {
      this.remove(innerSub);
      innerSub.unsubscribe();
    }
    var prevWindow = this.window;
    if (prevWindow) {
      prevWindow.complete();
    }
    var window2 = this.window = new Subject();
    this.destination.next(window2);
    var closingNotifier;
    try {
      var closingSelector = this.closingSelector;
      closingNotifier = closingSelector();
    } catch (e2) {
      this.destination.error(e2);
      this.window.error(e2);
      return;
    }
    this.add(this.closingNotification = subscribeToResult(this, closingNotifier));
  };
  return WindowSubscriber2;
}(OuterSubscriber);
function withLatestFrom() {
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
  return function(source) {
    var project;
    if (typeof args[args.length - 1] === "function") {
      project = args.pop();
    }
    var observables = args;
    return source.lift(new WithLatestFromOperator(observables, project));
  };
}
var WithLatestFromOperator = /* @__PURE__ */ function() {
  function WithLatestFromOperator2(observables, project) {
    this.observables = observables;
    this.project = project;
  }
  WithLatestFromOperator2.prototype.call = function(subscriber, source) {
    return source.subscribe(new WithLatestFromSubscriber(subscriber, this.observables, this.project));
  };
  return WithLatestFromOperator2;
}();
var WithLatestFromSubscriber = /* @__PURE__ */ function(_super) {
  __extends(WithLatestFromSubscriber2, _super);
  function WithLatestFromSubscriber2(destination, observables, project) {
    var _this = _super.call(this, destination) || this;
    _this.observables = observables;
    _this.project = project;
    _this.toRespond = [];
    var len = observables.length;
    _this.values = new Array(len);
    for (var i = 0; i < len; i++) {
      _this.toRespond.push(i);
    }
    for (var i = 0; i < len; i++) {
      var observable2 = observables[i];
      _this.add(subscribeToResult(_this, observable2, void 0, i));
    }
    return _this;
  }
  WithLatestFromSubscriber2.prototype.notifyNext = function(_outerValue, innerValue, outerIndex) {
    this.values[outerIndex] = innerValue;
    var toRespond = this.toRespond;
    if (toRespond.length > 0) {
      var found = toRespond.indexOf(outerIndex);
      if (found !== -1) {
        toRespond.splice(found, 1);
      }
    }
  };
  WithLatestFromSubscriber2.prototype.notifyComplete = function() {
  };
  WithLatestFromSubscriber2.prototype._next = function(value) {
    if (this.toRespond.length === 0) {
      var args = [value].concat(this.values);
      if (this.project) {
        this._tryProject(args);
      } else {
        this.destination.next(args);
      }
    }
  };
  WithLatestFromSubscriber2.prototype._tryProject = function(args) {
    var result;
    try {
      result = this.project.apply(this, args);
    } catch (err) {
      this.destination.error(err);
      return;
    }
    this.destination.next(result);
  };
  return WithLatestFromSubscriber2;
}(OuterSubscriber);
function zip() {
  var observables = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    observables[_i] = arguments[_i];
  }
  return function zipOperatorFunction(source) {
    return source.lift.call(zip$1.apply(void 0, [source].concat(observables)));
  };
}
function zipAll(project) {
  return function(source) {
    return source.lift(new ZipOperator(project));
  };
}
var operators = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  audit,
  auditTime,
  buffer,
  bufferCount,
  bufferTime,
  bufferToggle,
  bufferWhen,
  catchError,
  combineAll,
  combineLatest,
  concat,
  concatAll,
  concatMap,
  concatMapTo,
  count,
  debounce,
  debounceTime,
  defaultIfEmpty,
  delay,
  delayWhen,
  dematerialize,
  distinct,
  distinctUntilChanged,
  distinctUntilKeyChanged,
  elementAt,
  endWith,
  every,
  exhaust,
  exhaustMap,
  expand,
  filter,
  finalize,
  find,
  findIndex,
  first,
  groupBy,
  ignoreElements,
  isEmpty,
  last,
  map,
  mapTo,
  materialize,
  max,
  merge: merge$1,
  mergeAll,
  mergeMap,
  flatMap,
  mergeMapTo,
  mergeScan,
  min,
  multicast,
  observeOn,
  onErrorResumeNext,
  pairwise,
  partition,
  pluck,
  publish,
  publishBehavior,
  publishLast,
  publishReplay,
  race,
  reduce,
  repeat,
  repeatWhen,
  retry,
  retryWhen,
  refCount,
  sample,
  sampleTime,
  scan,
  sequenceEqual,
  share,
  shareReplay,
  single,
  skip,
  skipLast,
  skipUntil,
  skipWhile,
  startWith,
  subscribeOn,
  switchAll,
  switchMap,
  switchMapTo,
  take,
  takeLast,
  takeUntil,
  takeWhile,
  tap,
  throttle,
  throttleTime,
  throwIfEmpty,
  timeInterval,
  timeout: timeout$1,
  timeoutWith,
  timestamp,
  toArray,
  window: window$1,
  windowCount,
  windowTime,
  windowToggle,
  windowWhen,
  withLatestFrom,
  zip,
  zipAll
}, Symbol.toStringTag, { value: "Module" }));
var require$$3 = /* @__PURE__ */ getAugmentedNamespace(operators);
var util$4 = {};
var hasMap = typeof Map === "function" && Map.prototype;
var mapSizeDescriptor = Object.getOwnPropertyDescriptor && hasMap ? Object.getOwnPropertyDescriptor(Map.prototype, "size") : null;
var mapSize = hasMap && mapSizeDescriptor && typeof mapSizeDescriptor.get === "function" ? mapSizeDescriptor.get : null;
var mapForEach = hasMap && Map.prototype.forEach;
var hasSet = typeof Set === "function" && Set.prototype;
var setSizeDescriptor = Object.getOwnPropertyDescriptor && hasSet ? Object.getOwnPropertyDescriptor(Set.prototype, "size") : null;
var setSize = hasSet && setSizeDescriptor && typeof setSizeDescriptor.get === "function" ? setSizeDescriptor.get : null;
var setForEach = hasSet && Set.prototype.forEach;
var hasWeakMap = typeof WeakMap === "function" && WeakMap.prototype;
var weakMapHas = hasWeakMap ? WeakMap.prototype.has : null;
var hasWeakSet = typeof WeakSet === "function" && WeakSet.prototype;
var weakSetHas = hasWeakSet ? WeakSet.prototype.has : null;
var hasWeakRef = typeof WeakRef === "function" && WeakRef.prototype;
var weakRefDeref = hasWeakRef ? WeakRef.prototype.deref : null;
var booleanValueOf = Boolean.prototype.valueOf;
var objectToString = Object.prototype.toString;
var functionToString = Function.prototype.toString;
var $match = String.prototype.match;
var $slice = String.prototype.slice;
var $replace = String.prototype.replace;
var $toUpperCase = String.prototype.toUpperCase;
var $toLowerCase = String.prototype.toLowerCase;
var $test = RegExp.prototype.test;
var $concat = Array.prototype.concat;
var $join = Array.prototype.join;
var $arrSlice = Array.prototype.slice;
var $floor = Math.floor;
var bigIntValueOf = typeof BigInt === "function" ? BigInt.prototype.valueOf : null;
var gOPS = Object.getOwnPropertySymbols;
var symToString = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? Symbol.prototype.toString : null;
var hasShammedSymbols = typeof Symbol === "function" && typeof Symbol.iterator === "object";
var toStringTag = typeof Symbol === "function" && Symbol.toStringTag && (typeof Symbol.toStringTag === hasShammedSymbols ? "object" : "symbol") ? Symbol.toStringTag : null;
var isEnumerable = Object.prototype.propertyIsEnumerable;
var gPO = (typeof Reflect === "function" ? Reflect.getPrototypeOf : Object.getPrototypeOf) || ([].__proto__ === Array.prototype ? function(O2) {
  return O2.__proto__;
} : null);
function addNumericSeparator(num, str) {
  if (num === Infinity || num === -Infinity || num !== num || num && num > -1e3 && num < 1e3 || $test.call(/e/, str)) {
    return str;
  }
  var sepRegex = /[0-9](?=(?:[0-9]{3})+(?![0-9]))/g;
  if (typeof num === "number") {
    var int = num < 0 ? -$floor(-num) : $floor(num);
    if (int !== num) {
      var intStr = String(int);
      var dec = $slice.call(str, intStr.length + 1);
      return $replace.call(intStr, sepRegex, "$&_") + "." + $replace.call($replace.call(dec, /([0-9]{3})/g, "$&_"), /_$/, "");
    }
  }
  return $replace.call(str, sepRegex, "$&_");
}
var utilInspect = require$$1$1;
var inspectCustom = utilInspect.custom;
var inspectSymbol = isSymbol(inspectCustom) ? inspectCustom : null;
var objectInspect = function inspect_(obj, options, depth, seen) {
  var opts = options || {};
  if (has$3(opts, "quoteStyle") && (opts.quoteStyle !== "single" && opts.quoteStyle !== "double")) {
    throw new TypeError('option "quoteStyle" must be "single" or "double"');
  }
  if (has$3(opts, "maxStringLength") && (typeof opts.maxStringLength === "number" ? opts.maxStringLength < 0 && opts.maxStringLength !== Infinity : opts.maxStringLength !== null)) {
    throw new TypeError('option "maxStringLength", if provided, must be a positive integer, Infinity, or `null`');
  }
  var customInspect = has$3(opts, "customInspect") ? opts.customInspect : true;
  if (typeof customInspect !== "boolean" && customInspect !== "symbol") {
    throw new TypeError("option \"customInspect\", if provided, must be `true`, `false`, or `'symbol'`");
  }
  if (has$3(opts, "indent") && opts.indent !== null && opts.indent !== "	" && !(parseInt(opts.indent, 10) === opts.indent && opts.indent > 0)) {
    throw new TypeError('option "indent" must be "\\t", an integer > 0, or `null`');
  }
  if (has$3(opts, "numericSeparator") && typeof opts.numericSeparator !== "boolean") {
    throw new TypeError('option "numericSeparator", if provided, must be `true` or `false`');
  }
  var numericSeparator = opts.numericSeparator;
  if (typeof obj === "undefined") {
    return "undefined";
  }
  if (obj === null) {
    return "null";
  }
  if (typeof obj === "boolean") {
    return obj ? "true" : "false";
  }
  if (typeof obj === "string") {
    return inspectString(obj, opts);
  }
  if (typeof obj === "number") {
    if (obj === 0) {
      return Infinity / obj > 0 ? "0" : "-0";
    }
    var str = String(obj);
    return numericSeparator ? addNumericSeparator(obj, str) : str;
  }
  if (typeof obj === "bigint") {
    var bigIntStr = String(obj) + "n";
    return numericSeparator ? addNumericSeparator(obj, bigIntStr) : bigIntStr;
  }
  var maxDepth = typeof opts.depth === "undefined" ? 5 : opts.depth;
  if (typeof depth === "undefined") {
    depth = 0;
  }
  if (depth >= maxDepth && maxDepth > 0 && typeof obj === "object") {
    return isArray$4(obj) ? "[Array]" : "[Object]";
  }
  var indent = getIndent(opts, depth);
  if (typeof seen === "undefined") {
    seen = [];
  } else if (indexOf(seen, obj) >= 0) {
    return "[Circular]";
  }
  function inspect2(value, from2, noIndent) {
    if (from2) {
      seen = $arrSlice.call(seen);
      seen.push(from2);
    }
    if (noIndent) {
      var newOpts = {
        depth: opts.depth
      };
      if (has$3(opts, "quoteStyle")) {
        newOpts.quoteStyle = opts.quoteStyle;
      }
      return inspect_(value, newOpts, depth + 1, seen);
    }
    return inspect_(value, opts, depth + 1, seen);
  }
  if (typeof obj === "function" && !isRegExp$1(obj)) {
    var name2 = nameOf(obj);
    var keys = arrObjKeys(obj, inspect2);
    return "[Function" + (name2 ? ": " + name2 : " (anonymous)") + "]" + (keys.length > 0 ? " { " + $join.call(keys, ", ") + " }" : "");
  }
  if (isSymbol(obj)) {
    var symString = hasShammedSymbols ? $replace.call(String(obj), /^(Symbol\(.*\))_[^)]*$/, "$1") : symToString.call(obj);
    return typeof obj === "object" && !hasShammedSymbols ? markBoxed(symString) : symString;
  }
  if (isElement(obj)) {
    var s2 = "<" + $toLowerCase.call(String(obj.nodeName));
    var attrs = obj.attributes || [];
    for (var i = 0; i < attrs.length; i++) {
      s2 += " " + attrs[i].name + "=" + wrapQuotes(quote(attrs[i].value), "double", opts);
    }
    s2 += ">";
    if (obj.childNodes && obj.childNodes.length) {
      s2 += "...";
    }
    s2 += "</" + $toLowerCase.call(String(obj.nodeName)) + ">";
    return s2;
  }
  if (isArray$4(obj)) {
    if (obj.length === 0) {
      return "[]";
    }
    var xs = arrObjKeys(obj, inspect2);
    if (indent && !singleLineValues(xs)) {
      return "[" + indentedJoin(xs, indent) + "]";
    }
    return "[ " + $join.call(xs, ", ") + " ]";
  }
  if (isError(obj)) {
    var parts = arrObjKeys(obj, inspect2);
    if (!("cause" in Error.prototype) && "cause" in obj && !isEnumerable.call(obj, "cause")) {
      return "{ [" + String(obj) + "] " + $join.call($concat.call("[cause]: " + inspect2(obj.cause), parts), ", ") + " }";
    }
    if (parts.length === 0) {
      return "[" + String(obj) + "]";
    }
    return "{ [" + String(obj) + "] " + $join.call(parts, ", ") + " }";
  }
  if (typeof obj === "object" && customInspect) {
    if (inspectSymbol && typeof obj[inspectSymbol] === "function" && utilInspect) {
      return utilInspect(obj, { depth: maxDepth - depth });
    } else if (customInspect !== "symbol" && typeof obj.inspect === "function") {
      return obj.inspect();
    }
  }
  if (isMap(obj)) {
    var mapParts = [];
    mapForEach.call(obj, function(value, key) {
      mapParts.push(inspect2(key, obj, true) + " => " + inspect2(value, obj));
    });
    return collectionOf("Map", mapSize.call(obj), mapParts, indent);
  }
  if (isSet(obj)) {
    var setParts = [];
    setForEach.call(obj, function(value) {
      setParts.push(inspect2(value, obj));
    });
    return collectionOf("Set", setSize.call(obj), setParts, indent);
  }
  if (isWeakMap(obj)) {
    return weakCollectionOf("WeakMap");
  }
  if (isWeakSet(obj)) {
    return weakCollectionOf("WeakSet");
  }
  if (isWeakRef(obj)) {
    return weakCollectionOf("WeakRef");
  }
  if (isNumber(obj)) {
    return markBoxed(inspect2(Number(obj)));
  }
  if (isBigInt(obj)) {
    return markBoxed(inspect2(bigIntValueOf.call(obj)));
  }
  if (isBoolean(obj)) {
    return markBoxed(booleanValueOf.call(obj));
  }
  if (isString(obj)) {
    return markBoxed(inspect2(String(obj)));
  }
  if (!isDate(obj) && !isRegExp$1(obj)) {
    var ys = arrObjKeys(obj, inspect2);
    var isPlainObject = gPO ? gPO(obj) === Object.prototype : obj instanceof Object || obj.constructor === Object;
    var protoTag = obj instanceof Object ? "" : "null prototype";
    var stringTag = !isPlainObject && toStringTag && Object(obj) === obj && toStringTag in obj ? $slice.call(toStr(obj), 8, -1) : protoTag ? "Object" : "";
    var constructorTag = isPlainObject || typeof obj.constructor !== "function" ? "" : obj.constructor.name ? obj.constructor.name + " " : "";
    var tag = constructorTag + (stringTag || protoTag ? "[" + $join.call($concat.call([], stringTag || [], protoTag || []), ": ") + "] " : "");
    if (ys.length === 0) {
      return tag + "{}";
    }
    if (indent) {
      return tag + "{" + indentedJoin(ys, indent) + "}";
    }
    return tag + "{ " + $join.call(ys, ", ") + " }";
  }
  return String(obj);
};
function wrapQuotes(s2, defaultStyle, opts) {
  var quoteChar = (opts.quoteStyle || defaultStyle) === "double" ? '"' : "'";
  return quoteChar + s2 + quoteChar;
}
function quote(s2) {
  return $replace.call(String(s2), /"/g, "&quot;");
}
function isArray$4(obj) {
  return toStr(obj) === "[object Array]" && (!toStringTag || !(typeof obj === "object" && toStringTag in obj));
}
function isDate(obj) {
  return toStr(obj) === "[object Date]" && (!toStringTag || !(typeof obj === "object" && toStringTag in obj));
}
function isRegExp$1(obj) {
  return toStr(obj) === "[object RegExp]" && (!toStringTag || !(typeof obj === "object" && toStringTag in obj));
}
function isError(obj) {
  return toStr(obj) === "[object Error]" && (!toStringTag || !(typeof obj === "object" && toStringTag in obj));
}
function isString(obj) {
  return toStr(obj) === "[object String]" && (!toStringTag || !(typeof obj === "object" && toStringTag in obj));
}
function isNumber(obj) {
  return toStr(obj) === "[object Number]" && (!toStringTag || !(typeof obj === "object" && toStringTag in obj));
}
function isBoolean(obj) {
  return toStr(obj) === "[object Boolean]" && (!toStringTag || !(typeof obj === "object" && toStringTag in obj));
}
function isSymbol(obj) {
  if (hasShammedSymbols) {
    return obj && typeof obj === "object" && obj instanceof Symbol;
  }
  if (typeof obj === "symbol") {
    return true;
  }
  if (!obj || typeof obj !== "object" || !symToString) {
    return false;
  }
  try {
    symToString.call(obj);
    return true;
  } catch (e2) {
  }
  return false;
}
function isBigInt(obj) {
  if (!obj || typeof obj !== "object" || !bigIntValueOf) {
    return false;
  }
  try {
    bigIntValueOf.call(obj);
    return true;
  } catch (e2) {
  }
  return false;
}
var hasOwn = Object.prototype.hasOwnProperty || function(key) {
  return key in this;
};
function has$3(obj, key) {
  return hasOwn.call(obj, key);
}
function toStr(obj) {
  return objectToString.call(obj);
}
function nameOf(f2) {
  if (f2.name) {
    return f2.name;
  }
  var m2 = $match.call(functionToString.call(f2), /^function\s*([\w$]+)/);
  if (m2) {
    return m2[1];
  }
  return null;
}
function indexOf(xs, x2) {
  if (xs.indexOf) {
    return xs.indexOf(x2);
  }
  for (var i = 0, l2 = xs.length; i < l2; i++) {
    if (xs[i] === x2) {
      return i;
    }
  }
  return -1;
}
function isMap(x2) {
  if (!mapSize || !x2 || typeof x2 !== "object") {
    return false;
  }
  try {
    mapSize.call(x2);
    try {
      setSize.call(x2);
    } catch (s2) {
      return true;
    }
    return x2 instanceof Map;
  } catch (e2) {
  }
  return false;
}
function isWeakMap(x2) {
  if (!weakMapHas || !x2 || typeof x2 !== "object") {
    return false;
  }
  try {
    weakMapHas.call(x2, weakMapHas);
    try {
      weakSetHas.call(x2, weakSetHas);
    } catch (s2) {
      return true;
    }
    return x2 instanceof WeakMap;
  } catch (e2) {
  }
  return false;
}
function isWeakRef(x2) {
  if (!weakRefDeref || !x2 || typeof x2 !== "object") {
    return false;
  }
  try {
    weakRefDeref.call(x2);
    return true;
  } catch (e2) {
  }
  return false;
}
function isSet(x2) {
  if (!setSize || !x2 || typeof x2 !== "object") {
    return false;
  }
  try {
    setSize.call(x2);
    try {
      mapSize.call(x2);
    } catch (m2) {
      return true;
    }
    return x2 instanceof Set;
  } catch (e2) {
  }
  return false;
}
function isWeakSet(x2) {
  if (!weakSetHas || !x2 || typeof x2 !== "object") {
    return false;
  }
  try {
    weakSetHas.call(x2, weakSetHas);
    try {
      weakMapHas.call(x2, weakMapHas);
    } catch (s2) {
      return true;
    }
    return x2 instanceof WeakSet;
  } catch (e2) {
  }
  return false;
}
function isElement(x2) {
  if (!x2 || typeof x2 !== "object") {
    return false;
  }
  if (typeof HTMLElement !== "undefined" && x2 instanceof HTMLElement) {
    return true;
  }
  return typeof x2.nodeName === "string" && typeof x2.getAttribute === "function";
}
function inspectString(str, opts) {
  if (str.length > opts.maxStringLength) {
    var remaining = str.length - opts.maxStringLength;
    var trailer = "... " + remaining + " more character" + (remaining > 1 ? "s" : "");
    return inspectString($slice.call(str, 0, opts.maxStringLength), opts) + trailer;
  }
  var s2 = $replace.call($replace.call(str, /(['\\])/g, "\\$1"), /[\x00-\x1f]/g, lowbyte);
  return wrapQuotes(s2, "single", opts);
}
function lowbyte(c2) {
  var n2 = c2.charCodeAt(0);
  var x2 = {
    8: "b",
    9: "t",
    10: "n",
    12: "f",
    13: "r"
  }[n2];
  if (x2) {
    return "\\" + x2;
  }
  return "\\x" + (n2 < 16 ? "0" : "") + $toUpperCase.call(n2.toString(16));
}
function markBoxed(str) {
  return "Object(" + str + ")";
}
function weakCollectionOf(type) {
  return type + " { ? }";
}
function collectionOf(type, size, entries, indent) {
  var joinedEntries = indent ? indentedJoin(entries, indent) : $join.call(entries, ", ");
  return type + " (" + size + ") {" + joinedEntries + "}";
}
function singleLineValues(xs) {
  for (var i = 0; i < xs.length; i++) {
    if (indexOf(xs[i], "\n") >= 0) {
      return false;
    }
  }
  return true;
}
function getIndent(opts, depth) {
  var baseIndent;
  if (opts.indent === "	") {
    baseIndent = "	";
  } else if (typeof opts.indent === "number" && opts.indent > 0) {
    baseIndent = $join.call(Array(opts.indent + 1), " ");
  } else {
    return null;
  }
  return {
    base: baseIndent,
    prev: $join.call(Array(depth + 1), baseIndent)
  };
}
function indentedJoin(xs, indent) {
  if (xs.length === 0) {
    return "";
  }
  var lineJoiner = "\n" + indent.prev + indent.base;
  return lineJoiner + $join.call(xs, "," + lineJoiner) + "\n" + indent.prev;
}
function arrObjKeys(obj, inspect2) {
  var isArr = isArray$4(obj);
  var xs = [];
  if (isArr) {
    xs.length = obj.length;
    for (var i = 0; i < obj.length; i++) {
      xs[i] = has$3(obj, i) ? inspect2(obj[i], obj) : "";
    }
  }
  var syms = typeof gOPS === "function" ? gOPS(obj) : [];
  var symMap;
  if (hasShammedSymbols) {
    symMap = {};
    for (var k2 = 0; k2 < syms.length; k2++) {
      symMap["$" + syms[k2]] = syms[k2];
    }
  }
  for (var key in obj) {
    if (!has$3(obj, key)) {
      continue;
    }
    if (isArr && String(Number(key)) === key && key < obj.length) {
      continue;
    }
    if (hasShammedSymbols && symMap["$" + key] instanceof Symbol) {
      continue;
    } else if ($test.call(/[^\w$]/, key)) {
      xs.push(inspect2(key, obj) + ": " + inspect2(obj[key], obj));
    } else {
      xs.push(key + ": " + inspect2(obj[key], obj));
    }
  }
  if (typeof gOPS === "function") {
    for (var j2 = 0; j2 < syms.length; j2++) {
      if (isEnumerable.call(obj, syms[j2])) {
        xs.push("[" + inspect2(syms[j2]) + "]: " + inspect2(obj[syms[j2]], obj));
      }
    }
  }
  return xs;
}
var GetIntrinsic = getIntrinsic;
var callBound = callBound$1;
var inspect = objectInspect;
var $TypeError = GetIntrinsic("%TypeError%");
var $WeakMap = GetIntrinsic("%WeakMap%", true);
var $Map = GetIntrinsic("%Map%", true);
var $weakMapGet = callBound("WeakMap.prototype.get", true);
var $weakMapSet = callBound("WeakMap.prototype.set", true);
var $weakMapHas = callBound("WeakMap.prototype.has", true);
var $mapGet = callBound("Map.prototype.get", true);
var $mapSet = callBound("Map.prototype.set", true);
var $mapHas = callBound("Map.prototype.has", true);
var listGetNode = function(list, key) {
  for (var prev = list, curr; (curr = prev.next) !== null; prev = curr) {
    if (curr.key === key) {
      prev.next = curr.next;
      curr.next = list.next;
      list.next = curr;
      return curr;
    }
  }
};
var listGet = function(objects, key) {
  var node = listGetNode(objects, key);
  return node && node.value;
};
var listSet = function(objects, key, value) {
  var node = listGetNode(objects, key);
  if (node) {
    node.value = value;
  } else {
    objects.next = {
      key,
      next: objects.next,
      value
    };
  }
};
var listHas = function(objects, key) {
  return !!listGetNode(objects, key);
};
var sideChannel = function getSideChannel() {
  var $wm;
  var $m;
  var $o;
  var channel = {
    assert: function(key) {
      if (!channel.has(key)) {
        throw new $TypeError("Side channel does not contain " + inspect(key));
      }
    },
    get: function(key) {
      if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
        if ($wm) {
          return $weakMapGet($wm, key);
        }
      } else if ($Map) {
        if ($m) {
          return $mapGet($m, key);
        }
      } else {
        if ($o) {
          return listGet($o, key);
        }
      }
    },
    has: function(key) {
      if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
        if ($wm) {
          return $weakMapHas($wm, key);
        }
      } else if ($Map) {
        if ($m) {
          return $mapHas($m, key);
        }
      } else {
        if ($o) {
          return listHas($o, key);
        }
      }
      return false;
    },
    set: function(key, value) {
      if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
        if (!$wm) {
          $wm = new $WeakMap();
        }
        $weakMapSet($wm, key, value);
      } else if ($Map) {
        if (!$m) {
          $m = new $Map();
        }
        $mapSet($m, key, value);
      } else {
        if (!$o) {
          $o = { key: {}, next: null };
        }
        listSet($o, key, value);
      }
    }
  };
  return channel;
};
var replace = String.prototype.replace;
var percentTwenties = /%20/g;
var Format = {
  RFC1738: "RFC1738",
  RFC3986: "RFC3986"
};
var formats$3 = {
  "default": Format.RFC3986,
  formatters: {
    RFC1738: function(value) {
      return replace.call(value, percentTwenties, "+");
    },
    RFC3986: function(value) {
      return String(value);
    }
  },
  RFC1738: Format.RFC1738,
  RFC3986: Format.RFC3986
};
var formats$2 = formats$3;
var has$2 = Object.prototype.hasOwnProperty;
var isArray$3 = Array.isArray;
var hexTable = function() {
  var array = [];
  for (var i = 0; i < 256; ++i) {
    array.push("%" + ((i < 16 ? "0" : "") + i.toString(16)).toUpperCase());
  }
  return array;
}();
var compactQueue = function compactQueue2(queue2) {
  while (queue2.length > 1) {
    var item = queue2.pop();
    var obj = item.obj[item.prop];
    if (isArray$3(obj)) {
      var compacted = [];
      for (var j2 = 0; j2 < obj.length; ++j2) {
        if (typeof obj[j2] !== "undefined") {
          compacted.push(obj[j2]);
        }
      }
      item.obj[item.prop] = compacted;
    }
  }
};
var arrayToObject = function arrayToObject2(source, options) {
  var obj = options && options.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
  for (var i = 0; i < source.length; ++i) {
    if (typeof source[i] !== "undefined") {
      obj[i] = source[i];
    }
  }
  return obj;
};
var merge = function merge2(target, source, options) {
  if (!source) {
    return target;
  }
  if (typeof source !== "object") {
    if (isArray$3(target)) {
      target.push(source);
    } else if (target && typeof target === "object") {
      if (options && (options.plainObjects || options.allowPrototypes) || !has$2.call(Object.prototype, source)) {
        target[source] = true;
      }
    } else {
      return [target, source];
    }
    return target;
  }
  if (!target || typeof target !== "object") {
    return [target].concat(source);
  }
  var mergeTarget = target;
  if (isArray$3(target) && !isArray$3(source)) {
    mergeTarget = arrayToObject(target, options);
  }
  if (isArray$3(target) && isArray$3(source)) {
    source.forEach(function(item, i) {
      if (has$2.call(target, i)) {
        var targetItem = target[i];
        if (targetItem && typeof targetItem === "object" && item && typeof item === "object") {
          target[i] = merge2(targetItem, item, options);
        } else {
          target.push(item);
        }
      } else {
        target[i] = item;
      }
    });
    return target;
  }
  return Object.keys(source).reduce(function(acc, key) {
    var value = source[key];
    if (has$2.call(acc, key)) {
      acc[key] = merge2(acc[key], value, options);
    } else {
      acc[key] = value;
    }
    return acc;
  }, mergeTarget);
};
var assign = function assignSingleSource(target, source) {
  return Object.keys(source).reduce(function(acc, key) {
    acc[key] = source[key];
    return acc;
  }, target);
};
var decode = function(str, decoder, charset) {
  var strWithoutPlus = str.replace(/\+/g, " ");
  if (charset === "iso-8859-1") {
    return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);
  }
  try {
    return decodeURIComponent(strWithoutPlus);
  } catch (e2) {
    return strWithoutPlus;
  }
};
var encode = function encode2(str, defaultEncoder, charset, kind, format) {
  if (str.length === 0) {
    return str;
  }
  var string = str;
  if (typeof str === "symbol") {
    string = Symbol.prototype.toString.call(str);
  } else if (typeof str !== "string") {
    string = String(str);
  }
  if (charset === "iso-8859-1") {
    return escape(string).replace(/%u[0-9a-f]{4}/gi, function($0) {
      return "%26%23" + parseInt($0.slice(2), 16) + "%3B";
    });
  }
  var out = "";
  for (var i = 0; i < string.length; ++i) {
    var c2 = string.charCodeAt(i);
    if (c2 === 45 || c2 === 46 || c2 === 95 || c2 === 126 || c2 >= 48 && c2 <= 57 || c2 >= 65 && c2 <= 90 || c2 >= 97 && c2 <= 122 || format === formats$2.RFC1738 && (c2 === 40 || c2 === 41)) {
      out += string.charAt(i);
      continue;
    }
    if (c2 < 128) {
      out = out + hexTable[c2];
      continue;
    }
    if (c2 < 2048) {
      out = out + (hexTable[192 | c2 >> 6] + hexTable[128 | c2 & 63]);
      continue;
    }
    if (c2 < 55296 || c2 >= 57344) {
      out = out + (hexTable[224 | c2 >> 12] + hexTable[128 | c2 >> 6 & 63] + hexTable[128 | c2 & 63]);
      continue;
    }
    i += 1;
    c2 = 65536 + ((c2 & 1023) << 10 | string.charCodeAt(i) & 1023);
    out += hexTable[240 | c2 >> 18] + hexTable[128 | c2 >> 12 & 63] + hexTable[128 | c2 >> 6 & 63] + hexTable[128 | c2 & 63];
  }
  return out;
};
var compact = function compact2(value) {
  var queue2 = [{ obj: { o: value }, prop: "o" }];
  var refs = [];
  for (var i = 0; i < queue2.length; ++i) {
    var item = queue2[i];
    var obj = item.obj[item.prop];
    var keys = Object.keys(obj);
    for (var j2 = 0; j2 < keys.length; ++j2) {
      var key = keys[j2];
      var val = obj[key];
      if (typeof val === "object" && val !== null && refs.indexOf(val) === -1) {
        queue2.push({ obj, prop: key });
        refs.push(val);
      }
    }
  }
  compactQueue(queue2);
  return value;
};
var isRegExp = function isRegExp2(obj) {
  return Object.prototype.toString.call(obj) === "[object RegExp]";
};
var isBuffer = function isBuffer2(obj) {
  if (!obj || typeof obj !== "object") {
    return false;
  }
  return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
};
var combine = function combine2(a2, b2) {
  return [].concat(a2, b2);
};
var maybeMap = function maybeMap2(val, fn) {
  if (isArray$3(val)) {
    var mapped = [];
    for (var i = 0; i < val.length; i += 1) {
      mapped.push(fn(val[i]));
    }
    return mapped;
  }
  return fn(val);
};
var utils$2 = {
  arrayToObject,
  assign,
  combine,
  compact,
  decode,
  encode,
  isBuffer,
  isRegExp,
  maybeMap,
  merge
};
var getSideChannel2 = sideChannel;
var utils$1 = utils$2;
var formats$1 = formats$3;
var has$1 = Object.prototype.hasOwnProperty;
var arrayPrefixGenerators = {
  brackets: function brackets(prefix) {
    return prefix + "[]";
  },
  comma: "comma",
  indices: function indices(prefix, key) {
    return prefix + "[" + key + "]";
  },
  repeat: function repeat2(prefix) {
    return prefix;
  }
};
var isArray$2 = Array.isArray;
var split = String.prototype.split;
var push = Array.prototype.push;
var pushToArray = function(arr2, valueOrArray) {
  push.apply(arr2, isArray$2(valueOrArray) ? valueOrArray : [valueOrArray]);
};
var toISO = Date.prototype.toISOString;
var defaultFormat = formats$1["default"];
var defaults$1 = {
  addQueryPrefix: false,
  allowDots: false,
  charset: "utf-8",
  charsetSentinel: false,
  delimiter: "&",
  encode: true,
  encoder: utils$1.encode,
  encodeValuesOnly: false,
  format: defaultFormat,
  formatter: formats$1.formatters[defaultFormat],
  indices: false,
  serializeDate: function serializeDate(date) {
    return toISO.call(date);
  },
  skipNulls: false,
  strictNullHandling: false
};
var isNonNullishPrimitive = function isNonNullishPrimitive2(v2) {
  return typeof v2 === "string" || typeof v2 === "number" || typeof v2 === "boolean" || typeof v2 === "symbol" || typeof v2 === "bigint";
};
var sentinel = {};
var stringify$1 = function stringify(object, prefix, generateArrayPrefix, commaRoundTrip, strictNullHandling, skipNulls, encoder, filter2, sort, allowDots, serializeDate2, format, formatter, encodeValuesOnly, charset, sideChannel2) {
  var obj = object;
  var tmpSc = sideChannel2;
  var step = 0;
  var findFlag = false;
  while ((tmpSc = tmpSc.get(sentinel)) !== void 0 && !findFlag) {
    var pos = tmpSc.get(object);
    step += 1;
    if (typeof pos !== "undefined") {
      if (pos === step) {
        throw new RangeError("Cyclic object value");
      } else {
        findFlag = true;
      }
    }
    if (typeof tmpSc.get(sentinel) === "undefined") {
      step = 0;
    }
  }
  if (typeof filter2 === "function") {
    obj = filter2(prefix, obj);
  } else if (obj instanceof Date) {
    obj = serializeDate2(obj);
  } else if (generateArrayPrefix === "comma" && isArray$2(obj)) {
    obj = utils$1.maybeMap(obj, function(value2) {
      if (value2 instanceof Date) {
        return serializeDate2(value2);
      }
      return value2;
    });
  }
  if (obj === null) {
    if (strictNullHandling) {
      return encoder && !encodeValuesOnly ? encoder(prefix, defaults$1.encoder, charset, "key", format) : prefix;
    }
    obj = "";
  }
  if (isNonNullishPrimitive(obj) || utils$1.isBuffer(obj)) {
    if (encoder) {
      var keyValue = encodeValuesOnly ? prefix : encoder(prefix, defaults$1.encoder, charset, "key", format);
      if (generateArrayPrefix === "comma" && encodeValuesOnly) {
        var valuesArray = split.call(String(obj), ",");
        var valuesJoined = "";
        for (var i = 0; i < valuesArray.length; ++i) {
          valuesJoined += (i === 0 ? "" : ",") + formatter(encoder(valuesArray[i], defaults$1.encoder, charset, "value", format));
        }
        return [formatter(keyValue) + (commaRoundTrip && isArray$2(obj) && valuesArray.length === 1 ? "[]" : "") + "=" + valuesJoined];
      }
      return [formatter(keyValue) + "=" + formatter(encoder(obj, defaults$1.encoder, charset, "value", format))];
    }
    return [formatter(prefix) + "=" + formatter(String(obj))];
  }
  var values = [];
  if (typeof obj === "undefined") {
    return values;
  }
  var objKeys;
  if (generateArrayPrefix === "comma" && isArray$2(obj)) {
    objKeys = [{ value: obj.length > 0 ? obj.join(",") || null : void 0 }];
  } else if (isArray$2(filter2)) {
    objKeys = filter2;
  } else {
    var keys = Object.keys(obj);
    objKeys = sort ? keys.sort(sort) : keys;
  }
  var adjustedPrefix = commaRoundTrip && isArray$2(obj) && obj.length === 1 ? prefix + "[]" : prefix;
  for (var j2 = 0; j2 < objKeys.length; ++j2) {
    var key = objKeys[j2];
    var value = typeof key === "object" && typeof key.value !== "undefined" ? key.value : obj[key];
    if (skipNulls && value === null) {
      continue;
    }
    var keyPrefix = isArray$2(obj) ? typeof generateArrayPrefix === "function" ? generateArrayPrefix(adjustedPrefix, key) : adjustedPrefix : adjustedPrefix + (allowDots ? "." + key : "[" + key + "]");
    sideChannel2.set(object, step);
    var valueSideChannel = getSideChannel2();
    valueSideChannel.set(sentinel, sideChannel2);
    pushToArray(values, stringify(
      value,
      keyPrefix,
      generateArrayPrefix,
      commaRoundTrip,
      strictNullHandling,
      skipNulls,
      encoder,
      filter2,
      sort,
      allowDots,
      serializeDate2,
      format,
      formatter,
      encodeValuesOnly,
      charset,
      valueSideChannel
    ));
  }
  return values;
};
var normalizeStringifyOptions = function normalizeStringifyOptions2(opts) {
  if (!opts) {
    return defaults$1;
  }
  if (opts.encoder !== null && typeof opts.encoder !== "undefined" && typeof opts.encoder !== "function") {
    throw new TypeError("Encoder has to be a function.");
  }
  var charset = opts.charset || defaults$1.charset;
  if (typeof opts.charset !== "undefined" && opts.charset !== "utf-8" && opts.charset !== "iso-8859-1") {
    throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
  }
  var format = formats$1["default"];
  if (typeof opts.format !== "undefined") {
    if (!has$1.call(formats$1.formatters, opts.format)) {
      throw new TypeError("Unknown format option provided.");
    }
    format = opts.format;
  }
  var formatter = formats$1.formatters[format];
  var filter2 = defaults$1.filter;
  if (typeof opts.filter === "function" || isArray$2(opts.filter)) {
    filter2 = opts.filter;
  }
  return {
    addQueryPrefix: typeof opts.addQueryPrefix === "boolean" ? opts.addQueryPrefix : defaults$1.addQueryPrefix,
    allowDots: typeof opts.allowDots === "undefined" ? defaults$1.allowDots : !!opts.allowDots,
    charset,
    charsetSentinel: typeof opts.charsetSentinel === "boolean" ? opts.charsetSentinel : defaults$1.charsetSentinel,
    delimiter: typeof opts.delimiter === "undefined" ? defaults$1.delimiter : opts.delimiter,
    encode: typeof opts.encode === "boolean" ? opts.encode : defaults$1.encode,
    encoder: typeof opts.encoder === "function" ? opts.encoder : defaults$1.encoder,
    encodeValuesOnly: typeof opts.encodeValuesOnly === "boolean" ? opts.encodeValuesOnly : defaults$1.encodeValuesOnly,
    filter: filter2,
    format,
    formatter,
    serializeDate: typeof opts.serializeDate === "function" ? opts.serializeDate : defaults$1.serializeDate,
    skipNulls: typeof opts.skipNulls === "boolean" ? opts.skipNulls : defaults$1.skipNulls,
    sort: typeof opts.sort === "function" ? opts.sort : null,
    strictNullHandling: typeof opts.strictNullHandling === "boolean" ? opts.strictNullHandling : defaults$1.strictNullHandling
  };
};
var stringify_1 = function(object, opts) {
  var obj = object;
  var options = normalizeStringifyOptions(opts);
  var objKeys;
  var filter2;
  if (typeof options.filter === "function") {
    filter2 = options.filter;
    obj = filter2("", obj);
  } else if (isArray$2(options.filter)) {
    filter2 = options.filter;
    objKeys = filter2;
  }
  var keys = [];
  if (typeof obj !== "object" || obj === null) {
    return "";
  }
  var arrayFormat;
  if (opts && opts.arrayFormat in arrayPrefixGenerators) {
    arrayFormat = opts.arrayFormat;
  } else if (opts && "indices" in opts) {
    arrayFormat = opts.indices ? "indices" : "repeat";
  } else {
    arrayFormat = "indices";
  }
  var generateArrayPrefix = arrayPrefixGenerators[arrayFormat];
  if (opts && "commaRoundTrip" in opts && typeof opts.commaRoundTrip !== "boolean") {
    throw new TypeError("`commaRoundTrip` must be a boolean, or absent");
  }
  var commaRoundTrip = generateArrayPrefix === "comma" && opts && opts.commaRoundTrip;
  if (!objKeys) {
    objKeys = Object.keys(obj);
  }
  if (options.sort) {
    objKeys.sort(options.sort);
  }
  var sideChannel2 = getSideChannel2();
  for (var i = 0; i < objKeys.length; ++i) {
    var key = objKeys[i];
    if (options.skipNulls && obj[key] === null) {
      continue;
    }
    pushToArray(keys, stringify$1(
      obj[key],
      key,
      generateArrayPrefix,
      commaRoundTrip,
      options.strictNullHandling,
      options.skipNulls,
      options.encode ? options.encoder : null,
      options.filter,
      options.sort,
      options.allowDots,
      options.serializeDate,
      options.format,
      options.formatter,
      options.encodeValuesOnly,
      options.charset,
      sideChannel2
    ));
  }
  var joined = keys.join(options.delimiter);
  var prefix = options.addQueryPrefix === true ? "?" : "";
  if (options.charsetSentinel) {
    if (options.charset === "iso-8859-1") {
      prefix += "utf8=%26%2310003%3B&";
    } else {
      prefix += "utf8=%E2%9C%93&";
    }
  }
  return joined.length > 0 ? prefix + joined : "";
};
var utils = utils$2;
var has = Object.prototype.hasOwnProperty;
var isArray$1 = Array.isArray;
var defaults = {
  allowDots: false,
  allowPrototypes: false,
  allowSparse: false,
  arrayLimit: 20,
  charset: "utf-8",
  charsetSentinel: false,
  comma: false,
  decoder: utils.decode,
  delimiter: "&",
  depth: 5,
  ignoreQueryPrefix: false,
  interpretNumericEntities: false,
  parameterLimit: 1e3,
  parseArrays: true,
  plainObjects: false,
  strictNullHandling: false
};
var interpretNumericEntities = function(str) {
  return str.replace(/&#(\d+);/g, function($0, numberStr) {
    return String.fromCharCode(parseInt(numberStr, 10));
  });
};
var parseArrayValue = function(val, options) {
  if (val && typeof val === "string" && options.comma && val.indexOf(",") > -1) {
    return val.split(",");
  }
  return val;
};
var isoSentinel = "utf8=%26%2310003%3B";
var charsetSentinel = "utf8=%E2%9C%93";
var parseValues = function parseQueryStringValues(str, options) {
  var obj = {};
  var cleanStr = options.ignoreQueryPrefix ? str.replace(/^\?/, "") : str;
  var limit = options.parameterLimit === Infinity ? void 0 : options.parameterLimit;
  var parts = cleanStr.split(options.delimiter, limit);
  var skipIndex = -1;
  var i;
  var charset = options.charset;
  if (options.charsetSentinel) {
    for (i = 0; i < parts.length; ++i) {
      if (parts[i].indexOf("utf8=") === 0) {
        if (parts[i] === charsetSentinel) {
          charset = "utf-8";
        } else if (parts[i] === isoSentinel) {
          charset = "iso-8859-1";
        }
        skipIndex = i;
        i = parts.length;
      }
    }
  }
  for (i = 0; i < parts.length; ++i) {
    if (i === skipIndex) {
      continue;
    }
    var part = parts[i];
    var bracketEqualsPos = part.indexOf("]=");
    var pos = bracketEqualsPos === -1 ? part.indexOf("=") : bracketEqualsPos + 1;
    var key, val;
    if (pos === -1) {
      key = options.decoder(part, defaults.decoder, charset, "key");
      val = options.strictNullHandling ? null : "";
    } else {
      key = options.decoder(part.slice(0, pos), defaults.decoder, charset, "key");
      val = utils.maybeMap(
        parseArrayValue(part.slice(pos + 1), options),
        function(encodedVal) {
          return options.decoder(encodedVal, defaults.decoder, charset, "value");
        }
      );
    }
    if (val && options.interpretNumericEntities && charset === "iso-8859-1") {
      val = interpretNumericEntities(val);
    }
    if (part.indexOf("[]=") > -1) {
      val = isArray$1(val) ? [val] : val;
    }
    if (has.call(obj, key)) {
      obj[key] = utils.combine(obj[key], val);
    } else {
      obj[key] = val;
    }
  }
  return obj;
};
var parseObject = function(chain, val, options, valuesParsed) {
  var leaf = valuesParsed ? val : parseArrayValue(val, options);
  for (var i = chain.length - 1; i >= 0; --i) {
    var obj;
    var root = chain[i];
    if (root === "[]" && options.parseArrays) {
      obj = [].concat(leaf);
    } else {
      obj = options.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
      var cleanRoot = root.charAt(0) === "[" && root.charAt(root.length - 1) === "]" ? root.slice(1, -1) : root;
      var index2 = parseInt(cleanRoot, 10);
      if (!options.parseArrays && cleanRoot === "") {
        obj = { 0: leaf };
      } else if (!isNaN(index2) && root !== cleanRoot && String(index2) === cleanRoot && index2 >= 0 && (options.parseArrays && index2 <= options.arrayLimit)) {
        obj = [];
        obj[index2] = leaf;
      } else if (cleanRoot !== "__proto__") {
        obj[cleanRoot] = leaf;
      }
    }
    leaf = obj;
  }
  return leaf;
};
var parseKeys = function parseQueryStringKeys(givenKey, val, options, valuesParsed) {
  if (!givenKey) {
    return;
  }
  var key = options.allowDots ? givenKey.replace(/\.([^.[]+)/g, "[$1]") : givenKey;
  var brackets2 = /(\[[^[\]]*])/;
  var child = /(\[[^[\]]*])/g;
  var segment = options.depth > 0 && brackets2.exec(key);
  var parent = segment ? key.slice(0, segment.index) : key;
  var keys = [];
  if (parent) {
    if (!options.plainObjects && has.call(Object.prototype, parent)) {
      if (!options.allowPrototypes) {
        return;
      }
    }
    keys.push(parent);
  }
  var i = 0;
  while (options.depth > 0 && (segment = child.exec(key)) !== null && i < options.depth) {
    i += 1;
    if (!options.plainObjects && has.call(Object.prototype, segment[1].slice(1, -1))) {
      if (!options.allowPrototypes) {
        return;
      }
    }
    keys.push(segment[1]);
  }
  if (segment) {
    keys.push("[" + key.slice(segment.index) + "]");
  }
  return parseObject(keys, val, options, valuesParsed);
};
var normalizeParseOptions = function normalizeParseOptions2(opts) {
  if (!opts) {
    return defaults;
  }
  if (opts.decoder !== null && opts.decoder !== void 0 && typeof opts.decoder !== "function") {
    throw new TypeError("Decoder has to be a function.");
  }
  if (typeof opts.charset !== "undefined" && opts.charset !== "utf-8" && opts.charset !== "iso-8859-1") {
    throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
  }
  var charset = typeof opts.charset === "undefined" ? defaults.charset : opts.charset;
  return {
    allowDots: typeof opts.allowDots === "undefined" ? defaults.allowDots : !!opts.allowDots,
    allowPrototypes: typeof opts.allowPrototypes === "boolean" ? opts.allowPrototypes : defaults.allowPrototypes,
    allowSparse: typeof opts.allowSparse === "boolean" ? opts.allowSparse : defaults.allowSparse,
    arrayLimit: typeof opts.arrayLimit === "number" ? opts.arrayLimit : defaults.arrayLimit,
    charset,
    charsetSentinel: typeof opts.charsetSentinel === "boolean" ? opts.charsetSentinel : defaults.charsetSentinel,
    comma: typeof opts.comma === "boolean" ? opts.comma : defaults.comma,
    decoder: typeof opts.decoder === "function" ? opts.decoder : defaults.decoder,
    delimiter: typeof opts.delimiter === "string" || utils.isRegExp(opts.delimiter) ? opts.delimiter : defaults.delimiter,
    depth: typeof opts.depth === "number" || opts.depth === false ? +opts.depth : defaults.depth,
    ignoreQueryPrefix: opts.ignoreQueryPrefix === true,
    interpretNumericEntities: typeof opts.interpretNumericEntities === "boolean" ? opts.interpretNumericEntities : defaults.interpretNumericEntities,
    parameterLimit: typeof opts.parameterLimit === "number" ? opts.parameterLimit : defaults.parameterLimit,
    parseArrays: opts.parseArrays !== false,
    plainObjects: typeof opts.plainObjects === "boolean" ? opts.plainObjects : defaults.plainObjects,
    strictNullHandling: typeof opts.strictNullHandling === "boolean" ? opts.strictNullHandling : defaults.strictNullHandling
  };
};
var parse$1 = function(str, opts) {
  var options = normalizeParseOptions(opts);
  if (str === "" || str === null || typeof str === "undefined") {
    return options.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
  }
  var tempObj = typeof str === "string" ? parseValues(str, options) : str;
  var obj = options.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
  var keys = Object.keys(tempObj);
  for (var i = 0; i < keys.length; ++i) {
    var key = keys[i];
    var newObj = parseKeys(key, tempObj[key], options, typeof str === "string");
    obj = utils.merge(obj, newObj, options);
  }
  if (options.allowSparse === true) {
    return obj;
  }
  return utils.compact(obj);
};
var stringify2 = stringify_1;
var parse = parse$1;
var formats = formats$3;
var lib$1 = {
  formats,
  parse,
  stringify: stringify2
};
var types$1 = {};
(function(exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.ProviderType = exports.RegExpString = exports.IntNumber = exports.BigIntString = exports.AddressString = exports.HexString = exports.OpaqueType = void 0;
  function OpaqueType() {
    return (value) => value;
  }
  exports.OpaqueType = OpaqueType;
  exports.HexString = OpaqueType();
  exports.AddressString = OpaqueType();
  exports.BigIntString = OpaqueType();
  function IntNumber(num) {
    return Math.floor(num);
  }
  exports.IntNumber = IntNumber;
  exports.RegExpString = OpaqueType();
  (function(ProviderType) {
    ProviderType["CoinbaseWallet"] = "CoinbaseWallet";
    ProviderType["MetaMask"] = "MetaMask";
    ProviderType["Unselected"] = "";
  })(exports.ProviderType || (exports.ProviderType = {}));
})(types$1);
var __importDefault$7 = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(util$4, "__esModule", { value: true });
util$4.isInIFrame = util$4.createQrUrl = util$4.getFavicon = util$4.range = util$4.isBigNumber = util$4.ensureParsedJSONObject = util$4.ensureBN = util$4.ensureRegExpString = util$4.ensureIntNumber = util$4.ensureBuffer = util$4.ensureAddressString = util$4.ensureEvenLengthHexString = util$4.ensureHexString = util$4.isHexString = util$4.prepend0x = util$4.strip0x = util$4.has0xPrefix = util$4.hexStringFromIntNumber = util$4.intNumberFromHexString = util$4.bigIntStringFromBN = util$4.hexStringFromBuffer = util$4.hexStringToUint8Array = util$4.uint8ArrayToHex = util$4.randomBytesHex = void 0;
const bn_js_1$1 = __importDefault$7(bn.exports);
const qs_1 = lib$1;
const types_1$3 = types$1;
const INT_STRING_REGEX = /^[0-9]*$/;
const HEXADECIMAL_STRING_REGEX = /^[a-f0-9]*$/;
function randomBytesHex(length) {
  return uint8ArrayToHex(crypto.getRandomValues(new Uint8Array(length)));
}
util$4.randomBytesHex = randomBytesHex;
function uint8ArrayToHex(value) {
  return [...value].map((b2) => b2.toString(16).padStart(2, "0")).join("");
}
util$4.uint8ArrayToHex = uint8ArrayToHex;
function hexStringToUint8Array(hexString) {
  return new Uint8Array(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
}
util$4.hexStringToUint8Array = hexStringToUint8Array;
function hexStringFromBuffer(buf, includePrefix = false) {
  const hex = buf.toString("hex");
  return (0, types_1$3.HexString)(includePrefix ? "0x" + hex : hex);
}
util$4.hexStringFromBuffer = hexStringFromBuffer;
function bigIntStringFromBN(bn2) {
  return (0, types_1$3.BigIntString)(bn2.toString(10));
}
util$4.bigIntStringFromBN = bigIntStringFromBN;
function intNumberFromHexString(hex) {
  return (0, types_1$3.IntNumber)(new bn_js_1$1.default(ensureEvenLengthHexString(hex, false), 16).toNumber());
}
util$4.intNumberFromHexString = intNumberFromHexString;
function hexStringFromIntNumber(num) {
  return (0, types_1$3.HexString)("0x" + new bn_js_1$1.default(num).toString(16));
}
util$4.hexStringFromIntNumber = hexStringFromIntNumber;
function has0xPrefix(str) {
  return str.startsWith("0x") || str.startsWith("0X");
}
util$4.has0xPrefix = has0xPrefix;
function strip0x(hex) {
  if (has0xPrefix(hex)) {
    return hex.slice(2);
  }
  return hex;
}
util$4.strip0x = strip0x;
function prepend0x(hex) {
  if (has0xPrefix(hex)) {
    return "0x" + hex.slice(2);
  }
  return "0x" + hex;
}
util$4.prepend0x = prepend0x;
function isHexString$1(hex) {
  if (typeof hex !== "string") {
    return false;
  }
  const s2 = strip0x(hex).toLowerCase();
  return HEXADECIMAL_STRING_REGEX.test(s2);
}
util$4.isHexString = isHexString$1;
function ensureHexString(hex, includePrefix = false) {
  if (typeof hex === "string") {
    const s2 = strip0x(hex).toLowerCase();
    if (HEXADECIMAL_STRING_REGEX.test(s2)) {
      return (0, types_1$3.HexString)(includePrefix ? "0x" + s2 : s2);
    }
  }
  throw new Error(`"${String(hex)}" is not a hexadecimal string`);
}
util$4.ensureHexString = ensureHexString;
function ensureEvenLengthHexString(hex, includePrefix = false) {
  let h2 = ensureHexString(hex, false);
  if (h2.length % 2 === 1) {
    h2 = (0, types_1$3.HexString)("0" + h2);
  }
  return includePrefix ? (0, types_1$3.HexString)("0x" + h2) : h2;
}
util$4.ensureEvenLengthHexString = ensureEvenLengthHexString;
function ensureAddressString(str) {
  if (typeof str === "string") {
    const s2 = strip0x(str).toLowerCase();
    if (isHexString$1(s2) && s2.length === 40) {
      return (0, types_1$3.AddressString)(prepend0x(s2));
    }
  }
  throw new Error(`Invalid Ethereum address: ${String(str)}`);
}
util$4.ensureAddressString = ensureAddressString;
function ensureBuffer(str) {
  if (Buffer.isBuffer(str)) {
    return str;
  }
  if (typeof str === "string") {
    if (isHexString$1(str)) {
      const s2 = ensureEvenLengthHexString(str, false);
      return Buffer.from(s2, "hex");
    } else {
      return Buffer.from(str, "utf8");
    }
  }
  throw new Error(`Not binary data: ${String(str)}`);
}
util$4.ensureBuffer = ensureBuffer;
function ensureIntNumber(num) {
  if (typeof num === "number" && Number.isInteger(num)) {
    return (0, types_1$3.IntNumber)(num);
  }
  if (typeof num === "string") {
    if (INT_STRING_REGEX.test(num)) {
      return (0, types_1$3.IntNumber)(Number(num));
    }
    if (isHexString$1(num)) {
      return (0, types_1$3.IntNumber)(new bn_js_1$1.default(ensureEvenLengthHexString(num, false), 16).toNumber());
    }
  }
  throw new Error(`Not an integer: ${String(num)}`);
}
util$4.ensureIntNumber = ensureIntNumber;
function ensureRegExpString(regExp) {
  if (regExp instanceof RegExp) {
    return (0, types_1$3.RegExpString)(regExp.toString());
  }
  throw new Error(`Not a RegExp: ${String(regExp)}`);
}
util$4.ensureRegExpString = ensureRegExpString;
function ensureBN(val) {
  if (val !== null && (bn_js_1$1.default.isBN(val) || isBigNumber(val))) {
    return new bn_js_1$1.default(val.toString(10), 10);
  }
  if (typeof val === "number") {
    return new bn_js_1$1.default(ensureIntNumber(val));
  }
  if (typeof val === "string") {
    if (INT_STRING_REGEX.test(val)) {
      return new bn_js_1$1.default(val, 10);
    }
    if (isHexString$1(val)) {
      return new bn_js_1$1.default(ensureEvenLengthHexString(val, false), 16);
    }
  }
  throw new Error(`Not an integer: ${String(val)}`);
}
util$4.ensureBN = ensureBN;
function ensureParsedJSONObject(val) {
  if (typeof val === "string") {
    return JSON.parse(val);
  }
  if (typeof val === "object") {
    return val;
  }
  throw new Error(`Not a JSON string or an object: ${String(val)}`);
}
util$4.ensureParsedJSONObject = ensureParsedJSONObject;
function isBigNumber(val) {
  if (val == null || typeof val.constructor !== "function") {
    return false;
  }
  const { constructor } = val;
  return typeof constructor.config === "function" && typeof constructor.EUCLID === "number";
}
util$4.isBigNumber = isBigNumber;
function range(start, stop) {
  return Array.from({ length: stop - start }, (_2, i) => start + i);
}
util$4.range = range;
function getFavicon() {
  const el = document.querySelector('link[sizes="192x192"]') || document.querySelector('link[sizes="180x180"]') || document.querySelector('link[rel="icon"]') || document.querySelector('link[rel="shortcut icon"]');
  const { protocol, host } = document.location;
  const href = el ? el.getAttribute("href") : null;
  if (!href || href.startsWith("javascript:")) {
    return null;
  }
  if (href.startsWith("http://") || href.startsWith("https://") || href.startsWith("data:")) {
    return href;
  }
  if (href.startsWith("//")) {
    return protocol + href;
  }
  return `${protocol}//${host}${href}`;
}
util$4.getFavicon = getFavicon;
function createQrUrl(sessionId, sessionSecret, serverUrl, isParentConnection, version2, chainId) {
  const sessionIdKey = isParentConnection ? "parent-id" : "id";
  const query2 = (0, qs_1.stringify)({
    [sessionIdKey]: sessionId,
    secret: sessionSecret,
    server: serverUrl,
    v: version2,
    chainId
  });
  const qrUrl = `${serverUrl}/#/link?${query2}`;
  return qrUrl;
}
util$4.createQrUrl = createQrUrl;
function isInIFrame() {
  try {
    return window.frameElement !== null;
  } catch (e2) {
    return false;
  }
}
util$4.isInIFrame = isInIFrame;
Object.defineProperty(Session$1, "__esModule", { value: true });
Session$1.Session = void 0;
const rxjs_1$4 = require$$2$1;
const operators_1$2 = require$$3;
const sha_js_1 = sha_js.exports;
const util_1$7 = util$4;
const STORAGE_KEY_SESSION_ID = "session:id";
const STORAGE_KEY_SESSION_SECRET = "session:secret";
const STORAGE_KEY_SESSION_LINKED = "session:linked";
class Session {
  constructor(storage, id, secret, linked) {
    this._storage = storage;
    this._id = id || (0, util_1$7.randomBytesHex)(16);
    this._secret = secret || (0, util_1$7.randomBytesHex)(32);
    this._key = new sha_js_1.sha256().update(`${this._id}, ${this._secret} WalletLink`).digest("hex");
    this._linked = !!linked;
  }
  static load(storage) {
    const id = storage.getItem(STORAGE_KEY_SESSION_ID);
    const linked = storage.getItem(STORAGE_KEY_SESSION_LINKED);
    const secret = storage.getItem(STORAGE_KEY_SESSION_SECRET);
    if (id && secret) {
      return new Session(storage, id, secret, linked === "1");
    }
    return null;
  }
  static get persistedSessionIdChange$() {
    return (0, rxjs_1$4.fromEvent)(window, "storage").pipe((0, operators_1$2.filter)((evt) => evt.key === STORAGE_KEY_SESSION_ID), (0, operators_1$2.map)((evt) => ({
      oldValue: evt.oldValue || null,
      newValue: evt.newValue || null
    })));
  }
  static hash(sessionId) {
    return new sha_js_1.sha256().update(sessionId).digest("hex");
  }
  get id() {
    return this._id;
  }
  get secret() {
    return this._secret;
  }
  get key() {
    return this._key;
  }
  get linked() {
    return this._linked;
  }
  set linked(val) {
    this._linked = val;
    this.persistLinked();
  }
  save() {
    this._storage.setItem(STORAGE_KEY_SESSION_ID, this._id);
    this._storage.setItem(STORAGE_KEY_SESSION_SECRET, this._secret);
    this.persistLinked();
    return this;
  }
  persistLinked() {
    this._storage.setItem(STORAGE_KEY_SESSION_LINKED, this._linked ? "1" : "0");
  }
}
Session$1.Session = Session;
var WalletSDKRelayAbstract$1 = {};
Object.defineProperty(WalletSDKRelayAbstract$1, "__esModule", { value: true });
WalletSDKRelayAbstract$1.WalletSDKRelayAbstract = WalletSDKRelayAbstract$1.APP_VERSION_KEY = WalletSDKRelayAbstract$1.LOCAL_STORAGE_ADDRESSES_KEY = WalletSDKRelayAbstract$1.WALLET_USER_NAME_KEY = void 0;
const eth_rpc_errors_1$3 = dist$1;
WalletSDKRelayAbstract$1.WALLET_USER_NAME_KEY = "walletUsername";
WalletSDKRelayAbstract$1.LOCAL_STORAGE_ADDRESSES_KEY = "Addresses";
WalletSDKRelayAbstract$1.APP_VERSION_KEY = "AppVersion";
class WalletSDKRelayAbstract {
  async makeEthereumJSONRPCRequest(request, jsonRpcUrl) {
    if (!jsonRpcUrl)
      throw new Error("Error: No jsonRpcUrl provided");
    return window.fetch(jsonRpcUrl, {
      method: "POST",
      body: JSON.stringify(request),
      mode: "cors",
      headers: { "Content-Type": "application/json" }
    }).then((res) => res.json()).then((json) => {
      if (!json) {
        throw eth_rpc_errors_1$3.ethErrors.rpc.parse({});
      }
      const response = json;
      const { error } = response;
      if (error) {
        throw (0, eth_rpc_errors_1$3.serializeError)(error);
      }
      return response;
    });
  }
}
WalletSDKRelayAbstract$1.WalletSDKRelayAbstract = WalletSDKRelayAbstract;
const createKeccakHash = js;
const BN$1 = bn.exports;
function zeros(bytes) {
  return Buffer.allocUnsafe(bytes).fill(0);
}
function setLength(msg, length, right) {
  const buf = zeros(length);
  msg = toBuffer(msg);
  if (right) {
    if (msg.length < length) {
      msg.copy(buf);
      return buf;
    }
    return msg.slice(0, length);
  } else {
    if (msg.length < length) {
      msg.copy(buf, length - msg.length);
      return buf;
    }
    return msg.slice(-length);
  }
}
function setLengthRight(msg, length) {
  return setLength(msg, length, true);
}
function toBuffer(v2) {
  if (!Buffer.isBuffer(v2)) {
    if (Array.isArray(v2)) {
      v2 = Buffer.from(v2);
    } else if (typeof v2 === "string") {
      if (isHexString(v2)) {
        v2 = Buffer.from(padToEven(stripHexPrefix(v2)), "hex");
      } else {
        v2 = Buffer.from(v2);
      }
    } else if (typeof v2 === "number") {
      v2 = intToBuffer(v2);
    } else if (v2 === null || v2 === void 0) {
      v2 = Buffer.allocUnsafe(0);
    } else if (BN$1.isBN(v2)) {
      v2 = v2.toArrayLike(Buffer);
    } else if (v2.toArray) {
      v2 = Buffer.from(v2.toArray());
    } else {
      throw new Error("invalid type");
    }
  }
  return v2;
}
function bufferToHex(buf) {
  buf = toBuffer(buf);
  return "0x" + buf.toString("hex");
}
function keccak(a2, bits) {
  a2 = toBuffer(a2);
  if (!bits)
    bits = 256;
  return createKeccakHash("keccak" + bits).update(a2).digest();
}
function padToEven(str) {
  return str.length % 2 ? "0" + str : str;
}
function isHexString(str) {
  return typeof str === "string" && str.match(/^0x[0-9A-Fa-f]*$/);
}
function stripHexPrefix(str) {
  if (typeof str === "string" && str.startsWith("0x")) {
    return str.slice(2);
  }
  return str;
}
var util$3 = {
  zeros,
  setLength,
  setLengthRight,
  isHexString,
  stripHexPrefix,
  toBuffer,
  bufferToHex,
  keccak
};
const util$2 = util$3;
const BN = bn.exports;
function elementaryName(name2) {
  if (name2.startsWith("int[")) {
    return "int256" + name2.slice(3);
  } else if (name2 === "int") {
    return "int256";
  } else if (name2.startsWith("uint[")) {
    return "uint256" + name2.slice(4);
  } else if (name2 === "uint") {
    return "uint256";
  } else if (name2.startsWith("fixed[")) {
    return "fixed128x128" + name2.slice(5);
  } else if (name2 === "fixed") {
    return "fixed128x128";
  } else if (name2.startsWith("ufixed[")) {
    return "ufixed128x128" + name2.slice(6);
  } else if (name2 === "ufixed") {
    return "ufixed128x128";
  }
  return name2;
}
function parseTypeN(type) {
  return parseInt(/^\D+(\d+)$/.exec(type)[1], 10);
}
function parseTypeNxM(type) {
  var tmp = /^\D+(\d+)x(\d+)$/.exec(type);
  return [parseInt(tmp[1], 10), parseInt(tmp[2], 10)];
}
function parseTypeArray(type) {
  var tmp = type.match(/(.*)\[(.*?)\]$/);
  if (tmp) {
    return tmp[2] === "" ? "dynamic" : parseInt(tmp[2], 10);
  }
  return null;
}
function parseNumber(arg) {
  var type = typeof arg;
  if (type === "string") {
    if (util$2.isHexString(arg)) {
      return new BN(util$2.stripHexPrefix(arg), 16);
    } else {
      return new BN(arg, 10);
    }
  } else if (type === "number") {
    return new BN(arg);
  } else if (arg.toArray) {
    return arg;
  } else {
    throw new Error("Argument is not a number");
  }
}
function encodeSingle(type, arg) {
  var size, num, ret, i;
  if (type === "address") {
    return encodeSingle("uint160", parseNumber(arg));
  } else if (type === "bool") {
    return encodeSingle("uint8", arg ? 1 : 0);
  } else if (type === "string") {
    return encodeSingle("bytes", new Buffer(arg, "utf8"));
  } else if (isArray(type)) {
    if (typeof arg.length === "undefined") {
      throw new Error("Not an array?");
    }
    size = parseTypeArray(type);
    if (size !== "dynamic" && size !== 0 && arg.length > size) {
      throw new Error("Elements exceed array size: " + size);
    }
    ret = [];
    type = type.slice(0, type.lastIndexOf("["));
    if (typeof arg === "string") {
      arg = JSON.parse(arg);
    }
    for (i in arg) {
      ret.push(encodeSingle(type, arg[i]));
    }
    if (size === "dynamic") {
      var length = encodeSingle("uint256", arg.length);
      ret.unshift(length);
    }
    return Buffer.concat(ret);
  } else if (type === "bytes") {
    arg = new Buffer(arg);
    ret = Buffer.concat([encodeSingle("uint256", arg.length), arg]);
    if (arg.length % 32 !== 0) {
      ret = Buffer.concat([ret, util$2.zeros(32 - arg.length % 32)]);
    }
    return ret;
  } else if (type.startsWith("bytes")) {
    size = parseTypeN(type);
    if (size < 1 || size > 32) {
      throw new Error("Invalid bytes<N> width: " + size);
    }
    return util$2.setLengthRight(arg, 32);
  } else if (type.startsWith("uint")) {
    size = parseTypeN(type);
    if (size % 8 || size < 8 || size > 256) {
      throw new Error("Invalid uint<N> width: " + size);
    }
    num = parseNumber(arg);
    if (num.bitLength() > size) {
      throw new Error("Supplied uint exceeds width: " + size + " vs " + num.bitLength());
    }
    if (num < 0) {
      throw new Error("Supplied uint is negative");
    }
    return num.toArrayLike(Buffer, "be", 32);
  } else if (type.startsWith("int")) {
    size = parseTypeN(type);
    if (size % 8 || size < 8 || size > 256) {
      throw new Error("Invalid int<N> width: " + size);
    }
    num = parseNumber(arg);
    if (num.bitLength() > size) {
      throw new Error("Supplied int exceeds width: " + size + " vs " + num.bitLength());
    }
    return num.toTwos(256).toArrayLike(Buffer, "be", 32);
  } else if (type.startsWith("ufixed")) {
    size = parseTypeNxM(type);
    num = parseNumber(arg);
    if (num < 0) {
      throw new Error("Supplied ufixed is negative");
    }
    return encodeSingle("uint256", num.mul(new BN(2).pow(new BN(size[1]))));
  } else if (type.startsWith("fixed")) {
    size = parseTypeNxM(type);
    return encodeSingle("int256", parseNumber(arg).mul(new BN(2).pow(new BN(size[1]))));
  }
  throw new Error("Unsupported or invalid type: " + type);
}
function isDynamic(type) {
  return type === "string" || type === "bytes" || parseTypeArray(type) === "dynamic";
}
function isArray(type) {
  return type.lastIndexOf("]") === type.length - 1;
}
function rawEncode(types2, values) {
  var output = [];
  var data = [];
  var headLength = 32 * types2.length;
  for (var i in types2) {
    var type = elementaryName(types2[i]);
    var value = values[i];
    var cur = encodeSingle(type, value);
    if (isDynamic(type)) {
      output.push(encodeSingle("uint256", headLength));
      data.push(cur);
      headLength += cur.length;
    } else {
      output.push(cur);
    }
  }
  return Buffer.concat(output.concat(data));
}
function solidityPack(types2, values) {
  if (types2.length !== values.length) {
    throw new Error("Number of types are not matching the values");
  }
  var size, num;
  var ret = [];
  for (var i = 0; i < types2.length; i++) {
    var type = elementaryName(types2[i]);
    var value = values[i];
    if (type === "bytes") {
      ret.push(value);
    } else if (type === "string") {
      ret.push(new Buffer(value, "utf8"));
    } else if (type === "bool") {
      ret.push(new Buffer(value ? "01" : "00", "hex"));
    } else if (type === "address") {
      ret.push(util$2.setLength(value, 20));
    } else if (type.startsWith("bytes")) {
      size = parseTypeN(type);
      if (size < 1 || size > 32) {
        throw new Error("Invalid bytes<N> width: " + size);
      }
      ret.push(util$2.setLengthRight(value, size));
    } else if (type.startsWith("uint")) {
      size = parseTypeN(type);
      if (size % 8 || size < 8 || size > 256) {
        throw new Error("Invalid uint<N> width: " + size);
      }
      num = parseNumber(value);
      if (num.bitLength() > size) {
        throw new Error("Supplied uint exceeds width: " + size + " vs " + num.bitLength());
      }
      ret.push(num.toArrayLike(Buffer, "be", size / 8));
    } else if (type.startsWith("int")) {
      size = parseTypeN(type);
      if (size % 8 || size < 8 || size > 256) {
        throw new Error("Invalid int<N> width: " + size);
      }
      num = parseNumber(value);
      if (num.bitLength() > size) {
        throw new Error("Supplied int exceeds width: " + size + " vs " + num.bitLength());
      }
      ret.push(num.toTwos(size).toArrayLike(Buffer, "be", size / 8));
    } else {
      throw new Error("Unsupported or invalid type: " + type);
    }
  }
  return Buffer.concat(ret);
}
function soliditySHA3(types2, values) {
  return util$2.keccak(solidityPack(types2, values));
}
var abi$1 = {
  rawEncode,
  solidityPack,
  soliditySHA3
};
const util$1 = util$3;
const abi = abi$1;
const TYPED_MESSAGE_SCHEMA = {
  type: "object",
  properties: {
    types: {
      type: "object",
      additionalProperties: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            type: { type: "string" }
          },
          required: ["name", "type"]
        }
      }
    },
    primaryType: { type: "string" },
    domain: { type: "object" },
    message: { type: "object" }
  },
  required: ["types", "primaryType", "domain", "message"]
};
const TypedDataUtils = {
  encodeData(primaryType, data, types2, useV4 = true) {
    const encodedTypes = ["bytes32"];
    const encodedValues = [this.hashType(primaryType, types2)];
    if (useV4) {
      const encodeField = (name2, type, value) => {
        if (types2[type] !== void 0) {
          return ["bytes32", value == null ? "0x0000000000000000000000000000000000000000000000000000000000000000" : util$1.keccak(this.encodeData(type, value, types2, useV4))];
        }
        if (value === void 0)
          throw new Error(`missing value for field ${name2} of type ${type}`);
        if (type === "bytes") {
          return ["bytes32", util$1.keccak(value)];
        }
        if (type === "string") {
          if (typeof value === "string") {
            value = Buffer.from(value, "utf8");
          }
          return ["bytes32", util$1.keccak(value)];
        }
        if (type.lastIndexOf("]") === type.length - 1) {
          const parsedType = type.slice(0, type.lastIndexOf("["));
          const typeValuePairs = value.map((item) => encodeField(name2, parsedType, item));
          return ["bytes32", util$1.keccak(abi.rawEncode(
            typeValuePairs.map(([type2]) => type2),
            typeValuePairs.map(([, value2]) => value2)
          ))];
        }
        return [type, value];
      };
      for (const field of types2[primaryType]) {
        const [type, value] = encodeField(field.name, field.type, data[field.name]);
        encodedTypes.push(type);
        encodedValues.push(value);
      }
    } else {
      for (const field of types2[primaryType]) {
        let value = data[field.name];
        if (value !== void 0) {
          if (field.type === "bytes") {
            encodedTypes.push("bytes32");
            value = util$1.keccak(value);
            encodedValues.push(value);
          } else if (field.type === "string") {
            encodedTypes.push("bytes32");
            if (typeof value === "string") {
              value = Buffer.from(value, "utf8");
            }
            value = util$1.keccak(value);
            encodedValues.push(value);
          } else if (types2[field.type] !== void 0) {
            encodedTypes.push("bytes32");
            value = util$1.keccak(this.encodeData(field.type, value, types2, useV4));
            encodedValues.push(value);
          } else if (field.type.lastIndexOf("]") === field.type.length - 1) {
            throw new Error("Arrays currently unimplemented in encodeData");
          } else {
            encodedTypes.push(field.type);
            encodedValues.push(value);
          }
        }
      }
    }
    return abi.rawEncode(encodedTypes, encodedValues);
  },
  encodeType(primaryType, types2) {
    let result = "";
    let deps = this.findTypeDependencies(primaryType, types2).filter((dep) => dep !== primaryType);
    deps = [primaryType].concat(deps.sort());
    for (const type of deps) {
      const children = types2[type];
      if (!children) {
        throw new Error("No type definition specified: " + type);
      }
      result += type + "(" + types2[type].map(({ name: name2, type: type2 }) => type2 + " " + name2).join(",") + ")";
    }
    return result;
  },
  findTypeDependencies(primaryType, types2, results2 = []) {
    primaryType = primaryType.match(/^\w*/)[0];
    if (results2.includes(primaryType) || types2[primaryType] === void 0) {
      return results2;
    }
    results2.push(primaryType);
    for (const field of types2[primaryType]) {
      for (const dep of this.findTypeDependencies(field.type, types2, results2)) {
        !results2.includes(dep) && results2.push(dep);
      }
    }
    return results2;
  },
  hashStruct(primaryType, data, types2, useV4 = true) {
    return util$1.keccak(this.encodeData(primaryType, data, types2, useV4));
  },
  hashType(primaryType, types2) {
    return util$1.keccak(this.encodeType(primaryType, types2));
  },
  sanitizeData(data) {
    const sanitizedData = {};
    for (const key in TYPED_MESSAGE_SCHEMA.properties) {
      data[key] && (sanitizedData[key] = data[key]);
    }
    if (sanitizedData.types) {
      sanitizedData.types = Object.assign({ EIP712Domain: [] }, sanitizedData.types);
    }
    return sanitizedData;
  },
  hash(typedData, useV4 = true) {
    const sanitizedData = this.sanitizeData(typedData);
    const parts = [Buffer.from("1901", "hex")];
    parts.push(this.hashStruct("EIP712Domain", sanitizedData.domain, sanitizedData.types, useV4));
    if (sanitizedData.primaryType !== "EIP712Domain") {
      parts.push(this.hashStruct(sanitizedData.primaryType, sanitizedData.message, sanitizedData.types, useV4));
    }
    return util$1.keccak(Buffer.concat(parts));
  }
};
var ethEip712Util = {
  TYPED_MESSAGE_SCHEMA,
  TypedDataUtils,
  hashForSignTypedDataLegacy: function(msgParams) {
    return typedSignatureHashLegacy(msgParams.data);
  },
  hashForSignTypedData_v3: function(msgParams) {
    return TypedDataUtils.hash(msgParams.data, false);
  },
  hashForSignTypedData_v4: function(msgParams) {
    return TypedDataUtils.hash(msgParams.data);
  }
};
function typedSignatureHashLegacy(typedData) {
  const error = new Error("Expect argument to be non-empty array");
  if (typeof typedData !== "object" || !typedData.length)
    throw error;
  const data = typedData.map(function(e2) {
    return e2.type === "bytes" ? util$1.toBuffer(e2.value) : e2.value;
  });
  const types2 = typedData.map(function(e2) {
    return e2.type;
  });
  const schema = typedData.map(function(e2) {
    if (!e2.name)
      throw error;
    return e2.type + " " + e2.name;
  });
  return abi.soliditySHA3(
    ["bytes32", "bytes32"],
    [
      abi.soliditySHA3(new Array(typedData.length).fill("string"), schema),
      abi.soliditySHA3(types2, data)
    ]
  );
}
var FilterPolyfill$1 = {};
Object.defineProperty(FilterPolyfill$1, "__esModule", { value: true });
FilterPolyfill$1.filterFromParam = FilterPolyfill$1.FilterPolyfill = void 0;
const types_1$2 = types$1;
const util_1$6 = util$4;
const TIMEOUT = 5 * 60 * 1e3;
const JSONRPC_TEMPLATE = {
  jsonrpc: "2.0",
  id: 0
};
class FilterPolyfill {
  constructor(provider) {
    this.logFilters = /* @__PURE__ */ new Map();
    this.blockFilters = /* @__PURE__ */ new Set();
    this.pendingTransactionFilters = /* @__PURE__ */ new Set();
    this.cursors = /* @__PURE__ */ new Map();
    this.timeouts = /* @__PURE__ */ new Map();
    this.nextFilterId = (0, types_1$2.IntNumber)(1);
    this.provider = provider;
  }
  async newFilter(param) {
    const filter2 = filterFromParam(param);
    const id = this.makeFilterId();
    const cursor = await this.setInitialCursorPosition(id, filter2.fromBlock);
    console.log(`Installing new log filter(${id}):`, filter2, "initial cursor position:", cursor);
    this.logFilters.set(id, filter2);
    this.setFilterTimeout(id);
    return (0, util_1$6.hexStringFromIntNumber)(id);
  }
  async newBlockFilter() {
    const id = this.makeFilterId();
    const cursor = await this.setInitialCursorPosition(id, "latest");
    console.log(`Installing new block filter (${id}) with initial cursor position:`, cursor);
    this.blockFilters.add(id);
    this.setFilterTimeout(id);
    return (0, util_1$6.hexStringFromIntNumber)(id);
  }
  async newPendingTransactionFilter() {
    const id = this.makeFilterId();
    const cursor = await this.setInitialCursorPosition(id, "latest");
    console.log(`Installing new block filter (${id}) with initial cursor position:`, cursor);
    this.pendingTransactionFilters.add(id);
    this.setFilterTimeout(id);
    return (0, util_1$6.hexStringFromIntNumber)(id);
  }
  uninstallFilter(filterId) {
    const id = (0, util_1$6.intNumberFromHexString)(filterId);
    console.log(`Uninstalling filter (${id})`);
    this.deleteFilter(id);
    return true;
  }
  getFilterChanges(filterId) {
    const id = (0, util_1$6.intNumberFromHexString)(filterId);
    if (this.timeouts.has(id)) {
      this.setFilterTimeout(id);
    }
    if (this.logFilters.has(id)) {
      return this.getLogFilterChanges(id);
    } else if (this.blockFilters.has(id)) {
      return this.getBlockFilterChanges(id);
    } else if (this.pendingTransactionFilters.has(id)) {
      return this.getPendingTransactionFilterChanges(id);
    }
    return Promise.resolve(filterNotFoundError());
  }
  async getFilterLogs(filterId) {
    const id = (0, util_1$6.intNumberFromHexString)(filterId);
    const filter2 = this.logFilters.get(id);
    if (!filter2) {
      return filterNotFoundError();
    }
    return this.sendAsyncPromise(Object.assign(Object.assign({}, JSONRPC_TEMPLATE), { method: "eth_getLogs", params: [paramFromFilter(filter2)] }));
  }
  makeFilterId() {
    return (0, types_1$2.IntNumber)(++this.nextFilterId);
  }
  sendAsyncPromise(request) {
    return new Promise((resolve, reject) => {
      this.provider.sendAsync(request, (err, response) => {
        if (err) {
          return reject(err);
        }
        if (Array.isArray(response) || response == null) {
          return reject(new Error(`unexpected response received: ${JSON.stringify(response)}`));
        }
        resolve(response);
      });
    });
  }
  deleteFilter(id) {
    console.log(`Deleting filter (${id})`);
    this.logFilters.delete(id);
    this.blockFilters.delete(id);
    this.pendingTransactionFilters.delete(id);
    this.cursors.delete(id);
    this.timeouts.delete(id);
  }
  async getLogFilterChanges(id) {
    const filter2 = this.logFilters.get(id);
    const cursorPosition = this.cursors.get(id);
    if (!cursorPosition || !filter2) {
      return filterNotFoundError();
    }
    const currentBlockHeight = await this.getCurrentBlockHeight();
    const toBlock = filter2.toBlock === "latest" ? currentBlockHeight : filter2.toBlock;
    if (cursorPosition > currentBlockHeight) {
      return emptyResult();
    }
    if (cursorPosition > filter2.toBlock) {
      return emptyResult();
    }
    console.log(`Fetching logs from ${cursorPosition} to ${toBlock} for filter ${id}`);
    const response = await this.sendAsyncPromise(Object.assign(Object.assign({}, JSONRPC_TEMPLATE), { method: "eth_getLogs", params: [
      paramFromFilter(Object.assign(Object.assign({}, filter2), { fromBlock: cursorPosition, toBlock }))
    ] }));
    if (Array.isArray(response.result)) {
      const blocks = response.result.map((log) => (0, util_1$6.intNumberFromHexString)(log.blockNumber || "0x0"));
      const highestBlock = Math.max(...blocks);
      if (highestBlock && highestBlock > cursorPosition) {
        const newCursorPosition = (0, types_1$2.IntNumber)(highestBlock + 1);
        console.log(`Moving cursor position for filter (${id}) from ${cursorPosition} to ${newCursorPosition}`);
        this.cursors.set(id, newCursorPosition);
      }
    }
    return response;
  }
  async getBlockFilterChanges(id) {
    const cursorPosition = this.cursors.get(id);
    if (!cursorPosition) {
      return filterNotFoundError();
    }
    const currentBlockHeight = await this.getCurrentBlockHeight();
    if (cursorPosition > currentBlockHeight) {
      return emptyResult();
    }
    console.log(`Fetching blocks from ${cursorPosition} to ${currentBlockHeight} for filter (${id})`);
    const blocks = (await Promise.all(
      (0, util_1$6.range)(cursorPosition, currentBlockHeight + 1).map((i) => this.getBlockHashByNumber((0, types_1$2.IntNumber)(i)))
    )).filter((hash) => !!hash);
    const newCursorPosition = (0, types_1$2.IntNumber)(cursorPosition + blocks.length);
    console.log(`Moving cursor position for filter (${id}) from ${cursorPosition} to ${newCursorPosition}`);
    this.cursors.set(id, newCursorPosition);
    return Object.assign(Object.assign({}, JSONRPC_TEMPLATE), { result: blocks });
  }
  async getPendingTransactionFilterChanges(_id) {
    return Promise.resolve(emptyResult());
  }
  async setInitialCursorPosition(id, startBlock) {
    const currentBlockHeight = await this.getCurrentBlockHeight();
    const initialCursorPosition = typeof startBlock === "number" && startBlock > currentBlockHeight ? startBlock : currentBlockHeight;
    this.cursors.set(id, initialCursorPosition);
    return initialCursorPosition;
  }
  setFilterTimeout(id) {
    const existing = this.timeouts.get(id);
    if (existing) {
      window.clearTimeout(existing);
    }
    const timeout2 = window.setTimeout(() => {
      console.log(`Filter (${id}) timed out`);
      this.deleteFilter(id);
    }, TIMEOUT);
    this.timeouts.set(id, timeout2);
  }
  async getCurrentBlockHeight() {
    const { result } = await this.sendAsyncPromise(Object.assign(Object.assign({}, JSONRPC_TEMPLATE), { method: "eth_blockNumber", params: [] }));
    return (0, util_1$6.intNumberFromHexString)((0, util_1$6.ensureHexString)(result));
  }
  async getBlockHashByNumber(blockNumber) {
    const response = await this.sendAsyncPromise(Object.assign(Object.assign({}, JSONRPC_TEMPLATE), { method: "eth_getBlockByNumber", params: [(0, util_1$6.hexStringFromIntNumber)(blockNumber), false] }));
    if (response.result && typeof response.result.hash === "string") {
      return (0, util_1$6.ensureHexString)(response.result.hash);
    }
    return null;
  }
}
FilterPolyfill$1.FilterPolyfill = FilterPolyfill;
function filterFromParam(param) {
  return {
    fromBlock: intBlockHeightFromHexBlockHeight(param.fromBlock),
    toBlock: intBlockHeightFromHexBlockHeight(param.toBlock),
    addresses: param.address === void 0 ? null : Array.isArray(param.address) ? param.address : [param.address],
    topics: param.topics || []
  };
}
FilterPolyfill$1.filterFromParam = filterFromParam;
function paramFromFilter(filter2) {
  const param = {
    fromBlock: hexBlockHeightFromIntBlockHeight(filter2.fromBlock),
    toBlock: hexBlockHeightFromIntBlockHeight(filter2.toBlock),
    topics: filter2.topics
  };
  if (filter2.addresses !== null) {
    param.address = filter2.addresses;
  }
  return param;
}
function intBlockHeightFromHexBlockHeight(value) {
  if (value === void 0 || value === "latest" || value === "pending") {
    return "latest";
  } else if (value === "earliest") {
    return (0, types_1$2.IntNumber)(0);
  } else if ((0, util_1$6.isHexString)(value)) {
    return (0, util_1$6.intNumberFromHexString)(value);
  }
  throw new Error(`Invalid block option: ${String(value)}`);
}
function hexBlockHeightFromIntBlockHeight(value) {
  if (value === "latest") {
    return value;
  }
  return (0, util_1$6.hexStringFromIntNumber)(value);
}
function filterNotFoundError() {
  return Object.assign(Object.assign({}, JSONRPC_TEMPLATE), { error: { code: -32e3, message: "filter not found" } });
}
function emptyResult() {
  return Object.assign(Object.assign({}, JSONRPC_TEMPLATE), { result: [] });
}
var JSONRPC = {};
(function(exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.JSONRPCMethod = void 0;
  (function(JSONRPCMethod) {
    JSONRPCMethod["eth_accounts"] = "eth_accounts";
    JSONRPCMethod["eth_coinbase"] = "eth_coinbase";
    JSONRPCMethod["net_version"] = "net_version";
    JSONRPCMethod["eth_chainId"] = "eth_chainId";
    JSONRPCMethod["eth_uninstallFilter"] = "eth_uninstallFilter";
    JSONRPCMethod["eth_requestAccounts"] = "eth_requestAccounts";
    JSONRPCMethod["eth_sign"] = "eth_sign";
    JSONRPCMethod["eth_ecRecover"] = "eth_ecRecover";
    JSONRPCMethod["personal_sign"] = "personal_sign";
    JSONRPCMethod["personal_ecRecover"] = "personal_ecRecover";
    JSONRPCMethod["eth_signTransaction"] = "eth_signTransaction";
    JSONRPCMethod["eth_sendRawTransaction"] = "eth_sendRawTransaction";
    JSONRPCMethod["eth_sendTransaction"] = "eth_sendTransaction";
    JSONRPCMethod["eth_signTypedData_v1"] = "eth_signTypedData_v1";
    JSONRPCMethod["eth_signTypedData_v2"] = "eth_signTypedData_v2";
    JSONRPCMethod["eth_signTypedData_v3"] = "eth_signTypedData_v3";
    JSONRPCMethod["eth_signTypedData_v4"] = "eth_signTypedData_v4";
    JSONRPCMethod["eth_signTypedData"] = "eth_signTypedData";
    JSONRPCMethod["cbWallet_arbitrary"] = "walletlink_arbitrary";
    JSONRPCMethod["wallet_addEthereumChain"] = "wallet_addEthereumChain";
    JSONRPCMethod["wallet_switchEthereumChain"] = "wallet_switchEthereumChain";
    JSONRPCMethod["wallet_watchAsset"] = "wallet_watchAsset";
    JSONRPCMethod["eth_subscribe"] = "eth_subscribe";
    JSONRPCMethod["eth_unsubscribe"] = "eth_unsubscribe";
    JSONRPCMethod["eth_newFilter"] = "eth_newFilter";
    JSONRPCMethod["eth_newBlockFilter"] = "eth_newBlockFilter";
    JSONRPCMethod["eth_newPendingTransactionFilter"] = "eth_newPendingTransactionFilter";
    JSONRPCMethod["eth_getFilterChanges"] = "eth_getFilterChanges";
    JSONRPCMethod["eth_getFilterLogs"] = "eth_getFilterLogs";
  })(exports.JSONRPCMethod || (exports.JSONRPCMethod = {}));
})(JSONRPC);
var SubscriptionManager$1 = {};
const processFn$1 = (fn, opts) => function() {
  const P2 = opts.promiseModule;
  const args = new Array(arguments.length);
  for (let i = 0; i < arguments.length; i++) {
    args[i] = arguments[i];
  }
  return new P2((resolve, reject) => {
    if (opts.errorFirst) {
      args.push(function(err, result) {
        if (opts.multiArgs) {
          const results2 = new Array(arguments.length - 1);
          for (let i = 1; i < arguments.length; i++) {
            results2[i - 1] = arguments[i];
          }
          if (err) {
            results2.unshift(err);
            reject(results2);
          } else {
            resolve(results2);
          }
        } else if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    } else {
      args.push(function(result) {
        if (opts.multiArgs) {
          const results2 = new Array(arguments.length - 1);
          for (let i = 0; i < arguments.length; i++) {
            results2[i] = arguments[i];
          }
          resolve(results2);
        } else {
          resolve(result);
        }
      });
    }
    fn.apply(this, args);
  });
};
var pify$3 = (obj, opts) => {
  opts = Object.assign({
    exclude: [/.+(Sync|Stream)$/],
    errorFirst: true,
    promiseModule: Promise
  }, opts);
  const filter2 = (key) => {
    const match = (pattern) => typeof pattern === "string" ? key === pattern : pattern.test(key);
    return opts.include ? opts.include.some(match) : !opts.exclude.some(match);
  };
  let ret;
  if (typeof obj === "function") {
    ret = function() {
      if (opts.excludeMain) {
        return obj.apply(this, arguments);
      }
      return processFn$1(obj, opts).apply(this, arguments);
    };
  } else {
    ret = Object.create(Object.getPrototypeOf(obj));
  }
  for (const key in obj) {
    const x2 = obj[key];
    ret[key] = typeof x2 === "function" && filter2(key) ? processFn$1(x2, opts) : x2;
  }
  return ret;
};
var immutable = extend$1;
var hasOwnProperty = Object.prototype.hasOwnProperty;
function extend$1() {
  var target = {};
  for (var i = 0; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
      if (hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }
  return target;
}
var jsonRpcRandomId = IdIterator;
function IdIterator(opts) {
  opts = opts || {};
  var max2 = opts.max || Number.MAX_SAFE_INTEGER;
  var idCounter2 = typeof opts.start !== "undefined" ? opts.start : Math.floor(Math.random() * max2);
  return function createRandomId2() {
    idCounter2 = idCounter2 % max2;
    return idCounter2++;
  };
}
const extend = immutable;
const createRandomId = jsonRpcRandomId();
var ethQuery = EthQuery$1;
function EthQuery$1(provider) {
  const self = this;
  self.currentProvider = provider;
}
EthQuery$1.prototype.getBalance = generateFnWithDefaultBlockFor(2, "eth_getBalance");
EthQuery$1.prototype.getCode = generateFnWithDefaultBlockFor(2, "eth_getCode");
EthQuery$1.prototype.getTransactionCount = generateFnWithDefaultBlockFor(2, "eth_getTransactionCount");
EthQuery$1.prototype.getStorageAt = generateFnWithDefaultBlockFor(3, "eth_getStorageAt");
EthQuery$1.prototype.call = generateFnWithDefaultBlockFor(2, "eth_call");
EthQuery$1.prototype.protocolVersion = generateFnFor("eth_protocolVersion");
EthQuery$1.prototype.syncing = generateFnFor("eth_syncing");
EthQuery$1.prototype.coinbase = generateFnFor("eth_coinbase");
EthQuery$1.prototype.mining = generateFnFor("eth_mining");
EthQuery$1.prototype.hashrate = generateFnFor("eth_hashrate");
EthQuery$1.prototype.gasPrice = generateFnFor("eth_gasPrice");
EthQuery$1.prototype.accounts = generateFnFor("eth_accounts");
EthQuery$1.prototype.blockNumber = generateFnFor("eth_blockNumber");
EthQuery$1.prototype.getBlockTransactionCountByHash = generateFnFor("eth_getBlockTransactionCountByHash");
EthQuery$1.prototype.getBlockTransactionCountByNumber = generateFnFor("eth_getBlockTransactionCountByNumber");
EthQuery$1.prototype.getUncleCountByBlockHash = generateFnFor("eth_getUncleCountByBlockHash");
EthQuery$1.prototype.getUncleCountByBlockNumber = generateFnFor("eth_getUncleCountByBlockNumber");
EthQuery$1.prototype.sign = generateFnFor("eth_sign");
EthQuery$1.prototype.sendTransaction = generateFnFor("eth_sendTransaction");
EthQuery$1.prototype.sendRawTransaction = generateFnFor("eth_sendRawTransaction");
EthQuery$1.prototype.estimateGas = generateFnFor("eth_estimateGas");
EthQuery$1.prototype.getBlockByHash = generateFnFor("eth_getBlockByHash");
EthQuery$1.prototype.getBlockByNumber = generateFnFor("eth_getBlockByNumber");
EthQuery$1.prototype.getTransactionByHash = generateFnFor("eth_getTransactionByHash");
EthQuery$1.prototype.getTransactionByBlockHashAndIndex = generateFnFor("eth_getTransactionByBlockHashAndIndex");
EthQuery$1.prototype.getTransactionByBlockNumberAndIndex = generateFnFor("eth_getTransactionByBlockNumberAndIndex");
EthQuery$1.prototype.getTransactionReceipt = generateFnFor("eth_getTransactionReceipt");
EthQuery$1.prototype.getUncleByBlockHashAndIndex = generateFnFor("eth_getUncleByBlockHashAndIndex");
EthQuery$1.prototype.getUncleByBlockNumberAndIndex = generateFnFor("eth_getUncleByBlockNumberAndIndex");
EthQuery$1.prototype.getCompilers = generateFnFor("eth_getCompilers");
EthQuery$1.prototype.compileLLL = generateFnFor("eth_compileLLL");
EthQuery$1.prototype.compileSolidity = generateFnFor("eth_compileSolidity");
EthQuery$1.prototype.compileSerpent = generateFnFor("eth_compileSerpent");
EthQuery$1.prototype.newFilter = generateFnFor("eth_newFilter");
EthQuery$1.prototype.newBlockFilter = generateFnFor("eth_newBlockFilter");
EthQuery$1.prototype.newPendingTransactionFilter = generateFnFor("eth_newPendingTransactionFilter");
EthQuery$1.prototype.uninstallFilter = generateFnFor("eth_uninstallFilter");
EthQuery$1.prototype.getFilterChanges = generateFnFor("eth_getFilterChanges");
EthQuery$1.prototype.getFilterLogs = generateFnFor("eth_getFilterLogs");
EthQuery$1.prototype.getLogs = generateFnFor("eth_getLogs");
EthQuery$1.prototype.getWork = generateFnFor("eth_getWork");
EthQuery$1.prototype.submitWork = generateFnFor("eth_submitWork");
EthQuery$1.prototype.submitHashrate = generateFnFor("eth_submitHashrate");
EthQuery$1.prototype.sendAsync = function(opts, cb) {
  const self = this;
  self.currentProvider.sendAsync(createPayload(opts), function(err, response) {
    if (!err && response.error)
      err = new Error("EthQuery - RPC Error - " + response.error.message);
    if (err)
      return cb(err);
    cb(null, response.result);
  });
};
function generateFnFor(methodName) {
  return function() {
    const self = this;
    var args = [].slice.call(arguments);
    var cb = args.pop();
    self.sendAsync({
      method: methodName,
      params: args
    }, cb);
  };
}
function generateFnWithDefaultBlockFor(argCount, methodName) {
  return function() {
    const self = this;
    var args = [].slice.call(arguments);
    var cb = args.pop();
    if (args.length < argCount)
      args.push("latest");
    self.sendAsync({
      method: methodName,
      params: args
    }, cb);
  };
}
function createPayload(data) {
  return extend({
    id: createRandomId(),
    jsonrpc: "2.0",
    params: []
  }, data);
}
const util = util$5;
const EventEmitter = events.exports;
var R = typeof Reflect === "object" ? Reflect : null;
var ReflectApply = R && typeof R.apply === "function" ? R.apply : function ReflectApply2(target, receiver, args) {
  return Function.prototype.apply.call(target, receiver, args);
};
var safeEventEmitter = SafeEventEmitter$3;
function SafeEventEmitter$3() {
  EventEmitter.call(this);
}
util.inherits(SafeEventEmitter$3, EventEmitter);
SafeEventEmitter$3.prototype.emit = function(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++)
    args.push(arguments[i]);
  var doError = type === "error";
  var events2 = this._events;
  if (events2 !== void 0)
    doError = doError && events2.error === void 0;
  else if (!doError)
    return false;
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      throw er;
    }
    var err = new Error("Unhandled error." + (er ? " (" + er.message + ")" : ""));
    err.context = er;
    throw err;
  }
  var handler = events2[type];
  if (handler === void 0)
    return false;
  if (typeof handler === "function") {
    safeApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      safeApply(listeners[i], this, args);
  }
  return true;
};
function safeApply(handler, context, args) {
  try {
    ReflectApply(handler, context, args);
  } catch (err) {
    setTimeout(() => {
      throw err;
    });
  }
}
function arrayClone(arr2, n2) {
  var copy = new Array(n2);
  for (var i = 0; i < n2; ++i)
    copy[i] = arr2[i];
  return copy;
}
const SafeEventEmitter$2 = safeEventEmitter;
const sec$1 = 1e3;
const calculateSum = (accumulator, currentValue) => accumulator + currentValue;
const blockTrackerEvents = ["sync", "latest"];
class BaseBlockTracker$1 extends SafeEventEmitter$2 {
  constructor(opts = {}) {
    super();
    this._blockResetDuration = opts.blockResetDuration || 20 * sec$1;
    this._blockResetTimeout;
    this._currentBlock = null;
    this._isRunning = false;
    this._onNewListener = this._onNewListener.bind(this);
    this._onRemoveListener = this._onRemoveListener.bind(this);
    this._resetCurrentBlock = this._resetCurrentBlock.bind(this);
    this._setupInternalEvents();
  }
  isRunning() {
    return this._isRunning;
  }
  getCurrentBlock() {
    return this._currentBlock;
  }
  async getLatestBlock() {
    if (this._currentBlock)
      return this._currentBlock;
    const latestBlock = await new Promise((resolve) => this.once("latest", resolve));
    return latestBlock;
  }
  removeAllListeners(eventName) {
    if (eventName) {
      super.removeAllListeners(eventName);
    } else {
      super.removeAllListeners();
    }
    this._setupInternalEvents();
    this._onRemoveListener();
  }
  _start() {
  }
  _end() {
  }
  _setupInternalEvents() {
    this.removeListener("newListener", this._onNewListener);
    this.removeListener("removeListener", this._onRemoveListener);
    this.on("newListener", this._onNewListener);
    this.on("removeListener", this._onRemoveListener);
  }
  _onNewListener(eventName, handler) {
    if (!blockTrackerEvents.includes(eventName))
      return;
    this._maybeStart();
  }
  _onRemoveListener(eventName, handler) {
    if (this._getBlockTrackerEventCount() > 0)
      return;
    this._maybeEnd();
  }
  _maybeStart() {
    if (this._isRunning)
      return;
    this._isRunning = true;
    this._cancelBlockResetTimeout();
    this._start();
  }
  _maybeEnd() {
    if (!this._isRunning)
      return;
    this._isRunning = false;
    this._setupBlockResetTimeout();
    this._end();
  }
  _getBlockTrackerEventCount() {
    return blockTrackerEvents.map((eventName) => this.listenerCount(eventName)).reduce(calculateSum);
  }
  _newPotentialLatest(newBlock) {
    const currentBlock = this._currentBlock;
    if (currentBlock && hexToInt$4(newBlock) <= hexToInt$4(currentBlock))
      return;
    this._setCurrentBlock(newBlock);
  }
  _setCurrentBlock(newBlock) {
    const oldBlock = this._currentBlock;
    this._currentBlock = newBlock;
    this.emit("latest", newBlock);
    this.emit("sync", { oldBlock, newBlock });
  }
  _setupBlockResetTimeout() {
    this._cancelBlockResetTimeout();
    this._blockResetTimeout = setTimeout(this._resetCurrentBlock, this._blockResetDuration);
    if (this._blockResetTimeout.unref) {
      this._blockResetTimeout.unref();
    }
  }
  _cancelBlockResetTimeout() {
    clearTimeout(this._blockResetTimeout);
  }
  _resetCurrentBlock() {
    this._currentBlock = null;
  }
}
var base = BaseBlockTracker$1;
function hexToInt$4(hexInt) {
  return Number.parseInt(hexInt, 16);
}
const pify$2 = pify$3;
const BaseBlockTracker = base;
const sec = 1e3;
class PollingBlockTracker$1 extends BaseBlockTracker {
  constructor(opts = {}) {
    if (!opts.provider)
      throw new Error("PollingBlockTracker - no provider specified.");
    const pollingInterval = opts.pollingInterval || 20 * sec;
    const retryTimeout = opts.retryTimeout || pollingInterval / 10;
    const keepEventLoopActive = opts.keepEventLoopActive !== void 0 ? opts.keepEventLoopActive : true;
    const setSkipCacheFlag = opts.setSkipCacheFlag || false;
    super(Object.assign({
      blockResetDuration: pollingInterval
    }, opts));
    this._provider = opts.provider;
    this._pollingInterval = pollingInterval;
    this._retryTimeout = retryTimeout;
    this._keepEventLoopActive = keepEventLoopActive;
    this._setSkipCacheFlag = setSkipCacheFlag;
  }
  async checkForLatestBlock() {
    await this._updateLatestBlock();
    return await this.getLatestBlock();
  }
  _start() {
    this._performSync().catch((err) => this.emit("error", err));
  }
  async _performSync() {
    while (this._isRunning) {
      try {
        await this._updateLatestBlock();
        await timeout(this._pollingInterval, !this._keepEventLoopActive);
      } catch (err) {
        const newErr = new Error(`PollingBlockTracker - encountered an error while attempting to update latest block:
${err.stack}`);
        try {
          this.emit("error", newErr);
        } catch (emitErr) {
          console.error(newErr);
        }
        await timeout(this._retryTimeout, !this._keepEventLoopActive);
      }
    }
  }
  async _updateLatestBlock() {
    const latestBlock = await this._fetchLatestBlock();
    this._newPotentialLatest(latestBlock);
  }
  async _fetchLatestBlock() {
    const req = { jsonrpc: "2.0", id: 1, method: "eth_blockNumber", params: [] };
    if (this._setSkipCacheFlag)
      req.skipCache = true;
    const res = await pify$2((cb) => this._provider.sendAsync(req, cb))();
    if (res.error)
      throw new Error(`PollingBlockTracker - encountered error fetching block:
${res.error}`);
    return res.result;
  }
}
var polling = PollingBlockTracker$1;
function timeout(duration, unref) {
  return new Promise((resolve) => {
    const timoutRef = setTimeout(resolve, duration);
    if (timoutRef.unref && unref) {
      timoutRef.unref();
    }
  });
}
var createScaffoldMiddleware$3 = function createScaffoldMiddleware(handlers) {
  return (req, res, next, end) => {
    const handler = handlers[req.method];
    if (handler === void 0) {
      return next();
    }
    if (typeof handler === "function") {
      return handler(req, res, next, end);
    }
    res.result = handler;
    return end();
  };
};
var scaffold = createScaffoldMiddleware$3;
var dist = {};
var idRemapMiddleware = {};
var getUniqueId$1 = {};
Object.defineProperty(getUniqueId$1, "__esModule", { value: true });
getUniqueId$1.getUniqueId = void 0;
const MAX = 4294967295;
let idCounter = Math.floor(Math.random() * MAX);
function getUniqueId() {
  idCounter = (idCounter + 1) % MAX;
  return idCounter;
}
getUniqueId$1.getUniqueId = getUniqueId;
Object.defineProperty(idRemapMiddleware, "__esModule", { value: true });
idRemapMiddleware.createIdRemapMiddleware = void 0;
const getUniqueId_1 = getUniqueId$1;
function createIdRemapMiddleware() {
  return (req, res, next, _end) => {
    const originalId = req.id;
    const newId = getUniqueId_1.getUniqueId();
    req.id = newId;
    res.id = newId;
    next((done) => {
      req.id = originalId;
      res.id = originalId;
      done();
    });
  };
}
idRemapMiddleware.createIdRemapMiddleware = createIdRemapMiddleware;
var createAsyncMiddleware$3 = {};
Object.defineProperty(createAsyncMiddleware$3, "__esModule", { value: true });
createAsyncMiddleware$3.createAsyncMiddleware = void 0;
function createAsyncMiddleware$2(asyncMiddleware) {
  return async (req, res, next, end) => {
    let resolveNextPromise;
    const nextPromise = new Promise((resolve) => {
      resolveNextPromise = resolve;
    });
    let returnHandlerCallback = null;
    let nextWasCalled = false;
    const asyncNext = async () => {
      nextWasCalled = true;
      next((runReturnHandlersCallback) => {
        returnHandlerCallback = runReturnHandlersCallback;
        resolveNextPromise();
      });
      await nextPromise;
    };
    try {
      await asyncMiddleware(req, res, asyncNext);
      if (nextWasCalled) {
        await nextPromise;
        returnHandlerCallback(null);
      } else {
        end(null);
      }
    } catch (error) {
      if (returnHandlerCallback) {
        returnHandlerCallback(error);
      } else {
        end(error);
      }
    }
  };
}
createAsyncMiddleware$3.createAsyncMiddleware = createAsyncMiddleware$2;
var createScaffoldMiddleware$2 = {};
Object.defineProperty(createScaffoldMiddleware$2, "__esModule", { value: true });
createScaffoldMiddleware$2.createScaffoldMiddleware = void 0;
function createScaffoldMiddleware$1(handlers) {
  return (req, res, next, end) => {
    const handler = handlers[req.method];
    if (handler === void 0) {
      return next();
    }
    if (typeof handler === "function") {
      return handler(req, res, next, end);
    }
    res.result = handler;
    return end();
  };
}
createScaffoldMiddleware$2.createScaffoldMiddleware = createScaffoldMiddleware$1;
var JsonRpcEngine$1 = {};
var __importDefault$6 = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(JsonRpcEngine$1, "__esModule", { value: true });
JsonRpcEngine$1.JsonRpcEngine = void 0;
const safe_event_emitter_1$1 = __importDefault$6(safeEventEmitter$1);
const eth_rpc_errors_1$2 = dist$1;
class JsonRpcEngine extends safe_event_emitter_1$1.default {
  constructor() {
    super();
    this._middleware = [];
  }
  push(middleware) {
    this._middleware.push(middleware);
  }
  handle(req, cb) {
    if (cb && typeof cb !== "function") {
      throw new Error('"callback" must be a function if provided.');
    }
    if (Array.isArray(req)) {
      if (cb) {
        return this._handleBatch(req, cb);
      }
      return this._handleBatch(req);
    }
    if (cb) {
      return this._handle(req, cb);
    }
    return this._promiseHandle(req);
  }
  asMiddleware() {
    return async (req, res, next, end) => {
      try {
        const [middlewareError, isComplete, returnHandlers] = await JsonRpcEngine._runAllMiddleware(req, res, this._middleware);
        if (isComplete) {
          await JsonRpcEngine._runReturnHandlers(returnHandlers);
          return end(middlewareError);
        }
        return next(async (handlerCallback) => {
          try {
            await JsonRpcEngine._runReturnHandlers(returnHandlers);
          } catch (error) {
            return handlerCallback(error);
          }
          return handlerCallback();
        });
      } catch (error) {
        return end(error);
      }
    };
  }
  async _handleBatch(reqs, cb) {
    try {
      const responses = await Promise.all(
        reqs.map(this._promiseHandle.bind(this))
      );
      if (cb) {
        return cb(null, responses);
      }
      return responses;
    } catch (error) {
      if (cb) {
        return cb(error);
      }
      throw error;
    }
  }
  _promiseHandle(req) {
    return new Promise((resolve) => {
      this._handle(req, (_err, res) => {
        resolve(res);
      });
    });
  }
  async _handle(callerReq, cb) {
    if (!callerReq || Array.isArray(callerReq) || typeof callerReq !== "object") {
      const error2 = new eth_rpc_errors_1$2.EthereumRpcError(eth_rpc_errors_1$2.errorCodes.rpc.invalidRequest, `Requests must be plain objects. Received: ${typeof callerReq}`, { request: callerReq });
      return cb(error2, { id: void 0, jsonrpc: "2.0", error: error2 });
    }
    if (typeof callerReq.method !== "string") {
      const error2 = new eth_rpc_errors_1$2.EthereumRpcError(eth_rpc_errors_1$2.errorCodes.rpc.invalidRequest, `Must specify a string method. Received: ${typeof callerReq.method}`, { request: callerReq });
      return cb(error2, { id: callerReq.id, jsonrpc: "2.0", error: error2 });
    }
    const req = Object.assign({}, callerReq);
    const res = {
      id: req.id,
      jsonrpc: req.jsonrpc
    };
    let error = null;
    try {
      await this._processRequest(req, res);
    } catch (_error) {
      error = _error;
    }
    if (error) {
      delete res.result;
      if (!res.error) {
        res.error = eth_rpc_errors_1$2.serializeError(error);
      }
    }
    return cb(error, res);
  }
  async _processRequest(req, res) {
    const [error, isComplete, returnHandlers] = await JsonRpcEngine._runAllMiddleware(req, res, this._middleware);
    JsonRpcEngine._checkForCompletion(req, res, isComplete);
    await JsonRpcEngine._runReturnHandlers(returnHandlers);
    if (error) {
      throw error;
    }
  }
  static async _runAllMiddleware(req, res, middlewareStack) {
    const returnHandlers = [];
    let error = null;
    let isComplete = false;
    for (const middleware of middlewareStack) {
      [error, isComplete] = await JsonRpcEngine._runMiddleware(req, res, middleware, returnHandlers);
      if (isComplete) {
        break;
      }
    }
    return [error, isComplete, returnHandlers.reverse()];
  }
  static _runMiddleware(req, res, middleware, returnHandlers) {
    return new Promise((resolve) => {
      const end = (err) => {
        const error = err || res.error;
        if (error) {
          res.error = eth_rpc_errors_1$2.serializeError(error);
        }
        resolve([error, true]);
      };
      const next = (returnHandler) => {
        if (res.error) {
          end(res.error);
        } else {
          if (returnHandler) {
            if (typeof returnHandler !== "function") {
              end(new eth_rpc_errors_1$2.EthereumRpcError(eth_rpc_errors_1$2.errorCodes.rpc.internal, `JsonRpcEngine: "next" return handlers must be functions. Received "${typeof returnHandler}" for request:
${jsonify(req)}`, { request: req }));
            }
            returnHandlers.push(returnHandler);
          }
          resolve([null, false]);
        }
      };
      try {
        middleware(req, res, next, end);
      } catch (error) {
        end(error);
      }
    });
  }
  static async _runReturnHandlers(handlers) {
    for (const handler of handlers) {
      await new Promise((resolve, reject) => {
        handler((err) => err ? reject(err) : resolve());
      });
    }
  }
  static _checkForCompletion(req, res, isComplete) {
    if (!("result" in res) && !("error" in res)) {
      throw new eth_rpc_errors_1$2.EthereumRpcError(eth_rpc_errors_1$2.errorCodes.rpc.internal, `JsonRpcEngine: Response has no error or result for request:
${jsonify(req)}`, { request: req });
    }
    if (!isComplete) {
      throw new eth_rpc_errors_1$2.EthereumRpcError(eth_rpc_errors_1$2.errorCodes.rpc.internal, `JsonRpcEngine: Nothing ended request:
${jsonify(req)}`, { request: req });
    }
  }
}
JsonRpcEngine$1.JsonRpcEngine = JsonRpcEngine;
function jsonify(request) {
  return JSON.stringify(request, null, 2);
}
var mergeMiddleware$1 = {};
Object.defineProperty(mergeMiddleware$1, "__esModule", { value: true });
mergeMiddleware$1.mergeMiddleware = void 0;
const JsonRpcEngine_1 = JsonRpcEngine$1;
function mergeMiddleware(middlewareStack) {
  const engine = new JsonRpcEngine_1.JsonRpcEngine();
  middlewareStack.forEach((middleware) => engine.push(middleware));
  return engine.asMiddleware();
}
mergeMiddleware$1.mergeMiddleware = mergeMiddleware;
(function(exports) {
  var __createBinding2 = commonjsGlobal && commonjsGlobal.__createBinding || (Object.create ? function(o2, m2, k2, k22) {
    if (k22 === void 0)
      k22 = k2;
    Object.defineProperty(o2, k22, { enumerable: true, get: function() {
      return m2[k2];
    } });
  } : function(o2, m2, k2, k22) {
    if (k22 === void 0)
      k22 = k2;
    o2[k22] = m2[k2];
  });
  var __exportStar = commonjsGlobal && commonjsGlobal.__exportStar || function(m2, exports2) {
    for (var p2 in m2)
      if (p2 !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p2))
        __createBinding2(exports2, m2, p2);
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  __exportStar(idRemapMiddleware, exports);
  __exportStar(createAsyncMiddleware$3, exports);
  __exportStar(createScaffoldMiddleware$2, exports);
  __exportStar(getUniqueId$1, exports);
  __exportStar(JsonRpcEngine$1, exports);
  __exportStar(mergeMiddleware$1, exports);
})(dist);
var lib = {};
var Mutex$2 = {};
var require$$0$1 = /* @__PURE__ */ getAugmentedNamespace(tslib_es6);
var Semaphore$1 = {};
Object.defineProperty(Semaphore$1, "__esModule", { value: true });
var tslib_1$2 = require$$0$1;
var Semaphore = function() {
  function Semaphore2(_maxConcurrency) {
    this._maxConcurrency = _maxConcurrency;
    this._queue = [];
    if (_maxConcurrency <= 0) {
      throw new Error("semaphore must be initialized to a positive value");
    }
    this._value = _maxConcurrency;
  }
  Semaphore2.prototype.acquire = function() {
    var _this = this;
    var locked = this.isLocked();
    var ticket = new Promise(function(r2) {
      return _this._queue.push(r2);
    });
    if (!locked)
      this._dispatch();
    return ticket;
  };
  Semaphore2.prototype.runExclusive = function(callback) {
    return tslib_1$2.__awaiter(this, void 0, void 0, function() {
      var _a, value, release;
      return tslib_1$2.__generator(this, function(_b) {
        switch (_b.label) {
          case 0:
            return [4, this.acquire()];
          case 1:
            _a = _b.sent(), value = _a[0], release = _a[1];
            _b.label = 2;
          case 2:
            _b.trys.push([2, , 4, 5]);
            return [4, callback(value)];
          case 3:
            return [2, _b.sent()];
          case 4:
            release();
            return [7];
          case 5:
            return [2];
        }
      });
    });
  };
  Semaphore2.prototype.isLocked = function() {
    return this._value <= 0;
  };
  Semaphore2.prototype.release = function() {
    if (this._maxConcurrency > 1) {
      throw new Error("this method is unavailabel on semaphores with concurrency > 1; use the scoped release returned by acquire instead");
    }
    if (this._currentReleaser) {
      var releaser = this._currentReleaser;
      this._currentReleaser = void 0;
      releaser();
    }
  };
  Semaphore2.prototype._dispatch = function() {
    var _this = this;
    var nextConsumer = this._queue.shift();
    if (!nextConsumer)
      return;
    var released = false;
    this._currentReleaser = function() {
      if (released)
        return;
      released = true;
      _this._value++;
      _this._dispatch();
    };
    nextConsumer([this._value--, this._currentReleaser]);
  };
  return Semaphore2;
}();
Semaphore$1.default = Semaphore;
Object.defineProperty(Mutex$2, "__esModule", { value: true });
var tslib_1$1 = require$$0$1;
var Semaphore_1 = Semaphore$1;
var Mutex$1 = function() {
  function Mutex2() {
    this._semaphore = new Semaphore_1.default(1);
  }
  Mutex2.prototype.acquire = function() {
    return tslib_1$1.__awaiter(this, void 0, void 0, function() {
      var _a, releaser;
      return tslib_1$1.__generator(this, function(_b) {
        switch (_b.label) {
          case 0:
            return [4, this._semaphore.acquire()];
          case 1:
            _a = _b.sent(), releaser = _a[1];
            return [2, releaser];
        }
      });
    });
  };
  Mutex2.prototype.runExclusive = function(callback) {
    return this._semaphore.runExclusive(function() {
      return callback();
    });
  };
  Mutex2.prototype.isLocked = function() {
    return this._semaphore.isLocked();
  };
  Mutex2.prototype.release = function() {
    this._semaphore.release();
  };
  return Mutex2;
}();
Mutex$2.default = Mutex$1;
var withTimeout$1 = {};
Object.defineProperty(withTimeout$1, "__esModule", { value: true });
withTimeout$1.withTimeout = void 0;
var tslib_1 = require$$0$1;
function withTimeout(sync, timeout2, timeoutError) {
  var _this = this;
  if (timeoutError === void 0) {
    timeoutError = new Error("timeout");
  }
  return {
    acquire: function() {
      return new Promise(function(resolve, reject) {
        return tslib_1.__awaiter(_this, void 0, void 0, function() {
          var isTimeout, ticket, release;
          return tslib_1.__generator(this, function(_a) {
            switch (_a.label) {
              case 0:
                isTimeout = false;
                setTimeout(function() {
                  isTimeout = true;
                  reject(timeoutError);
                }, timeout2);
                return [4, sync.acquire()];
              case 1:
                ticket = _a.sent();
                if (isTimeout) {
                  release = Array.isArray(ticket) ? ticket[1] : ticket;
                  release();
                } else {
                  resolve(ticket);
                }
                return [2];
            }
          });
        });
      });
    },
    runExclusive: function(callback) {
      return tslib_1.__awaiter(this, void 0, void 0, function() {
        var release, ticket;
        return tslib_1.__generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              release = function() {
                return void 0;
              };
              _a.label = 1;
            case 1:
              _a.trys.push([1, , 7, 8]);
              return [4, this.acquire()];
            case 2:
              ticket = _a.sent();
              if (!Array.isArray(ticket))
                return [3, 4];
              release = ticket[1];
              return [4, callback(ticket[0])];
            case 3:
              return [2, _a.sent()];
            case 4:
              release = ticket;
              return [4, callback()];
            case 5:
              return [2, _a.sent()];
            case 6:
              return [3, 8];
            case 7:
              release();
              return [7];
            case 8:
              return [2];
          }
        });
      });
    },
    release: function() {
      sync.release();
    },
    isLocked: function() {
      return sync.isLocked();
    }
  };
}
withTimeout$1.withTimeout = withTimeout;
(function(exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.withTimeout = exports.Semaphore = exports.Mutex = void 0;
  var Mutex_1 = Mutex$2;
  Object.defineProperty(exports, "Mutex", { enumerable: true, get: function() {
    return Mutex_1.default;
  } });
  var Semaphore_12 = Semaphore$1;
  Object.defineProperty(exports, "Semaphore", { enumerable: true, get: function() {
    return Semaphore_12.default;
  } });
  var withTimeout_1 = withTimeout$1;
  Object.defineProperty(exports, "withTimeout", { enumerable: true, get: function() {
    return withTimeout_1.withTimeout;
  } });
})(lib);
const processFn = (fn, options, proxy, unwrapped) => function(...arguments_) {
  const P2 = options.promiseModule;
  return new P2((resolve, reject) => {
    if (options.multiArgs) {
      arguments_.push((...result) => {
        if (options.errorFirst) {
          if (result[0]) {
            reject(result);
          } else {
            result.shift();
            resolve(result);
          }
        } else {
          resolve(result);
        }
      });
    } else if (options.errorFirst) {
      arguments_.push((error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    } else {
      arguments_.push(resolve);
    }
    const self = this === proxy ? unwrapped : this;
    Reflect.apply(fn, self, arguments_);
  });
};
const filterCache = /* @__PURE__ */ new WeakMap();
var pify$1 = (input, options) => {
  options = {
    exclude: [/.+(?:Sync|Stream)$/],
    errorFirst: true,
    promiseModule: Promise,
    ...options
  };
  const objectType = typeof input;
  if (!(input !== null && (objectType === "object" || objectType === "function"))) {
    throw new TypeError(`Expected \`input\` to be a \`Function\` or \`Object\`, got \`${input === null ? "null" : objectType}\``);
  }
  const filter2 = (target, key) => {
    let cached = filterCache.get(target);
    if (!cached) {
      cached = {};
      filterCache.set(target, cached);
    }
    if (key in cached) {
      return cached[key];
    }
    const match = (pattern) => typeof pattern === "string" || typeof key === "symbol" ? key === pattern : pattern.test(key);
    const desc = Reflect.getOwnPropertyDescriptor(target, key);
    const writableOrConfigurableOwn = desc === void 0 || desc.writable || desc.configurable;
    const included = options.include ? options.include.some(match) : !options.exclude.some(match);
    const shouldFilter = included && writableOrConfigurableOwn;
    cached[key] = shouldFilter;
    return shouldFilter;
  };
  const cache = /* @__PURE__ */ new WeakMap();
  const proxy = new Proxy(input, {
    apply(target, thisArg, args) {
      const cached = cache.get(target);
      if (cached) {
        return Reflect.apply(cached, thisArg, args);
      }
      const pified = options.excludeMain ? target : processFn(target, options, proxy, target);
      cache.set(target, pified);
      return Reflect.apply(pified, thisArg, args);
    },
    get(target, key) {
      const property = target[key];
      if (!filter2(target, key) || property === Function.prototype[key]) {
        return property;
      }
      const cached = cache.get(property);
      if (cached) {
        return cached;
      }
      if (typeof property === "function") {
        const pified = processFn(property, options, proxy, target);
        cache.set(property, pified);
        return pified;
      }
      return property;
    }
  });
  return proxy;
};
const SafeEventEmitter$1 = safeEventEmitter$1.default;
class BaseFilter$3 extends SafeEventEmitter$1 {
  constructor() {
    super();
    this.updates = [];
  }
  async initialize() {
  }
  async update() {
    throw new Error("BaseFilter - no update method specified");
  }
  addResults(newResults) {
    this.updates = this.updates.concat(newResults);
    newResults.forEach((result) => this.emit("update", result));
  }
  addInitialResults(newResults) {
  }
  getChangesAndClear() {
    const updates = this.updates;
    this.updates = [];
    return updates;
  }
}
var baseFilter = BaseFilter$3;
const BaseFilter$2 = baseFilter;
class BaseFilterWithHistory$1 extends BaseFilter$2 {
  constructor() {
    super();
    this.allResults = [];
  }
  async update() {
    throw new Error("BaseFilterWithHistory - no update method specified");
  }
  addResults(newResults) {
    this.allResults = this.allResults.concat(newResults);
    super.addResults(newResults);
  }
  addInitialResults(newResults) {
    this.allResults = this.allResults.concat(newResults);
    super.addInitialResults(newResults);
  }
  getAllResults() {
    return this.allResults;
  }
}
var baseFilterHistory = BaseFilterWithHistory$1;
var hexUtils = {
  minBlockRef: minBlockRef$1,
  maxBlockRef,
  sortBlockRefs,
  bnToHex: bnToHex$1,
  blockRefIsNumber: blockRefIsNumber$1,
  hexToInt: hexToInt$3,
  incrementHexInt: incrementHexInt$4,
  intToHex: intToHex$2,
  unsafeRandomBytes: unsafeRandomBytes$1
};
function minBlockRef$1(...refs) {
  const sortedRefs = sortBlockRefs(refs);
  return sortedRefs[0];
}
function maxBlockRef(...refs) {
  const sortedRefs = sortBlockRefs(refs);
  return sortedRefs[sortedRefs.length - 1];
}
function sortBlockRefs(refs) {
  return refs.sort((refA, refB) => {
    if (refA === "latest" || refB === "earliest")
      return 1;
    if (refB === "latest" || refA === "earliest")
      return -1;
    return hexToInt$3(refA) - hexToInt$3(refB);
  });
}
function bnToHex$1(bn2) {
  return "0x" + bn2.toString(16);
}
function blockRefIsNumber$1(blockRef) {
  return blockRef && !["earliest", "latest", "pending"].includes(blockRef);
}
function hexToInt$3(hexString) {
  if (hexString === void 0 || hexString === null)
    return hexString;
  return Number.parseInt(hexString, 16);
}
function incrementHexInt$4(hexString) {
  if (hexString === void 0 || hexString === null)
    return hexString;
  const value = hexToInt$3(hexString);
  return intToHex$2(value + 1);
}
function intToHex$2(int) {
  if (int === void 0 || int === null)
    return int;
  let hexString = int.toString(16);
  const needsLeftPad = hexString.length % 2;
  if (needsLeftPad)
    hexString = "0" + hexString;
  return "0x" + hexString;
}
function unsafeRandomBytes$1(byteCount) {
  let result = "0x";
  for (let i = 0; i < byteCount; i++) {
    result += unsafeRandomNibble();
    result += unsafeRandomNibble();
  }
  return result;
}
function unsafeRandomNibble() {
  return Math.floor(Math.random() * 16).toString(16);
}
const EthQuery = ethQuery;
const pify = pify$1;
const BaseFilterWithHistory = baseFilterHistory;
const { bnToHex, hexToInt: hexToInt$2, incrementHexInt: incrementHexInt$3, minBlockRef, blockRefIsNumber } = hexUtils;
class LogFilter$1 extends BaseFilterWithHistory {
  constructor({ provider, params }) {
    super();
    this.type = "log";
    this.ethQuery = new EthQuery(provider);
    this.params = Object.assign({
      fromBlock: "latest",
      toBlock: "latest",
      address: void 0,
      topics: []
    }, params);
    if (this.params.address) {
      if (!Array.isArray(this.params.address)) {
        this.params.address = [this.params.address];
      }
      this.params.address = this.params.address.map((address) => address.toLowerCase());
    }
  }
  async initialize({ currentBlock }) {
    let fromBlock = this.params.fromBlock;
    if (["latest", "pending"].includes(fromBlock))
      fromBlock = currentBlock;
    if ("earliest" === fromBlock)
      fromBlock = "0x0";
    this.params.fromBlock = fromBlock;
    const toBlock = minBlockRef(this.params.toBlock, currentBlock);
    const params = Object.assign({}, this.params, { toBlock });
    const newLogs = await this._fetchLogs(params);
    this.addInitialResults(newLogs);
  }
  async update({ oldBlock, newBlock }) {
    const toBlock = newBlock;
    let fromBlock;
    if (oldBlock) {
      fromBlock = incrementHexInt$3(oldBlock);
    } else {
      fromBlock = newBlock;
    }
    const params = Object.assign({}, this.params, { fromBlock, toBlock });
    const newLogs = await this._fetchLogs(params);
    const matchingLogs = newLogs.filter((log) => this.matchLog(log));
    this.addResults(matchingLogs);
  }
  async _fetchLogs(params) {
    const newLogs = await pify((cb) => this.ethQuery.getLogs(params, cb))();
    return newLogs;
  }
  matchLog(log) {
    if (hexToInt$2(this.params.fromBlock) >= hexToInt$2(log.blockNumber))
      return false;
    if (blockRefIsNumber(this.params.toBlock) && hexToInt$2(this.params.toBlock) <= hexToInt$2(log.blockNumber))
      return false;
    const normalizedLogAddress = log.address && log.address.toLowerCase();
    if (this.params.address && normalizedLogAddress && !this.params.address.includes(normalizedLogAddress))
      return false;
    const topicsMatch = this.params.topics.every((topicPattern, index2) => {
      let logTopic = log.topics[index2];
      if (!logTopic)
        return false;
      logTopic = logTopic.toLowerCase();
      let subtopicsToMatch = Array.isArray(topicPattern) ? topicPattern : [topicPattern];
      const subtopicsIncludeWildcard = subtopicsToMatch.includes(null);
      if (subtopicsIncludeWildcard)
        return true;
      subtopicsToMatch = subtopicsToMatch.map((topic) => topic.toLowerCase());
      const topicDoesMatch = subtopicsToMatch.includes(logTopic);
      return topicDoesMatch;
    });
    return topicsMatch;
  }
}
var logFilter = LogFilter$1;
var getBlocksForRange_1 = getBlocksForRange$3;
async function getBlocksForRange$3({ provider, fromBlock, toBlock }) {
  if (!fromBlock)
    fromBlock = toBlock;
  const fromBlockNumber = hexToInt$1(fromBlock);
  const toBlockNumber = hexToInt$1(toBlock);
  const blockCountToQuery = toBlockNumber - fromBlockNumber + 1;
  const missingBlockNumbers = Array(blockCountToQuery).fill().map((_2, index2) => fromBlockNumber + index2).map(intToHex$1);
  const blockBodies = await Promise.all(
    missingBlockNumbers.map((blockNum) => query(provider, "eth_getBlockByNumber", [blockNum, false]))
  );
  return blockBodies;
}
function hexToInt$1(hexString) {
  if (hexString === void 0 || hexString === null)
    return hexString;
  return Number.parseInt(hexString, 16);
}
function intToHex$1(int) {
  if (int === void 0 || int === null)
    return int;
  const hexString = int.toString(16);
  return "0x" + hexString;
}
function query(provider, method, params) {
  return new Promise((resolve, reject) => {
    provider.sendAsync({ id: 1, jsonrpc: "2.0", method, params }, (err, res) => {
      if (err)
        return reject(err);
      resolve(res.result);
    });
  });
}
const BaseFilter$1 = baseFilter;
const getBlocksForRange$2 = getBlocksForRange_1;
const { incrementHexInt: incrementHexInt$2 } = hexUtils;
class BlockFilter$1 extends BaseFilter$1 {
  constructor({ provider, params }) {
    super();
    this.type = "block";
    this.provider = provider;
  }
  async update({ oldBlock, newBlock }) {
    const toBlock = newBlock;
    const fromBlock = incrementHexInt$2(oldBlock);
    const blockBodies = await getBlocksForRange$2({ provider: this.provider, fromBlock, toBlock });
    const blockHashes = blockBodies.map((block) => block.hash);
    this.addResults(blockHashes);
  }
}
var blockFilter = BlockFilter$1;
const BaseFilter = baseFilter;
const getBlocksForRange$1 = getBlocksForRange_1;
const { incrementHexInt: incrementHexInt$1 } = hexUtils;
class TxFilter$1 extends BaseFilter {
  constructor({ provider }) {
    super();
    this.type = "tx";
    this.provider = provider;
  }
  async update({ oldBlock }) {
    const toBlock = oldBlock;
    const fromBlock = incrementHexInt$1(oldBlock);
    const blocks = await getBlocksForRange$1({ provider: this.provider, fromBlock, toBlock });
    const blockTxHashes = [];
    for (const block of blocks) {
      blockTxHashes.push(...block.transactions);
    }
    this.addResults(blockTxHashes);
  }
}
var txFilter = TxFilter$1;
const Mutex = lib.Mutex;
const { createAsyncMiddleware: createAsyncMiddleware$1 } = dist;
const createJsonRpcMiddleware = scaffold;
const LogFilter = logFilter;
const BlockFilter = blockFilter;
const TxFilter = txFilter;
const { intToHex, hexToInt } = hexUtils;
var ethJsonRpcFilters = createEthFilterMiddleware;
function createEthFilterMiddleware({ blockTracker, provider }) {
  let filterIndex = 0;
  let filters = {};
  const mutex = new Mutex();
  const waitForFree = mutexMiddlewareWrapper({ mutex });
  const middleware = createJsonRpcMiddleware({
    eth_newFilter: waitForFree(toFilterCreationMiddleware(newLogFilter)),
    eth_newBlockFilter: waitForFree(toFilterCreationMiddleware(newBlockFilter)),
    eth_newPendingTransactionFilter: waitForFree(toFilterCreationMiddleware(newPendingTransactionFilter)),
    eth_uninstallFilter: waitForFree(toAsyncRpcMiddleware(uninstallFilterHandler)),
    eth_getFilterChanges: waitForFree(toAsyncRpcMiddleware(getFilterChanges)),
    eth_getFilterLogs: waitForFree(toAsyncRpcMiddleware(getFilterLogs))
  });
  const filterUpdater = async ({ oldBlock, newBlock }) => {
    if (filters.length === 0)
      return;
    const releaseLock = await mutex.acquire();
    try {
      await Promise.all(objValues(filters).map(async (filter2) => {
        try {
          await filter2.update({ oldBlock, newBlock });
        } catch (err) {
          console.error(err);
        }
      }));
    } catch (err) {
      console.error(err);
    }
    releaseLock();
  };
  middleware.newLogFilter = newLogFilter;
  middleware.newBlockFilter = newBlockFilter;
  middleware.newPendingTransactionFilter = newPendingTransactionFilter;
  middleware.uninstallFilter = uninstallFilterHandler;
  middleware.getFilterChanges = getFilterChanges;
  middleware.getFilterLogs = getFilterLogs;
  middleware.destroy = () => {
    uninstallAllFilters();
  };
  return middleware;
  async function newLogFilter(params) {
    const filter2 = new LogFilter({ provider, params });
    await installFilter(filter2);
    return filter2;
  }
  async function newBlockFilter() {
    const filter2 = new BlockFilter({ provider });
    await installFilter(filter2);
    return filter2;
  }
  async function newPendingTransactionFilter() {
    const filter2 = new TxFilter({ provider });
    await installFilter(filter2);
    return filter2;
  }
  async function getFilterChanges(filterIndexHex) {
    const filterIndex2 = hexToInt(filterIndexHex);
    const filter2 = filters[filterIndex2];
    if (!filter2) {
      throw new Error(`No filter for index "${filterIndex2}"`);
    }
    const results2 = filter2.getChangesAndClear();
    return results2;
  }
  async function getFilterLogs(filterIndexHex) {
    const filterIndex2 = hexToInt(filterIndexHex);
    const filter2 = filters[filterIndex2];
    if (!filter2) {
      throw new Error(`No filter for index "${filterIndex2}"`);
    }
    if (filter2.type === "log") {
      results = filter2.getAllResults();
    } else {
      results = [];
    }
    return results;
  }
  async function uninstallFilterHandler(filterIndexHex) {
    const filterIndex2 = hexToInt(filterIndexHex);
    const filter2 = filters[filterIndex2];
    const result = Boolean(filter2);
    if (result) {
      await uninstallFilter(filterIndex2);
    }
    return result;
  }
  async function installFilter(filter2) {
    const prevFilterCount = objValues(filters).length;
    const currentBlock = await blockTracker.getLatestBlock();
    await filter2.initialize({ currentBlock });
    filterIndex++;
    filters[filterIndex] = filter2;
    filter2.id = filterIndex;
    filter2.idHex = intToHex(filterIndex);
    const newFilterCount = objValues(filters).length;
    updateBlockTrackerSubs({ prevFilterCount, newFilterCount });
    return filterIndex;
  }
  async function uninstallFilter(filterIndex2) {
    const prevFilterCount = objValues(filters).length;
    delete filters[filterIndex2];
    const newFilterCount = objValues(filters).length;
    updateBlockTrackerSubs({ prevFilterCount, newFilterCount });
  }
  async function uninstallAllFilters() {
    const prevFilterCount = objValues(filters).length;
    filters = {};
    updateBlockTrackerSubs({ prevFilterCount, newFilterCount: 0 });
  }
  function updateBlockTrackerSubs({ prevFilterCount, newFilterCount }) {
    if (prevFilterCount === 0 && newFilterCount > 0) {
      blockTracker.on("sync", filterUpdater);
      return;
    }
    if (prevFilterCount > 0 && newFilterCount === 0) {
      blockTracker.removeListener("sync", filterUpdater);
      return;
    }
  }
}
function toFilterCreationMiddleware(createFilterFn) {
  return toAsyncRpcMiddleware(async (...args) => {
    const filter2 = await createFilterFn(...args);
    const result = intToHex(filter2.id);
    return result;
  });
}
function toAsyncRpcMiddleware(asyncFn) {
  return createAsyncMiddleware$1(async (req, res) => {
    const result = await asyncFn.apply(null, req.params);
    res.result = result;
  });
}
function mutexMiddlewareWrapper({ mutex }) {
  return (middleware) => {
    return async (req, res, next, end) => {
      const releaseLock = await mutex.acquire();
      releaseLock();
      middleware(req, res, next, end);
    };
  };
}
function objValues(obj, fn) {
  const values = [];
  for (let key in obj) {
    values.push(obj[key]);
  }
  return values;
}
const SafeEventEmitter = safeEventEmitter$1.default;
const createScaffoldMiddleware2 = scaffold;
const { createAsyncMiddleware } = dist;
const createFilterMiddleware = ethJsonRpcFilters;
const { unsafeRandomBytes, incrementHexInt } = hexUtils;
const getBlocksForRange = getBlocksForRange_1;
var subscriptionManager = createSubscriptionMiddleware;
function createSubscriptionMiddleware({ blockTracker, provider }) {
  const subscriptions = {};
  const filterManager = createFilterMiddleware({ blockTracker, provider });
  let isDestroyed = false;
  const events2 = new SafeEventEmitter();
  const middleware = createScaffoldMiddleware2({
    eth_subscribe: createAsyncMiddleware(subscribe),
    eth_unsubscribe: createAsyncMiddleware(unsubscribe)
  });
  middleware.destroy = destroy;
  return { events: events2, middleware };
  async function subscribe(req, res) {
    if (isDestroyed)
      throw new Error(
        "SubscriptionManager - attempting to use after destroying"
      );
    const subscriptionType = req.params[0];
    const subId = unsafeRandomBytes(16);
    let sub;
    switch (subscriptionType) {
      case "newHeads":
        sub = createSubNewHeads({ subId });
        break;
      case "logs":
        const filterParams = req.params[1];
        const filter2 = await filterManager.newLogFilter(filterParams);
        sub = createSubFromFilter({ subId, filter: filter2 });
        break;
      default:
        throw new Error(`SubscriptionManager - unsupported subscription type "${subscriptionType}"`);
    }
    subscriptions[subId] = sub;
    res.result = subId;
    return;
    function createSubNewHeads({ subId: subId2 }) {
      const sub2 = {
        type: subscriptionType,
        destroy: async () => {
          blockTracker.removeListener("sync", sub2.update);
        },
        update: async ({ oldBlock, newBlock }) => {
          const toBlock = newBlock;
          const fromBlock = incrementHexInt(oldBlock);
          const rawBlocks = await getBlocksForRange({ provider, fromBlock, toBlock });
          const results2 = rawBlocks.map(normalizeBlock);
          results2.forEach((value) => {
            _emitSubscriptionResult(subId2, value);
          });
        }
      };
      blockTracker.on("sync", sub2.update);
      return sub2;
    }
    function createSubFromFilter({ subId: subId2, filter: filter2 }) {
      filter2.on("update", (result) => _emitSubscriptionResult(subId2, result));
      const sub2 = {
        type: subscriptionType,
        destroy: async () => {
          return await filterManager.uninstallFilter(filter2.idHex);
        }
      };
      return sub2;
    }
  }
  async function unsubscribe(req, res) {
    if (isDestroyed)
      throw new Error(
        "SubscriptionManager - attempting to use after destroying"
      );
    const id = req.params[0];
    const subscription = subscriptions[id];
    if (!subscription) {
      res.result = false;
      return;
    }
    delete subscriptions[id];
    await subscription.destroy();
    res.result = true;
  }
  function _emitSubscriptionResult(filterIdHex, value) {
    events2.emit("notification", {
      jsonrpc: "2.0",
      method: "eth_subscription",
      params: {
        subscription: filterIdHex,
        result: value
      }
    });
  }
  function destroy() {
    events2.removeAllListeners();
    for (const id in subscriptions) {
      subscriptions[id].destroy();
      delete subscriptions[id];
    }
    isDestroyed = true;
  }
}
function normalizeBlock(block) {
  return {
    hash: block.hash,
    parentHash: block.parentHash,
    sha3Uncles: block.sha3Uncles,
    miner: block.miner,
    stateRoot: block.stateRoot,
    transactionsRoot: block.transactionsRoot,
    receiptsRoot: block.receiptsRoot,
    logsBloom: block.logsBloom,
    difficulty: block.difficulty,
    number: block.number,
    gasLimit: block.gasLimit,
    gasUsed: block.gasUsed,
    nonce: block.nonce,
    mixHash: block.mixHash,
    timestamp: block.timestamp,
    extraData: block.extraData
  };
}
Object.defineProperty(SubscriptionManager$1, "__esModule", { value: true });
SubscriptionManager$1.SubscriptionManager = void 0;
const PollingBlockTracker = polling;
const createSubscriptionManager = subscriptionManager;
const noop = () => {
};
class SubscriptionManager {
  constructor(provider) {
    const blockTracker = new PollingBlockTracker({
      provider,
      pollingInterval: 15 * 1e3,
      setSkipCacheFlag: true
    });
    const { events: events2, middleware } = createSubscriptionManager({
      blockTracker,
      provider
    });
    this.events = events2;
    this.subscriptionMiddleware = middleware;
  }
  async handleRequest(request) {
    const result = {};
    await this.subscriptionMiddleware(request, result, noop, noop);
    return result;
  }
  destroy() {
    this.subscriptionMiddleware.destroy();
  }
}
SubscriptionManager$1.SubscriptionManager = SubscriptionManager;
var __importDefault$5 = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(CoinbaseWalletProvider$1, "__esModule", { value: true });
CoinbaseWalletProvider$1.CoinbaseWalletProvider = void 0;
const safe_event_emitter_1 = __importDefault$5(safeEventEmitter$1);
const bn_js_1 = __importDefault$5(bn.exports);
const eth_rpc_errors_1$1 = dist$1;
const DiagnosticLogger_1$2 = DiagnosticLogger;
const Session_1$2 = Session$1;
const WalletSDKRelayAbstract_1$1 = WalletSDKRelayAbstract$1;
const util_1$5 = util$4;
const eth_eip712_util_1 = __importDefault$5(ethEip712Util);
const FilterPolyfill_1 = FilterPolyfill$1;
const JSONRPC_1 = JSONRPC;
const SubscriptionManager_1 = SubscriptionManager$1;
const DEFAULT_CHAIN_ID_KEY = "DefaultChainId";
const DEFAULT_JSON_RPC_URL = "DefaultJsonRpcUrl";
const WHITELISTED_NETWORK_CHAIN_ID = [
  1,
  10,
  137,
  61,
  56,
  250,
  42161,
  100,
  43114,
  3,
  4,
  5,
  42,
  69,
  80001,
  97,
  4002,
  421611,
  43113
];
class CoinbaseWalletProvider extends safe_event_emitter_1.default {
  constructor(options) {
    var _a, _b;
    super();
    this._filterPolyfill = new FilterPolyfill_1.FilterPolyfill(this);
    this._subscriptionManager = new SubscriptionManager_1.SubscriptionManager(this);
    this._relay = null;
    this._addresses = [];
    this.hasMadeFirstChainChangedEmission = false;
    this._send = this.send.bind(this);
    this._sendAsync = this.sendAsync.bind(this);
    this.setProviderInfo = this.setProviderInfo.bind(this);
    this.updateProviderInfo = this.updateProviderInfo.bind(this);
    this.getChainId = this.getChainId.bind(this);
    this.setAppInfo = this.setAppInfo.bind(this);
    this.enable = this.enable.bind(this);
    this.close = this.close.bind(this);
    this.send = this.send.bind(this);
    this.sendAsync = this.sendAsync.bind(this);
    this.request = this.request.bind(this);
    this._setAddresses = this._setAddresses.bind(this);
    this.scanQRCode = this.scanQRCode.bind(this);
    this.genericRequest = this.genericRequest.bind(this);
    this._chainIdFromOpts = options.chainId;
    this._jsonRpcUrlFromOpts = options.jsonRpcUrl;
    this._overrideIsMetaMask = options.overrideIsMetaMask;
    this._relayProvider = options.relayProvider;
    this._storage = options.storage;
    this._relayEventManager = options.relayEventManager;
    this.diagnostic = options.diagnosticLogger;
    this.reloadOnDisconnect = true;
    this.isCoinbaseWallet = (_a = options.overrideIsCoinbaseWallet) !== null && _a !== void 0 ? _a : true;
    this.isCoinbaseBrowser = (_b = options.overrideIsCoinbaseBrowser) !== null && _b !== void 0 ? _b : false;
    this.qrUrl = options.qrUrl;
    this.supportsAddressSwitching = options.supportsAddressSwitching;
    this.isLedger = options.isLedger;
    const chainId = this.getChainId();
    const chainIdStr = (0, util_1$5.prepend0x)(chainId.toString(16));
    this.emit("connect", { chainIdStr });
    const cachedAddresses = this._storage.getItem(WalletSDKRelayAbstract_1$1.LOCAL_STORAGE_ADDRESSES_KEY);
    if (cachedAddresses) {
      const addresses = cachedAddresses.split(" ");
      if (addresses[0] !== "") {
        this._addresses = addresses.map((address) => (0, util_1$5.ensureAddressString)(address));
        this.emit("accountsChanged", addresses);
      }
    }
    this._subscriptionManager.events.on("notification", (notification) => {
      this.emit("message", {
        type: notification.method,
        data: notification.params
      });
    });
    if (this._addresses.length > 0) {
      void this.initializeRelay();
    }
    window.addEventListener("message", (event) => {
      var _a2;
      if (event.data.type !== "walletLinkMessage")
        return;
      if (event.data.data.action === "defaultChainChanged" || event.data.data.action === "dappChainSwitched") {
        const _chainId = event.data.data.chainId;
        const jsonRpcUrl = (_a2 = event.data.data.jsonRpcUrl) !== null && _a2 !== void 0 ? _a2 : this.jsonRpcUrl;
        this.updateProviderInfo(jsonRpcUrl, Number(_chainId));
      }
      if (event.data.data.action === "addressChanged") {
        this._setAddresses([event.data.data.address]);
      }
    });
  }
  get selectedAddress() {
    return this._addresses[0] || void 0;
  }
  get networkVersion() {
    return this.getChainId().toString(10);
  }
  get chainId() {
    return (0, util_1$5.prepend0x)(this.getChainId().toString(16));
  }
  get isWalletLink() {
    return true;
  }
  get isMetaMask() {
    return this._overrideIsMetaMask;
  }
  get host() {
    return this.jsonRpcUrl;
  }
  get connected() {
    return true;
  }
  isConnected() {
    return true;
  }
  get jsonRpcUrl() {
    var _a;
    return (_a = this._storage.getItem(DEFAULT_JSON_RPC_URL)) !== null && _a !== void 0 ? _a : this._jsonRpcUrlFromOpts;
  }
  set jsonRpcUrl(value) {
    this._storage.setItem(DEFAULT_JSON_RPC_URL, value);
  }
  disableReloadOnDisconnect() {
    this.reloadOnDisconnect = false;
  }
  setProviderInfo(jsonRpcUrl, chainId) {
    if (!(this.isLedger || this.isCoinbaseBrowser)) {
      this._chainIdFromOpts = chainId;
      this._jsonRpcUrlFromOpts = jsonRpcUrl;
    }
    this.updateProviderInfo(this._jsonRpcUrlFromOpts, this._chainIdFromOpts);
  }
  updateProviderInfo(jsonRpcUrl, chainId) {
    this.jsonRpcUrl = jsonRpcUrl;
    const originalChainId = this.getChainId();
    this._storage.setItem(DEFAULT_CHAIN_ID_KEY, chainId.toString(10));
    const chainChanged = (0, util_1$5.ensureIntNumber)(chainId) !== originalChainId;
    if (chainChanged || !this.hasMadeFirstChainChangedEmission) {
      this.emit("chainChanged", this.getChainId());
      this.hasMadeFirstChainChangedEmission = true;
    }
  }
  async watchAsset(type, address, symbol, decimals, image, chainId) {
    const relay = await this.initializeRelay();
    const result = await relay.watchAsset(type, address, symbol, decimals, image, chainId === null || chainId === void 0 ? void 0 : chainId.toString()).promise;
    return !!result.result;
  }
  async addEthereumChain(chainId, rpcUrls, blockExplorerUrls, chainName, iconUrls, nativeCurrency) {
    var _a, _b;
    if ((0, util_1$5.ensureIntNumber)(chainId) === this.getChainId()) {
      return false;
    }
    const relay = await this.initializeRelay();
    const isWhitelistedNetworkOrStandalone = relay.inlineAddEthereumChain(chainId.toString());
    if (!this._isAuthorized() && !isWhitelistedNetworkOrStandalone) {
      await relay.requestEthereumAccounts().promise;
    }
    const res = await relay.addEthereumChain(chainId.toString(), rpcUrls, iconUrls, blockExplorerUrls, chainName, nativeCurrency).promise;
    if (((_a = res.result) === null || _a === void 0 ? void 0 : _a.isApproved) === true) {
      this.updateProviderInfo(rpcUrls[0], chainId);
    }
    return ((_b = res.result) === null || _b === void 0 ? void 0 : _b.isApproved) === true;
  }
  async switchEthereumChain(chainId) {
    if (WHITELISTED_NETWORK_CHAIN_ID.includes(chainId)) {
      this.updateProviderInfo(this.jsonRpcUrl, chainId);
    }
    const relay = await this.initializeRelay();
    const res = await relay.switchEthereumChain(chainId.toString(10), this.selectedAddress || void 0).promise;
    if (res.errorCode) {
      throw eth_rpc_errors_1$1.ethErrors.provider.custom({
        code: res.errorCode
      });
    }
    const switchResponse = res.result;
    if (switchResponse.isApproved && switchResponse.rpcUrl.length > 0) {
      this.updateProviderInfo(switchResponse.rpcUrl, chainId);
    }
  }
  setAppInfo(appName, appLogoUrl) {
    void this.initializeRelay().then((relay) => relay.setAppInfo(appName, appLogoUrl));
  }
  async enable() {
    var _a;
    (_a = this.diagnostic) === null || _a === void 0 ? void 0 : _a.log(DiagnosticLogger_1$2.EVENTS.ETH_ACCOUNTS_STATE, {
      method: "provider::enable",
      addresses_length: this._addresses.length,
      sessionIdHash: this._relay ? Session_1$2.Session.hash(this._relay.session.id) : void 0
    });
    if (this._addresses.length > 0) {
      return [...this._addresses];
    }
    return await this._send(JSONRPC_1.JSONRPCMethod.eth_requestAccounts);
  }
  async close() {
    const relay = await this.initializeRelay();
    relay.resetAndReload();
  }
  send(requestOrMethod, callbackOrParams) {
    if (typeof requestOrMethod === "string") {
      const method = requestOrMethod;
      const params = Array.isArray(callbackOrParams) ? callbackOrParams : callbackOrParams !== void 0 ? [callbackOrParams] : [];
      const request = {
        jsonrpc: "2.0",
        id: 0,
        method,
        params
      };
      return this._sendRequestAsync(request).then((res) => res.result);
    }
    if (typeof callbackOrParams === "function") {
      const request = requestOrMethod;
      const callback = callbackOrParams;
      return this._sendAsync(request, callback);
    }
    if (Array.isArray(requestOrMethod)) {
      const requests = requestOrMethod;
      return requests.map((r2) => this._sendRequest(r2));
    }
    const req = requestOrMethod;
    return this._sendRequest(req);
  }
  async sendAsync(request, callback) {
    if (typeof callback !== "function") {
      throw new Error("callback is required");
    }
    if (Array.isArray(request)) {
      const arrayCb = callback;
      this._sendMultipleRequestsAsync(request).then((responses) => arrayCb(null, responses)).catch((err) => arrayCb(err, null));
      return;
    }
    const cb = callback;
    return this._sendRequestAsync(request).then((response) => cb(null, response)).catch((err) => cb(err, null));
  }
  async request(args) {
    if (!args || typeof args !== "object" || Array.isArray(args)) {
      throw eth_rpc_errors_1$1.ethErrors.rpc.invalidRequest({
        message: "Expected a single, non-array, object argument.",
        data: args
      });
    }
    const { method, params } = args;
    if (typeof method !== "string" || method.length === 0) {
      throw eth_rpc_errors_1$1.ethErrors.rpc.invalidRequest({
        message: "'args.method' must be a non-empty string.",
        data: args
      });
    }
    if (params !== void 0 && !Array.isArray(params) && (typeof params !== "object" || params === null)) {
      throw eth_rpc_errors_1$1.ethErrors.rpc.invalidRequest({
        message: "'args.params' must be an object or array if provided.",
        data: args
      });
    }
    const newParams = params === void 0 ? [] : params;
    const id = this._relayEventManager.makeRequestId();
    const result = await this._sendRequestAsync({
      method,
      params: newParams,
      jsonrpc: "2.0",
      id
    });
    return result.result;
  }
  async scanQRCode(match) {
    const relay = await this.initializeRelay();
    const res = await relay.scanQRCode((0, util_1$5.ensureRegExpString)(match)).promise;
    if (typeof res.result !== "string") {
      throw new Error("result was not a string");
    }
    return res.result;
  }
  async genericRequest(data, action) {
    const relay = await this.initializeRelay();
    const res = await relay.genericRequest(data, action).promise;
    if (typeof res.result !== "string") {
      throw new Error("result was not a string");
    }
    return res.result;
  }
  async selectProvider(providerOptions) {
    const relay = await this.initializeRelay();
    const res = await relay.selectProvider(providerOptions).promise;
    if (typeof res.result !== "string") {
      throw new Error("result was not a string");
    }
    return res.result;
  }
  supportsSubscriptions() {
    return false;
  }
  subscribe() {
    throw new Error("Subscriptions are not supported");
  }
  unsubscribe() {
    throw new Error("Subscriptions are not supported");
  }
  disconnect() {
    return true;
  }
  _sendRequest(request) {
    const response = {
      jsonrpc: "2.0",
      id: request.id
    };
    const { method } = request;
    response.result = this._handleSynchronousMethods(request);
    if (response.result === void 0) {
      throw new Error(`Coinbase Wallet does not support calling ${method} synchronously without a callback. Please provide a callback parameter to call ${method} asynchronously.`);
    }
    return response;
  }
  _setAddresses(addresses, isDisconnect) {
    if (!Array.isArray(addresses)) {
      throw new Error("addresses is not an array");
    }
    const newAddresses = addresses.map((address) => (0, util_1$5.ensureAddressString)(address));
    if (JSON.stringify(newAddresses) === JSON.stringify(this._addresses)) {
      return;
    }
    if (this._addresses.length > 0 && this.supportsAddressSwitching === false && !isDisconnect) {
      return;
    }
    this._addresses = newAddresses;
    this.emit("accountsChanged", this._addresses);
    this._storage.setItem(WalletSDKRelayAbstract_1$1.LOCAL_STORAGE_ADDRESSES_KEY, newAddresses.join(" "));
  }
  _sendRequestAsync(request) {
    return new Promise((resolve, reject) => {
      try {
        const syncResult = this._handleSynchronousMethods(request);
        if (syncResult !== void 0) {
          return resolve({
            jsonrpc: "2.0",
            id: request.id,
            result: syncResult
          });
        }
        const filterPromise = this._handleAsynchronousFilterMethods(request);
        if (filterPromise !== void 0) {
          filterPromise.then((res) => resolve(Object.assign(Object.assign({}, res), { id: request.id }))).catch((err) => reject(err));
          return;
        }
        const subscriptionPromise = this._handleSubscriptionMethods(request);
        if (subscriptionPromise !== void 0) {
          subscriptionPromise.then((res) => resolve({
            jsonrpc: "2.0",
            id: request.id,
            result: res.result
          })).catch((err) => reject(err));
          return;
        }
      } catch (err) {
        return reject(err);
      }
      this._handleAsynchronousMethods(request).then((res) => res && resolve(Object.assign(Object.assign({}, res), { id: request.id }))).catch((err) => reject(err));
    });
  }
  _sendMultipleRequestsAsync(requests) {
    return Promise.all(requests.map((r2) => this._sendRequestAsync(r2)));
  }
  _handleSynchronousMethods(request) {
    const { method } = request;
    const params = request.params || [];
    switch (method) {
      case JSONRPC_1.JSONRPCMethod.eth_accounts:
        return this._eth_accounts();
      case JSONRPC_1.JSONRPCMethod.eth_coinbase:
        return this._eth_coinbase();
      case JSONRPC_1.JSONRPCMethod.eth_uninstallFilter:
        return this._eth_uninstallFilter(params);
      case JSONRPC_1.JSONRPCMethod.net_version:
        return this._net_version();
      case JSONRPC_1.JSONRPCMethod.eth_chainId:
        return this._eth_chainId();
      default:
        return void 0;
    }
  }
  async _handleAsynchronousMethods(request) {
    const { method } = request;
    const params = request.params || [];
    switch (method) {
      case JSONRPC_1.JSONRPCMethod.eth_requestAccounts:
        return this._eth_requestAccounts();
      case JSONRPC_1.JSONRPCMethod.eth_sign:
        return this._eth_sign(params);
      case JSONRPC_1.JSONRPCMethod.eth_ecRecover:
        return this._eth_ecRecover(params);
      case JSONRPC_1.JSONRPCMethod.personal_sign:
        return this._personal_sign(params);
      case JSONRPC_1.JSONRPCMethod.personal_ecRecover:
        return this._personal_ecRecover(params);
      case JSONRPC_1.JSONRPCMethod.eth_signTransaction:
        return this._eth_signTransaction(params);
      case JSONRPC_1.JSONRPCMethod.eth_sendRawTransaction:
        return this._eth_sendRawTransaction(params);
      case JSONRPC_1.JSONRPCMethod.eth_sendTransaction:
        return this._eth_sendTransaction(params);
      case JSONRPC_1.JSONRPCMethod.eth_signTypedData_v1:
        return this._eth_signTypedData_v1(params);
      case JSONRPC_1.JSONRPCMethod.eth_signTypedData_v2:
        return this._throwUnsupportedMethodError();
      case JSONRPC_1.JSONRPCMethod.eth_signTypedData_v3:
        return this._eth_signTypedData_v3(params);
      case JSONRPC_1.JSONRPCMethod.eth_signTypedData_v4:
      case JSONRPC_1.JSONRPCMethod.eth_signTypedData:
        return this._eth_signTypedData_v4(params);
      case JSONRPC_1.JSONRPCMethod.cbWallet_arbitrary:
        return this._cbwallet_arbitrary(params);
      case JSONRPC_1.JSONRPCMethod.wallet_addEthereumChain:
        return this._wallet_addEthereumChain(params);
      case JSONRPC_1.JSONRPCMethod.wallet_switchEthereumChain:
        return this._wallet_switchEthereumChain(params);
      case JSONRPC_1.JSONRPCMethod.wallet_watchAsset:
        return this._wallet_watchAsset(params);
    }
    const relay = await this.initializeRelay();
    return relay.makeEthereumJSONRPCRequest(request, this.jsonRpcUrl);
  }
  _handleAsynchronousFilterMethods(request) {
    const { method } = request;
    const params = request.params || [];
    switch (method) {
      case JSONRPC_1.JSONRPCMethod.eth_newFilter:
        return this._eth_newFilter(params);
      case JSONRPC_1.JSONRPCMethod.eth_newBlockFilter:
        return this._eth_newBlockFilter();
      case JSONRPC_1.JSONRPCMethod.eth_newPendingTransactionFilter:
        return this._eth_newPendingTransactionFilter();
      case JSONRPC_1.JSONRPCMethod.eth_getFilterChanges:
        return this._eth_getFilterChanges(params);
      case JSONRPC_1.JSONRPCMethod.eth_getFilterLogs:
        return this._eth_getFilterLogs(params);
    }
    return void 0;
  }
  _handleSubscriptionMethods(request) {
    switch (request.method) {
      case JSONRPC_1.JSONRPCMethod.eth_subscribe:
      case JSONRPC_1.JSONRPCMethod.eth_unsubscribe:
        return this._subscriptionManager.handleRequest(request);
    }
    return void 0;
  }
  _isKnownAddress(addressString) {
    try {
      const addressStr = (0, util_1$5.ensureAddressString)(addressString);
      const lowercaseAddresses = this._addresses.map((address) => (0, util_1$5.ensureAddressString)(address));
      return lowercaseAddresses.includes(addressStr);
    } catch (_a) {
    }
    return false;
  }
  _ensureKnownAddress(addressString) {
    var _a;
    if (!this._isKnownAddress(addressString)) {
      (_a = this.diagnostic) === null || _a === void 0 ? void 0 : _a.log(DiagnosticLogger_1$2.EVENTS.UNKNOWN_ADDRESS_ENCOUNTERED);
      throw new Error("Unknown Ethereum address");
    }
  }
  _prepareTransactionParams(tx) {
    const fromAddress = tx.from ? (0, util_1$5.ensureAddressString)(tx.from) : this.selectedAddress;
    if (!fromAddress) {
      throw new Error("Ethereum address is unavailable");
    }
    this._ensureKnownAddress(fromAddress);
    const toAddress = tx.to ? (0, util_1$5.ensureAddressString)(tx.to) : null;
    const weiValue = tx.value != null ? (0, util_1$5.ensureBN)(tx.value) : new bn_js_1.default(0);
    const data = tx.data ? (0, util_1$5.ensureBuffer)(tx.data) : Buffer.alloc(0);
    const nonce = tx.nonce != null ? (0, util_1$5.ensureIntNumber)(tx.nonce) : null;
    const gasPriceInWei = tx.gasPrice != null ? (0, util_1$5.ensureBN)(tx.gasPrice) : null;
    const maxFeePerGas = tx.maxFeePerGas != null ? (0, util_1$5.ensureBN)(tx.maxFeePerGas) : null;
    const maxPriorityFeePerGas = tx.maxPriorityFeePerGas != null ? (0, util_1$5.ensureBN)(tx.maxPriorityFeePerGas) : null;
    const gasLimit = tx.gas != null ? (0, util_1$5.ensureBN)(tx.gas) : null;
    const chainId = this.getChainId();
    return {
      fromAddress,
      toAddress,
      weiValue,
      data,
      nonce,
      gasPriceInWei,
      maxFeePerGas,
      maxPriorityFeePerGas,
      gasLimit,
      chainId
    };
  }
  _isAuthorized() {
    return this._addresses.length > 0;
  }
  _requireAuthorization() {
    if (!this._isAuthorized()) {
      throw eth_rpc_errors_1$1.ethErrors.provider.unauthorized({});
    }
  }
  _throwUnsupportedMethodError() {
    throw eth_rpc_errors_1$1.ethErrors.provider.unsupportedMethod({});
  }
  async _signEthereumMessage(message, address, addPrefix, typedDataJson) {
    this._ensureKnownAddress(address);
    try {
      const relay = await this.initializeRelay();
      const res = await relay.signEthereumMessage(message, address, addPrefix, typedDataJson).promise;
      return { jsonrpc: "2.0", id: 0, result: res.result };
    } catch (err) {
      if (typeof err.message === "string" && err.message.match(/(denied|rejected)/i)) {
        throw eth_rpc_errors_1$1.ethErrors.provider.userRejectedRequest("User denied message signature");
      }
      throw err;
    }
  }
  async _ethereumAddressFromSignedMessage(message, signature, addPrefix) {
    const relay = await this.initializeRelay();
    const res = await relay.ethereumAddressFromSignedMessage(message, signature, addPrefix).promise;
    return { jsonrpc: "2.0", id: 0, result: res.result };
  }
  _eth_accounts() {
    return [...this._addresses];
  }
  _eth_coinbase() {
    return this.selectedAddress || null;
  }
  _net_version() {
    return this.getChainId().toString(10);
  }
  _eth_chainId() {
    return (0, util_1$5.hexStringFromIntNumber)(this.getChainId());
  }
  getChainId() {
    const chainIdStr = this._storage.getItem(DEFAULT_CHAIN_ID_KEY);
    if (!chainIdStr) {
      return (0, util_1$5.ensureIntNumber)(this._chainIdFromOpts);
    }
    const chainId = parseInt(chainIdStr, 10);
    return (0, util_1$5.ensureIntNumber)(chainId);
  }
  async _eth_requestAccounts() {
    var _a;
    (_a = this.diagnostic) === null || _a === void 0 ? void 0 : _a.log(DiagnosticLogger_1$2.EVENTS.ETH_ACCOUNTS_STATE, {
      method: "provider::_eth_requestAccounts",
      addresses_length: this._addresses.length,
      sessionIdHash: this._relay ? Session_1$2.Session.hash(this._relay.session.id) : void 0
    });
    if (this._addresses.length > 0) {
      return Promise.resolve({
        jsonrpc: "2.0",
        id: 0,
        result: this._addresses
      });
    }
    let res;
    try {
      const relay = await this.initializeRelay();
      res = await relay.requestEthereumAccounts().promise;
    } catch (err) {
      if (typeof err.message === "string" && err.message.match(/(denied|rejected)/i)) {
        throw eth_rpc_errors_1$1.ethErrors.provider.userRejectedRequest("User denied account authorization");
      }
      throw err;
    }
    if (!res.result) {
      throw new Error("accounts received is empty");
    }
    this._setAddresses(res.result);
    if (!(this.isLedger || this.isCoinbaseBrowser)) {
      await this.switchEthereumChain(this.getChainId());
    }
    return { jsonrpc: "2.0", id: 0, result: this._addresses };
  }
  _eth_sign(params) {
    this._requireAuthorization();
    const address = (0, util_1$5.ensureAddressString)(params[0]);
    const message = (0, util_1$5.ensureBuffer)(params[1]);
    return this._signEthereumMessage(message, address, false);
  }
  _eth_ecRecover(params) {
    const message = (0, util_1$5.ensureBuffer)(params[0]);
    const signature = (0, util_1$5.ensureBuffer)(params[1]);
    return this._ethereumAddressFromSignedMessage(message, signature, false);
  }
  _personal_sign(params) {
    this._requireAuthorization();
    const message = (0, util_1$5.ensureBuffer)(params[0]);
    const address = (0, util_1$5.ensureAddressString)(params[1]);
    return this._signEthereumMessage(message, address, true);
  }
  _personal_ecRecover(params) {
    const message = (0, util_1$5.ensureBuffer)(params[0]);
    const signature = (0, util_1$5.ensureBuffer)(params[1]);
    return this._ethereumAddressFromSignedMessage(message, signature, true);
  }
  async _eth_signTransaction(params) {
    this._requireAuthorization();
    const tx = this._prepareTransactionParams(params[0] || {});
    try {
      const relay = await this.initializeRelay();
      const res = await relay.signEthereumTransaction(tx).promise;
      return { jsonrpc: "2.0", id: 0, result: res.result };
    } catch (err) {
      if (typeof err.message === "string" && err.message.match(/(denied|rejected)/i)) {
        throw eth_rpc_errors_1$1.ethErrors.provider.userRejectedRequest("User denied transaction signature");
      }
      throw err;
    }
  }
  async _eth_sendRawTransaction(params) {
    const signedTransaction = (0, util_1$5.ensureBuffer)(params[0]);
    const relay = await this.initializeRelay();
    const res = await relay.submitEthereumTransaction(signedTransaction, this.getChainId()).promise;
    return { jsonrpc: "2.0", id: 0, result: res.result };
  }
  async _eth_sendTransaction(params) {
    this._requireAuthorization();
    const tx = this._prepareTransactionParams(params[0] || {});
    try {
      const relay = await this.initializeRelay();
      const res = await relay.signAndSubmitEthereumTransaction(tx).promise;
      return { jsonrpc: "2.0", id: 0, result: res.result };
    } catch (err) {
      if (typeof err.message === "string" && err.message.match(/(denied|rejected)/i)) {
        throw eth_rpc_errors_1$1.ethErrors.provider.userRejectedRequest("User denied transaction signature");
      }
      throw err;
    }
  }
  async _eth_signTypedData_v1(params) {
    this._requireAuthorization();
    const typedData = (0, util_1$5.ensureParsedJSONObject)(params[0]);
    const address = (0, util_1$5.ensureAddressString)(params[1]);
    this._ensureKnownAddress(address);
    const message = eth_eip712_util_1.default.hashForSignTypedDataLegacy({ data: typedData });
    const typedDataJSON = JSON.stringify(typedData, null, 2);
    return this._signEthereumMessage(message, address, false, typedDataJSON);
  }
  async _eth_signTypedData_v3(params) {
    this._requireAuthorization();
    const address = (0, util_1$5.ensureAddressString)(params[0]);
    const typedData = (0, util_1$5.ensureParsedJSONObject)(params[1]);
    this._ensureKnownAddress(address);
    const message = eth_eip712_util_1.default.hashForSignTypedData_v3({ data: typedData });
    const typedDataJSON = JSON.stringify(typedData, null, 2);
    return this._signEthereumMessage(message, address, false, typedDataJSON);
  }
  async _eth_signTypedData_v4(params) {
    this._requireAuthorization();
    const address = (0, util_1$5.ensureAddressString)(params[0]);
    const typedData = (0, util_1$5.ensureParsedJSONObject)(params[1]);
    this._ensureKnownAddress(address);
    const message = eth_eip712_util_1.default.hashForSignTypedData_v4({ data: typedData });
    const typedDataJSON = JSON.stringify(typedData, null, 2);
    return this._signEthereumMessage(message, address, false, typedDataJSON);
  }
  async _cbwallet_arbitrary(params) {
    const action = params[0];
    const data = params[1];
    if (typeof data !== "string") {
      throw new Error("parameter must be a string");
    }
    if (typeof action !== "object" || action === null) {
      throw new Error("parameter must be an object");
    }
    const result = await this.genericRequest(action, data);
    return { jsonrpc: "2.0", id: 0, result };
  }
  async _wallet_addEthereumChain(params) {
    var _a, _b, _c, _d;
    const request = params[0];
    if (((_a = request.rpcUrls) === null || _a === void 0 ? void 0 : _a.length) === 0) {
      return {
        jsonrpc: "2.0",
        id: 0,
        error: { code: 2, message: `please pass in at least 1 rpcUrl` }
      };
    }
    if (!request.chainName || request.chainName.trim() === "") {
      throw eth_rpc_errors_1$1.ethErrors.provider.custom({
        code: 0,
        message: "chainName is a required field"
      });
    }
    if (!request.nativeCurrency) {
      throw eth_rpc_errors_1$1.ethErrors.provider.custom({
        code: 0,
        message: "nativeCurrency is a required field"
      });
    }
    const chainIdNumber = parseInt(request.chainId, 16);
    const success = await this.addEthereumChain(chainIdNumber, (_b = request.rpcUrls) !== null && _b !== void 0 ? _b : [], (_c = request.blockExplorerUrls) !== null && _c !== void 0 ? _c : [], request.chainName, (_d = request.iconUrls) !== null && _d !== void 0 ? _d : [], request.nativeCurrency);
    if (success) {
      return { jsonrpc: "2.0", id: 0, result: null };
    } else {
      return {
        jsonrpc: "2.0",
        id: 0,
        error: { code: 2, message: `unable to add ethereum chain` }
      };
    }
  }
  async _wallet_switchEthereumChain(params) {
    const request = params[0];
    await this.switchEthereumChain(parseInt(request.chainId, 16));
    return { jsonrpc: "2.0", id: 0, result: null };
  }
  async _wallet_watchAsset(params) {
    const request = Array.isArray(params) ? params[0] : params;
    if (!request.type) {
      throw eth_rpc_errors_1$1.ethErrors.rpc.invalidParams({
        message: "Type is required"
      });
    }
    if ((request === null || request === void 0 ? void 0 : request.type) !== "ERC20") {
      throw eth_rpc_errors_1$1.ethErrors.rpc.invalidParams({
        message: `Asset of type '${request.type}' is not supported`
      });
    }
    if (!(request === null || request === void 0 ? void 0 : request.options)) {
      throw eth_rpc_errors_1$1.ethErrors.rpc.invalidParams({
        message: "Options are required"
      });
    }
    if (!(request === null || request === void 0 ? void 0 : request.options.address)) {
      throw eth_rpc_errors_1$1.ethErrors.rpc.invalidParams({
        message: "Address is required"
      });
    }
    const chainId = this.getChainId();
    const { address, symbol, image, decimals } = request.options;
    const res = await this.watchAsset(request.type, address, symbol, decimals, image, chainId);
    return { jsonrpc: "2.0", id: 0, result: res };
  }
  _eth_uninstallFilter(params) {
    const filterId = (0, util_1$5.ensureHexString)(params[0]);
    return this._filterPolyfill.uninstallFilter(filterId);
  }
  async _eth_newFilter(params) {
    const param = params[0];
    const filterId = await this._filterPolyfill.newFilter(param);
    return { jsonrpc: "2.0", id: 0, result: filterId };
  }
  async _eth_newBlockFilter() {
    const filterId = await this._filterPolyfill.newBlockFilter();
    return { jsonrpc: "2.0", id: 0, result: filterId };
  }
  async _eth_newPendingTransactionFilter() {
    const filterId = await this._filterPolyfill.newPendingTransactionFilter();
    return { jsonrpc: "2.0", id: 0, result: filterId };
  }
  _eth_getFilterChanges(params) {
    const filterId = (0, util_1$5.ensureHexString)(params[0]);
    return this._filterPolyfill.getFilterChanges(filterId);
  }
  _eth_getFilterLogs(params) {
    const filterId = (0, util_1$5.ensureHexString)(params[0]);
    return this._filterPolyfill.getFilterLogs(filterId);
  }
  initializeRelay() {
    if (this._relay) {
      return Promise.resolve(this._relay);
    }
    return this._relayProvider().then((relay) => {
      relay.setAccountsCallback((accounts, isDisconnect) => this._setAddresses(accounts, isDisconnect));
      relay.setChainCallback((chainId, jsonRpcUrl) => {
        this.updateProviderInfo(jsonRpcUrl, parseInt(chainId, 10));
      });
      relay.setDappDefaultChainCallback(this._chainIdFromOpts);
      this._relay = relay;
      return relay;
    });
  }
}
CoinbaseWalletProvider$1.CoinbaseWalletProvider = CoinbaseWalletProvider;
var WalletSDKUI$1 = {};
var LinkFlow$1 = {};
var n, l$1, u$1, i$2, t, o$1, r$2, f$1 = {}, e$1 = [], c$1 = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
function s$1(n2, l2) {
  for (var u2 in l2)
    n2[u2] = l2[u2];
  return n2;
}
function a$1(n2) {
  var l2 = n2.parentNode;
  l2 && l2.removeChild(n2);
}
function h$1(l2, u2, i) {
  var t2, o2, r2, f2 = {};
  for (r2 in u2)
    "key" == r2 ? t2 = u2[r2] : "ref" == r2 ? o2 = u2[r2] : f2[r2] = u2[r2];
  if (arguments.length > 2 && (f2.children = arguments.length > 3 ? n.call(arguments, 2) : i), "function" == typeof l2 && null != l2.defaultProps)
    for (r2 in l2.defaultProps)
      void 0 === f2[r2] && (f2[r2] = l2.defaultProps[r2]);
  return v$1(l2, f2, t2, o2, null);
}
function v$1(n2, i, t2, o2, r2) {
  var f2 = { type: n2, props: i, key: t2, ref: o2, __k: null, __: null, __b: 0, __e: null, __d: void 0, __c: null, __h: null, constructor: void 0, __v: null == r2 ? ++u$1 : r2 };
  return null == r2 && null != l$1.vnode && l$1.vnode(f2), f2;
}
function y$1() {
  return { current: null };
}
function p$1(n2) {
  return n2.children;
}
function d$1(n2, l2) {
  this.props = n2, this.context = l2;
}
function _$1(n2, l2) {
  if (null == l2)
    return n2.__ ? _$1(n2.__, n2.__.__k.indexOf(n2) + 1) : null;
  for (var u2; l2 < n2.__k.length; l2++)
    if (null != (u2 = n2.__k[l2]) && null != u2.__e)
      return u2.__e;
  return "function" == typeof n2.type ? _$1(n2) : null;
}
function k$1(n2) {
  var l2, u2;
  if (null != (n2 = n2.__) && null != n2.__c) {
    for (n2.__e = n2.__c.base = null, l2 = 0; l2 < n2.__k.length; l2++)
      if (null != (u2 = n2.__k[l2]) && null != u2.__e) {
        n2.__e = n2.__c.base = u2.__e;
        break;
      }
    return k$1(n2);
  }
}
function b$1(n2) {
  (!n2.__d && (n2.__d = true) && t.push(n2) && !g$1.__r++ || o$1 !== l$1.debounceRendering) && ((o$1 = l$1.debounceRendering) || setTimeout)(g$1);
}
function g$1() {
  for (var n2; g$1.__r = t.length; )
    n2 = t.sort(function(n3, l2) {
      return n3.__v.__b - l2.__v.__b;
    }), t = [], n2.some(function(n3) {
      var l2, u2, i, t2, o2, r2;
      n3.__d && (o2 = (t2 = (l2 = n3).__v).__e, (r2 = l2.__P) && (u2 = [], (i = s$1({}, t2)).__v = t2.__v + 1, j$1(r2, t2, i, l2.__n, void 0 !== r2.ownerSVGElement, null != t2.__h ? [o2] : null, u2, null == o2 ? _$1(t2) : o2, t2.__h), z$1(u2, t2), t2.__e != o2 && k$1(t2)));
    });
}
function w$1(n2, l2, u2, i, t2, o2, r2, c2, s2, a2) {
  var h2, y2, d2, k2, b2, g2, w2, x2 = i && i.__k || e$1, C2 = x2.length;
  for (u2.__k = [], h2 = 0; h2 < l2.length; h2++)
    if (null != (k2 = u2.__k[h2] = null == (k2 = l2[h2]) || "boolean" == typeof k2 ? null : "string" == typeof k2 || "number" == typeof k2 || "bigint" == typeof k2 ? v$1(null, k2, null, null, k2) : Array.isArray(k2) ? v$1(p$1, { children: k2 }, null, null, null) : k2.__b > 0 ? v$1(k2.type, k2.props, k2.key, k2.ref ? k2.ref : null, k2.__v) : k2)) {
      if (k2.__ = u2, k2.__b = u2.__b + 1, null === (d2 = x2[h2]) || d2 && k2.key == d2.key && k2.type === d2.type)
        x2[h2] = void 0;
      else
        for (y2 = 0; y2 < C2; y2++) {
          if ((d2 = x2[y2]) && k2.key == d2.key && k2.type === d2.type) {
            x2[y2] = void 0;
            break;
          }
          d2 = null;
        }
      j$1(n2, k2, d2 = d2 || f$1, t2, o2, r2, c2, s2, a2), b2 = k2.__e, (y2 = k2.ref) && d2.ref != y2 && (w2 || (w2 = []), d2.ref && w2.push(d2.ref, null, k2), w2.push(y2, k2.__c || b2, k2)), null != b2 ? (null == g2 && (g2 = b2), "function" == typeof k2.type && k2.__k === d2.__k ? k2.__d = s2 = m$1(k2, s2, n2) : s2 = A$1(n2, k2, d2, x2, b2, s2), "function" == typeof u2.type && (u2.__d = s2)) : s2 && d2.__e == s2 && s2.parentNode != n2 && (s2 = _$1(d2));
    }
  for (u2.__e = g2, h2 = C2; h2--; )
    null != x2[h2] && ("function" == typeof u2.type && null != x2[h2].__e && x2[h2].__e == u2.__d && (u2.__d = _$1(i, h2 + 1)), N(x2[h2], x2[h2]));
  if (w2)
    for (h2 = 0; h2 < w2.length; h2++)
      M(w2[h2], w2[++h2], w2[++h2]);
}
function m$1(n2, l2, u2) {
  for (var i, t2 = n2.__k, o2 = 0; t2 && o2 < t2.length; o2++)
    (i = t2[o2]) && (i.__ = n2, l2 = "function" == typeof i.type ? m$1(i, l2, u2) : A$1(u2, i, i, t2, i.__e, l2));
  return l2;
}
function x$1(n2, l2) {
  return l2 = l2 || [], null == n2 || "boolean" == typeof n2 || (Array.isArray(n2) ? n2.some(function(n3) {
    x$1(n3, l2);
  }) : l2.push(n2)), l2;
}
function A$1(n2, l2, u2, i, t2, o2) {
  var r2, f2, e2;
  if (void 0 !== l2.__d)
    r2 = l2.__d, l2.__d = void 0;
  else if (null == u2 || t2 != o2 || null == t2.parentNode)
    n:
      if (null == o2 || o2.parentNode !== n2)
        n2.appendChild(t2), r2 = null;
      else {
        for (f2 = o2, e2 = 0; (f2 = f2.nextSibling) && e2 < i.length; e2 += 2)
          if (f2 == t2)
            break n;
        n2.insertBefore(t2, o2), r2 = o2;
      }
  return void 0 !== r2 ? r2 : t2.nextSibling;
}
function C$1(n2, l2, u2, i, t2) {
  var o2;
  for (o2 in u2)
    "children" === o2 || "key" === o2 || o2 in l2 || H(n2, o2, null, u2[o2], i);
  for (o2 in l2)
    t2 && "function" != typeof l2[o2] || "children" === o2 || "key" === o2 || "value" === o2 || "checked" === o2 || u2[o2] === l2[o2] || H(n2, o2, l2[o2], u2[o2], i);
}
function $(n2, l2, u2) {
  "-" === l2[0] ? n2.setProperty(l2, u2) : n2[l2] = null == u2 ? "" : "number" != typeof u2 || c$1.test(l2) ? u2 : u2 + "px";
}
function H(n2, l2, u2, i, t2) {
  var o2;
  n:
    if ("style" === l2)
      if ("string" == typeof u2)
        n2.style.cssText = u2;
      else {
        if ("string" == typeof i && (n2.style.cssText = i = ""), i)
          for (l2 in i)
            u2 && l2 in u2 || $(n2.style, l2, "");
        if (u2)
          for (l2 in u2)
            i && u2[l2] === i[l2] || $(n2.style, l2, u2[l2]);
      }
    else if ("o" === l2[0] && "n" === l2[1])
      o2 = l2 !== (l2 = l2.replace(/Capture$/, "")), l2 = l2.toLowerCase() in n2 ? l2.toLowerCase().slice(2) : l2.slice(2), n2.l || (n2.l = {}), n2.l[l2 + o2] = u2, u2 ? i || n2.addEventListener(l2, o2 ? T$1 : I, o2) : n2.removeEventListener(l2, o2 ? T$1 : I, o2);
    else if ("dangerouslySetInnerHTML" !== l2) {
      if (t2)
        l2 = l2.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
      else if ("href" !== l2 && "list" !== l2 && "form" !== l2 && "tabIndex" !== l2 && "download" !== l2 && l2 in n2)
        try {
          n2[l2] = null == u2 ? "" : u2;
          break n;
        } catch (n3) {
        }
      "function" == typeof u2 || (null != u2 && (false !== u2 || "a" === l2[0] && "r" === l2[1]) ? n2.setAttribute(l2, u2) : n2.removeAttribute(l2));
    }
}
function I(n2) {
  this.l[n2.type + false](l$1.event ? l$1.event(n2) : n2);
}
function T$1(n2) {
  this.l[n2.type + true](l$1.event ? l$1.event(n2) : n2);
}
function j$1(n2, u2, i, t2, o2, r2, f2, e2, c2) {
  var a2, h2, v2, y2, _2, k2, b2, g2, m2, x2, A2, C2, $2, H2 = u2.type;
  if (void 0 !== u2.constructor)
    return null;
  null != i.__h && (c2 = i.__h, e2 = u2.__e = i.__e, u2.__h = null, r2 = [e2]), (a2 = l$1.__b) && a2(u2);
  try {
    n:
      if ("function" == typeof H2) {
        if (g2 = u2.props, m2 = (a2 = H2.contextType) && t2[a2.__c], x2 = a2 ? m2 ? m2.props.value : a2.__ : t2, i.__c ? b2 = (h2 = u2.__c = i.__c).__ = h2.__E : ("prototype" in H2 && H2.prototype.render ? u2.__c = h2 = new H2(g2, x2) : (u2.__c = h2 = new d$1(g2, x2), h2.constructor = H2, h2.render = O), m2 && m2.sub(h2), h2.props = g2, h2.state || (h2.state = {}), h2.context = x2, h2.__n = t2, v2 = h2.__d = true, h2.__h = []), null == h2.__s && (h2.__s = h2.state), null != H2.getDerivedStateFromProps && (h2.__s == h2.state && (h2.__s = s$1({}, h2.__s)), s$1(h2.__s, H2.getDerivedStateFromProps(g2, h2.__s))), y2 = h2.props, _2 = h2.state, v2)
          null == H2.getDerivedStateFromProps && null != h2.componentWillMount && h2.componentWillMount(), null != h2.componentDidMount && h2.__h.push(h2.componentDidMount);
        else {
          if (null == H2.getDerivedStateFromProps && g2 !== y2 && null != h2.componentWillReceiveProps && h2.componentWillReceiveProps(g2, x2), !h2.__e && null != h2.shouldComponentUpdate && false === h2.shouldComponentUpdate(g2, h2.__s, x2) || u2.__v === i.__v) {
            h2.props = g2, h2.state = h2.__s, u2.__v !== i.__v && (h2.__d = false), h2.__v = u2, u2.__e = i.__e, u2.__k = i.__k, u2.__k.forEach(function(n3) {
              n3 && (n3.__ = u2);
            }), h2.__h.length && f2.push(h2);
            break n;
          }
          null != h2.componentWillUpdate && h2.componentWillUpdate(g2, h2.__s, x2), null != h2.componentDidUpdate && h2.__h.push(function() {
            h2.componentDidUpdate(y2, _2, k2);
          });
        }
        if (h2.context = x2, h2.props = g2, h2.__v = u2, h2.__P = n2, A2 = l$1.__r, C2 = 0, "prototype" in H2 && H2.prototype.render)
          h2.state = h2.__s, h2.__d = false, A2 && A2(u2), a2 = h2.render(h2.props, h2.state, h2.context);
        else
          do {
            h2.__d = false, A2 && A2(u2), a2 = h2.render(h2.props, h2.state, h2.context), h2.state = h2.__s;
          } while (h2.__d && ++C2 < 25);
        h2.state = h2.__s, null != h2.getChildContext && (t2 = s$1(s$1({}, t2), h2.getChildContext())), v2 || null == h2.getSnapshotBeforeUpdate || (k2 = h2.getSnapshotBeforeUpdate(y2, _2)), $2 = null != a2 && a2.type === p$1 && null == a2.key ? a2.props.children : a2, w$1(n2, Array.isArray($2) ? $2 : [$2], u2, i, t2, o2, r2, f2, e2, c2), h2.base = u2.__e, u2.__h = null, h2.__h.length && f2.push(h2), b2 && (h2.__E = h2.__ = null), h2.__e = false;
      } else
        null == r2 && u2.__v === i.__v ? (u2.__k = i.__k, u2.__e = i.__e) : u2.__e = L(i.__e, u2, i, t2, o2, r2, f2, c2);
    (a2 = l$1.diffed) && a2(u2);
  } catch (n3) {
    u2.__v = null, (c2 || null != r2) && (u2.__e = e2, u2.__h = !!c2, r2[r2.indexOf(e2)] = null), l$1.__e(n3, u2, i);
  }
}
function z$1(n2, u2) {
  l$1.__c && l$1.__c(u2, n2), n2.some(function(u3) {
    try {
      n2 = u3.__h, u3.__h = [], n2.some(function(n3) {
        n3.call(u3);
      });
    } catch (n3) {
      l$1.__e(n3, u3.__v);
    }
  });
}
function L(l2, u2, i, t2, o2, r2, e2, c2) {
  var s2, h2, v2, y2 = i.props, p2 = u2.props, d2 = u2.type, k2 = 0;
  if ("svg" === d2 && (o2 = true), null != r2) {
    for (; k2 < r2.length; k2++)
      if ((s2 = r2[k2]) && "setAttribute" in s2 == !!d2 && (d2 ? s2.localName === d2 : 3 === s2.nodeType)) {
        l2 = s2, r2[k2] = null;
        break;
      }
  }
  if (null == l2) {
    if (null === d2)
      return document.createTextNode(p2);
    l2 = o2 ? document.createElementNS("http://www.w3.org/2000/svg", d2) : document.createElement(d2, p2.is && p2), r2 = null, c2 = false;
  }
  if (null === d2)
    y2 === p2 || c2 && l2.data === p2 || (l2.data = p2);
  else {
    if (r2 = r2 && n.call(l2.childNodes), h2 = (y2 = i.props || f$1).dangerouslySetInnerHTML, v2 = p2.dangerouslySetInnerHTML, !c2) {
      if (null != r2)
        for (y2 = {}, k2 = 0; k2 < l2.attributes.length; k2++)
          y2[l2.attributes[k2].name] = l2.attributes[k2].value;
      (v2 || h2) && (v2 && (h2 && v2.__html == h2.__html || v2.__html === l2.innerHTML) || (l2.innerHTML = v2 && v2.__html || ""));
    }
    if (C$1(l2, p2, y2, o2, c2), v2)
      u2.__k = [];
    else if (k2 = u2.props.children, w$1(l2, Array.isArray(k2) ? k2 : [k2], u2, i, t2, o2 && "foreignObject" !== d2, r2, e2, r2 ? r2[0] : i.__k && _$1(i, 0), c2), null != r2)
      for (k2 = r2.length; k2--; )
        null != r2[k2] && a$1(r2[k2]);
    c2 || ("value" in p2 && void 0 !== (k2 = p2.value) && (k2 !== l2.value || "progress" === d2 && !k2 || "option" === d2 && k2 !== y2.value) && H(l2, "value", k2, y2.value, false), "checked" in p2 && void 0 !== (k2 = p2.checked) && k2 !== l2.checked && H(l2, "checked", k2, y2.checked, false));
  }
  return l2;
}
function M(n2, u2, i) {
  try {
    "function" == typeof n2 ? n2(u2) : n2.current = u2;
  } catch (n3) {
    l$1.__e(n3, i);
  }
}
function N(n2, u2, i) {
  var t2, o2;
  if (l$1.unmount && l$1.unmount(n2), (t2 = n2.ref) && (t2.current && t2.current !== n2.__e || M(t2, null, u2)), null != (t2 = n2.__c)) {
    if (t2.componentWillUnmount)
      try {
        t2.componentWillUnmount();
      } catch (n3) {
        l$1.__e(n3, u2);
      }
    t2.base = t2.__P = null, n2.__c = void 0;
  }
  if (t2 = n2.__k)
    for (o2 = 0; o2 < t2.length; o2++)
      t2[o2] && N(t2[o2], u2, "function" != typeof n2.type);
  i || null == n2.__e || a$1(n2.__e), n2.__ = n2.__e = n2.__d = void 0;
}
function O(n2, l2, u2) {
  return this.constructor(n2, u2);
}
function P$1(u2, i, t2) {
  var o2, r2, e2;
  l$1.__ && l$1.__(u2, i), r2 = (o2 = "function" == typeof t2) ? null : t2 && t2.__k || i.__k, e2 = [], j$1(i, u2 = (!o2 && t2 || i).__k = h$1(p$1, null, [u2]), r2 || f$1, f$1, void 0 !== i.ownerSVGElement, !o2 && t2 ? [t2] : r2 ? null : i.firstChild ? n.call(i.childNodes) : null, e2, !o2 && t2 ? t2 : r2 ? r2.__e : i.firstChild, o2), z$1(e2, u2);
}
function S(n2, l2) {
  P$1(n2, l2, S);
}
function q$1(l2, u2, i) {
  var t2, o2, r2, f2 = s$1({}, l2.props);
  for (r2 in u2)
    "key" == r2 ? t2 = u2[r2] : "ref" == r2 ? o2 = u2[r2] : f2[r2] = u2[r2];
  return arguments.length > 2 && (f2.children = arguments.length > 3 ? n.call(arguments, 2) : i), v$1(l2.type, f2, t2 || l2.key, o2 || l2.ref, null);
}
function B$1(n2, l2) {
  var u2 = { __c: l2 = "__cC" + r$2++, __: n2, Consumer: function(n3, l3) {
    return n3.children(l3);
  }, Provider: function(n3) {
    var u3, i;
    return this.getChildContext || (u3 = [], (i = {})[l2] = this, this.getChildContext = function() {
      return i;
    }, this.shouldComponentUpdate = function(n4) {
      this.props.value !== n4.value && u3.some(b$1);
    }, this.sub = function(n4) {
      u3.push(n4);
      var l3 = n4.componentWillUnmount;
      n4.componentWillUnmount = function() {
        u3.splice(u3.indexOf(n4), 1), l3 && l3.call(n4);
      };
    }), n3.children;
  } };
  return u2.Provider.__ = u2.Consumer.contextType = u2;
}
n = e$1.slice, l$1 = { __e: function(n2, l2, u2, i) {
  for (var t2, o2, r2; l2 = l2.__; )
    if ((t2 = l2.__c) && !t2.__)
      try {
        if ((o2 = t2.constructor) && null != o2.getDerivedStateFromError && (t2.setState(o2.getDerivedStateFromError(n2)), r2 = t2.__d), null != t2.componentDidCatch && (t2.componentDidCatch(n2, i || {}), r2 = t2.__d), r2)
          return t2.__E = t2;
      } catch (l3) {
        n2 = l3;
      }
  throw n2;
} }, u$1 = 0, i$2 = function(n2) {
  return null != n2 && void 0 === n2.constructor;
}, d$1.prototype.setState = function(n2, l2) {
  var u2;
  u2 = null != this.__s && this.__s !== this.state ? this.__s : this.__s = s$1({}, this.state), "function" == typeof n2 && (n2 = n2(s$1({}, u2), this.props)), n2 && s$1(u2, n2), null != n2 && this.__v && (l2 && this.__h.push(l2), b$1(this));
}, d$1.prototype.forceUpdate = function(n2) {
  this.__v && (this.__e = true, n2 && this.__h.push(n2), b$1(this));
}, d$1.prototype.render = p$1, t = [], g$1.__r = 0, r$2 = 0;
var preact_module = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Component: d$1,
  Fragment: p$1,
  cloneElement: q$1,
  createContext: B$1,
  createElement: h$1,
  createRef: y$1,
  h: h$1,
  hydrate: S,
  get isValidElement() {
    return i$2;
  },
  get options() {
    return l$1;
  },
  render: P$1,
  toChildArray: x$1
}, Symbol.toStringTag, { value: "Module" }));
var require$$1 = /* @__PURE__ */ getAugmentedNamespace(preact_module);
var TryExtensionLinkDialog$1 = {};
function r$1(e2) {
  var t2, f2, n2 = "";
  if ("string" == typeof e2 || "number" == typeof e2)
    n2 += e2;
  else if ("object" == typeof e2)
    if (Array.isArray(e2))
      for (t2 = 0; t2 < e2.length; t2++)
        e2[t2] && (f2 = r$1(e2[t2])) && (n2 && (n2 += " "), n2 += f2);
    else
      for (t2 in e2)
        e2[t2] && (n2 && (n2 += " "), n2 += t2);
  return n2;
}
function clsx() {
  for (var e2, t2, f2 = 0, n2 = ""; f2 < arguments.length; )
    (e2 = arguments[f2++]) && (t2 = r$1(e2)) && (n2 && (n2 += " "), n2 += t2);
  return n2;
}
var clsx_m = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  clsx,
  "default": clsx
}, Symbol.toStringTag, { value: "Module" }));
var require$$0 = /* @__PURE__ */ getAugmentedNamespace(clsx_m);
var r, u, i$1, o, f = 0, c = [], e = [], a = l$1.__b, v = l$1.__r, l = l$1.diffed, m = l$1.__c, d = l$1.unmount;
function p(t2, r2) {
  l$1.__h && l$1.__h(u, t2, f || r2), f = 0;
  var i = u.__H || (u.__H = { __: [], __h: [] });
  return t2 >= i.__.length && i.__.push({ __V: e }), i.__[t2];
}
function y(n2) {
  return f = 1, h(C, n2);
}
function h(n2, t2, i) {
  var o2 = p(r++, 2);
  if (o2.t = n2, !o2.__c && (o2.__ = [i ? i(t2) : C(void 0, t2), function(n3) {
    var t3 = o2.__N ? o2.__N[0] : o2.__[0], r2 = o2.t(t3, n3);
    t3 !== r2 && (o2.__N = [r2, o2.__[1]], o2.__c.setState({}));
  }], o2.__c = u, !u.u)) {
    u.u = true;
    var f2 = u.shouldComponentUpdate;
    u.shouldComponentUpdate = function(n3, t3, r2) {
      if (!o2.__c.__H)
        return true;
      var u2 = o2.__c.__H.__.filter(function(n4) {
        return n4.__c;
      });
      if (u2.every(function(n4) {
        return !n4.__N;
      }))
        return !f2 || f2.call(this, n3, t3, r2);
      var i2 = false;
      return u2.forEach(function(n4) {
        if (n4.__N) {
          var t4 = n4.__[0];
          n4.__ = n4.__N, n4.__N = void 0, t4 !== n4.__[0] && (i2 = true);
        }
      }), !!i2 && (!f2 || f2.call(this, n3, t3, r2));
    };
  }
  return o2.__N || o2.__;
}
function s(t2, i) {
  var o2 = p(r++, 3);
  !l$1.__s && B(o2.__H, i) && (o2.__ = t2, o2.i = i, u.__H.__h.push(o2));
}
function _(t2, i) {
  var o2 = p(r++, 4);
  !l$1.__s && B(o2.__H, i) && (o2.__ = t2, o2.i = i, u.__h.push(o2));
}
function A(n2) {
  return f = 5, T(function() {
    return { current: n2 };
  }, []);
}
function F(n2, t2, r2) {
  f = 6, _(function() {
    return "function" == typeof n2 ? (n2(t2()), function() {
      return n2(null);
    }) : n2 ? (n2.current = t2(), function() {
      return n2.current = null;
    }) : void 0;
  }, null == r2 ? r2 : r2.concat(n2));
}
function T(n2, t2) {
  var u2 = p(r++, 7);
  return B(u2.__H, t2) ? (u2.__V = n2(), u2.i = t2, u2.__h = n2, u2.__V) : u2.__;
}
function q(n2, t2) {
  return f = 8, T(function() {
    return n2;
  }, t2);
}
function x(n2) {
  var t2 = u.context[n2.__c], i = p(r++, 9);
  return i.c = n2, t2 ? (null == i.__ && (i.__ = true, t2.sub(u)), t2.props.value) : n2.__;
}
function P(t2, r2) {
  l$1.useDebugValue && l$1.useDebugValue(r2 ? r2(t2) : t2);
}
function V(n2) {
  var t2 = p(r++, 10), i = y();
  return t2.__ = n2, u.componentDidCatch || (u.componentDidCatch = function(n3, r2) {
    t2.__ && t2.__(n3, r2), i[1](n3);
  }), [i[0], function() {
    i[1](void 0);
  }];
}
function b() {
  var n2 = p(r++, 11);
  return n2.__ || (n2.__ = "P" + function(n3) {
    for (var t2 = 0, r2 = n3.length; r2 > 0; )
      t2 = (t2 << 5) - t2 + n3.charCodeAt(--r2) | 0;
    return t2;
  }(u.__v.o) + r), n2.__;
}
function g() {
  for (var t2; t2 = c.shift(); )
    if (t2.__P && t2.__H)
      try {
        t2.__H.__h.forEach(w), t2.__H.__h.forEach(z), t2.__H.__h = [];
      } catch (r2) {
        t2.__H.__h = [], l$1.__e(r2, t2.__v);
      }
}
l$1.__b = function(n2) {
  "function" != typeof n2.type || n2.o || n2.type === p$1 ? n2.o || (n2.o = n2.__ && n2.__.o ? n2.__.o : "") : n2.o = (n2.__ && n2.__.o ? n2.__.o : "") + (n2.__ && n2.__.__k ? n2.__.__k.indexOf(n2) : 0), u = null, a && a(n2);
}, l$1.__r = function(n2) {
  v && v(n2), r = 0;
  var t2 = (u = n2.__c).__H;
  t2 && (i$1 === u ? (t2.__h = [], u.__h = [], t2.__.forEach(function(n3) {
    n3.__N && (n3.__ = n3.__N), n3.__V = e, n3.__N = n3.i = void 0;
  })) : (t2.__h.forEach(w), t2.__h.forEach(z), t2.__h = [])), i$1 = u;
}, l$1.diffed = function(t2) {
  l && l(t2);
  var r2 = t2.__c;
  r2 && r2.__H && (r2.__H.__h.length && (1 !== c.push(r2) && o === l$1.requestAnimationFrame || ((o = l$1.requestAnimationFrame) || k)(g)), r2.__H.__.forEach(function(n2) {
    n2.i && (n2.__H = n2.i), n2.__V !== e && (n2.__ = n2.__V), n2.i = void 0, n2.__V = e;
  })), i$1 = u = null;
}, l$1.__c = function(t2, r2) {
  r2.some(function(t3) {
    try {
      t3.__h.forEach(w), t3.__h = t3.__h.filter(function(n2) {
        return !n2.__ || z(n2);
      });
    } catch (u2) {
      r2.some(function(n2) {
        n2.__h && (n2.__h = []);
      }), r2 = [], l$1.__e(u2, t3.__v);
    }
  }), m && m(t2, r2);
}, l$1.unmount = function(t2) {
  d && d(t2);
  var r2, u2 = t2.__c;
  u2 && u2.__H && (u2.__H.__.forEach(function(n2) {
    try {
      w(n2);
    } catch (n3) {
      r2 = n3;
    }
  }), u2.__H = void 0, r2 && l$1.__e(r2, u2.__v));
};
var j = "function" == typeof requestAnimationFrame;
function k(n2) {
  var t2, r2 = function() {
    clearTimeout(u2), j && cancelAnimationFrame(t2), setTimeout(n2);
  }, u2 = setTimeout(r2, 100);
  j && (t2 = requestAnimationFrame(r2));
}
function w(n2) {
  var t2 = u, r2 = n2.__c;
  "function" == typeof r2 && (n2.__c = void 0, r2()), u = t2;
}
function z(n2) {
  var t2 = u;
  n2.__c = n2.__(), u = t2;
}
function B(n2, t2) {
  return !n2 || n2.length !== t2.length || t2.some(function(t3, r2) {
    return t3 !== n2[r2];
  });
}
function C(n2, t2) {
  return "function" == typeof t2 ? t2(n2) : t2;
}
var hooks_module = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  useCallback: q,
  useContext: x,
  useDebugValue: P,
  useEffect: s,
  useErrorBoundary: V,
  useId: b,
  useImperativeHandle: F,
  useLayoutEffect: _,
  useMemo: T,
  useReducer: h,
  useRef: A,
  useState: y
}, Symbol.toStringTag, { value: "Module" }));
var require$$2 = /* @__PURE__ */ getAugmentedNamespace(hooks_module);
var version$1 = {};
Object.defineProperty(version$1, "__esModule", { value: true });
version$1.LIB_VERSION = void 0;
version$1.LIB_VERSION = "3.5.3";
var globeIconSvg = {};
Object.defineProperty(globeIconSvg, "__esModule", { value: true });
globeIconSvg.default = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTggMEMzLjU4IDAgMCAzLjU4IDAgOHMzLjU4IDggOCA4IDgtMy41OCA4LTgtMy41OC04LTgtOFptNS45MSA3aC0xLjk0Yy0uMS0xLjU3LS40Mi0zLS45MS00LjE1IDEuNDguODggMi41NSAyLjM4IDIuODUgNC4xNVpNOCAxNGMtLjQ1IDAtMS43Mi0xLjc3LTEuOTUtNWgzLjljLS4yMyAzLjIzLTEuNSA1LTEuOTUgNVpNNi4wNSA3QzYuMjggMy43NyA3LjU1IDIgOCAyYy40NSAwIDEuNzIgMS43NyAxLjk1IDVoLTMuOVpNNC45NCAyLjg1QzQuNDYgNCA0LjEzIDUuNDMgNC4wMyA3SDIuMDljLjMtMS43NyAxLjM3LTMuMjcgMi44NS00LjE1Wk0yLjA5IDloMS45NGMuMSAxLjU3LjQyIDMgLjkxIDQuMTVBNS45OTggNS45OTggMCAwIDEgMi4wOSA5Wm04Ljk3IDQuMTVjLjQ4LTEuMTUuODEtMi41OC45MS00LjE1aDEuOTRhNS45OTggNS45OTggMCAwIDEtMi44NSA0LjE1WiIgZmlsbD0iIzE2NTJGMCIvPjwvc3ZnPg==`;
var linkIconSvg = {};
Object.defineProperty(linkIconSvg, "__esModule", { value: true });
linkIconSvg.default = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTciIGhlaWdodD0iMTciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTE1LjYzNSAyLjExN2EzLjg4OSAzLjg4OSAwIDAgMC01LjUyMSAwTDYuODkgNS4zMzVBMy44OTQgMy44OTQgMCAwIDAgNS44IDguNzM5Yy4wODMuNTA2LjI2OCAxLjAxMS41NTMgMS40NjYuMTUxLjI1My4zMzYuNDcyLjUzNy42OTFsLjYyMS42MjQgMS4xNDEtMS4xNDYtLjYyLS42MjRhMi4xMDUgMi4xMDUgMCAwIDEtLjQ4Ny0uNzQxIDIuMzQgMi4zNCAwIDAgMSAuNTAzLTIuNTFsMy4yMDYtMy4yMmEyLjI5MyAyLjI5MyAwIDAgMSAzLjIzOSAwYy44OS44OTQuODkgMi4zNDMgMCAzLjI1M2wtMS41MjcgMS41MzNjLjIzNC42NC4zMzUgMS4zMzEuMzAyIDIuMDA1bDIuMzgzLTIuMzkyYzEuNTEtMS41MzQgMS40OTMtNC4wMjgtLjAxNy01LjU2MVoiIGZpbGw9IiMxNjUyRjAiLz48cGF0aCBkPSJNMTEuMjcxIDcuNzQ1YTMuMTMgMy4xMyAwIDAgMC0uNTU0LS42OWwtLjYyLS42MjQtMS4xNDIgMS4xNDYuNjIxLjYyM2MuMjE4LjIyLjM4Ni40ODkuNDg3Ljc1OC4zMzUuODI2LjE2NyAxLjgyLS41MDQgMi40OTRsLTMuMjA1IDMuMjE5YTIuMjkzIDIuMjkzIDAgMCAxLTMuMjQgMCAyLjMxNiAyLjMxNiAwIDAgMSAwLTMuMjUybDEuNTI4LTEuNTM0YTQuODE1IDQuODE1IDAgMCAxLS4yODUtMi4wMDVsLTIuMzgzIDIuMzkzYTMuOTI3IDMuOTI3IDAgMCAwIDAgNS41NDQgMy45MDkgMy45MDkgMCAwIDAgNS41MzggMGwzLjIwNS0zLjIxOWEzLjk1OCAzLjk1OCAwIDAgMCAxLjA5MS0zLjQwNCA0LjIxMSA0LjIxMSAwIDAgMC0uNTM3LTEuNDQ5WiIgZmlsbD0iIzE2NTJGMCIvPjwvc3ZnPg==`;
var lockIconSvg = {};
Object.defineProperty(lockIconSvg, "__esModule", { value: true });
lockIconSvg.default = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgN3Y5aDE0VjdIMVptNy41IDQuMzlWMTRoLTF2LTIuNjFjLS40NC0uMTktLjc1LS42My0uNzUtMS4xNGExLjI1IDEuMjUgMCAwIDEgMi41IDBjMCAuNTEtLjMxLjk1LS43NSAxLjE0Wk01LjY3IDZWNC4zM0M1LjY3IDMuMDUgNi43MSAyIDggMnMyLjMzIDEuMDUgMi4zMyAyLjMzVjZoMlY0LjMzQzEyLjMzIDEuOTQgMTAuMzkgMCA4IDBTMy42NyAxLjk0IDMuNjcgNC4zM1Y2aDJaIiBmaWxsPSIjMTY1MkYwIi8+PC9zdmc+`;
var QRLogo = {};
Object.defineProperty(QRLogo, "__esModule", { value: true });
QRLogo.default = `<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="50" cy="50" r="50" fill="white"/>
<circle cx="49.9996" cy="49.9996" r="43.6363" fill="#1B53E4"/>
<circle cx="49.9996" cy="49.9996" r="43.6363" stroke="white"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M19.3379 49.9484C19.3379 66.8508 33.04 80.553 49.9425 80.553C66.8449 80.553 80.5471 66.8508 80.5471 49.9484C80.5471 33.0459 66.8449 19.3438 49.9425 19.3438C33.04 19.3438 19.3379 33.0459 19.3379 49.9484ZM44.0817 40.0799C41.8725 40.0799 40.0817 41.8708 40.0817 44.0799V55.8029C40.0817 58.012 41.8725 59.8029 44.0817 59.8029H55.8046C58.0138 59.8029 59.8046 58.012 59.8046 55.8029V44.0799C59.8046 41.8708 58.0138 40.0799 55.8046 40.0799H44.0817Z" fill="white"/>
</svg>

`;
var QRCode$2 = {};
function QR8bitByte(data) {
  this.mode = QRMode.MODE_8BIT_BYTE;
  this.data = data;
  this.parsedData = [];
  for (var i = 0, l2 = this.data.length; i < l2; i++) {
    var byteArray = [];
    var code = this.data.charCodeAt(i);
    if (code > 65536) {
      byteArray[0] = 240 | (code & 1835008) >>> 18;
      byteArray[1] = 128 | (code & 258048) >>> 12;
      byteArray[2] = 128 | (code & 4032) >>> 6;
      byteArray[3] = 128 | code & 63;
    } else if (code > 2048) {
      byteArray[0] = 224 | (code & 61440) >>> 12;
      byteArray[1] = 128 | (code & 4032) >>> 6;
      byteArray[2] = 128 | code & 63;
    } else if (code > 128) {
      byteArray[0] = 192 | (code & 1984) >>> 6;
      byteArray[1] = 128 | code & 63;
    } else {
      byteArray[0] = code;
    }
    this.parsedData.push(byteArray);
  }
  this.parsedData = Array.prototype.concat.apply([], this.parsedData);
  if (this.parsedData.length != this.data.length) {
    this.parsedData.unshift(191);
    this.parsedData.unshift(187);
    this.parsedData.unshift(239);
  }
}
QR8bitByte.prototype = {
  getLength: function(buffer2) {
    return this.parsedData.length;
  },
  write: function(buffer2) {
    for (var i = 0, l2 = this.parsedData.length; i < l2; i++) {
      buffer2.put(this.parsedData[i], 8);
    }
  }
};
function QRCodeModel(typeNumber, errorCorrectLevel) {
  this.typeNumber = typeNumber;
  this.errorCorrectLevel = errorCorrectLevel;
  this.modules = null;
  this.moduleCount = 0;
  this.dataCache = null;
  this.dataList = [];
}
QRCodeModel.prototype = { addData: function(data) {
  var newData = new QR8bitByte(data);
  this.dataList.push(newData);
  this.dataCache = null;
}, isDark: function(row, col) {
  if (row < 0 || this.moduleCount <= row || col < 0 || this.moduleCount <= col) {
    throw new Error(row + "," + col);
  }
  return this.modules[row][col];
}, getModuleCount: function() {
  return this.moduleCount;
}, make: function() {
  this.makeImpl(false, this.getBestMaskPattern());
}, makeImpl: function(test, maskPattern) {
  this.moduleCount = this.typeNumber * 4 + 17;
  this.modules = new Array(this.moduleCount);
  for (var row = 0; row < this.moduleCount; row++) {
    this.modules[row] = new Array(this.moduleCount);
    for (var col = 0; col < this.moduleCount; col++) {
      this.modules[row][col] = null;
    }
  }
  this.setupPositionProbePattern(0, 0);
  this.setupPositionProbePattern(this.moduleCount - 7, 0);
  this.setupPositionProbePattern(0, this.moduleCount - 7);
  this.setupPositionAdjustPattern();
  this.setupTimingPattern();
  this.setupTypeInfo(test, maskPattern);
  if (this.typeNumber >= 7) {
    this.setupTypeNumber(test);
  }
  if (this.dataCache == null) {
    this.dataCache = QRCodeModel.createData(this.typeNumber, this.errorCorrectLevel, this.dataList);
  }
  this.mapData(this.dataCache, maskPattern);
}, setupPositionProbePattern: function(row, col) {
  for (var r2 = -1; r2 <= 7; r2++) {
    if (row + r2 <= -1 || this.moduleCount <= row + r2)
      continue;
    for (var c2 = -1; c2 <= 7; c2++) {
      if (col + c2 <= -1 || this.moduleCount <= col + c2)
        continue;
      if (0 <= r2 && r2 <= 6 && (c2 == 0 || c2 == 6) || 0 <= c2 && c2 <= 6 && (r2 == 0 || r2 == 6) || 2 <= r2 && r2 <= 4 && 2 <= c2 && c2 <= 4) {
        this.modules[row + r2][col + c2] = true;
      } else {
        this.modules[row + r2][col + c2] = false;
      }
    }
  }
}, getBestMaskPattern: function() {
  var minLostPoint = 0;
  var pattern = 0;
  for (var i = 0; i < 8; i++) {
    this.makeImpl(true, i);
    var lostPoint = QRUtil.getLostPoint(this);
    if (i == 0 || minLostPoint > lostPoint) {
      minLostPoint = lostPoint;
      pattern = i;
    }
  }
  return pattern;
}, createMovieClip: function(target_mc, instance_name, depth) {
  var qr_mc = target_mc.createEmptyMovieClip(instance_name, depth);
  var cs = 1;
  this.make();
  for (var row = 0; row < this.modules.length; row++) {
    var y2 = row * cs;
    for (var col = 0; col < this.modules[row].length; col++) {
      var x2 = col * cs;
      var dark = this.modules[row][col];
      if (dark) {
        qr_mc.beginFill(0, 100);
        qr_mc.moveTo(x2, y2);
        qr_mc.lineTo(x2 + cs, y2);
        qr_mc.lineTo(x2 + cs, y2 + cs);
        qr_mc.lineTo(x2, y2 + cs);
        qr_mc.endFill();
      }
    }
  }
  return qr_mc;
}, setupTimingPattern: function() {
  for (var r2 = 8; r2 < this.moduleCount - 8; r2++) {
    if (this.modules[r2][6] != null) {
      continue;
    }
    this.modules[r2][6] = r2 % 2 == 0;
  }
  for (var c2 = 8; c2 < this.moduleCount - 8; c2++) {
    if (this.modules[6][c2] != null) {
      continue;
    }
    this.modules[6][c2] = c2 % 2 == 0;
  }
}, setupPositionAdjustPattern: function() {
  var pos = QRUtil.getPatternPosition(this.typeNumber);
  for (var i = 0; i < pos.length; i++) {
    for (var j2 = 0; j2 < pos.length; j2++) {
      var row = pos[i];
      var col = pos[j2];
      if (this.modules[row][col] != null) {
        continue;
      }
      for (var r2 = -2; r2 <= 2; r2++) {
        for (var c2 = -2; c2 <= 2; c2++) {
          if (r2 == -2 || r2 == 2 || c2 == -2 || c2 == 2 || r2 == 0 && c2 == 0) {
            this.modules[row + r2][col + c2] = true;
          } else {
            this.modules[row + r2][col + c2] = false;
          }
        }
      }
    }
  }
}, setupTypeNumber: function(test) {
  var bits = QRUtil.getBCHTypeNumber(this.typeNumber);
  for (var i = 0; i < 18; i++) {
    var mod = !test && (bits >> i & 1) == 1;
    this.modules[Math.floor(i / 3)][i % 3 + this.moduleCount - 8 - 3] = mod;
  }
  for (var i = 0; i < 18; i++) {
    var mod = !test && (bits >> i & 1) == 1;
    this.modules[i % 3 + this.moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
  }
}, setupTypeInfo: function(test, maskPattern) {
  var data = this.errorCorrectLevel << 3 | maskPattern;
  var bits = QRUtil.getBCHTypeInfo(data);
  for (var i = 0; i < 15; i++) {
    var mod = !test && (bits >> i & 1) == 1;
    if (i < 6) {
      this.modules[i][8] = mod;
    } else if (i < 8) {
      this.modules[i + 1][8] = mod;
    } else {
      this.modules[this.moduleCount - 15 + i][8] = mod;
    }
  }
  for (var i = 0; i < 15; i++) {
    var mod = !test && (bits >> i & 1) == 1;
    if (i < 8) {
      this.modules[8][this.moduleCount - i - 1] = mod;
    } else if (i < 9) {
      this.modules[8][15 - i - 1 + 1] = mod;
    } else {
      this.modules[8][15 - i - 1] = mod;
    }
  }
  this.modules[this.moduleCount - 8][8] = !test;
}, mapData: function(data, maskPattern) {
  var inc = -1;
  var row = this.moduleCount - 1;
  var bitIndex = 7;
  var byteIndex = 0;
  for (var col = this.moduleCount - 1; col > 0; col -= 2) {
    if (col == 6)
      col--;
    while (true) {
      for (var c2 = 0; c2 < 2; c2++) {
        if (this.modules[row][col - c2] == null) {
          var dark = false;
          if (byteIndex < data.length) {
            dark = (data[byteIndex] >>> bitIndex & 1) == 1;
          }
          var mask = QRUtil.getMask(maskPattern, row, col - c2);
          if (mask) {
            dark = !dark;
          }
          this.modules[row][col - c2] = dark;
          bitIndex--;
          if (bitIndex == -1) {
            byteIndex++;
            bitIndex = 7;
          }
        }
      }
      row += inc;
      if (row < 0 || this.moduleCount <= row) {
        row -= inc;
        inc = -inc;
        break;
      }
    }
  }
} };
QRCodeModel.PAD0 = 236;
QRCodeModel.PAD1 = 17;
QRCodeModel.createData = function(typeNumber, errorCorrectLevel, dataList) {
  var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectLevel);
  var buffer2 = new QRBitBuffer();
  for (var i = 0; i < dataList.length; i++) {
    var data = dataList[i];
    buffer2.put(data.mode, 4);
    buffer2.put(data.getLength(), QRUtil.getLengthInBits(data.mode, typeNumber));
    data.write(buffer2);
  }
  var totalDataCount = 0;
  for (var i = 0; i < rsBlocks.length; i++) {
    totalDataCount += rsBlocks[i].dataCount;
  }
  if (buffer2.getLengthInBits() > totalDataCount * 8) {
    throw new Error("code length overflow. (" + buffer2.getLengthInBits() + ">" + totalDataCount * 8 + ")");
  }
  if (buffer2.getLengthInBits() + 4 <= totalDataCount * 8) {
    buffer2.put(0, 4);
  }
  while (buffer2.getLengthInBits() % 8 != 0) {
    buffer2.putBit(false);
  }
  while (true) {
    if (buffer2.getLengthInBits() >= totalDataCount * 8) {
      break;
    }
    buffer2.put(QRCodeModel.PAD0, 8);
    if (buffer2.getLengthInBits() >= totalDataCount * 8) {
      break;
    }
    buffer2.put(QRCodeModel.PAD1, 8);
  }
  return QRCodeModel.createBytes(buffer2, rsBlocks);
};
QRCodeModel.createBytes = function(buffer2, rsBlocks) {
  var offset = 0;
  var maxDcCount = 0;
  var maxEcCount = 0;
  var dcdata = new Array(rsBlocks.length);
  var ecdata = new Array(rsBlocks.length);
  for (var r2 = 0; r2 < rsBlocks.length; r2++) {
    var dcCount = rsBlocks[r2].dataCount;
    var ecCount = rsBlocks[r2].totalCount - dcCount;
    maxDcCount = Math.max(maxDcCount, dcCount);
    maxEcCount = Math.max(maxEcCount, ecCount);
    dcdata[r2] = new Array(dcCount);
    for (var i = 0; i < dcdata[r2].length; i++) {
      dcdata[r2][i] = 255 & buffer2.buffer[i + offset];
    }
    offset += dcCount;
    var rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
    var rawPoly = new QRPolynomial(dcdata[r2], rsPoly.getLength() - 1);
    var modPoly = rawPoly.mod(rsPoly);
    ecdata[r2] = new Array(rsPoly.getLength() - 1);
    for (var i = 0; i < ecdata[r2].length; i++) {
      var modIndex = i + modPoly.getLength() - ecdata[r2].length;
      ecdata[r2][i] = modIndex >= 0 ? modPoly.get(modIndex) : 0;
    }
  }
  var totalCodeCount = 0;
  for (var i = 0; i < rsBlocks.length; i++) {
    totalCodeCount += rsBlocks[i].totalCount;
  }
  var data = new Array(totalCodeCount);
  var index2 = 0;
  for (var i = 0; i < maxDcCount; i++) {
    for (var r2 = 0; r2 < rsBlocks.length; r2++) {
      if (i < dcdata[r2].length) {
        data[index2++] = dcdata[r2][i];
      }
    }
  }
  for (var i = 0; i < maxEcCount; i++) {
    for (var r2 = 0; r2 < rsBlocks.length; r2++) {
      if (i < ecdata[r2].length) {
        data[index2++] = ecdata[r2][i];
      }
    }
  }
  return data;
};
var QRMode = { MODE_NUMBER: 1 << 0, MODE_ALPHA_NUM: 1 << 1, MODE_8BIT_BYTE: 1 << 2, MODE_KANJI: 1 << 3 };
var QRErrorCorrectLevel = { L: 1, M: 0, Q: 3, H: 2 };
var QRMaskPattern = { PATTERN000: 0, PATTERN001: 1, PATTERN010: 2, PATTERN011: 3, PATTERN100: 4, PATTERN101: 5, PATTERN110: 6, PATTERN111: 7 };
var QRUtil = { PATTERN_POSITION_TABLE: [[], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50], [6, 30, 54], [6, 32, 58], [6, 34, 62], [6, 26, 46, 66], [6, 26, 48, 70], [6, 26, 50, 74], [6, 30, 54, 78], [6, 30, 56, 82], [6, 30, 58, 86], [6, 34, 62, 90], [6, 28, 50, 72, 94], [6, 26, 50, 74, 98], [6, 30, 54, 78, 102], [6, 28, 54, 80, 106], [6, 32, 58, 84, 110], [6, 30, 58, 86, 114], [6, 34, 62, 90, 118], [6, 26, 50, 74, 98, 122], [6, 30, 54, 78, 102, 126], [6, 26, 52, 78, 104, 130], [6, 30, 56, 82, 108, 134], [6, 34, 60, 86, 112, 138], [6, 30, 58, 86, 114, 142], [6, 34, 62, 90, 118, 146], [6, 30, 54, 78, 102, 126, 150], [6, 24, 50, 76, 102, 128, 154], [6, 28, 54, 80, 106, 132, 158], [6, 32, 58, 84, 110, 136, 162], [6, 26, 54, 82, 110, 138, 166], [6, 30, 58, 86, 114, 142, 170]], G15: 1 << 10 | 1 << 8 | 1 << 5 | 1 << 4 | 1 << 2 | 1 << 1 | 1 << 0, G18: 1 << 12 | 1 << 11 | 1 << 10 | 1 << 9 | 1 << 8 | 1 << 5 | 1 << 2 | 1 << 0, G15_MASK: 1 << 14 | 1 << 12 | 1 << 10 | 1 << 4 | 1 << 1, getBCHTypeInfo: function(data) {
  var d2 = data << 10;
  while (QRUtil.getBCHDigit(d2) - QRUtil.getBCHDigit(QRUtil.G15) >= 0) {
    d2 ^= QRUtil.G15 << QRUtil.getBCHDigit(d2) - QRUtil.getBCHDigit(QRUtil.G15);
  }
  return (data << 10 | d2) ^ QRUtil.G15_MASK;
}, getBCHTypeNumber: function(data) {
  var d2 = data << 12;
  while (QRUtil.getBCHDigit(d2) - QRUtil.getBCHDigit(QRUtil.G18) >= 0) {
    d2 ^= QRUtil.G18 << QRUtil.getBCHDigit(d2) - QRUtil.getBCHDigit(QRUtil.G18);
  }
  return data << 12 | d2;
}, getBCHDigit: function(data) {
  var digit = 0;
  while (data != 0) {
    digit++;
    data >>>= 1;
  }
  return digit;
}, getPatternPosition: function(typeNumber) {
  return QRUtil.PATTERN_POSITION_TABLE[typeNumber - 1];
}, getMask: function(maskPattern, i, j2) {
  switch (maskPattern) {
    case QRMaskPattern.PATTERN000:
      return (i + j2) % 2 == 0;
    case QRMaskPattern.PATTERN001:
      return i % 2 == 0;
    case QRMaskPattern.PATTERN010:
      return j2 % 3 == 0;
    case QRMaskPattern.PATTERN011:
      return (i + j2) % 3 == 0;
    case QRMaskPattern.PATTERN100:
      return (Math.floor(i / 2) + Math.floor(j2 / 3)) % 2 == 0;
    case QRMaskPattern.PATTERN101:
      return i * j2 % 2 + i * j2 % 3 == 0;
    case QRMaskPattern.PATTERN110:
      return (i * j2 % 2 + i * j2 % 3) % 2 == 0;
    case QRMaskPattern.PATTERN111:
      return (i * j2 % 3 + (i + j2) % 2) % 2 == 0;
    default:
      throw new Error("bad maskPattern:" + maskPattern);
  }
}, getErrorCorrectPolynomial: function(errorCorrectLength) {
  var a2 = new QRPolynomial([1], 0);
  for (var i = 0; i < errorCorrectLength; i++) {
    a2 = a2.multiply(new QRPolynomial([1, QRMath.gexp(i)], 0));
  }
  return a2;
}, getLengthInBits: function(mode, type) {
  if (1 <= type && type < 10) {
    switch (mode) {
      case QRMode.MODE_NUMBER:
        return 10;
      case QRMode.MODE_ALPHA_NUM:
        return 9;
      case QRMode.MODE_8BIT_BYTE:
        return 8;
      case QRMode.MODE_KANJI:
        return 8;
      default:
        throw new Error("mode:" + mode);
    }
  } else if (type < 27) {
    switch (mode) {
      case QRMode.MODE_NUMBER:
        return 12;
      case QRMode.MODE_ALPHA_NUM:
        return 11;
      case QRMode.MODE_8BIT_BYTE:
        return 16;
      case QRMode.MODE_KANJI:
        return 10;
      default:
        throw new Error("mode:" + mode);
    }
  } else if (type < 41) {
    switch (mode) {
      case QRMode.MODE_NUMBER:
        return 14;
      case QRMode.MODE_ALPHA_NUM:
        return 13;
      case QRMode.MODE_8BIT_BYTE:
        return 16;
      case QRMode.MODE_KANJI:
        return 12;
      default:
        throw new Error("mode:" + mode);
    }
  } else {
    throw new Error("type:" + type);
  }
}, getLostPoint: function(qrCode) {
  var moduleCount = qrCode.getModuleCount();
  var lostPoint = 0;
  for (var row = 0; row < moduleCount; row++) {
    for (var col = 0; col < moduleCount; col++) {
      var sameCount = 0;
      var dark = qrCode.isDark(row, col);
      for (var r2 = -1; r2 <= 1; r2++) {
        if (row + r2 < 0 || moduleCount <= row + r2) {
          continue;
        }
        for (var c2 = -1; c2 <= 1; c2++) {
          if (col + c2 < 0 || moduleCount <= col + c2) {
            continue;
          }
          if (r2 == 0 && c2 == 0) {
            continue;
          }
          if (dark == qrCode.isDark(row + r2, col + c2)) {
            sameCount++;
          }
        }
      }
      if (sameCount > 5) {
        lostPoint += 3 + sameCount - 5;
      }
    }
  }
  for (var row = 0; row < moduleCount - 1; row++) {
    for (var col = 0; col < moduleCount - 1; col++) {
      var count2 = 0;
      if (qrCode.isDark(row, col))
        count2++;
      if (qrCode.isDark(row + 1, col))
        count2++;
      if (qrCode.isDark(row, col + 1))
        count2++;
      if (qrCode.isDark(row + 1, col + 1))
        count2++;
      if (count2 == 0 || count2 == 4) {
        lostPoint += 3;
      }
    }
  }
  for (var row = 0; row < moduleCount; row++) {
    for (var col = 0; col < moduleCount - 6; col++) {
      if (qrCode.isDark(row, col) && !qrCode.isDark(row, col + 1) && qrCode.isDark(row, col + 2) && qrCode.isDark(row, col + 3) && qrCode.isDark(row, col + 4) && !qrCode.isDark(row, col + 5) && qrCode.isDark(row, col + 6)) {
        lostPoint += 40;
      }
    }
  }
  for (var col = 0; col < moduleCount; col++) {
    for (var row = 0; row < moduleCount - 6; row++) {
      if (qrCode.isDark(row, col) && !qrCode.isDark(row + 1, col) && qrCode.isDark(row + 2, col) && qrCode.isDark(row + 3, col) && qrCode.isDark(row + 4, col) && !qrCode.isDark(row + 5, col) && qrCode.isDark(row + 6, col)) {
        lostPoint += 40;
      }
    }
  }
  var darkCount = 0;
  for (var col = 0; col < moduleCount; col++) {
    for (var row = 0; row < moduleCount; row++) {
      if (qrCode.isDark(row, col)) {
        darkCount++;
      }
    }
  }
  var ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
  lostPoint += ratio * 10;
  return lostPoint;
} };
var QRMath = { glog: function(n2) {
  if (n2 < 1) {
    throw new Error("glog(" + n2 + ")");
  }
  return QRMath.LOG_TABLE[n2];
}, gexp: function(n2) {
  while (n2 < 0) {
    n2 += 255;
  }
  while (n2 >= 256) {
    n2 -= 255;
  }
  return QRMath.EXP_TABLE[n2];
}, EXP_TABLE: new Array(256), LOG_TABLE: new Array(256) };
for (var i = 0; i < 8; i++) {
  QRMath.EXP_TABLE[i] = 1 << i;
}
for (var i = 8; i < 256; i++) {
  QRMath.EXP_TABLE[i] = QRMath.EXP_TABLE[i - 4] ^ QRMath.EXP_TABLE[i - 5] ^ QRMath.EXP_TABLE[i - 6] ^ QRMath.EXP_TABLE[i - 8];
}
for (var i = 0; i < 255; i++) {
  QRMath.LOG_TABLE[QRMath.EXP_TABLE[i]] = i;
}
function QRPolynomial(num, shift) {
  if (num.length == void 0) {
    throw new Error(num.length + "/" + shift);
  }
  var offset = 0;
  while (offset < num.length && num[offset] == 0) {
    offset++;
  }
  this.num = new Array(num.length - offset + shift);
  for (var i = 0; i < num.length - offset; i++) {
    this.num[i] = num[i + offset];
  }
}
QRPolynomial.prototype = { get: function(index2) {
  return this.num[index2];
}, getLength: function() {
  return this.num.length;
}, multiply: function(e2) {
  var num = new Array(this.getLength() + e2.getLength() - 1);
  for (var i = 0; i < this.getLength(); i++) {
    for (var j2 = 0; j2 < e2.getLength(); j2++) {
      num[i + j2] ^= QRMath.gexp(QRMath.glog(this.get(i)) + QRMath.glog(e2.get(j2)));
    }
  }
  return new QRPolynomial(num, 0);
}, mod: function(e2) {
  if (this.getLength() - e2.getLength() < 0) {
    return this;
  }
  var ratio = QRMath.glog(this.get(0)) - QRMath.glog(e2.get(0));
  var num = new Array(this.getLength());
  for (var i = 0; i < this.getLength(); i++) {
    num[i] = this.get(i);
  }
  for (var i = 0; i < e2.getLength(); i++) {
    num[i] ^= QRMath.gexp(QRMath.glog(e2.get(i)) + ratio);
  }
  return new QRPolynomial(num, 0).mod(e2);
} };
function QRRSBlock(totalCount, dataCount) {
  this.totalCount = totalCount;
  this.dataCount = dataCount;
}
QRRSBlock.RS_BLOCK_TABLE = [[1, 26, 19], [1, 26, 16], [1, 26, 13], [1, 26, 9], [1, 44, 34], [1, 44, 28], [1, 44, 22], [1, 44, 16], [1, 70, 55], [1, 70, 44], [2, 35, 17], [2, 35, 13], [1, 100, 80], [2, 50, 32], [2, 50, 24], [4, 25, 9], [1, 134, 108], [2, 67, 43], [2, 33, 15, 2, 34, 16], [2, 33, 11, 2, 34, 12], [2, 86, 68], [4, 43, 27], [4, 43, 19], [4, 43, 15], [2, 98, 78], [4, 49, 31], [2, 32, 14, 4, 33, 15], [4, 39, 13, 1, 40, 14], [2, 121, 97], [2, 60, 38, 2, 61, 39], [4, 40, 18, 2, 41, 19], [4, 40, 14, 2, 41, 15], [2, 146, 116], [3, 58, 36, 2, 59, 37], [4, 36, 16, 4, 37, 17], [4, 36, 12, 4, 37, 13], [2, 86, 68, 2, 87, 69], [4, 69, 43, 1, 70, 44], [6, 43, 19, 2, 44, 20], [6, 43, 15, 2, 44, 16], [4, 101, 81], [1, 80, 50, 4, 81, 51], [4, 50, 22, 4, 51, 23], [3, 36, 12, 8, 37, 13], [2, 116, 92, 2, 117, 93], [6, 58, 36, 2, 59, 37], [4, 46, 20, 6, 47, 21], [7, 42, 14, 4, 43, 15], [4, 133, 107], [8, 59, 37, 1, 60, 38], [8, 44, 20, 4, 45, 21], [12, 33, 11, 4, 34, 12], [3, 145, 115, 1, 146, 116], [4, 64, 40, 5, 65, 41], [11, 36, 16, 5, 37, 17], [11, 36, 12, 5, 37, 13], [5, 109, 87, 1, 110, 88], [5, 65, 41, 5, 66, 42], [5, 54, 24, 7, 55, 25], [11, 36, 12], [5, 122, 98, 1, 123, 99], [7, 73, 45, 3, 74, 46], [15, 43, 19, 2, 44, 20], [3, 45, 15, 13, 46, 16], [1, 135, 107, 5, 136, 108], [10, 74, 46, 1, 75, 47], [1, 50, 22, 15, 51, 23], [2, 42, 14, 17, 43, 15], [5, 150, 120, 1, 151, 121], [9, 69, 43, 4, 70, 44], [17, 50, 22, 1, 51, 23], [2, 42, 14, 19, 43, 15], [3, 141, 113, 4, 142, 114], [3, 70, 44, 11, 71, 45], [17, 47, 21, 4, 48, 22], [9, 39, 13, 16, 40, 14], [3, 135, 107, 5, 136, 108], [3, 67, 41, 13, 68, 42], [15, 54, 24, 5, 55, 25], [15, 43, 15, 10, 44, 16], [4, 144, 116, 4, 145, 117], [17, 68, 42], [17, 50, 22, 6, 51, 23], [19, 46, 16, 6, 47, 17], [2, 139, 111, 7, 140, 112], [17, 74, 46], [7, 54, 24, 16, 55, 25], [34, 37, 13], [4, 151, 121, 5, 152, 122], [4, 75, 47, 14, 76, 48], [11, 54, 24, 14, 55, 25], [16, 45, 15, 14, 46, 16], [6, 147, 117, 4, 148, 118], [6, 73, 45, 14, 74, 46], [11, 54, 24, 16, 55, 25], [30, 46, 16, 2, 47, 17], [8, 132, 106, 4, 133, 107], [8, 75, 47, 13, 76, 48], [7, 54, 24, 22, 55, 25], [22, 45, 15, 13, 46, 16], [10, 142, 114, 2, 143, 115], [19, 74, 46, 4, 75, 47], [28, 50, 22, 6, 51, 23], [33, 46, 16, 4, 47, 17], [8, 152, 122, 4, 153, 123], [22, 73, 45, 3, 74, 46], [8, 53, 23, 26, 54, 24], [12, 45, 15, 28, 46, 16], [3, 147, 117, 10, 148, 118], [3, 73, 45, 23, 74, 46], [4, 54, 24, 31, 55, 25], [11, 45, 15, 31, 46, 16], [7, 146, 116, 7, 147, 117], [21, 73, 45, 7, 74, 46], [1, 53, 23, 37, 54, 24], [19, 45, 15, 26, 46, 16], [5, 145, 115, 10, 146, 116], [19, 75, 47, 10, 76, 48], [15, 54, 24, 25, 55, 25], [23, 45, 15, 25, 46, 16], [13, 145, 115, 3, 146, 116], [2, 74, 46, 29, 75, 47], [42, 54, 24, 1, 55, 25], [23, 45, 15, 28, 46, 16], [17, 145, 115], [10, 74, 46, 23, 75, 47], [10, 54, 24, 35, 55, 25], [19, 45, 15, 35, 46, 16], [17, 145, 115, 1, 146, 116], [14, 74, 46, 21, 75, 47], [29, 54, 24, 19, 55, 25], [11, 45, 15, 46, 46, 16], [13, 145, 115, 6, 146, 116], [14, 74, 46, 23, 75, 47], [44, 54, 24, 7, 55, 25], [59, 46, 16, 1, 47, 17], [12, 151, 121, 7, 152, 122], [12, 75, 47, 26, 76, 48], [39, 54, 24, 14, 55, 25], [22, 45, 15, 41, 46, 16], [6, 151, 121, 14, 152, 122], [6, 75, 47, 34, 76, 48], [46, 54, 24, 10, 55, 25], [2, 45, 15, 64, 46, 16], [17, 152, 122, 4, 153, 123], [29, 74, 46, 14, 75, 47], [49, 54, 24, 10, 55, 25], [24, 45, 15, 46, 46, 16], [4, 152, 122, 18, 153, 123], [13, 74, 46, 32, 75, 47], [48, 54, 24, 14, 55, 25], [42, 45, 15, 32, 46, 16], [20, 147, 117, 4, 148, 118], [40, 75, 47, 7, 76, 48], [43, 54, 24, 22, 55, 25], [10, 45, 15, 67, 46, 16], [19, 148, 118, 6, 149, 119], [18, 75, 47, 31, 76, 48], [34, 54, 24, 34, 55, 25], [20, 45, 15, 61, 46, 16]];
QRRSBlock.getRSBlocks = function(typeNumber, errorCorrectLevel) {
  var rsBlock = QRRSBlock.getRsBlockTable(typeNumber, errorCorrectLevel);
  if (rsBlock == void 0) {
    throw new Error("bad rs block @ typeNumber:" + typeNumber + "/errorCorrectLevel:" + errorCorrectLevel);
  }
  var length = rsBlock.length / 3;
  var list = [];
  for (var i = 0; i < length; i++) {
    var count2 = rsBlock[i * 3 + 0];
    var totalCount = rsBlock[i * 3 + 1];
    var dataCount = rsBlock[i * 3 + 2];
    for (var j2 = 0; j2 < count2; j2++) {
      list.push(new QRRSBlock(totalCount, dataCount));
    }
  }
  return list;
};
QRRSBlock.getRsBlockTable = function(typeNumber, errorCorrectLevel) {
  switch (errorCorrectLevel) {
    case QRErrorCorrectLevel.L:
      return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
    case QRErrorCorrectLevel.M:
      return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
    case QRErrorCorrectLevel.Q:
      return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
    case QRErrorCorrectLevel.H:
      return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
    default:
      return void 0;
  }
};
function QRBitBuffer() {
  this.buffer = [];
  this.length = 0;
}
QRBitBuffer.prototype = { get: function(index2) {
  var bufIndex = Math.floor(index2 / 8);
  return (this.buffer[bufIndex] >>> 7 - index2 % 8 & 1) == 1;
}, put: function(num, length) {
  for (var i = 0; i < length; i++) {
    this.putBit((num >>> length - i - 1 & 1) == 1);
  }
}, getLengthInBits: function() {
  return this.length;
}, putBit: function(bit) {
  var bufIndex = Math.floor(this.length / 8);
  if (this.buffer.length <= bufIndex) {
    this.buffer.push(0);
  }
  if (bit) {
    this.buffer[bufIndex] |= 128 >>> this.length % 8;
  }
  this.length++;
} };
var QRCodeLimitLength = [[17, 14, 11, 7], [32, 26, 20, 14], [53, 42, 32, 24], [78, 62, 46, 34], [106, 84, 60, 44], [134, 106, 74, 58], [154, 122, 86, 64], [192, 152, 108, 84], [230, 180, 130, 98], [271, 213, 151, 119], [321, 251, 177, 137], [367, 287, 203, 155], [425, 331, 241, 177], [458, 362, 258, 194], [520, 412, 292, 220], [586, 450, 322, 250], [644, 504, 364, 280], [718, 560, 394, 310], [792, 624, 442, 338], [858, 666, 482, 382], [929, 711, 509, 403], [1003, 779, 565, 439], [1091, 857, 611, 461], [1171, 911, 661, 511], [1273, 997, 715, 535], [1367, 1059, 751, 593], [1465, 1125, 805, 625], [1528, 1190, 868, 658], [1628, 1264, 908, 698], [1732, 1370, 982, 742], [1840, 1452, 1030, 790], [1952, 1538, 1112, 842], [2068, 1628, 1168, 898], [2188, 1722, 1228, 958], [2303, 1809, 1283, 983], [2431, 1911, 1351, 1051], [2563, 1989, 1423, 1093], [2699, 2099, 1499, 1139], [2809, 2213, 1579, 1219], [2953, 2331, 1663, 1273]];
function QRCode$1(options) {
  this.options = {
    padding: 4,
    width: 256,
    height: 256,
    typeNumber: 4,
    color: "#000000",
    background: "#ffffff",
    ecl: "M",
    image: {
      svg: "",
      width: 0,
      height: 0
    }
  };
  if (typeof options === "string") {
    options = {
      content: options
    };
  }
  if (options) {
    for (var i in options) {
      this.options[i] = options[i];
    }
  }
  if (typeof this.options.content !== "string") {
    throw new Error("Expected 'content' as string!");
  }
  if (this.options.content.length === 0) {
    throw new Error("Expected 'content' to be non-empty!");
  }
  if (!(this.options.padding >= 0)) {
    throw new Error("Expected 'padding' value to be non-negative!");
  }
  if (!(this.options.width > 0) || !(this.options.height > 0)) {
    throw new Error("Expected 'width' or 'height' value to be higher than zero!");
  }
  function _getErrorCorrectLevel(ecl2) {
    switch (ecl2) {
      case "L":
        return QRErrorCorrectLevel.L;
      case "M":
        return QRErrorCorrectLevel.M;
      case "Q":
        return QRErrorCorrectLevel.Q;
      case "H":
        return QRErrorCorrectLevel.H;
      default:
        throw new Error("Unknwon error correction level: " + ecl2);
    }
  }
  function _getTypeNumber(content2, ecl2) {
    var length = _getUTF8Length(content2);
    var type2 = 1;
    var limit = 0;
    for (var i2 = 0, len = QRCodeLimitLength.length; i2 <= len; i2++) {
      var table = QRCodeLimitLength[i2];
      if (!table) {
        throw new Error("Content too long: expected " + limit + " but got " + length);
      }
      switch (ecl2) {
        case "L":
          limit = table[0];
          break;
        case "M":
          limit = table[1];
          break;
        case "Q":
          limit = table[2];
          break;
        case "H":
          limit = table[3];
          break;
        default:
          throw new Error("Unknwon error correction level: " + ecl2);
      }
      if (length <= limit) {
        break;
      }
      type2++;
    }
    if (type2 > QRCodeLimitLength.length) {
      throw new Error("Content too long");
    }
    return type2;
  }
  function _getUTF8Length(content2) {
    var result = encodeURI(content2).toString().replace(/\%[0-9a-fA-F]{2}/g, "a");
    return result.length + (result.length != content2 ? 3 : 0);
  }
  var content = this.options.content;
  var type = _getTypeNumber(content, this.options.ecl);
  var ecl = _getErrorCorrectLevel(this.options.ecl);
  this.qrcode = new QRCodeModel(type, ecl);
  this.qrcode.addData(content);
  this.qrcode.make();
}
QRCode$1.prototype.svg = function(opt) {
  var options = this.options || {};
  var modules = this.qrcode.modules;
  if (typeof opt == "undefined") {
    opt = { container: options.container || "svg" };
  }
  var pretty = typeof options.pretty != "undefined" ? !!options.pretty : true;
  var indent = pretty ? "  " : "";
  var EOL = pretty ? "\r\n" : "";
  var width = options.width;
  var height = options.height;
  var length = modules.length;
  var xsize = width / (length + 2 * options.padding);
  var ysize = height / (length + 2 * options.padding);
  var join = typeof options.join != "undefined" ? !!options.join : false;
  var swap = typeof options.swap != "undefined" ? !!options.swap : false;
  var xmlDeclaration = typeof options.xmlDeclaration != "undefined" ? !!options.xmlDeclaration : true;
  var predefined = typeof options.predefined != "undefined" ? !!options.predefined : false;
  var defs = predefined ? indent + '<defs><path id="qrmodule" d="M0 0 h' + ysize + " v" + xsize + ' H0 z" style="fill:' + options.color + ';shape-rendering:crispEdges;" /></defs>' + EOL : "";
  var bgrect = indent + '<rect x="0" y="0" width="' + width + '" height="' + height + '" style="fill:' + options.background + ';shape-rendering:crispEdges;"/>' + EOL;
  var modrect = "";
  var pathdata = "";
  for (var y2 = 0; y2 < length; y2++) {
    for (var x2 = 0; x2 < length; x2++) {
      var module = modules[x2][y2];
      if (module) {
        var px = x2 * xsize + options.padding * xsize;
        var py = y2 * ysize + options.padding * ysize;
        if (swap) {
          var t2 = px;
          px = py;
          py = t2;
        }
        if (join) {
          var w2 = xsize + px;
          var h2 = ysize + py;
          px = Number.isInteger(px) ? Number(px) : px.toFixed(2);
          py = Number.isInteger(py) ? Number(py) : py.toFixed(2);
          w2 = Number.isInteger(w2) ? Number(w2) : w2.toFixed(2);
          h2 = Number.isInteger(h2) ? Number(h2) : h2.toFixed(2);
          pathdata += "M" + px + "," + py + " V" + h2 + " H" + w2 + " V" + py + " H" + px + " Z ";
        } else if (predefined) {
          modrect += indent + '<use x="' + px.toString() + '" y="' + py.toString() + '" href="#qrmodule" />' + EOL;
        } else {
          modrect += indent + '<rect x="' + px.toString() + '" y="' + py.toString() + '" width="' + xsize + '" height="' + ysize + '" style="fill:' + options.color + ';shape-rendering:crispEdges;"/>' + EOL;
        }
      }
    }
  }
  if (join) {
    modrect = indent + '<path x="0" y="0" style="fill:' + options.color + ';shape-rendering:crispEdges;" d="' + pathdata + '" />';
  }
  let imgSvg = "";
  if (this.options.image !== void 0 && this.options.image.svg) {
    const imgWidth = width * this.options.image.width / 100;
    const imgHeight = height * this.options.image.height / 100;
    const imgX = width / 2 - imgWidth / 2;
    const imgY = height / 2 - imgHeight / 2;
    imgSvg += `<svg x="${imgX}" y="${imgY}" width="${imgWidth}" height="${imgHeight}" viewBox="0 0 100 100" preserveAspectRatio="xMinYMin meet">`;
    imgSvg += this.options.image.svg + EOL;
    imgSvg += "</svg>";
  }
  var svg = "";
  switch (opt.container) {
    case "svg":
      if (xmlDeclaration) {
        svg += '<?xml version="1.0" standalone="yes"?>' + EOL;
      }
      svg += '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="' + width + '" height="' + height + '">' + EOL;
      svg += defs + bgrect + modrect;
      svg += imgSvg;
      svg += "</svg>";
      break;
    case "svg-viewbox":
      if (xmlDeclaration) {
        svg += '<?xml version="1.0" standalone="yes"?>' + EOL;
      }
      svg += '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 ' + width + " " + height + '">' + EOL;
      svg += defs + bgrect + modrect;
      svg += imgSvg;
      svg += "</svg>";
      break;
    case "g":
      svg += '<g width="' + width + '" height="' + height + '">' + EOL;
      svg += defs + bgrect + modrect;
      svg += imgSvg;
      svg += "</g>";
      break;
    default:
      svg += (defs + bgrect + modrect + imgSvg).replace(/^\s+/, "");
      break;
  }
  return svg;
};
var qrcodeSvg = QRCode$1;
var __importDefault$4 = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(QRCode$2, "__esModule", { value: true });
QRCode$2.QRCode = void 0;
const preact_1$3 = require$$1;
const hooks_1$1 = require$$2;
const qrcode_svg_1 = __importDefault$4(qrcodeSvg);
const QRCode = (props) => {
  const [svg, setSvg] = (0, hooks_1$1.useState)("");
  (0, hooks_1$1.useEffect)(() => {
    var _a, _b;
    const qrcode = new qrcode_svg_1.default({
      content: props.content,
      background: props.bgColor || "#ffffff",
      color: props.fgColor || "#000000",
      container: "svg",
      ecl: "M",
      width: (_a = props.width) !== null && _a !== void 0 ? _a : 256,
      height: (_b = props.height) !== null && _b !== void 0 ? _b : 256,
      padding: 0,
      image: props.image
    });
    const base64 = Buffer.from(qrcode.svg(), "utf8").toString("base64");
    setSvg(`data:image/svg+xml;base64,${base64}`);
  });
  return svg ? (0, preact_1$3.h)("img", { src: svg, alt: "QR Code" }) : null;
};
QRCode$2.QRCode = QRCode;
var Spinner$1 = {};
var SpinnerCss = {};
Object.defineProperty(SpinnerCss, "__esModule", { value: true });
SpinnerCss.default = `.-cbwsdk-css-reset .-cbwsdk-spinner{display:inline-block}.-cbwsdk-css-reset .-cbwsdk-spinner svg{display:inline-block;animation:2s linear infinite -cbwsdk-spinner-svg}.-cbwsdk-css-reset .-cbwsdk-spinner svg circle{animation:1.9s ease-in-out infinite both -cbwsdk-spinner-circle;display:block;fill:rgba(0,0,0,0);stroke-dasharray:283;stroke-dashoffset:280;stroke-linecap:round;stroke-width:10px;transform-origin:50% 50%}@keyframes -cbwsdk-spinner-svg{0%{transform:rotateZ(0deg)}100%{transform:rotateZ(360deg)}}@keyframes -cbwsdk-spinner-circle{0%,25%{stroke-dashoffset:280;transform:rotate(0)}50%,75%{stroke-dashoffset:75;transform:rotate(45deg)}100%{stroke-dashoffset:280;transform:rotate(360deg)}}`;
var __importDefault$3 = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(Spinner$1, "__esModule", { value: true });
Spinner$1.Spinner = void 0;
const preact_1$2 = require$$1;
const Spinner_css_1 = __importDefault$3(SpinnerCss);
const Spinner = (props) => {
  var _a;
  const size = (_a = props.size) !== null && _a !== void 0 ? _a : 64;
  const color = props.color || "#000";
  return (0, preact_1$2.h)(
    "div",
    { class: "-cbwsdk-spinner" },
    (0, preact_1$2.h)("style", null, Spinner_css_1.default),
    (0, preact_1$2.h)(
      "svg",
      { viewBox: "0 0 100 100", xmlns: "http://www.w3.org/2000/svg", style: { width: size, height: size } },
      (0, preact_1$2.h)("circle", { style: { cx: 50, cy: 50, r: 45, stroke: color } })
    )
  );
};
Spinner$1.Spinner = Spinner;
var TryExtensionLinkDialogCss = {};
Object.defineProperty(TryExtensionLinkDialogCss, "__esModule", { value: true });
TryExtensionLinkDialogCss.default = `.-cbwsdk-css-reset .-cbwsdk-extension-dialog{z-index:2147483647;position:fixed;top:0;left:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center}.-cbwsdk-css-reset .-cbwsdk-extension-dialog-backdrop{z-index:2147483647;position:fixed;top:0;left:0;right:0;bottom:0;transition:opacity .25s}.-cbwsdk-css-reset .-cbwsdk-extension-dialog-backdrop.light{background-color:rgba(0,0,0,.5)}.-cbwsdk-css-reset .-cbwsdk-extension-dialog-backdrop.dark{background-color:rgba(50,53,61,.4)}.-cbwsdk-css-reset .-cbwsdk-extension-dialog-backdrop-hidden{opacity:0}.-cbwsdk-css-reset .-cbwsdk-extension-dialog-box{display:flex;position:relative;max-width:500px;flex-direction:column;transform:scale(1);transition:opacity .25s,transform .25s}.-cbwsdk-css-reset .-cbwsdk-extension-dialog-box-hidden{opacity:0;transform:scale(0.85)}.-cbwsdk-css-reset .-cbwsdk-extension-dialog-box-top{display:flex;flex-direction:row;border-radius:8px;overflow:hidden;min-height:300px}.-cbwsdk-css-reset .-cbwsdk-extension-dialog-box-top.dark{color:#fff;background-color:#000;box-shadow:0 4px 16px rgba(255,255,255,.05)}.-cbwsdk-css-reset .-cbwsdk-extension-dialog-box-top.light{background-color:#fff}.-cbwsdk-css-reset .-cbwsdk-extension-dialog-box-top-subtext{margin-top:15px;font-size:12px;line-height:1.5}.-cbwsdk-css-reset .-cbwsdk-extension-dialog-box-top-install-region{display:flex;flex-basis:50%;flex-direction:column;justify-content:center;padding:32px}.-cbwsdk-css-reset .-cbwsdk-extension-dialog-box-top-install-region button{display:block;border-radius:8px;background-color:#1652f0;color:#fff;width:90%;min-width:fit-content;height:44px;margin-top:16px;font-size:16px;padding-left:16px;padding-right:16px;cursor:pointer;font-weight:500;text-align:center}.-cbwsdk-css-reset .-cbwsdk-extension-dialog-box-top-install-region button.dark{background-color:#3773f5}.-cbwsdk-css-reset .-cbwsdk-extension-dialog-box-top-info-region{display:flex;flex-basis:50%;flex-direction:column;justify-content:center}.-cbwsdk-css-reset .-cbwsdk-extension-dialog-box-top-info-region.light{background-color:#fafbfc}.-cbwsdk-css-reset .-cbwsdk-extension-dialog-box-top-info-region.dark{background-color:#141519}.-cbwsdk-css-reset .-cbwsdk-extension-dialog-box-top-description{display:flex;flex-direction:row;align-items:center;padding-top:14px;padding-bottom:14px;padding-left:24px;padding-right:32px}.-cbwsdk-css-reset .-cbwsdk-extension-dialog-box-top-description-icon-wrapper{display:block;position:relative;width:40px;height:40px;flex-shrink:0;flex-grow:0;border-radius:20px;background-color:#fff;box-shadow:0px 0px 8px rgba(0,0,0,.04),0px 16px 24px rgba(0,0,0,.06)}.-cbwsdk-css-reset .-cbwsdk-extension-dialog-box-top-description-icon-wrapper img{position:absolute;top:0;bottom:0;left:0;right:0;margin:auto}.-cbwsdk-css-reset .-cbwsdk-extension-dialog-box-top-description-text{margin-left:16px;flex-grow:1;font-size:13px;line-height:19px;align-self:center}.-cbwsdk-css-reset .-cbwsdk-extension-dialog-box-top-description-text.light{color:#000}.-cbwsdk-css-reset .-cbwsdk-extension-dialog-box-top-description-text.dark{color:#fff}.-cbwsdk-css-reset .-cbwsdk-extension-dialog-box-bottom{display:flex;flex-direction:row;overflow:hidden;border-radius:8px;margin-top:8px}.-cbwsdk-css-reset .-cbwsdk-extension-dialog-box-bottom.light{background-color:#fff}.-cbwsdk-css-reset .-cbwsdk-extension-dialog-box-bottom.dark{background-color:#000;box-shadow:0 4px 16px rgba(255,255,255,.05)}.-cbwsdk-css-reset .-cbwsdk-extension-dialog-box-bottom-description-region{display:flex;flex-direction:column;justify-content:center;padding:32px;flex-grow:1}.-cbwsdk-css-reset .-cbwsdk-extension-dialog-box-bottom-description{font-size:13px;line-height:19px;margin-top:12px;color:#aaa}.-cbwsdk-css-reset .-cbwsdk-extension-dialog-box-bottom-description.dark{color:#fff}.-cbwsdk-css-reset .-cbwsdk-extension-dialog-box-bottom-description.dark a{color:#3773f5}.-cbwsdk-css-reset .-cbwsdk-extension-dialog-box-bottom-description a{font-size:inherit;line-height:inherit;color:#1652f0;cursor:pointer}.-cbwsdk-css-reset .-cbwsdk-extension-dialog-box-bottom-qr-region{position:relative;flex-shrink:0;display:flex;flex-direction:column;justify-content:center;padding-left:24px;padding-right:24px;padding-top:16px;padding-bottom:16px}.-cbwsdk-css-reset .-cbwsdk-extension-dialog-box-bottom-qr-wrapper{position:relative;display:block;padding:8px;border-radius:8px;box-shadow:0px 4px 12px rgba(0,0,0,.1);background-color:#fff}.-cbwsdk-css-reset .-cbwsdk-extension-dialog-box-bottom-qr-wrapper img{display:block}.-cbwsdk-css-reset .-cbwsdk-extension-dialog-box-bottom-qr-connecting{position:absolute;top:0;bottom:0;left:0;right:0;display:flex;flex-direction:column;align-items:center;justify-content:center}.-cbwsdk-css-reset .-cbwsdk-extension-dialog-box-bottom-qr-connecting.light{background-color:rgba(255,255,255,.95)}.-cbwsdk-css-reset .-cbwsdk-extension-dialog-box-bottom-qr-connecting.light>p{color:#000}.-cbwsdk-css-reset .-cbwsdk-extension-dialog-box-bottom-qr-connecting.dark{background-color:rgba(20,21,25,.9)}.-cbwsdk-css-reset .-cbwsdk-extension-dialog-box-bottom-qr-connecting.dark>p{color:#fff}.-cbwsdk-css-reset .-cbwsdk-extension-dialog-box-bottom-qr-connecting>p{font-size:12px;font-weight:bold;margin-top:16px}.-cbwsdk-css-reset .-cbwsdk-extension-dialog-box-cancel{position:absolute;-webkit-appearance:none;display:flex;align-items:center;justify-content:center;top:16px;right:16px;width:24px;height:24px;border-radius:12px;cursor:pointer}.-cbwsdk-css-reset .-cbwsdk-extension-dialog-box-cancel.light{background-color:#fafbfc}.-cbwsdk-css-reset .-cbwsdk-extension-dialog-box-cancel.dark{background-color:#141519}.-cbwsdk-css-reset .-cbwsdk-extension-dialog-box-cancel-x{position:relative;display:block;cursor:pointer}.-cbwsdk-css-reset .-cbwsdk-extension-dialog-box-cancel-x.light::before,.-cbwsdk-css-reset .-cbwsdk-extension-dialog-box-cancel-x.light::after{background-color:#000}.-cbwsdk-css-reset .-cbwsdk-extension-dialog-box-cancel-x.dark::before,.-cbwsdk-css-reset .-cbwsdk-extension-dialog-box-cancel-x.dark::after{background-color:#fff}.-cbwsdk-css-reset .-cbwsdk-extension-dialog-box-cancel-x::before,.-cbwsdk-css-reset .-cbwsdk-extension-dialog-box-cancel-x::after{content:"";position:absolute;display:block;top:-1px;left:-7px;width:14px;height:1px;transition:background-color .2s}.-cbwsdk-css-reset .-cbwsdk-extension-dialog-box-cancel-x::before{transform:rotate(45deg)}.-cbwsdk-css-reset .-cbwsdk-extension-dialog-box-cancel-x::after{transform:rotate(135deg)}.-cbwsdk-css-reset .-cbwsdk-extension-dialog-box-cancel:hover .-cbwsdk-link-dialog-box-cancel-x-a,.-cbwsdk-css-reset .-cbwsdk-extension-dialog-box-cancel:hover .-cbwsdk-link-dialog-box-cancel-x-b{background-color:#000}.-cbwsdk-css-reset .-cbwsdk-extension-dialog-container{display:block}.-cbwsdk-css-reset .-cbwsdk-extension-dialog-container-hidden{display:none}.-cbwsdk-css-reset .-cbwsdk-extension-dialog h2{display:block;text-align:left;font-size:22px;font-weight:600;line-height:28px}.-cbwsdk-css-reset .-cbwsdk-extension-dialog h2.light{color:#000}.-cbwsdk-css-reset .-cbwsdk-extension-dialog h2.dark{color:#fff}`;
var __importDefault$2 = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(TryExtensionLinkDialog$1, "__esModule", { value: true });
TryExtensionLinkDialog$1.TryExtensionLinkDialog = void 0;
const clsx_1 = __importDefault$2(require$$0);
const preact_1$1 = require$$1;
const hooks_1 = require$$2;
const util_1$4 = util$4;
const version_1 = version$1;
const globe_icon_svg_1 = __importDefault$2(globeIconSvg);
const link_icon_svg_1 = __importDefault$2(linkIconSvg);
const lock_icon_svg_1 = __importDefault$2(lockIconSvg);
const QRLogo_1 = __importDefault$2(QRLogo);
const QRCode_1 = QRCode$2;
const Spinner_1 = Spinner$1;
const TryExtensionLinkDialog_css_1 = __importDefault$2(TryExtensionLinkDialogCss);
const TryExtensionLinkDialog = (props) => {
  const { isOpen, darkMode } = props;
  const [isContainerHidden, setContainerHidden] = (0, hooks_1.useState)(!isOpen);
  const [isDialogHidden, setDialogHidden] = (0, hooks_1.useState)(!isOpen);
  (0, hooks_1.useEffect)(() => {
    const timers = [
      window.setTimeout(() => {
        setDialogHidden(!isOpen);
      }, 10)
    ];
    if (isOpen) {
      setContainerHidden(false);
    } else {
      timers.push(window.setTimeout(() => {
        setContainerHidden(true);
      }, 360));
    }
    return () => {
      timers.forEach(window.clearTimeout);
    };
  }, [props.isOpen]);
  const theme = darkMode ? "dark" : "light";
  return (0, preact_1$1.h)(
    "div",
    { class: (0, clsx_1.default)("-cbwsdk-extension-dialog-container", isContainerHidden && "-cbwsdk-extension-dialog-container-hidden") },
    (0, preact_1$1.h)("style", null, TryExtensionLinkDialog_css_1.default),
    (0, preact_1$1.h)("div", { class: (0, clsx_1.default)("-cbwsdk-extension-dialog-backdrop", theme, isDialogHidden && "-cbwsdk-extension-dialog-backdrop-hidden") }),
    (0, preact_1$1.h)(
      "div",
      { class: "-cbwsdk-extension-dialog" },
      (0, preact_1$1.h)(
        "div",
        { class: (0, clsx_1.default)("-cbwsdk-extension-dialog-box", isDialogHidden && "-cbwsdk-extension-dialog-box-hidden") },
        (0, preact_1$1.h)(TryExtensionBox, { darkMode, onInstallClick: () => {
          window.open("https://api.wallet.coinbase.com/rpc/v2/desktop/chrome", "_blank");
        } }),
        !props.connectDisabled ? (0, preact_1$1.h)(ScanQRBox, { darkMode, version: props.version, sessionId: props.sessionId, sessionSecret: props.sessionSecret, linkAPIUrl: props.linkAPIUrl, isConnected: props.isConnected, isParentConnection: props.isParentConnection, chainId: props.chainId }) : null,
        props.onCancel && (0, preact_1$1.h)(CancelButton, { darkMode, onClick: props.onCancel })
      )
    )
  );
};
TryExtensionLinkDialog$1.TryExtensionLinkDialog = TryExtensionLinkDialog;
const TryExtensionBox = ({ darkMode, onInstallClick }) => {
  const [isClicked, setIsClicked] = (0, hooks_1.useState)(false);
  const clickHandler = (0, hooks_1.useCallback)(() => {
    if (isClicked) {
      window.location.reload();
    } else {
      onInstallClick();
      setIsClicked(true);
    }
  }, [onInstallClick, isClicked]);
  const theme = darkMode ? "dark" : "light";
  return (0, preact_1$1.h)(
    "div",
    { class: (0, clsx_1.default)("-cbwsdk-extension-dialog-box-top", theme) },
    (0, preact_1$1.h)(
      "div",
      { class: "-cbwsdk-extension-dialog-box-top-install-region" },
      (0, preact_1$1.h)("h2", { class: theme }, "Try the Coinbase Wallet extension"),
      isClicked && (0, preact_1$1.h)("div", { class: "-cbwsdk-extension-dialog-box-top-subtext" }, "After installing Coinbase Wallet, refresh the page and connect again."),
      (0, preact_1$1.h)("button", { type: "button", onClick: clickHandler }, isClicked ? "Refresh" : "Install")
    ),
    (0, preact_1$1.h)(
      "div",
      { class: (0, clsx_1.default)("-cbwsdk-extension-dialog-box-top-info-region", theme) },
      (0, preact_1$1.h)(DescriptionItem, { darkMode, icon: link_icon_svg_1.default, text: "Connect to crypto apps with one click" }),
      (0, preact_1$1.h)(DescriptionItem, { darkMode, icon: lock_icon_svg_1.default, text: "Your private key is stored securely" }),
      (0, preact_1$1.h)(DescriptionItem, { darkMode, icon: globe_icon_svg_1.default, text: "Works with Ethereum, Polygon, and more" })
    )
  );
};
const ScanQRBox = (props) => {
  const qrUrl = (0, util_1$4.createQrUrl)(props.sessionId, props.sessionSecret, props.linkAPIUrl, props.isParentConnection, props.version, props.chainId);
  const theme = props.darkMode ? "dark" : "light";
  return (0, preact_1$1.h)(
    "div",
    { "data-testid": "scan-qr-box", class: (0, clsx_1.default)(`-cbwsdk-extension-dialog-box-bottom`, theme) },
    (0, preact_1$1.h)(
      "div",
      { class: `-cbwsdk-extension-dialog-box-bottom-description-region` },
      (0, preact_1$1.h)("h2", { class: theme }, "Or scan to connect"),
      (0, preact_1$1.h)(
        "body",
        { class: (0, clsx_1.default)(`-cbwsdk-extension-dialog-box-bottom-description`, theme) },
        "Open",
        " ",
        (0, preact_1$1.h)("a", { href: "https://wallet.coinbase.com/", target: "_blank", rel: "noopener noreferrer" }, "Coinbase Wallet"),
        " ",
        "on your mobile phone and scan"
      )
    ),
    (0, preact_1$1.h)(
      "div",
      { class: "-cbwsdk-extension-dialog-box-bottom-qr-region" },
      (0, preact_1$1.h)(
        "div",
        { class: "-cbwsdk-extension-dialog-box-bottom-qr-wrapper" },
        (0, preact_1$1.h)(QRCode_1.QRCode, { content: qrUrl, width: 150, height: 150, fgColor: "#000", bgColor: "transparent", image: {
          svg: QRLogo_1.default,
          width: 34,
          height: 34
        } })
      ),
      (0, preact_1$1.h)("input", { type: "hidden", name: "cbwsdk-version", value: version_1.LIB_VERSION }),
      (0, preact_1$1.h)("input", { type: "hidden", value: qrUrl }),
      !props.isConnected && (0, preact_1$1.h)(
        "div",
        { "data-testid": "connecting-spinner", class: (0, clsx_1.default)("-cbwsdk-extension-dialog-box-bottom-qr-connecting", theme) },
        (0, preact_1$1.h)(Spinner_1.Spinner, { size: 36, color: props.darkMode ? "#FFF" : "#000" }),
        (0, preact_1$1.h)("p", null, "Connecting...")
      )
    )
  );
};
const DescriptionItem = (props) => {
  const theme = props.darkMode ? "dark" : "light";
  return (0, preact_1$1.h)(
    "div",
    { class: "-cbwsdk-extension-dialog-box-top-description" },
    (0, preact_1$1.h)(
      "div",
      { class: "-cbwsdk-extension-dialog-box-top-description-icon-wrapper" },
      (0, preact_1$1.h)("img", { src: props.icon })
    ),
    (0, preact_1$1.h)("body", { class: (0, clsx_1.default)("-cbwsdk-extension-dialog-box-top-description-text", theme) }, props.text)
  );
};
const CancelButton = (props) => {
  const theme = props.darkMode ? "dark" : "light";
  return (0, preact_1$1.h)(
    "button",
    { type: "button", class: (0, clsx_1.default)("-cbwsdk-extension-dialog-box-cancel", theme), onClick: props.onClick },
    (0, preact_1$1.h)("div", { class: (0, clsx_1.default)("-cbwsdk-extension-dialog-box-cancel-x", theme) })
  );
};
Object.defineProperty(LinkFlow$1, "__esModule", { value: true });
LinkFlow$1.LinkFlow = void 0;
const preact_1 = require$$1;
const rxjs_1$3 = require$$2$1;
const TryExtensionLinkDialog_1 = TryExtensionLinkDialog$1;
class LinkFlow {
  constructor(options) {
    this.extensionUI$ = new rxjs_1$3.BehaviorSubject({});
    this.subscriptions = new rxjs_1$3.Subscription();
    this.isConnected = false;
    this.chainId = 1;
    this.isOpen = false;
    this.onCancel = null;
    this.root = null;
    this.connectDisabled = false;
    this.darkMode = options.darkMode;
    this.version = options.version;
    this.sessionId = options.sessionId;
    this.sessionSecret = options.sessionSecret;
    this.linkAPIUrl = options.linkAPIUrl;
    this.isParentConnection = options.isParentConnection;
    this.connected$ = options.connected$;
    this.chainId$ = options.chainId$;
  }
  attach(el) {
    this.root = document.createElement("div");
    this.root.className = "-cbwsdk-link-flow-root";
    el.appendChild(this.root);
    this.render();
    this.subscriptions.add(this.connected$.subscribe((v2) => {
      if (this.isConnected !== v2) {
        this.isConnected = v2;
        this.render();
      }
    }));
    this.subscriptions.add(this.chainId$.subscribe((chainId) => {
      if (this.chainId !== chainId) {
        this.chainId = chainId;
        this.render();
      }
    }));
  }
  detach() {
    var _a;
    if (!this.root) {
      return;
    }
    this.subscriptions.unsubscribe();
    (0, preact_1.render)(null, this.root);
    (_a = this.root.parentElement) === null || _a === void 0 ? void 0 : _a.removeChild(this.root);
  }
  setConnectDisabled(connectDisabled) {
    this.connectDisabled = connectDisabled;
  }
  open(options) {
    this.isOpen = true;
    this.onCancel = options.onCancel;
    this.render();
  }
  close() {
    this.isOpen = false;
    this.onCancel = null;
    this.render();
  }
  render() {
    if (!this.root) {
      return;
    }
    const subscription = this.extensionUI$.subscribe(() => {
      if (!this.root) {
        return;
      }
      (0, preact_1.render)((0, preact_1.h)(TryExtensionLinkDialog_1.TryExtensionLinkDialog, { darkMode: this.darkMode, version: this.version, sessionId: this.sessionId, sessionSecret: this.sessionSecret, linkAPIUrl: this.linkAPIUrl, isOpen: this.isOpen, isConnected: this.isConnected, isParentConnection: this.isParentConnection, chainId: this.chainId, onCancel: this.onCancel, connectDisabled: this.connectDisabled }), this.root);
    });
    this.subscriptions.add(subscription);
  }
}
LinkFlow$1.LinkFlow = LinkFlow;
var Snackbar = {};
var SnackbarCss = {};
Object.defineProperty(SnackbarCss, "__esModule", { value: true });
SnackbarCss.default = `.-cbwsdk-css-reset .-gear-container{margin-left:16px !important;margin-right:9px !important;display:flex;align-items:center;justify-content:center;width:24px;height:24px;transition:opacity .25s}.-cbwsdk-css-reset .-gear-container *{user-select:none}.-cbwsdk-css-reset .-gear-container svg{opacity:0;position:absolute}.-cbwsdk-css-reset .-gear-icon{height:12px;width:12px;z-index:10000}.-cbwsdk-css-reset .-cbwsdk-snackbar{align-items:flex-end;display:flex;flex-direction:column;position:fixed;right:0;top:0;z-index:2147483647}.-cbwsdk-css-reset .-cbwsdk-snackbar *{user-select:none}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance{display:flex;flex-direction:column;margin:8px 16px 0 16px;overflow:visible;text-align:left;transform:translateX(0);transition:opacity .25s,transform .25s}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-header:hover .-gear-container svg{opacity:1}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-header{display:flex;align-items:center;background:#fff;overflow:hidden;border:1px solid #e7ebee;box-sizing:border-box;border-radius:8px;cursor:pointer}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-header-cblogo{margin:8px 8px 8px 8px}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-header *{cursor:pointer}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-header-message{color:#000;font-size:13px;line-height:1.5;user-select:none}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-menu{background:#fff;transition:opacity .25s ease-in-out,transform .25s linear,visibility 0s;visibility:hidden;border:1px solid #e7ebee;box-sizing:border-box;border-radius:8px;opacity:0;flex-direction:column;padding-left:8px;padding-right:8px}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-menu-item:last-child{margin-bottom:8px !important}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-menu-item:hover{background:#f5f7f8;border-radius:6px;transition:background .25s}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-menu-item:hover span{color:#050f19;transition:color .25s}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-menu-item:hover svg path{fill:#000;transition:fill .25s}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-menu-item{visibility:inherit;height:35px;margin-top:8px;margin-bottom:0;display:flex;flex-direction:row;align-items:center;padding:8px;cursor:pointer}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-menu-item *{visibility:inherit;cursor:pointer}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-menu-item-is-red:hover{background:rgba(223,95,103,.2);transition:background .25s}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-menu-item-is-red:hover *{cursor:pointer}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-menu-item-is-red:hover svg path{fill:#df5f67;transition:fill .25s}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-menu-item-is-red:hover span{color:#df5f67;transition:color .25s}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-menu-item-info{color:#aaa;font-size:13px;margin:0 8px 0 32px;position:absolute}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-hidden{opacity:0;text-align:left;transform:translateX(25%);transition:opacity .5s linear}.-cbwsdk-css-reset .-cbwsdk-snackbar-instance-expanded .-cbwsdk-snackbar-instance-menu{opacity:1;display:flex;transform:translateY(8px);visibility:visible}`;
(function(exports) {
  var __importDefault2 = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.SnackbarInstance = exports.SnackbarContainer = exports.Snackbar = void 0;
  const clsx_12 = __importDefault2(require$$0);
  const preact_12 = require$$1;
  const hooks_12 = require$$2;
  const Snackbar_css_1 = __importDefault2(SnackbarCss);
  const cblogo = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEuNDkyIDEwLjQxOWE4LjkzIDguOTMgMCAwMTguOTMtOC45M2gxMS4xNjNhOC45MyA4LjkzIDAgMDE4LjkzIDguOTN2MTEuMTYzYTguOTMgOC45MyAwIDAxLTguOTMgOC45M0gxMC40MjJhOC45MyA4LjkzIDAgMDEtOC45My04LjkzVjEwLjQxOXoiIGZpbGw9IiMxNjUyRjAiLz48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEwLjQxOSAwSDIxLjU4QzI3LjMzNSAwIDMyIDQuNjY1IDMyIDEwLjQxOVYyMS41OEMzMiAyNy4zMzUgMjcuMzM1IDMyIDIxLjU4MSAzMkgxMC40MkM0LjY2NSAzMiAwIDI3LjMzNSAwIDIxLjU4MVYxMC40MkMwIDQuNjY1IDQuNjY1IDAgMTAuNDE5IDB6bTAgMS40ODhhOC45MyA4LjkzIDAgMDAtOC45MyA4LjkzdjExLjE2M2E4LjkzIDguOTMgMCAwMDguOTMgOC45M0gyMS41OGE4LjkzIDguOTMgMCAwMDguOTMtOC45M1YxMC40MmE4LjkzIDguOTMgMCAwMC04LjkzLTguOTNIMTAuNDJ6IiBmaWxsPSIjZmZmIi8+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNS45OTggMjYuMDQ5Yy01LjU0OSAwLTEwLjA0Ny00LjQ5OC0xMC4wNDctMTAuMDQ3IDAtNS41NDggNC40OTgtMTAuMDQ2IDEwLjA0Ny0xMC4wNDYgNS41NDggMCAxMC4wNDYgNC40OTggMTAuMDQ2IDEwLjA0NiAwIDUuNTQ5LTQuNDk4IDEwLjA0Ny0xMC4wNDYgMTAuMDQ3eiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0xMi43NjIgMTQuMjU0YzAtLjgyMi42NjctMS40ODkgMS40ODktMS40ODloMy40OTdjLjgyMiAwIDEuNDg4LjY2NiAxLjQ4OCAxLjQ4OXYzLjQ5N2MwIC44MjItLjY2NiAxLjQ4OC0xLjQ4OCAxLjQ4OGgtMy40OTdhMS40ODggMS40ODggMCAwMS0xLjQ4OS0xLjQ4OHYtMy40OTh6IiBmaWxsPSIjMTY1MkYwIi8+PC9zdmc+`;
  const gearIcon = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEyIDYuNzV2LTEuNWwtMS43Mi0uNTdjLS4wOC0uMjctLjE5LS41Mi0uMzItLjc3bC44MS0xLjYyLTEuMDYtMS4wNi0xLjYyLjgxYy0uMjQtLjEzLS41LS4yNC0uNzctLjMyTDYuNzUgMGgtMS41bC0uNTcgMS43MmMtLjI3LjA4LS41My4xOS0uNzcuMzJsLTEuNjItLjgxLTEuMDYgMS4wNi44MSAxLjYyYy0uMTMuMjQtLjI0LjUtLjMyLjc3TDAgNS4yNXYxLjVsMS43Mi41N2MuMDguMjcuMTkuNTMuMzIuNzdsLS44MSAxLjYyIDEuMDYgMS4wNiAxLjYyLS44MWMuMjQuMTMuNS4yMy43Ny4zMkw1LjI1IDEyaDEuNWwuNTctMS43MmMuMjctLjA4LjUyLS4xOS43Ny0uMzJsMS42Mi44MSAxLjA2LTEuMDYtLjgxLTEuNjJjLjEzLS4yNC4yMy0uNS4zMi0uNzdMMTIgNi43NXpNNiA4LjVhMi41IDIuNSAwIDAxMC01IDIuNSAyLjUgMCAwMTAgNXoiIGZpbGw9IiMwNTBGMTkiLz48L3N2Zz4=`;
  class Snackbar2 {
    constructor(options) {
      this.items = /* @__PURE__ */ new Map();
      this.nextItemKey = 0;
      this.root = null;
      this.darkMode = options.darkMode;
    }
    attach(el) {
      this.root = document.createElement("div");
      this.root.className = "-cbwsdk-snackbar-root";
      el.appendChild(this.root);
      this.render();
    }
    presentItem(itemProps) {
      const key = this.nextItemKey++;
      this.items.set(key, itemProps);
      this.render();
      return () => {
        this.items.delete(key);
        this.render();
      };
    }
    clear() {
      this.items.clear();
      this.render();
    }
    render() {
      if (!this.root) {
        return;
      }
      (0, preact_12.render)((0, preact_12.h)(
        "div",
        null,
        (0, preact_12.h)(exports.SnackbarContainer, { darkMode: this.darkMode }, Array.from(this.items.entries()).map(([key, itemProps]) => (0, preact_12.h)(exports.SnackbarInstance, Object.assign({}, itemProps, { key }))))
      ), this.root);
    }
  }
  exports.Snackbar = Snackbar2;
  const SnackbarContainer = (props) => (0, preact_12.h)(
    "div",
    { class: (0, clsx_12.default)("-cbwsdk-snackbar-container") },
    (0, preact_12.h)("style", null, Snackbar_css_1.default),
    (0, preact_12.h)("div", { class: "-cbwsdk-snackbar" }, props.children)
  );
  exports.SnackbarContainer = SnackbarContainer;
  const SnackbarInstance = ({ autoExpand, message, menuItems }) => {
    const [hidden, setHidden] = (0, hooks_12.useState)(true);
    const [expanded, setExpanded] = (0, hooks_12.useState)(autoExpand !== null && autoExpand !== void 0 ? autoExpand : false);
    (0, hooks_12.useEffect)(() => {
      const timers = [
        window.setTimeout(() => {
          setHidden(false);
        }, 1),
        window.setTimeout(() => {
          setExpanded(true);
        }, 1e4)
      ];
      return () => {
        timers.forEach(window.clearTimeout);
      };
    });
    const toggleExpanded = () => {
      setExpanded(!expanded);
    };
    return (0, preact_12.h)(
      "div",
      { class: (0, clsx_12.default)("-cbwsdk-snackbar-instance", hidden && "-cbwsdk-snackbar-instance-hidden", expanded && "-cbwsdk-snackbar-instance-expanded") },
      (0, preact_12.h)(
        "div",
        { class: "-cbwsdk-snackbar-instance-header", onClick: toggleExpanded },
        (0, preact_12.h)("img", { src: cblogo, class: "-cbwsdk-snackbar-instance-header-cblogo" }),
        (0, preact_12.h)("div", { class: "-cbwsdk-snackbar-instance-header-message" }, message),
        (0, preact_12.h)(
          "div",
          { class: "-gear-container" },
          !expanded && (0, preact_12.h)(
            "svg",
            { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
            (0, preact_12.h)("circle", { cx: "12", cy: "12", r: "12", fill: "#F5F7F8" })
          ),
          (0, preact_12.h)("img", { src: gearIcon, class: "-gear-icon", title: "Expand" })
        )
      ),
      menuItems && menuItems.length > 0 && (0, preact_12.h)("div", { class: "-cbwsdk-snackbar-instance-menu" }, menuItems.map((action, i) => (0, preact_12.h)(
        "div",
        { class: (0, clsx_12.default)("-cbwsdk-snackbar-instance-menu-item", action.isRed && "-cbwsdk-snackbar-instance-menu-item-is-red"), onClick: action.onClick, key: i },
        (0, preact_12.h)(
          "svg",
          { width: action.svgWidth, height: action.svgHeight, viewBox: "0 0 10 11", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
          (0, preact_12.h)("path", { "fill-rule": action.defaultFillRule, "clip-rule": action.defaultClipRule, d: action.path, fill: "#AAAAAA" })
        ),
        (0, preact_12.h)("span", { class: (0, clsx_12.default)("-cbwsdk-snackbar-instance-menu-item-info", action.isRed && "-cbwsdk-snackbar-instance-menu-item-info-is-red") }, action.info)
      )))
    );
  };
  exports.SnackbarInstance = SnackbarInstance;
})(Snackbar);
var cssReset = {};
var cssResetCss = {};
Object.defineProperty(cssResetCss, "__esModule", { value: true });
cssResetCss.default = `@namespace svg "http://www.w3.org/2000/svg";.-cbwsdk-css-reset,.-cbwsdk-css-reset *{animation:none;animation-delay:0;animation-direction:normal;animation-duration:0;animation-fill-mode:none;animation-iteration-count:1;animation-name:none;animation-play-state:running;animation-timing-function:ease;backface-visibility:visible;background:0;background-attachment:scroll;background-clip:border-box;background-color:rgba(0,0,0,0);background-image:none;background-origin:padding-box;background-position:0 0;background-position-x:0;background-position-y:0;background-repeat:repeat;background-size:auto auto;border:0;border-style:none;border-width:medium;border-color:inherit;border-bottom:0;border-bottom-color:inherit;border-bottom-left-radius:0;border-bottom-right-radius:0;border-bottom-style:none;border-bottom-width:medium;border-collapse:separate;border-image:none;border-left:0;border-left-color:inherit;border-left-style:none;border-left-width:medium;border-radius:0;border-right:0;border-right-color:inherit;border-right-style:none;border-right-width:medium;border-spacing:0;border-top:0;border-top-color:inherit;border-top-left-radius:0;border-top-right-radius:0;border-top-style:none;border-top-width:medium;bottom:auto;box-shadow:none;box-sizing:border-box;caption-side:top;clear:none;clip:auto;color:inherit;columns:auto;column-count:auto;column-fill:balance;column-gap:normal;column-rule:medium none currentColor;column-rule-color:currentColor;column-rule-style:none;column-rule-width:none;column-span:1;column-width:auto;content:normal;counter-increment:none;counter-reset:none;cursor:auto;direction:ltr;display:block;empty-cells:show;float:none;font:normal;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Helvetica Neue",Arial,sans-serif;font-size:medium;font-style:normal;font-variant:normal;font-weight:normal;height:auto;hyphens:none;left:auto;letter-spacing:normal;line-height:normal;list-style:none;list-style-image:none;list-style-position:outside;list-style-type:disc;margin:0;margin-bottom:0;margin-left:0;margin-right:0;margin-top:0;max-height:none;max-width:none;min-height:0;min-width:0;opacity:1;orphans:0;outline:0;outline-color:invert;outline-style:none;outline-width:medium;overflow:visible;overflow-x:visible;overflow-y:visible;padding:0;padding-bottom:0;padding-left:0;padding-right:0;padding-top:0;page-break-after:auto;page-break-before:auto;page-break-inside:auto;perspective:none;perspective-origin:50% 50%;pointer-events:auto;position:static;quotes:"\\201C" "\\201D" "\\2018" "\\2019";right:auto;tab-size:8;table-layout:auto;text-align:inherit;text-align-last:auto;text-decoration:none;text-decoration-color:inherit;text-decoration-line:none;text-decoration-style:solid;text-indent:0;text-shadow:none;text-transform:none;top:auto;transform:none;transform-style:flat;transition:none;transition-delay:0s;transition-duration:0s;transition-property:none;transition-timing-function:ease;unicode-bidi:normal;vertical-align:baseline;visibility:visible;white-space:normal;widows:0;width:auto;word-spacing:normal;z-index:auto}.-cbwsdk-css-reset *{box-sizing:border-box;display:initial;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Helvetica Neue",Arial,sans-serif;line-height:1}.-cbwsdk-css-reset [class*=container]{margin:0;padding:0}.-cbwsdk-css-reset style{display:none}`;
var __importDefault$1 = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(cssReset, "__esModule", { value: true });
cssReset.injectCssReset = void 0;
const cssReset_css_1 = __importDefault$1(cssResetCss);
function injectCssReset() {
  const styleEl = document.createElement("style");
  styleEl.type = "text/css";
  styleEl.appendChild(document.createTextNode(cssReset_css_1.default));
  document.documentElement.appendChild(styleEl);
}
cssReset.injectCssReset = injectCssReset;
Object.defineProperty(WalletSDKUI$1, "__esModule", { value: true });
WalletSDKUI$1.WalletSDKUI = void 0;
const LinkFlow_1 = LinkFlow$1;
const Snackbar_1 = Snackbar;
const cssReset_1 = cssReset;
class WalletSDKUI {
  constructor(options) {
    this.standalone = null;
    this.attached = false;
    this.snackbar = new Snackbar_1.Snackbar({
      darkMode: options.darkMode
    });
    this.linkFlow = new LinkFlow_1.LinkFlow({
      darkMode: options.darkMode,
      version: options.version,
      sessionId: options.session.id,
      sessionSecret: options.session.secret,
      linkAPIUrl: options.linkAPIUrl,
      connected$: options.connected$,
      chainId$: options.chainId$,
      isParentConnection: false
    });
  }
  attach() {
    if (this.attached) {
      throw new Error("Coinbase Wallet SDK UI is already attached");
    }
    const el = document.documentElement;
    const container = document.createElement("div");
    container.className = "-cbwsdk-css-reset";
    el.appendChild(container);
    this.linkFlow.attach(container);
    this.snackbar.attach(container);
    this.attached = true;
    (0, cssReset_1.injectCssReset)();
  }
  setConnectDisabled(connectDisabled) {
    this.linkFlow.setConnectDisabled(connectDisabled);
  }
  addEthereumChain(_options) {
  }
  watchAsset(_options) {
  }
  switchEthereumChain(_options) {
  }
  requestEthereumAccounts(options) {
    this.linkFlow.open({ onCancel: options.onCancel });
  }
  hideRequestEthereumAccounts() {
    this.linkFlow.close();
  }
  signEthereumMessage(_2) {
  }
  signEthereumTransaction(_2) {
  }
  submitEthereumTransaction(_2) {
  }
  ethereumAddressFromSignedMessage(_2) {
  }
  showConnecting(options) {
    let snackbarProps;
    if (options.isUnlinkedErrorState) {
      snackbarProps = {
        autoExpand: true,
        message: "Connection lost",
        menuItems: [
          {
            isRed: false,
            info: "Reset connection",
            svgWidth: "10",
            svgHeight: "11",
            path: "M5.00008 0.96875C6.73133 0.96875 8.23758 1.94375 9.00008 3.375L10.0001 2.375V5.5H9.53133H7.96883H6.87508L7.80633 4.56875C7.41258 3.3875 6.31258 2.53125 5.00008 2.53125C3.76258 2.53125 2.70633 3.2875 2.25633 4.36875L0.812576 3.76875C1.50008 2.125 3.11258 0.96875 5.00008 0.96875ZM2.19375 6.43125C2.5875 7.6125 3.6875 8.46875 5 8.46875C6.2375 8.46875 7.29375 7.7125 7.74375 6.63125L9.1875 7.23125C8.5 8.875 6.8875 10.0312 5 10.0312C3.26875 10.0312 1.7625 9.05625 1 7.625L0 8.625V5.5H0.46875H2.03125H3.125L2.19375 6.43125Z",
            defaultFillRule: "evenodd",
            defaultClipRule: "evenodd",
            onClick: options.onResetConnection
          }
        ]
      };
    } else {
      snackbarProps = {
        message: "Confirm on phone",
        menuItems: [
          {
            isRed: true,
            info: "Cancel transaction",
            svgWidth: "11",
            svgHeight: "11",
            path: "M10.3711 1.52346L9.21775 0.370117L5.37109 4.21022L1.52444 0.370117L0.371094 1.52346L4.2112 5.37012L0.371094 9.21677L1.52444 10.3701L5.37109 6.53001L9.21775 10.3701L10.3711 9.21677L6.53099 5.37012L10.3711 1.52346Z",
            defaultFillRule: "inherit",
            defaultClipRule: "inherit",
            onClick: options.onCancel
          },
          {
            isRed: false,
            info: "Reset connection",
            svgWidth: "10",
            svgHeight: "11",
            path: "M5.00008 0.96875C6.73133 0.96875 8.23758 1.94375 9.00008 3.375L10.0001 2.375V5.5H9.53133H7.96883H6.87508L7.80633 4.56875C7.41258 3.3875 6.31258 2.53125 5.00008 2.53125C3.76258 2.53125 2.70633 3.2875 2.25633 4.36875L0.812576 3.76875C1.50008 2.125 3.11258 0.96875 5.00008 0.96875ZM2.19375 6.43125C2.5875 7.6125 3.6875 8.46875 5 8.46875C6.2375 8.46875 7.29375 7.7125 7.74375 6.63125L9.1875 7.23125C8.5 8.875 6.8875 10.0312 5 10.0312C3.26875 10.0312 1.7625 9.05625 1 7.625L0 8.625V5.5H0.46875H2.03125H3.125L2.19375 6.43125Z",
            defaultFillRule: "evenodd",
            defaultClipRule: "evenodd",
            onClick: options.onResetConnection
          }
        ]
      };
    }
    return this.snackbar.presentItem(snackbarProps);
  }
  reloadUI() {
    document.location.reload();
  }
  inlineAccountsResponse() {
    return false;
  }
  inlineAddEthereumChain(_chainId) {
    return false;
  }
  inlineWatchAsset() {
    return false;
  }
  inlineSwitchEthereumChain() {
    return false;
  }
  setStandalone(status) {
    this.standalone = status;
  }
  isStandalone() {
    var _a;
    return (_a = this.standalone) !== null && _a !== void 0 ? _a : false;
  }
}
WalletSDKUI$1.WalletSDKUI = WalletSDKUI;
var WalletSDKRelay$1 = {};
var bindDecorator = {};
Object.defineProperty(bindDecorator, "__esModule", { value: true });
var constants;
(function(constants2) {
  constants2.typeOfFunction = "function";
  constants2.boolTrue = true;
})(constants || (constants = {}));
function bind(target, propertyKey, descriptor) {
  if (!descriptor || typeof descriptor.value !== constants.typeOfFunction) {
    throw new TypeError("Only methods can be decorated with @bind. <" + propertyKey + "> is not a method!");
  }
  return {
    configurable: constants.boolTrue,
    get: function() {
      var bound = descriptor.value.bind(this);
      Object.defineProperty(this, propertyKey, {
        value: bound,
        configurable: constants.boolTrue,
        writable: constants.boolTrue
      });
      return bound;
    }
  };
}
bindDecorator.bind = bind;
bindDecorator.default = bind;
var WalletSDKConnection$1 = {};
var ClientMessage = {};
Object.defineProperty(ClientMessage, "__esModule", { value: true });
ClientMessage.ClientMessagePublishEvent = ClientMessage.ClientMessageSetSessionConfig = ClientMessage.ClientMessageGetSessionConfig = ClientMessage.ClientMessageIsLinked = ClientMessage.ClientMessageHostSession = void 0;
function ClientMessageHostSession(params) {
  return Object.assign({ type: "HostSession" }, params);
}
ClientMessage.ClientMessageHostSession = ClientMessageHostSession;
function ClientMessageIsLinked(params) {
  return Object.assign({ type: "IsLinked" }, params);
}
ClientMessage.ClientMessageIsLinked = ClientMessageIsLinked;
function ClientMessageGetSessionConfig(params) {
  return Object.assign({ type: "GetSessionConfig" }, params);
}
ClientMessage.ClientMessageGetSessionConfig = ClientMessageGetSessionConfig;
function ClientMessageSetSessionConfig(params) {
  return Object.assign({ type: "SetSessionConfig" }, params);
}
ClientMessage.ClientMessageSetSessionConfig = ClientMessageSetSessionConfig;
function ClientMessagePublishEvent(params) {
  return Object.assign({ type: "PublishEvent" }, params);
}
ClientMessage.ClientMessagePublishEvent = ClientMessagePublishEvent;
var RxWebSocket = {};
(function(exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.RxWebSocket = exports.ConnectionState = void 0;
  const rxjs_12 = require$$2$1;
  const operators_12 = require$$3;
  var ConnectionState;
  (function(ConnectionState2) {
    ConnectionState2[ConnectionState2["DISCONNECTED"] = 0] = "DISCONNECTED";
    ConnectionState2[ConnectionState2["CONNECTING"] = 1] = "CONNECTING";
    ConnectionState2[ConnectionState2["CONNECTED"] = 2] = "CONNECTED";
  })(ConnectionState = exports.ConnectionState || (exports.ConnectionState = {}));
  class RxWebSocket2 {
    constructor(url, WebSocketClass = WebSocket) {
      this.WebSocketClass = WebSocketClass;
      this.webSocket = null;
      this.connectionStateSubject = new rxjs_12.BehaviorSubject(ConnectionState.DISCONNECTED);
      this.incomingDataSubject = new rxjs_12.Subject();
      this.url = url.replace(/^http/, "ws");
    }
    connect() {
      if (this.webSocket) {
        return (0, rxjs_12.throwError)(new Error("webSocket object is not null"));
      }
      return new rxjs_12.Observable((obs) => {
        let webSocket;
        try {
          this.webSocket = webSocket = new this.WebSocketClass(this.url);
        } catch (err) {
          obs.error(err);
          return;
        }
        this.connectionStateSubject.next(ConnectionState.CONNECTING);
        webSocket.onclose = (evt) => {
          this.clearWebSocket();
          obs.error(new Error(`websocket error ${evt.code}: ${evt.reason}`));
          this.connectionStateSubject.next(ConnectionState.DISCONNECTED);
        };
        webSocket.onopen = (_2) => {
          obs.next();
          obs.complete();
          this.connectionStateSubject.next(ConnectionState.CONNECTED);
        };
        webSocket.onmessage = (evt) => {
          this.incomingDataSubject.next(evt.data);
        };
      }).pipe((0, operators_12.take)(1));
    }
    disconnect() {
      const { webSocket } = this;
      if (!webSocket) {
        return;
      }
      this.clearWebSocket();
      this.connectionStateSubject.next(ConnectionState.DISCONNECTED);
      try {
        webSocket.close();
      } catch (_a) {
      }
    }
    get connectionState$() {
      return this.connectionStateSubject.asObservable();
    }
    get incomingData$() {
      return this.incomingDataSubject.asObservable();
    }
    get incomingJSONData$() {
      return this.incomingData$.pipe((0, operators_12.flatMap)((m2) => {
        let j2;
        try {
          j2 = JSON.parse(m2);
        } catch (err) {
          return (0, rxjs_12.empty)();
        }
        return (0, rxjs_12.of)(j2);
      }));
    }
    sendData(data) {
      const { webSocket } = this;
      if (!webSocket) {
        throw new Error("websocket is not connected");
      }
      webSocket.send(data);
    }
    clearWebSocket() {
      const { webSocket } = this;
      if (!webSocket) {
        return;
      }
      this.webSocket = null;
      webSocket.onclose = null;
      webSocket.onerror = null;
      webSocket.onmessage = null;
      webSocket.onopen = null;
    }
  }
  exports.RxWebSocket = RxWebSocket2;
})(RxWebSocket);
var ServerMessage = {};
Object.defineProperty(ServerMessage, "__esModule", { value: true });
ServerMessage.isServerMessageFail = void 0;
function isServerMessageFail(msg) {
  return msg && msg.type === "Fail" && typeof msg.id === "number" && typeof msg.sessionId === "string" && typeof msg.error === "string";
}
ServerMessage.isServerMessageFail = isServerMessageFail;
Object.defineProperty(WalletSDKConnection$1, "__esModule", { value: true });
WalletSDKConnection$1.WalletSDKConnection = void 0;
const rxjs_1$2 = require$$2$1;
const operators_1$1 = require$$3;
const Session_1$1 = Session$1;
const types_1$1 = types$1;
const ClientMessage_1 = ClientMessage;
const DiagnosticLogger_1$1 = DiagnosticLogger;
const RxWebSocket_1 = RxWebSocket;
const ServerMessage_1 = ServerMessage;
const HEARTBEAT_INTERVAL = 1e4;
const REQUEST_TIMEOUT = 6e4;
class WalletSDKConnection {
  constructor(sessionId, sessionKey, linkAPIUrl, diagnostic, WebSocketClass = WebSocket) {
    this.sessionId = sessionId;
    this.sessionKey = sessionKey;
    this.diagnostic = diagnostic;
    this.subscriptions = new rxjs_1$2.Subscription();
    this.destroyed = false;
    this.lastHeartbeatResponse = 0;
    this.nextReqId = (0, types_1$1.IntNumber)(1);
    this.connectedSubject = new rxjs_1$2.BehaviorSubject(false);
    this.linkedSubject = new rxjs_1$2.BehaviorSubject(false);
    this.sessionConfigSubject = new rxjs_1$2.ReplaySubject(1);
    const ws = new RxWebSocket_1.RxWebSocket(linkAPIUrl + "/rpc", WebSocketClass);
    this.ws = ws;
    this.subscriptions.add(ws.connectionState$.pipe(
      (0, operators_1$1.tap)((state) => {
        var _a;
        return (_a = this.diagnostic) === null || _a === void 0 ? void 0 : _a.log(DiagnosticLogger_1$1.EVENTS.CONNECTED_STATE_CHANGE, {
          state,
          sessionIdHash: Session_1$1.Session.hash(sessionId)
        });
      }),
      (0, operators_1$1.skip)(1),
      (0, operators_1$1.filter)((cs) => cs === RxWebSocket_1.ConnectionState.DISCONNECTED && !this.destroyed),
      (0, operators_1$1.delay)(5e3),
      (0, operators_1$1.filter)((_2) => !this.destroyed),
      (0, operators_1$1.flatMap)((_2) => ws.connect()),
      (0, operators_1$1.retry)()
    ).subscribe());
    this.subscriptions.add(ws.connectionState$.pipe(
      (0, operators_1$1.skip)(2),
      (0, operators_1$1.switchMap)((cs) => (0, rxjs_1$2.iif)(
        () => cs === RxWebSocket_1.ConnectionState.CONNECTED,
        this.authenticate().pipe((0, operators_1$1.tap)((_2) => this.sendIsLinked()), (0, operators_1$1.tap)((_2) => this.sendGetSessionConfig()), (0, operators_1$1.map)((_2) => true)),
        (0, rxjs_1$2.of)(false)
      )),
      (0, operators_1$1.distinctUntilChanged)(),
      (0, operators_1$1.catchError)((_2) => (0, rxjs_1$2.of)(false))
    ).subscribe((connected) => this.connectedSubject.next(connected)));
    this.subscriptions.add(ws.connectionState$.pipe(
      (0, operators_1$1.skip)(1),
      (0, operators_1$1.switchMap)((cs) => (0, rxjs_1$2.iif)(
        () => cs === RxWebSocket_1.ConnectionState.CONNECTED,
        (0, rxjs_1$2.timer)(0, HEARTBEAT_INTERVAL)
      ))
    ).subscribe((i) => i === 0 ? this.updateLastHeartbeat() : this.heartbeat()));
    this.subscriptions.add(ws.incomingData$.pipe((0, operators_1$1.filter)((m2) => m2 === "h")).subscribe((_2) => this.updateLastHeartbeat()));
    this.subscriptions.add(ws.incomingJSONData$.pipe((0, operators_1$1.filter)((m2) => ["IsLinkedOK", "Linked"].includes(m2.type))).subscribe((m2) => {
      var _a;
      const msg = m2;
      (_a = this.diagnostic) === null || _a === void 0 ? void 0 : _a.log(DiagnosticLogger_1$1.EVENTS.LINKED, {
        sessionIdHash: Session_1$1.Session.hash(sessionId),
        linked: msg.linked,
        type: m2.type,
        onlineGuests: msg.onlineGuests
      });
      this.linkedSubject.next(msg.linked || msg.onlineGuests > 0);
    }));
    this.subscriptions.add(ws.incomingJSONData$.pipe((0, operators_1$1.filter)((m2) => ["GetSessionConfigOK", "SessionConfigUpdated"].includes(m2.type))).subscribe((m2) => {
      var _a;
      const msg = m2;
      (_a = this.diagnostic) === null || _a === void 0 ? void 0 : _a.log(DiagnosticLogger_1$1.EVENTS.SESSION_CONFIG_RECEIVED, {
        sessionIdHash: Session_1$1.Session.hash(sessionId),
        metadata_keys: msg && msg.metadata ? Object.keys(msg.metadata) : void 0
      });
      this.sessionConfigSubject.next({
        webhookId: msg.webhookId,
        webhookUrl: msg.webhookUrl,
        metadata: msg.metadata
      });
    }));
  }
  connect() {
    var _a;
    if (this.destroyed) {
      throw new Error("instance is destroyed");
    }
    (_a = this.diagnostic) === null || _a === void 0 ? void 0 : _a.log(DiagnosticLogger_1$1.EVENTS.STARTED_CONNECTING, {
      sessionIdHash: Session_1$1.Session.hash(this.sessionId)
    });
    this.ws.connect().subscribe();
  }
  destroy() {
    var _a;
    this.subscriptions.unsubscribe();
    this.ws.disconnect();
    (_a = this.diagnostic) === null || _a === void 0 ? void 0 : _a.log(DiagnosticLogger_1$1.EVENTS.DISCONNECTED, {
      sessionIdHash: Session_1$1.Session.hash(this.sessionId)
    });
    this.destroyed = true;
  }
  get isDestroyed() {
    return this.destroyed;
  }
  get connected$() {
    return this.connectedSubject.asObservable();
  }
  get onceConnected$() {
    return this.connected$.pipe((0, operators_1$1.filter)((v2) => v2), (0, operators_1$1.take)(1), (0, operators_1$1.map)(() => void 0));
  }
  get linked$() {
    return this.linkedSubject.asObservable();
  }
  get onceLinked$() {
    return this.linked$.pipe((0, operators_1$1.filter)((v2) => v2), (0, operators_1$1.take)(1), (0, operators_1$1.map)(() => void 0));
  }
  get sessionConfig$() {
    return this.sessionConfigSubject.asObservable();
  }
  get incomingEvent$() {
    return this.ws.incomingJSONData$.pipe((0, operators_1$1.filter)((m2) => {
      if (m2.type !== "Event") {
        return false;
      }
      const sme = m2;
      return typeof sme.sessionId === "string" && typeof sme.eventId === "string" && typeof sme.event === "string" && typeof sme.data === "string";
    }), (0, operators_1$1.map)((m2) => m2));
  }
  setSessionMetadata(key, value) {
    const message = (0, ClientMessage_1.ClientMessageSetSessionConfig)({
      id: (0, types_1$1.IntNumber)(this.nextReqId++),
      sessionId: this.sessionId,
      metadata: { [key]: value }
    });
    return this.onceConnected$.pipe((0, operators_1$1.flatMap)((_2) => this.makeRequest(message)), (0, operators_1$1.map)((res) => {
      if ((0, ServerMessage_1.isServerMessageFail)(res)) {
        throw new Error(res.error || "failed to set session metadata");
      }
    }));
  }
  publishEvent(event, data, callWebhook = false) {
    const message = (0, ClientMessage_1.ClientMessagePublishEvent)({
      id: (0, types_1$1.IntNumber)(this.nextReqId++),
      sessionId: this.sessionId,
      event,
      data,
      callWebhook
    });
    return this.onceLinked$.pipe((0, operators_1$1.flatMap)((_2) => this.makeRequest(message)), (0, operators_1$1.map)((res) => {
      if ((0, ServerMessage_1.isServerMessageFail)(res)) {
        throw new Error(res.error || "failed to publish event");
      }
      return res.eventId;
    }));
  }
  sendData(message) {
    this.ws.sendData(JSON.stringify(message));
  }
  updateLastHeartbeat() {
    this.lastHeartbeatResponse = Date.now();
  }
  heartbeat() {
    if (Date.now() - this.lastHeartbeatResponse > HEARTBEAT_INTERVAL * 2) {
      this.ws.disconnect();
      return;
    }
    try {
      this.ws.sendData("h");
    } catch (_a) {
    }
  }
  makeRequest(message, timeout2 = REQUEST_TIMEOUT) {
    const reqId = message.id;
    try {
      this.sendData(message);
    } catch (err) {
      return (0, rxjs_1$2.throwError)(err);
    }
    return this.ws.incomingJSONData$.pipe((0, operators_1$1.timeoutWith)(timeout2, (0, rxjs_1$2.throwError)(new Error(`request ${reqId} timed out`))), (0, operators_1$1.filter)((m2) => m2.id === reqId), (0, operators_1$1.take)(1));
  }
  authenticate() {
    const msg = (0, ClientMessage_1.ClientMessageHostSession)({
      id: (0, types_1$1.IntNumber)(this.nextReqId++),
      sessionId: this.sessionId,
      sessionKey: this.sessionKey
    });
    return this.makeRequest(msg).pipe((0, operators_1$1.map)((res) => {
      if ((0, ServerMessage_1.isServerMessageFail)(res)) {
        throw new Error(res.error || "failed to authentcate");
      }
    }));
  }
  sendIsLinked() {
    const msg = (0, ClientMessage_1.ClientMessageIsLinked)({
      id: (0, types_1$1.IntNumber)(this.nextReqId++),
      sessionId: this.sessionId
    });
    this.sendData(msg);
  }
  sendGetSessionConfig() {
    const msg = (0, ClientMessage_1.ClientMessageGetSessionConfig)({
      id: (0, types_1$1.IntNumber)(this.nextReqId++),
      sessionId: this.sessionId
    });
    this.sendData(msg);
  }
}
WalletSDKConnection$1.WalletSDKConnection = WalletSDKConnection;
var WalletUIError$1 = {};
Object.defineProperty(WalletUIError$1, "__esModule", { value: true });
WalletUIError$1.WalletUIError = void 0;
class WalletUIError extends Error {
  constructor(message, errorCode) {
    super(message);
    this.message = message;
    this.errorCode = errorCode;
  }
}
WalletUIError$1.WalletUIError = WalletUIError;
WalletUIError.UserRejectedRequest = new WalletUIError("User rejected request");
WalletUIError.SwitchEthereumChainUnsupportedChainId = new WalletUIError("Unsupported chainId", 4902);
var aes256gcm$1 = {};
Object.defineProperty(aes256gcm$1, "__esModule", { value: true });
aes256gcm$1.decrypt = aes256gcm$1.encrypt = void 0;
const rxjs_1$1 = require$$2$1;
const util_1$3 = util$4;
async function encrypt(plainText, secret) {
  if (secret.length !== 64)
    throw Error(`secret must be 256 bits`);
  const ivBytes = crypto.getRandomValues(new Uint8Array(12));
  const secretKey = await crypto.subtle.importKey("raw", (0, util_1$3.hexStringToUint8Array)(secret), { name: "aes-gcm" }, false, ["encrypt", "decrypt"]);
  const enc = new TextEncoder();
  const encryptedResult = await window.crypto.subtle.encrypt({
    name: "AES-GCM",
    iv: ivBytes
  }, secretKey, enc.encode(plainText));
  const tagLength = 16;
  const authTag = encryptedResult.slice(encryptedResult.byteLength - tagLength);
  const encryptedPlaintext = encryptedResult.slice(0, encryptedResult.byteLength - tagLength);
  const authTagBytes = new Uint8Array(authTag);
  const encryptedPlaintextBytes = new Uint8Array(encryptedPlaintext);
  const concatted = new Uint8Array([
    ...ivBytes,
    ...authTagBytes,
    ...encryptedPlaintextBytes
  ]);
  return (0, util_1$3.uint8ArrayToHex)(concatted);
}
aes256gcm$1.encrypt = encrypt;
function decrypt(cipherText, secret) {
  if (secret.length !== 64)
    throw Error(`secret must be 256 bits`);
  return new rxjs_1$1.Observable((subscriber) => {
    void async function() {
      const secretKey = await crypto.subtle.importKey("raw", (0, util_1$3.hexStringToUint8Array)(secret), { name: "aes-gcm" }, false, ["encrypt", "decrypt"]);
      const encrypted = (0, util_1$3.hexStringToUint8Array)(cipherText);
      const ivBytes = encrypted.slice(0, 12);
      const authTagBytes = encrypted.slice(12, 28);
      const encryptedPlaintextBytes = encrypted.slice(28);
      const concattedBytes = new Uint8Array([
        ...encryptedPlaintextBytes,
        ...authTagBytes
      ]);
      const algo = {
        name: "AES-GCM",
        iv: new Uint8Array(ivBytes)
      };
      try {
        const decrypted = await window.crypto.subtle.decrypt(algo, secretKey, concattedBytes);
        const decoder = new TextDecoder();
        subscriber.next(decoder.decode(decrypted));
        subscriber.complete();
      } catch (err) {
        subscriber.error(err);
      }
    }();
  });
}
aes256gcm$1.decrypt = decrypt;
var Web3Method = {};
(function(exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.Web3Method = void 0;
  (function(Web3Method2) {
    Web3Method2["requestEthereumAccounts"] = "requestEthereumAccounts";
    Web3Method2["signEthereumMessage"] = "signEthereumMessage";
    Web3Method2["signEthereumTransaction"] = "signEthereumTransaction";
    Web3Method2["submitEthereumTransaction"] = "submitEthereumTransaction";
    Web3Method2["ethereumAddressFromSignedMessage"] = "ethereumAddressFromSignedMessage";
    Web3Method2["scanQRCode"] = "scanQRCode";
    Web3Method2["generic"] = "generic";
    Web3Method2["childRequestEthereumAccounts"] = "childRequestEthereumAccounts";
    Web3Method2["addEthereumChain"] = "addEthereumChain";
    Web3Method2["switchEthereumChain"] = "switchEthereumChain";
    Web3Method2["makeEthereumJSONRPCRequest"] = "makeEthereumJSONRPCRequest";
    Web3Method2["watchAsset"] = "watchAsset";
    Web3Method2["selectProvider"] = "selectProvider";
  })(exports.Web3Method || (exports.Web3Method = {}));
})(Web3Method);
var Web3RequestCanceledMessage$1 = {};
var RelayMessage = {};
(function(exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.RelayMessageType = void 0;
  (function(RelayMessageType) {
    RelayMessageType["SESSION_ID_REQUEST"] = "SESSION_ID_REQUEST";
    RelayMessageType["SESSION_ID_RESPONSE"] = "SESSION_ID_RESPONSE";
    RelayMessageType["LINKED"] = "LINKED";
    RelayMessageType["UNLINKED"] = "UNLINKED";
    RelayMessageType["WEB3_REQUEST"] = "WEB3_REQUEST";
    RelayMessageType["WEB3_REQUEST_CANCELED"] = "WEB3_REQUEST_CANCELED";
    RelayMessageType["WEB3_RESPONSE"] = "WEB3_RESPONSE";
  })(exports.RelayMessageType || (exports.RelayMessageType = {}));
})(RelayMessage);
Object.defineProperty(Web3RequestCanceledMessage$1, "__esModule", { value: true });
Web3RequestCanceledMessage$1.Web3RequestCanceledMessage = void 0;
const RelayMessage_1$2 = RelayMessage;
function Web3RequestCanceledMessage(id) {
  return { type: RelayMessage_1$2.RelayMessageType.WEB3_REQUEST_CANCELED, id };
}
Web3RequestCanceledMessage$1.Web3RequestCanceledMessage = Web3RequestCanceledMessage;
var Web3RequestMessage$1 = {};
Object.defineProperty(Web3RequestMessage$1, "__esModule", { value: true });
Web3RequestMessage$1.Web3RequestMessage = void 0;
const RelayMessage_1$1 = RelayMessage;
function Web3RequestMessage(params) {
  return Object.assign({ type: RelayMessage_1$1.RelayMessageType.WEB3_REQUEST }, params);
}
Web3RequestMessage$1.Web3RequestMessage = Web3RequestMessage;
var Web3Response = {};
Object.defineProperty(Web3Response, "__esModule", { value: true });
Web3Response.EthereumAddressFromSignedMessageResponse = Web3Response.SubmitEthereumTransactionResponse = Web3Response.SignEthereumTransactionResponse = Web3Response.SignEthereumMessageResponse = Web3Response.isRequestEthereumAccountsResponse = Web3Response.SelectProviderResponse = Web3Response.WatchAssetReponse = Web3Response.RequestEthereumAccountsResponse = Web3Response.SwitchEthereumChainResponse = Web3Response.AddEthereumChainResponse = Web3Response.ErrorResponse = void 0;
const Web3Method_1$1 = Web3Method;
function ErrorResponse(method, errorMessage, errorCode) {
  return { method, errorMessage, errorCode };
}
Web3Response.ErrorResponse = ErrorResponse;
function AddEthereumChainResponse(addResponse) {
  return {
    method: Web3Method_1$1.Web3Method.addEthereumChain,
    result: addResponse
  };
}
Web3Response.AddEthereumChainResponse = AddEthereumChainResponse;
function SwitchEthereumChainResponse(switchResponse) {
  return {
    method: Web3Method_1$1.Web3Method.switchEthereumChain,
    result: switchResponse
  };
}
Web3Response.SwitchEthereumChainResponse = SwitchEthereumChainResponse;
function RequestEthereumAccountsResponse(addresses) {
  return { method: Web3Method_1$1.Web3Method.requestEthereumAccounts, result: addresses };
}
Web3Response.RequestEthereumAccountsResponse = RequestEthereumAccountsResponse;
function WatchAssetReponse(success) {
  return { method: Web3Method_1$1.Web3Method.watchAsset, result: success };
}
Web3Response.WatchAssetReponse = WatchAssetReponse;
function SelectProviderResponse(selectedProviderKey) {
  return { method: Web3Method_1$1.Web3Method.selectProvider, result: selectedProviderKey };
}
Web3Response.SelectProviderResponse = SelectProviderResponse;
function isRequestEthereumAccountsResponse(res) {
  return res && res.method === Web3Method_1$1.Web3Method.requestEthereumAccounts;
}
Web3Response.isRequestEthereumAccountsResponse = isRequestEthereumAccountsResponse;
function SignEthereumMessageResponse(signature) {
  return { method: Web3Method_1$1.Web3Method.signEthereumMessage, result: signature };
}
Web3Response.SignEthereumMessageResponse = SignEthereumMessageResponse;
function SignEthereumTransactionResponse(signedData) {
  return { method: Web3Method_1$1.Web3Method.signEthereumTransaction, result: signedData };
}
Web3Response.SignEthereumTransactionResponse = SignEthereumTransactionResponse;
function SubmitEthereumTransactionResponse(txHash) {
  return { method: Web3Method_1$1.Web3Method.submitEthereumTransaction, result: txHash };
}
Web3Response.SubmitEthereumTransactionResponse = SubmitEthereumTransactionResponse;
function EthereumAddressFromSignedMessageResponse(address) {
  return {
    method: Web3Method_1$1.Web3Method.ethereumAddressFromSignedMessage,
    result: address
  };
}
Web3Response.EthereumAddressFromSignedMessageResponse = EthereumAddressFromSignedMessageResponse;
var Web3ResponseMessage$1 = {};
Object.defineProperty(Web3ResponseMessage$1, "__esModule", { value: true });
Web3ResponseMessage$1.isWeb3ResponseMessage = Web3ResponseMessage$1.Web3ResponseMessage = void 0;
const RelayMessage_1 = RelayMessage;
function Web3ResponseMessage(params) {
  return Object.assign({ type: RelayMessage_1.RelayMessageType.WEB3_RESPONSE }, params);
}
Web3ResponseMessage$1.Web3ResponseMessage = Web3ResponseMessage;
function isWeb3ResponseMessage(msg) {
  return msg && msg.type === RelayMessage_1.RelayMessageType.WEB3_RESPONSE;
}
Web3ResponseMessage$1.isWeb3ResponseMessage = isWeb3ResponseMessage;
var __createBinding = commonjsGlobal && commonjsGlobal.__createBinding || (Object.create ? function(o2, m2, k2, k22) {
  if (k22 === void 0)
    k22 = k2;
  Object.defineProperty(o2, k22, { enumerable: true, get: function() {
    return m2[k2];
  } });
} : function(o2, m2, k2, k22) {
  if (k22 === void 0)
    k22 = k2;
  o2[k22] = m2[k2];
});
var __setModuleDefault = commonjsGlobal && commonjsGlobal.__setModuleDefault || (Object.create ? function(o2, v2) {
  Object.defineProperty(o2, "default", { enumerable: true, value: v2 });
} : function(o2, v2) {
  o2["default"] = v2;
});
var __decorate = commonjsGlobal && commonjsGlobal.__decorate || function(decorators, target, key, desc) {
  var c2 = arguments.length, r2 = c2 < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d2;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    r2 = Reflect.decorate(decorators, target, key, desc);
  else
    for (var i = decorators.length - 1; i >= 0; i--)
      if (d2 = decorators[i])
        r2 = (c2 < 3 ? d2(r2) : c2 > 3 ? d2(target, key, r2) : d2(target, key)) || r2;
  return c2 > 3 && r2 && Object.defineProperty(target, key, r2), r2;
};
var __importStar = commonjsGlobal && commonjsGlobal.__importStar || function(mod) {
  if (mod && mod.__esModule)
    return mod;
  var result = {};
  if (mod != null) {
    for (var k2 in mod)
      if (k2 !== "default" && Object.prototype.hasOwnProperty.call(mod, k2))
        __createBinding(result, mod, k2);
  }
  __setModuleDefault(result, mod);
  return result;
};
var __importDefault = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(WalletSDKRelay$1, "__esModule", { value: true });
WalletSDKRelay$1.WalletSDKRelay = void 0;
const bind_decorator_1 = __importDefault(bindDecorator);
const eth_rpc_errors_1 = dist$1;
const rxjs_1 = require$$2$1;
const operators_1 = require$$3;
const DiagnosticLogger_1 = DiagnosticLogger;
const WalletSDKConnection_1 = WalletSDKConnection$1;
const WalletUIError_1 = WalletUIError$1;
const types_1 = types$1;
const util_1$2 = util$4;
const aes256gcm = __importStar(aes256gcm$1);
const Session_1 = Session$1;
const WalletSDKRelayAbstract_1 = WalletSDKRelayAbstract$1;
const Web3Method_1 = Web3Method;
const Web3RequestCanceledMessage_1 = Web3RequestCanceledMessage$1;
const Web3RequestMessage_1 = Web3RequestMessage$1;
const Web3Response_1 = Web3Response;
const Web3ResponseMessage_1 = Web3ResponseMessage$1;
class WalletSDKRelay extends WalletSDKRelayAbstract_1.WalletSDKRelayAbstract {
  constructor(options) {
    var _a;
    super();
    this.accountsCallback = null;
    this.chainCallback = null;
    this.dappDefaultChainSubject = new rxjs_1.BehaviorSubject(1);
    this.dappDefaultChain = 1;
    this.appName = "";
    this.appLogoUrl = null;
    this.subscriptions = new rxjs_1.Subscription();
    this.linkAPIUrl = options.linkAPIUrl;
    this.storage = options.storage;
    this.options = options;
    const { session, ui, connection } = this.subscribe();
    this._session = session;
    this.connection = connection;
    this.relayEventManager = options.relayEventManager;
    if (options.diagnosticLogger && options.eventListener) {
      throw new Error("Can't have both eventListener and diagnosticLogger options, use only diagnosticLogger");
    }
    if (options.eventListener) {
      this.diagnostic = {
        log: options.eventListener.onEvent
      };
    } else {
      this.diagnostic = options.diagnosticLogger;
    }
    this._reloadOnDisconnect = (_a = options.reloadOnDisconnect) !== null && _a !== void 0 ? _a : true;
    this.ui = ui;
  }
  subscribe() {
    this.subscriptions.add(this.dappDefaultChainSubject.subscribe((chainId) => {
      if (this.dappDefaultChain !== chainId) {
        this.dappDefaultChain = chainId;
      }
    }));
    const session = Session_1.Session.load(this.storage) || new Session_1.Session(this.storage).save();
    const connection = new WalletSDKConnection_1.WalletSDKConnection(session.id, session.key, this.linkAPIUrl, this.diagnostic);
    this.subscriptions.add(connection.sessionConfig$.subscribe({
      next: (sessionConfig) => {
        this.onSessionConfigChanged(sessionConfig);
      },
      error: () => {
        var _a;
        (_a = this.diagnostic) === null || _a === void 0 ? void 0 : _a.log(DiagnosticLogger_1.EVENTS.GENERAL_ERROR, {
          message: "error while invoking session config callback"
        });
      }
    }));
    this.subscriptions.add(connection.incomingEvent$.pipe((0, operators_1.filter)((m2) => m2.event === "Web3Response")).subscribe({ next: this.handleIncomingEvent }));
    this.subscriptions.add(connection.linked$.pipe((0, operators_1.skip)(1), (0, operators_1.tap)((linked) => {
      var _a;
      this.isLinked = linked;
      const cachedAddresses = this.storage.getItem(WalletSDKRelayAbstract_1.LOCAL_STORAGE_ADDRESSES_KEY);
      if (linked) {
        this.session.linked = linked;
      }
      this.isUnlinkedErrorState = false;
      if (cachedAddresses) {
        const addresses = cachedAddresses.split(" ");
        const wasConnectedViaStandalone = this.storage.getItem("IsStandaloneSigning") === "true";
        if (addresses[0] !== "" && !linked && this.session.linked && !wasConnectedViaStandalone) {
          this.isUnlinkedErrorState = true;
          const sessionIdHash = this.getSessionIdHash();
          (_a = this.diagnostic) === null || _a === void 0 ? void 0 : _a.log(DiagnosticLogger_1.EVENTS.UNLINKED_ERROR_STATE, {
            sessionIdHash
          });
        }
      }
    })).subscribe());
    this.subscriptions.add(connection.sessionConfig$.pipe((0, operators_1.filter)((c2) => !!c2.metadata && c2.metadata.__destroyed === "1")).subscribe(() => {
      var _a;
      const alreadyDestroyed = connection.isDestroyed;
      (_a = this.diagnostic) === null || _a === void 0 ? void 0 : _a.log(DiagnosticLogger_1.EVENTS.METADATA_DESTROYED, {
        alreadyDestroyed,
        sessionIdHash: this.getSessionIdHash()
      });
      return this.resetAndReload();
    }));
    this.subscriptions.add(connection.sessionConfig$.pipe((0, operators_1.filter)((c2) => c2.metadata && c2.metadata.WalletUsername !== void 0)).pipe((0, operators_1.mergeMap)((c2) => aes256gcm.decrypt(c2.metadata.WalletUsername, session.secret))).subscribe({
      next: (walletUsername) => {
        this.storage.setItem(WalletSDKRelayAbstract_1.WALLET_USER_NAME_KEY, walletUsername);
      },
      error: () => {
        var _a;
        (_a = this.diagnostic) === null || _a === void 0 ? void 0 : _a.log(DiagnosticLogger_1.EVENTS.GENERAL_ERROR, {
          message: "Had error decrypting",
          value: "username"
        });
      }
    }));
    this.subscriptions.add(connection.sessionConfig$.pipe((0, operators_1.filter)((c2) => c2.metadata && c2.metadata.AppVersion !== void 0)).pipe((0, operators_1.mergeMap)((c2) => aes256gcm.decrypt(c2.metadata.AppVersion, session.secret))).subscribe({
      next: (appVersion) => {
        this.storage.setItem(WalletSDKRelayAbstract_1.APP_VERSION_KEY, appVersion);
      },
      error: () => {
        var _a;
        (_a = this.diagnostic) === null || _a === void 0 ? void 0 : _a.log(DiagnosticLogger_1.EVENTS.GENERAL_ERROR, {
          message: "Had error decrypting",
          value: "appversion"
        });
      }
    }));
    this.subscriptions.add(connection.sessionConfig$.pipe((0, operators_1.filter)((c2) => c2.metadata && c2.metadata.ChainId !== void 0 && c2.metadata.JsonRpcUrl !== void 0)).pipe((0, operators_1.mergeMap)((c2) => (0, rxjs_1.zip)(aes256gcm.decrypt(c2.metadata.ChainId, session.secret), aes256gcm.decrypt(c2.metadata.JsonRpcUrl, session.secret)))).pipe((0, operators_1.distinctUntilChanged)()).subscribe({
      next: ([chainId, jsonRpcUrl]) => {
        if (this.chainCallback) {
          this.chainCallback(chainId, jsonRpcUrl);
        }
      },
      error: () => {
        var _a;
        (_a = this.diagnostic) === null || _a === void 0 ? void 0 : _a.log(DiagnosticLogger_1.EVENTS.GENERAL_ERROR, {
          message: "Had error decrypting",
          value: "chainId|jsonRpcUrl"
        });
      }
    }));
    this.subscriptions.add(connection.sessionConfig$.pipe((0, operators_1.filter)((c2) => c2.metadata && c2.metadata.EthereumAddress !== void 0)).pipe((0, operators_1.mergeMap)((c2) => aes256gcm.decrypt(c2.metadata.EthereumAddress, session.secret))).subscribe({
      next: (selectedAddress) => {
        if (this.accountsCallback) {
          this.accountsCallback([selectedAddress]);
        }
        if (WalletSDKRelay.accountRequestCallbackIds.size > 0) {
          Array.from(WalletSDKRelay.accountRequestCallbackIds.values()).forEach((id) => {
            const message = (0, Web3ResponseMessage_1.Web3ResponseMessage)({
              id,
              response: (0, Web3Response_1.RequestEthereumAccountsResponse)([
                selectedAddress
              ])
            });
            this.invokeCallback(Object.assign(Object.assign({}, message), { id }));
          });
          WalletSDKRelay.accountRequestCallbackIds.clear();
        }
      },
      error: () => {
        var _a;
        (_a = this.diagnostic) === null || _a === void 0 ? void 0 : _a.log(DiagnosticLogger_1.EVENTS.GENERAL_ERROR, {
          message: "Had error decrypting",
          value: "selectedAddress"
        });
      }
    }));
    const ui = this.options.uiConstructor({
      linkAPIUrl: this.options.linkAPIUrl,
      version: this.options.version,
      darkMode: this.options.darkMode,
      session,
      connected$: connection.connected$,
      chainId$: this.dappDefaultChainSubject
    });
    connection.connect();
    return { session, ui, connection };
  }
  attachUI() {
    this.ui.attach();
  }
  resetAndReload() {
    this.connection.setSessionMetadata("__destroyed", "1").pipe((0, operators_1.timeout)(1e3), (0, operators_1.catchError)((_2) => (0, rxjs_1.of)(null))).subscribe((_2) => {
      var _a, _b, _c;
      const isStandalone = this.ui.isStandalone();
      try {
        this.subscriptions.unsubscribe();
      } catch (err) {
        (_a = this.diagnostic) === null || _a === void 0 ? void 0 : _a.log(DiagnosticLogger_1.EVENTS.GENERAL_ERROR, {
          message: "Had error unsubscribing"
        });
      }
      (_b = this.diagnostic) === null || _b === void 0 ? void 0 : _b.log(DiagnosticLogger_1.EVENTS.SESSION_STATE_CHANGE, {
        method: "relay::resetAndReload",
        sessionMetadataChange: "__destroyed, 1",
        sessionIdHash: this.getSessionIdHash()
      });
      this.connection.destroy();
      const storedSession = Session_1.Session.load(this.storage);
      if ((storedSession === null || storedSession === void 0 ? void 0 : storedSession.id) === this._session.id) {
        this.storage.clear();
      } else if (storedSession) {
        (_c = this.diagnostic) === null || _c === void 0 ? void 0 : _c.log(DiagnosticLogger_1.EVENTS.SKIPPED_CLEARING_SESSION, {
          sessionIdHash: this.getSessionIdHash(),
          storedSessionIdHash: Session_1.Session.hash(storedSession.id)
        });
      }
      if (this._reloadOnDisconnect) {
        this.ui.reloadUI();
        return;
      }
      if (this.accountsCallback) {
        this.accountsCallback([], true);
      }
      const { session, ui, connection } = this.subscribe();
      this._session = session;
      this.connection = connection;
      this.ui = ui;
      if (isStandalone && this.ui.setStandalone)
        this.ui.setStandalone(true);
      this.attachUI();
    }, (err) => {
      var _a;
      (_a = this.diagnostic) === null || _a === void 0 ? void 0 : _a.log(DiagnosticLogger_1.EVENTS.FAILURE, {
        method: "relay::resetAndReload",
        message: `failed to reset and reload with ${err}`,
        sessionIdHash: this.getSessionIdHash()
      });
    });
  }
  setAppInfo(appName, appLogoUrl) {
    this.appName = appName;
    this.appLogoUrl = appLogoUrl;
  }
  getStorageItem(key) {
    return this.storage.getItem(key);
  }
  get session() {
    return this._session;
  }
  setStorageItem(key, value) {
    this.storage.setItem(key, value);
  }
  signEthereumMessage(message, address, addPrefix, typedDataJson) {
    return this.sendRequest({
      method: Web3Method_1.Web3Method.signEthereumMessage,
      params: {
        message: (0, util_1$2.hexStringFromBuffer)(message, true),
        address,
        addPrefix,
        typedDataJson: typedDataJson || null
      }
    });
  }
  ethereumAddressFromSignedMessage(message, signature, addPrefix) {
    return this.sendRequest({
      method: Web3Method_1.Web3Method.ethereumAddressFromSignedMessage,
      params: {
        message: (0, util_1$2.hexStringFromBuffer)(message, true),
        signature: (0, util_1$2.hexStringFromBuffer)(signature, true),
        addPrefix
      }
    });
  }
  signEthereumTransaction(params) {
    return this.sendRequest({
      method: Web3Method_1.Web3Method.signEthereumTransaction,
      params: {
        fromAddress: params.fromAddress,
        toAddress: params.toAddress,
        weiValue: (0, util_1$2.bigIntStringFromBN)(params.weiValue),
        data: (0, util_1$2.hexStringFromBuffer)(params.data, true),
        nonce: params.nonce,
        gasPriceInWei: params.gasPriceInWei ? (0, util_1$2.bigIntStringFromBN)(params.gasPriceInWei) : null,
        maxFeePerGas: params.gasPriceInWei ? (0, util_1$2.bigIntStringFromBN)(params.gasPriceInWei) : null,
        maxPriorityFeePerGas: params.gasPriceInWei ? (0, util_1$2.bigIntStringFromBN)(params.gasPriceInWei) : null,
        gasLimit: params.gasLimit ? (0, util_1$2.bigIntStringFromBN)(params.gasLimit) : null,
        chainId: params.chainId,
        shouldSubmit: false
      }
    });
  }
  signAndSubmitEthereumTransaction(params) {
    return this.sendRequest({
      method: Web3Method_1.Web3Method.signEthereumTransaction,
      params: {
        fromAddress: params.fromAddress,
        toAddress: params.toAddress,
        weiValue: (0, util_1$2.bigIntStringFromBN)(params.weiValue),
        data: (0, util_1$2.hexStringFromBuffer)(params.data, true),
        nonce: params.nonce,
        gasPriceInWei: params.gasPriceInWei ? (0, util_1$2.bigIntStringFromBN)(params.gasPriceInWei) : null,
        maxFeePerGas: params.maxFeePerGas ? (0, util_1$2.bigIntStringFromBN)(params.maxFeePerGas) : null,
        maxPriorityFeePerGas: params.maxPriorityFeePerGas ? (0, util_1$2.bigIntStringFromBN)(params.maxPriorityFeePerGas) : null,
        gasLimit: params.gasLimit ? (0, util_1$2.bigIntStringFromBN)(params.gasLimit) : null,
        chainId: params.chainId,
        shouldSubmit: true
      }
    });
  }
  submitEthereumTransaction(signedTransaction, chainId) {
    return this.sendRequest({
      method: Web3Method_1.Web3Method.submitEthereumTransaction,
      params: {
        signedTransaction: (0, util_1$2.hexStringFromBuffer)(signedTransaction, true),
        chainId
      }
    });
  }
  scanQRCode(regExp) {
    return this.sendRequest({
      method: Web3Method_1.Web3Method.scanQRCode,
      params: { regExp }
    });
  }
  getQRCodeUrl() {
    return (0, util_1$2.createQrUrl)(this._session.id, this._session.secret, this.linkAPIUrl, false, this.options.version, this.dappDefaultChain);
  }
  genericRequest(data, action) {
    return this.sendRequest({
      method: Web3Method_1.Web3Method.generic,
      params: {
        action,
        data
      }
    });
  }
  sendGenericMessage(request) {
    return this.sendRequest(request);
  }
  sendRequest(request) {
    let hideSnackbarItem = null;
    const id = (0, util_1$2.randomBytesHex)(8);
    const cancel = (error) => {
      this.publishWeb3RequestCanceledEvent(id);
      this.handleErrorResponse(id, request.method, error);
      hideSnackbarItem === null || hideSnackbarItem === void 0 ? void 0 : hideSnackbarItem();
    };
    const promise = new Promise((resolve, reject) => {
      if (!this.ui.isStandalone()) {
        hideSnackbarItem = this.ui.showConnecting({
          isUnlinkedErrorState: this.isUnlinkedErrorState,
          onCancel: cancel,
          onResetConnection: this.resetAndReload
        });
      }
      this.relayEventManager.callbacks.set(id, (response) => {
        hideSnackbarItem === null || hideSnackbarItem === void 0 ? void 0 : hideSnackbarItem();
        if (response.errorMessage) {
          return reject(new Error(response.errorMessage));
        }
        resolve(response);
      });
      if (this.ui.isStandalone()) {
        this.sendRequestStandalone(id, request);
      } else {
        this.publishWeb3RequestEvent(id, request);
      }
    });
    return { promise, cancel };
  }
  setConnectDisabled(disabled) {
    this.ui.setConnectDisabled(disabled);
  }
  setAccountsCallback(accountsCallback) {
    this.accountsCallback = accountsCallback;
  }
  setChainCallback(chainCallback) {
    this.chainCallback = chainCallback;
  }
  setDappDefaultChainCallback(chainId) {
    this.dappDefaultChainSubject.next(chainId);
  }
  publishWeb3RequestEvent(id, request) {
    var _a;
    const message = (0, Web3RequestMessage_1.Web3RequestMessage)({ id, request });
    const storedSession = Session_1.Session.load(this.storage);
    (_a = this.diagnostic) === null || _a === void 0 ? void 0 : _a.log(DiagnosticLogger_1.EVENTS.WEB3_REQUEST, {
      eventId: message.id,
      method: `relay::${message.request.method}`,
      sessionIdHash: this.getSessionIdHash(),
      storedSessionIdHash: storedSession ? Session_1.Session.hash(storedSession.id) : "",
      isSessionMismatched: ((storedSession === null || storedSession === void 0 ? void 0 : storedSession.id) !== this._session.id).toString()
    });
    this.subscriptions.add(this.publishEvent("Web3Request", message, true).subscribe({
      next: (_2) => {
        var _a2;
        (_a2 = this.diagnostic) === null || _a2 === void 0 ? void 0 : _a2.log(DiagnosticLogger_1.EVENTS.WEB3_REQUEST_PUBLISHED, {
          eventId: message.id,
          method: `relay::${message.request.method}`,
          sessionIdHash: this.getSessionIdHash(),
          storedSessionIdHash: storedSession ? Session_1.Session.hash(storedSession.id) : "",
          isSessionMismatched: ((storedSession === null || storedSession === void 0 ? void 0 : storedSession.id) !== this._session.id).toString()
        });
      },
      error: (err) => {
        this.handleWeb3ResponseMessage((0, Web3ResponseMessage_1.Web3ResponseMessage)({
          id: message.id,
          response: {
            method: message.request.method,
            errorMessage: err.message
          }
        }));
      }
    }));
  }
  publishWeb3RequestCanceledEvent(id) {
    const message = (0, Web3RequestCanceledMessage_1.Web3RequestCanceledMessage)(id);
    this.subscriptions.add(this.publishEvent("Web3RequestCanceled", message, false).subscribe());
  }
  publishEvent(event, message, callWebhook) {
    const secret = this.session.secret;
    return new rxjs_1.Observable((subscriber) => {
      void aes256gcm.encrypt(JSON.stringify(Object.assign(Object.assign({}, message), { origin: location.origin })), secret).then((encrypted) => {
        subscriber.next(encrypted);
        subscriber.complete();
      });
    }).pipe((0, operators_1.mergeMap)((encrypted) => {
      return this.connection.publishEvent(event, encrypted, callWebhook);
    }));
  }
  handleIncomingEvent(event) {
    try {
      this.subscriptions.add(aes256gcm.decrypt(event.data, this.session.secret).pipe((0, operators_1.map)((c2) => JSON.parse(c2))).subscribe({
        next: (json) => {
          const message = (0, Web3ResponseMessage_1.isWeb3ResponseMessage)(json) ? json : null;
          if (!message) {
            return;
          }
          this.handleWeb3ResponseMessage(message);
        },
        error: () => {
          var _a;
          (_a = this.diagnostic) === null || _a === void 0 ? void 0 : _a.log(DiagnosticLogger_1.EVENTS.GENERAL_ERROR, {
            message: "Had error decrypting",
            value: "incomingEvent"
          });
        }
      }));
    } catch (_a) {
      return;
    }
  }
  handleWeb3ResponseMessage(message) {
    var _a;
    const { response } = message;
    (_a = this.diagnostic) === null || _a === void 0 ? void 0 : _a.log(DiagnosticLogger_1.EVENTS.WEB3_RESPONSE, {
      eventId: message.id,
      method: `relay::${response.method}`,
      sessionIdHash: this.getSessionIdHash()
    });
    if ((0, Web3Response_1.isRequestEthereumAccountsResponse)(response)) {
      WalletSDKRelay.accountRequestCallbackIds.forEach((id) => this.invokeCallback(Object.assign(Object.assign({}, message), { id })));
      WalletSDKRelay.accountRequestCallbackIds.clear();
      return;
    }
    this.invokeCallback(message);
  }
  handleErrorResponse(id, method, error, errorCode) {
    this.handleWeb3ResponseMessage((0, Web3ResponseMessage_1.Web3ResponseMessage)({
      id,
      response: (0, Web3Response_1.ErrorResponse)(method, (error !== null && error !== void 0 ? error : WalletUIError_1.WalletUIError.UserRejectedRequest).message, errorCode)
    }));
  }
  invokeCallback(message) {
    const callback = this.relayEventManager.callbacks.get(message.id);
    if (callback) {
      callback(message.response);
      this.relayEventManager.callbacks.delete(message.id);
    }
  }
  requestEthereumAccounts() {
    const request = {
      method: Web3Method_1.Web3Method.requestEthereumAccounts,
      params: {
        appName: this.appName,
        appLogoUrl: this.appLogoUrl || null
      }
    };
    const id = (0, util_1$2.randomBytesHex)(8);
    const cancel = (error) => {
      this.publishWeb3RequestCanceledEvent(id);
      this.handleErrorResponse(id, request.method, error);
    };
    const promise = new Promise((resolve, reject) => {
      var _a;
      this.relayEventManager.callbacks.set(id, (response) => {
        this.ui.hideRequestEthereumAccounts();
        if (response.errorMessage) {
          return reject(new Error(response.errorMessage));
        }
        resolve(response);
      });
      const userAgent = ((_a = window === null || window === void 0 ? void 0 : window.navigator) === null || _a === void 0 ? void 0 : _a.userAgent) || null;
      if (userAgent && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
        let location2;
        try {
          if ((0, util_1$2.isInIFrame)() && window.top) {
            location2 = window.top.location;
          } else {
            location2 = window.location;
          }
        } catch (e2) {
          location2 = window.location;
        }
        location2.href = `https://go.cb-w.com/xoXnYwQimhb?cb_url=${encodeURIComponent(location2.href)}`;
        return;
      }
      if (this.ui.inlineAccountsResponse()) {
        const onAccounts = (accounts) => {
          this.handleWeb3ResponseMessage((0, Web3ResponseMessage_1.Web3ResponseMessage)({
            id,
            response: (0, Web3Response_1.RequestEthereumAccountsResponse)(accounts)
          }));
        };
        this.ui.requestEthereumAccounts({
          onCancel: cancel,
          onAccounts
        });
      } else {
        const err = eth_rpc_errors_1.ethErrors.provider.userRejectedRequest("User denied account authorization");
        this.ui.requestEthereumAccounts({
          onCancel: () => cancel(err)
        });
      }
      WalletSDKRelay.accountRequestCallbackIds.add(id);
      if (!this.ui.inlineAccountsResponse() && !this.ui.isStandalone()) {
        this.publishWeb3RequestEvent(id, request);
      }
    });
    return { promise, cancel };
  }
  selectProvider(providerOptions) {
    const request = {
      method: Web3Method_1.Web3Method.selectProvider,
      params: {
        providerOptions
      }
    };
    const id = (0, util_1$2.randomBytesHex)(8);
    const cancel = (error) => {
      this.publishWeb3RequestCanceledEvent(id);
      this.handleErrorResponse(id, request.method, error);
    };
    const promise = new Promise((resolve, reject) => {
      this.relayEventManager.callbacks.set(id, (response) => {
        if (response.errorMessage) {
          return reject(new Error(response.errorMessage));
        }
        resolve(response);
      });
      const _cancel = (_error) => {
        this.handleWeb3ResponseMessage((0, Web3ResponseMessage_1.Web3ResponseMessage)({
          id,
          response: (0, Web3Response_1.SelectProviderResponse)(types_1.ProviderType.Unselected)
        }));
      };
      const approve = (selectedProviderKey) => {
        this.handleWeb3ResponseMessage((0, Web3ResponseMessage_1.Web3ResponseMessage)({
          id,
          response: (0, Web3Response_1.SelectProviderResponse)(selectedProviderKey)
        }));
      };
      if (this.ui.selectProvider)
        this.ui.selectProvider({
          onApprove: approve,
          onCancel: _cancel,
          providerOptions
        });
    });
    return { cancel, promise };
  }
  watchAsset(type, address, symbol, decimals, image, chainId) {
    const request = {
      method: Web3Method_1.Web3Method.watchAsset,
      params: {
        type,
        options: {
          address,
          symbol,
          decimals,
          image
        },
        chainId
      }
    };
    let hideSnackbarItem = null;
    const id = (0, util_1$2.randomBytesHex)(8);
    const cancel = (error) => {
      this.publishWeb3RequestCanceledEvent(id);
      this.handleErrorResponse(id, request.method, error);
      hideSnackbarItem === null || hideSnackbarItem === void 0 ? void 0 : hideSnackbarItem();
    };
    if (!this.ui.inlineWatchAsset()) {
      hideSnackbarItem = this.ui.showConnecting({
        isUnlinkedErrorState: this.isUnlinkedErrorState,
        onCancel: cancel,
        onResetConnection: this.resetAndReload
      });
    }
    const promise = new Promise((resolve, reject) => {
      this.relayEventManager.callbacks.set(id, (response) => {
        hideSnackbarItem === null || hideSnackbarItem === void 0 ? void 0 : hideSnackbarItem();
        if (response.errorMessage) {
          return reject(new Error(response.errorMessage));
        }
        resolve(response);
      });
      const _cancel = (_error) => {
        this.handleWeb3ResponseMessage((0, Web3ResponseMessage_1.Web3ResponseMessage)({
          id,
          response: (0, Web3Response_1.WatchAssetReponse)(false)
        }));
      };
      const approve = () => {
        this.handleWeb3ResponseMessage((0, Web3ResponseMessage_1.Web3ResponseMessage)({
          id,
          response: (0, Web3Response_1.WatchAssetReponse)(true)
        }));
      };
      if (this.ui.inlineWatchAsset()) {
        this.ui.watchAsset({
          onApprove: approve,
          onCancel: _cancel,
          type,
          address,
          symbol,
          decimals,
          image,
          chainId
        });
      }
      if (!this.ui.inlineWatchAsset() && !this.ui.isStandalone()) {
        this.publishWeb3RequestEvent(id, request);
      }
    });
    return { cancel, promise };
  }
  addEthereumChain(chainId, rpcUrls, iconUrls, blockExplorerUrls, chainName, nativeCurrency) {
    const request = {
      method: Web3Method_1.Web3Method.addEthereumChain,
      params: {
        chainId,
        rpcUrls,
        blockExplorerUrls,
        chainName,
        iconUrls,
        nativeCurrency
      }
    };
    let hideSnackbarItem = null;
    const id = (0, util_1$2.randomBytesHex)(8);
    const cancel = (error) => {
      this.publishWeb3RequestCanceledEvent(id);
      this.handleErrorResponse(id, request.method, error);
      hideSnackbarItem === null || hideSnackbarItem === void 0 ? void 0 : hideSnackbarItem();
    };
    if (!this.ui.inlineAddEthereumChain(chainId)) {
      hideSnackbarItem = this.ui.showConnecting({
        isUnlinkedErrorState: this.isUnlinkedErrorState,
        onCancel: cancel,
        onResetConnection: this.resetAndReload
      });
    }
    const promise = new Promise((resolve, reject) => {
      this.relayEventManager.callbacks.set(id, (response) => {
        hideSnackbarItem === null || hideSnackbarItem === void 0 ? void 0 : hideSnackbarItem();
        if (response.errorMessage) {
          return reject(new Error(response.errorMessage));
        }
        resolve(response);
      });
      const _cancel = (_error) => {
        this.handleWeb3ResponseMessage((0, Web3ResponseMessage_1.Web3ResponseMessage)({
          id,
          response: (0, Web3Response_1.AddEthereumChainResponse)({
            isApproved: false,
            rpcUrl: ""
          })
        }));
      };
      const approve = (rpcUrl) => {
        this.handleWeb3ResponseMessage((0, Web3ResponseMessage_1.Web3ResponseMessage)({
          id,
          response: (0, Web3Response_1.AddEthereumChainResponse)({ isApproved: true, rpcUrl })
        }));
      };
      if (this.ui.inlineAddEthereumChain(chainId)) {
        this.ui.addEthereumChain({
          onCancel: _cancel,
          onApprove: approve,
          chainId: request.params.chainId,
          rpcUrls: request.params.rpcUrls,
          blockExplorerUrls: request.params.blockExplorerUrls,
          chainName: request.params.chainName,
          iconUrls: request.params.iconUrls,
          nativeCurrency: request.params.nativeCurrency
        });
      }
      if (!this.ui.inlineAddEthereumChain(chainId) && !this.ui.isStandalone()) {
        this.publishWeb3RequestEvent(id, request);
      }
    });
    return { promise, cancel };
  }
  switchEthereumChain(chainId, address) {
    const request = {
      method: Web3Method_1.Web3Method.switchEthereumChain,
      params: Object.assign({ chainId }, { address })
    };
    const id = (0, util_1$2.randomBytesHex)(8);
    const cancel = (error) => {
      this.publishWeb3RequestCanceledEvent(id);
      this.handleErrorResponse(id, request.method, error);
    };
    const promise = new Promise((resolve, reject) => {
      this.relayEventManager.callbacks.set(id, (response) => {
        if (response.errorMessage && response.errorCode) {
          return reject(eth_rpc_errors_1.ethErrors.provider.custom({
            code: response.errorCode,
            message: `Unrecognized chain ID. Try adding the chain using addEthereumChain first.`
          }));
        } else if (response.errorMessage) {
          return reject(new Error(response.errorMessage));
        }
        resolve(response);
      });
      const _cancel = (error) => {
        if (typeof error === "number") {
          const errorCode = error;
          this.handleWeb3ResponseMessage((0, Web3ResponseMessage_1.Web3ResponseMessage)({
            id,
            response: (0, Web3Response_1.ErrorResponse)(Web3Method_1.Web3Method.switchEthereumChain, WalletUIError_1.WalletUIError.SwitchEthereumChainUnsupportedChainId.message, errorCode)
          }));
        } else if (error instanceof WalletUIError_1.WalletUIError) {
          this.handleErrorResponse(id, Web3Method_1.Web3Method.switchEthereumChain, error, error.errorCode);
        } else {
          this.handleWeb3ResponseMessage((0, Web3ResponseMessage_1.Web3ResponseMessage)({
            id,
            response: (0, Web3Response_1.SwitchEthereumChainResponse)({
              isApproved: false,
              rpcUrl: ""
            })
          }));
        }
      };
      const approve = (rpcUrl) => {
        this.handleWeb3ResponseMessage((0, Web3ResponseMessage_1.Web3ResponseMessage)({
          id,
          response: (0, Web3Response_1.SwitchEthereumChainResponse)({
            isApproved: true,
            rpcUrl
          })
        }));
      };
      this.ui.switchEthereumChain({
        onCancel: _cancel,
        onApprove: approve,
        chainId: request.params.chainId,
        address: request.params.address
      });
      if (!this.ui.inlineSwitchEthereumChain() && !this.ui.isStandalone()) {
        this.publishWeb3RequestEvent(id, request);
      }
    });
    return { promise, cancel };
  }
  inlineAddEthereumChain(chainId) {
    return this.ui.inlineAddEthereumChain(chainId);
  }
  getSessionIdHash() {
    return Session_1.Session.hash(this._session.id);
  }
  sendRequestStandalone(id, request) {
    const _cancel = (error) => {
      this.handleErrorResponse(id, request.method, error);
    };
    const onSuccess = (response) => {
      this.handleWeb3ResponseMessage((0, Web3ResponseMessage_1.Web3ResponseMessage)({
        id,
        response
      }));
    };
    switch (request.method) {
      case Web3Method_1.Web3Method.signEthereumMessage:
        this.ui.signEthereumMessage({
          request,
          onSuccess,
          onCancel: _cancel
        });
        break;
      case Web3Method_1.Web3Method.signEthereumTransaction:
        this.ui.signEthereumTransaction({
          request,
          onSuccess,
          onCancel: _cancel
        });
        break;
      case Web3Method_1.Web3Method.submitEthereumTransaction:
        this.ui.submitEthereumTransaction({
          request,
          onSuccess,
          onCancel: _cancel
        });
        break;
      case Web3Method_1.Web3Method.ethereumAddressFromSignedMessage:
        this.ui.ethereumAddressFromSignedMessage({
          request,
          onSuccess
        });
        break;
      default:
        _cancel();
        break;
    }
  }
  onSessionConfigChanged(_nextSessionConfig) {
  }
}
WalletSDKRelay.accountRequestCallbackIds = /* @__PURE__ */ new Set();
__decorate([
  bind_decorator_1.default
], WalletSDKRelay.prototype, "resetAndReload", null);
__decorate([
  bind_decorator_1.default
], WalletSDKRelay.prototype, "handleIncomingEvent", null);
WalletSDKRelay$1.WalletSDKRelay = WalletSDKRelay;
var WalletSDKRelayEventManager$1 = {};
Object.defineProperty(WalletSDKRelayEventManager$1, "__esModule", { value: true });
WalletSDKRelayEventManager$1.WalletSDKRelayEventManager = void 0;
const util_1$1 = util$4;
class WalletSDKRelayEventManager {
  constructor() {
    this._nextRequestId = 0;
    this.callbacks = /* @__PURE__ */ new Map();
  }
  makeRequestId() {
    this._nextRequestId = (this._nextRequestId + 1) % 2147483647;
    const id = this._nextRequestId;
    const idStr = (0, util_1$1.prepend0x)(id.toString(16));
    const callback = this.callbacks.get(idStr);
    if (callback) {
      this.callbacks.delete(idStr);
    }
    return id;
  }
}
WalletSDKRelayEventManager$1.WalletSDKRelayEventManager = WalletSDKRelayEventManager;
const name = "@coinbase/wallet-sdk";
const version = "3.5.3";
const description = "Coinbase Wallet JavaScript SDK";
const keywords = [
  "cipher",
  "cipherbrowser",
  "coinbase",
  "coinbasewallet",
  "eth",
  "ether",
  "ethereum",
  "etherium",
  "injection",
  "toshi",
  "wallet",
  "walletlink",
  "web3"
];
const main = "dist/index.js";
const types = "dist/index.d.ts";
const repository = "https://github.com/coinbase/coinbase-wallet-sdk.git";
const author = "Coinbase, Inc.";
const license = "Apache-2.0";
const scripts = {
  "pretest:unit": "node compile-assets.js",
  "test:unit": "jest",
  "test:unit:coverage": "yarn test:unit && open coverage/lcov-report/index.html",
  "test:karma": "yarn build-npm && karma start",
  prebuild: `node -p "'export const LIB_VERSION = ' + JSON.stringify(require('./package.json').version) + ';'" > src/version.ts`,
  build: "node compile-assets.js && webpack --config webpack.config.js",
  "build-npm": "tsc -p ./tsconfig.build.json",
  "build:dev": "export LINK_API_URL='http://localhost:3000'; yarn build",
  "build:dev:watch": "nodemon -e 'ts,tsx,js,json,css,scss,svg' --ignore 'src/**/*-css.ts' --ignore 'src/**/*-svg.ts' --watch src/ --exec 'yarn build:dev'",
  "build:prod": `yarn prebuild && yarn build && yarn build-npm && cp ./package.json ../../README.md ./LICENSE build/npm && cp -a src/vendor-js build/npm/dist && sed -i.bak 's|  "private": true,||g' build/npm/package.json && rm -f build/npm/package.json.bak`,
  "lint:types": "tsc --noEmit",
  "lint:prettier": 'prettier --check "{src,__tests__}/**/*.(js|ts|tsx)"',
  "lint:eslint": "eslint ./src --ext .ts,.tsx",
  "fix:eslint": "yarn lint:eslint --fix",
  "fix:prettier": "prettier . --write",
  release: "./scripts/release.sh"
};
const dependencies = {
  "@metamask/safe-event-emitter": "2.0.0",
  "@solana/web3.js": "1.52.0",
  "bind-decorator": "^1.0.11",
  "bn.js": "^5.1.1",
  buffer: "^6.0.3",
  clsx: "^1.1.0",
  "eth-block-tracker": "4.4.3",
  "eth-json-rpc-filters": "4.2.2",
  "eth-rpc-errors": "4.0.2",
  "json-rpc-engine": "6.1.0",
  keccak: "^3.0.1",
  preact: "^10.5.9",
  qs: "^6.10.3",
  rxjs: "^6.6.3",
  "sha.js": "^2.4.11",
  "stream-browserify": "^3.0.0",
  util: "^0.12.4"
};
const devDependencies = {
  "@babel/core": "^7.17.9",
  "@babel/plugin-proposal-decorators": "^7.17.9",
  "@babel/plugin-transform-react-jsx": "^7.17.3",
  "@babel/preset-env": "^7.16.11",
  "@babel/preset-typescript": "^7.16.7",
  "@peculiar/webcrypto": "^1.3.3",
  "@testing-library/jest-dom": "^5.16.4",
  "@testing-library/preact": "^2.0.1",
  "@types/bn.js": "^4.11.6",
  "@types/jest": "^27.4.1",
  "@types/node": "^14.14.20",
  "@types/qs": "^6.9.7",
  "@types/sha.js": "^2.4.0",
  "@typescript-eslint/eslint-plugin": "^5.7.0",
  "@typescript-eslint/eslint-plugin-tslint": "^5.7.0",
  "@typescript-eslint/parser": "^5.7.0",
  "babel-jest": "^27.5.1",
  browserify: "17.0.0",
  "copy-webpack-plugin": "^6.4.1",
  "core-js": "^3.8.2",
  eslint: "^8.4.1",
  "eslint-config-prettier": "^8.3.0",
  "eslint-plugin-import": "^2.25.3",
  "eslint-plugin-preact": "^0.1.0",
  "eslint-plugin-prettier": "^4.0.0",
  "eslint-plugin-simple-import-sort": "^7.0.0",
  jasmine: "3.8.0",
  jest: "^27.5.1",
  "jest-chrome": "^0.7.2",
  "jest-websocket-mock": "^2.3.0",
  karma: "^6.3.15",
  "karma-browserify": "8.1.0",
  "karma-chrome-launcher": "^3.1.0",
  "karma-jasmine": "^4.0.1",
  nodemon: "^2.0.6",
  prettier: "^2.5.1",
  "raw-loader": "^4.0.2",
  "regenerator-runtime": "^0.13.7",
  sass: "^1.50.0",
  svgo: "^2.8.0",
  "ts-jest": "^27.1.4",
  "ts-loader": "^8.0.13",
  "ts-node": "^10.7.0",
  tslib: "^2.0.3",
  typescript: "^4.1.3",
  watchify: "4.0.0",
  webpack: "^5.72.0",
  "webpack-cli": "^4.9.2",
  "whatwg-fetch": "^3.5.0"
};
const engines = {
  node: ">= 10.0.0"
};
var require$$7 = {
  name,
  version,
  description,
  keywords,
  main,
  types,
  repository,
  author,
  license,
  scripts,
  dependencies,
  devDependencies,
  engines
};
Object.defineProperty(CoinbaseWalletSDK$1, "__esModule", { value: true });
CoinbaseWalletSDK$1.CoinbaseWalletSDK = void 0;
const wallet_logo_1 = walletLogo$1;
const ScopedLocalStorage_1 = ScopedLocalStorage$1;
const CoinbaseWalletProvider_1 = CoinbaseWalletProvider$1;
const WalletSDKUI_1 = WalletSDKUI$1;
const WalletSDKRelay_1 = WalletSDKRelay$1;
const WalletSDKRelayEventManager_1 = WalletSDKRelayEventManager$1;
const util_1 = util$4;
const LINK_API_URL = {}.LINK_API_URL || "https://www.walletlink.org";
const SDK_VERSION = {}.SDK_VERSION || require$$7.version || "unknown";
class CoinbaseWalletSDK {
  constructor(options) {
    var _a, _b, _c;
    this._appName = "";
    this._appLogoUrl = null;
    this._relay = null;
    this._relayEventManager = null;
    const linkAPIUrl = options.linkAPIUrl || LINK_API_URL;
    let uiConstructor;
    if (!options.uiConstructor) {
      uiConstructor = (opts) => new WalletSDKUI_1.WalletSDKUI(opts);
    } else {
      uiConstructor = options.uiConstructor;
    }
    if (typeof options.overrideIsMetaMask === "undefined") {
      this._overrideIsMetaMask = false;
    } else {
      this._overrideIsMetaMask = options.overrideIsMetaMask;
    }
    this._overrideIsCoinbaseWallet = (_a = options.overrideIsCoinbaseWallet) !== null && _a !== void 0 ? _a : true;
    this._overrideIsCoinbaseBrowser = (_b = options.overrideIsCoinbaseBrowser) !== null && _b !== void 0 ? _b : false;
    if (options.diagnosticLogger && options.eventListener) {
      throw new Error("Can't have both eventListener and diagnosticLogger options, use only diagnosticLogger");
    }
    if (options.eventListener) {
      this._diagnosticLogger = {
        log: options.eventListener.onEvent
      };
    } else {
      this._diagnosticLogger = options.diagnosticLogger;
    }
    this._reloadOnDisconnect = (_c = options.reloadOnDisconnect) !== null && _c !== void 0 ? _c : true;
    const u2 = new URL(linkAPIUrl);
    const origin = `${u2.protocol}//${u2.host}`;
    this._storage = new ScopedLocalStorage_1.ScopedLocalStorage(`-walletlink:${origin}`);
    this._storage.setItem("version", CoinbaseWalletSDK.VERSION);
    if (this.walletExtension || this.coinbaseBrowser) {
      return;
    }
    this._relayEventManager = new WalletSDKRelayEventManager_1.WalletSDKRelayEventManager();
    this._relay = new WalletSDKRelay_1.WalletSDKRelay({
      linkAPIUrl,
      version: SDK_VERSION,
      darkMode: !!options.darkMode,
      uiConstructor,
      storage: this._storage,
      relayEventManager: this._relayEventManager,
      diagnosticLogger: this._diagnosticLogger
    });
    this.setAppInfo(options.appName, options.appLogoUrl);
    if (!!options.headlessMode)
      return;
    this._relay.attachUI();
  }
  makeWeb3Provider(jsonRpcUrl = "", chainId = 1) {
    const extension = this.walletExtension;
    if (extension) {
      if (!this.isCipherProvider(extension)) {
        extension.setProviderInfo(jsonRpcUrl, chainId);
      }
      if (this._reloadOnDisconnect === false && typeof extension.disableReloadOnDisconnect === "function")
        extension.disableReloadOnDisconnect();
      return extension;
    }
    const dappBrowser = this.coinbaseBrowser;
    if (dappBrowser) {
      return dappBrowser;
    }
    const relay = this._relay;
    if (!relay || !this._relayEventManager || !this._storage) {
      throw new Error("Relay not initialized, should never happen");
    }
    if (!jsonRpcUrl)
      relay.setConnectDisabled(true);
    return new CoinbaseWalletProvider_1.CoinbaseWalletProvider({
      relayProvider: () => Promise.resolve(relay),
      relayEventManager: this._relayEventManager,
      storage: this._storage,
      jsonRpcUrl,
      chainId,
      qrUrl: this.getQrUrl(),
      diagnosticLogger: this._diagnosticLogger,
      overrideIsMetaMask: this._overrideIsMetaMask,
      overrideIsCoinbaseWallet: this._overrideIsCoinbaseWallet,
      overrideIsCoinbaseBrowser: this._overrideIsCoinbaseBrowser
    });
  }
  setAppInfo(appName, appLogoUrl) {
    var _a;
    this._appName = appName || "DApp";
    this._appLogoUrl = appLogoUrl || (0, util_1.getFavicon)();
    const extension = this.walletExtension;
    if (extension) {
      if (!this.isCipherProvider(extension)) {
        extension.setAppInfo(this._appName, this._appLogoUrl);
      }
    } else {
      (_a = this._relay) === null || _a === void 0 ? void 0 : _a.setAppInfo(this._appName, this._appLogoUrl);
    }
  }
  disconnect() {
    var _a;
    const extension = this.walletExtension;
    if (extension) {
      void extension.close();
    } else {
      (_a = this._relay) === null || _a === void 0 ? void 0 : _a.resetAndReload();
    }
  }
  getQrUrl() {
    var _a, _b;
    return (_b = (_a = this._relay) === null || _a === void 0 ? void 0 : _a.getQRCodeUrl()) !== null && _b !== void 0 ? _b : null;
  }
  getCoinbaseWalletLogo(type, width = 240) {
    return (0, wallet_logo_1.walletLogo)(type, width);
  }
  get walletExtension() {
    var _a;
    return (_a = window.coinbaseWalletExtension) !== null && _a !== void 0 ? _a : window.walletLinkExtension;
  }
  get coinbaseBrowser() {
    var _a, _b;
    try {
      const ethereum = (_a = window.ethereum) !== null && _a !== void 0 ? _a : (_b = window.top) === null || _b === void 0 ? void 0 : _b.ethereum;
      if (!ethereum) {
        return void 0;
      }
      if ("isCoinbaseBrowser" in ethereum && ethereum.isCoinbaseBrowser) {
        return ethereum;
      } else {
        return void 0;
      }
    } catch (e2) {
      return void 0;
    }
  }
  isCipherProvider(provider) {
    return typeof provider.isCipher === "boolean" && provider.isCipher;
  }
}
CoinbaseWalletSDK$1.CoinbaseWalletSDK = CoinbaseWalletSDK;
CoinbaseWalletSDK.VERSION = SDK_VERSION;
(function(exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.CoinbaseWalletProvider = exports.CoinbaseWalletSDK = void 0;
  const CoinbaseWalletSDK_1 = CoinbaseWalletSDK$1;
  const CoinbaseWalletProvider_12 = CoinbaseWalletProvider$1;
  var CoinbaseWalletSDK_2 = CoinbaseWalletSDK$1;
  Object.defineProperty(exports, "CoinbaseWalletSDK", { enumerable: true, get: function() {
    return CoinbaseWalletSDK_2.CoinbaseWalletSDK;
  } });
  var CoinbaseWalletProvider_2 = CoinbaseWalletProvider$1;
  Object.defineProperty(exports, "CoinbaseWalletProvider", { enumerable: true, get: function() {
    return CoinbaseWalletProvider_2.CoinbaseWalletProvider;
  } });
  exports.default = CoinbaseWalletSDK_1.CoinbaseWalletSDK;
  if (typeof window !== "undefined") {
    window.CoinbaseWalletSDK = CoinbaseWalletSDK_1.CoinbaseWalletSDK;
    window.CoinbaseWalletProvider = CoinbaseWalletProvider_12.CoinbaseWalletProvider;
    window.WalletLink = CoinbaseWalletSDK_1.CoinbaseWalletSDK;
    window.WalletLinkProvider = CoinbaseWalletProvider_12.CoinbaseWalletProvider;
  }
})(dist$2);
var index = /* @__PURE__ */ getDefaultExportFromCjs(dist$2);
var index$1 = /* @__PURE__ */ _mergeNamespaces({
  __proto__: null,
  "default": index
}, [dist$2]);
export { index$1 as i };
