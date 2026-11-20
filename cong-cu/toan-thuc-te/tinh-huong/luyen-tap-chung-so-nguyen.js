PISA.push(
 G(()=>{const f=sel([6,7,8]),s=ri(15,40),m=sel([50,100]),tr=[ri(1,3),0,ri(1,3),ri(1,2),ri(1,3)];
  const days=['Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu'];
  const ch=tr.map((t,i)=>i===1?m:-t*f);let bal=s;for(const x of ch){bal+=x;if(bal<0)throw 0;}
  const after2=s+ch[0]+ch[1],sp=[0,2,3,4].map(i=>tr[i]*f),tot=sp.reduce((x,y)=>x+y,0),rest=s-tot+m,more=Math.floor(rest/f);
  const L=sp.join(' + ');
  return {title:'Thẻ đi xe buýt',ctx:P(`Đầu tuần, thẻ xe buýt của bạn Hùng còn ${s} nghìn đồng. Mỗi lượt đi xe bị trừ ${f} nghìn đồng. Bảng sau ghi số tiền trong thẻ thay đổi trong tuần (đơn vị: nghìn đồng).`)+T(['Ngày','Việc','Thay đổi'],days.map((d,i)=>[d,i===1?'Nạp tiền':`Đi ${tr[i]} lượt xe`,i===1?'+'+m:nm(ch[i])])),qs:[
   A('Sau khi nạp tiền vào thứ Ba, thẻ còn bao nhiêu nghìn đồng?',after2,'nghìn đồng',`${s} + (${nm(ch[0])}) + ${m} = ${after2}.`,'bn','TH'),
   M('Biểu thức nào tính số tiền trong thẻ vào cuối ngày thứ Sáu?',`${s} − (${L}) + ${m}`,[[`${s} − (${L}) − ${m}`,'Tiền nạp làm số tiền trong thẻ tăng, phải cộng.'],[`${s} + (${L}) + ${m}`,'Tiền đi xe làm số tiền trong thẻ giảm, phải trừ.'],[`${s} − ${L} − ${m}`,`Trừ lần lượt từng khoản tiền đi xe là đúng, nhưng tiền nạp ${m} nghìn đồng phải được cộng vào chứ không trừ.`]],`Số tiền cuối tuần = tiền đầu tuần − tổng tiền đi xe + tiền nạp = ${s} − (${L}) + ${m}.`,'bn','VD'),
   A('Cuối ngày thứ Sáu, thẻ còn bao nhiêu nghìn đồng?',rest,'nghìn đồng',`${s} − (${L}) + ${m} = ${s} − ${tot} + ${m} = ${rest}.`,'hl','VD'),
   A('Với số tiền còn lại trong thẻ, tuần sau Hùng đi được nhiều nhất bao nhiêu lượt xe mà không cần nạp thêm?',more,'lượt',`${rest} = ${f} · ${more} + ${rest%f}. Hùng đi được nhiều nhất ${more} lượt.`,'vd','VD')]};})
);
