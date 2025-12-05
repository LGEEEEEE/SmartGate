import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
// @ts-ignore
import Paho from 'paho-mqtt';
import * as Device from 'expo-device';

// --- CONFIGURAÇÕES ---
// URL copiada do seu print (sem https://)
const BROKER = 'e7ed4f597a2e4552bff29de8b6dba0d8.s1.eu.hivemq.cloud';
const PORT = 8884; // Porta WebSocket Segura (SSL)

// CORREÇÃO AQUI: Copiado do seu secrets.h
const USER = 'admin'; 
const PASS = '30cda726ABB6E6F09CC6FBF09917EF727F806AFCEBEC1724EBDBEB3AD18FBCDC';   

const TOPIC_COMMAND = 'projeto_LG/casa/portao';


const TOPIC_STATUS = 'projeto_LG/casa/portao/status';
const NOME_USUARIO = "LG Admin";

// Correção do erro TypeScript: definindo como 'any'
let client: any;

export default function App() {
  const [status, setStatus] = useState('Desconectado 🔴');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const clientID = 'app_' + Math.floor(Math.random() * 10000);
    client = new Paho.Client(BROKER, PORT, clientID);

    // Correção: adicionado (message: any)
    client.onMessageArrived = (message: any) => {
      console.log("Msg:", message.payloadString);
      if (message.destinationName === TOPIC_STATUS && message.payloadString === "ABERTO_SUCESSO") {
        Alert.alert("Sucesso ✅", "Portão confirmou abertura!");
        setStatus('Portão Aberto! 🔓');
        setTimeout(() => setStatus('Sistema Seguro Online 🔒'), 4000);
      }
    };

    // Correção: adicionado (responseObject: any)
    client.onConnectionLost = (responseObject: any) => {
      if (responseObject.errorCode !== 0) {
        setStatus('Conexão Perdida ❌');
        setIsConnected(false);
      }
    };

    client.connect({
      onSuccess: () => {
        setStatus('Sistema Seguro Online 🔒');
        setIsConnected(true);
        client.subscribe(TOPIC_STATUS);
      },
      // Correção: adicionado (e: any)
      onFailure: (e: any) => {
        setStatus('Falha Auth ⚠️');
        console.log("Erro conexão:", e);
      },
      useSSL: true,   // Criptografia ON
      userName: USER, // Autenticação ON
      password: PASS
    });
  }, []);

  const handleOpenGate = () => {
    if (isConnected) {
      const modeloCelular = Device.modelName || "Desconhecido";
      const payload = `ABRIR_PORTAO_AGORA|${NOME_USUARIO}|${modeloCelular}`;

      const message = new Paho.Message(payload);
      message.destinationName = TOPIC_COMMAND;
      client.send(message);

      setStatus('Enviando comando seguro... 🔐');
    } else {
        Alert.alert("Erro", "App desconectado");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Smart Gate Pro 🛡️</Text>
      <Text style={styles.subHeader}>Usuário: {NOME_USUARIO}</Text>
      <Text style={styles.statusText}>{status}</Text>

      <TouchableOpacity
        style={[styles.button, !isConnected && styles.disabled]}
        onPress={handleOpenGate}
        disabled={!isConnected}
      >
        <Text style={styles.btnText}>ABRIR</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', alignItems: 'center', justifyContent: 'center' },
  header: { fontSize: 32, color: '#fff', fontWeight: 'bold' },
  subHeader: { fontSize: 16, color: '#4CAF50', marginBottom: 20, fontWeight: 'bold' },
  statusText: { color: '#ccc', marginBottom: 60, fontSize: 18 },
  button: { backgroundColor: '#4CAF50', width: 200, height: 200, borderRadius: 100, justifyContent: 'center', alignItems: 'center', elevation: 10, borderWidth: 4, borderColor: '#388E3C' },
  disabled: { backgroundColor: '#333', borderColor: '#555' },
  btnText: { color: '#fff', fontSize: 20, fontWeight: 'bold' }
});