import{j as t}from"./jsx-runtime-DEdD30eg.js";import{D as g}from"./divider-CEoC2itV.js";import{r as d}from"./index-RYns6xqu.js";import"./clsx-B-dksMZM.js";function b(){const r=d.useRef();d.useEffect(()=>{const e=document.querySelectorAll("h2, h3, h4"),n=document.querySelectorAll(".toc ul li a"),s=Array.from(e),x=Array.from(n),y=o=>{var i;for(const c of o){const v=s.indexOf(c.target),l=document.querySelector(".is-active");c.isIntersecting&&(l!==null&&l.classList.remove("is-active"),(i=x[v])==null||i.classList.add("is-active"))}};r.current=new IntersectionObserver(y,{rootMargin:"0px 0px -100% 0px",threshold:0});for(const o of e)r.current.observe(o);return()=>{var o;return(o=r.current)==null?void 0:o.disconnect()}},[])}const h=({nodes:r,githubLink:e,backToTopLink:n,tocIcon:s})=>r!=null&&r.length?t.jsxs("div",{className:`hidden md:block w-[60px] h-[60px] fixed left-8 
    transition-all ease-out duration-[0.5s]
    origin-top-left
    has-[:hover]:w-[250px] has-[:hover]:h-[85vh]
    [&>.menu]:has-[:hover]:visible [&>.menu]:has-[:hover]:opacity-100 
    [&>.menu]:has-[:hover]:delay-[0.4s]
     [&>.menu-icon]:has-[:hover]:text-blossom 
     rounded-full border border-neutral-200 shadow-sm`,children:[t.jsx("div",{className:`menu-icon p-2 md:p-3 rounded-full transition-all duration-[0.3s] ease-in-out 
      flex items-center justify-center`,children:s}),t.jsxs("div",{className:"menu p-4 max-w-[250px] md:flex flex-col gap-2 sticky top-2 hidden opacity-0",children:[t.jsx("div",{className:"toc",children:f(r)}),t.jsx(g,{}),e&&e,n]})]}):null;function f(r){return t.jsx("ul",{className:"list-none pl-2",children:r.map(e=>{var n;return t.jsxs("li",{children:[T({node:e}),((n=e.children)==null?void 0:n.length)>0&&e.depth<3&&f(e.children)]},e.data.hProperties.id)})})}const T=({node:r})=>{const e=r.data.hProperties.id;return b(),t.jsx("button",{type:"button",onClick:n=>{n.preventDefault();const s=document.getElementById(e);s==null||s.scrollIntoView({behavior:"smooth",block:"start"})},children:t.jsx("a",{href:`#${e}`,children:r.value})})};h.__docgenInfo={description:"",methods:[],displayName:"Toc",props:{nodes:{required:!0,tsType:{name:"Array",elements:[{name:"any"}],raw:"any[]"},description:""},githubLink:{required:!1,tsType:{name:"ReactNode"},description:""},backToTopLink:{required:!0,tsType:{name:"ReactNode"},description:""},tocIcon:{required:!0,tsType:{name:"ReactNode"},description:""}}};const L={title:"Toc",component:h,tags:["autodocs"],parameters:{layout:"fullscreen"},argTypes:{}},a={args:{nodes:[],githubLink:null,backToTopLink:null}};var u,m,p;a.parameters={...a.parameters,docs:{...(u=a.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    nodes: [],
    githubLink: null,
    backToTopLink: null
  }
}`,...(p=(m=a.parameters)==null?void 0:m.docs)==null?void 0:p.source}}};const q=["Default"];export{a as Default,q as __namedExportsOrder,L as default};
