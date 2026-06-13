// ============================================================
// APP - Mi Academia (clon funcional de "Mi UPC")
// Todo se guarda en localStorage (en el celular, sin internet)
// ============================================================

const STORAGE_KEY = 'miAcademiaData_v1';
const TABS_PRINCIPALES = ['inicio','academico','ayuda','perfil'];
const NAV_MAP = { inicio:'inicio', academico:'academico', situacion:'academico', historial:'academico',
                   cursos:'academico', detalle:'academico', horario:'inicio', ayuda:'ayuda', perfil:'perfil' };

let DATA = null;
let cursoActualId = null;

// ---------------- Inicialización de datos ----------------
function datosPorDefecto(){
  const cursos = {};
  MALLA.forEach(c => {
    cursos[c.id] = {
      estado: 'pendiente', // pendiente | cursando | aprobado | desaprobado
      promedio: null,
      inasistencias: 0,
      notas: { DD1:null, EB1:null, TB1:null, TB2:null }
    };
  });
  return {
    nombre: 'Carlos',
    sesionIniciada: false,
    cursos: cursos
  };
}

function cargarDatos(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(raw){
      const parsed = JSON.parse(raw);
      // Asegurar que existan entradas para todos los cursos de la malla (por si se agregan)
      MALLA.forEach(c=>{
        if(!parsed.cursos[c.id]){
          parsed.cursos[c.id] = { estado:'pendiente', promedio:null, inasistencias:0, notas:{DD1:null,EB1:null,TB1:null,TB2:null} };
        }
      });
      return parsed;
    }
  }catch(e){ console.error('Error cargando datos', e); }
  return datosPorDefecto();
}

function guardarDatos(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DATA));
}

// ---------------- Navegación ----------------
function irA(pantalla){
  document.querySelectorAll('.pantalla').forEach(p=>p.classList.remove('activa'));
  const el = document.getElementById('pantalla-'+pantalla);
  if(el) el.classList.add('activa');

  // actualizar navbar activo
  const navTab = NAV_MAP[pantalla] || 'inicio';
  document.querySelectorAll('.nav-item').forEach(n=>{
    n.classList.toggle('activo', n.dataset.tab === navTab);
  });

  // render específico
  if(pantalla==='inicio') renderInicio();
  if(pantalla==='situacion') renderSituacion();
  if(pantalla==='historial') renderHistorial();
  if(pantalla==='cursos') { popularSelectCiclos(); renderCursosLista(); }
  if(pantalla==='perfil') renderPerfil();

  window.scrollTo(0,0);
}

// ---------------- Login ----------------
function iniciarSesion(){
  const nombreInput = document.getElementById('loginNombre').value.trim();
  if(nombreInput) DATA.nombre = nombreInput;
  DATA.sesionIniciada = true;
  guardarDatos();
  document.getElementById('login').style.display = 'none';
  document.getElementById('navbar').style.display = 'flex';
  irA('inicio');
}

function cerrarSesion(){
  DATA.sesionIniciada = false;
  guardarDatos();
  document.getElementById('navbar').style.display = 'none';
  document.querySelectorAll('.pantalla').forEach(p=>p.classList.remove('activa'));
  document.getElementById('login').style.display = 'flex';
}

// ---------------- Toast ----------------
let toastTimeout;
function mostrarToast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(()=>t.classList.remove('show'), 1800);
}

// ---------------- Cálculos de avance ----------------
function calcularResumen(){
  let asigCumplidas = 0, credCumplidos = 0, credElectivosCumplidos = 0;
  let sumaPonderada = 0, creditosConNota = 0;

  MALLA.forEach(c=>{
    const cd = DATA.cursos[c.id];
    if(cd.estado === 'aprobado'){
      asigCumplidas++;
      if(c.tipo === 'Electivo') credElectivosCumplidos += c.creditos;
      else credCumplidos += c.creditos;

      if(cd.promedio !== null && !isNaN(cd.promedio)){
        sumaPonderada += cd.promedio * c.creditos;
        creditosConNota += c.creditos;
      }
    }
  });

  const totalCredObligatorios = TOTAL_CREDITOS_OBLIGATORIOS; // 170
  const totalAsig = TOTAL_ASIGNATURAS; // 50
  const totalCredElectivos = TOTAL_CREDITOS_ELECTIVOS; // 30
  const totalCredCarrera = TOTAL_CREDITOS; // 200

  const promedioGlobal = creditosConNota > 0 ? (sumaPonderada/creditosConNota) : 0;
  const credTotalCumplido = credCumplidos + credElectivosCumplidos;

  return {
    asigCumplidas, totalAsig,
    credCumplidos, totalCredObligatorios,
    credElectivosCumplidos, totalCredElectivos,
    credTotalCumplido, totalCredCarrera,
    promedioGlobal,
    creditosObligatoriosPendientes: Math.max(0, totalCredObligatorios - credCumplidos)
  };
}

// ---------------- Donut SVG ----------------
function dibujarDonut(containerId, pct, color, size=84){
  const r = size===84 ? 36 : 60, stroke = size===84 ? 10 : 14;
  const cx = size/2, cy = size/2;
  const c = 2*Math.PI*r;
  const offset = c - (pct/100)*c;
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#E6E8F0" stroke-width="${stroke}"/>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="${stroke}"
        stroke-dasharray="${c}" stroke-dashoffset="${offset}" stroke-linecap="round"/>
    </svg>`;
  document.getElementById(containerId).innerHTML = svg;
}

// ---------------- Render: Inicio ----------------
function renderInicio(){
  document.getElementById('nombreInicio').textContent = DATA.nombre;

  // Mostrar próximo curso "cursando" como destacado, o el primero pendiente
  const cursando = MALLA.filter(c => DATA.cursos[c.id].estado === 'cursando');
  const lista = cursando.length ? cursando : MALLA.filter(c=>DATA.cursos[c.id].estado==='pendiente').slice(0,1);
  const cont = document.getElementById('inicioCursoActual');
  const dots = document.getElementById('dotsInicio');

  if(lista.length === 0){
    cont.innerHTML = `<div class="curso-nombre">No tienes cursos activos registrados</div>
      <a class="ver-detalle" href="#" onclick="irA('cursos');return false;">Ir a cursos</a>`;
    dots.innerHTML = '';
    return;
  }
  const curso = lista[0];
  const badgeClass = curso.tipo==='Electivo' ? 'badge-virtual' : 'badge-virtual';
  cont.innerHTML = `
    <span class="badge-virtual">CICLO ${curso.ciclo}</span>
    <div class="curso-nombre">${curso.nombre}</div>
    <a class="ver-detalle" href="#" onclick="abrirDetalle('${curso.id}');return false;">Ver más detalle &#9662;</a>`;
  dots.innerHTML = lista.slice(0,6).map((c,i)=>`<span class="dot ${i===0?'activo':''}"></span>`).join('');
}

// ---------------- Render: Situación académica ----------------
function renderSituacion(){
  const r = calcularResumen();

  document.getElementById('saPromedio').textContent = r.promedioGlobal > 0 ? r.promedioGlobal.toFixed(2) : '—';

  // Donut asignaturas
  const pctAsig = r.totalAsig ? (r.asigCumplidas/r.totalAsig*100) : 0;
  dibujarDonut('donutAsig', pctAsig, '#3FB54A');
  document.getElementById('donutAsigPct').textContent = pctAsig.toFixed(0)+'%';
  document.getElementById('asigCumplido').textContent = r.asigCumplidas;
  document.getElementById('asigTotal').textContent = r.totalAsig;

  // Donut créditos obligatorios
  const pctCred = r.totalCredObligatorios ? (r.credCumplidos/r.totalCredObligatorios*100) : 0;
  dibujarDonut('donutCred', pctCred, '#3FB54A');
  document.getElementById('donutCredPct').textContent = pctCred.toFixed(2)+'%';
  document.getElementById('credCumplido').textContent = r.credCumplidos;
  document.getElementById('credTotal').textContent = r.totalCredObligatorios;

  // Donut electivos
  const pctElec = r.totalCredElectivos ? (r.credElectivosCumplidos/r.totalCredElectivos*100) : 0;
  dibujarDonut('donutElec', Math.min(pctElec,100), '#3FB54A', 140);
  document.getElementById('donutElecPct').textContent = pctElec.toFixed(2)+'%';
  document.getElementById('elecCumplido').textContent = r.credElectivosCumplidos;
  document.getElementById('elecTotal').textContent = r.totalCredElectivos;

  // Donut total carrera
  const pctTotal = r.totalCredCarrera ? (r.credTotalCumplido/r.totalCredCarrera*100) : 0;
  dibujarDonut('donutTotal', pctTotal, '#3F2DA5', 140);
  document.getElementById('donutTotalPct').textContent = pctTotal.toFixed(1)+'%';
  document.getElementById('totCumplido').textContent = r.credTotalCumplido;
  document.getElementById('totTotal').textContent = r.totalCredCarrera;

  // Info adicional
  document.getElementById('infoAprobados').textContent = r.credTotalCumplido;
  document.getElementById('infoPendientes').textContent = r.creditosObligatoriosPendientes;
}

// ---------------- Render: Historial de notas ----------------
function renderHistorial(){
  const r = calcularResumen();
  document.getElementById('histPromedio').textContent = r.promedioGlobal > 0 ? r.promedioGlobal.toFixed(2) : '—';

  const cont = document.getElementById('historialPorCiclo');
  let html = '';
  for(let ciclo=1; ciclo<=10; ciclo++){
    const cursos = MALLA.filter(c=>c.ciclo===ciclo);
    const conNota = cursos.filter(c=>{
      const cd = DATA.cursos[c.id];
      return cd.estado==='aprobado' || cd.estado==='desaprobado';
    });
    if(conNota.length===0) continue;

    let creditosAprob = 0, creditosMatric = 0;
    conNota.forEach(c=>{ creditosMatric += c.creditos; if(DATA.cursos[c.id].estado==='aprobado') creditosAprob += c.creditos; });

    html += `<div class="resumen-title">CICLO ${ciclo}</div>`;
    conNota.forEach(c=>{
      const cd = DATA.cursos[c.id];
      const estadoClass = cd.estado==='aprobado' ? 'estado-aprobado' : 'estado-desaprobado';
      const estadoTxt = cd.estado==='aprobado' ? 'APROBADO' : 'DESAPROBADO';
      html += `
        <div class="curso-list-item" onclick="abrirDetalle('${c.id}')">
          <div class="info">
            <div class="nombre">${c.nombre}</div>
            <div style="font-size:13px;color:#5C6470;">Código: ${c.codigo} · Créditos: ${c.creditos}</div>
            <div style="margin-top:6px;">
              <span class="estado-badge ${estadoClass}">${estadoTxt}</span>
              ${cd.promedio!==null ? `<span style="margin-left:8px;font-family:'Oswald',sans-serif;font-weight:700;color:var(--morado);">Nota: ${cd.promedio.toFixed(2)}</span>` : ''}
            </div>
          </div>
        </div>`;
    });

    html += `
      <div class="info-box">
        <div class="titulo-mini">RESUMEN DEL PERIODO - CICLO ${ciclo}</div>
        <div class="info-row"><span>Créditos matriculados:</span><b>${creditosMatric}</b></div>
        <div class="info-row"><span>Créditos aprobados:</span><b>${creditosAprob}</b></div>
      </div>`;
  }

  if(!html){
    html = `<div class="vacio"><span class="em">📄</span>Aún no has marcado cursos como aprobados o desaprobados.<br><br>Ve a "Cursos" para registrar tus notas.</div>`;
  }
  cont.innerHTML = html;
}

// ---------------- Render: Lista de cursos por ciclo ----------------
function popularSelectCiclos(){
  const sel = document.getElementById('selectCicloCursos');
  if(sel.options.length>0) return;
  for(let i=1;i<=10;i++){
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = 'Ciclo '+i;
    sel.appendChild(opt);
  }
}

function renderCursosLista(){
  const ciclo = parseInt(document.getElementById('selectCicloCursos').value);
  const cont = document.getElementById('listaCursos');
  const cursos = MALLA.filter(c=>c.ciclo===ciclo);

  cont.innerHTML = cursos.map(c=>{
    const cd = DATA.cursos[c.id];
    const badge = c.tipo==='Electivo' ? 'badge-virtual' : 'badge-virtual';
    const badgeTxt = c.tipo;
    let estadoClass='estado-pendiente', estadoTxt='PENDIENTE';
    if(cd.estado==='aprobado'){estadoClass='estado-aprobado';estadoTxt='APROBADO';}
    else if(cd.estado==='cursando'){estadoClass='estado-cursando';estadoTxt='CURSANDO';}
    else if(cd.estado==='desaprobado'){estadoClass='estado-desaprobado';estadoTxt='DESAPROBADO';}

    return `
      <button class="curso-list-item" onclick="abrirDetalle('${c.id}')">
        <div class="info">
          <span class="${badge}" style="font-size:10px;">${badgeTxt}</span>
          <div class="nombre">${c.nombre}</div>
          <div class="codigo">${c.codigo} · ${c.creditos} créditos</div>
          <div style="margin-top:8px;">
            <span class="estado-badge ${estadoClass}">${estadoTxt}</span>
            ${cd.promedio!==null ? `<span style="margin-left:8px;font-family:'Oswald',sans-serif;font-weight:700;color:var(--morado);font-size:13px;">${cd.promedio.toFixed(2)}</span>` : ''}
          </div>
        </div>
        <span class="flecha">&rsaquo;</span>
      </button>`;
  }).join('');
}

// ---------------- Detalle de curso ----------------
function abrirDetalle(cursoId){
  cursoActualId = cursoId;
  const c = MALLA.find(x=>x.id===cursoId);
  const cd = DATA.cursos[cursoId];

  document.getElementById('dcBadge').innerHTML = `<span class="badge-virtual">${c.tipo}</span>`;
  document.getElementById('dcTitulo').textContent = c.nombre;
  document.getElementById('dcCreditos').textContent = c.creditos;
  document.getElementById('dcCiclo').textContent = c.ciclo;
  document.getElementById('dcInasistencias').value = cd.inasistencias || 0;
  document.getElementById('dcEstado').value = cd.estado;

  document.getElementById('notaDD1').value = cd.notas.DD1 ?? '';
  document.getElementById('notaEB1').value = cd.notas.EB1 ?? '';
  document.getElementById('notaTB1').value = cd.notas.TB1 ?? '';
  document.getElementById('notaTB2').value = cd.notas.TB2 ?? '';

  calcularPromedio(false);
  actualizarVistaDetalle();
  irA('detalle');
}

function actualizarVistaDetalle(){
  // si está aprobado, sugerir guardar promedio automáticamente si hay notas completas
}

function calcularPromedio(guardar=true){
  const dd1 = parseFloat(document.getElementById('notaDD1').value);
  const eb1 = parseFloat(document.getElementById('notaEB1').value);
  const tb1 = parseFloat(document.getElementById('notaTB1').value);
  const tb2 = parseFloat(document.getElementById('notaTB2').value);

  const vals = [
    {v:dd1, w:0.30},
    {v:eb1, w:0.25},
    {v:tb1, w:0.20},
    {v:tb2, w:0.25}
  ];

  let promedio = null;
  if(vals.every(x=>!isNaN(x.v))){
    promedio = vals.reduce((s,x)=>s + x.v*x.w, 0);
  }

  document.getElementById('dcPromedioFinal').textContent = promedio!==null ? promedio.toFixed(2) : '—';

  if(guardar) guardarDetalle(promedio);
  return promedio;
}

function guardarDetalle(promedioOverride){
  if(!cursoActualId) return;
  const cd = DATA.cursos[cursoActualId];

  cd.inasistencias = parseInt(document.getElementById('dcInasistencias').value) || 0;
  cd.estado = document.getElementById('dcEstado').value;

  const dd1 = document.getElementById('notaDD1').value;
  const eb1 = document.getElementById('notaEB1').value;
  const tb1 = document.getElementById('notaTB1').value;
  const tb2 = document.getElementById('notaTB2').value;

  cd.notas.DD1 = dd1==='' ? null : parseFloat(dd1);
  cd.notas.EB1 = eb1==='' ? null : parseFloat(eb1);
  cd.notas.TB1 = tb1==='' ? null : parseFloat(tb1);
  cd.notas.TB2 = tb2==='' ? null : parseFloat(tb2);

  const promedio = promedioOverride !== undefined ? promedioOverride : calcularPromedio(false);
  cd.promedio = promedio;

  guardarDatos();
}

// ---------------- Perfil ----------------
function renderPerfil(){
  document.getElementById('perfilNombre').textContent = DATA.nombre.toUpperCase();
  document.getElementById('perfilNombreInput').value = DATA.nombre;
}

function actualizarNombre(){
  const val = document.getElementById('perfilNombreInput').value.trim();
  if(val){
    DATA.nombre = val;
    guardarDatos();
  }
}

// ---------------- Exportar / Importar / Reset ----------------
function exportarDatos(){
  const blob = new Blob([JSON.stringify(DATA, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'mi_academia_backup.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  mostrarToast('Respaldo descargado');
}

function importarDatos(event){
  const file = event.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = function(e){
    try{
      const parsed = JSON.parse(e.target.result);
      if(!parsed.cursos) throw new Error('Formato inválido');
      DATA = parsed;
      MALLA.forEach(c=>{
        if(!DATA.cursos[c.id]){
          DATA.cursos[c.id] = { estado:'pendiente', promedio:null, inasistencias:0, notas:{DD1:null,EB1:null,TB1:null,TB2:null} };
        }
      });
      guardarDatos();
      mostrarToast('Datos importados correctamente');
      irA('inicio');
    }catch(err){
      mostrarToast('Error: archivo no válido');
    }
  };
  reader.readAsText(file);
  event.target.value = '';
}

function resetearDatos(){
  if(confirm('¿Seguro que quieres borrar todos tus datos y empezar de nuevo?')){
    DATA = datosPorDefecto();
    DATA.sesionIniciada = true;
    guardarDatos();
    mostrarToast('Datos reiniciados');
    irA('inicio');
  }
}

// ---------------- Init ----------------
window.addEventListener('DOMContentLoaded', ()=>{
  DATA = cargarDatos();
  document.getElementById('loginNombre').value = DATA.nombre;

  if(DATA.sesionIniciada){
    document.getElementById('login').style.display = 'none';
    document.getElementById('navbar').style.display = 'flex';
    irA('inicio');
  }
});
