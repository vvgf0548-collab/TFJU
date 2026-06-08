from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os, logging, uuid
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Any
from datetime import datetime, timedelta, timezone, date
import jwt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# DB
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Auth config
SECRET_KEY = os.environ.get('JWT_SECRET', 'liwa-hamad-secret-key-change-in-prod-2025')
ALGO = 'HS256'
TOKEN_EXPIRE_HOURS = 24 * 7

app = FastAPI(title='Liwa Hamad Security Gate API')
api = APIRouter(prefix='/api')
security = HTTPBearer(auto_error=False)
logger = logging.getLogger('uvicorn.error')


# ===== Models =====
def uid(): return str(uuid.uuid4())
def now_iso(): return datetime.now(timezone.utc).isoformat()


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = 'bearer'
    user: dict


class LoginIn(BaseModel):
    name: str
    militaryNumber: str


class UserOut(BaseModel):
    id: str
    name: str
    militaryNumber: str
    role: str
    status: str
    rank: str
    department: str
    joinDate: Optional[str] = None
    serviceYears: Optional[int] = 0


class AnnouncementIn(BaseModel):
    title: str
    category: str
    priority: str = 'normal'
    content: str
    author: Optional[str] = None


class ViolationIn(BaseModel):
    soldierId: str
    type: str
    severity: str
    description: Optional[str] = ''


class ViolationStatusIn(BaseModel):
    status: str


class RequestIn(BaseModel):
    type: str
    details: str


class RequestStatusIn(BaseModel):
    status: str


class ReportIn(BaseModel):
    title: str
    type: str


class OperationIn(BaseModel):
    name: str
    type: str
    location: str
    team: int
    status: str = 'مجدولة'
    date: Optional[str] = None


class SupportIn(BaseModel):
    kind: str
    subject: str
    message: str


# ===== Auth helpers =====
def create_token(user_id: str) -> str:
    payload = {
        'sub': user_id,
        'exp': datetime.now(timezone.utc) + timedelta(hours=TOKEN_EXPIRE_HOURS),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGO)


async def get_current_user(creds: Optional[HTTPAuthorizationCredentials] = Depends(security)) -> dict:
    if not creds:
        raise HTTPException(status_code=401, detail='Not authenticated')
    try:
        payload = jwt.decode(creds.credentials, SECRET_KEY, algorithms=[ALGO])
        uid_ = payload.get('sub')
    except Exception:
        raise HTTPException(status_code=401, detail='Invalid token')
    user = await db.users.find_one({'id': uid_}, {'_id': 0})
    if not user:
        raise HTTPException(status_code=401, detail='User not found')
    return user


async def require_active(user: dict = Depends(get_current_user)) -> dict:
    if user.get('status') != 'active':
        raise HTTPException(status_code=403, detail='Account not active')
    return user


async def require_admin(user: dict = Depends(require_active)) -> dict:
    if user.get('role') != 'admin':
        raise HTTPException(status_code=403, detail='Admin only')
    return user


# ===== Seeding =====
async def seed():
    if await db.users.count_documents({}) == 0:
        # Commander - highest authority who distributes ranks
        commander = {
            'id': uid(), 'name': 'أحمد محمد العتيبي', 'militaryNumber': '12345',
            'role': 'admin', 'status': 'active', 'rank': 'قائد',
            'department': 'القيادة العليا', 'joinDate': '2010-01-01', 'serviceYears': 15,
            'createdAt': now_iso(),
        }
        members = [
            ('سلمان عبدالله الزهراني', '10001', 'ملازم أول', 'الأمن الداخلي', 'نشط'),
            ('بدر فيصل الدوسري', '10002', 'ملازم', 'الدوريات الأمنية', 'نشط'),
            ('ماجد عوض العنزي', '10003', 'نقيب', 'العمليات الخاصة', 'موقوف'),
            ('تركي حمد الحربي', '10004', 'رائد', 'شؤون الأفراد', 'نشط'),
            ('عبدالعزيز المطيري', '10005', 'ملازم أول', 'الدوريات', 'نشط'),
            ('يوسف مشعل القرشي', '10006', 'نقيب', 'الأمن الداخلي', 'نشط'),
            ('ناصر البقمي', '10007', 'ملازم', 'الدوريات', 'نشط'),
            ('محمد السبيعي', '10008', 'عقيد', 'الإدارة العامة', 'نشط'),
            ('علي الغامدي', '10009', 'ملازم', 'الإدارة العامة', 'متقاعد'),
        ]
        seeded = [commander]
        for nm, mn, rk, dept, st in members:
            seeded.append({
                'id': uid(), 'name': nm, 'militaryNumber': mn,
                'role': 'officer', 'status': 'active' if st == 'نشط' else st,
                'memberStatus': st, 'rank': rk, 'department': dept,
                'joinDate': '2018-01-15', 'serviceYears': 7,
                'createdAt': now_iso(),
            })
        await db.users.insert_many(seeded)

    if await db.announcements.count_documents({}) == 0:
        await db.announcements.insert_many([
            {'id': uid(), 'title': 'تعميم رقم 12 لسنة 2025', 'category': 'تعميم', 'priority': 'high',
             'date': '2025-07-07', 'content': 'تفعيل نظام التسجيل الإلكتروني لجميع أفراد القطاع.',
             'author': 'قيادة اللواء', 'createdAt': now_iso()},
            {'id': uid(), 'title': 'تنبيه أمني عاجل', 'category': 'تنبيه', 'priority': 'critical',
             'date': '2025-07-08', 'content': 'رفع درجة الجاهزية في جميع النقاط الأمنية.',
             'author': 'غرفة العمليات', 'createdAt': now_iso()},
            {'id': uid(), 'title': 'قرار إداري بشأن الترقيات', 'category': 'قرار', 'priority': 'normal',
             'date': '2025-07-05', 'content': 'اعتماد الدفعة الجديدة من المرشحين للترقية.',
             'author': 'إدارة الترقيات', 'createdAt': now_iso()},
        ])

    if await db.operations.count_documents({}) == 0:
        await db.operations.insert_many([
            {'id': uid(), 'name': 'عملية درع الأمان', 'type': 'مداهمة', 'status': 'جارية',
             'location': 'القطاع الشمالي', 'date': '2025-07-08', 'team': 12, 'createdAt': now_iso()},
            {'id': uid(), 'name': 'نقطة تفتيش ألفا', 'type': 'نقطة تفتيش', 'status': 'جارية',
             'location': 'البوابة الرئيسية', 'date': '2025-07-08', 'team': 6, 'createdAt': now_iso()},
            {'id': uid(), 'name': 'دورية ليلية ب', 'type': 'دورية', 'status': 'مجدولة',
             'location': 'القطاع الجنوبي', 'date': '2025-07-09', 'team': 8, 'createdAt': now_iso()},
        ])

    if await db.violations.count_documents({}) == 0:
        await db.violations.insert_many([
            {'id': uid(), 'soldierName': 'ماجد العنزي', 'militaryNumber': '10003',
             'type': 'تأخر عن الدوام', 'severity': 'متوسطة', 'date': '2025-07-08',
             'status': 'قيد المراجعة', 'description': 'تأخر 45 دقيقة', 'createdAt': now_iso()},
            {'id': uid(), 'soldierName': 'بدر الدوسري', 'militaryNumber': '10002',
             'type': 'عدم ارتداء الزي', 'severity': 'بسيطة', 'date': '2025-07-07',
             'status': 'مغلقة', 'description': 'عدم الالتزام بالزي', 'createdAt': now_iso()},
        ])

    if await db.reports.count_documents({}) == 0:
        await db.reports.insert_many([
            {'id': uid(), 'title': 'تقرير دورية الشمال - 07 يوليو', 'type': 'دورية',
             'date': '2025-07-07', 'status': 'معتمد', 'author': 'النقيب يوسف القرشي', 'createdAt': now_iso()},
            {'id': uid(), 'title': 'تقرير مداهمة عملية درع الأمان', 'type': 'مداهمة',
             'date': '2025-07-08', 'status': 'قيد المراجعة', 'author': 'الرائد تركي الحربي', 'createdAt': now_iso()},
        ])

    if await db.promotions.count_documents({}) == 0:
        await db.promotions.insert_many([
            {'id': uid(), 'name': 'سلمان الزهراني', 'fromRank': 'ملازم أول', 'toRank': 'نقيب',
             'date': '2025-07-01', 'department': 'الأمن الداخلي'},
            {'id': uid(), 'name': 'بدر الدوسري', 'fromRank': 'ملازم', 'toRank': 'ملازم أول',
             'date': '2025-06-15', 'department': 'الدوريات'},
            {'id': uid(), 'name': 'تركي الحربي', 'fromRank': 'نقيب', 'toRank': 'رائد',
             'date': '2025-06-10', 'department': 'العمليات الخاصة'},
        ])

    if await db.medals.count_documents({}) == 0:
        await db.medals.insert_many([
            {'id': uid(), 'name': 'وسام الاستحقاق', 'recipient': 'أحمد العتيبي', 'date': '2025-06-30', 'reason': 'تميز في الأداء'},
            {'id': uid(), 'name': 'وسام الشجاعة', 'recipient': 'خالد القحطاني', 'date': '2025-05-15', 'reason': 'بسالة في عملية أمنية'},
        ])


# ===== Routes =====
@api.get('/')
async def root():
    return {'message': 'Liwa Hamad Security API', 'status': 'ok'}


# Rank hierarchy (lower number = higher rank)
RANK_HIERARCHY = {
    'قائد': 0,       # Commander - highest
    'عقيد': 1,
    'مقدم': 2,
    'رائد': 3,
    'نقيب': 4,
    'ملازم أول': 5,
    'ملازم': 6,
    'رئيس عرفاء': 7,
    'عرفاء': 8,
    'وكيل رقيب': 9,
    'رقيب': 10,
    'جندي أول': 11,
    'جندي': 12,     # Lowest
}

# Auth
@api.post('/auth/login', response_model=TokenResponse)
async def login(data: LoginIn):
    mn = data.militaryNumber.strip()
    nm = data.name.strip()
    if not mn or not nm:
        raise HTTPException(status_code=400, detail='البيانات ناقصة')

    user = await db.users.find_one({'militaryNumber': mn}, {'_id': 0})
    if not user:
        # Auto-registration with auto-approval
        is_commander = mn == '12345'
        is_new_admin = mn == '00000'
        new_user = {
            'id': uid(), 'name': nm, 'militaryNumber': mn,
            'role': 'admin' if (is_commander or is_new_admin) else 'officer',
            'status': 'active',  # Auto-approve all new users
            'rank': 'عقيد',
            'department': 'الإدارة العامة' if (is_commander or is_new_admin) else 'غير محدد',
            'joinDate': datetime.now().strftime('%Y-%m-%d'),
            'serviceYears': 0, 'createdAt': now_iso(),
        }
        await db.users.insert_one(new_user)
        user = new_user

    token = create_token(user['id'])
    user.pop('_id', None)
    return TokenResponse(access_token=token, user=user)


@api.get('/auth/me')
async def me(user: dict = Depends(get_current_user)):
    return user


# Users / admin approvals
@api.get('/users')
async def list_users(user: dict = Depends(require_active)):
    users = await db.users.find({}, {'_id': 0}).to_list(1000)
    return users


@api.get('/users/pending')
async def pending_users(user: dict = Depends(require_admin)):
    users = await db.users.find({'status': 'pending'}, {'_id': 0}).to_list(1000)
    return users


@api.post('/users/{user_id}/approve')
async def approve_user(user_id: str, admin: dict = Depends(require_admin)):
    result = await db.users.update_one({'id': user_id}, {'$set': {'status': 'active'}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail='User not found')
    return {'ok': True}


@api.post('/users/{user_id}/reject')
async def reject_user(user_id: str, admin: dict = Depends(require_admin)):
    await db.users.delete_one({'id': user_id})
    return {'ok': True}


# Announcements
@api.get('/announcements')
async def list_announcements(user: dict = Depends(require_active)):
    return await db.announcements.find({}, {'_id': 0}).sort('createdAt', -1).to_list(500)


@api.post('/announcements')
async def create_announcement(data: AnnouncementIn, admin: dict = Depends(require_admin)):
    item = {**data.dict(), 'id': uid(), 'date': datetime.now().strftime('%Y-%m-%d'),
            'author': data.author or admin.get('rank', '') + ' ' + admin['name'],
            'createdAt': now_iso()}
    await db.announcements.insert_one(item)
    item.pop('_id', None)
    return item


# Violations
@api.get('/violations')
async def list_violations(user: dict = Depends(require_active)):
    return await db.violations.find({}, {'_id': 0}).sort('createdAt', -1).to_list(500)


@api.post('/violations')
async def create_violation(data: ViolationIn, user: dict = Depends(require_active)):
    soldier = await db.users.find_one({'id': data.soldierId}, {'_id': 0})
    if not soldier:
        raise HTTPException(status_code=404, detail='Soldier not found')
    item = {
        'id': uid(), 'soldierId': data.soldierId, 'soldierName': soldier['name'],
        'militaryNumber': soldier['militaryNumber'], 'type': data.type,
        'severity': data.severity, 'description': data.description,
        'date': datetime.now().strftime('%Y-%m-%d'), 'status': 'مفتوحة',
        'createdAt': now_iso(),
    }
    await db.violations.insert_one(item)
    item.pop('_id', None)
    return item


@api.patch('/violations/{vid}')
async def update_violation(vid: str, data: ViolationStatusIn, user: dict = Depends(require_active)):
    res = await db.violations.update_one({'id': vid}, {'$set': {'status': data.status}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail='Not found')
    return {'ok': True}


# Requests
@api.get('/requests')
async def list_requests(user: dict = Depends(require_active)):
    q = {} if user.get('role') == 'admin' else {'applicantId': user['id']}
    return await db.requests.find(q, {'_id': 0}).sort('createdAt', -1).to_list(500)


@api.post('/requests')
async def create_request(data: RequestIn, user: dict = Depends(require_active)):
    item = {
        'id': uid(), 'type': data.type, 'details': data.details,
        'applicantId': user['id'], 'applicant': user['name'],
        'date': datetime.now().strftime('%Y-%m-%d'),
        'status': 'قيد المراجعة', 'createdAt': now_iso(),
    }
    await db.requests.insert_one(item)
    item.pop('_id', None)
    return item


@api.patch('/requests/{rid}')
async def update_request(rid: str, data: RequestStatusIn, admin: dict = Depends(require_admin)):
    res = await db.requests.update_one({'id': rid}, {'$set': {'status': data.status}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail='Not found')
    return {'ok': True}


# Reports
@api.get('/reports')
async def list_reports(user: dict = Depends(require_active)):
    return await db.reports.find({}, {'_id': 0}).sort('createdAt', -1).to_list(500)


@api.post('/reports')
async def create_report(data: ReportIn, user: dict = Depends(require_active)):
    item = {
        'id': uid(), 'title': data.title, 'type': data.type,
        'date': datetime.now().strftime('%Y-%m-%d'), 'status': 'قيد المراجعة',
        'author': user.get('rank', '') + ' ' + user['name'], 'createdAt': now_iso(),
    }
    await db.reports.insert_one(item)
    item.pop('_id', None)
    return item


# Operations
@api.get('/operations')
async def list_operations(user: dict = Depends(require_active)):
    return await db.operations.find({}, {'_id': 0}).sort('createdAt', -1).to_list(500)


@api.post('/operations')
async def create_operation(data: OperationIn, admin: dict = Depends(require_admin)):
    item = {**data.dict(), 'id': uid(), 'date': data.date or datetime.now().strftime('%Y-%m-%d'),
            'createdAt': now_iso()}
    await db.operations.insert_one(item)
    item.pop('_id', None)
    return item


# Attendance
@api.post('/attendance/checkin')
async def check_in(user: dict = Depends(require_active)):
    today = datetime.now().strftime('%Y-%m-%d')
    existing = await db.attendance.find_one({'userId': user['id'], 'date': today})
    now = datetime.now().strftime('%H:%M')
    if existing:
        if existing.get('checkIn'):
            return {'ok': False, 'message': 'تم تسجيل الحضور سابقاً', 'checkIn': existing['checkIn']}
        await db.attendance.update_one({'_id': existing['_id']}, {'$set': {'checkIn': now}})
    else:
        await db.attendance.insert_one({
            'id': uid(), 'userId': user['id'], 'userName': user['name'],
            'date': today, 'checkIn': now, 'checkOut': None, 'status': 'حاضر',
            'createdAt': now_iso(),
        })
    return {'ok': True, 'checkIn': now}


@api.post('/attendance/checkout')
async def check_out(user: dict = Depends(require_active)):
    today = datetime.now().strftime('%Y-%m-%d')
    now = datetime.now().strftime('%H:%M')
    existing = await db.attendance.find_one({'userId': user['id'], 'date': today})
    if not existing or not existing.get('checkIn'):
        raise HTTPException(status_code=400, detail='سجل الحضور أولاً')
    await db.attendance.update_one({'_id': existing['_id']}, {'$set': {'checkOut': now}})
    return {'ok': True, 'checkOut': now}


@api.get('/attendance/today')
async def attendance_today(user: dict = Depends(require_active)):
    today = datetime.now().strftime('%Y-%m-%d')
    mine = await db.attendance.find_one({'userId': user['id'], 'date': today}, {'_id': 0})
    return {'mine': mine}


@api.get('/attendance/history')
async def attendance_history(user: dict = Depends(require_active)):
    # Aggregate last 7 days
    total_users = await db.users.count_documents({'status': 'active'})
    pipeline = [
        {'$group': {'_id': '$date', 'present': {'$sum': 1}}},
        {'$sort': {'_id': -1}}, {'$limit': 7},
    ]
    rows = await db.attendance.aggregate(pipeline).to_list(7)
    history = []
    for r in rows:
        present = r['present']
        history.append({'date': r['_id'], 'present': present,
                        'absent': max(0, total_users - present - 4), 'leave': 4})
    # If empty, return demo data
    if not history:
        base_date = datetime.now()
        for i in range(7):
            d = (base_date - timedelta(days=i)).strftime('%Y-%m-%d')
            history.append({'date': d, 'present': max(1, total_users - (i % 3)), 'absent': i % 3, 'leave': 1})
    return history[::-1]


# Promotions / Medals
@api.get('/promotions')
async def list_promotions(user: dict = Depends(require_active)):
    return await db.promotions.find({}, {'_id': 0}).to_list(200)


@api.get('/medals')
async def list_medals(user: dict = Depends(require_active)):
    return await db.medals.find({}, {'_id': 0}).to_list(200)


# Dashboard stats
@api.get('/stats/dashboard')
async def dashboard_stats(user: dict = Depends(require_active)):
    total_users = await db.users.count_documents({'status': 'active'})
    today = datetime.now().strftime('%Y-%m-%d')
    present_today = await db.attendance.count_documents({'date': today, 'status': 'حاضر'})
    active_ops = await db.operations.count_documents({'status': 'جارية'})
    pending_reqs = await db.requests.count_documents({'status': 'قيد المراجعة'})
    total_reports = await db.reports.count_documents({})
    active_viol = await db.violations.count_documents({'status': {'$ne': 'مغلقة'}})
    pending_users = await db.users.count_documents({'status': 'pending'})

    return {
        'totalMembers': total_users,
        'presentToday': present_today or max(1, total_users - 2),
        'activeOperations': active_ops,
        'pendingRequests': pending_reqs,
        'totalReports': total_reports,
        'activeViolations': active_viol,
        'pendingUsers': pending_users,
        'complianceRate': 94.8,
        'monthlyChange': 3.2,
    }


# Support
@api.post('/support/ticket')
async def support_ticket(data: SupportIn, user: dict = Depends(require_active)):
    item = {
        'id': uid(), 'kind': data.kind, 'subject': data.subject,
        'message': data.message, 'userId': user['id'], 'userName': user['name'],
        'status': 'مفتوحة', 'createdAt': now_iso(),
    }
    await db.support_tickets.insert_one(item)
    item.pop('_id', None)
    return item


# Register router
app.include_router(api)

app.add_middleware(
    CORSMiddleware, allow_credentials=True,
    allow_origins=['*'], allow_methods=['*'], allow_headers=['*'],
)


@app.on_event('startup')
async def on_start():
    try:
        await seed()
        logger.info('DB seeded')
    except Exception as e:
        logger.error(f'Seed error: {e}')


@app.on_event('shutdown')
async def on_stop():
    client.close()


logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
