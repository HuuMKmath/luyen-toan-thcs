PISA.push(
 G(()=>{const t0=ri(4,20),h=sel([2,3,4,5,6]),r=ri(2,6),t1=t0-h*r;if(t1>=0)throw 0;
  const k=ri(1,h-1),tk=t0-r*k,mm=ri(2,5),T=t1-r*mm;
  const ws=[[nm(t0+r*k)+'°C','Nhiệt độ giảm nên phải trừ, không cộng.'],[nm(t1+r*k)+'°C',`Đây là tính ngược từ nhiệt độ lúc cuối (${nm(t1)}°C), không phải từ lúc bắt đầu.`],[nm(t0-r*(k+1))+'°C',`Sau ${k} giờ nhiệt độ giảm ${k} lần, mỗi lần ${r}°C; bạn đã tính thừa một giờ.`]];
  return {title:'Kho lạnh hạ nhiệt độ',ctx:P(`Một kho lạnh đang có nhiệt độ ${t0}°C. Người ta bật máy làm lạnh để nhiệt độ giảm đều theo từng giờ. Sau ${h} giờ, nhiệt độ trong kho là ${nm(t1)}°C.`),qs:[
   A(`Sau ${h} giờ, nhiệt độ trong kho đã thay đổi bao nhiêu độ C? (Nhập số âm nếu nhiệt độ giảm.)`,t1-t0,'°C',`${nm(t1)} − ${t0} = ${nm(t1-t0)}.`,'ch','TH'),
   A('Mỗi giờ nhiệt độ trong kho thay đổi bao nhiêu độ C? (Nhập số âm nếu nhiệt độ giảm.)',-r,'°C',`(${nm(t1-t0)}) : ${h} = ${nm(-r)}.`,'ch','TH'),
   M(`Nhiệt độ trong kho sau ${k} giờ kể từ khi bật máy là bao nhiêu?`,nm(tk)+'°C',ws,`${t0} + ${k} · (${nm(-r)}) = ${t0} − ${r*k} = ${nm(tk)} (°C).`,'vd','VD'),
   A(`Kể từ lúc nhiệt độ là ${nm(t1)}°C, nếu máy vẫn chạy như vậy thì cần thêm bao nhiêu giờ nữa để nhiệt độ trong kho là ${nm(T)}°C?`,mm,'giờ',`Nhiệt độ cần thay đổi thêm ${nm(T)} − (${nm(t1)}) = ${nm(T-t1)} (°C). Số giờ cần thêm: (${nm(T-t1)}) : (${nm(-r)}) = ${mm}.`,'tx','VD')]};})
);
