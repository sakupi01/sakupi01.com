import{j as e}from"./jsx-runtime-Cf8x2fCZ.js";import{s as i}from"./parse-tokens-12AbnvOx.js";import"./index-yBjzXJbu.js";const ne={title:"Design Tokens/Semantic",parameters:{layout:"fullscreen"}},r=({token:n,label:t})=>e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"1rem",marginBottom:"0.5rem"},children:[e.jsx("div",{style:{width:"80px",height:"80px",backgroundColor:`var(${n})`,border:"1px solid #ccc",borderRadius:"4px"}}),e.jsxs("div",{children:[e.jsx("div",{style:{fontWeight:"600",fontSize:"0.875rem"},children:t}),e.jsx("code",{style:{fontSize:"0.75rem",color:"#666"},children:n})]})]}),o=({token:n,label:t})=>e.jsxs("div",{style:{marginBottom:"1rem"},children:[e.jsx("div",{style:{fontSize:"0.875rem",fontWeight:"600",marginBottom:"0.25rem"},children:t}),e.jsxs("div",{style:{color:`var(${n})`,fontSize:"1rem"},children:["Sample text using ",n]}),e.jsx("code",{style:{fontSize:"0.75rem",color:"#666"},children:n})]}),s={render:()=>e.jsxs("div",{style:{padding:"2rem",maxWidth:"1200px"},children:[e.jsx("h1",{style:{marginBottom:"2rem"},children:"Semantic Colors: Surfaces & Backgrounds"}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))",gap:"2rem"},children:[e.jsxs("div",{children:[e.jsx("h2",{style:{marginBottom:"1rem"},children:"Main Surfaces"}),e.jsx(r,{token:"--s-color-surface-base",label:"Base Surface"}),e.jsx(r,{token:"--s-color-surface-raised",label:"Raised Surface"}),e.jsx(r,{token:"--s-color-surface-overlay",label:"Overlay Surface"})]}),e.jsxs("div",{children:[e.jsx("h2",{style:{marginBottom:"1rem"},children:"Interactive Surfaces"}),e.jsx(r,{token:"--s-color-surface-interactive",label:"Interactive"}),e.jsx(r,{token:"--s-color-surface-interactive-hover",label:"Interactive Hover"})]})]})]})},a={render:()=>e.jsxs("div",{style:{padding:"2rem",maxWidth:"1200px"},children:[e.jsx("h1",{style:{marginBottom:"2rem"},children:"Semantic Colors: Text"}),e.jsx(o,{token:"--s-color-text-primary",label:"Primary Text"}),e.jsx(o,{token:"--s-color-text-secondary",label:"Secondary Text"}),e.jsx(o,{token:"--s-color-text-tertiary",label:"Tertiary Text"}),e.jsx(o,{token:"--s-color-text-disabled",label:"Disabled Text"}),e.jsx(o,{token:"--s-color-text-inverse",label:"Inverse Text"})]})},d={render:()=>e.jsxs("div",{style:{padding:"2rem",maxWidth:"1200px"},children:[e.jsx("h1",{style:{marginBottom:"2rem"},children:"Semantic Colors: Interactive"}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))",gap:"2rem"},children:[e.jsxs("div",{children:[e.jsx("h2",{style:{marginBottom:"1rem"},children:"Primary"}),e.jsx(r,{token:"--s-color-primary",label:"Primary"}),e.jsx(r,{token:"--s-color-primary-hover",label:"Primary Hover"}),e.jsx(r,{token:"--s-color-primary-active",label:"Primary Active"})]}),e.jsxs("div",{children:[e.jsx("h2",{style:{marginBottom:"1rem"},children:"Links"}),e.jsx(r,{token:"--s-color-link",label:"Link"}),e.jsx(r,{token:"--s-color-link-hover",label:"Link Hover"}),e.jsx(r,{token:"--s-color-link-visited",label:"Link Visited"})]}),e.jsxs("div",{children:[e.jsx("h2",{style:{marginBottom:"1rem"},children:"Focus"}),e.jsx(r,{token:"--s-color-focus",label:"Focus"})]})]})]})},l={render:()=>e.jsxs("div",{style:{padding:"2rem",maxWidth:"1200px"},children:[e.jsx("h1",{style:{marginBottom:"2rem"},children:"Semantic Colors: Feedback & Status"}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(250px, 1fr))",gap:"2rem"},children:[e.jsxs("div",{children:[e.jsx("h2",{style:{marginBottom:"1rem"},children:"Message"}),e.jsx(r,{token:"--s-color-message",label:"Message"}),e.jsx(r,{token:"--s-color-message-bg",label:"Message Background"}),e.jsx(r,{token:"--s-color-message-text",label:"message Text"})]}),e.jsxs("div",{children:[e.jsx("h2",{style:{marginBottom:"1rem"},children:"Warning"}),e.jsx(r,{token:"--s-color-warning",label:"Warning"}),e.jsx(r,{token:"--s-color-warning-bg",label:"Warning Background"}),e.jsx(r,{token:"--s-color-warning-text",label:"Warning Text"})]}),e.jsxs("div",{children:[e.jsx("h2",{style:{marginBottom:"1rem"},children:"Memo"}),e.jsx(r,{token:"--s-color-memo",label:"Memo"}),e.jsx(r,{token:"--s-color-memo-bg",label:"Memo Background"}),e.jsx(r,{token:"--s-color-memo-text",label:"Memo Text"})]}),e.jsxs("div",{children:[e.jsx("h2",{style:{marginBottom:"1rem"},children:"Info"}),e.jsx(r,{token:"--s-color-info",label:"Info"}),e.jsx(r,{token:"--s-color-info-bg",label:"Info Background"}),e.jsx(r,{token:"--s-color-info-text",label:"Info Text"})]})]})]})},m={render:()=>e.jsxs("div",{style:{padding:"2rem",maxWidth:"1200px"},children:[e.jsx("h1",{style:{marginBottom:"2rem"},children:"Semantic Colors: Borders"}),e.jsx(r,{token:"--s-color-border-subtle",label:"Subtle Border"}),e.jsx(r,{token:"--s-color-border-default",label:"Default Border"}),e.jsx(r,{token:"--s-color-border-strong",label:"Strong Border"})]})},c={render:()=>e.jsxs("div",{style:{padding:"2rem",maxWidth:"1200px"},children:[e.jsx("h1",{style:{marginBottom:"2rem"},children:"Semantic Typography"}),e.jsxs("div",{style:{display:"grid",gap:"3rem"},children:[e.jsxs("div",{children:[e.jsx("h2",{style:{marginBottom:"1rem"},children:"Font Sizes"}),e.jsx("div",{style:{fontSize:"var(--s-font-size-xs)"},children:"XS: The quick brown fox (--s-font-size-xs)"}),e.jsx("div",{style:{fontSize:"var(--s-font-size-sm)"},children:"SM: The quick brown fox (--s-font-size-sm)"}),e.jsx("div",{style:{fontSize:"var(--s-font-size-base)"},children:"Base: The quick brown fox (--s-font-size-base)"}),e.jsx("div",{style:{fontSize:"var(--s-font-size-lg)"},children:"LG: The quick brown fox (--s-font-size-lg)"}),e.jsx("div",{style:{fontSize:"var(--s-font-size-xl)"},children:"XL: The quick brown fox (--s-font-size-xl)"}),e.jsx("div",{style:{fontSize:"var(--s-font-size-2xl)"},children:"2XL: The quick brown fox (--s-font-size-2xl)"}),e.jsx("div",{style:{fontSize:"var(--s-font-size-3xl)"},children:"3XL: The quick brown fox (--s-font-size-3xl)"})]}),e.jsxs("div",{children:[e.jsx("h2",{style:{marginBottom:"1rem"},children:"Heading Sizes"}),e.jsx("h1",{style:{fontSize:"var(--s-font-size-h1)",lineHeight:"var(--s-line-height-h1)"},children:"H1 Heading (--s-font-size-h1)"}),e.jsx("h2",{style:{fontSize:"var(--s-font-size-h2)",lineHeight:"var(--s-line-height-h2)"},children:"H2 Heading (--s-font-size-h2)"}),e.jsx("h3",{style:{fontSize:"var(--s-font-size-h3)",lineHeight:"var(--s-line-height-h3)"},children:"H3 Heading (--s-font-size-h3)"}),e.jsx("h4",{style:{fontSize:"var(--s-font-size-h4)",lineHeight:"var(--s-line-height-h4)"},children:"H4 Heading (--s-font-size-h4)"}),e.jsx("h5",{style:{fontSize:"var(--s-font-size-h5)",lineHeight:"var(--s-line-height-h5)"},children:"H5 Heading (--s-font-size-h5)"}),e.jsx("h6",{style:{fontSize:"var(--s-font-size-h6)",lineHeight:"var(--s-line-height-h6)"},children:"H6 Heading (--s-font-size-h6)"})]}),e.jsxs("div",{children:[e.jsx("h2",{style:{marginBottom:"1rem"},children:"Font Weights"}),e.jsx("div",{style:{fontWeight:"var(--s-font-weight-normal)"},children:"Normal Weight (--s-font-weight-normal)"}),e.jsx("div",{style:{fontWeight:"var(--s-font-weight-medium)"},children:"Medium Weight (--s-font-weight-medium)"}),e.jsx("div",{style:{fontWeight:"var(--s-font-weight-semibold)"},children:"Semibold Weight (--s-font-weight-semibold)"}),e.jsx("div",{style:{fontWeight:"var(--s-font-weight-bold)"},children:"Bold Weight (--s-font-weight-bold)"})]})]})]})},h={render:()=>e.jsxs("div",{style:{padding:"2rem",maxWidth:"1200px"},children:[e.jsx("h1",{style:{marginBottom:"2rem"},children:"Semantic Spacing"}),e.jsxs("div",{style:{display:"grid",gap:"3rem"},children:[e.jsxs("div",{children:[e.jsx("h2",{style:{marginBottom:"1rem"},children:"Layout Gaps (Fixed)"}),i.gaps.map(({token:n})=>e.jsxs("div",{style:{marginBottom:"1rem"},children:[e.jsx("code",{style:{fontSize:"0.875rem",marginBottom:"0.5rem",display:"block"},children:n}),e.jsxs("div",{style:{display:"flex",gap:`var(${n})`,padding:"0.5rem",backgroundColor:"#f0f0f0"},children:[e.jsx("div",{style:{width:"50px",height:"50px",backgroundColor:"#4299e1"}}),e.jsx("div",{style:{width:"50px",height:"50px",backgroundColor:"#4299e1"}}),e.jsx("div",{style:{width:"50px",height:"50px",backgroundColor:"#4299e1"}})]})]},n))]}),e.jsxs("div",{children:[e.jsx("h2",{style:{marginBottom:"1rem"},children:"Layout Gaps (Fluid)"}),i.fluidGaps.map(({token:n})=>e.jsxs("div",{style:{marginBottom:"1rem"},children:[e.jsx("code",{style:{fontSize:"0.875rem",marginBottom:"0.5rem",display:"block"},children:n}),e.jsxs("div",{style:{display:"flex",gap:`var(${n})`,padding:"0.5rem",backgroundColor:"#f0f0f0"},children:[e.jsx("div",{style:{width:"50px",height:"50px",backgroundColor:"#48bb78"}}),e.jsx("div",{style:{width:"50px",height:"50px",backgroundColor:"#48bb78"}}),e.jsx("div",{style:{width:"50px",height:"50px",backgroundColor:"#48bb78"}})]})]},n))]}),e.jsxs("div",{children:[e.jsx("h2",{style:{marginBottom:"1rem"},children:"Gutters"}),i.gutters.map(({token:n})=>e.jsxs("div",{style:{marginBottom:"1rem"},children:[e.jsx("code",{style:{fontSize:"0.875rem"},children:n}),e.jsx("div",{style:{padding:`var(${n})`,backgroundColor:"#fbd38d",marginTop:"0.5rem"},children:e.jsx("div",{style:{backgroundColor:"white",padding:"0.5rem"},children:"Content with gutter padding"})})]},n))]})]})]})},g={render:()=>e.jsxs("div",{style:{padding:"2rem",maxWidth:"1200px"},children:[e.jsx("h1",{style:{marginBottom:"2rem"},children:"Semantic Sizing"}),e.jsxs("div",{style:{display:"grid",gap:"3rem"},children:[e.jsxs("div",{children:[e.jsx("h2",{style:{marginBottom:"1rem"},children:"Border Widths"}),e.jsxs("div",{style:{marginBottom:"1rem"},children:[e.jsx("code",{style:{fontSize:"0.875rem"},children:"--s-border-width-thin"}),e.jsx("div",{style:{marginTop:"0.5rem",borderTop:"var(--s-border-width-thin) solid #333",width:"200px"}})]}),e.jsxs("div",{style:{marginBottom:"1rem"},children:[e.jsx("code",{style:{fontSize:"0.875rem"},children:"--s-border-width-base"}),e.jsx("div",{style:{marginTop:"0.5rem",borderTop:"var(--s-border-width-base) solid #333",width:"200px"}})]}),e.jsxs("div",{style:{marginBottom:"1rem"},children:[e.jsx("code",{style:{fontSize:"0.875rem"},children:"--s-border-width-thick"}),e.jsx("div",{style:{marginTop:"0.5rem",borderTop:"var(--s-border-width-thick) solid #333",width:"200px"}})]})]}),e.jsxs("div",{children:[e.jsx("h2",{style:{marginBottom:"1rem"},children:"Border Radius"}),e.jsx("div",{style:{display:"flex",gap:"1rem",flexWrap:"wrap"},children:i.borderRadii.map(({token:n})=>e.jsxs("div",{style:{textAlign:"center"},children:[e.jsx("div",{style:{width:"80px",height:"80px",backgroundColor:"#4299e1",borderRadius:`var(${n})`,marginBottom:"0.5rem"}}),e.jsx("code",{style:{fontSize:"0.75rem"},children:n})]},n))})]}),e.jsxs("div",{children:[e.jsx("h2",{style:{marginBottom:"1rem"},children:"Icon Sizes"}),e.jsx("div",{style:{display:"flex",gap:"2rem",alignItems:"flex-end"},children:i.iconSizes.map(({token:n})=>e.jsxs("div",{style:{textAlign:"center"},children:[e.jsx("div",{style:{width:`var(${n})`,height:`var(${n})`,backgroundColor:"#ed8936",marginBottom:"0.5rem"}}),e.jsx("code",{style:{fontSize:"0.75rem"},children:n})]},n))})]})]})]})},x={render:()=>e.jsxs("div",{style:{padding:"2rem",maxWidth:"1200px"},children:[e.jsx("h1",{style:{marginBottom:"2rem"},children:"Semantic Animations"}),e.jsxs("div",{style:{display:"grid",gap:"3rem"},children:[e.jsxs("div",{children:[e.jsx("h2",{style:{marginBottom:"1rem"},children:"Durations"}),i.durations.map(({token:n})=>{const t=n.replace("--s-duration-","");return e.jsxs("div",{style:{marginBottom:"1rem"},children:[e.jsx("code",{style:{fontSize:"0.875rem",marginRight:"1rem"},children:n}),e.jsx("div",{style:{width:"100px",height:"40px",backgroundColor:"#4299e1",marginTop:"0.5rem",animation:`slide-${t} var(${n}) ease-in-out infinite alternate`}}),e.jsx("style",{children:`
                  @keyframes slide-${t} {
                    from { transform: translateX(0); }
                    to { transform: translateX(200px); }
                  }
                `})]},n)})]}),e.jsxs("div",{children:[e.jsx("h2",{style:{marginBottom:"1rem"},children:"Composite Transitions"}),i.transitions.map(({token:n})=>e.jsxs("div",{style:{marginBottom:"1rem"},children:[e.jsx("code",{style:{fontSize:"0.875rem"},children:n}),e.jsx("div",{style:{width:"100px",height:"40px",backgroundColor:"#48bb78",marginTop:"0.5rem",cursor:"pointer",transition:`transform var(${n})`},onMouseEnter:t=>t.currentTarget.style.transform="translateX(100px)",onMouseLeave:t=>t.currentTarget.style.transform="translateX(0)",children:"Hover me"})]},n))]})]})]})},v={render:()=>e.jsxs("div",{style:{padding:"2rem",maxWidth:"1200px"},children:[e.jsx("h1",{style:{marginBottom:"2rem"},children:"Semantic Effects"}),e.jsxs("div",{style:{display:"grid",gap:"3rem"},children:[e.jsxs("div",{children:[e.jsx("h2",{style:{marginBottom:"1rem"},children:"Shadows"}),e.jsx("div",{style:{display:"flex",gap:"2rem",flexWrap:"wrap"},children:i.shadows.map(({token:n})=>e.jsxs("div",{style:{textAlign:"center"},children:[e.jsx("div",{style:{width:"120px",height:"120px",backgroundColor:"white",boxShadow:`var(${n})`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"0.5rem"},children:"Shadow"}),e.jsx("code",{style:{fontSize:"0.75rem"},children:n})]},n))})]}),e.jsxs("div",{children:[e.jsx("h2",{style:{marginBottom:"1rem"},children:"Focus Ring"}),e.jsx("button",{style:{padding:"0.75rem 1.5rem",backgroundColor:"var(--s-color-primary)",color:"white",border:"none",borderRadius:"var(--s-border-radius-md)",cursor:"pointer"},onFocus:n=>{n.currentTarget.style.outline="var(--s-focus-outline)",n.currentTarget.style.outlineOffset="var(--s-focus-ring-offset)",n.currentTarget.style.boxShadow="var(--s-focus-shadow)"},onBlur:n=>{n.currentTarget.style.outline="none",n.currentTarget.style.boxShadow="none"},children:"Focus me (Tab key)"}),e.jsxs("div",{style:{marginTop:"1rem",fontSize:"0.875rem",color:"#666"},children:[e.jsx("code",{children:"--s-focus-ring-width"}),", ",e.jsx("code",{children:"--s-focus-ring-color"}),", ",e.jsx("code",{children:"--s-focus-ring-offset"})]})]}),e.jsxs("div",{children:[e.jsx("h2",{style:{marginBottom:"1rem"},children:"Interactive States"}),e.jsxs("div",{style:{display:"flex",gap:"2rem"},children:[e.jsxs("div",{children:[e.jsx("div",{style:{marginBottom:"0.5rem",fontSize:"0.875rem"},children:"Hover Opacity"}),e.jsx("div",{style:{width:"100px",height:"100px",backgroundColor:"#4299e1",cursor:"pointer",transition:"opacity 0.2s"},onMouseEnter:n=>n.currentTarget.style.opacity="var(--s-hover-opacity)",onMouseLeave:n=>n.currentTarget.style.opacity="1",children:"Hover"}),e.jsx("code",{style:{fontSize:"0.75rem",display:"block",marginTop:"0.5rem"},children:"--s-hover-opacity"})]}),e.jsxs("div",{children:[e.jsx("div",{style:{marginBottom:"0.5rem",fontSize:"0.875rem"},children:"Active Scale"}),e.jsx("div",{style:{width:"100px",height:"100px",backgroundColor:"#48bb78",cursor:"pointer",transition:"transform 0.1s"},onMouseDown:n=>n.currentTarget.style.transform="scale(var(--s-active-scale))",onMouseUp:n=>n.currentTarget.style.transform="scale(1)",onMouseLeave:n=>n.currentTarget.style.transform="scale(1)",children:"Click"}),e.jsx("code",{style:{fontSize:"0.75rem",display:"block",marginTop:"0.5rem"},children:"--s-active-scale"})]})]})]})]})]})},y={render:()=>e.jsxs("div",{style:{padding:"2rem",maxWidth:"1200px"},children:[e.jsx("h1",{style:{marginBottom:"2rem"},children:"Semantic Layout"}),e.jsxs("div",{style:{display:"grid",gap:"3rem"},children:[e.jsxs("div",{children:[e.jsx("h2",{style:{marginBottom:"1rem"},children:"Z-Index Scale"}),e.jsx("div",{style:{position:"relative",height:"300px",backgroundColor:"#f0f0f0"},children:i.zIndex.map(({token:n,label:t},K)=>{const p=K*20;return e.jsxs("div",{style:{position:"absolute",left:`${p}px`,top:`${p}px`,width:"150px",height:"80px",backgroundColor:"#4299e1",color:"white",padding:"0.5rem",zIndex:`var(${n})`,fontSize:"0.75rem",border:"2px solid white"},children:[e.jsx("div",{style:{fontWeight:"600"},children:t}),e.jsx("code",{style:{fontSize:"0.625rem",color:"#e2e8f0"},children:n})]},n)})})]}),e.jsxs("div",{children:[e.jsx("h2",{style:{marginBottom:"1rem"},children:"Container Widths"}),e.jsx("div",{style:{display:"grid",gap:"0.5rem"},children:i.containers.map(({token:n})=>n.includes("readable")?e.jsxs("div",{children:[e.jsx("code",{style:{fontSize:"0.75rem",marginRight:"0.5rem"},children:n}),e.jsx("div",{style:{maxWidth:`var(${n})`,backgroundColor:"#ed8936",padding:"1rem",marginTop:"0.25rem"},children:e.jsxs("p",{style:{margin:0},children:["Lorem ipsum dolor sit amet, consectetur adipiscing elit. Optimal line length for readability is around 65 characters. This container is limited to that width using ",n,"."]})})]},n):e.jsxs("div",{children:[e.jsx("code",{style:{fontSize:"0.75rem",marginRight:"0.5rem"},children:n}),e.jsx("div",{style:{maxWidth:`var(${n})`,height:"30px",backgroundColor:"#9f7aea",marginTop:"0.25rem"}})]},n))})]})]})]})};var f,u,b;s.parameters={...s.parameters,docs:{...(f=s.parameters)==null?void 0:f.docs,source:{originalSource:`{
  render: () => <div style={{
    padding: "2rem",
    maxWidth: "1200px"
  }}>
      <h1 style={{
      marginBottom: "2rem"
    }}>
        Semantic Colors: Surfaces & Backgrounds
      </h1>
      <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "2rem"
    }}>
        <div>
          <h2 style={{
          marginBottom: "1rem"
        }}>Main Surfaces</h2>
          <ColorSwatch token="--s-color-surface-base" label="Base Surface" />
          <ColorSwatch token="--s-color-surface-raised" label="Raised Surface" />
          <ColorSwatch token="--s-color-surface-overlay" label="Overlay Surface" />
        </div>
        <div>
          <h2 style={{
          marginBottom: "1rem"
        }}>Interactive Surfaces</h2>
          <ColorSwatch token="--s-color-surface-interactive" label="Interactive" />
          <ColorSwatch token="--s-color-surface-interactive-hover" label="Interactive Hover" />
        </div>
      </div>
    </div>
}`,...(b=(u=s.parameters)==null?void 0:u.docs)==null?void 0:b.source}}};var j,k,S;a.parameters={...a.parameters,docs:{...(j=a.parameters)==null?void 0:j.docs,source:{originalSource:`{
  render: () => <div style={{
    padding: "2rem",
    maxWidth: "1200px"
  }}>
      <h1 style={{
      marginBottom: "2rem"
    }}>Semantic Colors: Text</h1>
      <TextSample token="--s-color-text-primary" label="Primary Text" />
      <TextSample token="--s-color-text-secondary" label="Secondary Text" />
      <TextSample token="--s-color-text-tertiary" label="Tertiary Text" />
      <TextSample token="--s-color-text-disabled" label="Disabled Text" />
      <TextSample token="--s-color-text-inverse" label="Inverse Text" />
    </div>
}`,...(S=(k=a.parameters)==null?void 0:k.docs)==null?void 0:S.source}}};var w,z,B;d.parameters={...d.parameters,docs:{...(w=d.parameters)==null?void 0:w.docs,source:{originalSource:`{
  render: () => <div style={{
    padding: "2rem",
    maxWidth: "1200px"
  }}>
      <h1 style={{
      marginBottom: "2rem"
    }}>Semantic Colors: Interactive</h1>
      <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "2rem"
    }}>
        <div>
          <h2 style={{
          marginBottom: "1rem"
        }}>Primary</h2>
          <ColorSwatch token="--s-color-primary" label="Primary" />
          <ColorSwatch token="--s-color-primary-hover" label="Primary Hover" />
          <ColorSwatch token="--s-color-primary-active" label="Primary Active" />
        </div>
        <div>
          <h2 style={{
          marginBottom: "1rem"
        }}>Links</h2>
          <ColorSwatch token="--s-color-link" label="Link" />
          <ColorSwatch token="--s-color-link-hover" label="Link Hover" />
          <ColorSwatch token="--s-color-link-visited" label="Link Visited" />
        </div>
        <div>
          <h2 style={{
          marginBottom: "1rem"
        }}>Focus</h2>
          <ColorSwatch token="--s-color-focus" label="Focus" />
        </div>
      </div>
    </div>
}`,...(B=(z=d.parameters)==null?void 0:z.docs)==null?void 0:B.source}}};var T,C,W;l.parameters={...l.parameters,docs:{...(T=l.parameters)==null?void 0:T.docs,source:{originalSource:`{
  render: () => <div style={{
    padding: "2rem",
    maxWidth: "1200px"
  }}>
      <h1 style={{
      marginBottom: "2rem"
    }}>
        Semantic Colors: Feedback & Status
      </h1>
      <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "2rem"
    }}>
        <div>
          <h2 style={{
          marginBottom: "1rem"
        }}>Message</h2>
          <ColorSwatch token="--s-color-message" label="Message" />
          <ColorSwatch token="--s-color-message-bg" label="Message Background" />
          <ColorSwatch token="--s-color-message-text" label="message Text" />
        </div>
        <div>
          <h2 style={{
          marginBottom: "1rem"
        }}>Warning</h2>
          <ColorSwatch token="--s-color-warning" label="Warning" />
          <ColorSwatch token="--s-color-warning-bg" label="Warning Background" />
          <ColorSwatch token="--s-color-warning-text" label="Warning Text" />
        </div>
        <div>
          <h2 style={{
          marginBottom: "1rem"
        }}>Memo</h2>
          <ColorSwatch token="--s-color-memo" label="Memo" />
          <ColorSwatch token="--s-color-memo-bg" label="Memo Background" />
          <ColorSwatch token="--s-color-memo-text" label="Memo Text" />
        </div>
        <div>
          <h2 style={{
          marginBottom: "1rem"
        }}>Info</h2>
          <ColorSwatch token="--s-color-info" label="Info" />
          <ColorSwatch token="--s-color-info-bg" label="Info Background" />
          <ColorSwatch token="--s-color-info-text" label="Info Text" />
        </div>
      </div>
    </div>
}`,...(W=(C=l.parameters)==null?void 0:C.docs)==null?void 0:W.source}}};var H,I,M;m.parameters={...m.parameters,docs:{...(H=m.parameters)==null?void 0:H.docs,source:{originalSource:`{
  render: () => <div style={{
    padding: "2rem",
    maxWidth: "1200px"
  }}>
      <h1 style={{
      marginBottom: "2rem"
    }}>Semantic Colors: Borders</h1>
      <ColorSwatch token="--s-color-border-subtle" label="Subtle Border" />
      <ColorSwatch token="--s-color-border-default" label="Default Border" />
      <ColorSwatch token="--s-color-border-strong" label="Strong Border" />
    </div>
}`,...(M=(I=m.parameters)==null?void 0:I.docs)==null?void 0:M.source}}};var $,L,R;c.parameters={...c.parameters,docs:{...($=c.parameters)==null?void 0:$.docs,source:{originalSource:`{
  render: () => <div style={{
    padding: "2rem",
    maxWidth: "1200px"
  }}>
      <h1 style={{
      marginBottom: "2rem"
    }}>Semantic Typography</h1>
      <div style={{
      display: "grid",
      gap: "3rem"
    }}>
        <div>
          <h2 style={{
          marginBottom: "1rem"
        }}>Font Sizes</h2>
          <div style={{
          fontSize: "var(--s-font-size-xs)"
        }}>
            XS: The quick brown fox (--s-font-size-xs)
          </div>
          <div style={{
          fontSize: "var(--s-font-size-sm)"
        }}>
            SM: The quick brown fox (--s-font-size-sm)
          </div>
          <div style={{
          fontSize: "var(--s-font-size-base)"
        }}>
            Base: The quick brown fox (--s-font-size-base)
          </div>
          <div style={{
          fontSize: "var(--s-font-size-lg)"
        }}>
            LG: The quick brown fox (--s-font-size-lg)
          </div>
          <div style={{
          fontSize: "var(--s-font-size-xl)"
        }}>
            XL: The quick brown fox (--s-font-size-xl)
          </div>
          <div style={{
          fontSize: "var(--s-font-size-2xl)"
        }}>
            2XL: The quick brown fox (--s-font-size-2xl)
          </div>
          <div style={{
          fontSize: "var(--s-font-size-3xl)"
        }}>
            3XL: The quick brown fox (--s-font-size-3xl)
          </div>
        </div>
        <div>
          <h2 style={{
          marginBottom: "1rem"
        }}>Heading Sizes</h2>
          <h1 style={{
          fontSize: "var(--s-font-size-h1)",
          lineHeight: "var(--s-line-height-h1)"
        }}>
            H1 Heading (--s-font-size-h1)
          </h1>
          <h2 style={{
          fontSize: "var(--s-font-size-h2)",
          lineHeight: "var(--s-line-height-h2)"
        }}>
            H2 Heading (--s-font-size-h2)
          </h2>
          <h3 style={{
          fontSize: "var(--s-font-size-h3)",
          lineHeight: "var(--s-line-height-h3)"
        }}>
            H3 Heading (--s-font-size-h3)
          </h3>
          <h4 style={{
          fontSize: "var(--s-font-size-h4)",
          lineHeight: "var(--s-line-height-h4)"
        }}>
            H4 Heading (--s-font-size-h4)
          </h4>
          <h5 style={{
          fontSize: "var(--s-font-size-h5)",
          lineHeight: "var(--s-line-height-h5)"
        }}>
            H5 Heading (--s-font-size-h5)
          </h5>
          <h6 style={{
          fontSize: "var(--s-font-size-h6)",
          lineHeight: "var(--s-line-height-h6)"
        }}>
            H6 Heading (--s-font-size-h6)
          </h6>
        </div>
        <div>
          <h2 style={{
          marginBottom: "1rem"
        }}>Font Weights</h2>
          <div style={{
          fontWeight: "var(--s-font-weight-normal)"
        }}>
            Normal Weight (--s-font-weight-normal)
          </div>
          <div style={{
          fontWeight: "var(--s-font-weight-medium)"
        }}>
            Medium Weight (--s-font-weight-medium)
          </div>
          <div style={{
          fontWeight: "var(--s-font-weight-semibold)"
        }}>
            Semibold Weight (--s-font-weight-semibold)
          </div>
          <div style={{
          fontWeight: "var(--s-font-weight-bold)"
        }}>
            Bold Weight (--s-font-weight-bold)
          </div>
        </div>
      </div>
    </div>
}`,...(R=(L=c.parameters)==null?void 0:L.docs)==null?void 0:R.source}}};var F,X,q;h.parameters={...h.parameters,docs:{...(F=h.parameters)==null?void 0:F.docs,source:{originalSource:`{
  render: () => <div style={{
    padding: "2rem",
    maxWidth: "1200px"
  }}>
      <h1 style={{
      marginBottom: "2rem"
    }}>Semantic Spacing</h1>
      <div style={{
      display: "grid",
      gap: "3rem"
    }}>
        <div>
          <h2 style={{
          marginBottom: "1rem"
        }}>Layout Gaps (Fixed)</h2>
          {semanticTokens.gaps.map(({
          token
        }) => <div key={token} style={{
          marginBottom: "1rem"
        }}>
              <code style={{
            fontSize: "0.875rem",
            marginBottom: "0.5rem",
            display: "block"
          }}>
                {token}
              </code>
              <div style={{
            display: "flex",
            gap: \`var(\${token})\`,
            padding: "0.5rem",
            backgroundColor: "#f0f0f0"
          }}>
                <div style={{
              width: "50px",
              height: "50px",
              backgroundColor: "#4299e1"
            }} />
                <div style={{
              width: "50px",
              height: "50px",
              backgroundColor: "#4299e1"
            }} />
                <div style={{
              width: "50px",
              height: "50px",
              backgroundColor: "#4299e1"
            }} />
              </div>
            </div>)}
        </div>
        <div>
          <h2 style={{
          marginBottom: "1rem"
        }}>Layout Gaps (Fluid)</h2>
          {semanticTokens.fluidGaps.map(({
          token
        }) => <div key={token} style={{
          marginBottom: "1rem"
        }}>
              <code style={{
            fontSize: "0.875rem",
            marginBottom: "0.5rem",
            display: "block"
          }}>
                {token}
              </code>
              <div style={{
            display: "flex",
            gap: \`var(\${token})\`,
            padding: "0.5rem",
            backgroundColor: "#f0f0f0"
          }}>
                <div style={{
              width: "50px",
              height: "50px",
              backgroundColor: "#48bb78"
            }} />
                <div style={{
              width: "50px",
              height: "50px",
              backgroundColor: "#48bb78"
            }} />
                <div style={{
              width: "50px",
              height: "50px",
              backgroundColor: "#48bb78"
            }} />
              </div>
            </div>)}
        </div>
        <div>
          <h2 style={{
          marginBottom: "1rem"
        }}>Gutters</h2>
          {semanticTokens.gutters.map(({
          token
        }) => <div key={token} style={{
          marginBottom: "1rem"
        }}>
              <code style={{
            fontSize: "0.875rem"
          }}>{token}</code>
              <div style={{
            padding: \`var(\${token})\`,
            backgroundColor: "#fbd38d",
            marginTop: "0.5rem"
          }}>
                <div style={{
              backgroundColor: "white",
              padding: "0.5rem"
            }}>
                  Content with gutter padding
                </div>
              </div>
            </div>)}
        </div>
      </div>
    </div>
}`,...(q=(X=h.parameters)==null?void 0:X.docs)==null?void 0:q.source}}};var A,E,G;g.parameters={...g.parameters,docs:{...(A=g.parameters)==null?void 0:A.docs,source:{originalSource:`{
  render: () => <div style={{
    padding: "2rem",
    maxWidth: "1200px"
  }}>
      <h1 style={{
      marginBottom: "2rem"
    }}>Semantic Sizing</h1>
      <div style={{
      display: "grid",
      gap: "3rem"
    }}>
        <div>
          <h2 style={{
          marginBottom: "1rem"
        }}>Border Widths</h2>
          <div style={{
          marginBottom: "1rem"
        }}>
            <code style={{
            fontSize: "0.875rem"
          }}>--s-border-width-thin</code>
            <div style={{
            marginTop: "0.5rem",
            borderTop: "var(--s-border-width-thin) solid #333",
            width: "200px"
          }} />
          </div>
          <div style={{
          marginBottom: "1rem"
        }}>
            <code style={{
            fontSize: "0.875rem"
          }}>--s-border-width-base</code>
            <div style={{
            marginTop: "0.5rem",
            borderTop: "var(--s-border-width-base) solid #333",
            width: "200px"
          }} />
          </div>
          <div style={{
          marginBottom: "1rem"
        }}>
            <code style={{
            fontSize: "0.875rem"
          }}>--s-border-width-thick</code>
            <div style={{
            marginTop: "0.5rem",
            borderTop: "var(--s-border-width-thick) solid #333",
            width: "200px"
          }} />
          </div>
        </div>
        <div>
          <h2 style={{
          marginBottom: "1rem"
        }}>Border Radius</h2>
          <div style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap"
        }}>
            {semanticTokens.borderRadii.map(({
            token
          }) => <div key={token} style={{
            textAlign: "center"
          }}>
                <div style={{
              width: "80px",
              height: "80px",
              backgroundColor: "#4299e1",
              borderRadius: \`var(\${token})\`,
              marginBottom: "0.5rem"
            }} />
                <code style={{
              fontSize: "0.75rem"
            }}>{token}</code>
              </div>)}
          </div>
        </div>
        <div>
          <h2 style={{
          marginBottom: "1rem"
        }}>Icon Sizes</h2>
          <div style={{
          display: "flex",
          gap: "2rem",
          alignItems: "flex-end"
        }}>
            {semanticTokens.iconSizes.map(({
            token
          }) => <div key={token} style={{
            textAlign: "center"
          }}>
                <div style={{
              width: \`var(\${token})\`,
              height: \`var(\${token})\`,
              backgroundColor: "#ed8936",
              marginBottom: "0.5rem"
            }} />
                <code style={{
              fontSize: "0.75rem"
            }}>{token}</code>
              </div>)}
          </div>
        </div>
      </div>
    </div>
}`,...(G=(E=g.parameters)==null?void 0:E.docs)==null?void 0:G.source}}};var P,D,O;x.parameters={...x.parameters,docs:{...(P=x.parameters)==null?void 0:P.docs,source:{originalSource:`{
  render: () => <div style={{
    padding: "2rem",
    maxWidth: "1200px"
  }}>
      <h1 style={{
      marginBottom: "2rem"
    }}>Semantic Animations</h1>
      <div style={{
      display: "grid",
      gap: "3rem"
    }}>
        <div>
          <h2 style={{
          marginBottom: "1rem"
        }}>Durations</h2>
          {semanticTokens.durations.map(({
          token
        }) => {
          const name = token.replace("--s-duration-", "");
          return <div key={token} style={{
            marginBottom: "1rem"
          }}>
                <code style={{
              fontSize: "0.875rem",
              marginRight: "1rem"
            }}>
                  {token}
                </code>
                <div style={{
              width: "100px",
              height: "40px",
              backgroundColor: "#4299e1",
              marginTop: "0.5rem",
              animation: \`slide-\${name} var(\${token}) ease-in-out infinite alternate\`
            }} />
                <style>{\`
                  @keyframes slide-\${name} {
                    from { transform: translateX(0); }
                    to { transform: translateX(200px); }
                  }
                \`}</style>
              </div>;
        })}
        </div>
        <div>
          <h2 style={{
          marginBottom: "1rem"
        }}>Composite Transitions</h2>
          {semanticTokens.transitions.map(({
          token
        }) => <div key={token} style={{
          marginBottom: "1rem"
        }}>
              <code style={{
            fontSize: "0.875rem"
          }}>{token}</code>
              <div style={{
            width: "100px",
            height: "40px",
            backgroundColor: "#48bb78",
            marginTop: "0.5rem",
            cursor: "pointer",
            transition: \`transform var(\${token})\`
          }} onMouseEnter={e => e.currentTarget.style.transform = "translateX(100px)"} onMouseLeave={e => e.currentTarget.style.transform = "translateX(0)"}>
                Hover me
              </div>
            </div>)}
        </div>
      </div>
    </div>
}`,...(O=(D=x.parameters)==null?void 0:D.docs)==null?void 0:O.source}}};var N,U,V;v.parameters={...v.parameters,docs:{...(N=v.parameters)==null?void 0:N.docs,source:{originalSource:`{
  render: () => <div style={{
    padding: "2rem",
    maxWidth: "1200px"
  }}>
      <h1 style={{
      marginBottom: "2rem"
    }}>Semantic Effects</h1>
      <div style={{
      display: "grid",
      gap: "3rem"
    }}>
        <div>
          <h2 style={{
          marginBottom: "1rem"
        }}>Shadows</h2>
          <div style={{
          display: "flex",
          gap: "2rem",
          flexWrap: "wrap"
        }}>
            {semanticTokens.shadows.map(({
            token
          }) => <div key={token} style={{
            textAlign: "center"
          }}>
                <div style={{
              width: "120px",
              height: "120px",
              backgroundColor: "white",
              boxShadow: \`var(\${token})\`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "0.5rem"
            }}>
                  Shadow
                </div>
                <code style={{
              fontSize: "0.75rem"
            }}>{token}</code>
              </div>)}
          </div>
        </div>
        <div>
          <h2 style={{
          marginBottom: "1rem"
        }}>Focus Ring</h2>
          <button style={{
          padding: "0.75rem 1.5rem",
          backgroundColor: "var(--s-color-primary)",
          color: "white",
          border: "none",
          borderRadius: "var(--s-border-radius-md)",
          cursor: "pointer"
        }} onFocus={e => {
          e.currentTarget.style.outline = "var(--s-focus-outline)";
          e.currentTarget.style.outlineOffset = "var(--s-focus-ring-offset)";
          e.currentTarget.style.boxShadow = "var(--s-focus-shadow)";
        }} onBlur={e => {
          e.currentTarget.style.outline = "none";
          e.currentTarget.style.boxShadow = "none";
        }}>
            Focus me (Tab key)
          </button>
          <div style={{
          marginTop: "1rem",
          fontSize: "0.875rem",
          color: "#666"
        }}>
            <code>--s-focus-ring-width</code>, <code>--s-focus-ring-color</code>
            , <code>--s-focus-ring-offset</code>
          </div>
        </div>
        <div>
          <h2 style={{
          marginBottom: "1rem"
        }}>Interactive States</h2>
          <div style={{
          display: "flex",
          gap: "2rem"
        }}>
            <div>
              <div style={{
              marginBottom: "0.5rem",
              fontSize: "0.875rem"
            }}>
                Hover Opacity
              </div>
              <div style={{
              width: "100px",
              height: "100px",
              backgroundColor: "#4299e1",
              cursor: "pointer",
              transition: "opacity 0.2s"
            }} onMouseEnter={e => e.currentTarget.style.opacity = "var(--s-hover-opacity)"} onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                Hover
              </div>
              <code style={{
              fontSize: "0.75rem",
              display: "block",
              marginTop: "0.5rem"
            }}>
                --s-hover-opacity
              </code>
            </div>
            <div>
              <div style={{
              marginBottom: "0.5rem",
              fontSize: "0.875rem"
            }}>
                Active Scale
              </div>
              <div style={{
              width: "100px",
              height: "100px",
              backgroundColor: "#48bb78",
              cursor: "pointer",
              transition: "transform 0.1s"
            }} onMouseDown={e => e.currentTarget.style.transform = "scale(var(--s-active-scale))"} onMouseUp={e => e.currentTarget.style.transform = "scale(1)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
                Click
              </div>
              <code style={{
              fontSize: "0.75rem",
              display: "block",
              marginTop: "0.5rem"
            }}>
                --s-active-scale
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
}`,...(V=(U=v.parameters)==null?void 0:U.docs)==null?void 0:V.source}}};var Z,_,J;y.parameters={...y.parameters,docs:{...(Z=y.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  render: () => <div style={{
    padding: "2rem",
    maxWidth: "1200px"
  }}>
      <h1 style={{
      marginBottom: "2rem"
    }}>Semantic Layout</h1>
      <div style={{
      display: "grid",
      gap: "3rem"
    }}>
        <div>
          <h2 style={{
          marginBottom: "1rem"
        }}>Z-Index Scale</h2>
          <div style={{
          position: "relative",
          height: "300px",
          backgroundColor: "#f0f0f0"
        }}>
            {semanticTokens.zIndex.map(({
            token,
            label
          }, index) => {
            const offset = index * 20;
            return <div key={token} style={{
              position: "absolute",
              left: \`\${offset}px\`,
              top: \`\${offset}px\`,
              width: "150px",
              height: "80px",
              backgroundColor: "#4299e1",
              color: "white",
              padding: "0.5rem",
              zIndex: \`var(\${token})\`,
              fontSize: "0.75rem",
              border: "2px solid white"
            }}>
                  <div style={{
                fontWeight: "600"
              }}>{label}</div>
                  <code style={{
                fontSize: "0.625rem",
                color: "#e2e8f0"
              }}>
                    {token}
                  </code>
                </div>;
          })}
          </div>
        </div>
        <div>
          <h2 style={{
          marginBottom: "1rem"
        }}>Container Widths</h2>
          <div style={{
          display: "grid",
          gap: "0.5rem"
        }}>
            {semanticTokens.containers.map(({
            token
          }) => {
            const isReadable = token.includes("readable");
            if (isReadable) {
              return <div key={token}>
                    <code style={{
                  fontSize: "0.75rem",
                  marginRight: "0.5rem"
                }}>
                      {token}
                    </code>
                    <div style={{
                  maxWidth: \`var(\${token})\`,
                  backgroundColor: "#ed8936",
                  padding: "1rem",
                  marginTop: "0.25rem"
                }}>
                      <p style={{
                    margin: 0
                  }}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Optimal line length for readability is around 65
                        characters. This container is limited to that width
                        using {token}.
                      </p>
                    </div>
                  </div>;
            }
            return <div key={token}>
                  <code style={{
                fontSize: "0.75rem",
                marginRight: "0.5rem"
              }}>
                    {token}
                  </code>
                  <div style={{
                maxWidth: \`var(\${token})\`,
                height: "30px",
                backgroundColor: "#9f7aea",
                marginTop: "0.25rem"
              }} />
                </div>;
          })}
          </div>
        </div>
      </div>
    </div>
}`,...(J=(_=y.parameters)==null?void 0:_.docs)==null?void 0:J.source}}};const re=["ColorsSurfaces","ColorsText","ColorsInteractive","ColorsFeedback","ColorsBorders","Typography","Spacing","Sizing","Animations","Effects","Layout"];export{x as Animations,m as ColorsBorders,l as ColorsFeedback,d as ColorsInteractive,s as ColorsSurfaces,a as ColorsText,v as Effects,y as Layout,g as Sizing,h as Spacing,c as Typography,re as __namedExportsOrder,ne as default};
