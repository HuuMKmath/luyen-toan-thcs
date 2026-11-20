PISA.push(
 G(()=>{const sp=['Bóng đá','Cầu lông','Bơi','Bóng rổ','Đá cầu'],v=sp.map(()=>ri(2,14));
  const mx=Math.max(...v),mn=Math.min(...v);if(v.filter(x=>x===mx).length>1||v.filter(x=>x===mn).length>1)throw 0;
  const tot=v.reduce((a,b)=>a+b,0);if(tot<30||tot>45)throw 0;
  const [good,bads]=sel([['Chọn ngẫu nhiên một số học sinh ở tất cả các lớp của trường để hỏi',[['Chỉ hỏi các bạn trong câu lạc bộ bóng đá của trường','Các bạn trong câu lạc bộ bóng đá thường thích bóng đá hơn, nên mẫu này không đại diện cho cả trường.'],['Chỉ hỏi các bạn lớp 7A','Một lớp không đại diện được cho học sinh của tất cả các khối lớp.'],['Chỉ hỏi các bạn nam của trường','Bỏ qua các bạn nữ thì mẫu không đại diện cho toàn trường.']]],
   ['Ở mỗi lớp của trường, chọn ngẫu nhiên vài bạn nam và vài bạn nữ để hỏi',[['Chỉ hỏi các bạn đang tập ở bể bơi của trường','Các bạn đang ở bể bơi thường thích bơi hơn, nên mẫu này không đại diện cho cả trường.'],['Chỉ hỏi các bạn khối 9','Một khối lớp không đại diện được cho học sinh toàn trường.'],['Chỉ hỏi các bạn nữ lớp 7A','Mẫu quá hẹp: chỉ một lớp và chỉ có các bạn nữ.']]]]);
  return {title:'Môn thể thao yêu thích',ctx:P('Bạn lớp trưởng hỏi mỗi bạn trong lớp 7A về môn thể thao bạn đó yêu thích nhất (mỗi bạn chọn đúng một môn) và ghi lại kết quả như bảng sau.')+T(['Môn thể thao','Số bạn'],sp.map((s,i)=>[s,v[i]])),qs:[
   M('Dữ liệu ở cột "Môn thể thao" thuộc loại nào?','Dữ liệu không là số, không thể sắp thứ tự',[['Dữ liệu là số (số liệu)','Tên các môn thể thao không phải là số.'],['Dữ liệu không là số, có thể sắp thứ tự','Tên các môn thể thao không có thứ tự hơn kém (khác với các mức như Rất thích, Thích, Không thích).'],['Vừa là số vừa không là số','Mỗi giá trị trong cột là tên một môn thể thao, nên đều là dữ liệu không là số.']],'Dữ liệu là tên các môn thể thao: không là số và không thể sắp thứ tự.','pl','TH'),
   A('Có bao nhiêu bạn lớp 7A đã trả lời?',tot,'bạn',`${v.join(' + ')} = ${tot} (bạn).`,'bt','TH'),
   A('Số bạn chọn môn được yêu thích nhất nhiều hơn số bạn chọn môn ít được yêu thích nhất là bao nhiêu bạn?',mx-mn,'bạn',`Môn được chọn nhiều nhất là ${sp[v.indexOf(mx)]} (${mx} bạn), ít nhất là ${sp[v.indexOf(mn)]} (${mn} bạn). ${mx} − ${mn} = ${mx-mn}.`,'bt','TH'),
   M('Nhà trường muốn biết môn thể thao học sinh toàn trường yêu thích nhất. Cách khảo sát nào dưới đây bảo đảm tính đại diện?',good,bads,'Mẫu khảo sát phải gồm học sinh ở mọi lớp, cả nam và nữ, được chọn ngẫu nhiên thì mới đại diện cho toàn trường.','dd','VD')]};}),
 G(()=>{const n=8,h=[];while(h.length<n-1)h.push(rd(ri(80,200)/10,1));
  const [bad,why]=sel([[rd(ri(110,190),0),'cao hơn 1 m'],[rd(-ri(5,15)/1,0),'là số âm'],[0,'bằng 0 trong khi cây vẫn sống và đã mọc']]);
  const pos=ri(0,n-1),data=h.slice(0,pos).concat([bad],h.slice(pos));const th=ri(11,16);
  const okv=data.filter((_,i)=>i!==pos),cnt=okv.filter(x=>x>=th).length;if(cnt===0||cnt===n-1||okv.some(x=>x===th))throw 0;
  const re=rd(ri(80,200)/10,1),th2=ri(10,17);const fixd=okv.concat([re]),cnt2=fixd.filter(x=>x>th2).length;if(fixd.some(x=>x===th2))throw 0;
  const others=shuffle(okv).slice(0,3);if(new Set(others.concat([bad]).map(nm)).size<4)throw 0;
  return {title:'Thí nghiệm trồng cây đậu',ctx:P(`Nhóm của bạn An trồng ${n} cây đậu và đo chiều cao của mỗi cây sau hai tuần (đơn vị: cm). Bạn An ghi lại kết quả như bảng sau.`)+T(['Cây',...data.map((_,i)=>i+1)],[['Chiều cao (cm)',...data.map(nm)]]),qs:[
   M('Nhóm bạn An còn ghi thêm cho mỗi cây: tên giống đậu, chiều cao cây, màu lá, số lá. Những dữ liệu nào là dữ liệu là số (số liệu)?','Chiều cao cây và số lá',[['Tên giống đậu và màu lá','Tên giống và màu lá không phải là số.'],['Chỉ có số lá','Chiều cao cây đo bằng cm cũng là số.'],['Cả bốn loại dữ liệu','Tên giống đậu và màu lá là dữ liệu không là số.']],'Chiều cao cây (cm) và số lá là các số; tên giống đậu và màu lá không là số.','pl','TH'),
   M('Trong bảng, giá trị nào chắc chắn không hợp lí?',nm(bad),others.map(x=>[nm(x),`Chiều cao ${nm(x)} cm phù hợp với một cây đậu sau hai tuần.`]),`Giá trị ${nm(bad)} ${why}, không thể là chiều cao của một cây đậu nhỏ trồng được hai tuần.`,'tt','VD'),
   A(`Không kể giá trị không hợp lí, có bao nhiêu cây cao từ ${th} cm trở lên?`,cnt,'cây',`Các chiều cao hợp lí từ ${th} cm trở lên: ${okv.filter(x=>x>=th).map(nm).join('; ')}. Có ${cnt} cây.`,'bt','TH'),
   A(`Nhóm đo lại cây có giá trị không hợp lí và được ${nm(re)} cm. Sau khi sửa, có bao nhiêu cây cao hơn ${th2} cm?`,cnt2,'cây',`Sau khi sửa, các chiều cao lớn hơn ${th2} cm là: ${fixd.filter(x=>x>th2).map(nm).join('; ')||'không có'}. Có ${cnt2} cây.`,'bt','VD')]};})
);
