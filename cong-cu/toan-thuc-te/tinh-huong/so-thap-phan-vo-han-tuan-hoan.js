PISA.push(
 G(()=>{const n=sel([3,6,7,9,11,12]),L=ri(2,30);if(fin(L,n))throw 0;
  const o=dexp(L,n),R=dstr(o),k=ri(8,20),dk=dig(L,n,k),v=L/n;if(near5(v,2)||o.per.length>6)throw 0;
  const w1=(()=>{const s=dstr({I:o.I,pre:(o.pre+o.per).slice(0,2)||'0',per:''});return [s,`Đây là số thập phân hữu hạn, chỉ lấy vài chữ số đầu. ${L} : ${n} cho số thập phân vô hạn tuần hoàn.`];})();
  if(dexp(n,L).per.length>6)throw 0;const w2=[dstr(dexp(n,L)),`Đây là kết quả của ${n} : ${L}, bị đảo số bị chia và số chia.`];
  const o3=dexp(L,n+1),w3=[dstr(o3),`Đây là kết quả khi chia cho ${n+1}, không phải ${n}.`];
  return {title:'Cắt cuộn ruy băng',ctx:P(`Một cuộn ruy băng dài ${L} m được cắt thành ${n} đoạn dài bằng nhau.`),qs:[
   M('Mỗi đoạn ruy băng dài bao nhiêu mét (viết dưới dạng số thập phân)?',R,[w1,w2,w3],`${L} : ${n} = ${Fh(L,n)} = ${R}.`,'pd','TH'),
   A('Chu kì của số thập phân đó gồm mấy chữ số?',o.per.length,'chữ số',`${Fh(L,n)} = ${R}, chu kì là ${o.per}, gồm ${o.per.length} chữ số.`,'ck','TH'),
   A('Làm tròn độ dài mỗi đoạn đến hàng phần trăm (đơn vị: m).',rd(v,2),'m',`${R} = ${o.I},${(o.pre+o.per.repeat(4)).slice(0,4)}... Chữ số hàng phần nghìn là ${dig(L,n,3)} ${dig(L,n,3)>=5?'≥ 5 nên làm tròn lên':'< 5 nên giữ nguyên'}: được ${nm(rd(v,2))} m.`,'lt','VD'),
   A(`Chữ số thứ ${k} sau dấu phẩy của số thập phân đó là chữ số nào?`,dk,'',`${R}: ${o.pre?`sau ${o.pre.length} chữ số ${o.pre} là `:''}chu kì ${o.per} lặp lại mãi. Viết ra ${k} chữ số đầu sau dấu phẩy: ${(o.pre+o.per.repeat(30)).slice(0,k)}. Chữ số thứ ${k} là ${dk}.`,'ck','VD')]};}),
 G(()=>{const counts=pk([3,4,5,6,7,8,9,11,12,15],4);const PL=['A','B','C','D'],packs=PL.map(x=>'Gói '+x);
  const price=counts.map(c=>ri(Math.ceil(c*2.2),c*5));const fins=counts.map((c,i)=>fin(price[i],c));if(fins.filter(Boolean).length!==1)throw 0;
  if(counts.some((c,i)=>price[i]%c===0))throw 0;
  const fi=fins.indexOf(true),pi=sel([0,1,2,3].filter(i=>i!==fi)),o=dexp(price[pi],counts[pi]);if(o.per.length>4)throw 0;
  const per=counts.map((c,i)=>price[i]/c),mn=per.indexOf(Math.min(...per));if(per.filter(x=>Math.abs(x-per[mn])<1e-9).length>1)throw 0;
  const v=per[pi];if(near5(v,1)||dexp(counts[pi],price[pi]).per.length>6)throw 0;const R=dstr(o);
  const lb=i=>`${packs[i]} (${counts[i]} bút, ${price[i]} nghìn đồng)`;
  const cheapPrice=price.indexOf(Math.min(...price));
  return {title:'Mua bút theo gói',ctx:P('Một cửa hàng bán bút bi cùng loại theo các gói như bảng sau.')+T(['Gói','Số bút','Giá gói (nghìn đồng)'],PL.map((p,i)=>[p,counts[i],price[i]])),qs:[
   M('Với gói nào, giá tiền mỗi chiếc bút (nghìn đồng) viết được dưới dạng số thập phân hữu hạn?',packs[fi],[0,1,2,3].filter(i=>i!==fi).map(i=>[packs[i],`${price[i]} : ${counts[i]} = ${dstr(dexp(price[i],counts[i]))} là số thập phân vô hạn tuần hoàn.`]),`Phân số tối giản có mẫu dương chỉ có ước nguyên tố 2 và 5 thì viết được dưới dạng số thập phân hữu hạn. ${price[fi]} : ${counts[fi]} = ${dstr(dexp(price[fi],counts[fi]))}.`,'nb','TH'),
   M(`Giá tiền mỗi chiếc bút của gói ${PL[pi]} được viết gọn là`,R+' (nghìn đồng)',[[dstr({I:o.I,pre:(o.pre+o.per+o.per).slice(0,2),per:''})+' (nghìn đồng)','Đây là số thập phân hữu hạn, thiếu phần chu kì lặp lại.'],(o.pre?[dstr({I:o.I,pre:'',per:o.pre+o.per})+' (nghìn đồng)',`Chu kì chỉ gồm ${o.per}; phần ${o.pre} đứng trước chu kì, không lặp lại.`]:o.per.length>1?[dstr({I:o.I,pre:'',per:o.per.slice(1)+o.per[0]})+' (nghìn đồng)',`Chu kì phải bắt đầu ngay sau dấu phẩy với chữ số ${o.per[0]}: chu kì là ${o.per}.`]:[dstr({I:o.I,pre:o.per,per:String((+o.per+1)%10)})+' (nghìn đồng)',`Sau dấu phẩy chỉ có chữ số ${o.per} lặp lại mãi.`]),[dstr(dexp(counts[pi],price[pi]))+' (nghìn đồng)','Đã chia số bút cho giá tiền; phải lấy giá tiền chia cho số bút.']],`${price[pi]} : ${counts[pi]} = ${R}.`,'ck','TH'),
   A(`Làm tròn giá tiền mỗi chiếc bút của gói ${PL[pi]} đến hàng phần mười (nghìn đồng).`,rd(v,1),'nghìn đồng',`${R} = ${o.I},${(o.pre+o.per.repeat(4)).slice(0,3)}... Chữ số hàng phần trăm là ${dig(price[pi],counts[pi],2)} nên làm tròn được ${nm(rd(v,1))}.`,'lt','VD'),
   M('Mua theo gói nào thì giá mỗi chiếc bút rẻ nhất?',lb(mn),[0,1,2,3].filter(i=>i!==mn).map(i=>[lb(i),i===cheapPrice?'Gói này có giá gói thấp nhất nhưng ít bút; phải so sánh giá của mỗi chiếc bút.':`Mỗi chiếc bút ở gói này giá ${dstr(dexp(price[i],counts[i]))} nghìn đồng, đắt hơn ${dstr(dexp(price[mn],counts[mn]))} nghìn đồng.`]),`Giá mỗi bút: ${PL.map((p,i)=>`${p}: ${dstr(dexp(price[i],counts[i]))}`).join('; ')} (nghìn đồng). Rẻ nhất là gói ${PL[mn]}.`,'pd','VD')]};})
);
