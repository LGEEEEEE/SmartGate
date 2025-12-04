#include <WiFi.h>
#include <PubSubClient.h>
#include "secrets.h" 

// Pino do Relé (GPIO 2 é o LED azul interno do ESP32, bom para teste)
const int PINO_RELE = 2;

WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
  Serial.begin(115200);
  
  // Configura o pino
  pinMode(PINO_RELE, OUTPUT);
  digitalWrite(PINO_RELE, LOW); // Começa desligado

  setup_wifi();
  
  // Configura o servidor MQTT
  client.setServer(MQTT_SERVER, MQTT_PORT);
  client.setCallback(callback);
}

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Conectando em: ");
  Serial.println(WIFI_SSID);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWi-Fi Conectado!");
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());
}

// --- ESSA É A PARTE IMPORTANTE (RECEBE E RESPONDE) ---
void callback(char* topic, byte* payload, unsigned int length) {
  String mensagem = "";
  for (int i = 0; i < length; i++) {
    mensagem += (char)payload[i];
  }
  
  Serial.print("Mensagem recebida: ");
  Serial.println(mensagem);

  // Se receber o comando de abrir...
  if (mensagem == "ABRIR_PORTAO_AGORA") {
    Serial.println(">>> COMANDO ACEITO! <<<");
    
    // 1. Manda a confirmação de volta para o celular (FEEDBACK)
    client.publish(MQTT_TOPIC_STATUS, "ABERTO_SUCESSO"); 

    // 2. Aciona o portão (Pulso de 1 segundo)
    digitalWrite(PINO_RELE, HIGH); 
    delay(1000);                   
    digitalWrite(PINO_RELE, LOW);  
  }
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Tentando MQTT... ");
    String clientId = "ESP32_LG_";
    clientId += String(random(0xffff), HEX);
    
    if (client.connect(clientId.c_str())) {
      Serial.println("Conectado!");
      // Assina apenas o tópico de COMANDO para escutar o celular
      client.subscribe(MQTT_TOPIC_COMMAND); 
    } else {
      Serial.print("Falha, rc=");
      Serial.print(client.state());
      Serial.println(" tentando em 5s");
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