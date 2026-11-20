PISA.push(
 G(()=>{const s=ri(-3,6),mv=[ri(3,9),-ri(4,9),-ri(3,8),ri(3,9)];
  const pos=[s];mv.forEach(d=>pos.push(pos[pos.length-1]+d));
  if(pos.some(x=>x<-4||x>15)||pos[3]>=0)throw 0;
  const W=d=>d>0?`Lên ${d} tầng`:`Xuống ${-d} tầng`,ab=mv.map(Math.abs);
  const ex=(sg)=>`${nm(s)} ${sg[0]} ${ab[0]} ${sg[1]} ${ab[1]} ${sg[2]} ${ab[2]} ${sg[3]} ${ab[3]}`;
  const hi=Math.max(...pos),lo=Math.min(...pos);
  return {title:'Thang máy của toà nhà',ctx:P(`Trong một toà nhà, tầng trệt ghi là tầng 0, các tầng hầm ghi là −1; −2; −3; −4. Một thang máy xuất phát từ tầng ${nm(s)} rồi lần lượt thực hiện bốn lượt di chuyển như bảng sau.`)+T(['Lượt','Di chuyển'],mv.map((d,i)=>[i+1,W(d)])),qs:[
   A('Sau lượt 1, thang máy ở tầng nào?',pos[1],'',`${nm(s)} + ${ab[0]} = ${nm(pos[1])}.`,'cg','TH'),
   M('Biểu thức nào cho biết tầng của thang máy sau cả bốn lượt?',ex(['+','−','−','+']),[[ex(['+','+','+','+']),'Đi xuống thì số tầng giảm, phải trừ.'],[ex(['−','+','+','−']),'Đi lên thì cộng, đi xuống thì trừ; biểu thức này làm ngược lại.'],[ex(['+','−','−','−']),`Lượt 4 là đi lên ${ab[3]} tầng nên phải cộng ${ab[3]}.`]],`Đi lên thì cộng, đi xuống thì trừ: ${ex(['+','−','−','+'])}.`,'tr','TH'),
   A('Sau cả bốn lượt, thang máy ở tầng nào?',pos[4],'',`${ex(['+','−','−','+'])} = ${nm(pos[1])} − ${ab[1]} − ${ab[2]} + ${ab[3]} = ${nm(pos[2])} − ${ab[2]} + ${ab[3]} = ${nm(pos[3])} + ${ab[3]} = ${nm(pos[4])}.`,'dn','VD'),
   A('Tính cả tầng xuất phát, tầng cao nhất và tầng thấp nhất mà thang máy dừng lại cách nhau bao nhiêu tầng?',hi-lo,'tầng',`Thang máy dừng ở các tầng ${pos.map(nm).join('; ')}. Cao nhất là ${nm(hi)}, thấp nhất là ${nm(lo)}. Khoảng cách: ${nm(hi)} − (${nm(lo)}) = ${hi-lo} tầng.`,'tr','VD')]};}),
 G(()=>{const sc=()=>{const x=5*ri(1,8);return RNG()<.5?x:-x;},X=[sc(),sc(),sc(),sc()],D=[sc(),sc(),sc(),sc()];
  const sx=X.reduce((a,b)=>a+b,0),sd=D.reduce((a,b)=>a+b,0);if(sx===sd||X.every(x=>x>0)||D.every(x=>x>0)||X.every(x=>x<0)||D.every(x=>x<0))throw 0;
  const lead=sx>sd?'Đội Xanh':'Đội Đỏ',oth=sx>sd?'Đội Đỏ':'Đội Xanh',k=Math.abs(sx-sd),kw=Math.abs(sx)+Math.abs(sd);
  if(kw===k)throw 0;const m=sc(),need=sd+m-sx;
  const ps=v=>v.map((x,i)=>i?(x<0?` + (${nm(x)})`:` + ${x}`):nm(x)).join('');
  return {title:'Trò chơi tích điểm',ctx:P('Trong một trò chơi, mỗi vòng đội chơi được cộng điểm (ghi số dương) hoặc bị trừ điểm (ghi số âm). Bảng sau ghi điểm của hai đội trong bốn vòng đầu.')+T(['Vòng','Đội Xanh','Đội Đỏ'],X.map((x,i)=>[i+1,nm(x),nm(D[i])])),qs:[
   A('Sau hai vòng đầu, Đội Xanh có bao nhiêu điểm?',X[0]+X[1],'điểm',`${ps(X.slice(0,2))} = ${nm(X[0]+X[1])}.`,'cg','TH'),
   A('Sau bốn vòng, Đội Đỏ có bao nhiêu điểm?',sd,'điểm',`${ps(D)} = ${nm(sd)}.`,'cg','TH'),
   M('Sau bốn vòng, đội nào dẫn trước và hơn đội kia bao nhiêu điểm?',`${lead}, hơn ${k} điểm`,[[`${oth}, hơn ${k} điểm`,`Đội Xanh có ${nm(sx)} điểm, Đội Đỏ có ${nm(sd)} điểm; số lớn hơn là của ${lead}.`],[`${lead}, hơn ${kw} điểm`,'Không cộng phần số của hai tổng điểm; hiệu hai số nguyên là số lớn trừ số nhỏ.'],[`${oth}, hơn ${kw} điểm`,'Cả đội dẫn trước và số điểm hơn đều chưa đúng.']],`Đội Xanh: ${nm(sx)} điểm, Đội Đỏ: ${nm(sd)} điểm. ${lead} hơn: ${nm(Math.max(sx,sd))} − (${nm(Math.min(sx,sd))}) = ${k} điểm.`,'tr','VD'),
   A(`Ở vòng 5, Đội Đỏ được ghi ${nm(m)} điểm. Đội Xanh phải được ghi bao nhiêu điểm ở vòng 5 để sau năm vòng hai đội bằng điểm nhau?`,need,'điểm',`Sau vòng 5, Đội Đỏ có ${nm(sd)} + (${nm(m)}) = ${nm(sd+m)} điểm. Đội Xanh cần ghi ${nm(sd+m)} − (${nm(sx)}) = ${nm(need)} điểm.`,'tr','VD')]};})
);
