(this.webpackJsonpsupersynthesis=this.webpackJsonpsupersynthesis||[]).push([[0],{183:function(t,e,i){"use strict";i.r(e);var n,a,s=i(0),o=i.n(s),r=i(49),h=i.n(r),l=(i(90),i(91),i(2)),c=i(3),u=i(7),p=i(5),d=i(4),g=i(6),f={bgBlack:"black",fgWhite:"white",selected:"red",disabled:"grey"},m={extraSmall:"8px",kindaSmall:"10px",verySmall:"12px",lessSmall:"14px",small:"16px",lessBig:"18px",big:"20px",veryBig:"24px",extraBig:"28px",huge:"32px",veryHuge:"36px",extraHuge:"40px",massive:"44px",veryMassive:"48px",extraMassive:"52px",enormous:"56px",veryEnormous:"60px",extraEnormous:"64px",insane:"68px",veryInsaane:"72px",extraInsane:"76px",gaia:"80px",veryGaia:"84px",extraGaia:"88px"},v={tiny:"2px",extraSmall:"4px",kindaSmall:"6px",verySmall:"8px",small:"12px",lessBig:"16px",big:"20px",veryBig:"28px",extraBig:"36px",huge:"52px",veryHuge:"64px",extraHuge:"76px",massive:"92px",veryMassive:"108px",extraMassive:"124px",enourmous:"100px",veryEnormous:"120px",extraEnormous:"140px",insane:"160px",veryInsane:"200px",extraInsane:"240px"},y="heatwaveregular",b="josefin_sanssemibold",x=["svgRef","title"];function k(){return(k=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var i=arguments[e];for(var n in i)Object.prototype.hasOwnProperty.call(i,n)&&(t[n]=i[n])}return t}).apply(this,arguments)}function w(t,e){if(null==t)return{};var i,n,a=function(t,e){if(null==t)return{};var i,n,a={},s=Object.keys(t);for(n=0;n<s.length;n++)i=s[n],e.indexOf(i)>=0||(a[i]=t[i]);return a}(t,e);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(t);for(n=0;n<s.length;n++)i=s[n],e.indexOf(i)>=0||Object.prototype.propertyIsEnumerable.call(t,i)&&(a[i]=t[i])}return a}var S,C=function(t){var e=t.svgRef,i=t.title,s=w(t,x);return o.a.createElement("svg",k({viewBox:"0 0 48.51 48.51",ref:e},s),i?o.a.createElement("title",null,i):null,n||(n=o.a.createElement("defs",null,o.a.createElement("style",null,".rect{fill:inherit;}.cls-2{fill:none;stroke:#b3b3b3;stroke-miterlimit:10;stroke-width:4px;}"))),a||(a=o.a.createElement("g",{id:"Layer_2","data-name":"Layer 2"},o.a.createElement("g",{id:"Layer_1-2","data-name":"Layer 1"},o.a.createElement("rect",{className:"rect",width:48.51,height:48.51}),o.a.createElement("line",{className:"cls-2",x1:9.63,y1:9.64,x2:38.88,y2:38.89}),o.a.createElement("line",{className:"cls-2",x1:9.63,y1:38.89,x2:38.88,y2:9.64})))))},E=o.a.forwardRef((function(t,e){return o.a.createElement(C,k({svgRef:e},t))})),O=(i.p,i(29)),I=new(function(){function t(){Object(l.a)(this,t),this.isEditMode=!1,this.isUserInteracting=!1,this.isPopupActive=!1,this.subscribers=[]}return Object(c.a)(t,[{key:"subscribe",value:function(t){this.subscribers.push(t)}},{key:"setEditMode",value:function(t){this.isEditing!==t&&(this.isEditMode=t,this.subscribers.forEach((function(t){return t()})))}},{key:"setUserInteracting",value:function(t){this.isUserInteracting!==t&&(console.log("User Interacting: "+t),this.isUserInteracting=t,this.subscribers.forEach((function(t){return t()})))}},{key:"setIsPopupActive",value:function(t){this.isPopupActive!==t&&(console.log("Popup Active:"+t),this.isPopupActive=t,this.subscribers.forEach((function(t){return t()})))}}]),t}()),B=i(82),M=new(function(){function t(){Object(l.a)(this,t),this.dbBpm=100,this.localBpm=100,this.subscribers=[]}return Object(c.a)(t,[{key:"subscribe",value:function(t){this.subscribers.push(t)}},{key:"getDbBpm",value:function(){return this.dbBpm}},{key:"getLocalBpm",value:function(){return this.localBpm}},{key:"setDbBpm",value:function(t){this.dbBpm=t,this.localBpm=t,this.subscribers.forEach((function(t){t()}))}},{key:"setLocalBpm",value:function(t){this.localBpm!==t&&(this.localBpm=t,this.subscribers.forEach((function(t){t()})))}}]),t}()),j=new(function(){function t(){Object(l.a)(this,t),this.configIndex=0,this.subscriber=""}return Object(c.a)(t,[{key:"getConfigIndex",value:function(){return this.configIndex}},{key:"subscribe",value:function(t){this.subscriber=t}},{key:"setConfigIndex",value:function(t){this.configIndex=t,this.subscriber()}}]),t}()),L=new(function(){function t(){Object(l.a)(this,t),this.isEditMode=!1,this.popupListener="",this.resetListener="",this.resetTimerId="",this.popupTimerId=""}return Object(c.a)(t,[{key:"subscribePopup",value:function(t){this.popupListener=t}},{key:"subscribeReset",value:function(t){this.resetListener=t}},{key:"startTimer",value:function(){""!==this.popupTimerId&&clearTimeout(this.popupTimerId),this.popupTimerId=setTimeout(this.showPopup.bind(this),3e3),""!==this.resetTimerId&&clearTimeout(this.resetTimerId),this.resetTimerId=setTimeout(this.reset.bind(this),3e4)}},{key:"showPopup",value:function(){this.popupListener(),this.popupTimerId=""}},{key:"reset",value:function(){console.log("Trigger reset"),this.resetListener()}},{key:"cancelReset",value:function(){""!==this.resetTimerId&&(console.log("Clearing Reset"),clearTimeout(this.resetTimerId),this.resetTimerId="")}},{key:"cancelPopup",value:function(){console.log("Clearing Popup"),clearTimeout(this.popupTimerId),this.popupTimerId=""}}]),t}()),P=1,R=0,T=0,A=1,D=2,H=new(function(){function t(){Object(l.a)(this,t),this.dbLightConfig=[],this.growConfig=[],this.heightConfig=[],this.activeLightConfig=[],this.maxLightHeight=0,this.prepareDefaultLightConfig(),this.hasConfigEdited=!1,this.configEditSubscriber=""}return Object(c.a)(t,[{key:"subscribeForConfigChange",value:function(t){this.configEditSubscriber=t}},{key:"setMaxHeight",value:function(t){this.maxLightHeight=t}},{key:"prepareDefaultLightConfig",value:function(){console.log("Preparing default config.");for(var t=0;t<24;t++){var e=0===Math.round(Math.random())?P:R;this.dbLightConfig.push(e),this.activeLightConfig.push(e),this.growConfig.push({state:T,active:!1}),this.heightConfig.push(0)}}},{key:"getActiveLightConfig",value:function(){return this.activeLightConfig}},{key:"setLightConfig",value:function(t){for(var e=0;e<t.length;e++){var i=t[e];this.dbLightConfig[e]=i,this.activeLightConfig[e]=i,this.growConfig[e]={state:T,active:!1},this.heightConfig[e]=i===P?this.maxLightHeight:0}!0===this.hasConfigEdited&&(this.hasConfigEdited=!1,this.configEditSubscriber())}},{key:"getDbLightState",value:function(t){return this.dbLightConfig[t]}},{key:"getActiveLightState",value:function(t){return this.activeLightConfig[t]}},{key:"setActiveLightState",value:function(t,e){this.activeLightConfig[t]=e,!1===this.hasConfigEdited&&(this.hasConfigEdited=!0,this.configEditSubscriber()),L.cancelReset()}},{key:"getGrowState",value:function(t){return this.growConfig[t]}},{key:"setGrowState",value:function(t,e,i){this.growConfig[t].state=e,this.growConfig[t].active=i}},{key:"getHeightState",value:function(t){return this.heightConfig[t]}},{key:"setHeightState",value:function(t,e){this.heightConfig[t]=e}}]),t}()),F=new(function(){function t(){Object(l.a)(this,t),this.drawConfig=[],this.indices=[]}return Object(c.a)(t,[{key:"getIndices",value:function(){return this.indices}},{key:"setSequencerData",value:function(t){var e=t.state;if("NONE"===e){for(var i=0;i<24;i++)this.drawConfig[i]=R;this.indices=[]}else for(var n=0;n<e.length;n++)for(var a=e[n],s=0;s<a.length;s++){var o=a[s].idx,r=a[s].val;this.drawConfig[o]=r,this.indices[s]=o}}},{key:"clearConfig",value:function(){this.drawConfig.length=0}},{key:"getLightState",value:function(t){return this.drawConfig[t]}}]),t}()),z=0,W=1,N=2,U=3,G=new(function(){function t(){Object(l.a)(this,t),this.currentMode=z,this.subscribers=[]}return Object(c.a)(t,[{key:"subscribe",value:function(t){this.subscribers.push(t)}},{key:"getCurrentMode",value:function(){return this.currentMode}},{key:"setMode",value:function(t,e){this.currentMode!==t&&(this.currentMode=t,this.subscribers.forEach((function(e){e(t)})),e&&Y.commitModeData())}}]),t}()),_=new(function(){function t(){Object(l.a)(this,t),this.subscribers=[],this.currentState=Array(24).fill(0)}return Object(c.a)(t,[{key:"subscribe",value:function(t){this.subscribers.push(t)}},{key:"setSynthNotes",value:function(t){var e=this;this.currentState=t,this.subscribers.forEach((function(t){t(e.currentState)}))}}]),t}()),Y=new(function(){function t(){Object(l.a)(this,t),this.siteURL="https://supersynth.herokuapp.com/app",this.socket=Object(B.a)(this.siteURL,{reconnection:!0,reconnectionDelay:500,reconnectionAttempts:1/0}),this.socket.once("connect",this.subscribe.bind(this))}return Object(c.a)(t,[{key:"subscribe",value:function(){var t=this;console.log("Connected"),this.socket.on("event_time",this.logTime.bind(this)),this.socket.on("event_full_payload",(function(e){t.processFullPayload(e)})),this.socket.on("event_sequencer_payload",(function(t){F.setSequencerData(t)})),this.socket.on("event_mode_payload",(function(t){G.setMode(t,!1)})),this.socket.on("event_synth_notes",(function(t){_.setSynthNotes(t)}))}},{key:"disconnect",value:function(){console.log("Socket Server Disconnected.")}},{key:"logTime",value:function(t){}},{key:"sendSynthNotes",value:function(t){this.socket.emit("event_synth_notes",t)}},{key:"commitModeData",value:function(){var t=G.getCurrentMode();this.socket.emit("event_mode_payload",t)}},{key:"commitLightConfigData",value:function(){var t=H.getActiveLightConfig(),e=M.getLocalBpm(),i=j.getConfigIndex()+1;this.json={},this.json.bpm=e,this.json.lights=t,this.json.time=Date();var n={index:i,config:JSON.stringify(this.json)};this.socket.emit("event_score_payload",n)}},{key:"processFullPayload",value:function(t){var e=t.index;j.setConfigIndex(e);var i=t.config,n=i.bpm;M.setDbBpm(n);var a=i.lights;H.setLightConfig(a),F.clearConfig()}}]),t}()),V=0,q=1,J=2,K=0,X=1,Z=g.a.keyframes({from:{opacity:"0"},to:{opacity:"0.5"}},"fadesIn"),Q=g.a.keyframes({from:{opacity:"0.5"},to:{opacity:"0"}},"fadesOut"),$={overlay:{position:"fixed",top:"0px",bottom:"0px",left:"0px",right:"0px",background:f.bgBlack,zIndex:"999"},fadeIn:{animationName:Z,animationDuration:"0.5s",animationFillMode:"forwards",animationTimingFunction:"ease-in"},fadeOut:{animationName:Q,animationDuration:"0.5s",animationFillMode:"forwards",animationTimingFunction:"ease-out"},fadeOutUp:{animationName:g.a.keyframes(O.fadeOutUp,"fadeOutUp"),animationDuration:"0.5s",animationFillMode:"forwards",animationTimingFunction:"ease-out"},fadeOutDown:{animationName:g.a.keyframes(O.fadeOutDown,"fadeOutDown"),animationDuration:"0.5s",animationFillMode:"forwards",animationTimingFunction:"ease-out"},fadeInDown:{animationName:g.a.keyframes(O.fadeInDown,"fadeInDown"),animationDuration:"1.0s",animationFillMode:"forwards",animationTimingFunction:"ease-in"},fadeInUp:{animationName:g.a.keyframes(O.fadeInUp,"fadeInUp"),animationDuration:"1.0s",animationFillMode:"forwards",animationTimingFunction:"ease-in"},showOverlay:{zIndex:"998",opacity:"1"},hideOverlay:{zIndex:"-998",opacity:"0"},showContent:{zIndex:"999",opacity:"1"},hideContent:{zIndex:"-999",opacity:"0"},contentContainer:{position:"fixed",zIndex:"-999",left:"0px",top:"0px",bottom:"0px",display:"flex",alignItems:"center",justifyContent:"center",height:"100%",width:"100%"},content:{borderRadius:m.tiny,overflow:"auto",maxWidth:"calc(100% - 50px)",maxHeight:"calc(100% - 100px)","@media (min-width: 600px)":{maxWidth:"calc(100% - 100px)",maxHeight:"calc(100% - 100px)"},"@media (min-width: 750px)":{maxWidth:"calc(100% - 150px)",maxHeight:"calc(100% - 100px)"},"@media (min-width: 1200px)":{maxWidth:"calc(100% - 300px)",maxHeight:"calc(100% - 100px)"}},stretchContainer:{display:"flex",flexDirection:"column",alignItems:"center",background:f.bgBlack,color:f.fgWhite,paddingLeft:v.small,paddingRight:v.small,"@media (min-width: 600px)":{paddingLeft:v.extraHuge,paddingRight:v.extraHuge},"@media (min-width: 900px)":{paddingLeft:v.veryMassive,paddingRight:v.veryMassive},"@media (min-width: 1200px)":{paddingLeft:v.extraMassive,paddingRight:v.extraMassive},opacity:"1.0",borderStyle:"solid",borderWidth:"2px",borderColor:f.fgWhite},title:{marginTop:v.lessSmall,marginBottom:v.small,textAlign:"center",fontFamily:y,fontSize:m.extraBig,letterSpacing:"2.5px",lineHeight:"1.8","@media (min-width: 750px)":{fontSize:m.extraBig},"@media (min-width: 900px)":{fontSize:m.huge},"@media (min-width: 1200px)":{fontSize:m.veryHuge}},sendTitle:{marginTop:v.small,textAlign:"center",fontFamily:y,fontSize:m.extraBig,letterSpacing:"2.5px","@media (min-width: 750px)":{fontSize:m.extraBig},"@media (min-width: 900px)":{fontSize:m.huge},"@media (min-width: 1200px)":{fontSize:m.veryHuge}},subtitle:{marginBottom:v.lessBig,textAlign:"center",fontFamily:y,fontSize:m.verySmall,letterSpacing:"2.5px","@media (min-width: 750px)":{fontSize:m.lessSmall},"@media (min-width: 900px)":{fontSize:m.small},"@media (min-width: 1200px)":{fontSize:m.small}},buttonContainer:{display:"flex",flexContainer:"row",marginTop:v.extraSmall,marginBottom:v.big,justifyContent:"space-evenly"},button:{background:f.fgWhite,padding:v.verySmall,color:f.bgBlack,fontFamily:y,letterSpacing:"2.5px",fontSize:m.small,"@media (min-width: 750px)":{fontSize:m.lessBig},"@media (min-width: 900px)":{fontSize:m.big},"@media (min-width: 1200px)":{fontSize:m.veryBig}},body:{display:"flex",flexDirection:"column",justifyContent:"center",fontFamily:b,letterSpacing:"1.5px",fontSize:m.small,color:f.fgWhite},mediaQueryOnText:{"@media (min-width: 750px)":{fontSize:m.big},"@media (min-width: 900px)":{fontSize:m.veryBig}},iconContainer:{display:"flex",alignItems:"center",justifyContent:"center",alignSelf:"flex-end",marginRight:"-"+m.verySmall,height:m.big,width:m.big,fill:f.fgWhite,"@media (min-width: 600px)":{marginRight:"-"+m.extraInsane,height:m.veryBig,width:m.veryBig},"@media (min-width: 900px)":{height:m.extraBig,width:m.extraBig,marginRight:"-108px"},"@media (min-width: 1200px)":{marginRight:"-124px"}},icon:{width:"100%",height:"100%"},footerContainer:{display:"flex",flexDirection:"column",alignItems:"center",marginTop:v.veryBig,fontFamily:b,letterSpacing:"1.5px"},footer:{display:"flex",alignItems:"center",marginTop:v.verySmall,fontSize:m.lessSmall,"@media (min-width: 750px)":{fontSize:m.small}},copyright:{marginTop:v.veryBig,fontSize:m.verySmall,marginBottom:v.small},link:{backgroundColor:f.fgWhite,color:f.bgBlack,padding:v.tiny}},tt=function(t){Object(p.a)(i,t);var e=Object(d.a)(i);function i(t){var n;return Object(l.a)(this,i),(n=e.call(this,t)).state={isVisible:!1,popupState:J,popupType:K},n.content=o.a.createRef(),n}return Object(c.a)(i,[{key:"render",value:function(){var t,e,i;return this.state.isVisible?(t=[$.overlay,$.showOverlay],this.state.popupState===V?t=[t,$.fadeIn]:this.state.popupState===q&&(t=[t,$.fadeOut])):t=[$.overlay,$.hideOverlay],e=this.state.popupType===K?this.getAboutContent():this.getSendContent(),this.state.isVisible?(i=[$.contentContainer,$.showContent],this.state.popupState===V?i=[i,$.fadeInDown]:this.state.popupState===q&&(i=[i,$.fadeOutUp])):i=[$.contentContainer,$.hideContent],o.a.createElement("div",{onClick:this.handleOnTouch.bind(this),onTouchStart:this.handleOnTouch.bind(this)},o.a.createElement("div",{style:t}),o.a.createElement("div",{onAnimationEnd:this.contentAnimationEnd.bind(this),style:i},e))}},{key:"contentAnimationEnd",value:function(){this.state.isVisible&&this.state.popupState===q&&this.setState({isVisible:!1,popupState:J})}},{key:"getIconButton",value:function(){return o.a.createElement("div",{onClick:this.hidePopup.bind(this),style:$.iconContainer},o.a.createElement(E,{style:$.icon}))}},{key:"getSendContent",value:function(){var t=[$.body,$.mediaQueryOnText],e=this.getIconButton();return o.a.createElement("div",{ref:this.content,style:$.content},o.a.createElement("div",{style:$.stretchContainer},e,o.a.createElement("div",{style:t},o.a.createElement("div",{style:$.sendTitle},"SEND"),o.a.createElement("div",{style:$.subtitle},"supersynthesis"),o.a.createElement("div",{style:$.buttonContainer},o.a.createElement("div",{onClick:this.onYesHandle.bind(this),style:$.button},"yes"),o.a.createElement("div",{onClick:this.onNoHandle.bind(this),style:$.button},"no")))))}},{key:"getAboutContent",value:function(){var t=this.getFooter(),e=this.getIconButton(),i=[$.body,$.mediaQueryOnText];return o.a.createElement("div",{ref:this.content,style:$.content},o.a.createElement("div",{style:$.stretchContainer},e,o.a.createElement("div",{style:i},o.a.createElement("div",{style:$.title},"supersynthesis"),o.a.createElement("div",{style:$.description},"Supersynthesis is an interactive audio-visual art installation that invites people to create a space for collective expression and participation. Accompanied with a physical installation, it utilizes the medium of light and sound to craft a communal experience where the audience activates the piece and the space around it by interacting with it through an online interface. Every audience input is blended into the previous response, thus synthesizing a progressively evolving wave of expression. In an increasingly fragmented society, this project aspires to create an inclusive space, where anybody can leave a trace of their thought with freedom. By participating in Supersynthesis, one becomes part of a communal wave that\u2019ll anonymously accumulate until the forthcoming eternity.")),t))}},{key:"getFooter",value:function(){return o.a.createElement("div",{style:$.footerContainer},o.a.createElement("div",{style:$.footer},o.a.createElement("span",null,"Created by\xa0"),o.a.createElement("a",{style:$.link,target:"_blank",rel:"noopener noreferrer",href:"https://amaykataria.com"},"Amay Kataria")),o.a.createElement("div",{style:$.footer},o.a.createElement("span",null,"Sound by\xa0"),o.a.createElement("a",{style:$.link,target:"_blank",rel:"noopener noreferrer",href:"https://timkwasny96.wixsite.com/site"},"Timothy Kwasny")),o.a.createElement("div",{style:$.copyright},"\xa9 Amay Kataria 2022"))}},{key:"onYesHandle",value:function(t){t.stopPropagation(),L.cancelReset(),I.setEditMode(!1),I.setUserInteracting(!1),this.hidePopup(t),Y.commitLightConfigData()}},{key:"onNoHandle",value:function(t){t.stopPropagation(),I.setUserInteracting(!1),this.hidePopup(t)}},{key:"showPopup",value:function(t){console.log("Create a popup."),this.content.current.scrollTop=0,this.setState({isVisible:!0,popupState:V,popupType:t}),I.setIsPopupActive(!0),I.setUserInteracting(!1)}},{key:"hidePopup",value:function(t){I.setIsPopupActive(!1),t&&t.stopPropagation(),this.setState({popupState:q})}},{key:"handleOnTouch",value:function(t){t.stopPropagation()}}]),i}(o.a.Component),et=Object(g.a)(tt),it=["svgRef","title"];function nt(){return(nt=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var i=arguments[e];for(var n in i)Object.prototype.hasOwnProperty.call(i,n)&&(t[n]=i[n])}return t}).apply(this,arguments)}function at(t,e){if(null==t)return{};var i,n,a=function(t,e){if(null==t)return{};var i,n,a={},s=Object.keys(t);for(n=0;n<s.length;n++)i=s[n],e.indexOf(i)>=0||(a[i]=t[i]);return a}(t,e);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(t);for(n=0;n<s.length;n++)i=s[n],e.indexOf(i)>=0||Object.prototype.propertyIsEnumerable.call(t,i)&&(a[i]=t[i])}return a}var st=function(t){var e=t.svgRef,i=t.title,n=at(t,it);return o.a.createElement("svg",nt({width:"28px",height:"28px",viewBox:"0 0 28 28",ref:e},n),i?o.a.createElement("title",null,i):null,S||(S=o.a.createElement("g",{id:"Group-Copy",transform:"translate(0.5 0.5)"},o.a.createElement("g",{id:"Group",transform:"translate(0 0.0012207031)"},o.a.createElement("path",{d:"M0 0L26.8571 0L26.8571 26.5126L0 26.5126L0 0Z",id:"Rectangle",fill:"#FFFFFF",fillRule:"evenodd",stroke:"#000000",strokeWidth:1})),o.a.createElement("path",{d:"M4.68323 11.5706L8.53964 11.5706L8.53964 15.4269L4.68323 15.4269L4.68323 11.5706Z",id:"Rectangle-49-Copy",fill:"#000000",fillRule:"evenodd",stroke:"none"}),o.a.createElement("path",{d:"M13.0839 0L26.8568 0L26.8568 26.5126L13.0839 26.5126L13.0839 0Z",id:"Rectangle-2",fill:"#000000",fillRule:"evenodd",stroke:"none"}),o.a.createElement("path",{d:"M18.1803 11.5703L22.0367 11.5703L22.0367 15.4267L18.1803 15.4267L18.1803 11.5703Z",id:"Rectangle-49",fill:"#FFFFFF",fillRule:"evenodd",stroke:"none"}))))},ot=o.a.forwardRef((function(t,e){return o.a.createElement(st,nt({svgRef:e},t))})),rt=(i.p,{rotate:g.a.keyframes({"0%":{transform:"rotate(0deg)"},"50%":{transform:"rotate(180deg)"},"100%":{transform:"rotate(360deg)"}})}),ht={container:{position:"relative",display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center",paddingLeft:v.small,paddingRight:v.small,zIndex:"1"},title:{backgroundColor:f.bgBlack,color:f.fbWhite,padding:v.small,fontFamily:y,fontSize:m.lessBig,letterSpacing:"2px"},iconContainer:{display:"flex",justifyContent:"center",width:m.huge,height:m.huge,marginTop:v.kindaSmall},simpleRotation:{animation:"x 30s ease-in-out infinite",animationName:rt.rotate},icon:{width:"100%",height:"100%"}},lt=function(t){Object(p.a)(i,t);var e=Object(d.a)(i);function i(t){var n;return Object(l.a)(this,i),(n=e.call(this,t)).state={},n.popupRef=o.a.createRef(),n}return Object(c.a)(i,[{key:"componentDidMount",value:function(){L.subscribePopup(this.onShowPopup.bind(this)),L.subscribeReset(this.onReset.bind(this))}},{key:"onShowPopup",value:function(){this.popupRef.current.showPopup(X),console.log("Show Poppup")}},{key:"onReset",value:function(){I.setEditMode(!1),I.setUserInteracting(!1),this.popupRef.current.state.popupType===X&&this.popupRef.current.hidePopup()}},{key:"render",value:function(){var t=[ht.iconContainer,ht.simpleRotation],e=this.getHeightStyle();return o.a.createElement("div",{style:ht.block},o.a.createElement(et,{ref:this.popupRef}),o.a.createElement("div",{style:[ht.container,e]},o.a.createElement("div",{style:ht.title},"supersynthesis"),o.a.createElement("div",{style:t,onClick:this.handleAbout.bind(this)},o.a.createElement(ot,{style:ht.icon}))))}},{key:"getHeightStyle",value:function(){return{height:this.getHeight()+"px"}}},{key:"getHeight",value:function(){var t=window.innerHeight,e=window.innerWidth,i=0;return this.props.orientation===Rt.PORTRAIT&&(t<900&&(i=.1),t>900&&t<1e3&&(i=.075),t>1e3&&(i=.06)),this.props.orientation===Rt.LANDSCAPE&&(e<1e3&&(i=.15),e>1e3&&(i=.09)),t*i}},{key:"handleAbout",value:function(){this.popupRef.current.showPopup(K)}}]),i}(o.a.Component),ct=Object(g.a)(lt),ut=i(81),pt=i.n(ut),dt=function(){function t(e,i,n,a,s){Object(l.a)(this,t),this.p5=e,this.lightWidth=s,this.growFactor=this.p5.random(1.5,2.5),this.pos=this.p5.createVector(n,a);var o=this.getNewPos()+this.lightWidth/2;this.topPos=this.p5.createVector(o,0),this.top=this.p5.createVector(o,0),this.lightActiveColor=this.p5.color("white"),this.lightInactiveColor=this.p5.color(255,255,255,125),this.lightBgColor=this.p5.color(255,255,255,30),this.lightPointColor=this.p5.color("green"),this.curIdx=i,this.updateHeight(),this.growIntervalId="",setInterval(this.randomizeGrowState.bind(this),500)}return Object(c.a)(t,[{key:"draw",value:function(t,e){var i=I.isEditMode,n=this.getNewPos();if(this.p5.noStroke(),this.p5.fill(this.lightBgColor),this.p5.rect(n,this.pos.y,this.lightWidth,-this.p5.height),i){this.updateLight(t,e);var a=this.getHeight();this.p5.fill(this.lightActiveColor),this.p5.rect(n,this.pos.y,this.lightWidth,-a)}else(this.isOnFromDb()||G.getCurrentMode()===U)&&(this.p5.fill(this.lightInactiveColor),this.p5.rect(n,this.pos.y,this.lightWidth,-this.p5.height)),this.canDraw()&&(this.p5.fill(this.lightActiveColor),this.p5.rect(n,this.pos.y,this.lightWidth,-this.p5.height))}},{key:"updateLight",value:function(t,e){if(I.isUserInteracting){var i=t.dist(this.pos),n=t.dist(this.top);(i<e/2||n<e/2)&&this.updateGrowState()}this.handleGrowState()}},{key:"updateGrowState",value:function(){var t=H.getActiveLightState(this.curIdx),e=H.getGrowState(this.curIdx);t===P&&(e.active||e.state===D&&(H.setGrowState(this.curIdx,D,!0),H.setActiveLightState(this.curIdx,R))),t===R&&(e.active||e.state===A&&(H.setGrowState(this.curIdx,A,!0),H.setActiveLightState(this.curIdx,P)))}},{key:"handleGrowState",value:function(){var t=this.getGrowState().active,e=this.getGrowState().state,i=this.getHeight();if(t)switch(e){case T:break;case A:i<this.p5.height?(i+=this.growFactor,H.setHeightState(this.curIdx,i),this.mapPos(i)):H.setGrowState(this.curIdx,T,!1);break;case D:i>0?(i-=this.growFactor,H.setHeightState(this.curIdx,i),this.mapPos(i)):H.setGrowState(this.curIdx,T,!1)}}},{key:"updateHeight",value:function(){var t=H.getActiveLightState(this.curIdx),e=this.p5.height;t===P&&H.setHeightState(this.curIdx,e),t===R&&H.setHeightState(this.curIdx,0)}},{key:"mapPos",value:function(t){this.topPos.y=this.p5.map(t,0,this.p5.height,this.p5.height,0)}},{key:"drawLightPoint",value:function(){var t=this.getNewPos();this.p5.fill(this.lightPointColor),this.p5.circle(t,this.pos.y,5)}},{key:"getNewPos",value:function(){return this.pos.x+this.lightWidth/2}},{key:"getGrowState",value:function(){return H.getGrowState(this.curIdx)}},{key:"getHeight",value:function(){return H.getHeightState(this.curIdx)}},{key:"canDraw",value:function(){return F.getLightState(this.curIdx)}},{key:"isOn",value:function(){return H.getActiveLightState(this.curIdx)}},{key:"isOnFromDb",value:function(){return H.getDbLightState(this.curIdx)}},{key:"isGrowing",value:function(){return H.getGrowState(this.curIdx).active}},{key:"updateDrawState",value:function(t){H.setDrawState(this.curIdx,t)}},{key:"randomizeGrowState",value:function(){var t=this;!function(){if(t.getGrowState().active);else{var e=t.p5.int(t.p5.random(0,2));e=1===e?A:D,H.setGrowState(t.curIdx,e,!1)}}()}}]),t}(),gt=function(){function t(e){Object(l.a)(this,t),this.p5=e,this.sequencerActiveColor=this.p5.color(255,0,0,200),this.sequencerInactiveColor=this.p5.color(255,0,0,100)}return Object(c.a)(t,[{key:"draw",value:function(t){var e=F.getIndices();console.log(e);for(var i=I.isEditMode,n=0;n<e.length;n++){if(e[n]===t.curIdx){i?this.p5.fill(this.sequencerInactiveColor):this.p5.fill(this.sequencerActiveColor);var a=t.getNewPos();this.p5.ellipse(a+t.lightWidth/2,this.p5.height/2,t.lightWidth,t.lightWidth)}}}}]),t}(),ft=function(){function t(e){Object(l.a)(this,t),this.p5=e,this.lights=[],this.showResetAnimation=!1,this.curTime=0,this.var=0,this.dir=!0,this.sequencerBubble=new gt(e)}return Object(c.a)(t,[{key:"setup",value:function(){this.prepareLights()}},{key:"prepareLights",value:function(){this.lights=[],H.setMaxHeight(this.p5.height);for(var t=this.p5.width/24,e=t/2,i=0;i<24;i++){var n=i*t,a=new dt(this.p5,i,n,this.p5.height,e);this.lights.push(a)}}},{key:"draw",value:function(t,e){for(var i=0;i<this.lights.length;i++){var n=this.lights[i];n.draw(t,e),this.sequencerBubble.draw(n)}}}]),t}(),mt=function(){function t(e){Object(l.a)(this,t),this.p5=e,this.ellipsePos=this.p5.createVector(this.p5.width/3,this.p5.height/2),this.boundaryWidth=this.p5.width/1.5,this.prevMouseX=0,this.prevMouseY=0}return Object(c.a)(t,[{key:"draw",value:function(t){var e=I.isEditMode,i=I.isUserInteracting,n=I.isPopupActive;if(e&&i){var a,s;n||this.p5.mouseY>this.p5.height||this.p5.mouseY<0?(a=this.prevMouseX,s=this.prevMouseY):(a=this.p5.mouseX,s=this.p5.mouseY),this.ellipsePos.x+=.08*(a-this.ellipsePos.x),this.ellipsePos.y+=.08*(s-this.ellipsePos.y),this.containEllipse();for(var o=0;o<t.length;o++){var r=t[o],h=r.topPos,l=r.getHeight();l<this.p5.height&&l>0&&this.drawLine(h,this.ellipsePos,o)}this.drawEllipse(),this.prevMouseX=a,this.prevMouseY=s}}},{key:"containEllipse",value:function(){this.ellipsePos.x>this.p5.width&&(this.ellipsePos.x=this.p5.width),this.ellipsePos.x<0&&(this.ellipsePos.x=0),this.ellipsePos.y>this.p5.height&&(this.ellipsePos.y=this.p5.height),this.ellipsePos.y<0&&(this.ellipsePos.y=0)}},{key:"drawEllipse",value:function(){this.p5.fill(this.p5.color(255,255,255,150)),this.p5.strokeWeight(3),this.p5.stroke(this.p5.color("black")),this.p5.ellipse(this.ellipsePos.x,this.ellipsePos.y,50)}},{key:"drawLine",value:function(t,e,i){var n=this.p5.map(i,0,24,100,200),a=this.p5.map(i,0,25,2,4);this.p5.stroke(this.p5.color(255,255,255,n)),this.p5.strokeWeight(a),this.p5.line(t.x,t.y,e.x,e.y)}}]),t}(),vt=function(){function t(e){var i=this;Object(l.a)(this,t),this.p5=e,this.curBpm=M.getLocalBpm(),M.subscribe((function(){i.curBpm=M.getLocalBpm()})),this.curTime=""}return Object(c.a)(t,[{key:"update",value:function(t,e){var i=I.isEditMode;if(I.isUserInteracting&&i){var n=!1;n=t.x>this.p5.width/2&&t.y<this.p5.height/2||t.x<this.p5.width/2&&t.y>this.p5.height/2;for(var a=0,s=0;s<e.length;s++){e[s].isOn()&&(a+=1)}var o=Date.now()-this.curTime,r=this.p5.sin((o+.1)/(a+1)),h=this.p5.map(r,-1,1,0,.1);n&&(this.curBpm=this.curBpm+3*h),n||(this.curBpm=this.curBpm-.01*h),this.curBpm<100&&(this.curBpm=100),this.curBpm>200&&(this.curBpm=200),M.setLocalBpm(Math.floor(this.curBpm))}else this.curTime=Date.now()}}]),t}(),yt=i(83),bt=i(84),xt={position:"absolute",height:"100%",width:"20px"},kt=function(t){Object(p.a)(i,t);var e=Object(d.a)(i);function i(t){var n;return Object(l.a)(this,i),(n=e.call(this,t)).lightButtons=[],_.subscribe(n.onSynthNotes.bind(Object(u.a)(n))),n.state={keyState:Array(24).fill(0)},n}return Object(c.a)(i,[{key:"render",value:function(){var t=this.getButtons();return o.a.createElement("div",{style:this.props.wrapperStyle},t)}},{key:"getButtons",value:function(){for(var t=[],e=window.innerWidth/24,i=e/2,n=0;n<24;n++){var a=n*e,s=this.getButtonStyle(n,a,i),r=o.a.createElement("div",{style:s,key:n,onMouseDown:this.onPress.bind(this,n),onMouseUp:this.onRelease.bind(this,n),onMouseLeave:this.onRelease.bind(this,n)});t.push(r)}return t}},{key:"getButtonStyle",value:function(t,e,i){var n=e+i/2,a=Object(bt.a)({},xt);return a.width=i+"px",a.left=n+"px",1===this.state.keyState[t]?a.backgroundColor="rgb(255, 255, 255)":a.backgroundColor="rgba(255, 255, 255, 0.3)",a}},{key:"onPress",value:function(t){this.updateState(this.state.keyState,t,1)}},{key:"onRelease",value:function(t){this.updateState(this.state.keyState,t,0)}},{key:"updateState",value:function(t,e,i){var n=Object(yt.a)(t);n[e]=i;var a=JSON.stringify(n);a!==JSON.stringify(t)&&Y.sendSynthNotes(a),this.setState({keyState:n})}},{key:"onSynthNotes",value:function(t){JSON.stringify(t)!==JSON.stringify(this.state.keyState)&&this.setState({keyState:t})}}]),i}(o.a.Component),wt=Object(g.a)(kt),St=function(t){var e,i,n,a=!1;t.setup=function(){var a=t.select("#canvasContainer").height;t.createCanvas(window.innerWidth,a),e=new ft(t),i=new mt(t),n=new vt(t),e.setup()},t.draw=function(){t.background(t.color(0,0,0)),e.draw(i.ellipsePos,i.boundaryWidth),i.draw(e.lights),n.update(i.ellipsePos,e.lights)},t.mousePressed=function(){G.currentMode===N&&(t.mouseY>t.height||t.mouseY<0||I.isPopupActive||(console.log("Doing it"),I.setUserInteracting(!0),I.setEditMode(!0),L.cancelReset(),a=!0))},t.mouseReleased=function(){if(!I.isPopupActive){I.setUserInteracting(!1);var t=H.hasConfigEdited;a&&t&&(console.log("Schedule popup"),L.startTimer(),a=!1)}},t.windowResized=function(){setTimeout((function(){console.log("Canvas Resized.");var i=t.select("#canvasContainer").height;t.resizeCanvas(window.innerWidth,i),e.prepareLights()}),500)}},Ct={container:{position:"relative",WebkitOverflowScrolling:"touch",backgroundColor:f.bgBlack,margin:0,padding:0,zIndex:"1"},hide:{display:"none"},show:{display:"inline"}},Et=function(t){Object(p.a)(i,t);var e=Object(d.a)(i);function i(t){var n;return Object(l.a)(this,i),(n=e.call(this,t)).containerRef=o.a.createRef(),n.sketchRef=o.a.createRef(),n.doesSketchExist=!1,n.state={currentMode:G.getCurrentMode()},n}return Object(c.a)(i,[{key:"componentDidMount",value:function(){console.log("Wave canvas mounted"),G.subscribe(this.onModeUpdate.bind(this))}},{key:"componentDidUpdate",value:function(){this.state.currentMode!==N&&this.state.currentMode!==W&&this.state.currentMode!==U||this.doesSketchExist||(console.log("New Sketch"),this.myP5=new pt.a(St,this.sketchRef.current),this.doesSketchExist=!0)}},{key:"render",value:function(){var t=this.getHeightStyle(),e=[Ct.container,t],i=this.state.currentMode===N||this.state.currentMode===W||this.state.currentMode===U?[e,Ct.show]:[e,Ct.hide],n=this.state.currentMode===z?[e,Ct.show]:[e,Ct.hide];return o.a.createElement(o.a.Fragment,null,o.a.createElement("div",{id:"canvasContainer",ref:this.sketchRef,style:i}),o.a.createElement(wt,{wrapperStyle:n}))}},{key:"onModeUpdate",value:function(t){this.setState({currentMode:t})}},{key:"getHeightStyle",value:function(){return{height:this.getHeight()+"px"}}},{key:"getHeight",value:function(){var t=window.innerHeight,e=window.innerWidth,i=0;return this.props.orientation===Rt.PORTRAIT&&(t<900&&(i=.8),t>900&&t<1e3&&(i=.85),t>1e3&&(i=.88)),this.props.orientation===Rt.LANDSCAPE&&(e<1e3&&(i=.7),e>1e3&&(i=.82)),t*i}}]),i}(o.a.Component),Ot=Object(g.a)(Et),It={container:{position:"relative",display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center",paddingLeft:v.small,paddingRight:v.small,color:f.fbWhite,fontFamily:b,fontSize:m.lessBig,letterSpacing:"2px",zIndex:"1"},info:{backgroundColor:f.bgBlack,fontFamily:y,letterSpacing:"2px",padding:v.verySmall,cursor:"default"},button:{cursor:"pointer",borderStyle:"solid",borderWidth:"1.8px",borderColor:f.fgWhite,boxShadow:"0px 1px 1px black"},disabled:{backgroundColor:f.disabled}},Bt=function(t){Object(p.a)(i,t);var e=Object(d.a)(i);function i(t){var n;return Object(l.a)(this,i),(n=e.call(this,t)).state={localBpm:"",dbBpm:"",configIndex:"",isEditMode:!1,isSendEnabled:H.hasConfigEdited,currentMode:G.getCurrentMode()},n}return Object(c.a)(i,[{key:"componentDidMount",value:function(){M.subscribe(this.onBpmUpdated.bind(this)),j.subscribe(this.onConfigIndexUpdated.bind(this)),I.subscribe(this.onEditModeUpdate.bind(this)),H.subscribeForConfigChange(this.onLightConfigChange.bind(this)),G.subscribe(this.onModeUpdate.bind(this))}},{key:"render",value:function(){var t=this.state.isEditMode?this.state.localBpm:this.state.dbBpm,e=this.state.configIndex,i=this.getHeightStyle();return this.getElements(i,e,t)}},{key:"getElements",value:function(t,e,i){var n=this.getLeftItem(e),a=this.getSendButton();return o.a.createElement("div",{style:[It.container,t]},n,o.a.createElement("div",{style:It.info},i+"bpm"),a)}},{key:"getLeftItem",value:function(t){return this.state.currentMode===z?o.a.createElement("div",{style:It.info},"0"):this.state.isEditMode?o.a.createElement("div",{onClick:this.onBack.bind(this),style:[It.info,It.button]},"BACK"):o.a.createElement("div",{style:It.info},t)}},{key:"getSendButton",value:function(){var t=[It.info,It.button];t=this.state.isSendEnabled?t:[t,It.disabled];var e=this.state.isSendEnabled?this.onSend.bind(this):function(){};return o.a.createElement("div",{onClick:e,style:t},"SEND")}},{key:"getHeightStyle",value:function(){return{height:this.getHeight()+"px"}}},{key:"getHeight",value:function(){var t=window.innerHeight,e=window.innerWidth,i=0;return this.props.orientation===Rt.PORTRAIT&&(t<900&&(i=.1),t>900&&t<1e3&&(i=.075),t>1e3&&(i=.06)),this.props.orientation===Rt.LANDSCAPE&&(e<1e3&&(i=.15),e>1e3&&(i=.065)),t*i}},{key:"onLightConfigChange",value:function(){var t=H.hasConfigEdited;this.setState({isSendEnabled:t})}},{key:"onEditModeUpdate",value:function(){var t=I.isEditMode;this.state.isEditMode!==t&&this.setState({isEditMode:t})}},{key:"onBpmUpdated",value:function(){var t=M.getDbBpm(),e=M.getLocalBpm();t!==this.state.dbBpm&&this.setState({dbBpm:t}),e!==this.state.localBpm&&this.setState({localBpm:e})}},{key:"onConfigIndexUpdated",value:function(){var t=j.getConfigIndex();t!==this.state.configIndex&&this.setState({configIndex:t})}},{key:"onSend",value:function(t){t.stopPropagation(),I.setEditMode(!1),I.setUserInteracting(!1),L.cancelPopup(),Y.commitLightConfigData()}},{key:"onBack",value:function(t){t.stopPropagation(),I.setEditMode(!1),I.setUserInteracting(!1),this.setState({isEditMode:!1})}},{key:"onModeUpdate",value:function(t){this.setState({currentMode:t})}}]),i}(o.a.Component),Mt=Object(g.a)(Bt),jt={container:{position:"relative",backgroundColor:f.bgBlack,display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center",paddingLeft:v.small,paddingRight:v.small,color:f.fbWhite,fontFamily:b,fontSize:m.lessBig,letterSpacing:"2px",zIndex:"1"},buttonStyle:{backgroundColor:f.fgWhite,fontFamily:y,letterSpacing:"2px",padding:v.verySmall,cursor:"default"},selectedButton:{backgroundColor:f.selected}},Lt=function(t){Object(p.a)(i,t);var e=Object(d.a)(i);function i(t){var n;return Object(l.a)(this,i),n=e.call(this,t),G.subscribe(n.onModeUpdate.bind(Object(u.a)(n))),n.state={currentMode:G.getCurrentMode()},n}return Object(c.a)(i,[{key:"render",value:function(){var t=this.getHeightStyle(),e=this.state.currentMode===z?[jt.buttonStyle,jt.selectedButton]:[jt.buttonStyle],i=this.state.currentMode===W?[jt.buttonStyle,jt.selectedButton]:[jt.buttonStyle],n=this.state.currentMode===N?[jt.buttonStyle,jt.selectedButton]:[jt.buttonStyle],a=this.state.currentMode===U?[jt.buttonStyle,jt.selectedButton]:[jt.buttonStyle];return o.a.createElement("div",{style:[jt.container,t]},o.a.createElement("button",{onClick:this.handleClick.bind(this,z),style:e},"SYNTH"),o.a.createElement("button",{onClick:this.handleClick.bind(this,W),style:i},"DREAM"),o.a.createElement("button",{onClick:this.handleClick.bind(this,N),style:n},"SCORE"),o.a.createElement("button",{onClick:this.handleClick.bind(this,U),style:a},"SWEEP"))}},{key:"handleClick",value:function(t){G.setMode(t,!0)}},{key:"onModeUpdate",value:function(t){this.setState({currentMode:t})}},{key:"getHeightStyle",value:function(){return{height:this.getHeight()+"px"}}},{key:"getHeight",value:function(){var t=window.innerHeight,e=window.innerWidth,i=0;return this.props.orientation===Rt.PORTRAIT&&(t<900&&(i=.1),t>900&&t<1e3&&(i=.075),t>1e3&&(i=.06)),this.props.orientation===Rt.LANDSCAPE&&(e<1e3&&(i=.15),e>1e3&&(i=.065)),t*i}}]),i}(o.a.Component),Pt=Object(g.a)(Lt),Rt={PORTRAIT:0,LANDSCAPE:1},Tt={container:{position:"fixed",WebkitOverflowScrolling:"touch",top:"0%",left:"0%",right:"0%",bottom:"0%",display:"flex",flexDirection:"column",color:"white",height:"100%",width:"100%",zIndex:"1"},button:{width:"100px",height:"50px",backgroundColor:"white",color:"black"}},At=function(t){Object(p.a)(i,t);var e=Object(d.a)(i);function i(t){var n;return Object(l.a)(this,i),n=e.call(this,t),window.addEventListener("resize",n.handleResize.bind(Object(u.a)(n))),n.state={orientation:Rt.PORTRAIT},n}return Object(c.a)(i,[{key:"componentDidMount",value:function(){this.evaluateOrientation()}},{key:"render",value:function(){return o.a.createElement("div",{style:Tt.container},o.a.createElement(ct,{orientation:this.state.orientation}),o.a.createElement(Ot,{orientation:this.state.orientation}),o.a.createElement(Pt,{orientation:this.state.orientation}),o.a.createElement(Mt,{orientation:this.state.orientation}))}},{key:"handleResize",value:function(){this.evaluateOrientation()}},{key:"evaluateOrientation",value:function(){window.innerHeight<window.innerWidth?(console.log("App: Landscape"),this.setState({orientation:Rt.LANDSCAPE})):(console.log("App: Portrait"),this.setState({orientation:Rt.PORTRAIT}))}}]),i}(o.a.Component),Dt=Object(g.a)(At),Ht=i(43);h.a.render(o.a.createElement(Ht.a,null,o.a.createElement(Dt,null)),document.getElementById("root"))},85:function(t,e,i){t.exports=i(183)},90:function(t,e,i){},91:function(t,e,i){}},[[85,1,2]]]);
//# sourceMappingURL=main.22fabe31.chunk.js.map