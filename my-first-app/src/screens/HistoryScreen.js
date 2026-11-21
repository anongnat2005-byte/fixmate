import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Image,
  Modal,
  Alert,
} from 'react-native';
import { s } from '../styles';
import { SEVERITIES } from '../data/mockData';
import { fetchHistory, deleteHistory, updateHistory } from '../api/history';

const sevLabel = (key) => {
  const found = SEVERITIES.find((v) => v.key === key);
  return found ? found.label : key;
};

// แสดงวันที่แบบไทย (พ.ศ.) โดยไม่พึ่ง Intl ของเครื่อง
const pad = (n) => String(n).padStart(2, '0');
const formatDate = (iso) => {
  const d = new Date(iso);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear() + 543} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())} น.`;
};

// หน้าประวัติการวิเคราะห์ (ดึงจากตาราง analysis_history ของผู้ใช้ที่ล็อกอิน)
// Read = ดึงรายการ  |  Update = แก้ไขบันทึก  |  Delete = ลบ
export default function HistoryScreen({ solutions, onOpen }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  // สถานะหน้าต่างแก้ไขบันทึก
  const [editing, setEditing] = useState(null); // item ที่กำลังแก้ไข
  const [noteText, setNoteText] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  const load = useCallback(async () => {
    try {
      setError('');
      setItems(await fetchHistory());
    } catch (e) {
      setError((e && e.message) || 'โหลดประวัติไม่สำเร็จ');
    }
  }, []);

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const confirmDelete = (item) => {
    Alert.alert('ลบรายการนี้?', 'ลบออกจากประวัติของคุณถาวร (รวมถึงรูปที่แนบ)', [
      { text: 'ยกเลิก', style: 'cancel' },
      {
        text: 'ลบ',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteHistory(item);
            setItems((list) => list.filter((x) => x.id !== item.id));
          } catch (e) {
            Alert.alert('ลบไม่สำเร็จ', (e && e.message) || 'กรุณาลองใหม่');
          }
        },
      },
    ]);
  };

  const startEdit = (item) => {
    setEditing(item);
    setNoteText(item.note || '');
  };

  const saveNote = async () => {
    setSavingNote(true);
    try {
      await updateHistory(editing.id, { note: noteText.trim() });
      setItems((list) =>
        list.map((x) => (x.id === editing.id ? { ...x, note: noteText.trim() } : x))
      );
      setEditing(null);
    } catch (e) {
      Alert.alert('บันทึกไม่สำเร็จ', (e && e.message) || 'กรุณาลองใหม่');
    } finally {
      setSavingNote(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ padding: 20 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text style={s.greet}>ประวัติการวิเคราะห์</Text>

        {loading ? (
          <ActivityIndicator style={{ marginTop: 30 }} color="#3B6EF0" />
        ) : error ? (
          <Text style={s.emptyTxt}>{error}</Text>
        ) : items.length === 0 ? (
          <Text style={s.emptyTxt}>
            ยังไม่มีประวัติ{'\n'}กด "บันทึกผลลัพธ์" ในหน้าผลการวิเคราะห์เพื่อเก็บไว้ที่นี่
          </Text>
        ) : (
          items.map((item) => {
            const sol = solutions[item.type];
            return (
              <TouchableOpacity
                key={item.id}
                style={s.historyItem}
                onPress={() => onOpen(item)}
              >
                {item.image_url ? (
                  <Image source={{ uri: item.image_url }} style={s.thumb} />
                ) : (
                  <Text style={s.historyIcon}>{sol ? sol.icon : '🛠️'}</Text>
                )}
                <View style={{ flex: 1 }}>
                  <Text style={s.historyTitle}>{sol ? sol.title : item.type}</Text>
                  <Text style={s.historySub}>
                    {item.device} · ความรุนแรง{sevLabel(item.severity)}
                  </Text>
                  {item.detail ? (
                    <Text style={s.historySub} numberOfLines={1}>
                      {item.detail}
                    </Text>
                  ) : null}
                  {item.note ? (
                    <Text style={s.historyNote} numberOfLines={2}>
                      📝 {item.note}
                    </Text>
                  ) : null}
                  <Text style={s.historyDate}>{formatDate(item.created_at)}</Text>
                </View>
                <View style={s.historyActions}>
                  <TouchableOpacity onPress={() => startEdit(item)} hitSlop={10}>
                    <Text style={s.historyEdit}>แก้ไข</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => confirmDelete(item)} hitSlop={10}>
                    <Text style={s.historyDel}>ลบ</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {/* หน้าต่างแก้ไขบันทึก (Update) */}
      <Modal
        visible={!!editing}
        transparent
        animationType="fade"
        onRequestClose={() => setEditing(null)}
      >
        <View style={s.modalBack}>
          <View style={s.modalBox}>
            <Text style={s.modalTitle}>แก้ไขบันทึก</Text>
            <TextInput
              style={s.modalInput}
              multiline
              maxLength={300}
              value={noteText}
              onChangeText={setNoteText}
              placeholder="จดบันทึกเพิ่มเติม เช่น วิธีที่แก้ได้จริง"
              placeholderTextColor="#B0B7C3"
            />
            <View style={s.modalRow}>
              <TouchableOpacity onPress={() => setEditing(null)} disabled={savingNote}>
                <Text style={s.modalCancel}>ยกเลิก</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveNote} disabled={savingNote}>
                {savingNote ? (
                  <ActivityIndicator color="#3B6EF0" />
                ) : (
                  <Text style={s.modalSave}>บันทึก</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
