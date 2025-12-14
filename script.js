// =====================
// Navegação (protege contra páginas que não têm os botões)
// =====================
const btnDia1 = document.getElementById('btnDia1');
if (btnDia1) {
  btnDia1.addEventListener('click', () => window.location.href = 'day1.html');
}

const btnDia2 = document.getElementById('btnDia2');
if (btnDia2) {
  btnDia2.addEventListener('click', () => {
    if (!btnDia2.disabled) window.location.href = 'day2.html';
  });
}

const btnDia3 = document.getElementById('btnDia3');
if (btnDia3) {
  btnDia3.addEventListener('click', () => {
    if (!btnDia3.disabled) window.location.href = 'day3.html';
  });
}

function voltarParaHome() {
  window.location.href = 'index.html';
}

// =====================
// Day 3 - Revelar (pop-up com imagens em sequência)
// =====================
const btnRevelar = document.getElementById('btnRevelar');
const overlay = document.getElementById('revealOverlay');
const revealImg = document.getElementById('revealImg');

if (btnRevelar && overlay && revealImg) {
  // Troque os caminhos para suas imagens reais:
  const imagens = [
    './Imagens/Mensagem Equipe/Suellen fim.png',
    './Imagens/Mensagem Equipe/DeiseFim.png',
    './Imagens/Mensagem Equipe/GiseleFim.png',
    './Imagens/Mensagem Equipe/TamiresFim.png',
    './Imagens/Mensagem Equipe/PedroFim.png',
    './Imagens/Mensagem Equipe/GuilhermeFim.png',
    './Imagens/Mensagem Equipe/TalitaFim.png',
    './Imagens/Mensagem Equipe/ThaynaFim.png',
    './Imagens/Mensagem Equipe/LauraFim.png'
  ];

  const DURACAO_MS = 10000; // 10 segundos
  const MARGEM = 40;        // margem mínima das bordas (px)

  let rodando = false;

  function posicaoAleatoriaComMargem(imgEl) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Pega tamanho atual renderizado (depois do src carregado)
    const rect = imgEl.getBoundingClientRect();
    const w = rect.width || 200;
    const h = rect.height || 200;

    const maxX = Math.max(MARGEM, vw - w - MARGEM);
    const maxY = Math.max(MARGEM, vh - h - MARGEM);

    const x = Math.floor(MARGEM + Math.random() * (maxX - MARGEM));
    const y = Math.floor(MARGEM + Math.random() * (maxY - MARGEM));

    imgEl.style.left = `${x}px`;
    imgEl.style.top = `${y}px`;
  }

  async function mostrarSequencia() {
    if (rodando) return;
    rodando = true;

    overlay.classList.remove('hidden');
    overlay.setAttribute('aria-hidden', 'false');

    for (let i = 0; i < imagens.length; i++) {
      // Carrega a imagem e espera carregar antes de posicionar
      await new Promise((resolve, reject) => {
        revealImg.onload = () => resolve();
        revealImg.onerror = () => reject(new Error('Erro ao carregar imagem: ' + imagens[i]));
        revealImg.src = imagens[i];
      });

      // Posiciona respeitando margem
      posicaoAleatoriaComMargem(revealImg);

      // Mostra
      revealImg.classList.add('show');

      // Fica 10s
      await new Promise((r) => setTimeout(r, DURACAO_MS));

      // Some (e só depois passa pra próxima)
      revealImg.classList.remove('show');
      await new Promise((r) => setTimeout(r, 400)); // tempo da animação
    }

    overlay.classList.add('hidden');
    overlay.setAttribute('aria-hidden', 'true');

    rodando = false;
  }

  btnRevelar.addEventListener('click', mostrarSequencia);
}



(function startFallingImages(){
  const body = document.body;

  // Se quiser só na HOME, descomente a linha abaixo:
  if (body.id == 'body_day3') return;

  const layer = document.createElement('div');
  layer.className = 'fall-layer';
  document.body.appendChild(layer);

  // >>> TROQUE AQUI para a imagem que você quer que caia
  const IMG_SRC = './Imagens/Fundos/FlocoTrabbe.png';

  // Configurações
  const QTD = 100;                 // quantidade de "flocos"
  const TAM_MIN = 18;             // px
  const TAM_MAX = 42;             // px
  const VEL_MIN = 40;             // px/seg
  const VEL_MAX = 130;            // px/seg
  const ROT_MIN = 40;             // graus/seg
  const ROT_MAX = 220;            // graus/seg
  const DRIFT = 35;               // “vento” lateral (px) - suavinho

  const itens = [];
  const rand = (a,b)=> a + Math.random()*(b-a);

  function criarItem(){
    const img = document.createElement('img');
    img.className = 'fall-item';
    img.src = IMG_SRC;
    img.alt = '';
    img.decoding = 'async';

    const size = rand(TAM_MIN, TAM_MAX);
    img.style.width = `${size}px`;
    img.style.height = 'auto';

    layer.appendChild(img);

    const item = {
      el: img,
      x: rand(0, window.innerWidth),
      y: rand(-window.innerHeight, 0),
      vy: rand(VEL_MIN, VEL_MAX),
      rot: rand(0, 360),
      vrot: rand(ROT_MIN, ROT_MAX) * (Math.random() < 0.5 ? -1 : 1),
      phase: rand(0, Math.PI*2),
      amp: rand(5, DRIFT),
      size
    };

    itens.push(item);
  }

  for(let i=0;i<QTD;i++) criarItem();

  let last = performance.now();

  function tick(now){
    const dt = (now - last) / 1000; // segundos
    last = now;

    const w = window.innerWidth;
    const h = window.innerHeight;

    for(const it of itens){
      it.y += it.vy * dt;
      it.rot += it.vrot * dt;
      it.phase += dt * 1.2; // velocidade do balanço

      const xDrift = Math.sin(it.phase) * it.amp;
      const x = it.x + xDrift;

      // aplica transform (mais leve que ficar mudando top/left)
      it.el.style.transform = `translate(${x}px, ${it.y}px) rotate(${it.rot}deg)`;

      // quando sai por baixo, volta pro topo em X aleatório
      if(it.y > h + 80){
        it.y = -80 - rand(0, 200);
        it.x = rand(0, w);
        it.vy = rand(VEL_MIN, VEL_MAX);
        it.amp = rand(5, DRIFT);
      }
    }

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);

  // Recalcula posições ao redimensionar
  window.addEventListener('resize', () => {
    // nada obrigatório aqui; só garante que não "trave" fora
    for(const it of itens){
      if(it.x > window.innerWidth) it.x = rand(0, window.innerWidth);
    }
  });
})();
