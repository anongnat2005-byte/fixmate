// สไตล์ทั้งหมดของแอป FixMate (ใช้ร่วมกันทุกหน้า)
import { StyleSheet, Platform, StatusBar } from 'react-native';

export const BLUE = '#3B6EF0';

export const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  row: { flexDirection: 'row', gap: 8 },

  // login
  loginWrap: { flexGrow: 1, justifyContent: 'center', padding: 28 },
  logoIcon: { fontSize: 64, textAlign: 'center' },
  logoText: { fontSize: 28, fontWeight: '800', textAlign: 'center', color: '#1E2A78' },
  logoSub: { textAlign: 'center', color: '#6B7280', marginTop: 4, marginBottom: 28 },
  input: {
    borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#F9FAFB',
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 12,
  },
  loginBtn: {
    backgroundColor: '#0000F5', borderRadius: 12, paddingVertical: 14,
    alignItems: 'center', marginTop: 6,
  },
  loginBtnTxt: { color: '#fff', fontWeight: '700', fontSize: 16 },
  forgot: { textAlign: 'center', color: '#1D4ED8', marginVertical: 14, fontWeight: '600' },
  createBtn: {
    borderWidth: 2, borderColor: '#1D2BBF', borderRadius: 12,
    paddingVertical: 12, alignItems: 'center',
  },
  createBtnTxt: { color: '#1D2BBF', fontWeight: '700', fontSize: 16 },

  // home
  homeTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  homeLogo: { fontSize: 22 },
  homeLogoTxt: { fontSize: 20, fontWeight: '800', color: '#1E2A78' },
  notify: { color: '#6B7280', fontSize: 12 },
  greet: { fontSize: 24, fontWeight: '800', marginTop: 22, marginBottom: 16, color: '#111827' },
  search: {
    borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 30,
    paddingHorizontal: 18, paddingVertical: 12, backgroundColor: '#fff',
  },
  cardRow: { flexDirection: 'row', gap: 10, marginTop: 16 },
  card: { flex: 1, borderRadius: 14, paddingVertical: 18, alignItems: 'center' },
  cardTh: { fontWeight: '700', color: '#1F2937' },
  cardEn: { fontSize: 11, color: '#6B7280', marginTop: 2 },
  sectionRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginTop: 26, marginBottom: 10,
  },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: '#111827', marginTop: 4 },
  seeAll: { color: BLUE, fontSize: 12, fontWeight: '600' },
  article: {
    borderWidth: 1, borderColor: '#EEF0F4', borderRadius: 12,
    padding: 16, marginBottom: 10, backgroundColor: '#fff',
  },
  articleTxt: { color: '#1F2937' },

  // bottom bar
  bottomBar: {
    flexDirection: 'row', borderTopWidth: 1, borderColor: '#EEF0F4',
    backgroundColor: '#fff',
  },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 16 },
  tabTxt: { color: '#6B7280' },
  tabTxtActive: { color: BLUE, fontWeight: '800' },

  // header
  header: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8,
    paddingVertical: 10, borderBottomWidth: 1, borderColor: '#F1F2F6',
  },
  backBtn: { width: 40, alignItems: 'center' },
  backTxt: { fontSize: 30, color: '#111827', marginTop: -4 },
  headerTitle: { fontSize: 17, fontWeight: '800', color: '#111827' },
  headerSub: { fontSize: 11, color: '#6B7280', marginTop: 2 },

  // analyze
  modeTab: {
    flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12,
    borderWidth: 1, borderColor: '#EEF0F4', backgroundColor: '#fff',
  },
  modeTabActive: { backgroundColor: BLUE, borderColor: BLUE },
  modeTxt: { fontSize: 11, fontWeight: '600', color: '#4B5563' },
  label: { fontWeight: '800', marginTop: 20, marginBottom: 10, color: '#111827' },
  chip: {
    paddingVertical: 14, paddingHorizontal: 6, alignItems: 'center',
    justifyContent: 'center', borderRadius: 10, borderWidth: 1,
    borderColor: '#EEF0F4', backgroundColor: '#fff',
  },
  chipSelected: { backgroundColor: '#E3EEFF', borderColor: BLUE },
  chipTxt: { fontSize: 11, color: '#4B5563', textAlign: 'center', fontWeight: '600' },
  chipTxtSelected: { color: BLUE },
  chipWarn: { backgroundColor: '#FFF3DC', borderColor: '#F59E0B' },
  chipWarnTxt: { color: '#D97706' },
  textArea: {
    borderWidth: 1, borderColor: '#EEF0F4', borderRadius: 12,
    padding: 12, height: 130, backgroundColor: '#fff',
  },
  textAreaInput: { flex: 1, fontSize: 13 },
  counter: { textAlign: 'right', fontSize: 10, color: '#9CA3AF' },
  primaryBtn: {
    backgroundColor: BLUE, borderRadius: 30, paddingVertical: 15,
    alignItems: 'center', marginTop: 22,
  },
  primaryBtnTxt: { color: '#fff', fontWeight: '700', fontSize: 15 },
  outlineBtn: {
    borderWidth: 1.5, borderColor: BLUE, borderRadius: 12,
    paddingVertical: 13, alignItems: 'center', marginTop: 12,
  },
  outlineBtnTxt: { color: BLUE, fontWeight: '700' },

  // result
  resultCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16,
    borderRadius: 14, borderWidth: 1, borderColor: '#EEF0F4', marginBottom: 14,
  },
  resultIcon: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: '#EAF1FF',
    alignItems: 'center', justifyContent: 'center',
  },
  resultTitle: { fontSize: 20, fontWeight: '800', color: '#111827' },
  resultDev: { fontSize: 15, fontWeight: '700', color: '#111827' },
  resultSub: { color: '#6B7280', fontSize: 12, marginTop: 2 },
  bullet: { color: '#374151', fontSize: 13, marginTop: 6 },
  riskBox: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 14,
    padding: 14, marginTop: 16,
  },
  riskCircle: {
    width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center',
  },
  riskArrow: { color: '#fff', fontSize: 20, fontWeight: '800' },
  riskSmall: { fontSize: 12, color: '#6B7280' },
  riskLevel: { fontSize: 20, fontWeight: '800' },
  riskNote: { flex: 1, fontSize: 11, color: '#4B5563', textAlign: 'right' },
  tipBox: { backgroundColor: '#EEF0FF', borderRadius: 14, padding: 16, marginTop: 14 },
  tipTitle: { fontWeight: '800', color: '#1E2A78', marginBottom: 6 },
  tipTxt: { fontSize: 12, color: '#374151', marginTop: 4 },
  tipFoot: { fontSize: 11, color: BLUE, marginTop: 10 },

  // steps
  stepRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14,
    borderRadius: 12, borderWidth: 1, borderColor: '#EEF0F4', marginBottom: 10,
  },
  stepNum: {
    width: 30, height: 30, borderRadius: 15, backgroundColor: BLUE,
    alignItems: 'center', justifyContent: 'center',
  },
  stepNumTxt: { color: '#fff', fontWeight: '800' },
  stepTxt: { flex: 1, color: '#1F2937' },

  // ใช้ร่วมกัน
  btnDisabled: { opacity: 0.55 },
  centerFill: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  statusTxt: { textAlign: 'center', fontSize: 11, color: '#9CA3AF', marginTop: 18 },
  settingsEmail: { color: '#6B7280', marginBottom: 16 },

  // รูปภาพ
  previewImg: {
    width: '100%', height: 180, borderRadius: 12, backgroundColor: '#F3F4F6',
    marginBottom: 6,
  },
  removeImg: { color: '#EF4444', fontWeight: '700', textAlign: 'right', marginTop: 4 },
  imgBtn: {
    flex: 1, borderWidth: 1, borderColor: '#EEF0F4', borderRadius: 12,
    paddingVertical: 14, alignItems: 'center', backgroundColor: '#F9FAFB',
  },
  imgBtnTxt: { fontSize: 12, fontWeight: '600', color: '#4B5563' },
  thumb: { width: 54, height: 54, borderRadius: 10, backgroundColor: '#F3F4F6' },

  // history
  historyNote: { fontSize: 12, color: '#1E2A78', marginTop: 4, fontStyle: 'italic' },
  historyActions: { alignItems: 'flex-end', gap: 12 },
  historyEdit: { color: '#3B6EF0', fontWeight: '700', fontSize: 13 },
  modalBack: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 24,
  },
  modalBox: { backgroundColor: '#fff', borderRadius: 16, padding: 18 },
  modalTitle: { fontSize: 17, fontWeight: '800', color: '#111827', marginBottom: 10 },
  modalInput: {
    borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 12,
    height: 110, textAlignVertical: 'top',
  },
  modalRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 16, marginTop: 14 },
  modalCancel: { color: '#6B7280', fontWeight: '700', paddingVertical: 8 },
  modalSave: { color: '#3B6EF0', fontWeight: '800', paddingVertical: 8 },
  emptyTxt: { textAlign: 'center', color: '#6B7280', marginTop: 40, lineHeight: 22 },
  historyItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14,
    borderRadius: 12, borderWidth: 1, borderColor: '#EEF0F4', marginBottom: 10,
    backgroundColor: '#fff',
  },
  historyIcon: { fontSize: 26 },
  historyTitle: { fontWeight: '800', color: '#111827' },
  historySub: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  historyDate: { fontSize: 11, color: '#9CA3AF', marginTop: 4 },
  historyDel: { color: '#EF4444', fontWeight: '700', fontSize: 13 },
});
