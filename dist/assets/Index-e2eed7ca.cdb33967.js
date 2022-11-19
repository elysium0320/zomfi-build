import { _ as __extends, S as Subscription, a as __spreadArray, b as __read, c as arrRemove, d as dateTimestampProvider, p as popScheduler, e as popNumber, E as EMPTY, i as innerFrom, m as mergeAll, f as from, o as operate, g as createOperatorSubscriber, h as filter, j as SvelteComponent, k as init$1, s as safe_not_equal, l as empty, n as insert, q as listen, r as group_outros, t as transition_out, u as check_outros, v as transition_in, w as detach, x as onDestroy, y as updateAccountCenter, z as create_component, A as mount_component, B as destroy_component, C as append_styles, D as en, W as WalletAppBadge, F as unrecognizedChainStyle, G as questionIcon, H as SuccessStatusIcon, I as space, J as element, K as text, L as attr, M as set_style, N as toggle_class, O as append, P as blocknative, Q as stop_propagation, R as is_function, T as update_keyed_each, U as outro_and_destroy_block, V as set_data, X as add_render_callback, Y as create_in_transition, Z as quartOut, $ as fly, a0 as run_all, a1 as component_subscribe, a2 as wallets$, a3 as Y, a4 as state, a5 as getDefaultChainStyles, a6 as shortenEns, a7 as fade, a8 as create_out_transition, a9 as shortenAddress, aa as binding_callbacks, ab as bind, ac as add_flush_callback, ad as disconnect, ae as configuration, af as bubble, ag as connect$1, ah as noop, ai as BehaviorSubject, aj as distinctUntilChanged, ak as destroy_each, al as setChain, am as Modal, an as selectAccounts, ao as ProviderRpcErrorCode, ap as connectWallet$, aq as setPrimaryWallet, ar as copyWalletAddress, as as connectedToValidAppChain, at as null_to_empty, au as select_option, av as destroy_block, aw as chainIdToLabel } from "./index.8052dd69.js";
var Action = function(_super) {
  __extends(Action2, _super);
  function Action2(scheduler, work) {
    return _super.call(this) || this;
  }
  Action2.prototype.schedule = function(state2, delay) {
    return this;
  };
  return Action2;
}(Subscription);
var intervalProvider = {
  setInterval: function(handler, timeout) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
      args[_i - 2] = arguments[_i];
    }
    var delegate = intervalProvider.delegate;
    if (delegate === null || delegate === void 0 ? void 0 : delegate.setInterval) {
      return delegate.setInterval.apply(delegate, __spreadArray([handler, timeout], __read(args)));
    }
    return setInterval.apply(void 0, __spreadArray([handler, timeout], __read(args)));
  },
  clearInterval: function(handle) {
    var delegate = intervalProvider.delegate;
    return ((delegate === null || delegate === void 0 ? void 0 : delegate.clearInterval) || clearInterval)(handle);
  },
  delegate: void 0
};
var AsyncAction = function(_super) {
  __extends(AsyncAction2, _super);
  function AsyncAction2(scheduler, work) {
    var _this = _super.call(this, scheduler, work) || this;
    _this.scheduler = scheduler;
    _this.work = work;
    _this.pending = false;
    return _this;
  }
  AsyncAction2.prototype.schedule = function(state2, delay) {
    var _a;
    if (delay === void 0) {
      delay = 0;
    }
    if (this.closed) {
      return this;
    }
    this.state = state2;
    var id = this.id;
    var scheduler = this.scheduler;
    if (id != null) {
      this.id = this.recycleAsyncId(scheduler, id, delay);
    }
    this.pending = true;
    this.delay = delay;
    this.id = (_a = this.id) !== null && _a !== void 0 ? _a : this.requestAsyncId(scheduler, this.id, delay);
    return this;
  };
  AsyncAction2.prototype.requestAsyncId = function(scheduler, _id, delay) {
    if (delay === void 0) {
      delay = 0;
    }
    return intervalProvider.setInterval(scheduler.flush.bind(scheduler, this), delay);
  };
  AsyncAction2.prototype.recycleAsyncId = function(_scheduler, id, delay) {
    if (delay === void 0) {
      delay = 0;
    }
    if (delay != null && this.delay === delay && this.pending === false) {
      return id;
    }
    if (id != null) {
      intervalProvider.clearInterval(id);
    }
    return void 0;
  };
  AsyncAction2.prototype.execute = function(state2, delay) {
    if (this.closed) {
      return new Error("executing a cancelled action");
    }
    this.pending = false;
    var error = this._execute(state2, delay);
    if (error) {
      return error;
    } else if (this.pending === false && this.id != null) {
      this.id = this.recycleAsyncId(this.scheduler, this.id, null);
    }
  };
  AsyncAction2.prototype._execute = function(state2, _delay) {
    var errored = false;
    var errorValue;
    try {
      this.work(state2);
    } catch (e) {
      errored = true;
      errorValue = e ? e : new Error("Scheduled action threw falsy error");
    }
    if (errored) {
      this.unsubscribe();
      return errorValue;
    }
  };
  AsyncAction2.prototype.unsubscribe = function() {
    if (!this.closed) {
      var _a = this, id = _a.id, scheduler = _a.scheduler;
      var actions = scheduler.actions;
      this.work = this.state = this.scheduler = null;
      this.pending = false;
      arrRemove(actions, this);
      if (id != null) {
        this.id = this.recycleAsyncId(scheduler, id, null);
      }
      this.delay = null;
      _super.prototype.unsubscribe.call(this);
    }
  };
  return AsyncAction2;
}(Action);
var Scheduler = function() {
  function Scheduler2(schedulerActionCtor, now) {
    if (now === void 0) {
      now = Scheduler2.now;
    }
    this.schedulerActionCtor = schedulerActionCtor;
    this.now = now;
  }
  Scheduler2.prototype.schedule = function(work, delay, state2) {
    if (delay === void 0) {
      delay = 0;
    }
    return new this.schedulerActionCtor(this, work).schedule(state2, delay);
  };
  Scheduler2.now = dateTimestampProvider.now;
  return Scheduler2;
}();
var AsyncScheduler = function(_super) {
  __extends(AsyncScheduler2, _super);
  function AsyncScheduler2(SchedulerAction, now) {
    if (now === void 0) {
      now = Scheduler.now;
    }
    var _this = _super.call(this, SchedulerAction, now) || this;
    _this.actions = [];
    _this._active = false;
    return _this;
  }
  AsyncScheduler2.prototype.flush = function(action) {
    var actions = this.actions;
    if (this._active) {
      actions.push(action);
      return;
    }
    var error;
    this._active = true;
    do {
      if (error = action.execute(action.state, action.delay)) {
        break;
      }
    } while (action = actions.shift());
    this._active = false;
    if (error) {
      while (action = actions.shift()) {
        action.unsubscribe();
      }
      throw error;
    }
  };
  return AsyncScheduler2;
}(Scheduler);
var asyncScheduler = new AsyncScheduler(AsyncAction);
function merge() {
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
  var scheduler = popScheduler(args);
  var concurrent = popNumber(args, Infinity);
  var sources = args;
  return !sources.length ? EMPTY : sources.length === 1 ? innerFrom(sources[0]) : mergeAll(concurrent)(from(sources, scheduler));
}
function debounceTime(dueTime, scheduler) {
  if (scheduler === void 0) {
    scheduler = asyncScheduler;
  }
  return operate(function(source, subscriber) {
    var activeTask = null;
    var lastValue = null;
    var lastTime = null;
    var emit = function() {
      if (activeTask) {
        activeTask.unsubscribe();
        activeTask = null;
        var value = lastValue;
        lastValue = null;
        subscriber.next(value);
      }
    };
    function emitWhenIdle() {
      var targetTime = lastTime + dueTime;
      var now = scheduler.now();
      if (now < targetTime) {
        activeTask = this.schedule(void 0, targetTime - now);
        subscriber.add(activeTask);
        return;
      }
      emit();
    }
    source.subscribe(createOperatorSubscriber(subscriber, function(value) {
      lastValue = value;
      lastTime = scheduler.now();
      if (!activeTask) {
        activeTask = scheduler.schedule(emitWhenIdle, dueTime);
        subscriber.add(activeTask);
      }
    }, function() {
      emit();
      subscriber.complete();
    }, void 0, function() {
      lastValue = activeTask = null;
    }));
  });
}
function skip(count) {
  return filter(function(_, index) {
    return count <= index;
  });
}
var elipsisIcon = `
  <svg width="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 8C13.1 8 14 7.1 14 6C14 4.9 13.1 4 12 4C10.9 4 10 4.9 10 6C10 7.1 10.9 8 12 8ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10ZM12 16C10.9 16 10 16.9 10 18C10 19.1 10.9 20 12 20C13.1 20 14 19.1 14 18C14 16.9 13.1 16 12 16Z" fill="currentColor"/>
  </svg>
`;
function add_css$5(target) {
  append_styles(target, "svelte-1qjpc7y", ".container.svelte-1qjpc7y.svelte-1qjpc7y.svelte-1qjpc7y{padding:0.25rem;margin-bottom:0.25rem;width:100%;font-size:var(--onboard-font-size-5, var(--font-size-5));line-height:var(--onboard-font-line-height-2, var(--font-line-height-2));border-radius:12px;transition:background-color 150ms ease-in-out}.container.svelte-1qjpc7y.svelte-1qjpc7y.svelte-1qjpc7y:hover{background:var(--onboard-gray-500, var(--gray-500))}.container.svelte-1qjpc7y:hover>div.svelte-1qjpc7y>span.balance.svelte-1qjpc7y{color:var(\n      --account-center-maximized-balance-color,\n      var(--onboard-gray-100, var(--gray-100))\n    )}.container.primary.svelte-1qjpc7y.svelte-1qjpc7y.svelte-1qjpc7y:hover{background:var(\n      --account-center-maximized-account-section-background-hover,\n      var(--onboard-gray-700, var(--gray-700))\n    )}.address-ens.svelte-1qjpc7y.svelte-1qjpc7y.svelte-1qjpc7y{margin-left:0.5rem;font-weight:700;color:var(\n      --account-center-maximized-address-color,\n      var(--onboard-primary-100, var(--primary-100))\n    )}.balance.svelte-1qjpc7y.svelte-1qjpc7y.svelte-1qjpc7y{margin-left:0.5rem;color:var(--onboard-gray-300, var(--gray-300));transition:color 150ms ease-in-out, background-color 150ms ease-in-out;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;width:7.25rem}.elipsis-container.svelte-1qjpc7y.svelte-1qjpc7y.svelte-1qjpc7y{padding:0.25rem;margin-left:0.25rem;border-radius:24px;transition:color 150ms ease-in-out, background-color 150ms ease-in-out;background-color:transparent;color:var(--onboard-gray-400, var(--gray-400))}.elipsis.svelte-1qjpc7y.svelte-1qjpc7y.svelte-1qjpc7y{width:24px}.elipsis-container.svelte-1qjpc7y.svelte-1qjpc7y.svelte-1qjpc7y:hover{color:var(--onboard-gray-100, var(--gray-100))}.elipsis-container.active.svelte-1qjpc7y.svelte-1qjpc7y.svelte-1qjpc7y{background:var(--onboard-gray-700, var(--gray-700))}.menu.svelte-1qjpc7y.svelte-1qjpc7y.svelte-1qjpc7y{background:var(--onboard-white, var(--white));border:1px solid var(--onboard-gray-100, var(--gray-100));border-radius:8px;list-style-type:none;right:0.25rem;top:2.25rem;margin:0;padding:0;border:none;overflow:hidden;z-index:1}.menu.svelte-1qjpc7y li.svelte-1qjpc7y.svelte-1qjpc7y{color:var(--onboard-primary-500, var(--primary-500));font-size:var(--onboard-font-size-5, var(--font-size-5));line-height:var(--onboard-font-line-height-3, var(--font-line-height-3));padding:12px 16px;background:var(--onboard-white, var(--white));transition:background-color 150ms ease-in-out;cursor:pointer}.menu.svelte-1qjpc7y li.svelte-1qjpc7y.svelte-1qjpc7y:hover{background:var(--onboard-primary-200, var(--primary-200))}");
}
function get_each_context$2(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[14] = list[i].address;
  child_ctx[15] = list[i].ens;
  child_ctx[16] = list[i].balance;
  child_ctx[18] = i;
  return child_ctx;
}
function create_if_block_3$1(ctx) {
  let div;
  let successstatusicon;
  let current;
  successstatusicon = new SuccessStatusIcon({ props: { size: 14 } });
  return {
    c() {
      div = element("div");
      create_component(successstatusicon.$$.fragment);
      set_style(div, "right", "-5px");
      set_style(div, "bottom", "-5px");
      attr(div, "class", "drop-shadow absolute");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      mount_component(successstatusicon, div, null);
      current = true;
    },
    i(local) {
      if (current)
        return;
      transition_in(successstatusicon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(successstatusicon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div);
      destroy_component(successstatusicon);
    }
  };
}
function create_if_block_2$2(ctx) {
  let span;
  let t_value = formatBalance(ctx[16]) + "";
  let t;
  let span_intro;
  return {
    c() {
      span = element("span");
      t = text(t_value);
      attr(span, "class", "balance svelte-1qjpc7y");
    },
    m(target, anchor) {
      insert(target, span, anchor);
      append(span, t);
    },
    p(ctx2, dirty) {
      if (dirty & 1 && t_value !== (t_value = formatBalance(ctx2[16]) + ""))
        set_data(t, t_value);
    },
    i(local) {
      if (!span_intro) {
        add_render_callback(() => {
          span_intro = create_in_transition(span, fade, {});
          span_intro.start();
        });
      }
    },
    o: noop,
    d(detaching) {
      if (detaching)
        detach(span);
    }
  };
}
function create_if_block$4(ctx) {
  let ul;
  let li0;
  let t0_value = ctx[4]("accountCenter.addAccount", {
    default: ctx[2].accountCenter.addAccount
  }) + "";
  let t0;
  let t1;
  let t2;
  let li1;
  let t3_value = ctx[4]("accountCenter.disconnectWallet", {
    default: ctx[2].accountCenter.disconnectWallet
  }) + "";
  let t3;
  let t4;
  let li2;
  let t5_value = ctx[2].accountCenter.copyAddress + "";
  let t5;
  let ul_intro;
  let mounted;
  let dispose;
  let if_block = !(ctx[1] && ctx[18] === 0) && create_if_block_1$3(ctx);
  function click_handler_5() {
    return ctx[13](ctx[15], ctx[14]);
  }
  return {
    c() {
      ul = element("ul");
      li0 = element("li");
      t0 = text(t0_value);
      t1 = space();
      if (if_block)
        if_block.c();
      t2 = space();
      li1 = element("li");
      t3 = text(t3_value);
      t4 = space();
      li2 = element("li");
      t5 = text(t5_value);
      attr(li0, "class", "svelte-1qjpc7y");
      attr(li1, "class", "svelte-1qjpc7y");
      attr(li2, "class", "svelte-1qjpc7y");
      attr(ul, "class", "menu absolute svelte-1qjpc7y");
    },
    m(target, anchor) {
      insert(target, ul, anchor);
      append(ul, li0);
      append(li0, t0);
      append(ul, t1);
      if (if_block)
        if_block.m(ul, null);
      append(ul, t2);
      append(ul, li1);
      append(li1, t3);
      append(ul, t4);
      append(ul, li2);
      append(li2, t5);
      if (!mounted) {
        dispose = [
          listen(li0, "click", stop_propagation(ctx[10])),
          listen(li1, "click", stop_propagation(ctx[12])),
          listen(li2, "click", stop_propagation(click_handler_5))
        ];
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty & 20 && t0_value !== (t0_value = ctx[4]("accountCenter.addAccount", {
        default: ctx[2].accountCenter.addAccount
      }) + ""))
        set_data(t0, t0_value);
      if (!(ctx[1] && ctx[18] === 0)) {
        if (if_block) {
          if_block.p(ctx, dirty);
        } else {
          if_block = create_if_block_1$3(ctx);
          if_block.c();
          if_block.m(ul, t2);
        }
      } else if (if_block) {
        if_block.d(1);
        if_block = null;
      }
      if (dirty & 20 && t3_value !== (t3_value = ctx[4]("accountCenter.disconnectWallet", {
        default: ctx[2].accountCenter.disconnectWallet
      }) + ""))
        set_data(t3, t3_value);
      if (dirty & 4 && t5_value !== (t5_value = ctx[2].accountCenter.copyAddress + ""))
        set_data(t5, t5_value);
    },
    i(local) {
      if (!ul_intro) {
        add_render_callback(() => {
          ul_intro = create_in_transition(ul, fade, {});
          ul_intro.start();
        });
      }
    },
    o: noop,
    d(detaching) {
      if (detaching)
        detach(ul);
      if (if_block)
        if_block.d();
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_if_block_1$3(ctx) {
  let li;
  let t_value = ctx[4]("accountCenter.setPrimaryAccount", {
    default: ctx[2].accountCenter.setPrimaryAccount
  }) + "";
  let t;
  let mounted;
  let dispose;
  function click_handler_3() {
    return ctx[11](ctx[14]);
  }
  return {
    c() {
      li = element("li");
      t = text(t_value);
      attr(li, "class", "svelte-1qjpc7y");
    },
    m(target, anchor) {
      insert(target, li, anchor);
      append(li, t);
      if (!mounted) {
        dispose = listen(li, "click", stop_propagation(click_handler_3));
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty & 20 && t_value !== (t_value = ctx[4]("accountCenter.setPrimaryAccount", {
        default: ctx[2].accountCenter.setPrimaryAccount
      }) + ""))
        set_data(t, t_value);
    },
    d(detaching) {
      if (detaching)
        detach(li);
      mounted = false;
      dispose();
    }
  };
}
function create_each_block$2(ctx) {
  let div6;
  let div5;
  let div1;
  let div0;
  let walletappbadge;
  let t0;
  let t1;
  let span;
  let t2_value = (ctx[15] ? shortenEns(ctx[15].name) : shortenAddress(ctx[14])) + "";
  let t2;
  let t3;
  let div4;
  let t4;
  let div3;
  let div2;
  let t5;
  let t6;
  let current;
  let mounted;
  let dispose;
  walletappbadge = new WalletAppBadge({
    props: {
      size: 32,
      padding: 4,
      background: "custom",
      color: "#EFF1FC",
      customBackgroundColor: ctx[1] && ctx[18] === 0 ? "rgba(24, 206, 102, 0.2)" : "rgba(235, 235, 237, 0.1)",
      border: ctx[1] && ctx[18] === 0 ? "green" : "gray",
      radius: 8,
      icon: ctx[0].icon
    }
  });
  let if_block0 = ctx[1] && ctx[18] === 0 && create_if_block_3$1();
  let if_block1 = ctx[16] && create_if_block_2$2(ctx);
  function click_handler() {
    return ctx[8](ctx[14]);
  }
  function click_handler_1() {
    return ctx[9](ctx[14]);
  }
  let if_block2 = ctx[3] === ctx[14] && create_if_block$4(ctx);
  return {
    c() {
      div6 = element("div");
      div5 = element("div");
      div1 = element("div");
      div0 = element("div");
      create_component(walletappbadge.$$.fragment);
      t0 = space();
      if (if_block0)
        if_block0.c();
      t1 = space();
      span = element("span");
      t2 = text(t2_value);
      t3 = space();
      div4 = element("div");
      if (if_block1)
        if_block1.c();
      t4 = space();
      div3 = element("div");
      div2 = element("div");
      t5 = space();
      if (if_block2)
        if_block2.c();
      t6 = space();
      attr(div0, "class", "flex items-center relative");
      attr(span, "class", "address-ens svelte-1qjpc7y");
      attr(div1, "class", "flex items-center");
      attr(div2, "class", "elipsis pointer flex items-center justify-center relative svelte-1qjpc7y");
      attr(div3, "class", "elipsis-container svelte-1qjpc7y");
      toggle_class(div3, "active", ctx[3] === ctx[14]);
      attr(div4, "class", "flex items-center svelte-1qjpc7y");
      attr(div5, "class", "container flex items-center justify-between pointer svelte-1qjpc7y");
      toggle_class(div5, "primary", ctx[1] && ctx[18] === 0);
      attr(div6, "class", "relative");
    },
    m(target, anchor) {
      insert(target, div6, anchor);
      append(div6, div5);
      append(div5, div1);
      append(div1, div0);
      mount_component(walletappbadge, div0, null);
      append(div0, t0);
      if (if_block0)
        if_block0.m(div0, null);
      append(div1, t1);
      append(div1, span);
      append(span, t2);
      append(div5, t3);
      append(div5, div4);
      if (if_block1)
        if_block1.m(div4, null);
      append(div4, t4);
      append(div4, div3);
      append(div3, div2);
      div2.innerHTML = elipsisIcon;
      append(div6, t5);
      if (if_block2)
        if_block2.m(div6, null);
      append(div6, t6);
      current = true;
      if (!mounted) {
        dispose = [
          listen(div2, "click", stop_propagation(click_handler)),
          listen(div5, "click", click_handler_1)
        ];
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      const walletappbadge_changes = {};
      if (dirty & 2)
        walletappbadge_changes.customBackgroundColor = ctx[1] && ctx[18] === 0 ? "rgba(24, 206, 102, 0.2)" : "rgba(235, 235, 237, 0.1)";
      if (dirty & 2)
        walletappbadge_changes.border = ctx[1] && ctx[18] === 0 ? "green" : "gray";
      if (dirty & 1)
        walletappbadge_changes.icon = ctx[0].icon;
      walletappbadge.$set(walletappbadge_changes);
      if (ctx[1] && ctx[18] === 0) {
        if (if_block0) {
          if (dirty & 2) {
            transition_in(if_block0, 1);
          }
        } else {
          if_block0 = create_if_block_3$1();
          if_block0.c();
          transition_in(if_block0, 1);
          if_block0.m(div0, null);
        }
      } else if (if_block0) {
        group_outros();
        transition_out(if_block0, 1, 1, () => {
          if_block0 = null;
        });
        check_outros();
      }
      if ((!current || dirty & 1) && t2_value !== (t2_value = (ctx[15] ? shortenEns(ctx[15].name) : shortenAddress(ctx[14])) + ""))
        set_data(t2, t2_value);
      if (ctx[16]) {
        if (if_block1) {
          if_block1.p(ctx, dirty);
          if (dirty & 1) {
            transition_in(if_block1, 1);
          }
        } else {
          if_block1 = create_if_block_2$2(ctx);
          if_block1.c();
          transition_in(if_block1, 1);
          if_block1.m(div4, t4);
        }
      } else if (if_block1) {
        if_block1.d(1);
        if_block1 = null;
      }
      if (!current || dirty & 9) {
        toggle_class(div3, "active", ctx[3] === ctx[14]);
      }
      if (!current || dirty & 2) {
        toggle_class(div5, "primary", ctx[1] && ctx[18] === 0);
      }
      if (ctx[3] === ctx[14]) {
        if (if_block2) {
          if_block2.p(ctx, dirty);
          if (dirty & 9) {
            transition_in(if_block2, 1);
          }
        } else {
          if_block2 = create_if_block$4(ctx);
          if_block2.c();
          transition_in(if_block2, 1);
          if_block2.m(div6, t6);
        }
      } else if (if_block2) {
        if_block2.d(1);
        if_block2 = null;
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(walletappbadge.$$.fragment, local);
      transition_in(if_block0);
      transition_in(if_block1);
      transition_in(if_block2);
      current = true;
    },
    o(local) {
      transition_out(walletappbadge.$$.fragment, local);
      transition_out(if_block0);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div6);
      destroy_component(walletappbadge);
      if (if_block0)
        if_block0.d();
      if (if_block1)
        if_block1.d();
      if (if_block2)
        if_block2.d();
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_fragment$6(ctx) {
  let each_1_anchor;
  let current;
  let each_value = ctx[0].accounts;
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
  }
  const out = (i) => transition_out(each_blocks[i], 1, 1, () => {
    each_blocks[i] = null;
  });
  return {
    c() {
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      each_1_anchor = empty();
    },
    m(target, anchor) {
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].m(target, anchor);
      }
      insert(target, each_1_anchor, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      if (dirty & 127) {
        each_value = ctx2[0].accounts;
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context$2(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
            transition_in(each_blocks[i], 1);
          } else {
            each_blocks[i] = create_each_block$2(child_ctx);
            each_blocks[i].c();
            transition_in(each_blocks[i], 1);
            each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
          }
        }
        group_outros();
        for (i = each_value.length; i < each_blocks.length; i += 1) {
          out(i);
        }
        check_outros();
      }
    },
    i(local) {
      if (current)
        return;
      for (let i = 0; i < each_value.length; i += 1) {
        transition_in(each_blocks[i]);
      }
      current = true;
    },
    o(local) {
      each_blocks = each_blocks.filter(Boolean);
      for (let i = 0; i < each_blocks.length; i += 1) {
        transition_out(each_blocks[i]);
      }
      current = false;
    },
    d(detaching) {
      destroy_each(each_blocks, detaching);
      if (detaching)
        detach(each_1_anchor);
    }
  };
}
function formatBalance(balance) {
  const [asset] = Object.keys(balance);
  return `${balance[asset].length > 8 ? balance[asset].slice(0, 8) : balance[asset]} ${asset}`;
}
function instance$6($$self, $$props, $$invalidate) {
  let $_;
  component_subscribe($$self, Y, ($$value) => $$invalidate(4, $_ = $$value));
  let { wallet } = $$props;
  let { primary } = $$props;
  function hideMenu() {
    $$invalidate(3, showMenu = "");
  }
  let showMenu = "";
  async function selectAnotherAccount(wallet2) {
    try {
      await selectAccounts(wallet2.provider);
    } catch (error) {
      const { code } = error;
      if (code === ProviderRpcErrorCode.UNSUPPORTED_METHOD || code === ProviderRpcErrorCode.DOES_NOT_EXIST) {
        connectWallet$.next({
          inProgress: false,
          actionRequired: wallet2.label
        });
      }
    }
  }
  function changeText() {
    $$invalidate(2, en.accountCenter.copyAddress = "Copied Successfully", en);
    setTimeout(hideMenu, 500);
    setTimeout(
      () => {
        $$invalidate(2, en.accountCenter.copyAddress = "Copy Wallet address", en);
      },
      700
    );
  }
  const click_handler = (address) => $$invalidate(3, showMenu = showMenu === address ? "" : address);
  const click_handler_1 = (address) => setPrimaryWallet(wallet, address);
  const click_handler_2 = () => {
    $$invalidate(3, showMenu = "");
    selectAnotherAccount(wallet);
  };
  const click_handler_3 = (address) => {
    $$invalidate(3, showMenu = "");
    setPrimaryWallet(wallet, address);
  };
  const click_handler_4 = () => {
    $$invalidate(3, showMenu = "");
    disconnect({ label: wallet.label });
  };
  const click_handler_5 = (ens, address) => {
    copyWalletAddress(ens ? ens.name : address).then(() => {
      changeText();
    });
  };
  $$self.$$set = ($$props2) => {
    if ("wallet" in $$props2)
      $$invalidate(0, wallet = $$props2.wallet);
    if ("primary" in $$props2)
      $$invalidate(1, primary = $$props2.primary);
  };
  return [
    wallet,
    primary,
    en,
    showMenu,
    $_,
    selectAnotherAccount,
    changeText,
    hideMenu,
    click_handler,
    click_handler_1,
    click_handler_2,
    click_handler_3,
    click_handler_4,
    click_handler_5
  ];
}
class WalletRow extends SvelteComponent {
  constructor(options) {
    super();
    init$1(this, options, instance$6, create_fragment$6, safe_not_equal, { wallet: 0, primary: 1, hideMenu: 7 }, add_css$5);
  }
  get hideMenu() {
    return this.$$.ctx[7];
  }
}
var plusCircleIcon = `
  <svg width="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13 7H11V11H7V13H11V17H13V13H17V11H13V7ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor"/>
  </svg>
`;
var arrowForwardIcon = `
  <svg width="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.09 15.59L11.5 17L16.5 12L11.5 7L10.09 8.41L12.67 11H3V13H12.67L10.09 15.59ZM19 3H5C3.89 3 3 3.9 3 5V9H5V5H19V19H5V15H3V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z" fill="currentColor"/>
  </svg>
`;
var caretIcon = `<svg width="100%" height="24" viewBox="0 5 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 10L12 15L17 10H7Z" fill="currentColor"/></svg>`;
function add_css$4(target) {
  append_styles(target, "svelte-1uqued6", "select.svelte-1uqued6{border:none;background-image:none;background-color:transparent;-webkit-appearance:none;-webkit-box-shadow:none;-moz-box-shadow:none;box-shadow:none;appearance:none;font-size:var(--onboard-font-size-7, var(--font-size-7));line-height:var(--onboard-font-line-height-3, var(--font-line-height-3));transition:width 250ms ease-in-out;background-repeat:no-repeat, repeat;background-position:right 0px top 0px, 0 0;scrollbar-width:none;-ms-overflow-style:none;padding:0 14px 0 0;white-space:nowrap;text-overflow:ellipsis}select.minimized_ac.svelte-1uqued6{min-width:80px;max-width:80px}select.maximized_ac.svelte-1uqued6{width:auto !important}select.svelte-1uqued6:focus{outline:none}span.switching-placeholder.svelte-1uqued6{font-size:var(--onboard-font-size-7, var(--font-size-7));line-height:var(--onboard-font-line-height-3, var(--font-line-height-3));min-width:80px;max-width:80px;padding:0 8px 0 4px}");
}
function get_each_context$1(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[15] = list[i];
  return child_ctx;
}
function create_if_block$3(ctx) {
  let if_block_anchor;
  function select_block_type(ctx2, dirty) {
    if (ctx2[7])
      return create_if_block_1$2;
    return create_else_block$1;
  }
  let current_block_type = select_block_type(ctx);
  let if_block = current_block_type(ctx);
  return {
    c() {
      if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
    },
    p(ctx2, dirty) {
      if (current_block_type === (current_block_type = select_block_type(ctx2)) && if_block) {
        if_block.p(ctx2, dirty);
      } else {
        if_block.d(1);
        if_block = current_block_type(ctx2);
        if (if_block) {
          if_block.c();
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      }
    },
    d(detaching) {
      if_block.d(detaching);
      if (detaching)
        detach(if_block_anchor);
    }
  };
}
function create_else_block$1(ctx) {
  let select;
  let show_if = !connectedToValidAppChain(ctx[6].chains[0], ctx[2]);
  let if_block_anchor;
  let each_blocks = [];
  let each_1_lookup = /* @__PURE__ */ new Map();
  let select_class_value;
  let select_value_value;
  let select_style_value;
  let mounted;
  let dispose;
  let if_block = show_if && create_if_block_2$1(ctx);
  let each_value = ctx[2];
  const get_key = (ctx2) => ctx2[15].id;
  for (let i = 0; i < each_value.length; i += 1) {
    let child_ctx = get_each_context$1(ctx, each_value, i);
    let key = get_key(child_ctx);
    each_1_lookup.set(key, each_blocks[i] = create_each_block$1(key, child_ctx));
  }
  return {
    c() {
      select = element("select");
      if (if_block)
        if_block.c();
      if_block_anchor = empty();
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      attr(select, "class", select_class_value = null_to_empty(`flex justify-center items-center pointer ${ctx[4]}`) + " svelte-1uqued6");
      attr(select, "style", select_style_value = `
        color: var(${ctx[1]}, 
        var(--account-center-network-selector-color, var (--gray-500)));
        background-image: url('data:image/svg+xml;utf8,${ctx[0]}'); ${ctx[3] ? "font-weight: 700;" : ""}`);
    },
    m(target, anchor) {
      insert(target, select, anchor);
      if (if_block)
        if_block.m(select, null);
      append(select, if_block_anchor);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].m(select, null);
      }
      select_option(select, ctx[6].chains[0].id);
      ctx[13](select);
      if (!mounted) {
        dispose = listen(select, "change", ctx[10]);
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty & 68)
        show_if = !connectedToValidAppChain(ctx2[6].chains[0], ctx2[2]);
      if (show_if) {
        if (if_block) {
          if_block.p(ctx2, dirty);
        } else {
          if_block = create_if_block_2$1(ctx2);
          if_block.c();
          if_block.m(select, if_block_anchor);
        }
      } else if (if_block) {
        if_block.d(1);
        if_block = null;
      }
      if (dirty & 4) {
        each_value = ctx2[2];
        each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx2, each_value, each_1_lookup, select, destroy_block, create_each_block$1, null, get_each_context$1);
      }
      if (dirty & 16 && select_class_value !== (select_class_value = null_to_empty(`flex justify-center items-center pointer ${ctx2[4]}`) + " svelte-1uqued6")) {
        attr(select, "class", select_class_value);
      }
      if (dirty & 64 && select_value_value !== (select_value_value = ctx2[6].chains[0].id)) {
        select_option(select, ctx2[6].chains[0].id);
      }
      if (dirty & 11 && select_style_value !== (select_style_value = `
        color: var(${ctx2[1]}, 
        var(--account-center-network-selector-color, var (--gray-500)));
        background-image: url('data:image/svg+xml;utf8,${ctx2[0]}'); ${ctx2[3] ? "font-weight: 700;" : ""}`)) {
        attr(select, "style", select_style_value);
      }
    },
    d(detaching) {
      if (detaching)
        detach(select);
      if (if_block)
        if_block.d();
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].d();
      }
      ctx[13](null);
      mounted = false;
      dispose();
    }
  };
}
function create_if_block_1$2(ctx) {
  let span;
  let t;
  let span_class_value;
  let span_style_value;
  return {
    c() {
      span = element("span");
      t = text("switching...");
      attr(span, "class", span_class_value = null_to_empty(`switching-placeholder ${ctx[4]}`) + " svelte-1uqued6");
      attr(span, "style", span_style_value = `
        color: var(${ctx[1]}, 
        var(--account-center-network-selector-color, var (--gray-500))); 
      `);
    },
    m(target, anchor) {
      insert(target, span, anchor);
      append(span, t);
    },
    p(ctx2, dirty) {
      if (dirty & 16 && span_class_value !== (span_class_value = null_to_empty(`switching-placeholder ${ctx2[4]}`) + " svelte-1uqued6")) {
        attr(span, "class", span_class_value);
      }
      if (dirty & 2 && span_style_value !== (span_style_value = `
        color: var(${ctx2[1]}, 
        var(--account-center-network-selector-color, var (--gray-500))); 
      `)) {
        attr(span, "style", span_style_value);
      }
    },
    d(detaching) {
      if (detaching)
        detach(span);
    }
  };
}
function create_if_block_2$1(ctx) {
  let option;
  let t_value = (chainIdToLabel[ctx[6].chains[0].id] || "unrecognized") + "";
  let t;
  let option_value_value;
  return {
    c() {
      option = element("option");
      t = text(t_value);
      option.__value = option_value_value = ctx[6].chains[0].id;
      option.value = option.__value;
    },
    m(target, anchor) {
      insert(target, option, anchor);
      append(option, t);
    },
    p(ctx2, dirty) {
      if (dirty & 64 && t_value !== (t_value = (chainIdToLabel[ctx2[6].chains[0].id] || "unrecognized") + ""))
        set_data(t, t_value);
      if (dirty & 64 && option_value_value !== (option_value_value = ctx2[6].chains[0].id)) {
        option.__value = option_value_value;
        option.value = option.__value;
      }
    },
    d(detaching) {
      if (detaching)
        detach(option);
    }
  };
}
function create_each_block$1(key_1, ctx) {
  let option;
  let t_value = ctx[15].label + "";
  let t;
  let option_value_value;
  return {
    key: key_1,
    first: null,
    c() {
      option = element("option");
      t = text(t_value);
      option.__value = option_value_value = ctx[15].id;
      option.value = option.__value;
      this.first = option;
    },
    m(target, anchor) {
      insert(target, option, anchor);
      append(option, t);
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty & 4 && t_value !== (t_value = ctx[15].label + ""))
        set_data(t, t_value);
      if (dirty & 4 && option_value_value !== (option_value_value = ctx[15].id)) {
        option.__value = option_value_value;
        option.value = option.__value;
      }
    },
    d(detaching) {
      if (detaching)
        detach(option);
    }
  };
}
function create_fragment$5(ctx) {
  let if_block_anchor;
  let if_block = ctx[6] && create_if_block$3(ctx);
  return {
    c() {
      if (if_block)
        if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if (if_block)
        if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
    },
    p(ctx2, [dirty]) {
      if (ctx2[6]) {
        if (if_block) {
          if_block.p(ctx2, dirty);
        } else {
          if_block = create_if_block$3(ctx2);
          if_block.c();
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        if_block.d(1);
        if_block = null;
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (if_block)
        if_block.d(detaching);
      if (detaching)
        detach(if_block_anchor);
    }
  };
}
function instance$5($$self, $$props, $$invalidate) {
  let wallet;
  let $resize$;
  let $wallets$;
  let $switching$;
  component_subscribe($$self, wallets$, ($$value) => $$invalidate(12, $wallets$ = $$value));
  let { selectIcon = caretIcon } = $$props;
  let { colorVar } = $$props;
  let { chains } = $$props;
  let { bold = false } = $$props;
  let { parentCSSId = "" } = $$props;
  const switching$ = new BehaviorSubject(false);
  component_subscribe($$self, switching$, (value) => $$invalidate(7, $switching$ = value));
  let selectElement;
  const resize$ = merge(wallets$, switching$.pipe(skip(1))).pipe(debounceTime(50), distinctUntilChanged((prev, next) => typeof prev === "boolean" || typeof next === "boolean" ? false : prev[0] && next[0] && prev[0].chains[0].id === next[0].chains[0].id));
  component_subscribe($$self, resize$, (value) => $$invalidate(11, $resize$ = value));
  async function handleSelect() {
    const selectedChain = selectElement.selectedOptions[0].value;
    if (selectedChain !== wallet.chains[0].id) {
      switching$.next(true);
      await setChain({
        chainId: selectedChain,
        chainNamespace: "evm",
        wallet: wallet.label
      });
      switching$.next(false);
    }
  }
  function resizeSelect() {
    if (!selectElement)
      return;
    let tempOption = document.createElement("option");
    tempOption.textContent = selectElement.selectedOptions[0].textContent;
    let tempSelect = document.createElement("select");
    tempSelect.style.visibility = "hidden";
    tempSelect.style.position = "fixed";
    tempSelect.appendChild(tempOption);
    selectElement.after(tempSelect);
    $$invalidate(5, selectElement.style.width = `${tempSelect.clientWidth - 22}px`, selectElement);
    tempSelect.remove();
  }
  function select_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      selectElement = $$value;
      $$invalidate(5, selectElement);
      $$invalidate(2, chains);
      $$invalidate(6, wallet), $$invalidate(12, $wallets$);
    });
  }
  $$self.$$set = ($$props2) => {
    if ("selectIcon" in $$props2)
      $$invalidate(0, selectIcon = $$props2.selectIcon);
    if ("colorVar" in $$props2)
      $$invalidate(1, colorVar = $$props2.colorVar);
    if ("chains" in $$props2)
      $$invalidate(2, chains = $$props2.chains);
    if ("bold" in $$props2)
      $$invalidate(3, bold = $$props2.bold);
    if ("parentCSSId" in $$props2)
      $$invalidate(4, parentCSSId = $$props2.parentCSSId);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 4096) {
      $$invalidate(6, [wallet] = $wallets$, wallet);
    }
    if ($$self.$$.dirty & 2048) {
      if ($resize$) {
        resizeSelect();
      }
    }
  };
  return [
    selectIcon,
    colorVar,
    chains,
    bold,
    parentCSSId,
    selectElement,
    wallet,
    $switching$,
    switching$,
    resize$,
    handleSelect,
    $resize$,
    $wallets$,
    select_binding
  ];
}
class NetworkSelector extends SvelteComponent {
  constructor(options) {
    super();
    init$1(
      this,
      options,
      instance$5,
      create_fragment$5,
      safe_not_equal,
      {
        selectIcon: 0,
        colorVar: 1,
        chains: 2,
        bold: 3,
        parentCSSId: 4
      },
      add_css$4
    );
  }
}
var caretLightIcon = `<svg width="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.59 8.59L12 13.17L7.41 8.59L6 10L12 16L18 10L16.59 8.59Z" fill="currentColor"/></svg>`;
var warningIcon = `
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 21H23L12 2L1 21ZM13 18H11V16H13V18ZM13 14H11V10H13V14Z" fill="currentColor"/>
  </svg>
`;
function add_css$3(target) {
  append_styles(target, "svelte-10lq1b5", ".content.svelte-10lq1b5{padding:1rem;width:300px;font-family:var(--onboard-font-family-normal, var(--font-family-normal));font-size:var(--onboard-font-size-5, var(--font-size-5));line-height:24px}.icon-container.svelte-10lq1b5{width:3rem;height:3rem;background:var(--onboard-warning-100, var(--warning-100));border-radius:24px;padding:12px;color:var(--onboard-warning-500, var(--warning-500))}h4.svelte-10lq1b5{margin:1.5rem 0 0.5rem 0;font-weight:700}p.svelte-10lq1b5{margin:0;font-weight:400}button.svelte-10lq1b5{margin-top:1.5rem;width:50%;font-weight:700}.right.svelte-10lq1b5{margin-left:0.5rem;width:60%}");
}
function create_default_slot(ctx) {
  let div2;
  let div0;
  let t0;
  let h4;
  let t1_value = ctx[2]("modals.confirmDisconnectAll.heading", {
    default: en.modals.confirmDisconnectAll.heading
  }) + "";
  let t1;
  let t2;
  let p;
  let t3_value = ctx[2]("modals.confirmDisconnectAll.description") + "";
  let t3;
  let t4;
  let div1;
  let button0;
  let t5_value = ctx[2]("modals.confirmDisconnectAll.cancel", {
    default: en.modals.confirmDisconnectAll.cancel
  }) + "";
  let t5;
  let t6;
  let button1;
  let t7_value = ctx[2]("modals.confirmDisconnectAll.confirm", {
    default: en.modals.confirmDisconnectAll.confirm
  }) + "";
  let t7;
  let mounted;
  let dispose;
  return {
    c() {
      div2 = element("div");
      div0 = element("div");
      t0 = space();
      h4 = element("h4");
      t1 = text(t1_value);
      t2 = space();
      p = element("p");
      t3 = text(t3_value);
      t4 = space();
      div1 = element("div");
      button0 = element("button");
      t5 = text(t5_value);
      t6 = space();
      button1 = element("button");
      t7 = text(t7_value);
      attr(div0, "class", "icon-container flex justify-center items-center svelte-10lq1b5");
      attr(h4, "class", "svelte-10lq1b5");
      attr(p, "class", "svelte-10lq1b5");
      attr(button0, "class", "button-neutral-solid-b rounded svelte-10lq1b5");
      attr(button1, "class", "right button-neutral-solid rounded svelte-10lq1b5");
      attr(div1, "class", "flex justify-between items-center w-100");
      attr(div2, "class", "content svelte-10lq1b5");
    },
    m(target, anchor) {
      insert(target, div2, anchor);
      append(div2, div0);
      div0.innerHTML = warningIcon;
      append(div2, t0);
      append(div2, h4);
      append(h4, t1);
      append(div2, t2);
      append(div2, p);
      append(p, t3);
      append(div2, t4);
      append(div2, div1);
      append(div1, button0);
      append(button0, t5);
      append(div1, t6);
      append(div1, button1);
      append(button1, t7);
      if (!mounted) {
        dispose = [
          listen(button0, "click", function() {
            if (is_function(ctx[1]))
              ctx[1].apply(this, arguments);
          }),
          listen(button1, "click", function() {
            if (is_function(ctx[0]))
              ctx[0].apply(this, arguments);
          })
        ];
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty & 4 && t1_value !== (t1_value = ctx[2]("modals.confirmDisconnectAll.heading", {
        default: en.modals.confirmDisconnectAll.heading
      }) + ""))
        set_data(t1, t1_value);
      if (dirty & 4 && t3_value !== (t3_value = ctx[2]("modals.confirmDisconnectAll.description") + ""))
        set_data(t3, t3_value);
      if (dirty & 4 && t5_value !== (t5_value = ctx[2]("modals.confirmDisconnectAll.cancel", {
        default: en.modals.confirmDisconnectAll.cancel
      }) + ""))
        set_data(t5, t5_value);
      if (dirty & 4 && t7_value !== (t7_value = ctx[2]("modals.confirmDisconnectAll.confirm", {
        default: en.modals.confirmDisconnectAll.confirm
      }) + ""))
        set_data(t7, t7_value);
    },
    d(detaching) {
      if (detaching)
        detach(div2);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_fragment$4(ctx) {
  let modal;
  let current;
  modal = new Modal({
    props: {
      close: ctx[1],
      $$slots: { default: [create_default_slot] },
      $$scope: { ctx }
    }
  });
  return {
    c() {
      create_component(modal.$$.fragment);
    },
    m(target, anchor) {
      mount_component(modal, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const modal_changes = {};
      if (dirty & 2)
        modal_changes.close = ctx2[1];
      if (dirty & 15) {
        modal_changes.$$scope = { dirty, ctx: ctx2 };
      }
      modal.$set(modal_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(modal.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(modal.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(modal, detaching);
    }
  };
}
function instance$4($$self, $$props, $$invalidate) {
  let $_;
  component_subscribe($$self, Y, ($$value) => $$invalidate(2, $_ = $$value));
  let { onConfirm } = $$props;
  let { onClose } = $$props;
  $$self.$$set = ($$props2) => {
    if ("onConfirm" in $$props2)
      $$invalidate(0, onConfirm = $$props2.onConfirm);
    if ("onClose" in $$props2)
      $$invalidate(1, onClose = $$props2.onClose);
  };
  return [onConfirm, onClose, $_];
}
class DisconnectAllConfirm extends SvelteComponent {
  constructor(options) {
    super();
    init$1(this, options, instance$4, create_fragment$4, safe_not_equal, { onConfirm: 0, onClose: 1 }, add_css$3);
  }
}
function add_css$2(target) {
  append_styles(target, "svelte-jvefs6", ".outer-container.svelte-jvefs6{background:var(\n      --account-center-maximized-upper-background,\n      var(--onboard-gray-600, var(--gray-600))\n    );border-radius:var(\n      --account-center-border-radius,\n      var(--onboard-border-radius-3, var(--border-radius-3))\n    );width:100%;filter:drop-shadow(0px 4px 16px rgba(178, 178, 178, 0.2));padding:0 1px 1px 1px;pointer-events:auto}.wallets-section.svelte-jvefs6{width:100%;border-radius:var(\n      --account-center-border-radius,\n      var(--onboard-border-radius-3, var(--border-radius-3))\n    )}.p5.svelte-jvefs6{padding:var(--onboard-spacing-5, var(--spacing-5))}.wallets.svelte-jvefs6{width:100%;margin-bottom:0.5rem}.actions.svelte-jvefs6{color:var(\n      --account-center-maximized-upper-action-color,\n      var(--onboard-primary-400, var(--primary-400))\n    );padding-left:2px}.action-container.svelte-jvefs6{padding:4px 12px 4px 8px;border-radius:8px;transition:background-color 150ms ease-in-out}.action-container.svelte-jvefs6:hover{background-color:var(\n      --account-center-maximized-upper-action-background-hover,\n      rgba(146, 155, 237, 0.2)\n    )}.plus-icon.svelte-jvefs6{width:20px}.arrow-forward.svelte-jvefs6{width:20px}.mt.svelte-jvefs6{margin-top:0.25rem}.action-text.svelte-jvefs6{font-size:var(--onboard-font-size-6, var(--font-size-6));line-height:var(--onboard-font-line-height-3, var(--font-line-height-3));margin-left:0.5rem}.background-blue.svelte-jvefs6{background:var(\n      --account-center-maximized-network-section-background,\n      var(--onboard-primary-100, var(--primary-100))\n    )}.background-gray.svelte-jvefs6{background:var(--onboard-gray-100, var(--gray-100))}.background-yellow.svelte-jvefs6{background:var(--onboard-warning-100, var(--warning-100))}.network-container.svelte-jvefs6{border-radius:var(\n      --account-center-border-radius,\n      var(--onboard-border-radius-3, var(--border-radius-3))\n    );color:var(\n      --account-center-maximized-network-text-color,\n      var(\n        --account-center-maximized-network-section,\n        var(--onboard-gray-500, var(--gray-500))\n      )\n    )}.p5-5.svelte-jvefs6{padding:12px}.network-selector-container.svelte-jvefs6{margin-left:1rem;width:100%}.network-selector-label.svelte-jvefs6{font-size:var(--onboard-font-size-7, var(--font-size-7));line-height:var(--onboard-font-line-height-3, var(--font-line-height-3))}.app-info-container.svelte-jvefs6{background:var(\n      --account-center-maximized-info-section-background-color,\n      var(\n        --account-center-maximized-info-section,\n        var(--onboard-white, var(--white))\n      )\n    );border-radius:var(\n      --account-center-border-radius,\n      var(--onboard-border-radius-3, var(--border-radius-3))\n    );padding:12px}.app-name.svelte-jvefs6{font-weight:700;font-size:var(--onboard-font-size-5, var(--font-size-5));line-height:var(--onboard-font-line-height-3, var(--font-line-height-3));color:var(\n      --account-center-maximized-app-name-color,\n      var(--onboard-gray-600, var(--gray-600))\n    );margin-bottom:var(--onboard-spacing-5, var(--spacing-5));margin-top:0}.app-description.svelte-jvefs6{font-size:var(--onboard-font-size-7, var(--font-size-7));line-height:var(--onboard-font-line-height-3, var(--font-line-height-3));color:var(\n      --account-center-maximized-app-info-color,\n      var(--onboard-gray-500, var(--gray-500))\n    );margin:0}.app-info.svelte-jvefs6{font-size:var(--onboard-font-size-7, var(--font-size-7));line-height:var(--onboard-font-line-height-3, var(--font-line-height-3));color:var(\n      --account-center-maximized-app-info-color,\n      var(--onboard-gray-500, var(--gray-500))\n    )}.app-info-heading.svelte-jvefs6{color:var(\n      --account-center-maximized-app-info-color,\n      var(--onboard-gray-600, var(--gray-600))\n    );font-weight:700;margin-top:var(--onboard-spacing-5, var(--spacing-5));margin-bottom:var(--onboard-spacing-7, var(--spacing-7))}a.svelte-jvefs6{font-weight:700}.mt7.svelte-jvefs6{margin-top:var(--onboard-spacing-7, var(--spacing-7))}.ml4.svelte-jvefs6{margin-left:var(--onboard-spacing-4, var(--spacing-4))}.app-button.svelte-jvefs6{margin-top:var(--onboard-spacing-5, var(--spacing-5));color:var(\n      --account-center-app-btn-text-color,\n      var(--onboard-white, var(--white))\n    );background:var(\n      --account-center-app-btn-background,\n      var(--onboard-gray-500, var(--gray-500))\n    );font-family:var(--account-center-app-btn-font-family, inherit)}.powered-by-container.svelte-jvefs6{margin-top:12px}.powered-by.svelte-jvefs6{color:var(--onboard-gray-400, var(--gray-400));font-size:var(--onboard-font-size-7, var(--font-size-7));line-height:var(--onboard-font-line-height-3, var(--font-line-height-3))}");
}
function get_each_context(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[19] = list[i];
  child_ctx[21] = i;
  return child_ctx;
}
function create_if_block_5(ctx) {
  let disconnectallconfirm;
  let current;
  disconnectallconfirm = new DisconnectAllConfirm({
    props: {
      onClose: ctx[14],
      onConfirm: ctx[6]
    }
  });
  return {
    c() {
      create_component(disconnectallconfirm.$$.fragment);
    },
    m(target, anchor) {
      mount_component(disconnectallconfirm, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const disconnectallconfirm_changes = {};
      if (dirty & 2)
        disconnectallconfirm_changes.onClose = ctx2[14];
      disconnectallconfirm.$set(disconnectallconfirm_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(disconnectallconfirm.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(disconnectallconfirm.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(disconnectallconfirm, detaching);
    }
  };
}
function create_each_block(key_1, ctx) {
  let first;
  let walletrow;
  let updating_hideMenu;
  let current;
  function walletrow_hideMenu_binding(value) {
    ctx[15](value);
  }
  let walletrow_props = {
    wallet: ctx[19],
    primary: ctx[21] === 0
  };
  if (ctx[2] !== void 0) {
    walletrow_props.hideMenu = ctx[2];
  }
  walletrow = new WalletRow({ props: walletrow_props });
  binding_callbacks.push(() => bind(walletrow, "hideMenu", walletrow_hideMenu_binding));
  return {
    key: key_1,
    first: null,
    c() {
      first = empty();
      create_component(walletrow.$$.fragment);
      this.first = first;
    },
    m(target, anchor) {
      insert(target, first, anchor);
      mount_component(walletrow, target, anchor);
      current = true;
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      const walletrow_changes = {};
      if (dirty & 1)
        walletrow_changes.wallet = ctx[19];
      if (dirty & 1)
        walletrow_changes.primary = ctx[21] === 0;
      if (!updating_hideMenu && dirty & 4) {
        updating_hideMenu = true;
        walletrow_changes.hideMenu = ctx[2];
        add_flush_callback(() => updating_hideMenu = false);
      }
      walletrow.$set(walletrow_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(walletrow.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(walletrow.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(first);
      destroy_component(walletrow, detaching);
    }
  };
}
function create_if_block_4(ctx) {
  let div1;
  let div0;
  let t0;
  let span0;
  let t1_value = ctx[5]("accountCenter.connectAnotherWallet", {
    default: en.accountCenter.connectAnotherWallet
  }) + "";
  let t1;
  let t2;
  let div3;
  let div2;
  let t3;
  let span1;
  let t4_value = ctx[5]("accountCenter.disconnectAllWallets", {
    default: en.accountCenter.disconnectAllWallets
  }) + "";
  let t4;
  let mounted;
  let dispose;
  return {
    c() {
      div1 = element("div");
      div0 = element("div");
      t0 = space();
      span0 = element("span");
      t1 = text(t1_value);
      t2 = space();
      div3 = element("div");
      div2 = element("div");
      t3 = space();
      span1 = element("span");
      t4 = text(t4_value);
      attr(div0, "class", "plus-icon flex items-center justify-center svelte-jvefs6");
      attr(span0, "class", "action-text svelte-jvefs6");
      attr(div1, "class", "action-container flex items-center pointer svelte-jvefs6");
      attr(div2, "class", "arrow-forward flex items-center justify-center svelte-jvefs6");
      attr(span1, "class", "action-text svelte-jvefs6");
      attr(div3, "class", "action-container flex items-center mt pointer svelte-jvefs6");
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      append(div1, div0);
      div0.innerHTML = plusCircleIcon;
      append(div1, t0);
      append(div1, span0);
      append(span0, t1);
      insert(target, t2, anchor);
      insert(target, div3, anchor);
      append(div3, div2);
      div2.innerHTML = arrowForwardIcon;
      append(div3, t3);
      append(div3, span1);
      append(span1, t4);
      if (!mounted) {
        dispose = [
          listen(div1, "click", ctx[16]),
          listen(div3, "click", ctx[17])
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty & 32 && t1_value !== (t1_value = ctx2[5]("accountCenter.connectAnotherWallet", {
        default: en.accountCenter.connectAnotherWallet
      }) + ""))
        set_data(t1, t1_value);
      if (dirty & 32 && t4_value !== (t4_value = ctx2[5]("accountCenter.disconnectAllWallets", {
        default: en.accountCenter.disconnectAllWallets
      }) + ""))
        set_data(t4, t4_value);
    },
    d(detaching) {
      if (detaching)
        detach(div1);
      if (detaching)
        detach(t2);
      if (detaching)
        detach(div3);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_if_block_3(ctx) {
  let div;
  let successstatusicon;
  let current;
  successstatusicon = new SuccessStatusIcon({ props: { size: 14 } });
  return {
    c() {
      div = element("div");
      create_component(successstatusicon.$$.fragment);
      set_style(div, "right", "-5px");
      set_style(div, "bottom", "-5px");
      attr(div, "class", "drop-shadow absolute");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      mount_component(successstatusicon, div, null);
      current = true;
    },
    i(local) {
      if (current)
        return;
      transition_in(successstatusicon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(successstatusicon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div);
      destroy_component(successstatusicon);
    }
  };
}
function create_if_block$2(ctx) {
  let div;
  let h4;
  let t0_value = ctx[5]("accountCenter.appInfo", { default: en.accountCenter.appInfo }) + "";
  let t0;
  let t1;
  let t2;
  let if_block0 = ctx[8].gettingStartedGuide && create_if_block_2(ctx);
  let if_block1 = ctx[8].explore && create_if_block_1$1(ctx);
  return {
    c() {
      div = element("div");
      h4 = element("h4");
      t0 = text(t0_value);
      t1 = space();
      if (if_block0)
        if_block0.c();
      t2 = space();
      if (if_block1)
        if_block1.c();
      attr(h4, "class", "app-info-heading svelte-jvefs6");
      attr(div, "class", "app-info svelte-jvefs6");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, h4);
      append(h4, t0);
      append(div, t1);
      if (if_block0)
        if_block0.m(div, null);
      append(div, t2);
      if (if_block1)
        if_block1.m(div, null);
    },
    p(ctx2, dirty) {
      if (dirty & 32 && t0_value !== (t0_value = ctx2[5]("accountCenter.appInfo", { default: en.accountCenter.appInfo }) + ""))
        set_data(t0, t0_value);
      if (ctx2[8].gettingStartedGuide)
        if_block0.p(ctx2, dirty);
      if (ctx2[8].explore)
        if_block1.p(ctx2, dirty);
    },
    d(detaching) {
      if (detaching)
        detach(div);
      if (if_block0)
        if_block0.d();
      if (if_block1)
        if_block1.d();
    }
  };
}
function create_if_block_2(ctx) {
  let div1;
  let div0;
  let t0_value = ctx[5]("accountCenter.learnMore", { default: en.accountCenter.learnMore }) + "";
  let t0;
  let t1;
  let a;
  let t2_value = ctx[5]("accountCenter.gettingStartedGuide", {
    default: en.accountCenter.gettingStartedGuide
  }) + "";
  let t2;
  return {
    c() {
      div1 = element("div");
      div0 = element("div");
      t0 = text(t0_value);
      t1 = space();
      a = element("a");
      t2 = text(t2_value);
      attr(a, "href", ctx[8].gettingStartedGuide);
      attr(a, "target", "_blank");
      attr(a, "rel", "noreferrer noopener");
      attr(a, "class", "svelte-jvefs6");
      attr(div1, "class", "flex justify-between items-center mt7 svelte-jvefs6");
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      append(div1, div0);
      append(div0, t0);
      append(div1, t1);
      append(div1, a);
      append(a, t2);
    },
    p(ctx2, dirty) {
      if (dirty & 32 && t0_value !== (t0_value = ctx2[5]("accountCenter.learnMore", { default: en.accountCenter.learnMore }) + ""))
        set_data(t0, t0_value);
      if (dirty & 32 && t2_value !== (t2_value = ctx2[5]("accountCenter.gettingStartedGuide", {
        default: en.accountCenter.gettingStartedGuide
      }) + ""))
        set_data(t2, t2_value);
    },
    d(detaching) {
      if (detaching)
        detach(div1);
    }
  };
}
function create_if_block_1$1(ctx) {
  let div1;
  let div0;
  let t0_value = ctx[5]("accountCenter.smartContracts", { default: en.accountCenter.smartContracts }) + "";
  let t0;
  let t1;
  let a;
  let t2_value = ctx[5]("accountCenter.explore", { default: en.accountCenter.explore }) + "";
  let t2;
  return {
    c() {
      div1 = element("div");
      div0 = element("div");
      t0 = text(t0_value);
      t1 = space();
      a = element("a");
      t2 = text(t2_value);
      attr(a, "href", ctx[8].explore);
      attr(a, "target", "_blank");
      attr(a, "rel", "noreferrer noopener");
      attr(a, "class", "svelte-jvefs6");
      attr(div1, "class", "flex justify-between items-center mt7 svelte-jvefs6");
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      append(div1, div0);
      append(div0, t0);
      append(div1, t1);
      append(div1, a);
      append(a, t2);
    },
    p(ctx2, dirty) {
      if (dirty & 32 && t0_value !== (t0_value = ctx2[5]("accountCenter.smartContracts", { default: en.accountCenter.smartContracts }) + ""))
        set_data(t0, t0_value);
      if (dirty & 32 && t2_value !== (t2_value = ctx2[5]("accountCenter.explore", { default: en.accountCenter.explore }) + ""))
        set_data(t2, t2_value);
    },
    d(detaching) {
      if (detaching)
        detach(div1);
    }
  };
}
function create_fragment$3(ctx) {
  let t0;
  let div16;
  let div15;
  let div2;
  let div0;
  let each_blocks = [];
  let each_1_lookup = /* @__PURE__ */ new Map();
  let t1;
  let div1;
  let t2;
  let div14;
  let div7;
  let div3;
  let walletappbadge0;
  let t3;
  let t4;
  let div6;
  let div4;
  let t5_value = ctx[5]("accountCenter.currentNetwork", { default: en.accountCenter.currentNetwork }) + "";
  let t5;
  let t6;
  let div5;
  let networkselector;
  let t7;
  let div13;
  let div11;
  let div9;
  let walletappbadge1;
  let t8;
  let div8;
  let successstatusicon;
  let t9;
  let div10;
  let h4;
  let t11;
  let p;
  let t13;
  let t14;
  let button;
  let t15_value = ctx[5]("accountCenter.backToApp", { default: en.accountCenter.backToApp }) + "";
  let t15;
  let t16;
  let a;
  let span;
  let t17_value = ctx[5]("accountCenter.poweredBy", { default: en.accountCenter.poweredBy }) + "";
  let t17;
  let t18;
  let div12;
  let div16_intro;
  let current;
  let mounted;
  let dispose;
  let if_block0 = ctx[1] && create_if_block_5(ctx);
  let each_value = ctx[0];
  const get_key = (ctx2) => ctx2[19].label;
  for (let i = 0; i < each_value.length; i += 1) {
    let child_ctx = get_each_context(ctx, each_value, i);
    let key = get_key(child_ctx);
    each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
  }
  let if_block1 = ctx[10].type === "desktop" && create_if_block_4(ctx);
  walletappbadge0 = new WalletAppBadge({
    props: {
      size: 32,
      padding: 4,
      background: "custom",
      color: !ctx[4] ? "#FFAF00" : !ctx[4].icon ? "#EFF1FC" : void 0,
      customBackgroundColor: ctx[4] ? ctx[4].color || ctx[3] && ctx[3].color || unrecognizedChainStyle.color : "#FFE7B3",
      border: "transparent",
      radius: 8,
      icon: ctx[4] ? ctx[4].icon || ctx[3] && ctx[3].icon || unrecognizedChainStyle.icon : warningIcon
    }
  });
  let if_block2 = ctx[4] && create_if_block_3();
  networkselector = new NetworkSelector({
    props: {
      chains: ctx[7],
      colorVar: "--account-center-maximized-network-selector-color",
      bold: true,
      selectIcon: caretLightIcon,
      parentCSSId: "maximized_ac"
    }
  });
  walletappbadge1 = new WalletAppBadge({
    props: {
      size: 32,
      padding: 4,
      background: "transparent",
      border: "black",
      radius: 8,
      icon: ctx[8] && ctx[8].icon || questionIcon
    }
  });
  successstatusicon = new SuccessStatusIcon({ props: { size: 14, color: "blue" } });
  let if_block3 = ctx[8] && (ctx[8].gettingStartedGuide || ctx[8].explore) && create_if_block$2(ctx);
  return {
    c() {
      if (if_block0)
        if_block0.c();
      t0 = space();
      div16 = element("div");
      div15 = element("div");
      div2 = element("div");
      div0 = element("div");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      t1 = space();
      div1 = element("div");
      if (if_block1)
        if_block1.c();
      t2 = space();
      div14 = element("div");
      div7 = element("div");
      div3 = element("div");
      create_component(walletappbadge0.$$.fragment);
      t3 = space();
      if (if_block2)
        if_block2.c();
      t4 = space();
      div6 = element("div");
      div4 = element("div");
      t5 = text(t5_value);
      t6 = space();
      div5 = element("div");
      create_component(networkselector.$$.fragment);
      t7 = space();
      div13 = element("div");
      div11 = element("div");
      div9 = element("div");
      create_component(walletappbadge1.$$.fragment);
      t8 = space();
      div8 = element("div");
      create_component(successstatusicon.$$.fragment);
      t9 = space();
      div10 = element("div");
      h4 = element("h4");
      h4.textContent = `${ctx[8] && ctx[8].name || "App Name"}`;
      t11 = space();
      p = element("p");
      p.textContent = `${ctx[8] && ctx[8].description || "This app has not added a description."}`;
      t13 = space();
      if (if_block3)
        if_block3.c();
      t14 = space();
      button = element("button");
      t15 = text(t15_value);
      t16 = space();
      a = element("a");
      span = element("span");
      t17 = text(t17_value);
      t18 = space();
      div12 = element("div");
      attr(div0, "class", "wallets svelte-jvefs6");
      attr(div1, "class", "actions flex flex-column items-start svelte-jvefs6");
      attr(div2, "class", "p5 svelte-jvefs6");
      attr(div3, "class", "relative flex");
      attr(div4, "class", "network-selector-label svelte-jvefs6");
      attr(div5, "class", "flex items-center");
      set_style(div5, "width", "100%");
      attr(div6, "class", "network-selector-container svelte-jvefs6");
      attr(div7, "class", "flex items-center p5-5 svelte-jvefs6");
      set_style(div8, "right", "-5px");
      set_style(div8, "bottom", "-5px");
      attr(div8, "class", "drop-shadow absolute");
      attr(div9, "class", "relative flex");
      attr(h4, "class", "app-name svelte-jvefs6");
      attr(p, "class", "app-description svelte-jvefs6");
      attr(div10, "class", "ml4 svelte-jvefs6");
      attr(div11, "class", "flex items-start");
      attr(button, "class", "app-button button-neutral-solid svelte-jvefs6");
      attr(span, "class", "powered-by svelte-jvefs6");
      attr(div12, "class", "flex items-center");
      set_style(div12, "width", "83px");
      set_style(div12, "margin-left", "4px");
      attr(a, "href", "https://blocknative.com");
      attr(a, "target", "_blank");
      attr(a, "rel", "noopener noreferrer");
      attr(a, "class", "flex justify-center items-center powered-by-container svelte-jvefs6");
      attr(div13, "class", "app-info-container svelte-jvefs6");
      attr(div14, "class", "network-container shadow-1 svelte-jvefs6");
      toggle_class(div14, "background-blue", ctx[4] && ctx[4].icon || ctx[3]);
      toggle_class(div14, "background-yellow", !ctx[4]);
      toggle_class(div14, "background-gray", ctx[4] && !ctx[3]);
      attr(div15, "class", "wallets-section svelte-jvefs6");
      attr(div16, "class", "outer-container svelte-jvefs6");
    },
    m(target, anchor) {
      if (if_block0)
        if_block0.m(target, anchor);
      insert(target, t0, anchor);
      insert(target, div16, anchor);
      append(div16, div15);
      append(div15, div2);
      append(div2, div0);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].m(div0, null);
      }
      append(div2, t1);
      append(div2, div1);
      if (if_block1)
        if_block1.m(div1, null);
      append(div15, t2);
      append(div15, div14);
      append(div14, div7);
      append(div7, div3);
      mount_component(walletappbadge0, div3, null);
      append(div3, t3);
      if (if_block2)
        if_block2.m(div3, null);
      append(div7, t4);
      append(div7, div6);
      append(div6, div4);
      append(div4, t5);
      append(div6, t6);
      append(div6, div5);
      mount_component(networkselector, div5, null);
      append(div14, t7);
      append(div14, div13);
      append(div13, div11);
      append(div11, div9);
      mount_component(walletappbadge1, div9, null);
      append(div9, t8);
      append(div9, div8);
      mount_component(successstatusicon, div8, null);
      append(div11, t9);
      append(div11, div10);
      append(div10, h4);
      append(div10, t11);
      append(div10, p);
      append(div13, t13);
      if (if_block3)
        if_block3.m(div13, null);
      append(div13, t14);
      append(div13, button);
      append(button, t15);
      append(div13, t16);
      append(div13, a);
      append(a, span);
      append(span, t17);
      append(a, t18);
      append(a, div12);
      div12.innerHTML = blocknative;
      current = true;
      if (!mounted) {
        dispose = [
          listen(div5, "click", ctx[13]),
          listen(button, "click", ctx[18]),
          listen(div16, "click", stop_propagation(function() {
            if (is_function(ctx[2]))
              ctx[2].apply(this, arguments);
          }))
        ];
        mounted = true;
      }
    },
    p(new_ctx, [dirty]) {
      ctx = new_ctx;
      if (ctx[1]) {
        if (if_block0) {
          if_block0.p(ctx, dirty);
          if (dirty & 2) {
            transition_in(if_block0, 1);
          }
        } else {
          if_block0 = create_if_block_5(ctx);
          if_block0.c();
          transition_in(if_block0, 1);
          if_block0.m(t0.parentNode, t0);
        }
      } else if (if_block0) {
        group_outros();
        transition_out(if_block0, 1, 1, () => {
          if_block0 = null;
        });
        check_outros();
      }
      if (dirty & 5) {
        each_value = ctx[0];
        group_outros();
        each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div0, outro_and_destroy_block, create_each_block, null, get_each_context);
        check_outros();
      }
      if (ctx[10].type === "desktop")
        if_block1.p(ctx, dirty);
      const walletappbadge0_changes = {};
      if (dirty & 16)
        walletappbadge0_changes.color = !ctx[4] ? "#FFAF00" : !ctx[4].icon ? "#EFF1FC" : void 0;
      if (dirty & 24)
        walletappbadge0_changes.customBackgroundColor = ctx[4] ? ctx[4].color || ctx[3] && ctx[3].color || unrecognizedChainStyle.color : "#FFE7B3";
      if (dirty & 24)
        walletappbadge0_changes.icon = ctx[4] ? ctx[4].icon || ctx[3] && ctx[3].icon || unrecognizedChainStyle.icon : warningIcon;
      walletappbadge0.$set(walletappbadge0_changes);
      if (ctx[4]) {
        if (if_block2) {
          if (dirty & 16) {
            transition_in(if_block2, 1);
          }
        } else {
          if_block2 = create_if_block_3();
          if_block2.c();
          transition_in(if_block2, 1);
          if_block2.m(div3, null);
        }
      } else if (if_block2) {
        group_outros();
        transition_out(if_block2, 1, 1, () => {
          if_block2 = null;
        });
        check_outros();
      }
      if ((!current || dirty & 32) && t5_value !== (t5_value = ctx[5]("accountCenter.currentNetwork", { default: en.accountCenter.currentNetwork }) + ""))
        set_data(t5, t5_value);
      if (ctx[8] && (ctx[8].gettingStartedGuide || ctx[8].explore))
        if_block3.p(ctx, dirty);
      if ((!current || dirty & 32) && t15_value !== (t15_value = ctx[5]("accountCenter.backToApp", { default: en.accountCenter.backToApp }) + ""))
        set_data(t15, t15_value);
      if ((!current || dirty & 32) && t17_value !== (t17_value = ctx[5]("accountCenter.poweredBy", { default: en.accountCenter.poweredBy }) + ""))
        set_data(t17, t17_value);
      if (!current || dirty & 24) {
        toggle_class(div14, "background-blue", ctx[4] && ctx[4].icon || ctx[3]);
      }
      if (!current || dirty & 16) {
        toggle_class(div14, "background-yellow", !ctx[4]);
      }
      if (!current || dirty & 24) {
        toggle_class(div14, "background-gray", ctx[4] && !ctx[3]);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block0);
      for (let i = 0; i < each_value.length; i += 1) {
        transition_in(each_blocks[i]);
      }
      transition_in(walletappbadge0.$$.fragment, local);
      transition_in(if_block2);
      transition_in(networkselector.$$.fragment, local);
      transition_in(walletappbadge1.$$.fragment, local);
      transition_in(successstatusicon.$$.fragment, local);
      if (!div16_intro) {
        add_render_callback(() => {
          div16_intro = create_in_transition(div16, fly, {
            delay: ctx[9].includes("top") ? 100 : 0,
            duration: 600,
            y: ctx[9].includes("top") ? 56 : -76,
            easing: quartOut,
            opacity: 0
          });
          div16_intro.start();
        });
      }
      current = true;
    },
    o(local) {
      transition_out(if_block0);
      for (let i = 0; i < each_blocks.length; i += 1) {
        transition_out(each_blocks[i]);
      }
      transition_out(walletappbadge0.$$.fragment, local);
      transition_out(if_block2);
      transition_out(networkselector.$$.fragment, local);
      transition_out(walletappbadge1.$$.fragment, local);
      transition_out(successstatusicon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (if_block0)
        if_block0.d(detaching);
      if (detaching)
        detach(t0);
      if (detaching)
        detach(div16);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].d();
      }
      if (if_block1)
        if_block1.d();
      destroy_component(walletappbadge0);
      if (if_block2)
        if_block2.d();
      destroy_component(networkselector);
      destroy_component(walletappbadge1);
      destroy_component(successstatusicon);
      if (if_block3)
        if_block3.d();
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance$3($$self, $$props, $$invalidate) {
  let primaryWallet;
  let connectedChain;
  let validAppChain;
  let defaultChainStyles;
  let $wallets$;
  let $_;
  component_subscribe($$self, wallets$, ($$value) => $$invalidate(0, $wallets$ = $$value));
  component_subscribe($$self, Y, ($$value) => $$invalidate(5, $_ = $$value));
  function disconnectAllWallets() {
    $wallets$.forEach(({ label }) => disconnect({ label }));
  }
  const { chains: appChains } = state.get();
  const { appMetadata } = configuration;
  let disconnectConfirmModal = false;
  let hideWalletRowMenu;
  const { position } = state.get().accountCenter;
  const { device } = configuration;
  function click_handler(event) {
    bubble.call(this, $$self, event);
  }
  const func = () => $$invalidate(1, disconnectConfirmModal = false);
  function walletrow_hideMenu_binding(value) {
    hideWalletRowMenu = value;
    $$invalidate(2, hideWalletRowMenu);
  }
  const click_handler_1 = () => connect$1();
  const click_handler_2 = () => $$invalidate(1, disconnectConfirmModal = true);
  const click_handler_3 = () => updateAccountCenter({ expanded: false });
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 1) {
      $$invalidate(12, [primaryWallet] = $wallets$, primaryWallet);
    }
    if ($$self.$$.dirty & 4096) {
      $$invalidate(11, [connectedChain] = primaryWallet ? primaryWallet.chains : [], connectedChain);
    }
    if ($$self.$$.dirty & 2048) {
      $$invalidate(4, validAppChain = appChains.find(({ id, namespace }) => connectedChain ? id === connectedChain.id && namespace === connectedChain.namespace : false));
    }
    if ($$self.$$.dirty & 2048) {
      $$invalidate(3, defaultChainStyles = getDefaultChainStyles(connectedChain && connectedChain.id));
    }
  };
  return [
    $wallets$,
    disconnectConfirmModal,
    hideWalletRowMenu,
    defaultChainStyles,
    validAppChain,
    $_,
    disconnectAllWallets,
    appChains,
    appMetadata,
    position,
    device,
    connectedChain,
    primaryWallet,
    click_handler,
    func,
    walletrow_hideMenu_binding,
    click_handler_1,
    click_handler_2,
    click_handler_3
  ];
}
class Maximized extends SvelteComponent {
  constructor(options) {
    super();
    init$1(this, options, instance$3, create_fragment$3, safe_not_equal, {}, add_css$2);
  }
}
function add_css$1(target) {
  append_styles(target, "svelte-13pjibp", ".minimized.svelte-13pjibp{background:var(\n      --account-center-minimized-background,\n      var(--onboard-white, var(--white))\n    );border:1px solid\n      var(--account-center-border, var(--onboard-gray-100, var(--gray-100)));width:100%;box-shadow:var(\n      --account-center-box-shadow,\n      var(--onboard-shadow-3, var(--shadow-3))\n    );pointer-events:auto}.radius.svelte-13pjibp{border-radius:var(\n      --account-center-border-radius,\n      var(--onboard-border-radius-3, var(--border-radius-3))\n    )}.padding-5.svelte-13pjibp{padding:var(--onboard-spacing-5, var(--spacing-5))}.drop-shadow.svelte-13pjibp{filter:drop-shadow(0px 1px 4px rgba(0, 0, 0, 0.2))}.address.svelte-13pjibp{font-weight:700;line-height:var(--onboard-font-line-height-2, var(--font-line-height-2));color:var(--account-center-minimized-address-color, initial)}.balance.svelte-13pjibp{font-weight:400;line-height:var(--onboard-font-line-height-2, var(--font-line-height-2));color:var(\n      --account-center-minimized-balance-color,\n      var(--onboard-gray-400, var(--gray-400))\n    );overflow:hidden;white-space:nowrap;text-overflow:ellipsis;width:7.25rem}.network.svelte-13pjibp{margin-left:0.2rem}.chain-icon.svelte-13pjibp{width:22px;height:22px;padding:4px;border-radius:25px;margin-right:4px}.container.svelte-13pjibp{border:1px solid transparent;border-radius:16px;padding:1px;transition:border-color 250ms ease-in-out, backround 250ms ease-in-out;max-width:128px;cursor:default}.color-yellow.svelte-13pjibp{color:var(\n      --account-center-chain-warning,\n      var(--onboard-warning-500, var(--warning-500))\n    )}.color-white.svelte-13pjibp{color:var(--onboard-primary-100, var(--primary-100))}");
}
function create_if_block$1(ctx) {
  let div;
  let t0_value = (ctx[4].length > 8 ? ctx[4].slice(0, 8) : ctx[4]) + "";
  let t0;
  let t1;
  let t2;
  let div_intro;
  return {
    c() {
      div = element("div");
      t0 = text(t0_value);
      t1 = space();
      t2 = text(ctx[1]);
      attr(div, "class", "balance svelte-13pjibp");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, t0);
      append(div, t1);
      append(div, t2);
    },
    p(ctx2, dirty) {
      if (dirty & 16 && t0_value !== (t0_value = (ctx2[4].length > 8 ? ctx2[4].slice(0, 8) : ctx2[4]) + ""))
        set_data(t0, t0_value);
      if (dirty & 2)
        set_data(t2, ctx2[1]);
    },
    i(local) {
      if (!div_intro) {
        add_render_callback(() => {
          div_intro = create_in_transition(div, fade, {});
          div_intro.start();
        });
      }
    },
    o: noop,
    d(detaching) {
      if (detaching)
        detach(div);
    }
  };
}
function create_fragment$2(ctx) {
  let div12;
  let div11;
  let div6;
  let div3;
  let div0;
  let walletappbadge0;
  let t0;
  let div1;
  let walletappbadge1;
  let t1;
  let div2;
  let successstatusicon;
  let t2;
  let div5;
  let div4;
  let t3_value = (ctx[6] ? shortenEns(ctx[6]) : ctx[5]) + "";
  let t3;
  let t4;
  let t5;
  let div10;
  let div9;
  let div8;
  let div7;
  let raw_value = (ctx[3] ? ctx[3].icon || ctx[2] && ctx[2].icon || unrecognizedChainStyle.icon : warningIcon) + "";
  let div7_style_value;
  let t6;
  let networkselector;
  let div9_style_value;
  let div12_intro;
  let div12_outro;
  let current;
  let mounted;
  let dispose;
  walletappbadge0 = new WalletAppBadge({
    props: {
      size: 32,
      padding: 4,
      background: "white",
      border: "darkGreen",
      radius: 8,
      icon: ctx[7]
    }
  });
  walletappbadge1 = new WalletAppBadge({
    props: {
      size: 32,
      padding: 4,
      background: "green",
      border: "darkGreen",
      radius: 8,
      icon: ctx[0] ? ctx[0].icon : ""
    }
  });
  successstatusicon = new SuccessStatusIcon({ props: { size: 14 } });
  let if_block = ctx[4] && create_if_block$1(ctx);
  networkselector = new NetworkSelector({
    props: {
      chains: ctx[8],
      colorVar: "--account-center-minimized-network-selector-color",
      selectIcon: caretIcon,
      parentCSSId: "minimized_ac"
    }
  });
  return {
    c() {
      div12 = element("div");
      div11 = element("div");
      div6 = element("div");
      div3 = element("div");
      div0 = element("div");
      create_component(walletappbadge0.$$.fragment);
      t0 = space();
      div1 = element("div");
      create_component(walletappbadge1.$$.fragment);
      t1 = space();
      div2 = element("div");
      create_component(successstatusicon.$$.fragment);
      t2 = space();
      div5 = element("div");
      div4 = element("div");
      t3 = text(t3_value);
      t4 = space();
      if (if_block)
        if_block.c();
      t5 = space();
      div10 = element("div");
      div9 = element("div");
      div8 = element("div");
      div7 = element("div");
      t6 = space();
      create_component(networkselector.$$.fragment);
      attr(div0, "class", "drop-shadow svelte-13pjibp");
      set_style(div1, "right", "0.5rem");
      attr(div1, "class", "drop-shadow relative svelte-13pjibp");
      set_style(div2, "right", "5px");
      set_style(div2, "bottom", "-5px");
      attr(div2, "class", "drop-shadow absolute svelte-13pjibp");
      attr(div3, "class", "flex items-centered relative");
      attr(div4, "class", "address svelte-13pjibp");
      attr(div5, "class", "flex flex-column");
      set_style(div5, "height", "40px");
      attr(div6, "class", "flex items-center w-100");
      attr(div7, "class", "chain-icon flex justify-center items-center svelte-13pjibp");
      attr(div7, "style", div7_style_value = `background-color: ${ctx[3] ? ctx[3].color || ctx[2] && ctx[2].color || unrecognizedChainStyle.color : "var(--onboard-warning-200, var(--warning-200))"};`);
      toggle_class(div7, "color-yellow", !ctx[3]);
      toggle_class(div7, "color-white", ctx[3] && !ctx[3].icon);
      attr(div8, "class", "flex items-center");
      attr(div9, "class", "container shadow-1 flex items-center svelte-13pjibp");
      attr(div9, "style", div9_style_value = `border-color: var(${ctx[3] ? "--onboard-primary-200, var(--primary-200)" : "--onboard-warning-500, var(--warning-500)"}); background-color: var(${ctx[3] ? "--account-center-minimized-chain-select-background, var(--primary-100)" : "--account-center-minimized-chain-select-background-warning, var(--warning-100)"})`);
      attr(div10, "class", "network svelte-13pjibp");
      attr(div11, "class", "flex items-center justify-between");
      set_style(div11, "padding", "0 4px");
      attr(div12, "class", "minimized pointer radius padding-5 svelte-13pjibp");
    },
    m(target, anchor) {
      insert(target, div12, anchor);
      append(div12, div11);
      append(div11, div6);
      append(div6, div3);
      append(div3, div0);
      mount_component(walletappbadge0, div0, null);
      append(div3, t0);
      append(div3, div1);
      mount_component(walletappbadge1, div1, null);
      append(div3, t1);
      append(div3, div2);
      mount_component(successstatusicon, div2, null);
      append(div6, t2);
      append(div6, div5);
      append(div5, div4);
      append(div4, t3);
      append(div5, t4);
      if (if_block)
        if_block.m(div5, null);
      append(div11, t5);
      append(div11, div10);
      append(div10, div9);
      append(div9, div8);
      append(div8, div7);
      div7.innerHTML = raw_value;
      append(div8, t6);
      mount_component(networkselector, div8, null);
      current = true;
      if (!mounted) {
        dispose = [
          listen(div9, "click", stop_propagation(ctx[13])),
          listen(div12, "click", stop_propagation(ctx[9]))
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      const walletappbadge1_changes = {};
      if (dirty & 1)
        walletappbadge1_changes.icon = ctx2[0] ? ctx2[0].icon : "";
      walletappbadge1.$set(walletappbadge1_changes);
      if ((!current || dirty & 96) && t3_value !== (t3_value = (ctx2[6] ? shortenEns(ctx2[6]) : ctx2[5]) + ""))
        set_data(t3, t3_value);
      if (ctx2[4]) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty & 16) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block$1(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(div5, null);
        }
      } else if (if_block) {
        if_block.d(1);
        if_block = null;
      }
      if ((!current || dirty & 12) && raw_value !== (raw_value = (ctx2[3] ? ctx2[3].icon || ctx2[2] && ctx2[2].icon || unrecognizedChainStyle.icon : warningIcon) + ""))
        div7.innerHTML = raw_value;
      if (!current || dirty & 12 && div7_style_value !== (div7_style_value = `background-color: ${ctx2[3] ? ctx2[3].color || ctx2[2] && ctx2[2].color || unrecognizedChainStyle.color : "var(--onboard-warning-200, var(--warning-200))"};`)) {
        attr(div7, "style", div7_style_value);
      }
      if (!current || dirty & 8) {
        toggle_class(div7, "color-yellow", !ctx2[3]);
      }
      if (!current || dirty & 8) {
        toggle_class(div7, "color-white", ctx2[3] && !ctx2[3].icon);
      }
      if (!current || dirty & 8 && div9_style_value !== (div9_style_value = `border-color: var(${ctx2[3] ? "--onboard-primary-200, var(--primary-200)" : "--onboard-warning-500, var(--warning-500)"}); background-color: var(${ctx2[3] ? "--account-center-minimized-chain-select-background, var(--primary-100)" : "--account-center-minimized-chain-select-background-warning, var(--warning-100)"})`)) {
        attr(div9, "style", div9_style_value);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(walletappbadge0.$$.fragment, local);
      transition_in(walletappbadge1.$$.fragment, local);
      transition_in(successstatusicon.$$.fragment, local);
      transition_in(if_block);
      transition_in(networkselector.$$.fragment, local);
      add_render_callback(() => {
        if (div12_outro)
          div12_outro.end(1);
        div12_intro = create_in_transition(div12, fade, { duration: 250 });
        div12_intro.start();
      });
      current = true;
    },
    o(local) {
      transition_out(walletappbadge0.$$.fragment, local);
      transition_out(walletappbadge1.$$.fragment, local);
      transition_out(successstatusicon.$$.fragment, local);
      transition_out(networkselector.$$.fragment, local);
      if (div12_intro)
        div12_intro.invalidate();
      div12_outro = create_out_transition(div12, fade, { duration: 100 });
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div12);
      destroy_component(walletappbadge0);
      destroy_component(walletappbadge1);
      destroy_component(successstatusicon);
      if (if_block)
        if_block.d();
      destroy_component(networkselector);
      if (detaching && div12_outro)
        div12_outro.end();
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance$2($$self, $$props, $$invalidate) {
  let primaryWallet;
  let firstAccount;
  let ensName;
  let shortenedFirstAddress;
  let firstAddressAsset;
  let firstAddressBalance;
  let primaryChain;
  let validAppChain;
  let defaultChainStyles;
  let $wallets$;
  component_subscribe($$self, wallets$, ($$value) => $$invalidate(12, $wallets$ = $$value));
  const { appMetadata } = configuration;
  const appIcon = appMetadata && appMetadata.icon || questionIcon;
  const chains = state.get().chains;
  function maximize() {
    updateAccountCenter({ expanded: true });
  }
  function click_handler(event) {
    bubble.call(this, $$self, event);
  }
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 4096) {
      $$invalidate(0, [primaryWallet] = $wallets$, primaryWallet);
    }
    if ($$self.$$.dirty & 1) {
      $$invalidate(11, [firstAccount] = primaryWallet ? primaryWallet.accounts : [], firstAccount);
    }
    if ($$self.$$.dirty & 2048) {
      $$invalidate(6, ensName = firstAccount && firstAccount.ens && shortenEns(firstAccount.ens.name));
    }
    if ($$self.$$.dirty & 2048) {
      $$invalidate(5, shortenedFirstAddress = firstAccount ? shortenAddress(firstAccount.address) : "");
    }
    if ($$self.$$.dirty & 2048) {
      $$invalidate(
        1,
        [firstAddressAsset] = firstAccount && firstAccount.balance ? Object.keys(firstAccount.balance) : [],
        firstAddressAsset
      );
    }
    if ($$self.$$.dirty & 2050) {
      $$invalidate(4, firstAddressBalance = firstAccount && firstAccount.balance ? firstAccount.balance[firstAddressAsset] : null);
    }
    if ($$self.$$.dirty & 1) {
      $$invalidate(10, primaryChain = primaryWallet && primaryWallet.chains[0]);
    }
    if ($$self.$$.dirty & 1024) {
      $$invalidate(3, validAppChain = chains.find(({ id, namespace }) => primaryChain ? id === primaryChain.id && namespace === primaryChain.namespace : false));
    }
    if ($$self.$$.dirty & 1024) {
      $$invalidate(2, defaultChainStyles = getDefaultChainStyles(primaryChain && primaryChain.id));
    }
  };
  return [
    primaryWallet,
    firstAddressAsset,
    defaultChainStyles,
    validAppChain,
    firstAddressBalance,
    shortenedFirstAddress,
    ensName,
    appIcon,
    chains,
    maximize,
    primaryChain,
    firstAccount,
    $wallets$,
    click_handler
  ];
}
class Minimized extends SvelteComponent {
  constructor(options) {
    super();
    init$1(this, options, instance$2, create_fragment$2, safe_not_equal, {}, add_css$1);
  }
}
function add_css(target) {
  append_styles(target, "svelte-cjyox5", ".minimized.svelte-cjyox5{background:var(\n      --account-center-micro-background,\n      var(--onboard-white, var(--white))\n    );border:1px solid\n      var(--acount-center-border, var(--onboard-gray-100, var(--gray-100)));box-shadow:var(\n      --account-center-box-shadow,\n      var(--onboard-shadow-3, var(--shadow-3))\n    );width:80px;pointer-events:auto}.radius.svelte-cjyox5{border-radius:var(\n      --account-center-border-radius,\n      var(--onboard-border-radius-3, var(--border-radius-3))\n    )}.drop-shadow.svelte-cjyox5{filter:drop-shadow(0px 1px 4px rgba(0, 0, 0, 0.2))}.inner-box-wrapper.svelte-cjyox5{display:flex;flex-flow:row nowrap;padding:12px}.wallet-square-wrapper.svelte-cjyox5{position:relative;margin-left:-8px}.check-icon-wrapper.svelte-cjyox5{position:absolute;right:-4px;bottom:-4px}");
}
function create_fragment$1(ctx) {
  let div5;
  let div4;
  let div0;
  let walletappbadge0;
  let t0;
  let div3;
  let div1;
  let walletappbadge1;
  let t1;
  let div2;
  let successstatusicon;
  let current;
  let mounted;
  let dispose;
  walletappbadge0 = new WalletAppBadge({
    props: {
      size: 32,
      padding: 4,
      background: "white",
      border: "darkGreen",
      radius: 8,
      icon: ctx[1]
    }
  });
  walletappbadge1 = new WalletAppBadge({
    props: {
      size: 32,
      padding: 4,
      background: "green",
      border: "darkGreen",
      radius: 8,
      icon: ctx[0] ? ctx[0].icon : ""
    }
  });
  successstatusicon = new SuccessStatusIcon({ props: { size: 14 } });
  return {
    c() {
      div5 = element("div");
      div4 = element("div");
      div0 = element("div");
      create_component(walletappbadge0.$$.fragment);
      t0 = space();
      div3 = element("div");
      div1 = element("div");
      create_component(walletappbadge1.$$.fragment);
      t1 = space();
      div2 = element("div");
      create_component(successstatusicon.$$.fragment);
      attr(div0, "class", "drop-shadow svelte-cjyox5");
      attr(div1, "class", "drop-shadow svelte-cjyox5");
      attr(div2, "class", "check-icon-wrapper drop-shadow svelte-cjyox5");
      attr(div3, "class", "wallet-square-wrapper svelte-cjyox5");
      attr(div4, "class", "inner-box-wrapper svelte-cjyox5");
      attr(div5, "class", "minimized pointer radius svelte-cjyox5");
    },
    m(target, anchor) {
      insert(target, div5, anchor);
      append(div5, div4);
      append(div4, div0);
      mount_component(walletappbadge0, div0, null);
      append(div4, t0);
      append(div4, div3);
      append(div3, div1);
      mount_component(walletappbadge1, div1, null);
      append(div3, t1);
      append(div3, div2);
      mount_component(successstatusicon, div2, null);
      current = true;
      if (!mounted) {
        dispose = listen(div5, "click", stop_propagation(ctx[2]));
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      const walletappbadge1_changes = {};
      if (dirty & 1)
        walletappbadge1_changes.icon = ctx2[0] ? ctx2[0].icon : "";
      walletappbadge1.$set(walletappbadge1_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(walletappbadge0.$$.fragment, local);
      transition_in(walletappbadge1.$$.fragment, local);
      transition_in(successstatusicon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(walletappbadge0.$$.fragment, local);
      transition_out(walletappbadge1.$$.fragment, local);
      transition_out(successstatusicon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div5);
      destroy_component(walletappbadge0);
      destroy_component(walletappbadge1);
      destroy_component(successstatusicon);
      mounted = false;
      dispose();
    }
  };
}
function instance$1($$self, $$props, $$invalidate) {
  let primaryWallet;
  let $wallets$;
  component_subscribe($$self, wallets$, ($$value) => $$invalidate(3, $wallets$ = $$value));
  const { appMetadata } = configuration;
  const appIcon = appMetadata && appMetadata.icon || questionIcon;
  function maximize() {
    updateAccountCenter({ expanded: true });
  }
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 8) {
      $$invalidate(0, [primaryWallet] = $wallets$, primaryWallet);
    }
  };
  return [primaryWallet, appIcon, maximize, $wallets$];
}
class Micro extends SvelteComponent {
  constructor(options) {
    super();
    init$1(this, options, instance$1, create_fragment$1, safe_not_equal, {}, add_css);
  }
}
function create_else_block(ctx) {
  let maximized;
  let current;
  maximized = new Maximized({});
  return {
    c() {
      create_component(maximized.$$.fragment);
    },
    m(target, anchor) {
      mount_component(maximized, target, anchor);
      current = true;
    },
    i(local) {
      if (current)
        return;
      transition_in(maximized.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(maximized.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(maximized, detaching);
    }
  };
}
function create_if_block_1(ctx) {
  let micro;
  let current;
  micro = new Micro({});
  return {
    c() {
      create_component(micro.$$.fragment);
    },
    m(target, anchor) {
      mount_component(micro, target, anchor);
      current = true;
    },
    i(local) {
      if (current)
        return;
      transition_in(micro.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(micro.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(micro, detaching);
    }
  };
}
function create_if_block(ctx) {
  let minimized;
  let current;
  minimized = new Minimized({});
  return {
    c() {
      create_component(minimized.$$.fragment);
    },
    m(target, anchor) {
      mount_component(minimized, target, anchor);
      current = true;
    },
    i(local) {
      if (current)
        return;
      transition_in(minimized.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(minimized.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(minimized, detaching);
    }
  };
}
function create_fragment(ctx) {
  let current_block_type_index;
  let if_block;
  let if_block_anchor;
  let current;
  let mounted;
  let dispose;
  const if_block_creators = [create_if_block, create_if_block_1, create_else_block];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (!ctx2[0].expanded && !ctx2[0].minimal)
      return 0;
    if (!ctx2[0].expanded && ctx2[0].minimal)
      return 1;
    return 2;
  }
  current_block_type_index = select_block_type(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  return {
    c() {
      if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if_blocks[current_block_type_index].m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
      if (!mounted) {
        dispose = listen(window, "click", ctx[1]);
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx2);
      if (current_block_type_index !== previous_block_index) {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block = if_blocks[current_block_type_index];
        if (!if_block) {
          if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
          if_block.c();
        }
        transition_in(if_block, 1);
        if_block.m(if_block_anchor.parentNode, if_block_anchor);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if_blocks[current_block_type_index].d(detaching);
      if (detaching)
        detach(if_block_anchor);
      mounted = false;
      dispose();
    }
  };
}
function instance($$self, $$props, $$invalidate) {
  let { settings } = $$props;
  onDestroy(minimize);
  function minimize() {
    if (settings.expanded) {
      updateAccountCenter({ expanded: false });
    }
  }
  $$self.$$set = ($$props2) => {
    if ("settings" in $$props2)
      $$invalidate(0, settings = $$props2.settings);
  };
  return [settings, minimize];
}
class Index extends SvelteComponent {
  constructor(options) {
    super();
    init$1(this, options, instance, create_fragment, safe_not_equal, { settings: 0 });
  }
}
export { Index as default };
