import './style.css';
import * as THREE from 'three';

const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const canvas=document.querySelector('#world');
const dialog=document.querySelector('#contact-dialog');
document.querySelector('#contact-open').onclick=()=>dialog.showModal();
document.querySelector('#contact-close').onclick=()=>dialog.close();
dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
const mix=THREE.MathUtils.lerp;
let renderer;
try{renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'high-performance'});}catch{document.body.classList.add('no-webgl');}
if(renderer){
renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));
renderer.setClearColor(0x060d17,1);renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.35;
const scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0x060d17,.027);
const camera=new THREE.PerspectiveCamera(35,innerWidth/innerHeight,.1,100);camera.position.set(0,3,16);camera.lookAt(0,0,0);
scene.add(new THREE.HemisphereLight(0xa5e5ff,0x182431,2.6));
const light=new THREE.DirectionalLight(0xc9edff,4);light.position.set(2,6,6);scene.add(light);
const rim=new THREE.PointLight(0x51f7d5,55,20);rim.position.set(-3,2,0);scene.add(rim);
const blue=new THREE.PointLight(0x4e8bff,40,20);blue.position.set(6,-2,2);scene.add(blue);
const mat=(color,metalness=.65,roughness=.35)=>new THREE.MeshStandardMaterial({color,metalness,roughness});
const shell=mat(0x405264,.85,.27),dark=mat(0x101c27,.7,.35),board=mat(0x143f3d,.5,.5),silver=mat(0x9badb8,.9,.24),chip=mat(0x10171f,.45,.4),glow=new THREE.MeshStandardMaterial({color:0x73f6dc,emissive:0x30cbb7,emissiveIntensity:2});
function box(parent,w,h,d,x,y,z,material){const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);mesh.position.set(x,y,z);parent.add(mesh);return mesh;}
function edge(mesh,color=0x81aeb8,opacity=.25){const line=new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry),new THREE.LineBasicMaterial({color,transparent:true,opacity}));mesh.add(line);}
const rig=new THREE.Group();scene.add(rig);const parts=[];
function layer(y,spread){const g=new THREE.Group();g.position.y=y;rig.add(g);parts.push({g,y,spread});return g;}
const base=layer(-.55,-1.1);edge(box(base,4.8,.16,3.15,0,0,0,shell));box(base,1.5,.015,.9,0,.09,.78,mat(0x5d7586));
for(let row=0;row<5;row++)for(let col=0;col<14;col++)box(base,.265,.028,.17,-2.08+col*.32,.105,-1.1+row*.25,dark);
for(let i=0;i<4;i++)box(base,.28,.06,.12,-1.6+i*.7,-.03,1.59,dark);
const pcb=layer(-.38,.35);edge(box(pcb,4.35,.065,2.75,0,0,0,board),0x51d9b9,.4);
for(let i=0;i<35;i++){const x=((i*13)%37)/37*3.9-1.95,z=((i*7)%23)/23*2.3-1.15;box(pcb,.12+(i%3)*.08,.08,.14,x,.07,z,chip);}
for(let i=0;i<18;i++){const x=-2+i*.23;box(pcb,.009,.008,2.3,x,.04,0,mat(0x398c76));}
const cpu=layer(-.28,1.1);edge(box(cpu,.9,.12,.9,0,0,-.2,silver));box(cpu,.55,.03,.55,0,.08,-.2,chip);for(let i=0;i<9;i++)box(cpu,.025,.03,.14,-.4+i*.1,0,.33,mat(0xbda56c));
const ram=layer(-.27,.72);for(let j=0;j<2;j++){box(ram,1.4,.07,.4,1.15,0,.3+j*.55,board);for(let k=0;k<4;k++)box(ram,.23,.055,.26,.65+k*.32,.07,.3+j*.55,chip);}
const fan=layer(-.26,.55);const ring=new THREE.Mesh(new THREE.CylinderGeometry(.53,.53,.09,40),dark);ring.position.set(-1.1,.06,-.2);fan.add(ring);for(let i=0;i<9;i++){const blade=box(fan,.38,.06,.13,-1.1+Math.cos(i/9*Math.PI*2)*.25,.13,-.2+Math.sin(i/9*Math.PI*2)*.25,silver);blade.rotation.y=-i/9*Math.PI*2;}box(fan,.2,.1,.2,-1.1,.14,-.2,dark);
const screen=layer(-.45,1.65);const lid=new THREE.Group();screen.add(lid);lid.position.set(0,0,-1.48);lid.rotation.x=-.16;
edge(box(lid,4.8,2.95,.12,0,1.48,0,shell));box(lid,4.48,2.65,.018,0,1.48,.073,dark);
const display=document.createElement('canvas');display.width=1024;display.height=640;const ctx=display.getContext('2d');const grad=ctx.createLinearGradient(0,0,1024,640);grad.addColorStop(0,'#092336');grad.addColorStop(1,'#10564f');ctx.fillStyle=grad;ctx.fillRect(0,0,1024,640);ctx.strokeStyle='#5ae7cb';ctx.lineWidth=1;for(let i=0;i<18;i++){ctx.beginPath();ctx.ellipse(630,340,100+i*24,60+i*13,-.65,0,Math.PI*2);ctx.stroke();}ctx.fillStyle='#d9fff6';ctx.font='bold 52px sans-serif';ctx.fillText('SITOP',70,110);ctx.font='14px monospace';ctx.fillText('CONNECTING YOUR NEXT.',73,145);const tex=new THREE.CanvasTexture(display);tex.colorSpace=THREE.SRGBColorSpace;box(lid,4.38,2.55,.005,0,1.48,.087,new THREE.MeshBasicMaterial({map:tex}));
const server=new THREE.Group();scene.add(server);for(let j=0;j<3;j++){const unit=new THREE.Group();server.add(unit);unit.position.y=j*.55-.6;edge(box(unit,4.5,.45,2.65,0,0,0,shell));box(unit,4.25,.32,.05,0,0,1.35,dark);for(let k=0;k<8;k++){box(unit,.38,.21,.025,-1.75+k*.47,0,1.39,chip);box(unit,.025,.05,.015,-1.68+k*.47,.03,1.41,glow);}for(let k=0;k<12;k++)box(unit,.02,.22,.02,-.28+k*.05,0,1.41,silver);}
const network=new THREE.Group();scene.add(network);edge(box(network,4.6,.6,2.5,0,0,0,shell));box(network,4.4,.43,.05,0,0,1.28,dark);for(let i=0;i<12;i++){box(network,.27,.19,.08,-1.9+i*.34,0,1.34,silver);box(network,.2,.13,.08,-1.9+i*.34,0,1.39,chip);box(network,.035,.035,.02,-1.95+i*.34,.16,1.4,glow);}
for(let i=0;i<5;i++){const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(-1.5+i*.7,0,1.4),new THREE.Vector3(-1.5+i*.7,-.6,2.1),new THREE.Vector3(-2+i,-1.3,2.2),new THREE.Vector3(-2+i,-2,1)]);network.add(new THREE.Mesh(new THREE.TubeGeometry(curve,32,.035,8,false),i%2?board:glow));}
const grid=new THREE.GridHelper(40,40,0x18464e,0x122737);grid.position.y=-3.7;grid.material.transparent=true;grid.material.opacity=.35;scene.add(grid);
const netBoard=new THREE.Group();network.add(netBoard);edge(box(netBoard,4.2,.07,2.1,0,0,0,board));for(let i=0;i<6;i++)box(netBoard,.4,.09,.45,-1.6+i*.64,.08,0,chip);
let seed=123;const rnd=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};const positions=new Float32Array(420*3);for(let i=0;i<positions.length;i++)positions[i]=(rnd()-.5)*38;const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(positions,3));const dust=new THREE.Points(geo,new THREE.PointsMaterial({color:0x72cbbf,size:.024,transparent:true,opacity:.45}));scene.add(dust);
let w=innerWidth,h=innerHeight,scroll=scrollY,target=scrollY,mouseX=0,mouseY=0;
function resize(){w=innerWidth;h=innerHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();}resize();addEventListener('resize',resize);addEventListener('scroll',()=>target=scrollY,{passive:true});addEventListener('pointermove',e=>{mouseX=(e.clientX/w-.5)*.12;mouseY=(e.clientY/h-.5)*.08;},{passive:true});
const indicator=[...document.querySelectorAll('.scene-indicator>span')];let stage=-1;const names=['01 / PERSONAL COMPUTER','02 / SERVER INFRASTRUCTURE','03 / CONNECTED NETWORK'];const subs=['すべての可能性は、ここから。','情報を支える、その内側へ。','つながることで、広がっていく。'];
function render(t){requestAnimationFrame(render);scroll=reduced?target:mix(scroll,target,.075);const mobile=w<800;const storyY=document.querySelector('#vision').offsetTop;const servicesY=document.querySelector('#services').offsetTop;const p=clamp(scroll/(storyY*.8));const explode=reduced?.25:Math.sin(clamp((scroll-storyY*.1)/(storyY*1.2))*Math.PI)*1.35;const serverStage=scroll>storyY*.96&&scroll<storyY*1.55;const networkStage=scroll>=storyY*1.55;const s=networkStage?2:serverStage?1:0;
if(s!==stage){stage=s;indicator.forEach((el,i)=>el.classList.toggle('active',i===s));document.querySelector('#device-name').textContent=names[s];document.querySelector('#device-sub').textContent=subs[s];}
const fade=1-clamp((scroll-servicesY+250)/500);rig.visible=s===0&&fade>0;server.visible=s===1&&fade>0;network.visible=s===2&&fade>0;
const x=mobile?0:mix(3.1,-3.3,p);const y=mobile?mix(-4.25,1.3,p):mix(-.25,.05,p);const scale=mobile?.43:.98;
for(const obj of [rig,server,network]){obj.position.set(x,y+(reduced?0:Math.sin(t*.00055)*.07),0);obj.rotation.set(.1+mouseY,mix(-.46,.45,p)+mouseX,.02);obj.scale.setScalar(scale*fade);}
server.children.forEach((unit,i)=>{unit.position.y=i*.55-.6+(i-1)*clamp((scroll-storyY*.96)/450)*.75;});netBoard.position.y=.4+clamp((scroll-storyY*1.55)/350)*1.3;
for(const {g,y,spread}of parts){g.position.y=y+spread*explode;g.rotation.z=explode*spread*.025;}
if(!reduced)dust.rotation.y=t*.000009;
document.querySelector('.progress span').style.width=`${clamp(target/(document.documentElement.scrollHeight-h))*100}%`;
renderer.render(scene,camera);
}requestAnimationFrame(render);
}
