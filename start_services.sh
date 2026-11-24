#!/bin/bash
set -e

API_DIR="/home/ifmt-aluno/Documentos/projeto_horario/api"
FRONTEND_DIR="/home/ifmt-aluno/Documentos/projeto_horario/frontend"

echo "=== Iniciando Backend (porta 5173) ==="
cd "$API_DIR"
source .venv/bin/activate
nohup python main.py > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"
sleep 2

echo "=== Verificando Backend ==="
if curl -s http://localhost:5173/api/health | grep -q "sucesso"; then
    echo "Backend OK na porta 5173"
else
    echo "Backend com problemas, verificando logs..."
    cat /tmp/backend.log
fi

echo "=== Iniciando Frontend (porta 3000) ==="
cd "$FRONTEND_DIR"
nohup npx vite --port 3000 > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"
sleep 3

echo "=== Verificando Frontend ==="
if curl -s http://localhost:3000 | grep -q "Local:"; then
    echo "Frontend OK na porta 3000"
else
    echo "Frontend com problemas, verificando logs..."
    cat /tmp/frontend.log
fi

echo "=== Todos os serviços iniciados ==="
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:5173/api/health"
echo "Documentacao: http://localhost:5173/docs"