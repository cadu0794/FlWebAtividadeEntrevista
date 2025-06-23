using FI.AtividadeEntrevista.DAL;
using FI.AtividadeEntrevista.DML;
using System.Collections.Generic;

namespace FI.AtividadeEntrevista.BLL
{
    public class BoBeneficiario
    {
        /// <summary>
        /// Inclui beneficiários do cliente
        /// </summary>
        /// <returns></returns>
        public void Incluir(Beneficiario benef)
        {
            new DaoBeneficiario().Incluir(benef);
        }

        /// <summary>
        /// Limpa beneficiários do cliente
        /// </summary>
        /// <param name="idCliente"></param>
        /// <returns></returns>
        public void ExcluirPorCliente(long idCliente)
        {
            new DaoBeneficiario().ExcluirPorCliente(idCliente);
        }

        /// <summary>
        /// Lista beneficiários por cliente
        /// </summary>
        /// <param name="idCliente"></param>
        /// <returns></returns>
        public List<DML.Beneficiario> ListarPorCliente(long idCliente)
        {
            DAL.DaoBeneficiario dao = new DAL.DaoBeneficiario();
            return dao.ListarPorCliente(idCliente);
        }

        /// <summary>
        /// VerificaExistencia
        /// </summary>
        /// <param name="CPF"></param>
        /// <returns></returns>
        public bool VerificarExistencia(string CPF, long ID)
        {
            DAL.DaoBeneficiario cli = new DAL.DaoBeneficiario();
            return cli.VerificarExistencia(CPF, ID);
        }
    }
}