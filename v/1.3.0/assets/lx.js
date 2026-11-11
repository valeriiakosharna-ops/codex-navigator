var ee=Object.defineProperty;var se=(r,t,e)=>t in r?ee(r,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):r[t]=e;var x=(r,t,e)=>se(r,typeof t!="symbol"?t+"":t,e);var Z=window.LX||{},Q=document.documentElement.classList.contains("lx-embedded");function ie(){try{if(document.referrer)return new URL(document.referrer).origin}catch{}return"*"}var Mt=ie(),Et=Z.moodleOrigins||[],re=Q&&(Et.length===0||Et.includes(Mt));function Lt(r){if(!re)return!1;try{return window.parent.postMessage(r,Mt),!0}catch{return!1}}var Ct=0;function Tt(){let r=Math.ceil(document.body.getBoundingClientRect().height)+24;Math.abs(r-Ct)<8||(Ct=r,Lt({type:"moodleIframeResize",height:r}))}Q&&(new ResizeObserver(()=>requestAnimationFrame(Tt)).observe(document.body),addEventListener("load",Tt));var I=new Map,ne=Z.page&&Z.page.gradeMode||Z.gradeMode||"on-complete",lt=null,S=document.querySelector(".lx-scorebar"),oe=S&&S.querySelector(".lx-scorebar__fill"),ae=S&&S.querySelector(".lx-scorebar__label"),G=S&&S.querySelector(".lx-scorebar__status");function Pt(){let r=0,t=0,e=0,s=0;for(let i of I.values())i.graded&&(s++,t+=i.max,r+=i.score||0,i.complete&&e++);return{score:Math.round(r*100)/100,max:t,done:e,count:s}}function le(){let r=Pt();if(!r.count)return;if(S&&(S.hidden=!1,oe.style.width=`${r.max?r.score/r.max*100:0}%`,ae.textContent=`Score ${r.score} / ${r.max}`),!(ne==="each-answer"?r.done>0:r.done===r.count)){G&&(G.textContent=`${r.done} of ${r.count} activities done`);return}let e=`${r.score}/${r.max}`;if(e===lt)return;lt=e;let s=Lt({type:"moodleSubmitGrade",score:r.score,maxScore:r.max});G&&(G.textContent=s?"Result sent to Moodle":Q?"Not sent: unknown host":"Practice mode \u2014 not recorded"),document.dispatchEvent(new CustomEvent("lx-graded",{detail:{...r,sent:s}}))}document.addEventListener("lx-register",r=>{let t=r.detail;I.set(t.id,{graded:t.graded,max:t.max,score:0,complete:!1})});document.addEventListener("lx-progress",r=>{let t=r.detail;I.set(t.id,{...I.get(t.id)||{},...t}),le()});if(Q)for(let r of document.querySelectorAll("a[href]")){let t=r.getAttribute("href");!t||t.startsWith("#")||r.target==="_blank"||(r.target="_blank",r.rel="noopener")}var ce={auto:'<circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 0 0 18z" fill="currentColor"/>',light:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',dark:'<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>'},de={auto:"light",light:"dark",dark:"auto"},H=document.querySelector("[data-lx-theme-toggle]");function ct(){if(!H||!window.LXTheme)return;let r=window.LXTheme.mode;H.querySelector("svg").innerHTML=ce[r];let t=`Colour theme: ${r==="auto"?"system":r}`;H.setAttribute("aria-label",t),H.title=t}H?.addEventListener("click",()=>{window.LXTheme.set(de[window.LXTheme.mode]||"auto"),ct()});ct();document.addEventListener("lx-theme",ct);for(let r of document.querySelectorAll(".lx-prose pre")){let t=document.createElement("button");t.className="lx-copy",t.type="button",t.textContent="Copy",t.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(r.querySelector("code")?.innerText??r.innerText),t.textContent="Copied"}catch{t.textContent="Select & copy"}setTimeout(()=>t.textContent="Copy",1500)}),r.appendChild(t)}window.LXBridge={widgets:I,totals:Pt,get lastSent(){return lt}};var tt=globalThis,et=tt.ShadowRoot&&(tt.ShadyCSS===void 0||tt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,dt=Symbol(),Ut=new WeakMap,z=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==dt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(et&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=Ut.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Ut.set(e,t))}return t}toString(){return this.cssText}},Rt=r=>new z(typeof r=="string"?r:r+"",void 0,dt),b=(r,...t)=>{let e=r.length===1?r[0]:t.reduce((s,i,o)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[o+1],r[0]);return new z(e,r,dt)},Ot=(r,t)=>{if(et)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),i=tt.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},pt=et?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return Rt(e)})(r):r;var{is:pe,defineProperty:he,getOwnPropertyDescriptor:ue,getOwnPropertyNames:ge,getOwnPropertySymbols:fe,getPrototypeOf:me}=Object,st=globalThis,Nt=st.trustedTypes,xe=Nt?Nt.emptyScript:"",ve=st.reactiveElementPolyfillSupport,q=(r,t)=>r,ht={toAttribute(r,t){switch(t){case Boolean:r=r?xe:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},It=(r,t)=>!pe(r,t),Ht={attribute:!0,type:String,converter:ht,reflect:!1,useDefault:!1,hasChanged:It};Symbol.metadata??=Symbol("metadata"),st.litPropertyMetadata??=new WeakMap;var w=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Ht){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&he(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){let{get:i,set:o}=ue(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get:i,set(n){let c=i?.call(this);o?.call(this,n),this.requestUpdate(t,c,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Ht}static _$Ei(){if(this.hasOwnProperty(q("elementProperties")))return;let t=me(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(q("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(q("properties"))){let e=this.properties,s=[...ge(e),...fe(e)];for(let i of s)this.createProperty(i,e[i])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let i of s)e.unshift(pt(i))}else t!==void 0&&e.push(pt(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ot(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){let s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){let o=(s.converter?.toAttribute!==void 0?s.converter:ht).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){let s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let o=s.getPropertyOptions(i),n=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:ht;this._$Em=i;let c=n.fromAttribute(e,o.type);this[i]=c??this._$Ej?.get(i)??c,this._$Em=null}}requestUpdate(t,e,s,i=!1,o){if(t!==void 0){let n=this.constructor;if(i===!1&&(o=this[t]),s??=n.getPropertyOptions(t),!((s.hasChanged??It)(o,e)||s.useDefault&&s.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:o},n){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),o!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,o]of this._$Ep)this[i]=o;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,o]of s){let{wrapped:n}=o,c=this[i];n!==!0||this._$AL.has(i)||c===void 0||this.C(i,void 0,o,c)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[q("elementProperties")]=new Map,w[q("finalized")]=new Map,ve?.({ReactiveElement:w}),(st.reactiveElementVersions??=[]).push("2.1.2");var bt=globalThis,zt=r=>r,it=bt.trustedTypes,qt=it?it.createPolicy("lit-html",{createHTML:r=>r}):void 0,Vt="$lit$",A=`lit$${Math.random().toFixed(9).slice(2)}$`,Xt="?"+A,be=`<${Xt}>`,L=document,j=()=>L.createComment(""),B=r=>r===null||typeof r!="object"&&typeof r!="function",$t=Array.isArray,$e=r=>$t(r)||typeof r?.[Symbol.iterator]=="function",ut=`[ 	
\f\r]`,D=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Dt=/-->/g,jt=/>/g,T=RegExp(`>|${ut}(?:([^\\s"'>=/]+)(${ut}*=${ut}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Bt=/'/g,Wt=/"/g,Ft=/^(?:script|style|textarea|title)$/i,yt=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),a=yt(1),Ie=yt(2),ze=yt(3),_=Symbol.for("lit-noChange"),d=Symbol.for("lit-nothing"),Yt=new WeakMap,M=L.createTreeWalker(L,129);function Kt(r,t){if(!$t(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return qt!==void 0?qt.createHTML(t):t}var ye=(r,t)=>{let e=r.length-1,s=[],i,o=t===2?"<svg>":t===3?"<math>":"",n=D;for(let c=0;c<e;c++){let l=r[c],p,u,h=-1,f=0;for(;f<l.length&&(n.lastIndex=f,u=n.exec(l),u!==null);)f=n.lastIndex,n===D?u[1]==="!--"?n=Dt:u[1]!==void 0?n=jt:u[2]!==void 0?(Ft.test(u[2])&&(i=RegExp("</"+u[2],"g")),n=T):u[3]!==void 0&&(n=T):n===T?u[0]===">"?(n=i??D,h=-1):u[1]===void 0?h=-2:(h=n.lastIndex-u[2].length,p=u[1],n=u[3]===void 0?T:u[3]==='"'?Wt:Bt):n===Wt||n===Bt?n=T:n===Dt||n===jt?n=D:(n=T,i=void 0);let $=n===T&&r[c+1].startsWith("/>")?" ":"";o+=n===D?l+be:h>=0?(s.push(p),l.slice(0,h)+Vt+l.slice(h)+A+$):l+A+(h===-2?c:$)}return[Kt(r,o+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},W=class r{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let o=0,n=0,c=t.length-1,l=this.parts,[p,u]=ye(t,e);if(this.el=r.createElement(p,s),M.currentNode=this.el.content,e===2||e===3){let h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(i=M.nextNode())!==null&&l.length<c;){if(i.nodeType===1){if(i.hasAttributes())for(let h of i.getAttributeNames())if(h.endsWith(Vt)){let f=u[n++],$=i.getAttribute(h).split(A),C=/([.?@])?(.*)/.exec(f);l.push({type:1,index:o,name:C[2],strings:$,ctor:C[1]==="."?ft:C[1]==="?"?mt:C[1]==="@"?xt:R}),i.removeAttribute(h)}else h.startsWith(A)&&(l.push({type:6,index:o}),i.removeAttribute(h));if(Ft.test(i.tagName)){let h=i.textContent.split(A),f=h.length-1;if(f>0){i.textContent=it?it.emptyScript:"";for(let $=0;$<f;$++)i.append(h[$],j()),M.nextNode(),l.push({type:2,index:++o});i.append(h[f],j())}}}else if(i.nodeType===8)if(i.data===Xt)l.push({type:2,index:o});else{let h=-1;for(;(h=i.data.indexOf(A,h+1))!==-1;)l.push({type:7,index:o}),h+=A.length-1}o++}}static createElement(t,e){let s=L.createElement("template");return s.innerHTML=t,s}};function U(r,t,e=r,s){if(t===_)return t;let i=s!==void 0?e._$Co?.[s]:e._$Cl,o=B(t)?void 0:t._$litDirective$;return i?.constructor!==o&&(i?._$AO?.(!1),o===void 0?i=void 0:(i=new o(r),i._$AT(r,e,s)),s!==void 0?(e._$Co??=[])[s]=i:e._$Cl=i),i!==void 0&&(t=U(r,i._$AS(r,t.values),i,s)),t}var gt=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??L).importNode(e,!0);M.currentNode=i;let o=M.nextNode(),n=0,c=0,l=s[0];for(;l!==void 0;){if(n===l.index){let p;l.type===2?p=new Y(o,o.nextSibling,this,t):l.type===1?p=new l.ctor(o,l.name,l.strings,this,t):l.type===6&&(p=new vt(o,this,t)),this._$AV.push(p),l=s[++c]}n!==l?.index&&(o=M.nextNode(),n++)}return M.currentNode=L,i}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},Y=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=d,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=U(this,t,e),B(t)?t===d||t==null||t===""?(this._$AH!==d&&this._$AR(),this._$AH=d):t!==this._$AH&&t!==_&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):$e(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==d&&B(this._$AH)?this._$AA.nextSibling.data=t:this.T(L.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=W.createElement(Kt(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{let o=new gt(i,this),n=o.u(this.options);o.p(e),this.T(n),this._$AH=o}}_$AC(t){let e=Yt.get(t.strings);return e===void 0&&Yt.set(t.strings,e=new W(t)),e}k(t){$t(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,i=0;for(let o of t)i===e.length?e.push(s=new r(this.O(j()),this.O(j()),this,this.options)):s=e[i],s._$AI(o),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let s=zt(t).nextSibling;zt(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},R=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,o){this.type=1,this._$AH=d,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=d}_$AI(t,e=this,s,i){let o=this.strings,n=!1;if(o===void 0)t=U(this,t,e,0),n=!B(t)||t!==this._$AH&&t!==_,n&&(this._$AH=t);else{let c=t,l,p;for(t=o[0],l=0;l<o.length-1;l++)p=U(this,c[s+l],e,l),p===_&&(p=this._$AH[l]),n||=!B(p)||p!==this._$AH[l],p===d?t=d:t!==d&&(t+=(p??"")+o[l+1]),this._$AH[l]=p}n&&!i&&this.j(t)}j(t){t===d?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},ft=class extends R{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===d?void 0:t}},mt=class extends R{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==d)}},xt=class extends R{constructor(t,e,s,i,o){super(t,e,s,i,o),this.type=5}_$AI(t,e=this){if((t=U(this,t,e,0)??d)===_)return;let s=this._$AH,i=t===d&&s!==d||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==d&&(s===d||i);i&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},vt=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){U(this,t)}};var ke=bt.litHtmlPolyfillSupport;ke?.(W,Y),(bt.litHtmlVersions??=[]).push("3.3.3");var Jt=(r,t,e)=>{let s=e?.renderBefore??t,i=s._$litPart$;if(i===void 0){let o=e?.renderBefore??null;s._$litPart$=i=new Y(t.insertBefore(j(),o),o,void 0,e??{})}return i._$AI(r),i};var kt=globalThis,E=class extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Jt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return _}};E._$litElement$=!0,E.finalized=!0,kt.litElementHydrateSupport?.({LitElement:E});var we=kt.litElementPolyfillSupport;we?.({LitElement:E});(kt.litElementVersions??=[]).push("4.2.2");var Gt={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Zt=r=>(...t)=>({_$litDirective$:r,values:t}),rt=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,s){this._$Ct=t,this._$AM=e,this._$Ci=s}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var V=class extends rt{constructor(t){if(super(t),this.it=d,t.type!==Gt.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===d||t==null)return this._t=void 0,this.it=t;if(t===_)return t;if(typeof t!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.it)return this._t;this.it=t;let e=[t];return e.raw=e,this._t={_$litType$:this.constructor.resultType,strings:e,values:[]}}};V.directiveName="unsafeHTML",V.resultType=1;var g=Zt(V);var k=null;try{k=window.localStorage,k.setItem("lx:t","1"),k.removeItem("lx:t")}catch{k=null}var _e=()=>window.LX||{};function wt(r){let{course:t="course",version:e="0.0.0",page:s={},uid:i=""}=_e(),o=e.split(".").slice(0,2).join(".");return`lx:${t}:${o}:${s.id||location.pathname}:${r}:${i||"anon"}`}function _t(r){if(!k)return null;try{let t=k.getItem(r);return t?JSON.parse(t):null}catch{return null}}function nt(r,t){if(k)try{k.setItem(r,JSON.stringify(t))}catch{}}function Qt(r){if(k)try{k.removeItem(r)}catch{}}var m=class extends E{constructor(){super(),this.config={},this.state=null,this._failed=null}connectedCallback(){try{let t=this.querySelector('script[type="application/json"]');this.config=t?JSON.parse(t.textContent):{},this._key=wt(this.id||this.localName),this.state=this.migrate(_t(this._key))}catch(t){this._fail("LX-R201",t)}super.connectedCallback(),this._setupUnlock(),this.dispatchEvent(new CustomEvent("lx-register",{bubbles:!0,composed:!0,detail:{id:this.id,graded:this.graded,max:this.graded?this.maxScore():0}})),queueMicrotask(()=>this.report())}get graded(){return this.constructor.graded&&this.config.graded!==!1}initialState(){return{}}maxScore(){return 1}result(){return{score:0,complete:!1}}renderWidget(){return a``}migrate(t){let e=this.initialState(),s=this.config._fp,i=this.config.version;if(!s)return{...e,...t||{}};if(!t)return{...e,fp:s,cv:i};let o=t.fp===void 0&&t.cv===void 0;if(t.fp===s&&t.cv===i)return{...e,...t};if(o){let c={...e,...t,fp:s,cv:i};return nt(this._key,c),c}let n={...e,best:t.best||0,carried:(t.attemptsUsed||0)>0||!!t.carried,fp:s,cv:i,notice:t.cv!==i?"version":"changed"};return nt(this._key,n),n}renderNotice(){return this.state?.notice?a`<div class="notice" role="status">
      <strong>This practice was updated${this.config.version>1?` (version ${this.config.version})`:""}.</strong>
      Your unfinished attempt was reset; your best result (${Math.round((this.state.best||0)*100)}%) is kept.
    </div>`:""}setState(t){let{notice:e,...s}=this.state||{};this.state={...s,...t},nt(this._key,this.state),this.report()}resetState(){Qt(this._key),this.state={...this.initialState(),...this.config._fp?{fp:this.config._fp,cv:this.config.version}:{}},this.report()}report(){if(this._failed)return;let{score:t,complete:e,exhausted:s=!1}=this.result(),i=this.maxScore();this.dispatchEvent(new CustomEvent("lx-progress",{bubbles:!0,composed:!0,detail:{id:this.id,graded:this.graded,score:this.graded?t:0,max:this.graded?i:0,fraction:i?t/i:0,complete:e,exhausted:s}}))}get locked(){return!!this.config.unlock&&!this._unlocked}_setupUnlock(){let t=this.config.unlock;if(!t)return;let e=t.min??.7,s=_t(wt(t.after))||{};this._unlocked=(s.best??0)>=e||!!s.exhausted,this._onPeer=i=>{let o=i.detail;o.id!==t.after||this._unlocked||(o.fraction>=e||o.exhausted)&&(this._unlocked=!0,this.requestUpdate())},document.addEventListener("lx-progress",this._onPeer)}disconnectedCallback(){super.disconnectedCallback(),this._onPeer&&document.removeEventListener("lx-progress",this._onPeer)}renderLocked(){let t=this.config.unlock,s=document.getElementById(t.after)?.config?.title||"the previous level";return a`<section class="card locked" aria-label="Locked">
      <div class="lock" aria-hidden="true">🔒</div>
      <div>
        ${this.config.level?a`<span class="lvl lvl-${this.config.level}">Level ${this.config.level}</span>`:""}
        <h3>${g(this.config.title||"Locked")}</h3>
        <p class="muted">Unlocks when you score at least ${Math.round((t.min??.7)*100)}% in “${g(s)}” (or use all its attempts).</p>
      </div>
    </section>`}_fail(t,e){this._failed=t,console.error(`[${t}] ${this.localName}#${this.id}:`,e)}render(){if(!this._failed)try{return this.locked?this.renderLocked():this.renderWidget()}catch(t){this._fail("LX-R202",t)}return a`<div class="card error" role="alert">
      This activity could not be loaded (${this._failed}). Please reload the page; if it persists, tell your mentor.
    </div>`}static seededOrder(t,e){let s=0;for(let n of e)s=s*31+n.charCodeAt(0)>>>0;let i=()=>(s=s*1664525+1013904223>>>0)/4294967296,o=[...Array(t).keys()];for(let n=t-1;n>0;n--){let c=Math.floor(i()*(n+1));[o[n],o[c]]=[o[c],o[n]]}return o}};x(m,"graded",!1),x(m,"properties",{state:{state:!0}});var y=b`
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
`;var ot=class extends m{get items(){return(this.config.items||[]).map(t=>typeof t=="string"?{text:t}:t)}initialState(){return{done:[]}}result(){return{score:0,complete:this.state.done.filter(Boolean).length===this.items.length}}toggle(t){let e=[...this.state.done];e[t]=!e[t],this.setState({done:e})}renderWidget(){let t=this.state.done.filter(Boolean).length,e=this.items.length;return a`<section class="card" aria-label=${this.config.title||"Checklist"}>
      <div class="eyebrow">Checklist</div>
      ${this.config.title?a`<h3>${g(this.config.title)}</h3>`:d}
      <div class="top">
        <div class="progress" aria-hidden="true"><span style="width:${t/e*100}%"></span></div>
        <span class="muted" role="status">${t} / ${e}</span>
      </div>
      <ul>
        ${this.items.map((s,i)=>a`<li class=${this.state.done[i]?"done":""}>
            <label>
              <input type="checkbox" .checked=${!!this.state.done[i]} @change=${()=>this.toggle(i)} />
              <span><span class="t">${g(s.text)}</span>${s.hint?a`<span class="hint">${g(s.hint)}</span>`:d}</span>
            </label>
          </li>`)}
      </ul>
      ${t===e&&this.config.done?a`<div class="feedback ok" role="status">${g(this.config.done)}</div>`:d}
    </section>`}};x(ot,"styles",[y,b`
      ul { list-style: none; padding: 0; margin: 0 0 12px; }
      li { border-bottom: 1px solid var(--lx-border); }
      li:last-child { border-bottom: 0; }
      label { display: flex; gap: 12px; padding: 10px 2px; cursor: pointer; align-items: flex-start; }
      input { width: 18px; height: 18px; margin-top: 4px; accent-color: var(--lx-success); flex: none; }
      .done .t { color: var(--lx-text-muted); text-decoration: line-through; text-decoration-color: var(--lx-border-strong); }
      .hint { display: block; font-size: 14px; color: var(--lx-text-muted); text-decoration: none; }
      .top { display: flex; gap: 12px; align-items: center; margin-bottom: 6px; }
      .top .progress { flex: 1; }
    `]);customElements.define("lx-checklist",ot);var at=class extends m{get cards(){return this.config.cards||[]}initialState(){return{index:0,flipped:!1,known:[]}}result(){return{score:0,complete:this.state.known.filter(Boolean).length===this.cards.length}}go(t){let e=this.cards.length;this.setState({index:(this.state.index+t+e)%e,flipped:!1})}markKnown(){let t=[...this.state.known];t[this.state.index]=!0,this.setState({known:t}),this.go(1)}renderWidget(){let{index:t,flipped:e}=this.state,s=this.cards[t]||{front:"",back:""},i=this.state.known.filter(Boolean).length;return a`<section class="card" aria-label=${this.config.title||"Flashcards"}>
      <div class="eyebrow">Flashcards</div>
      ${this.config.title?a`<h3>${g(this.config.title)}</h3>`:d}
      <div class="stage">
        <button class="flip ${e?"back":""}" aria-label="Flip card" aria-pressed=${e}
          @click=${()=>this.setState({flipped:!e})}>
          <div class="face front" aria-hidden=${e}><span class="tag">Card ${t+1}</span><div>${g(s.front)}</div></div>
          <div class="face backface" aria-hidden=${!e}><span class="tag">Answer</span><div>${g(s.back)}</div></div>
        </button>
      </div>
      <div class="nav">
        <span class="muted count">${t+1} / ${this.cards.length} · <span class="known">${i} known</span></span>
        <button class="btn-ghost" @click=${()=>this.go(-1)} aria-label="Previous card">←</button>
        <button class="btn-ghost" @click=${()=>this.markKnown()}>I knew it</button>
        <button class="btn-primary" @click=${()=>this.go(1)}>Next →</button>
      </div>
    </section>`}};x(at,"styles",[y,b`
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
    `]);customElements.define("lx-flashcards",at);var X=class extends m{get items(){return this.config.items||[]}maxScore(){return 1}initialState(){let t=this.items.length,e=m.seededOrder(t,this.id||"order");return e.every((s,i)=>s===i)&&t>1&&(e=[...e.slice(1),e[0]]),{order:e,checked:!1,best:0,attempts:0}}fraction(){let t=this.state.order.filter((e,s)=>e===s).length;return Math.round(t/this.items.length*100)/100}result(){return{score:this.state.best,complete:this.state.attempts>0}}move(t,e){if(this.state.checked||e<0||e>=this.items.length||t===e)return;let s=[...this.state.order],[i]=s.splice(t,1);s.splice(e,0,i),this.setState({order:s}),this.updateComplete.then(()=>{let o=this.renderRoot.querySelectorAll("li")[e]?.querySelector(`button[data-dir="${e>t?"down":"up"}"]`);(o&&!o.disabled?o:this.renderRoot.querySelectorAll("li")[e])?.focus()})}check(){let t=this.fraction();this.setState({checked:!0,attempts:this.state.attempts+1,best:Math.max(this.state.best,t)})}onPointerDown(t,e){if(this.state.checked||t.target.closest("button"))return;let i=[...this.renderRoot.querySelector("ol").children];this._drag={from:e,over:e},i[e].classList.add("dragging"),i[e].setPointerCapture(t.pointerId)}onPointerMove(t){if(!this._drag)return;let e=[...this.renderRoot.querySelectorAll("li")],s=e.findIndex(i=>{let o=i.getBoundingClientRect();return t.clientY>=o.top&&t.clientY<=o.bottom});s>=0&&s!==this._drag.over&&(e.forEach(i=>i.classList.remove("over")),e[s].classList.add("over"),this._drag.over=s)}onPointerUp(){if(!this._drag)return;let{from:t,over:e}=this._drag;this._drag=null,this.renderRoot.querySelectorAll("li").forEach(s=>s.classList.remove("over","dragging")),this.move(t,e)}renderWidget(){let{order:t,checked:e}=this.state,s=this.items.length,i=e&&t.every((o,n)=>o===n);return a`<section class="card" aria-label=${this.config.title||"Put in order"}>
      <div class="eyebrow">Put in order ${this.graded?a`<span class="graded">· graded</span>`:d}</div>
      ${this.config.title?a`<h3>${g(this.config.title)}</h3>`:d}
      ${this.config.prompt?a`<p>${g(this.config.prompt)}</p>`:d}
      <p class="muted">Drag the cards, or use the arrow buttons.</p>
      <ol @pointermove=${this.onPointerMove} @pointerup=${this.onPointerUp} @pointercancel=${this.onPointerUp}>
        ${t.map((o,n)=>a`<li class=${e?o===n?"correct locked":"wrong locked":""} tabindex="-1" @pointerdown=${l=>this.onPointerDown(l,n)}>
            <span class="grip" aria-hidden="true">⋮⋮</span>
            <span class="text">${g(this.items[o])}</span>
            ${e?a`<span class="sr-only">${o===n?"correct position":"wrong position"}</span>`:a`<span class="move">
                  <button data-dir="up" aria-label="Move up" ?disabled=${n===0} @click=${()=>this.move(n,n-1)}>↑</button>
                  <button data-dir="down" aria-label="Move down" ?disabled=${n===s-1} @click=${()=>this.move(n,n+1)}>↓</button>
                </span>`}
          </li>`)}
      </ol>
      ${e?a`<div class="feedback ${i?"ok":"bad"}" role="status">
              ${i?a`<strong>Exactly right.</strong> ${this.config.explain?g(this.config.explain):d}`:a`<strong>${Math.round(this.fraction()*s)} of ${s} in the right place.</strong> Rearrange the red ones and check again.`}
            </div>
            <div class="actions">
              ${i?a`<button class="btn-ghost" @click=${()=>this.resetState()}>Start over</button>`:a`<button class="btn-primary" @click=${()=>this.setState({checked:!1})}>Try again</button>`}
            </div>`:a`<div class="actions"><button class="btn-primary" @click=${this.check}>Check order</button></div>`}
    </section>`}};x(X,"graded",!0),x(X,"styles",[y,b`
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
    `]);customElements.define("lx-order",X);var F=class extends m{get questions(){return this.config.questions||[]}initialState(){return{picks:{},checked:{}}}maxScore(){return this.questions.length}isRight(t){let e=this.questions[t],s=[].concat(e.answer).sort().join(","),i=[...this.state.picks[t]||[]].sort().join(",");return s===i}result(){let t=Object.keys(this.state.checked).filter(s=>this.state.checked[s]);return{score:t.filter(s=>this.isRight(s)).length,complete:t.length===this.questions.length}}optionOrder(t){let e=this.questions[t].options.length;return this.config.shuffle?m.seededOrder(e,`${this.id}-${t}`):[...Array(e).keys()]}pick(t,e,s){if(this.state.checked[t])return;let i=new Set(this.state.picks[t]||[]);s?i.has(e)?i.delete(e):i.add(e):(i.clear(),i.add(e)),this.setState({picks:{...this.state.picks,[t]:[...i]}})}check(t){this.setState({checked:{...this.state.checked,[t]:!0}})}renderQuestion(t,e){let s=Array.isArray(t.answer),i=[].concat(t.answer),o=this.state.picks[e]||[],n=!!this.state.checked[e],c=n&&this.isRight(e),l=`${this.id}-q${e}`;return a`<div class="q">
      <div class="q-text" id="${l}-label"><span class="q-num">${e+1}.</span>${g(t.q)}</div>
      ${s?a`<div class="hint">Select all that apply.</div>`:d}
      <fieldset aria-labelledby="${l}-label">
        ${this.optionOrder(e).map(p=>{let u=o.includes(p),h=i.includes(p),f=["opt",u?"selected":"",n&&h?"correct":"",n&&u&&!h?"wrong":"",n?"locked":""].join(" ");return a`<label class=${f}>
            <input type=${s?"checkbox":"radio"} name=${l} .checked=${u} ?disabled=${n}
              @change=${()=>this.pick(e,p,s)} />
            <span>${g(t.options[p])}</span>
            ${n&&h?a`<span class="mark" aria-label="correct answer">✓</span>`:d}
            ${n&&u&&!h?a`<span class="mark" aria-label="incorrect">✗</span>`:d}
          </label>`})}
      </fieldset>
      ${n?a`<div class="feedback ${c?"ok":"bad"}" role="status">
            <strong>${c?"Correct.":"Not quite."}</strong> ${t.explain?g(t.explain):d}
          </div>`:a`<div class="actions">
            <button class="btn-primary" ?disabled=${!o.length} @click=${()=>this.check(e)}>Check answer</button>
          </div>`}
    </div>`}renderWidget(){let{score:t,complete:e}=this.result(),s=this.questions.length,i=Object.values(this.state.checked).filter(Boolean).length;return a`<section class="card" aria-label=${this.config.title||"Quiz"}>
      <div class="eyebrow">Check yourself ${this.graded?a`<span class="graded">· graded</span>`:d}</div>
      ${this.config.title?a`<h3>${g(this.config.title)}</h3>`:d}
      ${this.questions.map((o,n)=>this.renderQuestion(o,n))}
      <div class="summary">
        <div class="progress" aria-hidden="true"><span style="width:${i/s*100}%"></span></div>
        <span class="muted" role="status">${e?`${t} of ${s} correct`:`${i} of ${s} answered`}</span>
        ${e?a`<button class="btn-ghost" @click=${()=>this.resetState()}>Try again</button>`:d}
      </div>
    </section>`}};x(F,"graded",!0),x(F,"styles",[y,b`
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
    `]);customElements.define("lx-quiz",F);var Se={optimal:1,acceptable:.5,risky:0,critical:0},Ae={optimal:"acceptable",acceptable:"risky",risky:"risky",critical:"critical"},St={1:{attempts:0,feedback:"step",autoplay:!1},2:{attempts:2,feedback:"end",autoplay:!1},3:{attempts:1,feedback:"end",autoplay:!0}},Ee={onTime:"optimal",late:"acceptable",early:"risky"},Ce={onTime:"You stopped the agent right when it went wrong.",late:"You stopped it, but only after it had already continued for a while.",early:"You stopped the agent before anything was wrong. It lost its context for no reason.",missed:"You let the agent run to the end without stopping it."},At=.3,O=r=>Math.round(r*100)/100,P=(r="")=>new DOMParser().parseFromString(String(r),"text/html").body.textContent||"",K=class extends m{get level(){return this.config.level||1}get opts(){let t=St[this.level];return{attempts:this.config.attempts??t.attempts,feedback:this.config.feedback??t.feedback}}get steps(){return this.config.steps||{}}maxScore(){return this.config.points??this.level}initialState(){return{attemptsUsed:0,best:0,exhausted:!1,run:null,last:null}}result(){let t=this.state;return{score:O(t.best*this.maxScore()),complete:t.attemptsUsed>0||!!t.carried,exhausted:t.exhausted}}computeVars(t){let e={},s=window.LX&&window.LX.uid||"anon";for(let[i,o]of Object.entries(this.config.vars||{}))e[i]=o[m.seededOrder(o.length,`${this.id}:${s}:${t}:${i}`)[0]];return e}t(t){return typeof t!="string"?t:t.replace(/\{\{(\w+)\}\}/g,(e,s)=>(this._vars&&this._vars[s])??e)}rich(t){return g(this.t(t||""))}choiceOrder(t,e){let s=this.steps[t].choices.length,i=window.LX&&window.LX.uid||"anon";return m.seededOrder(s,`${this.id}:${i}:${e}:${t}`)}start(){this.setState({run:{attempt:this.state.attemptsUsed,step:this.config.start,path:[],evidence:[],flags:[],visited:[this.config.start],pending:null,shown:1,stopped:null}})}patchRun(t){this.setState({run:{...this.state.run,...t}})}budgetUsed(t=this.state.run){let e=this.allEvidence();return t.evidence.reduce((s,i)=>s+(e[i]?.cost??1),0)}allEvidence(){let t={};for(let e of Object.values(this.steps))for(let s of e.evidence||[])t[s.id]={cost:1,...s};return t}gather(t){let e=this.state.run;e.evidence.includes(t.id)||e.pending||this.config.budget-this.budgetUsed()<(t.cost??1)||this.patchRun({evidence:[...e.evidence,t.id]})}choose(t){let e=this.state.run,s=this.steps[e.step].choices[t],i=s.rating,o=!1;(s.needs||[]).some(u=>!e.evidence.includes(u))&&(i=Ae[i],o=i!==s.rating);let n={step:e.step,choice:t,rating:i,downgraded:o},c=[...new Set([...e.flags,...s.sets||[]])],l={rating:i,downgraded:o,explain:s.explain,consequence:s.consequence,go:s.end?null:s.next},p=this.opts.feedback==="step"||s.consequence;this.patchRun({path:[...e.path,n],flags:c,pending:l}),p||this.advance()}nextLine(){let t=this.state.run,e=this.steps[t.step].stream.lines;t.pending||(t.shown>=e.length?this.evaluateStream(null):this.patchRun({shown:t.shown+1}))}stopAgent(){let t=this.state.run;t.pending||this.evaluateStream(t.shown-1)}evaluateStream(t){let e=this.state.run,s=this.steps[e.step].stream,i=s.lines.findIndex(l=>l.red),o;t===null?o="missed":t<i?o="early":t<=i+1?o="onTime":t<=i+3?o="late":o="missed";let n=o==="missed"?s.missRating||"critical":Ee[o],c=s.outcomes&&s.outcomes[o]||Ce[o];this.patchRun({stopped:t,path:[...e.path,{step:e.step,stream:o,at:t,rating:n}],pending:{rating:n,consequence:c,go:s.end?null:s.next,stream:!0}})}advance(){let t=this.state.run,e=t.pending?.go;if(!e)return this.finish();let s=typeof e=="string"?e:t.flags.includes(e.if)?e.then:e.else;this.patchRun({step:s,pending:null,shown:1,stopped:null,visited:[...t.visited,s]})}finish(){let t=this.state.run,e=this.allEvidence(),s=t.path.map(v=>Se[v.rating]),i=s.length?s.reduce((v,N)=>v+N,0)/s.length:0,o=t.visited.flatMap(v=>(this.steps[v].evidence||[]).map(N=>N.id)),n=o.filter(v=>e[v].key),c=n.length?n.filter(v=>t.evidence.includes(v)).length/n.length:1,l=t.evidence.filter(v=>!e[v].key).reduce((v,N)=>v+(e[N].cost??1),0),p=this.config.budget?Math.max(0,1-l/this.config.budget):1,u=o.length>0,h=u?.6*i+.25*c+.15*p:i,f=t.path.some(v=>v.rating==="critical");f&&(h=Math.min(h,At)),h=O(h);let $=this.state.attemptsUsed+1,C=this.opts.attempts;this.setState({attemptsUsed:$,best:Math.max(this.state.best,h),exhausted:C>0&&$>=C,run:null,last:{...t,final:h,dims:{decisions:O(i),process:O(c),efficiency:O(p),investigative:u,critical:f}}}),this.updateComplete.then(()=>this.renderRoot.querySelector(".score")?.scrollIntoView({block:"nearest",behavior:"smooth"}))}updated(){clearTimeout(this._timer);let t=this.state?.run;if(!t||t.pending)return;let e=this.steps[t.step];if(!e?.stream)return;(e.stream.autoplay??St[this.level].autoplay)&&(this._timer=setTimeout(()=>this.nextLine(),e.stream.speed||1800))}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this._timer)}renderHead(){return a`<div class="head">
      <span class="lvl lvl-${this.level}">Level ${this.level}</span>
      <span class="eyebrow" style="margin:0">Decision scenario ${this.graded?a`<span class="graded">· ${this.maxScore()} pt</span>`:d}</span>
    </div>
    <h3>${g(this.config.title||"")}</h3>`}renderIntro(){let{attempts:t,feedback:e}=this.opts,s=this.state.attemptsUsed;return a`${this.config.intro?a`<p>${this.rich(this.config.intro)}</p>`:d}
      <ul class="rules">
        <li>${e==="step"?"You get feedback after every decision.":"Feedback only at the end \u2014 like in real life."}</li>
        <li>${t===0?"Unlimited attempts; your best result counts.":`${t} attempt${t>1?"s":""}${s?` (${s} used)`:""}; your best result counts.`}</li>
        ${this.config.budget?a`<li>You can investigate before deciding — but only <strong>${this.config.budget}</strong> actions in total. Choose what is worth checking.</li>`:d}
        <li>Critical mistakes cap the result at ${At*100}%.</li>
      </ul>
      <div class="actions"><button class="btn-primary" @click=${this.start}>Start scenario</button></div>`}renderEvidence(t,e){if(!t.evidence?.length)return d;let s=this.config.budget-this.budgetUsed(e),i=this.allEvidence(),o=e.evidence.filter(n=>t.evidence.some(c=>c.id===n)||i[n]);return a`<div class="evidence">
      <div class="evidence-head">
        <strong>Investigate first?</strong>
        <span class="budget" aria-label="${s} actions left">
          ${Array.from({length:this.config.budget},(n,c)=>a`<span class="dot ${c<this.config.budget-s?"used":""}"></span>`)}
          <span>${s} left</span>
        </span>
      </div>
      <div class="actions-ev">
        ${t.evidence.map(n=>a`<button class="ev-btn" ?disabled=${e.evidence.includes(n.id)||s<(n.cost??1)||!!e.pending}
            @click=${()=>this.gather(n)}>${e.evidence.includes(n.id)?"\u2713 ":"\u25B8 "}${this.rich(n.label)}${(n.cost??1)>1?` (${n.cost})`:""}</button>`)}
      </div>
      ${o.filter(n=>t.evidence.some(c=>c.id===n)).map(n=>{let c=t.evidence.find(l=>l.id===n);return a`<div class="ev-label">$ ${P(this.t(c.label))}</div><pre>${this.t(c.output)}</pre>`})}
    </div>`}renderPending(t){let e=this.opts.feedback==="step",s=e?t.rating:"neutral";return a`<div class="pending ${s}" role="status">
        ${e?a`<p><span class="rating ${t.rating}">${t.rating}</span>${t.downgraded?a` <span class="muted">— right idea, but you acted without checking the evidence first</span>`:d}</p>`:d}
        ${t.consequence?a`<p>${this.rich(t.consequence)}</p>`:d}
        ${e&&t.explain?a`<p class="muted">${this.rich(t.explain)}</p>`:d}
      </div>
      <div class="actions"><button class="btn-primary" @click=${this.advance}>${t.go?"Continue \u2192":"See results"}</button></div>`}renderStep(){let t=this.state.run,e=this.steps[t.step],s=Object.entries(e.extra||{}).filter(([i])=>t.flags.includes(i));return a`<div class="stepno">Step ${t.path.length+1}${e.title?` \xB7 ${P(this.t(e.title))}`:""}</div>
      <div class="situation">
        <p>${this.rich(e.situation)}</p>
        ${s.map(([,i])=>a`<div class="extra">${this.rich(i)}</div>`)}
      </div>
      ${e.ending?a`<div class="actions"><button class="btn-primary" @click=${this.finish}>See results</button></div>`:e.stream?this.renderStream(e,t):a`${this.renderEvidence(e,t)}
              ${t.pending?this.renderPending(t.pending):a`<div class="choices" role="group" aria-label="Your decision">
                    ${this.choiceOrder(t.step,t.attempt).map(i=>a`<button class="choice" @click=${()=>this.choose(i)}>${this.rich(e.choices[i].text)}</button>`)}
                  </div>`}`}`}renderStream(t,e){let s=t.stream,i=s.lines.slice(0,e.stopped!==null?e.stopped+1:e.shown),o=s.autoplay??St[this.level].autoplay;return a`<p class="muted">Watch the agent work. Stop it the moment something goes wrong — not earlier, not later.</p>
      <div class="stream" aria-live="polite">
        ${i.map((n,c)=>a`<div class="ln ${e.pending&&n.red&&c<=(e.stopped??99)?"redmark":""}">${this.rich(n.text)}</div>`)}
      </div>
      ${e.pending?this.renderPending(e.pending):a`<div class="actions">
            <button class="stop" @click=${this.stopAgent}>✋ Stop the agent</button>
            ${o?a`<span class="muted">The agent keeps going…</span>`:a`<button class="btn-ghost" @click=${this.nextLine}>${e.shown>=s.lines.length?"Let it finish":"Next step \u25B8"}</button>`}
          </div>`}`}renderDebrief(){let t=this.state.last,e=t.dims,s=this.allEvidence(),{attempts:i}=this.opts,o=i===0||this.state.attemptsUsed<i,n=l=>`${Math.round(l*100)}%`,c=t.visited.flatMap(l=>(this.steps[l].evidence||[]).map(p=>p.id));return a`<div class="score" role="status"><b>${n(t.final)}</b>
        <span class="muted">this attempt · best ${n(this.state.best)}${this.graded?` \xB7 ${O(this.state.best*this.maxScore())} / ${this.maxScore()} pt`:""}</span></div>
      ${e.critical?a`<div class="cap">A critical decision capped this attempt at ${At*100}%.</div>`:d}
      <div class="dims">
        <div class="dim"><strong>${n(e.decisions)}</strong>Decision quality</div>
        ${e.investigative?a`<div class="dim"><strong>${n(e.process)}</strong>Key evidence checked</div>
              <div class="dim"><strong>${n(e.efficiency)}</strong>Efficiency (no wasted actions)</div>`:d}
      </div>
      <h4>Your path vs. the expert</h4>
      <ol class="path">
        ${t.path.map(l=>{let p=this.steps[l.step];if(l.stream){let f=p.stream.lines.findIndex($=>$.red);return a`<li>
              <div class="title">${p.title?this.rich(p.title):"Watching the agent"}</div>
              <div class="row"><span class="rating ${l.rating}">${l.rating}</span>
                ${l.at===null||l.stream==="missed"?" You did not stop the agent in time.":` You stopped at line ${l.at+1}.`}</div>
              <div class="expert">Expert: stop at line ${f+1} — “${P(this.t(p.stream.lines[f].text))}”</div>
            </li>`}let u=p.choices[l.choice],h=p.choices.find(f=>f.rating==="optimal");return a`<li>
            <div class="title">${p.title?this.rich(p.title):P(this.t(p.situation)).slice(0,90)+"\u2026"}</div>
            <div class="row"><span class="rating ${l.rating}">${l.rating}</span> ${this.rich(u.text)}
              ${l.downgraded?a`<span class="muted"> (downgraded: you didn't check ${u.needs.map(f=>P(this.t(s[f].label))).join(", ")} first)</span>`:d}</div>
            ${u.explain?a`<div class="why">${this.rich(u.explain)}</div>`:d}
            ${h&&h!==u?a`<div class="expert">Expert: ${this.rich(h.text)}${h.explain?a` — ${this.rich(h.explain)}`:d}</div>`:d}
          </li>`})}
      </ol>
      ${c.length?a`<h4>Investigation</h4>
          <ul class="evlist">
            ${c.map(l=>{let p=s[l],u=t.evidence.includes(l),h=p.key?u?"\u2713 key evidence checked":"\u2717 key evidence missed":u?"\xB7 checked (not essential)":"\xB7 skipped (fine)";return a`<li><code>${P(this.t(p.label))}</code> — ${h}</li>`})}
          </ul>`:d}
      <div class="actions">
        ${o?a`<button class="btn-primary" @click=${this.start}>Try again${i?` (${i-this.state.attemptsUsed} left)`:""}</button>`:a`<span class="muted">No attempts left — your best result counts.</span>`}
      </div>`}renderWidget(){let t=this.state,e=t.run?t.run.attempt:t.last?t.last.attempt:t.attemptsUsed;return this._vars=this.computeVars(e),a`<section class="card" aria-label=${P(this.config.title||"Scenario")}>
      ${this.renderHead()}
      ${this.renderNotice()}
      ${t.run?this.renderStep():t.last?this.renderDebrief():this.renderIntro()}
    </section>`}};x(K,"graded",!0),x(K,"styles",[y,b`
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
    `]);customElements.define("lx-scenario",K);var Te={1:{attempts:0,severity:!1,showCount:!0},2:{attempts:2,severity:!0,showCount:!1},3:{attempts:1,severity:!0,showCount:!1}},Me=["critical","major","minor"],Le=.34,Pe=.6,te=r=>Math.round(r*100)/100,J=class extends m{get level(){return this.config.level||1}get opts(){let t=Te[this.level];return{attempts:this.config.attempts??t.attempts,severity:this.config.severity??t.severity,showCount:this.config.showCount??t.showCount}}get lines(){return(this.config.code||"").replace(/\n$/,"").split(`
`)}maxScore(){return this.config.points??this.level}initialState(){return{attemptsUsed:0,best:0,exhausted:!1,marks:{},submitted:null}}result(){return{score:te(this.state.best*this.maxScore()),complete:this.state.attemptsUsed>0||!!this.state.carried,exhausted:this.state.exhausted}}issueAt(t){return this.config.issues.findIndex(e=>t>=e.line&&t<=(e.to??e.line))}toggle(t){if(this.state.submitted)return;let e={...this.state.marks};e[t]?delete e[t]:e[t]=this.opts.severity?"":"flag",this.setState({marks:e})}setSeverity(t,e){this.setState({marks:{...this.state.marks,[t]:e}})}grade(){let t=this.config.issues,e=this.state.marks,s=new Map,i=[];for(let l of Object.keys(e)){let p=Number(l),u=this.issueAt(p);u<0?i.push(p):s.has(u)||s.set(u,p)}let o=0,n=t.map((l,p)=>{if(!s.has(p))return{found:!1};let u=e[s.get(p)],h=!this.opts.severity||u===l.severity;return o+=h?1:Pe,{found:!0,sev:u,sevOk:h,line:s.get(p)}});return{fraction:te(Math.max(0,Math.min(1,(o-i.length*Le)/t.length))),perIssue:n,falseLines:i}}submit(){let t=this.grade(),e=this.state.attemptsUsed+1,s=this.opts.attempts;this.setState({submitted:t,attemptsUsed:e,best:Math.max(this.state.best,t.fraction),exhausted:s>0&&e>=s})}retry(){this.setState({marks:{},submitted:null})}lineClass(t,e){let s=this.config.view,i=["ln"];s==="diff"&&e.startsWith("+")&&i.push("add"),s==="diff"&&e.startsWith("-")&&i.push("del");let o=this.state.submitted;if(!o)return this.state.marks[t]!==void 0&&i.push("flagged"),i.join(" ");let n=this.issueAt(t);return o.falseLines.includes(t)?i.push("false"):n>=0&&o.perIssue[n].found&&o.perIssue[n].line===t?i.push("found"):n>=0&&!o.perIssue[n].found&&t===this.config.issues[n].line&&i.push("missed"),i.join(" ")}lineTag(t){let e=this.state.submitted;if(!e)return this.state.marks[t]!==void 0?a`<span class="tag flag">flagged</span>`:d;let s=this.issueAt(t);return e.falseLines.includes(t)?a`<span class="tag bad">false alarm</span>`:s>=0&&e.perIssue[s].found&&e.perIssue[s].line===t?a`<span class="tag ok">${e.perIssue[s].sevOk?"found":"found \xB7 wrong severity"}</span>`:s>=0&&!e.perIssue[s].found&&t===this.config.issues[s].line?a`<span class="tag miss">missed</span>`:d}renderReport(t){let e=this.config.decoys||[],{attempts:s}=this.opts,i=s===0||this.state.attemptsUsed<s,o=t.perIssue.filter(n=>n.found).length;return a`<div class="score" role="status"><b>${Math.round(t.fraction*100)}%</b>
        <span class="muted">${o} of ${this.config.issues.length} found · ${t.falseLines.length} false alarm${t.falseLines.length===1?"":"s"} · best ${Math.round(this.state.best*100)}%</span></div>
      <ul class="report">
        ${this.config.issues.map((n,c)=>{let l=t.perIssue[c];return a`<li>
            <span class="rating ${l.found?l.sevOk?"optimal":"acceptable":"critical"}">${l.found?(l.sevOk,"found"):"missed"}</span>
            <strong>Line ${n.line}${n.to?`\u2013${n.to}`:""}: ${g(n.label)}</strong>
            <span class="rating ${n.severity==="critical"?"critical":n.severity==="major"?"risky":"acceptable"}">${n.severity}</span>
            ${l.found&&!l.sevOk?a`<span class="muted">You rated it “${l.sev||"\u2014"}”.</span>`:d}
            <span class="muted">${g(n.explain)}</span>
          </li>`})}
        ${t.falseLines.map(n=>{let c=e.find(l=>l.line===n);return a`<li><span class="rating risky">false alarm</span> <strong>Line ${n}</strong>
            <span class="muted">${c?g(c.explain):"Nothing wrong here."}</span></li>`})}
      </ul>
      <div class="actions">
        ${i?a`<button class="btn-primary" @click=${this.retry}>Try again${s?` (${s-this.state.attemptsUsed} left)`:""}</button>`:a`<span class="muted">No attempts left — your best result counts.</span>`}
      </div>`}renderWidget(){let{severity:t,showCount:e,attempts:s}=this.opts,i=this.state.submitted,o=Object.keys(this.state.marks).map(Number).sort((c,l)=>c-l),n=t&&o.some(c=>!this.state.marks[c]);return a`<section class="card" aria-label=${new DOMParser().parseFromString(this.config.title||"Spot the problems","text/html").body.textContent}>
      <div class="head">
        <span class="lvl lvl-${this.level}">Level ${this.level}</span>
        <span class="eyebrow" style="margin:0">Spot the problems ${this.graded?a`<span class="graded">· ${this.maxScore()} pt</span>`:d}</span>
      </div>
      <h3>${g(this.config.title||"")}</h3>
      ${this.renderNotice()}
      <p>${g(this.config.prompt||"")}</p>
      <p class="muted">
        Click every line that is a problem${t?", then rate how serious it is":""}.
        ${e?g(this.config.issues.length===1?"There is <b>1</b> problem.":`There are <b>${this.config.issues.length}</b> problems.`):"The number of problems is not revealed."}
        False alarms cost points. ${s===0?"Unlimited attempts.":`${s} attempt${s>1?"s":""}.`}
      </p>
      ${this.config.filename?a`<div class="file">${this.config.filename}</div>`:d}
      <div class="code ${this.config.filename?"":"nofile"}" role="list">
        ${this.lines.map((c,l)=>{let p=l+1;return a`<button class=${this.lineClass(p,c)} role="listitem" ?disabled=${!!i}
            aria-pressed=${this.state.marks[p]!==void 0} aria-label="Line ${p}: ${c}" @click=${()=>this.toggle(p)}>
            <span class="num">${p}</span><span class="txt">${c||" "}</span>${this.lineTag(p)}
          </button>`})}
      </div>
      ${!i&&t&&o.length?a`<div class="sev">${o.map(c=>a`<div class="sev-row" style="width:100%">
              <code>line ${c}</code>
              <select aria-label="Severity for line ${c}" .value=${this.state.marks[c]} @change=${l=>this.setSeverity(c,l.target.value)}>
                <option value="">severity…</option>
                ${Me.map(l=>a`<option value=${l} ?selected=${this.state.marks[c]===l}>${l}</option>`)}
              </select>
            </div>`)}</div>`:d}
      ${i?this.renderReport(i):a`<div class="actions">
            <button class="btn-primary" ?disabled=${!o.length||n} @click=${this.submit}>Submit review</button>
            ${n?a`<span class="muted">Rate the severity of every flagged line.</span>`:d}
          </div>`}
    </section>`}};x(J,"graded",!0),x(J,"styles",[y,b`
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
    `]);customElements.define("lx-spot",J);
