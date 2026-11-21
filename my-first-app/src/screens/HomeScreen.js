import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { s } from '../styles';

// หน้า 2: หน้าแรก
// articles มาจากฐานข้อมูล (หรือข้อมูลจำลองถ้าเชื่อมต่อไม่ได้)
// source: 'loading' | 'database' | 'offline'
export default function HomeScreen({ articles, source, onSearch, onMode, onArticle }) {
  const [query, setQuery] = useState('');

  const cards = [
    { key: 'search', th: 'ค้นหาปัญหา', en: '(Search)', bg: '#E3F0FF' },
    { key: 'ai', th: 'AI วิเคราะห์', en: '(AI Diagnose)', bg: '#E3F0FF' },
    { key: 'scan', th: 'สแกน Error', en: '(Scan Error)', bg: '#F1E3FA' },
  ];

  return (
    <ScrollView
      contentContainerStyle={{ padding: 20 }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={s.homeTop}>
        <Text style={s.homeLogo}>
          🔧 <Text style={s.homeLogoTxt}>FixMate</Text>
        </Text>
        <TouchableOpacity
          onPress={() => Alert.alert('แจ้งเตือน', 'ยังไม่มีการแจ้งเตือนใหม่')}
        >
          <Text style={s.notify}>แจ้งเตือน</Text>
        </TouchableOpacity>
      </View>

      <Text style={s.greet}>สวัสดี!{'\n'}วันนี้มีอะไรให้ช่วย?</Text>

      <TextInput
        style={s.search}
        placeholder="ค้นหาปัญหา เช่น Wi-Fi, จอไม่ติด..."
        placeholderTextColor="#B0B7C3"
        value={query}
        onChangeText={setQuery}
        returnKeyType="search"
        onSubmitEditing={() => onSearch(query)}
      />

      <View style={s.cardRow}>
        {cards.map((c) => (
          <TouchableOpacity
            key={c.key}
            style={[s.card, { backgroundColor: c.bg }]}
            onPress={() => onMode(c.key)}
          >
            <Text style={s.cardTh}>{c.th}</Text>
            <Text style={s.cardEn}>{c.en}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={s.sectionRow}>
        <Text style={s.sectionTitle}>บทความแนะนำ</Text>
        <TouchableOpacity
          onPress={() => Alert.alert('บทความทั้งหมด', 'หน้านี้อยู่ระหว่างพัฒนา')}
        >
          <Text style={s.seeAll}>ดูทั้งหมด &gt;</Text>
        </TouchableOpacity>
      </View>

      {articles.map((a) => (
        <TouchableOpacity
          key={a.title}
          style={s.article}
          onPress={() => onArticle(a.type)}
        >
          <Text style={s.articleTxt}>{a.title}</Text>
        </TouchableOpacity>
      ))}

      <Text
        style={[
          s.statusTxt,
          source === 'database' && { color: '#16A34A' },
        ]}
      >
        {source === 'database'
          ? '● เชื่อมต่อฐานข้อมูลแล้ว'
          : source === 'loading'
          ? '● กำลังเชื่อมต่อฐานข้อมูล...'
          : '● ใช้ข้อมูลจำลอง (เชื่อมต่อฐานข้อมูลไม่ได้)'}
      </Text>
    </ScrollView>
  );
}
