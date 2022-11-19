import { j as SvelteComponent, k as init$1, s as safe_not_equal, C as append_styles, l as empty, n as insert, v as transition_in, r as group_outros, t as transition_out, u as check_outros, w as detach, a4 as state, ax as startWith, ay as shareReplay, a1 as component_subscribe, J as element, L as attr, T as update_keyed_each, z as create_component, I as space, at as null_to_empty, A as mount_component, O as append, q as listen, Q as stop_propagation, az as fix_position, aA as add_transform, aB as create_animation, X as add_render_callback, Y as create_in_transition, $ as fly, a8 as create_out_transition, B as destroy_component, ae as configuration, af as bubble, aC as fix_and_outro_and_destroy_block, aD as cubicOut, a7 as fade, R as is_function, aE as chainStyles, aF as networkToChainId, N as toggle_class, a0 as run_all, a2 as wallets$, a3 as Y, aG as transactions$, aH as onMount, aI as removeNotification, aJ as removeTransaction, x as onDestroy, ah as noop, aK as addCustomNotification, K as text, V as set_data, aL as gweiToWeiHex, aM as BigNumber, aN as toHexString, aO as defaultNotifyEventStyles, F as unrecognizedChainStyle, a9 as shortenAddress, aP as D } from "./index.8052dd69.js";
function flip(node, { from, to }, params = {}) {
  const style = getComputedStyle(node);
  const transform = style.transform === "none" ? "" : style.transform;
  const [ox, oy] = style.transformOrigin.split(" ").map(parseFloat);
  const dx = from.left + from.width * ox / to.width - (to.left + ox);
  const dy = from.top + from.height * oy / to.height - (to.top + oy);
  const { delay = 0, duration = (d) => Math.sqrt(d) * 120, easing = cubicOut } = params;
  return {
    delay,
    duration: is_function(duration) ? duration(Math.sqrt(dx * dx + dy * dy)) : duration,
    easing,
    css: (t, u) => {
      const x = u * dx;
      const y = u * dy;
      const sx = t + u * from.width / to.width;
      const sy = t + u * from.height / to.height;
      return `transform: ${transform} translate(${x}px, ${y}px) scale(${sx}, ${sy});`;
    }
  };
}
function add_css$5(target) {
  append_styles(target, "svelte-13cuwwo", "div.svelte-13cuwwo{box-sizing:content-box}.border.svelte-13cuwwo{border:2px solid;border-radius:120px;overflow:hidden}");
}
function create_fragment$5(ctx) {
  let div;
  let div_style_value;
  return {
    c() {
      div = element("div");
      attr(div, "class", "border svelte-13cuwwo");
      attr(div, "style", div_style_value = `
    width: ${ctx[2] - ctx[3] * 2}px; 
    height: ${ctx[2] - ctx[3] * 2}px; 
    border-color: var(${ctx[1]}); 
    padding: ${ctx[3]}px; 
    background-color: ${ctx[4]};
    border-radius: 50%;
    display: flex;
    justify-content: center;
  `);
    },
    m(target, anchor) {
      insert(target, div, anchor);
      div.innerHTML = ctx[0];
    },
    p(ctx2, [dirty]) {
      if (dirty & 1)
        div.innerHTML = ctx2[0];
      if (dirty & 30 && div_style_value !== (div_style_value = `
    width: ${ctx2[2] - ctx2[3] * 2}px; 
    height: ${ctx2[2] - ctx2[3] * 2}px; 
    border-color: var(${ctx2[1]}); 
    padding: ${ctx2[3]}px; 
    background-color: ${ctx2[4]};
    border-radius: 50%;
    display: flex;
    justify-content: center;
  `)) {
        attr(div, "style", div_style_value);
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(div);
    }
  };
}
function instance$5($$self, $$props, $$invalidate) {
  let { icon } = $$props;
  let { borderColorVar } = $$props;
  let { size } = $$props;
  let { padding = 0 } = $$props;
  let { background = "transparent" } = $$props;
  $$self.$$set = ($$props2) => {
    if ("icon" in $$props2)
      $$invalidate(0, icon = $$props2.icon);
    if ("borderColorVar" in $$props2)
      $$invalidate(1, borderColorVar = $$props2.borderColorVar);
    if ("size" in $$props2)
      $$invalidate(2, size = $$props2.size);
    if ("padding" in $$props2)
      $$invalidate(3, padding = $$props2.padding);
    if ("background" in $$props2)
      $$invalidate(4, background = $$props2.background);
  };
  return [icon, borderColorVar, size, padding, background];
}
class ChainBadge extends SvelteComponent {
  constructor(options) {
    super();
    init$1(
      this,
      options,
      instance$5,
      create_fragment$5,
      safe_not_equal,
      {
        icon: 0,
        borderColorVar: 1,
        size: 2,
        padding: 3,
        background: 4
      },
      add_css$5
    );
  }
}
function add_css$4(target) {
  append_styles(target, "svelte-jvic9v", "div.notification-icons-wrapper.svelte-jvic9v{height:32px;width:32px}.border.svelte-jvic9v{border-radius:8px}div.notification-icon.svelte-jvic9v{padding:6px}div.pending-icon.svelte-jvic9v{animation:svelte-jvic9v-blink 2s ease-in infinite;height:100%;width:100%;padding:7px}@keyframes svelte-jvic9v-blink{from,to{opacity:1}50%{opacity:0.2}}div.border-action.svelte-jvic9v{height:32px;min-width:32px;border-radius:8px;overflow:hidden;will-change:transform}div.border-action.svelte-jvic9v:before{content:'';background-image:conic-gradient(#b1b7f2 20deg, #6370e5 120deg);height:140%;width:140%;position:absolute;left:-25%;top:-25%;animation:svelte-jvic9v-rotate 2s infinite linear}div.chain-icon-container.svelte-jvic9v{left:18px;top:18px}@keyframes svelte-jvic9v-rotate{100%{transform:rotate(-360deg)}}");
}
function create_if_block$4(ctx) {
  let div2;
  let t0;
  let div1;
  let div0;
  let raw_value = defaultNotifyEventStyles[ctx[1].type]["eventIcon"] + "";
  let div0_class_value;
  let div1_style_value;
  let t1;
  let show_if = !ctx[1].id.includes("customNotification") && !ctx[1].id.includes("preflight");
  let current;
  let if_block0 = ctx[1].type === "pending" && create_if_block_2();
  let if_block1 = show_if && create_if_block_1$1(ctx);
  return {
    c() {
      div2 = element("div");
      if (if_block0)
        if_block0.c();
      t0 = space();
      div1 = element("div");
      div0 = element("div");
      t1 = space();
      if (if_block1)
        if_block1.c();
      attr(div0, "class", div0_class_value = null_to_empty(`notification-icon flex items-center justify-center ${ctx[1].type === "pending" ? "pending-icon" : ""}`) + " svelte-jvic9v");
      attr(div1, "class", "flex items-center justify-center border relative notification-icons-wrapper svelte-jvic9v");
      attr(div1, "style", div1_style_value = `background:${defaultNotifyEventStyles[ctx[1].type]["backgroundColor"]}; color: ${defaultNotifyEventStyles[ctx[1].type]["iconColor"] || ""}; ${ctx[1].type === "pending" ? "height: 28px; width: 28px; margin: 2px;" : `border: 2px solid ${defaultNotifyEventStyles[ctx[1].type]["borderColor"]}`}; `);
      attr(div2, "class", "relative");
    },
    m(target, anchor) {
      insert(target, div2, anchor);
      if (if_block0)
        if_block0.m(div2, null);
      append(div2, t0);
      append(div2, div1);
      append(div1, div0);
      div0.innerHTML = raw_value;
      append(div2, t1);
      if (if_block1)
        if_block1.m(div2, null);
      current = true;
    },
    p(ctx2, dirty) {
      if (ctx2[1].type === "pending") {
        if (if_block0)
          ;
        else {
          if_block0 = create_if_block_2();
          if_block0.c();
          if_block0.m(div2, t0);
        }
      } else if (if_block0) {
        if_block0.d(1);
        if_block0 = null;
      }
      if ((!current || dirty & 2) && raw_value !== (raw_value = defaultNotifyEventStyles[ctx2[1].type]["eventIcon"] + ""))
        div0.innerHTML = raw_value;
      if (!current || dirty & 2 && div0_class_value !== (div0_class_value = null_to_empty(`notification-icon flex items-center justify-center ${ctx2[1].type === "pending" ? "pending-icon" : ""}`) + " svelte-jvic9v")) {
        attr(div0, "class", div0_class_value);
      }
      if (!current || dirty & 2 && div1_style_value !== (div1_style_value = `background:${defaultNotifyEventStyles[ctx2[1].type]["backgroundColor"]}; color: ${defaultNotifyEventStyles[ctx2[1].type]["iconColor"] || ""}; ${ctx2[1].type === "pending" ? "height: 28px; width: 28px; margin: 2px;" : `border: 2px solid ${defaultNotifyEventStyles[ctx2[1].type]["borderColor"]}`}; `)) {
        attr(div1, "style", div1_style_value);
      }
      if (dirty & 2)
        show_if = !ctx2[1].id.includes("customNotification") && !ctx2[1].id.includes("preflight");
      if (show_if) {
        if (if_block1) {
          if_block1.p(ctx2, dirty);
          if (dirty & 2) {
            transition_in(if_block1, 1);
          }
        } else {
          if_block1 = create_if_block_1$1(ctx2);
          if_block1.c();
          transition_in(if_block1, 1);
          if_block1.m(div2, null);
        }
      } else if (if_block1) {
        group_outros();
        transition_out(if_block1, 1, 1, () => {
          if_block1 = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block1);
      current = true;
    },
    o(local) {
      transition_out(if_block1);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div2);
      if (if_block0)
        if_block0.d();
      if (if_block1)
        if_block1.d();
    }
  };
}
function create_if_block_2(ctx) {
  let div;
  return {
    c() {
      div = element("div");
      attr(div, "class", "border-action absolute svelte-jvic9v");
    },
    m(target, anchor) {
      insert(target, div, anchor);
    },
    d(detaching) {
      if (detaching)
        detach(div);
    }
  };
}
function create_if_block_1$1(ctx) {
  let div;
  let chainbadge;
  let current;
  chainbadge = new ChainBadge({
    props: {
      icon: ctx[0].icon,
      size: 16,
      background: ctx[0].color,
      borderColorVar: "--onboard-gray-600, var(--gray-600)",
      padding: 3
    }
  });
  return {
    c() {
      div = element("div");
      create_component(chainbadge.$$.fragment);
      attr(div, "class", "absolute chain-icon-container svelte-jvic9v");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      mount_component(chainbadge, div, null);
      current = true;
    },
    p(ctx2, dirty) {
      const chainbadge_changes = {};
      if (dirty & 1)
        chainbadge_changes.icon = ctx2[0].icon;
      if (dirty & 1)
        chainbadge_changes.background = ctx2[0].color;
      chainbadge.$set(chainbadge_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(chainbadge.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(chainbadge.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div);
      destroy_component(chainbadge);
    }
  };
}
function create_fragment$4(ctx) {
  let if_block_anchor;
  let current;
  let if_block = ctx[1].type && create_if_block$4(ctx);
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
      current = true;
    },
    p(ctx2, [dirty]) {
      if (ctx2[1].type) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty & 2) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block$4(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
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
      if (if_block)
        if_block.d(detaching);
      if (detaching)
        detach(if_block_anchor);
    }
  };
}
function instance$4($$self, $$props, $$invalidate) {
  let { chainStyles: chainStyles2 = unrecognizedChainStyle } = $$props;
  let { notification } = $$props;
  $$self.$$set = ($$props2) => {
    if ("chainStyles" in $$props2)
      $$invalidate(0, chainStyles2 = $$props2.chainStyles);
    if ("notification" in $$props2)
      $$invalidate(1, notification = $$props2.notification);
  };
  return [chainStyles2, notification];
}
class StatusIconBadge extends SvelteComponent {
  constructor(options) {
    super();
    init$1(this, options, instance$4, create_fragment$4, safe_not_equal, { chainStyles: 0, notification: 1 }, add_css$4);
  }
}
function add_css$3(target) {
  append_styles(target, "svelte-pm7idu", "div.svelte-pm7idu{display:flex;justify-content:center;font-size:inherit;font-family:inherit;margin:0 1.5rem 0 0.75rem}span.svelte-pm7idu{font-family:inherit;display:flex;align-items:center;margin:0 2px}.time.svelte-pm7idu{color:var(\n      --notify-onboard-timer-color,\n      var(--onboard-gray-300, var(--gray-300))\n    );margin-left:4px}");
}
function create_if_block$3(ctx) {
  let t0;
  let span;
  let t1_value = ctx[2](ctx[1] - ctx[0]) + "";
  let t1;
  let t2;
  return {
    c() {
      t0 = text("-\n    ");
      span = element("span");
      t1 = text(t1_value);
      t2 = text("\n    ago");
      attr(span, "class", "svelte-pm7idu");
    },
    m(target, anchor) {
      insert(target, t0, anchor);
      insert(target, span, anchor);
      append(span, t1);
      insert(target, t2, anchor);
    },
    p(ctx2, dirty) {
      if (dirty & 3 && t1_value !== (t1_value = ctx2[2](ctx2[1] - ctx2[0]) + ""))
        set_data(t1, t1_value);
    },
    d(detaching) {
      if (detaching)
        detach(t0);
      if (detaching)
        detach(span);
      if (detaching)
        detach(t2);
    }
  };
}
function create_fragment$3(ctx) {
  let div;
  let if_block = ctx[0] && create_if_block$3(ctx);
  return {
    c() {
      div = element("div");
      if (if_block)
        if_block.c();
      attr(div, "class", "time svelte-pm7idu");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      if (if_block)
        if_block.m(div, null);
    },
    p(ctx2, [dirty]) {
      if (ctx2[0]) {
        if (if_block) {
          if_block.p(ctx2, dirty);
        } else {
          if_block = create_if_block$3(ctx2);
          if_block.c();
          if_block.m(div, null);
        }
      } else if (if_block) {
        if_block.d(1);
        if_block = null;
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(div);
      if (if_block)
        if_block.d();
    }
  };
}
function instance$3($$self, $$props, $$invalidate) {
  let $formatter;
  let $locale;
  component_subscribe($$self, Y, ($$value) => $$invalidate(3, $formatter = $$value));
  component_subscribe($$self, D, ($$value) => $$invalidate(4, $locale = $$value));
  let { startTime } = $$props;
  function timeString(time) {
    const seconds = Math.floor(time / 1e3);
    const formattedSeconds = seconds < 0 ? 0 : seconds;
    return formattedSeconds >= 60 ? `${Math.floor(formattedSeconds / 60).toLocaleString($locale)} ${$formatter("notify.time.minutes")}` : `${formattedSeconds.toLocaleString($locale)} ${$formatter("notify.time.seconds")}`;
  }
  let currentTime = Date.now();
  const intervalId = setInterval(
    () => {
      $$invalidate(1, currentTime = Date.now());
    },
    1e3
  );
  onDestroy(() => {
    clearInterval(intervalId);
  });
  $$self.$$set = ($$props2) => {
    if ("startTime" in $$props2)
      $$invalidate(0, startTime = $$props2.startTime);
  };
  return [startTime, currentTime, timeString];
}
class Timer extends SvelteComponent {
  constructor(options) {
    super();
    init$1(this, options, instance$3, create_fragment$3, safe_not_equal, { startTime: 0 }, add_css$3);
  }
}
function add_css$2(target) {
  append_styles(target, "svelte-gv6x72", "div.notify-transaction-data.svelte-gv6x72{font-size:var(\n      --notify-onboard-transaction-font-size,\n      var(--onboard-font-size-6, var(--font-size-6))\n    );font-family:inherit;margin:0px 20px 0px 8px;justify-content:center}.hash-time.svelte-gv6x72{display:inline-flex;margin-top:4px;font-size:var(\n      --notify-onboard-hash-time-font-size,\n      var(--onboard-font-size-7, var(--font-size-7))\n    );line-height:var(\n      --notify-onboard-hash-time-font-line-height,\n      var(--onboard-font-line-height-4, var(--font-line-height-4))\n    )}.address-hash.svelte-gv6x72{color:var(\n      --notify-onboard-address-hash-color,\n      var(--onboard-primary-200, var(--primary-200))\n    )}a.address-hash.svelte-gv6x72{color:var(\n      --notify-onboard-anchor-color,\n      var(--onboard-primary-400, var(--primary-400))\n    )}a.svelte-gv6x72{display:flex;text-decoration:none;color:inherit}.transaction-status.svelte-gv6x72{color:var(\n      --notify-onboard-transaction-status,\n      var(--onboard-primary-100, var(--primary-100))\n    );line-height:var(\n      --notify-onboard-font-size-5,\n      var(--onboard-font-size-5, var(--font-size-5))\n    );font-weight:400;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}");
}
function create_if_block$2(ctx) {
  let span;
  let t;
  let timer;
  let current;
  function select_block_type(ctx2, dirty) {
    if (ctx2[0].link)
      return create_if_block_1;
    return create_else_block;
  }
  let current_block_type = select_block_type(ctx);
  let if_block = current_block_type(ctx);
  timer = new Timer({
    props: {
      startTime: ctx[0].startTime
    }
  });
  return {
    c() {
      span = element("span");
      if_block.c();
      t = space();
      create_component(timer.$$.fragment);
      attr(span, "class", "hash-time svelte-gv6x72");
    },
    m(target, anchor) {
      insert(target, span, anchor);
      if_block.m(span, null);
      append(span, t);
      mount_component(timer, span, null);
      current = true;
    },
    p(ctx2, dirty) {
      if (current_block_type === (current_block_type = select_block_type(ctx2)) && if_block) {
        if_block.p(ctx2, dirty);
      } else {
        if_block.d(1);
        if_block = current_block_type(ctx2);
        if (if_block) {
          if_block.c();
          if_block.m(span, t);
        }
      }
      const timer_changes = {};
      if (dirty & 1)
        timer_changes.startTime = ctx2[0].startTime;
      timer.$set(timer_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(timer.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(timer.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(span);
      if_block.d();
      destroy_component(timer);
    }
  };
}
function create_else_block(ctx) {
  let div;
  let t_value = shortenAddress(ctx[0].id) + "";
  let t;
  return {
    c() {
      div = element("div");
      t = text(t_value);
      attr(div, "class", "address-hash svelte-gv6x72");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, t);
    },
    p(ctx2, dirty) {
      if (dirty & 1 && t_value !== (t_value = shortenAddress(ctx2[0].id) + ""))
        set_data(t, t_value);
    },
    d(detaching) {
      if (detaching)
        detach(div);
    }
  };
}
function create_if_block_1(ctx) {
  let a;
  let t_value = shortenAddress(ctx[0].id) + "";
  let t;
  let a_href_value;
  return {
    c() {
      a = element("a");
      t = text(t_value);
      attr(a, "class", "address-hash svelte-gv6x72");
      attr(a, "href", a_href_value = ctx[0].link);
      attr(a, "target", "_blank");
      attr(a, "rel", "noreferrer noopener");
    },
    m(target, anchor) {
      insert(target, a, anchor);
      append(a, t);
    },
    p(ctx2, dirty) {
      if (dirty & 1 && t_value !== (t_value = shortenAddress(ctx2[0].id) + ""))
        set_data(t, t_value);
      if (dirty & 1 && a_href_value !== (a_href_value = ctx2[0].link)) {
        attr(a, "href", a_href_value);
      }
    },
    d(detaching) {
      if (detaching)
        detach(a);
    }
  };
}
function create_fragment$2(ctx) {
  let div;
  let span;
  let t0_value = ctx[0].message + "";
  let t0;
  let t1;
  let show_if = ctx[0].id && !ctx[0].id.includes("customNotification") && !ctx[0].id.includes("preflight");
  let current;
  let if_block = show_if && create_if_block$2(ctx);
  return {
    c() {
      div = element("div");
      span = element("span");
      t0 = text(t0_value);
      t1 = space();
      if (if_block)
        if_block.c();
      attr(span, "class", "transaction-status svelte-gv6x72");
      attr(div, "class", "flex flex-column notify-transaction-data svelte-gv6x72");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, span);
      append(span, t0);
      append(div, t1);
      if (if_block)
        if_block.m(div, null);
      current = true;
    },
    p(ctx2, [dirty]) {
      if ((!current || dirty & 1) && t0_value !== (t0_value = ctx2[0].message + ""))
        set_data(t0, t0_value);
      if (dirty & 1)
        show_if = ctx2[0].id && !ctx2[0].id.includes("customNotification") && !ctx2[0].id.includes("preflight");
      if (show_if) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty & 1) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block$2(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(div, null);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
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
      if (detaching)
        detach(div);
      if (if_block)
        if_block.d();
    }
  };
}
function instance$2($$self, $$props, $$invalidate) {
  let { notification } = $$props;
  $$self.$$set = ($$props2) => {
    if ("notification" in $$props2)
      $$invalidate(0, notification = $$props2.notification);
  };
  return [notification];
}
class NotificationContent extends SvelteComponent {
  constructor(options) {
    super();
    init$1(this, options, instance$2, create_fragment$2, safe_not_equal, { notification: 0 }, add_css$2);
  }
}
var closeIcon = `
<svg width="100%" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M10 0C4.47 0 0 4.47 0 10C0 15.53 4.47 20 10 20C15.53 20 20 15.53 20 10C20 4.47 15.53 0 10 0ZM15 13.59L13.59 15L10 11.41L6.41 15L5 13.59L8.59 10L5 6.41L6.41 5L10 8.59L13.59 5L15 6.41L11.41 10L15 13.59Z" fill="currentColor"/>
</svg>
`;
const ACTIONABLE_EVENT_CODES = ["txPool"];
const VALID_GAS_NETWORKS = ["main", "matic-main"];
const WALLETS_SUPPORT_REPLACEMENT = [
  "Ledger",
  "Trezor",
  "Keystone",
  "KeepKey",
  `D'CENT`
];
const actionableEventCode = (eventCode) => ACTIONABLE_EVENT_CODES.includes(eventCode);
const validGasNetwork = (network) => VALID_GAS_NETWORKS.includes(network);
const walletSupportsReplacement = (wallet) => wallet && WALLETS_SUPPORT_REPLACEMENT.includes(wallet.label);
async function replaceTransaction({ type, wallet, transaction }) {
  const { from, input, value, to, nonce, gas: gasLimit, network } = transaction;
  const chainId = networkToChainId[network];
  const { gasPriceProbability } = state.get().notify.replacement;
  const { gas, apiKey } = configuration;
  const [gasResult] = await gas.get({
    chains: [networkToChainId[network]],
    endpoint: "blockPrices",
    apiKey
  });
  const { maxFeePerGas, maxPriorityFeePerGas } = gasResult.blockPrices[0].estimatedPrices.find(({ confidence }) => confidence === (type === "speedup" ? gasPriceProbability.speedup : gasPriceProbability.cancel));
  const maxFeePerGasWeiHex = gweiToWeiHex(maxFeePerGas);
  const maxPriorityFeePerGasWeiHex = gweiToWeiHex(maxPriorityFeePerGas);
  const dataObj = input === "0x" ? {} : { data: input };
  return wallet.provider.request({
    method: "eth_sendTransaction",
    params: [
      {
        type: "0x2",
        from,
        to: type === "cancel" ? from : to,
        chainId: parseInt(chainId),
        value: `${BigNumber.from(value).toHexString()}`,
        nonce: toHexString(nonce),
        gasLimit: toHexString(gasLimit),
        maxFeePerGas: maxFeePerGasWeiHex,
        maxPriorityFeePerGas: maxPriorityFeePerGasWeiHex,
        ...dataObj
      }
    ]
  });
}
function add_css$1(target) {
  append_styles(target, "svelte-4xaywn", ".bn-notify-notification.svelte-4xaywn.svelte-4xaywn.svelte-4xaywn{font-family:inherit;transition:background 300ms ease-in-out, color 300ms ease-in-out;pointer-events:all;backdrop-filter:blur(5px);width:100%;min-height:56px;background:var(\n      --notify-onboard-background,\n      var(--onboard-gray-600, var(--gray-600))\n    );border-radius:var(\n      --notify-onboard-border-radius,\n      var(--onboard-border-radius-4, var(--border-radius-4))\n    );display:flex;flex-direction:column;position:relative;overflow:hidden}.bn-notify-notification-inner.svelte-4xaywn.svelte-4xaywn.svelte-4xaywn{padding:0.75rem}.bn-notify-notification.svelte-4xaywn:hover>div.bn-notify-notification-inner.svelte-4xaywn>div.notify-close-btn-desktop.svelte-4xaywn{visibility:visible;opacity:1}div.notify-close-btn.svelte-4xaywn.svelte-4xaywn.svelte-4xaywn{margin-left:auto;margin-bottom:auto;height:24px;width:24px;position:absolute;top:8px;right:8px;justify-content:center;align-items:center}div.notify-close-btn-desktop.svelte-4xaywn.svelte-4xaywn.svelte-4xaywn{visibility:hidden;transition:visibility 0.15s linear, opacity 0.15s linear;opacity:0}.notify-close-btn.svelte-4xaywn .close-icon.svelte-4xaywn.svelte-4xaywn{width:20px;margin:auto}.notify-close-btn.svelte-4xaywn>.close-icon.svelte-4xaywn.svelte-4xaywn{color:var(\n      --notify-onboard-close-icon-color,\n      var(--onboard-gray-300, var(--gray-300))\n    )}.notify-close-btn.svelte-4xaywn:hover>.close-icon.svelte-4xaywn.svelte-4xaywn{color:var(\n      --notify-onboard-close-icon-hover,\n      var(--onboard-gray-100, var(--gray-100))\n    )}.transaction-status.svelte-4xaywn.svelte-4xaywn.svelte-4xaywn{color:var(\n      --notify-onboard-transaction-status-color,\n      var(--onboard-primary-100, var(--primary-100))\n    );line-height:14px}.dropdown.svelte-4xaywn.svelte-4xaywn.svelte-4xaywn{height:0px;overflow:hidden;transition:height 150ms ease-in-out}.dropdown-visible.svelte-4xaywn.svelte-4xaywn.svelte-4xaywn{height:48px}.dropdown-buttons.svelte-4xaywn.svelte-4xaywn.svelte-4xaywn{background-color:var(\n      --notify-onboard-gray-700,\n      var(--onboard-gray-700, var(--gray-700))\n    );width:100%;padding:8px}.dropdown-button.svelte-4xaywn.svelte-4xaywn.svelte-4xaywn{padding:4px 12px;border-radius:var(\n      --notify-onboard-border-radius-5,\n      var(--onboard-border-radius-5, var(--border-radius-5))\n    );background-color:transparent;font-size:var(\n      --notify-onboard-font-size-6,\n      var(--onboard-font-size-6, var(--font-size-6))\n    );color:var(\n      --notify-onboard-primary-400,\n      var(--onboard-primary-400, var(--primary-400))\n    );transition:all 150ms ease-in-out;cursor:pointer}.dropdown-button.svelte-4xaywn.svelte-4xaywn.svelte-4xaywn:hover{background-color:rgba(146, 155, 237, 0.2)}");
}
function create_if_block$1(ctx) {
  let div;
  let button0;
  let t1;
  let button1;
  let mounted;
  let dispose;
  return {
    c() {
      div = element("div");
      button0 = element("button");
      button0.textContent = "Cancel";
      t1 = space();
      button1 = element("button");
      button1.textContent = "Speed-up";
      attr(button0, "class", "dropdown-button svelte-4xaywn");
      attr(button1, "class", "dropdown-button svelte-4xaywn");
      attr(div, "class", "dropdown-buttons flex items-center justify-end svelte-4xaywn");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, button0);
      append(div, t1);
      append(div, button1);
      if (!mounted) {
        dispose = [
          listen(button0, "click", ctx[9]),
          listen(button1, "click", ctx[10])
        ];
        mounted = true;
      }
    },
    p: noop,
    d(detaching) {
      if (detaching)
        detach(div);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_fragment$1(ctx) {
  let div4;
  let div2;
  let statusiconbadge;
  let t0;
  let notificationcontent;
  let t1;
  let div1;
  let div0;
  let t2;
  let div3;
  let div4_class_value;
  let current;
  let mounted;
  let dispose;
  statusiconbadge = new StatusIconBadge({
    props: {
      notification: ctx[0],
      chainStyles: chainStyles[networkToChainId[ctx[0].network]]
    }
  });
  notificationcontent = new NotificationContent({
    props: { notification: ctx[0] }
  });
  let if_block = ctx[0].eventCode === "txPool" && create_if_block$1(ctx);
  return {
    c() {
      div4 = element("div");
      div2 = element("div");
      create_component(statusiconbadge.$$.fragment);
      t0 = space();
      create_component(notificationcontent.$$.fragment);
      t1 = space();
      div1 = element("div");
      div0 = element("div");
      t2 = space();
      div3 = element("div");
      if (if_block)
        if_block.c();
      attr(div0, "class", "flex items-center close-icon svelte-4xaywn");
      attr(div1, "class", "notify-close-btn notify-close-btn-" + ctx[4].type + " pointer flex svelte-4xaywn");
      attr(div2, "class", "flex bn-notify-notification-inner svelte-4xaywn");
      attr(div3, "class", "dropdown svelte-4xaywn");
      toggle_class(div3, "dropdown-visible", ctx[2] && ctx[5] && actionableEventCode(ctx[0].eventCode) && validGasNetwork(ctx[0].network) && walletSupportsReplacement(ctx[7]));
      attr(div4, "class", div4_class_value = "bn-notify-notification bn-notify-notification-" + ctx[0].type + "} svelte-4xaywn");
      toggle_class(div4, "bn-notify-clickable", ctx[0].onClick);
    },
    m(target, anchor) {
      insert(target, div4, anchor);
      append(div4, div2);
      mount_component(statusiconbadge, div2, null);
      append(div2, t0);
      mount_component(notificationcontent, div2, null);
      append(div2, t1);
      append(div2, div1);
      append(div1, div0);
      div0.innerHTML = closeIcon;
      append(div4, t2);
      append(div4, div3);
      if (if_block)
        if_block.m(div3, null);
      current = true;
      if (!mounted) {
        dispose = [
          listen(div1, "click", stop_propagation(ctx[8])),
          listen(div4, "mouseenter", ctx[11]),
          listen(div4, "mouseleave", ctx[12]),
          listen(div4, "click", ctx[13])
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      const statusiconbadge_changes = {};
      if (dirty & 1)
        statusiconbadge_changes.notification = ctx2[0];
      if (dirty & 1)
        statusiconbadge_changes.chainStyles = chainStyles[networkToChainId[ctx2[0].network]];
      statusiconbadge.$set(statusiconbadge_changes);
      const notificationcontent_changes = {};
      if (dirty & 1)
        notificationcontent_changes.notification = ctx2[0];
      notificationcontent.$set(notificationcontent_changes);
      if (ctx2[0].eventCode === "txPool") {
        if (if_block) {
          if_block.p(ctx2, dirty);
        } else {
          if_block = create_if_block$1(ctx2);
          if_block.c();
          if_block.m(div3, null);
        }
      } else if (if_block) {
        if_block.d(1);
        if_block = null;
      }
      if (!current || dirty & 165) {
        toggle_class(div3, "dropdown-visible", ctx2[2] && ctx2[5] && actionableEventCode(ctx2[0].eventCode) && validGasNetwork(ctx2[0].network) && walletSupportsReplacement(ctx2[7]));
      }
      if (!current || dirty & 1 && div4_class_value !== (div4_class_value = "bn-notify-notification bn-notify-notification-" + ctx2[0].type + "} svelte-4xaywn")) {
        attr(div4, "class", div4_class_value);
      }
      if (!current || dirty & 1) {
        toggle_class(div4, "bn-notify-clickable", ctx2[0].onClick);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(statusiconbadge.$$.fragment, local);
      transition_in(notificationcontent.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(statusiconbadge.$$.fragment, local);
      transition_out(notificationcontent.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div4);
      destroy_component(statusiconbadge);
      destroy_component(notificationcontent);
      if (if_block)
        if_block.d();
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance$1($$self, $$props, $$invalidate) {
  let $wallets$;
  let $_;
  component_subscribe($$self, wallets$, ($$value) => $$invalidate(15, $wallets$ = $$value));
  component_subscribe($$self, Y, ($$value) => $$invalidate(3, $_ = $$value));
  const { device, gas } = configuration;
  let { notification } = $$props;
  let { updateParentOnRemove } = $$props;
  let timeoutId;
  let hovered = false;
  const transaction = transactions$.getValue().find(({ hash }) => hash === notification.id);
  const wallet = transaction && $wallets$.find(({ accounts }) => !!accounts.find(({ address }) => address.toLowerCase() === transaction.from.toLowerCase()));
  onMount(() => {
    if (notification.autoDismiss) {
      timeoutId = setTimeout(
        () => {
          removeNotification(notification.id);
          removeTransaction(notification.id);
        },
        notification.autoDismiss
      );
    }
  });
  onDestroy(() => {
    clearTimeout(timeoutId);
  });
  const click_handler = () => {
    removeNotification(notification.id);
    removeTransaction(notification.id);
    updateParentOnRemove();
  };
  const click_handler_1 = async () => {
    try {
      await replaceTransaction({ type: "cancel", wallet, transaction });
    } catch (error) {
      const id = `${transaction.hash.slice(0, 9)}:txReplaceError${transaction.hash.slice(-5)}`;
      addCustomNotification({
        id,
        type: "hint",
        eventCode: "txError",
        message: $_("notify.transaction.txReplaceError"),
        key: id,
        autoDismiss: 4e3
      });
    }
  };
  const click_handler_2 = async () => {
    try {
      await replaceTransaction({ type: "speedup", wallet, transaction });
    } catch (error) {
      const id = `${transaction.hash.slice(0, 9)}:txReplaceError${transaction.hash.slice(-5)}`;
      addCustomNotification({
        id,
        type: "hint",
        eventCode: "txError",
        message: $_("notify.transaction.txReplaceError"),
        key: id,
        autoDismiss: 4e3
      });
    }
  };
  const mouseenter_handler = () => $$invalidate(2, hovered = true);
  const mouseleave_handler = () => $$invalidate(2, hovered = false);
  const click_handler_3 = (e) => notification.onClick && notification.onClick(e);
  $$self.$$set = ($$props2) => {
    if ("notification" in $$props2)
      $$invalidate(0, notification = $$props2.notification);
    if ("updateParentOnRemove" in $$props2)
      $$invalidate(1, updateParentOnRemove = $$props2.updateParentOnRemove);
  };
  return [
    notification,
    updateParentOnRemove,
    hovered,
    $_,
    device,
    gas,
    transaction,
    wallet,
    click_handler,
    click_handler_1,
    click_handler_2,
    mouseenter_handler,
    mouseleave_handler,
    click_handler_3
  ];
}
class Notification extends SvelteComponent {
  constructor(options) {
    super();
    init$1(this, options, instance$1, create_fragment$1, safe_not_equal, { notification: 0, updateParentOnRemove: 1 }, add_css$1);
  }
}
function add_css(target) {
  append_styles(target, "svelte-17x6hrg", "ul.svelte-17x6hrg{padding-left:0;display:flex;flex-flow:column nowrap;font-size:var(\n      --notify-onboard-font-size-5,\n      var(--onboard-font-size-5, var(--font-size-5))\n    );list-style-type:none;overflow:visible;scrollbar-width:none;box-sizing:border-box;z-index:var(--notify-onboard-z-index, 300);font-family:var(\n      --notify-onboard-font-family-normal,\n      var(--onboard-font-family-normal, var(--font-family-normal))\n    );margin:8px 0;pointer-events:all}.y-scroll.svelte-17x6hrg{overflow-y:scroll}.y-visible.svelte-17x6hrg{overflow-y:visible}li.notification-list-top.svelte-17x6hrg:not(:first-child){margin-top:8px}li.notification-list-bottom.svelte-17x6hrg:not(:first-child){margin-bottom:8px}ul.bn-notify-bottomLeft.svelte-17x6hrg,ul.bn-notify-bottomRight.svelte-17x6hrg{flex-direction:column-reverse}@media only screen and (max-width: 450px){ul.svelte-17x6hrg{width:100%}}.bn-notify-clickable:hover{cursor:pointer}.svelte-17x6hrg::-webkit-scrollbar{display:none}");
}
function get_each_context(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[12] = list[i];
  return child_ctx;
}
function create_if_block(ctx) {
  let ul;
  let each_blocks = [];
  let each_1_lookup = /* @__PURE__ */ new Map();
  let ul_class_value;
  let ul_style_value;
  let current;
  let each_value = ctx[2];
  const get_key = (ctx2) => ctx2[12].key;
  for (let i = 0; i < each_value.length; i += 1) {
    let child_ctx = get_each_context(ctx, each_value, i);
    let key = get_key(child_ctx);
    each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
  }
  return {
    c() {
      ul = element("ul");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      attr(ul, "class", ul_class_value = "bn-notify-" + ctx[0] + " " + ctx[5] + " svelte-17x6hrg");
      attr(ul, "style", ul_style_value = `${ctx[0].includes("top") ? "justify-content:flex-start;" : ""}; max-height: calc(100vh - ${ctx[6].expanded ? "412px" : ctx[1] && ctx[7].type !== "mobile" ? "82px" : !ctx[1] && ctx[7].type === "mobile" ? "108px" : "24px"})`);
    },
    m(target, anchor) {
      insert(target, ul, anchor);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].m(ul, null);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (dirty & 517) {
        each_value = ctx2[2];
        group_outros();
        for (let i = 0; i < each_blocks.length; i += 1)
          each_blocks[i].r();
        each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx2, each_value, each_1_lookup, ul, fix_and_outro_and_destroy_block, create_each_block, null, get_each_context);
        for (let i = 0; i < each_blocks.length; i += 1)
          each_blocks[i].a();
        check_outros();
      }
      if (!current || dirty & 33 && ul_class_value !== (ul_class_value = "bn-notify-" + ctx2[0] + " " + ctx2[5] + " svelte-17x6hrg")) {
        attr(ul, "class", ul_class_value);
      }
      if (!current || dirty & 67 && ul_style_value !== (ul_style_value = `${ctx2[0].includes("top") ? "justify-content:flex-start;" : ""}; max-height: calc(100vh - ${ctx2[6].expanded ? "412px" : ctx2[1] && ctx2[7].type !== "mobile" ? "82px" : !ctx2[1] && ctx2[7].type === "mobile" ? "108px" : "24px"})`)) {
        attr(ul, "style", ul_style_value);
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
      for (let i = 0; i < each_blocks.length; i += 1) {
        transition_out(each_blocks[i]);
      }
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(ul);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].d();
      }
    }
  };
}
function create_each_block(key_1, ctx) {
  let li;
  let notification;
  let t;
  let li_class_value;
  let li_intro;
  let li_outro;
  let rect;
  let stop_animation = noop;
  let current;
  let mounted;
  let dispose;
  notification = new Notification({
    props: {
      notification: ctx[12],
      updateParentOnRemove: ctx[9]
    }
  });
  return {
    key: key_1,
    first: null,
    c() {
      li = element("li");
      create_component(notification.$$.fragment);
      t = space();
      attr(li, "class", li_class_value = null_to_empty(`bn-notify-li-${ctx[0]} ${ctx[0].includes("top") ? "notification-list-top" : "notification-list-bottom"}`) + " svelte-17x6hrg");
      this.first = li;
    },
    m(target, anchor) {
      insert(target, li, anchor);
      mount_component(notification, li, null);
      append(li, t);
      current = true;
      if (!mounted) {
        dispose = listen(li, "click", stop_propagation(ctx[10]));
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      const notification_changes = {};
      if (dirty & 4)
        notification_changes.notification = ctx[12];
      notification.$set(notification_changes);
      if (!current || dirty & 1 && li_class_value !== (li_class_value = null_to_empty(`bn-notify-li-${ctx[0]} ${ctx[0].includes("top") ? "notification-list-top" : "notification-list-bottom"}`) + " svelte-17x6hrg")) {
        attr(li, "class", li_class_value);
      }
    },
    r() {
      rect = li.getBoundingClientRect();
    },
    f() {
      fix_position(li);
      stop_animation();
      add_transform(li, rect);
    },
    a() {
      stop_animation();
      stop_animation = create_animation(li, rect, flip, { duration: 500 });
    },
    i(local) {
      if (current)
        return;
      transition_in(notification.$$.fragment, local);
      add_render_callback(() => {
        if (li_outro)
          li_outro.end(1);
        li_intro = create_in_transition(li, fly, {
          duration: 1200,
          delay: 300,
          x: ctx[3],
          y: ctx[4],
          easing: elasticOut
        });
        li_intro.start();
      });
      current = true;
    },
    o(local) {
      transition_out(notification.$$.fragment, local);
      if (li_intro)
        li_intro.invalidate();
      li_outro = create_out_transition(li, fade, { duration: 300, easing: cubicOut });
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(li);
      destroy_component(notification);
      if (detaching && li_outro)
        li_outro.end();
      mounted = false;
      dispose();
    }
  };
}
function create_fragment(ctx) {
  let if_block_anchor;
  let current;
  let if_block = ctx[2].length && create_if_block(ctx);
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
      current = true;
    },
    p(ctx2, [dirty]) {
      if (ctx2[2].length) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty & 4) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
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
      if (if_block)
        if_block.d(detaching);
      if (detaching)
        detach(if_block_anchor);
    }
  };
}
function elasticOut(t) {
  return Math.sin(-13 * (t + 1) * Math.PI / 2) * Math.pow(2, -35 * t) + 1;
}
function instance($$self, $$props, $$invalidate) {
  let $accountCenter$;
  const { device } = configuration;
  const accountCenter$ = state.select("accountCenter").pipe(startWith(state.get().accountCenter), shareReplay(1));
  component_subscribe($$self, accountCenter$, (value) => $$invalidate(6, $accountCenter$ = value));
  let { position } = $$props;
  let { sharedContainer } = $$props;
  let { notifications } = $$props;
  let x;
  let y;
  x = 0;
  y = 0;
  let overflowY = "y-scroll";
  const updateScrollYOnRemove = () => {
    if (overflowY !== "y-visible") {
      $$invalidate(5, overflowY = "y-visible");
    }
    delay(
      function() {
        $$invalidate(5, overflowY = "y-scroll");
      },
      1e3
    );
  };
  const delay = function() {
    let timer = null;
    return (callback, ms) => {
      clearTimeout(timer);
      timer = setTimeout(callback, ms);
    };
  }();
  function click_handler(event) {
    bubble.call(this, $$self, event);
  }
  $$self.$$set = ($$props2) => {
    if ("position" in $$props2)
      $$invalidate(0, position = $$props2.position);
    if ("sharedContainer" in $$props2)
      $$invalidate(1, sharedContainer = $$props2.sharedContainer);
    if ("notifications" in $$props2)
      $$invalidate(2, notifications = $$props2.notifications);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 1) {
      if (position.includes("top")) {
        $$invalidate(4, y = -50);
      } else {
        $$invalidate(4, y = 50);
      }
    }
  };
  return [
    position,
    sharedContainer,
    notifications,
    x,
    y,
    overflowY,
    $accountCenter$,
    device,
    accountCenter$,
    updateScrollYOnRemove,
    click_handler
  ];
}
class Index extends SvelteComponent {
  constructor(options) {
    super();
    init$1(
      this,
      options,
      instance,
      create_fragment,
      safe_not_equal,
      {
        position: 0,
        sharedContainer: 1,
        notifications: 2
      },
      add_css
    );
  }
}
export { Index as default };
