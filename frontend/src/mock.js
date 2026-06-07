// Mock data for the military traffic management platform

export const mockUsers = [
  { id: '1', name: 'أحمد محمد العتيبي', militaryNumber: '12345', role: 'admin', status: 'active', rank: 'عقيد', unit: 'إدارة المرور' },
  { id: '2', name: 'خالد سعد القحطاني', militaryNumber: '23456', role: 'officer', status: 'active', rank: 'رائد', unit: 'دورية شمال' },
  { id: '3', name: 'فهد ناصر الشهري', militaryNumber: '34567', role: 'officer', status: 'pending', rank: 'نقيب', unit: 'دورية جنوب' },
];

export const mockStats = {
  totalSoldiers: 248,
  presentToday: 231,
  activeViolations: 17,
  pendingReports: 8,
  complianceRate: 93.2,
  monthlyChange: 4.5,
};

export const mockSoldiers = [
  { id: 's1', name: 'سلمان عبدالله الزهراني', militaryNumber: '10001', rank: 'ملازم أول', unit: 'دورية شمال', status: 'حاضر', violations: 0, lastSeen: 'اليوم 07:45' },
  { id: 's2', name: 'بدر فيصل الدوسري', militaryNumber: '10002', rank: 'ملازم', unit: 'دورية جنوب', status: 'حاضر', violations: 1, lastSeen: 'اليوم 07:30' },
  { id: 's3', name: 'ماجد عوض العنزي', militaryNumber: '10003', rank: 'نقيب', unit: 'دورية شرق', status: 'غائب', violations: 3, lastSeen: 'أمس 16:20' },
  { id: 's4', name: 'تركي حمد الحربي', militaryNumber: '10004', rank: 'رائد', unit: 'إدارة المرور', status: 'حاضر', violations: 0, lastSeen: 'اليوم 06:55' },
  { id: 's5', name: 'عبدالعزيز سلطان المطيري', militaryNumber: '10005', rank: 'ملازم أول', unit: 'دورية غرب', status: 'إجازة', violations: 0, lastSeen: 'قبل 3 أيام' },
  { id: 's6', name: 'يوسف مشعل القرشي', militaryNumber: '10006', rank: 'نقيب', unit: 'دورية شمال', status: 'حاضر', violations: 2, lastSeen: 'اليوم 07:50' },
  { id: 's7', name: 'ناصر صالح البقمي', militaryNumber: '10007', rank: 'ملازم', unit: 'دورية جنوب', status: 'حاضر', violations: 0, lastSeen: 'اليوم 07:15' },
  { id: 's8', name: 'محمد عبدالرحمن السبيعي', militaryNumber: '10008', rank: 'عقيد', unit: 'إدارة المرور', status: 'حاضر', violations: 0, lastSeen: 'اليوم 06:40' },
];

export const mockViolations = [
  { id: 'v1', soldierName: 'ماجد عوض العنزي', militaryNumber: '10003', type: 'تأخر عن الدوام', severity: 'متوسطة', date: '2025-07-08', status: 'قيد المراجعة', description: 'تأخر 45 دقيقة عن الدوام الرسمي' },
  { id: 'v2', soldierName: 'بدر فيصل الدوسري', militaryNumber: '10002', type: 'عدم ارتداء الزي الرسمي', severity: 'بسيطة', date: '2025-07-07', status: 'مغلقة', description: 'عدم الالتزام بالزي الرسمي خلال الدوام' },
  { id: 'v3', soldierName: 'يوسف مشعل القرشي', militaryNumber: '10006', type: 'مخالفة سير', severity: 'عالية', date: '2025-07-06', status: 'قيد المراجعة', description: 'تجاوز السرعة المحددة خلال المهمة' },
  { id: 'v4', soldierName: 'ماجد عوض العنزي', militaryNumber: '10003', type: 'غياب بدون إذن', severity: 'عالية', date: '2025-07-05', status: 'مفتوحة', description: 'غياب يوم كامل بدون تقديم عذر' },
  { id: 'v5', soldierName: 'يوسف مشعل القرشي', militaryNumber: '10006', type: 'عدم الالتزام بالتعليمات', severity: 'متوسطة', date: '2025-07-03', status: 'مغلقة', description: 'مخالفة تعليمات الضابط المشرف' },
];

export const mockAttendance = [
  { date: '2025-07-01', present: 230, absent: 12, leave: 6 },
  { date: '2025-07-02', present: 235, absent: 8, leave: 5 },
  { date: '2025-07-03', present: 228, absent: 14, leave: 6 },
  { date: '2025-07-04', present: 240, absent: 5, leave: 3 },
  { date: '2025-07-05', present: 232, absent: 10, leave: 6 },
  { date: '2025-07-06', present: 238, absent: 7, leave: 3 },
  { date: '2025-07-07', present: 231, absent: 11, leave: 6 },
];

export const mockReports = [
  { id: 'r1', title: 'تقرير الانضباط الشهري - يونيو 2025', type: 'شهري', date: '2025-07-01', status: 'مكتمل', author: 'العقيد أحمد العتيبي' },
  { id: 'r2', title: 'تقرير المخالفات الأسبوعي', type: 'أسبوعي', date: '2025-07-07', status: 'قيد الإعداد', author: 'الرائد خالد القحطاني' },
  { id: 'r3', title: 'تقرير دورية شمال', type: 'يومي', date: '2025-07-08', status: 'مكتمل', author: 'النقيب يوسف القرشي' },
  { id: 'r4', title: 'تقييم أداء الوحدات', type: 'ربع سنوي', date: '2025-07-01', status: 'مكتمل', author: 'العقيد أحمد العتيبي' },
];

export const mockNotifications = [
  { id: 'n1', title: 'طلب انضمام جديد', message: 'الملازم فهد الشهري يطلب الانضمام للمنصة', time: 'منذ 5 دقائق', type: 'request', read: false },
  { id: 'n2', title: 'مخالفة جديدة', message: 'تم تسجيل مخالفة جديدة للجندي ماجد العنزي', time: 'منذ ساعة', type: 'violation', read: false },
  { id: 'n3', title: 'تقرير جاهز', message: 'التقرير الشهري ليونيو جاهز للمراجعة', time: 'منذ 3 ساعات', type: 'report', read: true },
  { id: 'n4', title: 'تذكير', message: 'اجتماع الوحدة غداً الساعة 08:00 صباحاً', time: 'أمس', type: 'reminder', read: true },
];

export const mockComplianceChart = [
  { month: 'يناير', rate: 88 },
  { month: 'فبراير', rate: 90 },
  { month: 'مارس', rate: 89 },
  { month: 'أبريل', rate: 92 },
  { month: 'مايو', rate: 91 },
  { month: 'يونيو', rate: 93 },
  { month: 'يوليو', rate: 93.2 },
];

export const mockUnits = [
  { name: 'دورية شمال', count: 62, compliance: 95 },
  { name: 'دورية جنوب', count: 58, compliance: 91 },
  { name: 'دورية شرق', count: 54, compliance: 89 },
  { name: 'دورية غرب', count: 48, compliance: 94 },
  { name: 'إدارة المرور', count: 26, compliance: 97 },
];
