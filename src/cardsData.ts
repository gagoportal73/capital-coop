import { GameCard, PlayerState, RoomState } from './types';

export const CATEGORIES: Record<number, string> = {
  1: "Eventos de Contexto (Grupales)",
  2: "Exclusivas para el Emprendedor",
  3: "Exclusivas para el Empleado",
  4: "Exclusivas para el Estudiante",
  5: "Tentaciones y Consumo Impulsivo",
  6: "Créditos, Cuotas y Deudas",
  7: "Inversiones y Mercado de Capitales",
  8: "Imprevistos del Entorno / Suerte",
  9: "Economía Circular y Sustentabilidad",
  10: "Seguros y Gestión del Riesgo",
  11: "Cooperativismo y Sinergia de Grupo",
  12: "Sistema Financiero y Bancos",
  13: "El Sistema Impositivo",
  14: "Alerta de Estafas y Educación Digital",
  15: "Inserción Laboral y Primer Empleo",
  16: "Microeconomía y Decisiones del Hogar",
  17: "Contexto Cambiario y Moneda Extranjera",
  18: "Planificación y Acceso a la Vivienda",
  19: "Proyectos de Inversión de Alto Impacto",
  20: "Eventos de Fin de Año / Cierre de Ciclo"
};

export const CARDS_POOL: GameCard[] = [
  // 1. El Tarifazo
  {
    id: "CARD_001",
    title: "El Tarifazo",
    text: "Aumento de tarifas: Se eliminaron los subsidios a la luz y el gas en el barrio. El costo de los servicios básicos sube para todos.",
    category: CATEGORIES[1],
    categoryId: 1,
    target: "group",
    options: [
      { id: "A", text: "Absorber el costo de forma cooperativa usando el Fondo Común (-$45.000 este mes).", effectDescription: "Paga el Fondo Común. Los jugadores evitan el impacto inmediato." },
      { id: "B", text: "Que cada integrante se haga cargo individualmente de su boleta (-$15.000 fijos permanentes en gastos).", effectDescription: "Gastos fijos individuales suben $15.000 permanentemente." },
      { id: "C", text: "Recortar drásticamente el uso de energía y calefacción en la casa/taller (-15 de Bienestar para todos).", effectDescription: "Ahorran dinero, pero el Bienestar de todos cae 15 puntos." }
    ]
  },
  // 2. Golpe Inflacionario
  {
    id: "CARD_002",
    title: "Golpe Inflacionario",
    text: "La inflación mensual se aceleró fuertemente. El costo de la canasta básica de alimentos aumentó un 20%.",
    category: CATEGORIES[1],
    categoryId: 1,
    target: "group",
    options: [
      { id: "A", text: "Asignar un fondo de emergencia del Fondo Común (-$30.000) para comprar mercadería mayorista.", effectDescription: "Se reduce el golpe: cada jugador pierde solo $5.000 este mes." },
      { id: "B", text: "Ajustarse el cinturón de forma individual: cada uno gasta $20.000 de sobra este mes.", effectDescription: "Menos saldo personal. Gasto fijo obligatorio sube $20.000 solo por este turno." },
      { id: "C", text: "Suprimir comidas fuera o productos de calidad (-30 de Bienestar para todos, sin costo extra).", effectDescription: "Baja la moral drásticamente (-30 Bienestar) pero guardan el dinero." }
    ]
  },
  // 3. Epidemia de Dengue
  {
    id: "CARD_003",
    title: "Epidemia de Dengue",
    text: "Fuerte ola de mosquitos en la zona. Para prevenir, el grupo debe comprar repelentes, insecticidas y tules comunitarios.",
    category: CATEGORIES[1],
    categoryId: 1,
    target: "group",
    options: [
      { id: "A", text: "Desembolsar $30.000 del Fondo Común para el kit comunitario de prevención.", effectDescription: "Se compran repelentes grupales. Todos a salvo." },
      { id: "B", text: "Adquirir kits individuales en cuotas: -$12.000 de saldo para cada uno.", effectDescription: "Saldo individual disminuido temporalmente, pero sin enfermedad." },
      { id: "C", text: "No gastar y confiar en la suerte. ¡Alerta de enfermedad!", effectDescription: "Un jugador aleatorio se enferma el próximo mes (pierde 40% de ingresos y -30 Bienestar)." }
    ]
  },
  // 4. Hackeo en Masa
  {
    id: "CARD_004",
    title: "Hackeo en Masa",
    text: "¡Alerta de Ciberseguridad! Filtraron los datos de la billetera virtual que usa el grupo. El eslabón más débil cayó en la trampa.",
    category: CATEGORIES[1],
    categoryId: 1,
    target: "group",
    options: [
      { id: "A", text: "Pagar un software de antivirus grupal de urgencia (-$15.000 del Fondo Común).", effectDescription: "Se protegen las cuentas de todos. Suma +10 en puntuación de grupo." },
      { id: "B", text: "El que tenga menor educación/capacitación asume el golpe y la filtración.", effectDescription: "El jugador con menos 'Capacitación' pierde el 50% de su saldo actual." },
      { id: "C", text: "Pedirle soporte de onda al Estudiante si tiene capacitación (+15 Bienestar para él).", effectDescription: "Si el Estudiante tiene Capacitación >= 2, los salva; si no, el grupo pierde $40.000 del Fondo." }
    ]
  },
  // 5. Reintegro de IVA
  {
    id: "CARD_005",
    title: "Reintegro de IVA",
    text: "Se activó un programa estatal de beneficio fiscal. Devuelven el IVA en alimentos de primera necesidad para todos.",
    category: CATEGORIES[1],
    categoryId: 1,
    target: "group",
    options: [
      { id: "A", text: "Depositar todo el bono individual recibido en el Fondo Común (+$54.000 colectivos).", effectDescription: "Aportes individuales de $18.000 consolidados en el fondo grupal." },
      { id: "B", text: "Quedarse cada jugador con su bono para gastos individuales (+$18.000 a cada saldo).", effectDescription: "Inyección inmediata de liquidez individual." },
      { id: "C", text: "Comprar suministros sustentables para la comunidad (+20 de Bienestar general y +25 de puntos de grupo).", effectDescription: "Suma bienestar colectivo y prestigio financiero." }
    ]
  },
  // 6. Herramienta Rota (Emprendedor)
  {
    id: "CARD_006",
    title: "Herramienta de Trabajo Rota",
    text: "¡Se rompió la computadora de trabajo del Emprendedor de golpe! Su negocio está paralizado.",
    category: CATEGORIES[2],
    categoryId: 2,
    target: "emprendedor",
    options: [
      { id: "A", text: "Pagar $60.000 ya para arreglarla al instante (puede pedir prestado o usar el fondo).", effectDescription: "Conserva sus ingresos completos. Bienestar -5." },
      { id: "B", text: "No arreglarla: los ingresos del Emprendedor caen un 40% permanente de acá en adelante.", effectDescription: "Ahorra hoy, pero destruye su potencial de facturación." },
      { id: "C", text: "Usar $35.000 del Fondo Común y $25.000 del saldo del Emprendedor para un arreglo exprés.", effectDescription: "Financiado en sociedad. Se reduce el golpe individual." }
    ]
  },
  // 7. El Gran Cliente (Emprendedor)
  {
    id: "CARD_007",
    title: "La Oportunidad del Gran Cliente",
    text: "Una empresa enorme quiere contratar al Emprendedor, pero le exige estar al día con el Monotributo y emitir factura electrónica.",
    category: CATEGORIES[2],
    categoryId: 2,
    target: "emprendedor",
    options: [
      { id: "A", text: "Pagar $30.000 ya para regularizar la deuda impositiva de AFIP.", effectDescription: "¡Éxito! Sus ingresos mensuales aumentan un 30% permanente." },
      { id: "B", text: "Dejar pasar la oportunidad para no pagar la AFIP.", effectDescription: "Mantiene su dinero, pero el negocio se estanca. Bienestar -10." },
      { id: "C", text: "Pedir al Empleado ser socios y usar su cuenta fiscal (-$15.000 de saldo al Empleado).", effectDescription: "Socio técnico: ingresa el contrato pero divide el beneficio (ingresos suben 15% a ambos)." }
    ]
  },
  // 11. Negociación de Paritarias (Empleado)
  {
    id: "CARD_011",
    title: "Negociación de Paritarias",
    text: "El sindicato de tu sector cerró una paritaria para compensar la inflación mensual acumulada.",
    category: CATEGORIES[3],
    categoryId: 3,
    target: "empleado",
    options: [
      { id: "A", text: "Aceptar el acuerdo inmediatamente (+15% de ingresos mensuales permanentemente).", effectDescription: "Aumento salarial estable y asegurado." },
      { id: "B", text: "Hacer huelga por bonos extras (gasta $10.000 en transporte, pero con un 50% de chance de subir 25% o quedarse igual).", effectDescription: "Menos dinero hoy, pero lucha por un ingreso mucho mayor." },
      { id: "C", text: "Destinar el 5% de su nuevo sueldo total al Fondo Común a cambio de +50 puntos grupales.", effectDescription: "Aumento permanente de 10% de ingresos y suben puntos cooperativos masivamente." }
    ]
  },
  // 12. La Changita de Fin de Semana (Empleado)
  {
    id: "CARD_012",
    title: "La Changita de Fin de Semana",
    text: "Le ofrecen un trabajo de consultoría extra el sábado a la noche al Empleado. Pagan muy bien, pero le quita tiempo clave de descanso.",
    category: CATEGORIES[3],
    categoryId: 3,
    target: "empleado",
    options: [
      { id: "A", text: "Aceptar la changa: gana $40.000 extra, pero su Bienestar baja un 25%.", effectDescription: "Mucha plata instantánea, pero riesgo de cansancio extremo." },
      { id: "B", text: "Rechazar: priorizar descanso y tiempo con amigos (+15 de Bienestar).", effectDescription: "Conserva energía mental, pero sin recompensa económica." },
      { id: "C", text: "Delegar parte de la changa al Estudiante pagándole $20.000 (el Empleado se queda con $20.000).", effectDescription: "Colaboración: el Empleado gana $20.000 sin perder bienestar; el Estudiante gana $20.000." }
    ]
  },
  // 16. Inversión en Educación (Estudiante)
  {
    id: "CARD_016",
    title: "Certificación Técnica Clave",
    text: "Inscripción abierta para una certificación técnica de alta demanda laboral. Cuesta matrícula pero potencia el currículum.",
    category: CATEGORIES[4],
    categoryId: 4,
    target: "estudiante",
    options: [
      { id: "A", text: "Inscribirse pagando $40.000. Suma +2 puntos de Capacitación permanente.", effectDescription: "Futuro brillante: a partir del mes 6, sus ingresos base aumentarán un 50%." },
      { id: "B", text: "No inscribirse por falta de fondos. Se queda sin la certificación.", effectDescription: "Conserva el dinero, pero su perfil laboral se estanca." },
      { id: "C", text: "Pedir financiamiento al Fondo Común ($40.000). El grupo decide educarlo.", effectDescription: "El Estudiante gana +2 Capacitación. Al graduarse, el grupo gana +100 puntos de estrategia." }
    ]
  },
  // 17. Computadora Lenta (Estudiante)
  {
    id: "CARD_017",
    title: "Computadora Lenta",
    text: "La laptop del Estudiante tarda media hora en prender. Pierde horas productivas de trabajo freelance.",
    category: CATEGORIES[4],
    categoryId: 4,
    target: "estudiante",
    options: [
      { id: "A", text: "Comprar un disco SSD nuevo por $20.000 de contado.", effectDescription: "Se soluciona la lentitud de inmediato. Bienestar +10." },
      { id: "B", text: "Seguir igual. Los ingresos freelance de este mes caen un 25% por baja productividad.", effectDescription: "Ahorra hoy, pero pierde ingresos." },
      { id: "C", text: "Pedirle prestada una netbook vieja al Empleado (sin costo de dinero, pero -10 Bienestar por incomodidad).", effectDescription: "Zafa de la caída de ingresos a costa de comodidad." }
    ]
  },
  // 21. El Festival del Año (Tentaciones)
  {
    id: "CARD_021",
    title: "El Festival del Año",
    text: "¡Salió el line-up del festival de música más esperado y todos tus amigos van! La entrada cuesta $60.000.",
    category: CATEGORIES[5],
    categoryId: 5,
    target: "group", // Can vote or individual resolves
    options: [
      { id: "A", text: "Que quienes quieran ir paguen la entrada de $60.000 (+40 Bienestar).", effectDescription: "Afecta los bolsillos que la compren, aumenta bienestar a tope." },
      { id: "B", text: "Ignorar por completo. Quedarse en casa con 'FOMO' (-30 Bienestar absoluto).", effectDescription: "Cero gasto, pero el desánimo bajará un 20% la efectividad el mes que viene." },
      { id: "C", text: "Organizar una juntada cooperativa en el patio con pizza por $10.000 por cabeza (+20 Bienestar).", effectDescription: "Ahorro enorme y diversión sana grupal." }
    ]
  },
  // 22. Zapatillas con Descuento (Falso)
  {
    id: "CARD_022",
    title: "Zapatillas 'Super Descuento'",
    text: "Una notificación te alerta: '¡Solo por hoy 30% off en tus zapatillas urbanas favoritas!'. Realmente no las necesitás.",
    category: CATEGORIES[5],
    categoryId: 5,
    target: "group",
    options: [
      { id: "A", text: "Comprar las zapatillas de impulso (-$45.000 de saldo individual, +15 Bienestar).", effectDescription: "Impulso consumista que drena la billetera." },
      { id: "B", text: "Ignorar la 'oferta' publicitaria y ahorrar el dinero.", effectDescription: "Sumás +1 punto de Educación Financiera gracias al autocontrol." },
      { id: "C", text: "Destinar la mitad de ese dinero ($22.500) a un Fondo de Ahorro Comunitario.", effectDescription: "Ahorro solidario grupal: +30 puntos e ingresos futuros blindados." }
    ]
  },
  // 26. La Tarjeta 'Explotada'
  {
    id: "CARD_026",
    title: "La Tarjeta 'Explotada'",
    text: "Llegó el resumen de la tarjeta de crédito del Empleado y excede su presupuesto disponible.",
    category: CATEGORIES[6],
    categoryId: 6,
    target: "empleado",
    options: [
      { id: "A", text: "Hacer Pago Total liquidando todos los ahorros individuales (le queda saldo en $0).", effectDescription: "Impacto seco pero sin deudas de interés usurero." },
      { id: "B", text: "Hacer Pago Mínimo de $15.000. El saldo restante se refinancia al 70% de interés mensual.", effectDescription: "Paga poco hoy, pero su gasto aumentará masivamente el próximo mes." },
      { id: "C", text: "Solicitar auxilio financiero al Fondo Común de $40.000 a devolver sin intereses.", effectDescription: "Saneamiento grupal. Evita la usura gracias al cooperativismo." }
    ]
  },
  // 31. Fiebre Cripto
  {
    id: "CARD_031",
    title: "Fiebre Cripto",
    text: "Un gurú financiero de Instagram promete que una nueva moneda 'meme' va a subir un 1000% esta semana.",
    category: CATEGORIES[7],
    categoryId: 7,
    target: "group",
    options: [
      { id: "A", text: "Especular fuerte: meter $40.000 individuales en la criptomoneda.", effectDescription: "80% de probabilidad de perder todo, 20% de triplicarlo. ¡Pura Timba!" },
      { id: "B", text: "Rechazar por completo la especulación y capacitarse en inversiones tradicionales.", effectDescription: "Gana +1 punto de Capacitación por evitar trampas lógicas." },
      { id: "C", text: "Colocar un monto mediano defensivo de $10.000 en stablecoins de rendimiento estable (4% mensual).", effectDescription: "Inversión prudente. Suma interés compuesto y seguridad." }
    ]
  },
  // 36. Multa de Tránsito
  {
    id: "CARD_036",
    title: "Multa de Tránsito",
    text: "Le aplicaron una fotomulta al Emprendedor por un supuesto exceso de velocidad al repartir mercadería.",
    category: CATEGORIES[8],
    categoryId: 8,
    target: "emprendedor",
    options: [
      { id: "A", text: "Aprovechar el pago voluntario rápido de $20.000 en este turno.", effectDescription: "Cierra el asunto sin acumular deudas." },
      { id: "B", text: "Ignorar y apelar la multa con un descargo digital escrito.", effectDescription: "Gana tiempo, pero si falla pagará $50.000 en el mes 12 (50% de probabilidad de éxito)." },
      { id: "C", text: "Pedir al Estudiante con Capacitación que redacte una apelación profesional formal.", effectDescription: "Si el Estudiante tiene Capacitación >= 2, la multa se anula gratis. Si no, pagan los $20.000." }
    ]
  },
  // 41. Reparación Creativa
  {
    id: "CARD_041",
    title: "Reparación Creativa",
    text: "Se descocieron las zapatillas de lona favoritas del Estudiante. Hay que decidir cómo resolverlo de apuro.",
    category: CATEGORIES[9],
    categoryId: 9,
    target: "estudiante",
    options: [
      { id: "A", text: "Comprar unas zapatillas de marca nuevas por $50.000 de contado.", effectDescription: "Drena la caja del Estudiante, sube Bienestar +10." },
      { id: "B", text: "Llevarlas al zapatero remendón del barrio por $12.000.", effectDescription: "Economía circular: ahorra mucho y obtiene +1 en Educación Financiera." },
      { id: "C", text: "Coserlas con ayuda de tutorías de internet y customizarlas gratis.", effectDescription: "Gasto $0, Bienestar +15 por orgullo del DIY." }
    ]
  },
  // 46. Seguro de Celular contra Robos
  {
    id: "CARD_046",
    title: "Seguro de Celular",
    text: "Te ofrecen asegurar tu celular (herramienta indispensable para cooperar) contra asaltos urbanos por una baja cuota.",
    category: CATEGORIES[10],
    categoryId: 10,
    target: "group",
    options: [
      { id: "A", text: "Contratar un seguro grupal para las 3 líneas por $12.000 mensuales desde el Fondo Común.", effectDescription: "Blindados grupalmente ante incidentes de robo de celulares." },
      { id: "B", text: "Contratar seguro individual ($5.000 al mes sólo para quien lo decida).", effectDescription: "Cada jugador decide proteger su propio bolsillo." },
      { id: "C", text: "Rechazar. Asumir el 100% del riesgo en la jungla de asfalto.", effectDescription: "Ahorro inicial, pero desprotección absoluta si ocurre el asalto." }
    ]
  },
  // 47. Robo de Celu en el Bondi
  {
    id: "CARD_047",
    title: "¡Manotazo en el Colectivo!",
    text: "Le arrebataron el celular al Estudiante volviendo a la noche. Es un golpe durísimo sin seguro.",
    category: CATEGORIES[10],
    categoryId: 10,
    target: "estudiante",
    options: [
      { id: "A", text: "Hacer reclamo oficial si tenía seguro activo (costo $0, reposición inmediata).", effectDescription: "Si contrataron seguro, costo $0. Si no, esta opción tira error y deben comprarlo." },
      { id: "B", text: "Comprar un celular usado de contado de apuro por $80.000.", effectDescription: "Gasto durísimo. Entra en descubierto si no tiene fondos." },
      { id: "C", text: "Seguir incomunicado: de ahora en más, sus ingresos freelance caen un 50% por desconexión.", effectDescription: "Ahorra hoy, pero estrangula permanentemente sus ingresos." }
    ]
  },
  // 51. Compras Comunitarias Mayoristas
  {
    id: "CARD_051",
    title: "Compras Comunitarias Mayoristas",
    text: "El grupo plantea dejar de comprar al por menor y organizarse para ir al mercado mayorista para congelar gastos de comida.",
    category: CATEGORIES[11],
    categoryId: 11,
    target: "group",
    options: [
      { id: "A", text: "Aportar $60.000 del Fondo Común ($20.000 c/u) para armar una despensa colectiva enorme.", effectDescription: "Los gastos fijos de comida de los 3 bajan un 30% por los próximos 3 meses." },
      { id: "B", text: "Seguir comprando de a un paquete individual en el almacén de conveniencia.", effectDescription: "Sin esfuerzo de planificación grupal, pero pagando precio inflado." },
      { id: "C", text: "Unir fuerzas: poner $45.000 del Fondo Común y que el Estudiante coordine las compras (+10.000 de propina para él).", effectDescription: "Bajan gastos un 20% y se estimula la ayuda mutua del grupo." }
    ]
  },
  // 52. Creación de una Cooperativa de Trabajo
  {
    id: "CARD_052",
    title: "La Cooperativa de Trabajo",
    text: "Los 3 deciden fundar un microemprendimiento los fines de semana uniendo saberes para potenciar ingresos.",
    category: CATEGORIES[11],
    categoryId: 11,
    target: "group",
    options: [
      { id: "A", text: "Invertir un capital inicial de $25.000 cada uno ($75.000 en total al pozo del Fondo Común).", effectDescription: "Desbloquea bono: de acá al final del juego sumas $15.000 individuales mensuales." },
      { id: "B", text: "No involucrarse. Cada uno sigue encerrado en su propia economía de supervivencia.", effectDescription: "Cero riesgo inicial, pero se pierden la mayor sinergia del taller." },
      { id: "C", text: "Formar la coop usando capital del Fondo Común entero ($60.000 devengados) y registrarla legalmente.", effectDescription: "Sumas +200 puntos grupales por formalización cooperativa de inmediato." }
    ]
  },
  // 56. El Descubierto Bancario
  {
    id: "CARD_056",
    title: "El Descubierto Bancario",
    text: "Llegó un gasto imprevisto de salud pesado y tu cuenta individual quedó en números rojos (negativo). El banco aplica tasas diarias.",
    category: CATEGORIES[12],
    categoryId: 12,
    target: "group",
    options: [
      { id: "A", text: "Pedir un rescate parcial al Fondo Común para saldar el rojo de inmediato.", effectDescription: "Tasa 0% solidaria. Anula los intereses buitres del banco." },
      { id: "B", text: "Girar en descubierto de forma prolongada asumiendo el 10% de interes diario.", effectDescription: "Se acumula deuda usurera. El saldo negativo aumentará exponencialmente." },
      { id: "C", text: "Negociar con un compañero un préstamo personal a cambio de tasas blandas (+10 Bienestar grupal).", effectDescription: "Solidaridad vecinal regulada. Sube la fidelidad." }
    ]
  },
  // 61. Recategorización del Monotributo
  {
    id: "CARD_061",
    title: "Recategorización impositiva",
    text: "¡Atención! La AFIP detectó que las ventas del Emprendedor superaron los topes anuales y lo subieron de categoría de Monotributo.",
    category: CATEGORIES[13],
    categoryId: 13,
    target: "emprendedor",
    options: [
      { id: "A", text: "Aceptar e ingresar a la nueva escala (-$12.000 mensuales en tus gastos fijos permanentemente).", effectDescription: "Permanece formal y habilitado para contratos de gran cliente." },
      { id: "B", text: "Intentar subfacturar en negro para evadir la recategorización.", effectDescription: "Evasión fiscal: 50% de probabilidad de multa masiva de $60.000 más adelante." },
      { id: "C", text: "Consultar al Estudiante para deducir costos de insumos utilizando facturas de compras colectivas.", effectDescription: "Si Capacitación general del grupo es > 3, logran mitigar el salto contable a la mitad." }
    ]
  },
  // 66. El 'Telar de la Abundancia'
  {
    id: "CARD_066",
    title: "El Telar o Mandala Ponzi",
    text: "Un conocido te insiste para sumarte a un círculo de confianza. Pones $30.000 de ingreso y en un mes recibes $240.000 al traer amigos.",
    category: CATEGORIES[14],
    categoryId: 14,
    target: "group",
    options: [
      { id: "A", text: "¡Plata dulce! Apostar los $30.000 confiando ciegamente en el mandala de abundancia.", effectDescription: "Estafa Ponzi clásica. El sistema colapsa y pierdes los $30.000 el próximo mes." },
      { id: "B", text: "Rechazar categóricamente y educar al grupo sobre las estafas piramidales.", effectDescription: "No gastan nada. Todos los jugadores ganan +2 en Educación Financiera." },
      { id: "C", text: "Denunciar la cuenta en redes y alertar a los vecinos (+45 puntos grupales y +10 Bienestar).", effectDescription: "Héroe barrial de la ciberseguridad financiera." }
    ]
  },
  // 71. Trabajo Informal
  {
    id: "CARD_071",
    title: "Trabajo Informal ('En Negro')",
    text: "Le proponen al Estudiante un trabajo part-time informal rápido. Pagan bien por hora, pero sin obra social ni cobertura laboral.",
    category: CATEGORIES[15],
    categoryId: 15,
    target: "estudiante",
    options: [
      { id: "A", text: "Aceptar: sus ingresos suben $50.000 fijos por mes, asumiendo riesgos.", effectDescription: "Dinero rápido pero desamparado. Si sale carta de accidente o enfermedad, el costo se triplica." },
      { id: "B", text: "Rechazar y seguir buscando vacantes en blanco del sector formal.", effectDescription: "Maneja sus tiempos, pero conserva saldo bajo. Sigue estudiando." },
      { id: "C", text: "Aceptar y destinar $6.000 de su sueldo a pagar un seguro médico voluntario de cobertura reducida.", effectDescription: "Estrategia moderada: ingresos suben $44.000 protegidos." }
    ]
  },
  // 76. Rotura del Termotanque (Grupal)
  {
    id: "CARD_076",
    title: "Crisis: Se pinchó el termotanque",
    text: "¡Catástrofe doméstica! Se pinchó el termotanque de la casa comunal y sale solo agua helada. Comprar uno nuevo cuesta $120.000.",
    category: CATEGORIES[16],
    categoryId: 16,
    target: "group",
    options: [
      { id: "A", text: "Pagar los $120.000 directo de las reservas líquidas del Fondo Común.", effectDescription: "Arreglado al toque de forma solidaria. Todos a salvo." },
      { id: "B", text: "Poner un fondo especial de $40.000 cada uno de sus billeteras individuales.", effectDescription: "Se financia de forma directa, sin tocar el balance del Fondo Común." },
      { id: "C", text: "No pagar y bañarse con agua helada (-30 de Bienestar generalizado permanentemente).", effectDescription: "Ahorran la plata, pero la salud decae y el próximo mes enferman." }
    ]
  },
  // 81. Corrida Cambiaria / Devaluación
  {
    id: "CARD_081",
    title: "Corrida Cambiaria",
    text: "¡El dólar libre vuela por las nubes! La moneda local perdió un 30% de poder de compra en una corrida financiera violenta.",
    category: CATEGORIES[17],
    categoryId: 17,
    target: "group",
    options: [
      { id: "A", text: "Haberse dolarizado previamente (si compraron dólar MEP o resguardo antes, se salvan).", effectDescription: "De lo contrario, pierden un 25% del saldo en pesos líquido." },
      { id: "B", text: "Ir a comprar provisiones no perecederas de apuro usando $30.000 individuales cada uno.", effectDescription: "Refugiarse en activos físicos de comida. Anulan la pérdida inflacionaria." },
      { id: "C", text: "Pedir al banco la opción de cuenta comitente unificada de emergencia colectiva.", effectDescription: "Suma +45 de estrategia grupal por organizar un escudo anti-devaluación colectivo." }
    ]
  },
  // 86. Renovación del Contrato de Alquiler
  {
    id: "CARD_086",
    title: "Renovación de Contrato",
    text: "Se venció el contrato del inmueble del Emprendedor. El dueño le pide un incremento del 40% permanente para firmar renovación.",
    category: CATEGORIES[18],
    categoryId: 18,
    target: "emprendedor",
    options: [
      { id: "A", text: "Aceptar el aumento: sus gastos fijos individuales suben un 40% permanente.", effectDescription: "Conserva el local estratégico pero reduce drásticamente su rentabilidad." },
      { id: "B", text: "Mudar el taller y fusionar operaciones con la casa del Estudiante compartiendo costos.", effectDescription: "Mudanza colectiva de emergencia: reduce los gastos de ambos un 20% fijos." },
      { id: "C", text: "Mudarse a una incubadora comunitaria subsidiada por el municipio (requiere Capacitación grupo > 3).", effectDescription: "Si tienen el nivel, gastos bajan a $0; si no, quedan desalojados (-50% ingresos)." }
    ]
  },
  // 91. Lanzamiento de la Franquicia
  {
    id: "CARD_091",
    title: "Lanzamiento de Franquicia",
    text: "El negocio colectivo funciona tan bien que una consultora ofrece estructurar una segunda sucursal. Requiere capital fuerte.",
    category: CATEGORIES[19],
    categoryId: 19,
    target: "group",
    options: [
      { id: "A", text: "Juntar $200.000 del Fondo Común para abrir la nueva sucursal ya.", effectDescription: "¡Inversión épica exitosa! Duplican los ingresos de los 3 jugadores el resto del juego." },
      { id: "B", text: "Dejar pasar la expansión comercial prefiriendo mantener los ahorros líquidos del fondo.", effectDescription: "Manejo conservador y cauto de la cooperativa." },
      { id: "C", text: "Buscar financiamiento bancario colectivo: cuotas de $30.000 del Fondo por los próximos 3 meses.", effectDescription: "Expansión apalancada: ingresos suben 50% para todos con costo dosificado." }
    ]
  },
  // 96. El Balance Anual del Banco
  {
    id: "CARD_096",
    title: "Evaluación Crediticia Anual",
    text: "Llegó la auditoría final del banco para evaluar la solvencia de cada billetera individual y grupal.",
    category: CATEGORIES[20],
    categoryId: 20,
    target: "group",
    options: [
      { id: "A", text: "Si mantuvieron saldos positivos y pagaron a término todas las cuotas.", effectDescription: "De ser así, suma +500 puntos de scoring grupal. ¡Trayectoria fiscal excelente!" },
      { id: "B", text: "Pagar una auditoría externa express de $15.000 del Fondo para reacomodar balances.", effectDescription: "Permite maquillar cuentas y zafar de multas técnicas." },
      { id: "C", text: "Declarar quiebra cooperativa controlada para licuar deudas remanentes.", effectDescription: "Suma $30.000 al Fondo pero penaliza la puntuación final de estrategia en -300 puntos." }
    ]
  }
];

export function resolveGroupVoting(votes: Record<string, string | null>, administratorId: string): 'A' | 'B' | 'C' {
  const v1 = votes.player_1;
  const v2 = votes.player_2;
  const v3 = votes.player_3;

  // 1. Contabilizar frecuencias de votos válidos (descartando nulls por tiempo expirado)
  const voteCounts: Record<string, number> = {};
  [v1, v2, v3].forEach(vote => {
    if (vote) {
      voteCounts[vote] = (voteCounts[vote] || 0) + 1;
    }
  });

  // 2. Evaluar Mayoría Absoluta (Mecánica: 2 contra 1 o Unanimidad)
  let maxVotes = 0;
  let winningOption: 'A' | 'B' | 'C' | null = null;
  let hasTie = false;

  for (const option in voteCounts) {
    const opt = option as 'A' | 'B' | 'C';
    if (voteCounts[option] > maxVotes) {
      maxVotes = voteCounts[option];
      winningOption = opt;
      hasTie = false;
    } else if (voteCounts[option] === maxVotes) {
      hasTie = true; // Existe un empate técnico (1 voto cada uno)
    }
  }

  // Caso A: Hay una opción que ganó por mayoría (obtuvo 2 o 3 votos)
  if (winningOption && maxVotes >= 2) {
    return winningOption;
  }

  // Caso B: Desacuerdo total (Empate 1-1-1) o empate por falta de votos debido al tiempo.
  // Se ejecuta la opción que haya elegido el Administrador del Turno de forma obligatoria.
  // Si el administrador no votó, el sistema toma la opción predeterminada de penalización por defecto "C".
  if (hasTie || maxVotes === 1) {
    const adminVote = votes[administratorId];
    return adminVote ? (adminVote as 'A' | 'B' | 'C') : "C"; // "C" actúa como fallback capcioso/malo
  }

  return "C"; // Fallback absoluto en caso de inactividad total del grupo
}

/**
 * Resuelve los impactos económicos de la opción ganadora en los estados de los jugadores y la sala.
 */
export function executeCardResolution(
  card: GameCard,
  optionId: 'A' | 'B' | 'C',
  players: Record<string, PlayerState>,
  room: RoomState
): {
  updatedPlayers: Record<string, PlayerState>;
  updatedRoom: RoomState;
  feedback: string;
} {
  const updatedPlayers = JSON.parse(JSON.stringify(players)) as Record<string, PlayerState>;
  const updatedRoom = JSON.parse(JSON.stringify(room)) as RoomState;
  let feedback = "";

  // Helper values
  const emp = updatedPlayers.player_1;
  const emp_l = updatedPlayers.player_2;
  const est = updatedPlayers.player_3;

  switch (card.id) {
    case "CARD_001": // El Tarifazo
      if (optionId === 'A') {
        updatedRoom.collective_fund -= 45000;
        updatedRoom.points_score += 40;
        feedback = "El Fondo Común absorbió el Tarifazo gastando $45.000. El grupo demostró gran solidaridad y sumó +40 puntos.";
      } else if (optionId === 'B') {
        emp.baseExpense += 15000;
        emp_l.baseExpense += 15000;
        est.baseExpense += 15000;
        updatedRoom.points_score -= 10;
        feedback = "Cada integrante se hace cargo de su boleta: sus gastos fijos individuales aumentan $15.000 permanentemente.";
      } else {
        emp.wellbeing = Math.max(0, emp.wellbeing - 15);
        emp_l.wellbeing = Math.max(0, emp_l.wellbeing - 15);
        est.wellbeing = Math.max(0, est.wellbeing - 15);
        updatedRoom.points_score -= 20;
        feedback = "Se recortó la calefacción y luz drásticamente. El Bienestar de todos cayó 15 puntos por vivir con frío.";
      }
      break;

    case "CARD_002": // Golpe Inflacionario
      if (optionId === 'A') {
        updatedRoom.collective_fund -= 30000;
        emp.balance -= 5000;
        emp_l.balance -= 5000;
        est.balance -= 5000;
        updatedRoom.points_score += 35;
        feedback = "Se usaron $30.000 del Fondo Común para compra mayorista sustentable. Cada uno solo cedió $5.000 de sobra.";
      } else if (optionId === 'B') {
        emp.balance -= 20000;
        emp_l.balance -= 20000;
        est.balance -= 20000;
        feedback = "Ajuste individual seco: cada integrante asumió -$20.000 de costo de vida en su saldo este mes.";
      } else {
        emp.wellbeing = Math.max(0, emp.wellbeing - 30);
        emp_l.wellbeing = Math.max(0, emp_l.wellbeing - 30);
        est.wellbeing = Math.max(0, est.wellbeing - 30);
        updatedRoom.points_score -= 30;
        feedback = "Suprimieron comidas fuera e insumos. Cero gasto monetario, pero el bienestar de todos se desplomó 30 puntos.";
      }
      break;

    case "CARD_003": // Epidemia de Dengue
      if (optionId === 'A') {
        updatedRoom.collective_fund -= 30000;
        updatedRoom.points_score += 25;
        feedback = "Kit de dengue comunitario financiado por el Fondo Común (-$30.000). El grupo está saludable y unido.";
      } else if (optionId === 'B') {
        emp.balance -= 12000;
        emp_l.balance -= 12000;
        est.balance -= 12000;
        feedback = "Kits individuales pagados en efectivo: -$12.000 de saldo para cada jugador.";
      } else {
        // Un jugador al azar se enferma
        const pIds = ['player_1', 'player_2', 'player_3'];
        const infected = pIds[Math.floor(Math.random() * 3)];
        updatedPlayers[infected].isSick = true;
        updatedPlayers[infected].wellbeing = Math.max(0, updatedPlayers[infected].wellbeing - 30);
        feedback = `¡Mala suerte! Por no invertir en repelentes, ${updatedPlayers[infected].name} se contagió de Dengue. Su bienestar cae 30 puntos y el mes próximo cobrará 40% menos ingresos.`;
      }
      break;

    case "CARD_004": // Hackeo en Masa
      if (optionId === 'A') {
        updatedRoom.collective_fund -= 15000;
        updatedRoom.points_score += 50;
        feedback = "Antivirus premium financiado por el Fondo Común ($15.000). Cuentas blindadas y +50 puntos de estrategia.";
      } else if (optionId === 'B') {
        // Encontrar con menor capacitación
        let weakest: PlayerState = emp;
        if (emp_l.capacitacion < weakest.capacitacion) weakest = emp_l;
        if (est.capacitacion < weakest.capacitacion) weakest = est;

        const penalty = Math.floor(weakest.balance * 0.5);
        weakest.balance = Math.max(0, weakest.balance - penalty);
        feedback = `¡El eslabón más débil cayó! ${weakest.name} (menor capacitación) sufrió phishing y perdió el 50% de sus ahorros (-$${penalty.toLocaleString()}).`;
      } else {
        if (est.capacitacion >= 2) {
          est.wellbeing = Math.min(100, est.wellbeing + 15);
          updatedRoom.points_score += 40;
          feedback = "¡Salvados! Gracias a que el Estudiante tiene nivel superior de Capacitación, configuró cortafuegos gratis. Su bienestar sube +15.";
        } else {
          updatedRoom.collective_fund -= 40000;
          feedback = "El Estudiante no tenía capacitación suficiente (mínimo nivel 2). Cayeron en la estafa y perdieron $40.000 del Fondo Común.";
        }
      }
      break;

    case "CARD_005": // Reintegro de IVA
      if (optionId === 'A') {
        updatedRoom.collective_fund += 54000;
        updatedRoom.points_score += 40;
        feedback = "¡Ejemplo cooperativo! Cada jugador donó su reintegro de IVA. El Fondo Común sumó $54.000 colectivos.";
      } else if (optionId === 'B') {
        emp.balance += 18000;
        emp_l.balance += 18000;
        est.balance += 18000;
        feedback = "Cada integrante se guardó sus $18.000 devueltos de IVA en su saldo personal.";
      } else {
        emp.wellbeing = Math.min(100, emp.wellbeing + 20);
        emp_l.wellbeing = Math.min(100, emp_l.wellbeing + 20);
        est.wellbeing = Math.min(100, est.wellbeing + 20);
        updatedRoom.points_score += 60;
        feedback = "Se usó el bono fiscal para adquirir un comedor verde escolar del barrio. Bienestar generalizado +20 y +60 puntos de grupo.";
      }
      break;

    case "CARD_006": // Herramienta Rota (Emprendedor)
      if (optionId === 'A') {
        emp.balance -= 60000;
        emp.wellbeing = Math.max(0, emp.wellbeing - 5);
        feedback = "El Emprendedor pagó $60.000 de su bolsillo para reparar su pc. Su negocio sigue en marcha sin alterar su productividad.";
      } else if (optionId === 'B') {
        emp.baseIncome = Math.floor(emp.baseIncome * 0.6);
        feedback = "El Emprendedor decidió no reparar la máquina. Sus ingresos mensuales base disminuyen un 40% permanente de acá en adelante.";
      } else {
        updatedRoom.collective_fund -= 35000;
        emp.balance -= 25000;
        feedback = "¡Solidaridad! Cofinanciaron la reparación: $35.000 del Fondo Común y $25.000 del Emprendedor. Conserva sus ingresos.";
      }
      break;

    case "CARD_007": // El Gran Cliente (Emprendedor)
      if (optionId === 'A') {
        emp.balance -= 30000;
        emp.baseIncome = Math.floor(emp.baseIncome * 1.30);
        updatedRoom.points_score += 50;
        feedback = "El Emprendedor pagó $30.000 para regularizarse. ¡Logró cerrar el contrato y aumentó sus ingresos un 30% permanentes!";
      } else if (optionId === 'B') {
        emp.wellbeing = Math.max(0, emp.wellbeing - 10);
        feedback = "Dejó pasar la oportunidad para evadir impuestos. El negocio se estanca y el Emprendedor se desmotiva (-10 Bienestar).";
      } else {
        emp_l.balance -= 15000;
        emp.baseIncome = Math.floor(emp.baseIncome * 1.15);
        emp_l.baseIncome = Math.floor(emp_l.baseIncome * 1.15);
        updatedRoom.points_score += 45;
        feedback = "Asociación del taller: El Empleado puso $15.000 y se asoció al contrato. Ambos aumentaron sus ingresos base un 15% permanente.";
      }
      break;

    case "CARD_011": // Paritarias (Empleado)
      if (optionId === 'A') {
        emp_l.baseIncome = Math.floor(emp_l.baseIncome * 1.15);
        feedback = "El Empleado firmó el aumento del 15% permanente y aseguró estabilidad financiera.";
      } else if (optionId === 'B') {
        emp_l.balance -= 10000;
        if (Math.random() > 0.5) {
          emp_l.baseIncome = Math.floor(emp_l.baseIncome * 1.25);
          feedback = "¡Huelga victoriosa! Tras gastar $10.000 en movilidad de asamblea, la empresa cedió un 25% de aumento permanente.";
        } else {
          feedback = "Huelga fallida. Gastó $10.000 en el reclamo pero la escala se mantuvo igual. Solo cansancio.";
        }
      } else {
        emp_l.baseIncome = Math.floor(emp_l.baseIncome * 1.10);
        updatedRoom.points_score += 50;
        feedback = "Inversión ética. Aceptó un 10% permanente y dona regularmente una porción al Fondo, sumando +50 puntos colectivos.";
      }
      break;

    case "CARD_012": // Changita (Empleado)
      if (optionId === 'A') {
        emp_l.balance += 40000;
        emp_l.wellbeing = Math.max(0, emp_l.wellbeing - 25);
        feedback = "El Empleado realizó la changa agotadora. Sumó $40.000 a su saldo, pero su bienestar cayó 25 puntos.";
      } else if (optionId === 'B') {
        emp_l.wellbeing = Math.min(100, emp_l.wellbeing + 15);
        feedback = "Descansó el fin de semana. No ganó ingresos, pero su Bienestar aumentó +15 puntos.";
      } else {
        emp_l.balance += 20000;
        est.balance += 20000;
        updatedRoom.points_score += 40;
        feedback = "¡Sinergia de equipo! El Empleado delegó parte del análisis de datos al Estudiante. Se repartieron $20.000 para cada uno sin perder salud.";
      }
      break;

    case "CARD_016": // Educación (Estudiante)
      if (optionId === 'A') {
        est.balance -= 40000;
        est.capacitacion += 2;
        feedback = "El Estudiante pagó $40.000 e impulsó su Capacitación. En el mes 6 sus ingresos base aumentarán un 50% permanente.";
      } else if (optionId === 'B') {
        feedback = "Se canceló la matriculación por falta de fondos. Potencial desperdiciado.";
      } else {
        updatedRoom.collective_fund -= 40000;
        est.capacitacion += 2;
        updatedRoom.points_score += 100;
        feedback = "¡Inversión social! El Fondo Común financió la carrera del Estudiante. Gana +2 de Capacitación y el grupo sumó +100 puntos por desarrollo técnico.";
      }
      break;

    case "CARD_017": // Computadora Lenta (Estudiante)
      if (optionId === 'A') {
        est.balance -= 20000;
        est.wellbeing = Math.min(100, est.wellbeing + 10);
        feedback = "El Estudiante compró el disco SSD por $20.000. Sus equipos vuelan y aumenta su Bienestar.";
      } else if (optionId === 'B') {
        const drop = Math.floor(est.baseIncome * 0.25);
        est.balance = Math.max(0, est.balance - drop);
        feedback = `No invirtió. Sus ingresos freelance de este mes sufrieron un recorte automático de -$${drop.toLocaleString()} por baja productividad.`;
      } else {
        est.wellbeing = Math.max(0, est.wellbeing - 10);
        feedback = "El Empleado le prestó una laptop de repuesto de onda. Ahorró la plata, pero trabaja un poco incómodo (-10 Bienestar).";
      }
      break;

    case "CARD_021": // El festival del año
      if (optionId === 'A') {
        emp.balance = Math.max(0, emp.balance - 60000);
        emp.wellbeing = Math.min(100, emp.wellbeing + 40);
        emp_l.balance = Math.max(0, emp_l.balance - 60000);
        emp_l.wellbeing = Math.min(100, emp_l.wellbeing + 40);
        est.balance = Math.max(0, est.balance - 60000);
        est.wellbeing = Math.min(100, est.wellbeing + 40);
        feedback = "Compraron las entradas del festival por $60.000 cada uno. Su bienestar escaló al máximo, pero quedaron sin liquidez.";
      } else if (optionId === 'B') {
        emp.wellbeing = Math.max(0, emp.wellbeing - 30);
        emp_l.wellbeing = Math.max(0, emp_l.wellbeing - 30);
        est.wellbeing = Math.max(0, est.wellbeing - 30);
        feedback = "Decidieron no ir por austeridad. El 'FOMO' y desánimo les baja 30 puntos de bienestar general.";
      } else {
        emp.balance -= 10000;
        emp.wellbeing = Math.min(100, emp.wellbeing + 20);
        emp_l.balance -= 10000;
        emp_l.wellbeing = Math.min(100, emp_l.wellbeing + 20);
        est.balance -= 10000;
        est.wellbeing = Math.min(100, est.wellbeing + 20);
        updatedRoom.points_score += 45;
        feedback = "Excelente compromiso: organizaron pizza y música cooperativa en el patio gastando solo $10.000 c/u. Bienestar +20 y +45 puntos de grupo.";
      }
      break;

    case "CARD_022": // Zapatillas Falso Descuento
      if (optionId === 'A') {
        emp.balance -= 45000; emp.wellbeing = Math.min(100, emp.wellbeing + 15);
        emp_l.balance -= 45000; emp_l.wellbeing = Math.min(100, emp_l.wellbeing + 15);
        est.balance -= 45000; est.wellbeing = Math.min(100, est.wellbeing + 15);
        feedback = "Cayeron en la tentación comercial de las zapatillas de descuento de apuro. Cada uno gastó $45.000.";
      } else if (optionId === 'B') {
        emp.capacitacion += 1;
        emp_l.capacitacion += 1;
        est.capacitacion += 1;
        feedback = "Ejercieron el autocontrol e ignoraron la vidriera. Ganan +1 de Educación Financiera para cada uno.";
      } else {
        updatedRoom.collective_fund += 67500; // 22.500 * 3
        emp.balance -= 22500;
        emp_l.balance -= 22500;
        est.balance -= 22500;
        updatedRoom.points_score += 50;
        feedback = "Inteligencia colectiva: destinaron $22.500 cada uno a fundar una caja comunitaria blindada (+50 puntos de grupo).";
      }
      break;

    case "CARD_026": // Tarjeta Explotada (Empleado)
      if (optionId === 'A') {
        emp_l.balance = 0;
        feedback = "El Empleado liquidó su tarjeta al 100% vaciando su billetera. Sin deudas pero exhausto.";
      } else if (optionId === 'B') {
        emp_l.balance -= 15000;
        emp_l.loanDebt += 42500; // Resto + 70% interes estimativo
        feedback = "Pagó el mínimo de $15.000. El saldo refinanciado del 70% de tarjeta se cobrará con interés el mes que viene.";
      } else {
        updatedRoom.collective_fund -= 40000;
        emp_l.balance += 40000;
        updatedRoom.points_score += 35;
        feedback = "Saneamiento solidario: el Fondo Común le cubrió la tarjeta al Empleado sin penalidad para ser devuelto en cuotas sugeridas.";
      }
      break;

    case "CARD_031": // Fiebre Cripto
      if (optionId === 'A') {
        // Simular timba
        const won = Math.random() < 0.22;
        const playersList = [emp, emp_l, est];
        playersList.forEach(p => {
          const invested = Math.min(p.balance, 40000);
          p.balance -= invested;
          if (won) {
            p.balance += invested * 3;
          } else {
            p.balance += Math.floor(invested * 0.1); // Pierde 90%
          }
        });
        feedback = won 
          ? "¡Increíble! Entraron en el 20% de suerte y triplicaron lo invertido en criptomonedas."
          : "El esquema colapsó tal como se preveía: el grupo perdió el 90% de la inversión criptográfica.";
      } else if (optionId === 'B') {
        emp.capacitacion += 1;
        emp_l.capacitacion += 1;
        est.capacitacion += 1;
        feedback = "Autocontrol grupal inteligente. Evitaron la estafa de Instagram y ganaron +1 de Capacitación de análisis bursátil.";
      } else {
        emp.balance -= 10000;
        emp_l.balance -= 10000;
        est.balance -= 10000;
        // Cuenta remunerada colectiva con rendimiento pasivo
        updatedRoom.points_score += 40;
        feedback = "Colocaron $10.000 prudenciales en rendimientos en pesos del 4% mensual. Sumaron +40 puntos de gestión.";
      }
      break;

    case "CARD_036": // Multa Tránsito (Emprendedor)
      if (optionId === 'A') {
        emp.balance -= 20000;
        feedback = "El Emprendedor pagó la multa de $20.000 aprovechando el beneficio del descargo voluntario rápido.";
      } else if (optionId === 'B') {
        if (Math.random() > 0.5) {
          feedback = "¡Ganaron la apelación! El descargo fue aprobado gratis gracias al sistema de defensas.";
        } else {
          emp.balance -= 50000;
          feedback = "Apelación denegada al final. Al demorar el trámite, el sistema le cobró la tasa máxima de penalidad de $50.000.";
        }
      } else {
        if (est.capacitacion >= 2) {
          updatedRoom.points_score += 40;
          feedback = "¡Anulado con éxito! El Estudiante tiene Capacitación nivel experto redactando una fundamentación legal perfecta. Multa anulada.";
        } else {
          emp.balance -= 20000;
          feedback = "El Estudiante no tenía capacitación suficiente (mínimo nivel 2). Se tuvo que abonar el pago de $20.000 de urgencia.";
        }
      }
      break;

    case "CARD_041": // Reparación Creativa (Estudiante)
      if (optionId === 'A') {
        est.balance -= 50000;
        est.wellbeing = Math.min(100, est.wellbeing + 10);
        feedback = "El Estudiante compró unas zapatillas nuevas de shopping por $50.000. Muy cómodas pero drenaron su cuenta.";
      } else if (optionId === 'B') {
        est.balance -= 12000;
        est.capacitacion += 1;
        feedback = "Llevó las zapatillas al zapatero local del barrio. Gastó solo $12.000 y obtuvo +1 de Educación Financiera.";
      } else {
        est.wellbeing = Math.min(100, est.wellbeing + 15);
        feedback = "Reparación casera DIY hecha a mano con hilos y pegamento. Gasto de $0 y sube +15 bienestar por el orgullo del remiendo.";
      }
      break;

    case "CARD_046": // Seguro de Celular
      if (optionId === 'A') {
        updatedRoom.collective_fund -= 12000;
        emp.hasCeluSeguro = true;
        emp_l.hasCeluSeguro = true;
        est.hasCeluSeguro = true;
        updatedRoom.points_score += 30;
        feedback = "Contrataron el seguro mensual corporativo de celulares de $12.000 del Fondo. Las 3 líneas están blindadas.";
      } else if (optionId === 'B') {
        emp.balance -= 5000;
        emp_l.balance -= 5000;
        est.balance -= 5000;
        emp.hasCeluSeguro = true;
        emp_l.hasCeluSeguro = true;
        est.hasCeluSeguro = true;
        feedback = "Seguro pagado de forma individual: -$5.000 de saldo para cada uno.";
      } else {
        emp.hasCeluSeguro = false;
        emp_l.hasCeluSeguro = false;
        est.hasCeluSeguro = false;
        feedback = "Rechazaron el seguro preventivo de celulares. Asumen todo el riesgo de que les roben el equipo.";
      }
      break;

    case "CARD_047": // Robo Celu Estudiante
      if (est.hasCeluSeguro) {
        est.wellbeing = Math.min(100, est.wellbeing + 5);
        feedback = "¡Zafó! El Estudiante tenía contratado el seguro. Le repusieron el celular nuevo por costo $0.";
      } else {
        if (optionId === 'A') {
          feedback = "Error: no tenías seguro de telefonía previamente contratado. Tuviste que comprar uno usado.";
          est.balance -= 80000;
        } else if (optionId === 'B') {
          est.balance -= 80000;
          feedback = "El Estudiante tuvo que desembolsar $80.000 de contado para conseguir un teléfono usado para poder seguir rindiendo.";
        } else {
          est.baseIncome = Math.floor(est.baseIncome * 0.5);
          feedback = "Siguió incomunicado por no tener dinero para reponer el celular. Sus ingresos base freelance de ahora en adelante caen un 50% por desconexión.";
        }
      }
      break;

    case "CARD_051": // Compras Comunitarias Mayoristas
      if (optionId === 'A') {
        updatedRoom.collective_fund -= 60000;
        emp.baseExpense = Math.max(5000, emp.baseExpense - 8000);
        emp_l.baseExpense = Math.max(5000, emp_l.baseExpense - 8000);
        est.baseExpense = Math.max(5000, est.baseExpense - 8000);
        updatedRoom.points_score += 45;
        feedback = "Compra mayorista masiva unificada financiada por el Fondo. Los gastos fijos disminuyeron un 30% permanente por la economía de escala.";
      } else if (optionId === 'B') {
        feedback = "Siguieron comprando minorista de forma separada en el comercio rápido de la esquina. Ningún cambio de gastos.";
      } else {
        updatedRoom.collective_fund -= 45000;
        est.balance += 10000;
        emp.baseExpense = Math.max(5000, emp.baseExpense - 6000);
        emp_l.baseExpense = Math.max(5000, emp_l.baseExpense - 6000);
        est.baseExpense = Math.max(5000, est.baseExpense - 6000);
        updatedRoom.points_score += 55;
        feedback = "Sinergia: Compras mayoristas administradas por el Estudiante, quien recibió $10.000 de propina. Gastos reducidos un 20% para todos.";
      }
      break;

    case "CARD_052": // Creación Cooperativa Trabajo
      if (optionId === 'A') {
        emp.balance -= 25000;
        emp_l.balance -= 25000;
        est.balance -= 25000;
        emp.baseIncome += 15000;
        emp_l.baseIncome += 15000;
        est.baseIncome += 15000;
        updatedRoom.points_score += 80;
        feedback = "¡Espectacular! Invirtieron $25.000 c/u en lanzar el proyecto cooperativo conjunto. Sus ingresos estables suben $15.000 mensuales fijos permanentemente.";
      } else if (optionId === 'B') {
        feedback = "No formaron la cooperativa. Mantienen la subsistencia y el esfuerzo fragmentado individual.";
      } else {
        updatedRoom.collective_fund -= 60000;
        updatedRoom.points_score += 200;
        feedback = "Registraron la cooperativa legalmente usando $60.000 del Fondo Común enteramente. El grupo sumó +200 puntos por institucionalización cooperativa.";
      }
      break;

    case "CARD_056": // Descubierto Bancario
      if (optionId === 'A') {
        updatedRoom.collective_fund -= 20000;
        // Asume un rojo generalizado resuelto
        if (emp.balance < 0) emp.balance = 0;
        if (emp_l.balance < 0) emp_l.balance = 0;
        if (est.balance < 0) est.balance = 0;
        updatedRoom.points_score += 35;
        feedback = "El Fondo Común auxilió al compañero en negativo saldando de inmediato la cuenta a tasa 0%. ¡Estrategia cooperativa!";
      } else if (optionId === 'B') {
        // Cobrar penalidad
        const targets = [emp, emp_l, est];
        targets.forEach(t => {
          if (t.balance < 0) {
            t.balance = Math.floor(t.balance * 1.5); // Interes fuerte
          }
        });
        feedback = "Asumieron tasas usureras bancarias del 10% diario. La deuda bancaria del que estaba en negativo aumentó un 50% este mes.";
      } else {
        emp.wellbeing = Math.min(100, emp.wellbeing + 10);
        emp_l.wellbeing = Math.min(100, emp_l.wellbeing + 10);
        est.wellbeing = Math.min(100, est.wellbeing + 10);
        feedback = "Préstamo blando vecinal acordado en la asamblea de barrio. Se canceló la usura y aumentó un 10 el Bienestar grupal.";
      }
      break;

    case "CARD_061": // Recategorización Monotributo (Emprendedor)
      if (optionId === 'A') {
        emp.baseExpense += 12000;
        feedback = "El Emprendedor aceptó el salto de escala legal. Sus gastos fijos aumentaron $12.000 estables pero permanece en regla.";
      } else if (optionId === 'B') {
        if (Math.random() > 0.5) {
          emp.balance -= 60000;
          feedback = "La AFIP detectó la evasión impositiva mediante auditoría de billeteras digitales. Aplicaron multa seca de $60.000.";
        } else {
          feedback = "Logró subfacturar temporalmente sin ser atrapado por la contabilidad provincial.";
        }
      } else {
        const totalCap = emp.capacitacion + emp_l.capacitacion + est.capacitacion;
        if (totalCap > 3) {
          emp.baseExpense += 6000;
          feedback = "Ingeniería contable grupal exitosa: dedujeron costos de materias primas mayoristas y mitigaron el brinco fiscal a la mitad ($6.000 fijos).";
        } else {
          emp.baseExpense += 12000;
          feedback = "El grupo no tiene suficiente capacitación contable (>3 puntos). Tuvieron que computar la tasa general completa de $12.000.";
        }
      }
      break;

    case "CARD_066": // Telar Ponzi
      if (optionId === 'A') {
        emp.balance -= 30000;
        emp_l.balance -= 30000;
        est.balance -= 30000;
        feedback = "Cayeron en el fraude piramidal 'Mágico del WhatsApp'. El sistema colapsó este mes y cada uno perdió $30.000.";
      } else if (optionId === 'B') {
        emp.capacitacion += 2;
        emp_l.capacitacion += 2;
        est.capacitacion += 2;
        updatedRoom.points_score += 60;
        feedback = "Educación de acero: rechazaron la timba mágica y ganaron +2 en Capacitación Financiera en cada planilla.";
      } else {
        updatedRoom.points_score += 45;
        emp.wellbeing = Math.min(100, emp.wellbeing + 10);
        emp_l.wellbeing = Math.min(100, emp_l.wellbeing + 10);
        est.wellbeing = Math.min(100, est.wellbeing + 10);
        feedback = "Denunciaron la red fraudulenta en los canales vecinales de alerta. Ganaron reputación barrial (+45 puntos) y bienestar.";
      }
      break;

    case "CARD_071": // Trabajo Informal (Estudiante)
      if (optionId === 'A') {
        est.baseIncome += 50000;
        feedback = "El Estudiante aceptó el trabajo informal part-time. Ingresos mensuales suben $50.000 pero corre riesgo de accidente desprotegido.";
      } else if (optionId === 'B') {
        feedback = "Inversión en tiempo: prefirió enfocarse en la universidad y buscar vacantes formales. Saldo conservador.";
      } else {
        est.baseIncome += 44000;
        feedback = "Opción inteligente: aceptó e ingresó cobertura médica de urgencia deduciendo $6.000. Ingreso sube $44.000 protegidos.";
      }
      break;

    case "CARD_076": // Rotura Termotanque (Grupal)
      if (optionId === 'A') {
        updatedRoom.collective_fund -= 120000;
        feedback = "El Fondo Común financió el cambio total del termotanque de inmediato por $120.000. Baños calentitos para todos.";
      } else if (optionId === 'B') {
        emp.balance -= 40000;
        emp_l.balance -= 40000;
        est.balance -= 40000;
        feedback = "Financiamiento individual coordinado: cada jugador aportó $40.000 de su bolsillo, cuidando las reservas del Fondo Común.";
      } else {
        emp.wellbeing = Math.max(0, emp.wellbeing - 30);
        emp_l.wellbeing = Math.max(0, emp_l.wellbeing - 30);
        est.wellbeing = Math.max(0, est.wellbeing - 30);
        feedback = "Decidieron ahorrar. El grupo se baña con agua helada (-30 Bienestar). El próximo mes sufrirán enfermedades.";
      }
      break;

    case "CARD_081": // Devaluación Cambiaria
      if (optionId === 'A') {
        feedback = "¡Blindados! Al poseer carteras indexadas o de ahorro físico previos, neutralizaron la pérdida de valor peso.";
      } else if (optionId === 'B') {
        emp.balance -= 30000;
        emp_l.balance -= 30000;
        est.balance -= 30000;
        feedback = "Compra de provisiones físicas de apuro: amortiguaron la inflación comprando latas y harinas.";
      } else {
        updatedRoom.points_score += 45;
        feedback = "Unificaron la cartera comitente grupal con custodia bancaria. Sumaron +45 de estrategia colectiva.";
      }
      break;

    case "CARD_086": // Renovación Alquiler Emprendedor
      if (optionId === 'A') {
        emp.baseExpense += 25000;
        feedback = "Aceptó el incremento. Sus costos fijos mensuales del local de ventas aumentaron $25.000 permanente.";
      } else if (optionId === 'B') {
        emp.baseExpense = Math.max(5000, emp.baseExpense - 12000);
        est.baseExpense = Math.max(5000, est.baseExpense - 10000);
        updatedRoom.points_score += 50;
        feedback = "¡Mudanza vecinal! Fusionaron operaciones en la cochera del Estudiante: bajan costos fijos de ambos masivamente.";
      } else {
        const totalCap = emp.capacitacion + emp_l.capacitacion + est.capacitacion;
        if (totalCap > 3) {
          emp.baseExpense = 0;
          updatedRoom.points_score += 85;
          feedback = "Aprobados en incubadora comercial gracias a su capacitación grupal. Alquiler del taller $0 subsidiado por el municipio.";
        } else {
          emp.baseIncome = Math.floor(emp.baseIncome * 0.5);
          feedback = "Desalojo relámpago por falta de antecedentes rentables del grupo. Ingresos del Emprendedor caen 50% por falta de espacio de trabajo.";
        }
      }
      break;

    case "CARD_091": // Lanzamiento de la Franquicia
      if (optionId === 'A') {
        updatedRoom.collective_fund -= 200000;
        emp.baseIncome = Math.floor(emp.baseIncome * 2.0);
        emp_l.baseIncome = Math.floor(emp_l.baseIncome * 2.0);
        est.baseIncome = Math.floor(est.baseIncome * 2.0);
        updatedRoom.points_score += 250;
        feedback = "¡EXPANSIÓN ÉPICA! Cofinanciaron la franquicia nacional con $200.000 del Fondo. ¡Ingresos estables duplicados para todos!";
      } else if (optionId === 'B') {
        feedback = "Mantuvieron reservas del Fondo intactas y líquidas. Expansión cancelada por prudencia empresarial.";
      } else {
        updatedRoom.collective_fund -= 30000;
        emp.baseIncome = Math.floor(emp.baseIncome * 1.5);
        emp_l.baseIncome = Math.floor(emp_l.baseIncome * 1.5);
        est.baseIncome = Math.floor(est.baseIncome * 1.5);
        feedback = "Crecimiento dosificado: financiado en 3 cuotas bancarias. Ingresos aumentan 50% mitigando el drenaje de fondos de golpe.";
      }
      break;

    case "CARD_096": // Cierre Crediticio Anual
      if (optionId === 'A') {
        updatedRoom.points_score += 500;
        feedback = "¡Impecable comportamiento crediticio! El banco otorgó un bono corporativo de scoring fiscal de +500 puntos de reputación.";
      } else if (optionId === 'B') {
        updatedRoom.collective_fund -= 15000;
        updatedRoom.points_score += 150;
        feedback = "Pagar auditoría exprés: acomodan balances legales y zafan de cualquier contingencia impositiva.";
      } else {
        updatedRoom.collective_fund += 30000;
        updatedRoom.points_score -= 300;
        feedback = "Se declaró quiebra técnica para licuar deudas de crédito. Ingresan $30.000 de liquidez de cierre pero caen -300 de scoring grupal.";
      }
      break;

    default:
      feedback = "La opción seleccionada ha sido resuelta con éxito.";
      break;
  }

  // Monthly health penalties post-effect processing
  // At any turn resolution, check if any player is sick
  Object.keys(updatedPlayers).forEach(pId => {
    const pl = updatedPlayers[pId];
    if (pl.wellbeing < 30) {
      if (!pl.isSick) {
        pl.isSick = true;
        feedback += `\n🚨 [ATENCIÓN] ${pl.name} se ha enfermado debido a que su Bienestar cayó por debajo del 30%. Recibirá penalización de ingresos.`;
      }
    } else {
      pl.isSick = false;
    }
  });

  return { updatedPlayers, updatedRoom, feedback };
}
