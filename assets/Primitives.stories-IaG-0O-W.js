import{j as e}from"./jsx-runtime-Cf8x2fCZ.js";import{p as i}from"./parse-tokens-12AbnvOx.js";import"./index-yBjzXJbu.js";const D={title:"Design Tokens/Primitives",parameters:{layout:"fullscreen"}},A=({token:n,label:r})=>e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"1rem",marginBottom:"0.5rem"},children:[e.jsx("div",{style:{width:"4rem",height:"2.5rem",backgroundColor:`var(${n})`,border:"1px solid #ccc",borderRadius:"0.25rem"}}),e.jsxs("div",{children:[e.jsx("div",{style:{fontWeight:500},children:r}),e.jsx("code",{style:{fontSize:"0.875rem",color:"#666"},children:n})]})]}),H=({colorName:n,range:r})=>e.jsxs("div",{style:{marginBottom:"2rem"},children:[e.jsx("h3",{style:{marginBottom:"1rem",textTransform:"capitalize"},children:n}),r.map(t=>e.jsx(A,{token:`--p-color-${n}-${t}`,label:`${n}-${t}`},t))]}),h=({token:n,label:r})=>e.jsxs("div",{style:{marginBottom:"0.75rem"},children:[e.jsxs("div",{style:{fontSize:"0.875rem",marginBottom:"0.25rem"},children:[e.jsx("strong",{children:r})," ",e.jsx("code",{style:{color:"#666"},children:n})]}),e.jsx("div",{style:{height:"1.5rem",backgroundColor:"#4f46e5",width:`var(${n})`,borderRadius:"0.25rem"}})]}),L=({token:n,label:r})=>e.jsxs("div",{style:{marginBottom:"1rem"},children:[e.jsxs("div",{style:{fontSize:"var(--p-step-0)",marginBottom:"0.25rem"},children:[e.jsx("strong",{children:r})," ",e.jsx("code",{style:{color:"#666"},children:n})]}),e.jsx("div",{style:{fontSize:`var(${n})`},children:"The quick brown fox jumps over the lazy dog"})]}),o={render:()=>e.jsxs("div",{style:{padding:"2rem",maxWidth:"1200px",margin:"0 auto"},children:[e.jsx("h1",{style:{marginBottom:"2rem"},children:"Color Primitives"}),e.jsx("h2",{style:{marginBottom:"1.5rem"},children:"Color Scales"}),e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))",gap:"2rem"},children:i.colorScales.map(n=>e.jsx(H,{colorName:n.name,range:n.range},n.name))})]})},s={render:()=>e.jsxs("div",{style:{padding:"2rem",maxWidth:"1200px",margin:"0 auto"},children:[e.jsx("h1",{style:{marginBottom:"2rem"},children:"Typography Primitives"}),e.jsx("h2",{style:{marginBottom:"1rem"},children:"Type Scale (Fluid)"}),i.typeScale.map(({token:n,label:r})=>e.jsx(L,{token:n,label:r},n)),e.jsx("h2",{style:{marginTop:"3rem",marginBottom:"1rem"},children:"Font Families"}),i.fonts.map(({token:n,label:r})=>e.jsxs("div",{style:{marginBottom:"1rem"},children:[e.jsxs("div",{children:[e.jsx("strong",{children:r})," ",e.jsx("code",{style:{color:"#666"},children:n})]}),e.jsx("div",{style:{fontFamily:`var(${n})`},children:"The quick brown fox jumps over the lazy dog"})]},n)),e.jsx("h2",{style:{marginTop:"3rem",marginBottom:"1rem"},children:"Line Heights"}),e.jsx("div",{style:{display:"flex",gap:"2rem",flexWrap:"wrap"},children:i.lineHeights.map(({token:n,label:r})=>e.jsxs("div",{children:[e.jsxs("div",{style:{marginBottom:"0.5rem"},children:[e.jsx("strong",{children:r}),e.jsx("br",{}),e.jsx("code",{style:{fontSize:"0.875rem",color:"#666"},children:n})]}),e.jsx("div",{style:{maxWidth:"200px",lineHeight:`var(${n})`,border:"1px solid #ccc",padding:"0.5rem"},children:"Lorem ipsum dolor sit amet, consectetur adipiscing elit."})]},n))})]})},a={render:()=>e.jsxs("div",{style:{padding:"2rem",maxWidth:"1200px",margin:"0 auto"},children:[e.jsx("h1",{style:{marginBottom:"2rem"},children:"Spacing Primitives"}),e.jsx("h2",{style:{marginBottom:"1rem"},children:"Fixed Steps (Fluid)"}),i.fixedSpaces.map(({token:n,label:r})=>e.jsx(h,{token:n,label:r},n)),e.jsx("h2",{style:{marginTop:"3rem",marginBottom:"1rem"},children:"One-Up Pairs"}),i.fluidSpaces.map(({token:n,label:r})=>e.jsx(h,{token:n,label:r},n))]})},d={render:()=>e.jsxs("div",{style:{padding:"2rem",maxWidth:"1200px",margin:"0 auto"},children:[e.jsx("h1",{style:{marginBottom:"2rem"},children:"Size Primitives"}),e.jsx("h2",{style:{marginBottom:"1rem"},children:"Border Widths"}),e.jsx("div",{style:{marginBottom:"2rem"},children:i.borders.map(({token:n,label:r})=>e.jsxs("div",{style:{marginBottom:"0.75rem"},children:[e.jsxs("div",{style:{marginBottom:"0.25rem"},children:[e.jsx("strong",{children:r})," ",e.jsx("code",{style:{color:"#666"},children:n})]}),e.jsx("div",{style:{width:"200px",height:"50px",border:`var(${n}) solid #4f46e5`}})]},n))}),e.jsx("h2",{style:{marginBottom:"1rem"},children:"Border Radii"}),e.jsx("div",{style:{display:"flex",gap:"1rem",flexWrap:"wrap",marginBottom:"2rem"},children:i.radii.map(({token:n,label:r})=>e.jsxs("div",{children:[e.jsxs("div",{style:{marginBottom:"0.5rem"},children:[e.jsx("strong",{children:r}),e.jsx("br",{}),e.jsx("code",{style:{fontSize:"0.875rem",color:"#666"},children:n})]}),e.jsx("div",{style:{width:"80px",height:"80px",backgroundColor:"#4f46e5",borderRadius:`var(${n})`}})]},n))}),e.jsx("h2",{style:{marginBottom:"1rem"},children:"Icon Sizes"}),e.jsx("div",{style:{display:"flex",gap:"1rem",alignItems:"flex-end"},children:i.icons.map(({token:n,label:r})=>e.jsxs("div",{style:{textAlign:"center"},children:[e.jsx("div",{style:{width:`var(${n})`,height:`var(${n})`,backgroundColor:"#4f46e5",borderRadius:"0.25rem",marginBottom:"0.5rem"}}),e.jsxs("div",{style:{fontSize:"0.875rem"},children:[e.jsx("strong",{children:r}),e.jsx("br",{}),e.jsx("code",{style:{fontSize:"0.75rem",color:"#666"},children:n})]})]},n))})]})},m={render:()=>e.jsxs("div",{style:{padding:"2rem",maxWidth:"1200px",margin:"0 auto"},children:[e.jsx("h1",{style:{marginBottom:"2rem"},children:"Shadow Primitives"}),e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))",gap:"2rem"},children:i.shadows.map(({token:n,label:r})=>e.jsxs("div",{children:[e.jsxs("div",{style:{marginBottom:"1rem"},children:[e.jsx("strong",{children:r}),e.jsx("br",{}),e.jsx("code",{style:{fontSize:"0.875rem",color:"#666"},children:n})]}),e.jsx("div",{style:{width:"100%",height:"120px",backgroundColor:"white",borderRadius:"0.5rem",boxShadow:`var(${n})`}})]},n))})]})},l={render:()=>e.jsxs("div",{style:{padding:"2rem",maxWidth:"1200px",margin:"0 auto"},children:[e.jsx("h1",{style:{marginBottom:"2rem"},children:"Animation Primitives"}),e.jsx("h2",{style:{marginBottom:"1rem"},children:"Durations"}),e.jsx("div",{style:{marginBottom:"3rem"},children:i.durations.map(({token:n,label:r})=>e.jsxs("div",{style:{marginBottom:"1rem"},children:[e.jsxs("div",{style:{marginBottom:"0.5rem"},children:[e.jsx("strong",{children:r})," ",e.jsx("code",{style:{color:"#666"},children:n})]}),e.jsx("div",{style:{width:"50px",height:"50px",backgroundColor:"#4f46e5",borderRadius:"0.25rem",animation:`pulse var(${n}) infinite`}})]},n))}),e.jsx("h2",{style:{marginBottom:"1rem"},children:"Easing Curves"}),e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))",gap:"1rem"},children:i.easings.map(({token:n,label:r})=>e.jsxs("div",{style:{textAlign:"center"},children:[e.jsxs("div",{style:{marginBottom:"0.5rem"},children:[e.jsx("strong",{children:r}),e.jsx("br",{}),e.jsx("code",{style:{fontSize:"0.875rem",color:"#666"},children:n})]}),e.jsx("div",{style:{width:"50px",height:"50px",backgroundColor:"#4f46e5",borderRadius:"0.25rem",margin:"0 auto",animation:`slide 2s var(${n}) infinite`}})]},n))}),e.jsx("style",{children:`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes slide {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(100px); }
        }
      `})]})},c={render:()=>e.jsxs("div",{style:{padding:"2rem",maxWidth:"1200px",margin:"0 auto"},children:[e.jsx("h1",{style:{marginBottom:"2rem"},children:"Z-Index Primitives"}),e.jsx("div",{style:{position:"relative",height:"400px",backgroundColor:"#f3f4f6",borderRadius:"0.5rem",overflow:"hidden"},children:i.zIndex.map(({token:n,label:r},t)=>{const p=["#ef4444","#f59e0b","#10b981","#3b82f6","#6366f1","#8b5cf6","#ec4899","#f43f5e","#14b8a6","#06b6d4"],E=p[t%p.length];return e.jsxs("div",{style:{position:"absolute",top:`${20+t*30}px`,left:`${20+t*30}px`,padding:"1rem",backgroundColor:E,color:"white",borderRadius:"0.5rem",boxShadow:"0 4px 6px -1px rgb(0 0 0 / 0.1)",zIndex:`var(${n})`,fontSize:"0.875rem",fontWeight:500},children:[e.jsx("div",{children:r}),e.jsx("code",{style:{fontSize:"0.75rem",opacity:.9},children:n})]},n)})})]})};var g,x,y;o.parameters={...o.parameters,docs:{...(g=o.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: () => <div style={{
    padding: "2rem",
    maxWidth: "1200px",
    margin: "0 auto"
  }}>
      <h1 style={{
      marginBottom: "2rem"
    }}>Color Primitives</h1>

      <h2 style={{
      marginBottom: "1.5rem"
    }}>Color Scales</h2>
      <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "2rem"
    }}>
        {primitiveTokens.colorScales.map(scale => <ColorScale key={scale.name} colorName={scale.name} range={scale.range} />)}
      </div>
    </div>
}`,...(y=(x=o.parameters)==null?void 0:x.docs)==null?void 0:y.source}}};var v,u,f;s.parameters={...s.parameters,docs:{...(v=s.parameters)==null?void 0:v.docs,source:{originalSource:`{
  render: () => <div style={{
    padding: "2rem",
    maxWidth: "1200px",
    margin: "0 auto"
  }}>
      <h1 style={{
      marginBottom: "2rem"
    }}>Typography Primitives</h1>

      <h2 style={{
      marginBottom: "1rem"
    }}>Type Scale (Fluid)</h2>
      {primitiveTokens.typeScale.map(({
      token,
      label
    }) => <TypeExample key={token} token={token} label={label} />)}

      <h2 style={{
      marginTop: "3rem",
      marginBottom: "1rem"
    }}>Font Families</h2>
      {primitiveTokens.fonts.map(({
      token,
      label
    }) => <div key={token} style={{
      marginBottom: "1rem"
    }}>
          <div>
            <strong>{label}</strong>{" "}
            <code style={{
          color: "#666"
        }}>{token}</code>
          </div>
          <div style={{
        fontFamily: \`var(\${token})\`
      }}>
            The quick brown fox jumps over the lazy dog
          </div>
        </div>)}

      <h2 style={{
      marginTop: "3rem",
      marginBottom: "1rem"
    }}>Line Heights</h2>
      <div style={{
      display: "flex",
      gap: "2rem",
      flexWrap: "wrap"
    }}>
        {primitiveTokens.lineHeights.map(({
        token,
        label
      }) => <div key={token}>
            <div style={{
          marginBottom: "0.5rem"
        }}>
              <strong>{label}</strong>
              <br />
              <code style={{
            fontSize: "0.875rem",
            color: "#666"
          }}>
                {token}
              </code>
            </div>
            <div style={{
          maxWidth: "200px",
          lineHeight: \`var(\${token})\`,
          border: "1px solid #ccc",
          padding: "0.5rem"
        }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </div>
          </div>)}
      </div>
    </div>
}`,...(f=(u=s.parameters)==null?void 0:u.docs)==null?void 0:f.source}}};var j,b,k;a.parameters={...a.parameters,docs:{...(j=a.parameters)==null?void 0:j.docs,source:{originalSource:`{
  render: () => <div style={{
    padding: "2rem",
    maxWidth: "1200px",
    margin: "0 auto"
  }}>
      <h1 style={{
      marginBottom: "2rem"
    }}>Spacing Primitives</h1>

      <h2 style={{
      marginBottom: "1rem"
    }}>Fixed Steps (Fluid)</h2>
      {primitiveTokens.fixedSpaces.map(({
      token,
      label
    }) => <SpaceExample key={token} token={token} label={label} />)}

      <h2 style={{
      marginTop: "3rem",
      marginBottom: "1rem"
    }}>One-Up Pairs</h2>
      {primitiveTokens.fluidSpaces.map(({
      token,
      label
    }) => <SpaceExample key={token} token={token} label={label} />)}
    </div>
}`,...(k=(b=a.parameters)==null?void 0:b.docs)==null?void 0:k.source}}};var B,S,T;d.parameters={...d.parameters,docs:{...(B=d.parameters)==null?void 0:B.docs,source:{originalSource:`{
  render: () => <div style={{
    padding: "2rem",
    maxWidth: "1200px",
    margin: "0 auto"
  }}>
      <h1 style={{
      marginBottom: "2rem"
    }}>Size Primitives</h1>

      <h2 style={{
      marginBottom: "1rem"
    }}>Border Widths</h2>
      <div style={{
      marginBottom: "2rem"
    }}>
        {primitiveTokens.borders.map(({
        token,
        label
      }) => <div key={token} style={{
        marginBottom: "0.75rem"
      }}>
            <div style={{
          marginBottom: "0.25rem"
        }}>
              <strong>{label}</strong>{" "}
              <code style={{
            color: "#666"
          }}>{token}</code>
            </div>
            <div style={{
          width: "200px",
          height: "50px",
          border: \`var(\${token}) solid #4f46e5\`
        }} />
          </div>)}
      </div>

      <h2 style={{
      marginBottom: "1rem"
    }}>Border Radii</h2>
      <div style={{
      display: "flex",
      gap: "1rem",
      flexWrap: "wrap",
      marginBottom: "2rem"
    }}>
        {primitiveTokens.radii.map(({
        token,
        label
      }) => <div key={token}>
            <div style={{
          marginBottom: "0.5rem"
        }}>
              <strong>{label}</strong>
              <br />
              <code style={{
            fontSize: "0.875rem",
            color: "#666"
          }}>
                {token}
              </code>
            </div>
            <div style={{
          width: "80px",
          height: "80px",
          backgroundColor: "#4f46e5",
          borderRadius: \`var(\${token})\`
        }} />
          </div>)}
      </div>

      <h2 style={{
      marginBottom: "1rem"
    }}>Icon Sizes</h2>
      <div style={{
      display: "flex",
      gap: "1rem",
      alignItems: "flex-end"
    }}>
        {primitiveTokens.icons.map(({
        token,
        label
      }) => <div key={token} style={{
        textAlign: "center"
      }}>
            <div style={{
          width: \`var(\${token})\`,
          height: \`var(\${token})\`,
          backgroundColor: "#4f46e5",
          borderRadius: "0.25rem",
          marginBottom: "0.5rem"
        }} />
            <div style={{
          fontSize: "0.875rem"
        }}>
              <strong>{label}</strong>
              <br />
              <code style={{
            fontSize: "0.75rem",
            color: "#666"
          }}>
                {token}
              </code>
            </div>
          </div>)}
      </div>
    </div>
}`,...(T=(S=d.parameters)==null?void 0:S.docs)==null?void 0:T.source}}};var w,z,C;m.parameters={...m.parameters,docs:{...(w=m.parameters)==null?void 0:w.docs,source:{originalSource:`{
  render: () => <div style={{
    padding: "2rem",
    maxWidth: "1200px",
    margin: "0 auto"
  }}>
      <h1 style={{
      marginBottom: "2rem"
    }}>Shadow Primitives</h1>

      <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "2rem"
    }}>
        {primitiveTokens.shadows.map(({
        token,
        label
      }) => <div key={token}>
            <div style={{
          marginBottom: "1rem"
        }}>
              <strong>{label}</strong>
              <br />
              <code style={{
            fontSize: "0.875rem",
            color: "#666"
          }}>
                {token}
              </code>
            </div>
            <div style={{
          width: "100%",
          height: "120px",
          backgroundColor: "white",
          borderRadius: "0.5rem",
          boxShadow: \`var(\${token})\`
        }} />
          </div>)}
      </div>
    </div>
}`,...(C=(z=m.parameters)==null?void 0:z.docs)==null?void 0:C.source}}};var $,W,R;l.parameters={...l.parameters,docs:{...($=l.parameters)==null?void 0:$.docs,source:{originalSource:`{
  render: () => <div style={{
    padding: "2rem",
    maxWidth: "1200px",
    margin: "0 auto"
  }}>
      <h1 style={{
      marginBottom: "2rem"
    }}>Animation Primitives</h1>

      <h2 style={{
      marginBottom: "1rem"
    }}>Durations</h2>
      <div style={{
      marginBottom: "3rem"
    }}>
        {primitiveTokens.durations.map(({
        token,
        label
      }) => <div key={token} style={{
        marginBottom: "1rem"
      }}>
            <div style={{
          marginBottom: "0.5rem"
        }}>
              <strong>{label}</strong>{" "}
              <code style={{
            color: "#666"
          }}>{token}</code>
            </div>
            <div style={{
          width: "50px",
          height: "50px",
          backgroundColor: "#4f46e5",
          borderRadius: "0.25rem",
          animation: \`pulse var(\${token}) infinite\`
        }} />
          </div>)}
      </div>

      <h2 style={{
      marginBottom: "1rem"
    }}>Easing Curves</h2>
      <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "1rem"
    }}>
        {primitiveTokens.easings.map(({
        token,
        label
      }) => <div key={token} style={{
        textAlign: "center"
      }}>
            <div style={{
          marginBottom: "0.5rem"
        }}>
              <strong>{label}</strong>
              <br />
              <code style={{
            fontSize: "0.875rem",
            color: "#666"
          }}>
                {token}
              </code>
            </div>
            <div style={{
          width: "50px",
          height: "50px",
          backgroundColor: "#4f46e5",
          borderRadius: "0.25rem",
          margin: "0 auto",
          animation: \`slide 2s var(\${token}) infinite\`
        }} />
          </div>)}
      </div>

      <style>{\`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes slide {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(100px); }
        }
      \`}</style>
    </div>
}`,...(R=(W=l.parameters)==null?void 0:W.docs)==null?void 0:R.source}}};var P,I,F;c.parameters={...c.parameters,docs:{...(P=c.parameters)==null?void 0:P.docs,source:{originalSource:`{
  render: () => <div style={{
    padding: "2rem",
    maxWidth: "1200px",
    margin: "0 auto"
  }}>
      <h1 style={{
      marginBottom: "2rem"
    }}>Z-Index Primitives</h1>

      <div style={{
      position: "relative",
      height: "400px",
      backgroundColor: "#f3f4f6",
      borderRadius: "0.5rem",
      overflow: "hidden"
    }}>
        {primitiveTokens.zIndex.map(({
        token,
        label
      }, index) => {
        const colors = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#6366f1", "#8b5cf6", "#ec4899", "#f43f5e", "#14b8a6", "#06b6d4"];
        const color = colors[index % colors.length];
        return <div key={token} style={{
          position: "absolute",
          top: \`\${20 + index * 30}px\`,
          left: \`\${20 + index * 30}px\`,
          padding: "1rem",
          backgroundColor: color,
          color: "white",
          borderRadius: "0.5rem",
          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
          zIndex: \`var(\${token})\`,
          fontSize: "0.875rem",
          fontWeight: 500
        }}>
              <div>{label}</div>
              <code style={{
            fontSize: "0.75rem",
            opacity: 0.9
          }}>{token}</code>
            </div>;
      })}
      </div>
    </div>
}`,...(F=(I=c.parameters)==null?void 0:I.docs)==null?void 0:F.source}}};const O=["Colors","Typography","Spacing","Sizes","Shadows","Animation","ZIndex"];export{l as Animation,o as Colors,m as Shadows,d as Sizes,a as Spacing,s as Typography,c as ZIndex,O as __namedExportsOrder,D as default};
