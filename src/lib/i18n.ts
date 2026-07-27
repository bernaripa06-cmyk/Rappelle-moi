import { ReminderCategory } from "../types/reminder";

export type Messages = {
  greeting: string;
  nothingUrgent: string;
  question: string;
  listening: string;
  example: string;
  placeholder: string;
  add: string;
  reminders: string;
  active: string;
  empty: string;
  noDate: string;
  microphoneUnavailable: string;
  allowMicrophone: string;
  notUnderstood: string;
  tryAgain: string;
  categories: Record<ReminderCategory, string>;
};

const en: Messages = {
  greeting: "Hello!",
  nothingUrgent: "Nothing urgent today.",
  question: "What should I remember?",
  listening: "I’m listening…",
  example: "“Tomorrow at 2 pm, call Stefano”",
  placeholder: "Or type your reminder…",
  add: "Add",
  reminders: "My reminders",
  active: "active",
  empty: "Your first reminder will appear here.",
  noDate: "No date",
  microphoneUnavailable: "Microphone unavailable",
  allowMicrophone: "Allow microphone access in your phone settings.",
  notUnderstood: "I didn’t understand",
  tryAgain: "Please try again and speak clearly.",
  categories: {
    call: "CALL",
    task: "TO DO",
    birthday: "BIRTHDAY",
    shopping: "SHOPPING",
    note: "NOTE"
  }
};

const translations: Record<string, Partial<Messages>> = {
  fr: {
    greeting: "Bonjour !",
    nothingUrgent: "Rien d’urgent aujourd’hui.",
    question: "Qu’est-ce que je dois retenir ?",
    listening: "Je t’écoute…",
    example: "« Demain à 14 h, appeler Stefano »",
    placeholder: "Ou écris ton rappel…",
    add: "Ajouter",
    reminders: "Mes rappels",
    active: "actifs",
    empty: "Ton premier rappel apparaîtra ici.",
    noDate: "Sans date",
    microphoneUnavailable: "Micro indisponible",
    allowMicrophone: "Autorise le micro dans les réglages du téléphone.",
    notUnderstood: "Je n’ai pas compris",
    tryAgain: "Réessaie en parlant distinctement.",
    categories: { call: "APPEL", task: "À FAIRE", birthday: "ANNIVERSAIRE", shopping: "COURSES", note: "NOTE" }
  },
  de: {
    greeting: "Hallo!",
    nothingUrgent: "Heute nichts Dringendes.",
    question: "Woran soll ich dich erinnern?",
    listening: "Ich höre zu…",
    example: "„Morgen um 14 Uhr Stefano anrufen“",
    placeholder: "Oder Erinnerung eingeben…",
    add: "Hinzufügen",
    reminders: "Meine Erinnerungen",
    active: "aktiv",
    empty: "Deine erste Erinnerung erscheint hier.",
    noDate: "Ohne Datum",
    categories: { call: "ANRUF", task: "AUFGABE", birthday: "GEBURTSTAG", shopping: "EINKAUF", note: "NOTIZ" }
  },
  th: {
    greeting: "สวัสดี!",
    nothingUrgent: "วันนี้ไม่มีเรื่องเร่งด่วน",
    question: "ต้องจำอะไรบ้าง?",
    listening: "กำลังฟัง…",
    example: "“พรุ่งนี้ 14:00 โทรหาสเตฟาโน”",
    placeholder: "หรือพิมพ์การเตือน…",
    add: "เพิ่ม",
    reminders: "การเตือนของฉัน",
    active: "รายการ",
    empty: "การเตือนแรกของคุณจะแสดงที่นี่",
    noDate: "ไม่มีวันที่",
    categories: { call: "โทร", task: "สิ่งที่ต้องทำ", birthday: "วันเกิด", shopping: "ซื้อของ", note: "บันทึก" }
  },
  es: {
    greeting: "¡Hola!",
    nothingUrgent: "Nada urgente hoy.",
    question: "¿Qué debo recordar?",
    listening: "Te escucho…",
    example: "«Mañana a las 14:00, llamar a Stefano»",
    placeholder: "O escribe tu recordatorio…",
    add: "Añadir",
    reminders: "Mis recordatorios",
    active: "activos",
    empty: "Tu primer recordatorio aparecerá aquí.",
    noDate: "Sin fecha",
    categories: { call: "LLAMADA", task: "TAREA", birthday: "CUMPLEAÑOS", shopping: "COMPRAS", note: "NOTA" }
  },
  it: {
    greeting: "Ciao!",
    nothingUrgent: "Niente di urgente oggi.",
    question: "Cosa devo ricordare?",
    listening: "Ti ascolto…",
    example: "«Domani alle 14, chiamare Stefano»",
    placeholder: "Oppure scrivi il promemoria…",
    add: "Aggiungi",
    reminders: "I miei promemoria",
    active: "attivi",
    empty: "Il tuo primo promemoria apparirà qui.",
    noDate: "Senza data",
    categories: { call: "CHIAMATA", task: "DA FARE", birthday: "COMPLEANNO", shopping: "ACQUISTI", note: "NOTA" }
  },
  pt: {
    greeting: "Olá!",
    nothingUrgent: "Nada urgente hoje.",
    question: "O que devo lembrar?",
    listening: "Estou ouvindo…",
    example: "“Amanhã às 14h, ligar para Stefano”",
    placeholder: "Ou escreva seu lembrete…",
    add: "Adicionar",
    reminders: "Meus lembretes",
    active: "ativos",
    empty: "Seu primeiro lembrete aparecerá aqui.",
    noDate: "Sem data",
    categories: { call: "LIGAÇÃO", task: "TAREFA", birthday: "ANIVERSÁRIO", shopping: "COMPRAS", note: "NOTA" }
  },
  ru: {
    greeting: "Здравствуйте!",
    nothingUrgent: "Сегодня ничего срочного.",
    question: "Что нужно запомнить?",
    listening: "Слушаю…",
    example: "«Завтра в 14:00 позвонить Стефано»",
    placeholder: "Или напишите напоминание…",
    add: "Добавить",
    reminders: "Мои напоминания",
    active: "активных",
    empty: "Первое напоминание появится здесь.",
    noDate: "Без даты",
    categories: { call: "ЗВОНОК", task: "ЗАДАЧА", birthday: "ДЕНЬ РОЖДЕНИЯ", shopping: "ПОКУПКИ", note: "ЗАМЕТКА" }
  },
  ar: {
    greeting: "مرحباً!",
    nothingUrgent: "لا شيء عاجل اليوم.",
    question: "ماذا يجب أن أتذكر؟",
    listening: "أنا أستمع…",
    example: "«غداً الساعة 14 اتصل بستيفانو»",
    placeholder: "أو اكتب التذكير…",
    add: "إضافة",
    reminders: "تذكيراتي",
    active: "نشط",
    empty: "سيظهر أول تذكير هنا.",
    noDate: "بدون تاريخ",
    categories: { call: "اتصال", task: "مهمة", birthday: "عيد ميلاد", shopping: "تسوق", note: "ملاحظة" }
  },
  zh: {
    greeting: "你好！",
    nothingUrgent: "今天没有紧急事项。",
    question: "我要记住什么？",
    listening: "我在听…",
    example: "“明天下午2点给斯特凡诺打电话”",
    placeholder: "或输入提醒…",
    add: "添加",
    reminders: "我的提醒",
    active: "条",
    empty: "你的第一条提醒会显示在这里。",
    noDate: "无日期",
    categories: { call: "电话", task: "待办", birthday: "生日", shopping: "购物", note: "备注" }
  },
  ja: {
    greeting: "こんにちは！",
    nothingUrgent: "今日は急ぎの予定はありません。",
    question: "何を覚えておきますか？",
    listening: "聞いています…",
    example: "「明日の14時にステファノへ電話」",
    placeholder: "またはリマインダーを入力…",
    add: "追加",
    reminders: "リマインダー",
    active: "件",
    empty: "最初のリマインダーがここに表示されます。",
    noDate: "日付なし",
    categories: { call: "電話", task: "タスク", birthday: "誕生日", shopping: "買い物", note: "メモ" }
  },
  ko: {
    greeting: "안녕하세요!",
    nothingUrgent: "오늘은 급한 일이 없습니다.",
    question: "무엇을 기억할까요?",
    listening: "듣고 있어요…",
    example: "“내일 오후 2시에 스테파노에게 전화”",
    placeholder: "또는 알림 입력…",
    add: "추가",
    reminders: "내 알림",
    active: "개",
    empty: "첫 번째 알림이 여기에 표시됩니다.",
    noDate: "날짜 없음",
    categories: { call: "전화", task: "할 일", birthday: "생일", shopping: "쇼핑", note: "메모" }
  },
  hi: {
    greeting: "नमस्ते!",
    nothingUrgent: "आज कुछ जरूरी नहीं है।",
    question: "क्या याद रखना है?",
    listening: "मैं सुन रहा हूँ…",
    example: "“कल दोपहर 2 बजे स्टेफानो को फ़ोन करना”",
    placeholder: "या रिमाइंडर लिखें…",
    add: "जोड़ें",
    reminders: "मेरे रिमाइंडर",
    active: "सक्रिय",
    empty: "आपका पहला रिमाइंडर यहाँ दिखाई देगा।",
    noDate: "बिना तारीख",
    categories: { call: "फ़ोन", task: "कार्य", birthday: "जन्मदिन", shopping: "खरीदारी", note: "नोट" }
  },
  vi: {
    greeting: "Xin chào!",
    nothingUrgent: "Hôm nay không có gì khẩn cấp.",
    question: "Tôi cần nhớ điều gì?",
    listening: "Tôi đang nghe…",
    example: "“Ngày mai lúc 14 giờ, gọi Stefano”",
    placeholder: "Hoặc nhập lời nhắc…",
    add: "Thêm",
    reminders: "Lời nhắc của tôi",
    active: "đang hoạt động",
    empty: "Lời nhắc đầu tiên sẽ xuất hiện ở đây.",
    noDate: "Không có ngày",
    categories: { call: "CUỘC GỌI", task: "VIỆC CẦN LÀM", birthday: "SINH NHẬT", shopping: "MUA SẮM", note: "GHI CHÚ" }
  },
  id: {
    greeting: "Halo!",
    nothingUrgent: "Tidak ada yang mendesak hari ini.",
    question: "Apa yang harus saya ingat?",
    listening: "Saya mendengarkan…",
    example: "“Besok pukul 14.00, telepon Stefano”",
    placeholder: "Atau ketik pengingat…",
    add: "Tambah",
    reminders: "Pengingat saya",
    active: "aktif",
    empty: "Pengingat pertama akan muncul di sini.",
    noDate: "Tanpa tanggal",
    categories: { call: "TELEPON", task: "TUGAS", birthday: "ULANG TAHUN", shopping: "BELANJA", note: "CATATAN" }
  }
};

export function getMessages(locale: string): Messages {
  const language = locale.split(/[-_]/)[0]?.toLowerCase() || "en";
  const selected = translations[language] ?? {};
  return {
    ...en,
    ...selected,
    categories: { ...en.categories, ...(selected.categories ?? {}) }
  };
}
