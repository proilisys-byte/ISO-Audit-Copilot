/**
 * PRO ALI SMART Audit Copilot — Google Apps Script Backend
 * =========================================================
 * 이 코드를 Google Apps Script 편집기에 붙여넣고 Web App으로 배포하세요.
 * 
 * 설정 방법:
 * 1. Google Drive에서 새 Google Sheet를 생성합니다.
 * 2. 아래 시트를 생성합니다: Users, Sessions, Audits, NCReports, CAPA, RiskAssessments, ReferenceLinks, ExpertKnowledge
 * 3. 확장 프로그램 > Apps Script를 클릭합니다.
 * 4. 이 코드를 붙여넣습니다.
 * 5. SPREADSHEET_ID를 실제 Google Sheet ID로 변경합니다.
 * 6. 배포 > 새 배포 > 웹 앱으로 배포합니다.
 *    - 실행 주체: 본인
 *    - 액세스 권한: 모든 사용자
 * 7. 생성된 URL을 프론트엔드 API_BASE_URL에 설정합니다.
 */

// ═══ CONFIGURATION ═══
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE'; // ← Google Sheet ID 입력

function getSheet(name) {
  return SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(name);
}

// ═══ WEB APP ENTRY POINTS ═══

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  const action = e.parameter.action;
  let result;

  try {
    switch (action) {
      case 'register':
        result = registerUser(JSON.parse(e.postData.contents));
        break;
      case 'login':
        result = loginUser(JSON.parse(e.postData.contents));
        break;
      case 'getUser':
        result = getUser(e.parameter.token);
        break;
      case 'createAudit':
        result = createAudit(JSON.parse(e.postData.contents));
        break;
      case 'getAudits':
        result = getAudits(e.parameter.token);
        break;
      case 'createNC':
        result = createNC(JSON.parse(e.postData.contents));
        break;
      case 'createCAPA':
        result = createCAPA(JSON.parse(e.postData.contents));
        break;
      case 'saveRisk':
        result = saveRisk(JSON.parse(e.postData.contents));
        break;
      case 'getLinks':
        result = getLinks();
        break;
      case 'saveLink':
        result = saveLink(JSON.parse(e.postData.contents));
        break;
      case 'saveKnowledge':
        result = saveKnowledge(JSON.parse(e.postData.contents));
        break;
      case 'getKnowledge':
        result = getKnowledge(e.parameter.category);
        break;
      default:
        result = { success: false, message: 'Unknown action: ' + action };
    }
  } catch (err) {
    result = { success: false, message: err.message };
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// ═══ USER MANAGEMENT ═══

function registerUser(data) {
  const sheet = getSheet('Users');
  const users = getSheetData(sheet);

  // 이메일 중복 체크
  if (users.find(u => u.email === data.email)) {
    return { success: false, message: '이미 등록된 이메일입니다.' };
  }

  const id = 'user-' + Date.now();
  sheet.appendRow([
    id,
    data.email,
    data.name,
    data.password_hash,
    data.role || 'auditor',
    data.plan || 'free',
    data.org || '',
    new Date().toISOString()
  ]);

  return { success: true, message: '회원가입이 완료되었습니다.', userId: id };
}

function loginUser(data) {
  const sheet = getSheet('Users');
  const users = getSheetData(sheet);
  const user = users.find(u => u.email === data.email && u.password_hash === data.password_hash);

  if (!user) {
    return { success: false, message: '이메일 또는 비밀번호가 올바르지 않습니다.' };
  }

  // 세션 토큰 생성
  const token = Utilities.getUuid();
  const sessionSheet = getSheet('Sessions');
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7일 유효

  sessionSheet.appendRow([
    token,
    user.id,
    new Date().toISOString(),
    expiresAt.toISOString()
  ]);

  return {
    success: true,
    token: token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      plan: user.plan,
      org: user.org
    }
  };
}

function getUser(token) {
  const sessionSheet = getSheet('Sessions');
  const sessions = getSheetData(sessionSheet);
  const session = sessions.find(s => s.token === token);

  if (!session || new Date(session.expires_at) < new Date()) {
    return { success: false, message: '세션이 만료되었습니다.' };
  }

  const userSheet = getSheet('Users');
  const users = getSheetData(userSheet);
  const user = users.find(u => u.id === session.user_id);

  if (!user) {
    return { success: false, message: '사용자를 찾을 수 없습니다.' };
  }

  return {
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      plan: user.plan,
      org: user.org
    }
  };
}

// ═══ AUDIT MANAGEMENT ═══

function createAudit(data) {
  const sheet = getSheet('Audits');
  const id = 'audit-' + Date.now();

  sheet.appendRow([
    id,
    data.user_id,
    data.standard,
    data.scope,
    data.audit_type || 'internal',
    data.status || 'planned',
    data.start_date || '',
    data.end_date || '',
    new Date().toISOString()
  ]);

  return { success: true, auditId: id };
}

function getAudits(token) {
  const user = getUser(token);
  if (!user.success) return user;

  const sheet = getSheet('Audits');
  const audits = getSheetData(sheet).filter(a => a.user_id === user.user.id);

  return { success: true, audits };
}

// ═══ NONCONFORMITY ═══

function createNC(data) {
  const sheet = getSheet('NCReports');
  const id = 'nc-' + Date.now();

  sheet.appendRow([
    id,
    data.audit_id,
    data.type, // Major, Minor, OFI
    data.clause,
    data.requirement,
    data.evidence,
    data.statement,
    new Date().toISOString()
  ]);

  return { success: true, ncId: id };
}

// ═══ CAPA ═══

function createCAPA(data) {
  const sheet = getSheet('CAPA');
  const id = 'capa-' + Date.now();

  sheet.appendRow([
    id,
    data.nc_id,
    data.root_cause,
    data.analysis_method, // 5Why, Fishbone, FTA
    data.corrective_action,
    data.responsible,
    data.status || 'open',
    data.due_date || '',
    new Date().toISOString()
  ]);

  return { success: true, capaId: id };
}

// ═══ RISK ASSESSMENT ═══

function saveRisk(data) {
  const sheet = getSheet('RiskAssessments');
  const id = 'risk-' + Date.now();

  const rpn = (data.severity || 1) * (data.occurrence || 1) * (data.detection || 1);

  sheet.appendRow([
    id,
    data.audit_id,
    data.process,
    data.failure_mode,
    data.severity || 1,
    data.occurrence || 1,
    data.detection || 1,
    rpn,
    new Date().toISOString()
  ]);

  return { success: true, riskId: id, rpn };
}

// ═══ REFERENCE LINKS ═══

function getLinks() {
  const sheet = getSheet('ReferenceLinks');
  const links = getSheetData(sheet);
  return { success: true, links };
}

function saveLink(data) {
  const sheet = getSheet('ReferenceLinks');
  const id = 'link-' + Date.now();

  sheet.appendRow([
    id,
    data.category,
    data.title,
    data.url,
    data.description || '',
    new Date().toISOString()
  ]);

  return { success: true, linkId: id };
}

// ═══ EXPERT KNOWLEDGE ═══

function saveKnowledge(data) {
  const sheet = getSheet('ExpertKnowledge');
  const id = 'know-' + Date.now();

  sheet.appendRow([
    id,
    data.category,
    data.title,
    data.content,
    data.author || '',
    data.tags || '',
    new Date().toISOString()
  ]);

  return { success: true, knowledgeId: id };
}

function getKnowledge(category) {
  const sheet = getSheet('ExpertKnowledge');
  let items = getSheetData(sheet);

  if (category) {
    items = items.filter(item => item.category === category);
  }

  return { success: true, items };
}

// ═══ UTILITY FUNCTIONS ═══

function getSheetData(sheet) {
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];

  const headers = data[0].map(h => h.toString().toLowerCase().replace(/\s+/g, '_'));
  return data.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = row[i]; });
    return obj;
  });
}

// ═══ INITIAL SETUP ═══
// 이 함수를 한 번 실행하여 시트 헤더를 초기화하세요.

function setupSheets() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  const sheets = {
    'Users': ['id', 'email', 'name', 'password_hash', 'role', 'plan', 'org', 'created_at'],
    'Sessions': ['token', 'user_id', 'created_at', 'expires_at'],
    'Audits': ['id', 'user_id', 'standard', 'scope', 'audit_type', 'status', 'start_date', 'end_date', 'created_at'],
    'NCReports': ['id', 'audit_id', 'type', 'clause', 'requirement', 'evidence', 'statement', 'created_at'],
    'CAPA': ['id', 'nc_id', 'root_cause', 'analysis_method', 'corrective_action', 'responsible', 'status', 'due_date', 'created_at'],
    'RiskAssessments': ['id', 'audit_id', 'process', 'failure_mode', 'severity', 'occurrence', 'detection', 'rpn', 'created_at'],
    'ReferenceLinks': ['id', 'category', 'title', 'url', 'description', 'created_at'],
    'ExpertKnowledge': ['id', 'category', 'title', 'content', 'author', 'tags', 'created_at']
  };

  Object.entries(sheets).forEach(([name, headers]) => {
    let sheet = ss.getSheetByName(name);
    if (!sheet) {
      sheet = ss.insertSheet(name);
    }
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  });

  Logger.log('All sheets initialized successfully.');
}
