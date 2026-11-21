import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Linking,
  Alert,
} from 'react-native';
import { s } from '../styles';
import Header from '../components/Header';
import { searchSuperUser } from '../api/stackexchange';

// หน้า 8: กระทู้ที่เกี่ยวข้อง — เรียก API ภายนอก (Stack Exchange / SuperUser)
// initialQuery = คำค้นภาษาอังกฤษเริ่มต้น (แก้ไขแล้วกดค้นหาใหม่ได้)
export default function RelatedScreen({ initialQuery, onBack }) {
  const [query, setQuery] = useState(initialQuery);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const search = useCallback(async (q) => {
    if (!q.trim()) return;
    setLoading(true);
    setError('');
    try {
      setItems(await searchSuperUser(q.trim()));
    } catch (e) {
      setItems([]);
      setError((e && e.message) || 'ค้นหาไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  }, []);

  // ค้นหาอัตโนมัติ 1 ครั้งตอนเปิดหน้านี้
  useEffect(() => {
    search(initialQuery);
  }, [search, initialQuery]);

  const open = (url) =>
    Linking.openURL(url).catch(() => Alert.alert('เปิดลิงก์ไม่สำเร็จ', url));

  return (
    <View style={{ flex: 1 }}>
      <Header
        title="กระทู้ที่เกี่ยวข้อง"
        subtitle="ข้อมูลจาก SuperUser (Stack Exchange API)"
        onBack={onBack}
      />
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <TextInput
          style={s.search}
          value={query}
          onChangeText={setQuery}
          placeholder="ค้นหาเป็นภาษาอังกฤษ เช่น wifi not working"
          placeholderTextColor="#B0B7C3"
          autoCapitalize="none"
          returnKeyType="search"
          onSubmitEditing={() => search(query)}
        />
        <TouchableOpacity style={s.primaryBtn} onPress={() => search(query)}>
          <Text style={s.primaryBtnTxt}>ค้นหา</Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator style={{ marginTop: 30 }} color="#3B6EF0" />
        ) : error ? (
          <Text style={s.emptyTxt}>{error}</Text>
        ) : items.length === 0 ? (
          <Text style={s.emptyTxt}>ไม่พบกระทู้ที่เกี่ยวข้อง</Text>
        ) : (
          items.map((it) => (
            <TouchableOpacity
              key={it.id}
              style={[s.article, { marginTop: 12 }]}
              onPress={() => open(it.link)}
            >
              <Text style={s.articleTxt}>{it.title}</Text>
              <Text style={s.historySub}>
                {it.answered ? '✅ มีคำตอบ' : '❔ ยังไม่มีคำตอบที่ยอมรับ'} · {it.answers} คำตอบ · คะแนน {it.score}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}
