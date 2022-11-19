import{S as R,O as l,A as x,a as S,i as m,E as z,b as Y,c as P,m as T,s as G,o as J,d as K,e as g,f as H,p as $,g as X,h as Z,j as _,k as ee,l as ne,n as te,q as M,r as ae,t as re,u as q,v as ie,w as U,x as se,y as ue,z as oe,B as W,C as ce}from"./zipWith.0cd32fa6.js";import{P as sn,d as un,G as on,D as cn,u as fn,E as ln,Q as vn,N as mn,L as dn,T as hn,O as pn,R as bn,J as gn,U as yn,f as An,K as wn,S as En,V as Fn,W as In,H as xn,I as Sn,a6 as Tn,a7 as qn,a8 as On,a9 as kn,aa as Ln,ab as Mn,ac as Wn,ad as Cn,ae as Vn,X as jn,af as Rn,ag as zn,Y as Pn,ah as Un,ai as Nn,aj as Dn,ak as Bn,a5 as Qn,al as Yn,am as Gn,an as Jn,ao as Kn,ap as Hn,aq as $n,ar as Xn,as as Zn,at as _n,au as et,av as nt,aw as tt,Z as at,ax as rt,ay as it,az as st,aA as ut,aB as ot,aC as ct,B as ft,aD as lt,aE as vt,aF as mt,aG as dt,aP as ht,w as pt,aH as bt,q as gt,aI as yt,_ as At,aJ as wt,aK as Et,aL as Ft,aM as It,aN as xt,aO as St,v as Tt,l as qt,aQ as Ot,aR as kt,aS as Lt,aT as Mt,aU as Wt,x as Ct,F as Vt,o as jt,$ as Rt,aV as zt,M as Pt,aW as Ut,aX as Nt,aY as Dt,aZ as Bt,a_ as Qt,a0 as Yt,a$ as Gt,b0 as Jt,b5 as Kt,b1 as Ht,b2 as $t,b3 as Xt,b4 as Zt,b6 as _t,b7 as ea,b8 as na,a4 as ta,b9 as aa,ba as ra,bb as ia,bc as sa,bd as ua,be as oa,bf as ca,bg as fa,bh as la,s as va,bi as ma,bj as da,bk as ha,bl as pa,bm as ba,bn as ga,bo as ya,bp as Aa,bq as wa,br as Ea,bs as Fa,a1 as Ia,bt as xa,bu as Sa,bv as Ta,bw as qa,a2 as Oa,bx as ka,by as La,bz as Ma,bA as Wa,bB as Ca,bC as Va,bD as ja,bE as Ra,a3 as za,bF as Pa,bG as Ua}from"./zipWith.0cd32fa6.js";import{a as A,b as w,_ as h,bn as fe}from"./index.25dc9682.js";var N={now:function(){return(N.delegate||performance).now()},delegate:void 0},b={schedule:function(n){var t=requestAnimationFrame,e=cancelAnimationFrame,r=b.delegate;r&&(t=r.requestAnimationFrame,e=r.cancelAnimationFrame);var a=t(function(i){e=void 0,n(i)});return new R(function(){return e==null?void 0:e(a)})},requestAnimationFrame:function(){for(var n=[],t=0;t<arguments.length;t++)n[t]=arguments[t];var e=b.delegate;return((e==null?void 0:e.requestAnimationFrame)||requestAnimationFrame).apply(void 0,A([],w(n)))},cancelAnimationFrame:function(){for(var n=[],t=0;t<arguments.length;t++)n[t]=arguments[t];var e=b.delegate;return((e==null?void 0:e.cancelAnimationFrame)||cancelAnimationFrame).apply(void 0,A([],w(n)))},delegate:void 0};function je(n){return n?D(n):le}function D(n){return new l(function(t){var e=n||N,r=e.now(),a=0,i=function(){t.closed||(a=b.requestAnimationFrame(function(s){a=0;var u=e.now();t.next({timestamp:n?u:s,elapsed:u-r}),i()}))};return i(),function(){a&&b.cancelAnimationFrame(a)}})}var le=D(),ve=1,O,k={};function C(n){return n in k?(delete k[n],!0):!1}var B={setImmediate:function(n){var t=ve++;return k[t]=!0,O||(O=Promise.resolve()),O.then(function(){return C(t)&&n()}),t},clearImmediate:function(n){C(n)}},me=B.setImmediate,de=B.clearImmediate,F={setImmediate:function(){for(var n=[],t=0;t<arguments.length;t++)n[t]=arguments[t];var e=F.delegate;return((e==null?void 0:e.setImmediate)||me).apply(void 0,A([],w(n)))},clearImmediate:function(n){var t=F.delegate;return((t==null?void 0:t.clearImmediate)||de)(n)},delegate:void 0},he=function(n){h(t,n);function t(e,r){var a=n.call(this,e,r)||this;return a.scheduler=e,a.work=r,a}return t.prototype.requestAsyncId=function(e,r,a){return a===void 0&&(a=0),a!==null&&a>0?n.prototype.requestAsyncId.call(this,e,r,a):(e.actions.push(this),e._scheduled||(e._scheduled=F.setImmediate(e.flush.bind(e,void 0))))},t.prototype.recycleAsyncId=function(e,r,a){var i;if(a===void 0&&(a=0),a!=null?a>0:this.delay>0)return n.prototype.recycleAsyncId.call(this,e,r,a);var s=e.actions;r!=null&&((i=s[s.length-1])===null||i===void 0?void 0:i.id)!==r&&(F.clearImmediate(r),e._scheduled=void 0)},t}(x),pe=function(n){h(t,n);function t(){return n!==null&&n.apply(this,arguments)||this}return t.prototype.flush=function(e){this._active=!0;var r=this._scheduled;this._scheduled=void 0;var a=this.actions,i;e=e||a.shift();do if(i=e.execute(e.state,e.delay))break;while((e=a[0])&&e.id===r&&a.shift());if(this._active=!1,i){for(;(e=a[0])&&e.id===r&&a.shift();)e.unsubscribe();throw i}},t}(S),be=new pe(he),Re=be,ge=function(n){h(t,n);function t(e,r){var a=n.call(this,e,r)||this;return a.scheduler=e,a.work=r,a}return t.prototype.schedule=function(e,r){return r===void 0&&(r=0),r>0?n.prototype.schedule.call(this,e,r):(this.delay=r,this.state=e,this.scheduler.flush(this),this)},t.prototype.execute=function(e,r){return r>0||this.closed?n.prototype.execute.call(this,e,r):this._execute(e,r)},t.prototype.requestAsyncId=function(e,r,a){return a===void 0&&(a=0),a!=null&&a>0||a==null&&this.delay>0?n.prototype.requestAsyncId.call(this,e,r,a):(e.flush(this),0)},t}(x),ye=function(n){h(t,n);function t(){return n!==null&&n.apply(this,arguments)||this}return t}(S),Ae=new ye(ge),ze=Ae,we=function(n){h(t,n);function t(e,r){var a=n.call(this,e,r)||this;return a.scheduler=e,a.work=r,a}return t.prototype.requestAsyncId=function(e,r,a){return a===void 0&&(a=0),a!==null&&a>0?n.prototype.requestAsyncId.call(this,e,r,a):(e.actions.push(this),e._scheduled||(e._scheduled=b.requestAnimationFrame(function(){return e.flush(void 0)})))},t.prototype.recycleAsyncId=function(e,r,a){var i;if(a===void 0&&(a=0),a!=null?a>0:this.delay>0)return n.prototype.recycleAsyncId.call(this,e,r,a);var s=e.actions;r!=null&&((i=s[s.length-1])===null||i===void 0?void 0:i.id)!==r&&(b.cancelAnimationFrame(r),e._scheduled=void 0)},t}(x),Ee=function(n){h(t,n);function t(){return n!==null&&n.apply(this,arguments)||this}return t.prototype.flush=function(e){this._active=!0;var r=this._scheduled;this._scheduled=void 0;var a=this.actions,i;e=e||a.shift();do if(i=e.execute(e.state,e.delay))break;while((e=a[0])&&e.id===r&&a.shift());if(this._active=!1,i){for(;(e=a[0])&&e.id===r&&a.shift();)e.unsubscribe();throw i}},t}(S),Fe=new Ee(we),Pe=Fe,Ue=function(n){h(t,n);function t(e,r){e===void 0&&(e=Ie),r===void 0&&(r=1/0);var a=n.call(this,e,function(){return a.frame})||this;return a.maxFrames=r,a.frame=0,a.index=-1,a}return t.prototype.flush=function(){for(var e=this,r=e.actions,a=e.maxFrames,i,s;(s=r[0])&&s.delay<=a&&(r.shift(),this.frame=s.delay,!(i=s.execute(s.state,s.delay))););if(i){for(;s=r.shift();)s.unsubscribe();throw i}},t.frameTimeFactor=10,t}(S),Ie=function(n){h(t,n);function t(e,r,a){a===void 0&&(a=e.index+=1);var i=n.call(this,e,r)||this;return i.scheduler=e,i.work=r,i.index=a,i.active=!0,i.index=e.index=a,i}return t.prototype.schedule=function(e,r){if(r===void 0&&(r=0),Number.isFinite(r)){if(!this.id)return n.prototype.schedule.call(this,e,r);this.active=!1;var a=new t(this.scheduler,this.work);return this.add(a),a.schedule(e,r)}else return R.EMPTY},t.prototype.requestAsyncId=function(e,r,a){a===void 0&&(a=0),this.delay=e.frame+a;var i=e.actions;return i.push(this),i.sort(t.sortActions),1},t.prototype.recycleAsyncId=function(e,r,a){},t.prototype._execute=function(e,r){if(this.active===!0)return n.prototype._execute.call(this,e,r)},t.sortActions=function(e,r){return e.delay===r.delay?e.index===r.index?0:e.index>r.index?1:-1:e.delay>r.delay?1:-1},t}(x);function Ne(n){return!!n&&(n instanceof l||m(n.lift)&&m(n.subscribe))}function De(n,t){var e=typeof t=="object";return new Promise(function(r,a){var i=!1,s;n.subscribe({next:function(u){s=u,i=!0},error:a,complete:function(){i?r(s):e?r(t.defaultValue):a(new z)}})})}function Be(n,t){var e=typeof t=="object";return new Promise(function(r,a){var i=new Y({next:function(s){r(s),i.unsubscribe()},error:a,complete:function(){e?r(t.defaultValue):a(new z)}});n.subscribe(i)})}function I(n,t,e,r){if(e)if(P(e))r=e;else return function(){for(var a=[],i=0;i<arguments.length;i++)a[i]=arguments[i];return I(n,t,r).apply(this,a).pipe(T(e))};return r?function(){for(var a=[],i=0;i<arguments.length;i++)a[i]=arguments[i];return I(n,t).apply(this,a).pipe(G(r),J(r))}:function(){for(var a=this,i=[],s=0;s<arguments.length;s++)i[s]=arguments[s];var u=new K,o=!0;return new l(function(f){var c=u.subscribe(f);if(o){o=!1;var v=!1,E=!1;t.apply(a,A(A([],w(i)),[function(){for(var d=[],p=0;p<arguments.length;p++)d[p]=arguments[p];if(n){var y=d.shift();if(y!=null){u.error(y);return}}u.next(1<d.length?d:d[0]),E=!0,v&&u.complete()}])),E&&u.complete(),v=!0}return c})}}function Qe(n,t,e){return I(!1,n,t,e)}function Ye(n,t,e){return I(!0,n,t,e)}function L(n){return new l(function(t){g(n()).subscribe(t)})}var xe={connector:function(){return new H},resetOnDisconnect:!0};function Ge(n,t){t===void 0&&(t=xe);var e=null,r=t.connector,a=t.resetOnDisconnect,i=a===void 0?!0:a,s=r(),u=new l(function(o){return s.subscribe(o)});return u.connect=function(){return(!e||e.closed)&&(e=L(function(){return n}).subscribe(s),i&&e.add(function(){return s=r()})),e},u}function Je(){for(var n=[],t=0;t<arguments.length;t++)n[t]=arguments[t];var e=$(n),r=X(n),a=r.args,i=r.keys,s=new l(function(u){var o=a.length;if(!o){u.complete();return}for(var f=new Array(o),c=o,v=o,E=function(p){var y=!1;g(a[p]).subscribe(Z(u,function(Q){y||(y=!0,v--),f[p]=Q},function(){return c--},void 0,function(){(!c||!y)&&(v||u.next(i?_(i,f):f),u.complete())}))},d=0;d<o;d++)E(d)});return e?s.pipe(T(e)):s}var Se=["addListener","removeListener"],Te=["addEventListener","removeEventListener"],qe=["on","off"];function V(n,t,e,r){if(m(e)&&(r=e,e=void 0),r)return V(n,t,e).pipe(T(r));var a=w(Le(n)?Te.map(function(u){return function(o){return n[u](t,o,e)}}):Oe(n)?Se.map(j(n,t)):ke(n)?qe.map(j(n,t)):[],2),i=a[0],s=a[1];if(!i&&ee(n))return ne(function(u){return V(u,t,e)})(g(n));if(!i)throw new TypeError("Invalid event target");return new l(function(u){var o=function(){for(var f=[],c=0;c<arguments.length;c++)f[c]=arguments[c];return u.next(1<f.length?f:f[0])};return i(o),function(){return s(o)}})}function j(n,t){return function(e){return function(r){return n[e](t,r)}}}function Oe(n){return m(n.addListener)&&m(n.removeListener)}function ke(n){return m(n.on)&&m(n.off)}function Le(n){return m(n.addEventListener)&&m(n.removeEventListener)}function Me(n,t,e){return e?Me(n,t).pipe(T(e)):new l(function(r){var a=function(){for(var s=[],u=0;u<arguments.length;u++)s[u]=arguments[u];return r.next(s.length===1?s[0]:s)},i=n(a);return m(t)?function(){return t(a,i)}:void 0})}function Ke(n,t,e,r,a){var i,s,u,o;arguments.length===1?(i=n,o=i.initialState,t=i.condition,e=i.iterate,s=i.resultSelector,u=s===void 0?M:s,a=i.scheduler):(o=n,!r||P(r)?(u=M,a=r):u=r);function f(){var c;return fe(this,function(v){switch(v.label){case 0:c=o,v.label=1;case 1:return!t||t(c)?[4,u(c)]:[3,4];case 2:v.sent(),v.label=3;case 3:return c=e(c),[3,1];case 4:return[2]}})}return L(a?function(){return te(f(),a)}:f)}function He(n,t,e){return L(function(){return n()?t:e})}function $e(){for(var n=[],t=0;t<arguments.length;t++)n[t]=arguments[t];var e=ae(n),r=re(n,1/0),a=n;return a.length?a.length===1?g(a[0]):ie(r)(U(a,e)):q}var We=new l(se);function Xe(){return We}function Ze(){for(var n=[],t=0;t<arguments.length;t++)n[t]=arguments[t];return ue(oe(n))(q)}function _e(n,t){return U(Object.entries(n),t)}function en(n,t,e){return[W(t,e)(g(n)),W(ce(t,e))(g(n))]}function nn(n,t,e){if(t==null&&(t=n,n=0),t<=0)return q;var r=t+n;return new l(e?function(a){var i=n;return e.schedule(function(){i<r?(a.next(i++),this.schedule()):a.complete()})}:function(a){for(var i=n;i<r&&!a.closed;)a.next(i++);a.complete()})}function tn(n,t){return new l(function(e){var r=n(),a=t(r),i=a?g(a):q;return i.subscribe(e),function(){r&&r.unsubscribe()}})}export{sn as ArgumentOutOfRangeError,un as AsyncSubject,on as BehaviorSubject,cn as ConnectableObservable,fn as EMPTY,ln as EmptyError,We as NEVER,vn as NotFoundError,mn as Notification,dn as NotificationKind,hn as ObjectUnsubscribedError,pn as Observable,bn as ReplaySubject,gn as Scheduler,yn as SequenceError,An as Subject,wn as Subscriber,En as Subscription,Fn as TimeoutError,In as UnsubscriptionError,Ie as VirtualAction,Ue as VirtualTimeScheduler,Pe as animationFrame,Fe as animationFrameScheduler,je as animationFrames,Re as asap,be as asapScheduler,xn as async,Sn as asyncScheduler,Tn as audit,qn as auditTime,Qe as bindCallback,Ye as bindNodeCallback,On as buffer,kn as bufferCount,Ln as bufferTime,Mn as bufferToggle,Wn as bufferWhen,Cn as catchError,Vn as combineAll,jn as combineLatest,Rn as combineLatestAll,zn as combineLatestWith,Pn as concat,Un as concatAll,Nn as concatMap,Dn as concatMapTo,Bn as concatWith,Qn as config,Yn as connect,Ge as connectable,Gn as count,Jn as debounce,Kn as debounceTime,Hn as defaultIfEmpty,L as defer,$n as delay,Xn as delayWhen,Zn as dematerialize,_n as distinct,et as distinctUntilChanged,nt as distinctUntilKeyChanged,tt as elementAt,at as empty,rt as endWith,it as every,st as exhaust,ut as exhaustAll,ot as exhaustMap,ct as expand,ft as filter,lt as finalize,vt as find,mt as findIndex,dt as first,Be as firstValueFrom,ht as flatMap,Je as forkJoin,pt as from,V as fromEvent,Me as fromEventPattern,Ke as generate,bt as groupBy,gt as identity,yt as ignoreElements,He as iif,At as interval,wt as isEmpty,Ne as isObservable,Et as last,De as lastValueFrom,Ft as map,It as mapTo,xt as materialize,St as max,$e as merge,Tt as mergeAll,qt as mergeMap,Ot as mergeMapTo,kt as mergeScan,Lt as mergeWith,Mt as min,Wt as multicast,Xe as never,Ct as noop,Vt as observable,jt as observeOn,Rt as of,Ze as onErrorResumeNext,_e as pairs,zt as pairwise,en as partition,Pt as pipe,Ut as pluck,Nt as publish,Dt as publishBehavior,Bt as publishLast,Qt as publishReplay,ze as queue,Ae as queueScheduler,Yt as race,Gt as raceWith,nn as range,Jt as reduce,Kt as refCount,Ht as repeat,$t as repeatWhen,Xt as retry,Zt as retryWhen,_t as sample,ea as sampleTime,na as scan,ta as scheduled,aa as sequenceEqual,ra as share,ia as shareReplay,sa as single,ua as skip,oa as skipLast,ca as skipUntil,fa as skipWhile,la as startWith,va as subscribeOn,ma as switchAll,da as switchMap,ha as switchMapTo,pa as switchScan,ba as take,ga as takeLast,ya as takeUntil,Aa as takeWhile,wa as tap,Ea as throttle,Fa as throttleTime,Ia as throwError,xa as throwIfEmpty,Sa as timeInterval,Ta as timeout,qa as timeoutWith,Oa as timer,ka as timestamp,La as toArray,tn as using,Ma as window,Wa as windowCount,Ca as windowTime,Va as windowToggle,ja as windowWhen,Ra as withLatestFrom,za as zip,Pa as zipAll,Ua as zipWith};