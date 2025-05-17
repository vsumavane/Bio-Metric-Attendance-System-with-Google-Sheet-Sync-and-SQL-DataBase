#include <stdio.h>
#include <stdlib.h>
#include <SPI.h>
#include <FS.h>
#include "SPIFFS.h"
#include <WiFi.h>
#include <WebServer.h>
#include <ESPmDNS.h>
#include <Wire.h>
#include <HTTPClient.h>
#include "src/Adafruit_SSD1306/Adafruit_GFX.h"
#include "src/Adafruit_SSD1306/Adafruit_SSD1306.h"
#include "src/Adafruit_SSD1306/RTClib.h"
#include "src/Adafruit_Fingerprint_Sensor_Library/Adafruit_Fingerprint.h"
#include "src/esp32_arduino_sqlite3_lib/sqlite3.h"               //https://github.com/siara-cc/esp32_arduino_sqlite3_lib
#include "config/credits.h"
#include "config/robotbold10.h"
#include "config/seg.h"
#include "config/icons.h"
#include "config/secrets.h" // Create this file to store your secrets
#include <Arduino.h>
#include <ArduinoJson.h>
#include "mbedtls/base64.h"
#include "mbedtls/md.h"
RTC_DS1307 rtc;
char nameoftheday[7][12] = {"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"};
char month_name[12][12] = {"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"};
int day_, month_, year_, hour24_, hour12_, minute_, second_, dtw_;
uint8_t id;
WebServer server(80);
#define SCREEN_WIDTH 128 // OLED display width, in pixels
#define SCREEN_HEIGHT 64 // OLED display height, in pixels
#define OLED_RESET     -1 // Reset pin # (or -1 if sharing Arduino reset pin)
#define Buzzer 25 //Buzzer 
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);
HardwareSerial mySerial(2); //ESP32 Hardware Serial 2
Adafruit_Fingerprint finger = Adafruit_Fingerprint(&mySerial);
String mdnsdotlocalurl = "";

//Variables to save values from HTML form
String ssid_;
String pass_;
String ip_;
String gateway_;
String dispname_;
String wwwid_;
String wwwpass_;
String gsid_;
String mdns_;
String dhcpcheck;
String Empid, Sqid, Empname, EmpEmail, EmpPos, Empfid, sts7, sts8, sts9, sts10;
int SQLID = 0;
bool booting = false;

// File paths to save input values permanently
const char* ssidPath = "/ssid.txt";
const char* passPath = "/pass.txt";
const char* ipPath = "/ip.txt";
const char* gatewayPath = "/gateway.txt";
const char* dispnamePath = "/dispname.txt";
const char* wwwidPath = "/wwwid.txt";
const char* wwwpassPath = "/wwwpass.txt";
const char* gsidPath = "/gsid.txt";
const char* mdnsPath = "/mdns.txt";
const char* dhcpcheckPath = "/dhcpcheck.txt";
bool apmode = false;
IPAddress localIP(0, 0, 0, 0);
IPAddress gatewayIP(0, 0, 0, 0);
IPAddress subnetMask(255, 255, 255, 0);
uint8_t max_connections = 8; //Maximum Connection Limit for AP
sqlite3 *test1_db;
const char* data = "Callback function called";
char *zErrMsg = 0;
int openDb(const char *, sqlite3 **);
int db_exec(sqlite3 *, const char *);
int sqlreturn = 0;
static int callback(void *data, int argc, char **argv, char **azColName);
unsigned long lastwificheck = 0;

//Class declaration
void oledDisplayCenter();
String readFile();
void writeFile();
static int callback1();
int db_exec1();
int openDb();
static int callback();
int db_exec();
bool loadFromSPIFFS();
bool is_authenticated();
void handleLogin();
void logout();
void handleRoot();
void handleNotFound();
void insertRecord();
void save();
void deleteRecord();
void showRecords();
void newRecordTable();
void getssid();
void getmdns();
void getip();
void getfpid();
int FingerprintID();
uint8_t deleteFingerprint();
uint8_t getFingerprintEnroll();
void connectwifi();
void offlinedataupload();

String web_content = "";

// helper functions for logging
void logInfo(const char* message) {
  Serial.print("[INFO][");
  Serial.print(millis());
  Serial.print("ms] ");
  Serial.println(message);
}

void logError(const char* message) {
  Serial.print("[ERROR][");
  Serial.print(millis());
  Serial.print("ms] ");
  Serial.println(message);
}

void logDebug(const char* message) {
  Serial.print("[DEBUG][");
  Serial.print(millis());
  Serial.print("ms] ");
  Serial.println(message);
}

void logWarning(const char* message) {
  Serial.print("[WARN][");
  Serial.print(millis());
  Serial.print("ms] ");
  Serial.println(message);
}

void setup() {
  booting = true;
  pinMode (Buzzer, OUTPUT);
  Serial.begin(115200);
  logInfo("Starting Biometric Attendance System...");
  
  mySerial.begin(57600, SERIAL_8N1, 16, 17);
  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  display.clearDisplay();
  display.drawBitmap(0, 20, logo_bmp, LOGO_WIDTH, LOGO_HEIGHT, 1);
  display.display();
  delay(1000);
  display.clearDisplay();
  
  if (finger.verifyPassword()) {
    logInfo("Fingerprint Sensor Connected Successfully");
  } else {
    display.clearDisplay();
    display.setTextSize(2);             // Normal 1:1 pixel scale
    display.setTextColor(SSD1306_WHITE);        // Draw white text
    display.setCursor(25, 0);            // Start at top-left corner
    display.println(("Sensor"));
    display.setCursor(25, 35);
    display.println("Error");
    display.display();

    logError("Unable to find Sensor");
    delay(3000);
    logError("Check Connections");

    while (1) {
      delay(1);
    }
  }
  
  display.clearDisplay();
  rtc.begin();
  SPIFFS.begin(); // For SPIFFS
  logInfo("SPIFFS initialized");

  // Load values saved in SPIFFS
  ssid_ = readFile(SPIFFS, ssidPath);
  logDebug("Loaded SSID from SPIFFS");
  pass_ = readFile(SPIFFS, passPath);
  logDebug("Loaded WiFi password from SPIFFS");
  ip_ = readFile(SPIFFS, ipPath);
  logDebug("Loaded IP from SPIFFS");
  gateway_ = readFile(SPIFFS, gatewayPath);
  logDebug("Loaded Gateway from SPIFFS");
  dispname_ = readFile(SPIFFS, dispnamePath);
  if (dispname_ == "") {
    dispname_ = DEFAULT_displayname;
  }
  logDebug("Loaded display name from SPIFFS");
  wwwid_ = readFile(SPIFFS, wwwidPath);
  if (wwwid_ == "") {
    wwwid_ = DEFAULT_wwwusername;
  }
  logDebug("Loaded web username from SPIFFS");
  wwwpass_ = readFile(SPIFFS, wwwpassPath);
  if (wwwpass_ == "") {
    wwwpass_ = DEFAULT_wwwpassword;
  }
  logDebug("Loaded web password from SPIFFS");
  gsid_ = readFile(SPIFFS, gsidPath);
  logDebug("Loaded Google Sheet ID from SPIFFS");
  mdnsdotlocalurl = readFile(SPIFFS, mdnsPath);
  logDebug("Loaded mDNS URL from SPIFFS");
  dhcpcheck = readFile(SPIFFS, dhcpcheckPath);
  logDebug("Loaded DHCP check from SPIFFS");

  display.drawBitmap(32, 0, logo_wifi, 64, 61, 1);
  display.display();
  display.clearDisplay();

  connectwifi();
  if (mdnsdotlocalurl == "") {
    mdnsdotlocalurl = DEFAULT_mdns;
  }

  if (!MDNS.begin(mdnsdotlocalurl.c_str())) {
    logError("Error setting up MDNS responder!");
  } else {
    logInfo("MDNS responder started");
  }

  MDNS.addService("http", "tcp", 80);
  logInfo("HTTP service added to MDNS");

  Serial.print("http://");
  Serial.print(mdnsdotlocalurl);
  Serial.println(".local");

  auto requireAuth = [](std::function<void()> handler) {
      return [handler]() {
        if (!is_authenticated()) {
          server.sendHeader("Cache-Control", "no-cache");
          server.send(401);
          return;
        }
        handler();
      };
    }; 


server.on("/", HTTP_GET, handleRoot);
server.onNotFound(handleNotFound);
server.on("/api/insert", HTTP_POST, requireAuth(insertRecord));      // Create new record
server.on("/api/delete", HTTP_DELETE, requireAuth(deleteRecord));    // Delete record
server.on("/api/show", HTTP_GET, requireAuth(showRecords));          // Show all records
server.on("/api/newRecordTable", HTTP_GET, requireAuth(newRecordTable)); // Get latest record info
server.on("/api/save", HTTP_POST, requireAuth(save));                // Save settings
server.on("/api/getssid", HTTP_GET, requireAuth(getssid));
server.on("/api/getfpid", HTTP_GET, requireAuth(getfpid));
server.on("/api/getmdns", HTTP_GET, requireAuth(getmdns));
server.on("/api/getip", HTTP_GET, requireAuth(getip));
server.on("/api/login", HTTP_POST, handleLogin);                     // Login (POST for credentials)
server.on("/api/signout", HTTP_POST, logout);                        // Logout

  //here the list of headers to be recorded
  const char * headerkeys[] = {"User-Agent", "Cookie"} ;
  size_t headerkeyssize = sizeof(headerkeys) / sizeof(char*);
  //ask server to track these headers
  server.collectHeaders(headerkeys, headerkeyssize );
  server.begin();


  int rc;
  sqlite3_initialize();

  if (openDb("/spiffs/test1.db", &test1_db))
    return;
  booting = false;

}



void loop() {

  server.handleClient();
  FingerprintID();
  if (WiFi.status() != WL_CONNECTED && millis() - lastwificheck > 1800000)
  {
    connectwifi();

  }
}

void oledDisplayCenter(String text, int x, int y) {
  int16_t x1;
  int16_t y1;
  uint16_t width;
  uint16_t height;

  display.getTextBounds(text, x, y, &x1, &y1, &width, &height);
  display.setCursor((SCREEN_WIDTH - width) / 2, y);
  display.print(text); // text to display
}

// Read File from SPIFFS
String readFile(fs::FS &fs, const char * path) {
  Serial.printf("Reading file: %s\r\n", path);

  File file = fs.open(path);
  if (!file || file.isDirectory()) {
    Serial.println("- failed to open file for reading");
    return String();
  }

  String fileContent;
  while (file.available()) {
    fileContent = file.readStringUntil('\n');
    break;
  }
  return fileContent;
}

// Write file to SPIFFS
void writeFile(fs::FS &fs, const char * path, const char * message) {
  Serial.printf("Writing file: %s\r\n", path);

  File file = fs.open(path, FILE_WRITE);
  if (!file) {
    Serial.println("- failed to open file for writing");
    return;
  }
  if (file.print(message)) {
    Serial.println("- file written");
  } else {
    Serial.println("- frite failed");
  }
}


const char* data1 = "Callback function called";
static int callback1(void *data1, int argc, char **argv, char **azColName) {
  int i;
  String t = "";
  String m = "";
  Serial.printf("%s: ", (const char*)data1);
  for (i = 0; i < argc; i++) {
    Serial.printf("%s = %s\n", azColName[i], argv[i] ? argv[i] : "NULL");
    //printf(buffer, "%s = %s\n", azColName[i], argv[i] ? argv[i] : "NULL");
    if (i == 0)
    {
      Sqid = argv[i] ? argv[i] : "NULL";
    }
    else if (i == 1)
    {
      Empid = argv[i] ? argv[i] : "NULL";
    }
    else if (i == 2)
    {
      Empname = argv[i] ? argv[i] : "NULL";
    }
    else if (i == 3)
    {
      EmpEmail = argv[i] ? argv[i] : "NULL";
    }
    else if (i == 4)
    {
      EmpPos = argv[5] ? argv[i] : "NULL";
    }
    else if (i == 5)
    {
      Empfid = argv[i] ? argv[i] : "NULL";
    }
    else if (i == 6)
    {
      sts7 = argv[i] ? argv[i] : "NULL";
    }
    else if (i == 7)
    {
      sts8 = argv[i] ? argv[i] : "NULL";
    }
    else if (i == 8)
    {
      sts9 = argv[i] ? argv[i] : "NULL";
    }
    else if (i == 9)
    {
      sts10 = argv[i] ? argv[i] : "NULL";
    }
    m = argv[i] ? argv[i] : "NULL";
    //t += String(azColName[i] + m);
    Serial.println(m);
  }
  sqlreturn = m.toInt();
  Serial.printf("\n");
  return 0;
}

char *zErrMsg1 = 0;
int db_exec1(sqlite3 *db, const char *sql) {
  Serial.println(sql);
  long start = micros();
  int rc = sqlite3_exec(db, sql, callback1, (void*)data1, &zErrMsg1);
  if (rc != SQLITE_OK) {
    Serial.printf("SQL error: %s\n", zErrMsg1);
    sqlite3_free(zErrMsg1);
  } else {
    Serial.printf("Operation done successfully\n");
  }
  Serial.print(F("Time taken:"));
  Serial.println(micros() - start);
  return rc;
}




/*--------------------------------------------------------*/
int openDb(const char *filename, sqlite3 **db) {
  int rc = sqlite3_open(filename, db);
  if (rc) {
    Serial.printf("Can't open database: %s\n", sqlite3_errmsg(*db));
    return rc;
  } else {
    Serial.printf("Opened database successfully\n");
  }
  return rc;
}
/*--------------------------------------------------------*/

int db_exec(sqlite3 *db, const char *sql) {
  Serial.println('\n');
  int rc = sqlite3_exec(db, sql, callback, (void*)data, &zErrMsg);
  if (rc != SQLITE_OK) {
    Serial.printf("SQL error: %s\n", zErrMsg);
    sqlite3_free(zErrMsg);
  }
  return rc;
}


static int callback(void *data, int argc, char **argv, char **azColName) {
  web_content += "<tr>";
  for (int i = 0; i < argc; i++) {
    web_content += "<td>";
    web_content += argv[i];
    web_content += "</td>";
  }
  web_content += "<td><button onClick =\"del('";
  web_content += argv[0];
  web_content += "')\">Delete</button></td></tr>";
  return 0;
}
bool loadFromSPIFFS(String path) {
  String dataType = "text/html";

  Serial.print("Requested page -> ");
  Serial.println(path);

  if (SPIFFS.exists(path)) {
    File dataFile = SPIFFS.open(path, "r");
    if (!dataFile) {
      handleNotFound();
      return false;
    }
    server.sendHeader("Content-Encoding", "gzip");
    if (server.streamFile(dataFile, dataType) != dataFile.size()) {
      Serial.println("Sent less data than expected!");
    } else {
      Serial.println("Gzipped page served!");
    }
    dataFile.close();
    return true;
  }
  handleNotFound();
  return false;
}

// Base64URL encode helper
String base64UrlEncode(const uint8_t* input, size_t length) {
  size_t outputLen = 4 * ((length + 2) / 3);
  uint8_t encoded[outputLen + 1];
  size_t actualLen;

  mbedtls_base64_encode(encoded, sizeof(encoded), &actualLen, input, length);
  encoded[actualLen] = '\0';

  String b64 = String((char*)encoded);
  b64.replace("+", "-");
  b64.replace("/", "_");
  b64.replace("=", "");
  return b64;
}

// HMAC SHA256 using mbedTLS
String hmacSha256Base64Url(const String& data, const String& key) {
  const mbedtls_md_info_t* md = mbedtls_md_info_from_type(MBEDTLS_MD_SHA256);
  uint8_t hash[32];

  mbedtls_md_context_t ctx;
  mbedtls_md_init(&ctx);
  mbedtls_md_setup(&ctx, md, 1);
  mbedtls_md_hmac_starts(&ctx, (const uint8_t*)key.c_str(), key.length());
  mbedtls_md_hmac_update(&ctx, (const uint8_t*)data.c_str(), data.length());
  mbedtls_md_hmac_finish(&ctx, hash);
  mbedtls_md_free(&ctx);

  return base64UrlEncode(hash, sizeof(hash));
}

// Create JWT
String createJWT(const String& username) {
  StaticJsonDocument<200> header, payload;
  header["alg"] = "HS256";
  header["typ"] = "JWT";
  payload["user"] = username;
  payload["exp"] = (millis() / 1000) + 3600;

  String headerStr, payloadStr;
  serializeJson(header, headerStr);
  serializeJson(payload, payloadStr);

  String headerB64 = base64UrlEncode((const uint8_t*)headerStr.c_str(), headerStr.length());
  String payloadB64 = base64UrlEncode((const uint8_t*)payloadStr.c_str(), payloadStr.length());

  String toSign = headerB64 + "." + payloadB64;
  String signature = hmacSha256Base64Url(toSign, JWT_SECRET);

  return toSign + "." + signature;
}

// Validate JWT
bool validateJWT(const String& token, String& username) {
  int dot1 = token.indexOf('.');
  int dot2 = token.indexOf('.', dot1 + 1);
  if (dot1 == -1 || dot2 == -1) return false;

  String headerB64 = token.substring(0, dot1);
  String payloadB64 = token.substring(dot1 + 1, dot2);
  String signature = token.substring(dot2 + 1);

  String toSign = headerB64 + "." + payloadB64;
  String expectedSig = hmacSha256Base64Url(toSign, JWT_SECRET);
  if (signature != expectedSig) return false;

  // Convert base64url back to standard base64
  String payloadB64Std = payloadB64;
  payloadB64Std.replace("-", "+");
  payloadB64Std.replace("_", "/");
  while (payloadB64Std.length() % 4 != 0) payloadB64Std += "=";

  // Decode payload
  size_t payloadLen = (payloadB64Std.length() * 3) / 4;
  std::vector<uint8_t> decoded(payloadLen);
  size_t actualLen;
  if (mbedtls_base64_decode(decoded.data(), payloadLen, &actualLen,
                            (const uint8_t*)payloadB64Std.c_str(), payloadB64Std.length()) != 0)
    return false;

  String payloadJson = String((char*)decoded.data(), actualLen);
  StaticJsonDocument<256> payload;
  if (deserializeJson(payload, payloadJson) != DeserializationError::Ok) return false;

  if ((millis() / 1000) > (unsigned long)(payload["exp"] | 0)) return false;
  username = payload["user"].as<String>();
  return true;
}

bool is_authenticated() {
  Serial.println("Enter is_authenticated (JWT)");
  if (server.hasHeader("Cookie")) {
    String cookie = server.header("Cookie");
    Serial.print("Found cookie: ");
    Serial.println(cookie);
    int idx = cookie.indexOf("auth_token=");
    if (idx != -1) {
      int endIdx = cookie.indexOf(';', idx);
      String jwt = cookie.substring(idx + 4, endIdx == -1 ? cookie.length() : endIdx);
      String username;
      if (validateJWT(jwt, username)) {
        Serial.println("JWT Authentication Successful for user: " + username);
        return true;
      }
    }
  }
  Serial.println("JWT Authentication Failed");
  return false;
}



//login page, also called for disconnect
void handleLogin() {
  String msg;
  if (server.hasHeader("Cookie")) {
    logDebug("Found cookie in request");
    String cookie = server.header("Cookie");
    logDebug(cookie.c_str());
  }
  if (server.hasArg("DISCONNECT")) {
    logInfo("User disconnected");
    server.sendHeader("Cache-Control", "no-cache");
    server.sendHeader("Set-Cookie", "auth_token=; Max-Age=0; Path=/");
    server.send(200, "application/json", "{\"status\":\"success\",\"message\":\"Logged out successfully\"}");
    return;
  }
  if (server.hasArg("USERNAME") && server.hasArg("PASSWORD")) {
    logDebug("Login attempt received");
    if (server.arg("USERNAME") == wwwid_ && server.arg("PASSWORD") == wwwpass_) {
      String jwt = createJWT(server.arg("USERNAME"));
      String cookie = "auth_token=" + jwt + "; Path=/; HttpOnly; SameSite=Strict";
      server.sendHeader("Set-Cookie", cookie);
      server.sendHeader("Cache-Control", "no-cache");
      server.send(200, "application/json", "{\"status\":\"success\",\"message\":\"Login successful\"}");
      logInfo("User logged in successfully");
      return;
    }
    logWarning("Failed login attempt - invalid credentials");
    server.send(401, "application/json", "{\"status\":\"error\",\"message\":\"Invalid username or password\"}");
    return;
  }
  logWarning("Login attempt with missing credentials");
  server.send(400, "application/json", "{\"status\":\"error\",\"message\":\"Missing username or password\"}");
}
/*--------------------------------------------------------*/
void logout() {
  server.sendHeader("Set-Cookie", "auth_token=; Max-Age=0; Path=/; HttpOnly; SameSite=Strict");
  server.sendHeader("Cache-Control", "no-cache");
  server.send(200, "application/json", "{\"status\":\"success\",\"message\":\"Logged out successfully\"}");
  Serial.println("Signout (JWT)");
}
/*--------------------------------------------------------*/
void handleRoot() {
  loadFromSPIFFS("/index.html.gz");
}

void handleNotFound() {
  String message = "{\"status\":\"error\",\"message\":\"Not Found\",\"details\":{";
  message += "\"uri\":\"" + server.uri() + "\",";
  message += "\"method\":\"" + (server.method() == HTTP_GET ? "GET" : "POST") + "\",";
  message += "\"arguments\":" + String(server.args()) + ",";
  message += "\"params\":{";
  
  for (uint8_t i = 0; i < server.args(); i++) {
    message += "\"" + server.argName(i) + "\":\"" + server.arg(i) + "\"";
    if (i < server.args() - 1) message += ",";
  }
  message += "}}";
  
  server.send(404, "application/json", message);
}

/*--------------------------------------------------------*/
void insertRecord() {
  logInfo("New record insertion request received");
  String sql = "";
  String eemployee_id = server.arg("memployee_id");
  String ename = server.arg("mname");
  String eemail_id = server.arg("memail_id");
  String epos = server.arg("mpos");
  String efpid = server.arg("mfpid");

  // Validate required fields
  if (eemployee_id == "" || ename == "" || eemail_id == "" || epos == "" || efpid == "") {
    logWarning("Record insertion failed - missing required fields");
    server.send(400, "application/json", "{\"status\":\"error\",\"message\":\"Missing required fields\"}");
    return;
  }

  id = efpid.toInt();
  logDebug("Starting fingerprint enrollment process");

  if (getFingerprintEnroll() == true) {
    sql = "insert into attendance(id,eid,employee_name,employee_email,position,fpid) values(" + efpid + ",'" + eemployee_id + "','" + ename + "','" + eemail_id + "','" + epos + "'," + efpid + ")";
    logDebug("Executing SQL: " + sql);
    
    if (db_exec(test1_db, sql.c_str()) == SQLITE_OK) {
      display.clearDisplay();
      display.setTextColor(SSD1306_WHITE);
      display.drawBitmap(47, 0, ok_bmp, 35, 45, 1);
      oledDisplayCenter("Enroll Success!!", 0, 60);
      display.display();
      delay(2000);
      logInfo("Employee enrolled successfully");
      server.send(201, "application/json", "{\"status\":\"success\",\"message\":\"Employee enrolled successfully\"}");
    } else {
      logError("Database error during employee enrollment");
      server.send(500, "application/json", "{\"status\":\"error\",\"message\":\"Database error\"}");
    }
  } else {
    logError("Fingerprint enrollment failed");
    server.send(400, "application/json", "{\"status\":\"error\",\"message\":\"Fingerprint enrollment failed\"}");
  }
}
/*--------------------------------------------------------*/
/*--------------------------------------------------------*/
void save() {
  web_content = "";
  String _ssid = server.arg("ssid");
  String _password = server.arg("password");
  String _mdns = server.arg("mdns");
  String _gsid = server.arg("gsid");
  String _aip = server.arg("aip");
  String _mip = server.arg("mip");
  String _gateway = server.arg("gateway");
  String _dispname = server.arg("dispname");
  String _wwwid = server.arg("wwwid");
  String _wwwpass = server.arg("wwwpass");
  Serial.println(_ssid);
  Serial.println(_password);
  Serial.println(_mdns);
  Serial.println(_gsid);
  Serial.println(_aip);
  Serial.println(_mip);
  Serial.println(_gateway);
  Serial.println(_dispname);
  Serial.println(_wwwid);
  Serial.println(_wwwpass);
  if (_ssid != "")
  {
    writeFile(SPIFFS, ssidPath, _ssid.c_str());
  }
  else
  {
    Serial.println("Blank SSID");
  }
  if (_password != "")
  {
    writeFile(SPIFFS, passPath, _password.c_str());
  }
  else
  {
    Serial.println("Blank WiFi Password");
  }
  if (_mdns != "")
  {
    writeFile(SPIFFS, mdnsPath, _mdns.c_str());
  }
  else
  {
    Serial.println("Blank mdns");
  }
  if (_gsid != "")
  {
    writeFile(SPIFFS, gsidPath, _gsid.c_str());
  }
  else
  {
    Serial.println("Blank GSID");
  }
  if (_aip != "")
  {
    writeFile(SPIFFS, dhcpcheckPath, _aip.c_str());
  }
  else
  {
    Serial.println("Blank IP config");
  }
  if (_mip != "")
  {
    writeFile(SPIFFS, ipPath, _mip.c_str());
  }
  else
  {
    Serial.println("Blank Manual IP");
  }
  if (_gateway != "")
  {
    writeFile(SPIFFS, gatewayPath, _gateway.c_str());
  }
  else
  {
    Serial.println("Blank Gateway");
  }
  if (_dispname != "")
  {
    writeFile(SPIFFS, dispnamePath, _dispname.c_str());
  }
  else
  {
    Serial.println("Blank Display Name");
  }
  if (_wwwid != "")
  {
    writeFile(SPIFFS, wwwidPath, _wwwid.c_str());
  }
  else
  {
    Serial.println("Blank Web User ID");
  }
  if (_wwwpass != "")
  {
    writeFile(SPIFFS, wwwpassPath, _wwwpass.c_str());
  }
  else
  {
    Serial.println("Balnk Web password");
  }

  String dtd = server.arg("dtd");
  String dtm = server.arg("dtm");
  String dty = server.arg("dty");
  String tmh = server.arg("tmh");
  String tmm = server.arg("tmm");
  String tms = server.arg("tms");
  String tmapm = server.arg("tmapm");
  Serial.println("Date received");

  Serial.println(dty);
  Serial.println(dtm);
  Serial.println(dtd);
  Serial.println(tmh);
  Serial.println(tmm);
  Serial.println(tmapm);
  if (dtd == "1" && dtm == "1" && dty == "2022")
   {
  Serial.println("Default date received!!! not saved");
  }
  else
  {
    year_ = dty.toInt();
    month_ = dtm.toInt();
    day_ = dtd.toInt();
    int ampm = tmapm.toInt();
    if (ampm == 2 && tmh.toInt() < 12)
    {
      hour24_ = tmh.toInt() + 12;
    }
    else if (ampm == 1 && tmh.toInt() == 12)
    {
      hour24_ = 0;
    }
    else
    {
      hour24_ = tmh.toInt();
    }
    minute_ = tmm.toInt();
    second_ = tms.toInt();;
    Serial.println("Date rescived");
    Serial.println(year_);
    Serial.println(month_);
    Serial.println(day_);
    Serial.println(hour24_);
    Serial.println(minute_);
    rtc.adjust(DateTime(year_, month_, day_, hour24_, minute_, second_));
    DateTime now = rtc.now();
    Serial.print(now.year(), DEC);
    Serial.print('/');
    Serial.print(now.month(), DEC);
    Serial.print('/');
    Serial.print(now.day(), DEC);
    Serial.print(" (");
    Serial.print(nameoftheday[now.dayOfTheWeek()]);
    Serial.print(") ");
    Serial.print(now.hour(), DEC);
    Serial.print(':');
    Serial.print(now.minute(), DEC);
    Serial.print(':');
    Serial.print(now.second(), DEC);
    Serial.println();
  }
  web_content += "OK";
                 server.send (201, "text/html", web_content );
                 ESP.restart();

}
/*--------------------------------------------------------*/
void deleteRecord() {
  String id = server.arg("id");
  logInfo("Delete record request received for ID: " + id);
  
  if (id == "") {
    logWarning("Delete request failed - missing employee ID");
    server.send(400, "application/json", "{\"status\":\"error\",\"message\":\"Missing employee ID\"}");
    return;
  }

  int dfpid = id.toInt();
  String sql = "delete from attendance where id=" + id;
  logDebug("Executing SQL: " + sql);
  
  if (db_exec(test1_db, sql.c_str()) == SQLITE_OK) {
    deleteFingerprint(dfpid);
    logInfo("Employee deleted successfully");
    server.send(200, "application/json", "{\"status\":\"success\",\"message\":\"Employee deleted successfully\"}");
  } else {
    logError("Failed to delete employee");
    server.send(500, "application/json", "{\"status\":\"error\",\"message\":\"Failed to delete employee\"}");
  }
}
/*--------------------------------------------------------*/
void showRecords() {
  web_content = "<table style='width:90%; margin-left:5%'><tr><th>Sl.No</th><th>Empl.ID</th><th>Employee Name</th><th>Employee Email</th><th>Position</th><th>FID</th><th>DEL</th></tr>";
  String sql = "Select * from attendance";
  
  if (db_exec(test1_db, sql.c_str()) == SQLITE_OK) {
    web_content += "</table>";
    server.send(200, "text/html", web_content);
  } else {
    server.send(500, "application/json", "{\"status\":\"error\",\"message\":\"Failed to fetch records\"}");
  }
}


/*--------------------------------------------------------*/
void newRecordTable() {
  String sql = "";
  Sqid = "NULL";
  sql = "SELECT * FROM attendance ORDER BY id DESC LIMIT 1";
  int temp = db_exec1(test1_db, sql.c_str());
  Serial.print("SQID : ");
  Serial.println(Sqid);
  if (Sqid == "NULL")
  {
    Sqid = "1";
  }
  else
  {
    int qid = Sqid.toInt();
    qid = qid + 1;
    Sqid = String(qid);
  }
}
/*--------------------------------------------------------*/


/*--------------------------------------------------------*/
void getssid() {
  server.send(200, "application/json", "{\"status\":\"success\",\"data\":\"" + ssid_ + "\"}");
}
/*--------------------------------------------------------*/
/*--------------------------------------------------------*/
void getmdns() {
  server.send(200, "application/json", "{\"status\":\"success\",\"data\":\"" + mdnsdotlocalurl + "\"}");
}
/*--------------------------------------------------------*/
/*--------------------------------------------------------*/
void getip() {
  server.send(200, "application/json", "{\"status\":\"success\",\"data\":\"" + ip_ + "\"}");
}
/*--------------------------------------------------------*/
/*--------------------------------------------------------*/
void getfpid() {
  server.send(200, "application/json", "{\"status\":\"success\",\"data\":\"" + Sqid + "\"}");
}
/*--------------------------------------------------------*/
// returns -1 if failed, otherwise returns ID #
int FingerprintID()
{
  DateTime now = rtc.now();
  uint8_t p = finger.getImage();
  if (p != FINGERPRINT_OK)
  {
    display.clearDisplay();
    //display.setTextSize(2);             // Normal 1:1 pixel scale
    display.setFont(&Roboto_Bold_10);
    display.setTextColor(SSD1306_WHITE);        // Draw white text
    display.setCursor(0, 10);            // Start at top-left corner
    display.println(nameoftheday[now.dayOfTheWeek()]);
    display.setCursor(25, 10);
    display.println(now.day());
    display.setCursor(42, 10);
    display.println(month_name[now.month() - 1]);
    display.setCursor(67, 10);
    display.println(now.year(), DEC);
    //display.setCursor(0, 64);
    //display.print("Semicon Media Pvt Ltd");
    oledDisplayCenter(dispname_, 0, 60);
    if (WiFi.status() == WL_CONNECTED) {
      display.drawBitmap(110, 0, wifi_bmp, 12, 10, 1);
    }
    else
    {
      display.drawBitmap(110, 0, nowifi_bmp, 12, 10, 1);
    }
    display.setFont(&DSEG7_Classic_Bold_30);

    display.setCursor(0, 48);
    if (now.hour() < 10 || (now.hour() > 12 && now.hour() < 22))
    {
      display.print("0");
    }
    if (now.hour() < 13)
    {
      display.print(now.hour());
    }
    else
    {
      display.print(now.hour() - 12);
    }
    if ((now.second() % 2) == 0)
    {
      display.print(":");
    }
    else
    {
      display.print(" ");
    }

    if (now.minute() < 10)
    {
      display.print("0");
    }
    display.print(now.minute());
    display.setFont(&Roboto_Bold_10);
    if (now.hour() < 13)
    {
      display.print("AM");
    }
    else
    {
      display.print("PM");
    }
    display.display();
    //Serial.println("Waiting For Valid Finger");
    return -1;
  }

  p = finger.image2Tz();
  if (p != FINGERPRINT_OK)
  {
    display.clearDisplay();
    display.setTextColor(SSD1306_WHITE);        // Draw white text
    display.drawBitmap(47, 0, messy_bmp, 35, 45, 1);
    oledDisplayCenter("Messy Image Try Again", 0, 60);
    display.display();

    Serial.println("Messy Image Try Again");
    digitalWrite (Buzzer, HIGH); //turn buzzer on
    delay(500);
    digitalWrite (Buzzer, LOW); //turn buzzer on
    delay(500);
    digitalWrite (Buzzer, HIGH); //turn buzzer on
    delay(500);
    digitalWrite (Buzzer, LOW); //turn buzzer on
    delay(1500);
    display.clearDisplay();
    return -1;
  }

  p = finger.fingerFastSearch();
  if (p != FINGERPRINT_OK)  {

    display.clearDisplay();
    display.setTextColor(SSD1306_WHITE);        // Draw white text
    display.drawBitmap(47, 0, invalid_bmp, 35, 45, 1);
    oledDisplayCenter("Invalid ID Try Again", 0, 60);
    display.display();
    Serial.println("Not Valid Finger");
    digitalWrite (Buzzer, HIGH); //turn buzzer on
    delay(500);
    digitalWrite (Buzzer, LOW); //turn buzzer on
    delay(500);
    digitalWrite (Buzzer, HIGH); //turn buzzer on
    delay(500);
    digitalWrite (Buzzer, LOW); //turn buzzer on
    delay(500);
    digitalWrite (Buzzer, HIGH); //turn buzzer on
    delay(500);
    digitalWrite (Buzzer, LOW); //turn buzzer on
    delay(500);
    display.clearDisplay();
    return -1;
  }

  // found a match!
  display.clearDisplay();
  display.setTextColor(SSD1306_WHITE);        // Draw white text
  display.drawBitmap(47, 0, ok_bmp, 35, 45, 1);
  oledDisplayCenter("Finger Print Verified", 0, 60);
  display.display();
  Serial.println("Finger Print Verified");
  delay(1000);
  display.clearDisplay();
  int mnt, dday;
  String yr;
  if (now.month()  == 1)
  {
    mnt = 12;
  }
  else {
    mnt = now.month();
  }
  if ( now.day() < 7)
  {
    dday = 31 - (7 - (now.day() - 1));
  }
  else
  {
    dday = now.day() - 7;
  }
  if (now.month()  == 1 && now.day() < 7)
  {
    yr = String(now.year() - 1, DEC);
  }
  else {
    yr = String(now.year(), DEC);
  }
  String temp = String(dday) + month_name[mnt - 1] + yr;
  String sql = "drop table if exists date" + temp;
  int  rc = db_exec1(test1_db, sql.c_str());
  String att;
  temp = String(now.day()) + month_name[now.month() - 1] + String(now.year(), DEC);
  Serial.print("table name : ");
  Serial.println(temp);
  sql = "create table if not exists date" + temp + " (id INTEGER,date TEXT,time TEXT, eid TEXT,employee_name TEXT,employee_email TEXT,position TEXT,attend TEXT,fpid INTEGER,uploadsts INTEGER)";
  rc = db_exec1(test1_db, sql.c_str());

  Serial.print("Fingerprint ID : ");
  Serial.println(finger.fingerID);
  String SFPID = String (finger.fingerID);
  sql = "SELECT EXISTS(SELECT 1 from date" + temp + " where id =" + SFPID + " LIMIT 1)";
  rc = db_exec1(test1_db, sql.c_str());
  Serial.print("SQL retun : ");
  Serial.println(sqlreturn);
  if (sqlreturn == 1)
  {
    att = "Punch Out";
  }
  else
  {
    att = "Punch In";
  }
  sql = "select count(*) from date" + temp + " where id = " + SFPID;
  rc = db_exec1(test1_db, sql.c_str());
  Serial.print("No times : ");
  Serial.println(sqlreturn);
  if (sqlreturn < 2)
  {
    String hr = "";
    if (now.hour() < 10 || (now.hour() > 12 && now.hour() < 22))
    {
      hr += "0";
    }
    if (now.hour() < 13)
    {
      hr += String(now.hour());
    }
    else
    {
      hr += String(now.hour() - 12);
    }
    if (now.minute() < 10)
    {
      hr += ".0" + String(now.minute());
    }
    else
    {
      hr += "." + String(now.minute());
    }
    if (now.hour() < 12)
    {
      hr += " AM";
    }
    else
    {
      hr += " PM";
    }

    sql = "Select * from attendance where id =" + SFPID;
    rc = db_exec1(test1_db, sql.c_str());

    String urlFinal = "https://script.google.com/macros/s/" + gsid_ + "/exec?" + "date=" + temp + "&time=" + hr + "&empid=" + Empid + "&empname=" + Empname + "&empemail=" + EmpEmail + "&emppos=" + EmpPos + "&emppio=" + att;
    urlFinal.replace(" ", "%20");
    String uploadstatus = "";
    Serial.println(urlFinal);
    HTTPClient http;
    http.begin(urlFinal.c_str());
    http.setFollowRedirects(HTTPC_STRICT_FOLLOW_REDIRECTS);
    int httpCode = http.GET();
    Serial.print("HTTP Status Code: ");
    Serial.println(httpCode);
    //---------------------------------------------------------------------
    //getting response from google sheet
    String payload;
    if (httpCode == 200) {
      uploadstatus = "0";
    }
    else
    {
      uploadstatus = "1";
    }
    //---------------------------------------------------------------------
    http.end();

    sql = "insert into date" + temp + "(id,date,time,eid,employee_name,employee_email,position,attend,fpid,uploadsts) values(" + Sqid + ",'" + temp + "','" + hr + "','" + Empid + "','" + Empname + "','" + EmpEmail + "','" + EmpPos + "','" + att + "'," + Empfid + "," + uploadstatus + ")";
    Serial.println(sql);
    if (db_exec(test1_db, sql.c_str()) == SQLITE_OK) {
      display.drawBitmap(0, 10, welcome_bmp, 128, 17, 1);
      oledDisplayCenter(Empname, 0, 50);
      display.display();
      Serial.print("Welcome : ");
      Serial.println(Empname);
      digitalWrite (Buzzer, HIGH); //turn buzzer on
      delay(1000);
      digitalWrite (Buzzer, LOW); //turn buzzer on
      delay(2000);
      display.clearDisplay();
    }
  }
  else {
    oledDisplayCenter("Already Punched Out", 0, 20);
    oledDisplayCenter("Try Again Tomorrow", 0, 50);
    display.display();
    Serial.print("Attendance already logged : ");
    Serial.println(Empname);
    digitalWrite (Buzzer, HIGH); //turn buzzer on
    delay(1000);
    digitalWrite (Buzzer, LOW); //turn buzzer on
    delay(2000);
    display.clearDisplay();
  }
  return finger.fingerID;
}

uint8_t deleteFingerprint(uint8_t id) {
  uint8_t p = -1;

  p = finger.deleteModel(id);

  if (p == FINGERPRINT_OK) {
    Serial.println("Deleted!");
  } else if (p == FINGERPRINT_PACKETRECIEVEERR) {
    Serial.println("Communication error");
  } else if (p == FINGERPRINT_BADLOCATION) {
    Serial.println("Could not delete in that location");
  } else if (p == FINGERPRINT_FLASHERR) {
    Serial.println("Error writing to flash");
  } else {
    Serial.print("Unknown error: 0x"); Serial.println(p, HEX);
  }

  return p;
}



uint8_t getFingerprintEnroll() {

  display.clearDisplay();
  display.setTextColor(SSD1306_WHITE);        // Draw white text
  display.drawBitmap(47, 0, finger_bmp, 35, 45, 1);
  display.setCursor(0, 60);            // Start at top-left corner
  display.println(("Place Finger to Enroll"));
  display.display();
  int p = -1;
  while (p != FINGERPRINT_OK) {
    p = finger.getImage();
    switch (p) {
      case FINGERPRINT_OK:
        Serial.println("Image taken");
        display.clearDisplay();
        display.setTextColor(SSD1306_WHITE);        // Draw white text
        display.drawBitmap(47, 0, ok_bmp, 35, 45, 1);
        oledDisplayCenter("Image taken", 0, 60);
        display.display();
        digitalWrite (Buzzer, HIGH); //turn buzzer on
        delay(500);
        digitalWrite (Buzzer, LOW); //turn buzzer on
        delay(500);
        break;
      case FINGERPRINT_NOFINGER:
        Serial.println(".");
        break;
      case FINGERPRINT_PACKETRECIEVEERR:
        Serial.println("Communication error");
        display.clearDisplay();
        display.setTextColor(SSD1306_WHITE);        // Draw white text
        display.drawBitmap(47, 0, invalid_bmp, 35, 45, 1);
        oledDisplayCenter("Communication error", 0, 60);
        display.display();
        digitalWrite (Buzzer, HIGH); //turn buzzer on
        delay(500);
        digitalWrite (Buzzer, LOW); //turn buzzer on
        delay(500);
        digitalWrite (Buzzer, HIGH); //turn buzzer on
        delay(500);
        digitalWrite (Buzzer, LOW); //turn buzzer on
        break;
      case FINGERPRINT_IMAGEFAIL:
        Serial.println("Imaging error");
        display.clearDisplay();
        display.setTextColor(SSD1306_WHITE);        // Draw white text
        display.drawBitmap(47, 0, invalid_bmp, 35, 45, 1);
        oledDisplayCenter("Imaging error", 0, 60);
        display.display();
        digitalWrite (Buzzer, HIGH); //turn buzzer on
        delay(500);
        digitalWrite (Buzzer, LOW); //turn buzzer on
        delay(500);
        digitalWrite (Buzzer, HIGH); //turn buzzer on
        delay(500);
        digitalWrite (Buzzer, LOW); //turn buzzer on
        break;
      default:
        Serial.println("Unknown error");
        display.clearDisplay();
        display.setTextColor(SSD1306_WHITE);        // Draw white text
        display.drawBitmap(47, 0, invalid_bmp, 35, 45, 1);
        oledDisplayCenter("Unknown error", 0, 60);
        display.display();
        digitalWrite (Buzzer, HIGH); //turn buzzer on
        delay(500);
        digitalWrite (Buzzer, LOW); //turn buzzer on
        delay(500);
        digitalWrite (Buzzer, HIGH); //turn buzzer on
        delay(500);
        digitalWrite (Buzzer, LOW); //turn buzzer on
        break;
    }
  }

  // OK success!

  p = finger.image2Tz(1);
  switch (p) {
    case FINGERPRINT_OK:
      Serial.println("Image converted");
      display.clearDisplay();
      display.setTextColor(SSD1306_WHITE);        // Draw white text
      display.drawBitmap(47, 0, ok_bmp, 35, 45, 1);
      oledDisplayCenter("Image converted", 0, 60);
      display.display();
      delay(1000);
      break;
    case FINGERPRINT_IMAGEMESS:
      Serial.println("Image too messy");
      display.clearDisplay();
      display.setTextColor(SSD1306_WHITE);        // Draw white text
      display.drawBitmap(47, 0, messy_bmp, 35, 45, 1);
      oledDisplayCenter("Image too messy", 0, 60);
      display.display();
      digitalWrite (Buzzer, HIGH); //turn buzzer on
      delay(500);
      digitalWrite (Buzzer, LOW); //turn buzzer on
      delay(500);
      digitalWrite (Buzzer, HIGH); //turn buzzer on
      delay(500);
      digitalWrite (Buzzer, LOW); //turn buzzer on
      return p;
    case FINGERPRINT_PACKETRECIEVEERR:
      Serial.println("Communication error");
      display.clearDisplay();
      display.setTextColor(SSD1306_WHITE);        // Draw white text
      display.drawBitmap(47, 0, invalid_bmp, 35, 45, 1);
      oledDisplayCenter("Communication errorr", 0, 60);
      display.display();
      digitalWrite (Buzzer, HIGH); //turn buzzer on
      delay(500);
      digitalWrite (Buzzer, LOW); //turn buzzer on
      delay(500);
      digitalWrite (Buzzer, HIGH); //turn buzzer on
      delay(500);
      digitalWrite (Buzzer, LOW); //turn buzzer on
      return p;
    case FINGERPRINT_FEATUREFAIL:
      Serial.println("Could not find fingerprint features");
      display.clearDisplay();
      display.setTextColor(SSD1306_WHITE);        // Draw white text
      display.drawBitmap(47, 0, invalid_bmp, 35, 45, 1);
      oledDisplayCenter("No fingerprint features", 0, 60);
      display.display();
      digitalWrite (Buzzer, HIGH); //turn buzzer on
      delay(500);
      digitalWrite (Buzzer, LOW); //turn buzzer on
      delay(500);
      digitalWrite (Buzzer, HIGH); //turn buzzer on
      delay(500);
      digitalWrite (Buzzer, LOW); //turn buzzer on
      return p;
    case FINGERPRINT_INVALIDIMAGE:
      Serial.println("Could not find fingerprint features");
      display.clearDisplay();
      display.setTextColor(SSD1306_WHITE);        // Draw white text
      display.drawBitmap(47, 0, invalid_bmp, 35, 45, 1);
      oledDisplayCenter("Imaging error", 0, 60);
      display.display();
      digitalWrite (Buzzer, HIGH); //turn buzzer on
      delay(500);
      digitalWrite (Buzzer, LOW); //turn buzzer on
      delay(500);
      digitalWrite (Buzzer, HIGH); //turn buzzer on
      delay(500);
      digitalWrite (Buzzer, LOW); //turn buzzer on
      return p;
    default:
      Serial.println("Unknown error");
      display.clearDisplay();
      display.setTextColor(SSD1306_WHITE);        // Draw white text
      display.drawBitmap(47, 0, invalid_bmp, 35, 45, 1);
      oledDisplayCenter("Unknown error", 0, 60);
      display.display();
      digitalWrite (Buzzer, HIGH); //turn buzzer on
      delay(500);
      digitalWrite (Buzzer, LOW); //turn buzzer on
      delay(500);
      digitalWrite (Buzzer, HIGH); //turn buzzer on
      delay(500);
      digitalWrite (Buzzer, LOW); //turn buzzer on
      return p;
  }

  Serial.println("Remove finger");
  display.clearDisplay();
  display.setTextColor(SSD1306_WHITE);        // Draw white text
  display.drawBitmap(47, 0, finger_bmp, 35, 45, 1);
  oledDisplayCenter("Remove finger", 0, 60);
  display.display();
  digitalWrite (Buzzer, HIGH); //turn buzzer on
  delay(500);
  digitalWrite (Buzzer, LOW); //turn buzzer on
  delay(500);
  delay(1000);
  p = 0;
  while (p != FINGERPRINT_NOFINGER) {
    p = finger.getImage();
  }
  Serial.print("ID "); Serial.println(id);
  p = -1;
  Serial.println("Place same finger again");
  display.clearDisplay();
  display.setTextColor(SSD1306_WHITE);        // Draw white text
  display.drawBitmap(47, 0, finger_bmp, 35, 45, 1);
  oledDisplayCenter("Place same finger again", 0, 60);
  display.display();
  while (p != FINGERPRINT_OK) {
    p = finger.getImage();
    switch (p) {
      case FINGERPRINT_OK:
        Serial.println("Image taken");
        display.clearDisplay();
        display.setTextColor(SSD1306_WHITE);        // Draw white text
        display.drawBitmap(47, 0, ok_bmp, 35, 45, 1);
        oledDisplayCenter("Image taken", 0, 60);
        display.display();
        digitalWrite (Buzzer, HIGH); //turn buzzer on
        delay(500);
        digitalWrite (Buzzer, LOW); //turn buzzer on
        delay(500);
        break;
      case FINGERPRINT_NOFINGER:
        Serial.print(".");
        break;
      case FINGERPRINT_PACKETRECIEVEERR:
        Serial.println("Communication error");
        display.clearDisplay();
        display.setTextColor(SSD1306_WHITE);        // Draw white text
        display.drawBitmap(47, 0, invalid_bmp, 35, 45, 1);
        oledDisplayCenter("Communication error", 0, 60);
        display.display();
        digitalWrite (Buzzer, HIGH); //turn buzzer on
        delay(500);
        digitalWrite (Buzzer, LOW); //turn buzzer on
        delay(500);
        digitalWrite (Buzzer, HIGH); //turn buzzer on
        delay(500);
        digitalWrite (Buzzer, LOW); //turn buzzer on
        break;
      case FINGERPRINT_IMAGEFAIL:
        Serial.println("Imaging error");
        display.clearDisplay();
        display.setTextColor(SSD1306_WHITE);        // Draw white text
        display.drawBitmap(47, 0, invalid_bmp, 35, 45, 1);
        oledDisplayCenter("Imaging error", 0, 60);
        display.display();
        digitalWrite (Buzzer, HIGH); //turn buzzer on
        delay(500);
        digitalWrite (Buzzer, LOW); //turn buzzer on
        delay(500);
        digitalWrite (Buzzer, HIGH); //turn buzzer on
        delay(500);
        digitalWrite (Buzzer, LOW); //turn buzzer on
        break;
      default:
        Serial.println("Unknown error");
        display.clearDisplay();
        display.setTextColor(SSD1306_WHITE);        // Draw white text
        display.drawBitmap(47, 0, invalid_bmp, 35, 45, 1);
        oledDisplayCenter("Unknown error", 0, 60);
        display.display();
        digitalWrite (Buzzer, HIGH); //turn buzzer on
        delay(500);
        digitalWrite (Buzzer, LOW); //turn buzzer on
        delay(500);
        digitalWrite (Buzzer, HIGH); //turn buzzer on
        delay(500);
        digitalWrite (Buzzer, LOW); //turn buzzer on
        break;
    }
  }

  // OK success!

  p = finger.image2Tz(2);
  switch (p) {
    case FINGERPRINT_OK:
      Serial.println("Image converted");
      display.clearDisplay();
      display.setTextColor(SSD1306_WHITE);        // Draw white text
      display.drawBitmap(47, 0, ok_bmp, 35, 45, 1);
      oledDisplayCenter("Image converted", 0, 60);
      display.display();
      delay(1000);
      break;
    case FINGERPRINT_IMAGEMESS:
      Serial.println("Image too messy");
      display.clearDisplay();
      display.setTextColor(SSD1306_WHITE);        // Draw white text
      display.drawBitmap(47, 0, messy_bmp, 35, 45, 1);
      oledDisplayCenter("Image too messy", 0, 60);
      display.display();
      digitalWrite (Buzzer, HIGH); //turn buzzer on
      delay(500);
      digitalWrite (Buzzer, LOW); //turn buzzer on
      delay(500);
      digitalWrite (Buzzer, HIGH); //turn buzzer on
      delay(500);
      digitalWrite (Buzzer, LOW); //turn buzzer on
      return p;
    case FINGERPRINT_PACKETRECIEVEERR:
      Serial.println("Communication error");
      display.clearDisplay();
      display.setTextColor(SSD1306_WHITE);        // Draw white text
      display.drawBitmap(47, 0, invalid_bmp, 35, 45, 1);
      oledDisplayCenter("Communication error", 0, 60);
      display.display();
      digitalWrite (Buzzer, HIGH); //turn buzzer on
      delay(500);
      digitalWrite (Buzzer, LOW); //turn buzzer on
      delay(500);
      digitalWrite (Buzzer, HIGH); //turn buzzer on
      delay(500);
      digitalWrite (Buzzer, LOW); //turn buzzer on
      return p;
    case FINGERPRINT_FEATUREFAIL:
      Serial.println("Could not find fingerprint features");
      display.clearDisplay();
      display.setTextColor(SSD1306_WHITE);        // Draw white text
      display.drawBitmap(47, 0, invalid_bmp, 35, 45, 1);
      oledDisplayCenter("No fingerprint features", 0, 60);
      display.display();
      digitalWrite (Buzzer, HIGH); //turn buzzer on
      delay(500);
      digitalWrite (Buzzer, LOW); //turn buzzer on
      delay(500);
      digitalWrite (Buzzer, HIGH); //turn buzzer on
      delay(500);
      digitalWrite (Buzzer, LOW); //turn buzzer on
      return p;
    case FINGERPRINT_INVALIDIMAGE:
      Serial.println("Could not find fingerprint features");
      display.clearDisplay();
      display.setTextColor(SSD1306_WHITE);        // Draw white text
      display.drawBitmap(47, 0, invalid_bmp, 35, 45, 1);
      oledDisplayCenter("Imaging error", 0, 60);
      display.display();
      digitalWrite (Buzzer, HIGH); //turn buzzer on
      delay(500);
      digitalWrite (Buzzer, LOW); //turn buzzer on
      delay(500);
      digitalWrite (Buzzer, HIGH); //turn buzzer on
      delay(500);
      digitalWrite (Buzzer, LOW); //turn buzzer on
      return p;
    default:
      Serial.println("Unknown error");
      display.clearDisplay();
      display.setTextColor(SSD1306_WHITE);        // Draw white text
      display.drawBitmap(47, 0, invalid_bmp, 35, 45, 1);
      oledDisplayCenter("Unknown error", 0, 60);
      display.display();
      digitalWrite (Buzzer, HIGH); //turn buzzer on
      delay(500);
      digitalWrite (Buzzer, LOW); //turn buzzer on
      delay(500);
      digitalWrite (Buzzer, HIGH); //turn buzzer on
      delay(500);
      digitalWrite (Buzzer, LOW); //turn buzzer on
      return p;
  }

  // OK converted!
  Serial.print("Creating model for #");  Serial.println(id);

  p = finger.createModel();
  if (p == FINGERPRINT_OK) {
    Serial.println("Prints matched!");
    display.clearDisplay();
    display.setTextColor(SSD1306_WHITE);        // Draw white text
    display.drawBitmap(47, 0, ok_bmp, 35, 45, 1);
    oledDisplayCenter("Prints matched!", 0, 60);
    display.display();
    digitalWrite (Buzzer, HIGH); //turn buzzer on
    delay(500);
    digitalWrite (Buzzer, LOW); //turn buzzer on
    delay(500);
  } else if (p == FINGERPRINT_PACKETRECIEVEERR) {
    Serial.println("Communication error");
    display.clearDisplay();
    display.setTextColor(SSD1306_WHITE);        // Draw white text
    display.drawBitmap(47, 0, invalid_bmp, 35, 45, 1);
    oledDisplayCenter("Communication error", 0, 60);
    display.display();
    digitalWrite (Buzzer, HIGH); //turn buzzer on
    delay(500);
    digitalWrite (Buzzer, LOW); //turn buzzer on
    delay(500);
    digitalWrite (Buzzer, HIGH); //turn buzzer on
    delay(500);
    digitalWrite (Buzzer, LOW); //turn buzzer on
    return p;
  } else if (p == FINGERPRINT_ENROLLMISMATCH) {
    Serial.println("Fingerprints did not match");
    display.clearDisplay();
    display.setTextColor(SSD1306_WHITE);        // Draw white text
    display.drawBitmap(47, 0, invalid_bmp, 35, 45, 1);
    oledDisplayCenter("Fingerprints didn't match", 0, 60);
    display.display();
    digitalWrite (Buzzer, HIGH); //turn buzzer on
    delay(500);
    digitalWrite (Buzzer, LOW); //turn buzzer on
    delay(500);
    digitalWrite (Buzzer, HIGH); //turn buzzer on
    delay(500);
    digitalWrite (Buzzer, LOW); //turn buzzer on
    return p;
  } else {
    Serial.println("Unknown error");
    display.clearDisplay();
    display.setTextColor(SSD1306_WHITE);        // Draw white text
    display.drawBitmap(47, 0, invalid_bmp, 35, 45, 1);
    oledDisplayCenter("Unknown error", 0, 60);
    display.display();
    digitalWrite (Buzzer, HIGH); //turn buzzer on
    delay(500);
    digitalWrite (Buzzer, LOW); //turn buzzer on
    delay(500);
    digitalWrite (Buzzer, HIGH); //turn buzzer on
    delay(500);
    digitalWrite (Buzzer, LOW); //turn buzzer on
    return p;
  }

  Serial.print("ID "); Serial.println(id);
  p = finger.storeModel(id);
  if (p == FINGERPRINT_OK) {
    Serial.println("Stored!");
    display.clearDisplay();
    display.setTextColor(SSD1306_WHITE);        // Draw white text
    display.drawBitmap(47, 0, ok_bmp, 35, 45, 1);
    oledDisplayCenter("Image Stored!", 0, 60);
    display.display();
    digitalWrite (Buzzer, HIGH); //turn buzzer on
    delay(500);
    digitalWrite (Buzzer, LOW); //turn buzzer on
    delay(500);
  } else if (p == FINGERPRINT_PACKETRECIEVEERR) {
    Serial.println("Communication error");
    display.clearDisplay();
    display.setTextColor(SSD1306_WHITE);        // Draw white text
    display.drawBitmap(47, 0, invalid_bmp, 35, 45, 1);
    oledDisplayCenter("Communication error", 0, 60);
    display.display();
    digitalWrite (Buzzer, HIGH); //turn buzzer on
    delay(500);
    digitalWrite (Buzzer, LOW); //turn buzzer on
    delay(500);
    digitalWrite (Buzzer, HIGH); //turn buzzer on
    delay(500);
    digitalWrite (Buzzer, LOW); //turn buzzer on
    return p;
  } else if (p == FINGERPRINT_BADLOCATION) {
    Serial.println("Could not store in that location");
    display.clearDisplay();
    display.setTextColor(SSD1306_WHITE);        // Draw white text
    display.drawBitmap(47, 0, invalid_bmp, 35, 45, 1);
    oledDisplayCenter("Location error", 0, 60);
    display.display();
    digitalWrite (Buzzer, HIGH); //turn buzzer on
    delay(500);
    digitalWrite (Buzzer, LOW); //turn buzzer on
    delay(500);
    digitalWrite (Buzzer, HIGH); //turn buzzer on
    delay(500);
    digitalWrite (Buzzer, LOW); //turn buzzer on
    return p;
  } else if (p == FINGERPRINT_FLASHERR) {
    Serial.println("Error writing to flash");
    display.clearDisplay();
    display.setTextColor(SSD1306_WHITE);        // Draw white text
    display.drawBitmap(47, 0, invalid_bmp, 35, 45, 1);
    oledDisplayCenter("Error writing to flash", 0, 60);
    display.display();
    digitalWrite (Buzzer, HIGH); //turn buzzer on
    delay(500);
    digitalWrite (Buzzer, LOW); //turn buzzer on
    delay(500);
    digitalWrite (Buzzer, HIGH); //turn buzzer on
    delay(500);
    digitalWrite (Buzzer, LOW); //turn buzzer on
    return p;
  } else {
    Serial.println("Unknown error");
    display.clearDisplay();
    display.setTextColor(SSD1306_WHITE);        // Draw white text
    display.drawBitmap(47, 0, invalid_bmp, 35, 45, 1);
    oledDisplayCenter("Unknown error", 0, 60);
    display.display();
    digitalWrite (Buzzer, HIGH); //turn buzzer on
    delay(500);
    digitalWrite (Buzzer, LOW); //turn buzzer on
    delay(500);
    digitalWrite (Buzzer, HIGH); //turn buzzer on
    delay(500);
    digitalWrite (Buzzer, LOW); //turn buzzer on
    return p;
  }

  return true;
}


void connectwifi()
{
  if (ssid_ == "" ) {  // no ip // made it DHCP
    Serial.print("\n No wifi config found Connecting to Default Wifi ");
    Serial.println(DEFAULT_WIFI_SSID);
    WiFi.mode(WIFI_STA);
    int connectcount = 0;
    WiFi.begin(DEFAULT_WIFI_SSID, DEFAULT_WIFI_PASS);
    while (WiFi.status() != WL_CONNECTED) {
      delay(250);
      Serial.print(".");

    }
    if (WiFi.status() == WL_CONNECTED) {
      Serial.print("\n Connected. IP adress: ");
      Serial.println(WiFi.localIP());
    }
  }
  else {
    Serial.print("\n Wifi config found Connecting to  Wifi");
    WiFi.mode(WIFI_STA);
    if (dhcpcheck == "2" && ip_ != "" && gateway_ != "") {
      // fixed ip
      localIP.fromString(ip_.c_str());
      gatewayIP.fromString(gateway_.c_str());
      if (!WiFi.config(localIP, gatewayIP, subnetMask)) {
        Serial.println("STA Failed to configure");
      }

    } else {
      //dhcp
    }
    int connectcount = 0;
    WiFi.begin(ssid_.c_str(), pass_.c_str());
    while (WiFi.status() != WL_CONNECTED) {
      delay(250);
      Serial.print(".");
      connectcount++;
      if (connectcount > 50)
      {
        Serial.println("Failed to Connect to WiFi...");
        break;
      }
    }
    if (WiFi.status() == WL_CONNECTED) {
      Serial.print("\n Connected. IP adress: ");
      Serial.println(WiFi.localIP());
      if (booting == false)
      {
        String urlFinal = "https://script.google.com/macros/s/" + gsid_ + "/exec?";
        String uploadstatus = "";
        Serial.println(urlFinal);
        HTTPClient http;
        http.begin(urlFinal.c_str());
        http.setFollowRedirects(HTTPC_STRICT_FOLLOW_REDIRECTS);
        int httpCode = http.GET();
        Serial.print("HTTP Status Code: ");
        Serial.println(httpCode);
        int j = httpCode;
        http.end();
        //---------------------------------------------------------------------
        //getting response from google sheet
        String payload;
        if (j == 200) {
          offlinedataupload();
        }
        else
        {
          Serial.print("Device offline");
        }
        //---------------------------------------------------------------------


      }
    }
  }
  lastwificheck = millis();
}


void offlinedataupload()
{
  display.clearDisplay();
  display.setTextColor(SSD1306_WHITE);        // Draw white text
  oledDisplayCenter("Please Waite!!", 0, 20);
  oledDisplayCenter("Uploading Offline Data", 0, 40);
  display.display();
  int j;
  for (int i = 6; i > -1; i--)
  {

    DateTime now = rtc.now();
    int mnt, dday;
    String yr;
    if (now.month()  == 1)
    {
      mnt = 12;
    }
    else {
      mnt = now.month();
    }
    if ( now.day() < 7)
    {
      dday = 31 - (i - (now.day() - 1));
    }
    else
    {
      dday = now.day() - i;
    }
    if (now.month()  == 1 && now.day() < 7)
    {
      yr = String(now.year() - 1, DEC);
    }
    else {
      yr = String(now.year(), DEC);
    }
    String temp = "date" + String(dday) + month_name[mnt - 1] + yr;
    while (1)
    {

      String number = "1";
      String sql = "Select * from " + temp + " where uploadsts =" + number;
      int rc = db_exec1(test1_db, sql.c_str());
      if (sqlreturn != 1 || j != 200)
      {
        break;
      }
      else
      {


        sql = "Select * from " + temp + " where id =" + Sqid + " and attend ='" + sts8 + "'";
        rc = db_exec1(test1_db, sql.c_str());

        String urlFinal = "https://script.google.com/macros/s/" + gsid_ + "/exec?" + "date=" + Empid + "&time=" + Empname + "&empid=" + EmpEmail + "&empname=" + EmpPos + "&empemail=" + Empfid + "&emppos=" + sts7 + "&emppio=" + sts8;
        urlFinal.replace(" ", "%20");
        String uploadstatus = "";
        Serial.println(urlFinal);
        HTTPClient http;
        http.begin(urlFinal.c_str());
        http.setFollowRedirects(HTTPC_STRICT_FOLLOW_REDIRECTS);
        int httpCode = http.GET();
        Serial.print("HTTP Status Code: ");
        Serial.println(httpCode);
        j = httpCode;
        //---------------------------------------------------------------------
        //getting response from google sheet
        String payload;
        if (httpCode == 200) {
          sql = "update " + temp + " set uploadsts = '0' where id = " + Sqid + " and attend ='" + sts8 + "'";
          Serial.println(sql);
          rc = db_exec(test1_db, sql.c_str());
        }
        else
        {
          delay(1);
        }
        //---------------------------------------------------------------------
        http.end();

      }//
    }
  }

}
