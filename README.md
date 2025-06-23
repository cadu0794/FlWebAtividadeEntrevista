# 🧪 Teste Prático - Desenvolvedor .NET

Este projeto é a entrega do teste prático técnico solicitado pela **Função Sistemas**, com o objetivo de avaliar conhecimentos em ASP.NET MVC, C#, SQL Server e lógica de programação.

## ✅ Funcionalidades Implementadas

### 🧍 Cadastro de Cliente
- Inclusão do campo **CPF** no formulário de cadastro/edição.
- Validação do CPF:
  - Formatação com máscara (`999.999.999-99`)
  - Verificação de CPF válido (dígito verificador)
  - Restrições para CPF duplicado no banco de dados
- Campo é **obrigatório**

### 👥 Cadastro de Beneficiários
- Novo botão **“Beneficiários”** na tela de cliente
- Modal (pop-up) com formulário:
  - CPF (com máscara e validação)
  - Nome
- Grid interativo:
  - Listagem de beneficiários adicionados
  - Edição e exclusão antes do envio
- Beneficiários são persistidos **junto ao cliente** no botão **Salvar**
- Restrições:
  - Não permite CPF duplicado para o mesmo cliente

---

## 🛠️ Tecnologias Utilizadas

- ASP.NET MVC 4.8
- C#
- Entity Framework
- jQuery + Bootstrap
- SQL Server LocalDB (2019)

---
