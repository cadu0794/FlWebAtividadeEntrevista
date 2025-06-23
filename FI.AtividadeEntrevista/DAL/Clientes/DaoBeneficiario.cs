using FI.AtividadeEntrevista.DML;
using System.Collections.Generic;
using System.Data;
using System.Linq;

namespace FI.AtividadeEntrevista.DAL
{
    /// <summary>
    /// Classe de acesso a dados de Beneficiário
    /// </summary>
    internal class DaoBeneficiario : AcessoDados
    {
        /// <summary>
        /// Inclui um novo beneficiário
        /// </summary>
        /// <param name="benef">Objeto de beneficiário</param>
        internal long Incluir(DML.Beneficiario benef)
        {
            List<System.Data.SqlClient.SqlParameter> parametros = new List<System.Data.SqlClient.SqlParameter>();

            parametros.Add(new System.Data.SqlClient.SqlParameter("IdCliente", benef.IdCliente));
            parametros.Add(new System.Data.SqlClient.SqlParameter("Nome", benef.Nome));
            parametros.Add(new System.Data.SqlClient.SqlParameter("CPF", benef.CPF));

            DataSet ds = base.Consultar("FI_SP_IncBeneficiario", parametros);
            long ret = 0;
            if (ds.Tables[0].Rows.Count > 0)
                long.TryParse(ds.Tables[0].Rows[0][0].ToString(), out ret);
            return ret;
        }

        /// <summary>
        /// Exclui todos os beneficiários de um cliente
        /// </summary>
        /// <param name="idCliente">ID do cliente</param>
        internal void ExcluirPorCliente(long idCliente)
        {
            List<System.Data.SqlClient.SqlParameter> parametros = new List<System.Data.SqlClient.SqlParameter>();
            parametros.Add(new System.Data.SqlClient.SqlParameter("IdCliente", idCliente));
            base.Executar("FI_SP_DelBeneficiariosPorCliente", parametros);
        }
        /// <summary>
        /// Lista todos os beneficiários de um cliente
        /// </summary>
        /// <param name="idCliente">ID do cliente</param>
        internal List<DML.Beneficiario> ListarPorCliente(long idCliente)
        {
            List<System.Data.SqlClient.SqlParameter> parametros = new List<System.Data.SqlClient.SqlParameter>();

            parametros.Add(new System.Data.SqlClient.SqlParameter("IdCliente", idCliente));

            DataSet ds = base.Consultar("FI_SP_ConsBeneficiario", parametros);

            List<DML.Beneficiario> lista = Converter(ds);

            return lista;
        }

        private List<DML.Beneficiario> Converter(DataSet ds)
        {
            List<DML.Beneficiario> lista = new List<DML.Beneficiario>();

            if (ds != null && ds.Tables != null && ds.Tables.Count > 0)
            {
                foreach (DataRow row in ds.Tables[0].Rows)
                {
                    DML.Beneficiario b = new DML.Beneficiario();
                    b.CPF = row["CPF"].ToString();
                    b.Nome = row["Nome"].ToString();
                    // b.IdCliente = Convert.ToInt64(row["IdCliente"]);

                    lista.Add(b);
                }
            }

            return lista;
        }

        internal bool VerificarExistencia(string CPF, long ID)
        {
            List<System.Data.SqlClient.SqlParameter> parametros = new List<System.Data.SqlClient.SqlParameter>();

            parametros.Add(new System.Data.SqlClient.SqlParameter("CPF", CPF));
            parametros.Add(new System.Data.SqlClient.SqlParameter("ID", ID));

            DataSet ds = base.Consultar("FI_SP_VerificaBeneficiarios", parametros);

            return ds.Tables[0].Rows.Count > 0;
        }
    }
}