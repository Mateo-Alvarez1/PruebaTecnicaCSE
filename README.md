# 🤖 Zale WhatsApp Bot — Documentación Técnica

Este bot permite interactuar por WhatsApp usando la API de Meta, enviar y recibir mensajes, consultar productos, generar órdenes y obtener respuestas automáticas potenciadas por Gemini AI.



## 🧠 ¿Qué incluye este proyecto?

- Backend desarrollado en **Nest.Js**
- Base de datos en **Supabase (PostgreSQL)** o local con **Docker**
- Integración con **WhatsApp Cloud API**
- Conexión con **Gemini AI (Google)**
- Flujo conversacional personalizado
- Comandos y respuestas automatizadas



## 🛠️ Requisitos

- Node.js `>=18`
- Cuenta de Meta Developer + WhatsApp Business configurada
- Proyecto de Google con clave API para Gemini
- Cuenta de Supabase **o** Docker + PostgreSQL local
- `.env` configurado correctamente



## 🔧 Instalación y configuración local

### 1. Clonar el repositorio

```bash
git clone git@github.com:Mateo-Alvarez1/PruebaTecnicaCSE.git
cd PruebaTecnicaCSE
```

### 2. Instalar Dependencias
```bash
npm i 
```

### 3. Configurar Archivo `.env`
```bash
# API de WhatsApp
WHATSAPP_TOKEN=your_meta_whatsapp_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_VERIFY_TOKEN=any_token_you_choose

# Gemini AI (Google)
GEMINI_API_KEY=your_google_gemini_api_key

# Base de datos Supabase
DATABASE_URL=postgresql://usuario:password@db.supabase.co:5432/nombre_db

# Si querés usar DB local con Docker (opcional)
DB_PASSWORD=your_db_password
DB_USERNAME=your_db_username
DB_NAME=your_db_name
DB_PORT=5432
DB_HOST=localhost

# Puerto de tu servidor local
PORT=3000
```
### 4. Levantar Servidor Local
```bash
npm run start:dev
```
## 🐳 Base de datos local con Docker (opcional)
Si no querés usar Supabase, podés levantar una base PostgreSQL local con Docker.

### 1. Correr Docker

```bash
docker-compose up -d
```
Ya viene configurado en el archivo `docker-compose.yml.`

### 2. Variables para usar PostgreSQL local
```bash
DB_PASSWORD=your_db_password
DB_USERNAME=your_db_username
DB_NAME=your_db_name
DB_PORT=5432
DB_HOST=localhost
```

## 📞 Integración con WhatsApp Cloud API

1. Ingresá a [Meta for Developers](https://developers.facebook.com/)
2. Creá una App tipo "Negocio"
3. Activá la API de WhatsApp y obtené:
   - Token de acceso (`WHATSAPP_TOKEN`)
   - ID del número (`WHATSAPP_PHONE_NUMBER_ID`)
     
4. Configurá el Webhook:
   - URL: `https://<tu_ngrok_o_tunel>/webhook`
   - Verificación: el `WHATSAPP_VERIFY_TOKEN` que definas



## 🤖 Gemini AI
El bot usa Gemini para procesar algunos comandos con lenguaje natural

   1. Creá un proyecto en [Google AI Studio](https://aistudio.google.com/prompts/new_chat)
   2. Obtené tu `API_KEY`
   3. Pegalo en `.env` como `GEMINI_API_KEY`


## 🚀 Flujo conversacional básico

El bot soporta comandos como:

    - Hola → respuesta de bienvenida
    - Quiero ver productos → listado desde la base
    - Crear orden → ingreso de datos y respuesta
    - Ver estado de orden → consulta por ID
    - Frases genéricas → procesadas por Gemini
















