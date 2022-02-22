(this.webpackJsonpsupersynthesis=this.webpackJsonpsupersynthesis||[]).push([[0],{179:function(t,e,i){"use strict";i.r(e);var n,a,s=i(0),r=i.n(s),o=i(47),h=i.n(o),l=(i(86),i(87),i(2)),c=i(3),u=i(8),p=i(5),g=i(4),d=i(6),f=i(80),m="TOP",y="BOTTOM",v=1,x=0,b=0,w=1,k=2,S=new(function(){function t(){Object(l.a)(this,t),this.lightSubscribers=[],this.infoSubscribers=[],this.configIndex=0,this.bpm=150,this.lightConfig=[],this.maxLightHeight=0,this.prepareDefaultLightConfig()}return Object(c.a)(t,[{key:"subscribeLights",value:function(t){var e=this;this.lightSubscribers.push(t);return function(){e.lightSubscribers=e.lightSubscribers.filter((function(e){return t!==e}))}}},{key:"subscribeInfo",value:function(t){var e=this;this.infoSubscribers.push(t);return function(){e.infoListeners=e.infoSubscribers.filter((function(e){return t!==e}))}}},{key:"setMaxHeight",value:function(t){this.maxLightHeight=t}},{key:"prepareDefaultLightConfig",value:function(){console.log("Preparing default config.");for(var t=0;t<24;t++){var e={light:{TOP:1,BOTTOM:1},draw:{TOP:!1,BOTTOM:!1},grow:{TOP:{state:b,active:!1},BOTTOM:{state:b,active:!1}},height:{TOP:0,BOTTOM:0}};this.lightConfig.push(e)}}},{key:"getFullConfig",value:function(t){return this.lightConfig[t]}},{key:"getLightState",value:function(t){return this.lightConfig[t].light}},{key:"setLightState",value:function(t,e,i){this.lightConfig[t].light[e]=i}},{key:"getGrowState",value:function(t){return this.lightConfig[t].grow}},{key:"setGrowState",value:function(t,e,i,n){this.lightConfig[t].grow[e].state=i,this.lightConfig[t].grow[e].active=n}},{key:"getDrawState",value:function(t){return this.lightConfig[t].draw}},{key:"setDrawState",value:function(t,e,i){this.lightConfig[t].draw[e]=i}},{key:"getHeightState",value:function(t){return this.lightConfig[t].height}},{key:"setHeightState",value:function(t,e,i){this.lightConfig[t].height[e]=i}},{key:"getRandomInt",value:function(t){return Math.floor(Math.random()*t)}},{key:"getBpm",value:function(){return this.bpm}},{key:"setBpm",value:function(t){this.bpm=t;for(var e=0;e<this.infoSubscribers.length;e++)this.infoSubscribers[e]()}},{key:"getConfigIndex",value:function(){return this.configIndex}},{key:"getPayloadForDatabase",value:function(){this.configIndex+=1;var t=this.filterConfig();this.json={},this.json.bpm=this.bpm,this.json.lights=t,this.json.time=Date();for(var e={index:this.configIndex,config:JSON.stringify(this.json)},i=0;i<this.infoSubscribers.length;i++)this.infoSubscribers[i]();return e}},{key:"setPayloadFromDatabase",value:function(t){console.log("Overwriting current config."),this.configIndex=t.index;var e=t.config;this.bpm=e.bpm;for(var i=0;i<this.infoSubscribers.length;i++)this.infoSubscribers[i]();var n=e.lights;this.updateLightConfig(n);for(var a=0;a<this.lightSubscribers.length;a++)this.lightSubscribers[a]()}},{key:"filterConfig",value:function(){var t=[];return this.lightConfig.forEach((function(e){var i=e.light;t.push(i)})),t}},{key:"updateLightConfig",value:function(t){this.lightConfig=[];for(var e=0;e<t.length;e++){var i=t[e],n={light:{TOP:i[m],BOTTOM:i[y]},draw:{TOP:i[m]===v,BOTTOM:i[y]===v},grow:{TOP:{state:b,active:!1},BOTTOM:{state:b,active:!1}},height:{TOP:i[m]===v?this.maxLightHeight:0,BOTTOM:i[y]===v?this.maxLightHeight:0}};this.lightConfig.push(n)}}}]),t}()),O=new(function(){function t(){Object(l.a)(this,t),this.siteURL="https://supersynth.herokuapp.com/app",this.socket=Object(f.a)(this.siteURL,{reconnection:!0,reconnectionDelay:500,reconnectionAttempts:1/0}),this.socket.once("connect",this.subscribe.bind(this))}return Object(c.a)(t,[{key:"subscribe",value:function(){console.log("Connected"),this.socket.on("time",this.logTime.bind(this)),this.socket.on("receiveData",(function(t){S.setPayloadFromDatabase(t)})),this.socket.emit("getData")}},{key:"saveEntry",value:function(){this.socket.emit("saveData",{index:0,data:"Hi this is fresh data"})}},{key:"disconnect",value:function(){console.log("Socket Server Disconnected.")}},{key:"logTime",value:function(t){}},{key:"commitLightConfigData",value:function(){var t=S.getPayloadForDatabase();this.socket.emit("saveData",t)}}]),t}()),I={bgBlack:"black",fgWhite:"white"},C={extraSmall:"8px",kindaSmall:"10px",verySmall:"12px",lessSmall:"14px",small:"16px",lessBig:"18px",big:"20px",veryBig:"24px",extraBig:"28px",huge:"32px",veryHuge:"36px",extraHuge:"40px",massive:"44px",veryMassive:"48px",extraMassive:"52px",enormous:"56px",veryEnormous:"60px",extraEnormous:"64px",insane:"68px",veryInsaane:"72px",extraInsane:"76px",gaia:"80px",veryGaia:"84px",extraGaia:"88px"},L={tiny:"2px",extraSmall:"4px",kindaSmall:"6px",verySmall:"8px",small:"12px",lessBig:"16px",big:"20px",veryBig:"28px",extraBig:"36px",huge:"52px",veryHuge:"64px",extraHuge:"76px",massive:"92px",veryMassive:"108px",extraMassive:"124px",enourmous:"100px",veryEnormous:"120px",extraEnormous:"140px",insane:"160px",veryInsane:"200px",extraInsane:"240px"},P="heatwaveregular",E="josefin_sanssemibold",j=["svgRef","title"];function T(){return(T=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var i=arguments[e];for(var n in i)Object.prototype.hasOwnProperty.call(i,n)&&(t[n]=i[n])}return t}).apply(this,arguments)}function B(t,e){if(null==t)return{};var i,n,a=function(t,e){if(null==t)return{};var i,n,a={},s=Object.keys(t);for(n=0;n<s.length;n++)i=s[n],e.indexOf(i)>=0||(a[i]=t[i]);return a}(t,e);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(t);for(n=0;n<s.length;n++)i=s[n],e.indexOf(i)>=0||Object.prototype.propertyIsEnumerable.call(t,i)&&(a[i]=t[i])}return a}var D,R=function(t){var e=t.svgRef,i=t.title,s=B(t,j);return r.a.createElement("svg",T({viewBox:"0 0 48.51 48.51",ref:e},s),i?r.a.createElement("title",null,i):null,n||(n=r.a.createElement("defs",null,r.a.createElement("style",null,".rect{fill:inherit;}.cls-2{fill:none;stroke:#b3b3b3;stroke-miterlimit:10;stroke-width:4px;}"))),a||(a=r.a.createElement("g",{id:"Layer_2","data-name":"Layer 2"},r.a.createElement("g",{id:"Layer_1-2","data-name":"Layer 1"},r.a.createElement("rect",{className:"rect",width:48.51,height:48.51}),r.a.createElement("line",{className:"cls-2",x1:9.63,y1:9.64,x2:38.88,y2:38.89}),r.a.createElement("line",{className:"cls-2",x1:9.63,y1:38.89,x2:38.88,y2:9.64})))))},H=r.a.forwardRef((function(t,e){return r.a.createElement(R,T({svgRef:e},t))})),F=(i.p,i(28)),G=0,M=1,W=2,z=d.a.keyframes({from:{opacity:"0"},to:{opacity:"0.5"}},"fadesIn"),N=d.a.keyframes({from:{opacity:"0.5"},to:{opacity:"0"}},"fadesOut"),A={overlay:{position:"fixed",top:"0px",bottom:"0px",left:"0px",right:"0px",background:I.bgBlack,zIndex:"999"},fadeIn:{animationName:z,animationDuration:"0.5s",animationFillMode:"forwards",animationTimingFunction:"ease-in"},fadeOut:{animationName:N,animationDuration:"1.5s",animationFillMode:"forwards",animationTimingFunction:"ease-out"},fadeOutUp:{animationName:d.a.keyframes(F.fadeOutUp,"fadeOutUp"),animationDuration:"1.5s",animationFillMode:"forwards",animationTimingFunction:"ease-out"},fadeOutDown:{animationName:d.a.keyframes(F.fadeOutDown,"fadeOutDown"),animationDuration:"1.5s",animationFillMode:"forwards",animationTimingFunction:"ease-out"},fadeInDown:{animationName:d.a.keyframes(F.fadeInDown,"fadeInDown"),animationDuration:"2.0s",animationFillMode:"forwards",animationTimingFunction:"ease-in"},fadeInUp:{animationName:d.a.keyframes(F.fadeInUp,"fadeInUp"),animationDuration:"2.0s",animationFillMode:"forwards",animationTimingFunction:"ease-in"},showOverlay:{zIndex:"998",opacity:"1"},hideOverlay:{zIndex:"-998",opacity:"0"},showContent:{zIndex:"999",opacity:"1"},hideContent:{zIndex:"-999",opacity:"0"},contentContainer:{position:"fixed",zIndex:"-999",left:"0px",top:"0px",bottom:"0px",display:"flex",alignItems:"center",justifyContent:"center",height:"100%",width:"100%"},content:{borderRadius:C.tiny,overflow:"auto",maxWidth:"calc(100% - 50px)",maxHeight:"calc(100% - 100px)","@media (min-width: 600px)":{maxWidth:"calc(100% - 100px)",maxHeight:"calc(100% - 100px)"},"@media (min-width: 750px)":{maxWidth:"calc(100% - 150px)",maxHeight:"calc(100% - 100px)"},"@media (min-width: 1200px)":{maxWidth:"calc(100% - 300px)",maxHeight:"calc(100% - 100px)"}},stretchContainer:{display:"flex",flexDirection:"column",alignItems:"center",background:I.bgBlack,color:I.fgWhite,paddingLeft:L.small,paddingRight:L.small,"@media (min-width: 600px)":{paddingLeft:L.extraHuge,paddingRight:L.extraHuge},"@media (min-width: 900px)":{paddingLeft:L.veryMassive,paddingRight:L.veryMassive},"@media (min-width: 1200px)":{paddingLeft:L.extraMassive,paddingRight:L.extraMassive},opacity:"1.0",borderStyle:"solid",borderWidth:"2px",borderColor:I.fgWhite},title:{marginTop:L.lessSmall,marginBottom:L.small,textAlign:"center",fontFamily:P,fontSize:C.extraBig,letterSpacing:"2.5px",lineHeight:"1.8","@media (min-width: 750px)":{fontSize:C.extraBig},"@media (min-width: 900px)":{fontSize:C.huge},"@media (min-width: 1200px)":{fontSize:C.veryHuge}},body:{display:"flex",flexDirection:"column",justifyContent:"center",fontFamily:E,letterSpacing:"1.5px",fontSize:C.small,color:I.fgWhite},mediaQueryOnText:{"@media (min-width: 750px)":{fontSize:C.big},"@media (min-width: 900px)":{fontSize:C.veryBig}},iconContainer:{display:"flex",alignItems:"center",justifyContent:"center",alignSelf:"flex-end",marginRight:"-"+C.verySmall,height:C.big,width:C.big,fill:I.fgWhite,"@media (min-width: 600px)":{marginRight:"-"+C.extraInsane,height:C.veryBig,width:C.veryBig},"@media (min-width: 900px)":{height:C.extraBig,width:C.extraBig,marginRight:"-108px"},"@media (min-width: 1200px)":{marginRight:"-124px"}},icon:{width:"100%",height:"100%"},footerContainer:{display:"flex",flexDirection:"column",alignItems:"center",marginTop:L.veryBig,fontFamily:E,letterSpacing:"1.5px"},footer:{display:"flex",alignItems:"center",marginTop:L.verySmall,fontSize:C.lessSmall,"@media (min-width: 750px)":{fontSize:C.small}},copyright:{marginTop:L.veryBig,fontSize:C.verySmall,marginBottom:L.small},link:{backgroundColor:I.fgWhite,color:I.bgBlack,padding:L.tiny}},U=function(t){Object(p.a)(i,t);var e=Object(g.a)(i);function i(t){var n;return Object(l.a)(this,i),(n=e.call(this,t)).state={isVisible:!1,popupState:W},n.content=r.a.createRef(),n}return Object(c.a)(i,[{key:"render",value:function(){var t,e,i;return this.state.isVisible?(t=[A.overlay,A.showOverlay],this.state.popupState===G?t=[t,A.fadeIn]:this.state.popupState===M&&(t=[t,A.fadeOut])):t=[A.overlay,A.hideOverlay],e=this.getAboutContent(),this.state.isVisible?(i=[A.contentContainer,A.showContent],this.state.popupState===G?i=[i,A.fadeInDown]:this.state.popupState===M&&(i=[i,A.fadeOutUp])):i=[A.contentContainer,A.hideContent],r.a.createElement("div",{onClick:this.handleOnTouch.bind(this),onTouchStart:this.handleOnTouch.bind(this)},r.a.createElement("div",{style:t}),r.a.createElement("div",{onAnimationEnd:this.contentAnimationEnd.bind(this),style:i},e))}},{key:"contentAnimationEnd",value:function(){this.state.isVisible&&this.state.popupState===M&&this.setState({isVisible:!1,popupState:W})}},{key:"getIconButton",value:function(){return r.a.createElement("div",{onClick:this.hidePopup.bind(this),style:A.iconContainer},r.a.createElement(H,{style:A.icon}))}},{key:"getAboutContent",value:function(){var t=this.getFooter(),e=this.getIconButton(),i=[A.body,A.mediaQueryOnText];return r.a.createElement("div",{ref:this.content,style:A.content},r.a.createElement("div",{style:A.stretchContainer},e,r.a.createElement("div",{style:i},r.a.createElement("div",{style:A.title},"supersynthesis"),r.a.createElement("div",{style:A.description},"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.")),t))}},{key:"getFooter",value:function(){return r.a.createElement("div",{style:A.footerContainer},r.a.createElement("div",{style:A.footer},r.a.createElement("span",null,"Created by\xa0"),r.a.createElement("a",{style:A.link,target:"_blank",rel:"noopener noreferrer",href:"https://amaykataria.com"},"Amay Kataria")),r.a.createElement("div",{style:A.footer},r.a.createElement("span",null,"Sound by\xa0"),r.a.createElement("a",{style:A.link,target:"_blank",rel:"noopener noreferrer",href:"https://www.vaexhibitions.arts.columbia.edu/class-of-2021-first-years/timothy-kwasny"},"Timothy Kwasny")),r.a.createElement("div",{style:A.copyright},"\xa9 Amay Kataria 2022"))}},{key:"showPopup",value:function(){this.content.current.scrollTop=0,this.setState({isVisible:!0,popupState:G})}},{key:"hidePopup",value:function(t){t.stopPropagation(),this.setState({popupState:M})}},{key:"handleOnTouch",value:function(t){t.stopPropagation()}}]),i}(r.a.Component),V=Object(d.a)(U),_=["svgRef","title"];function Z(){return(Z=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var i=arguments[e];for(var n in i)Object.prototype.hasOwnProperty.call(i,n)&&(t[n]=i[n])}return t}).apply(this,arguments)}function J(t,e){if(null==t)return{};var i,n,a=function(t,e){if(null==t)return{};var i,n,a={},s=Object.keys(t);for(n=0;n<s.length;n++)i=s[n],e.indexOf(i)>=0||(a[i]=t[i]);return a}(t,e);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(t);for(n=0;n<s.length;n++)i=s[n],e.indexOf(i)>=0||Object.prototype.propertyIsEnumerable.call(t,i)&&(a[i]=t[i])}return a}var K=function(t){var e=t.svgRef,i=t.title,n=J(t,_);return r.a.createElement("svg",Z({width:"28px",height:"28px",viewBox:"0 0 28 28",ref:e},n),i?r.a.createElement("title",null,i):null,D||(D=r.a.createElement("g",{id:"Group-Copy",transform:"translate(0.5 0.5)"},r.a.createElement("g",{id:"Group",transform:"translate(0 0.0012207031)"},r.a.createElement("path",{d:"M0 0L26.8571 0L26.8571 26.5126L0 26.5126L0 0Z",id:"Rectangle",fill:"#FFFFFF",fillRule:"evenodd",stroke:"#000000",strokeWidth:1})),r.a.createElement("path",{d:"M4.68323 11.5706L8.53964 11.5706L8.53964 15.4269L4.68323 15.4269L4.68323 11.5706Z",id:"Rectangle-49-Copy",fill:"#000000",fillRule:"evenodd",stroke:"none"}),r.a.createElement("path",{d:"M13.0839 0L26.8568 0L26.8568 26.5126L13.0839 26.5126L13.0839 0Z",id:"Rectangle-2",fill:"#000000",fillRule:"evenodd",stroke:"none"}),r.a.createElement("path",{d:"M18.1803 11.5703L22.0367 11.5703L22.0367 15.4267L18.1803 15.4267L18.1803 11.5703Z",id:"Rectangle-49",fill:"#FFFFFF",fillRule:"evenodd",stroke:"none"}))))},Y=r.a.forwardRef((function(t,e){return r.a.createElement(K,Z({svgRef:e},t))})),Q=(i.p,{rotate:d.a.keyframes({"0%":{transform:"rotate(0deg)"},"50%":{transform:"rotate(180deg)"},"100%":{transform:"rotate(360deg)"}})}),X={container:{display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center",height:"10vh",paddingLeft:L.small,paddingRight:L.small,zIndex:1},title:{backgroundColor:I.bgBlack,color:I.fbWhite,padding:L.small,fontFamily:P,fontSize:C.lessBig,letterSpacing:"2px"},iconContainer:{marginTop:L.kindaSmall},simpleRotation:{animation:"x 30s ease-in-out infinite",animationName:Q.rotate},icon:{width:"100%",height:"100%"}},q=function(t){Object(p.a)(i,t);var e=Object(g.a)(i);function i(t){var n;return Object(l.a)(this,i),(n=e.call(this,t)).state={},n.popupRef=r.a.createRef(),n}return Object(c.a)(i,[{key:"render",value:function(){var t=[X.iconContainer,X.simpleRotation];return r.a.createElement("div",{style:X.block},r.a.createElement(V,{ref:this.popupRef}),r.a.createElement("div",{style:X.container},r.a.createElement("div",{style:X.title},"supersynthesis"),r.a.createElement("div",{style:t,onClick:this.handleAbout.bind(this)},r.a.createElement(Y,{style:X.icon}))))}},{key:"handleAbout",value:function(){console.log("Create a popup."),this.popupRef.current.showPopup()}}]),i}(r.a.Component),$=Object(d.a)(q),tt=i(79),et=i.n(tt),it=function(){function t(e,i,n,a,s){Object(l.a)(this,t),this.p5=e,this.lightWidth=s,this.pos=this.p5.createVector(n,a);var r=this.getNewPos()+this.lightWidth/2;this.topPos=this.p5.createVector(r,a-this.p5.height/2),this.bottomPos=this.p5.createVector(r,a+this.p5.height/2),this.lightColor=this.p5.color("white"),this.lightPointColor=this.p5.color("green"),this.curIdx=i,this.updateHeight(),this.growIntervalId="",setInterval(this.randomizeGrowState.bind(this),3e3)}return Object(c.a)(t,[{key:"draw",value:function(t,e){var i=this.getNewPos();if(this.p5.fill(this.lightColor),this.p5.noStroke(),t||e){this.handleGrowState(m),this.handleGrowState(y);var n=this.getHeight(m);this.p5.rect(i,this.pos.y,this.lightWidth,-n),n=this.getHeight(y),this.p5.rect(i,this.pos.y,this.lightWidth,n)}else this.canDraw(m)&&this.p5.rect(i,this.pos.y,this.lightWidth,-this.p5.height/2),this.canDraw(y)&&this.p5.rect(i,this.pos.y,this.lightWidth,this.p5.height/2)}},{key:"randomizeGrowState",value:function(){var t=this,e=function(e){if(t.getGrowState(e).active);else{var i=t.p5.int(t.p5.random(0,2));i=1===i?w:k,S.setGrowState(t.curIdx,e,i,!1)}};e(m),e(y)}},{key:"handleGrowState",value:function(t){var e=this.getGrowState(t).active,i=this.getGrowState(t).state,n=this.getHeight(t);if(e)switch(i){case b:break;case w:n<this.p5.height/2?(n+=2.5,S.setHeightState(this.curIdx,t,n),this.mapPos(t,n)):S.setGrowState(this.curIdx,t,b,!1);break;case k:n>0?(n-=2.5,S.setHeightState(this.curIdx,t,n),this.mapPos(t,n)):S.setGrowState(this.curIdx,t,b,!1)}}},{key:"mapPos",value:function(t,e){t===m?this.topPos.y=this.p5.map(e,0,this.p5.height/2,this.p5.height/2,0):this.bottomPos.y=this.p5.map(e,0,this.p5.height/2,this.p5.height/2,this.p5.height)}},{key:"drawLightPoint",value:function(){var t=this.getNewPos();this.p5.fill(this.lightPointColor),this.p5.circle(t,this.pos.y,10)}},{key:"getNewPos",value:function(){return this.pos.x+this.lightWidth/2}},{key:"getGrowState",value:function(t){return S.getGrowState(this.curIdx)[t]}},{key:"getHeight",value:function(t){return S.getHeightState(this.curIdx)[t]}},{key:"canDraw",value:function(t){return S.getDrawState(this.curIdx)[t]}},{key:"isOn",value:function(t){return S.getLightState(this.curIdx)[t]===v}},{key:"isGrowing",value:function(t){return S.getGrowState(this.curIdx)[t].active}},{key:"updateGrowState",value:function(t){var e=S.getLightState(this.curIdx)[t],i=S.getGrowState(this.curIdx)[t];e===v&&(i.active||i.state===k&&(S.setGrowState(this.curIdx,t,k,!0),S.setLightState(this.curIdx,t,x))),e===x&&(i.active||i.state===w&&(S.setGrowState(this.curIdx,t,w,!0),S.setLightState(this.curIdx,t,v)))}},{key:"updateDrawState",value:function(t,e){S.setDrawState(this.curIdx,t,e)}},{key:"updateHeight",value:function(){var t=S.getLightState(this.curIdx),e=this.p5.height/2,i=m;t[i]===v&&S.setHeightState(this.curIdx,i,e),t[i]===x&&S.setHeightState(this.curIdx,i,0),t[i=y]===v&&S.setHeightState(this.curIdx,i,e),t[i]===x&&S.setHeightState(this.curIdx,i,0)}}]),t}(),nt=function(){function t(e){Object(l.a)(this,t),this.p5=e,this.lights=[],this.curTime=Date.now(),this.gliderIdx=0,this.direction=!0,this.allLightsOff=!1,this.isCurrentlyGrowing=!1,this.timeOn=0}return Object(c.a)(t,[{key:"setup",value:function(){this.prepareLights(),S.setMaxHeight(this.p5.height/2),S.subscribeInfo(this.updateTimeOn.bind(this)),S.subscribeLights(this.updateLights.bind(this))}},{key:"updateTimeOn",value:function(){var t=S.getBpm();this.timeOn=6e4/t}},{key:"updateLights",value:function(){this.resetSystem()}},{key:"prepareLights",value:function(){for(var t=this.p5.width/24,e=t/2,i=0;i<24;i++){var n=i*t,a=new it(this.p5,i,n,this.p5.height/2,e);this.lights.push(a)}}},{key:"draw",value:function(t,e,i){t?this.handleUserInteracting(e,i):(this.isCurrentlyGrowing=!1,this.handleUserNotInteracting());for(var n=0;n<this.lights.length;n++)this.lights[n].draw(t,this.isCurrentlyGrowing)}},{key:"handleUserInteracting",value:function(t,e){this.updateLightConfig(t,e),this.allLightsOff=!1}},{key:"updateLightConfig",value:function(t,e){for(var i=0;i<this.lights.length;i++){var n=this.lights[i],a=t.dist(n.pos);t.y<this.p5.height/2?a<e/2&&n.updateGrowState(m):a<e/2&&n.updateGrowState(y)}}},{key:"handleUserNotInteracting",value:function(){for(var t=0;t<this.lights.length;t++){var e=this.lights[t],i=e.isGrowing(m),n=e.isGrowing(y);this.isCurrentlyGrowing=this.isCurrentlyGrowing||i||n}if((!this.isCurrentlyGrowing&!this.allLightsOff&&this.resetSystem(),!this.isCurrentlyGrowing)&&Date.now()-this.curTime>this.timeOn){var a=this.lights[this.gliderIdx];this.direction?(a.isOn(m)&&(a.updateDrawState(m,!0),this.curTime=Date.now()),this.gliderIdx+=1):(a.isOn(y)&&(a.updateDrawState(y,!0),this.curTime=Date.now()),this.gliderIdx-=1),24===this.gliderIdx&&(this.gliderIdx=23,this.direction=!1),this.gliderIdx<0&&this.resetSystem()}}},{key:"turnOffAllLights",value:function(){console.log("Switch off all lights");for(var t=0;t<this.lights.length;t++){var e=this.lights[t];e.updateDrawState(m,!1),e.updateDrawState(y,!1)}this.allLightsOff=!0}},{key:"resetSystem",value:function(){this.turnOffAllLights(),this.gliderIdx=0,this.direction=!0}}]),t}(),at=function(){function t(e){Object(l.a)(this,t),this.p5=e,this.ellipsePos=this.p5.createVector(0,0),this.boundaryWidth=this.p5.height/2}return Object(c.a)(t,[{key:"draw",value:function(t,e){if(t){this.ellipsePos.x+=.015*(this.p5.mouseX-this.ellipsePos.x),this.ellipsePos.y+=.015*(this.p5.mouseY-this.ellipsePos.y),this.containEllipse();for(var i=0;i<e.length;i++){var n=e[i];if(this.ellipsePos.y<this.p5.height/2){var a=n.topPos,s=n.getHeight(m);s<this.p5.height/2&&s>0&&this.drawLine(a,this.ellipsePos,i)}else{var r=n.bottomPos,o=n.getHeight(y);o<this.p5.height/2&&o>0&&this.drawLine(r,this.ellipsePos,i)}}this.drawEllipse()}}},{key:"containEllipse",value:function(){this.ellipsePos.x>this.p5.width&&(this.ellipsePos.x=this.p5.width),this.ellipsePos.x<0&&(this.ellipsePos.x=0),this.ellipsePos.y>this.p5.height&&(this.ellipsePos.y=this.p5.height),this.ellipsePos.y<0&&(this.ellipsePos.y=0)}},{key:"drawEllipse",value:function(){this.p5.fill(this.p5.color(255,255,255,150)),this.p5.strokeWeight(3),this.p5.stroke(this.p5.color("black")),this.p5.ellipse(this.ellipsePos.x,this.ellipsePos.y,60)}},{key:"drawLine",value:function(t,e,i){var n=this.p5.map(i,0,24,100,200),a=this.p5.map(i,0,25,2,4);this.p5.stroke(this.p5.color(255,255,255,n)),this.p5.strokeWeight(a),this.p5.line(t.x,t.y,e.x,e.y)}}]),t}(),st=function(){function t(e){Object(l.a)(this,t),this.p5=e,this.curBpm=S.bpm,this.bpmSubscribers=[],this.curTime=""}return Object(c.a)(t,[{key:"update",value:function(t,e,i){if(t){var n=!1;n=e.x>this.p5.width/2&&e.y<this.p5.height/2||e.x<this.p5.width/2&&e.y>this.p5.height/2;for(var a=0,s=0;s<i.length;s++){var r=i[s];r.isOn(m)&&(a+=1),r.isOn(y)&&(a+=1)}var o=Date.now()-this.curTime,h=this.p5.sin(o/a),l=this.p5.map(h,-1,1,0,.25);this.curBpm=n?this.curBpm+l:this.curBpm-l,this.curBpm<100&&(this.curBpm=100),this.curBpm>250&&(this.curBpm=250),S.setBpm(Math.floor(this.curBpm))}else this.curTime=Date.now()}}]),t}(),rt=function(t){var e,i,n,a=!1;t.setup=function(){var a=t.select("#canvasContainer").height;t.createCanvas(window.innerWidth,a),e=new nt(t),i=new at(t),n=new st(t),e.setup()},t.draw=function(){t.background(t.color(0,0,0)),e.draw(a,i.ellipsePos,i.boundaryWidth),t.drawCenterLine(),i.draw(a,e.lights),n.update(a,i.ellipsePos,e.lights)},t.drawCenterLine=function(){t.stroke("black"),t.strokeWeight(6),t.line(0,t.height/2,t.width,t.height/2)},t.mousePressed=function(){t.mouseY>t.height||t.mouseY<0||(a=!0)},t.mouseReleased=function(){a=!1}},ot={container:{backgroundColor:I.bgBlack,height:"82vh",margin:0,padding:0,zIndex:1}},ht=function(t){Object(p.a)(i,t);var e=Object(g.a)(i);function i(t){var n;return Object(l.a)(this,i),(n=e.call(this,t)).containerRef=r.a.createRef(),n.sketchRef=r.a.createRef(),n}return Object(c.a)(i,[{key:"componentDidMount",value:function(){console.log("Wave canvas mounted"),this.myP5=new et.a(rt,this.sketchRef.current)}},{key:"render",value:function(){return r.a.createElement("div",{id:"canvasContainer",ref:this.sketchRef,style:ot.container})}}]),i}(r.a.Component),lt=Object(d.a)(ht),ct={container:{position:"fixed",height:"8vh",left:"0",right:"0",bottom:"0",display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center",paddingLeft:L.small,paddingRight:L.small,color:I.fbWhite,fontFamily:E,fontSize:C.lessBig,letterSpacing:"2px",zIndex:1},info:{backgroundColor:I.bgBlack,padding:L.verySmall}},ut=function(t){Object(p.a)(i,t);var e=Object(g.a)(i);function i(t){var n;return Object(l.a)(this,i),(n=e.call(this,t)).state={bpm:"",index:""},S.subscribeInfo(n.onInfoUpdate.bind(Object(u.a)(n))),n}return Object(c.a)(i,[{key:"render",value:function(){var t=this.state.bpm+"bpm",e="#"+this.state.index;return r.a.createElement("div",{style:ct.container},r.a.createElement("div",{style:ct.info},e),r.a.createElement("div",{style:ct.info},t),r.a.createElement("div",{onClick:this.onSend.bind(this),style:ct.info},"Send"))}},{key:"onInfoUpdate",value:function(){var t=S.getConfigIndex(),e=S.getBpm();this.setState({index:t+1,bpm:e})}},{key:"onSend",value:function(t){t.stopPropagation(),O.commitLightConfigData()}}]),i}(r.a.Component),pt=Object(d.a)(ut),gt={container:{position:"fixed",top:"0px",left:"0px",right:"0px",bottom:"0px",display:"flex",flexDirection:"column",color:"white",height:"100vh",width:"100vw",zIndex:"1"},button:{width:"100px",height:"50px",backgroundColor:"white",color:"black"}},dt=function(t){Object(p.a)(i,t);var e=Object(g.a)(i);function i(t){var n;return Object(l.a)(this,i),n=e.call(this,t),window.addEventListener("resize",n.handleResize.bind(Object(u.a)(n))),n.state={isLandscape:n.isLandscape(),isPortrait:n.isPortrait()},n}return Object(c.a)(i,[{key:"render",value:function(){return r.a.createElement("div",{style:gt.container},r.a.createElement($,null),r.a.createElement(lt,null),r.a.createElement(pt,null))}},{key:"onClick",value:function(t){t.stopPropagation(),O.saveEntry()}},{key:"handleResize",value:function(){console.log("Resize triggered"),this.setState({isLandscape:this.isLandscape(),isPortrait:this.isPortrait()})}},{key:"isLandscape",value:function(){var t=window.innerHeight<window.innerWidth;return t&&console.log("App: Landscape"),t}},{key:"isPortrait",value:function(){var t=window.innerHeight>window.innerWidth;return t&&console.log("App: Portrait"),t}}]),i}(r.a.Component),ft=Object(d.a)(dt),mt=i(41);h.a.render(r.a.createElement(mt.a,null,r.a.createElement(ft,null)),document.getElementById("root"))},81:function(t,e,i){t.exports=i(179)},86:function(t,e,i){},87:function(t,e,i){}},[[81,1,2]]]);
//# sourceMappingURL=main.01942fc6.chunk.js.map