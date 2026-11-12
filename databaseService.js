function getSpreadSheet(){
  return SpreadsheetApp.getActiveSheet();
}

function getCandidatesFromSheet() {
  if (!checkAccess()) {
    throw new Error("Acesso negado. Apenas usuários VIP podem acessar esta base.");
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Candidatos");
  
  if (!sheet) {
    sheet = ss.insertSheet("Candidatos");
    sheet.appendRow(["ID", "Nome", "Score", "Hard", "Soft", "Localização", "Email", "Telefone", "Pretensão", "Status", "Risco", "Perguntas"]);
    return [];
  }
  
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  
  var candidates = [];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    candidates.push({
      id: row[0],
      name: row[1],
      score: Number(row[2]),
      hard: Number(row[3]),
      soft: Number(row[4]),
      location: row[5],
      email: row[6],
      phone: row[7],
      pretension: row[8],
      status: row[9],
      risk: row[10],
      questions: row[11] ? JSON.parse(row[11]) : []
    });
  }
  return candidates;
}

function saveCandidatesToSheet(candidates) {
  if (!checkAccess()) {
    throw new Error("Acesso negado. Apenas usuários VIP podem alterar os dados.");
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Candidatos");
  
  if (!sheet) {
    sheet = ss.insertSheet("Candidatos");
  }
  
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, 12).clearContent();
  }
  
  if (!candidates || candidates.length === 0) return true;
  
  var rows = candidates.map(function(c) {
    return [
      c.id,
      c.name,
      c.score,
      c.hard,
      c.soft,
      c.location,
      c.email,
      c.phone,
      c.pretension,
      c.status,
      c.risk,
      JSON.stringify(c.questions || [])
    ];
  });
  
  sheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
  return true;
}

function getEmployeesFromSheet() {
  if (!checkAccess()) throw new Error("Acesso negado.");
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName("Colaboradores");
  if (!sheet) {
    sheet = ss.insertSheet("Colaboradores");
    sheet.appendRow(["ID", "Nome", "Cargo", "Departamento", "ManagerID", "Email"]);
    var defaultEmps = [
      ["emp_1", "Wendell Baresi", "Diretor de Operações (COO)", "Diretoria", "", "wendell@onecode.com"],
      ["emp_2", "Rodrigo Marques", "Gerente de R&S", "RH", "emp_1", "rodrigo@onecode.com"]
    ];
    sheet.getRange(2, 1, 2, 6).setValues(defaultEmps);
    return defaultEmps.map(r => ({ id: r[0], name: r[1], role: r[2], dept: r[3], manager_id: r[4], email: r[5] }));
  }
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  return data.slice(1).map(r => ({ id: r[0], name: r[1], role: r[2], dept: r[3], manager_id: r[4], email: r[5] }));
}

function saveEmployeesToSheet(employees) {
  if (!checkAccess()) throw new Error("Acesso negado.");
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName("Colaboradores") || ss.insertSheet("Colaboradores");
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) sheet.getRange(2, 1, lastRow - 1, 6).clearContent();
  if (!employees || employees.length === 0) return true;
  var rows = employees.map(e => [e.id, e.name, e.role, e.dept, e.manager_id || "", e.email]);
  sheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
  return true;
}

function getJobsFromSheet() {
  if (!checkAccess()) throw new Error("Acesso negado.");
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName("Vagas");
  if (!sheet) {
    sheet = ss.insertSheet("Vagas");
    sheet.appendRow(["ID", "Titulo", "Departamento", "Status", "Keywords"]);
    var defaultJobs = [
      ["cs_assistente", "Assistente de Relacionamento (CS)", "Atendimento", "Aberta", "crm, zendesk, nps, csat"],
      ["closer_vendas", "Closer (Executivo de Vendas)", "Vendas", "Aberta", "fechamento, b2b, negociacao"]
    ];
    sheet.getRange(2, 1, 2, 5).setValues(defaultJobs);
    return defaultJobs.map(r => ({ id: r[0], title: r[1], dept: r[2], status: r[3], keywords: r[4] }));
  }
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  return data.slice(1).map(r => ({ id: r[0], title: r[1], dept: r[2], status: r[3], keywords: r[4] }));
}

function saveJobsToSheet(jobs) {
  if (!checkAccess()) throw new Error("Acesso negado.");
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName("Vagas") || ss.insertSheet("Vagas");
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) sheet.getRange(2, 1, lastRow - 1, 5).clearContent();
  if (!jobs || jobs.length === 0) return true;
  var rows = jobs.map(j => [j.id, j.title, j.dept, j.status, j.keywords]);
  sheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
  return true;
}