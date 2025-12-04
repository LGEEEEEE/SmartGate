import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
// @ts-ignore 
import Paho from 'paho-mqtt';

// --- CONFIGURAÇÕES ---
const BROKER = 'broker.hivemq.com'; 
const PORT = 8000; 
// Tópicos (Devem bater com o secrets.h)
const TOPIC_COMMAND = 'projeto_LG/casa/portao';
const TOPIC_STATUS = 'projeto_LG/casa/portao/status';

let client: any; 

export default function App() {
  const [status, setStatus] = useState('Desconectado 🔴');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const clientID = 'app_celular_' + Math.floor(Math.random() * 10000);
    client = new Paho.Client(BROKER, PORT, clientID);

    // --- AQUI O CELULAR ESCUTA O ARDUINO ---
    client.onMessageArrived = (message: any) => {
      console.log("Resposta recebida:", message.payloadString);
      
      if (message.destinationName === TOPIC_STATUS) {
        if (message.payloadString === "ABERTO_SUCESSO") {
          Alert.alert("Confirmação ✅", "O portão confirmou que abriu!");
          setStatus('Portão Aberto com Sucesso! 🔓');
          
          // Volta o status para online depois de 5 segundos
          setTimeout(() => setStatus('Sistema Online 🟢'), 5000);
        }
      }
    };

    client.onConnectionLost = (responseObject: any) => {
      if (responseObject.errorCode !== 0) {
        setStatus('Conexão Perdida ❌');
        setIsConnected(false);
      }
    };

    client.connect({
      onSuccess: () => {
        setStatus('Sistema Online 🟢');
        setIsConnected(true);
        console.log("App Conectado no MQTT!");
        // O celular precisa se inscrever no tópico de STATUS para ouvir a resposta
        client.subscribe(TOPIC_STATUS);
      },
      onFailure: (e: any) => {
        setStatus('Falha ao conectar ⚠️');
        console.log(e);
      },
      useSSL: false
    });
  }, []);

  const handleOpenGate = () => {
    if (isConnected) {
      // Envia o comando
      const message = new Paho.Message("ABRIR_PORTAO_AGORA");
      message.destinationName = TOPIC_COMMAND;
      client.send(message);
      
      // Muda status para "Enviando..."
      setStatus('Enviando comando... ⏳');
    } else {
      Alert.alert("Erro", "Sem conexão com o servidor");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Smart Gate 🏠</Text>
      
      <Text style={styles.statusText}>{status}</Text>

      <TouchableOpacity 
        style={[styles.button, !isConnected && styles.disabled]} 
        onPress={handleOpenGate}
        disabled={!isConnected}
      >
        <Text style={styles.btnText}>ABRIR PORTÃO</Text>
      </TouchableOpacity>
      
      <Text style={styles.footer}>Conectado a: {BROKER}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#121212', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  header: { 
    fontSize: 32, 
    color: '#fff', 
    fontWeight: 'bold', 
    marginBottom: 20 
  },
  statusText: { 
    color: '#ccc', 
    marginBottom: 60, 
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center'
  },
  button: { 
    backgroundColor: '#2196F3', 
    width: 200, 
    height: 200, 
    borderRadius: 100, 
    justifyContent: 'center', 
    alignItems: 'center', 
    elevation: 10,
    borderWidth: 4,
    borderColor: '#1E88E5'
  },
  disabled: { 
    backgroundColor: '#333',
    borderColor: '#555'
  },
  btnText: { 
    color: '#fff', 
    fontSize: 20, 
    fontWeight: 'bold' 
  },
  footer: {
    marginTop: 50,
    color: '#555',
    fontSize: 12
  }
});