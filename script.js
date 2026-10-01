  var WHATSAPP = '917900048087';
  // Edit these lists to match the bakery's real menu
  var FLAVOURS = [
    {name:'Chocolate',   sponge:'#5A2E22', icing:'#7A4032', ink:'#FFFAFB'},
    {name:'Vanilla',     sponge:'#F3D9A4', icing:'#FFF3E0', ink:'#3A1B26'},
    {name:'Tiramisu',    sponge:'#C9A27A', icing:'#F1E4D3', ink:'#3A1B26'},
    {name:'Red velvet',  sponge:'#B3202F', icing:'#FFF1F1', ink:'#FFFAFB'},
    {name:'Pistachio',   sponge:'#A9D6A0', icing:'#E6F3DD', ink:'#3A1B26'}
  ];
  var SIZES = ['0.5 kg','1 kg','1.5 kg','2 kg'];
  var MODES = ['Pickup','Delivery'];
  var FAQS = [
    {q:'How far in advance should I order?', a:'At least 24 hours for most designs; 2-3 days for very detailed custom cakes.'},
    {q:'Do you deliver?', a:'Pickup from Sector 8 is always available \u2014 ask us on WhatsApp about delivery to your area.'},
    {q:'How is the price decided?', a:'Price depends on size and design complexity. We confirm it on WhatsApp once we see your reference photo.'},
    {q:'Can I make changes after ordering?', a:'Small changes are fine up to 24 hours before pickup \u2014 just message us on WhatsApp.'}
  ];

  // ---- flavour / size chips ----
  var flavourBox = document.getElementById('flavours');
  var sizeBox = document.getElementById('sizes');

  function chip(box, group, value, id, checked){
    var input = document.createElement('input');
    input.type = 'radio'; input.name = group; input.id = id; input.value = value;
    if(checked) input.checked = true;
    var label = document.createElement('label');
    label.htmlFor = id; label.textContent = value;
    box.appendChild(input); box.appendChild(label);
    return input;
  }

  FLAVOURS.forEach(function(f,i){
    chip(flavourBox,'flavour',f.name,'f'+i,i===0).addEventListener('change',paint);
  });
  SIZES.forEach(function(s,i){
    chip(sizeBox,'size',s,'s'+i,i===1);
  });

  MODES.forEach(function(m,i){ chip(document.getElementById('modes'),'mode',m,'m'+i,i===0); });
  var nameInput = document.getElementById('cname');
  var msgInput = document.getElementById('msg');
  var dateInput = document.getElementById('date');
  var today = new Date();
  dateInput.min = today.getFullYear()+'-'+String(today.getMonth()+1).padStart(2,'0')+'-'+String(today.getDate()).padStart(2,'0');

  function selected(group){
    var el = document.querySelector('input[name="'+group+'"]:checked');
    return el ? el.value : '';
  }

  function paint(){
    var name = selected('flavour');
    var f = FLAVOURS.filter(function(x){return x.name===name;})[0] || FLAVOURS[0];
    ['sponge1','sponge2'].forEach(function(id){document.getElementById(id).setAttribute('fill',f.sponge);});
    ['icing1','icing2'].forEach(function(id){document.getElementById(id).setAttribute('fill',f.icing);});
    document.querySelectorAll('#drips1 rect,#drips2 rect').forEach(function(r){r.setAttribute('fill',f.icing);});
    var t = document.getElementById('cakeMsg');
    t.setAttribute('fill', f.ink);
    t.textContent = msgInput.value.trim();
    document.getElementById('cakeCaption').textContent = f.name;
  }
  msgInput.addEventListener('input',paint);
  paint();

  document.getElementById('orderForm').addEventListener('submit',function(e){
    e.preventDefault();
    var lines = [
      'Hi Pink Patisserie! I would like to order a cake.',
      'Flavour: '+selected('flavour'),
      'Size: '+selected('size'),
      selected('mode')+(selected('mode')==='Delivery'?' (I will share my address)':'')
    ];
    if(nameInput.value.trim()) lines.push('Name: '+nameInput.value.trim());
    if(msgInput.value.trim()) lines.push('Message on cake: '+msgInput.value.trim());
    if(dateInput.value) lines.push('Needed on: '+dateInput.value);
    lines.push('I will send a reference photo.');
    window.open('https://wa.me/'+WHATSAPP+'?text='+encodeURIComponent(lines.join('\n')),'_blank','noopener');
  });

  // ---- FAQ accordion ----
  var faqList = document.getElementById('faqList');
  FAQS.forEach(function(item){
    var wrap = document.createElement('div');
    wrap.className = 'faq-item reveal';
    wrap.innerHTML =
      '<button class="faq-q" type="button"><span>'+item.q+'</span><span class="plus">+</span></button>'+
      '<div class="faq-a"><p>'+item.a+'</p></div>';
    faqList.appendChild(wrap);
    var btn = wrap.querySelector('.faq-q');
    var panel = wrap.querySelector('.faq-a');
    btn.addEventListener('click', function(){
      var isOpen = wrap.classList.contains('open');
      faqList.querySelectorAll('.faq-item.open').forEach(function(o){
        o.classList.remove('open'); o.querySelector('.faq-a').style.maxHeight = null;
      });
      if(!isOpen){
        wrap.classList.add('open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  // ---- scroll reveal ----
  var revealEls = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){ entry.target.classList.add('in'); io.unobserve(entry.target); }
      });
    }, {threshold:0.12});
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('in'); });
  }

  // ---- header shadow + mobile sticky CTA ----
  var header = document.getElementById('siteHeader');
  var sticky = document.getElementById('stickyCta');
  var planSection = document.getElementById('plan');
  window.addEventListener('scroll', function(){
    header.classList.toggle('scrolled', window.scrollY > 10);
    var planTop = planSection.getBoundingClientRect().top;
    sticky.classList.toggle('show', window.scrollY > 420 && planTop > 80);
  }, {passive:true});
