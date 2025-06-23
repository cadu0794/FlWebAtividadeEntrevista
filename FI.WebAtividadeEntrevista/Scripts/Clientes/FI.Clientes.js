var beneficiarios = [];
var indiceEdicao = -1;

$(document).ready(function () {
    $('#CPF').mask('000.000.000-00');

    $('#formCadastro').submit(function (e) {
        e.preventDefault();

        $('#BeneficiariosJson').val(JSON.stringify(beneficiarios));

        var formData = new FormData(this);

        $.ajax({
            url: urlPost,
            method: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function (r) {
                ModalDialog("Sucesso!", r);
                $("#formCadastro")[0].reset();
                beneficiarios = [];
            },
            error: function (r) {
                if (r.status == 400)
                    ModalDialog("Erro", r.responseJSON);
                else if (r.status == 500)
                    ModalDialog("Erro", "Erro interno no servidor.");
            }
        });
    });
});

function ModalDialog(titulo, conteudoHtml, id = null) {
    var modalId = id || ('modal' + Math.random().toString().replace('.', ''));

    var html = `
    <div id="${modalId}" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                   <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                   <h4 class="modal-title">${titulo}</h4>
                </div>
                <div class="modal-body">
                    ${conteudoHtml}
                </div>
                <div class="modal-footer">
                   <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
                </div>
            </div>
        </div>
    </div>`;

    $('body').append(html);
    $('#' + modalId).modal('show');

    // Remove modal do DOM quando fechar pra não acumular
    $('#' + modalId).on('hidden.bs.modal', function () {
        $(this).remove();
        indiceEdicao = -1; // reseta edição ao fechar modal
    });

    return modalId;
}

function abrirModalBeneficiarios() {
    var html = `
        <form id="formBeneficiario">
            <div class="form-row align-items-center">
                <div class="form-group col-md-4">
                    <label for="CPF_BENEF">CPF:</label>
                    <input required type="text" class="form-control" id="CPF_BENEF" maxlength="14" placeholder="Ex.: 010.011.111-00" />
                </div>
                <div class="form-group col-md-6">
                    <label for="Nome_BENEF">Nome:</label>
                    <input required type="text" class="form-control" id="Nome_BENEF" maxlength="50" placeholder="Ex.: João" />
                </div>
                <div class="form-group col-md-2">
                    <label>&nbsp;</label>
                    <button type="button" class="btn btn-success btn-block" id="btnIncluirBenef">Incluir</button>
                </div>
            </div>
            <table class="table table-sm mt-3">
                <thead>
                    <tr><th style="width: 30%;">CPF</th><th style="width: 40%;">Nome</th><th style="width: 30%;">Ações</th></tr>
                </thead>
                <tbody id="gridBeneficiarios"></tbody>
            </table>
        </form>`;

    var modalId = 'modalBeneficiarios';
    ModalDialog('Beneficiários', html, modalId);

    var modal = $('#' + modalId);

    setTimeout(() => {
        modal.find('#CPF_BENEF').mask('000.000.000-00');

        renderizarBeneficiarios(modal);

        modal.find('#btnIncluirBenef').off('click').on('click', function () {
            if (indiceEdicao === -1) {
                incluirBeneficiario(modal);
            } else {
                salvarBeneficiarioEditado(modal);
            }
        });
    }, 200);
}

function incluirBeneficiario(modal) {
    var cpf = modal.find('#CPF_BENEF').val().trim();
    var nome = modal.find('#Nome_BENEF').val().trim();

    if (!cpf || !nome) {
        alert("CPF e Nome são obrigatórios.");
        return;
    }

    if (!validarCPF(cpf)) {
        alert("CPF inválido.");
        return;
    }

    if (beneficiarios.some(b => b.CPF === cpf)) {
        alert("Este CPF já foi adicionado.");
        return;
    }

    beneficiarios.push({ CPF: cpf, Nome: nome });

    limparFormularioBeneficiario(modal);
    renderizarBeneficiarios(modal);
}

function salvarBeneficiarioEditado(modal) {
    var cpf = modal.find('#CPF_BENEF').val().trim();
    var nome = modal.find('#Nome_BENEF').val().trim();

    if (!cpf || !nome) {
        alert("CPF e Nome são obrigatórios.");
        return;
    }

    if (!validarCPF(cpf)) {
        alert("CPF inválido.");
        return;
    }

    // Verifica se o novo CPF já existe em outro registro
    if (beneficiarios.some((b, i) => b.CPF === cpf && i !== indiceEdicao)) {
        alert("Este CPF já foi adicionado.");
        return;
    }

    beneficiarios[indiceEdicao] = { CPF: cpf, Nome: nome };
    indiceEdicao = -1;

    limparFormularioBeneficiario(modal);
    modal.find('#btnIncluirBenef').text('Incluir');

    renderizarBeneficiarios(modal);
}



function limparFormularioBeneficiario(modal) {
    modal.find('#CPF_BENEF').val('');
    modal.find('#Nome_BENEF').val('');
}

function editarBeneficiario(i) {
    indiceEdicao = i;
    var benef = beneficiarios[i];
    var modal = $('#modalBeneficiarios');

    if (!modal.length) {
        abrirModalBeneficiarios();
        setTimeout(() => {
            preencherCamposEdicao(benef);
        }, 300);
    } else {
        preencherCamposEdicao(benef);
        modal.modal('show');
    }
}

function preencherCamposEdicao(benef) {
    var modal = $('#modalBeneficiarios');
    modal.find('#CPF_BENEF').val(benef.CPF);
    modal.find('#Nome_BENEF').val(benef.Nome);
    modal.find('#btnIncluirBenef').text('Salvar');
}

function renderizarBeneficiarios(modal) {
    if (!modal) modal = $('#modalBeneficiarios');
    let tbody = modal.find('#gridBeneficiarios');
    if (tbody.length === 0) return;

    let html = '';
    beneficiarios.forEach((b, i) => {
        html += `
            <tr>
                <td>${b.CPF}</td>
                <td>${b.Nome}</td>
                <td>
                    <button type="button" class="btn btn-sm btn-primary" onclick="editarBeneficiario(${i})">Alterar</button>
                    <button type="button" class="btn btn-sm btn-primary" onclick="removerBeneficiario(${i})">Excluir</button>
                </td>
            </tr>`;
    });

    tbody.html(html);
}

function removerBeneficiario(index) {
    if (!confirm("Confirma exclusão deste beneficiário?")) return;

    beneficiarios.splice(index, 1);
    var modal = $('#modalBeneficiarios');
    renderizarBeneficiarios(modal);

    // Caso estivesse editando o mesmo item excluído, cancela edição
    if (indiceEdicao === index) {
        indiceEdicao = -1;
        limparFormularioBeneficiario(modal);
        modal.find('#CPF_BENEF').prop('disabled', false);
        modal.find('#btnIncluirBenef').text('Incluir');
    }
}

function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    let soma = 0, resto;

    for (let i = 1; i <= 9; i++)
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++)
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;

    return true;
}
