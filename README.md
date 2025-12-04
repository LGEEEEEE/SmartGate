# 🏠 Smart Gate IoT

![Status](https://img.shields.io/badge/Status-Concluído-success)
![Hardware](https://img.shields.io/badge/Hardware-ESP32-blue)
![Mobile](https://img.shields.io/badge/Mobile-React%20Native-61dafb)
![Protocol](https://img.shields.io/badge/Protocol-MQTT-orange)

Projeto de automação residencial **Full Stack IoT** desenvolvido para controlar portões eletrônicos via Wi-Fi.

O sistema consiste em um hardware embarcado (ESP32) conectado à placa do portão e um aplicativo mobile (React Native) que permite o acionamento remoto, recebimento de feedback em tempo real e identificação do usuário/dispositivo.

---

## 🚀 Funcionalidades

- 📲 **Acionamento Remoto:** Abra o portão de qualquer lugar com conexão à internet.
- 🔄 **Feedback em Tempo Real:** O aplicativo confirma visualmente e vibra quando o portão realmente recebeu o comando.
- 🆔 **Identificação de Acesso:** O sistema registra quem enviou o comando (Nome do Usuário) e qual modelo de celular foi utilizado.
- 🛡️ **Segurança:** Atua diretamente na botoeira da placa (contato seco), evitando problemas de clonagem ou incompatibilidade com sistemas *Rolling Code*.

---

## 🛠️ Tecnologias Utilizadas

### Hardware
- **Microcontrolador:** ESP32 (Modelo DOIT DEVKIT V1)
- **Atuador:** Módulo Relé 5V (1 Canal)
- **IDE:** Arduino IDE (C++)
- **Bibliotecas:** `PubSubClient`, `WiFi.h`

### Mobile App
- **Framework:** React Native (Expo)
- **Linguagem:** TypeScript / JavaScript
- **Comunicação:** MQTT via WebSockets
- **Bibliotecas:** `paho-mqtt`, `expo-device`

### Backend / Nuvem
- **Broker MQTT:** HiveMQ (Public Broker para testes)

---

## 🔌 Esquema de Ligação (Hardware)

Para montar o circuito, siga a pinagem abaixo entre o ESP32 e o Módulo Relé:

| Pino ESP32 | Pino Relé | Descrição |
| :--- | :--- | :--- |
| **VIN** (ou 5V) | **VCC** | Alimentação |
| **GND** | **GND** | Aterramento |
| **D2** (GPIO 2) | **IN** | Sinal de Controle |

> **Na Placa do Portão:** Conecte as saídas **COM** e **NO** (Normally Open) do Relé aos bornes de **Botoeira (BOT)** e **GND** da placa do motor.

---

## ⚙️ Instalação e Configuração

Siga os passos abaixo para rodar o projeto localmente.

### Pré-requisitos
- Node.js instalado.
- Arduino IDE configurada para ESP32.
- Git.

### 1. Clonar o Repositório
```bash
git clone [https://github.com/SEU_USUARIO/SmartGate.git](https://github.com/SEU_USUARIO/SmartGate.git)
cd SmartGate
2. Configurar o Hardware (ESP32)
Abra a pasta ControlePortaoLG na Arduino IDE.

Instale a biblioteca PubSubClient (por Nick O'Leary) no Gerenciador de Bibliotecas.

IMPORTANTE: Crie um arquivo chamado secrets.h dentro da pasta ControlePortaoLG. Este arquivo é ignorado pelo Git por segurança. Cole o seguinte conteúdo nele:

C++

#ifndef SECRETS_H
#define SECRETS_H

// 📶 Suas Credenciais Wi-Fi
#define WIFI_SSID "NOME_DA_SUA_REDE"
#define WIFI_PASSWORD "SUA_SENHA_WIFI"

// ☁️ Configurações MQTT (Broker)
#define MQTT_SERVER "broker.hivemq.com"
#define MQTT_PORT 1883 
#define MQTT_TOPIC_COMMAND "projeto_LG/casa/portao"
#define MQTT_TOPIC_STATUS "projeto_LG/casa/portao/status" 

#endif
Conecte o ESP32 via USB e faça o upload do código.

3. Configurar o App Mobile
Entre na pasta do aplicativo:

Bash

cd AppPortao
Instale as dependências:

Bash

npm install
Inicie o projeto com Expo:

Bash

npx expo start
Baixe o app Expo Go no seu celular (Android ou iOS) e escaneie o QR Code exibido no terminal.

📡 Como funciona a Comunicação
O sistema utiliza um protocolo simples baseado em strings via MQTT:

Envio (App -> Nuvem): O App envia um payload no formato: COMANDO|USUARIO|MODELO_DEVICE.

Exemplo: ABRIR_PORTAO_AGORA|João Admin|Samsung S23

Processamento (Nuvem -> ESP32): O ESP32 recebe a mensagem, valida se o comando inicia com ABRIR_PORTAO_AGORA e aciona o relé por 1 segundo (pulso).

Feedback (ESP32 -> App): Ao acionar o relé com sucesso, o ESP32 publica a mensagem ABERTO_SUCESSO no tópico de status. O App recebe e notifica o usuário.

📁 Estrutura de Pastas
Plaintext

portao/
│
├── ControlePortaoLG/       # Firmware do ESP32
│   ├── ControlePortaoLG.ino
│   └── secrets.h           # (Crie este arquivo localmente)
│
└── AppPortao/              # Aplicativo React Native
    ├── app/
    │   └── (tabs)/index.tsx
    ├── package.json
    └── ...
📝 Autor
Desenvolvido por [Seu Nome] para automação residencial e estudos de IoT.


---

### Instruções para subir no GitHub (Terminal)

O conteúdo acima é o que vai *dentro* do arquivo `README.md`.
Agora, para enviar (dar push) isso tudo para o GitHub, rode estes comandos no seu terminal, dentro da pasta `portao`:

1.  **Vá no site do GitHub**, crie um repositório novo (ex: `SmartGate`) e copie o link dele (aquele que termina em `.git`).
2.  **No terminal do seu PC:**

```bash
# Inicia o git na pasta
git init

# Adiciona todos os arquivos (o .gitignore vai impedir que o secrets.h suba)
git add .

# Salva a versão
git commit -m "Primeiro commit: Projeto Smart Gate Completo 🚀"

# Renomeia a branch principal para 'main' (padrão atual)
git branch -M main

# Conecta com o GitHub (TROQUE PELO SEU LINK)
git remote add origin https://github.com/SEU_USUARIO_AQUI/SmartGate.git

# Envia os arquivos
git push -u origin main