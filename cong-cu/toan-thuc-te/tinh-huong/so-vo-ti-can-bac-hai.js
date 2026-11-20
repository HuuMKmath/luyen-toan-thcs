PISA.push(
 G(()=>{const k=ri(6,20),S=k*k,g=sel(k%2?[0.5]:[0.5,0.4]),tiles=Math.round((k/g)*(k/g));
  const Tq=ri(20,150);if(Number.isInteger(Math.sqrt(Tq)))throw 0;const r=rd(Math.sqrt(Tq),1);if(near5(Math.sqrt(Tq),1)||Number.isInteger(r))throw 0;
  const w=[[nm(rd(Tq/4,2)),`Lấy diện tích chia 4 là sai; cạnh hình vuông là căn bậc hai số học của diện tích.`],[nm(rd(Tq/2,2)),'Cạnh hình vuông không phải là một nửa diện tích.'],[nm(Math.round(Math.sqrt(Tq))),'Đề yêu cầu làm tròn đến hàng phần mười, không phải hàng đơn vị.']];
  return {title:'Lát gạch sân trường',ctx:P(`Sân chơi của một trường có dạng hình vuông với diện tích ${S} m². Nhà trường lát kín sân bằng gạch hình vuông cạnh ${nm(g)} m.`),qs:[
   A('Cạnh của sân chơi dài bao nhiêu mét?',k,'m',`Cạnh sân là √${S} = ${k} (m) vì ${k}² = ${S} và ${k} > 0.`,'cb','TH'),
   A('Chu vi của sân chơi là bao nhiêu mét?',4*k,'m',`Chu vi = 4 · ${k} = ${4*k} (m).`,'tt','TH'),
   A('Cần bao nhiêu viên gạch để lát kín sân?',tiles,'viên',`Mỗi cạnh sân xếp được ${k} : ${nm(g)} = ${nm(k/g)} viên. Số viên gạch: ${nm(k/g)} · ${nm(k/g)} = ${tiles} viên.`,'tt','VD'),
   M(`Bên cạnh sân, nhà trường làm một vườn hoa hình vuông có diện tích ${Tq} m². Dùng máy tính cầm tay, độ dài cạnh vườn hoa làm tròn đến hàng phần mười là bao nhiêu mét?`,nm(r),w,`Cạnh vườn hoa là √${Tq} ≈ ${nm(rd(Math.sqrt(Tq),4))}... ≈ ${nm(r)} (m).`,'mt','VD')]};}),
 G(()=>{const S=ri(10,90);if(Number.isInteger(Math.sqrt(S)))throw 0;const s=Math.sqrt(S),r1=rd(s,1),per=4*s,rp=Math.round(per);
  if(near5(s,1)||Math.abs(per-Math.floor(per)-0.5)<0.03)throw 0;
  return {title:'Tấm kính hình vuông',ctx:P(`Một tấm kính hình vuông có diện tích ${S} dm².`),qs:[
   M('Độ dài cạnh của tấm kính (đơn vị: dm) là',`√${S}, là một số vô tỉ`,[[`√${S}, là một số hữu tỉ`,`${S} không phải là bình phương của một số tự nhiên nào nên √${S} là số vô tỉ.`],[`${nm(rd(S/2,1))}, là một số hữu tỉ`,'Cạnh hình vuông không bằng một nửa diện tích.'],[`${nm(rd(S/4,2))}, là một số hữu tỉ`,'Lấy diện tích chia 4 là cách tính cạnh từ chu vi, không phải từ diện tích.']],`Cạnh tấm kính là √${S} dm. Vì ${S} không phải là số chính phương nên √${S} là số vô tỉ.`,'vt','TH'),
   A('Dùng máy tính cầm tay, làm tròn độ dài cạnh tấm kính đến hàng phần mười (đơn vị: dm).',r1,'dm',`√${S} ≈ ${nm(rd(s,4))}... ≈ ${nm(r1)} (dm).`,'mt','TH'),
   A('Người ta làm một khung nhôm bao quanh tấm kính. Chiều dài khung bằng chu vi tấm kính. Dùng máy tính cầm tay, làm tròn chiều dài khung đến hàng đơn vị (đơn vị: dm).',rp,'dm',`Chu vi = 4 · √${S} ≈ ${nm(rd(per,3))}... ≈ ${rp} (dm). Nên tính 4 · √${S} rồi mới làm tròn.`,'tt','VD'),
   A(`Ghép bốn tấm kính như vậy thành một tấm kính hình vuông lớn. Cạnh của tấm kính lớn bằng √m dm. Tìm m.`,4*S,'',`Diện tích tấm lớn là 4 · ${S} = ${4*S} (dm²), nên cạnh của nó là √${4*S} dm. Vậy m = ${4*S}.`,'cb','VD')]};})
);
