using FI.AtividadeEntrevista.BLL;
using WebAtividadeEntrevista.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FI.AtividadeEntrevista.DML;
using Newtonsoft.Json;

namespace WebAtividadeEntrevista.Controllers
{
    public class ClienteController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }


        public ActionResult Incluir()
        {
            return View();
        }

        [HttpPost]
        public JsonResult Incluir(ClienteModel model)
        {
            BoCliente bo = new BoCliente();

            if (!ValidarCPF(model.CPF))
            {
                Response.StatusCode = 400;
                return Json("CPF inválido.");
            }

            if (bo.VerificarExistencia(model.CPF))
            {
                Response.StatusCode = 400;
                return Json("CPF já cadastrado.");
            }

            if (!ModelState.IsValid)
            {
                var erros = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, erros));
            }

            model.Id = bo.Incluir(new Cliente
            {
                CEP = model.CEP,
                Cidade = model.Cidade,
                Email = model.Email,
                Estado = model.Estado,
                Logradouro = model.Logradouro,
                Nacionalidade = model.Nacionalidade,
                Nome = model.Nome,
                Sobrenome = model.Sobrenome,
                Telefone = model.Telefone,
                CPF = model.CPF
            });

            if (!string.IsNullOrWhiteSpace(model.BeneficiariosJson))
            {
                var beneficiarios = JsonConvert.DeserializeObject<List<BeneficiarioModel>>(model.BeneficiariosJson);

                BoBeneficiario boBene = new BoBeneficiario();

                foreach (var b in beneficiarios)
                {
                    if (!ValidarCPF(b.CPF)) continue;

                    if (!boBene.VerificarExistencia(b.CPF, model.Id))
                    {
                        boBene.Incluir(new Beneficiario
                        {
                            CPF = b.CPF,
                            Nome = b.Nome,
                            IdCliente = model.Id
                        });
                    }
                }
            }

            return Json("Cadastro efetuado com sucesso");
        }

        [HttpPost]
        public JsonResult Alterar(ClienteModel model)
        {
            BoCliente bo = new BoCliente();

            if (!ValidarCPF(model.CPF))
            {
                Response.StatusCode = 400;
                return Json("CPF inválido.");
            }

            var clienteAtual = bo.Consultar(model.Id);

            if (clienteAtual != null && clienteAtual.CPF != model.CPF && bo.VerificarExistencia(model.CPF))
            {
                Response.StatusCode = 400;
                return Json("CPF já cadastrado.");
            }

            if (!this.ModelState.IsValid)
            {
                List<string> erros = (from item in ModelState.Values
                                      from error in item.Errors
                                      select error.ErrorMessage).ToList();

                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, erros));
            }
            else
            {
                bo.Alterar(new Cliente()
                {
                    Id = model.Id,
                    CEP = model.CEP,
                    Cidade = model.Cidade,
                    Email = model.Email,
                    Estado = model.Estado,
                    Logradouro = model.Logradouro,
                    Nacionalidade = model.Nacionalidade,
                    Nome = model.Nome,
                    Sobrenome = model.Sobrenome,
                    Telefone = model.Telefone,
                    CPF = model.CPF
                });

                if (!string.IsNullOrWhiteSpace(model.BeneficiariosJson))
                {
                    var beneficiarios = JsonConvert.DeserializeObject<List<BeneficiarioModel>>(model.BeneficiariosJson);

                    BoBeneficiario boBene = new BoBeneficiario();
                    boBene.ExcluirPorCliente(model.Id);

                    foreach (var b in beneficiarios)
                    {
                        if (!ValidarCPF(b.CPF)) continue;

                        if (!boBene.VerificarExistencia(b.CPF, model.Id))
                        {
                            boBene.Incluir(new Beneficiario
                            {
                                CPF = b.CPF,
                                Nome = b.Nome,
                                IdCliente = model.Id
                            });
                        }
                    }
                }

                return Json("Cadastro alterado com sucesso");
            }
        }

        [HttpGet]
        public ActionResult Alterar(long id)
        {
            BoCliente bo = new BoCliente();
            Cliente cliente = bo.Consultar(id);
            Models.ClienteModel model = null;

            if (cliente != null)
            {
                model = new ClienteModel()
                {
                    Id = cliente.Id,
                    CEP = cliente.CEP,
                    Cidade = cliente.Cidade,
                    Email = cliente.Email,
                    Estado = cliente.Estado,
                    Logradouro = cliente.Logradouro,
                    Nacionalidade = cliente.Nacionalidade,
                    Nome = cliente.Nome,
                    Sobrenome = cliente.Sobrenome,
                    Telefone = cliente.Telefone,
                    CPF = cliente.CPF
                };

                BoBeneficiario boBene = new BoBeneficiario();
                var beneficiarios = boBene.ListarPorCliente(id);

                if (beneficiarios != null)
                {
                    model.BeneficiariosJson = JsonConvert.SerializeObject(
                        beneficiarios.Select(b => new BeneficiarioModel
                        {
                            CPF = b.CPF,
                            Nome = b.Nome
                        })
                    );
                }
            }

            return View(model);
        }


        [HttpPost]
        public JsonResult ClienteList(int jtStartIndex = 0, int jtPageSize = 0, string jtSorting = null)
        {
            try
            {
                int qtd = 0;
                string campo = string.Empty;
                string crescente = string.Empty;
                string[] array = jtSorting.Split(' ');

                if (array.Length > 0)
                    campo = array[0];

                if (array.Length > 1)
                    crescente = array[1];

                List<Cliente> clientes = new BoCliente().Pesquisa(jtStartIndex, jtPageSize, campo, crescente.Equals("ASC", StringComparison.InvariantCultureIgnoreCase), out qtd);

                return Json(new { Result = "OK", Records = clientes, TotalRecordCount = qtd });
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }

        public static bool ValidarCPF(string cpf)
        {
            cpf = new string(cpf.Where(char.IsDigit).ToArray());
            if (cpf.Length != 11 || cpf.Distinct().Count() == 1) return false;

            for (int t = 9; t < 11; t++)
            {
                int sum = 0;
                for (int i = 0; i < t; i++)
                    sum += (cpf[i] - '0') * (t + 1 - i);

                int digit = (sum * 10) % 11;
                if (digit == 10) digit = 0;

                if ((cpf[t] - '0') != digit)
                    return false;
            }

            return true;
        }
    }
}