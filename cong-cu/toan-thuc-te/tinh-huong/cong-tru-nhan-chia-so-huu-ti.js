PISA.push(
 G(()=>{const it=pk([['Táo',5*ri(8,16)],['Cam',5*ri(6,12)],['Nho',10*ri(8,15)],['Xoài',5*ri(6,12)]],3),w=it.map(()=>sel([0.5,1.5,2,2.5,0.75,1.25]));
  const c=it.map((x,i)=>rd(x[1]*w[i],2));if(c.some(v=>Math.abs(v*10-Math.round(v*10))>1e-9))throw 0;
  const tot=rd(c[0]+c[1]+c[2],2),B=tot<200?200:500;if(tot>=B)throw 0;const back=rd(B-tot,2);
  const pr=it[0][1],k=sel([1.5,2.5,0.5,3.5]),M2=rd(pr*k,2);
  const ex=it.map((x,i)=>`${x[1]} · ${nm(w[i])}`);
  return {title:'Mua trái cây',ctx:P('Cô Lan đi mua trái cây. Bảng sau ghi giá bán và khối lượng cô Lan mua mỗi loại.')+T(['Loại','Giá (nghìn đồng/kg)','Khối lượng mua (kg)'],it.map((x,i)=>[x[0],x[1],nm(w[i])])),qs:[
   A(`Số tiền mua ${it[0][0].toLowerCase()} là bao nhiêu nghìn đồng?`,c[0],'nghìn đồng',`${it[0][1]} · ${nm(w[0])} = ${nm(c[0])}.`,'nh','TH'),
   A('Tổng số tiền cô Lan phải trả là bao nhiêu nghìn đồng?',tot,'nghìn đồng',`${ex.join(' + ')} = ${c.map(nm).join(' + ')} = ${nm(tot)}.`,'ct','TH'),
   M(`Cô Lan đưa người bán ${B} nghìn đồng. Biểu thức nào tính số tiền cô Lan được trả lại (nghìn đồng)?`,`${B} − (${ex.join(' + ')})`,[[`${B} − ${ex.join(' + ')}`,'Thiếu dấu ngoặc: chỉ trừ tiền loại thứ nhất mà lại cộng tiền hai loại sau.'],[`${B} − (${it.map(x=>x[1]).join(' + ')}) · (${w.map(nm).join(' + ')})`,'Mỗi loại có giá và khối lượng riêng, phải nhân từng cặp rồi mới cộng.'],[`${B} + (${ex.join(' + ')})`,'Tiền đã trả làm số tiền giảm đi, phải trừ.']],`Tiền trả lại = ${B} − tổng tiền mua = ${B} − (${ex.join(' + ')}) = ${nm(back)} (nghìn đồng).`,'tc','VD'),
   A(`Hôm sau cô Lan có ${nm(M2)} nghìn đồng và chỉ mua ${it[0][0].toLowerCase()} với giá như cũ. Cô mua được bao nhiêu ki-lô-gam ${it[0][0].toLowerCase()}?`,k,'kg',`${nm(M2)} : ${pr} = ${nm(k)} (kg).`,'ch','VD')]};}),
 G(()=>{const a=sel([3,4,5,6]),c=sel([3,4,5]),b=ri(1,c-1),k=ri(2,8),Pg=a*c*k;if(Pg<120||Pg>400||gc(b,c)!==1)throw 0;
  const d1=Pg/a,r1=Pg-d1,d2=r1*b/c,rem=[(a-1)*(c-b),a*c],g=gc(rem[0],rem[1]),rf=[rem[0]/g,rem[1]/g];if(!Number.isInteger(d2)||rf[1]===1)throw 0;
  return {title:'Đọc sách',ctx:P(`Bạn Mai đọc một cuốn sách dày ${Pg} trang. Ngày thứ nhất Mai đọc ${Fh(1,a)} số trang của cuốn sách. Ngày thứ hai Mai đọc ${Fh(b,c)} số trang còn lại.`),qs:[
   A('Ngày thứ nhất Mai đọc bao nhiêu trang?',d1,'trang',`${Pg} · ${Fh(1,a)} = ${d1} (trang).`,'nh','TH'),
   M('Sau ngày thứ nhất, số trang còn lại bằng bao nhiêu phần cuốn sách?',Fh(a-1,a),[[Fh(1,a),'Đây là phần Mai đã đọc, không phải phần còn lại.'],[Fh(a+1,a),`Phần còn lại là 1 − ${Fh(1,a)}, không phải 1 + ${Fh(1,a)}.`],[Fh(a-1,a+1),'Không trừ tử với tử và mẫu với mẫu như vậy. Viết 1 thành phân số có cùng mẫu rồi mới trừ.']],`1 − ${Fh(1,a)} = ${Fh(a-1,a)}.`,'ct','TH'),
   A('Ngày thứ hai Mai đọc bao nhiêu trang?',d2,'trang',`Số trang còn lại sau ngày thứ nhất: ${Pg} − ${d1} = ${r1}. Ngày thứ hai đọc ${r1} · ${Fh(b,c)} = ${d2} (trang).`,'nh','VD'),
   A('Sau hai ngày, số trang chưa đọc bằng bao nhiêu phần cuốn sách? Nhập dạng phân số tối giản.',rf[0]/rf[1],'',`Sau ngày thứ hai còn lại ${Fh(a-1,a)} · (1 − ${Fh(b,c)}) = ${Fh(a-1,a)} · ${Fh(c-b,c)} = ${Fh(rf[0],rf[1])} cuốn sách.`,'tc','VD',Fh(rf[0],rf[1]))]};})
);
