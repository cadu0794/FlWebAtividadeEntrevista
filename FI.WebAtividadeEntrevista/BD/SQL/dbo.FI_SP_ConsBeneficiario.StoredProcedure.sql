USE [E:\--PROJETOS\FI.WEBATIVIDADEENTREVISTA\FI.WEBATIVIDADEENTREVISTA\APP_DATA\BANCODEDADOS.MDF]
GO
/****** Object:  StoredProcedure [dbo].[FI_SP_ConsBeneficiario]    Script Date: 22/06/2025 23:27:29 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[FI_SP_ConsBeneficiario]
    @IdCliente BIGINT
AS
BEGIN
    SELECT CPF, NOME
    FROM BENEFICIARIOS
    WHERE IDCLIENTE = @IdCliente
END
GO
