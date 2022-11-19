import { B as filter, C as not, a$ as raceWith, z as argsOrArgArray } from "./zipWith.3f4b474e.js";
export { a6 as audit, a7 as auditTime, a8 as buffer, a9 as bufferCount, aa as bufferTime, ab as bufferToggle, ac as bufferWhen, ad as catchError, ae as combineAll, bH as combineLatest, af as combineLatestAll, ag as combineLatestWith, bI as concat, ah as concatAll, ai as concatMap, aj as concatMapTo, ak as concatWith, al as connect, am as count, an as debounce, ao as debounceTime, ap as defaultIfEmpty, aq as delay, ar as delayWhen, as as dematerialize, at as distinct, au as distinctUntilChanged, av as distinctUntilKeyChanged, aw as elementAt, ax as endWith, ay as every, az as exhaust, aA as exhaustAll, aB as exhaustMap, aC as expand, B as filter, aD as finalize, aE as find, aF as findIndex, aG as first, aP as flatMap, aH as groupBy, aI as ignoreElements, aJ as isEmpty, aK as last, aL as map, aM as mapTo, aN as materialize, aO as max, bJ as merge, v as mergeAll, l as mergeMap, aQ as mergeMapTo, aR as mergeScan, aS as mergeWith, aT as min, aU as multicast, o as observeOn, y as onErrorResumeNext, aV as pairwise, aW as pluck, aX as publish, aY as publishBehavior, aZ as publishLast, a_ as publishReplay, a$ as raceWith, b0 as reduce, b5 as refCount, b1 as repeat, b2 as repeatWhen, b3 as retry, b4 as retryWhen, b6 as sample, b7 as sampleTime, b8 as scan, b9 as sequenceEqual, ba as share, bb as shareReplay, bc as single, bd as skip, be as skipLast, bf as skipUntil, bg as skipWhile, bh as startWith, s as subscribeOn, bi as switchAll, bj as switchMap, bk as switchMapTo, bl as switchScan, bm as take, bn as takeLast, bo as takeUntil, bp as takeWhile, bq as tap, br as throttle, bs as throttleTime, bt as throwIfEmpty, bu as timeInterval, bv as timeout, bw as timeoutWith, bx as timestamp, by as toArray, bz as window, bA as windowCount, bB as windowTime, bC as windowToggle, bD as windowWhen, bE as withLatestFrom, bK as zip, bF as zipAll, bG as zipWith } from "./zipWith.3f4b474e.js";
import { a as __spreadArray, b as __read } from "./index.8052dd69.js";
function partition(predicate, thisArg) {
  return function(source) {
    return [filter(predicate, thisArg)(source), filter(not(predicate, thisArg))(source)];
  };
}
function race() {
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
  return raceWith.apply(void 0, __spreadArray([], __read(argsOrArgArray(args))));
}
export { partition, race };
