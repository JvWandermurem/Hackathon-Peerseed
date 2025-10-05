import os
import asyncio
import httpx
from telethon import TelegramClient, events
from datetime import datetime, timedelta

# --- Configuração ---
API_ID = int(os.getenv("TELEGRAM_API_ID"))
API_HASH = os.getenv("TELEGRAM_API_HASH")
SESSION_NAME = "reevo_session"
SESSION_TIMEOUT_MINUTES = 10 # Tempo de inatividade para a sessão expirar

URL_SERVICO_CONTAS = "http://servico_contas:8000"
URL_SERVICO_ANALISE = "http://servico_analise_credito:8000"

user_sessions = {}
client = TelegramClient(SESSION_NAME, API_ID, API_HASH)

# --- Handlers de Comandos Globais ---
@client.on(events.NewMessage(pattern='/(?i)cancelar'))
async def cancelar_handler(event):
    chat_id = event.chat_id
    if chat_id in user_sessions:
        del user_sessions[chat_id]
        await event.respond("✅ Ação cancelada. Me envie qualquer mensagem para começar de novo.")
    else:
        await event.respond("Nenhuma ação em andamento para cancelar.")

@client.on(events.NewMessage(pattern='/(?i)sair'))
async def sair_handler(event):
    chat_id = event.chat_id
    if user_sessions.get(chat_id, {}).get("state") == "LOGADO":
        user_sessions[chat_id]["state"] = "AGUARDANDO_CONFIRMACAO_SAIR"
        await event.respond("Tem certeza que deseja sair? Sua sessão será encerrada.\n\nResponda **Sim** ou **Não**.")
    else:
        await event.respond("Você não está em uma sessão ativa para sair.")


# --- Handler Universal Aprimorado ---
@client.on(events.NewMessage)
async def universal_handler(event):
    if not event.is_private or event.text.lower().startswith(('/sair', '/cancelar')):
        return

    chat_id = event.chat_id
    text = event.text.strip()
    
    # --- VERIFICAÇÃO DE TIMEOUT DE SESSÃO ---
    if chat_id in user_sessions:
        last_interaction = user_sessions[chat_id].get("last_interaction", datetime.now())
        if datetime.now() - last_interaction > timedelta(minutes=SESSION_TIMEOUT_MINUTES):
            del user_sessions[chat_id]
            await event.respond("Sua sessão expirou por inatividade. Por segurança, por favor, me envie uma mensagem para começar de novo.")
            return
    if chat_id in user_sessions:
        user_sessions[chat_id]["last_interaction"] = datetime.now()

    state_info = user_sessions.get(chat_id, {})
    current_state = state_info.get("state")

    # --- Início da Conversa ---
    if not current_state:
        user_sessions[chat_id] = {"state": "AGUARDANDO_DECISAO_INICIAL", "last_interaction": datetime.now()}
        await event.respond(
            "Olá! 👋 Sou o assistente de crédito da Reevo.\n\n"
            "Você já tem uma conta conosco? Por favor, **responda com o número**:\n\n"
            "**1.** ✅ Sim, já tenho cadastro\n"
            "**2.** 🌱 Não, quero me cadastrar"
        )
        return

    # --- ESTADO PÓS-DECISÃO INICIAL ---
    if current_state == "AGUARDANDO_DECISAO_INICIAL":
        if text == '1':
            user_sessions[chat_id]["state"] = "AGUARDANDO_EMAIL_LOGIN"
            await event.respond("🔑 Entendido. Para fazer o login, por favor, qual o seu **email de cadastro**?")
        elif text == '2':
            user_sessions[chat_id]["state"] = "AGUARDANDO_NOME_CADASTRO"
            await event.respond("🌱 Ótimo! Vamos começar seu cadastro. Por favor, qual seu **nome completo**?")
        else:
            await event.respond("Opção inválida. Por favor, responda com **1** ou **2**.")
        return

    # --- FLUXO DE CADASTRO ---
    if current_state == "AGUARDANDO_NOME_CADASTRO":
        user_sessions[chat_id]["nome_completo"] = text
        user_sessions[chat_id]["state"] = "AGUARDANDO_EMAIL_CADASTRO"
        await event.respond("Agora, seu **melhor email**.")
        return
    if current_state == "AGUARDANDO_EMAIL_CADASTRO":
        user_sessions[chat_id]["email"] = text.lower()
        user_sessions[chat_id]["state"] = "AGUARDANDO_SENHA_CADASTRO"
        await event.respond("Crie uma **senha forte** (mínimo 8 caracteres).")
        return
    if current_state == "AGUARDANDO_SENHA_CADASTRO":
        user_sessions[chat_id]["senha"] = text
        user_sessions[chat_id]["state"] = "AGUARDANDO_CPF_CADASTRO"
        await event.respond("Qual o seu **CPF** (apenas números)?")
        return
    if current_state == "AGUARDANDO_CPF_CADASTRO":
        user_sessions[chat_id]["cpf"] = text
        user_sessions[chat_id]["state"] = "AGUARDANDO_CELULAR_CADASTRO"
        await event.respond("E para finalizar, seu **número de celular** com DDD.")
        return
    if current_state == "AGUARDANDO_CELULAR_CADASTRO":
        user_sessions[chat_id]["celular"] = text
        user_sessions[chat_id]["state"] = "PROCESSANDO_CADASTRO"
        await event.respond("Perfeito! Criando seu cadastro...")
        payload = {
            "nome_completo": state_info["nome_completo"], "email": state_info["email"],
            "senha": state_info["senha"], "cpf": state_info["cpf"],
            "celular": state_info["celular"], "perfil": "AGRICULTOR"
        }
        async with httpx.AsyncClient() as http_client:
            try:
                response = await http_client.post(f"{URL_SERVICO_CONTAS}/signup", json=payload)
                if response.status_code == 201:
                    await event.respond("✅ **Cadastro realizado com sucesso!**\n\nAgora, para continuar, vamos fazer seu primeiro login. Por favor, **responda com a senha** que você acabou de criar para autenticar.")
                    user_sessions[chat_id]["state"] = "AGUARDANDO_SENHA_LOGIN"
                else:
                    await event.respond(f"❌ Ops! Ocorreu um erro no cadastro: {response.json().get('detail')}. Use /cancelar para recomeçar.")
                    del user_sessions[chat_id]
            except httpx.RequestError:
                await event.respond("❌ Desculpe, não consegui me conectar à plataforma. Tente novamente mais tarde.")
                del user_sessions[chat_id]
        return

    # --- FLUXO DE LOGIN ---
    if current_state == "AGUARDANDO_EMAIL_LOGIN":
        user_sessions[chat_id]["email"] = text.lower()
        user_sessions[chat_id]["state"] = "AGUARDANDO_SENHA_LOGIN"
        await event.respond("Obrigado. Agora, por favor, digite sua **senha**.")
        return
    if current_state == "AGUARDANDO_SENHA_LOGIN":
        email = user_sessions[chat_id]["email"]
        senha = text
        user_sessions[chat_id]["state"] = "AUTENTICANDO"
        await event.respond("Verificando suas credenciais...")
        async with httpx.AsyncClient() as http_client:
            try:
                response = await http_client.post(f"{URL_SERVICO_CONTAS}/login", data={"username": email, "password": senha})
                if response.status_code == 200:
                    token = response.json()["access_token"]
                    user_sessions[chat_id]["token"] = token
                    user_sessions[chat_id]["state"] = "LOGADO"
                    # --- MENU PÓS-LOGIN ATUALIZADO ---
                    await event.respond(
                        "✅ **Login realizado com sucesso!**\n\n"
                        "O que você gostaria de fazer agora? **Responda com o número**:\n\n"
                        "**1.** 🧐 Iniciar nova análise de crédito\n"
                        "**2.** 📊 Ver status dos meus empréstimos\n"
                        "**3.** 📈 Ver meu score (em breve)\n"
                        "**4.** 🚪 Sair"
                    )
                else:
                    await event.respond("❌ Ops! Email ou senha incorretos. Use /cancelar para recomeçar.")
                    del user_sessions[chat_id]
            except httpx.RequestError:
                await event.respond("❌ Desculpe, não consegui me conectar à plataforma. Use /cancelar para recomeçar.")
                del user_sessions[chat_id]
        return

    # --- FLUXO DE CONFIRMAÇÃO DE SAÍDA ---
    if current_state == "AGUARDANDO_CONFIRMACAO_SAIR":
        if text.lower() in ['sim', 's', '4']: # Aceita '4' como confirmação de sair
            del user_sessions[chat_id]
            await event.respond("Sessão encerrada com segurança. 👋 Até a próxima!")
        else:
            user_sessions[chat_id]["state"] = "LOGADO"
            await event.respond("Ok, sua sessão continua ativa. O que deseja fazer?\n\n**1.** 🧐 Iniciar nova análise\n**2.** 📊 Ver status\n**3.** 📈 Ver score (em breve)\n**4.** 🚪 Sair")
        return

    # --- FLUXO PÓS-LOGIN (MENU ATUALIZADO) ---
    if current_state == "LOGADO":
        if text == '1':
            user_sessions[chat_id]["state"] = "AGUARDANDO_VALOR"
            await event.respond("Ótima escolha! Vamos iniciar sua análise.\n\nQual o **valor** que você deseja solicitar? (ex: 50000)")
        elif text == '2':
            token = state_info["token"]
            headers = {"Authorization": f"Bearer {token}"}
            await event.respond("Buscando o status dos seus empréstimos...")
            async with httpx.AsyncClient() as http_client:
                try:
                    response = await http_client.get(f"{URL_SERVICO_ANALISE}/analises/minhas", headers=headers)
                    if response.status_code == 200:
                        cprs = response.json()
                        if not cprs:
                            await event.respond("Você ainda não possui nenhuma solicitação de crédito.")
                        else:
                            resposta = "📄 **Aqui está o status dos seus empréstimos:**\n"
                            for cpr in cprs:
                                resposta += f"\n- **ID:** ...{str(cpr['id'])[-4:]} | **Status:** {cpr['status']} | **Score:** {cpr['score_risco']}"
                            await event.respond(resposta)
                        await event.respond("\nO que mais deseja fazer?\n**1.** 🧐 Nova análise\n**2.** 📊 Ver status novamente\n**3.** 📈 Ver score (em breve)\n**4.** 🚪 Sair")
                    else:
                        await event.respond("❌ Não consegui buscar seus dados. Tente fazer o login novamente.")
                except httpx.RequestError:
                    await event.respond("❌ Desculpe, não consegui me conectar à plataforma.")
        elif text == '3':
            await event.respond("Essa função para visualizar seu score está em desenvolvimento e chegará em breve!")
        elif text == '4':
            user_sessions[chat_id]["state"] = "AGUARDANDO_CONFIRMACAO_SAIR"
            await event.respond("Tem certeza que deseja sair? Sua sessão será encerrada.\n\nResponda **Sim** ou **Não**.")
        else:
            await event.respond("Opção inválida. Use os números **1, 2, 3 ou 4**.")
        return

    # --- FLUXO DE ANÁLISE ---
    if current_state == "AGUARDANDO_VALOR":
        # ... (código igual ao anterior)
        try:
            user_sessions[chat_id]["valor"] = float(text)
            user_sessions[chat_id]["state"] = "AGUARDANDO_PRAZO"
            await event.respond("Entendido. Em quantos **meses** você gostaria de pagar? (ex: 12)")
        except ValueError:
            await event.respond("Valor inválido. Use /cancelar para recomeçar.")
        return
    if current_state == "AGUARDANDO_PRAZO":
        # ... (código igual ao anterior)
        try:
            user_sessions[chat_id]["prazo"] = int(text)
            user_sessions[chat_id]["state"] = "AGUARDANDO_CULTURA"
            await event.respond("Ótimo. E qual é a sua principal **cultura**? (ex: Café, Soja)")
        except ValueError:
            await event.respond("Prazo inválido. Use /cancelar para recomeçar.")
        return
    if current_state == "AGUARDANDO_CULTURA":
        # ... (código igual ao anterior)
        user_sessions[chat_id]["state"] = "PROCESSANDO_ANALISE"
        await event.respond("Perfeito! Enviando seus dados para análise...")
        dados_analise = { "valor_solicitado": state_info["valor"], "prazo_meses": state_info["prazo"], "cultura": text }
        token = state_info["token"]
        headers = {"Authorization": f"Bearer {token}"}
        async with httpx.AsyncClient() as http_client:
            try:
                response = await http_client.post(f"{URL_SERVICO_ANALISE}/analise", json=dados_analise, headers=headers)
                if response.status_code == 201:
                    resultado = response.json()
                    resposta_final = ( f"📄 **Análise Concluída!**\n\nSeu AgroScore é **{resultado['score_risco']}** com uma taxa de **{resultado['taxa_juros_anual']:.1f}%** ao ano.\n\nSua proposta foi criada com status: **{resultado['status']}**." )
                    await event.respond(resposta_final)
                else:
                    await event.respond(f"❌ Erro na análise (Código: {response.status_code}).")
            except httpx.RequestError:
                await event.respond("❌ Desculpe, não consegui me conectar ao serviço de análise.")
        del user_sessions[chat_id]
        return

async def main():
    print("--- Iniciando o assistente Reevo (user-bot)... ---")
    await client.start()
    print("--- Assistente conectado e aguardando mensagens. ---")
    await client.run_until_disconnected()

if __name__ == '__main__':
    asyncio.run(main())