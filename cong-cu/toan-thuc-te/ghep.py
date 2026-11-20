# Ghép các tình huống Toán thực tế bổ sung vào trang bài.
# Cách dùng: python3 cong-cu/toan-thuc-te/ghep.py ten-thu-muc-bai [...]  (dùng "." cho trang Tam giác bằng nhau)
import sys,re,os
HERE=os.path.dirname(os.path.abspath(__file__))
REPO=os.path.abspath(os.path.join(HERE,'..','..'))
B='/* ==== Toán thực tế bổ sung: bắt đầu ==== */'
E='/* ==== Toán thực tế bổ sung: kết thúc ==== */'
pre=open(os.path.join(HERE,'_prelude.js'),encoding='utf8').read()
for page in sys.argv[1:]:
    f=REPO+('/index.html' if page=='.' else f'/{page}/index.html')
    src=os.path.join(HERE,'tinh-huong',('tam-giac' if page=='.' else page)+'.js')
    h=open(f,encoding='utf8').read()
    h=re.sub(re.escape(B)+r'.*?'+re.escape(E)+r'\n',lambda m:'',h,flags=re.S)
    body=open(src,encoding='utf8').read() if os.path.exists(src) else ''
    if body.strip():
        block=B+'\n{\n'+pre+body+'}\n'+E+'\n'
        i=h.index('/* ============ Trạng thái')
        h=h[:i]+block+h[i:]
    h=h.replace('const units=shuffle(PISA).slice(0,2)','const units=shuffle(PISA).slice(0,3)')
    h=h.replace('<span>Hai tình huống trong đời sống, mỗi tình huống có 3 đến 4 câu hỏi từ dễ đến khó.</span>','<span>Ba tình huống trong đời sống (chọn ngẫu nhiên mỗi lần làm), mỗi tình huống có 3 đến 4 câu hỏi từ dễ đến khó.</span>')
    open(f,'w',encoding='utf8').write(h)
    print('đã ghép',page)
