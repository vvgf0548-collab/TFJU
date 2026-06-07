#!/usr/bin/env python3
"""
Comprehensive backend API tests for Liwa Hamad Security Gate
Tests all endpoints under /api prefix
"""
import requests
import json
from typing import Optional, Dict, Any

# Backend URL from frontend/.env
BASE_URL = "https://discourse-pro-5.preview.emergentagent.com/api"

# Test state
admin_token: Optional[str] = None
admin_user: Optional[Dict] = None
pending_user_token: Optional[str] = None
pending_user: Optional[Dict] = None
new_admin_token: Optional[str] = None
regular_user_token: Optional[str] = None
regular_user: Optional[Dict] = None

# Test results tracking
test_results = {
    "passed": [],
    "failed": [],
    "total": 0
}


def log_test(name: str, passed: bool, details: str = ""):
    """Log test result"""
    test_results["total"] += 1
    status = "✅ PASS" if passed else "❌ FAIL"
    result = f"{status}: {name}"
    if details:
        result += f" - {details}"
    print(result)
    
    if passed:
        test_results["passed"].append(name)
    else:
        test_results["failed"].append(name)


def test_auth_login_existing_admin():
    """Test 1: Login with seeded admin (militaryNumber=12345)"""
    global admin_token, admin_user
    
    try:
        response = requests.post(
            f"{BASE_URL}/auth/login",
            json={"name": "أحمد محمد العتيبي", "militaryNumber": "12345"},
            timeout=10
        )
        
        if response.status_code != 200:
            log_test("Auth - Login existing admin", False, f"Status {response.status_code}: {response.text}")
            return
        
        data = response.json()
        
        # Validate response structure
        if "access_token" not in data or "user" not in data:
            log_test("Auth - Login existing admin", False, "Missing access_token or user in response")
            return
        
        admin_token = data["access_token"]
        admin_user = data["user"]
        
        # Validate user data
        if admin_user.get("role") != "admin":
            log_test("Auth - Login existing admin", False, f"Expected role=admin, got {admin_user.get('role')}")
            return
        
        if admin_user.get("status") != "active":
            log_test("Auth - Login existing admin", False, f"Expected status=active, got {admin_user.get('status')}")
            return
        
        if admin_user.get("militaryNumber") != "12345":
            log_test("Auth - Login existing admin", False, f"Expected militaryNumber=12345, got {admin_user.get('militaryNumber')}")
            return
        
        log_test("Auth - Login existing admin", True, f"Token received, role={admin_user['role']}, status={admin_user['status']}")
        
    except Exception as e:
        log_test("Auth - Login existing admin", False, f"Exception: {str(e)}")


def test_auth_login_new_user():
    """Test 2: Login with new militaryNumber (creates pending user)"""
    global pending_user_token, pending_user
    
    try:
        response = requests.post(
            f"{BASE_URL}/auth/login",
            json={"name": "ضيف اختبار", "militaryNumber": "99999"},
            timeout=10
        )
        
        if response.status_code != 200:
            log_test("Auth - Login new user (pending)", False, f"Status {response.status_code}: {response.text}")
            return
        
        data = response.json()
        
        if "access_token" not in data or "user" not in data:
            log_test("Auth - Login new user (pending)", False, "Missing access_token or user in response")
            return
        
        pending_user_token = data["access_token"]
        pending_user = data["user"]
        
        # Should be pending status
        if pending_user.get("status") != "pending":
            log_test("Auth - Login new user (pending)", False, f"Expected status=pending, got {pending_user.get('status')}")
            return
        
        if pending_user.get("role") != "officer":
            log_test("Auth - Login new user (pending)", False, f"Expected role=officer, got {pending_user.get('role')}")
            return
        
        log_test("Auth - Login new user (pending)", True, f"User created with status=pending, role={pending_user['role']}")
        
    except Exception as e:
        log_test("Auth - Login new user (pending)", False, f"Exception: {str(e)}")


def test_auth_login_instant_admin():
    """Test 3: Login with militaryNumber=00000 (instant admin)"""
    global new_admin_token
    
    try:
        response = requests.post(
            f"{BASE_URL}/auth/login",
            json={"name": "مسؤول جديد", "militaryNumber": "00000"},
            timeout=10
        )
        
        if response.status_code != 200:
            log_test("Auth - Login instant admin (00000)", False, f"Status {response.status_code}: {response.text}")
            return
        
        data = response.json()
        user = data.get("user", {})
        
        if user.get("role") != "admin":
            log_test("Auth - Login instant admin (00000)", False, f"Expected role=admin, got {user.get('role')}")
            return
        
        if user.get("status") != "active":
            log_test("Auth - Login instant admin (00000)", False, f"Expected status=active, got {user.get('status')}")
            return
        
        new_admin_token = data["access_token"]
        log_test("Auth - Login instant admin (00000)", True, "Instant admin created with role=admin, status=active")
        
    except Exception as e:
        log_test("Auth - Login instant admin (00000)", False, f"Exception: {str(e)}")


def test_auth_login_missing_fields():
    """Test 4: Login with missing fields (should return 400)"""
    try:
        response = requests.post(
            f"{BASE_URL}/auth/login",
            json={"name": "Test"},
            timeout=10
        )
        
        if response.status_code == 400 or response.status_code == 422:
            log_test("Auth - Login missing fields", True, f"Correctly returned {response.status_code}")
        else:
            log_test("Auth - Login missing fields", False, f"Expected 400/422, got {response.status_code}")
        
    except Exception as e:
        log_test("Auth - Login missing fields", False, f"Exception: {str(e)}")


def test_auth_me_with_token():
    """Test 5: GET /api/auth/me with valid token"""
    if not admin_token:
        log_test("Auth - GET /me with token", False, "No admin token available")
        return
    
    try:
        response = requests.get(
            f"{BASE_URL}/auth/me",
            headers={"Authorization": f"Bearer {admin_token}"},
            timeout=10
        )
        
        if response.status_code != 200:
            log_test("Auth - GET /me with token", False, f"Status {response.status_code}: {response.text}")
            return
        
        user = response.json()
        
        if user.get("militaryNumber") != "12345":
            log_test("Auth - GET /me with token", False, f"Expected militaryNumber=12345, got {user.get('militaryNumber')}")
            return
        
        log_test("Auth - GET /me with token", True, f"User data returned: {user.get('name')}")
        
    except Exception as e:
        log_test("Auth - GET /me with token", False, f"Exception: {str(e)}")


def test_auth_me_without_token():
    """Test 6: GET /api/auth/me without token (should return 401)"""
    try:
        response = requests.get(f"{BASE_URL}/auth/me", timeout=10)
        
        if response.status_code == 401 or response.status_code == 403:
            log_test("Auth - GET /me without token", True, f"Correctly returned {response.status_code}")
        else:
            log_test("Auth - GET /me without token", False, f"Expected 401/403, got {response.status_code}")
        
    except Exception as e:
        log_test("Auth - GET /me without token", False, f"Exception: {str(e)}")


def test_users_list():
    """Test 7: GET /api/users with admin token"""
    if not admin_token:
        log_test("Users - GET /users", False, "No admin token available")
        return
    
    try:
        response = requests.get(
            f"{BASE_URL}/users",
            headers={"Authorization": f"Bearer {admin_token}"},
            timeout=10
        )
        
        if response.status_code != 200:
            log_test("Users - GET /users", False, f"Status {response.status_code}: {response.text}")
            return
        
        users = response.json()
        
        if not isinstance(users, list):
            log_test("Users - GET /users", False, "Response is not a list")
            return
        
        log_test("Users - GET /users", True, f"Retrieved {len(users)} users")
        
    except Exception as e:
        log_test("Users - GET /users", False, f"Exception: {str(e)}")


def test_users_pending():
    """Test 8: GET /api/users/pending with admin token"""
    if not admin_token:
        log_test("Users - GET /users/pending", False, "No admin token available")
        return
    
    try:
        response = requests.get(
            f"{BASE_URL}/users/pending",
            headers={"Authorization": f"Bearer {admin_token}"},
            timeout=10
        )
        
        if response.status_code != 200:
            log_test("Users - GET /users/pending", False, f"Status {response.status_code}: {response.text}")
            return
        
        pending = response.json()
        
        if not isinstance(pending, list):
            log_test("Users - GET /users/pending", False, "Response is not a list")
            return
        
        log_test("Users - GET /users/pending", True, f"Retrieved {len(pending)} pending users")
        
    except Exception as e:
        log_test("Users - GET /users/pending", False, f"Exception: {str(e)}")


def test_users_approve():
    """Test 9: POST /api/users/{id}/approve with admin token"""
    if not admin_token or not pending_user:
        log_test("Users - Approve pending user", False, "No admin token or pending user available")
        return
    
    try:
        user_id = pending_user.get("id")
        response = requests.post(
            f"{BASE_URL}/users/{user_id}/approve",
            headers={"Authorization": f"Bearer {admin_token}"},
            timeout=10
        )
        
        if response.status_code != 200:
            log_test("Users - Approve pending user", False, f"Status {response.status_code}: {response.text}")
            return
        
        data = response.json()
        
        if not data.get("ok"):
            log_test("Users - Approve pending user", False, "Response ok=false")
            return
        
        log_test("Users - Approve pending user", True, f"User {user_id} approved")
        
        # Update token for approved user
        global regular_user_token, regular_user
        regular_user_token = pending_user_token
        regular_user = pending_user
        
    except Exception as e:
        log_test("Users - Approve pending user", False, f"Exception: {str(e)}")


def test_users_approve_non_admin():
    """Test 10: Non-admin trying to approve (should return 403)"""
    if not regular_user_token or not pending_user:
        log_test("Users - Non-admin approve attempt", False, "No regular user token available")
        return
    
    try:
        # Create another pending user first
        response = requests.post(
            f"{BASE_URL}/auth/login",
            json={"name": "مستخدم آخر", "militaryNumber": "88888"},
            timeout=10
        )
        
        if response.status_code != 200:
            log_test("Users - Non-admin approve attempt", False, "Failed to create test user")
            return
        
        test_user = response.json()["user"]
        
        # Try to approve with non-admin token
        response = requests.post(
            f"{BASE_URL}/users/{test_user['id']}/approve",
            headers={"Authorization": f"Bearer {regular_user_token}"},
            timeout=10
        )
        
        if response.status_code == 403:
            log_test("Users - Non-admin approve attempt", True, "Correctly returned 403")
        else:
            log_test("Users - Non-admin approve attempt", False, f"Expected 403, got {response.status_code}")
        
    except Exception as e:
        log_test("Users - Non-admin approve attempt", False, f"Exception: {str(e)}")


def test_violations_list():
    """Test 11: GET /api/violations"""
    if not admin_token:
        log_test("Violations - GET list", False, "No admin token available")
        return
    
    try:
        response = requests.get(
            f"{BASE_URL}/violations",
            headers={"Authorization": f"Bearer {admin_token}"},
            timeout=10
        )
        
        if response.status_code != 200:
            log_test("Violations - GET list", False, f"Status {response.status_code}: {response.text}")
            return
        
        violations = response.json()
        
        if not isinstance(violations, list):
            log_test("Violations - GET list", False, "Response is not a list")
            return
        
        log_test("Violations - GET list", True, f"Retrieved {len(violations)} violations")
        
    except Exception as e:
        log_test("Violations - GET list", False, f"Exception: {str(e)}")


def test_violations_create():
    """Test 12: POST /api/violations"""
    if not admin_token or not admin_user:
        log_test("Violations - POST create", False, "No admin token available")
        return
    
    try:
        # Use admin's own ID as soldierId
        response = requests.post(
            f"{BASE_URL}/violations",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={
                "soldierId": admin_user["id"],
                "type": "تأخر عن الدوام",
                "severity": "بسيطة",
                "description": "اختبار تسجيل مخالفة"
            },
            timeout=10
        )
        
        if response.status_code != 200:
            log_test("Violations - POST create", False, f"Status {response.status_code}: {response.text}")
            return
        
        violation = response.json()
        
        if violation.get("status") != "مفتوحة":
            log_test("Violations - POST create", False, f"Expected status=مفتوحة, got {violation.get('status')}")
            return
        
        log_test("Violations - POST create", True, f"Violation created with id={violation.get('id')}")
        
        # Store for update test
        global test_violation_id
        test_violation_id = violation.get("id")
        
    except Exception as e:
        log_test("Violations - POST create", False, f"Exception: {str(e)}")


def test_violations_update():
    """Test 13: PATCH /api/violations/{vid}"""
    if not admin_token:
        log_test("Violations - PATCH update status", False, "No admin token available")
        return
    
    if 'test_violation_id' not in globals():
        log_test("Violations - PATCH update status", False, "No test violation available")
        return
    
    try:
        response = requests.patch(
            f"{BASE_URL}/violations/{test_violation_id}",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={"status": "مغلقة"},
            timeout=10
        )
        
        if response.status_code != 200:
            log_test("Violations - PATCH update status", False, f"Status {response.status_code}: {response.text}")
            return
        
        data = response.json()
        
        if not data.get("ok"):
            log_test("Violations - PATCH update status", False, "Response ok=false")
            return
        
        log_test("Violations - PATCH update status", True, "Violation status updated to مغلقة")
        
    except Exception as e:
        log_test("Violations - PATCH update status", False, f"Exception: {str(e)}")


def test_requests_list_user():
    """Test 14: GET /api/requests as regular user (own requests only)"""
    if not regular_user_token:
        log_test("Requests - GET as user", False, "No regular user token available")
        return
    
    try:
        response = requests.get(
            f"{BASE_URL}/requests",
            headers={"Authorization": f"Bearer {regular_user_token}"},
            timeout=10
        )
        
        if response.status_code != 200:
            log_test("Requests - GET as user", False, f"Status {response.status_code}: {response.text}")
            return
        
        requests_list = response.json()
        
        if not isinstance(requests_list, list):
            log_test("Requests - GET as user", False, "Response is not a list")
            return
        
        log_test("Requests - GET as user", True, f"Retrieved {len(requests_list)} requests")
        
    except Exception as e:
        log_test("Requests - GET as user", False, f"Exception: {str(e)}")


def test_requests_list_admin():
    """Test 15: GET /api/requests as admin (all requests)"""
    if not admin_token:
        log_test("Requests - GET as admin", False, "No admin token available")
        return
    
    try:
        response = requests.get(
            f"{BASE_URL}/requests",
            headers={"Authorization": f"Bearer {admin_token}"},
            timeout=10
        )
        
        if response.status_code != 200:
            log_test("Requests - GET as admin", False, f"Status {response.status_code}: {response.text}")
            return
        
        requests_list = response.json()
        
        if not isinstance(requests_list, list):
            log_test("Requests - GET as admin", False, "Response is not a list")
            return
        
        log_test("Requests - GET as admin", True, f"Retrieved {len(requests_list)} requests")
        
    except Exception as e:
        log_test("Requests - GET as admin", False, f"Exception: {str(e)}")


def test_requests_create():
    """Test 16: POST /api/requests"""
    if not regular_user_token:
        log_test("Requests - POST create", False, "No regular user token available")
        return
    
    try:
        response = requests.post(
            f"{BASE_URL}/requests",
            headers={"Authorization": f"Bearer {regular_user_token}"},
            json={
                "type": "إجازة",
                "details": "طلب إجازة لمدة 3 أيام"
            },
            timeout=10
        )
        
        if response.status_code != 200:
            log_test("Requests - POST create", False, f"Status {response.status_code}: {response.text}")
            return
        
        request_obj = response.json()
        
        if request_obj.get("status") != "قيد المراجعة":
            log_test("Requests - POST create", False, f"Expected status=قيد المراجعة, got {request_obj.get('status')}")
            return
        
        log_test("Requests - POST create", True, f"Request created with id={request_obj.get('id')}")
        
        # Store for update test
        global test_request_id
        test_request_id = request_obj.get("id")
        
    except Exception as e:
        log_test("Requests - POST create", False, f"Exception: {str(e)}")


def test_requests_update():
    """Test 17: PATCH /api/requests/{rid} as admin"""
    if not admin_token:
        log_test("Requests - PATCH update status", False, "No admin token available")
        return
    
    if 'test_request_id' not in globals():
        log_test("Requests - PATCH update status", False, "No test request available")
        return
    
    try:
        response = requests.patch(
            f"{BASE_URL}/requests/{test_request_id}",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={"status": "موافق"},
            timeout=10
        )
        
        if response.status_code != 200:
            log_test("Requests - PATCH update status", False, f"Status {response.status_code}: {response.text}")
            return
        
        data = response.json()
        
        if not data.get("ok"):
            log_test("Requests - PATCH update status", False, "Response ok=false")
            return
        
        log_test("Requests - PATCH update status", True, "Request status updated to موافق")
        
    except Exception as e:
        log_test("Requests - PATCH update status", False, f"Exception: {str(e)}")


def test_reports_list():
    """Test 18: GET /api/reports"""
    if not admin_token:
        log_test("Reports - GET list", False, "No admin token available")
        return
    
    try:
        response = requests.get(
            f"{BASE_URL}/reports",
            headers={"Authorization": f"Bearer {admin_token}"},
            timeout=10
        )
        
        if response.status_code != 200:
            log_test("Reports - GET list", False, f"Status {response.status_code}: {response.text}")
            return
        
        reports = response.json()
        
        if not isinstance(reports, list):
            log_test("Reports - GET list", False, "Response is not a list")
            return
        
        log_test("Reports - GET list", True, f"Retrieved {len(reports)} reports")
        
    except Exception as e:
        log_test("Reports - GET list", False, f"Exception: {str(e)}")


def test_reports_create():
    """Test 19: POST /api/reports"""
    if not admin_token:
        log_test("Reports - POST create", False, "No admin token available")
        return
    
    try:
        response = requests.post(
            f"{BASE_URL}/reports",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={
                "title": "تقرير اختبار",
                "type": "دورية"
            },
            timeout=10
        )
        
        if response.status_code != 200:
            log_test("Reports - POST create", False, f"Status {response.status_code}: {response.text}")
            return
        
        report = response.json()
        
        if not report.get("id"):
            log_test("Reports - POST create", False, "No id in response")
            return
        
        log_test("Reports - POST create", True, f"Report created with id={report.get('id')}")
        
    except Exception as e:
        log_test("Reports - POST create", False, f"Exception: {str(e)}")


def test_operations_list():
    """Test 20: GET /api/operations"""
    if not admin_token:
        log_test("Operations - GET list", False, "No admin token available")
        return
    
    try:
        response = requests.get(
            f"{BASE_URL}/operations",
            headers={"Authorization": f"Bearer {admin_token}"},
            timeout=10
        )
        
        if response.status_code != 200:
            log_test("Operations - GET list", False, f"Status {response.status_code}: {response.text}")
            return
        
        operations = response.json()
        
        if not isinstance(operations, list):
            log_test("Operations - GET list", False, "Response is not a list")
            return
        
        log_test("Operations - GET list", True, f"Retrieved {len(operations)} operations")
        
    except Exception as e:
        log_test("Operations - GET list", False, f"Exception: {str(e)}")


def test_operations_create():
    """Test 21: POST /api/operations as admin"""
    if not admin_token:
        log_test("Operations - POST create", False, "No admin token available")
        return
    
    try:
        response = requests.post(
            f"{BASE_URL}/operations",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={
                "name": "عملية اختبار",
                "type": "دورية",
                "location": "القطاع الشرقي",
                "team": 10,
                "status": "مجدولة"
            },
            timeout=10
        )
        
        if response.status_code != 200:
            log_test("Operations - POST create", False, f"Status {response.status_code}: {response.text}")
            return
        
        operation = response.json()
        
        if not operation.get("id"):
            log_test("Operations - POST create", False, "No id in response")
            return
        
        log_test("Operations - POST create", True, f"Operation created with id={operation.get('id')}")
        
    except Exception as e:
        log_test("Operations - POST create", False, f"Exception: {str(e)}")


def test_attendance_checkin():
    """Test 22: POST /api/attendance/checkin"""
    if not regular_user_token:
        log_test("Attendance - POST checkin", False, "No regular user token available")
        return
    
    try:
        response = requests.post(
            f"{BASE_URL}/attendance/checkin",
            headers={"Authorization": f"Bearer {regular_user_token}"},
            timeout=10
        )
        
        if response.status_code != 200:
            log_test("Attendance - POST checkin", False, f"Status {response.status_code}: {response.text}")
            return
        
        data = response.json()
        
        if not data.get("ok") and "تم تسجيل الحضور سابقاً" not in data.get("message", ""):
            log_test("Attendance - POST checkin", False, f"Unexpected response: {data}")
            return
        
        log_test("Attendance - POST checkin", True, f"Checkin recorded: {data.get('checkIn', 'already checked in')}")
        
    except Exception as e:
        log_test("Attendance - POST checkin", False, f"Exception: {str(e)}")


def test_attendance_checkin_duplicate():
    """Test 23: POST /api/attendance/checkin again (should return ok=false)"""
    if not regular_user_token:
        log_test("Attendance - Duplicate checkin", False, "No regular user token available")
        return
    
    try:
        response = requests.post(
            f"{BASE_URL}/attendance/checkin",
            headers={"Authorization": f"Bearer {regular_user_token}"},
            timeout=10
        )
        
        if response.status_code != 200:
            log_test("Attendance - Duplicate checkin", False, f"Status {response.status_code}: {response.text}")
            return
        
        data = response.json()
        
        if data.get("ok") == False and "تم تسجيل الحضور سابقاً" in data.get("message", ""):
            log_test("Attendance - Duplicate checkin", True, "Correctly prevented duplicate checkin")
        else:
            log_test("Attendance - Duplicate checkin", False, f"Expected ok=false with message, got {data}")
        
    except Exception as e:
        log_test("Attendance - Duplicate checkin", False, f"Exception: {str(e)}")


def test_attendance_checkout():
    """Test 24: POST /api/attendance/checkout"""
    if not regular_user_token:
        log_test("Attendance - POST checkout", False, "No regular user token available")
        return
    
    try:
        response = requests.post(
            f"{BASE_URL}/attendance/checkout",
            headers={"Authorization": f"Bearer {regular_user_token}"},
            timeout=10
        )
        
        if response.status_code != 200:
            log_test("Attendance - POST checkout", False, f"Status {response.status_code}: {response.text}")
            return
        
        data = response.json()
        
        if not data.get("ok"):
            log_test("Attendance - POST checkout", False, f"Response ok=false: {data}")
            return
        
        log_test("Attendance - POST checkout", True, f"Checkout recorded: {data.get('checkOut')}")
        
    except Exception as e:
        log_test("Attendance - POST checkout", False, f"Exception: {str(e)}")


def test_attendance_today():
    """Test 25: GET /api/attendance/today"""
    if not regular_user_token:
        log_test("Attendance - GET today", False, "No regular user token available")
        return
    
    try:
        response = requests.get(
            f"{BASE_URL}/attendance/today",
            headers={"Authorization": f"Bearer {regular_user_token}"},
            timeout=10
        )
        
        if response.status_code != 200:
            log_test("Attendance - GET today", False, f"Status {response.status_code}: {response.text}")
            return
        
        data = response.json()
        
        if "mine" not in data:
            log_test("Attendance - GET today", False, "Missing 'mine' in response")
            return
        
        log_test("Attendance - GET today", True, f"Today's attendance retrieved")
        
    except Exception as e:
        log_test("Attendance - GET today", False, f"Exception: {str(e)}")


def test_attendance_history():
    """Test 26: GET /api/attendance/history"""
    if not admin_token:
        log_test("Attendance - GET history", False, "No admin token available")
        return
    
    try:
        response = requests.get(
            f"{BASE_URL}/attendance/history",
            headers={"Authorization": f"Bearer {admin_token}"},
            timeout=10
        )
        
        if response.status_code != 200:
            log_test("Attendance - GET history", False, f"Status {response.status_code}: {response.text}")
            return
        
        history = response.json()
        
        if not isinstance(history, list):
            log_test("Attendance - GET history", False, "Response is not a list")
            return
        
        log_test("Attendance - GET history", True, f"Retrieved {len(history)} days of history")
        
    except Exception as e:
        log_test("Attendance - GET history", False, f"Exception: {str(e)}")


def test_stats_dashboard():
    """Test 27: GET /api/stats/dashboard"""
    if not admin_token:
        log_test("Stats - GET dashboard", False, "No admin token available")
        return
    
    try:
        response = requests.get(
            f"{BASE_URL}/stats/dashboard",
            headers={"Authorization": f"Bearer {admin_token}"},
            timeout=10
        )
        
        if response.status_code != 200:
            log_test("Stats - GET dashboard", False, f"Status {response.status_code}: {response.text}")
            return
        
        stats = response.json()
        
        required_fields = ["totalMembers", "presentToday", "activeOperations", "pendingRequests"]
        missing = [f for f in required_fields if f not in stats]
        
        if missing:
            log_test("Stats - GET dashboard", False, f"Missing fields: {missing}")
            return
        
        log_test("Stats - GET dashboard", True, f"Stats retrieved: {len(stats)} fields")
        
    except Exception as e:
        log_test("Stats - GET dashboard", False, f"Exception: {str(e)}")


def test_promotions_list():
    """Test 28: GET /api/promotions"""
    if not admin_token:
        log_test("Promotions - GET list", False, "No admin token available")
        return
    
    try:
        response = requests.get(
            f"{BASE_URL}/promotions",
            headers={"Authorization": f"Bearer {admin_token}"},
            timeout=10
        )
        
        if response.status_code != 200:
            log_test("Promotions - GET list", False, f"Status {response.status_code}: {response.text}")
            return
        
        promotions = response.json()
        
        if not isinstance(promotions, list):
            log_test("Promotions - GET list", False, "Response is not a list")
            return
        
        log_test("Promotions - GET list", True, f"Retrieved {len(promotions)} promotions")
        
    except Exception as e:
        log_test("Promotions - GET list", False, f"Exception: {str(e)}")


def test_medals_list():
    """Test 29: GET /api/medals"""
    if not admin_token:
        log_test("Medals - GET list", False, "No admin token available")
        return
    
    try:
        response = requests.get(
            f"{BASE_URL}/medals",
            headers={"Authorization": f"Bearer {admin_token}"},
            timeout=10
        )
        
        if response.status_code != 200:
            log_test("Medals - GET list", False, f"Status {response.status_code}: {response.text}")
            return
        
        medals = response.json()
        
        if not isinstance(medals, list):
            log_test("Medals - GET list", False, "Response is not a list")
            return
        
        log_test("Medals - GET list", True, f"Retrieved {len(medals)} medals")
        
    except Exception as e:
        log_test("Medals - GET list", False, f"Exception: {str(e)}")


def test_support_ticket():
    """Test 30: POST /api/support/ticket"""
    if not regular_user_token:
        log_test("Support - POST ticket", False, "No regular user token available")
        return
    
    try:
        response = requests.post(
            f"{BASE_URL}/support/ticket",
            headers={"Authorization": f"Bearer {regular_user_token}"},
            json={
                "kind": "استفسار",
                "subject": "سؤال عن النظام",
                "message": "كيف يمكنني تحديث بياناتي الشخصية؟"
            },
            timeout=10
        )
        
        if response.status_code != 200:
            log_test("Support - POST ticket", False, f"Status {response.status_code}: {response.text}")
            return
        
        ticket = response.json()
        
        if not ticket.get("id"):
            log_test("Support - POST ticket", False, "No id in response")
            return
        
        log_test("Support - POST ticket", True, f"Ticket created with id={ticket.get('id')}")
        
    except Exception as e:
        log_test("Support - POST ticket", False, f"Exception: {str(e)}")


def print_summary():
    """Print test summary"""
    print("\n" + "="*80)
    print("TEST SUMMARY")
    print("="*80)
    print(f"Total tests: {test_results['total']}")
    print(f"Passed: {len(test_results['passed'])} ✅")
    print(f"Failed: {len(test_results['failed'])} ❌")
    print(f"Success rate: {len(test_results['passed'])/test_results['total']*100:.1f}%")
    
    if test_results['failed']:
        print("\n❌ FAILED TESTS:")
        for test in test_results['failed']:
            print(f"  - {test}")
    
    print("="*80)


def main():
    """Run all tests"""
    print("="*80)
    print("LIWA HAMAD SECURITY GATE - BACKEND API TESTS")
    print(f"Testing: {BASE_URL}")
    print("="*80 + "\n")
    
    # Auth tests (HIGH PRIORITY)
    print("🔐 AUTH TESTS")
    test_auth_login_existing_admin()
    test_auth_login_new_user()
    test_auth_login_instant_admin()
    test_auth_login_missing_fields()
    test_auth_me_with_token()
    test_auth_me_without_token()
    
    # Users management (HIGH PRIORITY)
    print("\n👥 USERS MANAGEMENT TESTS")
    test_users_list()
    test_users_pending()
    test_users_approve()
    test_users_approve_non_admin()
    
    # Violations (MEDIUM PRIORITY)
    print("\n⚠️ VIOLATIONS TESTS")
    test_violations_list()
    test_violations_create()
    test_violations_update()
    
    # Requests (MEDIUM PRIORITY)
    print("\n📝 REQUESTS TESTS")
    test_requests_list_user()
    test_requests_list_admin()
    test_requests_create()
    test_requests_update()
    
    # Reports (MEDIUM PRIORITY)
    print("\n📄 REPORTS TESTS")
    test_reports_list()
    test_reports_create()
    
    # Operations (MEDIUM PRIORITY)
    print("\n🎯 OPERATIONS TESTS")
    test_operations_list()
    test_operations_create()
    
    # Attendance (MEDIUM PRIORITY)
    print("\n📅 ATTENDANCE TESTS")
    test_attendance_checkin()
    test_attendance_checkin_duplicate()
    test_attendance_checkout()
    test_attendance_today()
    test_attendance_history()
    
    # Stats (MEDIUM PRIORITY)
    print("\n📊 STATS TESTS")
    test_stats_dashboard()
    
    # Promotions & Medals (LOW PRIORITY)
    print("\n🏅 PROMOTIONS & MEDALS TESTS")
    test_promotions_list()
    test_medals_list()
    
    # Support (LOW PRIORITY)
    print("\n💬 SUPPORT TESTS")
    test_support_ticket()
    
    # Print summary
    print_summary()


if __name__ == "__main__":
    main()
