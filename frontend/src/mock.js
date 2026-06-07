// Mock data for Liwa Hamad Security Gate

export const mockUsers = [
  { id: '1', name: 'أحمد محمد العتيبي', militaryNumber: '12345', role: 'admin', status: 'active', rank: 'عقيد', department: 'الأمن الداخلي', joinDate: '2012-03-15', serviceYears: 13 },
  { id: '2', name: 'خالد سعد القحطاني', militaryNumber: '23456', role: 'officer', status: 'active', rank: 'رائد', department: 'الدوريات الأمنية', joinDate: '2015-06-01', serviceYears: 10 },
];

export const mockStats = {
  totalMembers: 412,
  presentToday: 387,
  activeOperations: 23,
  pendingRequests: 14,
  reportsThisMonth: 156,
  complianceRate: 94.8,
  monthlyChange: 3.2,
  totalReports: 1287,
  activeViolations: 9,
};

export const mockAnnouncements = [
  { id: 'a1', title: 'تعميم رقم 12 لسنة 2025', category: 'تعميم', priority: 'high', date: '2025-07-07', content: 'تفعيل نظام التسجيل الإلكتروني لجميع أفراد القطاع ابتداءً من تاريخه.', author: 'قيادة اللواء' },
  { id: 'a2', title: 'تنبيه أمني عاجل', category: 'تنبيه', priority: 'critical', date: '2025-07-08', content: 'رفع درجة الجاهزية في جميع النقاط الأمنية خلال الفترة القادمة.', author: 'غرفة العمليات' },
  { id: 'a3', title: 'قرار إداري بشأن الترقيات', category: 'قرار', priority: 'normal', date: '2025-07-05', content: 'اعتماد الدفعة الجديدة من المرشحين للترقية للرتب التالية.', author: 'إدارة الترقيات' },
  { id: 'a4', title: 'تحديث بروتوكول المداهمات', category: 'تحديث', priority: 'normal', date: '2025-07-03', content: 'تحديث بروتوكول المداهمات بحسب اللوائح الجديدة.', author: 'العمليات الخاصة' },
];

export const mockPromotions = [
  { id: 'p1', name: 'سلمان الزهراني', fromRank: 'ملازم أول', toRank: 'نقيب', date: '2025-07-01', department: 'الأمن الداخلي' },
  { id: 'p2', name: 'بدر الدوسري', fromRank: 'ملازم', toRank: 'ملازم أول', date: '2025-06-15', department: 'الدوريات' },
  { id: 'p3', name: 'تركي الحربي', fromRank: 'نقيب', toRank: 'رائد', date: '2025-06-10', department: 'العمليات الخاصة' },
];

export const mockMedals = [
  { id: 'm1', name: 'وسام الاستحقاق', recipient: 'أحمد العتيبي', date: '2025-06-30', reason: 'تميز في الأداء' },
  { id: 'm2', name: 'وسام الشجاعة', recipient: 'خالد القحطاني', date: '2025-05-15', reason: 'بسالة في عملية أمنية' },
];

export const mockMembers = [
  { id: 's1', name: 'سلمان عبدالله الزهراني', militaryNumber: '10001', rank: 'ملازم أول', department: 'الأمن الداخلي', status: 'نشط', violations: 0 },
  { id: 's2', name: 'بدر فيصل الدوسري', militaryNumber: '10002', rank: 'ملازم', department: 'الدوريات الأمنية', status: 'نشط', violations: 1 },
  { id: 's3', name: 'ماجد عوض العنزي', militaryNumber: '10003', rank: 'نقيب', department: 'العمليات الخاصة', status: 'موقوف', violations: 3 },
  { id: 's4', name: 'تركي حمد الحربي', militaryNumber: '10004', rank: 'رائد', department: 'شؤون الأفراد', status: 'نشط', violations: 0 },
  { id: 's5', name: 'عبدالعزيز المطيري', militaryNumber: '10005', rank: 'ملازم أول', department: 'الدوريات', status: 'نشط', violations: 0 },
  { id: 's6', name: 'يوسف مشعل القرشي', militaryNumber: '10006', rank: 'نقيب', department: 'الأمن الداخلي', status: 'نشط', violations: 2 },
  { id: 's7', name: 'ناصر البقمي', militaryNumber: '10007', rank: 'ملازم', department: 'الدوريات', status: 'نشط', violations: 0 },
  { id: 's8', name: 'محمد السبيعي', militaryNumber: '10008', rank: 'عقيد', department: 'الإدارة العامة', status: 'نشط', violations: 0 },
  { id: 's9', name: 'علي الغامدي', militaryNumber: '10009', rank: 'ملازم', department: 'الإدارة العامة', status: 'متقاعد', violations: 0 },
];

export const mockOperations = [
  { id: 'op1', name: 'عملية درع الأمان', type: 'مداهمة', status: 'جارية', location: 'القطاع الشمالي', date: '2025-07-08', team: 12 },
  { id: 'op2', name: 'نقطة تفتيش ألفا', type: 'نقطة تفتيش', status: 'جارية', location: 'البوابة الرئيسية', date: '2025-07-08', team: 6 },
  { id: 'op3', name: 'دورية ليلية ب', type: 'دورية', status: 'مجدولة', location: 'القطاع الجنوبي', date: '2025-07-09', team: 8 },
  { id: 'op4', name: 'مهمة تأمين فعالية', type: 'مهمة خاصة', status: 'مكتملة', location: 'الساحة العامة', date: '2025-07-05', team: 24 },
];

export const mockReports = [
  { id: 'r1', title: 'تقرير دورية الشمال - 07 يوليو', type: 'دورية', date: '2025-07-07', status: 'معتمد', author: 'النقيب يوسف القرشي' },
  { id: 'r2', title: 'تقرير مداهمة عملية درع الأمان', type: 'مداهمة', date: '2025-07-08', status: 'قيد المراجعة', author: 'الرائد تركي الحربي' },
  { id: 'r3', title: 'تقرير مهمة تأمين فعالية', type: 'مهمة', date: '2025-07-05', status: 'معتمد', author: 'العقيد أحمد العتيبي' },
  { id: 'r4', title: 'تقرير مخالفة - أسبوعي', type: 'مخالفة', date: '2025-07-06', status: 'معتمد', author: 'الرائد خالد القحطاني' },
];

export const mockRequests = [
  { id: 'req1', type: 'إجازة', applicant: 'سلمان الزهراني', date: '2025-07-08', status: 'قيد المراجعة', details: 'إجازة اعتيادية 7 أيام' },
  { id: 'req2', type: 'نقل', applicant: 'بدر الدوسري', date: '2025-07-07', status: 'موافق', details: 'نقل إلى قسم العمليات' },
  { id: 'req3', type: 'ترقية', applicant: 'تركي الحربي', date: '2025-07-06', status: 'موافق', details: 'طلب ترقية لرتبة رائد' },
  { id: 'req4', type: 'عودة للخدمة', applicant: 'فهد الغامدي', date: '2025-07-04', status: 'مرفوض', details: 'طلب عودة بعد إجازة طويلة' },
];

export const mockViolations = [
  { id: 'v1', soldierName: 'ماجد العنزي', militaryNumber: '10003', type: 'تأخر عن الدوام', severity: 'متوسطة', date: '2025-07-08', status: 'قيد المراجعة', description: 'تأخر 45 دقيقة' },
  { id: 'v2', soldierName: 'بدر الدوسري', militaryNumber: '10002', type: 'عدم ارتداء الزي', severity: 'بسيطة', date: '2025-07-07', status: 'مغلقة', description: 'عدم الالتزام بالزي' },
  { id: 'v3', soldierName: 'يوسف القرشي', militaryNumber: '10006', type: 'مخالفة سير', severity: 'عالية', date: '2025-07-06', status: 'قيد المراجعة', description: 'تجاوز السرعة' },
  { id: 'v4', soldierName: 'ماجد العنزي', militaryNumber: '10003', type: 'غياب بدون إذن', severity: 'عالية', date: '2025-07-05', status: 'مفتوحة', description: 'غياب يوم كامل' },
];

export const mockAttendance = [
  { date: '2025-07-01', present: 392, absent: 15, leave: 5 },
  { date: '2025-07-02', present: 395, absent: 12, leave: 5 },
  { date: '2025-07-03', present: 388, absent: 19, leave: 5 },
  { date: '2025-07-04', present: 400, absent: 8, leave: 4 },
  { date: '2025-07-05', present: 391, absent: 16, leave: 5 },
  { date: '2025-07-06', present: 397, absent: 11, leave: 4 },
  { date: '2025-07-07', present: 387, absent: 20, leave: 5 },
];

export const mockNotifications = [
  { id: 'n1', title: 'تنبيه أمني عاجل', message: 'رفع درجة الجاهزية', time: 'منذ 5 دقائق', type: 'alert', read: false },
  { id: 'n2', title: 'طلب انضمام', message: 'عضو جديد ينتظر الموافقة', time: 'منذ ساعة', type: 'request', read: false },
  { id: 'n3', title: 'تعميم جديد', message: 'تعميم رقم 12 تم إصداره', time: 'منذ 3 ساعات', type: 'announcement', read: true },
];

export const mockComplianceChart = [
  { month: 'يناير', rate: 89 }, { month: 'فبراير', rate: 91 }, { month: 'مارس', rate: 90 },
  { month: 'أبريل', rate: 93 }, { month: 'مايو', rate: 92 }, { month: 'يونيو', rate: 94 }, { month: 'يوليو', rate: 94.8 },
];

export const mockDepartments = [
  { name: 'الأمن الداخلي', count: 95, compliance: 96, icon: 'shield' },
  { name: 'الدوريات الأمنية', count: 88, compliance: 93, icon: 'car' },
  { name: 'العمليات الخاصة', count: 64, compliance: 95, icon: 'crosshair' },
  { name: 'شؤون الأفراد', count: 42, compliance: 94, icon: 'users' },
  { name: 'إدارة الترقيات', count: 28, compliance: 97, icon: 'award' },
  { name: 'إدارة الانضباط', count: 35, compliance: 92, icon: 'gavel' },
  { name: 'الإدارة العامة', count: 32, compliance: 98, icon: 'briefcase' },
  { name: 'الإحصائيات والتقارير', count: 28, compliance: 95, icon: 'bar-chart' },
];

export const mockHonors = {
  bestMember: { name: 'سلمان الزهراني', rank: 'ملازم أول', reason: 'تميز في أداء الواجب' },
  bestOfficer: { name: 'تركي الحربي', rank: 'رائد', reason: 'قيادة عمليات ناجحة' },
  bestDepartment: { name: 'الأمن الداخلي', reason: 'أعلى نسبة التزام 96%' },
  monthly: [
    { name: 'سلمان الزهراني', achievement: 'أعلى عدد ساعات خدمة' },
    { name: 'يوسف القرشي', achievement: 'أفضل تقرير دورية' },
    { name: 'تركي الحربي', achievement: 'قيادة عملية ناجحة' },
  ],
};

export const mockCards = [
  { id: 'c1', type: 'بطاقة عسكرية أساسية', status: 'سارية', issueDate: '2022-01-15', expiryDate: '2027-01-15' },
  { id: 'c2', type: 'تصريح دخول إداري', status: 'ساري', issueDate: '2024-03-01', expiryDate: '2026-03-01' },
];
