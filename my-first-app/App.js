import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, StatusBar, ActivityIndicator, Alert } from 'react-native';

import { s } from './src/styles';
import { supabase } from './src/lib/supabase';
import { signOut } from './src/api/auth';
import { fetchSolutions, fetchArticles } from './src/api/content';
import { saveAnalysis } from './src/api/history';
import { RESULTS, ARTICLES, SEARCH_KEYWORDS } from './src/data/mockData';

import BottomBar from './src/components/BottomBar';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AnalyzeScreen from './src/screens/AnalyzeScreen';
import ResultScreen from './src/screens/ResultScreen';
import StepsScreen from './src/screens/StepsScreen';
import RelatedScreen from './src/screens/RelatedScreen';

// ไฟล์หลัก: จัดการ session (Login), โหลดข้อมูลจากฐานข้อมูล, และสลับหน้าจอ
export default function App() {
  // ---- Login session ----
  const [session, setSession] = useState(null);
  const [booting, setBooting] = useState(true);

  // ---- หน้าจอและตัวเลือกที่ผู้ใช้เลือก ----
  const [screen, setScreen] = useState('login');
  const [mode, setMode] = useState('search');
  const [device, setDevice] = useState('คอมพิวเตอร์');
  const [type, setType] = useState('network');
  const [severity, setSeverity] = useState('mid');
  const [detail, setDetail] = useState('');
  const [image, setImage] = useState(null); // รูปที่แนบ { uri, base64 } (ยังไม่อัปโหลดจนกว่าจะกดบันทึก)
  const [historyImageUrl, setHistoryImageUrl] = useState(null); // รูปของรายการที่เปิดจากหน้าประวัติ
  const [resultOrigin, setResultOrigin] = useState('home'); // กลับจากหน้าผลลัพธ์ไปไหน

  // ---- ข้อมูลจากฐานข้อมูล (เริ่มด้วยข้อมูลจำลองเป็น fallback) ----
  const [solutions, setSolutions] = useState(RESULTS);
  const [articles, setArticles] = useState(ARTICLES);
  const [source, setSource] = useState('loading'); // loading | database | offline

  // ตรวจ session ตอนเปิดแอป และคอยฟังการ login/logout
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setBooting(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // login แล้วไปหน้า Home / logout แล้วกลับหน้า Login
  useEffect(() => {
    if (session) {
      setScreen((prev) => (prev === 'login' ? 'home' : prev));
    } else {
      setScreen('login');
    }
  }, [session]);

  // login แล้วโหลดเนื้อหาจากฐานข้อมูล
  useEffect(() => {
    if (!session) return;
    let cancelled = false;
    setSource('loading');
    Promise.all([fetchSolutions(), fetchArticles()])
      .then(([sol, art]) => {
        if (cancelled) return;
        setSolutions({ ...RESULTS, ...sol });
        if (art.length > 0) setArticles(art);
        setSource('database');
      })
      .catch(() => {
        if (!cancelled) setSource('offline');
      });
    return () => {
      cancelled = true;
    };
  }, [session]);

  const goAnalyze = (m, text = '') => {
    setMode(m);
    setDetail(text);
    setImage(null);
    setScreen('analyze');
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (e) {
      Alert.alert('ออกจากระบบไม่สำเร็จ', (e && e.message) || 'กรุณาลองใหม่');
    }
  };

  const showBottom =
    screen === 'home' || screen === 'history' || screen === 'settings';

  if (booting) {
    return (
      <SafeAreaView style={s.safe}>
        <View style={s.centerFill}>
          <ActivityIndicator size="large" color="#3B6EF0" />
        </View>
      </SafeAreaView>
    );
  }

  let content = null;
  if (screen === 'login') {
    content = <LoginScreen />;
  } else if (screen === 'home') {
    content = (
      <HomeScreen
        articles={articles}
        source={source}
        onSearch={(q) => goAnalyze('search', q)}
        onMode={(m) => goAnalyze(m)}
        onArticle={(t) => {
          setType(t);
          setSeverity('low');
          setMode('search');
          setDetail('');
          setImage(null);
          setHistoryImageUrl(null);
          setResultOrigin('home');
          setScreen('result');
        }}
      />
    );
  } else if (screen === 'history') {
    content = (
      <HistoryScreen
        solutions={solutions}
        onOpen={(item) => {
          setType(item.type);
          setSeverity(item.severity);
          setDevice(item.device);
          setImage(null);
          setHistoryImageUrl(item.image_url || null);
          setResultOrigin('history');
          setScreen('result');
        }}
      />
    );
  } else if (screen === 'settings') {
    content = (
      <SettingsScreen
        email={session && session.user ? session.user.email : ''}
        onLogout={handleLogout}
      />
    );
  } else if (screen === 'analyze') {
    content = (
      <AnalyzeScreen
        mode={mode} setMode={setMode}
        device={device} setDevice={setDevice}
        type={type} setType={setType}
        severity={severity} setSeverity={setSeverity}
        detail={detail} setDetail={setDetail}
        image={image} setImage={setImage}
        onBack={() => setScreen('home')}
        onSubmit={() => {
          setHistoryImageUrl(null);
          setResultOrigin('home');
          setScreen('result');
        }}
      />
    );
  } else if (screen === 'result') {
    content = (
      <ResultScreen
        solution={solutions[type]}
        severity={severity}
        device={device}
        alreadySaved={resultOrigin === 'history'}
        onBack={() => setScreen(resultOrigin)}
        onStart={() => setScreen('steps')}
        onRelated={() => setScreen('related')}
        imageUri={image ? image.uri : historyImageUrl}
        onSave={() => saveAnalysis({ mode, device, type, severity, detail, image })}
      />
    );
  } else if (screen === 'related') {
    content = (
      <RelatedScreen
        initialQuery={SEARCH_KEYWORDS[type] || 'windows error fix'}
        onBack={() => setScreen('result')}
      />
    );
  } else if (screen === 'steps') {
    content = (
      <StepsScreen
        solution={solutions[type]}
        onBack={() => setScreen('result')}
        onDone={() => setScreen('home')}
      />
    );
  }

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" />
      <View style={{ flex: 1 }}>{content}</View>
      {showBottom && <BottomBar active={screen} onChange={setScreen} />}
    </SafeAreaView>
  );
}
