var oe=Object.defineProperty;var ae=(r,t,e)=>t in r?oe(r,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):r[t]=e;var m=(r,t,e)=>ae(r,typeof t!="symbol"?t+"":t,e);var w=window.LX||{},I=document.documentElement.classList.contains("lx-embedded");function le(){try{let r=location.ancestorOrigins;if(r&&r.length&&r[0]&&r[0]!=="null")return r[0];if(document.referrer)return new URL(document.referrer).origin}catch{}return"*"}var it=le(),Rt=w.moodleOrigins||[],ce=I&&(Rt.length===0||Rt.includes(it));function Ut(r){if(!ce)return!1;try{return window.parent.postMessage(r,it),!0}catch{return!1}}var Pt=0;function Ot(){let r=Math.ceil(document.body.getBoundingClientRect().height)+24;Math.abs(r-Pt)<8||(Pt=r,Ut({type:"moodleIframeResize",height:r}))}I&&(new ResizeObserver(()=>requestAnimationFrame(Ot)).observe(document.body),addEventListener("load",Ot));var H=new Map,de=w.page&&w.page.gradeMode||w.gradeMode||"on-complete",pt=null,T=document.querySelector(".lx-scorebar"),he=T&&T.querySelector(".lx-scorebar__fill"),pe=T&&T.querySelector(".lx-scorebar__label"),st=T&&T.querySelector(".lx-scorebar__status");function Nt(){let r=0,t=0,e=0,s=0;for(let i of H.values())i.graded&&(s++,t+=i.max,r+=i.score||0,i.complete&&e++);return{score:Math.round(r*100)/100,max:t,done:e,count:s}}function ue(){let r=Nt();if(!r.count)return;if(T&&(T.hidden=!1,he.style.width=`${r.max?r.score/r.max*100:0}%`,pe.textContent=`Score ${r.score} / ${r.max}`),!(de==="each-answer"?r.done>0:r.done===r.count)){st&&(st.textContent=`${r.done} of ${r.count} activities done`);return}let e=`${r.score}/${r.max}`;if(e===pt)return;pt=e;let s=Ut({type:"moodleSubmitGrade",score:r.score,maxScore:r.max});st&&(st.textContent=s?"Result sent to Moodle":I?"Not sent: unknown host":"Practice mode \u2014 not recorded"),document.dispatchEvent(new CustomEvent("lx-graded",{detail:{...r,sent:s}}))}document.addEventListener("lx-register",r=>{let t=r.detail;H.set(t.id,{graded:t.graded,max:t.max,score:0,complete:!1})});document.addEventListener("lx-progress",r=>{let t=r.detail;H.set(t.id,{...H.get(t.id)||{},...t}),ue()});if(I){let r=it!=="*"?it:null,t=[...document.querySelectorAll("a[data-lx-page]")];for(let e of document.querySelectorAll("a[href]")){let s=e.getAttribute("href");!s||s.startsWith("#")||e.target==="_blank"||e.hasAttribute("data-lx-page")||(e.target="_blank",e.rel="noopener")}if(t.length){let e=r&&w.cid?`${r}/course/view.php?id=${encodeURIComponent(w.cid)}`:null,s=i=>{for(let n of t){let o=i&&i[n.dataset.lxPage],l=o?`${r}/mod/extpagewithgrades/view.php?id=${o}`:e;l?(n.href=l,n.target="_top",n.title=o?"Open this topic in Moodle":"Open the Moodle course"):(n.target="_blank",n.rel="noopener")}};s(null),w.cid&&fetch(`${w.siteRoot}moodle.json`,{cache:"no-cache"}).then(i=>i.ok?i.json():{}).then(i=>{let n=i.sites||{};if(!r){let o=Object.keys(n).filter(l=>n[l]?.courses?.[w.cid]);if(o.length!==1)return;r=o[0],e=`${r}/course/view.php?id=${encodeURIComponent(w.cid)}`}s(n[r]?.courses?.[w.cid]||null)}).catch(()=>{})}}var R=document.querySelector("[data-slides]");if(R){let p=function(g,{scroll:v=!1,focus:Lt=!1}={}){l=Math.max(0,Math.min(n,g)),r.forEach((A,k)=>{A.hidden=k!==l,A.classList.toggle("is-active",k===l)}),t.forEach((A,k)=>{A.classList.toggle("is-active",k===l),k===l?A.setAttribute("aria-current","step"):A.removeAttribute("aria-current")}),t[l]?.scrollIntoView({block:"nearest",inline:"nearest"}),e.disabled=l===0,s.disabled=l===n,s.textContent=l===n?"Done \u2713":"Next \u2192",i.textContent=`${l+1} / ${r.length}`,document.documentElement.classList.toggle("lx-slide-later",l>0);try{sessionStorage.setItem(o,String(l))}catch{}I||history.replaceState(null,"",`#lx-slide-${l+1}`),v&&c.scrollIntoView({block:"start",behavior:"smooth"}),Lt&&r[l].querySelector("h2, [tabindex], button, a")?.focus({preventScroll:!0})},b=function(){r.forEach((g,v)=>{let A=[...g.querySelectorAll("lx-quiz, lx-order, lx-scenario, lx-spot")].map(k=>k.id).map(k=>H.get(k)).filter(k=>k&&k.graded);t[v]?.classList.toggle("is-done",A.length>0&&A.every(k=>k.complete))})},r=[...R.querySelectorAll(".lx-slide")],t=[...R.querySelectorAll(".lx-step")],e=R.querySelector("[data-slide-prev]"),s=R.querySelector("[data-slide-next]"),i=R.querySelector(".lx-slidenav__count"),n=r.length-1,o=`lx:slide:${w.course}:${w.page&&w.page.id||location.pathname}`,l=0,c=document.createElement("span");c.setAttribute("aria-hidden","true"),c.style.cssText=`position:absolute;left:0;width:1px;height:1px;top:-${I?96:76}px`,R.prepend(c);let h=()=>{let g=location.hash.match(/^#lx-slide-(\d+)$/);return g?Number(g[1])-1:null},u=()=>{try{return Number(sessionStorage.getItem(o))}catch{return null}};e.addEventListener("click",()=>p(l-1,{scroll:!0})),s.addEventListener("click",()=>p(l+1,{scroll:!0})),t.forEach((g,v)=>g.addEventListener("click",()=>p(v,{scroll:!0}))),document.addEventListener("keydown",g=>{if(g.altKey||g.ctrlKey||g.metaKey||g.shiftKey||g.key!=="ArrowRight"&&g.key!=="ArrowLeft")return;let v=g.composedPath()[0];v&&v.closest&&v.closest("input, textarea, select, [contenteditable], li")||p(l+(g.key==="ArrowRight"?1:-1),{scroll:!0})}),document.addEventListener("lx-progress",()=>queueMicrotask(b));let y=h()??u()??0;p(Number.isFinite(y)?y:0)}var ge={auto:'<circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 0 0 18z" fill="currentColor"/>',light:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',dark:'<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>'},fe={auto:"light",light:"dark",dark:"auto"},D=document.querySelector("[data-lx-theme-toggle]");function ut(){if(!D||!window.LXTheme)return;let r=window.LXTheme.mode;D.querySelector("svg").innerHTML=ge[r];let t=`Colour theme: ${r==="auto"?"system":r}`;D.setAttribute("aria-label",t),D.title=t}D?.addEventListener("click",()=>{window.LXTheme.set(fe[window.LXTheme.mode]||"auto"),ut()});ut();document.addEventListener("lx-theme",ut);for(let r of document.querySelectorAll(".lx-prose pre")){let t=document.createElement("button");t.className="lx-copy",t.type="button",t.textContent="Copy",t.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(r.querySelector("code")?.innerText??r.innerText),t.textContent="Copied"}catch{t.textContent="Select & copy"}setTimeout(()=>t.textContent="Copy",1500)}),r.appendChild(t)}window.LXBridge={widgets:H,totals:Nt,get lastSent(){return pt}};var rt=globalThis,nt=rt.ShadowRoot&&(rt.ShadyCSS===void 0||rt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,gt=Symbol(),It=new WeakMap,B=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==gt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(nt&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=It.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&It.set(e,t))}return t}toString(){return this.cssText}},Ht=r=>new B(typeof r=="string"?r:r+"",void 0,gt),$=(r,...t)=>{let e=r.length===1?r[0]:t.reduce((s,i,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new B(e,r,gt)},qt=(r,t)=>{if(nt)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),i=rt.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},ft=nt?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return Ht(e)})(r):r;var{is:me,defineProperty:xe,getOwnPropertyDescriptor:be,getOwnPropertyNames:ve,getOwnPropertySymbols:$e,getPrototypeOf:ye}=Object,ot=globalThis,zt=ot.trustedTypes,ke=zt?zt.emptyScript:"",we=ot.reactiveElementPolyfillSupport,W=(r,t)=>r,mt={toAttribute(r,t){switch(t){case Boolean:r=r?ke:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},Dt=(r,t)=>!me(r,t),jt={attribute:!0,type:String,converter:mt,reflect:!1,useDefault:!1,hasChanged:Dt};Symbol.metadata??=Symbol("metadata"),ot.litPropertyMetadata??=new WeakMap;var E=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=jt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&xe(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){let{get:i,set:n}=be(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:i,set(o){let l=i?.call(this);n?.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??jt}static _$Ei(){if(this.hasOwnProperty(W("elementProperties")))return;let t=ye(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(W("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(W("properties"))){let e=this.properties,s=[...ve(e),...$e(e)];for(let i of s)this.createProperty(i,e[i])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let i of s)e.unshift(ft(i))}else t!==void 0&&e.push(ft(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return qt(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){let s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){let n=(s.converter?.toAttribute!==void 0?s.converter:mt).toAttribute(e,s.type);this._$Em=t,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(t,e){let s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let n=s.getPropertyOptions(i),o=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:mt;this._$Em=i;let l=o.fromAttribute(e,n.type);this[i]=l??this._$Ej?.get(i)??l,this._$Em=null}}requestUpdate(t,e,s,i=!1,n){if(t!==void 0){let o=this.constructor;if(i===!1&&(n=this[t]),s??=o.getPropertyOptions(t),!((s.hasChanged??Dt)(n,e)||s.useDefault&&s.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:n},o){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),n!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,n]of this._$Ep)this[i]=n;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,n]of s){let{wrapped:o}=n,l=this[i];o!==!0||this._$AL.has(i)||l===void 0||this.C(i,void 0,n,l)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};E.elementStyles=[],E.shadowRootOptions={mode:"open"},E[W("elementProperties")]=new Map,E[W("finalized")]=new Map,we?.({ReactiveElement:E}),(ot.reactiveElementVersions??=[]).push("2.1.2");var wt=globalThis,Bt=r=>r,at=wt.trustedTypes,Wt=at?at.createPolicy("lit-html",{createHTML:r=>r}):void 0,Jt="$lit$",M=`lit$${Math.random().toFixed(9).slice(2)}$`,Gt="?"+M,_e=`<${Gt}>`,U=document,V=()=>U.createComment(""),X=r=>r===null||typeof r!="object"&&typeof r!="function",_t=Array.isArray,Se=r=>_t(r)||typeof r?.[Symbol.iterator]=="function",xt=`[ 	
\f\r]`,Y=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Yt=/-->/g,Vt=/>/g,P=RegExp(`>|${xt}(?:([^\\s"'>=/]+)(${xt}*=${xt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Xt=/'/g,Kt=/"/g,Qt=/^(?:script|style|textarea|title)$/i,St=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),a=St(1),Ge=St(2),Qe=St(3),C=Symbol.for("lit-noChange"),d=Symbol.for("lit-nothing"),Ft=new WeakMap,O=U.createTreeWalker(U,129);function Zt(r,t){if(!_t(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return Wt!==void 0?Wt.createHTML(t):t}var Ae=(r,t)=>{let e=r.length-1,s=[],i,n=t===2?"<svg>":t===3?"<math>":"",o=Y;for(let l=0;l<e;l++){let c=r[l],h,u,p=-1,b=0;for(;b<c.length&&(o.lastIndex=b,u=o.exec(c),u!==null);)b=o.lastIndex,o===Y?u[1]==="!--"?o=Yt:u[1]!==void 0?o=Vt:u[2]!==void 0?(Qt.test(u[2])&&(i=RegExp("</"+u[2],"g")),o=P):u[3]!==void 0&&(o=P):o===P?u[0]===">"?(o=i??Y,p=-1):u[1]===void 0?p=-2:(p=o.lastIndex-u[2].length,h=u[1],o=u[3]===void 0?P:u[3]==='"'?Kt:Xt):o===Kt||o===Xt?o=P:o===Yt||o===Vt?o=Y:(o=P,i=void 0);let y=o===P&&r[l+1].startsWith("/>")?" ":"";n+=o===Y?c+_e:p>=0?(s.push(h),c.slice(0,p)+Jt+c.slice(p)+M+y):c+M+(p===-2?l:y)}return[Zt(r,n+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},K=class r{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,o=0,l=t.length-1,c=this.parts,[h,u]=Ae(t,e);if(this.el=r.createElement(h,s),O.currentNode=this.el.content,e===2||e===3){let p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(i=O.nextNode())!==null&&c.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(let p of i.getAttributeNames())if(p.endsWith(Jt)){let b=u[o++],y=i.getAttribute(p).split(M),g=/([.?@])?(.*)/.exec(b);c.push({type:1,index:n,name:g[2],strings:y,ctor:g[1]==="."?vt:g[1]==="?"?$t:g[1]==="@"?yt:z}),i.removeAttribute(p)}else p.startsWith(M)&&(c.push({type:6,index:n}),i.removeAttribute(p));if(Qt.test(i.tagName)){let p=i.textContent.split(M),b=p.length-1;if(b>0){i.textContent=at?at.emptyScript:"";for(let y=0;y<b;y++)i.append(p[y],V()),O.nextNode(),c.push({type:2,index:++n});i.append(p[b],V())}}}else if(i.nodeType===8)if(i.data===Gt)c.push({type:2,index:n});else{let p=-1;for(;(p=i.data.indexOf(M,p+1))!==-1;)c.push({type:7,index:n}),p+=M.length-1}n++}}static createElement(t,e){let s=U.createElement("template");return s.innerHTML=t,s}};function q(r,t,e=r,s){if(t===C)return t;let i=s!==void 0?e._$Co?.[s]:e._$Cl,n=X(t)?void 0:t._$litDirective$;return i?.constructor!==n&&(i?._$AO?.(!1),n===void 0?i=void 0:(i=new n(r),i._$AT(r,e,s)),s!==void 0?(e._$Co??=[])[s]=i:e._$Cl=i),i!==void 0&&(t=q(r,i._$AS(r,t.values),i,s)),t}var bt=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??U).importNode(e,!0);O.currentNode=i;let n=O.nextNode(),o=0,l=0,c=s[0];for(;c!==void 0;){if(o===c.index){let h;c.type===2?h=new F(n,n.nextSibling,this,t):c.type===1?h=new c.ctor(n,c.name,c.strings,this,t):c.type===6&&(h=new kt(n,this,t)),this._$AV.push(h),c=s[++l]}o!==c?.index&&(n=O.nextNode(),o++)}return O.currentNode=U,i}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},F=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=d,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=q(this,t,e),X(t)?t===d||t==null||t===""?(this._$AH!==d&&this._$AR(),this._$AH=d):t!==this._$AH&&t!==C&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Se(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==d&&X(this._$AH)?this._$AA.nextSibling.data=t:this.T(U.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=K.createElement(Zt(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{let n=new bt(i,this),o=n.u(this.options);n.p(e),this.T(o),this._$AH=n}}_$AC(t){let e=Ft.get(t.strings);return e===void 0&&Ft.set(t.strings,e=new K(t)),e}k(t){_t(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,i=0;for(let n of t)i===e.length?e.push(s=new r(this.O(V()),this.O(V()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let s=Bt(t).nextSibling;Bt(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},z=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=d,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=d}_$AI(t,e=this,s,i){let n=this.strings,o=!1;if(n===void 0)t=q(this,t,e,0),o=!X(t)||t!==this._$AH&&t!==C,o&&(this._$AH=t);else{let l=t,c,h;for(t=n[0],c=0;c<n.length-1;c++)h=q(this,l[s+c],e,c),h===C&&(h=this._$AH[c]),o||=!X(h)||h!==this._$AH[c],h===d?t=d:t!==d&&(t+=(h??"")+n[c+1]),this._$AH[c]=h}o&&!i&&this.j(t)}j(t){t===d?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},vt=class extends z{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===d?void 0:t}},$t=class extends z{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==d)}},yt=class extends z{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=q(this,t,e,0)??d)===C)return;let s=this._$AH,i=t===d&&s!==d||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==d&&(s===d||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},kt=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){q(this,t)}};var Ee=wt.litHtmlPolyfillSupport;Ee?.(K,F),(wt.litHtmlVersions??=[]).push("3.3.3");var te=(r,t,e)=>{let s=e?.renderBefore??t,i=s._$litPart$;if(i===void 0){let n=e?.renderBefore??null;s._$litPart$=i=new F(t.insertBefore(V(),n),n,void 0,e??{})}return i._$AI(r),i};var At=globalThis,L=class extends E{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=te(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return C}};L._$litElement$=!0,L.finalized=!0,At.litElementHydrateSupport?.({LitElement:L});var Ce=At.litElementPolyfillSupport;Ce?.({LitElement:L});(At.litElementVersions??=[]).push("4.2.2");var ee={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},se=r=>(...t)=>({_$litDirective$:r,values:t}),lt=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,s){this._$Ct=t,this._$AM=e,this._$Ci=s}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var J=class extends lt{constructor(t){if(super(t),this.it=d,t.type!==ee.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===d||t==null)return this._t=void 0,this.it=t;if(t===C)return t;if(typeof t!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.it)return this._t;this.it=t;let e=[t];return e.raw=e,this._t={_$litType$:this.constructor.resultType,strings:e,values:[]}}};J.directiveName="unsafeHTML",J.resultType=1;var f=se(J);var S=null;try{S=window.localStorage,S.setItem("lx:t","1"),S.removeItem("lx:t")}catch{S=null}var Te=()=>window.LX||{};function Et(r){let{course:t="course",version:e="0.0.0",page:s={},uid:i=""}=Te(),n=e.split(".").slice(0,2).join(".");return`lx:${t}:${n}:${s.id||location.pathname}:${r}:${i||"anon"}`}function Ct(r){if(!S)return null;try{let t=S.getItem(r);return t?JSON.parse(t):null}catch{return null}}function ct(r,t){if(S)try{S.setItem(r,JSON.stringify(t))}catch{}}function ie(r){if(S)try{S.removeItem(r)}catch{}}var x=class extends L{constructor(){super(),this.config={},this.state=null,this._failed=null}connectedCallback(){try{let t=this.querySelector('script[type="application/json"]');this.config=t?JSON.parse(t.textContent):{},this._key=Et(this.id||this.localName),this.state=this.migrate(Ct(this._key))}catch(t){this._fail("LX-R201",t)}super.connectedCallback(),this._setupUnlock(),this.dispatchEvent(new CustomEvent("lx-register",{bubbles:!0,composed:!0,detail:{id:this.id,graded:this.graded,max:this.graded?this.maxScore():0}})),queueMicrotask(()=>this.report())}get graded(){return this.constructor.graded&&this.config.graded!==!1}initialState(){return{}}maxScore(){return 1}result(){return{score:0,complete:!1}}renderWidget(){return a``}migrate(t){let e=this.initialState(),s=this.config._fp,i=this.config.version;if(!s)return{...e,...t||{}};if(!t)return{...e,fp:s,cv:i};let n=t.fp===void 0&&t.cv===void 0;if(t.fp===s&&t.cv===i)return{...e,...t};if(n){let l={...e,...t,fp:s,cv:i};return ct(this._key,l),l}let o={...e,best:t.best||0,carried:(t.attemptsUsed||0)>0||!!t.carried,fp:s,cv:i,notice:t.cv!==i?"version":"changed"};return ct(this._key,o),o}renderNotice(){return this.state?.notice?a`<div class="notice" role="status">
      <strong>This practice was updated${this.config.version>1?` (version ${this.config.version})`:""}.</strong>
      Your unfinished attempt was reset; your best result (${Math.round((this.state.best||0)*100)}%) is kept.
    </div>`:""}setState(t){let{notice:e,...s}=this.state||{};this.state={...s,...t},ct(this._key,this.state),this.report()}resetState(){ie(this._key),this.state={...this.initialState(),...this.config._fp?{fp:this.config._fp,cv:this.config.version}:{}},this.report()}report(){if(this._failed)return;let{score:t,complete:e,exhausted:s=!1}=this.result(),i=this.maxScore();this.dispatchEvent(new CustomEvent("lx-progress",{bubbles:!0,composed:!0,detail:{id:this.id,graded:this.graded,score:this.graded?t:0,max:this.graded?i:0,fraction:i?t/i:0,complete:e,exhausted:s}}))}get locked(){return!!this.config.unlock&&!this._unlocked}_setupUnlock(){let t=this.config.unlock;if(!t)return;let e=t.min??.7,s=Ct(Et(t.after))||{};this._unlocked=(s.best??0)>=e||!!s.exhausted,this._onPeer=i=>{let n=i.detail;n.id!==t.after||this._unlocked||(n.fraction>=e||n.exhausted)&&(this._unlocked=!0,this.requestUpdate())},document.addEventListener("lx-progress",this._onPeer)}disconnectedCallback(){super.disconnectedCallback(),this._onPeer&&document.removeEventListener("lx-progress",this._onPeer)}renderLocked(){let t=this.config.unlock,s=document.getElementById(t.after)?.config?.title||"the previous level";return a`<section class="card locked" aria-label="Locked">
      <div class="lock" aria-hidden="true">🔒</div>
      <div>
        ${this.config.level?a`<span class="lvl lvl-${this.config.level}">Level ${this.config.level}</span>`:""}
        <h3>${f(this.config.title||"Locked")}</h3>
        <p class="muted">Unlocks when you score at least ${Math.round((t.min??.7)*100)}% in “${f(s)}” (or after two tries).</p>
      </div>
    </section>`}_fail(t,e){this._failed=t,console.error(`[${t}] ${this.localName}#${this.id}:`,e)}render(){if(!this._failed)try{return this.locked?this.renderLocked():this.renderWidget()}catch(t){this._fail("LX-R202",t)}return a`<div class="card error" role="alert">
      This activity could not be loaded (${this._failed}). Please reload the page; if it persists, tell your mentor.
    </div>`}static seededOrder(t,e){let s=0;for(let o of e)s=s*31+o.charCodeAt(0)>>>0;let i=()=>(s=s*1664525+1013904223>>>0)/4294967296,n=[...Array(t).keys()];for(let o=t-1;o>0;o--){let l=Math.floor(i()*(o+1));[n[o],n[l]]=[n[l],n[o]]}return n}};m(x,"graded",!1),m(x,"properties",{state:{state:!0}});var _=$`
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
`;var Me="https://api.accredible.com/v1/credential-net/credentials/";function Le(r){let t=String(r||"").trim();if(!t)return null;let e=t.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);if(e)return e[0].toLowerCase();if(/^\d{4,}$/.test(t))return t;try{return new URL(t).pathname.split("/").filter(Boolean).reverse().find(n=>/^\d{4,}$/.test(n))||null}catch{return null}}var Re={\u0430:"a",\u0431:"b",\u0432:"v",\u0433:"h",\u0491:"g",\u0434:"d",\u0435:"e",\u0454:"ie",\u0436:"zh",\u0437:"z",\u0438:"y",\u0456:"i",\u0457:"i",\u0439:"i",\u043A:"k",\u043B:"l",\u043C:"m",\u043D:"n",\u043E:"o",\u043F:"p",\u0440:"r",\u0441:"s",\u0442:"t",\u0443:"u",\u0444:"f",\u0445:"kh",\u0446:"ts",\u0447:"ch",\u0448:"sh",\u0449:"shch",\u044C:"",\u044E:"iu",\u044F:"ia",\u0451:"e",\u044B:"y",\u044D:"e",\u044A:"","'":"","\u2019":"",\u02BC:""};function re(r){return String(r||"").toLowerCase().replace(/[а-яёіїєґ'’ʼ]/g,e=>Re[e]??e).normalize("NFD").replace(/[̀-ͯ]/g,"").split(/[^a-z]+/).filter(e=>e.length>1).map(e=>e.replace(/kh/g,"h").replace(/g/g,"h").replace(/[yj]/g,"i").replace(/ii/g,"i"))}function Pe(r,t){if(r===t)return!0;if(Math.min(r.length,t.length)<4)return!1;let e=Array.from({length:r.length+1},(s,i)=>[i]);for(let s=1;s<=t.length;s++)e[0][s]=s;for(let s=1;s<=r.length;s++)for(let i=1;i<=t.length;i++)e[s][i]=Math.min(e[s-1][i]+1,e[s][i-1]+1,e[s-1][i-1]+(r[s-1]===t[i-1]?0:1));return e[r.length][t.length]<=Math.floor(Math.max(r.length,t.length)/4)}function Oe(r,t){let e=re(r),s=re(t);if(!e.length||!s.length)return!1;let[i,n]=e.length<=s.length?[e,s]:[s,e];return i.length>=Math.min(2,n.length)&&i.every(o=>n.some(l=>Pe(o,l)))}function Ue(r,t,e){let s=r?.issuer?.name||"",i=[r?.name,r?.group?.course_name,r?.group?.name].filter(Boolean),n=(t.accept?.length?t.accept:[t.course]).map(c=>c.toLowerCase()),o=[{key:"issuer",ok:s.toLowerCase().includes((t.issuer||"OpenAI").toLowerCase()),text:`Issued by ${s||"an unknown issuer"}`},{key:"course",ok:i.some(c=>n.some(h=>c.toLowerCase().includes(h))),text:`Badge: ${i[0]||"unknown"}`},{key:"valid",ok:!r?.revoked_at&&!r?.expired&&r?.approve!==!1,text:r?.revoked_at?"Revoked":r?.expired?"Expired":"Valid, not revoked or expired"}],l=r?.recipient?.name||"";return t.checkName!==!1&&e&&o.push({key:"name",ok:Oe(l,e),text:`Issued to ${l||"an unknown person"}`}),{ok:o.every(c=>c.ok),checks:o,recipient:l,title:i[0]||"",issued:r?.issued_on||"",image:r?.badge_image?.preview?.url||r?.badge_image?.original?.url||""}}var G=class extends x{initialState(){return{link:"",status:"idle",result:null,checkedAt:""}}maxScore(){return 1}result(){return{score:this.state?.status==="ok"?1:0,complete:this.state?.status==="ok"}}get learnerName(){return window.LX&&window.LX.uname||""}async check(t){t?.preventDefault();let e=this.renderRoot.querySelector("input")?.value.trim()||"",s=Le(e);if(!s){this.setState({link:e,status:"badlink",result:null});return}this.setState({link:e,status:"checking",result:null});try{let i=await fetch(Me+encodeURIComponent(s),{headers:{Accept:"application/json"}});if(i.status===404)return this.setState({status:"notfound"});if(i.status===401||i.status===403)return this.setState({status:"private"});if(!i.ok)throw new Error(`HTTP ${i.status}`);let{data:n}=await i.json();if(n?.private)return this.setState({status:"private"});let o=Ue(n,this.config,this.learnerName),l=o.ok?"ok":o.checks.find(c=>c.key==="name"&&!c.ok)&&o.checks.filter(c=>!c.ok).length===1?"name":"mismatch";this.setState({status:l,result:{...o,id:s},checkedAt:new Date().toISOString()})}catch(i){console.warn("[badge] lookup failed",i),this.setState({status:"network"})}}renderChecks(t){return a`<ul class="checks">${t.checks.map(e=>a`<li><span class=${e.ok?"yes":"no"} aria-hidden="true">${e.ok?"\u2713":"\u2717"}</span><span>${e.text}</span></li>`)}</ul>`}renderStatus(){let t=this.state,e=t.result,s=this.config;switch(t.status){case"checking":return a`<p class="muted" role="status">Checking the badge with Accredible…</p>`;case"ok":return a`<div class="feedback ok" role="status">
          <div class="earned">
            ${e.image?a`<img src=${e.image} alt="" loading="lazy">`:""}
            <div><strong>Badge confirmed. This checkpoint is complete.</strong>
              <p>${e.title}${e.issued?a`, issued ${e.issued}`:""}.</p></div>
          </div>
          ${this.renderChecks(e)}
          ${!this.learnerName&&s.checkName!==!1?a`<p class="muted">The name wasn't checked because Moodle didn't pass it. Your instructor may verify it.</p>`:""}
        </div>`;case"name":return a`<div class="feedback bad" role="alert">
          <strong>The badge is valid, but it was issued to someone else, or under a different spelling of your name.</strong>
          ${this.renderChecks(e)}
          <p>Your name in Moodle: <b>${this.learnerName}</b>. If the badge is yours, send the link to your instructor and they will confirm it manually.</p>
        </div>`;case"mismatch":return a`<div class="feedback bad" role="alert">
          <strong>This badge doesn't complete this checkpoint.</strong>
          ${this.renderChecks(e)}
          <p>You need the <b>${s.course}</b> badge from OpenAI Academy.</p>
        </div>`;case"badlink":return a`<div class="feedback bad" role="alert">That doesn't look like a badge link. Open the email from Accredible, click <b>View badge</b> and copy the address of the page that opens.</div>`;case"notfound":return a`<div class="feedback bad" role="alert">Accredible has no badge with this link. Check that you copied the whole address.</div>`;case"private":return a`<div class="feedback bad" role="alert">This badge is private. On the badge page, sign in to Accredible, make the badge public, then check again.</div>`;case"network":return a`<div class="feedback bad" role="alert">Couldn't reach Accredible (api.accredible.com). Check your connection or VPN and try again. If your network blocks it, send the link to your instructor.</div>`;default:return""}}renderWidget(){let t=this.config,e=this.state,s=e.status==="ok";return a`<section class="card" aria-label="Badge checkpoint">
      <div class="eyebrow">🏅 Badge checkpoint ${this.graded?a`<span class="graded">· graded</span>`:""}</div>
      <h3>${t.course}</h3>
      ${s?"":a`<ol class="steps">
        <li>Complete <a href=${t.url} target="_blank" rel="noopener">${t.course}</a> in OpenAI Academy: the course <b>and</b> its assessment (pass mark 80%).</li>
        <li>Accredible emails you a link to your badge, at the address you use for OpenAI Academy.</li>
        <li>Open the badge, copy the page address and paste it below.</li>
      </ol>`}
      <form class="row" @submit=${this.check}>
        <label class="sr-only" for="link">Badge link</label>
        <input id="link" type="text" inputmode="url" autocomplete="off" spellcheck="false" placeholder="https://www.credential.net/…" .value=${e.link||""} ?disabled=${e.status==="checking"}>
        <button class="btn-primary" type="submit" ?disabled=${e.status==="checking"}>${s?"Check again":"Check badge"}</button>
      </form>
      ${this.renderStatus()}
    </section>`}};m(G,"graded",!0),m(G,"styles",[_,$`
      .row { display: flex; gap: 10px; flex-wrap: wrap; }
      input#link {
        flex: 1 1 320px; min-width: 0; font: 500 15px var(--lx-font-body); padding: 10px 14px; border-radius: 12px;
        border: 1px solid var(--lx-border-strong); background: var(--lx-surface); color: var(--lx-text);
      }
      input:focus-visible { outline: 3px solid var(--lx-focus); outline-offset: 1px; }
      ol.steps { margin: 0 0 14px; padding-left: 22px; }
      ol.steps li { margin: 4px 0; }
      ul.checks { list-style: none; padding: 0; margin: 10px 0 0; }
      ul.checks li { display: flex; gap: 8px; align-items: baseline; padding: 3px 0; }
      .yes { color: var(--lx-success-ink); font-weight: 800; }
      .no { color: var(--lx-error-ink); font-weight: 800; }
      .earned { display: flex; gap: 16px; align-items: center; }
      .earned img { width: 84px; height: 84px; object-fit: contain; border-radius: 12px; background: var(--lx-surface-2); }
      .feedback.ok ul.checks .yes { color: inherit; }
    `]);customElements.define("lx-badge",G);var dt=class extends x{get items(){return(this.config.items||[]).map(t=>typeof t=="string"?{text:t}:t)}initialState(){return{done:[]}}result(){return{score:0,complete:this.state.done.filter(Boolean).length===this.items.length}}toggle(t){let e=[...this.state.done];e[t]=!e[t],this.setState({done:e})}renderWidget(){let t=this.state.done.filter(Boolean).length,e=this.items.length;return a`<section class="card" aria-label=${this.config.title||"Checklist"}>
      <div class="eyebrow">Checklist</div>
      ${this.config.title?a`<h3>${f(this.config.title)}</h3>`:d}
      <div class="top">
        <div class="progress" aria-hidden="true"><span style="width:${t/e*100}%"></span></div>
        <span class="muted" role="status">${t} / ${e}</span>
      </div>
      <ul>
        ${this.items.map((s,i)=>a`<li class=${this.state.done[i]?"done":""}>
            <label>
              <input type="checkbox" .checked=${!!this.state.done[i]} @change=${()=>this.toggle(i)} />
              <span><span class="t">${f(s.text)}</span>${s.hint?a`<span class="hint">${f(s.hint)}</span>`:d}</span>
            </label>
          </li>`)}
      </ul>
      ${t===e&&this.config.done?a`<div class="feedback ok" role="status">${f(this.config.done)}</div>`:d}
    </section>`}};m(dt,"styles",[_,$`
      ul { list-style: none; padding: 0; margin: 0 0 12px; }
      li { border-bottom: 1px solid var(--lx-border); }
      li:last-child { border-bottom: 0; }
      label { display: flex; gap: 12px; padding: 10px 2px; cursor: pointer; align-items: flex-start; }
      input { width: 18px; height: 18px; margin-top: 4px; accent-color: var(--lx-success); flex: none; }
      .done .t { color: var(--lx-text-muted); text-decoration: line-through; text-decoration-color: var(--lx-border-strong); }
      .hint { display: block; font-size: 14px; color: var(--lx-text-muted); text-decoration: none; }
      .top { display: flex; gap: 12px; align-items: center; margin-bottom: 6px; }
      .top .progress { flex: 1; }
    `]);customElements.define("lx-checklist",dt);var ht=class extends x{get cards(){return this.config.cards||[]}initialState(){return{index:0,flipped:!1,known:[]}}result(){return{score:0,complete:this.state.known.filter(Boolean).length===this.cards.length}}go(t){let e=this.cards.length;this.setState({index:(this.state.index+t+e)%e,flipped:!1})}markKnown(){let t=[...this.state.known];t[this.state.index]=!0,this.setState({known:t}),this.go(1)}renderWidget(){let{index:t,flipped:e}=this.state,s=this.cards[t]||{front:"",back:""},i=this.state.known.filter(Boolean).length;return a`<section class="card" aria-label=${this.config.title||"Flashcards"}>
      <div class="eyebrow">Flashcards</div>
      ${this.config.title?a`<h3>${f(this.config.title)}</h3>`:d}
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
    </section>`}};m(ht,"styles",[_,$`
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
    `]);customElements.define("lx-flashcards",ht);var Q=class extends x{get items(){return this.config.items||[]}maxScore(){return 1}initialState(){let t=this.items.length,e=x.seededOrder(t,this.id||"order");return e.every((s,i)=>s===i)&&t>1&&(e=[...e.slice(1),e[0]]),{order:e,checked:!1,best:0,attempts:0}}fraction(){let t=this.state.order.filter((e,s)=>e===s).length;return Math.round(t/this.items.length*100)/100}result(){return{score:this.state.best,complete:this.state.attempts>0}}move(t,e){if(this.state.checked||e<0||e>=this.items.length||t===e)return;let s=[...this.state.order],[i]=s.splice(t,1);s.splice(e,0,i),this.setState({order:s}),this.updateComplete.then(()=>{let n=this.renderRoot.querySelectorAll("li")[e]?.querySelector(`button[data-dir="${e>t?"down":"up"}"]`);(n&&!n.disabled?n:this.renderRoot.querySelectorAll("li")[e])?.focus()})}check(){let t=this.fraction();this.setState({checked:!0,attempts:this.state.attempts+1,best:Math.max(this.state.best,t)})}onPointerDown(t,e){if(this.state.checked||t.target.closest("button"))return;let i=[...this.renderRoot.querySelector("ol").children];this._drag={from:e,over:e},i[e].classList.add("dragging"),i[e].setPointerCapture(t.pointerId)}onPointerMove(t){if(!this._drag)return;let e=[...this.renderRoot.querySelectorAll("li")],s=e.findIndex(i=>{let n=i.getBoundingClientRect();return t.clientY>=n.top&&t.clientY<=n.bottom});s>=0&&s!==this._drag.over&&(e.forEach(i=>i.classList.remove("over")),e[s].classList.add("over"),this._drag.over=s)}onPointerUp(){if(!this._drag)return;let{from:t,over:e}=this._drag;this._drag=null,this.renderRoot.querySelectorAll("li").forEach(s=>s.classList.remove("over","dragging")),this.move(t,e)}renderWidget(){let{order:t,checked:e}=this.state,s=this.items.length,i=e&&t.every((n,o)=>n===o);return a`<section class="card" aria-label=${this.config.title||"Put in order"}>
      <div class="eyebrow">Put in order ${this.graded?a`<span class="graded">· graded</span>`:d}</div>
      ${this.config.title?a`<h3>${f(this.config.title)}</h3>`:d}
      ${this.config.prompt?a`<p>${f(this.config.prompt)}</p>`:d}
      <p class="muted">Drag the cards, or use the arrow buttons.</p>
      <ol @pointermove=${this.onPointerMove} @pointerup=${this.onPointerUp} @pointercancel=${this.onPointerUp}>
        ${t.map((n,o)=>a`<li class=${e?n===o?"correct locked":"wrong locked":""} tabindex="-1" @pointerdown=${c=>this.onPointerDown(c,o)}>
            <span class="grip" aria-hidden="true">⋮⋮</span>
            <span class="text">${f(this.items[n])}</span>
            ${e?a`<span class="sr-only">${n===o?"correct position":"wrong position"}</span>`:a`<span class="move">
                  <button data-dir="up" aria-label="Move up" ?disabled=${o===0} @click=${()=>this.move(o,o-1)}>↑</button>
                  <button data-dir="down" aria-label="Move down" ?disabled=${o===s-1} @click=${()=>this.move(o,o+1)}>↓</button>
                </span>`}
          </li>`)}
      </ol>
      ${e?a`<div class="feedback ${i?"ok":"bad"}" role="status">
              ${i?a`<strong>Exactly right.</strong> ${this.config.explain?f(this.config.explain):d}`:a`<strong>${Math.round(this.fraction()*s)} of ${s} in the right place.</strong> Rearrange the red ones and check again.`}
            </div>
            <div class="actions">
              ${i?a`<button class="btn-ghost" @click=${()=>this.resetState()}>Start over</button>`:a`<button class="btn-primary" @click=${()=>this.setState({checked:!1})}>Try again</button>`}
            </div>`:a`<div class="actions"><button class="btn-primary" @click=${this.check}>Check order</button></div>`}
    </section>`}};m(Q,"graded",!0),m(Q,"styles",[_,$`
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
    `]);customElements.define("lx-order",Q);var Z=class extends x{get questions(){return this.config.questions||[]}initialState(){return{picks:{},checked:{},cur:0,view:"question"}}get paged(){return this.config.paged??!!this.closest("[data-slides]")}maxScore(){return this.questions.length}isRight(t){let e=this.questions[t],s=[].concat(e.answer).sort().join(","),i=[...this.state.picks[t]||[]].sort().join(",");return s===i}result(){let t=Object.keys(this.state.checked).filter(s=>this.state.checked[s]);return{score:t.filter(s=>this.isRight(s)).length,complete:t.length===this.questions.length}}optionOrder(t){let e=this.questions[t].options.length;return this.config.shuffle?x.seededOrder(e,`${this.id}-${t}`):[...Array(e).keys()]}pick(t,e,s){if(this.state.checked[t])return;let i=new Set(this.state.picks[t]||[]);s?i.has(e)?i.delete(e):i.add(e):(i.clear(),i.add(e)),this.setState({picks:{...this.state.picks,[t]:[...i]}})}check(t){this.setState({checked:{...this.state.checked,[t]:!0}})}renderQuestion(t,e){let s=Array.isArray(t.answer),i=[].concat(t.answer),n=this.state.picks[e]||[],o=!!this.state.checked[e],l=o&&this.isRight(e),c=`${this.id}-q${e}`;return a`<div class="q">
      <div class="q-text" id="${c}-label"><span class="q-num">${e+1}.</span>${f(t.q)}</div>
      ${s?a`<div class="hint">Select all that apply.</div>`:d}
      <fieldset aria-labelledby="${c}-label">
        ${this.optionOrder(e).map(h=>{let u=n.includes(h),p=i.includes(h),b=["opt",u?"selected":"",o&&p?"correct":"",o&&u&&!p?"wrong":"",o?"locked":""].join(" ");return a`<label class=${b}>
            <input type=${s?"checkbox":"radio"} name=${c} .checked=${u} ?disabled=${o}
              @change=${()=>this.pick(e,h,s)} />
            <span>${f(t.options[h])}</span>
            ${o&&p?a`<span class="mark" aria-label="correct answer">✓</span>`:d}
            ${o&&u&&!p?a`<span class="mark" aria-label="incorrect">✗</span>`:d}
          </label>`})}
      </fieldset>
      ${o?a`<div class="feedback ${l?"ok":"bad"}" role="status">
              <strong>${l?"Correct.":"Not quite."}</strong> ${t.explain?f(t.explain):d}
            </div>
            ${this.paged?this.renderPagedNext(e):d}`:a`<div class="actions">
            <button class="btn-primary" ?disabled=${!n.length} @click=${()=>this.check(e)}>Check answer</button>
          </div>`}
    </div>`}renderPagedNext(t){let e=this.questions.length,s=[...Array(e).keys()].find(i=>i>t&&!this.state.checked[i])??[...Array(e).keys()].find(i=>!this.state.checked[i]);return a`<div class="actions">
      ${s!==void 0?a`<button class="btn-primary" @click=${()=>this.setState({cur:s})}>Next question →</button>`:a`<button class="btn-primary" @click=${()=>this.setState({view:"result"})}>See your result</button>`}
    </div>`}renderPaged(){let{score:t,complete:e}=this.result(),s=this.questions.length,i=Math.min(this.state.cur||0,s-1);return e&&this.state.view==="result"?a`<div class="result" role="status">
          <b>${t} / ${s}</b><span class="muted">correct answers</span>
        </div>
        <ul class="review">
          ${this.questions.map((n,o)=>a`<li>
            <span class="rating ${this.isRight(o)?"optimal":"critical"}">${this.isRight(o)?"\u2713":"\u2717"}</span>
            <button @click=${()=>this.setState({cur:o,view:"question"})}>${f(n.q)}</button>
          </li>`)}
        </ul>
        <div class="actions" style="justify-content:center">
          <button class="btn-ghost" @click=${()=>this.resetState()}>Try again</button>
        </div>`:a`<div class="dots" role="tablist" aria-label="Questions">
        ${this.questions.map((n,o)=>{let l=this.state.checked[o]?this.isRight(o)?"right":"wrong":"";return a`<button class="dot ${l} ${o===i?"current":""}" role="tab" aria-selected=${o===i}
            aria-label="Question ${o+1}${l?l==="right"?", correct":", incorrect":""}" @click=${()=>this.setState({cur:o,view:"question"})}>${o+1}</button>`})}
      </div>
      <div class="paged">${this.renderQuestion(this.questions[i],i)}</div>
      ${e?a`<div class="actions"><button class="btn-ghost" @click=${()=>this.setState({view:"result"})}>Back to result</button></div>`:d}`}renderWidget(){if(this.paged)return a`<section class="card" aria-label=${this.config.title||"Quiz"}>
        <div class="eyebrow">Check yourself ${this.graded?a`<span class="graded">· graded</span>`:d}</div>
        ${this.config.title?a`<h3>${f(this.config.title)}</h3>`:d}
        ${this.renderPaged()}
      </section>`;let{score:t,complete:e}=this.result(),s=this.questions.length,i=Object.values(this.state.checked).filter(Boolean).length;return a`<section class="card" aria-label=${this.config.title||"Quiz"}>
      <div class="eyebrow">Check yourself ${this.graded?a`<span class="graded">· graded</span>`:d}</div>
      ${this.config.title?a`<h3>${f(this.config.title)}</h3>`:d}
      ${this.questions.map((n,o)=>this.renderQuestion(n,o))}
      <div class="summary">
        <div class="progress" aria-hidden="true"><span style="width:${i/s*100}%"></span></div>
        <span class="muted" role="status">${e?`${t} of ${s} correct`:`${i} of ${s} answered`}</span>
        ${e?a`<button class="btn-ghost" @click=${()=>this.resetState()}>Try again</button>`:d}
      </div>
    </section>`}};m(Z,"graded",!0),m(Z,"styles",[_,$`
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
    `]);customElements.define("lx-quiz",Z);var Ne={optimal:1,acceptable:.5,risky:0,critical:0},Ie={optimal:"acceptable",acceptable:"risky",risky:"risky",critical:"critical"},Tt={1:{attempts:0,feedback:"step",autoplay:!1},2:{attempts:0,feedback:"end",autoplay:!1},3:{attempts:0,feedback:"end",autoplay:!0}},He=2,qe={onTime:"optimal",late:"acceptable",early:"risky"},ze={onTime:"You stopped the agent right when it went wrong.",late:"You stopped it, but only after it had already continued for a while.",early:"You stopped the agent before anything was wrong. It lost its context for no reason.",missed:"You let the agent run to the end without stopping it."},Mt=.3,j=r=>Math.round(r*100)/100,N=(r="")=>new DOMParser().parseFromString(String(r),"text/html").body.textContent||"",tt=class extends x{get level(){return this.config.level||1}get opts(){let t=Tt[this.level];return{attempts:this.config.attempts??t.attempts,feedback:this.config.feedback??t.feedback}}get steps(){return this.config.steps||{}}maxScore(){return this.config.points??this.level}initialState(){return{attemptsUsed:0,best:0,exhausted:!1,run:null,last:null}}result(){let t=this.state;return{score:j(t.best*this.maxScore()),complete:t.attemptsUsed>0||!!t.carried,exhausted:t.exhausted}}computeVars(t){let e={},s=window.LX&&window.LX.uid||"anon";for(let[i,n]of Object.entries(this.config.vars||{}))e[i]=n[x.seededOrder(n.length,`${this.id}:${s}:${t}:${i}`)[0]];return e}t(t){return typeof t!="string"?t:t.replace(/\{\{(\w+)\}\}/g,(e,s)=>(this._vars&&this._vars[s])??e)}rich(t){return f(this.t(t||""))}choiceOrder(t,e){let s=this.steps[t].choices.length,i=window.LX&&window.LX.uid||"anon";return x.seededOrder(s,`${this.id}:${i}:${e}:${t}`)}get limitReached(){let t=this.opts.attempts;return t>0&&this.state.attemptsUsed>=t}start(){this.setState({run:{practice:this.limitReached,attempt:this.state.attemptsUsed+(this.state.practiceRuns||0),step:this.config.start,path:[],evidence:[],flags:[],visited:[this.config.start],pending:null,shown:1,stopped:null}})}patchRun(t){this.setState({run:{...this.state.run,...t}})}budgetUsed(t=this.state.run){let e=this.allEvidence();return t.evidence.reduce((s,i)=>s+(e[i]?.cost??1),0)}allEvidence(){let t={};for(let e of Object.values(this.steps))for(let s of e.evidence||[])t[s.id]={cost:1,...s};return t}gather(t){let e=this.state.run;e.evidence.includes(t.id)||e.pending||this.config.budget-this.budgetUsed()<(t.cost??1)||this.patchRun({evidence:[...e.evidence,t.id]})}choose(t){let e=this.state.run,s=this.steps[e.step].choices[t],i=s.rating,n=!1;(s.needs||[]).some(u=>!e.evidence.includes(u))&&(i=Ie[i],n=i!==s.rating);let o={step:e.step,choice:t,rating:i,downgraded:n},l=[...new Set([...e.flags,...s.sets||[]])],c={rating:i,downgraded:n,explain:s.explain,consequence:s.consequence,go:s.end?null:s.next},h=this.opts.feedback==="step"||s.consequence;this.patchRun({path:[...e.path,o],flags:l,pending:c}),h||this.advance()}nextLine(){let t=this.state.run,e=this.steps[t.step].stream.lines;t.pending||(t.shown>=e.length?this.evaluateStream(null):this.patchRun({shown:t.shown+1}))}stopAgent(){let t=this.state.run;t.pending||this.evaluateStream(t.shown-1)}evaluateStream(t){let e=this.state.run,s=this.steps[e.step].stream,i=s.lines.findIndex(c=>c.red),n;t===null?n="missed":t<i?n="early":t<=i+1?n="onTime":t<=i+3?n="late":n="missed";let o=n==="missed"?s.missRating||"critical":qe[n],l=s.outcomes&&s.outcomes[n]||ze[n];this.patchRun({stopped:t,path:[...e.path,{step:e.step,stream:n,at:t,rating:o}],pending:{rating:o,consequence:l,go:s.end?null:s.next,stream:!0}})}advance(){let t=this.state.run,e=t.pending?.go;if(!e)return this.finish();let s=typeof e=="string"?e:t.flags.includes(e.if)?e.then:e.else;this.patchRun({step:s,pending:null,shown:1,stopped:null,visited:[...t.visited,s]})}finish(){let t=this.state.run,e=this.allEvidence(),s=t.path.map(g=>Ne[g.rating]),i=s.length?s.reduce((g,v)=>g+v,0)/s.length:0,n=t.visited.flatMap(g=>(this.steps[g].evidence||[]).map(v=>v.id)),o=n.filter(g=>e[g].key),l=o.length?o.filter(g=>t.evidence.includes(g)).length/o.length:1,c=t.evidence.filter(g=>!e[g].key).reduce((g,v)=>g+(e[v].cost??1),0),h=this.config.budget?Math.max(0,1-c/this.config.budget):1,u=n.length>0,p=u?.6*i+.25*l+.15*h:i,b=t.path.some(g=>g.rating==="critical");b&&(p=Math.min(p,Mt)),p=j(p);let y={...t,final:p,dims:{decisions:j(i),process:j(l),efficiency:j(h),investigative:u,critical:b}};if(t.practice)this.setState({run:null,last:y,practiceRuns:(this.state.practiceRuns||0)+1});else{let g=this.state.attemptsUsed+1,v=this.opts.attempts;this.setState({attemptsUsed:g,best:Math.max(this.state.best,p),exhausted:v>0&&g>=v||g>=He,run:null,last:y})}this.updateComplete.then(()=>this.renderRoot.querySelector(".score")?.scrollIntoView({block:"nearest",behavior:"smooth"}))}updated(){clearTimeout(this._timer);let t=this.state?.run;if(!t||t.pending)return;let e=this.steps[t.step];if(!e?.stream)return;(e.stream.autoplay??Tt[this.level].autoplay)&&(this._timer=setTimeout(()=>this.nextLine(),e.stream.speed||1800))}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this._timer)}renderHead(){return a`<div class="head">
      <span class="lvl lvl-${this.level}">Level ${this.level}</span>
      <span class="eyebrow" style="margin:0">Decision scenario ${this.graded?a`<span class="graded">· ${this.maxScore()} pt</span>`:d}</span>
    </div>
    <h3>${f(this.config.title||"")}</h3>`}renderIntro(){let{attempts:t,feedback:e}=this.opts,s=this.state.attemptsUsed;return a`${this.config.intro?a`<p>${this.rich(this.config.intro)}</p>`:d}
      <ul class="rules">
        <li>${e==="step"?"You get feedback after every decision.":"Feedback only at the end \u2014 like in real life."}</li>
        <li>${t===0?"Retake it as often as you like; your best result counts, and each try gets a new variant.":`${t} graded attempt${t>1?"s":""}${s?` (${s} used)`:""}; after that you can still practise without changing your grade.`}</li>
        ${this.config.budget?a`<li>You can investigate before deciding — but only <strong>${this.config.budget}</strong> actions in total. Choose what is worth checking.</li>`:d}
        <li>Critical mistakes cap the result at ${Mt*100}%.</li>
      </ul>
      <div class="actions"><button class="btn-primary" @click=${this.start}>Start scenario</button></div>`}renderEvidence(t,e){if(!t.evidence?.length)return d;let s=this.config.budget-this.budgetUsed(e),i=this.allEvidence(),n=e.evidence.filter(o=>t.evidence.some(l=>l.id===o)||i[o]);return a`<div class="evidence">
      <div class="evidence-head">
        <strong>Investigate first?</strong>
        <span class="budget" aria-label="${s} actions left">
          ${Array.from({length:this.config.budget},(o,l)=>a`<span class="dot ${l<this.config.budget-s?"used":""}"></span>`)}
          <span>${s} left</span>
        </span>
      </div>
      <div class="actions-ev">
        ${t.evidence.map(o=>a`<button class="ev-btn" ?disabled=${e.evidence.includes(o.id)||s<(o.cost??1)||!!e.pending}
            @click=${()=>this.gather(o)}>${e.evidence.includes(o.id)?"\u2713 ":"\u25B8 "}${this.rich(o.label)}${(o.cost??1)>1?` (${o.cost})`:""}</button>`)}
      </div>
      ${n.filter(o=>t.evidence.some(l=>l.id===o)).map(o=>{let l=t.evidence.find(c=>c.id===o);return a`<div class="ev-label">$ ${N(this.t(l.label))}</div><pre>${this.t(l.output)}</pre>`})}
    </div>`}renderPending(t){let e=this.opts.feedback==="step",s=e?t.rating:"neutral";return a`<div class="pending ${s}" role="status">
        ${e?a`<p><span class="rating ${t.rating}">${t.rating}</span>${t.downgraded?a` <span class="muted">— right idea, but you acted without checking the evidence first</span>`:d}</p>`:d}
        ${t.consequence?a`<p>${this.rich(t.consequence)}</p>`:d}
        ${e&&t.explain?a`<p class="muted">${this.rich(t.explain)}</p>`:d}
      </div>
      <div class="actions"><button class="btn-primary" @click=${this.advance}>${t.go?"Continue \u2192":"See results"}</button></div>`}renderStep(){let t=this.state.run,e=this.steps[t.step],s=Object.entries(e.extra||{}).filter(([i])=>t.flags.includes(i));return a`<div class="stepno">Step ${t.path.length+1}${e.title?` \xB7 ${N(this.t(e.title))}`:""}</div>
      <div class="situation">
        <p>${this.rich(e.situation)}</p>
        ${s.map(([,i])=>a`<div class="extra">${this.rich(i)}</div>`)}
      </div>
      ${e.ending?a`<div class="actions"><button class="btn-primary" @click=${this.finish}>See results</button></div>`:e.stream?this.renderStream(e,t):a`${this.renderEvidence(e,t)}
              ${t.pending?this.renderPending(t.pending):a`<div class="choices" role="group" aria-label="Your decision">
                    ${this.choiceOrder(t.step,t.attempt).map(i=>a`<button class="choice" @click=${()=>this.choose(i)}>${this.rich(e.choices[i].text)}</button>`)}
                  </div>`}`}`}renderStream(t,e){let s=t.stream,i=s.lines.slice(0,e.stopped!==null?e.stopped+1:e.shown),n=s.autoplay??Tt[this.level].autoplay;return a`<p class="muted">Watch the agent work. Stop it the moment something goes wrong — not earlier, not later.</p>
      <div class="stream" aria-live="polite">
        ${i.map((o,l)=>a`<div class="ln ${e.pending&&o.red&&l<=(e.stopped??99)?"redmark":""}">${this.rich(o.text)}</div>`)}
      </div>
      ${e.pending?this.renderPending(e.pending):a`<div class="actions">
            <button class="stop" @click=${this.stopAgent}>✋ Stop the agent</button>
            ${n?a`<span class="muted">The agent keeps going…</span>`:a`<button class="btn-ghost" @click=${this.nextLine}>${e.shown>=s.lines.length?"Let it finish":"Next step \u25B8"}</button>`}
          </div>`}`}renderDebrief(){let t=this.state.last,e=t.dims,s=this.allEvidence(),{attempts:i}=this.opts,n=l=>`${Math.round(l*100)}%`,o=t.visited.flatMap(l=>(this.steps[l].evidence||[]).map(c=>c.id));return a`${t.practice?a`<div class="notice">Practice run: this result doesn't change your grade.</div>`:d}
      <div class="score" role="status"><b>${n(t.final)}</b>
        <span class="muted">${t.practice?"practice run":"this attempt"} · best ${n(this.state.best)}${this.graded?` \xB7 ${j(this.state.best*this.maxScore())} / ${this.maxScore()} pt`:""}</span></div>
      ${e.critical?a`<div class="cap">A critical decision capped this attempt at ${Mt*100}%.</div>`:d}
      <div class="dims">
        <div class="dim"><strong>${n(e.decisions)}</strong>Decision quality</div>
        ${e.investigative?a`<div class="dim"><strong>${n(e.process)}</strong>Key evidence checked</div>
              <div class="dim"><strong>${n(e.efficiency)}</strong>Efficiency (no wasted actions)</div>`:d}
      </div>
      <h4>Your path vs. the expert</h4>
      <ol class="path">
        ${t.path.map(l=>{let c=this.steps[l.step];if(l.stream){let p=c.stream.lines.findIndex(b=>b.red);return a`<li>
              <div class="title">${c.title?this.rich(c.title):"Watching the agent"}</div>
              <div class="row"><span class="rating ${l.rating}">${l.rating}</span>
                ${l.at===null||l.stream==="missed"?" You did not stop the agent in time.":` You stopped at line ${l.at+1}.`}</div>
              <div class="expert">Expert: stop at line ${p+1} — “${N(this.t(c.stream.lines[p].text))}”</div>
            </li>`}let h=c.choices[l.choice],u=c.choices.find(p=>p.rating==="optimal");return a`<li>
            <div class="title">${c.title?this.rich(c.title):N(this.t(c.situation)).slice(0,90)+"\u2026"}</div>
            <div class="row"><span class="rating ${l.rating}">${l.rating}</span> ${this.rich(h.text)}
              ${l.downgraded?a`<span class="muted"> (downgraded: you didn't check ${h.needs.map(p=>N(this.t(s[p].label))).join(", ")} first)</span>`:d}</div>
            ${h.explain?a`<div class="why">${this.rich(h.explain)}</div>`:d}
            ${u&&u!==h?a`<div class="expert">Expert: ${this.rich(u.text)}${u.explain?a` — ${this.rich(u.explain)}`:d}</div>`:d}
          </li>`})}
      </ol>
      ${o.length?a`<h4>Investigation</h4>
          <ul class="evlist">
            ${o.map(l=>{let c=s[l],h=t.evidence.includes(l),u=c.key?h?"\u2713 key evidence checked":"\u2717 key evidence missed":h?"\xB7 checked (not essential)":"\xB7 skipped (fine)";return a`<li><code>${N(this.t(c.label))}</code> — ${u}</li>`})}
          </ul>`:d}
      <div class="actions">
        ${this.limitReached?a`<button class="btn-ghost" @click=${this.start}>Practise again (doesn't change your grade)</button>`:a`<button class="btn-primary" @click=${this.start}>Try again${i?` (${i-this.state.attemptsUsed} graded left)`:""}</button>`}
      </div>`}renderWidget(){let t=this.state,e=t.run?t.run.attempt:t.last?t.last.attempt:t.attemptsUsed;return this._vars=this.computeVars(e),a`<section class="card" aria-label=${N(this.config.title||"Scenario")}>
      ${this.renderHead()}
      ${this.renderNotice()}
      ${t.run?this.renderStep():t.last?this.renderDebrief():this.renderIntro()}
    </section>`}};m(tt,"graded",!0),m(tt,"styles",[_,$`
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
    `]);customElements.define("lx-scenario",tt);var je={1:{attempts:0,severity:!1,showCount:!0},2:{attempts:0,severity:!0,showCount:!1},3:{attempts:0,severity:!0,showCount:!1}},De=2,Be=["critical","major","minor"],We=.34,Ye=.6,ne=r=>Math.round(r*100)/100,et=class extends x{get level(){return this.config.level||1}get opts(){let t=je[this.level];return{attempts:this.config.attempts??t.attempts,severity:this.config.severity??t.severity,showCount:this.config.showCount??t.showCount}}get lines(){return(this.config.code||"").replace(/\n$/,"").split(`
`)}maxScore(){return this.config.points??this.level}initialState(){return{attemptsUsed:0,best:0,exhausted:!1,marks:{},submitted:null}}result(){return{score:ne(this.state.best*this.maxScore()),complete:this.state.attemptsUsed>0||!!this.state.carried,exhausted:this.state.exhausted}}issueAt(t){return this.config.issues.findIndex(e=>t>=e.line&&t<=(e.to??e.line))}toggle(t){if(this.state.submitted)return;let e={...this.state.marks};e[t]?delete e[t]:e[t]=this.opts.severity?"":"flag",this.setState({marks:e})}setSeverity(t,e){this.setState({marks:{...this.state.marks,[t]:e}})}grade(){let t=this.config.issues,e=this.state.marks,s=new Map,i=[];for(let c of Object.keys(e)){let h=Number(c),u=this.issueAt(h);u<0?i.push(h):s.has(u)||s.set(u,h)}let n=0,o=t.map((c,h)=>{if(!s.has(h))return{found:!1};let u=e[s.get(h)],p=!this.opts.severity||u===c.severity;return n+=p?1:Ye,{found:!0,sev:u,sevOk:p,line:s.get(h)}});return{fraction:ne(Math.max(0,Math.min(1,(n-i.length*We)/t.length))),perIssue:o,falseLines:i}}get limitReached(){let t=this.opts.attempts;return t>0&&this.state.attemptsUsed>=t}submit(){let t=this.grade();if(this.limitReached){this.setState({submitted:{...t,practice:!0}});return}let e=this.state.attemptsUsed+1,s=this.opts.attempts;this.setState({submitted:t,attemptsUsed:e,best:Math.max(this.state.best,t.fraction),exhausted:s>0&&e>=s||e>=De})}retry(){this.setState({marks:{},submitted:null})}lineClass(t,e){let s=this.config.view,i=["ln"];s==="diff"&&e.startsWith("+")&&i.push("add"),s==="diff"&&e.startsWith("-")&&i.push("del");let n=this.state.submitted;if(!n)return this.state.marks[t]!==void 0&&i.push("flagged"),i.join(" ");let o=this.issueAt(t);return n.falseLines.includes(t)?i.push("false"):o>=0&&n.perIssue[o].found&&n.perIssue[o].line===t?i.push("found"):o>=0&&!n.perIssue[o].found&&t===this.config.issues[o].line&&i.push("missed"),i.join(" ")}lineTag(t){let e=this.state.submitted;if(!e)return this.state.marks[t]!==void 0?a`<span class="tag flag">flagged</span>`:d;let s=this.issueAt(t);return e.falseLines.includes(t)?a`<span class="tag bad">false alarm</span>`:s>=0&&e.perIssue[s].found&&e.perIssue[s].line===t?a`<span class="tag ok">${e.perIssue[s].sevOk?"found":"found \xB7 wrong severity"}</span>`:s>=0&&!e.perIssue[s].found&&t===this.config.issues[s].line?a`<span class="tag miss">missed</span>`:d}renderReport(t){let e=this.config.decoys||[],{attempts:s}=this.opts,i=t.perIssue.filter(n=>n.found).length;return a`${t.practice?a`<div class="notice">Practice run: this result doesn't change your grade.</div>`:d}
      <div class="score" role="status"><b>${Math.round(t.fraction*100)}%</b>
        <span class="muted">${i} of ${this.config.issues.length} found · ${t.falseLines.length} false alarm${t.falseLines.length===1?"":"s"} · best ${Math.round(this.state.best*100)}%</span></div>
      <ul class="report">
        ${this.config.issues.map((n,o)=>{let l=t.perIssue[o];return a`<li>
            <span class="rating ${l.found?l.sevOk?"optimal":"acceptable":"critical"}">${l.found?(l.sevOk,"found"):"missed"}</span>
            <strong>Line ${n.line}${n.to?`\u2013${n.to}`:""}: ${f(n.label)}</strong>
            <span class="rating ${n.severity==="critical"?"critical":n.severity==="major"?"risky":"acceptable"}">${n.severity}</span>
            ${l.found&&!l.sevOk?a`<span class="muted">You rated it “${l.sev||"\u2014"}”.</span>`:d}
            <span class="muted">${f(n.explain)}</span>
          </li>`})}
        ${t.falseLines.map(n=>{let o=e.find(l=>l.line===n);return a`<li><span class="rating risky">false alarm</span> <strong>Line ${n}</strong>
            <span class="muted">${o?f(o.explain):"Nothing wrong here."}</span></li>`})}
      </ul>
      <div class="actions">
        ${this.limitReached?a`<button class="btn-ghost" @click=${this.retry}>Practise again (doesn't change your grade)</button>`:a`<button class="btn-primary" @click=${this.retry}>Try again${s?` (${s-this.state.attemptsUsed} graded left)`:""}</button>`}
      </div>`}renderWidget(){let{severity:t,showCount:e,attempts:s}=this.opts,i=this.state.submitted,n=Object.keys(this.state.marks).map(Number).sort((l,c)=>l-c),o=t&&n.some(l=>!this.state.marks[l]);return a`<section class="card" aria-label=${new DOMParser().parseFromString(this.config.title||"Spot the problems","text/html").body.textContent}>
      <div class="head">
        <span class="lvl lvl-${this.level}">Level ${this.level}</span>
        <span class="eyebrow" style="margin:0">Spot the problems ${this.graded?a`<span class="graded">· ${this.maxScore()} pt</span>`:d}</span>
      </div>
      <h3>${f(this.config.title||"")}</h3>
      ${this.renderNotice()}
      <p>${f(this.config.prompt||"")}</p>
      <p class="muted">
        Click every line that is a problem${t?", then rate how serious it is":""}.
        ${e?f(this.config.issues.length===1?"There is <b>1</b> problem.":`There are <b>${this.config.issues.length}</b> problems.`):"The number of problems is not revealed."}
        False alarms cost points. ${s===0?"Retake as often as you like; your best result counts.":`${s} graded attempt${s>1?"s":""}, then practice.`}
      </p>
      ${this.config.filename?a`<div class="file">${this.config.filename}</div>`:d}
      <div class="code ${this.config.filename?"":"nofile"}" role="list">
        ${this.lines.map((l,c)=>{let h=c+1;return a`<button class=${this.lineClass(h,l)} role="listitem" ?disabled=${!!i}
            aria-pressed=${this.state.marks[h]!==void 0} aria-label="Line ${h}: ${l}" @click=${()=>this.toggle(h)}>
            <span class="num">${h}</span><span class="txt">${l||" "}</span>${this.lineTag(h)}
          </button>`})}
      </div>
      ${!i&&t&&n.length?a`<div class="sev">${n.map(l=>a`<div class="sev-row" style="width:100%">
              <code>line ${l}</code>
              <select aria-label="Severity for line ${l}" .value=${this.state.marks[l]} @change=${c=>this.setSeverity(l,c.target.value)}>
                <option value="">severity…</option>
                ${Be.map(c=>a`<option value=${c} ?selected=${this.state.marks[l]===c}>${c}</option>`)}
              </select>
            </div>`)}</div>`:d}
      ${i?this.renderReport(i):a`<div class="actions">
            <button class="btn-primary" ?disabled=${!n.length||o} @click=${this.submit}>Submit review</button>
            ${o?a`<span class="muted">Rate the severity of every flagged line.</span>`:d}
          </div>`}
    </section>`}};m(et,"graded",!0),m(et,"styles",[_,$`
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
    `]);customElements.define("lx-spot",et);
