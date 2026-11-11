var re=Object.defineProperty;var ne=(n,t,e)=>t in n?re(n,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[t]=e;var x=(n,t,e)=>ne(n,typeof t!="symbol"?t+"":t,e);var w=window.LX||{},I=document.documentElement.classList.contains("lx-embedded");function oe(){try{if(document.referrer)return new URL(document.referrer).origin}catch{}return"*"}var st=oe(),Rt=w.moodleOrigins||[],ae=I&&(Rt.length===0||Rt.includes(st));function Ut(n){if(!ae)return!1;try{return window.parent.postMessage(n,st),!0}catch{return!1}}var Lt=0;function Pt(){let n=Math.ceil(document.body.getBoundingClientRect().height)+24;Math.abs(n-Lt)<8||(Lt=n,Ut({type:"moodleIframeResize",height:n}))}I&&(new ResizeObserver(()=>requestAnimationFrame(Pt)).observe(document.body),addEventListener("load",Pt));var H=new Map,le=w.page&&w.page.gradeMode||w.gradeMode||"on-complete",ht=null,T=document.querySelector(".lx-scorebar"),ce=T&&T.querySelector(".lx-scorebar__fill"),de=T&&T.querySelector(".lx-scorebar__label"),et=T&&T.querySelector(".lx-scorebar__status");function Ot(){let n=0,t=0,e=0,s=0;for(let i of H.values())i.graded&&(s++,t+=i.max,n+=i.score||0,i.complete&&e++);return{score:Math.round(n*100)/100,max:t,done:e,count:s}}function he(){let n=Ot();if(!n.count)return;if(T&&(T.hidden=!1,ce.style.width=`${n.max?n.score/n.max*100:0}%`,de.textContent=`Score ${n.score} / ${n.max}`),!(le==="each-answer"?n.done>0:n.done===n.count)){et&&(et.textContent=`${n.done} of ${n.count} activities done`);return}let e=`${n.score}/${n.max}`;if(e===ht)return;ht=e;let s=Ut({type:"moodleSubmitGrade",score:n.score,maxScore:n.max});et&&(et.textContent=s?"Result sent to Moodle":I?"Not sent: unknown host":"Practice mode \u2014 not recorded"),document.dispatchEvent(new CustomEvent("lx-graded",{detail:{...n,sent:s}}))}document.addEventListener("lx-register",n=>{let t=n.detail;H.set(t.id,{graded:t.graded,max:t.max,score:0,complete:!1})});document.addEventListener("lx-progress",n=>{let t=n.detail;H.set(t.id,{...H.get(t.id)||{},...t}),he()});if(I){let n=st!=="*"?st:null,t=[...document.querySelectorAll("a[data-lx-page]")];for(let e of document.querySelectorAll("a[href]")){let s=e.getAttribute("href");!s||s.startsWith("#")||e.target==="_blank"||e.hasAttribute("data-lx-page")||(e.target="_blank",e.rel="noopener")}if(t.length){let e=n&&w.cid?`${n}/course/view.php?id=${encodeURIComponent(w.cid)}`:null,s=i=>{for(let r of t){let o=i&&i[r.dataset.lxPage],a=o?`${n}/mod/extpagewithgrades/view.php?id=${o}`:e;a?(r.href=a,r.target="_top",r.title=o?"Open this topic in Moodle":"Open the Moodle course"):(r.target="_blank",r.rel="noopener")}};s(null),n&&w.cid&&fetch(`${w.siteRoot}moodle.json`,{cache:"no-cache"}).then(i=>i.ok?i.json():{}).then(i=>s(i.sites?.[n]?.courses?.[w.cid]||null)).catch(()=>{})}}var L=document.querySelector("[data-slides]");if(L){let p=function(g,{scroll:b=!1,focus:Mt=!1}={}){a=Math.max(0,Math.min(r,g)),n.forEach((A,k)=>{A.hidden=k!==a,A.classList.toggle("is-active",k===a)}),t.forEach((A,k)=>{A.classList.toggle("is-active",k===a),k===a?A.setAttribute("aria-current","step"):A.removeAttribute("aria-current")}),t[a]?.scrollIntoView({block:"nearest",inline:"nearest"}),e.disabled=a===0,s.disabled=a===r,s.textContent=a===r?"Done \u2713":"Next \u2192",i.textContent=`${a+1} / ${n.length}`,document.documentElement.classList.toggle("lx-slide-later",a>0);try{sessionStorage.setItem(o,String(a))}catch{}I||history.replaceState(null,"",`#lx-slide-${a+1}`),b&&c.scrollIntoView({block:"start",behavior:"smooth"}),Mt&&n[a].querySelector("h2, [tabindex], button, a")?.focus({preventScroll:!0})},v=function(){n.forEach((g,b)=>{let A=[...g.querySelectorAll("lx-quiz, lx-order, lx-scenario, lx-spot")].map(k=>k.id).map(k=>H.get(k)).filter(k=>k&&k.graded);t[b]?.classList.toggle("is-done",A.length>0&&A.every(k=>k.complete))})},n=[...L.querySelectorAll(".lx-slide")],t=[...L.querySelectorAll(".lx-step")],e=L.querySelector("[data-slide-prev]"),s=L.querySelector("[data-slide-next]"),i=L.querySelector(".lx-slidenav__count"),r=n.length-1,o=`lx:slide:${w.course}:${w.page&&w.page.id||location.pathname}`,a=0,c=document.createElement("span");c.setAttribute("aria-hidden","true"),c.style.cssText=`position:absolute;left:0;width:1px;height:1px;top:-${I?96:76}px`,L.prepend(c);let h=()=>{let g=location.hash.match(/^#lx-slide-(\d+)$/);return g?Number(g[1])-1:null},u=()=>{try{return Number(sessionStorage.getItem(o))}catch{return null}};e.addEventListener("click",()=>p(a-1,{scroll:!0})),s.addEventListener("click",()=>p(a+1,{scroll:!0})),t.forEach((g,b)=>g.addEventListener("click",()=>p(b,{scroll:!0}))),document.addEventListener("keydown",g=>{if(g.altKey||g.ctrlKey||g.metaKey||g.shiftKey||g.key!=="ArrowRight"&&g.key!=="ArrowLeft")return;let b=g.composedPath()[0];b&&b.closest&&b.closest("input, textarea, select, [contenteditable], li")||p(a+(g.key==="ArrowRight"?1:-1),{scroll:!0})}),document.addEventListener("lx-progress",()=>queueMicrotask(v));let y=h()??u()??0;p(Number.isFinite(y)?y:0)}var pe={auto:'<circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 0 0 18z" fill="currentColor"/>',light:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',dark:'<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>'},ue={auto:"light",light:"dark",dark:"auto"},j=document.querySelector("[data-lx-theme-toggle]");function pt(){if(!j||!window.LXTheme)return;let n=window.LXTheme.mode;j.querySelector("svg").innerHTML=pe[n];let t=`Colour theme: ${n==="auto"?"system":n}`;j.setAttribute("aria-label",t),j.title=t}j?.addEventListener("click",()=>{window.LXTheme.set(ue[window.LXTheme.mode]||"auto"),pt()});pt();document.addEventListener("lx-theme",pt);for(let n of document.querySelectorAll(".lx-prose pre")){let t=document.createElement("button");t.className="lx-copy",t.type="button",t.textContent="Copy",t.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(n.querySelector("code")?.innerText??n.innerText),t.textContent="Copied"}catch{t.textContent="Select & copy"}setTimeout(()=>t.textContent="Copy",1500)}),n.appendChild(t)}window.LXBridge={widgets:H,totals:Ot,get lastSent(){return ht}};var it=globalThis,rt=it.ShadowRoot&&(it.ShadyCSS===void 0||it.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ut=Symbol(),Nt=new WeakMap,B=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==ut)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(rt&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=Nt.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Nt.set(e,t))}return t}toString(){return this.cssText}},It=n=>new B(typeof n=="string"?n:n+"",void 0,ut),$=(n,...t)=>{let e=n.length===1?n[0]:t.reduce((s,i,r)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+n[r+1],n[0]);return new B(e,n,ut)},Ht=(n,t)=>{if(rt)n.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),i=it.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,n.appendChild(s)}},gt=rt?n=>n:n=>n instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return It(e)})(n):n;var{is:ge,defineProperty:fe,getOwnPropertyDescriptor:me,getOwnPropertyNames:xe,getOwnPropertySymbols:ve,getPrototypeOf:be}=Object,nt=globalThis,qt=nt.trustedTypes,$e=qt?qt.emptyScript:"",ye=nt.reactiveElementPolyfillSupport,W=(n,t)=>n,ft={toAttribute(n,t){switch(t){case Boolean:n=n?$e:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,t){let e=n;switch(t){case Boolean:e=n!==null;break;case Number:e=n===null?null:Number(n);break;case Object:case Array:try{e=JSON.parse(n)}catch{e=null}}return e}},Dt=(n,t)=>!ge(n,t),zt={attribute:!0,type:String,converter:ft,reflect:!1,useDefault:!1,hasChanged:Dt};Symbol.metadata??=Symbol("metadata"),nt.litPropertyMetadata??=new WeakMap;var E=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=zt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&fe(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){let{get:i,set:r}=me(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:i,set(o){let a=i?.call(this);r?.call(this,o),this.requestUpdate(t,a,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??zt}static _$Ei(){if(this.hasOwnProperty(W("elementProperties")))return;let t=be(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(W("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(W("properties"))){let e=this.properties,s=[...xe(e),...ve(e)];for(let i of s)this.createProperty(i,e[i])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let i of s)e.unshift(gt(i))}else t!==void 0&&e.push(gt(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ht(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){let s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){let r=(s.converter?.toAttribute!==void 0?s.converter:ft).toAttribute(e,s.type);this._$Em=t,r==null?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(t,e){let s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let r=s.getPropertyOptions(i),o=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:ft;this._$Em=i;let a=o.fromAttribute(e,r.type);this[i]=a??this._$Ej?.get(i)??a,this._$Em=null}}requestUpdate(t,e,s,i=!1,r){if(t!==void 0){let o=this.constructor;if(i===!1&&(r=this[t]),s??=o.getPropertyOptions(t),!((s.hasChanged??Dt)(r,e)||s.useDefault&&s.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:r},o){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),r!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,r]of this._$Ep)this[i]=r;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,r]of s){let{wrapped:o}=r,a=this[i];o!==!0||this._$AL.has(i)||a===void 0||this.C(i,void 0,r,a)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};E.elementStyles=[],E.shadowRootOptions={mode:"open"},E[W("elementProperties")]=new Map,E[W("finalized")]=new Map,ye?.({ReactiveElement:E}),(nt.reactiveElementVersions??=[]).push("2.1.2");var kt=globalThis,jt=n=>n,ot=kt.trustedTypes,Bt=ot?ot.createPolicy("lit-html",{createHTML:n=>n}):void 0,Ft="$lit$",M=`lit$${Math.random().toFixed(9).slice(2)}$`,Jt="?"+M,ke=`<${Jt}>`,O=document,V=()=>O.createComment(""),X=n=>n===null||typeof n!="object"&&typeof n!="function",wt=Array.isArray,we=n=>wt(n)||typeof n?.[Symbol.iterator]=="function",mt=`[ 	
\f\r]`,Y=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Wt=/-->/g,Yt=/>/g,P=RegExp(`>|${mt}(?:([^\\s"'>=/]+)(${mt}*=${mt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Vt=/'/g,Xt=/"/g,Gt=/^(?:script|style|textarea|title)$/i,_t=n=>(t,...e)=>({_$litType$:n,strings:t,values:e}),l=_t(1),Be=_t(2),We=_t(3),C=Symbol.for("lit-noChange"),d=Symbol.for("lit-nothing"),Kt=new WeakMap,U=O.createTreeWalker(O,129);function Qt(n,t){if(!wt(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return Bt!==void 0?Bt.createHTML(t):t}var _e=(n,t)=>{let e=n.length-1,s=[],i,r=t===2?"<svg>":t===3?"<math>":"",o=Y;for(let a=0;a<e;a++){let c=n[a],h,u,p=-1,v=0;for(;v<c.length&&(o.lastIndex=v,u=o.exec(c),u!==null);)v=o.lastIndex,o===Y?u[1]==="!--"?o=Wt:u[1]!==void 0?o=Yt:u[2]!==void 0?(Gt.test(u[2])&&(i=RegExp("</"+u[2],"g")),o=P):u[3]!==void 0&&(o=P):o===P?u[0]===">"?(o=i??Y,p=-1):u[1]===void 0?p=-2:(p=o.lastIndex-u[2].length,h=u[1],o=u[3]===void 0?P:u[3]==='"'?Xt:Vt):o===Xt||o===Vt?o=P:o===Wt||o===Yt?o=Y:(o=P,i=void 0);let y=o===P&&n[a+1].startsWith("/>")?" ":"";r+=o===Y?c+ke:p>=0?(s.push(h),c.slice(0,p)+Ft+c.slice(p)+M+y):c+M+(p===-2?a:y)}return[Qt(n,r+(n[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},K=class n{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let r=0,o=0,a=t.length-1,c=this.parts,[h,u]=_e(t,e);if(this.el=n.createElement(h,s),U.currentNode=this.el.content,e===2||e===3){let p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(i=U.nextNode())!==null&&c.length<a;){if(i.nodeType===1){if(i.hasAttributes())for(let p of i.getAttributeNames())if(p.endsWith(Ft)){let v=u[o++],y=i.getAttribute(p).split(M),g=/([.?@])?(.*)/.exec(v);c.push({type:1,index:r,name:g[2],strings:y,ctor:g[1]==="."?vt:g[1]==="?"?bt:g[1]==="@"?$t:z}),i.removeAttribute(p)}else p.startsWith(M)&&(c.push({type:6,index:r}),i.removeAttribute(p));if(Gt.test(i.tagName)){let p=i.textContent.split(M),v=p.length-1;if(v>0){i.textContent=ot?ot.emptyScript:"";for(let y=0;y<v;y++)i.append(p[y],V()),U.nextNode(),c.push({type:2,index:++r});i.append(p[v],V())}}}else if(i.nodeType===8)if(i.data===Jt)c.push({type:2,index:r});else{let p=-1;for(;(p=i.data.indexOf(M,p+1))!==-1;)c.push({type:7,index:r}),p+=M.length-1}r++}}static createElement(t,e){let s=O.createElement("template");return s.innerHTML=t,s}};function q(n,t,e=n,s){if(t===C)return t;let i=s!==void 0?e._$Co?.[s]:e._$Cl,r=X(t)?void 0:t._$litDirective$;return i?.constructor!==r&&(i?._$AO?.(!1),r===void 0?i=void 0:(i=new r(n),i._$AT(n,e,s)),s!==void 0?(e._$Co??=[])[s]=i:e._$Cl=i),i!==void 0&&(t=q(n,i._$AS(n,t.values),i,s)),t}var xt=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??O).importNode(e,!0);U.currentNode=i;let r=U.nextNode(),o=0,a=0,c=s[0];for(;c!==void 0;){if(o===c.index){let h;c.type===2?h=new F(r,r.nextSibling,this,t):c.type===1?h=new c.ctor(r,c.name,c.strings,this,t):c.type===6&&(h=new yt(r,this,t)),this._$AV.push(h),c=s[++a]}o!==c?.index&&(r=U.nextNode(),o++)}return U.currentNode=O,i}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},F=class n{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=d,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=q(this,t,e),X(t)?t===d||t==null||t===""?(this._$AH!==d&&this._$AR(),this._$AH=d):t!==this._$AH&&t!==C&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):we(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==d&&X(this._$AH)?this._$AA.nextSibling.data=t:this.T(O.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=K.createElement(Qt(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{let r=new xt(i,this),o=r.u(this.options);r.p(e),this.T(o),this._$AH=r}}_$AC(t){let e=Kt.get(t.strings);return e===void 0&&Kt.set(t.strings,e=new K(t)),e}k(t){wt(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,i=0;for(let r of t)i===e.length?e.push(s=new n(this.O(V()),this.O(V()),this,this.options)):s=e[i],s._$AI(r),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let s=jt(t).nextSibling;jt(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},z=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,r){this.type=1,this._$AH=d,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=r,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=d}_$AI(t,e=this,s,i){let r=this.strings,o=!1;if(r===void 0)t=q(this,t,e,0),o=!X(t)||t!==this._$AH&&t!==C,o&&(this._$AH=t);else{let a=t,c,h;for(t=r[0],c=0;c<r.length-1;c++)h=q(this,a[s+c],e,c),h===C&&(h=this._$AH[c]),o||=!X(h)||h!==this._$AH[c],h===d?t=d:t!==d&&(t+=(h??"")+r[c+1]),this._$AH[c]=h}o&&!i&&this.j(t)}j(t){t===d?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},vt=class extends z{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===d?void 0:t}},bt=class extends z{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==d)}},$t=class extends z{constructor(t,e,s,i,r){super(t,e,s,i,r),this.type=5}_$AI(t,e=this){if((t=q(this,t,e,0)??d)===C)return;let s=this._$AH,i=t===d&&s!==d||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,r=t!==d&&(s===d||i);i&&this.element.removeEventListener(this.name,this,s),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},yt=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){q(this,t)}};var Se=kt.litHtmlPolyfillSupport;Se?.(K,F),(kt.litHtmlVersions??=[]).push("3.3.3");var Zt=(n,t,e)=>{let s=e?.renderBefore??t,i=s._$litPart$;if(i===void 0){let r=e?.renderBefore??null;s._$litPart$=i=new F(t.insertBefore(V(),r),r,void 0,e??{})}return i._$AI(n),i};var St=globalThis,R=class extends E{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Zt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return C}};R._$litElement$=!0,R.finalized=!0,St.litElementHydrateSupport?.({LitElement:R});var Ae=St.litElementPolyfillSupport;Ae?.({LitElement:R});(St.litElementVersions??=[]).push("4.2.2");var te={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},ee=n=>(...t)=>({_$litDirective$:n,values:t}),at=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,s){this._$Ct=t,this._$AM=e,this._$Ci=s}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var J=class extends at{constructor(t){if(super(t),this.it=d,t.type!==te.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===d||t==null)return this._t=void 0,this.it=t;if(t===C)return t;if(typeof t!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.it)return this._t;this.it=t;let e=[t];return e.raw=e,this._t={_$litType$:this.constructor.resultType,strings:e,values:[]}}};J.directiveName="unsafeHTML",J.resultType=1;var f=ee(J);var S=null;try{S=window.localStorage,S.setItem("lx:t","1"),S.removeItem("lx:t")}catch{S=null}var Ee=()=>window.LX||{};function At(n){let{course:t="course",version:e="0.0.0",page:s={},uid:i=""}=Ee(),r=e.split(".").slice(0,2).join(".");return`lx:${t}:${r}:${s.id||location.pathname}:${n}:${i||"anon"}`}function Et(n){if(!S)return null;try{let t=S.getItem(n);return t?JSON.parse(t):null}catch{return null}}function lt(n,t){if(S)try{S.setItem(n,JSON.stringify(t))}catch{}}function se(n){if(S)try{S.removeItem(n)}catch{}}var m=class extends R{constructor(){super(),this.config={},this.state=null,this._failed=null}connectedCallback(){try{let t=this.querySelector('script[type="application/json"]');this.config=t?JSON.parse(t.textContent):{},this._key=At(this.id||this.localName),this.state=this.migrate(Et(this._key))}catch(t){this._fail("LX-R201",t)}super.connectedCallback(),this._setupUnlock(),this.dispatchEvent(new CustomEvent("lx-register",{bubbles:!0,composed:!0,detail:{id:this.id,graded:this.graded,max:this.graded?this.maxScore():0}})),queueMicrotask(()=>this.report())}get graded(){return this.constructor.graded&&this.config.graded!==!1}initialState(){return{}}maxScore(){return 1}result(){return{score:0,complete:!1}}renderWidget(){return l``}migrate(t){let e=this.initialState(),s=this.config._fp,i=this.config.version;if(!s)return{...e,...t||{}};if(!t)return{...e,fp:s,cv:i};let r=t.fp===void 0&&t.cv===void 0;if(t.fp===s&&t.cv===i)return{...e,...t};if(r){let a={...e,...t,fp:s,cv:i};return lt(this._key,a),a}let o={...e,best:t.best||0,carried:(t.attemptsUsed||0)>0||!!t.carried,fp:s,cv:i,notice:t.cv!==i?"version":"changed"};return lt(this._key,o),o}renderNotice(){return this.state?.notice?l`<div class="notice" role="status">
      <strong>This practice was updated${this.config.version>1?` (version ${this.config.version})`:""}.</strong>
      Your unfinished attempt was reset; your best result (${Math.round((this.state.best||0)*100)}%) is kept.
    </div>`:""}setState(t){let{notice:e,...s}=this.state||{};this.state={...s,...t},lt(this._key,this.state),this.report()}resetState(){se(this._key),this.state={...this.initialState(),...this.config._fp?{fp:this.config._fp,cv:this.config.version}:{}},this.report()}report(){if(this._failed)return;let{score:t,complete:e,exhausted:s=!1}=this.result(),i=this.maxScore();this.dispatchEvent(new CustomEvent("lx-progress",{bubbles:!0,composed:!0,detail:{id:this.id,graded:this.graded,score:this.graded?t:0,max:this.graded?i:0,fraction:i?t/i:0,complete:e,exhausted:s}}))}get locked(){return!!this.config.unlock&&!this._unlocked}_setupUnlock(){let t=this.config.unlock;if(!t)return;let e=t.min??.7,s=Et(At(t.after))||{};this._unlocked=(s.best??0)>=e||!!s.exhausted,this._onPeer=i=>{let r=i.detail;r.id!==t.after||this._unlocked||(r.fraction>=e||r.exhausted)&&(this._unlocked=!0,this.requestUpdate())},document.addEventListener("lx-progress",this._onPeer)}disconnectedCallback(){super.disconnectedCallback(),this._onPeer&&document.removeEventListener("lx-progress",this._onPeer)}renderLocked(){let t=this.config.unlock,s=document.getElementById(t.after)?.config?.title||"the previous level";return l`<section class="card locked" aria-label="Locked">
      <div class="lock" aria-hidden="true">🔒</div>
      <div>
        ${this.config.level?l`<span class="lvl lvl-${this.config.level}">Level ${this.config.level}</span>`:""}
        <h3>${f(this.config.title||"Locked")}</h3>
        <p class="muted">Unlocks when you score at least ${Math.round((t.min??.7)*100)}% in “${f(s)}” (or after two tries).</p>
      </div>
    </section>`}_fail(t,e){this._failed=t,console.error(`[${t}] ${this.localName}#${this.id}:`,e)}render(){if(!this._failed)try{return this.locked?this.renderLocked():this.renderWidget()}catch(t){this._fail("LX-R202",t)}return l`<div class="card error" role="alert">
      This activity could not be loaded (${this._failed}). Please reload the page; if it persists, tell your mentor.
    </div>`}static seededOrder(t,e){let s=0;for(let o of e)s=s*31+o.charCodeAt(0)>>>0;let i=()=>(s=s*1664525+1013904223>>>0)/4294967296,r=[...Array(t).keys()];for(let o=t-1;o>0;o--){let a=Math.floor(i()*(o+1));[r[o],r[a]]=[r[a],r[o]]}return r}};x(m,"graded",!1),x(m,"properties",{state:{state:!0}});var _=$`
  :host { display: block; font-family: var(--lx-font-body); color: var(--lx-text); line-height: 1.6; }
  * { box-sizing: border-box; }
  .card {
    background: var(--lx-surface); border: 1px solid var(--lx-border); border-radius: var(--lx-radius-lg);
    padding: 22px 24px; box-shadow: var(--lx-shadow-sm);
  }
  .card.error { background: var(--lx-error-soft); border-color: transparent; color: var(--lx-error-ink); }
  .eyebrow { display: flex; align-items: center; gap: 8px; font-size: 11.5px; font-weight: 800; letter-spacing: .09em; text-transform: uppercase; color: var(--lx-accent-ink); margin-bottom: 6px; }
  .eyebrow .graded { color: var(--lx-danger-ink); }
  h3 { font-family: var(--lx-font-heading); font-weight: 800; font-size: 19px; letter-spacing: -.01em; color: var(--lx-heading); margin: 0 0 14px; line-height: 1.3; }
  p { margin: 0 0 10px; }
  strong, b { color: var(--lx-heading); }
  code { font-family: var(--lx-font-mono); font-size: .86em; background: var(--lx-inline-code-bg); color: var(--lx-inline-code-text); padding: 1px 6px; border-radius: 6px; }
  a { color: var(--lx-link); }
  button {
    font: 800 14.5px var(--lx-font-body); border-radius: 12px; padding: 10px 18px; cursor: pointer;
    border: 1px solid transparent; transition: background .15s, border-color .15s, color .15s, transform .15s;
  }
  button:focus-visible { outline: 3px solid var(--lx-focus); outline-offset: 2px; }
  button:disabled { opacity: .45; cursor: not-allowed; }
  .btn-primary { background: var(--lx-primary); color: var(--lx-on-primary); }
  .btn-primary:hover:not(:disabled) { background: var(--lx-primary-hover); transform: translateY(-1px); }
  .btn-ghost { background: var(--lx-surface); color: var(--lx-heading); border-color: var(--lx-border); }
  .btn-ghost:hover:not(:disabled) { border-color: var(--lx-border-strong); background: var(--lx-surface-3); }
  .actions { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin-top: 16px; }
  .feedback { border-radius: var(--lx-radius); padding: 12px 16px; margin-top: 12px; font-size: 15px; }
  .feedback.ok { background: var(--lx-success-soft); color: var(--lx-success-ink); }
  .feedback.bad { background: var(--lx-error-soft); color: var(--lx-error-ink); }
  .feedback strong { color: inherit; }
  .feedback p:last-child { margin: 0; }
  .muted { color: var(--lx-text-muted); font-size: 14px; }
  .progress { height: 8px; background: var(--lx-surface-3); border-radius: 999px; overflow: hidden; }
  .progress > span { display: block; height: 100%; border-radius: 999px; background: linear-gradient(90deg, var(--lx-accent), var(--lx-sky)); transition: width .3s; }
  .notice { background: var(--lx-warning-soft); color: var(--lx-warning-ink); border-radius: var(--lx-radius); padding: 10px 14px; margin: 10px 0; font-size: 14px; }
  .notice strong { color: inherit; }
  .locked { display: flex; gap: 16px; align-items: center; background: var(--lx-surface-2); border-style: dashed; box-shadow: none; }
  .locked h3 { margin: 8px 0 4px; }
  .lock { width: 48px; height: 48px; flex: none; display: grid; place-items: center; border-radius: 14px; background: var(--lx-surface-3); font-size: 22px; }
  .lvl { display: inline-block; font: 800 11px var(--lx-font-body); letter-spacing: .08em; text-transform: uppercase; padding: 4px 10px; border-radius: 999px; }
  .lvl-1 { background: var(--lx-accent-soft); color: var(--lx-accent-ink); }
  .lvl-2 { background: var(--lx-warning-soft); color: var(--lx-warning-ink); }
  .lvl-3 { background: var(--lx-danger-soft); color: var(--lx-danger-ink); }
  .rating { display: inline-block; font: 800 11px var(--lx-font-body); letter-spacing: .06em; text-transform: uppercase; padding: 3px 9px; border-radius: 999px; }
  .rating.optimal { background: var(--lx-success-soft); color: var(--lx-success-ink); }
  .rating.acceptable { background: var(--lx-accent-soft); color: var(--lx-accent-ink); }
  .rating.risky { background: var(--lx-warning-soft); color: var(--lx-warning-ink); }
  .rating.critical { background: var(--lx-error-soft); color: var(--lx-error-ink); }
  .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
  @media (prefers-reduced-motion: reduce) { * { transition: none !important; animation: none !important; } }
`;var ct=class extends m{get items(){return(this.config.items||[]).map(t=>typeof t=="string"?{text:t}:t)}initialState(){return{done:[]}}result(){return{score:0,complete:this.state.done.filter(Boolean).length===this.items.length}}toggle(t){let e=[...this.state.done];e[t]=!e[t],this.setState({done:e})}renderWidget(){let t=this.state.done.filter(Boolean).length,e=this.items.length;return l`<section class="card" aria-label=${this.config.title||"Checklist"}>
      <div class="eyebrow">Checklist</div>
      ${this.config.title?l`<h3>${f(this.config.title)}</h3>`:d}
      <div class="top">
        <div class="progress" aria-hidden="true"><span style="width:${t/e*100}%"></span></div>
        <span class="muted" role="status">${t} / ${e}</span>
      </div>
      <ul>
        ${this.items.map((s,i)=>l`<li class=${this.state.done[i]?"done":""}>
            <label>
              <input type="checkbox" .checked=${!!this.state.done[i]} @change=${()=>this.toggle(i)} />
              <span><span class="t">${f(s.text)}</span>${s.hint?l`<span class="hint">${f(s.hint)}</span>`:d}</span>
            </label>
          </li>`)}
      </ul>
      ${t===e&&this.config.done?l`<div class="feedback ok" role="status">${f(this.config.done)}</div>`:d}
    </section>`}};x(ct,"styles",[_,$`
      ul { list-style: none; padding: 0; margin: 0 0 12px; }
      li { border-bottom: 1px solid var(--lx-border); }
      li:last-child { border-bottom: 0; }
      label { display: flex; gap: 12px; padding: 10px 2px; cursor: pointer; align-items: flex-start; }
      input { width: 18px; height: 18px; margin-top: 4px; accent-color: var(--lx-success); flex: none; }
      .done .t { color: var(--lx-text-muted); text-decoration: line-through; text-decoration-color: var(--lx-border-strong); }
      .hint { display: block; font-size: 14px; color: var(--lx-text-muted); text-decoration: none; }
      .top { display: flex; gap: 12px; align-items: center; margin-bottom: 6px; }
      .top .progress { flex: 1; }
    `]);customElements.define("lx-checklist",ct);var dt=class extends m{get cards(){return this.config.cards||[]}initialState(){return{index:0,flipped:!1,known:[]}}result(){return{score:0,complete:this.state.known.filter(Boolean).length===this.cards.length}}go(t){let e=this.cards.length;this.setState({index:(this.state.index+t+e)%e,flipped:!1})}markKnown(){let t=[...this.state.known];t[this.state.index]=!0,this.setState({known:t}),this.go(1)}renderWidget(){let{index:t,flipped:e}=this.state,s=this.cards[t]||{front:"",back:""},i=this.state.known.filter(Boolean).length;return l`<section class="card" aria-label=${this.config.title||"Flashcards"}>
      <div class="eyebrow">Flashcards</div>
      ${this.config.title?l`<h3>${f(this.config.title)}</h3>`:d}
      <div class="stage">
        <button class="flip ${e?"back":""}" aria-label="Flip card" aria-pressed=${e}
          @click=${()=>this.setState({flipped:!e})}>
          <div class="face front" aria-hidden=${e}><span class="tag">Card ${t+1}</span><div>${f(s.front)}</div></div>
          <div class="face backface" aria-hidden=${!e}><span class="tag">Answer</span><div>${f(s.back)}</div></div>
        </button>
      </div>
      <div class="nav">
        <span class="muted count">${t+1} / ${this.cards.length} · <span class="known">${i} known</span></span>
        <button class="btn-ghost" @click=${()=>this.go(-1)} aria-label="Previous card">←</button>
        <button class="btn-ghost" @click=${()=>this.markKnown()}>I knew it</button>
        <button class="btn-primary" @click=${()=>this.go(1)}>Next →</button>
      </div>
    </section>`}};x(dt,"styles",[_,$`
      .stage { perspective: 1200px; margin: 6px 0 12px; }
      .flip {
        position: relative; width: 100%; min-height: 190px; border: 0; padding: 0; background: none; border-radius: var(--lx-radius-lg);
        transform-style: preserve-3d; transition: transform .45s; cursor: pointer; font: inherit; color: inherit; text-align: center;
      }
      .flip.back { transform: rotateY(180deg); }
      .face {
        position: absolute; inset: 0; display: grid; place-items: center; padding: 22px 28px; border-radius: var(--lx-radius-lg);
        backface-visibility: hidden; -webkit-backface-visibility: hidden;
      }
      .front { background: linear-gradient(135deg, #12a6ef, #0b62b8 70%, #2a3f7a); color: #fff; font-family: var(--lx-font-heading); font-size: 24px; font-weight: 800; letter-spacing: -.01em; }
      .front code { background: rgba(255,255,255,.18); color: #fff; font-size: .9em; }
      .backface { background: var(--lx-surface-2); border: 1px solid var(--lx-border); color: var(--lx-text); transform: rotateY(180deg); font-size: 16px; text-align: left; }
      .tag { position: absolute; top: 10px; left: 14px; font: 800 11px var(--lx-font-body); letter-spacing: .1em; text-transform: uppercase; opacity: .7; }
      .nav { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
      .count { margin-right: auto; }
      .known { color: var(--lx-success); font-weight: 700; }
      @media (prefers-reduced-motion: reduce) { .flip { transition: none; } }
    `]);customElements.define("lx-flashcards",dt);var G=class extends m{get items(){return this.config.items||[]}maxScore(){return 1}initialState(){let t=this.items.length,e=m.seededOrder(t,this.id||"order");return e.every((s,i)=>s===i)&&t>1&&(e=[...e.slice(1),e[0]]),{order:e,checked:!1,best:0,attempts:0}}fraction(){let t=this.state.order.filter((e,s)=>e===s).length;return Math.round(t/this.items.length*100)/100}result(){return{score:this.state.best,complete:this.state.attempts>0}}move(t,e){if(this.state.checked||e<0||e>=this.items.length||t===e)return;let s=[...this.state.order],[i]=s.splice(t,1);s.splice(e,0,i),this.setState({order:s}),this.updateComplete.then(()=>{let r=this.renderRoot.querySelectorAll("li")[e]?.querySelector(`button[data-dir="${e>t?"down":"up"}"]`);(r&&!r.disabled?r:this.renderRoot.querySelectorAll("li")[e])?.focus()})}check(){let t=this.fraction();this.setState({checked:!0,attempts:this.state.attempts+1,best:Math.max(this.state.best,t)})}onPointerDown(t,e){if(this.state.checked||t.target.closest("button"))return;let i=[...this.renderRoot.querySelector("ol").children];this._drag={from:e,over:e},i[e].classList.add("dragging"),i[e].setPointerCapture(t.pointerId)}onPointerMove(t){if(!this._drag)return;let e=[...this.renderRoot.querySelectorAll("li")],s=e.findIndex(i=>{let r=i.getBoundingClientRect();return t.clientY>=r.top&&t.clientY<=r.bottom});s>=0&&s!==this._drag.over&&(e.forEach(i=>i.classList.remove("over")),e[s].classList.add("over"),this._drag.over=s)}onPointerUp(){if(!this._drag)return;let{from:t,over:e}=this._drag;this._drag=null,this.renderRoot.querySelectorAll("li").forEach(s=>s.classList.remove("over","dragging")),this.move(t,e)}renderWidget(){let{order:t,checked:e}=this.state,s=this.items.length,i=e&&t.every((r,o)=>r===o);return l`<section class="card" aria-label=${this.config.title||"Put in order"}>
      <div class="eyebrow">Put in order ${this.graded?l`<span class="graded">· graded</span>`:d}</div>
      ${this.config.title?l`<h3>${f(this.config.title)}</h3>`:d}
      ${this.config.prompt?l`<p>${f(this.config.prompt)}</p>`:d}
      <p class="muted">Drag the cards, or use the arrow buttons.</p>
      <ol @pointermove=${this.onPointerMove} @pointerup=${this.onPointerUp} @pointercancel=${this.onPointerUp}>
        ${t.map((r,o)=>l`<li class=${e?r===o?"correct locked":"wrong locked":""} tabindex="-1" @pointerdown=${c=>this.onPointerDown(c,o)}>
            <span class="grip" aria-hidden="true">⋮⋮</span>
            <span class="text">${f(this.items[r])}</span>
            ${e?l`<span class="sr-only">${r===o?"correct position":"wrong position"}</span>`:l`<span class="move">
                  <button data-dir="up" aria-label="Move up" ?disabled=${o===0} @click=${()=>this.move(o,o-1)}>↑</button>
                  <button data-dir="down" aria-label="Move down" ?disabled=${o===s-1} @click=${()=>this.move(o,o+1)}>↓</button>
                </span>`}
          </li>`)}
      </ol>
      ${e?l`<div class="feedback ${i?"ok":"bad"}" role="status">
              ${i?l`<strong>Exactly right.</strong> ${this.config.explain?f(this.config.explain):d}`:l`<strong>${Math.round(this.fraction()*s)} of ${s} in the right place.</strong> Rearrange the red ones and check again.`}
            </div>
            <div class="actions">
              ${i?l`<button class="btn-ghost" @click=${()=>this.resetState()}>Start over</button>`:l`<button class="btn-primary" @click=${()=>this.setState({checked:!1})}>Try again</button>`}
            </div>`:l`<div class="actions"><button class="btn-primary" @click=${this.check}>Check order</button></div>`}
    </section>`}};x(G,"graded",!0),x(G,"styles",[_,$`
      ol { list-style: none; margin: 0; padding: 0; counter-reset: step; }
      li {
        counter-increment: step; display: flex; align-items: center; gap: 10px; padding: 10px 12px; margin: 8px 0;
        background: var(--lx-surface-2); border: 1px solid var(--lx-border); border-radius: var(--lx-radius);
        cursor: grab; touch-action: none; user-select: none; transition: border-color .15s, background .15s, transform .15s;
      }
      li::before { content: counter(step); font: 600 13px var(--lx-font-mono); color: var(--lx-accent-ink); background: var(--lx-accent-soft); border-radius: 8px; width: 24px; height: 24px; display: grid; place-items: center; flex: none; }
      li.dragging { opacity: .6; transform: scale(.99); border-style: dashed; }
      li.over { border-color: var(--lx-accent); }
      li.correct { border-color: var(--lx-success); background: var(--lx-success-soft); }
      li.correct::before { background: var(--lx-success); }
      li.wrong { border-color: var(--lx-error); background: var(--lx-error-soft); }
      li.wrong::before { background: var(--lx-error); }
      li.locked { cursor: default; }
      .text { flex: 1; }
      .move { display: flex; gap: 4px; }
      .move button { padding: 3px 10px; font-size: 14px; background: var(--lx-surface); border-color: var(--lx-border); color: var(--lx-heading); border-radius: 8px; }
      .move button:hover:not(:disabled) { border-color: var(--lx-accent); }
      .grip { color: var(--lx-text-muted); font-size: 18px; line-height: 1; }
    `]);customElements.define("lx-order",G);var Q=class extends m{get questions(){return this.config.questions||[]}initialState(){return{picks:{},checked:{},cur:0,view:"question"}}get paged(){return this.config.paged??!!this.closest("[data-slides]")}maxScore(){return this.questions.length}isRight(t){let e=this.questions[t],s=[].concat(e.answer).sort().join(","),i=[...this.state.picks[t]||[]].sort().join(",");return s===i}result(){let t=Object.keys(this.state.checked).filter(s=>this.state.checked[s]);return{score:t.filter(s=>this.isRight(s)).length,complete:t.length===this.questions.length}}optionOrder(t){let e=this.questions[t].options.length;return this.config.shuffle?m.seededOrder(e,`${this.id}-${t}`):[...Array(e).keys()]}pick(t,e,s){if(this.state.checked[t])return;let i=new Set(this.state.picks[t]||[]);s?i.has(e)?i.delete(e):i.add(e):(i.clear(),i.add(e)),this.setState({picks:{...this.state.picks,[t]:[...i]}})}check(t){this.setState({checked:{...this.state.checked,[t]:!0}})}renderQuestion(t,e){let s=Array.isArray(t.answer),i=[].concat(t.answer),r=this.state.picks[e]||[],o=!!this.state.checked[e],a=o&&this.isRight(e),c=`${this.id}-q${e}`;return l`<div class="q">
      <div class="q-text" id="${c}-label"><span class="q-num">${e+1}.</span>${f(t.q)}</div>
      ${s?l`<div class="hint">Select all that apply.</div>`:d}
      <fieldset aria-labelledby="${c}-label">
        ${this.optionOrder(e).map(h=>{let u=r.includes(h),p=i.includes(h),v=["opt",u?"selected":"",o&&p?"correct":"",o&&u&&!p?"wrong":"",o?"locked":""].join(" ");return l`<label class=${v}>
            <input type=${s?"checkbox":"radio"} name=${c} .checked=${u} ?disabled=${o}
              @change=${()=>this.pick(e,h,s)} />
            <span>${f(t.options[h])}</span>
            ${o&&p?l`<span class="mark" aria-label="correct answer">✓</span>`:d}
            ${o&&u&&!p?l`<span class="mark" aria-label="incorrect">✗</span>`:d}
          </label>`})}
      </fieldset>
      ${o?l`<div class="feedback ${a?"ok":"bad"}" role="status">
              <strong>${a?"Correct.":"Not quite."}</strong> ${t.explain?f(t.explain):d}
            </div>
            ${this.paged?this.renderPagedNext(e):d}`:l`<div class="actions">
            <button class="btn-primary" ?disabled=${!r.length} @click=${()=>this.check(e)}>Check answer</button>
          </div>`}
    </div>`}renderPagedNext(t){let e=this.questions.length,s=[...Array(e).keys()].find(i=>i>t&&!this.state.checked[i])??[...Array(e).keys()].find(i=>!this.state.checked[i]);return l`<div class="actions">
      ${s!==void 0?l`<button class="btn-primary" @click=${()=>this.setState({cur:s})}>Next question →</button>`:l`<button class="btn-primary" @click=${()=>this.setState({view:"result"})}>See your result</button>`}
    </div>`}renderPaged(){let{score:t,complete:e}=this.result(),s=this.questions.length,i=Math.min(this.state.cur||0,s-1);return e&&this.state.view==="result"?l`<div class="result" role="status">
          <b>${t} / ${s}</b><span class="muted">correct answers</span>
        </div>
        <ul class="review">
          ${this.questions.map((r,o)=>l`<li>
            <span class="rating ${this.isRight(o)?"optimal":"critical"}">${this.isRight(o)?"\u2713":"\u2717"}</span>
            <button @click=${()=>this.setState({cur:o,view:"question"})}>${f(r.q)}</button>
          </li>`)}
        </ul>
        <div class="actions" style="justify-content:center">
          <button class="btn-ghost" @click=${()=>this.resetState()}>Try again</button>
        </div>`:l`<div class="dots" role="tablist" aria-label="Questions">
        ${this.questions.map((r,o)=>{let a=this.state.checked[o]?this.isRight(o)?"right":"wrong":"";return l`<button class="dot ${a} ${o===i?"current":""}" role="tab" aria-selected=${o===i}
            aria-label="Question ${o+1}${a?a==="right"?", correct":", incorrect":""}" @click=${()=>this.setState({cur:o,view:"question"})}>${o+1}</button>`})}
      </div>
      <div class="paged">${this.renderQuestion(this.questions[i],i)}</div>
      ${e?l`<div class="actions"><button class="btn-ghost" @click=${()=>this.setState({view:"result"})}>Back to result</button></div>`:d}`}renderWidget(){if(this.paged)return l`<section class="card" aria-label=${this.config.title||"Quiz"}>
        <div class="eyebrow">Check yourself ${this.graded?l`<span class="graded">· graded</span>`:d}</div>
        ${this.config.title?l`<h3>${f(this.config.title)}</h3>`:d}
        ${this.renderPaged()}
      </section>`;let{score:t,complete:e}=this.result(),s=this.questions.length,i=Object.values(this.state.checked).filter(Boolean).length;return l`<section class="card" aria-label=${this.config.title||"Quiz"}>
      <div class="eyebrow">Check yourself ${this.graded?l`<span class="graded">· graded</span>`:d}</div>
      ${this.config.title?l`<h3>${f(this.config.title)}</h3>`:d}
      ${this.questions.map((r,o)=>this.renderQuestion(r,o))}
      <div class="summary">
        <div class="progress" aria-hidden="true"><span style="width:${i/s*100}%"></span></div>
        <span class="muted" role="status">${e?`${t} of ${s} correct`:`${i} of ${s} answered`}</span>
        ${e?l`<button class="btn-ghost" @click=${()=>this.resetState()}>Try again</button>`:d}
      </div>
    </section>`}};x(Q,"graded",!0),x(Q,"styles",[_,$`
      .q { padding: 16px 0; border-top: 1px solid var(--lx-border); }
      .q:first-of-type { border-top: 0; padding-top: 4px; }
      .q-text { font-weight: 700; margin-bottom: 4px; }
      .q-num { color: var(--lx-red); font-family: var(--lx-font-mono); margin-right: 6px; }
      .hint { font-size: 13px; color: var(--lx-text-muted); margin-bottom: 8px; }
      fieldset { border: 0; padding: 0; margin: 0; }
      label.opt {
        display: flex; gap: 10px; align-items: flex-start; padding: 9px 12px; margin: 6px 0;
        border: 1px solid var(--lx-border); border-radius: var(--lx-radius); cursor: pointer; transition: border-color .15s, background .15s;
      }
      label.opt:hover { border-color: var(--lx-accent); }
      label.opt.selected { border-color: var(--lx-accent); background: var(--lx-accent-soft); }
      label.opt.correct { border-color: var(--lx-success); background: var(--lx-success-soft); }
      label.opt.wrong { border-color: var(--lx-error); background: var(--lx-error-soft); }
      label.opt.locked { cursor: default; }
      input { margin-top: 5px; accent-color: var(--lx-accent-ink); }
      .mark { margin-left: auto; font-weight: 800; }
      .correct .mark { color: var(--lx-success); }
      .wrong .mark { color: var(--lx-error); }
      .summary { display: flex; align-items: center; gap: 14px; margin-top: 8px; padding-top: 14px; border-top: 1px solid var(--lx-border); }
      .summary .progress { flex: 1; }
      /* paged mode (inside slides): one question at a time */
      .dots { display: flex; gap: 6px; flex-wrap: wrap; margin: 2px 0 6px; }
      .dot { width: 32px; height: 32px; padding: 0; border-radius: 10px; font: 800 13px var(--lx-font-body); background: var(--lx-surface-3); color: var(--lx-text-muted); border: 1px solid transparent; }
      .dot.current { border-color: var(--lx-accent); color: var(--lx-heading); background: var(--lx-surface); }
      .dot.right { background: var(--lx-success-soft); color: var(--lx-success-ink); }
      .dot.wrong { background: var(--lx-error-soft); color: var(--lx-error-ink); }
      .paged .q { border-top: 0; padding-top: 10px; }
      .result { text-align: center; padding: 10px 0 4px; }
      .result b { display: block; font: 800 44px var(--lx-font-heading); color: var(--lx-heading); letter-spacing: -.02em; }
      .review { list-style: none; padding: 0; margin: 14px 0 0; text-align: left; }
      .review li { display: flex; gap: 10px; align-items: baseline; padding: 8px 0; border-top: 1px solid var(--lx-border); }
      .review button { background: none; border: 0; padding: 0; font: 600 15px var(--lx-font-body); color: var(--lx-link); text-align: left; cursor: pointer; }
    `]);customElements.define("lx-quiz",Q);var Ce={optimal:1,acceptable:.5,risky:0,critical:0},Te={optimal:"acceptable",acceptable:"risky",risky:"risky",critical:"critical"},Ct={1:{attempts:0,feedback:"step",autoplay:!1},2:{attempts:0,feedback:"end",autoplay:!1},3:{attempts:0,feedback:"end",autoplay:!0}},Me=2,Re={onTime:"optimal",late:"acceptable",early:"risky"},Le={onTime:"You stopped the agent right when it went wrong.",late:"You stopped it, but only after it had already continued for a while.",early:"You stopped the agent before anything was wrong. It lost its context for no reason.",missed:"You let the agent run to the end without stopping it."},Tt=.3,D=n=>Math.round(n*100)/100,N=(n="")=>new DOMParser().parseFromString(String(n),"text/html").body.textContent||"",Z=class extends m{get level(){return this.config.level||1}get opts(){let t=Ct[this.level];return{attempts:this.config.attempts??t.attempts,feedback:this.config.feedback??t.feedback}}get steps(){return this.config.steps||{}}maxScore(){return this.config.points??this.level}initialState(){return{attemptsUsed:0,best:0,exhausted:!1,run:null,last:null}}result(){let t=this.state;return{score:D(t.best*this.maxScore()),complete:t.attemptsUsed>0||!!t.carried,exhausted:t.exhausted}}computeVars(t){let e={},s=window.LX&&window.LX.uid||"anon";for(let[i,r]of Object.entries(this.config.vars||{}))e[i]=r[m.seededOrder(r.length,`${this.id}:${s}:${t}:${i}`)[0]];return e}t(t){return typeof t!="string"?t:t.replace(/\{\{(\w+)\}\}/g,(e,s)=>(this._vars&&this._vars[s])??e)}rich(t){return f(this.t(t||""))}choiceOrder(t,e){let s=this.steps[t].choices.length,i=window.LX&&window.LX.uid||"anon";return m.seededOrder(s,`${this.id}:${i}:${e}:${t}`)}get limitReached(){let t=this.opts.attempts;return t>0&&this.state.attemptsUsed>=t}start(){this.setState({run:{practice:this.limitReached,attempt:this.state.attemptsUsed+(this.state.practiceRuns||0),step:this.config.start,path:[],evidence:[],flags:[],visited:[this.config.start],pending:null,shown:1,stopped:null}})}patchRun(t){this.setState({run:{...this.state.run,...t}})}budgetUsed(t=this.state.run){let e=this.allEvidence();return t.evidence.reduce((s,i)=>s+(e[i]?.cost??1),0)}allEvidence(){let t={};for(let e of Object.values(this.steps))for(let s of e.evidence||[])t[s.id]={cost:1,...s};return t}gather(t){let e=this.state.run;e.evidence.includes(t.id)||e.pending||this.config.budget-this.budgetUsed()<(t.cost??1)||this.patchRun({evidence:[...e.evidence,t.id]})}choose(t){let e=this.state.run,s=this.steps[e.step].choices[t],i=s.rating,r=!1;(s.needs||[]).some(u=>!e.evidence.includes(u))&&(i=Te[i],r=i!==s.rating);let o={step:e.step,choice:t,rating:i,downgraded:r},a=[...new Set([...e.flags,...s.sets||[]])],c={rating:i,downgraded:r,explain:s.explain,consequence:s.consequence,go:s.end?null:s.next},h=this.opts.feedback==="step"||s.consequence;this.patchRun({path:[...e.path,o],flags:a,pending:c}),h||this.advance()}nextLine(){let t=this.state.run,e=this.steps[t.step].stream.lines;t.pending||(t.shown>=e.length?this.evaluateStream(null):this.patchRun({shown:t.shown+1}))}stopAgent(){let t=this.state.run;t.pending||this.evaluateStream(t.shown-1)}evaluateStream(t){let e=this.state.run,s=this.steps[e.step].stream,i=s.lines.findIndex(c=>c.red),r;t===null?r="missed":t<i?r="early":t<=i+1?r="onTime":t<=i+3?r="late":r="missed";let o=r==="missed"?s.missRating||"critical":Re[r],a=s.outcomes&&s.outcomes[r]||Le[r];this.patchRun({stopped:t,path:[...e.path,{step:e.step,stream:r,at:t,rating:o}],pending:{rating:o,consequence:a,go:s.end?null:s.next,stream:!0}})}advance(){let t=this.state.run,e=t.pending?.go;if(!e)return this.finish();let s=typeof e=="string"?e:t.flags.includes(e.if)?e.then:e.else;this.patchRun({step:s,pending:null,shown:1,stopped:null,visited:[...t.visited,s]})}finish(){let t=this.state.run,e=this.allEvidence(),s=t.path.map(g=>Ce[g.rating]),i=s.length?s.reduce((g,b)=>g+b,0)/s.length:0,r=t.visited.flatMap(g=>(this.steps[g].evidence||[]).map(b=>b.id)),o=r.filter(g=>e[g].key),a=o.length?o.filter(g=>t.evidence.includes(g)).length/o.length:1,c=t.evidence.filter(g=>!e[g].key).reduce((g,b)=>g+(e[b].cost??1),0),h=this.config.budget?Math.max(0,1-c/this.config.budget):1,u=r.length>0,p=u?.6*i+.25*a+.15*h:i,v=t.path.some(g=>g.rating==="critical");v&&(p=Math.min(p,Tt)),p=D(p);let y={...t,final:p,dims:{decisions:D(i),process:D(a),efficiency:D(h),investigative:u,critical:v}};if(t.practice)this.setState({run:null,last:y,practiceRuns:(this.state.practiceRuns||0)+1});else{let g=this.state.attemptsUsed+1,b=this.opts.attempts;this.setState({attemptsUsed:g,best:Math.max(this.state.best,p),exhausted:b>0&&g>=b||g>=Me,run:null,last:y})}this.updateComplete.then(()=>this.renderRoot.querySelector(".score")?.scrollIntoView({block:"nearest",behavior:"smooth"}))}updated(){clearTimeout(this._timer);let t=this.state?.run;if(!t||t.pending)return;let e=this.steps[t.step];if(!e?.stream)return;(e.stream.autoplay??Ct[this.level].autoplay)&&(this._timer=setTimeout(()=>this.nextLine(),e.stream.speed||1800))}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this._timer)}renderHead(){return l`<div class="head">
      <span class="lvl lvl-${this.level}">Level ${this.level}</span>
      <span class="eyebrow" style="margin:0">Decision scenario ${this.graded?l`<span class="graded">· ${this.maxScore()} pt</span>`:d}</span>
    </div>
    <h3>${f(this.config.title||"")}</h3>`}renderIntro(){let{attempts:t,feedback:e}=this.opts,s=this.state.attemptsUsed;return l`${this.config.intro?l`<p>${this.rich(this.config.intro)}</p>`:d}
      <ul class="rules">
        <li>${e==="step"?"You get feedback after every decision.":"Feedback only at the end \u2014 like in real life."}</li>
        <li>${t===0?"Retake it as often as you like; your best result counts, and each try gets a new variant.":`${t} graded attempt${t>1?"s":""}${s?` (${s} used)`:""}; after that you can still practise without changing your grade.`}</li>
        ${this.config.budget?l`<li>You can investigate before deciding — but only <strong>${this.config.budget}</strong> actions in total. Choose what is worth checking.</li>`:d}
        <li>Critical mistakes cap the result at ${Tt*100}%.</li>
      </ul>
      <div class="actions"><button class="btn-primary" @click=${this.start}>Start scenario</button></div>`}renderEvidence(t,e){if(!t.evidence?.length)return d;let s=this.config.budget-this.budgetUsed(e),i=this.allEvidence(),r=e.evidence.filter(o=>t.evidence.some(a=>a.id===o)||i[o]);return l`<div class="evidence">
      <div class="evidence-head">
        <strong>Investigate first?</strong>
        <span class="budget" aria-label="${s} actions left">
          ${Array.from({length:this.config.budget},(o,a)=>l`<span class="dot ${a<this.config.budget-s?"used":""}"></span>`)}
          <span>${s} left</span>
        </span>
      </div>
      <div class="actions-ev">
        ${t.evidence.map(o=>l`<button class="ev-btn" ?disabled=${e.evidence.includes(o.id)||s<(o.cost??1)||!!e.pending}
            @click=${()=>this.gather(o)}>${e.evidence.includes(o.id)?"\u2713 ":"\u25B8 "}${this.rich(o.label)}${(o.cost??1)>1?` (${o.cost})`:""}</button>`)}
      </div>
      ${r.filter(o=>t.evidence.some(a=>a.id===o)).map(o=>{let a=t.evidence.find(c=>c.id===o);return l`<div class="ev-label">$ ${N(this.t(a.label))}</div><pre>${this.t(a.output)}</pre>`})}
    </div>`}renderPending(t){let e=this.opts.feedback==="step",s=e?t.rating:"neutral";return l`<div class="pending ${s}" role="status">
        ${e?l`<p><span class="rating ${t.rating}">${t.rating}</span>${t.downgraded?l` <span class="muted">— right idea, but you acted without checking the evidence first</span>`:d}</p>`:d}
        ${t.consequence?l`<p>${this.rich(t.consequence)}</p>`:d}
        ${e&&t.explain?l`<p class="muted">${this.rich(t.explain)}</p>`:d}
      </div>
      <div class="actions"><button class="btn-primary" @click=${this.advance}>${t.go?"Continue \u2192":"See results"}</button></div>`}renderStep(){let t=this.state.run,e=this.steps[t.step],s=Object.entries(e.extra||{}).filter(([i])=>t.flags.includes(i));return l`<div class="stepno">Step ${t.path.length+1}${e.title?` \xB7 ${N(this.t(e.title))}`:""}</div>
      <div class="situation">
        <p>${this.rich(e.situation)}</p>
        ${s.map(([,i])=>l`<div class="extra">${this.rich(i)}</div>`)}
      </div>
      ${e.ending?l`<div class="actions"><button class="btn-primary" @click=${this.finish}>See results</button></div>`:e.stream?this.renderStream(e,t):l`${this.renderEvidence(e,t)}
              ${t.pending?this.renderPending(t.pending):l`<div class="choices" role="group" aria-label="Your decision">
                    ${this.choiceOrder(t.step,t.attempt).map(i=>l`<button class="choice" @click=${()=>this.choose(i)}>${this.rich(e.choices[i].text)}</button>`)}
                  </div>`}`}`}renderStream(t,e){let s=t.stream,i=s.lines.slice(0,e.stopped!==null?e.stopped+1:e.shown),r=s.autoplay??Ct[this.level].autoplay;return l`<p class="muted">Watch the agent work. Stop it the moment something goes wrong — not earlier, not later.</p>
      <div class="stream" aria-live="polite">
        ${i.map((o,a)=>l`<div class="ln ${e.pending&&o.red&&a<=(e.stopped??99)?"redmark":""}">${this.rich(o.text)}</div>`)}
      </div>
      ${e.pending?this.renderPending(e.pending):l`<div class="actions">
            <button class="stop" @click=${this.stopAgent}>✋ Stop the agent</button>
            ${r?l`<span class="muted">The agent keeps going…</span>`:l`<button class="btn-ghost" @click=${this.nextLine}>${e.shown>=s.lines.length?"Let it finish":"Next step \u25B8"}</button>`}
          </div>`}`}renderDebrief(){let t=this.state.last,e=t.dims,s=this.allEvidence(),{attempts:i}=this.opts,r=a=>`${Math.round(a*100)}%`,o=t.visited.flatMap(a=>(this.steps[a].evidence||[]).map(c=>c.id));return l`${t.practice?l`<div class="notice">Practice run: this result doesn't change your grade.</div>`:d}
      <div class="score" role="status"><b>${r(t.final)}</b>
        <span class="muted">${t.practice?"practice run":"this attempt"} · best ${r(this.state.best)}${this.graded?` \xB7 ${D(this.state.best*this.maxScore())} / ${this.maxScore()} pt`:""}</span></div>
      ${e.critical?l`<div class="cap">A critical decision capped this attempt at ${Tt*100}%.</div>`:d}
      <div class="dims">
        <div class="dim"><strong>${r(e.decisions)}</strong>Decision quality</div>
        ${e.investigative?l`<div class="dim"><strong>${r(e.process)}</strong>Key evidence checked</div>
              <div class="dim"><strong>${r(e.efficiency)}</strong>Efficiency (no wasted actions)</div>`:d}
      </div>
      <h4>Your path vs. the expert</h4>
      <ol class="path">
        ${t.path.map(a=>{let c=this.steps[a.step];if(a.stream){let p=c.stream.lines.findIndex(v=>v.red);return l`<li>
              <div class="title">${c.title?this.rich(c.title):"Watching the agent"}</div>
              <div class="row"><span class="rating ${a.rating}">${a.rating}</span>
                ${a.at===null||a.stream==="missed"?" You did not stop the agent in time.":` You stopped at line ${a.at+1}.`}</div>
              <div class="expert">Expert: stop at line ${p+1} — “${N(this.t(c.stream.lines[p].text))}”</div>
            </li>`}let h=c.choices[a.choice],u=c.choices.find(p=>p.rating==="optimal");return l`<li>
            <div class="title">${c.title?this.rich(c.title):N(this.t(c.situation)).slice(0,90)+"\u2026"}</div>
            <div class="row"><span class="rating ${a.rating}">${a.rating}</span> ${this.rich(h.text)}
              ${a.downgraded?l`<span class="muted"> (downgraded: you didn't check ${h.needs.map(p=>N(this.t(s[p].label))).join(", ")} first)</span>`:d}</div>
            ${h.explain?l`<div class="why">${this.rich(h.explain)}</div>`:d}
            ${u&&u!==h?l`<div class="expert">Expert: ${this.rich(u.text)}${u.explain?l` — ${this.rich(u.explain)}`:d}</div>`:d}
          </li>`})}
      </ol>
      ${o.length?l`<h4>Investigation</h4>
          <ul class="evlist">
            ${o.map(a=>{let c=s[a],h=t.evidence.includes(a),u=c.key?h?"\u2713 key evidence checked":"\u2717 key evidence missed":h?"\xB7 checked (not essential)":"\xB7 skipped (fine)";return l`<li><code>${N(this.t(c.label))}</code> — ${u}</li>`})}
          </ul>`:d}
      <div class="actions">
        ${this.limitReached?l`<button class="btn-ghost" @click=${this.start}>Practise again (doesn't change your grade)</button>`:l`<button class="btn-primary" @click=${this.start}>Try again${i?` (${i-this.state.attemptsUsed} graded left)`:""}</button>`}
      </div>`}renderWidget(){let t=this.state,e=t.run?t.run.attempt:t.last?t.last.attempt:t.attemptsUsed;return this._vars=this.computeVars(e),l`<section class="card" aria-label=${N(this.config.title||"Scenario")}>
      ${this.renderHead()}
      ${this.renderNotice()}
      ${t.run?this.renderStep():t.last?this.renderDebrief():this.renderIntro()}
    </section>`}};x(Z,"graded",!0),x(Z,"styles",[_,$`
      .head { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 4px; }
      .rules { margin: 10px 0 0; padding-left: 20px; font-size: 15px; }
      .rules li { margin: 3px 0; }
      .situation { background: var(--lx-surface-2); border-radius: var(--lx-radius); padding: 14px 16px; margin: 12px 0; }
      .situation p:last-child { margin-bottom: 0; }
      .extra { border-left: 3px solid var(--lx-warn); padding-left: 12px; margin-top: 10px; color: var(--lx-warning-ink); }
      .stepno { font: 600 12px var(--lx-font-mono); color: var(--lx-text-muted); }
      .choices { display: grid; gap: 8px; margin-top: 12px; }
      .choice {
        text-align: left; font: 600 15px/1.45 var(--lx-font-body); background: var(--lx-surface); color: var(--lx-heading);
        border: 1px solid var(--lx-border); border-radius: var(--lx-radius); padding: 12px 14px;
      }
      .choice:hover:not(:disabled) { border-color: var(--lx-accent); background: var(--lx-hover); }
      .evidence { border: 1px dashed var(--lx-border-strong); border-radius: var(--lx-radius); padding: 12px 14px; margin: 12px 0; }
      .evidence-head { display: flex; align-items: center; gap: 10px; justify-content: space-between; margin-bottom: 8px; flex-wrap: wrap; }
      .evidence-head strong { font-size: 14px; color: var(--lx-accent-ink); }
      .budget { display: flex; gap: 4px; align-items: center; font-size: 13px; color: var(--lx-text-muted); }
      .dot { width: 10px; height: 10px; border-radius: 50%; background: var(--lx-accent); }
      .dot.used { background: var(--lx-border-strong); }
      .actions-ev { display: flex; flex-wrap: wrap; gap: 6px; }
      .ev-btn { font: 600 13px var(--lx-font-mono); padding: 6px 10px; border-radius: 6px; background: var(--lx-surface); color: var(--lx-heading); border: 1px solid var(--lx-border); }
      .ev-btn:hover:not(:disabled) { border-color: var(--lx-accent); }
      pre { background: var(--lx-code-bg); color: var(--lx-code-text); border-radius: 8px; padding: 10px 12px; font: 13px/1.55 var(--lx-font-mono); white-space: pre-wrap; margin: 8px 0 0; }
      .ev-label { font: 600 12px var(--lx-font-mono); color: var(--lx-text-muted); margin-top: 10px; }
      .stream { background: var(--lx-code-bg); border-radius: var(--lx-radius); padding: 12px 14px; margin: 12px 0; font: 13.5px/1.6 var(--lx-font-mono); color: var(--lx-code-text); min-height: 120px; }
      .stream .ln { padding: 2px 0; animation: fadein .3s; }
      .stream .ln::before { content: "› "; color: var(--lx-sky); }
      .stream .ln.redmark { color: #ffb4c2; }
      .stream code { background: rgba(255,255,255,.1); color: var(--lx-sky); }
      @keyframes fadein { from { opacity: 0; transform: translateY(3px); } }
      .stop { background: var(--lx-danger); color: #fff; }
      .stop:hover { background: var(--lx-danger-ink); }
      .pending { border-radius: var(--lx-radius); padding: 14px 16px; margin-top: 12px; border: 1px solid var(--lx-border); }
      .pending.optimal { background: var(--lx-success-soft); border-color: transparent; }
      .pending.acceptable { background: var(--lx-accent-soft); border-color: transparent; }
      .pending.risky { background: var(--lx-warning-soft); border-color: transparent; }
      .pending.critical { background: var(--lx-error-soft); border-color: transparent; }
      .pending.neutral { background: var(--lx-surface-2); }
      .pending p:last-child { margin-bottom: 0; }
      .score { display: flex; align-items: baseline; gap: 10px; margin: 6px 0 14px; }
      .score b { font: 700 40px var(--lx-font-heading); color: var(--lx-heading); }
      .dims { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; margin-bottom: 16px; }
      .dim { background: var(--lx-surface-2); border-radius: var(--lx-radius); padding: 10px 12px; font-size: 13px; }
      .dim strong { display: block; font-size: 18px; color: var(--lx-heading); }
      .cap { background: var(--lx-error-soft); color: var(--lx-error-ink); border-radius: var(--lx-radius); padding: 10px 14px; margin-bottom: 14px; font-size: 14px; }
      .path { list-style: none; padding: 0; margin: 0; counter-reset: p; }
      .path > li { counter-increment: p; border-top: 1px solid var(--lx-border); padding: 12px 0 12px 34px; position: relative; }
      .path > li::before { content: counter(p); position: absolute; left: 0; top: 13px; width: 24px; height: 24px; border-radius: 50%; background: var(--lx-accent-soft); color: var(--lx-accent-ink); font: 600 12px var(--lx-font-mono); display: grid; place-items: center; }
      .path .title { font-weight: 700; }
      .path .row { margin-top: 4px; font-size: 15px; }
      .path .expert { margin-top: 6px; font-size: 14px; color: var(--lx-success-ink); }
      .path .why { font-size: 14px; color: var(--lx-text-muted); margin-top: 2px; }
      .evlist { list-style: none; padding: 0; margin: 6px 0 0; font-size: 14px; }
      h4 { margin: 18px 0 6px; font: 800 13px var(--lx-font-body); letter-spacing: .06em; text-transform: uppercase; color: var(--lx-accent-ink); }
    `]);customElements.define("lx-scenario",Z);var Pe={1:{attempts:0,severity:!1,showCount:!0},2:{attempts:0,severity:!0,showCount:!1},3:{attempts:0,severity:!0,showCount:!1}},Ue=2,Oe=["critical","major","minor"],Ne=.34,Ie=.6,ie=n=>Math.round(n*100)/100,tt=class extends m{get level(){return this.config.level||1}get opts(){let t=Pe[this.level];return{attempts:this.config.attempts??t.attempts,severity:this.config.severity??t.severity,showCount:this.config.showCount??t.showCount}}get lines(){return(this.config.code||"").replace(/\n$/,"").split(`
`)}maxScore(){return this.config.points??this.level}initialState(){return{attemptsUsed:0,best:0,exhausted:!1,marks:{},submitted:null}}result(){return{score:ie(this.state.best*this.maxScore()),complete:this.state.attemptsUsed>0||!!this.state.carried,exhausted:this.state.exhausted}}issueAt(t){return this.config.issues.findIndex(e=>t>=e.line&&t<=(e.to??e.line))}toggle(t){if(this.state.submitted)return;let e={...this.state.marks};e[t]?delete e[t]:e[t]=this.opts.severity?"":"flag",this.setState({marks:e})}setSeverity(t,e){this.setState({marks:{...this.state.marks,[t]:e}})}grade(){let t=this.config.issues,e=this.state.marks,s=new Map,i=[];for(let c of Object.keys(e)){let h=Number(c),u=this.issueAt(h);u<0?i.push(h):s.has(u)||s.set(u,h)}let r=0,o=t.map((c,h)=>{if(!s.has(h))return{found:!1};let u=e[s.get(h)],p=!this.opts.severity||u===c.severity;return r+=p?1:Ie,{found:!0,sev:u,sevOk:p,line:s.get(h)}});return{fraction:ie(Math.max(0,Math.min(1,(r-i.length*Ne)/t.length))),perIssue:o,falseLines:i}}get limitReached(){let t=this.opts.attempts;return t>0&&this.state.attemptsUsed>=t}submit(){let t=this.grade();if(this.limitReached){this.setState({submitted:{...t,practice:!0}});return}let e=this.state.attemptsUsed+1,s=this.opts.attempts;this.setState({submitted:t,attemptsUsed:e,best:Math.max(this.state.best,t.fraction),exhausted:s>0&&e>=s||e>=Ue})}retry(){this.setState({marks:{},submitted:null})}lineClass(t,e){let s=this.config.view,i=["ln"];s==="diff"&&e.startsWith("+")&&i.push("add"),s==="diff"&&e.startsWith("-")&&i.push("del");let r=this.state.submitted;if(!r)return this.state.marks[t]!==void 0&&i.push("flagged"),i.join(" ");let o=this.issueAt(t);return r.falseLines.includes(t)?i.push("false"):o>=0&&r.perIssue[o].found&&r.perIssue[o].line===t?i.push("found"):o>=0&&!r.perIssue[o].found&&t===this.config.issues[o].line&&i.push("missed"),i.join(" ")}lineTag(t){let e=this.state.submitted;if(!e)return this.state.marks[t]!==void 0?l`<span class="tag flag">flagged</span>`:d;let s=this.issueAt(t);return e.falseLines.includes(t)?l`<span class="tag bad">false alarm</span>`:s>=0&&e.perIssue[s].found&&e.perIssue[s].line===t?l`<span class="tag ok">${e.perIssue[s].sevOk?"found":"found \xB7 wrong severity"}</span>`:s>=0&&!e.perIssue[s].found&&t===this.config.issues[s].line?l`<span class="tag miss">missed</span>`:d}renderReport(t){let e=this.config.decoys||[],{attempts:s}=this.opts,i=t.perIssue.filter(r=>r.found).length;return l`${t.practice?l`<div class="notice">Practice run: this result doesn't change your grade.</div>`:d}
      <div class="score" role="status"><b>${Math.round(t.fraction*100)}%</b>
        <span class="muted">${i} of ${this.config.issues.length} found · ${t.falseLines.length} false alarm${t.falseLines.length===1?"":"s"} · best ${Math.round(this.state.best*100)}%</span></div>
      <ul class="report">
        ${this.config.issues.map((r,o)=>{let a=t.perIssue[o];return l`<li>
            <span class="rating ${a.found?a.sevOk?"optimal":"acceptable":"critical"}">${a.found?(a.sevOk,"found"):"missed"}</span>
            <strong>Line ${r.line}${r.to?`\u2013${r.to}`:""}: ${f(r.label)}</strong>
            <span class="rating ${r.severity==="critical"?"critical":r.severity==="major"?"risky":"acceptable"}">${r.severity}</span>
            ${a.found&&!a.sevOk?l`<span class="muted">You rated it “${a.sev||"\u2014"}”.</span>`:d}
            <span class="muted">${f(r.explain)}</span>
          </li>`})}
        ${t.falseLines.map(r=>{let o=e.find(a=>a.line===r);return l`<li><span class="rating risky">false alarm</span> <strong>Line ${r}</strong>
            <span class="muted">${o?f(o.explain):"Nothing wrong here."}</span></li>`})}
      </ul>
      <div class="actions">
        ${this.limitReached?l`<button class="btn-ghost" @click=${this.retry}>Practise again (doesn't change your grade)</button>`:l`<button class="btn-primary" @click=${this.retry}>Try again${s?` (${s-this.state.attemptsUsed} graded left)`:""}</button>`}
      </div>`}renderWidget(){let{severity:t,showCount:e,attempts:s}=this.opts,i=this.state.submitted,r=Object.keys(this.state.marks).map(Number).sort((a,c)=>a-c),o=t&&r.some(a=>!this.state.marks[a]);return l`<section class="card" aria-label=${new DOMParser().parseFromString(this.config.title||"Spot the problems","text/html").body.textContent}>
      <div class="head">
        <span class="lvl lvl-${this.level}">Level ${this.level}</span>
        <span class="eyebrow" style="margin:0">Spot the problems ${this.graded?l`<span class="graded">· ${this.maxScore()} pt</span>`:d}</span>
      </div>
      <h3>${f(this.config.title||"")}</h3>
      ${this.renderNotice()}
      <p>${f(this.config.prompt||"")}</p>
      <p class="muted">
        Click every line that is a problem${t?", then rate how serious it is":""}.
        ${e?f(this.config.issues.length===1?"There is <b>1</b> problem.":`There are <b>${this.config.issues.length}</b> problems.`):"The number of problems is not revealed."}
        False alarms cost points. ${s===0?"Retake as often as you like; your best result counts.":`${s} graded attempt${s>1?"s":""}, then practice.`}
      </p>
      ${this.config.filename?l`<div class="file">${this.config.filename}</div>`:d}
      <div class="code ${this.config.filename?"":"nofile"}" role="list">
        ${this.lines.map((a,c)=>{let h=c+1;return l`<button class=${this.lineClass(h,a)} role="listitem" ?disabled=${!!i}
            aria-pressed=${this.state.marks[h]!==void 0} aria-label="Line ${h}: ${a}" @click=${()=>this.toggle(h)}>
            <span class="num">${h}</span><span class="txt">${a||" "}</span>${this.lineTag(h)}
          </button>`})}
      </div>
      ${!i&&t&&r.length?l`<div class="sev">${r.map(a=>l`<div class="sev-row" style="width:100%">
              <code>line ${a}</code>
              <select aria-label="Severity for line ${a}" .value=${this.state.marks[a]} @change=${c=>this.setSeverity(a,c.target.value)}>
                <option value="">severity…</option>
                ${Oe.map(c=>l`<option value=${c} ?selected=${this.state.marks[a]===c}>${c}</option>`)}
              </select>
            </div>`)}</div>`:d}
      ${i?this.renderReport(i):l`<div class="actions">
            <button class="btn-primary" ?disabled=${!r.length||o} @click=${this.submit}>Submit review</button>
            ${o?l`<span class="muted">Rate the severity of every flagged line.</span>`:d}
          </div>`}
    </section>`}};x(tt,"graded",!0),x(tt,"styles",[_,$`
      .head { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 4px; }
      .file { font: 600 12px var(--lx-font-mono); color: #cfd5df; background: #1f232a; padding: 6px 12px; border-radius: 8px 8px 0 0; }
      .code { background: var(--lx-code-bg); border-radius: 0 0 8px 8px; padding: 6px 0; overflow-x: auto; }
      .code.nofile { border-radius: 8px; }
      .ln {
        display: grid; grid-template-columns: 44px 1fr auto; align-items: center; width: 100%; text-align: left;
        font: 13.5px/1.6 var(--lx-font-mono); color: var(--lx-code-text); background: none; border: 0; border-radius: 0;
        padding: 1px 10px 1px 0; cursor: pointer; white-space: pre;
      }
      .ln:hover { background: rgba(255,255,255,.06); }
      .ln:focus-visible { outline: 2px solid var(--lx-sky); outline-offset: -2px; }
      .num { color: #6c7686; text-align: right; padding-right: 12px; user-select: none; }
      .ln.add .txt { color: #a6e3a1; }
      .ln.del .txt { color: #f5a3b3; }
      .ln.add { background: rgba(80, 200, 120, .07); }
      .ln.del { background: rgba(230, 0, 54, .08); }
      .ln.flagged { background: rgba(0, 166, 235, .22); box-shadow: inset 3px 0 0 var(--lx-sky); }
      .ln.found { background: rgba(31, 138, 91, .35); box-shadow: inset 3px 0 0 #3ccf8e; }
      .ln.false { background: rgba(230, 0, 54, .3); box-shadow: inset 3px 0 0 #ff5c7a; }
      .ln.missed { background: rgba(255, 176, 32, .25); box-shadow: inset 3px 0 0 #ffb020; }
      .ln[disabled] { cursor: default; opacity: 1; }
      .tag { font: 800 10px var(--lx-font-body); letter-spacing: .06em; text-transform: uppercase; padding: 1px 7px; border-radius: 999px; margin-left: 8px; }
      .tag.flag { background: var(--lx-sky); color: var(--lx-heading); }
      .tag.ok { background: #3ccf8e; color: #08331f; }
      .tag.bad { background: #ff5c7a; color: #3d0010; }
      .tag.miss { background: #ffb020; color: #3d2600; }
      .sev { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; margin: 10px 0 0; font-size: 14px; }
      .sev-row { display: flex; gap: 8px; align-items: center; padding: 6px 0; border-top: 1px solid var(--lx-border); flex-wrap: wrap; }
      .sev-row:first-child { border-top: 0; }
      .sev-row code { white-space: nowrap; }
      select { font: 600 14px var(--lx-font-body); padding: 5px 8px; border-radius: 6px; border: 1px solid var(--lx-border); }
      .report { list-style: none; padding: 0; margin: 10px 0 0; }
      .report li { border-top: 1px solid var(--lx-border); padding: 10px 0; font-size: 15px; }
      .report .muted { display: block; }
      .score { display: flex; align-items: baseline; gap: 10px; margin: 14px 0 4px; }
      .score b { font: 700 34px var(--lx-font-heading); color: var(--lx-heading); }
    `]);customElements.define("lx-spot",tt);
