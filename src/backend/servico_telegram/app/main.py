import os
import asyncio
import httpx
from telethon import TelegramClient, events
from datetime import datetime, timedelta
import random

# --- Configuração ---
API_ID = int(os.getenv("TELEGRAM_API_ID"))
API_HASH = os.getenv("TELEGRAM_API_HASH")
SESSION_NAME = "reevo_session"
SESSION_TIMEOUT_MINUTES = 10 

URL_SERVICO_CONTAS = "http://servico_contas:8000"
URL_SERVICO_ANALISE = "http://servico_analise_credito:8000"

user_sessions = {}
client = TelegramClient(SESSION_NAME, API_ID, API_HASH)

# --- Função Auxiliar ---
def calcular_parcela_simples(valor, prazo, taxa_anual):
    taxa_mensal = (taxa_anual / 100) / 12
    if taxa_mensal == 0:
        return valor / prazo
    parcela = valor * (taxa_mensal * ((1 + taxa_mensal)**prazo)) / (((1 + taxa_mensal)**prazo) - 1)
    return parcela

def get_score_numerico(score_letra: str) -> int:
    """ Mapeia a letra do score para um número representativo. """
    mapeamento = {"A": 850, "B": 720, "C": 650, "D": 580, "E": 500}
    return mapeamento.get(score_letra, 0)


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

    # --- INÍCIO DA CONVERSA ---
    if not current_state:
        if text.lower().startswith('/'): return
        
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
        user_sessions[chat_id]["nome_completo"] = text; user_sessions[chat_id]["state"] = "AGUARDANDO_EMAIL_CADASTRO"
        await event.respond("Agora, seu **melhor email**.")
        return
    if current_state == "AGUARDANDO_EMAIL_CADASTRO":
        user_sessions[chat_id]["email"] = text.lower(); user_sessions[chat_id]["state"] = "AGUARDANDO_SENHA_CADASTRO"
        await event.respond("Crie uma **senha forte** (mínimo 8 caracteres).")
        return
    if current_state == "AGUARDANDO_SENHA_CADASTRO":
        user_sessions[chat_id]["senha"] = text; user_sessions[chat_id]["state"] = "AGUARDANDO_CPF_CADASTRO"
        await event.respond("Qual o seu **CPF** (apenas números)?")
        return
    if current_state == "AGUARDANDO_CPF_CADASTRO":
        user_sessions[chat_id]["cpf"] = text; user_sessions[chat_id]["state"] = "AGUARDANDO_CELULAR_CADASTRO"
        await event.respond("E para finalizar, seu **número de celular** com DDD.")
        return
    if current_state == "AGUARDANDO_CELULAR_CADASTRO":
        user_sessions[chat_id]["celular"] = text; user_sessions[chat_id]["state"] = "PROCESSANDO_CADASTRO"
        await event.respond("Perfeito! Criando seu cadastro...")
        payload = {
            "nome_completo": state_info["nome_completo"], "email": state_info["email"], "senha": state_info["senha"],
            "cpf": state_info["cpf"], "celular": state_info["celular"], "perfil": "AGRICULTOR"
        }
        async with httpx.AsyncClient() as http_client:
            try:
                response = await http_client.post(f"{URL_SERVICO_CONTAS}/signup", json=payload)
                if response.status_code == 201:
                    await event.respond("✅ **Cadastro realizado!**\n\nVamos fazer seu primeiro login. Por favor, **responda com a senha** que você acabou de criar.")
                    user_sessions[chat_id]["state"] = "AGUARDANDO_SENHA_LOGIN"
                else:
                    await event.respond(f"❌ Ops! Erro no cadastro: {response.json().get('detail')}. Use /cancelar para recomeçar.")
                    del user_sessions[chat_id]
            except httpx.RequestError:
                await event.respond("❌ Desculpe, não consegui me conectar à plataforma. Tente mais tarde."); del user_sessions[chat_id]
        return

    # --- FLUXO DE LOGIN ---
    if current_state == "AGUARDANDO_EMAIL_LOGIN":
        user_sessions[chat_id]["email"] = text.lower(); user_sessions[chat_id]["state"] = "AGUARDANDO_SENHA_LOGIN"
        await event.respond("Obrigado. Agora, por favor, digite sua **senha**.")
        return
    if current_state == "AGUARDANDO_SENHA_LOGIN":
        email = user_sessions[chat_id]["email"]; senha = text
        user_sessions[chat_id]["state"] = "AUTENTICANDO"
        await event.respond("Verificando suas credenciais...")
        async with httpx.AsyncClient() as http_client:
            try:
                response = await http_client.post(f"{URL_SERVICO_CONTAS}/login", data={"username": email, "password": senha})
                if response.status_code == 200:
                    token = response.json()["access_token"]; user_sessions[chat_id]["token"] = token
                    user_sessions[chat_id]["state"] = "LOGADO"
                    await event.respond(
                        "✅ **Login realizado com sucesso!**\n\n"
                        "O que você gostaria de fazer agora? **Responda com o número**:\n\n"
                        "**1.** 🧐 Iniciar nova análise de crédito\n"
                        "**2.** 📊 Ver status dos meus empréstimos\n"
                        "**3.** 📈 Ver meu score\n"
                        "**4.** 🚪 Sair"
                    )
                else:
                    await event.respond("❌ Ops! Email ou senha incorretos. Use /cancelar para recomeçar."); del user_sessions[chat_id]
            except httpx.RequestError:
                await event.respond("❌ Desculpe, não consegui me conectar à plataforma. Use /cancelar para recomeçar."); del user_sessions[chat_id]
        return

    # --- FLUXO DE CONFIRMAÇÃO DE SAÍDA ---
    if current_state == "AGUARDANDO_CONFIRMACAO_SAIR":
        if text.lower() in ['sim', 's', '4']:
            del user_sessions[chat_id]
            await event.respond("Sessão encerrada com segurança. 👋 Até a próxima!")
        else:
            user_sessions[chat_id]["state"] = "LOGADO"
            await event.respond("Ok, sua sessão continua ativa. O que deseja fazer?\n\n**1.** 🧐 Iniciar nova análise\n**2.** 📊 Ver status\n**3.** 📈 Ver score\n**4.** 🚪 Sair")
        return

    # --- FLUXO PÓS-LOGIN ---
    if current_state == "LOGADO":
        if text == '1':
            user_sessions[chat_id]["state"] = "AGUARDANDO_FINALIDADE"
            await event.respond("Ótima escolha! Vamos detalhar sua solicitação.\n\nPrimeiro, qual a **finalidade** do empréstimo? (ex: Compra de insumos, maquinário)")
        elif text == '2':
            token = state_info["token"]; headers = {"Authorization": f"Bearer {token}"}
            await event.respond("Buscando o status dos seus empréstimos...")
            async with httpx.AsyncClient() as http_client:
                try:
                    response = await http_client.get(f"{URL_SERVICO_ANALISE}/analises/minhas", headers=headers)
                    if response.status_code == 200:
                        cprs = response.json()
                        if not cprs:
                            await event.respond("Você ainda não possui nenhuma solicitação de crédito.")
                        else:
                            status_emojis = {"ANALISE": "🟡 Em análise", "CAPTAÇÃO": "💸 Em captação"}
                            cprs_agrupadas = {}
                            for cpr in cprs:
                                status = cpr['status']; cprs_agrupadas.setdefault(status, []).append(cpr)
                            resposta = "💰 **Seus empréstimos em andamento:**\n"
                            for status, lista_cprs in cprs_agrupadas.items():
                                emoji_header = status_emojis.get(status, f"🔵 {status.capitalize()}")
                                resposta += f"\n{emoji_header}\n"
                                for cpr_item in lista_cprs:
                                    valor_formatado = f"R$ {cpr_item['valor_solicitado']:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")
                                    resposta += f"\n• **ID:** ...{str(cpr_item['id'])[-4:]} → {valor_formatado}"
                                    resposta += f"\n   🧮 Taxa: {cpr_item['taxa_juros_anual']:.1f}% a.a. | Prazo: {cpr_item['prazo_meses']} meses | Score: {cpr_item['score_risco']}\n"
                                    if cpr_item['status'] == 'CAPTAÇÃO':
                                        progresso_mock = random.randint(20, 95)
                                        resposta += f"   📈 Progresso: {progresso_mock}% da meta de captação atingida\n"
                            resposta += "\n\n*📊 O score indica sua avaliação de crédito — quanto mais próximo de A, melhor!*"
                            await event.respond(resposta)
                        await event.respond("\nO que mais deseja fazer?\n**1.** 🧐 Nova análise\n**2.** 📊 Ver status novamente\n**3.** 📈 Ver meu score\n**4.** 🚪 Sair")
                    else: await event.respond("❌ Não consegui buscar seus dados. Tente fazer o login novamente.")
                except httpx.RequestError: await event.respond("❌ Desculpe, não consegui me conectar à plataforma.")
        elif text == '3':
            token = state_info["token"]; headers = {"Authorization": f"Bearer {token}"}
            await event.respond("Buscando seu score mais recente...")
            async with httpx.AsyncClient() as http_client:
                try:
                    response = await http_client.get(f"{URL_SERVICO_ANALISE}/analises/meu-score", headers=headers)
                    if response.status_code == 200:
                        score_data = response.json(); score_letra = score_data['score_risco']; score_num = get_score_numerico(score_letra)
                        resposta_score = f"📈 **Seu AgroScore Mais Recente é {score_num} ({score_letra})**\n"
                        if score_data.get('sugestoes_melhora'):
                            resposta_score += "\n💡 **Sugestoões para Melhorar:**\n"; [resposta_score := resposta_score + f"- {s}\n" for s in score_data['sugestoes_melhora']]
                        await event.respond(resposta_score)
                    elif response.status_code == 404:
                        await event.respond("Você ainda não possui nenhuma análise de crédito para que eu possa mostrar um score.")
                    else: await event.respond("❌ Não consegui buscar seu score. Tente fazer o login novamente.")
                except httpx.RequestError: await event.respond("❌ Desculpe, não consegui me conectar à plataforma.")
            await event.respond("\nO que mais deseja fazer?\a\n**1.** 🧐 Nova análise\n**2.** 📊 Ver status\n**3.** 📈 Ver score novamente\n**4.** 🚪 Sair")
        elif text == '4':
            user_sessions[chat_id]["state"] = "AGUARDANDO_CONFIRMACAO_SAIR"
            await event.respond("Tem certeza que deseja sair?\n\nResponda **Sim** ou **Não**.")
        else: await event.respond("Opção inválida. Use os números **1, 2, 3 ou 4**.")
        return

    # --- FLUXO DE ANÁLISE DETALHADO ---
    if current_state == "AGUARDANDO_FINALIDADE":
        user_sessions[chat_id]["finalidade"] = text; user_sessions[chat_id]["state"] = "AGUARDANDO_HECTARES"
        await event.respond("Entendido. Quantos **hectares** sua propriedade possui?")
        return
    if current_state == "AGUARDANDO_HECTARES":
        try:
            user_sessions[chat_id]["hectares"] = int(text); user_sessions[chat_id]["state"] = "AGUARDANDO_POSSUI_CAR"
            await event.respond("Você possui o **CAR** (Cadastro Ambiental Rural)? Responda **Sim** ou **Não**.")
        except ValueError: await event.respond("Valor inválido. Por favor, digite apenas o número de hectares.")
        return
    if current_state == "AGUARDANDO_POSSUI_CAR":
        user_sessions[chat_id]["possui_car"] = (text.lower() in ['sim', 's']); user_sessions[chat_id]["state"] = "AGUARDANDO_POSSUI_CERTIFICACAO"
        await event.respond("E você possui alguma **Certificação de Gestão Ambiental e Uso Sustentável**?(ex: ISO 14001)\n\n Responda **Sim** ou **Não**.")
        return
    if current_state == "AGUARDANDO_POSSUI_CERTIFICACAO":
        user_sessions[chat_id]["possui_certificacao"] = (text.lower() in ['sim', 's']); user_sessions[chat_id]["state"] = "AGUARDANDO_VALOR"
        await event.respond("Ótimo, estamos quase lá!\n\nQual o **valor** que você deseja solicitar? (ex: 50000)")
        return
    if current_state == "AGUARDANDO_VALOR":
        try:
            user_sessions[chat_id]["valor"] = float(text); user_sessions[chat_id]["state"] = "AGUARDANDO_PRAZO"
            await event.respond("Entendido. Em quantos **meses** você gostaria de pagar? (ex: 12)")
        except ValueError: await event.respond("Valor inválido. Use /cancelar para recomeçar.")
        return
    if current_state == "AGUARDANDO_PRAZO":
        try:
            user_sessions[chat_id]["prazo"] = int(text); user_sessions[chat_id]["state"] = "AGUARDANDO_CULTURA"
            await event.respond("Ótimo. E qual é a sua principal **cultura**? (ex: Café, Soja)")
        except ValueError: await event.respond("Prazo inválido. Use /cancelar para recomeçar.")
        return
    if current_state == "AGUARDANDO_CULTURA":
        user_sessions[chat_id]["cultura"] = text
        user_sessions[chat_id]["state"] = "PROCESSANDO_ANALISE"
        await event.respond("Perfeito! Enviando todos os seus dados para nossa análise inteligente...")
        dados_analise = {
            "finalidade": state_info["finalidade"], "hectares": state_info["hectares"],
            "possui_car": state_info["possui_car"], "possui_certificacao": state_info["possui_certificacao"],
            "valor_solicitado": state_info["valor"], "prazo_meses": state_info["prazo"],
            "cultura": state_info["cultura"]
        }
        token = state_info["token"]; headers = {"Authorization": f"Bearer {token}"}
        async with httpx.AsyncClient() as http_client:
            try:
                response = await http_client.post(f"{URL_SERVICO_ANALISE}/analise", json=dados_analise, headers=headers)
                if response.status_code == 201:
                    resultado = response.json()
                    score_letra = resultado['score_risco']; score_num = get_score_numerico(score_letra)
                    resposta_score = f"📄 **Análise Concluída!**\n\nSeu AgroScore é **{score_num} ({score_letra})** com uma taxa de **{resultado['taxa_juros_anual']:.1f}%** ao ano.\n"
                    if resultado.get('pontos_positivos'):
                        resposta_score += "\n🟢 **Pontos Positivos:**\n"; [resposta_score := resposta_score + f"- {p}\n" for p in resultado['pontos_positivos']]
                    if resultado.get('sugestoes_melhora'):
                        resposta_score += "\n💡 **Sugestões para Melhorar:**\n"; [resposta_score := resposta_score + f"- {s}\n" for s in resultado['sugestoes_melhora']]
                    await event.respond(resposta_score)
                    await asyncio.sleep(1)
                    parcela_estimada = calcular_parcela_simples(resultado["valor_solicitado"], resultado["prazo_meses"], resultado["taxa_juros_anual"])
                    resposta_parcela = f"💰 **Simulação do Empréstimo:**\n\nSua parcela mensal seria de aproximadamente **R$ {parcela_estimada:,.2f}**.".replace(",", "X").replace(".", ",").replace("X", ".")
                    await event.respond(resposta_parcela)
                    user_sessions[chat_id]["state"] = "LOGADO"
                    await event.respond("\nO que mais deseja fazer?\n**1.** 🧐 Nova análise\n**2.** 📊 Ver status")
                else:
                    await event.respond(f"❌ Erro na análise (Cód: {response.status_code})."); del user_sessions[chat_id]
            except httpx.RequestError:
                await event.respond("❌ Desculpe, não consegui me conectar ao serviço de análise."); del user_sessions[chat_id]
        return

async def main():
    print("--- Iniciando o assistente Reevo (user-bot)... ---")
    await client.start()
    print("--- Assistente conectado e aguardando mensagens. ---")
    await client.run_until_disconnected()

if __name__ == '__main__':
    asyncio.run(main())