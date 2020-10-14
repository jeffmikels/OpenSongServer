// abc2svg - ABC to SVG translator
// @source: https://chiselapp.com/user/moinejf/repository/abc2svg
// Copyright (C) 2014-2019 Jean-Francois Moine - LGPL3+
//abc2svg-abc2svg.js
if(typeof abc2svg=="undefined")
var abc2svg={};abc2svg.C={BLEN:1536,BAR:0,CLEF:1,CUSTOS:2,GRACE:4,KEY:5,METER:6,MREST:7,NOTE:8,PART:9,REST:10,SPACE:11,STAVES:12,STBRK:13,TEMPO:14,BLOCK:16,REMARK:17,FULL:0,EMPTY:1,OVAL:2,OVALBARS:3,SQUARE:4,SL_ABOVE:0x01,SL_BELOW:0x02,SL_AUTO:0x03,SL_HIDDEN:0x04,SL_DOTTED:0x08};abc2svg.keys=[new Int8Array([-1,-1,-1,-1,-1,-1,-1]),new Int8Array([-1,-1,-1,0,-1,-1,-1]),new Int8Array([0,-1,-1,0,-1,-1,-1]),new Int8Array([0,-1,-1,0,0,-1,-1]),new Int8Array([0,0,-1,0,0,-1,-1]),new Int8Array([0,0,-1,0,0,0,-1]),new Int8Array([0,0,0,0,0,0,-1]),new Int8Array([0,0,0,0,0,0,0]),new Int8Array([0,0,0,1,0,0,0]),new Int8Array([1,0,0,1,0,0,0]),new Int8Array([1,0,0,1,1,0,0]),new Int8Array([1,1,0,1,1,0,0]),new Int8Array([1,1,0,1,1,1,0]),new Int8Array([1,1,1,1,1,1,0]),new Int8Array([1,1,1,1,1,1,1])]
abc2svg.p_b40=new Int8Array([2,8,14,19,25,31,37])
abc2svg.b40_p=new Int8Array([0,0,0,0,0,0,1,1,1,1,1,1,2,2,2,2,2,3,3,3,3,3,3,4,4,4,4,4,4,5,5,5,5,5,5,6,6,6,6,6])
abc2svg.b40_a=new Int8Array([-2,-1,0,1,2,0,-2,-1,0,1,2,0,-2,-1,0,1,2,-2,-1,0,1,2,0,-2,-1,0,1,2,0,-2,-1,0,1,2,0,-2,-1,0,1,2])
abc2svg.b40_m=new Int8Array([-2,-1,0,1,2,0,0,1,2,3,4,0,2,3,4,5,6,3,4,5,6,7,0,5,6,7,8,9,0,7,8,9,10,11,0,9,10,11,12,13])
abc2svg.b40k=new Int8Array([36,1,2,3,8,2,2,7,8,13,14,2,8,13,14,19,20,13,14,19,20,25,2,19,24,25,30,31,2,25,30,31,36,37,2,31,36,37,38,3])
abc2svg.b40sf=new Int8Array([-2,-7,0,7,2,88,0,-5,2,-3,4,88,2,-3,4,-1,6,-3,4,-1,6,1,88,-1,-6,1,-4,3,88,1,-4,3,-2,5,88,3,-2,5,0,7])
abc2svg.isb40=new Int8Array([0,1,6,11,12,17,18,23,28,29,34,35])
abc2svg.ifb40=new Int8Array([0,5,6,11,12,17,22,23,28,29,34,39])
abc2svg.pab40=function(p,a){p+=19
var b40=((p/7)|0)*40+abc2svg.p_b40[p%7]
if(a&&a!=3)
b40+=a
return b40}
abc2svg.b40p=function(b){return((b/40)|0)*7+abc2svg.b40_p[b%40]-19}
abc2svg.b40a=function(b){return abc2svg.b40_a[b%40]}
abc2svg.b40m=function(b){return((b/40)|0)*12+abc2svg.b40_m[b%40]}
abc2svg.Abc=function(user){"use strict";var C=abc2svg.C;var require=empty_function,system=empty_function,write=empty_function,XMLHttpRequest=empty_function;var OPEN_BRACE=0x01,CLOSE_BRACE=0x02,OPEN_BRACKET=0x04,CLOSE_BRACKET=0x08,OPEN_PARENTH=0x10,CLOSE_PARENTH=0x20,STOP_BAR=0x40,FL_VOICE=0x80,OPEN_BRACE2=0x0100,CLOSE_BRACE2=0x0200,OPEN_BRACKET2=0x0400,CLOSE_BRACKET2=0x0800,MASTER_VOICE=0x1000,IN=96,CM=37.8,YSTEP=256
var errs={bad_char:"Bad character '$1'",bad_val:"Bad value in $1",bar_grace:"Cannot have a bar in grace notes",ignored:"$1: inside tune - ignored",misplaced:"Misplaced '$1' in %%score",must_note:"!$1! must be on a note",must_note_rest:"!$1! must be on a note or a rest",nonote_vo:"No note in voice overlay",not_ascii:"Not an ASCII character",not_enough_n:'Not enough notes/rests for %%repeat',not_enough_m:'Not enough measures for %%repeat',not_enough_p:"Not enough parameters in %%map",not_in_tune:"Cannot have '$1' inside a tune"}
var self=this,glovar={meter:{type:C.METER,wmeasure:1,a_meter:[]}},info={},mac={},maci=new Int8Array(128),parse={ctx:{},prefix:'%',state:0,ottava:[],line:new scanBuf},psvg
function clone(obj,lvl){if(!obj)
return obj
var tmp=new obj.constructor
for(var k in obj)
if(obj.hasOwnProperty(k)){if(lvl&&typeof obj[k]=='object')
tmp[k]=clone(obj[k],lvl-1)
else
tmp[k]=obj[k]}
return tmp}
function errbld(sev,txt,fn,idx){var i,j,l,c,h
if(user.errbld){switch(sev){case 0:sev="warn";break
case 1:sev="error";break
default:sev="fatal";break}
user.errbld(sev,txt,fn,idx)
return}
if(idx!=undefined&&idx>=0){i=l=0
while(1){j=parse.file.indexOf('\n',i)
if(j<0||j>idx)
break
l++;i=j+1}
c=idx-i}
h=""
if(fn){h=fn
if(l)
h+=":"+(l+1)+":"+(c+1);h+=" "}
switch(sev){case 0:h+="Warning: ";break
case 1:h+="Error: ";break
default:h+="Internal bug: ";break}
user.errmsg(h+txt,l,c)}
function error(sev,s,msg,a1,a2,a3,a4){var i,j,regex,tmp
if(!sev&&cfmt.quiet)
return
if(user.textrans){tmp=user.textrans[msg]
if(tmp)
msg=tmp}
if(arguments.length>3)
msg=msg.replace(/\$./g,function(a){switch(a){case'$1':return a1
case'$2':return a2
case'$3':return a3
default:return a4}})
if(s&&s.fname)
errbld(sev,msg,s.fname,s.istart)
else
errbld(sev,msg)}
function scanBuf(){this.index=0;scanBuf.prototype.char=function(){return this.buffer[this.index]}
scanBuf.prototype.next_char=function(){return this.buffer[++this.index]}
scanBuf.prototype.get_int=function(){var val=0,c=this.buffer[this.index]
while(c>='0'&&c<='9'){val=val*10+Number(c);c=this.next_char()}
return val}}
function syntax(sev,msg,a1,a2,a3,a4){var s={fname:parse.fname,istart:parse.istart+parse.line.index}
error(sev,s,msg,a1,a2,a3,a4)}
function js_inject(js){if(!/eval *\(|Function|setTimeout|setInterval/.test(js))
eval('"use strict"\n'+js)
else
syntax(1,"Unsecure code")}
var dd_tb={},a_de
var decos={dot:"0 stc 5 1 1",tenuto:"0 emb 5 3 3",slide:"1 sld 3 7 0",arpeggio:"2 arp 12 10 0",roll:"3 roll 7 6 6",fermata:"3 hld 10 7 7",emphasis:"3 accent 7 4 4",lowermordent:"3 lmrd 10 5 5",coda:"3 coda 24 10 10",uppermordent:"3 umrd 10 5 5",segno:"3 sgno 22 8 8",trill:"3 trl 14 5 5",upbow:"3 upb 10 5 5",downbow:"3 dnb 9 5 5",gmark:"3 grm 6 5 5",wedge:"3 wedge 8 3 3",turnx:"3 turnx 10 0 5",breath:"3 brth 0 1 20",longphrase:"3 lphr 0 1 1",mediumphrase:"3 mphr 0 1 1",shortphrase:"3 sphr 0 1 1",invertedfermata:"3 hld 10 7 7",invertedturn:"3 turn 10 0 5",invertedturnx:"3 turnx 10 0 5","0":"3 fng 8 3 3 0","1":"3 fng 8 3 3 1","2":"3 fng 8 3 3 2","3":"3 fng 8 3 3 3","4":"3 fng 8 3 3 4","5":"3 fng 8 3 3 5",plus:"3 dplus 7 3 3","+":"3 dplus 7 3 3",accent:"3 accent 7 4 4",">":"3 accent 7 4 4",marcato:"3 marcato 9 3 3","^":"3 marcato 9 3 3",mordent:"3 lmrd 10 5 5",open:"3 opend 10 3 3",snap:"3 snap 14 3 3",thumb:"3 thumb 14 3 3",dacapo:"3 dacs 16 20 20 Da Capo",dacoda:"3 dacs 16 20 20 Da Coda","D.C.":"3 dcap 16 10 10","D.S.":"3 dsgn 16 10 10","D.C.alcoda":"3 dacs 16 38 38 D.C. al Coda","D.S.alcoda":"3 dacs 16 38 38 D.S. al Coda","D.C.alfine":"3 dacs 16 38 38 D.C. al Fine","D.S.alfine":"3 dacs 16 38 38 D.S. al Fine",fine:"3 dacs 16 10 10 Fine",turn:"3 turn 10 0 5","trill(":"3 ltr 8 0 0","trill)":"3 ltr 8 0 0",f:"6 f 18 1 7",ff:"6 ff 18 2 10",fff:"6 fff 18 4 13",ffff:"6 ffff 18 6 16",mf:"6 mf 18 6 13",mp:"6 mp 18 6 16",p:"6 p 18 2 8",pp:"6 pp 18 5 14",ppp:"6 ppp 18 8 20",pppp:"6 pppp 18 10 25",pralltriller:"3 umrd 10 5 5",sfz:"6 sfz 18 4 10",ped:"4 ped 18 6 10","ped-up":"4 pedoff 12 4 4","ped(":"4 lped 20 1 1","ped)":"4 lped 20 1 1","crescendo(":"6 cresc 18 0 0","crescendo)":"6 cresc 18 0 0","<(":"6 cresc 18 0 0","<)":"6 cresc 18 0 0","diminuendo(":"6 dim 18 0 0","diminuendo)":"6 dim 18 0 0",">(":"6 dim 18 0 0",">)":"6 dim 18 0 0","-(":"8 gliss 0 0 0","-)":"8 gliss 0 0 0","~(":"8 glisq 0 0 0","~)":"8 glisq 0 0 0","8va(":"3 8va 10 0 0","8va)":"3 8va 10 0 0","8vb(":"4 8vb 10 0 0","8vb)":"4 8vb 10 0 0","15ma(":"3 15ma 10 0 0","15ma)":"3 15ma 10 0 0","15mb(":"4 15mb 10 0 0","15mb)":"4 15mb 10 0 0",invisible:"32 0 0 0 0",beamon:"33 0 0 0 0",trem1:"34 0 0 0 0",trem2:"34 0 0 0 0",trem3:"34 0 0 0 0",trem4:"34 0 0 0 0",xstem:"35 0 0 0 0",beambr1:"36 0 0 0 0",beambr2:"36 0 0 0 0",rbstop:"37 0 0 0 0","/":"38 0 0 6 6","//":"38 0 0 6 6","///":"38 0 0 6 6","beam-accel":"39 0 0 0 0","beam-rall":"39 0 0 0 0",stemless:"40 0 0 0 0",rbend:"41 0 0 0 0"},f_near=[true,true,true],f_note=[false,false,false,true,true,true,false,false,true],f_staff=[false,false,false,false,false,false,true,true]
function y_get(st,up,x,w){var y,p_staff=staff_tb[st],i=(x/realwidth*YSTEP)|0,j=((x+w)/realwidth*YSTEP)|0
if(i<0)
i=0
if(j>=YSTEP){j=YSTEP-1
if(i>j)
i=j}
if(up){y=p_staff.top[i++]
while(i<=j){if(y<p_staff.top[i])
y=p_staff.top[i];i++}}else{y=p_staff.bot[i++]
while(i<=j){if(y>p_staff.bot[i])
y=p_staff.bot[i];i++}}
return y}
function y_set(st,up,x,w,y){var p_staff=staff_tb[st],i=(x/realwidth*YSTEP)|0,j=((x+w)/realwidth*YSTEP)|0
if(i<0)
i=0
if(j>=YSTEP){j=YSTEP-1
if(i>j)
i=j}
if(up){while(i<=j){if(p_staff.top[i]<y)
p_staff.top[i]=y;i++}}else{while(i<=j){if(p_staff.bot[i]>y)
p_staff.bot[i]=y;i++}}}
function up_p(s,pos){switch(pos){case C.SL_ABOVE:return true
case C.SL_BELOW:return false}
if(s.multi&&s.multi!=0)
return s.multi>0
if(!s.p_v.have_ly)
return false
return s.pos.voc!=C.SL_ABOVE}
function d_arp(de){var m,h,dx,s=de.s,dd=de.dd,xc=5
if(s.type==C.NOTE){for(m=0;m<=s.nhd;m++){if(s.notes[m].acc){dx=5+s.notes[m].shac}else{dx=6-s.notes[m].shhd
switch(s.head){case C.SQUARE:dx+=3.5
break
case C.OVALBARS:case C.OVAL:dx+=2
break}}
if(dx>xc)
xc=dx}}
h=3*(s.notes[s.nhd].pit-s.notes[0].pit)+4;m=dd.h
if(h<m)
h=m;de.has_val=true;de.val=h;de.x-=xc;de.y=3*(s.notes[0].pit-18)-3}
function d_cresc(de){if(de.ldst)
return
var s,dd,dd2,up,x,dx,x2,i,s2=de.s,de2=de.start,de2_prev,de_next;s=de2.s;x=s.x+3;i=de2.ix
if(i>0)
de2_prev=a_de[i-1];de.st=s2.st;de.lden=false;de.has_val=true;up=up_p(s2,s2.pos.dyn)
if(up)
de.up=true
if(de2_prev&&de2_prev.s==s&&((de.up&&!de2_prev.up)||(!de.up&&de2_prev.up))){dd2=de2_prev.dd
if(f_staff[dd2.func]){x2=de2_prev.x+de2_prev.val+4
if(x2>x)
x=x2}}
if(de.defl.noen){dx=de.x-x
if(dx<20){x=de.x-20-3;dx=20}}else{x2=s2.x;de_next=a_de[de.ix+1]
if(de_next&&de_next.s==s&&((de.up&&!de_next.up)||(!de.up&&de_next.up))){dd2=de_next.dd
if(f_staff[dd2.func])
x2-=5}
dx=x2-x-4
if(dx<20){x-=(20-dx)*.5;dx=20}}
de.val=dx;de.x=x;de.y=y_get(de.st,up,x,dx)
if(!up){dd=de.dd;de.y-=dd.h}}
function d_near(de){var y,up,s=de.s,dd=de.dd
if(dd.str){return}
if(s.multi)
up=s.multi>0
else
up=s.stem<0
if(up)
y=s.ymx|0
else
y=(s.ymn-dd.h)|0
if(y>-6&&y<24){if(up)
y+=3;y=(((y+6)/6)|0)*6-6}
if(up)
s.ymx=y+dd.h
else
s.ymn=y;de.y=y
if(s.type==C.NOTE)
de.x+=s.notes[s.stem>=0?0:s.nhd].shhd
if(dd.name[0]=='d'&&s.nflags>=-1){if(up){if(s.stem>0)
de.x+=3.5}else{if(s.stem<0)
de.x-=3.5}}}
function d_pf(de){var dd2,x2,x,up,s=de.s,dd=de.dd,de_prev;if(de.ldst)
return
if(de.start){d_cresc(de)
return}
de.val=dd.wl+dd.wr;up=up_p(s,s.pos.vol)
if(up)
de.up=true;x=s.x-dd.wl
if(de.ix>0){de_prev=a_de[de.ix-1]
if(de_prev.s==s&&((de.up&&!de_prev.up)||(!de.up&&de_prev.up))){dd2=de_prev.dd
if(f_staff[dd2.func]){x2=de_prev.x+de_prev.val+4;if(x2>x)
x=x2}}}
de.x=x;de.y=y_get(s.st,up,x,de.val)
if(!up)
de.y-=dd.h}
function d_slide(de){var m,dx,s=de.s,yc=s.notes[0].pit,xc=5
for(m=0;m<=s.nhd;m++){if(s.notes[m].acc){dx=4+s.notes[m].shac}else{dx=5-s.notes[m].shhd
switch(s.head){case C.SQUARE:dx+=3.5
break
case C.OVALBARS:case C.OVAL:dx+=2
break}}
if(s.notes[m].pit<=yc+3&&dx>xc)
xc=dx}
de.x-=xc;de.y=3*(yc-18)}
function d_trill(de){if(de.ldst)
return
var up,y,w,tmp,dd=de.dd,s2=de.s,st=s2.st,s=de.start.s,x=s.x
if(de.prev){x=de.prev.x+10;y=de.prev.y}
de.st=st
if(dd.func!=4){switch(dd.glyph){case"8va":case"15ma":up=1
break
default:up=s2.multi>=0
break}}
if(de.defl.noen){w=de.x-x
if(w<20){x=de.x-20-3;w=20}}else{w=s2.x-x-6
if(s2.type==C.NOTE)
w-=6
if(w<20){x-=(20-w)*.5;w=20}}
dd=de.dd;if(!y)
y=y_get(st,up,x,w)
if(up){tmp=staff_tb[s.st].topbar+2
if(y<tmp)
y=tmp}else{y-=dd.h;tmp=staff_tb[s.st].botbar-2
if(y>tmp)
y=tmp}
de.lden=false;de.has_val=true;de.val=w;de.x=x;de.y=y
if(up)
y+=dd.h;y_set(st,up,x,w,y)
if(up)
s.ymx=s2.ymx=y
else
s.ymn=s2.ymn=y}
function d_upstaff(de){if(de.ldst)
return
if(de.start){d_trill(de)
return}
var yc,up,inv,s=de.s,dd=de.dd,x=s.x,w=dd.wl+dd.wr,stafft=staff_tb[s.st].topbar+2,staffb=staff_tb[s.st].botbar-2
if(s.nhd)
x+=s.notes[s.stem>=0?0:s.nhd].shhd;up=-1
if(dd.func==4){up=0}else if(s.pos){switch(s.pos.orn){case C.SL_ABOVE:up=1
break
case C.SL_BELOW:up=0
break}}
switch(dd.glyph){case"accent":case"roll":if(!up||(up<0&&(s.multi<0||(!s.multi&&s.stem>0)))){yc=y_get(s.st,false,s.x-dd.wl,w)-2
if(yc>staffb)
yc=staffb;yc-=dd.h;y_set(s.st,false,s.x,0,yc);inv=true;s.ymn=yc}else{yc=y_get(s.st,true,s.x-dd.wl,w)+2
if(yc<stafft)
yc=stafft;y_set(s.st,true,s.x-dd.wl,w,yc+dd.h);s.ymx=yc+dd.h}
break
case"brth":case"lphr":case"mphr":case"sphr":yc=stafft+1
if(dd.glyph=="brth"&&yc<s.ymx)
yc=s.ymx
for(s=s.ts_next;s;s=s.ts_next)
if(s.seqst)
break
x+=((s?s.x:realwidth)-x)*.45
break
default:if(dd.name.indexOf("invert")==0)
inv=true
if(dd.name!="invertedfermata"&&(up>0||(up<0&&s.multi>=0))){yc=y_get(s.st,true,s.x-dd.wl,w)+2
if(yc<stafft)
yc=stafft;y_set(s.st,true,s.x-dd.wl,w,yc+dd.h);s.ymx=yc+dd.h}else{yc=y_get(s.st,false,s.x-dd.wl,w)-2
if(yc>staffb)
yc=staffb;yc-=dd.h;y_set(s.st,false,s.x-dd.wl,w,yc)
if(dd.name=="fermata")
inv=true;s.ymn=yc}
break}
if(inv){yc+=dd.h;de.inv=true}
de.x=x;de.y=yc}
var func_tb=[d_near,d_slide,d_arp,d_upstaff,d_upstaff,d_trill,d_pf,d_cresc]
function deco_add(param){var dv=param.match(/(\S*)\s+(.*)/);decos[dv[1]]=dv[2]}
function deco_def(nm){var a,dd,dd2,name2,c,i,elts,str,text=decos[nm]
if(!text){if(cfmt.decoerr)
error(1,null,"Unknown decoration '$1'",nm)
return}
a=text.match(/(\d+)\s+(.+?)\s+([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)/)
if(!a){error(1,null,"Invalid decoration '$1'",nm)
return}
var c_func=Number(a[1]),h=parseFloat(a[3]),wl=parseFloat(a[4]),wr=parseFloat(a[5])
if(isNaN(c_func)){error(1,null,"%%deco: bad C function value '$1'",a[1])
return}
if((c_func<0||c_func>10)&&(c_func<32||c_func>41)){error(1,null,"%%deco: bad C function index '$1'",c_func)
return}
if(c_func==5)
c_func=3
if(c_func==7)
c_func=6
if(h<0||wl<0||wr<0){error(1,null,"%%deco: cannot have a negative value '$1'",text)
return}
if(h>50||wl>80||wr>80){error(1,null,"%%deco: abnormal h/wl/wr value '$1'",text)
return}
dd=dd_tb[nm]
if(!dd){dd={name:nm}
dd_tb[nm]=dd}
dd.func=dd.name.indexOf("head-")==0?9:c_func;dd.glyph=a[2];dd.h=h;dd.wl=wl;dd.wr=wr;str=text.replace(a[0],'').trim()
if(str){if(str[0]=='"')
str=str.slice(1,-1);dd.str=str}
if(dd.func==6&&dd.str==undefined)
dd.str=dd.name
c=dd.name.slice(-1)
if(c=='('||(c==')'&&dd.name.indexOf('(')<0)){dd.str=null;name2=dd.name.slice(0,-1)+(c=='('?')':'(');dd2=dd_tb[name2]
if(dd2){if(c=='('){dd.dd_en=dd2;dd2.dd_st=dd}else{dd.dd_st=dd2;dd2.dd_en=dd}}else{dd2=deco_def(name2)
if(!dd2)
return}}
return dd}
function deco_cnv(a_dcn,s,prev){var i,j,dd,dcn,note,nd=a_dcn.length
for(i=0;i<nd;i++){dcn=a_dcn[i];dd=dd_tb[dcn]
if(!dd){dd=deco_def(dcn)
if(!dd)
continue}
switch(dd.func){case 0:if(s.type==C.BAR&&dd.name=="dot"){s.bar_dotted=true
break}
case 1:case 2:if(!s.notes){error(1,s,errs.must_note_rest,dd.name)
continue}
break
case 8:if(s.type!=C.NOTE){error(1,s,errs.must_note,dd.name)
continue}
note=s.notes[s.nhd]
if(!note.a_dcn)
note.a_dcn=[]
note.a_dcn.push(dd.name)
continue
case 9:if(!s.notes){error(1,s,errs.must_note_rest,dd.name)
continue}
for(j=0;j<=s.nhd;j++){note=s.notes[j]
if(!note.a_dcn)
note.a_dcn=[]
note.a_dcn.push(dd.name)}
continue
default:break
case 10:if(s.notes){for(j=0;j<=s.nhd;j++)
s.notes[j].color=dd.name}else{s.color=dd.name}
continue
case 32:s.invis=true
continue
case 33:if(s.type!=C.BAR){error(1,s,"!beamon! must be on a bar")
continue}
s.beam_on=true
continue
case 34:if(s.type!=C.NOTE||!prev||prev.type!=C.NOTE||s.dur!=prev.dur){error(1,s,"!$1! must be on the last of a couple of notes",dd.name)
continue}
s.trem2=true;s.beam_end=true;s.beam_st=false;prev.beam_st=true;prev.beam_end=false;s.ntrem=prev.ntrem=Number(dd.name[4]);for(j=0;j<=s.nhd;j++)
s.notes[j].dur*=2;for(j=0;j<=prev.nhd;j++)
prev.notes[j].dur*=2
continue
case 35:if(s.type!=C.NOTE){error(1,s,"!xstem! must be on a note")
continue}
s.xstem=true;continue
case 36:if(s.type!=C.NOTE){error(1,s,errs.must_note,dd.name)
continue}
if(dd.name[6]=='1')
s.beam_br1=true
else
s.beam_br2=true
continue
case 37:s.rbstop=1
continue
case 38:if(s.type!=C.NOTE){error(1,s,errs.must_note,dd.name)
continue}
s.trem1=true;s.ntrem=dd.name.length
continue
case 39:if(s.type!=C.NOTE){error(1,s,errs.must_note,dd.name)
continue}
s.feathered_beam=dd.name[5]=='a'?1:-1;continue
case 40:s.stemless=true
continue
case 41:s.rbstop=2
continue}
if(!s.a_dd)
s.a_dd=[]
s.a_dd.push(dd)}}
function deco_update(s,dx){var i,de,nd=a_de.length
for(i=0;i<nd;i++){de=a_de[i]
if(de.s==s)
de.x+=dx}}
function deco_width(s){var dd,i,wl=0,a_dd=s.a_dd,nd=a_dd.length
for(i=0;i<nd;i++){dd=a_dd[i]
switch(dd.func){case 1:if(wl<7)
wl=7
break
case 2:if(wl<14)
wl=14
break
case 3:switch(dd.glyph){case"brth":case"lphr":case"mphr":case"sphr":if(s.wr<20)
s.wr=20
break}
break}}
if(wl!=0&&s.prev&&s.prev.type==C.BAR)
wl-=3
return wl}
function draw_all_deco(){if(a_de.length==0)
return
var de,de2,dd,s,note,f,st,x,y,y2,ym,uf,i,str,a,new_de=[],ymid=[]
if(!cfmt.dynalign){st=nstaff;y=staff_tb[st].y
while(--st>=0){y2=staff_tb[st].y;ymid[st]=(y+24+y2)*.5;y=y2}}
while(1){de=a_de.shift()
if(!de)
break
dd=de.dd
if(!dd)
continue
if(dd.dd_en)
continue
s=de.s
f=dd.glyph;i=f.indexOf('/')
if(i>0){if(s.stem>=0)
f=f.slice(0,i)
else
f=f.slice(i+1)}
if(f_staff[dd.func])
set_sscale(s.st)
else
set_scale(s);st=de.st;if(!staff_tb[st].topbar)
continue
x=de.x;y=de.y+staff_tb[st].y
if(de.m!=undefined){note=s.notes[de.m];x+=note.shhd*stv_g.scale}else if(f_staff[dd.func]&&!cfmt.dynalign&&((de.up&&st>0)||(!de.up&&st<nstaff))){if(de.up)
ym=ymid[--st]
else
ym=ymid[st++];ym-=dd.h*.5
if((de.up&&y<ym)||(!de.up&&y>ym)){y2=y_get(st,!de.up,de.x,de.val)
+staff_tb[st].y
if(de.up)
y2-=dd.h
if((de.up&&y2>ym)||(!de.up&&y2<ym)){y=ym}}}
uf=user[f]
if(uf&&typeof(uf)=="function"){uf(x,y,de)
continue}
if(self.psdeco(f,x,y,de))
continue
anno_start(s,'deco')
if(de.inv){g_open(x,y,0,1,-1);x=y=0}
if(de.has_val){if(dd.func!=2||stv_g.st<0)
out_deco_val(x,y,f,de.val/stv_g.scale,de.defl)
else
out_deco_val(x,y,f,de.val,de.defl)
if(de.defl.noen)
new_de.push(de.start)}else if(dd.str!=undefined){str=dd.str
if(str[0]=='@'){a=str.match(/^@([0-9.-]+),([0-9.-]+);?/);x+=Number(a[1]);y+=Number(a[2]);str=str.replace(a[0],"")}
out_deco_str(x,y,f,str)}else if(de.lden){out_deco_long(x,y,de)}else{xygl(x,y,f)}
if(stv_g.g)
g_close();anno_stop(s,'deco')}
a_de=new_de}
function draw_deco_near(){var s,g
function ldeco_update(s){var i,de,x=s.x-s.wl,nd=a_de.length
for(i=0;i<nd;i++){de=a_de[i];de.ix=i;de.s.x=de.x=x;de.defl.nost=true}}
function create_deco(s){var dd,k,l,pos,de,x,nd=s.a_dd.length
for(k=0;k<nd;k++){dd=s.a_dd[k]
switch(dd.func){default:pos=0
break
case 3:case 4:pos=s.pos.orn
break
case 6:pos=s.pos.vol
break
case 7:pos=s.pos.dyn
break}
if(pos==C.SL_HIDDEN)
continue
de={s:s,dd:dd,st:s.st,ix:a_de.length,defl:{},x:s.x,y:s.y,}
a_de.push(de)
if(dd.dd_en){de.ldst=true}else if(dd.dd_st){de.lden=true;de.defl.nost=true}
if(!f_near[dd.func])
continue
func_tb[dd.func](de)}}
function create_dh(s,m){var f,str,de,uf,k,dcn,dd,note=s.notes[m],nd=note.a_dcn.length
for(k=0;k<nd;k++){dcn=note.a_dcn[k];dd=dd_tb[dcn]
if(!dd){dd=deco_def(dcn)
if(!dd)
continue}
switch(dd.func){case 0:case 1:case 3:case 4:case 8:break
default:error(1,null,"Cannot have !$1! on a head",dd.name)
continue
case 9:note.invis=true
break
case 10:note.color=dd.name
continue
case 32:note.invis=true
continue
case 40:s.stemless=true
continue}
de={s:s,dd:dd,st:s.st,m:m,ix:0,defl:{},x:s.x,y:3*(note.pit-18),}
a_de.push(de)
if(dd.dd_en){de.ldst=true}else if(dd.dd_st){de.lden=true;de.defl.nost=true}}}
function create_all(s){var m
if(s.a_dd)
create_deco(s)
if(s.notes){for(m=0;m<s.notes.length;m++){if(s.notes[m].a_dcn)
create_dh(s,m)}}}
function ll_deco(){var i,j,de,de2,dd,dd2,v,s,st,n_de=a_de.length
for(i=0;i<n_de;i++){de=a_de[i]
if(!de.ldst)
continue
dd=de.dd;dd2=dd.dd_en;s=de.s;v=s.v
for(j=i+1;j<n_de;j++){de2=a_de[j]
if(!de2.start&&de2.dd==dd2&&de2.s.v==v)
break}
if(j==n_de){st=s.st;for(j=i+1;j<n_de;j++){de2=a_de[j]
if(!de2.start&&de2.dd==dd2&&de2.s.st==st)
break}}
if(j==n_de){de2={s:de.s,st:de.st,dd:dd2,ix:a_de.length-1,x:realwidth-6,y:de.s.y,lden:true,defl:{noen:true}}
if(de2.x<s.x+10)
de2.x=s.x+10
if(de.m!=undefined)
de2.m=de.m;a_de.push(de2)}
de2.start=de;de2.defl.nost=de.defl.nost
if(dd.name=="trill("&&i>0&&a_de[i-1].dd.name=="trill")
de2.prev=a_de[i-1]}
for(i=0;i<n_de;i++){de2=a_de[i]
if(!de2.lden||de2.start)
continue
s=de2.s;de={s:prev_scut(s),st:de2.st,dd:de2.dd.dd_st,ix:a_de.length-1,y:s.y,ldst:true}
de.x=de.s.x
if(de2.m!=undefined)
de.m=de2.m;a_de.push(de);de2.start=de}}
for(s=tsfirst;s;s=s.ts_next){switch(s.type){case C.CLEF:case C.KEY:case C.METER:continue}
break}
if(a_de.length!=0)
ldeco_update(s)
for(;s;s=s.ts_next){switch(s.type){case C.BAR:case C.MREST:case C.NOTE:case C.REST:case C.SPACE:break
case C.GRACE:for(g=s.extra;g;g=g.next)
create_all(g)
default:continue}
create_all(s)}
ll_deco()}
function draw_deco_note(){var i,de,dd,f,nd=a_de.length
for(i=0;i<nd;i++){de=a_de[i];dd=de.dd;f=dd.func
if(f_note[f]&&de.m==undefined)
func_tb[f](de)}}
function draw_deco_staff(){var s,first_gchord,p_voice,x,y,w,i,v,de,dd,gch,gch2,ix,top,bot,minmax=new Array(nstaff+1),nd=a_de.length
function draw_repbra(p_voice){var s,s1,y,y2,i,p,w,wh,first_repeat;y=staff_tb[p_voice.st].topbar+25
for(s=p_voice.sym;s;s=s.next){if(s.type!=C.BAR)
continue
if(!s.rbstart||s.norepbra)
continue
if(!s.next)
break
if(!first_repeat){first_repeat=s;set_font("repeat")}
s1=s
for(;;){if(!s.next)
break
s=s.next
if(s.rbstop)
break}
y2=y_get(p_voice.st,true,s1.x,s.x-s1.x)
if(y<y2)
y=y2
if(s1.text){wh=strwh(s1.text);y2=y_get(p_voice.st,true,s1.x+4,wh[0]);y2+=wh[1]
if(y<y2)
y=y2}
if(s.rbstart)
s=s.prev}
s=first_repeat
if(!s)
return
set_dscale(p_voice.st,true);y2=y*staff_tb[p_voice.st].staffscale
for(;s;s=s.next){if(!s.rbstart||s.norepbra)
continue
s1=s
while(1){if(!s.next)
break
s=s.next
if(s.rbstop)
break}
if(s1==s)
break
x=s1.x
if(s.type!=C.BAR){w=s.rbstop?0:s.x-realwidth+4}else if((s.bar_type.length>1&&s.bar_type!="[]")||s.bar_type=="]"){if(s1.st>0&&!(cur_sy.staves[s1.st-1].flags&STOP_BAR))
w=s.wl
else if(s.bar_type.slice(-1)==':')
w=12
else if(s.bar_type[0]!=':')
w=0
else
w=8}else{w=s.rbstop?0:8}
w=(s.x-x-w)
if(!s.next&&!s.rbstop&&!p_voice.bar_start){p_voice.bar_start=clone(s);p_voice.bar_start.type=C.BAR;p_voice.bar_start.bar_type=""
delete p_voice.bar_start.text;p_voice.bar_start.rbstart=1
delete p_voice.bar_start.a_gch}
if(s1.text)
xy_str(x+4,y2-gene.curfont.size-3,s1.text);xypath(x,y2);if(s1.rbstart==2)
output+='m0 20v-20';output+='h'+w.toFixed(1)
if(s.rbstop==2)
output+='v20';output+='"/>\n';y_set(s1.st,true,x,w,y+2)
if(s.rbstart)
s=s.prev}}
for(i=0;i<=nstaff;i++)
minmax[i]={ymin:0,ymax:0}
for(i=0;i<nd;i++){de=a_de[i];dd=de.dd
if(!dd)
continue
if(!f_staff[dd.func]||de.m!=undefined)
continue
func_tb[dd.func](de)
if(dd.dd_en)
continue
if(cfmt.dynalign){if(de.up){if(de.y>minmax[de.st].ymax)
minmax[de.st].ymax=de.y}else{if(de.y<minmax[de.st].ymin)
minmax[de.st].ymin=de.y}}}
for(i=0;i<nd;i++){de=a_de[i];dd=de.dd
if(!dd)
continue
if(dd.dd_en||!f_staff[dd.func])
continue
if(cfmt.dynalign){if(de.up)
y=minmax[de.st].ymax
else
y=minmax[de.st].ymin;de.y=y}else{y=de.y}
if(de.up)
y+=dd.h;y_set(de.st,de.up,de.x,de.val,y)}
for(i=0;i<=nstaff;i++)
minmax[i]={ymin:0,ymax:24}
for(s=tsfirst;s;s=s.ts_next){if(!s.a_gch)
continue
if(!first_gchord)
first_gchord=s;gch2=null
for(ix=0;ix<s.a_gch.length;ix++){gch=s.a_gch[ix]
if(gch.type!='g')
continue
gch2=gch
if(gch.y<0)
break}
if(gch2){w=gch2.wh[0]
if(gch2.y>=0){y=y_get(s.st,true,s.x,w)
if(y>minmax[s.st].ymax)
minmax[s.st].ymax=y}else{y=y_get(s.st,false,s.x,w)
if(y<minmax[s.st].ymin)
minmax[s.st].ymin=y}}}
if(first_gchord){for(i=0;i<=nstaff;i++){bot=staff_tb[i].botbar;if(minmax[i].ymin>bot-4)
minmax[i].ymin=bot-4
top=staff_tb[i].topbar;if(minmax[i].ymax<top+4)
minmax[i].ymax=top+4}
set_dscale(-1)
for(s=first_gchord;s;s=s.ts_next){if(!s.a_gch)
continue
self.draw_gchord(s,minmax[s.st].ymin,minmax[s.st].ymax)}}
for(v=0;v<voice_tb.length;v++){p_voice=voice_tb[v]
if(p_voice.second||!p_voice.sym)
continue
draw_repbra(p_voice)}}
function draw_measnb(){var s,st,bar_num,x,y,w,any_nb,font_size,w0,sy=cur_sy
for(st=0;st<=nstaff;st++){if(sy.st_print[st])
break}
if(st>nstaff)
return
set_dscale(st)
if(staff_tb[st].staffscale!=1){font_size=get_font("measure").size;param_set_font("measurefont","* "+
(font_size/staff_tb[st].staffscale).toString())}
set_font("measure");w0=cwidf('0');s=tsfirst;bar_num=gene.nbar
if(bar_num>1){if(cfmt.measurenb==0){any_nb=true;y=y_get(st,true,0,20)
if(y<staff_tb[st].topbar+14)
y=staff_tb[st].topbar+14;xy_str(0,y,bar_num.toString());y_set(st,true,0,20,y+gene.curfont.size+2)}else if(bar_num%cfmt.measurenb==0){for(;;s=s.ts_next){switch(s.type){case C.TIMESIG:case C.CLEF:case C.KEYSIG:case C.FMTCHG:case C.STBRK:continue}
break}
if(s.type!=C.BAR||!s.bar_num){if(s.prev)
s=s.prev;x=s.x+s.wr;any_nb=true;w=w0
if(bar_num>=10)
w*=bar_num>=100?3:2
if(gene.curfont.box)
w+=4;y=y_get(st,true,x,w)
if(y<staff_tb[st].topbar+6)
y=staff_tb[st].topbar+6;y+=2;xy_str(x,y,bar_num.toString())
if(gene.curfont.box){y+=2;w+=3}
y+=gene.curfont.size;y_set(st,true,x,w,y);s.ymx=y}}}
for(;s;s=s.ts_next){switch(s.type){case C.STAVES:sy=s.sy
for(st=0;st<nstaff;st++){if(sy.st_print[st])
break}
set_dscale(st)
continue
default:continue
case C.BAR:if(!s.bar_num)
continue
break}
bar_num=s.bar_num
if(cfmt.measurenb==0||(bar_num%cfmt.measurenb)!=0||!s.next||s.bar_mrep)
continue
if(!any_nb)
any_nb=true;w=w0
if(bar_num>=10)
w*=bar_num>=100?3:2
x=s.x-w*.4;y=y_get(st,true,x,w)
if(y<staff_tb[st].topbar+3)
y=staff_tb[st].topbar+3
if(s.next.type==C.NOTE){if(s.next.stem>0){if(y<s.next.ys-gene.curfont.size)
y=s.next.ys-gene.curfont.size}else{if(y<s.next.y)
y=s.next.y}}
y+=2;if(gene.curfont.box){y+=2;w+=3}
xy_str(x,y,bar_num.toString())
y+=gene.curfont.size;if(gene.curfont.box)
y+=2;y_set(st,true,x,w,y);s.ymx=y}
gene.nbar=bar_num
if(font_size)
param_set_font("measurefont","* "+font_size.toString())}
function draw_notempo(s,x,y,dur,sc){var dx,p,dotx,elts=identify_note(s,dur),head=elts[0],dots=elts[1],nflags=elts[2]
out_XYAB('<g transform="translate(X,Y) scale(F)">\n',x+4,y+4,sc)
switch(head){case C.OVAL:p="HD"
break
case C.EMPTY:p="Hd"
break
default:p="hd"
break}
xygl(-posx,posy,p);dx=4
if(dots){dotx=9
if(nflags>0)
dotx+=4
switch(head){case C.SQUARE:dotx+=3
break
case C.OVALBARS:case C.OVAL:dotx+=2
break
case C.EMPTY:dotx+=1
break}
dx=dotx*dots;dotx-=posx
while(--dots>=0){xygl(dotx,posy,"dot");dotx+=3.5}}
if(dur<C.BLEN){if(nflags<=0){out_stem(-posx,posy,21)}else{out_stem(-posx,posy,21,false,nflags)
if(dx<6)
dx=6}}
output+='</g>\n'
return(dx+15)*sc}
function tempo_width(s){var w=0;if(s.tempo_wh1)
w=s.tempo_wh1[0]
if(s.tempo_wh0)
w+=s.tempo_wh0[0]
if(s.tempo_wh2)
w+=s.tempo_wh2[0]
return w}
function write_tempo(s,x,y){var j,dx,bx,bh,sc=.7*gene.curfont.size/12.0;set_font("tempo")
if(gene.curfont.box){gene.curfont.box=false
bx=x}
if(s.tempo_str1){xy_str(x,y,s.tempo_str1,null,null,s.tempo_wh1);x+=s.tempo_wh1[0]+3}
if(s.tempo_notes){for(j=0;j<s.tempo_notes.length;j++)
x+=draw_notempo(s,x,y,s.tempo_notes[j],sc);xy_str(x,y,s.tempo_str0,null,null,s.tempo_wh0);x+=s.tempo_wh0[0]
if(s.tempo)
x+=5
else
x+=draw_notempo(s,x,y,s.new_beat,sc)}
if(s.tempo_str2)
xy_str(x,y,s.tempo_str2,null,null,s.tempo_wh2)
if(bx){gene.curfont.box=true
if(s.tempo_str2)
x+=s.tempo_wh2[0]+3;bh=gene.curfont.size+4;output+='<rect class="stroke" x="';out_sxsy(bx-2,'" y="',y+bh-1);output+='" width="'+(x-bx+2).toFixed(1)+'" height="'+bh.toFixed(1)+'"/>\n'}
s.del=true}
function draw_partempo(st,top){var s,some_part,some_tempo,h,w,y,dy=0,ht=0
var ymin=staff_tb[st].topbar+8,dosh=0,shift=1,x=-100
for(s=tsfirst;s;s=s.ts_next){if(s.type!=C.TEMPO||s.del)
continue
if(!some_tempo)
some_tempo=s;w=tempo_width(s);if(s.time==0&&s.x>40)
s.x=40;y=y_get(st,true,s.x-16,w)
if(y>ymin)
ymin=y
if(x>=s.x-16&&!(dosh&(shift>>1)))
dosh|=shift;shift<<=1;x=s.x-16+w}
if(some_tempo){set_sscale(-1);set_font("tempo");ht=gene.curfont.size+8;y=2-ht;h=y-ht
if(dosh!=0)
ht*=2
if(top<ymin+ht)
dy=ymin+ht-top
for(s=some_tempo;s;s=s.ts_next){if(s.type!=C.TEMPO||s.del)
continue
if(user.anno_start||user.anno_stop){s.wl=16;s.wr=30;s.ymn=(dosh&1)?h:y;s.ymx=s.ymn+14;anno_start(s)}
write_tempo(s,s.x-16,(dosh&1)?h:y);anno_stop(s);dosh>>=1}}
ymin=staff_tb[st].topbar+6
for(s=tsfirst;s;s=s.ts_next){if(s.type!=C.PART)
continue
if(!some_part){some_part=s;set_font("parts");h=gene.curfont.size+2}
w=strwh(s.text)[0];y=y_get(st,true,s.x-10,w+3)
if(ymin<y)
ymin=y}
if(some_part){set_sscale(-1)
if(gene.curfont.box)
h+=2
if(top<ymin+h+ht)
dy=ymin+h+ht-top
for(s=some_part;s;s=s.ts_next){if(s.type!=C.PART)
continue
s.x-=10;if(user.anno_start||user.anno_stop){w=strwh(s.text)[0];s.wl=0;s.wr=w;s.ymn=-ht-h;s.ymx=s.ymn+h;anno_start(s)}
xy_str(s.x,2-ht-h,s.text);anno_stop(s)}}
return dy}
var STEM_MIN=16,STEM_MIN2=14,STEM_MIN3=12,STEM_MIN4=10,STEM_CH_MIN=14,STEM_CH_MIN2=10,STEM_CH_MIN3=9,STEM_CH_MIN4=9,BEAM_DEPTH=3.2,BEAM_OFFSET=.25,BEAM_SHIFT=5,BEAM_SLOPE=.4,BEAM_STUB=8,SLUR_SLOPE=.5,GSTEM=15,GSTEM_XOFF=2.3
var cache
function b_pos(grace,stem,nflags,b){var top,bot,d1,d2,shift=!grace?BEAM_SHIFT:3.5,depth=!grace?BEAM_DEPTH:1.8
function rnd6(y){var iy=Math.round((y+12)/6)*6-12
return iy-y}
if(stem>0){bot=b-(nflags-1)*shift-depth
if(bot>26)
return 0
top=b}else{top=b+(nflags-1)*shift+depth
if(top<-2)
return 0
bot=b}
d1=rnd6(top-BEAM_OFFSET);d2=rnd6(bot+BEAM_OFFSET)
return d1*d1>d2*d2?d2:d1}
function sym_dup(s){var m,note
s=clone(s)
s.invis=true
delete s.extra;delete s.text
delete s.a_gch
delete s.a_ly
delete s.a_dd;s.notes=clone(s.notes)
for(m=0;m<=s.nhd;m++){note=s.notes[m]=clone(s.notes[m])
delete note.a_dcn}
return s}
var min_tb=[[STEM_MIN,STEM_MIN,STEM_MIN2,STEM_MIN3,STEM_MIN4,STEM_MIN4],[STEM_CH_MIN,STEM_CH_MIN,STEM_CH_MIN2,STEM_CH_MIN3,STEM_CH_MIN4,STEM_CH_MIN4]]
Abc.prototype.calculate_beam=function(bm,s1){var s,s2,g,notes,nflags,st,v,two_staves,two_dir,x,y,ys,a,b,stem_err,max_stem_err,p_min,p_max,s_closest,stem_xoff,scale,visible,dy
if(!s1.beam_st){s=sym_dup(s1);lkvsym(s,s1);lktsym(s,s1);s.x-=12
if(s.x>s1.prev.x+12)
s.x=s1.prev.x+12;s.beam_st=true
delete s.beam_end;s.tmp=true
delete s.sls;s1=s}
notes=nflags=0;two_staves=two_dir=false;st=s1.st;v=s1.v;stem_xoff=s1.grace?GSTEM_XOFF:3.5
for(s2=s1;;s2=s2.next){if(s2.type==C.NOTE){if(s2.nflags>nflags)
nflags=s2.nflags;notes++
if(s2.st!=st)
two_staves=true
if(s2.stem!=s1.stem)
two_dir=true
if(!visible&&!s2.invis&&(!s2.stemless||s2.trem2))
visible=true
if(s2.beam_end)
break}
if(!s2.next){for(;;s2=s2.prev){if(s2.type==C.NOTE)
break}
s=sym_dup(s2);s.next=s2.next
if(s.next)
s.next.prev=s;s2.next=s;s.prev=s2;s.ts_next=s2.ts_next
if(s.ts_next)
s.ts_next.ts_prev=s;s2.ts_next=s;s.ts_prev=s2
delete s.beam_st;s.beam_end=true;s.tmp=true
delete s.sls;s.x+=12
if(s.x<realwidth-12)
s.x=realwidth-12;s2=s;notes++
break}}
if(!visible)
return false;bm.s2=s2
if(staff_tb[st].y==0){if(two_staves)
return false}else{if(!two_staves){bm.s1=s1;bm.a=(s1.ys-s2.ys)/(s1.xs-s2.xs);bm.b=s1.ys-s1.xs*bm.a+staff_tb[st].y;bm.nflags=nflags
return true}}
s_closest=s1;p_min=100;p_max=0
for(s=s1;;s=s.next){if(s.type!=C.NOTE)
continue
if((scale=s.p_v.scale)==1)
scale=staff_tb[s.st].staffscale
if(s.stem>=0){x=stem_xoff+s.notes[0].shhd
if(s.notes[s.nhd].pit>p_max){p_max=s.notes[s.nhd].pit;s_closest=s}}else{x=-stem_xoff+s.notes[s.nhd].shhd
if(s.notes[0].pit<p_min){p_min=s.notes[0].pit;s_closest=s}}
s.xs=s.x+x*scale;if(s==s2)
break}
if(cfmt.flatbeams)
a=0
else if(!two_dir&&notes>=3&&s_closest!=s1&&s_closest!=s2)
a=0
y=s1.ys+staff_tb[st].y
if(a==undefined)
a=(s2.ys+staff_tb[s2.st].y-y)/(s2.xs-s1.xs)
if(a!=0){if(a>0)
a=BEAM_SLOPE*a/(BEAM_SLOPE+a)
else
a=BEAM_SLOPE*a/(BEAM_SLOPE-a)}
b=(y+s2.ys+staff_tb[s2.st].y)/2-a*(s2.xs+s1.xs)/2
max_stem_err=0;s=s1
if(two_dir){ys=((s1.grace?3.5:BEAM_SHIFT)*(nflags-1)+
BEAM_DEPTH)*.5
if(s1.stem!=s2.stem&&s1.nflags<s2.nflags)
b+=ys*s2.stem
else
b+=ys*s1.stem}else if(!s1.grace){var beam_h=BEAM_DEPTH+BEAM_SHIFT*(nflags-1)
while(s.ts_prev&&s.ts_prev.type==C.NOTE&&s.ts_prev.time==s.time&&s.ts_prev.x>s1.xs)
s=s.ts_prev
for(;s&&s.time<=s2.time;s=s.ts_next){if(s.type!=C.NOTE||s.invis||(s.st!=st&&s.v!=v)){continue}
x=s.v==v?s.xs:s.x;ys=a*x+b-staff_tb[s.st].y
if(s.v==v){stem_err=min_tb[s.nhd==0?0:1][s.nflags]
if(s.stem>0){if(s.notes[s.nhd].pit>26){stem_err-=2
if(s.notes[s.nhd].pit>28)
stem_err-=2}
stem_err-=ys-3*(s.notes[s.nhd].pit-18)}else{if(s.notes[0].pit<18){stem_err-=2
if(s.notes[0].pit<16)
stem_err-=2}
stem_err-=3*(s.notes[0].pit-18)-ys}
stem_err+=BEAM_DEPTH+BEAM_SHIFT*(s.nflags-1)}else{if(s1.stem>0){if(s.stem>0){if(s.ymn>ys+4||s.ymx<ys-beam_h-2)
continue
if(s.v>v)
stem_err=s.ymx-ys
else
stem_err=s.ymn+8-ys}else{stem_err=s.ymx-ys}}else{if(s.stem<0){if(s.ymx<ys-4||s.ymn>ys-beam_h-2)
continue
if(s.v<v)
stem_err=ys-s.ymn
else
stem_err=ys-s.ymx+8}else{stem_err=ys-s.ymn}}
stem_err+=2+beam_h}
if(stem_err>max_stem_err)
max_stem_err=stem_err}}else{for(;;s=s.next){ys=a*s.xs+b-staff_tb[s.st].y;stem_err=GSTEM-2
if(s.stem>0)
stem_err-=ys-(3*(s.notes[s.nhd].pit-18))
else
stem_err+=ys-(3*(s.notes[0].pit-18));stem_err+=3*(s.nflags-1)
if(stem_err>max_stem_err)
max_stem_err=stem_err
if(s==s2)
break}}
if(max_stem_err>0)
b+=s1.stem*max_stem_err
if(!two_staves&&!two_dir)
for(s=s1.next;;s=s.next){switch(s.type){case C.REST:g=s.ts_next
if(!g||g.st!=st||(g.type!=C.NOTE&&g.type!=C.REST))
break
case C.BAR:if(s.invis)
break
case C.CLEF:y=a*s.x+b
if(s1.stem>0){y=s.ymx-y
+BEAM_DEPTH+BEAM_SHIFT*(nflags-1)
+2
if(y>0)
b+=y}else{y=s.ymn-y
-BEAM_DEPTH-BEAM_SHIFT*(nflags-1)
-2
if(y<0)
b+=y}
break
case C.GRACE:for(g=s.extra;g;g=g.next){y=a*g.x+b
if(s1.stem>0){y=g.ymx-y
+BEAM_DEPTH+BEAM_SHIFT*(nflags-1)
+2
if(y>0)
b+=y}else{y=g.ymn-y
-BEAM_DEPTH-BEAM_SHIFT*(nflags-1)
-2
if(y<0)
b+=y}}
break}
if(s==s2)
break}
if(a==0)
b+=b_pos(s1.grace,s1.stem,nflags,b-staff_tb[st].y)
for(s=s1;;s=s.next){switch(s.type){case C.NOTE:s.ys=a*s.xs+b-staff_tb[s.st].y
if(s.stem>0){s.ymx=s.ys+2.5
if(s.ts_prev&&s.ts_prev.stem>0&&s.ts_prev.st==s.st&&s.ts_prev.ymn<s.ymx&&s.ts_prev.x==s.x&&s.notes[0].shhd==0){s.ts_prev.x-=3;s.ts_prev.xs-=3}}else{s.ymn=s.ys-2.5}
break
case C.REST:y=a*s.x+b-staff_tb[s.st].y
dy=BEAM_DEPTH+BEAM_SHIFT*(nflags-1)
+(s.head!=C.FULL?4:9)
if(s1.stem>0){y-=dy
if(s1.multi==0&&y>12)
y=12
if(s.y<=y)
break}else{y+=dy
if(s1.multi==0&&y<12)
y=12
if(s.y>=y)
break}
if(s.head!=C.FULL)
y=(((y+3+12)/6)|0)*6-12;s.y=y
break}
if(s==s2)
break}
if(staff_tb[st].y==0)
return false
bm.s1=s1;bm.a=a;bm.b=b;bm.nflags=nflags
return true}
function draw_beams(bm){var s,i,beam_dir,shift,bshift,bstub,bh,da,k,k1,k2,x1,s1=bm.s1,s2=bm.s2
function draw_beam(x1,x2,dy,h,bm,n){var y1,dy2,s=bm.s1,nflags=s.nflags
if(s.ntrem)
nflags-=s.ntrem
if(s.trem2&&n>nflags){if(s.dur>=C.BLEN/2){x1=s.x+6;x2=bm.s2.x-6}else if(s.dur<C.BLEN/4){x1+=5;x2-=6}}
y1=bm.a*x1+bm.b-dy;x2-=x1;x2/=stv_g.scale;dy2=bm.a*x2*stv_g.scale;xypath(x1,y1,true);output+='l'+x2.toFixed(1)+' '+(-dy2).toFixed(1)+'v'+h.toFixed(1)+'l'+(-x2).toFixed(1)+' '+dy2.toFixed(1)+'z"/>\n'}
anno_start(s1,'beam')
if(!s1.grace){bshift=BEAM_SHIFT;bstub=BEAM_STUB;shift=.34;bh=BEAM_DEPTH}else{bshift=3.5;bstub=3.2;shift=.29;bh=1.8}
beam_dir=s1.stem
if(s1.stem!=s2.stem&&s1.nflags<s2.nflags)
beam_dir=s2.stem
if(beam_dir<0)
bh=-bh;draw_beam(s1.xs-shift,s2.xs+shift,0,bh,bm,1);da=0
for(s=s1;;s=s.next){if(s.type==C.NOTE&&s.stem!=beam_dir)
s.ys=bm.a*s.xs+bm.b
-staff_tb[s.st].y
+bshift*(s.nflags-1)*s.stem
-bh
if(s==s2)
break}
if(s1.feathered_beam){da=bshift/(s2.xs-s1.xs)
if(s1.feathered_beam>0){da=-da;bshift=da*s1.xs}else{bshift=da*s2.xs}
da=da*beam_dir}
shift=0
for(i=2;i<=bm.nflags;i++){shift+=bshift
if(da!=0)
bm.a+=da
for(s=s1;;s=s.next){if(s.type!=C.NOTE||s.nflags<i){if(s==s2)
break
continue}
if(s.trem1&&i>s.nflags-s.ntrem){x1=(s.dur>=C.BLEN/2)?s.x:s.xs;draw_beam(x1-5,x1+5,(shift+2.5)*beam_dir,bh,bm,i)
if(s==s2)
break
continue}
k1=s
while(1){if(s==s2)
break
k=s.next
if(k.type==C.NOTE||k.type==C.REST){if(k.trem1){if(k.nflags-k.ntrem<i)
break}else if(k.nflags<i){break}}
if(k.beam_br1||(k.beam_br2&&i>2))
break
s=k}
k2=s
while(k2.type!=C.NOTE)
k2=k2.prev;x1=k1.xs
if(k1==k2){if(k1==s1){x1+=bstub}else if(k1==s2){x1-=bstub}else if(k1.beam_br1||(k1.beam_br2&&i>2)){x1+=bstub}else{k=k1.next
while(k.type!=C.NOTE)
k=k.next
if(k.beam_br1||(k.beam_br2&&i>2)){x1-=bstub}else{k1=k1.prev
while(k1.type!=C.NOTE)
k1=k1.prev
if(k1.nflags<k.nflags||(k1.nflags==k.nflags&&k1.dots<k.dots))
x1+=bstub
else
x1-=bstub}}}
draw_beam(x1,k2.xs,shift*beam_dir,bh,bm,i)
if(s==s2)
break}}
if(s1.tmp)
unlksym(s1)
else if(s2.tmp)
unlksym(s2)
anno_stop(s1,'beam')}
function draw_lstaff(x){var i,j,yb,h,nst=cur_sy.nstaff,l=0
function draw_sysbra(x,st,flag){var i,st_end,yt,yb
while(!cur_sy.st_print[st]){if(cur_sy.staves[st].flags&flag)
return
st++}
i=st_end=st
while(1){if(cur_sy.st_print[i])
st_end=i
if(cur_sy.staves[i].flags&flag)
break
i++}
yt=staff_tb[st].y+staff_tb[st].topbar*staff_tb[st].staffscale;yb=staff_tb[st_end].y+staff_tb[st_end].botbar*staff_tb[st_end].staffscale
if(flag&(CLOSE_BRACE|CLOSE_BRACE2))
out_brace(x,yb,yt-yb)
else
out_bracket(x,yt,yt-yb)}
for(i=0;;i++){if(cur_sy.staves[i].flags&(OPEN_BRACE|OPEN_BRACKET))
l++
if(cur_sy.st_print[i])
break
if(cur_sy.staves[i].flags&(CLOSE_BRACE|CLOSE_BRACKET))
l--
if(i==nst)
break}
for(j=nst;j>i;j--){if(cur_sy.st_print[j])
break}
if(i==j&&l==0)
return
yb=staff_tb[j].y+staff_tb[j].botbar*staff_tb[j].staffscale;h=staff_tb[i].y+staff_tb[i].topbar*staff_tb[i].staffscale-yb;xypath(x,yb);output+="v"+(-h).toFixed(1)+'"/>\n'
for(i=0;i<=nst;i++){if(cur_sy.staves[i].flags&OPEN_BRACE)
draw_sysbra(x,i,CLOSE_BRACE)
if(cur_sy.staves[i].flags&OPEN_BRACKET)
draw_sysbra(x,i,CLOSE_BRACKET)
if(cur_sy.staves[i].flags&OPEN_BRACE2)
draw_sysbra(x-6,i,CLOSE_BRACE2)
if(cur_sy.staves[i].flags&OPEN_BRACKET2)
draw_sysbra(x-6,i,CLOSE_BRACKET2)}}
function draw_meter(x,s){if(!s.a_meter)
return
var dx,i,j,meter,st=s.st,p_staff=staff_tb[st],y=p_staff.y;if(p_staff.stafflines!='|||||')
y+=(p_staff.topbar+p_staff.botbar)/2-12
for(i=0;i<s.a_meter.length;i++){meter=s.a_meter[i];x=s.x+s.x_meter[i]
if(meter.bot){out_XYAB('\
<g transform="translate(X,Y)" text-anchor="middle">\n\
 <text y="-12">A</text>\n\
 <text>B</text>\n\
</g>\n',x,y+6,m_gl(meter.top),m_gl(meter.bot))}else{out_XYAB('\
<text x="X" y="Y" text-anchor="middle">A</text>\n',x,y+12,m_gl(meter.top))}}}
function draw_acc(x,y,acc,micro_n,micro_d){if(micro_n){if(micro_n==micro_d){acc=acc==-1?-2:2}else if(micro_n*2!=micro_d){xygl(x,y,"acc"+acc+'_'+micro_n+'_'+micro_d)
return}}
xygl(x,y,"acc"+acc)}
Abc.prototype.draw_hl=function(x,s,hltype){var i,j,n,hla=[],st=s.st,p_staff=staff_tb[st]
if(!p_staff.hll)
return
for(i=0;i<=s.nhd;i++){if(!p_staff.hlmap[s.notes[i].pit-p_staff.hll])
hla.push((s.notes[i].pit-18)*3)}
n=hla.length
if(!n)
return
var staffb=p_staff.y,stafflines=p_staff.stafflines,top=(stafflines.length-1)*6,bot=p_staff.botline,yl=bot,yu=top
for(i=0;i<hla.length;i++){if(hla[i]<yl){yl=(((hla[i]+51)/6)|0)*6-48;n--}else if(hla[i]>yu){yu=((hla[i]/6)|0)*6;n--}}
for(;yl<bot;yl+=6)
xygl(x,staffb+yl,hltype)
for(;yu>top;yu-=6)
xygl(x,staffb+yu,hltype)
if(!n)
return
i=yl;j=yu
while(i>bot&&stafflines[i/6]=='-')
i-=6
while(j<top&&stafflines[j/6]=='-')
j+=6
for(;i<j;i+=6){if(stafflines[i/6]=='-')
xygl(x,staffb+i,hltype)}}
var sharp_cl=new Int8Array([24,9,15,21,6,12,18]),flat_cl=new Int8Array([12,18,24,9,15,21,6]),sharp1=new Int8Array([-9,12,-9,-9,12,-9]),sharp2=new Int8Array([12,-9,12,-9,12,-9]),flat1=new Int8Array([9,-12,9,-12,9,-12]),flat2=new Int8Array([-12,9,-12,9,-12,9])
Abc.prototype.draw_keysig=function(x,s){if(s.k_none||s.k_play)
return
var old_sf=s.k_old_sf,st=s.st,staffb=staff_tb[st].y,i,shift,p_seq,clef_ix=s.k_y_clef
if(clef_ix&1)
clef_ix+=7;clef_ix/=2
while(clef_ix<0)
clef_ix+=7;clef_ix%=7
if(!s.k_a_acc){if(cfmt.cancelkey||s.k_sf==0){if(s.k_sf==0||old_sf*s.k_sf<0){shift=sharp_cl[clef_ix];p_seq=shift>9?sharp1:sharp2
for(i=0;i<old_sf;i++){xygl(x,staffb+shift,"acc3");shift+=p_seq[i];x+=5.5}
shift=flat_cl[clef_ix];p_seq=shift<18?flat1:flat2
for(i=0;i>old_sf;i--){xygl(x,staffb+shift,"acc3");shift+=p_seq[-i];x+=5.5}
if(s.k_sf!=0)
x+=3}}
if(s.k_sf>0){shift=sharp_cl[clef_ix];p_seq=shift>9?sharp1:sharp2
for(i=0;i<s.k_sf;i++){xygl(x,staffb+shift,"acc1");shift+=p_seq[i];x+=5.5}
if(cfmt.cancelkey&&i<old_sf){x+=2
for(;i<old_sf;i++){xygl(x,staffb+shift,"acc3");shift+=p_seq[i];x+=5.5}}}
if(s.k_sf<0){shift=flat_cl[clef_ix];p_seq=shift<18?flat1:flat2
for(i=0;i>s.k_sf;i--){xygl(x,staffb+shift,"acc-1");shift+=p_seq[-i];x+=5.5}
if(cfmt.cancelkey&&i>old_sf){x+=2
for(;i>old_sf;i--){xygl(x,staffb+shift,"acc3");shift+=p_seq[-i];x+=5.5}}}}else if(s.k_a_acc.length){var acc,last_acc=s.k_a_acc[0].acc,last_shift=100,s2={st:st,nhd:0,notes:[{}]}
for(i=0;i<s.k_a_acc.length;i++){acc=s.k_a_acc[i];shift=(s.k_y_clef
+acc.pit-18)*3
if(i!=0&&(shift>last_shift+18||shift<last_shift-18))
x-=5.5
else if(acc.acc!=last_acc)
x+=3;last_acc=acc.acc;s2.notes[0].pit=shift/3+18;self.draw_hl(x,s2,"hl");last_shift=shift;draw_acc(x,staffb+shift,acc.acc,acc.micro_n,acc.micro_d);x+=5.5}}}
function bar_cnv(bar_type){switch(bar_type){case"[":case"[]":return""
case"|:":case"|::":case"|:::":return"["+bar_type
case":|":case"::|":case":::|":return bar_type+"]"
case"::":return cfmt.dblrepbar}
return bar_type}
var rest_tb=["r128","r64","r32","r16","r8","r4","r2","r1","r0","r00"]
function draw_rest(s){var s2,i,j,x,y,yb,bx,p_staff=staff_tb[s.st]
if(s.dur_orig==s.p_v.meter.wmeasure||(s.rep_nb&&s.rep_nb>=0)){if(s.dur<C.BLEN*2)
s.nflags=-2
else if(s.dur<C.BLEN*4)
s.nflags=-3
else
s.nflags=-4;s.dots=0;s2=s.ts_next
while(s2&&s2.time!=s.time+s.dur)
s2=s2.ts_next;x=s2?s2.x:realwidth;s2=s
while(!s2.seqst)
s2=s2.ts_prev;s2=s2.ts_prev;x=(x+s2.x)/2
if(s.a_dd)
deco_update(s,x-s.x);s.x=x}else{x=s.x
if(s.notes[0].shhd)
x+=s.notes[0].shhd*stv_g.scale}
if(s.invis)
return
yb=p_staff.y
if(s.rep_nb){set_sscale(s.st);anno_start(s);if(p_staff.stafflines=='|||||')
yb+=12
else
yb+=(p_staff.topbar+p_staff.botbar)/2
if(s.rep_nb<0){xygl(x,yb,"srep")}else{xygl(x,yb,"mrep")
if(s.rep_nb>2&&s.v==cur_sy.top_voice){set_font("annotation");if(gene.curfont.box){gene.curfont.box=false;bx=true}
xy_str(x,yb+p_staff.topbar-9,s.rep_nb.toString(),"c")
if(bx)
gene.curfont.box=true}}
anno_stop(s)
return}
set_scale(s);anno_start(s);if(s.notes[0].color)
set_color(s.notes[0].color);y=s.y;i=5-s.nflags
if(i==7&&y==12&&p_staff.stafflines.length<=2)
y-=6
xygl(x,y+yb,s.notes[0].head||rest_tb[i])
if(i>=6){j=y/6
switch(i){default:switch(p_staff.stafflines[j+1]){case'|':case'[':break
default:xygl(x,y+6+yb,"hl1")
break}
if(i==9){y-=6;j--}
break
case 7:y+=6;j++
case 6:break}
switch(p_staff.stafflines[j]){case'|':case'[':break
default:xygl(x,y+yb,"hl1")
break}}
if(s.dots){x+=8;y+=yb+3
for(i=0;i<s.dots;i++){xygl(x,y,"dot");x+=3.5}}
set_color();anno_stop(s)}
function draw_gracenotes(s){var yy,x0,y0,x1,y1,x2,y2,x3,y3,bet1,bet2,slur,dy1,dy2,g,last,note,bm={}
for(g=s.extra;g;g=g.next){if(g.beam_st&&!g.beam_end){if(self.calculate_beam(bm,g))
draw_beams(bm)}
anno_start(g);draw_note(g,!bm.s2)
if(g==bm.s2)
bm.s2=null
anno_stop(g)
if(g.sls)
slur=true
if(!g.next)
break}
if(s.sappo){g=s.extra
if(!g.next){x1=9;y1=g.stem>0?5:-5}else{x1=(g.next.x-g.x)*.5+4;y1=(g.ys+g.next.ys)*.5-g.y
if(g.stem>0)
y1-=1
else
y1+=1}
note=g.notes[g.stem<0?0:g.nhd];out_acciac(x_head(g,note),y_head(g,note),x1,y1,g.stem>0)}
if(s.p_v.key.k_bagpipe||!cfmt.graceslurs||slur||s.tie_s||!s.next||s.next.type!=C.NOTE)
return
last=g
if(((g.stem>=0||s.multi<0)&&g.notes[0].pit<=28)||g.notes[0].pit<16){yy=127
for(g=s.extra;g;g=g.next){if(g.y<yy){yy=g.y;last=g}}
x0=last.x;y0=last.y-5
if(s.extra!=last){x0-=4;y0+=1}
s=s.next;x3=s.x-1
if(s.stem<0&&s.nflags>-2)
x3-=4;y3=3*(s.notes[0].pit-18)-5;dy1=(x3-x0)*.4
if(dy1>3)
dy1=3;dy2=dy1;bet1=.2;bet2=.8
if(y0>y3+7){x0=last.x-1;y0+=.5;y3+=6.5;x3=s.x-5.5;dy1=(y0-y3)*.8;dy2=(y0-y3)*.2;bet1=0}else if(y3>y0+4){y3=y0+4;x0=last.x+2;y0=last.y-4}}else{yy=-127
for(g=s.extra;g;g=g.next){if(g.y>yy){yy=g.y;last=g}}
x0=last.x;y0=last.y+5
if(s.extra!=last){x0-=4;y0-=1}
s=s.next;x3=s.x-1
if(s.stem>=0&&s.nflags>-2)
x3-=2;y3=3*(s.notes[s.nhd].pit-18)+5;dy1=(x0-x3)*.4
if(dy1<-3)
dy1=-3;dy2=dy1;bet1=.2;bet2=.8
if(y0<y3-7){x0=last.x-1;y0-=.5;y3-=6.5;x3=s.x-5.5;dy1=(y0-y3)*.8;dy2=(y0-y3)*.2;bet1=0}else if(y3<y0-4){y3=y0-4;x0=last.x+2;y0=last.y+4}}
x1=bet1*x3+(1-bet1)*x0-x0;y1=bet1*y3+(1-bet1)*y0-dy1-y0;x2=bet2*x3+(1-bet2)*x0-x0;y2=bet2*y3+(1-bet2)*y0-dy2-y0;anno_start(s,'slur');xypath(x0,y0+staff_tb[s.st].y);output+='c'+x1.toFixed(1)+' '+(-y1).toFixed(1)+' '+x2.toFixed(1)+' '+(-y2).toFixed(1)+' '+(x3-x0).toFixed(1)+' '+(-y3+y0).toFixed(1)+'"/>\n';anno_stop(s,'slur')}
function setdoty(s,y_tb){var m,m1,y
for(m=0;m<=s.nhd;m++){y=3*(s.notes[m].pit-18)
if((y%6)==0){if(s.dot_low)
y-=3
else
y+=3}
y_tb[m]=y}
for(m=0;m<s.nhd;m++){if(y_tb[m+1]>y_tb[m])
continue
m1=m
while(m1>0){if(y_tb[m1]>y_tb[m1-1]+6)
break
m1--}
if(3*(s.notes[m1].pit-18)-y_tb[m1]<y_tb[m+1]-3*(s.notes[m+1].pit-18)){while(m1<=m)
y_tb[m1++]-=6}else{y_tb[m+1]=y_tb[m]+6}}}
function x_head(s,note){return s.x+note.shhd*stv_g.scale}
function y_head(s,note){return staff_tb[s.st].y+3*(note.pit-18)}
function draw_basic_note(x,s,m,y_tb){var i,p,yy,dotx,doty,inv,old_color=false,note=s.notes[m],staffb=staff_tb[s.st].y,y=3*(note.pit-18),shhd=note.shhd*stv_g.scale,x_note=x+shhd,y_note=y+staffb
var elts=identify_note(s,note.dur),head=elts[0],dots=elts[1],nflags=elts[2]
if(y%6==0&&shhd!=(s.stem>0?s.notes[0].shhd:s.notes[s.nhd].shhd)){yy=0
if(y>=30){yy=y
if(yy%6)
yy-=3}else if(y<=-6){yy=y
if(yy%6)
yy+=3}
if(yy)
xygl(x_note,yy+staffb,"hl")}
if(note.invis){}else if(s.grace){p="ghd";x_note-=4.5*stv_g.scale}else if(note.map&&note.map[0]){i=s.head;p=note.map[0][i]
if(!p)
p=note.map[0][note.map[0].length-1]
i=p.indexOf('/')
if(i>=0){if(s.stem>=0)
p=p.slice(0,i)
else
p=p.slice(i+1)}}else if(s.type==C.CUSTOS){p="custos"}else{switch(head){case C.OVAL:p="HD"
break
case C.OVALBARS:if(s.head!=C.SQUARE){p="HDD"
break}
case C.SQUARE:if(nflags>-4){p="breve"}else{p="longa"
inv=s.stem>0}
if(!tsnext&&s.next&&s.next.type==C.BAR&&!s.next.next)
dots=0
break
case C.EMPTY:p="Hd"
break
default:p="hd"
break}}
if(note.color!=undefined)
old_color=set_color(note.color)
else if(note.map&&note.map[2])
old_color=set_color(note.map[2])
if(p){if(inv){g_open(x_note,y_note,0,1,-1);x_note=y_note=0}
if(!self.psxygl(x_note,y_note,p))
xygl(x_note,y_note,p)
if(inv)
g_close()}
if(dots){dotx=x+(7.7+s.xmx)*stv_g.scale
if(y_tb[m]==undefined){y_tb[m]=3*(s.notes[m].pit-18)
if((s.notes[m].pit&1)==0)
y_tb[m]+=3}
doty=y_tb[m]+staffb
i=(note.dur/12)>>((5-nflags)-dots)
while(dots-->0){xygl(dotx,doty,(i&(1<<dots))?"dot":"dot+")
dotx+=3.5}}
if(note.acc){x-=note.shac*stv_g.scale
if(!s.grace){draw_acc(x,y+staffb,note.acc,note.micro_n,note.micro_d)}else{g_open(x,y+staffb,0,.75);draw_acc(0,0,note.acc,note.micro_n,note.micro_d);g_close()}}
if(old_color!=false)
set_color(old_color)}
function draw_note(s,fl){var s2,i,m,y,staffb,slen,c,hltype,nflags,x,y,note,x_hl,y_tb=new Array(s.nhd+1)
if(s.dots)
setdoty(s,y_tb)
note=s.notes[s.stem<0?s.nhd:0];x_hl=x=x_head(s,note);staffb=staff_tb[s.st].y
if(s.grace){hltype="ghl";x_hl+=1.5}else{hltype="hl"
switch(s.head){case C.OVALBARS:case C.OVAL:x_hl-=.3;hltype="hl1"
break
case C.SQUARE:x_hl-=2;hltype="hl1"
break}}
self.draw_hl(x_hl,s,hltype)
y=y_head(s,note)
if(!s.stemless){slen=s.ys-s.y;nflags=s.nflags
if(s.ntrem)
nflags-=s.ntrem
if(!fl||nflags<=0){if(s.nflags>0){if(s.stem>=0)
slen-=1
else
slen+=1}
out_stem(x,y,slen,s.grace)}else{out_stem(x,y,slen,s.grace,nflags,cfmt.straightflags)}}else if(s.xstem){s2=s.ts_prev;slen=(s2.stem>0?s2.y:s2.ys)-s.y;slen+=staff_tb[s2.st].y-staffb;out_stem(x,y,slen)}
if(fl&&s.trem1){var ntrem=s.ntrem||0,x1=x;slen=3*(s.notes[s.stem>0?s.nhd:0].pit-18)
if(s.head==C.FULL||s.head==C.EMPTY){x1+=(s.grace?GSTEM_XOFF:3.5)*s.stem
if(s.stem>0)
slen+=6+5.4*ntrem
else
slen-=6+5.4}else{if(s.stem>0)
slen+=5+5.4*ntrem
else
slen-=5+5.4}
slen/=s.p_v.scale;out_trem(x1,staffb+slen,ntrem)}
x=s.x
for(m=0;m<=s.nhd;m++)
draw_basic_note(x,s,m,y_tb)}
function prev_scut(s){while(s.prev){s=s.prev
if(s.rbstart)
return s}
s=s.p_v.sym
while(s.type!=C.CLEF)
s=s.ts_prev
if(s.next&&s.next.type==C.KEY)
s=s.next
if(s.next&&s.next.type==C.METER)
return s.next
return s}
function slur_direction(k1,k2){var s,some_upstem,low,dir
function slur_multi(s1,s2){if(s1.multi)
return s1.multi
if(s2.multi)
return s2.multi
return 0}
if(k1.grace&&k1.stem>0)
return-1
dir=slur_multi(k1,k2)
if(dir)
return dir
for(s=k1;;s=s.next){if(s.type==C.NOTE){if(!s.stemless){if(s.stem<0)
return 1
some_upstem=true}
if(s.notes[0].pit<22)
low=true}
if(s.time==k2.time)
break}
if(!some_upstem&&!low)
return 1
return-1}
function slur_out(x1,y1,x2,y2,dir,height,dotted){var dx,dy,dz,alfa=.3,beta=.45;dy=y2-y1
if(dy<0)
dy=-dy;dx=x2-x1
if(dx>40.&&dy/dx<.7){alfa=.3+.002*(dx-40.)
if(alfa>.7)
alfa=.7}
var mx=.5*(x1+x2),my=.5*(y1+y2),xx1=mx+alfa*(x1-mx),yy1=my+alfa*(y1-my)+height;xx1=x1+beta*(xx1-x1);yy1=y1+beta*(yy1-y1)
var xx2=mx+alfa*(x2-mx),yy2=my+alfa*(y2-my)+height;xx2=x2+beta*(xx2-x2);yy2=y2+beta*(yy2-y2);dx=.03*(x2-x1);dy=2*dir;dz=.2+.001*(x2-x1)
if(dz>.6)
dz=.6;dz*=dir
var scale_y=1
if(!dotted)
output+='<path d="M'
else
output+='<path class="stroke" stroke-dasharray="5,5" d="M';out_sxsy(x1,' ',y1);output+='c'+
((xx1-x1)/stv_g.scale).toFixed(1)+' '+
((y1-yy1)/scale_y).toFixed(1)+' '+
((xx2-x1)/stv_g.scale).toFixed(1)+' '+
((y1-yy2)/scale_y).toFixed(1)+' '+
((x2-x1)/stv_g.scale).toFixed(1)+' '+
((y1-y2)/scale_y).toFixed(1)
if(!dotted)
output+='\n\tv'+
(-dz).toFixed(1)+'c'+
((xx2-dx-x2)/stv_g.scale).toFixed(1)+' '+
((y2+dz-yy2-dy)/scale_y).toFixed(1)+' '+
((xx1+dx-x2)/stv_g.scale).toFixed(1)+' '+
((y2+dz-yy1-dy)/scale_y).toFixed(1)+' '+
((x1-x2)/stv_g.scale).toFixed(1)+' '+
((y2+dz-y1)/scale_y).toFixed(1);output+='"/>\n'}
function draw_slur(path,not1,sl){var i,k,g,x1,y1,x2,y2,height,addy,a,y,z,h,dx,dy,ty=sl.ty,dir=(ty&0x07)==C.SL_ABOVE?1:-1,n=path.length,i1=0,i2=n-1,k1=path[0],k2=path[i2]
var nn=1,upstaff=k1.st,two_staves=false
set_dscale(k1.st)
for(i=1;i<n;i++){k=path[i]
if(k.type==C.NOTE||k.type==C.REST){nn++
if(k.st!=upstaff){two_staves=true
if(k.st<upstaff)
upstaff=k.st}}}
if(two_staves)error(2,k1,"*** multi-staves slurs not treated yet");x1=k1.x
if(k1.notes&&k1.notes[0].shhd)
x1+=k1.notes[0].shhd;x2=k2.x
if(k2.notes)
x2+=k2.notes[0].shhd
if(not1){y1=3*(not1.pit-18)+2*dir
x1+=3}else{y1=dir>0?k1.ymx+2:k1.ymn-2
if(k1.type==C.NOTE){if(dir>0){if(k1.stem>0){x1+=5
if(k1.beam_end&&k1.nflags>=-1&&!k1.in_tuplet){if(k1.nflags>0){x1+=2;y1=k1.ys-3}else{y1=k1.ys-6}}}}else{if(k1.stem<0){x1-=1
if(k2.grace){y1=k1.y-8}else if(k1.beam_end&&k1.nflags>=-1&&(!k1.in_tuplet||k1.ys<y1+3)){if(k1.nflags>0){x1+=2;y1=k1.ys+3}else{y1=k1.ys+6}}}}}}
if(sl.is_note){y2=3*(sl.note.pit-18)+2*dir
x2-=3}else{y2=dir>0?k2.ymx+2:k2.ymn-2
if(k2.type==C.NOTE){if(dir>0){if(k2.stem>0){x2+=1
if(k2.beam_st&&k2.nflags>=-1&&!k2.in_tuplet)
y2=k2.ys-6}}else{if(k2.stem<0){x2-=5
if(k2.beam_st&&k2.nflags>=-1&&!k2.in_tuplet)
y2=k2.ys+6}}}}
if(k1.type!=C.NOTE){y1=y2+1.2*dir;x1=k1.x+k1.wr*.5
if(x1>x2-12)
x1=x2-12}
if(k2.type!=C.NOTE){if(k1.type==C.NOTE)
y2=y1+1.2*dir
else
y2=y1
if(k1!=k2)
x2=k2.x-k2.wl*.3}
if(nn>=3){k=path[1]
if(k.type!=C.BAR&&k.x<x1+48){if(dir>0){y=k.ymx-2
if(y1<y)
y1=y}else{y=k.ymn+2
if(y1>y)
y1=y}}
k=path[i2-1]
if(k.type!=C.BAR&&k.x>x2-48){if(dir>0){y=k.ymx-2
if(y2<y)
y2=y}else{y=k.ymn+2
if(y2>y)
y2=y}}}
a=(y2-y1)/(x2-x1)
if(a>SLUR_SLOPE||a<-SLUR_SLOPE){a=a>SLUR_SLOPE?SLUR_SLOPE:-SLUR_SLOPE
if(a*dir>0)
y1=y2-a*(x2-x1)
else
y2=y1+a*(x2-x1)}
y=y2-y1
if(y>8)
y=8
else if(y<-8)
y=-8
z=y
if(z<0)
z=-z;dx=.5*z;dy=.3*y
if(y*dir>0){x2-=dx;y2-=dy}else{x1+=dx;y1+=dy}
if(k1.grace)
x1=k1.x-GSTEM_XOFF*.5
if(k2.grace)
x2=k2.x+GSTEM_XOFF*1.5;h=0;a=(y2-y1)/(x2-x1)
if(k1!=k2&&k1.v==k2.v){addy=y1-a*x1
for(i=1;i<i2;i++){k=path[i]
if(k.st!=upstaff)
continue
switch(k.type){case C.NOTE:case C.REST:if(dir>0){y=3*(k.notes[k.nhd].pit-18)+6
if(y<k.ymx)
y=k.ymx;y-=a*k.x+addy
if(y>h)
h=y}else{y=3*(k.notes[0].pit-18)-6
if(y>k.ymn)
y=k.ymn;y-=a*k.x+addy
if(y<h)
h=y}
break
case C.GRACE:for(g=k.extra;g;g=g.next){if(dir>0){y=3*(g.notes[g.nhd].pit-18)+6
if(y<g.ymx)
y=g.ymx;y-=a*g.x+addy
if(y>h)
h=y}else{y=3*(g.notes[0].pit-18)-6
if(y>g.ymn)
y=g.ymn;y-=a*g.x+addy
if(y<h)
h=y}}
break}}
y1+=.45*h;y2+=.45*h;h*=.65}
if(nn>3)
height=(.08*(x2-x1)+12)*dir
else
height=(.03*(x2-x1)+8)*dir
if(dir>0){if(height<3*h)
height=3*h
if(height>40)
height=40}else{if(height>3*h)
height=3*h
if(height<-40)
height=-40}
y=y2-y1
if(y<0)
y=-y
if(dir>0){if(height<.8*y)
height=.8*y}else{if(height>-.8*y)
height=-.8*y}
height*=cfmt.slurheight;slur_out(x1,y1,x2,y2,dir,height,ty&C.SL_DOTTED);dx=x2-x1;a=(y2-y1)/dx;addy=y1-a*x1
if(height>0)
addy+=4*Math.sqrt(height)-2
else
addy-=4*Math.sqrt(-height)-2
for(i=0;i<i2;i++){k=path[i]
if(k.st!=upstaff)
continue
y=a*k.x+addy
if(k.ymx<y)
k.ymx=y
else if(k.ymn>y)
k.ymn=y
if(i==i2-1){dx=x2
if(k2.sl1)
dx-=5;y-=height/3}else{dx=path[i+1].x}
if(i!=0)
x1=k.x
else
y-=height/3
dx-=x1;y_set(upstaff,dir>0,x1,dx,y)}}
function draw_slurs(s,last){var gr1,i,m,note
function draw_sls(s,sl,snote){var k,v,i,dir,path=[],enote=sl.note,s2=enote.s
if(last&&s2.time>last.time)
return
if(tsnext&&s2.time>=tsnext.time){s.p_v.sls.push(sl);s2=s.p_v.s_next.prev
while(s2.next)
s2=s2.next;sl=Object.create(sl);sl.note={s:s2}}
switch(sl.ty&0x07){case C.SL_ABOVE:dir=1;break
case C.SL_BELOW:dir=-1;break
default:if(s.v!=s2.v)
dir=-1
else
dir=slur_direction(s,s2);sl.ty&=~0x07;sl.ty|=dir>0?C.SL_ABOVE:C.SL_BELOW
break}
if(dir*(cur_sy.voices[s.v].range<=cur_sy.voices[s2.v].range?1:-1)>0)
v=s.v
else
v=s2.v
if(gr1&&!(s2.grace&&s.v==s2.v&&s.time==s2.time)){do{path.push(s);s=s.next}while(s);s=gr1.next}else{path.push(s);if(s.grace)
s=s.next
else
s=s.ts_next}
if(!s2.grace){while(1){if(s.v==v)
path.push(s)
if(s==s2)
break
s=s.ts_next}}else if(s.grace){while(1){if(s.v==v)
path.push(s)
if(s==s2)
break
s=s.next}}else{k=s2
while(k.prev)
k=k.prev
while(1){if(s.v==v)
path.push(s)
if(s.extra==k)
break
s=s.ts_next}
s=k
while(1){path.push(s)
if(s==s2)
break
s=s.next}}
for(i=1;i<path.length-1;i++){s=path[i]
if(s.sls||s.sl1)
draw_slurs(s,last)
if(s.tp)
draw_tuplet(s)}
draw_slur(path,snote,sl)
return 1}
while(1){if(!s||s==last){if(!gr1||!(s=gr1.next)||s==last)
break
gr1=null}
if(s.type==C.GRACE){gr1=s;s=s.extra
continue}
if(s.sls){for(i=0;i<s.sls.length;i++){if(draw_sls(s,s.sls[i]))
s.sls.splice(i--,1)}}
if(s.sl1){for(m=0;m<=s.nhd;m++){note=s.notes[m]
if(note.sls){for(i=0;i<note.sls.length;i++){if(draw_sls(s,note.sls[i],note))
note.sls.splice(i--,1)}}}}
s=s.next}}
function draw_tuplet(s1,tp){var s2,s3,g,upstaff,nb_only,some_slur,x1,x2,y1,y2,xm,ym,a,s0,yy,yx,dy,a,b,dir,r,tp=s1.tp.shift()
if(!s1.tp.length)
delete s1.tp
upstaff=s1.st
set_dscale(s1.st)
for(s2=s1;s2;s2=s2.next){if(s2.type!=C.NOTE&&s2.type!=C.REST){if(s2.type==C.GRACE){for(g=s2.extra;g;g=g.next){if(g.sls||g.sl1)
draw_slurs(g)}}
continue}
if(s2.sls||s2.sl1)
draw_slurs(s2)
if(s2.st<upstaff)
upstaff=s2.st
if(s2.tp)
draw_tuplet(s2)
if(s2.tpe)
break}
if(!s2){error(1,s1,"No end of tuplet in this music line")
return}
s2.tpe--
if(tp.f[0]==1)
return
dir=tp.f[3]||(s1.stem>0?C.SL_ABOVE:C.SL_BELOW)
if(s1==s2){nb_only=true}else if(tp.f[1]==1){nb_only=true;draw_slur([s1,s2],null,{ty:dir})}else{if(tp.f[0]==2||s1.type!=C.NOTE||s2.type!=C.NOTE){nb_only=false}else{nb_only=true
for(s3=s1;;s3=s3.next){if(s3.type!=C.NOTE&&s3.type!=C.REST){if(s3.type==C.GRACE||s3.type==C.SPACE)
continue
nb_only=false
break}
if(s3==s2)
break
if(s3.beam_end){nb_only=false
break}}
if(nb_only&&!s1.beam_st&&!s1.beam_br1&&!s1.beam_br2){for(s3=s1.prev;s3;s3=s3.prev){if(s3.type==C.NOTE||s3.type==C.REST){if(s3.nflags>=s1.nflags)
nb_only=false
break}}}
if(nb_only&&!s2.beam_end){for(s3=s2.next;s3;s3=s3.next){if(s3.type==C.NOTE||s3.type==C.REST){if(!s3.beam_br1&&!s3.beam_br2&&s3.nflags>=s2.nflags)
nb_only=false
break}}}}}
if(nb_only){if(tp.f[2]==1)
return
xm=(s2.x+s1.x)/2
if(s1==s2)
a=0
else
a=(s2.ys-s1.ys)/(s2.x-s1.x);b=s1.ys-a*s1.x;yy=a*xm+b
if(dir==C.SL_ABOVE){ym=y_get(upstaff,1,xm-4,8)
if(ym>yy)
b+=ym-yy;b+=2}else{ym=y_get(upstaff,0,xm-4,8)
if(ym<yy)
b+=ym-yy;b-=10}
for(s3=s1;;s3=s3.next){if(s3.x>=xm)
break}
if(s1.stem*s2.stem>0){if(s1.stem>0)
xm+=1.5
else
xm-=1.5}
ym=a*xm+b
if(tp.f[2]==0)
out_bnum(xm,ym,tp.p)
else
out_bnum(xm,ym,tp.p+':'+tp.q)
if(dir==C.SL_ABOVE){ym+=10
if(s3.ymx<ym)
s3.ymx=ym;y_set(upstaff,true,xm-3,6,ym)}else{if(s3.ymn>ym)
s3.ymn=ym;y_set(upstaff,false,xm-3,6,ym)}
return}
if(tp.f[1]!=0)
error(2,s1,"'what' value of %%tuplets not yet coded")
if(dir==C.SL_ABOVE){if(s1.st==s2.st){y1=y2=staff_tb[upstaff].topbar+4}else{y1=s1.ymx;y2=s2.ymx}
x1=s1.x-4;if(s1.st==upstaff){for(s3=s1;!s3.dur;s3=s3.next);ym=y_get(upstaff,1,s3.x-4,8)
if(ym>y1)
y1=ym
if(s1.stem>0)
x1+=3}
if(s2.st==upstaff){for(s3=s2;!s3.dur;s3=s3.prev);ym=y_get(upstaff,1,s3.x-4,8)
if(ym>y2)
y2=ym}
if(s2.dur>s2.prev.dur){if(s2.next)
x2=s2.next.x-s2.next.wl-5
else
x2=realwidth-6}else{x2=s2.x+4;r=s2.stem>=0?0:s2.nhd
if(s2.notes[r].shhd>0)
x2+=s2.notes[r].shhd
if(s2.st==upstaff&&s2.stem>0)
x2+=3.5}
xm=.5*(x1+x2);ym=.5*(y1+y2);a=(y2-y1)/(x2-x1);s0=3*(s2.notes[s2.nhd].pit-s1.notes[s1.nhd].pit)/(x2-x1)
if(s0>0){if(a<0)
a=0
else if(a>s0)
a=s0}else{if(a>0)
a=0
else if(a<s0)
a=s0}
if(a*a<.1*.1)
a=0
dy=0
for(s3=s1;;s3=s3.next){if(!s3.dur||s3.st!=upstaff){if(s3==s2)
break
continue}
yy=ym+(s3.x-xm)*a;yx=y_get(upstaff,1,s3.x-4,8)+2
if(yx-yy>dy)
dy=yx-yy
if(s3==s2)
break}
ym+=dy;y1=ym+a*(x1-xm);y2=ym+a*(x2-xm);ym+=8
for(s3=s1;;s3=s3.next){if(s3.st==upstaff){yy=ym+(s3.x-xm)*a
if(s3.ymx<yy)
s3.ymx=yy
if(s3==s2)
break
y_set(upstaff,true,s3.x,s3.next.x-s3.x,yy)}else if(s3==s2){break}}}else{x1=s1.x-7
if(s2.dur>s2.prev.dur){if(s2.next)
x2=s2.next.x-s2.next.wl-8
else
x2=realwidth-6}else{x2=s2.x+2
if(s2.notes[s2.nhd].shhd>0)
x2+=s2.notes[s2.nhd].shhd}
if(s1.stem>=0){x1+=2;x2+=2}
if(s1.st==upstaff){for(s3=s1;!s3.dur;s3=s3.next);y1=y_get(upstaff,0,s3.x-4,8)}else{y1=0}
if(s2.st==upstaff){for(s3=s2;!s3.dur;s3=s3.prev);y2=y_get(upstaff,0,s3.x-4,8)}else{y2=0}
xm=.5*(x1+x2);ym=.5*(y1+y2);a=(y2-y1)/(x2-x1);s0=3*(s2.notes[0].pit-s1.notes[0].pit)/(x2-x1)
if(s0>0){if(a<0)
a=0
else if(a>s0)
a=s0}else{if(a>0)
a=0
else if(a<s0)
a=s0}
if(a*a<.1*.1)
a=0
dy=0
for(s3=s1;;s3=s3.next){if(!s3.dur||s3.st!=upstaff){if(s3==s2)
break
continue}
yy=ym+(s3.x-xm)*a;yx=y_get(upstaff,0,s3.x-4,8)
if(yx-yy<dy)
dy=yx-yy
if(s3==s2)
break}
ym+=dy-10;y1=ym+a*(x1-xm);y2=ym+a*(x2-xm);ym-=2
for(s3=s1;;s3=s3.next){if(s3.st==upstaff){if(s3==s2)
break
yy=ym+(s3.x-xm)*a
if(s3.ymn>yy)
s3.ymn=yy;y_set(upstaff,false,s3.x,s3.next.x-s3.x,yy)}
if(s3==s2)
break}}
if(tp.f[2]==1){out_tubr(x1,y1+4,x2-x1,y2-y1,dir==C.SL_ABOVE);return}
out_tubrn(x1,y1,x2-x1,y2-y1,dir==C.SL_ABOVE,tp.f[2]==0?tp.p.toString():tp.p+':'+tp.q);yy=.5*(y1+y2)
if(dir==C.SL_ABOVE)
y_set(upstaff,true,xm-3,6,yy+9)
else
y_set(upstaff,false,xm-3,6,yy)}
function draw_note_ties(not1,job){var m,x1,x2,s,y,h,not2=not1.tie_n,p=job==2?not1.pit:not2.pit,dir=(not1.tie_ty&0x07)==C.SL_ABOVE?1:-1,s1=not1.s,st=s1.st,s2=not2.s,x2=s2.x,sh=not1.shhd
for(m=0;m<s1.nhd;m++)
if(s1.notes[m]==not1)
break
if(dir>0){if(m<s1.nhd&&p+1==s1.notes[m+1].pit)
if(s1.notes[m+1].shhd>sh)
sh=s1.notes[m+1].shhd}else{if(m>0&&p==s1.notes[m-1].pit+1)
if(s1.notes[m-1].shhd>sh)
sh=s1.notes[m-1].shhd}
x1=s1.x+sh*.6
if(job!=2){for(m=0;m<s2.nhd;m++)
if(s2.notes[m]==not2)
break
sh=s2.notes[m].shhd
if(dir>0){if(m<s2.nhd&&p+1==s2.notes[m+1].pit)
if(s2.notes[m+1].shhd<sh)
sh=s2.notes[m+1].shhd}else{if(m>0&&p==s2.notes[m-1].pit+1)
if(s2.notes[m-1].shhd<sh)
sh=s2.notes[m-1].shhd}
x2+=sh*.6}
switch(job){case 0:p=(not1.pit&1)?not1.pit:not2.pit
break
case 3:dir=-dir
case 1:x1=s1.x
if(x1>x2-20)
x1=x2-20
p=not2.pit
st=s2.st
break
default:if(s1!=s2){x2-=s2.wl
if(s2.type==C.BAR)
x2+=5}else{time=s1.time+s1.dur
for(s=s1.ts_next;s;s=s.ts_next)
if(s.time>time)
break
x2=s?s.x:realwidth}
if(x2<x1+16)
x2=x1+16
break}
if(x2-x1>20){x1+=3.5
x2-=3.5}else{x1+=1.5
x2-=1.5}
y=staff_tb[st].y+3*(p-18)
h=(.03*(x2-x1)+16)*dir
slur_out(x1,y,x2,y,dir,h,not1.tie_ty&C.SL_DOTTED)}
function draw_ties(k1,k2,job){var k3,i,j,not1,not3,time,pit,pit2,mhead3=[],nh1=k1.nhd
if(job==2){for(i=0;i<=nh1;i++){not1=k1.notes[i]
if(not1.tie_ty){k3=not1.tie_n
not1.tie_n={s:k2||k1}
draw_note_ties(not1,job)
not1.tie_n=k3}}
return}
for(i=0;i<=nh1;i++){not1=k1.notes[i]
if(!not1.tie_ty)
continue
if(!not1.s)
not1.s=k1
if(not1.tie_n)
draw_note_ties(not1,job)
else
mhead3.push(not1)}
if(!mhead3.length)
return
time=k1.time+k1.dur
k3=k1.ts_next
if(job!=1)
job=0
while(k3&&k3.time<time)
k3=k3.ts_next
while(k3&&k3.time==time){if(k3.type!=C.NOTE||k3.st!=k1.st){k3=k3.ts_next
continue}
for(i=mhead3.length;--i>=0;){not1=mhead3[i]
pit=not1.opit||not1.pit
for(j=k3.nhd;j>=0;j--){not3=k3.notes[j]
pit2=not3.opit||not3.pit
if(pit2==pit){not1.tie_n=not3
if(!not3.s)
not3.s=k3
draw_note_ties(not1,job)
mhead3.splice(i,1)
break}}}
if(!mhead3.length)
break
k3=k3.ts_next}
if(mhead3.length)
error(1,k1,"Bad tie")}
function draw_all_ties(p_voice){var s,s1,s2,clef_chg,time,x,dx,s_next,m
function draw_ties_g(s1,s2,job){if(s1.type==C.GRACE){for(var g=s1.extra;g;g=g.next){if(g.tie_s)
draw_ties(g,s2,job)}}else{draw_ties(s1,s2,job)}}
s_next=p_voice.sym
set_color(s_next.color)
while(1){for(s1=s_next;s1;s1=s1.next){if(s1.ti2&&(s1!=s_next||!s_next.prev)){s=s1.ti2
s.x=s1.x
s2=s.next
s.next=s1
s.st=s1.st
s.time=s1.time-s.dur
draw_ties(s,s1,1)
s.next=s2}
if(s1.tie_s)
break}
if(!s1)
break
s2=s1.tie_s
if(s2.v==s1.v){s_next=s2
s=s1
while(1){if(!s.next){s2=s
s=null
break}
s=s.next
if(s==s2)
break}}else{s_next=s1.next
s=s1
while(1){if(!s.ts_next){s=null
break}
s=s.ts_next
if(s==s2)
break}
if(!s){s2=s1
while(s2.next)
s2=s2.next}}
if(!s){draw_ties_g(s1,s2,2);break}
time=s1.time+s.dur
for(s=s1.ts_next;s!=s2;s=s.ts_next){if(s.st!=s1.st)
continue
if(s.time>time)
break
if(s.type==C.CLEF){clef_chg=true
break}}
if(clef_chg||s1.st!=s2.st){clef_chg=false;dx=(s2.x-s1.x)*.4;x=s2.x;s2.x-=dx
if(s2.x>s1.x+32.)
s2.x=s1.x+32.;draw_ties_g(s1,s2,2);s2.x=x;x=s1.x;s1.x+=dx
if(s1.x<s2.x-24.)
s1.x=s2.x-24.;draw_ties(s1,s2,3);s1.x=x
continue}
draw_ties_g(s1,s2,s2.type==C.NOTE?0:2)}}
function draw_sym_near(){var p_voice,p_st,s,v,st,y,g,w,i,st,dx,top,bot,output_sav=output;output=""
for(v=0;v<voice_tb.length;v++){var bm={},first_note=true;p_voice=voice_tb[v]
for(s=p_voice.sym;s;s=s.next){switch(s.type){case C.GRACE:for(g=s.extra;g;g=g.next){if(g.beam_st&&!g.beam_end)
self.calculate_beam(bm,g)}
break
case C.NOTE:if((s.beam_st&&!s.beam_end)||(first_note&&!s.beam_st)){first_note=false;self.calculate_beam(bm,s)}
break}}}
for(st=0;st<=nstaff;st++){p_st=staff_tb[st]
if(!p_st.top){p_st.top=new Float32Array(YSTEP);p_st.bot=new Float32Array(YSTEP)}
for(i=0;i<YSTEP;i++){p_st.top[i]=0;p_st.bot[i]=24}}
set_tie_room();draw_deco_near()
for(s=tsfirst;s;s=s.ts_next){if(s.invis)
continue
switch(s.type){case C.GRACE:for(g=s.extra;g;g=g.next){y_set(s.st,true,g.x-2,4,g.ymx+1);y_set(s.st,false,g.x-2,4,g.ymn-1)}
continue
case C.MREST:y_set(s.st,true,s.x+16,32,s.ymx+2)
continue
default:y_set(s.st,true,s.x-s.wl,s.wl+s.wr,s.ymx+2);y_set(s.st,false,s.x-s.wl,s.wl+s.wr,s.ymn-2)
continue
case C.NOTE:break}
if(s.stem>0){if(s.stemless){dx=-5;w=10}else if(s.beam_st){dx=3;w=s.beam_end?4:10}else{dx=-8;w=s.beam_end?11:16}
y_set(s.st,true,s.x+dx,w,s.ymx);y_set(s.st,false,s.x-s.wl,s.wl+s.wr,s.ymn)}else{y_set(s.st,true,s.x-s.wl,s.wl+s.wr,s.ymx);if(s.stemless){dx=-5;w=10}else if(s.beam_st){dx=-6;w=s.beam_end?4:10}else{dx=-8;w=s.beam_end?5:16}
dx+=s.notes[0].shhd;y_set(s.st,false,s.x+dx,w,s.ymn)}
if(s.notes[s.nhd].acc){y=s.y+8
if(s.ymx<y)
s.ymx=y;y_set(s.st,true,s.x,0,y)}
if(s.notes[0].acc){y=s.y
if(s.notes[0].acc==1||s.notes[0].acc==3)
y-=7
else
y-=5
if(s.ymn>y)
s.ymn=y;y_set(s.st,false,s.x,0,y)}}
for(v=0;v<voice_tb.length;v++){p_voice=voice_tb[v];s=p_voice.sym
if(!s)
continue
set_color(s.color);st=p_voice.st;for(;s;s=s.next){if(s.tp)
draw_tuplet(s)
if(s.sls||s.sl1)
draw_slurs(s)}}
for(st=0;st<=nstaff;st++){p_st=staff_tb[st];top=p_st.topbar+2;bot=p_st.botbar-2
for(i=0;i<YSTEP;i++){if(top>p_st.top[i])
p_st.top[i]=top
if(bot<p_st.bot[i])
p_st.bot[i]=bot}}
set_color();draw_deco_note()
if(cfmt.measurenb>=0)
draw_measnb();draw_deco_staff();set_dscale(-1)
for(v=0;v<voice_tb.length;v++){p_voice=voice_tb[v]
if(p_voice.have_ly){draw_all_lyrics()
break}}
set_dscale(-1);output=output_sav}
function draw_vname(indent){var p_voice,n,st,v,a_p,p,y,name_type,h,h2,staff_d=[]
for(st=cur_sy.nstaff;st>=0;st--){if(cur_sy.st_print[st])
break}
if(st<0)
return
for(v=0;v<voice_tb.length;v++){p_voice=voice_tb[v]
if(!p_voice.sym||!cur_sy.voices[v])
continue
st=cur_sy.voices[v].st
if(!cur_sy.st_print[st])
continue
if(p_voice.new_name){name_type=2
break}
if(p_voice.snm)
name_type=1}
if(!name_type)
return
for(v=0;v<voice_tb.length;v++){p_voice=voice_tb[v]
if(!p_voice.sym||!cur_sy.voices[v])
continue
st=cur_sy.voices[v].st
if(!cur_sy.st_print[st])
continue
if(p_voice.new_name)
delete p_voice.new_name;p=name_type==2?p_voice.nm:p_voice.snm
if(!p)
continue
if(!staff_d[st])
staff_d[st]=p
else
staff_d[st]+="\\n"+p}
if(staff_d.length==0)
return
set_font("voice");h=gene.curfont.size
h2=h/2
indent=-indent*.5
for(st=0;st<staff_d.length;st++){if(!staff_d[st])
continue
a_p=staff_d[st].split('\\n');y=staff_tb[st].y
+staff_tb[st].topbar*.5*staff_tb[st].staffscale
+h2*(a_p.length-2)
if((cur_sy.staves[st].flags&OPEN_BRACE)&&(cur_sy.staves[st+1].flags&CLOSE_BRACE)&&!staff_d[st+1])
y-=(staff_tb[st].y-staff_tb[st+1].y)*.5
for(n=0;n<a_p.length;n++){p=a_p[n];xy_str(indent,y,p,"c");y-=h}}}
function set_staff(){var s,i,st,prev_staff,v,y,staffsep,dy,maxsep,mbot,val,p_voice,p_staff
for(v=0;v<voice_tb.length;v++){p_voice=voice_tb[v]
if(p_voice.scale!=1)
p_voice.scale_str='transform="scale('+p_voice.scale.toFixed(2)+')"'}
for(st=0;st<=nstaff;st++){if(gene.st_print[st])
break}
y=0
if(st>nstaff){st--;p_staff=staff_tb[st]}else{p_staff=staff_tb[st]
for(i=0;i<YSTEP;i++){val=p_staff.top[i]
if(y<val)
y=val}}
y+=draw_partempo(st,y)
if(!gene.st_print[st])
return y;y*=p_staff.staffscale;staffsep=cfmt.staffsep*.5+
p_staff.topbar*p_staff.staffscale
if(y<staffsep)
y=staffsep
if(y<p_staff.ann_top)
y=p_staff.ann_top;p_staff.y=-y;prev_staff=st
var sy_staff_prev=cur_sy.staves[prev_staff]
for(st++;st<=nstaff;st++){p_staff=staff_tb[st]
if(!gene.st_print[st])
continue
staffsep=sy_staff_prev.sep||cfmt.sysstaffsep;maxsep=sy_staff_prev.maxsep||cfmt.maxsysstaffsep;dy=0
if(p_staff.staffscale==staff_tb[prev_staff].staffscale){for(i=0;i<YSTEP;i++){val=p_staff.top[i]-
staff_tb[prev_staff].bot[i]
if(dy<val)
dy=val}
dy*=p_staff.staffscale}else{for(i=0;i<YSTEP;i++){val=p_staff.top[i]*p_staff.staffscale
-staff_tb[prev_staff].bot[i]*staff_tb[prev_staff].staffscale
if(dy<val)
dy=val}}
staffsep+=p_staff.topbar*p_staff.staffscale
if(dy<staffsep)
dy=staffsep;maxsep+=p_staff.topbar*p_staff.staffscale
if(dy>maxsep)
dy=maxsep;y+=dy;p_staff.y=-y;prev_staff=st;sy_staff_prev=cur_sy.staves[prev_staff]}
mbot=0
for(i=0;i<YSTEP;i++){val=staff_tb[prev_staff].bot[i]
if(mbot>val)
mbot=val}
if(mbot>p_staff.ann_bot)
mbot=p_staff.ann_bot;mbot*=staff_tb[prev_staff].staffscale
for(st=0;st<=nstaff;st++){p_staff=staff_tb[st];dy=p_staff.y
if(p_staff.staffscale!=1){p_staff.scale_str='transform="translate(0,'+
(posy-dy).toFixed(1)+') '+'scale('+p_staff.staffscale.toFixed(2)+')"'}}
if(mbot==0){for(st=nstaff;st>=0;st--){if(gene.st_print[st])
break}
if(st<0)
return y}
dy=-mbot;staffsep=cfmt.staffsep*.5
if(dy<staffsep)
dy=staffsep;maxsep=cfmt.maxstaffsep*.5
if(dy>maxsep)
dy=maxsep;return y+dy}
function draw_systems(indent){var s,s2,st,x,x2,res,sy,staves_bar,bar_force,xstaff=[],bar_bot=[],bar_height=[],ba=[],sb=[],thb=[]
function bar_set(){var st,staffscale,top,bot,dy=0
for(st=0;st<=cur_sy.nstaff;st++){if(xstaff[st]<0){bar_bot[st]=bar_height[st]=0
continue}
staffscale=staff_tb[st].staffscale;top=staff_tb[st].topbar*staffscale;bot=staff_tb[st].botbar*staffscale
if(dy==0)
dy=staff_tb[st].y+top;bar_bot[st]=staff_tb[st].y+bot;bar_height[st]=dy-bar_bot[st];dy=(cur_sy.staves[st].flags&STOP_BAR)?0:bar_bot[st]}}
function draw_staff(st,x1,x2){var w,ws,i,dy,ty,y=0,ln="",stafflines=cur_sy.staves[st].stafflines,l=stafflines.length
if(!/[\[|]/.test(stafflines))
return
w=x2-x1;set_sscale(st);ws=w/stv_g.scale
if(cache&&cache.st_l==stafflines&&cache.st_ws==(ws|0)){xygl(x1,staff_tb[st].y,'stdef'+cfmt.fullsvg)
return}
for(i=0;i<l;i++,y-=6){if(stafflines[i]=='.')
continue
dy=0
for(;i<l;i++,y-=6,dy-=6){switch(stafflines[i]){case'.':case'-':continue
case ty:ln+='m-'+ws.toFixed(1)+' '+dy+'h'+ws.toFixed(1);dy=0
continue}
if(ty!=undefined)
ln+='"/>\n';ty=stafflines[i]
ln+='<path class="'+
(ty=='['?'slthW':'slW')+'" d="m0 '+y+'h'+ws.toFixed(1);dy=0}
ln+='"/>'}
y=staff_tb[st].y
if(!cache&&w>get_lwidth()-10){cache={st_l:stafflines,st_ws:ws|0}
i='stdef'+cfmt.fullsvg;if(ln.indexOf('<path',1)<0)
glyphs[i]=ln.replace('path','path id="'+i+'"')
else
glyphs[i]='<g id="'+i+'">\n'+ln+'\n</g>';xygl(x1,y,i)
return}
out_XYAB('<g transform="translate(X, Y)">\n'+ln+'\n</g>\n',x1,y)}
function draw_bar(s,bot,h){var i,s2,yb,w,bar_type=s.bar_type,st=s.st,p_staff=staff_tb[st],x=s.x
if(st!=0&&s.ts_prev&&s.ts_prev.type!=C.BAR)
h=p_staff.topbar*p_staff.staffscale;s.ymx=s.ymn+h;anno_start(s)
if(s.color)
set_color(s.color);yb=p_staff.y+12;if(p_staff.stafflines!='|||||')
yb+=(p_staff.topbar+p_staff.botbar)/2-12
if(s.bar_mrep){set_sscale(st)
if(s.bar_mrep==1){for(s2=s.prev;s2.type!=C.REST;s2=s2.prev);xygl(s2.x,yb,"mrep")}else{xygl(x,yb,"mrep2")
if(s.v==cur_sy.top_voice)
xy_str(x,yb+p_staff.topbar-9,s.bar_mrep.toString(),"c")}}
if(bar_type=='||:')
bar_type='[|:'
for(i=bar_type.length;--i>=0;){switch(bar_type[i]){case"|":if(s.bar_dotted){set_sscale(-1);w=(5*p_staff.staffscale).toFixed(1);out_XYAB('<path class="bW" stroke-dasharray="A,A" d="MX Yv-G"/>\n',x,bot,w,h)}else if(s.color){out_XYAB('<path class="bW" d="MX Yv-F"/>\n',x,bot,h)}else{sb.push(new Float32Array([x,bot,h]))}
break
default:x-=3;if(s.color)
out_XYAB('<path class="bthW" d="MX Yv-F"/>\n',x+1.5,bot,h)
else
thb.push(new Float32Array([x+1.5,bot,h]))
break
case":":x-=2;set_sscale(st);xygl(x+1,yb-12,"rdots")
break}
x-=3}
set_color();anno_stop(s)}
function out_bars(){var i,b,bx,l=ba.length
set_font("annotation");if(gene.curfont.box){gene.curfont.box=false
bx=true}
for(i=0;i<l;i++){b=ba[i];draw_bar(b[0],b[1],b[2])}
if(bx)
gene.curfont.box=true
set_sscale(-1)
l=sb.length
if(l){output+='<path class="bW" d="'
for(i=0;i<l;i++){b=sb[i];out_XYAB('MX Yv-F',b[0],b[1],b[2])}
output+='"/>\n'}
l=thb.length
if(l){output+='<path class="bthW" d="'
for(i=0;i<l;i++){b=thb[i];out_XYAB('MX Yv-F',b[0],b[1],b[2])}
output+='"/>\n'}}
draw_vname(indent)
for(st=0;st<=nstaff;st++)
xstaff[st]=!cur_sy.st_print[st]?-1:0;bar_set();draw_lstaff(0)
for(s=tsfirst;s;s=s.ts_next){if(bar_force&&s.time!=bar_force){bar_force=0
for(st=0;st<=nstaff;st++){if(!cur_sy.st_print[st])
xstaff[st]=-1}
bar_set()}
switch(s.type){case C.STAVES:staves_bar=s.ts_prev.type==C.BAR?s.ts_prev.x:0
if(!staves_bar){for(s2=s.ts_next;s2;s2=s2.ts_next){if(s2.time!=s.time)
break
switch(s2.type){case C.BAR:case C.CLEF:case C.KEY:case C.METER:staves_bar=s2.x
continue}
break}
if(!s2)
staves_bar=realwidth}
sy=s.sy
for(st=0;st<=nstaff;st++){x=xstaff[st]
if(x<0){if(sy.st_print[st])
xstaff[st]=staves_bar?staves_bar:(s.x-s.wl-2)
continue}
if(sy.st_print[st]&&sy.staves[st].stafflines==cur_sy.staves[st].stafflines)
continue
if(staves_bar){x2=staves_bar;bar_force=s.time}else{x2=s.x-s.wl-2;xstaff[st]=-1}
draw_staff(st,x,x2)
if(sy.st_print[st])
xstaff[st]=x2}
cur_sy=sy;bar_set()
continue
case C.BAR:if(s.second||s.invis||!s.bar_type)
break
ba.push([s,bar_bot[s.st],bar_height[s.st]])
break
case C.STBRK:if(cur_sy.voices[s.v]&&cur_sy.voices[s.v].range==0){if(s.xmx>14){var nv=0
for(var i=0;i<voice_tb.length;i++){if(cur_sy.voices[i]&&cur_sy.voices[i].range>0)
nv++}
for(s2=s.ts_next;s2;s2=s2.ts_next){if(s2.type!=C.STBRK)
break
nv--}
if(nv==0)
draw_lstaff(s.x)}}
s2=s.prev
if(!s2)
break
x2=s2.x
if(s2.type!=C.BAR)
x2+=s2.wr;st=s.st;x=xstaff[st]
if(x>=0){if(x>=x2)
continue
draw_staff(st,x,x2)}
xstaff[st]=s.x
break}}
for(st=0;st<=nstaff;st++){if(bar_force&&!cur_sy.st_print[st])
continue
x=xstaff[st]
if(x<0||x>=realwidth)
continue
draw_staff(st,x,realwidth)}
out_bars()}
Abc.prototype.draw_symbols=function(p_voice){var bm={},s,g,x,y,st;for(s=p_voice.sym;s;s=s.next){if(s.invis){switch(s.type){case C.KEY:p_voice.key=s
default:continue
case C.NOTE:break}}
st=s.st
x=s.x;set_color(s.color)
switch(s.type){case C.NOTE:set_scale(s)
if(s.beam_st&&!s.beam_end){if(self.calculate_beam(bm,s))
draw_beams(bm)}
if(!s.invis){anno_start(s);draw_note(s,!bm.s2);anno_stop(s)}
if(s==bm.s2)
bm.s2=null
break
case C.REST:if(s.invis||!staff_tb[st].topbar)
break
draw_rest(s);break
case C.BAR:break
case C.CLEF:if(s.time>=staff_tb[st].clef.time)
staff_tb[st].clef=s
if(s.second||s.invis||!staff_tb[st].topbar)
break
set_color();set_sscale(st);anno_start(s);y=staff_tb[st].y
if(s.clef_name)
xygl(x,y+s.y,s.clef_name)
else if(!s.clef_small)
xygl(x,y+s.y,s.clef_type+"clef")
else
xygl(x,y+s.y,"s"+s.clef_type+"clef")
if(s.clef_octave){if(s.clef_octave>0){y+=s.ymx-10
if(s.clef_small)
y-=1}else{y+=s.ymn+6
if(s.clef_small)
y+=1}
xygl(x-2,y,"oct")}
anno_stop(s)
break
case C.METER:p_voice.meter=s
if(s.second||!staff_tb[s.st].topbar)
break
set_color();set_sscale(s.st);anno_start(s);draw_meter(x,s);anno_stop(s)
break
case C.KEY:p_voice.key=s
if(s.second||s.invis||!staff_tb[s.st].topbar)
break
set_color();set_sscale(s.st);anno_start(s);self.draw_keysig(x,s);anno_stop(s)
break
case C.MREST:set_scale(s);x+=32;anno_start(s);xygl(x,staff_tb[s.st].y+12,"mrest");out_XYAB('<text style="font:bold 15px serif"\n\
 x ="X" y="Y" text-anchor="middle">A</text>\n',x,staff_tb[s.st].y+28,s.nmes);anno_stop(s)
break
case C.GRACE:set_scale(s);draw_gracenotes(s)
break
case C.SPACE:case C.STBRK:break
case C.CUSTOS:set_scale(s);draw_note(s,0)
break
case C.BLOCK:case C.PART:case C.REMARK:case C.STAVES:case C.TEMPO:break
default:error(2,s,"draw_symbols - Cannot draw symbol "+s.type)
break}}
set_scale(p_voice.sym);draw_all_ties(p_voice);set_color()}
function draw_all_sym(){var p_voice,v,n=voice_tb.length
for(v=0;v<n;v++){p_voice=voice_tb[v]
if(p_voice.sym&&p_voice.sym.x!=undefined)
self.draw_symbols(p_voice)}
draw_all_deco();set_sscale(-1)}
function set_tie_dir(s){var i,ntie,dir,sec,pit,ty
for(;s;s=s.next){if(!s.tie_s)
continue
if(s.multi!=0){dir=s.multi>0?C.SL_ABOVE:C.SL_BELOW
for(i=0;i<=s.nhd;i++){ty=s.notes[i].tie_ty
if(!((ty&0x07)==C.SL_AUTO))
continue
s.notes[i].tie_ty=(ty&C.SL_DOTTED)|dir}
continue}
sec=ntie=0;pit=128
for(i=0;i<=s.nhd;i++){if(s.notes[i].tie_ty){ntie++
if(pit<128&&s.notes[i].pit<=pit+1)
sec++;pit=s.notes[i].pit}}
if(ntie<=1){dir=s.stem<0?C.SL_ABOVE:C.SL_BELOW
for(i=0;i<=s.nhd;i++){ty=s.notes[i].tie_ty
if(ty){if((ty&0x07)==C.SL_AUTO)
s.notes[i].tie_ty=(ty&C.SL_DOTTED)|dir
break}}
continue}
if(sec==0){if(ntie&1){ntie=(ntie-1)/2;dir=C.SL_BELOW
for(i=0;i<=s.nhd;i++){ty=s.notes[i].tie_ty
if(!ty)
continue
if(ntie==0){if(s.notes[i].pit>=22)
dir=C.SL_ABOVE}
if((ty&0x07)==C.SL_AUTO)
s.notes[i].tie_ty=(ty&C.SL_DOTTED)|dir
if(ntie--==0)
dir=C.SL_ABOVE}
continue}
ntie/=2;dir=C.SL_BELOW
for(i=0;i<=s.nhd;i++){ty=s.notes[i].tie_ty
if(!ty)
continue
if((ty&0x07)==C.SL_AUTO)
s.notes[i].tie_ty=(ty&C.SL_DOTTED)|dir
if(--ntie==0)
dir=C.SL_ABOVE}
continue}
pit=128
for(i=0;i<=s.nhd;i++){if(s.notes[i].tie_ty){if(pit<128&&s.notes[i].pit<=pit+1){ntie=i
break}
pit=s.notes[i].pit}}
dir=C.SL_BELOW
for(i=0;i<=s.nhd;i++){ty=s.notes[i].tie_ty
if(!ty)
continue
if(ntie==i)
dir=C.SL_ABOVE
if((ty&0x07)==C.SL_AUTO)
s.notes[i].tie_ty=(ty&C.SL_DOTTED)|dir}}}
function set_tie_room(){var p_voice,s,s2,v,dx,y,dy
for(v=0;v<voice_tb.length;v++){p_voice=voice_tb[v];s=p_voice.sym
if(!s)
continue
s=s.next
if(!s)
continue
set_tie_dir(s)
for(;s;s=s.next){if(!s.tie_s)
continue
if(s.notes[0].pit<20&&s.notes[0].tie_ty&&(s.notes[0].tie_ty&0x07)==C.SL_BELOW);else if(s.notes[s.nhd].pit>24&&s.notes[s.nhd].tie_ty&&(s.notes[s.nhd].tie_ty&0x07)==C.SL_ABOVE);else
continue
s2=s.next
while(s2&&s2.type!=C.NOTE)
s2=s2.next
if(s2){if(s2.st!=s.st)
continue
dx=s2.x-s.x-10}else{dx=realwidth-s.x-10}
if(dx<100)
dy=9
else if(dx<300)
dy=12
else
dy=16
if(s.notes[s.nhd].pit>24){y=3*(s.notes[s.nhd].pit-18)+dy
if(s.ymx<y)
s.ymx=y
if(s2&&s2.ymx<y)
s2.ymx=y;y_set(s.st,true,s.x+5,dx,y)}
if(s.notes[0].pit<20){y=3*(s.notes[0].pit-18)-dy
if(s.ymn>y)
s.ymn=y
if(s2&&s2.ymn>y)
s2.ymn=y;y_set(s.st,false,s.x+5,dx,y)}}}}
var musicfont='url("data:application/octet-stream;base64,\
AAEAAAAOAIAAAwBgRkZUTYIq6cIAAFMEAAAAHEdERUYAFQAUAABS6AAAABxPUy8yWLxbCQAAAWgA\
AABWY21hcM7xzSEAAAPMAAADKmN2dCAAIgKIAAAG+AAAAARnYXNw//8AAwAAUuAAAAAIZ2x5ZvUw\
oLYAAAgEAABCqGhlYWQNXJHdAAAA7AAAADZoaGVhCWn/CwAAASQAAAAkaG10eM2n+wQAAAHAAAAC\
CmxvY2HVL+UYAAAG/AAAAQhtYXhwAMoBPQAAAUgAAAAgbmFtZWQ9AacAAEqsAAADEnBvc3TQFqwa\
AABNwAAABR8AAQAAAAEAADE4fZ1fDzz1AAsEAAAAAADRlyIXAAAAANgjLVL/OPzvBUsEiAAAAAgA\
AgAAAAAAAAABAAAEiPzvAFwEJf84/XQFSwABAAAAAAAAAAAAAAAAAAAAggABAAAAgwEMAAUAAAAA\
AAIAAAABAAEAAABAAC4AAAAAAAEBlwGQAAUACAKZAswAAACPApkCzAAAAesAMwEJAAACAAUDAAAA\
AAAAAAAAARAAAAAAAAAAAAAAAFBmRWQAQAAA6qQDM/8zAFwEiAMRAAAAAQAAAAAAAAF2ACIAAAAA\
AVUAAAGQAAACWAAAAFcAAAFK/7ACE/+wANL/sAAjAAAAIwAAACMAAABkAAAEIwAABCUAAAHg/9wD\
XgB6AwsAAALSAAACv/+6AdYAAAMLAAADDgAAAyf/yADIAAABrgAAASIAAAGQAAABfAAAAZAAAAGQ\
AAABgQAAAZAAAAGQAAABgQAAAZkACQGYAAkB9AAAAQQAFAEEAAoCawAkAhIAAAHCAAABSQAAAUAA\
AAFK//4BLAAAAjAAAAFKAAABSgAAAGQAAAE7AAABOwAAATsAAAE7AAABOwAAATsAAAE7AAABOwAA\
ATsAAAE7AAABDQAAAMgAAAD/AAABCwAUAW4AAAENADIBbv/1AKkAAAE6AAABQP/9AFAAAAFAAAAB\
QAAAARgAAAJYAAAAtgAAAIIAAACCAAABLAAAASwAAADuAAAA/wAAAUkAAAGPAAAB2AAAAdgAAANT\
AAACM//wAyD/4QIz/7QBuP/bAV//fgIzAAACM//kAr//tAIz/7QCv/+0Ayv/2wFf/9sCaf9+AV//\
fgJp/34BXwAAAf0ABQG1AAABtQAAAkQADQJEAA0BGAAAATYAAAEs//8BLAAAAPoAAADIAAABGP84\
APoAAADIAAAEDQAAAhwADAH0AAAB9AAAAfQAAAH0AAAB9AAAAfQAAAB4AAAALQAAAhwAAAD6AAD/\
6gAAAAAAAwAAAAMAAAAcAAEAAAAAAiQAAwABAAAAHAAEAggAAAB+AEAABQA+AAAAIOAA4CTgMOA5\
4EPgSOBQ4FzgYuBp4H3gjOCV4KTgqeCz4QHhueG74efiSeJk4oPkoOSi5KTkqOSs5MDkzuTq5O7l\
AeUi5SXlLeUx5TnlZ+Vp5W3lguXQ5eLmEOYS5hTmGOYk5jDmUOZV6RLpFekY6SDpJeld6gLqpP//\
AAAAAAAg4ADgIuAw4DjgQ+BF4FDgXOBi4GngeuCA4JTgoOCp4LPhAeG54bvh5+JA4mDigOSg5KLk\
pOSo5KzkwOTO5OHk7uUA5SDlJOUp5S/lOeVm5WnlbOWC5dDl4uYQ5hLmFOYY5iTmMOZQ5lXpEOkU\
6RjpIOkl6V3qAuqk//8AA//kIAUf5B/ZH9IfyR/IH8Efth+xH6sfmx+ZH5IfiB+EH3sfLh53HnYe\
Sx3zHd0dwhumG6UbpBuhG54bixt+G2wbaRtYGzobORs2GzUbLhsCGwEa/xrrGp4ajRpgGl8aXhpb\
GlAaRRomGiIXaBdnF2UXXhdaFyMWfxXeAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEGAAADAAAAAAAAAAECAAAA\
AgAAAAAAAAAAAAAAAAAAAAEAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\
AAAAAAAAAAAAAAAAAAAAAAAAIgKIAAAAKgAqACoANgA+AG4AfACKAJgApACwAL4A3AFQAawCHAJe\
AvADggPkA/gElAUmBX4FvAXeBfIGRAaUBrQG+gc6B3QHwAgACEYIoAi0CNoJAAkyCU4JcAmcCbIJ\
zAoCChAKHAooCjoKVApuCqIK1gsqC3QL1AwyDKgNHA1CDVwNjA22Dg4ONA6ODq4O7A8UDygPNA9C\
D1IPeg+gD6wPuA/ED9AP8hAYEE4QnBD8EXARhhGsEdoSPhK2ExQTXBO4FRIWHhbYF5gYaBkEGeIa\
/hwAHEIchhzQHOodDh0iHTYdZh12HYgdpB26Hd4eDh7wH6wf1B/yICQgYiCUINYg6CD2IRIhLCFU\
AAIAIgAAATICqgADAAcALrEBAC88sgcEAO0ysQYF3DyyAwIA7TIAsQMALzyyBQQA7TKyBwYB/Dyy\
AQIA7TIzESERJzMRIyIBEO7MzAKq/VYiAmYAAAEAAAAAAZEBkAADAAAxESERAZEBkP5wAAEAAAAA\
AAAAAAAAAAAxAAABAAAAAABXBAMAIAAAETU2NTQnJjU0NwYVFBcWFRQHFhUUBwYVFBcmNTQ3NjU0\
NSMSVz8VJU1NJRU/VxIjAgMCGEM2YDk0ZjoySyI5YU1hGBhmTGA5JUoyOmY0OWA2SAAB/7D/7AGa\
ABQAAwAAJyEVIVAB6v4WFCgAAAAAAf+w/+wCYgAUAAMAACchFSFQArL9ThQoAAAAAAH/sP/sASIA\
FAADAAAnIRUhUAFy/o4UKAAAAAABAAAAAAAjA+gAAwAAETMRIyMjA+j8GAABAAAB9AAjA+gAAwAA\
ETMRIyMjA+j+DAABAAAC+AAjBFYAAwAAETcRIyMjBEwK/qIAAAAAAgAAAUAAZAKeAAcADwAAEiIm\
NDYyFhQCIiY0NjIWFEcqHR0qHR0qHR0qHQI6HSodHSr+6R0qHR0qAAAABQAAAAAEJAGuAC8ANwA/\
AEcAUwAAITUzHgEzMjY1NCcuBDU0NjMyFhc3MxcjLgEjIgYVFB4DFx4BFRQGIyInByAiJjQ2MhYU\
BCImNDYyFhQBETMyNjQmIwM1MxEjNTMyFhUUIwJOHhVPMik7lBkaKhYRWT0kJxkeHgceD0owHzkQ\
IhkyCE5NW09FLiMBmyodHSod/eoqHR0qHf6JKDxGRjzcRkbccYn6oDxLICEtKAcIFBQjFUNNCw4Z\
mzpIKBsPFw8JCwIVNzM6TiAgHSodHSodHSodHSoBaf6YYaZh/noeAWgeZ2vSAAUAAAAABCQBrgAa\
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\
NTQ2MzIWFRQGIyIuATU0NyYjIgYVFB4CFx4BFRRQHjISDA4XDAYYFiEJCxgGPDctIjYWEAgQCwUQ\
Dg8ZERIeBRsXKxsQFg0LGAwSFhILDwcNBCYqIy0kGBAYCQ8KCAgUEQ0JEwwRAxIfFVoAAAH/5P//\
AOcBEAA/AAAnBi4BPwEuASMqASMiDgEHBicmNz4BNxYzMj4BMzIXFhQPAQ4BFRQeARcWNicuATU0\
NjMyFRQHBgciJiMuASMiCgYLAQWwCBcRBQwHBREUBQ8EAwgMCwEwIhkgEQcFCAsHngEBECwXCAwD\
AyQUDCYkERIDBQIXNAkSAwQIDQbBBAMbIQQNCwkSHjACAwMEAQERB6cDAwIFAQkLBA8JCAgUCxM3\
KhUJAQEDDQAF/7T/iAVLARgAGwA1ANkA8AELAAAlFjMyPgE3PgY1NCYnJiMiBgcOAhUUBRYzMjY3\
PgU1NCYnJiMiBgcGFRQeARciJwczMhQrASI0OwETPgI1NC4CIyIOAwcGJjc2NzYzMhYXPgEzMhc+\
ATMyFhc+ATMyFz4BMzIWFz4BMzIXPgEzMhYXPgEzMhYVFAYjIicHMzIUKwEiNDsBEz4CNTQmIyIG\
BxUUBiMiJwczMhQrASI0OwETPgI1NCYjIgYHFRQGIyInBzMyFCsBIjQ7ARM0PgM0NTQmIyIGBxUU\
BiUWMzI2Nz4ENTQmJyYjIgYHBhUUBRYzMjY3PgY1NCYnJiMiDgEHBhUUFgIKAwQMHx4JAgMCAgIB\
AQcIAwMTNAsFBwP+ywMEEjIOAgMDAwEBBwgDAxM0Cw8EBwgWGS00CwvhCwtLaAEDAgECBQMIDA8L\
GQoFGwUxDxgkIyQHHSYjLxMSIhsjJAcdJiMvExIiGyMkBx0mIy8TEiIbIyQHHSYjHi1rSRYZLTQL\
C+ELC0toAQMCBQYOFBRrSRYZLTQLC+ELC0toAQMCBQYOFBRrSRYZLTQLC+ELC0toAQIBAgUGDhQU\
awODAwQSMg4CBAMDAQcIAwMTNAsP/ssDBBIyDgIDAgICAQEHCAMDDCEeBw8JKAEYKhcECgkLCgoL\
BRAXAwEzHA0bGAsoBwE1JAULDAwMDAYQFwMBMxwmJQwUDSogeh4eAR0CCA4GAwUFAgcUEiwQCA8J\
WBAZExoeDzIcFhMaHg8yHBYTGh4PMhwWExoeDzQwR20geh4eAR0CCA4GBwgYIwFHbSB6Hh4BHQII\
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\
AzsBPgEzMhYVFAYjIiY1NDc2NCMiBwYHFz4BMzIWFRQGIyImNTQ3NjQjIg4HBzMyFhQGKwEOASMi\
JjU0NjMyFhUUBwYVFDMyPgcBX5shdl8gMBcTEhcSChkLEA8LDQoODRQKNQkKAQMEBgNBFGk0IDAX\
ExIXEgoZJhcDAZsUaTQgMBcTEhcSChkHDAoHCAUGAwYBNgkLCwk/IXZfIDAXExIXEgoZCxAPCw0K\
Dw0U5sXBJiAaIhQPDgsHDQ4GERMlJDw3VScMCQMFBQQCS18mIBoiFA8OCwYccwwGAUtfJiAaIhQP\
DgsGHAULChQNGg0eBgwQDMXBJiAaIhQPDgsHDQ4GERMlJDw3VQAAAAAB/37/YAN0AbgAswAAEzM+\
ATMyFhUUBiMiJjU0NzY0IyIHBgcXPgEzMhYVFAYjIiY1NDc2NCMiDgcHMzIWFRQOASsBDgEjIiY1\
NDYzMhYVFAcGFRQzMj4HNyMOASMiJjU0NjMyFhUUBwYVFDMyPgc3Iw4BIyImNTQ2MzIWFRQHBhUU\
MzI+BzcjIiY1ND4DOwE+ATMyFhUUBiMiJjU0NzY0IyIOAgcGzJwUaTQgMBcTEhcSChkmFwMBmxRp\
NCAwFxMSFxIKGQcMCgcIBQYDBgE2CQoECQY/IXZfIDAXExIXEgoZCxAPCw0KDw0UCpshdl8gMBcT\
EhcSChkLEA8LDQoODRUKmyF2XyAwFxMSFxIKGQsQDwsNCg4NFAo1CQoBAwQGA0EUaTQgMBcTEhcS\
ChkOFQ4IBgIBDktfJiAaIhQPDgsGHHMMBgFLXyYgGiIUDw4LBhwFCwoUDRoNHgYMCAUJBsXBJiAa\
IhQPDgsHDQ4GERMlJDw3VSfFwSYgGiIUDw4LBw0OBhETJSQ7OFUnxcEmIBoiFA8OCwcNDgYREyUk\
PDdVJwwJAwUFBAJLXyYgGiIUDw4LBhwTJyIbCgAB/37/YASAAbgA5wAAARc+ATMyFhUUBiMiJjU0\
NzY0IyIHBgcXPgEzMhYVFAYjIiY1NDc2NCMiDgcHMzIWFAYrAQ4BIyImNTQ2MzIWFRQHBhUUMzI+\
BzcjDgEjIiY1NDYzMhYVFAcGFRQzMj4HNyMOASMiJjU0NjMyFhUUBwYVFDMyPgc3Iw4BIyImNTQ2\
MzIWFRQHBhUUMzI+BzcjIiY1ND4DOwE+ATMyFhUUBiMiJjU0NzY0IyIHBgcXPgEzMhYVFAYjIiY1\
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\
AAIABwGlAAEAAAAAAAMAIgHzAAEAAAAAAAQABwImAAEAAAAAAAUACQJCAAEAAAAAAAYABwJcAAMA\
AQQJAAAA/AAAAAMAAQQJAAEADgF9AAMAAQQJAAIADgGVAAMAAQQJAAMARAGtAAMAAQQJAAQADgIW\
AAMAAQQJAAUAEgIuAAMAAQQJAAYADgJMAEMAbwBwAHkAcgBpAGcAaAB0ACAAXAAyADUAMQAgADIA\
MAAxADgAIABKAGUAYQBuAC0ARgByAGEAbgBjAG8AaQBzACAATQBvAGkAbgBlAC4AIABUAGgAaQBz\
ACAAZgBvAG4AdAAgAGkAcwAgAGwAaQBjAGUAbgBzAGUAZAAgAHUAbgBkAGUAcgAgAHQAaABlACAA\
UwBJAEwAIABPAHAAZQBuACAARgBvAG4AdAAgAEwAaQBjAGUAbgBzAGUAIABcACgAaAB0AHQAcAA6\
AC8ALwBzAGMAcgBpAHAAdABzAC4AcwBpAGwALgBvAHIAZwAvAE8ARgBMAFwAKQAuAABDb3B5cmln\
aHQgXDI1MSAyMDE4IEplYW4tRnJhbmNvaXMgTW9pbmUuIFRoaXMgZm9udCBpcyBsaWNlbnNlZCB1\
bmRlciB0aGUgU0lMIE9wZW4gRm9udCBMaWNlbnNlIFwoaHR0cDovL3NjcmlwdHMuc2lsLm9yZy9P\
RkxcKS4AAGEAYgBjADIAcwB2AGcAAGFiYzJzdmcAAFIAZQBnAHUAbABhAHIAAFJlZ3VsYXIAAEYA\
bwBuAHQARgBvAHIAZwBlACAAMgAuADAAIAA6ACAAYQBiAGMAMgBzAHYAZwAgADoAIAA4AC0AMwAt\
ADIAMAAxADkAAEZvbnRGb3JnZSAyLjAgOiBhYmMyc3ZnIDogOC0zLTIwMTkAAGEAYgBjADIAcwB2\
AGcAAGFiYzJzdmcAAFYAZQByAHMAaQBvAG4AIAAgAABWZXJzaW9uICAAAGEAYgBjADIAcwB2AGcA\
AGFiYzJzdmcAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACDAAAAAQACAQIAAwED\
AQQBBQEGAQcBCAEJAQoBCwEMAQ0BDgEPARABEQESARMBFAEVARYBFwEYARkBGgEbARwBHQEeAR8B\
IAEhASIBIwEkASUBJgEnASgBKQEqASsBLAEtAS4BLwEwATEBMgEzATQBNQE2ATcBOAE5AToBOwE8\
AT0BPgE/AUABQQFCAUMBRAFFAUYBRwFIAUkBSgFLAUwBTQFOAU8BUAFRAVIBUwFUAVUBVgFXAVgB\
WQFaAVsBXAFdAV4BXwFgAWEBYgFjAWQBZQFmAWcBaAFpAWoBawFsAW0BbgFvAXABcQFyAXMBdAF1\
AXYBdwF4AXkBegF7AXwBfQF+AX8BgAYubm9kZWYHdW5pRTAwMAd1bmlFMDIyB3VuaUUwMjMHdW5p\
RTAyNAd1bmlFMDMwB3VuaUUwMzgHdW5pRTAzOQd1bmlFMDQzB3VuaUUwNDUHdW5pRTA0Ngd1bmlF\
MDQ3B3VuaUUwNDgHdW5pRTA1MAd1bmlFMDVDB3VuaUUwNjIHdW5pRTA2OQd1bmlFMDdBB3VuaUUw\
N0IHdW5pRTA3Qwd1bmlFMDdEB3VuaUUwODAHdW5pRTA4MQd1bmlFMDgyB3VuaUUwODMHdW5pRTA4\
NAd1bmlFMDg1B3VuaUUwODYHdW5pRTA4Nwd1bmlFMDg4B3VuaUUwODkHdW5pRTA4QQd1bmlFMDhC\
B3VuaUUwOEMHdW5pRTA5NAd1bmlFMDk1B3VuaUUwQTAHdW5pRTBBMQd1bmlFMEEyB3VuaUUwQTMH\
dW5pRTBBNAd1bmlFMEE5B3VuaUUwQjMHdW5pRTEwMQd1bmlFMUI5B3VuaUUxQkIHdW5pRTFFNwd1\
bmlFMjQwB3VuaUUyNDEHdW5pRTI0Mgd1bmlFMjQzB3VuaUUyNDQHdW5pRTI0NQd1bmlFMjQ2B3Vu\
aUUyNDcHdW5pRTI0OAd1bmlFMjQ5B3VuaUUyNjAHdW5pRTI2MQd1bmlFMjYyB3VuaUUyNjMHdW5p\
RTI2NAd1bmlFMjgwB3VuaUUyODEHdW5pRTI4Mgd1bmlFMjgzB3VuaUU0QTAHdW5pRTRBMgd1bmlF\
NEE0B3VuaUU0QTgHdW5pRTRBQwd1bmlFNEMwB3VuaUU0Q0UHdW5pRTRFMQd1bmlFNEUyB3VuaUU0\
RTMHdW5pRTRFNAd1bmlFNEU1B3VuaUU0RTYHdW5pRTRFNwd1bmlFNEU4B3VuaUU0RTkHdW5pRTRF\
QQd1bmlFNEVFB3VuaUU1MDAHdW5pRTUwMQd1bmlFNTIwB3VuaUU1MjEHdW5pRTUyMgd1bmlFNTI0\
B3VuaUU1MjUHdW5pRTUyOQd1bmlFNTJBB3VuaUU1MkIHdW5pRTUyQwd1bmlFNTJEB3VuaUU1MkYH\
dW5pRTUzMAd1bmlFNTMxB3VuaUU1MzkHdW5pRTU2Ngd1bmlFNTY3B3VuaUU1NjkHdW5pRTU2Qwd1\
bmlFNTZEB3VuaUU1ODIHdW5pRTVEMAd1bmlFNUUyB3VuaUU2MTAHdW5pRTYxMgd1bmlFNjE0B3Vu\
aUU2MTgHdW5pRTYyNAd1bmlFNjMwB3VuaUU2NTAHdW5pRTY1NQd1bmlFOTEwB3VuaUU5MTEHdW5p\
RTkxMgd1bmlFOTE0B3VuaUU5MTUHdW5pRTkxOAd1bmlFOTIwB3VuaUU5MjUHdW5pRTk1RAd1bmlF\
QTAyB3VuaUVBQTQAAAAAAf//AAIAAQAAAAAAAAAMABQABAAAAAIAAAABAAAAAQAAAAAAAQAAAADY\
cJpYAAAAANGXIhcAAAAA2CMtUg==\
") format("truetype")'
var font_tb=[],font_st={},font_scale_tb={serif:1,serifBold:1,'sans-serif':1,'sans-serifBold':1,Palatino:1.1,monospace:1.35},fmt_lock={}
var cfmt={annotationfont:{name:"sans-serif",size:12},aligncomposer:1,breaklimit:.7,breakoneoln:true,cancelkey:true,composerfont:{name:"serif",style:"italic",size:14},composerspace:6,dblrepbar:':][:',decoerr:true,dynalign:true,footerfont:{name:"serif",size:16},fullsvg:'',gchordfont:{name:"sans-serif",size:12},gracespace:new Float32Array([4,8,11]),graceslurs:true,headerfont:{name:"serif",size:16},historyfont:{name:"serif",size:16},hyphencont:true,indent:0,infofont:{name:"serif",style:"italic",size:14},infoname:'R "Rhythm: "\n\
B "Book: "\n\
S "Source: "\n\
D "Discography: "\n\
N "Notes: "\n\
Z "Transcription: "\n\
H "History: "',infospace:0,keywarn:true,leftmargin:1.4*CM,lineskipfac:1.1,linewarn:true,maxshrink:.65,maxstaffsep:2000,maxsysstaffsep:2000,measurefont:{name:"serif",style:"italic",size:10},measurenb:-1,musicspace:6,partsfont:{name:"serif",size:15},parskipfac:.4,partsspace:8,pagewidth:21*CM,printmargin:0,rightmargin:1.4*CM,rbdbstop:true,rbmax:4,rbmin:2,repeatfont:{name:"serif",size:13},scale:1,slurheight:1.0,staffsep:46,stemheight:21,stretchlast:.25,stretchstaff:true,subtitlefont:{name:"serif",size:16},subtitlespace:3,sysstaffsep:34,tempofont:{name:"serif",weight:"bold",size:12},textfont:{name:"serif",size:16},textspace:14,titlefont:{name:"serif",size:20},titlespace:6,titletrim:true,topspace:22,tuplets:[0,0,0,0],vocalfont:{name:"serif",weight:"bold",size:13},vocalspace:10,voicefont:{name:"serif",weight:"bold",size:13},writefields:"CMOPQsTWw",wordsfont:{name:"serif",size:16},wordsspace:5}
function get_bool(param){return!param||!/^(0|n|f)/i.test(param)}
function get_font_scale(param){var i,font,a=info_split(param)
if(a.length<=1)
return
var scale=parseFloat(a[a.length-1])
if(isNaN(scale)||scale<=0.5){syntax(1,"Bad scale value in %%font")
return}
font_scale_tb[a[0]]=scale}
function set_font_fac(font){var scale=font_scale_tb[font.name]
if(!scale)
scale=1.1;font.swfac=font.size*scale}
function param_set_font(xxxfont,p){var font,n,a
if(xxxfont[xxxfont.length-2]=='-'){n=xxxfont[xxxfont.length-1]
if(n<'1'||n>'9')
return
xxxfont="u"+n+"font"}
font=cfmt[xxxfont];if(!font){font={}}else{font={name:font.name,size:font.size,box:font.box}}
cfmt[xxxfont]=font;a=p.match(/\s+(no)?box(\s|$)/)
if(a){if(a[1])
font.box=false
else
font.box=true;p=p.replace(a[0],a[2])}
a=p.match(/\s+class=(.*?)(\s|$)/)
if(a){font.class=a[1];p=p.replace(a[0],a[2])}
a=p.match(/\s+wadj=(.*?)(\s|$)/)
if(a){if(typeof document=="undefined")
switch(a[1]){case'none':font.wadj=''
break
case'space':font.wadj='spacing'
break
case'glyph':font.wadj='spacingAndGlyphs'
break
default:syntax(1,errs.bad_val,"%%"+xxxfont)
break}
p=p.replace(a[0],a[2])}
a=p.match(/\s+([0-9.]+|\*)$/)
if(a){if(a[1]!="*"){font.size=Number(a[1])
font.swfac=0}
p=p.replace(a[0],"")}
a=p.match(/[- ]?[nN]ormal/)
if(a){font.normal=true
p=p.replace(a[0],'')}
a=p.match(/[- ]?[bB]old/)
if(a){font.weight="bold"
p=p.replace(a[0],'')}
a=p.match(/[- ]?[iI]talic/)
if(a){font.style="italic"
p=p.replace(a[0],'')}
a=p.match(/[- ]?[oO]blique/)
if(a){font.style="oblique"
p=p.replace(a[0],'')}
switch(p){case"":case"*":return
case"Times-Roman":case"Times":p="serif";break
case"Helvetica":p="sans-serif";break
case"Courier":p="monospace";break}
font.swfac=0
font.name=p}
function get_unit(param){var v=parseFloat(param)
switch(param.slice(-2)){case"CM":case"cm":v*=CM
break
case"IN":case"in":v*=IN
break
case"PT":case"pt":v*=.75
break}
return v}
function set_infoname(param){var tmp=cfmt.infoname.split("\n"),letter=param[0]
for(var i=0;i<tmp.length;i++){var infoname=tmp[i]
if(infoname[0]!=letter)
continue
if(param.length==1)
tmp.splice(i,1)
else
tmp[i]=param
cfmt.infoname=tmp.join('\n')
return}
cfmt.infoname+="\n"+param}
var textopt={align:'j',center:'c',fill:'f',justify:'j',ragged:'f',right:'r',skip:'s'}
function get_textopt(param){return textopt[param]}
var posval={above:C.SL_ABOVE,auto:0,below:C.SL_BELOW,down:C.SL_BELOW,hidden:C.SL_HIDDEN,opposite:C.SL_HIDDEN,under:C.SL_BELOW,up:C.SL_ABOVE}
function set_pos(k,v){k=k.slice(0,3)
if(k=="ste")
k="stm"
set_v_param("pos",k+' '+v)}
function set_writefields(parm){var c,i,a=parm.split(/\s+/)
if(get_bool(a[1])){for(i=0;i<a[0].length;i++){c=a[0][i]
if(cfmt.writefields.indexOf(c)<0)
cfmt.writefields+=c}}else{for(i=0;i<a[0].length;i++){c=a[0][i]
if(cfmt.writefields.indexOf(c)>=0)
cfmt.writefields=cfmt.writefields.replace(c,'')}}}
function set_v_param(k,v){if(curvoice){self.set_vp([k+'=',v])
return}
k=[k+'=',v];var vid='*'
if(!info.V)
info.V={}
if(info.V[vid])
Array.prototype.push.apply(info.V[vid],k)
else
info.V[vid]=k}
function set_page(){if(!img.chg)
return
img.chg=false;img.lm=cfmt.leftmargin-cfmt.printmargin
if(img.lm<0)
img.lm=0;img.rm=cfmt.rightmargin-cfmt.printmargin
if(img.rm<0)
img.rm=0;img.width=cfmt.pagewidth-2*cfmt.printmargin
if(img.width-img.lm-img.rm<100){error(0,undefined,"Bad staff width");img.width=img.lm+img.rm+150}
set_posx()}
Abc.prototype.set_format=function(cmd,param){var f,f2,v,i
if(/.+font(-[\d])?$/.test(cmd)){param_set_font(cmd,param)
return}
switch(cmd){case"aligncomposer":case"barsperstaff":case"infoline":case"measurenb":case"rbmax":case"rbmin":case"shiftunison":v=parseInt(param)
if(isNaN(v)){syntax(1,"Bad integer value");break}
cfmt[cmd]=v
break
case"microscale":f=parseInt(param)
if(isNaN(f)||f<4||f>256||f%1){syntax(1,errs.bad_val,"%%"+cmd)
break}
set_v_param("uscale",f)
break
case"bgcolor":case"fgcolor":case"dblrepbar":case"titleformat":cfmt[cmd]=param
break
case"breaklimit":case"lineskipfac":case"maxshrink":case"pagescale":case"parskipfac":case"scale":case"slurheight":case"stemheight":case"stretchlast":f=parseFloat(param)
if(isNaN(f)){syntax(1,errs.bad_val,'%%'+cmd)
break}
switch(cmd){case"scale":f/=.75
case"pagescale":cmd="scale";img.chg=true
break}
cfmt[cmd]=f
break
case"annotationbox":case"gchordbox":case"measurebox":case"partsbox":cfmt[cmd.replace("box","font")].box=get_bool(param)
break
case"bstemdown":case"breakoneoln":case"cancelkey":case"contbarnb":case"custos":case"decoerr":case"dynalign":case"flatbeams":case"graceslurs":case"graceword":case"hyphencont":case"keywarn":case"linewarn":case"quiet":case"rbdbstop":case"singleline":case"squarebreve":case"splittune":case"straightflags":case"stretchstaff":case"timewarn":case"titlecaps":case"titleleft":cfmt[cmd]=get_bool(param)
break
case"chordnames":v=param.split(',')
cfmt.chordnames={}
for(i=0;i<v.length;i++)
cfmt.chordnames['CDEFGAB'[i]]=v[i]
break
case"composerspace":case"indent":case"infospace":case"maxstaffsep":case"maxsysstaffsep":case"musicspace":case"partsspace":case"staffsep":case"subtitlespace":case"sysstaffsep":case"textspace":case"titlespace":case"topspace":case"vocalspace":case"wordsspace":f=get_unit(param)
if(isNaN(f))
syntax(1,errs.bad_val,'%%'+cmd)
else
cfmt[cmd]=f
break
case"print-leftmargin":syntax(0,"$1 is deprecated - use %%printmargin instead",'%%'+cmd)
cmd="printmargin"
case"printmargin":case"leftmargin":case"pagewidth":case"rightmargin":f=get_unit(param)
if(isNaN(f)){syntax(1,errs.bad_val,'%%'+cmd)
break}
cfmt[cmd]=f;img.chg=true
break
case"concert-score":if(cfmt.sound!="play")
cfmt.sound="concert"
break
case"writefields":set_writefields(param)
break
case"dynamic":case"gchord":case"gstemdir":case"ornament":case"stemdir":case"vocal":case"volume":set_pos(cmd,param)
break
case"font":get_font_scale(param)
break
case"fullsvg":if(parse.state!=0){syntax(1,errs.not_in_tune,"%%fullsvg")
break}
cfmt[cmd]=param
break
case"gracespace":v=param.split(/\s+/)
for(i=0;i<3;i++)
if(isNaN(Number(v[i]))){syntax(1,errs.bad_val,"%%gracespace")
break}
for(i=0;i<3;i++)
cfmt[cmd][i]=Number(v[i])
break
case"tuplets":cfmt[cmd]=param.split(/\s+/);v=cfmt[cmd][3]
if(v&&(posval[v]))
cfmt[cmd][3]=posval[v]
break
case"infoname":set_infoname(param)
break
case"notespacingfactor":f=parseFloat(param)
if(isNaN(f)||f<1||f>2){syntax(1,errs.bad_val,"%%"+cmd)
break}
i=5;f2=space_tb[i]
for(;--i>=0;){f2/=f;space_tb[i]=f2}
i=5;f2=space_tb[i]
for(;++i<space_tb.length;){f2*=f;space_tb[i]=f2}
break
case"play":cfmt.sound="play"
break
case"pos":cmd=param.split(/\s+/);set_pos(cmd[0],cmd[1])
break
case"sounding-score":if(cfmt.sound!="play")
cfmt.sound="sounding"
break
case"staffwidth":v=get_unit(param)
if(isNaN(v)){syntax(1,errs.bad_val,'%%'+cmd)
break}
if(v<100){syntax(1,"%%staffwidth too small")
break}
v=cfmt.pagewidth-v-cfmt.leftmargin
if(v<2){syntax(1,"%%staffwidth too big")
break}
cfmt.rightmargin=v;img.chg=true
break
case"textoption":cfmt[cmd]=get_textopt(param)
break
case"titletrim":v=Number(param)
if(isNaN(v))
cfmt[cmd]=get_bool(param)
else
cfmt[cmd]=v
break
case"combinevoices":syntax(1,"%%combinevoices is deprecated - use %%voicecombine instead")
break
case"voicemap":set_v_param("map",param)
break
case"voicescale":set_v_param("scale",param)
break
default:if(parse.state==0)
cfmt[cmd]=param
break}}
function st_font(font){var n=font.name,r=""
if(font.weight)
r+=font.weight+" "
if(font.style)
r+=font.style+" "
if(n.indexOf(' ')>0)
n='"'+n.replace(/"/g,"")+'"'
return r+font.size.toFixed(1)+'px '+n}
function style_font(font){return'font:'+st_font(font)}
Abc.prototype.style_font=style_font
function font_class(font){if(font.class)
return'f'+font.fid+cfmt.fullsvg+' '+font.class
return'f'+font.fid+cfmt.fullsvg}
function use_font(font){if(!font.used){font.used=true;if(font.fid==undefined){font.fid=font_tb.length;font_tb.push(font)
if(!font.swfac)
set_font_fac(font)}
font_style+="\n.f"+font.fid+cfmt.fullsvg+" {"+style_font(font)+"}"}}
function get_font(fn){var font,font2,fid,st
fn+="font"
font=cfmt[fn]
if(!font){syntax(1,"Unknown font $1",'$'+fn[1]);return gene.curfont}
if(!font.name||!font.size){font2=Object.create(gene.curfont)
if(font.name)
font2.name=font.name
if(font.normal){if(font2.weight)
font2.weight=null
if(font2.style)
font2.style=null}else{if(font.weight)
font2.weight=font.weight
if(font.style)
font2.style=font.style}
if(font.class)
font2.class=font.class
if(font.size)
font2.size=font.size
st=st_font(font2)
fid=font_st[st]
if(fid!=undefined)
return font_tb[fid]
font_st[st]=font_tb.length
font2.fid=font2.used=undefined
font=font2}
use_font(font)
return font}
var sav={}
var abc_utf={"=D":"Đ","=H":"Ħ","=T":"Ŧ","=d":"đ","=h":"ħ","=t":"ŧ","/O":"Ø","/o":"ø","/L":"Ł","/l":"ł","vL":"Ľ","vl":"ľ","vd":"ď",".i":"ı","AA":"Å","aa":"å","AE":"Æ","ae":"æ","DH":"Ð","dh":"ð","OE":"Œ","oe":"œ","ss":"ß","TH":"Þ","th":"þ"}
var oct_acc={"1":"\u266f","2":"\u266d","3":"\u266e","4":"&#x1d12a;","5":"&#x1d12b;"}
function cnv_escape(src){var c,c2,dst="",i,j=0
while(1){i=src.indexOf('\\',j)
if(i<0)
break
dst+=src.slice(j,i);c=src[++i]
if(!c)
return dst+'\\'
switch(c){case'0':case'2':if(src[i+1]!='0')
break
c2=oct_acc[src[i+2]]
if(c2){dst+=c2;j=i+3
continue}
break
case'u':j=Number("0x"+src.slice(i+1,i+5));if(isNaN(j)||j<0x20){dst+=src[++i]+"\u0306"
j=i+1
continue}
dst+=String.fromCharCode(j);j=i+5
continue
case't':dst+=' ';j=i+1
continue
default:c2=abc_utf[src.slice(i,i+2)]
if(c2){dst+=c2;j=i+2
continue}
c2=src[i+1]
if(!/[A-Za-z]/.test(c2))
break
switch(c){case'`':dst+=c2+"\u0300"
j=i+2
continue
case"'":dst+=c2+"\u0301"
j=i+2
continue
case'^':dst+=c2+"\u0302"
j=i+2
continue
case'~':dst+=c2+"\u0303"
j=i+2
continue
case'=':dst+=c2+"\u0304"
j=i+2
continue
case'_':dst+=c2+"\u0305"
j=i+2
continue
case'.':dst+=c2+"\u0307"
j=i+2
continue
case'"':dst+=c2+"\u0308"
j=i+2
continue
case'o':dst+=c2+"\u030a"
j=i+2
continue
case'H':dst+=c2+"\u030b"
j=i+2
continue
case'v':dst+=c2+"\u030c"
j=i+2
continue
case'c':dst+=c2+"\u0327"
j=i+2
continue
case';':dst+=c2+"\u0328"
j=i+2
continue}
break}
dst+='\\'+c;j=i+1}
return dst+src.slice(j)}
var include=0
function do_include(fn){var file,parse_sav
if(!user.read_file){syntax(1,"No read_file support")
return}
if(include>2){syntax(1,"Too many include levels")
return}
file=user.read_file(fn)
if(!file){syntax(1,"Cannot read file '$1'",fn)
return}
include++;parse_sav=clone(parse);tosvg(fn,file);parse_sav.state=parse.state;parse=parse_sav;include--}
function tosvg(in_fname,file,bol,eof){var i,c,eol,end,select,line0,line1,last_info,opt,text,a,b,s,pscom,txt_add='\n'
function tune_selected(){var re,res,i=file.indexOf('K:',bol)
if(i<0){return false}
i=file.indexOf('\n',i)
if(parse.select.test(file.slice(parse.bol,i)))
return true
re=/\n\w*\n/;re.lastIndex=i;res=re.exec(file)
if(res)
eol=re.lastIndex
else
eol=eof
return false}
function uncomment(src,do_escape){if(!src)
return src
if(src.indexOf('%')>=0)
src=src.replace(/([^\\])%.*/,'$1').replace(/\\%/g,'%');src=src.replace(/\s+$/,'')
if(do_escape&&src.indexOf('\\')>=0)
return cnv_escape(src)
return src}
function end_tune(){generate()
if(info.W)
put_words(info.W);put_history();blk_flush();parse.state=0;cfmt=sav.cfmt;info=sav.info;char_tb=sav.char_tb;glovar=sav.glovar;maps=sav.maps;mac=sav.mac;maci=sav.maci;parse.tune_v_opts=null;parse.scores=null;init_tune()
img.chg=true;set_page()}
function do_voice(select,in_tune){var opt,bol
if(select=="end")
return
if(in_tune){if(!parse.tune_v_opts)
parse.tune_v_opts={};opt=parse.tune_v_opts}else{if(!parse.voice_opts)
parse.voice_opts={};opt=parse.voice_opts}
opt[select]=[]
while(1){bol=++eol
if(file[bol]!='%')
break
eol=file.indexOf('\n',eol);if(file[bol+1]!=line1)
continue
bol+=2
if(eol<0)
text=file.slice(bol)
else
text=file.slice(bol,eol);a=text.match(/\S+/)
switch(a[0]){default:opt[select].push(uncomment(text,true))
continue
case"score":case"staves":case"tune":case"voice":bol-=2
break}
break}
eol=parse.eol=bol-1}
function tune_filter(){var o,opts,j,pc,h,i=file.indexOf('K:',bol)
i=file.indexOf('\n',i);h=file.slice(parse.bol,i)
for(i in parse.tune_opts){if(!parse.tune_opts.hasOwnProperty(i))
continue
if(!(new RegExp(i)).test(h))
continue
opts=parse.tune_opts[i]
for(j=0;j<opts.t_opts.length;j++){pc=opts.t_opts[j]
switch(pc.match(/\S+/)[0]){case"score":case"staves":if(!parse.scores)
parse.scores=[];parse.scores.push(pc)
break
default:self.do_pscom(pc)
break}}
opts=opts.v_opts
if(!opts)
continue
for(j in opts){if(!opts.hasOwnProperty(j))
continue
if(!parse.tune_v_opts)
parse.tune_v_opts={};if(!parse.tune_v_opts[j])
parse.tune_v_opts[j]=opts[j]
else
parse.tune_v_opts[j]=parse.tune_v_opts[j].concat(opts[j])}}}
if(abc2svg.modules&&(abc2svg.modules.hooks.length||abc2svg.modules.g_hooks.length))
set_hooks()
parse.file=file;parse.fname=in_fname
if(bol==undefined)
bol=0
if(!eof)
eof=file.length
for(;bol<eof;bol=parse.eol+1){eol=file.indexOf('\n',bol)
if(eol<0||eol>eof)
eol=eof;parse.eol=eol
while(1){eol--
switch(file[eol]){case' ':case'\t':continue}
break}
eol++
if(eol==bol){if(parse.state==1){parse.istart=bol;syntax(1,"Empty line in tune header - ignored")}else if(parse.state>=2){end_tune()
if(parse.select){eol=file.indexOf('\nX:',parse.eol)
if(eol<0)
eol=eof
parse.eol=eol}}
continue}
parse.istart=parse.bol=bol;parse.iend=eol;parse.line.index=0;line0=file[bol];line1=file[bol+1]
if(line0=='%'){if(parse.prefix.indexOf(line1)<0)
continue
if(file[bol+2]=='a'&&file[bol+3]=='b'&&file[bol+4]=='c'&&file[bol+5]==' '){bol+=6;line0=file[bol];line1=file[bol+1]}else{pscom=true}}else if(line0=='I'&&line1==':'){pscom=true}
if(pscom){pscom=false;bol+=2
text=file.slice(bol,eol)
a=text.match(/([^\s]+)\s*(.*)/)
if(!a||a[1][0]=='%')
continue
switch(a[1]){case"abcm2ps":case"ss-pref":parse.prefix=a[2]
continue
case"abc-include":do_include(uncomment(a[2]))
continue}
if(a[1].slice(0,5)=='begin'){b=a[1].substr(5);end='\n'+line0+line1+"end"+b;i=file.indexOf(end,eol)
if(i<0){syntax(1,"No $1 after %%$2",end.slice(1),a[1]);parse.eol=eof
continue}
self.do_begin_end(b,uncomment(a[2]),file.slice(eol+1,i).replace(new RegExp('^'+line0+line1,'gm'),''));parse.eol=file.indexOf('\n',i+6)
if(parse.eol<0)
parse.eol=eof
continue}
switch(a[1]){case"select":if(parse.state!=0){syntax(1,errs.not_in_tune,"%%select")
continue}
select=uncomment(text.slice(7))
if(select[0]=='"')
select=select.slice(1,-1);if(!select){delete parse.select
continue}
select=select.replace(/\(/g,'\\(');select=select.replace(/\)/g,'\\)');parse.select=new RegExp(select,'m')
continue
case"tune":if(parse.state!=0){syntax(1,errs.not_in_tune,"%%tune")
continue}
select=uncomment(a[2])
if(!select){parse.tune_opts={}
continue}
if(select=="end")
continue
if(!parse.tune_opts)
parse.tune_opts={};parse.tune_opts[select]=opt={t_opts:[]};while(1){bol=++eol
if(file[bol]!='%')
break
eol=file.indexOf('\n',eol);if(file[bol+1]!=line1)
continue
bol+=2
if(eol<0)
text=file.slice(bol)
else
text=file.slice(bol,eol);a=text.match(/([^\s]+)\s*(.*)/)
switch(a[1]){case"tune":break
case"voice":do_voice(uncomment(a[2],true),true)
continue
default:opt.t_opts.push(uncomment(text,true))
continue}
break}
if(parse.tune_v_opts){opt.v_opts=parse.tune_v_opts;parse.tune_v_opts=null}
parse.eol=bol-1
continue
case"voice":if(parse.state!=0){syntax(1,errs.not_in_tune,"%%voice")
continue}
select=uncomment(a[2])
if(!select){parse.voice_opts=null
continue}
do_voice(select)
continue}
self.do_pscom(uncomment(text,true))
continue}
if(line1!=':'||!/[A-Za-z+]/.test(line0)){last_info=undefined;if(parse.state<2)
continue
parse.line.buffer=uncomment(file.slice(bol,eol),true);parse_music_line()
continue}
bol+=2
while(1){switch(file[bol]){case' ':case'\t':bol++
continue}
break}
text=uncomment(file.slice(bol,eol),true)
if(line0=='+'){if(!last_info){syntax(1,"+: without previous info field")
continue}
txt_add=' ';line0=last_info}
switch(line0){case'X':if(parse.state!=0){syntax(1,errs.ignored,line0)
continue}
if(parse.select&&!tune_selected()){eol=file.indexOf('\nX:',parse.eol)
if(eol<0)
eol=eof;parse.eol=eol
continue}
sav.cfmt=clone(cfmt);sav.info=clone(info,1);sav.char_tb=clone(char_tb);sav.glovar=clone(glovar);sav.maps=clone(maps,1);sav.mac=clone(mac);sav.maci=new Int8Array(maci);info.X=text;parse.state=1
if(parse.tune_opts)
tune_filter()
continue
case'T':switch(parse.state){case 0:continue
case 1:case 2:if(info.T==undefined)
info.T=text
else
info.T+="\n"+text
continue}
s=new_block("title");s.text=text
continue
case'K':switch(parse.state){case 0:continue
case 1:info.K=text
break}
do_info(line0,text)
continue
case'W':if(parse.state==0||cfmt.writefields.indexOf(line0)<0)
break
if(info.W==undefined)
info.W=text
else
info.W+=txt_add+text
break
case'm':if(parse.state>=2){syntax(1,errs.ignored,line0)
continue}
if((!cfmt.sound||cfmt.sound!="play")&&cfmt.writefields.indexOf(line0)<0)
break
a=text.match(/(.*?)[= ]+(.*)/)
if(!a||!a[2]){syntax(1,errs.bad_val,"m:")
continue}
mac[a[1]]=a[2];maci[a[1].charCodeAt(0)]=1
break
case's':if(parse.state!=3||cfmt.writefields.indexOf(line0)<0)
break
get_sym(text,txt_add==' ')
break
case'w':if(parse.state!=3||cfmt.writefields.indexOf(line0)<0)
break
get_lyrics(text,txt_add==' ')
if(text.slice(-1)=='\\'){txt_add=' ';last_info=line0
continue}
break
case'|':if(parse.state<2)
continue
parse.line.buffer=text
parse_music_line()
continue
default:if("ABCDFGHNOSZ".indexOf(line0)>=0){if(parse.state>=2){syntax(1,errs.ignored,line0)
continue}
if(!info[line0])
info[line0]=text
else
info[line0]+=txt_add+text
break}
do_info(line0,text)
continue}
txt_add='\n';last_info=line0}
if(include)
return
if(parse.state>=2)
end_tune();parse.state=0}
Abc.prototype.tosvg=tosvg
var gene,staff_tb,nstaff,tsnext,realwidth,insert_meter,spf_last,space_tb=new Float32Array([8.4,11.2,14.9,19.8,26.3,35,46.6,61.9,82.3,109.5]),smallest_duration
var dx_tb=new Float32Array([10,10,11,13,13])
var hw_tb=new Float32Array([4.5,5,6,7,8])
var w_note=new Float32Array([3.5,3.7,5,6,7])
function identify_note(s,dur_o){var head,flags,dots=0,dur=dur_o
if(dur%12!=0)
error(1,s,"Invalid note duration $1",dur);dur/=12
if(dur==0)
error(1,s,"Note too short")
for(flags=5;dur!=0;dur>>=1,flags--){if(dur&1)
break}
dur>>=1
if((dur+1)&dur)
error(0,s,"Non standard note duration $1",dur_o)
while(dur>>dots>0)
dots++
flags-=dots
if(flags>=0){head=C.FULL}else switch(flags){default:error(1,s,"Note too long");flags=-4
case-4:head=C.SQUARE
break
case-3:head=cfmt.squarebreve?C.SQUARE:C.OVALBARS
break
case-2:head=C.OVAL
break
case-1:head=C.EMPTY
break}
return[head,dots,flags]}
function set_head_shift(s){var i,i1,i2,d,ps,dx,dx_head=dx_tb[s.head],dir=s.stem,n=s.nhd
if(n==0)
return
dx=dx_head*.78
if(s.grace)
dx*=.5
if(dir>=0){i1=1;i2=n+1;ps=s.notes[0].pit}else{dx=-dx;i1=n-1;i2=-1;ps=s.notes[n].pit}
var shift=false,dx_max=0
for(i=i1;i!=i2;i+=dir){d=s.notes[i].pit-ps;ps=s.notes[i].pit
if(d==0){if(shift){var new_dx=s.notes[i].shhd=s.notes[i-dir].shhd+dx
if(dx_max<new_dx)
dx_max=new_dx
continue}
if(i+dir!=i2&&ps+dir==s.notes[i+dir].pit){s.notes[i].shhd=-dx
if(dx_max<-dx)
dx_max=-dx
continue}}
if(d<0)
d=-d
if(d>3||(d>=2&&s.head!=C.SQUARE)){shift=false}else{shift=!shift
if(shift){s.notes[i].shhd=dx
if(dx_max<dx)
dx_max=dx}}}
s.xmx=dx_max}
function acc_shift(notes,dx_head){var i,i1,dx,dx1,ps,p1,acc,n=notes.length
for(i=n-1;--i>=0;){dx=notes[i].shhd
if(!dx||dx>0)
continue
dx=dx_head-dx;ps=notes[i].pit
for(i1=n;--i1>=0;){if(!notes[i1].acc)
continue
p1=notes[i1].pit
if(p1<ps-3)
break
if(p1>ps+3)
continue
if(notes[i1].shac<dx)
notes[i1].shac=dx}}
for(i=n;--i>=0;){acc=notes[i].acc
if(!acc)
continue
dx=notes[i].shac
if(!dx){dx=notes[i].shhd
if(dx<0)
dx=dx_head-dx
else
dx=dx_head}
ps=notes[i].pit
for(i1=n;--i1>i;){if(!notes[i1].acc)
continue
p1=notes[i1].pit
if(p1>=ps+4){if(p1>ps+4||acc<0||notes[i1].acc<0)
continue}
if(dx>notes[i1].shac-6){dx1=notes[i1].shac+7
if(dx1>dx)
dx=dx1}}
notes[i].shac=dx}}
function sort_pitch(s){s.notes.sort(function(n1,n2){return n1.pit-n2.pit})}
function set_acc_shft(){var s,s2,st,i,acc,st,t,dx_head;s=tsfirst
while(s){if(s.type!=C.NOTE||s.invis){s=s.ts_next
continue}
st=s.st;t=s.time;acc=false
for(s2=s;s2;s2=s2.ts_next){if(s2.time!=t||s2.type!=C.NOTE||s2.st!=st)
break
if(acc)
continue
for(i=0;i<=s2.nhd;i++){if(s2.notes[i].acc){acc=true
break}}}
if(!acc){s=s2
continue}
dx_head=dx_tb[s.head]
st={notes:[]}
for(;s!=s2;s=s.ts_next)
Array.prototype.push.apply(st.notes,s.notes);acc_shift(st.notes,dx_head)}}
function lkvsym(s,next){s.next=next;s.prev=next.prev
if(s.prev)
s.prev.next=s
else
s.p_v.sym=s;next.prev=s}
function lktsym(s,next){if(next){s.ts_next=next;s.ts_prev=next.ts_prev
if(s.ts_prev)
s.ts_prev.ts_next=s;next.ts_prev=s}else{s.ts_next=s.ts_prev=null}}
function unlksym(s){if(s.next)
s.next.prev=s.prev
if(s.prev)
s.prev.next=s.next
else
s.p_v.sym=s.next
if(s.ts_next){if(s.seqst){if(s.ts_next.seqst){s.ts_next.shrink+=s.shrink;s.ts_next.space+=s.space}else{s.ts_next.seqst=true;s.ts_next.shrink=s.shrink;s.ts_next.space=s.space}}
s.ts_next.ts_prev=s.ts_prev}
if(s.ts_prev)
s.ts_prev.ts_next=s.ts_next
if(tsfirst==s)
tsfirst=s.ts_next
if(tsnext==s)
tsnext=s.ts_next}
function insert_clef(s,clef_type,clef_line){var p_voice=s.p_v,new_s,st=s.st
if(s.type==C.BAR&&s.prev&&s.prev.type==C.BAR&&s.prev.bar_type[0]!=':')
s=s.prev;p_voice.last_sym=s.prev
if(!p_voice.last_sym)
p_voice.sym=null;p_voice.time=s.time;new_s=sym_add(p_voice,C.CLEF);new_s.next=s;s.prev=new_s;new_s.clef_type=clef_type;new_s.clef_line=clef_line;new_s.st=st;new_s.clef_small=true
delete new_s.second;new_s.notes=[]
new_s.notes[0]={pit:s.notes[0].pit}
new_s.nhd=0;while(!s.seqst)
s=s.ts_prev;lktsym(new_s,s)
if(new_s.ts_prev.type!=C.CLEF)
new_s.seqst=true
return new_s}
function set_float(){var p_voice,st,staff_chg,v,s,s1,up,down
for(v=0;v<voice_tb.length;v++){p_voice=voice_tb[v]
staff_chg=false;st=p_voice.st
for(s=p_voice.sym;s;s=s.next){if(!s.floating){while(s&&!s.floating)
s=s.next
if(!s)
break
staff_chg=false}
if(!s.dur){if(staff_chg)
s.st++
continue}
if(s.notes[0].pit>=19){staff_chg=false
continue}
if(s.notes[s.nhd].pit<=12){staff_chg=true
s.st++
continue}
up=127
for(s1=s.ts_prev;s1;s1=s1.ts_prev){if(s1.st!=st||s1.v==s.v)
break
if(s1.type==C.NOTE)
if(s1.notes[0].pit<up)
up=s1.notes[0].pit}
if(up==127){if(staff_chg)
s.st++
continue}
if(s.notes[s.nhd].pit>up-3){staff_chg=false
continue}
down=-127
for(s1=s.ts_next;s1;s1=s1.ts_next){if(s1.st!=st+1||s1.v==s.v)
break
if(s1.type==C.NOTE)
if(s1.notes[s1.nhd].pit>down)
down=s1.notes[s1.nhd].pit}
if(down==-127){if(staff_chg)
s.st++
continue}
if(s.notes[0].pit<down+3){staff_chg=true
s.st++
continue}
up-=s.notes[s.nhd].pit
down=s.notes[0].pit-down
if(!staff_chg){if(up<down+3)
continue
staff_chg=true}else{if(up<down-3){staff_chg=false
continue}}
s.st++}}}
function set_graceoffs(s){var next,m,dx,x,gspleft=cfmt.gracespace[0],gspinside=cfmt.gracespace[1],gspright=cfmt.gracespace[2],g=s.extra;if(s.prev&&s.prev.type==C.BAR)
gspleft-=3;x=gspleft;g.beam_st=true
for(;;g=g.next){set_head_shift(g)
acc_shift(g.notes,7);dx=0
for(m=g.nhd;m>=0;m--){if(g.notes[m].shac>dx)
dx=g.notes[m].shac}
x+=dx;g.x=x
if(g.nflags<=0){g.beam_st=true;g.beam_end=true}
next=g.next
if(!next){g.beam_end=true
break}
if(next.nflags<=0)
g.beam_end=true
if(g.beam_end){next.beam_st=true;x+=gspinside/4}
if(g.nflags<=0)
x+=gspinside/4
if(g.y>next.y+8)
x-=1.5
x+=gspinside}
next=s.next
if(next&&next.type==C.NOTE){if(g.y>=3*(next.notes[next.nhd].pit-18))
gspright-=1
else if(g.beam_st&&g.y<3*(next.notes[next.nhd].pit-18)-4)
gspright+=2}
x+=gspright;return x}
function set_w_chs(s){var i,ch,w0,s0,dw,x=0,n=0
for(;s;s=s.ts_next){if(s.shrink){x+=s.shrink;n++}
if(!s.a_gch)
continue
for(i=0;i<s.a_gch.length;i++){ch=s.a_gch[i]
if(ch.type!='g'||ch.y<0)
continue
if(w0){if(w0>x+ch.x){dw=(w0-x-ch.x)/n
while(1){s0=s0.ts_next
if(s0.shrink)
s0.shrink+=dw
if(s0==s)
break}}}
s0=s;w0=ch.wh[0];n=0;x=0
break}}}
function gchord_width(s,wlnote,wlw){var gch,w,ix,arspc=0
for(ix=0;ix<s.a_gch.length;ix++){gch=s.a_gch[ix]
switch(gch.type){case'<':w=gch.wh[0]+wlnote
if(w>wlw)
wlw=w
break
case'>':w=gch.wh[0]+s.wr
if(w>arspc)
arspc=w
break}}
if(s.wr<arspc)
s.wr=arspc
return wlw}
Abc.prototype.set_width=function(s){var s2,i,m,xx,w,wlnote,wlw,acc,bar_type,meter,last_acc,n1,n2,esp,tmp
switch(s.type){case C.NOTE:case C.REST:s.wr=wlnote=hw_tb[s.head]
if(s.xmx>0)
s.wr+=s.xmx+4;for(s2=s.prev;s2;s2=s2.prev){if(w_tb[s2.type]!=0)
break}
if(s2){switch(s2.type){case C.BAR:case C.CLEF:case C.KEY:case C.METER:wlnote+=3
break}}
for(m=0;m<=s.nhd;m++){xx=s.notes[m].shhd
if(xx<0){if(wlnote<-xx+5)
wlnote=-xx+5}
if(s.notes[m].acc){tmp=s.notes[m].shac+
(s.notes[m].micro?5.5:3.5)
if(wlnote<tmp)
wlnote=tmp}}
if(s2){switch(s2.type){case C.BAR:case C.CLEF:case C.KEY:case C.METER:wlnote-=3
break}}
if(s.a_dd)
wlnote+=deco_width(s)
if(s.beam_st&&s.beam_end&&s.stem>0&&s.nflags>0){if(s.wr<s.xmx+9)
s.wr=s.xmx+9}
if(s.dots){if(s.wl==undefined)
switch(s.head){case C.SQUARE:case C.OVALBARS:s.xmx+=3
break
case C.OVAL:s.xmx+=1
break}
if(s.wr<s.xmx+8)
s.wr=s.xmx+8
if(s.dots>=2)
s.wr+=3.5*(s.dots-1)}
if(s.trem2&&s.beam_end&&wlnote<20)
wlnote=20
wlw=wlnote
if(s2){switch(s2.type){case C.NOTE:if(s2.stem>0&&s.stem<0){if(wlw<7)
wlw=7}
if((s.y>27&&s2.y>27)||(s.y<-3&&s2.y<-3)){if(wlw<6)
wlw=6}
if(s2.tie){if(wlw<14)
wlw=14}
break
case C.CLEF:if(s2.second||s2.clef_small)
break
wlw+=8
break
case C.KEY:wlw+=4
break}}
if(s.a_gch)
wlw=gchord_width(s,wlnote,wlw)
if(s.a_ly)
wlw=ly_width(s,wlw)
if(s2&&s2.type==C.GRACE)
s.wl=wlnote-4.5
else
s.wl=wlw
return
case C.SPACE:xx=s.width/2;s.wr=xx
if(s.a_gch)
xx=gchord_width(s,xx,xx)
if(s.a_dd)
xx+=deco_width(s);s.wl=xx
return
case C.BAR:if(s.norepbra)
break
bar_type=s.bar_type
switch(bar_type){case"|":w=5
break
default:w=2+2.8*bar_type.length
for(i=0;i<bar_type.length;i++){switch(bar_type[i]){case"[":case"]":w+=3
break
case":":w+=2
break}}
break}
s.wl=w
if(s.next&&s.next.type!=C.METER)
s.wr=7
else
s.wr=5
for(s2=s.prev;s2;s2=s2.prev){if(w_tb[s2.type]!=0){if(s2.type==C.GRACE)
s.wl-=8
break}}
if(s.a_dd)
s.wl+=deco_width(s)
if(s.text&&s.text.length<4&&s.next&&s.next.a_gch){set_font("repeat");s.wr+=strwh(s.text)[0]+2}
return
case C.CLEF:if(s.invis){s.wl=s.wr=1
return}
s.wl=s.clef_small?9:12
s.wr=s.clef_small?7:12
return
case C.KEY:if((!s.k_a_acc&&!s.k_sf&&!s.k_old_sf)||s.k_none||s.k_play){s.wl=s.wr=0
return}
s.wl=3;esp=4
if(!s.k_a_acc){n1=s.k_sf
if(s.k_old_sf&&(cfmt.cancelkey||n1==0))
n2=s.k_old_sf
else
n2=0
if(n1*n2>=0){if(n1<0)
n1=-n1
if(n2<0)
n2=-n2
if(n2>n1)
n1=n2}else{n1-=n2
if(n1<0)
n1=-n1;esp+=3}}else{n1=n2=s.k_a_acc.length
if(n2)
last_acc=s.k_a_acc[0].acc
for(i=1;i<n2;i++){acc=s.k_a_acc[i]
if(acc.pit>s.k_a_acc[i-1].pit+6||acc.pit<s.k_a_acc[i-1].pit-6)
n1--
else if(acc.acc!=last_acc)
esp+=3;last_acc=acc.acc}}
s.wr=5.5*n1+esp
return
case C.METER:wlw=0;s.x_meter=[]
for(i=0;i<s.a_meter.length;i++){meter=s.a_meter[i]
switch(meter.top[0]){case'C':case'c':case'o':s.x_meter[i]=wlw+6;wlw+=12
break
case'.':case'|':s.x_meter[i]=s.x_meter[i-1]
break
default:w=0
if(!meter.bot||meter.top.length>meter.bot.length)
meter=meter.top
else
meter=meter.bot;for(m=0;m<meter.length;m++){switch(meter[m]){case'(':wlw+=4
case')':case'1':w+=4
break
default:w+=12
break}}
s.x_meter[i]=wlw+w/2
wlw+=w}}
s.wl=0;s.wr=wlw+6
return
case C.MREST:s.wl=6;s.wr=66
return
case C.GRACE:s.wl=set_graceoffs(s);s.wr=0
if(s.a_ly)
ly_width(s,wlw)
return
case C.STBRK:s.wl=s.xmx
if(s.next&&s.next.type==C.CLEF){s.wr=2
delete s.next.clef_small}else{s.wr=8}
return
case C.CUSTOS:s.wl=s.wr=4
return
case C.TEMPO:set_font("tempo")
if(s.tempo_str1)
s.tempo_wh1=strwh(s.tempo_str1)
if(s.tempo_notes){s.tempo_str0='= '
if(s.tempo_ca)
s.tempo_str0+=s.tempo_ca
if(s.tempo)
s.tempo_str0+=s.tempo;s.tempo_wh0=strwh(s.tempo_str0)}
if(s.tempo_str2)
s.tempo_wh2=strwh(s.tempo_str2)
break
case C.BLOCK:case C.PART:case C.REMARK:case C.STAVES:break
default:error(2,s,"set_width - Cannot set width for symbol $1",s.type)
break}
s.wl=s.wr=0}
function time2space(s,len){var i,l,space
if(smallest_duration>=C.BLEN/2){if(smallest_duration>=C.BLEN)
len/=4
else
len/=2}else if(!s.next&&len>=C.BLEN){len/=2}
if(len>=C.BLEN/4){if(len<C.BLEN/2)
i=5
else if(len<C.BLEN)
i=6
else if(len<C.BLEN*2)
i=7
else if(len<C.BLEN*4)
i=8
else
i=9}else{if(len>=C.BLEN/8)
i=4
else if(len>=C.BLEN/16)
i=3
else if(len>=C.BLEN/32)
i=2
else if(len>=C.BLEN/64)
i=1
else
i=0}
l=len-((C.BLEN/16/8)<<i)
space=space_tb[i]
if(l!=0){if(l<0){space=space_tb[0]*len/(C.BLEN/16/8)}else{if(i>=9)
i=8
space+=(space_tb[i+1]-space_tb[i])*l/len}}
return space}
function set_space(s){var s2,space,prev_time=s.ts_prev.time,len=s.time-prev_time
if(len==0){switch(s.type){case C.MREST:return s.wl}
return 0}
if(s.ts_prev.type==C.MREST)
return 71
space=time2space(s,len)
while(!s.dur){switch(s.type){case C.BAR:if(!s.next)
return space
return space*.9-7
case C.CLEF:return space-s.wl-s.wr
case C.BLOCK:case C.PART:case C.REMARK:case C.STAVES:case C.TEMPO:s=s.ts_next
if(!s)
return space
continue}
break}
if(s.dur&&len<=C.BLEN/4){s2=s
while(s2){if(!s2.beam_st){space*=.9
break}
s2=s2.ts_next
if(!s2||s2.seqst)
break}}
if(s.type==C.NOTE&&s.nflags>=-1&&s.stem>0){var stemdir=true
for(s2=s.ts_prev;s2&&s2.time==prev_time;s2=s2.ts_prev){if(s2.type==C.NOTE&&(s2.nflags<-1||s2.stem>0)){stemdir=false
break}}
if(stemdir){for(s2=s.ts_next;s2&&s2.time==s.time;s2=s2.ts_next){if(s2.type==C.NOTE&&(s2.nflags<-1||s2.stem<0)){stemdir=false
break}}
if(stemdir)
space*=.9}}
return space}
function set_sp_tup(s,s_et){var s2,tim=s.time,endtime=s_et.time+s_et.dur,ttim=endtime-tim,space=time2space(s,ttim/s.tp[0].q)*s.tp[0].q/ttim
do{s=s.ts_next}while(!s.seqst)
do{if(!s_et.ts_next){s2=add_end_bar(s_et);s_et=s2}else{s_et=s_et.ts_next}}while(!s_et.seqst)
s2=s
while(1){if(s2.dur&&s2.dur*space<s2.shrink)
space=s2.shrink/s2.dur
if(s2==s_et)
break
s2=s2.ts_next}
while(1){if(s.seqst){s.space=(s.time-tim)*space;tim=s.time}
if(s==s_et)
break
s=s.ts_next}}
function add_end_bar(s){var bar={type:C.BAR,bar_type:"|",fname:s.fname,istart:s.istart,iend:s.iend,v:s.v,p_v:s.p_v,st:s.st,dur:0,seqst:true,invis:true,time:s.time+s.dur,nhd:0,notes:[{pit:s.notes[0].pit}],wl:0,wr:0,prev:s,ts_prev:s,shrink:s.wr+3}
s.next=s.ts_next=bar
return bar}
function set_allsymwidth(){var maxx,new_val,s_tupc,s_tupn,st,s_chs,s=tsfirst,s2=s,xa=0,xl=[],wr=[],ntup=0
while(1){maxx=xa
do{if(s.a_gch&&!s_chs)
s_chs=s;self.set_width(s);st=s.st
if(xl[st]==undefined)
xl[st]=0
if(wr[st]==undefined)
wr[st]=0;new_val=xl[st]+wr[st]+s.wl
if(new_val>maxx)
maxx=new_val;s=s.ts_next}while(s&&!s.seqst);s2.shrink=maxx-xa
if(!ntup)
s2.space=s2.ts_prev?set_space(s2):0
if(s2.shrink==0&&s2.space==0&&s2.type==C.CLEF){delete s2.seqst;s2.time=s2.ts_prev.time}
if(!s)
break
for(st=0;st<wr.length;st++)
wr[st]=0;xa=maxx
do{st=s2.st;xl[st]=xa
if(s2.wr>wr[st])
wr[st]=s2.wr
if(s2.tp){if(ntup==0&&!s_tupc)
s_tupc=s2
ntup+=s2.tp.length}
if(s2.tpe)
ntup-=s2.tpe;s2=s2.ts_next}while(!s2.seqst)}
if(s_chs)
set_w_chs(s_chs)
s=s_tupc
if(!s)
return
do{s2=s;ntup=s.tp.length
do{s=s.ts_next
if(s.tp)
ntup+=s.tp.length
if(s.tpe)
ntup-=s.tpe}while(ntup!=0);set_sp_tup(s2,s)
do{s=s.ts_next}while(s&&!s.tp)}while(s)}
function to_rest(s){s.type=C.REST
delete s.in_tuplet
delete s.sl1
delete s.a_dd
delete s.a_gch
delete s.sls}
function set_repeat(s){var s2,s3,i,j,dur,n=s.repeat_n,k=s.repeat_k,st=s.st,v=s.v
s.repeat_n=0
if(n<0){n=-n;i=n
for(s3=s.prev;s3;s3=s3.prev){if(!s3.dur){if(s3.type==C.BAR){error(1,s3,"Bar in repeat sequence")
return}
continue}
if(--i<=0)
break}
if(!s3){error(1,s,errs.not_enough_n)
return}
dur=s.time-s3.time;i=k*n
for(s2=s;s2;s2=s2.next){if(!s2.dur){if(s2.type==C.BAR){error(1,s2,"Bar in repeat sequence")
return}
continue}
if(--i<=0)
break}
if(!s2||!s2.next){error(1,s,errs.not_enough_n)
return}
for(s2=s.prev;s2!=s3;s2=s2.prev){if(s2.type==C.NOTE){s2.beam_end=true
break}}
for(j=k;--j>=0;){i=n
if(s.dur)
i--;s2=s.ts_next
while(i>0){if(s2.st==st){unlksym(s2)
if(s2.v==v&&s2.dur)
i--}
s2=s2.ts_next}
to_rest(s);s.dur=s.notes[0].dur=dur;s.rep_nb=-1;s.beam_st=true;self.set_width(s)
if(s.seqst)
s.space=set_space(s);s.head=C.SQUARE;for(s=s2;s;s=s.ts_next){if(s.st==st&&s.v==v&&s.dur)
break}}
return}
i=n
for(s2=s.prev.prev;s2;s2=s2.prev){if(s2.type==C.BAR||s2.time==tsfirst.time){if(--i<=0)
break}}
if(!s2){error(1,s,errs.not_enough_m)
return}
dur=s.time-s2.time
if(n==1)
i=k
else
i=n
for(s2=s;s2;s2=s2.next){if(s2.type==C.BAR){if(--i<=0)
break}}
if(!s2){error(1,s,errs.not_enough_m)
return}
i=k
if(n==2&&i>1){s2=s2.next
if(!s2){error(1,s,errs.not_enough_m)
return}
s2.repeat_n=n;s2.repeat_k=--i}
dur/=n
if(n==2){s3=s
for(s2=s.ts_next;;s2=s2.ts_next){if(s2.st!=st)
continue
if(s2.v==v&&s2.type==C.BAR)
break
unlksym(s2)}
to_rest(s3);s3.dur=s3.notes[0].dur=dur;s3.invis=true
if(s3.seqst)
s3.space=set_space(s3);s2.bar_mrep=2
if(s2.seqst)
s2.space=set_space(s2);s3=s2.next;for(s2=s3.ts_next;;s2=s2.ts_next){if(s2.st!=st)
continue
if(s2.v==v&&s2.type==C.BAR)
break
unlksym(s2)}
to_rest(s3);s3.dur=s3.notes[0].dur=dur;s3.invis=true;self.set_width(s3)
if(s3.seqst)
s3.space=set_space(s3)
if(s2.seqst)
s2.space=set_space(s2)
return}
s3=s
for(j=k;--j>=0;){for(s2=s3.ts_next;;s2=s2.ts_next){if(s2.st!=st)
continue
if(s2.v==v&&s2.type==C.BAR)
break
unlksym(s2)}
to_rest(s3);s3.dur=s3.notes[0].dur=dur;s3.beam_st=true
if(s3.seqst)
s3.space=set_space(s3)
if(s2.seqst)
s2.space=set_space(s2)
if(k==1){s3.rep_nb=1
break}
s3.rep_nb=k-j+1;s3=s2.next}}
function custos_add(s){var p_voice,new_s,i,s2=s
while(1){if(s2.type==C.NOTE)
break
s2=s2.next
if(!s2)
return}
p_voice=s.p_v;p_voice.last_sym=s.prev;p_voice.time=s.time;new_s=sym_add(p_voice,C.CUSTOS);new_s.next=s;s.prev=new_s;lktsym(new_s,s);new_s.seqst=true;new_s.shrink=s.shrink
if(new_s.shrink<8+4)
new_s.shrink=8+4;new_s.space=s2.space;new_s.wl=0;new_s.wr=4;new_s.nhd=s2.nhd;new_s.notes=[]
for(i=0;i<s.notes.length;i++){new_s.notes[i]={pit:s2.notes[i].pit,shhd:0,dur:C.BLEN/4}}
new_s.stemless=true}
function set_nl(s){var s2,s3,p_voice,done
function set_eol(s){if(cfmt.custos&&voice_tb.length==1)
custos_add(s)
s.nl=true}
function set_eol_next(s){if(!s.next){set_eol(s)
return s}
for(s=s.ts_next;s;s=s.ts_next){if(s.seqst){set_eol(s)
break}}
return s}
while(s){if(!s.ts_next)
return
if(s.ts_next.seqst)
break
s=s.ts_next}
if(cfmt.keywarn||cfmt.timewarn){for(s2=s.ts_next;s2;s2=s2.ts_next){switch(s2.type){case C.BAR:case C.CLEF:continue
case C.KEY:if(!cfmt.keywarn||(!s2.k_a_acc&&!s2.k_sf&&!s2.k_old_sf)||s2.k_none||s2.k_play)
continue
case C.METER:if(s2.type==C.METER&&!cfmt.timewarn)
continue
s3=s2.ts_prev;if(s3==s){s=s2
continue}
unlksym(s2);lktsym(s2,s.ts_next);s=s2
while(1){s2=s2.ts_prev
if(s2.v==s.v){s.next=s2.next;s.prev=s2;s.next.prev=s;s2.next=s
break}}
if(s.type!=s.ts_prev.type){if(!s.seqst){s.seqst=true;s.shrink=s.wl+s.prev.wr;s.space=s.ts_next.space;s.ts_next.space=0}}else{delete s.seqst}
s2=s3
continue}
if(w_tb[s2.type])
break}}
switch(s.type){case C.CLEF:case C.BAR:case C.STAVES:break
case C.GRACE:s=s.next
if(!s)
return s
default:return set_eol_next(s)}
for(;s;s=s.ts_prev){if(s.seqst&&s.type!=C.CLEF)
break}
done=0
for(;;s=s.ts_next){if(!s)
return s
if(!s.seqst)
continue
if(done<0)
break
switch(s.type){case C.STAVES:if(s.ts_prev&&s.ts_prev.type==C.BAR)
break
while(s.ts_next){if(w_tb[s.ts_next.type]!=0&&s.ts_next.type!=C.CLEF)
break
s=s.ts_next}
if(!s.ts_next||s.ts_next.type!=C.BAR)
continue
s=s.ts_next
case C.BAR:if(done)
break
done=1;continue
case C.STBRK:if(!s.stbrk_forced)
unlksym(s)
else
done=-1
continue
case C.CLEF:if(done)
break
continue
default:if(!done||(s.prev&&s.prev.type==C.GRACE))
continue
break}
break}
set_eol(s)
return s}
function get_ck_width(){var r0,r1,p_voice=voice_tb[0]
self.set_width(p_voice.clef);self.set_width(p_voice.key);self.set_width(p_voice.meter)
return[p_voice.clef.wl+p_voice.clef.wr+
p_voice.key.wl+p_voice.key.wr,p_voice.meter.wl+p_voice.meter.wr]}
function get_width(s,last){var shrink,space,w=0,wmx=0,sp_fac=(1-cfmt.maxshrink)
do{if(s.seqst){shrink=s.shrink
wmx+=shrink
if((space=s.space)<shrink)
w+=shrink
else
w+=shrink*cfmt.maxshrink
+space*sp_fac
s.x=w}
if(s==last)
break
s=s.ts_next}while(s)
return[w,wmx]}
function set_lines(s,last,lwidth,indent){var first,s2,s3,x,xmin,xmid,xmax,wwidth,shrink,space,nlines,cut_here,ws=get_width(s,last)
if(ws[1]+indent<lwidth){if(last)
last=set_nl(last)
return last}
wwidth=ws[0]+indent
while(1){nlines=Math.ceil(wwidth/lwidth)
if(nlines<=1){if(last)
last=set_nl(last)
return last}
s2=first=s;xmin=s.x-s.shrink-indent;xmax=xmin+lwidth;xmid=xmin+wwidth/nlines;xmin+=wwidth/nlines*cfmt.breaklimit;for(s=s.ts_next;s!=last;s=s.ts_next){if(!s.x)
continue
if(s.type==C.BAR)
s2=s
if(s.x>=xmin)
break}
if(s==last){if(last)
last=set_nl(last)
return last}
cut_here=false;s3=null
for(;s!=last;s=s.ts_next){x=s.x
if(!x)
continue
if(x>xmax)
break
if(s.type!=C.BAR)
continue
if(x<xmid){s3=s
continue}
if(!s3||x-xmid<xmid-s3.x)
s3=s
break}
if(s3){s=s3;cut_here=true}
if(!cut_here){var beam=0,bar_time=s2.time;xmax-=8;s=s2;s3=null
for(;s!=last;s=s.ts_next){if(s.beam_st)
beam++
if(s.beam_end&&beam>0)
beam--
x=s.x
if(!x)
continue
if(x+s.wr>=xmax)
break
if(beam||s.in_tuplet)
continue
if((s.time-bar_time)%(C.BLEN/4)==0){s3=s
continue}
if(!s3||s.x<xmid){s3=s
continue}
if(s3>xmid)
break
if(xmid-s3.x<s.x-xmid)
break
s3=s
break}
if(s3){s=s3;cut_here=true}}
if(!cut_here){s3=s=s2
for(;s!=last;s=s.ts_next){x=s.x
if(!x)
continue
if(s.x<xmid){s3=s
continue}
if(s3>xmid)
break
if(xmid-s3.x<s.x-xmid)
break
s3=s
break}
s=s3}
if(s.nl){error(0,s,"Line split problem - adjust maxshrink and/or breaklimit");nlines=2
for(s=s.ts_next;s!=last;s=s.ts_next){if(!s.x)
continue
if(--nlines<=0)
break}}
s=set_nl(s)
if(!s||(last&&s.time>=last.time))
break
wwidth-=s.x-first.x;indent=0}
return s}
function cut_tune(lwidth,indent){var s2,i,s=tsfirst
if(indent!=0){i=set_indent()
lwidth-=i;indent-=i}
i=get_ck_width();lwidth-=i[0];indent+=i[1]
if(cfmt.custos&&voice_tb.length==1)
lwidth-=12
if(cfmt.barsperstaff){i=cfmt.barsperstaff;for(s2=s;s2;s2=s2.ts_next){if(s2.type!=C.BAR||!s2.bar_num||--i>0)
continue
s2.eoln=true;i=cfmt.barsperstaff}}
s2=s
for(;s;s=s.ts_next){if(!s.ts_next)
s=s.ts_next
else if(!s.eoln)
continue
else
s.eoln=false
s2=set_lines(s2,s,lwidth,indent)
if(!s2)
break
if(!s2.ts_prev){delete s2.nl
continue}
s=s2.ts_prev;indent=0}}
function set_yval(s){switch(s.type){case C.CLEF:if(s.second||s.invis){s.ymx=s.ymn=12
break}
s.y=(s.clef_line-1)*6
switch(s.clef_type){default:s.ymx=s.y+28
s.ymn=s.y-14
break
case"c":s.ymx=s.y+13
s.ymn=s.y-11
break
case"b":s.ymx=s.y+7
s.ymn=s.y-12
break}
if(s.clef_small){s.ymx-=2;s.ymn+=2}
if(s.ymx<26)
s.ymx=26
if(s.ymn>-1)
s.ymn=-1
if(s.clef_octave){if(s.clef_octave>0)
s.ymx+=12
else
s.ymn-=12}
break
case C.KEY:if(s.k_sf>2)
s.ymx=24+10
else if(s.k_sf>0)
s.ymx=24+6
else
s.ymx=24+2;s.ymn=-2
break
default:s.ymx=24;s.ymn=0
break}}
function set_ottava(){var s,st,delta,note,g,m=nstaff+1,staff_d=new Int16Array(new Array(m*2)),staff_noo=new Int8Array(new Array(m))
function ottava_add(s,ottava,start){var dc_st=["15mb(","8vb(",null,"8va(","15ma("],dc_en=["15mb)","8vb)",null,"8va)","15ma)"];deco_cnv([(start?dc_st:dc_en)[2+ottava]],s)}
for(st=0;st<=nstaff;st++){staff_d[st]=0;staff_noo[st]=0}
for(s=tsfirst;s;s=s.ts_next){st=s.st
if(s.ottava!=undefined)
while(s.ottava.length){if(s.ottava[0]){if(staff_noo[st]++==0){ottava_add(s,s.ottava[0],true);staff_d[st]=-s.ottava[0]*7}}else{if(--staff_noo[st]==0){ottava_add(s,-staff_d[st]/7);staff_d[st]=0}}
s.ottava.shift()}
switch(s.type){case C.REST:if(voice_tb.length==1)
break
case C.NOTE:delta=staff_d[st]
if(delta!=0&&!s.p_v.key.k_drum){for(m=s.nhd;m>=0;m--){note=s.notes[m];if(!note.opit)
note.opit=note.pit;note.pit+=delta}}
break
case C.GRACE:for(g=s.extra;g;g=g.next){delta=staff_d[st]
if(delta!=0&&!s.p_v.key.k_drum){for(m=0;m<=g.nhd;m++){note=g.notes[m]
if(!note.opit)
note.opit=note.pit
note.pit+=delta}}}
break}}}
function set_auto_clef(st,s_start,clef_type_start){var s,min,max,time,s2,s3;max=12;min=20
for(s=s_start;s;s=s.ts_next){if(s.type==C.STAVES&&s!=s_start)
break
if(s.st!=st)
continue
if(s.type!=C.NOTE){if(s.type==C.CLEF){if(s.clef_type!='a')
break
unlksym(s)}
continue}
if(s.notes[0].pit<min)
min=s.notes[0].pit
else if(s.notes[s.nhd].pit>max)
max=s.notes[s.nhd].pit}
if(min>=19||(min>=13&&clef_type_start!='b'))
return't'
if(max<=13||(max<=19&&clef_type_start!='t'))
return'b'
if(clef_type_start=='a'){if((max+min)/2>=16)
clef_type_start='t'
else
clef_type_start='b'}
var clef_type=clef_type_start,s_last=s,s_last_chg=null
for(s=s_start;s!=s_last;s=s.ts_next){if(s.type==C.STAVES&&s!=s_start)
break
if(s.st!=st||s.type!=C.NOTE)
continue
time=s.time
if(clef_type=='t'){if(s.notes[0].pit>12||s.notes[s.nhd].pit>20){if(s.notes[0].pit>20)
s_last_chg=s
continue}
s2=s.ts_prev
if(s2&&s2.time==time&&s2.st==st&&s2.type==C.NOTE&&s2.notes[0].pit>=19)
continue
s2=s.ts_next
if(s2&&s2.st==st&&s2.time==time&&s2.type==C.NOTE&&s2.notes[0].pit>=19)
continue}else{if(s.notes[0].pit<12||s.notes[s.nhd].pit<20){if(s.notes[s.nhd].pit<12)
s_last_chg=s
continue}
s2=s.ts_prev
if(s2&&s2.time==time&&s2.st==st&&s2.type==C.NOTE&&s2.notes[0].pit<=13)
continue
s2=s.ts_next
if(s2&&s2.st==st&&s2.time==time&&s2.type==C.NOTE&&s2.notes[0].pit<=13)
continue}
if(!s_last_chg){clef_type=clef_type_start=clef_type=='t'?'b':'t';s_last_chg=s
continue}
s3=s
for(s2=s.ts_prev;s2!=s_last_chg;s2=s2.ts_prev){if(s2.st!=st)
continue
if(s2.type==C.BAR&&s2.v==s.v){s3=s2.bar_type[0]!=':'?s2:s2.next
break}
if(s2.type!=C.NOTE)
continue
if(s2.beam_st&&!s2.p_v.second)
s3=s2}
if(s3.time==s_last_chg.time){s_last_chg=s
continue}
s_last_chg=s;clef_type=clef_type=='t'?'b':'t';s2=insert_clef(s3,clef_type,clef_type=="t"?2:4);s2.clef_auto=true}
return clef_type_start}
function set_clefs(){var s,s2,st,v,p_voice,g,new_type,new_line,p_staff,pit,staff_clef=new Array(nstaff+1),sy=cur_sy,mid=[]
staff_tb=new Array(nstaff+1)
for(st=0;st<=nstaff;st++){staff_clef[st]={autoclef:true}
staff_tb[st]={output:"",sc_out:""}}
for(v=0;v<voice_tb.length;v++){p_voice=voice_tb[v]
if(!sy.voices[v])
continue
st=sy.voices[v].st
if(!sy.voices[v].second){if(p_voice.staffnonote!=undefined)
sy.staves[st].staffnonote=p_voice.staffnonote
if(p_voice.staffscale)
sy.staves[st].staffscale=p_voice.staffscale
if(sy.voices[v].sep)
sy.staves[st].sep=sy.voices[v].sep
if(sy.voices[v].maxsep)
sy.staves[st].maxsep=sy.voices[v].maxsep;if(!p_voice.clef.clef_auto)
staff_clef[st].autoclef=false}}
for(v=0;v<voice_tb.length;v++){p_voice=voice_tb[v]
if(!sy.voices[v]||sy.voices[v].second)
continue
st=sy.voices[v].st;s=p_voice.clef
if(staff_clef[st].autoclef){s.clef_type=set_auto_clef(st,tsfirst,s.clef_type);s.clef_line=s.clef_type=='t'?2:4}
staff_clef[st].clef=staff_tb[st].clef=s}
for(st=0;st<=sy.nstaff;st++)
mid[st]=(sy.staves[st].stafflines.length-1)*3
for(s=tsfirst;s;s=s.ts_next){if(s.repeat_n)
set_repeat(s)
switch(s.type){case C.STAVES:sy=s.sy
for(st=0;st<=nstaff;st++)
staff_clef[st].autoclef=true
for(v=0;v<voice_tb.length;v++){if(!sy.voices[v])
continue
p_voice=voice_tb[v];st=sy.voices[v].st
if(!sy.voices[v].second){if(p_voice.staffnonote!=undefined)
sy.staves[st].staffnonote=p_voice.staffnonote
if(p_voice.staffscale)
sy.staves[st].staffscale=p_voice.staffscale
if(sy.voices[v].sep)
sy.staves[st].sep=sy.voices[v].sep
if(sy.voices[v].maxsep)
sy.staves[st].maxsep=sy.voices[v].maxsep}
s2=p_voice.clef
if(!s2.clef_auto)
staff_clef[st].autoclef=false}
for(st=0;st<=sy.nstaff;st++)
mid[st]=(sy.staves[st].stafflines.length-1)*3
for(v=0;v<voice_tb.length;v++){if(!sy.voices[v]||sy.voices[v].second)
continue
p_voice=voice_tb[v];st=sy.voices[v].st;s2=p_voice.clef
if(s2.clef_auto){new_type=set_auto_clef(st,s,staff_clef[st].clef?staff_clef[st].clef.clef_type:'a');new_line=new_type=='t'?2:4}else{new_type=s2.clef_type;new_line=s2.clef_line}
if(!staff_clef[st].clef){if(s2.clef_auto){if(s2.type!='a')
p_voice.clef=clone(p_voice.clef);p_voice.clef.clef_type=new_type;p_voice.clef.clef_line=new_line}
staff_tb[st].clef=staff_clef[st].clef=p_voice.clef
continue}
if(new_type==staff_clef[st].clef.clef_type&&new_line==staff_clef[st].clef.clef_line)
continue
g=s.ts_prev
while(g&&g.time==s.time&&(g.v!=v||g.st!=st))
g=g.ts_prev
if(!g||g.time!=s.time){g=s.ts_next
while(g&&(g.v!=v||g.st!=st))
g=g.ts_next
if(!g||g.time!=s.time)
g=s}
if(g.type!=C.CLEF){g=insert_clef(g,new_type,new_line)
if(s2.clef_auto)
g.clef_auto=true}
staff_clef[st].clef=p_voice.clef=g}
continue
default:s.mid=mid[s.st]
continue
case C.CLEF:break}
if(s.clef_type=='a'){s.clef_type=set_auto_clef(s.st,s.ts_next,staff_clef[s.st].clef.clef_type);s.clef_line=s.clef_type=='t'?2:4}
p_voice=s.p_v;p_voice.clef=s
if(s.second){unlksym(s)
continue}
st=s.st
if(staff_clef[st].clef){if(s.clef_type==staff_clef[st].clef.clef_type&&s.clef_line==staff_clef[st].clef.clef_line){continue}}else{staff_tb[st].clef=s}
staff_clef[st].clef=s}
sy=cur_sy
for(v=0;v<voice_tb.length;v++){if(!sy.voices[v])
continue
s2=voice_tb[v].sym
if(!s2||s2.notes[0].pit!=127)
continue
st=sy.voices[v].st
switch(staff_tb[st].clef.clef_type){default:pit=22
break
case"c":pit=16
break
case"b":pit=10
break}
for(s=s2;s;s=s.next)
s.notes[0].pit=pit}}
var delta_tb={t:0-2*2,c:6-3*2,b:12-4*2,p:0-3*2}
var rest_sp=[[18,18],[12,18],[12,12],[0,12],[6,8],[10,10],[6,4],[10,0],[10,4],[10,10]]
Abc.prototype.set_pitch=function(last_s){var s,s2,g,st,delta,pitch,note,dur=C.BLEN,m=nstaff+1,staff_delta=new Int16Array(new Array(m*2)),sy=cur_sy
for(st=0;st<=nstaff;st++){s=staff_tb[st].clef;staff_delta[st]=delta_tb[s.clef_type]+s.clef_line*2
if(s.clefpit)
staff_delta[st]+=s.clefpit
if(cfmt.sound){if(s.clef_octave&&!s.clef_oct_transp)
staff_delta[st]+=s.clef_octave}else{if(s.clef_oct_transp)
staff_delta[st]-=s.clef_octave}}
for(s=tsfirst;s!=last_s;s=s.ts_next){st=s.st
switch(s.type){case C.CLEF:staff_delta[st]=delta_tb[s.clef_type]+
s.clef_line*2
if(s.clefpit)
staff_delta[st]+=s.clefpit
if(cfmt.sound){if(s.clef_octave&&!s.clef_oct_transp)
staff_delta[st]+=s.clef_octave}else{if(s.clef_oct_transp)
staff_delta[st]-=s.clef_octave}
set_yval(s)
break
case C.GRACE:for(g=s.extra;g;g=g.next){delta=staff_delta[g.st]
if(delta!=0&&!s.p_v.key.k_drum){for(m=0;m<=g.nhd;m++){note=g.notes[m];note.opit=note.pit
note.pit+=delta}}
g.ymn=3*(g.notes[0].pit-18)-2;g.ymx=3*(g.notes[g.nhd].pit-18)+2}
set_yval(s)
break
case C.KEY:s.k_y_clef=staff_delta[st]
default:set_yval(s)
break
case C.MREST:if(s.invis)
break
s.y=12;s.ymx=24+15;s.ymn=-2
break
case C.REST:if(voice_tb.length==1){s.y=12;s.ymx=24;s.ymn=0
break}
case C.NOTE:delta=staff_delta[st]
if(delta!=0&&!s.p_v.key.k_drum){for(m=s.nhd;m>=0;m--){note=s.notes[m]
note.opit=note.pit
note.pit+=delta}}
if(s.type==C.NOTE){s.ymx=3*(s.notes[s.nhd].pit-18)+4;s.ymn=3*(s.notes[0].pit-18)-4}else{s.y=(((s.notes[0].pit-18)/2)|0)*6;s.ymx=s.y+rest_sp[5-s.nflags][0];s.ymn=s.y-rest_sp[5-s.nflags][1]}
if(s.dur<dur)
dur=s.dur
break}}
if(!last_s)
smallest_duration=dur}
Abc.prototype.set_stem_dir=function(){var t,u,i,st,rvoice,v,v_st,st_v,vobj,v_st_tb,st_v_tb=[],s=tsfirst,sy=cur_sy,nst=sy.nstaff
while(s){for(st=0;st<=nst;st++)
st_v_tb[st]=[]
v_st_tb=[]
for(u=s;u;u=u.ts_next){if(u.type==C.BAR)
break;if(u.type==C.STAVES){if(u!=s)
break
sy=s.sy
for(st=nst;st<=sy.nstaff;st++)
st_v_tb[st]=[]
nst=sy.nstaff
continue}
if((u.type!=C.NOTE&&u.type!=C.REST)||u.invis)
continue
st=u.st;if(st>nst){var msg="*** fatal set_stem_dir(): bad staff number "+st+" max "+nst;error(2,null,msg);throw new Error(msg)}
v=u.v;v_st=v_st_tb[v]
if(!v_st){v_st={st1:-1,st2:-1}
v_st_tb[v]=v_st}
if(v_st.st1<0){v_st.st1=st}else if(v_st.st1!=st){if(st>v_st.st1){if(st>v_st.st2)
v_st.st2=st}else{if(v_st.st1>v_st.st2)
v_st.st2=v_st.st1;v_st.st1=st}}
st_v=st_v_tb[st];rvoice=sy.voices[v].range;for(i=st_v.length;--i>=0;){vobj=st_v[i]
if(vobj.v==rvoice)
break}
if(i<0){vobj={v:rvoice,ymx:0,ymn:24}
for(i=0;i<st_v.length;i++){if(rvoice<st_v[i].v){st_v.splice(i,0,vobj)
break}}
if(i==st_v.length)
st_v.push(vobj)}
if(u.type!=C.NOTE)
continue
if(u.ymx>vobj.ymx)
vobj.ymx=u.ymx
if(u.ymn<vobj.ymn)
vobj.ymn=u.ymn
if(u.xstem){if(u.ts_prev.st!=st-1||u.ts_prev.type!=C.NOTE){error(1,s,"Bad !xstem!");u.xstem=false}else{u.ts_prev.multi=1;u.multi=1;u.stemless=true}}}
for(;s!=u;s=s.ts_next){if(s.multi)
continue
switch(s.type){default:continue
case C.REST:if((s.combine!=undefined&&s.combine<0)||!s.ts_next||s.ts_next.type!=C.REST||s.ts_next.st!=s.st||s.time!=s.ts_next.time||s.dur!=s.ts_next.dur||(s.a_gch&&s.ts_next.a_gch)||s.invis)
break
if(s.ts_next.a_gch)
s.a_gch=s.ts_next.a_gch
unlksym(s.ts_next)
break
case C.NOTE:case C.GRACE:break}
st=s.st;v=s.v;v_st=v_st_tb[v];st_v=st_v_tb[st]
if(v_st&&v_st.st2>=0){if(st==v_st.st1)
s.multi=-1
else if(st==v_st.st2)
s.multi=1
continue}
if(st_v.length<=1){if(s.floating)
s.multi=st==voice_tb[v].st?-1:1
continue}
rvoice=sy.voices[v].range
for(i=st_v.length;--i>=0;){if(st_v[i].v==rvoice)
break}
if(i<0)
continue
if(i==st_v.length-1){s.multi=-1}else{s.multi=1
if(i!=0&&i+2==st_v.length){if(st_v[i].ymn-cfmt.stemheight>st_v[i+1].ymx)
s.multi=-1;t=s.ts_next
if(s.ts_prev&&s.ts_prev.time==s.time&&s.ts_prev.st==s.st&&s.notes[s.nhd].pit==s.ts_prev.notes[0].pit&&s.beam_st&&s.beam_end&&(!t||t.st!=s.st||t.time!=s.time))
s.multi=-1}}}
while(s&&s.type==C.BAR)
s=s.ts_next}}
function set_rest_offset(){var s,s2,v,end_time,not_alone,v_s,y,ymax,ymin,shift,dots,dx,v_s_tb=[],sy=cur_sy
for(s=tsfirst;s;s=s.ts_next){if(s.invis)
continue
if(s.type==C.STAVES)
sy=s.sy
if(!s.dur)
continue
v_s=v_s_tb[s.v]
if(!v_s){v_s={}
v_s_tb[s.v]=v_s}
v_s.s=s;v_s.st=s.st;v_s.end_time=s.time+s.dur
if(s.type!=C.REST)
continue
ymin=-127;ymax=127;not_alone=dots=false
for(v=0;v<=v_s_tb.length;v++){v_s=v_s_tb[v]
if(!v_s||!v_s.s||v_s.st!=s.st||v==s.v)
continue
if(v_s.end_time<=s.time)
continue
not_alone=true;s2=v_s.s
if(sy.voices[v].range<sy.voices[s.v].range){if(s2.time==s.time){if(s2.ymn<ymax){ymax=s2.ymn
if(s2.dots)
dots=true}}else{if(s2.y<ymax)
ymax=s2.y}}else{if(s2.time==s.time){if(s2.ymx>ymin){ymin=s2.ymx
if(s2.dots)
dots=true}}else{if(s2.y>ymin)
ymin=s2.y}}}
end_time=s.time+s.dur
for(s2=s.ts_next;s2;s2=s2.ts_next){if(s2.time>=end_time)
break
if(s2.st!=s.st||!s2.dur||s2.invis)
continue
not_alone=true
if(sy.voices[s2.v].range<sy.voices[s.v].range){if(s2.time==s.time){if(s2.ymn<ymax){ymax=s2.ymn
if(s2.dots)
dots=true}}else{if(s2.y<ymax)
ymax=s2.y}}else{if(s2.time==s.time){if(s2.ymx>ymin){ymin=s2.ymx
if(s2.dots)
dots=true}}else{if(s2.y>ymin)
ymin=s2.y}}}
if(!not_alone){s.y=12;s.ymx=24;s.ymn=0
continue}
if(ymax==127&&s.y<12){shift=12-s.y
s.y+=shift;s.ymx+=shift;s.ymn+=shift}
if(ymin==-127&&s.y>12){shift=s.y-12
s.y-=shift;s.ymx-=shift;s.ymn-=shift}
shift=ymax-s.ymx
if(shift<0){shift=Math.ceil(-shift/6)*6
if(s.ymn-shift>=ymin){s.y-=shift;s.ymx-=shift;s.ymn-=shift
continue}
dx=dots?15:10;s.notes[0].shhd=dx;s.xmx=dx
continue}
shift=ymin-s.ymn
if(shift>0){shift=Math.ceil(shift/6)*6
if(s.ymx+shift<=ymax){s.y+=shift;s.ymx+=shift;s.ymn+=shift
continue}
dx=dots?15:10;s.notes[0].shhd=dx;s.xmx=dx
continue}}}
function new_sym(type,p_voice,last_s){var s={type:type,fname:last_s.fname,v:p_voice.v,p_v:p_voice,st:p_voice.st,time:last_s.time}
if(p_voice.last_sym){s.next=p_voice.last_sym.next
if(s.next)
s.next.prev=s;p_voice.last_sym.next=s;s.prev=p_voice.last_sym}
p_voice.last_sym=s;lktsym(s,last_s)
if(s.ts_prev.type!=type)
s.seqst=true
if(last_s.type==type&&s.v!=last_s.v){delete last_s.seqst;last_s.shrink=0}
return s}
function init_music_line(){var p_voice,s,s2,s3,last_s,v,st,shr,shrmx,nv=voice_tb.length
for(v=0;v<nv;v++){if(!cur_sy.voices[v])
continue
p_voice=voice_tb[v];p_voice.second=cur_sy.voices[v].second;p_voice.last_sym=p_voice.sym;st=cur_sy.voices[v].st
while(st<nstaff&&!cur_sy.st_print[st])
st++;p_voice.st=st}
last_s=tsfirst
while(last_s&&last_s.type==C.CLEF){v=last_s.v
if(cur_sy.voices[v]&&!cur_sy.voices[v].second){delete last_s.clef_small;p_voice=last_s.p_v;p_voice.last_sym=p_voice.sym=last_s}
last_s=last_s.ts_next}
for(v=0;v<nv;v++){p_voice=voice_tb[v]
if(p_voice.sym&&p_voice.sym.type==C.CLEF)
continue
if(!cur_sy.voices[v]||(cur_sy.voices[v].second&&!p_voice.bar_start))
continue
st=cur_sy.voices[v].st
if(!staff_tb[st]||!staff_tb[st].clef)
continue
s=clone(staff_tb[st].clef);s.v=v;s.p_v=p_voice;s.st=st;s.time=tsfirst.time;s.prev=null;s.next=p_voice.sym
if(s.next)
s.next.prev=s;p_voice.sym=s;p_voice.last_sym=s;s.ts_next=last_s;if(last_s)
s.ts_prev=last_s.ts_prev
else
s.ts_prev=null
if(!s.ts_prev){tsfirst=s;s.seqst=true}else{s.ts_prev.ts_next=s
delete s.seqst}
if(last_s){last_s.ts_prev=s
if(last_s.type==C.CLEF)
delete last_s.seqst}
delete s.clef_small;s.second=cur_sy.voices[v].second
if(!cur_sy.st_print[st])
s.invis=true}
for(v=0;v<nv;v++){if(!cur_sy.voices[v]||cur_sy.voices[v].second||!cur_sy.st_print[cur_sy.voices[v].st])
continue
p_voice=voice_tb[v]
if(last_s&&last_s.v==v&&last_s.type==C.KEY){p_voice.last_sym=last_s;last_s.k_old_sf=last_s.k_sf;last_s=last_s.ts_next
continue}
s2=p_voice.key
if(s2.k_sf||s2.k_a_acc){s=new_sym(C.KEY,p_voice,last_s);s.k_sf=s2.k_sf;s.k_mode=s2.k_mode;s.k_old_sf=s2.k_sf;s.k_a_acc=s2.k_a_acc;s.istart=s2.istart;s.iend=s2.iend
if(s2.k_bagpipe){s.k_bagpipe=s2.k_bagpipe
if(s.k_bagpipe=='p')
s.k_old_sf=3}}}
if(insert_meter&1){for(v=0;v<nv;v++){p_voice=voice_tb[v];s2=p_voice.meter
if(!cur_sy.voices[v]||cur_sy.voices[v].second||!cur_sy.st_print[cur_sy.voices[v].st]||s2.a_meter.length==0)
continue
if(last_s&&last_s.v==v&&last_s.type==C.METER){p_voice.last_sym=last_s;last_s=last_s.ts_next
continue}
s=new_sym(C.METER,p_voice,last_s);s.istart=s2.istart;s.iend=s2.iend;s.wmeasure=s2.wmeasure;s.a_meter=s2.a_meter}
insert_meter&=~1}
for(v=0;v<nv;v++){p_voice=voice_tb[v]
if(p_voice.sls.length){s=new_sym(C.BAR,p_voice,last_s);s.bar_type="|";s.dur=0;s.multi=0;s.invis=true;s.sls=p_voice.sls;p_voice.sls=[]}}
for(v=0;v<nv;v++){p_voice=voice_tb[v];s2=p_voice.bar_start;p_voice.bar_start=null
if(last_s&&last_s.v==v&&last_s.type==C.BAR){p_voice.last_sym=last_s;last_s=last_s.ts_next
continue}
if(!s2)
continue
if(!cur_sy.voices[v]||!cur_sy.st_print[cur_sy.voices[v].st])
continue
s2.next=p_voice.last_sym.next
if(s2.next)
s2.next.prev=s2;p_voice.last_sym.next=s2;s2.prev=p_voice.last_sym;p_voice.last_sym=s2;lktsym(s2,last_s);s2.time=tsfirst.time
if(s2.ts_prev.type!=s2.type)
s2.seqst=true;if(last_s&&last_s.type==s2.type&&s2.v!=last_s.v){delete last_s.seqst}}
self.set_pitch(last_s);s=tsfirst
while(1){s2=s;shrmx=0
do{self.set_width(s);shr=s.wl
if(s.prev)
shr+=s.prev.wr
if(shr>shrmx)
shrmx=shr;s=s.ts_next}while(s!=last_s&&!s.seqst);s2.shrink=shrmx;s2.space=0
if(s==last_s)
break}
shr=0
do{self.set_width(s)
if(shr<s.wl)
shr=s.wl;s=s.ts_next}while(s&&!s.seqst);last_s.shrink=s2.wr+shr
last_s.space=0}
function set_words(p_voice){var s,s2,nflags,lastnote,res,start_flag=true,pitch=127
for(s=p_voice.sym;s;s=s.next){if(s.type==C.NOTE){pitch=s.notes[0].pit
break}}
for(s=p_voice.sym;s;s=s.next){switch(s.type){case C.MREST:start_flag=true
break
case C.BAR:s.bar_type=bar_cnv(s.bar_type)
if(!s.beam_on)
start_flag=true
if(!s.next&&s.prev&&s.prev.head==C.OVALBARS)
s.prev.head=C.SQUARE
break
case C.GRACE:for(s2=s.extra;s2;s2=s2.next)
sort_pitch(s2)
break
case C.NOTE:case C.REST:res=identify_note(s,s.dur_orig);s.head=res[0];s.dots=res[1];s.nflags=res[2]
if(s.nflags<=-2)
s.stemless=true
if(s.xstem)
s.nflags=0
if(s.trem1){if(s.nflags>0)
s.nflags+=s.ntrem
else
s.nflags=s.ntrem}
if(s.next&&s.next.trem2)
break
if(s.trem2){s.prev.trem2=true;s.prev.nflags=--s.nflags;s.prev.head=++s.head
if(s.nflags>0){s.nflags+=s.ntrem}else{if(s.nflags<=-2){s.stemless=true;s.prev.stemless=true}
s.nflags=s.ntrem}
s.prev.nflags=s.nflags
break}
nflags=s.nflags
if(s.ntrem)
nflags+=s.ntrem
if(s.type==C.REST&&s.beam_end){s.beam_end=false;start_flag=true}
if(start_flag||nflags<=0){if(lastnote){lastnote.beam_end=true;lastnote=null}
if(nflags<=0){s.beam_st=true;s.beam_end=true}else if(s.type==C.NOTE){s.beam_st=true;start_flag=false}}
if(s.beam_end)
start_flag=true
if(s.type==C.NOTE)
lastnote=s
break}
if(s.type==C.NOTE){if(s.nhd!=0)
sort_pitch(s);pitch=s.notes[0].pit
for(s2=s.prev;s2;s2=s2.prev){if(s2.type!=C.REST)
break
s2.notes[0].pit=pitch}}else{if(!s.notes){s.notes=[]
s.notes[0]={}
s.nhd=0}
s.notes[0].pit=pitch}}
if(lastnote)
lastnote.beam_end=true}
function set_rb(p_voice){var s2,n,s=p_voice.sym
while(s){if(s.type!=C.BAR||!s.rbstart||s.norepbra){s=s.next
continue}
n=0;s2=null
for(s=s.next;s;s=s.next){if(s.type!=C.BAR)
continue
n++
if(s.rbstop)
break
if(!s.next){s.rbstop=2
break}
if(n==cfmt.rbmin)
s2=s
if(n==cfmt.rbmax){if(s2)
s=s2;s.rbstop=1
break}}}}
var delpit=[0,-7,-14,0]
function set_global(){var p_voice,st,v,nv,sy
sy=cur_sy;st=sy.nstaff;while(1){sy=sy.next
if(!sy)
break
if(sy.nstaff>st)
st=sy.nstaff}
nstaff=st;nv=voice_tb.length
for(v=0;v<nv;v++){p_voice=voice_tb[v];set_words(p_voice)
set_rb(p_voice)}
set_float();if(glovar.ottava&&cfmt.sound!="play")
set_ottava();set_clefs();self.set_pitch(null)}
function set_indent(first){var st,v,w,p_voice,p,i,j,font,nv=voice_tb.length,maxw=0
for(v=0;v<nv;v++){p_voice=voice_tb[v]
if(!cur_sy.voices[v])
continue
st=cur_sy.voices[v].st
p=((first||p_voice.new_name)&&p_voice.nm)?p_voice.nm:p_voice.snm
if(!p)
continue
if(!font){set_font("voice");font=gene.curfont}
i=0
while(1){j=p.indexOf("\\n",i)
if(j<0)
w=strwh(p.slice(i))
else
w=strwh(p.slice(i,j))
w=w[0]
if(w>maxw)
maxw=w
if(j<0)
break
i=j+1}}
if(font)
maxw+=4*cwidf(' ');w=.5
for(st=0;st<=cur_sy.nstaff;st++){if(cur_sy.staves[st].flags&(OPEN_BRACE2|OPEN_BRACKET2)){w=12
break}
if(cur_sy.staves[st].flags&(OPEN_BRACE|OPEN_BRACKET))
w=6}
maxw+=w
if(first)
maxw+=cfmt.indent
return maxw}
function set_beams(sym){var s,t,g,beam,s_opp,dy,avg,n,m,mid_p,pu,pd,laststem=-1
for(s=sym;s;s=s.next){if(s.type!=C.NOTE){if(s.type!=C.GRACE)
continue
g=s.extra
if(g.stem==2){s_opp=s
continue}
if(!s.stem&&(s.stem=s.multi)==0)
s.stem=1
for(;g;g=g.next){g.stem=s.stem;g.multi=s.multi}
continue}
if(!s.stem&&(s.stem=s.multi)==0){mid_p=s.mid/3+18
if(beam){s.stem=laststem}else if(s.beam_st&&!s.beam_end){beam=true;pu=s.notes[s.nhd].pit;pd=s.notes[0].pit
for(g=s.next;g;g=g.next){if(g.type!=C.NOTE)
continue
if(g.stem||g.multi){s.stem=g.stem||g.multi
break}
if(g.notes[g.nhd].pit>pu)
pu=g.notes[g.nhd].pit
if(g.notes[0].pit<pd)
pd=g.notes[0].pit
if(g.beam_end)
break}
if(g.beam_end){if((pu+pd)/2<mid_p){s.stem=1}else if((pu+pd)/2>mid_p){s.stem=-1}else{if(cfmt.bstemdown)
s.stem=-1}}
if(!s.stem)
s.stem=laststem}else{n=(s.notes[s.nhd].pit+s.notes[0].pit)/2
if(n==mid_p){n=0
for(m=0;m<=s.nhd;m++)
n+=s.notes[m].pit;n/=(s.nhd+1)}
if(n<mid_p)
s.stem=1
else if(n>mid_p)
s.stem=-1
else if(cfmt.bstemdown)
s.stem=-1
else
s.stem=laststem}}else{if(s.beam_st&&!s.beam_end)
beam=true}
if(s.beam_end)
beam=false;laststem=s.stem;if(s_opp){for(g=s_opp.extra;g;g=g.next)
g.stem=-laststem;s_opp.stem=-laststem;s_opp=null}}}
function same_head(s1,s2){var i1,i2,l1,l2,head,i11,i12,i21,i22,sh1,sh2
if(s1.shiftunison&&s1.shiftunison>=3)
return false
if((l1=s1.dur)>=C.BLEN)
return false
if((l2=s2.dur)>=C.BLEN)
return false
if(s1.stemless&&s2.stemless)
return false
if(s1.dots!=s2.dots){if((s1.shiftunison&&(s1.shiftunison&1))||s1.dots*s2.dots!=0)
return false}
if(s1.stem*s2.stem>0)
return false
i1=i2=0
if(s1.notes[0].pit>s2.notes[0].pit){if(s1.stem<0)
return false
while(s2.notes[i2].pit!=s1.notes[0].pit){if(++i2>s2.nhd)
return false}}else if(s1.notes[0].pit<s2.notes[0].pit){if(s2.stem<0)
return false
while(s2.notes[0].pit!=s1.notes[i1].pit){if(++i1>s1.nhd)
return false}}
if(s2.notes[i2].acc!=s1.notes[i1].acc)
return false;i11=i1;i21=i2;sh1=s1.notes[i1].shhd;sh2=s2.notes[i2].shhd
do{i1++;i2++
if(i1>s1.nhd){break}
if(i2>s2.nhd){break}
if(s2.notes[i2].acc!=s1.notes[i1].acc)
return false
if(sh1<s1.notes[i1].shhd)
sh1=s1.notes[i1].shhd
if(sh2<s2.notes[i2].shhd)
sh2=s2.notes[i2].shhd}while(s2.notes[i2].pit==s1.notes[i1].pit)
if(i1<=s1.nhd){if(i2<=s2.nhd)
return false
if(s2.stem>0)
return false}else if(i2<=s2.nhd){if(s1.stem>0)
return false}
i12=i1;i22=i2;head=0
if(l1!=l2){if(l1<l2){l1=l2;l2=s1.dur}
if(l1<C.BLEN/2){if(s2.dots)
head=2
else if(s1.dots)
head=1}else if(l2<C.BLEN/4){if(s1.shiftunison&&(s1.shiftunison&2))
return false
head=s2.dur>=C.BLEN/2?2:1}else{return false}}
if(head==0)
head=s1.p_v.scale<s2.p_v.scale?2:1
if(head==1){for(i2=i21;i2<i22;i2++){s2.notes[i2].invis=true
delete s2.notes[i2].acc}
for(i2=0;i2<=s2.nhd;i2++)
s2.notes[i2].shhd+=sh1}else{for(i1=i11;i1<i12;i1++){s1.notes[i1].invis=true
delete s1.notes[i1].acc}
for(i1=0;i1<=s1.nhd;i1++)
s1.notes[i1].shhd+=sh2}
return true}
function unison_acc(s1,s2,i1,i2){var m,d
if(!s2.notes[i2].acc){d=w_note[s2.head]*2+s2.xmx+s1.notes[i1].shac+2
if(s1.notes[i1].micro)
d+=2
if(s2.dots)
d+=6
for(m=0;m<=s1.nhd;m++){s1.notes[m].shhd+=d;s1.notes[m].shac-=d}
s1.xmx+=d}else{d=w_note[s1.head]*2+s1.xmx+s2.notes[i2].shac+2
if(s2.notes[i2].micro)
d+=2
if(s1.dots)
d+=6
for(m=0;m<=s2.nhd;m++){s2.notes[m].shhd+=d;s2.notes[m].shac-=d}
s2.xmx+=d}}
var MAXPIT=48*2
function set_left(s){var m,i,j,shift,w_base=w_note[s.head],w=w_base,left=[]
for(i=0;i<MAXPIT;i++)
left.push(-100)
if(s.nflags>-2){if(s.stem>0){w=-w;i=s.notes[0].pit*2;j=(Math.ceil((s.ymx-2)/3)+18)*2}else{i=(Math.ceil((s.ymn+2)/3)+18)*2;j=s.notes[s.nhd].pit*2}
if(i<0)
i=0
if(j>=MAXPIT)
j=MAXPIT-1
while(i<=j)
left[i++]=w}
shift=s.notes[s.stem>0?0:s.nhd].shhd;for(m=0;m<=s.nhd;m++){w=-s.notes[m].shhd+w_base+shift;i=s.notes[m].pit*2
if(i<0)
i=0
else if(i>=MAXPIT-1)
i=MAXPIT-2
if(w>left[i])
left[i]=w
if(s.head!=C.SQUARE)
w-=1
if(w>left[i-1])
left[i-1]=w
if(w>left[i+1])
left[i+1]=w}
return left}
function set_right(s){var m,i,j,k,shift,w_base=w_note[s.head],w=w_base,flags=s.nflags>0&&s.beam_st&&s.beam_end,right=[]
for(i=0;i<MAXPIT;i++)
right.push(-100)
if(s.nflags>-2){if(s.stem<0){w=-w;i=(Math.ceil((s.ymn+2)/3)+18)*2;j=s.notes[s.nhd].pit*2;k=i+4}else{i=s.notes[0].pit*2;j=(Math.ceil((s.ymx-2)/3)+18)*2}
if(i<0)
i=0
if(j>MAXPIT)
j=MAXPIT
while(i<j)
right[i++]=w}
if(flags){if(s.stem>0){if(s.xmx==0)
i=s.notes[s.nhd].pit*2
else
i=s.notes[0].pit*2;i+=4
if(i<0)
i=0
for(;i<MAXPIT&&i<=j-4;i++)
right[i]=11}else{i=k
if(i<0)
i=0
for(;i<MAXPIT&&i<=s.notes[0].pit*2-4;i++)
right[i]=3.5}}
shift=s.notes[s.stem>0?0:s.nhd].shhd
for(m=0;m<=s.nhd;m++){w=s.notes[m].shhd+w_base-shift;i=s.notes[m].pit*2
if(i<0)
i=0
else if(i>=MAXPIT-1)
i=MAXPIT-2
if(w>right[i])
right[i]=w
if(s.head!=C.SQUARE)
w-=1
if(w>right[i-1])
right[i-1]=w
if(w>right[i+1])
right[i+1]=w}
return right}
function set_overlap(){var s,s1,s2,s3,i,i1,i2,m,sd,t,dp,d,d2,dr,dr2,dx,left1,right1,left2,right2,right3,pl,pr,sy=cur_sy
function v_invert(){s1=s2;s2=s;d=d2;pl=left1;pr=right1;dr2=dr}
for(s=tsfirst;s;s=s.ts_next){if(s.type!=C.NOTE||s.invis){if(s.type==C.STAVES)
sy=s.sy
continue}
if(s.xstem&&s.ts_prev.stem<0){for(m=0;m<=s.nhd;m++){s.notes[m].shhd-=7;s.notes[m].shac+=16}}
s2=s
while(1){s2=s2.ts_next
if(!s2)
break
if(s2.time!=s.time){s2=null
break}
if(s2.type==C.NOTE&&!s2.invis&&s2.st==s.st)
break}
if(!s2)
continue
s1=s
if(sy.voices[s1.v].range<sy.voices[s2.v].range)
s2.dot_low=true
else
s1.dot_low=true
if(s1.ymn>s2.ymx||s1.ymx<s2.ymn)
continue
if(same_head(s1,s2))
continue
if(!s1.dots&&!s2.dots)
if((s1.stem>0&&s2.stem<0&&s1.notes[0].pit==s2.notes[s2.nhd].pit+1)||(s1.stem<0&&s2.stem>0&&s1.notes[s1.nhd].pit+1==s2.notes[0].pit)){if(s1.stem<0){s1=s2;s2=s}
d=s1.notes[0].shhd+7
for(m=0;m<=s2.nhd;m++)
s2.notes[m].shhd+=d
s2.xmx+=d
s1.xmx=s2.xmx
continue}
right1=set_right(s1);left2=set_left(s2);s3=s1.ts_prev
if(s3&&s3.time==s1.time&&s3.st==s1.st&&s3.type==C.NOTE&&!s3.invis){right3=set_right(s3)
for(i=0;i<MAXPIT;i++){if(right3[i]>right1[i])
right1[i]=right3[i]}}else{s3=null}
d=-10
for(i=0;i<MAXPIT;i++){if(left2[i]+right1[i]>d)
d=left2[i]+right1[i]}
if(d<-3){if(!s1.dots||!s2.dots||!s2.dot_low||s1.stem>0||s2.stem<0||s1.notes[s1.nhd].pit+2!=s2.notes[0].pit||(s2.notes[0].pit&1))
continue}
right2=set_right(s2);left1=set_left(s1)
if(s3){right3=set_left(s3)
for(i=0;i<MAXPIT;i++){if(right3[i]>left1[i])
left1[i]=right3[i]}}
d2=dr=dr2=-100
for(i=0;i<MAXPIT;i++){if(left1[i]+right2[i]>d2)
d2=left1[i]+right2[i]
if(right2[i]>dr2)
dr2=right2[i]
if(right1[i]>dr)
dr=right1[i]}
t=0;i1=s1.nhd;i2=s2.nhd
while(1){dp=s1.notes[i1].pit-s2.notes[i2].pit
switch(dp){case 0:if(s1.notes[i1].acc!=s2.notes[i2].acc&&!s1.notes[i1].acc&&!s2.notes[i2].acc){t=-1
break}
if(s2.notes[i2].acc){if(!s1.notes[i1].acc)
s1.notes[i1].acc=s2.notes[i2].acc
s2.notes[i2].acc=0}
if(s1.dots&&s2.dots&&(s1.notes[i1].pit&1))
t=1
break
case-1:if(s1.dots&&s2.dots){if(s1.notes[i1].pit&1){s1.dot_low=false;s2.dot_low=false}else{s1.dot_low=true;s2.dot_low=true}}
break
case-2:if(s1.dots&&s2.dots&&!(s1.notes[i1].pit&1)){s1.dot_low=false;s2.dot_low=false
break}
break}
if(t<0)
break
if(dp>=0){if(--i1<0)
break}
if(dp<=0){if(--i2<0)
break}}
if(t<0){unison_acc(s1,s2,i1,i2)
continue}
sd=0;if(s1.dots){if(s2.dots){if(!t)
sd=1}else{v_invert()}}else if(s2.dots){if(d2+dr<d+dr2)
sd=1}
pl=left2;pr=right2
if(!s3&&d2+dr<d+dr2)
v_invert()
d+=3
if(d<0)
d=0;m=s1.stem>=0?0:s1.nhd;d+=s1.notes[m].shhd;m=s2.stem>=0?0:s2.nhd;d-=s2.notes[m].shhd
if(s1.dots){dx=7.7+s1.xmx+
3.5*s1.dots-3.5+
3;if(!sd){d2=-100;for(i1=0;i1<=s1.nhd;i1++){i=s1.notes[i1].pit
if(!(i&1)){if(!s1.dot_low)
i++
else
i--}
i*=2
if(i<1)
i=1
else if(i>=MAXPIT-1)
i=MAXPIT-2
if(pl[i]>d2)
d2=pl[i]
if(pl[i-1]+1>d2)
d2=pl[i-1]+1
if(pl[i+1]+1>d2)
d2=pl[i+1]+1}
if(dx+d2+2>d)
d=dx+d2+2}else{if(dx<d+dr2+s2.xmx){d2=0
for(i1=0;i1<=s1.nhd;i1++){i=s1.notes[i1].pit
if(!(i&1)){if(!s1.dot_low)
i++
else
i--}
i*=2
if(i<1)
i=1
else if(i>=MAXPIT-1)
i=MAXPIT-2
if(pr[i]>d2)
d2=pr[i]
if(pr[i-1]+1>d2)
d2=pr[i-1]=1
if(pr[i+1]+1>d2)
d2=pr[i+1]+1}
if(d2>4.5&&7.7+s1.xmx+2<d+d2+s2.xmx)
s2.xmx=d2+3-7.7}}}
for(m=s2.nhd;m>=0;m--){s2.notes[m].shhd+=d}
s2.xmx+=d
if(sd)
s1.xmx=s2.xmx}}
Abc.prototype.set_stems=function(){var s,s2,g,slen,scale,ymn,ymx,nflags,ymin,ymax,res
for(s=tsfirst;s;s=s.ts_next){if(s.type!=C.NOTE){if(s.type!=C.GRACE)
continue
ymin=ymax=s.mid
for(g=s.extra;g;g=g.next){res=identify_note(s,g.dur);g.head=res[0];g.dots=res[1];g.nflags=res[2];slen=GSTEM
if(g.nflags>1)
slen+=1.2*(g.nflags-1);ymn=3*(g.notes[0].pit-18);ymx=3*(g.notes[g.nhd].pit-18)
if(s.stem>=0){g.y=ymn;g.ys=ymx+slen;ymx=Math.round(g.ys)}else{g.y=ymx;g.ys=ymn-slen;ymn=Math.round(g.ys)}
ymx+=2;ymn-=2
if(ymn<ymin)
ymin=ymn
else if(ymx>ymax)
ymax=ymx;g.ymx=ymx;g.ymn=ymn}
s.ymx=ymax;s.ymn=ymin
continue}
set_head_shift(s);nflags=s.nflags
if(s.beam_st&&!s.beam_end){if(s.feathered_beam)
nflags=++s.nflags
for(s2=s.next;;s2=s2.next){if(s2.type==C.NOTE){if(s.feathered_beam)
s2.nflags++
if(s2.beam_end)
break}}
if(s2.nflags>nflags)
nflags=s2.nflags}else if(!s.beam_st&&s.beam_end){for(s2=s.prev;;s2=s2.prev){if(s2.beam_st)
break}
if(s2.nflags>nflags)
nflags=s2.nflags}
slen=cfmt.stemheight
switch(nflags){case 2:slen+=0;break
case 3:slen+=4;break
case 4:slen+=8;break
case 5:slen+=12;break}
if((scale=s.p_v.scale)!=1)
slen*=(scale+1)*.5;ymn=3*(s.notes[0].pit-18)
if(s.nhd>0){slen-=2;ymx=3*(s.notes[s.nhd].pit-18)}else{ymx=ymn}
if(s.ntrem)
slen+=2*s.ntrem
if(s.stemless){if(s.stem>=0){s.y=ymn;s.ys=ymx}else{s.ys=ymn;s.y=ymx}
if(nflags==-4)
ymn-=6;s.ymx=ymx+4;s.ymn=ymn-4}else if(s.stem>=0){if(s.notes[s.nhd].pit>26&&(nflags<=0||!s.beam_st||!s.beam_end)){slen-=2
if(s.notes[s.nhd].pit>28)
slen-=2}
s.y=ymn
if(s.notes[0].tie)
ymn-=3;s.ymn=ymn-4;s.ys=ymx+slen
if(s.ys<s.mid)
s.ys=s.mid;s.ymx=(s.ys+2.5)|0}else{if(s.notes[0].pit<18&&(nflags<=0||!s.beam_st||!s.beam_end)){slen-=2
if(s.notes[0].pit<16)
slen-=2}
s.ys=ymn-slen
if(s.ys>s.mid)
s.ys=s.mid;s.ymn=(s.ys-2.5)|0;s.y=ymx
if(s.notes[s.nhd].tie)
ymx+=3;s.ymx=ymx+4}}}
function check_bar(s){var bar_type,i,b1,b2,s_bs,s2,p_voice=s.p_v
while(s.type==C.CLEF||s.type==C.KEY||s.type==C.METER){if(s.type==C.METER&&s.time>p_voice.sym.time)
insert_meter|=1;s=s.prev
if(!s)
return}
if(s.type!=C.BAR)
return
if(s.text!=undefined){p_voice.bar_start=clone(s);p_voice.bar_start.bar_type=""
delete s.text
delete s.a_gch}
bar_type=s.bar_type
if(bar_type==":")
return
if(bar_type.slice(-1)!=':')
return
s2=p_voice.s_next
while(1){switch(s2.type){case C.BAR:case C.GRACE:case C.NOTE:case C.REST:break
default:s2=s2.next
if(!s2)
return}
break}
if(s2.type==C.BAR){s_bs=s2}else{s_bs=clone(s)
s_bs.next=s2
s_bs.prev=s2.prev
if(s2==p_voice.s_next)
p_voice.s_next=s_bs
else
s2.prev.next=s_bs
s2.prev=s_bs
while(!s2.seqst)
s2=s2.ts_prev
s_bs.ts_next=s2
s_bs.ts_prev=s2.ts_prev
if(s2==tsnext)
tsnext=s_bs
else
s2.ts_prev.ts_next=s_bs
s2.ts_prev=s_bs
delete s_bs.seqst
if(s_bs==tsnext||s2.ts_prev.type!=C.BAR){if(s2.seqst){s_bs.seqst=true}else{s2.seqst=true
s2.shrink=s_bs.wr+s2.wl
s2.space=0}}}
if(bar_type[0]!=':'){if(bar_type=="||:"){s_bs.bar_type="[|:"
s.bar_type="||"
return true}
s_bs.bar_type=bar_type
if(s.prev&&s.prev.type==C.BAR)
unlksym(s)
else
s.bar_type="|"
return}
i=0
while(bar_type[i]==':')
i++
if(i<bar_type.length){s.bar_type=bar_type.slice(0,i)+'|]';i=bar_type.length-1
while(bar_type[i]==':')
i--;s_bs.bar_type='[|'+bar_type.slice(i+1)}else{i=(bar_type.length/2)|0;s.bar_type=bar_type.slice(0,i)+'|]';s_bs.bar_type='[|'+bar_type.slice(i)}
return true}
function sym_staff_move(st){for(var s=tsfirst;s;s=s.ts_next){if(s.nl)
break
if(s.st==st&&s.type!=C.CLEF){s.st++;s.invis=true}}}
var blocks=[]
function block_gen(s){switch(s.subtype){case"leftmargin":case"rightmargin":case"pagescale":case"pagewidth":case"scale":case"staffwidth":svg_flush();self.set_format(s.subtype,s.param)
break
case"ml":svg_flush();user.img_out(s.text)
break
case"newpage":blk_flush();block.newpage=true;blk_out()
break
case"sep":set_page();vskip(s.sk1);output+='<path class="stroke"\n\td="M';out_sxsy((img.width-s.l)/2-img.lm,' ',0)
output+='h'+s.l.toFixed(1)+'"/>\n';vskip(s.sk2);break
case"text":write_text(s.text,s.opt)
break
case"title":write_title(s.text,true)
break
case"vskip":vskip(s.sk);break
default:return true}}
function set_piece(){var s,last,p_voice,st,v,nst,nv,tmp,non_empty=[],non_empty_gl=[],sy=cur_sy
function reset_staff(st){var p_staff=staff_tb[st],sy_staff=sy.staves[st]
if(!p_staff)
p_staff=staff_tb[st]={}
p_staff.y=0;p_staff.stafflines=sy_staff.stafflines;p_staff.staffscale=sy_staff.staffscale;p_staff.ann_top=p_staff.ann_bot=0}
function set_brace(){var st,i,empty_fl,n=sy.staves.length
for(st=0;st<n;st++){if(!(sy.staves[st].flags&(OPEN_BRACE|OPEN_BRACE2)))
continue
empty_fl=0;i=st
while(st<n){empty_fl|=non_empty[st]?1:2
if(sy.staves[st].flags&(CLOSE_BRACE|CLOSE_BRACE2))
break
st++}
if(empty_fl==3){while(i<=st){non_empty[i]=true;non_empty_gl[i++]=true}}}}
function set_top_bot(){var st,p_staff,i,j,l
for(st=0;st<=nstaff;st++){p_staff=staff_tb[st]
if(!non_empty_gl[st]){p_staff.botbar=p_staff.topbar=0
continue}
l=p_staff.stafflines.length;p_staff.topbar=6*(l-1)
for(i=0;i<l-1;i++){switch(p_staff.stafflines[i]){case'.':case'-':continue}
break}
p_staff.botline=p_staff.botbar=i*6
if(i>=l-2){if(p_staff.stafflines[i]!='.'){p_staff.botbar-=6;p_staff.topbar+=6}else{p_staff.botbar-=12;p_staff.topbar+=12
continue}}
p_staff.hll=17+i;p_staff.hlmap=new Int8Array(new Array((l-i+1)*2))
for(j=1;i<l;i++,j+=2){switch(p_staff.stafflines[i]){case'|':case'[':p_staff.hlmap[j-1]=1;p_staff.hlmap[j]=1;p_staff.hlmap[j+1]=1
break}}}}
nstaff=nst=sy.nstaff
for(st=0;st<=nst;st++)
reset_staff(st);for(s=tsfirst;s;s=s.ts_next){if(s.nl){break}
if(!s.ts_next)
last=s
switch(s.type){case C.STAVES:set_brace();sy.st_print=new Uint8Array(non_empty);sy=s.sy;nst=sy.nstaff
if(nstaff<nst){for(st=nstaff+1;st<=nst;st++)
reset_staff(st);nstaff=nst}
non_empty=[]
continue
case C.BLOCK:blocks.push(s);continue}
st=s.st
if(non_empty[st])
continue
switch(s.type){default:continue
case C.CLEF:if(st>nstaff){staff_tb[st].clef=s;unlksym(s)}
continue
case C.BAR:if(s.bar_mrep||sy.staves[st].staffnonote>1)
break
continue
case C.GRACE:break
case C.NOTE:case C.REST:case C.SPACE:case C.MREST:if(sy.staves[st].staffnonote>1)
break
if(s.invis)
continue
if(sy.staves[st].staffnonote!=0||s.type==C.NOTE)
break
continue}
non_empty_gl[st]=non_empty[st]=true}
tsnext=s;set_brace()
sy.st_print=new Uint8Array(non_empty);set_top_bot()
for(st=0;st<nstaff;st++){if(!non_empty_gl[st])
sym_staff_move(st)}
if(!non_empty_gl[nstaff])
staff_tb[nstaff].topbar=0;init_music_line();gene.st_print=new Uint8Array(non_empty_gl)
if(tsnext){s=tsnext;delete s.nl;last=s.ts_prev;last.ts_next=null;nv=voice_tb.length
for(v=0;v<nv;v++){p_voice=voice_tb[v]
if(p_voice.sym&&p_voice.sym.time<=tsnext.time){for(s=tsnext.ts_prev;s;s=s.ts_prev){if(s.v==v){p_voice.s_next=s.next;s.next=null;if(check_bar(s)){tmp=s.wl;self.set_width(s);s.shrink+=s.wl-tmp}
break}}
if(s)
continue}
p_voice.s_next=p_voice.sym;p_voice.sym=null}}
if(last.type!=C.BAR){s=add_end_bar(last);s.space=set_space(s)
if(s.space<s.shrink&&last.type!=C.KEY)
s.space=s.shrink}}
Abc.prototype.set_sym_glue=function(width){var s,g,ll,some_grace,spf,xmin=0,xx=0,x=0,xs=0,xse=0
for(s=tsfirst;s;s=s.ts_next){if(s.type==C.GRACE&&!some_grace)
some_grace=s
if(s.seqst){xmin+=s.shrink
if(s.space){if(s.space<s.shrink){xse+=s.shrink;xx+=s.shrink}else{xx+=s.space}}else{xs+=s.shrink}}}
if(xx==0){realwidth=0
return}
ll=!tsnext||tsnext.type==C.BLOCK||blocks.length
if(xmin>=width){if(xmin>width)
error(1,s,"Line too much shrunk $1 $2 $3",xmin.toFixed(1),xx.toFixed(1),width.toFixed(1));x=0
for(s=tsfirst;s;s=s.ts_next){if(s.seqst)
x+=s.shrink;s.x=x}
spf_last=0}else if((ll&&xx+xs>width*(1-cfmt.stretchlast))||(!ll&&(xx+xs>width||cfmt.stretchstaff))){if(xx==xse)
xx+=5
for(var cnt=4;--cnt>=0;){spf=(width-xs-xse)/(xx-xse);xx=0;xse=0;x=0
for(s=tsfirst;s;s=s.ts_next){if(s.seqst){if(s.space){if(s.space*spf<=s.shrink){xse+=s.shrink;xx+=s.shrink;x+=s.shrink}else{xx+=s.space;x+=s.space*spf}}else{x+=s.shrink}}
s.x=x}
if(Math.abs(x-width)<0.1)
break}
spf_last=spf}else{spf=(width-xs-xse)/xx
if(spf_last<spf)
spf=spf_last
for(s=tsfirst;s;s=s.ts_next){if(s.seqst)
x+=s.space*spf<=s.shrink?s.shrink:s.space*spf
s.x=x}}
realwidth=x
for(s=some_grace;s;s=s.ts_next){if(s.type!=C.GRACE)
continue
if(s.gr_shift)
x=s.prev.x+s.prev.wr
else
x=s.x-s.wl
for(g=s.extra;g;g=g.next)
g.x+=x}}
function set_sym_line(){var p_v,s,v=voice_tb.length
while(--v>=0){p_v=voice_tb[v]
if(p_v.s_prev)
p_v.sym.prev=p_v.s_prev
s=p_v.s_next
p_v.sym=s
if(s){if(s.prev)
s.prev.next=s
p_v.s_prev=s.prev
s.prev=null}}}
function set_posx(){posx=img.lm/cfmt.scale}
function gen_init(){var s=tsfirst,tim=s.time
for(;s;s=s.ts_next){if(s.time!=tim){set_page()
return}
switch(s.type){case C.NOTE:case C.REST:case C.MREST:set_page()
return
default:continue
case C.STAVES:cur_sy=s.sy
break
case C.BLOCK:if(block_gen(s))
continue
break}
unlksym(s)
if(s.p_v.s_next==s)
s.p_v.s_next=s.next}
tsfirst=null}
Abc.prototype.output_music=function(){var v,lwidth,indent,line_height,ts1st,tslast,p_v
gen_init()
if(!tsfirst)
return
set_global()
if(voice_tb.length>1)
self.set_stem_dir()
for(v=0;v<voice_tb.length;v++)
set_beams(voice_tb[v].sym);self.set_stems()
if(voice_tb.length>1){set_rest_offset();set_overlap()}
set_acc_shft();set_allsymwidth();indent=set_indent(true)
if(cfmt.singleline){v=get_ck_width();lwidth=indent+v[0]+v[1]+get_width(tsfirst,null)[0];img.width=lwidth*cfmt.scale+img.lm+img.rm+2}else{lwidth=get_lwidth();cut_tune(lwidth,indent)}
ts1st=tsfirst
v=voice_tb.length
while(--v>=0)
voice_tb[v].osym=voice_tb[v].sym
spf_last=1.2
while(1){set_piece();self.set_sym_glue(lwidth-indent)
if(realwidth!=0){if(indent!=0)
posx+=indent;draw_sym_near();line_height=set_staff();draw_systems(indent);draw_all_sym();delayed_update();vskip(line_height)
if(indent!=0){posx-=indent;insert_meter&=~2}
while(blocks.length!=0)
block_gen(blocks.shift())}
if(cfmt.splittune)
blk_flush()
else
svg_flush()
if(tslast)
tslast.ts_next.ts_prev=tslast
if(!tsnext)
break
tsnext.ts_prev.ts_next=tsfirst=tsnext
gen_init()
if(!tsfirst)
break
tslast=tsfirst.ts_prev
tsfirst.ts_prev=null;set_sym_line();lwidth=get_lwidth()
indent=set_indent()}
tsfirst=ts1st
v=voice_tb.length
while(--v>=0){p_v=voice_tb[v]
p_v.sym=p_v.osym}}
function reset_gen(){insert_meter=cfmt.writefields.indexOf('M')>=0?3:2}
var a_gch,a_dcn,multicol,maps={}
var qplet_tb=new Int8Array([0,1,3,2,3,0,2,0,3,0]),ntb="CDEFGABcdefgab"
function set_ref(s){s.fname=parse.fname;s.istart=parse.istart;s.iend=parse.iend}
function new_clef(clef_def){var s={type:C.CLEF,clef_line:2,clef_type:"t",v:curvoice.v,p_v:curvoice,time:curvoice.time,dur:0},i=1
set_ref(s)
switch(clef_def[0]){case'"':i=clef_def.indexOf('"',1);s.clef_name=clef_def.slice(1,i);i++
break
case'a':if(clef_def[1]=='u'){s.clef_type="a";s.clef_auto=true;i=4
break}
i=4
case'C':s.clef_type="c";s.clef_line=3
break
case'b':i=4
case'F':s.clef_type="b";s.clef_line=4
break
case'n':i=4
s.invis=true
break
case't':if(clef_def[1]=='e'){s.clef_type="c";s.clef_line=4
break}
i=6
case'G':break
case'p':i=4
case'P':s.clef_type="p";s.clef_line=3;curvoice.key.k_sf=0;curvoice.ckey.k_drum=true
break
default:syntax(1,"Unknown clef '$1'",clef_def)
return}
if(clef_def[i]>='1'&&clef_def[i]<='9'){s.clef_line=Number(clef_def[i]);i++}
if(clef_def[i+1]!='8')
return s
switch(clef_def[i]){case'^':s.clef_oct_transp=true
case'+':s.clef_octave=7
break
case'_':s.clef_oct_transp=true
case'-':s.clef_octave=-7
break}
return s}
function get_interval(param,score){var i,val,tmp,note,pit
tmp=new scanBuf;tmp.buffer=param
pit=[]
for(i=0;i<2;i++){note=tmp.buffer[tmp.index]?parse_acc_pit(tmp):null
if(!note){if(i!=1||!score){syntax(1,"Bad transpose value")
return}
pit[i]=23}else{pit[i]=abc2svg.pab40(note.pit,note.acc)}}
return pit[1]-pit[0]}
function set_linebreak(param){var i,item
for(i=0;i<128;i++){if(char_tb[i]=="\n")
char_tb[i]=nil}
param=param.split(/\s+/)
for(i=0;i<param.length;i++){item=param[i]
switch(item){case'!':case'$':case'*':case';':case'?':case'@':break
case"<none>":continue
case"<EOL>":item='\n'
break
default:syntax(1,"Bad value '$1' in %%linebreak - ignored",item)
continue}
char_tb[item.charCodeAt(0)]='\n'}}
function set_user(parm){var k,c,v,a=parm.match(/(.*?)[= ]*([!"].*[!"])/)
if(!a){syntax(1,'Lack of starting ! or " in U: / %%user')
return}
c=a[1];v=a[2]
if(v.slice(-1)!=v[0]){syntax(1,"Lack of ending $1 in U:/%%user",v[0])
return}
if(c[0]=='\\'){if(c[1]=='t')
c='\t'
else if(!c[1])
c=' '}
k=c.charCodeAt(0)
if(k>=128){syntax(1,errs.not_ascii)
return}
switch(char_tb[k][0]){case'0':case'd':case'i':case' ':break
case'"':case'!':if(char_tb[k].length>1)
break
default:syntax(1,"Bad user character '$1'",c)
return}
switch(v){case"!beambreak!":v=" "
break
case"!ignore!":v="i"
break
case"!nil!":case"!none!":v="d"
break}
char_tb[k]=v}
function get_st_lines(param){if(!param)
return
if(/^[\]\[|.-]+$/.test(param))
return param.replace(/\]/g,'[')
var n=parseInt(param)
switch(n){case 0:return"..."
case 1:return"..|"
case 2:return".||"
case 3:return".|||"}
if(isNaN(n)||n<0||n>16)
return
return"||||||||||||||||".slice(0,n)}
function new_block(subtype){var s={type:C.BLOCK,subtype:subtype,dur:0}
if(parse.state==2)
goto_tune()
sym_link(s)
return s}
Abc.prototype.set_vp=function(a){var s,item,pos,val,clefpit
while(1){item=a.shift()
if(!item)
break
if(item[item.length-1]=='='&&a.length==0){syntax(1,errs.bad_val,item)
break}
switch(item){case"clef=":s=a.shift()
break
case"clefpitch=":item=a.shift()
if(item){val=ntb.indexOf(item[0])
if(val>=0){switch(item[1]){case"'":val+=7
break
case',':val-=7
if(item[2]==',')
val-=7
break}
clefpit=4-val
break}}
syntax(1,errs.bad_val,item)
break
case"octave=":case"uscale=":val=parseInt(a.shift())
if(isNaN(val))
syntax(1,errs.bad_val,item)
else
curvoice[item.slice(0,-1)]=val
break
case"cue=":curvoice.scale=a.shift()=='on'?.7:1
break
case"instrument=":item=a.shift()
val=item.indexOf('/')
if(val<0){val=0
curvoice.sndtran=get_interval('c'+item)}else{curvoice.sndtran=get_interval('c'+
item.slice(val+1))
val=get_interval(item.replace('/',''))}
curvoice.transp=cfmt.sound?curvoice.sndtran:val
break
case"map=":curvoice.map=a.shift()
break
case"name=":case"nm=":curvoice.nm=a.shift()
if(curvoice.nm[0]=='"')
curvoice.nm=curvoice.nm.slice(1,-1);curvoice.new_name=true
break
case"stem=":case"pos=":if(item=="pos=")
item=a.shift().split(' ')
else
item=["stm",a.shift()];val=posval[item[1]]
if(val==undefined){syntax(1,errs.bad_val,item[0])
break}
if(!pos)
pos={}
pos[item[0]]=val
break
case"scale=":val=parseFloat(a.shift())
if(isNaN(val)||val<.6||val>1.5)
syntax(1,errs.bad_val,"%%voicescale")
else
curvoice.scale=val
break
case"score=":item=a.shift()
if(cfmt.sound)
break
curvoice.transp=get_interval(item,'c')
break
case"shift=":curvoice.shift=curvoice.sndsh=get_interval(a.shift())
break
case"sound=":case"transpose=":curvoice.sndtran=get_interval(a.shift())
if(cfmt.sound)
curvoice.transp=curvoice.sndtran
break
case"subname=":case"sname=":case"snm=":curvoice.snm=a.shift()
if(curvoice.snm[0]=='"')
curvoice.snm=curvoice.snm.slice(1,-1);break
case"stafflines=":val=get_st_lines(a.shift())
if(val==undefined)
syntax(1,"Bad %%stafflines value")
else if(curvoice.st!=undefined)
par_sy.staves[curvoice.st].stafflines=val
else
curvoice.stafflines=val
break
case"staffnonote=":val=parseInt(a.shift())
if(isNaN(val))
syntax(1,"Bad %%staffnonote value")
else
curvoice.staffnonote=val
break
case"staffscale=":val=parseFloat(a.shift())
if(isNaN(val)||val<.3||val>2)
syntax(1,"Bad %%staffscale value")
else
curvoice.staffscale=val
break
default:switch(item.slice(0,4)){case"treb":case"bass":case"alto":case"teno":case"perc":s=item
break
default:if("GFC".indexOf(item[0])>=0)
s=item
else if(item.slice(-1)=='=')
a.shift()
break}
break}}
if(pos){curvoice.pos=clone(curvoice.pos)
for(item in pos)
if(pos.hasOwnProperty(item))
curvoice.pos[item]=pos[item]}
if(s){s=new_clef(s)
if(s){if(clefpit)
s.clefpit=clefpit
get_clef(s)}}}
function set_kv_parm(a){if(!curvoice.init){curvoice.init=true
if(info.V){if(info.V['*'])
a=info.V['*'].concat(a)
if(info.V[curvoice.id])
a=info.V[curvoice.id].concat(a)}}
if(a.length!=0)
self.set_vp(a)}
function memo_kv_parm(vid,a){if(a.length==0)
return
if(!info.V)
info.V={}
if(info.V[vid])
Array.prototype.push.apply(info.V[vid],a)
else
info.V[vid]=a}
function new_key(param){var i,clef,key_end,c,tmp,sf="FCGDAEB".indexOf(param[0])-1,mode=0,s={type:C.KEY,dur:0}
function set_k_acc(s,sf){var i,j,n,nacc,p_acc,accs=[],pits=[],m_n=[],m_d=[]
if(sf>0){for(nacc=0;nacc<sf;nacc++){accs[nacc]=1;pits[nacc]=[26,23,27,24,21,25,22][nacc]}}else{for(nacc=0;nacc<-sf;nacc++){accs[nacc]=-1;pits[nacc]=[22,25,21,24,20,23,26][nacc]}}
n=s.k_a_acc.length
for(i=0;i<n;i++){p_acc=s.k_a_acc[i]
for(j=0;j<nacc;j++){if(pits[j]==p_acc.pit){accs[j]=p_acc.acc
if(p_acc.micro_n){m_n[j]=p_acc.micro_n;m_d[j]=p_acc.micro_d}
break}}
if(j==nacc){accs[j]=p_acc.acc;pits[j]=p_acc.pit
if(p_acc.micro_n){m_n[j]=p_acc.micro_n;m_d[j]=p_acc.micro_d}
nacc++}}
for(i=0;i<nacc;i++){p_acc=s.k_a_acc[i]
if(!p_acc)
p_acc=s.k_a_acc[i]={}
p_acc.acc=accs[i];p_acc.pit=pits[i]
if(m_n[i]){p_acc.micro_n=m_n[i];p_acc.micro_d=m_d[i]}else{delete p_acc.micro_n
delete p_acc.micro_d}}}
set_ref(s);i=1
if(sf<-1){switch(param[0]){case'H':switch(param[1]){case'P':case'p':s.k_bagpipe=param[1];sf=param[1]=='P'?0:2;i++
break
default:syntax(1,"Unknown bagpipe-like key")
key_end=true
break}
break
case'P':syntax(1,"K:P is deprecated");sf=0;s.k_drum=true;key_end=true
break
case'n':if(param.indexOf("none")==0){sf=0;s.k_none=true;i=4
break}
default:return[s,info_split(param)]}}
if(!key_end){switch(param[i]){case'#':sf+=7;i++;break
case'b':sf-=7;i++;break}
param=param.slice(i).trim()
switch(param.slice(0,3).toLowerCase()){default:if(param[0]!='m'||(param[1]!=' '&&param[1]!='\t'&&param[1]!='\n')){key_end=true
break}
case"aeo":case"m":case"min":sf-=3;mode=5
break
case"dor":sf-=2;mode=1
break
case"ion":case"maj":break
case"loc":sf-=5;mode=6
break
case"lyd":sf+=1;mode=3
break
case"mix":sf-=1;mode=4
break
case"phr":sf-=4;mode=2
break}
if(!key_end)
param=param.replace(/\w+\s*/,'')
if(param.indexOf("exp ")==0){param=param.replace(/\w+\s*/,'')
if(!param)
syntax(1,"No accidental after 'exp'");s.k_exp=true}
c=param[0]
if(c=='^'||c=='_'||c=='='){s.k_a_acc=[];tmp=new scanBuf;tmp.buffer=param
do{var note=parse_acc_pit(tmp)
if(!note)
break
s.k_a_acc.push(note);c=param[tmp.index]
while(c==' ')
c=param[++tmp.index]}while(c=='^'||c=='_'||c=='=');if(!s.k_exp)
set_k_acc(s,sf)
param=param.slice(tmp.index)}else if(s.k_exp&&param.indexOf("none")==0){param=param.replace(/\w+\s*/,'')}}
s.k_sf=sf;if(s.k_a_acc){s.k_map=[]
i=s.k_a_acc.length
while(--i>=0){note=s.k_a_acc[i]
s.k_map[(note.pit+19)%7]=note.acc}}else{s.k_map=abc2svg.keys[sf+7]}
s.k_mode=mode
s.k_b40=[1,24,7,30,13,36,19,2,25,8,31,14,37,20,3][sf+7]
return[s,info_split(param)]}
function new_meter(p){var s={type:C.METER,dur:0,a_meter:[]},meter={},val,v,m1=0,m2,i=0,j,wmeasure,in_parenth;set_ref(s)
if(p.indexOf("none")==0){i=4;wmeasure=1}else{wmeasure=0
while(i<p.length){if(p[i]=='=')
break
switch(p[i]){case'C':meter.top=p[i++]
if(!m1){m1=4;m2=4}
break
case'c':case'o':meter.top=p[i++]
if(!m1){if(p[i-1]=='c'){m1=2;m2=4}else{m1=3;m2=4}
switch(p[i]){case'|':m2/=2
break
case'.':m1*=3;m2*=2
break}}
break
case'.':case'|':m1=0;meter.top=p[i++]
break
case'(':if(p[i+1]=='('){in_parenth=true;meter.top=p[i++];s.a_meter.push(meter);meter={}}
j=i+1
while(j<p.length){if(p[j]==')'||p[j]=='/')
break
j++}
if(p[j]==')'&&p[j+1]=='/'){i++
continue}
case')':in_parenth=p[i]=='(';meter.top=p[i++];s.a_meter.push(meter);meter={}
continue
default:if(p[i]<='0'||p[i]>'9'){syntax(1,"Bad char '$1' in M:",p[i])
return}
m2=2;meter.top=p[i++]
for(;;){while(p[i]>='0'&&p[i]<='9')
meter.top+=p[i++]
if(p[i]==')'){if(p[i+1]!='/')
break
i++}
if(p[i]=='/'){i++;if(p[i]<='0'||p[i]>'9'){syntax(1,"Bad char '$1' in M:",p[i])
return}
meter.bot=p[i++]
while(p[i]>='0'&&p[i]<='9')
meter.bot+=p[i++]
break}
if(p[i]!=' '&&p[i]!='+')
break
if(i>=p.length||p[i+1]=='(')
break
meter.top+=p[i++]}
m1=parseInt(meter.top)
break}
if(!in_parenth){if(meter.bot)
m2=parseInt(meter.bot);wmeasure+=m1*C.BLEN/m2}
s.a_meter.push(meter);meter={}
while(p[i]==' ')
i++
if(p[i]=='+'){meter.top=p[i++];s.a_meter.push(meter);meter={}}}}
if(p[i]=='='){val=p.substring(++i).match(/^(\d+)\/(\d+)$/)
if(!val){syntax(1,"Bad duration '$1' in M:",p.substring(i))
return}
wmeasure=C.BLEN*val[1]/val[2]}
s.wmeasure=wmeasure
if(cfmt.writefields.indexOf('M')<0)
s.a_meter=[]
if(parse.state!=3){info.M=p;glovar.meter=s
if(parse.state>=1){if(!glovar.ulen){if(wmeasure<=1||wmeasure>=C.BLEN*3/4)
glovar.ulen=C.BLEN/8
else
glovar.ulen=C.BLEN/16}
for(v=0;v<voice_tb.length;v++){voice_tb[v].meter=s;voice_tb[v].wmeasure=wmeasure}}}else{curvoice.wmeasure=wmeasure
if(is_voice_sig()){curvoice.meter=s;reset_gen()}else{sym_link(s)}}}
function new_tempo(text){var i=0,j,c,nd,tmp,s={type:C.TEMPO,dur:0}
set_ref(s)
if(cfmt.writefields.indexOf('Q')<0)
s.del=true
if(text[0]=='"'){i=text.indexOf('"',1)
if(i<0){syntax(1,"Unterminated string in Q:")
return}
s.tempo_str1=text.slice(1,i);i++
while(text[i]==' ')
i++}
tmp=new scanBuf;tmp.buffer=text;tmp.index=i
while(1){c=text[tmp.index]
if(c==undefined||c<='0'||c>'9')
break
nd=parse_dur(tmp)
if(!s.tempo_notes)
s.tempo_notes=[]
s.tempo_notes.push(C.BLEN*nd[0]/nd[1])
while(1){c=text[tmp.index]
if(c!=' ')
break
tmp.index++}}
if(c=='='){c=text[++tmp.index]
while(c==' ')
c=text[++tmp.index];i=tmp.index
if(c=='c'&&text[i+1]=='a'&&text[i+2]=='.'&&text[i+3]==' '){s.tempo_ca='ca. ';tmp.index+=4}
if(text[tmp.index+1]!='/'){s.tempo=tmp.get_int()}else{nd=parse_dur(tmp);s.new_beat=C.BLEN*nd[0]/nd[1]}
c=text[tmp.index]
while(c==' ')
c=text[++tmp.index]}
if(c=='"'){tmp.index++;i=text.indexOf('"',tmp.index+1)
if(i<0){syntax(1,"Unterminated string in Q:")
return}
s.tempo_str2=text.slice(tmp.index,i)}
if(parse.state!=3){if(parse.state==1){info.Q=text;glovar.tempo=s
return}
goto_tune()}
if(curvoice.v==par_sy.top_voice){sym_link(s)
if(glovar.tempo&&curvoice.time==0)
glovar.tempo.del=true}}
function do_info(info_type,text){var s,d1,d2,a,vid
switch(info_type){case'I':self.do_pscom(text)
break
case'L':if(parse.state==2)
goto_tune();a=text.match(/^1\/(\d+)(=(\d+)\/(\d+))?$/)
if(a){d1=Number(a[1])
if(!d1||(d1&(d1-1))!=0)
break
d1=C.BLEN/d1
if(a[2]){d2=Number(a[4])
if(!d2||(d2&(d2-1))!=0){d2=0
break}
d2=Number(a[3])/d2*C.BLEN}else{d2=d1}}else if(text=="auto"){d1=d2=-1}
if(!d2){syntax(1,"Bad L: value")
break}
if(parse.state<2){glovar.ulen=d1}else{curvoice.ulen=d1;curvoice.dur_fact=d2/d1}
break
case'M':new_meter(text)
break
case'U':set_user(text)
break
case'P':if(parse.state==0)
break
if(parse.state==1){info.P=text
break}
if(parse.state==2)
goto_tune()
if(cfmt.writefields.indexOf(info_type)<0)
break
s={type:C.PART,text:text,dur:0}
var p_voice=voice_tb[par_sy.top_voice]
if(curvoice.v!=p_voice.v){if(curvoice.time!=p_voice.time)
break
if(p_voice.last_sym&&p_voice.last_sym.type==C.PART)
break
var voice_sav=curvoice;curvoice=p_voice;sym_link(s);curvoice=voice_sav}else{sym_link(s)}
break
case'Q':if(parse.state==0)
break
new_tempo(text)
break
case'V':get_voice(text)
break
case'K':if(parse.state==0)
break
get_key(text)
break
case'N':case'R':if(!info[info_type])
info[info_type]=text
else
info[info_type]+='\n'+text
break
case'r':if(!user.keep_remark||parse.state!=3)
break
s={type:C.REMARK,text:text,dur:0}
sym_link(s)
break
default:syntax(0,"'$1:' line ignored",info_type)
break}}
function adjust_dur(s){var s2,time,auto_time,i,fac;s2=curvoice.last_sym
if(!s2)
return;if(s2.type==C.MREST||s2.type==C.BAR)
return
while(s2.type!=C.BAR&&s2.prev)
s2=s2.prev;time=s2.time;auto_time=curvoice.time-time
fac=curvoice.wmeasure/auto_time
if(time==0){while(s2&&!s2.dur)
s2=s2.next
if(s2&&s2.type==C.REST&&s2.invis){time+=s2.dur*fac
if(s2.prev)
s2.prev.next=s2.next
else
curvoice.sym=s2.next
if(s2.next)
s2.next.prev=s2.prev;s2=s2.next}}
if(curvoice.wmeasure==auto_time)
return
for(;s2;s2=s2.next){s2.time=time
if(!s2.dur||s2.grace)
continue
s2.dur*=fac;s2.dur_orig*=fac;time+=s2.dur
if(s2.type!=C.NOTE&&s2.type!=C.REST)
continue
for(i=0;i<=s2.nhd;i++)
s2.notes[i].dur*=fac}
curvoice.time=s.time=time}
function new_bar(){var s2,c,bar_type,line=parse.line,s={type:C.BAR,fname:parse.fname,istart:parse.bol+line.index,dur:0,multi:0}
if(vover&&vover.bar)
get_vover('|')
if(glovar.new_nbar){s.bar_num=glovar.new_nbar;glovar.new_nbar=0}
bar_type=line.char()
while(1){c=line.next_char()
switch(c){case'|':case'[':case']':case':':bar_type+=c
continue}
break}
if(bar_type[0]==':'){if(bar_type.length==1){bar_type='|';s.bar_dotted=true}else{s.rbstop=2
if(curvoice.tie_s)
curvoice.tie_s.tie_s=s}}
if(a_gch)
self.gch_build(s)
if(a_dcn){deco_cnv(a_dcn,s);a_dcn=null}
if(parse.ottava.length){s2=s
if(curvoice.cst!=curvoice.st){s2={type:C.SPACE,fname:parse.fname,istart:parse.bol+line.index,dur:0,multi:0,invis:true,width:1}
sym_link(s2)}
s2.ottava=parse.ottava
parse.ottava=[]}
switch(bar_type.slice(-1)){case'[':if(/[0-9" ]/.test(c))
break
bar_type=bar_type.slice(0,-1);line.index--;c='['
break
case':':s.rbstop=2
break}
if(c>'0'&&c<='9'){s.text=c
while(1){c=line.next_char()
if("0123456789,.-".indexOf(c)<0)
break
s.text+=c}
s.rbstop=2;s.rbstart=2}else if(c=='"'&&bar_type.slice(-1)=='['){s.text=""
while(1){c=line.next_char()
if(!c){syntax(1,"No end of repeat string")
return}
if(c=='"'){line.index++
break}
s.text+=c}
s.rbstop=2;s.rbstart=2}
if(bar_type[0]==']'){s.rbstop=2
if(bar_type.length!=1)
bar_type=bar_type.slice(1)
else
s.invis=true}
s.iend=parse.bol+line.index
if(s.rbstart&&curvoice.norepbra&&!curvoice.second)
s.norepbra=true
if(s.text){if(s.text[0]=='1'){if(curvoice.tie_s)
curvoice.tie_s_rep=curvoice.tie_s
if(curvoice.acc_tie)
curvoice.acc_tie_rep=curvoice.acc_tie.slice()}else{if(curvoice.tie_s_rep){curvoice.tie_s=clone(curvoice.tie_s_rep)
curvoice.tie_s.notes=clone(curvoice.tie_s.notes)
for(var m=0;m<=curvoice.tie_s.nhd;m++){curvoice.tie_s.notes[m]=clone(curvoice.tie_s.notes[m])
curvoice.tie_s.notes[m].s=curvoice.tie_s}}
if(curvoice.acc_tie_rep)
curvoice.acc_tie=curvoice.acc_tie_rep.slice()}}
if(curvoice.acc_tie)
curvoice.acc=curvoice.acc_tie
else
curvoice.acc=[]
if(curvoice.ulen<0)
adjust_dur(s);s2=curvoice.last_sym
if(s2&&s2.time==curvoice.time){if(bar_type=="["||bar_type=="|:"){do{if(s2.type==C.BAR)
break
if(w_tb[s2.type])
break
s2=s2.prev}while(s2)
if(s2&&s2.type==C.BAR){if(bar_type=="["&&!s2.text&&(curvoice.st==0||(par_sy.staves[curvoice.st-1].flags&STOP_BAR)||s.norepbra)){if(s.text)
s2.text=s.text
if(s.a_gch)
s2.a_gch=s.a_gch
if(s.norepbra)
s2.norepbra=s.norepbra
if(s.rbstart)
s2.rbstart=s.rbstart
if(s.rbstop)
s2.rbstop=s.rbstop
return}
if(s2.st==curvoice.st&&bar_type=="|:"){if(s2.bar_type==":|"){s2.bar_type="::";s2.rbstop=2
return}
if(s2.bar_type=="||"){s2.bar_type="||:";s2.rbstop=2
return}}}}}
switch(bar_type){case"[":s.rbstop=2
case"[]":case"[|]":s.invis=true;bar_type="[]"
break
case":|:":case":||:":bar_type="::"
break
case"||":if(!cfmt.rbdbstop)
break
case"[|":case"|]":s.rbstop=2
break}
s.bar_type=bar_type
if(!curvoice.lyric_restart)
curvoice.lyric_restart=s
if(!curvoice.sym_restart)
curvoice.sym_restart=s
sym_link(s);s.st=curvoice.st
if(s.rbstart&&!curvoice.norepbra&&curvoice.st>0&&!(par_sy.staves[curvoice.st-1].flags&STOP_BAR)){s2={type:C.BAR,fname:s.fname,istart:s.istart,iend:s.iend,bar_type:"[",multi:0,invis:true,text:s.text,rbstart:2}
sym_link(s2);s2.st=curvoice.st
delete s.text;s.rbstart=0}}
function parse_staves(p){var v,vid,a_vf=[],err=false,flags=0,brace=0,bracket=0,parenth=0,flags_st=0,e,a=p.match(/[^[\]{}()*+\s]+|[^\s]/g)
if(!a){syntax(1,errs.bad_val,"%%score")
return}
while(1){e=a.shift()
if(!e)
break
switch(e){case'[':if(parenth||brace+bracket>=2){syntax(1,errs.misplaced,'[');err=true
break}
flags|=brace+bracket==0?OPEN_BRACKET:OPEN_BRACKET2;bracket++;flags_st<<=8;flags_st|=OPEN_BRACKET
break
case'{':if(parenth||brace||bracket>=2){syntax(1,errs.misplaced,'{');err=true
break}
flags|=!bracket?OPEN_BRACE:OPEN_BRACE2;brace++;flags_st<<=8;flags_st|=OPEN_BRACE
break
case'(':if(parenth){syntax(1,errs.misplaced,'(');err=true
break}
flags|=OPEN_PARENTH;parenth++;flags_st<<=8;flags_st|=OPEN_PARENTH
break
case'*':if(brace&&!parenth&&!(flags&(OPEN_BRACE|OPEN_BRACE2)))
flags|=FL_VOICE
break
case'+':flags|=MASTER_VOICE
break
case']':case'}':case')':syntax(1,"Bad voice ID in %%score");err=true
break
default:vid=e
while(1){e=a.shift()
if(!e)
break
switch(e){case']':if(!(flags_st&OPEN_BRACKET)){syntax(1,errs.misplaced,']');err=true
break}
bracket--;flags|=brace+bracket==0?CLOSE_BRACKET:CLOSE_BRACKET2;flags_st>>=8
continue
case'}':if(!(flags_st&OPEN_BRACE)){syntax(1,errs.misplaced,'}');err=true
break}
brace--;flags|=!bracket?CLOSE_BRACE:CLOSE_BRACE2;flags&=~FL_VOICE;flags_st>>=8
continue
case')':if(!(flags_st&OPEN_PARENTH)){syntax(1,errs.misplaced,')');err=true
break}
parenth--;flags|=CLOSE_PARENTH;flags_st>>=8
continue
case'|':flags|=STOP_BAR
continue}
break}
a_vf.push([vid,flags]);flags=0
if(!e)
break
a.unshift(e)
break}}
if(flags_st!=0){syntax(1,"'}', ')' or ']' missing in %%score");err=true}
if(err||a_vf.length==0)
return
return a_vf}
function info_split(text){if(!text)
return[]
var a=text.match(/=?[^\s"=]+=?|".+?"/g)
if(!a){syntax(1,"Unterminated string")
return[]}
return a}
var reg_dur=/(\d*)(\/*)(\d*)/g
function parse_dur(line){var res,num,den;reg_dur.lastIndex=line.index;res=reg_dur.exec(line.buffer)
if(!res[0])
return[1,1];num=res[1]||1;den=res[3]||1
if(!res[3])
den*=1<<res[2].length;line.index=reg_dur.lastIndex
return[num,den]}
function parse_acc_pit(line){var note,acc,micro_n,micro_d,pit,nd,c=line.char()
switch(c){case'^':c=line.next_char()
if(c=='^'){acc=2;c=line.next_char()}else{acc=1}
break
case'=':acc=3;c=line.next_char()
break
case'_':c=line.next_char()
if(c=='_'){acc=-2;c=line.next_char()}else{acc=-1}
break}
if(acc&&acc!=3&&(c>='1'&&c<='9')||c=='/'){nd=parse_dur(line);micro_n=nd[0];micro_d=nd[1]
if(micro_d==1)
micro_d=curvoice?curvoice.uscale:1
else
micro_d*=2;c=line.char()}
pit=ntb.indexOf(c)+16;c=line.next_char()
if(pit<16){syntax(1,"'$1' is not a note",line.buffer[line.index-1])
return}
while(c=="'"){pit+=7;c=line.next_char()}
while(c==','){pit-=7;c=line.next_char()}
note={pit:pit,shhd:0,shac:0}
if(acc){note.acc=acc
if(micro_n){note.micro_n=micro_n;note.micro_d=micro_d}}
return note}
function note2abc(note){var i,abc='abcdefg'[(note.pit+77)%7]
if(note.acc)
abc=['__','_','','^','^^','='][note.acc+2]+abc
for(i=note.pit;i>=30;i-=7)
abc+="'"
for(i=note.pit;i<23;i+=7)
abc+=","
return abc}
function set_map(note){var delta,map=maps[curvoice.map],nn=note2abc(note)
if(!map[nn]){nn='octave,'+nn.replace(/[',]/g,'')
if(!map[nn]){delta=abc2svg.p_b40[(note.pit+77)%7]-
curvoice.ckey.k_b40
nn='key,'+'abcdefg'[abc2svg.b40_p[delta+2]]
if(!map[nn]){nn='all'
if(!map[nn])
return}}}
note.map=map[nn]
if(note.map[1]){note.pit=note.map[1].pit
note.acc=note.map[1].acc}
nn=note.map[3]
if(nn)
note.b40=abc2svg.pab40(nn.pit,nn.acc)}
function parse_basic_note(line,ulen){var nd,note=parse_acc_pit(line)
if(!note)
return
if(line.char()=='0'){parse.stemless=true;line.index++}
nd=parse_dur(line);note.dur=ulen*nd[0]/nd[1]
return note}
function parse_vpos(){var line=parse.line,ty=0
if(line.buffer[line.index-1]=='.'&&!a_dcn)
ty=C.SL_DOTTED
switch(line.next_char()){case"'":line.index++
return ty+C.SL_ABOVE
case",":line.index++
return ty+C.SL_BELOW}
return ty+C.SL_AUTO}
function slur_add(enote,e_is_note){var i,s,sl,snote,s_is_note
for(i=curvoice.sls.length;--i>=0;){sl=curvoice.sls[i]
snote=sl.note
s_is_note=sl.is_note
delete sl.is_note
if(snote.s!=enote.s){sl.note=enote
if(e_is_note)
sl.is_note=e_is_note
s=s_is_note?snote:snote.s
if(!s.sls)
s.sls=[];s.sls.push(sl)
curvoice.sls.splice(i,1)
if(s_is_note)
snote.s.sl1=true
if(sl.grace)
sl.grace.sl1=true
return}}
if(enote.grace){error(1,enote.s,errs.bad_slur_end)
return}
for(s=enote.s.prev;s;s=s.prev){if(s.type==C.BAR&&s.bar_type[0]==':'&&s.text){if(!s.sls)
s.sls=[];s.sls.push({note:enote,ty:C.SL_AUTO})
if(e_is_note)
s.sls[s.sls.length-1].is_note=e_is_note
return}}
syntax(1,"Lack of starting slur")}
Abc.prototype.new_note=function(grace,sls){var note,s,in_chord,c,dcn,type,tie_s,not2,i,n,s2,nd,res,num,dur,sl1=[],line=parse.line,a_dcn_sav=a_dcn;if(!grace&&curvoice.tie_s){tie_s=curvoice.tie_s
curvoice.tie_s=null}
a_dcn=null;parse.stemless=false;s={type:C.NOTE,fname:parse.fname,stem:0,multi:0,nhd:0,xmx:0}
s.istart=parse.bol+line.index
if(curvoice.color)
s.color=curvoice.color
if(grace){s.grace=true}else{if(a_gch)
self.gch_build(s)
if(parse.repeat_n){s.repeat_n=parse.repeat_n;s.repeat_k=parse.repeat_k;parse.repeat_n=0}}
c=line.char()
switch(c){case'X':s.invis=true
case'Z':s.type=C.MREST;c=line.next_char()
s.nmes=(c>'0'&&c<='9')?line.get_int():1;s.dur=curvoice.wmeasure*s.nmes
if(curvoice.second){curvoice.time+=s.dur
return}
if(s.nmes==1){s.type=C.REST;s.dur_orig=s.dur;s.notes=[{pit:18,dur:s.dur}]}
break
case'y':s.type=C.SPACE;s.invis=true;s.dur=0;c=line.next_char()
if(c>='0'&&c<='9')
s.width=line.get_int()
else
s.width=10
if(tie_s)
curvoice.tie_s=tie_s
break
case'x':s.invis=true
case'z':s.type=C.REST;line.index++;nd=parse_dur(line);s.dur_orig=((curvoice.ulen<0)?C.BLEN:curvoice.ulen)*nd[0]/nd[1];s.dur=s.dur_orig*curvoice.dur_fact;s.notes=[{pit:18,dur:s.dur_orig}]
break
case'[':in_chord=true;c=line.next_char()
default:if(curvoice.uscale)
s.uscale=curvoice.uscale;s.notes=[]
while(1){if(in_chord){while(1){if(!c)
break
i=c.charCodeAt(0);if(i>=128){syntax(1,errs.not_ascii)
return}
type=char_tb[i]
switch(type[0]){case'(':sl1.push(parse_vpos());c=line.char()
continue
case'!':if(!a_dcn)
a_dcn=[]
if(type.length>1){a_dcn.push(type.slice(1,-1))}else{dcn=""
while(1){c=line.next_char()
if(!c){syntax(1,"No end of decoration")
return}
if(c=='!')
break
dcn+=c}
a_dcn.push(dcn)}
c=line.next_char()
continue}
break}}
note=parse_basic_note(line,s.grace?C.BLEN/4:curvoice.ulen<0?C.BLEN:curvoice.ulen)
if(!note)
return
if(curvoice.octave)
note.pit+=curvoice.octave*7
i=note.acc
if(i){curvoice.acc[note.pit+19]=i}else{i=curvoice.acc[note.pit+19]
if(!i)
i=curvoice.ckey.k_map[(note.pit+19)%7]||0}
note.b40=abc2svg.pab40(note.pit,i)
if(curvoice.map&&maps[curvoice.map])
set_map(note)
if(tie_s){if(tie_s.type!=C.GRACE){for(i=0;i<=tie_s.nhd;i++){if(!tie_s.notes[i].tie_ty)
continue
if(tie_s.notes[i].b40==note.b40){tie_s.notes[i].tie_n=note
note.s=s
tie_s.tie_s=s
if(curvoice.acc_tie&&curvoice.acc_tie[note.pit+19])
curvoice.acc_tie[note.pit+19]=0
break}}}else{for(s2=tie_s.extra;s2;s2=s2.next){if(!s2.notes[0].tie_ty)
continue
if(s2.notes[0].b40==note.b40){s2.tie_s=s
s2.notes[0].tie_n=note
note.s=s
s2.notes[0].s=s2
tie_s.tie_s=s
if(curvoice.acc_tie&&curvoice.acc_tie[note.pit+19])
curvoice.acc_tie[note.pit+19]=0
break}}}
s.ti2=tie_s}
if(sl1.length){while(1){i=sl1.shift()
if(!i)
break
curvoice.sls.push({is_note:true,note:note,ty:i})}
note.s=s}
if(a_dcn){note.a_dcn=a_dcn;a_dcn=null}
s.notes.push(note)
if(!in_chord)
break
c=line.char()
while(1){switch(c){case')':note.s=s
slur_add(note,true)
c=line.next_char()
continue
case'-':note.tie_ty=parse_vpos()
note.s=s
curvoice.tie_s=s
if(curvoice.acc[note.pit+19]){if(!curvoice.acc_tie)
curvoice.acc_tie=[]
curvoice.acc_tie[note.pit+19]=curvoice.acc[note.pit+19]}
c=line.char()
continue
case'.':c=line.next_char()
switch(c){case'-':case'(':continue}
syntax(1,"Misplaced dot")
break}
break}
if(c==']'){line.index++;nd=parse_dur(line);s.nhd=s.notes.length-1
for(i=0;i<=s.nhd;i++){note=s.notes[i];note.dur=note.dur*nd[0]/nd[1]}
break}}
if(sls.length){while(1){i=sls.shift()
if(!i)
break
s.notes[0].s=s
curvoice.sls.push({note:s.notes[0],ty:i})
if(grace)
curvoice.sls[curvoice.sls.length-1].grace=grace}}
s.dur_orig=s.notes[0].dur;s.dur=s.notes[0].dur*curvoice.dur_fact}
if(s.grace&&s.type!=C.NOTE){syntax(1,"Not a note in grace note sequence")
return}
if(s.notes){if(!grace){switch(curvoice.pos.stm){case C.SL_ABOVE:s.stem=1;break
case C.SL_BELOW:s.stem=-1;break
case C.SL_HIDDEN:s.stemless=true;break}
num=curvoice.brk_rhythm
if(num){curvoice.brk_rhythm=0;s2=curvoice.last_note
if(num>0){n=num*2-1;s.dur=s.dur*n/num;s.dur_orig=s.dur_orig*n/num
for(i=0;i<=s.nhd;i++)
s.notes[i].dur=s.notes[i].dur*n/num;s2.dur/=num;s2.dur_orig/=num
for(i=0;i<=s2.nhd;i++)
s2.notes[i].dur/=num}else{num=-num;n=num*2-1;s.dur/=num;s.dur_orig/=num
for(i=0;i<=s.nhd;i++)
s.notes[i].dur/=num;s2.dur=s2.dur*n/num;s2.dur_orig=s2.dur_orig*n/num
for(i=0;i<=s2.nhd;i++)
s2.notes[i].dur=s2.notes[i].dur*n/num}
curvoice.time=s2.time+s2.dur;for(s2=s2.next;s2;s2=s2.next)
s2.time=curvoice.time}}else{var div=curvoice.ckey.k_bagpipe?8:4
for(i=0;i<=s.nhd;i++)
s.notes[i].dur/=div;s.dur/=div;s.dur_orig/=div
if(grace.stem)
s.stem=grace.stem}
curvoice.last_note=s}
sym_link(s)
if(cfmt.shiftunison)
s.shiftunison=cfmt.shiftunison
if(!grace){if(!curvoice.lyric_restart)
curvoice.lyric_restart=s
if(!curvoice.sym_restart)
curvoice.sym_restart=s}
if(a_dcn_sav)
deco_cnv(a_dcn_sav,s,s.prev)
if(parse.ottava.length){s.ottava=parse.ottava
parse.ottava=[]}
if(parse.stemless)
s.stemless=true
s.iend=parse.bol+line.index
return s}
function tp_adj(s,fact){var tim=s.time
curvoice.time=s.time+(curvoice.time-s.time)*fact
while(1){s.in_tuplet=true
if(!s.grace){s.time=tim
if(s.dur){s.dur=Math.round(s.dur*fact)
tim+=s.dur}}
if(!s.next){s.dur=curvoice.time-s.time
if(s.tpe)
s.tpe++
else
s.tpe=1
break}
s=s.next}}
var nil=["0"],char_tb=[nil,nil,nil,nil,nil,nil,nil,nil,nil," ","\n",nil,nil,nil,nil,nil,nil,nil,nil,nil,nil,nil,nil,nil,nil,nil,nil,nil,nil,nil,nil,nil," ","!",'"',"i","\n",nil,"&",nil,"(",")","i",nil,nil,"-","!dot!",nil,nil,nil,nil,nil,nil,nil,nil,nil,nil,nil,"|","i","<","n","<","i","i","n","n","n","n","n","n","n","!fermata!","d","d","d","!emphasis!","!lowermordent!","d","!coda!","!uppermordent!","d","d","!segno!","!trill!","d","d","d","n","d","n","[","\\","|","n","n","i","n","n","n","n","n","n","n","d","d","d","d","d","d","d","d","d","d","d","d","d","!upbow!","!downbow!","d","n","n","n","{","|","}","!gmark!",nil,],ottava={"8va(":1,"8va)":0,"15ma(":2,"15ma)":0,"8vb(":-1,"8vb)":0,"15mb(":-2,"15mb)":0}
function parse_music_line(){var grace,last_note_sav,a_dcn_sav,no_eol,s,tps,tp=[],tpn=-1,sls=[],line=parse.line
function check_mac(m){var i,j,b
for(i=1,j=line.index+1;i<m.length;i++,j++){if(m[i]==line.buffer[j])
continue
if(m[i]!='n')
return
b=ntb.indexOf(line.buffer[j])
if(b<0)
return
while(line.buffer[j+1]=="'"){b+=7;j++}
while(line.buffer[j+1]==','){b-=7;j++}}
line.index=j
return b}
function expand(m,b){var c,d,r="",n=m.length
for(i=0;i<n;i++){c=m[i]
if(c>='h'&&c<='z'){d=b+c.charCodeAt(0)-'n'.charCodeAt(0)
c=""
while(d<0){d+=7;c+=','}
while(d>14){d-=7;c+="'"}
r+=ntb[d]+c}else{r+=c}}
return r}
function parse_mac(m,b){var seq,line_sav=line,istart_sav=parse.istart;parse.line=line=new scanBuf;parse.istart+=line_sav.index;line.buffer=b?expand(m,b):m;parse_seq(true);parse.line=line=line_sav;parse.istart=istart_sav}
function parse_seq(in_mac){var c,idx,type,k,s,dcn,i,n,text,note
while(1){c=line.char()
if(!c)
break
if(c=='.'){switch(line.buffer[line.index+1]){case'(':case'-':case'|':c=line.next_char()
break}}
idx=c.charCodeAt(0);if(idx>=128){syntax(1,errs.not_ascii);line.index++
break}
if(!in_mac&&maci[idx]){n=0
for(k in mac){if(!mac.hasOwnProperty(k)||k[0]!=c)
continue
if(k.indexOf('n')<0){if(line.buffer.indexOf(k,line.index)
!=line.index)
continue
line.index+=k.length}else{n=check_mac(k)
if(!n)
continue}
parse_mac(mac[k],n);n=1
break}
if(n)
continue}
type=char_tb[idx]
switch(type[0]){case' ':s=curvoice.last_note
if(s){s.beam_end=true
if(grace)
grace.gr_shift=true}
break
case'\n':if(cfmt.barsperstaff)
break
if(par_sy.voices[curvoice.v]&&par_sy.voices[curvoice.v].range==0&&curvoice.last_sym)
curvoice.last_sym.eoln=true
break
case'&':if(grace){syntax(1,errs.bad_char,c)
break}
c=line.next_char()
if(c==')'){get_vover(')')
break}
get_vover('&')
continue
case'(':c=line.next_char()
if(c>'0'&&c<='9'){var pplet=line.get_int(),qplet=qplet_tb[pplet],rplet=pplet,c=line.char()
if(c==':'){c=line.next_char()
if(c>'0'&&c<='9'){qplet=line.get_int();c=line.char()}
if(c==':'){c=line.next_char()
if(c>'0'&&c<='9'){rplet=line.get_int();c=line.char()}else{syntax(1,"Invalid 'r' in tuplet")
continue}}}
if(qplet==0||qplet==undefined)
qplet=(curvoice.wmeasure%9)==0?3:2;if(tpn<0)
tpn=tp.length
tp.push({p:pplet,q:qplet,r:rplet,ro:rplet,f:cfmt.tuplets})
continue}
if(c=='&'){if(grace){syntax(1,errs.bad_char,c)
break}
get_vover('(')
break}
line.index--;sls.push(parse_vpos())
continue
case')':if(curvoice.ignore)
break
s=curvoice.last_sym
if(s){switch(s.type){case C.SPACE:if(!s.notes){s.notes=[]
s.notes[0]={}}
case C.NOTE:case C.REST:break
case C.GRACE:for(s=s.extra;s.next;s=s.next);break
default:s=null
break}}
if(!s){syntax(1,errs.bad_char,c)
break}
s.notes[0].s=s
slur_add(s.notes[0])
break
case'!':if(!a_dcn)
a_dcn=[]
if(type.length>1){dcn=type.slice(1,-1)}else{dcn="";i=line.index
while(1){c=line.next_char()
if(!c)
break
if(c=='!')
break
dcn+=c}
if(!c){line.index=i;syntax(1,"No end of decoration")
break}}
if(ottava[dcn]!=undefined){glovar.ottava=true;parse.ottava.push(ottava[dcn])}else{a_dcn.push(dcn)}
break
case'"':parse_gchord(type)
break
case'-':s=curvoice.last_note
if(!s||s.type!=C.NOTE){syntax(1,"No note before '-'")
break}
var ty=parse_vpos()
for(i=0;i<=s.nhd;i++){s.notes[i].tie_ty=ty
s.notes[i].s=s}
if(grace)
grace.tie_s=curvoice.tie_s=grace
else
curvoice.tie_s=s
for(i=0;i<=s.nhd;i++){note=s.notes[i]
if(curvoice.acc[note.pit+19]){if(!curvoice.acc_tie)
curvoice.acc_tie=[]
curvoice.acc_tie[note.pit+19]=curvoice.acc[note.pit+19]}}
continue
case'[':var c_next=line.buffer[line.index+1]
if('|[]: "'.indexOf(c_next)>=0||(c_next>='1'&&c_next<='9')){if(grace){syntax(1,errs.bar_grace)
break}
new_bar()
continue}
if(line.buffer[line.index+2]==':'){i=line.buffer.indexOf(']',line.index+1)
if(i<0){syntax(1,"Lack of ']'")
break}
text=line.buffer.slice(line.index+3,i).trim()
parse.istart=parse.bol+line.index;parse.iend=parse.bol+ ++i;line.index=0;do_info(c_next,text);line.index=i
continue}
case'n':s=self.new_note(grace,sls)
if(!s)
continue
if(grace||!s.notes)
continue
if(tpn>=0){s.tp=tp.slice(tpn)
tpn=-1
if(tps)
s.tp[0].s=tps
tps=s}else if(!tps){continue}
k=tp[tp.length-1]
if(--k.r>0)
continue
while(1){tp_adj(tps,k.q/k.p)
i=k.ro
if(k.s)
tps=k.s
tp.pop()
if(!tp.length){tps=null
break}
k=tp[tp.length-1]
k.r-=i
if(k.r>0)
break}
continue
case'<':if(!curvoice.last_note){syntax(1,"No note before '<'")
break}
if(grace){syntax(1,"Cannot have a broken rhythm in grace notes")
break}
n=c=='<'?1:-1
while(c=='<'||c=='>'){n*=2;c=line.next_char()}
curvoice.brk_rhythm=n
continue
case'i':break
case'{':if(grace){syntax(1,"'{' in grace note")
break}
last_note_sav=curvoice.last_note;curvoice.last_note=null;a_dcn_sav=a_dcn;a_dcn=undefined;grace={type:C.GRACE,fname:parse.fname,istart:parse.bol+line.index,dur:0,multi:0}
switch(curvoice.pos.gst){case C.SL_ABOVE:grace.stem=1;break
case C.SL_BELOW:grace.stem=-1;break
case C.SL_HIDDEN:grace.stem=2;break}
sym_link(grace);c=line.next_char()
if(c=='/'){grace.sappo=true
break}
continue
case'|':if(grace){syntax(1,errs.bar_grace)
break}
c=line.buffer[line.index-1];new_bar()
if(c=='.')
curvoice.last_sym.bar_dotted=true
continue
case'}':s=curvoice.last_note
if(!grace||!s){syntax(1,errs.bad_char,c)
break}
if(a_dcn)
syntax(1,"Decoration ignored");grace.extra=grace.next;grace.extra.prev=null;grace.next=null;curvoice.last_sym=grace;grace=null
if(!s.prev&&!curvoice.ckey.k_bagpipe){for(i=0;i<=s.nhd;i++)
s.notes[i].dur*=2;s.dur*=2;s.dur_orig*=2}
curvoice.last_note=last_note_sav;a_dcn=a_dcn_sav
break
case"\\":if(!line.buffer[line.index+1]){no_eol=true
break}
default:syntax(1,errs.bad_char,c)
break}
line.index++}}
if(parse.state!=3){if(parse.state!=2)
return
goto_tune()}
if(parse.tp){tp=parse.tp
tps=parse.tps
parse.tp=null}
parse_seq()
if(tp.length){parse.tp=tp
parse.tps=tps}
if(grace){syntax(1,"No end of grace note sequence");curvoice.last_sym=grace.prev;curvoice.last_note=last_note_sav
if(grace.prev)
grace.prev.next=null}
if(cfmt.breakoneoln&&curvoice.last_note)
curvoice.last_note.beam_end=true
if(no_eol||cfmt.barsperstaff)
return
if(char_tb['\n'.charCodeAt(0)]=='\n'&&par_sy.voices[curvoice.v]&&par_sy.voices[curvoice.v].range==0&&curvoice.last_sym)
curvoice.last_sym.eoln=true}
var
sw_tb=new Float32Array([.000,.000,.000,.000,.000,.000,.000,.000,.000,.000,.000,.000,.000,.000,.000,.000,.000,.000,.000,.000,.000,.000,.000,.000,.000,.000,.000,.000,.000,.000,.000,.000,.250,.333,.408,.500,.500,.833,.778,.333,.333,.333,.500,.564,.250,.564,.250,.278,.500,.500,.500,.500,.500,.500,.500,.500,.500,.500,.278,.278,.564,.564,.564,.444,.921,.722,.667,.667,.722,.611,.556,.722,.722,.333,.389,.722,.611,.889,.722,.722,.556,.722,.667,.556,.611,.722,.722,.944,.722,.722,.611,.333,.278,.333,.469,.500,.333,.444,.500,.444,.500,.444,.333,.500,.500,.278,.278,.500,.278,.778,.500,.500,.500,.500,.333,.389,.278,.500,.500,.722,.500,.500,.444,.480,.200,.480,.541,.500]),ssw_tb=new Float32Array([.000,.000,.000,.000,.000,.000,.000,.000,.000,.000,.000,.000,.000,.000,.000,.000,.000,.000,.000,.000,.000,.000,.000,.000,.000,.000,.000,.000,.000,.000,.000,.000,.278,.278,.355,.556,.556,.889,.667,.191,.333,.333,.389,.584,.278,.333,.278,.278,.556,.556,.556,.556,.556,.556,.556,.556,.556,.556,.278,.278,.584,.584,.584,.556,1.015,.667,.667,.722,.722,.667,.611,.778,.722,.278,.500,.667,.556,.833,.722,.778,.667,.778,.722,.667,.611,.722,.667,.944,.667,.667,.611,.278,.278,.278,.469,.556,.333,.556,.556,.500,.556,.556,.278,.556,.556,.222,.222,.500,.222,.833,.556,.556,.556,.556,.333,.500,.278,.556,.500,.722,.500,.500,.500,.334,.260,.334,.584,.512]),cw_tb=sw_tb
function cwid(c){var i=c.charCodeAt(0)
if(i>=0x80){if(i>=0x300&&i<0x370)
return 0;i=0x61}
return cw_tb[i]}
function cwidf(c){return cwid(c)*gene.curfont.swfac}
var strwh=typeof document!="undefined"?(function(el){el.style.position='absolute';el.style.top='-1000px';el.style.padding='0';document.body.appendChild(el)
return function(str){var c,font=gene.curfont,h=font.size,w=0,n=str.length,i0=0,i=0
el.style.font=style_font(font).slice(5);str=str.replace(/<|>|&[^&]*?;|&|  /g,function(c){switch(c){case'<':return"&lt;"
case'>':return"&gt;"
case'&':return"&amp;"
case"  ":return'  '}
return c})
while(1){i=str.indexOf('$',i)
if(i<0)
break
c=str[i+1]
if(c=='0'){font=gene.deffont}else if(c>='1'&&c<='9'){font=get_font("u"+c)}else{i++
continue}
el.innerHTML=str.slice(i0,i);w+=el.clientWidth
if(font.size>h)
h=font.size;el.style.font=style_font(font).slice(5);i+=2;i0=i}
el.innerHTML=str.slice(i0);w+=el.clientWidth;gene.curfont=font
return[w,h]}})(document.createElement('div')):function(str){var font=gene.curfont,swfac=font.swfac,h=font.size,w=0,i,j,c,n=str.length
for(i=0;i<n;i++){c=str[i]
switch(c){case'$':c=str[i+1]
if(c=='0'){font=gene.deffont}else if(c>='1'&&c<='9'){font=get_font("u"+c)}else{c='$'
break}
i++;swfac=font.swfac
if(font.size>h)
h=font.size
continue
case'&':j=str.indexOf(';',i)
if(j>0&&j-i<10){i=j;c='a'}
break}
w+=cwid(c)*swfac}
gene.curfont=font
return[w,h]}
function set_font(xxx){if(typeof xxx=="string")
xxx=get_font(xxx);cw_tb=xxx.name.slice(0,4)=='sans'?ssw_tb:sw_tb;gene.curfont=gene.deffont=xxx}
function out_str(str){var n_font,o_font=gene.curfont,c_font=o_font;output+=str.replace(/<|>|&[^&]*?;|&|  |\$./g,function(c){switch(c){case'<':return"&lt;"
case'>':return"&gt;"
case'&':return"&amp;"
case'  ':return'  '
default:if(c[0]!='$')
break
if(c[1]=='0')
n_font=gene.deffont
else if(c[1]>='1'&&c[1]<='9')
n_font=get_font("u"+c[1])
else
break
c=''
if(n_font==c_font)
return c
if(c_font!=o_font)
c="</tspan>";c_font=n_font
if(c_font==o_font)
return c
return c+'<tspan\n\tclass="'+
font_class(n_font)+'">'}
return c})
if(c_font!=o_font){output+="</tspan>";gene.curfont=c_font}}
function xy_str(x,y,str,action,w,wh){if(!wh)
wh=strwh(str);output+='<text class="'+font_class(gene.curfont)
if(action!='j'&&str.length>5&&gene.curfont.wadj)
output+='" lengthAdjust="'+gene.curfont.wadj+'" textLength="'+wh[0].toFixed(1);output+='" x="';out_sxsy(x,'" y="',y+wh[1]*.2)
switch(action){case'c':x-=wh[0]/2;output+='" text-anchor="middle">'
break
case'j':output+='" textLength="'+w.toFixed(1)+'">'
break
case'r':x-=wh[0];output+='" text-anchor="end">'
break
default:output+='">'
break}
out_str(str);output+="</text>\n"
if(!w&&gene.curfont.box){output+='<rect class="stroke" x="';out_sxsy(x-2,'" y="',y+wh[1]);output+='" width="'+(wh[0]+4).toFixed(1)+'" height="'+(wh[1]+2).toFixed(1)+'"/>\n'}}
function trim_title(title,is_subtitle){var i
if(cfmt.titletrim){i=title.lastIndexOf(", ")
if(i<0||title[i+2]<'A'||title[i+2]>'Z'){i=0}else if(cfmt.titletrim==true){if(i<title.length-7||title.indexOf(' ',i+3)>=0)
i=0}else{if(i<title.length-cfmt.titletrim-2)
i=0}}
if(!is_subtitle&&cfmt.writefields.indexOf('X')>=0)
title=info.X+'.  '+title
if(i)
title=title.slice(i+2).trim()+' '+title.slice(0,i)
if(cfmt.titlecaps)
return title.toUpperCase()
return title}
function get_lwidth(){return(img.width-img.lm-img.rm
-2)
/ cfmt.scale}
function write_title(title,is_subtitle){var h,wh
if(!title)
return
set_page();title=trim_title(title,is_subtitle)
if(is_subtitle){set_font("subtitle");h=cfmt.subtitlespace}else{set_font("title");h=cfmt.titlespace}
wh=strwh(title);vskip(wh[1]+h)
if(cfmt.titleleft)
xy_str(0,0,title,null,null,wh)
else
xy_str(get_lwidth()/2,0,title,"c",null,wh)}
function put_inf2r(x,y,str1,str2,action){if(!str1){if(!str2)
return
str1=str2;str2=null}
if(!str2)
xy_str(x,y,str1,action)
else
xy_str(x,y,str1+' ('+str2+')',action)}
function write_text(text,action){if(action=='s')
return
set_font("text");set_page();var wh,font,strlw=get_lwidth(),sz=gene.curfont.size,lineskip=sz*cfmt.lineskipfac,parskip=sz*cfmt.parskipfac,p_start=block.started?function(){}:blk_out,p_flush=block.started?svg_flush:blk_flush,i,j,x,words,w,k,ww,str;p_start()
switch(action){default:switch(action){case'c':x=strlw/2;break
case'r':x=strlw;break
default:x=0;break}
j=0
font=gene.curfont
while(1){i=text.indexOf('\n',j)
if(i<0){str=text.slice(j);wh=strwh(str);gene.curfont=font;vskip(wh[1]*cfmt.lineskipfac);xy_str(x,0,str,action,null,wh);font=gene.curfont
break}
if(i==j){vskip(parskip);p_flush();use_font(gene.curfont)
while(text[i+1]=='\n'){vskip(lineskip);i++}
if(i==text.length)
break
p_start()}else{str=text.slice(j,i);wh=strwh(str);gene.curfont=font;vskip(wh[1]*cfmt.lineskipfac);xy_str(x,0,str,action,null,wh);font=gene.curfont}
j=i+1}
vskip(parskip);p_flush()
break
case'f':case'j':j=0
while(1){i=text.indexOf('\n\n',j)
if(i<0)
words=text.slice(j)
else
words=text.slice(j,i);words=words.split(/\s+/);w=k=0
font=gene.curfont
for(j=0;j<words.length;j++){ww=strwh(words[j]+' ')[0];w+=ww
if(w>=strlw){str=words.slice(k,j).join(' ');gene.curfont=font;wh=strwh(str);gene.curfont=font;vskip(wh[1]*cfmt.lineskipfac);xy_str(0,0,str,action,strlw,wh);font=gene.curfont;k=j;w=ww}}
if(w!=0){str=words.slice(k).join(' ');gene.curfont=font;wh=strwh(str);gene.curfont=font;vskip(wh[1]*cfmt.lineskipfac);xy_str(0,0,str,null,null,wh)}
vskip(parskip);p_flush()
if(i<0)
break
while(text[i+2]=='\n'){vskip(lineskip);i++}
if(i==text.length)
break
p_start();use_font(gene.curfont);j=i+2}
break}}
function put_words(words){var p,i,j,n,nw,i2,i_end,have_text;function put_wline(p,x,right){var i=0,j,k
if(p[i]=='$'&&p[i+1]>='0'&&p[i+1]<='9')
i+=2;k=0;j=i
if((p[i]>='0'&&p[i]<='9')||p[i+1]=='.'){while(i<p.length){i++
if(p[i]==' '||p[i-1]==':'||p[i-1]=='.')
break}
k=i
while(p[i]==' ')
i++}
if(k!=0)
xy_str(x,0,p.slice(j,k),'r')
if(i<p.length)
xy_str(x+5,0,p.slice(i),'l')
return i>=p.length&&k==0}
set_font("words")
var middle=get_lwidth()/2,max2col=(middle-45.)/cwidf('a');n=0;words=words.split('\n');nw=words.length
for(i=0;i<nw;i++){p=words[i]
if(p.length>max2col){n=0
break}
if(!p){if(have_text){n++;have_text=false}}else{have_text=true}}
if(n>0){i=n=((n+1)/2)|0;have_text=false
for(i_end=0;i_end<nw;i_end++){p=words[i_end];j=0
while(p[j]==' ')
j++
if(j==p.length){if(have_text&&--i<=0)
break
have_text=false}else{have_text=true}}
i2=i_end+1}else{i2=i_end=nw}
vskip(cfmt.wordsspace)
for(i=0;i<i_end||i2<nw;i++){if(i<i_end&&words[i].length==0){blk_out();use_font(gene.curfont)}
vskip(cfmt.lineskipfac*gene.curfont.size)
if(i<i_end)
put_wline(words[i],45.,0)
if(i2<nw){if(put_wline(words[i2],20.+middle,1)){if(--n==0){if(i<i_end){n++}else if(i2<words.length-1){middle*=.6}}}
i2++}}}
function put_history(){var i,j,c,str,font,h,w,wh,head,names=cfmt.infoname.split("\n"),n=names.length
for(i=0;i<n;i++){c=names[i][0]
if(cfmt.writefields.indexOf(c)<0)
continue
str=info[c]
if(!str)
continue
if(!font){font=true;set_font("history");vskip(cfmt.textspace);h=gene.curfont.size*cfmt.lineskipfac}
head=names[i].slice(2)
if(head[0]=='"')
head=head.slice(1,-1);vskip(h);wh=strwh(head);xy_str(0,0,head,null,null,wh);w=wh[0];str=str.split('\n');xy_str(w,0,str[0])
for(j=1;j<str.length;j++){vskip(h);xy_str(w,0,str[j])}
vskip(h*.3);blk_out();use_font(gene.curfont)}}
var info_font_init={A:"info",C:"composer",O:"composer",P:"parts",Q:"tempo",R:"info",T:"title",X:"title"}
function write_headform(lwidth){var c,font,font_name,align,x,y,sz,info_val={},info_font=clone(info_font_init),info_sz={A:cfmt.infospace,C:cfmt.composerspace,O:cfmt.composerspace,R:cfmt.infospace},info_nb={}
var fmt="",p=cfmt.titleformat,j=0,i=0
while(1){while(p[i]==' ')
i++
if(i>=p.length)
break
c=p[i++]
if(c<'A'||c>'Z'){if(c=='+'){if(fmt.length==0||fmt.slice(-1)=='+')
continue
fmt=fmt.slice(0,-1)+'+'}else if(c==','){if(fmt.slice(-1)=='+')
fmt=fmt.slice(0,-1)+'l'
fmt+='\n'}
continue}
if(!info_val[c]){if(!info[c])
continue
info_val[c]=info[c].split('\n');info_nb[c]=1}else{info_nb[c]++}
fmt+=c
switch(p[i]){case'-':fmt+='l'
i++
break
case'0':fmt+='c'
i++
break
case'1':fmt+='r'
i++
break
default:fmt+='c'
break}}
if(fmt.slice(-1)=='+')
fmt=fmt.slice(0,-1)+'l';fmt+='\n'
var ya={l:cfmt.titlespace,c:cfmt.titlespace,r:cfmt.titlespace},xa={l:0,c:lwidth*.5,r:lwidth},yb={},str;p=fmt;i=0
while(1){yb.l=yb.c=yb.r=y=0;j=i
while(1){c=p[j++]
if(c=='\n')
break
align=p[j++]
if(align=='+')
align=p[j+1]
else if(yb[align]!=0)
continue
str=info_val[c]
if(!str)
continue
font_name=info_font[c]
if(!font_name)
font_name="history";font=get_font(font_name);sz=font.size*1.1
if(info_sz[c])
sz+=info_sz[c]
if(y<sz)
y=sz;yb[align]=sz}
ya.l+=y-yb.l;ya.c+=y-yb.c;ya.r+=y-yb.r
while(1){c=p[i++]
if(c=='\n')
break
align=p[i++]
if(info_val[c].length==0)
continue
str=info_val[c].shift()
if(align=='+'){info_nb[c]--;c=p[i++];align=p[i++]
if(info_val[c].length>0){if(str)
str+=' '+info_val[c].shift()
else
str=' '+info_val[c].shift()}}
font_name=info_font[c]
if(!font_name)
font_name="history";font=get_font(font_name);sz=font.size*1.1
if(info_sz[c])
sz+=info_sz[c];set_font(font);x=xa[align];y=ya[align]+sz
if(c=='Q'){self.set_width(glovar.tempo)
if(!glovar.tempo.del){if(align!='l'){var w=tempo_width(glovar.tempo)
if(align=='c')
w*=.5;x-=w}
write_tempo(glovar.tempo,x,-y)}}else if(str){xy_str(x,-y,str,align)}
if(c=='T'){font_name=info_font.T="subtitle";info_sz.T=cfmt.subtitlespace}
if(info_nb[c]<=1){if(c=='T'){font=get_font(font_name);sz=font.size*1.1
if(info_sz[c])
sz+=info_sz[c];set_font(font)}
while(info_val[c].length>0){y+=sz;str=info_val[c].shift();xy_str(x,-y,str,align)}}
info_nb[c]--;ya[align]=y}
if(ya.c>ya.l)
ya.l=ya.c
if(ya.r>ya.l)
ya.l=ya.r
if(i>=fmt.length)
break
ya.c=ya.r=ya.l}
vskip(ya.l)}
function write_heading(){var i,j,area,composer,origin,rhythm,down1,down2,lwidth=get_lwidth()
blk_out();vskip(cfmt.topspace)
if(cfmt.titleformat){write_headform(lwidth);vskip(cfmt.musicspace)
return}
if(info.T&&cfmt.writefields.indexOf('T')>=0){i=0
while(1){j=info.T.indexOf("\n",i)
if(j<0){write_title(info.T.substring(i),i!=0)
break}
write_title(info.T.slice(i,j),i!=0);i=j+1}}
down1=down2=0
if(parse.ckey.k_bagpipe&&!cfmt.infoline&&cfmt.writefields.indexOf('R')>=0)
rhythm=info.R
if(rhythm){set_font("composer");xy_str(0,-cfmt.composerspace,rhythm);down1=cfmt.composerspace}
area=info.A
if(cfmt.writefields.indexOf('C')>=0)
composer=info.C
if(cfmt.writefields.indexOf('O')>=0)
origin=info.O
if(composer||origin||cfmt.infoline){var xcomp,align;set_font("composer");vskip(cfmt.composerspace)
if(cfmt.aligncomposer<0){xcomp=0;align=' '}else if(cfmt.aligncomposer==0){xcomp=lwidth*.5;align='c'}else{xcomp=lwidth;align='r'}
down2=down1
if(composer||origin){if(cfmt.aligncomposer>=0&&down1!=down2)
vskip(down1-down2);i=0
while(1){vskip(gene.curfont.size)
if(composer)
j=composer.indexOf("\n",i)
else
j=-1
if(j<0){put_inf2r(xcomp,0,composer?composer.substring(i):null,origin,align)
break}
xy_str(xcomp,0,composer.slice(i,j),align);down1+=gene.curfont.size;i=j+1}
if(down2>down1)
vskip(down2-down1)}
rhythm=rhythm?null:info.R
if((rhythm||area)&&cfmt.infoline){set_font("info");vskip(gene.curfont.size+cfmt.infospace);put_inf2r(lwidth,0,rhythm,area,'r');down1+=gene.curfont.size+cfmt.infospace}}else{down2=cfmt.composerspace}
if(info.P&&cfmt.writefields.indexOf('P')>=0){set_font("parts");down1=cfmt.partsspace+gene.curfont.size-down1
if(down1>0)
down2+=down1
if(down2>.01)
vskip(down2);xy_str(0,0,info.P);down2=0}
vskip(down2+cfmt.musicspace)}
var output="",style='\
\ntext, tspan{fill:currentColor}\
\n.stroke{stroke:currentColor;fill:none}\
\n.bW{stroke:currentColor;fill:none;stroke-width:1}\
\n.bthW{stroke:currentColor;fill:none;stroke-width:3}\
\n.slW{stroke:currentColor;fill:none;stroke-width:.7}\
\n.slthW{stroke:currentColor;fill:none;stroke-width:1.5}\
\n.sW{stroke:currentColor;fill:none;stroke-width:.7}',font_style='',posx=cfmt.leftmargin/cfmt.scale,posy=0,img={width:cfmt.pagewidth,lm:cfmt.leftmargin,rm:cfmt.rightmargin},defined_glyph={},defs='',fulldefs='',stv_g={scale:1,dy:0,st:-1,v:-1,g:0},block={}
var tgls={"mtr ":{x:0,y:0,c:"\u0020"},brace:{x:0,y:0,c:"\ue000"},hl:{x:-4,y:0,c:"\ue022"},hl1:{x:-6,y:0,c:"\ue023"},ghl:{x:-4,y:0,c:"\ue024"},lphr:{x:0,y:24,c:"\ue030"},mphr:{x:0,y:24,c:"\ue038"},sphr:{x:0,y:27,c:"\ue039"},rdots:{x:-1,y:0,c:"\ue043"},dsgn:{x:-4,y:-4,c:"\ue045"},dcap:{x:-4,y:-4,c:"\ue046"},sgno:{x:-6,y:0,c:"\ue047"},coda:{x:-12,y:-6,c:"\ue048"},tclef:{x:-8,y:0,c:"\ue050"},cclef:{x:-8,y:0,c:"\ue05c"},bclef:{x:-8,y:0,c:"\ue062"},pclef:{x:-6,y:0,c:"\ue069"},spclef:{x:-6,y:0,c:"\ue069"},stclef:{x:-8,y:0,c:"\ue07a"},scclef:{x:-8,y:0,c:"\ue07b"},sbclef:{x:-7,y:0,c:"\ue07c"},oct:{x:0,y:2,c:"\ue07d"},mtr0:{x:0,y:0,c:"\ue080"},mtr1:{x:0,y:0,c:"\ue081"},mtr2:{x:0,y:0,c:"\ue082"},mtr3:{x:0,y:0,c:"\ue083"},mtr4:{x:0,y:0,c:"\ue084"},mtr5:{x:0,y:0,c:"\ue085"},mtr6:{x:0,y:0,c:"\ue086"},mtr7:{x:0,y:0,c:"\ue087"},mtr8:{x:0,y:0,c:"\ue088"},mtr9:{x:0,y:0,c:"\ue089"},mtrC:{x:0,y:0,c:"\ue08a"},"mtr+":{x:0,y:0,c:"\ue08c"},"mtr(":{x:0,y:0,c:"\ue094"},"mtr)":{x:0,y:0,c:"\ue095"},HDD:{x:-7,y:0,c:"\ue0a0"},breve:{x:-7,y:0,c:"\ue0a1"},HD:{x:-5.2,y:0,c:"\ue0a2"},Hd:{x:-3.8,y:0,c:"\ue0a3"},hd:{x:-3.7,y:0,c:"\ue0a4"},ghd:{x:2,y:0,c:"\ue0a4",sc:.66},pshhd:{x:-3.7,y:0,c:"\ue0a9"},pfthd:{x:-3.7,y:0,c:"\ue0b3"},x:{x:-3.7,y:0,c:"\ue0a9"},"circle-x":{x:-3.7,y:0,c:"\ue0b3"},srep:{x:-5,y:0,c:"\ue101"},"dot+":{x:-5,y:0,sc:.7,c:"\ue101"},diamond:{x:-4,y:0,c:"\ue1b9"},triangle:{x:-4,y:0,c:"\ue1bb"},dot:{x:-2,y:0,c:"\ue1e7"},flu1:{x:-.3,y:0,c:"\ue240"},fld1:{x:-.3,y:0,c:"\ue241"},flu2:{x:-.3,y:0,c:"\ue242"},fld2:{x:-.3,y:0,c:"\ue243"},flu3:{x:-.3,y:3.5,c:"\ue244"},fld3:{x:-.3,y:-4,c:"\ue245"},flu4:{x:-.3,y:8,c:"\ue246"},fld4:{x:-.3,y:-9,c:"\ue247"},flu5:{x:-.3,y:12.5,c:"\ue248"},fld5:{x:-.3,y:-14,c:"\ue249"},"acc-1":{x:-1,y:0,c:"\ue260"},acc3:{x:-1,y:0,c:"\ue261"},acc1:{x:-2,y:0,c:"\ue262"},acc2:{x:-3,y:0,c:"\ue263"},"acc-2":{x:-3,y:0,c:"\ue264"},"acc-1_1_4":{x:-2,y:0,c:"\ue280"},"acc-1_3_4":{x:-3,y:0,c:"\ue281"},acc1_1_4:{x:-1,y:0,c:"\ue282"},acc1_3_4:{x:-3,y:0,c:"\ue283"},accent:{x:-3,y:0,c:"\ue4a0"},stc:{x:-1,y:-2,c:"\ue4a2"},emb:{x:-4,y:-2,c:"\ue4a4"},wedge:{x:-1,y:0,c:"\ue4a8"},marcato:{x:-3,y:0,c:"\ue4ac"},hld:{x:-7,y:0,c:"\ue4c0"},brth:{x:0,y:0,c:"\ue4ce"},r00:{x:-1.5,y:0,c:"\ue4e1"},r0:{x:-1.5,y:0,c:"\ue4e2"},r1:{x:-3.5,y:-6,c:"\ue4e3"},r2:{x:-3.2,y:0,c:"\ue4e4"},r4:{x:-3,y:0,c:"\ue4e5"},r8:{x:-3,y:0,c:"\ue4e6"},r16:{x:-4,y:0,c:"\ue4e7"},r32:{x:-4,y:0,c:"\ue4e8"},r64:{x:-4,y:0,c:"\ue4e9"},r128:{x:-4,y:0,c:"\ue4ea"},mrest:{x:-10,y:0,c:"\ue4ee"},mrep:{x:-6,y:0,c:"\ue500"},mrep2:{x:-9,y:0,c:"\ue501"},p:{x:-4,y:-6,c:"\ue520"},f:{x:-4,y:-6,c:"\ue522"},pppp:{x:-4,y:-6,c:"\ue529"},ppp:{x:-4,y:-6,c:"\ue52a"},pp:{x:-4,y:-6,c:"\ue52b"},mp:{x:-4,y:-6,c:"\ue52c"},mf:{x:-4,y:-6,c:"\ue52d"},ff:{x:-4,y:-6,c:"\ue52f"},fff:{x:-4,y:-6,c:"\ue530"},ffff:{x:-4,y:-6,c:"\ue531"},sfz:{x:-4,y:-6,c:"\ue539"},trl:{x:-4,y:-4,c:"\ue566"},turn:{x:-5,y:-4,c:"\ue567"},turnx:{x:-5,y:-4,c:"\ue569"},umrd:{x:-7,y:-2,c:"\ue56c"},lmrd:{x:-7,y:-2,c:"\ue56d"},dplus:{x:-4,y:10,c:"\ue582"},sld:{x:-8,y:12,c:"\ue5d0"},grm:{x:-2,y:0,c:"\ue5e2"},dnb:{x:-4,y:0,c:"\ue610"},upb:{x:-3,y:0,c:"\ue612"},opend:{x:-2,y:0,c:"\ue614"},roll:{x:0,y:0,c:"\ue618"},thumb:{x:0,y:0,c:"\ue624"},snap:{x:-2,y:0,c:"\ue630"},ped:{x:-10,y:0,c:"\ue650"},pedoff:{x:-5,y:0,c:"\ue655"},mtro:{x:0,y:0,c:"\ue911"},mtrc:{x:0,y:0,c:"\ue915"},"mtr.":{x:0,y:0,c:"\ue920"},"mtr|":{x:0,y:0,c:"\ue925"},longa:{x:-3.7,y:0,c:"\ue95d"},custos:{x:-4,y:3,c:"\uea02"},ltr:{x:2,y:6,c:"\ueaa4"}}
var glyphs={}
function m_gl(s){return s.replace(/[Cco]\||[co]\.|./g,function(e){var m=tgls["mtr"+e]
if(!m.x&&!m.y)
return m.c
return'<tspan dx="'+m.x.toFixed(1)+'" dy="'+m.y.toFixed(1)+'">'+
m.c+'</tspan>'})}
function def_use(gl){var i,j,g
if(defined_glyph[gl])
return
defined_glyph[gl]=true;g=glyphs[gl]
if(!g){error(1,null,"Unknown glyph: '$1'",gl)
return}
j=0
while(1){i=g.indexOf('xlink:href="#',j)
if(i<0)
break
i+=13;j=g.indexOf('"',i);def_use(g.slice(i,j))}
defs+='\n'+g}
function defs_add(text){var i,j,gl,tag,is,ie=0
text=text.replace(/<!--.*?-->/g,'')
while(1){is=text.indexOf('<',ie);if(is<0)
break
i=text.indexOf('id="',is)
if(i<0)
break
i+=4;j=text.indexOf('"',i);if(j<0)
break
gl=text.slice(i,j);ie=text.indexOf('>',j);if(ie<0)
break
if(text[ie-1]=='/'){ie++}else{i=text.indexOf(' ',is);if(i<0)
break
tag=text.slice(is+1,i);ie=text.indexOf('</'+tag+'>',ie)
if(ie<0)
break
ie+=3+tag.length}
if(text.substr(is,7)=='<filter')
fulldefs+='\n'+text.slice(is,ie)
else
glyphs[gl]=text.slice(is,ie)}}
function set_g(){if(stv_g.started){stv_g.started=false;output+="</g>\n"}
if(stv_g.scale==1&&!stv_g.color)
return
output+='<g '
if(stv_g.scale!=1){if(stv_g.st<0)
output+=voice_tb[stv_g.v].scale_str
else if(stv_g.v<0)
output+=staff_tb[stv_g.st].scale_str
else
output+='transform="translate(0,'+
(posy-stv_g.dy).toFixed(1)+') scale('+stv_g.scale.toFixed(2)+')"'}
if(stv_g.color){if(stv_g.scale!=1)
output+=' ';output+='color="'+stv_g.color+'" fill="'+stv_g.color+'"'}
output+=">\n";stv_g.started=true}
function set_color(color){if(color==stv_g.color)
return undefined
var old_color=stv_g.color;stv_g.color=color;set_g()
return old_color}
function set_sscale(st){var new_scale,dy
if(st!=stv_g.st&&stv_g.scale!=1)
stv_g.scale=0;new_scale=st>=0?staff_tb[st].staffscale:1
if(st>=0&&new_scale!=1)
dy=staff_tb[st].y
else
dy=posy
if(new_scale==stv_g.scale&&dy==stv_g.dy)
return
stv_g.scale=new_scale;stv_g.dy=dy;stv_g.st=st;stv_g.v=-1;set_g()}
function set_scale(s){var new_dy,new_scale=s.p_v.scale
if(new_scale==1){set_sscale(s.st)
return}
new_dy=posy
if(staff_tb[s.st].staffscale!=1){new_scale*=staff_tb[s.st].staffscale;new_dy=staff_tb[s.st].y}
if(new_scale==stv_g.scale&&stv_g.dy==posy)
return
stv_g.scale=new_scale;stv_g.dy=new_dy;stv_g.st=staff_tb[s.st].staffscale==1?-1:s.st;stv_g.v=s.v;set_g()}
function set_dscale(st,no_scale){if(output){if(stv_g.st<0){staff_tb[0].output+=output}else if(stv_g.scale==1){staff_tb[stv_g.st].output+=output}else{staff_tb[stv_g.st].sc_out+=output}
output=""}
if(st<0)
stv_g.scale=1
else
stv_g.scale=no_scale?1:staff_tb[st].staffscale;stv_g.st=st;stv_g.dy=0}
function delayed_update(){var st,new_out,text
for(st=0;st<=nstaff;st++){if(staff_tb[st].sc_out){output+='<g '+staff_tb[st].scale_str+'>\n'+
staff_tb[st].sc_out+'</g>\n';staff_tb[st].sc_out=""}
if(!staff_tb[st].output)
continue
output+='<g transform="translate(0,'+
(-staff_tb[st].y).toFixed(1)+')">\n'+
staff_tb[st].output+'</g>\n';staff_tb[st].output=""}}
var anno_type=['bar','clef','custos','','grace','key','meter','Zrest','note','part','rest','yspace','staves','Break','tempo','','block','remark']
function anno_out(s,t,f){if(s.istart==undefined)
return
var type=s.type,h=s.ymx-s.ymn+4,wl=s.wl||2,wr=s.wr||2
if(s.grace)
type=C.GRACE
f(t||anno_type[type],s.istart,s.iend,s.x-wl-2,staff_tb[s.st].y+s.ymn+h-2,wl+wr+4,h,s)}
function a_start(s,t){anno_out(s,t,user.anno_start)}
function a_stop(s,t){anno_out(s,t,user.anno_stop)}
function empty_function(){}
var anno_start=user.anno_start?a_start:empty_function,anno_stop=user.anno_stop?a_stop:empty_function
function out_XYAB(str,x,y,a,b){x=sx(x);y=sy(y);output+=str.replace(/X|Y|A|B|F|G/g,function(c){switch(c){case'X':return x.toFixed(1)
case'Y':return y.toFixed(1)
case'A':return a
case'B':return b
case'F':return a.toFixed(1)
default:return b.toFixed(1)}})}
function g_open(x,y,rot,sx,sy){out_XYAB('<g transform="translate(X,Y',x,y);if(rot)
output+=') rotate('+rot.toFixed(2)
if(sx){if(sy)
output+=') scale('+sx.toFixed(2)+', '+sy.toFixed(2)
else
output+=') scale('+sx.toFixed(2)}
output+=')">\n';stv_g.g++}
function g_close(){stv_g.g--;output+='</g>\n'}
Abc.prototype.out_svg=function(str){output+=str}
function sx(x){if(stv_g.g)
return x
return(x+posx)/stv_g.scale}
Abc.prototype.sx=sx
function sy(y){if(stv_g.g)
return-y
if(stv_g.scale==1)
return posy-y
if(stv_g.v>=0)
return(stv_g.dy-y)/voice_tb[stv_g.v].scale
return stv_g.dy-y}
Abc.prototype.sy=sy;Abc.prototype.sh=function(h){if(stv_g.st<0)
return h/stv_g.scale
return h}
Abc.prototype.ax=function(x){return x+posx}
Abc.prototype.ay=function(y){if(stv_g.st<0)
return posy-y
return posy+(stv_g.dy-y)*stv_g.scale-stv_g.dy}
Abc.prototype.ah=function(h){if(stv_g.st<0)
return h
return h*stv_g.scale}
function out_sxsy(x,sep,y){x=sx(x);y=sy(y);output+=x.toFixed(1)+sep+y.toFixed(1)}
Abc.prototype.out_sxsy=out_sxsy
function xypath(x,y,fill){if(fill)
out_XYAB('<path d="mX Y',x,y)
else
out_XYAB('<path class="stroke" d="mX Y',x,y)}
Abc.prototype.xypath=xypath
function xygl(x,y,gl){var tgl=tgls[gl]
if(tgl&&!glyphs[gl]){x+=tgl.x*stv_g.scale;y-=tgl.y
if(tgl.sc)
out_XYAB('<text transform="translate(X,Y) scale(A)">B</text>\n',x,y,tgl.sc,tgl.c);else
out_XYAB('<text x="X" y="Y">A</text>\n',x,y,tgl.c)
return}
if(!glyphs[gl]){error(1,null,'no definition of $1',gl)
return}
def_use(gl);out_XYAB('<use x="X" y="Y" xlink:href="#A"/>\n',x,y,gl)}
function out_acciac(x,y,dx,dy,up){if(up){x-=1;y+=4}else{x-=5;y-=4}
out_XYAB('<path class="stroke" d="mX YlF G"/>\n',x,y,dx,-dy)}
function out_bnum(x,y,str){out_XYAB('<text style="font:italic 12px serif"\n\
 x="X" y="Y" text-anchor="middle">A</text>\n',x,y,str.toString())}
function out_brace(x,y,h){x+=posx-6;y=posy-y;h/=24;output+='<text transform="translate('+
x.toFixed(1)+','+y.toFixed(1)+') scale(2.5,'+h.toFixed(2)+')">'+tgls.brace.c+'</text>\n'}
function out_bracket(x,y,h){x+=posx-5;y=posy-y-3;h+=2;output+='<path d="m'+x.toFixed(1)+' '+y.toFixed(1)+'\n\
 c10.5 1 12 -4.5 12 -3.5c0 1 -3.5 5.5 -8.5 5.5\n\
 v'+h.toFixed(1)+'\n\
 c5 0 8.5 4.5 8.5 5.5c0 1 -1.5 -4.5 -12 -3.5"/>\n'}
function out_hyph(x,y,w){var n,a_y,d=25+((w/20)|0)*3
if(w>15.)
n=((w-15)/d)|0
else
n=0;x+=(w-d*n-5)/2;out_XYAB('<path class="stroke" stroke-width="1.2"\n\
 stroke-dasharray="5,A"\n\
 d="mX YhB"/>\n',x,y+6,Math.round((d-5)/stv_g.scale),d*n+5)}
function out_stem(x,y,h,grace,nflags,straight){var dx=grace?GSTEM_XOFF:3.5,slen=-h
if(h<0)
dx=-dx;x+=dx*stv_g.scale
if(stv_g.v>=0)
slen/=voice_tb[stv_g.v].scale;out_XYAB('<path class="sW" d="mX YvF"/>\n',x,y,slen)
if(!nflags)
return
y+=h
if(h>0){if(!straight){if(!grace){xygl(x,y,"flu"+nflags)
return}else{output+='<path d="'
if(nflags==1){out_XYAB('MX Yc0.6 3.4 5.6 3.8 3 10\n\
 1.2 -4.4 -1.4 -7 -3 -7\n',x,y)}else{while(--nflags>=0){out_XYAB('MX Yc1 3.2 5.6 2.8 3.2 8\n\
 1.4 -4.8 -2.4 -5.4 -3.2 -5.2\n',x,y);y-=3.5}}}}else{output+='<path d="'
if(!grace){y+=1
while(--nflags>=0){out_XYAB('MX Yl7 3.2 0 3.2 -7 -3.2z\n',x,y);y-=5.4}}else{while(--nflags>=0){out_XYAB('MX Yl3 1.5 0 2 -3 -1.5z\n',x,y);y-=3}}}}else{if(!straight){if(!grace){xygl(x,y,"fld"+nflags)
return}else{output+='<path d="'
if(nflags==1){out_XYAB('MX Yc0.6 -3.4 5.6 -3.8 3 -10\n\
 1.2 4.4 -1.4 7 -3 7\n',x,y)}else{while(--nflags>=0){out_XYAB('MX Yc1 -3.2 5.6 -2.8 3.2 -8\n\
 1.4 4.8 -2.4 5.4 -3.2 5.2\n',x,y);y+=3.5}}}}else{output+='<path d="'
if(!grace){y+=1
while(--nflags>=0){out_XYAB('MX Yl7 -3.2 0 -3.2 -7 3.2z\n',x,y);y+=5.4}}}}
output+='"/>\n'}
function out_trem(x,y,ntrem){out_XYAB('<path d="mX Y\n\t',x-4.5,y)
while(1){output+='l9 -3v3l-9 3z'
if(--ntrem<=0)
break
output+='m0 5.4'}
output+='"/>\n'}
function out_tubr(x,y,dx,dy,up){var h=up?-3:3;y+=h;dx/=stv_g.scale;output+='<path class="stroke" d="m';out_sxsy(x,' ',y);output+='v'+h.toFixed(1)+'l'+dx.toFixed(1)+' '+(-dy).toFixed(1)+'v'+(-h).toFixed()+'"/>\n'}
function out_tubrn(x,y,dx,dy,up,str){var sw=str.length*10,h=up?-3:3;out_XYAB('<text style="font:italic 12px serif"\n\
 x="X" y="Y" text-anchor="middle">A</text>\n',x+dx/2,y+dy/2,str);dx/=stv_g.scale
if(!up)
y+=6;output+='<path class="stroke" d="m';out_sxsy(x,' ',y);output+='v'+h.toFixed(1)+'m'+dx.toFixed(1)+' '+(-dy).toFixed(1)+'v'+(-h).toFixed(1)+'"/>\n'+'<path class="stroke" stroke-dasharray="'+
((dx-sw)/2).toFixed(1)+' '+sw.toFixed(1)+'" d="m';out_sxsy(x,' ',y-h);output+='l'+dx.toFixed(1)+' '+(-dy).toFixed(1)+'"/>\n'}
function out_wln(x,y,w){out_XYAB('<path class="stroke" stroke-width="0.8" d="mX YhF"/>\n',x,y+3,w)}
var deco_str_style={crdc:{dx:0,dy:5,style:'font:italic 14px serif'},dacs:{dx:0,dy:3,style:'font:16px serif',anchor:' text-anchor="middle"'},fng:{dx:0,dy:1,style:'font-family:Bookman; font-size:8px',anchor:' text-anchor="middle"'},pf:{dx:0,dy:5,style:'font:italic bold 16px serif'},'@':{dx:0,dy:5,style:'font: 12px sans-serif'}}
function out_deco_str(x,y,name,str){var a,f,a_deco=deco_str_style[name]
if(!a_deco){xygl(x,y,name)
return}
x+=a_deco.dx;y+=a_deco.dy;if(!a_deco.def){style+="\n."+name+" {"+a_deco.style+"}";a_deco.def=true}
out_XYAB('<text x="X" y="Y" class="A"B>',x,y,name,a_deco.anchor||"");set_font("annotation");out_str(str);output+='</text>\n'}
function out_arp(x,y,val){g_open(x,y,270);x=0;val=Math.ceil(val/6)
while(--val>=0){xygl(x,6,"ltr");x+=6}
g_close()}
function out_cresc(x,y,val,defl){x+=val;val=-val;out_XYAB('<path class="stroke"\n\
 d="mX YlA ',x,y+5,val)
if(defl.nost)
output+='-2.2m0 -3.6l'+(-val).toFixed(1)+' -2.2"/>\n'
else
output+='-4l'+(-val).toFixed(1)+' -4"/>\n'}
function out_dim(x,y,val,defl){out_XYAB('<path class="stroke"\n\
 d="mX YlA ',x,y+5,val)
if(defl.noen)
output+='-2.2m0 -3.6l'+(-val).toFixed(1)+' -2.2"/>\n'
else
output+='-4l'+(-val).toFixed(1)+' -4"/>\n'}
function out_ltr(x,y,val){y+=4;val=Math.ceil(val/6)
while(--val>=0){xygl(x,y,"ltr");x+=6}}
function out_lped(x,y,val,defl){y+=4;if(!defl.nost)
xygl(x,y,"ped");if(!defl.noen)
xygl(x+val+6,y,"pedoff")}
function out_8va(x,y,val,defl){if(!defl.nost){out_XYAB('<text x="X" y="Y" \
style="font:italic bold 12px serif">8\
<tspan dy="-4" style="font-size:10px">va</tspan></text>\n',x-8,y);x+=12;val-=12}else{val-=5}
y+=6;out_XYAB('<path class="stroke" stroke-dasharray="6,6" d="mX YhF"/>\n',x,y,val)
if(!defl.noen)
out_XYAB('<path class="stroke" d="mX Yv6"/>\n',x+val,y)}
function out_8vb(x,y,val,defl){if(!defl.nost){out_XYAB('<text x="X" y="Y" \
style="font:italic bold 12px serif">8\
<tspan dy="-4" style="font-size:10px">vb</tspan></text>\n',x-8,y);x+=4;val-=4}else{val-=5}
out_XYAB('<path class="stroke" stroke-dasharray="6,6" d="mX YhF"/>\n',x,y,val)
if(!defl.noen)
out_XYAB('<path class="stroke" d="mX Yv-6"/>\n',x+val,y)}
function out_15ma(x,y,val,defl){if(!defl.nost){out_XYAB('<text x="X" y="Y" \
style="font:italic bold 12px serif">15\
<tspan dy="-4" style="font-size:10px">ma</tspan></text>\n',x-10,y);x+=20;val-=20}else{val-=5}
y+=6;out_XYAB('<path class="stroke" stroke-dasharray="6,6" d="mX YhF"/>\n',x,y,val)
if(!defl.noen)
out_XYAB('<path class="stroke" d="mX Yv6"/>\n',x+val,y)}
function out_15mb(x,y,val,defl){if(!defl.nost){out_XYAB('<text x="X" y="Y" \
style="font:italic bold 12px serif">15\
<tspan dy="-4" style="font-size:10px">mb</tspan></text>\n',x-10,y);x+=7;val-=7}else{val-=5}
out_XYAB('<path class="stroke" stroke-dasharray="6,6" d="mX YhF"/>\n',x,y,val)
if(!defl.noen)
out_XYAB('<path class="stroke" d="mX Yv-6"/>\n',x+val,y)}
var deco_val_tb={arp:out_arp,cresc:out_cresc,dim:out_dim,ltr:out_ltr,lped:out_lped,"8va":out_8va,"8vb":out_8vb,"15ma":out_15ma,"15mb":out_15mb}
function out_deco_val(x,y,name,val,defl){if(deco_val_tb[name])
deco_val_tb[name](x,y,val,defl)
else
error(1,null,"No function for decoration '$1'",name)}
function out_glisq(x2,y2,de){var de1=de.start,x1=de1.x,y1=de1.y+staff_tb[de1.st].y,ar=Math.atan2(y1-y2,x2-x1),a=ar/Math.PI*180,len=(x2-x1)/Math.cos(ar);g_open(x1,y1,a);x1=de1.s.dots?13+de1.s.xmx:8;len=(len-x1-6)/6|0
if(len<1)
len=1
while(--len>=0){xygl(x1,0,"ltr");x1+=6}
g_close()}
function out_gliss(x2,y2,de){var de1=de.start,x1=de1.x,y1=de1.y+staff_tb[de1.st].y,ar=-Math.atan2(y2-y1,x2-x1),a=ar/Math.PI*180,len=(x2-x1)/Math.cos(ar);g_open(x1,y1,a);x1=de1.s.dots?13+de1.s.xmx:8;len-=x1+8;xypath(x1,0);output+='h'+len.toFixed(1)+'" stroke-width="1"/>\n';g_close()}
var deco_l_tb={glisq:out_glisq,gliss:out_gliss}
function out_deco_long(x,y,de){var name=de.dd.glyph
if(deco_l_tb[name])
deco_l_tb[name](x,y,de)
else
error(1,null,"No function for decoration '$1'",name)}
function vskip(h){posy+=h}
function svg_flush(){if(multicol||!output||!user.img_out||posy==0)
return
var head='<svg xmlns="http://www.w3.org/2000/svg" version="1.1"\n\
 xmlns:xlink="http://www.w3.org/1999/xlink"\n\
 color="',g=''
if(cfmt.fgcolor)
head+=cfmt.fgcolor+'" fill="'+cfmt.fgcolor+'"'
else
head+='black"';head+=' class="music" stroke-width=".7"'
if(cfmt.bgcolor)
head+=' style="background-color: '+cfmt.bgcolor+'"';posy*=cfmt.scale
if(user.imagesize){head+='\n'+
user.imagesize+' viewBox="0 0 '+img.width.toFixed(0)+' '+
posy.toFixed(0)+'">\n'}else{head+='\n\twidth="'+img.width.toFixed(0)+'px" height="'+posy.toFixed(0)+'px">\n'}
if(style||font_style||musicfont){head+='<style type="text/css">'+style+font_style
if(musicfont){if(musicfont.indexOf('(')>0){head+='\n.music{font:24px music}\n\
@font-face {\n\
  font-family:"music";\n\
  src:'+musicfont+'}'}else{head+='\n.music{font:24px '+musicfont+'}'}}
head+='\n</style>\n'}
defs+=fulldefs
if(defs)
head+='<defs>'+defs+'\n</defs>\n'
if(cfmt.scale!=1){head+='<g class="g" transform="scale('+
cfmt.scale.toFixed(2)+')">\n';g='</g>\n'}
if(psvg)
psvg.ps_flush(true);user.img_out(head+output+g+"</svg>");output=""
font_style=''
if(cfmt.fullsvg){defined_glyph={}
for(var i=0;i<font_tb.length;i++)
font_tb[i].used=false}else{musicfont='';style='';fulldefs=''}
defs='';posy=0}
function blk_out(){if(multicol||!user.img_out)
return
blk_flush()
if(user.page_format&&!block.started){block.started=true
if(block.newpage){block.newpage=false;user.img_out('<div class="nobrk newpage">')}else{user.img_out('<div class="nobrk">')}}}
Abc.prototype.blk_out=blk_out
function blk_flush(){svg_flush()
if(block.started){block.started=false;user.img_out('</div>')}}
Abc.prototype.blk_flush=blk_flush
var par_sy,cur_sy,voice_tb,curvoice,staves_found,vover,tsfirst
function voice_filter(){var opt
function vfilt(opts,opt){var i,sel=new RegExp(opt)
if(sel.test(curvoice.id)||sel.test(curvoice.nm)){for(i=0;i<opts.length;i++)
self.do_pscom(opts[i])}}
if(parse.voice_opts)
for(opt in parse.voice_opts){if(parse.voice_opts.hasOwnProperty(opt))
vfilt(parse.voice_opts[opt],opt)}
if(parse.tune_v_opts)
for(opt in parse.tune_v_opts){if(parse.tune_v_opts.hasOwnProperty(opt))
vfilt(parse.tune_v_opts[opt],opt)}}
function sym_link(s){if(!s.fname)
set_ref(s)
if(!curvoice.ignore){parse.last_sym=s;s.prev=curvoice.last_sym
if(curvoice.last_sym)
curvoice.last_sym.next=s
else
curvoice.sym=s;curvoice.last_sym=s}
s.v=curvoice.v;s.p_v=curvoice;s.st=curvoice.cst;s.time=curvoice.time
if(s.dur&&!s.grace)
curvoice.time+=s.dur;s.pos=curvoice.pos
if(curvoice.second)
s.second=true
if(curvoice.floating)
s.floating=true}
function sym_add(p_voice,type){var s={type:type,dur:0},s2,p_voice2=curvoice;curvoice=p_voice;sym_link(s);curvoice=p_voice2;s2=s.prev
if(!s2)
s2=s.next
if(s2){s.fname=s2.fname;s.istart=s2.istart;s.iend=s2.iend}
return s}
function mrest_expand(s){var p_voice,s2,next,nb=s.nmes,dur=s.dur/nb
var a_dd=s.a_dd;s.type=C.REST;s.dur=s.dur_orig=dur;next=s.next;p_voice=s.p_v;p_voice.last_sym=s;p_voice.time=s.time+dur;p_voice.cst=s.st;s2=s
while(--nb>0){s2=sym_add(p_voice,C.BAR);s2.bar_type="|";s2=sym_add(p_voice,C.REST);if(s.invis)
s2.invis=true;s2.dur=s2.dur_orig=dur;p_voice.time+=dur}
s2.next=next
if(next)
next.prev=s2;s2.a_dd=a_dd}
var w_tb=new Uint8Array([4,1,8,0,3,5,6,9,9,0,9,3,0,7,0,0,0,0])
function sort_all(){var s,s2,p_voice,v,time,w,wmin,ir,multi,prev,nb,ir2,v2,fl,new_sy,nv=voice_tb.length,vtb=[],vn=[],mrest_time=-1,sy=cur_sy
for(v=0;v<nv;v++)
vtb.push(voice_tb[v].sym)
ir2=nv
multi=-1
for(v=0;v<nv;v++){if(!sy.voices[v])
continue
ir=sy.voices[v].range
if(ir<ir2)
ir2=ir
vn[ir]=v
multi++}
v=vn[ir2]
tsfirst=prev=vtb[v]
if(!tsfirst)
return
vtb[v]=tsfirst.next
prev.seqst=true
fl=!w_tb[prev.type]||tsfirst.type==tsfirst.next
while(1){if(new_sy&&fl){sy=new_sy;new_sy=null;multi=-1;vn=[]
for(v=0;v<nv;v++){if(!sy.voices[v])
continue
ir=sy.voices[v].range
vn[ir]=v;multi++}}
wmin=time=1000000
for(ir=0;ir<nv;ir++){v=vn[ir]
if(v==undefined)
break
s=vtb[v]
if(!s||s.time>time)
continue
w=w_tb[s.type]
if(s.time<time){time=s.time;wmin=w}else if(w<wmin){wmin=w}
if(s.type==C.MREST){if(s.nmes==1)
mrest_expand(s)
else if(multi>0)
mrest_time=time}}
if(wmin>127)
break
if(time==mrest_time){nb=0
for(ir=0;ir<nv;ir++){v=vn[ir]
if(v==undefined)
break
s=vtb[v]
if(!s||s.time!=time||w_tb[s.type]!=wmin)
continue
if(s.type!=C.MREST){mrest_time=-1
break}
if(nb==0){nb=s.nmes}else if(nb!=s.nmes){mrest_time=-1
break}}
if(mrest_time<0){for(ir=0;ir<nv;ir++){v=vn[ir]
if(v==undefined)
break
s=vtb[v]
if(s&&s.type==C.MREST)
mrest_expand(s)}}}
for(ir=0;ir<nv;ir++){v=vn[ir]
if(v==undefined)
break
s=vtb[v]
if(!s||s.time!=time||w_tb[s.type]!=wmin)
continue
if(s.type==C.STAVES){new_sy=s.sy;for(ir2=0;ir2<nv;ir2++){if(vn[ir2]==undefined)
break}
for(v2=0;v2<nv;v2++){if(!new_sy.voices[v2]||sy.voices[v2])
continue
vn[ir2++]=v2}}
if(fl){fl=0;s.seqst=true}
s.ts_prev=prev
prev.ts_next=s
prev=s
vtb[v]=s.next}
fl=wmin}}
function voice_adj(sys_chg){var p_voice,s,s2,v
function set_feathered_beam(s1){var s,s2,t,d,b,i,a,d=s1.dur,n=1
for(s=s1;s;s=s.next){if(s.beam_end||!s.next)
break
n++}
if(n<=1){delete s1.feathered_beam
return}
s2=s;b=d/2;a=d/(n-1);t=s1.time
if(s1.feathered_beam>0){for(s=s1,i=n-1;s!=s2;s=s.next,i--){d=((a*i)|0)+b;s.dur=d;s.time=t;t+=d}}else{for(s=s1,i=0;s!=s2;s=s.next,i++){d=((a*i)|0)+b;s.dur=d;s.time=t;t+=d}}
s.dur=s.time+s.dur-t;s.time=t}
s=glovar.tempo
if(s&&staves_found<=0){v=par_sy.top_voice;p_voice=voice_tb[v];if(p_voice.sym&&p_voice.sym.type!=C.TEMPO){s=clone(s);s.v=v;s.p_v=p_voice;s.st=p_voice.st;s.time=0;s.next=p_voice.sym
if(s.next)
s.next.prev=s;p_voice.sym=s}}
for(v=0;v<voice_tb.length;v++){p_voice=voice_tb[v]
if(!sys_chg&&p_voice.sls.length){while(1){var sl=p_voice.sls.shift()
if(!sl)
break
s=sl.note.s
for(s2=s.next;s2;s2=s2.next){if(s2.bar_type&&s2.bar_type[0]==':')
break}
if(s2){if(!s.sls)
s.sls=[]
s.sls.push({ty:sl.ty,note:{s:s2}})}else{syntax(1,"Lack of ending slur(s)")}}}
if(p_voice.ignore)
p_voice.ignore=false
for(s=p_voice.sym;s;s=s.next){if(s.time>=staves_found)
break}
for(;s;s=s.next){switch(s.type){case C.GRACE:if(s.next&&s.next.type==C.BAR)
s.time--
if(!cfmt.graceword)
continue
for(s2=s.next;s2;s2=s2.next){switch(s2.type){case C.SPACE:continue
case C.NOTE:if(!s2.a_ly)
break
s.a_ly=s2.a_ly;s2.a_ly=null
break}
break}
continue}
if(s.feathered_beam)
set_feathered_beam(s)}}}
function dupl_voice(){var p_voice,p_voice2,s,s2,g,g2,v,i,nv=voice_tb.length
for(v=0;v<nv;v++){p_voice=voice_tb[v];p_voice2=p_voice.clone
if(!p_voice2)
continue
p_voice.clone=null
for(s=p_voice.sym;s;s=s.next){if(s.time>=staves_found)
break}
p_voice2.clef=clone(p_voice.clef);curvoice=p_voice2
for(;s;s=s.next){if(s.type==C.STAVES)
continue
s2=clone(s)
if(s.notes){s2.notes=[]
for(i=0;i<=s.nhd;i++)
s2.notes.push(clone(s.notes[i]))}
sym_link(s2)
if(p_voice2.second)
s2.second=true
else
delete s2.second
if(p_voice2.floating)
s2.floating=true
else
delete s2.floating
delete s2.a_ly;g=s2.extra
if(!g)
continue
g2=clone(g);s2.extra=g2;s2=g2;s2.v=p_voice2.v;s2.p_v=p_voice2;s2.st=p_voice2.st
for(g=g.next;g;g=g.next){g2=clone(g)
if(g.notes){g2.notes=[]
for(i=0;i<=g.nhd;i++)
g2.notes.push(clone(g.notes[i]))}
s2.next=g2;g2.prev=s2;s2=g2;s2.v=p_voice2.v;s2.p_v=p_voice2;s2.st=p_voice2.st}}}}
function new_syst(init){var st,v,sy_new={voices:[],staves:[],top_voice:0}
if(init){cur_sy=par_sy=sy_new
return}
for(v=0;v<voice_tb.length;v++){if(par_sy.voices[v]){st=par_sy.voices[v].st
var sy_staff=par_sy.staves[st],p_voice=voice_tb[v]
if(p_voice.staffnonote!=undefined)
sy_staff.staffnonote=p_voice.staffnonote
if(p_voice.staffscale)
sy_staff.staffscale=p_voice.staffscale}}
for(st=0;st<par_sy.staves.length;st++){sy_new.staves[st]=clone(par_sy.staves[st]);sy_new.staves[st].flags=0}
par_sy.next=sy_new;par_sy=sy_new}
Abc.prototype.set_bar_num=function(){var s,s2,tim,bar_time,bar_num,rep_dtime,v=cur_sy.top_voice,wmeasure=voice_tb[v].meter.wmeasure,bar_rep=gene.nbar
for(s=tsfirst;;s=s.ts_next){if(!s)
return
switch(s.type){case C.METER:wmeasure=s.wmeasure
case C.CLEF:case C.KEY:case C.STBRK:continue
case C.BAR:if(s.bar_num){gene.nbar=s.bar_num
break}
if(s.text&&!cfmt.contbarnb){if(s.text[0]=='1'){bar_rep=gene.nbar}else{gene.nbar=bar_rep;s.bar_num=gene.nbar}}
break}
break}
bar_time=s.time+wmeasure
if(s.time==0){for(s2=s.ts_next;s2;s2=s2.ts_next){if(s2.type==C.BAR&&s2.time){if(s2.time<bar_time){s=s2;bar_time=s.time+wmeasure}
break}}}
bar_num=gene.nbar
for(;s;s=s.ts_next){switch(s.type){case C.METER:wmeasure=s.wmeasure
if(s.time<bar_time)
bar_time=s.time+wmeasure
break
case C.MREST:bar_num+=s.nmes-1
while(s.ts_next&&s.ts_next.type!=C.BAR)
s=s.ts_next
break
case C.BAR:if(s.time<bar_time){if(s.text&&s.text[0]=='1'){bar_rep=bar_num;rep_dtime=bar_time-s.time}
break}
tim=s.time;s2=s
do{if(s2.dur)
break
if(s2.type==C.BAR&&s2.text)
break
s2=s2.next}while(s2&&s2.time==tim);if(s.bar_num)
bar_num=s.bar_num
else
bar_num++
if(s2&&s2.type==C.BAR&&s2.text){if(s2.text[0]=='1'){rep_dtime=0;bar_rep=bar_num}else{if(!cfmt.contbarnb)
bar_num=bar_rep
if(rep_dtime){if(cfmt.contbarnb)
bar_num--;bar_time=tim+rep_dtime
break}}}
s.bar_num=bar_num;bar_time=tim+wmeasure
while(s.ts_next&&!s.ts_next.seqst)
s=s.ts_next
break}}
if(cfmt.measurenb<0)
gene.nbar=bar_num}
function get_map(text){if(!text)
return
var i,note,notes,map,tmp,ns,a=info_split(text)
if(a.length<3){syntax(1,not_enough_p)
return}
ns=a[1]
if(ns.indexOf("octave,")==0||ns.indexOf("key,")==0){ns=ns.replace(/[,']+$/m,'').toLowerCase();if(ns[0]=='k')
ns=ns.replace(/[_=^]+/,'')}else if(ns[0]=='*'||ns.indexOf("all")==0){ns='all'}else{tmp=new scanBuf;tmp.buffer=a[1];note=parse_acc_pit(tmp)
if(!note){syntax(1,"Bad note in %%map")
return}
ns=note2abc(note)}
notes=maps[a[0]]
if(!notes)
maps[a[0]]=notes={}
map=notes[ns]
if(!map)
notes[ns]=map=[]
if(!a[2])
return
i=2
if(a[2].indexOf('=')<0){if(a[2][0]!='*'){tmp=new scanBuf;tmp.buffer=a[2];map[1]=parse_acc_pit(tmp)}
if(!a[3])
return
i++
if(a[3].indexOf('=')<0){map[0]=a[3].split(',');i++}}
for(;i<a.length;i++){switch(a[i]){case"heads=":if(!a[++i]){syntax(1,not_enough_p)
break}
map[0]=a[i].split(',')
break
case"print=":if(!a[++i]){syntax(1,not_enough_p)
break}
tmp=new scanBuf;tmp.buffer=a[i];map[1]=parse_acc_pit(tmp)
break
case"color=":if(!a[++i]){syntax(1,not_enough_p)
break}
map[2]=a[i]
break
case"play=":if(!a[++i]){syntax(1,not_enough_p)
break}
tmp=new scanBuf
tmp.buffer=a[i]
map[3]=parse_acc_pit(tmp)
break}}}
function set_transp(){var s,transp,sndtran
if(curvoice.ckey.k_bagpipe||curvoice.ckey.k_drum)
return
if(cfmt.transp&&curvoice.transp)
syntax(0,"Mix of old and new transposition syntaxes");if(cfmt.transp!=undefined||curvoice.transp!=undefined||curvoice.shift!=undefined)
transp=(cfmt.transp||0)+
(curvoice.transp||0)+
(curvoice.shift||0)
if(curvoice.sndtran!=undefined||curvoice.sndsh!=undefined)
sndtran=(curvoice.sndtran||0)+
(curvoice.sndsh||0)
if(transp==undefined){if(sndtran==undefined)
return}else{curvoice.vtransp=transp}
if(is_voice_sig()){curvoice.key=s=clone(curvoice.okey)}else{s=curvoice.last_sym
while(1){if(s.type==C.KEY)
break
s=s.prev
if(!s){s=curvoice.key
break}}}
if(transp!=undefined)
s.k_transp=transp
if(sndtran!=undefined)
s.k_sndtran=sndtran
curvoice.ckey=clone(s)
if(curvoice.key.k_none)
s.k_sf=0}
function note_transp(s,sk,note){var ak,an,d,b40,n=note.pit,a=note.acc
if(!a&&sk.k_a_acc)
a=sk.k_map[(n+19)%7]
b40=abc2svg.pab40(n,a)+sk.k_transp
note.pit=abc2svg.b40p(b40)
if(!a){if(!sk.k_a_acc&&!sk.k_none)
return}
an=abc2svg.b40a(b40)
if(a){if(sk.k_a_acc){ak=sk.k_map[(note.pit+19)%7]
if(ak==an)
an=0}
if(!an)
an=3}else if(sk.k_none){if(acc_same_pitch(s,note.pit))
return}else if(sk.k_a_acc){if(acc_same_pitch(s,note.pit))
return
ak=sk.k_map[(note.pit+19)%7]
if(ak)
an=3}else{return}
d=note.micro_d
if(d&&a!=an){n=note.micro_n
switch(an){case 3:if(n>d/2){n-=d/2;note.micro_n=n;an=a}else{an=-a}
break
case 2:if(n>d/2){note.pit+=1;n-=d/2}else{n+=d/2}
an=a
note.micro_n=n
break
case-2:if(n>=d/2){note.pit-=1;n-=d/2}else{n+=d/2}
an=a
note.micro_n=n
break}}
note.acc=an}
function pit_adj(){var i,p_v,s,sk,g,nv=voice_tb.length
while(--nv>=0){p_v=voice_tb[nv]
if(p_v.vtransp==undefined)
continue
if(p_v.key.k_transp){sk=p_v.key
key_transp(sk)}else{sk=null}
s=p_v.sym
while(s){if(!sk){for(;s;s=s.next){if(s.type==C.KEY&&s.k_transp)
break}}
for(;s;s=s.next){switch(s.type){case C.GRACE:for(g=s.extra;g;g=g.next){for(i=0;i<=g.nhd;i++)
note_transp(g,sk,g.notes[i])}
continue
case C.NOTE:for(i=0;i<=s.nhd;i++)
note_transp(s,sk,s.notes[i])
continue
case C.KEY:if(sk)
s.k_sf=sk.k_sf
key_transp(s)
if(!s.k_transp)
break
sk=s
default:continue}
break}
sk=null}}}
function get_transp(param){if(param[0]=='0')
return 0
if("123456789-+".indexOf(param[0])>=0){var val=parseInt(param)
if(isNaN(val)||val<-36||val>36){syntax(1,"Bad transpose value")
return}
return((val/12)|0)*40+
(param.slice(-1)=='b'?abc2svg.ifb40:abc2svg.isb40)[(val+36)%12]}
return get_interval(param)}
Abc.prototype.do_pscom=function(text){var h1,val,s,cmd,param,n,k,b
cmd=text.match(/(\w|-)+/)
if(!cmd)
return
cmd=cmd[0];param=text.replace(cmd,'').trim()
if(param.slice(-5)==' lock'){fmt_lock[cmd]=true;param=param.slice(0,-5).trim()}else if(fmt_lock[cmd]){return}
switch(cmd){case"center":if(parse.state>=2){if(parse.state==2)
goto_tune()
s=new_block("text");s.text=param
s.opt='c'
return}
write_text(param,'c')
return
case"clef":if(parse.state>=2){if(parse.state==2)
goto_tune();s=new_clef(param)
if(s)
get_clef(s)}
return
case"deco":deco_add(param)
return
case"linebreak":set_linebreak(param)
return
case"map":get_map(param)
return
case"maxsysstaffsep":if(parse.state==3){par_sy.voices[curvoice.v].maxsep=get_unit(param)
return}
break
case"multicol":generate(1)
switch(param){case"start":blk_out();multicol={posy:posy,maxy:posy,lmarg:cfmt.leftmargin,rmarg:cfmt.rightmargin,state:parse.state}
break
case"new":if(!multicol){syntax(1,"%%multicol new without start")
break}
if(posy>multicol.maxy)
multicol.maxy=posy;cfmt.leftmargin=multicol.lmarg;cfmt.rightmargin=multicol.rmarg;img.chg=true;set_page();posy=multicol.posy
break
case"end":if(!multicol){syntax(1,"%%multicol end without start")
break}
if(posy<multicol.maxy)
posy=multicol.maxy;cfmt.leftmargin=multicol.lmarg;cfmt.rightmargin=multicol.rmarg;multicol=undefined;blk_flush();img.chg=true;set_page()
break
default:syntax(1,"Unknown keyword '$1' in %%multicol",param)
break}
return
case"musicfont":musicfont=param
return
case"ottava":if(parse.state!=3){if(parse.state!=2)
return
goto_tune()}
n=parseInt(param)
if(isNaN(n)||n<-2||n>2){syntax(1,errs.bad_val,"%%ottava")
return}
glovar.ottava=true;parse.ottava.push(n)
return
case"repbra":if(parse.state>=2){if(parse.state==2)
goto_tune();curvoice.norepbra=!get_bool(param)}
return
case"repeat":if(parse.state!=3)
return
if(!curvoice.last_sym){syntax(1,"%%repeat cannot start a tune")
return}
if(!param.length){n=1;k=1}else{b=param.split(/\s+/);n=parseInt(b[0]);k=parseInt(b[1])
if(isNaN(n)||n<1||(curvoice.last_sym.type==C.BAR&&n>2)){syntax(1,"Incorrect 1st value in %%repeat")
return}
if(isNaN(k)){k=1}else{if(k<1){syntax(1,"Incorrect 2nd value in %%repeat")
return}}}
parse.repeat_n=curvoice.last_sym.type==C.BAR?n:-n;parse.repeat_k=k
return
case"sep":var h2,len,values,lwidth;set_page();lwidth=img.width-img.lm-img.rm;h1=h2=len=0
if(param){values=param.split(/\s+/);h1=get_unit(values[0])
if(values[1]){h2=get_unit(values[1])
if(values[2])
len=get_unit(values[2])}}
if(h1<1)
h1=14
if(h2<1)
h2=h1
if(len<1)
len=90
if(parse.state==3){s=new_block(cmd);s.x=(lwidth-len)/2/cfmt.scale;s.l=len/cfmt.scale;s.sk1=h1;s.sk2=h2
return}
blk_out();vskip(h1);output+='<path class="stroke"\n\td="M';out_sxsy((lwidth-len)/2/cfmt.scale,' ',0);output+='h'+(len/cfmt.scale).toFixed(1)+'"/>\n';vskip(h2);blk_flush()
return
case"setbarnb":val=parseInt(param)
if(isNaN(val)||val<1){syntax(1,"Bad %%setbarnb value")
break}
if(parse.state==2)
goto_tune()
glovar.new_nbar=val
return
case"staff":if(parse.state!=3){if(parse.state!=2)
return
goto_tune()}
val=parseInt(param)
if(isNaN(val)){syntax(1,"Bad %%staff value '$1'",param)
return}
var st
if(param[0]=='+'||param[0]=='-')
st=curvoice.cst+val
else
st=val-1
if(st<0||st>nstaff){syntax(1,"Bad %%staff number $1 (cur $2, max $3)",st,curvoice.cst,nstaff)
return}
delete curvoice.floating;curvoice.cst=st
return
case"staffbreak":if(parse.state!=3){if(parse.state!=2)
return
goto_tune()}
s={type:C.STBRK,dur:0}
if(param[0]>='0'&&param[0]<='9'){s.xmx=get_unit(param)
if(param.slice(-1)=='f')
s.stbrk_forced=true}else{s.xmx=14
if(param[0]=='f')
s.stbrk_forced=true}
sym_link(s)
return
case"stafflines":case"staffscale":case"staffnonote":set_v_param(cmd,param)
return
case"staves":case"score":if(parse.state==0)
return
if(parse.scores&&parse.scores.length>0){text=parse.scores.shift();cmd=text.match(/([^\s]+)\s*(.*)/);get_staves(cmd[1],cmd[2])}else{get_staves(cmd,param)}
return
case"sysstaffsep":if(parse.state==3){par_sy.voices[curvoice.v].sep=get_unit(param)
return}
break
case"text":if(parse.state>=2){if(parse.state==2)
goto_tune()
s=new_block(cmd);s.text=param
s.opt=cfmt.textoption
return}
write_text(param,cfmt.textoption)
return
case"transpose":if(cfmt.sound)
return
switch(parse.state){case 0:cfmt.transp=0
case 1:case 2:val=get_transp(param)
if(val)
cfmt.transp=(cfmt.transp||0)+val
return}
for(s=curvoice.last_sym;s;s=s.prev){switch(s.type){case C.NOTE:s=clone(curvoice.okey);s.k_old_sf=curvoice.ckey.k_sf;sym_link(s)
break
case C.KEY:break
default:continue}
break}
do_info('V',curvoice.id+' shift='+param)
return
case"tune":return
case"user":set_user(param)
return
case"voicecolor":if(parse.state!=3){if(parse.state!=2)
return
goto_tune()}
curvoice.color=param
return
case"vskip":val=get_unit(param)
if(val<0){syntax(1,"%%vskip cannot be negative")
return}
if(parse.state==3){s=new_block(cmd);s.sk=val
return}
vskip(val);return
case"newpage":case"leftmargin":case"rightmargin":case"pagescale":case"pagewidth":case"printmargin":case"scale":case"staffwidth":if(parse.state>=2){if(parse.state==2)
goto_tune()
s=new_block(cmd);s.param=param
return}
if(cmd=="newpage"){blk_flush();block.newpage=true;return}
break}
self.set_format(cmd,param)}
Abc.prototype.do_begin_end=function(type,opt,text){var i,j,action,s
switch(type){case"js":js_inject(text)
break
case"ml":if(parse.state==3){s=new_block(type);s.text=text}else{svg_flush();if(user.img_out)
user.img_out(text)}
break
case"svg":j=0
while(1){i=text.indexOf('<style type="text/css">\n',j)
if(i<0)
break
j=text.indexOf('</style>',i)
if(j<0){syntax(1,"No </style> in %%beginsvg sequence")
break}
style+=text.slice(i+23,j).replace(/\s+$/,'')}
j=0
while(1){i=text.indexOf('<defs>\n',j)
if(i<0)
break
j=text.indexOf('</defs>',i)
if(j<0){syntax(1,"No </defs> in %%beginsvg sequence")
break}
defs_add(text.slice(i+6,j))}
break
case"text":action=get_textopt(opt);if(!action)
action=cfmt.textoption
if(parse.state>=2){if(parse.state==2)
goto_tune()
s=new_block(type);s.text=text
s.opt=action
break}
write_text(text,action)
break}}
function generate(in_mc){var s,v,p_voice;if(parse.tp){syntax(1,"No end of tuplet")
s=parse.tps
if(s)
delete s.tp
delete parse.tp}
if(vover){syntax(1,"No end of voice overlay");get_vover(vover.bar?'|':')')}
if(!voice_tb.length)
return
voice_adj();dupl_voice();sort_all()
if(!tsfirst)
return
self.set_bar_num()
pit_adj()
if(user.get_abcmodel)
user.get_abcmodel(tsfirst,voice_tb,anno_type,info)
if(user.img_out)
self.output_music()
if(!in_mc)
return
voice_tb=Object.create(voice_tb)
for(v=0;v<voice_tb.length;v++){p_voice=voice_tb[v];p_voice.time=0;p_voice.sym=p_voice.last_sym=null;delete p_voice.have_ly;p_voice.sls=[];p_voice.hy_st=0;delete p_voice.bar_start}
staves_found=0}
function key_transp(sk){if(sk.k_a_acc||sk.k_none)
return
var d,k_b40=sk.k_b40,n_b40=(k_b40+200+sk.k_transp)%40
d=abc2svg.b40k[n_b40]-n_b40
if(d){if(sk.k_transp>0)
sk.k_transp+=d
else
sk.k_transp-=d
n_b40+=d}
sk.k_b40=n_b40
var sf=abc2svg.b40sf[n_b40]
sk.k_old_sf=sk.k_sf
sk.k_sf=sf
sk.k_map=abc2svg.keys[sf+7]}
function acc_same_pitch(s,pit){var i,time=s.time
for(s=s.prev;s;s=s.prev){switch(s.type){case C.BAR:if(s.time<time)
return
while(1){s=s.prev
if(!s)
return
if(s.type==C.NOTE){if(s.time+s.dur==time)
break
return}
if(s.time<time)
return}
for(i=0;i<=s.nhd;i++){if(s.notes[i].pit==pit&&s.notes[i].tie_ty)
return s.notes[i].acc}
return
case C.NOTE:for(i=0;i<=s.nhd;i++){if(s.notes[i].pit==pit)
return s.notes[i].acc}
break}}
return}
function get_staves(cmd,parm){var s,p_voice,p_voice2,i,flags,v,vid,st,range,a_vf=parse_staves(parm)
if(!a_vf)
return
if(voice_tb.length!=0){voice_adj(true);dupl_voice()}
var maxtime=0,no_sym=true
for(v=0;v<voice_tb.length;v++){p_voice=voice_tb[v]
if(p_voice.time>maxtime)
maxtime=p_voice.time
if(p_voice.sym)
no_sym=false}
if(no_sym||(maxtime==0&&staves_found<0)){par_sy.staves=[]
par_sy.voices=[]}else{for(v=0;v<par_sy.voices.length;v++){if(par_sy.voices[v]){curvoice=voice_tb[v]
break}}
curvoice.time=maxtime;s={type:C.STAVES,dur:0}
sym_link(s);par_sy.nstaff=nstaff;new_syst();s.sy=par_sy}
staves_found=maxtime
for(v=0;v<voice_tb.length;v++){p_voice=voice_tb[v]
delete p_voice.second
delete p_voice.ignore
delete p_voice.floating}
range=0
for(i=0;i<a_vf.length;i++){vid=a_vf[i][0];p_voice=new_voice(vid);p_voice.time=maxtime;v=p_voice.v
if(i==0)
par_sy.top_voice=p_voice.v
if(par_sy.voices[v]){p_voice2=clone(p_voice);par_sy.voices[voice_tb.length]=clone(par_sy.voices[v]);v=voice_tb.length;p_voice2.v=v;p_voice2.sym=p_voice2.last_sym=null;p_voice2.time=maxtime;voice_tb.push(p_voice2)
delete p_voice2.clone
while(p_voice.clone)
p_voice=p_voice.clone;p_voice.clone=p_voice2;p_voice=p_voice2}else{par_sy.voices[v]={}}
a_vf[i][0]=p_voice;par_sy.voices[v].range=range++}
if(cmd[1]=='t'){for(i=0;i<a_vf.length;i++){flags=a_vf[i][1]
if(!(flags&(OPEN_BRACE|OPEN_BRACE2)))
continue
if((flags&(OPEN_BRACE|CLOSE_BRACE))==(OPEN_BRACE|CLOSE_BRACE)||(flags&(OPEN_BRACE2|CLOSE_BRACE2))==(OPEN_BRACE2|CLOSE_BRACE2))
continue
if(a_vf[i+1][1]!=0)
continue
if((flags&OPEN_PARENTH)||(a_vf[i+2][1]&OPEN_PARENTH))
continue
if(a_vf[i+2][1]&(CLOSE_BRACE|CLOSE_BRACE2)){a_vf[i+1][1]|=FL_VOICE}else if(a_vf[i+2][1]==0&&(a_vf[i+3][1]&(CLOSE_BRACE|CLOSE_BRACE2))){a_vf[i][1]|=OPEN_PARENTH;a_vf[i+1][1]|=CLOSE_PARENTH;a_vf[i+2][1]|=OPEN_PARENTH;a_vf[i+3][1]|=CLOSE_PARENTH}}}
st=-1
for(i=0;i<a_vf.length;i++){flags=a_vf[i][1]
if((flags&(OPEN_PARENTH|CLOSE_PARENTH))==(OPEN_PARENTH|CLOSE_PARENTH)){flags&=~(OPEN_PARENTH|CLOSE_PARENTH);a_vf[i][1]=flags}
p_voice=a_vf[i][0]
if(flags&FL_VOICE){p_voice.floating=true;p_voice.second=true}else{st++;if(!par_sy.staves[st]){par_sy.staves[st]={stafflines:'|||||',staffscale:1}}
par_sy.staves[st].flags=0}
v=p_voice.v;p_voice.st=p_voice.cst=par_sy.voices[v].st=st;par_sy.staves[st].flags|=flags
if(flags&OPEN_PARENTH){p_voice2=p_voice
while(i<a_vf.length-1){p_voice=a_vf[++i][0];v=p_voice.v
if(a_vf[i][1]&MASTER_VOICE){p_voice2.second=true
p_voice2=p_voice}else{p_voice.second=true}
p_voice.st=p_voice.cst=par_sy.voices[v].st=st
if(a_vf[i][1]&CLOSE_PARENTH)
break}
par_sy.staves[st].flags|=a_vf[i][1]}}
if(st<0)
st=0
par_sy.nstaff=nstaff=st
if(cmd[1]=='c'){for(st=0;st<nstaff;st++)
par_sy.staves[st].flags^=STOP_BAR}
for(v=0;v<voice_tb.length;v++){p_voice=voice_tb[v]
if(!par_sy.voices[v]){p_voice.ignore=true
continue}
par_sy.voices[v].second=p_voice.second;st=p_voice.st
if(st>0&&!p_voice.norepbra&&!(par_sy.staves[st-1].flags&STOP_BAR))
p_voice.norepbra=true}
curvoice=parse.state>=2?voice_tb[par_sy.top_voice]:null}
function get_vover(type){var p_voice2,p_voice3,range,s,time,v,v2,v3,line=parse.line
function clone_voice(id){var v,p_voice
for(v=0;v<voice_tb.length;v++){p_voice=voice_tb[v]
if(p_voice.id==id)
return p_voice}
p_voice=clone(curvoice);p_voice.v=voice_tb.length;p_voice.id=id;p_voice.sym=p_voice.last_sym=null;delete p_voice.nm
delete p_voice.snm
delete p_voice.new_name
delete p_voice.lyric_restart
delete p_voice.lyric_cont
delete p_voice.ly_a_h;delete p_voice.sym_restart
delete p_voice.sym_cont
delete p_voice.have_ly
voice_tb.push(p_voice)
return p_voice}
if(curvoice.ignore)
return
if(type=='|'||type==')'){if(!curvoice.last_note){syntax(1,errs.nonote_vo)
return}
curvoice.last_note.beam_end=true
if(!vover){syntax(1,"Erroneous end of voice overlay")
return}
if(curvoice.time!=vover.p_voice.time){syntax(1,"Wrong duration in voice overlay");if(curvoice.time>vover.p_voice.time)
vover.p_voice.time=curvoice.time}
curvoice=vover.p_voice;vover=null
return}
if(type=='('){if(vover){syntax(1,"Voice overlay already started")
return}
vover={p_voice:curvoice,time:curvoice.time}
return}
if(!curvoice.last_note){syntax(1,errs.nonote_vo)
return}
curvoice.last_note.beam_end=true;p_voice2=curvoice.voice_down
if(!p_voice2){p_voice2=clone_voice(curvoice.id+'o');curvoice.voice_down=p_voice2;p_voice2.time=0;p_voice2.second=true;v2=p_voice2.v;par_sy.voices[v2]={st:curvoice.st,second:true}
var f_clone=curvoice.clone!=undefined?1:0;range=par_sy.voices[curvoice.v].range
for(v=0;v<par_sy.voices.length;v++){if(par_sy.voices[v]&&par_sy.voices[v].range>range)
par_sy.voices[v].range+=f_clone+1}
par_sy.voices[v2].range=range+1
if(f_clone){p_voice3=clone_voice(p_voice2.id+'c');p_voice3.second=true;v3=p_voice3.v;par_sy.voices[v3]={second:true,range:range+2}
p_voice2.clone=p_voice3}}
p_voice2.ulen=curvoice.ulen
p_voice2.dur_fact=curvoice.dur_fact
if(curvoice.uscale)
p_voice2.uscale=curvoice.uscale
if(!vover){vover={bar:true,p_voice:curvoice}
time=p_voice2.time
for(s=curvoice.last_sym;;s=s.prev){if(s.type==C.BAR||s.time<=time)
break}
vover.time=s.time}else{if(curvoice!=vover.p_voice&&curvoice.time!=vover.p_voice.time){syntax(1,"Wrong duration in voice overlay")
if(curvoice.time>vover.p_voice.time)
vover.p_voice.time=curvoice.time}}
p_voice2.time=vover.time;curvoice=p_voice2
if(vover.bar){sym_link({type:C.BAR,bar_type:type,dur:0,multi:0})}}
function is_voice_sig(){var s
if(!curvoice.sym)
return true
if(curvoice.time!=0)
return false
for(s=curvoice.last_sym;s;s=s.prev)
if(w_tb[s.type]!=0)
return false
return true}
function get_clef(s){var s2,s3
if(is_voice_sig()){curvoice.clef=s
return}
sym_link(s);s.clef_small=true}
function get_key(parm){var v,p_voice,s,transp,sndtran,a=new_key(parm),s_key=a[0];a=a[1]
switch(parse.state){case 1:if(s_key.k_sf==undefined&&!s_key.k_a_acc){s_key.k_sf=0;s_key.k_none=true}
for(v=0;v<voice_tb.length;v++){p_voice=voice_tb[v];p_voice.key=clone(s_key);p_voice.okey=clone(s_key);p_voice.ckey=clone(s_key)}
parse.ckey=s_key
if(a.length!=0)
memo_kv_parm('*',a)
if(!glovar.ulen)
glovar.ulen=C.BLEN/8;parse.state=2;return
case 2:goto_tune(true)
break}
if(a.length!=0)
set_kv_parm(a);if(!curvoice.ckey.k_bagpipe&&!curvoice.ckey.k_drum&&(cfmt.transp!=undefined||curvoice.transp!=undefined||curvoice.shift!=undefined))
transp=(cfmt.transp||0)+
(curvoice.transp||0)+
(curvoice.shift||0)
if(curvoice.sndtran!=undefined||curvoice.sndsh!=undefined)
sndtran=(curvoice.sndtran||0)+
(curvoice.sndsh||0)
if(s_key.k_sf==undefined){if(!s_key.k_a_acc&&transp==undefined){if(sndtran==undefined)
return
s_key.k_play=true}
s_key.k_sf=curvoice.okey.k_sf}
curvoice.okey=clone(s_key)
if(transp!=undefined){curvoice.vtransp=transp;s_key.k_transp=transp}
if(sndtran!=undefined)
s_key.k_sndtran=sndtran
s_key.k_old_sf=curvoice.ckey.k_sf;if(!s_key.k_b40)
s_key.k_b40=curvoice.ckey.k_b40
curvoice.ckey=s_key
if(is_voice_sig()){curvoice.key=clone(s_key)
if(s_key.k_none)
curvoice.key.k_sf=0
return}
s=curvoice.last_sym
if(s&&s.type==C.METER){curvoice.last_sym=s.prev
if(!curvoice.last_sym)
curvoice.sym=null;sym_link(s_key);s_key.next=s;s.prev=s_key;curvoice.last_sym=s}else{sym_link(s_key)}}
function new_voice(id){var p_voice,v,p_v_sav,n=voice_tb.length
if(n==1&&voice_tb[0].default){delete voice_tb[0].default
if(voice_tb[0].time==0){p_voice=voice_tb[0];p_voice.id=id
if(cfmt.transp&&parse.state>=2){p_v_sav=curvoice;curvoice=p_voice;set_transp();curvoice=p_v_sav}
return p_voice}}
for(v=0;v<n;v++){p_voice=voice_tb[v]
if(p_voice.id==id)
return p_voice}
p_voice={v:v,id:id,time:0,new:true,pos:{dyn:0,gch:0,gst:0,orn:0,stm:0,voc:0,vol:0},scale:1,ulen:glovar.ulen,dur_fact:1,key:clone(parse.ckey),ckey:clone(parse.ckey),okey:clone(parse.ckey),meter:clone(glovar.meter),wmeasure:glovar.meter.wmeasure,clef:{type:C.CLEF,clef_auto:true,clef_type:"a",time:0},acc:[],sls:[],hy_st:0}
voice_tb.push(p_voice);return p_voice}
function init_tune(){nstaff=-1;voice_tb=[];curvoice=null;new_syst(true);staves_found=-1;gene={}
a_de=[]}
function do_cloning(vs){var i,eol,file=parse.file,start=parse.eol+1,bol=start
while(1){eol=file.indexOf('\n',bol)
if(eol<0){eol=0
break}
if(/%.*|\n.*|.:.|\[.:/.test(file.slice(eol+1,eol+4)))
break
bol=eol+1}
include++;tosvg(parse.fname,file,start,eol)
for(i=0;i<vs.length;i++){get_voice(vs[i]);tosvg(parse.fname,file,start,eol)}
include--}
function get_voice(parm){var v,vs,a=info_split(parm),vid=a.shift()
if(!vid)
return
if(vid.indexOf(',')>0){vs=vid.split(',');vid=vs.shift()}
if(parse.state<2){if(a.length!=0)
memo_kv_parm(vid,a)
if(vid!='*'&&parse.state==1)
curvoice=new_voice(vid)
return}
if(vid=='*'){syntax(1,"Cannot have V:* in tune body")
return}
curvoice=new_voice(vid);set_kv_parm(a)
if(parse.state==2)
goto_tune();set_transp();v=curvoice.v
if(curvoice.new){delete curvoice.new
if(staves_found<0){curvoice.st=curvoice.cst=++nstaff;par_sy.nstaff=nstaff;par_sy.voices[v]={st:nstaff,range:v}
par_sy.staves[nstaff]={stafflines:curvoice.stafflines||"|||||",staffscale:1}}
if(!par_sy.voices[v]){if(staves_found>=0)
curvoice.ignore=true}}
if(!curvoice.filtered&&!curvoice.ignore&&(parse.voice_opts||parse.tune_v_opts)){curvoice.filtered=true;voice_filter()}
if(vs)
do_cloning(vs)}
function goto_tune(is_K){var v,p_voice,s={type:C.STAVES,dur:0,sy:par_sy}
set_page();write_heading();reset_gen();if(glovar.new_nbar){gene.nbar=glovar.new_nbar
glovar.new_nbar=0}else{gene.nbar=1}
parse.state=3;if(voice_tb.length==0){get_voice("1");curvoice.clef.istart=curvoice.key.istart;curvoice.clef.iend=curvoice.key.iend;curvoice.default=true}else if(!curvoice){curvoice=voice_tb[staves_found<0?0:par_sy.top_voice]}
if(!curvoice.init&&!is_K){set_kv_parm([]);set_transp()}
for(v=0;v<voice_tb.length;v++){p_voice=voice_tb[v];p_voice.ulen=glovar.ulen
if(p_voice.ckey.k_bagpipe&&!p_voice.pos.stm){p_voice.pos=clone(p_voice.pos);p_voice.pos.stm=C.SL_BELOW}}
if(staves_found<0){nstaff=voice_tb.length-1
for(v=0;v<=nstaff;v++){p_voice=voice_tb[v];delete p_voice.new;p_voice.st=p_voice.cst=v;par_sy.voices[v]={st:v,range:v}
par_sy.staves[v]={stafflines:p_voice.stafflines||"|||||",staffscale:1}}
par_sy.nstaff=nstaff}
p_voice=curvoice;curvoice=voice_tb[par_sy.top_voice];sym_link(s)
curvoice=p_voice}
function get_sym(p,cont){var s,c,i,j,d
if(curvoice.ignore)
return
if(cont){s=curvoice.sym_cont
if(!s){syntax(1,"+: symbol line without music")
return}}else{if(curvoice.sym_restart){curvoice.sym_start=s=curvoice.sym_restart;curvoice.sym_restart=null}else{s=curvoice.sym_start}
if(!s)
s=curvoice.sym
if(!s){syntax(1,"s: without music")
return}}
i=0
while(1){while(p[i]==' '||p[i]=='\t')
i++;c=p[i]
if(!c)
break
switch(c){case'|':while(s&&s.type!=C.BAR)
s=s.next
if(!s){syntax(1,"Not enough measure bars for symbol line")
return}
s=s.next;i++
continue
case'!':case'"':j=++i
i=p.indexOf(c,j)
if(i<0){syntax(1,c=='!'?"No end of decoration":"No end of guitar chord");i=p.length
continue}
d=p.slice(j-1,i+1)
break
case'*':break
default:d=c.charCodeAt(0)
if(d<128){d=char_tb[d]
if(d.length>1&&(d[0]=='!'||d[0]=='"')){c=d[0]
break}}
syntax(1,errs.bad_char,c)
break}
while(s&&(s.type!=C.NOTE||s.grace))
s=s.next
if(!s){syntax(1,"Too many elements in symbol line")
return}
switch(c){default:break
case'!':deco_cnv([d.slice(1,-1)],s,s.prev)
break
case'"':a_gch=s.a_gch;parse_gchord(d)
if(a_gch)
self.gch_build(s)
break}
s=s.next;i++}
curvoice.lyric_cont=s}
function get_lyrics(text,cont){var s,word,p,i,j,ly
if(curvoice.ignore)
return
if(curvoice.pos.voc!=C.SL_HIDDEN)
curvoice.have_ly=true
if(cont){s=curvoice.lyric_cont
if(!s){syntax(1,"+: lyric without music")
return}}else{set_font("vocal")
if(curvoice.lyric_restart){curvoice.lyric_start=s=curvoice.lyric_restart;curvoice.lyric_restart=null;curvoice.lyric_line=0}else{curvoice.lyric_line++;s=curvoice.lyric_start}
if(!s)
s=curvoice.sym
if(!s){syntax(1,"w: without music")
return}}
p=text;i=0
while(1){while(p[i]==' '||p[i]=='\t')
i++
if(!p[i])
break
j=parse.istart+i+2
switch(p[i]){case'|':while(s&&s.type!=C.BAR)
s=s.next
if(!s){syntax(1,"Not enough measure bars for lyric line")
return}
s=s.next;i++
continue
case'-':word="-\n"
break
case'_':word="_\n"
break
case'*':word=""
break
default:if(p[i]=='\\'&&i==p.length-1){curvoice.lyric_cont=s
return}
word="";while(1){if(!p[i])
break
switch(p[i]){case'_':case'*':case'|':i--
case' ':case'\t':break
case'~':word+=' ';i++
continue
case'-':word+="\n"
break
case'\\':word+=p[++i];i++
continue
default:word+=p[i++]
continue}
break}
break}
while(s&&(s.type!=C.NOTE||s.grace))
s=s.next
if(!s){syntax(1,"Too many words in lyric line")
return}
if(word&&s.pos.voc!=C.SL_HIDDEN){if(word.match(/^\$\d/)){if(word[1]=='0')
set_font("vocal")
else
set_font("u"+word[1]);word=word.slice(2)}
ly={t:word,font:gene.curfont,wh:strwh(word),istart:j,iend:j+word.length}
if(!s.a_ly)
s.a_ly=[]
s.a_ly[curvoice.lyric_line]=ly}
s=s.next;i++}
curvoice.lyric_cont=s}
function ly_width(s,wlw){var ly,sz,swfac,align,xx,w,i,j,k,shift,p,a_ly=s.a_ly;align=0
for(i=0;i<a_ly.length;i++){ly=a_ly[i]
if(!ly)
continue
p=ly.t;if(p=="-\n"||p=="_\n"){ly.shift=0
continue}
w=ly.wh[0];swfac=ly.font.swfac;xx=w+2*cwid(' ')*swfac
if(s.type==C.GRACE){shift=s.wl}else if((p[0]>='0'&&p[0]<='9'&&p.length>2)||p[1]==':'||p[0]=='('||p[0]==')'){if(p[0]=='('){sz=cwid('(')*swfac}else{j=p.indexOf(' ');set_font(ly.font)
if(j>0)
sz=strwh(p.slice(0,j))[0]
else
sz=w*.2}
shift=(w-sz+2*cwid(' ')*swfac)*.4
if(shift>20)
shift=20;shift+=sz
if(ly.t[0]>='0'&&ly.t[0]<='9'){if(shift>align)
align=shift}}else{shift=xx*.4
if(shift>20)
shift=20}
ly.shift=shift
if(wlw<shift)
wlw=shift;xx-=shift;shift=2*cwid(' ')*swfac
for(k=s.next;k;k=k.next){switch(k.type){case C.NOTE:case C.REST:if(!k.a_ly||!k.a_ly[i])
xx-=9
else if(k.a_ly[i].t=="-\n"||k.a_ly[i].t=="_\n")
xx-=shift
else
break
if(xx<=0)
break
continue
case C.CLEF:case C.METER:case C.KEY:xx-=10
continue
default:xx-=5
break}
break}
if(xx>s.wr)
s.wr=xx}
if(align>0){for(i=0;i<a_ly.length;i++){ly=a_ly[i]
if(ly&&ly.t[0]>='0'&&ly.t[0]<='9')
ly.shift=align}}
return wlw}
function draw_lyric_line(p_voice,j,y){var p,lastx,w,s,s2,ly,lyl,hyflag,lflag,x0,font,shift
if(p_voice.hy_st&(1<<j)){hyflag=true;p_voice.hy_st&=~(1<<j)}
for(s=p_voice.sym;;s=s.next)
if(s.type!=C.CLEF&&s.type!=C.KEY&&s.type!=C.METER)
break
lastx=s.prev?s.prev.x:tsfirst.x;x0=0
for(;s;s=s.next){if(s.a_ly)
ly=s.a_ly[j]
else
ly=null
if(!ly){switch(s.type){case C.REST:case C.MREST:if(lflag){out_wln(lastx+3,y,x0-lastx);lflag=false;lastx=s.x+s.wr}}
continue}
if(ly.font!=gene.curfont)
gene.curfont=font=ly.font;p=ly.t;w=ly.wh[0];shift=ly.shift
if(hyflag){if(p=="_\n"){p="-\n"}else if(p!="-\n"){out_hyph(lastx,y,s.x-shift-lastx);hyflag=false;lastx=s.x+s.wr}}
if(lflag&&p!="_\n"){out_wln(lastx+3,y,x0-lastx+3);lflag=false;lastx=s.x+s.wr}
if(p=="-\n"||p=="_\n"){if(x0==0&&lastx>s.x-18)
lastx=s.x-18
if(p[0]=='-')
hyflag=true
else
lflag=true;x0=s.x-shift
continue}
x0=s.x-shift;if(p.slice(-1)=='\n'){p=p.slice(0,-1);hyflag=true}
if(user.anno_start||user.anno_stop){s2={st:s.st,istart:ly.istart,iend:ly.iend,x:x0,y:y,ymn:y,ymx:y+gene.curfont.size,wl:0,wr:w}
anno_start(s2,'lyrics')}
xy_str(x0,y,p,null,null,ly.wh);anno_stop(s2,'lyrics')
lastx=x0+w}
if(hyflag){hyflag=false;x0=realwidth-10
if(x0<lastx+10)
x0=lastx+10;out_hyph(lastx,y,x0-lastx)
if(cfmt.hyphencont)
p_voice.hy_st|=(1<<j)}
for(p_voice.s_next;s;s=s.next){if(s.type==C.NOTE){if(!s.a_ly)
break
ly=s.a_ly[j]
if(ly&&ly.t=="_\n"){lflag=true;x0=realwidth-15
if(x0<lastx+12)
x0=lastx+12}
break}}
if(lflag){out_wln(lastx+3,y,x0-lastx+3);lflag=false}}
function draw_lyrics(p_voice,nly,a_h,y,incr){var j,top,sc=staff_tb[p_voice.st].staffscale;set_font("vocal")
if(incr>0){if(y>-cfmt.vocalspace)
y=-cfmt.vocalspace;y*=sc
for(j=0;j<nly;j++){y-=a_h[j]*1.1;draw_lyric_line(p_voice,j,y)}
return(y-a_h[j-1]/6)/sc}
top=staff_tb[p_voice.st].topbar+cfmt.vocalspace
if(y<top)
y=top;y*=sc
for(j=nly;--j>=0;){draw_lyric_line(p_voice,j,y);y+=a_h[j]*1.1}
return y/sc}
function draw_all_lyrics(){var p_voice,s,v,nly,i,x,y,w,a_ly,ly,lyst_tb=new Array(nstaff+1),nv=voice_tb.length,h_tb=new Array(nv),nly_tb=new Array(nv),above_tb=new Array(nv),rv_tb=new Array(nv),top=0,bot=0,st=-1
for(v=0;v<nv;v++){p_voice=voice_tb[v]
if(!p_voice.sym)
continue
if(p_voice.st!=st){top=0;bot=0;st=p_voice.st}
nly=0
if(p_voice.have_ly){if(!h_tb[v])
h_tb[v]=[]
for(s=p_voice.sym;s;s=s.next){a_ly=s.a_ly
if(!a_ly)
continue
x=s.x;w=10
for(i=0;i<a_ly.length;i++){ly=a_ly[i]
if(ly){x-=ly.shift;w=ly.wh[0]
break}}
y=y_get(p_voice.st,1,x,w)
if(top<y)
top=y;y=y_get(p_voice.st,0,x,w)
if(bot>y)
bot=y
while(nly<a_ly.length)
h_tb[v][nly++]=0
for(i=0;i<a_ly.length;i++){ly=a_ly[i]
if(!ly)
continue
if(!h_tb[v][i]||ly.font.size>h_tb[v][i])
h_tb[v][i]=ly.font.size}}}else{y=y_get(p_voice.st,1,0,realwidth)
if(top<y)
top=y;y=y_get(p_voice.st,0,0,realwidth)
if(bot>y)
bot=y}
if(!lyst_tb[st])
lyst_tb[st]={}
lyst_tb[st].top=top;lyst_tb[st].bot=bot;nly_tb[v]=nly
if(nly==0)
continue
if(p_voice.pos.voc)
above_tb[v]=p_voice.pos.voc==C.SL_ABOVE
else if(voice_tb[v+1]&&voice_tb[v+1].st==st&&voice_tb[v+1].have_ly)
above_tb[v]=true
else
above_tb[v]=false
if(above_tb[v])
lyst_tb[st].a=true
else
lyst_tb[st].b=true}
i=0
for(v=0;v<nv;v++){p_voice=voice_tb[v]
if(!p_voice.sym)
continue
if(!p_voice.have_ly)
continue
if(above_tb[v]){rv_tb[i++]=v
continue}
st=p_voice.st;set_dscale(st,true)
if(nly_tb[v]>0)
lyst_tb[st].bot=draw_lyrics(p_voice,nly_tb[v],h_tb[v],lyst_tb[st].bot,1)}
while(--i>=0){v=rv_tb[i];p_voice=voice_tb[v];st=p_voice.st;set_dscale(st,true);lyst_tb[st].top=draw_lyrics(p_voice,nly_tb[v],h_tb[v],lyst_tb[st].top,-1)}
for(v=0;v<nv;v++){p_voice=voice_tb[v]
if(!p_voice.sym)
continue
st=p_voice.st;if(lyst_tb[st].a){top=lyst_tb[st].top+2
for(s=p_voice.sym.next;s;s=s.next){if(s.a_ly){y_set(st,1,s.x-2,10,top)}}}
if(lyst_tb[st].b){bot=lyst_tb[st].bot-2
if(nly_tb[p_voice.v]>0){for(s=p_voice.sym.next;s;s=s.next){if(s.a_ly){y_set(st,0,s.x-2,10,bot)}}}else{y_set(st,0,0,realwidth,bot)}}}}
function parse_gchord(type){var c,text,gch,x_abs,y_abs,type,i,istart,iend,ann_font=get_font("annotation"),h_ann=ann_font.size,line=parse.line
function get_float(){var txt=''
while(1){c=text[i++]
if("1234567890.-".indexOf(c)<0)
return parseFloat(txt)
txt+=c}}
istart=parse.bol+line.index
if(type.length>1){text=type.slice(1,-1);iend=istart+1}else{text=""
while(1){c=line.next_char()
if(!c){syntax(1,"No end of guitar chord")
return}
if(c=='"')
break
if(c=='\\'){text+=c;c=line.next_char()}
text+=c}
iend=parse.bol+line.index+1}
if(curvoice.pos.gch==C.SL_HIDDEN)
return
if(ann_font.box)
h_ann+=3;i=0;type='g'
while(1){c=text[i]
if(!c)
break
gch={text:"",istart:istart,iend:iend,font:ann_font}
switch(c){case'@':type=c;i++;x_abs=get_float()
if(c!=','){syntax(1,"',' lacking in annotation '@x,y'");y_abs=0}else{y_abs=get_float()
if(c!=' ')
i--}
gch.x=x_abs;gch.y=y_abs-h_ann/2
break
case'^':case'_':case'<':case'>':i++;type=c
break
default:switch(type){case'g':gch.font=get_font("gchord")
break
case'@':gch.x=x_abs;y_abs-=h_ann;gch.y=y_abs-h_ann/2
break}
break}
gch.type=type
while(1){c=text[i]
if(!c)
break
switch(c){case'\\':c=text[++i]
if(!c||c=='n')
break
gch.text+='\\'
default:gch.text+=c;i++
continue
case'&':while(1){gch.text+=c;c=text[++i]
switch(c){default:continue
case';':case undefined:case'\\':break}
break}
if(c==';'){i++;gch.text+=c
continue}
break
case';':break}
i++
break}
if(!a_gch)
a_gch=[]
a_gch.push(gch)}}
var note_names="CDEFGAB",acc_name=["bb","b","","#","##"]
function gch_tr1(p,transp){var i,o,n,a,ip,b40,csa=p.split('/')
for(i=0;i<csa.length;i++){p=csa[i];o=p.search(/[ABCDEFG]/);if(o<0)
continue
ip=o+1
a=0
while(p[ip]=='#'){a++;ip++}
while(p[ip]=='b'){a--;ip++}
n=note_names.indexOf(p[o])+16
b40=(abc2svg.pab40(n,a)+transp+200)%40
b40=abc2svg.b40k[b40]
csa[i]=p.slice(0,o)+
note_names[abc2svg.b40_p[b40]]+
acc_name[abc2svg.b40_a[b40]+2]+
p.slice(ip)}
return csa.join('/')}
function gch_transp(s){var gch,i=s.a_gch.length
while(--i>=0){gch=s.a_gch[i]
if(gch.type=='g')
gch.text=gch_tr1(gch.text,curvoice.vtransp)}}
Abc.prototype.gch_build=function(s){var gch,wh,xspc,ix,pos=curvoice.pos.gch==C.SL_BELOW?-1:1,y_above=0,y_below=0,y_left=0,y_right=0,GCHPRE=.4;s.a_gch=a_gch;a_gch=null
if(curvoice.vtransp)
gch_transp(s)
for(ix=0;ix<s.a_gch.length;ix++){gch=s.a_gch[ix]
if(gch.type=='g'){if(cfmt.chordnames){gch.otext=gch.text;gch.text=gch.text.replace(/A|B|C|D|E|F|G/g,function(c){return cfmt.chordnames[c]})
if(cfmt.chordnames.B=='H')
gch.text=gch.text.replace(/Hb/g,'Bb')}
gch.text=gch.text.replace(/##|#|=|bb|b|  /g,function(x){switch(x){case'##':return"&#x1d12a;"
case'#':return"\u266f"
case'=':return"\u266e"
case'b':return"\u266d"
case'  ':return'  '}
return"&#x1d12b;"})}else{if(gch.type=='@'&&!user.anno_start&&!user.anno_stop){gch.wh=[0,0]
continue}}
set_font(gch.font);wh=strwh(gch.text);gch.wh=wh
if(gch.font.box)
wh[1]+=4
switch(gch.type){case'@':break
case'^':xspc=wh[0]*GCHPRE
if(xspc>8)
xspc=8;gch.x=-xspc;y_above-=wh[1];gch.y=y_above
break
case'_':xspc=wh[0]*GCHPRE
if(xspc>8)
xspc=8;gch.x=-xspc;y_below-=wh[1];gch.y=y_below
break
case'<':gch.x=-(wh[0]+6);y_left-=wh[1];gch.y=y_left+wh[1]/2
break
case'>':gch.x=6;y_right-=wh[1];gch.y=y_right+wh[1]/2
break
default:xspc=wh[0]*GCHPRE
if(xspc>8)
xspc=8;gch.x=-xspc;if(pos<0){y_below-=wh[1];gch.y=y_below}else{y_above-=wh[1];gch.y=y_above}
break}}
y_left/=2;y_right/=2
for(ix=0;ix<s.a_gch.length;ix++){gch=s.a_gch[ix]
switch(gch.type){case'^':gch.y-=y_above
break
case'<':gch.y-=y_left
break
case'>':gch.y-=y_right
break
case'g':if(pos>0)
gch.y-=y_above
break}}}
Abc.prototype.draw_gchord=function(s,gchy_min,gchy_max){var gch,text,ix,x,y,y2,hbox,h,y_above,y_below,w=0,yav=s.dur?(((s.notes[s.nhd].pit+s.notes[0].pit)>>1)-18)*3:12
for(ix=0;ix<s.a_gch.length;ix++){gch=s.a_gch[ix]
if(gch.wh[0]>w)
w=gch.wh[0]}
y_above=y_get(s.st,1,s.x-3,w);y_below=y_get(s.st,0,s.x-3,w)
if(y_above<gchy_max)
y_above=gchy_max
if(y_below>gchy_min)
y_below=gchy_min;set_dscale(s.st);for(ix=0;ix<s.a_gch.length;ix++){gch=s.a_gch[ix];use_font(gch.font);set_font(gch.font);h=gch.font.size;hbox=gch.font.box?2:0;w=gch.wh[0];x=s.x+gch.x;text=gch.text
switch(gch.type){case'_':y=gch.y+y_below;y_set(s.st,0,x,w,y-hbox)
break
case'^':y=gch.y+y_above+hbox;y_set(s.st,1,x,w,y+h+hbox)
break
case'<':if(s.notes[0].acc)
x-=s.notes[0].shac;y=gch.y+yav-h/2
break
case'>':if(s.xmx)
x+=s.xmx
if(s.dots)
x+=1.5+3.5*s.dots;y=gch.y+yav-h/2
break
default:if(gch.y>=0){y=gch.y+y_above+hbox;y_set(s.st,true,x,w,y+h+hbox)}else{y=gch.y+y_below;y_set(s.st,false,x,w,y-hbox)}
break
case'@':y=gch.y+yav
if(y>0){y2=y+h
if(y2>staff_tb[s.st].ann_top)
staff_tb[s.st].ann_top=y2}else{if(y<staff_tb[s.st].ann_bot)
staff_tb[s.st].ann_bot=y}
break}
if(user.anno_start)
user.anno_start("annot",gch.istart,gch.iend,x-2,y+h+2,w+4,h+4,s)
xy_str(x,y,text,null,null,gch.wh)
if(user.anno_stop)
user.anno_stop("annot",gch.istart,gch.iend,x-2,y+h+2,w+4,h+4,s)}}
init_tune()
Abc.prototype.add_style=function(s){style+=s};Abc.prototype.cfmt=function(){return cfmt};Abc.prototype.clone=clone;Abc.prototype.deco_cnv=deco_cnv;Abc.prototype.draw_note=draw_note;Abc.prototype.errs=errs;Abc.prototype.font_class=font_class;Abc.prototype.gch_tr1=gch_tr1;Abc.prototype.get_a_gch=function(){return a_gch};Abc.prototype.get_bool=get_bool;Abc.prototype.get_cur_sy=function(){return cur_sy};Abc.prototype.get_curvoice=function(){return curvoice};Abc.prototype.get_delta_tb=function(){return delta_tb};Abc.prototype.get_decos=function(){return decos};Abc.prototype.get_fname=function(){return parse.fname};Abc.prototype.get_font=get_font;Abc.prototype.get_font_style=function(){return font_style};Abc.prototype.get_glyphs=function(){return glyphs};Abc.prototype.get_img=function(){return img};Abc.prototype.get_maps=function(){return maps};Abc.prototype.get_multi=function(){return multicol};Abc.prototype.get_newpage=function(){if(block.newpage){block.newpage=false;return true}};Abc.prototype.get_posy=function(){var t=posy;posy=0;return t};Abc.prototype.get_staff_tb=function(){return staff_tb};Abc.prototype.get_top_v=function(){return par_sy.top_voice};Abc.prototype.get_tsfirst=function(){return tsfirst};Abc.prototype.get_unit=get_unit;Abc.prototype.get_voice_tb=function(){return voice_tb};Abc.prototype.goto_tune=goto_tune;Abc.prototype.info=function(){return info};Abc.prototype.new_block=new_block;Abc.prototype.out_arp=out_arp;Abc.prototype.out_deco_str=out_deco_str;Abc.prototype.out_deco_val=out_deco_val;Abc.prototype.out_ltr=out_ltr;Abc.prototype.param_set_font=param_set_font;Abc.prototype.parse=parse;Abc.prototype.psdeco=empty_function;Abc.prototype.psxygl=empty_function;Abc.prototype.set_cur_sy=function(sy){cur_sy=sy};Abc.prototype.set_dscale=set_dscale;Abc.prototype.set_font=set_font;Abc.prototype.set_scale=set_scale;Abc.prototype.set_tsfirst=function(s){tsfirst=s};Abc.prototype.set_v_param=set_v_param;Abc.prototype.sort_pitch=sort_pitch;Abc.prototype.strwh=strwh;Abc.prototype.stv_g=function(){return stv_g};Abc.prototype.svg_flush=svg_flush;Abc.prototype.syntax=syntax;Abc.prototype.unlksym=unlksym;Abc.prototype.use_font=use_font;Abc.prototype.xy_str=xy_str;Abc.prototype.xygl=xygl;var hook_init
function set_hooks(){var h=abc2svg.modules.hooks,gh=abc2svg.modules.g_hooks
function set_hs(hs){for(var k=0;k<hs.length;k++)
hs[k](self)}
if(hook_init){if(h.length){set_hs(h);gh.push.apply(gh,h);abc2svg.modules.hooks=[]}}else{if(h.length){gh.push.apply(gh,h);abc2svg.modules.hooks=[]}
set_hs(gh);hook_init=true}}}
var Abc=abc2svg.Abc
if(typeof module=='object'&&typeof exports=='object'){exports.abc2svg=abc2svg;exports.Abc=Abc}
if(!abc2svg.loadjs){abc2svg.loadjs=function(fn,onsuccess,onerror){if(onerror)
onerror()}}
abc2svg.modules={ambitus:{fn:'ambitus-1.js'},beginps:{fn:'psvg-1.js'},break:{fn:'break-1.js'},capo:{fn:'capo-1.js'},clip:{fn:'clip-1.js'},clairnote:{fn:'clair-1.js'},voicecombine:{fn:'combine-1.js'},diagram:{fn:'diag-1.js'},equalbars:{fn:'equalbars-1.js'},grid:{fn:'grid-1.js'},grid2:{fn:'grid2-1.js'},MIDI:{fn:'MIDI-1.js'},pageheight:{fn:'page-1.js'},percmap:{fn:'perc-1.js'},soloffs:{fn:'soloffs-1.js'},sth:{fn:'sth-1.js'},temperament:{fn:'temper-1.js'},nreq:0,hooks:[],g_hooks:[],load:function(file,relay,errmsg){function get_errmsg(){if(typeof user=='object'&&user.errmsg)
return user.errmsg
if(typeof printErr=='function')
return printErr
if(typeof alert=='function')
return function(m){alert(m)}
if(typeof console=='object')
return console.log
return function(){}}
var m,r,nreq_i=this.nreq,ls=file.match(/(^|\n)(%%|I:).+?\b/g)
if(!ls)
return true
this.cbf=relay||function(){}
this.errmsg=errmsg||get_errmsg()
for(var i=0;i<ls.length;i++){m=abc2svg.modules[ls[i].replace(/\n?(%%|I:)/,'')]
if(!m||m.loaded)
continue
m.loaded=true
this.nreq++;abc2svg.loadjs(m.fn,function(){if(--abc2svg.modules.nreq==0)
abc2svg.modules.cbf()},function(){abc2svg.modules.errmsg('error loading '+m.fn);if(--abc2svg.modules.nreq==0)
abc2svg.modules.cbf()})}
return this.nreq==nreq_i}}
abc2svg.version="1.20.3";abc2svg.vdate="2019-10-14"
