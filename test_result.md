#====================================================================================================
# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

# THIS SECTION CONTAINS CRITICAL TESTING INSTRUCTIONS FOR BOTH AGENTS
# BOTH MAIN_AGENT AND TESTING_AGENT MUST PRESERVE THIS ENTIRE BLOCK

# Communication Protocol:
# If the `testing_agent` is available, main agent should delegate all testing tasks to it.
#
# You have access to a file called `test_result.md`. This file contains the complete testing state
# and history, and is the primary means of communication between main and the testing agent.
#
# Main and testing agents must follow this exact format to maintain testing data. 
# The testing data must be entered in yaml format Below is the data structure:
# 
## user_problem_statement: {problem_statement}
## backend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.py"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## frontend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.js"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## metadata:
##   created_by: "main_agent"
##   version: "1.0"
##   test_sequence: 0
##   run_ui: false
##
## test_plan:
##   current_focus:
##     - "Task name 1"
##     - "Task name 2"
##   stuck_tasks:
##     - "Task name with persistent issues"
##   test_all: false
##   test_priority: "high_first"  # or "sequential" or "stuck_first"
##
## agent_communication:
##     -agent: "main"  # or "testing" or "user"
##     -message: "Communication message between agents"

# Protocol Guidelines for Main agent
#
# 1. Update Test Result File Before Testing:
#    - Main agent must always update the `test_result.md` file before calling the testing agent
#    - Add implementation details to the status_history
#    - Set `needs_retesting` to true for tasks that need testing
#    - Update the `test_plan` section to guide testing priorities
#    - Add a message to `agent_communication` explaining what you've done
#
# 2. Incorporate User Feedback:
#    - When a user provides feedback that something is or isn't working, add this information to the relevant task's status_history
#    - Update the working status based on user feedback
#    - If a user reports an issue with a task that was marked as working, increment the stuck_count
#    - Whenever user reports issue in the app, if we have testing agent and task_result.md file so find the appropriate task for that and append in status_history of that task to contain the user concern and problem as well 
#
# 3. Track Stuck Tasks:
#    - Monitor which tasks have high stuck_count values or where you are fixing same issue again and again, analyze that when you read task_result.md
#    - For persistent issues, use websearch tool to find solutions
#    - Pay special attention to tasks in the stuck_tasks list
#    - When you fix an issue with a stuck task, don't reset the stuck_count until the testing agent confirms it's working
#
# 4. Provide Context to Testing Agent:
#    - When calling the testing agent, provide clear instructions about:
#      - Which tasks need testing (reference the test_plan)
#      - Any authentication details or configuration needed
#      - Specific test scenarios to focus on
#      - Any known issues or edge cases to verify
#
# 5. Call the testing agent with specific instructions referring to test_result.md
#
# IMPORTANT: Main agent must ALWAYS update test_result.md BEFORE calling the testing agent, as it relies on this file to understand what to test next.

#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================



#====================================================================================================
# Testing Data - Main Agent and testing sub agent both should log testing data below this section
#====================================================================================================

user_problem_statement: |
  بناء بوابة "فريق أمن ملك الطارة" الإلكترونية - منصة عسكرية/أمنية بألوان أحمر وأزرق.
  Backend with JWT auth, smart login (register if new with pending status), admin approval (12345 admin, 00000 new admin shortcut),
  MongoDB collections for: users, announcements, violations, requests, reports, operations, attendance, promotions, medals, support_tickets.
  All endpoints under /api prefix.

backend:
  - task: "Auth - smart login & JWT"
    implemented: true
    working: true
    file: "backend/server.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
        - working: "NA"
          agent: "main"
          comment: "POST /api/auth/login accepts {name, militaryNumber}. If user exists, login. Otherwise create new (status=pending). militaryNumber=00000 creates admin. Returns access_token. Also seeded admin with militaryNumber=12345."
        - working: true
          agent: "testing"
          comment: "✅ All auth tests passed (6/6): Login with existing admin (12345) returns token with role=admin, status=active. Login with new militaryNumber (99999) creates pending user with status=pending, role=officer. Login with 00000 creates instant admin with role=admin, status=active. Missing fields correctly returns 422. All JWT token generation and validation working correctly."
  - task: "GET /api/auth/me with Bearer token"
    implemented: true
    working: true
    file: "backend/server.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
        - working: "NA"
          agent: "main"
          comment: "Returns current user from JWT."
        - working: true
          agent: "testing"
          comment: "✅ GET /api/auth/me working correctly: With valid Bearer token returns user object with correct data. Without token correctly returns 401 Unauthorized."
  - task: "Users management & admin approval"
    implemented: true
    working: true
    file: "backend/server.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
        - working: "NA"
          agent: "main"
          comment: "GET /api/users, /api/users/pending. POST /api/users/{id}/approve|reject (admin only)."
        - working: true
          agent: "testing"
          comment: "✅ All users management tests passed (4/4): GET /api/users returns list of all users (12 users). GET /api/users/pending returns only pending users (1 pending). POST /api/users/{id}/approve successfully approves pending user. Non-admin attempting to approve correctly returns 403 Forbidden."
  - task: "Announcements CRUD"
    implemented: true
    working: true
    file: "backend/server.py"
    stuck_count: 0
    priority: "medium"
    needs_retesting: false
    status_history:
        - working: "NA"
          agent: "main"
          comment: "GET list, POST create (admin only)."
        - working: true
          agent: "testing"
          comment: "✅ Announcements endpoints working (tested via seeded data). GET /api/announcements returns list. POST /api/announcements creates new announcement (admin only)."
  - task: "Violations CRUD"
    implemented: true
    working: true
    file: "backend/server.py"
    stuck_count: 0
    priority: "medium"
    needs_retesting: false
    status_history:
        - working: "NA"
          agent: "main"
          comment: "GET, POST (any active user), PATCH status."
        - working: true
          agent: "testing"
          comment: "✅ All violations tests passed (3/3): GET /api/violations returns list (2 violations). POST /api/violations creates new violation with status=مفتوحة. PATCH /api/violations/{vid} successfully updates status to مغلقة."
  - task: "Requests (leave, promotion, etc.)"
    implemented: true
    working: true
    file: "backend/server.py"
    stuck_count: 0
    priority: "medium"
    needs_retesting: false
    status_history:
        - working: "NA"
          agent: "main"
          comment: "GET (own for user, all for admin), POST, PATCH (admin approve/reject)."
        - working: true
          agent: "testing"
          comment: "✅ All requests tests passed (4/4): GET /api/requests as user returns own requests only. GET /api/requests as admin returns all requests. POST /api/requests creates request with status=قيد المراجعة. PATCH /api/requests/{rid} as admin successfully updates status to موافق."
  - task: "Reports CRUD"
    implemented: true
    working: true
    file: "backend/server.py"
    stuck_count: 0
    priority: "medium"
    needs_retesting: false
    status_history:
        - working: "NA"
          agent: "main"
          comment: "GET, POST."
        - working: true
          agent: "testing"
          comment: "✅ All reports tests passed (2/2): GET /api/reports returns list (2 reports). POST /api/reports creates new report with auto-generated id and date."
  - task: "Operations CRUD"
    implemented: true
    working: true
    file: "backend/server.py"
    stuck_count: 0
    priority: "medium"
    needs_retesting: false
    status_history:
        - working: "NA"
          agent: "main"
          comment: "GET, POST (admin)."
        - working: true
          agent: "testing"
          comment: "✅ All operations tests passed (2/2): GET /api/operations returns list (3 operations). POST /api/operations as admin creates new operation with all required fields."
  - task: "Attendance check-in/out + history"
    implemented: true
    working: true
    file: "backend/server.py"
    stuck_count: 0
    priority: "medium"
    needs_retesting: false
    status_history:
        - working: "NA"
          agent: "main"
          comment: "POST /attendance/checkin, /checkout. GET /today, /history aggregated 7 days."
        - working: true
          agent: "testing"
          comment: "✅ All attendance tests passed (5/5): POST /api/attendance/checkin records checkin with timestamp. Duplicate checkin correctly returns ok=false with message 'تم تسجيل الحضور سابقاً'. POST /api/attendance/checkout records checkout. GET /api/attendance/today returns mine object with today's attendance. GET /api/attendance/history returns aggregated 7-day history."
  - task: "Stats dashboard"
    implemented: true
    working: true
    file: "backend/server.py"
    stuck_count: 0
    priority: "medium"
    needs_retesting: false
    status_history:
        - working: "NA"
          agent: "main"
          comment: "GET /stats/dashboard returns aggregated counts."
        - working: true
          agent: "testing"
          comment: "✅ Stats dashboard test passed: GET /api/stats/dashboard returns all required fields (totalMembers, presentToday, activeOperations, pendingRequests, totalReports, activeViolations, pendingUsers, complianceRate, monthlyChange)."
  - task: "Promotions, Medals, Support ticket"
    implemented: true
    working: true
    file: "backend/server.py"
    stuck_count: 0
    priority: "low"
    needs_retesting: false
    status_history:
        - working: "NA"
          agent: "main"
          comment: "GET promotions, medals. POST support/ticket."
        - working: true
          agent: "testing"
          comment: "✅ All low-priority tests passed (3/3): GET /api/promotions returns list (3 promotions). GET /api/medals returns list (2 medals). POST /api/support/ticket creates support ticket with all required fields."

frontend:
  - task: "Login + Pending approval flow"
    implemented: true
    working: "NA"
    file: "frontend/src/components/LoginPage.jsx, PendingApproval.jsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
        - working: "NA"
          agent: "main"
          comment: "Hooked to /api/auth/login. Stores token. Pending users redirected to /pending which polls /me."

metadata:
  created_by: "main_agent"
  version: "1.0"
  test_sequence: 2
  run_ui: false

test_plan:
  current_focus: []
  stuck_tasks: []
  test_all: false
  test_priority: "high_first"

agent_communication:
    - agent: "main"
      message: |
        Backend ready with JWT auth, MongoDB models for all sections, seeded admin (militaryNumber=12345, name=أحمد محمد العتيبي).
        Special: militaryNumber=00000 instantly creates new admin. Any other militaryNumber creates pending user awaiting admin approval.
        Please test: 1) Login with existing admin (12345). 2) Login with new militaryNumber (e.g. 99999) → expect pending status. 3) Admin approves pending user.
        4) CRUD on violations, requests, reports, operations, announcements. 5) Attendance checkin/checkout/today/history. 6) /stats/dashboard.
    - agent: "testing"
      message: |
        ✅ BACKEND TESTING COMPLETE - ALL TESTS PASSED (30/30 - 100% SUCCESS RATE)
        
        Comprehensive testing completed on all backend endpoints at https://discourse-pro-5.preview.emergentagent.com/api
        
        HIGH PRIORITY (All Working):
        - Auth smart login & JWT: All scenarios tested (existing admin, new user → pending, instant admin with 00000, missing fields validation)
        - GET /api/auth/me: Token validation working correctly (with/without token)
        - Users management: List users, pending users, approve/reject with proper admin authorization
        
        MEDIUM PRIORITY (All Working):
        - Announcements: GET/POST working
        - Violations: Full CRUD tested (GET, POST, PATCH status)
        - Requests: User sees own, admin sees all, create and approve working
        - Reports: GET/POST working
        - Operations: GET/POST working (admin only)
        - Attendance: Checkin/checkout with duplicate prevention, today's record, 7-day history
        - Stats dashboard: All 9 fields returned correctly
        
        LOW PRIORITY (All Working):
        - Promotions: GET returns seeded data (3 items)
        - Medals: GET returns seeded data (2 items)
        - Support tickets: POST creates ticket successfully
        
        All endpoints properly secured with JWT Bearer token authentication. Role-based access control (admin vs officer) working correctly. Smart login logic functioning as designed (00000 → instant admin, new numbers → pending status). No critical issues found.
