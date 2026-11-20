PISA.push(
 G(()=>{const d=sel([0.1,0.05,0.08,0.2]),m=sel([3,4]),n=ri(5,8),k=ri(2,4),thick=rd(d*Math.pow(2,n),4);
  const pw=(b,e)=>`${b}<sup>${e}</sup>`;
  return {title:'Gấp đôi tờ giấy',ctx:P(`Một tờ giấy dày ${nm(d)} mm. Mỗi lần gấp đôi tờ giấy thì số lớp giấy tăng lên gấp đôi (lúc đầu có 1 lớp).`),qs:[
   A(`Sau ${m} lần gấp, tờ giấy có bao nhiêu lớp?`,Math.pow(2,m),'lớp',`Sau ${m} lần gấp có ${Array(m).fill(2).join(' · ')} = ${pw(2,m)} = ${Math.pow(2,m)} lớp.`,'dn','TH'),
   M(`Số lớp giấy sau ${n} lần gấp là`,pw(2,n),[[`2 · ${n}`,'Mỗi lần gấp, số lớp được nhân 2, không phải cộng thêm 2. Phải nhân 2 với chính nó nhiều lần.'],[pw(n,2),'Cơ số và số mũ bị đổi chỗ: cơ số là 2, số mũ là số lần gấp.'],[pw(2,n-1),`Lúc đầu có 1 lớp, sau ${n} lần gấp số lớp được nhân 2 đúng ${n} lần.`]],`Sau ${n} lần gấp có ${pw(2,n)} = ${Math.pow(2,n)} lớp giấy.`,'dn','TH'),
   A(`Sau ${n} lần gấp, xấp giấy dày bao nhiêu mi-li-mét?`,thick,'mm',`Có ${pw(2,n)} = ${Math.pow(2,n)} lớp, mỗi lớp dày ${nm(d)} mm. Độ dày: ${Math.pow(2,n)} · ${nm(d)} = ${nm(thick)} (mm).`,'dn','VD'),
   A(`Sau ${n} lần gấp, nếu gấp đôi thêm ${k} lần nữa thì số lớp giấy gấp bao nhiêu lần so với lúc vừa gấp xong ${n} lần?`,Math.pow(2,k),'lần',`${pw(2,n+k)} : ${pw(2,n)} = ${pw(2,k)} = ${Math.pow(2,k)}.`,'nc','VD')]};}),
 G(()=>{const half=RNG()<.5,r=half?[1,2]:[3,4],h=half?sel([8,16,24,32,40]):sel([64,128,256]),n=ri(4,6);
  const hk=j=>h*Math.pow(r[0],j)/Math.pow(r[1],j),X=sel([1,2,3,5,10,20,30].filter(x=>x<hk(2)&&x>hk(5)));if(!X)throw 0;
  let first=1;while(hk(first)>=X)first++;if([1,2,3,4,5,6,7,8].some(j=>Math.abs(hk(j)-X)<1e-9))throw 0;
  const rr=Fh(r[0],r[1]),pw=(b,e)=>`(${b})<sup>${e}</sup>`,h3=rd(hk(3),4);
  return {title:'Quả bóng nảy',ctx:P(`Thả một quả bóng từ độ cao ${h} m. Mỗi lần chạm đất, quả bóng nảy lên đến độ cao bằng ${rr} độ cao của lần rơi ngay trước đó.`),qs:[
   A('Sau lần chạm đất thứ nhất, quả bóng nảy lên cao bao nhiêu mét?',hk(1),'m',`${h} · ${rr} = ${nm(hk(1))} (m).`,'dn','TH'),
   M(`Độ cao (mét) quả bóng nảy lên sau lần chạm đất thứ ${n} là`,`${h} · ${pw(rr,n)}`,[[`${h} · ${rr} · ${n}`,`Mỗi lần nảy, độ cao được nhân với ${rr}, nên phải dùng luỹ thừa, không nhân với ${n}.`],[pw(`${h} · ${rr}`,n),`Chỉ có ${rr} được nhân ${n} lần, độ cao ban đầu ${h} m chỉ nhân một lần.`],[`${h} · ${pw(rr,n-1)}`,`Sau lần chạm đất thứ ${n}, độ cao đã được nhân với ${rr} đúng ${n} lần.`]],`Sau mỗi lần chạm đất độ cao nhân thêm ${rr}, nên sau lần thứ ${n} là ${h} · ${pw(rr,n)}.`,'tt','TH'),
   A('Sau lần chạm đất thứ ba, quả bóng nảy lên cao bao nhiêu mét?',h3,'m',`${h} · ${pw(rr,3)} = ${h} · ${Fh(Math.pow(r[0],3),Math.pow(r[1],3))} = ${nm(h3)} (m).`,'dn','VD'),
   A(`Lần chạm đất thứ mấy là lần đầu tiên quả bóng nảy lên thấp hơn ${X} m?`,first,'',`Độ cao sau các lần chạm đất: ${Array.from({length:first},(_,j)=>nm(hk(j+1))+' m').join('; ')}. Lần thứ ${first} là lần đầu tiên thấp hơn ${X} m.`,'dn','VD')]};})
);
