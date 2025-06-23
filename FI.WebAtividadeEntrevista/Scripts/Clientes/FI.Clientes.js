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

function ModalDialog(titulo, texto) {
    var random = Math.random().toString().replace('.', '');
    var texto = '<div id="' + random + '" class="modal fade">                                                               ' +
        '        <div class="modal-dialog">                                                                                 ' +
        '            <div class="modal-content">                                                                            ' +
        '                <div class="modal-header">                                                                         ' +
        '                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>         ' +
        '                    <h4 class="modal-title">' + titulo + '</h4>                                                    ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-body">                                                                           ' +
        '                    <p>' + texto + '</p>                                                                           ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-footer">                                                                         ' +
        '                    <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>             ' +
        '                                                                                                                   ' +
        '                </div>                                                                                             ' +
        '            </div><!-- /.modal-content -->                                                                         ' +
        '  </div><!-- /.modal-dialog -->                                                                                    ' +
        '</div> <!-- /.modal -->                                                                                        ';

    $('body').append(texto);
    $('#' + random).modal('show');
}
function ModalDialog(titulo, texto) {
    var random = 'modal' + Math.random().toString().replace('.', '');
    var html = '<div id="' + random + '" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">                                                               ' +
        '    <div class="modal-dialog" role="document">                                                                                 ' +
        '        <div class="modal-content">                                                                            ' +
        '            <div class="modal-header">                                                                         ' +
        '               <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>         ' +
        '               <h4 class="modal-title">' + titulo + '</h4>                                                     ' +     
        '            </div>                                                                                             ' +
        '            <div class="modal-body">                                                                           ' +
        '                ' + texto + '                                                                           ' +
        '            </div>                                                                                             ' +
        '            <div class="modal-footer">                                                                         ' +
        '                <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>             ' +
        '            </div>                                                                                             ' +
        '        </div><!-- /.modal-content -->                                                                         ' +
        '    </div><!-- /.modal-dialog -->                                                                                    ' +
        '</div> <!-- /.modal -->                                                                                        ';

    $('body').append(html);
    $('#' + random).modal('show');

    return random;
}

function abrirModalBeneficiarios() {
    var html = `
        <form id="formBeneficiario">
            <div class="form-row align-items-center">
                <div class="form-group col-md-4">
                    <label for="CPF_BENEF">CPF:</label>
                    <input required="required" type="text" class="form-control" id="CPF_BENEF" maxlength="14" placeholder="Ex.: 010.011.111-00" />
                </div>
                <div class="form-group col-md-6">
                    <label for="Nome_BENEF">Nome:</label>
                    <input required="required" type="text" class="form-control" id="Nome_BENEF" maxlength="50" placeholder="Ex.: João" />
                </div>
                <div class="form-group col-md-2">
                    <label>&nbsp;</label> <!-- Espaço para alinhar -->
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

    var modalId = ModalDialog('Beneficiários', html);

    setTimeout(() => {
        var modal = $('#' + modalId);

        modal.find('#CPF_BENEF').mask('000.000.000-00');

        renderizarBeneficiarios(modal);

        modal.find('#btnIncluirBenef').off('click').on('click', function () {
            incluirBeneficiario(modal);
        });
    }, 200);
}

function incluirBeneficiario(modal) {
    var cpf = modal.find('#CPF_BENEF').val().trim();
    var nome = modal.find('#Nome_BENEF').val().trim();

    if (beneficiarios.some(b => b.CPF === cpf)) {
        alert("Este CPF já foi adicionado.");
        return;
    }

    if (!validarCPF(cpf)) {
        alert("CPF inválido.");
        return;
    }

    beneficiarios.push({ CPF: cpf, Nome: nome });
    renderizarBeneficiarios(modal);
    modal.find('#CPF_BENEF').val('');
    modal.find('#Nome_BENEF').val('');
}

function renderizarBeneficiarios(modal) {
    if (!modal) modal = $('body');
    let tbody = modal.find('#gridBeneficiarios');
    if (tbody.length === 0) return;

    let html = '';
    beneficiarios.forEach((b, i) => {
        html += `
            <tr>
                <td>${b.CPF}</td>
                <td>${b.Nome}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editarBeneficiario(${i})">Alterar</button>
                    <button class="btn btn-sm btn-primary" onclick="removerBeneficiario(${i}, '${modal.attr('id')}')">Excluir</button>
                </td>
            </tr>`;
    });

    tbody.html(html);
}

function removerBeneficiario(index, modalId) {
    beneficiarios.splice(index, 1);

    // Re-renderiza dentro do modal correto
    if (modalId)
        renderizarBeneficiarios($('#' + modalId));
    else
        renderizarBeneficiarios();
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
