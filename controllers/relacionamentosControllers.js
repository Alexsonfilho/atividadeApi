const db = require("../db/models");

 
module.exports = class relacionamentos {

    // associar um único checklist a vários instrumentos
    static async associarMultiplosChePinst(req, res) {
        const { checklistId, instrumentoIds } = req.body;

        console.log("Dados brutos recebidos no body:", req.body);
        console.log("Checklist ID:", checklistId);
        console.log("Instrumento IDs:", instrumentoIds);

        try {
            const checklist = await db.Checklists.findByPk(checklistId);

            if (!checklist) {
                console.log("Checklist não encontrado.");
                return res.status(404).json({ mensagem: "Checklist não encontrado." });
            }

            console.log("Associando instrumentos...");
            await checklist.addInstrumentos(instrumentoIds);

            return res.status(200).json({
                mensagem: "Instrumentos associados ao checklist com sucesso!",
            });
        } catch (error) {
            console.error("Erro ao associar instrumentos:", error);
            return res.status(500).json({
                mensagem: "Erro ao associar instrumentos ao checklist.",
            });
        }
    }

    //associar um único instrumento a vários checklists:
    static async associarMultiploInstPche(req, res) {
        const { instrumentoId, checklistIds } = req.body; // Recebe o instrumentoId e uma lista de checklistIds

        try {
            // Verifica se o instrumento existe
            const instrumento = await db.Instrumentos.findByPk(instrumentoId);

            if (instrumento) {
                // Associa múltiplos checklists ao instrumento
                await instrumento.addChecklists(checklistIds);

                return res.status(200).json({
                    mensagem: "Associações criadas com sucesso!",
                });
            } else {
                return res.status(404).json({
                    mensagem: "Instrumento não encontrado.",
                });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                mensagem: "Erro ao criar associações.",
            });
        }
    }
}
