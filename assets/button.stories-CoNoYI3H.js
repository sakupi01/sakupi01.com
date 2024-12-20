import{j as F}from"./jsx-runtime-DEdD30eg.js";import{c as H}from"./clsx-B-dksMZM.js";import"./index-RYns6xqu.js";function G(t){var r,e,n="";if(typeof t=="string"||typeof t=="number")n+=t;else if(typeof t=="object")if(Array.isArray(t))for(r=0;r<t.length;r++)t[r]&&(e=G(t[r]))&&(n&&(n+=" "),n+=e);else for(r in t)t[r]&&(n&&(n+=" "),n+=r);return n}function J(){for(var t,r,e=0,n="";e<arguments.length;)(t=arguments[e++])&&(r=G(t))&&(n&&(n+=" "),n+=r);return n}const x=t=>typeof t=="boolean"?"".concat(t):t===0?"0":t,f=J,L=(t,r)=>e=>{var n;if((r==null?void 0:r.variants)==null)return f(t,e==null?void 0:e.class,e==null?void 0:e.className);const{variants:d,defaultVariants:o}=r,K=Object.keys(d).map(s=>{const a=e==null?void 0:e[s],u=o==null?void 0:o[s];if(a===null)return null;const i=x(a)||x(u);return d[s][i]}),p=e&&Object.entries(e).reduce((s,a)=>{let[u,i]=a;return i===void 0||(s[u]=i),s},{}),U=r==null||(n=r.compoundVariants)===null||n===void 0?void 0:n.reduce((s,a)=>{let{class:u,className:i,...W}=a;return Object.entries(W).every($=>{let[h,y]=$;return Array.isArray(y)?y.includes({...o,...p}[h]):{...o,...p}[h]===y})?[...s,u,i]:s},[]);return f(t,K,U,e==null?void 0:e.class,e==null?void 0:e.className)},M=L("button",{variants:{intent:{primary:["bg-button-primary","text-base","border-none","rounded-md","hover:bg-button-primary-hover","hover:text-white"],secondary:["bg-button-secondary","text-base","border-basic","rounded-md","hover:bg-button-secondary-hover","hover:text-white"],subtle:["bg-button-subtle","text-base","border-basic","rounded-md","hover:bg-button-subtle-hover","hover:text-white"],ghost:["bg-button-ghost","text-base","border-basic","rounded-md","hover:bg-button-ghost-hover","hover:text-white"],"square-icon":["bg-primary-subtle","text-tag","border-none","rounded-md","hover:bg-primary"],"round-icon":["bg-primary-subtle","text-tag","border-none","rounded-full","hover:bg-primary"]},size:{small:["text-sm","py-1","px-2"],medium:["text-base","py-2","px-4"],square:["text-base","py-2","px-2"],round:["text-base","py-2","px-2"]}},defaultVariants:{intent:"primary",size:"medium"}}),T=({children:t,intent:r,size:e,className:n,onClick:d,...o})=>F.jsx("button",{type:"button",className:H(M({intent:r,size:e}),n,"transition-all duration-400 ease-in-out"),onClick:d,...o,children:t});T.__docgenInfo={description:"",methods:[],displayName:"Button",composes:["VariantProps"]};const Z={title:"Button",component:T,tags:["autodocs"],parameters:{layout:"fullscreen"},argTypes:{}},c={args:{intent:"primary",size:"medium"}},m={args:{intent:"secondary",size:"medium"}},l={args:{intent:"subtle",size:"medium"}},b={args:{intent:"ghost",size:"medium"}},g={args:{intent:"square-icon",size:"square",children:"🌟"}},v={args:{intent:"round-icon",size:"square",children:"🌟"}};var z,S,q;c.parameters={...c.parameters,docs:{...(z=c.parameters)==null?void 0:z.docs,source:{originalSource:`{
  args: {
    intent: "primary",
    size: "medium"
  }
}`,...(q=(S=c.parameters)==null?void 0:S.docs)==null?void 0:q.source}}};var N,V,j;m.parameters={...m.parameters,docs:{...(N=m.parameters)==null?void 0:N.docs,source:{originalSource:`{
  args: {
    intent: "secondary",
    size: "medium"
  }
}`,...(j=(V=m.parameters)==null?void 0:V.docs)==null?void 0:j.source}}};var C,I,O;l.parameters={...l.parameters,docs:{...(C=l.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    intent: "subtle",
    size: "medium"
  }
}`,...(O=(I=l.parameters)==null?void 0:I.docs)==null?void 0:O.source}}};var w,A,_;b.parameters={...b.parameters,docs:{...(w=b.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    intent: "ghost",
    size: "medium"
  }
}`,...(_=(A=b.parameters)==null?void 0:A.docs)==null?void 0:_.source}}};var k,B,P;g.parameters={...g.parameters,docs:{...(k=g.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    intent: "square-icon",
    size: "square",
    children: "🌟"
  }
}`,...(P=(B=g.parameters)==null?void 0:B.docs)==null?void 0:P.source}}};var R,D,E;v.parameters={...v.parameters,docs:{...(R=v.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    intent: "round-icon",
    size: "square",
    children: "🌟"
  }
}`,...(E=(D=v.parameters)==null?void 0:D.docs)==null?void 0:E.source}}};const ee=["Default","Secondary","Subtle","Ghost","SquareIcon","RoundIcon"];export{c as Default,b as Ghost,v as RoundIcon,m as Secondary,g as SquareIcon,l as Subtle,ee as __namedExportsOrder,Z as default};
