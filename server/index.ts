import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { handleFormSubmissionPF, handleFormSubmissionPJ } from "./form-submission";
import { setupAdminRoutes, addCadastroToStore } from "./admin-routes";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Setup admin routes
  setupAdminRoutes(app);

  // Rota para submissão de formulário PF
  app.post('/api/submit-form-pf', async (req, res) => {
    try {
      const { data, email } = req.body;
      
      if (!data || !email) {
        return res.status(400).json({ error: 'Dados inválidos' });
      }

      const success = await handleFormSubmissionPF(data, email);
      
      if (success) {
        // Adicionar ao store do admin
        addCadastroToStore('pf', data.nomeCompleto, email, data.telefone, 'pdf-url-placeholder');
        res.json({ success: true, message: 'Formulário enviado com sucesso!' });
      } else {
        res.status(500).json({ error: 'Erro ao enviar formulário' });
      }
    } catch (error) {
      console.error('Erro na submissão PF:', error);
      res.status(500).json({ error: 'Erro ao processar formulário' });
    }
  });

  // Rota para submissão de formulário PJ
  app.post('/api/submit-form-pj', async (req, res) => {
    try {
      const { data, email } = req.body;
      
      if (!data || !email) {
        return res.status(400).json({ error: 'Dados inválidos' });
      }

      const success = await handleFormSubmissionPJ(data, email);
      
      if (success) {
        // Adicionar ao store do admin
        addCadastroToStore('pj', data.nomeCompleto, email, data.telefone, 'pdf-url-placeholder');
        res.json({ success: true, message: 'Formulário enviado com sucesso!' });
      } else {
        res.status(500).json({ error: 'Erro ao enviar formulário' });
      }
    } catch (error) {
      console.error('Erro na submissão PJ:', error);
      res.status(500).json({ error: 'Erro ao processar formulário' });
    }
  });

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
