#include <WiFi.h> 
#include <WiFiClientSecure.h> // Biblioteca para Criptografia
#include <PubSubClient.h>     // Biblioteca MQTT
#include "secrets.h"

// Pino D2 do ESP32 (Ligado no Relé)
const int PINO_RELE = 2;

WiFiClientSecure espClient;
PubSubClient client(espClient);

void setup() {
  Serial.begin(115200);
  pinMode(PINO_RELE, OUTPUT);
  digitalWrite(PINO_RELE, LOW);

  setup_wifi();

  // Permite conexão SSL simplificada (sem certificado manual)
  espClient.setInsecure();

  client.setServer(MQTT_SERVER, MQTT_PORT);
  client.setCallback(callback);
}

void setup_wifi() {
  delay(10);
  Serial.print("\nConectando Wi-Fi: ");
  Serial.println(WIFI_SSID);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWi-Fi Conectado!");
}

void callback(char* topic, byte* payload, unsigned int length) {
  String mensagem = "";
  for (int i = 0; i < length; i++) {
    mensagem += (char)payload[i];
  }

  Serial.print("Recebido: ");
  Serial.println(mensagem);

  // Verifica se o comando é de abrir
  if (mensagem.startsWith("ABRIR_PORTAO_AGORA")) {
    Serial.println(">>> COMANDO ACEITO <<<");

    // 1. Manda feedback seguro
    client.publish(MQTT_TOPIC_STATUS, "ABERTO_SUCESSO");

    // 2. Aciona o Relé
    digitalWrite(PINO_RELE, HIGH);
    delay(1000);
    digitalWrite(PINO_RELE, LOW);
  }
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Conectando MQTT Seguro... ");
    String clientId = "ESP32_Secure_" + String(random(0xffff), HEX);

    // Conecta com Usuário e Senha
    if (client.connect(clientId.c_str(), MQTT_USER, MQTT_PASS)) {
      Serial.println("Conectado e Seguro! 🔒");
      client.subscribe(MQTT_TOPIC_COMMAND);
    } else {
      Serial.print("Falha, rc=");
      Serial.print(client.state());
      Serial.println(" (Tentando em 5s)");
      delay(5000);
    }
  }
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
}