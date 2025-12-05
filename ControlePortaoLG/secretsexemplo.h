// crie nessa pasta um arquivo secrets.h que contenha as definições abaixo
#ifndef SECRETS_H
#define SECRETS_H

// Wi-Fi (Mantive o da Estilo)
#define WIFI_SSID "Estilo_Promotora" // COLOQUE SEU SSID AQUI
#define WIFI_PASSWORD "Estilo@10"    // COLOQUE SUA SENHA AQUI

// --- CLUSTER SEGURO (HIVEMQ CLOUD) ---
// Copiei direto da sua imagem:
#define MQTT_SERVER "hivemq.cloud URL" // COLOQUE SUA URL DA HIVEMQ AQUI 
#define MQTT_PORT 8883 // Porta Segura para o ESP32 (TLS)

// ⚠️ Crie esses dados na aba "Access Management" do site da HiveMQ Cloud
#define MQTT_USER "SEU_USUARIO_AQUI" // COLOQUE SEU USUÁRIO AQUI
#define MQTT_PASS "SUA_SENHA_AQUI"  // COLOQUE SUA SENHA AQUI

#define MQTT_TOPIC_COMMAND "projeto_LG/casa/portao"
#define MQTT_TOPIC_STATUS "projeto_LG/casa/portao/status" 

#endif