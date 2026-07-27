import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent
} from "expo-speech-recognition";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { ReminderCard } from "./src/components/ReminderCard";
import { getDeviceContext } from "./src/lib/device";
import { getMessages } from "./src/lib/i18n";
import { cancelReminder, requestNotificationPermission, scheduleReminder } from "./src/lib/notifications";
import { parseReminder } from "./src/lib/parser";
import { loadReminders, saveReminders } from "./src/lib/storage";
import { Reminder } from "./src/types/reminder";

export default function App() {
  const device = useMemo(() => getDeviceContext(), []);
  const messages = useMemo(() => getMessages(device.locale), [device.locale]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [draft, setDraft] = useState("");
  const [listening, setListening] = useState(false);
  const [ready, setReady] = useState(false);
  const voiceCommitted = useRef(false);
  const voiceTranscript = useRef("");

  useEffect(() => {
    loadReminders().then((items) => {
      setReminders(items);
      setReady(true);
    });
    requestNotificationPermission().catch(() => undefined);
  }, []);

  useSpeechRecognitionEvent("start", () => setListening(true));
  useSpeechRecognitionEvent("end", () => {
    setListening(false);
    if (!voiceCommitted.current && voiceTranscript.current.trim()) {
      voiceCommitted.current = true;
      void addReminder(voiceTranscript.current);
    }
  });
  useSpeechRecognitionEvent("result", (event) => {
    const result = event.results[0]?.transcript;
    if (!result) return;
    voiceTranscript.current = result;
    setDraft(result);
    if (event.isFinal && !voiceCommitted.current) {
      voiceCommitted.current = true;
      void addReminder(result);
    }
  });
  useSpeechRecognitionEvent("error", (event) => {
    setListening(false);
    Alert.alert(messages.notUnderstood, event.message ?? messages.tryAgain);
  });

  useEffect(() => {
    if (ready) saveReminders(reminders).catch(() => undefined);
  }, [ready, reminders]);

  const todayCount = useMemo(
    () =>
      reminders.filter((item) => {
        if (item.completed || !item.dueAt) return false;
        return new Date(item.dueAt).toDateString() === new Date().toDateString();
      }).length,
    [reminders]
  );

  async function toggleListening() {
    try {
      if (listening) {
        ExpoSpeechRecognitionModule.stop();
        setListening(false);
        return;
      }

      const permission = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(messages.microphoneUnavailable, messages.allowMicrophone);
        return;
      }

      voiceCommitted.current = false;
      voiceTranscript.current = "";
      setDraft("");
      ExpoSpeechRecognitionModule.start({
        lang: device.locale,
        interimResults: true,
        continuous: false
      });
    } catch {
      setListening(false);
      Alert.alert(messages.microphoneUnavailable, messages.allowMicrophone);
    }
  }

  async function addReminder(text = draft) {
    if (!text.trim()) return;
    const parsed = parseReminder(text, new Date(), device.locale);
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const reminder: Reminder = {
      ...parsed,
      id,
      completed: false,
      createdAt: new Date().toISOString(),
      timeZone: device.timeZone
    };
    setReminders((current) => [reminder, ...current]);
    setDraft("");

    if (parsed.dueAt) {
      scheduleReminder(parsed.title, parsed.dueAt)
        .then((notificationId) => {
          if (!notificationId) return;
          setReminders((current) =>
            current.map((item) =>
              item.id === id ? { ...item, notificationId } : item
            )
          );
        })
        .catch(() => undefined);
    }
  }

  async function toggleReminder(id: string) {
    const selected = reminders.find((item) => item.id === id);
    if (selected && !selected.completed) await cancelReminder(selected.notificationId);
    setReminders((current) =>
      current.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.screen}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>RAPPELLE-MOI</Text>
            <Text style={styles.headline}>{messages.greeting}</Text>
            <Text style={styles.subtitle}>
              {todayCount ? `${todayCount} ${messages.active}` : messages.nothingUrgent}
            </Text>
            <Text style={styles.localInfo}>
              {device.country ? `${device.country} · ` : ""}{device.timeZone}
            </Text>
          </View>
          <View style={styles.avatar}><Text style={styles.avatarText}>B</Text></View>
        </View>

        <View style={styles.capture}>
          <Text style={styles.captureTitle}>
            {listening ? messages.listening : messages.question}
          </Text>
          <Pressable
            accessibilityLabel={listening ? "Arrêter l’écoute" : "Dicter un rappel"}
            onPress={toggleListening}
            style={[styles.mic, listening && styles.micListening]}
          >
            <Text style={styles.micIcon}>{listening ? "■" : "●"}</Text>
          </Pressable>
          <Text style={styles.example}>
            {messages.example}
          </Text>
          <View style={styles.inputRow}>
            <TextInput
              onChangeText={setDraft}
              onSubmitEditing={() => void addReminder()}
              placeholder={messages.placeholder}
              returnKeyType="done"
              style={styles.input}
              value={draft}
            />
            <Pressable
              disabled={!draft.trim()}
              onPress={() => void addReminder()}
              style={[styles.addButton, !draft.trim() && styles.addDisabled]}
            >
              <Text style={styles.addText}>{messages.add}</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>{messages.reminders}</Text>
          <Text style={styles.listCount}>{reminders.filter((item) => !item.completed).length} {messages.active}</Text>
        </View>

        <FlatList
          contentContainerStyle={styles.list}
          data={reminders}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text style={styles.empty}>{messages.empty}</Text>
          }
          renderItem={({ item }) => (
            <ReminderCard messages={messages} reminder={item} onToggle={toggleReminder} />
          )}
          showsVerticalScrollIndicator={false}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { backgroundColor: "#F4F5F8", flex: 1 },
  screen: { flex: 1, paddingHorizontal: 20, paddingTop: Platform.OS === "android" ? 38 : 10 },
  header: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  brand: { color: "#E56A43", fontSize: 12, fontWeight: "900", letterSpacing: 1.7 },
  headline: { color: "#172033", fontSize: 28, fontWeight: "900", marginTop: 4 },
  subtitle: { color: "#747B89", fontSize: 14, marginTop: 3 },
  localInfo: { color: "#A0A5AF", fontSize: 11, marginTop: 4 },
  avatar: { alignItems: "center", backgroundColor: "#172033", borderRadius: 24, height: 48, justifyContent: "center", width: 48 },
  avatarText: { color: "#FFFFFF", fontSize: 20, fontWeight: "900" },
  capture: { alignItems: "center", backgroundColor: "#FFFFFF", borderRadius: 28, padding: 22, shadowColor: "#162035", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.08, shadowRadius: 18, elevation: 3 },
  captureTitle: { color: "#172033", fontSize: 18, fontWeight: "800" },
  mic: { alignItems: "center", backgroundColor: "#E56A43", borderRadius: 44, height: 88, justifyContent: "center", marginVertical: 18, shadowColor: "#E56A43", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 14, width: 88 },
  micListening: { backgroundColor: "#172033", transform: [{ scale: 1.06 }] },
  micIcon: { color: "#FFFFFF", fontSize: 29 },
  example: { color: "#8A8F9B", fontSize: 13, fontStyle: "italic", marginBottom: 18 },
  inputRow: { flexDirection: "row", width: "100%" },
  input: { backgroundColor: "#F3F4F6", borderRadius: 14, color: "#172033", flex: 1, fontSize: 15, marginRight: 8, paddingHorizontal: 14, paddingVertical: 12 },
  addButton: { backgroundColor: "#172033", borderRadius: 14, justifyContent: "center", paddingHorizontal: 15 },
  addDisabled: { opacity: 0.3 },
  addText: { color: "#FFFFFF", fontSize: 13, fontWeight: "800" },
  listHeader: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginBottom: 12, marginTop: 24 },
  listTitle: { color: "#172033", fontSize: 20, fontWeight: "900" },
  listCount: { color: "#7C8290", fontSize: 13, fontWeight: "700" },
  list: { paddingBottom: 30 },
  empty: { color: "#858B98", fontSize: 15, paddingHorizontal: 35, paddingTop: 28, textAlign: "center" }
});
